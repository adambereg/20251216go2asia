$ErrorActionPreference = 'Stop'

<#
  Массовый импорт Atlas (places + content_blocks) в Neon STAGING.

  Требования:
  - В PowerShell должна быть установлена переменная окружения:
      $env:STAGING_DATABASE_URL = "postgresql://..."

  Запуск из корня репозитория:
    powershell -ExecutionPolicy Bypass -File scripts/manual/neon/atlas/run_staging_import_all.ps1

  Что делает:
  - последовательно применяет exports/neon/<country>/{places.sql,content_blocks.sql}
  - использует packages/db/src/applyAtlasExportsToNeon.ts
  - останавливается при первой ошибке (fail-fast)
  - в конце делает spot-check двух пилотов Лаоса по --slug
#>

function Require-StagingDbUrl {
  if (-not $env:STAGING_DATABASE_URL -or $env:STAGING_DATABASE_URL.Trim().Length -eq 0) {
    throw "Missing STAGING_DATABASE_URL. Set it in this terminal: `$env:STAGING_DATABASE_URL = 'postgresql://...'"
  }
}

function Run-Import([string]$country, [string]$slug = $null) {
  $slugArg = ""
  if ($slug -and $slug.Trim().Length -gt 0) {
    $slugArg = " --slug $slug"
  }

  Write-Host ""
  Write-Host "=== IMPORT: $country$([string]::IsNullOrEmpty($slug) ? '' : \" (slug=$slug)\") ===" -ForegroundColor Cyan

  # Важно: используем pnpm exec -- tsx (Windows-friendly)
  $cmd = "pnpm -C packages/db exec -- tsx src/applyAtlasExportsToNeon.ts $country$slugArg"
  Write-Host $cmd -ForegroundColor DarkGray
  Invoke-Expression $cmd

  if ($LASTEXITCODE -ne 0) {
    throw "Import failed for $country (exit=$LASTEXITCODE)"
  }
}

Require-StagingDbUrl

# Порядок: сначала “большие” страны, затем остальные (можно менять при необходимости)
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

Write-Host "Starting Atlas STAGING import for: $($countries -join ', ')" -ForegroundColor Green

foreach ($c in $countries) {
  Run-Import $c
}

# Spot-check пилотов (после общего импорта Лаоса)
Run-Import "laos" "vte-pha-that-luang"
Run-Import "laos" "vte-kualao-restaurant"

Write-Host ""
Write-Host "DONE: Atlas STAGING import completed successfully." -ForegroundColor Green

