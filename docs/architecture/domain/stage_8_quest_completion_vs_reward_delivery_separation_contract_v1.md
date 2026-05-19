# Stage 8 Quest Completion vs Reward Delivery Separation Contract v1

Date: 2026-05-19
Status: `DOCS_FIRST_QUEST_COMPLETION_REWARD_DELIVERY_SEPARATION_CONTRACT_REVIEWED_PLANNING_PASS`
Stage: `Stage 8.3 / Quest Completion vs Reward Delivery Separation Contract`
Mode: docs-first separation contract only, read-only synthesis against Stage 8.1 authority boundaries and Stage 8.2 drift prioritization, no implementation, no governance expansion, no new alignment cycle, no runtime rollout, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no staging evidence, no API calls, no DB access, no diagnostics retrieval, no deployment, no reward delivery status API design, no frontend redesign, no reward activation, no badge handoff activation, no Points enforcement activation, no achievement engine, no reward framework, no unified progression system, no NFT/token/on-chain activation, no payout/settlement/cashback activation, no Stage 8 sequencing, no Slice 16 movement

Primary inputs:

- `docs/architecture/domain/stage_8_quest_badge_authority_boundary_contract_v1.md`
- `docs/architecture/domain/stage_8_projection_vs_reward_authority_runtime_drift_prioritization_v1.md`
- Stage 8.0 baseline audit findings inherited through Stage 8.1 and Stage 8.2 synthesis
- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/economy/quest_badge_achievement_compatibility_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/openapi/quest.yaml`
- `docs/openapi/points.yaml`
- `apps/quest-service/**` for current runtime awareness only
- `apps/points-service/**` for current runtime awareness only
- relevant Quest, Connect, Badge and reward frontend files identified during Stage 8.0 through Stage 8.2

## Purpose

This document fixes the separation between Quest completion and reward delivery for Stage 8.

It answers one bounded question:

```text
what_exactly_does_completed_mean
what_does_completed_not_mean
where_does_completion_end
where_does_delivery_intent_begin
where_does_reward_grant_authority_live
what_can_and_cannot_be_reward_receipt
```

This document exists to stop dangerous semantic blending between:

- Quest completion;
- reward delivery;
- reward granted;
- badge awarded;
- reward receipt;
- reward preview;
- local completion UI;
- backend delivery authority.

It does not create a new Quest lifecycle, delivery API, reward framework, badge handoff or Achievement runtime.

## Non-goals

This document does not:

- implement Quest changes;
- implement Points changes;
- implement Badge changes;
- implement Achievement runtime;
- add Quest to Badge handoff;
- activate rewards;
- activate Points enforcement;
- activate NFT, token, G2A, wallet or on-chain behavior;
- create payout, settlement, cashback, commission or financial obligation semantics;
- design a reward delivery status API;
- design reward receipt DTOs;
- design outbox retry behavior;
- redesign frontend surfaces;
- rewrite UI copy;
- redesign APIs;
- change OpenAPI;
- regenerate SDK;
- change database schema;
- add migrations;
- add tests;
- run staging;
- collect runtime evidence;
- touch production;
- create a new governance framework;
- create an implementation roadmap;
- create Stage 8 sequencing;
- move Slice 16.

This document is a separation contract only. It is not rollout approval.

## Stage 7 Inherited Constraints

Stage 8.3 preserves the Stage 7 RF/Rielt stabilization discipline without reopening RF/Rielt.

Mandatory inherited invariants:

```text
projection != authority
visible != spendable
available != payout
claim != payment
redeem != payout
voucher != cashback
evidence != rollout
tests != rollout
local UI state != backend proof
client event != economic proof
Quest/localStorage != reward authority
Connect projection != ledger authority
stage_8_readiness != launch_approval
slice_16_status: blocked_not_triggered
```

Stage 7.2 explicitly kept Quest reward runtime proof blocked where Quest/localStorage or mock authority could be mistaken for reward authority. Stage 8.3 narrows that guard to the completion versus delivery boundary.

## Stage 8.1 Inherited Authority Boundaries

Stage 8.3 inherits the Stage 8.1 authority contract.

The relevant inherited rules are:

```text
Quest_completion != reward_granted
Quest_completion != badge_awarded
badge_visible != badge_awarded
badge != entitlement
badge != payout
badge != NFT
achievement != runtime_authority
achievement_unlocked != reward_granted
localStorage != backend_proof
mock != runtime_truth
reward_preview != reward_proof
client_proof != verification_authority
frontend_event != reward_grant
projection != authority
contract != activation
stable_enough != launch_ready
```

Stage 8.3 does not replace Stage 8.1. It applies those boundaries to the narrower question of what `completed` can and cannot mean.

## Stage 8.2 Inherited Drift Prioritization

Stage 8.3 inherits the Stage 8.2 risk map without reopening drift prioritization.

Relevant Stage 8.2 findings:

| Stage 8.2 finding | Stage 8.3 implication |
|---|---|
| Quest `completed` can be misread as reward granted. | Completion must be explicitly defined as Quest-owned activity fact only. |
| localStorage/mock completion near reward UI is dangerous. | Local completion UI must be excluded from reward receipt. |
| User-facing reward delivery authority surface is absent or limited. | Reward receipt cannot be inferred from completion alone. |
| Quest to Badge handoff is absent. | Badge award cannot be inferred from Quest completion. |
| `outbox.delivered` is not proof of new credit. | Delivery state must not be collapsed into grant fact. |
| Reward preview is not reward proof. | Quest reward config and UI totals remain preview/projection. |
| Badge visible is not entitlement. | Connect/Levels badge displays remain projection unless backed by Points badge award facts. |
| Projection is not authority. | Connect summaries, frontend completion pages and UI labels cannot create reward truth. |

Stage 8.3 classifies these only as they affect the completion versus delivery separation. It does not create a new severity model, roadmap or implementation plan.

## Inputs Reviewed

| Area | Inputs | Relevance |
|---|---|---|
| Stage 8.1 contract | `stage_8_quest_badge_authority_boundary_contract_v1.md` | Defines Quest, Points, Badge, Achievement, projection and localStorage authority boundaries. |
| Stage 8.2 drift prioritization | `stage_8_projection_vs_reward_authority_runtime_drift_prioritization_v1.md` | Identifies completion-to-reward, localStorage, outbox, badge and projection drifts. |
| Stage 8.0 baseline audit | Findings inherited through Stage 8.1 and Stage 8.2 | Establishes that Quest backend, Points badge runtime and localStorage/mock reward UI all exist in different authority classes. |
| Governance freeze | `stage_7_2_governance_freeze_closure_v1.md` | Preserves no rollout, no staging evidence and Quest/localStorage non-authority. |
| Economy semantics | `quest_badge_achievement_compatibility_v1.md`, `economy_authority_terminology_crosswalk_v1.md` | Provides semantic-only Achievement language and unsafe economic interpretation guards. |
| Quest API | `docs/openapi/quest.yaml` | Confirms Quest owns scenarios, steps, progress, submissions and validation lifecycle. |
| Points API | `docs/openapi/points.yaml` | Confirms Points owns balance, ledger operations, badge catalog and badge awards. |
| Quest runtime | `apps/quest-service/**` | Current progress, submission, completion and reward outbox behavior. |
| Points runtime | `apps/points-service/**` | Current Points ledger, idempotency and badge award behavior. |
| Frontend Quest/Connect | `RewardsView.tsx`, `QuestRunnerClient.tsx`, `LevelsView.tsx`, `NFTBadgeDisplay.tsx` and related surfaces | Current runtime-backed Quest UI, localStorage/mock reward UI and Connect badge projections. |
| Tests | Existing Quest, Points, gateway and frontend copy tests from Stage 8.0 through Stage 8.2 review | Local confidence only; no rollout proof. |

## Quest Completion Boundary

Quest completion means a Quest-owned lifecycle fact.

Canonical reading:

```text
Quest_progress_completed = Quest-owned activity/completion fact
```

Quest completion fixes:

- the user progress has reached `completed` under Quest Service authority;
- the Quest-domain activity or route has completed according to the current Quest runtime rules;
- relevant Quest submissions, review outcomes or validation behavior have allowed the progress lifecycle to advance;
- a Quest progress row and Quest API response can be runtime proof for Quest progress and completion;
- a Quest event such as `quest.completed` can describe the Quest-domain completion event.

Quest completion does not fix:

```text
Quest_progress_completed != Points_granted
Quest_progress_completed != badge_awarded
Quest_progress_completed != payout
Quest_progress_completed != economic_entitlement
Quest_progress_completed != reward_receipt
Quest_progress_completed != reward_delivery_success
Quest_progress_completed != proof_of_new_credit
```

Completion can exist while reward delivery is pending, failed, retried, delivered as an idempotent replay, or not applicable because no reward points are configured.

Completion is not weakened by delivery pending or delivery failed. Those are different facts with different authorities.

Allowed reading:

```text
completed = Quest_lifecycle_fact
```

Forbidden readings:

```text
completed = reward_granted
completed = badge_awarded
completed = reward_receipt
completed = payout
completed = entitlement
completed = localStorage_truth
completed = mock_truth
```

## Reward Delivery Boundary

Reward delivery is the boundary between Quest completion and Points ledger authority.

Current separation model:

```text
Quest activity / verification
  -> Quest completion fact
  -> Quest reward delivery intent / outbox
  -> Points Service ledger decision
```

Reward delivery in this contract means delivery intent and delivery attempt state. It does not mean grant proof.

| Concern | Authority | Boundary |
|---|---|---|
| Reward configuration | Quest definition/runtime data | Preview/config only; not grant. |
| Delivery intent | Quest reward outbox where current runtime creates it | Intent and retry state; not ledger truth. |
| Outbox pending | Quest outbox state | Completion may already exist. |
| Outbox failed | Quest outbox state | Not frontend retry authority and not payout denial authority. |
| Outbox delivered | Quest outbox state after Points accepted the delivery call | Not guaranteed new credit if Points returned idempotent replay. |
| Points grant | Points Service ledger write and balance update | Grant authority; not owned by Quest progress. |

Required delivery rules:

```text
reward_configuration != reward_granted
delivery_intent != grant_fact
outbox_pending != completion_absent
outbox_failed != grant_denied_authority
outbox_failed != frontend_retry_authority
outbox_delivered != guaranteed_new_credit
outbox_delivered != reward_receipt
Points_Service_ledger_write = reward_grant_authority
```

The outbox is operational delivery state. It can help services avoid duplicate delivery and replay failed work. It is not a user-facing reward receipt by itself.

Stage 8.3 does not design a reward delivery status API or UX.

## Reward Receipt Boundary

Reward receipt is the most constrained term in this contract.

Reward receipt means a user-facing interpretation of a backend-backed reward fact. It requires service-owned reward authority.

Minimum safe reading:

```text
reward_receipt_requires_backend_backed_reward_authority
```

For Points, reward receipt can only be read from Points-owned facts or a future separately approved delivery authority surface:

- Points transaction / ledger fact;
- Points balance update where runtime-backed;
- transaction history read model over Points ledger facts;
- a separately approved user-facing delivery status contract, if one exists in the future.

Current Stage 8.3 boundary:

```text
Quest_completed_alone != reward_receipt
Quest_outbox_alone != reward_receipt
frontend_completion_screen != reward_receipt
localStorage_completion != reward_receipt
mock_reward_summary != reward_receipt
reward_preview != reward_receipt
Connect_summary_without_grant_fact != reward_receipt
```

Reward receipt cannot be inferred from:

- `QuestProgressResponse.status === completed`;
- a Quest completion event;
- a Quest reward config value;
- `/quest/[id]/complete` localStorage state;
- local client-side Points calculation;
- mock quest reward metadata;
- Connect dashboard summaries unless the displayed item is backed by Points ledger or badge award facts;
- outbox `delivered` without knowing whether Points applied a new credit or returned an idempotent replay.

Because the current user-facing delivery authority surface is absent or limited, any future receipt UI based on completion alone remains blocked for authoritative interpretation.

This is a contract boundary, not a request to build that surface.

## Badge Separation Boundary

Badge award is not part of Quest completion.

Badge authority is currently Points-owned.

Rules:

```text
Quest_completion != badge_awarded
badge_catalog_entry != badge_award
badge_visible != badge_awarded
badge_earned != points_balance
badge_award != Points_ledger_mutation
badge != entitlement
badge != payout
badge != NFT
```

Badge separation means:

- Quest completion can exist without a badge award;
- a badge catalog entry such as `first_quest_completed` does not prove a producer handoff exists;
- Connect Levels can project badge catalog and user badge award reads, but does not create badge ownership;
- `user_badges` or equivalent Points-owned award fact is required for badge ownership;
- badge visibility, copy or category is not entitlement, spendability, payout or NFT ownership.

The absence of Quest to Badge handoff is important because any UI copy that says completing a Quest gets a badge can create a false receipt expectation. Stage 8.3 records the separation but does not implement the handoff.

Achievement remains semantic/UI vocabulary only unless a separate approved runtime authority exists.

## localStorage / Mock Separation

localStorage and mock data are UX cache, local projection or demo data. They are never reward authority.

Rules:

```text
localStorage != backend_proof
localStorage != reward_authority
localStorage != badge_authority
mock != runtime_truth
mock_completion != Quest_completion
mock_reward_summary != reward_receipt
frontend_completion_screen != backend_delivery_authority
```

Known non-authoritative classes:

- `quest-progress-{questId}` localStorage reads;
- local completion screens;
- local client-side Points calculations;
- `mockQuests`;
- mock achievements;
- Space mock quest and Points statistics;
- mock leaderboard data;
- legacy reward components when they are not backed by service-owned facts;
- NFT/future-compatible badge metadata displayed from local or mock data.

The local completion UI can display a local summary only if read as local UX. It cannot be read as:

- Quest backend proof;
- Points grant proof;
- reward receipt;
- badge award;
- entitlement;
- payout;
- NFT or on-chain ownership.

Disclaimers reduce ambiguity but do not turn local or mock data into backend proof.

## Projection vs Authority Separation

Projection surfaces can explain or display backend facts. They do not produce economic facts.

| Zone | Current classification | Authority | Dangerous misread | Safe reading |
|---|---|---|---|---|
| Quest runner `completed` state | Runtime-backed Quest projection | Quest Service for progress only | Completed means Points granted | Completed means Quest lifecycle finished. |
| Quest reward preview / totals | Preview/config projection | Quest definition for config only | Preview means granted reward | Preview means potential/configured reward value, not proof. |
| Quest local completion screen | localStorage/mock UX | None for backend reward truth | Screen means reward receipt | Local summary only. |
| Connect dashboard | Read model/projection | Points facts only where backend-backed | Dashboard owns ledger | Dashboard displays read-only facts. |
| Connect Levels | Badge projection over Points reads | Points Service for badge catalog and awards | Badge visible means entitlement or Quest handoff exists | Badge ownership requires backend award fact. |
| Transaction summaries | Read model over Points transactions where present | Points ledger facts | Summary creates grant | Summary displays ledger-backed activity. |
| Outbox status | Internal operational state | Quest outbox for delivery intent | Delivered means new credit | Delivered means Points accepted call; new credit requires Points grant fact. |
| NFTBadge labels | Future-compatible/local presentation | None for NFT/on-chain | Label means minted asset | Future-compatible display only unless separately activated. |
| Achievement wording | Semantic/UI vocabulary | None as runtime entity | Unlocked means reward or payout | Recognition language only. |

Projection rules:

```text
projection != authority
dashboard != ledger
preview != grant
copy != proof
Connect_summary != producer
UI_label != runtime_state
transaction_label != external_financial_transaction
NFT_label != minted_asset
```

## Dangerous Forbidden Assumptions

The following assumptions are forbidden by this contract:

| Forbidden assumption | Why forbidden | Safe reading |
|---|---|---|
| `completed => reward granted` | Completion is Quest-owned; grant is Points-owned. | Completion and grant must be read separately. |
| `completed => badge awarded` | Quest to Badge handoff is absent. | Badge requires Points-owned award fact. |
| `completed => reward receipt` | Receipt requires backend-backed reward authority. | Completion is Quest lifecycle only. |
| `reward preview => granted reward` | Preview/config is not ledger truth. | Preview describes configured or potential value. |
| `localStorage => backend proof` | localStorage is local UX/cache. | Backend proof requires service-owned fact. |
| `mock => runtime truth` | Mock data is demo/local data. | Runtime truth must come from backend APIs/persistence. |
| `Connect summary => ledger authority` | Connect is projection/read UI. | Ledger authority stays in Points. |
| `outbox.delivered => new credit` | Points may return idempotent replay without new credit. | New credit requires Points grant fact. |
| `earned => payout` | Earned language can be UI/semantic and must be scoped. | Payout is not active and not implied. |
| `unlocked => entitlement` | Unlock language can be projection or future vocabulary. | Entitlement requires separate runtime authority. |
| `badge visible => badge earned` | Visibility is not ownership. | Ownership requires Points-owned badge award fact. |
| `NFT label => minted asset` | NFT/on-chain is future-only. | Label is future-compatible metadata only. |
| `frontend event => economic proof` | UI events do not write ledger. | Economic proof requires backend service-owned write. |
| `client proof => economic proof` | Client payload may be Quest proof material only. | Economic proof requires Points authority. |
| `tests => rollout` | Tests are bounded local confidence. | Rollout requires separate approval. |
| `docs => rollout` | Docs-first contracts do not activate runtime. | Separate approval is required. |

Required rule block:

```text
completion != reward_granted
completion != badge_awarded
completion != reward_receipt
delivery_intent != grant_fact
outbox_delivered != guaranteed_new_credit
reward_preview != reward_proof
frontend_completion_screen != reward_receipt
localStorage != backend_proof
mock != runtime_truth
Connect_summary != ledger_authority
badge_visible != badge_awarded
earned != payout
unlocked != entitlement
NFT_label != minted_asset
frontend_event != economic_proof
contract != activation
stable_enough != launch_ready
```

## Runtime Drift Classification

This section reuses Stage 8.2 classifications only as they apply to the separation contract. It is not a roadmap and does not sequence implementation.

### Dangerous Drifts

Dangerous drifts for Stage 8.3:

- localStorage/mock completion shaped like reward receipt;
- Quest `completed` read as Points grant;
- Quest `completed` read as badge award;
- Quest reward preview values read as granted Points;
- outbox `delivered` read as guaranteed new credit;
- Connect or frontend copy implying complete Quest means badge received;
- badge visibility or `earned` wording read as entitlement;
- NFTBadge label or share text read as minted/on-chain asset;
- client event or proof payload read as economic proof.

### Implementation-Blocking Drifts

Implementation-blocking for authoritative interpretation:

| Drift | Blocks safe interpretation of |
|---|---|
| Missing user-facing reward delivery authority surface | Reward receipt UI based on completion alone. |
| Quest to Badge handoff absent | Any projection claiming Quest completion awards a badge. |
| Achievement runtime absent | Any runtime Achievement ownership, unlock, claim or entitlement. |
| localStorage/mock completion near reward UI | Any reward-critical frontend path that can be deep-linked or reused as proof. |
| Weak proof validation areas on reward-adjacent paths | Any future interpretation that treats Quest completion as sufficient economic qualification. |

Implementation-blocking does not approve implementation. It means later separately approved work must not treat the affected projection as authority while the gap remains unresolved.

### Safe-to-Defer Drifts

Safe-to-defer for this contract:

- orphaned mock components not mounted on reward-critical routes;
- Connect mock achievements not used by live Levels/Dashboard;
- leaderboard mock while not connected to reward, badge, payout or entitlement surfaces;
- mixed internal labels that do not imply grant, receipt, spend or entitlement;
- localStorage guard tests while Stage 8.3 remains docs-first;
- Quest to Badge integration tests while Quest to Badge remains out of scope;
- staging/live evidence because Stage 7.2 freeze remains in effect.

Safe-to-defer does not mean approved, activated or forgotten.

### Stable-Enough Boundaries

Stable-enough boundaries:

- Quest owns progress, submissions, validation outcomes and completion facts.
- Quest reward outbox owns delivery intent and internal delivery state only.
- Points owns ledger writes, balance truth and Points grant facts.
- Points owns badge catalog and user badge award facts.
- Achievement remains semantic/UI vocabulary only.
- Completion does not equal reward granted.
- Completion does not equal reward receipt.
- Completion does not equal badge awarded.
- Reward preview does not equal reward proof.
- Outbox delivered does not guarantee new credit.
- Projection does not equal authority.
- localStorage and mock data are non-authoritative.
- Tests and docs do not equal rollout.
- NFT/token/on-chain/payout/settlement remain inactive.

Stable enough means these readings can be reused. It does not mean implementation-ready, staging-approved, security-complete or launch-ready.

## Stable-Enough Interpretation Boundaries

Stage 8.3 defines the following interpretation layer for future references:

```text
completed:
  authority: Quest Service
  meaning: Quest lifecycle/activity fact
  not: grant, receipt, badge award, payout, entitlement

delivery_intent:
  authority: Quest reward outbox
  meaning: internal delivery attempt/retry state
  not: ledger truth, receipt, payout

grant:
  authority: Points Service
  meaning: ledger-backed Points grant fact
  not: Quest progress, preview, outbox alone, local UI

receipt:
  authority: backend-backed reward fact or separately approved delivery authority surface
  meaning: user-facing representation of confirmed reward fact
  not: localStorage, mock, completion screen, preview

badge_award:
  authority: Points Service user badge award fact
  meaning: off-chain recognition ownership
  not: Quest completion, catalog entry, entitlement, NFT

achievement:
  authority: none as runtime entity
  meaning: semantic/UI vocabulary
  not: grant, receipt, payout, runtime ownership
```

This interpretation layer does not add new runtime states. It only fixes safe readings of existing states, UI labels and service boundaries.

## Deferred / Future-Only Areas

Deferred and future-only areas:

- user-facing reward delivery status API or UI;
- reward receipt DTOs or receipt screens;
- outbox retry, replay, reconciliation or observability changes;
- Quest to Badge handoff implementation;
- Achievement runtime entity, service or API;
- proof hardening and cross-service validation expansion;
- frontend copy remediation;
- localStorage/mock removal or redesign;
- Connect reward receipt redesign;
- Quest to RF voucher reward automation;
- Missions service or unified progression system;
- NFT, token, G2A, wallet or on-chain features;
- payout, settlement, cashback or commission mechanics;
- Points enforcement expansion;
- staging/live evidence collection;
- production/public rollout;
- Slice 16 movement.

Deferred means not activated by this contract. It does not mean approved.

## Relationship to Existing SSOT

This document adds separation language only.

It does not replace:

- `docs/economy/points_policy_v1.md`;
- `docs/economy/referral_network_rewards_policy_v1.md`;
- `docs/economy/quest_badge_achievement_compatibility_v1.md`;
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`;
- `docs/openapi/quest.yaml`;
- `docs/openapi/points.yaml`;
- `docs/architecture/domain/stage_8_quest_badge_authority_boundary_contract_v1.md`;
- `docs/architecture/domain/stage_8_projection_vs_reward_authority_runtime_drift_prioritization_v1.md`;
- Stage 7 RF/Rielt contracts.

SSOT precedence for current runtime interpretation:

```text
runtime_aligned_policy_and_current_runtime
> OpenAPI_wire_contracts
> service_runtime_behavior
> stage_8_1_authority_boundary_contract
> this_completion_delivery_separation_contract
> stage_8_2_drift_prioritization_for_risk_context
> semantic_compatibility_docs
> frontend_projection
> localStorage_or_mock
```

If this document appears to conflict with runtime-aligned policy or existing OpenAPI wire contracts, those higher-authority inputs control runtime interpretation. This document controls only the safe reading of completion versus delivery terms.

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
do_not_reopen_stage_7_2_staging_freeze_via_stage_8_3
slice_16_status: blocked_not_triggered
```

Stage 8.3-specific stop rules:

```text
do_not_design_reward_delivery_status_API_or_UX
do_not_design_reward_receipt_schema
do_not_specify_outbox_retry_or_requeue_behavior
do_not_conflate_completion_fact_with_grant_fact_in_new_artifacts
do_not_use_outbox_state_as_ledger_or_balance_authority
do_not_use_frontend_completion_or_localStorage_as_delivery_proof
do_not_use_mock_quest_rewards_as_runtime_truth
do_not_reopen_stage_8_2_as_drift_inventory_in_this_contract
do_not_expand_into_badge_or_achievement_authority_tables
do_not_create_implementation_patch_or_roadmap_from_this_contract
do_not_activate_rewards_Points_enforcement_or_badge_handoff
do_not_create_reward_framework
do_not_create_achievement_engine
do_not_create_unified_progression_system
```

Allowed future work must be triggered by a separate explicit implementation, API, runtime, security or evidence artifact. This contract is not that artifact.

## Acceptance Criteria

This contract is accepted if:

- completion semantics are explicit;
- completion is explicitly defined as a Quest-owned activity fact;
- `completion != reward granted` is explicit;
- `completion != reward receipt` is explicit;
- `completion != badge awarded` is explicit;
- reward delivery intent and outbox boundaries are explicit;
- `outbox.delivered != guaranteed new credit` is explicit;
- Points grant authority is explicit;
- reward receipt semantics are explicit;
- reward receipt requires backend-backed reward authority;
- localStorage/mock non-authority is explicit;
- local completion UI is excluded from reward receipt;
- badge separation is explicit;
- Projection vs authority is explicit;
- dangerous assumptions are forbidden;
- runtime drifts are classified for this separation boundary;
- stable-enough interpretation boundaries are explicit;
- deferred and future-only areas are recorded without roadmap;
- no implementation is added;
- no new semantics are invented;
- no governance recursion is introduced;
- no rollout approval is implied;
- Slice 16 remains `blocked_not_triggered`.

## Review Gate Results

This table records an internal docs-first separation posture. It is not external operational approval, not staging sign-off, not implementation approval and not runtime rollout.

| Review gate | Result | Notes |
|---|---|---|
| Requirements Review | `PASS_DOCS_FIRST` | Scope remains separation contract only. |
| Architecture Review | `PASS_DOCS_FIRST` | Completion, delivery intent, grant, receipt and badge separation are explicit. |
| Backend/API Review | `PASS_DOCS_FIRST` | Current Quest outbox and Points grant behavior are interpreted without API changes. |
| Frontend Review | `PASS_DOCS_FIRST_WITH_DANGEROUS_LOCAL_UI_GAP` | localStorage/mock reward UI is classified as non-authoritative; no redesign is made. |
| QA Review | `PASS_DOCS_ONLY_WITH_TEST_GAPS` | Existing tests remain local confidence only; no tests added. |
| Security / Abuse Review | `PASS_DOCS_FIRST_WITH_DANGEROUS_ASSUMPTIONS_FORBIDDEN` | Fraud-sensitive conflations are blocked without enforcement activation. |
| Canon Review | `PASS_DOCS_FIRST` | No new governance framework, roadmap or SSOT replacement is introduced. |

## Final Status

```text
stage_8_3_status: docs_first_quest_completion_reward_delivery_separation_contract_reviewed_planning_pass
stage_8_1_boundary_contract_inherited: true
stage_8_2_drift_prioritization_referenced_not_reopened: true
stage_7_constraints_preserved: true

completion_fact_authority_explicit: true
completion_meaning_explicit: true
completion_not_equal_reward_granted_explicit: true
completion_not_equal_reward_receipt_explicit: true
completion_not_equal_badge_awarded_explicit: true

delivery_intent_outbox_boundary_explicit: true
outbox_not_ledger_truth_explicit: true
outbox_delivered_not_guaranteed_new_credit_explicit: true
grant_fact_points_authority_explicit: true
reward_receipt_requires_backend_backed_authority_explicit: true

localStorage_mock_non_authoritative_explicit: true
frontend_completion_screen_not_reward_receipt_explicit: true
projection_vs_authority_explicit: true
badge_separation_explicit: true
achievement_semantic_only_boundary_preserved: true
dangerous_forbidden_assumptions_explicit: true
runtime_drifts_classified_for_separation_boundary: true
stable_enough_interpretation_boundaries_explicit: true
runtime_delivery_status_gap_documented_not_designed: true

new_quest_completion_semantics: false
new_reward_delivery_semantics: false
new_outbox_semantics: false
new_points_grant_semantics: false
new_badge_semantics: false
new_achievement_runtime_semantics: false
new_reward_framework: false
new_governance_framework: false
new_alignment_cycle: false
new_implementation_roadmap: false
new_stage_8_sequence: false

reward_delivery_status_api_designed: false
reward_receipt_schema_designed: false
frontend_redesign: false
code_changes: false
OpenAPI_changes: false
SDK_changes: false
schema_changes: false
migrations: false
tests_added: false
runtime_execution_status: not_executed
staging_evidence_collection: not_opened

reward_activation: false
badge_handoff_activation: false
Points_enforcement_activation: false
runtime_rollout_approval: false
production_launch_ready: false
public_rollout_ready: false
contract_acceptance_implies_rollout: false

slice_16_status: blocked_not_triggered
token_g2a_nft_wallet_activation: false
payout_settlement_cashback_activation: false
```

## Final Verdict

Stage 8.3 fixes the interpretation boundary between Quest completion, Quest reward delivery intent/outbox, Points grant authority, reward receipt, Badge award, local completion UI and projection surfaces.

The core contract is:

```text
completed = Quest-owned activity fact
completed != reward_granted
completed != reward_receipt
completed != badge_awarded
delivery_intent != grant_fact
outbox_delivered != guaranteed_new_credit
reward_receipt_requires_backend_backed_reward_authority
localStorage_mock_projection != backend_proof
```

This artifact does not implement runtime changes, design delivery APIs, activate rewards, create a badge handoff, introduce new semantics, approve rollout, reopen governance, or move Slice 16.
