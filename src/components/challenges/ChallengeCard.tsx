"use client";

import { Check, Lock } from "lucide-react";
import { createElement, type ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { DateTimeText } from "@/components/ui/DateTimeText";
import { LtrIsolate } from "@/components/ui/DirIsolate";
import {
  challengeTypeAccent,
  challengeTypeIcon,
} from "@/components/challenges/challengeVisuals";
import { useI18n } from "@/lib/i18n/context";
import type { Challenge, ChallengeStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ChallengeFeedback = "idle" | "validating" | "success" | "fail";

interface ChallengeCardShellProps {
  challenge: Challenge;
  status: ChallengeStatus;
  children: ReactNode;
}

/** Shared visual shell — category accent + status treatment. */
export function ChallengeCardShell({
  challenge,
  status,
  children,
}: ChallengeCardShellProps) {
  const accent = challengeTypeAccent[challenge.type];

  return (
    <article
      className={cn(
        "challenge-card",
        status === "active" && "challenge-card--active",
        status === "completed" && "challenge-card--completed",
        status === "locked" && "challenge-card--locked",
        status === "expired" && "challenge-card--expired",
        accent.soft
      )}
    >
      <span className={cn("challenge-card-accent", accent.bar)} aria-hidden />
      {children}
    </article>
  );
}

interface ChallengeCardHeaderProps {
  challenge: Challenge;
  status: ChallengeStatus;
}

export function ChallengeCardHeader({
  challenge,
  status,
}: ChallengeCardHeaderProps) {
  const { t, locale } = useI18n();
  const accent = challengeTypeAccent[challenge.type];
  const title = locale === "ar" ? challenge.titleAr : challenge.titleEn;
  const desc = locale === "ar" ? challenge.descriptionAr : challenge.descriptionEn;

  return (
    <header className="challenge-card-header">
      <div className={cn("challenge-card-icon", accent.icon)}>
        {createElement(status === "locked" ? Lock : challengeTypeIcon[challenge.type], {
          className: "h-4 w-4",
        })}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="info">{t.challenges.types[challenge.type]}</Badge>
          <StatusBadge status={status} />
        </div>

        <h2 className="mt-1.5 text-[0.9375rem] font-semibold leading-snug text-white">
          {title}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
          {desc}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="challenge-reward challenge-reward--xp">
            <LtrIsolate>+{challenge.xpReward} XP</LtrIsolate>
          </span>
          <span className="challenge-reward challenge-reward--lp">
            <LtrIsolate>+{challenge.loyaltyReward} LP</LtrIsolate>
          </span>
          {challenge.deadline ? (
            <span className="challenge-meta">
              {t.common.deadline}:{" "}
              <DateTimeText iso={challenge.deadline} locale={locale} />
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/**
 * Single shared status/feedback area.
 * Reserved height keeps active → completed transitions stable.
 */
export function ChallengeFeedbackSlot({
  status,
  feedback,
  successMsg,
}: {
  status: ChallengeStatus;
  feedback: ChallengeFeedback;
  successMsg: string;
}) {
  const { t } = useI18n();
  const isInteractive = status === "active";

  let content: ReactNode = null;
  if (feedback === "success" || status === "completed") {
    content = (
      <span className="challenge-feedback challenge-feedback--ok">
        <Check className="h-3.5 w-3.5 shrink-0" />
        {feedback === "success" ? successMsg : t.challenges.demoCompleted}
      </span>
    );
  } else if (feedback === "fail" && isInteractive) {
    content = (
      <span className="challenge-feedback challenge-feedback--fail">
        {t.challenges.demoFail}
      </span>
    );
  } else if (feedback === "validating") {
    content = (
      <span className="challenge-feedback challenge-feedback--muted">
        {t.challenges.validating}
      </span>
    );
  }

  return <div className="challenge-feedback-slot challenge-feedback-slot--active">{content}</div>;
}

function StatusBadge({ status }: { status: ChallengeStatus }) {
  const { t } = useI18n();
  const map = {
    active: { tone: "success" as const, label: t.common.active },
    completed: { tone: "success" as const, label: t.common.completed },
    locked: { tone: "muted" as const, label: t.common.locked },
    expired: { tone: "danger" as const, label: t.common.expired },
  };
  const item = map[status];
  return (
    <Badge tone={item.tone} className="min-w-[5.5rem] justify-center">
      {item.label}
    </Badge>
  );
}
