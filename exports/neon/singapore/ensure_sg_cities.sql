-- Ensure Singapore cities exist (idempotent)
-- Depends on: ensure_sg_country.sql
-- Minimal fields based on schema: cities(id, country_id, name, slug)

INSERT INTO cities (id, country_id, name, slug)
VALUES
  ('sgp', 'sg', 'Singapore', 'singapore')
ON CONFLICT (id) DO NOTHING;
