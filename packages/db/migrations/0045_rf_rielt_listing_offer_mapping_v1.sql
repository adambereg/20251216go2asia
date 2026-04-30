-- =====================================================================
-- 0045_rf_rielt_listing_offer_mapping_v1.sql
-- RF-owned mapping from Rielt listings to RF offers.
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_rielt_listing_offer_status') THEN
    CREATE TYPE "rf_rielt_listing_offer_status" AS ENUM ('active', 'hidden');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_rielt_listing_offer_kind') THEN
    CREATE TYPE "rf_rielt_listing_offer_kind" AS ENUM ('basic', 'premium');
  END IF;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "rielt_listing_rf_offer" (
  "listing_id" text NOT NULL,
  "rf_partner_id" varchar(80) NOT NULL REFERENCES "rf_partner"("id") ON DELETE cascade,
  "rf_offer_id" varchar(80) NOT NULL REFERENCES "rf_offer"("id") ON DELETE cascade,
  "status" "rf_rielt_listing_offer_status" DEFAULT 'active' NOT NULL,
  "offer_kind" "rf_rielt_listing_offer_kind" DEFAULT 'basic' NOT NULL,
  "priority" integer DEFAULT 100 NOT NULL,
  "applicability_note" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rielt_listing_rf_offer_listing_offer_unique"
  ON "rielt_listing_rf_offer" ("listing_id", "rf_offer_id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_rf_offer_listing_status_priority"
  ON "rielt_listing_rf_offer" ("listing_id", "status", "priority");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_rf_offer_partner_status_priority"
  ON "rielt_listing_rf_offer" ("rf_partner_id", "status", "priority");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rielt_listing_rf_offer_offer_id"
  ON "rielt_listing_rf_offer" ("rf_offer_id");
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_rf_offer_listing_id_not_blank_check') THEN
    ALTER TABLE "rielt_listing_rf_offer"
      ADD CONSTRAINT "rielt_listing_rf_offer_listing_id_not_blank_check"
      CHECK (length(trim("listing_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rielt_listing_rf_offer_priority_non_negative_check') THEN
    ALTER TABLE "rielt_listing_rf_offer"
      ADD CONSTRAINT "rielt_listing_rf_offer_priority_non_negative_check"
      CHECK ("priority" >= 0);
  END IF;
END $$;
