-- Normalization views (read-only adapters).
-- Purpose: provide stable SSOT fields for API/seed migration while legacy columns still exist.
-- SSOT:
-- - events: start_at/end_at (timestamptz), lat/lng (numeric)
-- - cities/places: lat/lng (numeric)

--> statement-breakpoint
CREATE OR REPLACE VIEW atlas_cities_v AS
SELECT
  id,
  country_id,
  name,
  slug,
  description_short,
  coalesce(lat, latitude) AS lat,
  coalesce(lng, longitude) AS lng,
  hero_media_id,
  created_at,
  updated_at
FROM cities;

--> statement-breakpoint
CREATE OR REPLACE VIEW atlas_places_v AS
SELECT
  id,
  country_id,
  city_id,
  name,
  slug,
  type,
  description_short,
  coalesce(lat, latitude) AS lat,
  coalesce(lng, longitude) AS lng,
  address,
  hero_media_id,
  images,
  created_at,
  updated_at
FROM places;

--> statement-breakpoint
CREATE OR REPLACE VIEW pulse_events_v AS
SELECT
  id,
  title,
  slug,
  description,
  category,
  -- Explicit casts to avoid relying on implicit coercions:
  -- - start_at/end_at are timestamptz
  -- - legacy start_date/end_date may be timestamp/date in older snapshots
  coalesce(start_at, (start_date::timestamp at time zone 'UTC')) AS start_at,
  coalesce(end_at, (end_date::timestamp at time zone 'UTC')) AS end_at,
  location,
  country_id,
  city_id,
  coalesce(lat, latitude) AS lat,
  coalesce(lng, longitude) AS lng,
  image_url,
  image_media_id,
  is_free,
  price_amount,
  price_currency,
  status,
  is_active,
  created_at,
  updated_at
FROM events;