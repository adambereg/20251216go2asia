# Connect Demo Seed Runbook v1

## Purpose

This runbook describes how to seed demo data for the current backend-backed Connect UI without reintroducing frontend mocks or fallback data.

The seed targets existing backend-owned tables:

- `badges`
- `user_badges`
- `user_balances`
- `points_transactions`
- `referral_links`
- `referral_relations`

Connect remains a product/frontend layer over Points and Referral services. This seed does not create a Connect backend service.

## Files

- Seed data: `packages/db/src/connectDemoData.ts`
- Seed script: `packages/db/src/seedConnectDemo.ts`
- Verification script: `packages/db/src/verifyConnectDemo.ts`
- Package scripts: `packages/db/package.json`

## What Gets Seeded

For one existing demo user, the seed creates or updates:

- 10 active off-chain badge definitions
- 5 awarded user badges
- a referral code
- 4 to 5 referral relations, depending on provided referee users
- 8 base Points transactions
- referral bonus transactions for rewarded referrals
- the `user_balances` row recalculated from `points_transactions`

The seed does not add G2A, NFT, wallet, token conversion, levels progression, missions or analytics runtime truth.

## Preconditions

The target user must already exist in `users`.

The invited users must also already exist in `users`. The seed intentionally does not create arbitrary Clerk users or identity records.

Provide at least 4 referee users by ID or email.

## Environment Guard

The seed refuses to run when:

- `ENVIRONMENT=production`
- `NODE_ENV=production`
- the database URL looks production-like
- `CONNECT_DEMO_SEED_CONFIRM` is not set to `dev`, `local` or `staging` for `--apply`

The script reads the database URL from:

- `STAGING_DATABASE_URL`
- or `DATABASE_URL`

## Dry Run

Dry run does not connect to the database and does not write data.

Example:

    pnpm -C packages/db db:seed:connect-demo -- --user-email demo@example.com --referee-user-email friend1@example.com --referee-user-email friend2@example.com --referee-user-email friend3@example.com --referee-user-email friend4@example.com

## Apply

Example with emails:

    $env:STAGING_DATABASE_URL="postgresql://..."
    $env:CONNECT_DEMO_SEED_CONFIRM="staging"
    pnpm -C packages/db db:seed:connect-demo -- --apply --user-email demo@example.com --referee-user-email friend1@example.com --referee-user-email friend2@example.com --referee-user-email friend3@example.com --referee-user-email friend4@example.com

Example with user IDs:

    $env:STAGING_DATABASE_URL="postgresql://..."
    $env:CONNECT_DEMO_SEED_CONFIRM="staging"
    pnpm -C packages/db db:seed:connect-demo -- --apply --user-id user_demo --referee-user-id user_friend_1 --referee-user-id user_friend_2 --referee-user-id user_friend_3 --referee-user-id user_friend_4

Optional referral code override:

    --referral-code CADEMO2026

## Verification

DB-level verification:

    $env:STAGING_DATABASE_URL="postgresql://..."
    pnpm -C packages/db db:verify:connect-demo -- --user-email demo@example.com

The verification checks:

- demo user exists
- balance is greater than zero
- at least 8 demo Points transactions exist
- at least 8 demo badge catalog records are active
- at least 3 user badges exist
- referral code exists
- at least 3 referral relations exist
- at least 3 referral earnings items can be derived
- at least one rewarded referral exists
- at least one reward-missing referral exists
- at least one pending referral exists

API verification is not performed by this script because Connect endpoints require an authenticated gateway token whose subject matches the demo user. After seeding, verify UI manually by signing in as the seeded user or by using a staging token for that user.

## Idempotency

The seed is idempotent:

- badges upsert by `code`
- referral link upserts by `user_id`
- referral relations upsert by `referee_id`, after checking they are not owned by another referrer
- Points transactions upsert by `external_id`
- user badges upsert by `(user_id, badge_id)`
- balance is recalculated from all `points_transactions` for the user

Repeated runs should update the same demo rows rather than creating duplicates.

## Reset / Rerun

There is no destructive reset command in this pass.

To rerun, execute the same seed command again. To remove demo data, use a separate reviewed cleanup script or manual staging-only SQL with explicit approval.

## Notes

Referral earnings are not stored in a separate table. They are derived from:

- `referral_relations`
- matching `points_transactions` where `reason = 'referral_bonus_referrer'`
- external ID format `referral:first_login:<referrer_id>:<referee_id>`

The `activated` status is present in the OpenAPI enum, but current referral-service code derives `pending`, `rewarded` and `reward_missing`. The seed therefore creates the statuses that current backend logic can actually return.

