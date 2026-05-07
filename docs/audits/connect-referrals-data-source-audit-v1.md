# Connect Referrals Data Source Audit v1

Status: read-only audit.  
Date: 2026-05-05.  
Scope: Connect referrals data sources for `irina.belova.seed@example.com`. No code or DB changes were made.

## 1. Executive Summary

The six referrals shown on `/connect/referrals` are backend-backed rows, not frontend mock data.

Most likely source:

- five referrals were created by the Connect demo seed path;
- one additional referral was created by the real referral-link validation flow for `irina.belova.seed@example.com`.

This matches the observed UI shape:

- `totalReferrals = 6`;
- `activatedReferrals = 3`;
- `pendingReferrals = 3`.

`packages/db/src/seedConnectDemo.ts` can create up to five referral relations for one target user. Its generated demo set is two rewarded/active referrals, one active referral without matching reward, and two pending referrals. The closure note `docs/modules/connect/connect_referrals_fix_closure_note_v1.md` then records a real referral-link scenario where a user signed up using Irina's referral link and appeared as a new referral for Irina. Together these explain `5 seeded/demo + 1 real = 6`.

There is also a staging-only dev endpoint in `apps/referral-service/src/index.ts` that can create three `devtest_*` referrals for a chosen referrer. Its shape does not directly match the observed six-referral state by itself, but it is a second possible non-human source that should be checked before cleanup.

Direct Neon MCP inspection was not available in this environment: the Neon MCP status resource reports a server error. Therefore this audit is based on repository code, runbooks, closure notes, and the provided UI screenshots, not a live SQL dump.

## 2. Referrals DB Model

Primary tables:

| Table | Defined in | Purpose | Key constraints |
| --- | --- | --- | --- |
| `referral_links` | `packages/db/src/schema/referral.ts` | One referral code per user. | `user_id` unique, `referral_code` unique. |
| `referral_relations` | `packages/db/src/schema/referral.ts` | Referral graph: one `referrer_id` -> `referee_id` relation. | `referee_id` unique, so a referee can have only one referrer. |
| `points_transactions` | `packages/db/src/schema/points.ts` / Points service | Applied or locked referral points. | Used by read models via `external_id`. |
| `user_balances` | `packages/db/src/schema/points.ts` | Points balance summary. | Recalculated by demo seed. |

Migration source:

- `packages/db/migrations/0000_dapper_hercules.sql` creates `referral_links` and `referral_relations`.
- The same migration also creates compatibility views `referral_codes` and `referrals`, but runtime code reads the base tables.

`referral_relations` does not have `source`, `metadata`, `is_demo`, or `created_by_seed` columns. Demo/test rows can only be identified indirectly by deterministic IDs, referee IDs, timestamps, matching seed transactions, or external audit context.

## 3. Referrals API / SDK

User-facing referral endpoints are implemented in `apps/referral-service/src/index.ts` and routed by `apps/api-gateway/src/index.ts`.

| Endpoint | Runtime behavior | Frontend usage |
| --- | --- | --- |
| `GET /v1/referral/code` | Ensures and returns current user's referral code from `referral_links`. | `useGetReferralCode` |
| `GET /v1/referral/stats` | Counts direct rows in `referral_relations` where `referrer_id = current user`. | `useGetReferralStats` |
| `GET /v1/referral/tree?depth=2` | Reads direct referrals and second-level referrals from `referral_relations`. | `useGetReferralTree` |
| `GET /v1/referral/earnings?limit=50` | Composes referral relation rows with matching `points_transactions`. | `useGetReferralEarnings` |
| `POST /v1/referral/claim` | Links current user as referee to a referrer resolved by referral code. | Auth referral capture / claim flow, not the referrals list display. |

SDK source:

- `packages/sdk/src/referrals.ts`.

OpenAPI source:

- `docs/openapi/referral.yaml`.

Connect dashboard also includes a referral summary through Points:

- `packages/sdk/src/connectDashboard.ts` calls `/v1/points/connect-dashboard`;
- `apps/points-service/src/index.ts` reads `referral_relations` for dashboard referral counts.

## 4. Frontend Data Flow

The `/connect/referrals` route is:

- `apps/go2asia-pwa-shell/app/(authenticated)/connect/referrals/page.tsx`;
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/referrals/ReferralsPageClientWrapper.tsx`;
- `apps/go2asia-pwa-shell/components/connect/Referrals/ReferralsView.tsx`;
- `apps/go2asia-pwa-shell/components/connect/Referrals/ReferralsContent.tsx`.

`ReferralsView` calls four live SDK hooks:

- `useGetReferralCode`;
- `useGetReferralStats`;
- `useGetReferralTree({ depth: 2 })`;
- `useGetReferralEarnings({ limit: 50 })`.

The UI list is built by merging:

- direct tree nodes from `referralTreeData.referrals`;
- earning items from `referralEarningsData.items`.

Rows are keyed by `refereeUserId`, so the same referral does not appear twice if it exists in both tree and earnings payloads.

The current aligned frontend does not use `ReferralsMockView` for `/connect/referrals`. There is no UI filter for demo/test referrals because the API does not expose a demo flag.

## 5. Seed / Demo / Migration Sources

### Connect Demo Seed

Primary source:

- `packages/db/src/seedConnectDemo.ts`
- script: `pnpm -C packages/db db:seed:connect-demo`
- runbook: `docs/runbooks/connect_demo_seed_runbook_v1.md`

Behavior:

- requires an explicit target user by `--user-id` or `--user-email`;
- requires at least four referee users;
- resolves referee IDs/emails from CLI args and `CONNECT_DEMO_REFEREE_USER_IDS` / `CONNECT_DEMO_REFEREE_USER_EMAILS`;
- returns `resolved.slice(0, 5)`, so it can seed five referrals;
- writes `referral_links` for the target user;
- writes `referral_relations` with IDs shaped as `connect_demo_referral_<targetUserId>_<refereeUserId>`;
- writes demo `points_transactions`;
- writes demo badges and user badges;
- recalculates `user_balances`.

Seeded referral shape:

- two `rewarded` referrals;
- one `reward_missing` referral;
- two `pending` referrals.

That means five seeded rows can look like three activated referrals and two pending referrals in the UI.

### Real Referral Flow

`docs/modules/connect/connect_referrals_fix_closure_note_v1.md` records:

- a real referral-link scenario was checked;
- a user signed up using the referral link from `irina.belova.seed@example.com`;
- the new user appeared as a referral for Irina.

That row is likely the manual/real referral the user remembers.

### Dev Test Endpoint

`apps/referral-service/src/index.ts` contains a staging/dev-only endpoint:

- `POST /_dev/seed-referrals`

Behavior:

- accepts `referrerUserId`;
- creates deterministic referee IDs:
  - `devtest_<safeReferrerId>_l1_1`;
  - `devtest_<safeReferrerId>_l1_2`;
  - `devtest_<safeReferrerId>_l1_3`;
- creates one pending and two active referral relations;
- comments explicitly say these rows can be removed with `referee_id LIKE 'devtest_%' AND referrer_id = '<your referrerUserId>'`.

This endpoint could create unexpected referrals, but by itself it creates three, not five. It should still be included in cleanup checks.

### Migrations and Fixtures

No migration was found that inserts concrete referral rows. Migrations define tables/views only.

Tests under `apps/referral-service/test/*` and `apps/points-service/test/*` mock SQL shape and do not write staging data.

## 6. Findings for `irina.belova.seed@example.com`

Evidence available from repository and docs:

- Irina is a known seed user in Space/RF demo context.
- `docs/runbooks/connect_demo_dataset_v1.md` and `apps/api-gateway/scripts/apply-connect-voucher-demo-with-clerk.mjs` use Irina as a Connect/RF voucher recipient.
- The referrals closure note explicitly names Irina as the referrer in a real referral-link validation.
- The current `/connect/referrals` UI screenshot shows six referrals.
- The Connect demo seed can create five referrals for a target user.
- The real validation adds one referral.

Most likely explanation:

| Source | Expected rows | Expected state |
| --- | ---: | --- |
| `seedConnectDemo.ts` for Irina or the current demo user context | 5 | 3 activated-like, 2 pending |
| Real referral-link test from Irina's referral link | 1 | likely pending unless first login was marked |
| Total observed | 6 | 3 activated, 3 pending |

This explains why the UI shows six while only one was manually added by the user.

The repo does not contain a checked-in command invocation that explicitly runs `seedConnectDemo.ts --user-email irina.belova.seed@example.com`. The exact live DB row IDs should be confirmed with a read-only SQL query before deletion. The expected demo IDs are either:

- `connect_demo_referral_<irinaUserId>_<refereeUserId>` for Connect demo seed rows;
- `devtest_<safeIrinaUserId>_l1_<n>` for dev endpoint rows.

## 7. Safe Cleanup Options

Do not delete blindly from production-like data.

Recommended read-only confirmation first:

```sql
SELECT id, referrer_id, referee_id, registered_at, first_login_at
FROM referral_relations
WHERE referrer_id = '<irinaUserId>'
ORDER BY registered_at DESC, referee_id DESC;
```

To classify likely demo rows:

```sql
SELECT rr.id, rr.referrer_id, rr.referee_id, rr.registered_at, rr.first_login_at,
       pt.id AS points_transaction_id,
       pt.reason,
       pt.external_id,
       pt.metadata
FROM referral_relations rr
LEFT JOIN points_transactions pt
  ON pt.user_id = rr.referrer_id
 AND pt.external_id IN (
   'referral:first_login:' || rr.referrer_id || ':' || rr.referee_id,
   'referral:locked:' || rr.referrer_id || ':' || rr.referee_id
 )
WHERE rr.referrer_id = '<irinaUserId>'
ORDER BY rr.registered_at DESC, rr.referee_id DESC;
```

Likely safe staging cleanup candidates:

- rows where `referral_relations.id LIKE 'connect_demo_referral_%'`;
- rows where `referee_id LIKE 'devtest_%'`;
- matching demo `points_transactions` with `metadata.demo = true` or `external_id`/`source_event_id` matching the demo seed;
- demo badges/user_badges if the goal is to remove the full Connect demo dataset, not just referrals.

Because `referral_relations` has no demo flag, cleanup should be a reviewed SQL operation scoped to one staging user and backed by a DB snapshot/backup.

## 8. Risks

- Demo referral rows are structurally indistinguishable from real rows unless their IDs or linked transactions expose demo provenance.
- The UI currently cannot hide demo rows because endpoints do not expose `isDemo` / `source`.
- `seedConnectDemo.ts` writes directly to runtime truth tables, which is useful for staging demos but risky if copied into production workflows.
- The dev endpoint `/_dev/seed-referrals` is reachable on staging-host style URLs even without `isDevTestEnabled(env)` if the host includes `-staging.`.
- Referral earnings/read-model logic has evolved: some docs and scripts mention `referral_bonus_referrer`, while newer service logic also uses locked referral IDs. Cleanup should inspect both historical and current external ID formats.
- Removing relations without removing matching points transactions can leave stale referral earnings or dashboard totals.
- Removing points transactions without recalculating `user_balances` can leave stale balance values.

## 9. Recommendation

Yes, the six referrals can be explained without assuming a user action for all six.

Recommended next step:

1. Run a read-only SQL inspection for Irina's `users.id`, `referral_links`, `referral_relations`, and matching `points_transactions`.
2. Confirm whether five rows have `connect_demo_referral_*` IDs or the seed dates from `seedConnectDemo.ts`.
3. Confirm which one row is the real manual referral-link test.
4. If this is staging/demo data, remove only the confirmed demo rows with a reviewed cleanup SQL and recalculate or verify `user_balances`.
5. Add a future schema/backlog item: mark seeded referral rows with explicit provenance (`source`, `is_demo`, `metadata`) or ensure demo data never writes to shared staging users.
6. Consider UI/API filtering only after backend exposes provenance; frontend-only filtering by ID prefix would be brittle.

Final answer: the likely source of the unexpected five extra referrals is `packages/db/src/seedConnectDemo.ts`, while the sixth is the real referral-link test documented for `irina.belova.seed@example.com`.
