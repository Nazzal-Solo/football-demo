import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  className?: string;
  tone?: "pitch" | "gold";
}

export function ProgressBar({
  value,
  max,
  label,
  className,
  tone = "pitch",
}: ProgressBarProps) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <span className="truncate">{label}</span>
          <span className="numeric-ltr shrink-0">{Math.round(pct)}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-out",
            tone === "pitch" ? "bg-[var(--pitch)]" : "bg-[var(--gold)]"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
