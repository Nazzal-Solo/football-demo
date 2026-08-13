"use client";

import { Minus, Plus } from "lucide-react";
import { LtrIsolate } from "@/components/ui/DirIsolate";
import { SCORE_MAX, SCORE_MIN } from "@/lib/constants";
import { clampScore, cn } from "@/lib/utils";

interface ScoreStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  accent?: string;
  className?: string;
}

export function ScoreStepper({
  label,
  value,
  onChange,
  accent = "var(--pitch)",
  className,
}: ScoreStepperProps) {
  function set(next: number) {
    onChange(clampScore(next, SCORE_MIN, SCORE_MAX));
  }

  return (
    <div className={cn("rounded-2xl border border-white/8 bg-[var(--surface-2)] p-3", className)}>
      <p className="mb-3 truncate text-center text-xs font-medium text-[var(--text-secondary)]">
        {label}
      </p>
      <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2">
        <button
          type="button"
          aria-label="Decrease"
          disabled={value <= SCORE_MIN}
          onClick={() => set(value - 1)}
          className="flex h-11 w-11 items-center justify-center justify-self-center rounded-xl border border-[var(--border-soft)] bg-[var(--bg-panel)] text-white transition active:scale-95 disabled:opacity-35 cursor-pointer"
        >
          <Minus className="h-4 w-4" />
        </button>
        <LtrIsolate
          key={value}
          className="animate-score-pop text-center font-display text-4xl font-bold tabular-nums text-white"
          style={{ textShadow: `0 0 24px ${accent}55` }}
        >
          {value}
        </LtrIsolate>
        <button
          type="button"
          aria-label="Increase"
          disabled={value >= SCORE_MAX}
          onClick={() => set(value + 1)}
          className="flex h-11 w-11 items-center justify-center justify-self-center rounded-xl border border-[var(--border-soft)] bg-[var(--bg-panel)] text-white transition active:scale-95 disabled:opacity-35 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <input
        type="number"
        inputMode="numeric"
        min={SCORE_MIN}
        max={SCORE_MAX}
        value={value}
        dir="ltr"
        onChange={(e) => set(Number(e.target.value))}
        className="mt-3 w-full rounded-lg border border-transparent bg-white/5 px-2 py-1.5 text-center text-xs tabular-nums text-[var(--text-secondary)] outline-none focus:border-[var(--pitch)]"
        aria-label={label}
      />
    </div>
  );
}
