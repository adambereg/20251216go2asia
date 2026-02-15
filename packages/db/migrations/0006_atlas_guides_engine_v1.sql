-- =====================================================================
-- 0006_atlas_guides_engine_v1.sql
-- Guide Engine v1 (Atlas Asia): guides + sections + blocks + feeds
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- Enums (фиксированный реестр, общий для backend/frontend)
-- ---------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE "atlas_guide_type" AS ENUM (
    'strategic',
    'comparative',
    'route',
    'niche',
    'event',
    'housing',
    'visa',
    'work_infra',
    'climate'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "atlas_guide_status" AS ENUM (
    'draft',
    'published',
    'verified',
    'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "atlas_guide_tab_key" AS ENUM (
    'overview',
    'compare',
    'locations',
    'route',
    'map',
    'practice',
    'events',
    'places',
    'audience',
    'faq',
    'experience'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "atlas_guide_block_type" AS ENUM (
    -- Base
    'rich_text',
    'callout',
    'bullets',
    'key_facts',
    'media',
    'divider',
    -- Structure
    'checklist',
    'steps',
    'timeline',
    'day_plan',
    'table',
    'scorecard',
    -- Geo / refs
    'map_config',
    'poi_refs',
    'city_refs',
    -- FAQ / linking
    'faq',
    'related_guides',
    -- Integrations
    'feed_embed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "atlas_guide_feed_source" AS ENUM (
    'pulse',
    'atlas_places',
    'blog'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "atlas_guide_feed_sort" AS ENUM (
    'relevance',
    'newest',
    'popular',
    'date_asc',
    'date_desc'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------
-- guides
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "guides" (
  "id" text PRIMARY KEY,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "summary" text,
  "guide_type" atlas_guide_type NOT NULL,
  "status" atlas_guide_status NOT NULL DEFAULT 'draft',
  "tags" text[] NOT NULL DEFAULT '{}',
  "country_ids" text[] NOT NULL DEFAULT '{}',
  "city_ids" text[] NOT NULL DEFAULT '{}',
  -- Media: allow either referencing media_files, or storing R2 key directly.
  "hero_media_id" uuid REFERENCES "media_files"("id"),
  "hero_r2_key" text,
  "hero_url" text,
  "published_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_guides_type" ON "guides" ("guide_type");
CREATE INDEX IF NOT EXISTS "idx_guides_status" ON "guides" ("status");
CREATE INDEX IF NOT EXISTS "idx_guides_published_at" ON "guides" ("published_at");
CREATE INDEX IF NOT EXISTS "idx_guides_tags_gin" ON "guides" USING GIN ("tags");
CREATE INDEX IF NOT EXISTS "idx_guides_country_ids_gin" ON "guides" USING GIN ("country_ids");
CREATE INDEX IF NOT EXISTS "idx_guides_city_ids_gin" ON "guides" USING GIN ("city_ids");

-- ---------------------------------------------------------------------
-- guide_sections (1 row per tab_key per guide)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "guide_sections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "guide_id" text NOT NULL REFERENCES "guides"("id") ON DELETE CASCADE,
  "tab_key" atlas_guide_tab_key NOT NULL,
  "title" text,
  "order_index" integer NOT NULL DEFAULT 0,
  "is_enabled" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "guide_sections_unique" UNIQUE ("guide_id", "tab_key")
);

CREATE INDEX IF NOT EXISTS "idx_guide_sections_guide_id" ON "guide_sections" ("guide_id");
CREATE INDEX IF NOT EXISTS "idx_guide_sections_order" ON "guide_sections" ("guide_id", "order_index");
CREATE INDEX IF NOT EXISTS "idx_guide_sections_enabled" ON "guide_sections" ("guide_id", "is_enabled");

-- ---------------------------------------------------------------------
-- guide_blocks (blocks inside a section)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "guide_blocks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "section_id" uuid NOT NULL REFERENCES "guide_sections"("id") ON DELETE CASCADE,
  "block_type" atlas_guide_block_type NOT NULL,
  "order_index" integer NOT NULL DEFAULT 0,
  "payload" jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- persisted "emptiness" computed by backend validators
  "is_empty" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_guide_blocks_section_id" ON "guide_blocks" ("section_id");
CREATE INDEX IF NOT EXISTS "idx_guide_blocks_order" ON "guide_blocks" ("section_id", "order_index");
CREATE INDEX IF NOT EXISTS "idx_guide_blocks_type" ON "guide_blocks" ("block_type");
CREATE INDEX IF NOT EXISTS "idx_guide_blocks_not_empty" ON "guide_blocks" ("section_id") WHERE "is_empty" = false;

-- ---------------------------------------------------------------------
-- guide_feeds (dynamic sources per guide/tab)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "guide_feeds" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "guide_id" text NOT NULL REFERENCES "guides"("id") ON DELETE CASCADE,
  "tab_key" atlas_guide_tab_key NOT NULL,
  "source" atlas_guide_feed_source NOT NULL,
  "filter" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "limit_count" integer NOT NULL DEFAULT 20,
  "sort" atlas_guide_feed_sort NOT NULL DEFAULT 'relevance',
  "order_index" integer NOT NULL DEFAULT 0,
  "is_enabled" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "guide_feeds_unique" UNIQUE ("guide_id", "tab_key", "source")
);

CREATE INDEX IF NOT EXISTS "idx_guide_feeds_guide_tab" ON "guide_feeds" ("guide_id", "tab_key");
CREATE INDEX IF NOT EXISTS "idx_guide_feeds_enabled" ON "guide_feeds" ("guide_id", "tab_key", "is_enabled") WHERE "is_enabled" = true;

