-- =====================================================================
-- 0015_space_core_v1.sql
-- Space social core baseline for Step 4
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'space_post_type') THEN
    CREATE TYPE "space_post_type" AS ENUM ('post', 'repost', 'system');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'space_post_visibility') THEN
    CREATE TYPE "space_post_visibility" AS ENUM ('public', 'followers', 'group', 'private');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'space_post_status') THEN
    CREATE TYPE "space_post_status" AS ENUM ('active', 'flagged', 'hidden', 'deleted');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'space_repost_target_type') THEN
    CREATE TYPE "space_repost_target_type" AS ENUM (
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
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'space_group_visibility') THEN
    CREATE TYPE "space_group_visibility" AS ENUM ('public', 'private', 'invite_only');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'space_group_status') THEN
    CREATE TYPE "space_group_status" AS ENUM ('active', 'hidden', 'archived');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'space_group_member_role') THEN
    CREATE TYPE "space_group_member_role" AS ENUM ('member', 'moderator', 'owner');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'space_group_member_status') THEN
    CREATE TYPE "space_group_member_status" AS ENUM ('active', 'pending', 'removed', 'blocked');
  END IF;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "space_group" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" varchar(160) NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "owner_id" text NOT NULL,
  "visibility" "space_group_visibility" DEFAULT 'public' NOT NULL,
  "status" "space_group_status" DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "space_group_slug_unique"
  ON "space_group" ("slug");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_group_owner_id"
  ON "space_group" ("owner_id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_group_status_visibility"
  ON "space_group" ("status", "visibility");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "space_post" (
  "id" text PRIMARY KEY NOT NULL,
  "author_id" text NOT NULL,
  "group_id" text,
  "post_type" "space_post_type" NOT NULL,
  "visibility" "space_post_visibility" NOT NULL,
  "text" text,
  "repost_target_type" "space_repost_target_type",
  "repost_target_id" text,
  "status" "space_post_status" DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "published_at" timestamp DEFAULT now() NOT NULL,
  "deleted_at" timestamp
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_post_author_published_at"
  ON "space_post" ("author_id", "published_at", "id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_post_group_published_at"
  ON "space_post" ("group_id", "published_at", "id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_post_visibility_published_at"
  ON "space_post" ("visibility", "published_at", "id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_post_status_published_at"
  ON "space_post" ("status", "published_at", "id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_post_repost_target"
  ON "space_post" ("repost_target_type", "repost_target_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "space_group_member" (
  "group_id" text NOT NULL,
  "user_id" text NOT NULL,
  "role" "space_group_member_role" DEFAULT 'member' NOT NULL,
  "status" "space_group_member_status" DEFAULT 'active' NOT NULL,
  "joined_at" timestamp DEFAULT now() NOT NULL,
  "invited_by" text,
  CONSTRAINT "space_group_member_pk" PRIMARY KEY ("group_id", "user_id")
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_group_member_user_status"
  ON "space_group_member" ("user_id", "status");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_group_member_group_status"
  ON "space_group_member" ("group_id", "status");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "space_post_media" (
  "post_id" text NOT NULL,
  "media_id" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "attached_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "space_post_media_pk" PRIMARY KEY ("post_id", "media_id")
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_post_media_post_sort_order"
  ON "space_post_media" ("post_id", "sort_order");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_post_media_media_id"
  ON "space_post_media" ("media_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "space_profile_projection" (
  "user_id" text PRIMARY KEY NOT NULL,
  "display_name" text,
  "avatar_url" text,
  "role_label" varchar(64),
  "country_id" text,
  "city_id" text,
  "bio_short" text,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_profile_projection_country_city"
  ON "space_profile_projection" ("country_id", "city_id");
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'space_post_group_id_space_group_id_fk'
  ) THEN
    ALTER TABLE "space_post"
      ADD CONSTRAINT "space_post_group_id_space_group_id_fk"
      FOREIGN KEY ("group_id")
      REFERENCES "public"."space_group"("id")
      ON DELETE no action
      ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'space_post_non_repost_forbids_repost_target_check'
  ) THEN
    ALTER TABLE "space_post"
      ADD CONSTRAINT "space_post_non_repost_forbids_repost_target_check"
      CHECK (
        "post_type" = 'repost'
        OR (
          "repost_target_type" IS NULL
          AND "repost_target_id" IS NULL
        )
      );
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'space_post_group_id_requires_group_visibility_check'
  ) THEN
    ALTER TABLE "space_post"
      ADD CONSTRAINT "space_post_group_id_requires_group_visibility_check"
      CHECK ("group_id" IS NULL OR "visibility" = 'group');
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'space_group_member_group_id_space_group_id_fk'
  ) THEN
    ALTER TABLE "space_group_member"
      ADD CONSTRAINT "space_group_member_group_id_space_group_id_fk"
      FOREIGN KEY ("group_id")
      REFERENCES "public"."space_group"("id")
      ON DELETE cascade
      ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'space_post_media_post_id_space_post_id_fk'
  ) THEN
    ALTER TABLE "space_post_media"
      ADD CONSTRAINT "space_post_media_post_id_space_post_id_fk"
      FOREIGN KEY ("post_id")
      REFERENCES "public"."space_post"("id")
      ON DELETE cascade
      ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'space_post_repost_pair_consistency_check'
  ) THEN
    ALTER TABLE "space_post"
      ADD CONSTRAINT "space_post_repost_pair_consistency_check"
      CHECK (
        (
          "repost_target_type" IS NULL
          AND "repost_target_id" IS NULL
        )
        OR (
          "repost_target_type" IS NOT NULL
          AND "repost_target_id" IS NOT NULL
        )
      );
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'space_post_repost_requires_target_check'
  ) THEN
    ALTER TABLE "space_post"
      ADD CONSTRAINT "space_post_repost_requires_target_check"
      CHECK (
        "post_type" <> 'repost'
        OR (
          "repost_target_type" IS NOT NULL
          AND "repost_target_id" IS NOT NULL
        )
      );
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'space_post_group_visibility_requires_group_check'
  ) THEN
    ALTER TABLE "space_post"
      ADD CONSTRAINT "space_post_group_visibility_requires_group_check"
      CHECK ("visibility" <> 'group' OR "group_id" IS NOT NULL);
  END IF;
END $$;
--> statement-breakpoint
