# RF Slice 3.2 — Diagnostics Regression & First Manual QA Scenarios v1

Status: regression and operational review  
Scope type: QA/regression/docs-only  
Runtime feature expansion: none

## 1. Executive Summary

Slice 3.1 internal diagnostics endpoint is stable in regression, useful for support/QA triage, and remains within the planned boundary:

- internal-only route is active and auth-gated
- endpoint is read-only (no claim/redeem mutation side effects)
- privacy masking/fingerprinting works for core sensitive fields
- anomaly flags are operationally useful for first-line debugging

No feature expansion was performed in Slice 3.2.

## 2. Branch / Diff State

- Current branch: `feat/rf-slice-3-1-internal-voucher-diagnostics`
- Upstream: `origin/feat/rf-slice-3-1-internal-voucher-diagnostics`
- Slice 3.1 commit present in branch: `55a7ab8`
- Working tree at start/end of this pass: clean (no accidental dirty/untracked files)
- Diff vs `origin/main` shows expected RF slices and generated contract/type artifacts already in branch history.

## 3. Regression Commands and Results

Executed:

- `pnpm -C apps/rf-service test` — passed (`65/65`)
- `pnpm -C apps/rf-service typecheck` — passed
- `pnpm -C packages/sdk typecheck` — passed
- `pnpm -C packages/types typecheck` — passed
- `pnpm openapi:check` — passed (`OpenAPI drift check passed`)
- `git diff --check` — passed

Frontend RF/PWA tests were not required in this pass because no frontend files changed.

## 4. Endpoint Regression Findings

Endpoint under review:
- `GET /v1/rf/internal/vouchers/{voucherId}/diagnostics`

Auth matrix verified:

- no auth -> `401`
- non-admin principal -> `403`
- admin/internal principal -> `200`
- missing voucher -> `404`

Read-only guarantee verified:

- endpoint path only calls read helpers and SELECT queries
- no inserts/updates/deletes from diagnostics flow
- no claim/redeem runtime invocation from diagnostics path
- no idempotency row creation
- no attribution re-resolution
- no lifecycle/guard mutation

## 5. Privacy / Masking Findings

Verified in code and tests:

- raw voucher code is not returned; `codeMasked` is returned
- raw share code is not returned; `shareCodeMasked` is returned
- raw idempotency keys are not returned; fingerprint is returned
- raw attribution metadata values are not returned; only `metadataKeys` + `attributionRejectedReason`
- correlation id is masked (`correlationIdMasked`)
- no payout/reward/economy fields in response

Observed boundary note:

- internal diagnostics intentionally exposes internal identifiers (`issuedToUserId`, `proUserId`, actor/user ids) for support/admin use. This is acceptable under internal-only scope but should remain explicitly non-public.

## 6. Contract / OpenAPI Findings

- Internal diagnostics uses dedicated internal DTO schemas (`RfInternalVoucherDiagnostics*`)
- Public RF product DTOs were not extended with diagnostics-only fields in this pass
- OpenAPI path is explicitly documented as internal/admin and not for public/PRO/merchant UI
- Generated OpenAPI/types/sdk parity is consistent (`openapi:check` green)

## 7. Manual QA Scenarios

For each scenario: setup -> action -> expected response/anomalies/privacy/read-only behavior.

### Scenario A — Claimed active voucher

- Setup: voucher with `canonicalStatus=available`, no redemption row, no guard.
- Action: call internal diagnostics endpoint by admin with voucher id.
- Expected diagnostics:
  - lifecycle fields present (`status`, `canonicalStatus`, timestamps)
  - `repeatPolicySnapshot` present
  - `issueSequence` present
  - no critical anomaly required
- Privacy:
  - masked code/fingerprinted idempotency only
  - no raw metadata leak
- Read-only:
  - no DB writes

### Scenario B — Redeemed once_per_scope voucher

- Setup: `canonicalStatus=redeemed`, succeeded redemption row exists, guard exists.
- Action: call diagnostics endpoint.
- Expected diagnostics:
  - redemption summary populated
  - guard populated (`exists=true`)
  - `repeatPolicySnapshot=once_per_scope`
  - no critical anomaly required
- Privacy/read-only: same as Scenario A.

### Scenario C — Redeemed repeat_after_redeem voucher history

- Setup: first instance redeemed, second instance created for same scope.
- Action: inspect both voucher ids with diagnostics endpoint.
- Expected diagnostics:
  - issue sequence monotonic across instances
  - old instance immutable
  - no `unexpected_repeat_after_redeem_guard` for normal valid history
  - instance-level history understandable by QA/support
- Privacy/read-only: unchanged.

### Scenario D — Rejected attribution

- Setup: `attributionStatus=rejected`.
- Action: diagnostics call.
- Expected diagnostics:
  - anomaly includes `rejected_attribution_present` (`info`/`warning` acceptable)
  - `attributionRejectedReason` visible if present
  - raw metadata values not exposed
- Read-only: no writes.

### Scenario E — Listing-scoped voucher

- Setup: `claimScope=listing`, valid `listingId`, active mapping exists.
- Action: diagnostics call.
- Expected diagnostics:
  - listing context + listing mapping visible
  - no `listing_scope_missing_listing_id`
  - no `listing_mapping_missing_or_inactive` in healthy fixture
- Privacy/read-only: unchanged.

### Scenario F — Broken/anomalous fixture

- Setup: intentionally inconsistent fixture (test DB state):
  - redeemed voucher without redemption row
  - once_per_scope redeemed without guard
  - confirmed attribution without pro link
- Action: diagnostics call.
- Expected diagnostics:
  - anomaly includes:
    - `voucher_redeemed_without_redemption_row`
    - `once_per_scope_redeemed_without_guard`
    - `confirmed_attribution_without_pro_link`
  - no sensitive raw field leakage
  - no mutation behavior

## 8. Anomaly Flag Review

Useful flags for first-line support/QA:

- `voucher_redeemed_without_redemption_row`
- `redemption_row_without_redeemed_status`
- `once_per_scope_redeemed_without_guard`
- `confirmed_attribution_without_pro_link`
- `listing_scope_missing_listing_id`
- `guard_points_to_missing_voucher`
- `idempotency_points_to_missing_voucher`

Potentially noisy/ambiguous (context-dependent):

- `active_duplicate_possible` (can be informational during historical transitions)
- `repeat_sequence_gap` (useful mostly with missing relations/backfills)

Severity shape is generally workable; no mandatory severity remap identified in this pass.

## 9. Operational Usefulness Assessment

Current endpoint is sufficient for immediate needs:

- support can inspect single-voucher lifecycle/redeem/guard/attribution/idempotency in one read model
- QA can validate regression and edge anomalies without DB manual joins
- admin gets clear anomaly evidence for triage

What still cannot be answered fully:

- hypothetical pre-claim decisioning for not-yet-created voucher contexts (dry-run)
- dedicated redeem decision simulation before attempt
- high-volume operator workflows without an internal UI layer

## 10. Bugs or Small Fixes Found

Implemented small fixes in this Slice 3.2 pass:
- none

Recorded minor follow-up notes (non-blocking):

- masking policy for very short values can be tightened in future hardening pass if needed
- optional additional test for admin authorization through `roles[]`-only claim path may improve confidence

No runtime claim/redeem behavior changes were required or performed.

## 11. Recommended Next Diagnostics Step

Recommended bounded next step:

- keep backend-only diagnostics approach
- prioritize a small hardening pass for diagnostics quality (test matrix + masking policy clarity) before adding new endpoint surfaces

If a new capability is required afterward, next candidate should be:
- internal claim dry-run diagnostics (read-only, no writes), as a separate bounded slice

Not recommended yet:
- redemption diagnostics endpoint
- internal admin UI

## 12. Non-goals Confirmed

Confirmed not done in Slice 3.2:

- no new diagnostics endpoints
- no claim dry-run implementation
- no redemption diagnostics endpoint implementation
- no frontend/admin UI
- no correction/mutation tools
- no economy/rewards/payouts/Points/G2A/NFT
- no Connect expansion
- no public/merchant/PRO diagnostics exposure
- no runtime claim/redeem behavior changes

## 13. Open Questions

- Should internal diagnostics include stricter masking for very short token-like values?
- Is severity calibration needed for `active_duplicate_possible` in operator workflows?
- When claim dry-run is planned, should it share anomaly vocabulary with voucher diagnostics for consistency?
- Is a separate internal auth mode (beyond admin role via gateway claims) required before scaling support usage?
