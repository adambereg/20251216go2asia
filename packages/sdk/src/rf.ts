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
  itemId: string | null;
  title: string;
  offerType: 'discount' | 'bundle' | 'gift' | 'access' | 'campaign' | 'event_related';
  visibility: 'public' | 'pro_only' | 'invite_only';
  status: 'draft' | 'active' | 'archived';
  repeatPolicy?: RfRepeatPolicy;
  /**
   * Internal Points utility cost for claiming the RF offer.
   * This is not money, listing price, payment, booking fee, payout or settlement value.
   */
  pointsCost?: number;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RfPartnerItemDto {
  id: string;
  partnerId: string;
  title: string;
  description: string | null;
  category: string | null;
  priceFrom: number | null;
  currency: string | null;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface RfRieltListingOfferDto extends RfOfferDto {
  type: 'basic' | 'premium';
  benefit: string;
  description: string | null;
  /**
   * Display availability for an active RF offer mapping on a Rielt listing.
   * Not voucher lifecycle status, claimability, redeemability or spendability.
   */
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
export type RfRepeatPolicy = 'once_per_scope' | 'repeat_after_redeem';
export type RfClaimBlockReason = 'existing_active_voucher' | 'once_per_scope_consumed';
export type RfVoucherEconomyStatus = 'not_required' | 'pending' | 'debited' | 'debit_failed';
export type RfVoucherRedemptionResultStatus = 'succeeded' | 'failed' | 'duplicate';
export type RfProLinkRoleScope = 'onboarding' | 'curation' | 'promotion' | 'moderation_support' | 'account_support';
export type RfAttributionStatus = 'none' | 'confirmed' | 'rejected';
export type RfAttributionSource = 'pro_link' | 'direct_offer' | 'internal_navigation' | 'unknown';
export type RfClaimSource = 'public_rf_catalog' | 'public_offer_detail' | 'rielt_offer_detail' | 'pro_shared_link' | 'unknown';

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
  repeatPolicySnapshot?: RfRepeatPolicy;
  issueSequence?: number;
  pointsCostSnapshot?: number;
  pointsDebitExternalId?: string | null;
  economyStatus?: RfVoucherEconomyStatus;
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
  attribution?: {
    version: number;
    strategy: 'rf_pro_last_touch_before_claim';
    status: RfAttributionStatus;
    source: RfAttributionSource;
    claimSource: RfClaimSource;
    shareCode: string | null;
    proUserId: string | null;
    proLinkId: string | null;
    capturedAt: string | null;
    confirmedAt: string | null;
    metadata: Record<string, unknown>;
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

export interface RfPartnerItemListResponse {
  items: RfPartnerItemDto[];
  nextCursor: string | null;
}

export interface RfVoucherListResponse {
  items: RfVoucherDto[];
  nextCursor: string | null;
}

export interface RfMerchantVoucherActivitySummary {
  total: number;
  active: number;
  redeemed: number;
  expiredOrUnavailable: number;
  offersWithActivity: number;
  proAttributed: number;
  lastActivityAt: string | null;
}

export interface RfMerchantVoucherActivitySummaryResponse {
  partnerId: string;
  scope: 'partner_voucher_activity_summary';
  generatedAt: string;
  summary: RfMerchantVoucherActivitySummary;
}

export interface RfProAttributedVoucherDto {
  voucherId: string;
  offerId: string;
  offerTitle: string;
  partnerId: string;
  partnerName: string;
  status: RfVoucherDto['status'];
  canonicalStatus: RfVoucherCanonicalStatus;
  claimScope: NonNullable<RfVoucherDto['claimScope']>;
  listingContext: RfVoucherDto['listingContext'];
  attributionStatus: Extract<RfAttributionStatus, 'confirmed'>;
  attributionSource: RfAttributionSource;
  claimSource: RfClaimSource;
  attributionConfirmedAt: string;
  claimedAt: string;
  redeemedAt: string | null;
}

export interface RfProAttributedVouchersResponse {
  items: RfProAttributedVoucherDto[];
  nextCursor: string | null;
}

export interface RfProAttributedVouchersQuery {
  status?: RfVoucherDto['status'];
  partnerId?: string;
  claimScope?: NonNullable<RfVoucherDto['claimScope']>;
  limit?: number;
  cursor?: string | null;
}

export interface RfClaimResponse {
  voucher: RfVoucherDto;
  idempotentReplay: boolean;
  createdNewInstance?: boolean;
  claimBlockReason?: RfClaimBlockReason | null;
  repeatPolicy?: RfRepeatPolicy;
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
  itemId?: string | null;
  offerType: RfOfferDto['offerType'];
  visibility: RfOfferDto['visibility'];
}

export interface RfCreatePartnerItemRequest {
  title: string;
  description?: string | null;
  category?: string | null;
  priceFrom?: number | null;
  currency?: string | null;
}

export interface RfUpdatePartnerItemRequest {
  title?: string;
  description?: string | null;
  category?: string | null;
  priceFrom?: number | null;
  currency?: string | null;
}

export interface RfProLinkDto {
  id: string;
  partnerId: string;
  proUserId: string;
  shareCode: string | null;
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

export type RfProLinkLifecycleResponse = RfAcceptProLinkResponse;

export interface RfClaimAttributionPayload {
  version: 1;
  shareCode?: string;
  attributionSource: RfAttributionSource;
  claimSource: RfClaimSource;
  capturedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface RfClaimOptions {
  idempotencyKey?: string;
  attribution?: RfClaimAttributionPayload | null;
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
  idempotencyKeyOrOptions: string | RfClaimOptions = createRfClaimIdempotencyKey()
): Promise<RfClaimResponse> {
  const options = typeof idempotencyKeyOrOptions === 'string' ? { idempotencyKey: idempotencyKeyOrOptions } : idempotencyKeyOrOptions;
  const idempotencyKey = options.idempotencyKey ?? createRfClaimIdempotencyKey();
  return customInstance<RfClaimResponse>(
    {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
      ...(options.attribution ? { body: JSON.stringify({ attribution: options.attribution }) } : {}),
    },
    `/v1/rf/offers/${encodeURIComponent(offerId)}/claim`
  );
}

export async function claimRfListingOffer(
  listingId: string,
  offerId: string,
  idempotencyKeyOrOptions: string | RfClaimOptions = createRfClaimIdempotencyKey()
): Promise<RfClaimResponse> {
  const options = typeof idempotencyKeyOrOptions === 'string' ? { idempotencyKey: idempotencyKeyOrOptions } : idempotencyKeyOrOptions;
  const idempotencyKey = options.idempotencyKey ?? createRfClaimIdempotencyKey();
  return customInstance<RfClaimResponse>(
    {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
      ...(options.attribution ? { body: JSON.stringify({ attribution: options.attribution }) } : {}),
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

export async function listPartnerItems(partnerId: string): Promise<RfPartnerItemListResponse> {
  return customInstance<RfPartnerItemListResponse>(
    { method: 'GET' },
    `/v1/rf/business/partners/${encodeURIComponent(partnerId)}/items`
  );
}

export async function createPartnerItem(partnerId: string, input: RfCreatePartnerItemRequest): Promise<RfPartnerItemDto> {
  return customInstance<RfPartnerItemDto>(
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    `/v1/rf/business/partners/${encodeURIComponent(partnerId)}/items`
  );
}

export async function updatePartnerItem(
  partnerId: string,
  itemId: string,
  input: RfUpdatePartnerItemRequest
): Promise<RfPartnerItemDto> {
  return customInstance<RfPartnerItemDto>(
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
    `/v1/rf/business/partners/${encodeURIComponent(partnerId)}/items/${encodeURIComponent(itemId)}`
  );
}

export async function archivePartnerItem(partnerId: string, itemId: string): Promise<RfPartnerItemDto> {
  return customInstance<RfPartnerItemDto>(
    {
      method: 'POST',
    },
    `/v1/rf/business/partners/${encodeURIComponent(partnerId)}/items/${encodeURIComponent(itemId)}/archive`
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

export async function listProAttributedVouchers(
  query: RfProAttributedVouchersQuery = {}
): Promise<RfProAttributedVouchersResponse> {
  const params = new URLSearchParams();
  if (query.status) params.set('status', query.status);
  if (query.partnerId) params.set('partnerId', query.partnerId);
  if (query.claimScope) params.set('claimScope', query.claimScope);
  if (query.limit) params.set('limit', String(query.limit));
  if (query.cursor) params.set('cursor', query.cursor);
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return customInstance<RfProAttributedVouchersResponse>({ method: 'GET' }, `/v1/rf/pro/attributed-vouchers${suffix}`);
}

export async function listPartnerProLinks(partnerId: string): Promise<RfProLinkListResponse> {
  return customInstance<RfProLinkListResponse>(
    { method: 'GET' },
    `/v1/rf/business/partners/${encodeURIComponent(partnerId)}/pro-links`
  );
}

export async function getPartnerVoucherActivitySummary(
  partnerId: string
): Promise<RfMerchantVoucherActivitySummaryResponse> {
  return customInstance<RfMerchantVoucherActivitySummaryResponse>(
    { method: 'GET' },
    `/v1/rf/business/partners/${encodeURIComponent(partnerId)}/voucher-activity/summary`
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

export async function rejectProLink(proLinkId: string): Promise<RfProLinkLifecycleResponse> {
  return customInstance<RfProLinkLifecycleResponse>(
    {
      method: 'POST',
    },
    `/v1/rf/pro/links/${encodeURIComponent(proLinkId)}/reject`
  );
}

export async function endProLink(proLinkId: string): Promise<RfProLinkLifecycleResponse> {
  return customInstance<RfProLinkLifecycleResponse>(
    {
      method: 'POST',
    },
    `/v1/rf/pro/links/${encodeURIComponent(proLinkId)}/end`
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

export function useRfPartnerVoucherActivitySummary(partnerId: string | null | undefined) {
  return useQuery<RfMerchantVoucherActivitySummaryResponse, Error>({
    queryKey: ['rf', 'business', 'partners', partnerId, 'voucher-activity-summary'],
    queryFn: () => getPartnerVoucherActivitySummary(String(partnerId)),
    enabled: Boolean(partnerId),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useRfProAttributedVouchers(query: RfProAttributedVouchersQuery = {}) {
  return useQuery<RfProAttributedVouchersResponse, Error>({
    queryKey: ['rf', 'pro', 'attributed-vouchers', query],
    queryFn: () => listProAttributedVouchers(query),
    staleTime: 30_000,
    retry: 1,
  });
}
