# RF Paid Voucher Spend Enforcement Staging Alignment v1

## Scope

This slice aligns staging runtime configuration so paid RF voucher claims exercise the existing RF -> Points spend bridge.

Included:

- staging deploy config audit for RF Service and Points Service;
- repo-backed non-secret staging vars for RF paid spend and Points spendability export;
- bounded regression tests for staging config;
- one RF runtime test for the misconfigured spend bridge path;
- staging validation plan.

Not included:

- production rollout or production env changes;
- Points `/internal/points/spend` contract changes;
- Points ledger semantics changes;
- RF claim/redeem lifecycle rewrite;
- available-only enforcement;
- economy redesign;
- migrations;
- new staging seed offers.

## Observed Issue

Staging paid offers were visible in RF UI with:

- `Будет списано: N Points`;
- `Получить за N Points`.

However, a user with 0 Points could claim paid offers. Points Service logs did not show:

- `POST /internal/points/spend`;
- `Points spendability durable export`.

Cloudflare Dashboard also warned that Worker settings should be moved into Wrangler config. Manually edited Dashboard vars disappeared after deploy/redeploy.

## Root Cause

The RF runtime already has a spend-first blocking path when paid spend coupling is enabled:

- `points_cost > 0`;
- `RF_ENABLE_PAID_VOUCHER_SPEND=true`;
- `POINTS_SERVICE_URL` configured;
- `SERVICE_JWT_SECRET` configured;
- current VIP gate allows `vip_spacer`.

When that path is enabled, RF calls `/internal/points/spend` before final voucher insert and returns a safe error without inserting a voucher on insufficient balance or temporary spend failure.

The staging drift was config-level:

- `apps/rf-service/wrangler.toml` did not pin `RF_ENABLE_PAID_VOUCHER_SPEND` or `POINTS_SERVICE_URL` for `env.staging`;
- `apps/points-service/wrangler.toml` did not pin the spendability shadow/diagnostics/durable export flags for `env.staging`;
- `.github/workflows/deploy-workers-staging.yml` deployed both services without those extra vars;
- Dashboard-only edits were therefore not durable across deploys.

With RF paid spend coupling absent, positive-cost vouchers use the documented pre-coupling behavior: voucher is created with economy state `pending`, no Points spend call is made, and no durable export signal can exist.

## Config Changes

RF Service staging now pins:

- `ENVIRONMENT=staging`;
- `RF_ENABLE_PAID_VOUCHER_SPEND=true`;
- `POINTS_SERVICE_URL=https://go2asia-points-service-staging.fred89059599296.workers.dev`.

Points Service staging now pins:

- `ENVIRONMENT=staging`;
- `POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE=true`;
- `POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS=true`;
- `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT=true`.

The staging GitHub Actions deploy matrix also passes those non-secret vars for the relevant services.

Secrets remain out of repo:

- `SERVICE_JWT_SECRET`;
- `DATABASE_URL`;
- Cloudflare credentials;
- JWTs/tokens.

## Runtime Invariant

For `points_cost > 0` with RF paid spend enabled:

- RF attempts Points spend before final voucher creation;
- insufficient Points returns a safe RF conflict and does not insert a voucher;
- unavailable or misconfigured Points runtime returns a safe RF unavailable error and does not insert a voucher;
- spend success followed by voucher insert failure continues through the existing compensation/recovery path.

For free offers or `points_cost = 0`:

- free claim behavior is unchanged;
- no Points spend call is made.

For paid offers with RF paid spend flag disabled:

- pre-coupling behavior remains unchanged;
- voucher can be created with economy state `pending`;
- no Points spend call is made.

This slice intentionally does not implement available-only enforcement.

## Tests

Added:

- `apps/rf-service/test/staging-config.test.ts`;
- `apps/points-service/test/staging-config.test.ts`;
- RF request test for `RF_ENABLE_PAID_VOUCHER_SPEND=true` with missing `POINTS_SERVICE_URL`.

Existing RF request tests already cover:

- paid spend success before voucher creation;
- insufficient Points blocking voucher creation;
- temporary Points Service failure blocking voucher creation;
- spend idempotency conflict blocking voucher creation;
- flag-off paid behavior;
- free voucher behavior;
- compensation/recovery after spend success and voucher insert failure.

## Staging Validation Plan

After deploy to staging:

1. Confirm Worker config:
   - `go2asia-rf-service-staging` has `RF_ENABLE_PAID_VOUCHER_SPEND=true`;
   - `go2asia-rf-service-staging` has `POINTS_SERVICE_URL` pointing to Points staging;
   - `go2asia-points-service-staging` has all three spendability flags enabled;
   - `SERVICE_JWT_SECRET` remains a secret and is not printed.
2. Use exactly one VIP seed user with enough Points for `100 Points staging service perk`.
3. Claim exactly one paid RF offer.
4. Verify RF response:
   - paid voucher is created only after successful spend;
   - `economyStatus=debited`;
   - `pointsCostSnapshot=100`;
   - `pointsDebitExternalId` is present.
5. Verify Points logs:
   - `/internal/points/spend` was called;
   - `Points spendability durable export` was emitted;
   - payload includes expected `schemaVersion`, `diagnosticsVersion`, `driftClass`;
   - payload excludes user identifiers, secrets, JWTs, DB URLs and raw PII.
6. If safely testable, use a 0-Points VIP seed user and claim one paid offer:
   - expected RF error `RF_INSUFFICIENT_POINTS_BALANCE`;
   - no new active voucher for that claim.

Do not mass claim.

## Known Limits

- This slice does not deploy to Cloudflare by itself.
- Dashboard still needs manual verification after CI deploy.
- The seeded paid offers are not changed by this slice.
- If RF staging lacks `SERVICE_JWT_SECRET`, the spend bridge remains blocked with a safe unavailable error.
- If Points staging lacks DB connectivity, RF should block paid claim rather than create an active voucher.

## Next Recommended Step

Deploy staging Workers from this branch, then run the single paid-claim validation above and update the staging export evidence document with safe aggregate findings only.

