import { describe, expect, it } from 'vitest';
import type { RfVoucherDto, RfVoucherSummary } from '@go2asia/sdk/rf';
import {
  buildRfEconomicMeaning,
  buildRfVoucherTimelineItems,
  formatRfVoucherLabel,
  formatRfVoucherPartnerName,
  getRfVoucherEffectiveStatus,
  selectRfVoucherProjection,
  splitRfVouchersByProjectionStatus,
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
    ...overrides,
  };
}

describe('connect RF projection helpers', () => {
  it('selects active and used vouchers from RF-provided statuses', () => {
    const projection = selectRfVoucherProjection([
      voucher({ id: 'active_1', statusChangedAt: '2026-05-05T03:00:00.000Z' }),
      voucher({
        id: 'used_1',
        status: 'redeemed',
        canonicalStatus: 'redeemed',
        redeemedAt: '2026-05-05T02:00:00.000Z',
        statusChangedAt: '2026-05-05T02:00:00.000Z',
      }),
      voucher({ id: 'cancelled_1', status: 'cancelled', canonicalStatus: 'cancelled' }),
    ]);

    expect(projection.active.map((item) => item.id)).toEqual(['active_1']);
    expect(projection.used.map((item) => item.id)).toEqual(['used_1']);
  });

  it('classifies active, used, cancelled and other statuses without wallet fields', () => {
    const split = splitRfVouchersByProjectionStatus([
      voucher({ id: 'active_1', canonicalStatus: 'unlocked' }),
      voucher({ id: 'used_1', status: 'redeemed', canonicalStatus: 'redeemed' }),
      voucher({ id: 'cancelled_1', status: 'cancelled', canonicalStatus: 'cancelled' }),
      voucher({ id: 'expired_1', canonicalStatus: 'expired' }),
    ]);

    expect(split.active.map((item) => item.id)).toEqual(['active_1']);
    expect(split.used.map((item) => item.id)).toEqual(['used_1']);
    expect(split.cancelled.map((item) => item.id)).toEqual(['cancelled_1']);
    expect(split.other.map((item) => item.id)).toEqual(['expired_1']);
    expect(getRfVoucherEffectiveStatus(voucher({ canonicalStatus: undefined }))).toBe('available');
  });

  it('limits each projected list independently', () => {
    const projection = selectRfVoucherProjection(
      [
        voucher({ id: 'active_1', statusChangedAt: '2026-05-05T03:00:00.000Z' }),
        voucher({ id: 'active_2', statusChangedAt: '2026-05-05T02:00:00.000Z' }),
        voucher({ id: 'active_3', statusChangedAt: '2026-05-05T01:00:00.000Z' }),
      ],
      2,
    );

    expect(projection.active.map((item) => item.id)).toEqual(['active_1', 'active_2']);
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

  it('builds empty RF economic meaning without money fields', () => {
    const meaning = buildRfEconomicMeaning([], summary({}));

    expect(meaning.state).toBe('empty');
    expect(meaning.ctas).toEqual([{ label: 'Найти предложения', href: '/rf/vouchers' }]);
    expect(Object.keys(meaning)).not.toEqual(expect.arrayContaining(['money', 'walletAmount', 'rewardPoints', 'payout', 'commission', 'tokenValue']));
  });

  it('builds active-only RF economic meaning', () => {
    const meaning = buildRfEconomicMeaning(
      [voucher({ id: 'active_1', canonicalStatus: 'available' })],
      summary({ totalVouchers: 1, activeVouchers: 1 }),
    );

    expect(meaning.state).toBe('active_only');
    expect(meaning.summary).toContain('Используйте ваучер');
    expect(meaning.ctas.map((cta) => cta.href)).toEqual(['/rf/my-vouchers']);
  });

  it('builds used RF economic meaning', () => {
    const meaning = buildRfEconomicMeaning(
      [
        voucher({
          id: 'used_1',
          status: 'redeemed',
          canonicalStatus: 'redeemed',
          redeemedAt: '2026-05-05T03:00:00.000Z',
        }),
      ],
      summary({ totalVouchers: 1, usedVouchers: 1 }),
    );

    expect(meaning.state).toBe('used');
    expect(meaning.summary).toContain('RF-прогресса');
    expect(meaning.ctas.map((cta) => cta.href)).toEqual(['/rf/my-vouchers', '/rf/vouchers']);
  });

  it('builds inactive-only RF economic meaning for cancelled or expired vouchers', () => {
    const meaning = buildRfEconomicMeaning(
      [
        voucher({ id: 'cancelled_1', status: 'cancelled', canonicalStatus: 'cancelled' }),
        voucher({ id: 'expired_1', canonicalStatus: 'expired' }),
      ],
      summary({ totalVouchers: 2, cancelledVouchers: 1 }),
    );

    expect(meaning.state).toBe('inactive_only');
    expect(meaning.ctas).toEqual([{ label: 'Найти предложения', href: '/rf/vouchers' }]);
  });

  it('builds mixed RF economic meaning for active and used vouchers', () => {
    const meaning = buildRfEconomicMeaning(
      [
        voucher({ id: 'active_1', canonicalStatus: 'available' }),
        voucher({
          id: 'used_1',
          status: 'redeemed',
          canonicalStatus: 'redeemed',
          redeemedAt: '2026-05-05T03:00:00.000Z',
        }),
      ],
      summary({ totalVouchers: 2, activeVouchers: 1, usedVouchers: 1 }),
    );

    expect(meaning.state).toBe('mixed');
    expect(meaning.title).toContain('активные возможности');
    expect(meaning.futureNotes).toContain('PRO attribution и выплаты не входят в текущую версию.');
    expect(Object.keys(meaning)).not.toEqual(expect.arrayContaining(['money', 'walletAmount', 'rewardPoints', 'payout', 'commission', 'tokenValue']));
  });
});
