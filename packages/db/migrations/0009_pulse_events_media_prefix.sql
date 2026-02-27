-- Pulse events: add canonical media_prefix (Canon v1.0)
-- Notes:
-- - Keep backward-compatible. We add the column and backfill deterministically.
-- - Canon expects media_prefix to be required; we backfill for existing rows.

ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "media_prefix" text;
--> statement-breakpoint

-- Backfill media_prefix for existing events.
-- Priority:
-- 1) country_slug + year + slug
-- 2) source_md_path (content/pulse/<country>/<year>/<slug>.md)
-- 3) fallback: country_slug or 'unknown' + derived year from start_at/start_date + slug
UPDATE "events"
SET "media_prefix" = COALESCE(
  NULLIF("media_prefix", ''),
  CASE
    WHEN "country_slug" IS NOT NULL AND "year" IS NOT NULL AND "slug" IS NOT NULL
      THEN 'events/' || "country_slug" || '/' || "year"::text || '/' || "slug"
    ELSE NULL
  END,
  CASE
    WHEN "source_md_path" ~ '^content/pulse/[^/]+/[0-9]{4}/[^/]+\\.md$' THEN
      'events/'
      || split_part("source_md_path", '/', 3)
      || '/'
      || split_part("source_md_path", '/', 4)
      || '/'
      || replace(split_part("source_md_path", '/', 5), '.md', '')
    ELSE NULL
  END,
  'events/'
    || COALESCE("country_slug", 'unknown')
    || '/'
    || COALESCE("year", EXTRACT(YEAR FROM COALESCE("start_at", "start_date"))::int)::text
    || '/'
    || COALESCE("slug", "id")
)
WHERE "media_prefix" IS NULL OR "media_prefix" = '';
--> statement-breakpoint

-- Make it required for new writes (Canon). Existing rows should be backfilled above.
ALTER TABLE "events" ALTER COLUMN "media_prefix" SET NOT NULL;

