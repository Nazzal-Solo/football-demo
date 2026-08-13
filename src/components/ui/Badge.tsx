import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "default" | "success" | "warning" | "danger" | "gold" | "info" | "muted";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const tones: Record<Tone, string> = {
  default: "bg-white/8 text-[var(--text-secondary)]",
  success: "bg-[var(--pitch-dim)] text-[var(--pitch)]",
  warning: "bg-[rgba(245,165,36,0.14)] text-[var(--warning)]",
  danger: "bg-[rgba(255,92,108,0.14)] text-[var(--danger)]",
  gold: "bg-[var(--gold-dim)] text-[var(--gold)]",
  info: "bg-[rgba(77,163,255,0.14)] text-[var(--info)]",
  muted: "bg-white/5 text-[var(--text-muted)]",
};

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
