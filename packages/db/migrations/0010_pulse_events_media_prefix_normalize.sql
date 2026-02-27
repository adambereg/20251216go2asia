-- Pulse events: normalize media_prefix format (Canon v1.0)
-- Goals:
-- - ensure no bucket prefix (go2asia-media) leaks into stored keys
-- - ensure no leading slash
-- - ensure trailing slash (prefix semantics for R2 list)

UPDATE "events"
SET "media_prefix" = (
  regexp_replace(
    regexp_replace(
      regexp_replace(COALESCE("media_prefix", ''), '^.*go2asia-media/', ''), -- strip accidental bucket prefix
      '^/+',
      ''
    ),
    '/+$',
    ''
  ) || '/'
)
WHERE "media_prefix" IS NOT NULL AND "media_prefix" <> '';

