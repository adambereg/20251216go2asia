import { createDb } from '@go2asia/db';

import type { GatewayPrincipal } from '../middleware/auth';
import { errorResponse, json, readJsonObject } from '../middleware/http';
import {
  acceptProLink,
  activateOffer,
  archivePartnerItem,
  claimVoucher,
  claimVoucherForListing,
  createOffer,
  createPartner,
  createPartnerItem,
  createProLink,
  endProLink,
  getMyVoucherSummary,
  getPublicOfferById,
  getPublicPartnerById,
  getRieltListingOfferContext,
  listPartnerItems,
  listPartnerProLinks,
  listMyVouchers,
  listProLinks,
  listPublicOffers,
  listPublicPartners,
  redeemVoucher,
  rejectProLink,
  shouldThrottleWrite,
  updatePartnerItem,
  validatePartnerGeoLinks,
  type RfClaimAttributionInput,
} from '../store';

type RfRouteEnv = {
  DATABASE_URL?: string;
};

function getPathParam(path: string, regex: RegExp): string | null {
  const match = path.match(regex);
  if (!match || !match[1]) return null;
  return decodeURIComponent(match[1]);
}

function isOfferType(value: unknown): value is 'discount' | 'bundle' | 'gift' | 'access' | 'campaign' | 'event_related' {
  return (
    value === 'discount' ||
    value === 'bundle' ||
    value === 'gift' ||
    value === 'access' ||
    value === 'campaign' ||
    value === 'event_related'
  );
}

function isVisibility(value: unknown): value is 'public' | 'pro_only' | 'invite_only' {
  return value === 'public' || value === 'pro_only' || value === 'invite_only';
}

function isRoleScope(value: unknown): value is 'onboarding' | 'curation' | 'promotion' | 'moderation_support' | 'account_support' {
  return (
    value === 'onboarding' ||
    value === 'curation' ||
    value === 'promotion' ||
    value === 'moderation_support' ||
    value === 'account_support'
  );
}

function optionalString(body: Record<string, unknown>, key: string): string | null | undefined {
  if (!Object.prototype.hasOwnProperty.call(body, key)) return undefined;
  const value = body[key];
  if (value === null) return null;
  return typeof value === 'string' ? value : undefined;
}

function optionalPriceFrom(body: Record<string, unknown>): number | null | undefined {
  if (!Object.prototype.hasOwnProperty.call(body, 'priceFrom')) return undefined;
  const value = body.priceFrom;
  if (value === null) return null;
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function optionalAttributionMetadata(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

function parseClaimAttribution(body: Record<string, unknown> | null): RfClaimAttributionInput | null {
  const raw = body?.attribution;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const attribution = raw as Record<string, unknown>;
  return {
    version: typeof attribution.version === 'number' ? attribution.version : undefined,
    shareCode: typeof attribution.shareCode === 'string' ? attribution.shareCode : undefined,
    attributionSource: typeof attribution.attributionSource === 'string'
      ? (attribution.attributionSource as RfClaimAttributionInput['attributionSource'])
      : undefined,
    claimSource: typeof attribution.claimSource === 'string' ? (attribution.claimSource as RfClaimAttributionInput['claimSource']) : undefined,
    capturedAt: typeof attribution.capturedAt === 'string' ? attribution.capturedAt : undefined,
    metadata: optionalAttributionMetadata(attribution.metadata),
  };
}

export async function handleRfRoute(
  request: Request,
  env: RfRouteEnv,
  requestId: string,
  principal: GatewayPrincipal | null
): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  if (!path.startsWith('/v1/rf/')) return null;

  if (!env.DATABASE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const db = createDb(env.DATABASE_URL);

  if (request.method === 'GET' && path === '/v1/rf/partners') {
    return json({ items: await listPublicPartners(db), nextCursor: null });
  }

  if (request.method === 'GET' && path === '/v1/rf/offers') {
    return json({ items: await listPublicOffers(db), nextCursor: null });
  }

  const rieltListingId = getPathParam(path, /^\/v1\/rf\/rielt\/listings\/([^/]+)\/offers$/);
  if (request.method === 'GET' && rieltListingId) {
    const context = await getRieltListingOfferContext(db, rieltListingId);
    if (!context) return errorResponse('RF_RIELT_LISTING_NOT_FOUND', 'Rielt listing was not found', requestId, 404);
    return json(context);
  }

  const partnerId = getPathParam(path, /^\/v1\/rf\/partners\/([^/]+)$/);
  if (request.method === 'GET' && partnerId) {
    const item = await getPublicPartnerById(db, partnerId);
    if (!item) return errorResponse('RF_PARTNER_NOT_FOUND', 'RF partner was not found', requestId, 404);
    return json(item);
  }

  const offerId = getPathParam(path, /^\/v1\/rf\/offers\/([^/]+)$/);
  if (request.method === 'GET' && offerId) {
    const item = await getPublicOfferById(db, offerId);
    if (!item) return errorResponse('RF_OFFER_NOT_FOUND', 'RF offer was not found', requestId, 404);
    return json(item);
  }

  if (request.method === 'POST' && path === '/v1/rf/business/partners') {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const body = await readJsonObject(request);
    if (!body) return errorResponse('INVALID_REQUEST', 'Expected JSON object body', requestId, 400);

    const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : '';
    const countryId = typeof body.countryId === 'string' ? body.countryId.trim() : '';
    const cityId = typeof body.cityId === 'string' ? body.cityId.trim() : '';
    const atlasPlaceIdRaw = typeof body.atlasPlaceId === 'string' ? body.atlasPlaceId.trim() : '';
    const hostAtlasPlaceIdRaw = typeof body.hostAtlasPlaceId === 'string' ? body.hostAtlasPlaceId.trim() : '';
    const atlasPlaceId = atlasPlaceIdRaw.length > 0 ? atlasPlaceIdRaw : null;
    const hostAtlasPlaceId = hostAtlasPlaceIdRaw.length > 0 ? hostAtlasPlaceIdRaw : null;
    if (!displayName || !countryId || !cityId) {
      return errorResponse('INVALID_REQUEST', 'displayName, countryId and cityId are required', requestId, 400);
    }

    const geoValidation = await validatePartnerGeoLinks(db, {
      countryId,
      cityId,
      atlasPlaceId,
      hostAtlasPlaceId,
    });
    if (!geoValidation.ok) {
      return errorResponse(geoValidation.code, geoValidation.error, requestId, geoValidation.status);
    }

    const partner = await createPartner(db, principal, {
      displayName,
      countryId,
      cityId,
      atlasPlaceId,
      hostAtlasPlaceId,
    });
    return json(partner, 201);
  }

  const businessPartnerItemsPartnerId = getPathParam(path, /^\/v1\/rf\/business\/partners\/([^/]+)\/items$/);
  if (request.method === 'GET' && businessPartnerItemsPartnerId) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const result = await listPartnerItems(db, principal, businessPartnerItemsPartnerId);
    if (!result.ok) return errorResponse(result.code, result.message, requestId, result.status);
    return json({ items: result.items, nextCursor: null });
  }

  if (request.method === 'POST' && businessPartnerItemsPartnerId) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const body = await readJsonObject(request);
    if (!body) return errorResponse('INVALID_REQUEST', 'Expected JSON object body', requestId, 400);

    const title = typeof body.title === 'string' ? body.title : '';
    const result = await createPartnerItem(db, principal, businessPartnerItemsPartnerId, {
      title,
      description: optionalString(body, 'description'),
      category: optionalString(body, 'category'),
      priceFrom: optionalPriceFrom(body),
      currency: optionalString(body, 'currency'),
    });
    if (!result.ok) return errorResponse(result.code, result.message, requestId, result.status);
    return json(result.item, 201);
  }

  const businessPartnerItemMatch = path.match(/^\/v1\/rf\/business\/partners\/([^/]+)\/items\/([^/]+)$/);
  if (request.method === 'PATCH' && businessPartnerItemMatch) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const body = await readJsonObject(request);
    if (!body) return errorResponse('INVALID_REQUEST', 'Expected JSON object body', requestId, 400);
    const result = await updatePartnerItem(db, principal, decodeURIComponent(businessPartnerItemMatch[1] ?? ''), decodeURIComponent(businessPartnerItemMatch[2] ?? ''), {
      title: optionalString(body, 'title') ?? undefined,
      description: optionalString(body, 'description'),
      category: optionalString(body, 'category'),
      priceFrom: optionalPriceFrom(body),
      currency: optionalString(body, 'currency'),
    });
    if (!result.ok) return errorResponse(result.code, result.message, requestId, result.status);
    return json(result.item);
  }

  const businessPartnerItemArchiveMatch = path.match(/^\/v1\/rf\/business\/partners\/([^/]+)\/items\/([^/]+)\/archive$/);
  if (request.method === 'POST' && businessPartnerItemArchiveMatch) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const result = await archivePartnerItem(
      db,
      principal,
      decodeURIComponent(businessPartnerItemArchiveMatch[1] ?? ''),
      decodeURIComponent(businessPartnerItemArchiveMatch[2] ?? '')
    );
    if (!result.ok) return errorResponse(result.code, result.message, requestId, result.status);
    return json(result.item);
  }

  const businessPartnerId = getPathParam(path, /^\/v1\/rf\/business\/partners\/([^/]+)\/offers$/);
  if (request.method === 'POST' && businessPartnerId) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const body = await readJsonObject(request);
    if (!body) return errorResponse('INVALID_REQUEST', 'Expected JSON object body', requestId, 400);

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title || !isOfferType(body.offerType) || !isVisibility(body.visibility)) {
      return errorResponse('INVALID_REQUEST', 'title, offerType and visibility are required', requestId, 400);
    }

    const result = await createOffer(db, principal, {
      partnerId: businessPartnerId,
      itemId: typeof body.itemId === 'string' && body.itemId.trim().length > 0 ? body.itemId.trim() : null,
      title,
      offerType: body.offerType,
      visibility: body.visibility,
    });
    if ('error' in result) {
      if (result.status === 409) return errorResponse('RF_PARTNER_ITEM_ARCHIVED', result.error, requestId, 409);
      return errorResponse(result.status === 403 ? 'RF_PARTNER_FORBIDDEN' : result.error.includes('item') ? 'RF_PARTNER_ITEM_NOT_FOUND' : 'RF_PARTNER_NOT_FOUND', result.error, requestId, result.status);
    }
    return json(result, 201);
  }

  const activateMatch = path.match(/^\/v1\/rf\/business\/partners\/([^/]+)\/offers\/([^/]+)\/activate$/);
  if (request.method === 'POST' && activateMatch) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const partnerIdValue = decodeURIComponent(activateMatch[1] ?? '');
    const offerIdValue = decodeURIComponent(activateMatch[2] ?? '');
    const result = await activateOffer(db, principal, { partnerId: partnerIdValue, offerId: offerIdValue });
    if ('error' in result) {
      if (result.status === 403) return errorResponse('RF_PARTNER_FORBIDDEN', result.error, requestId, 403);
      if (result.status === 409) return errorResponse('RF_OFFER_ARCHIVED', result.error, requestId, 409);
      return errorResponse('RF_OFFER_NOT_FOUND', result.error, requestId, 404);
    }
    return json(result);
  }

  const claimOfferId = getPathParam(path, /^\/v1\/rf\/offers\/([^/]+)\/claim$/);
  if (request.method === 'POST' && claimOfferId) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const idempotencyKey = request.headers.get('Idempotency-Key')?.trim();
    if (!idempotencyKey) {
      return errorResponse('MISSING_IDEMPOTENCY_KEY', 'Idempotency-Key is required for voucher claim', requestId, 400);
    }
    if (idempotencyKey.length > 160) {
      return errorResponse('INVALID_IDEMPOTENCY_KEY', 'Idempotency-Key must be <= 160 characters', requestId, 400);
    }
    if (shouldThrottleWrite(principal.userId, 'claim')) {
      return errorResponse('RATE_LIMITED', 'Too many voucher claim requests. Please retry later.', requestId, 429);
    }

    const body = await readJsonObject(request);
    const result = await claimVoucher(db, principal, {
      offerId: claimOfferId,
      idempotencyKey,
      attribution: parseClaimAttribution(body),
    });
    if (!result.ok) return errorResponse(result.code, result.message, requestId, result.status);
    return json(
      {
        voucher: result.voucher,
        idempotentReplay: result.idempotentReplay,
      },
      result.idempotentReplay ? 200 : 201
    );
  }

  const listingClaimMatch = path.match(/^\/v1\/rf\/rielt\/listings\/([^/]+)\/offers\/([^/]+)\/claim$/);
  if (request.method === 'POST' && listingClaimMatch) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const idempotencyKey = request.headers.get('Idempotency-Key')?.trim();
    if (!idempotencyKey) {
      return errorResponse('MISSING_IDEMPOTENCY_KEY', 'Idempotency-Key is required for voucher claim', requestId, 400);
    }
    if (idempotencyKey.length > 160) {
      return errorResponse('INVALID_IDEMPOTENCY_KEY', 'Idempotency-Key must be <= 160 characters', requestId, 400);
    }
    if (shouldThrottleWrite(principal.userId, 'claim')) {
      return errorResponse('RATE_LIMITED', 'Too many voucher claim requests. Please retry later.', requestId, 429);
    }

    const listingId = decodeURIComponent(listingClaimMatch[1] ?? '');
    const offerIdValue = decodeURIComponent(listingClaimMatch[2] ?? '');
    const body = await readJsonObject(request);
    const result = await claimVoucherForListing(db, principal, {
      listingId,
      offerId: offerIdValue,
      idempotencyKey,
      attribution: parseClaimAttribution(body),
    });
    if (!result.ok) return errorResponse(result.code, result.message, requestId, result.status);
    return json(
      {
        voucher: result.voucher,
        idempotentReplay: result.idempotentReplay,
      },
      result.idempotentReplay ? 200 : 201
    );
  }

  if (request.method === 'GET' && path === '/v1/rf/me/vouchers') {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    return json({ items: await listMyVouchers(db, principal), nextCursor: null });
  }

  if (request.method === 'GET' && path === '/v1/rf/me/vouchers/summary') {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    return json(await getMyVoucherSummary(db, principal));
  }

  const redeemMatch = path.match(/^\/v1\/rf\/business\/partners\/([^/]+)\/vouchers\/([^/]+)\/redeem$/);
  if (request.method === 'POST' && redeemMatch) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const idempotencyKey = request.headers.get('Idempotency-Key')?.trim() || null;
    if (idempotencyKey && idempotencyKey.length > 160) {
      return errorResponse('INVALID_IDEMPOTENCY_KEY', 'Idempotency-Key must be <= 160 characters', requestId, 400);
    }
    if (shouldThrottleWrite(principal.userId, 'redeem')) {
      return errorResponse('RATE_LIMITED', 'Too many voucher redeem requests. Please retry later.', requestId, 429);
    }
    const partnerIdValue = decodeURIComponent(redeemMatch[1] ?? '');
    const voucherId = decodeURIComponent(redeemMatch[2] ?? '');
    const result = await redeemVoucher(db, principal, { partnerId: partnerIdValue, voucherId, idempotencyKey, correlationId: requestId });
    if (!result.ok) return errorResponse(result.code, result.message, requestId, result.status);
    return json({
      voucher: result.voucher,
      applied: result.applied,
    });
  }

  if (request.method === 'GET' && path === '/v1/rf/pro/links') {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    return json({ items: await listProLinks(db, principal), nextCursor: null });
  }

  const partnerProLinksPartnerId = getPathParam(path, /^\/v1\/rf\/business\/partners\/([^/]+)\/pro-links$/);
  if (request.method === 'GET' && partnerProLinksPartnerId) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const result = await listPartnerProLinks(db, principal, { partnerId: partnerProLinksPartnerId });
    if (!result.ok) return errorResponse(result.code, result.message, requestId, result.status);
    return json({ items: result.items, nextCursor: null });
  }

  if (request.method === 'POST' && path === '/v1/rf/pro/links') {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const body = await readJsonObject(request);
    if (!body || typeof body.partnerId !== 'string' || !isRoleScope(body.roleScope)) {
      return errorResponse('INVALID_REQUEST', 'partnerId and roleScope are required', requestId, 400);
    }
    const result = await createProLink(db, principal, {
      partnerId: body.partnerId,
      roleScope: body.roleScope,
    });
    if ('error' in result) {
      return errorResponse('RF_PARTNER_NOT_FOUND', result.error, requestId, result.status);
    }
    return json(result, 201);
  }

  const proLinkId = getPathParam(path, /^\/v1\/rf\/pro\/links\/([^/]+)\/accept$/);
  if (request.method === 'POST' && proLinkId) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const result = await acceptProLink(db, principal, { proLinkId });
    if (!result.ok) return errorResponse(result.code, result.message, requestId, result.status);
    return json({
      proLink: result.proLink,
      applied: result.applied,
    });
  }

  const rejectProLinkId = getPathParam(path, /^\/v1\/rf\/pro\/links\/([^/]+)\/reject$/);
  if (request.method === 'POST' && rejectProLinkId) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const result = await rejectProLink(db, principal, { proLinkId: rejectProLinkId });
    if (!result.ok) return errorResponse(result.code, result.message, requestId, result.status);
    return json({
      proLink: result.proLink,
      applied: result.applied,
    });
  }

  const endProLinkId = getPathParam(path, /^\/v1\/rf\/pro\/links\/([^/]+)\/end$/);
  if (request.method === 'POST' && endProLinkId) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    const result = await endProLink(db, principal, { proLinkId: endProLinkId });
    if (!result.ok) return errorResponse(result.code, result.message, requestId, result.status);
    return json({
      proLink: result.proLink,
      applied: result.applied,
    });
  }

  return null;
}
