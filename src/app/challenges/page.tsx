"use client";

import { useState } from "react";
import {
  ChallengeCardHeader,
  ChallengeCardShell,
  ChallengeFeedbackSlot,
  type ChallengeFeedback,
} from "@/components/challenges/ChallengeCard";
import { Button } from "@/components/ui/Button";
import { LtrIsolate } from "@/components/ui/DirIsolate";
import { TextInput } from "@/components/ui/TextInput";
import { Toast } from "@/components/ui/Toast";
import { challenges } from "@/lib/data/mock";
import { useI18n } from "@/lib/i18n/context";
import { answersMatch } from "@/lib/normalize";
import type { Challenge, ChallengeStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ChallengesPage() {
  const { t, locale, dir } = useI18n();
  const [localStatus, setLocalStatus] = useState<Record<string, ChallengeStatus>>({});
  const [phrases, setPhrases] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, ChallengeFeedback>>({});
  const [hints, setHints] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  function statusOf(c: Challenge): ChallengeStatus {
    return localStatus[c.id] ?? c.status;
  }

  function complete(id: string) {
    setLocalStatus((s) => ({ ...s, [id]: "completed" }));
    setFeedback((f) => ({ ...f, [id]: "success" }));
    setHints((h) => ({ ...h, [id]: false }));
  }

  function submitPhrase(c: Challenge) {
    setFeedback((f) => ({ ...f, [c.id]: "validating" }));
    window.setTimeout(() => {
      if (answersMatch(phrases[c.id] || "", c.correctPhrase || "")) {
        complete(c.id);
      } else {
        setFeedback((f) => ({ ...f, [c.id]: "fail" }));
      }
    }, 220);
  }

  function submitOption(c: Challenge) {
    const selected = answers[c.id];
    if (!selected) return;
    setFeedback((f) => ({ ...f, [c.id]: "validating" }));
    window.setTimeout(() => {
      if (selected === c.correctOptionId) {
        complete(c.id);
      } else {
        setFeedback((f) => ({ ...f, [c.id]: "fail" }));
      }
    }, 220);
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <header>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
          {t.challenges.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{t.challenges.subtitle}</p>
      </header>

      <div className="space-y-3">
        {challenges.map((c) => {
          const status = statusOf(c);
          const fb = feedback[c.id] ?? "idle";
          const successMsg = t.challenges.demoSuccess.replace("{xp}", String(c.xpReward));
          const done = status === "completed";
          const isActive = status === "active";

          // Phrase value: typed answer, or completed demo phrase
          const phraseValue =
            phrases[c.id] ||
            (done ? c.correctPhrase || "" : "");

          // Option selection: local pick, or completed correct option
          const selectedOptionId =
            answers[c.id] ||
            (done && c.correctOptionId ? c.correctOptionId : "");

          return (
            <ChallengeCardShell key={c.id} challenge={c} status={status}>
              <ChallengeCardHeader challenge={c} status={status} />

              {/* Secret phrase — identical zones active ↔ completed */}
              {(isActive || done) && c.type === "secret-phrase" ? (
                <div className="challenge-zone">
                  <TextInput
                    value={phraseValue}
                    onChange={(e) => {
                      if (done) return;
                      setPhrases((p) => ({ ...p, [c.id]: e.target.value }));
                      if (fb === "fail") {
                        setFeedback((f) => ({ ...f, [c.id]: "idle" }));
                      }
                    }}
                    placeholder={t.challenges.enterPhrase}
                    dir={dir}
                    readOnly={done}
                    disabled={done}
                  />
                  <div className="challenge-action-slot">
                    <Button
                      fullWidth
                      size="sm"
                      disabled={done || fb === "validating"}
                      onClick={() => submitPhrase(c)}
                    >
                      {done
                        ? t.common.completed
                        : fb === "validating"
                          ? t.challenges.validating
                          : t.home.claimXp}
                    </Button>
                  </div>
                  <div className="challenge-hint-row">
                    {c.correctPhrase ? (
                      <button
                        type="button"
                        tabIndex={done ? -1 : 0}
                        aria-hidden={done}
                        onClick={() => {
                          if (done) return;
                          setHints((h) => ({ ...h, [c.id]: !h[c.id] }));
                        }}
                        className={cn(
                          "w-full truncate text-start text-[11px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer",
                          done && "invisible pointer-events-none"
                        )}
                      >
                        {hints[c.id] && !done ? (
                          <LtrIsolate>{c.correctPhrase}</LtrIsolate>
                        ) : (
                          t.challenges.showHint
                        )}
                      </button>
                    ) : null}
                  </div>
                  <ChallengeFeedbackSlot
                    status={status}
                    feedback={fb}
                    successMsg={successMsg}
                  />
                </div>
              ) : null}

              {/* Multiple choice — keep options after complete */}
              {(isActive || done) && c.options ? (
                <div className="challenge-zone">
                  <p className="text-[11px] font-medium text-[var(--text-muted)]">
                    {t.challenges.selectAnswer}
                  </p>
                  <div className="challenge-options">
                    {c.options.map((opt) => {
                      const chosen = selectedOptionId === opt.id;
                      const label = locale === "ar" ? opt.labelAr : opt.labelEn;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={done}
                          aria-disabled={done}
                          onClick={() => {
                            if (done) return;
                            setAnswers((a) => ({ ...a, [c.id]: opt.id }));
                            if (fb === "fail") {
                              setFeedback((f) => ({ ...f, [c.id]: "idle" }));
                            }
                          }}
                          className={cn(
                            "challenge-option",
                            chosen && "challenge-option--selected"
                          )}
                        >
                          {locale === "ar" ? (
                            <span className="min-w-0">{label}</span>
                          ) : (
                            <LtrIsolate className="min-w-0">{label}</LtrIsolate>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="challenge-action-slot">
                    <Button
                      fullWidth
                      size="sm"
                      disabled={done || !selectedOptionId || fb === "validating"}
                      onClick={() => submitOption(c)}
                    >
                      {done
                        ? t.common.completed
                        : fb === "validating"
                          ? t.challenges.validating
                          : t.challenges.checkAnswer}
                    </Button>
                  </div>
                  <ChallengeFeedbackSlot
                    status={status}
                    feedback={fb}
                    successMsg={successMsg}
                  />
                </div>
              ) : null}

              {isActive && c.type === "el-clasico" ? (
                <div className="challenge-zone">
                  <div className="challenge-action-slot">
                    <Button
                      fullWidth
                      size="sm"
                      variant="secondary"
                      onClick={() => setToast(t.productionOnly)}
                    >
                      {t.common.submit}
                    </Button>
                  </div>
                  <ChallengeFeedbackSlot
                    status={status}
                    feedback={fb}
                    successMsg={successMsg}
                  />
                </div>
              ) : null}

              {status === "locked" || status === "expired" ? (
                <div className="challenge-locked-note">
                  {status === "locked"
                    ? t.challenges.lockedHint
                    : t.challenges.expiredHint}
                </div>
              ) : null}
            </ChallengeCardShell>
          );
        })}
      </div>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
