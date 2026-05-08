import type { Db } from '@go2asia/db';
import { sql } from '@go2asia/db';

import type { GatewayPrincipal } from './middleware/auth';

type DbExecutor = Pick<Db, 'execute'>;

export type PartnerStatus = 'active' | 'archived';
export type PartnerItemStatus = 'active' | 'archived';
export type OfferStatus = 'draft' | 'active' | 'archived';
export type VoucherStatus = 'claimed' | 'redeemed' | 'cancelled';
export type VoucherCanonicalStatus = 'available' | 'locked' | 'unlocked' | 'redeemed' | 'expired' | 'cancelled';
export type VoucherClaimScope = 'partner' | 'listing';
export type RfRepeatPolicy = 'once_per_scope' | 'repeat_after_redeem';
export type RfClaimBlockReason = 'existing_active_voucher' | 'once_per_scope_consumed';
export type RfVoucherEconomyStatus = 'not_required' | 'pending' | 'debited' | 'debit_failed';
export type RfAttributionStatus = 'none' | 'confirmed' | 'rejected';
export type RfAttributionSource = 'pro_link' | 'direct_offer' | 'internal_navigation' | 'unknown';
export type RfClaimSource = 'public_rf_catalog' | 'public_offer_detail' | 'rielt_offer_detail' | 'pro_shared_link' | 'unknown';
export type ProLinkStatus = 'pending' | 'active' | 'ended';
export type RieltListingOfferStatus = 'active' | 'hidden';
export type RieltListingOfferKind = 'basic' | 'premium';

export interface Partner {
  id: string;
  slug: string;
  displayName: string;
  countryId: string;
  cityId: string;
  atlasPlaceId: string | null;
  hostAtlasPlaceId: string | null;
  status: PartnerStatus;
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  partnerId: string;
  itemId: string | null;
  title: string;
  offerType: 'discount' | 'bundle' | 'gift' | 'access' | 'campaign' | 'event_related';
  visibility: 'public' | 'pro_only' | 'invite_only';
  status: OfferStatus;
  repeatPolicy?: RfRepeatPolicy;
  pointsCost?: number;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RfPartnerItem {
  id: string;
  partnerId: string;
  title: string;
  description: string | null;
  category: string | null;
  priceFrom: number | null;
  currency: string | null;
  status: PartnerItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerItemInput {
  title: string;
  description?: string | null;
  category?: string | null;
  priceFrom?: number | null;
  currency?: string | null;
}

export interface UpdatePartnerItemInput {
  title?: string;
  description?: string | null;
  category?: string | null;
  priceFrom?: number | null;
  currency?: string | null;
}

export interface RieltListingOfferContext {
  listing: {
    id: string;
    title: string;
    rfPartnerId: string | null;
  };
  partner: Partner | null;
  offers: Array<
    Offer & {
      type: RieltListingOfferKind;
      benefit: string;
      description: string | null;
      availability: 'available';
      applicabilityNote: string | null;
      priority: number;
    }
  >;
}

export interface Voucher {
  id: string;
  offerId: string;
  partnerId: string;
  issuedToUserId: string;
  status: VoucherStatus;
  canonicalStatus?: VoucherCanonicalStatus;
  claimScope: VoucherClaimScope;
  listingContext: {
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
    cityId: string | null;
    countryId: string | null;
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

export interface VoucherSummary {
  totalVouchers: number;
  activeVouchers: number;
  usedVouchers: number;
  cancelledVouchers: number;
  expiredVouchers: number;
}

export interface RfProAttributedVoucher {
  voucherId: string;
  offerId: string;
  offerTitle: string;
  partnerId: string;
  partnerName: string;
  status: VoucherStatus;
  canonicalStatus: VoucherCanonicalStatus;
  claimScope: VoucherClaimScope;
  listingContext: {
    source: 'rielt';
    listingId: string;
    listingTitle: string | null;
  } | null;
  attributionStatus: Extract<RfAttributionStatus, 'confirmed'>;
  attributionSource: RfAttributionSource;
  claimSource: RfClaimSource;
  attributionConfirmedAt: string;
  claimedAt: string;
  redeemedAt: string | null;
}

export interface RfProAttributedVouchersList {
  items: RfProAttributedVoucher[];
  nextCursor: string | null;
}

export interface RfProAttributedVouchersFilters {
  status?: VoucherStatus;
  partnerId?: string;
  claimScope?: VoucherClaimScope;
  limit?: number;
  cursor?: string | null;
}

export interface ProLink {
  id: string;
  partnerId: string;
  proUserId: string;
  shareCode: string | null;
  status: ProLinkStatus;
  roleScope: 'onboarding' | 'curation' | 'promotion' | 'moderation_support' | 'account_support';
  createdAt: string;
  updatedAt: string;
}

export interface RfClaimAttributionInput {
  version?: number;
  shareCode?: string;
  attributionSource?: RfAttributionSource;
  claimSource?: RfClaimSource;
  capturedAt?: string;
  metadata?: Record<string, unknown>;
}

export type RfDiagnosticsSeverity = 'info' | 'warning' | 'critical';

export interface RfVoucherDiagnosticsAnomaly {
  code:
    | 'voucher_redeemed_without_redemption_row'
    | 'redemption_row_without_redeemed_status'
    | 'once_per_scope_redeemed_without_guard'
    | 'unexpected_repeat_after_redeem_guard'
    | 'legacy_status_canonical_status_mismatch'
    | 'listing_scope_missing_listing_id'
    | 'guard_points_to_missing_voucher'
    | 'idempotency_points_to_missing_voucher'
    | 'confirmed_attribution_without_pro_link'
    | 'rejected_attribution_present'
    | 'repeat_sequence_gap'
    | 'active_duplicate_possible'
    | 'attribution_pro_link_partner_mismatch'
    | 'listing_mapping_missing_or_inactive'
    | 'debited_without_external_id'
    | 'spend_succeeded_claim_failed'
    | 'compensation_pending_too_long'
    | 'debit_failed_visible_voucher';
  severity: RfDiagnosticsSeverity;
  message: string;
  evidence: Record<string, string | number | boolean | null>;
}

export interface RfVoucherDiagnostics {
  voucher: {
    voucherId: string;
    offerId: string;
    partnerId: string;
    issuedToUserId: string;
    claimScope: VoucherClaimScope;
    listingId: string | null;
    listingTitleSnapshot: string | null;
    status: VoucherStatus;
    canonicalStatus: VoucherCanonicalStatus;
    contractVersion: number;
    repeatPolicySnapshot: RfRepeatPolicy;
    issueSequence: number;
    pointsCostSnapshot: number;
    pointsDebitExternalId: string | null;
    pointsCompensationExternalId: string | null;
    economyStatus: RfVoucherEconomyStatus;
    economyTransitionTimestamps: {
      spendAttemptedAt: string | null;
      compensationAttemptedAt: string | null;
      compensationResolvedAt: string | null;
    };
    claimedAt: string;
    redeemedAt: string | null;
    cancelledAt: string | null;
    expiresAt: string | null;
    statusChangedAt: string | null;
    statusReason: string | null;
    statusActorUserId: string | null;
    codeMasked: string | null;
  };
  relations: {
    offer: {
      id: string;
      partnerId: string;
      status: OfferStatus;
      visibility: Offer['visibility'];
      repeatPolicy: RfRepeatPolicy;
    } | null;
    partner: {
      id: string;
      status: PartnerStatus;
      ownerUserId: string;
    } | null;
    listingMapping: {
      listingId: string;
      offerId: string;
      partnerId: string;
      status: RieltListingOfferStatus;
      offerKind: RieltListingOfferKind;
      priority: number;
    } | null;
    proLink: {
      id: string;
      partnerId: string;
      proUserId: string;
      status: ProLinkStatus;
      shareCodeMasked: string | null;
    } | null;
  };
  redemption: {
    items: Array<{
      id: string;
      voucherId: string;
      resultStatus: 'succeeded' | 'failed' | 'duplicate';
      actorUserId: string | null;
      redeemedAt: string | null;
      createdAt: string;
      idempotencyKeyFingerprint: string | null;
      correlationIdMasked: string | null;
    }>;
    hasSuccessfulRedemption: boolean;
    successfulRedemptionCount: number;
    totalRedemptionAttempts: number;
  };
  consumptionGuard: {
    exists: boolean;
    offerId: string | null;
    issuedToUserId: string | null;
    claimScope: VoucherClaimScope | null;
    scopeRef: string | null;
    consumedVoucherId: string | null;
    repeatPolicySnapshot: RfRepeatPolicy | null;
    consumedAt: string | null;
  };
  attribution: {
    attributionVersion: number;
    attributionStrategy: 'rf_pro_last_touch_before_claim';
    attributionStatus: RfAttributionStatus;
    attributionSource: RfAttributionSource;
    claimSource: RfClaimSource;
    proAttributedUserId: string | null;
    proLinkId: string | null;
    attributionConfirmedAt: string | null;
    attributionCapturedAt: string | null;
    attributionRejectedReason: string | null;
    metadataKeys: string[];
  };
  idempotency: {
    claimBindings: Array<{
      operation: 'voucher_claim';
      actorUserId: string;
      voucherId: string;
      createdAt: string;
      idempotencyKeyFingerprint: string;
    }>;
  };
  economyRecovery: {
    exists: boolean;
    state: 'pending' | 'resolved' | null;
    spendExternalId: string | null;
    compensationExternalId: string | null;
    correlationIdMasked: string | null;
    lastErrorMasked: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    resolvedAt: string | null;
  };
  anomalies: RfVoucherDiagnosticsAnomaly[];
}

type ClaimResult =
  | {
      ok: true;
      voucher: Voucher;
      idempotentReplay: boolean;
      createdNewInstance?: boolean;
      claimBlockReason?: RfClaimBlockReason | null;
      repeatPolicy?: RfRepeatPolicy;
    }
  | { ok: false; code: string; message: string; status: number };

export type RfClaimSpendResult =
  | { ok: true; externalId: string; idempotentReplay: boolean; balanceAfter: number | null }
  | { ok: false; code: 'RF_INSUFFICIENT_POINTS_BALANCE' | 'RF_SPEND_IDEMPOTENCY_CONFLICT' | 'RF_SPEND_TEMPORARILY_UNAVAILABLE'; message: string; status: number };

export type RfClaimCompensationResult =
  | { ok: true; externalId: string }
  | { ok: false; message: string };

export interface RfClaimEconomyRecoveryMarkerInput {
  voucherId: string;
  offerId: string;
  actorUserId: string;
  claimScope: VoucherClaimScope;
  scopeRef: string | null;
  spendExternalId: string;
  compensationExternalId: string;
  correlationId: string | null;
  state: 'pending' | 'resolved';
  lastError: string | null;
}

export interface RfClaimEconomyRuntime {
  enabled: boolean;
  spendPoints(input: {
    userId: string;
    amount: number;
    voucherId: string;
    correlationId: string | null;
    claimScope: VoucherClaimScope;
    scopeRef: string | null;
  }): Promise<RfClaimSpendResult>;
  compensatePoints(input: {
    userId: string;
    amount: number;
    voucherId: string;
    spendExternalId: string;
    correlationId: string | null;
    claimScope: VoucherClaimScope;
    scopeRef: string | null;
  }): Promise<RfClaimCompensationResult>;
}
type RedeemResult =
  | { ok: true; voucher: Voucher; applied: boolean }
  | { ok: false; code: string; message: string; status: number };
type ProLinkAcceptResult =
  | { ok: true; proLink: ProLink; applied: boolean }
  | { ok: false; code: string; message: string; status: number };
type ProLinkLifecycleResult = ProLinkAcceptResult;
type PartnerProLinksResult =
  | { ok: true; items: ProLink[] }
  | { ok: false; code: string; message: string; status: number };
type PartnerItemsResult =
  | { ok: true; items: RfPartnerItem[] }
  | { ok: false; code: string; message: string; status: number };
type PartnerItemResult =
  | { ok: true; item: RfPartnerItem }
  | { ok: false; code: string; message: string; status: number };

type PartnerRow = {
  id: string;
  slug: string;
  display_name: string;
  country_id: string;
  city_id: string;
  atlas_place_id: string | null;
  host_atlas_place_id: string | null;
  status: PartnerStatus;
  owner_user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
};

type OfferRow = {
  id: string;
  partner_id: string;
  item_id?: string | null;
  title: string;
  offer_type: Offer['offerType'];
  visibility: Offer['visibility'];
  status: OfferStatus;
  repeat_policy?: RfRepeatPolicy | null;
  points_cost?: number | null;
  created_by_user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
};

type PartnerItemRow = {
  id: string;
  partner_id: string;
  title: string;
  description: string | null;
  category: string | null;
  price_from: string | number | null;
  currency: string | null;
  status: PartnerItemStatus;
  created_at: string | Date;
  updated_at: string | Date;
};

type RieltListingSummaryRow = {
  id: string;
  title: string;
  rf_partner_id: string | null;
};

type RieltListingOfferMappingRow = OfferRow & {
  mapping_status: RieltListingOfferStatus;
  offer_kind: RieltListingOfferKind;
  priority: number;
  applicability_note: string | null;
  partner_slug: string;
  partner_display_name: string;
  partner_country_id: string;
  partner_city_id: string;
  partner_atlas_place_id: string | null;
  partner_host_atlas_place_id: string | null;
  partner_status: PartnerStatus;
  partner_owner_user_id: string;
  partner_created_at: string | Date;
  partner_updated_at: string | Date;
};

type VoucherRow = {
  id: string;
  offer_id: string;
  partner_id: string;
  issued_to_user_id: string;
  status: VoucherStatus;
  canonical_status?: VoucherCanonicalStatus | null;
  contract_version?: number | null;
  repeat_policy_snapshot?: RfRepeatPolicy | null;
  issue_sequence?: number | null;
  points_cost_snapshot?: number | null;
  points_debit_external_id?: string | null;
  economy_status?: RfVoucherEconomyStatus | null;
  expires_at?: string | Date | null;
  cancelled_at?: string | Date | null;
  status_changed_at?: string | Date | null;
  status_reason?: string | null;
  status_actor_user_id?: string | null;
  attribution_version?: number | null;
  attribution_strategy?: 'rf_pro_last_touch_before_claim' | null;
  attribution_status?: RfAttributionStatus | null;
  attribution_source?: RfAttributionSource | null;
  claim_source?: RfClaimSource | null;
  attribution_share_code?: string | null;
  pro_attributed_user_id?: string | null;
  pro_link_id?: string | null;
  attribution_captured_at?: string | Date | null;
  attribution_confirmed_at?: string | Date | null;
  attribution_metadata?: Record<string, unknown> | null;
  claim_scope?: VoucherClaimScope | null;
  rielt_listing_id?: string | null;
  rielt_listing_title_snapshot?: string | null;
  code: string;
  claimed_at: string | Date;
  redeemed_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
  wallet_offer_id?: string | null;
  wallet_offer_title?: string | null;
  wallet_offer_type?: Offer['offerType'] | null;
  wallet_offer_kind?: RieltListingOfferKind | null;
  wallet_offer_terms?: string | null;
  wallet_partner_id?: string | null;
  wallet_partner_display_name?: string | null;
  wallet_partner_city_id?: string | null;
  wallet_partner_country_id?: string | null;
};

type ProAttributedVoucherRow = Pick<
  VoucherRow,
  | 'id'
  | 'offer_id'
  | 'partner_id'
  | 'status'
  | 'canonical_status'
  | 'claim_scope'
  | 'rielt_listing_id'
  | 'rielt_listing_title_snapshot'
  | 'attribution_status'
  | 'attribution_source'
  | 'claim_source'
  | 'attribution_confirmed_at'
  | 'claimed_at'
  | 'redeemed_at'
> & {
  offer_title: string;
  partner_display_name: string;
};

type ListingClaimContextRow = {
  listing_id: string;
  listing_title: string;
  listing_rf_partner_id: string | null;
  mapping_partner_id: string;
  offer_id: string;
  offer_partner_id: string;
  offer_status: OfferStatus;
  offer_visibility: Offer['visibility'];
  offer_repeat_policy?: RfRepeatPolicy | null;
  offer_points_cost?: number | null;
  partner_status: PartnerStatus;
};

type ProLinkRow = {
  id: string;
  partner_id: string;
  pro_user_id: string;
  share_code?: string | null;
  status: ProLinkStatus;
  role_scope: ProLink['roleScope'];
  created_at: string | Date;
  updated_at: string | Date;
};

type AttributionProLinkRow = Pick<ProLinkRow, 'id' | 'partner_id' | 'pro_user_id' | 'share_code' | 'status'>;

type VoucherDiagnosticsListingMappingRow = {
  listing_id: string;
  rf_offer_id: string;
  rf_partner_id: string;
  status: RieltListingOfferStatus;
  offer_kind: RieltListingOfferKind;
  priority: number;
};

type VoucherDiagnosticsPartnerRow = Pick<PartnerRow, 'id' | 'status' | 'owner_user_id'>;

type VoucherDiagnosticsRedemptionRow = {
  id: string;
  voucher_id: string;
  result_status: 'succeeded' | 'failed' | 'duplicate';
  actor_user_id: string | null;
  redeemed_at: string | Date | null;
  created_at: string | Date;
  idempotency_key: string | null;
  correlation_id: string | null;
};

type VoucherDiagnosticsGuardRow = {
  id: string;
  offer_id: string;
  issued_to_user_id: string;
  claim_scope: VoucherClaimScope;
  scope_ref: string;
  consumed_voucher_id: string;
  repeat_policy_snapshot: RfRepeatPolicy;
  consumed_at: string | Date;
  consumed_voucher_exists: string | null;
};

type ResolvedClaimAttribution = {
  version: 1;
  strategy: 'rf_pro_last_touch_before_claim';
  status: RfAttributionStatus;
  source: RfAttributionSource;
  claimSource: RfClaimSource;
  shareCode: string | null;
  proUserId: string | null;
  proLinkId: string | null;
  capturedAt: Date | null;
  confirmedAt: Date | null;
  metadata: Record<string, unknown>;
};

type IdempotencyRow = {
  operation: 'voucher_claim';
  actor_user_id: string;
  idempotency_key: string;
  voucher_id: string;
  created_at: string | Date;
};

type VoucherDiagnosticsIdempotencyRow = IdempotencyRow & {
  voucher_exists: string | null;
};

type VoucherDiagnosticsRecoveryRow = {
  id: string;
  voucher_id: string;
  offer_id: string;
  actor_user_id: string;
  claim_scope: VoucherClaimScope;
  scope_ref: string | null;
  spend_external_id: string;
  compensation_external_id: string;
  correlation_id: string | null;
  state: 'pending' | 'resolved';
  last_error: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  resolved_at: string | Date | null;
};

const writeTimestampsByActorAndOp = new Map<string, number[]>();

function rowsOf<T>(result: unknown): T[] {
  return ((result as { rows?: T[] } | null)?.rows ?? []) as T[];
}

function asIso(value: string | Date | null): string | null {
  if (!value) return null;
  return new Date(value).toISOString();
}

function maskTail(value: string | null | undefined, visible = 4): string | null {
  if (!value) return null;
  const normalized = value.trim();
  if (!normalized) return null;
  if (normalized.length <= visible) return `***${normalized}`;
  return `***${normalized.slice(-visible)}`;
}

function toFingerprint(value: string | null | undefined): string | null {
  if (!value) return null;
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a_${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function getAttributionRejectedReason(metadata: Record<string, unknown>): string | null {
  const value = metadata.rejectionReason;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function mapLegacyStatusToCanonical(status: VoucherStatus): VoucherCanonicalStatus {
  if (status === 'claimed') return 'available';
  if (status === 'redeemed') return 'redeemed';
  return 'cancelled';
}

function getCanonicalStatus(voucher: Pick<VoucherRow, 'status' | 'canonical_status'>): VoucherCanonicalStatus {
  if (voucher.canonical_status) return voucher.canonical_status;
  return mapLegacyStatusToCanonical(voucher.status);
}

function isRedeemableCanonicalStatus(status: VoucherCanonicalStatus): boolean {
  return status === 'available' || status === 'unlocked';
}

function getEffectiveRepeatPolicy(offer: Pick<OfferRow, 'repeat_policy'>): RfRepeatPolicy {
  return offer.repeat_policy ?? 'once_per_scope';
}

function getVoucherRepeatPolicySnapshot(voucher: Pick<VoucherRow, 'repeat_policy_snapshot'>): RfRepeatPolicy {
  return voucher.repeat_policy_snapshot ?? 'once_per_scope';
}

function getVoucherPointsCostSnapshot(voucher: Pick<VoucherRow, 'points_cost_snapshot'>): number {
  const cost = Number(voucher.points_cost_snapshot ?? 0);
  return Number.isFinite(cost) && cost >= 0 ? cost : 0;
}

function getVoucherEconomyStatus(voucher: Pick<VoucherRow, 'economy_status' | 'points_cost_snapshot'>): RfVoucherEconomyStatus {
  if (voucher.economy_status) return voucher.economy_status;
  return getVoucherPointsCostSnapshot(voucher) > 0 ? 'pending' : 'not_required';
}

function toAttributionMetadata(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function toPartner(row: PartnerRow): Partner {
  return {
    id: row.id,
    slug: row.slug,
    displayName: row.display_name,
    countryId: row.country_id,
    cityId: row.city_id,
    atlasPlaceId: row.atlas_place_id ?? null,
    hostAtlasPlaceId: row.host_atlas_place_id ?? null,
    status: row.status,
    ownerUserId: row.owner_user_id,
    createdAt: asIso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: asIso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

function toOffer(row: OfferRow): Offer {
  return {
    id: row.id,
    partnerId: row.partner_id,
    itemId: row.item_id ?? null,
    title: row.title,
    offerType: row.offer_type,
    visibility: row.visibility,
    status: row.status,
    repeatPolicy: row.repeat_policy ?? 'once_per_scope',
    pointsCost: Number(row.points_cost ?? 0),
    createdByUserId: row.created_by_user_id,
    createdAt: asIso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: asIso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

function toPartnerItem(row: PartnerItemRow): RfPartnerItem {
  return {
    id: row.id,
    partnerId: row.partner_id,
    title: row.title,
    description: row.description ?? null,
    category: row.category ?? null,
    priceFrom: row.price_from === null || row.price_from === undefined ? null : Number(row.price_from),
    currency: row.currency ?? null,
    status: row.status,
    createdAt: asIso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: asIso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

function toPartnerFromMappingRow(row: RieltListingOfferMappingRow): Partner {
  return toPartner({
    id: row.partner_id,
    slug: row.partner_slug,
    display_name: row.partner_display_name,
    country_id: row.partner_country_id,
    city_id: row.partner_city_id,
    atlas_place_id: row.partner_atlas_place_id,
    host_atlas_place_id: row.partner_host_atlas_place_id,
    status: row.partner_status,
    owner_user_id: row.partner_owner_user_id,
    created_at: row.partner_created_at,
    updated_at: row.partner_updated_at,
  });
}

function toVoucher(row: VoucherRow, options?: { includeWalletEnrichment?: boolean }): Voucher {
  const claimScope = row.claim_scope ?? 'partner';
  const listingId = row.rielt_listing_id ?? null;
  const voucher: Voucher = {
    id: row.id,
    offerId: row.offer_id,
    partnerId: row.partner_id,
    issuedToUserId: row.issued_to_user_id,
    status: row.status,
    canonicalStatus: getCanonicalStatus(row),
    claimScope,
    listingContext:
      claimScope === 'listing' && listingId
        ? {
            source: 'rielt',
            listingId,
            listingTitle: row.rielt_listing_title_snapshot ?? null,
          }
        : null,
    code: row.code,
    claimedAt: asIso(row.claimed_at) ?? new Date(0).toISOString(),
    redeemedAt: asIso(row.redeemed_at),
    contractVersion: row.contract_version ?? undefined,
    repeatPolicySnapshot: row.repeat_policy_snapshot ?? 'once_per_scope',
    issueSequence: row.issue_sequence ?? 1,
    pointsCostSnapshot: getVoucherPointsCostSnapshot(row),
    pointsDebitExternalId: row.points_debit_external_id ?? null,
    economyStatus: getVoucherEconomyStatus(row),
    expiresAt: row.expires_at === undefined ? undefined : asIso(row.expires_at),
    cancelledAt: row.cancelled_at === undefined ? undefined : asIso(row.cancelled_at),
    statusChangedAt: row.status_changed_at === undefined ? undefined : asIso(row.status_changed_at),
    statusReason: row.status_reason ?? undefined,
    statusActorUserId: row.status_actor_user_id ?? undefined,
    attribution: {
      version: row.attribution_version ?? 1,
      strategy: row.attribution_strategy ?? 'rf_pro_last_touch_before_claim',
      status: row.attribution_status ?? 'none',
      source: row.attribution_source ?? 'unknown',
      claimSource: row.claim_source ?? 'unknown',
      shareCode: row.attribution_share_code ?? null,
      proUserId: row.pro_attributed_user_id ?? null,
      proLinkId: row.pro_link_id ?? null,
      capturedAt: asIso(row.attribution_captured_at ?? null),
      confirmedAt: asIso(row.attribution_confirmed_at ?? null),
      metadata: toAttributionMetadata(row.attribution_metadata),
    },
    createdAt: asIso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: asIso(row.updated_at) ?? new Date(0).toISOString(),
  };

  if (!options?.includeWalletEnrichment) {
    return voucher;
  }

  const offerTitle = row.wallet_offer_title ?? 'RF-ваучер';
  const isListingScope = claimScope === 'listing';
  voucher.offer = {
    id: row.wallet_offer_id ?? row.offer_id,
    title: offerTitle,
    type: row.wallet_offer_kind ?? row.wallet_offer_type ?? 'partner',
    benefit: row.wallet_offer_title ?? 'Выгода уточняется у партнёра',
    terms: row.wallet_offer_terms ?? 'Условия уточняются у партнёра',
  };
  voucher.partner = {
    id: row.wallet_partner_id ?? row.partner_id,
    displayName: row.wallet_partner_display_name ?? 'Партнёр уточняется',
    cityId: row.wallet_partner_city_id ?? null,
    countryId: row.wallet_partner_country_id ?? null,
  };
  voucher.validityLabel = 'Срок действия уточняется у партнёра';
  voucher.usage = {
    instruction: isListingScope
      ? 'Покажите ваучер представителю объекта и уточните применение выгоды.'
      : 'Покажите ваучер партнёру и уточните применение выгоды.',
    contactHint: isListingScope ? 'Свяжитесь с представителем объекта перед использованием.' : 'Свяжитесь с партнёром перед использованием.',
    redeemStatus: getCanonicalStatus(row) === 'redeemed' ? 'Использован' : 'Ожидает использования',
  };

  return voucher;
}

function toProAttributedVoucher(row: ProAttributedVoucherRow): RfProAttributedVoucher {
  const claimScope = row.claim_scope ?? 'partner';
  const listingId = row.rielt_listing_id ?? null;
  return {
    voucherId: row.id,
    offerId: row.offer_id,
    offerTitle: row.offer_title,
    partnerId: row.partner_id,
    partnerName: row.partner_display_name,
    status: row.status,
    canonicalStatus: getCanonicalStatus(row),
    claimScope,
    listingContext:
      claimScope === 'listing' && listingId
        ? {
            source: 'rielt',
            listingId,
            listingTitle: row.rielt_listing_title_snapshot ?? null,
          }
        : null,
    attributionStatus: 'confirmed',
    attributionSource: row.attribution_source ?? 'unknown',
    claimSource: row.claim_source ?? 'unknown',
    attributionConfirmedAt: asIso(row.attribution_confirmed_at ?? null) ?? asIso(row.claimed_at) ?? new Date(0).toISOString(),
    claimedAt: asIso(row.claimed_at) ?? new Date(0).toISOString(),
    redeemedAt: asIso(row.redeemed_at),
  };
}

function toProLink(row: ProLinkRow): ProLink {
  return {
    id: row.id,
    partnerId: row.partner_id,
    proUserId: row.pro_user_id,
    shareCode: row.share_code ?? null,
    status: row.status,
    roleScope: row.role_scope,
    createdAt: asIso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: asIso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

function nextId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function buildDeterministicVoucherId(input: {
  actorUserId: string;
  offerId: string;
  idempotencyKey: string;
  claimScope: VoucherClaimScope;
  listingId?: string | null;
}): Promise<string> {
  const normalized = [
    'rf-voucher-claim-v1',
    input.claimScope,
    input.actorUserId.trim(),
    input.offerId.trim(),
    input.listingId?.trim() ?? '',
    input.idempotencyKey.trim(),
  ].join(':');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
  return `rf_voucher_${toHex(new Uint8Array(digest)).slice(0, 24)}`;
}

function isVipSpacerPrincipal(principal: GatewayPrincipal): boolean {
  if (principal.platformRole === 'vip_spacer') return true;
  return principal.roles.some((role) => role.trim().toLowerCase() === 'vip_spacer');
}

function buildSpendExternalId(voucherId: string): string {
  return `rf:voucher-claim-spend:${voucherId}`;
}

function buildCompensationExternalId(voucherId: string): string {
  return `rf:voucher-claim-spend-compensation:${voucherId}`;
}

async function upsertEconomyRecoveryMarker(db: DbExecutor, input: RfClaimEconomyRecoveryMarkerInput): Promise<void> {
  await db.execute(sql`
    INSERT INTO rf_voucher_economy_recovery (
      id,
      voucher_id,
      offer_id,
      actor_user_id,
      claim_scope,
      scope_ref,
      spend_external_id,
      compensation_external_id,
      correlation_id,
      state,
      last_error,
      created_at,
      updated_at,
      resolved_at
    )
    VALUES (
      ${nextId('rf_economy_recovery')},
      ${input.voucherId},
      ${input.offerId},
      ${input.actorUserId},
      ${input.claimScope},
      ${input.scopeRef},
      ${input.spendExternalId},
      ${input.compensationExternalId},
      ${input.correlationId},
      ${input.state},
      ${input.lastError},
      now(),
      now(),
      CASE WHEN ${input.state} = 'resolved' THEN now() ELSE NULL END
    )
    ON CONFLICT (spend_external_id)
    DO UPDATE SET
      compensation_external_id = EXCLUDED.compensation_external_id,
      correlation_id = EXCLUDED.correlation_id,
      state = EXCLUDED.state,
      last_error = EXCLUDED.last_error,
      updated_at = now(),
      resolved_at = CASE WHEN EXCLUDED.state = 'resolved' THEN now() ELSE NULL END
  `);
}

function toSlug(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (base.length > 0) return base;
  return `entity-${crypto.randomUUID().slice(0, 8)}`;
}

function toVoucherCode(voucherId: string): string {
  const compact = voucherId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `RF-${compact.slice(-6).padStart(6, '0')}`;
}

function toShareCode(): string {
  const raw = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `rfp_${raw.replace(/[^a-zA-Z0-9]/g, '').slice(0, 24)}`;
}

function clampProAttributedVouchersLimit(value: number | undefined): number {
  if (!value || !Number.isFinite(value)) return 25;
  return Math.max(1, Math.min(100, Math.floor(value)));
}

function parseProAttributedVouchersCursor(cursor: string | null | undefined): { claimedAt: string; voucherId: string } | null {
  if (!cursor) return null;
  const [claimedAt, voucherId] = cursor.split('|');
  if (!claimedAt || !voucherId || Number.isNaN(Date.parse(claimedAt))) return null;
  return { claimedAt, voucherId };
}

function encodeProAttributedVouchersCursor(item: RfProAttributedVoucher): string {
  return `${item.claimedAt}|${item.voucherId}`;
}

function isAttributionSource(value: unknown): value is RfAttributionSource {
  return value === 'pro_link' || value === 'direct_offer' || value === 'internal_navigation' || value === 'unknown';
}

function isClaimSource(value: unknown): value is RfClaimSource {
  return (
    value === 'public_rf_catalog' ||
    value === 'public_offer_detail' ||
    value === 'rielt_offer_detail' ||
    value === 'pro_shared_link' ||
    value === 'unknown'
  );
}

function sanitizeAttributionMetadata(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>).slice(0, 12)) {
    if (!/^[a-zA-Z0-9_.-]{1,48}$/.test(key)) continue;
    if (typeof value === 'string') output[key] = value.slice(0, 160);
    else if (typeof value === 'number' && Number.isFinite(value)) output[key] = value;
    else if (typeof value === 'boolean') output[key] = value;
    else if (value === null) output[key] = null;
  }
  return output;
}

function parseCapturedAt(value: unknown): Date | null {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function getProLinkByShareCode(db: DbExecutor, shareCode: string): Promise<AttributionProLinkRow | null> {
  const result = await db.execute(sql`
    SELECT id, partner_id, pro_user_id, share_code, status
    FROM rf_pro_link
    WHERE share_code = ${shareCode}
    LIMIT 1
  `);
  return rowsOf<AttributionProLinkRow>(result)[0] ?? null;
}

async function resolveClaimAttribution(
  db: DbExecutor,
  partnerId: string,
  input?: RfClaimAttributionInput | null
): Promise<ResolvedClaimAttribution> {
  const source = isAttributionSource(input?.attributionSource) ? input.attributionSource : input?.shareCode ? 'pro_link' : 'unknown';
  const claimSource = isClaimSource(input?.claimSource) ? input.claimSource : 'unknown';
  const shareCode = typeof input?.shareCode === 'string' && input.shareCode.trim().length > 0 ? input.shareCode.trim() : null;
  const capturedAt = parseCapturedAt(input?.capturedAt);
  const metadata = sanitizeAttributionMetadata(input?.metadata);
  const base: ResolvedClaimAttribution = {
    version: 1,
    strategy: 'rf_pro_last_touch_before_claim',
    status: 'none',
    source,
    claimSource,
    shareCode,
    proUserId: null,
    proLinkId: null,
    capturedAt,
    confirmedAt: null,
    metadata,
  };

  if (!shareCode) return base;

  if (input?.version !== undefined && input.version !== 1) {
    return { ...base, status: 'rejected', confirmedAt: new Date(), metadata: { ...metadata, rejectionReason: 'unsupported_version' } };
  }

  if (capturedAt && Date.now() - capturedAt.getTime() > 24 * 60 * 60 * 1000) {
    return { ...base, status: 'rejected', confirmedAt: new Date(), metadata: { ...metadata, rejectionReason: 'expired_attribution_session' } };
  }

  const link = await getProLinkByShareCode(db, shareCode);
  if (!link) {
    return { ...base, status: 'rejected', confirmedAt: new Date(), metadata: { ...metadata, rejectionReason: 'share_code_not_found' } };
  }
  if (link.status !== 'active') {
    return { ...base, status: 'rejected', confirmedAt: new Date(), metadata: { ...metadata, rejectionReason: 'pro_link_inactive' } };
  }
  if (link.partner_id !== partnerId) {
    return { ...base, status: 'rejected', confirmedAt: new Date(), metadata: { ...metadata, rejectionReason: 'partner_mismatch' } };
  }

  return {
    ...base,
    status: 'confirmed',
    source: 'pro_link',
    shareCode: link.share_code ?? shareCode,
    proUserId: link.pro_user_id,
    proLinkId: link.id,
    confirmedAt: new Date(),
  };
}

async function getOwnedActivePartner(db: DbExecutor, partnerId: string, ownerUserId: string): Promise<PartnerRow | null> {
  const result = await db.execute(sql`
    SELECT id, slug, display_name, country_id, city_id, atlas_place_id, host_atlas_place_id, status, owner_user_id, created_at, updated_at
    FROM rf_partner
    WHERE id = ${partnerId}
      AND status = 'active'
      AND owner_user_id = ${ownerUserId}
    LIMIT 1
  `);
  return rowsOf<PartnerRow>(result)[0] ?? null;
}

async function requireOwnedActivePartner(
  db: DbExecutor,
  partnerId: string,
  ownerUserId: string,
  action: string
): Promise<{ ok: true; partner: Pick<PartnerRow, 'id' | 'owner_user_id' | 'status'> } | { ok: false; code: string; message: string; status: number }> {
  const partnerResult = await db.execute(sql`
    SELECT id, owner_user_id, status
    FROM rf_partner
    WHERE id = ${partnerId}
    LIMIT 1
  `);
  const partner = rowsOf<Pick<PartnerRow, 'id' | 'owner_user_id' | 'status'>>(partnerResult)[0];
  if (!partner || partner.status !== 'active') {
    return { ok: false, code: 'RF_PARTNER_NOT_FOUND', message: 'RF partner not found', status: 404 };
  }
  if (partner.owner_user_id !== ownerUserId) {
    return { ok: false, code: 'RF_PARTNER_FORBIDDEN', message: `Only partner owner can ${action}`, status: 403 };
  }
  return { ok: true, partner };
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizePartnerItemInput(input: CreatePartnerItemInput | UpdatePartnerItemInput, isCreate: boolean) {
  const title = input.title === undefined ? undefined : input.title.trim();
  if ((isCreate || input.title !== undefined) && (!title || title.length === 0)) {
    return { ok: false as const, code: 'RF_PARTNER_ITEM_INVALID', message: 'title is required', status: 400 };
  }
  if (input.priceFrom !== undefined && input.priceFrom !== null && input.priceFrom < 0) {
    return { ok: false as const, code: 'RF_PARTNER_ITEM_INVALID', message: 'priceFrom must be greater than or equal to 0', status: 400 };
  }

  const hasPrice = input.priceFrom !== undefined && input.priceFrom !== null;
  const currency = input.currency === undefined || input.currency === null ? null : input.currency.trim().toUpperCase();
  if (hasPrice && !currency) {
    return { ok: false as const, code: 'RF_PARTNER_ITEM_INVALID', message: 'currency is required when priceFrom is present', status: 400 };
  }
  if (currency !== null && !/^[A-Z]{3}$/.test(currency)) {
    return { ok: false as const, code: 'RF_PARTNER_ITEM_INVALID', message: 'currency must be a 3-letter ISO code', status: 400 };
  }

  return {
    ok: true as const,
    title,
    description: input.description === undefined ? undefined : normalizeOptionalText(input.description),
    category: input.category === undefined ? undefined : normalizeOptionalText(input.category),
    priceFrom: input.priceFrom === undefined ? undefined : input.priceFrom,
    currency: input.currency === undefined ? undefined : currency,
  };
}

type AtlasPlaceReferenceRow = {
  id: string;
  country_id: string | null;
  city_id: string | null;
};

async function getAtlasPlaceReference(db: DbExecutor, placeId: string): Promise<AtlasPlaceReferenceRow | null> {
  const result = await db.execute(sql`
    SELECT id, country_id, city_id
    FROM places
    WHERE id = ${placeId}
    LIMIT 1
  `);
  return rowsOf<AtlasPlaceReferenceRow>(result)[0] ?? null;
}

type PartnerGeoLinkValidationInput = {
  countryId: string;
  cityId: string;
  atlasPlaceId: string | null;
  hostAtlasPlaceId: string | null;
};

type PartnerGeoValidationResult = { ok: true } | { ok: false; error: string; status: number; code: string };

export async function validatePartnerGeoLinks(
  db: DbExecutor,
  input: PartnerGeoLinkValidationInput
): Promise<PartnerGeoValidationResult> {
  if (input.atlasPlaceId !== null) {
    const place = await getAtlasPlaceReference(db, input.atlasPlaceId);
    if (!place) {
      return { ok: false, error: 'atlasPlaceId is not found in Atlas places', status: 400, code: 'RF_INVALID_ATLAS_PLACE_ID' };
    }
    if (place.country_id !== input.countryId || place.city_id !== input.cityId) {
      return {
        ok: false,
        error: 'atlasPlaceId must belong to the same countryId/cityId as the partner',
        status: 400,
        code: 'RF_ATLAS_PLACE_GEO_MISMATCH',
      };
    }
  }
  if (input.hostAtlasPlaceId !== null) {
    const hostPlace = await getAtlasPlaceReference(db, input.hostAtlasPlaceId);
    if (!hostPlace) {
      return {
        ok: false,
        error: 'hostAtlasPlaceId is not found in Atlas places',
        status: 400,
        code: 'RF_INVALID_HOST_ATLAS_PLACE_ID',
      };
    }
    if (hostPlace.country_id !== input.countryId || hostPlace.city_id !== input.cityId) {
      return {
        ok: false,
        error: 'hostAtlasPlaceId must belong to the same countryId/cityId as the partner',
        status: 400,
        code: 'RF_HOST_ATLAS_PLACE_GEO_MISMATCH',
      };
    }
  }
  if (input.atlasPlaceId !== null && input.hostAtlasPlaceId !== null && input.atlasPlaceId === input.hostAtlasPlaceId) {
    return {
      ok: false,
      error: 'atlasPlaceId and hostAtlasPlaceId must reference different Atlas places',
      status: 400,
      code: 'RF_ATLAS_PLACE_CONFLICT',
    };
  }
  return { ok: true };
}

async function getOfferById(db: DbExecutor, offerId: string): Promise<OfferRow | null> {
  const result = await db.execute(sql`
    SELECT id, partner_id, item_id, title, offer_type, visibility, status, repeat_policy, points_cost, created_by_user_id, created_at, updated_at
    FROM rf_offer
    WHERE id = ${offerId}
    LIMIT 1
  `);
  return rowsOf<OfferRow>(result)[0] ?? null;
}

async function getPartnerItemById(db: DbExecutor, itemId: string): Promise<PartnerItemRow | null> {
  const result = await db.execute(sql`
    SELECT id, partner_id, title, description, category, price_from, currency, status, created_at, updated_at
    FROM rf_partner_item
    WHERE id = ${itemId}
    LIMIT 1
  `);
  return rowsOf<PartnerItemRow>(result)[0] ?? null;
}

async function getActivePartnerById(db: DbExecutor, partnerId: string): Promise<Pick<PartnerRow, 'id'> | null> {
  const result = await db.execute(sql`
    SELECT id
    FROM rf_partner
    WHERE id = ${partnerId}
      AND status = 'active'
    LIMIT 1
  `);
  return rowsOf<Pick<PartnerRow, 'id'>>(result)[0] ?? null;
}

async function getVoucherByIdAndPartner(db: DbExecutor, voucherId: string, partnerId: string): Promise<VoucherRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      contract_version,
      repeat_policy_snapshot,
      issue_sequence,
      points_cost_snapshot,
      points_debit_external_id,
      economy_status,
      expires_at,
      cancelled_at,
      status_changed_at,
      status_reason,
      status_actor_user_id,
      attribution_version,
      attribution_strategy,
      attribution_status,
      attribution_source,
      claim_source,
      attribution_share_code,
      pro_attributed_user_id,
      pro_link_id,
      attribution_captured_at,
      attribution_confirmed_at,
      attribution_metadata,
      claim_scope,
      rielt_listing_id,
      rielt_listing_title_snapshot,
      code,
      claimed_at,
      redeemed_at,
      created_at,
      updated_at
    FROM rf_voucher
    WHERE id = ${voucherId}
      AND partner_id = ${partnerId}
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
}

async function getVoucherById(db: DbExecutor, voucherId: string): Promise<VoucherRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      contract_version,
      repeat_policy_snapshot,
      issue_sequence,
      points_cost_snapshot,
      points_debit_external_id,
      economy_status,
      expires_at,
      cancelled_at,
      status_changed_at,
      status_reason,
      status_actor_user_id,
      attribution_version,
      attribution_strategy,
      attribution_status,
      attribution_source,
      claim_source,
      attribution_share_code,
      pro_attributed_user_id,
      pro_link_id,
      attribution_captured_at,
      attribution_confirmed_at,
      attribution_metadata,
      claim_scope,
      rielt_listing_id,
      rielt_listing_title_snapshot,
      code,
      claimed_at,
      redeemed_at,
      created_at,
      updated_at
    FROM rf_voucher
    WHERE id = ${voucherId}
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
}

async function getPartnerById(db: DbExecutor, partnerId: string): Promise<VoucherDiagnosticsPartnerRow | null> {
  const result = await db.execute(sql`
    SELECT id, status, owner_user_id
    FROM rf_partner
    WHERE id = ${partnerId}
    LIMIT 1
  `);
  return rowsOf<VoucherDiagnosticsPartnerRow>(result)[0] ?? null;
}

async function getListingOfferMapping(
  db: DbExecutor,
  listingId: string,
  offerId: string
): Promise<VoucherDiagnosticsListingMappingRow | null> {
  const result = await db.execute(sql`
    SELECT listing_id, rf_offer_id, rf_partner_id, status, offer_kind, priority
    FROM rielt_listing_rf_offer
    WHERE listing_id = ${listingId}
      AND rf_offer_id = ${offerId}
    LIMIT 1
  `);
  return rowsOf<VoucherDiagnosticsListingMappingRow>(result)[0] ?? null;
}

async function listVoucherRedemptionRows(db: DbExecutor, voucherId: string): Promise<VoucherDiagnosticsRedemptionRow[]> {
  const result = await db.execute(sql`
    SELECT
      id,
      voucher_id,
      result_status,
      actor_user_id,
      redeemed_at,
      created_at,
      idempotency_key,
      correlation_id
    FROM rf_voucher_redemption
    WHERE voucher_id = ${voucherId}
    ORDER BY created_at DESC, id DESC
    LIMIT 50
  `);
  return rowsOf<VoucherDiagnosticsRedemptionRow>(result);
}

async function listVoucherConsumptionGuards(db: DbExecutor, voucher: VoucherRow): Promise<VoucherDiagnosticsGuardRow[]> {
  const claimScope = voucher.claim_scope ?? 'partner';
  const scopeRef = claimScope === 'partner' ? '__partner__' : voucher.rielt_listing_id ?? '';
  const result = await db.execute(sql`
    SELECT
      g.id,
      g.offer_id,
      g.issued_to_user_id,
      g.claim_scope,
      g.scope_ref,
      g.consumed_voucher_id,
      g.repeat_policy_snapshot,
      g.consumed_at,
      v.id AS consumed_voucher_exists
    FROM rf_voucher_scope_consumption_guard g
    LEFT JOIN rf_voucher v ON v.id = g.consumed_voucher_id
    WHERE g.offer_id = ${voucher.offer_id}
      AND g.issued_to_user_id = ${voucher.issued_to_user_id}
      AND g.claim_scope = ${claimScope}
      AND g.scope_ref = ${scopeRef}
    ORDER BY g.created_at DESC, g.id DESC
    LIMIT 10
  `);
  return rowsOf<VoucherDiagnosticsGuardRow>(result);
}

async function listClaimIdempotencyBindings(db: DbExecutor, voucherId: string): Promise<VoucherDiagnosticsIdempotencyRow[]> {
  const result = await db.execute(sql`
    SELECT
      ci.operation,
      ci.actor_user_id,
      ci.idempotency_key,
      ci.voucher_id,
      ci.created_at,
      v.id AS voucher_exists
    FROM rf_claim_idempotency ci
    LEFT JOIN rf_voucher v ON v.id = ci.voucher_id
    WHERE ci.voucher_id = ${voucherId}
    ORDER BY ci.created_at DESC, ci.actor_user_id DESC
    LIMIT 50
  `);
  return rowsOf<VoucherDiagnosticsIdempotencyRow>(result);
}

async function getVoucherEconomyRecoveryMarker(db: DbExecutor, voucherId: string): Promise<VoucherDiagnosticsRecoveryRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      voucher_id,
      offer_id,
      actor_user_id,
      claim_scope,
      scope_ref,
      spend_external_id,
      compensation_external_id,
      correlation_id,
      state,
      last_error,
      created_at,
      updated_at,
      resolved_at
    FROM rf_voucher_economy_recovery
    WHERE voucher_id = ${voucherId}
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `);
  return rowsOf<VoucherDiagnosticsRecoveryRow>(result)[0] ?? null;
}

async function getVoucherFromRedemptionIdempotency(
  db: DbExecutor,
  actorUserId: string,
  idempotencyKey: string
): Promise<VoucherRow | null> {
  const result = await db.execute(sql`
    SELECT
      v.id,
      v.offer_id,
      v.partner_id,
      v.issued_to_user_id,
      v.status,
      v.canonical_status,
      v.contract_version,
      v.repeat_policy_snapshot,
      v.issue_sequence,
      v.points_cost_snapshot,
      v.points_debit_external_id,
      v.economy_status,
      v.expires_at,
      v.cancelled_at,
      v.status_changed_at,
      v.status_reason,
      v.status_actor_user_id,
      v.attribution_version,
      v.attribution_strategy,
      v.attribution_status,
      v.attribution_source,
      v.claim_source,
      v.attribution_share_code,
      v.pro_attributed_user_id,
      v.pro_link_id,
      v.attribution_captured_at,
      v.attribution_confirmed_at,
      v.attribution_metadata,
      v.claim_scope,
      v.rielt_listing_id,
      v.rielt_listing_title_snapshot,
      v.code,
      v.claimed_at,
      v.redeemed_at,
      v.created_at,
      v.updated_at
    FROM rf_voucher_redemption r
    INNER JOIN rf_voucher v ON v.id = r.voucher_id
    WHERE r.actor_user_id = ${actorUserId}
      AND r.idempotency_key = ${idempotencyKey}
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
}

async function getVoucherFromClaimIdempotency(db: DbExecutor, actorUserId: string, idempotencyKey: string): Promise<VoucherRow | null> {
  const result = await db.execute(sql`
    SELECT
      v.id,
      v.offer_id,
      v.partner_id,
      v.issued_to_user_id,
      v.status,
      v.canonical_status,
      v.contract_version,
      v.repeat_policy_snapshot,
      v.issue_sequence,
      v.points_cost_snapshot,
      v.points_debit_external_id,
      v.economy_status,
      v.expires_at,
      v.cancelled_at,
      v.status_changed_at,
      v.status_reason,
      v.status_actor_user_id,
      v.attribution_version,
      v.attribution_strategy,
      v.attribution_status,
      v.attribution_source,
      v.claim_source,
      v.attribution_share_code,
      v.pro_attributed_user_id,
      v.pro_link_id,
      v.attribution_captured_at,
      v.attribution_confirmed_at,
      v.attribution_metadata,
      v.claim_scope,
      v.rielt_listing_id,
      v.rielt_listing_title_snapshot,
      v.code,
      v.claimed_at,
      v.redeemed_at,
      v.created_at,
      v.updated_at
    FROM rf_claim_idempotency ci
    INNER JOIN rf_voucher v ON v.id = ci.voucher_id
    WHERE ci.operation = 'voucher_claim'
      AND ci.actor_user_id = ${actorUserId}
      AND ci.idempotency_key = ${idempotencyKey}
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
}

async function getClaimBarrierVoucherByOfferAndUser(
  db: DbExecutor,
  offerId: string,
  userId: string,
  repeatPolicy: RfRepeatPolicy
): Promise<VoucherRow | null> {
  const result = await db.execute(sql`
    SELECT
      id, offer_id, partner_id, issued_to_user_id, status, canonical_status, contract_version,
      repeat_policy_snapshot, issue_sequence, points_cost_snapshot, points_debit_external_id, economy_status, expires_at, cancelled_at, status_changed_at,
      status_reason, status_actor_user_id, attribution_version, attribution_strategy,
      attribution_status, attribution_source, claim_source, attribution_share_code,
      pro_attributed_user_id, pro_link_id, attribution_captured_at, attribution_confirmed_at,
      attribution_metadata, claim_scope, rielt_listing_id, rielt_listing_title_snapshot,
      code, claimed_at, redeemed_at, created_at, updated_at
    FROM rf_voucher
    WHERE offer_id = ${offerId}
      AND issued_to_user_id = ${userId}
      AND claim_scope = 'partner'
      AND (
        canonical_status IN ('available', 'locked', 'unlocked')
        OR (${repeatPolicy} = 'once_per_scope' AND canonical_status = 'redeemed')
        OR (canonical_status IS NULL AND (
          status = 'claimed'
          OR (${repeatPolicy} = 'once_per_scope' AND status = 'redeemed')
        ))
      )
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
}

async function getLatestRedeemedVoucherByOfferAndUser(db: DbExecutor, offerId: string, userId: string): Promise<VoucherRow | null> {
  const result = await db.execute(sql`
    SELECT
      id, offer_id, partner_id, issued_to_user_id, status, canonical_status, contract_version,
      repeat_policy_snapshot, issue_sequence, points_cost_snapshot, points_debit_external_id, economy_status, expires_at, cancelled_at, status_changed_at,
      status_reason, status_actor_user_id, attribution_version, attribution_strategy,
      attribution_status, attribution_source, claim_source, attribution_share_code,
      pro_attributed_user_id, pro_link_id, attribution_captured_at, attribution_confirmed_at,
      attribution_metadata, claim_scope, rielt_listing_id, rielt_listing_title_snapshot,
      code, claimed_at, redeemed_at, created_at, updated_at
    FROM rf_voucher
    WHERE offer_id = ${offerId}
      AND issued_to_user_id = ${userId}
      AND claim_scope = 'partner'
      AND (
        canonical_status = 'redeemed'
        OR (canonical_status IS NULL AND status = 'redeemed')
      )
    ORDER BY redeemed_at DESC NULLS LAST, created_at DESC, id DESC
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
}

async function getClaimBarrierVoucherByListingOfferAndUser(
  db: DbExecutor,
  listingId: string,
  offerId: string,
  userId: string,
  repeatPolicy: RfRepeatPolicy
): Promise<VoucherRow | null> {
  const result = await db.execute(sql`
    SELECT
      id, offer_id, partner_id, issued_to_user_id, status, canonical_status, contract_version,
      repeat_policy_snapshot, issue_sequence, points_cost_snapshot, points_debit_external_id, economy_status, expires_at, cancelled_at, status_changed_at,
      status_reason, status_actor_user_id, attribution_version, attribution_strategy,
      attribution_status, attribution_source, claim_source, attribution_share_code,
      pro_attributed_user_id, pro_link_id, attribution_captured_at, attribution_confirmed_at,
      attribution_metadata, claim_scope, rielt_listing_id, rielt_listing_title_snapshot,
      code, claimed_at, redeemed_at, created_at, updated_at
    FROM rf_voucher
    WHERE rielt_listing_id = ${listingId}
      AND offer_id = ${offerId}
      AND issued_to_user_id = ${userId}
      AND claim_scope = 'listing'
      AND (
        canonical_status IN ('available', 'locked', 'unlocked')
        OR (${repeatPolicy} = 'once_per_scope' AND canonical_status = 'redeemed')
        OR (canonical_status IS NULL AND (
          status = 'claimed'
          OR (${repeatPolicy} = 'once_per_scope' AND status = 'redeemed')
        ))
      )
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
}

async function getLatestRedeemedVoucherByListingOfferAndUser(
  db: DbExecutor,
  listingId: string,
  offerId: string,
  userId: string
): Promise<VoucherRow | null> {
  const result = await db.execute(sql`
    SELECT
      id, offer_id, partner_id, issued_to_user_id, status, canonical_status, contract_version,
      repeat_policy_snapshot, issue_sequence, points_cost_snapshot, points_debit_external_id, economy_status, expires_at, cancelled_at, status_changed_at,
      status_reason, status_actor_user_id, attribution_version, attribution_strategy,
      attribution_status, attribution_source, claim_source, attribution_share_code,
      pro_attributed_user_id, pro_link_id, attribution_captured_at, attribution_confirmed_at,
      attribution_metadata, claim_scope, rielt_listing_id, rielt_listing_title_snapshot,
      code, claimed_at, redeemed_at, created_at, updated_at
    FROM rf_voucher
    WHERE rielt_listing_id = ${listingId}
      AND offer_id = ${offerId}
      AND issued_to_user_id = ${userId}
      AND claim_scope = 'listing'
      AND (
        canonical_status = 'redeemed'
        OR (canonical_status IS NULL AND status = 'redeemed')
      )
    ORDER BY redeemed_at DESC NULLS LAST, created_at DESC, id DESC
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
}

async function getNextIssueSequenceForScope(
  db: DbExecutor,
  input: { offerId: string; userId: string; claimScope: VoucherClaimScope; listingId?: string | null }
): Promise<number> {
  const result = await db.execute(sql`
    SELECT COALESCE(MAX(issue_sequence), 0)::int AS max_issue_sequence
    FROM rf_voucher
    WHERE offer_id = ${input.offerId}
      AND issued_to_user_id = ${input.userId}
      AND claim_scope = ${input.claimScope}
      AND (
        (${input.claimScope} = 'partner' AND rielt_listing_id IS NULL)
        OR (${input.claimScope} = 'listing' AND rielt_listing_id = ${input.listingId ?? null})
      )
  `);
  const row = rowsOf<{ max_issue_sequence: number }>(result)[0];
  return Number(row?.max_issue_sequence ?? 0) + 1;
}

async function getListingClaimContext(db: DbExecutor, listingId: string, offerId: string): Promise<ListingClaimContextRow | null> {
  const result = await db.execute(sql`
    SELECT
      l.id AS listing_id,
      l.title AS listing_title,
      l.rf_partner_id AS listing_rf_partner_id,
      m.rf_partner_id AS mapping_partner_id,
      o.id AS offer_id,
      o.partner_id AS offer_partner_id,
      o.status AS offer_status,
      o.visibility AS offer_visibility,
      o.repeat_policy AS offer_repeat_policy,
      o.points_cost AS offer_points_cost,
      p.status AS partner_status
    FROM rielt_listing l
    INNER JOIN rielt_listing_rf_offer m
      ON m.listing_id = l.id
      AND m.rf_offer_id = ${offerId}
      AND m.status = 'active'
    INNER JOIN rf_offer o
      ON o.id = m.rf_offer_id
      AND o.partner_id = m.rf_partner_id
    INNER JOIN rf_partner p
      ON p.id = m.rf_partner_id
    WHERE l.id = ${listingId}
      AND l.status = 'published'
      AND l.deleted_at IS NULL
    LIMIT 1
  `);
  return rowsOf<ListingClaimContextRow>(result)[0] ?? null;
}

async function insertClaimIdempotency(
  db: DbExecutor,
  input: { actorUserId: string; idempotencyKey: string; voucherId: string }
): Promise<IdempotencyRow | null> {
  const result = await db.execute(sql`
    WITH inserted AS (
      INSERT INTO rf_claim_idempotency (
        operation,
        actor_user_id,
        idempotency_key,
        voucher_id,
        created_at
      )
      VALUES (
        'voucher_claim',
        ${input.actorUserId},
        ${input.idempotencyKey},
        ${input.voucherId},
        now()
      )
      ON CONFLICT (operation, actor_user_id, idempotency_key)
      DO NOTHING
      RETURNING operation, actor_user_id, idempotency_key, voucher_id, created_at
    )
    SELECT operation, actor_user_id, idempotency_key, voucher_id, created_at
    FROM inserted
    UNION ALL
    SELECT operation, actor_user_id, idempotency_key, voucher_id, created_at
    FROM rf_claim_idempotency
    WHERE operation = 'voucher_claim'
      AND actor_user_id = ${input.actorUserId}
      AND idempotency_key = ${input.idempotencyKey}
      AND NOT EXISTS (SELECT 1 FROM inserted)
    LIMIT 1
  `);
  return rowsOf<IdempotencyRow>(result)[0] ?? null;
}

function buildVoucherDiagnosticsAnomalies(input: {
  voucher: VoucherRow;
  offer: OfferRow | null;
  listingMapping: VoucherDiagnosticsListingMappingRow | null;
  proLink: ProLinkRow | null;
  redemptionRows: VoucherDiagnosticsRedemptionRow[];
  guards: VoucherDiagnosticsGuardRow[];
  claimBindings: VoucherDiagnosticsIdempotencyRow[];
  recoveryMarker: VoucherDiagnosticsRecoveryRow | null;
}): RfVoucherDiagnosticsAnomaly[] {
  const anomalies: RfVoucherDiagnosticsAnomaly[] = [];
  const voucher = input.voucher;
  const canonicalStatus = getCanonicalStatus(voucher);
  const repeatPolicy = voucher.repeat_policy_snapshot ?? 'once_per_scope';
  const successfulRedemptionCount = input.redemptionRows.filter((row) => row.result_status === 'succeeded').length;
  const guardForVoucher = input.guards.find((row) => row.consumed_voucher_id === voucher.id) ?? null;

  if (canonicalStatus === 'redeemed' && successfulRedemptionCount === 0) {
    anomalies.push({
      code: 'voucher_redeemed_without_redemption_row',
      severity: 'critical',
      message: 'Voucher is redeemed but no succeeded redemption row was found.',
      evidence: { voucherId: voucher.id, canonicalStatus },
    });
  }

  if (canonicalStatus !== 'redeemed' && successfulRedemptionCount > 0) {
    anomalies.push({
      code: 'redemption_row_without_redeemed_status',
      severity: 'critical',
      message: 'Succeeded redemption row exists while voucher canonical status is not redeemed.',
      evidence: { voucherId: voucher.id, canonicalStatus, successfulRedemptionCount },
    });
  }

  if (canonicalStatus === 'redeemed' && repeatPolicy === 'once_per_scope' && !guardForVoucher) {
    anomalies.push({
      code: 'once_per_scope_redeemed_without_guard',
      severity: 'critical',
      message: 'Once-per-scope redeemed voucher has no consumption guard.',
      evidence: { voucherId: voucher.id, repeatPolicy },
    });
  }

  if (canonicalStatus === 'redeemed' && repeatPolicy === 'repeat_after_redeem' && !!guardForVoucher) {
    anomalies.push({
      code: 'unexpected_repeat_after_redeem_guard',
      severity: 'warning',
      message: 'Repeat-after-redeem voucher unexpectedly has a consumption guard.',
      evidence: { voucherId: voucher.id, guardId: guardForVoucher.id },
    });
  }

  if (mapLegacyStatusToCanonical(voucher.status) !== canonicalStatus) {
    anomalies.push({
      code: 'legacy_status_canonical_status_mismatch',
      severity: 'warning',
      message: 'Legacy status and canonical status diverge.',
      evidence: { voucherId: voucher.id, status: voucher.status, canonicalStatus },
    });
  }

  if ((voucher.claim_scope ?? 'partner') === 'listing' && !voucher.rielt_listing_id) {
    anomalies.push({
      code: 'listing_scope_missing_listing_id',
      severity: 'critical',
      message: 'Listing-scoped voucher has no listing id.',
      evidence: { voucherId: voucher.id, claimScope: voucher.claim_scope ?? 'partner' },
    });
  }

  if (input.guards.some((guard) => guard.consumed_voucher_exists === null)) {
    anomalies.push({
      code: 'guard_points_to_missing_voucher',
      severity: 'critical',
      message: 'Consumption guard points to a missing voucher.',
      evidence: { voucherId: voucher.id },
    });
  }

  if (input.claimBindings.some((binding) => binding.voucher_exists === null)) {
    anomalies.push({
      code: 'idempotency_points_to_missing_voucher',
      severity: 'critical',
      message: 'Claim idempotency row points to a missing voucher.',
      evidence: { voucherId: voucher.id },
    });
  }

  if ((voucher.attribution_status ?? 'none') === 'confirmed' && !voucher.pro_link_id) {
    anomalies.push({
      code: 'confirmed_attribution_without_pro_link',
      severity: 'warning',
      message: 'Confirmed attribution is present without pro link id.',
      evidence: { voucherId: voucher.id },
    });
  }

  if ((voucher.attribution_status ?? 'none') === 'rejected') {
    anomalies.push({
      code: 'rejected_attribution_present',
      severity: 'info',
      message: 'Voucher attribution is rejected.',
      evidence: { voucherId: voucher.id },
    });
  }

  if ((voucher.claim_scope ?? 'partner') === 'listing' && voucher.rielt_listing_id && (!input.listingMapping || input.listingMapping.status !== 'active')) {
    anomalies.push({
      code: 'listing_mapping_missing_or_inactive',
      severity: 'warning',
      message: 'Listing-scoped voucher mapping is missing or inactive.',
      evidence: {
        voucherId: voucher.id,
        listingId: voucher.rielt_listing_id,
        mappingStatus: input.listingMapping?.status ?? null,
      },
    });
  }

  if (input.proLink && input.proLink.partner_id !== voucher.partner_id) {
    anomalies.push({
      code: 'attribution_pro_link_partner_mismatch',
      severity: 'warning',
      message: 'Voucher attribution pro link belongs to a different partner.',
      evidence: {
        voucherId: voucher.id,
        voucherPartnerId: voucher.partner_id,
        proLinkPartnerId: input.proLink.partner_id,
      },
    });
  }

  if ((voucher.issue_sequence ?? 1) > 1 && !input.offer) {
    anomalies.push({
      code: 'repeat_sequence_gap',
      severity: 'info',
      message: 'Issue sequence suggests repeatability history but offer relation is missing.',
      evidence: { voucherId: voucher.id, issueSequence: voucher.issue_sequence ?? 1 },
    });
  }

  const isActiveCanonical = canonicalStatus === 'available' || canonicalStatus === 'locked' || canonicalStatus === 'unlocked';
  if (isActiveCanonical && input.guards.length > 0) {
    anomalies.push({
      code: 'active_duplicate_possible',
      severity: 'info',
      message: 'Active voucher has existing guards in same scope; verify historical consistency.',
      evidence: { voucherId: voucher.id, guardCount: input.guards.length },
    });
  }

  if ((voucher.economy_status ?? 'not_required') === 'debited' && !voucher.points_debit_external_id) {
    anomalies.push({
      code: 'debited_without_external_id',
      severity: 'warning',
      message: 'Voucher is marked as debited but points debit external id is missing.',
      evidence: { voucherId: voucher.id, economyStatus: voucher.economy_status ?? 'not_required' },
    });
  }

  if (input.recoveryMarker) {
    anomalies.push({
      code: 'spend_succeeded_claim_failed',
      severity: input.recoveryMarker.state === 'pending' ? 'critical' : 'warning',
      message: 'Spend completed but claim finalization required compensation handling.',
      evidence: {
        voucherId: voucher.id,
        recoveryState: input.recoveryMarker.state,
      },
    });
  }

  if (input.recoveryMarker?.state === 'pending') {
    const createdAtMs = new Date(input.recoveryMarker.created_at).getTime();
    if (Number.isFinite(createdAtMs) && Date.now() - createdAtMs > 15 * 60 * 1000) {
      anomalies.push({
        code: 'compensation_pending_too_long',
        severity: 'critical',
        message: 'Compensation recovery marker is pending for too long.',
        evidence: {
          voucherId: voucher.id,
          pendingSince: asIso(input.recoveryMarker.created_at),
        },
      });
    }
  }

  if ((voucher.economy_status ?? 'not_required') === 'debit_failed' && isActiveCanonical) {
    anomalies.push({
      code: 'debit_failed_visible_voucher',
      severity: 'critical',
      message: 'Voucher is visible in active lifecycle while economy status is debit_failed.',
      evidence: { voucherId: voucher.id, canonicalStatus },
    });
  }

  return anomalies;
}

export async function getVoucherDiagnostics(
  db: DbExecutor,
  voucherId: string
): Promise<{ ok: true; diagnostics: RfVoucherDiagnostics } | { ok: false; code: string; message: string; status: number }> {
  const voucher = await getVoucherById(db, voucherId);
  if (!voucher) {
    return { ok: false, code: 'RF_VOUCHER_NOT_FOUND', message: 'RF voucher not found', status: 404 };
  }

  const offer = await getOfferById(db, voucher.offer_id);
  const partner = await getPartnerById(db, voucher.partner_id);
  const claimScope = voucher.claim_scope ?? 'partner';
  const listingMapping =
    claimScope === 'listing' && voucher.rielt_listing_id
      ? await getListingOfferMapping(db, voucher.rielt_listing_id, voucher.offer_id)
      : null;
  const redemptionRows = await listVoucherRedemptionRows(db, voucher.id);
  const guards = await listVoucherConsumptionGuards(db, voucher);
  const guardForVoucher = guards.find((row) => row.consumed_voucher_id === voucher.id) ?? null;
  const claimBindings = await listClaimIdempotencyBindings(db, voucher.id);
  const recoveryMarker = await getVoucherEconomyRecoveryMarker(db, voucher.id);
  const proLink =
    typeof voucher.pro_link_id === 'string' && voucher.pro_link_id.trim().length > 0
      ? await (async () => {
          const result = await db.execute(sql`
            SELECT id, partner_id, pro_user_id, share_code, status, role_scope, created_at, updated_at
            FROM rf_pro_link
            WHERE id = ${voucher.pro_link_id}
            LIMIT 1
          `);
          return rowsOf<ProLinkRow>(result)[0] ?? null;
        })()
      : null;

  const attributionMetadata = toAttributionMetadata(voucher.attribution_metadata);
  const anomalies = buildVoucherDiagnosticsAnomalies({
    voucher,
    offer,
    listingMapping,
    proLink,
    redemptionRows,
    guards,
    claimBindings,
    recoveryMarker,
  });

  const diagnostics: RfVoucherDiagnostics = {
    voucher: {
      voucherId: voucher.id,
      offerId: voucher.offer_id,
      partnerId: voucher.partner_id,
      issuedToUserId: voucher.issued_to_user_id,
      claimScope,
      listingId: voucher.rielt_listing_id ?? null,
      listingTitleSnapshot: voucher.rielt_listing_title_snapshot ?? null,
      status: voucher.status,
      canonicalStatus: getCanonicalStatus(voucher),
      contractVersion: voucher.contract_version ?? 1,
      repeatPolicySnapshot: voucher.repeat_policy_snapshot ?? 'once_per_scope',
      issueSequence: voucher.issue_sequence ?? 1,
      pointsCostSnapshot: getVoucherPointsCostSnapshot(voucher),
      pointsDebitExternalId: voucher.points_debit_external_id ?? null,
      pointsCompensationExternalId: recoveryMarker?.compensation_external_id ?? null,
      economyStatus: getVoucherEconomyStatus(voucher),
      economyTransitionTimestamps: {
        spendAttemptedAt: asIso(voucher.claimed_at),
        compensationAttemptedAt: asIso(recoveryMarker?.created_at ?? null),
        compensationResolvedAt: asIso(recoveryMarker?.resolved_at ?? null),
      },
      claimedAt: asIso(voucher.claimed_at) ?? new Date(0).toISOString(),
      redeemedAt: asIso(voucher.redeemed_at),
      cancelledAt: asIso(voucher.cancelled_at ?? null),
      expiresAt: asIso(voucher.expires_at ?? null),
      statusChangedAt: asIso(voucher.status_changed_at ?? null),
      statusReason: voucher.status_reason ?? null,
      statusActorUserId: voucher.status_actor_user_id ?? null,
      codeMasked: maskTail(voucher.code),
    },
    relations: {
      offer: offer
        ? {
            id: offer.id,
            partnerId: offer.partner_id,
            status: offer.status,
            visibility: offer.visibility,
            repeatPolicy: offer.repeat_policy ?? 'once_per_scope',
          }
        : null,
      partner: partner
        ? {
            id: partner.id,
            status: partner.status,
            ownerUserId: partner.owner_user_id,
          }
        : null,
      listingMapping: listingMapping
        ? {
            listingId: listingMapping.listing_id,
            offerId: listingMapping.rf_offer_id,
            partnerId: listingMapping.rf_partner_id,
            status: listingMapping.status,
            offerKind: listingMapping.offer_kind,
            priority: Number(listingMapping.priority ?? 0),
          }
        : null,
      proLink: proLink
        ? {
            id: proLink.id,
            partnerId: proLink.partner_id,
            proUserId: proLink.pro_user_id,
            status: proLink.status,
            shareCodeMasked: maskTail(proLink.share_code ?? null),
          }
        : null,
    },
    redemption: {
      items: redemptionRows.map((row) => ({
        id: row.id,
        voucherId: row.voucher_id,
        resultStatus: row.result_status,
        actorUserId: row.actor_user_id ?? null,
        redeemedAt: asIso(row.redeemed_at ?? null),
        createdAt: asIso(row.created_at) ?? new Date(0).toISOString(),
        idempotencyKeyFingerprint: toFingerprint(row.idempotency_key),
        correlationIdMasked: maskTail(row.correlation_id ?? null),
      })),
      hasSuccessfulRedemption: redemptionRows.some((row) => row.result_status === 'succeeded'),
      successfulRedemptionCount: redemptionRows.filter((row) => row.result_status === 'succeeded').length,
      totalRedemptionAttempts: redemptionRows.length,
    },
    consumptionGuard: {
      exists: !!guardForVoucher,
      offerId: guardForVoucher?.offer_id ?? null,
      issuedToUserId: guardForVoucher?.issued_to_user_id ?? null,
      claimScope: guardForVoucher?.claim_scope ?? null,
      scopeRef: guardForVoucher?.scope_ref ?? null,
      consumedVoucherId: guardForVoucher?.consumed_voucher_id ?? null,
      repeatPolicySnapshot: guardForVoucher?.repeat_policy_snapshot ?? null,
      consumedAt: asIso(guardForVoucher?.consumed_at ?? null),
    },
    attribution: {
      attributionVersion: voucher.attribution_version ?? 1,
      attributionStrategy: voucher.attribution_strategy ?? 'rf_pro_last_touch_before_claim',
      attributionStatus: voucher.attribution_status ?? 'none',
      attributionSource: voucher.attribution_source ?? 'unknown',
      claimSource: voucher.claim_source ?? 'unknown',
      proAttributedUserId: voucher.pro_attributed_user_id ?? null,
      proLinkId: voucher.pro_link_id ?? null,
      attributionConfirmedAt: asIso(voucher.attribution_confirmed_at ?? null),
      attributionCapturedAt: asIso(voucher.attribution_captured_at ?? null),
      attributionRejectedReason: getAttributionRejectedReason(attributionMetadata),
      metadataKeys: Object.keys(attributionMetadata).slice(0, 12),
    },
    idempotency: {
      claimBindings: claimBindings.map((row) => ({
        operation: row.operation,
        actorUserId: row.actor_user_id,
        voucherId: row.voucher_id,
        createdAt: asIso(row.created_at) ?? new Date(0).toISOString(),
        idempotencyKeyFingerprint: toFingerprint(row.idempotency_key) ?? 'fnv1a_00000000',
      })),
    },
    economyRecovery: {
      exists: !!recoveryMarker,
      state: recoveryMarker?.state ?? null,
      spendExternalId: recoveryMarker?.spend_external_id ?? null,
      compensationExternalId: recoveryMarker?.compensation_external_id ?? null,
      correlationIdMasked: maskTail(recoveryMarker?.correlation_id ?? null),
      lastErrorMasked: maskTail(recoveryMarker?.last_error ?? null),
      createdAt: asIso(recoveryMarker?.created_at ?? null),
      updatedAt: asIso(recoveryMarker?.updated_at ?? null),
      resolvedAt: asIso(recoveryMarker?.resolved_at ?? null),
    },
    anomalies,
  };

  return { ok: true, diagnostics };
}

export function shouldThrottleWrite(actorUserId: string, operation: 'claim' | 'redeem'): boolean {
  const now = Date.now();
  const key = `${actorUserId}:${operation}`;
  const limit = 15;
  const windowMs = 60_000;
  const values = writeTimestampsByActorAndOp.get(key) ?? [];
  const recent = values.filter((value) => now - value < windowMs);
  if (recent.length >= limit) return true;
  recent.push(now);
  writeTimestampsByActorAndOp.set(key, recent);
  return false;
}

export async function listPublicPartners(db: DbExecutor): Promise<Partner[]> {
  const result = await db.execute(sql`
    SELECT id, slug, display_name, country_id, city_id, atlas_place_id, host_atlas_place_id, status, owner_user_id, created_at, updated_at
    FROM rf_partner
    WHERE status = 'active'
    ORDER BY created_at DESC, id DESC
  `);
  return rowsOf<PartnerRow>(result).map(toPartner);
}

export async function getPublicPartnerById(db: DbExecutor, partnerId: string): Promise<Partner | null> {
  const result = await db.execute(sql`
    SELECT id, slug, display_name, country_id, city_id, atlas_place_id, host_atlas_place_id, status, owner_user_id, created_at, updated_at
    FROM rf_partner
    WHERE id = ${partnerId}
      AND status = 'active'
    LIMIT 1
  `);
  const row = rowsOf<PartnerRow>(result)[0];
  return row ? toPartner(row) : null;
}

export async function listPublicOffers(db: DbExecutor): Promise<Offer[]> {
  const result = await db.execute(sql`
    SELECT id, partner_id, item_id, title, offer_type, visibility, status, repeat_policy, points_cost, created_by_user_id, created_at, updated_at
    FROM rf_offer
    WHERE status = 'active'
      AND visibility = 'public'
    ORDER BY created_at DESC, id DESC
  `);
  return rowsOf<OfferRow>(result).map(toOffer);
}

export async function getPublicOfferById(db: DbExecutor, offerId: string): Promise<Offer | null> {
  const result = await db.execute(sql`
    SELECT id, partner_id, item_id, title, offer_type, visibility, status, repeat_policy, points_cost, created_by_user_id, created_at, updated_at
    FROM rf_offer
    WHERE id = ${offerId}
      AND status = 'active'
      AND visibility = 'public'
    LIMIT 1
  `);
  const row = rowsOf<OfferRow>(result)[0];
  return row ? toOffer(row) : null;
}

export async function getRieltListingOfferContext(db: DbExecutor, listingId: string): Promise<RieltListingOfferContext | null> {
  const listingResult = await db.execute(sql`
    SELECT id, title, rf_partner_id
    FROM rielt_listing
    WHERE id = ${listingId}
      AND status = 'published'
      AND deleted_at IS NULL
    LIMIT 1
  `);
  const listing = rowsOf<RieltListingSummaryRow>(listingResult)[0] ?? null;
  if (!listing) return null;

  const mappedOffersResult = await db.execute(sql`
    SELECT
      o.id,
      o.partner_id,
      o.item_id,
      o.title,
      o.offer_type,
      o.visibility,
      o.status,
      o.repeat_policy,
      o.created_by_user_id,
      o.created_at,
      o.updated_at,
      m.status AS mapping_status,
      m.offer_kind,
      m.priority,
      m.applicability_note,
      p.slug AS partner_slug,
      p.display_name AS partner_display_name,
      p.country_id AS partner_country_id,
      p.city_id AS partner_city_id,
      p.atlas_place_id AS partner_atlas_place_id,
      p.host_atlas_place_id AS partner_host_atlas_place_id,
      p.status AS partner_status,
      p.owner_user_id AS partner_owner_user_id,
      p.created_at AS partner_created_at,
      p.updated_at AS partner_updated_at
    FROM rielt_listing_rf_offer m
    INNER JOIN rf_offer o ON o.id = m.rf_offer_id AND o.partner_id = m.rf_partner_id
    INNER JOIN rf_partner p ON p.id = m.rf_partner_id
    WHERE m.listing_id = ${listingId}
      AND m.status = 'active'
      AND o.status = 'active'
      AND o.visibility = 'public'
      AND p.status = 'active'
    ORDER BY m.priority ASC, o.created_at DESC, o.id DESC
  `);
  const mappedOffers = rowsOf<RieltListingOfferMappingRow>(mappedOffersResult);
  const firstMapped = mappedOffers[0] ?? null;
  const partner =
    firstMapped !== null
      ? toPartnerFromMappingRow(firstMapped)
      : listing.rf_partner_id
        ? await getPublicPartnerById(db, listing.rf_partner_id)
        : null;

  return {
    listing: {
      id: listing.id,
      title: listing.title,
      rfPartnerId: listing.rf_partner_id ?? partner?.id ?? null,
    },
    partner,
    offers: mappedOffers.map((row) => ({
      ...toOffer(row),
      type: row.offer_kind,
      benefit: row.title,
      description: null,
      availability: 'available' as const,
      applicabilityNote: row.applicability_note ?? null,
      priority: Number(row.priority ?? 100),
    })),
  };
}

export async function createPartner(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: { displayName: string; countryId: string; cityId: string; atlasPlaceId: string | null; hostAtlasPlaceId: string | null }
): Promise<Partner> {
  const id = nextId('rf_partner');
  const result = await db.execute(sql`
    INSERT INTO rf_partner (
      id,
      slug,
      display_name,
      country_id,
      city_id,
      atlas_place_id,
      host_atlas_place_id,
      status,
      owner_user_id,
      created_at,
      updated_at
    )
    VALUES (
      ${id},
      ${toSlug(input.displayName)},
      ${input.displayName},
      ${input.countryId},
      ${input.cityId},
      ${input.atlasPlaceId},
      ${input.hostAtlasPlaceId},
      'active',
      ${principal.userId},
      now(),
      now()
    )
    RETURNING id, slug, display_name, country_id, city_id, atlas_place_id, host_atlas_place_id, status, owner_user_id, created_at, updated_at
  `);
  const row = rowsOf<PartnerRow>(result)[0];
  if (!row) {
    throw new Error('Failed to persist RF partner');
  }
  return toPartner(row);
}

export async function listPartnerItems(
  db: DbExecutor,
  principal: GatewayPrincipal,
  partnerId: string
): Promise<PartnerItemsResult> {
  const access = await requireOwnedActivePartner(db, partnerId, principal.userId, 'list partner items');
  if (!access.ok) return access;

  const result = await db.execute(sql`
    SELECT id, partner_id, title, description, category, price_from, currency, status, created_at, updated_at
    FROM rf_partner_item
    WHERE partner_id = ${partnerId}
    ORDER BY
      CASE status
        WHEN 'active' THEN 0
        WHEN 'archived' THEN 1
        ELSE 2
      END ASC,
      updated_at DESC,
      id DESC
  `);
  return { ok: true, items: rowsOf<PartnerItemRow>(result).map(toPartnerItem) };
}

export async function createPartnerItem(
  db: DbExecutor,
  principal: GatewayPrincipal,
  partnerId: string,
  input: CreatePartnerItemInput
): Promise<PartnerItemResult> {
  const access = await requireOwnedActivePartner(db, partnerId, principal.userId, 'create partner items');
  if (!access.ok) return access;

  const normalized = normalizePartnerItemInput(input, true);
  if (!normalized.ok) return normalized;

  const result = await db.execute(sql`
    INSERT INTO rf_partner_item (
      id,
      partner_id,
      title,
      description,
      category,
      price_from,
      currency,
      status,
      created_at,
      updated_at
    )
    VALUES (
      ${nextId('rf_partner_item')},
      ${partnerId},
      ${normalized.title},
      ${normalized.description ?? null},
      ${normalized.category ?? null},
      ${normalized.priceFrom ?? null},
      ${normalized.currency ?? null},
      'active',
      now(),
      now()
    )
    RETURNING id, partner_id, title, description, category, price_from, currency, status, created_at, updated_at
  `);
  const row = rowsOf<PartnerItemRow>(result)[0];
  if (!row) throw new Error('Failed to persist RF partner item');
  return { ok: true, item: toPartnerItem(row) };
}

export async function updatePartnerItem(
  db: DbExecutor,
  principal: GatewayPrincipal,
  partnerId: string,
  itemId: string,
  input: UpdatePartnerItemInput
): Promise<PartnerItemResult> {
  const access = await requireOwnedActivePartner(db, partnerId, principal.userId, 'update partner items');
  if (!access.ok) return access;

  const current = await getPartnerItemById(db, itemId);
  if (!current || current.partner_id !== partnerId) {
    return { ok: false, code: 'RF_PARTNER_ITEM_NOT_FOUND', message: 'RF partner item not found', status: 404 };
  }

  const normalized = normalizePartnerItemInput(input, false);
  if (!normalized.ok) return normalized;

  const result = await db.execute(sql`
    UPDATE rf_partner_item
    SET
      title = CASE WHEN ${normalized.title !== undefined} THEN ${normalized.title ?? null} ELSE title END,
      description = CASE WHEN ${normalized.description !== undefined} THEN ${normalized.description ?? null} ELSE description END,
      category = CASE WHEN ${normalized.category !== undefined} THEN ${normalized.category ?? null} ELSE category END,
      price_from = CASE WHEN ${normalized.priceFrom !== undefined} THEN ${normalized.priceFrom ?? null} ELSE price_from END,
      currency = CASE WHEN ${normalized.currency !== undefined} THEN ${normalized.currency ?? null} ELSE currency END,
      updated_at = now()
    WHERE id = ${itemId}
      AND partner_id = ${partnerId}
    RETURNING id, partner_id, title, description, category, price_from, currency, status, created_at, updated_at
  `);
  const row = rowsOf<PartnerItemRow>(result)[0];
  if (!row) return { ok: false, code: 'RF_PARTNER_ITEM_NOT_FOUND', message: 'RF partner item not found', status: 404 };
  return { ok: true, item: toPartnerItem(row) };
}

export async function archivePartnerItem(
  db: DbExecutor,
  principal: GatewayPrincipal,
  partnerId: string,
  itemId: string
): Promise<PartnerItemResult> {
  const access = await requireOwnedActivePartner(db, partnerId, principal.userId, 'archive partner items');
  if (!access.ok) return access;

  const current = await getPartnerItemById(db, itemId);
  if (!current || current.partner_id !== partnerId) {
    return { ok: false, code: 'RF_PARTNER_ITEM_NOT_FOUND', message: 'RF partner item not found', status: 404 };
  }
  if (current.status === 'archived') return { ok: true, item: toPartnerItem(current) };

  const result = await db.execute(sql`
    UPDATE rf_partner_item
    SET
      status = 'archived',
      updated_at = now()
    WHERE id = ${itemId}
      AND partner_id = ${partnerId}
    RETURNING id, partner_id, title, description, category, price_from, currency, status, created_at, updated_at
  `);
  const row = rowsOf<PartnerItemRow>(result)[0];
  if (!row) return { ok: false, code: 'RF_PARTNER_ITEM_NOT_FOUND', message: 'RF partner item not found', status: 404 };
  return { ok: true, item: toPartnerItem(row) };
}

export async function createOffer(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: {
    partnerId: string;
    itemId?: string | null;
    title: string;
    offerType: Offer['offerType'];
    visibility: Offer['visibility'];
  }
): Promise<Offer | { error: string; status: number }> {
  const partner = await getOwnedActivePartner(db, input.partnerId, principal.userId);
  if (!partner) return { error: 'Partner not found', status: 404 };

  const itemId = input.itemId?.trim() || null;
  if (itemId) {
    const item = await getPartnerItemById(db, itemId);
    if (!item || item.partner_id !== input.partnerId) return { error: 'Partner item not found', status: 404 };
    if (item.status !== 'active') return { error: 'Partner item is archived', status: 409 };
  }

  const id = nextId('rf_offer');
  const result = await db.execute(sql`
    INSERT INTO rf_offer (
      id,
      partner_id,
      item_id,
      title,
      offer_type,
      visibility,
      status,
      created_by_user_id,
      created_at,
      updated_at
    )
    VALUES (
      ${id},
      ${input.partnerId},
      ${itemId},
      ${input.title},
      ${input.offerType},
      ${input.visibility},
      'draft',
      ${principal.userId},
      now(),
      now()
    )
    RETURNING id, partner_id, item_id, title, offer_type, visibility, status, repeat_policy, points_cost, created_by_user_id, created_at, updated_at
  `);
  const row = rowsOf<OfferRow>(result)[0];
  if (!row) throw new Error('Failed to persist RF offer');
  return toOffer(row);
}

export async function activateOffer(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: { partnerId: string; offerId: string }
): Promise<Offer | { error: string; status: number }> {
  const partner = await getOwnedActivePartner(db, input.partnerId, principal.userId);
  if (!partner) return { error: 'Partner not found', status: 404 };

  const offer = await getOfferById(db, input.offerId);
  if (!offer || offer.partner_id !== input.partnerId) return { error: 'Offer not found', status: 404 };
  if (offer.status === 'archived') return { error: 'Archived offer cannot be activated', status: 409 };
  if (offer.status === 'active') return toOffer(offer);

  const result = await db.execute(sql`
    UPDATE rf_offer
    SET
      status = 'active',
      updated_at = now()
    WHERE id = ${input.offerId}
      AND partner_id = ${input.partnerId}
      AND status = 'draft'
    RETURNING id, partner_id, item_id, title, offer_type, visibility, status, repeat_policy, points_cost, created_by_user_id, created_at, updated_at
  `);
  const updated = rowsOf<OfferRow>(result)[0];
  if (updated) return toOffer(updated);

  const latest = await getOfferById(db, input.offerId);
  if (!latest || latest.partner_id !== input.partnerId) return { error: 'Offer not found', status: 404 };
  if (latest.status === 'active') return toOffer(latest);
  if (latest.status === 'archived') return { error: 'Archived offer cannot be activated', status: 409 };
  return { error: 'Offer activation conflict', status: 409 };
}

export async function claimVoucher(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: {
    offerId: string;
    idempotencyKey: string;
    attribution?: RfClaimAttributionInput | null;
    correlationId?: string | null;
    economy?: RfClaimEconomyRuntime | null;
  }
): Promise<ClaimResult> {
  const replayVoucher = await getVoucherFromClaimIdempotency(db, principal.userId, input.idempotencyKey);
  if (replayVoucher) {
    const replayScope = replayVoucher.claim_scope ?? 'partner';
    if (replayVoucher.offer_id !== input.offerId || replayScope !== 'partner') {
      return {
        ok: false,
        code: 'RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH',
        message: 'Idempotency-Key was already used for a different voucher claim context',
        status: 409,
      };
    }
    return {
      ok: true,
      voucher: toVoucher(replayVoucher),
      idempotentReplay: true,
      createdNewInstance: false,
      claimBlockReason: null,
      repeatPolicy: getVoucherRepeatPolicySnapshot(replayVoucher),
    };
  }

  const offer = await getOfferById(db, input.offerId);
  if (!offer) return { ok: false, code: 'RF_OFFER_NOT_FOUND', message: 'RF offer not found', status: 404 };
  if (offer.status !== 'active') {
    return { ok: false, code: 'RF_OFFER_INACTIVE', message: 'RF offer is not active', status: 409 };
  }
  if (offer.visibility !== 'public') {
    return { ok: false, code: 'RF_OFFER_NOT_CLAIMABLE', message: 'RF offer is not publicly claimable', status: 409 };
  }

  const activePartner = await getActivePartnerById(db, offer.partner_id);
  if (!activePartner) {
    return { ok: false, code: 'RF_PARTNER_INACTIVE', message: 'RF partner is not active', status: 409 };
  }

  const repeatPolicy = getEffectiveRepeatPolicy(offer);
  const barrierVoucher = await getClaimBarrierVoucherByOfferAndUser(db, offer.id, principal.userId, repeatPolicy);
  if (barrierVoucher) {
    const idempotency = await insertClaimIdempotency(db, {
      actorUserId: principal.userId,
      idempotencyKey: input.idempotencyKey,
      voucherId: barrierVoucher.id,
    });
    if (!idempotency) {
      return { ok: false, code: 'RF_CLAIM_IDEMPOTENCY_FAILED', message: 'Unable to persist idempotency key', status: 500 };
    }
    const claimBlockReason = getCanonicalStatus(barrierVoucher) === 'redeemed' ? 'once_per_scope_consumed' : 'existing_active_voucher';
    return {
      ok: true,
      voucher: toVoucher(barrierVoucher),
      idempotentReplay: false,
      createdNewInstance: false,
      claimBlockReason,
      repeatPolicy,
    };
  }

  const attribution = await resolveClaimAttribution(db, offer.partner_id, input.attribution);
  const issueSequence =
    repeatPolicy === 'repeat_after_redeem'
      ? await getNextIssueSequenceForScope(db, {
          offerId: offer.id,
          userId: principal.userId,
          claimScope: 'partner',
        })
      : 1;
  const pointsCost = Number(offer.points_cost ?? 0);
  const pointsCostSnapshot = Number.isFinite(pointsCost) && pointsCost > 0 ? pointsCost : 0;
  const spendEnabled = pointsCostSnapshot > 0 && input.economy?.enabled === true;
  if (pointsCostSnapshot > 0 && spendEnabled && !isVipSpacerPrincipal(principal)) {
    return {
      ok: false,
      code: 'RF_VIP_REQUIRED_FOR_PAID_VOUCHER',
      message: 'VIP role is required for paid voucher claims',
      status: 409,
    };
  }
  const economyStatus: RfVoucherEconomyStatus = spendEnabled
    ? 'debited'
    : pointsCostSnapshot > 0
      ? 'pending'
      : 'not_required';

  // This legacy endpoint remains partner-scoped. Listing-scoped claims must use
  // a dedicated endpoint that validates listing mapping and claim context.
  const voucherId = await buildDeterministicVoucherId({
    actorUserId: principal.userId,
    offerId: offer.id,
    idempotencyKey: input.idempotencyKey,
    claimScope: 'partner',
  });
  const voucherCode = toVoucherCode(voucherId);
  const spendExternalId = spendEnabled ? buildSpendExternalId(voucherId) : null;
  let compensationExternalId: string | null = null;

  if (spendEnabled && spendExternalId && input.economy) {
    const spendResult = await input.economy.spendPoints({
      userId: principal.userId,
      amount: pointsCostSnapshot,
      voucherId,
      correlationId: input.correlationId ?? null,
      claimScope: 'partner',
      scopeRef: null,
    });
    if (!spendResult.ok) {
      return {
        ok: false,
        code: spendResult.code,
        message: spendResult.message,
        status: spendResult.status,
      };
    }
  }

  const insertResult = await db.execute(sql`
    INSERT INTO rf_voucher (
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      repeat_policy_snapshot,
      issue_sequence,
      points_cost_snapshot,
      points_debit_external_id,
      economy_status,
      claim_scope,
      rielt_listing_id,
      rielt_listing_title_snapshot,
      code,
      claimed_at,
      redeemed_at,
      status_changed_at,
      status_actor_user_id,
      attribution_version,
      attribution_strategy,
      attribution_status,
      attribution_source,
      claim_source,
      attribution_share_code,
      pro_attributed_user_id,
      pro_link_id,
      attribution_captured_at,
      attribution_confirmed_at,
      attribution_metadata,
      contract_version,
      created_at,
      updated_at
    )
    VALUES (
      ${voucherId},
      ${offer.id},
      ${offer.partner_id},
      ${principal.userId},
      'claimed',
      'available',
      ${repeatPolicy},
      ${issueSequence},
      ${pointsCostSnapshot},
      ${spendExternalId},
      ${economyStatus},
      'partner',
      NULL,
      NULL,
      ${voucherCode},
      now(),
      NULL,
      now(),
      ${principal.userId},
      ${attribution.version},
      ${attribution.strategy},
      ${attribution.status},
      ${attribution.source},
      ${attribution.claimSource},
      ${attribution.shareCode},
      ${attribution.proUserId},
      ${attribution.proLinkId},
      ${attribution.capturedAt},
      ${attribution.confirmedAt},
      ${JSON.stringify(attribution.metadata)}::jsonb,
      1,
      now(),
      now()
    )
    ON CONFLICT (offer_id, issued_to_user_id) WHERE claim_scope = 'partner' AND (canonical_status IN ('available', 'locked', 'unlocked') OR (canonical_status = 'redeemed' AND repeat_policy_snapshot = 'once_per_scope'))
    DO NOTHING
    RETURNING
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      contract_version,
      repeat_policy_snapshot,
      issue_sequence,
      points_cost_snapshot,
      points_debit_external_id,
      economy_status,
      expires_at,
      cancelled_at,
      status_changed_at,
      status_reason,
      status_actor_user_id,
      attribution_version,
      attribution_strategy,
      attribution_status,
      attribution_source,
      claim_source,
      attribution_share_code,
      pro_attributed_user_id,
      pro_link_id,
      attribution_captured_at,
      attribution_confirmed_at,
      attribution_metadata,
      claim_scope,
      rielt_listing_id,
      rielt_listing_title_snapshot,
      code,
      claimed_at,
      redeemed_at,
      created_at,
      updated_at
  `);
  let voucherRow: VoucherRow | null = rowsOf<VoucherRow>(insertResult)[0] ?? null;

  if (!voucherRow) {
    if (spendEnabled && spendExternalId && input.economy) {
      compensationExternalId = buildCompensationExternalId(voucherId);
      const compensation = await input.economy.compensatePoints({
        userId: principal.userId,
        amount: pointsCostSnapshot,
        voucherId,
        spendExternalId,
        correlationId: input.correlationId ?? null,
        claimScope: 'partner',
        scopeRef: null,
      });
      await upsertEconomyRecoveryMarker(db, {
        voucherId,
        offerId: offer.id,
        actorUserId: principal.userId,
        claimScope: 'partner',
        scopeRef: null,
        spendExternalId,
        compensationExternalId,
        correlationId: input.correlationId ?? null,
        state: compensation.ok ? 'resolved' : 'pending',
        lastError: compensation.ok ? null : compensation.message,
      });
      if (!compensation.ok) {
        return {
          ok: false,
          code: 'RF_ECONOMY_RECOVERY_PENDING',
          message: 'Voucher claim economy recovery is pending manual reconciliation',
          status: 503,
        };
      }
    }
    voucherRow = repeatPolicy === 'once_per_scope'
      ? await getLatestRedeemedVoucherByOfferAndUser(db, offer.id, principal.userId)
      : await getClaimBarrierVoucherByOfferAndUser(db, offer.id, principal.userId, repeatPolicy);
    if (!voucherRow) {
      return { ok: false, code: 'RF_VOUCHER_CLAIM_FAILED', message: 'Unable to claim voucher', status: 409 };
    }
  }

  const idempotency = await insertClaimIdempotency(db, {
    actorUserId: principal.userId,
    idempotencyKey: input.idempotencyKey,
    voucherId: voucherRow.id,
  });
  if (!idempotency) {
    if (spendEnabled && spendExternalId && input.economy) {
      compensationExternalId = compensationExternalId ?? buildCompensationExternalId(voucherId);
      const compensation = await input.economy.compensatePoints({
        userId: principal.userId,
        amount: pointsCostSnapshot,
        voucherId,
        spendExternalId,
        correlationId: input.correlationId ?? null,
        claimScope: 'partner',
        scopeRef: null,
      });
      await upsertEconomyRecoveryMarker(db, {
        voucherId,
        offerId: offer.id,
        actorUserId: principal.userId,
        claimScope: 'partner',
        scopeRef: null,
        spendExternalId,
        compensationExternalId,
        correlationId: input.correlationId ?? null,
        state: compensation.ok ? 'resolved' : 'pending',
        lastError: compensation.ok ? null : compensation.message,
      });
      if (!compensation.ok) {
        return {
          ok: false,
          code: 'RF_ECONOMY_RECOVERY_PENDING',
          message: 'Voucher claim economy recovery is pending manual reconciliation',
          status: 503,
        };
      }
    }
    return { ok: false, code: 'RF_CLAIM_IDEMPOTENCY_FAILED', message: 'Unable to persist idempotency key', status: 500 };
  }
  if (idempotency.voucher_id !== voucherRow.id) {
    const stableReplay = await getVoucherFromClaimIdempotency(db, principal.userId, input.idempotencyKey);
    const stableReplayScope = stableReplay?.claim_scope ?? 'partner';
    if (stableReplay && stableReplay.offer_id === input.offerId && stableReplayScope === 'partner') {
      return {
        ok: true,
        voucher: toVoucher(stableReplay),
        idempotentReplay: true,
        createdNewInstance: false,
        claimBlockReason: null,
        repeatPolicy,
      };
    }
    return {
      ok: false,
      code: 'RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH',
      message: 'Idempotency-Key was already used for a different voucher claim context',
      status: 409,
    };
  }

  return {
    ok: true,
    voucher: toVoucher(voucherRow),
    idempotentReplay: false,
    createdNewInstance: true,
    claimBlockReason: null,
    repeatPolicy,
  };
}

function isListingClaimVoucher(row: VoucherRow, listingId: string, offerId: string): boolean {
  return row.offer_id === offerId && row.claim_scope === 'listing' && row.rielt_listing_id === listingId;
}

export async function claimVoucherForListing(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: {
    listingId: string;
    offerId: string;
    idempotencyKey: string;
    attribution?: RfClaimAttributionInput | null;
    correlationId?: string | null;
    economy?: RfClaimEconomyRuntime | null;
  }
): Promise<ClaimResult> {
  const replayVoucher = await getVoucherFromClaimIdempotency(db, principal.userId, input.idempotencyKey);
  if (replayVoucher) {
    if (!isListingClaimVoucher(replayVoucher, input.listingId, input.offerId)) {
      return {
        ok: false,
        code: 'RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH',
        message: 'Idempotency-Key was already used for a different voucher claim context',
        status: 409,
      };
    }
    return {
      ok: true,
      voucher: toVoucher(replayVoucher),
      idempotentReplay: true,
      createdNewInstance: false,
      claimBlockReason: null,
      repeatPolicy: getVoucherRepeatPolicySnapshot(replayVoucher),
    };
  }

  const context = await getListingClaimContext(db, input.listingId, input.offerId);
  if (!context) {
    return {
      ok: false,
      code: 'RF_RIELT_LISTING_OFFER_NOT_FOUND',
      message: 'RF offer is not active for this Rielt listing',
      status: 404,
    };
  }
  if (context.offer_status !== 'active') {
    return { ok: false, code: 'RF_OFFER_INACTIVE', message: 'RF offer is not active', status: 409 };
  }
  if (context.offer_visibility !== 'public') {
    return { ok: false, code: 'RF_OFFER_NOT_CLAIMABLE', message: 'RF offer is not publicly claimable', status: 409 };
  }
  if (context.partner_status !== 'active') {
    return { ok: false, code: 'RF_PARTNER_INACTIVE', message: 'RF partner is not active', status: 409 };
  }
  if (context.offer_partner_id !== context.mapping_partner_id) {
    return {
      ok: false,
      code: 'RF_RIELT_LISTING_OFFER_RELATION_INVALID',
      message: 'RF listing offer mapping relation is invalid',
      status: 409,
    };
  }
  if (context.listing_rf_partner_id !== null && context.listing_rf_partner_id !== context.mapping_partner_id) {
    return {
      ok: false,
      code: 'RF_RIELT_LISTING_PARTNER_MISMATCH',
      message: 'Rielt listing RF partner does not match the mapped RF offer partner',
      status: 409,
    };
  }

  const repeatPolicy = context.offer_repeat_policy ?? 'once_per_scope';
  const barrierListingVoucher = await getClaimBarrierVoucherByListingOfferAndUser(
    db,
    input.listingId,
    input.offerId,
    principal.userId,
    repeatPolicy
  );
  if (barrierListingVoucher) {
    const idempotency = await insertClaimIdempotency(db, {
      actorUserId: principal.userId,
      idempotencyKey: input.idempotencyKey,
      voucherId: barrierListingVoucher.id,
    });
    if (!idempotency) {
      return { ok: false, code: 'RF_CLAIM_IDEMPOTENCY_FAILED', message: 'Unable to persist idempotency key', status: 500 };
    }
    const claimBlockReason = getCanonicalStatus(barrierListingVoucher) === 'redeemed' ? 'once_per_scope_consumed' : 'existing_active_voucher';
    return {
      ok: true,
      voucher: toVoucher(barrierListingVoucher),
      idempotentReplay: false,
      createdNewInstance: false,
      claimBlockReason,
      repeatPolicy,
    };
  }

  const attribution = await resolveClaimAttribution(db, context.mapping_partner_id, input.attribution);
  const issueSequence =
    repeatPolicy === 'repeat_after_redeem'
      ? await getNextIssueSequenceForScope(db, {
          offerId: input.offerId,
          userId: principal.userId,
          claimScope: 'listing',
          listingId: input.listingId,
        })
      : 1;
  const pointsCost = Number(context.offer_points_cost ?? 0);
  const pointsCostSnapshot = Number.isFinite(pointsCost) && pointsCost > 0 ? pointsCost : 0;
  const spendEnabled = pointsCostSnapshot > 0 && input.economy?.enabled === true;
  if (pointsCostSnapshot > 0 && spendEnabled && !isVipSpacerPrincipal(principal)) {
    return {
      ok: false,
      code: 'RF_VIP_REQUIRED_FOR_PAID_VOUCHER',
      message: 'VIP role is required for paid voucher claims',
      status: 409,
    };
  }
  const economyStatus: RfVoucherEconomyStatus = spendEnabled
    ? 'debited'
    : pointsCostSnapshot > 0
      ? 'pending'
      : 'not_required';

  const voucherId = await buildDeterministicVoucherId({
    actorUserId: principal.userId,
    offerId: input.offerId,
    idempotencyKey: input.idempotencyKey,
    claimScope: 'listing',
    listingId: input.listingId,
  });
  const voucherCode = toVoucherCode(voucherId);
  const scopeRef = input.listingId;
  const spendExternalId = spendEnabled ? buildSpendExternalId(voucherId) : null;
  let compensationExternalId: string | null = null;

  if (spendEnabled && spendExternalId && input.economy) {
    const spendResult = await input.economy.spendPoints({
      userId: principal.userId,
      amount: pointsCostSnapshot,
      voucherId,
      correlationId: input.correlationId ?? null,
      claimScope: 'listing',
      scopeRef,
    });
    if (!spendResult.ok) {
      return {
        ok: false,
        code: spendResult.code,
        message: spendResult.message,
        status: spendResult.status,
      };
    }
  }

  const insertResult = await db.execute(sql`
    INSERT INTO rf_voucher (
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      contract_version,
      repeat_policy_snapshot,
      issue_sequence,
      points_cost_snapshot,
      points_debit_external_id,
      economy_status,
      expires_at,
      cancelled_at,
      status_changed_at,
      status_reason,
      status_actor_user_id,
      claim_scope,
      rielt_listing_id,
      rielt_listing_title_snapshot,
      code,
      claimed_at,
      redeemed_at,
      attribution_version,
      attribution_strategy,
      attribution_status,
      attribution_source,
      claim_source,
      attribution_share_code,
      pro_attributed_user_id,
      pro_link_id,
      attribution_captured_at,
      attribution_confirmed_at,
      attribution_metadata,
      created_at,
      updated_at
    )
    VALUES (
      ${voucherId},
      ${input.offerId},
      ${context.mapping_partner_id},
      ${principal.userId},
      'claimed',
      'available',
      1,
      ${repeatPolicy},
      ${issueSequence},
      ${pointsCostSnapshot},
      ${spendExternalId},
      ${economyStatus},
      NULL,
      NULL,
      now(),
      NULL,
      ${principal.userId},
      'listing',
      ${input.listingId},
      ${context.listing_title},
      ${voucherCode},
      now(),
      NULL,
      ${attribution.version},
      ${attribution.strategy},
      ${attribution.status},
      ${attribution.source},
      ${attribution.claimSource},
      ${attribution.shareCode},
      ${attribution.proUserId},
      ${attribution.proLinkId},
      ${attribution.capturedAt},
      ${attribution.confirmedAt},
      ${JSON.stringify(attribution.metadata)}::jsonb,
      now(),
      now()
    )
    ON CONFLICT (rielt_listing_id, offer_id, issued_to_user_id) WHERE claim_scope = 'listing' AND (canonical_status IN ('available', 'locked', 'unlocked') OR (canonical_status = 'redeemed' AND repeat_policy_snapshot = 'once_per_scope'))
    DO NOTHING
    RETURNING
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      contract_version,
      repeat_policy_snapshot,
      issue_sequence,
      points_cost_snapshot,
      points_debit_external_id,
      economy_status,
      expires_at,
      cancelled_at,
      status_changed_at,
      status_reason,
      status_actor_user_id,
      attribution_version,
      attribution_strategy,
      attribution_status,
      attribution_source,
      claim_source,
      attribution_share_code,
      pro_attributed_user_id,
      pro_link_id,
      attribution_captured_at,
      attribution_confirmed_at,
      attribution_metadata,
      claim_scope,
      rielt_listing_id,
      rielt_listing_title_snapshot,
      code,
      claimed_at,
      redeemed_at,
      created_at,
      updated_at
  `);
  let voucherRow: VoucherRow | null = rowsOf<VoucherRow>(insertResult)[0] ?? null;

  if (!voucherRow) {
    if (spendEnabled && spendExternalId && input.economy) {
      compensationExternalId = buildCompensationExternalId(voucherId);
      const compensation = await input.economy.compensatePoints({
        userId: principal.userId,
        amount: pointsCostSnapshot,
        voucherId,
        spendExternalId,
        correlationId: input.correlationId ?? null,
        claimScope: 'listing',
        scopeRef,
      });
      await upsertEconomyRecoveryMarker(db, {
        voucherId,
        offerId: input.offerId,
        actorUserId: principal.userId,
        claimScope: 'listing',
        scopeRef,
        spendExternalId,
        compensationExternalId,
        correlationId: input.correlationId ?? null,
        state: compensation.ok ? 'resolved' : 'pending',
        lastError: compensation.ok ? null : compensation.message,
      });
      if (!compensation.ok) {
        return {
          ok: false,
          code: 'RF_ECONOMY_RECOVERY_PENDING',
          message: 'Voucher claim economy recovery is pending manual reconciliation',
          status: 503,
        };
      }
    }
    voucherRow = repeatPolicy === 'once_per_scope'
      ? await getLatestRedeemedVoucherByListingOfferAndUser(db, input.listingId, input.offerId, principal.userId)
      : await getClaimBarrierVoucherByListingOfferAndUser(db, input.listingId, input.offerId, principal.userId, repeatPolicy);
    if (!voucherRow) {
      return { ok: false, code: 'RF_VOUCHER_CLAIM_FAILED', message: 'Unable to claim listing voucher', status: 409 };
    }
  }

  const idempotency = await insertClaimIdempotency(db, {
    actorUserId: principal.userId,
    idempotencyKey: input.idempotencyKey,
    voucherId: voucherRow.id,
  });
  if (!idempotency) {
    if (spendEnabled && spendExternalId && input.economy) {
      compensationExternalId = compensationExternalId ?? buildCompensationExternalId(voucherId);
      const compensation = await input.economy.compensatePoints({
        userId: principal.userId,
        amount: pointsCostSnapshot,
        voucherId,
        spendExternalId,
        correlationId: input.correlationId ?? null,
        claimScope: 'listing',
        scopeRef,
      });
      await upsertEconomyRecoveryMarker(db, {
        voucherId,
        offerId: input.offerId,
        actorUserId: principal.userId,
        claimScope: 'listing',
        scopeRef,
        spendExternalId,
        compensationExternalId,
        correlationId: input.correlationId ?? null,
        state: compensation.ok ? 'resolved' : 'pending',
        lastError: compensation.ok ? null : compensation.message,
      });
      if (!compensation.ok) {
        return {
          ok: false,
          code: 'RF_ECONOMY_RECOVERY_PENDING',
          message: 'Voucher claim economy recovery is pending manual reconciliation',
          status: 503,
        };
      }
    }
    return { ok: false, code: 'RF_CLAIM_IDEMPOTENCY_FAILED', message: 'Unable to persist idempotency key', status: 500 };
  }
  if (idempotency.voucher_id !== voucherRow.id) {
    const stableReplay = await getVoucherFromClaimIdempotency(db, principal.userId, input.idempotencyKey);
    if (stableReplay && isListingClaimVoucher(stableReplay, input.listingId, input.offerId)) {
      return {
        ok: true,
        voucher: toVoucher(stableReplay),
        idempotentReplay: true,
        createdNewInstance: false,
        claimBlockReason: null,
        repeatPolicy,
      };
    }
    return {
      ok: false,
      code: 'RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH',
      message: 'Idempotency-Key was already used for a different voucher claim context',
      status: 409,
    };
  }

  return {
    ok: true,
    voucher: toVoucher(voucherRow),
    idempotentReplay: false,
    createdNewInstance: true,
    claimBlockReason: null,
    repeatPolicy,
  };
}

export async function listMyVouchers(db: DbExecutor, principal: GatewayPrincipal): Promise<Voucher[]> {
  const result = await db.execute(sql`
    SELECT
      v.id,
      v.offer_id,
      v.partner_id,
      v.issued_to_user_id,
      v.status,
      v.canonical_status,
      v.contract_version,
      v.repeat_policy_snapshot,
      v.issue_sequence,
      v.points_cost_snapshot,
      v.points_debit_external_id,
      v.economy_status,
      v.expires_at,
      v.cancelled_at,
      v.status_changed_at,
      v.status_reason,
      v.status_actor_user_id,
      v.attribution_version,
      v.attribution_strategy,
      v.attribution_status,
      v.attribution_source,
      v.claim_source,
      v.attribution_share_code,
      v.pro_attributed_user_id,
      v.pro_link_id,
      v.attribution_captured_at,
      v.attribution_confirmed_at,
      v.attribution_metadata,
      v.claim_scope,
      v.rielt_listing_id,
      v.rielt_listing_title_snapshot,
      v.code,
      v.claimed_at,
      v.redeemed_at,
      v.created_at,
      v.updated_at,
      o.id AS wallet_offer_id,
      o.title AS wallet_offer_title,
      o.offer_type AS wallet_offer_type,
      m.offer_kind AS wallet_offer_kind,
      m.applicability_note AS wallet_offer_terms,
      p.id AS wallet_partner_id,
      p.display_name AS wallet_partner_display_name,
      p.city_id AS wallet_partner_city_id,
      p.country_id AS wallet_partner_country_id
    FROM rf_voucher v
    LEFT JOIN rf_offer o ON o.id = v.offer_id
    LEFT JOIN rf_partner p ON p.id = v.partner_id
    LEFT JOIN rielt_listing_rf_offer m
      ON v.claim_scope = 'listing'
      AND m.listing_id = v.rielt_listing_id
      AND m.rf_offer_id = v.offer_id
    WHERE v.issued_to_user_id = ${principal.userId}
    ORDER BY v.created_at DESC, v.id DESC
  `);
  return rowsOf<VoucherRow>(result).map((row) => toVoucher(row, { includeWalletEnrichment: true }));
}

export async function listProAttributedVouchers(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: RfProAttributedVouchersFilters = {}
): Promise<RfProAttributedVouchersList> {
  const limit = clampProAttributedVouchersLimit(input.limit);
  const cursor = parseProAttributedVouchersCursor(input.cursor);
  const status = input.status ?? null;
  const partnerId = input.partnerId ?? null;
  const claimScope = input.claimScope ?? null;
  const cursorClaimedAt = cursor?.claimedAt ?? null;
  const cursorVoucherId = cursor?.voucherId ?? null;

  const result = await db.execute(sql`
    SELECT
      v.id,
      v.offer_id,
      v.partner_id,
      v.status,
      v.canonical_status,
      v.claim_scope,
      v.rielt_listing_id,
      v.rielt_listing_title_snapshot,
      v.attribution_status,
      v.attribution_source,
      v.claim_source,
      v.attribution_confirmed_at,
      v.claimed_at,
      v.redeemed_at,
      o.title AS offer_title,
      p.display_name AS partner_display_name
    FROM rf_voucher v
    INNER JOIN rf_offer o ON o.id = v.offer_id
    INNER JOIN rf_partner p ON p.id = v.partner_id
    WHERE v.pro_attributed_user_id = ${principal.userId}
      AND v.attribution_status = 'confirmed'
      AND (${status}::text IS NULL OR v.status = ${status})
      AND (${partnerId}::text IS NULL OR v.partner_id = ${partnerId})
      AND (${claimScope}::text IS NULL OR v.claim_scope = ${claimScope})
      AND (
        ${cursorClaimedAt}::timestamptz IS NULL
        OR v.claimed_at < ${cursorClaimedAt}::timestamptz
        OR (v.claimed_at = ${cursorClaimedAt}::timestamptz AND v.id < ${cursorVoucherId})
      )
    ORDER BY v.claimed_at DESC, v.id DESC
    LIMIT ${limit + 1}
  `);
  const rows = rowsOf<ProAttributedVoucherRow>(result);
  const items = rows.slice(0, limit).map(toProAttributedVoucher);
  return {
    items,
    nextCursor: rows.length > limit && items.length > 0 ? encodeProAttributedVouchersCursor(items[items.length - 1]!) : null,
  };
}

export async function getMyVoucherSummary(db: DbExecutor, principal: GatewayPrincipal): Promise<VoucherSummary> {
  const result = await db.execute(sql`
    WITH voucher_states AS (
      SELECT
        COALESCE(
          canonical_status::text,
          CASE status::text
            WHEN 'claimed' THEN 'available'
            WHEN 'redeemed' THEN 'redeemed'
            WHEN 'cancelled' THEN 'cancelled'
          END
        ) AS effective_status
      FROM rf_voucher
      WHERE issued_to_user_id = ${principal.userId}
    )
    SELECT
      COUNT(*)::int AS total_vouchers,
      COUNT(*) FILTER (WHERE effective_status IN ('available', 'locked', 'unlocked'))::int AS active_vouchers,
      COUNT(*) FILTER (WHERE effective_status = 'redeemed')::int AS used_vouchers,
      COUNT(*) FILTER (WHERE effective_status = 'cancelled')::int AS cancelled_vouchers,
      COUNT(*) FILTER (WHERE effective_status = 'expired')::int AS expired_vouchers
    FROM voucher_states
  `);
  const row =
    rowsOf<{
      total_vouchers: number;
      active_vouchers: number;
      used_vouchers: number;
      cancelled_vouchers: number;
      expired_vouchers: number;
    }>(result)[0] ?? null;

  return {
    totalVouchers: Number(row?.total_vouchers ?? 0),
    activeVouchers: Number(row?.active_vouchers ?? 0),
    usedVouchers: Number(row?.used_vouchers ?? 0),
    cancelledVouchers: Number(row?.cancelled_vouchers ?? 0),
    expiredVouchers: Number(row?.expired_vouchers ?? 0),
  };
}

export async function redeemVoucher(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: { partnerId: string; voucherId: string; idempotencyKey?: string | null; correlationId?: string | null }
): Promise<RedeemResult> {
  const partner = await getOwnedActivePartner(db, input.partnerId, principal.userId);
  if (!partner) {
    return { ok: false, code: 'RF_PARTNER_NOT_FOUND', message: 'RF partner not found', status: 404 };
  }

  if (input.idempotencyKey) {
    const replayVoucher = await getVoucherFromRedemptionIdempotency(db, principal.userId, input.idempotencyKey);
    if (replayVoucher) {
      if (replayVoucher.id === input.voucherId && replayVoucher.partner_id === input.partnerId) {
        return { ok: true, voucher: toVoucher(replayVoucher), applied: false };
      }
      return {
        ok: false,
        code: 'RF_REDEEM_IDEMPOTENCY_KEY_CONTEXT_MISMATCH',
        message: 'Idempotency-Key was already used for a different voucher redeem context',
        status: 409,
      };
    }
  }

  const voucher = await getVoucherByIdAndPartner(db, input.voucherId, input.partnerId);
  if (!voucher) {
    return { ok: false, code: 'RF_VOUCHER_NOT_FOUND', message: 'RF voucher not found', status: 404 };
  }
  const canonicalStatus = getCanonicalStatus(voucher);
  if (canonicalStatus === 'cancelled') {
    return { ok: false, code: 'RF_VOUCHER_CANCELLED', message: 'RF voucher is cancelled', status: 409 };
  }
  if (canonicalStatus === 'redeemed') {
    return { ok: true, voucher: toVoucher(voucher), applied: false };
  }
  if (canonicalStatus === 'expired') {
    return { ok: false, code: 'RF_VOUCHER_EXPIRED', message: 'RF voucher is expired', status: 409 };
  }
  if (!isRedeemableCanonicalStatus(canonicalStatus)) {
    return { ok: false, code: 'RF_VOUCHER_NOT_CLAIMED', message: 'RF voucher is not claimable', status: 409 };
  }

  const voucherOffer = await getOfferById(db, voucher.offer_id);
  if (!voucherOffer || voucherOffer.partner_id !== voucher.partner_id || voucherOffer.partner_id !== input.partnerId) {
    return {
      ok: false,
      code: 'RF_VOUCHER_RELATION_INVALID',
      message: 'RF voucher offer/partner relation is invalid',
      status: 409,
    };
  }

  const redemptionId = nextId('rf_voucher_redemption');
  const consumptionGuardId = nextId('rf_guard');
  const updateResult = await db.execute(sql`
    WITH updated AS (
      UPDATE rf_voucher
      SET
        status = 'redeemed',
        canonical_status = 'redeemed',
        redeemed_at = now(),
        status_changed_at = now(),
        status_actor_user_id = ${principal.userId},
        updated_at = now()
      WHERE id = ${input.voucherId}
        AND partner_id = ${input.partnerId}
        AND (
          canonical_status IN ('available', 'unlocked')
          OR (canonical_status IS NULL AND status = 'claimed')
        )
      RETURNING
        id,
        offer_id,
        partner_id,
        issued_to_user_id,
        status,
        canonical_status,
        contract_version,
        repeat_policy_snapshot,
        issue_sequence,
        points_cost_snapshot,
        points_debit_external_id,
        economy_status,
        expires_at,
        cancelled_at,
        status_changed_at,
        status_reason,
        status_actor_user_id,
        attribution_version,
        attribution_strategy,
        attribution_status,
        attribution_source,
        claim_source,
        attribution_share_code,
        pro_attributed_user_id,
        pro_link_id,
        attribution_captured_at,
        attribution_confirmed_at,
        attribution_metadata,
        claim_scope,
        rielt_listing_id,
        rielt_listing_title_snapshot,
        code,
        claimed_at,
        redeemed_at,
        created_at,
        updated_at
    ),
    redemption AS (
      INSERT INTO rf_voucher_redemption (
        id,
        voucher_id,
        user_id,
        partner_id,
        context_type,
        context_ref,
        result_status,
        idempotency_key,
        actor_user_id,
        redeemed_at,
        metadata,
        correlation_id,
        created_at,
        updated_at
      )
      SELECT
        ${redemptionId},
        id,
        issued_to_user_id,
        partner_id,
        'manual',
        NULL,
        'succeeded',
        ${input.idempotencyKey ?? null},
        ${principal.userId},
        redeemed_at,
        '{}'::jsonb,
        ${input.correlationId ?? null},
        now(),
        now()
      FROM updated
      ON CONFLICT (voucher_id) WHERE result_status = 'succeeded'
      DO NOTHING
      RETURNING id
    ),
    consumption_guard AS (
      INSERT INTO rf_voucher_scope_consumption_guard (
        id,
        offer_id,
        issued_to_user_id,
        claim_scope,
        scope_ref,
        consumed_voucher_id,
        repeat_policy_snapshot,
        consumed_at,
        created_at,
        updated_at
      )
      SELECT
        ${consumptionGuardId},
        offer_id,
        issued_to_user_id,
        COALESCE(claim_scope, 'partner'),
        CASE WHEN COALESCE(claim_scope, 'partner') = 'partner' THEN '__partner__' ELSE rielt_listing_id END,
        id,
        COALESCE(repeat_policy_snapshot, 'once_per_scope'),
        COALESCE(redeemed_at, status_changed_at, updated_at, now()),
        now(),
        now()
      FROM updated
      WHERE COALESCE(repeat_policy_snapshot, 'once_per_scope') = 'once_per_scope'
        AND (
          COALESCE(claim_scope, 'partner') = 'partner'
          OR rielt_listing_id IS NOT NULL
        )
      ON CONFLICT (offer_id, issued_to_user_id, claim_scope, scope_ref)
      DO NOTHING
      RETURNING id
    )
    SELECT
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      contract_version,
      repeat_policy_snapshot,
      issue_sequence,
      points_cost_snapshot,
      points_debit_external_id,
      economy_status,
      expires_at,
      cancelled_at,
      status_changed_at,
      status_reason,
      status_actor_user_id,
      attribution_version,
      attribution_strategy,
      attribution_status,
      attribution_source,
      claim_source,
      attribution_share_code,
      pro_attributed_user_id,
      pro_link_id,
      attribution_captured_at,
      attribution_confirmed_at,
      attribution_metadata,
      claim_scope,
      rielt_listing_id,
      rielt_listing_title_snapshot,
      code,
      claimed_at,
      redeemed_at,
      created_at,
      updated_at
    FROM updated
  `);
  const updated = rowsOf<VoucherRow>(updateResult)[0];
  if (updated) return { ok: true, voucher: toVoucher(updated), applied: true };

  const latest = await getVoucherByIdAndPartner(db, input.voucherId, input.partnerId);
  if (!latest) {
    return { ok: false, code: 'RF_VOUCHER_NOT_FOUND', message: 'RF voucher not found', status: 404 };
  }
  const latestCanonicalStatus = getCanonicalStatus(latest);
  if (latestCanonicalStatus === 'redeemed') return { ok: true, voucher: toVoucher(latest), applied: false };
  if (latestCanonicalStatus === 'cancelled') {
    return { ok: false, code: 'RF_VOUCHER_CANCELLED', message: 'RF voucher is cancelled', status: 409 };
  }
  if (latestCanonicalStatus === 'expired') {
    return { ok: false, code: 'RF_VOUCHER_EXPIRED', message: 'RF voucher is expired', status: 409 };
  }
  return { ok: false, code: 'RF_VOUCHER_NOT_CLAIMED', message: 'RF voucher is not claimable', status: 409 };
}

export async function listProLinks(db: DbExecutor, principal: GatewayPrincipal): Promise<ProLink[]> {
  const result = await db.execute(sql`
    SELECT id, partner_id, pro_user_id, share_code, status, role_scope, created_at, updated_at
    FROM rf_pro_link
    WHERE pro_user_id = ${principal.userId}
    ORDER BY created_at DESC, id DESC
  `);
  return rowsOf<ProLinkRow>(result).map(toProLink);
}

export async function listPartnerProLinks(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: { partnerId: string }
): Promise<PartnerProLinksResult> {
  const partnerResult = await db.execute(sql`
    SELECT id, owner_user_id, status
    FROM rf_partner
    WHERE id = ${input.partnerId}
    LIMIT 1
  `);
  const partner = rowsOf<Pick<PartnerRow, 'id' | 'owner_user_id' | 'status'>>(partnerResult)[0];
  if (!partner || partner.status !== 'active') {
    return { ok: false, code: 'RF_PARTNER_NOT_FOUND', message: 'RF partner not found', status: 404 };
  }
  if (partner.owner_user_id !== principal.userId) {
    return { ok: false, code: 'RF_PARTNER_FORBIDDEN', message: 'Only partner owner can list PRO links', status: 403 };
  }

  const result = await db.execute(sql`
    SELECT id, partner_id, pro_user_id, share_code, status, role_scope, created_at, updated_at
    FROM rf_pro_link
    WHERE partner_id = ${input.partnerId}
    ORDER BY
      CASE status
        WHEN 'pending' THEN 0
        WHEN 'active' THEN 1
        WHEN 'ended' THEN 2
        ELSE 3
      END ASC,
      created_at DESC,
      id DESC
  `);
  return { ok: true, items: rowsOf<ProLinkRow>(result).map(toProLink) };
}

export async function createProLink(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: { partnerId: string; roleScope: ProLink['roleScope'] }
): Promise<ProLink | { error: string; status: number }> {
  const partnerResult = await db.execute(sql`
    SELECT id
    FROM rf_partner
    WHERE id = ${input.partnerId}
      AND status = 'active'
    LIMIT 1
  `);
  if (!rowsOf<{ id: string }>(partnerResult)[0]) return { error: 'Partner not found', status: 404 };

  const insertResult = await db.execute(sql`
    INSERT INTO rf_pro_link (
      id,
      partner_id,
      pro_user_id,
      share_code,
      status,
      role_scope,
      created_at,
      updated_at
    )
    VALUES (
      ${nextId('rf_pro_link')},
      ${input.partnerId},
      ${principal.userId},
      ${toShareCode()},
      'pending',
      ${input.roleScope},
      now(),
      now()
    )
    ON CONFLICT DO NOTHING
    RETURNING id, partner_id, pro_user_id, share_code, status, role_scope, created_at, updated_at
  `);
  const inserted = rowsOf<ProLinkRow>(insertResult)[0];
  if (inserted) return toProLink(inserted);

  const existingResult = await db.execute(sql`
    SELECT id, partner_id, pro_user_id, share_code, status, role_scope, created_at, updated_at
    FROM rf_pro_link
    WHERE partner_id = ${input.partnerId}
      AND pro_user_id = ${principal.userId}
      AND status <> 'ended'
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `);
  const existing = rowsOf<ProLinkRow>(existingResult)[0];
  if (!existing) throw new Error('Failed to persist RF PRO link');
  return toProLink(existing);
}

export async function acceptProLink(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: { proLinkId: string }
): Promise<ProLinkAcceptResult> {
  const result = await db.execute(sql`
    SELECT p.id, p.partner_id, p.pro_user_id, p.share_code, p.status, p.role_scope, p.created_at, p.updated_at, rp.owner_user_id
    FROM rf_pro_link p
    INNER JOIN rf_partner rp ON rp.id = p.partner_id
    WHERE p.id = ${input.proLinkId}
    LIMIT 1
  `);
  const row = rowsOf<(ProLinkRow & { owner_user_id: string })>(result)[0];
  if (!row) return { ok: false, code: 'RF_PRO_LINK_NOT_FOUND', message: 'RF PRO link not found', status: 404 };

  if (row.owner_user_id !== principal.userId) {
    return { ok: false, code: 'RF_PARTNER_FORBIDDEN', message: 'Only partner owner can accept link', status: 403 };
  }
  if (row.status === 'active') return { ok: true, proLink: toProLink(row), applied: false };
  if (row.status === 'ended') {
    return { ok: false, code: 'RF_PRO_LINK_ENDED', message: 'Cannot accept ended link', status: 409 };
  }

  const updatedResult = await db.execute(sql`
    UPDATE rf_pro_link
    SET
      status = 'active',
      updated_at = now()
    WHERE id = ${input.proLinkId}
      AND status = 'pending'
    RETURNING id, partner_id, pro_user_id, share_code, status, role_scope, created_at, updated_at
  `);
  const updated = rowsOf<ProLinkRow>(updatedResult)[0];
  if (updated) return { ok: true, proLink: toProLink(updated), applied: true };

  const latestResult = await db.execute(sql`
    SELECT id, partner_id, pro_user_id, share_code, status, role_scope, created_at, updated_at
    FROM rf_pro_link
    WHERE id = ${input.proLinkId}
    LIMIT 1
  `);
  const latest = rowsOf<ProLinkRow>(latestResult)[0];
  if (!latest) return { ok: false, code: 'RF_PRO_LINK_NOT_FOUND', message: 'RF PRO link not found', status: 404 };
  if (latest.status === 'active') return { ok: true, proLink: toProLink(latest), applied: false };
  if (latest.status === 'ended') {
    return { ok: false, code: 'RF_PRO_LINK_ENDED', message: 'Cannot accept ended link', status: 409 };
  }
  return { ok: false, code: 'RF_PRO_LINK_CONFLICT', message: 'Cannot accept link in current state', status: 409 };
}

export async function rejectProLink(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: { proLinkId: string }
): Promise<ProLinkLifecycleResult> {
  const result = await db.execute(sql`
    SELECT p.id, p.partner_id, p.pro_user_id, p.share_code, p.status, p.role_scope, p.created_at, p.updated_at, rp.owner_user_id
    FROM rf_pro_link p
    INNER JOIN rf_partner rp ON rp.id = p.partner_id
    WHERE p.id = ${input.proLinkId}
    LIMIT 1
  `);
  const row = rowsOf<(ProLinkRow & { owner_user_id: string })>(result)[0];
  if (!row) return { ok: false, code: 'RF_PRO_LINK_NOT_FOUND', message: 'RF PRO link not found', status: 404 };

  if (row.owner_user_id !== principal.userId) {
    return { ok: false, code: 'RF_PARTNER_FORBIDDEN', message: 'Only partner owner can reject link', status: 403 };
  }
  if (row.status === 'ended') return { ok: true, proLink: toProLink(row), applied: false };
  if (row.status === 'active') {
    return { ok: false, code: 'RF_PRO_LINK_CONFLICT', message: 'Cannot reject active link; end it instead', status: 409 };
  }

  const updatedResult = await db.execute(sql`
    UPDATE rf_pro_link
    SET
      status = 'ended',
      updated_at = now()
    WHERE id = ${input.proLinkId}
      AND status = 'pending'
    RETURNING id, partner_id, pro_user_id, share_code, status, role_scope, created_at, updated_at
  `);
  const updated = rowsOf<ProLinkRow>(updatedResult)[0];
  if (updated) return { ok: true, proLink: toProLink(updated), applied: true };

  const latestResult = await db.execute(sql`
    SELECT id, partner_id, pro_user_id, share_code, status, role_scope, created_at, updated_at
    FROM rf_pro_link
    WHERE id = ${input.proLinkId}
    LIMIT 1
  `);
  const latest = rowsOf<ProLinkRow>(latestResult)[0];
  if (!latest) return { ok: false, code: 'RF_PRO_LINK_NOT_FOUND', message: 'RF PRO link not found', status: 404 };
  if (latest.status === 'ended') return { ok: true, proLink: toProLink(latest), applied: false };
  return { ok: false, code: 'RF_PRO_LINK_CONFLICT', message: 'Cannot reject link in current state', status: 409 };
}

export async function endProLink(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: { proLinkId: string }
): Promise<ProLinkLifecycleResult> {
  const result = await db.execute(sql`
    SELECT p.id, p.partner_id, p.pro_user_id, p.share_code, p.status, p.role_scope, p.created_at, p.updated_at, rp.owner_user_id
    FROM rf_pro_link p
    INNER JOIN rf_partner rp ON rp.id = p.partner_id
    WHERE p.id = ${input.proLinkId}
    LIMIT 1
  `);
  const row = rowsOf<(ProLinkRow & { owner_user_id: string })>(result)[0];
  if (!row) return { ok: false, code: 'RF_PRO_LINK_NOT_FOUND', message: 'RF PRO link not found', status: 404 };

  if (row.owner_user_id !== principal.userId) {
    return { ok: false, code: 'RF_PARTNER_FORBIDDEN', message: 'Only partner owner can end link', status: 403 };
  }
  if (row.status === 'ended') return { ok: true, proLink: toProLink(row), applied: false };
  if (row.status === 'pending') {
    return { ok: false, code: 'RF_PRO_LINK_CONFLICT', message: 'Cannot end pending link; reject it instead', status: 409 };
  }

  const updatedResult = await db.execute(sql`
    UPDATE rf_pro_link
    SET
      status = 'ended',
      updated_at = now()
    WHERE id = ${input.proLinkId}
      AND status = 'active'
    RETURNING id, partner_id, pro_user_id, share_code, status, role_scope, created_at, updated_at
  `);
  const updated = rowsOf<ProLinkRow>(updatedResult)[0];
  if (updated) return { ok: true, proLink: toProLink(updated), applied: true };

  const latestResult = await db.execute(sql`
    SELECT id, partner_id, pro_user_id, share_code, status, role_scope, created_at, updated_at
    FROM rf_pro_link
    WHERE id = ${input.proLinkId}
    LIMIT 1
  `);
  const latest = rowsOf<ProLinkRow>(latestResult)[0];
  if (!latest) return { ok: false, code: 'RF_PRO_LINK_NOT_FOUND', message: 'RF PRO link not found', status: 404 };
  if (latest.status === 'ended') return { ok: true, proLink: toProLink(latest), applied: false };
  return { ok: false, code: 'RF_PRO_LINK_CONFLICT', message: 'Cannot end link in current state', status: 409 };
}

export function resetRfStoreForTests(): void {
  writeTimestampsByActorAndOp.clear();
}
