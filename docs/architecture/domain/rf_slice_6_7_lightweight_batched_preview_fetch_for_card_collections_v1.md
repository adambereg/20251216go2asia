# RF Slice 6.7 - Lightweight Batched Preview Fetch for Card Collections v1

## 1. Purpose

Slice 6.7 reduces the N+1 preview request risk introduced by tiny per-card entitlement preview badges.

The purpose is to keep the Slice 6.6 read-only badge UX while moving RF card collections to one lightweight batch preview request per collection.

This slice includes:
- a gateway-safe batch preview proxy;
- PWA batch helper;
- collection-level preview queries for RF catalog and listing voucher cards;
- targeted tests for batch behavior and leak prevention.

## 2. Non-goals

Not included:
- premium claim enforcement;
- claim blocking;
- claim button disable/enable logic from preview;
- claim/redeem runtime changes;
- NFT ownership verification;
- blockchain or TON runtime;
- Wallet/G2A integration;
- Points spend changes;
- DB migrations;
- generated SDK edits;
- public OpenAPI expansion;
- production entitlement adapters;
- broad UI redesign.

## 3. Current N+1 Risk

Slice 6.6 added `RfEntitlementPreviewBadge` with a per-card `useQuery`.

That was safe for a tiny validation slice, but premium-heavy collections could trigger one preview request for every mounted premium-like card.

The risk is limited to preview traffic, not claim behavior, but it can still affect UX and service load.

## 4. Chosen Batching Strategy

Chosen strategy: server-side batch preview proxy.

Route:

```text
POST /v1/rf/entitlement/preview/batch
```

Why this strategy:
- the existing single preview proxy is already gateway-safe and read-only;
- batch route can reuse the same safe DTO mapping;
- it reduces browser-to-service requests from N to 1 per collection;
- it remains behind the same server feature flag;
- it does not require SDK/OpenAPI generation.

Client-side batching only remains a future fallback if the server route needs to be removed.

## 5. Batch Request / Response Shape

Request:

```text
{
  "items": [
    {
      "clientKey": "offer_1",
      "requestId": "rf-offer-preview:offer_1:user_1",
      "resource": { "...": "safe preview resource" },
      "context": { "...": "safe preview context" },
      "requestedSources": ["role", "pro_invite"]
    }
  ]
}
```

Rules:
- `action` is implied as `claim`;
- `evaluationMode` is implied as `claim_preview`;
- subject is always derived from gateway principal;
- `includeAuditTrace` is forced off;
- max batch size is `25`;
- invalid items are skipped safely;
- empty or oversized batches are rejected.

Response:

```text
{
  "items": [
    {
      "clientKey": "offer_1",
      "preview": {
        "state": "available",
        "label": "Премиум-доступ доступен",
        "caption": "Это информационный preview. Получение ваучера работает как раньше.",
        "informationalOnly": true,
        "claimBehaviorUnchanged": true
      }
    }
  ]
}
```

The preview object is the same filtered public DTO from Slice 6.5.

## 6. PWA Integration

Touched surfaces:

```text
apps/go2asia-pwa-shell/components/rf/Offers/RfOffersCatalog.tsx
apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx
```

Both surfaces now:
- compute premium-like cards at collection level;
- build preview requests through existing helper builders;
- issue one batch query per collection;
- pass `previewState` into `RfEntitlementPreviewBadge`;
- disable badge fallback fetch for collection cards.

The badge still supports single fetch fallback for non-collection future usage, but collection surfaces no longer rely on per-card queries.

## 7. Network Strategy

Rules:
- no preview calls when `NEXT_PUBLIC_RF_ENABLE_ENTITLEMENT_PREVIEW` is disabled;
- no preview calls without authenticated user id;
- no preview calls for ordinary cards;
- one batch query per collection where possible;
- `staleTime` is short (`30s`);
- `retry` is disabled (`0`);
- missing/partial item responses become safe temporary preview state;
- render is never blocked by preview.

Server flag:

```text
RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY
```

The server flag remains the route availability gate for both single and batch preview proxy routes.

## 8. Safe Copy / Boundary

Slice 6.7 does not change badge copy semantics.

Forbidden fields remain hidden:
- `auditTraceId`;
- `requestWindowId`;
- `adapterId`;
- `rawFacts`;
- `evaluatedSources`;
- `partialResults`;
- Wallet/NFT/G2A facts;
- tx / chain / balance / payout data.

Preview remains:
- `informationalOnly: true`;
- `claimBehaviorUnchanged: true`.

## 9. Why Still Not Enforcement

Batch preview is not enforcement because:
- it uses the same `claim_preview` mode;
- it returns safe informational DTOs only;
- it does not call claim/redeem handlers;
- it does not write voucher state;
- it does not change claim payloads;
- it does not disable or enable claim buttons;
- it does not alter idempotency, repeatability, recovery, or compensation.

## 10. Tests / Acceptance

Acceptance coverage:
- disabled batch proxy returns disabled response without DB initialization;
- unauthenticated batch requests are rejected;
- authenticated batch requests return multiple safe preview items;
- ordinary items map to `ordinary_no_preview`;
- max batch size is enforced;
- invalid items are skipped safely;
- degraded items map to temporary preview state;
- PWA batch helper skips disabled flag;
- PWA batch helper returns map by `clientKey`;
- partial/missing batch items map safely;
- unsafe/internal fields do not leak into UI state.

## 11. Risks

Remaining risks:
- batch route is still backed by mock harness, not production entitlement truth;
- max batch size means very large collections may need chunking later;
- users can still over-read badge state as claim permission;
- cache keys must stay scoped by user and collection membership.

Guardrails:
- keep batch route default-off through existing preview proxy flag;
- keep preview state outside claim state;
- keep claim button logic unchanged.

## 12. Future Migration Path

Recommended next steps:
1. Add chunking if premium collections can exceed 25 items.
2. Add preview bucket telemetry without exposing internal adapter details.
3. Replace mock-backed evaluation with production read adapters one source at a time.
4. Add an explicit server-provided premium marker for catalog items.
5. Consider richer UI explanations only after preview semantics are stable and still non-enforcement.
