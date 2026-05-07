-- 0053_rf_voucher_pro_attribution_v1.sql
--
-- RF Stage 5.0B: voucher-scoped PRO attribution persistence.
-- This migration stays RF-only: no economy, payouts, points, tokens, NFT,
-- analytics platform, or shared attribution service is introduced.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_attribution_status') THEN
    CREATE TYPE "rf_attribution_status" AS ENUM ('none', 'confirmed', 'rejected');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_attribution_source') THEN
    CREATE TYPE "rf_attribution_source" AS ENUM ('pro_link', 'direct_offer', 'internal_navigation', 'unknown');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_claim_source') THEN
    CREATE TYPE "rf_claim_source" AS ENUM (
      'public_rf_catalog',
      'public_offer_detail',
      'rielt_offer_detail',
      'pro_shared_link',
      'unknown'
    );
  END IF;
END $$;
--> statement-breakpoint

ALTER TABLE "rf_pro_link"
  ADD COLUMN IF NOT EXISTS "share_code" varchar(80);
--> statement-breakpoint

UPDATE "rf_pro_link"
SET "share_code" = 'rfp_' || substr(md5("id" || ':' || "pro_user_id" || ':' || "partner_id"), 1, 18)
WHERE "share_code" IS NULL;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_pro_link_share_code_unique"
  ON "rf_pro_link" ("share_code")
  WHERE "share_code" IS NOT NULL;
--> statement-breakpoint

ALTER TABLE "rf_voucher"
  ADD COLUMN IF NOT EXISTS "attribution_version" integer DEFAULT 1 NOT NULL,
  ADD COLUMN IF NOT EXISTS "attribution_strategy" varchar(80) DEFAULT 'rf_pro_last_touch_before_claim' NOT NULL,
  ADD COLUMN IF NOT EXISTS "attribution_status" "rf_attribution_status" DEFAULT 'none' NOT NULL,
  ADD COLUMN IF NOT EXISTS "attribution_source" "rf_attribution_source" DEFAULT 'unknown' NOT NULL,
  ADD COLUMN IF NOT EXISTS "claim_source" "rf_claim_source" DEFAULT 'unknown' NOT NULL,
  ADD COLUMN IF NOT EXISTS "attribution_share_code" varchar(80),
  ADD COLUMN IF NOT EXISTS "pro_attributed_user_id" varchar(128),
  ADD COLUMN IF NOT EXISTS "pro_link_id" varchar(80) REFERENCES "rf_pro_link"("id") ON DELETE set null,
  ADD COLUMN IF NOT EXISTS "attribution_captured_at" timestamp,
  ADD COLUMN IF NOT EXISTS "attribution_confirmed_at" timestamp,
  ADD COLUMN IF NOT EXISTS "attribution_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_voucher_pro_attribution_claimed_at"
  ON "rf_voucher" ("pro_attributed_user_id", "claimed_at" DESC)
  WHERE "pro_attributed_user_id" IS NOT NULL AND "attribution_status" = 'confirmed';
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_pro_link_share_code_not_blank_check') THEN
    ALTER TABLE "rf_pro_link"
      ADD CONSTRAINT "rf_pro_link_share_code_not_blank_check"
      CHECK ("share_code" IS NULL OR length(trim("share_code")) > 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_voucher_attribution_version_positive_check') THEN
    ALTER TABLE "rf_voucher"
      ADD CONSTRAINT "rf_voucher_attribution_version_positive_check"
      CHECK ("attribution_version" >= 1);
  END IF;
END $$;
