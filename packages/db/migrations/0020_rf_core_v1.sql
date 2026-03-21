-- =====================================================================
-- 0020_rf_core_v1.sql
-- RF service persistence baseline for Segment E hardening
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_partner_status') THEN
    CREATE TYPE "rf_partner_status" AS ENUM ('active', 'archived');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_offer_status') THEN
    CREATE TYPE "rf_offer_status" AS ENUM ('draft', 'active', 'archived');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_offer_type') THEN
    CREATE TYPE "rf_offer_type" AS ENUM ('discount', 'bundle', 'gift', 'access', 'campaign', 'event_related');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_offer_visibility') THEN
    CREATE TYPE "rf_offer_visibility" AS ENUM ('public', 'pro_only', 'invite_only');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_voucher_status') THEN
    CREATE TYPE "rf_voucher_status" AS ENUM ('claimed', 'redeemed', 'cancelled');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_pro_link_status') THEN
    CREATE TYPE "rf_pro_link_status" AS ENUM ('pending', 'active', 'ended');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_pro_link_role_scope') THEN
    CREATE TYPE "rf_pro_link_role_scope" AS ENUM (
      'onboarding',
      'curation',
      'promotion',
      'moderation_support',
      'account_support'
    );
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rf_idempotency_operation') THEN
    CREATE TYPE "rf_idempotency_operation" AS ENUM ('voucher_claim');
  END IF;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "rf_partner" (
  "id" varchar(80) PRIMARY KEY NOT NULL,
  "slug" varchar(180) NOT NULL,
  "display_name" varchar(160) NOT NULL,
  "country_id" varchar(128) NOT NULL,
  "city_id" varchar(128) NOT NULL,
  "status" "rf_partner_status" DEFAULT 'active' NOT NULL,
  "owner_user_id" varchar(128) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "rf_offer" (
  "id" varchar(80) PRIMARY KEY NOT NULL,
  "partner_id" varchar(80) NOT NULL REFERENCES "rf_partner"("id") ON DELETE cascade,
  "title" varchar(240) NOT NULL,
  "offer_type" "rf_offer_type" NOT NULL,
  "visibility" "rf_offer_visibility" NOT NULL,
  "status" "rf_offer_status" DEFAULT 'draft' NOT NULL,
  "created_by_user_id" varchar(128) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "rf_voucher" (
  "id" varchar(80) PRIMARY KEY NOT NULL,
  "offer_id" varchar(80) NOT NULL REFERENCES "rf_offer"("id") ON DELETE cascade,
  "partner_id" varchar(80) NOT NULL REFERENCES "rf_partner"("id") ON DELETE cascade,
  "issued_to_user_id" varchar(128) NOT NULL,
  "status" "rf_voucher_status" DEFAULT 'claimed' NOT NULL,
  "code" varchar(32) NOT NULL,
  "claimed_at" timestamp DEFAULT now() NOT NULL,
  "redeemed_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "rf_pro_link" (
  "id" varchar(80) PRIMARY KEY NOT NULL,
  "partner_id" varchar(80) NOT NULL REFERENCES "rf_partner"("id") ON DELETE cascade,
  "pro_user_id" varchar(128) NOT NULL,
  "status" "rf_pro_link_status" DEFAULT 'pending' NOT NULL,
  "role_scope" "rf_pro_link_role_scope" NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "rf_claim_idempotency" (
  "operation" "rf_idempotency_operation" DEFAULT 'voucher_claim' NOT NULL,
  "actor_user_id" varchar(128) NOT NULL,
  "idempotency_key" varchar(160) NOT NULL,
  "voucher_id" varchar(80) NOT NULL REFERENCES "rf_voucher"("id") ON DELETE cascade,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_code_unique"
  ON "rf_voucher" ("code");
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_offer_user_active_unique"
  ON "rf_voucher" ("offer_id", "issued_to_user_id")
  WHERE "status" IN ('claimed', 'redeemed');
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_pro_link_partner_pro_live_unique"
  ON "rf_pro_link" ("partner_id", "pro_user_id")
  WHERE "status" <> 'ended';
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "rf_claim_idempotency_operation_actor_key_unique"
  ON "rf_claim_idempotency" ("operation", "actor_user_id", "idempotency_key");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_partner_status_updated_at"
  ON "rf_partner" ("status", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_partner_owner_status_updated_at"
  ON "rf_partner" ("owner_user_id", "status", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_offer_partner_status_visibility_updated_at"
  ON "rf_offer" ("partner_id", "status", "visibility", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_offer_status_visibility_updated_at"
  ON "rf_offer" ("status", "visibility", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_voucher_partner_status_claimed_at"
  ON "rf_voucher" ("partner_id", "status", "claimed_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_voucher_issued_to_status_claimed_at"
  ON "rf_voucher" ("issued_to_user_id", "status", "claimed_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_pro_link_pro_user_status_updated_at"
  ON "rf_pro_link" ("pro_user_id", "status", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_pro_link_partner_status_updated_at"
  ON "rf_pro_link" ("partner_id", "status", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_rf_claim_idempotency_voucher_id"
  ON "rf_claim_idempotency" ("voucher_id");
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_partner_display_name_not_blank_check') THEN
    ALTER TABLE "rf_partner"
      ADD CONSTRAINT "rf_partner_display_name_not_blank_check"
      CHECK (length(trim("display_name")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_partner_country_id_not_blank_check') THEN
    ALTER TABLE "rf_partner"
      ADD CONSTRAINT "rf_partner_country_id_not_blank_check"
      CHECK (length(trim("country_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_partner_city_id_not_blank_check') THEN
    ALTER TABLE "rf_partner"
      ADD CONSTRAINT "rf_partner_city_id_not_blank_check"
      CHECK (length(trim("city_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_partner_owner_user_id_not_blank_check') THEN
    ALTER TABLE "rf_partner"
      ADD CONSTRAINT "rf_partner_owner_user_id_not_blank_check"
      CHECK (length(trim("owner_user_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_offer_title_not_blank_check') THEN
    ALTER TABLE "rf_offer"
      ADD CONSTRAINT "rf_offer_title_not_blank_check"
      CHECK (length(trim("title")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_offer_created_by_user_id_not_blank_check') THEN
    ALTER TABLE "rf_offer"
      ADD CONSTRAINT "rf_offer_created_by_user_id_not_blank_check"
      CHECK (length(trim("created_by_user_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_voucher_issued_to_user_id_not_blank_check') THEN
    ALTER TABLE "rf_voucher"
      ADD CONSTRAINT "rf_voucher_issued_to_user_id_not_blank_check"
      CHECK (length(trim("issued_to_user_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_voucher_code_not_blank_check') THEN
    ALTER TABLE "rf_voucher"
      ADD CONSTRAINT "rf_voucher_code_not_blank_check"
      CHECK (length(trim("code")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_pro_link_pro_user_id_not_blank_check') THEN
    ALTER TABLE "rf_pro_link"
      ADD CONSTRAINT "rf_pro_link_pro_user_id_not_blank_check"
      CHECK (length(trim("pro_user_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_claim_idempotency_actor_user_id_not_blank_check') THEN
    ALTER TABLE "rf_claim_idempotency"
      ADD CONSTRAINT "rf_claim_idempotency_actor_user_id_not_blank_check"
      CHECK (length(trim("actor_user_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rf_claim_idempotency_key_not_blank_check') THEN
    ALTER TABLE "rf_claim_idempotency"
      ADD CONSTRAINT "rf_claim_idempotency_key_not_blank_check"
      CHECK (length(trim("idempotency_key")) > 0);
  END IF;
END $$;
