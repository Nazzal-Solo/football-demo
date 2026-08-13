"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  ChevronRight,
  Flame,
  Target,
  Trophy,
  Video,
  Zap,
} from "lucide-react";
import { AboutPrototypeButton } from "@/components/layout/PrototypeNotice";
import { LeaderboardRow } from "@/components/league/LeaderboardRow";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ClubBadge } from "@/components/ui/ClubBadge";
import { Countdown } from "@/components/ui/Countdown";
import { DateTimeText } from "@/components/ui/DateTimeText";
import { LtrIsolate } from "@/components/ui/DirIsolate";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextInput } from "@/components/ui/TextInput";
import {
  achievements,
  challenges,
  clubs,
  currentUser,
  leaderboards,
  upcomingMatch,
} from "@/lib/data/mock";
import { useI18n } from "@/lib/i18n/context";
import { answersMatch } from "@/lib/normalize";
import { clubName, cn, formatNumber } from "@/lib/utils";

export default function HomePage() {
  const { t, locale, dir } = useI18n();
  const [phrase, setPhrase] = useState("");
  const [phraseState, setPhraseState] = useState<"idle" | "success" | "fail">("idle");
  const [showHint, setShowHint] = useState(false);
  const challenge = challenges.find((c) => c.status === "active" && c.type === "secret-phrase")!;
  const latestAchievement = achievements.filter((a) => a.unlocked).at(-1)!;
  const top5 = leaderboards.season.slice(0, 5).map((e) => ({
    ...e,
    displayRank: e.rank,
    isCurrentUser: e.username === currentUser.username || !!e.isCurrentUser,
  }));
  const home = clubs[upcomingMatch.homeClubId];
  const away = clubs[upcomingMatch.awayClubId];

  const xpPct = useMemo(
    () => Math.round((currentUser.xp / currentUser.xpToNextLevel) * 100),
    []
  );

  function submitPhrase() {
    if (answersMatch(phrase, challenge.correctPhrase || "")) {
      setPhraseState("success");
    } else {
      setPhraseState("fail");
    }
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <section className="relative overflow-hidden rounded-[1.35rem] border border-[var(--border-soft)] bg-[var(--surface-1)]">
        <div className="pointer-events-none absolute inset-0 stadium-grid opacity-35" />
        <div className="relative p-4 sm:p-5">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
            <Avatar
              initials={currentUser.avatarInitials}
              size="lg"
              clubColor={clubs[currentUser.clubId].primary}
              highlight
            />
            <div className="min-w-0">
              <p className="text-xs text-[var(--text-muted)]">{t.home.greeting}</p>
              <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
                {currentUser.displayName}
              </h1>
              <LtrIsolate className="mt-0.5 block text-xs text-[var(--text-secondary)]">
                @{currentUser.username}
              </LtrIsolate>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <ClubBadge clubId={currentUser.clubId} />
                <Badge tone="success">
                  {t.common.level}{" "}
                  <LtrIsolate>{currentUser.level}</LtrIsolate>
                </Badge>
                <Badge tone="gold">
                  <LtrIsolate>#{currentUser.seasonRank}</LtrIsolate> {t.home.seasonRank}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <ProgressBar
              value={currentUser.xp}
              max={currentUser.xpToNextLevel}
              label={`${formatNumber(currentUser.xp, locale)} / ${formatNumber(currentUser.xpToNextLevel, locale)} XP · ${xpPct}%`}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <IdentityStat label={t.common.xp} value={formatNumber(currentUser.xp, locale)} />
            <IdentityStat
              label={t.common.loyalty}
              value={formatNumber(currentUser.loyaltyPoints, locale)}
            />
            <IdentityStat
              label={t.common.streak}
              value={`${currentUser.streak}`}
              icon={<Flame className="h-3 w-3 text-orange-400" />}
            />
            <IdentityStat
              label={t.common.accuracy}
              value={`${currentUser.predictionAccuracy}%`}
              icon={<Target className="h-3 w-3 text-[var(--info)]" />}
            />
            <IdentityStat
              label={t.common.rank}
              value={`#${currentUser.seasonRank}`}
            />
            <IdentityStat label={t.home.nextLevel} value={`${xpPct}%`} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader
          title={t.home.upcomingMatch}
          action={
            <Badge tone="danger" className="animate-pulse-soft">
              {locale === "ar" ? upcomingMatch.tagAr : upcomingMatch.tagEn}
            </Badge>
          }
        />
        <Card padding="none" className="overflow-hidden pitch-glow border-[rgba(45,214,123,0.2)]">
          <div
            className="relative px-4 pb-4 pt-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(165,0,68,0.38) 0%, rgba(8,12,22,0.55) 48%, rgba(254,190,16,0.26) 100%)",
            }}
          >
            <p className="text-center text-[11px] uppercase tracking-[0.16em] text-white/70">
              {locale === "ar" ? upcomingMatch.competitionAr : upcomingMatch.competition}
              {" · "}
              {locale === "ar" ? upcomingMatch.venueAr : upcomingMatch.venue}
            </p>

            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <TeamHero
                name={clubName(home.id, locale)}
                short={locale === "ar" ? home.shortAr : home.shortEn}
                color={home.primary}
              />
              <div className="shrink-0 text-center px-1">
                <div className="font-display text-xl font-bold text-white/75">{t.common.vs}</div>
                <DateTimeText
                  iso={upcomingMatch.kickoff}
                  locale={locale}
                  className="mt-1 block text-[10px] text-white/55"
                />
              </div>
              <TeamHero
                name={clubName(away.id, locale)}
                short={locale === "ar" ? away.shortAr : away.shortEn}
                color={away.primary}
                align="end"
              />
            </div>

            <div className="mt-5">
              <Countdown
                targetIso={upcomingMatch.predictionClosesAt}
                label={t.common.closesIn}
                compact
              />
            </div>

            <Link href="/matches" className="mt-4 block">
              <Button fullWidth size="lg">
                {t.home.makePrediction}
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      <section>
        <SectionHeader title={t.home.activeChallenge} />
        <Card>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
              <Video className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">
                {locale === "ar" ? challenge.titleAr : challenge.titleEn}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {locale === "ar" ? challenge.videoTitleAr : challenge.videoTitle}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge tone="success">
                  <LtrIsolate>+{challenge.xpReward} XP</LtrIsolate>
                </Badge>
                <Badge tone="gold">
                  <LtrIsolate>+{challenge.loyaltyReward} LP</LtrIsolate>
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3.5 sm:gap-3">
            <TextInput
              label={t.home.secretPhrase}
              value={phrase}
              onChange={(e) => {
                setPhrase(e.target.value);
                setPhraseState("idle");
              }}
              placeholder={t.home.secretPlaceholder}
              dir={dir}
            />
            <Button fullWidth onClick={submitPhrase} disabled={!phrase.trim()}>
              <Zap className="h-4 w-4" />
              {t.home.claimXp}
            </Button>
            <div className="min-h-[1.25rem] text-sm">
              {phraseState === "success" ? (
                <p className="text-[var(--pitch)]">
                  {t.challenges.demoSuccess.replace("{xp}", String(challenge.xpReward))}
                </p>
              ) : null}
              {phraseState === "fail" ? (
                <p className="text-[var(--danger)]">{t.challenges.demoFail}</p>
              ) : null}
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowHint((v) => !v)}
                className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer"
              >
                {showHint ? t.challenges.hideHint : t.challenges.showHint}
              </button>
              {showHint ? (
                <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                  <LtrIsolate>{challenge.correctPhrase}</LtrIsolate>
                </p>
              ) : null}
            </div>
          </div>
        </Card>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card padding="sm" className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              {t.home.streakTitle}
            </p>
            <p className="font-display text-2xl font-bold text-white">
              <LtrIsolate>{currentUser.streak}</LtrIsolate>
              <span className="ms-1 text-sm font-medium text-[var(--text-secondary)]">
                {locale === "ar" ? "أيام" : "days"}
              </span>
            </p>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[var(--gold)]" />
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              {t.home.latestAchievement}
            </p>
          </div>
          <p className="mt-2 text-sm font-bold text-white">
            {locale === "ar" ? latestAchievement.nameAr : latestAchievement.nameEn}
          </p>
          <Link
            href="/profile"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--pitch)]"
          >
            {t.common.viewAll}
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </Card>
      </div>

      <section>
        <SectionHeader
          title={t.home.topLeaderboard}
          action={
            <Link href="/league" className="text-xs font-semibold text-[var(--pitch)]">
              {t.common.viewAll}
            </Link>
          }
        />
        <Card padding="none" className="overflow-hidden">
          <div className="divide-y divide-white/5 px-1 py-1">
            {top5.map((entry) => (
              <LeaderboardRow key={entry.username} entry={entry} compact />
            ))}
          </div>
        </Card>
      </section>

      <div className="flex justify-center pb-2 sm:hidden">
        <AboutPrototypeButton />
      </div>
    </div>
  );
}

function IdentityStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2.5">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <LtrIsolate className="mt-1 block font-display text-base font-bold tabular-nums text-white sm:text-lg">
        {value}
      </LtrIsolate>
    </div>
  );
}

function TeamHero({
  name,
  short,
  color,
  align = "start",
}: {
  name: string;
  short: string;
  color: string;
  align?: "start" | "end";
}) {
  return (
    <div className={cn("min-w-0", align === "end" && "text-end")}>
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl text-xs font-bold text-white shadow-lg",
          align === "end" ? "ms-auto" : "me-auto"
        )}
        style={{ background: `linear-gradient(145deg, ${color}, #0b1220)` }}
      >
        <LtrIsolate>{short}</LtrIsolate>
      </div>
      <p className="mt-2 truncate text-xs font-semibold text-white sm:text-sm">{name}</p>
    </div>
  );
}
