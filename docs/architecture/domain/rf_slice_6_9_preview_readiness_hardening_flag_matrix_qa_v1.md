# RF Slice 6.9 - Preview Readiness Hardening / Flag Matrix QA v1

## 1. Purpose

Slice 6.9 hardens the RF entitlement preview pipeline before any real read adapters are introduced.

The purpose is to validate feature flags, route/auth boundaries, safe DTO behavior, degraded modes, and consistency across single preview, batch preview, PWA helper mapping, badge rendering rules, and observability buckets.

This is a readiness and QA slice, not a new product feature.

## 2. Non-goals

Not included:
- premium claim enforcement;
- claim blocking;
- claim/redeem runtime changes;
- real entitlement source adapters;
- NFT ownership verification;
- blockchain or TON runtime;
- Wallet/G2A integration;
- Points runtime changes;
- DB migrations;
- generated SDK/OpenAPI edits;
- new UI features;
- analytics platform;
- external telemetry integration.

## 3. Feature Flag Matrix

RF service flags:

```text
RF_ENABLE_ENTITLEMENT_MOCK_READ_API
RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY
RF_ENABLE_ENTITLEMENT_PREVIEW_OBSERVABILITY
```

PWA flag:

```text
NEXT_PUBLIC_RF_ENABLE_ENTITLEMENT_PREVIEW
```

Expected behavior:
- all flags default off;
- mock endpoint is disabled unless `RF_ENABLE_ENTITLEMENT_MOCK_READ_API` is enabled;
- single and batch preview proxy are disabled unless `RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY` is enabled;
- observability snapshot is disabled unless `RF_ENABLE_ENTITLEMENT_PREVIEW_OBSERVABILITY` is enabled;
- PWA helper returns `not_enabled` and performs no network call when client preview flag is off;
- server-side observability does not count preview responses when observability flag is off.

## 4. Route / Auth Matrix

Internal mock endpoint:

```text
POST /v1/rf/internal/entitlement/check
```

Rules:
- disabled by default;
- unauthenticated request is rejected;
- authenticated non-admin request is rejected;
- admin request is allowed only when the mock flag is enabled.

Single preview proxy:

```text
POST /v1/rf/entitlement/preview
```

Rules:
- disabled by default;
- authenticated user request is allowed when preview proxy flag is enabled;
- unauthenticated request is rejected;
- admin role is not required;
- subject comes from gateway principal, not client body.

Batch preview proxy:

```text
POST /v1/rf/entitlement/preview/batch
```

Rules:
- disabled by default;
- authenticated user request is allowed when preview proxy flag is enabled;
- unauthenticated request is rejected;
- admin role is not required;
- max batch size is enforced;
- empty or fully invalid batches are rejected;
- partially invalid batches skip invalid items safely.

Observability snapshot:

```text
GET /v1/rf/internal/entitlement/preview-observability
```

Rules:
- disabled by default;
- unauthenticated request is rejected;
- authenticated non-admin request is rejected;
- admin request is allowed only when observability flag is enabled.

## 5. Safe DTO Boundaries

Single and batch preview responses must never expose:
- `auditTraceId`;
- `requestWindowId`;
- `evaluatedSources`;
- `partialResults`;
- `rawFacts`;
- `adapterId`;
- `healthStatus`;
- source diagnostics;
- wallet facts;
- NFT facts;
- G2A facts;
- tx / chain / balance / payout;
- subject payload;
- role hints.

PWA helper state and observability snapshots follow the same leak-prevention boundary.

## 6. Failure-mode Matrix

Expected safe mappings:
- timeout -> `checking_or_temporarily_unavailable`;
- stale cache -> `checking_or_temporarily_unavailable`;
- partial sources -> `checking_or_temporarily_unavailable`;
- source unavailable -> `checking_or_temporarily_unavailable`;
- unknown / `policy_not_configured` -> `unavailable`;
- ordinary resource without gate -> `ordinary_no_preview`;
- network error in helper -> `checking_or_temporarily_unavailable`;
- disabled helper or missing request -> `not_enabled`;
- empty batch helper input -> no network call and empty map;
- oversized client batch -> safe temporary states without network call;
- oversized server batch -> machine-readable invalid request.

No failure mode should show scary UI error banners or alter claim behavior.

## 7. Consistency Checks

Consistency rules:
- equivalent single preview and batch preview inputs map to the same public state;
- observability bucket matches public preview state;
- degraded result never maps to `available`;
- preview always uses `claim_preview`;
- `claim_preview` never becomes `claim_enforcement`;
- disabled preview proxy responses are not counted as successful preview behavior;
- PWA collection badges remain render-only when preloaded `previewState` is supplied.

## 8. What Was Hardened

Hardened areas:
- internal mock admin boundary;
- preview proxy safe DTO checks;
- batch boundary checks for empty, invalid, and oversized payloads;
- source unavailable mapping;
- single vs batch consistency;
- observability-off counter behavior;
- PWA disabled helper network guard;
- PWA empty/oversized batch helper behavior;
- proxy unexpected-state fallback.

## 9. What Remains Experimental

Still experimental:
- mock-backed entitlement decisions;
- local deterministic adapters;
- `mockScenario` test/dev control;
- UI premium detection heuristics (`pro_only`, listing `premium`);
- in-memory observability counters;
- batch max size and future chunking;
- non-generated internal preview routes.

These are readiness constraints before production read adapters.

## 10. Why Still Not Enforcement

Slice 6.9 does not introduce enforcement because:
- it only adds tests, small guardrails, and documentation;
- preview routes still use `claim_preview`;
- claim/redeem handlers are unchanged;
- claim payloads are unchanged;
- idempotency and repeatability are unchanged;
- badge state does not control claim buttons;
- observability counters do not participate in decisions.

## 11. Risks

Remaining risks:
- preview remains mock-backed;
- PWA render tests are still limited by current test infrastructure;
- in-memory observability is approximate and per runtime isolate;
- future real adapters can introduce new degraded modes or source facts that must remain behind the safe DTO boundary;
- client batch max behavior may need chunking when product lists grow.

Guardrails:
- keep preview default-off;
- keep all new routes protected and feature-flagged;
- keep generated SDK/OpenAPI untouched until the contract is intentionally promoted;
- keep enforcement work in a separate future phase.

## 12. Future Migration Path

Recommended next steps:
1. Keep preview flags default-off while QA completes.
2. Add real read adapters one source at a time behind the same safe DTO.
3. Introduce explicit server-provided premium markers before relying on UI heuristics.
4. Add chunking for client batch previews if collections exceed the safe max.
5. Re-run this matrix whenever a new adapter or public preview surface is added.
6. Consider enforcement only after preview behavior, copy, observability, and failure modes remain stable.
