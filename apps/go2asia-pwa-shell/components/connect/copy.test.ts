import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  CONNECT_DEFAULT_HERO_DESCRIPTION,
  CONNECT_FUTURE_BADGE_TEXT,
  CONNECT_POINTS_ACTIVITY_DESCRIPTION,
  CONNECT_POINTS_BUCKET_LABELS,
  CONNECT_POINTS_EARNED_LABEL,
  getConnectLedgerActionLabel,
  getConnectLedgerSourceLabel,
} from './copy';

function readAppFile(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('connect copy helpers', () => {
  it('keeps ledger action labels in projection-safe wording', () => {
    expect(getConnectLedgerActionLabel('quest_completed')).toBe('Задание в Quest Asia завершено');
    expect(getConnectLedgerActionLabel('rf_voucher_redeemed')).toBe('RF-ваучер: lifecycle projection');
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
    expect(CONNECT_POINTS_BUCKET_LABELS.unlockableEstimate).toBe('Оценка разблокировки (projection)');
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

  it('keeps active Connect projection surfaces labeled as non-authoritative projections', () => {
    const activeFiles = [
      'app/(authenticated)/connect/page.tsx',
      'app/(authenticated)/connect/activity/page.tsx',
      'app/(authenticated)/connect/wallet/page.tsx',
      'app/(authenticated)/connect/referrals/page.tsx',
      'app/(authenticated)/connect/levels/page.tsx',
      'components/connect/Dashboard/DashboardView.tsx',
      'components/connect/Dashboard/DashboardContent.tsx',
      'components/connect/Dashboard/BalanceCards.tsx',
      'components/connect/Dashboard/ActivityFeed.tsx',
      'components/connect/Dashboard/ConnectRfSection.tsx',
      'components/connect/Dashboard/VoucherSummaryCard.tsx',
      'components/connect/Dashboard/RfEconomicMeaningCard.tsx',
      'components/connect/Dashboard/RfVoucherProjectionPanel.tsx',
      'components/connect/Wallet/WalletView.tsx',
      'components/connect/Wallet/TransactionList.tsx',
      'components/connect/Referrals/ReferralsView.tsx',
      'components/connect/Referrals/ReferralsContent.tsx',
      'components/connect/Levels/LevelsView.tsx',
      'components/connect/Levels/AchievementsList.tsx',
      'components/connect/Levels/AchievementCard.tsx',
      'components/connect/Missions/MissionsView.tsx',
      'components/connect/Analytics/AnalyticsView.tsx',
    ];
    const files = activeFiles.map(readAppFile).join('\n');

    expect(files).toContain('Read-only dashboard projection');
    expect(files).toContain('не receipt');
    expect(files).toContain('не proof');
    expect(files).toContain('Points projection');
    expect(files).toContain('Transaction-like rows are read-only activity references');
    expect(files).toContain('RF lifecycle projection');
    expect(files).toContain('Badge projection only');

    expect(files).not.toMatch(/proofClass|sourceOwner|ownerFactRef|dataFreshness|stalenessStatus|projectionGeneratedAt|isProof|isReceipt|isAuthoritative|asOf/);
    expect(files).not.toMatch(/wallet balance|balance updated|NFT ownership|credited|settled|cashback|payout/i);
  });
});
