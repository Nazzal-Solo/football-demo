import { clubs } from "@/lib/data/mock";
import { useI18n } from "@/lib/i18n/context";
import type { ClubId } from "@/lib/types";
import { clubShort, cn } from "@/lib/utils";

interface ClubBadgeProps {
  clubId: ClubId;
  className?: string;
  compact?: boolean;
}

export function ClubBadge({ clubId, className, compact }: ClubBadgeProps) {
  const { locale } = useI18n();
  const club = clubs[clubId];
  const short = clubShort(clubId, locale);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/25 font-semibold",
        compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]",
        className
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: club.primary }}
        aria-hidden
      />
      <span className="latin-meta tracking-wide text-white/85">{short}</span>
    </span>
  );
}
