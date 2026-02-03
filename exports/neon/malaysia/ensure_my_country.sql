-- Ensure Malaysia exists (idempotent)
-- Minimal fields based on schema: countries(id, slug, name, code)

INSERT INTO countries (id, slug, name, code)
VALUES ('my', 'malaysia', 'Malaysia', 'MY')
ON CONFLICT (id) DO NOTHING;
