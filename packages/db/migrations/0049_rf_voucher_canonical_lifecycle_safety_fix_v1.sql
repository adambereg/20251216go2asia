-- =====================================================================
-- 0049_rf_voucher_canonical_lifecycle_safety_fix_v1.sql
-- Tighten Migration A lifecycle columns after the applied 0048 migration.
--
-- This migration is additive/corrective:
-- - removes the silent canonical_status default;
-- - clears only migration-generated cancelled_at values copied from updated_at;
-- - does not change indexes, runtime behavior, OpenAPI, SDK, or redemption tables.
-- =====================================================================

-- STEP 1: canonical_status must be set by explicit backfill/runtime dual-write, not by a silent default.
ALTER TABLE "rf_voucher"
  ALTER COLUMN "canonical_status" DROP DEFAULT;
--> statement-breakpoint

-- STEP 2: updated_at is not reliable cancellation audit data.
-- 0048 backfilled legacy cancelled rows from updated_at; clear only those generated values.
UPDATE "rf_voucher"
SET "cancelled_at" = NULL
WHERE "status" = 'cancelled'
  AND "cancelled_at" = "updated_at";
--> statement-breakpoint

-- STEP 3: Document the stricter audit semantics.
COMMENT ON COLUMN "rf_voucher"."cancelled_at"
  IS 'Optional timestamp for voucher cancellation; legacy cancelled rows may remain NULL because updated_at is not reliable audit data.';
--> statement-breakpoint
