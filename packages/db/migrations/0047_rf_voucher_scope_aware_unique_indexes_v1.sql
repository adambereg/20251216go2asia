-- =====================================================================
-- 0047_rf_voucher_scope_aware_unique_indexes_v1.sql
-- Split active voucher uniqueness by claim scope.
--
-- Note: the repo DDL applicator runs each migration inside a transaction,
-- so CREATE/DROP INDEX CONCURRENTLY cannot be used in this file.
-- =====================================================================

-- STEP 1: Create the partner-scope replacement before dropping the broad index.
CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_offer_user_partner_unique"
  ON "rf_voucher" ("offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'partner' AND "status" IN ('claimed', 'redeemed');
--> statement-breakpoint

-- STEP 2: Ensure the listing-scope uniqueness index exists before removing the old guard.
CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_listing_offer_user_active_unique"
  ON "rf_voucher" ("rielt_listing_id", "offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'listing' AND "status" IN ('claimed', 'redeemed');
--> statement-breakpoint

-- STEP 3: Defensive verification inside the transaction.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = current_schema()
      AND tablename = 'rf_voucher'
      AND indexname = 'rf_voucher_offer_user_partner_unique'
  ) THEN
    RAISE EXCEPTION 'Missing rf_voucher_offer_user_partner_unique';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = current_schema()
      AND tablename = 'rf_voucher'
      AND indexname = 'rf_voucher_listing_offer_user_active_unique'
  ) THEN
    RAISE EXCEPTION 'Missing rf_voucher_listing_offer_user_active_unique';
  END IF;
END $$;
--> statement-breakpoint

-- STEP 4: Drop the broad offer/user active index after both scoped indexes exist.
DROP INDEX IF EXISTS "rf_voucher_offer_user_active_unique";
--> statement-breakpoint
