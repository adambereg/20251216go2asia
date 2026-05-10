# RF Slice 4.2 — Commit Readiness & Regression Sweep v1

## 1. Executive Summary

Slice 4.2 verified as a bounded points-contract slice: internal spend endpoint is implemented, OpenAPI/generated artifacts are consistent, points-service regression is green, and no RF runtime coupling or public gateway exposure was introduced.

## 2. Branch / Diff State

- Current branch: `feat/rf-slice-3-1-internal-voucher-diagnostics`
- Slice 4.2 implementation commit: `f502163`
- `git show --name-only --pretty=format: f502163` confirms commit-scoped files are only:
  - points-service runtime/tests
  - points OpenAPI + bundled spec
  - generated SDK/types artifacts
  - Slice 4.2 planning doc
- `git diff --name-only f502163^..f502163 -- "apps/rf-service/**" "apps/api-gateway/**" "apps/go2asia-pwa-shell/**"` returns empty output.
- Branch-level diff vs `origin/main` is large and contains historical files unrelated to Slice 4.2.
- Working tree still contains unrelated modified/untracked docs and migration files outside Slice 4.2 scope.

Grouped state (for readiness context):

- points-service runtime: `apps/points-service/src/index.ts`
- points-service tests: `apps/points-service/test/request.test.ts`, `apps/points-service/test/idempotency_external_id.test.ts`
- OpenAPI: `docs/openapi/points.yaml`, `docs/openapi/openapi.bundle.yaml`
- generated SDK/types: `packages/sdk/src/generated/*`, `packages/types/src/generated/*`, `sdk/go2AsiaPlatformAPI.ts`, `types/go2AsiaPlatformAPI.ts`
- docs: `docs/architecture/domain/rf_slice_4_2_points_contract_enablement_plan_v1.md`
- unrelated files present in workspace: legacy `rf-asia-*` docs, audits, and `packages/db/migrations/0052_rf_partner_item_catalog_v1.sql`

## 3. Points Spend Contract Audit

Checked `apps/points-service/src/index.ts` and tests:

- `POST /internal/points/spend` exists.
- Auth is service-to-service only via `Authorization: Bearer` (`requireServiceAuth`).
- Validation present:
  - `userId` required, non-empty.
  - `amount` required, integer, `>= 1`.
  - negative/fractional values rejected with 400.
  - `action` required and restricted to spend allowlist (`rf_voucher_claim_spend`).
  - `externalId` required, non-empty.
  - `metadata` must be object if provided.
- Ledger semantics:
  - request amount is positive spend quantity.
  - persisted transaction amount is negative (`ledgerAmount = -amount`).
  - `/internal/points/add` remains separate and not overloaded for spend.

## 4. Idempotency / Replay Findings

- Idempotency SSOT is `externalId`.
- First successful spend:
  - one transaction,
  - `applied=true`,
  - `idempotentReplay=false`.
- Same `externalId` + same payload:
  - no second write,
  - `applied=false`,
  - `idempotentReplay=true`,
  - stable transaction id.
- Same `externalId` + mismatched payload:
  - deterministic `409 REPLAY_PAYLOAD_MISMATCH`.
- Sign mapping is handled correctly:
  - request `amount=100` is compared as `-100` against stored ledger amount.

## 5. Insufficient Balance Findings

- Deterministic failure code: `409 INSUFFICIENT_POINTS_BALANCE`.
- No transaction inserted when funds are insufficient.
- No balance mutation on insufficient funds.
- Atomic guard implemented in SQL path (`balance >= spendAmount` gate within same execution flow).
- No path identified that would intentionally permit negative balance in spend flow.

## 6. Wallet Projection Findings

- Spend transactions (`rf_voucher_claim_spend`, negative amount) reduce available points.
- Locked/network buckets remain unaffected by spend action.
- `/v1/points/balance` remains consistent with `user_balances`.
- `/v1/wallet/summary` projection remains consistent with spend semantics.
- `/v1/points/transactions` includes negative spend rows.

## 7. Boundary Audit

Confirmed:

- No RF runtime changes in Slice 4.2 commit file set.
- No RF claim calls to points-service in `apps/rf-service/src/store.ts` and `apps/rf-service/src/routes/rf.ts`.
- No VIP enforcement added in RF runtime for this slice.
- No RF voucher debit orchestration / compensation runtime introduced.
- No frontend file changes in Slice 4.2 commit.
- No Connect expansion.
- No public API Gateway route/proxy for `/internal/points/spend`.
  - `apps/api-gateway/src/index.ts` has no mapping for this internal endpoint.

## 8. OpenAPI / SDK Parity

Executed and verified:

- `pnpm openapi:bundle`
- `pnpm gen:types`
- `pnpm gen:sdk`
- `pnpm openapi:check`

Result:

- OpenAPI drift check passed.
- Spend schemas present and generated.
- `PointsAction` includes:
  - `rf_voucher_claim_spend`
  - `rf_voucher_claim_spend_compensation`
- API contract remains internal for spend endpoint (not user-facing gateway route).

## 9. Tests and Commands

Executed:

- `pnpm -C apps/points-service test` — PASS
- `pnpm -C apps/points-service typecheck` — PASS
- `pnpm -C packages/sdk typecheck` — PASS
- `pnpm -C packages/types typecheck` — PASS
- `git diff --check` — FAIL (unrelated pre-existing whitespace issues in non-slice files)
- `git diff --check -- [Slice 4.2 file set]` — PASS

`apps/api-gateway` and `apps/rf-service` tests were not run because no Slice 4.2 code changes touched those runtime paths.

## 10. Known Risks

- Global repository cleanliness remains noisy due unrelated modified/untracked files outside Slice 4.2.
- `git diff --check` global signal is not currently usable as a slice-only quality gate without scope filtering.

## 11. Small Fixes Applied

- No new feature fixes were introduced during this sweep.
- Regression sweep performed as verification-only pass.

## 12. Out of Scope Confirmed

Not implemented in this sweep (and still out of scope for Slice 4.2):

- RF claim integration with spend.
- VIP gate in RF runtime.
- Voucher debit orchestration in RF.
- Compensation runtime in RF.
- Frontend changes.
- Premium/NFT/G2A, rewards/payouts/billing, Connect expansion.

## 13. Ready-for-PR Verdict

Slice 4.2 is ready for PR as a standalone points-contract enablement slice.

Readiness conditions met:

- contract behavior validated,
- boundaries preserved,
- OpenAPI/generated parity green,
- points-service regression green.

Global `git diff --check` failure is unrelated to Slice 4.2 implementation.

## 14. Recommended Next Step

Proceed to RF Slice 4.3 as a separate bounded implementation:

- RF claim-to-spend coupling,
- VIP gate decision enforcement in RF boundary,
- deterministic debit orchestration + compensation flow,
- keep the same strict idempotency discipline already validated in 4.2.

---

Additional note on unrelated whitespace issue:

- `packages/db/migrations/0052_rf_partner_item_catalog_v1.sql` appears in global `git diff --check` output and is unrelated to Slice 4.2 file set.
- This issue should be handled in a separate cleanup scope and not mixed into Slice 4.2 readiness decision.
