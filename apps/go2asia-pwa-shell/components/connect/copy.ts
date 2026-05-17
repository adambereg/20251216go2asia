export const CONNECT_DEFAULT_HERO_DESCRIPTION = 'Центр активности, Points и достижений Go2Asia';

export const CONNECT_POINTS_ACTIVITY_DESCRIPTION =
  'Points начисляются за действия в Go2Asia: задания в Quest Asia, события, приглашения и другие подтверждённые активности.';

export const CONNECT_POINTS_EARNED_LABEL = 'Начислено Points';

export const CONNECT_POINTS_BUCKET_LABELS = {
  available: 'Points с внутренней доступностью',
  locked: 'Points с условиями',
  network: 'Связанные с приглашениями',
  unlockableEstimate: 'Оценка условий',
} as const;

const CONNECT_LEDGER_ACTION_LABELS: Record<string, string> = {
  registration: 'Регистрация',
  first_login: 'Первый вход',
  quest_completed: 'Задание в Quest Asia завершено',
  referral_bonus_referrer: 'Начисление за приглашённого пользователя',
  referral_bonus_referee: 'Начисление за регистрацию по приглашению',
  event_registration: 'Регистрация на событие',
  space_post_created: 'Публикация в Space',
  rf_voucher_redeemed: 'RF-ваучер использован',
  rielt_listing_created: 'Объявление в Rielt',
  badge_awarded: 'Бейдж получен',
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
