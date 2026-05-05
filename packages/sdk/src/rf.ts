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

export type RfVoucherCanonicalStatus = 'available' | 'locked' | 'unlocked' | 'redeemed' | 'expired' | 'cancelled';
export type RfVoucherRedemptionResultStatus = 'succeeded' | 'failed' | 'duplicate';
export type RfProLinkRoleScope = 'onboarding' | 'curation' | 'promotion' | 'moderation_support' | 'account_support';

export interface RfVoucherDto {
  id: string;
  offerId: string;
  partnerId: string;
  issuedToUserId: string;
  status: 'claimed' | 'redeemed' | 'cancelled';
  canonicalStatus?: RfVoucherCanonicalStatus;
  claimScope?: 'partner' | 'listing';
  listingContext?: {
    source: 'rielt';
    listingId: string;
    listingTitle: string | null;
  } | null;
  code: string;
  claimedAt: string;
  redeemedAt: string | null;
  contractVersion?: number;
  expiresAt?: string | null;
  cancelledAt?: string | null;
  statusChangedAt?: string | null;
  statusReason?: string | null;
  statusActorUserId?: string | null;
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

export interface RfVoucherRedemptionDto {
  id: string;
  voucherId: string;
  userId: string;
  partnerId: string;
  contextType: string;
  contextRef: string | null;
  resultStatus: RfVoucherRedemptionResultStatus;
  idempotencyKey: string | null;
  actorUserId: string | null;
  redeemedAt: string | null;
  metadata: Record<string, unknown>;
  correlationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RfRedeemVoucherInput {
  partnerId: string;
  voucherId: string;
  idempotencyKey?: string;
  gatewayAuthToken?: string;
}

export interface RfRedeemResponse {
  voucher: RfVoucherDto;
  applied: boolean;
}

export interface RfCreatePartnerRequest {
  displayName: string;
  countryId: string;
  cityId: string;
  atlasPlaceId?: string | null;
  hostAtlasPlaceId?: string | null;
}

export interface RfCreateOfferRequest {
  title: string;
  offerType: RfOfferDto['offerType'];
  visibility: RfOfferDto['visibility'];
}

export interface RfProLinkDto {
  id: string;
  partnerId: string;
  proUserId: string;
  status: 'pending' | 'active' | 'ended';
  roleScope: RfProLinkRoleScope;
  createdAt: string;
  updatedAt: string;
}

export interface RfProLinkListResponse {
  items: RfProLinkDto[];
  nextCursor: string | null;
}

export interface RfCreateProLinkRequest {
  partnerId: string;
  roleScope: RfProLinkRoleScope;
}

export interface RfAcceptProLinkResponse {
  proLink: RfProLinkDto;
  applied: boolean;
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
  const headers: Record<string, string> = {};
  if (input.gatewayAuthToken && input.gatewayAuthToken.trim().length > 0) {
    headers['X-Gateway-Auth'] = input.gatewayAuthToken.trim();
  }
  if (input.idempotencyKey && input.idempotencyKey.trim().length > 0) {
    headers['Idempotency-Key'] = input.idempotencyKey.trim();
  }

  return customInstance<RfRedeemResponse>(
    {
      method: 'POST',
      ...(Object.keys(headers).length > 0 ? { headers } : {}),
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

export async function createOffer(partnerId: string, input: RfCreateOfferRequest): Promise<RfOfferDto> {
  return customInstance<RfOfferDto>(
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    `/v1/rf/business/partners/${encodeURIComponent(partnerId)}/offers`
  );
}

export async function activateOffer(partnerId: string, offerId: string): Promise<RfOfferDto> {
  return customInstance<RfOfferDto>(
    {
      method: 'POST',
    },
    `/v1/rf/business/partners/${encodeURIComponent(partnerId)}/offers/${encodeURIComponent(offerId)}/activate`
  );
}

export async function listProLinks(): Promise<RfProLinkListResponse> {
  return customInstance<RfProLinkListResponse>({ method: 'GET' }, '/v1/rf/pro/links');
}

export async function listPartnerProLinks(partnerId: string): Promise<RfProLinkListResponse> {
  return customInstance<RfProLinkListResponse>(
    { method: 'GET' },
    `/v1/rf/business/partners/${encodeURIComponent(partnerId)}/pro-links`
  );
}

export async function createProLink(input: RfCreateProLinkRequest): Promise<RfProLinkDto> {
  return customInstance<RfProLinkDto>(
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    '/v1/rf/pro/links'
  );
}

export async function acceptProLink(proLinkId: string): Promise<RfAcceptProLinkResponse> {
  return customInstance<RfAcceptProLinkResponse>(
    {
      method: 'POST',
    },
    `/v1/rf/pro/links/${encodeURIComponent(proLinkId)}/accept`
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
