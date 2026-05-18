import { describe, expect, it } from 'vitest';
import type { RfRieltListingOfferDto, RfVoucherDto } from '@go2asia/sdk/rf';
import { findListingVoucherForOffer, getListingVoucherCtaProjection } from './rfListingVoucherCtaAdapter';

function offer(overrides: Partial<RfRieltListingOfferDto> = {}): RfRieltListingOfferDto {
  return {
    id: 'offer_1',
    partnerId: 'partner_1',
    itemId: null,
    title: 'RF offer',
    offerType: 'discount',
    visibility: 'public',
    status: 'active',
    repeatPolicy: 'once_per_scope',
    pointsCost: 0,
    createdByUserId: 'user_1',
    createdAt: '2026-05-18T00:00:00.000Z',
    updatedAt: '2026-05-18T00:00:00.000Z',
    type: 'basic',
    benefit: 'RF benefit',
    description: null,
    availability: 'available',
    applicabilityNote: null,
    priority: 1,
    ...overrides,
  };
}

function voucher(overrides: Partial<RfVoucherDto> = {}): RfVoucherDto {
  return {
    id: 'voucher_1',
    offerId: 'offer_1',
    partnerId: 'partner_1',
    issuedToUserId: 'user_1',
    status: 'claimed',
    canonicalStatus: 'available',
    claimScope: 'listing',
    listingContext: {
      source: 'rielt',
      listingId: 'listing_1',
      listingTitle: 'Listing',
    },
    code: 'RF-123',
    claimedAt: '2026-05-18T00:00:00.000Z',
    redeemedAt: null,
    createdAt: '2026-05-18T00:00:00.000Z',
    updatedAt: '2026-05-18T00:00:00.000Z',
    ...overrides,
  };
}

describe('rf listing voucher CTA adapter', () => {
  it('projects no offer and claim available states without promising claim success', () => {
    expect(getListingVoucherCtaProjection({ offer: null }).state).toBe('no_offer');

    const projection = getListingVoucherCtaProjection({ offer: offer(), voucher: null });
    expect(projection.state).toBe('claim_available');
    expect(projection.buttonLabel).toBe('Получить RF-ваучер');
    expect(projection.disabled).toBe(false);
  });

  it('projects active voucher statuses through RF lifecycle fallback', () => {
    expect(getListingVoucherCtaProjection({ offer: offer(), voucher: voucher({ canonicalStatus: 'available' }) }).state).toBe('ready_to_use');
    expect(getListingVoucherCtaProjection({ offer: offer(), voucher: voucher({ canonicalStatus: 'unlocked' }) }).state).toBe('ready_to_use');
    expect(getListingVoucherCtaProjection({ offer: offer(), voucher: voucher({ canonicalStatus: undefined, status: 'claimed' }) }).state).toBe('ready_to_use');
  });

  it('projects locked, redeemed and unavailable voucher statuses safely', () => {
    expect(getListingVoucherCtaProjection({ offer: offer(), voucher: voucher({ canonicalStatus: 'locked' }) }).state).toBe('pending_activation');
    expect(getListingVoucherCtaProjection({ offer: offer(), voucher: voucher({ canonicalStatus: 'redeemed', status: 'redeemed' }) }).state).toBe('used');
    expect(getListingVoucherCtaProjection({ offer: offer(), voucher: voucher({ canonicalStatus: 'expired' }) }).state).toBe('unavailable');
    expect(getListingVoucherCtaProjection({ offer: offer(), voucher: voucher({ canonicalStatus: 'cancelled', status: 'cancelled' }) }).state).toBe('unavailable');
  });

  it('projects error and partial states without lifecycle authority', () => {
    expect(getListingVoucherCtaProjection({ offer: offer(), error: 'Не удалось загрузить RF-предложение' }).state).toBe('error');
    expect(getListingVoucherCtaProjection({ offer: offer(), partial: true }).state).toBe('partial');
    expect(getListingVoucherCtaProjection({ offer: offer(), stale: true }).state).toBe('stale');
  });

  it('finds only listing-scoped claim barrier vouchers for the same offer and listing', () => {
    expect(findListingVoucherForOffer([voucher()], 'offer_1', 'listing_1')?.id).toBe('voucher_1');
    expect(findListingVoucherForOffer([voucher({ claimScope: 'partner', listingContext: null })], 'offer_1', 'listing_1')).toBeNull();
    expect(findListingVoucherForOffer([voucher({ listingContext: { source: 'rielt', listingId: 'listing_2', listingTitle: null } })], 'offer_1', 'listing_1')).toBeNull();
    expect(findListingVoucherForOffer([voucher({ canonicalStatus: 'redeemed', status: 'redeemed' })], 'offer_1', 'listing_1', 'repeat_after_redeem')).toBeNull();
  });
});
