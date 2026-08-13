"use client";

import { useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  /**
   * Mobile bottom sheet with edge breathing room.
   * Default is a centered dialog on all breakpoints.
   */
  sheetOnMobile?: boolean;
  /** Wider desktop dialog (player picker) */
  size?: "md" | "lg";
  /** Extra sticky block under header (search filters) */
  toolbar?: ReactNode;
}

const emptySubscribe = () => () => {};

/**
 * Portal modal — always mounts to document.body so parent transform/overflow
 * cannot clip the backdrop into black rectangular bands.
 */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  className,
  sheetOnMobile = false,
  size = "md",
  toolbar,
}: ModalProps) {
  const { t } = useI18n();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) {
      document.body.style.paddingRight = `${scrollbar}px`;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const id = window.requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      window.removeEventListener("keydown", onKey);
      window.cancelAnimationFrame(id);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const node = (
    <div
      className={cn("ui-modal-root", sheetOnMobile && "ui-modal-root--sheet")}
      role="presentation"
    >
      <button
        type="button"
        aria-label={t.common.close}
        className="ui-modal-backdrop"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          "ui-modal-panel",
          size === "lg" ? "ui-modal-panel--lg" : "ui-modal-panel--md",
          sheetOnMobile && "ui-modal-panel--sheet",
          className
        )}
      >
        <div className="ui-modal-header">
          <div className="min-w-0 flex-1">
            {title ? (
              <h2 id={titleId} className="font-display text-lg font-bold text-white">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <div className="mt-0.5 text-xs text-[var(--text-secondary)]">{subtitle}</div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ui-modal-close"
            aria-label={t.common.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {toolbar ? <div className="ui-modal-toolbar">{toolbar}</div> : null}

        <div className="ui-modal-body">{children}</div>

        {footer ? <div className="ui-modal-footer">{footer}</div> : null}
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
