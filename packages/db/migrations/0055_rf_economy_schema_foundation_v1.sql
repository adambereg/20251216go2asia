-- 0055_rf_economy_schema_foundation_v1.sql
--
-- RF Slice 4.1: economy schema foundation (additive-only).
-- This migration prepares claim-time economy snapshots for future points debit.
-- No spend runtime, no points-service coupling, no claim/redeem behavior changes.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_voucher_economy_status') THEN
    CREATE TYPE "rf_voucher_economy_status" AS ENUM ('not_required', 'pending', 'debited', 'debit_failed');
  END IF;
END $$;
--> statement-breakpoint

ALTER TABLE "rf_offer"
  ADD COLUMN IF NOT EXISTS "points_cost" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint

ALTER TABLE "rf_voucher"
  ADD COLUMN IF NOT EXISTS "points_cost_snapshot" integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS "points_debit_external_id" text,
  ADD COLUMN IF NOT EXISTS "economy_status" "rf_voucher_economy_status" DEFAULT 'not_required' NOT NULL;
--> statement-breakpoint

UPDATE "rf_offer"
SET "points_cost" = 0
WHERE "points_cost" IS NULL;
--> statement-breakpoint

UPDATE "rf_voucher"
SET
  "points_cost_snapshot" = 0,
  "economy_status" = 'not_required'
WHERE "points_cost_snapshot" IS NULL
   OR "economy_status" IS NULL;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_offer_points_cost_non_negative_check') THEN
    ALTER TABLE "rf_offer"
      ADD CONSTRAINT "rf_offer_points_cost_non_negative_check"
      CHECK ("points_cost" >= 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_voucher_points_cost_snapshot_non_negative_check') THEN
    ALTER TABLE "rf_voucher"
      ADD CONSTRAINT "rf_voucher_points_cost_snapshot_non_negative_check"
      CHECK ("points_cost_snapshot" >= 0);
  END IF;
END $$;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_points_debit_external_id_unique"
  ON "rf_voucher" ("points_debit_external_id")
  WHERE "points_debit_external_id" IS NOT NULL;
