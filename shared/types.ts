export type Quality = 'common' | 'rare' | 'epic' | 'legendary';
export type WeddingStyle = 'fairyTale' | 'darkFantasy' | 'xianxia' | 'starryNight' | 'oceanDream' | 'forestWonder';
export type WeddingStatus = 'preparing' | 'ongoing' | 'completed';
export type ProposalEventType = 'loveCalamity' | 'heavenlyBlessing' | null;
export type DailyEventType = 'sweet' | 'coldWar' | null;
export type GuildRole = 'president' | 'vicePresident' | 'member' | 'leader' | 'officer';
export type RankingType = 'loveValue' | 'weddingCount' | 'guildContribution';
export type UpgradeRequestStatus = 'pending' | 'approved' | 'rejected';

export interface Player {
  id: string;
  name: string;
  level: number;
  avatar: string;
  class?: string;
  intimacy?: number;
  guildId?: string;
  guildRole?: GuildRole;
}

export interface Item {
  id: string;
  name: string;
  quality: Quality;
  qualityBonus: number;
  icon: string;
  description: string;
  luxuryBonus?: number;
}

export interface ProposalCalculateRequest {
  intimacy: number;
  qualityBonus: number;
}

export interface ProposalCalculateResponse {
  successRate: number;
  intimacyFactor: number;
  qualityBonus: number;
}

export interface ProposalRequest {
  proposerId: string;
  targetId: string;
  tokenItemId: string;
}

export interface ProposalResponse {
  success: boolean;
  successRate: number;
  event: ProposalEventType;
  randomEvent?: string;
  message: string;
  proposalId?: string;
  baseRate: number;
  eventBonus: number;
  finalRate: number;
  rollResult: number;
  eventEffectMessage?: string;
}

export interface Proposal {
  id: string;
  proposerId: string;
  targetId: string;
  tokenItemId: string;
  tokenQuality: Quality;
  intimacyValue: number;
  successRate: number;
  eventType: ProposalEventType;
  success: boolean;
  message: string;
  createdAt: string;
}

export interface Marriage {
  id: string;
  player1Id: string;
  player2Id: string;
  player1?: Player;
  player2?: Player;
  partner1?: Player;
  partner2?: Player;
  partner1Name: string;
  partner2Name: string;
  loveValue: number;
  marryDate: string;
  marriageDays?: number;
  todayEvent: DailyEventType;
  lastDailyClaim: string | null;
  dungeonRemaining: number;
  skills: SkillUnlock[];
  weddingCount: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  requiredLove: number;
  icon: string;
  type?: string;
  effect: Record<string, number>;
}

export interface SkillUnlock {
  id: string;
  skillId: string;
  skill?: Skill;
  unlocked: boolean;
  unlockedAt: string | null;
  requiredLoveValue?: number;
  skillLevel?: number;
}

export interface Decoration {
  id: string;
  itemId?: string;
  itemName?: string;
  name?: string;
  icon?: string;
  cost?: number;
  category?: string;
  positionX?: number;
  positionY?: number;
  luxuryBonus: number;
}

export interface Guest {
  playerId: string;
  player?: Player;
  giftAmount: number;
  message: string;
  blessedAt: string;
}

export interface Wedding {
  id: string;
  marriageId: string;
  marriage?: Marriage;
  partner1?: Player;
  partner2?: Player;
  partner1Name?: string;
  partner2Name?: string;
  style: WeddingStyle;
  decorations: Decoration[];
  luxuryScore: number;
  startTime: string;
  status: WeddingStatus;
  guests: Guest[];
  guestCount?: number;
  blessingPoints: number;
  totalGift: number;
  totalGifts?: number;
  miniGames?: MiniGameResult[];
  createdAt: string;
}

export interface Guild {
  id: string;
  name: string;
  presidentId: string;
  vicePresidentId: string | null;
  president?: Player;
  vicePresident?: Player;
  members: GuildMember[];
  createdAt: string;
}

export interface GuildMember {
  id: string;
  playerId: string;
  player?: Player;
  role: GuildRole;
  contribution: number;
  joinedAt: string;
}

export interface ContributionRecord {
  id: string;
  hallId: string;
  playerId: string;
  player?: Player;
  amount: number;
  createdAt: string;
}

export interface UpgradeRequest {
  id: string;
  hallId: string;
  applicantId: string;
  applicant?: Player;
  fromLevel: number;
  toLevel: number;
  status: UpgradeRequestStatus;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  approverId?: string;
  approver?: Player;
  rejectReason?: string;
}

export interface GuildWeddingHall {
  id: string;
  guildId: string;
  guild?: Guild;
  guildName?: string;
  level: number;
  exp?: number;
  expToNext?: number;
  currentContribution: number;
  upgradeRequired: number;
  luxuryBonus: number;
  dungeonBonus: number;
  pendingApproval?: boolean;
  pendingUpgrade?: boolean;
  upgradeApplicantId?: string | null;
  upgradeApplicant?: Player;
  myContribution?: number;
  upgradeRequests?: UpgradeRequest[];
  contributions: ContributionRecord[];
  leaderName?: string;
}

export interface DailyLoveRecord {
  id: string;
  marriageId: string;
  loveGained: number;
  eventType: DailyEventType;
  createdAt: string;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  weddingStyleHeatmap: Record<WeddingStyle, number>;
  loveValueTrend: { date: string; avg: number }[];
  transactionTrend: { date: string; amount: number }[];
  radarData: {
    proposalSuccess: number;
    marriageHappiness: number;
    weddingLuxury: number;
    loveIndex?: number;
    guildActivity?: number;
    sweetness?: number;
    guildContribution: number;
    activityLevel: number;
  };
  summary: {
    totalProposals: number;
    successRate: number;
    totalWeddings: number;
    avgLuxuryScore: number;
    totalGuildContribution: number;
    totalGifts?: string | number;
  };
}

export interface RankingEntry {
  rank: number;
  id: string;
  name?: string;
  avatar?: string;
  value?: number;
  previousRank?: number;
  player1?: Player;
  player2?: Player;
  player1Name?: string;
  player2Name?: string;
  loveValue?: number;
  weddingCount?: number;
  guildName?: string;
  leaderName?: string;
  totalContribution?: number;
  rankChange?: number;
}

export interface MiniGameResult {
  id: string;
  gameType: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  score: number;
  reward: number;
  timestamp: string;
}

export interface BlessingMessage {
  id?: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  message: string;
  giftAmount: number;
  timestamp?: string;
}

export interface ReportFilter {
  guildId?: string;
  style?: WeddingStyle;
  weekOffset?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
