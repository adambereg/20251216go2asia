# Stage 8 Projection vs Reward Authority Runtime Drift Prioritization v1

Date: 2026-05-19
Status: `DOCS_FIRST_PROJECTION_REWARD_AUTHORITY_DRIFT_PRIORITIZATION_REVIEWED_PLANNING_PASS`
Stage: `Stage 8.2 / Projection vs Reward Authority Runtime Drift Prioritization`
Mode: docs-first runtime drift prioritization only, read-only audit synthesis against Stage 8.1 boundaries, no implementation, no governance expansion, no new alignment cycle, no runtime rollout, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no staging evidence, no API calls, no DB access, no diagnostics retrieval, no deployment, no rollout approval, no reward activation, no badge handoff activation, no Points enforcement activation, no achievement engine, no reward framework, no unified progression architecture, no NFT/token/on-chain activation, no payout/settlement/cashback activation, no Stage 8 sequencing, no Slice 16 movement

Primary inputs:

- `docs/architecture/domain/stage_8_quest_badge_authority_boundary_contract_v1.md`
- Stage 8.0 baseline audit findings from read-only multi-agent synthesis
- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/roadmaps/stage_7_3_module_alignment_reentry_plan_v1.md`
- `docs/economy/quest_badge_achievement_compatibility_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/openapi/quest.yaml`
- `docs/openapi/points.yaml`
- `apps/quest-service/**` for current runtime awareness only
- `apps/points-service/**` for current runtime awareness only
- relevant Quest, Badge, Connect and Space frontend surfaces identified during Stage 8.0 and Stage 8.1

## Purpose

This document prioritizes known runtime drifts around projection versus reward authority after Stage 8.1.

It classifies which drifts are dangerous now, which are implementation-blocking for any future reward/badge/achievement projection work, which are safe to defer, and which are cosmetic or low-risk. It does not design a new system, propose a roadmap, activate rewards, or change authority boundaries.

Core question:

```text
which_projection_reward_authority_drifts_create_fake_reward_or_entitlement_truth
which_drifts_block_safe_future_interpretation
which_drifts_are_safe_to_defer
which_boundaries_are_stable_enough
```

## Non-goals

This prioritization does not:

- implement Quest changes;
- implement Badge changes;
- implement Achievement runtime;
- add Quest to Badge handoff;
- create reward delivery status APIs;
- harden proof validation;
- change APIs;
- change OpenAPI;
- regenerate SDK;
- change schema;
- add migrations;
- add tests;
- redesign frontend;
- rewrite copy;
- create an Achievement engine;
- create a reward framework;
- create a unified progression architecture;
- create a roadmap or Stage 8 sequence;
- approve staging;
- approve rollout;
- activate rewards, NFT, token, on-chain, payout, settlement or cashback;
- move Slice 16.

This document is a prioritization pass only.

## Stage 7 Inherited Constraints

Stage 8.2 preserves the Stage 7 discipline:

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

Stage 8.2 does not reopen RF/Rielt. RF voucher lifecycle and Rielt listing boundaries remain governed by Stage 7 artifacts.

## Stage 8.1 Inherited Boundaries

Stage 8.2 ranks drifts against the following Stage 8.1 boundaries:

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

## Inputs Reviewed

| Area | Inputs | Relevance |
|---|---|---|
| Stage 8.1 contract | `stage_8_quest_badge_authority_boundary_contract_v1.md` | Defines authority boundaries used as the classification baseline. |
| Governance freeze | `stage_7_2_governance_freeze_closure_v1.md` | Keeps staging/evidence frozen and blocks Quest/localStorage reward authority. |
| Module re-entry | `stage_7_3_module_alignment_reentry_plan_v1.md` | Identifies Quest/Badges/Achievements as high-risk for local/mock reward authority. |
| Economy semantics | `quest_badge_achievement_compatibility_v1.md`, `economy_authority_terminology_crosswalk_v1.md` | Defines semantic-only achievement language and unsafe economic interpretations. |
| Quest backend | `apps/quest-service/**`, `docs/openapi/quest.yaml` | Current progress, submission, completion and outbox behavior. |
| Points and Badge backend | `apps/points-service/**`, `docs/openapi/points.yaml` | Current Points ledger, badge catalog and badge award behavior. |
| Frontend Quest/Badge/Connect | `apps/go2asia-pwa-shell/**` relevant Quest, Connect, Space and reward surfaces | Current projection, localStorage, mock, copy and reward preview drift surfaces. |
| Tests | Quest, Points, gateway and frontend copy tests | Bounded local evidence only; no rollout proof. |

## Drift Classification Methodology

Severity categories:

| Severity | Meaning |
|---|---|
| `cosmetic` | Naming or copy polish risk with no meaningful authority confusion on current reward-critical paths. |
| `low-risk` | Drift exists but is isolated, dead, mock-only, or already guarded enough to avoid authority confusion. |
| `medium-risk` | Drift can confuse users or developers, but current backend authority still prevents direct reward/badge mutation. |
| `dangerous` | Drift can plausibly make projection, mock, frontend state or weak client proof look like reward/badge/economic truth. |
| `implementation-blocking` | Drift blocks safe future expansion of reward, badge, achievement or projection semantics until separately resolved or explicitly excluded. |

Assessment dimensions:

- authority misread risk;
- economic implication risk;
- proof confusion risk;
- user-facing blast radius;
- whether backend authority prevents direct economic mutation;
- whether the surface is current runtime, live route, orphaned component, docs-only, or mock-only.

Implementation-blocking in this document does not mean implementation is planned here. It means a later separately approved slice must not treat the affected projection as authority while the drift remains unresolved.

## localStorage / Mock Drift

| Drift | Severity | Rationale |
|---|---|---|
| `/quest/[id]/complete` reads `quest-progress-{questId}` from localStorage and shows a reward-shaped completion summary. | `dangerous` | The file has disclaimers, but the surface still combines local completion, Points calculation and badge display near reward language. |
| `/quest/[id]/complete` uses `mockQuests`, not the runtime Quest API. | `dangerous` | Creates a parallel universe of Quest ids and reward metadata that can be mistaken for runtime truth. |
| Local completion screen has no writer found in the current runtime runner. | `medium-risk` | Reduces normal-path exposure but does not remove deep-link or manual-localStorage fake reward perception. |
| Legacy Quest reward components and client-side badge utilities remain in the tree. | `medium-risk` | They are mostly orphaned, but their naming can reintroduce client-side reward authority if rewired. |
| Space mock quests, mock badges and mock Points statistics remain in component data. | `medium-risk` | Current public Space pages are mostly stubs/runtime shells, but the mock library can make progress/reward totals look factual if reused. |
| Connect mock achievements remain as fixture data. | `low-risk` | Live Connect Levels/Dashboard use SDK/backend reads; the mock data is a future wiring risk, not current authority. |
| Mock leaderboard data remains in Quest components. | `low-risk` | Leaderboard route is not a reward authority surface today; risk rises only if connected without demo marking. |

Conclusion:

```text
localStorage_reward_screen: dangerous
mock_quest_completion: dangerous
orphaned_mock_reward_components: medium_risk
current_runtime_runner_localStorage_authority: not_found
```

## Completion vs Reward Drift

| Drift | Severity | Rationale |
|---|---|---|
| Quest progress can be `completed` while Points delivery is pending or failed. | `dangerous` | This is correct backend design, but UI/copy can misread completion as reward grant without delivery status. |
| User-facing Quest progress responses do not establish reward delivery authority. | `implementation-blocking` | Any future reward receipt/projection cannot safely rely on `completed` alone. |
| Quest runner copy says the route is completed when progress is completed. | `medium-risk` | It is accurate for Quest lifecycle, but it does not explain Points delivery state. |
| Reward preview/config values can look like granted Points. | `medium-risk` | Runtime UI often says "after confirmation", but preview/config language remains close to economic grant wording. |
| Internal outbox status exists for operations only. | `medium-risk` | It is not a user-facing reward truth surface and cannot be used by UI as current authority without a separate contract. |

Rule:

```text
completed = Quest_lifecycle_fact
completed != Points_granted
completed != badge_awarded
```

## Quest to Badge Handoff Drift

| Drift | Severity | Rationale |
|---|---|---|
| Quest completion does not currently call Points badge award. | `implementation-blocking` | Any "first quest completed badge" projection is false if inferred from completion alone. |
| Badge catalog contains `first_quest_completed` style semantics while producer handoff is absent. | `dangerous` | Catalog and copy can create expectation that completion awards a badge. |
| Connect Levels empty hints tell users to complete the first quest to get a badge. | `dangerous` | Copy links Quest completion to badge receipt without runtime handoff. |
| Points badge award endpoint is implemented and tested separately. | `low-risk` | This is stable as isolated Badge authority, but does not close Quest to Badge. |
| No Quest to Badge integration tests exist. | `medium-risk` | Test gap confirms absence of proof, but is not itself a runtime mutation risk. |

Rule:

```text
Quest_completion != badge_awarded
badge_catalog_entry != badge_award
badge_copy_expectation != producer_handoff
```

## Achievement Ambiguity Drift

| Drift | Severity | Rationale |
|---|---|---|
| Achievement runtime/entity is absent. | `dangerous` | Any "achievement unlocked" wording can be mistaken for runtime truth if not tied to badges or clearly semantic. |
| Connect uses Achievement UI vocabulary over Points-backed badges. | `medium-risk` | Backend-backed badge reads are safe; the "achievement" label can still imply a separate runtime. |
| Economy compatibility docs define achievement as semantic-only. | `low-risk` | The guard is explicit, but docs cannot prevent UI or developer overreading. |
| Mock achievements remain as fixture data. | `low-risk` | Current live path does not use them as authority. |
| NFT/achievement wording appears in legacy or future-compatible components. | `dangerous` | Can imply minted/on-chain or entitlement semantics. |

Rule:

```text
achievement = semantic_or_UI_vocabulary_for_now
achievement != runtime_entity
achievement_unlocked != reward_granted
achievement_display != ledger_truth
```

## Projection vs Authority Drift

| Surface | Severity | Rationale |
|---|---|---|
| Connect dashboard | `low-risk` | Read-only SDK/backend surface with explicit Points/badge facts; risk is copy overreach, not write authority. |
| Connect Levels / Achievements | `medium-risk` | Backend-backed badge reads are safe, but `earned`, `Получено`, and "Достижения" can blur badge versus achievement runtime. |
| Quest detail/run reward previews | `medium-risk` | Runtime-backed Quest data but reward values are config/preview, not grant proof. |
| Quest completion/rewards screen | `dangerous` | localStorage/mock projection shaped like reward receipt. |
| Space mock quest stats | `medium-risk` | Mock Points/completion totals can look like reward truth if surfaced. |
| Leaderboard mock | `low-risk` | Ranking projection is not currently reward authority. |
| NFTBadge labels/share text | `dangerous` | "Я получил бейдж" plus NFT type naming can imply badge ownership or NFT mint on a local/mock surface. |

Conclusion:

```text
projection_mistaken_as_truth: dangerous_on_local_reward_screen
display_mistaken_as_entitlement: dangerous_on_badge_or_NFT_copy
visibility_mistaken_as_ownership: medium_to_dangerous_depending_on_backend_backing
```

## Client Proof Drift

| Drift | Severity | Rationale |
|---|---|---|
| Auto verification can approve some proof submissions without external authority. | `dangerous` | Client payload may become enough to drive Quest completion and reward outbox intent. |
| Geo proof depends on client coordinates and configured requirements. | `dangerous` | Weak configuration can turn client input into proof. |
| Photo/media and Space post ids are not complete economic proof by themselves. | `medium-risk` | They may create Quest submission/progress facts, but must not be read as reward entitlement. |
| QR/text proof relies on current validation constraints. | `medium-risk` | Risk depends on expected code or step configuration. |
| Frontend proof expectation text is UI guidance only. | `low-risk` | It does not write economic state directly. |

Rule:

```text
client_proof != verification_authority
Quest_validation_outcome != economic_proof
client_payload != reward_entitlement
```

## Idempotency / Replay Drift

| Drift | Severity | Rationale |
|---|---|---|
| Points grant uses deterministic `externalId` from Quest progress. | `low-risk` | This is a positive boundary against duplicate ledger credits. |
| Outbox `delivered` can include idempotent replay where no new credit was created. | `dangerous` | `delivered` must not be copied to UI as "new reward granted". |
| Outbox failed/pending states are internal and not user-facing. | `medium-risk` | Can cause support/user confusion when completion exists but reward delivery is not visible. |
| Badge award idempotency exists inside Points Service. | `low-risk` | Stable as Badge authority, but Quest does not call it today. |
| Frontend/localStorage cannot create backend replay effects. | `low-risk` | Economic replay is guarded, but fake perception remains a UI drift. |

Rule:

```text
outbox_delivered != proof_of_new_credit
outbox_pending != no_completion
outbox_failed != frontend_retry_authority
idempotent_replay != duplicate_reward
```

## Vocabulary Drift

| Term | Runtime/projection/semantic reading | Severity | Ambiguity |
|---|---|---|---|
| `completed` | Quest progress runtime state; also local/mock/semantic wording | `dangerous` | Can be misread as reward granted or badge awarded. |
| `rewarded` | Referral/runtime or UI copy, not Quest progress | `dangerous` | Sounds like final economic grant. |
| `earned` | UI/projection and semantic event vocabulary | `dangerous` | Can imply income or confirmed grant. |
| `granted` | Points grant concept where ledger-backed; semantic elsewhere | `dangerous` | Must not be used without Points authority. |
| `unlocked` | RF/projection/future/semantic usage | `medium-risk` | Can imply entitlement or NFT activation. |
| `available` | Economy/RF/projection usage | `dangerous` | Can imply spendability or payout. |
| `active` | Runtime/projection mixed usage | `medium-risk` | Can imply usable or entitled when only grouped/displayed. |
| `visible` | Display/projection usage | `medium-risk` | Can imply ownership or spendability. |
| `verified` | Review/source/verifier vocabulary | `medium-risk` | Can imply economic proof if not scoped. |
| `pending` | Submission, outbox, referral and semantic usage | `medium-risk` | Multiple owners; can hide delivery state. |
| `failed` | Quest progress, outbox or UI transport state | `medium-risk` | Must distinguish lifecycle failure from delivery failure. |
| `expired` | Quest/RF lifecycle or semantic archival | `low-risk` | Less tied to reward grant but still cross-domain. |

Vocabulary conclusion:

```text
highest_risk_terms: completed, rewarded, earned, granted, available
medium_risk_terms: unlocked, active, visible, verified, pending, failed
lower_risk_terms: expired
```

## Runtime Gap Severity Matrix

| Runtime gap | Severity | Classification |
|---|---|---|
| localStorage/mock completion adjacent to reward UI | `dangerous` | Projection can look like reward receipt. |
| Quest completion treated as Points grant by UI/copy | `dangerous` | Completion and delivery are separate. |
| Missing user-facing reward delivery authority surface | `implementation-blocking` | Blocks safe reward receipt/projection interpretation. |
| Quest to Badge handoff absent | `implementation-blocking` | Blocks safe badge-award projection from Quest completion. |
| Achievement runtime absent | `implementation-blocking` | Blocks any runtime achievement claim. |
| Badge visibility treated as entitlement | `dangerous` | Recognition display can be misread as ownership/spend/payout. |
| NFTBadge/local badge copy sounding authoritative | `dangerous` | Can imply minted or awarded asset. |
| Client proof weak validation areas | `dangerous` | Can turn client payload into reward-adjacent completion. |
| Idempotent outbox delivery read as new credit | `dangerous` | `delivered` is not always new grant. |
| No Quest to Badge integration tests | `medium-risk` | Evidence gap, not direct authority mutation. |
| No localStorage non-authority tests | `medium-risk` | Regression risk around UI truth. |
| Space/leaderboard mock surfaces | `medium-risk` to `low-risk` | Depends on whether connected to reward surfaces. |
| Mixed terminology or RU/EN labels | `cosmetic` | Unless placed on reward proof surfaces. |

## Dangerous Drifts

Dangerous drifts:

- localStorage/mock completion shaped as reward receipt;
- Quest `completed` shown without reward delivery separation;
- Connect or frontend copy implying "complete quest = badge received";
- badge display or "earned" wording implying entitlement;
- Achievement or NFT wording implying runtime ownership, payout or mint;
- client proof payload being read as economic proof;
- outbox `delivered` being read as a new credit rather than delivery acceptance/idempotent replay;
- `available`, `earned`, `granted`, `rewarded` used without owner/service qualifier.

## Implementation-Blocking Drifts

Implementation-blocking drifts:

| Drift | Blocks safe interpretation of |
|---|---|
| Quest to Badge handoff absent | Any projection claiming Quest completion awards a badge. |
| Achievement runtime absent | Any runtime Achievement ownership, unlock, claim or entitlement UI. |
| Missing user-facing reward delivery authority surface | Any reward receipt UI based on completion alone. |
| localStorage/mock completion near reward UI | Any reward-critical frontend path that can be deep-linked or reused as authority. |
| Weak proof validation areas on reward-adjacent paths | Any future slice that treats Quest completion as sufficient reward qualification. |

Implementation-blocking does not approve implementation. It identifies unsafe assumptions for any future separately approved work.

## Safe-to-Defer Drifts

Safe-to-defer drifts:

- orphaned mock components not mounted on reward-critical routes;
- Connect mock achievements not used by live Levels/Dashboard;
- leaderboard mock while not connected to reward or payout surfaces;
- mixed internal labels that do not imply grant, spend or entitlement;
- missing localStorage guard tests while Stage 8.2 remains docs-only;
- Quest to Badge integration tests while Quest to Badge remains out of scope;
- RF voucher automation as Quest reward, since RF remains Stage 7-owned and future-only for Quest reward semantics;
- staging/live evidence, because Stage 7.2 freeze remains in effect and Stage 8.2 is not rollout approval.

## Deferred vs Blocked

| Area | Classification | Reason |
|---|---|---|
| Quest to Badge implementation | `blocked_for_authoritative_projection` | Runtime handoff absent; cannot be inferred. |
| Achievement runtime | `blocked_for_runtime_truth` | No authority/entity/API exists. |
| Reward receipt UI | `blocked_for_authoritative_receipt` | Delivery status surface is absent or internal only. |
| localStorage/mock removal | `deferred_not_activated` | Important drift, but Stage 8.2 does not implement UI changes. |
| Proof hardening | `deferred_security_work` | This pass only prioritizes drift; no enforcement activation. |
| Space/leaderboard mock cleanup | `safe_to_defer` | Not current reward authority. |
| NFT/token/on-chain | `future_only_blocked` | Forbidden by Stage 7/8 constraints. |
| Staging evidence | `blocked_pending_approval` | Stage 7.2 freeze remains. |
| Slice 16 | `blocked_not_triggered` | No movement. |

## Stable-Enough Areas

Stable-enough readings:

- Quest owns progress, submission, verification outcome and completion facts.
- Points owns ledger grant, balance and Points delivery authority.
- Points owns Badge catalog reads and `user_badges` awards.
- Achievement remains semantic/UI vocabulary only.
- Connect dashboard and Levels are projections/read models, not producers.
- localStorage and mock data are non-authoritative.
- Completion does not equal reward granted.
- Completion does not equal badge awarded.
- Badge does not equal entitlement, payout or NFT.
- Tests and docs do not equal rollout.
- Stage 8.2 does not reopen Stage 7 or Stage 8.1.

Stable enough means these readings can be reused. It does not mean security-complete, implementation-ready, staging-approved or launch-ready.

## Acceptance Criteria

This prioritization is accepted if:

- drifts are classified by severity;
- dangerous drifts are explicit;
- implementation-blocking drifts are explicit;
- safe-to-defer drifts are explicit;
- stable-enough boundaries are explicit;
- projection vs authority ambiguity is mapped;
- localStorage/mock risks are mapped;
- Quest to Badge mismatch is classified;
- vocabulary ambiguity is classified;
- deferred vs blocked is separated;
- no implementation is added;
- no new semantics are invented;
- no governance recursion is introduced;
- no roadmap or Stage 8 sequencing is introduced;
- no rollout approval is implied;
- Slice 16 remains `blocked_not_triggered`.

## Review Gate Results

This table records an internal docs-first prioritization posture. It is not external operational approval, not staging sign-off, not implementation approval and not runtime rollout.

| Review gate | Result | Notes |
|---|---|---|
| Requirements Review | `PASS_DOCS_FIRST` | Scope remains prioritization only. |
| Architecture Review | `PASS_DOCS_FIRST` | Stage 8.1 boundaries are reused, not changed. |
| Backend/API Review | `PASS_DOCS_FIRST` | Runtime drifts are classified without API changes. |
| Frontend Review | `PASS_DOCS_FIRST` | Projection, localStorage, mock and copy drifts are ranked without redesign. |
| QA Review | `PASS_DOCS_ONLY` | Test gaps are classified without adding tests. |
| Security / Abuse Review | `PASS_DOCS_FIRST_WITH_GAPS` | Fraud-sensitive drifts are prioritized without enforcement activation. |
| Canon Review | `PASS_DOCS_FIRST` | No new governance framework, roadmap or SSOT replacement is introduced. |

## Final Status

```text
stage_8_2_status: docs_first_projection_reward_authority_drift_prioritization_reviewed_planning_pass
stage_8_1_boundary_contract_inherited: true
stage_7_projection_discipline_preserved: true

drift_inventory_present: true
dangerous_drifts_identified: true
implementation_blocking_drifts_identified: true
safe_to_defer_drifts_listed: true
stable_enough_boundaries_listed: true
projection_authority_ambiguity_mapped: true
localStorage_mock_risks_mapped: true
quest_badge_mismatch_classified: true
vocabulary_ambiguity_classified: true

new_quest_semantics: false
new_badge_semantics: false
new_achievement_runtime_semantics: false
new_reward_framework: false
new_governance_framework: false
new_alignment_cycle: false
new_implementation_roadmap: false
new_stage_8_sequence: false

code_changes: false
OpenAPI_changes: false
SDK_changes: false
schema_changes: false
migrations: false
tests_added: false
runtime_execution_status: not_executed
staging_evidence_collection: not_opened

runtime_rollout_approval: false
production_launch_ready: false
public_rollout_ready: false
contract_acceptance_implies_rollout: false

reward_activation: false
badge_handoff_activation: false
Points_enforcement_activation: false
slice_16_status: blocked_not_triggered
token_g2a_nft_wallet_activation: false
payout_settlement_cashback_activation: false
```

## Final Verdict

Stage 8.2 ranks projection versus reward authority drifts against the Stage 8.1 contract. Dangerous misreads are separated from implementation-blocking gaps and deferrable surface noise. This artifact does not change authority, approve rollout, sequence implementation, activate rewards, or move Slice 16.
