"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Gift,
  KeyRound,
  LayoutDashboard,
  Swords,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import {
  adminActivity,
  adminSections,
  adminStats,
  adminUsers,
  challenges,
  leaderboards,
  upcomingMatch,
} from "@/lib/data/mock";
import { useI18n } from "@/lib/i18n/context";
import { cn, formatKickoff, formatNumber } from "@/lib/utils";

type SectionId = (typeof adminSections)[number]["id"];

const sectionIcons: Record<SectionId, ComponentType<{ className?: string }>> = {
  overview: LayoutDashboard,
  matches: CalendarDays,
  predictions: Target,
  challenges: Swords,
  phrases: KeyRound,
  users: Users,
  rewards: Gift,
  suspicious: AlertTriangle,
  leaderboard: Trophy,
  statistics: BarChart3,
};

export default function AdminPage() {
  const { t, locale } = useI18n();
  const [section, setSection] = useState<SectionId>("overview");
  const [toast, setToast] = useState<string | null>(null);

  function productionAction() {
    setToast(t.productionOnly);
  }

  const currentLabel =
    locale === "ar"
      ? adminSections.find((s) => s.id === section)?.labelAr
      : adminSections.find((s) => s.id === section)?.labelEn;

  return (
    <div className="animate-fade-up">
      <header className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            {t.admin.title}
          </h1>
          <Badge tone="warning">{t.admin.badge}</Badge>
        </div>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{t.admin.subtitle}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        {/* Mobile: one closed select row only */}
        <div className="relative z-20 lg:hidden">
          <AdminMobileNav
            section={section}
            onChange={setSection}
            label={currentLabel || t.admin.menu}
          />
        </div>

        {/* Desktop sidebar — unchanged */}
        <aside className="hidden lg:block">
          <nav className="sticky top-20 space-y-1 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-elevated)]/80 p-2">
            {adminSections.map((s) => {
              const Icon = sectionIcons[s.id];
              const label = locale === "ar" ? s.labelAr : s.labelEn;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSection(s.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-start text-sm font-medium transition cursor-pointer",
                    section === s.id
                      ? "bg-[var(--pitch-dim)] text-[var(--pitch)]"
                      : "text-[var(--text-secondary)] hover:bg-white/4 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 space-y-4" key={section}>

          {section === "overview" ? (
            <>
              <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                {adminStats.map((stat) => (
                  <Card key={stat.labelEn} padding="sm">
                    <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                      {locale === "ar" ? stat.labelAr : stat.labelEn}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-white numeric-ltr">
                      {stat.value}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-xs font-semibold",
                        stat.trend === "up" && "text-[var(--pitch)]",
                        stat.trend === "down" && "text-[var(--danger)]",
                        stat.trend === "flat" && "text-[var(--text-muted)]"
                      )}
                    >
                      {stat.change}
                    </p>
                  </Card>
                ))}
              </div>
              <Card>
                <h2 className="font-semibold text-white">{t.admin.recentActivity}</h2>
                <ul className="mt-3 space-y-3">
                  {adminActivity.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-white">
                          {locale === "ar" ? item.textAr : item.textEn}
                        </p>
                        <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                          {locale === "ar" ? item.timeAr : item.timeEn}
                        </p>
                      </div>
                      <Badge className="shrink-0">{item.type}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          ) : null}

          {section === "matches" ? (
            <Card>
              <h2 className="font-semibold text-white">{t.admin.sections.matches}</h2>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{t.admin.sampleNote}</p>
              <div className="mt-4 rounded-xl border border-[var(--border-soft)] bg-black/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-white latin-meta">
                    Barcelona vs Real Madrid
                  </p>
                  <Badge tone="warning">upcoming</Badge>
                </div>
                <p className="mt-2 text-sm text-[var(--text-secondary)] numeric-ltr">
                  {formatKickoff(upcomingMatch.kickoff, locale)} ·{" "}
                  {locale === "ar" ? upcomingMatch.venueAr : upcomingMatch.venue}
                </p>
                <Button className="mt-4" variant="secondary" onClick={productionAction}>
                  {locale === "ar" ? "نشر مباراة" : "Publish match"}
                </Button>
              </div>
            </Card>
          ) : null}

          {section === "predictions" ? (
            <Card>
              <h2 className="font-semibold text-white">{t.admin.sections.predictions}</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <MiniStat label={locale === "ar" ? "اليوم" : "Today"} value="3,214" />
                <MiniStat
                  label={locale === "ar" ? "هذا الأسبوع" : "This week"}
                  value="18,902"
                />
                <MiniStat
                  label={locale === "ar" ? "دقة متوسطة" : "Avg accuracy"}
                  value="63%"
                />
              </div>
              <Button className="mt-4" variant="secondary" onClick={productionAction}>
                {locale === "ar" ? "تصدير التوقعات" : "Export predictions"}
              </Button>
            </Card>
          ) : null}

          {section === "challenges" || section === "phrases" ? (
            <Card>
              <h2 className="font-semibold text-white">
                {section === "phrases"
                  ? t.admin.sections.phrases
                  : t.admin.sections.challenges}
              </h2>
              <ul className="mt-4 space-y-2">
                {challenges.slice(0, 4).map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-soft)] bg-black/20 px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {locale === "ar" ? c.titleAr : c.titleEn}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        +{c.xpReward} XP · {c.status}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={productionAction}>
                      {locale === "ar" ? "تعديل" : "Edit"}
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {section === "users" ? (
            <Card>
              <h2 className="font-semibold text-white">{t.admin.sections.users}</h2>
              <div className="mt-4 space-y-2">
                {adminUsers.map((user) => (
                  <div
                    key={user.username}
                    className="flex items-center justify-between gap-3 rounded-xl bg-black/25 px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="latin-meta text-sm font-semibold text-white">
                        @{user.username}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] numeric-ltr">
                        {formatNumber(user.xp, locale)} XP · {user.clubId} · {user.status}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={productionAction}>
                      {locale === "ar" ? "عرض" : "View"}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {section === "rewards" ? (
            <Card>
              <h2 className="font-semibold text-white">{t.admin.sections.rewards}</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {locale === "ar"
                  ? "باقات الولاء، مكافآت اليوتيوب، وجوائز نهاية الموسم."
                  : "Loyalty packs, YouTube bonuses, and season-end prizes."}
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <MiniStat label={locale === "ar" ? "باقات نشطة" : "Active packs"} value="6" />
                <MiniStat
                  label={locale === "ar" ? "تم الصرف هذا الشهر" : "Redeemed MoM"}
                  value="412"
                />
              </div>
              <Button className="mt-4" variant="secondary" onClick={productionAction}>
                {locale === "ar" ? "إنشاء مكافأة" : "Create reward"}
              </Button>
            </Card>
          ) : null}

          {section === "suspicious" ? (
            <Card>
              <h2 className="font-semibold text-white">{t.admin.sections.suspicious}</h2>
              <ul className="mt-4 space-y-3">
                {[
                  {
                    en: "Account xp_spike_22 — unusual XP gain in 8 minutes",
                    ar: "الحساب xp_spike_22 — ارتفاع غير اعتيادي خلال 8 دقائق",
                  },
                  {
                    en: "Duplicate phrase submissions from same IP cluster",
                    ar: "إرسال عبارات مكررة من مجموعة عناوين IP متشابهة",
                  },
                  {
                    en: "Prediction bot pattern flagged on matchday board",
                    ar: "نمط بوت توقعات على لوحة الجولة",
                  },
                ].map((item) => (
                  <li
                    key={item.en}
                    className="rounded-xl border border-[rgba(255,92,108,0.25)] bg-[rgba(255,92,108,0.08)] px-3 py-3 text-sm text-white"
                  >
                    {locale === "ar" ? item.ar : item.en}
                    <div className="mt-2">
                      <Button variant="ghost" size="sm" onClick={productionAction}>
                        {locale === "ar" ? "مراجعة" : "Review"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {section === "leaderboard" ? (
            <Card>
              <h2 className="font-semibold text-white">{t.admin.sections.leaderboard}</h2>
              <ul className="mt-4 space-y-1">
                {leaderboards.season.slice(0, 8).map((e) => (
                  <li
                    key={e.username}
                    className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-white/4"
                  >
                    <span className="latin-meta text-white">
                      #{e.rank} {e.username}
                    </span>
                    <span className="tabular-nums text-[var(--pitch)] numeric-ltr">
                      {formatNumber(e.xp, locale)}
                    </span>
                  </li>
                ))}
              </ul>
              <Button className="mt-4" variant="secondary" onClick={productionAction}>
                {locale === "ar" ? "إعادة احتساب" : "Recalculate"}
              </Button>
            </Card>
          ) : null}

          {section === "statistics" ? (
            <Card>
              <h2 className="font-semibold text-white">{t.admin.sections.statistics}</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <MiniStat label="DAU" value="4.8k" />
                <MiniStat
                  label={locale === "ar" ? "معدل الاحتفاظ" : "Retention D7"}
                  value="41%"
                />
                <MiniStat
                  label={locale === "ar" ? "إكمال التحديات" : "Challenge clear"}
                  value="57%"
                />
                <MiniStat
                  label={locale === "ar" ? "متوسط XP" : "Avg XP / fan"}
                  value="612"
                />
              </div>
              <p className="mt-4 text-xs text-[var(--text-muted)]">{t.admin.sampleNote}</p>
            </Card>
          ) : null}
        </div>
      </div>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function AdminMobileNav({
  section,
  onChange,
  label,
}: {
  section: SectionId;
  onChange: (id: SectionId) => void;
  label: string;
}) {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const CurrentIcon = sectionIcons[section];

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

  // Closed state = exactly one compact trigger row. Options only exist while open.
  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center gap-2 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-panel)] px-3 text-start cursor-pointer"
      >
        <CurrentIcon className="h-4 w-4 shrink-0 text-[var(--pitch)]" />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
          {label}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+4px)] z-[var(--z-modal)] max-h-[min(55dvh,20rem)] overflow-y-auto overscroll-contain rounded-xl border border-[var(--border-strong)] bg-[#0d1422] py-1 shadow-2xl"
        >
          {adminSections.map((s) => {
            const Icon = sectionIcons[s.id];
            const itemLabel = locale === "ar" ? s.labelAr : s.labelEn;
            const active = s.id === section;
            return (
              <li key={s.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(s.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-start text-sm cursor-pointer",
                    active
                      ? "bg-[var(--pitch-dim)] text-[var(--pitch)]"
                      : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{itemLabel}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-3">
      <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 font-display text-xl font-bold text-white numeric-ltr">{value}</p>
    </div>
  );
}
