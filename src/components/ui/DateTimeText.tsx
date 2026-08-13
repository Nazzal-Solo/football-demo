"use client";

import { LtrIsolate } from "@/components/ui/DirIsolate";
import { formatDateTime, cn } from "@/lib/utils";
import type { Locale } from "@/lib/types";

interface DateTimeTextProps {
  iso: string;
  locale: Locale;
  className?: string;
}

/** Localized date/time with forced LTR isolation so digit order never reverses. */
export function DateTimeText({ iso, locale, className }: DateTimeTextProps) {
  return (
    <LtrIsolate as="time" dateTime={iso} className={cn("tabular-nums", className)}>
      {formatDateTime(iso, locale)}
    </LtrIsolate>
  );
}
