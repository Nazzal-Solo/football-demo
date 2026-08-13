import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  tone?: "default" | "match" | "gold" | "danger";
}

export function Card({
  children,
  className,
  glow,
  padding = "md",
  tone = "default",
  ...props
}: CardProps) {
  const paddings = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-5",
  };

  const tones = {
    default: "border-[var(--border-soft)] bg-[var(--surface-1)]",
    match: "border-white/10 bg-[var(--surface-2)]",
    gold: "border-[rgba(240,193,74,0.28)] bg-[var(--gold-dim)]",
    danger: "border-[rgba(255,92,108,0.28)] bg-[rgba(255,92,108,0.08)]",
  };

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border backdrop-blur-sm",
        paddings[padding],
        tones[tone],
        glow && "pitch-glow border-[rgba(45,214,123,0.28)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
