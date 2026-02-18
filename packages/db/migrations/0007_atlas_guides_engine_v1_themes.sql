-- =====================================================================
-- 0007_atlas_guides_engine_v1_themes.sql
-- Guide Engine v1: add Themes support (guide_type=theme + extra tab keys)
-- =====================================================================

-- Add guide type: theme
DO $$ BEGIN
  ALTER TYPE "atlas_guide_type" ADD VALUE 'theme';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add theme tab keys
DO $$ BEGIN
  ALTER TYPE "atlas_guide_tab_key" ADD VALUE 'scenarios';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE "atlas_guide_tab_key" ADD VALUE 'costs';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE "atlas_guide_tab_key" ADD VALUE 'risks';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE "atlas_guide_tab_key" ADD VALUE 'checklists';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE "atlas_guide_tab_key" ADD VALUE 'links';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

