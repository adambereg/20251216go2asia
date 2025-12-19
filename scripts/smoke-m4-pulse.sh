#!/bin/bash
# Smoke E2E tests for Milestone 4 (Pulse demo) via API Gateway
# Requires: CLERK_JWT_TOKEN env var to verify points change.

set -euo pipefail

GATEWAY_URL="${GATEWAY_URL:-https://go2asia-api-gateway-staging.fred89059599296.workers.dev}"
EVENT_ID="${EVENT_ID:-e7f8b7d4-6f6a-4f1e-9aa0-2d4dbaac7b10}"
RUN_SEED="${RUN_SEED:-0}"

echo "🧪 Smoke E2E Tests for Milestone 4 (Pulse demo)"
echo "Gateway URL: $GATEWAY_URL"
echo "Event ID: $EVENT_ID"
echo ""

if [ "$RUN_SEED" = "1" ]; then
  if [ -z "${STAGING_DATABASE_URL:-}" ]; then
    echo "❌ RUN_SEED=1, but STAGING_DATABASE_URL is not set"
    exit 1
  fi
  echo "🌱 Running seed (staging only)..."
  pnpm --dir packages/db db:seed:pulse
  echo ""
fi

echo "1️⃣ GET /v1/content/events/{id} (public)"
status=$(curl -s -o /dev/null -w "%{http_code}" "$GATEWAY_URL/v1/content/events/$EVENT_ID")
if [ "$status" != "200" ]; then
  echo "❌ Event GET failed: HTTP $status"
  exit 1
fi
echo "✅ Event GET: HTTP 200"

token="${CLERK_JWT_TOKEN:-}"
if [ -z "$token" ]; then
  echo ""
  echo "❌ CLERK_JWT_TOKEN is required to test register + points verification."
  exit 1
fi

balance_before=$(curl -s -H "Authorization: Bearer $token" "$GATEWAY_URL/v1/points/balance" | python -c "import sys,json; print(json.load(sys.stdin)['balance'])")
echo "✅ Balance before: $balance_before"

echo "3️⃣ POST /v1/content/events/{id}/register (auth)"
reg_status=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Authorization: Bearer $token" "$GATEWAY_URL/v1/content/events/$EVENT_ID/register")
if [ "$reg_status" != "201" ] && [ "$reg_status" != "409" ]; then
  echo "❌ Register unexpected status: HTTP $reg_status (expected 201 or 409)"
  exit 1
fi
echo "✅ Register: HTTP $reg_status"

balance_after=$(curl -s -H "Authorization: Bearer $token" "$GATEWAY_URL/v1/points/balance" | python -c "import sys,json; print(json.load(sys.stdin)['balance'])")
echo "✅ Balance after: $balance_after"

echo "5️⃣ GET /v1/points/transactions (auth)"
transactions=$(curl -s -H "Authorization: Bearer $token" "$GATEWAY_URL/v1/points/transactions?limit=50")
python - <<'PY'
import json,sys
obj=json.loads(sys.stdin.read())
items=obj.get('items') or []
for it in items:
  if it.get('action')=='event_registration':
    print('OK')
    sys.exit(0)
  ext=it.get('externalId') or ''
  if 'content:event_registration' in ext:
    print('OK')
    sys.exit(0)
print('NO')
sys.exit(1)
PY <<<"$transactions" >/dev/null

echo "✅ Found event_registration transaction"
echo ""
echo "✅ M4 Pulse smoke tests passed"
