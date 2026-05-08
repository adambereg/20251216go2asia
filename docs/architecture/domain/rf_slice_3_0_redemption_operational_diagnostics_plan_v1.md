# RF Slice 3.0 — Redemption / Operational Diagnostics Plan v1

Status: planning-only  
Scope type: architecture and implementation planning  
Runtime changes in this slice: none

## 1. Executive Summary

This planning pass defines a minimal, safe, read-only diagnostics direction for RF vouchers after Stage 5.x attribution baseline, Stage 1+2 lifecycle/redemption alignment, and Slice 2.1A repeatability foundation.

Recommended first implementation slice:
- Slice 3.1 = backend-only internal voucher diagnostics endpoint + tests + docs.
- No frontend/admin UI in Slice 3.1.
- No correction/mutation tools in Slice 3.1.
- No economy/reward/financial semantics in Slice 3.1.

Primary decision:
- Start with one internal voucher-centric diagnostics surface first.
- Defer claim dry-run and redemption diagnostics endpoints to later slices.

## 2. Current Runtime State

Based on read-only review of current schema, migrations, service logic, routes, contracts, and UI surfaces:

- RF lifecycle is canonical-first (`canonical_status`) with legacy compatibility (`status`).
- Redemption is durable (`rf_voucher_redemption`) and idempotent-aware.
- Claim idempotency and redeem idempotency context mismatch protections are present.
- Repeatability foundation exists:
  - `rf_offer.repeat_policy`
  - `rf_voucher.repeat_policy_snapshot`
  - `rf_voucher.issue_sequence`
  - `rf_voucher_scope_consumption_guard`
  - active-only and policy-aware uniqueness indexes
- Attribution foundation exists with immutable voucher-instance semantics and PRO read-only visibility endpoint.
- Existing APIs provide operational hints at request time, but no dedicated internal diagnostics endpoint exists.

## 3. Why Diagnostics Are Needed

Current runtime behavior is stable but troubleshooting remains request-centric, not artifact-centric. Support/admin/QA need a single read-only view to answer:

- What happened to this voucher over time?
- Why claim/redeem was allowed or blocked?
- Which repeatability policy/snapshot/sequence applied?
- Whether guard/redemption/idempotency/attribution artifacts are coherent?
- Which anomalies indicate data inconsistency or migration/runtime regressions?

Without a dedicated diagnostics surface, teams must manually correlate multiple tables and runtime logs, increasing MTTR and review friction.

## 4. Diagnostics Non-goals

Out of scope for Slice 3.0 planning and Slice 3.1 implementation:

- payouts, rewards, Points/G2A/NFT, economy calculations
- merchant billing and financial interpretation
- Connect expansion
- public analytics dashboards
- attribution/admin correction UI or mutation tools
- universal diagnostics platform
- centralized attribution service
- new economy events
- runtime behavior changes in claim/redeem flows

## 5. Candidate Diagnostics Surfaces

### A) Internal voucher diagnostics endpoint

Example:
- `GET /v1/rf/internal/vouchers/{voucherId}/diagnostics`

Purpose:
- Voucher-centric read-only trace for support/admin/QA.

### B) Internal claim diagnostics endpoint (dry-run)

Example:
- `GET /v1/rf/internal/claim-diagnostics?...`

Purpose:
- Explain hypothetical claim allow/block without writes.

Constraints:
- no voucher creation
- no idempotency writes
- no durable attribution mutation

### C) Internal redemption diagnostics endpoint

Example:
- `GET /v1/rf/internal/redemption-diagnostics?...`

Purpose:
- Explain redeem allow/block and redemption attempt coherence.

## 6. Recommended Minimal Slice 3.1

Recommendation:
- Implement only Surface A first (internal voucher diagnostics endpoint).

Why this is minimal and high value:
- Highest support/QA utility per unit risk.
- No dry-run claim engine complexity.
- No runtime behavior mutation.
- Unifies lifecycle + repeatability + redemption + attribution + idempotency visibility in one read-only response.
- Produces immediate diagnostics baseline for future claim/redeem dedicated surfaces.

Not in Slice 3.1:
- Claim dry-run endpoint (Surface B)
- Redemption diagnostics endpoint (Surface C)
- Any UI surface

## 7. Internal Voucher Diagnostics Endpoint Design

Proposed route:
- `GET /v1/rf/internal/vouchers/{voucherId}/diagnostics`

Auth and exposure:
- internal/admin only
- not public
- not PRO
- not merchant by default

Response intent:
- a factual read model, not a policy engine, not a correction API

Core payload groups:
- voucher core: ids, scope, listing context, code (masked), status and canonical status, repeat snapshot, issue sequence, timestamps
- lifecycle view: derived lifecycle interpretation and coherence checks
- redemption facts: rows/attempts summary, applied status, actors, timestamps
- consumption guard: existence and link integrity
- attribution facts: status/source/claimSource plus safe attribution identifiers
- idempotency summary: claim and redeem bindings/replays/mismatch signals
- anomalies: deterministic read-only flags

## 8. Claim Diagnostics / Dry-run Considerations

For later slice only:
- Do not implement in Slice 3.1.

Design principles for future slice:
- strict read-only dry-run
- no durable writes (voucher/idempotency/attribution)
- explicit decision object: `allowed|blocked`, reason code, supporting evidence
- consume existing resolver logic in non-mutating mode only when safely isolated from write paths

## 9. Redemption Diagnostics Considerations

For later slice only:
- Do not implement in Slice 3.1.

Design principles for future slice:
- explain redeem decision against current voucher state and existing redemption history
- include idempotency replay/context mismatch reasoning
- clearly separate factual history from hypothetical decisioning

## 10. Data Exposure and Privacy Rules

### Allowed for internal/admin diagnostics

- `voucherId`, `offerId`, `partnerId`
- `issuedToUserId` (internal-only)
- `claimScope`, `listingId`
- `status`, `canonicalStatus`
- `repeatPolicySnapshot`, `issueSequence`
- lifecycle timestamps (`claimedAt`, `redeemedAt`, `cancelledAt`, `expiresAt`, `statusChangedAt`)
- redemption records summary
- guard state
- attribution status/source/claimSource
- `proAttributedUserId`, `proLinkId`, `attributionConfirmedAt`
- idempotency summary

### Sensitive: mask/limit where possible

- voucher code (masked except explicit elevated role)
- raw attribution metadata
- raw query params
- `shareCode`
- private user profile fields
- idempotency keys (return fingerprint/hash rather than raw values where feasible)

### Not allowed

- payout/earnings/reward calculations
- financial/token value interpretation
- economy projections or balances

## 11. Diagnostics DTO Proposal

Proposed internal DTOs (internal OpenAPI section, not public product DTOs):

- `RfInternalVoucherDiagnosticsResponse`
- `RfInternalVoucherDiagnosticsVoucher`
- `RfInternalVoucherDiagnosticsRedemption`
- `RfInternalVoucherDiagnosticsConsumptionGuard`
- `RfInternalVoucherDiagnosticsAttribution`
- `RfInternalVoucherDiagnosticsIdempotencySummary`
- `RfInternalVoucherDiagnosticsAnomaly`

Suggested high-level shape:

- `voucher`: core immutable facts and timestamps
- `relations`: offer/partner/listing mapping availability
- `redemption`: attempts and latest applied fact
- `consumptionGuard`: presence and referential health
- `attribution`: factual status + safe identifiers
- `idempotency`: claim/redeem link summary + mismatch indicators
- `anomalies`: array of machine-readable flags

## 12. Anomaly Flags

Initial read-only anomaly flags:

- `voucher_redeemed_without_redemption_row`
- `redemption_row_without_redeemed_status`
- `once_per_scope_redeemed_without_guard`
- `active_duplicate_possible`
- `repeat_sequence_gap`
- `confirmed_attribution_without_pro_link`
- `rejected_attribution_present`
- `legacy_status_canonical_status_mismatch`
- `listing_scope_missing_listing_id`
- `guard_points_to_missing_voucher`
- `idempotency_points_to_missing_voucher`

Rules:
- read-only detection only
- no auto-fix
- deterministic from persisted state

## 13. Backend Implementation Plan

Slice 3.1 implementation plan (future, not in this planning pass):

1) Add internal route
- new internal endpoint handler in RF service routes.

2) Add store read-model query helpers
- fetch voucher facts + joined read-only relations (offer/partner/listing mapping/redemption/guard/idempotency/pro link).

3) Add anomaly classifier
- pure function over fetched facts; no writes.

4) Add response mapper
- enforce masking and role-safe output.

5) Error model
- `not_found`, `forbidden`, `invalid_request`; keep diagnostic endpoint deterministic and side-effect free.

6) Add tests
- unit tests for anomaly classification
- route tests for auth, not-found, and representative coherent/anomalous cases

## 14. OpenAPI / SDK Plan

Recommendation:
- Do not expand public RF product contract for diagnostics in Slice 3.1.
- Add internal OpenAPI section/endpoints for diagnostics.

Contract strategy:
- internal-tagged schemas and operations
- generated internal client types if needed by internal tooling only
- keep public SDK/product DTOs unchanged for this slice

Rationale:
- privacy boundary protection
- avoids accidental overexposure in public client surfaces
- preserves additive safety for product-facing APIs

## 15. Frontend / Admin UI Plan

Slice 3.1:
- no frontend UI work
- no PRO UI changes
- no merchant UI diagnostics expansion
- no admin correction UI

Later optional slice:
- internal admin/support page can consume internal diagnostics endpoint once schema stabilizes.

## 16. Tests and CI Gates

For Slice 3.1 implementation:

- store-level tests for join integrity and null-safe handling
- anomaly rules unit matrix
- route auth tests (internal/admin only)
- endpoint response snapshot tests for stable contract
- OpenAPI check for internal contract generation
- no regression in existing RF claim/redeem/my-vouchers/pro-attribution flows

## 17. Rollback Strategy

For Slice 3.1 implementation:

- endpoint is read-only and additive; rollback can be route disable/remove
- no schema mutation required for first cut if using existing tables
- no runtime flow behavior change, so rollback risk is low

## 18. Risks

Primary risks and mitigations:

- Overexposure of sensitive fields in internal payload
  - mitigate with explicit allowlist and masking policy
- Accidental coupling to public DTOs
  - mitigate with dedicated internal schemas
- Heavy joins impacting latency
  - mitigate with voucher-id scoped queries and bounded related history
- Inconsistent anomaly semantics
  - mitigate with strict deterministic flag rules and tests

## 19. Open Questions

- Should internal diagnostics auth be service-to-service only, or include human admin token path?
- Should idempotency key be masked hash by default or role-gated raw?
- Should redemption attempts include full metadata or metadata allowlist only?
- Should anomaly severity (`info/warning/critical`) be included in v1 or deferred?
- Is a separate internal namespace preferred: `/v1/rf/internal/...` vs existing repo internal style?

## 20. Final Recommendation

Explicit decisions:

- Backend endpoint first: yes.
- OpenAPI strategy: internal diagnostics section/endpoints, not public product contract expansion.
- Frontend UI now: no.
- Endpoints first: only voucher diagnostics endpoint in Slice 3.1.
- Definitely not in Slice 3.1:
  - claim dry-run diagnostics endpoint
  - redemption diagnostics endpoint
  - any mutation/correction flows
  - any economy/reward/financial features
  - any public/PRO/merchant diagnostics exposure

Final Slice 3.1 target:
- backend-only internal voucher diagnostics endpoint + tests + docs, read-only.

---

## Planning Pass Audit Coverage

Documents reviewed and aligned:
- `docs/architecture/domain/rf_stage_1_2_lifecycle_repeatability_redemption_implementation_plan_v1.md`
- `docs/architecture/domain/rf_stage_1_2_slice_1_regression_sweep_v1.md`
- `docs/architecture/domain/rf_slice_1_1_edge_case_hardening_v1.md`
- `docs/architecture/domain/rf_repeatability_canon_design_audit_v1.md`
- `docs/architecture/domain/rf_slice_2_1_repeatability_runtime_implementation_plan_v1.md`
- `docs/architecture/rf/rf_pro_attribution_baseline_stage_5_0.md`
- `docs/architecture/rf/rf_attribution_canon_refinement_v1.md`
- `docs/architecture/platform/go2asia_attribution_architecture_map_v1.md`
- `docs/economy/vouchers/rf_voucher_economy_v1.md`

Read-only code paths reviewed:
- `packages/db/src/schema/rf.ts`
- `packages/db/migrations/*` (RF-relevant, including repeatability foundation)
- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`
- `docs/openapi/rf.yaml`
- generated RF DTOs and SDK RF types
- RF frontend surfaces (PRO visibility, merchant redeem, My Vouchers, catalog/listing RF flows)

Runtime code changes in this planning pass:
- none

## Slice 3.1 Implementation Note (Backend-Only)

Implemented in Slice 3.1:
- internal endpoint `GET /v1/rf/internal/vouchers/{voucherId}/diagnostics`
- backend-only, read-only diagnostics aggregation (no mutation)
- internal/admin guard (not public/PRO/merchant)
- dedicated internal diagnostics DTO response (separate from product `RfVoucher`)
- masking/fingerprinting for sensitive fields (voucher code/share code/idempotency/correlation)
- deterministic anomaly flags for lifecycle/redemption/guard/attribution/idempotency coherence
- focused route/auth/response/privacy tests

Explicitly not implemented in Slice 3.1:
- claim dry-run diagnostics endpoint
- redemption diagnostics endpoint
- frontend/admin/pro/merchant UI
- correction tools or mutation endpoints
- economy/reward/payout/financial semantics
