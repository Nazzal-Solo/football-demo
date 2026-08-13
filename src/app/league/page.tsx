"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MonitorPlay } from "lucide-react";
import { LeaderboardRow } from "@/components/league/LeaderboardRow";
import { Podium } from "@/components/league/Podium";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LtrIsolate } from "@/components/ui/DirIsolate";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { clubTotals, currentUser, leaderboards } from "@/lib/data/mock";
import { useI18n } from "@/lib/i18n/context";
import type { ClubId, LeaderboardPeriod } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

type ClubFilter = "all" | ClubId;

export default function LeaguePage() {
  const { t, locale } = useI18n();
  const [period, setPeriod] = useState<LeaderboardPeriod>("season");
  const [clubFilter, setClubFilter] = useState<ClubFilter>("all");

  const entries = useMemo(() => {
    const list = leaderboards[period];
    const filtered =
      clubFilter === "all" ? list : list.filter((e) => e.clubId === clubFilter);
    return filtered.map((e, i) => ({
      ...e,
      displayRank: i + 1,
      isCurrentUser: e.username === currentUser.username || !!e.isCurrentUser,
    }));
  }, [period, clubFilter]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const barcaXp = clubTotals.barcelona.xp;
  const madridXp = clubTotals["real-madrid"].xp;
  const totalXp = barcaXp + madridXp;
  const barcaPct = (barcaXp / totalXp) * 100;

  const periods: LeaderboardPeriod[] = ["season", "monthly", "matchday", "allTime"];

  return (
    <div className="animate-fade-up">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
          {t.league.title}
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">{t.league.subtitle}</p>
      </header>

      <Card padding="sm" className="mt-4">
        <h2 className="text-sm font-bold text-white">{t.league.clubWar}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-bold text-[#ffb3d0]">{t.league.barcaFans}</p>
            <LtrIsolate className="mt-1 block font-display text-lg font-bold tabular-nums text-white">
              {formatNumber(barcaXp, locale)}
            </LtrIsolate>
            <p className="text-[10px] text-[var(--text-muted)]">
              <LtrIsolate>{formatNumber(clubTotals.barcelona.fans, locale)}</LtrIsolate>{" "}
              {t.league.fans}
            </p>
          </div>
          <div className="text-end">
            <p className="text-xs font-bold text-[#ffe08a]">{t.league.madridFans}</p>
            <LtrIsolate className="mt-1 block font-display text-lg font-bold tabular-nums text-white">
              {formatNumber(madridXp, locale)}
            </LtrIsolate>
            <p className="text-[10px] text-[var(--text-muted)]">
              <LtrIsolate>
                {formatNumber(clubTotals["real-madrid"].fans, locale)}
              </LtrIsolate>{" "}
              {t.league.fans}
            </p>
          </div>
        </div>
        <div className="mt-3 flex h-2.5 overflow-hidden rounded-full" dir="ltr">
          <div className="bg-[#A50044]" style={{ width: `${barcaPct}%` }} />
          <div className="bg-[#FEBE10]" style={{ width: `${100 - barcaPct}%` }} />
        </div>
      </Card>

      <div className="mt-6 space-y-2">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "min-h-9 shrink-0 rounded-lg px-3.5 text-xs font-bold transition cursor-pointer",
                period === p
                  ? "bg-[var(--pitch)] text-[#04140c]"
                  : "bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:text-white"
              )}
            >
              {t.league.periods[p]}
            </button>
          ))}
        </div>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {(
            [
              ["all", t.common.all],
              ["barcelona", t.league.barcaFans],
              ["real-madrid", t.league.madridFans],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setClubFilter(id)}
              className={cn(
                "min-h-8 shrink-0 rounded-md px-2.5 text-[11px] font-semibold transition cursor-pointer",
                clubFilter === id
                  ? "bg-white/12 text-white"
                  : "text-[var(--text-muted)] hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <section key={`podium-${period}-${clubFilter}`} className="mt-6">
        <SectionHeader title={t.league.podium} className="mb-4" />
        <Podium entries={top3} />
      </section>

      <section key={`list-${period}-${clubFilter}`} className="mt-6 sm:mt-8">
        <SectionHeader title={t.league.rankings} className="mb-4" />
        <Card padding="none" className="overflow-hidden">
          {rest.length === 0 && top3.length === 0 ? (
            <p className="p-4 text-center text-sm text-[var(--text-muted)]">{t.common.empty}</p>
          ) : null}
          <div className="divide-y divide-white/5 px-1 py-1">
            {rest.map((entry) => (
              <LeaderboardRow key={`${period}-${entry.username}`} entry={entry} />
            ))}
          </div>
        </Card>
      </section>

      <Card padding="sm" className="mt-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--info)]/15 text-[var(--info)]">
            <MonitorPlay className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">{t.league.obsTitle}</h2>
            <p className="text-[11px] text-[var(--text-secondary)]">{t.league.obsSubtitle}</p>
          </div>
          <Link href="/obs">
            <Button variant="secondary" size="sm">
              {t.league.openObs}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
