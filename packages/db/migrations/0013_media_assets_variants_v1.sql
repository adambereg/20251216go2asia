-- =====================================================================
-- 0013_media_assets_variants_v1.sql
-- Minimal media domain layer for media-service v1
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_asset_status') THEN
    CREATE TYPE "media_asset_status" AS ENUM ('draft', 'published', 'archived');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_variant_kind') THEN
    CREATE TYPE "media_variant_kind" AS ENUM ('original', 'thumbnail', 'webp', 'avif');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_variant_status') THEN
    CREATE TYPE "media_variant_status" AS ENUM ('pending', 'ready', 'failed');
  END IF;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "media_assets" (
  "id" text PRIMARY KEY NOT NULL,
  "owner_user_id" text NOT NULL,
  "scope" varchar(32) NOT NULL,
  "provider" varchar(20) DEFAULT 'r2' NOT NULL,
  "bucket" text NOT NULL,
  "key" text NOT NULL,
  "mime_type" varchar(100) NOT NULL,
  "size" integer NOT NULL,
  "width" integer,
  "height" integer,
  "status" "media_asset_status" DEFAULT 'draft' NOT NULL,
  "attached_entity_type" text,
  "attached_entity_id" text,
  "attached_slot" text,
  "attached_at" timestamp,
  "published_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "media_assets_provider_bucket_key_unique"
  ON "media_assets" ("provider", "bucket", "key");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_media_assets_owner_status_created_at"
  ON "media_assets" ("owner_user_id", "status", "created_at");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "media_variants" (
  "id" text PRIMARY KEY NOT NULL,
  "asset_id" text NOT NULL,
  "kind" "media_variant_kind" NOT NULL,
  "status" "media_variant_status" DEFAULT 'ready' NOT NULL,
  "provider" varchar(20) DEFAULT 'r2' NOT NULL,
  "bucket" text NOT NULL,
  "key" text NOT NULL,
  "mime_type" varchar(100) NOT NULL,
  "size" integer NOT NULL,
  "width" integer,
  "height" integer,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "media_variants_asset_kind_unique"
  ON "media_variants" ("asset_id", "kind");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_media_variants_asset_id"
  ON "media_variants" ("asset_id");
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'media_variants_asset_id_media_assets_id_fk'
  ) THEN
    ALTER TABLE "media_variants"
      ADD CONSTRAINT "media_variants_asset_id_media_assets_id_fk"
      FOREIGN KEY ("asset_id")
      REFERENCES "public"."media_assets"("id")
      ON DELETE cascade
      ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint
