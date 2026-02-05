-- =====================================================================
-- 05_data_health_blog.sql
-- Blog Module Data Health Checks (Neon-friendly)
-- =====================================================================
--
-- Purpose:
--   - Health checks for Blog entities: articles
--
-- Design:
--   - Neon SQL Editor: no \echo, and NOTICE is hard to export
--   - Collect metrics into TEMP table + return single result set
--
-- Read-only: no UPDATE/DELETE (TEMP table only)
-- Defensive: handles missing tables via existence checks
-- =====================================================================

DROP TABLE IF EXISTS audit_blog_results;
CREATE TEMP TABLE audit_blog_results (
  section text NOT NULL,
  metric text NOT NULL,
  value text,
  details text
);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'articles') THEN
    INSERT INTO audit_blog_results(section, metric, value) VALUES
      ('articles', 'total', (SELECT COUNT(*)::text FROM articles)),
      ('articles', 'created_at_min', (SELECT MIN(created_at)::text FROM articles)),
      ('articles', 'created_at_max', (SELECT MAX(updated_at)::text FROM articles)),
      ('articles', 'missing_title', (SELECT COUNT(*)::text FROM articles WHERE title IS NULL OR title = '')),
      ('articles', 'missing_slug', (SELECT COUNT(*)::text FROM articles WHERE slug IS NULL OR slug = '')),
      ('articles', 'missing_content', (SELECT COUNT(*)::text FROM articles WHERE content IS NULL OR content = '')),
      ('articles', 'missing_excerpt', (SELECT COUNT(*)::text FROM articles WHERE excerpt IS NULL OR excerpt = '')),
      ('articles', 'missing_category', (SELECT COUNT(*)::text FROM articles WHERE category IS NULL OR category = '')),
      ('articles', 'missing_tags', (
        SELECT COUNT(*)::text
        FROM articles
        WHERE tags IS NULL OR jsonb_array_length(tags) = 0
      )),
      ('articles', 'missing_cover_media_id', (SELECT COUNT(*)::text FROM articles WHERE cover_media_id IS NULL)),
      ('articles', 'missing_image_url', (SELECT COUNT(*)::text FROM articles WHERE image_url IS NULL OR image_url = '')),
      ('articles', 'missing_media_both', (
        SELECT COUNT(*)::text
        FROM articles
        WHERE cover_media_id IS NULL AND (image_url IS NULL OR image_url = '')
      )),
      ('articles', 'published_total', (
        SELECT COUNT(*)::text FROM articles WHERE status = 'published' OR is_published = true
      )),
      ('articles', 'draft_total', (
        SELECT COUNT(*)::text FROM articles WHERE status = 'draft' OR is_published = false
      )),
      ('articles', 'published_without_published_at', (
        SELECT COUNT(*)::text
        FROM articles
        WHERE (status = 'published' OR is_published = true)
          AND published_at IS NULL
      ));

    -- Status distribution
    INSERT INTO audit_blog_results(section, metric, value, details)
    SELECT 'articles', 'by_status', COUNT(*)::text, status::text
    FROM articles
    GROUP BY status
    ORDER BY COUNT(*) DESC;

    -- Content length stats
    INSERT INTO audit_blog_results(section, metric, value) VALUES
      ('articles', 'content_len_min', (SELECT MIN(LENGTH(content))::text FROM articles WHERE content IS NOT NULL)),
      ('articles', 'content_len_avg', (SELECT AVG(LENGTH(content))::int::text FROM articles WHERE content IS NOT NULL)),
      ('articles', 'content_len_max', (SELECT MAX(LENGTH(content))::text FROM articles WHERE content IS NOT NULL)),
      ('articles', 'content_len_lt_100', (SELECT COUNT(*)::text FROM articles WHERE LENGTH(content) < 100)),
      ('articles', 'excerpt_len_min', (
        SELECT MIN(LENGTH(excerpt))::text FROM articles WHERE excerpt IS NOT NULL AND excerpt <> ''
      )),
      ('articles', 'excerpt_len_avg', (
        SELECT AVG(LENGTH(excerpt))::int::text FROM articles WHERE excerpt IS NOT NULL AND excerpt <> ''
      )),
      ('articles', 'excerpt_len_max', (
        SELECT MAX(LENGTH(excerpt))::text FROM articles WHERE excerpt IS NOT NULL AND excerpt <> ''
      ));

    -- Duplicates
    INSERT INTO audit_blog_results(section, metric, value)
    VALUES (
      'articles',
      'duplicate_slug_groups',
      (
        SELECT COUNT(*)::text
        FROM (SELECT slug FROM articles GROUP BY slug HAVING COUNT(*) > 1) dup
      )
    );

    -- Publishing consistency
    INSERT INTO audit_blog_results(section, metric, value) VALUES
      ('articles', 'status_published_but_is_published_false', (
        SELECT COUNT(*)::text FROM articles WHERE status = 'published' AND is_published = false
      )),
      ('articles', 'status_draft_but_is_published_true', (
        SELECT COUNT(*)::text FROM articles WHERE status = 'draft' AND is_published = true
      ));

  ELSE
    INSERT INTO audit_blog_results(section, metric, value, details)
    VALUES ('articles', 'table_missing', 'true', 'articles table does not exist');
  END IF;
END $$;

SELECT section, metric, value, details
FROM audit_blog_results
ORDER BY section, metric, details;

