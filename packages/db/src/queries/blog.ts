/**
 * Raw SQL queries for Blog Asia (no Drizzle).
 *
 * Used by Workers-compatible data access (content-service).
 * Uses Neon HTTP driver directly.
 */

import type { SqlClient } from './content';

export type BlogPostSort = 'newest' | 'popular' | 'featured';

export type ListBlogPostsParams = {
  limit?: number;
  cursor?: {
    sort: BlogPostSort;
    publishedAt: string;
    id: string;
    popularityScore?: string;
    featuredRank?: number;
  } | null;
  q?: string;
  tag?: string; // tag slug
  author?: string; // author slug
  country?: string; // country slug
  city?: string; // city slug
  sort?: BlogPostSort;
  excludeSlug?: string;
};

export type BlogPostListRow = {
  id: string;
  slug: string;
  lang: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  post_type: string | null;
  category: string | null;
  country_slug: string | null;
  city_slug: string | null;
  status: string;
  published_at: string | null;
  updated_at: string;
  reading_time_minutes: number | null;
  popularity_score: string | null;
  featured_rank: number | null;
  is_promoted: boolean;
  is_featured: boolean;
  is_editor_pick: boolean;
  hero_media_key: string | null;
  hero_public_url: string | null;
  tags_json: unknown; // jsonb (string[])
  author_slug: string | null;
  author_display_name: string | null;
  author_avatar_media_key: string | null;
  author_avatar_public_url: string | null;
};

export type BlogPostDetailRow = BlogPostListRow & {
  content_markdown: string;
  lead: string | null;
};

function normalizeQuery(raw: unknown): string | null {
  const s = typeof raw === 'string' ? raw.trim() : '';
  return s.length > 0 ? s : null;
}

function clampLimit(raw: unknown, fallback: number): number {
  const n = typeof raw === 'number' && Number.isFinite(raw) ? raw : fallback;
  return Math.min(200, Math.max(1, Math.trunc(n)));
}

/**
 * List published blog posts with keyset pagination.
 */
export async function listBlogPosts(
  sql: SqlClient,
  params?: ListBlogPostsParams
): Promise<{ items: BlogPostListRow[]; hasMore: boolean }> {
  const limit = clampLimit(params?.limit, 24);
  const sort: BlogPostSort = params?.sort ?? 'newest';

  const q = normalizeQuery(params?.q);
  const tag = normalizeQuery(params?.tag);
  const author = normalizeQuery(params?.author);
  const country = normalizeQuery(params?.country);
  const city = normalizeQuery(params?.city);
  const excludeSlug = normalizeQuery(params?.excludeSlug);

  const cursor = params?.cursor ?? null;

  // We fetch one extra row to determine hasMore.
  const limitPlus = limit + 1;

  // Cursor parts
  const cPublishedAt = cursor?.publishedAt ?? null;
  const cId = cursor?.id ?? null;
  const cPopularity = cursor?.popularityScore ?? null;
  const cFeaturedRank =
    typeof cursor?.featuredRank === 'number' && Number.isFinite(cursor.featuredRank) ? Math.trunc(cursor.featuredRank) : null;

  const rows = await sql`
    WITH selected AS (
      SELECT
        p.id::text AS id,
        p.published_at::timestamptz AS published_at,
        p.popularity_score::numeric(12,4) AS popularity_score,
        p.featured_rank::int AS featured_rank
      FROM blog_posts p
      WHERE p.status = 'published'::blog_post_status
        AND (${excludeSlug}::text IS NULL OR p.slug <> ${excludeSlug})
        AND (
          ${q}::text IS NULL
          OR (
            p.title ILIKE ('%' || ${q} || '%')
            OR COALESCE(p.subtitle, '') ILIKE ('%' || ${q} || '%')
            OR COALESCE(p.excerpt, '') ILIKE ('%' || ${q} || '%')
            OR p.content_markdown ILIKE ('%' || ${q} || '%')
          )
        )
        AND (
          ${author}::text IS NULL
          OR EXISTS (
            SELECT 1
            FROM blog_authors a
            WHERE a.id = p.author_id
              AND a.slug = ${author}
          )
        )
        AND (${country}::text IS NULL OR p.country_slug = ${country})
        AND (${city}::text IS NULL OR p.city_slug = ${city})
        AND (
          ${tag}::text IS NULL
          OR EXISTS (
            SELECT 1
            FROM blog_post_tags pt
            JOIN blog_tags t ON t.id = pt.tag_id
            WHERE pt.post_id = p.id
              AND t.slug = ${tag}
          )
        )
        AND (
          ${sort}::text <> 'featured'
          OR p.is_featured = true
        )
        AND (
          ${cId}::text IS NULL
          OR (
            -- newest
            (${sort}::text = 'newest' AND (p.published_at, p.id) < (${cPublishedAt}::timestamptz, ${cId}::text))
            -- popular
            OR (
              ${sort}::text = 'popular'
              AND (
                p.popularity_score < ${cPopularity}::numeric(12,4)
                OR (p.popularity_score = ${cPopularity}::numeric(12,4) AND p.published_at < ${cPublishedAt}::timestamptz)
                OR (p.popularity_score = ${cPopularity}::numeric(12,4) AND p.published_at = ${cPublishedAt}::timestamptz AND p.id < ${cId}::text)
              )
            )
            -- featured
            OR (
              ${sort}::text = 'featured'
              AND (
                p.featured_rank < ${cFeaturedRank}::int
                OR (p.featured_rank = ${cFeaturedRank}::int AND p.published_at < ${cPublishedAt}::timestamptz)
                OR (p.featured_rank = ${cFeaturedRank}::int AND p.published_at = ${cPublishedAt}::timestamptz AND p.id < ${cId}::text)
              )
            )
          )
        )
      ORDER BY
        CASE WHEN ${sort}::text = 'popular' THEN p.popularity_score END DESC NULLS LAST,
        CASE WHEN ${sort}::text = 'featured' THEN p.featured_rank END DESC NULLS LAST,
        p.published_at DESC NULLS LAST,
        p.id DESC
      LIMIT ${limitPlus}
    )
    SELECT
      p.id::text AS id,
      p.slug,
      p.lang,
      p.title,
      p.subtitle,
      p.excerpt,
      p.post_type,
      p.category,
      p.country_slug,
      p.city_slug,
      p.status::text AS status,
      p.published_at::text AS published_at,
      p.updated_at::text AS updated_at,
      p.reading_time_minutes::int AS reading_time_minutes,
      p.popularity_score::text AS popularity_score,
      p.featured_rank::int AS featured_rank,
      p.is_promoted AS is_promoted,
      p.is_featured AS is_featured,
      p.is_editor_pick AS is_editor_pick,
      hm.key AS hero_media_key,
      hm.public_url AS hero_public_url,
      (
        SELECT COALESCE(
          jsonb_agg(t.slug ORDER BY t.slug) FILTER (WHERE t.slug IS NOT NULL),
          '[]'::jsonb
        )
        FROM blog_post_tags pt
        JOIN blog_tags t ON t.id = pt.tag_id
        WHERE pt.post_id = p.id
      ) AS tags_json,
      a.slug AS author_slug,
      a.display_name AS author_display_name,
      am.key AS author_avatar_media_key,
      am.public_url AS author_avatar_public_url
    FROM selected s
    JOIN blog_posts p ON p.id = s.id
    LEFT JOIN media_files hm ON p.hero_media_id = hm.id
    LEFT JOIN blog_authors a ON p.author_id = a.id
    LEFT JOIN media_files am ON a.avatar_media_id = am.id
    ORDER BY
      CASE WHEN ${sort}::text = 'popular' THEN s.popularity_score END DESC NULLS LAST,
      CASE WHEN ${sort}::text = 'featured' THEN s.featured_rank END DESC NULLS LAST,
      s.published_at DESC NULLS LAST,
      s.id DESC
  `;

  const all = rows as BlogPostListRow[];
  const hasMore = all.length > limit;
  const items = hasMore ? all.slice(0, limit) : all;
  return { items, hasMore };
}

export async function getBlogPostBySlug(sql: SqlClient, slug: string): Promise<BlogPostDetailRow | null> {
  const s = normalizeQuery(slug);
  if (!s) return null;

  const rows = await sql`
    SELECT
      p.id::text AS id,
      p.slug,
      p.lang,
      p.title,
      p.subtitle,
      p.excerpt,
      p.post_type,
      p.category,
      p.country_slug,
      p.city_slug,
      p.status::text AS status,
      p.published_at::text AS published_at,
      p.updated_at::text AS updated_at,
      p.reading_time_minutes::int AS reading_time_minutes,
      p.popularity_score::text AS popularity_score,
      p.featured_rank::int AS featured_rank,
      p.is_promoted AS is_promoted,
      p.is_featured AS is_featured,
      p.is_editor_pick AS is_editor_pick,
      hm.key AS hero_media_key,
      hm.public_url AS hero_public_url,
      (
        SELECT COALESCE(
          jsonb_agg(t.slug ORDER BY t.slug) FILTER (WHERE t.slug IS NOT NULL),
          '[]'::jsonb
        )
        FROM blog_post_tags pt
        JOIN blog_tags t ON t.id = pt.tag_id
        WHERE pt.post_id = p.id
      ) AS tags_json,
      a.slug AS author_slug,
      a.display_name AS author_display_name,
      am.key AS author_avatar_media_key,
      am.public_url AS author_avatar_public_url,
      p.content_markdown,
      p.excerpt AS lead
    FROM blog_posts p
    LEFT JOIN media_files hm ON p.hero_media_id = hm.id
    LEFT JOIN blog_authors a ON p.author_id = a.id
    LEFT JOIN media_files am ON a.avatar_media_id = am.id
    WHERE p.slug = ${s}
    LIMIT 1
  `;

  return (rows[0] as BlogPostDetailRow) ?? null;
}

