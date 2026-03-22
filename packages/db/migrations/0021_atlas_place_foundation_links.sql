-- =====================================================================
-- 0021_atlas_place_foundation_links.sql
-- Minimal Atlas place-link foundation for RF and Rielt domains
-- =====================================================================

ALTER TABLE "rf_partner"
  ADD COLUMN IF NOT EXISTS "atlas_place_id" text;
--> statement-breakpoint

ALTER TABLE "rf_partner"
  ADD COLUMN IF NOT EXISTS "host_atlas_place_id" text;
--> statement-breakpoint

ALTER TABLE "rielt_listing"
  ADD COLUMN IF NOT EXISTS "atlas_place_id" text;
--> statement-breakpoint

ALTER TABLE "rielt_listing"
  ADD COLUMN IF NOT EXISTS "atlas_container_place_id" text;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_partner_atlas_place_fk') THEN
    ALTER TABLE "rf_partner"
      ADD CONSTRAINT "rf_partner_atlas_place_fk"
      FOREIGN KEY ("atlas_place_id") REFERENCES "places"("id") ON DELETE SET NULL;
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_partner_host_atlas_place_fk') THEN
    ALTER TABLE "rf_partner"
      ADD CONSTRAINT "rf_partner_host_atlas_place_fk"
      FOREIGN KEY ("host_atlas_place_id") REFERENCES "places"("id") ON DELETE SET NULL;
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_atlas_place_fk') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_atlas_place_fk"
      FOREIGN KEY ("atlas_place_id") REFERENCES "places"("id") ON DELETE SET NULL;
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_atlas_container_place_fk') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_atlas_container_place_fk"
      FOREIGN KEY ("atlas_container_place_id") REFERENCES "places"("id") ON DELETE SET NULL;
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_partner_host_place_differs_check') THEN
    ALTER TABLE "rf_partner"
      ADD CONSTRAINT "rf_partner_host_place_differs_check"
      CHECK (
        "atlas_place_id" IS NULL
        OR "host_atlas_place_id" IS NULL
        OR "atlas_place_id" <> "host_atlas_place_id"
      );
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_atlas_container_differs_check') THEN
    ALTER TABLE "rielt_listing"
      ADD CONSTRAINT "rielt_listing_atlas_container_differs_check"
      CHECK (
        "atlas_place_id" IS NULL
        OR "atlas_container_place_id" IS NULL
        OR "atlas_place_id" <> "atlas_container_place_id"
      );
  END IF;
END $$;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_partner_atlas_place_status_updated_at"
  ON "rf_partner" ("atlas_place_id", "status", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_partner_host_atlas_place_status_updated_at"
  ON "rf_partner" ("host_atlas_place_id", "status", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_atlas_place_status_updated_at"
  ON "rielt_listing" ("atlas_place_id", "status", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_atlas_container_status_updated_at"
  ON "rielt_listing" ("atlas_container_place_id", "status", "updated_at");
