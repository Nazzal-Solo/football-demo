"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ClubBadge } from "@/components/ui/ClubBadge";
import { LtrIsolate } from "@/components/ui/DirIsolate";
import { clubs } from "@/lib/data/mock";
import { useI18n } from "@/lib/i18n/context";
import type { LeaderboardEntry } from "@/lib/types";
import { clubName, cn, countryFlag, formatNumber } from "@/lib/utils";

export type LeaderboardRowData = LeaderboardEntry & {
  displayRank?: number;
};

interface LeaderboardRowProps {
  entry: LeaderboardRowData;
  compact?: boolean;
  className?: string;
}

/**
 * Mobile (<=640): purpose-built 3-column compact card.
 * Desktop: original multi-column grid (unchanged).
 */
export function LeaderboardRow({ entry, compact, className }: LeaderboardRowProps) {
  const { t, locale } = useI18n();
  const rank = entry.displayRank ?? entry.rank;
  const isYou = !!entry.isCurrentUser;
  const clubColor = clubs[entry.clubId].primary;
  const highlight = cn(
    isYou && "bg-[var(--pitch-dim)] ring-1 ring-[var(--pitch)]/35",
    rank === 1 && !isYou && "bg-[var(--gold-dim)]/40",
    className
  );

  return (
    <div className={cn("min-w-0 overflow-hidden rounded-xl", highlight)}>
      {/* —— Mobile rebuild —— */}
      <div className="lb-mobile sm:hidden">
        {/* Col 1: rank + avatar */}
        <div className="lb-mobile__identity">
          <LtrIsolate className="font-display text-xs font-bold tabular-nums text-[var(--text-muted)]">
            #{rank}
          </LtrIsolate>
          <Avatar
            initials={entry.username.slice(0, 2).toUpperCase()}
            size="sm"
            clubColor={clubColor}
            className="!h-8 !w-8 !rounded-lg !text-[10px]"
          />
        </div>

        {/* Col 2: username + club • country */}
        <div className="lb-mobile__details min-w-0">
          <div className="flex min-w-0 items-center gap-1">
            <LtrIsolate className="truncate text-sm font-semibold leading-tight text-white">
              {entry.username}
            </LtrIsolate>
            {isYou ? (
              <Badge tone="success" className="shrink-0 !px-1 !py-0 text-[9px]">
                {t.league.yourPosition}
              </Badge>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-[11px] leading-tight text-[var(--text-muted)]">
            <span>{clubName(entry.clubId, locale)}</span>
            <span className="mx-1 text-white/25" aria-hidden>
              •
            </span>
            <LtrIsolate className="text-[var(--text-secondary)]">
              {entry.countryCode}
            </LtrIsolate>
          </p>
        </div>

        {/* Col 3: XP + movement */}
        <div className="lb-mobile__stats">
          <LtrIsolate className="text-sm font-bold tabular-nums leading-tight text-[var(--pitch)]">
            {formatNumber(entry.xp, locale)}
            <span className="ms-0.5 text-[10px] font-semibold text-[var(--text-muted)]">
              XP
            </span>
          </LtrIsolate>
          <div className="mt-0.5 flex justify-end">
            <Movement value={entry.movement} />
          </div>
        </div>
      </div>

      {/* —— Desktop / tablet (unchanged columns) —— */}
      <div
        className={cn(
          "leaderboard-row hidden items-center gap-x-2 px-2 sm:grid",
          compact ? "py-1.5" : "py-2"
        )}
      >
        <LtrIsolate className="font-display text-center text-sm font-bold tabular-nums text-[var(--text-muted)]">
          {rank}
        </LtrIsolate>

        <div className="flex min-w-0 items-center gap-2">
          <Avatar
            initials={entry.username.slice(0, 2).toUpperCase()}
            size="sm"
            clubColor={clubColor}
            className="!h-8 !w-8 !rounded-xl !text-[10px]"
          />
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1.5">
              <LtrIsolate className="truncate text-sm font-semibold text-white">
                {entry.username}
              </LtrIsolate>
              {isYou ? (
                <Badge tone="success" className="shrink-0">
                  {t.league.yourPosition}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="justify-self-center">
          <LtrIsolate className="text-base leading-none" title={entry.countryCode}>
            {countryFlag(entry.countryCode)}
          </LtrIsolate>
        </div>

        <div className="justify-self-center">
          <ClubBadge clubId={entry.clubId} compact />
        </div>

        <div className="justify-self-center">
          <Movement value={entry.movement} />
        </div>

        <LtrIsolate className="justify-self-end text-sm font-bold tabular-nums text-[var(--pitch)]">
          {formatNumber(entry.xp, locale)}
        </LtrIsolate>
      </div>
    </div>
  );
}

function Movement({ value }: { value: number }) {
  if (value === 0) {
    return (
      <LtrIsolate className="inline-flex items-center gap-0.5 text-[10px] text-[var(--text-muted)]">
        <Minus className="h-3 w-3" />
      </LtrIsolate>
    );
  }
  if (value > 0) {
    return (
      <LtrIsolate className="inline-flex items-center gap-0.5 text-[10px] text-[var(--pitch)]">
        <ArrowUp className="h-3 w-3" />
        {value}
      </LtrIsolate>
    );
  }
  return (
    <LtrIsolate className="inline-flex items-center gap-0.5 text-[10px] text-[var(--danger)]">
      <ArrowDown className="h-3 w-3" />
      {Math.abs(value)}
    </LtrIsolate>
  );
}
