-- =====================================================================
-- 0019_rielt_core_v1.sql
-- Rielt service baseline schema for Step 8 listing-first domain
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status') THEN
    CREATE TYPE "listing_status" AS ENUM ('draft', 'published', 'archived');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_actor_role') THEN
    CREATE TYPE "listing_actor_role" AS ENUM ('owner', 'agent');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_inquiry_status') THEN
    CREATE TYPE "listing_inquiry_status" AS ENUM ('new', 'viewed', 'closed');
  END IF;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "rielt_listing" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" varchar(180) NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "listing_type" varchar(24) NOT NULL,
  "status" "listing_status" DEFAULT 'draft' NOT NULL,
  "price_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
  "price_currency" varchar(3) NOT NULL,
  "price_period" varchar(16) NOT NULL,
  "country_id" text NOT NULL,
  "city_id" text,
  "area_text" text,
  "lat" numeric(9, 6),
  "lng" numeric(9, 6),
  "bedrooms" integer,
  "bathrooms" integer,
  "area_sqm" numeric(8, 2),
  "amenities" text[] DEFAULT ARRAY[]::text[] NOT NULL,
  "created_by_user_id" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "published_at" timestamp,
  "archived_at" timestamp,
  "deleted_at" timestamp
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "rielt_listing_media" (
  "id" text PRIMARY KEY NOT NULL,
  "listing_id" text NOT NULL REFERENCES "rielt_listing"("id") ON DELETE cascade,
  "media_id" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_cover" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "deleted_at" timestamp
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "rielt_listing_actor_link" (
  "id" text PRIMARY KEY NOT NULL,
  "listing_id" text NOT NULL REFERENCES "rielt_listing"("id") ON DELETE cascade,
  "actor_user_id" text NOT NULL,
  "actor_role" "listing_actor_role" NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "revoked_at" timestamp,
  "deleted_at" timestamp
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "rielt_listing_inquiry" (
  "id" text PRIMARY KEY NOT NULL,
  "listing_id" text NOT NULL REFERENCES "rielt_listing"("id") ON DELETE cascade,
  "requester_user_id" text NOT NULL,
  "message" text NOT NULL,
  "contact_name" varchar(120),
  "contact_phone" varchar(40),
  "contact_telegram" varchar(80),
  "status" "listing_inquiry_status" DEFAULT 'new' NOT NULL,
  "idempotency_key" varchar(80) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "closed_at" timestamp,
  "deleted_at" timestamp
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rielt_listing_slug_unique"
  ON "rielt_listing" ("slug");
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rielt_listing_media_listing_id_media_id_unique"
  ON "rielt_listing_media" ("listing_id", "media_id")
  WHERE "deleted_at" IS NULL;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rielt_listing_media_listing_id_sort_order_unique"
  ON "rielt_listing_media" ("listing_id", "sort_order")
  WHERE "deleted_at" IS NULL;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rielt_listing_actor_link_listing_user_role_unique"
  ON "rielt_listing_actor_link" ("listing_id", "actor_user_id", "actor_role")
  WHERE "revoked_at" IS NULL AND "deleted_at" IS NULL;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rielt_listing_actor_link_active_owner_unique"
  ON "rielt_listing_actor_link" ("listing_id")
  WHERE "actor_role" = 'owner' AND "revoked_at" IS NULL AND "deleted_at" IS NULL;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rielt_listing_inquiry_user_listing_idempotency_unique"
  ON "rielt_listing_inquiry" ("requester_user_id", "listing_id", "idempotency_key");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_status_country_city_updated_at"
  ON "rielt_listing" ("status", "country_id", "city_id", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_country_city_type_price"
  ON "rielt_listing" ("country_id", "city_id", "listing_type", "price_amount");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_created_by_status_updated_at"
  ON "rielt_listing" ("created_by_user_id", "status", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_geo_published_at"
  ON "rielt_listing" ("lat", "lng", "published_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_media_listing_sort_order"
  ON "rielt_listing_media" ("listing_id", "sort_order");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_media_media_id"
  ON "rielt_listing_media" ("media_id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_actor_link_user_role_listing"
  ON "rielt_listing_actor_link" ("actor_user_id", "actor_role", "listing_id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_actor_link_listing_role_user"
  ON "rielt_listing_actor_link" ("listing_id", "actor_role", "actor_user_id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_inquiry_listing_status_created_at"
  ON "rielt_listing_inquiry" ("listing_id", "status", "created_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_inquiry_requester_created_at"
  ON "rielt_listing_inquiry" ("requester_user_id", "created_at");
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_title_not_blank_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_title_not_blank_check"
      CHECK (length(trim("title")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_description_not_blank_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_description_not_blank_check"
      CHECK (length(trim("description")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_listing_type_not_blank_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_listing_type_not_blank_check"
      CHECK (length(trim("listing_type")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_listing_type_allowed_values_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_listing_type_allowed_values_check"
      CHECK ("listing_type" IN ('rent_long', 'rent_short', 'sale'));
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_price_currency_length_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_price_currency_length_check"
      CHECK (length(trim("price_currency")) = 3);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_price_period_allowed_values_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_price_period_allowed_values_check"
      CHECK ("price_period" IN ('month', 'day', 'total'));
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_price_amount_non_negative_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_price_amount_non_negative_check"
      CHECK ("price_amount" >= 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_bedrooms_non_negative_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_bedrooms_non_negative_check"
      CHECK ("bedrooms" IS NULL OR "bedrooms" >= 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_bathrooms_non_negative_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_bathrooms_non_negative_check"
      CHECK ("bathrooms" IS NULL OR "bathrooms" >= 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_lat_lng_pair_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_lat_lng_pair_check"
      CHECK ((("lat" IS NULL AND "lng" IS NULL) OR ("lat" IS NOT NULL AND "lng" IS NOT NULL)));
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_lat_range_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_lat_range_check"
      CHECK ("lat" IS NULL OR ("lat" >= -90 AND "lat" <= 90));
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_lng_range_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_lng_range_check"
      CHECK ("lng" IS NULL OR ("lng" >= -180 AND "lng" <= 180));
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_media_sort_order_non_negative_check') THEN
    ALTER TABLE "rielt_listing_media"
      ADD CONSTRAINT "rielt_listing_media_sort_order_non_negative_check"
      CHECK ("sort_order" >= 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_inquiry_message_not_blank_check') THEN
    ALTER TABLE "rielt_listing_inquiry"
      ADD CONSTRAINT "rielt_listing_inquiry_message_not_blank_check"
      CHECK (length(trim("message")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_inquiry_idempotency_key_not_blank_check') THEN
    ALTER TABLE "rielt_listing_inquiry"
      ADD CONSTRAINT "rielt_listing_inquiry_idempotency_key_not_blank_check"
      CHECK (length(trim("idempotency_key")) > 0);
  END IF;
END $$;
