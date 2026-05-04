-- =====================================================================
-- 0050_rf_voucher_redemption_table_v1.sql
-- Add the RF voucher redemption attempts table.
--
-- This migration is additive:
-- - does not change rf_voucher lifecycle columns;
-- - does not change runtime redeem behavior;
-- - does not change indexes from Migration C;
-- - does not touch rf_claim_idempotency.
-- =====================================================================

-- STEP 1: Create the redemption result status enum.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'rf_voucher_redemption_result_status'
  ) THEN
    CREATE TYPE "rf_voucher_redemption_result_status" AS ENUM (
      'succeeded',
      'failed',
      'duplicate'
    );
  END IF;
END $$;
--> statement-breakpoint

-- STEP 2: Create the redemption attempts table.
CREATE TABLE IF NOT EXISTS "rf_voucher_redemption" (
  "id" text PRIMARY KEY NOT NULL,
  "voucher_id" varchar(80) NOT NULL REFERENCES "rf_voucher"("id") ON DELETE cascade,
  "user_id" varchar(128) NOT NULL,
  "partner_id" varchar(80) NOT NULL REFERENCES "rf_partner"("id") ON DELETE restrict,
  "context_type" text DEFAULT 'manual' NOT NULL,
  "context_ref" text,
  "result_status" "rf_voucher_redemption_result_status" NOT NULL,
  "idempotency_key" text,
  "actor_user_id" varchar(128),
  "redeemed_at" timestamp,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "correlation_id" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- STEP 3: Add redemption lookup indexes.
CREATE INDEX IF NOT EXISTS "idx_rf_voucher_redemption_voucher_created_at"
  ON "rf_voucher_redemption" ("voucher_id", "created_at" DESC);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_voucher_redemption_partner_created_at"
  ON "rf_voucher_redemption" ("partner_id", "created_at" DESC);
--> statement-breakpoint

-- STEP 4: Allow many attempts, but only one successful redemption per voucher.
CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_redemption_success_unique"
  ON "rf_voucher_redemption" ("voucher_id")
  WHERE "result_status" = 'succeeded';
--> statement-breakpoint

-- STEP 5: Idempotency guard for callers that provide a redeem idempotency key.
CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_redemption_idempotency_unique"
  ON "rf_voucher_redemption" ("actor_user_id", "idempotency_key")
  WHERE "idempotency_key" IS NOT NULL;
--> statement-breakpoint
