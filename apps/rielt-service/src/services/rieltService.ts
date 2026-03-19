import {
  countPublishedListingsNearby,
  countPublishedListings,
  getDb,
  listPublishedListingsNearby,
  getPublishedListingByIdOrSlug,
  listPublishedListings,
  type NearbyListingRow,
  type PublicListingRow,
} from '../db/queries/listingQueries';
import { errorResponse, json } from '../middleware/http';
import { parseListListingsQuery, parseNearbyListingsQuery } from '../validation/rielt';

type Env = {
  DATABASE_URL?: string;
};

function asIso(value: string | Date | null): string | null {
  if (!value) return null;
  return new Date(value).toISOString();
}

function toNumber(value: number | string | null): number | null {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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
