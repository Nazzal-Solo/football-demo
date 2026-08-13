import { clsx, type ClassValue } from "clsx";
import { clubs } from "@/lib/data/mock";
import type { ClubId, Locale, Player } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(value);
}

export function clubName(clubId: ClubId, locale: Locale) {
  const club = clubs[clubId];
  return locale === "ar" ? club.nameAr : club.nameEn;
}

export function clubShort(clubId: ClubId, locale: Locale) {
  const club = clubs[clubId];
  return locale === "ar" ? club.shortAr : club.shortEn;
}

export function playerName(player: Player, locale: Locale) {
  return locale === "ar" ? player.nameAr : player.nameEn;
}

export function formatScoreline(
  homeName: string,
  homeScore: number,
  awayScore: number,
  awayName: string
) {
  return `${homeName} ${homeScore} – ${awayScore} ${awayName}`;
}

const EN_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Deterministic date/time string — avoids Node vs browser Intl punctuation differences. */
export function formatDateTime(iso: string, locale: Locale) {
  const date = new Date(iso);

  if (locale === "ar") {
    return new Intl.DateTimeFormat("ar-SA", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  const weekday = EN_WEEKDAYS[date.getDay()];
  const day = date.getDate();
  const month = EN_MONTHS[date.getMonth()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${weekday}, ${day} ${month}, ${hours}:${minutes}`;
}

export function formatKickoff(iso: string, locale: Locale) {
  return formatDateTime(iso, locale);
}

export function getCountdownParts(targetIso: string, now = Date.now()) {
  const diff = Math.max(0, new Date(targetIso).getTime() - now);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalSeconds };
}

export function countryFlag(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function clampScore(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}
