import {
  archiveListingById,
  countMyInquiries,
  countActorVisibleListings,
  countPublishedListingsNearby,
  countPublishedListings,
  createListingInquiry,
  createOwnerListing,
  getActiveActorRoleForListing,
  getDb,
  getListingByIdForManage,
  getPublishedListingByIdOrSlug,
  listMyInquiries,
  listActorVisibleListings,
  listPublishedListingsNearby,
  listPublishedListings,
  patchOwnerListingById,
  validateAtlasGeoLinks,
  type InquiryRow,
  type MyInquiryRow,
  type NearbyListingRow,
  type OwnerListingRow,
  type PatchOwnerListingInput,
  type PublicListingRow,
} from '../db/queries/listingQueries';
import type { GatewayPrincipal } from '../middleware/auth';
import { errorResponse, json } from '../middleware/http';
import {
  parseCreateInquiryInput,
  parseCreateListingInput,
  parseListListingsQuery,
  parseMyInquiriesQuery,
  parseMyListingsQuery,
  parseNearbyListingsQuery,
  parsePatchListingInput,
  type PatchListingInput,
} from '../validation/rielt';

type Env = {
  DATABASE_URL?: string;
};

const WRITE_ALLOWED_ROLES = new Set(['owner', 'agent', 'admin']);
const ADMIN_ROLES = new Set(['admin']);

function asIso(value: string | Date | null): string | null {
  if (!value) return null;
  return new Date(value).toISOString();
}

function toNumber(value: number | string | null): number | null {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function hasAnyRole(principal: GatewayPrincipal, allowed: Set<string>): boolean {
  return principal.roles.some((role) => allowed.has(role));
}

function isUniqueViolation(error: unknown, constraintName?: string): boolean {
  if (!error || typeof error !== 'object') return false;
  const dbError = error as { code?: string; constraint?: string; message?: string };
  if (dbError.code === '23505') return true;
  if (constraintName && dbError.constraint === constraintName) return true;
  if (constraintName && dbError.message?.includes(constraintName)) return true;
  return false;
}

function toPublicListingDto(row: PublicListingRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    listingType: row.listing_type,
    price: {
      amount: toNumber(row.price_amount) ?? 0,
      currency: row.price_currency,
      period: row.price_period,
    },
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    areaSqm: toNumber(row.area_sqm),
    geo: {
      countryId: row.country_id,
      cityId: row.city_id,
      atlasPlaceId: row.atlas_place_id ?? null,
      atlasContainerPlaceId: row.atlas_container_place_id ?? null,
    },
    media: {
      coverUrl: null as string | null,
      photos: [] as string[],
    },
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
    publishedAt: asIso(row.published_at),
  };
}

function toPublicNearbyListingDto(row: NearbyListingRow) {
  return {
    ...toPublicListingDto(row),
    distanceMeters: Math.round(toNumber(row.distance_meters) ?? 0),
  };
}

function toOwnerListingDto(row: OwnerListingRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    listingType: row.listing_type,
    status: row.status,
    price: {
      amount: toNumber(row.price_amount) ?? 0,
      currency: row.price_currency,
      period: row.price_period,
    },
    geo: {
      countryId: row.country_id,
      cityId: row.city_id,
      atlasPlaceId: row.atlas_place_id ?? null,
      atlasContainerPlaceId: row.atlas_container_place_id ?? null,
      lat: toNumber(row.lat),
      lng: toNumber(row.lng),
      areaText: row.area_text,
    },
    specs: {
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      areaSqm: toNumber(row.area_sqm),
      amenities: row.amenities ?? [],
    },
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
    publishedAt: asIso(row.published_at),
    archivedAt: asIso(row.archived_at),
  };
}

function toInquiryDto(row: InquiryRow) {
  return {
    id: row.id,
    listingId: row.listing_id,
    requesterUserId: row.requester_user_id,
    message: row.message,
    contact: {
      name: row.contact_name,
      phone: row.contact_phone,
      telegram: row.contact_telegram,
    },
    status: row.status,
    idempotencyKey: row.idempotency_key,
    createdAt: asIso(row.created_at),
    closedAt: asIso(row.closed_at),
  };
}

function toMyInquiryDto(row: MyInquiryRow) {
  return {
    ...toInquiryDto(row),
    listing: {
      id: row.listing_id,
      slug: row.listing_slug,
      title: row.listing_title,
      geo: {
        countryId: row.listing_country_id,
        cityId: row.listing_city_id,
      },
    },
  };
}

function toPatchPayload(input: PatchListingInput): PatchOwnerListingInput {
  return {
    slugSet: input.slug !== undefined,
    slug: input.slug ?? null,
    titleSet: input.title !== undefined,
    title: input.title ?? null,
    descriptionSet: input.description !== undefined,
    description: input.description ?? null,
    listingTypeSet: input.listingType !== undefined,
    listingType: input.listingType ?? null,
    priceAmountSet: input.priceAmount !== undefined,
    priceAmount: input.priceAmount ?? null,
    priceCurrencySet: input.priceCurrency !== undefined,
    priceCurrency: input.priceCurrency ?? null,
    pricePeriodSet: input.pricePeriod !== undefined,
    pricePeriod: input.pricePeriod ?? null,
    countryIdSet: input.countryId !== undefined,
    countryId: input.countryId ?? null,
    cityIdSet: input.cityId !== undefined,
    cityId: input.cityId ?? null,
    atlasPlaceIdSet: input.atlasPlaceId !== undefined,
    atlasPlaceId: input.atlasPlaceId ?? null,
    atlasContainerPlaceIdSet: input.atlasContainerPlaceId !== undefined,
    atlasContainerPlaceId: input.atlasContainerPlaceId ?? null,
    areaTextSet: input.areaText !== undefined,
    areaText: input.areaText ?? null,
    latSet: input.lat !== undefined,
    lat: input.lat ?? null,
    lngSet: input.lng !== undefined,
    lng: input.lng ?? null,
    bedroomsSet: input.bedrooms !== undefined,
    bedrooms: input.bedrooms ?? null,
    bathroomsSet: input.bathrooms !== undefined,
    bathrooms: input.bathrooms ?? null,
    areaSqmSet: input.areaSqm !== undefined,
    areaSqm: input.areaSqm ?? null,
    amenitiesSet: input.amenities !== undefined,
    amenities: input.amenities ?? null,
    statusSet: input.status !== undefined,
    status: input.status ?? null,
  };
}

export async function listPublicListings(env: Env, url: URL, requestId: string): Promise<Response> {
  const query = parseListListingsQuery(url.searchParams);
  if (!query) {
    return errorResponse('VALIDATION_ERROR', 'Invalid listings query parameters', requestId, 400);
  }

  let db;
  try {
    db = getDb(env);
  } catch {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const [items, total] = await Promise.all([
    listPublishedListings(db, {
      countryId: query.countryId,
      cityId: query.cityId,
      listingType: query.listingType,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      bedroomsMin: query.bedroomsMin,
      bedroomsMax: query.bedroomsMax,
      sort: query.sort,
      limit: query.pageSize,
      offset: query.offset,
    }),
    countPublishedListings(db, {
      countryId: query.countryId,
      cityId: query.cityId,
      listingType: query.listingType,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      bedroomsMin: query.bedroomsMin,
      bedroomsMax: query.bedroomsMax,
    }),
  ]);

  return json({
    items: items.map(toPublicListingDto),
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
    },
  });
}

export async function getPublicListing(env: Env, idOrSlug: string, requestId: string): Promise<Response> {
  let db;
  try {
    db = getDb(env);
  } catch {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const row = await getPublishedListingByIdOrSlug(db, idOrSlug);
  if (!row) {
    return errorResponse('NOT_FOUND', 'Listing not found', requestId, 404);
  }

  return json({ listing: toPublicListingDto(row) });
}

export async function listNearbyPublicListings(env: Env, url: URL, requestId: string): Promise<Response> {
  const query = parseNearbyListingsQuery(url.searchParams);
  if (!query) {
    return errorResponse('VALIDATION_ERROR', 'Invalid nearby query parameters', requestId, 400);
  }

  let db;
  try {
    db = getDb(env);
  } catch {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const [items, total] = await Promise.all([
    listPublishedListingsNearby(db, {
      lat: query.lat,
      lng: query.lng,
      radiusKm: query.radiusKm,
      countryId: query.countryId,
      cityId: query.cityId,
      listingType: query.listingType,
      limit: query.pageSize,
      offset: query.offset,
    }),
    countPublishedListingsNearby(db, {
      lat: query.lat,
      lng: query.lng,
      radiusKm: query.radiusKm,
      countryId: query.countryId,
      cityId: query.cityId,
      listingType: query.listingType,
    }),
  ]);

  return json({
    anchor: {
      lat: query.lat,
      lng: query.lng,
      radiusKm: query.radiusKm,
    },
    items: items.map(toPublicNearbyListingDto),
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
    },
  });
}

export async function createOwnedListing(
  env: Env,
  principal: GatewayPrincipal,
  body: Record<string, unknown> | null,
  requestId: string
): Promise<Response> {
  if (!hasAnyRole(principal, WRITE_ALLOWED_ROLES)) {
    return errorResponse('FORBIDDEN', 'Owner or agent role is required', requestId, 403);
  }

  const input = parseCreateListingInput(body);
  if (!input) {
    return errorResponse('VALIDATION_ERROR', 'Invalid listing payload', requestId, 400);
  }

  let db;
  try {
    db = getDb(env);
  } catch {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const geoValidation = await validateAtlasGeoLinks(db, {
    countryId: input.countryId,
    cityId: input.cityId,
    atlasPlaceId: input.atlasPlaceId,
    atlasContainerPlaceId: input.atlasContainerPlaceId,
  });
  if (!geoValidation.ok) {
    return errorResponse(geoValidation.code, geoValidation.message, requestId, 400);
  }

  const listingId = crypto.randomUUID();
  try {
    const created = await createOwnerListing(db, {
      id: listingId,
      ownerLinkId: crypto.randomUUID(),
      slug: input.slug,
      title: input.title,
      description: input.description,
      listingType: input.listingType,
      priceAmount: input.priceAmount,
      priceCurrency: input.priceCurrency,
      pricePeriod: input.pricePeriod,
      countryId: input.countryId,
      cityId: input.cityId,
      atlasPlaceId: input.atlasPlaceId,
      atlasContainerPlaceId: input.atlasContainerPlaceId,
      areaText: input.areaText,
      lat: input.lat,
      lng: input.lng,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      areaSqm: input.areaSqm,
      amenities: input.amenities,
      createdByUserId: principal.userId,
      media: input.media.map((item) => ({
        id: crypto.randomUUID(),
        listingId,
        mediaId: item.mediaId,
        sortOrder: item.sortOrder,
        isCover: item.isCover,
      })),
    });
    if (!created) {
      return errorResponse('INTERNAL_ERROR', 'Failed to create listing', requestId, 500);
    }

    return json({ listing: toOwnerListingDto(created) }, 201);
  } catch (error) {
    if (isUniqueViolation(error, 'rielt_listing_slug_unique')) {
      return errorResponse('CONFLICT', 'Listing slug already exists', requestId, 409);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to create listing', requestId, 500);
  }
}

export async function patchOwnedListing(
  env: Env,
  listingId: string,
  principal: GatewayPrincipal,
  body: Record<string, unknown> | null,
  requestId: string
): Promise<Response> {
  const patchInput = parsePatchListingInput(body);
  if (!patchInput) {
    return errorResponse('VALIDATION_ERROR', 'Invalid listing patch payload', requestId, 400);
  }

  let db;
  try {
    db = getDb(env);
  } catch {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const listing = await getListingByIdForManage(db, listingId);
  if (!listing) return errorResponse('NOT_FOUND', 'Listing not found', requestId, 404);
  if (listing.status === 'archived') {
    return errorResponse('CONFLICT', 'Archived listing cannot be modified', requestId, 409);
  }

  const nextCountryId = patchInput.countryId ?? listing.country_id;
  const nextCityId = patchInput.cityId !== undefined ? patchInput.cityId : listing.city_id;
  const nextAtlasPlaceId = patchInput.atlasPlaceId !== undefined ? patchInput.atlasPlaceId : (listing.atlas_place_id ?? null);
  const nextAtlasContainerPlaceId =
    patchInput.atlasContainerPlaceId !== undefined
      ? patchInput.atlasContainerPlaceId
      : (listing.atlas_container_place_id ?? null);
  const geoValidation = await validateAtlasGeoLinks(db, {
    countryId: nextCountryId,
    cityId: nextCityId,
    atlasPlaceId: nextAtlasPlaceId,
    atlasContainerPlaceId: nextAtlasContainerPlaceId,
  });
  if (!geoValidation.ok) {
    return errorResponse(geoValidation.code, geoValidation.message, requestId, 400);
  }

  const isAdmin = hasAnyRole(principal, ADMIN_ROLES);
  if (!isAdmin) {
    const actorRole = await getActiveActorRoleForListing(db, {
      listingId,
      actorUserId: principal.userId,
    });
    if (!actorRole || (actorRole !== 'owner' && actorRole !== 'agent')) {
      return errorResponse('FORBIDDEN', 'Listing update is not allowed', requestId, 403);
    }
  }

  try {
    const updated = await patchOwnerListingById(db, {
      listingId,
      patch: toPatchPayload(patchInput),
    });
    if (!updated) return errorResponse('NOT_FOUND', 'Listing not found', requestId, 404);
    return json({ listing: toOwnerListingDto(updated) });
  } catch (error) {
    if (isUniqueViolation(error, 'rielt_listing_slug_unique')) {
      return errorResponse('CONFLICT', 'Listing slug already exists', requestId, 409);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to patch listing', requestId, 500);
  }
}

export async function archiveOwnedListing(
  env: Env,
  listingId: string,
  principal: GatewayPrincipal,
  requestId: string
): Promise<Response> {
  let db;
  try {
    db = getDb(env);
  } catch {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const listing = await getListingByIdForManage(db, listingId);
  if (!listing) return errorResponse('NOT_FOUND', 'Listing not found', requestId, 404);

  const isAdmin = hasAnyRole(principal, ADMIN_ROLES);
  if (!isAdmin) {
    const actorRole = await getActiveActorRoleForListing(db, {
      listingId,
      actorUserId: principal.userId,
    });
    if (!actorRole || (actorRole !== 'owner' && actorRole !== 'agent')) {
      return errorResponse('FORBIDDEN', 'Listing archive is not allowed', requestId, 403);
    }
  }

  const archived = await archiveListingById(db, listingId);
  if (!archived) return errorResponse('NOT_FOUND', 'Listing not found', requestId, 404);
  return json({ listing: toOwnerListingDto(archived), archived: true });
}

export async function listMyOwnedListings(
  env: Env,
  principal: GatewayPrincipal,
  url: URL,
  requestId: string
): Promise<Response> {
  const query = parseMyListingsQuery(url.searchParams);
  if (!query) {
    return errorResponse('VALIDATION_ERROR', 'Invalid my-listings query parameters', requestId, 400);
  }

  let db;
  try {
    db = getDb(env);
  } catch {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const [items, total] = await Promise.all([
    listActorVisibleListings(db, {
      actorUserId: principal.userId,
      status: query.status,
      sort: query.sort,
      limit: query.pageSize,
      offset: query.offset,
    }),
    countActorVisibleListings(db, {
      actorUserId: principal.userId,
      status: query.status,
    }),
  ]);

  return json({
    items: items.map(toOwnerListingDto),
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
    },
  });
}

export async function createListingInquiryByIdOrSlug(
  env: Env,
  principal: GatewayPrincipal,
  idOrSlug: string,
  idempotencyKey: string | null,
  body: Record<string, unknown> | null,
  requestId: string
): Promise<Response> {
  if (!idempotencyKey || idempotencyKey.trim().length === 0) {
    return errorResponse('VALIDATION_ERROR', 'Idempotency-Key header is required', requestId, 400);
  }
  const input = parseCreateInquiryInput(body);
  if (!input) {
    return errorResponse('VALIDATION_ERROR', 'Invalid inquiry payload', requestId, 400);
  }

  let db;
  try {
    db = getDb(env);
  } catch {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const listing = await getPublishedListingByIdOrSlug(db, idOrSlug);
  if (!listing) {
    return errorResponse('NOT_FOUND', 'Listing not found', requestId, 404);
  }

  const created = await createListingInquiry(db, {
    id: crypto.randomUUID(),
    listingId: listing.id,
    requesterUserId: principal.userId,
    message: input.message,
    contactName: input.contactName,
    contactPhone: input.contactPhone,
    contactTelegram: input.contactTelegram,
    idempotencyKey: idempotencyKey.trim(),
  });
  if (!created) {
    return errorResponse('INTERNAL_ERROR', 'Failed to create inquiry', requestId, 500);
  }

  return json({ inquiry: toInquiryDto(created) }, 201);
}

export async function listMyListingInquiries(
  env: Env,
  principal: GatewayPrincipal,
  url: URL,
  requestId: string
): Promise<Response> {
  const query = parseMyInquiriesQuery(url.searchParams);
  if (!query) {
    return errorResponse('VALIDATION_ERROR', 'Invalid my-inquiries query parameters', requestId, 400);
  }

  let db;
  try {
    db = getDb(env);
  } catch {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const [items, total] = await Promise.all([
    listMyInquiries(db, {
      requesterUserId: principal.userId,
      status: query.status,
      sort: query.sort,
      limit: query.pageSize,
      offset: query.offset,
    }),
    countMyInquiries(db, {
      requesterUserId: principal.userId,
      status: query.status,
    }),
  ]);

  return json({
    items: items.map(toMyInquiryDto),
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
    },
  });
}
