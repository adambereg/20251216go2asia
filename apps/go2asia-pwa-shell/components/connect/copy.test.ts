import { describe, expect, it } from 'vitest';
import {
  CONNECT_DEFAULT_HERO_DESCRIPTION,
  CONNECT_FUTURE_BADGE_TEXT,
  CONNECT_POINTS_ACTIVITY_DESCRIPTION,
  CONNECT_POINTS_BUCKET_LABELS,
  CONNECT_POINTS_EARNED_LABEL,
  getConnectLedgerActionLabel,
  getConnectLedgerSourceLabel,
} from './copy';

describe('connect copy helpers', () => {
  it('keeps ledger action labels in projection-safe wording', () => {
    expect(getConnectLedgerActionLabel('quest_completed')).toBe('Задание в Quest Asia завершено');
    expect(getConnectLedgerActionLabel('rf_voucher_redeemed')).toBe('RF-ваучер использован');
    expect(getConnectLedgerActionLabel('unknown_action')).toBe('Активность Go2Asia');
  });

  it('keeps ledger source labels aligned with user-facing modules', () => {
    expect(getConnectLedgerSourceLabel('referral-service')).toBe('Сервис приглашений');
    expect(getConnectLedgerSourceLabel(null)).toBe('Go2Asia');
    expect(getConnectLedgerSourceLabel('unknown-source')).toBe('Go2Asia');
  });

  it('uses unified non-financial placeholders and bucket labels', () => {
    expect(CONNECT_FUTURE_BADGE_TEXT).toBe('Планируется');
    expect(CONNECT_POINTS_BUCKET_LABELS.locked).toBe('Points с условиями');
    expect(CONNECT_POINTS_BUCKET_LABELS.unlockableEstimate).toBe('Оценка разблокировки');
  });

  it('keeps active connect copy free from payout and token-wallet semantics', () => {
    const text = [
      CONNECT_DEFAULT_HERO_DESCRIPTION,
      CONNECT_POINTS_ACTIVITY_DESCRIPTION,
      CONNECT_POINTS_EARNED_LABEL,
      ...Object.values(CONNECT_POINTS_BUCKET_LABELS),
      getConnectLedgerActionLabel('referral_bonus_referrer'),
      getConnectLedgerActionLabel('rf_voucher_redeemed'),
      getConnectLedgerSourceLabel('points-service'),
      getConnectLedgerSourceLabel('referral-service'),
      CONNECT_FUTURE_BADGE_TEXT,
    ]
      .join(' ')
      .toLowerCase();

    expect(text).not.toMatch(
      /payout|withdraw|topup|usd|bridge|token|nft|g2a|commission|settlement|cash|выплат|вывод|пополн|токен|блокчейн|комисси|доход|заработ/
    );
    expect(text).toContain('points');
  });
});
