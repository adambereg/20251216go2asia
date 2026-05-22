export const CONNECT_DEFAULT_HERO_DESCRIPTION =
  'Read-only projection активности, внутренних Points и off-chain бейджей Go2Asia';

export const CONNECT_POINTS_ACTIVITY_DESCRIPTION =
  'Read-only projection по backend-событиям Go2Asia. Не Points_row, не receipt и не финансовый wallet.';

export const CONNECT_POINTS_EARNED_LABEL = 'Points по backend-событиям (projection)';

export const CONNECT_POINTS_BUCKET_LABELS = {
  available: 'Points с внутренней доступностью',
  locked: 'Points с условиями',
  network: 'Связанные с приглашениями',
  unlockableEstimate: 'Оценка разблокировки',
} as const;

const CONNECT_LEDGER_ACTION_LABELS: Record<string, string> = {
  registration: 'Регистрация',
  first_login: 'Первый вход',
  quest_completed: 'Задание в Quest Asia завершено',
  referral_bonus_referrer: 'Referral Points projection',
  referral_bonus_referee: 'Referral registration projection',
  event_registration: 'Регистрация на событие',
  space_post_created: 'Публикация в Space',
  rf_voucher_redeemed: 'RF-ваучер использован',
  rielt_listing_created: 'Объявление в Rielt',
  badge_awarded: 'Бейдж отражён в Connect',
};

const CONNECT_LEDGER_SOURCE_LABELS: Record<string, string> = {
  'quest-service': 'Quest Asia',
  'referral-service': 'Сервис приглашений',
  'points-service': 'Points',
  'content-service': 'Go2Asia',
  'pulse-service': 'Pulse Asia',
  'space-service': 'Space Asia',
  'rf-service': 'Russian Friendly',
  'rielt-service': 'Rielt Market',
};

export function getConnectLedgerActionLabel(action: string): string {
  return CONNECT_LEDGER_ACTION_LABELS[action] ?? 'Активность Go2Asia';
}

export function getConnectLedgerSourceLabel(sourceService: string | null): string {
  if (!sourceService) return 'Go2Asia';
  return CONNECT_LEDGER_SOURCE_LABELS[sourceService] ?? 'Go2Asia';
}

export const CONNECT_FUTURE_BADGE_TEXT = 'Планируется';
