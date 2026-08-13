import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "gold" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--pitch)] text-[#04140c] hover:brightness-110 active:scale-[0.98] shadow-[0_8px_22px_rgba(45,214,123,0.22)]",
  secondary:
    "bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-soft)] hover:border-[var(--border-strong)] active:scale-[0.98]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5",
  danger: "bg-[var(--danger)] text-white hover:brightness-110 active:scale-[0.98]",
  gold: "bg-[var(--gold)] text-[#1a1400] hover:brightness-110 active:scale-[0.98]",
  outline:
    "bg-transparent text-white border border-[var(--border-strong)] hover:bg-white/5 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 rounded-lg px-3 py-1.5 text-xs",
  md: "min-h-11 rounded-xl px-4 py-2.5 text-sm",
  lg: "min-h-12 rounded-xl px-5 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  fullWidth,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
