# RF Slice 6.8 - Preview Observability / Safe Buckets v1

## 1. Purpose

Slice 6.8 adds lightweight operational visibility for entitlement preview behavior.

The goal is to understand preview bucket distribution, degraded frequency, and premium-preview usage without exposing entitlement internals or changing claim behavior.

This slice includes:
- safe preview bucket model;
- RF service in-memory counters;
- admin-only internal snapshot route;
- targeted tests for aggregation and safety boundaries.

## 2. Non-goals

Not included:
- analytics platform;
- user tracking platform;
- event warehouse;
- session replay;
- claim enforcement;
- claim blocking;
- Wallet/NFT/G2A runtime;
- Points runtime changes;
- DB migrations;
- generated SDK/OpenAPI edits;
- broad logging infrastructure;
- adapter raw telemetry exposure;
- audit trace UI exposure.

## 3. Safe Bucket Model

Preview buckets mirror the public safe preview DTO states:
- `available`;
- `requires_condition`;
- `checking_or_temporarily_unavailable`;
- `ordinary_no_preview`;
- `unavailable`;
- `not_enabled`.

Degraded categories:
- `none`;
- `stale_cache`;
- `partial_sources`;
- `timeout_fallback`;
- `source_unavailable`;
- `policy_fallback`.

Surface categories are derived server-side:
- `catalog`;
- `listing`;
- `other`.

The client does not provide a trusted telemetry surface label.

## 4. What Is Counted

Counters include:
- preview single requests total;
- preview batch requests total;
- preview items total;
- premium-preview items total;
- temporary preview items total;
- bucket totals;
- degraded-mode totals;
- surface totals;
- batch-size buckets.

Batch-size buckets:
- `single`;
- `small`;
- `medium`;
- `large`.

Counters are in-memory and per runtime isolate. They are an operational/debug aid, not production analytics truth.

## 5. What Is Never Logged

Observability payloads must not include:
- user ids;
- subject payloads;
- role hints;
- status hints;
- raw entitlement request bodies;
- `auditTraceId`;
- `requestWindowId`;
- `adapterId`;
- `rawFacts`;
- `evaluatedSources`;
- `partialResults`;
- Wallet/NFT/G2A facts;
- tx / chain / balance / payout data;
- claim payloads;
- compensation or recovery details.

## 6. RF Instrumentation

Instrumentation is inserted after preview evaluation and before returning the safe public DTO:

```text
POST /v1/rf/entitlement/preview
POST /v1/rf/entitlement/preview/batch
```

Rules:
- only safe observation metadata is counted;
- instrumentation is gated by `RF_ENABLE_ENTITLEMENT_PREVIEW_OBSERVABILITY`;
- disabled preview proxy responses are not counted as successful preview behavior;
- batch observations aggregate per item;
- no DB writes are introduced.

## 7. Optional Debug Surface

Internal snapshot route:

```text
GET /v1/rf/internal/entitlement/preview-observability
```

The route is:
- internal;
- admin-only;
- feature-flagged by `RF_ENABLE_ENTITLEMENT_PREVIEW_OBSERVABILITY`;
- read-only;
- aggregate-only.

It returns aggregate counters and does not expose user history, raw preview payloads, source facts, audit traces, or claim data.

## 8. PWA Observability Rules

Slice 6.8 does not add PWA-side analytics.

Reason:
- preview buckets can be safely counted at RF service boundary;
- client telemetry risks becoming product/marketing tracking;
- PWA already sends safe preview requests through the proxy/batch proxy;
- server-side classification can derive `catalog` / `listing` from resource shape.

PWA remains responsible only for rendering safe preview UI.

## 9. Privacy / Safety Boundaries

Observability is aggregate and bounded.

It must remain:
- non-personalized;
- non-financial;
- non-wallet;
- non-adapter-specific;
- non-audit-trace;
- non-claim-runtime.

The snapshot is intentionally not a user diagnostics tool.

## 10. Why This Is Still Not Enforcement

Observability is not enforcement because:
- it does not change entitlement decisions;
- it does not change preview copy;
- it does not call claim/redeem;
- it does not disable or enable claim buttons;
- it does not alter claim payloads;
- it does not write voucher state;
- it does not alter repeatability or idempotency.

Counters describe preview behavior after evaluation; they do not participate in evaluation.

## 11. Risks

Remaining risks:
- in-memory counters are per isolate and reset on runtime lifecycle;
- aggregate counts can still reveal rough traffic levels if exposed too broadly;
- future telemetry expansion could accidentally add user/source dimensions;
- mock-backed preview buckets are not production entitlement truth.

Guardrails:
- keep snapshot route admin-only and feature-flagged;
- keep dimensions fixed enums;
- reject raw/source/audit fields in tests;
- do not connect observability to claim behavior.

## 12. Future Migration Path

Recommended next steps:
1. Keep observability default-off until preview semantics are stable.
2. Add export to a real metrics backend only through the same safe bucket model.
3. Add chunk-aware batch-size counters if preview batches are split.
4. Add production read-adapter buckets one source at a time without exposing source payloads.
5. Consider alerting on degraded bucket spikes after non-enforcement preview behavior is stable.
