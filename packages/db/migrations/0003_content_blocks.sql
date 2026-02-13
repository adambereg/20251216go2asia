-- =====================================================================
-- 0003_content_blocks.sql
-- Minimal content blocks for Atlas tabs
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "content_blocks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "entity_type" text NOT NULL,
  "entity_id" text NOT NULL,
  "tab_key" text NOT NULL,
  "lang" text NOT NULL,
  "title" text,
  "body_markdown" text NOT NULL,
  "source" text NOT NULL DEFAULT 'seed',
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "content_blocks_unique" UNIQUE("entity_type","entity_id","tab_key","lang")
);

CREATE INDEX IF NOT EXISTS "idx_content_blocks_entity" ON "content_blocks" ("entity_type","entity_id");
CREATE INDEX IF NOT EXISTS "idx_content_blocks_tab_lang" ON "content_blocks" ("tab_key","lang");

