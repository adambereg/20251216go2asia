-- Pulse events: media_key SSOT + editorial fields (MVP)
-- Notes:
-- - Keep changes backward-compatible (nullable columns, safe defaults).
-- - Do NOT remove legacy columns yet (image_url/image_media_id/country_id/city_id).

ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "country_slug" text;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "city_slug" text;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "country_name" text;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "city_name" text;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "year" integer;
--> statement-breakpoint

ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "short_description" text;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "is_verified" boolean NOT NULL DEFAULT false;
--> statement-breakpoint

-- Media keys (Cloudflare R2 object keys, relative paths)
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "hero_media_key" text;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "gallery_media_keys" jsonb;
--> statement-breakpoint

-- Optional editorial/meta (used by importer, safe to ignore in UI)
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "official_url" text;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "seo_title" text;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "seo_description" text;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "geo_scope" text;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "primary_type" text;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "secondary_type" text;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "source_md_path" text;

