import type { Match, Player } from "@/lib/types";

/**
 * Central squad source of truth for prediction selectors.
 * First scorer + MOTM both map from this list.
 */
export const players: Player[] = [
  // Barcelona — first team
  { id: "bar-1", nameEn: "Marc-André ter Stegen", nameAr: "مارك أندريه تير شتيغن", clubId: "barcelona", position: "GK", shirtNumber: 1 },
  { id: "bar-13", nameEn: "Iñaki Peña", nameAr: "إيناكي بينيا", clubId: "barcelona", position: "GK", shirtNumber: 13 },
  { id: "bar-25", nameEn: "Wojciech Szczęsny", nameAr: "فويتشيك شتشيسني", clubId: "barcelona", position: "GK", shirtNumber: 25 },
  { id: "bar-3", nameEn: "Alejandro Balde", nameAr: "أليخاندرو بالدي", clubId: "barcelona", position: "LB", shirtNumber: 3 },
  { id: "bar-4", nameEn: "Ronald Araújo", nameAr: "رونالد أراوخو", clubId: "barcelona", position: "CB", shirtNumber: 4 },
  { id: "bar-5", nameEn: "Iñigo Martínez", nameAr: "إينيغو مارتينيز", clubId: "barcelona", position: "CB", shirtNumber: 5 },
  { id: "bar-23", nameEn: "Jules Koundé", nameAr: "جولس كوندى", clubId: "barcelona", position: "RB", shirtNumber: 23 },
  { id: "bar-24", nameEn: "Eric García", nameAr: "إريك غارسيا", clubId: "barcelona", position: "CB", shirtNumber: 24 },
  { id: "bar-2", nameEn: "Pau Cubarsí", nameAr: "باو كوبارسي", clubId: "barcelona", position: "CB", shirtNumber: 2 },
  { id: "bar-35", nameEn: "Gerard Martín", nameAr: "جيرارد مارتين", clubId: "barcelona", position: "LB", shirtNumber: 35 },
  { id: "bar-18", nameEn: "Andreas Christensen", nameAr: "أندرياس كريستنسن", clubId: "barcelona", position: "CB", shirtNumber: 15 },
  { id: "bar-8", nameEn: "Pedri", nameAr: "بيدري", clubId: "barcelona", position: "CM", shirtNumber: 8 },
  { id: "bar-6", nameEn: "Gavi", nameAr: "غافي", clubId: "barcelona", position: "CM", shirtNumber: 6 },
  { id: "bar-21", nameEn: "Frenkie de Jong", nameAr: "فرينكي دي يونغ", clubId: "barcelona", position: "CM", shirtNumber: 21 },
  { id: "bar-17", nameEn: "Marc Casadó", nameAr: "مارك كاسادو", clubId: "barcelona", position: "DM", shirtNumber: 17 },
  { id: "bar-20", nameEn: "Dani Olmo", nameAr: "داني أولمو", clubId: "barcelona", position: "AM", shirtNumber: 20 },
  { id: "bar-16", nameEn: "Fermín López", nameAr: "فيرمين لوبيز", clubId: "barcelona", position: "CM", shirtNumber: 16 },
  { id: "bar-22", nameEn: "Pablo Torre", nameAr: "بابلو توري", clubId: "barcelona", position: "AM", shirtNumber: 22 },
  { id: "bar-28", nameEn: "Marc Bernal", nameAr: "مارك بيرنال", clubId: "barcelona", position: "DM", shirtNumber: 28 },
  { id: "bar-19", nameEn: "Lamine Yamal", nameAr: "لامين يامال", clubId: "barcelona", position: "RW", shirtNumber: 19 },
  { id: "bar-11", nameEn: "Raphinha", nameAr: "رافينيا", clubId: "barcelona", position: "LW", shirtNumber: 11 },
  { id: "bar-9", nameEn: "Robert Lewandowski", nameAr: "روبرت ليفاندوفسكي", clubId: "barcelona", position: "ST", shirtNumber: 9 },
  { id: "bar-7", nameEn: "Ferran Torres", nameAr: "فيران توريس", clubId: "barcelona", position: "FW", shirtNumber: 7 },
  { id: "bar-14", nameEn: "Pau Víctor", nameAr: "باو فيكتور", clubId: "barcelona", position: "ST", shirtNumber: 14 },
  { id: "bar-10", nameEn: "Ansu Fati", nameAr: "أنسو فاتي", clubId: "barcelona", position: "LW", shirtNumber: 10 },

  // Real Madrid — first team
  { id: "rma-1", nameEn: "Thibaut Courtois", nameAr: "تيبو كورتوا", clubId: "real-madrid", position: "GK", shirtNumber: 1 },
  { id: "rma-13", nameEn: "Andriy Lunin", nameAr: "أندري لونين", clubId: "real-madrid", position: "GK", shirtNumber: 13 },
  { id: "rma-2", nameEn: "Dani Carvajal", nameAr: "داني كارفاخال", clubId: "real-madrid", position: "RB", shirtNumber: 2 },
  { id: "rma-3", nameEn: "Éder Militão", nameAr: "إيدر ميليتاو", clubId: "real-madrid", position: "CB", shirtNumber: 3 },
  { id: "rma-4", nameEn: "David Alaba", nameAr: "ديفيد ألابا", clubId: "real-madrid", position: "CB", shirtNumber: 4 },
  { id: "rma-22", nameEn: "Antonio Rüdiger", nameAr: "أنطونيو روديغر", clubId: "real-madrid", position: "CB", shirtNumber: 22 },
  { id: "rma-18", nameEn: "Jesús Vallejo", nameAr: "خيسوس فاليخو", clubId: "real-madrid", position: "CB", shirtNumber: 18 },
  { id: "rma-20", nameEn: "Fran García", nameAr: "فران غارسيا", clubId: "real-madrid", position: "LB", shirtNumber: 20 },
  { id: "rma-12", nameEn: "Trent Alexander-Arnold", nameAr: "ترينت ألكسندر-أرنولد", clubId: "real-madrid", position: "RB", shirtNumber: 12 },
  { id: "rma-23", nameEn: "Ferland Mendy", nameAr: "فيرلاند ميندي", clubId: "real-madrid", position: "LB", shirtNumber: 23 },
  { id: "rma-17", nameEn: "Lucas Vázquez", nameAr: "لوكاس فاسكيز", clubId: "real-madrid", position: "RB", shirtNumber: 17 },
  { id: "rma-5", nameEn: "Jude Bellingham", nameAr: "جود بلينغهام", clubId: "real-madrid", position: "CM", shirtNumber: 5 },
  { id: "rma-8", nameEn: "Federico Valverde", nameAr: "فيديريكو فالفيردي", clubId: "real-madrid", position: "CM", shirtNumber: 8 },
  { id: "rma-14", nameEn: "Aurélien Tchouaméni", nameAr: "أوريلين تشواميني", clubId: "real-madrid", position: "DM", shirtNumber: 14 },
  { id: "rma-6", nameEn: "Eduardo Camavinga", nameAr: "إدواردو كامافينغا", clubId: "real-madrid", position: "CM", shirtNumber: 6 },
  { id: "rma-15", nameEn: "Arda Güler", nameAr: "أردا غولر", clubId: "real-madrid", position: "AM", shirtNumber: 15 },
  { id: "rma-10", nameEn: "Luka Modrić", nameAr: "لوكا مودريتش", clubId: "real-madrid", position: "CM", shirtNumber: 10 },
  { id: "rma-19", nameEn: "Dani Ceballos", nameAr: "داني سيبايوس", clubId: "real-madrid", position: "CM", shirtNumber: 19 },
  { id: "rma-7", nameEn: "Vinícius Jr.", nameAr: "فينيسيوس جونيور", clubId: "real-madrid", position: "LW", shirtNumber: 7 },
  { id: "rma-9", nameEn: "Kylian Mbappé", nameAr: "كيليان مبابي", clubId: "real-madrid", position: "ST", shirtNumber: 9 },
  { id: "rma-11", nameEn: "Rodrygo", nameAr: "رودريغو", clubId: "real-madrid", position: "RW", shirtNumber: 11 },
  { id: "rma-16", nameEn: "Endrick", nameAr: "إندريك", clubId: "real-madrid", position: "ST", shirtNumber: 16 },
  { id: "rma-21", nameEn: "Brahim Díaz", nameAr: "براهيم دياز", clubId: "real-madrid", position: "AM", shirtNumber: 21 },
  { id: "rma-24", nameEn: "Franco Mastantuono", nameAr: "فرانكو ماستانتونو", clubId: "real-madrid", position: "AM", shirtNumber: 30 },
];

export function getPlayersForMatch(match: Pick<Match, "homeClubId" | "awayClubId">): Player[] {
  return players.filter(
    (p) => p.clubId === match.homeClubId || p.clubId === match.awayClubId
  );
}

export function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}
