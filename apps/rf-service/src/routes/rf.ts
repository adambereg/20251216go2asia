import { createDb } from '@go2asia/db';

import type { GatewayPrincipal } from '../middleware/auth';
import { errorResponse, json, readJsonObject } from '../middleware/http';
import {
  acceptProLink,
  activateOffer,
  claimVoucher,
  createOffer,
  createPartner,
  createProLink,
  getPublicOfferById,
  getPublicPartnerById,
  listMyVouchers,
  listProLinks,
  listPublicOffers,
  listPublicPartners,
  redeemVoucher,
  shouldThrottleWrite,
  validatePartnerGeoLinks,
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
      title,
      offerType: body.offerType,
      visibility: body.visibility,
    });
    if ('error' in result) {
      return errorResponse(result.status === 403 ? 'RF_PARTNER_FORBIDDEN' : 'RF_PARTNER_NOT_FOUND', result.error, requestId, result.status);
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
    if (shouldThrottleWrite(principal.userId, 'claim')) {
      return errorResponse('RATE_LIMITED', 'Too many voucher claim requests. Please retry later.', requestId, 429);
    }

    const result = await claimVoucher(db, principal, {
      offerId: claimOfferId,
      idempotencyKey,
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

  const redeemMatch = path.match(/^\/v1\/rf\/business\/partners\/([^/]+)\/vouchers\/([^/]+)\/redeem$/);
  if (request.method === 'POST' && redeemMatch) {
    if (!principal) return errorResponse('UNAUTHORIZED', 'Authentication required', requestId, 401);
    if (shouldThrottleWrite(principal.userId, 'redeem')) {
      return errorResponse('RATE_LIMITED', 'Too many voucher redeem requests. Please retry later.', requestId, 429);
    }
    const partnerIdValue = decodeURIComponent(redeemMatch[1] ?? '');
    const voucherId = decodeURIComponent(redeemMatch[2] ?? '');
    const result = await redeemVoucher(db, principal, { partnerId: partnerIdValue, voucherId });
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

  return null;
}
