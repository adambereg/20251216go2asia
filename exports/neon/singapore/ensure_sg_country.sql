-- Ensure Singapore exists (idempotent)
-- Minimal fields based on schema: countries(id, slug, name, code)

INSERT INTO countries (id, slug, name, code)
VALUES ('sg', 'singapore', 'Singapore', 'SG')
ON CONFLICT (id) DO NOTHING;
