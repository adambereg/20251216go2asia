-- =====================================================================
-- 0051_rf_voucher_canonical_indexes_v1.sql
-- Add canonical RF voucher lifecycle indexes for the future runtime switch.
--
-- This migration is additive:
-- - keeps legacy status-based indexes;
-- - does not change runtime ON CONFLICT behavior;
-- - does not implement repeatability;
-- - keeps redeemed in the canonical uniqueness predicate for one-time default.
-- =====================================================================

-- STEP 1: Add partner-scope canonical uniqueness in parallel with the legacy status-based index.
CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_offer_user_partner_canonical_unique"
  ON "rf_voucher" ("offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'partner'
    AND "canonical_status" IN ('available', 'locked', 'unlocked', 'redeemed');
--> statement-breakpoint

-- STEP 2: Add listing-scope canonical uniqueness in parallel with the legacy status-based index.
CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_listing_offer_user_canonical_unique"
  ON "rf_voucher" ("rielt_listing_id", "offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'listing'
    AND "canonical_status" IN ('available', 'locked', 'unlocked', 'redeemed');
--> statement-breakpoint

-- STEP 3: Add canonical-status query indexes for future read paths.
CREATE INDEX IF NOT EXISTS "idx_rf_voucher_issued_to_canonical_claimed_at"
  ON "rf_voucher" ("issued_to_user_id", "canonical_status", "claimed_at" DESC);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_voucher_partner_canonical_claimed_at"
  ON "rf_voucher" ("partner_id", "canonical_status", "claimed_at" DESC);
--> statement-breakpoint
