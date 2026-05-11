# Points Available-only Spend Enforcement Contract v1

## 1. Purpose

This document defines the target contract for available-only Points spend enforcement in Go2Asia.

It solves a current economy/runtime inconsistency:

- wallet projection already separates `availablePoints`, `lockedPoints` and `networkPoints`;
- Points policy already treats `lockedPoints` as conditional value;
- current `/internal/points/spend` still checks materialized `user_balances.balance`;
- therefore conditional or network value may still contribute to RF paid spend until available-only enforcement exists.

This document defines:

- canonical spendable bucket model;
- authoritative spend invariant;
- RF spend boundary;
- referral/network bucket semantics;
- wallet projection alignment;
- compensation/recovery rules;
- migration-safe rollout phases.

This document does not implement runtime behavior. It does not add migrations, APIs, backend logic, RF claim changes, Points ledger changes, entitlement rollout, referral producers, Connect UI changes, G2A/NFT/on-chain mechanics, PRO rewards or partner payouts.

## 2. Context

Current runtime:

- Points Service owns ledger rows, balances, transactions and wallet bucket projection.
- `computeWalletBuckets` projects `referral_locked` into `lockedPoints`.
- `referral_unlock` projects locked value into `availablePoints`, but no active producer is confirmed.
- Network accrual actions exist in taxonomy/projection, but no active producers are confirmed.
- `/internal/points/spend` accepts `rf_voucher_claim_spend` and checks `user_balances.balance`.
- RF paid voucher spend is active behind `RF_ENABLE_PAID_VOUCHER_SPEND`.
- RF compensation/recovery exists for claim persistence/idempotency failure after spend.
- VIP entitlement enforcement is still future; current RF paid spend remains role-gated by `vip_spacer`.

Policy context:

- `docs/economy/points_policy_v1.md` defines `lockedPoints` as a target real spend lock.
- `docs/economy/referral_network_rewards_policy_v1.md` defines `referral_unlock` as future conversion from conditional value to available value.
- `docs/architecture/domain/vip_entitlement_schema_decision_contract_v1.md` identifies hard `lockedPoints` enforcement as a separate Points slice.
- `docs/architecture/domain/vip_entitlement_shadow_compare_slice_v1.md` preserves RF behavior and explicitly excludes hard `lockedPoints` enforcement.

## 3. Core Principles

- Spendability must be explicit.
- Wallet display is not spend authority.
- `availablePoints` is the target spendable bucket.
- `lockedPoints` are conditional value, not fully spendable value.
- `networkPoints` are not automatically spendable.
- RF must consume authoritative spend results from Points Service.
- RF must not infer bucket semantics locally.
- Compensation must preserve bucket semantics.
- Projection and enforcement must converge before `lockedPoints` can be treated as a hard invariant.
- Migration must be shadow/diagnostic first, not hard enforcement first.

## 4. Canonical Bucket Model

| Bucket | Meaning | Spendability | Visibility | Projection role | Enforcement role |
|---|---|---:|---:|---|---|
| `availablePoints` | Points immediately eligible for spend when other gates pass | Yes, target spendable bucket | User-visible | Main spendable wallet value | Authoritative spend source |
| `lockedPoints` | Conditional value waiting for unlock event | No | User-visible with conditions | Explains pending referral/conditional value | Must be excluded from spend |
| `networkPoints` | Granted or future value connected to referral network activity | Not automatic | User-visible only when granted/clear | Separate participation bucket | Spendability requires explicit policy |
| `compensationPoints` | Technical correction restoring a failed spend path | Follows original spend bucket | Usually not highlighted as reward | Operational correction | Must restore original spendability state |
| future buckets | Explicit future economy categories | No by default | Only if policy-safe | Future projection | Non-spendable until contracted |

Bucket rules:

- Bucket membership must be derived from ledger action semantics or an explicitly contracted bucket field.
- A visible bucket is not automatically spendable.
- Future buckets must default to non-spendable until a policy and runtime contract say otherwise.
- Technical correction must not become a reward loop.

## 5. Spend Authority Contract

Target invariant:

```text
SpendablePoints = availablePoints
```

Additional gates such as active VIP entitlement may still be required. Available-only spend is necessary but not sufficient for valuable ecosystem spend.

Target spend rule:

- paid Points spend may debit only from available spendable value;
- locked conditional value must not fund spend;
- network value must not fund spend unless explicitly converted or marked spendable by a future contract;
- total wallet balance must not be used as spend authority once enforcement is enabled.

Current runtime limitation:

- current `/internal/points/spend` checks `user_balances.balance`;
- current `user_balances.balance` may include ledger rows that wallet projection classifies as locked/network;
- current error message mentions available balance, but the runtime guard is still materialized total balance;
- this document does not change that runtime.

## 6. RF Spend Contract

RF owns:

- voucher lifecycle;
- claim and redeem behavior;
- repeatability;
- RF diagnostics;
- spend coupling orchestration.

Points Service owns:

- ledger writes;
- balance/bucket authority;
- spend idempotency;
- compensation ledger semantics.

Target RF spend contract:

- RF requests a Points spend decision/write from Points Service.
- Points Service decides whether enough available spendable value exists.
- RF must not calculate available/locked/network semantics locally.
- RF must not treat total wallet balance as durable spend authority.
- RF must preserve existing idempotency through deterministic spend external ids.
- RF must preserve compensation/recovery markers when a spend succeeds but voucher persistence/finalization fails.

Spend-before-claim target semantics:

1. RF validates RF-owned claim preconditions.
2. RF verifies required spend gates outside Points where applicable, such as current/future VIP entitlement.
3. RF requests Points spend for the voucher claim.
4. Points Service checks authoritative spendable bucket.
5. RF persists voucher claim if spend succeeds.
6. RF compensates/reconciles if claim persistence or idempotency finalization fails after spend.

Failure semantics:

- insufficient available Points must fail the spend request;
- locked/network value must not silently satisfy the spend;
- replay with the same external id and same payload must be idempotent;
- replay with a different payload must remain a conflict;
- RF claim outcome must not be changed by bucket shadow diagnostics until a separate rollout.

## 7. Referral / Network Bucket Contract

Referral Service owns:

- referral graph;
- referral relation facts;
- activation/read models.

Points Service owns:

- `referral_locked` ledger rows;
- `referral_unlock` ledger rows;
- bucket projection;
- spend authority.

Target referral bucket semantics:

- `referral_locked` creates conditional locked value.
- `referral_unlock` converts the original locked value into available value.
- unlock must reference the original conditional grant and the qualifying VIP entitlement event/fact.
- unlock must be idempotent.
- unlock must not duplicate available value.
- locked value must remain non-spendable until unlock.

Target network bucket semantics:

- network accrual producers are future.
- `networkPoints` must represent granted participation value, not inactive potential value.
- network value is not automatically spendable.
- spendability of network value requires an explicit policy decision:
  - convert to available on grant;
  - keep as separate non-spendable bucket;
  - or unlock through a separate future rule.

Expiry/revocation/refund semantics:

- expiry, revocation or refund stops future accrual eligibility;
- past granted ledger facts remain unchanged unless a separate correction policy exists;
- stale or revoked eligibility must not silently create available spendable value;
- correction flows must be explicit and auditable.

This document does not implement referral unlock or network accrual producers.

## 8. Wallet Projection Contract

Wallet buckets are read-only projections.

Wallet projection must:

- show available value separately from conditional value;
- show locked value as conditional, not spendable;
- show network value only as granted/contracted value;
- avoid implying inactive potential value is available;
- align labels with enforcement semantics once enforcement exists.

Wallet projection must not:

- authorize spend;
- unlock referral Points;
- infer VIP entitlement;
- override Points Service spend decision;
- turn total balance into spend authority.

Connect may explain bucket meaning, but Connect remains read-only projection and does not own economy state.

## 9. Compensation / Recovery Contract

Compensation is an operational correction, not a reward.

Target compensation invariant:

```text
Compensation restores the spendable state that was debited.
```

Rules:

- If an available-only spend debits available value, compensation restores available value.
- Compensation must not unlock `lockedPoints`.
- Compensation must not convert `networkPoints` into available value unless the original spend debited an explicitly spendable network-derived amount.
- Compensation must reference the original spend external id.
- Compensation must be idempotent.
- Compensation replay with a different payload must be a conflict.
- Failed compensation must be observable through recovery diagnostics.
- Manual reconciliation must preserve the original bucket semantics.

Recovery marker expectations:

- RF recovery marker identifies spend external id, compensation external id, claim scope, scope ref, correlation id and recovery state.
- Points ledger remains the authority for actual compensation transaction state.
- RF diagnostics can surface recovery state but must not become Points ledger authority.

## 10. Current Runtime vs Target State

| Area | Current runtime | Target invariant | Migration note |
|---|---|---|---|
| `user_balances.balance` | materialized total balance used by spend guard | not sufficient as spend authority | document then shadow compare |
| `computeWalletBuckets` | derives available/locked/network from actions | projection aligns with enforcement | keep projection as read model |
| `referral_locked` | active locked grant action | non-spendable conditional value | exclude from future spendable amount |
| `referral_unlock` | taxonomy/projection exists, producer absent | converts locked to available | future producer required |
| RF spend | calls `/internal/points/spend` for `rf_voucher_claim_spend` | Points checks available-only spendable value | future Points-side switch |
| RF compensation | adds `rf_voucher_claim_spend_compensation` | restores original spendable bucket | bucket-aware compensation needed |
| wallet summary | shows available/locked/network buckets | projection matches spend authority | avoid total-as-spendable copy |
| network accrual | taxonomy/projection exists, producers absent | explicit spendability policy required | future policy/runtime slice |
| spend authority | materialized balance check | `availablePoints` only | shadow diagnostics before enforcement |
| VIP entitlement | future spend access authority | separate gate from bucket spendability | entitlement alone cannot make locked value spendable |

## 11. Security / Reliability Semantics

Spend checks must be:

- deterministic;
- idempotent;
- replay-safe;
- bucket-aware;
- auditable.

Reliability rules:

- no hidden spendability from total balance;
- no double accounting between available/locked/network buckets;
- no stale projection as spend authority;
- no compensation that changes conditional value into available value accidentally;
- no RF-local bucket decision;
- no Connect-local bucket decision;
- no referral unlock without deterministic idempotency.

Failure rules:

- insufficient available value fails the spend;
- ambiguous bucket state must not grant spend in enforcement mode;
- stale bucket projection must not be used to authorize spend;
- compensation failure must be observable and reconcilable;
- retries must use deterministic external ids.

Audit expectations:

- spend decision should carry request/correlation id;
- spend and compensation should link to external ids;
- future shadow compare should classify total-balance vs available-only divergence;
- diagnostics should expose aggregate safe bucket outcomes, not private user activity details.

## 12. Migration Strategy

### Phase 0 - Current Materialized Balance Documented

Document that current spend checks use `user_balances.balance` and that this is stricter policy drift, not the target invariant.

### Phase 1 - Canonical Bucket Contract

Define bucket meanings, spendability, ownership and compensation semantics. This document is Phase 1.

### Phase 2 - Shadow Spendability Compare

Compute current materialized spend outcome and target available-only spend outcome in shadow mode. Do not change Points spend result.

### Phase 3 - Spend Diagnostics

Expose safe aggregate diagnostics:

- total-balance would allow / available-only would deny;
- both allow;
- both deny;
- stale bucket projection;
- compensation bucket mismatch candidates.

### Phase 4 - Available-only Spend Shadow

Run available-only decision alongside current spend path for RF paid spend. Keep RF claim outcome unchanged.

### Phase 5 - RF Spend Authoritative Bucket Switch

Switch Points spend authority from total balance to available-only for RF paid spend in a separate rollout.

### Phase 6 - Referral Unlock Alignment

Introduce idempotent `referral_unlock` producer and ensure locked-to-available conversion matches enforcement.

### Phase 7 - Wallet / Enforcement Convergence

Ensure wallet projection, Connect copy and Points spend authority all use the same bucket semantics.

## 13. Non-Goals

Not included:

- runtime implementation;
- migrations;
- DB rewrite;
- RF lifecycle rewrite;
- entitlement rollout;
- referral producer rollout;
- network accrual rollout;
- hard `lockedPoints` enforcement;
- Connect UI redesign;
- SDK/OpenAPI rewrite;
- G2A/NFT/Totem/on-chain logic;
- PRO rewards;
- partner payouts or settlements.

## 14. Open Decisions

Open decisions before runtime implementation:

- whether `networkPoints` become spendable later;
- whether `networkPoints` require a separate unlock;
- whether network accrual should land directly in available or network bucket;
- whether compensation restores original bucket type through explicit bucket metadata or derived action semantics;
- whether bucket materialization remains stored or becomes derived at spend time;
- exact reconciliation owner for bucket mismatches;
- stale projection handling during spend;
- wallet rounding/normalization semantics;
- partial spend ordering rules if multiple spendable sub-buckets ever exist;
- whether admin/manual corrections can create available value directly;
- whether historical locked value needs migration/reclassification before enforcement.

## 15. Recommended Next Runtime Slice

Recommended next bounded runtime slice:

**Points Spendability Shadow Compare**

Scope:

- compute current total-balance spend eligibility;
- compute target available-only spend eligibility from ledger/bucket semantics;
- emit safe aggregate diagnostics;
- keep `/internal/points/spend` behavior unchanged;
- keep RF claim behavior unchanged;
- do not unlock referral Points;
- do not change wallet UI.

This is safer than hard enforcement because it measures how often current materialized balance would allow spend that target available-only semantics would deny.
