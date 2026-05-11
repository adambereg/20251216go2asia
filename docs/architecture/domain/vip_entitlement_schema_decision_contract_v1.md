# VIP Entitlement Schema / Decision Contract v1

## 1. Purpose

This document defines the canonical schema and decision contract foundation for future VIP entitlement runtime.

It solves the next architecture problem after `vip_entitlement_lifecycle_contract_v1.md`: Go2Asia has a target lifecycle policy, but future RF shadow compare, Connect projection, Gateway projection and referral unlock slices need a stable data and decision shape before runtime implementation begins.

This document defines:

- canonical entitlement entity shape;
- decision/read contract;
- projection-safe field tiers;
- cache, stale and degraded semantics;
- ownership boundaries;
- migration preparation for shadow compare.

This document does not implement runtime behavior. It does not define migration SQL, endpoints, payment provider integration, RF claim enforcement, Points ledger changes, referral producers, Connect UI changes, or entitlement rollout.

## 2. Context

Current runtime:

- VIP spend access is still derived from `vip_spacer` / `vip` role or JWT semantics.
- Gateway mints downstream identity context through `X-Gateway-Auth`.
- RF paid voucher spend already exists, but RF currently checks VIP locally through role-derived principal data.
- Points wallet `vipStatus` is role-derived projection.
- `referral_unlock` and network accrual are future producers.
- No canonical VIP entitlement table/source/read decision exists yet.

Existing contracts:

- `docs/economy/points_policy_v1.md` defines VIP as the primary monetization unlock for Points spending.
- `docs/economy/referral_network_rewards_policy_v1.md` defines referral unlock/accrual dependency on future VIP entitlement events.
- `docs/architecture/domain/vip_entitlement_lifecycle_contract_v1.md` defines the lifecycle policy and ownership boundary.

This contract narrows that lifecycle policy into schema, decision, field visibility and migration-readiness rules.

## 3. Core Principles

- Entitlement is not a role.
- Entitlement is not wallet balance.
- Entitlement is the target source for VIP spend authority.
- RF must not invent local VIP truth.
- Connect is read-only projection only.
- Wallet display is not authorization.
- Role fallback is migration-only.
- Entitlement decisions must be auditable.
- Paid spend must fail closed on missing, stale or degraded entitlement.
- Future G2A, NFT/Totem, token and on-chain layers are excluded.

## 4. Canonical Entitlement Schema

Target entity shape:

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

| Field | Meaning | Visibility | Projection safety |
|---|---|---|---|
| `id` | canonical entitlement id | decision-safe | safe if opaque |
| `userId` | entitlement subject | internal/decision-safe | safe for service-to-service only |
| `kind` | entitlement type, currently `vip_spend_access` | decision-safe | safe |
| `status` | lifecycle state | decision-safe | safe |
| `startsAt` | start of entitlement window | decision/connect-safe | safe |
| `expiresAt` | end of entitlement window | decision/connect-safe | safe |
| `source` | source category | decision-safe | safe if coarse |
| `sourceRef` | source-specific reference | internal by default | omit unless safe/opaque |
| `revision` | optimistic/versioned contract revision | internal/decision-safe | safe for diagnostics |
| `schemaVersion` | entity schema version | internal/decision-safe | safe |
| `createdAt` | entity creation time | internal | omit from user projection |
| `updatedAt` | last mutation time | internal | omit from user projection |
| `revokedAt` | revocation time | internal/decision-safe if needed | omit from user projection unless safe |
| `revocationReason` | revocation reason | internal | map to safe `reasonCode` |
| `metadata` | owner-owned metadata | internal only | never expose raw |

Entity constraints:

- `kind` stays narrow until another entitlement type has its own policy.
- `sourceRef` and `metadata` must not contain raw payment data, raw JWTs, secrets, private profile fields, partner settlement data or chain proofs.
- This is a contract shape only, not migration SQL.

## 5. Entitlement State Model

| State | Spend access | Referral unlock eligibility | Network accrual eligibility | Connect display | Cache safety |
|---|---:|---:|---:|---:|---|
| `scheduled` | No | No | No | Yes, safe scheduled state | cache as deny until `startsAt` |
| `active` | Yes | Yes for first activation rules | Yes where policy allows | Yes | cache only until shortest TTL/`expiresAt` |
| `expired` | No | No | No future accrual | Yes | cache as deny |
| `revoked` | No | No | No | Yes with safe reason | cache as deny, invalidate grants |
| `refunded` | No | No | No | Yes with safe reason | cache as deny, needs reconciliation |
| `cancelled` | No | No | No | Yes | cache as deny |
| `grace` | Product decision | Product decision | Product decision | Yes if enabled | unsafe until product/security approved |
| `migrated` | No by default | No by default | No by default | internal/admin by default | cache as deny unless reconciled |

Rules:

- Only `active` grants spend access by default.
- `grace` must not grant anything until a separate product/security policy exists.
- `migrated` must not silently grant access.
- Expiry, revocation and refund stop future eligibility; they do not rewrite past ledger facts unless a separate correction policy exists.

## 6. Decision Contract

Decision request shape:

```text
VipEntitlementDecisionRequest {
  requestId: string
  subject: {
    userId: string
    trustedIdentityContext: object | null
  }
  action: "spend_points" | "unlock_referral" | "accrue_network" | "display_status" | "shadow_compare"
  resource: {
    type: string
    id: string | null
  }
  evaluationMode: "enforcement" | "shadow" | "preview" | "projection"
  requestedAt: string
  correlationId: string | null
}
```

Decision response shape:

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

Consumer visibility:

- RF enforcement may read `allowed`, `decision`, `reasonCode`, `entitlementId`, `status`, `expiresAt`, `stale`, `degraded`, `evaluatedAt`, `source`, `decisionVersion`, `auditTraceId`.
- Connect may read only entitlement-safe projection fields derived from this response.
- Referral may read entitlement id/window/status needed for unlock/accrual decisions.
- Gateway may mint short-lived derived claims from canonical or approved-cache decisions.
- Raw entity metadata, source payloads, payment references, JWTs and role diagnostics must not leave the entitlement owner.

## 7. Decision Semantics

Paid spend enforcement:

- `allowed=true` only when `decision=granted`, state is active, `stale=false`, `degraded=false`, and source is canonical or approved cache.
- Missing entitlement fails closed.
- Expired, revoked, refunded, cancelled and not-started states fail closed.
- Source timeout fails closed.
- Source unavailable fails closed.
- Stale cache fails closed.
- Unknown source fails closed.
- Role drift fails closed once entitlement enforcement is active.

Projection/preview:

- May fail soft with safe temporary status.
- Must not imply final spend eligibility.
- Must not change RF claim behavior.
- Must not trigger Points ledger writes or referral unlock.

Cache philosophy:

- Exact TTL is an open decision.
- TTL must be short-lived.
- TTL must not exceed the nearest `expiresAt`.
- Revocation/refund/expiry events must invalidate or supersede cached grants.
- Stale/degraded decisions must be explicit in the response.

Reconciliation:

- The entitlement owner must support reconciliation between source events, canonical entity state and downstream projections.
- Reconciliation must not make Connect, RF or Points secondary authorities.

## 8. Projection Contracts

### A. RF Projection

RF needs a claim-time decision, not raw entitlement state.

Minimum RF projection:

```text
RfVipSpendDecision {
  allowed: boolean
  reasonCode: string
  entitlementId: string | null
  expiresAt: string | null
  stale: boolean
  degraded: boolean
  evaluatedAt: string
  decisionVersion: number
  auditTraceId: string
}
```

RF must not receive raw payment details, raw JWTs, raw role diagnostics, or source metadata.

### B. Connect Projection

Connect receives display-safe state only:

```text
VipStatusProjection {
  isActive: boolean
  startsAt: string | null
  expiresAt: string | null
  spendAccessOpen: boolean
  reasonCode: string | null
  ctaState: "activate" | "renew" | "active" | "expired" | "unavailable" | "checking"
  updatedAt: string
}
```

Connect must not authorize spend, unlock referral Points, mutate wallet/voucher state, or expose raw source details.

### C. Referral Projection

Referral needs entitlement lifecycle facts for unlock/accrual:

```text
ReferralVipEligibility {
  userId: string
  entitlementId: string
  firstActiveStartedAt: string | null
  currentStatus: "active" | "inactive"
  currentExpiresAt: string | null
  eventId: string
}
```

This projection supports future idempotent `referral_unlock` and network accrual decisions. It does not write Points by itself.

### D. Gateway Projection

Gateway may mint short-lived derived claims:

```text
gatewayVipProjection {
  isActive: boolean
  expiresAt: string | null
  decisionVersion: number
  issuedAt: string
  ttlSeconds: number
}
```

Gateway projection is not the lifecycle owner. It must remain derived from entitlement source of truth or an approved cache.

## 9. Ownership Boundaries

Entitlement owner:

- owns lifecycle state;
- owns source event ingestion/reconciliation;
- owns decision resolver;
- owns audit trace;
- owns authority.

Points Service:

- owns ledger, balances, transactions and bucket projection;
- does not own VIP lifecycle;
- does not infer entitlement from wallet display.

RF:

- owns voucher lifecycle, claim, redeem, repeatability and RF diagnostics;
- does not own VIP lifecycle;
- consumes decision contract for paid spend.

Connect:

- owns read-only explanation;
- does not calculate, own or enforce entitlement;
- does not unlock referral Points.

Gateway:

- authenticates and may project short-lived entitlement-safe claims;
- does not own lifecycle.

`identity-core`:

- normalizes role/capability payloads;
- supports shadow/diagnostic comparison;
- is not a subscription engine;
- `isVipCapability()` is not paid spend authority.

## 10. Cache / Freshness Model

Contract rules:

- Enforcement decisions require fresh or explicitly approved-cache data.
- Short-lived claims are allowed only as derived projection.
- Stale thresholds must be explicit before runtime rollout.
- A cached grant must expire no later than `expiresAt`.
- Revocation/refund/expiry must invalidate or supersede cached grant decisions.
- Retry may be used for read/shadow phases, but enforcement must fail closed when freshness cannot be proven.
- Replay must not reopen an expired, revoked or refunded entitlement.

Audit trace expectations:

- every enforcement or shadow decision has `decisionId` or `auditTraceId`;
- every decision links to request/correlation id;
- diagnostics use safe reason codes and safe source health buckets;
- raw JWTs, payment provider payloads and raw role dumps are forbidden.

## 11. Referral Dependency Contract

Unlock dependency:

- `referral_locked` unlock depends on the first active VIP entitlement of the referred user.
- The triggering event should be `vip_started` or an equivalent first-active entitlement fact.
- Unlock must be idempotent and reference the original locked grant plus entitlement event.

Network accrual dependency:

- direct accrual starts only while the direct referral has active VIP entitlement;
- second-level accrual starts only while required chain members have active VIP entitlement;
- expiry, revocation and refund stop future accrual;
- past ledger facts remain unchanged unless a separate correction policy exists.

Out of scope:

- no `referral_unlock` producer;
- no network accrual producer;
- no Points ledger mutation;
- no anti-abuse implementation.

## 12. Security / Reliability Semantics

Forbidden downstream data:

- raw JWT / Clerk tokens;
- `X-Gateway-Auth`;
- raw role claim dumps;
- payment card, billing, receipt or webhook payloads;
- private profile data;
- partner settlement or payout data;
- G2A/token/NFT/on-chain proofs;
- unsafe adapter diagnostics.

Reliability rules:

- paid spend fails closed on missing/stale/degraded entitlement;
- preview/display may fail soft;
- lifecycle events require deterministic idempotency keys;
- repeated identical event is no-op or duplicate;
- same idempotency key with different semantic payload is conflict;
- renewal, revocation and refund must be replay-safe;
- referral unlock and Points writes remain deterministic through future `externalId` conventions.

Drift prevention:

- role-only grant is migration-only;
- shadow compare logs divergence without changing behavior;
- admin/pro roles do not automatically grant VIP spend access;
- preview output must not be used as enforcement input.

## 13. Current Runtime vs Target State

| Area | Current runtime | Target contract | Migration note |
|---|---|---|---|
| `vip_spacer` role | compatibility/current gate | projection signal only | migration-only |
| RF paid gate | local role check | entitlement decision | shadow compare before switch |
| Wallet `vipStatus` | role-derived boolean | entitlement-safe projection | no authorization |
| Referral unlock | absent | first active VIP event | future producer |
| Network accrual | absent | active VIP-window dependent | future producer |
| Entitlement authority | absent | canonical owner | source decision needed |
| `lockedPoints` enforcement | projection target, not hard invariant | available-only spend lock | separate Points slice |
| `identity-core` | role/capability normalization | helper only | not subscription engine |
| Connect | read-only role/bucket display | read-only entitlement-safe display | no ownership change |

## 14. Migration Preparation

### Phase 0 - Current Role Shortcut Documented

Document current `vip_spacer` role behavior and role/capability/entitlement distinction.

### Phase 1 - Schema + Decision Contract

Define entity shape, decision shape, visibility tiers, cache/failure rules and acceptance hooks. No runtime behavior change.

### Phase 2 - Read Model + Shadow Compare

Introduce internal read/decision model behind flags and compare it with current role-derived behavior.

### Phase 3 - RF Shadow Decision

RF obtains entitlement decision for paid claims but does not change claim outcome.

### Phase 4 - Referral Unlock Dependency

Define first-active VIP event dependency for future `referral_unlock`.

### Phase 5 - Entitlement-Gated Spend

Switch RF paid claim enforcement from role gate to entitlement decision in a separate rollout.

### Phase 6 - Hard `lockedPoints` Enforcement

Make available-only spend a Points ledger invariant.

### Phase 7 - Connect Entitlement-Safe Projection

Expose safe display fields to Connect without changing ownership.

## 15. Non-Goals

Not included:

- runtime implementation;
- migrations;
- DB rollout;
- API rollout;
- payment provider integration;
- G2A/NFT/Totem/on-chain logic;
- PRO rewards;
- UI redesign;
- Connect ownership changes;
- Points ledger rewrite;
- RF claim/redeem behavior changes;
- referral runtime changes;
- entitlement enforcement rollout.

## 16. Open Decisions

Open decisions before runtime implementation:

- entitlement owner domain;
- grace semantics;
- overlap and renewal rules;
- refund semantics;
- revocation semantics;
- exact cache TTL;
- referral unlock trigger timing;
- reconciliation ownership;
- whether admin grants exist;
- whether multiple entitlement types may exist later;
- whether Gateway derived claims should include `expiresAt`;
- whether RF stores decision audit references on voucher claim facts.

## 17. Recommended Next Runtime Slice

Recommended next runtime slice after this design phase:

**VIP Entitlement Read Model + Shadow Compare**

Scope:

- create a read/decision model behind flags;
- compare entitlement decision with current `vip_spacer` role outcome;
- do not change RF claim outcome;
- do not change Points spend behavior;
- do not unlock referral Points;
- do not expose new Connect UI behavior.

This is safer than immediate hard enforcement because it measures role/entitlement drift before spend authority changes.
