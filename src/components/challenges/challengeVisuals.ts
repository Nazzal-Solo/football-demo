import { HelpCircle, Swords, Video, type LucideIcon } from "lucide-react";
import type { ChallengeType } from "@/lib/types";

export const challengeTypeIcon: Record<ChallengeType, LucideIcon> = {
  "secret-phrase": Video,
  trivia: HelpCircle,
  "match-question": HelpCircle,
  "el-clasico": Swords,
};

export const challengeTypeAccent: Record<
  ChallengeType,
  { icon: string; bar: string; soft: string }
> = {
  "secret-phrase": {
    icon: "bg-red-500/15 text-red-400",
    bar: "bg-red-400/70",
    soft: "border-red-400/20",
  },
  trivia: {
    icon: "bg-[var(--pitch-dim)] text-[var(--pitch)]",
    bar: "bg-[var(--pitch)]/70",
    soft: "border-[rgba(45,214,123,0.22)]",
  },
  "match-question": {
    icon: "bg-[rgba(77,163,255,0.14)] text-[var(--info)]",
    bar: "bg-[var(--info)]/70",
    soft: "border-[rgba(77,163,255,0.22)]",
  },
  "el-clasico": {
    icon: "bg-[var(--gold-dim)] text-[var(--gold)]",
    bar: "bg-[var(--gold)]/70",
    soft: "border-[rgba(240,193,74,0.28)]",
  },
};

