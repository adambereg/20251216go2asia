DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quest_reward_outbox_status') THEN
    CREATE TYPE "quest_reward_outbox_status" AS ENUM ('pending', 'delivered', 'failed');
  END IF;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "quest_reward_outbox" (
  "id" text PRIMARY KEY NOT NULL,
  "quest_progress_id" text NOT NULL REFERENCES "quest_progress"("id") ON DELETE cascade,
  "quest_id" text NOT NULL REFERENCES "quest"("id") ON DELETE cascade,
  "user_id" text NOT NULL,
  "points_amount" integer NOT NULL,
  "action" text NOT NULL,
  "external_id" text NOT NULL,
  "source_event_id" text,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "status" "quest_reward_outbox_status" DEFAULT 'pending' NOT NULL,
  "attempt_count" integer DEFAULT 0 NOT NULL,
  "last_attempt_at" timestamp,
  "delivered_at" timestamp,
  "last_error" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "quest_reward_outbox_external_id_unique"
  ON "quest_reward_outbox" ("external_id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_quest_reward_outbox_status_created_at"
  ON "quest_reward_outbox" ("status", "created_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_quest_reward_outbox_progress_id"
  ON "quest_reward_outbox" ("quest_progress_id");
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_reward_outbox_user_id_not_blank_check') THEN
    ALTER TABLE "quest_reward_outbox"
      ADD CONSTRAINT "quest_reward_outbox_user_id_not_blank_check"
      CHECK (length(trim("user_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_reward_outbox_action_not_blank_check') THEN
    ALTER TABLE "quest_reward_outbox"
      ADD CONSTRAINT "quest_reward_outbox_action_not_blank_check"
      CHECK (length(trim("action")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_reward_outbox_external_id_not_blank_check') THEN
    ALTER TABLE "quest_reward_outbox"
      ADD CONSTRAINT "quest_reward_outbox_external_id_not_blank_check"
      CHECK (length(trim("external_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_reward_outbox_points_amount_positive_check') THEN
    ALTER TABLE "quest_reward_outbox"
      ADD CONSTRAINT "quest_reward_outbox_points_amount_positive_check"
      CHECK ("points_amount" > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_reward_outbox_metadata_object_check') THEN
    ALTER TABLE "quest_reward_outbox"
      ADD CONSTRAINT "quest_reward_outbox_metadata_object_check"
      CHECK (jsonb_typeof("metadata") = 'object');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_reward_outbox_attempt_count_non_negative_check') THEN
    ALTER TABLE "quest_reward_outbox"
      ADD CONSTRAINT "quest_reward_outbox_attempt_count_non_negative_check"
      CHECK ("attempt_count" >= 0);
  END IF;
END $$;
