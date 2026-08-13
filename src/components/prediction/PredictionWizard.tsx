"use client";

import { CheckCircle2, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PlayerPicker } from "@/components/prediction/PlayerPicker";
import { ScoreStepper } from "@/components/prediction/ScoreStepper";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DateTimeText } from "@/components/ui/DateTimeText";
import { LtrBlock, LtrIsolate } from "@/components/ui/DirIsolate";
import { PREDICTION_STORAGE_KEY, SCORE_MAX, SCORE_MIN } from "@/lib/constants";
import {
  clubs,
  getPlayerById,
  getPlayersForMatch,
  upcomingMatch,
} from "@/lib/data/mock";
import { useI18n } from "@/lib/i18n/context";
import type { DemoPrediction } from "@/lib/types";
import { clampScore, clubName, cn, formatScoreline, playerName } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3;

function readStored(): DemoPrediction | null {
  try {
    const raw = window.localStorage.getItem(PREDICTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoPrediction;
    return parsed?.matchId ? parsed : null;
  } catch {
    return null;
  }
}

export function PredictionWizard() {
  const { t, locale } = useI18n();
  const matchPlayers = useMemo(() => getPlayersForMatch(upcomingMatch), []);
  const home = clubs[upcomingMatch.homeClubId];
  const away = clubs[upcomingMatch.awayClubId];

  const [ready, setReady] = useState(false);
  const [submitted, setSubmitted] = useState<DemoPrediction | null>(null);
  const [step, setStep] = useState<Step>(0);
  const [homeScore, setHomeScore] = useState(2);
  const [awayScore, setAwayScore] = useState(1);
  const [firstScorer, setFirstScorer] = useState("");
  const [motm, setMotm] = useState("");

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const stored = readStored();
      if (stored?.matchId === upcomingMatch.id) {
        setSubmitted(stored);
        setHomeScore(stored.homeScore);
        setAwayScore(stored.awayScore);
        setFirstScorer(stored.firstScorerId);
        setMotm(stored.motmId);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      if (submitted) {
        window.localStorage.setItem(PREDICTION_STORAGE_KEY, JSON.stringify(submitted));
      } else {
        window.localStorage.removeItem(PREDICTION_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [submitted, ready]);

  const steps = [
    t.matches.stepScore,
    t.matches.stepScorer,
    t.matches.stepMotm,
    t.matches.stepReview,
  ];

  const first = getPlayerById(firstScorer);
  const motmPlayer = getPlayerById(motm);

  function submit() {
    setSubmitted({
      matchId: upcomingMatch.id,
      homeScore,
      awayScore,
      firstScorerId: firstScorer,
      motmId: motm,
      submittedAt: new Date().toISOString(),
    });
  }

  function reset() {
    if (submitted) {
      setHomeScore(submitted.homeScore);
      setAwayScore(submitted.awayScore);
      setFirstScorer(submitted.firstScorerId);
      setMotm(submitted.motmId);
    }
    setSubmitted(null);
    setStep(0);
  }

  if (!ready) {
    return (
      <Card className="prediction-wizard h-64 animate-pulse bg-white/5">
        <span className="sr-only">{t.common.loading}</span>
      </Card>
    );
  }

  if (submitted) {
    const scorer = getPlayerById(submitted.firstScorerId);
    const man = getPlayerById(submitted.motmId);
    return (
      <Card glow className="prediction-wizard animate-scale-in text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--pitch)]" />
        <Badge tone="success" className="mt-3">
          {t.common.demoLocal}
        </Badge>
        <h2 className="mt-3 font-display text-xl font-bold text-white">
          {t.matches.predictionSaved}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {t.matches.predictionSavedBody}
        </p>
        <div className="mt-5 rounded-2xl border border-white/8 bg-[var(--surface-2)] px-4 py-4">
          <LtrBlock className="font-display text-xl font-bold text-white sm:text-2xl">
            {formatScoreline(
              clubName(home.id, locale),
              submitted.homeScore,
              submitted.awayScore,
              clubName(away.id, locale)
            )}
          </LtrBlock>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            {t.matches.firstScorer}:{" "}
            <LtrIsolate className="font-semibold text-white">
              {scorer ? playerName(scorer, locale) : "—"}
            </LtrIsolate>
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {t.matches.manOfMatch}:{" "}
            <LtrIsolate className="font-semibold text-white">
              {man ? playerName(man, locale) : "—"}
            </LtrIsolate>
          </p>
        </div>
        <Button variant="secondary" className="mt-4" fullWidth onClick={reset}>
          {t.common.tryAgain}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="prediction-wizard overflow-hidden p-0">
      <div className="prediction-wizard-progress">
        <div className="flex gap-1.5">
          {steps.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (i < step) setStep(i as Step);
              }}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-[var(--pitch)]" : "bg-white/10",
                i < step && "cursor-pointer"
              )}
              aria-label={label}
            />
          ))}
        </div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {steps[step]}
        </p>
      </div>

      <div className="prediction-wizard-body" key={step}>
        {step === 0 ? (
          <div>
            {/* Mobile: compact dual-column score controls */}
            <div className="sm:hidden">
              <div className="score-compact">
                <CompactScoreControl
                  label={clubName(home.id, locale)}
                  value={homeScore}
                  onChange={setHomeScore}
                  accent={home.primary}
                />
                <CompactScoreControl
                  label={clubName(away.id, locale)}
                  value={awayScore}
                  onChange={setAwayScore}
                  accent={away.primary}
                />
              </div>
              <LtrBlock className="score-compact-preview">
                <LtrIsolate className="font-display text-3xl font-bold tabular-nums">
                  {homeScore}
                </LtrIsolate>
                <span className="text-lg text-[var(--text-muted)]">–</span>
                <LtrIsolate className="font-display text-3xl font-bold tabular-nums">
                  {awayScore}
                </LtrIsolate>
              </LtrBlock>
            </div>

            {/* Desktop: full steppers unchanged */}
            <div className="hidden space-y-4 sm:block">
              <div className="grid grid-cols-2 gap-3">
                <ScoreStepper
                  label={clubName(home.id, locale)}
                  value={homeScore}
                  onChange={setHomeScore}
                  accent={home.primary}
                />
                <ScoreStepper
                  label={clubName(away.id, locale)}
                  value={awayScore}
                  onChange={setAwayScore}
                  accent={away.primary}
                />
              </div>
              <LtrBlock className="flex items-center justify-center gap-4 rounded-2xl bg-[var(--surface-2)] py-5">
                <LtrIsolate className="font-display text-5xl font-bold tabular-nums">
                  {homeScore}
                </LtrIsolate>
                <span className="text-2xl text-[var(--text-muted)]">–</span>
                <LtrIsolate className="font-display text-5xl font-bold tabular-nums">
                  {awayScore}
                </LtrIsolate>
              </LtrBlock>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <PlayerPicker
            label={t.matches.firstScorer}
            players={matchPlayers}
            value={firstScorer}
            onChange={setFirstScorer}
            accent="pitch"
          />
        ) : null}

        {step === 2 ? (
          <PlayerPicker
            label={t.matches.manOfMatch}
            players={matchPlayers}
            value={motm}
            onChange={setMotm}
            accent="gold"
          />
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-white">{t.matches.reviewTitle}</h3>
            <div className="rounded-2xl border border-white/8 bg-[var(--surface-2)] p-4 text-center">
              <LtrBlock className="font-display text-xl font-bold text-white sm:text-2xl">
                {formatScoreline(
                  clubName(home.id, locale),
                  homeScore,
                  awayScore,
                  clubName(away.id, locale)
                )}
              </LtrBlock>
            </div>
            <div className="grid gap-2">
              <ReviewRow
                label={t.matches.firstScorer}
                value={first ? playerName(first, locale) : "—"}
              />
              <ReviewRow
                label={t.matches.manOfMatch}
                value={motmPlayer ? playerName(motmPlayer, locale) : "—"}
              />
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl bg-[var(--surface-2)] px-3 py-2.5">
                <span className="text-xs text-[var(--text-muted)]">{t.matches.deadline}</span>
                <DateTimeText
                  iso={upcomingMatch.predictionClosesAt}
                  locale={locale}
                  className="justify-self-end text-sm font-semibold text-white"
                />
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">{t.common.demoLocal}</p>
          </div>
        ) : null}
      </div>

      <div className="prediction-wizard-footer">
        <div className="grid grid-cols-2 gap-2">
          {step > 0 ? (
            <Button
              variant="secondary"
              onClick={() => setStep((s) => (s - 1) as Step)}
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              {t.common.back}
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              className={step === 0 ? "col-start-2" : undefined}
              disabled={(step === 1 && !firstScorer) || (step === 2 && !motm)}
              onClick={() => setStep((s) => (s + 1) as Step)}
            >
              {t.common.next}
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          ) : (
            <Button onClick={submit}>{t.matches.submitPrediction}</Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl bg-[var(--surface-2)] px-3 py-2.5">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <LtrIsolate className="justify-self-end text-sm font-semibold text-white">
        {value}
      </LtrIsolate>
    </div>
  );
}

/** Mobile-only compact team score control — side-by-side in Score step. */
function CompactScoreControl({
  label,
  value,
  onChange,
  accent,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  accent: string;
}) {
  function set(next: number) {
    onChange(clampScore(next, SCORE_MIN, SCORE_MAX));
  }

  return (
    <div className="score-compact-team">
      <p className="score-compact-team__name" title={label}>
        {label}
      </p>
      <div className="score-compact-controls">
        <button
          type="button"
          aria-label="Decrease"
          disabled={value <= SCORE_MIN}
          onClick={() => set(value - 1)}
          className="score-compact-btn"
        >
          <Minus className="h-4 w-4" />
        </button>
        <LtrIsolate
          key={value}
          className="animate-score-pop text-center font-display text-3xl font-bold tabular-nums text-white"
          style={{ textShadow: `0 0 18px ${accent}55` }}
        >
          {value}
        </LtrIsolate>
        <button
          type="button"
          aria-label="Increase"
          disabled={value >= SCORE_MAX}
          onClick={() => set(value + 1)}
          className="score-compact-btn"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
