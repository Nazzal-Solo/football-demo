"use client";

import { clubs } from "@/lib/data/mock";
import { useI18n } from "@/lib/i18n/context";
import type { LeaderboardRowData } from "@/components/league/LeaderboardRow";
import { Avatar } from "@/components/ui/Avatar";
import { LtrIsolate } from "@/components/ui/DirIsolate";
import { clubName, cn, formatNumber } from "@/lib/utils";

interface PodiumProps {
  entries: LeaderboardRowData[];
}

/**
 * DOM order is #1, #2, #3 so mobile grid places winner on top.
 * Desktop CSS `order` restores classic 2-1-3 arrangement.
 */
export function Podium({ entries }: PodiumProps) {
  const { locale } = useI18n();
  const first = entries[0];
  const second = entries[1];
  const third = entries[2];

  return (
    <div className="podium">
      <PodiumCard entry={first} place={1} locale={locale} emphasize />
      <PodiumCard entry={second} place={2} locale={locale} />
      <PodiumCard entry={third} place={3} locale={locale} />
    </div>
  );
}

function PodiumCard({
  entry,
  place,
  locale,
  emphasize,
}: {
  entry?: LeaderboardRowData;
  place: 1 | 2 | 3;
  locale: "en" | "ar";
  emphasize?: boolean;
}) {
  if (!entry) return <div className="podium-card" aria-hidden />;

  const placeClass =
    place === 1
      ? "podium-card--first"
      : place === 2
        ? "podium-card--second"
        : "podium-card--third";

  return (
    <div className={cn("podium-card", placeClass)}>
      <LtrIsolate
        className={cn(
          "podium-card__rank font-display font-bold",
          place === 1 && "text-[var(--gold)]",
          place === 2 && "text-[#c0c7d4]",
          place === 3 && "text-[#d4a574]"
        )}
      >
        #{entry.displayRank ?? entry.rank}
      </LtrIsolate>

      <Avatar
        initials={entry.username.slice(0, 2).toUpperCase()}
        size={emphasize ? "md" : "sm"}
        clubColor={clubs[entry.clubId].primary}
        className={cn(
          "podium-card__avatar",
          emphasize ? "!h-10 !w-10 !text-[11px]" : "!h-8 !w-8 !text-[10px]",
          "sm:!h-10 sm:!w-10 sm:!text-xs"
        )}
      />

      <LtrIsolate className="podium-card__name truncate">
        {entry.username}
      </LtrIsolate>

      <p className="podium-card__meta truncate">
        <span>{clubName(entry.clubId, locale)}</span>
        <span className="podium-card__dot" aria-hidden>
          •
        </span>
        <LtrIsolate>{entry.countryCode}</LtrIsolate>
      </p>

      <LtrIsolate className="podium-card__xp tabular-nums">
        {formatNumber(entry.xp, locale)} XP
      </LtrIsolate>
    </div>
  );
}
