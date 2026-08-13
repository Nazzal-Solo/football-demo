"use client";

import { History } from "lucide-react";
import { PredictionWizard } from "@/components/prediction/PredictionWizard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Countdown } from "@/components/ui/Countdown";
import { DateTimeText } from "@/components/ui/DateTimeText";
import { LtrIsolate } from "@/components/ui/DirIsolate";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { clubs, predictionHistory, upcomingMatch } from "@/lib/data/mock";
import { useI18n } from "@/lib/i18n/context";
import { clubName, formatNumber } from "@/lib/utils";

export default function MatchesPage() {
  const { t, locale } = useI18n();
  const home = clubs[upcomingMatch.homeClubId];
  const away = clubs[upcomingMatch.awayClubId];

  return (
    <div className="space-y-5 animate-fade-up">
      <header>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
          {t.matches.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{t.matches.subtitle}</p>
      </header>

      <Card padding="none" className="overflow-hidden">
        <div
          className="p-4 sm:p-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(165,0,68,0.32), rgba(8,12,22,0.5) 50%, rgba(254,190,16,0.22))",
          }}
        >
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <Badge tone="danger">
              {locale === "ar" ? upcomingMatch.tagAr : upcomingMatch.tagEn}
            </Badge>
            <DateTimeText
              iso={upcomingMatch.kickoff}
              locale={locale}
              className="text-xs text-white/65"
            />
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="text-center">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xs font-bold text-white"
                style={{ background: `linear-gradient(145deg, ${home.primary}, #111827)` }}
              >
                <LtrIsolate>
                  {locale === "ar" ? home.shortAr : home.shortEn}
                </LtrIsolate>
              </div>
              <p className="mt-2 text-sm font-semibold">{clubName(home.id, locale)}</p>
            </div>
            <div className="font-display text-2xl font-bold text-white/70">{t.common.vs}</div>
            <div className="text-center">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xs font-bold text-[#1a1400]"
                style={{ background: away.primary }}
              >
                <LtrIsolate>
                  {locale === "ar" ? away.shortAr : away.shortEn}
                </LtrIsolate>
              </div>
              <p className="mt-2 text-sm font-semibold">{clubName(away.id, locale)}</p>
            </div>
          </div>

          <p className="mt-3 text-center text-[11px] text-white/55">
            {locale === "ar" ? upcomingMatch.competitionAr : upcomingMatch.competition}
            {" · "}
            {locale === "ar" ? upcomingMatch.venueAr : upcomingMatch.venue}
          </p>

          <div className="mt-4">
            <Countdown
              targetIso={upcomingMatch.predictionClosesAt}
              label={t.matches.deadline}
              compact
            />
          </div>
        </div>
      </Card>

      <PredictionWizard />

      <section>
        <SectionHeader
          title={t.matches.history}
          action={<History className="h-4 w-4 text-[var(--text-muted)]" />}
        />
        <div className="space-y-2">
          {predictionHistory.map((item) => {
            const tone =
              item.result === "won"
                ? "success"
                : item.result === "partial"
                  ? "warning"
                  : "danger";
            const label =
              item.result === "won"
                ? t.common.correct
                : item.result === "partial"
                  ? t.common.partial
                  : t.common.missed;

            return (
              <Card key={item.id} padding="sm" className="!py-2.5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {locale === "ar" ? item.matchLabelAr : item.matchLabel}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                      {t.matches.yourPick}{" "}
                      <LtrIsolate>{item.predictedScore}</LtrIsolate>
                      <span className="mx-1.5 text-white/20">·</span>
                      {t.matches.finalScore}{" "}
                      <LtrIsolate>{item.actualScore}</LtrIsolate>
                    </p>
                  </div>
                  <div className="shrink-0 text-end">
                    <Badge tone={tone}>{label}</Badge>
                    <p className="mt-1 text-[11px] font-semibold text-[var(--pitch)]">
                      <LtrIsolate>+{formatNumber(item.xpEarned, locale)} XP</LtrIsolate>
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
