<#
  Import Vietnam Places to Neon staging.

  Safety:
  - Forces ENVIRONMENT=staging.
  - Requires STAGING_DATABASE_URL or DATABASE_URL to be set.
  - Executes SQL files in order: cleanup -> ensure -> places.

  Usage:
    $env:STAGING_DATABASE_URL="postgresql://..."
    powershell -ExecutionPolicy Bypass -File scripts/import-vn-places-staging.ps1
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Force staging for this script.
$env:ENVIRONMENT = "staging"

$dbUrl = $env:STAGING_DATABASE_URL
if ([string]::IsNullOrWhiteSpace($dbUrl)) { $dbUrl = $env:DATABASE_URL }
if ([string]::IsNullOrWhiteSpace($dbUrl)) {
  throw "Missing STAGING_DATABASE_URL or DATABASE_URL"
}

try {
  $uri = [Uri]$dbUrl
  Write-Host ("Importing VN places to staging DB on host={0} db={1}" -f $uri.Host, $uri.AbsolutePath)
} catch {
  Write-Host "Importing VN places to staging DB (host/db unknown: invalid URL format)"
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$exportDir = Join-Path $repoRoot "exports" "neon" "vietnam"

if (-not (Test-Path $exportDir)) {
  throw "Export directory not found: $exportDir. Run: pnpm -C packages/db tsx src/exportPlacesToNeon.ts"
}

# Check if psql is available
$psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlCmd) {
  Write-Host ""
  Write-Host "⚠️  psql not found in PATH. Please use Neon Console SQL Editor instead:" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "1. Open Neon Console: https://console.neon.tech"
  Write-Host "2. Select branch: staging-m4-content-seed"
  Write-Host "3. Go to SQL Editor"
  Write-Host "4. Execute files in this order:"
  Write-Host "   a) $exportDir\cleanup_vn_places.sql"
  Write-Host "   b) $exportDir\ensure_vn_country.sql"
  Write-Host "   c) $exportDir\ensure_vn_cities.sql"
  Write-Host "   d) $exportDir\places.sql"
  Write-Host "5. Verify with: $exportDir\smoke_vn.sql"
  Write-Host ""
  exit 1
}

Write-Host ""
Write-Host "Step 1/4: Cleanup existing VN places..." -ForegroundColor Cyan
$cleanupFile = Join-Path $exportDir "cleanup_vn_places.sql"
if (Test-Path $cleanupFile) {
  $cleanupSql = Get-Content $cleanupFile -Raw
  $cleanupSql | psql $dbUrl
  if ($LASTEXITCODE -ne 0) {
    throw "Cleanup failed (exit code: $LASTEXITCODE)"
  }
  Write-Host "✓ Cleanup completed" -ForegroundColor Green
} else {
  Write-Host "⚠️  Cleanup file not found: $cleanupFile" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 2/4: Ensure Vietnam country exists..." -ForegroundColor Cyan
$countryFile = Join-Path $exportDir "ensure_vn_country.sql"
if (Test-Path $countryFile) {
  $countrySql = Get-Content $countryFile -Raw
  $countrySql | psql $dbUrl
  if ($LASTEXITCODE -ne 0) {
    throw "Ensure country failed (exit code: $LASTEXITCODE)"
  }
  Write-Host "✓ Country ensured" -ForegroundColor Green
} else {
  throw "Country file not found: $countryFile"
}

Write-Host ""
Write-Host "Step 3/4: Ensure Vietnam cities exist..." -ForegroundColor Cyan
$citiesFile = Join-Path $exportDir "ensure_vn_cities.sql"
if (Test-Path $citiesFile) {
  $citiesSql = Get-Content $citiesFile -Raw
  $citiesSql | psql $dbUrl
  if ($LASTEXITCODE -ne 0) {
    throw "Ensure cities failed (exit code: $LASTEXITCODE)"
  }
  Write-Host "✓ Cities ensured" -ForegroundColor Green
} else {
  throw "Cities file not found: $citiesFile"
}

Write-Host ""
Write-Host "Step 4/4: Import places + content_blocks..." -ForegroundColor Cyan
$placesFile = Join-Path $exportDir "places.sql"
if (Test-Path $placesFile) {
  $placesSql = Get-Content $placesFile -Raw
  $placesSql | psql $dbUrl
  if ($LASTEXITCODE -ne 0) {
    throw "Import places failed (exit code: $LASTEXITCODE)"
  }
  Write-Host "✓ Places imported" -ForegroundColor Green
} else {
  throw "Places file not found: $placesFile"
}

Write-Host ""
Write-Host "✅ Import completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Run smoke check:" -ForegroundColor Cyan
Write-Host "  psql `"$dbUrl`" -f `"$exportDir\smoke_vn.sql`""
Write-Host ""
