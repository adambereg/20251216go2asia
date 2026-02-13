-- =====================================================================
-- 03_data_health_atlas.sql
-- Atlas Module Data Health Checks (Neon-friendly)
-- =====================================================================
--
-- Purpose:
--   - Health checks for Atlas entities: countries, cities, places
--   - Coverage checks: places ↔ content_blocks (place/overview)
--
-- Design:
--   - Neon SQL Editor does NOT support psql meta-commands like \echo
--   - DO blocks with RAISE NOTICE are hard to export
--   - Therefore: collect metrics into a TEMP table + return a single result set
--
-- Read-only: no UPDATE/DELETE (TEMP table only)
-- Defensive: handles missing tables via existence checks
-- =====================================================================

DROP TABLE IF EXISTS audit_atlas_results;
CREATE TEMP TABLE audit_atlas_results (
  section text NOT NULL,
  metric text NOT NULL,
  value text,
  details text
);

-- ---------------------------------------------------------------------
-- Places
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'places') THEN
    INSERT INTO audit_atlas_results(section, metric, value) VALUES
      ('places', 'total', (SELECT COUNT(*)::text FROM places)),
      ('places', 'created_at_min', (SELECT MIN(created_at)::text FROM places)),
      ('places', 'created_at_max', (SELECT MAX(updated_at)::text FROM places)),
      ('places', 'missing_name', (SELECT COUNT(*)::text FROM places WHERE name IS NULL OR name = '')),
      ('places', 'missing_slug', (SELECT COUNT(*)::text FROM places WHERE slug IS NULL OR slug = '')),
      ('places', 'missing_type', (SELECT COUNT(*)::text FROM places WHERE type IS NULL OR type = '')),
      ('places', 'missing_place_kind', (SELECT COUNT(*)::text FROM places WHERE place_kind IS NULL OR place_kind = '')),
      -- Geo: align with API (COALESCE(lat, latitude) / COALESCE(lng, longitude))
      ('places', 'missing_coords', (
        SELECT COUNT(*)::text
        FROM places
        WHERE COALESCE(lat, latitude) IS NULL OR COALESCE(lng, longitude) IS NULL
      )),
      ('places', 'missing_country_id', (SELECT COUNT(*)::text FROM places WHERE country_id IS NULL)),
      ('places', 'missing_city_id', (SELECT COUNT(*)::text FROM places WHERE city_id IS NULL)),
      ('places', 'missing_description_short', (
        SELECT COUNT(*)::text FROM places WHERE description_short IS NULL OR description_short = ''
      )),
      ('places', 'missing_hero_media_id', (SELECT COUNT(*)::text FROM places WHERE hero_media_id IS NULL)),
      ('places', 'missing_tags', (
        SELECT COUNT(*)::text
        FROM places
        WHERE tags IS NULL OR jsonb_array_length(tags) = 0
      )),
      ('places', 'missing_images', (
        SELECT COUNT(*)::text
        FROM places
        WHERE images IS NULL OR jsonb_array_length(images) = 0
      ));

    -- Distribution: by kind
    INSERT INTO audit_atlas_results(section, metric, value, details)
    SELECT 'places', 'by_place_kind', COUNT(*)::text, place_kind
    FROM places
    GROUP BY place_kind
    ORDER BY COUNT(*) DESC;

    -- Duplicate slug groups (count of slug groups with cnt>1)
    INSERT INTO audit_atlas_results(section, metric, value)
    VALUES (
      'places',
      'duplicate_slug_groups',
      (
        SELECT COUNT(*)::text
        FROM (SELECT slug FROM places GROUP BY slug HAVING COUNT(*) > 1) dup
      )
    );

    -- Broken references (logical check via LEFT JOIN; FK may exist but still useful)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'countries') THEN
      INSERT INTO audit_atlas_results(section, metric, value)
      VALUES (
        'places',
        'broken_country_id',
        (
          SELECT COUNT(*)::text
          FROM places p
          LEFT JOIN countries co ON p.country_id = co.id
          WHERE p.country_id IS NOT NULL AND co.id IS NULL
        )
      );
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cities') THEN
      INSERT INTO audit_atlas_results(section, metric, value)
      VALUES (
        'places',
        'broken_city_id',
        (
          SELECT COUNT(*)::text
          FROM places p
          LEFT JOIN cities ci ON p.city_id = ci.id
          WHERE p.city_id IS NOT NULL AND ci.id IS NULL
        )
      );
    END IF;

    -- Top distributions (optional but useful for spotting gaps)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'countries') THEN
      INSERT INTO audit_atlas_results(section, metric, value, details)
      SELECT 'places', 'top_by_country', COUNT(*)::text, COALESCE(co.name, '(null)')
      FROM places p
      LEFT JOIN countries co ON p.country_id = co.id
      GROUP BY COALESCE(co.name, '(null)')
      ORDER BY COUNT(*) DESC
      LIMIT 10;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cities') THEN
      INSERT INTO audit_atlas_results(section, metric, value, details)
      SELECT 'places', 'top_by_city', COUNT(*)::text, COALESCE(ci.name, '(null)')
      FROM places p
      LEFT JOIN cities ci ON p.city_id = ci.id
      GROUP BY COALESCE(ci.name, '(null)')
      ORDER BY COUNT(*) DESC
      LIMIT 10;
    END IF;
  ELSE
    INSERT INTO audit_atlas_results(section, metric, value, details)
    VALUES ('places', 'table_missing', 'true', 'places table does not exist');
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- Content blocks coverage for places
-- ---------------------------------------------------------------------
DO $$
DECLARE
  total_places bigint;
  places_with_overview_all bigint;
  places_with_overview_existing bigint;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'places')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'content_blocks') THEN

    SELECT COUNT(*) INTO total_places FROM places;

    SELECT COUNT(DISTINCT cb.entity_id)
    INTO places_with_overview_all
    FROM content_blocks cb
    WHERE cb.entity_type = 'place'
      AND cb.tab_key = 'overview'
      AND cb.lang = 'ru';

    SELECT COUNT(DISTINCT cb.entity_id)
    INTO places_with_overview_existing
    FROM content_blocks cb
    JOIN places p ON p.id = cb.entity_id
    WHERE cb.entity_type = 'place'
      AND cb.tab_key = 'overview'
      AND cb.lang = 'ru';

    INSERT INTO audit_atlas_results(section, metric, value) VALUES
      ('content_blocks_coverage', 'places_with_overview_ru_all', places_with_overview_all::text),
      ('content_blocks_coverage', 'places_with_overview_ru_existing', places_with_overview_existing::text),
      ('content_blocks_coverage', 'place_overview_ru_orphan_entity_ids', (
        SELECT COUNT(DISTINCT cb.entity_id)::text
        FROM content_blocks cb
        LEFT JOIN places p ON p.id = cb.entity_id
        WHERE cb.entity_type = 'place'
          AND cb.tab_key = 'overview'
          AND cb.lang = 'ru'
          AND p.id IS NULL
      )),
      ('content_blocks_coverage', 'places_missing_overview_ru', (
        SELECT COUNT(*)::text
        FROM places p
        LEFT JOIN content_blocks cb
          ON cb.entity_type = 'place'
         AND cb.entity_id = p.id
         AND cb.tab_key = 'overview'
         AND cb.lang = 'ru'
        WHERE cb.id IS NULL
      )),
      ('content_blocks_coverage', 'coverage_rate_overview_ru_pct', (
        CASE WHEN total_places > 0
          THEN ROUND((places_with_overview_existing::numeric * 100.0) / total_places::numeric, 2)::text
          ELSE NULL
        END
      ));

    -- Missing overview by country (top 10)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'countries') THEN
      INSERT INTO audit_atlas_results(section, metric, value, details)
      SELECT
        'content_blocks_coverage',
        'missing_overview_ru_by_country_top10',
        COUNT(*)::text,
        COALESCE(co.name, '(null)')
      FROM places p
      LEFT JOIN countries co ON p.country_id = co.id
      LEFT JOIN content_blocks cb
        ON cb.entity_type = 'place'
       AND cb.entity_id = p.id
       AND cb.tab_key = 'overview'
       AND cb.lang = 'ru'
      WHERE cb.id IS NULL
      GROUP BY COALESCE(co.name, '(null)')
      ORDER BY COUNT(*) DESC
      LIMIT 10;
    END IF;

    -- Missing overview by kind
    INSERT INTO audit_atlas_results(section, metric, value, details)
    SELECT
      'content_blocks_coverage',
      'missing_overview_ru_by_place_kind',
      COUNT(*)::text,
      p.place_kind
    FROM places p
    LEFT JOIN content_blocks cb
      ON cb.entity_type = 'place'
     AND cb.entity_id = p.id
     AND cb.tab_key = 'overview'
     AND cb.lang = 'ru'
    WHERE cb.id IS NULL
    GROUP BY p.place_kind
    ORDER BY COUNT(*) DESC;

    -- Content length stats for place/overview/ru
    INSERT INTO audit_atlas_results(section, metric, value) VALUES
      ('content_blocks_quality', 'place_overview_ru_len_min', (
        SELECT MIN(LENGTH(body_markdown))::text
        FROM content_blocks
        WHERE entity_type = 'place' AND tab_key = 'overview' AND lang = 'ru'
      )),
      ('content_blocks_quality', 'place_overview_ru_len_avg', (
        SELECT AVG(LENGTH(body_markdown))::int::text
        FROM content_blocks
        WHERE entity_type = 'place' AND tab_key = 'overview' AND lang = 'ru'
      )),
      ('content_blocks_quality', 'place_overview_ru_len_max', (
        SELECT MAX(LENGTH(body_markdown))::text
        FROM content_blocks
        WHERE entity_type = 'place' AND tab_key = 'overview' AND lang = 'ru'
      )),
      ('content_blocks_quality', 'place_overview_ru_len_lt_100', (
        SELECT COUNT(*)::text
        FROM content_blocks
        WHERE entity_type = 'place'
          AND tab_key = 'overview'
          AND lang = 'ru'
          AND LENGTH(body_markdown) < 100
      ));

    -- Tab coverage for places (all tab_key/lang)
    INSERT INTO audit_atlas_results(section, metric, value, details)
    SELECT
      'content_blocks_coverage',
      'place_tabs',
      COUNT(*)::text,
      tab_key || ' / ' || lang
    FROM content_blocks
    WHERE entity_type = 'place'
    GROUP BY tab_key, lang
    ORDER BY COUNT(*) DESC;

  ELSE
    INSERT INTO audit_atlas_results(section, metric, value, details)
    VALUES ('content_blocks_coverage', 'tables_missing', 'true', 'places or content_blocks table does not exist');
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- Countries / Cities coverage
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'countries') THEN
    INSERT INTO audit_atlas_results(section, metric, value) VALUES
      ('countries', 'total', (SELECT COUNT(*)::text FROM countries)),
      ('countries', 'with_places', (
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'places')
          THEN (SELECT COUNT(DISTINCT country_id)::text FROM places WHERE country_id IS NOT NULL)
          ELSE NULL
        END
      )),
      ('countries', 'with_content_blocks', (
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'content_blocks')
          THEN (SELECT COUNT(DISTINCT entity_id)::text FROM content_blocks WHERE entity_type = 'country' AND lang = 'ru')
          ELSE NULL
        END
      ));
  ELSE
    INSERT INTO audit_atlas_results(section, metric, value, details)
    VALUES ('countries', 'table_missing', 'true', 'countries table does not exist');
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cities') THEN
    INSERT INTO audit_atlas_results(section, metric, value) VALUES
      ('cities', 'total', (SELECT COUNT(*)::text FROM cities)),
      ('cities', 'with_places', (
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'places')
          THEN (SELECT COUNT(DISTINCT city_id)::text FROM places WHERE city_id IS NOT NULL)
          ELSE NULL
        END
      )),
      ('cities', 'without_places', (
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'places')
          THEN (
            SELECT COUNT(*)::text
            FROM cities ci
            LEFT JOIN places p ON p.city_id = ci.id
            WHERE p.id IS NULL
          )
          ELSE NULL
        END
      )),
      ('cities', 'with_content_blocks', (
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'content_blocks')
          THEN (SELECT COUNT(DISTINCT entity_id)::text FROM content_blocks WHERE entity_type = 'city' AND lang = 'ru')
          ELSE NULL
        END
      ));
  ELSE
    INSERT INTO audit_atlas_results(section, metric, value, details)
    VALUES ('cities', 'table_missing', 'true', 'cities table does not exist');
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- Final result set (export-friendly)
-- ---------------------------------------------------------------------
SELECT section, metric, value, details
FROM audit_atlas_results
ORDER BY section, metric, details;
