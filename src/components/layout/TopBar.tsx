"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Info, MoreVertical, Shield } from "lucide-react";
import {
  AboutPrototypeButton,
  PrototypeBadge,
  usePrototypeNotice,
} from "@/components/layout/PrototypeNotice";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", key: "home" as const },
  { href: "/matches", key: "matches" as const },
  { href: "/challenges", key: "challenges" as const },
  { href: "/league", key: "league" as const },
  { href: "/profile", key: "profile" as const },
];

export function TopBar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isObs = pathname.startsWith("/obs");

  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-[var(--border-soft)] bg-[#070b14]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Link href={isAdmin ? "/admin" : "/"} className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-display text-base font-bold tracking-wide text-white sm:text-xl">
                {t.brand}
              </span>
              {!isAdmin ? <PrototypeBadge /> : null}
            </div>
            <div className="truncate text-[10px] text-[var(--text-muted)] sm:text-[11px]">
              {isAdmin ? t.admin.badge : t.brandTagline}
            </div>
          </Link>
        </div>

        {!isAdmin && !isObs ? (
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Desktop">
            {links.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-[var(--pitch-dim)] text-[var(--pitch)]"
                      : "text-[var(--text-secondary)] hover:text-white"
                  )}
                >
                  {t.nav[link.key]}
                </Link>
              );
            })}
          </nav>
        ) : null}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {!isAdmin && !isObs ? (
            <div className="hidden sm:block">
              <AboutPrototypeButton />
            </div>
          ) : null}
          <LanguageSwitcher />
          {!isAdmin && !isObs ? <MobileMoreMenu /> : null}
          {!isAdmin ? (
            <Link
              href="/admin"
              className="hidden rounded-xl border border-[var(--border-soft)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-white sm:inline-flex"
            >
              {t.nav.adminPreview}
            </Link>
          ) : (
            <Link
              href="/"
              className="rounded-xl border border-[var(--border-soft)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-white"
            >
              {t.admin.backToApp}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

/** Compact overflow menu — Admin Preview + About, without crowding the header. */
function MobileMoreMenu() {
  const { t } = useI18n();
  const { openAbout } = usePrototypeNotice();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t.common.menu}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-soft)] text-[var(--text-secondary)] active:scale-95 cursor-pointer"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute end-0 top-[calc(100%+6px)] z-[var(--z-modal)] min-w-[11.5rem] overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[#0d1422] py-1 shadow-xl"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2.5 text-start text-xs font-semibold text-[var(--text-secondary)] hover:bg-white/5 hover:text-white cursor-pointer"
            onClick={() => {
              setOpen(false);
              openAbout();
            }}
          >
            <Info className="h-3.5 w-3.5 shrink-0" />
            {t.preview.about}
          </button>
          <Link
            href="/admin"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2.5 text-start text-xs font-semibold text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <Shield className="h-3.5 w-3.5 shrink-0" />
            {t.nav.adminPreview}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
