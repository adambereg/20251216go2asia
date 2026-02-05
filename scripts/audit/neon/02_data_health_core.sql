-- =====================================================================
-- 02_data_health_core.sql
-- Core Data Health Checks: Universal checks for all modules
-- =====================================================================
-- 
-- Purpose: Check data quality across core tables (countries, cities, media_files)
--          and common patterns (NULLs, duplicates, broken references)
-- 
-- Defensive: Uses DO blocks to handle missing tables gracefully
-- =====================================================================

-- NOTE:
-- Neon SQL Editor (и экспорт) удобнее, когда скрипт возвращает result set.
-- Поэтому все метрики пишем в temp-таблицу и в конце делаем SELECT.

DROP TABLE IF EXISTS audit_core_results;
CREATE TEMP TABLE audit_core_results (
  section text NOT NULL,
  metric text NOT NULL,
  value text,
  details text
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'countries') THEN
        INSERT INTO audit_core_results(section, metric, value) VALUES
          ('countries', 'total', (SELECT COUNT(*)::text FROM countries)),
          ('countries', 'missing_name', (SELECT COUNT(*)::text FROM countries WHERE name IS NULL OR name = '')),
          ('countries', 'missing_slug', (SELECT COUNT(*)::text FROM countries WHERE slug IS NULL OR slug = '')),
          ('countries', 'missing_code', (SELECT COUNT(*)::text FROM countries WHERE code IS NULL OR code = '')),
          ('countries', 'duplicate_slug_groups', (
            SELECT COUNT(*)::text FROM (
              SELECT slug, COUNT(*) FROM countries GROUP BY slug HAVING COUNT(*) > 1
            ) dupes
          )),
          ('countries', 'created_at_min', (SELECT MIN(created_at)::text FROM countries)),
          ('countries', 'created_at_max', (SELECT MAX(created_at)::text FROM countries));
    ELSE
        INSERT INTO audit_core_results(section, metric, value, details)
        VALUES ('countries', 'table_missing', 'true', 'countries table does not exist');
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cities') THEN
        INSERT INTO audit_core_results(section, metric, value) VALUES
          ('cities', 'total', (SELECT COUNT(*)::text FROM cities)),
          ('cities', 'missing_name', (SELECT COUNT(*)::text FROM cities WHERE name IS NULL OR name = '')),
          ('cities', 'missing_slug', (SELECT COUNT(*)::text FROM cities WHERE slug IS NULL OR slug = '')),
          ('cities', 'missing_country_id', (SELECT COUNT(*)::text FROM cities WHERE country_id IS NULL)),
          ('cities', 'broken_country_id', (
            SELECT COUNT(*)::text FROM cities c
            LEFT JOIN countries co ON c.country_id = co.id
            WHERE c.country_id IS NOT NULL AND co.id IS NULL
          )),
          ('cities', 'duplicate_slug_groups', (
            SELECT COUNT(*)::text FROM (
              SELECT slug, COUNT(*) FROM cities GROUP BY slug HAVING COUNT(*) > 1
            ) dupes
          )),
          ('cities', 'created_at_min', (SELECT MIN(created_at)::text FROM cities)),
          ('cities', 'created_at_max', (SELECT MAX(created_at)::text FROM cities));
    ELSE
        INSERT INTO audit_core_results(section, metric, value, details)
        VALUES ('cities', 'table_missing', 'true', 'cities table does not exist');
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'media_files') THEN
        INSERT INTO audit_core_results(section, metric, value) VALUES
          ('media_files', 'total', (SELECT COUNT(*)::text FROM media_files)),
          ('media_files', 'missing_public_url', (SELECT COUNT(*)::text FROM media_files WHERE public_url IS NULL OR public_url = '')),
          ('media_files', 'missing_key', (SELECT COUNT(*)::text FROM media_files WHERE key IS NULL OR key = '')),
          ('media_files', 'size_sum_bytes', (SELECT COALESCE(SUM(size), 0)::text FROM media_files)),
          ('media_files', 'size_avg_bytes', (SELECT COALESCE(AVG(size), 0)::bigint::text FROM media_files)),
          ('media_files', 'created_at_min', (SELECT MIN(created_at)::text FROM media_files)),
          ('media_files', 'created_at_max', (SELECT MAX(created_at)::text FROM media_files));

        -- provider distribution as rows
        INSERT INTO audit_core_results(section, metric, value)
        SELECT 'media_files', 'provider.' || provider, COUNT(*)::text
        FROM media_files
        GROUP BY provider
        ORDER BY COUNT(*) DESC;
    ELSE
        INSERT INTO audit_core_results(section, metric, value, details)
        VALUES ('media_files', 'table_missing', 'true', 'media_files table does not exist');
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'content_blocks') THEN
        INSERT INTO audit_core_results(section, metric, value) VALUES
          ('content_blocks', 'total', (SELECT COUNT(*)::text FROM content_blocks)),
          ('content_blocks', 'missing_body_markdown', (SELECT COUNT(*)::text FROM content_blocks WHERE body_markdown IS NULL OR body_markdown = '')),
          ('content_blocks', 'body_markdown_lt_50', (SELECT COUNT(*)::text FROM content_blocks WHERE LENGTH(body_markdown) < 50)),
          ('content_blocks', 'created_at_min', (SELECT MIN(created_at)::text FROM content_blocks)),
          ('content_blocks', 'created_at_max', (SELECT MAX(created_at)::text FROM content_blocks));

        INSERT INTO audit_core_results(section, metric, value)
        SELECT 'content_blocks', 'entity_type.' || entity_type, COUNT(*)::text
        FROM content_blocks
        GROUP BY entity_type
        ORDER BY COUNT(*) DESC;

        INSERT INTO audit_core_results(section, metric, value)
        SELECT 'content_blocks', 'tab_key.' || tab_key, COUNT(*)::text
        FROM content_blocks
        GROUP BY tab_key
        ORDER BY COUNT(*) DESC;

        INSERT INTO audit_core_results(section, metric, value)
        SELECT 'content_blocks', 'lang.' || lang, COUNT(*)::text
        FROM content_blocks
        GROUP BY lang
        ORDER BY COUNT(*) DESC;

        INSERT INTO audit_core_results(section, metric, value)
        SELECT 'content_blocks', 'source.' || source, COUNT(*)::text
        FROM content_blocks
        GROUP BY source
        ORDER BY COUNT(*) DESC;
    ELSE
        INSERT INTO audit_core_results(section, metric, value, details)
        VALUES ('content_blocks', 'table_missing', 'true', 'content_blocks table does not exist');
    END IF;
END $$;

-- Final result set (удобно экспортировать из Neon)
SELECT section, metric, value, details
FROM audit_core_results
ORDER BY section, metric;
