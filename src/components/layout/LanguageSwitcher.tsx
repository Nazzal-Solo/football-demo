"use client";

import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-[var(--border-soft)] bg-black/25 p-0.5",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {(
        [
          ["en", "EN"],
          ["ar", "ع"],
        ] as const
      ).map(([code, label]) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={cn(
            "min-h-8 min-w-9 rounded-lg px-2 text-xs font-bold transition cursor-pointer",
            locale === code
              ? "bg-[var(--pitch)] text-[#04140c]"
              : "text-[var(--text-muted)] hover:text-white"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
