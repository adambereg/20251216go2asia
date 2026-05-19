# Stage 8 Quest / Badge Handoff Boundary Contract v1

Date: 2026-05-19
Status: `DOCS_FIRST_QUEST_BADGE_HANDOFF_BOUNDARY_CONTRACT_REVIEWED_PLANNING_PASS`
Stage: `Stage 8.6 / Quest Badge Handoff Boundary Contract`
Mode: docs-first handoff-boundary contract only, read-only synthesis, no implementation, no runtime changes, no backend changes, no frontend changes, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no test execution as evidence, no staging evidence, no runtime rollout, no event handler implementation, no Quest to Badge handoff activation, no badge delivery outbox implementation, no reward activation, no Points enforcement activation, no Achievement runtime activation, no achievement engine, no reward framework, no unified progression system, no NFT/token/G2A/wallet/on-chain activation, no payout/settlement/cashback activation, no roadmap, no Stage 8 sequencing, no governance recursion, no Slice 16 movement

Primary inputs:

- `docs/architecture/domain/stage_8_quest_badge_authority_boundary_contract_v1.md`
- `docs/architecture/domain/stage_8_projection_vs_reward_authority_runtime_drift_prioritization_v1.md`
- `docs/architecture/domain/stage_8_quest_completion_vs_reward_delivery_separation_contract_v1.md`
- `docs/architecture/domain/stage_8_localStorage_reward_screen_isolation_patch_v1.md`
- `docs/architecture/domain/stage_8_badge_achievement_projection_boundary_contract_v1.md`
- `docs/economy/quest_badge_achievement_compatibility_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/openapi/quest.yaml`
- `docs/openapi/points.yaml`
- `apps/quest-service/**` for current runtime awareness only
- `apps/points-service/**` for current runtime awareness only
- `packages/db/src/schema/quest.ts`
- `packages/db/src/schema/points.ts`
- relevant Quest completion and Points badge award tests for local confidence only

## Purpose

This document fixes the producer-consumer boundary between Quest completion and Points-owned badge awards.

It answers one bounded question:

```text
what_exactly_is_allowed_to_cross_the_Quest_to_Badge_boundary
what_must_remain_owned_by_Quest
what_must_remain_owned_by_Points_Badge
what_is_handoff_intent
what_is_not_handoff
what_is_badge_award_truth
what_must_not_be_inferred_from_completion_alone
```

The core contract is:

```text
Quest_completion = Quest-owned activity/completion fact
Quest_completion != badge_awarded
Quest_completion_event = producer_signal_only
handoff_intent != badge_ownership
badge_award = Points-owned user_badge fact
badge_catalog_entry != producer_handoff
projection != authority
```

Current runtime status:

```text
Quest_to_Points_grant_handoff: implemented_for_points_via_quest_reward_outbox
Quest_to_Badge_handoff: absent
Points_badge_award_endpoint: exists_as_isolated_consumer_boundary
```

This contract defines what must be true before any future Quest to Badge handoff can be safely implemented. It does not implement the handoff, define transport, add an event handler, add an outbox, change APIs, or approve rollout.

## Non-goals

This contract does not:

- implement Quest to Badge handoff;
- implement an event handler;
- implement a badge delivery outbox;
- implement retry workers or scheduled jobs for badges;
- design a new endpoint;
- change the existing Points badge award endpoint;
- change Quest OpenAPI;
- change Points OpenAPI;
- regenerate SDKs;
- change database schema;
- add migrations;
- add tests;
- run tests as validation evidence;
- patch frontend copy or projection code;
- create Achievement runtime, entity, service, table, API or engine;
- create a progression engine, missions engine or reward framework;
- activate rewards;
- activate Points enforcement;
- activate NFT, token, G2A, wallet, on-chain, bridge, minted asset or marketplace behavior;
- create payout, settlement, cashback, commission or financial obligation semantics;
- create a roadmap;
- create Stage 8 sequencing;
- create a new governance framework;
- approve staging;
- approve rollout;
- move Slice 16.

This document is handoff-boundary contract only. It is not implementation approval, QA sign-off, staging approval or rollout approval.

## Stage 7 Inherited Constraints

Stage 8.6 preserves the Stage 7 RF/Rielt stabilization discipline without reopening RF/Rielt.

```text
projection != authority
visible != spendable
available != payout
claim != payment
redeem != payout
voucher != cashback
evidence != rollout
tests != rollout
docs != rollout
local UI state != backend proof
client event != economic proof
Quest/localStorage != reward authority
Connect projection != ledger authority
stage_8_readiness != launch_approval
slice_16_status: blocked_not_triggered
```

Stage 7 established that frontend, projection, CTA and evidence layers can display or explain backend-owned facts, but must not become lifecycle, ledger, payout or rollout authority. Stage 8.6 applies that rule to the Quest to Badge producer-consumer boundary.

## Stage 8 Inherited Authority Boundaries

Stage 8.6 inherits Stage 8.1 through Stage 8.5 without replacing them.

```text
completed != reward_granted
completed != reward_receipt
completed != badge_awarded
delivery_intent != grant_fact
outbox_delivered != guaranteed_new_credit
badge_visible != badge_awarded
badge_catalog_entry != badge_award
badge_ownership_proof = Points_Service_user_badges
achievement != runtime_authority
NFT_label != minted_asset
localStorage != backend_proof
mock != runtime_truth
tests != rollout
docs != rollout
contract != activation
stable_enough != launch_ready
```

| Source | Inherited boundary |
|---|---|
| Stage 8.1 | Quest owns completion facts; Points owns badge catalog and user badge award facts; Quest to Badge runtime handoff is absent. |
| Stage 8.2 | Quest to Badge absence is implementation-blocking for authoritative "complete quest means badge awarded" projection. |
| Stage 8.3 | Completion is not reward receipt, reward grant or badge award; outbox delivery state is not final grant truth. |
| Stage 8.4 | localStorage/mock completion screen is isolated from badge, reward, Achievement and NFT proof. |
| Stage 8.5 | Badge projection is not badge ownership; Connect can project Points reads but cannot produce badge awards. |

## Inputs Reviewed

| Area | Inputs | Relevance |
|---|---|---|
| Authority boundary | `stage_8_quest_badge_authority_boundary_contract_v1.md` | Defines Quest completion authority and Points badge authority. |
| Drift prioritization | `stage_8_projection_vs_reward_authority_runtime_drift_prioritization_v1.md` | Classifies absent Quest to Badge handoff as implementation-blocking and catalog/copy inference as dangerous. |
| Completion separation | `stage_8_quest_completion_vs_reward_delivery_separation_contract_v1.md` | Provides separation model for completion versus delivery/grant; Stage 8.6 applies the same discipline to badges. |
| localStorage isolation | `stage_8_localStorage_reward_screen_isolation_patch_v1.md` | Confirms local completion UI cannot be badge proof or retry authority. |
| Projection boundary | `stage_8_badge_achievement_projection_boundary_contract_v1.md` | Defines Connect badge projection after backend-backed user badge reads. |
| Economy semantics | `quest_badge_achievement_compatibility_v1.md` | Keeps badge/Achievement language as recognition semantics, not payout or NFT activation. |
| Economy crosswalk | `economy_authority_terminology_crosswalk_v1.md` | Guards against reading UI labels, future vocabulary, NFTs or rewards as active authority. |
| Quest OpenAPI | `docs/openapi/quest.yaml` | Quest owns scenarios, steps, progress, submissions, validation lifecycle and Quest domain events. |
| Points OpenAPI | `docs/openapi/points.yaml` | Points owns off-chain badge catalog and user badge awards; badge award is idempotent and does not mutate balance. |
| Quest runtime | `apps/quest-service/**` | Current completion event and Points reward outbox behavior; no Quest to Badge award call found. |
| Points runtime | `apps/points-service/**` | Current badge catalog reads, user badge reads, internal badge award, idempotency and conflict behavior. |
| DB schema | `packages/db/src/schema/quest.ts`, `packages/db/src/schema/points.ts` | Quest progress and reward outbox; Points `badges` and `user_badges`. |
| Tests | Quest completion/outbox tests and Points badge award tests | Local confidence only; they do not prove Quest to Badge handoff. |

## Producer Boundary - Quest

Quest is the producer of Quest-domain completion truth. It is not the producer of badge ownership.

Quest owns:

| Quest-owned concern | Current authority |
|---|---|
| Quest definition | Quest Service / Quest DB |
| Quest steps and requirements | Quest Service / Quest DB |
| Submissions and reviews | Quest Service |
| Verification outcome | Quest Service according to current validation/review behavior |
| Progress lifecycle | `quest_progress` through Quest Service |
| Completion fact | `quest_progress.status = completed` with `completedAt` where present |
| Quest domain event | `quest.completed` as Quest-owned producer event |
| Points reward delivery intent | `quest_reward_outbox` for Points grants only in current runtime |

Quest does not own:

- badge catalog truth;
- user badge ownership;
- `user_badges`;
- badge award idempotency;
- Points award response semantics;
- badge award conflict semantics;
- Connect badge projection authority;
- Achievement runtime;
- NFT minting or on-chain ownership;
- entitlement, payout, settlement or cashback.

Producer rules:

```text
Quest_progress_completed = Quest-owned activity/completion fact
Quest_completed_event = producer_signal_only
Quest_completed_event != user_badge_award
Quest_completion != badge_awarded
Quest_completion != badge_ownership
Quest_completion != achievement_unlock_authority
Quest_completion != NFT_mint_trigger
```

What can become a future handoff signal:

- a Quest-owned completion fact;
- a Quest-owned completion event or equivalent service-owned completion signal;
- stable Quest-owned identifiers such as `userId`, `questId`, `questProgressId`, and `completedAt`;
- bounded audit metadata that helps Points understand the source of the attempted award.

What cannot become badge truth:

- completion alone;
- a Quest event alone;
- reward points configuration;
- `quest_reward_outbox` points delivery status;
- Quest `cardBadge`;
- Quest reward preview;
- localStorage completion;
- mock quest data;
- frontend events.

Current runtime:

```text
quest.completed_event_exists: true
quest_reward_outbox_exists_for_points: true
quest_badge_outbox_exists: false
Quest_calls_internal_points_badges_award: false
```

## Consumer Boundary - Points Badge

Points Service is the consumer authority for off-chain badge awards.

Points owns:

| Points-owned concern | Current authority |
|---|---|
| Badge catalog | `badges` table and `/v1/points/badges` |
| Active badge definitions | `badges.is_active` |
| User badge ownership | `user_badges` |
| Badge award write | `/internal/points/badges/award` |
| Badge award idempotency | Points badge award logic and `user_badges` uniqueness |
| Award response | `applied`, `awardId`, `awardedAt` |
| Award source validation | Required `badgeCode`, `sourceType`, `sourceId`; `sourceService` derived from service JWT |
| Badge projections | `/v1/points/badges/mine`, Connect Dashboard badge read model |

Consumer rules:

```text
badge_catalog_authority = Points_Service
badge_ownership_authority = Points_Service_user_badges
badge_award_endpoint = current_Points_internal_badge_award_boundary
badge_award != Points_ledger_mutation
badge_award != user_balance_mutation
badge_award != payout
badge_award != entitlement
badge_award != NFT_mint
```

Current Points award semantics:

```text
applied=true  => new off-chain user_badge award fact was created
applied=false => idempotent duplicate; existing award was returned
409 Conflict  => same user+badge has different source identity or inactive badge depending on error
404 Not Found => badgeCode does not resolve to a badge definition
```

The Points badge award response is badge authority. It is not Points grant authority, reward receipt authority, payout authority or NFT authority.

## Handoff Intent Boundary

Handoff intent means a Quest-owned service signal that a badge award should be attempted by Points.

```text
handoff_intent = service_owned_request_or_signal_to_attempt_badge_award
handoff_intent != badge_awarded
handoff_intent != badge_ownership
handoff_intent != Connect_projection
handoff_intent != frontend_event
handoff_intent != localStorage_state
```

Potential future handoff signal contents, without designing transport:

| Signal class | Safe meaning | Not safe to read as |
|---|---|---|
| `userId` | Subject of the Quest completion and possible award attempt. | Proof of badge ownership. |
| `questId` | Quest context for audit. | Badge eligibility by itself. |
| `questProgressId` | Stable Quest completion instance identifier. | Badge award id by itself. |
| `completedAt` | Quest completion timestamp. | Badge `awardedAt`. |
| `badgeCode` | Candidate badge definition to request from Points if explicitly configured. | Proof catalog exists, is active, or user owns it. |
| `sourceType` / `sourceId` | Stable audit/idempotency context for Points. | Frontend retry token or ownership proof. |
| metadata | Bounded diagnostic/audit context. | Entitlement, payout, NFT or reward proof. |

What is not handoff intent:

| Surface or fact | Why not intent |
|---|---|
| Quest completion alone | Completion is producer truth, not a cross-service award attempt. |
| `quest.completed` event observed by UI | UI observation is not service-owned handoff. |
| Badge catalog entry | Catalog is Points definition, not Quest producer signal. |
| `first_quest_completed` catalog code | Defines possible badge; does not prove Quest handoff exists. |
| Connect hint or copy | Projection/copy cannot create backend handoff. |
| Frontend click/event | Client events are not service-to-service award attempts. |
| localStorage completion | Local UX cache is not backend proof. |
| mock badge or Quest metadata | Fixture/presentation only. |
| Points reward outbox delivery state | Points grant path only, not badge handoff. |

This section does not design the transport, endpoint, event handler, outbox schema or retry system for handoff intent.

## Eligibility Boundary

Eligibility is not automatic. A completed Quest does not automatically imply any badge award.

```text
completed_quest != eligible_for_all_badges
completed_quest != award_first_quest_completed_badge
badge_catalog_entry != eligibility_rule
quest_type != implicit_badge_rule
quest_category != implicit_badge_rule
sourceType_sourceId_must_not_be_guessed
```

What can be eligible in a future separately approved handoff:

- only badge catalog entries explicitly configured, contracted or mapped for a producer;
- only Quest completion facts that satisfy explicit producer-side rules;
- only active badge definitions accepted by Points at award time;
- only stable source identity that can support idempotency and audit.

What does not prove eligibility:

- `first_quest_completed` exists in catalog;
- Quest completion occurred;
- Quest type/category/theme;
- Quest `rewardPoints`;
- Quest `cardBadge`;
- Connect copy;
- frontend local state;
- mock achievements.

Future eligibility must be explicit. This contract does not define the eligibility configuration model or where it would be stored.

## Idempotency Boundary

Points owns badge award idempotency. Quest may only provide stable source identity if a future handoff exists.

Current Points badge idempotency:

| Scenario | Current Points response | Safe reading |
|---|---|---|
| New active badge award | `200`, `applied=true` | New off-chain user badge award fact created. |
| Same user+badge and same source identity | `200`, `applied=false` | Existing award returned; no new award created. |
| Same user+badge and different source identity | `409 Conflict` | Source mismatch/conflict; not frontend retry authority. |
| Unknown badge code | `404 Not Found` | Candidate badge does not exist. |
| Inactive badge | `409 Conflict` | Badge definition is not awardable. |

Idempotency rules:

```text
Points_owns_badge_award_idempotency
sourceService_is_derived_from_service_auth
sourceType_and_sourceId_are_required_for_auditability
future_handoff_source_identity_must_be_stable
repeat_handoff_must_not_create_duplicate_ownership
applied_false != new_badge
applied_false != new_receipt
applied_false != Points_grant
409_conflict != frontend_retry_authority
409_conflict != safe_retry_with_new_sourceId
badge_idempotency_result != Points_ledger_result
```

If future Quest to Badge handoff exists, source identity must be stable across retries. The exact source identity strategy is not designed here; the boundary only requires that it not be guessed from frontend or changed between retries.

Comparison with existing Quest to Points reward path:

```text
Quest_to_Points_grant:
  externalId = quest:completed:{progressId}
  sourceEventId = quest.completed:{progressId}
  authority = Points ledger for grant

Quest_to_Badge_future_handoff:
  source identity must be stable and service-owned
  authority = Points user_badges for award
  current runtime = absent
```

This comparison is a boundary analogy only. It does not approve copying the existing outbox design into badge delivery.

## Failure / Retry Boundary

Future handoff failure must not change the Quest completion fact.

```text
badge_handoff_failure != completion_rollback
Quest_completion_remains_true_if_badge_award_absent
badge_award_may_remain_absent_after_completion
handoff_failure != user_denied_completion
handoff_failure != frontend_award_authority
handoff_failure != local_retry_authority
retry_must_be_service_owned_if_it_exists
no_client_retry
no_local_retry
```

Current runtime reference:

- Quest already separates completion from Points reward delivery.
- Points reward delivery can be pending, delivered or failed.
- Quest completion responses remain successful even when Points reward delivery fails.
- This existing Points reward outbox is not a badge outbox and does not prove badge delivery.

Safe future interpretation:

| Condition | Safe reading |
|---|---|
| Quest completed and badge absent | Completion is true; badge award may be absent, pending, failed, not configured or not applicable. |
| Future handoff delivery failed | Quest completion remains true; frontend cannot mint/award/retry. |
| Future retry succeeds | Points award fact becomes the ownership proof. |
| Future retry returns `applied=false` | Existing award returned; not new badge event. |
| Future retry returns `409` | Source conflict or inactive badge depending on error; not user-facing retry instruction. |

This contract does not implement failure states, retry queues, operations endpoints, badge delivery status UI or badge outbox schema.

## Projection Boundary After Handoff

Even if a future Quest to Badge handoff is implemented, frontend projection must continue to derive badge ownership from Points reads.

```text
Connect_can_display_badge_after_Points_backed_award
Connect_cannot_infer_badge_from_completion
Dashboard_count_must_remain_projection
Dashboard_recent_badges_must_remain_projection
Levels_isEarned_must_derive_from_user_badges
Quest_completion_UI_must_not_claim_badge_until_Points_award_fact_exists
copy_must_not_promise_award_before_backend_fact
```

| Surface | Safe post-handoff reading | Forbidden reading |
|---|---|---|
| Connect Levels | Shows catalog and user badge reads from Points. | Infers `isEarned` from Quest completion. |
| Connect Dashboard | Shows badge totals/recent based on Points read model. | Acts as producer or full audit trail. |
| Quest runner/completion UI | Shows Quest lifecycle completion only. | Claims badge awarded before Points award fact. |
| Quest reward preview | Config/projection only. | Badge receipt or ownership. |
| localStorage/mock | Non-authoritative. | Badge proof or retry source. |
| Space/Quest mock badges | Demo fixtures. | Runtime badge ownership. |

Projection remains downstream of Points. Handoff success does not make Connect, Quest UI, localStorage or mock data a badge producer.

## Dangerous Forbidden Assumptions

The following assumptions are forbidden by this contract:

| Forbidden assumption | Why forbidden | Safe reading |
|---|---|---|
| `completed => badge awarded` | Quest completion and Points badge award have different owners. | Completion is Quest lifecycle only. |
| `completion event => badge ownership` | Event is producer signal only. | Ownership requires Points `user_badges`. |
| `catalog entry => producer handoff` | Catalog is definition, not wiring. | Producer handoff must be separately implemented and proven. |
| `first_quest_completed => all completed quests award badge` | No implicit all-quests award rule exists. | Future eligibility must be explicit. |
| `Connect hint => handoff exists` | Copy is projection, not backend wiring. | Connect cannot prove producer handoff. |
| `frontend event => badge award` | Client events are not service-to-service writes. | Badge awards require Points internal award. |
| `localStorage => badge proof` | Local state is not backend proof. | Backend proof requires Points award fact. |
| `applied=false => new badge` | Duplicate replay returns existing award. | Not a fresh receipt or celebration event. |
| `409 => user should retry from frontend` | Conflict is service-owned integration state. | Frontend is not retry authority. |
| `badge award => Points grant` | OpenAPI forbids balance mutation on badge award. | Badge is off-chain recognition only. |
| `badge award => NFT mint` | NFT/on-chain inactive. | NFT requires separate runtime authority. |
| `badge award => entitlement/payout` | Badge is not spend permission or payout. | Entitlements need separate policy/runtime. |
| `Achievement unlocked => badge awarded` | Achievement runtime absent; vocabulary is semantic/UI. | Badge award requires `user_badges`. |
| `Points badge tests => Quest handoff proven` | Consumer tests do not prove producer wiring. | Quest to Badge integration remains absent. |
| `contract accepted => handoff activated` | Docs are not runtime activation. | Separate implementation artifact required. |

Required rule block:

```text
Quest_completion != badge_awarded
Quest_completion_event != badge_ownership
handoff_intent != badge_award_fact
badge_catalog_entry != producer_handoff
Connect_hint != handoff_exists
frontend_event != badge_award
localStorage != badge_proof
applied_false != new_badge
409_conflict != frontend_retry_authority
badge_award != Points_grant
badge_award != NFT_mint
badge_award != entitlement
badge_award != payout
Achievement_unlocked != badge_awarded
projection != authority
contract != activation
```

## Runtime Drift Classification

This classification is scoped to Quest / Badge handoff. It is not a roadmap and does not sequence implementation.

### Dangerous Drifts

Dangerous drifts:

- Quest completion being read as badge award;
- `quest.completed` event being read as badge ownership proof;
- catalog entry `first_quest_completed` being read as existing producer handoff;
- Connect copy or empty hints implying Quest completion directly awards badges;
- `applied=false` being celebrated as a new badge;
- `409 Conflict` being interpreted as frontend retry instruction;
- Points reward outbox delivery being read as badge delivery;
- localStorage/mock completion being read as badge proof;
- Quest `cardBadge`, NFT badge metadata or mock badges being read as backend awards;
- badge award being read as Points grant, NFT mint, payout or entitlement;
- Achievement wording being read as badge award or runtime authority.

### Implementation-Blocking Drifts

Implementation-blocking for authoritative handoff interpretation:

| Drift | Blocks safe interpretation of |
|---|---|
| Quest to Badge producer wiring absent | Any claim that Quest completion currently awards a badge. |
| Badge handoff intent/outbox absent in Quest | Any authoritative retry/delivery state for badge handoff. |
| Eligibility configuration absent | Any automatic "all completed quests award X badge" interpretation. |
| User-facing badge delivery status absent | Any badge receipt UI based on completion or intent alone. |
| Quest to Badge integration tests absent | Any evidence claim that handoff works end-to-end. |
| Achievement runtime absent | Any Achievement unlock as handoff or award authority. |
| NFT/on-chain runtime absent | Any badge-to-NFT mint or wallet ownership claim. |

Implementation-blocking does not approve implementation. It marks unsafe assumptions for future separately approved work.

### Safe-to-Defer Drifts

Safe-to-defer for this contract:

- Points badge award tests existing only as isolated consumer tests;
- Quest to Badge integration tests while handoff remains out of scope;
- broad Connect copy remediation outside directly misleading handoff claims;
- Space/Quest mock badge cleanup while not treated as authority;
- internal names such as `NFTBadge` where not used as proof;
- staging/live evidence because Stage 7.2 freeze remains in effect;
- Slice 16 evidence or activation.

Safe-to-defer does not mean approved, activated or forgotten.

### Stable-Enough Handoff Boundaries

Stable-enough readings:

- Quest owns progress, submission, verification and completion facts.
- Quest `quest.completed` can be a producer signal only.
- Quest to Badge runtime handoff is absent today.
- Points owns badge catalog and `user_badges` award facts.
- Points owns badge award idempotency, `applied=true/false`, and conflict semantics.
- Source identity for any future handoff must be stable and service-owned.
- Badge award does not mutate Points balance or create Points grant.
- Connect projection is safe only after Points-backed reads.
- Achievement and NFT remain non-authoritative.

Stable enough means these readings can be referenced by later separately approved slices. It does not mean handoff-activated, implementation-ready, launch-ready, security-complete, QA-complete or staging-approved.

## Stable-Enough Handoff Boundaries

Stage 8.6 defines the following interpretation layer:

```text
Quest_completion:
  authority: Quest Service
  meaning: Quest lifecycle/completion fact
  not: badge award, badge ownership, reward receipt, NFT mint

Quest_completion_event:
  authority: Quest Service
  meaning: producer-side signal
  not: consumer award fact, entitlement, frontend proof

handoff_intent:
  authority: future service-owned producer signal only
  meaning: request or signal to attempt badge award
  not: badge award, ownership, projection, receipt

badge_award:
  authority: Points Service / user_badges
  meaning: off-chain user badge award fact
  not: Points grant, payout, entitlement, NFT

idempotency_result:
  authority: Points Service
  meaning: award applied, duplicate, conflict, missing or inactive badge
  not: frontend retry instruction or reward receipt

Connect_projection_after_handoff:
  authority: read-only projection over Points reads
  meaning: display backend-backed badge facts
  not: producer, retry authority, source of ownership
```

This interpretation layer does not add new runtime states or routes.

## Deferred / Future-Only Areas

Deferred and future-only areas:

- Quest to Badge handoff implementation;
- event handler or subscriber implementation;
- badge delivery outbox;
- badge retry/requeue operations;
- eligibility configuration model;
- user-facing badge delivery status;
- Quest to Badge integration tests;
- Connect copy remediation beyond this contract;
- frontend refetch/invalidation behavior after future handoff;
- Achievement runtime;
- NFT/token/on-chain activation;
- payout, settlement or cashback behavior;
- staging/live evidence collection;
- production/public rollout;
- Slice 16 movement.

Deferred means not activated by this contract. It does not mean approved or scheduled.

## Relationship to Existing SSOT

This document adds handoff-boundary language only.

It does not replace:

- `docs/economy/points_policy_v1.md`;
- `docs/economy/referral_network_rewards_policy_v1.md`;
- `docs/openapi/quest.yaml`;
- `docs/openapi/points.yaml`;
- `docs/architecture/domain/stage_8_quest_badge_authority_boundary_contract_v1.md`;
- `docs/architecture/domain/stage_8_projection_vs_reward_authority_runtime_drift_prioritization_v1.md`;
- `docs/architecture/domain/stage_8_quest_completion_vs_reward_delivery_separation_contract_v1.md`;
- `docs/architecture/domain/stage_8_localStorage_reward_screen_isolation_patch_v1.md`;
- `docs/architecture/domain/stage_8_badge_achievement_projection_boundary_contract_v1.md`;
- Stage 7 RF/Rielt contracts.

SSOT precedence for current runtime interpretation:

```text
runtime_aligned_policy_and_current_runtime
> OpenAPI_wire_contracts
> service_runtime_behavior
> stage_8_1_authority_boundary_contract
> stage_8_3_completion_delivery_separation_contract
> stage_8_5_badge_achievement_projection_boundary_contract
> this_quest_badge_handoff_boundary_contract
> stage_8_2_drift_prioritization_for_risk_context
> quest_badge_achievement_compatibility_v1
> frontend_projection
> localStorage_or_mock
```

If any older document, roadmap, dependency map or product copy appears to imply Quest to Badge handoff already exists, current runtime and the Stage 8 authority contracts control the reading:

```text
legacy_or_aspirational_handoff_doc != runtime_handoff_proof
current_runtime_handoff_status: absent
```

## Governance / Stop Rules

General stop rules:

```text
do_not_create_new_Stage_7_alignment_cycle
do_not_reopen_RF_Rielt_without_concrete_integration_breakage
do_not_create_new_governance_framework
do_not_treat_tests_as_rollout
do_not_treat_docs_as_rollout
do_not_treat_projection_as_authority
do_not_treat_contract_acceptance_as_rollout_approval
do_not_treat_stable_enough_as_launch_ready
do_not_reopen_stage_7_2_staging_freeze_via_stage_8_6
slice_16_status: blocked_not_triggered
```

Stage 8.6-specific stop rules:

```text
do_not_activate_badge_handoff_in_this_contract
do_not_treat_contract_acceptance_as_handoff_activation
do_not_treat_completion_as_badge_award
do_not_treat_catalog_as_producer_proof
do_not_treat_connect_hint_as_handoff_exists
do_not_treat_frontend_event_as_badge_award
do_not_treat_localStorage_or_mock_as_badge_proof
do_not_treat_applied_false_as_new_badge
do_not_treat_409_as_frontend_retry_instruction
do_not_merge_badge_handoff_with_Points_ledger_outbox_authority
do_not_design_event_handler_or_outbox_or_schema
do_not_add_tests_in_this_contract_slice
do_not_execute_tests_as_staging_evidence
do_not_create_achievement_engine_or_unified_progression
do_not_activate_NFT_token_G2A_wallet_on_chain
do_not_activate_payout_settlement_cashback
```

Allowed future work must be triggered by a separate explicit implementation, API, runtime, security or evidence artifact. This contract is not that artifact.

## Acceptance Criteria

This contract is accepted if:

- Quest producer boundary is explicit;
- Points Badge consumer boundary is explicit;
- handoff intent boundary is explicit;
- eligibility boundary is explicit;
- idempotency semantics are explicit;
- failure/retry boundary is explicit;
- Connect projection boundary after handoff is explicit;
- forbidden assumptions are explicit;
- runtime drifts are classified;
- stable-enough handoff boundaries are explicit;
- current Quest to Badge handoff absence is explicit;
- existing tests are classified as local confidence only;
- no implementation is added;
- no code changes are made;
- no backend, API, OpenAPI, SDK or schema changes are made;
- no migrations are added;
- no tests are added;
- no new semantics are invented;
- no governance recursion is introduced;
- no rollout approval is implied;
- Slice 16 remains `blocked_not_triggered`.

## Review Gate Results

This table records an internal docs-first handoff-boundary posture. It is not external operational approval, not staging sign-off, not QA sign-off, not implementation approval and not runtime rollout.

| Review gate | Result | Notes |
|---|---|---|
| Requirements Review | `PASS_DOCS_FIRST` | Scope remains Quest / Badge handoff-boundary contract only. |
| Architecture Review | `PASS_DOCS_FIRST` | Producer and consumer ownership are separated without designing implementation. |
| Backend/API Review | `PASS_DOCS_FIRST_WITH_HANDOFF_ABSENT` | Quest completion and Points badge award runtime are mapped; no API or code changes. |
| Frontend Review | `PASS_DOCS_FIRST_WITH_DANGEROUS_COPY_GAPS` | Connect projection after handoff remains Points-read-only; no frontend patch. |
| QA Review | `PASS_DOCS_ONLY_WITH_TEST_GAPS` | Points badge award tests are consumer confidence only; no Quest to Badge integration test added. |
| Security / Abuse Review | `PASS_DOCS_FIRST_WITH_CRITICAL_FORBIDDEN_ASSUMPTIONS` | Completion-to-badge, local retry, `applied=false`, 409 and NFT/payout overreads are forbidden. |
| Canon Review | `PASS_DOCS_FIRST` | No new governance framework, roadmap, SSOT replacement or rollout approval is introduced. |

## Final Status

```text
stage_8_6_status: docs_first_quest_badge_handoff_boundary_contract_reviewed_planning_pass
stage_8_1_through_8_5_inherited: true
stage_7_constraints_preserved: true

quest_producer_boundary_explicit: true
points_badge_consumer_boundary_explicit: true
handoff_intent_boundary_explicit: true
eligibility_boundary_explicit: true
idempotency_boundary_explicit: true
failure_retry_boundary_explicit: true
projection_after_handoff_boundary_explicit: true
dangerous_assumptions_forbidden_explicit: true
runtime_drifts_classified_for_handoff_boundary: true
stable_enough_handoff_boundaries_explicit: true
quest_to_badge_current_runtime_absent_explicit: true
test_gaps_documented_not_closed: true

new_Quest_to_Badge_semantics: false
new_badge_runtime_semantics: false
new_achievement_runtime_semantics: false
new_nft_activation_semantics: false
new_reward_framework: false
new_unified_progression_system: false
new_governance_framework: false
new_alignment_cycle: false
new_implementation_roadmap: false
new_stage_8_sequence: false

code_changes: false
backend_changes: false
frontend_changes: false
API_changes: false
OpenAPI_changes: false
SDK_changes: false
schema_changes: false
migrations: false
tests_added: false
runtime_execution_status: not_executed
staging_evidence_collection: not_opened

event_handler_implementation: false
badge_delivery_outbox_implementation: false
Quest_to_Badge_handoff_activation: false
Achievement_runtime_activation: false
Achievement_engine_activation: false
reward_framework_activation: false
Points_enforcement_activation: false
NFT_activation: false
token_G2A_wallet_on_chain_activation: false
payout_settlement_cashback_activation: false

runtime_rollout_approval: false
production_launch_ready: false
public_rollout_ready: false
contract_acceptance_implies_rollout: false
tests_equal_rollout: false
docs_equal_rollout: false

slice_16_status: blocked_not_triggered
```

## Final Verdict

Stage 8.6 defines the Quest / Badge handoff boundary without activating the handoff.

The core answer is:

```text
Quest owns completion and producer-side signals only.
Points owns badge catalog, user_badges, award response and idempotency.
Only service-owned future handoff intent may cross the boundary.
Completion alone, catalog entries, Connect hints, frontend events, localStorage and mock data must not cross as badge truth.
```

This artifact does not implement Quest to Badge handoff, add event handlers, add outbox/retry runtime, change APIs, add tests, activate rewards, create Achievement runtime, activate NFT/token/on-chain behavior, approve rollout, reopen governance, or move Slice 16.
