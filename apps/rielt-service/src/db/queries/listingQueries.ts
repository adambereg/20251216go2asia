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
export type ListingActorRole = 'owner' | 'agent';

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

export type OwnerListingRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  listing_type: string;
  status: 'draft' | 'published' | 'archived';
  price_amount: number | string;
  price_currency: string;
  price_period: string;
  country_id: string;
  city_id: string | null;
  area_text: string | null;
  lat: number | string | null;
  lng: number | string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | string | null;
  amenities: string[] | null;
  created_by_user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  published_at: string | Date | null;
  archived_at: string | Date | null;
  deleted_at: string | Date | null;
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

export interface CreateOwnerListingInput {
  id: string;
  slug: string;
  title: string;
  description: string;
  listingType: string;
  priceAmount: number;
  priceCurrency: string;
  pricePeriod: string;
  countryId: string;
  cityId: string | null;
  areaText: string | null;
  lat: number | null;
  lng: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  amenities: string[];
  createdByUserId: string;
}

export interface CreateListingMediaRelationInput {
  id: string;
  listingId: string;
  mediaId: string;
  sortOrder: number;
  isCover: boolean;
}

export interface PatchOwnerListingInput {
  slugSet: boolean;
  slug: string | null;
  titleSet: boolean;
  title: string | null;
  descriptionSet: boolean;
  description: string | null;
  listingTypeSet: boolean;
  listingType: string | null;
  priceAmountSet: boolean;
  priceAmount: number | null;
  priceCurrencySet: boolean;
  priceCurrency: string | null;
  pricePeriodSet: boolean;
  pricePeriod: string | null;
  countryIdSet: boolean;
  countryId: string | null;
  cityIdSet: boolean;
  cityId: string | null;
  areaTextSet: boolean;
  areaText: string | null;
  latSet: boolean;
  lat: number | null;
  lngSet: boolean;
  lng: number | null;
  bedroomsSet: boolean;
  bedrooms: number | null;
  bathroomsSet: boolean;
  bathrooms: number | null;
  areaSqmSet: boolean;
  areaSqm: number | null;
  amenitiesSet: boolean;
  amenities: string[] | null;
}

export interface ListActorListingsInput {
  actorUserId: string;
  status: 'draft' | 'published' | 'archived' | null;
  sort: ListingSort;
  limit: number;
  offset: number;
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

export async function createOwnerListing(
  db: DbExecutor,
  input: CreateOwnerListingInput
): Promise<OwnerListingRow | null> {
  const result = await db.execute(sql`
    INSERT INTO rielt_listing (
      id,
      slug,
      title,
      description,
      listing_type,
      status,
      price_amount,
      price_currency,
      price_period,
      country_id,
      city_id,
      area_text,
      lat,
      lng,
      bedrooms,
      bathrooms,
      area_sqm,
      amenities,
      created_by_user_id,
      created_at,
      updated_at
    )
    VALUES (
      ${input.id},
      ${input.slug},
      ${input.title},
      ${input.description},
      ${input.listingType},
      'draft',
      ${input.priceAmount},
      ${input.priceCurrency},
      ${input.pricePeriod},
      ${input.countryId},
      ${input.cityId},
      ${input.areaText},
      ${input.lat},
      ${input.lng},
      ${input.bedrooms},
      ${input.bathrooms},
      ${input.areaSqm},
      ${input.amenities},
      ${input.createdByUserId},
      now(),
      now()
    )
    RETURNING
      id,
      slug,
      title,
      description,
      listing_type,
      status,
      price_amount,
      price_currency,
      price_period,
      country_id,
      city_id,
      area_text,
      lat,
      lng,
      bedrooms,
      bathrooms,
      area_sqm,
      amenities,
      created_by_user_id,
      created_at,
      updated_at,
      published_at,
      archived_at,
      deleted_at
  `);

  return rowsOf<OwnerListingRow>(result)[0] ?? null;
}

export async function insertListingActorLink(
  db: DbExecutor,
  input: { id: string; listingId: string; actorUserId: string; actorRole: ListingActorRole }
): Promise<void> {
  await db.execute(sql`
    INSERT INTO rielt_listing_actor_link (
      id,
      listing_id,
      actor_user_id,
      actor_role,
      created_at
    )
    VALUES (
      ${input.id},
      ${input.listingId},
      ${input.actorUserId},
      ${input.actorRole}::listing_actor_role,
      now()
    )
    ON CONFLICT DO NOTHING
  `);
}

export async function insertListingMediaRelations(
  db: DbExecutor,
  input: CreateListingMediaRelationInput[]
): Promise<void> {
  for (const row of input) {
    await db.execute(sql`
      INSERT INTO rielt_listing_media (
        id,
        listing_id,
        media_id,
        sort_order,
        is_cover,
        created_at
      )
      VALUES (
        ${row.id},
        ${row.listingId},
        ${row.mediaId},
        ${row.sortOrder},
        ${row.isCover},
        now()
      )
    `);
  }
}

export async function getListingByIdForManage(db: DbExecutor, listingId: string): Promise<OwnerListingRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      slug,
      title,
      description,
      listing_type,
      status,
      price_amount,
      price_currency,
      price_period,
      country_id,
      city_id,
      area_text,
      lat,
      lng,
      bedrooms,
      bathrooms,
      area_sqm,
      amenities,
      created_by_user_id,
      created_at,
      updated_at,
      published_at,
      archived_at,
      deleted_at
    FROM rielt_listing
    WHERE id = ${listingId}
      AND deleted_at IS NULL
    LIMIT 1
  `);

  return rowsOf<OwnerListingRow>(result)[0] ?? null;
}

export async function getActiveActorRoleForListing(
  db: DbExecutor,
  input: { listingId: string; actorUserId: string }
): Promise<ListingActorRole | null> {
  const result = await db.execute(sql`
    SELECT actor_role
    FROM rielt_listing_actor_link
    WHERE listing_id = ${input.listingId}
      AND actor_user_id = ${input.actorUserId}
      AND revoked_at IS NULL
      AND deleted_at IS NULL
    LIMIT 1
  `);

  return (rowsOf<{ actor_role: ListingActorRole }>(result)[0]?.actor_role ?? null) as ListingActorRole | null;
}

export async function patchOwnerListingById(
  db: DbExecutor,
  input: { listingId: string; patch: PatchOwnerListingInput }
): Promise<OwnerListingRow | null> {
  const p = input.patch;
  const result = await db.execute(sql`
    UPDATE rielt_listing
    SET
      slug = CASE WHEN ${p.slugSet}::boolean THEN ${p.slug} ELSE slug END,
      title = CASE WHEN ${p.titleSet}::boolean THEN ${p.title} ELSE title END,
      description = CASE WHEN ${p.descriptionSet}::boolean THEN ${p.description} ELSE description END,
      listing_type = CASE WHEN ${p.listingTypeSet}::boolean THEN ${p.listingType} ELSE listing_type END,
      price_amount = CASE WHEN ${p.priceAmountSet}::boolean THEN ${p.priceAmount} ELSE price_amount END,
      price_currency = CASE WHEN ${p.priceCurrencySet}::boolean THEN ${p.priceCurrency} ELSE price_currency END,
      price_period = CASE WHEN ${p.pricePeriodSet}::boolean THEN ${p.pricePeriod} ELSE price_period END,
      country_id = CASE WHEN ${p.countryIdSet}::boolean THEN ${p.countryId} ELSE country_id END,
      city_id = CASE WHEN ${p.cityIdSet}::boolean THEN ${p.cityId} ELSE city_id END,
      area_text = CASE WHEN ${p.areaTextSet}::boolean THEN ${p.areaText} ELSE area_text END,
      lat = CASE WHEN ${p.latSet}::boolean THEN ${p.lat} ELSE lat END,
      lng = CASE WHEN ${p.lngSet}::boolean THEN ${p.lng} ELSE lng END,
      bedrooms = CASE WHEN ${p.bedroomsSet}::boolean THEN ${p.bedrooms} ELSE bedrooms END,
      bathrooms = CASE WHEN ${p.bathroomsSet}::boolean THEN ${p.bathrooms} ELSE bathrooms END,
      area_sqm = CASE WHEN ${p.areaSqmSet}::boolean THEN ${p.areaSqm} ELSE area_sqm END,
      amenities = CASE WHEN ${p.amenitiesSet}::boolean THEN ${p.amenities} ELSE amenities END,
      updated_at = now()
    WHERE id = ${input.listingId}
      AND deleted_at IS NULL
    RETURNING
      id,
      slug,
      title,
      description,
      listing_type,
      status,
      price_amount,
      price_currency,
      price_period,
      country_id,
      city_id,
      area_text,
      lat,
      lng,
      bedrooms,
      bathrooms,
      area_sqm,
      amenities,
      created_by_user_id,
      created_at,
      updated_at,
      published_at,
      archived_at,
      deleted_at
  `);

  return rowsOf<OwnerListingRow>(result)[0] ?? null;
}

export async function archiveListingById(db: DbExecutor, listingId: string): Promise<OwnerListingRow | null> {
  const result = await db.execute(sql`
    UPDATE rielt_listing
    SET
      status = 'archived',
      archived_at = COALESCE(archived_at, now()),
      updated_at = now()
    WHERE id = ${listingId}
      AND deleted_at IS NULL
    RETURNING
      id,
      slug,
      title,
      description,
      listing_type,
      status,
      price_amount,
      price_currency,
      price_period,
      country_id,
      city_id,
      area_text,
      lat,
      lng,
      bedrooms,
      bathrooms,
      area_sqm,
      amenities,
      created_by_user_id,
      created_at,
      updated_at,
      published_at,
      archived_at,
      deleted_at
  `);

  return rowsOf<OwnerListingRow>(result)[0] ?? null;
}

export async function listActorVisibleListings(
  db: DbExecutor,
  input: ListActorListingsInput
): Promise<OwnerListingRow[]> {
  const sortSql =
    input.sort === 'price_asc'
      ? sql`l.price_amount ASC, l.id ASC`
      : input.sort === 'price_desc'
        ? sql`l.price_amount DESC, l.id DESC`
        : sql`l.updated_at DESC, l.id DESC`;

  const result = await db.execute(sql`
    SELECT
      l.id,
      l.slug,
      l.title,
      l.description,
      l.listing_type,
      l.status,
      l.price_amount,
      l.price_currency,
      l.price_period,
      l.country_id,
      l.city_id,
      l.area_text,
      l.lat,
      l.lng,
      l.bedrooms,
      l.bathrooms,
      l.area_sqm,
      l.amenities,
      l.created_by_user_id,
      l.created_at,
      l.updated_at,
      l.published_at,
      l.archived_at,
      l.deleted_at
    FROM rielt_listing l
    WHERE l.deleted_at IS NULL
      AND (${input.status}::listing_status IS NULL OR l.status = ${input.status}::listing_status)
      AND EXISTS (
        SELECT 1
        FROM rielt_listing_actor_link al
        WHERE al.listing_id = l.id
          AND al.actor_user_id = ${input.actorUserId}
          AND al.revoked_at IS NULL
          AND al.deleted_at IS NULL
      )
    ORDER BY ${sortSql}
    LIMIT ${input.limit}
    OFFSET ${input.offset}
  `);

  return rowsOf<OwnerListingRow>(result);
}

export async function countActorVisibleListings(
  db: DbExecutor,
  input: Omit<ListActorListingsInput, 'sort' | 'limit' | 'offset'>
): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM rielt_listing l
    WHERE l.deleted_at IS NULL
      AND (${input.status}::listing_status IS NULL OR l.status = ${input.status}::listing_status)
      AND EXISTS (
        SELECT 1
        FROM rielt_listing_actor_link al
        WHERE al.listing_id = l.id
          AND al.actor_user_id = ${input.actorUserId}
          AND al.revoked_at IS NULL
          AND al.deleted_at IS NULL
      )
  `);

  return rowsOf<CountRow>(result)[0]?.total ?? 0;
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
