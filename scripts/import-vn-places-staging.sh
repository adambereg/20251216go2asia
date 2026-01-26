#!/bin/bash
# Import Vietnam Places to Neon staging.
#
# Safety:
# - Forces ENVIRONMENT=staging.
# - Requires STAGING_DATABASE_URL or DATABASE_URL to be set.
# - Executes SQL files in order: cleanup -> ensure -> places.
#
# Usage:
#   export STAGING_DATABASE_URL="postgresql://..."
#   bash scripts/import-vn-places-staging.sh

set -euo pipefail

export ENVIRONMENT="staging"

DB_URL="${STAGING_DATABASE_URL:-${DATABASE_URL:-}}"
if [ -z "$DB_URL" ]; then
  echo "Error: Missing STAGING_DATABASE_URL or DATABASE_URL" >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXPORT_DIR="$REPO_ROOT/exports/neon/vietnam"

if [ ! -d "$EXPORT_DIR" ]; then
  echo "Error: Export directory not found: $EXPORT_DIR" >&2
  echo "Run: pnpm -C packages/db tsx src/exportPlacesToNeon.ts" >&2
  exit 1
fi

if ! command -v psql &> /dev/null; then
  echo ""
  echo "⚠️  psql not found in PATH. Please use Neon Console SQL Editor instead:" >&2
  echo ""
  echo "1. Open Neon Console: https://console.neon.tech"
  echo "2. Select branch: staging-m4-content-seed"
  echo "3. Go to SQL Editor"
  echo "4. Execute files in this order:"
  echo "   a) $EXPORT_DIR/cleanup_vn_places.sql"
  echo "   b) $EXPORT_DIR/ensure_vn_country.sql"
  echo "   c) $EXPORT_DIR/ensure_vn_cities.sql"
  echo "   d) $EXPORT_DIR/places.sql"
  echo "5. Verify with: $EXPORT_DIR/smoke_vn.sql"
  echo ""
  exit 1
fi

echo ""
echo "Step 1/4: Cleanup existing VN places..."
if [ -f "$EXPORT_DIR/cleanup_vn_places.sql" ]; then
  psql "$DB_URL" -f "$EXPORT_DIR/cleanup_vn_places.sql"
  echo "✓ Cleanup completed"
else
  echo "⚠️  Cleanup file not found: $EXPORT_DIR/cleanup_vn_places.sql"
fi

echo ""
echo "Step 2/4: Ensure Vietnam country exists..."
if [ -f "$EXPORT_DIR/ensure_vn_country.sql" ]; then
  psql "$DB_URL" -f "$EXPORT_DIR/ensure_vn_country.sql"
  echo "✓ Country ensured"
else
  echo "Error: Country file not found: $EXPORT_DIR/ensure_vn_country.sql" >&2
  exit 1
fi

echo ""
echo "Step 3/4: Ensure Vietnam cities exist..."
if [ -f "$EXPORT_DIR/ensure_vn_cities.sql" ]; then
  psql "$DB_URL" -f "$EXPORT_DIR/ensure_vn_cities.sql"
  echo "✓ Cities ensured"
else
  echo "Error: Cities file not found: $EXPORT_DIR/ensure_vn_cities.sql" >&2
  exit 1
fi

echo ""
echo "Step 4/4: Import places + content_blocks..."
if [ -f "$EXPORT_DIR/places.sql" ]; then
  psql "$DB_URL" -f "$EXPORT_DIR/places.sql"
  echo "✓ Places imported"
else
  echo "Error: Places file not found: $EXPORT_DIR/places.sql" >&2
  exit 1
fi

echo ""
echo "✅ Import completed successfully!"
echo ""
echo "Run smoke check:"
echo "  psql \"$DB_URL\" -f \"$EXPORT_DIR/smoke_vn.sql\""
echo ""
