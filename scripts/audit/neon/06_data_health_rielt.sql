-- =====================================================================
-- 06_data_health_rielt.sql
-- Rielt Module Data Health Checks (Neon-friendly)
-- =====================================================================
--
-- Purpose:
--   - Check whether Rielt tables exist yet (MVP may not include them)
--   - If they exist, run a few basic health checks
--
-- Design:
--   - Return a single result set (TEMP table)
--   - Defensive: do not fail if tables are absent
-- =====================================================================

DROP TABLE IF EXISTS audit_rielt_results;
CREATE TEMP TABLE audit_rielt_results (
  section text NOT NULL,
  metric text NOT NULL,
  value text,
  details text
);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'listings') THEN
    INSERT INTO audit_rielt_results(section, metric, value) VALUES
      ('rielt', 'table', 'listings'),
      ('rielt.listings', 'total', (SELECT COUNT(*)::text FROM listings));

    -- Best-effort common fields (only if columns exist)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'price'
    ) THEN
      INSERT INTO audit_rielt_results(section, metric, value)
      VALUES ('rielt.listings', 'missing_price', (SELECT COUNT(*)::text FROM listings WHERE price IS NULL));
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'location'
    ) THEN
      INSERT INTO audit_rielt_results(section, metric, value)
      VALUES ('rielt.listings', 'missing_location', (SELECT COUNT(*)::text FROM listings WHERE location IS NULL OR location = ''));
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'city_id'
    ) THEN
      INSERT INTO audit_rielt_results(section, metric, value)
      VALUES ('rielt.listings', 'missing_city_id', (SELECT COUNT(*)::text FROM listings WHERE city_id IS NULL));
    END IF;

  ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'properties') THEN
    INSERT INTO audit_rielt_results(section, metric, value) VALUES
      ('rielt', 'table', 'properties'),
      ('rielt.properties', 'total', (SELECT COUNT(*)::text FROM properties));

  ELSE
    INSERT INTO audit_rielt_results(section, metric, value, details)
    VALUES ('rielt', 'tables_present', 'false', 'No listings/properties tables found (expected for MVP)');

    -- If there are any rielt-like tables, list them
    INSERT INTO audit_rielt_results(section, metric, value, details)
    SELECT
      'rielt',
      'possible_table',
      'found',
      table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND (table_name ILIKE '%rielt%' OR table_name ILIKE '%listing%' OR table_name ILIKE '%property%')
    ORDER BY table_name;
  END IF;
END $$;

SELECT section, metric, value, details
FROM audit_rielt_results
ORDER BY section, metric, details;

