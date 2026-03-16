-- =====================================================================
-- 0017_reactions_idempotency_v1.sql
-- Reactions service idempotency key persistence for write retries
-- =====================================================================

CREATE TABLE IF NOT EXISTS "reaction_idempotency_keys" (
  "user_id" text NOT NULL,
  "idempotency_key" text NOT NULL,
  "payload_hash" text NOT NULL,
  "reaction_id" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "reaction_idempotency_user_key_unique"
  ON "reaction_idempotency_keys" ("user_id", "idempotency_key");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_reaction_idempotency_reaction_id"
  ON "reaction_idempotency_keys" ("reaction_id");
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reaction_idempotency_user_id_not_blank_check'
  ) THEN
    ALTER TABLE "reaction_idempotency_keys"
      ADD CONSTRAINT "reaction_idempotency_user_id_not_blank_check"
      CHECK (length(trim("user_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reaction_idempotency_key_not_blank_check'
  ) THEN
    ALTER TABLE "reaction_idempotency_keys"
      ADD CONSTRAINT "reaction_idempotency_key_not_blank_check"
      CHECK (length(trim("idempotency_key")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reaction_idempotency_payload_hash_not_blank_check'
  ) THEN
    ALTER TABLE "reaction_idempotency_keys"
      ADD CONSTRAINT "reaction_idempotency_payload_hash_not_blank_check"
      CHECK (length(trim("payload_hash")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reaction_idempotency_reaction_id_not_blank_check'
  ) THEN
    ALTER TABLE "reaction_idempotency_keys"
      ADD CONSTRAINT "reaction_idempotency_reaction_id_not_blank_check"
      CHECK (length(trim("reaction_id")) > 0);
  END IF;
END $$;

