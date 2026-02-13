-- Ensure Malaysia cities exist (idempotent)
-- Depends on: ensure_my_country.sql
-- Minimal fields based on schema: cities(id, country_id, name, slug)

INSERT INTO cities (id, country_id, name, slug)
VALUES
  ('kll', 'my', 'Kuala Lumpur', 'kuala-lumpur'),
  ('png', 'my', 'Penang', 'penang'),
  ('lgk', 'my', 'Langkawi', 'langkawi'),
  ('mkz', 'my', 'Melaka', 'melaka'),
  ('bki', 'my', 'Kota Kinabalu', 'kota-kinabalu')
ON CONFLICT (id) DO NOTHING;
