-- Ensure Vietnam cities exist (idempotent)
-- Depends on: ensure_vn_country.sql
-- Minimal fields based on schema: cities(id, country_id, name, slug)

INSERT INTO cities (id, country_id, name, slug)
VALUES
  ('hue', 'vn', 'Hue', 'hue'),
  ('hoi', 'vn', 'Hoi An', 'hoi-an'),
  ('dad', 'vn', 'Da Nang', 'da-nang'),
  ('dla', 'vn', 'Dalat', 'dalat'),
  ('ntr', 'vn', 'Nha Trang', 'nha-trang'),
  ('phu', 'vn', 'Phu Quoc', 'phu-quoc'),
  ('han', 'vn', 'Hanoi', 'hanoi'),
  ('sgn', 'vn', 'Ho Chi Minh City', 'ho-chi-minh-city')
ON CONFLICT (id) DO NOTHING;

