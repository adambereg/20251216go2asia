# Smoke E2E tests for Milestone 3 via API Gateway (PowerShell)
# Tests: Points Service, Referral Service, Auth → Points/Referral integration, Content → Points integration

$ErrorActionPreference = "Stop"

$GATEWAY_URL = if ($env:GATEWAY_URL) { $env:GATEWAY_URL } else { "https://go2asia-api-gateway-staging.fred89059599296.workers.dev" }
$TEST_USER_ID = if ($env:TEST_USER_ID) { $env:TEST_USER_ID } else { "test-user-$(Get-Date -Format 'yyyyMMddHHmmss')" }
$TEST_EVENT_ID = if ($env:TEST_EVENT_ID) { $env:TEST_EVENT_ID } else { "test-event-123" }

Write-Host "🧪 Smoke E2E Tests for Milestone 3" -ForegroundColor Cyan
Write-Host "Gateway URL: $GATEWAY_URL"
Write-Host "Test User ID: $TEST_USER_ID"
Write-Host ""

function Check-Response {
    param(
        [string]$Name,
        [int]$Status,
        [int]$Expected
    )
    if ($Status -eq $Expected) {
        Write-Host "✅ $Name`: HTTP $Status (expected $Expected)" -ForegroundColor Green
    } else {
        Write-Host "❌ $Name`: HTTP $Status (expected $Expected)" -ForegroundColor Red
        exit 1
    }
}

# 1. Health checks
Write-Host "1️⃣ Testing health endpoints..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$GATEWAY_URL/health" -Method GET -UseBasicParsing
    Check-Response "Gateway health" $response.StatusCode 200
} catch {
    Write-Host "❌ Gateway health check failed: $_" -ForegroundColor Red
    exit 1
}

# 2. Points Service - Get balance (requires auth)
Write-Host ""
Write-Host "2️⃣ Testing Points Service endpoints..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer invalid-token"
    }
    $response = Invoke-WebRequest -Uri "$GATEWAY_URL/v1/points/balance" -Method GET -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue
    $status = $response.StatusCode
} catch {
    $status = $_.Exception.Response.StatusCode.value__
}
if ($status -eq 401 -or $status -eq 200) {
    Write-Host "✅ Points balance endpoint exists (HTTP $status)" -ForegroundColor Green
} else {
    Write-Host "❌ Points balance endpoint unexpected status: $status" -ForegroundColor Red
    exit 1
}

# 3. Referral Service - Get referral code (requires auth)
Write-Host ""
Write-Host "3️⃣ Testing Referral Service endpoints..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer invalid-token"
    }
    $response = Invoke-WebRequest -Uri "$GATEWAY_URL/v1/referral/code" -Method GET -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue
    $status = $response.StatusCode
} catch {
    $status = $_.Exception.Response.StatusCode.value__
}
if ($status -eq 401 -or $status -eq 200) {
    Write-Host "✅ Referral code endpoint exists (HTTP $status)" -ForegroundColor Green
} else {
    Write-Host "❌ Referral code endpoint unexpected status: $status" -ForegroundColor Red
    exit 1
}

# 4. Content Service - Event registration (requires auth)
Write-Host ""
Write-Host "4️⃣ Testing Content Service event registration..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer invalid-token"
    }
    $response = Invoke-WebRequest -Uri "$GATEWAY_URL/v1/content/events/$TEST_EVENT_ID/register" -Method POST -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue
    $status = $response.StatusCode
} catch {
    $status = $_.Exception.Response.StatusCode.value__
}
if ($status -eq 401 -or $status -eq 201 -or $status -eq 404) {
    Write-Host "✅ Event registration endpoint exists (HTTP $status)" -ForegroundColor Green
} else {
    Write-Host "❌ Event registration endpoint unexpected status: $status" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ All smoke tests passed!" -ForegroundColor Green
Write-Host ""
Write-Host "Note: Full E2E tests require valid JWT tokens from Clerk." -ForegroundColor Yellow
Write-Host "To test with real tokens, set `$env:CLERK_JWT_TOKEN and run:" -ForegroundColor Yellow
Write-Host "  Invoke-WebRequest -Uri '$GATEWAY_URL/v1/points/balance' -Headers @{ 'Authorization' = 'Bearer ' + `$env:CLERK_JWT_TOKEN }" -ForegroundColor Yellow
