# VIP Entitlement Lifecycle Contract v1

## 1. Purpose

This document defines the target contract for VIP entitlement lifecycle in Go2Asia.

It solves a current architecture gap: VIP is already the primary monetization unlock for Points spending, but current runtime still treats VIP mostly as a role/claim shortcut.

This contract defines:

- source-of-truth boundaries;
- entitlement entity shape;
- lifecycle states and events;
- spend access semantics;
- integration contracts for RF, Points, Referral, Connect, Gateway and Identity;
- migration direction from role-gated spend to entitlement-gated spend.

This document does not implement runtime behavior. It does not add APIs, migrations, UI, payment provider integration, RF spend changes, Points ledger changes, referral runtime changes or Connect runtime changes.

## 2. Context

`docs/economy/points_policy_v1.md` fixed the core economy rule:

- VIP is the primary monetization unlock for Points spending.
- The standard VIP window is 30 days.
- Active VIP opens spend access.
- Expired VIP closes spend access.
- `lockedPoints` should become a real spend lock.
- RF vouchers are the primary Points spend product.

Current runtime reality:

- VIP is derived from Clerk/JWT role semantics such as `vip_spacer` and sometimes `vip`.
- Gateway mints downstream identity context through `X-Gateway-Auth`.
- RF paid voucher spend currently checks VIP locally through role-derived principal data.
- Connect Wallet shows `vipStatus.isActive`, but this is read-only projection.
- Referral unlock and network accrual are future consumers of VIP lifecycle events.
- There is no canonical VIP purchase entity, start/end window, expiration, renewal, revocation or audit trail yet.

Target architecture requires a time-bounded entitlement lifecycle, not a generic role.

## 3. Core Definition

VIP Entitlement = a time-bounded, auditable permission that opens Points spend access for a user during an active VIP period.

VIP Entitlement is:

- tied to one user;
- bounded by `startsAt` and `expiresAt`;
- auditable through lifecycle events;
- the target source for spend access decisions;
- separate from wallet balance and Points ledger rows.

VIP Entitlement is not:

- a generic user role;
- a Connect status;
- a wallet balance;
- a payout right;
- a PRO attribution;
- a token, NFT, Totem or on-chain asset;
- a local RF shortcut.

## 4. Source of Truth

Target contract:

- VIP entitlement must have one canonical source of truth.
- The owner may be a dedicated entitlement/membership domain or an auth/identity-owned entitlement table.
- RF, Points and Connect must not own the canonical VIP entitlement lifecycle.

Allowed projections:

- Gateway may mint short-lived derived entitlement claims from the entitlement source of truth or an approved cache.
- Points Service may expose entitlement-safe wallet summary fields.
- Connect may display entitlement-safe projection.
- RF may receive a claim-time entitlement decision.

Not source of truth:

- Clerk role alone;
- `vip_spacer` role alone;
- `vip` role alias;
- `users.role` materialization alone;
- Connect UI state;
- wallet bucket values;
- RF local helper state;
- entitlement preview response;
- identity-core role capability helper output.

## 5. Entitlement Entity Contract

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
  createdAt: string
  updatedAt: string
  revokedAt: string | null
  revocationReason: string | null
  metadata: object
}
```

Contract notes:

- `kind` is fixed to `vip_spend_access` for this contract.
- `startsAt` and `expiresAt` define the spend access window.
- `sourceRef` must be safe for downstream consumers or omitted from projections.
- `metadata` must not contain raw payment details, raw JWTs, secrets or unsafe personal data.
- Entity shape is contract-level only. This document does not define migration SQL.

## 6. Lifecycle States

| State | Meaning | Can spend? | Can unlock referral? | Can show in Connect? |
|---|---|---:|---:|---:|
| `scheduled` | Entitlement is known but not active yet | No | No | Yes, as future/scheduled |
| `active` | Current time is within approved VIP window | Yes | Yes, if first activation rules match | Yes |
| `expired` | VIP window ended naturally | No | No | Yes |
| `revoked` | Access was manually or system revoked | No | No | Yes, with safe reason |
| `refunded` | Payment was reversed or invalidated | No | No | Yes, with safe reason |
| `cancelled` | Future or renewal access was cancelled before start | No | No | Yes |
| `grace` | Product-approved grace period after normal expiry | Product decision | Product decision | Yes, if enabled |
| `migrated` | Imported historical entitlement requiring reconciliation | No by default | No by default | Admin/internal only unless approved |

Rules:

- Only `active` opens spend access by default.
- `grace` must not exist without an explicit product/security decision.
- `migrated` must not silently grant spend access.

## 7. Lifecycle Events

Lifecycle events are the audit trail and integration boundary.

| Event | Producer candidate | Consumers | Idempotency key idea |
|---|---|---|---|
| `vip_purchased` | payment/membership owner | entitlement owner | `vip:purchase:<sourceRef>` |
| `vip_started` | entitlement owner | Gateway, RF shadow, Referral, Connect projection | `vip:started:<entitlementId>` |
| `vip_renewed` | entitlement owner | Gateway, Connect projection, Referral accrual eligibility | `vip:renewed:<entitlementId>:<period>` |
| `vip_expired` | entitlement owner/scheduler | Gateway, RF, Referral, Connect projection | `vip:expired:<entitlementId>` |
| `vip_revoked` | entitlement owner/admin workflow | Gateway, RF, Referral, Connect projection | `vip:revoked:<entitlementId>:<revokedAt>` |
| `vip_refunded` | payment/membership owner | entitlement owner, Gateway, RF, Referral | `vip:refunded:<sourceRef>` |
| `vip_reconciled` | entitlement owner/ops | entitlement owner, audit systems | `vip:reconciled:<userId>:<window>` |
| `vip_migrated` | migration/import owner | entitlement owner | `vip:migrated:<legacyRef>` |

Safe payload shape:

```text
{
  eventId: string
  eventType: string
  userId: string
  entitlementId: string
  startsAt: string | null
  expiresAt: string | null
  effectiveAt: string
  source: string
  sourceRef: string | null
  reasonCode: string | null
  correlationId: string | null
}
```

Forbidden payload fields:

- raw payment card or billing details;
- raw JWT/Clerk tokens;
- private user profile data;
- chain transaction fields;
- G2A/token/NFT ownership proofs;
- partner settlement data;
- unsafe diagnostics.

## 8. Spend Access Contract

Target contract:

- Active VIP opens Points spend access for valuable ecosystem actions.
- Expired, revoked, refunded or cancelled VIP closes spend access.
- Spend access is checked at claim/spend time.
- Cached entitlement claims must be short-lived.
- Stale, missing, unknown or degraded entitlement state must fail closed for paid spend.
- Preview/display surfaces may fail soft, but paid spend must not.
- Role-only fallback is migration-only.

Spend access is not a Points balance. A user can have enough Points and still be blocked if VIP spend access is closed.

## 9. RF Integration Contract

Current runtime:

- RF paid voucher spend is behind `RF_ENABLE_PAID_VOUCHER_SPEND`.
- RF currently checks `vip_spacer` role before paid spend.
- This role-based gate is legacy/current behavior, not the target entitlement authority.

Target contract:

- RF asks for an entitlement decision before paid Points spend.
- RF remains owner of voucher lifecycle, claim, redeem, repeatability and RF diagnostics.
- Entitlement does not own voucher state.
- RF must not invent local VIP truth.
- RF must not treat entitlement preview as enforcement.

Target entitlement decision shape:

```text
{
  allowed: boolean
  reasonCode: "entitlement_granted" | "expired" | "revoked" | "refunded" | "source_unavailable" | "source_timeout" | "policy_not_configured"
  entitlementId: string | null
  expiresAt: string | null
  source: string
  stale: boolean
  degraded: boolean
}
```

Migration path:

1. Keep role-gated spend documented as current behavior.
2. Add entitlement shadow decision with no claim behavior change.
3. Compare role gate and entitlement decision.
4. Resolve divergences.
5. Switch paid claim enforcement to entitlement decision in a separate rollout.

## 10. Points Service Integration Contract

Points Service owns:

- ledger rows;
- balances;
- transactions;
- internal add/spend contracts;
- wallet bucket projection.

Points Service does not own:

- VIP purchase lifecycle;
- VIP expiration;
- VIP revocation;
- payment source truth.

Target contract:

- VIP spend access is a precondition for valuable spend, but not ledger balance.
- Future spend checks must respect `lockedPoints` and available-only buckets.
- `lockedPoints` should not be spendable until an unlock event exists.
- Points Service may receive verified spend context from RF or query an entitlement-safe decision indirectly in a future design.
- Points Service must not infer VIP entitlement from Connect UI state.

## 11. Referral / Network Integration Contract

Target contract:

- `referral_locked` unlock depends on the first active VIP entitlement of the referred user.
- Direct referral activity reward eligibility depends on active VIP of the referred user.
- Second-level activity eligibility depends on active VIP for the required chain members.
- VIP expiry stops future accrual.
- VIP expiry does not rewrite past ledger facts.
- Unlock and accrual events must be idempotent.

Required event consumers:

- Referral Service needs `vip_started` or equivalent first-activation signal.
- Points Service needs idempotent `referral_unlock` and future network accrual writes.
- Connect reads the resulting ledger/projection only.

No referral/network surface should present inactive potential value as already granted balance.

## 12. Connect / Wallet Projection Contract

Connect reads entitlement-safe projection only.

Connect must not:

- own VIP lifecycle;
- calculate entitlement;
- authorize spend;
- unlock referral Points;
- mutate wallet or voucher state.

Future projection fields may include:

```text
vipStatus: {
  isActive: boolean
  startsAt: string | null
  expiresAt: string | null
  spendAccessOpen: boolean
  reasonCode: string | null
  ctaState: "activate" | "renew" | "active" | "expired" | "unavailable"
}
```

Wallet display is not spend authority. It must remain a read-only explanation layer.

## 13. Gateway / Identity Contract

Target contract:

- Gateway may mint short-lived derived entitlement claims only from the entitlement source of truth or an approved entitlement cache.
- Clerk roles remain compatibility, bootstrap and coarse identity signals.
- `vip_spacer` should eventually become a compatibility/projection signal, not spend authority.
- `identity-core` role helpers remain normalization tools.
- `identity-core` is not a subscription engine.
- `isVipCapability()` is not a paid claim gate.

Gateway claims must be short-lived enough to avoid stale VIP spend access after expiry/revocation.

## 14. Migration Strategy

### Phase 0 - Current Role Shortcut Documented

Document current `vip_spacer` role gate and known divergence between role, capability, preview and claim behavior.

### Phase 1 - Entitlement Contract + Schema Design

Design entitlement entity, event model, owner boundary and audit model. No runtime behavior change.

### Phase 2 - Entitlement Read Model + Shadow Compare

Expose internal read/decision model behind flags and compare it with current role-derived behavior.

### Phase 3 - RF Claim Shadow Decision

RF obtains entitlement decision for paid claims but does not change claim outcome. Divergence is logged safely.

### Phase 4 - Referral Unlock Event Design

Define first VIP activation event consumption and idempotent `referral_unlock` conventions.

### Phase 5 - Entitlement-Gated RF Paid Claim

Switch RF paid claim enforcement from role gate to entitlement decision in a controlled rollout.

### Phase 6 - `lockedPoints` Hard Spend Lock

Make available-only spend a ledger invariant and prevent locked Points from funding valuable spend.

### Phase 7 - Connect Entitlement-Safe Display

Update Wallet/Connect projection to show safe VIP window and spend access state.

## 15. Security / Failure Semantics

Paid spend:

- must fail closed on missing entitlement;
- must fail closed on stale/degraded entitlement;
- must fail closed on source timeout unless an explicit product/security exception exists;
- must be auditable.

Preview/display:

- may fail soft;
- must use safe labels;
- must not imply final spend eligibility.

Diagnostics:

- no raw JWTs;
- no raw role claim dumps;
- no payment details;
- no unsafe personal data;
- no downstream exposure of private source references.

Replay and idempotency:

- lifecycle events require stable idempotency keys;
- renewal and revocation must be replay-safe;
- referral unlock and Points writes must remain idempotent.

## 16. Non-Goals

Not included:

- payment provider integration;
- G2A;
- NFT/Totem implementation;
- token or on-chain logic;
- PRO rewards;
- partner payouts or settlements;
- runtime implementation;
- DB migration;
- UI changes;
- RF spend gate changes;
- Points ledger changes;
- referral runtime changes;
- Connect runtime changes.

## 17. Open Decisions

Open decisions before implementation:

- Which domain owns VIP entitlement: membership/entitlement service or auth/identity-owned table?
- Is a grace period allowed?
- Which payment source will produce purchase/renewal/refund events?
- Are admin grants allowed?
- How do renewals extend overlapping VIP periods?
- How do refunds/revocations affect already claimed vouchers?
- What exact event unlocks `referral_locked`: purchase accepted, entitlement started or payment settled?
- What is the maximum cache TTL for spend access decisions?
- Which failure modes can be retried and which must block paid spend?
- What reconciliation report is required between payment, entitlement, Clerk roles and downstream projections?

## 18. Next Implementation Candidates

Future slices:

- VIP entitlement schema design.
- Internal read endpoint / decision endpoint design.
- Gateway entitlement projection and short-lived claim design.
- RF shadow compare for paid claim decisions.
- Referral first VIP activation unlock design.
- Network accrual eligibility design.
- Points available-only spend lock design.
- Connect entitlement-safe projection update.
- Reconciliation and audit report design.

Until these slices are implemented, `vip_spacer` remains a current compatibility signal, not the target long-term spend authority.
