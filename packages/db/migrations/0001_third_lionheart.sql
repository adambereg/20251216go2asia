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
ALTER TABLE "articles" ALTER COLUMN "status" SET DATA TYPE article_status;--> statement-breakpoint
ALTER TABLE "event_registrations" ALTER COLUMN "status" SET DATA TYPE event_registration_status;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "price_amount" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "price_amount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "price_amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "price_currency" SET DATA TYPE char(3);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "status" SET DATA TYPE event_status;--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN "lat" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN "lng" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "start_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "lat" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "lng" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "lat" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "lng" numeric(9, 6);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cities_country_id" ON "cities" ("country_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_events_country_id" ON "events" ("country_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_events_city_id" ON "events" ("city_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_events_start_at" ON "events" ("start_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_places_country_id" ON "places" ("country_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_places_city_id" ON "places" ("city_id");
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_price_consistency"
 CHECK ((is_free AND price_amount = 0) OR ((NOT is_free) AND price_amount >= 0 AND price_currency IS NOT NULL));
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;