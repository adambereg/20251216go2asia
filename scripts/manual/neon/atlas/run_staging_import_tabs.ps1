$ErrorActionPreference = 'Stop'

<#
  Импорт Atlas Country/City tabs (content_blocks только) в Neon STAGING.

  Требования:
  - В PowerShell должна быть установлена переменная окружения:
      $env:STAGING_DATABASE_URL = "postgresql://..."

  Запуск из корня репозитория:
    powershell -ExecutionPolicy Bypass -File scripts/manual/neon/atlas/run_staging_import_tabs.ps1

  Что делает:
  - генерирует exports/neon/**/content_blocks.sql (обновляет секцию ATLAS_COUNTRY_CITY_TABS)
  - применяет только content_blocks.sql по всем странам (НЕ трогает таблицы places/cities)
  - выводит DB verification (totalBlocks country/city + missing tab_key по smoke-набору)
#>

function Require-StagingDbUrl {
  if (-not $env:STAGING_DATABASE_URL -or $env:STAGING_DATABASE_URL.Trim().Length -eq 0) {
    throw "Missing STAGING_DATABASE_URL. Set it in this terminal: `$env:STAGING_DATABASE_URL = 'postgresql://...'"
  }
}

function Get-DbHost([string]$url) {
  $m = [regex]::Match($url, '^[a-zA-Z]+:\/\/[^@]+@([^\/\?:]+)')
  if ($m.Success) { return $m.Groups[1].Value }
  return $null
}

function Test-DbHostDns {
  $dbHost = Get-DbHost $env:STAGING_DATABASE_URL
  if (-not $dbHost) {
    throw "Could not parse DB host from STAGING_DATABASE_URL. Please re-check the connection string format."
  }
  Write-Host ("DB host: " + $dbHost) -ForegroundColor DarkGray
  try {
    Resolve-DnsName $dbHost | Out-Null
  } catch {
    throw "DNS resolution failed for DB host '$dbHost'. Try Neon 'Direct connection' string or fix network/VPN/DNS."
  }
}

function Run-Export {
  Write-Host ""
  Write-Host "=== EXPORT: Atlas country/city tabs -> exports/neon/**/content_blocks.sql ===" -ForegroundColor Cyan
  & pnpm -C packages/db exec -- tsx src/exportAtlasCountryCityTabsToNeon.ts
  if ($LASTEXITCODE -ne 0) { throw "Export failed (exit=$LASTEXITCODE)" }
}

function Run-ImportTabs([string]$country, [string]$city = $null) {
  Write-Host ""
  $label = "=== IMPORT TABS: $country ==="
  if ($city -and $city.Trim().Length -gt 0) { $label = "=== IMPORT TABS: $country (city=$city) ===" }
  Write-Host $label -ForegroundColor Cyan

  if ($city -and $city.Trim().Length -gt 0) {
    & pnpm -C packages/db exec -- tsx src/applyAtlasTabExportsToNeon.ts $country --city $city
  } else {
    & pnpm -C packages/db exec -- tsx src/applyAtlasTabExportsToNeon.ts $country
  }
  if ($LASTEXITCODE -ne 0) { throw "Import tabs failed for $country (exit=$LASTEXITCODE)" }
}

Require-StagingDbUrl
Test-DbHostDns
Run-Export

$countries = @(
  "vietnam",
  "thailand",
  "indonesia",
  "philippines",
  "malaysia",
  "singapore",
  "cambodia",
  "laos"
)

Write-Host "Starting Atlas STAGING tabs import for: $($countries -join ', ')" -ForegroundColor Green

foreach ($c in $countries) {
  Run-ImportTabs $c
}

# Smoke spot-check cities (IDs are Neon cities.id, aligned with places pipeline codes)
Run-ImportTabs "vietnam" "sgn"
Run-ImportTabs "thailand" "bkk"

Write-Host ""
Write-Host "DONE: Atlas STAGING tabs import completed successfully." -ForegroundColor Green

