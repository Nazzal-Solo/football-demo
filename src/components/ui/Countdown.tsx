"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LtrBlock, LtrIsolate } from "@/components/ui/DirIsolate";
import { cn, getCountdownParts } from "@/lib/utils";

interface CountdownProps {
  targetIso: string;
  label?: string;
  compact?: boolean;
  className?: string;
}

const emptySubscribe = () => () => {};

const ZERO_PARTS = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalSeconds: 0,
} as const;

export function Countdown({ targetIso, label, compact, className }: CountdownProps) {
  const { t } = useI18n();
  const targetMs = useMemo(() => Date.parse(targetIso), [targetIso]);

  // Stable true/false snapshots — avoids SSR/client Date.now() hydration mismatch.
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isClient) return;

    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(id);
  }, [targetMs, isClient]);

  const parts = isClient ? getCountdownParts(targetIso, now) : ZERO_PARTS;
  const cells = [
    { value: parts.days, unit: t.common.days },
    { value: parts.hours, unit: t.common.hours },
    { value: parts.minutes, unit: t.common.minutes },
    { value: parts.seconds, unit: t.common.seconds },
  ];

  return (
    <div className={cn("w-full", !isClient && "invisible", className)}>
      {label ? (
        <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
          {label}
        </p>
      ) : null}
      <LtrBlock
        className={cn("grid w-full grid-cols-4 gap-1.5", compact && "gap-1")}
      >
        {cells.map((cell) => (
          <div
            key={cell.unit}
            className={cn(
              "rounded-xl border border-white/8 bg-black/35 text-center",
              compact ? "px-1 py-1.5" : "px-2 py-2.5"
            )}
          >
            <LtrIsolate
              className={cn(
                "font-display block w-full font-bold tabular-nums text-white",
                compact ? "text-base" : "text-xl sm:text-2xl"
              )}
            >
              {String(cell.value).padStart(2, "0")}
            </LtrIsolate>
            <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
              {cell.unit}
            </div>
          </div>
        ))}
      </LtrBlock>
    </div>
  );
}
