#!/bin/bash
# Smoke checks for Atlas Asia (production-ready gate)
#
# What it checks:
# - Key web pages return HTTP 200
# - Key Content API endpoints return expected JSON shapes
#
# Usage:
#   WEB_URL="https://<your-site>" GATEWAY_URL="https://<gateway>" ./scripts/smoke-atlas.sh
#
# Notes:
# - This is an HTTP smoke; it won't catch browser JS runtime errors.

set -euo pipefail

WEB_URL="${WEB_URL:-https://20251216go2asia.netlify.app}"
GATEWAY_URL="${GATEWAY_URL:-https://go2asia-api-gateway-staging.fred89059599296.workers.dev}"

echo "Atlas smoke"
echo "WEB_URL:     $WEB_URL"
echo "GATEWAY_URL: $GATEWAY_URL"
echo ""

require_http_200() {
  local url="$1"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$status" != "200" ]; then
    echo "FAIL: $url -> HTTP $status"
    exit 1
  fi
  echo "OK:   $url -> HTTP 200"
}

echo "1) API: GET /v1/content/countries"
countries_json=$(curl -s "$GATEWAY_URL/v1/content/countries")
python - <<'PY'
import json,sys
obj=json.loads(sys.stdin.read())
items=obj.get("items")
assert isinstance(items,list) and len(items)>=1, "countries.items must be non-empty list"
first=items[0]
for k in ["id","slug","name","code","citiesCount","placesCount"]:
  assert k in first, f"country missing field: {k}"
print("OK")
PY <<<"$countries_json" >/dev/null
echo "OK:  countries JSON shape"

echo "2) API: GET /v1/content/cities"
cities_json=$(curl -s "$GATEWAY_URL/v1/content/cities")
python - <<'PY'
import json,sys
obj=json.loads(sys.stdin.read())
items=obj.get("items")
assert isinstance(items,list) and len(items)>=1, "cities.items must be non-empty list"
first=items[0]
for k in ["id","slug","name","countryId","placesCount"]:
  assert k in first, f"city missing field: {k}"
print("OK")
PY <<<"$cities_json" >/dev/null
echo "OK:  cities JSON shape"

echo "3) API: GET /v1/content/places?limit=1"
places_json=$(curl -s "$GATEWAY_URL/v1/content/places?limit=1")
place_id=$(python - <<'PY'
import json,sys
obj=json.loads(sys.stdin.read())
items=obj.get("items") or []
assert len(items)>=1, "places.items must be non-empty"
first=items[0]
print(first.get("id") or first.get("slug") or "")
PY <<<"$places_json")
if [ -z "$place_id" ]; then
  echo "FAIL: cannot derive place_id from /v1/content/places"
  exit 1
fi
echo "OK:  derived place_id=$place_id"

echo "4) API: GET /v1/content/places/{idOrSlug}"
place_detail_json=$(curl -s "$GATEWAY_URL/v1/content/places/$place_id")
python - <<'PY'
import json,sys
obj=json.loads(sys.stdin.read())
for k in ["id","slug","name","type","photos"]:
  assert k in obj, f"place missing field: {k}"
assert isinstance(obj.get("photos"), list), "place.photos must be list"
print("OK")
PY <<<"$place_detail_json" >/dev/null
echo "OK:  place detail JSON shape"

country_id=$(python - <<'PY'
import json,sys
obj=json.loads(sys.stdin.read())
items=obj.get("items") or []
print((items[0].get("id") if items else "") or "")
PY <<<"$countries_json")
city_id=$(python - <<'PY'
import json,sys
obj=json.loads(sys.stdin.read())
items=obj.get("items") or []
print((items[0].get("id") if items else "") or "")
PY <<<"$cities_json")

if [ -z "$country_id" ] || [ -z "$city_id" ]; then
  echo "FAIL: cannot derive country_id or city_id from API lists"
  exit 1
fi

echo ""
echo "5) WEB pages (HTTP 200)"
require_http_200 "$WEB_URL/atlas"
require_http_200 "$WEB_URL/atlas/countries"
require_http_200 "$WEB_URL/atlas/countries/$country_id"
require_http_200 "$WEB_URL/atlas/countries/$country_id/cities"
require_http_200 "$WEB_URL/atlas/places"
require_http_200 "$WEB_URL/atlas/places/$place_id"
require_http_200 "$WEB_URL/atlas/cities"
require_http_200 "$WEB_URL/atlas/cities/$city_id"

echo ""
echo "PASS: Atlas smoke checks"


