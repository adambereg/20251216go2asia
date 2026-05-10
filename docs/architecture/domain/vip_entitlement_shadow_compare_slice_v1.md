# VIP Entitlement Read Model + Shadow Compare Slice v1

## Scope

This slice introduces a bounded, runtime-adjacent VIP entitlement shadow compare path for RF paid voucher claims.

Included:

- internal entitlement-shaped decision resolver;
- compare-only RF paid claim hook;
- aggregate-only shadow diagnostics;
- default-off feature flags;
- regression tests for behavior invariance and diagnostics safety.

Not included:

- entitlement enforcement;
- canonical entitlement DB/source rollout;
- payment provider integration;
- VIP purchase lifecycle runtime;
- referral unlock producer;
- network accrual producers;
- hard `lockedPoints` enforcement;
- Connect UI changes;
- G2A/NFT/Totem/on-chain logic;
- PRO rewards or partner payouts;
- migrations.

## Runtime Behavior Preservation

RF paid claim behavior remains unchanged.

Current runtime gate:

- paid RF claim still uses the existing `vip_spacer` role gate;
- shadow entitlement decision cannot allow a role-denied claim;
- shadow entitlement decision cannot deny a role-allowed claim;
- Points spend, compensation and voucher lifecycle are unchanged.

The shadow path is observational only.

## Read / Decision Model

The internal shadow resolver returns an entitlement-shaped decision with:

- `allowed`;
- `decision`;
- `reasonCode`;
- `stale`;
- `degraded`;
- `source`;
- `evaluatedAt`;
- `decisionVersion`;
- `auditTraceId`.

Because no canonical entitlement authority exists yet, the default scenario is `role_mirror`. Additional scenarios are available only as internal shadow inputs for regression and controlled comparison:

- `grant`;
- `deny`;
- `stale`;
- `degraded`;
- `unknown_source`.

These scenarios do not implement entitlement authority.

## RF Shadow Compare

For paid voucher claims with Points spend enabled, RF now computes:

- current runtime result from the existing `vip_spacer` gate;
- shadow entitlement decision;
- drift class.

The drift class is never used to decide claim outcome.

Implemented drift classes:

- `aligned_granted`;
- `aligned_denied`;
- `role_granted_entitlement_denied`;
- `role_denied_entitlement_granted`;
- `stale_shadow`;
- `degraded_shadow`;
- `unknown_source`.

## Safe Diagnostics

Diagnostics are aggregate-only and default off.

Allowed diagnostic fields:

- drift class;
- safe reason code;
- stale/degraded booleans;
- source bucket;
- claim scope;
- evaluated timestamp;
- audit trace id;
- counters.

Forbidden diagnostic fields:

- raw JWT or `X-Gateway-Auth`;
- raw role arrays;
- payment/source payloads;
- private profile data;
- `sourceRef`;
- entitlement metadata;
- partner settlement or payout details.

## Feature Flags

Flags:

- `RF_ENABLE_ENTITLEMENT_SHADOW_COMPARE`
- `RF_ENABLE_ENTITLEMENT_SHADOW_DIAGNOSTICS`
- `RF_ENTITLEMENT_SHADOW_SCENARIO`

Defaults:

- shadow compare is off;
- diagnostics are off;
- scenario defaults to `role_mirror`.

## Validation

Added tests cover:

- role grant + entitlement grant;
- role grant + entitlement deny;
- role deny + entitlement grant;
- stale/degraded/unknown source;
- RF paid claim outcome unchanged when shadow grants but role denies;
- RF paid claim outcome unchanged when shadow denies but role grants;
- safe aggregate diagnostics with no unsafe field leakage.

## Known Limits

- The shadow resolver is not an entitlement authority.
- The default read model mirrors current role behavior until a canonical source exists.
- Diagnostics are in-memory aggregate counters only.
- No Gateway claim semantics are changed.
- No Connect projection is changed.

## Recommended Next Slice

Recommended next bounded slice:

**VIP Entitlement Source Read Adapter Contract**

Goal: define and introduce a default-off adapter boundary for a future canonical entitlement source, still in shadow mode and still without RF claim enforcement changes.
