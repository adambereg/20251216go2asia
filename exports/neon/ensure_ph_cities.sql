-- Ensure PH country and required cities exist (staging/dev).
-- Minimal fields based on schema: countries(id, slug, name, code), cities(id, country_id, name, slug)

INSERT INTO countries (id, slug, name, code)
VALUES ('ph', 'philippines', 'Philippines', 'PH')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cities (id, country_id, name, slug)
VALUES
  ('mnl', 'ph', 'Manila', 'manila'),
  ('ceb', 'ph', 'Cebu', 'cebu'),
  ('pps', 'ph', 'Palawan', 'palawan'),
  ('tag', 'ph', 'Bohol', 'bohol'),
  ('srg', 'ph', 'Siargao', 'siargao'),
  ('dumaguete', 'ph', 'Dumaguete', 'dumaguete'),
  ('boracay', 'ph', 'Boracay', 'boracay')
ON CONFLICT (id) DO NOTHING;
