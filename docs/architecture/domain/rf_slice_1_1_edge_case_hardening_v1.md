# RF Slice 1.1 - Edge-case Hardening & Canonical Parity (v1)

## 1. Executive Summary

Slice 1.1 completed as a bounded hardening pass on top of Slice 1:

- closed a P0 attribution consistency issue on redeem replay/already-redeemed paths;
- aligned PRO attributed voucher status labeling to canonical-first semantics with legacy fallback;
- reinforced backend/frontend regression coverage for lifecycle and attribution edge-cases;
- kept scope bounded (no repeatability runtime, no economy/rewards, no contract redesign).

All required checks passed.

## 2. P0 Attribution Consistency Fix

Issue:

- `redeemVoucher` paths that read voucher via `getVoucherByIdAndPartner()` (already redeemed, post-update fallback) could return DTOs with defaulted attribution values because attribution columns were not selected in that query.

Fix:

- expanded `getVoucherByIdAndPartner()` projection in `apps/rf-service/src/store.ts` to include full attribution columns:
  - `attribution_version`, `attribution_strategy`, `attribution_status`, `attribution_source`, `claim_source`,
  - `attribution_share_code`, `pro_attributed_user_id`, `pro_link_id`,
  - `attribution_captured_at`, `attribution_confirmed_at`, `attribution_metadata`.

Result:

- repeated redeem / already-redeemed paths now return the same durable attribution payload shape as other voucher reads;
- attribution semantics unchanged (immutable, non-mutating on redeem).

## 3. Canonical Parity Improvements

Updated PRO attributed voucher status helper in `apps/go2asia-pwa-shell/lib/rfProWorkspace.ts`:

- switched `getProAttributedVoucherStatusLabel` to canonical-first using existing lifecycle helper philosophy (`getRfVoucherEffectiveStatus`);
- preserved legacy fallback behavior;
- added minimal mappings for canonical-only statuses (`expired`, `locked`, `unlocked`) without UI redesign.

Updated consumer:

- `apps/go2asia-pwa-shell/components/rf/PRO/PROWorkspace.tsx` now passes full voucher object to the helper.

## 4. Added Regression Tests

### Backend (`apps/rf-service/test/request.test.ts`)

Added/extended coverage for:

- claim replay compatibility with legacy row missing `claim_scope`;
- attribution immutability on idempotent claim replay with different incoming payload;
- redeem edge-cases:
  - `expired -> RF_VOUCHER_EXPIRED`;
  - `locked` non-redeemable;
  - `unlocked` redeemable;
- attribution consistency on:
  - already-redeemed redeem path;
  - redeem idempotency replay path;
- redeem idempotency context mismatch (`RF_REDEEM_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`);
- PRO list canonical parity assertion (`canonicalStatus` consistently present).

### Frontend (`apps/go2asia-pwa-shell/lib`)

- `rfProWorkspace.test.ts`: canonical-first status label assertions for `available/locked/unlocked/expired` + fallback behavior.
- `rfOfferClaim.test.ts`: non-regression checks for claim barrier behavior with `locked` and `unlocked`.

## 5. OpenAPI / SDK Verification

- `docs/openapi/rf.yaml` kept consistent with Slice 1 semantics (`canonicalStatus` primary, legacy compatibility preserved).
- generated artifacts remained in sync (`pnpm openapi:check` passed).
- no stale generated drift detected.
- no API shape change introduced in Slice 1.1.

## 6. Small Cleanup Fixes

- no broad cleanup or refactor introduced;
- only targeted helper parity and test reinforcement were applied.

## 7. Remaining Known Gaps

Not blockers for this bounded pass:

- optional deduplication of RF claim error-message mapping between listing/catalog UI helpers (maintenance-only);
- known unrelated full PWA `.next/types` issues remain out of scope for this pass.

## 8. Ready-for-PR Verdict

Verdict: **Ready from Slice 1.1 hardening perspective.**

- blockers in this bounded scope: **none**;
- lifecycle/attribution semantics preserved;
- API/contract semantics preserved;
- regression matrix strengthened for identified edge-cases.

