# VIP Entitlement Source Read Adapter Contract v1

Date: 2026-05-13  
Status: `TARGET_ADAPTER_CONTRACT_NOT_RUNTIME_IMPLEMENTATION`  
Slice: `VIP Entitlement Runtime Authority / Slice 1`  
Mode: docs-first source read adapter boundary, default-off shadow readiness, no enforcement

## 1. Purpose

**TARGET:** This document defines the source read adapter contract for future VIP Entitlement Authority.

It answers one question:

> How should a safe read adapter between future VIP Entitlement Authority and runtime consumers like RF look?

This contract prepares the next slice:

`next_slice: shadow_read_model_evidence`

This document defines:

- adapter purpose;
- adapter ownership;
- source taxonomy;
- adapter input contract;
- adapter output contract;
- freshness and cache semantics;
- error and degraded semantics;
- consumer rules;
- feature flag modes;
- security guardrails;
- observability requirements;
- acceptance criteria;
- open questions;
- explicit non-goals.

**FACT:** `docs/architecture/domain/vip_entitlement_runtime_authority_contract_lock_v1.md` locks the logical canonical owner as `VIP Entitlement Authority` and locks `VipEntitlement.kind = "vip_spend_access"`.

**FACT:** Current RF paid voucher spend still uses legacy `vip_spacer` role authority.

**FACT:** Existing RF entitlement preview/mock/shadow paths are observational or informational. They are not canonical source read adapters and are not runtime authority.

**NON-GOAL:** This document does not implement adapter code, migrations, schema changes, API rollout, RF claim behavior changes, Points spend behavior changes, Gateway claim rollout, Connect UI changes, billing integration, referral unlock, available-only spend enforcement, or entitlement enforcement.

## 2. Source Hierarchy

**FACT:** This contract uses the following hierarchy when sources conflict:

1. `docs/architecture/domain/vip_entitlement_runtime_authority_contract_lock_v1.md`
2. `docs/architecture/domain/vip_entitlement_schema_decision_contract_v1.md`
3. `docs/architecture/domain/vip_entitlement_lifecycle_contract_v1.md`
4. `docs/architecture/domain/vip_entitlement_shadow_compare_slice_v1.md`
5. `docs/architecture/go2asia_ecosystem_reality_map_v1.md`
6. `docs/architecture/domain/economy_runtime_milestone_closure_rf_paid_spend_validation_v1.md`
7. `docs/architecture/domain/points_available_only_spend_enforcement_contract_v1.md`
8. `docs/ops/points_spendability_export_consumer_runbook_v1.md`
9. `docs/economy/points_policy_v1.md`
10. `docs/economy/referral_network_rewards_policy_v1.md`
11. `docs/economy/vouchers/rf_voucher_economy_v1.md`
12. `docs/economy/vip/vip_value_system_v1.md`
13. Runtime references in `apps/rf-service`, `apps/points-service`, `apps/api-gateway`, `apps/auth-service`, and `packages/identity-core`.

**TARGET:** If this adapter contract conflicts with the Slice 0 authority lock, Slice 0 wins and this document must be corrected.

**TARGET:** If adapter output conflicts with current legacy role behavior during shadow stages, current legacy role behavior remains runtime behavior and adapter output becomes drift evidence only.

## 3. Current Runtime Status

**FACT:** RF paid claim currently checks `vip_spacer`-compatible role data from the gateway principal.

**FACT:** RF contains entitlement preview/mock/shadow flags and internal diagnostic surfaces. These are not canonical entitlement source readers.

**FACT:** RF shadow compare returns entitlement-shaped decision fields and drift classes, but it does not change claim outcome.

**FACT:** Points Service owns ledger, balances, transactions, spend, compensation, wallet buckets, and spendability shadow diagnostics. It does not own VIP entitlement.

**FACT:** API Gateway currently derives downstream identity context from Clerk JWT and mints internal `X-Gateway-Auth`. Gateway identity shadow compare exists, but Gateway is not VIP entitlement authority.

**FACT:** Auth Service materializes user identity and role-related information from Clerk/webhook flows. It is not VIP entitlement authority.

**FACT:** `identity-core` normalizes role/capability semantics and supports compatibility diagnostics. It is not a subscription engine, entitlement store, or paid claim gate.

**TARGET:** Slice 1 does not change any of the above runtime behavior.

## 4. Adapter Definition

**TARGET:** A VIP Entitlement Source Read Adapter is a read-side boundary that reads an approved source, normalizes source facts into a contract shape, and provides evidence for the VIP Entitlement Authority decision resolver or for shadow comparison.

The adapter reads:

- canonical entitlement store facts, once that store exists;
- approved cache facts, once cache policy exists;
- migration role facts only as shadow comparison input;
- test/mock facts only in explicitly controlled test or preview contexts;
- source health and freshness metadata required for safe diagnostics.

The adapter does not:

- own entitlement lifecycle;
- mutate entitlement state;
- create or settle billing truth;
- decide RF claim outcome in Slice 1;
- authorize spend;
- write Points ledger rows;
- unlock referral Points;
- mint Gateway entitlement claims;
- update Connect UI;
- convert `lockedPoints` or `networkPoints` into available value;
- become a hidden secondary authority.

**TARGET:** The adapter is not the authority. VIP Entitlement Authority remains the logical owner of canonical `vip_spend_access` truth.

### 4.1 Difference from Preview / Mock / Shadow

| Surface | Purpose | Authority? | Slice 1 rule |
|---|---|---:|---|
| Preview | informational/product-safe response | No | cannot enforce |
| Mock | controlled test/demo input | No | never enforcement-capable |
| Shadow compare | compare current role behavior with target decision | No | no behavior change |
| Source read adapter | read/normalize future source facts for decision resolver or shadow evidence | No by itself | default-off, no enforcement |
| VIP Entitlement Authority | owns lifecycle and decision authority | Yes | future canonical owner |

**TARGET:** Source read adapter output must pass through the VIP Entitlement Authority decision contract before it can ever participate in future enforcement.

## 5. Adapter Ownership

### 5.1 Contract Owner

**TARGET:** The contract is owned by the VIP Entitlement Authority architecture track.

**TARGET:** Runtime Governance Architect and Technical Canon Writer maintain this contract until a physical owner is implemented.

### 5.2 Canonical Source Owner

**TARGET:** VIP Entitlement Authority owns the canonical source of `vip_spend_access`.

**ASSUMPTION:** Physical implementation may later be:

- a dedicated membership/entitlement service;
- an auth/identity-owned entitlement module;
- an internal package or module owned by VIP Entitlement Authority and used by the future service boundary.

**OPEN QUESTION:** Exact physical owner and storage remain implementation decisions.

### 5.3 Components That Cannot Own the Adapter Authority

**TARGET:** The following cannot own VIP truth and cannot own adapter authority:

- RF Service;
- Points Service;
- Connect;
- Gateway routing code;
- Auth role materialization alone;
- Clerk roles alone;
- `identity-core`;
- Referral Service;
- billing provider;
- payment provider;
- preview/mock routes;
- test fixtures.

**TARGET:** Shared packages may define DTO/schema helpers only. They must not contain hidden entitlement authority logic.

## 6. Source Types

### 6.1 Source Type Taxonomy

**TARGET:** Adapter source types are:

```text
VipEntitlementSourceType =
  | "canonical_entitlement_store"
  | "approved_cache"
  | "billing_payment"
  | "billing_subscription"
  | "admin_grant"
  | "promo_campaign"
  | "migration_import"
  | "reconciliation"
  | "migration_role_shadow"
  | "mock"
  | "unknown"
```

### 6.2 Enforcement Eligibility

| Source type | Meaning | Slice 1 use | Future enforcement eligible? |
|---|---|---|---:|
| `canonical_entitlement_store` | authoritative canonical entity store | contract only / future shadow | Yes, after implementation and evidence |
| `approved_cache` | derived cache with explicit TTL/invalidation/revision | contract only / future shadow | Yes, only if fresh and approved |
| `billing_payment` | payment source event/fact | lifecycle input only | No direct grant |
| `billing_subscription` | subscription provider fact | lifecycle input only | No direct grant |
| `admin_grant` | controlled admin grant source | lifecycle input only | No direct grant until reconciled |
| `promo_campaign` | promo grant source | lifecycle input only | No direct grant until reconciled |
| `migration_import` | imported legacy entitlement data | reconciliation input only | No direct grant until reconciled |
| `reconciliation` | correction/reconciliation fact | owner-internal input | No direct grant until canonicalized |
| `migration_role_shadow` | legacy role comparison source | shadow only | Never |
| `mock` | test/preview source | test/preview only | Never |
| `unknown` | untrusted or unclassified source | failure evidence only | Never |

**TARGET:** Only `canonical_entitlement_store` and explicitly approved, fresh `approved_cache` may become enforcement-capable in a later slice.

**TARGET:** `billing_payment`, `billing_subscription`, `admin_grant`, `promo_campaign`, `migration_import`, and `reconciliation` are lifecycle input sources. They must be reconciled into canonical entitlement state before they can affect RF paid spend.

**TARGET:** `migration_role_shadow`, `mock`, and `unknown` must never grant spend authority.

## 7. Adapter Input Contract

**TARGET:** Adapter input must be minimal and service-side trusted.

```text
VipEntitlementSourceReadRequest {
  requestId: string
  subject: {
    userId: string
    trustedIdentityContextPresent: boolean
  }
  action:
    | "spend_points"
    | "shadow_compare"
    | "display_status"
    | "unlock_referral"
    | "accrue_network"
  resource: {
    type: "rf_offer" | "rf_listing_offer" | "rf_voucher" | "wallet" | "referral_relation" | "unknown"
    id: string | null
    scope: "rf_paid_claim" | "rf_preview" | "connect_projection" | "gateway_projection" | "referral_eligibility" | "diagnostics"
  }
  requestedEntitlementKind: "vip_spend_access"
  evaluationMode:
    | "disabled"
    | "shadow_read_only"
    | "diagnostics"
    | "projection"
    | "preview"
    | "enforcement_candidate"
  requestedAt: string
  environment: "local" | "test" | "staging" | "production" | "unknown"
  consumerId: string
  featureFlagContext: {
    adapterEnabled: boolean
    diagnosticsEnabled: boolean
    enforcementEnabled: boolean
  }
  maxSourceLatencyMs: number | null
  correlationId: string | null
}
```

### 7.1 Required Input Fields

**TARGET:** Required fields:

- `requestId`;
- `subject.userId`;
- `subject.trustedIdentityContextPresent`;
- `action`;
- `resource.type`;
- `resource.scope`;
- `requestedEntitlementKind`;
- `evaluationMode`;
- `requestedAt`;
- `environment`;
- `consumerId`;
- `featureFlagContext.adapterEnabled`;
- `featureFlagContext.enforcementEnabled`.

### 7.2 Consumer IDs

**TARGET:** Future implementations must use explicit consumer ids, not implicit route inference.

Recommended consumer ids:

- `rf-service.preview.single`;
- `rf-service.preview.batch`;
- `rf-service.claim_shadow.partner`;
- `rf-service.claim_shadow.listing`;
- `rf-service.claim_enforcement` only after separate enforcement approval;
- `connect.projection` only for safe display;
- `gateway.projection` only after separate Gateway approval;
- `referral.eligibility_shadow` only for future evidence.

### 7.3 Forbidden Inputs

**TARGET:** Adapter requests must not include:

- raw JWT;
- `X-Gateway-Auth`;
- Clerk token;
- service token;
- raw role arrays;
- raw role claim dumps;
- payment provider payloads;
- billing card/receipt details;
- `sourceRef`;
- entitlement metadata;
- wallet ledger rows;
- Points transaction rows;
- partner settlement data;
- G2A/token/NFT/on-chain proofs;
- client-provided feature flags as authority.

**TARGET:** Runtime identity must be reduced to trusted service-side subject identity before reaching the adapter.

## 8. Adapter Output Contract

**TARGET:** Adapter output must be compatible with Slice 0 decision contract and must separate decision fields from source-read evidence.

```text
VipEntitlementSourceReadResult {
  decision: {
    allowed: boolean
    decision: "granted" | "denied" | "pending" | "unknown" | "not_applicable"
    reasonCode:
      | "entitlement_granted"
      | "not_found"
      | "not_started"
      | "expired"
      | "revoked"
      | "refunded"
      | "cancelled"
      | "grace_not_enabled"
      | "source_unavailable"
      | "source_timeout"
      | "policy_not_configured"
      | "stale_cache"
      | "identity_untrusted"
      | "unsupported_entitlement_kind"
      | "malformed_source_response"
      | "unknown_source"
      | "role_drift"
    entitlementId: string | null
    status: string | null
    startsAt: string | null
    expiresAt: string | null
    stale: boolean
    degraded: boolean
    cacheHit: boolean
    evaluatedAt: string
    decisionTtlSeconds: number
    source: "canonical_entitlement" | "approved_cache" | "migration_role_shadow" | "mock" | "unknown"
    decisionVersion: number
    auditTraceId: string
  }
  sourceRead: {
    sourceType: VipEntitlementSourceType
    sourceFresh: boolean
    sourceAgeMs: number | null
    sourceLatencyMs: number | null
    sourceRevision: number | null
    adapterId: string
    adapterVersion: number
    adapterStatus:
      | "ok"
      | "stale"
      | "degraded"
      | "unavailable"
      | "timeout"
      | "invalid_response"
      | "identity_mismatch"
      | "unsupported_kind"
      | "policy_blocked"
      | "unknown"
  }
}
```

### 8.1 Required Output Fields

**TARGET:** Required fields:

- `decision.allowed`;
- `decision.decision`;
- `decision.reasonCode`;
- `decision.stale`;
- `decision.degraded`;
- `decision.cacheHit`;
- `decision.evaluatedAt`;
- `decision.decisionTtlSeconds`;
- `decision.source`;
- `decision.decisionVersion`;
- `decision.auditTraceId`;
- `sourceRead.sourceType`;
- `sourceRead.sourceFresh`;
- `sourceRead.adapterId`;
- `sourceRead.adapterVersion`;
- `sourceRead.adapterStatus`.

### 8.2 Nullable Fields

**TARGET:** Nullable fields:

- `decision.entitlementId`;
- `decision.status`;
- `decision.startsAt`;
- `decision.expiresAt`;
- `sourceRead.sourceAgeMs`;
- `sourceRead.sourceLatencyMs`;
- `sourceRead.sourceRevision`.

### 8.3 Safe Fields

**TARGET:** Decision-safe fields for RF shadow/future enforcement:

- `allowed`;
- `decision`;
- `reasonCode`;
- `entitlementId` if opaque;
- `status`;
- `expiresAt`;
- `stale`;
- `degraded`;
- `cacheHit`;
- `evaluatedAt`;
- `decisionTtlSeconds`;
- `source`;
- `decisionVersion`;
- `auditTraceId`.

**TARGET:** Diagnostics-safe source fields:

- `sourceType`;
- `sourceFresh`;
- source age bucket;
- latency bucket;
- `adapterStatus`;
- `adapterVersion`;
- safe source bucket;
- counters.

### 8.4 Forbidden Output Fields

**TARGET:** Adapter output must not expose:

- raw source payload;
- `sourceRef`;
- entitlement metadata;
- raw JWT;
- `X-Gateway-Auth`;
- raw roles;
- raw role diagnostics;
- payment payloads;
- private profile fields;
- wallet ledger rows;
- transaction ids;
- external ids;
- raw correlation ids;
- raw dedupe keys;
- partner settlement data;
- G2A/token/NFT/on-chain proofs.

### 8.5 Visibility Tiers

| Tier | Consumers | Allowed fields |
|---|---|---|
| Internal decision | VIP Entitlement Authority / future RF enforcement | full decision-safe fields |
| Shadow diagnostics | RF/runtime governance diagnostics | aggregate-safe fields, no raw ids |
| Connect projection | Connect/UI | display-safe projection only |
| Gateway projection | Gateway after separate approval | short-lived derived fields only |
| Public preview | PWA/public API | safe labels only; no trace/source internals |

**TARGET:** `auditTraceId` is internal traceability. It must not be exposed to public preview/PWA surfaces.

## 9. Freshness and Cache Semantics

### 9.1 Freshness Model

**TARGET:** A source read is fresh only when:

- source read completed successfully;
- `evaluatedAt` is inside the approved freshness window;
- `decisionTtlSeconds` is positive;
- `decisionTtlSeconds` does not exceed `expiresAt`;
- `sourceRead.sourceFresh = true`;
- `decision.stale = false`;
- `decision.degraded = false`;
- source revision is known when required by source policy.

**OPEN QUESTION:** Exact source freshness window is a future implementation decision.

### 9.2 Approved Cache Rules

**TARGET:** Approved cache is derived from canonical entitlement source. It is not a source of lifecycle truth by itself.

Approved cache must include:

- entitlement id or canonical revision;
- source revision or decision version;
- `evaluatedAt`;
- TTL;
- expiry boundary;
- invalidation semantics;
- safe audit trace.

### 9.3 TTL Constraints

**TARGET:** TTL constraints:

- TTL must be short-lived;
- TTL must not exceed `expiresAt`;
- TTL must not survive revocation;
- TTL must not survive refund;
- TTL must not survive cancellation;
- TTL must not survive reconciliation correction;
- TTL must not be client-controlled.

### 9.4 Invalidation Triggers

**TARGET:** Cached grants must be invalidated or superseded by:

- `vip_expired`;
- `vip_revoked`;
- `vip_refunded`;
- `vip_cancelled`;
- `vip_reconciled`;
- `vip_migrated` correction;
- entitlement revision change;
- source health downgrade;
- policy version change;
- adapter version incompatibility.

### 9.5 Stale and Timeout Behavior

**TARGET:** Stale source, stale cache, source timeout, source unavailable, unknown source, malformed source response, and degraded source must map to `allowed=false`.

**TARGET:** In future enforcement these conditions fail closed.

**TARGET:** In Slice 1 and Slice 2 these conditions are diagnostics/shadow evidence only and must not change RF claim outcome.

## 10. Error and Degraded Semantics

### 10.1 Error Taxonomy

**TARGET:** Adapter errors are:

| Adapter condition | Decision mapping | Blocking for future enforcement? | Diagnostics use |
|---|---|---:|---|
| source unavailable | `decision=unknown`, `reasonCode=source_unavailable`, `allowed=false`, `degraded=true` | Yes | source health |
| source timeout | `decision=unknown`, `reasonCode=source_timeout`, `allowed=false`, `degraded=true` | Yes | timeout counter |
| policy not configured | `decision=unknown`, `reasonCode=policy_not_configured`, `allowed=false`, `degraded=true` | Yes | config gap |
| malformed source response | `decision=unknown`, `reasonCode=malformed_source_response`, `allowed=false`, `degraded=true` | Yes | adapter defect |
| stale source/cache | `decision=unknown`, `reasonCode=stale_cache`, `allowed=false`, `stale=true`, `degraded=true` | Yes | freshness |
| identity mismatch | `decision=denied`, `reasonCode=identity_untrusted`, `allowed=false` | Yes | security |
| unsupported entitlement kind | `decision=denied`, `reasonCode=unsupported_entitlement_kind`, `allowed=false` | Yes | contract mismatch |
| unknown source | `decision=unknown`, `reasonCode=unknown_source`, `allowed=false`, `degraded=true` | Yes | stop condition |
| role/canonical divergence | `reasonCode=role_drift`, `allowed` follows adapter source, not runtime behavior in shadow | Yes until resolved | drift evidence |

### 10.2 Blocking Rules

**TARGET:** Future enforcement is blocked by:

- any unknown source;
- any unmapped adapter error;
- sustained timeout/unavailable;
- stale cache;
- malformed source response;
- identity mismatch;
- unsupported entitlement kind;
- diagnostics leaking forbidden fields;
- missing `auditTraceId`;
- source version mismatch;
- adapter version mismatch without compatibility policy.

### 10.3 Diagnostics-Only Conditions

**TARGET:** During shadow/read-only stages, the following are diagnostics-only and cannot change behavior:

- role drift;
- mock result;
- migration role shadow result;
- source unavailable;
- source timeout;
- stale source;
- degraded source;
- unknown source;
- malformed response.

## 11. Consumer Rules

### 11.1 RF Service

**TARGET:** RF may read adapter-derived decisions in shadow mode and future enforcement mode only after separate approval.

RF must:

- keep voucher lifecycle ownership;
- keep claim/redeem/repeatability ownership;
- keep RF diagnostics ownership;
- consume decision-safe fields only;
- treat Slice 1/Slice 2 output as shadow evidence;
- preserve current claim behavior until enforcement slice.

RF must not:

- mutate entitlement;
- own VIP truth;
- cache grants outside approved cache policy;
- treat `migration_role_shadow` as enforcement grant;
- treat `mock` as enforcement grant;
- treat preview DTO as enforcement input;
- store raw source facts;
- pass raw roles/JWTs/payment payloads to adapter;
- change paid claim behavior in Slice 1.

### 11.2 Points Service

**TARGET:** Points Service must not use VIP adapter as ledger authority.

Points may later receive verified spend context, but:

- Points owns ledger and spend decisions;
- Points does not define VIP lifecycle;
- Points does not infer VIP from wallet projection;
- adapter does not change `/internal/points/spend`;
- available-only spend enforcement remains separate.

### 11.3 Connect

**TARGET:** Connect may receive safe projection derived from a decision.

Connect must not:

- authorize spend;
- calculate entitlement;
- own entitlement lifecycle;
- mutate wallet/voucher state;
- expose raw adapter/source facts;
- display unimplemented unlock/accrual as active runtime.

### 11.4 Gateway / Auth

**TARGET:** Gateway/Auth may use short-lived derived claims only after separate approval.

Gateway/Auth must not:

- own VIP lifecycle;
- treat roles as entitlement authority after enforcement;
- treat Gateway claim as source of truth;
- mint long-lived entitlement claims;
- pass raw JWT/roles downstream to source adapter.

### 11.5 Referral

**TARGET:** Referral is a future consumer of first-active VIP lifecycle events.

Referral must not:

- use read adapter output as source of truth for unlock by itself;
- unlock `referral_locked` in Slice 1;
- write Points ledger rows from adapter output;
- create network accrual from adapter output.

### 11.6 Billing / Subscription Providers

**TARGET:** Billing/subscription systems may produce source events for VIP lifecycle.

Billing/subscription systems must not:

- directly authorize RF paid spend;
- bypass VIP Entitlement Authority;
- expose raw payment payloads to RF/Points/Connect/Gateway/Referral.

## 12. Feature Flags and Modes

### 12.1 Future Modes

**TARGET:** Future adapter modes are:

| Mode | Meaning | Runtime behavior |
|---|---|---|
| `disabled` | adapter unavailable | no reads, no behavior change |
| `shadow_read_only` | adapter reads source and emits decision evidence | no behavior change |
| `diagnostics_enabled` | aggregate diagnostics enabled | no behavior change |
| `entitlement_preferred` | entitlement source is target decision for readiness evaluation | no behavior change until separate approval |
| `entitlement_enforcement` | RF paid spend enforces canonical decision | not enabled by Slice 1 |

### 12.2 Slice 1 Flag Posture

**TARGET:** Slice 1 is docs-only. No flags are introduced or changed.

**TARGET:** Any future implementation must start with:

```text
mode = "disabled"
then "shadow_read_only"
then "diagnostics_enabled"
```

**NON-GOAL:** `entitlement_enforcement` is not enabled by this document.

### 12.3 Flag Safety Rules

**TARGET:** Future flags must be:

- server-side only;
- default off;
- independently disableable;
- environment-scoped;
- auditable in evidence bundles;
- unable to be set by client payloads.

## 13. Security Guardrails

### 13.1 Source Authenticity

**TARGET:** Future adapter implementation must use a trusted source registry.

Required source registry fields:

- source id;
- source type;
- source owner;
- adapter id;
- adapter version;
- allowed environments;
- allowed evaluation modes;
- enforcement eligibility;
- expected schema version;
- timeout budget;
- freshness policy.

**TARGET:** Unregistered, forged, mismatched, or unexpected source response must map to `unknown_source` or `malformed_source_response` with `allowed=false`.

### 13.2 Replay Protection

**TARGET:** Adapter/cache replay must deny when replay crosses:

- subject user;
- action;
- resource;
- evaluation mode;
- source id;
- adapter version;
- entitlement id;
- entitlement revision;
- decision version;
- evaluation window;
- expiry/revocation/refund/cancellation boundary.

### 13.3 Degraded-Source Grant Prohibition

**TARGET:** No degraded, stale, unavailable, timeout, mock, unknown, role-shadow, preview, Connect projection, wallet status, Gateway role claim, or identity-core capability can grant spend authority.

### 13.4 Identity Mismatch

**TARGET:** If adapter subject does not match trusted runtime subject, the decision must be denied with `identity_untrusted`.

### 13.5 Forbidden Logs

**TARGET:** Logs and diagnostics must not contain:

- raw JWT;
- `X-Gateway-Auth`;
- Clerk token;
- service token;
- raw roles;
- raw identity payload;
- payment payload;
- `sourceRef`;
- entitlement metadata;
- wallet ledger rows;
- transaction ids;
- external ids;
- raw correlation ids;
- raw dedupe keys;
- partner settlement data;
- token/G2A/NFT/on-chain proofs.

## 14. Observability Requirements

**TARGET:** Source read adapter diagnostics must be aggregate-safe and default-off.

Minimum safe counters:

- total read attempts;
- read attempts by `consumerId`;
- decision counts by `reasonCode`;
- decision counts by `source`;
- `stale` count;
- `degraded` count;
- `cacheHit` count;
- source health by `adapterStatus`;
- timeout count;
- source latency buckets;
- source age buckets;
- adapter version distribution;
- decision version distribution;
- audit trace coverage rate;
- unknown source count;
- malformed response count;
- identity mismatch count.

**TARGET:** Drift mapping readiness must support:

- `aligned_granted`;
- `aligned_denied`;
- `role_granted_entitlement_denied`;
- `role_denied_entitlement_granted`;
- `stale_entitlement`;
- `unavailable_entitlement`;
- `degraded_runtime`;
- `unknown`.

**TARGET:** Durable exports, if later created, must not include raw user ids unless explicitly approved in a separate security-reviewed export contract.

**TARGET:** Public previews must not expose `auditTraceId`, adapter internals, source health internals, raw source facts, role hints, payment hints, or private diagnostics.

## 15. Acceptance Criteria

### 15.1 Slice 1 Acceptance Criteria

**TARGET:** Slice 1 is complete when:

- this document exists;
- adapter purpose is locked;
- adapter non-authority status is explicit;
- ownership boundaries are locked;
- source taxonomy is locked;
- input contract is locked;
- output contract is locked;
- required/nullable/safe/forbidden fields are documented;
- freshness/cache semantics are documented;
- error taxonomy is mapped to decision contract;
- consumer rules are documented;
- feature flag modes are documented as future/default-off;
- security guardrails are documented;
- observability requirements are documented;
- explicit non-goals are documented;
- next slice is defined as `shadow_read_model_evidence`.

### 15.2 Negative Acceptance Criteria

**TARGET:** Slice 1 must not include:

- code;
- migrations;
- schema changes;
- API changes;
- RF claim behavior changes;
- Points spend behavior changes;
- Connect UI changes;
- Gateway claims;
- billing provider integration;
- subscription provider integration;
- referral unlock;
- available-only spend enforcement;
- entitlement enforcement.

### 15.3 Acceptance Criteria Before Slice 2

**TARGET:** Do not start Slice 2 implementation if:

- adapter contract allows role-derived grant as authority;
- adapter can change RF claim outcome;
- `mock`, preview, migration role shadow, Connect, Gateway claim, or wallet status can become spend authority;
- no `auditTraceId` requirement exists;
- stale/degraded/source timeout semantics are ambiguous;
- diagnostics can leak raw JWT, role arrays, payment/source refs, metadata, ledger rows, or transaction ids;
- available-only Points enforcement is mixed into VIP adapter scope.

## 16. Open Questions

| Question | Status | Blocks Slice 1? | Blocks Slice 2? | Blocks enforcement? |
|---|---|---:|---:|---:|
| Physical source owner: dedicated entitlement service or auth/identity-owned entitlement module? | open | No | No if adapter is mock/shadow-only | Yes |
| Exact source read API or internal call shape | open | No | Yes |
| Exact cache TTL | open | No | No for shadow if marked unknown | Yes |
| Cache invalidation implementation | open | No | No for shadow if no grant used | Yes |
| Source health thresholds | open | No | Yes for evidence window | Yes |
| Adapter version compatibility policy | open | No | Yes |
| Whether admin grants exist | open | No | No if default denied | Yes |
| Renewal/overlap semantics | open | No | No for adapter shell | Yes |
| Refund/revocation effects on already claimed vouchers | open | No | No for adapter shell | Yes |
| Whether RF stores `auditTraceId` on claim facts | open | No | No for shadow | Yes for enforcement design |
| Durable export shape for VIP adapter diagnostics | open | No | No if process-local diagnostics only | Yes for production evidence |
| Production shadow approval process | open | No | No for staging-only | Yes |

## 17. Explicit Non-Goals

**NON-GOAL:** Slice 1 does not include:

- implementation code;
- DB migrations;
- schema changes;
- OpenAPI/API changes;
- SDK changes;
- RF paid claim behavior switch;
- RF entitlement enforcement;
- Points spend behavior change;
- Points available-only enforcement;
- Connect UI or projection rollout;
- Gateway entitlement claim rollout;
- Auth Service entitlement storage;
- billing implementation;
- payment provider integration;
- subscription provider integration;
- referral unlock producer;
- network rewards runtime;
- G2A;
- NFT/Totem;
- token or on-chain logic;
- PRO rewards;
- partner payouts;
- partner settlement;
- production rollout.

## 18. Next Slices

**TARGET:** Recommended sequence:

1. **Slice 2: Shadow Read Model Evidence**
   - implement or connect adapter behind default-off flags;
   - RF compares adapter decision with legacy `vip_spacer`;
   - no RF claim outcome change;
   - no Points behavior change;
   - safe diagnostics only.

2. **Slice 3: Staging Evidence Window**
   - collect drift classes;
   - collect source health, stale/degraded/timeout data;
   - verify forbidden fields absence;
   - verify disable/rollback.

3. **Slice 4: Enforcement Readiness Review**
   - go/no-go for RF entitlement-gated paid claim;
   - require drift explanations, source freshness, security approval, rollback evidence.

4. **Slice 5: RF Entitlement-Gated Paid Claim**
   - switch RF paid spend to canonical decision only after approval.

5. **Slice 6: Legacy Role Compatibility Reduction**
   - make `vip_spacer` projection/compatibility-only after enforcement stabilizes.

6. **Later Separate Slices**
   - Gateway short-lived claims;
   - Connect entitlement-safe projection;
   - referral unlock runtime;
   - Points available-only enforcement.

## 19. Final Contract Statement

**TARGET:** The VIP Entitlement Source Read Adapter is a default-off, non-authoritative read boundary that normalizes future canonical source facts into a decision-compatible shape for shadow evidence and future entitlement decisions.

**FACT:** The adapter does not currently exist as canonical runtime authority.

**FACT:** RF paid voucher spend still uses legacy `vip_spacer` role authority.

**TARGET:** Slice 1 prepares Slice 2 shadow evidence without enabling enforcement.

`contract_status: source_read_adapter_contract_locked`

`runtime_status: no_runtime_change`

`adapter_status: default_off_contract_only`

`enforcement_status: not_enabled`

`next_slice: shadow_read_model_evidence`
