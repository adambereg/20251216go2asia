-- Add minimal fields for Atlas places cards.
ALTER TABLE "places"
  ADD COLUMN IF NOT EXISTS "place_kind" text NOT NULL DEFAULT 'showplace',
  ADD COLUMN IF NOT EXISTS "category" text,
  ADD COLUMN IF NOT EXISTS "tags" jsonb,
  ADD COLUMN IF NOT EXISTS "website" text,
  ADD COLUMN IF NOT EXISTS "phone" text,
  ADD COLUMN IF NOT EXISTS "instagram" text,
  ADD COLUMN IF NOT EXISTS "google_maps_url" text,
  ADD COLUMN IF NOT EXISTS "price_level" text;

CREATE INDEX IF NOT EXISTS "idx_places_country_kind" ON "places" ("country_id", "place_kind");
CREATE INDEX IF NOT EXISTS "idx_places_city_kind" ON "places" ("city_id", "place_kind");

