-- =====================================================================
-- 0052_rf_partner_item_catalog_v1.sql
-- Merchant product/service catalog baseline for RF partner offers.
--
-- This migration is additive:
-- - introduces owner-managed partner items;
-- - keeps existing offers valid with nullable item_id;
-- - does not change voucher claim/redeem behavior.
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_partner_item_status') THEN
    CREATE TYPE "rf_partner_item_status" AS ENUM ('active', 'archived');
  END IF;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "rf_partner_item" (
  "id" varchar(80) PRIMARY KEY NOT NULL,
  "partner_id" varchar(80) NOT NULL REFERENCES "rf_partner"("id") ON DELETE cascade,
  "title" varchar(240) NOT NULL,
  "description" text,
  "category" varchar(80),
  "price_from" numeric(12, 2),
  "currency" varchar(3),
  "status" "rf_partner_item_status" DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

ALTER TABLE "rf_offer"
  ADD COLUMN IF NOT EXISTS "item_id" varchar(80);
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_offer_item_id_fk') THEN
    ALTER TABLE "rf_offer"
      ADD CONSTRAINT "rf_offer_item_id_fk"
      FOREIGN KEY ("item_id") REFERENCES "rf_partner_item"("id") ON DELETE SET NULL;
  END IF;
END $$;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_partner_item_partner_status_updated_at"
  ON "rf_partner_item" ("partner_id", "status", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_partner_item_partner_title"
  ON "rf_partner_item" ("partner_id", "title");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_offer_item_id"
  ON "rf_offer" ("item_id");
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_partner_item_title_not_blank_check') THEN
    ALTER TABLE "rf_partner_item"
      ADD CONSTRAINT "rf_partner_item_title_not_blank_check"
      CHECK (length(trim("title")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_partner_item_price_from_non_negative_check') THEN
    ALTER TABLE "rf_partner_item"
      ADD CONSTRAINT "rf_partner_item_price_from_non_negative_check"
      CHECK ("price_from" IS NULL OR "price_from" >= 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_partner_item_currency_required_with_price_check') THEN
    ALTER TABLE "rf_partner_item"
      ADD CONSTRAINT "rf_partner_item_currency_required_with_price_check"
      CHECK ("price_from" IS NULL OR ("currency" IS NOT NULL AND length(trim("currency")) = 3));
  END IF;
END $$;
--> statement-breakpoint
