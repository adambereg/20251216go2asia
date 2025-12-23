-- =====================================================================
-- 0001_third_lionheart.sql
-- Micro-fixes: ENUMs, SSOT lat/lng, start_at/end_at, price normalization
-- =====================================================================

-- 1) Create ENUMs (idempotent via DO block)
DO $$ BEGIN
 CREATE TYPE "article_status" AS ENUM('draft', 'published', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "event_registration_status" AS ENUM('registered', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "event_status" AS ENUM('draft', 'active', 'cancelled', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- 2) articles.status: varchar -> article_status ENUM
--    Must drop default, change type with bulletproof CASE, then re-add default
ALTER TABLE "articles" ALTER COLUMN "status" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "articles"
  ALTER COLUMN "status" SET DATA TYPE article_status
  USING (
    CASE lower(trim(coalesce("status", 'draft')))
      WHEN 'draft' THEN 'draft'::article_status
      WHEN 'published' THEN 'published'::article_status
      WHEN 'archived' THEN 'archived'::article_status
      ELSE 'draft'::article_status  -- fallback for unknown values
    END
  );
--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "status" SET DEFAULT 'draft'::article_status;
--> statement-breakpoint

-- 3) event_registrations.status: varchar -> event_registration_status ENUM
ALTER TABLE "event_registrations" ALTER COLUMN "status" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "event_registrations"
  ALTER COLUMN "status" SET DATA TYPE event_registration_status
  USING (
    CASE lower(trim(coalesce("status", 'registered')))
      WHEN 'registered' THEN 'registered'::event_registration_status
      WHEN 'cancelled' THEN 'cancelled'::event_registration_status
      WHEN 'canceled' THEN 'cancelled'::event_registration_status  -- handle typo
      ELSE 'registered'::event_registration_status  -- fallback
    END
  );
--> statement-breakpoint
ALTER TABLE "event_registrations" ALTER COLUMN "status" SET DEFAULT 'registered'::event_registration_status;
--> statement-breakpoint

-- 4) events.price_amount: integer -> numeric(12,2) with null normalization
ALTER TABLE "events"
  ALTER COLUMN "price_amount" SET DATA TYPE numeric(12, 2)
  USING COALESCE("price_amount", 0)::numeric(12, 2);
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "price_amount" SET DEFAULT 0;
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "price_amount" SET NOT NULL;
--> statement-breakpoint

-- 5) events.price_currency: varchar(10) -> char(3) ISO code
ALTER TABLE "events"
  ALTER COLUMN "price_currency" SET DATA TYPE char(3)
  USING (
    CASE
      WHEN "price_currency" IS NULL THEN NULL
      ELSE LEFT(UPPER(trim("price_currency")), 3)::char(3)
    END
  );
--> statement-breakpoint

-- 6) events.status: varchar -> event_status ENUM
ALTER TABLE "events" ALTER COLUMN "status" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "events"
  ALTER COLUMN "status" SET DATA TYPE event_status
  USING (
    CASE lower(trim(coalesce("status", 'active')))
      WHEN 'draft' THEN 'draft'::event_status
      WHEN 'active' THEN 'active'::event_status
      WHEN 'published' THEN 'active'::event_status  -- map 'published' -> 'active'
      WHEN 'scheduled' THEN 'active'::event_status  -- map 'scheduled' -> 'active'
      WHEN 'cancelled' THEN 'cancelled'::event_status
      WHEN 'canceled' THEN 'cancelled'::event_status  -- handle typo
      WHEN 'archived' THEN 'archived'::event_status
      WHEN 'past' THEN 'archived'::event_status  -- map 'past' -> 'archived'
      ELSE 'active'::event_status  -- fallback for unknown
    END
  );
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'active'::event_status;
--> statement-breakpoint

-- 7) Add SSOT coordinate columns to cities
ALTER TABLE "cities" ADD COLUMN IF NOT EXISTS "lat" numeric(9, 6);
--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN IF NOT EXISTS "lng" numeric(9, 6);
--> statement-breakpoint

-- 8) Add SSOT datetime + coordinate columns to events
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "start_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "end_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "lat" numeric(9, 6);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "lng" numeric(9, 6);
--> statement-breakpoint

-- 9) Add SSOT coordinate columns to places
ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "lat" numeric(9, 6);
--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "lng" numeric(9, 6);
--> statement-breakpoint

-- 10) Create indexes on FK columns for query performance
CREATE INDEX IF NOT EXISTS "idx_cities_country_id" ON "cities" ("country_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_events_country_id" ON "events" ("country_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_events_city_id" ON "events" ("city_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_events_start_at" ON "events" ("start_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_places_country_id" ON "places" ("country_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_places_city_id" ON "places" ("city_id");
--> statement-breakpoint

-- 11) Add price consistency CHECK constraint (idempotent)
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_price_consistency"
 CHECK ((is_free AND price_amount = 0) OR ((NOT is_free) AND price_amount >= 0 AND price_currency IS NOT NULL));
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
