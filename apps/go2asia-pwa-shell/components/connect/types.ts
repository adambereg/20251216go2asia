/**
 * Connect Asia - Types
 * Типы для read-only активности и мягкой геймификации Go2Asia.
 * Legacy G2A/NFT fields below are future-only metadata and must not be surfaced as active Path A economy.
 */

// =============================================================================
// Базовые типы
// =============================================================================

/** Модуль экосистемы Go2Asia */
export type ModuleType = 'space' | 'atlas' | 'pulse' | 'rf' | 'quest' | 'guru';

/** Legacy currency metadata; G2A is Path B/future-only in current UI */
export type Currency = 'points' | 'g2a';

/** Тип транзакции */
export type TransactionType = 'credit' | 'debit';

/** Legacy rarity metadata for off-chain badge previews; not NFT ownership */
export type NFTRarity = 'common' | 'rare' | 'legendary';

/** Статус достижения */
export type AchievementStatus = 'locked' | 'in_progress' | 'completed';

/** Статус миссии */
export type MissionStatus = 'new' | 'in_progress' | 'completed' | 'expired';

/** Тип миссии */
export type MissionType = 'daily' | 'weekly' | 'seasonal';

/** Тип реферала */
export type ReferralType = 'user' | 'partner';

/** Статус реферала в воронке и earnings read model */
export type ReferralFunnelStage =
  | 'registered'
  | 'active'
  | 'completed_mission'
  | 'inactive'
  | 'pending'
  | 'activated'
  | 'rewarded'
  | 'reward_missing';

// =============================================================================
// Балансы
// =============================================================================

export interface Balances {
  points: number;
  g2a: number;
  nft_count: number;
  nft_legendary_count?: number;
}

// =============================================================================
// Уровни и XP
// =============================================================================

export interface Level {
  current: number;
  xp: number;
  next_level_xp: number;
  multiplier: number;
  bonuses?: LevelBonus[];
}

export interface LevelBonus {
  type: 'reward_multiplier' | 'seasonal_access' | 'premium_feature';
  value: number | boolean;
  description: string;
}

// =============================================================================
// Транзакции
// =============================================================================

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  module: ModuleType;
  description: string;
  created_at: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// =============================================================================
// Participation preview metadata, not reward grants
// =============================================================================

export interface Reward {
  points?: number;
  g2a?: number;
  nft?: string;
}

/** Alias for new bounded surfaces; legacy `Reward` remains for compatibility and is not a grant authority. */
export type ParticipationPreview = Reward;

// =============================================================================
// Достижения
// =============================================================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  max_progress: number;
  status: AchievementStatus;
  reward: Reward;
  hint?: string;
  image: string;
  module?: ModuleType;
}

export interface BadgeAchievement {
  key: string;
  title: string;
  description: string;
  category: string;
  iconKey?: string | null;
  awardedAt?: string | null;
  isEarned: boolean;
  emptyHint?: string;
}

// =============================================================================
// Off-chain badge metadata; interface name is legacy and does not imply NFT ownership
// =============================================================================

export interface NFTBadge {
  id: string;
  name: string;
  description: string;
  rarity: NFTRarity;
  image: string;
  module: ModuleType;
  unlocked_at?: string;
  conditions: string;
  can_upgrade: boolean;
}

/** Alias for new imports; legacy `NFTBadge` remains off-chain metadata, not NFT ownership. */
export type OffChainBadgePreview = NFTBadge;

// =============================================================================
// Миссии
// =============================================================================

export interface Mission {
  id: string;
  title: string;
  description: string;
  module: ModuleType;
  type: MissionType;
  reward: Reward;
  deadline?: string;
  progress: number;
  max_progress: number;
  status: MissionStatus;
  deeplink: string;
}

// =============================================================================
// Рефералы
// =============================================================================

export interface Referral {
  id: string;
  type: ReferralType;
  name: string;
  avatar?: string;
  status: ReferralFunnelStage;
  /**
   * Двухуровневая система:
   * - если поле пустое → это прямой реферал
   * - если задано → это субреферал (реферал вашего реферала)
   */
  parent_referral_id?: string;
  earned_rewards: {
    points: number;
    g2a: number;
  };
  invited_at: string;
  activated_at?: string | null;
  points_applied_at?: string | null;
  status_helper_text?: string;
  missions_completed?: number;
  missions_total?: number;
}

export interface ReferralStats {
  total_users: number;
  total_partners: number;
  earned_points: number;
  earned_g2a: number;
  activated_referrals?: number;
  pending_referrals?: number;
}

// =============================================================================
// Сезоны
// =============================================================================

export interface Season {
  id: string;
  name: string;
  days_left: number;
  ends_at: string;
  leaderboard_position?: number;
  points_in_season?: number;
}

// =============================================================================
// Next Actions (Рекомендуемые действия)
// =============================================================================

export interface NextAction {
  id: string;
  title: string;
  description: string;
  module: ModuleType;
  reward: Reward;
  deeplink: string;
}

// =============================================================================
// Dashboard данные
// =============================================================================

export interface DashboardData {
  balances: Balances;
  level: Level;
  season: Season;
  next_actions: NextAction[];
  recent_transactions: Transaction[];
  nearby_achievements?: Achievement[];
}

// =============================================================================
// Wallet данные
// =============================================================================

export interface WalletData {
  balance: Balances;
  transactions: Transaction[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  };
}

/** Alias for new imports; legacy `WalletData` remains a read-only Connect activity projection. */
export type ConnectActivityProjectionData = WalletData;

export interface NFTWalletData {
  nft_count: number;
  nfts: NFTBadge[];
  filters?: {
    rarity: NFTRarity[];
    modules: ModuleType[];
  };
}

/** Alias for future-safe badge collection previews; legacy name is compatibility-only. */
export type BadgeCollectionPreviewData = NFTWalletData;

// =============================================================================
// Levels данные
// =============================================================================

export interface LevelsData {
  level: Level;
  achievements: Achievement[];
  season?: Season;
}

// =============================================================================
// Referrals данные
// =============================================================================

export interface ReferralsData {
  stats: ReferralStats;
  referrals: Referral[];
  referral_code?: string;
  referral_link: string;
  referral_qr?: string;
}

// =============================================================================
// Missions данные
// =============================================================================

export interface MissionsData {
  missions: Mission[];
  filters?: {
    modules: ModuleType[];
    types: MissionType[];
    statuses: MissionStatus[];
  };
}

// =============================================================================
// Analytics данные
// =============================================================================

export interface PointsChartData {
  date: string;
  points: number;
}

export interface SourceContribution {
  points: number;
  percentage: number;
}

export interface AnalyticsData {
  period: string;
  points_chart: {
    data: PointsChartData[];
  };
  sources: Record<ModuleType, SourceContribution>;
  referral_contribution: {
    points: number;
    g2a: number;
    percentage_of_total: number;
  };
  season_pulse?: {
    position: number;
    points_in_season: number;
    trend: 'up' | 'down' | 'stable';
    forecast_to_goal?: number;
  };
}

// =============================================================================
// Event Ingest (для будущей интеграции)
// =============================================================================

export interface EventIngestRequest {
  event_type: string;
  module: ModuleType;
  user_id: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface EventIngestResponse {
  status: 'processed' | 'rejected' | 'pending';
  reward?: Reward;
  transaction_id?: string;
  error?: string;
}

// =============================================================================
// Утилиты для работы с модулями
// =============================================================================

export const MODULE_LABELS: Record<ModuleType, string> = {
  space: 'Space',
  atlas: 'Atlas',
  pulse: 'Pulse',
  rf: 'Russian Friendly',
  quest: 'Quest',
  guru: 'Guru',
};

export const MODULE_ICONS: Record<ModuleType, string> = {
  space: 'Users',
  atlas: 'Map',
  pulse: 'Calendar',
  rf: 'Handshake',
  quest: 'Target',
  guru: 'MapPin',
};

export const NFT_RARITY_COLORS: Record<NFTRarity, string> = {
  common: 'gray',
  rare: 'blue',
  legendary: 'purple',
};

export const NFT_RARITY_LABELS: Record<NFTRarity, string> = {
  common: 'Обычный',
  rare: 'Редкий',
  legendary: 'Легендарный',
};

