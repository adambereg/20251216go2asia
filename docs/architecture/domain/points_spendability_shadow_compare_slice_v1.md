# Points Spendability Shadow Compare Slice v1

## Scope

This slice introduces a bounded, runtime-adjacent shadow compare path inside Points Service.

Included:

- internal spendability shadow model;
- comparison between legacy materialized balance and target available-only spendability;
- aggregate-only diagnostics;
- default-off feature flags;
- regression tests for behavior invariance and diagnostics safety.

Not included:

- available-only enforcement;
- hard `lockedPoints` lock;
- `/internal/points/spend` response shape changes;
- wallet API response changes;
- RF claim/redeem changes;
- Points ledger rewrite;
- referral unlock producer;
- network accrual producer;
- VIP entitlement enforcement;
- payment integration;
- migrations;
- G2A/NFT/Totem/on-chain logic;
- PRO rewards;
- UI redesign.

## Runtime Behavior Preservation

Current `/internal/points/spend` behavior remains unchanged.

The legacy spend path still:

- checks materialized `user_balances.balance`;
- writes the same negative `rf_voucher_claim_spend` transaction on success;
- updates `user_balances.balance` the same way;
- returns the same success body;
- returns the same insufficient-balance error;
- preserves existing external id idempotency and conflict behavior.

The shadow decision cannot allow or deny spend. It only records aggregate diagnostics when explicitly enabled.

## Shadow Spendability Model

The model computes:

- `legacySpendable`: current materialized balance behavior;
- `targetAvailableSpendable`: ledger-derived `availablePoints` using wallet bucket rules;
- `legacyAllows`: `legacySpendable >= amount`;
- `targetAllows`: `targetAvailableSpendable >= amount`.

The target model uses available-only semantics from `points_available_only_spend_enforcement_contract_v1.md`.

## Drift Classes

Implemented drift classes:

- `aligned_allowed`;
- `aligned_denied`;
- `legacy_allowed_target_denied`;
- `legacy_denied_target_allowed`;
- `target_unavailable`;
- `target_stale`;
- `target_error`.

The most important class is `legacy_allowed_target_denied`: current materialized balance would allow spend, but target available-only semantics would deny it.

## Feature Flags

Flags:

- `POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE`;
- `POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS`.

Defaults:

- shadow compare is off;
- diagnostics are off;
- no extra shadow reads happen when compare is off.

## Safe Diagnostics

Diagnostics are aggregate-only.

Allowed fields:

- drift class;
- action;
- amount range;
- `legacyAllows`;
- `targetAllows`;
- reason code;
- stale flag;
- evaluated timestamp;
- audit trace id;
- counters.

Forbidden fields:

- raw JWT or service token;
- full transaction list;
- private user data;
- raw metadata;
- raw external id;
- full user ledger dump;
- referral graph data;
- payment/source payloads.

## Validation

Added tests cover:

- flags off;
- aligned allowed;
- aligned denied;
- `legacy_allowed_target_denied`;
- `legacy_denied_target_allowed`;
- target stale/unavailable/error;
- diagnostics safety;
- idempotent replay behavior unchanged;
- insufficient balance behavior unchanged.

## Known Limits

- Diagnostics are in-memory aggregate counters only.
- The target decision is not enforcement.
- The shadow path does not change wallet projection.
- The shadow path does not change RF behavior.
- Referral unlock and network accrual remain future work.

## Recommended Next Slice

Recommended next bounded slice:

**Points Spendability Diagnostics Hardening**

Goal: keep the spend path unchanged while adding more durable operational visibility for total-balance vs available-only divergence before any enforcement rollout.
