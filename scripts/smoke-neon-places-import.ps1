# Smoke check for Places import in Neon Postgres (PowerShell)
# Usage: .\scripts\smoke-neon-places-import.ps1 [DATABASE_URL]

param(
    [string]$DatabaseUrl = $env:STAGING_DATABASE_URL
)

if (-not $DatabaseUrl) {
    $DatabaseUrl = $env:DATABASE_URL
}

if (-not $DatabaseUrl) {
    Write-Host "Error: DATABASE_URL or STAGING_DATABASE_URL must be set" -ForegroundColor Red
    Write-Host "Usage: .\scripts\smoke-neon-places-import.ps1 [DATABASE_URL]"
    exit 1
}

Write-Host "=== Smoke Check: Places Import ===" -ForegroundColor Cyan
$maskedUrl = $DatabaseUrl -replace ':[^:]*@', ':***@'
Write-Host "Database: $maskedUrl"
Write-Host ""

# Install psql if needed (check if psql is available)
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "Error: psql not found. Please install PostgreSQL client tools." -ForegroundColor Red
    exit 1
}

Write-Host "1. Count places by country_id and place_kind:" -ForegroundColor Yellow
psql $DatabaseUrl -c @"
SELECT 
  country_id, 
  place_kind, 
  COUNT(*) as count
FROM places
WHERE country_id = 'ph'
GROUP BY country_id, place_kind
ORDER BY place_kind;
"@

Write-Host ""
Write-Host "2. Count places by city_id and place_kind:" -ForegroundColor Yellow
psql $DatabaseUrl -c @"
SELECT 
  city_id, 
  place_kind, 
  COUNT(*) as count
FROM places
WHERE country_id = 'ph'
GROUP BY city_id, place_kind
ORDER BY city_id, place_kind;
"@

Write-Host ""
Write-Host "3. Count content_blocks for places (overview, lang='ru'):" -ForegroundColor Yellow
psql $DatabaseUrl -c @"
SELECT 
  COUNT(*) as total_blocks,
  COUNT(DISTINCT entity_id) as places_with_content
FROM content_blocks
WHERE entity_type = 'place' 
  AND tab_key = 'overview' 
  AND lang = 'ru';
"@

Write-Host ""
Write-Host "4. Places without coordinates:" -ForegroundColor Yellow
psql $DatabaseUrl -c @"
SELECT 
  id,
  slug,
  name,
  city_id
FROM places
WHERE country_id = 'ph'
  AND (lat IS NULL OR lng IS NULL)
ORDER BY city_id, name;
"@

Write-Host ""
Write-Host "5. Places without content_blocks:" -ForegroundColor Yellow
psql $DatabaseUrl -c @"
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
"@

Write-Host ""
Write-Host "6. Check for duplicate slugs:" -ForegroundColor Yellow
psql $DatabaseUrl -c @"
SELECT 
  slug,
  COUNT(*) as count,
  array_agg(id ORDER BY id) as place_ids
FROM places
WHERE country_id = 'ph'
GROUP BY slug
HAVING COUNT(*) > 1;
"@

Write-Host ""
Write-Host "7. Sample places (first 5):" -ForegroundColor Yellow
psql $DatabaseUrl -c @"
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
"@

Write-Host ""
Write-Host "=== Smoke Check Complete ===" -ForegroundColor Green
