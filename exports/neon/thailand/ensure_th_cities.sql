-- Ensure Thailand cities exist (idempotent)
-- Depends on: ensure_th_country.sql
-- Minimal fields based on schema: cities(id, country_id, name, slug)

INSERT INTO cities (id, country_id, name, slug)
VALUES
  ('bkk', 'th', 'Bangkok', 'bangkok'),
  ('cnx', 'th', 'Chiang Mai', 'chiang-mai'),
  ('phk', 'th', 'Phuket', 'phuket'),
  ('pty', 'th', 'Pattaya', 'pattaya'),
  ('kbi', 'th', 'Krabi', 'krabi'),
  ('usm', 'th', 'Koh Samui', 'koh-samui'),
  ('hhn', 'th', 'Hua Hin', 'hua-hin'),
  ('aya', 'th', 'Ayutthaya', 'ayutthaya')
ON CONFLICT (id) DO NOTHING;
