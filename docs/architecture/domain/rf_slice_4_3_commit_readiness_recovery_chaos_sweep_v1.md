# RF Slice 4.3 — Commit Readiness, Recovery Audit & Chaos Regression Sweep v1

## 1. Executive Summary

RF Slice 4.3 implementation was audited for readiness with focus on replay safety, compensation/recovery behavior, feature-flag rollback, and diagnostics observability.

Overall verdict: **ready for PR with bounded follow-ups**.

- Core invariants are preserved in current runtime and tests:
  - no double debit on claim replay;
  - no successful paid voucher without successful spend;
  - failed post-spend finalization routes to compensation and recovery marker path.
- Additional tiny safety fixes were applied in this sweep:
  - migration 0056 check constraints made idempotent on rerun;
  - chaos tests extended for spend mismatch, temporary spend failure, and flag-off rollback behavior.

## 2. Branch / Diff State

- Current branch: `feat/rf-slice-3-1-internal-voucher-diagnostics`.
- Latest Slice 4.3 implementation commit: `aa0d76e` (`feat(rf): couple paid voucher claims with points spend`).
- Branch still contains older historical commits vs `origin/main` (expected for long-lived branch).
- Current working tree contains:
  - Slice 4.3 sweep updates:
    - `apps/rf-service/test/request.test.ts`
    - `packages/db/migrations/0056_rf_claim_spend_recovery_v1.sql`
  - unrelated pre-existing dirty/untracked docs/sql files (kept untouched).

Slice 4.3 commit file set (from `git show --name-only aa0d76e`) grouped by area:

- **RF runtime:** `apps/rf-service/src/index.ts`, `apps/rf-service/src/routes/rf.ts`, `apps/rf-service/src/store.ts`
- **Migration/schema:** `packages/db/migrations/0056_rf_claim_spend_recovery_v1.sql`, `packages/db/migrations/meta/_journal.json`, `packages/db/src/schema/rf.ts`
- **Diagnostics/OpenAPI:** `docs/openapi/rf.yaml`, `docs/openapi/openapi.bundle.yaml`
- **Generated SDK/types:** `packages/sdk/src/generated/*`, `packages/types/src/generated/*` (RF internal diagnostics economy additions)
- **Frontend minimal mapping:** `apps/go2asia-pwa-shell/lib/rfOfferClaim.ts`, `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx`
- **Tests:** `apps/rf-service/test/request.test.ts`
- **Docs:** `docs/architecture/domain/rf_slice_4_3_claim_spend_coupling_plan_v1.md`, `docs/architecture/domain/rf_slice_4_3_claim_spend_coupling_implementation_note_v1.md`

Boundary checks:

- No accidental points-contract rewrite beyond RF client usage.
- No public gateway proxy exposure for `/internal/points/spend`.
- No frontend redesign.
- No Connect expansion.

## 3. Migration / Schema Audit

Inspected:

- `packages/db/migrations/0056_rf_claim_spend_recovery_v1.sql`
- `packages/db/migrations/meta/_journal.json`
- `packages/db/src/schema/rf.ts`

Findings:

- Migration is additive-only: new enum + new `rf_voucher_economy_recovery` table + indexes/constraints.
- No destructive DDL.
- No repeatability/lifecycle index rewrites.
- No points ledger schema changes.
- Journal alignment is correct (`0056_rf_claim_spend_recovery_v1` present).
- Recovery table stores deterministic references needed for unresolved compensation triage:
  - `spend_external_id`, `compensation_external_id`, `correlation_id`, `state`, `last_error`.
- Tiny safety fix applied in this sweep:
  - three CHECK constraints in 0056 now guarded with `pg_constraint` existence checks for migration idempotency on rerun.

## 4. Feature Flag Audit

Flag: `RF_ENABLE_PAID_VOUCHER_SPEND`

Verified behavior:

- **Flag disabled**
  - paid claim preserves pre-coupling behavior;
  - no spend call;
  - no VIP gate;
  - paid voucher remains with legacy transitional economy behavior (`economy_status='pending'`).
- **Flag enabled**
  - paid claim requires `vip_spacer`;
  - paid claim calls Points spend;
  - free claim remains unaffected.

Coverage:

- Added explicit test: `preserves pre-coupling paid behavior when feature flag is disabled`.

## 5. Orchestration Audit

Free vouchers:

- no spend call;
- no VIP gate;
- claim semantics unchanged;
- `economy_status='not_required'`.

Paid vouchers (flag enabled):

- VIP gate enforced before spend and before voucher success path.
- Spend externalId deterministic: `rf:voucher-claim-spend:<voucherId>`.
- Compensation externalId deterministic: `rf:voucher-claim-spend-compensation:<voucherId>`.
- On spend success + voucher persist:
  - `economy_status='debited'`;
  - `points_debit_external_id` persisted.
- Success response emitted only after claim finalization consistency.

## 6. Replay / Idempotency Audit

Verified:

- Same RF `Idempotency-Key` replay returns same voucher and does not call spend second time.
- Points replay semantics preserved by externalId contract.
- Context mismatch still returns deterministic RF conflict (`RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`) and does not reuse foreign context.
- Repeatability basis remains deterministic by new voucher instance id generation.

Note:

- Explicit `repeat_after_redeem` + spend-enabled + second paid spend externalId differentiation is logically guaranteed by deterministic `voucherId` formula and policy path; dedicated integration test can be added in next hardening pass.

## 7. Chaos / Failure Matrix

Status matrix:

- **A VIP missing** -> covered, deterministic `RF_VIP_REQUIRED_FOR_PAID_VOUCHER`, no spend, no voucher insert.
- **B Insufficient balance** -> covered, `RF_INSUFFICIENT_POINTS_BALANCE`, no voucher/idempotency insert.
- **C Spend temporary failure** -> **added in this sweep**, covered, `RF_SPEND_TEMPORARILY_UNAVAILABLE`.
- **D Spend idempotency conflict** -> **added in this sweep**, covered, `RF_SPEND_IDEMPOTENCY_CONFLICT`.
- **E Spend success + voucher insert failure** -> covered, compensation attempted, no success response.
- **F Spend success + idempotency insert failure** -> handled in runtime compensation path; dedicated forced test remains optional follow-up.
- **G Compensation success** -> runtime path present; explicit deterministic test can be added in next sweep.
- **H Compensation failure** -> covered, `RF_ECONOMY_RECOVERY_PENDING`, recovery marker persisted.
- **I Retry after recovery pending** -> behavior deterministic by idempotency/externalId model; end-to-end recovery replay scenario remains recommended follow-up.

## 8. Compensation / Recovery Audit

Verified behavior:

- Compensation is attempted immediately when spend succeeded but claim finalization fails.
- Compensation call uses points add contract action `rf_voucher_claim_spend_compensation` with deterministic externalId.
- On compensation failure:
  - recovery marker persisted/upserted in `rf_voucher_economy_recovery`;
  - response is non-success (`RF_ECONOMY_RECOVERY_PENDING`).
- Recovery marker includes enough correlation for manual/automated reconciliation.

## 9. Diagnostics Audit

Verified:

- Diagnostics route remains internal/admin-only.
- Diagnostics include economy/recovery fields from Slice 4.3 runtime.
- No payout/reward computations were added.
- Existing and new anomaly model remains internal.

Observed:

- Core anomaly and masking tests remain green.
- Additional explicit tests for new anomaly codes (`spend_succeeded_claim_failed`, `compensation_pending_too_long`, `debit_failed_visible_voucher`) are recommended next hardening step.

## 10. OpenAPI / SDK Parity

Commands executed:

- `pnpm openapi:bundle`
- `pnpm gen:types`
- `pnpm gen:sdk`
- `pnpm openapi:check`

Result:

- `openapi:check` passed.
- During one combined run, `gen:types` had intermittent filesystem/open error from `orval`; rerun succeeded and parity check passed.
- No breaking public contract drift detected for Slice 4.3 scope.

## 11. Frontend Compatibility

Touched frontend scope remains minimal:

- only error mapping additions for new RF economy errors;
- claim flow UX unchanged;
- no client-side balance authority introduced;
- listing claim path has deterministic fallback on unknown errors.

Targeted full PWA typecheck status:

- `pnpm -C apps/go2asia-pwa-shell typecheck` fails due known pre-existing `.next/types` route typing issues unrelated to Slice 4.3.

## 12. Tests and Commands

Executed:

- `pnpm -C apps/rf-service test` ✅
- `pnpm -C apps/rf-service typecheck` ✅
- `pnpm -C apps/points-service test` ✅
- `pnpm -C apps/points-service typecheck` ✅
- `pnpm -C packages/sdk typecheck` ✅
- `pnpm -C packages/types typecheck` ✅
- `pnpm openapi:check` ✅ (after successful rerun)
- `git diff --check` ⚠️ (global fails on unrelated legacy files)
- scoped `git diff --check` for Slice 4.3 files ✅
- `pnpm -C apps/go2asia-pwa-shell typecheck` ⚠️ unrelated known `.next/types` failures

## 13. Known Risks

- Long-lived branch noise vs `origin/main` remains and must be isolated during PR preparation.
- Some chaos/recovery tests remain desirable:
  - explicit compensation success case assertion;
  - explicit recovery-pending retry scenario;
  - explicit diagnostics anomaly assertions for all new 4.3 anomaly codes.
- Recovery table currently tracks `offer_id` with cascade behavior; acceptable for now, but archival policy should be documented for long-term audit retention.

## 14. Small Fixes Applied

This sweep applied only bounded readiness fixes:

1. `packages/db/migrations/0056_rf_claim_spend_recovery_v1.sql`
   - made CHECK-constraint creation idempotent via `pg_constraint` guards.
2. `apps/rf-service/test/request.test.ts`
   - added chaos/regression tests:
     - spend mismatch -> `RF_SPEND_IDEMPOTENCY_CONFLICT`;
     - temporary spend failure -> `RF_SPEND_TEMPORARILY_UNAVAILABLE`;
     - flag disabled rollback path for paid claims.

No architecture changes and no new product features were introduced.

## 15. Out of Scope Confirmed

Not added:

- premium/NFT/G2A
- rewards/payouts/billing
- Connect expansion
- admin tooling/UI
- async outbox/workflow platform
- frontend redesign
- public spend endpoint
- broad refactor

## 16. Ready-for-PR Verdict

**Verdict: READY_FOR_PR (with bounded follow-up checklist).**

Slice 4.3 runtime is commit-ready and operationally auditable for current scope:

- replay-safe for primary paths;
- compensation/recovery path is deterministic and observable;
- feature-flag rollback is verified;
- OpenAPI/SDK parity is consistent.

## 17. Recommended Next Step

Proceed with PR preparation for Slice 4.3 changeset only (clean staging set), then run a focused follow-up hardening pass for:

- deeper recovery retry scenarios;
- explicit diagnostics anomaly assertions for all new 4.3 anomaly codes;
- optional repeatability+paid spend second-instance integration test.
