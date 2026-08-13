"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string | null;
  onDismiss?: () => void;
  className?: string;
}

export function Toast({ message, onDismiss, className }: ToastProps) {
  useEffect(() => {
    if (!message || !onDismiss) return;
    const id = window.setTimeout(onDismiss, 2800);
    return () => window.clearTimeout(id);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-24 z-[var(--z-toast)] mx-auto max-w-md animate-fade-up rounded-2xl border border-[var(--border-strong)] bg-[#121a2b] px-4 py-3 text-sm shadow-2xl lg:bottom-8",
        className
      )}
      role="status"
    >
      {message}
    </div>
  );
}
