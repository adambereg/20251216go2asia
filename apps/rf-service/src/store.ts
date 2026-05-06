import type { Db } from '@go2asia/db';
import { sql } from '@go2asia/db';

import type { GatewayPrincipal } from './middleware/auth';

type DbExecutor = Pick<Db, 'execute'>;

export type PartnerStatus = 'active' | 'archived';
export type OfferStatus = 'draft' | 'active' | 'archived';
export type VoucherStatus = 'claimed' | 'redeemed' | 'cancelled';
export type VoucherCanonicalStatus = 'available' | 'locked' | 'unlocked' | 'redeemed' | 'expired' | 'cancelled';
export type VoucherClaimScope = 'partner' | 'listing';
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
  title: string;
  offerType: 'discount' | 'bundle' | 'gift' | 'access' | 'campaign' | 'event_related';
  visibility: 'public' | 'pro_only' | 'invite_only';
  status: OfferStatus;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
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
}

export interface VoucherSummary {
  totalVouchers: number;
  activeVouchers: number;
  usedVouchers: number;
  cancelledVouchers: number;
}

export interface ProLink {
  id: string;
  partnerId: string;
  proUserId: string;
  status: ProLinkStatus;
  roleScope: 'onboarding' | 'curation' | 'promotion' | 'moderation_support' | 'account_support';
  createdAt: string;
  updatedAt: string;
}

type ClaimResult =
  | { ok: true; voucher: Voucher; idempotentReplay: boolean }
  | { ok: false; code: string; message: string; status: number };
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
  title: string;
  offer_type: Offer['offerType'];
  visibility: Offer['visibility'];
  status: OfferStatus;
  created_by_user_id: string;
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
  expires_at?: string | Date | null;
  cancelled_at?: string | Date | null;
  status_changed_at?: string | Date | null;
  status_reason?: string | null;
  status_actor_user_id?: string | null;
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

type ListingClaimContextRow = {
  listing_id: string;
  listing_title: string;
  listing_rf_partner_id: string | null;
  mapping_partner_id: string;
  offer_id: string;
  offer_partner_id: string;
  offer_status: OfferStatus;
  offer_visibility: Offer['visibility'];
  partner_status: PartnerStatus;
};

type ProLinkRow = {
  id: string;
  partner_id: string;
  pro_user_id: string;
  status: ProLinkStatus;
  role_scope: ProLink['roleScope'];
  created_at: string | Date;
  updated_at: string | Date;
};

type IdempotencyRow = {
  operation: 'voucher_claim';
  actor_user_id: string;
  idempotency_key: string;
  voucher_id: string;
  created_at: string | Date;
};

const writeTimestampsByActorAndOp = new Map<string, number[]>();

function rowsOf<T>(result: unknown): T[] {
  return ((result as { rows?: T[] } | null)?.rows ?? []) as T[];
}

function asIso(value: string | Date | null): string | null {
  if (!value) return null;
  return new Date(value).toISOString();
}

function getCanonicalStatus(voucher: Pick<VoucherRow, 'status' | 'canonical_status'>): VoucherCanonicalStatus {
  if (voucher.canonical_status) return voucher.canonical_status;
  if (voucher.status === 'claimed') return 'available';
  if (voucher.status === 'redeemed') return 'redeemed';
  return 'cancelled';
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
    title: row.title,
    offerType: row.offer_type,
    visibility: row.visibility,
    status: row.status,
    createdByUserId: row.created_by_user_id,
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
    expiresAt: row.expires_at === undefined ? undefined : asIso(row.expires_at),
    cancelledAt: row.cancelled_at === undefined ? undefined : asIso(row.cancelled_at),
    statusChangedAt: row.status_changed_at === undefined ? undefined : asIso(row.status_changed_at),
    statusReason: row.status_reason ?? undefined,
    statusActorUserId: row.status_actor_user_id ?? undefined,
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

function toProLink(row: ProLinkRow): ProLink {
  return {
    id: row.id,
    partnerId: row.partner_id,
    proUserId: row.pro_user_id,
    status: row.status,
    roleScope: row.role_scope,
    createdAt: asIso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: asIso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

function nextId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
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
    SELECT id, partner_id, title, offer_type, visibility, status, created_by_user_id, created_at, updated_at
    FROM rf_offer
    WHERE id = ${offerId}
    LIMIT 1
  `);
  return rowsOf<OfferRow>(result)[0] ?? null;
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
      created_at,
      updated_at
    FROM rf_voucher
    WHERE id = ${voucherId}
      AND partner_id = ${partnerId}
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
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
      v.expires_at,
      v.cancelled_at,
      v.status_changed_at,
      v.status_reason,
      v.status_actor_user_id,
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
      v.expires_at,
      v.cancelled_at,
      v.status_changed_at,
      v.status_reason,
      v.status_actor_user_id,
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

async function getClaimableVoucherByOfferAndUser(db: DbExecutor, offerId: string, userId: string): Promise<VoucherRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      claim_scope,
      rielt_listing_id,
      rielt_listing_title_snapshot,
      code,
      claimed_at,
      redeemed_at,
      created_at,
      updated_at
    FROM rf_voucher
    WHERE offer_id = ${offerId}
      AND issued_to_user_id = ${userId}
      AND claim_scope = 'partner'
      AND status IN ('claimed', 'redeemed')
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
}

async function getClaimableVoucherByListingOfferAndUser(
  db: DbExecutor,
  listingId: string,
  offerId: string,
  userId: string
): Promise<VoucherRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      contract_version,
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
      created_at,
      updated_at
    FROM rf_voucher
    WHERE rielt_listing_id = ${listingId}
      AND offer_id = ${offerId}
      AND issued_to_user_id = ${userId}
      AND claim_scope = 'listing'
      AND status IN ('claimed', 'redeemed')
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
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
    SELECT id, partner_id, title, offer_type, visibility, status, created_by_user_id, created_at, updated_at
    FROM rf_offer
    WHERE status = 'active'
      AND visibility = 'public'
    ORDER BY created_at DESC, id DESC
  `);
  return rowsOf<OfferRow>(result).map(toOffer);
}

export async function getPublicOfferById(db: DbExecutor, offerId: string): Promise<Offer | null> {
  const result = await db.execute(sql`
    SELECT id, partner_id, title, offer_type, visibility, status, created_by_user_id, created_at, updated_at
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
      o.title,
      o.offer_type,
      o.visibility,
      o.status,
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

export async function createOffer(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: {
    partnerId: string;
    title: string;
    offerType: Offer['offerType'];
    visibility: Offer['visibility'];
  }
): Promise<Offer | { error: string; status: number }> {
  const partner = await getOwnedActivePartner(db, input.partnerId, principal.userId);
  if (!partner) return { error: 'Partner not found', status: 404 };

  const id = nextId('rf_offer');
  const result = await db.execute(sql`
    INSERT INTO rf_offer (
      id,
      partner_id,
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
      ${input.title},
      ${input.offerType},
      ${input.visibility},
      'draft',
      ${principal.userId},
      now(),
      now()
    )
    RETURNING id, partner_id, title, offer_type, visibility, status, created_by_user_id, created_at, updated_at
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
    RETURNING id, partner_id, title, offer_type, visibility, status, created_by_user_id, created_at, updated_at
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
  input: { offerId: string; idempotencyKey: string }
): Promise<ClaimResult> {
  const replayVoucher = await getVoucherFromClaimIdempotency(db, principal.userId, input.idempotencyKey);
  if (replayVoucher) return { ok: true, voucher: toVoucher(replayVoucher), idempotentReplay: true };

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

  const existing = await getClaimableVoucherByOfferAndUser(db, offer.id, principal.userId);
  if (existing) {
    return { ok: true, voucher: toVoucher(existing), idempotentReplay: false };
  }

  // This legacy endpoint remains partner-scoped. Listing-scoped claims must use
  // a dedicated endpoint that validates listing mapping and claim context.
  const voucherId = nextId('rf_voucher');
  const voucherCode = toVoucherCode(voucherId);
  const insertResult = await db.execute(sql`
    INSERT INTO rf_voucher (
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      claim_scope,
      rielt_listing_id,
      rielt_listing_title_snapshot,
      code,
      claimed_at,
      redeemed_at,
      status_changed_at,
      status_actor_user_id,
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
      'partner',
      NULL,
      NULL,
      ${voucherCode},
      now(),
      NULL,
      now(),
      ${principal.userId},
      now(),
      now()
    )
    ON CONFLICT (offer_id, issued_to_user_id) WHERE claim_scope = 'partner' AND status IN ('claimed', 'redeemed')
    DO NOTHING
    RETURNING
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      contract_version,
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
      created_at,
      updated_at
  `);
  let voucherRow: VoucherRow | null = rowsOf<VoucherRow>(insertResult)[0] ?? null;

  if (!voucherRow) {
    voucherRow = await getClaimableVoucherByOfferAndUser(db, offer.id, principal.userId);
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
    return { ok: false, code: 'RF_CLAIM_IDEMPOTENCY_FAILED', message: 'Unable to persist idempotency key', status: 500 };
  }
  if (idempotency.voucher_id !== voucherRow.id) {
    const stableReplay = await getVoucherFromClaimIdempotency(db, principal.userId, input.idempotencyKey);
    if (stableReplay) return { ok: true, voucher: toVoucher(stableReplay), idempotentReplay: true };
  }

  return { ok: true, voucher: toVoucher(voucherRow), idempotentReplay: false };
}

function isListingClaimVoucher(row: VoucherRow, listingId: string, offerId: string): boolean {
  return row.offer_id === offerId && row.claim_scope === 'listing' && row.rielt_listing_id === listingId;
}

export async function claimVoucherForListing(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: { listingId: string; offerId: string; idempotencyKey: string }
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
    return { ok: true, voucher: toVoucher(replayVoucher), idempotentReplay: true };
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

  const existingListingVoucher = await getClaimableVoucherByListingOfferAndUser(
    db,
    input.listingId,
    input.offerId,
    principal.userId
  );
  if (existingListingVoucher) {
    return { ok: true, voucher: toVoucher(existingListingVoucher), idempotentReplay: false };
  }

  const voucherId = nextId('rf_voucher');
  const voucherCode = toVoucherCode(voucherId);
  const insertResult = await db.execute(sql`
    INSERT INTO rf_voucher (
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      contract_version,
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
      now(),
      now()
    )
    ON CONFLICT (rielt_listing_id, offer_id, issued_to_user_id) WHERE claim_scope = 'listing' AND status IN ('claimed', 'redeemed')
    DO NOTHING
    RETURNING
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      contract_version,
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
      created_at,
      updated_at
  `);
  let voucherRow: VoucherRow | null = rowsOf<VoucherRow>(insertResult)[0] ?? null;

  if (!voucherRow) {
    voucherRow = await getClaimableVoucherByListingOfferAndUser(db, input.listingId, input.offerId, principal.userId);
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
    return { ok: false, code: 'RF_CLAIM_IDEMPOTENCY_FAILED', message: 'Unable to persist idempotency key', status: 500 };
  }
  if (idempotency.voucher_id !== voucherRow.id) {
    const stableReplay = await getVoucherFromClaimIdempotency(db, principal.userId, input.idempotencyKey);
    if (stableReplay && isListingClaimVoucher(stableReplay, input.listingId, input.offerId)) {
      return { ok: true, voucher: toVoucher(stableReplay), idempotentReplay: true };
    }
    return {
      ok: false,
      code: 'RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH',
      message: 'Idempotency-Key was already used for a different voucher claim context',
      status: 409,
    };
  }

  return { ok: true, voucher: toVoucher(voucherRow), idempotentReplay: false };
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
      v.expires_at,
      v.cancelled_at,
      v.status_changed_at,
      v.status_reason,
      v.status_actor_user_id,
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
      COUNT(*) FILTER (WHERE effective_status = 'cancelled')::int AS cancelled_vouchers
    FROM voucher_states
  `);
  const row =
    rowsOf<{
      total_vouchers: number;
      active_vouchers: number;
      used_vouchers: number;
      cancelled_vouchers: number;
    }>(result)[0] ?? null;

  return {
    totalVouchers: Number(row?.total_vouchers ?? 0),
    activeVouchers: Number(row?.active_vouchers ?? 0),
    usedVouchers: Number(row?.used_vouchers ?? 0),
    cancelledVouchers: Number(row?.cancelled_vouchers ?? 0),
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
  if (voucher.status === 'cancelled') {
    return { ok: false, code: 'RF_VOUCHER_CANCELLED', message: 'RF voucher is cancelled', status: 409 };
  }
  if (voucher.status === 'redeemed') {
    return { ok: true, voucher: toVoucher(voucher), applied: false };
  }
  if (voucher.status !== 'claimed') {
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
        AND status = 'claimed'
      RETURNING
        id,
        offer_id,
        partner_id,
        issued_to_user_id,
        status,
        canonical_status,
        contract_version,
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
    )
    SELECT
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      canonical_status,
      contract_version,
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
  if (latest.status === 'redeemed') return { ok: true, voucher: toVoucher(latest), applied: false };
  if (latest.status === 'cancelled') {
    return { ok: false, code: 'RF_VOUCHER_CANCELLED', message: 'RF voucher is cancelled', status: 409 };
  }
  return { ok: false, code: 'RF_VOUCHER_NOT_CLAIMED', message: 'RF voucher is not claimable', status: 409 };
}

export async function listProLinks(db: DbExecutor, principal: GatewayPrincipal): Promise<ProLink[]> {
  const result = await db.execute(sql`
    SELECT id, partner_id, pro_user_id, status, role_scope, created_at, updated_at
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
    SELECT id, partner_id, pro_user_id, status, role_scope, created_at, updated_at
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
      status,
      role_scope,
      created_at,
      updated_at
    )
    VALUES (
      ${nextId('rf_pro_link')},
      ${input.partnerId},
      ${principal.userId},
      'pending',
      ${input.roleScope},
      now(),
      now()
    )
    ON CONFLICT DO NOTHING
    RETURNING id, partner_id, pro_user_id, status, role_scope, created_at, updated_at
  `);
  const inserted = rowsOf<ProLinkRow>(insertResult)[0];
  if (inserted) return toProLink(inserted);

  const existingResult = await db.execute(sql`
    SELECT id, partner_id, pro_user_id, status, role_scope, created_at, updated_at
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
    SELECT p.id, p.partner_id, p.pro_user_id, p.status, p.role_scope, p.created_at, p.updated_at, rp.owner_user_id
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
    RETURNING id, partner_id, pro_user_id, status, role_scope, created_at, updated_at
  `);
  const updated = rowsOf<ProLinkRow>(updatedResult)[0];
  if (updated) return { ok: true, proLink: toProLink(updated), applied: true };

  const latestResult = await db.execute(sql`
    SELECT id, partner_id, pro_user_id, status, role_scope, created_at, updated_at
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
    SELECT p.id, p.partner_id, p.pro_user_id, p.status, p.role_scope, p.created_at, p.updated_at, rp.owner_user_id
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
    RETURNING id, partner_id, pro_user_id, status, role_scope, created_at, updated_at
  `);
  const updated = rowsOf<ProLinkRow>(updatedResult)[0];
  if (updated) return { ok: true, proLink: toProLink(updated), applied: true };

  const latestResult = await db.execute(sql`
    SELECT id, partner_id, pro_user_id, status, role_scope, created_at, updated_at
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
    SELECT p.id, p.partner_id, p.pro_user_id, p.status, p.role_scope, p.created_at, p.updated_at, rp.owner_user_id
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
    RETURNING id, partner_id, pro_user_id, status, role_scope, created_at, updated_at
  `);
  const updated = rowsOf<ProLinkRow>(updatedResult)[0];
  if (updated) return { ok: true, proLink: toProLink(updated), applied: true };

  const latestResult = await db.execute(sql`
    SELECT id, partner_id, pro_user_id, status, role_scope, created_at, updated_at
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
