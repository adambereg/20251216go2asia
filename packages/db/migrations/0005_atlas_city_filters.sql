-- Atlas Cities: editorial filters + indexes
-- Goal: server-side filtering/sort for /v1/content/cities and UI filters on /atlas/cities

-- 1) Enums (idempotent)
DO $$
BEGIN
  CREATE TYPE "atlas_city_type" AS ENUM (
    'resort',
    'cultural',
    'business',
    'nature',
    'island',
    'mountain',
    'historic',
    'mixed',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "atlas_city_size" AS ENUM ('small', 'medium', 'large', 'capital');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "atlas_city_price_level" AS ENUM ('budget', 'mid', 'expensive');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "atlas_city_nightlife_level" AS ENUM ('active', 'moderate', 'calm');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2) Columns (nullable => "Все")
ALTER TABLE "cities"
  ADD COLUMN IF NOT EXISTS "city_type" "atlas_city_type";

ALTER TABLE "cities"
  ADD COLUMN IF NOT EXISTS "city_size" "atlas_city_size";

ALTER TABLE "cities"
  ADD COLUMN IF NOT EXISTS "has_sea" boolean;

ALTER TABLE "cities"
  ADD COLUMN IF NOT EXISTS "price_level" "atlas_city_price_level";

ALTER TABLE "cities"
  ADD COLUMN IF NOT EXISTS "nightlife_level" "atlas_city_nightlife_level";

-- 3) Indexes (minimal baseline)
CREATE INDEX IF NOT EXISTS "idx_cities_city_type" ON "cities" ("city_type");
CREATE INDEX IF NOT EXISTS "idx_cities_city_size" ON "cities" ("city_size");
CREATE INDEX IF NOT EXISTS "idx_cities_has_sea" ON "cities" ("has_sea");
CREATE INDEX IF NOT EXISTS "idx_cities_price_level" ON "cities" ("price_level");
CREATE INDEX IF NOT EXISTS "idx_cities_nightlife_level" ON "cities" ("nightlife_level");

