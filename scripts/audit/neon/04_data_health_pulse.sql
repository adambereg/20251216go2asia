-- =====================================================================
-- 04_data_health_pulse.sql
-- Pulse Module Data Health Checks (Neon-friendly)
-- =====================================================================
--
-- Purpose:
--   - Health checks for Pulse entities: events, event_registrations
--
-- Design:
--   - Neon SQL Editor: no \echo, and NOTICE is hard to export
--   - Collect metrics into TEMP table + return single result set
--
-- Read-only: no UPDATE/DELETE (TEMP table only)
-- Defensive: handles missing tables via existence checks
-- =====================================================================

DROP TABLE IF EXISTS audit_pulse_results;
CREATE TEMP TABLE audit_pulse_results (
  section text NOT NULL,
  metric text NOT NULL,
  value text,
  details text
);

-- ---------------------------------------------------------------------
-- Events
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
    INSERT INTO audit_pulse_results(section, metric, value) VALUES
      ('events', 'total', (SELECT COUNT(*)::text FROM events)),
      ('events', 'created_at_min', (SELECT MIN(created_at)::text FROM events)),
      ('events', 'created_at_max', (SELECT MAX(updated_at)::text FROM events)),
      ('events', 'missing_title', (SELECT COUNT(*)::text FROM events WHERE title IS NULL OR title = '')),
      ('events', 'missing_slug', (SELECT COUNT(*)::text FROM events WHERE slug IS NULL OR slug = '')),
      ('events', 'missing_location', (SELECT COUNT(*)::text FROM events WHERE location IS NULL OR location = '')),
      ('events', 'missing_country_id', (SELECT COUNT(*)::text FROM events WHERE country_id IS NULL)),
      ('events', 'missing_city_id', (SELECT COUNT(*)::text FROM events WHERE city_id IS NULL)),
      -- Geo: align with API pattern (COALESCE(lat, latitude), etc.)
      ('events', 'missing_coords', (
        SELECT COUNT(*)::text
        FROM events
        WHERE COALESCE(lat, latitude) IS NULL OR COALESCE(lng, longitude) IS NULL
      )),
      -- Dates
      ('events', 'missing_start_date', (SELECT COUNT(*)::text FROM events WHERE start_date IS NULL)),
      ('events', 'missing_start_at', (SELECT COUNT(*)::text FROM events WHERE start_at IS NULL)),
      ('events', 'missing_end_date', (SELECT COUNT(*)::text FROM events WHERE end_date IS NULL)),
      ('events', 'missing_end_at', (SELECT COUNT(*)::text FROM events WHERE end_at IS NULL)),
      -- Media
      ('events', 'missing_image_media_id', (SELECT COUNT(*)::text FROM events WHERE image_media_id IS NULL)),
      ('events', 'missing_image_url', (SELECT COUNT(*)::text FROM events WHERE image_url IS NULL OR image_url = '')),
      ('events', 'missing_media_both', (
        SELECT COUNT(*)::text
        FROM events
        WHERE image_media_id IS NULL AND (image_url IS NULL OR image_url = '')
      )),
      -- Category
      ('events', 'missing_category', (SELECT COUNT(*)::text FROM events WHERE category IS NULL OR category = '')),
      -- Price
      ('events', 'free_events', (SELECT COUNT(*)::text FROM events WHERE is_free = true)),
      ('events', 'paid_events', (SELECT COUNT(*)::text FROM events WHERE is_free = false)),
      ('events', 'paid_without_currency', (
        SELECT COUNT(*)::text FROM events WHERE is_free = false AND price_currency IS NULL
      ));

    -- By status
    INSERT INTO audit_pulse_results(section, metric, value, details)
    SELECT 'events', 'by_status', COUNT(*)::text, status::text
    FROM events
    GROUP BY status
    ORDER BY COUNT(*) DESC;

    -- Date consistency
    INSERT INTO audit_pulse_results(section, metric, value) VALUES
      ('events', 'end_date_before_start_date', (
        SELECT COUNT(*)::text
        FROM events
        WHERE end_date IS NOT NULL AND start_date IS NOT NULL AND end_date < start_date
      )),
      ('events', 'end_at_before_start_at', (
        SELECT COUNT(*)::text
        FROM events
        WHERE end_at IS NOT NULL AND start_at IS NOT NULL AND end_at < start_at
      )),
      ('events', 'future_events_by_start_at', (
        SELECT COUNT(*)::text FROM events WHERE start_at IS NOT NULL AND start_at > NOW()
      )),
      ('events', 'past_events_by_end_at', (
        SELECT COUNT(*)::text FROM events WHERE end_at IS NOT NULL AND end_at < NOW()
      ));

    -- Broken references
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'countries') THEN
      INSERT INTO audit_pulse_results(section, metric, value)
      VALUES (
        'events',
        'broken_country_id',
        (
          SELECT COUNT(*)::text
          FROM events e
          LEFT JOIN countries co ON e.country_id = co.id
          WHERE e.country_id IS NOT NULL AND co.id IS NULL
        )
      );
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cities') THEN
      INSERT INTO audit_pulse_results(section, metric, value)
      VALUES (
        'events',
        'broken_city_id',
        (
          SELECT COUNT(*)::text
          FROM events e
          LEFT JOIN cities ci ON e.city_id = ci.id
          WHERE e.city_id IS NOT NULL AND ci.id IS NULL
        )
      );
    END IF;

  ELSE
    INSERT INTO audit_pulse_results(section, metric, value, details)
    VALUES ('events', 'table_missing', 'true', 'events table does not exist');
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- Event registrations
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_registrations') THEN
    INSERT INTO audit_pulse_results(section, metric, value) VALUES
      ('event_registrations', 'total', (SELECT COUNT(*)::text FROM event_registrations)),
      ('event_registrations', 'registered_at_min', (SELECT MIN(registered_at)::text FROM event_registrations)),
      ('event_registrations', 'registered_at_max', (SELECT MAX(registered_at)::text FROM event_registrations));

    INSERT INTO audit_pulse_results(section, metric, value, details)
    SELECT 'event_registrations', 'by_status', COUNT(*)::text, status::text
    FROM event_registrations
    GROUP BY status
    ORDER BY COUNT(*) DESC;

    -- Broken references to events
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
      INSERT INTO audit_pulse_results(section, metric, value) VALUES
        ('event_registrations', 'broken_event_id', (
          SELECT COUNT(*)::text
          FROM event_registrations er
          LEFT JOIN events e ON er.event_id = e.id
          WHERE e.id IS NULL
        )),
        ('event_registrations', 'events_with_registrations', (
          SELECT COUNT(DISTINCT event_id)::text FROM event_registrations
        ));
    END IF;
  ELSE
    INSERT INTO audit_pulse_results(section, metric, value, details)
    VALUES ('event_registrations', 'table_missing', 'true', 'event_registrations table does not exist');
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- Final result set
-- ---------------------------------------------------------------------
SELECT section, metric, value, details
FROM audit_pulse_results
ORDER BY section, metric, details;

