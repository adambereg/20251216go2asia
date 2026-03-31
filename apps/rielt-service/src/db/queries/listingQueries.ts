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
  atlas_place_id: string | null;
  atlas_container_place_id: string | null;
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
  atlas_place_id: string | null;
  atlas_container_place_id: string | null;
  rf_partner_id: string | null;
  rf_offer_id: string | null;
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

export type InquiryRow = {
  id: string;
  listing_id: string;
  requester_user_id: string;
  message: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_telegram: string | null;
  status: 'new' | 'viewed' | 'closed';
  idempotency_key: string;
  created_at: string | Date;
  closed_at: string | Date | null;
};

export type MyInquiryRow = InquiryRow & {
  listing_slug: string;
  listing_title: string;
  listing_country_id: string;
  listing_city_id: string | null;
  listing_atlas_place_id: string | null;
  listing_atlas_container_place_id: string | null;
};

type CountRow = { total: number };

function rowsOf<T>(result: unknown): T[] {
  return ((result as { rows?: T[] } | null)?.rows ?? []) as T[];
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

export type AtlasGeoLinkValidationInput = {
  countryId: string;
  cityId: string | null;
  atlasPlaceId: string | null;
  atlasContainerPlaceId: string | null;
};

export type AtlasGeoLinkValidationResult = { ok: true } | { ok: false; code: string; message: string };

export async function validateAtlasGeoLinks(
  db: DbExecutor,
  input: AtlasGeoLinkValidationInput
): Promise<AtlasGeoLinkValidationResult> {
  if (input.atlasPlaceId !== null) {
    const place = await getAtlasPlaceReference(db, input.atlasPlaceId);
    if (!place) {
      return {
        ok: false,
        code: 'RIELT_INVALID_ATLAS_PLACE_ID',
        message: 'atlas_place_id is not found in Atlas places',
      };
    }
    if (place.country_id !== input.countryId) {
      return {
        ok: false,
        code: 'RIELT_ATLAS_PLACE_GEO_MISMATCH',
        message: 'atlas_place_id must belong to the same country_id',
      };
    }
    if (input.cityId !== null && place.city_id !== input.cityId) {
      return {
        ok: false,
        code: 'RIELT_ATLAS_PLACE_GEO_MISMATCH',
        message: 'atlas_place_id must belong to the same city_id',
      };
    }
  }

  if (input.atlasContainerPlaceId !== null) {
    const container = await getAtlasPlaceReference(db, input.atlasContainerPlaceId);
    if (!container) {
      return {
        ok: false,
        code: 'RIELT_INVALID_ATLAS_CONTAINER_PLACE_ID',
        message: 'atlas_container_place_id is not found in Atlas places',
      };
    }
    if (container.country_id !== input.countryId) {
      return {
        ok: false,
        code: 'RIELT_ATLAS_CONTAINER_GEO_MISMATCH',
        message: 'atlas_container_place_id must belong to the same country_id',
      };
    }
    if (input.cityId !== null && container.city_id !== input.cityId) {
      return {
        ok: false,
        code: 'RIELT_ATLAS_CONTAINER_GEO_MISMATCH',
        message: 'atlas_container_place_id must belong to the same city_id',
      };
    }
  }

  if (
    input.atlasPlaceId !== null &&
    input.atlasContainerPlaceId !== null &&
    input.atlasPlaceId === input.atlasContainerPlaceId
  ) {
    return {
      ok: false,
      code: 'RIELT_ATLAS_PLACE_CONFLICT',
      message: 'atlas_place_id and atlas_container_place_id must reference different Atlas places',
    };
  }

  return { ok: true };
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
  atlasPlaceId: string | null;
  atlasContainerPlaceId: string | null;
  rfPartnerId: string | null;
  rfOfferId: string | null;
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
  atlasPlaceIdSet: boolean;
  atlasPlaceId: string | null;
  atlasContainerPlaceIdSet: boolean;
  atlasContainerPlaceId: string | null;
  rfPartnerIdSet: boolean;
  rfPartnerId: string | null;
  rfOfferIdSet: boolean;
  rfOfferId: string | null;
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
  statusSet: boolean;
  status: 'draft' | 'published' | null;
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

export interface CreateListingInquiryInput {
  id: string;
  listingId: string;
  requesterUserId: string;
  message: string;
  contactName: string | null;
  contactPhone: string | null;
  contactTelegram: string | null;
  idempotencyKey: string;
}

export interface ListMyInquiriesInput {
  requesterUserId: string;
  status: 'new' | 'viewed' | 'closed' | null;
  sort: 'newest' | 'oldest';
  limit: number;
  offset: number;
}

export async function createOwnerListing(
  db: DbExecutor,
  input: CreateOwnerListingInput & { ownerLinkId: string; media: CreateListingMediaRelationInput[] }
): Promise<OwnerListingRow | null> {
  const mediaJson = JSON.stringify(
    input.media.map((row) => ({
      id: row.id,
      media_id: row.mediaId,
      sort_order: row.sortOrder,
      is_cover: row.isCover,
    }))
  );

  const result = await db.execute(sql`
    WITH inserted_listing AS (
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
        atlas_place_id,
        atlas_container_place_id,
        rf_partner_id,
        rf_offer_id,
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
        ${input.atlasPlaceId},
        ${input.atlasContainerPlaceId},
        ${input.rfPartnerId},
        ${input.rfOfferId},
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
      RETURNING *
    ),
    inserted_owner_link AS (
      INSERT INTO rielt_listing_actor_link (
        id,
        listing_id,
        actor_user_id,
        actor_role,
        created_at
      )
      SELECT
        ${input.ownerLinkId},
        l.id,
        ${input.createdByUserId},
        'owner'::listing_actor_role,
        now()
      FROM inserted_listing l
      RETURNING id
    ),
    inserted_media AS (
      INSERT INTO rielt_listing_media (
        id,
        listing_id,
        media_id,
        sort_order,
        is_cover,
        created_at
      )
      SELECT
        m.id,
        ${input.id},
        m.media_id,
        m.sort_order,
        m.is_cover,
        now()
      FROM jsonb_to_recordset(${mediaJson}::jsonb) AS m(
        id text,
        media_id text,
        sort_order integer,
        is_cover boolean
      )
      RETURNING id
    )
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
      l.atlas_place_id,
      l.atlas_container_place_id,
      l.rf_partner_id,
      l.rf_offer_id,
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
    FROM inserted_listing l
    WHERE EXISTS (SELECT 1 FROM inserted_owner_link)
  `);

  return rowsOf<OwnerListingRow>(result)[0] ?? null;
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
      atlas_place_id,
      atlas_container_place_id,
      rf_partner_id,
      rf_offer_id,
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
      atlas_place_id = CASE WHEN ${p.atlasPlaceIdSet}::boolean THEN ${p.atlasPlaceId} ELSE atlas_place_id END,
      atlas_container_place_id = CASE WHEN ${p.atlasContainerPlaceIdSet}::boolean THEN ${p.atlasContainerPlaceId} ELSE atlas_container_place_id END,
      rf_partner_id = CASE WHEN ${p.rfPartnerIdSet}::boolean THEN ${p.rfPartnerId} ELSE rf_partner_id END,
      rf_offer_id = CASE WHEN ${p.rfOfferIdSet}::boolean THEN ${p.rfOfferId} ELSE rf_offer_id END,
      area_text = CASE WHEN ${p.areaTextSet}::boolean THEN ${p.areaText} ELSE area_text END,
      lat = CASE WHEN ${p.latSet}::boolean THEN ${p.lat} ELSE lat END,
      lng = CASE WHEN ${p.lngSet}::boolean THEN ${p.lng} ELSE lng END,
      bedrooms = CASE WHEN ${p.bedroomsSet}::boolean THEN ${p.bedrooms} ELSE bedrooms END,
      bathrooms = CASE WHEN ${p.bathroomsSet}::boolean THEN ${p.bathrooms} ELSE bathrooms END,
      area_sqm = CASE WHEN ${p.areaSqmSet}::boolean THEN ${p.areaSqm} ELSE area_sqm END,
      amenities = CASE WHEN ${p.amenitiesSet}::boolean THEN ${p.amenities} ELSE amenities END,
      status = CASE WHEN ${p.statusSet}::boolean THEN ${p.status}::listing_status ELSE status END,
      published_at = CASE
        WHEN ${p.statusSet}::boolean AND ${p.status}::listing_status = 'published' THEN COALESCE(published_at, now())
        WHEN ${p.statusSet}::boolean AND ${p.status}::listing_status = 'draft' THEN NULL
        ELSE published_at
      END,
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
      atlas_place_id,
      atlas_container_place_id,
      rf_partner_id,
      rf_offer_id,
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
      atlas_place_id,
      atlas_container_place_id,
      rf_partner_id,
      rf_offer_id,
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
      l.atlas_place_id,
      l.atlas_container_place_id,
      l.rf_partner_id,
      l.rf_offer_id,
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
      atlas_place_id,
      atlas_container_place_id,
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
      atlas_place_id,
      atlas_container_place_id,
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
        b.atlas_place_id,
        b.atlas_container_place_id,
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

export async function createListingInquiry(
  db: DbExecutor,
  input: CreateListingInquiryInput
): Promise<InquiryRow | null> {
  const result = await db.execute(sql`
    WITH inserted AS (
      INSERT INTO rielt_listing_inquiry (
        id,
        listing_id,
        requester_user_id,
        message,
        contact_name,
        contact_phone,
        contact_telegram,
        status,
        idempotency_key,
        created_at
      )
      VALUES (
        ${input.id},
        ${input.listingId},
        ${input.requesterUserId},
        ${input.message},
        ${input.contactName},
        ${input.contactPhone},
        ${input.contactTelegram},
        'new',
        ${input.idempotencyKey},
        now()
      )
      ON CONFLICT (requester_user_id, listing_id, idempotency_key) DO NOTHING
      RETURNING
        id,
        listing_id,
        requester_user_id,
        message,
        contact_name,
        contact_phone,
        contact_telegram,
        status,
        idempotency_key,
        created_at,
        closed_at
    )
    SELECT
      i.id,
      i.listing_id,
      i.requester_user_id,
      i.message,
      i.contact_name,
      i.contact_phone,
      i.contact_telegram,
      i.status,
      i.idempotency_key,
      i.created_at,
      i.closed_at
    FROM inserted i
    UNION ALL
    SELECT
      q.id,
      q.listing_id,
      q.requester_user_id,
      q.message,
      q.contact_name,
      q.contact_phone,
      q.contact_telegram,
      q.status,
      q.idempotency_key,
      q.created_at,
      q.closed_at
    FROM rielt_listing_inquiry q
    WHERE q.requester_user_id = ${input.requesterUserId}
      AND q.listing_id = ${input.listingId}
      AND q.idempotency_key = ${input.idempotencyKey}
      AND q.deleted_at IS NULL
      AND NOT EXISTS (SELECT 1 FROM inserted)
    LIMIT 1
  `);

  return rowsOf<InquiryRow>(result)[0] ?? null;
}

export async function listMyInquiries(db: DbExecutor, input: ListMyInquiriesInput): Promise<MyInquiryRow[]> {
  const sortSql = input.sort === 'oldest' ? sql`q.created_at ASC, q.id ASC` : sql`q.created_at DESC, q.id DESC`;
  const result = await db.execute(sql`
    SELECT
      q.id,
      q.listing_id,
      q.requester_user_id,
      q.message,
      q.contact_name,
      q.contact_phone,
      q.contact_telegram,
      q.status,
      q.idempotency_key,
      q.created_at,
      q.closed_at,
      l.slug AS listing_slug,
      l.title AS listing_title,
      l.country_id AS listing_country_id,
      l.city_id AS listing_city_id
      ,
      l.atlas_place_id AS listing_atlas_place_id,
      l.atlas_container_place_id AS listing_atlas_container_place_id
    FROM rielt_listing_inquiry q
    JOIN rielt_listing l
      ON l.id = q.listing_id
     AND l.deleted_at IS NULL
    WHERE q.requester_user_id = ${input.requesterUserId}
      AND q.deleted_at IS NULL
      AND (${input.status}::listing_inquiry_status IS NULL OR q.status = ${input.status}::listing_inquiry_status)
    ORDER BY ${sortSql}
    LIMIT ${input.limit}
    OFFSET ${input.offset}
  `);
  return rowsOf<MyInquiryRow>(result);
}

export async function countMyInquiries(
  db: DbExecutor,
  input: Omit<ListMyInquiriesInput, 'sort' | 'limit' | 'offset'>
): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM rielt_listing_inquiry q
    JOIN rielt_listing l
      ON l.id = q.listing_id
     AND l.deleted_at IS NULL
    WHERE q.requester_user_id = ${input.requesterUserId}
      AND q.deleted_at IS NULL
      AND (${input.status}::listing_inquiry_status IS NULL OR q.status = ${input.status}::listing_inquiry_status)
  `);

  return rowsOf<CountRow>(result)[0]?.total ?? 0;
}
