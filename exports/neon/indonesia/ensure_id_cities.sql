-- Ensure Indonesia cities exist (idempotent)
-- Depends on: ensure_id_country.sql
-- Minimal fields based on schema: cities(id, country_id, name, slug)

INSERT INTO cities (id, country_id, name, slug)
VALUES
  ('bali', 'id', 'Bali', 'bali'),
  ('jkt', 'id', 'Jakarta', 'jakarta'),
  ('yog', 'id', 'Yogyakarta', 'yogyakarta'),
  ('lbj', 'id', 'Labuan Bajo', 'labuan-bajo'),
  ('lom', 'id', 'Lombok', 'lombok')
ON CONFLICT (id) DO NOTHING;
