"use client";

import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ClubBadge } from "@/components/ui/ClubBadge";
import { LtrIsolate } from "@/components/ui/DirIsolate";
import { Modal } from "@/components/ui/Modal";
import { clubs } from "@/lib/data/mock";
import { useI18n } from "@/lib/i18n/context";
import type { ClubId, Player } from "@/lib/types";
import { cn, playerName } from "@/lib/utils";

interface PlayerPickerProps {
  label: string;
  players: Player[];
  value: string;
  onChange: (playerId: string) => void;
  accent?: "pitch" | "gold";
}

export function PlayerPicker({
  label,
  players,
  value,
  onChange,
  accent = "pitch",
}: PlayerPickerProps) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [clubFilter, setClubFilter] = useState<"all" | ClubId>("all");

  const selected = players.find((p) => p.id === value);

  const clubIds = useMemo(() => {
    return Array.from(new Set(players.map((p) => p.clubId)));
  }, [players]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return players.filter((p) => {
      if (clubFilter !== "all" && p.clubId !== clubFilter) return false;
      if (!q) return true;
      return `${p.nameEn} ${p.nameAr} ${p.position} ${p.shirtNumber}`
        .toLowerCase()
        .includes(q);
    });
  }, [players, query, clubFilter]);

  const byClub = useMemo(() => {
    const map = new Map<ClubId, Player[]>();
    for (const player of filtered) {
      const list = map.get(player.clubId) ?? [];
      list.push(player);
      map.set(player.clubId, list);
    }
    return map;
  }, [filtered]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setClubFilter("all");
  }, []);

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-white">{label}</p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "player-picker-trigger w-full rounded-2xl border px-3 py-3 text-start transition cursor-pointer",
          selected
            ? accent === "gold"
              ? "border-[rgba(240,193,74,0.45)] bg-[var(--gold-dim)]"
              : "border-[rgba(45,214,123,0.45)] bg-[var(--pitch-dim)]"
            : "border-[var(--border-soft)] bg-[var(--surface-2)] hover:border-[var(--border-strong)]"
        )}
      >
        {selected ? (
          <>
            <LtrIsolate className="player-picker-name truncate text-sm font-semibold text-white">
              {playerName(selected, locale)}
            </LtrIsolate>
            <LtrIsolate className="player-picker-meta text-[11px] text-[var(--text-muted)]">
              {selected.position} · #{selected.shirtNumber}
            </LtrIsolate>
            <div className="player-picker-club">
              <ClubBadge clubId={selected.clubId} compact />
            </div>
            <Badge
              tone={accent === "gold" ? "gold" : "success"}
              className="player-picker-action"
            >
              {t.matches.changePlayer}
            </Badge>
          </>
        ) : (
          <>
            <span className="player-picker-name text-sm text-[var(--text-muted)]">
              {t.matches.selectPlayer}
            </span>
            <Badge tone="muted" className="player-picker-action">
              {t.common.search}
            </Badge>
          </>
        )}
      </button>

      <Modal
        open={open}
        onClose={close}
        title={label}
        subtitle={
          <LtrIsolate>
            {filtered.length}/{players.length}
          </LtrIsolate>
        }
        size="lg"
        sheetOnMobile
        toolbar={
          <div className="space-y-2">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.matches.searchPlayers}
                className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface-2)] py-3 pe-3 ps-10 text-sm outline-none focus:border-[var(--pitch)]"
                dir={locale === "ar" ? "rtl" : "ltr"}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <FilterChip
                active={clubFilter === "all"}
                onClick={() => setClubFilter("all")}
                label={t.common.all}
              />
              {clubIds.map((id) => (
                <FilterChip
                  key={id}
                  active={clubFilter === id}
                  onClick={() => setClubFilter(id)}
                  label={locale === "ar" ? clubs[id].shortAr : clubs[id].shortEn}
                />
              ))}
            </div>
          </div>
        }
        footer={
          <Button variant="secondary" fullWidth onClick={close}>
            {t.common.close}
          </Button>
        }
      >
        <div className="space-y-4">
          {Array.from(byClub.entries()).map(([clubId, list]) => (
            <div key={clubId}>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: clubs[clubId].primary }}
                />
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  {locale === "ar" ? clubs[clubId].nameAr : clubs[clubId].nameEn}
                </p>
              </div>
              <ul className="space-y-1">
                {list.map((player) => {
                  const active = player.id === value;
                  return (
                    <li key={player.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(player.id);
                          close();
                        }}
                        className={cn(
                          "player-picker-row w-full rounded-xl border px-2.5 py-2 text-start transition cursor-pointer sm:px-3 sm:py-2.5",
                          active
                            ? accent === "gold"
                              ? "border-[var(--gold)] bg-[var(--gold-dim)]"
                              : "border-[var(--pitch)] bg-[var(--pitch-dim)]"
                            : "border-transparent bg-[var(--surface-2)] hover:bg-white/[0.06]"
                        )}
                      >
                        <LtrIsolate className="player-picker-name truncate text-sm font-semibold text-white">
                          {playerName(player, locale)}
                        </LtrIsolate>
                        <div className="player-picker-club self-center">
                          <ClubBadge clubId={player.clubId} compact />
                        </div>
                        <LtrIsolate className="player-picker-meta text-[11px] text-[var(--text-muted)]">
                          {player.position} · #{player.shirtNumber}
                        </LtrIsolate>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-[var(--text-muted)]">
              {t.matches.noPlayers}
            </p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-8 rounded-lg px-2.5 text-[11px] font-semibold transition cursor-pointer",
        active ? "bg-[var(--pitch)] text-[#04140c]" : "bg-white/8 text-[var(--text-secondary)]"
      )}
    >
      {label}
    </button>
  );
}
