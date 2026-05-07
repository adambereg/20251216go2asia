# RF Repeatability Canon Design Audit (v1)

## Executive Summary

RF Slice 2.0 is a design-only pass after Stage 5.0 attribution, Slice 1 lifecycle alignment, and Slice 1.1 edge-case hardening. No runtime, migration, OpenAPI, SDK, generated artifact, or UI implementation is included here.

Main conclusion: RF repeatability must be designed around **voucher instances**, not reusable voucher rows. A repeatable offer should allow a new voucher instance only when policy says the previous instance no longer blocks claim eligibility. The voucher row remains the durable lifecycle object, redemption remains a per-instance durable fact, and attribution remains immutable per voucher instance.

The recommended canonical model for v1 is:

- default policy: `once_per_scope`;
- optional policy: `repeat_after_redeem`;
- one active or blocking instance per user/scope at a time;
- new claim after `redeemed` only for explicit repeatable offers;
- new claim after `expired` or `cancelled` can be allowed in v1 because those are terminal non-success states;
- no cooldown/max-count/economy rewards engine in the first implementation slice.

Repeatability should be treated as a foundation for retention and future economy, but it must not become a farming surface. Economy-facing rewards should later consume stricter events such as confirmed attributed redemption, not raw repeat claims.

## 1. Current State Audit

### Runtime State

Current runtime is effectively one-time per scope:

- Partner claim checks existing vouchers by `(offerId, issuedToUserId, claimScope='partner')`.
- Listing claim checks existing vouchers by `(listingId, offerId, issuedToUserId, claimScope='listing')`.
- Existing-voucher lookup treats canonical `available`, `locked`, `unlocked`, and `redeemed` as claim barriers.
- Insert conflict predicates also include canonical `available`, `locked`, `unlocked`, and `redeemed`.
- Redeem is already instance-based: it receives a specific `voucherId`, writes `rf_voucher_redemption`, and transitions that voucher instance to `redeemed`.

This means runtime currently supports:

- one partner-scoped voucher per offer/user;
- one listing-scoped voucher per listing/offer/user;
- multiple vouchers for the same offer/user only when scopes differ or listing ids differ.

It does not support:

- repeat claim after redeem in the same partner scope;
- repeat claim after redeem in the same listing scope;
- policy-driven eligibility;
- cooldowns, max counts, campaign budgets, or economy gates.

### Frontend / SDK State

Frontend helper semantics mirror current runtime:

- `isRfVoucherClaimBarrier()` treats `available`, `locked`, `unlocked`, and `redeemed` as blocking another claim.
- `expired` and `cancelled` are not barriers in frontend helper logic.
- `rfOfferClaim.ts` uses the claim barrier helper for partner-scope existing-voucher detection.
- listing voucher flow uses the same barrier philosophy for listing claims.
- PRO visibility is read-only and status labels are canonical-first after Slice 1.1.
- SDK DTOs expose `status`, `canonicalStatus`, `claimScope`, listing context, redemption timestamps, and attribution facts, but no repeatability fields.

### Contract State

OpenAPI/SDK currently describe lifecycle, not repeatability:

- `canonicalStatus` is primary lifecycle field;
- legacy `status` remains compatibility;
- `RfVoucherSummary` counts voucher rows/instances;
- no `repeatPolicy`, `repeatEligibility`, `nextClaimAt`, `cooldownUntil`, `lineageId`, or `repeatCount` exists.

## 2. Architectural Gaps

The current system is ready for repeatability design, but not for repeatability runtime:

- Unique indexes and `ON CONFLICT` predicates still treat `redeemed` as blocking.
- Claim logic has no policy source to distinguish `once_per_scope` from `repeat_after_redeem`.
- Idempotency replay returns a voucher instance, but repeatability needs explicit guarantees that replay never recalculates eligibility.
- Wallet and summary count voucher instances, but copy/UX does not yet distinguish "voucher instances" from "unique offers".
- PRO attributed visibility would show multiple instances for the same offer/user if repeatability creates them.
- Attribution is correct only if it remains per voucher instance; any relationship-level overwrite would violate Stage 5.0 canon.
- Future rewards/economy would be unsafe if they consume repeat claims without cooldowns, caps, abuse detection, and redemption-based qualification.

## 3. Repeatability Models Comparison

### Model A - Reusable Voucher Row

Description: one `rf_voucher` row can be claimed/redeemed multiple times.

Rejected.

Why:

- breaks voucher lifecycle as a durable instance;
- makes `redeemed_at` and `rf_voucher_redemption` ambiguous;
- makes attribution mutable or multi-valued on one row;
- complicates audit, PRO visibility, and economy rules.

### Model B - Offer-level Repeat Policy

Description: `rf_offer` owns a small repeatability policy. Each successful claim creates or returns a voucher instance. Repeatable offers may create a new instance after eligible terminal states.

Recommended v1.

Why:

- keeps RF ownership local;
- preserves voucher-as-instance semantics;
- aligns with current scope-aware uniqueness;
- allows default `once_per_scope`;
- permits `repeat_after_redeem` without introducing a full policy engine.

### Model C - Campaign/Policy Engine Now

Description: introduce rich policy rules immediately: cooldown, max counts, budgets, time windows, VIP gates, points gates, merchant campaign editor.

Rejected for Slice 2.1.

Why:

- too broad;
- mixes repeatability with economy and merchant tooling;
- high race/abuse risk;
- would obscure the core lifecycle model.

### Model D - Offer-level Policy Now, Campaign Engine Later

Description: start with Model B and leave explicit extension points for campaign/policy engines.

Recommended strategic path.

Why:

- bounded first implementation;
- gives future economy a stable event shape;
- avoids premature Points/G2A/NFT coupling.

## 4. Recommended Canonical Model

### Definitions

**Repeatable offer:** an RF offer whose policy allows a user to create a new voucher instance after the previous scoped instance reaches an eligible terminal state.

**Voucher instance:** a single `rf_voucher` row with its own lifecycle, claim timestamp, redemption row, attribution fact, and API identity. A repeat claim creates a new instance; it does not reset the old voucher.

**Scope:** the uniqueness boundary for a voucher instance.

- Partner scope: `(offerId, userId)`.
- Listing scope: `(listingId, offerId, userId)`.

### Canonical Policies

V1 policy set:

- `once_per_scope`: default; current behavior.
- `repeat_after_redeem`: future implementation; allows new instance after `redeemed`, if no active/blocking instance remains.

Deferred policies:

- `repeat_after_expiry_only`;
- `daily`;
- `weekly`;
- `cooldown`;
- `max_per_user`;
- `campaign_budget`;
- `VIP/Points/NFT gated`.

### Re-claim Rules by Lifecycle State

`available`

- Active, claim barrier.
- Re-claim: no.

`locked`

- Active, non-redeemable, claim barrier.
- Re-claim: no.

`unlocked`

- Active/redeemable, claim barrier.
- Re-claim: no.

`redeemed`

- Terminal success.
- `once_per_scope`: no re-claim.
- `repeat_after_redeem`: yes, create a new voucher instance if other policy checks pass.

`expired`

- Terminal non-success.
- V1 recommendation: allow re-claim even for `once_per_scope`, unless product wants expiry to consume eligibility.
- Rationale: expiration should not be equivalent to successful use.
- Economy note: expired vouchers must not create reward/redeem credit.

`cancelled`

- Terminal non-success/admin/user/system state.
- V1 recommendation: allow re-claim by default, but keep cancellation reason for future abuse/risk checks.

### Cooldown and Max Count

Cooldown should exist conceptually, but not in the first runtime implementation unless product requires it immediately.

Recommended sequencing:

1. Slice 2.1: no cooldown engine; only policy foundation and repeat-after-redeem eligibility.
2. Later Slice: add `cooldownUntil` / `nextClaimAt` once merchant/economy requirements exist.
3. Economy phase: introduce max count, budget, and risk controls before reward-bearing loops.

### Repeatability Dimensions

Canonical v1 dimensions:

- per user;
- per offer;
- per scope;
- per listing for listing claims.

Deferred dimensions:

- per timeframe;
- per merchant campaign;
- per region;
- per user trust level;
- per PRO attribution channel;
- per economy budget.

### Listing Claims

Listing claims should remain scoped to listing context.

Recommended v1 rule:

- partner-scope repeatability does not automatically govern listing-scope instances;
- listing repeatability is per `(listingId, offerId, userId)`;
- if an offer is repeatable, listing-scoped repeat after redeem is allowed only for the same listing scope after the previous listing voucher is redeemed;
- different listings can already produce different instances and should remain separate.

## 5. Attribution Implications

### Canonical Decision

Attribution is immutable **per voucher instance**, not per offer-user relationship.

This preserves Stage 5.0 invariants:

- first successful durable action wins;
- normal product flows do not mutate attribution;
- invalid attribution remains non-blocking;
- redeem does not mutate attribution.

### New Repeat Claim

A new repeatable voucher instance should run fresh attribution resolution at claim time:

- if user claims through PRO A share code: new instance can be attributed to PRO A;
- if later repeat claim happens through PRO B share code: new instance can be attributed to PRO B;
- if repeat claim is direct: new instance can have `none`/direct attribution;
- old instances never change.

### No Attribution Overwrite

Do not overwrite an earlier voucher's attribution because:

- it breaks auditability;
- it creates dispute risk;
- it enables PRO link farming;
- it destroys per-instance economy traceability.

### Attribution Farming Risk

Repeatability opens new farming vectors:

- PRO repeatedly drives same user to claim/redeem low-friction offers;
- user rotates PRO links before each repeat claim;
- merchant or PRO self-generates repeat vouchers;
- direct-to-PRO attribution switching is used to inflate future rewards.

Minimum controls before any economy/rewards:

- rewards should not be based on claim alone;
- use confirmed attributed redemption or stronger merchant-confirmed event;
- cap rewardable events by user/offer/partner/timeframe;
- log attribution source and policy version per instance;
- keep rejected/none attribution visible to internal diagnostics, not public payout surfaces.

## 6. Wallet / History Semantics

### Current Meaning

Wallet and summary currently show voucher rows. After repeatability, each row is a voucher instance.

This must be explicit:

- `totalVouchers` means total voucher instances;
- `usedVouchers` means redeemed instances;
- active vouchers means active instances, not unique offers.

### Recommended Wallet Model

Wallet should store and display all voucher instances, but UI may group them.

Recommended presentation:

- show latest active voucher prominently;
- show redeemed/expired/cancelled instances in history;
- group repeated instances by offer/listing when helpful;
- do not hide historical redeemed instances because they are durable facts.

### Lineage / Parent Relationship

For v1, avoid parent-child lineage unless there is a clear use case.

Potential future fields:

- `repeatSeriesId` or `lineageId`: stable grouping for all instances created by repeat policy for the same user/scope;
- `issueSequence`: 1, 2, 3... within a repeat series;
- `previousVoucherId`: optional audit link.

Recommendation:

- Slice 2.1 should decide whether `issueSequence` or `repeatSeriesId` is necessary before implementation.
- If not necessary, derive grouping by `(userId, offerId, claimScope, listingId)` for read models.

### Repeat Counter

Useful for UX and anti-abuse, but should be derived or snapshotted deliberately.

Potential semantics:

- `repeatCount`: number of prior successful issued instances in the same scope;
- `redeemCount`: number of redeemed instances;
- `claimInstanceOrdinal`: ordinal of this voucher instance.

Avoid ambiguous counters in public contract until policy is stable.

## 7. Anti-Abuse Analysis

### Abuse Vectors

Repeatability can enable:

- infinite claim loops;
- infinite redemption loops;
- PRO attribution farming;
- merchant budget drain;
- duplicate discounts without real purchase/use;
- user account cycling;
- self-referral via PRO links;
- automated claim/redeem scripts;
- geographic or device spoofing once rewards exist.

### Mandatory V1 Controls

Before repeatability runtime:

- race-safe database guard for active/blocking instances;
- idempotency keys bind to a specific created/returned voucher instance;
- rate limiting for claim/redeem remains enforced;
- `once_per_scope` remains default;
- repeatability is explicit per offer/policy, not global;
- no economy/rewards for claims;
- no rewards for expired/cancelled/unredeemed instances;
- attribution remains per instance.

### Deferred Controls

Defer until economy or high-value merchant campaigns:

- cooldown engine;
- max repeat count;
- campaign budget;
- per-device limits;
- phone/email verification gates;
- region/IP/device heuristics;
- risk scoring;
- merchant-configurable limits;
- internal abuse review dashboard.

### Economy-Ready Controls

Before Points/G2A/rewards:

- rewardable event should be redemption or stronger merchant-confirmed outcome, not claim;
- caps by `(user, offer, partner, timeframe)`;
- caps by `(PRO, partner, timeframe)` for attributed rewards;
- anomaly detection for repeated direct/PRO switching;
- merchant opt-in for reward-bearing repeatability.

## 8. Runtime / Store Impact

### Store Assumptions That Are One-time Today

- Existing-voucher lookup includes `redeemed` as a barrier.
- `ON CONFLICT` predicates include `redeemed`.
- Claim short-circuit returns existing voucher instead of evaluating repeat policy.
- Claim idempotency has no repeat-cycle semantics.
- Listing duplicate logic assumes one active/redeemed voucher per listing/offer/user.
- PRO visibility and summary count instances but UI copy may be read as unique claims.

### Unique Constraints

Current constraints are correct for `once_per_scope`, but not for `repeat_after_redeem`.

Future implementation must choose one of:

1. Separate indexes for active instances only plus policy-aware guards.
2. Keep current one-time index for default policy and add repeatable-specific guard table.
3. Add a policy/scope key or cycle identifier to uniqueness.

Recommended Slice 2.1 path:

- do not drop one-time constraints casually;
- introduce policy-aware migration plan with preflight duplicate checks;
- preserve active-instance uniqueness;
- allow historical `redeemed` instances to coexist only when offer policy permits repeatability.

### Idempotency

Repeatability must not change idempotent replay semantics:

- same idempotency key returns the same voucher instance;
- context mismatch remains a conflict;
- replay must not re-evaluate repeat eligibility or produce a newer instance;
- different idempotency key may create a new instance only if policy allows it.

### Queries Requiring Redesign

Future implementation will need query separation:

- latest active/blocking instance;
- latest terminal instance;
- redeemed count per user/scope;
- eligible-to-repeat computation;
- history list by offer/scope;
- PRO attributed instance list with repeat grouping.

### Lifecycle Helper Assumptions

Frontend `isRfVoucherClaimBarrier()` is not a policy engine. It only helps local UI avoid duplicate claims under current semantics.

Future repeatability UI needs API-driven eligibility:

- `canClaim`;
- `reason`;
- `nextClaimAt`;
- `existingActiveVoucherId`;
- `latestRedeemedVoucherId`.

Do not infer repeatability solely from status on the client.

## 9. API / DTO Planning Notes

No OpenAPI/SDK changes in Slice 2.0.

Potential future additive fields:

On offer:

- `repeatPolicy`;
- `repeatable`;
- `repeatPolicyVersion`;
- `repeatCooldownSeconds`;
- `maxRepeatsPerUser`;
- `repeatWindow`.

On claim eligibility / offer listing:

- `repeatEligibility`;
- `canClaim`;
- `claimBlockReason`;
- `nextClaimAt`;
- `cooldownUntil`;
- `existingVoucherId`;
- `latestVoucherId`.

On voucher:

- `repeatPolicySnapshot`;
- `repeatSeriesId`;
- `issueSequence`;
- `previousVoucherId`;
- `cycleId`;
- `isRepeatInstance`.

On summary/history:

- `activeInstances`;
- `redeemedInstances`;
- `uniqueOffersClaimed`;
- `repeatInstances`;
- `latestActiveByOffer`.

Recommendation:

- keep DTOs additive;
- do not remove legacy `status`;
- do not make frontend calculate eligibility from status alone;
- distinguish "voucher instances" from "unique offers/users" in descriptions.

## 10. Future Economy Alignment

Repeatability can help economy if it is constrained:

- supports retention loops;
- lets everyday offers become recurring sinks;
- gives merchants repeat visits;
- allows future premium/Points-gated campaigns;
- creates longitudinal PRO attribution facts.

Repeatability can also destroy value if unconstrained:

- unlimited discounts reduce scarcity;
- rewards can be farmed;
- PRO incentives can become spammy;
- merchants may perceive RF as cost leakage rather than marketing;
- token sinks/sources can inflate.

Canonical economy posture:

- Repeatability is not an economy feature by itself.
- Repeat claims are not rewardable events.
- Repeat redemptions may become rewardable only under explicit economy policy.
- PRO rewards should be based on qualified outcomes, not raw attributed claims.
- High-value repeatable offers require cooldowns, caps, budgets, and merchant opt-in.

Recommended economy alignment:

- everyday low-value offers: repeatable with low/no rewards;
- high-value offers: one-time or capped;
- PRO incentives: reward confirmed redemptions or merchant-approved outcomes;
- token sinks: use repeatability as a future engagement loop, not as open minting.

## 11. Architectural Risks

Top risks:

1. Changing unique predicates without a policy-safe guard can create duplicate active vouchers.
2. Treating `redeemed` as globally non-blocking would silently change one-time offers.
3. Claim idempotency could accidentally create a new repeat instance on replay.
4. Attribution could be incorrectly modeled as offer-user relationship instead of instance fact.
5. Wallet/summary could confuse instances with unique offers.
6. PRO dashboards could imply earnings from repeated attributed claims.
7. Future rewards could be farmed if claims are rewardable.
8. Listing-scoped repeatability could accidentally collapse across listings.

## 12. Open Unresolved Questions

1. Should `expired` consume one-time eligibility, or should it always allow a new claim?
2. Should `cancelled` always allow a new claim, or depend on cancellation reason?
3. Does `repeat_after_redeem` apply equally to partner and listing scopes?
4. Is `issueSequence` needed in v1, or can it be derived?
5. Should repeatability be visible on public offer cards before claim?
6. Should merchant owners control repeat policy in early versions, or should it remain platform-configured?
7. What event becomes rewardable in future economy: claim, redemption, merchant confirmation, spend threshold, or repeat streak?
8. How should PRO attribution be de-duplicated for reward purposes if a user repeats the same offer many times?

## 13. Explicit Non-goals

Slice 2.0 does not include:

- runtime implementation;
- DB migrations;
- schema edits;
- OpenAPI edits;
- SDK regeneration;
- store refactor;
- UI redesign;
- repeatability runtime engine;
- cooldown/max-count engine;
- economy/rewards/payouts;
- Points/G2A/NFT;
- Connect projection expansion;
- merchant dashboard/campaign editor;
- admin correction UI.

## Appendix - Slice 2.1 Recommended Implementation Scope

This appendix is a proposal only.

### Bounded Implementation Plan

Recommended Slice 2.1 scope:

1. Introduce minimal repeat policy source:
   - default `once_per_scope`;
   - explicit `repeat_after_redeem`.
2. Add policy-aware eligibility resolver in backend:
   - separates active/blocking instance lookup from terminal history lookup;
   - keeps idempotency replay stable;
   - supports partner/listing scopes.
3. Preserve voucher-as-instance model:
   - new repeat claim creates new `rf_voucher` row;
   - previous redeemed voucher remains immutable.
4. Add additive DTO fields only if needed for UI:
   - `canClaim` / `repeatEligibility` / `nextClaimAt` candidate fields.
5. Keep frontend redesign out:
   - use API eligibility result;
   - no new product surfaces beyond minimal labels/errors.

### Suggested Migration Order

Potential migration sequence for Slice 2.1 or later:

1. Add offer repeat policy field with default `once_per_scope`.
2. Optionally add voucher policy snapshot / issue sequence fields if design chooses persistent instance metadata.
3. Add policy-aware indexes or guard table after preflight duplicate checks.
4. Keep old one-time behavior until runtime is policy-aware.
5. Roll out contract fields additively after backend behavior is stable.

### Suggested Runtime Phases

Phase A - Read-only policy plumbing:

- backend can read policy;
- no repeat behavior changed.

Phase B - Eligibility resolver:

- computes active barrier, terminal history, policy result;
- tests only / internal use.

Phase C - Claim write path:

- `once_per_scope` unchanged;
- `repeat_after_redeem` creates new instance after redeemed and no active barrier.

Phase D - DTO/frontend:

- expose eligibility additively;
- UI uses server eligibility, not local status inference.

Phase E - Observability:

- log repeat claim decisions;
- add diagnostics for blocked vs allowed repeat claims.

### Suggested Test Matrix

Backend:

- `once_per_scope`: active states block, redeemed blocks, expired/cancelled behavior matches decision.
- `repeat_after_redeem`: redeemed allows new instance, active states block.
- listing scope: repeat behavior is per listing.
- idempotency: same key returns same instance; different key follows policy.
- attribution: new instance gets fresh attribution; previous instance not mutated.
- race: concurrent repeat claims do not create duplicate active instances.
- summary/PRO visibility: multiple instances are counted and listed as instances.

Frontend/SDK:

- API eligibility fields drive claim button state.
- local claim barrier remains compatibility fallback only.
- wallet groups or displays repeated instances without hiding history.
- PRO visibility does not imply payout/reward.

### Slice 2.1 Readiness Verdict

Ready for a bounded implementation plan after explicit decisions on:

- whether `expired` and `cancelled` allow re-claim under `once_per_scope`;
- whether persistent `repeatPolicySnapshot` / `issueSequence` are required in v1;
- exact database guard strategy for active uniqueness plus repeatable history.

