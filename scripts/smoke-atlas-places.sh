#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${STAGING_GATEWAY_URL:-https://go2asia-api-gateway-staging.fred89059599296.workers.dev}"
export BASE_URL

node scripts/smoke-atlas-places.mjs
