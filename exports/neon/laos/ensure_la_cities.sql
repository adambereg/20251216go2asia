-- Ensure Laos cities exist (idempotent)
-- Depends on: ensure_la_country.sql
-- Minimal fields based on schema: cities(id, country_id, name, slug)

INSERT INTO cities (id, country_id, name, slug)
VALUES
  ('lpq', 'la', 'Luang Prabang', 'luang-prabang'),
  ('vte', 'la', 'Vientiane', 'vientiane'),
  ('vvg', 'la', 'Vang Vieng', 'vang-vieng'),
  ('pkz', 'la', 'Pakse', 'pakse'),
  ('svk', 'la', 'Savannakhet', 'savannakhet')
ON CONFLICT (id) DO NOTHING;
