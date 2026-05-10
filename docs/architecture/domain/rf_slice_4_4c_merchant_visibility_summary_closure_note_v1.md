# RF Slice 4.4C Merchant Visibility Summary Closure Note v1

## 1. Status

Slice `4.4C-2` (implementation) and Slice `4.4C-3` (validation) are complete.

Final validation status: **PASS**.

This stage delivers a bounded merchant read-only visibility layer for RF voucher activity and does not introduce financial semantics or runtime behavior changes.

## 2. Scope Delivered

### 4.4C-2 Implementation

- Added owner-scoped aggregate-only endpoint:
  - `GET /v1/rf/business/partners/{partnerId}/voucher-activity/summary`
- Added compact merchant UI block on:
  - `/rf/merchant/vouchers`
- Preserved `CodeRedeem` as the central operational action.
- Added backend and frontend tests for summary behavior and copy safety.

### 4.4C-3 Validation

- Confirmed staging readiness for gateway and rf-service health/readiness.
- Confirmed protected-route behavior for unauthenticated requests.
- Confirmed staging UI behavior and semantics by manual validation:
  - summary block is visible and naturally placed under redeem flow,
  - copy is operational/read-only,
  - no user-level or sensitive identifiers shown.

## 3. Endpoint Contract

Path:

- `GET /v1/rf/business/partners/{partnerId}/voucher-activity/summary`

Response shape:

- `partnerId`
- `scope` = `partner_voucher_activity_summary`
- `generatedAt`
- `summary`:
  - `total`
  - `active`
  - `redeemed`
  - `expiredOrUnavailable`
  - `offersWithActivity`
  - `proAttributed`
  - `lastActivityAt`

Read-only and aggregate-only by design.

## 4. Counting Semantics

Summary is computed from RF voucher facts with canonical lifecycle precedence.

- `effective_status`:
  - prefer `canonical_status`
  - fallback legacy mapping: `claimed -> available`, `redeemed -> redeemed`, `cancelled -> cancelled`
- `total`: all vouchers for the partner
- `active`: `available | locked | unlocked`
- `redeemed`: `redeemed`
- `expiredOrUnavailable`: `expired | cancelled`
- `offersWithActivity`: distinct `offer_id` count
- `proAttributed`: vouchers with confirmed attribution marker
- `lastActivityAt`: max of `status_changed_at`, `redeemed_at`, `claimed_at`, `updated_at`, `created_at`

## 5. Security and Privacy Guarantees

The summary endpoint does **not** expose:

- voucher code
- `issuedToUserId`
- user email/name
- `shareCode`
- `proUserId`
- attribution metadata
- points debit external ids
- raw transaction identifiers
- diagnostics/internal payload fields

This stage is intentionally safe for merchant visibility and not a user-level reporting surface.

## 6. UX Result

Merchant vouchers page now contains:

- `CodeRedeem` (unchanged role)
- `RF voucher visibility` summary block
- neutral boundary copy:
  - operational/read-only framing
  - no rewards/earnings/payout language

Operationally useful metrics are visible without turning merchant UI into analytics/finance tooling.

## 7. Explicit Non-Goals Preserved

Not implemented in this stage:

- voucher list/history/pagination
- per-user rows or identity exposure
- financial dashboard semantics
- rewards, commissions, payouts, settlement
- partner compensation
- claim/redeem runtime changes
- economy runtime changes
- PRO attribution runtime changes
- NFT/Totem/G2A behavior

## 8. Regression Outcome

No runtime regressions introduced in core RF merchant flows:

- merchant vouchers page remains functional
- `CodeRedeem` remains available
- merchant workspace and offer/pro-link surfaces remain intact

## 9. Final Recommendation

Proceed to next bounded step only after keeping the same guardrails:

- RF remains source of truth,
- merchant visibility remains read-only and aggregate-first,
- richer list/history, if needed, should be a separate explicitly scoped slice.
