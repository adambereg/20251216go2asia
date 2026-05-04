-- =====================================================================
-- 0048_rf_voucher_canonical_lifecycle_columns_v1.sql
-- Add the Stage 1+2 canonical RF voucher lifecycle columns.
--
-- This migration is additive:
-- - keeps legacy rf_voucher.status and rf_voucher_status unchanged;
-- - does not add canonical partial indexes;
-- - does not add redemption tables;
-- - does not change runtime ON CONFLICT behavior.
-- =====================================================================

-- STEP 1: Create the canonical voucher lifecycle enum.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'rf_voucher_canonical_status'
  ) THEN
    CREATE TYPE "rf_voucher_canonical_status" AS ENUM (
      'available',
      'locked',
      'unlocked',
      'redeemed',
      'expired',
      'cancelled'
    );
  END IF;
END $$;
--> statement-breakpoint

-- STEP 2: Add additive canonical lifecycle columns.
ALTER TABLE "rf_voucher"
  ADD COLUMN IF NOT EXISTS "canonical_status" "rf_voucher_canonical_status" DEFAULT 'available',
  ADD COLUMN IF NOT EXISTS "contract_version" integer DEFAULT 1 NOT NULL,
  ADD COLUMN IF NOT EXISTS "expires_at" timestamp,
  ADD COLUMN IF NOT EXISTS "cancelled_at" timestamp,
  ADD COLUMN IF NOT EXISTS "status_changed_at" timestamp DEFAULT now(),
  ADD COLUMN IF NOT EXISTS "status_reason" text,
  ADD COLUMN IF NOT EXISTS "status_actor_user_id" varchar(128);
--> statement-breakpoint

-- STEP 3: Backfill canonical lifecycle state from the legacy runtime status.
UPDATE "rf_voucher"
SET
  "canonical_status" = CASE "status"::text
    WHEN 'claimed' THEN 'available'::"rf_voucher_canonical_status"
    WHEN 'redeemed' THEN 'redeemed'::"rf_voucher_canonical_status"
    WHEN 'cancelled' THEN 'cancelled'::"rf_voucher_canonical_status"
  END,
  "status_changed_at" = COALESCE("updated_at", "created_at", "status_changed_at", now())
WHERE "status" IN ('claimed', 'redeemed', 'cancelled');
--> statement-breakpoint

-- STEP 4: Best-effort historical cancellation timestamp for existing cancelled rows.
UPDATE "rf_voucher"
SET "cancelled_at" = COALESCE("cancelled_at", "updated_at")
WHERE "status" = 'cancelled'
  AND "cancelled_at" IS NULL;
--> statement-breakpoint

-- STEP 5: Make the canonical lifecycle status required after backfill.
ALTER TABLE "rf_voucher"
  ALTER COLUMN "canonical_status" SET NOT NULL;
--> statement-breakpoint

-- STEP 6: Document the additive lifecycle columns.
COMMENT ON COLUMN "rf_voucher"."canonical_status"
  IS 'Stage 1+2 canonical voucher lifecycle status. Legacy status claimed maps to canonical available.';
--> statement-breakpoint

COMMENT ON COLUMN "rf_voucher"."contract_version"
  IS 'RF voucher lifecycle contract version for transition compatibility.';
--> statement-breakpoint

COMMENT ON COLUMN "rf_voucher"."expires_at"
  IS 'Optional future expiration timestamp for canonical voucher lifecycle handling.';
--> statement-breakpoint

COMMENT ON COLUMN "rf_voucher"."cancelled_at"
  IS 'Optional timestamp for voucher cancellation; existing cancelled rows are backfilled from updated_at as best effort.';
--> statement-breakpoint

COMMENT ON COLUMN "rf_voucher"."status_changed_at"
  IS 'Timestamp for the latest known canonical lifecycle status change.';
--> statement-breakpoint

COMMENT ON COLUMN "rf_voucher"."status_reason"
  IS 'Optional machine-readable or operator-supplied reason for the current canonical lifecycle status.';
--> statement-breakpoint

COMMENT ON COLUMN "rf_voucher"."status_actor_user_id"
  IS 'Optional user id of the actor responsible for the latest canonical lifecycle status change.';
--> statement-breakpoint
