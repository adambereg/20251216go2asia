# RF Slice 2.1 - Repeatability Runtime Implementation Plan (v1)

## 1. Executive Summary

RF Slice 2.1 is a planning-only pass after Stage 5.0 attribution, Slice 1 lifecycle/redemption alignment, Slice 1.1 edge-case hardening, and Slice 2.0 repeatability canon. No runtime code, migrations, OpenAPI, SDK, generated files, or frontend code are changed by this document.

Main recommendation: implement repeatability through the **voucher-as-instance model** with a small offer-level policy, an auditable voucher snapshot, and a policy-aware claim eligibility resolver. The first runtime slice should be behavior-preserving by default: existing offers remain `once_per_scope`, claim idempotency continues to return the same voucher instance, and no frontend control is exposed for repeatable offers yet.

The safe DB direction is not to simply remove `redeemed` from existing partial unique indexes. That would make redeemed vouchers globally non-blocking and would break one-time offers. The recommended guard model is:

- `rf_offer.repeat_policy` as the minimal policy source;
- `rf_voucher.repeat_policy_snapshot` and `issue_sequence` for auditability;
- active-only voucher uniqueness for `available | locked | unlocked`;
- a separate one-time consumption guard keyed by normalized claim scope to preserve `once_per_scope` after successful redemption;
- transaction-level serialization around claim eligibility and voucher creation.

## 2. Current Runtime Constraints

The current RF runtime is intentionally one-time per scope:

- partner claim checks `(offerId, issuedToUserId, claimScope='partner')`;
- listing claim checks `(listingId, offerId, issuedToUserId, claimScope='listing')`;
- existing voucher lookup treats canonical `available`, `locked`, `unlocked`, and `redeemed` as claim barriers;
- claim `ON CONFLICT` predicates also include canonical `redeemed`;
- legacy unique indexes still include `status IN ('claimed', 'redeemed')`;
- `expired` and `cancelled` are terminal canonical states, but legacy index behavior can still make `expired` rows with `status='claimed'` risky until index cleanup is planned.

Relevant current schema facts:

- `rf_offer` has no repeat policy field.
- `rf_voucher` has canonical lifecycle, claim scope, listing snapshot, attribution columns, but no repeat snapshot/sequence fields.
- `rf_voucher_redemption` is already a per-voucher durable fact with one successful redemption per voucher instance.
- `rf_claim_idempotency` maps `(operation, actor_user_id, idempotency_key)` to a voucher; operation is currently `voucher_claim`.
- PRO attribution visibility reads confirmed voucher instances by `pro_attributed_user_id` and already supports multiple rows if repeatability later creates them.

Frontend and contract constraints:

- `canonicalStatus` is primary lifecycle field; legacy `status` remains compatibility.
- `isRfVoucherClaimBarrier()` currently treats `redeemed` as blocking, which is correct for the current one-time runtime but cannot be the future repeatability policy engine.
- `RfMyVouchersView`, Connect projection, and PRO attributed vouchers are mostly instance-friendly because they key by voucher id.
- OpenAPI/SDK currently expose no `repeatPolicy`, `repeatPolicySnapshot`, `issueSequence`, or server-side eligibility shape.

## 3. Repeatability Goals

Slice 2.1 planning goals:

- preserve default one-time behavior for all existing offers;
- introduce explicit repeatability only through policy;
- keep voucher instances immutable and auditable;
- allow a new voucher instance after `redeemed` only for `repeat_after_redeem`;
- keep one active/blocking instance per user/scope at a time;
- keep idempotency replay tied to the originally returned voucher instance;
- resolve attribution freshly only when a new voucher instance is created;
- keep PRO visibility factual and per voucher instance;
- prepare additive contracts without forcing a frontend redesign.

## 4. Non-goals

Not in the implementation slice planned here:

- reusable voucher rows;
- cooldown engine;
- max repeat count;
- timeframe policies;
- campaign budgets;
- merchant campaign editor;
- reward, payout, commission, income, balance, accrual, or token logic;
- Points/G2A/NFT gates;
- Connect ownership or expanded projection;
- centralized attribution runtime;
- attribution correction/mutation UI;
- frontend redesign.

## 5. Canonical Runtime Model

Repeatability creates a new `rf_voucher` row. The old voucher remains historical and immutable.

Scope stays the unit of eligibility:

- partner scope: `(offerId, issuedToUserId)`;
- listing scope: `(listingId, offerId, issuedToUserId)`.

Lifecycle states are classified for claim eligibility as:

- active/blocking: `available`, `locked`, `unlocked`;
- terminal success: `redeemed`;
- terminal non-success: `expired`, `cancelled`.

Re-claim rules:

- `available`, `locked`, `unlocked`: always block a new claim in the same scope.
- `redeemed`:
  - `once_per_scope`: blocks a new claim in the same scope;
  - `repeat_after_redeem`: allows a new instance if no active instance exists.
- `expired`: allow re-claim by default, including `once_per_scope`, because expiry is not successful consumption.
- `cancelled`: allow re-claim by default, unless future cancellation reason/risk policy says otherwise.

This makes "one-time" mean one successful consumption per scope, not "one claim attempt forever." It also preserves the current user-friendly behavior where cancelled vouchers do not permanently consume eligibility.

## 6. Repeat Policy Source

Recommended source: `rf_offer.repeat_policy`.

Minimal enum:

- `once_per_scope`;
- `repeat_after_redeem`.

Rationale:

- claim already resolves an offer before issuing a voucher;
- offer-level policy is simple enough for the first runtime slice;
- default `once_per_scope` preserves existing behavior;
- policy table or campaign engine is unnecessary for two v1 policies;
- guard table alone is not a policy source because it cannot tell product intent.

Deferred:

- separate policy table;
- campaign/policy engine;
- merchant editable repeat rules;
- VIP/Points/NFT gates;
- cooldown/max-count fields.

Policy change governance should be conservative. In the first runtime slice, no public UI should allow policy changes. Internal seed/test data can use `repeat_after_redeem`; production rollout should require explicit operator control and regression checks.

## 7. Voucher Snapshot Strategy

Recommended fields for Slice 2.1 implementation:

- `rf_voucher.repeat_policy_snapshot`: stores effective policy at claim time;
- `rf_voucher.issue_sequence`: integer sequence within the normalized user/offer/scope series.

Why include both:

- `repeat_policy_snapshot` explains why a voucher instance was issued under a given rule even if offer policy changes later;
- `issue_sequence` gives wallet, support, audit, and tests a simple way to distinguish first vs repeated instances;
- both fields keep voucher-as-instance history readable without introducing a lineage graph.

Recommended defaults/backfill:

- existing vouchers get `repeat_policy_snapshot='once_per_scope'`;
- existing vouchers get `issue_sequence=1`;
- new repeatable vouchers compute `issue_sequence = previous max sequence in scope + 1` inside the claim transaction.

Deferred fields:

- `repeat_series_id`: derive the series from `(offerId, issuedToUserId, claimScope, normalizedListingId)` until a concrete cross-scope UX or analytics need appears;
- `previous_voucher_id`: useful for lineage graphs, but not needed for v1 because chronological ordering and scope key are sufficient;
- `cycleId`: defer until campaign/time-window policies exist.

## 8. DB Guard / Index Strategy

The DB strategy must solve two separate constraints:

1. at most one active voucher instance per scope;
2. one successful redeemed voucher continues to block future claims for `once_per_scope`.

Recommended target shape:

### Active-only voucher uniqueness

Create new partial unique indexes:

- partner: `(offer_id, issued_to_user_id)` where `claim_scope='partner' AND canonical_status IN ('available','locked','unlocked')`;
- listing: `(rielt_listing_id, offer_id, issued_to_user_id)` where `claim_scope='listing' AND canonical_status IN ('available','locked','unlocked')`.

These protect active instances for both `once_per_scope` and `repeat_after_redeem`.

### One-time consumption guard

Add a separate guard table for successful one-time consumption. Suggested conceptual shape:

```text
rf_voucher_scope_consumption_guard
  offer_id
  issued_to_user_id
  claim_scope
  scope_ref          -- '__partner__' for partner scope, listingId for listing scope
  consumed_voucher_id
  repeat_policy_snapshot
  consumed_at
  created_at
  unique (offer_id, issued_to_user_id, claim_scope, scope_ref)
```

This guard is inserted/backfilled for successful `redeemed` vouchers that consume one-time eligibility. It is not inserted for `expired` or `cancelled`, because those are terminal non-success states.

Why a guard table is better than relying only on `rf_voucher`:

- Postgres partial unique indexes cannot join `rf_offer.repeat_policy`;
- removing `redeemed` from voucher indexes would lose DB-level one-time protection;
- application-only checks are race-prone;
- a guard table can be inserted atomically with redemption/claim logic and backfilled from historical redeemed vouchers.

### Transaction and lock strategy

Claim should run the eligibility decision and voucher/idempotency writes in one transaction. For extra race safety, use a transaction-scoped advisory lock or equivalent DB serialization key based on normalized scope:

```text
rf_claim:{offerId}:{issuedToUserId}:{claimScope}:{scopeRef}
```

The lock is not the source of truth. It only reduces conflict churn around:

- issue sequence calculation;
- active instance lookup;
- idempotency binding;
- guard lookup/insert.

### Migration caution

Do not drop the existing redeemed-inclusive indexes before:

- the one-time guard table exists;
- guard rows are backfilled from existing redeemed vouchers;
- active-only indexes are created and validated;
- claim resolver reads both old and new guard semantics in a compatibility window;
- rollback plan is tested.

## 9. Eligibility Resolver Design

Introduce a testable backend resolver before spreading policy checks through claim code.

Inputs:

- `userId`;
- `offerId`;
- optional `listingId`;
- `scope`: `partner | listing`;
- `idempotencyKey`;
- validated offer/listing/partner context;
- effective `repeatPolicy`;
- existing active instance rows;
- historical terminal rows;
- one-time consumption guard row;
- current transient attribution payload.

Outputs:

- `canClaim`;
- `decision`: `return_existing | create_new | block | context_mismatch`;
- `existingVoucherId`;
- `existingActiveVoucherId`;
- `latestRedeemedVoucherId`;
- `blockReason`;
- `repeatPolicy`;
- `repeatPolicySnapshot`;
- `issueSequence`;
- `attributionShouldResolve`.

Resolver ordering:

1. Check claim idempotency replay first. If present and context matches, return that voucher. Do not recalculate eligibility or attribution.
2. Validate offer/listing/partner context exactly as today.
3. Resolve effective repeat policy from `rf_offer.repeat_policy`, defaulting to `once_per_scope`.
4. Normalize scope key.
5. Load active instance for `available | locked | unlocked`.
6. If active exists, return/block with existing active voucher and do not resolve attribution.
7. For `once_per_scope`, check one-time consumption guard or historical redeemed compatibility path. If consumed, return/block with latest redeemed voucher.
8. For `repeat_after_redeem`, allow create-new after redeemed if no active instance exists.
9. Treat `expired` and `cancelled` as non-consuming terminal states unless future risk policy says otherwise.
10. Only on `create_new`, calculate next `issueSequence` and resolve attribution freshly.
11. Bind the idempotency key to the returned or newly created voucher.

The resolver should be usable by partner claim and listing claim with only a scope adapter.

## 10. Claim Flow Changes

Partner claim target flow:

1. Replay idempotency by `(actorUserId, idempotencyKey)`.
2. Validate active/public offer and active partner.
3. Start transaction/lock on normalized partner scope.
4. Resolve eligibility.
5. If resolver returns an existing voucher, return it with existing API semantics.
6. If resolver allows new instance, insert `rf_voucher` with:
   - `status='claimed'`;
   - `canonical_status='available'`;
   - `claim_scope='partner'`;
   - `repeat_policy_snapshot`;
   - `issue_sequence`;
   - fresh attribution fields.
7. Insert idempotency binding to the selected voucher.
8. Return the voucher.

For `once_per_scope`, current behavior should remain effectively unchanged for existing offers: active and redeemed vouchers still prevent a new instance. The difference is that the reason becomes explicit in the resolver instead of hidden inside partial unique predicates.

## 11. Listing Claim Flow Changes

Listing claim should share the resolver but preserve listing-specific validation:

- listing exists, published, not deleted;
- listing-offer mapping is active;
- offer is active/public;
- partner is active;
- offer partner matches mapping partner;
- optional listing `rfPartnerId` matches mapped partner.

Scope key:

```text
claimScope = 'listing'
scopeRef = listingId
series = (listingId, offerId, issuedToUserId)
```

Repeatability applies within the listing scope. A redeemed voucher for listing A must not block claim eligibility for listing B unless a future policy explicitly defines cross-listing limits.

## 12. Idempotency Semantics

Idempotency remains request replay protection, not repeatability policy.

Rules:

- the same idempotency key returns the same voucher instance;
- replay never recalculates repeat eligibility;
- replay never re-resolves attribution;
- same key with a different offer/listing/scope returns `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`;
- a different idempotency key may create a new voucher only if resolver policy allows it;
- idempotency binding must happen in the same transaction boundary as voucher selection/creation.

Current `rf_claim_idempotency.operation='voucher_claim'` can remain unchanged for Slice 2.1. There is no need to add wider claim operation enums for repeatability.

## 13. Attribution Semantics

Attribution stays immutable per voucher instance.

Rules:

- existing voucher replay returns existing attribution;
- active/redeemed one-time blocking returns existing voucher attribution;
- new repeat instance runs fresh attribution resolution from the current claim payload;
- previous voucher attribution is never overwritten;
- repeat claim through another PRO share code may attribute the new instance to the new PRO if validation passes;
- repeat claim direct/no share may create the new instance with `none` or direct/unknown attribution, without changing earlier PRO-attributed instances.

PRO visibility impact:

- PRO attributed list may show multiple voucher instances for the same offer/user journey;
- it must remain factual: attributed voucher, claim recorded, redeemed status;
- no reward, payout, commission, earnings, income, balance, or accrual semantics.

Future economy should consume stricter events such as confirmed attributed redemption, not raw repeat claims.

## 14. OpenAPI / SDK Plan

OpenAPI/SDK changes should be additive and staged after backend/schema decisions are ready.

Minimal schema additions:

- `RfRepeatPolicy`: `once_per_scope | repeat_after_redeem`;
- `RfOffer.repeatPolicy?: RfRepeatPolicy`;
- `RfVoucher.repeatPolicySnapshot?: RfRepeatPolicy`;
- `RfVoucher.issueSequence?: number`;
- `RfClaimResponse.createdNewInstance?: boolean`;
- `RfClaimResponse.claimBlockReason?: RfClaimBlockReason | null`.

Optional eligibility schema for a later or same additive contract slice:

```text
RfClaimEligibility
  canClaim
  repeatPolicy
  blockReason
  existingActiveVoucherId
  latestRedeemedVoucherId
  nextClaimAt
```

Recommendation for Slice 2.1:

- add `repeatPolicy` to offer read models;
- add snapshot/sequence to voucher DTOs;
- add claim response clarity fields if the resolver is implemented;
- avoid `nextClaimAt` until cooldown exists;
- avoid `remainingClaims`, budgets, and repeat limits until policy engine exists.

The frontend should treat missing repeat fields as `once_per_scope`.

## 15. Frontend Compatibility Plan

Frontend should not become the repeatability authority.

Near-term approach:

- keep `isRfVoucherClaimBarrier()` as a fallback for old contracts;
- prefer server-provided eligibility/claim response once available;
- do not treat `redeemed` as globally blocking when the server explicitly says `canClaim=true`;
- allow My Vouchers to show multiple cards for the same offer/scope over time;
- keep Connect and PRO views instance-based;
- do not add merchant-facing repeat policy controls in the first runtime slice.

Minimal UI copy direction:

- allowed: "Можно получить снова после использования" for explicit repeatable offers;
- avoid money/economy language;
- avoid implying rewards, payouts, income, or commissions.

No frontend redesign is required for Slice 2.1. The first implementation can keep current button behavior if no public repeatable offers are enabled yet.

## 16. Wallet / Summary / PRO Visibility Impact

Wallet:

- wallet stores voucher instances;
- repeated claims appear as separate vouchers;
- `issueSequence` can help support/debug and later UI copy.

Summary:

- `totalVouchers`, `activeVouchers`, `usedVouchers`, `cancelledVouchers`, and `expiredVouchers` continue to count instances;
- do not add unique-offer summary fields unless product asks for them later.

PRO visibility:

- list remains per confirmed attributed voucher instance;
- multiple instances for one offer are valid;
- sorting newest-first still works by `claimedAt`;
- no user identity or voucher code should be exposed.

Merchant redeem:

- still redeems by `voucherId`;
- successful redemption affects only that voucher instance;
- repeatability does not change redemption idempotency.

## 17. Tests and CI Gates

Backend tests:

- default `once_per_scope`: claim -> redeem -> second claim blocked/returns existing redeemed result;
- `repeat_after_redeem`: claim -> redeem -> second claim creates new voucher instance;
- active states `available`, `locked`, `unlocked` block repeat claims for all policies;
- `expired` allows re-claim;
- `cancelled` allows re-claim unless future reason policy says otherwise;
- same idempotency key returns the same instance after lifecycle changes;
- different key after redeem follows policy;
- context mismatch still returns `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`;
- listing repeatability is scoped by `(listingId, offerId, userId)`;
- partner and listing scopes remain independent;
- concurrent repeat claims create at most one active instance;
- one-time guard prevents race after redeemed;
- issue sequence increments deterministically;
- new repeat instance resolves fresh attribution;
- old instance attribution remains immutable;
- PRO attributed list returns multiple confirmed instances when expected;
- summary counts instances.

DB/migration tests or preflight checks:

- backfill guard from existing redeemed vouchers;
- validate no duplicate active vouchers before active-only unique indexes;
- validate normalized listing scope key uniqueness;
- validate old redeemed-inclusive indexes are not dropped before guards exist.

Frontend tests:

- claim UI prefers server eligibility when present;
- lifecycle helper remains fallback;
- My Vouchers renders repeated instances without dedupe;
- Connect projection counts instances;
- PRO attributed list sorts and labels multiple instances;
- no forbidden economy copy appears.

CI gates:

- `pnpm -C apps/rf-service test`;
- `pnpm -C apps/rf-service typecheck`;
- `pnpm -C packages/sdk typecheck`;
- `pnpm -C packages/types typecheck`;
- targeted PWA RF tests;
- targeted PWA lint;
- `pnpm openapi:bundle`;
- `pnpm gen:types`;
- `pnpm gen:sdk`;
- `pnpm openapi:check`;
- `git diff --check`.

## 18. Migration Plan

Recommended migration sequence:

1. Add enum/type for repeat policy.
2. Add `rf_offer.repeat_policy NOT NULL DEFAULT 'once_per_scope'`.
3. Add `rf_voucher.repeat_policy_snapshot NOT NULL DEFAULT 'once_per_scope'`.
4. Add `rf_voucher.issue_sequence NOT NULL DEFAULT 1`.
5. Add one-time consumption guard table with normalized scope key.
6. Backfill guard rows from existing redeemed vouchers under `once_per_scope`.
7. Add active-only unique indexes with new names.
8. Deploy resolver in compatibility mode while old redeemed-inclusive indexes still protect current behavior.
9. Validate guard coverage and active-only uniqueness.
10. In a separate guarded cutover, drop redeemed-inclusive voucher unique indexes only after rollback and validation are ready.
11. Enable `repeat_after_redeem` only for explicit internal/seeded offers first.

This sequence avoids a production window where redeemed vouchers are non-blocking without a one-time guard.

## 19. Rollback Strategy

Rollback principles:

- schema additions are additive and can remain unused;
- default `once_per_scope` must preserve current behavior;
- if resolver rollout fails, switch claim paths back to current barrier lookup while keeping new columns dormant;
- do not drop old redeemed-inclusive indexes in the same deploy that first introduces policy/resolver;
- if active-only index cutover fails, recreate or retain the old redeemed-inclusive indexes and disable repeatable offers;
- keep `repeat_after_redeem` behind operational rollout, not merchant UI.

Operational rollback levers:

- set all offers to `once_per_scope`;
- disable feature flag for repeatable claim creation;
- keep frontend on existing fallback behavior;
- leave guard table and snapshot fields in place for later cleanup.

## 20. Implementation Phases

### Phase A - Schema Foundation

Add policy/snapshot/sequence fields and one-time guard table. Backfill defaults. No product behavior change.

### Phase B - Resolver Foundation

Introduce policy-aware eligibility resolver and wire partner/listing claim through it in compatibility mode. Default `once_per_scope` should match existing behavior.

### Phase C - Guard Validation

Backfill and validate consumption guards from historical redeemed vouchers. Add active-only indexes. Add race tests.

### Phase D - Index Cutover

Drop redeemed-inclusive voucher unique indexes only after guard validation. Keep active-only uniqueness and one-time guard as the DB safety model.

### Phase E - Controlled Repeatability Enablement

Allow `repeat_after_redeem` only for explicit seeded/internal offers. No merchant UI controls yet.

### Phase F - Additive Contract and Frontend Compatibility

Expose repeat policy/snapshot/sequence and claim decision fields. Move claim UI from local status guessing to server eligibility where available.

## 21. Recommended First Implementation Slice

Recommended first implementation slice: **RF Slice 2.1A - Repeatability Foundation, behavior-preserving by default**.

Scope:

- add `rf_offer.repeat_policy` with default `once_per_scope`;
- add `rf_voucher.repeat_policy_snapshot`;
- add `rf_voucher.issue_sequence`;
- add one-time successful-consumption guard table;
- backfill new fields/guard for existing data;
- introduce policy-aware eligibility resolver;
- wire partner/listing claim through the resolver while preserving existing production behavior;
- add exhaustive resolver, idempotency, attribution, and race tests;
- keep old redeemed-inclusive unique indexes until guard validation and cutover are complete;
- do not expose merchant/frontend repeat policy controls yet;
- do not start rewards/economy.

Fields recommended now:

- `rf_offer.repeat_policy`;
- `rf_voucher.repeat_policy_snapshot`;
- `rf_voucher.issue_sequence`;
- one-time consumption guard table.

Fields deferred:

- `repeat_series_id`;
- `previous_voucher_id`;
- `cycle_id`;
- `cooldown_until`;
- `next_claim_at`;
- `max_repeat_count`;
- campaign budget fields;
- economy/reward fields.

Why this slice:

- it creates the policy and audit foundation without changing current offer behavior;
- it lets tests prove resolver semantics before production repeatability is enabled;
- it avoids unsafe index changes before a one-time guard exists;
- it keeps attribution per instance and immutable;
- it gives the next slice a clear activation path: guard validation, active-only index cutover, and controlled `repeat_after_redeem` enablement.

## 22. Open Questions

- Should policy changes be purely prospective, or can changing an offer to `repeat_after_redeem` reopen eligibility for users who redeemed under prior `once_per_scope` policy?
- Should `expired` always allow re-claim, or should some expiry reasons consume one-time eligibility later?
- Should cancellation reasons be introduced before repeatability activation to distinguish admin abuse cancellation from user/system cancellation?
- Does the first public repeatable offer need a visible "repeatable" label, or can claim response/eligibility be enough?
- Should `issue_sequence` start at `1` for each normalized scope only, or should partner and listing scopes share a broader series for reporting?
- Should one-time consumption guard be inserted on successful redemption only, or also for future terminal success states beyond redemption?
- Which endpoint should own authenticated pre-claim eligibility: offer detail, listing offer context, or a dedicated lightweight eligibility endpoint?
- What operational process approves setting `repeat_after_redeem` before merchant tooling exists?

## 23. Slice 2.1A Implementation Note

Implemented as RF repeatability foundation, behavior-preserving by default.

What landed:

- DB schema and migration foundation for `rf_repeat_policy`, `rf_offer.repeat_policy`, `rf_voucher.repeat_policy_snapshot`, `rf_voucher.issue_sequence`, and `rf_voucher_scope_consumption_guard`;
- guard backfill from existing redeemed `once_per_scope` voucher instances;
- active-only unique indexes plus policy-aware safe cutover predicates so active instances block for every policy and redeemed instances block only when their voucher snapshot is `once_per_scope`;
- backend claim resolver foundation shared by partner and listing claim flows;
- voucher-as-instance writes for repeat snapshots and issue sequence;
- successful redeem writes one-time guard rows atomically in the redemption CTE for `once_per_scope`;
- additive OpenAPI/SDK fields for repeat policy, issue sequence, created-new-instance and claim block reason;
- minimal frontend compatibility so redeemed vouchers do not locally block explicitly repeatable offers.

What intentionally did not land:

- no cooldown engine, max repeat count, campaign budget, merchant repeat-policy editor, public repeatability controls, economy/rewards, payouts, Connect expansion, or centralized attribution service;
- no mass enablement of repeatable offers. Existing and missing policy values resolve to `once_per_scope`.

Operational semantics:

- same idempotency key returns the same voucher instance and does not re-resolve attribution;
- default `once_per_scope` preserves current behavior after redeemed through policy-aware lookup and consumption guard;
- `repeat_after_redeem` can create a new voucher instance only when no active instance exists;
- attribution remains immutable per voucher instance, and new repeat instances resolve attribution freshly.
