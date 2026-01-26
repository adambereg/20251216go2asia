-- Ensure Vietnam exists (idempotent)
-- Minimal fields based on schema: countries(id, slug, name, code)

INSERT INTO countries (id, slug, name, code)
VALUES ('vn', 'vietnam', 'Vietnam', 'VN')
ON CONFLICT (id) DO NOTHING;

