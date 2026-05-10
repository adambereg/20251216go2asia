import { describe, expect, it } from 'vitest';
import type { RfVoucherDto, RfVoucherSummary } from '@go2asia/sdk/rf';
import {
  buildConnectRfProjection,
  buildRfVoucherTimelineItems,
  formatRfVoucherLabel,
  formatRfVoucherPartnerName,
  hasRfVouchersForConnectDashboard,
  getRfVoucherEffectiveStatus,
  getProjectionVoucherStatusLabel,
  projectionCopyGuardText,
} from './connectRfProjection';

function voucher(overrides: Partial<RfVoucherDto>): RfVoucherDto {
  return {
    id: 'voucher_1',
    offerId: 'offer_1',
    partnerId: 'partner_1',
    issuedToUserId: 'user_1',
    status: 'claimed',
    canonicalStatus: 'available',
    code: 'RF-001',
    claimedAt: '2026-05-05T00:00:00.000Z',
    redeemedAt: null,
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z',
    ...overrides,
  };
}

function summary(overrides: Partial<RfVoucherSummary>): RfVoucherSummary {
  return {
    totalVouchers: 0,
    activeVouchers: 0,
    usedVouchers: 0,
    cancelledVouchers: 0,
    expiredVouchers: 0,
    ...overrides,
  };
}

describe('connect RF projection helpers', () => {
  it('builds summary counts and status groups for read-only projection', () => {
    const projection = buildConnectRfProjection(
      [
        voucher({ id: 'active_1', canonicalStatus: 'available', statusChangedAt: '2026-05-05T03:00:00.000Z' }),
        voucher({ id: 'pending_1', canonicalStatus: 'locked', economyStatus: 'pending' }),
        voucher({ id: 'repeatable_1', canonicalStatus: 'unlocked', repeatPolicySnapshot: 'repeat_after_redeem' }),
        voucher({ id: 'used_1', status: 'redeemed', canonicalStatus: 'redeemed', redeemedAt: '2026-05-05T02:00:00.000Z' }),
        voucher({ id: 'cancelled_1', status: 'cancelled', canonicalStatus: 'cancelled' }),
        voucher({ id: 'expired_1', canonicalStatus: 'expired' }),
      ],
      summary({ totalVouchers: 6, activeVouchers: 3, usedVouchers: 1, cancelledVouchers: 1, expiredVouchers: 1 }),
    );

    expect(projection.summary).toMatchObject({
      total: 6,
      active: 3,
      used: 1,
      unavailable: 2,
      pendingActivation: 1,
      repeatableAvailable: 1,
    });
    expect(projection.groups.active.map((item) => item.id)).toEqual(['active_1', 'pending_1', 'repeatable_1']);
    expect(projection.groups.used.map((item) => item.id)).toEqual(['used_1']);
    expect(projection.groups.unavailable.map((item) => item.id)).toEqual(['cancelled_1', 'expired_1']);
    expect(projection.groups.pendingActivation.map((item) => item.id)).toEqual(['pending_1']);
    expect(projection.groups.repeatableAgain.map((item) => item.id)).toEqual(['repeatable_1']);
  });

  it('counts PRO-attributed vouchers and exposes narrative labels', () => {
    const projection = buildConnectRfProjection([
      voucher({
        id: 'pro_1',
        attribution: {
          capturedAt: '2026-05-05T00:00:00.000Z',
          claimSource: 'pro_shared_link',
          confirmedAt: '2026-05-05T00:01:00.000Z',
          metadata: {},
          proLinkId: 'link_1',
          proUserId: null,
          shareCode: null,
          source: 'pro_link',
          status: 'confirmed',
          strategy: 'rf_pro_last_touch_before_claim',
          version: 1,
        },
      }),
    ]);

    expect(projection.summary.receivedViaPro).toBe(1);
    expect(projection.narrative.bullets.join(' ')).toContain('История RF-активности');
    expect(projection.narrative.bullets.join(' ')).toContain('RF помогает связывать предложения партнёров с действиями пользователя');
  });

  it('uses canonical-first status mapping without raw enums in labels', () => {
    expect(getProjectionVoucherStatusLabel(voucher({ canonicalStatus: 'available' }))).toBe('Активен');
    expect(getProjectionVoucherStatusLabel(voucher({ canonicalStatus: 'locked' }))).toBe('Ожидает активации');
    expect(getProjectionVoucherStatusLabel(voucher({ canonicalStatus: 'unlocked' }))).toBe('Можно получить снова');
    expect(getProjectionVoucherStatusLabel(voucher({ canonicalStatus: 'redeemed', status: 'redeemed' }))).toBe('Использован');
    expect(getProjectionVoucherStatusLabel(voucher({ canonicalStatus: 'cancelled', status: 'cancelled' }))).toBe('Недоступен');
  });

  it('uses summary precedence for has-vouchers checks on dashboard', () => {
    expect(hasRfVouchersForConnectDashboard(summary({ totalVouchers: 2 }), [])).toBe(true);
    expect(hasRfVouchersForConnectDashboard(summary({ totalVouchers: 0 }), [voucher({ id: 'v_1' })])).toBe(false);
    expect(hasRfVouchersForConnectDashboard(undefined, [voucher({ id: 'v_2' })])).toBe(true);
  });

  it('keeps milestone logic in narrative/progress layer only', () => {
    const projection = buildConnectRfProjection([
      voucher({ id: 'active_1', canonicalStatus: 'unlocked' }),
      voucher({ id: 'used_1', status: 'redeemed', canonicalStatus: 'redeemed' }),
      voucher({ id: 'used_2', status: 'redeemed', canonicalStatus: 'redeemed', offerId: 'offer_1', partnerId: 'partner_2' }),
    ]);

    const reached = projection.milestones.filter((item) => item.reached).map((item) => item.id);
    expect(reached).toEqual(expect.arrayContaining(['first_claim', 'first_used', 'multi_partner_used', 'repeat_used_again']));
  });

  it('builds lifecycle timeline items from voucher timestamps', () => {
    const timeline = buildRfVoucherTimelineItems([
      voucher({
        id: 'used_1',
        offer: { id: 'offer_1', title: 'Dinner bonus', benefit: '', terms: '', type: 'gift' },
        partner: { id: 'partner_1', displayName: 'Friendly Cafe' },
        status: 'redeemed',
        canonicalStatus: 'redeemed',
        claimedAt: '2026-05-05T01:00:00.000Z',
        redeemedAt: '2026-05-05T03:00:00.000Z',
      }),
      voucher({
        id: 'active_1',
        claimedAt: '2026-05-05T02:00:00.000Z',
      }),
    ]);

    expect(timeline.map((item) => item.type)).toEqual(['redeemed', 'claimed', 'claimed']);
    expect(timeline[0]).toMatchObject({
      voucherId: 'used_1',
      title: 'Ваучер использован',
      description: 'Dinner bonus · Friendly Cafe',
    });
    expect(Object.keys(timeline[0])).not.toContain('walletAmount');
    expect(Object.keys(timeline[0])).not.toContain('rewardPoints');
  });

  it('uses safe fallback labels for missing offer and partner display fields', () => {
    const fallbackVoucher = voucher({ offer: undefined, partner: undefined });

    expect(formatRfVoucherLabel(fallbackVoucher)).toBe('RF-ваучер');
    expect(formatRfVoucherPartnerName(fallbackVoucher)).toBe('Партнёр RF');
  });

  it('does not include financial/rewards or internal vocabulary in projection copy', () => {
    const text = projectionCopyGuardText().toLowerCase();
    expect(text).not.toMatch(/debit|compensation|recovery|anomaly|spend|externalid|g2a|nft|payout|balance|reward/);
    expect(text).toContain('активные возможности');
    expect(text).toContain('использованные преимущества');
  });

  it('keeps lifecycle helper fallback for legacy status', () => {
    expect(getRfVoucherEffectiveStatus(voucher({ canonicalStatus: undefined }))).toBe('available');
  });
});
