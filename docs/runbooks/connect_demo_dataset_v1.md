# Connect Demo Dataset v1

## Purpose

Prepare a minimal RF-based demo dataset for checking Connect voucher summary surfaces and RF voucher read endpoints.

This dataset exists for dev/staging demo verification only. It is not a production seed, not a mass content pack, and not a substitute for RF lifecycle rules.

## Scope

Minimum target dataset:

- 1 demo user / test principal;
- 1 RF partner owned by a demo owner principal;
- 2 to 3 public RF offers;
- 2 to 3 user vouchers;
- at least 1 `claimed` voucher;
- at least 1 `redeemed` voucher.

Cancelled vouchers are not created by this runbook because there is no locked safe cancellation endpoint in the current RF runtime.

## Files

- Script: `apps/rf-service/scripts/seed-connect-voucher-demo.mjs`
- RF OpenAPI contract: `docs/openapi/rf.yaml`
- Connect voucher contract: `docs/architecture/connect/connect_voucher_visibility_contract_v1.md`

## Endpoints Used

Read/create partner and offer surfaces:

- `GET /v1/rf/partners`
- `POST /v1/rf/business/partners`
- `GET /v1/rf/offers`
- `POST /v1/rf/business/partners/{partnerId}/offers`
- `POST /v1/rf/business/partners/{partnerId}/offers/{offerId}/activate`

Voucher lifecycle surfaces:

- `POST /v1/rf/offers/{offerId}/claim`
- `POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem`

Verification surfaces:

- `GET /v1/rf/me/vouchers/summary`
- `GET /v1/rf/me/vouchers`

## Required Environment

The script stores no secrets and does not mint tokens. Provide tokens explicitly for the target environment.

For existing Clerk seed users, prefer the dev-only wrapper:

```powershell
node apps/api-gateway/scripts/apply-connect-voucher-demo-with-clerk.mjs --apply
```

The wrapper:

- loads `.env.local` / `.env` without printing secret values;
- resolves `oleg.tran.seed@example.com` as the RF owner (`pro`);
- resolves `irina.belova.seed@example.com` as the voucher recipient (`spacer`);
- mints short-lived Clerk JWTs in memory using the existing `mintClerkJwtForUser` helper;
- runs `apps/rf-service/scripts/seed-connect-voucher-demo.mjs --apply` with `RF_DEMO_AUTH_HEADER=Authorization`;
- does not write tokens to disk.

Required for apply:

```powershell
$env:RF_CONNECT_DEMO_CONFIRM="staging"
$env:RF_DEMO_API_BASE="https://<gateway-or-rf-service-host>"
$env:RF_DEMO_AUTH_HEADER="X-Gateway-Auth"
$env:RF_DEMO_OWNER_AUTH="<owner gateway auth token>"
$env:RF_DEMO_USER_AUTH="<demo user gateway auth token>"
$env:RF_DEMO_COUNTRY_ID="<valid country id>"
$env:RF_DEMO_CITY_ID="<valid city id>"
```

Optional overrides:

```powershell
$env:RF_DEMO_PARTNER_NAME="Connect Voucher Demo Partner"
$env:RF_DEMO_OFFER_TITLES="Connect Voucher Demo Active Perk,Connect Voucher Demo Redeemed Perk,Connect Voucher Demo Spare Perk"
```

If the target gateway expects a different auth header, set `RF_DEMO_AUTH_HEADER` accordingly. For example, use `Authorization` only when the provided token value already includes the required scheme, such as `Bearer ...`.

## Dry Run

Dry run does not call the API and does not mutate data:

```powershell
node apps/rf-service/scripts/seed-connect-voucher-demo.mjs
```

## Apply

The apply flow is API-based and uses RF-owned endpoints only:

```powershell
node apps/rf-service/scripts/seed-connect-voucher-demo.mjs --apply
```

Or, for existing Clerk seed users:

```powershell
node apps/api-gateway/scripts/apply-connect-voucher-demo-with-clerk.mjs --apply
```

Execution order:

1. Find or create demo RF partner by display name.
2. Find or create public RF offers.
3. Claim each offer as the demo user.
4. Redeem one voucher as the partner owner.
5. Verify voucher summary and voucher list for the demo user.

## Verification Only

After a successful run, verification can be repeated without creating or redeeming vouchers:

```powershell
node apps/rf-service/scripts/seed-connect-voucher-demo.mjs --verify-only
```

Expected summary shape:

```json
{
  "totalVouchers": 3,
  "activeVouchers": 2,
  "usedVouchers": 1,
  "cancelledVouchers": 0
}
```

The exact `totalVouchers` may be higher if the same demo user already has other RF vouchers. Minimum verification expectations are:

- `totalVouchers >= 2`
- `activeVouchers >= 1`
- `usedVouchers >= 1`

## Idempotency

The script is idempotent as far as current RF APIs allow:

- partner is reused by `displayName` from `GET /v1/rf/partners`;
- active public offers are reused by `partnerId + title` from `GET /v1/rf/offers`;
- voucher claim uses deterministic `Idempotency-Key` per offer;
- repeated redeem calls are safe because RF redeem is terminal and returns `applied=false` for already redeemed vouchers.

If a prior run created a draft offer but failed before activation, current public read APIs cannot discover that draft. In that case, rerun may create a new draft/active offer. This is acceptable for dev/demo use and should not be treated as production seed behavior.

## Cleanup

There is no destructive cleanup command in this runbook.

Use one of these options:

- rerun the same script and reuse the existing demo partner/offers/vouchers;
- perform manual staging-only cleanup with explicit review;
- add a separate reviewed cleanup script if this dataset becomes a recurring staging operation.

## Guardrails

- Demo dataset is not production content.
- No direct DB writes are used.
- No Points ledger writes are used.
- No local/mock voucher status truth is introduced.
- No voucher status is inferred outside RF.
- No DB schema changes are required.
- No UI changes are required.
- No Points, Notifications, Missions, token or NFT logic is touched.
