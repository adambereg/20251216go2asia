# Smoke E2E tests for Milestone 4 (Pulse demo) via API Gateway (PowerShell)
# Requires: CLERK_JWT_TOKEN env var to verify points change.

$ErrorActionPreference = "Stop"

$GATEWAY_URL = if ($env:GATEWAY_URL) { $env:GATEWAY_URL } else { "https://go2asia-api-gateway-staging.fred89059599296.workers.dev" }
$EVENT_ID = if ($env:EVENT_ID) { $env:EVENT_ID } else { "e7f8b7d4-6f6a-4f1e-9aa0-2d4dbaac7b10" }
$RUN_SEED = if ($env:RUN_SEED) { $env:RUN_SEED } else { "0" }

Write-Host "🧪 Smoke E2E Tests for Milestone 4 (Pulse demo)" -ForegroundColor Cyan
Write-Host "Gateway URL: $GATEWAY_URL"
Write-Host "Event ID: $EVENT_ID"
Write-Host ""

if ($RUN_SEED -eq "1") {
  if (-not $env:STAGING_DATABASE_URL) {
    Write-Host "❌ RUN_SEED=1, but STAGING_DATABASE_URL is not set" -ForegroundColor Red
    exit 1
  }
  Write-Host "🌱 Running seed (staging only)..." -ForegroundColor Yellow
  pnpm --dir packages/db db:seed:pulse
  Write-Host ""
}

# 1) GET event (public)
Write-Host "1️⃣ GET /v1/content/events/{id} (public)" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$GATEWAY_URL/v1/content/events/$EVENT_ID" -Method GET -UseBasicParsing
if ($response.StatusCode -ne 200) {
  Write-Host "❌ Event GET failed: HTTP $($response.StatusCode)" -ForegroundColor Red
  exit 1
}
Write-Host "✅ Event GET: HTTP 200" -ForegroundColor Green

if (-not $env:CLERK_JWT_TOKEN) {
  Write-Host "" 
  Write-Host "❌ CLERK_JWT_TOKEN is required to test register + points verification." -ForegroundColor Red
  Write-Host "Set it and rerun. Example:" -ForegroundColor Yellow
  Write-Host "  `$env:CLERK_JWT_TOKEN=\"YOUR_TOKEN_HERE\"" -ForegroundColor Yellow
  exit 1
}

$headers = @{
  "Authorization" = "Bearer $($env:CLERK_JWT_TOKEN)"
}

function Get-Json($url) {
  $r = Invoke-WebRequest -Uri $url -Method GET -Headers $headers -UseBasicParsing
  return ($r.Content | ConvertFrom-Json)
}

# 2) balance before
Write-Host "" 
Write-Host "2️⃣ GET /v1/points/balance (auth)" -ForegroundColor Yellow
$balanceBefore = Get-Json "$GATEWAY_URL/v1/points/balance"
$beforeValue = [int]$balanceBefore.balance
Write-Host "✅ Balance before: $beforeValue" -ForegroundColor Green

# 3) register
Write-Host "" 
Write-Host "3️⃣ POST /v1/content/events/{id}/register (auth)" -ForegroundColor Yellow
try {
  $regResp = Invoke-WebRequest -Uri "$GATEWAY_URL/v1/content/events/$EVENT_ID/register" -Method POST -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue
  $regStatus = $regResp.StatusCode
} catch {
  $regStatus = $_.Exception.Response.StatusCode.value__
}
if (($regStatus -ne 201) -and ($regStatus -ne 409)) {
  Write-Host "❌ Register unexpected status: HTTP $regStatus (expected 201 or 409)" -ForegroundColor Red
  exit 1
}
Write-Host "✅ Register: HTTP $regStatus" -ForegroundColor Green

# 4) balance after
Write-Host "" 
Write-Host "4️⃣ GET /v1/points/balance (auth)" -ForegroundColor Yellow
$balanceAfter = Get-Json "$GATEWAY_URL/v1/points/balance"
$afterValue = [int]$balanceAfter.balance
Write-Host "✅ Balance after: $afterValue" -ForegroundColor Green

# 5) transactions and verify event_registration exists
Write-Host "" 
Write-Host "5️⃣ GET /v1/points/transactions (auth)" -ForegroundColor Yellow
$tx = Get-Json "$GATEWAY_URL/v1/points/transactions?limit=50"
$items = $tx.items
$hasEventTx = $false
foreach ($it in $items) {
  if ($it.action -eq "event_registration") { $hasEventTx = $true }
  if ($it.externalId -and ($it.externalId -like "*content:event_registration*") ) { $hasEventTx = $true }
}

if (-not $hasEventTx) {
  Write-Host "❌ No event_registration transaction found in last 50 items" -ForegroundColor Red
  exit 1
}
Write-Host "✅ Found event_registration transaction" -ForegroundColor Green

if ($regStatus -eq 201) {
  if ($afterValue -lt $beforeValue) {
    Write-Host "❌ Balance decreased after registration (unexpected)" -ForegroundColor Red
    exit 1
  }
}

Write-Host "" 
Write-Host "✅ M4 Pulse smoke tests passed" -ForegroundColor Green
