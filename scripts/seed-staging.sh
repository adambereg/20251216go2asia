#!/usr/bin/env bash
set -euo pipefail

# Seed staging DB (DDL + content seed).
#
# Safety:
# - Forces ENVIRONMENT=staging
# - Refuses to run if ENVIRONMENT=production
# - Requires STAGING_DATABASE_URL or DATABASE_URL to be set
# - Does NOT print the full DB URL
#
# Usage:
#   export STAGING_DATABASE_URL="postgresql://..."
#   ./scripts/seed-staging.sh
#
#   # Optional reset of content tables (NOT points/referral/auth)
#   export STAGING_DATABASE_URL="postgresql://..."
#   ./scripts/seed-staging.sh --reset
#
#   # Seed without DDL apply
#   ./scripts/seed-staging.sh --skip-ddl

RESET="0"
SKIP_DDL="0"

for arg in "$@"; do
  case "$arg" in
    --reset) RESET="1" ;;
    --skip-ddl) SKIP_DDL="1" ;;
    *)
      echo "Unknown arg: $arg" >&2
      exit 2
      ;;
  esac
done

ENVIRONMENT_LOWER="$(printf "%s" "${ENVIRONMENT:-dev}" | tr '[:upper:]' '[:lower:]')"
if [ "$ENVIRONMENT_LOWER" = "production" ]; then
  echo "Refusing to run seed with ENVIRONMENT=production" >&2
  exit 1
fi

export ENVIRONMENT="staging"

DB_URL="${STAGING_DATABASE_URL:-${DATABASE_URL:-}}"
if [ -z "$DB_URL" ]; then
  echo "Missing STAGING_DATABASE_URL or DATABASE_URL" >&2
  exit 1
fi

echo "Seeding staging DB (env=staging)..."

if [ "$SKIP_DDL" != "1" ]; then
  echo "Applying DDL migrations..."
  pnpm -C packages/db db:ddl:apply:staging
fi

if [ "$RESET" = "1" ]; then
  echo "SEED_RESET=1 (content tables only)"
  export SEED_RESET="1"
else
  unset SEED_RESET || true
fi

echo "Running content seed..."
pnpm -C packages/db db:seed

echo "Done."




