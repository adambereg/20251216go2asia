<#
  Seed staging DB (DDL + content seed).

  Safety:
  - Forces ENVIRONMENT=staging.
  - Refuses to run if ENVIRONMENT=production.
  - Requires STAGING_DATABASE_URL or DATABASE_URL to be set.
  - Does NOT print the full DB URL.

  Usage:
    # DDL + seed (idempotent)
    $env:STAGING_DATABASE_URL="postgresql://..."
    powershell -ExecutionPolicy Bypass -File scripts/seed-staging.ps1

    # Optional reset of content tables (NOT points/referral/auth)
    $env:STAGING_DATABASE_URL="postgresql://..."
    powershell -ExecutionPolicy Bypass -File scripts/seed-staging.ps1 -Reset
#>

param(
  [switch]$Reset,
  [switch]$SkipDdl
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Windows PowerShell 5.1 compatibility: avoid null-coalescing operator (??)
$envNameRaw = $env:ENVIRONMENT
if ([string]::IsNullOrWhiteSpace($envNameRaw)) { $envNameRaw = "dev" }
$envName = $envNameRaw.ToLowerInvariant()
if ($envName -eq "production") {
  throw "Refusing to run seed with ENVIRONMENT=production"
}

# Force staging for this script.
$env:ENVIRONMENT = "staging"

$dbUrl = $env:STAGING_DATABASE_URL
if ([string]::IsNullOrWhiteSpace($dbUrl)) { $dbUrl = $env:DATABASE_URL }
if ([string]::IsNullOrWhiteSpace($dbUrl)) {
  throw "Missing STAGING_DATABASE_URL or DATABASE_URL"
}

try {
  $uri = [Uri]$dbUrl
  Write-Host ("Seeding staging DB on host={0} db={1}" -f $uri.Host, $uri.AbsolutePath)
} catch {
  Write-Host "Seeding staging DB (host/db unknown: invalid URL format)"
}

if (-not $SkipDdl) {
  Write-Host "Applying DDL migrations..."
  pnpm -C packages/db db:ddl:apply:staging
}

if ($Reset) {
  Write-Host "SEED_RESET=1 (content tables only)"
  $env:SEED_RESET = "1"
} else {
  if ($env:SEED_RESET) { Remove-Item Env:\SEED_RESET -ErrorAction SilentlyContinue }
}

Write-Host "Running content seed..."
pnpm -C packages/db db:seed

Write-Host "Done."



