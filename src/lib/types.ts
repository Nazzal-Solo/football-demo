export type Locale = "en" | "ar";
export type ClubId = "barcelona" | "real-madrid";
export type LeaderboardPeriod = "season" | "monthly" | "matchday" | "allTime";
export type ChallengeStatus = "active" | "completed" | "locked" | "expired";
export type ChallengeType =
  | "secret-phrase"
  | "trivia"
  | "match-question"
  | "el-clasico";
export type PredictionResult = "won" | "partial" | "lost";
export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface Club {
  id: ClubId;
  nameEn: string;
  nameAr: string;
  shortEn: string;
  shortAr: string;
  primary: string;
  secondary: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarInitials: string;
  country: string;
  countryCode: string;
  clubId: ClubId;
  level: number;
  xp: number;
  xpToNextLevel: number;
  loyaltyPoints: number;
  seasonRank: number;
  monthlyRank: number;
  streak: number;
  predictionAccuracy: number;
  totalPredictions: number;
  correctPredictions: number;
}

export interface Match {
  id: string;
  homeClubId: ClubId;
  awayClubId: ClubId;
  competition: string;
  competitionAr: string;
  kickoff: string;
  predictionClosesAt: string;
  venue: string;
  venueAr: string;
  status: "upcoming" | "live" | "finished";
  tagEn?: string;
  tagAr?: string;
}

export interface Player {
  id: string;
  nameEn: string;
  nameAr: string;
  clubId: ClubId;
  position: string;
  shirtNumber: number;
}

export interface PredictionHistoryItem {
  id: string;
  matchLabel: string;
  matchLabelAr: string;
  predictedScore: string;
  actualScore: string;
  result: PredictionResult;
  xpEarned: number;
  date: string;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  xpReward: number;
  loyaltyReward: number;
  status: ChallengeStatus;
  deadline?: string;
  videoTitle?: string;
  videoTitleAr?: string;
  correctPhrase?: string;
  options?: { id: string; labelEn: string; labelAr: string }[];
  correctOptionId?: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  countryCode: string;
  clubId: ClubId;
  xp: number;
  movement: number;
  isCurrentUser?: boolean;
}

export interface Achievement {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
  rarity: AchievementRarity;
}

export interface AdminStat {
  labelEn: string;
  labelAr: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
}

export interface AdminActivity {
  id: string;
  textEn: string;
  textAr: string;
  timeEn: string;
  timeAr: string;
  type: string;
}

export interface DemoPrediction {
  matchId: string;
  homeScore: number;
  awayScore: number;
  firstScorerId: string;
  motmId: string;
  submittedAt: string;
}
