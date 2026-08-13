"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Home,
  Swords,
  Trophy,
  User,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", key: "home" as const, icon: Home },
  { href: "/matches", key: "matches" as const, icon: CalendarDays },
  { href: "/challenges", key: "challenges" as const, icon: Swords },
  { href: "/league", key: "league" as const, icon: Trophy },
  { href: "/profile", key: "profile" as const, icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname.startsWith("/admin") || pathname.startsWith("/obs")) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[var(--z-nav)] border-t border-[var(--border-soft)] bg-[#070b14]/94 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Main"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 py-1.5">
        {items.map(({ href, key, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[10px] font-medium transition-all",
                  active
                    ? "text-[var(--pitch)]"
                    : "text-[var(--text-muted)] active:scale-95 hover:text-[var(--text-secondary)]"
                )}
              >
                {active ? (
                  <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-[var(--pitch)]" />
                ) : null}
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    active && "scale-110 drop-shadow-[0_0_8px_rgba(45,214,123,0.45)]"
                  )}
                />
                <span>{t.nav[key]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
