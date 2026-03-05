-- =====================================================================
-- 0011_blog_posts_v1.sql
-- Blog Asia (prod SSOT): blog_posts + authors + tags (no mixing with Atlas guides)
-- =====================================================================

-- 1) ENUMs (idempotent)
DO $$ BEGIN
  CREATE TYPE "blog_post_status" AS ENUM('draft', 'in_review', 'scheduled', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

-- 2) Authors
CREATE TABLE IF NOT EXISTS "blog_authors" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "display_name" text NOT NULL,
  "bio" text,
  "user_id" text,
  "avatar_media_id" text REFERENCES "media_files"("id") ON DELETE SET NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "blog_authors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_blog_authors_user_id" ON "blog_authors" ("user_id");
--> statement-breakpoint

-- 3) Posts
CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "lang" text NOT NULL DEFAULT 'ru',
  "title" text NOT NULL,
  "subtitle" text,
  "excerpt" text,
  "content_markdown" text NOT NULL,
  "post_type" text,
  "category" text,
  "status" blog_post_status NOT NULL DEFAULT 'draft',
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "author_id" text REFERENCES "blog_authors"("id") ON DELETE SET NULL,
  "hero_media_id" text REFERENCES "media_files"("id") ON DELETE SET NULL,
  "reading_time_minutes" integer,
  -- Feed helpers (minimal, extensible)
  "is_promoted" boolean NOT NULL DEFAULT false,
  "is_featured" boolean NOT NULL DEFAULT false,
  "is_editor_pick" boolean NOT NULL DEFAULT false,
  "featured_rank" integer NOT NULL DEFAULT 0,
  -- Popularity (MVP: can be updated asynchronously)
  "views_total" integer NOT NULL DEFAULT 0,
  "popularity_score" numeric(12, 4) NOT NULL DEFAULT 0,
  CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint

-- Fast feeds
CREATE INDEX IF NOT EXISTS "idx_blog_posts_status_published_at_desc"
  ON "blog_posts" ("status", "published_at" DESC);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_blog_posts_published_at_desc_published_only"
  ON "blog_posts" ("published_at" DESC)
  WHERE "status" = 'published';
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_blog_posts_featured"
  ON "blog_posts" ("featured_rank" DESC, "published_at" DESC)
  WHERE "status" = 'published' AND "is_featured" = true;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_blog_posts_popular"
  ON "blog_posts" ("popularity_score" DESC, "published_at" DESC)
  WHERE "status" = 'published';
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_blog_posts_author_published_at"
  ON "blog_posts" ("author_id", "published_at" DESC)
  WHERE "status" = 'published';
--> statement-breakpoint

-- 4) Tags
CREATE TABLE IF NOT EXISTS "blog_tags" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "blog_tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint

-- 5) M2M post-tags
CREATE TABLE IF NOT EXISTS "blog_post_tags" (
  "post_id" text NOT NULL,
  "tag_id" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "blog_post_tags_pk" PRIMARY KEY ("post_id", "tag_id"),
  CONSTRAINT "blog_post_tags_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE,
  CONSTRAINT "blog_post_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "blog_tags"("id") ON DELETE CASCADE
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_blog_post_tags_tag_id_post_id"
  ON "blog_post_tags" ("tag_id", "post_id");
--> statement-breakpoint

