# RF Stage 1+2 Slice 1 - Regression Sweep & Follow-up Gap Audit (v1)

## 1. Executive Summary

Slice 1 regression sweep confirms that canonical-first lifecycle alignment is stable in the current branch and that the committed scope remains bounded (no repeatability engine, no economy, no Connect expansion). Targeted backend, contract, SDK/types, and focused PWA regressions pass.

No hard blockers were found for continuing pre-PR hardening. A small set of low-risk follow-up gaps is identified: additional edge-case tests around redeem lifecycle branches, and minor frontend consistency around canonical status usage in PRO visibility helpers.

## 2. Current Branch / Diff State

- Branch: `feat/rf-stage-1-2-slice-1-runtime-alignment`
- Head commit: `ad9dbc1` (`feat(rf): align Slice 1 runtime with canonical lifecycle`)
- Diff vs `main`/`origin/main`: identical file set (single Slice 1 commit on top of main)
- Tracked working tree: clean
- Untracked files present (outside Slice 1 scope):
  - `docs/architecture/rf/rf_pro_stage_5_closure_note_v1.md`
  - `docs/architecture/rf/rf_stage_5_0d_attribution_operational_review_v1.md`
  - `docs/audits/connect-referrals-data-source-audit-v1.md`
  - `docs/audits/connect-referrals-staging-cleanup-plan-v1.md`
  - `docs/economy/**`
- Generated drift: not detected (`pnpm openapi:check` passed)
- Whitespace/conflict drift: not detected (`git diff --check` passed)

Change groups from `main...HEAD`:

- Backend:
  - `apps/rf-service/src/store.ts`
- Tests:
  - `apps/rf-service/test/request.test.ts`
  - `apps/go2asia-pwa-shell/lib/rfVoucherLifecycle.test.ts`
  - `apps/go2asia-pwa-shell/lib/rfOfferClaim.test.ts`
- Frontend helpers/UI:
  - `apps/go2asia-pwa-shell/lib/rfVoucherLifecycle.ts`
  - `apps/go2asia-pwa-shell/lib/rfOfferClaim.ts`
  - `apps/go2asia-pwa-shell/lib/connectRfProjection.ts`
  - `apps/go2asia-pwa-shell/components/rf/Vouchers/RfMyVouchersView.tsx`
  - `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx`
- OpenAPI:
  - `docs/openapi/rf.yaml`
  - `docs/openapi/openapi.bundle.yaml`
- Generated SDK/types:
  - `packages/sdk/src/generated/rfListProAttributedVouchersParams.ts`
  - `packages/sdk/src/generated/rfVoucher.ts`
  - `packages/sdk/src/generated/rfVoucherSummary.ts`
  - `packages/types/src/generated/rfListProAttributedVouchersParams.ts`
  - `packages/types/src/generated/rfVoucher.ts`
  - `packages/types/src/generated/rfVoucherSummary.ts`
- Docs:
  - `docs/architecture/domain/rf_stage_1_2_lifecycle_repeatability_redemption_implementation_plan_v1.md`

## 3. Regression Commands and Results

Executed commands:

- `pnpm -C apps/rf-service test` -> pass (`51/51`)
- `pnpm -C apps/rf-service typecheck` -> pass
- `pnpm -C packages/sdk typecheck` -> pass
- `pnpm -C packages/types typecheck` -> pass
- `pnpm openapi:check` -> pass
- `pnpm vitest run lib/rfVoucherLifecycle.test.ts lib/rfOfferClaim.test.ts lib/connectRfProjection.test.ts lib/rfProAttribution.test.ts lib/rfProWorkspace.test.ts` (PWA) -> pass (`33/33`)
- `pnpm eslint ...` targeted RF files (PWA) -> pass
- `git diff --check` -> pass

Notes:

- Full PWA typecheck was intentionally not expanded in this sweep (targeted pass only). Known unrelated `.next/types` issues remain out of scope for this audit.

## 4. Lifecycle Regression Findings

Claim path checks:

- Partner claim writes:
  - `status = 'claimed'`
  - `canonical_status = 'available'`
  - `contract_version = 1`
- Listing claim writes equivalent lifecycle pair and `contract_version = 1`.
- Existing-claim detection is canonical-first with legacy fallback (`canonical_status` set membership, fallback to legacy `status` only if canonical missing).
- Partner/listing insert conflict predicates use canonical partial uniqueness.
- Claim idempotency replay is stable.
- Context mismatch is enforced for both partner and listing claim replays.
- Legacy idempotency replay rows without `claim_scope` are handled compatibly (`null` treated as `partner`).

Conclusion: lifecycle claim alignment objective is met for Slice 1.

## 5. Redemption Regression Findings

Redeem path checks:

- Redeem decisioning is canonical-first.
- Redeemable states: `available`, `unlocked`.
- Non-redeemable by design in Slice 1: `locked`.
- Terminal handling:
  - `redeemed` -> deterministic replay (`applied: false`)
  - `cancelled` -> conflict
  - `expired` -> `RF_VOUCHER_EXPIRED`
- Successful redeem updates:
  - legacy `status = 'redeemed'`
  - canonical `canonical_status = 'redeemed'`
  - timestamps/status actor fields
  - redemption fact in `rf_voucher_redemption`
- Repeated redeem remains deterministic and idempotent.

Conclusion: redemption consistency objective is met for Slice 1.

## 6. Summary / Projection Findings

- `getMyVoucherSummary` is canonical-first:
  - active: `available | locked | unlocked`
  - used: `redeemed`
  - cancelled: `cancelled`
  - expired: `expired`
- Legacy fallback is preserved via canonical coalesce mapping.
- `expiredVouchers` is now included in summary contract and tests.

Connect/frontend projection:

- Shared lifecycle helper is integrated into claim/projection consumers.
- Connect projection itself remains stable on targeted tests.

## 7. Attribution Regression Findings

Verified with backend tests and helper tests:

- Valid attribution persists on claim.
- Invalid attribution remains non-blocking for claim.
- First successful claim attribution immutability remains preserved.
- Redeem does not mutate attribution fact.
- PRO attributed list still includes redeemed vouchers when attribution is confirmed.
- No new payout/economy semantics introduced by this sweep scope.

## 8. Frontend Compatibility Findings

Good:

- `rfVoucherLifecycle.ts` is used in core RF claim/projection/my-vouchers paths.
- Listing voucher flow and RF catalog flow both use canonical-aware existing-voucher detection.
- My Vouchers status labels now rely on lifecycle helper.

Gaps:

- PRO attributed workspace rendering still labels by legacy `status` helper path, while DTO also carries `canonicalStatus`. Not currently breaking, but suboptimal for canonical-first consistency.
- Minor duplication of error mapping logic between claim surfaces (low-risk maintenance issue).

## 9. OpenAPI / SDK Consistency

- `RfVoucherSummary.expiredVouchers` present in OpenAPI and generated SDK/types.
- `canonicalStatus` documented as primary lifecycle field.
- Legacy `status` documented as compatibility layer.
- Generated artifacts are in sync (`openapi:check` pass).
- No stale generated file detected in current branch state.
- Thin SDK remains type-compatible with generated contract.

## 10. Blockers

No hard blockers identified in this regression sweep.

## 11. Small Fixes Recommended Before PR

1. Add focused backend tests for currently implicit branches:
   - explicit `RF_VOUCHER_EXPIRED` path assertion
   - explicit `locked` non-redeemable and `unlocked` redeemable assertions
   - explicit redeem idempotency key context mismatch branch
2. Align PRO attributed voucher status labeling with canonical-first helper usage.
3. Optionally deduplicate claim error mapping utility across RF listing/catalog claim UI surfaces.

These are bounded, low-risk, and do not expand architecture/scope.

## 12. Follow-up Tasks After PR

- Repeatability track (separate stage):
  - policy fielding and runtime design (`once_per_scope`, `repeat_after_redeem`)
- Internal diagnostics/read-only debug for attribution and lifecycle edge cases
- Merchant attribution visibility track (if prioritized)
- User attribution badge track (if prioritized)
- Connect projection expansion (separate bounded stage)
- Economy/rewards design (strictly after lifecycle/redeem/repeatability baseline confidence)

## 13. Known Unrelated Issues

- Known unrelated full PWA typecheck issues in generated `.next/types` dynamic route typings were not part of this pass and remain out of scope.

## 14. Recommended Next Bounded Task

Run a small pre-PR hardening patch titled:

`RF Slice 1.1 - lifecycle edge-case test reinforcement and PRO canonical status label parity`

Scope:

- tests-only reinforcement for redeem edge cases and idempotency mismatch branch
- minimal PRO status label helper parity update (canonical-first, legacy fallback)
- no schema changes, no feature expansion, no repeatability/economy/connect growth

