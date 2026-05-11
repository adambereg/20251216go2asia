# RF Paid Voucher Staging Seed Offers v1

## Scope

This slice prepares safe staging-only paid RF offers so Points Spendability Export can be validated with a real RF `/internal/points/spend` signal.

Included:

- read-only audit of RF offer storage and paid claim prerequisites;
- idempotent staging-only seed script for 3 paid public RF offers;
- dry-run, apply and verify modes;
- validation checklist for DB/API/UI/claim/export.

Not included:

- production seed or rollout;
- RF economy semantics changes;
- Points ledger or `/internal/points/spend` contract changes;
- RF claim/redeem lifecycle changes;
- available-only enforcement;
- entitlement enforcement rollout;
- UI redesign;
- migrations.

## Runtime And Data Model Audit

RF offers are stored in `rf_offer`.

Required offer fields:

- `id`;
- `partner_id`;
- `title`;
- `offer_type`;
- `visibility`;
- `status`;
- `repeat_policy`;
- `points_cost`;
- `created_by_user_id`.

Important constraints:

- `rf_offer.partner_id` references `rf_partner.id`;
- `rf_offer.item_id` optionally references `rf_partner_item.id`;
- `rf_offer.title` must not be blank;
- `rf_offer.created_by_user_id` must not be blank;
- `rf_offer.points_cost >= 0`.

Related entities:

- `rf_partner` is required for every offer;
- `rf_partner.status = active` is required for claim;
- `rf_partner_item` is optional, but this seed creates one active item for clarity;
- `rf_partner_item.status = active` is verified for the seeded item.

Public RF UI visibility currently depends on:

- `rf_offer.status = active`;
- `rf_offer.visibility = public`.

Claim-level readiness additionally depends on:

- active partner;
- `points_cost > 0`;
- `RF_ENABLE_PAID_VOUCHER_SPEND=true`;
- `POINTS_SERVICE_URL` configured;
- `SERVICE_JWT_SECRET` configured;
- authenticated VIP seed user with role `vip_spacer`;
- fresh idempotency key and no existing active voucher barrier for the same offer/user.

## Seed Approach Chosen

Chosen approach: Option 2, new staging seed script.

File:

- `packages/db/src/seedRfPaidStagingOffers.ts`

Package command:

- `pnpm -C packages/db db:seed:rf-paid-staging-offers`

Why this approach:

- the existing RF API demo seed can create free demo offers but does not expose a paid `points_cost` path;
- no safe automated staging DB credentials were available in Cursor;
- a migration would be the wrong vehicle because this is fixture data, not schema;
- direct ad hoc SQL would be riskier than a guarded, reviewable, idempotent script.

## Seeded Offers

The script prepares 3 deterministic paid offers:

- `rf_offer_staging_paid_100_points`: `100 Points staging service perk`, `points_cost = 100`;
- `rf_offer_staging_paid_250_points`: `250 Points staging premium discount`, `points_cost = 250`;
- `rf_offer_staging_paid_500_points`: `500 Points staging partner access`, `points_cost = 500`.

All seeded offers are:

- `status = active`;
- `visibility = public`;
- `repeat_policy = repeat_after_redeem`;
- linked to an active partner;
- linked to active item `rf_partner_item_staging_paid_voucher_demo`.

Partner strategy:

- reuse active `Connect Voucher Demo Partner` if present;
- otherwise upsert fallback partner `Staging Paid Voucher Demo Partner`.

## Safety Guards

The script defaults to dry-run and performs no writes unless `--apply` is passed.

Apply and verify require:

```powershell
$env:ENVIRONMENT="staging"
$env:RF_PAID_STAGING_SEED_CONFIRM="staging"
$env:STAGING_DATABASE_URL="postgresql://..."
pnpm -C packages/db db:seed:rf-paid-staging-offers -- --apply
```

The script refuses:

- any non-`staging` `ENVIRONMENT`;
- `NODE_ENV=production`;
- missing `RF_PAID_STAGING_SEED_CONFIRM=staging`;
- missing `STAGING_DATABASE_URL`;
- database URLs containing production-like hints.

The script does not print the full DB URL.

## Idempotency

The seed is idempotent by deterministic IDs:

- fallback partner: `rf_partner_staging_paid_voucher_demo`;
- item: `rf_partner_item_staging_paid_voucher_demo`;
- offers: deterministic `rf_offer_staging_paid_*` IDs.

Repeated runs:

- reuse active `Connect Voucher Demo Partner` if it exists;
- upsert the fallback partner only by its deterministic ID;
- upsert the item by deterministic ID;
- upsert only the 3 deterministic seed offers;
- do not delete data;
- do not mutate unrelated offers.

## Validation Checklist

Dry-run:

```powershell
pnpm -C packages/db db:seed:rf-paid-staging-offers
```

Apply:

```powershell
$env:ENVIRONMENT="staging"
$env:RF_PAID_STAGING_SEED_CONFIRM="staging"
$env:STAGING_DATABASE_URL="postgresql://..."
pnpm -C packages/db db:seed:rf-paid-staging-offers -- --apply
```

DB verification:

```powershell
$env:ENVIRONMENT="staging"
$env:RF_PAID_STAGING_SEED_CONFIRM="staging"
$env:STAGING_DATABASE_URL="postgresql://..."
pnpm -C packages/db db:seed:rf-paid-staging-offers -- --verify-only
```

Manual DB query:

```sql
SELECT
  o.id AS offer_id,
  p.display_name AS partner,
  o.title,
  o.points_cost,
  o.status,
  o.visibility,
  o.repeat_policy,
  p.status AS partner_status,
  i.status AS item_status
FROM rf_offer o
JOIN rf_partner p ON p.id = o.partner_id
LEFT JOIN rf_partner_item i ON i.id = o.item_id
WHERE o.id IN (
  'rf_offer_staging_paid_100_points',
  'rf_offer_staging_paid_250_points',
  'rf_offer_staging_paid_500_points'
)
ORDER BY o.points_cost ASC;
```

Expected:

- 3 rows;
- `points_cost` values `100`, `250`, `500`;
- offer `status = active`;
- offer `visibility = public`;
- partner `status = active`;
- item `status = active`.

API verification:

```bash
curl -fsSL "https://staging.api.go2asia.space/v1/rf/offers" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d); console.log(j.items?.filter(o=>o.pointsCost>0).map(o=>({id:o.id,title:o.title,pointsCost:o.pointsCost})));})"
```

Expected:

- at least one seeded offer appears;
- DTO contains `pointsCost > 0`.

UI verification:

- open `/rf/vouchers`;
- find seeded paid offers;
- expected label: `Будет списано: N Points`;
- expected CTA: `Получить за N Points`.

## One Paid Claim For Spendability Export

After DB/API/UI verification, one paid claim can be performed if all claim prerequisites are confirmed:

- use only a VIP staging seed user with `vip_spacer`;
- use one seeded offer only;
- use a fresh `Idempotency-Key`;
- confirm RF staging has `RF_ENABLE_PAID_VOUCHER_SPEND=true`;
- confirm RF staging has `POINTS_SERVICE_URL` and `SERVICE_JWT_SECRET`;
- confirm the VIP seed user has enough Points balance for the selected cost.

Expected claim result:

- RF creates/returns a voucher with positive `pointsCostSnapshot`;
- RF calls Points Service `/internal/points/spend`;
- voucher economy status should become `debited` if spend succeeds;
- Points Service can emit `Points spendability durable export` if export flags remain enabled.

Cloudflare log checks for Points Service should verify:

- `schemaVersion`;
- `diagnosticsVersion`;
- `driftClass`;
- no forbidden user payload fields;
- no raw PII or secrets.

## Rollback / Removal

No automated deletion script is included.

Rollback should be a separate reviewed staging-only operation, preferably:

- archive the 3 deterministic seed offers by ID;
- optionally archive fallback seed item/partner only if they are not reused by other staging tests;
- do not delete vouchers or ledger rows after a paid claim without a separate data-retention decision.

Example staging-only rollback shape:

```sql
UPDATE rf_offer
SET status = 'archived', updated_at = now()
WHERE id IN (
  'rf_offer_staging_paid_100_points',
  'rf_offer_staging_paid_250_points',
  'rf_offer_staging_paid_500_points'
);
```

## Known Limits

- This slice prepares the seed path but did not mutate staging DB from Cursor because no `STAGING_DATABASE_URL` was present.
- The script does not create or modify users, VIP roles, Points balances, or service flags.
- The script does not perform claim-level validation automatically.
- If staging API is unavailable, API/UI validation remains blocked even if DB seed succeeds.

