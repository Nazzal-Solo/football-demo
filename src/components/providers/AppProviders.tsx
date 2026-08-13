"use client";

import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { PrototypeNoticeProvider } from "@/components/layout/PrototypeNotice";
import { TopBar } from "@/components/layout/TopBar";
import { I18nProvider } from "@/lib/i18n/context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <PrototypeNoticeProvider>
        <div className="relative flex min-h-dvh flex-col">
          <TopBar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-4 safe-bottom">
            {children}
          </main>
          <BottomNav />
        </div>
      </PrototypeNoticeProvider>
    </I18nProvider>
  );
}
