-- Ensure Indonesia exists (idempotent)
-- Minimal fields based on schema: countries(id, slug, name, code)

INSERT INTO countries (id, slug, name, code)
VALUES ('id', 'indonesia', 'Indonesia', 'ID')
ON CONFLICT (id) DO NOTHING;
