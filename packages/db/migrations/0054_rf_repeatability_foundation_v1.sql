-- 0054_rf_repeatability_foundation_v1.sql
--
-- RF Slice 2.1A: repeatability foundation.
-- This migration is additive and behavior-preserving by default:
-- - existing offers default to once_per_scope;
-- - redeemed-inclusive unique indexes remain in place for the current one-time runtime;
-- - repeat_after_redeem is prepared, but broad product enablement is not introduced here;
-- - no economy, payouts, rewards, Points/G2A/NFT, Connect expansion, or merchant policy UI.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_repeat_policy') THEN
    CREATE TYPE "rf_repeat_policy" AS ENUM ('once_per_scope', 'repeat_after_redeem');
  END IF;
END $$;
--> statement-breakpoint

ALTER TABLE "rf_offer"
  ADD COLUMN IF NOT EXISTS "repeat_policy" "rf_repeat_policy" DEFAULT 'once_per_scope' NOT NULL;
--> statement-breakpoint

ALTER TABLE "rf_voucher"
  ADD COLUMN IF NOT EXISTS "repeat_policy_snapshot" "rf_repeat_policy" DEFAULT 'once_per_scope' NOT NULL,
  ADD COLUMN IF NOT EXISTS "issue_sequence" integer DEFAULT 1 NOT NULL;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_voucher_issue_sequence_positive_check') THEN
    ALTER TABLE "rf_voucher"
      ADD CONSTRAINT "rf_voucher_issue_sequence_positive_check"
      CHECK ("issue_sequence" >= 1);
  END IF;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "rf_voucher_scope_consumption_guard" (
  "id" text PRIMARY KEY,
  "offer_id" varchar(80) NOT NULL REFERENCES "rf_offer"("id") ON DELETE cascade,
  "issued_to_user_id" varchar(128) NOT NULL,
  "claim_scope" "rf_voucher_claim_scope" NOT NULL,
  "scope_ref" text NOT NULL,
  "consumed_voucher_id" varchar(80) NOT NULL REFERENCES "rf_voucher"("id") ON DELETE cascade,
  "repeat_policy_snapshot" "rf_repeat_policy" DEFAULT 'once_per_scope' NOT NULL,
  "consumed_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_voucher_scope_consumption_guard_issued_to_not_blank_check') THEN
    ALTER TABLE "rf_voucher_scope_consumption_guard"
      ADD CONSTRAINT "rf_voucher_scope_consumption_guard_issued_to_not_blank_check"
      CHECK (length(trim("issued_to_user_id")) > 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_voucher_scope_consumption_guard_scope_ref_not_blank_check') THEN
    ALTER TABLE "rf_voucher_scope_consumption_guard"
      ADD CONSTRAINT "rf_voucher_scope_consumption_guard_scope_ref_not_blank_check"
      CHECK (length(trim("scope_ref")) > 0);
  END IF;
END $$;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_scope_consumption_guard_scope_unique"
  ON "rf_voucher_scope_consumption_guard" ("offer_id", "issued_to_user_id", "claim_scope", "scope_ref");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_voucher_scope_consumption_guard_voucher_id"
  ON "rf_voucher_scope_consumption_guard" ("consumed_voucher_id");
--> statement-breakpoint

-- Backfill successful one-time consumption from existing redeemed voucher instances.
-- Expired/cancelled vouchers are terminal non-success states and intentionally do not consume this guard.
INSERT INTO "rf_voucher_scope_consumption_guard" (
  "id",
  "offer_id",
  "issued_to_user_id",
  "claim_scope",
  "scope_ref",
  "consumed_voucher_id",
  "repeat_policy_snapshot",
  "consumed_at",
  "created_at",
  "updated_at"
)
SELECT DISTINCT ON (
  v."offer_id",
  v."issued_to_user_id",
  v."claim_scope",
  CASE WHEN v."claim_scope" = 'partner' THEN '__partner__' ELSE v."rielt_listing_id" END
)
  'rf_guard_' || substr(md5(v."offer_id" || ':' || v."issued_to_user_id" || ':' || v."claim_scope" || ':' || CASE WHEN v."claim_scope" = 'partner' THEN '__partner__' ELSE v."rielt_listing_id" END), 1, 24),
  v."offer_id",
  v."issued_to_user_id",
  v."claim_scope",
  CASE WHEN v."claim_scope" = 'partner' THEN '__partner__' ELSE v."rielt_listing_id" END,
  v."id",
  v."repeat_policy_snapshot",
  COALESCE(v."redeemed_at", v."status_changed_at", v."updated_at", v."created_at", now()),
  now(),
  now()
FROM "rf_voucher" v
WHERE v."canonical_status" = 'redeemed'
  AND v."repeat_policy_snapshot" = 'once_per_scope'
  AND (
    v."claim_scope" = 'partner'
    OR v."rielt_listing_id" IS NOT NULL
  )
ORDER BY
  v."offer_id",
  v."issued_to_user_id",
  v."claim_scope",
  CASE WHEN v."claim_scope" = 'partner' THEN '__partner__' ELSE v."rielt_listing_id" END,
  COALESCE(v."redeemed_at", v."status_changed_at", v."updated_at", v."created_at", now()) ASC,
  v."id" ASC
ON CONFLICT DO NOTHING;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_offer_user_partner_active_canonical_unique"
  ON "rf_voucher" ("offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'partner'
    AND "canonical_status" IN ('available', 'locked', 'unlocked');
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_listing_offer_user_active_canonical_unique"
  ON "rf_voucher" ("rielt_listing_id", "offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'listing'
    AND "canonical_status" IN ('available', 'locked', 'unlocked');
--> statement-breakpoint

-- Safe policy-aware cutover for the existing redeemed-inclusive uniqueness guards.
-- This is not a plain "remove redeemed" change: redeemed keeps blocking one-time
-- voucher instances via repeat_policy_snapshot='once_per_scope', while active
-- instances continue to block for every policy.
DROP INDEX IF EXISTS "rf_voucher_offer_user_partner_unique";
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_offer_user_partner_unique"
  ON "rf_voucher" ("offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'partner'
    AND (
      "status" = 'claimed'
      OR ("status" = 'redeemed' AND "repeat_policy_snapshot" = 'once_per_scope')
    );
--> statement-breakpoint

DROP INDEX IF EXISTS "rf_voucher_listing_offer_user_active_unique";
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_listing_offer_user_active_unique"
  ON "rf_voucher" ("rielt_listing_id", "offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'listing'
    AND (
      "status" = 'claimed'
      OR ("status" = 'redeemed' AND "repeat_policy_snapshot" = 'once_per_scope')
    );
--> statement-breakpoint

DROP INDEX IF EXISTS "rf_voucher_offer_user_partner_canonical_unique";
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_offer_user_partner_canonical_unique"
  ON "rf_voucher" ("offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'partner'
    AND (
      "canonical_status" IN ('available', 'locked', 'unlocked')
      OR ("canonical_status" = 'redeemed' AND "repeat_policy_snapshot" = 'once_per_scope')
    );
--> statement-breakpoint

DROP INDEX IF EXISTS "rf_voucher_listing_offer_user_canonical_unique";
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_listing_offer_user_canonical_unique"
  ON "rf_voucher" ("rielt_listing_id", "offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'listing'
    AND (
      "canonical_status" IN ('available', 'locked', 'unlocked')
      OR ("canonical_status" = 'redeemed' AND "repeat_policy_snapshot" = 'once_per_scope')
    );
