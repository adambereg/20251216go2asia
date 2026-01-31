$ErrorActionPreference = "Stop"

$baseUrl = if ($env:STAGING_GATEWAY_URL) { $env:STAGING_GATEWAY_URL } else { "https://go2asia-api-gateway-staging.fred89059599296.workers.dev" }
$env:BASE_URL = $baseUrl

node "scripts/smoke-atlas-places.mjs"

