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

function Get-DbHost([string]$url) {
  # Works for postgresql://user:pass@host:port/db?...
  $m = [regex]::Match($url, '^[a-zA-Z]+:\/\/[^@]+@([^\/\?:]+)')
  if ($m.Success) { return $m.Groups[1].Value }
  return $null
}

function Test-DbHostDns {
  # NOTE: do NOT use $host (reserved, read-only automatic variable $Host)
  $dbHost = Get-DbHost $env:STAGING_DATABASE_URL
  if (-not $dbHost) {
    throw "Could not parse DB host from STAGING_DATABASE_URL. Please re-check the connection string format."
  }
  Write-Host ("DB host: " + $dbHost) -ForegroundColor DarkGray
  try {
    # Resolve-DnsName exists in Windows PowerShell 5.1+
    Resolve-DnsName $dbHost | Out-Null
  } catch {
    throw "DNS resolution failed for DB host '$dbHost'. Try Neon 'Direct connection' string or fix network/VPN/DNS."
  }
}

function Run-Import([string]$country, [string]$slug = $null) {
  $slugArg = ""
  if ($slug -and $slug.Trim().Length -gt 0) {
    $slugArg = $slug
  }

  Write-Host ""
  $label = "=== IMPORT: $country ==="
  if ($slug -and $slug.Trim().Length -gt 0) {
    $label = "=== IMPORT: $country (slug=$slug) ==="
  }
  Write-Host $label -ForegroundColor Cyan

  # Важно: НЕ используем Invoke-Expression (может ломать парсинг). Вызываем pnpm напрямую.
  if ($slugArg) {
    & pnpm -C packages/db exec -- tsx src/applyAtlasExportsToNeon.ts $country --slug $slugArg
  } else {
    & pnpm -C packages/db exec -- tsx src/applyAtlasExportsToNeon.ts $country
  }

  if ($LASTEXITCODE -ne 0) {
    throw "Import failed for $country (exit=$LASTEXITCODE)"
  }
}

Require-StagingDbUrl
Test-DbHostDns

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

