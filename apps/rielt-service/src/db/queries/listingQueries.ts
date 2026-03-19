import type { Db } from '@go2asia/db';
import { createDb, sql } from '@go2asia/db';

export interface DbEnv {
  DATABASE_URL?: string;
}

export function getDb(env: DbEnv): ReturnType<typeof createDb> {
  if (!env.DATABASE_URL || env.DATABASE_URL.trim().length === 0) {
    throw new Error('DATABASE_URL is required');
  }
  return createDb(env.DATABASE_URL);
}

type DbExecutor = Pick<Db, 'execute'>;

export type ListingSort = 'newest' | 'price_asc' | 'price_desc';

export type PublicListingRow = {
  id: string;
  slug: string;
  title: string;
  listing_type: string;
  price_amount: number | string;
  price_currency: string;
  price_period: string;
  country_id: string;
  city_id: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | string | null;
  created_at: string | Date;
  updated_at: string | Date;
  published_at: string | Date | null;
};

export type NearbyListingRow = PublicListingRow & {
  distance_meters: number | string;
};

type CountRow = { total: number };

function rowsOf<T>(result: unknown): T[] {
  return ((result as { rows?: T[] } | null)?.rows ?? []) as T[];
}

export interface ListPublishedListingsInput {
  countryId: string | null;
  cityId: string | null;
  listingType: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  bedroomsMin: number | null;
  bedroomsMax: number | null;
  sort: ListingSort;
  limit: number;
  offset: number;
}

export async function listPublishedListings(
  db: DbExecutor,
  input: ListPublishedListingsInput
): Promise<PublicListingRow[]> {
  const sortSql =
    input.sort === 'price_asc'
      ? sql`price_amount ASC, id ASC`
      : input.sort === 'price_desc'
        ? sql`price_amount DESC, id DESC`
        : sql`published_at DESC NULLS LAST, updated_at DESC, id DESC`;

  const result = await db.execute(sql`
    SELECT
      id,
      slug,
      title,
      listing_type,
      price_amount,
      price_currency,
      price_period,
      country_id,
      city_id,
      bedrooms,
      bathrooms,
      area_sqm,
      created_at,
      updated_at,
      published_at
    FROM rielt_listing
    WHERE status = 'published'
      AND archived_at IS NULL
      AND deleted_at IS NULL
      AND (${input.countryId}::text IS NULL OR country_id = ${input.countryId})
      AND (${input.cityId}::text IS NULL OR city_id = ${input.cityId})
      AND (${input.listingType}::text IS NULL OR listing_type = ${input.listingType})
      AND (${input.minPrice}::numeric IS NULL OR price_amount >= ${input.minPrice})
      AND (${input.maxPrice}::numeric IS NULL OR price_amount <= ${input.maxPrice})
      AND (${input.bedroomsMin}::int IS NULL OR bedrooms >= ${input.bedroomsMin})
      AND (${input.bedroomsMax}::int IS NULL OR bedrooms <= ${input.bedroomsMax})
    ORDER BY ${sortSql}
    LIMIT ${input.limit}
    OFFSET ${input.offset}
  `);

  return rowsOf<PublicListingRow>(result);
}

export async function countPublishedListings(
  db: DbExecutor,
  input: Omit<ListPublishedListingsInput, 'sort' | 'limit' | 'offset'>
): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM rielt_listing
    WHERE status = 'published'
      AND archived_at IS NULL
      AND deleted_at IS NULL
      AND (${input.countryId}::text IS NULL OR country_id = ${input.countryId})
      AND (${input.cityId}::text IS NULL OR city_id = ${input.cityId})
      AND (${input.listingType}::text IS NULL OR listing_type = ${input.listingType})
      AND (${input.minPrice}::numeric IS NULL OR price_amount >= ${input.minPrice})
      AND (${input.maxPrice}::numeric IS NULL OR price_amount <= ${input.maxPrice})
      AND (${input.bedroomsMin}::int IS NULL OR bedrooms >= ${input.bedroomsMin})
      AND (${input.bedroomsMax}::int IS NULL OR bedrooms <= ${input.bedroomsMax})
  `);

  return rowsOf<CountRow>(result)[0]?.total ?? 0;
}

export async function getPublishedListingByIdOrSlug(
  db: DbExecutor,
  idOrSlug: string
): Promise<PublicListingRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      slug,
      title,
      listing_type,
      price_amount,
      price_currency,
      price_period,
      country_id,
      city_id,
      bedrooms,
      bathrooms,
      area_sqm,
      created_at,
      updated_at,
      published_at
    FROM rielt_listing
    WHERE status = 'published'
      AND archived_at IS NULL
      AND deleted_at IS NULL
      AND (id = ${idOrSlug} OR slug = ${idOrSlug})
    LIMIT 1
  `);

  return rowsOf<PublicListingRow>(result)[0] ?? null;
}

export interface ListNearbyListingsInput {
  lat: number;
  lng: number;
  radiusKm: number;
  countryId: string | null;
  cityId: string | null;
  listingType: string | null;
  limit: number;
  offset: number;
}

export async function listPublishedListingsNearby(
  db: DbExecutor,
  input: ListNearbyListingsInput
): Promise<NearbyListingRow[]> {
  const result = await db.execute(sql`
    WITH p AS (
      SELECT
        ${input.lat}::double precision AS lat,
        ${input.lng}::double precision AS lng,
        ${input.radiusKm}::double precision AS radius_km
    ),
    base AS (
      SELECT l.*
      FROM rielt_listing l, p
      WHERE l.status = 'published'
        AND l.archived_at IS NULL
        AND l.deleted_at IS NULL
        AND l.lat IS NOT NULL
        AND l.lng IS NOT NULL
        AND (${input.countryId}::text IS NULL OR l.country_id = ${input.countryId})
        AND (${input.cityId}::text IS NULL OR l.city_id = ${input.cityId})
        AND (${input.listingType}::text IS NULL OR l.listing_type = ${input.listingType})
        AND l.lat::double precision BETWEEN p.lat - (p.radius_km / 111.32)
                                       AND p.lat + (p.radius_km / 111.32)
        AND l.lng::double precision BETWEEN p.lng - (p.radius_km / (111.32 * greatest(0.01, abs(cos(radians(p.lat))))))
                                       AND p.lng + (p.radius_km / (111.32 * greatest(0.01, abs(cos(radians(p.lat))))))
    ),
    scored AS (
      SELECT
        b.id,
        b.slug,
        b.title,
        b.listing_type,
        b.price_amount,
        b.price_currency,
        b.price_period,
        b.country_id,
        b.city_id,
        b.bedrooms,
        b.bathrooms,
        b.area_sqm,
        b.created_at,
        b.updated_at,
        b.published_at,
        2.0 * 6371000.0 * asin(
          sqrt(
            least(
              1.0,
              greatest(
                0.0,
                power(sin(radians((b.lat::double precision - p.lat) / 2.0)), 2) +
                cos(radians(p.lat)) * cos(radians(b.lat::double precision)) *
                power(sin(radians((b.lng::double precision - p.lng) / 2.0)), 2)
              )
            )
          )
        ) AS distance_meters
      FROM base b, p
    )
    SELECT *
    FROM scored
    WHERE distance_meters <= (SELECT radius_km * 1000.0 FROM p)
    ORDER BY distance_meters ASC, published_at DESC NULLS LAST, id ASC
    LIMIT ${input.limit}
    OFFSET ${input.offset}
  `);

  return rowsOf<NearbyListingRow>(result);
}

export async function countPublishedListingsNearby(
  db: DbExecutor,
  input: Omit<ListNearbyListingsInput, 'limit' | 'offset'>
): Promise<number> {
  const result = await db.execute(sql`
    WITH p AS (
      SELECT
        ${input.lat}::double precision AS lat,
        ${input.lng}::double precision AS lng,
        ${input.radiusKm}::double precision AS radius_km
    ),
    base AS (
      SELECT l.lat, l.lng
      FROM rielt_listing l, p
      WHERE l.status = 'published'
        AND l.archived_at IS NULL
        AND l.deleted_at IS NULL
        AND l.lat IS NOT NULL
        AND l.lng IS NOT NULL
        AND (${input.countryId}::text IS NULL OR l.country_id = ${input.countryId})
        AND (${input.cityId}::text IS NULL OR l.city_id = ${input.cityId})
        AND (${input.listingType}::text IS NULL OR l.listing_type = ${input.listingType})
        AND l.lat::double precision BETWEEN p.lat - (p.radius_km / 111.32)
                                       AND p.lat + (p.radius_km / 111.32)
        AND l.lng::double precision BETWEEN p.lng - (p.radius_km / (111.32 * greatest(0.01, abs(cos(radians(p.lat))))))
                                       AND p.lng + (p.radius_km / (111.32 * greatest(0.01, abs(cos(radians(p.lat))))))
    ),
    scored AS (
      SELECT
        2.0 * 6371000.0 * asin(
          sqrt(
            least(
              1.0,
              greatest(
                0.0,
                power(sin(radians((b.lat::double precision - p.lat) / 2.0)), 2) +
                cos(radians(p.lat)) * cos(radians(b.lat::double precision)) *
                power(sin(radians((b.lng::double precision - p.lng) / 2.0)), 2)
              )
            )
          )
        ) AS distance_meters
      FROM base b, p
    )
    SELECT COUNT(*)::int AS total
    FROM scored
    WHERE distance_meters <= (SELECT radius_km * 1000.0 FROM p)
  `);

  return rowsOf<CountRow>(result)[0]?.total ?? 0;
}
