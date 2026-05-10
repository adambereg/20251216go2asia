# RF Asia Stage 1+2 Contract Diff and Migration Draft v1

Статус: planning-only / read-only.  
Ограничения: не выполнять SQL, не создавать migration-файл, не менять runtime/schema/OpenAPI/SDK/frontend.

Этот документ является точным draft-планом для будущего implementation prompt после утверждения.

## Executive Summary

Stage 1+2 должен перевести RF voucher lifecycle от короткого runtime-статуса `claimed/redeemed/cancelled` к канонической модели:

- `available`
- `locked`
- `unlocked`
- `redeemed`
- `expired`
- `cancelled`

Ключевое правило совместимости:
- legacy `claimed` маппится в canonical `available`.

Рекомендованная стратегия для Go2Asia:
- **не заменять старый enum одним резким шагом**;
- ввести **additive canonical layer** через `canonical_status` + `contract_version`;
- сохранить legacy `status` на transition window;
- после стабилизации dual-read/dual-write сделать отдельный cleanup-slice.

## Current Schema Contract

## 1) `rf_voucher_status`

Текущий enum:

```sql
CREATE TYPE "rf_voucher_status" AS ENUM (
  'claimed',
  'redeemed',
  'cancelled'
);
```

Фактическая семантика:
- `claimed` = voucher issued/active в продуктовой трактовке.
- `redeemed` = использован.
- `cancelled` = отменён.

Где используется:
- `packages/db/migrations/0020_rf_core_v1.sql`
- `packages/db/src/schema/rf.ts`
- `apps/rf-service/src/store.ts`
- `docs/openapi/rf.yaml`
- `packages/sdk/src/rf.ts`
- `packages/sdk/src/generated/rfVoucherStatus.ts`
- PWA RF/Connect UI status labels.

## 2) `rf_voucher`

Текущие ключевые поля:

- `id`
- `offer_id`
- `partner_id`
- `issued_to_user_id`
- `status`
- `code`
- `claimed_at`
- `redeemed_at`
- `claim_scope`
- `rielt_listing_id`
- `rielt_listing_title_snapshot`
- `created_at`
- `updated_at`

Текущие assumptions:
- claim создаёт строку со `status = 'claimed'`.
- redeem разрешён только из `claimed`.
- `redeemed` считается идемпотентным replay для redeem (`applied: false`).
- `cancelled` блокирует redeem.
- expire/lock/unlock в schema отсутствуют.

## 3) `rf_claim_idempotency`

Текущий enum operations:

```sql
CREATE TYPE "rf_idempotency_operation" AS ENUM (
  'voucher_claim'
);
```

Текущая таблица хранит:
- `operation`
- `actor_user_id`
- `idempotency_key`
- `voucher_id`
- timestamps

Уникальность:
- `(operation, actor_user_id, idempotency_key)`

Фактический coverage:
- partner-scope claim
- listing-scope claim

Не покрывает:
- redeem
- cancel
- expire
- lock
- unlock

## 4) Partial unique indexes

Текущая business-защита от повторного claim завязана на partial indexes с условием:

```sql
status IN ('claimed', 'redeemed')
```

Partner-scope:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_offer_user_partner_unique"
  ON "rf_voucher" ("offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'partner'
    AND "status" IN ('claimed', 'redeemed');
```

Listing-scope:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_listing_offer_user_active_unique"
  ON "rf_voucher" ("rielt_listing_id", "offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'listing'
    AND "status" IN ('claimed', 'redeemed');
```

Текущее поведение:
- `cancelled` не блокирует повторное получение.
- `redeemed` блокирует повторное получение того же voucher scope.
- Это может быть намеренной продуктовой логикой: «один claim на scope навсегда после использования».

## 5) Current summary assumptions

RF summary:
- `activeVouchers` = `status = 'claimed'`
- `usedVouchers` = `status = 'redeemed'`
- `cancelledVouchers` = `status = 'cancelled'`

Connect voucher summary потребляет RF summary и не владеет voucher lifecycle.

## 6) Current OpenAPI/SDK enum assumptions

`docs/openapi/rf.yaml`:
- `RfVoucher.status` enum = `claimed | redeemed | cancelled`
- description фиксирует `claimed` как runtime-значение для issued/active voucher.
- `RfVoucherSummary.activeVouchers` описан как count of `claimed`.

`packages/sdk/src/rf.ts`:
- ручной union `RfVoucherDto.status = 'claimed' | 'redeemed' | 'cancelled'`.

`packages/sdk/src/generated/*`:
- generated enum mirror текущего OpenAPI.

## Target Contract v1

## 1) Canonical statuses

Canonical voucher statuses:

- `available`
- `locked`
- `unlocked`
- `redeemed`
- `expired`
- `cancelled`

Legacy mapping:

- `claimed -> available`

Terminal statuses:

- `redeemed`
- `expired`
- `cancelled`

Active / non-terminal statuses:

- `available`
- `locked`
- `unlocked`

## 2) Allowed transitions

- `available -> locked`
- `available -> redeemed` only for non-premium / no-unlock vouchers
- `available -> expired`
- `available -> cancelled`
- `locked -> unlocked`
- `locked -> expired`
- `locked -> cancelled`
- `unlocked -> redeemed`
- `unlocked -> expired`
- `unlocked -> cancelled`

## 3) Forbidden transitions

- Any transition from terminal statuses.
- `redeemed -> *`
- `expired -> *`
- `cancelled -> *`
- `locked -> redeemed` when policy requires unlock.
- Any rollback transition without an explicit admin override outside this slice.

## Schema Diff Proposal

## A) Status strategy options

### Option 1: replace enum completely

Change `rf_voucher_status` to the new set and migrate all `claimed` to `available`.

Pros:
- clean schema after migration.
- no long-lived dual status model.

Cons:
- PostgreSQL enum replacement is sensitive.
- rollback is harder.
- clients/SDK/UI that expect `claimed` break unless deployed in strict lockstep.

Verdict:
- too risky for this slice.

### Option 2: extend enum and keep `claimed` deprecated

Add new values to existing enum:
- `available`
- `locked`
- `unlocked`
- `expired`

Keep:
- `claimed`
- `redeemed`
- `cancelled`

Pros:
- additive DB migration.
- easier deploy sequencing.
- old clients can continue to work during transition.

Cons:
- legacy value remains in PostgreSQL enum.
- cleanup later requires separate hard migration.

Verdict:
- acceptable if team wants fastest additive path.

### Option 3: add `canonical_status`, keep legacy `status` temporarily

Add new enum `rf_voucher_canonical_status` and column:
- `canonical_status`

Keep legacy:
- `status`

Add:
- `contract_version`

Pros:
- best backward compatibility.
- old code can continue reading `status`.
- new code can prefer `canonical_status`.
- rollback is clear: ignore `canonical_status`.
- avoids immediate destructive enum surgery.

Cons:
- dual-read/dual-write period.
- requires clear cleanup follow-up.

Recommended for Go2Asia:
- **Option 3** for Stage 1+2.

Reason:
- preserves current Rielt claim flow and Connect summary.
- avoids breaking generated SDK/UI immediately.
- gives a controlled rollout and rollback path.
- fits contract-first transition from `claimed` to `available`.

## B) `rf_voucher` field proposal

| Field | Required now | Stage | Default / backfill | Why | Risk |
|---|---:|---|---|---|---|
| `canonical_status` | yes | Stage 1+2 | map `claimed -> available`, otherwise same terminal value | canonical lifecycle v1 | dual status drift |
| `contract_version` | yes | Stage 1+2 | `1` for backfilled rows | API/runtime compatibility marker | forgotten bumps |
| `expires_at` | optional | Stage 2 | nullable | supports future expire transition | NULL semantics |
| `cancelled_at` | optional | Stage 2 | nullable; old cancelled can use `updated_at` only if approved | audit cancel transition | incomplete backfill |
| `locked_at` | later | Stage 4/6 | nullable | future premium/points lock | premature semantics |
| `unlocked_at` | later | Stage 4/6 | nullable | future unlock proof | premature semantics |
| `status_changed_at` | yes | Stage 1+2 | `COALESCE(updated_at, created_at)` | lifecycle audit minimum | may duplicate `updated_at` |
| `status_reason` | optional | Stage 2 | nullable | cancel/expire explanation | free-text drift |
| `status_actor_user_id` | optional | Stage 2 | nullable | actor audit for cancel/redeem/system | auth mapping |
| `legacy_status` | no | later/avoid | not needed if legacy `status` remains | only useful for hard swap | long-lived debt |

Recommended minimum for first migration:
- `canonical_status`
- `contract_version`
- `status_changed_at`
- `expires_at`
- `cancelled_at`
- `status_reason`
- `status_actor_user_id`

Do not add `locked_at/unlocked_at` until lock/unlock is actually implemented.

## C) VoucherRedemption table proposal

Recommended table name:

- `rf_voucher_redemption`

Recommended model:

- attempts-model with partial unique success constraint.

Why attempts-model:
- supports audit of failed/replayed redeem attempts.
- still enforces one successful redemption per voucher.
- prepares for later partner dispute/support flows.

Minimal fields:

- `id`
- `voucher_id`
- `user_id`
- `partner_id`
- `context_type`
- `context_ref`
- `result_status`
- `idempotency_key`
- `actor_user_id`
- `redeemed_at`
- `metadata`
- `created_at`
- `updated_at`

Recommended result statuses:
- `succeeded`
- `failed`
- `duplicate`

Indexes:
- `idx_rf_voucher_redemption_voucher_created_at`
- `idx_rf_voucher_redemption_partner_created_at`
- unique success index on `voucher_id WHERE result_status = 'succeeded'`
- unique idempotency index on `(actor_user_id, idempotency_key)` where `idempotency_key IS NOT NULL`

## D) Operation/history recommendation

For Stage 1+2:
- do **not** introduce full `rf_voucher_event` yet.
- introduce `rf_voucher_redemption`.
- add lifecycle timestamps/status metadata on `rf_voucher`.
- expand idempotency operation enum for near-term transitions.

Future debt:
- introduce append-only `rf_voucher_event` after lifecycle baseline is stable.
- correlate RF events with future Points/PRO/PartnerReward flows via `correlation_id`.

## E) `rf_claim_idempotency`

Short-term recommendation:
- keep table name for compatibility even though it becomes more generic.
- expand operation enum.

Add operations:
- `voucher_claim`
- `voucher_redeem`
- `voucher_cancel`
- `voucher_lock`
- `voucher_unlock`
- `voucher_expire`

Risk:
- table name becomes semantically narrower than actual usage.

Later cleanup:
- rename to `rf_operation_idempotency` in a separate migration if needed.

## F) Partial unique index strategy

Current predicate:

```sql
status IN ('claimed', 'redeemed')
```

Recommended transition predicate during dual-status window:

```sql
canonical_status IN ('available', 'locked', 'unlocked', 'redeemed')
```

Why include `redeemed`:
- preserves current behavior where redeemed vouchers block repeat claim for same scope.
- avoids silently changing business rules.

Future optional product decision:
- if repeat claim after redemption becomes allowed, remove `redeemed` from the active uniqueness predicate in a separate product-approved migration.

Migration order:
1. Add `canonical_status` and backfill.
2. Create new partial unique indexes on `canonical_status`.
3. Keep old indexes until runtime `ON CONFLICT` is updated.
4. Deploy runtime using new predicate/index behavior.
5. Drop old status-based indexes in cleanup phase.

Rollback concern:
- if runtime is rolled back to old `ON CONFLICT` clauses, old indexes must still exist.
- do not drop old indexes in Phase A.

## SQL Migration Draft

Important:
- This SQL is a **draft only**.
- Do not execute without manual DBA/backend review.
- Do not create a real migration file from this document without implementation approval.

### Phase A draft: additive schema

```sql
-- Draft only. Manual review required before execution.

BEGIN;

-- 1) Canonical lifecycle enum.
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

-- 2) Redemption result enum.
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

-- 3) Expand operation enum for future idempotent transitions.
-- PostgreSQL enum values cannot be removed cheaply; review before applying.
ALTER TYPE "rf_idempotency_operation" ADD VALUE IF NOT EXISTS 'voucher_redeem';
ALTER TYPE "rf_idempotency_operation" ADD VALUE IF NOT EXISTS 'voucher_cancel';
ALTER TYPE "rf_idempotency_operation" ADD VALUE IF NOT EXISTS 'voucher_lock';
ALTER TYPE "rf_idempotency_operation" ADD VALUE IF NOT EXISTS 'voucher_unlock';
ALTER TYPE "rf_idempotency_operation" ADD VALUE IF NOT EXISTS 'voucher_expire';

-- 4) Add additive lifecycle columns.
ALTER TABLE "rf_voucher"
  ADD COLUMN IF NOT EXISTS "canonical_status" "rf_voucher_canonical_status",
  ADD COLUMN IF NOT EXISTS "contract_version" integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "expires_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "cancelled_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "status_changed_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "status_reason" text,
  ADD COLUMN IF NOT EXISTS "status_actor_user_id" text;

-- 5) Backfill canonical status.
UPDATE "rf_voucher"
SET
  "canonical_status" = CASE "status"::text
    WHEN 'claimed' THEN 'available'::"rf_voucher_canonical_status"
    WHEN 'redeemed' THEN 'redeemed'::"rf_voucher_canonical_status"
    WHEN 'cancelled' THEN 'cancelled'::"rf_voucher_canonical_status"
  END,
  "status_changed_at" = COALESCE("updated_at", "created_at")
WHERE "canonical_status" IS NULL;

-- 6) Lock canonical_status after backfill.
ALTER TABLE "rf_voucher"
  ALTER COLUMN "canonical_status" SET NOT NULL;

-- 7) Best-effort cancelled timestamp for old rows.
-- Review before applying: this may encode updated_at as cancellation time.
UPDATE "rf_voucher"
SET "cancelled_at" = COALESCE("cancelled_at", "updated_at")
WHERE "status" = 'cancelled'
  AND "cancelled_at" IS NULL;

COMMIT;
```

### Phase A draft: redemption table

```sql
-- Draft only. Manual review required before execution.

BEGIN;

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
  IS 'Draft Stage 2 table: redemption attempts and successful voucher redemption facts.';

COMMENT ON COLUMN "rf_voucher"."canonical_status"
  IS 'Stage 1+2 canonical voucher lifecycle status. Legacy status claimed maps to canonical available.';

COMMIT;
```

### Phase B draft: canonical partial indexes

```sql
-- Draft only. Apply only after canonical_status backfill is verified.
-- Keep old indexes until runtime ON CONFLICT has been updated.

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

### Cleanup draft (later, not Stage A)

```sql
-- Later cleanup only after runtime no longer depends on legacy status partial indexes.
-- Manual review required.

BEGIN;

DROP INDEX IF EXISTS "rf_voucher_offer_user_partner_unique";
DROP INDEX IF EXISTS "rf_voucher_listing_offer_user_active_unique";

-- Do NOT drop legacy "status" column or rf_voucher_status enum in Stage 1+2.
-- That requires a separate compatibility and client cutoff decision.

COMMIT;
```

### Rollback sketch

```sql
-- Rollback sketch only. Manual review required.

BEGIN;

-- 1) Recreate old indexes if they were dropped.
CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_offer_user_partner_unique"
  ON "rf_voucher" ("offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'partner'
    AND "status" IN ('claimed', 'redeemed');

CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_listing_offer_user_active_unique"
  ON "rf_voucher" ("rielt_listing_id", "offer_id", "issued_to_user_id")
  WHERE "claim_scope" = 'listing'
    AND "status" IN ('claimed', 'redeemed');

-- 2) Runtime rollback can ignore additive canonical columns.
-- 3) Avoid dropping enum values from PostgreSQL in rollback.

COMMIT;
```

## OpenAPI Contract Diff

Do not modify `docs/openapi/rf.yaml` in this pass.

Future diff:

### `RfVoucher`

Keep:
- `status` as legacy field during transition.

Add optional fields:
- `canonicalStatus`
- `contractVersion`
- `expiresAt`
- `cancelledAt`
- `statusChangedAt`
- `statusReason`
- `statusActorUserId`

Descriptions:
- mark `claimed` as legacy/deprecated semantic value.
- document `claimed -> available`.
- state that new clients should prefer `canonicalStatus`.

### `RfVoucherSummary`

Keep current fields:
- `totalVouchers`
- `activeVouchers`
- `usedVouchers`
- `cancelledVouchers`

Add optional fields:
- `availableVouchers`
- `lockedVouchers`
- `unlockedVouchers`
- `expiredVouchers`

Compatibility:
- `activeVouchers = available + locked + unlocked` during transition.

### `RfVoucherRedemption`

Add schema:
- `id`
- `voucherId`
- `userId`
- `partnerId`
- `contextType`
- `contextRef`
- `resultStatus`
- `idempotencyKey`
- `actorUserId`
- `redeemedAt`
- `metadata`
- `createdAt`
- `updatedAt`

### `RfRedeemResponse`

Keep:
- `voucher`
- `applied`

Add optional:
- `redemption`
- `transition`
- `idempotentReplay`

### Error codes

Add documented examples for conflict/invalid transition:
- `RF_VOUCHER_INVALID_STATE`
- `RF_VOUCHER_TRANSITION_NOT_ALLOWED`
- `RF_VOUCHER_ALREADY_TERMINAL`
- `RF_VOUCHER_LOCK_REQUIRED`
- `RF_VOUCHER_EXPIRED`
- `RF_VOUCHER_IDEMPOTENCY_CONFLICT`

## SDK Contract Diff

Do not update SDK in this pass.

Future checks:
- regenerate `packages/sdk/src/generated/*` only after OpenAPI additive update.
- update `packages/sdk/src/rf.ts` manual `RfVoucherDto.status` union.
- prefer generated `RfVoucher` types over duplicate manual DTOs where possible.
- keep fallback mapping in wrappers:
  - `canonicalStatus ?? mapLegacyStatus(status)`.

## Backend Runtime Diff

Do not modify `apps/rf-service` in this pass.

Future impacted use-cases:

### Claim

- write legacy `status = 'claimed'` during dual-write window.
- write `canonical_status = 'available'`.
- preserve existing idempotency behavior.
- update `ON CONFLICT` strategy only after canonical indexes exist.

### Listing-scope claim

- preserve current Rielt mapping validations.
- preserve `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`.
- write canonical status consistently.

### Redeem

- accept only:
  - `canonical_status = 'available'` for no-unlock vouchers; or
  - `canonical_status = 'unlocked'` when policy requires unlock.
- write `rf_voucher_redemption`.
- update voucher to `canonical_status = 'redeemed'`.
- preserve legacy `status = 'redeemed'`.
- make repeated redeem deterministic/idempotent.

### Summary

- preserve legacy response fields.
- compute new optional counts from canonical status.
- `activeVouchers = available + locked + unlocked`.

### My vouchers list

- return legacy `status`.
- return `canonicalStatus`.
- preserve listing context and wallet enrichment.

### Future placeholders

- cancel/expire/lock/unlock should be designed with idempotent transitions, but not exposed unless implementation scope explicitly includes them.

## Frontend Impact Diff

No frontend edits in this pass.

Future minimal changes:

- RF my-vouchers: labels/badges for `available/locked/unlocked/expired`.
- RF listing voucher claim route: active voucher detection should use canonical non-terminal statuses.
- RF offers/vouchers catalog: no redesign; only type/guard compatibility if DTO changes.
- Rielt listing CTA: preserve route and CTA behavior.
- Connect voucher summary: keep old metrics, add compatibility rendering if new counts exist.
- Wallet/activity labels: add labels only if new points/dashboard actions are introduced.
- PRO/merchant mocks: contract-safe updates only, no product expansion.

## Compatibility and Rollout Plan

### Phase A — additive schema

Do:
- add canonical enum/columns.
- backfill `claimed -> available`.
- add redemption table.
- add canonical indexes while keeping old indexes.

Do not:
- drop legacy status.
- drop old partial indexes.
- change runtime behavior yet.

Checks:
- backfill count matches total voucher count.
- no duplicate conflicts under new canonical indexes.

Rollback:
- runtime ignores new fields.
- old indexes still exist.

### Phase B — backend dual-read / dual-write

Do:
- write legacy `status` and canonical status together.
- read canonical status preferentially.
- preserve old responses.

Do not:
- expose breaking status changes.

Checks:
- claim/redeem/request tests.
- dual status consistency checks.

Rollback:
- switch reads back to legacy status.

### Phase C — OpenAPI/SDK additive fields

Do:
- add optional fields.
- document deprecation and mapping.
- regenerate SDK after spec approval.

Do not:
- remove `claimed`.

Checks:
- OpenAPI validation.
- SDK typecheck.

Rollback:
- clients ignore optional fields.

### Phase D — frontend compatibility mapping

Do:
- prefer canonical status.
- fallback to legacy `status`.

Do not:
- redesign RF/Rielt/Connect UX.

Checks:
- Rielt listing voucher regression.
- Connect summary regression.

Rollback:
- fallback mapper uses legacy `status`.

### Phase E — switch canonical status

Do:
- canonical status becomes source of truth for lifecycle guards.
- summary uses canonical status.

Do not:
- drop legacy fields yet.

Checks:
- lifecycle matrix tests.
- index conflict tests.

Rollback:
- temporarily restore legacy guards if old indexes are intact.

### Phase F — cleanup legacy `claimed` later

Do:
- after clients and runtime are stable, plan hard cleanup.

Do not:
- include cleanup in Stage 1+2.

Checks:
- no clients depending on `claimed`.

Rollback:
- cleanup must have its own rollback plan.

## Tests and CI Gates

Required tests:

- lifecycle transition matrix tests.
- legacy `claimed -> available` mapping tests.
- partial unique index tests for partner-scope and listing-scope.
- claim idempotency tests.
- redeem idempotency tests.
- redemption record tests.
- summary compatibility tests.
- OpenAPI contract validation.
- SDK typecheck.
- Rielt listing voucher flow regression.
- Connect voucher summary regression.

Minimum CI gate before merge:

1. RF service tests pass for claim/redeem/listing claim/summary.
2. Lifecycle matrix test passes.
3. OpenAPI spec validates.
4. SDK package typechecks.
5. PWA typecheck passes for RF/Rielt/Connect affected areas.
6. Migration dry-run review confirms no duplicate rows violate new canonical indexes.

## Final Recommendation

Recommended schema strategy:
- **Option 3**: add `canonical_status` and keep legacy `status` during transition.

Recommended status strategy:
- canonical statuses: `available/locked/unlocked/redeemed/expired/cancelled`.
- map legacy `claimed -> available`.
- do not remove `claimed` in Stage 1+2.

Recommended redemption strategy:
- create `rf_voucher_redemption`.
- use attempts-model with partial unique success index.

Recommended idempotency strategy:
- keep `rf_claim_idempotency` table for now.
- expand operation enum for redeem/cancel/lock/unlock/expire.
- consider rename to generic operation idempotency later.

Recommended partial index strategy:
- create canonical partial unique indexes on:
  - `available`
  - `locked`
  - `unlocked`
  - `redeemed`
- keep old indexes until runtime `ON CONFLICT` is switched.

Recommended first implementation task:
- **Phase A schema migration draft review**: convert the SQL draft into a real migration proposal in a separate implementation pass, run manual duplicate/index analysis, and only then request approval to create migration files.
