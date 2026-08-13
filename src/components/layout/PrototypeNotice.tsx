"use client";

import { PROTOTYPE_DISMISS_KEY } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

interface PrototypeContextValue {
  openAbout: () => void;
}

const PrototypeContext = createContext<PrototypeContextValue | null>(null);

export function usePrototypeNotice() {
  const ctx = useContext(PrototypeContext);
  if (!ctx) throw new Error("usePrototypeNotice must be used within PrototypeNoticeProvider");
  return ctx;
}

let dismissedMemory = false;
const dismissedListeners = new Set<() => void>();

function readDismissed(): boolean {
  try {
    dismissedMemory = window.sessionStorage.getItem(PROTOTYPE_DISMISS_KEY) === "1";
  } catch {
    // ignore
  }
  return dismissedMemory;
}

function subscribeDismissed(listener: () => void) {
  dismissedListeners.add(listener);
  return () => dismissedListeners.delete(listener);
}

function writeDismissed() {
  dismissedMemory = true;
  try {
    window.sessionStorage.setItem(PROTOTYPE_DISMISS_KEY, "1");
  } catch {
    // ignore
  }
  dismissedListeners.forEach((l) => l());
}

export function PrototypeNoticeProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const dismissed = useSyncExternalStore(subscribeDismissed, readDismissed, () => true);
  const [manualOpen, setManualOpen] = useState(false);

  const open = !dismissed || manualOpen;

  const dismiss = useCallback(() => {
    writeDismissed();
    setManualOpen(false);
  }, []);

  const openAbout = useCallback(() => setManualOpen(true), []);

  const value = useMemo(() => ({ openAbout }), [openAbout]);

  return (
    <PrototypeContext.Provider value={value}>
      {children}
      <Modal open={open} onClose={dismiss} title={t.preview.title}>
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-white">{t.preview.lead}</p>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {t.preview.body}
          </p>
          <div className="rounded-xl border border-[var(--border-soft)] bg-black/30 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
              {t.preview.includesTitle}
            </p>
            <ul className="mt-2.5 space-y-1.5">
              {t.preview.includes.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-xs leading-relaxed text-[var(--text-secondary)]"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--pitch)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">{t.preview.localNote}</p>
          <Button fullWidth onClick={dismiss}>
            {t.preview.dismiss}
          </Button>
        </div>
      </Modal>
    </PrototypeContext.Provider>
  );
}

export function PrototypeBadge({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <span
      className={
        className ??
        "inline-flex items-center rounded-md border border-[rgba(240,193,74,0.35)] bg-[var(--gold-dim)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--gold)]"
      }
    >
      {t.preview.badge}
    </span>
  );
}

export function AboutPrototypeButton() {
  const { t } = useI18n();
  const { openAbout } = usePrototypeNotice();
  return (
    <button
      type="button"
      onClick={openAbout}
      className="text-[11px] font-medium text-[var(--text-muted)] underline-offset-2 hover:text-[var(--text-secondary)] hover:underline cursor-pointer"
    >
      {t.preview.about}
    </button>
  );
}
