import { describe, expect, it } from 'vitest';
import type { RfVoucherDto } from '@go2asia/sdk/rf';
import {
  getRfVoucherEconomyTypeLabel,
  getRfVoucherActivationLabel,
  getRfVoucherAttributionLabel,
  getRfVoucherEffectiveStatus,
  getRfVoucherIssueSequenceLabel,
  getRfVoucherRepeatabilityLabel,
  getRfVoucherStatusBadgeClass,
  getRfVoucherStatusCaption,
  getRfVoucherStatusLabel,
  isRfVoucherClaimBarrier,
} from './rfVoucherLifecycle';

type VoucherLike = Pick<
  RfVoucherDto,
  | 'status'
  | 'canonicalStatus'
  | 'repeatPolicySnapshot'
  | 'issueSequence'
  | 'pointsCostSnapshot'
  | 'attribution'
  | 'economyStatus'
>;

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
    expect(getRfVoucherStatusLabel(voucher({ canonicalStatus: 'available' }))).toBe('Активен');
    expect(getRfVoucherStatusLabel(voucher({ canonicalStatus: 'locked' }))).toBe('Получен, но не активен');
    expect(getRfVoucherStatusLabel(voucher({ canonicalStatus: 'unlocked' }))).toBe('Можно получить снова');
    expect(getRfVoucherStatusLabel(voucher({ canonicalStatus: 'expired' }))).toBe('Истёк');
    expect(getRfVoucherStatusBadgeClass(voucher({ canonicalStatus: 'locked' }))).toContain('amber');
    expect(getRfVoucherStatusBadgeClass(voucher({ canonicalStatus: 'unlocked' }))).toContain('blue');
    expect(getRfVoucherStatusBadgeClass(voucher({ canonicalStatus: 'expired' }))).toContain('amber');
  });

  it('keeps user-facing visibility labels non-technical', () => {
    expect(getRfVoucherStatusCaption(voucher({ canonicalStatus: 'available' }))).toBe('Готов к использованию у партнёра.');
    expect(getRfVoucherStatusCaption(voucher({ canonicalStatus: 'locked' }))).toBe('Ваучер получен, но ещё не активирован.');
    expect(getRfVoucherRepeatabilityLabel(voucher({ canonicalStatus: 'redeemed', repeatPolicySnapshot: 'repeat_after_redeem' }))).toBe(
      'Повторяемый: можно получить снова',
    );
    expect(getRfVoucherRepeatabilityLabel(voucher({ repeatPolicySnapshot: 'once_per_scope' }))).toBe('Разовый ваучер');
    expect(getRfVoucherIssueSequenceLabel(voucher({ repeatPolicySnapshot: 'repeat_after_redeem', issueSequence: 3 }))).toBe(
      'Цикл #3',
    );
    expect(getRfVoucherIssueSequenceLabel(voucher({ repeatPolicySnapshot: 'repeat_after_redeem', issueSequence: 1 }))).toBeNull();
    expect(getRfVoucherEconomyTypeLabel(voucher({ economyStatus: 'pending' }))).toBe('Тип: Points-enabled');
    expect(getRfVoucherEconomyTypeLabel(voucher({ economyStatus: 'not_required', pointsCostSnapshot: undefined }))).toBe(
      'Тип: Standard voucher',
    );
    expect(getRfVoucherActivationLabel(voucher({ economyStatus: 'pending' }))).toBe('Points: активация ожидается');
    expect(getRfVoucherActivationLabel(voucher({ economyStatus: 'debited' }))).toBeNull();
  });

  it('shows confirmed PRO attribution without exposing raw attribution fields', () => {
    expect(
      getRfVoucherAttributionLabel(
        voucher({
          attribution: {
            capturedAt: '2026-05-05T00:00:00.000Z',
            claimSource: 'public_rf_catalog',
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
      ),
    ).toBe('Получен через PRO');
  });
});
