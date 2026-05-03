# RF Asia Stage 1+2 Migration Execution Plan v1

Статус: execution-level migration plan, markdown-only.  
Ограничения: не менять runtime-код, schema/db files, OpenAPI, SDK, frontend; не создавать real migration files; не выполнять SQL.

## Executive summary

Этот документ превращает contract draft RF Asia Stage 1+2 в безопасную последовательность будущих миграций.

Принятые решения:
- legacy `rf_voucher.status` остаётся на transition window;
- canonical lifecycle добавляется отдельным слоем через `canonical_status`;
- legacy mapping: `claimed -> available`;
- `VoucherRedemption` вводится как отдельная Stage 2 сущность;
- full `rf_voucher_event` откладывается;
- repeatability не реализуется в этом slice;
- `redeemed` остаётся в canonical partial unique indexes как one-time default.

Главная стратегия:
- Migration A/B/C — additive и могут быть подготовлены до runtime-switch;
- Migration D — runtime switch и compatibility checks;
- Migration E — cleanup later, не Stage 1+2.

## Current migration baseline

## 1) Migration files

Текущие RF migration anchors:

- `packages/db/migrations/0020_rf_core_v1.sql`
- `packages/db/migrations/0045_rf_rielt_listing_offer_mapping_v1.sql`
- `packages/db/migrations/0046_rf_voucher_listing_claim_scope_v1.sql`
- `packages/db/migrations/0047_rf_voucher_scope_aware_unique_indexes_v1.sql`
- `packages/db/src/schema/rf.ts`

## 2) Current enum types

From RF baseline:
- `rf_partner_status`: `active`, `archived`
- `rf_offer_status`: `draft`, `active`, `archived`
- `rf_offer_type`: `discount`, `bundle`, `gift`, `access`, `campaign`, `event_related`
- `rf_offer_visibility`: `public`, `pro_only`, `invite_only`
- `rf_voucher_status`: `claimed`, `redeemed`, `cancelled`
- `rf_pro_link_status`: `pending`, `active`, `ended`
- `rf_pro_link_role_scope`: `onboarding`, `curation`, `promotion`, `moderation_support`, `account_support`
- `rf_idempotency_operation`: `voucher_claim`
- `rf_rielt_listing_offer_status`: `active`, `hidden`
- `rf_rielt_listing_offer_kind`: `basic`, `premium`
- `rf_voucher_claim_scope`: `partner`, `listing`

## 3) Current RF tables

- `rf_partner`
- `rf_offer`
- `rf_voucher`
- `rf_pro_link`
- `rf_claim_idempotency`
- `rielt_listing_rf_offer`

## 4) Current key indexes

Important unique indexes:

- `rf_voucher_code_unique`
- legacy broad index from `0020`: `rf_voucher_offer_user_active_unique` on `(offer_id, issued_to_user_id)` where `status IN ('claimed', 'redeemed')`
- final partner-scope index from `0047`: `rf_voucher_offer_user_partner_unique` on `(offer_id, issued_to_user_id)` where `claim_scope = 'partner' AND status IN ('claimed', 'redeemed')`
- final listing-scope index: `rf_voucher_listing_offer_user_active_unique` on `(rielt_listing_id, offer_id, issued_to_user_id)` where `claim_scope = 'listing' AND status IN ('claimed', 'redeemed')`
- `rf_claim_idempotency_operation_actor_key_unique`
- `rf_pro_link_partner_pro_live_unique`
- `rielt_listing_rf_offer_listing_offer_unique`

## 5) Indexes not to delete before runtime-switch

Do not drop before runtime-switch:
- `rf_voucher_offer_user_partner_unique`
- `rf_voucher_listing_offer_user_active_unique`

Do not drop until cleanup slice:
- any legacy status-based partial unique index that current runtime `ON CONFLICT` can still target.

Never drop in this slice:
- `rf_voucher_code_unique`
- idempotency unique index
- Rielt listing-offer mapping unique index

## 6) Runtime ON CONFLICT dependency

Current `apps/rf-service` claim paths depend on old predicates:

```sql
ON CONFLICT (offer_id, issued_to_user_id)
WHERE claim_scope = 'partner'
  AND status IN ('claimed', 'redeemed')
DO NOTHING
```

Listing-scope uses the same pattern with:

```sql
ON CONFLICT (rielt_listing_id, offer_id, issued_to_user_id)
WHERE claim_scope = 'listing'
  AND status IN ('claimed', 'redeemed')
DO NOTHING
```

Therefore:
- old indexes must remain until runtime switches to canonical predicates;
- canonical indexes can be added in parallel;
- dropping old indexes before runtime-switch would break rollback and may break `ON CONFLICT`.

## Migration execution strategy

Recommended split:

- **Migration A** — additive canonical lifecycle columns
- **Migration B** — redemption table
- **Migration C** — canonical indexes
- **Migration D** — runtime switch support / compatibility checks
- **Migration E** — cleanup later, not Stage 1+2

Rules:
- no destructive changes in A/B/C;
- do not remove old enum values;
- do not remove old indexes until after runtime-switch and stability window;
- do not drop `status`;
- do not replace `rf_voucher_status`;
- PostgreSQL enum values added by `ADD VALUE` should be treated as forward-only.

## Migration A — additive canonical lifecycle columns

### Goal

Add canonical lifecycle data alongside legacy `rf_voucher.status`.

### Adds

- enum `rf_voucher_canonical_status`
- `rf_voucher.canonical_status`
- `rf_voucher.contract_version`
- `rf_voucher.expires_at`
- `rf_voucher.cancelled_at`
- `rf_voucher.status_changed_at`
- `rf_voucher.status_reason`
- `rf_voucher.status_actor_user_id`

### Does not do

- does not remove legacy `status`;
- does not alter `rf_voucher_status`;
- does not change claim/redeem runtime behavior;
- does not create canonical partial unique indexes;
- does not add `locked_at` / `unlocked_at`;
- does not implement lock/unlock/expire runtime.

### Dependencies

- existing `rf_voucher` table;
- existing legacy `status` values limited to `claimed`, `redeemed`, `cancelled`.

### Runtime readiness requirement

Can be applied before runtime changes. Old runtime can ignore new columns.

### Risk level

Medium:
- backfill touches all `rf_voucher` rows;
- dual-status drift is possible until runtime dual-write exists.

### SQL draft

```sql
-- Draft only. Do not execute without manual review.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'rf_voucher_canonical_status'
  ) THEN
    CREATE TYPE "rf_voucher_canonical_status" AS ENUM (
      'available',
      'locked',
      'unlocked',
      'redeemed',
      'expired',
      'cancelled'
    );
  END IF;
END $$;

ALTER TABLE "rf_voucher"
  ADD COLUMN IF NOT EXISTS "canonical_status" "rf_voucher_canonical_status",
  ADD COLUMN IF NOT EXISTS "contract_version" integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "expires_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "cancelled_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "status_changed_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "status_reason" text,
  ADD COLUMN IF NOT EXISTS "status_actor_user_id" text;

UPDATE "rf_voucher"
SET
  "canonical_status" = CASE "status"::text
    WHEN 'claimed' THEN 'available'::"rf_voucher_canonical_status"
    WHEN 'redeemed' THEN 'redeemed'::"rf_voucher_canonical_status"
    WHEN 'cancelled' THEN 'cancelled'::"rf_voucher_canonical_status"
  END,
  "status_changed_at" = COALESCE("status_changed_at", "updated_at", "created_at")
WHERE "canonical_status" IS NULL;

-- Review before applying: this encodes updated_at as historical cancellation timestamp.
UPDATE "rf_voucher"
SET "cancelled_at" = COALESCE("cancelled_at", "updated_at")
WHERE "status" = 'cancelled'
  AND "cancelled_at" IS NULL;

ALTER TABLE "rf_voucher"
  ALTER COLUMN "canonical_status" SET NOT NULL;

COMMENT ON COLUMN "rf_voucher"."canonical_status"
  IS 'Stage 1+2 canonical voucher lifecycle status. Legacy status claimed maps to available.';

COMMENT ON COLUMN "rf_voucher"."contract_version"
  IS 'RF voucher lifecycle contract version for transition compatibility.';

COMMIT;
```

### Pre-checks

```sql
SELECT COUNT(*) AS total_vouchers FROM rf_voucher;

SELECT status, COUNT(*) AS count
FROM rf_voucher
GROUP BY status
ORDER BY status;

SELECT status, COUNT(*) AS unexpected_count
FROM rf_voucher
WHERE status::text NOT IN ('claimed', 'redeemed', 'cancelled')
GROUP BY status;
```

### Post-checks

```sql
SELECT COUNT(*) AS canonical_status_nulls
FROM rf_voucher
WHERE canonical_status IS NULL;

SELECT status, canonical_status, COUNT(*) AS count
FROM rf_voucher
GROUP BY status, canonical_status
ORDER BY status, canonical_status;

SELECT COUNT(*) AS cancelled_without_cancelled_at
FROM rf_voucher
WHERE canonical_status = 'cancelled'
  AND cancelled_at IS NULL;

SELECT COUNT(*) AS redeemed_without_redeemed_at
FROM rf_voucher
WHERE canonical_status = 'redeemed'
  AND redeemed_at IS NULL;
```

### Rollback sketch

Safe rollback:
- old runtime ignores additive columns;
- keep legacy `status` and old indexes;
- do not drop enum values.

Unsafe rollback:
- dropping `canonical_status` after runtime starts writing it;
- trying to remove PostgreSQL enum types/values without hard rollback approval.

## Migration B — redemption table

### Goal

Introduce `VoucherRedemption` as a Stage 2 entity with attempts-model support.

### Adds

- enum `rf_voucher_redemption_result_status`
- table `rf_voucher_redemption`
- foreign keys to `rf_voucher` and `rf_partner`
- indexes for voucher/partner lookup
- partial unique success index
- idempotency unique index

### Does not do

- does not change current redeem runtime;
- does not backfill old redemptions;
- does not replace `redeemed_at`;
- does not introduce full `rf_voucher_event`.

### Recommended model

Use attempts-model:
- `succeeded`
- `failed`
- `duplicate`

One successful redemption per voucher is enforced by partial unique index.

### Runtime readiness requirement

Can be applied before runtime. Table remains empty until runtime writes to it.

### Risk level

Low/medium:
- mostly additive;
- future runtime must coordinate voucher status update and redemption insert atomically.

### SQL draft

```sql
-- Draft only. Do not execute without manual review.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'rf_voucher_redemption_result_status'
  ) THEN
    CREATE TYPE "rf_voucher_redemption_result_status" AS ENUM (
      'succeeded',
      'failed',
      'duplicate'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "rf_voucher_redemption" (
  "id" text PRIMARY KEY,
  "voucher_id" text NOT NULL REFERENCES "rf_voucher" ("id") ON DELETE CASCADE,
  "user_id" text NOT NULL,
  "partner_id" text NOT NULL REFERENCES "rf_partner" ("id") ON DELETE RESTRICT,
  "context_type" text NOT NULL DEFAULT 'manual',
  "context_ref" text,
  "result_status" "rf_voucher_redemption_result_status" NOT NULL,
  "idempotency_key" text,
  "actor_user_id" text,
  "redeemed_at" timestamptz,
  "metadata" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "correlation_id" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_rf_voucher_redemption_voucher_created_at"
  ON "rf_voucher_redemption" ("voucher_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_rf_voucher_redemption_partner_created_at"
  ON "rf_voucher_redemption" ("partner_id", "created_at" DESC);

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_redemption_success_unique"
  ON "rf_voucher_redemption" ("voucher_id")
  WHERE "result_status" = 'succeeded';

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_redemption_idempotency_unique"
  ON "rf_voucher_redemption" ("actor_user_id", "idempotency_key")
  WHERE "idempotency_key" IS NOT NULL;

COMMENT ON TABLE "rf_voucher_redemption"
  IS 'Stage 2 redemption attempts and successful RF voucher redemption facts.';

COMMIT;
```

### Field notes

- `user_id`: voucher consumer.
- `actor_user_id`: user performing redeem action, often partner/operator user.
- `partner_id`: denormalized partner reference for reporting and guard checks.
- `correlation_id`: optional now; useful later for Points/PRO/PartnerReward correlation.
- `metadata`: structured details for future audit without schema churn.

### Pre-checks

```sql
SELECT COUNT(*) AS vouchers
FROM rf_voucher;

SELECT COUNT(*) AS partners
FROM rf_partner;
```

### Post-checks

```sql
SELECT COUNT(*) AS redemption_rows
FROM rf_voucher_redemption;

SELECT indexname
FROM pg_indexes
WHERE tablename = 'rf_voucher_redemption'
ORDER BY indexname;
```

### Rollback sketch

Safe before runtime writes:
- drop table and type only if confirmed empty and manually approved.

Safe after runtime writes:
- do not drop; rollback runtime to ignore table.

Unsafe:
- dropping redemption records after production usage.

## Migration C — canonical indexes

### Goal

Add canonical partial unique indexes in parallel with old status-based indexes.

### Adds

- partner-scope canonical partial unique index;
- listing-scope canonical partial unique index;
- query indexes by `issued_to_user_id + canonical_status + claimed_at`;
- query indexes by `partner_id + canonical_status + claimed_at`.

### Does not do

- does not drop old indexes;
- does not switch runtime `ON CONFLICT`;
- does not implement repeatability;
- does not remove `redeemed` from uniqueness predicate.

### Runtime readiness requirement

Can be applied before runtime switch, but old indexes must remain.

### Risk level

Medium/high:
- unique index creation can fail if canonical data contains duplicates.
- real implementation may need `CREATE INDEX CONCURRENTLY`, which cannot run inside a transaction.

### Repeatability note

Stage 1+2 keeps one-time default:

```sql
canonical_status IN ('available', 'locked', 'unlocked', 'redeemed')
```

Including `redeemed` is intentional. Repeatability requires a future policy/guard layer.

### Duplicate pre-checks

Partner-scope:

```sql
SELECT offer_id, issued_to_user_id, COUNT(*) AS cnt
FROM rf_voucher
WHERE claim_scope = 'partner'
  AND canonical_status IN ('available', 'locked', 'unlocked', 'redeemed')
GROUP BY offer_id, issued_to_user_id
HAVING COUNT(*) > 1;
```

Listing-scope:

```sql
SELECT rielt_listing_id, offer_id, issued_to_user_id, COUNT(*) AS cnt
FROM rf_voucher
WHERE claim_scope = 'listing'
  AND canonical_status IN ('available', 'locked', 'unlocked', 'redeemed')
GROUP BY rielt_listing_id, offer_id, issued_to_user_id
HAVING COUNT(*) > 1;
```

Compare old predicate vs new predicate:

```sql
SELECT
  SUM(CASE WHEN status IN ('claimed', 'redeemed') THEN 1 ELSE 0 END) AS old_predicate_count,
  SUM(CASE WHEN canonical_status IN ('available', 'locked', 'unlocked', 'redeemed') THEN 1 ELSE 0 END) AS new_predicate_count
FROM rf_voucher;
```

Listing rows missing listing id:

```sql
SELECT COUNT(*) AS listing_scope_without_listing_id
FROM rf_voucher
WHERE claim_scope = 'listing'
  AND rielt_listing_id IS NULL;
```

### SQL draft

```sql
-- Draft only. Do not execute without manual review.
-- In production, consider CREATE INDEX CONCURRENTLY in separate non-transactional migration.

BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_offer_user_partner_canonical_unique"
  ON "rf_voucher" ("offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'partner'
    AND "canonical_status" IN ('available', 'locked', 'unlocked', 'redeemed');

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_listing_offer_user_canonical_unique"
  ON "rf_voucher" ("rielt_listing_id", "offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'listing'
    AND "canonical_status" IN ('available', 'locked', 'unlocked', 'redeemed');

CREATE INDEX IF NOT EXISTS "idx_rf_voucher_issued_to_canonical_claimed_at"
  ON "rf_voucher" ("issued_to_user_id", "canonical_status", "claimed_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_rf_voucher_partner_canonical_claimed_at"
  ON "rf_voucher" ("partner_id", "canonical_status", "claimed_at" DESC);

COMMIT;
```

### Post-checks

```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'rf_voucher'
  AND indexname IN (
    'rf_voucher_offer_user_partner_canonical_unique',
    'rf_voucher_listing_offer_user_canonical_unique',
    'idx_rf_voucher_issued_to_canonical_claimed_at',
    'idx_rf_voucher_partner_canonical_claimed_at'
  )
ORDER BY indexname;
```

### Rollback sketch

Safe:
- drop only new canonical indexes.

```sql
DROP INDEX IF EXISTS "rf_voucher_offer_user_partner_canonical_unique";
DROP INDEX IF EXISTS "rf_voucher_listing_offer_user_canonical_unique";
DROP INDEX IF EXISTS "idx_rf_voucher_issued_to_canonical_claimed_at";
DROP INDEX IF EXISTS "idx_rf_voucher_partner_canonical_claimed_at";
```

Unsafe:
- dropping old indexes before runtime switch and rollback window.

## Idempotency enum expansion decision

New requested operation values:
- `voucher_redeem`
- `voucher_cancel`
- `voucher_lock`
- `voucher_unlock`
- `voucher_expire`

### PostgreSQL limitation

`ALTER TYPE ... ADD VALUE` is additive. Removing enum values later is not a simple rollback.

### Recommended approach

For Stage 1+2:
- add only values needed by near-term runtime.

Recommended split:
- add `voucher_redeem` with Migration B or D, because `rf_voucher_redemption` and redeem idempotency are Stage 2.
- defer `voucher_cancel`, `voucher_lock`, `voucher_unlock`, `voucher_expire` until those runtime operations are actually exposed or implemented.

Reason:
- avoids forward-only enum debt;
- lock/unlock/expire are placeholders, not active runtime in this slice.

If the team prefers pre-allocation:
- it is safe for old runtime but not reversible cleanly.

### Draft if adding only redeem

```sql
ALTER TYPE "rf_idempotency_operation"
  ADD VALUE IF NOT EXISTS 'voucher_redeem';
```

### Draft if adding all future values

```sql
ALTER TYPE "rf_idempotency_operation" ADD VALUE IF NOT EXISTS 'voucher_redeem';
ALTER TYPE "rf_idempotency_operation" ADD VALUE IF NOT EXISTS 'voucher_cancel';
ALTER TYPE "rf_idempotency_operation" ADD VALUE IF NOT EXISTS 'voucher_lock';
ALTER TYPE "rf_idempotency_operation" ADD VALUE IF NOT EXISTS 'voucher_unlock';
ALTER TYPE "rf_idempotency_operation" ADD VALUE IF NOT EXISTS 'voucher_expire';
```

Final recommendation:
- **add only `voucher_redeem` in Stage 1+2**;
- defer the rest.

## Runtime switch dependencies

Can apply before runtime changes:
- Migration A canonical columns + backfill.
- Migration B redemption table.
- Migration C canonical indexes, provided old indexes remain.

Cannot apply before runtime changes:
- dropping old status-based indexes.
- switching `ON CONFLICT` predicates without canonical indexes.
- relying on redemption table for business behavior.

Runtime must change after A/B/C:
- dual-write `status` and `canonical_status`;
- claim writes `canonical_status = 'available'`;
- redeem writes redemption record and canonical `redeemed`;
- summary can compute both legacy and canonical metrics;
- `ON CONFLICT` switches to canonical predicate only after C.

Cleanup not in Stage 1+2:
- removing legacy `status`;
- removing `rf_voucher_status`;
- removing `claimed`;
- dropping old indexes before stability window.

## Data safety checks

Run manually before execution; do not execute as part of this planning pass.

### Counts

```sql
SELECT COUNT(*) AS total_vouchers FROM rf_voucher;

SELECT status, COUNT(*) AS count
FROM rf_voucher
GROUP BY status
ORDER BY status;
```

### Canonical backfill validation

```sql
SELECT COUNT(*) AS canonical_status_nulls
FROM rf_voucher
WHERE canonical_status IS NULL;

SELECT status, canonical_status, COUNT(*) AS count
FROM rf_voucher
GROUP BY status, canonical_status
ORDER BY status, canonical_status;
```

### Unexpected status

```sql
SELECT status, COUNT(*) AS count
FROM rf_voucher
WHERE status::text NOT IN ('claimed', 'redeemed', 'cancelled')
GROUP BY status;
```

### Duplicate checks under canonical predicate

```sql
SELECT offer_id, issued_to_user_id, COUNT(*) AS cnt
FROM rf_voucher
WHERE claim_scope = 'partner'
  AND canonical_status IN ('available', 'locked', 'unlocked', 'redeemed')
GROUP BY offer_id, issued_to_user_id
HAVING COUNT(*) > 1;
```

```sql
SELECT rielt_listing_id, offer_id, issued_to_user_id, COUNT(*) AS cnt
FROM rf_voucher
WHERE claim_scope = 'listing'
  AND canonical_status IN ('available', 'locked', 'unlocked', 'redeemed')
GROUP BY rielt_listing_id, offer_id, issued_to_user_id
HAVING COUNT(*) > 1;
```

### Compare old vs new predicate

```sql
SELECT
  COUNT(*) FILTER (WHERE status IN ('claimed', 'redeemed')) AS old_predicate_count,
  COUNT(*) FILTER (
    WHERE canonical_status IN ('available', 'locked', 'unlocked', 'redeemed')
  ) AS new_predicate_count
FROM rf_voucher;
```

### Timestamp checks

```sql
SELECT COUNT(*) AS cancelled_without_cancelled_at
FROM rf_voucher
WHERE canonical_status = 'cancelled'
  AND cancelled_at IS NULL;

SELECT COUNT(*) AS redeemed_without_redeemed_at
FROM rf_voucher
WHERE canonical_status = 'redeemed'
  AND redeemed_at IS NULL;
```

### Redemption table checks

```sql
SELECT COUNT(*) AS redemption_rows
FROM rf_voucher_redemption;
```

### Index existence checks

```sql
SELECT tablename, indexname
FROM pg_indexes
WHERE tablename IN ('rf_voucher', 'rf_voucher_redemption')
ORDER BY tablename, indexname;
```

## Rollback strategy

## Safe rollback

Safe rollback means:
- old runtime ignores additive columns/tables;
- legacy `status` remains source of truth;
- old indexes are still present;
- canonical columns/tables can remain unused.

Safe actions:
- rollback application to legacy `status` reads/writes;
- drop newly added canonical indexes if needed;
- keep additive columns and tables;
- leave enum values/types in place.

## Unsafe rollback

Unsafe:
- removing PostgreSQL enum values;
- dropping `canonical_status` after runtime uses it;
- dropping `rf_voucher_redemption` after writes exist;
- dropping old indexes before runtime switch and trying to rollback runtime;
- changing `redeemed` history back to `available`.

## What not to rollback

Do not rollback:
- legacy `status`;
- old `rf_voucher_status` type;
- old partial unique indexes until cleanup phase;
- enum `ADD VALUE` operations unless hard manual DB rollback is approved.

## Operational fallback

Fallback path:
1. keep old indexes until stability window completes;
2. keep old runtime path deployable;
3. if canonical write path fails, disable canonical reads in runtime and read legacy `status`;
4. investigate dual-status drift with data checks.

## Repeatability decision integration

Repeatability decision:
- both one-time and repeatable offers must exist in future;
- repeatability is policy on `rf_offer`;
- Stage 1+2 keeps one-time default;
- repeatability implementation is not part of this migration plan.

Canonical partial indexes must keep `redeemed`:

```sql
canonical_status IN ('available', 'locked', 'unlocked', 'redeemed')
```

Meaning:
- redeemed vouchers still block repeated claim in the same scope;
- current business behavior is preserved;
- repeatability requires future policy-aware guard.

Future repeatability needs:
- `rf_offer.repeat_policy`;
- `rf_voucher.repeat_policy_snapshot`;
- policy-aware uniqueness or claim guard table;
- eligibility fields for UI (`canClaimAgain`, `nextClaimAvailableAt`, `remainingClaims`).

Do not change Migration C predicate for repeatability in Stage 1+2.

## OpenAPI/SDK/frontend readiness note

This pass does not change OpenAPI/SDK/frontend.

Next implementation passes after migration planning:
- update `packages/db/src/schema/rf.ts`;
- create real migration files;
- update `apps/rf-service` dual-read/dual-write runtime;
- update `docs/openapi/rf.yaml` with additive fields;
- regenerate `packages/sdk/src/generated/*`;
- align `packages/sdk/src/rf.ts`;
- adapt frontend status mapping in RF/Rielt/Connect;
- add lifecycle/idempotency/redemption/index tests.

Readiness constraints:
- OpenAPI must remain additive until clients migrate.
- SDK regen must happen after OpenAPI diff.
- frontend must handle both legacy `status` and canonical status during transition.

## Recommended implementation order

1. Review this plan with backend/DB owner.
2. Run data safety pre-checks in a read-only database session.
3. Create Migration A as a real migration file.
4. Apply Migration A in staging; verify backfill.
5. Create Migration B; apply in staging; verify table/indexes.
6. Create Migration C; run duplicate checks first; create indexes.
7. Implement runtime dual-read/dual-write and redemption logic.
8. Add tests and CI gates.
9. Update OpenAPI/SDK/frontend as additive compatibility pass.
10. Observe stability window.
11. Plan Migration E cleanup later.

## Final recommendation

Recommended migration split:
- A: additive canonical lifecycle columns and backfill.
- B: `rf_voucher_redemption` attempts table.
- C: canonical indexes in parallel with old indexes.
- D: runtime switch and compatibility checks.
- E: cleanup later, outside Stage 1+2.

Recommended idempotency enum approach:
- add only `voucher_redeem` in Stage 1+2 if redeem idempotency is implemented;
- defer cancel/lock/unlock/expire enum values until those operations exist.

Recommended first implementation task:
- create a real **Migration A draft PR** only after running read-only data pre-checks and confirming no unexpected legacy statuses.

Primary risk:
- canonical unique indexes may fail if data contains duplicates under the new predicate; old indexes must remain until runtime switch and rollback window are complete.
