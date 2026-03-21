import type { GatewayPrincipal } from './middleware/auth';

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

type IdempotencyRecord = {
  operation: 'voucher_claim';
  actorUserId: string;
  key: string;
  voucherId: string;
};

type ClaimResult =
  | { ok: true; voucher: Voucher; idempotentReplay: boolean }
  | { ok: false; code: string; message: string; status: number };
type RedeemResult =
  | { ok: true; voucher: Voucher; applied: boolean }
  | { ok: false; code: string; message: string; status: number };
type ProLinkAcceptResult =
  | { ok: true; proLink: ProLink; applied: boolean }
  | { ok: false; code: string; message: string; status: number };

const partners = new Map<string, Partner>();
const offers = new Map<string, Offer>();
const vouchers = new Map<string, Voucher>();
const proLinks = new Map<string, ProLink>();
const idempotencyByKey = new Map<string, IdempotencyRecord>();
const writeTimestampsByActorAndOp = new Map<string, number[]>();

let idSeq = 1;

function nowIso(): string {
  return new Date().toISOString();
}

function nextId(prefix: string): string {
  const value = `${prefix}_${idSeq}`;
  idSeq += 1;
  return value;
}

function toSlug(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base.length > 0 ? base : `entity-${idSeq}`;
}

function toVoucherCode(voucherId: string): string {
  const n = voucherId.replace(/\D+/g, '').padStart(6, '0');
  return `RF-${n.slice(-6)}`;
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

export function listPublicPartners(): Partner[] {
  return [...partners.values()].filter((partner) => partner.status === 'active');
}

export function getPublicPartnerById(partnerId: string): Partner | null {
  const partner = partners.get(partnerId);
  if (!partner || partner.status !== 'active') return null;
  return partner;
}

export function listPublicOffers(): Offer[] {
  return [...offers.values()].filter((offer) => offer.status === 'active' && offer.visibility === 'public');
}

export function getPublicOfferById(offerId: string): Offer | null {
  const offer = offers.get(offerId);
  if (!offer || offer.status !== 'active' || offer.visibility !== 'public') return null;
  return offer;
}

export function createPartner(
  principal: GatewayPrincipal,
  input: { displayName: string; countryId: string; cityId: string }
): Partner {
  const timestamp = nowIso();
  const partner: Partner = {
    id: nextId('rf_partner'),
    slug: toSlug(input.displayName),
    displayName: input.displayName,
    countryId: input.countryId,
    cityId: input.cityId,
    status: 'active',
    ownerUserId: principal.userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  partners.set(partner.id, partner);
  return partner;
}

export function createOffer(
  principal: GatewayPrincipal,
  input: {
    partnerId: string;
    title: string;
    offerType: Offer['offerType'];
    visibility: Offer['visibility'];
  }
): Offer | { error: string; status: number } {
  const partner = partners.get(input.partnerId);
  if (!partner || partner.status !== 'active') return { error: 'Partner not found', status: 404 };
  if (partner.ownerUserId !== principal.userId) return { error: 'Forbidden partner access', status: 403 };

  const timestamp = nowIso();
  const offer: Offer = {
    id: nextId('rf_offer'),
    partnerId: input.partnerId,
    title: input.title,
    offerType: input.offerType,
    visibility: input.visibility,
    status: 'draft',
    createdByUserId: principal.userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  offers.set(offer.id, offer);
  return offer;
}

export function activateOffer(
  principal: GatewayPrincipal,
  input: { partnerId: string; offerId: string }
): Offer | { error: string; status: number } {
  const partner = partners.get(input.partnerId);
  if (!partner || partner.status !== 'active') return { error: 'Partner not found', status: 404 };
  if (partner.ownerUserId !== principal.userId) return { error: 'Forbidden partner access', status: 403 };

  const offer = offers.get(input.offerId);
  if (!offer || offer.partnerId !== input.partnerId) return { error: 'Offer not found', status: 404 };
  if (offer.status === 'archived') return { error: 'Archived offer cannot be activated', status: 409 };
  if (offer.status === 'active') return offer;

  offer.status = 'active';
  offer.updatedAt = nowIso();
  offers.set(offer.id, offer);
  return offer;
}

export function claimVoucher(
  principal: GatewayPrincipal,
  input: { offerId: string; idempotencyKey: string }
): ClaimResult {
  const idempotencyLookupKey = `voucher_claim:${principal.userId}:${input.idempotencyKey}`;
  const replay = idempotencyByKey.get(idempotencyLookupKey);
  if (replay) {
    const voucher = vouchers.get(replay.voucherId);
    if (voucher) return { ok: true, voucher, idempotentReplay: true };
  }

  const offer = offers.get(input.offerId);
  if (!offer) return { ok: false, code: 'RF_OFFER_NOT_FOUND', message: 'RF offer not found', status: 404 };
  if (offer.status !== 'active') {
    return { ok: false, code: 'RF_OFFER_INACTIVE', message: 'RF offer is not active', status: 409 };
  }

  for (const voucher of vouchers.values()) {
    if (
      voucher.offerId === offer.id &&
      voucher.issuedToUserId === principal.userId &&
      (voucher.status === 'claimed' || voucher.status === 'redeemed')
    ) {
      return { ok: true, voucher, idempotentReplay: false };
    }
  }

  const timestamp = nowIso();
  const voucher: Voucher = {
    id: nextId('rf_voucher'),
    offerId: offer.id,
    partnerId: offer.partnerId,
    issuedToUserId: principal.userId,
    status: 'claimed',
    code: toVoucherCode(`rf_voucher_${idSeq}`),
    claimedAt: timestamp,
    redeemedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  vouchers.set(voucher.id, voucher);
  idempotencyByKey.set(idempotencyLookupKey, {
    operation: 'voucher_claim',
    actorUserId: principal.userId,
    key: input.idempotencyKey,
    voucherId: voucher.id,
  });

  return { ok: true, voucher, idempotentReplay: false };
}

export function listMyVouchers(principal: GatewayPrincipal): Voucher[] {
  return [...vouchers.values()].filter((voucher) => voucher.issuedToUserId === principal.userId);
}

export function redeemVoucher(
  principal: GatewayPrincipal,
  input: { partnerId: string; voucherId: string }
): RedeemResult {
  const partner = partners.get(input.partnerId);
  if (!partner || partner.status !== 'active') {
    return { ok: false, code: 'RF_PARTNER_NOT_FOUND', message: 'RF partner not found', status: 404 };
  }
  if (partner.ownerUserId !== principal.userId) {
    return { ok: false, code: 'RF_PARTNER_FORBIDDEN', message: 'Forbidden partner access', status: 403 };
  }

  const voucher = vouchers.get(input.voucherId);
  if (!voucher || voucher.partnerId !== input.partnerId) {
    return { ok: false, code: 'RF_VOUCHER_NOT_FOUND', message: 'RF voucher not found', status: 404 };
  }
  if (voucher.status === 'cancelled') {
    return { ok: false, code: 'RF_VOUCHER_CANCELLED', message: 'RF voucher is cancelled', status: 409 };
  }
  if (voucher.status === 'redeemed') {
    return { ok: true, voucher, applied: false };
  }
  if (voucher.status !== 'claimed') {
    return { ok: false, code: 'RF_VOUCHER_NOT_CLAIMED', message: 'RF voucher is not claimable', status: 409 };
  }

  voucher.status = 'redeemed';
  voucher.redeemedAt = nowIso();
  voucher.updatedAt = voucher.redeemedAt;
  vouchers.set(voucher.id, voucher);
  return { ok: true, voucher, applied: true };
}

export function listProLinks(principal: GatewayPrincipal): ProLink[] {
  return [...proLinks.values()].filter((item) => item.proUserId === principal.userId);
}

export function createProLink(
  principal: GatewayPrincipal,
  input: { partnerId: string; roleScope: ProLink['roleScope'] }
): ProLink | { error: string; status: number } {
  const partner = partners.get(input.partnerId);
  if (!partner || partner.status !== 'active') return { error: 'Partner not found', status: 404 };

  for (const item of proLinks.values()) {
    if (item.partnerId === input.partnerId && item.proUserId === principal.userId && item.status !== 'ended') {
      return item;
    }
  }

  const timestamp = nowIso();
  const proLink: ProLink = {
    id: nextId('rf_pro_link'),
    partnerId: input.partnerId,
    proUserId: principal.userId,
    status: 'pending',
    roleScope: input.roleScope,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  proLinks.set(proLink.id, proLink);
  return proLink;
}

export function acceptProLink(
  principal: GatewayPrincipal,
  input: { proLinkId: string }
): ProLinkAcceptResult {
  const proLink = proLinks.get(input.proLinkId);
  if (!proLink) return { ok: false, code: 'RF_PRO_LINK_NOT_FOUND', message: 'RF PRO link not found', status: 404 };

  const partner = partners.get(proLink.partnerId);
  if (!partner) return { ok: false, code: 'RF_PARTNER_NOT_FOUND', message: 'RF partner not found', status: 404 };
  if (partner.ownerUserId !== principal.userId) {
    return { ok: false, code: 'RF_PARTNER_FORBIDDEN', message: 'Only partner owner can accept link', status: 403 };
  }
  if (proLink.status === 'active') return { ok: true, proLink, applied: false };
  if (proLink.status === 'ended') {
    return { ok: false, code: 'RF_PRO_LINK_ENDED', message: 'Cannot accept ended link', status: 409 };
  }

  proLink.status = 'active';
  proLink.updatedAt = nowIso();
  proLinks.set(proLink.id, proLink);
  return { ok: true, proLink, applied: true };
}

export function resetRfStoreForTests(): void {
  partners.clear();
  offers.clear();
  vouchers.clear();
  proLinks.clear();
  idempotencyByKey.clear();
  writeTimestampsByActorAndOp.clear();
  idSeq = 1;
}
