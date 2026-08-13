import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function TextInput({ label, hint, className, dir, ...props }: TextInputProps) {
  return (
    <label className="block w-full">
      {label ? (
        <span className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">
          {label}
        </span>
      ) : null}
      <input
        dir={dir}
        className={cn(
          "w-full rounded-xl border border-[var(--border-soft)] bg-black/35 px-3 py-3 text-sm text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--pitch)]",
          className
        )}
        {...props}
      />
      {hint ? <span className="mt-1.5 block text-[11px] text-[var(--text-muted)]">{hint}</span> : null}
    </label>
  );
}
