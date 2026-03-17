-- =====================================================================
-- 0018_quest_core_v1.sql
-- Quest service baseline schema for Step 7 activity engine
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quest_status') THEN
    CREATE TYPE "quest_status" AS ENUM ('draft', 'published', 'archived');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quest_visibility') THEN
    CREATE TYPE "quest_visibility" AS ENUM ('public', 'private');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quest_difficulty') THEN
    CREATE TYPE "quest_difficulty" AS ENUM ('easy', 'medium', 'hard');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quest_step_type') THEN
    CREATE TYPE "quest_step_type" AS ENUM (
      'visit_place',
      'attend_event',
      'visit_partner',
      'challenge',
      'photo_proof',
      'geo_checkin',
      'qr_code',
      'space_action'
    );
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quest_verification_type') THEN
    CREATE TYPE "quest_verification_type" AS ENUM ('auto', 'geo', 'qr', 'manual', 'space_post');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quest_progress_status') THEN
    CREATE TYPE "quest_progress_status" AS ENUM (
      'not_started',
      'in_progress',
      'pending_review',
      'completed',
      'failed',
      'expired'
    );
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quest_submission_status') THEN
    CREATE TYPE "quest_submission_status" AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quest_proof_type') THEN
    CREATE TYPE "quest_proof_type" AS ENUM ('photo', 'geo', 'qr', 'space_post', 'text');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quest_target_type') THEN
    CREATE TYPE "quest_target_type" AS ENUM ('place', 'event', 'partner', 'space_post');
  END IF;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "quest" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "creator_pro_id" text NOT NULL,
  "city_id" text,
  "geo_scope" jsonb,
  "type" text,
  "theme" text,
  "difficulty" "quest_difficulty",
  "status" "quest_status" DEFAULT 'draft' NOT NULL,
  "visibility" "quest_visibility" DEFAULT 'public' NOT NULL,
  "reward_points" integer,
  "steps_count" integer DEFAULT 0 NOT NULL,
  "published_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "quest_step" (
  "id" text PRIMARY KEY NOT NULL,
  "quest_id" text NOT NULL REFERENCES "quest"("id") ON DELETE cascade,
  "order" integer NOT NULL,
  "type" "quest_step_type" NOT NULL,
  "target_type" "quest_target_type",
  "target_id" text,
  "verification_type" "quest_verification_type" NOT NULL,
  "requirements_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "reward_points" integer,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "quest_progress" (
  "id" text PRIMARY KEY NOT NULL,
  "quest_id" text NOT NULL REFERENCES "quest"("id") ON DELETE cascade,
  "user_id" text NOT NULL,
  "status" "quest_progress_status" DEFAULT 'not_started' NOT NULL,
  "current_step" integer,
  "started_at" timestamp DEFAULT now() NOT NULL,
  "completed_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "quest_submission" (
  "id" text PRIMARY KEY NOT NULL,
  "progress_id" text NOT NULL REFERENCES "quest_progress"("id") ON DELETE cascade,
  "step_id" text NOT NULL REFERENCES "quest_step"("id") ON DELETE cascade,
  "user_id" text NOT NULL,
  "proof_type" "quest_proof_type" NOT NULL,
  "proof_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "status" "quest_submission_status" DEFAULT 'pending' NOT NULL,
  "reviewed_by" text,
  "reviewed_at" timestamp,
  "rejection_reason" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "quest_step_quest_id_order_unique"
  ON "quest_step" ("quest_id", "order");
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "quest_progress_quest_id_user_id_unique"
  ON "quest_progress" ("quest_id", "user_id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_quest_status_visibility_updated_at"
  ON "quest" ("status", "visibility", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_quest_city_status_updated_at"
  ON "quest" ("city_id", "status", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_quest_step_quest_order"
  ON "quest_step" ("quest_id", "order");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_quest_progress_user_status_updated_at"
  ON "quest_progress" ("user_id", "status", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_quest_progress_quest_status_updated_at"
  ON "quest_progress" ("quest_id", "status", "updated_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_quest_submission_progress_created_at"
  ON "quest_submission" ("progress_id", "created_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_quest_submission_step_status_created_at"
  ON "quest_submission" ("step_id", "status", "created_at");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_quest_submission_user_created_at"
  ON "quest_submission" ("user_id", "created_at");
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_title_not_blank_check') THEN
    ALTER TABLE "quest"
      ADD CONSTRAINT "quest_title_not_blank_check"
      CHECK (length(trim("title")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_creator_pro_id_not_blank_check') THEN
    ALTER TABLE "quest"
      ADD CONSTRAINT "quest_creator_pro_id_not_blank_check"
      CHECK (length(trim("creator_pro_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_reward_points_non_negative_check') THEN
    ALTER TABLE "quest"
      ADD CONSTRAINT "quest_reward_points_non_negative_check"
      CHECK ("reward_points" IS NULL OR "reward_points" >= 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_geo_scope_object_check') THEN
    ALTER TABLE "quest"
      ADD CONSTRAINT "quest_geo_scope_object_check"
      CHECK ("geo_scope" IS NULL OR jsonb_typeof("geo_scope") = 'object');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_step_order_positive_check') THEN
    ALTER TABLE "quest_step"
      ADD CONSTRAINT "quest_step_order_positive_check"
      CHECK ("order" > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_step_target_pair_consistency_check') THEN
    ALTER TABLE "quest_step"
      ADD CONSTRAINT "quest_step_target_pair_consistency_check"
      CHECK (
        ("target_type" IS NULL AND "target_id" IS NULL)
        OR
        ("target_type" IS NOT NULL AND "target_id" IS NOT NULL)
      );
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_step_requirements_object_check') THEN
    ALTER TABLE "quest_step"
      ADD CONSTRAINT "quest_step_requirements_object_check"
      CHECK (jsonb_typeof("requirements_json") = 'object');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_step_reward_points_non_negative_check') THEN
    ALTER TABLE "quest_step"
      ADD CONSTRAINT "quest_step_reward_points_non_negative_check"
      CHECK ("reward_points" IS NULL OR "reward_points" >= 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_progress_user_id_not_blank_check') THEN
    ALTER TABLE "quest_progress"
      ADD CONSTRAINT "quest_progress_user_id_not_blank_check"
      CHECK (length(trim("user_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_progress_current_step_positive_check') THEN
    ALTER TABLE "quest_progress"
      ADD CONSTRAINT "quest_progress_current_step_positive_check"
      CHECK ("current_step" IS NULL OR "current_step" > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_submission_user_id_not_blank_check') THEN
    ALTER TABLE "quest_submission"
      ADD CONSTRAINT "quest_submission_user_id_not_blank_check"
      CHECK (length(trim("user_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quest_submission_proof_data_object_check') THEN
    ALTER TABLE "quest_submission"
      ADD CONSTRAINT "quest_submission_proof_data_object_check"
      CHECK (jsonb_typeof("proof_data") = 'object');
  END IF;
END $$;
