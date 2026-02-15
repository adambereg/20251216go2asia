/**
 * Raw SQL queries for Guide Engine v1 (Workers-safe).
 *
 * Tables:
 * - guides
 * - guide_sections
 * - guide_blocks
 * - guide_feeds
 */

import type { ArticleRow, EventRow, PlaceRow, SqlClient } from './content';

export interface GuideRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  guide_type: string;
  status: string;
  tags: string[]; // text[]
  country_ids: string[]; // text[]
  city_ids: string[]; // text[]
  hero_r2_key: string | null;
  hero_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GuideSectionRow {
  id: string;
  guide_id: string;
  tab_key: string;
  title: string | null;
  order_index: number;
  is_enabled: boolean;
}

export interface GuideBlockRow {
  id: string;
  section_id: string;
  block_type: string;
  order_index: number;
  payload: unknown; // jsonb
  is_empty: boolean;
}

export interface GuideFeedRow {
  id: string;
  guide_id: string;
  tab_key: string;
  source: string;
  filter: unknown; // jsonb
  limit_count: number;
  sort: string;
  order_index: number;
  is_enabled: boolean;
}

export type ListGuidesParams = {
  countryId?: string;
  cityId?: string;
  guideType?: string;
  tag?: string;
  status?: string; // if not set -> published|verified
  limit?: number;
};

export async function listGuides(sql: SqlClient, params?: ListGuidesParams): Promise<GuideRow[]> {
  const limit = typeof params?.limit === 'number' && Number.isFinite(params.limit) ? Math.min(Math.max(params.limit, 1), 100) : 20;

  const countryId = typeof params?.countryId === 'string' && params.countryId.length > 0 ? params.countryId : null;
  const cityId = typeof params?.cityId === 'string' && params.cityId.length > 0 ? params.cityId : null;
  const guideType = typeof params?.guideType === 'string' && params.guideType.length > 0 ? params.guideType : null;
  const tag = typeof params?.tag === 'string' && params.tag.length > 0 ? params.tag : null;
  const status = typeof params?.status === 'string' && params.status.length > 0 ? params.status : null;

  const rows = await sql`
    SELECT
      g.id,
      g.slug,
      g.title,
      g.summary,
      g.guide_type::text AS guide_type,
      g.status::text AS status,
      g.tags,
      g.country_ids,
      g.city_ids,
      g.hero_r2_key,
      COALESCE(g.hero_url, m.public_url) AS hero_url,
      g.published_at::text AS published_at,
      g.created_at::text AS created_at,
      g.updated_at::text AS updated_at
    FROM guides g
    LEFT JOIN media_files m ON g.hero_media_id = m.id
    WHERE
      (${countryId}::text IS NULL OR g.country_ids @> ARRAY[${countryId}]::text[])
      AND (${cityId}::text IS NULL OR g.city_ids @> ARRAY[${cityId}]::text[])
      AND (${guideType}::text IS NULL OR g.guide_type::text = ${guideType})
      AND (${tag}::text IS NULL OR g.tags @> ARRAY[${tag}]::text[])
      AND (
        ${status}::text IS NOT NULL
        OR g.status IN ('published','verified')
      )
      AND (${status}::text IS NULL OR g.status::text = ${status})
    ORDER BY COALESCE(g.published_at, g.updated_at) DESC, g.updated_at DESC
    LIMIT ${limit}
  `;

  return rows as GuideRow[];
}

export async function getGuideBySlug(sql: SqlClient, slug: string): Promise<GuideRow | null> {
  const rows = await sql`
    SELECT
      g.id,
      g.slug,
      g.title,
      g.summary,
      g.guide_type::text AS guide_type,
      g.status::text AS status,
      g.tags,
      g.country_ids,
      g.city_ids,
      g.hero_r2_key,
      COALESCE(g.hero_url, m.public_url) AS hero_url,
      g.published_at::text AS published_at,
      g.created_at::text AS created_at,
      g.updated_at::text AS updated_at
    FROM guides g
    LEFT JOIN media_files m ON g.hero_media_id = m.id
    WHERE g.slug = ${slug}
    LIMIT 1
  `;
  return (rows[0] as GuideRow) ?? null;
}

export async function listGuideSections(
  sql: SqlClient,
  guideId: string,
  params?: { includeEmpty?: boolean }
): Promise<GuideSectionRow[]> {
  const includeEmpty = Boolean(params?.includeEmpty);
  const rows = await sql`
    SELECT
      gs.id,
      gs.guide_id,
      gs.tab_key::text AS tab_key,
      gs.title,
      gs.order_index,
      gs.is_enabled
    FROM guide_sections gs
    WHERE
      gs.guide_id = ${guideId}
      AND (
        ${includeEmpty}::boolean = true
        OR (
          gs.is_enabled = true
          AND (
            EXISTS (
              SELECT 1
              FROM guide_blocks gb
              WHERE gb.section_id = gs.id
                AND gb.is_empty = false
            )
            OR EXISTS (
              SELECT 1
              FROM guide_feeds gf
              WHERE gf.guide_id = gs.guide_id
                AND gf.tab_key = gs.tab_key
                AND gf.is_enabled = true
            )
          )
        )
      )
    ORDER BY gs.order_index ASC, gs.created_at ASC
  `;
  return rows as GuideSectionRow[];
}

export async function listGuideBlocks(sql: SqlClient, sectionIds: string[]): Promise<GuideBlockRow[]> {
  if (!Array.isArray(sectionIds) || sectionIds.length === 0) return [];
  const rows = await sql`
    SELECT
      gb.id,
      gb.section_id,
      gb.block_type::text AS block_type,
      gb.order_index,
      gb.payload,
      gb.is_empty
    FROM guide_blocks gb
    WHERE gb.section_id = ANY(${sectionIds}::uuid[])
    ORDER BY gb.section_id ASC, gb.order_index ASC, gb.created_at ASC
  `;
  return rows as GuideBlockRow[];
}

export async function listGuideFeeds(sql: SqlClient, guideId: string, tabKeys: string[]): Promise<GuideFeedRow[]> {
  if (!Array.isArray(tabKeys) || tabKeys.length === 0) return [];
  const rows = await sql`
    SELECT
      gf.id,
      gf.guide_id,
      gf.tab_key::text AS tab_key,
      gf.source::text AS source,
      gf.filter,
      gf.limit_count,
      gf.sort::text AS sort,
      gf.order_index,
      gf.is_enabled
    FROM guide_feeds gf
    WHERE gf.guide_id = ${guideId}
      AND gf.tab_key = ANY(${tabKeys}::atlas_guide_tab_key[])
      AND gf.is_enabled = true
    ORDER BY gf.tab_key ASC, gf.order_index ASC, gf.created_at ASC
  `;
  return rows as GuideFeedRow[];
}

// ============================================================================
// Feed resolvers (batch per source + tab)
// ============================================================================

export async function listEventsForGuideFeed(
  sql: SqlClient,
  params: {
    cityIds?: string[];
    countryIds?: string[];
    startAfter?: string;
    limit?: number;
    sort?: 'date_asc' | 'date_desc' | 'newest' | 'popular' | 'relevance';
  }
): Promise<EventRow[]> {
  const cityIds = Array.isArray(params.cityIds) && params.cityIds.length > 0 ? params.cityIds : null;
  const countryIds = Array.isArray(params.countryIds) && params.countryIds.length > 0 ? params.countryIds : null;
  const startAfter = typeof params.startAfter === 'string' && params.startAfter.length > 0 ? params.startAfter : null;
  const limit = Math.min(200, Math.max(1, typeof params.limit === 'number' ? params.limit : 50));
  const sort = params.sort ?? 'date_asc';

  const orderBy =
    sort === 'date_desc' || sort === 'newest'
      ? sql`ORDER BY COALESCE(e.start_at, e.start_date) DESC`
      : sql`ORDER BY COALESCE(e.start_at, e.start_date) ASC`;

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
      AND (${cityIds}::text[] IS NULL OR e.city_id = ANY(${cityIds}::text[]))
      AND (${countryIds}::text[] IS NULL OR e.country_id = ANY(${countryIds}::text[]))
      AND (${startAfter}::timestamptz IS NULL OR COALESCE(e.start_at, e.start_date::timestamptz) >= ${startAfter}::timestamptz)
    ${orderBy}
    LIMIT ${limit}
  `;
  return rows as EventRow[];
}

export async function listPlacesForGuideFeed(
  sql: SqlClient,
  params: {
    cityIds?: string[];
    countryIds?: string[];
    kind?: string;
    tags?: string[];
    limit?: number;
    sort?: 'relevance' | 'popular' | 'newest';
  }
): Promise<PlaceRow[]> {
  const cityIds = Array.isArray(params.cityIds) && params.cityIds.length > 0 ? params.cityIds : null;
  const countryIds = Array.isArray(params.countryIds) && params.countryIds.length > 0 ? params.countryIds : null;
  const kind = typeof params.kind === 'string' && params.kind.length > 0 ? params.kind : null;
  const tags = Array.isArray(params.tags) && params.tags.length > 0 ? params.tags : null;
  const limit = Math.min(200, Math.max(1, typeof params.limit === 'number' ? params.limit : 50));

  // v1: simple ordering
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
    WHERE (${cityIds}::text[] IS NULL OR p.city_id = ANY(${cityIds}::text[]))
      AND (${countryIds}::text[] IS NULL OR p.country_id = ANY(${countryIds}::text[]))
      AND (${kind}::text IS NULL OR p.place_kind = ${kind})
      AND (
        ${tags}::text[] IS NULL
        OR (p.tags IS NOT NULL AND p.tags ?| ${tags}::text[])
      )
    ORDER BY p.name
    LIMIT ${limit}
  `;
  return rows as PlaceRow[];
}

export async function listArticlesForGuideFeed(
  sql: SqlClient,
  params: {
    tags?: string[];
    limit?: number;
    sort?: 'newest' | 'popular' | 'relevance';
  }
): Promise<ArticleRow[]> {
  const tags = Array.isArray(params.tags) && params.tags.length > 0 ? params.tags : null;
  const limit = Math.min(200, Math.max(1, typeof params.limit === 'number' ? params.limit : 50));

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
      AND (
        ${tags}::text[] IS NULL
        OR (a.tags IS NOT NULL AND a.tags ?| ${tags}::text[])
      )
    ORDER BY a.published_at DESC NULLS LAST
    LIMIT ${limit}
  `;
  return rows as ArticleRow[];
}

