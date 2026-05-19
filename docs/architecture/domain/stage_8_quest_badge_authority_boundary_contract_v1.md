# Stage 8 Quest / Badge Authority Boundary Contract v1

Date: 2026-05-19
Status: `DOCS_FIRST_AUTHORITY_BOUNDARY_CONTRACT_REVIEWED_PLANNING_PASS`
Stage: `Stage 8.1 / Quest Badge Authority Boundary Contract`
Mode: docs-first authority-boundary contract only, read-only audit synthesis, no implementation, no governance expansion, no new alignment cycle, no runtime rollout, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no staging evidence, no API calls, no DB access, no diagnostics retrieval, no deployment, no rollout approval, no reward activation, no badge handoff activation, no Points enforcement activation, no achievement engine, no reward framework, no unified progression system, no NFT/token/on-chain activation, no payout/settlement/cashback activation, no Slice 16 movement

Primary inputs:

- `docs/architecture/domain/stage_7_rf_rielt_closure_review_and_stage_8_readiness_v1.md`
- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/roadmaps/stage_7_3_module_alignment_reentry_plan_v1.md`
- Stage 8.0 baseline audit findings from read-only multi-agent synthesis
- `docs/economy/quest_badge_achievement_compatibility_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/openapi/quest.yaml`
- `docs/openapi/points.yaml`
- `docs/architecture/quest/**`
- `apps/quest-service/**` for current runtime awareness only
- `apps/points-service/**` for current runtime awareness only
- relevant Quest, Badge and Connect frontend files identified during Stage 8.0

## Purpose

This document converts Stage 8.0 baseline audit findings into a bounded authority-boundary contract for Quest, Badge and Achievement surfaces.

It answers:

```text
what_is_authority
what_is_projection
what_is_UX_cache
what_is_runtime_proof
what_is_eventual_delivery
what_is_not_proof
what_is_not_economic_entitlement
what_must_not_trigger_rewards
what_must_not_become_authority
```

It exists to stop dangerous ambiguity before any later implementation slice. It does not design a new Quest system, Badge system, Achievement runtime, reward framework or unified progression model.

## Non-goals

This document does not:

- implement Quest changes;
- implement Badge changes;
- implement Achievement runtime;
- add Quest to Badge handoff;
- activate rewards;
- activate Points enforcement;
- activate NFT, token, G2A, wallet or on-chain behavior;
- create payout, settlement, cashback or commission semantics;
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
- move Slice 16.

This document is authority-boundary contract only. It is not rollout approval.

## Stage 7 Inherited Constraints

Stage 8.1 inherits the Stage 7 RF/Rielt stabilization discipline without reopening RF/Rielt.

Mandatory invariants:

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
Stage_8_readiness != launch_approval
slice_16_status: blocked_not_triggered
```

Stage 7 established that frontend CTA/projection layers can explain backend-owned facts but must not become lifecycle, ledger, payout or rollout authority. Stage 8.1 applies the same rule to Quest, Badge, Achievement and reward language.

## Stage 8.0 Findings Inherited

| Stage 8.0 finding | Stage 8.1 contract implication |
|---|---|
| Quest backend/runtime exists. | Quest Service can be treated as authority for Quest-owned progress, submissions and completion facts. |
| Badge runtime exists through Points Service. | Points Service owns badge catalog reads and user badge awards. |
| Achievement runtime/entity is absent. | Achievement remains semantic/UI vocabulary only until a separate approved runtime contract exists. |
| Quest completion authority exists. | Completion is Quest-owned, not frontend-owned. |
| Reward delivery is async/eventual through outbox. | Completion does not equal reward grant. |
| Quest to Points is wired. | Points grants are delivered through Points Service, not by frontend or local Quest state. |
| Quest to Badge runtime handoff is absent. | Badge award must not be inferred from Quest completion. |
| localStorage/mock completion exists near reward UI. | localStorage/mock must be explicitly non-authoritative. |
| Frontend/mock/projection layers mix with reward semantics. | Projection and reward proof must be separated. |
| Tests exist but rollout remains false. | Tests remain contract confidence only, not rollout approval. |

## Inputs Reviewed

| Area | Input | Contract relevance |
|---|---|---|
| Stage 7 readiness | `stage_7_rf_rielt_closure_review_and_stage_8_readiness_v1.md` | Allows Stage 8 architectural entry while preserving no rollout, no reward activation and no Slice 16 movement. |
| Governance freeze | `stage_7_2_governance_freeze_closure_v1.md` | Freezes staging/evidence governance and explicitly blocks Quest localStorage as reward authority. |
| Module re-entry | `stage_7_3_module_alignment_reentry_plan_v1.md` | Identifies Quest/Badges/Achievements authority alignment as bounded future work. |
| Economy crosswalk | `economy_authority_terminology_crosswalk_v1.md` | Defines authority hierarchy and safe/unsafe readings for Points, projection, rewards and future layers. |
| Quest/Badge/Achievement compatibility | `quest_badge_achievement_compatibility_v1.md` | Provides semantic-only progression and achievement language; does not create runtime authority. |
| Quest OpenAPI | `docs/openapi/quest.yaml` | States Quest owns scenarios, steps, progress, submissions, validation lifecycle and domain events. |
| Points OpenAPI | `docs/openapi/points.yaml` | States Points owns ledger, badges are off-chain, and badge award does not mutate Points balance. |
| Quest runtime | `apps/quest-service/**` | Current implementation awareness for progress, submissions, completion and reward outbox. |
| Points runtime | `apps/points-service/**` | Current implementation awareness for Points ledger, idempotency, badge catalog and badge awards. |
| Frontend Quest/Connect | `apps/go2asia-pwa-shell/**` relevant Quest/Connect surfaces | Identifies runtime-backed reads, localStorage completion screen, mock quest data and projection surfaces. |
| Tests | Quest, Points, gateway and frontend copy tests | Shows local contract confidence and gaps; does not prove rollout. |

## Quest Authority Boundaries

Quest Service owns Quest-domain facts where backed by Quest API/runtime and Quest persistence.

| Domain fact | Authority owner | Not authority |
|---|---|---|
| Quest definition | Quest Service / Quest DB | Markdown docs, mock quest catalogs, frontend cards |
| Quest lifecycle | Quest Service | Connect, Space mock views, localStorage |
| User progress | `quest_progress` through Quest Service | Client progress bars, local cache, mock progress |
| Submission | `quest_submission` through Quest Service | UI proof draft, frontend event, local form state |
| Verification outcome | Quest Service according to current validation/review behavior | Client-supplied payload alone |
| Completion fact | Quest Service setting progress to `completed` | localStorage flag, UI completion screen, mock data |
| Reward configuration/intent | Quest definition / reward outbox where present | Confirmed Points grant or badge award |

Quest does not own:

- Points ledger truth;
- Points balance;
- spendability;
- badge catalog truth;
- user badge ownership;
- Achievement runtime;
- RF voucher lifecycle;
- payout, settlement, cashback or commission.

Quest completion authority means:

```text
Quest_progress_completed = Quest-owned activity/completion fact
Quest_progress_completed != Points_granted
Quest_progress_completed != badge_awarded
Quest_progress_completed != payout
Quest_progress_completed != economic_entitlement
```

## Reward Delivery Authority Boundaries

Reward delivery is a two-service boundary:

```text
Quest completion fact -> Quest reward outbox/delivery intent -> Points Service ledger decision
```

| Concern | Authority | Boundary |
|---|---|---|
| Reward intent | Quest Service outbox where current runtime creates it | Not ledger truth. |
| Points grant | Points Service ledger transaction and balance update | Not decided by Quest progress alone. |
| Delivery pending | Quest outbox pending state | Completion may exist while delivery is pending. |
| Delivery failed | Quest outbox failed state | Not frontend retry authority and not payout denial authority. |
| Idempotency of Points grant | Points Service `externalId` semantics, with Quest using deterministic delivery ids | UI must not create or replay economic effects. |
| User-facing transaction history | Points/Connect read models over ledger facts | Projection/read model, not producer authority. |

Rules:

```text
reward_config != reward_granted
reward_preview != reward_proof
outbox_pending != no_completion
outbox_failed != frontend_retry_authority
outbox_delivered != proof_of_new_credit_if_Points_returned_idempotent_replay
Points_Service_ledger_write = reward_grant_authority
```

Stage 8.1 does not change the outbox, Points API, idempotency behavior or user-facing reward status surfaces.

## Badge Authority Boundaries

Badge runtime authority is currently inside Points Service.

| Badge concern | Authority owner | Not authority |
|---|---|---|
| Badge catalog | Points Service / `badges` data seeded through DB/migrations | Quest docs, frontend mock badges, NFT badge labels |
| User badge award | Points Service / `user_badges` | Quest completion alone, localStorage, Connect UI card |
| Badge visibility | Points read APIs and Connect projection where backend-backed | Economic entitlement |
| Badge award idempotency | Points Service badge award contract | Frontend event or mock badge list |
| `first_quest_completed` availability | Badge catalog entry if seeded/active | Proof that Quest awarded it |

Badge rules:

```text
badge_visible != badge_awarded
badge_earned != points_balance
badge != entitlement
badge != payout
badge != NFT
badge != achievement_engine
badge_award != Points_ledger_mutation
Quest_completion != badge_awarded
```

Quest to Badge handoff is a known absent runtime handoff. Stage 8.1 records that gap but does not implement it.

## Achievement Semantics Boundaries

Stage 8.1 does not create an Achievement runtime entity.

Current Achievement interpretation:

| Surface | Current meaning | Authority status |
|---|---|---|
| Economy compatibility docs | Semantic milestone/recognition language | Semantic only, non-runtime |
| Connect/Levels wording | UI vocabulary around backend-backed badges or future progression | Projection/read UI |
| Mock achievements | Demo/legacy data | Non-authoritative |
| OpenAPI/runtime | No separate Achievement service/table/API found during Stage 8.0 | Runtime authority absent |

Achievement rules:

```text
achievement = semantic_or_UI_vocabulary_for_now
achievement != runtime_entity
achievement != runtime_authority
achievement_unlocked != reward_granted
achievement_display != ledger_truth
achievement != payout_trigger
achievement != NFT_mint_trigger
achievement != economic_entitlement
```

Any future Achievement runtime would require a separate explicit contract. This document does not propose or design it.

## Projection vs Authority Boundaries

| Surface | Classification | Boundary |
|---|---|---|
| Connect dashboard | Read-only projection over backend facts | Does not own ledger, badge, referral or Quest state. |
| Connect Levels / Achievements UI | Projection over Points badge catalog and user badge reads where runtime-backed | Does not create badge ownership. |
| Quest list/detail/run runtime pages | Runtime-backed UI over Quest API | UI displays Quest facts but does not own them. |
| Quest completion/rewards screen using localStorage/mock data | Local projection / legacy UX surface | Not backend proof or reward receipt. |
| Space quest/mock surfaces | Mock/demo projection | Not Quest progress or reward authority. |
| Leaderboard mock | Demo/projection only | Not completion, rank or reward authority. |
| Quest metadata `cardBadge` or UI badge label | Presentation metadata | Not Points badge catalog or award. |
| NFT badge UI wording | Future-compatible / risky copy unless explicitly backend-backed | Not NFT mint or on-chain proof. |

Projection rules:

```text
projection != authority
dashboard != ledger
preview != grant
UI_label != runtime_state
copy != proof
Connect_summary != producer
```

## localStorage / Mock Boundaries

localStorage and mock data may support local UX, demos or legacy screens. They must not be treated as backend proof or reward authority.

Known non-authoritative surfaces from Stage 8.0:

- `quest-progress-{questId}` localStorage reads in the Quest completion/rewards screen;
- `mockQuests`;
- legacy Quest reward components;
- Space mock quests, mock badges and mock Points statistics;
- mock leaderboard data;
- Connect mock achievements where not connected to backend reads.

Rules:

```text
localStorage != backend_proof
localStorage != reward_authority
localStorage != badge_authority
mock != runtime_truth
mock_completion != Quest_completion
mock_badge != user_badge_award
frontend_completion_screen != reward_receipt
```

Stage 8.1 does not remove these surfaces. It classifies them so later implementation work cannot accidentally promote them into authority.

## Runtime Proof Boundaries

| Candidate proof | Classification | Boundary |
|---|---|---|
| Quest DB progress row | Quest runtime proof for progress/completion | Not Points grant proof. |
| Quest submission row and review status | Quest runtime proof for submitted/approved/rejected proof state | Not economic entitlement by itself. |
| Quest reward outbox row | Delivery intent/retry state | Not ledger truth. |
| Points transaction row | Points grant proof | Not badge ownership proof. |
| `user_badges` award row | Badge ownership proof | Not Points balance or NFT ownership. |
| Client geo/photo/QR/text payload | Client-submitted proof material | Requires backend validation/review; not economic proof by itself. |
| Frontend event/state transition | UI state only | Not runtime proof. |
| localStorage flag | UX cache/local projection | Not backend proof. |
| Test fixture | Local test evidence | Not rollout or staging proof. |

Runtime proof rules:

```text
client_proof != verification_authority
client_event != economic_proof
frontend_event != reward_grant
tests != rollout
docs != rollout
evidence != activation
```

## Dangerous Forbidden Assumptions

| Forbidden assumption | Why forbidden | Safe reading |
|---|---|---|
| `completed` means reward granted. | Completion is Quest-owned; grant is Points-owned. | Completion and delivery/grant must be read separately. |
| `completed` means badge awarded. | Quest to Badge handoff is absent in current runtime. | Badge award requires Points-owned badge award fact. |
| `badge visible` means entitlement. | Badge visibility is recognition/projection, not spendability. | Badge may be displayed without creating payout/spend rights. |
| `achievement unlocked` means payout. | Achievement is semantic/UI vocabulary only. | Achievement display is not ledger truth. |
| localStorage completion means backend proof. | Stage 7/8 explicitly blocks localStorage as reward authority. | localStorage is UX cache/local projection only. |
| Client proof means economic proof. | Client payload must be validated/reviewed by backend and may still only prove Quest state. | Economic grant requires Points authority. |
| Frontend event means reward grant. | UI cannot write ledger or badge ownership. | Only service-owned writes count. |
| Tests mean rollout. | Stage 7 froze rollout/evidence approvals. | Tests are bounded local confidence only. |
| Docs mean rollout. | Docs-first contracts do not activate runtime. | Separate approval is required for runtime/staging/production. |
| Mock means runtime truth. | Mock is demo/local data. | Runtime truth must come from backend APIs/persistence. |
| Badge means NFT. | Badge runtime is off-chain Points-owned recognition. | NFT/on-chain remains future-only. |
| Quest reward means RF voucher/cashback. | RF voucher lifecycle remains RF-owned and voucher != cashback. | Any RF integration needs separate contract. |

Required rule block:

```text
completion != reward_granted
completion != badge_awarded
completion != payout
completion != economic_entitlement
reward_preview != reward_proof
badge_visible != badge_awarded
badge_earned != points_balance
achievement_unlocked != runtime_authority
localStorage != backend_proof
mock != runtime_truth
projection != authority
contract != activation
stable_enough != launch_ready
```

## Runtime Gaps

These are known runtime and authority gaps. This section is not a roadmap and does not sequence implementation.

| Gap | Current state | Authority impact |
|---|---|---|
| Quest to Badge handoff absent | Badge award endpoint exists in Points; Quest completion does not currently award `first_quest_completed`. | Badge award must not be inferred from Quest completion. |
| Achievement runtime absent | No separate Achievement service/table/API identified. | Achievement must stay semantic/UI vocabulary. |
| Reward delivery status surface absent or limited | Quest outbox has internal delivery state; user-facing status is not established as authority. | UI must not overstate grant delivery. |
| localStorage completion drift | Local completion screen exists near reward UI. | Must remain non-authoritative. |
| Stale mock UI | Mock Quest/Space/Connect data remains in frontend tree. | Must not be promoted into truth. |
| Frontend-only completion flows | Legacy/offline components can express completion locally. | Must not trigger rewards or badges. |
| Weak proof validation areas | Some proof types rely on client payloads or deferred external validation hardening. | Client proof must not become economic proof. |
| No Quest to Badge integration tests | Current tests cover Quest to Points and Points badge award separately. | Tests do not prove badge handoff. |
| No localStorage non-authority tests | localStorage reward screen is not covered by a guard test. | Existing tests do not prove frontend authority separation. |
| No rollout evidence | Stage 7.2 staging evidence remains frozen. | No production or rollout readiness claim. |

## Stable-Enough Stage 8 Boundaries

Stage 8 authority boundaries are stable enough for later separately approved implementation slices only if the following readings are preserved:

| Boundary | Stable-enough reading |
|---|---|
| Quest authority | Quest owns progress, submissions, verification outcomes and completion facts. |
| Points authority | Points owns ledger writes, balance truth and Points grant facts. |
| Badge authority | Points owns badge catalog reads and user badge awards. |
| Achievement boundary | Achievement is semantic/UI vocabulary only; no runtime authority exists. |
| Projection boundary | Connect, frontend summaries and reward previews are projection/read UI unless backed by a service-owned fact. |
| localStorage/mock boundary | localStorage and mock data are explicitly non-authoritative. |
| Reward boundary | Completion does not equal reward granted. |
| Badge boundary | Completion does not equal badge awarded. |
| Future-only boundary | NFT/token/on-chain/payout/settlement remain inactive. |
| Rollout boundary | Contract acceptance does not approve staging, production or public rollout. |

Stable enough does not mean implementation-ready, launch-ready or security-complete. It means later slices can reference these boundaries without reopening Stage 7 or Stage 8.0.

## Deferred / Future-Only Areas

Deferred and future-only areas:

- Quest to Badge handoff implementation;
- Achievement runtime entity, service or API;
- reward delivery status UX or API;
- proof hardening and cross-service validation expansion;
- frontend copy remediation;
- localStorage/mock removal or redesign;
- Quest to RF voucher reward automation;
- Missions service or unified progression system;
- NFT, token, G2A, wallet or on-chain features;
- payout, settlement, cashback or commission mechanics;
- Points enforcement expansion;
- staging/live evidence collection;
- production/public rollout;
- Slice 16 movement.

Deferred means not activated by this contract. It does not mean forgotten or approved.

## Relationship to Existing SSOT

This document adds authority-boundary language only.

SSOT precedence for current runtime interpretation:

```text
runtime_aligned_policy_and_current_runtime
> OpenAPI_wire_contracts
> service_runtime_behavior
> this_authority_boundary_contract
> semantic_compatibility_docs
> frontend_projection
> localStorage_or_mock
```

This contract does not replace:

- `docs/economy/points_policy_v1.md`;
- `docs/economy/referral_network_rewards_policy_v1.md`;
- `docs/economy/quest_badge_achievement_compatibility_v1.md`;
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`;
- `docs/openapi/quest.yaml`;
- `docs/openapi/points.yaml`;
- Stage 7 RF/Rielt contracts.

## Governance / Stop Rules

Stop rules:

```text
do_not_create_new_Stage_7_alignment_cycle
do_not_reopen_RF_Rielt_without_concrete_integration_breakage
do_not_create_new_governance_framework
do_not_treat_tests_as_rollout
do_not_treat_docs_as_rollout
do_not_treat_projection_as_authority
do_not_treat_contract_acceptance_as_rollout_approval
do_not_treat_stable_enough_as_launch_ready
do_not_reopen_stage_7_2_staging_freeze_via_stage_8_1
do_not_create_achievement_engine
do_not_create_reward_framework
do_not_create_unified_progression_system
```

Allowed future work must be triggered by a separate explicit implementation, API, runtime, security or evidence artifact. This contract is not that artifact.

## Acceptance Criteria

This contract is accepted if:

- Quest authority boundaries are explicit.
- Reward delivery authority boundaries are explicit.
- Badge authority boundaries are explicit.
- Achievement runtime absence and semantic-only boundary are explicit.
- Projection vs authority is explicit.
- localStorage/mock are explicitly non-authoritative.
- `completion != reward granted` is explicit.
- `completion != badge awarded` is explicit.
- `badge != entitlement` is explicit.
- Dangerous assumptions are explicitly forbidden.
- Runtime gaps are documented as gaps, not a roadmap.
- No implementation is added.
- No new semantics are invented.
- No governance recursion is introduced.
- No rollout approval is implied.
- Slice 16 remains `blocked_not_triggered`.

## Review Gate Results

This table records an internal docs-first planning posture. It is not external operational approval, not staging sign-off, not implementation approval and not runtime rollout.

| Review gate | Result | Notes |
|---|---|---|
| Requirements Review | `PASS_DOCS_FIRST` | Boundaries answer Stage 8.1 requirements without implementation scope. |
| Architecture Review | `PASS_DOCS_FIRST` | Quest, Points, Badge, Achievement and projection ownership are separated. |
| Backend/API Review | `PASS_DOCS_FIRST` | Current backend surfaces are mapped without changing APIs or runtime. |
| Frontend Review | `PASS_DOCS_FIRST` | localStorage, mock and projection surfaces are classified as non-authority. |
| QA Review | `PASS_DOCS_ONLY` | Tests are summarized as local evidence only; no tests added. |
| Security / Abuse Review | `PASS_DOCS_FIRST_WITH_GAPS` | Abuse-sensitive gaps are recorded; no enforcement activated. |
| Canon Review | `PASS_DOCS_FIRST` | This artifact adds boundary language only and does not create a new governance framework. |

## Final Status

```text
stage_8_1_status: docs_first_authority_boundary_contract_reviewed_planning_pass
stage_8_0_findings_inherited: true
stage_7_constraints_preserved: true

quest_authority_boundaries_explicit: true
reward_delivery_authority_boundaries_explicit: true
badge_authority_boundaries_explicit: true
achievement_semantic_only_boundary_explicit: true
projection_vs_authority_explicit: true
localStorage_mock_non_authoritative_explicit: true
completion_not_equal_reward_granted_explicit: true
completion_not_equal_badge_awarded_explicit: true
badge_not_equal_entitlement_explicit: true

new_quest_semantics: false
new_badge_semantics: false
new_achievement_runtime_semantics: false
new_reward_framework: false
new_governance_framework: false
new_alignment_cycle: false
new_implementation_roadmap: false

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
staging_evidence_approved: false
security_complete: false

slice_16_status: blocked_not_triggered
token_g2a_nft_wallet_activation: false
payout_settlement_cashback_activation: false
```

## Final Verdict

Stage 8.1 fixes Quest, Badge, Achievement, projection and localStorage authority boundaries without activating runtime, introducing new semantics, creating governance recursion, approving rollout, or moving Slice 16.
