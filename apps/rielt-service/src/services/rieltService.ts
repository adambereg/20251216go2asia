import {
  archiveListingById,
  countActorVisibleListings,
  countPublishedListingsNearby,
  countPublishedListings,
  createOwnerListing,
  getActiveActorRoleForListing,
  getDb,
  getListingByIdForManage,
  getPublishedListingByIdOrSlug,
  insertListingActorLink,
  insertListingMediaRelations,
  listActorVisibleListings,
  listPublishedListingsNearby,
  listPublishedListings,
  patchOwnerListingById,
  type NearbyListingRow,
  type OwnerListingRow,
  type PatchOwnerListingInput,
  type PublicListingRow,
} from '../db/queries/listingQueries';
import type { GatewayPrincipal } from '../middleware/auth';
import { errorResponse, json } from '../middleware/http';
import {
  parseCreateListingInput,
  parseListListingsQuery,
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

  const listingId = crypto.randomUUID();
  try {
    const created = await createOwnerListing(db, {
      id: listingId,
      slug: input.slug,
      title: input.title,
      description: input.description,
      listingType: input.listingType,
      priceAmount: input.priceAmount,
      priceCurrency: input.priceCurrency,
      pricePeriod: input.pricePeriod,
      countryId: input.countryId,
      cityId: input.cityId,
      areaText: input.areaText,
      lat: input.lat,
      lng: input.lng,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      areaSqm: input.areaSqm,
      amenities: input.amenities,
      createdByUserId: principal.userId,
    });
    if (!created) {
      return errorResponse('INTERNAL_ERROR', 'Failed to create listing', requestId, 500);
    }

    await insertListingActorLink(db, {
      id: crypto.randomUUID(),
      listingId,
      actorUserId: principal.userId,
      actorRole: 'owner',
    });

    if (input.media.length > 0) {
      await insertListingMediaRelations(
        db,
        input.media.map((item) => ({
          id: crypto.randomUUID(),
          listingId,
          mediaId: item.mediaId,
          sortOrder: item.sortOrder,
          isCover: item.isCover,
        }))
      );
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
