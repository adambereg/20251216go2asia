#!/bin/bash
# Smoke check for Places import in Neon Postgres
# Usage: ./scripts/smoke-neon-places-import.sh [DATABASE_URL]

set -e

DATABASE_URL="${1:-${STAGING_DATABASE_URL:-${DATABASE_URL}}}"

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL or STAGING_DATABASE_URL must be set"
  echo "Usage: $0 [DATABASE_URL]"
  exit 1
fi

echo "=== Smoke Check: Places Import ==="
echo "Database: $(echo $DATABASE_URL | sed 's/:[^:]*@/:***@/')"
echo ""

# Extract connection details for psql
export PGPASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')

echo "1. Count places by country_id and place_kind:"
psql "$DATABASE_URL" -c "
SELECT 
  country_id, 
  place_kind, 
  COUNT(*) as count
FROM places
WHERE country_id = 'ph'
GROUP BY country_id, place_kind
ORDER BY place_kind;
"

echo ""
echo "2. Count places by city_id and place_kind:"
psql "$DATABASE_URL" -c "
SELECT 
  city_id, 
  place_kind, 
  COUNT(*) as count
FROM places
WHERE country_id = 'ph'
GROUP BY city_id, place_kind
ORDER BY city_id, place_kind;
"

echo ""
echo "3. Count content_blocks for places (overview, lang='ru'):"
psql "$DATABASE_URL" -c "
SELECT 
  COUNT(*) as total_blocks,
  COUNT(DISTINCT entity_id) as places_with_content
FROM content_blocks
WHERE entity_type = 'place' 
  AND tab_key = 'overview' 
  AND lang = 'ru';
"

echo ""
echo "4. Places without coordinates:"
psql "$DATABASE_URL" -c "
SELECT 
  id,
  slug,
  name,
  city_id
FROM places
WHERE country_id = 'ph'
  AND (lat IS NULL OR lng IS NULL)
ORDER BY city_id, name;
"

echo ""
echo "5. Places without content_blocks:"
psql "$DATABASE_URL" -c "
SELECT 
  p.id,
  p.slug,
  p.name,
  p.city_id
FROM places p
LEFT JOIN content_blocks cb ON (
  cb.entity_type = 'place' 
  AND cb.entity_id = p.id 
  AND cb.tab_key = 'overview' 
  AND cb.lang = 'ru'
)
WHERE p.country_id = 'ph'
  AND cb.id IS NULL
ORDER BY p.city_id, p.name;
"

echo ""
echo "6. Check for duplicate slugs:"
psql "$DATABASE_URL" -c "
SELECT 
  slug,
  COUNT(*) as count,
  array_agg(id ORDER BY id) as place_ids
FROM places
WHERE country_id = 'ph'
GROUP BY slug
HAVING COUNT(*) > 1;
"

echo ""
echo "7. Sample places (first 5):"
psql "$DATABASE_URL" -c "
SELECT 
  id,
  slug,
  name,
  place_kind,
  city_id,
  lat IS NOT NULL AND lng IS NOT NULL as has_coords,
  (SELECT COUNT(*) FROM content_blocks 
   WHERE entity_type = 'place' AND entity_id = places.id) as content_blocks_count
FROM places
WHERE country_id = 'ph'
ORDER BY city_id, name
LIMIT 5;
"

echo ""
echo "=== Smoke Check Complete ==="
