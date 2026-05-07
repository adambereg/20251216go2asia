import { describe, expect, it } from 'vitest';
import type { RfVoucherDto } from '@go2asia/sdk/rf';
import {
  getRfOfferClaimErrorMessage,
  getRfOfferClaimSuccessMessage,
  isPartnerVoucherForOffer,
  rfOfferClaimCopy,
} from './rfOfferClaim';

function voucher(overrides: Partial<RfVoucherDto> = {}): RfVoucherDto {
  return {
    id: 'voucher_1',
    offerId: 'offer_1',
    partnerId: 'partner_1',
    issuedToUserId: 'user_1',
    status: 'claimed',
    claimScope: 'partner',
    listingContext: null,
    code: 'RF-123',
    claimedAt: '2026-05-07T00:00:00.000Z',
    redeemedAt: null,
    createdAt: '2026-05-07T00:00:00.000Z',
    updatedAt: '2026-05-07T00:00:00.000Z',
    ...overrides,
  };
}

describe('rf offer claim helpers', () => {
  it('formats success and idempotent replay copy', () => {
    expect(getRfOfferClaimSuccessMessage({ idempotentReplay: false })).toBe('Ваучер получен.');
    expect(getRfOfferClaimSuccessMessage({ idempotentReplay: true })).toBe('Ваучер уже получен.');
    expect(getRfOfferClaimSuccessMessage({ idempotentReplay: false, createdNewInstance: false })).toBe('Ваучер уже получен.');
  });

  it('formats auth-required and common error copy', () => {
    expect(getRfOfferClaimErrorMessage({ status: 401 })).toBe('Войдите, чтобы получить ваучер.');
    expect(getRfOfferClaimErrorMessage({ error: { code: 'RF_PARTNER_INACTIVE' } })).toBe('Этот оффер сейчас недоступен.');
    expect(getRfOfferClaimErrorMessage({ error: { code: 'RATE_LIMITED' } })).toBe('Слишком много попыток. Попробуйте позже.');
    expect(getRfOfferClaimErrorMessage(new Error('network'))).toBe('Не удалось получить ваучер. Попробуйте позже.');
  });

  it('distinguishes partner-scope server vouchers from local or listing state', () => {
    expect(isPartnerVoucherForOffer(voucher(), 'offer_1')).toBe(true);
    expect(isPartnerVoucherForOffer(voucher({ status: 'cancelled' }), 'offer_1')).toBe(false);
    expect(isPartnerVoucherForOffer(voucher({ status: 'claimed', canonicalStatus: 'expired' }), 'offer_1')).toBe(false);
    expect(isPartnerVoucherForOffer(voucher({ status: 'claimed', canonicalStatus: 'locked' }), 'offer_1')).toBe(true);
    expect(isPartnerVoucherForOffer(voucher({ status: 'claimed', canonicalStatus: 'unlocked' }), 'offer_1')).toBe(true);
    expect(isPartnerVoucherForOffer(voucher({ status: 'redeemed', canonicalStatus: 'redeemed' }), 'offer_1', 'repeat_after_redeem')).toBe(false);
    expect(isPartnerVoucherForOffer(voucher({ claimScope: 'listing', listingContext: { source: 'rielt', listingId: 'listing_1', listingTitle: null } }), 'offer_1')).toBe(false);
    expect(isPartnerVoucherForOffer(voucher({ offerId: 'offer_2' }), 'offer_1')).toBe(false);
  });

  it('keeps claim and local-save copy distinct without economy or commerce words', () => {
    const copy = Object.values(rfOfferClaimCopy).join(' ').toLowerCase();
    expect(copy).toContain('получить ваучер');
    expect(copy).toContain('локальная заметка');
    expect(copy).toContain('не ваучер');
    expect(copy).not.toMatch(/купить|оплатить|корзина|доход|комисси|выплат|reward|payout/);
  });
});
