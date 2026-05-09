# RF Slice 6.5 - Server-side Preview Proxy / Gateway-safe Preview Surface v1

## 1. Purpose

Slice 6.5 adds a gateway-safe read-only preview surface for entitlement claim preview.

The purpose is to stop the PWA helper from targeting the internal/admin-only mock endpoint directly and introduce a filtered user-facing boundary that can be consumed by authenticated users.

This slice includes:
- RF service preview proxy endpoint;
- authenticated user access through gateway auth;
- filtered public preview DTO;
- PWA helper wiring to the proxy route;
- tests for mapping and leak prevention.

## 2. Non-goals

Not included:
- premium claim enforcement;
- claim button blocking;
- claim/redeem runtime changes;
- NFT ownership verification;
- blockchain or TON runtime;
- Wallet/G2A integration;
- Points spend changes;
- DB migrations;
- generated SDK edits;
- production entitlement source adapters;
- payout/reward logic;
- Connect wallet UX.

## 3. Why Internal Endpoint Is Not User-facing

The Slice 6.3 endpoint:

```text
POST /v1/rf/internal/entitlement/check
```

is internal, admin-only, and returns a full normalized read response for harness testing.

It is not appropriate as a PWA/user-facing surface because it can include internal fields such as source evaluations, partial results, request window identifiers, and audit trace identifiers.

Slice 6.5 introduces a separate proxy that filters the response before any user-facing consumer sees it.

## 4. Proxy Route

Gateway-safe route:

```text
POST /v1/rf/entitlement/preview
```

The route is:
- read-only;
- feature-flagged;
- authenticated-user accessible;
- not admin-only;
- not part of generated SDK;
- independent from claim/redeem handlers;
- independent from DB writes.

## 5. Auth / Gateway Behavior

The route is protected by the same gateway auth layer used by RF protected routes.

Behavior:
- unauthenticated requests are rejected;
- authenticated users are allowed when the feature flag is enabled;
- the proxy uses the gateway principal as entitlement subject;
- client-provided subject is not trusted as source-of-truth.

## 6. Feature Flags

RF service flag:

```text
RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY
```

PWA flag:

```text
NEXT_PUBLIC_RF_ENABLE_ENTITLEMENT_PREVIEW
```

Both default to off.

If the RF proxy flag is disabled, the route returns a disabled 404-style response with `RF_ENTITLEMENT_PREVIEW_PROXY_DISABLED`.

## 7. Safe Public DTO

The proxy returns only:
- `state`;
- `label`;
- `caption`;
- `informationalOnly: true`;
- `claimBehaviorUnchanged: true`;
- `missingRequirementLabels`;
- `isTemporary`;
- `isPremiumPreview`;
- `updatedAt`.

Allowed states:
- `available`;
- `requires_condition`;
- `checking_or_temporarily_unavailable`;
- `ordinary_no_preview`;
- `unavailable`;
- `not_enabled`.

Forbidden fields:
- `auditTraceId`;
- `requestWindowId`;
- `evaluatedSources`;
- `partialResults`;
- `rawFacts`;
- `adapterId`;
- `healthStatus`;
- source diagnostics;
- wallet facts;
- NFT details;
- G2A details;
- tx / chain / balance / payout fields.

## 8. Mapping Rules

Mapping:
- granted + non-degraded -> `available`;
- denied + invite/NFT/milestone/requirement reason -> `requires_condition`;
- pending/timeout/stale/partial/source unavailable -> `checking_or_temporarily_unavailable`;
- not applicable / ordinary resource without gate -> `ordinary_no_preview`;
- unknown / policy not configured -> `unavailable`.

Rules:
- degraded result must not become `available`;
- `claim_enforcement` is not used;
- proxy uses `evaluationMode: claim_preview`;
- preview is never claim eligibility.

## 9. PWA Helper Wiring

`rfEntitlementPreview.ts` now targets:

```text
/v1/rf/entitlement/preview
```

The helper:
- remains feature-flagged;
- returns `not_enabled` when disabled;
- consumes only safe public DTO;
- ignores accidental internal fields;
- does not modify claim payload;
- does not alter claim button behavior.

## 10. UI Scope

No UI badge is added in this slice.

Reason:
- the proxy boundary is now available, but product copy and placement still need a small dedicated UI slice;
- rendering a badge too early can imply claim gating;
- claim buttons must remain unchanged.

Future UI can add a tiny feature-flagged badge in RF catalog or listing voucher offer cards, outside claim handlers.

## 11. Why Preview Is Still Not Enforcement

Preview is not enforcement because:
- it uses `claim_preview`;
- it returns informational DTO only;
- it does not write DB state;
- it does not call claim/redeem;
- it does not spend points;
- it does not modify idempotency or repeatability;
- PWA state includes `informationalOnly` and `claimBehaviorUnchanged`.

## 12. Future Migration Path

Recommended next steps:
1. Keep proxy default-off.
2. Add a tiny feature-flagged preview badge in RF catalog/listing card.
3. Keep claim button behavior unchanged.
4. Replace mock harness with real non-wallet adapters one source at a time.
5. Add observability for preview response buckets.
6. Consider claim enforcement only after preview semantics and UI copy are stable.

## 13. Risks

Remaining risks:
- preview copy can be mistaken for actual claim permission;
- proxy is still backed by mock harness, not production entitlement truth;
- mock scenarios can be mistaken for product semantics;
- future UI wiring can accidentally disable claim actions;
- public DTO must remain filtered as source adapters become more complex.

Guardrail:
- user-facing DTO never exposes adapter/source/audit internals.

