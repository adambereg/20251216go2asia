-- =====================================================================
-- 0046_rf_voucher_listing_claim_scope_v1.sql
-- Safe foundation for listing-scoped RF voucher claims.
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_voucher_claim_scope') THEN
    CREATE TYPE "rf_voucher_claim_scope" AS ENUM ('partner', 'listing');
  END IF;
END $$;
--> statement-breakpoint

ALTER TABLE "rf_voucher"
  ADD COLUMN IF NOT EXISTS "claim_scope" "rf_voucher_claim_scope" DEFAULT 'partner' NOT NULL;
--> statement-breakpoint

ALTER TABLE "rf_voucher"
  ADD COLUMN IF NOT EXISTS "rielt_listing_id" text;
--> statement-breakpoint

ALTER TABLE "rf_voucher"
  ADD COLUMN IF NOT EXISTS "rielt_listing_title_snapshot" text;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_listing_offer_user_active_unique"
  ON "rf_voucher" ("rielt_listing_id", "offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'listing' AND "status" IN ('claimed', 'redeemed');
--> statement-breakpoint
