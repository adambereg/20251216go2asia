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
// Types (matching frontend DTOs)
// ============================================================================

export interface EventRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  start_at: string | null;
  start_date: string;
  end_at: string | null;
  end_date: string | null;
  location: string | null;
  country_name: string | null;
  city_name: string | null;
  lat: string | null;
  lng: string | null;
  image_url: string | null;
  is_free: boolean;
  price_amount: string | null;
  price_currency: string | null;
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
  description_short: string | null;
  country_name: string | null;
  city_name: string | null;
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

// ============================================================================
// Queries
// ============================================================================

/**
 * List events (active only, ordered by start date)
 */
export async function listEvents(sql: SqlClient, limit = 50): Promise<EventRow[]> {
  const rows = await sql`
    SELECT 
      e.id,
      e.title,
      e.slug,
      e.description,
      e.category,
      COALESCE(e.start_at, e.start_date::timestamptz) AS start_at,
      e.start_date,
      COALESCE(e.end_at, e.end_date::timestamptz) AS end_at,
      e.end_date,
      e.location,
      co.name AS country_name,
      ci.name AS city_name,
      COALESCE(e.lat, e.latitude) AS lat,
      COALESCE(e.lng, e.longitude) AS lng,
      COALESCE(m.public_url, e.image_url) AS image_url,
      e.is_free,
      e.price_amount,
      e.price_currency,
      e.status::text AS status
    FROM events e
    LEFT JOIN countries co ON e.country_id = co.id
    LEFT JOIN cities ci ON e.city_id = ci.id
    LEFT JOIN media_files m ON e.image_media_id = m.id
    WHERE e.status = 'active'
    ORDER BY COALESCE(e.start_at, e.start_date) ASC
    LIMIT ${limit}
  `;
  return rows as EventRow[];
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
      e.category,
      COALESCE(e.start_at, e.start_date::timestamptz) AS start_at,
      e.start_date,
      COALESCE(e.end_at, e.end_date::timestamptz) AS end_at,
      e.end_date,
      e.location,
      co.name AS country_name,
      ci.name AS city_name,
      COALESCE(e.lat, e.latitude) AS lat,
      COALESCE(e.lng, e.longitude) AS lng,
      COALESCE(m.public_url, e.image_url) AS image_url,
      e.is_free,
      e.price_amount,
      e.price_currency,
      e.status::text AS status
    FROM events e
    LEFT JOIN countries co ON e.country_id = co.id
    LEFT JOIN cities ci ON e.city_id = ci.id
    LEFT JOIN media_files m ON e.image_media_id = m.id
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
export async function listCities(sql: SqlClient, countryId?: string): Promise<CityRow[]> {
  if (countryId) {
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
      WHERE ci.country_id = ${countryId}
      ORDER BY ci.name
    `;
    return rows as CityRow[];
  }
  
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
    ORDER BY ci.name
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
export async function listPlaces(sql: SqlClient, cityId?: string, limit = 100): Promise<PlaceRow[]> {
  if (cityId) {
    const rows = await sql`
      SELECT 
        p.id,
        p.slug,
        p.name,
        p.type,
        p.description_short,
        co.name AS country_name,
        ci.name AS city_name,
        p.address,
        COALESCE(p.lat, p.latitude) AS lat,
        COALESCE(p.lng, p.longitude) AS lng,
        m.public_url AS hero_url,
        p.images::text AS images
      FROM places p
      LEFT JOIN countries co ON p.country_id = co.id
      LEFT JOIN cities ci ON p.city_id = ci.id
      LEFT JOIN media_files m ON p.hero_media_id = m.id
      WHERE p.city_id = ${cityId}
      ORDER BY p.name
      LIMIT ${limit}
    `;
    return rows as PlaceRow[];
  }
  
  const rows = await sql`
    SELECT 
      p.id,
      p.slug,
      p.name,
      p.type,
      p.description_short,
      co.name AS country_name,
      ci.name AS city_name,
      p.address,
      COALESCE(p.lat, p.latitude) AS lat,
      COALESCE(p.lng, p.longitude) AS lng,
      m.public_url AS hero_url,
      p.images::text AS images
    FROM places p
    LEFT JOIN countries co ON p.country_id = co.id
    LEFT JOIN cities ci ON p.city_id = ci.id
    LEFT JOIN media_files m ON p.hero_media_id = m.id
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
      p.description_short,
      co.name AS country_name,
      ci.name AS city_name,
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

