/**
 * @go2asia/sdk/rf
 *
 * Thin RF API client for frontend live adoption.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';
import type { RfVoucherSummary } from './generated/rfVoucherSummary';

export type { RfVoucherSummary } from './generated/rfVoucherSummary';

export interface RfPartnerDto {
  id: string;
  slug: string;
  displayName: string;
  countryId: string;
  cityId: string;
  atlasPlaceId: string | null;
  hostAtlasPlaceId: string | null;
  status: 'active' | 'archived';
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RfOfferDto {
  id: string;
  partnerId: string;
  title: string;
  offerType: 'discount' | 'bundle' | 'gift' | 'access' | 'campaign' | 'event_related';
  visibility: 'public' | 'pro_only' | 'invite_only';
  status: 'draft' | 'active' | 'archived';
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RfRieltListingOfferDto extends RfOfferDto {
  type: 'basic' | 'premium';
  benefit: string;
  description: string | null;
  availability: 'available';
  applicabilityNote: string | null;
  priority: number;
}

export interface RfRieltListingOfferContextResponse {
  listing: {
    id: string;
    title: string;
    rfPartnerId: string | null;
  };
  partner: RfPartnerDto | null;
  offers: RfRieltListingOfferDto[];
}

export interface RfVoucherDto {
  id: string;
  offerId: string;
  partnerId: string;
  issuedToUserId: string;
  status: 'claimed' | 'redeemed' | 'cancelled';
  claimScope?: 'partner' | 'listing';
  listingContext?: {
    source: 'rielt';
    listingId: string;
    listingTitle: string | null;
  } | null;
  code: string;
  claimedAt: string;
  redeemedAt: string | null;
  createdAt: string;
  updatedAt: string;
  offer?: {
    id: string;
    title: string;
    benefit: string;
    terms: string;
    type: string;
  };
  partner?: {
    id: string;
    displayName: string;
    cityId?: string | null;
    countryId?: string | null;
  };
  validityLabel?: string;
  usage?: {
    instruction: string;
    contactHint: string;
    redeemStatus: string;
  };
}

export interface RfPartnerListResponse {
  items: RfPartnerDto[];
  nextCursor: string | null;
}

export interface RfOfferListResponse {
  items: RfOfferDto[];
  nextCursor: string | null;
}

export interface RfVoucherListResponse {
  items: RfVoucherDto[];
  nextCursor: string | null;
}

export interface RfClaimResponse {
  voucher: RfVoucherDto;
  idempotentReplay: boolean;
}

export interface RfRedeemVoucherInput {
  partnerId: string;
  voucherId: string;
  gatewayAuthToken?: string;
}

export interface RfRedeemResponse {
  voucher: RfVoucherDto & {
    canonicalStatus?: string;
  };
  applied: boolean;
}

export interface RfCreatePartnerRequest {
  displayName: string;
  countryId: string;
  cityId: string;
  atlasPlaceId?: string | null;
  hostAtlasPlaceId?: string | null;
}

export async function fetchRfPartners(): Promise<RfPartnerListResponse | null> {
  try {
    return await customInstance<RfPartnerListResponse>({ method: 'GET' }, '/v1/rf/partners');
  } catch {
    return null;
  }
}

export async function fetchRfPartner(partnerId: string): Promise<RfPartnerDto | null> {
  try {
    return await customInstance<RfPartnerDto>(
      { method: 'GET' },
      `/v1/rf/partners/${encodeURIComponent(partnerId)}`
    );
  } catch {
    return null;
  }
}

export async function fetchRfOffers(): Promise<RfOfferListResponse | null> {
  try {
    return await customInstance<RfOfferListResponse>({ method: 'GET' }, '/v1/rf/offers');
  } catch {
    return null;
  }
}

export async function fetchRfRieltListingOffers(
  listingId: string
): Promise<RfRieltListingOfferContextResponse | null> {
  try {
    return await customInstance<RfRieltListingOfferContextResponse>(
      { method: 'GET' },
      `/v1/rf/rielt/listings/${encodeURIComponent(listingId)}/offers`
    );
  } catch {
    return null;
  }
}

function createRfClaimIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `rf-claim-${crypto.randomUUID()}`;
  }
  return `rf-claim-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function claimRfOffer(
  offerId: string,
  idempotencyKey = createRfClaimIdempotencyKey()
): Promise<RfClaimResponse> {
  return customInstance<RfClaimResponse>(
    {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    },
    `/v1/rf/offers/${encodeURIComponent(offerId)}/claim`
  );
}

export async function claimRfListingOffer(
  listingId: string,
  offerId: string,
  idempotencyKey = createRfClaimIdempotencyKey()
): Promise<RfClaimResponse> {
  return customInstance<RfClaimResponse>(
    {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    },
    `/v1/rf/rielt/listings/${encodeURIComponent(listingId)}/offers/${encodeURIComponent(offerId)}/claim`
  );
}

export const claimRfRieltListingOffer = claimRfListingOffer;

export async function redeemRfVoucher(input: RfRedeemVoucherInput): Promise<RfRedeemResponse> {
  const headers =
    input.gatewayAuthToken && input.gatewayAuthToken.trim().length > 0
      ? { 'X-Gateway-Auth': input.gatewayAuthToken.trim() }
      : undefined;

  return customInstance<RfRedeemResponse>(
    {
      method: 'POST',
      ...(headers ? { headers } : {}),
    },
    `/v1/rf/business/partners/${encodeURIComponent(input.partnerId)}/vouchers/${encodeURIComponent(input.voucherId)}/redeem`
  );
}

export async function createBusinessPartner(input: RfCreatePartnerRequest): Promise<RfPartnerDto> {
  return customInstance<RfPartnerDto>(
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    '/v1/rf/business/partners'
  );
}

export async function fetchMyVouchers(): Promise<RfVoucherListResponse | null> {
  try {
    return await customInstance<RfVoucherListResponse>({ method: 'GET' }, '/v1/rf/me/vouchers');
  } catch {
    return null;
  }
}

export async function fetchMyVoucherSummary(): Promise<RfVoucherSummary> {
  return customInstance<RfVoucherSummary>({ method: 'GET' }, '/v1/rf/me/vouchers/summary');
}

export function useRfPartners() {
  return useQuery<RfPartnerListResponse | null, Error>({
    queryKey: ['rf', 'partners'],
    queryFn: fetchRfPartners,
    staleTime: 30_000,
  });
}

export function useRfVoucherSummary() {
  return useQuery<RfVoucherSummary, Error>({
    queryKey: ['rf', 'me', 'vouchers', 'summary'],
    queryFn: fetchMyVoucherSummary,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useRfOffers() {
  return useQuery<RfOfferListResponse | null, Error>({
    queryKey: ['rf', 'offers'],
    queryFn: fetchRfOffers,
    staleTime: 30_000,
  });
}
