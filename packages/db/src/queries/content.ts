/**
 * Raw SQL queries for content (no Drizzle).
 * 
 * Used for Workers-compatible data access.
 * Uses Neon HTTP driver directly.
 */

import { neon, NeonQueryFunction } from '@neondatabase/serverless';

export type SqlClient = NeonQueryFunction<false, false>;

/**
 * Create a raw SQL client (no Drizzle)
 */
export function createSqlClient(databaseUrl: string): SqlClient {
  return neon(databaseUrl);
}

// ============================================================================
// Guide Engine v1 queries are in ./guides.ts
// (kept separate to avoid bloating this file and to keep content vs guides distinct)
// ============================================================================

// ============================================================================
// Types (matching frontend DTOs)
// ============================================================================

export interface EventRow {
  id: string;
  title: string;
  slug: string;
  description: string | null; // markdown body for imported Pulse events
  short_description: string | null;
  category: string | null;
  country_slug: string | null;
  city_slug: string | null;
  country_name: string | null;
  city_name: string | null;
  year: number | null;
  start_at: string | null;
  start_date: string;
  end_at: string | null;
  end_date: string | null;
  location: string | null;
  lat: string | null;
  lng: string | null;
  hero_media_key: string | null;
  gallery_media_keys: unknown | null; // jsonb (string[])
  // Legacy/compat: some internal resolvers (e.g. guide feeds) still select a public image URL.
  image_url: string | null;
  is_free: boolean;
  price_amount: string | null;
  price_currency: string | null;
  is_verified: boolean;
  official_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  geo_scope: string | null;
  primary_type: string | null;
  secondary_type: string | null;
  source_md_path: string | null;
  status: string;
}

export interface CountryRow {
  id: string;
  slug: string;
  name: string;
  code: string;
  flag_emoji: string | null;
  description_short: string | null;
  hero_url: string | null;
  cities_count: number;
  places_count: number;
}

export interface CityRow {
  id: string;
  slug: string;
  name: string;
  country_id: string;
  country_name: string | null;
  description_short: string | null;
  lat: string | null;
  lng: string | null;
  hero_url: string | null;
  places_count: number;
}

export interface PlaceRow {
  id: string;
  slug: string;
  name: string;
  type: string;
  place_kind: string;
  category: string | null;
  tags: string | null; // JSON
  website: string | null;
  phone: string | null;
  instagram: string | null;
  google_maps_url: string | null;
  price_level: string | null;
  description_short: string | null;
  country_name: string | null;
  city_name: string | null;
  country_id: string | null;
  city_id: string | null;
  address: string | null;
  lat: string | null;
  lng: string | null;
  hero_url: string | null;
  images: string | null; // JSON
}

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  tags: string | null; // JSON
  cover_url: string | null;
  published_at: string | null;
  status: string;
}

export interface ContentBlockRow {
  id: string;
  entity_type: string;
  entity_id: string;
  tab_key: string;
  lang: string;
  title: string | null;
  body_markdown: string;
  updated_at: string;
}

// ============================================================================
// Queries
// ============================================================================

export type ListEventsParams = {
  limit?: number;
  offset?: number;
  country?: string; // slug or legacy id
  city?: string; // slug or legacy id
  category?: string;
  date_from?: string; // ISO date/datetime
  date_to?: string; // ISO date/datetime
  price?: 'free' | 'paid' | 'any';
  verified?: 'true' | 'false' | 'any';
  q?: string;
};

/**
 * List events (active only, ordered by start date) with basic filters + pagination.
 */
export async function listEvents(
  sql: SqlClient,
  params?: ListEventsParams
): Promise<{ items: EventRow[]; total: number }> {
  const limit = Math.min(200, Math.max(1, Number(params?.limit ?? 50) || 50));
  const offset = Math.max(0, Number(params?.offset ?? 0) || 0);

  const country = typeof params?.country === 'string' && params.country.trim() ? params.country.trim() : null;
  const city = typeof params?.city === 'string' && params.city.trim() ? params.city.trim() : null;
  const category = typeof params?.category === 'string' && params.category.trim() ? params.category.trim() : null;

  const dateFrom = typeof params?.date_from === 'string' && params.date_from.trim() ? params.date_from.trim() : null;
  const dateTo = typeof params?.date_to === 'string' && params.date_to.trim() ? params.date_to.trim() : null;

  const qRaw = typeof params?.q === 'string' ? params.q.trim() : '';
  const q = qRaw.length > 0 ? qRaw : null;

  const priceRaw = (params?.price ?? 'any').toLowerCase();
  const price: 'free' | 'paid' | 'any' = priceRaw === 'free' || priceRaw === 'paid' ? (priceRaw as any) : 'any';

  const verifiedRaw = (params?.verified ?? 'any').toLowerCase();
  const verified: 'true' | 'false' | 'any' =
    verifiedRaw === 'true' || verifiedRaw === 'false' ? (verifiedRaw as any) : 'any';

  const whereStatus = 'active';

  const totalRows = await sql`
    SELECT COUNT(*)::int AS total
    FROM events e
    WHERE e.status = ${whereStatus}::event_status
      AND (${country}::text IS NULL OR e.country_slug = ${country} OR e.country_id = ${country})
      AND (${city}::text IS NULL OR e.city_slug = ${city} OR e.city_id = ${city})
      AND (${category}::text IS NULL OR e.category = ${category})
      AND (
        ${dateFrom}::timestamptz IS NULL
        OR COALESCE(e.end_at, e.end_date::timestamptz, e.start_at, e.start_date::timestamptz) >= ${dateFrom}::timestamptz
      )
      AND (
        ${dateTo}::timestamptz IS NULL
        OR COALESCE(e.start_at, e.start_date::timestamptz) <= ${dateTo}::timestamptz
      )
      AND (
        ${price}::text = 'any'
        OR (${price}::text = 'free' AND e.is_free = true)
        OR (${price}::text = 'paid' AND e.is_free = false)
      )
      AND (
        ${verified}::text = 'any'
        OR (${verified}::text = 'true' AND e.is_verified = true)
        OR (${verified}::text = 'false' AND e.is_verified = false)
      )
      AND (
        ${q}::text IS NULL
        OR (
          e.title ILIKE ('%' || ${q} || '%')
          OR COALESCE(e.short_description, e.description, '') ILIKE ('%' || ${q} || '%')
        )
      )
  `;

  const total = (totalRows[0] as { total?: number } | undefined)?.total ?? 0;

  const rows = await sql`
    SELECT 
      e.id,
      e.title,
      e.slug,
      e.description,
      e.short_description,
      e.category,
      e.country_slug,
      e.city_slug,
      COALESCE(e.country_name, co.name) AS country_name,
      COALESCE(e.city_name, ci.name) AS city_name,
      e.year,
      COALESCE(e.start_at, e.start_date::timestamptz) AS start_at,
      e.start_date,
      COALESCE(e.end_at, e.end_date::timestamptz) AS end_at,
      e.end_date,
      e.location,
      COALESCE(e.lat, e.latitude) AS lat,
      COALESCE(e.lng, e.longitude) AS lng,
      e.hero_media_key,
      e.gallery_media_keys,
      e.is_free,
      e.price_amount,
      e.price_currency,
      e.is_verified,
      e.official_url,
      e.seo_title,
      e.seo_description,
      e.geo_scope,
      e.primary_type,
      e.secondary_type,
      e.source_md_path,
      e.status::text AS status
    FROM events e
    LEFT JOIN countries co ON e.country_id = co.id
    LEFT JOIN cities ci ON e.city_id = ci.id
    WHERE e.status = ${whereStatus}::event_status
      AND (${country}::text IS NULL OR e.country_slug = ${country} OR e.country_id = ${country})
      AND (${city}::text IS NULL OR e.city_slug = ${city} OR e.city_id = ${city})
      AND (${category}::text IS NULL OR e.category = ${category})
      AND (
        ${dateFrom}::timestamptz IS NULL
        OR COALESCE(e.end_at, e.end_date::timestamptz, e.start_at, e.start_date::timestamptz) >= ${dateFrom}::timestamptz
      )
      AND (
        ${dateTo}::timestamptz IS NULL
        OR COALESCE(e.start_at, e.start_date::timestamptz) <= ${dateTo}::timestamptz
      )
      AND (
        ${price}::text = 'any'
        OR (${price}::text = 'free' AND e.is_free = true)
        OR (${price}::text = 'paid' AND e.is_free = false)
      )
      AND (
        ${verified}::text = 'any'
        OR (${verified}::text = 'true' AND e.is_verified = true)
        OR (${verified}::text = 'false' AND e.is_verified = false)
      )
      AND (
        ${q}::text IS NULL
        OR (
          e.title ILIKE ('%' || ${q} || '%')
          OR COALESCE(e.short_description, e.description, '') ILIKE ('%' || ${q} || '%')
        )
      )
    ORDER BY COALESCE(e.start_at, e.start_date) ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  return { items: rows as EventRow[], total };
}

/**
 * Get event by ID or slug
 */
export async function getEventByIdOrSlug(sql: SqlClient, idOrSlug: string): Promise<EventRow | null> {
  const rows = await sql`
    SELECT 
      e.id,
      e.title,
      e.slug,
      e.description,
      e.short_description,
      e.category,
      e.country_slug,
      e.city_slug,
      COALESCE(e.country_name, co.name) AS country_name,
      COALESCE(e.city_name, ci.name) AS city_name,
      e.year,
      COALESCE(e.start_at, e.start_date::timestamptz) AS start_at,
      e.start_date,
      COALESCE(e.end_at, e.end_date::timestamptz) AS end_at,
      e.end_date,
      e.location,
      COALESCE(e.lat, e.latitude) AS lat,
      COALESCE(e.lng, e.longitude) AS lng,
      e.hero_media_key,
      e.gallery_media_keys,
      e.is_free,
      e.price_amount,
      e.price_currency,
      e.is_verified,
      e.official_url,
      e.seo_title,
      e.seo_description,
      e.geo_scope,
      e.primary_type,
      e.secondary_type,
      e.source_md_path,
      e.status::text AS status
    FROM events e
    LEFT JOIN countries co ON e.country_id = co.id
    LEFT JOIN cities ci ON e.city_id = ci.id
    WHERE e.id = ${idOrSlug} OR e.slug = ${idOrSlug}
    LIMIT 1
  `;
  return (rows[0] as EventRow) ?? null;
}

/**
 * List countries with counts
 */
export async function listCountries(sql: SqlClient): Promise<CountryRow[]> {
  const rows = await sql`
    SELECT 
      c.id,
      c.slug,
      c.name,
      c.code,
      c.flag_emoji,
      c.description_short,
      m.public_url AS hero_url,
      (SELECT COUNT(*)::int FROM cities WHERE country_id = c.id) AS cities_count,
      (SELECT COUNT(*)::int FROM places WHERE country_id = c.id) AS places_count
    FROM countries c
    LEFT JOIN media_files m ON c.hero_media_id = m.id
    ORDER BY c.name
  `;
  return rows as CountryRow[];
}

/**
 * Get country by ID or slug
 */
export async function getCountryByIdOrSlug(sql: SqlClient, idOrSlug: string): Promise<CountryRow | null> {
  const rows = await sql`
    SELECT 
      c.id,
      c.slug,
      c.name,
      c.code,
      c.flag_emoji,
      c.description_short,
      m.public_url AS hero_url,
      (SELECT COUNT(*)::int FROM cities WHERE country_id = c.id) AS cities_count,
      (SELECT COUNT(*)::int FROM places WHERE country_id = c.id) AS places_count
    FROM countries c
    LEFT JOIN media_files m ON c.hero_media_id = m.id
    WHERE c.id = ${idOrSlug} OR c.slug = ${idOrSlug}
    LIMIT 1
  `;
  return (rows[0] as CountryRow) ?? null;
}

/**
 * List cities with counts
 */
export async function listCities(
  sql: SqlClient,
  params?: {
    countryId?: string;
    q?: string;
    type?: string;
    size?: string;
    sea?: boolean;
    price?: string;
    nightlife?: string;
    sort?: 'size_desc' | 'name_asc' | 'name_desc';
    limit?: number;
  }
): Promise<CityRow[]> {
  const countryId = params?.countryId ?? null;
  const qRaw = typeof params?.q === 'string' ? params.q.trim() : '';
  const q = qRaw.length > 0 ? qRaw : null;
  const type = params?.type ?? null;
  const size = params?.size ?? null;
  const sea = typeof params?.sea === 'boolean' ? params.sea : null;
  const price = params?.price ?? null;
  const nightlife = params?.nightlife ?? null;
  const sort = params?.sort ?? 'size_desc';
  const limit = Math.min(500, Math.max(1, params?.limit ?? 200));

  if (sort === 'name_desc') {
    const rows = await sql`
      SELECT
        ci.id,
        ci.slug,
        ci.name,
        ci.country_id,
        co.name AS country_name,
        ci.description_short,
        COALESCE(ci.lat, ci.latitude) AS lat,
        COALESCE(ci.lng, ci.longitude) AS lng,
        m.public_url AS hero_url,
        (SELECT COUNT(*)::int FROM places WHERE city_id = ci.id) AS places_count
      FROM cities ci
      LEFT JOIN countries co ON ci.country_id = co.id
      LEFT JOIN media_files m ON ci.hero_media_id = m.id
      WHERE (${countryId}::text IS NULL OR ci.country_id = ${countryId})
        AND (${type}::text IS NULL OR ci.city_type::text = ${type})
        AND (${size}::text IS NULL OR ci.city_size::text = ${size})
        AND (${sea}::boolean IS NULL OR ci.has_sea = ${sea})
        AND (${price}::text IS NULL OR ci.price_level::text = ${price})
        AND (${nightlife}::text IS NULL OR ci.nightlife_level::text = ${nightlife})
        AND (
          ${q}::text IS NULL
          OR (
            COALESCE(ci.names->>'ru', ci.name) ILIKE ('%' || ${q} || '%')
            OR COALESCE(ci.names->>'en', '') ILIKE ('%' || ${q} || '%')
          )
        )
      ORDER BY COALESCE(ci.names->>'ru', ci.name) DESC
      LIMIT ${limit}
    `;
    return rows as CityRow[];
  }

  if (sort === 'name_asc') {
    const rows = await sql`
      SELECT
        ci.id,
        ci.slug,
        ci.name,
        ci.country_id,
        co.name AS country_name,
        ci.description_short,
        COALESCE(ci.lat, ci.latitude) AS lat,
        COALESCE(ci.lng, ci.longitude) AS lng,
        m.public_url AS hero_url,
        (SELECT COUNT(*)::int FROM places WHERE city_id = ci.id) AS places_count
      FROM cities ci
      LEFT JOIN countries co ON ci.country_id = co.id
      LEFT JOIN media_files m ON ci.hero_media_id = m.id
      WHERE (${countryId}::text IS NULL OR ci.country_id = ${countryId})
        AND (${type}::text IS NULL OR ci.city_type::text = ${type})
        AND (${size}::text IS NULL OR ci.city_size::text = ${size})
        AND (${sea}::boolean IS NULL OR ci.has_sea = ${sea})
        AND (${price}::text IS NULL OR ci.price_level::text = ${price})
        AND (${nightlife}::text IS NULL OR ci.nightlife_level::text = ${nightlife})
        AND (
          ${q}::text IS NULL
          OR (
            COALESCE(ci.names->>'ru', ci.name) ILIKE ('%' || ${q} || '%')
            OR COALESCE(ci.names->>'en', '') ILIKE ('%' || ${q} || '%')
          )
        )
      ORDER BY COALESCE(ci.names->>'ru', ci.name) ASC
      LIMIT ${limit}
    `;
    return rows as CityRow[];
  }

  // Default: size_desc (сначала крупные)
  const rows = await sql`
    SELECT
      ci.id,
      ci.slug,
      ci.name,
      ci.country_id,
      co.name AS country_name,
      ci.description_short,
      COALESCE(ci.lat, ci.latitude) AS lat,
      COALESCE(ci.lng, ci.longitude) AS lng,
      m.public_url AS hero_url,
      (SELECT COUNT(*)::int FROM places WHERE city_id = ci.id) AS places_count
    FROM cities ci
    LEFT JOIN countries co ON ci.country_id = co.id
    LEFT JOIN media_files m ON ci.hero_media_id = m.id
    WHERE (${countryId}::text IS NULL OR ci.country_id = ${countryId})
      AND (${type}::text IS NULL OR ci.city_type::text = ${type})
      AND (${size}::text IS NULL OR ci.city_size::text = ${size})
      AND (${sea}::boolean IS NULL OR ci.has_sea = ${sea})
      AND (${price}::text IS NULL OR ci.price_level::text = ${price})
      AND (${nightlife}::text IS NULL OR ci.nightlife_level::text = ${nightlife})
      AND (
        ${q}::text IS NULL
        OR (
          COALESCE(ci.names->>'ru', ci.name) ILIKE ('%' || ${q} || '%')
          OR COALESCE(ci.names->>'en', '') ILIKE ('%' || ${q} || '%')
        )
      )
    ORDER BY
      CASE ci.city_size::text
        WHEN 'capital' THEN 4
        WHEN 'large' THEN 3
        WHEN 'medium' THEN 2
        WHEN 'small' THEN 1
        ELSE 0
      END DESC,
      COALESCE(ci.names->>'ru', ci.name) ASC
    LIMIT ${limit}
  `;
  return rows as CityRow[];
}

/**
 * Get city by ID or slug
 */
export async function getCityByIdOrSlug(sql: SqlClient, idOrSlug: string): Promise<CityRow | null> {
  const rows = await sql`
    SELECT 
      ci.id,
      ci.slug,
      ci.name,
      ci.country_id,
      co.name AS country_name,
      ci.description_short,
      COALESCE(ci.lat, ci.latitude) AS lat,
      COALESCE(ci.lng, ci.longitude) AS lng,
      m.public_url AS hero_url,
      (SELECT COUNT(*)::int FROM places WHERE city_id = ci.id) AS places_count
    FROM cities ci
    LEFT JOIN countries co ON ci.country_id = co.id
    LEFT JOIN media_files m ON ci.hero_media_id = m.id
    WHERE ci.id = ${idOrSlug} OR ci.slug = ${idOrSlug}
    LIMIT 1
  `;
  return (rows[0] as CityRow) ?? null;
}

/**
 * List places
 */
export async function listPlaces(
  sql: SqlClient,
  params?: { cityId?: string; countryId?: string; kind?: string; limit?: number }
): Promise<PlaceRow[]> {
  const cityId = params?.cityId ?? null;
  const countryId = params?.countryId ?? null;
  const kind = params?.kind ?? null;
  const limit = Math.min(500, Math.max(1, params?.limit ?? 100));

  const rows = await sql`
    SELECT 
      p.id,
      p.slug,
      p.name,
      p.type,
      p.place_kind,
      p.category,
      p.tags::text AS tags,
      p.website,
      p.phone,
      p.instagram,
      p.google_maps_url,
      p.price_level,
      p.description_short,
      co.name AS country_name,
      ci.name AS city_name,
      p.country_id,
      p.city_id,
      p.address,
      COALESCE(p.lat, p.latitude) AS lat,
      COALESCE(p.lng, p.longitude) AS lng,
      m.public_url AS hero_url,
      p.images::text AS images
    FROM places p
    LEFT JOIN countries co ON p.country_id = co.id
    LEFT JOIN cities ci ON p.city_id = ci.id
    LEFT JOIN media_files m ON p.hero_media_id = m.id
    WHERE (${cityId}::text IS NULL OR p.city_id = ${cityId})
      AND (${countryId}::text IS NULL OR p.country_id = ${countryId})
      AND (${kind}::text IS NULL OR p.place_kind = ${kind})
    ORDER BY p.name
    LIMIT ${limit}
  `;
  return rows as PlaceRow[];
}

/**
 * Get place by ID or slug
 */
export async function getPlaceByIdOrSlug(sql: SqlClient, idOrSlug: string): Promise<PlaceRow | null> {
  const rows = await sql`
    SELECT 
      p.id,
      p.slug,
      p.name,
      p.type,
      p.place_kind,
      p.category,
      p.tags::text AS tags,
      p.website,
      p.phone,
      p.instagram,
      p.google_maps_url,
      p.price_level,
      p.description_short,
      co.name AS country_name,
      ci.name AS city_name,
      p.country_id,
      p.city_id,
      p.address,
      COALESCE(p.lat, p.latitude) AS lat,
      COALESCE(p.lng, p.longitude) AS lng,
      m.public_url AS hero_url,
      p.images::text AS images
    FROM places p
    LEFT JOIN countries co ON p.country_id = co.id
    LEFT JOIN cities ci ON p.city_id = ci.id
    LEFT JOIN media_files m ON p.hero_media_id = m.id
    WHERE p.id = ${idOrSlug} OR p.slug = ${idOrSlug}
    LIMIT 1
  `;
  return (rows[0] as PlaceRow) ?? null;
}

/**
 * List articles (published only)
 */
export async function listArticles(sql: SqlClient, limit = 50): Promise<ArticleRow[]> {
  const rows = await sql`
    SELECT 
      a.id,
      a.slug,
      a.title,
      a.excerpt,
      a.content,
      a.category,
      a.tags::text AS tags,
      COALESCE(m.public_url, a.image_url) AS cover_url,
      a.published_at,
      a.status::text AS status
    FROM articles a
    LEFT JOIN media_files m ON a.cover_media_id = m.id
    WHERE a.status = 'published'
    ORDER BY a.published_at DESC NULLS LAST
    LIMIT ${limit}
  `;
  return rows as ArticleRow[];
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(sql: SqlClient, slug: string): Promise<ArticleRow | null> {
  const rows = await sql`
    SELECT 
      a.id,
      a.slug,
      a.title,
      a.excerpt,
      a.content,
      a.category,
      a.tags::text AS tags,
      COALESCE(m.public_url, a.image_url) AS cover_url,
      a.published_at,
      a.status::text AS status
    FROM articles a
    LEFT JOIN media_files m ON a.cover_media_id = m.id
    WHERE a.slug = ${slug}
    LIMIT 1
  `;
  return (rows[0] as ArticleRow) ?? null;
}

// ============================================================================
// Atlas tabs (content_blocks)
// ============================================================================

export async function getCountryIdByIdOrSlug(sql: SqlClient, idOrSlug: string): Promise<string | null> {
  const rows = await sql`
    SELECT id::text AS id
    FROM countries
    WHERE id::text = ${idOrSlug} OR slug = ${idOrSlug}
    LIMIT 1
  `;
  return (rows[0] as { id: string } | undefined)?.id ?? null;
}

export async function getCityIdByIdOrSlug(sql: SqlClient, idOrSlug: string): Promise<string | null> {
  const rows = await sql`
    WITH direct AS (
      SELECT id::text AS id
      FROM cities
      WHERE id::text = ${idOrSlug} OR slug = ${idOrSlug}
      LIMIT 1
    ),
    ali AS (
      SELECT ca.city_id::text AS id
      FROM city_aliases ca
      WHERE ca.alias_slug = ${idOrSlug}
      ORDER BY ca.updated_at DESC, ca.created_at DESC, ca.city_id ASC
      LIMIT 1
    )
    SELECT id FROM direct
    UNION ALL
    SELECT id FROM ali
    LIMIT 1
  `;
  return (rows[0] as { id: string } | undefined)?.id ?? null;
}

export async function getPlaceIdByIdOrSlug(sql: SqlClient, idOrSlug: string): Promise<string | null> {
  const rows = await sql`
    SELECT id::text AS id
    FROM places
    WHERE id::text = ${idOrSlug} OR slug = ${idOrSlug}
    LIMIT 1
  `;
  return (rows[0] as { id: string } | undefined)?.id ?? null;
}

export async function listContentBlocks(
  sql: SqlClient,
  entityType: string,
  entityId: string,
  filters?: { tabKey?: string; lang?: string }
): Promise<ContentBlockRow[]> {
  const tabKey = filters?.tabKey ?? null;
  const lang = filters?.lang ?? null;

  if (tabKey && lang) {
    const rows = await sql`
      SELECT id::text AS id, entity_type, entity_id::text AS entity_id, tab_key, lang, title, body_markdown, updated_at::text AS updated_at
      FROM content_blocks
      WHERE entity_type = ${entityType} AND entity_id = ${entityId}
        AND tab_key = ${tabKey} AND lang = ${lang}
      ORDER BY tab_key ASC
    `;
    return rows as ContentBlockRow[];
  }

  if (tabKey) {
    const rows = await sql`
      SELECT id::text AS id, entity_type, entity_id::text AS entity_id, tab_key, lang, title, body_markdown, updated_at::text AS updated_at
      FROM content_blocks
      WHERE entity_type = ${entityType} AND entity_id = ${entityId}
        AND tab_key = ${tabKey}
      ORDER BY tab_key ASC
    `;
    return rows as ContentBlockRow[];
  }

  if (lang) {
    const rows = await sql`
      SELECT id::text AS id, entity_type, entity_id::text AS entity_id, tab_key, lang, title, body_markdown, updated_at::text AS updated_at
      FROM content_blocks
      WHERE entity_type = ${entityType} AND entity_id = ${entityId}
        AND lang = ${lang}
      ORDER BY tab_key ASC
    `;
    return rows as ContentBlockRow[];
  }

  const rows = await sql`
    SELECT id::text AS id, entity_type, entity_id::text AS entity_id, tab_key, lang, title, body_markdown, updated_at::text AS updated_at
    FROM content_blocks
    WHERE entity_type = ${entityType} AND entity_id = ${entityId}
    ORDER BY tab_key ASC
  `;
  return rows as ContentBlockRow[];
}



