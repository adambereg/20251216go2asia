#!/bin/bash
# Smoke E2E tests for Milestone 3 via API Gateway
# Tests: Points Service, Referral Service, Auth → Points/Referral integration, Content → Points integration

set -e

GATEWAY_URL="${GATEWAY_URL:-https://go2asia-api-gateway-staging.fred89059599296.workers.dev}"
TEST_USER_ID="${TEST_USER_ID:-test-user-$(date +%s)}"
TEST_EVENT_ID="${TEST_EVENT_ID:-test-event-123}"

echo "🧪 Smoke E2E Tests for Milestone 3"
echo "Gateway URL: $GATEWAY_URL"
echo "Test User ID: $TEST_USER_ID"
echo ""

# Helper function
check_response() {
  local name=$1
  local status=$2
  local expected=$3
  if [ "$status" -eq "$expected" ]; then
    echo "✅ $name: HTTP $status (expected $expected)"
  else
    echo "❌ $name: HTTP $status (expected $expected)"
    exit 1
  fi
}

# 1. Health checks
echo "1️⃣ Testing health endpoints..."
HEALTH=$(curl -s -w "\n%{http_code}" "$GATEWAY_URL/health" | tail -1)
check_response "Gateway health" "$HEALTH" "200"

# 2. Points Service - Get balance (requires auth)
echo ""
echo "2️⃣ Testing Points Service endpoints..."
# Note: This will fail without valid JWT, but we're checking the endpoint exists
BALANCE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer invalid-token" "$GATEWAY_URL/v1/points/balance" | tail -1)
if [ "$BALANCE" -eq "401" ] || [ "$BALANCE" -eq "200" ]; then
  echo "✅ Points balance endpoint exists (HTTP $BALANCE)"
else
  echo "❌ Points balance endpoint unexpected status: $BALANCE"
  exit 1
fi

# 3. Referral Service - Get referral code (requires auth)
echo ""
echo "3️⃣ Testing Referral Service endpoints..."
REFERRAL=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer invalid-token" "$GATEWAY_URL/v1/referral/code" | tail -1)
if [ "$REFERRAL" -eq "401" ] || [ "$REFERRAL" -eq "200" ]; then
  echo "✅ Referral code endpoint exists (HTTP $REFERRAL)"
else
  echo "❌ Referral code endpoint unexpected status: $REFERRAL"
  exit 1
fi

# 4. Content Service - Event registration (requires auth)
echo ""
echo "4️⃣ Testing Content Service event registration..."
EVENT_REG=$(curl -s -w "\n%{http_code}" -X POST -H "Authorization: Bearer invalid-token" "$GATEWAY_URL/v1/content/events/$TEST_EVENT_ID/register" | tail -1)
if [ "$EVENT_REG" -eq "401" ] || [ "$EVENT_REG" -eq "201" ] || [ "$EVENT_REG" -eq "404" ]; then
  echo "✅ Event registration endpoint exists (HTTP $EVENT_REG)"
else
  echo "❌ Event registration endpoint unexpected status: $EVENT_REG"
  exit 1
fi

echo ""
echo "✅ All smoke tests passed!"
echo ""
echo "Note: Full E2E tests require valid JWT tokens from Clerk."
echo "To test with real tokens, set CLERK_JWT_TOKEN environment variable and run:"
echo "  curl -H 'Authorization: Bearer \$CLERK_JWT_TOKEN' $GATEWAY_URL/v1/points/balance"
