# RF Slice 6.6 - Tiny Feature-flagged Preview Badge v1

## 1. Purpose

Slice 6.6 adds the first tiny user-facing informational badge for entitlement preview in RF UI.

The purpose is to validate the preview pipeline visually while keeping the current claim/redeem behavior unchanged.

This slice includes:
- a small read-only preview badge component in PWA;
- feature-flagged rendering on selected RF offer surfaces;
- safe copy rendering from preview state;
- targeted tests for state mapping and disabled behavior.

## 2. Non-goals

Not included:
- premium claim enforcement;
- claim blocking;
- claim button disable/enable decisions from preview;
- claim/redeem runtime changes;
- RF service runtime changes;
- NFT/Wallet/G2A integration;
- points/economy runtime changes;
- SDK/OpenAPI edits;
- Connect wallet UX changes;
- broad UI redesign.

## 3. UI Placement

Badge is rendered in two existing card surfaces, outside claim handlers:

1. `apps/go2asia-pwa-shell/components/rf/Offers/RfOffersCatalog.tsx`
- inside `OfferCard`;
- in the chips row near visibility/summary chips;
- only for premium-like catalog entries (`visibility === 'pro_only'`).

2. `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx`
- near listing offer type/status block;
- only for listing offers with `type === 'premium'`.

`ClaimRfOfferButton` is not modified.

## 4. Feature Flags

Client gate:

```text
NEXT_PUBLIC_RF_ENABLE_ENTITLEMENT_PREVIEW
```

Behavior when disabled:
- badge renders nothing;
- no preview network call is triggered;
- no claim behavior changes.

Server gate remains:

```text
RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY
```

Client flag only controls UI/network participation from PWA.

## 5. Badge States

Allowed badge rendering:
- `available` -> `Премиум-доступ доступен`;
- `requires_condition` -> `Требуется условие`;
- `checking_or_temporarily_unavailable` -> `Проверка доступа выполняется`;
- `unavailable` -> `Премиум-доступ недоступен`.

Hidden states:
- `not_enabled` -> render `null`;
- `ordinary_no_preview` -> render `null`.

## 6. Safe Copy

Badge copy is short and informational-only.

Forbidden vocabulary is not used:
- wallet;
- chain;
- tx;
- NFT contract;
- balance;
- payout;
- reward;
- debit;
- compensation;
- recovery;
- adapter;
- raw source;
- audit trace.

Copy does not claim:
- guaranteed claim success;
- runtime entitlement enforcement;
- payment confirmation;
- token ownership proof.

## 7. Network Strategy

Slice 6.6 uses a bounded per-card preview strategy with strict query gating:
- query runs only when client flag is enabled;
- query runs only for premium-like offers;
- query runs only for authenticated user context;
- query key is scoped by offer/listing/user;
- `staleTime` is short and `retry` is disabled (`retry: 0`);
- loading/failure falls back to safe temporary informational state.

To reduce N+1 exposure, ordinary offers are skipped entirely.

## 8. Why Badge Is Not Enforcement

Badge remains non-enforcement because:
- it is UI-only informational state;
- it does not call claim/redeem handlers;
- it does not change claim payload;
- it does not alter idempotency/repeatability;
- it does not disable/enable claim buttons;
- helper output keeps `informationalOnly` and `claimBehaviorUnchanged`.

## 9. Surfaces Touched

Added:
- `apps/go2asia-pwa-shell/components/rf/Shared/RfEntitlementPreviewBadge.tsx`
- `apps/go2asia-pwa-shell/components/rf/Shared/RfEntitlementPreviewBadge.test.ts`

Updated:
- `apps/go2asia-pwa-shell/components/rf/Offers/RfOffersCatalog.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx`
- `apps/go2asia-pwa-shell/lib/rfEntitlementPreview.test.ts`

## 10. Risks

Remaining risks:
- per-card premium preview calls can still scale poorly on very large premium-heavy pages;
- users can over-interpret badge as final claim permission;
- proxy remains mock-backed preview, not production entitlement truth.

Guardrails:
- keep badge outside claim button/state logic;
- keep default-off flag posture;
- keep copy informational and short.

## 11. Future Migration Path

Recommended next steps:
1. Add optional batched preview endpoint/aggregation for premium cards to reduce request count.
2. Add lightweight telemetry buckets for badge states (`available`/`requires_condition`/temporary/unavailable).
3. Expand premium detection to explicit server-provided premium marker when contract is finalized.
4. Revisit richer UI hinting only after preview semantics are stable and still non-enforcement.
