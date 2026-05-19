# Stage 8 Quest / Badge Handoff Runtime Drift Prioritization v1

Date: 2026-05-19
Status: `DOCS_FIRST_QUEST_BADGE_HANDOFF_RUNTIME_DRIFT_PRIORITIZATION_REVIEWED_PLANNING_PASS`
Stage: `Stage 8.7 / Quest Badge Handoff Runtime Drift Prioritization`
Mode: docs-first handoff-runtime drift prioritization only, read-only synthesis against Stage 8.6 handoff boundaries, no implementation, no runtime changes, no backend changes, no frontend changes, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no test execution as evidence, no staging/live evidence collection, no event handler implementation, no badge outbox/retry implementation, no Quest to Badge handoff activation, no frontend patch, no reward activation, no Points enforcement activation, no Achievement runtime activation, no achievement engine, no reward framework, no unified progression system, no NFT/token/G2A/wallet/on-chain activation, no payout/settlement/cashback activation, no roadmap, no Stage 8 sequencing, no governance recursion, no Slice 16 movement

Primary inputs:

- `docs/architecture/domain/stage_8_quest_badge_authority_boundary_contract_v1.md`
- `docs/architecture/domain/stage_8_projection_vs_reward_authority_runtime_drift_prioritization_v1.md`
- `docs/architecture/domain/stage_8_quest_completion_vs_reward_delivery_separation_contract_v1.md`
- `docs/architecture/domain/stage_8_localStorage_reward_screen_isolation_patch_v1.md`
- `docs/architecture/domain/stage_8_badge_achievement_projection_boundary_contract_v1.md`
- `docs/architecture/domain/stage_8_quest_badge_handoff_boundary_contract_v1.md`
- `docs/economy/quest_badge_achievement_compatibility_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/openapi/quest.yaml`
- `docs/openapi/points.yaml`
- `apps/quest-service/**` for current runtime awareness only
- `apps/points-service/**` for current runtime awareness only
- `packages/db/src/schema/quest.ts`
- `packages/db/src/schema/points.ts`
- relevant Connect, Quest and Space frontend surfaces for projection awareness only
- relevant Quest completion/outbox, Points badge award, Stage 8.4 local isolation and Connect copy tests for local confidence only

## Purpose

This document prioritizes known runtime drifts around the absent Quest to Badge handoff after Stage 8.6.

It answers:

```text
which_Quest_to_Badge_handoff_drifts_are_dangerous_now
which_drifts_block_safe_future_handoff_interpretation
which_drifts_can_remain_deferred_while_handoff_is_absent
which_copy_or_projection_drifts_are_dangerous_now
which_runtime_areas_are_stable_enough
which_gaps_must_not_be_read_as_roadmap_or_activation
```

Current runtime anchor:

```text
Quest_to_Points_grant_handoff: implemented_for_points_via_quest_reward_outbox
Quest_to_Badge_handoff: absent
quest_badge_outbox_exists: false
Quest_calls_internal_points_badges_award: false
Points_badge_award_endpoint: exists_as_isolated_consumer_boundary
```

Core prioritization rule:

```text
dangerous = can_make_completion_catalog_copy_mock_or_replay_look_like_badge_award
implementation_blocking = blocks_authoritative_handoff_or_receipt_interpretation
safe_to_defer = not_authority_blocking_while_handoff_remains_absent
stable_enough = current_boundary_can_be_reused_without_reopening_Stage_8
```

This document does not implement handoff, define transport, design an event handler, design an outbox, change APIs, add tests, activate badges, or approve rollout.

## Non-goals

This document does not:

- implement Quest to Badge handoff;
- implement an event handler, subscriber or worker;
- implement badge delivery outbox, retry, requeue or delivery status;
- design an endpoint;
- design API, OpenAPI or SDK changes;
- design schema changes;
- design migrations;
- design eligibility storage;
- add tests;
- execute tests as validation evidence;
- collect staging or live evidence;
- patch frontend copy or projection;
- activate Quest to Badge handoff;
- activate rewards;
- activate Points enforcement;
- activate Achievement runtime;
- create an achievement engine;
- create a reward framework;
- create a unified progression system;
- activate NFT, token, G2A, wallet, on-chain, bridge, minted asset or marketplace behavior;
- create payout, settlement, cashback, commission or financial obligation semantics;
- create a roadmap;
- create Stage 8 sequencing;
- create a new governance framework;
- approve staging;
- approve rollout;
- move Slice 16.

This document is a handoff-scoped prioritization pass only.

## Stage 7 Inherited Constraints

Stage 8.7 preserves the Stage 7 RF/Rielt stabilization discipline without reopening RF/Rielt.

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

Stage 8.7 applies those inherited constraints only to the Quest to Badge handoff drift surface. It does not reopen RF/Rielt, Stage 7.2 staging freeze or Slice 16.

## Stage 8.6 Inherited Handoff Boundaries

Stage 8.7 ranks drifts against Stage 8.6. It does not replace Stage 8.6.

Inherited handoff rules:

```text
Quest_completion = Quest-owned activity/completion fact
Quest_completion != badge_awarded
Quest_completion_event = producer_signal_only
handoff_intent != badge_ownership
handoff_intent != badge_award_fact
badge_award = Points-owned user_badge fact
badge_catalog_entry != producer_handoff
badge_catalog_entry != badge_award
Points_reward_outbox != badge_handoff
applied_false != new_badge
409_conflict != frontend_retry_authority
Connect_hint != handoff_exists
frontend_event != badge_award
localStorage != badge_proof
mock != runtime_truth
contract != activation
stable_enough != launch_ready
```

Inheritance summary:

| Source | Handoff-relevant boundary |
|---|---|
| Stage 8.1 | Quest completion is not badge award; Points owns badge catalog and `user_badges`. |
| Stage 8.2 | Quest to Badge absence is implementation-blocking for "complete Quest means badge awarded" claims. |
| Stage 8.3 | Completion is separate from delivery and grant; outbox state is not final reward truth. |
| Stage 8.4 | localStorage completion route is isolated and cannot be badge proof. |
| Stage 8.5 | Badge visibility/projection is not badge ownership; Achievement/NFT labels are non-authoritative. |
| Stage 8.6 | Handoff intent, eligibility, idempotency, failure/retry and post-handoff projection boundaries are fixed. |

## Inputs Reviewed

| Area | Inputs | Relevance |
|---|---|---|
| Handoff boundary | `stage_8_quest_badge_handoff_boundary_contract_v1.md` | Baseline for drift classification. |
| Prior drift pass | `stage_8_projection_vs_reward_authority_runtime_drift_prioritization_v1.md` | Pre-ranked Quest to Badge, catalog, copy and projection drifts. |
| Authority contract | `stage_8_quest_badge_authority_boundary_contract_v1.md` | Quest completion and Points badge authority owners. |
| Completion separation | `stage_8_quest_completion_vs_reward_delivery_separation_contract_v1.md` | Completion/delivery/grant separation applied to badge path. |
| localStorage isolation | `stage_8_localStorage_reward_screen_isolation_patch_v1.md` | Narrow dangerous local reward screen drift reduced. |
| Projection contract | `stage_8_badge_achievement_projection_boundary_contract_v1.md` | Connect and badge projection proof classes. |
| Economy docs | compatibility and terminology crosswalk | Recognition semantics, payout/NFT guards and future language rules. |
| OpenAPI | `quest.yaml`, `points.yaml` | Quest progress/events and Points badge award contract. |
| Quest runtime | `apps/quest-service/**` | Quest completion, `quest.completed`, Points reward outbox; no badge award call. |
| Points runtime | `apps/points-service/**` | Badge catalog, `user_badges`, `awardBadge`, idempotency, 409 and applied semantics. |
| DB schema | Quest and Points schemas | Quest reward outbox exists for Points; Points `badges` and `user_badges` exist. |
| Connect frontend | Levels and Dashboard | Points-backed badge reads, `isEarned`, dashboard totals/recent. |
| Quest frontend | Quest cards, reward previews, local completion route, NFT badge metadata | Mock/local/projection risks. |
| Space frontend | Space mock badges, NFT views, quest stats | Mock proof and NFT wording risks. |
| Tests | Quest outbox tests, Points badge award tests, Stage 8.4 isolation test, Connect copy tests | Local confidence only; not handoff proof. |

## Drift Classification Methodology

Stage 8.7 reuses Stage 8.2 severity classes, narrowed to handoff drift.

| Severity | Meaning in Stage 8.7 |
|---|---|
| `cosmetic` | Naming-only drift that does not touch handoff interpretation or proof surfaces. |
| `low-risk` | Isolated or already guarded drift with low chance of badge authority confusion. |
| `medium-risk` | Confuses users, support or developers, but does not directly mutate badge authority. |
| `dangerous` | Can make completion, catalog, copy, mock, local state, replay or old docs look like badge award/ownership. |
| `implementation-blocking` | Blocks authoritative handoff, receipt, retry, eligibility or evidence interpretation until separately resolved. |
| `safe-to-defer` | Does not block the current docs-first Stage 8 while handoff remains absent and non-activated. |
| `stable-enough` | Existing boundary can be reused by later separately approved work without reopening Stage 8. |

Assessment dimensions:

- producer vs consumer ownership;
- completion/event vs `user_badges` proof;
- catalog definition vs eligibility rule;
- copy/projection vs handoff existence;
- Points grant outbox vs badge delivery;
- idempotency and conflict interpretation;
- live route vs mock/orphaned surface;
- tests as local confidence vs rollout/evidence.

Implementation-blocking does not approve implementation. It only marks what cannot be assumed by future work.

## Producer Wiring Absence Drift

Quest completion currently does not call Points badge award.

| Drift | Classification | Rationale |
|---|---|---|
| Quest completion does not call `/internal/points/badges/award`. | `implementation-blocking` | Blocks any authoritative "completion currently awards badge" claim. |
| No Quest to Badge event handler/subscriber exists. | `implementation-blocking` | There is no producer-consumer runtime path for badge award. |
| No badge handoff outbox/retry exists in Quest. | `implementation-blocking` | There is no authoritative badge delivery or retry state. |
| `quest.completed` exists and is read as badge ownership. | `dangerous` | `quest.completed` is producer signal only, not consumer award fact. |
| Existing `quest_reward_outbox` is read as badge outbox. | `dangerous` | It is a Points grant path only. |
| Points badge award endpoint exists and is tested separately. | `stable-enough` for consumer, `safe-to-defer` for handoff proof | Consumer stability does not close producer wiring absence. |
| Old docs, concepts or dependency maps imply handoff exists. | `medium-risk` to `dangerous` | Legacy or aspirational docs are not runtime proof. |

Rule:

```text
Quest_to_Badge_producer_wiring_absent = implementation_blocking_for_authoritative_handoff_claims
quest.completed != badge_ownership
quest_reward_outbox != badge_handoff_outbox
Points_badge_consumer_stable != Quest_handoff_proven
```

Conclusion:

Producer wiring absence is not a bug in Stage 8.7. It is the primary implementation-blocking runtime gap for any future handoff activation or receipt UI.

## Catalog / Eligibility Drift

Catalog entries are definitions only. They are not eligibility rules and not proof of producer wiring.

| Drift | Classification | Rationale |
|---|---|---|
| Catalog entry `first_quest_completed` is read as active Quest handoff. | `dangerous` | The code exists in catalog while Quest producer wiring is absent. |
| Catalog title/description implies a user has completed the first quest when `isEarned=false`. | `dangerous` | Catalog copy can read like user fact even without `user_badges`. |
| Connect `emptyHint` says backend confirmation is required. | `stable-enough` | Current hint reduces direct completion-to-badge promise. |
| Quest type/category/theme/cardBadge/reward preview is read as eligibility. | `dangerous` | No implicit eligibility model exists. |
| Eligibility configuration is absent. | `implementation-blocking` | Blocks safe "which Quest awards which badge" interpretation. |
| Broad catalog/copy cleanup outside directly misleading handoff claims. | `safe-to-defer` | Not a blocker while no handoff is activated. |

Rules:

```text
badge_catalog_entry != eligibility_rule
badge_catalog_entry != producer_handoff
first_quest_completed_catalog_code != Quest_handoff_exists
completed_quest != award_first_quest_completed_badge
quest_type_category_cardBadge != implicit_badge_eligibility
```

Conclusion:

The seeded catalog is a real Points definition. The dangerous drift is treating that definition as a Quest producer contract or user eligibility rule.

## Idempotency / Source Identity Drift

Points has stable badge award idempotency. Quest has no badge handoff source identity today because there is no handoff.

| Drift | Classification | Rationale |
|---|---|---|
| Points requires `sourceType` and `sourceId` for badge award. | `stable-enough` | Consumer boundary is explicit. |
| `sourceService` is derived from service JWT. | `stable-enough` | Caller attribution is service-owned, not client supplied. |
| Quest has no stable badge handoff source identity today. | `implementation-blocking` | Future handoff cannot assume source identity exists. |
| Source identity is guessed from frontend, quest id, card metadata or local state. | `dangerous` | Unstable keys can create conflicts or false audit. |
| Source identity changes across retries. | `dangerous` | Same user+badge with different source can yield 409 conflict. |
| `applied=false` is celebrated as a new badge. | `dangerous` | It means existing award returned, not fresh award. |
| `409 Conflict` is treated as frontend retry authority. | `dangerous` | It is source mismatch or inactive badge semantics, not client recovery. |
| Legacy rows with null source are overread as current source-aligned handoff proof. | `medium-risk` | Points treats legacy rows as duplicate, but audit is weaker. |

Rules:

```text
Points_owns_badge_award_idempotency
future_handoff_source_identity_must_be_stable_and_service_owned
source_identity_must_not_be_guessed
applied_false != new_badge
applied_false != new_receipt
409_conflict != frontend_retry_authority
409_conflict != same_quest_idempotent_success
legacy_award_duplicate != current_handoff_proof
```

Conclusion:

Points-side idempotency is stable enough. Quest-side source identity is missing by design because the handoff is absent; guessing it is dangerous.

## Failure / Retry Drift

There is no badge handoff failure or retry state today.

| Drift | Classification | Rationale |
|---|---|---|
| No badge handoff outbox exists. | `implementation-blocking` | Blocks authoritative badge pending/failed/delivered state. |
| No badge retry/requeue exists. | `implementation-blocking` | Blocks service-owned badge retry interpretation. |
| Quest completion is rolled back in interpretation if badge award fails. | `dangerous` | Completion remains true even if badge is absent. |
| Frontend or localStorage retries badge award. | `dangerous` | Client/local state is not retry authority. |
| Connect refetch is read as retry/award. | `medium-risk` if misworded, otherwise `stable-enough` | Refetch is read-only and does not award. |
| 404/409/inactive badge responses are shown as user retry guidance. | `dangerous` | These are service-owned integration states. |
| Badge delivery status UI is absent. | `implementation-blocking` for receipt UI | Completion/intent cannot substitute for delivery authority. |

Rules:

```text
badge_handoff_failure != completion_rollback
badge_award_absent_after_completion != completion_invalid
handoff_failure != frontend_award_authority
handoff_failure != local_retry_authority
Connect_refetch = read_only_projection_refresh
no_client_retry
no_local_retry
```

Conclusion:

Failure/retry gaps do not block current Stage 8 continuation, because handoff is not active. They block any future authoritative badge delivery or receipt interpretation.

## Projection-After-Handoff Drift

Connect projection is safe only when derived from Points-backed reads.

| Drift | Classification | Rationale |
|---|---|---|
| Connect Levels derives `isEarned` from `useGetMyBadges`. | `stable-enough` | Earned projection is Points-read-backed. |
| Dashboard totals/recent derive from Points connect dashboard read model. | `stable-enough` | Projection is backend-backed but not producer authority. |
| `isEarned` is inferred from Quest completion. | `dangerous` | Completion is not badge ownership. |
| Catalog visibility is read as ownership. | `dangerous` | Catalog card can exist without user award. |
| Connect is treated as badge producer. | `dangerous` | Connect is read-only projection. |
| Dashboard is treated as full dispute-grade audit trail. | `medium-risk` | It is convenience projection and omits full source context. |
| Connect reads become stale after future completion. | `safe-to-defer` while handoff absent | Stale reads do not create false awards; future invalidation is out of scope. |
| Achievement wording in Connect is read as runtime authority. | `medium-risk` to `dangerous` | Depends on proximity to award/receipt claims. |

Rules:

```text
isEarned_must_derive_from_user_badges
Connect_projection != badge_producer
Dashboard_recent_badges != full_audit_trail
catalog_visible != user_awarded
Quest_completion_UI_must_not_claim_badge_until_Points_award_fact_exists
```

Conclusion:

Connect projection is stable enough as a read layer. The dangerous drift is changing the derivation or reading catalog/copy as ownership.

## Quest / Local / Mock Drift

Stage 8.4 reduced the highest-risk local reward screen drift, but mock and local surfaces remain non-authoritative.

| Drift | Classification | Rationale |
|---|---|---|
| `/quest/[id]/complete` no longer reads localStorage or renders reward/badge cards. | `stable-enough` | Stage 8.4 isolated the primary dangerous route. |
| localStorage completion is read as badge proof. | `dangerous` | Local state is not backend proof. |
| Quest `cardBadge`, reward preview or NFT badge metadata are read as backend award. | `dangerous` | Presentation metadata only. |
| `NFTBadgeDisplay` share/copy implies minted or awarded asset. | `medium-risk` after Stage 8.4 guard | Current text points to backend confirmation. |
| Orphaned or mock badge utilities are reconnected to live reward-critical routes. | `dangerous` if live, `safe-to-defer` if orphaned | Risk depends on mount path. |
| Space mock badges, `earnedAt`, mock Points and NFT views are read as runtime truth. | `medium-risk` to `dangerous` | Safe only as obvious demo/mock projection. |
| Broad Space/Quest mock cleanup. | `safe-to-defer` | Not blocking while not used as proof. |

Rules:

```text
localStorage != badge_proof
mock != runtime_truth
Quest_cardBadge != backend_award
NFTBadge_label != minted_asset
mock_earnedAt != user_badges_awardedAt
dangerous_if_live_or_reward_critical
safe_to_defer_if_orphaned_or_demo_only
```

Conclusion:

The primary local completion route is stable enough after Stage 8.4. Remaining mock/local drifts are dangerous only if treated as proof or mounted on reward-critical paths.

## Test / Evidence Drift

Existing tests provide local confidence, not Quest to Badge proof.

| Drift | Classification | Rationale |
|---|---|---|
| Quest tests prove completion/outbox to Points grants only. | `stable-enough` for Points grant path | They do not cover badge handoff. |
| Points tests prove badge consumer only. | `stable-enough` for consumer, `dangerous` if claimed as handoff proof | They do not prove Quest producer wiring. |
| No Quest to Badge integration test exists. | `implementation-blocking` for future evidence claims, `safe-to-defer` while handoff absent | Needed before claiming handoff works. |
| No frontend projection guard test for handoff exists. | `safe-to-defer` while handoff absent | Not blocking current docs-first pass. |
| Stage 8.4 local isolation test exists. | `stable-enough` for narrow route guard | Static string guard only, not rollout evidence. |
| Connect copy tests exist for non-financial wording. | `stable-enough` for central copy | Does not cover all Levels/Dashboard/Quest copy. |
| Staging/live evidence absent. | `safe-to-defer` and blocked by governance | Stage 7.2 freeze remains. |
| Tests are treated as rollout approval. | `dangerous` | Tests are local confidence only. |

Rules:

```text
Quest_outbox_tests != badge_handoff_tests
Points_badge_award_tests != Quest_producer_wiring_proof
Stage_8_4_static_test != rollout_evidence
Connect_copy_tests != full_UI_handoff_guard
tests != rollout
docs != rollout
```

Conclusion:

Test gaps do not block current Stage 8 continuation. They block future claims that Quest to Badge handoff is implemented, safe, or user-visible.

## Security / Abuse Drift

Absent handoff creates false badge truth risks if copy, support or UI treat completion as ownership.

| Drift | Classification | Rationale |
|---|---|---|
| User screenshots of completion or catalog are used as badge proof. | `medium-risk` to `dangerous` | Screenshots are not Points `user_badges`. |
| Support manually treats Quest completion as "user got badge". | `dangerous` | It bypasses Points ownership proof. |
| Copy promises badge on completion. | `dangerous` | Creates false receipt expectation. |
| `applied=false` is used for new badge notifications or analytics. | `dangerous` | It is duplicate replay. |
| 409 is retried by frontend or by changing source id. | `dangerous` | Violates source identity semantics. |
| Badge is treated as entitlement, payout, Points grant or NFT mint. | `dangerous` | Crosses economy and NFT boundaries. |
| Achievement unlocked is read as badge award. | `dangerous` | Achievement runtime is absent. |
| Old docs are used as runtime proof. | `medium-risk` to `dangerous` | Runtime and Stage 8 authority contracts control current reading. |

Security stop rules:

```text
STOP_if_completion_is_used_as_badge_receipt
STOP_if_catalog_is_used_as_handoff_proof
STOP_if_screenshot_is_used_as_dispute_grade_badge_proof
STOP_if_applied_false_is_celebrated_as_new_badge
STOP_if_409_is_exposed_as_frontend_retry
STOP_if_badge_is_read_as_Points_grant_payout_entitlement_or_NFT
STOP_if_achievement_unlocked_is_read_as_badge_award
STOP_if_legacy_docs_are_read_as_runtime_handoff_proof
```

Conclusion:

The highest abuse class is fake badge truth: completion, catalog, copy, screenshots, old docs or idempotency responses masquerading as Points-owned badge ownership.

## Dangerous Drifts

Dangerous drifts for Stage 8.7:

- Quest completion read as badge award;
- `quest.completed` read as badge ownership;
- catalog `first_quest_completed` read as existing producer handoff;
- catalog copy or description read as user eligibility/award fact when `isEarned=false`;
- Connect or Quest copy promising badge before Points-backed award fact;
- `quest_reward_outbox.delivered` read as badge delivery;
- Points consumer tests read as Quest handoff proof;
- `applied=false` celebrated as new badge or new receipt;
- `409 Conflict` treated as frontend retry or safe source-id change;
- localStorage/mock/Quest `cardBadge`/NFT metadata treated as badge proof;
- Space mock `earnedAt` or NFT view treated as runtime ownership;
- dashboard totals/recent badges used as complete audit/dispute proof;
- badge award read as Points grant, payout, entitlement or NFT mint;
- Achievement wording read as badge award or runtime authority;
- old docs or concept docs read as current runtime handoff proof;
- tests or docs treated as rollout.

## Implementation-Blocking Drifts

Implementation-blocking drifts for future authoritative handoff:

| Drift | Blocks safe interpretation of |
|---|---|
| Quest to Badge producer wiring absent | Any claim that completion awards badge now. |
| Badge handoff intent/outbox absent in Quest | Any authoritative pending/failed/delivered badge state. |
| Badge retry/requeue absent | Any service-owned badge retry interpretation. |
| Eligibility configuration absent | Any automatic all-completed-quests or first-quest award rule. |
| User-facing badge delivery status absent | Any receipt UI from completion or intent alone. |
| Stable Quest-side badge source identity absent | Any replay/conflict-safe future handoff assumption. |
| Quest to Badge integration tests absent | Any evidence claim that handoff works end-to-end. |
| Achievement runtime absent | Any Achievement unlock as badge authority. |
| NFT/on-chain runtime absent | Any badge mint, wallet or on-chain ownership claim. |

Implementation-blocking means future implementation slices must not assume the gap is closed. It is not approval to implement in this artifact.

## Safe-to-Defer Drifts

Safe-to-defer while Quest to Badge handoff remains absent and non-activated:

- isolated Points badge award tests remaining consumer-only;
- Quest to Badge integration tests while no handoff implementation exists;
- frontend projection guard tests specific to handoff while no handoff exists;
- broad Connect copy polish outside direct "completion means badge" claims;
- broad Space/Quest mock cleanup while mock data is not used as authority;
- internal names like `NFTBadge` where not surfaced as proof;
- dashboard full audit/dispute trail surface;
- stale Connect refetch/invalidation behavior after future handoff;
- staging/live evidence collection under Stage 7.2 freeze;
- Slice 16 evidence or activation.

Safe-to-defer does not mean approved, activated, forgotten or launch-ready.

## Stable-Enough Areas

Stable-enough readings:

- Quest owns progress, submissions, validation outcomes, completion facts and `quest.completed` as producer signal only.
- Quest to Points grant handoff exists for Points only through `quest_reward_outbox`.
- Quest to Badge runtime handoff is absent today.
- Points owns badge catalog, `user_badges`, internal badge award and badge idempotency.
- Points badge award does not create Points transactions or mutate balances.
- `applied=true` means new off-chain badge award; `applied=false` means duplicate/existing award.
- `409 Conflict` is service-owned conflict/inactive semantics, not frontend retry authority.
- Connect Levels can safely derive `isEarned` from Points `useGetMyBadges`.
- Connect Dashboard can safely project badge counts/recent from Points read model.
- Stage 8.4 primary local completion route is isolated from reward/badge receipt semantics.
- Achievement remains semantic/UI vocabulary only.
- NFT/token/on-chain/payout/settlement remain inactive.
- Tests and docs remain local confidence/contracts only, not rollout.

Stable enough means reusable for future separately approved slices. It does not mean handoff-activated, implementation-ready, evidence-complete, staging-approved or rollout-ready.

## Deferred vs Blocked

| Area | Classification | Reason |
|---|---|---|
| Quest to Badge implementation | `blocked_until_separate_implementation_artifact` | Runtime wiring is absent. |
| Event handler/subscriber | `blocked_until_separate_implementation_artifact` | Not designed or activated here. |
| Badge handoff outbox/retry | `blocked_for_authoritative_delivery_state` | No current badge delivery state exists. |
| Eligibility configuration | `blocked_for_implicit_award_rules` | Catalog is not eligibility. |
| User-facing badge delivery status | `blocked_for_badge_receipt_UI` | Completion/intent cannot be receipt. |
| Quest to Badge integration tests | `deferred_until_handoff_implementation` | Required before evidence claims, not current Stage 8. |
| Frontend handoff projection guards | `deferred_until_handoff_UI_surface` | Current Connect reads are stable. |
| Direct misleading handoff copy | `dangerous_now_if_present` | Must not promise badge before backend fact. |
| Catalog/copy polish | `deferred_unless_it_reads_as_award` | Drift depends on user-facing proof risk. |
| Mock/local/Space cleanup | `deferred_unless_live_or_reward_critical` | Dangerous only if used as proof. |
| Achievement runtime | `future_only_blocked` | No runtime authority. |
| NFT/token/on-chain | `future_only_blocked` | No runtime authority. |
| Staging/live evidence | `blocked_by_governance_freeze` | Stage 7.2 still controls. |
| Slice 16 | `blocked_not_triggered` | No movement. |

## Acceptance Criteria

This prioritization is accepted if:

- Quest to Badge runtime drifts are classified;
- producer wiring absence is classified;
- catalog/eligibility drift is classified;
- idempotency/source identity drift is classified;
- failure/retry drift is classified;
- projection-after-handoff drift is classified;
- Quest/local/mock drift is classified;
- test/evidence gaps are classified;
- security/abuse drifts are classified;
- dangerous drifts are explicit;
- implementation-blocking drifts are explicit;
- safe-to-defer areas are explicit;
- stable-enough areas are explicit;
- deferred vs blocked is separated;
- no implementation is added;
- no new semantics are invented;
- no governance recursion is introduced;
- no roadmap or Stage 8 sequencing is introduced;
- no rollout approval is implied;
- Slice 16 remains `blocked_not_triggered`.

## Review Gate Results

This table records a docs-first drift prioritization posture. It is not QA sign-off, staging sign-off, implementation approval or rollout approval.

| Review gate | Result | Notes |
|---|---|---|
| Requirements Review | `PASS_DOCS_FIRST` | Stage 8.7 remains drift prioritization only. |
| Architecture Review | `PASS_DOCS_FIRST_WITH_HANDOFF_ABSENT` | Producer/consumer gaps are classified without design. |
| Backend Review | `PASS_DOCS_FIRST_WITH_IMPLEMENTATION_BLOCKERS` | Quest wiring/outbox/source identity gaps are explicit. |
| Frontend Review | `PASS_DOCS_FIRST_WITH_PROJECTION_GAPS` | Connect reads are stable; catalog/copy/mock risks are ranked. |
| QA Review | `PASS_DOCS_ONLY_WITH_EVIDENCE_GAPS` | Existing tests are local confidence only. |
| Security Review | `PASS_DOCS_FIRST_WITH_DANGEROUS_MISREADS` | False receipt, `applied=false`, 409, NFT/payout and old-doc risks are explicit. |
| Canon Review | `PASS_DOCS_FIRST` | No roadmap, no governance recursion, no rollout approval. |

## Final Status

```text
stage_8_7_status: docs_first_quest_badge_handoff_runtime_drift_prioritization_reviewed_planning_pass
stage_8_6_handoff_boundary_inherited: true
stage_8_1_through_8_5_inherited: true
stage_7_constraints_preserved: true

Quest_to_Badge_runtime_drifts_classified: true
producer_wiring_absence_classified: true
catalog_eligibility_drift_classified: true
idempotency_source_identity_drift_classified: true
failure_retry_drift_classified: true
projection_after_handoff_drift_classified: true
Quest_local_mock_drift_classified: true
test_evidence_drift_classified: true
security_abuse_drift_classified: true
dangerous_drifts_explicit: true
implementation_blocking_drifts_explicit: true
safe_to_defer_drifts_explicit: true
stable_enough_areas_explicit: true
deferred_vs_blocked_explicit: true

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
test_execution_as_evidence: false
staging_live_evidence_collection: false

event_handler_implementation: false
badge_outbox_retry_implementation: false
Quest_to_Badge_handoff_activation: false
Achievement_runtime_activation: false
NFT_token_on_chain_activation: false
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

Stage 8.7 ranks Quest to Badge handoff runtime drifts without activating the handoff.

The core answer is:

```text
dangerous_now:
  completion_catalog_copy_mock_replay_or_old_docs_read_as_badge_award

implementation_blocking_for_future_handoff:
  absent_producer_wiring
  absent_badge_outbox_or_delivery_state
  absent_eligibility_configuration
  absent_stable_Quest_side_source_identity
  absent_Quest_to_Badge_integration_evidence

safe_to_defer_while_handoff_absent:
  isolated_consumer_tests
  broad_mock_cleanup
  broad_copy_polish
  staging_evidence
  Slice_16

stable_enough:
  Quest_completion_authority
  Points_badge_consumer_authority
  Points_idempotency
  Connect_read_projection
  Stage_8_4_local_screen_isolation
```

This artifact does not implement Quest to Badge handoff, design an event system, design an outbox, change APIs, change schema, add tests, patch frontend, activate rewards, create Achievement runtime, activate NFT/token/on-chain behavior, approve rollout, create a roadmap, reopen governance, or move Slice 16.
