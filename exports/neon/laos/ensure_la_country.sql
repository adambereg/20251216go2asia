-- Ensure Laos exists (idempotent)
-- Minimal fields based on schema: countries(id, slug, name, code)

INSERT INTO countries (id, slug, name, code)
VALUES ('la', 'laos', 'Laos', 'LA')
ON CONFLICT (id) DO NOTHING;
