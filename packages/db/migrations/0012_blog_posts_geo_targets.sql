-- =====================================================================
-- 0012_blog_posts_geo_targets.sql
-- Blog Asia: geo shortcuts from frontmatter targets
-- =====================================================================

ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "country_slug" text;
--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "city_slug" text;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_blog_posts_country_published_at_desc"
  ON "blog_posts" ("country_slug", "published_at" DESC)
  WHERE "status" = 'published';
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_blog_posts_city_published_at_desc"
  ON "blog_posts" ("city_slug", "published_at" DESC)
  WHERE "status" = 'published';
--> statement-breakpoint

