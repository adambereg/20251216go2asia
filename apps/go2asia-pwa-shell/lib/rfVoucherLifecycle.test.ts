import { describe, expect, it } from 'vitest';
import type { RfVoucherDto } from '@go2asia/sdk/rf';
import {
  getRfVoucherEffectiveStatus,
  getRfVoucherStatusBadgeClass,
  getRfVoucherStatusLabel,
  isRfVoucherClaimBarrier,
} from './rfVoucherLifecycle';

type VoucherLike = Pick<RfVoucherDto, 'status' | 'canonicalStatus'>;

function voucher(overrides: Partial<VoucherLike> = {}): VoucherLike {
  return {
    status: 'claimed',
    canonicalStatus: 'available',
    ...overrides,
  };
}

describe('rf voucher lifecycle helper', () => {
  it('uses canonical status first with legacy fallback', () => {
    expect(getRfVoucherEffectiveStatus(voucher({ status: 'cancelled', canonicalStatus: 'available' }))).toBe('available');
    expect(getRfVoucherEffectiveStatus(voucher({ status: 'redeemed', canonicalStatus: undefined }))).toBe('redeemed');
    expect(getRfVoucherEffectiveStatus(voucher({ status: 'cancelled', canonicalStatus: undefined }))).toBe('cancelled');
    expect(getRfVoucherEffectiveStatus(voucher({ status: 'claimed', canonicalStatus: undefined }))).toBe('available');
  });

  it('keeps claim barrier only for active-like and redeemed states', () => {
    expect(isRfVoucherClaimBarrier(voucher({ canonicalStatus: 'available' }))).toBe(true);
    expect(isRfVoucherClaimBarrier(voucher({ canonicalStatus: 'redeemed', status: 'redeemed' }))).toBe(true);
    expect(isRfVoucherClaimBarrier(voucher({ canonicalStatus: 'redeemed', status: 'redeemed' }), 'repeat_after_redeem')).toBe(false);
    expect(isRfVoucherClaimBarrier(voucher({ canonicalStatus: 'expired' }))).toBe(false);
    expect(isRfVoucherClaimBarrier(voucher({ canonicalStatus: 'cancelled', status: 'cancelled' }))).toBe(false);
  });

  it('formats canonical-first labels and badges', () => {
    expect(getRfVoucherStatusLabel(voucher({ canonicalStatus: 'locked' }))).toBe('Заблокирован');
    expect(getRfVoucherStatusLabel(voucher({ canonicalStatus: 'expired' }))).toBe('Истёк');
    expect(getRfVoucherStatusBadgeClass(voucher({ canonicalStatus: 'locked' }))).toContain('violet');
    expect(getRfVoucherStatusBadgeClass(voucher({ canonicalStatus: 'expired' }))).toContain('amber');
  });
});
