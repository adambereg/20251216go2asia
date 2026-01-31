-- Ensure Thailand exists (idempotent)
-- Minimal fields based on schema: countries(id, slug, name, code)

INSERT INTO countries (id, slug, name, code)
VALUES ('th', 'thailand', 'Thailand', 'TH')
ON CONFLICT (id) DO NOTHING;
