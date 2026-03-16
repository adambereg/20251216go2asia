-- =====================================================================
-- 0016_reactions_like_v1.sql
-- Reactions service baseline for Step 5 (V1 like-only)
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reaction_type') THEN
    CREATE TYPE "reaction_type" AS ENUM ('like');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reaction_target_type') THEN
    CREATE TYPE "reaction_target_type" AS ENUM (
      'space_post',
      'blog_post',
      'place',
      'event',
      'partner',
      'listing',
      'quest'
    );
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reaction_status') THEN
    CREATE TYPE "reaction_status" AS ENUM ('active', 'deleted');
  END IF;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "reactions" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "target_type" "reaction_target_type" NOT NULL,
  "target_id" text NOT NULL,
  "reaction_type" "reaction_type" DEFAULT 'like' NOT NULL,
  "status" "reaction_status" DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "reactions_user_target_reaction_unique"
  ON "reactions" ("user_id", "target_type", "target_id", "reaction_type");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_reactions_target_reaction_status"
  ON "reactions" ("target_type", "target_id", "reaction_type", "status");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_reactions_user_target"
  ON "reactions" ("user_id", "target_type", "target_id", "reaction_type");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "reaction_aggregates" (
  "target_type" "reaction_target_type" NOT NULL,
  "target_id" text NOT NULL,
  "like_count" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "reaction_aggregates_target_unique"
  ON "reaction_aggregates" ("target_type", "target_id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_reaction_aggregates_target_type"
  ON "reaction_aggregates" ("target_type");
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'reactions_target_id_not_blank_check'
  ) THEN
    ALTER TABLE "reactions"
      ADD CONSTRAINT "reactions_target_id_not_blank_check"
      CHECK (length(trim("target_id")) > 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'reaction_aggregates_like_count_non_negative_check'
  ) THEN
    ALTER TABLE "reaction_aggregates"
      ADD CONSTRAINT "reaction_aggregates_like_count_non_negative_check"
      CHECK ("like_count" >= 0);
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'reaction_aggregates_target_id_not_blank_check'
  ) THEN
    ALTER TABLE "reaction_aggregates"
      ADD CONSTRAINT "reaction_aggregates_target_id_not_blank_check"
      CHECK (length(trim("target_id")) > 0);
  END IF;
END $$;
