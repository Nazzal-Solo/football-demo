"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LtrIsolate } from "@/components/ui/DirIsolate";
import { clubTotals, leaderboards } from "@/lib/data/mock";
import { useI18n } from "@/lib/i18n/context";
import { cn, countryFlag, formatNumber } from "@/lib/utils";

export default function ObsPage() {
  const { t, locale } = useI18n();
  const top10 = leaderboards.season.slice(0, 10);
  const barcaXp = clubTotals.barcelona.xp;
  const madridXp = clubTotals["real-madrid"].xp;
  const total = barcaXp + madridXp;
  const barcaPct = (barcaXp / total) * 100;

  return (
    <div className="animate-fade-up">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href="/league"
          className="inline-flex min-h-10 items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t.nav.league}
        </Link>
        <Badge tone="warning">{t.obs.liveBadge}</Badge>
      </div>

      <div className="obs-scan mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/12 bg-black/75 shadow-[0_0_80px_rgba(45,214,123,0.08)] backdrop-blur-md">
        <header className="relative border-b border-white/10 px-5 py-6 text-center sm:px-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                "linear-gradient(90deg, rgba(165,0,68,0.35), transparent 40%, transparent 60%, rgba(254,190,16,0.28))",
            }}
          />
          <p className="relative text-[11px] uppercase tracking-[0.28em] text-[var(--pitch)]">
            {t.brand}
          </p>
          <h1 className="relative mt-1 font-display text-3xl font-bold text-white sm:text-5xl">
            {t.obs.title}
          </h1>
          <p className="relative mt-2 text-sm text-white/60">{t.obs.subtitle}</p>
        </header>

        <div className="grid gap-0 lg:grid-cols-[1.55fr_1fr]">
          <section className="border-b border-white/10 lg:border-b-0 lg:border-e">
            <div className="border-b border-white/10 px-5 py-3 sm:px-6">
              <h2 className="font-display text-lg font-bold uppercase tracking-[0.18em] text-white">
                {t.obs.top10}
              </h2>
            </div>
            {/*
              Broadcast data grid stays LTR so Rank/User/XP never reverse under page RTL.
              Surrounding chrome (titles, nav) remains RTL via page direction.
            */}
            <ol dir="ltr" className="obs-top10">
              {top10.map((entry, i) => (
                <li
                  key={entry.username}
                  className={cn(
                    "obs-row",
                    i < 3 && "obs-row--podium"
                  )}
                >
                  <LtrIsolate
                    className={cn(
                      "obs-row-rank font-display text-2xl font-bold tabular-nums sm:text-3xl",
                      i === 0 ? "text-[var(--gold)]" : "text-white/40"
                    )}
                  >
                    {String(entry.rank).padStart(2, "0")}
                  </LtrIsolate>

                  <LtrIsolate className="obs-row-flag text-xl leading-none" title={entry.countryCode}>
                    {countryFlag(entry.countryCode)}
                  </LtrIsolate>

                  <LtrIsolate className="obs-row-user truncate text-base font-bold text-white sm:text-lg">
                    {entry.username}
                  </LtrIsolate>

                  <LtrIsolate className="obs-row-club text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                    {entry.clubId === "barcelona" ? "BAR" : "RMA"}
                  </LtrIsolate>

                  <LtrIsolate className="obs-row-xp font-display text-xl font-bold tabular-nums text-[var(--pitch)] sm:text-2xl">
                    {formatNumber(entry.xp, locale)}
                  </LtrIsolate>
                </li>
              ))}
            </ol>
          </section>

          <section className="flex flex-col justify-between p-5 sm:p-6">
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-[0.18em] text-white">
                {t.obs.clubBattle}
              </h2>
              <div className="mt-8 space-y-8">
                <ClubMeter
                  label={t.league.barcaFans}
                  value={barcaXp}
                  pct={barcaPct}
                  color="#A50044"
                  locale={locale}
                />
                <ClubMeter
                  label={t.league.madridFans}
                  value={madridXp}
                  pct={100 - barcaPct}
                  color="#FEBE10"
                  locale={locale}
                />
              </div>
            </div>
            <p className="mt-10 text-center text-[11px] uppercase tracking-[0.2em] text-white/35">
              {t.admin.sampleNote}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function ClubMeter({
  label,
  value,
  pct,
  color,
  locale,
}: {
  label: string;
  value: number;
  pct: number;
  color: string;
  locale: "en" | "ar";
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-base font-semibold text-white">{label}</span>
        <LtrIsolate
          className="font-display text-2xl font-bold tabular-nums"
          style={{ color }}
        >
          {formatNumber(value, locale)}
        </LtrIsolate>
      </div>
      <div className="mt-3 h-5 overflow-hidden rounded-md bg-white/10" dir="ltr">
        <div
          className="h-full rounded-md transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
