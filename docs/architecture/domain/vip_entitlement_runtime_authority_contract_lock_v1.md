# VIP Entitlement Runtime Authority — Contract Lock v1

Date: 2026-05-13  
Status: `TARGET_CONTRACT_LOCK_NOT_RUNTIME_IMPLEMENTATION`  
Slice: `VIP Entitlement Runtime Authority / Slice 0`  
Mode: docs-first contract lock, runtime authority design, governance boundary, migration boundary

## 1. Purpose

**TARGET:** This document locks the canonical runtime authority contract for VIP entitlement before any runtime switch.

It answers one question:

> How exactly should VIP entitlement become canonical runtime authority for RF paid voucher spend?

This contract defines:

- canonical ownership;
- entitlement entity semantics;
- runtime decision semantics;
- lifecycle and event boundaries;
- shadow-to-enforcement migration stages;
- drift taxonomy;
- security and fraud guardrails;
- runtime governance rules;
- acceptance criteria before enforcement;
- explicit non-goals for Slice 0.

**FACT:** `docs/architecture/go2asia_ecosystem_reality_map_v1.md` identifies VIP Entitlement Runtime Authority as the next critical milestone and records current `vip_entitlement_status: target_contract_not_authority`.

**FACT:** `docs/architecture/domain/economy_runtime_milestone_closure_rf_paid_spend_validation_v1.md` records that RF paid spend is validated in staging, while current VIP authority remains legacy `vip_spacer` role authority.

**NON-GOAL:** This document does not implement entitlement runtime, create migrations, change RF claim behavior, change Points spend behavior, change APIs, create billing integration, or enable enforcement.

## 2. Source Hierarchy

**FACT:** This contract uses the following hierarchy when sources conflict:

1. `docs/architecture/go2asia_ecosystem_reality_map_v1.md`
2. `docs/architecture/domain/vip_entitlement_lifecycle_contract_v1.md`
3. `docs/architecture/domain/vip_entitlement_schema_decision_contract_v1.md`
4. `docs/architecture/domain/vip_entitlement_shadow_compare_slice_v1.md`
5. `docs/architecture/domain/economy_runtime_milestone_closure_rf_paid_spend_validation_v1.md`
6. `docs/architecture/domain/points_available_only_spend_enforcement_contract_v1.md`
7. `docs/economy/points_policy_v1.md`
8. `docs/economy/referral_network_rewards_policy_v1.md`
9. `docs/economy/vouchers/rf_voucher_economy_v1.md`
10. `docs/economy/vip/vip_value_system_v1.md`
11. Current runtime references in `apps/rf-service`, `apps/points-service`, and `packages/identity-core`.

**TARGET:** This document is a higher-level authority lock for the VIP runtime transition. It does not replace the lifecycle/schema/shadow contracts; it freezes how those contracts must be used before enforcement.

## 3. Current Runtime Status

**FACT:** RF paid voucher spend is currently gated by a `vip_spacer`-compatible role path in RF runtime.

**FACT:** RF paid claim shadow compare for entitlement-shaped decisions exists as an observational path and must not change claim outcome.

**FACT:** Points Service owns ledger, balances, transactions, internal spend, and wallet bucket projection.

**FACT:** Points available-only spend enforcement is target/shadow-only. Current spend authority still has legacy materialized-balance semantics.

**FACT:** `identity-core` normalizes role and capability payloads. It is not entitlement storage, not a subscription engine, and not paid spend authority.

**FACT:** Connect is a read-only product/UI projection surface and must not become hidden economy or entitlement owner.

**TARGET:** Current `vip_spacer` role authority is legacy migration behavior. It is not the long-term authority layer for RF paid voucher spend.

## 4. Canonical Ownership

### 4.1 Canonical Owner

**TARGET:** The canonical owner of VIP spend access is the logical bounded context named **VIP Entitlement Authority**.

VIP Entitlement Authority owns:

- canonical `vip_spend_access` lifecycle;
- authoritative active/expired/revoked/refunded/cancelled state;
- source event ingestion for VIP purchase, renewal, refund, revocation, admin grant, promo, migration, and reconciliation;
- decision resolver for runtime consumers;
- audit trace for decisions and lifecycle events;
- reconciliation between source events, canonical state, and downstream projections;
- cache invalidation and freshness rules for approved derived decisions.

**ASSUMPTION:** The physical implementation may later be a dedicated membership/entitlement service or an auth/identity-owned entitlement table. That physical placement is an implementation decision. The ownership boundary is already locked by this document: the VIP Entitlement Authority bounded context owns runtime VIP truth.

### 4.2 Non-Owners

**TARGET:** The following are not canonical owners of VIP entitlement:

| Component | Allowed role | Forbidden role |
|---|---|---|
| Auth / Clerk | identity source, coarse role compatibility, purchase-related identity correlation | canonical spend authority |
| Gateway | authentication, short-lived derived entitlement-safe claims from canonical source or approved cache | lifecycle owner |
| `identity-core` | role/capability normalization, diagnostics, shadow evidence | entitlement storage or paid claim gate |
| RF Service | voucher lifecycle, claim/redeem/repeatability, paid claim orchestration, RF diagnostics | VIP truth owner |
| Points Service | ledger, balances, wallet buckets, spend accounting | VIP lifecycle owner |
| Connect | read-only explanation/projection | authorization, entitlement calculation, wallet/voucher mutation |
| Referral Service | referral graph, referral relation facts, future consumers of first-active VIP events | VIP lifecycle owner |
| Billing / subscriptions | source events for purchase, renewal, refund, payment settlement | downstream spend authority by itself |
| `vip_spacer` role metadata | migration compatibility signal | long-term authority layer |

**TARGET:** A billing/payment event may cause an entitlement lifecycle event. Billing status alone must not be used by RF or Points as direct paid spend authority.

## 5. Entitlement Entity Lock

**TARGET:** The canonical entitlement entity for this milestone is `VipEntitlement` with `kind = "vip_spend_access"`.

```text
VipEntitlement {
  id: string
  userId: string
  kind: "vip_spend_access"
  status: "scheduled" | "active" | "expired" | "revoked" | "refunded" | "cancelled" | "grace" | "migrated"
  startsAt: string
  expiresAt: string
  source: "payment" | "admin_grant" | "promo" | "migration" | "reconciliation"
  sourceRef: string | null
  revision: number
  schemaVersion: number
  createdAt: string
  updatedAt: string
  revokedAt: string | null
  revocationReason: string | null
  metadata: object
}
```

**TARGET:** Entity identity is the opaque `id`. Runtime consumers must not derive authority from role strings, Connect status, wallet buckets, payment payloads, or RF-local state.

**TARGET:** `startsAt` and `expiresAt` define the spend access window.

**TARGET:** `sourceRef` and `metadata` are internal owner fields by default. They must not be exposed to RF, Connect, Points, Referral, Gateway claims, public APIs, diagnostics exports, or evidence bundles unless separately classified as safe and opaque.

**TARGET:** `grace` and `migrated` do not grant spend access by default.

**OPEN QUESTION:** Exact physical storage, indices, migrations, and API endpoints are out of scope for Slice 0.

## 6. Runtime Decision Contract

### 6.1 Decision States

**TARGET:** Runtime VIP entitlement decisions use three top-level decision outcomes for RF paid voucher spend:

| Outcome | Meaning | RF paid spend behavior |
|---|---|---|
| `allowed` | Canonical or approved-cache decision confirms active non-stale non-degraded `vip_spend_access` | May proceed to other RF and Points gates |
| `denied` | Entitlement is absent, inactive, invalid, expired, revoked, refunded, cancelled, not started, or identity is untrusted | Must block paid spend |
| `degraded` | Source, cache, policy, freshness, or runtime health cannot prove entitlement authority | Must block paid spend in enforcement mode |

**TARGET:** `allowed` is not sufficient for voucher claim success. RF claim preconditions and Points spendability still apply.

**TARGET:** Active VIP opens spend access. It does not convert `lockedPoints` or `networkPoints` into available spendable value.

### 6.2 Decision Response Shape

**TARGET:** Enforcement and shadow decision shapes must stay compatible with the schema decision contract:

```text
VipEntitlementDecision {
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
```

### 6.3 Allow Rules

**TARGET:** RF paid spend enforcement may treat a decision as `allowed` only when all conditions are true:

- `allowed = true`;
- `decision = "granted"`;
- entitlement status is `active`;
- `stale = false`;
- `degraded = false`;
- `source` is `canonical_entitlement` or `approved_cache`;
- `evaluatedAt` is within accepted freshness policy;
- `decisionTtlSeconds` is valid and does not exceed the nearest `expiresAt`;
- subject identity is trusted and matches the claim user;
- decision has `decisionVersion` and `auditTraceId`.

### 6.4 Deny / Degraded Rules

**TARGET:** RF paid spend must fail closed for:

- `not_found`;
- `not_started`;
- `expired`;
- `revoked`;
- `refunded`;
- `cancelled`;
- `grace_not_enabled`;
- `identity_untrusted`;
- `role_drift` in enforcement mode;
- `source_unavailable`;
- `source_timeout`;
- `policy_not_configured`;
- `stale_cache`;
- `unknown` source;
- malformed or partial decision;
- missing `auditTraceId` in enforcement mode;
- any degraded decision.

**TARGET:** Preview, Connect projection, or diagnostics may fail soft with safe user-facing states. They must not authorize spend, write ledger rows, unlock referral Points, or issue vouchers.

### 6.5 Cache and Freshness

**TARGET:** Approved cache is a derived decision source, not authority by itself.

Cache rules:

- cache TTL must be short-lived;
- cache TTL must not exceed `expiresAt`;
- revocation, refund, expiry, cancellation, or reconciliation correction must invalidate or supersede cached grants;
- stale cache must be explicit and must deny paid spend;
- cache key must include at least subject user, action, resource context, entitlement id or revision, decision version, and evaluation window;
- replay must not revive an expired, revoked, refunded, or cancelled entitlement.

**OPEN QUESTION:** Exact TTL value is a later implementation decision and must be approved before enforcement.

## 7. Lifecycle Lock

### 7.1 States

**TARGET:** Lifecycle states are:

| State | Meaning | Spend access | Default enforcement behavior |
|---|---|---:|---|
| `scheduled` | Entitlement known but not active yet | No | deny |
| `active` | Current time is inside approved VIP window | Yes | allow if decision is fresh and non-degraded |
| `expired` | VIP window ended naturally | No | deny |
| `revoked` | Access revoked by system/admin/abuse workflow | No | deny |
| `refunded` | Payment/source reversed or invalidated | No | deny |
| `cancelled` | Future or renewal entitlement cancelled before start | No | deny |
| `grace` | Product-approved grace period | No by default | deny until separate policy |
| `migrated` | Imported historical entitlement requiring reconciliation | No by default | deny until reconciled and approved |

### 7.2 Transitions

**TARGET:** Allowed transitions:

- `scheduled -> active`;
- `scheduled -> cancelled`;
- `active -> expired`;
- `active -> revoked`;
- `active -> refunded`;
- `active -> grace` only after separate product/security policy;
- `grace -> expired`;
- `grace -> active` only through renewal/reconciliation event;
- `expired -> active` only through renewal/new entitlement event;
- `migrated -> scheduled` or `migrated -> active` only after explicit reconciliation approval.

**TARGET:** Invalid transitions:

- `revoked -> active` without a new entitlement or explicit reinstatement event;
- `refunded -> active` without a new entitlement or explicit correction event;
- `expired -> active` by local RF/Points/Connect mutation;
- `migrated -> active` by default;
- any transition created from Connect UI state, wallet projection, RF helper state, or role metadata alone.

### 7.3 Events and Timestamps

**TARGET:** Authoritative timestamps:

| Timestamp | Owner |
|---|---|
| `createdAt` | VIP Entitlement Authority |
| `startsAt` | VIP Entitlement Authority |
| `expiresAt` | VIP Entitlement Authority |
| `updatedAt` | VIP Entitlement Authority |
| `revokedAt` | VIP Entitlement Authority |
| `effectiveAt` on lifecycle events | VIP Entitlement Authority |
| payment/source event timestamp | source system, consumed and reconciled by VIP Entitlement Authority |

**TARGET:** Lifecycle events must be replay-safe and idempotent.

Recommended event vocabulary:

- `vip_purchased`;
- `vip_started`;
- `vip_renewed`;
- `vip_expired`;
- `vip_revoked`;
- `vip_refunded`;
- `vip_cancelled`;
- `vip_reconciled`;
- `vip_migrated`.

**TARGET:** `vip_started` or an equivalent first-active fact is the target event for future referral unlock dependencies.

**OPEN QUESTION:** The exact business trigger for first activation remains open: payment accepted, payment settled, or entitlement started.

## 8. Runtime Governance Rules

**TARGET:** RF paid claim does not own VIP truth.

**TARGET:** Connect does not own VIP truth.

**TARGET:** Points Service does not own VIP truth.

**TARGET:** `identity-core` is not entitlement storage.

**TARGET:** Role metadata is not long-term authority.

**TARGET:** Gateway claims are projections. They may be used only when derived from canonical entitlement authority or approved cache with explicit TTL and invalidation semantics.

**TARGET:** Projection versus authority distinction:

| Surface | Authority? | Rules |
|---|---:|---|
| VIP Entitlement Authority | Yes | owns lifecycle and decisions |
| RF claim-time decision | Consumer | may enforce only approved decision contract |
| Points spend endpoint | Separate Points authority | checks ledger/spendability, not VIP lifecycle |
| Connect wallet/status | Projection | explanation only |
| Gateway claim | Derived projection | short-lived, invalidatable |
| `identity-core` | Helper | diagnostics/normalization only |
| Clerk/current roles | Compatibility source | migration-only, not final spend authority |
| Referral unlock | Future consumer | depends on entitlement events |
| Billing/payment | Source event producer | not RF spend authority directly |

**TARGET:** Diagnostics boundaries:

- diagnostics are default-off;
- diagnostics must be aggregate-safe;
- diagnostics must use safe reason codes and source buckets;
- diagnostics must not change runtime decisions in shadow stages;
- diagnostics must not expose sensitive source facts.

**TARGET:** Reconciliation must compare source events, canonical entitlement, approved cache, Gateway claims, Clerk/legacy role compatibility, RF shadow decisions, Connect projection, Referral eligibility, and Points spendability evidence. Reconciliation must not turn any projection into a secondary authority.

## 9. Shadow to Enforcement Migration

### Stage A — Legacy Role Authoritative

**FACT:** Current RF paid voucher spend authority is `vip_spacer`-compatible role behavior.

Runtime behavior:

- RF paid claim uses current role gate.
- Entitlement is not authoritative.
- Shadow compare may be off or absent.

Observability requirements:

- document current behavior;
- record legacy role source as migration-only;
- no entitlement enforcement claims.

Rollback expectations:

- no rollback needed because no new authority is active.

Acceptable drift:

- entitlement drift may exist, but must not be used for enforcement.

Exit criteria:

- Contract Lock v1 approved;
- owner boundary defined;
- decision contract defined;
- non-goals accepted.

### Stage B — Shadow Compare

**TARGET:** Entitlement decision runs in shadow mode only.

Runtime behavior:

- RF still enforces legacy role gate.
- Entitlement decision cannot allow role-denied claim.
- Entitlement decision cannot deny role-allowed claim.
- Points spend behavior unchanged.
- Voucher lifecycle unchanged.

Observability requirements:

- default-off flags;
- drift class counts;
- safe reason codes;
- `stale`, `degraded`, `source`, `evaluatedAt`, `decisionVersion`, `auditTraceId`;
- forbidden-field verification.

Rollback expectations:

- disable diagnostics/export first;
- disable shadow compare if needed;
- verify RF claim, Points spend, wallet response, replay conflict, and insufficient-balance behavior are unchanged.

Acceptable drift:

- allowed if classified and non-authoritative.

Exit criteria:

- no unsafe diagnostic fields;
- no claim behavior change;
- every shadow decision has traceability;
- drift classes are visible.

### Stage C — Entitlement Preferred

**TARGET:** Entitlement decision becomes the preferred source for readiness evaluation, but not yet final spend authority.

Runtime behavior:

- RF still has rollback-safe legacy gate.
- Entitlement decision is evaluated as the target outcome.
- Divergence blocks enforcement readiness.

Observability requirements:

- staging observation window;
- drift class summary;
- stale/degraded/source health summary;
- cache freshness evidence;
- regression checks for RF, Points, wallet, diagnostics;
- rollback verification.

Rollback expectations:

- return to Stage B or Stage A by flags;
- no DB correction should be required.

Acceptable drift:

- `aligned_granted` and `aligned_denied` are acceptable;
- all other classes require explanation before progression.

Exit criteria:

- `role_granted_entitlement_denied` is zero or fully explained with approved remediation;
- `role_denied_entitlement_granted` is zero or fully explained with approved migration decision;
- stale/degraded/unknown source is zero sustained or below approved readiness threshold;
- no unsafe logs/exports;
- rollback tested.

### Stage D — Entitlement Authoritative

**TARGET:** RF paid claim enforcement uses canonical entitlement decision for VIP spend access.

Runtime behavior:

- RF paid spend requires fresh allowed entitlement decision.
- Legacy role gate is no longer normal authority.
- Role fallback may exist only as explicitly approved emergency rollback or compatibility observation.
- Points still separately enforces its own spend decision.

Observability requirements:

- enforcement decision audit trace;
- denial reason distribution;
- stale/degraded/source failure counters;
- RF claim success/deny/error rates;
- Points spend regression checks;
- rollback evidence.

Rollback expectations:

- enforcement flag can be disabled;
- rollback restores previous role-gated behavior without ledger/voucher data shape changes;
- post-rollback evidence is recorded.

Acceptable drift:

- no role-vs-entitlement drift can be accepted as enforcement ambiguity;
- any unexpected role/entitlement divergence becomes operational incident or rollback trigger.

Exit criteria:

- stable enforcement window;
- no unexplained denied cases;
- no forbidden fields;
- no RF/Points/wallet regressions.

### Stage E — Legacy Compatibility Only

**TARGET:** Legacy roles remain only for compatibility, migration evidence, display, or coarse identity context.

Runtime behavior:

- `vip_spacer` does not grant RF paid spend by itself.
- Gateway/identity role claims remain derived/compatibility signals.
- Shadow diagnostics may continue to detect legacy drift.

Observability requirements:

- legacy role usage counts;
- compatibility drift reports;
- deprecation/removal readiness.

Rollback expectations:

- emergency rollback requires explicit owner/security decision.

Acceptable drift:

- role drift may exist as compatibility data, but must not affect spend authority.

Exit criteria:

- role authority removal or permanent compatibility policy approved.

## 10. Drift Taxonomy

**TARGET:** VIP entitlement rollout uses the following canonical drift taxonomy.

| Drift class | Meaning | Severity | Blocks enforcement? | Observability requirement |
|---|---|---|---:|---|
| `aligned_granted` | Role gate and entitlement both allow | info | No | count |
| `aligned_denied` | Role gate and entitlement both deny | info | No | count |
| `role_granted_entitlement_denied` | Legacy role allows but entitlement denies | critical | Yes | count, reason, source, safe sample classification |
| `role_denied_entitlement_granted` | Legacy role denies but entitlement allows | high | Yes until understood | count, reason, migration impact |
| `stale_entitlement` | Decision stale or cache freshness cannot be proven | high | Yes | count, max age bucket, source |
| `unavailable_entitlement` | Source timeout/unavailable/policy unavailable | high | Yes | count, source bucket, duration |
| `degraded_runtime` | Decision resolver degraded or partial | high | Yes | count, safe reason |
| `unknown` | Unknown source or unclassified condition | critical | Yes | count and stop condition |

**TARGET:** Existing RF shadow classes map as follows:

| Existing shadow class | Contract class |
|---|---|
| `aligned_granted` | `aligned_granted` |
| `aligned_denied` | `aligned_denied` |
| `role_granted_entitlement_denied` | `role_granted_entitlement_denied` |
| `role_denied_entitlement_granted` | `role_denied_entitlement_granted` |
| `stale_shadow` | `stale_entitlement` |
| `degraded_shadow` | `degraded_runtime` |
| `unknown_source` | `unknown` or `unavailable_entitlement` depending on source health |

**TARGET:** Any non-zero blocking drift before Stage D must have an owner-approved explanation, remediation, or explicit no-go decision. Silent acceptance is forbidden.

## 11. Security and Fraud Model

### 11.1 Threats

**TARGET:** The contract must guard against:

- forged entitlement;
- forged role/capability payload;
- `roles[]` privilege escalation;
- admin/pro role accidentally granting VIP spend;
- stale cache spend after expiry/revocation/refund;
- replay of old granted decisions;
- fallback abuse through `vip_spacer`, `mock`, `preview`, `role_mirror`, or `migration_role_shadow`;
- degraded-source grants;
- source timeout grants;
- partial failure where Points debit occurs without valid entitlement decision;
- diagnostics leaking identity/payment/source data;
- Connect or wallet status being treated as authorization.

### 11.2 Guardrails

**TARGET:** Required guardrails before enforcement:

- server-side entitlement decision only;
- fail closed for paid spend when entitlement cannot be proven;
- trusted subject must match claim user;
- deterministic idempotency for lifecycle events;
- decision audit trace for enforcement and shadow decisions;
- cache invalidation on expiry, revocation, refund, cancellation, and reconciliation correction;
- no raw role arrays as authority;
- no `identity-core.isVipCapability()` as paid claim gate;
- no preview/mock/role-mirror decision as enforcement source;
- no automatic VIP grant from admin/pro role;
- no hidden fallback path that grants spend during outage.

### 11.3 Forbidden Diagnostics Fields

**TARGET:** Diagnostics, exports, public DTOs, screenshots, evidence bundles, and logs must not expose:

- raw JWT;
- `X-Gateway-Auth`;
- Clerk tokens;
- service tokens;
- raw role arrays;
- raw role claim dumps;
- raw user identifiers in aggregate exports;
- emails or private profile fields;
- `sourceRef`;
- entitlement metadata;
- payment provider payloads;
- billing card/receipt details;
- wallet ledger rows;
- transaction ids;
- external ids;
- raw correlation ids;
- raw dedupe keys;
- partner settlement or payout details;
- G2A/token/NFT/on-chain proofs;
- unsafe adapter diagnostics.

## 12. Economy Boundaries

**FACT:** VIP is the primary monetization unlock for Points spending.

**TARGET:** VIP entitlement grants spend access only. It is not:

- money;
- cash balance;
- payout right;
- commission;
- PRO reward;
- partner settlement;
- G2A;
- NFT;
- token;
- on-chain proof;
- MLM or income mechanic.

**TARGET:** RF vouchers remain the primary Points spend product. RF owns voucher lifecycle. Points owns ledger debit. VIP Entitlement Authority owns VIP spend access.

**TARGET:** Active VIP does not override Points spendability. Future available-only enforcement remains separate:

```text
Paid RF claim requires:
  RF claim preconditions
  AND active vip_spend_access
  AND Points spend decision
  AND future available-only spendability where enabled
```

**TARGET:** `lockedPoints` remain conditional value until an unlock event exists. `networkPoints` are not automatically spendable without a separate contract.

**NON-GOAL:** This document does not implement referral unlock, network accrual, G2A, NFT/Totem, PRO rewards, partner payouts, cash-out, or available-only spend enforcement.

## 13. Acceptance Criteria Before Enforcement

**TARGET:** RF paid spend must not switch to entitlement authority until all criteria below are satisfied.

### 13.1 Contract Criteria

- VIP Entitlement Authority owner boundary is accepted.
- Entity shape and decision response shape are stable.
- Lifecycle states and invalid transitions are documented.
- Failure, stale, degraded, unavailable, timeout, cache, and fallback semantics are documented.
- RF, Points, Connect, Gateway, Referral, Auth, Billing, and `identity-core` boundaries are documented.
- Non-goals are documented.

### 13.2 Evidence Criteria

- Staging shadow observation window completed.
- Drift class counts exist for the agreed window.
- `role_granted_entitlement_denied` is zero or fully explained with approved remediation.
- `role_denied_entitlement_granted` is zero or fully explained with approved migration decision.
- `stale_entitlement`, `unavailable_entitlement`, `degraded_runtime`, and `unknown` are zero sustained or below explicitly approved thresholds.
- Every shadow/enforcement-candidate decision has safe traceability.
- Diagnostics/export payloads contain no forbidden fields.
- RF paid claim outcome is unchanged during shadow stages.
- Points spend behavior is unchanged during shadow stages.
- Wallet response shape is unchanged during shadow stages.

### 13.3 Security Criteria

- Spoofed subject is denied.
- Forged roles/capabilities are denied as authority.
- Admin/pro non-VIP does not grant VIP spend access.
- Alias expansion does not become spend authority.
- Stale cache denies paid spend.
- Source timeout/unavailable denies paid spend.
- Revoked/refunded/expired replay denies paid spend.
- Same idempotency key with different semantic payload is conflict.
- No unsafe diagnostics leak.

### 13.4 Operational Criteria

- Rollback strategy exists and is tested.
- Rollback restores legacy role-gated behavior without ledger/voucher data correction.
- Flag states are documented.
- Deploy version or git SHA is recorded in evidence.
- Observation window timestamps are recorded.
- Reconciliation owner and report shape are defined.
- No unexplained denied cases remain.

### 13.5 Separate Spendability Criteria

**TARGET:** Available-only Points enforcement must not be bundled with VIP entitlement enforcement.

Before available-only enforcement, `docs/ops/points_spendability_export_consumer_runbook_v1.md` evidence criteria must be satisfied separately, including understood `legacy_allowed_target_denied` drift and zero sustained `target_error` / `target_unavailable`.

## 14. Rollback Rules

**TARGET:** Every runtime stage after Slice 0 must be flag-reversible.

Rollback order:

1. Disable entitlement enforcement.
2. Verify RF paid claim behavior.
3. Verify `/internal/points/spend` behavior.
4. Verify wallet response shape.
5. Keep shadow/diagnostics only if safe.
6. Disable diagnostics/export if unsafe, noisy, or regressive.
7. Record rollback time, environment, flags, reason, evidence, and residual drift.

**TARGET:** Slice 0 itself has no runtime rollback because it is docs-only.

**TARGET:** Rollback must not require DB correction, Points ledger correction, RF voucher correction, or manual compensation for Slice 0.

## 15. Open Questions

| Question | Status | Blocks Slice 0? | Blocks enforcement? |
|---|---|---:|---:|
| Physical owner: dedicated entitlement/membership service or auth/identity-owned table? | open | No, logical owner locked | Yes |
| Exact cache TTL | open | No | Yes |
| Is `grace` allowed? | open | No, default deny | Yes if grace grants access |
| Renewal and overlapping period semantics | open | No | Yes |
| Refund/revocation impact on already claimed vouchers | open | No | Yes |
| Refund/revocation impact on already unlocked referral Points | open | No | Yes before referral unlock |
| Whether admin grants exist | open | No, default deny unless explicit | Yes |
| Whether RF stores `auditTraceId` on voucher claim facts | open | No | Yes for implementation design |
| Exact referral unlock trigger: payment accepted, payment settled, or `vip_started` | open | No | Yes before referral unlock |
| Production go/no-go thresholds for drift | open | No | Yes |
| When `vip_spacer` becomes projection-only | open | No | Yes for Stage E |

## 16. Explicit Non-Goals

**NON-GOAL:** Slice 0 does not include:

- implementation code;
- DB migrations;
- schema changes;
- runtime/API changes;
- RF paid claim behavior switch;
- Points spend behavior change;
- available-only spend enforcement;
- hard `lockedPoints` enforcement;
- production rollout;
- billing implementation;
- payment provider integration;
- subscription provider integration;
- Gateway claim rollout;
- Connect UI changes;
- referral unlock producer;
- network rewards rollout;
- G2A;
- NFT/Totem;
- token or on-chain logic;
- PRO rewards;
- partner payouts;
- partner settlement;
- cash-out;
- commission mechanics;
- MLM/income semantics.

## 17. Follow-Up Slices

**TARGET:** Recommended follow-up sequence:

1. **VIP Entitlement Source Read Adapter Contract**
   - default-off adapter boundary to the future canonical source;
   - no RF behavior change.

2. **VIP Entitlement Source Read Adapter Shadow**
   - RF obtains entitlement-shaped decisions in shadow mode;
   - compare against legacy role gate;
   - no enforcement.

3. **VIP Entitlement Staging Evidence Window**
   - collect drift, stale, degraded, source health, diagnostics safety, and rollback evidence.

4. **VIP Entitlement Enforcement Readiness Review**
   - explicit go/no-go decision before runtime switch.

5. **RF Entitlement-Gated Paid Claim**
   - controlled rollout replacing legacy role authority with entitlement decision.

6. **Legacy Role Compatibility Reduction**
   - make `vip_spacer` compatibility/projection-only after enforcement stabilizes.

7. **Referral Unlock Runtime**
   - use first-active VIP entitlement event to unlock `referral_locked`, with idempotency.

8. **Points Available-only Spend Enforcement**
   - separate Points authority milestone, after spendability evidence criteria are satisfied.

## 18. Final Contract Statement

**TARGET:** VIP entitlement becomes canonical runtime authority for RF paid voucher spend only when RF paid claim consumes a fresh, non-stale, non-degraded `vip_spend_access` decision from VIP Entitlement Authority or approved cache, and no longer treats `vip_spacer` role metadata as normal spend authority.

**FACT:** That runtime switch has not happened yet.

**TARGET:** This Slice 0 locks the contract and gates required before that switch.

`contract_lock_status: locked_for_docs_first_design`

`current_runtime_status: legacy_vip_role_authority`

`target_runtime_status: canonical_vip_entitlement_authority`

`rollout_status: requires_shadow_evidence_before_enforcement`
