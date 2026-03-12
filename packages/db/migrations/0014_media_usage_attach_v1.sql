-- =====================================================================
-- 0014_media_usage_attach_v1.sql
-- Media usage bind layer + lifecycle status extensions
-- =====================================================================

ALTER TYPE "media_asset_status" ADD VALUE IF NOT EXISTS 'uploading';
--> statement-breakpoint
ALTER TYPE "media_asset_status" ADD VALUE IF NOT EXISTS 'uploaded';
--> statement-breakpoint
ALTER TYPE "media_asset_status" ADD VALUE IF NOT EXISTS 'attached';
--> statement-breakpoint
ALTER TYPE "media_asset_status" ADD VALUE IF NOT EXISTS 'deleted';
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_usage_owner_type') THEN
    CREATE TYPE "media_usage_owner_type" AS ENUM (
      'user',
      'space_post',
      'rielt_listing',
      'rf_partner',
      'quest_submission',
      'blog_post',
      'atlas_entity'
    );
  END IF;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "media_usage" (
  "id" text PRIMARY KEY NOT NULL,
  "media_id" text NOT NULL,
  "owner_type" "media_usage_owner_type" NOT NULL,
  "owner_id" text NOT NULL,
  "usage_type" varchar(64) NOT NULL,
  "slot" varchar(64),
  "created_at" timestamp DEFAULT now() NOT NULL,
  "deleted_at" timestamp
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "media_usage_unique"
  ON "media_usage" ("media_id", "owner_type", "owner_id", "usage_type", "slot");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_media_usage_media_id"
  ON "media_usage" ("media_id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_media_usage_owner"
  ON "media_usage" ("owner_type", "owner_id");
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'media_usage_media_id_media_assets_id_fk'
  ) THEN
    ALTER TABLE "media_usage"
      ADD CONSTRAINT "media_usage_media_id_media_assets_id_fk"
      FOREIGN KEY ("media_id")
      REFERENCES "public"."media_assets"("id")
      ON DELETE cascade
      ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint
