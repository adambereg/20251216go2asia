import { describe, expect, it } from 'vitest';
import type { RfVoucherDto } from '@go2asia/sdk/rf';
import { selectRfVoucherProjection } from './connectRfProjection';

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
});
