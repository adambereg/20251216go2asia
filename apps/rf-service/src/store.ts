import type { Db } from '@go2asia/db';
import { sql } from '@go2asia/db';

import type { GatewayPrincipal } from './middleware/auth';

type DbExecutor = Pick<Db, 'execute'>;

export type PartnerStatus = 'active' | 'archived';
export type OfferStatus = 'draft' | 'active' | 'archived';
export type VoucherStatus = 'claimed' | 'redeemed' | 'cancelled';
export type ProLinkStatus = 'pending' | 'active' | 'ended';

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

export interface Voucher {
  id: string;
  offerId: string;
  partnerId: string;
  issuedToUserId: string;
  status: VoucherStatus;
  code: string;
  claimedAt: string;
  redeemedAt: string | null;
  createdAt: string;
  updatedAt: string;
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

type VoucherRow = {
  id: string;
  offer_id: string;
  partner_id: string;
  issued_to_user_id: string;
  status: VoucherStatus;
  code: string;
  claimed_at: string | Date;
  redeemed_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
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

function toVoucher(row: VoucherRow): Voucher {
  return {
    id: row.id,
    offerId: row.offer_id,
    partnerId: row.partner_id,
    issuedToUserId: row.issued_to_user_id,
    status: row.status,
    code: row.code,
    claimedAt: asIso(row.claimed_at) ?? new Date(0).toISOString(),
    redeemedAt: asIso(row.redeemed_at),
    createdAt: asIso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: asIso(row.updated_at) ?? new Date(0).toISOString(),
  };
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
    SELECT id, offer_id, partner_id, issued_to_user_id, status, code, claimed_at, redeemed_at, created_at, updated_at
    FROM rf_voucher
    WHERE id = ${voucherId}
      AND partner_id = ${partnerId}
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
}

async function getVoucherFromClaimIdempotency(db: DbExecutor, actorUserId: string, idempotencyKey: string): Promise<VoucherRow | null> {
  const result = await db.execute(sql`
    SELECT v.id, v.offer_id, v.partner_id, v.issued_to_user_id, v.status, v.code, v.claimed_at, v.redeemed_at, v.created_at, v.updated_at
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
    SELECT id, offer_id, partner_id, issued_to_user_id, status, code, claimed_at, redeemed_at, created_at, updated_at
    FROM rf_voucher
    WHERE offer_id = ${offerId}
      AND issued_to_user_id = ${userId}
      AND status IN ('claimed', 'redeemed')
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `);
  return rowsOf<VoucherRow>(result)[0] ?? null;
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

  const voucherId = nextId('rf_voucher');
  const voucherCode = toVoucherCode(voucherId);
  const insertResult = await db.execute(sql`
    INSERT INTO rf_voucher (
      id,
      offer_id,
      partner_id,
      issued_to_user_id,
      status,
      code,
      claimed_at,
      redeemed_at,
      created_at,
      updated_at
    )
    VALUES (
      ${voucherId},
      ${offer.id},
      ${offer.partner_id},
      ${principal.userId},
      'claimed',
      ${voucherCode},
      now(),
      NULL,
      now(),
      now()
    )
    ON CONFLICT (offer_id, issued_to_user_id) WHERE status IN ('claimed', 'redeemed')
    DO NOTHING
    RETURNING id, offer_id, partner_id, issued_to_user_id, status, code, claimed_at, redeemed_at, created_at, updated_at
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

export async function listMyVouchers(db: DbExecutor, principal: GatewayPrincipal): Promise<Voucher[]> {
  const result = await db.execute(sql`
    SELECT id, offer_id, partner_id, issued_to_user_id, status, code, claimed_at, redeemed_at, created_at, updated_at
    FROM rf_voucher
    WHERE issued_to_user_id = ${principal.userId}
    ORDER BY created_at DESC, id DESC
  `);
  return rowsOf<VoucherRow>(result).map(toVoucher);
}

export async function redeemVoucher(
  db: DbExecutor,
  principal: GatewayPrincipal,
  input: { partnerId: string; voucherId: string }
): Promise<RedeemResult> {
  const partner = await getOwnedActivePartner(db, input.partnerId, principal.userId);
  if (!partner) {
    return { ok: false, code: 'RF_PARTNER_NOT_FOUND', message: 'RF partner not found', status: 404 };
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

  const updateResult = await db.execute(sql`
    UPDATE rf_voucher
    SET
      status = 'redeemed',
      redeemed_at = now(),
      updated_at = now()
    WHERE id = ${input.voucherId}
      AND partner_id = ${input.partnerId}
      AND status = 'claimed'
    RETURNING id, offer_id, partner_id, issued_to_user_id, status, code, claimed_at, redeemed_at, created_at, updated_at
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

export function resetRfStoreForTests(): void {
  writeTimestampsByActorAndOp.clear();
}
