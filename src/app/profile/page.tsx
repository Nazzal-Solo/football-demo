"use client";

import { useState } from "react";
import {
  Crown,
  Flame,
  Heart,
  Medal,
  Shield,
  Sprout,
  Star,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ClubBadge } from "@/components/ui/ClubBadge";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LtrIsolate } from "@/components/ui/DirIsolate";
import { achievements, clubs, currentUser } from "@/lib/data/mock";
import { useI18n } from "@/lib/i18n/context";
import type { Achievement, AchievementRarity } from "@/lib/types";
import { clubName, cn, countryFlag, formatNumber } from "@/lib/utils";

const iconMap = {
  seedling: Sprout,
  heart: Heart,
  flame: Flame,
  crown: Crown,
  trophy: Trophy,
  swords: Swords,
  star: Star,
  zap: Zap,
  target: Target,
  shield: Shield,
  medal: Medal,
} as const;

const rarityTone: Record<AchievementRarity, "default" | "info" | "gold" | "warning"> = {
  common: "default",
  rare: "info",
  epic: "warning",
  legendary: "gold",
};

export default function ProfilePage() {
  const { t, locale } = useI18n();
  const [selected, setSelected] = useState<Achievement | null>(null);
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-5 animate-fade-up">
      <header>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
          {t.profile.title}
        </h1>
      </header>

      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 stadium-grid opacity-25" />
        <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Avatar
            initials={currentUser.avatarInitials}
            size="xl"
            clubColor={clubs[currentUser.clubId].primary}
            highlight
          />
          <div className="min-w-0 flex-1 text-center sm:text-start">
            <h2 className="font-display text-2xl font-bold text-white">
              {currentUser.displayName}
            </h2>
            <p className="latin-meta text-sm text-[var(--text-secondary)]">
              @{currentUser.username}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
              <Badge>
                {countryFlag(currentUser.countryCode)} {currentUser.country}
              </Badge>
              <ClubBadge clubId={currentUser.clubId} />
              <Badge tone="success">
                {t.common.level} {currentUser.level}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {t.profile.supportedClub}: {clubName(currentUser.clubId, locale)}
            </p>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8">
          <Metric label={t.common.xp} value={formatNumber(currentUser.xp, locale)} />
          <Metric
            label={t.common.loyalty}
            value={formatNumber(currentUser.loyaltyPoints, locale)}
          />
          <Metric label={t.profile.seasonRank} value={`#${currentUser.seasonRank}`} />
          <Metric label={t.profile.monthlyRank} value={`#${currentUser.monthlyRank}`} />
          <Metric label={t.common.accuracy} value={`${currentUser.predictionAccuracy}%`} />
          <Metric label={t.common.streak} value={`${currentUser.streak}`} />
        </div>

        <div className="relative mt-4">
          <ProgressBar
            value={currentUser.xp}
            max={currentUser.xpToNextLevel}
            label={`${t.common.level} ${currentUser.level} → ${currentUser.level + 1}`}
            tone="gold"
          />
        </div>
      </Card>

      <section>
        <SectionHeader
          title={t.profile.achievements}
          action={
            <span className="text-xs text-[var(--text-muted)] numeric-ltr">
              {unlocked}/{achievements.length} {t.profile.unlocked}
            </span>
          }
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {achievements.map((a) => {
            const Icon = iconMap[a.icon as keyof typeof iconMap] || Star;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelected(a)}
                className={cn(
                  "rounded-2xl border p-3 text-start transition cursor-pointer hover:border-[var(--border-strong)] active:scale-[0.98]",
                  a.unlocked
                    ? "border-[var(--border-soft)] bg-[var(--bg-elevated)]"
                    : "border-dashed border-white/10 bg-black/20"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      a.unlocked
                        ? "bg-[var(--gold-dim)] text-[var(--gold)]"
                        : "bg-white/5 text-white/30"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <Badge tone={rarityTone[a.rarity]} className="shrink-0">
                    {t.profile.rarity[a.rarity]}
                  </Badge>
                </div>
                <p className="mt-2 text-sm font-semibold text-white">
                  {locale === "ar" ? a.nameAr : a.nameEn}
                </p>
                <Badge className="mt-2" tone={a.unlocked ? "success" : "muted"}>
                  {a.unlocked ? t.profile.unlocked : t.profile.locked}
                </Badge>
                {!a.unlocked && a.progress != null && a.target != null ? (
                  <div className="mt-2">
                    <ProgressBar value={a.progress} max={a.target} />
                    <p className="mt-1 text-[10px] text-[var(--text-muted)] numeric-ltr">
                      {formatNumber(a.progress, locale)}/{formatNumber(a.target, locale)}
                    </p>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={
          selected
            ? locale === "ar"
              ? selected.nameAr
              : selected.nameEn
            : undefined
        }
        sheetOnMobile={false}
        footer={
          <Button fullWidth variant="secondary" onClick={() => setSelected(null)}>
            {t.common.close}
          </Button>
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              {(() => {
                const Icon = iconMap[selected.icon as keyof typeof iconMap] || Star;
                return (
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                      selected.unlocked
                        ? "bg-[var(--gold-dim)] text-[var(--gold)]"
                        : "bg-white/5 text-white/35"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                );
              })()}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone={selected.unlocked ? "success" : "muted"}>
                    {selected.unlocked ? t.profile.unlocked : t.profile.locked}
                  </Badge>
                  <Badge tone={rarityTone[selected.rarity]}>
                    {t.profile.rarity[selected.rarity]}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {locale === "ar" ? selected.descriptionAr : selected.descriptionEn}
                </p>
              </div>
            </div>
            {selected.progress != null && selected.target != null ? (
              <div>
                <p className="mb-1 text-xs text-[var(--text-muted)]">
                  {t.profile.progress}:{" "}
                  <LtrIsolate>
                    {formatNumber(selected.progress, locale)} /{" "}
                    {formatNumber(selected.target, locale)}
                  </LtrIsolate>
                </p>
                <ProgressBar value={selected.progress} max={selected.target} tone="gold" />
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--bg-elevated)] px-2.5 py-3">
      <p className="truncate text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1 font-display text-base font-bold tabular-nums text-white numeric-ltr sm:text-lg">
        {value}
      </p>
    </div>
  );
}
