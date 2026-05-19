# Stage 8 Badge / Achievement Projection Boundary Contract v1

Date: 2026-05-19
Status: `DOCS_FIRST_BADGE_ACHIEVEMENT_PROJECTION_BOUNDARY_CONTRACT_REVIEWED_PLANNING_PASS`
Stage: `Stage 8.5 / Badge Achievement Projection Boundary Contract`
Mode: docs-first projection-boundary contract only, read-only synthesis, no implementation, no runtime changes, no backend changes, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no staging evidence, no runtime execution, no rollout approval, no reward activation, no Quest to Badge handoff activation, no Points enforcement activation, no Achievement runtime activation, no achievement engine, no reward framework, no unified progression system, no Connect redesign, no badge redesign, no NFT/token/G2A/wallet/on-chain activation, no minted asset activation, no payout/settlement/cashback activation, no roadmap, no Stage 8 sequencing, no governance recursion, no Slice 16 movement

Primary inputs:

- `docs/architecture/domain/stage_8_quest_badge_authority_boundary_contract_v1.md`
- `docs/architecture/domain/stage_8_projection_vs_reward_authority_runtime_drift_prioritization_v1.md`
- `docs/architecture/domain/stage_8_quest_completion_vs_reward_delivery_separation_contract_v1.md`
- `docs/architecture/domain/stage_8_localStorage_reward_screen_isolation_patch_v1.md`
- `docs/economy/quest_badge_achievement_compatibility_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/openapi/points.yaml`
- `apps/points-service/**` for current runtime awareness only
- relevant Connect, Quest and Space frontend surfaces for projection awareness only

## Purpose

This document fixes the interpretation boundary for visible badges, badge projections, Achievement vocabulary and NFT-shaped badge presentation in Stage 8.

It answers one bounded question:

```text
what_exactly_does_a_visible_badge_or_achievement_mean
what_does_a_visible_badge_or_achievement_not_mean
what_is_badge_projection
what_is_badge_ownership
what_is_badge_awarded
what_is_achievement_vocabulary
what_is_NFT_presentation_only
what_can_and_cannot_be_read_from_Connect_badge_surfaces
```

The core contract is:

```text
badge_projection != badge_ownership
badge_visible != badge_awarded
badge_catalog_entry != user_badge_award
achievement = semantic_or_UI_vocabulary_for_now
achievement != runtime_authority
NFT_label != minted_asset
projection != authority
```

This document does not redesign badges, create an Achievement runtime, activate NFT behavior, implement Quest to Badge handoff, or approve rollout. It only fixes safe readings for existing service facts, frontend projections, mock data, and vocabulary.

## Non-goals

This contract does not:

- implement Badge changes;
- implement Quest changes;
- implement Quest to Badge handoff;
- create Achievement runtime, entity, table, service, API or engine;
- create a progression framework, missions engine or unified progression model;
- redesign Connect Levels, Connect Dashboard, Quest cards, Space surfaces or NFT badge UI;
- rewrite product copy across the application;
- create reward receipt semantics;
- create reward delivery status APIs;
- activate rewards;
- activate Points enforcement;
- activate NFT, token, G2A, wallet, bridge, minted asset, on-chain or marketplace behavior;
- create payout, settlement, cashback, commission or financial obligation semantics;
- change backend code;
- change API, OpenAPI, SDK or generated clients;
- change database schema;
- add migrations;
- add tests;
- run tests as validation evidence;
- run staging;
- collect runtime evidence;
- touch production;
- create a roadmap;
- create Stage 8 sequencing;
- create a new governance framework;
- move Slice 16.

This document is projection-boundary contract only. It is not implementation approval, QA sign-off, staging approval or rollout approval.

## Stage 7 Inherited Constraints

Stage 8.5 preserves the Stage 7 RF/Rielt stabilization discipline without reopening RF/Rielt.

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
docs != rollout
local UI state != backend proof
client event != economic proof
Quest/localStorage != reward authority
Connect projection != ledger authority
stage_8_readiness != launch_approval
slice_16_status: blocked_not_triggered
```

Stage 7 established that frontend and projection layers can display or explain backend-owned facts, but must not become ledger, lifecycle, payout, entitlement or rollout authority. Stage 8.5 applies that rule to badge visibility, Achievement terminology and NFT-shaped display.

## Stage 8 Inherited Authority Boundaries

Stage 8.5 inherits Stage 8.1 through Stage 8.4 without replacing them.

Relevant inherited rules:

```text
Quest_completion != reward_granted
Quest_completion != badge_awarded
badge_visible != badge_awarded
badge_catalog_entry != badge_award
badge != entitlement
badge != payout
badge != NFT
badge_award != Points_ledger_mutation
achievement = semantic_or_UI_vocabulary_for_now
achievement != runtime_entity
achievement != runtime_authority
achievement_unlocked != reward_granted
achievement_display != ledger_truth
reward_preview != reward_proof
localStorage != backend_proof
mock != runtime_truth
NFT_label != minted_asset
projection != authority
contract != activation
stable_enough != launch_ready
```

Stage 8.5 narrows those rules to the badge and Achievement projection question. It does not reopen the full authority audit, drift prioritization, completion-delivery separation, or Stage 8.4 implementation patch.

| Source | Inherited boundary |
|---|---|
| Stage 8.1 | Points owns badge catalog reads and user badge award facts; Achievement is semantic/UI vocabulary only. |
| Stage 8.2 | Dangerous drifts include badge visibility as entitlement, Quest completion as badge award, Achievement wording as runtime truth, and NFTBadge labels as minted assets. |
| Stage 8.3 | Quest completion is not badge award, reward receipt or backend delivery authority. |
| Stage 8.4 | The localStorage/mock completion route was isolated from reward, badge, Achievement and NFT receipt semantics; that patch does not create authority. |

## Inputs Reviewed

| Area | Inputs | Relevance |
|---|---|---|
| Stage 8 authority | `stage_8_quest_badge_authority_boundary_contract_v1.md` | Defines Quest, Points, Badge, Achievement, projection and localStorage boundaries. |
| Drift prioritization | `stage_8_projection_vs_reward_authority_runtime_drift_prioritization_v1.md` | Classifies badge visibility, Achievement ambiguity, NFTBadge copy, Quest to Badge absence and local/mock drift. |
| Completion separation | `stage_8_quest_completion_vs_reward_delivery_separation_contract_v1.md` | Separates Quest completion from reward receipt and badge award. |
| Stage 8.4 patch | `stage_8_localStorage_reward_screen_isolation_patch_v1.md` | Confirms the local reward screen was isolated without activating runtime authority. |
| Economy semantics | `quest_badge_achievement_compatibility_v1.md` | Defines badge and Achievement utility as recognition/progression language, not payout or NFT activation. |
| Economy terminology | `economy_authority_terminology_crosswalk_v1.md` | Provides UI/product wording guardrails: display is not spend permission; NFT labels are not current marketplace assets. |
| Points OpenAPI | `docs/openapi/points.yaml` | Defines off-chain badge catalog and user badge awards; badge award must not mutate Points balance. |
| Points runtime | `apps/points-service/**` | Current implementation awareness for `badges`, `user_badges`, `awardedAt`, idempotent badge awards and Connect badge projections. |
| Connect Levels | `components/connect/Levels/**` | Runtime-backed badge catalog and user badge read projection; UI uses Achievement vocabulary over badge data. |
| Connect Dashboard | `components/connect/Dashboard/**` | Runtime-backed dashboard read model with badge totals and recent awarded badges. |
| Quest frontend | `components/quest/**`, `NFTBadgeDisplay.tsx`, `mockQuests.ts` | Quest card labels, reward preview, local/mock NFT badge metadata and Stage 8.4 isolated surfaces. |
| Space frontend | `components/space/**`, `mockData.ts` | Mock badges, NFT views and quest mock data; non-authoritative projection/demo surfaces. |
| Tests | Existing Points tests, Connect copy guards and Stage 8.4 local reward isolation test | Local confidence only; no tests added or executed for this contract. |

## Badge Projection Boundary

Badge projection is read-only presentation of badge-related data. It can display catalog entries, user badge award reads or local/mock metadata. It does not create badge ownership.

Definition:

```text
badge_projection = read_only_UI_or_read_model_representation_of_badge_related_data
badge_projection != badge_ownership_producer
badge_projection != user_badge_award
badge_projection != entitlement
badge_projection != payout
badge_projection != NFT_mint
```

Current projection classes:

| Projection class | Example | Safe reading | Not safe to read as |
|---|---|---|---|
| Backend-backed catalog projection | `GET /v1/points/badges`, Connect Levels catalog cards | Active off-chain badge definitions exist in Points catalog. | User owns the badge; Quest producer handoff exists; entitlement. |
| Backend-backed user badge projection | `GET /v1/points/badges/mine`, Connect Dashboard recent badges | Points has an off-chain user badge award fact for that user and badge. | Points grant, payout, NFT mint, spendable asset. |
| Backend-backed dashboard projection | `GET /v1/points/connect-dashboard` badge totals and recent badges | Convenience read model composed from Points facts. | Source of truth, badge producer, full audit trail. |
| UI-derived `isEarned` projection | `BadgeAchievement.isEarned = Boolean(awarded)` in Connect Levels | UI flag derived from the presence of a user badge read. | Independent authority, local award event, economic grant. |
| Quest metadata projection | Quest `cardBadge`, reward preview, `nftBadges` metadata | Presentation or configured/future-compatible badge-like metadata. | Points badge catalog entry or user badge award. |
| Space/Connect/Quest mock projection | mock badges, mock achievements, mock NFT badges | Fixture/demo/local UX data. | Runtime truth, backend proof, ownership. |

Canonical mapping:

```text
catalog.isActive = catalog_visibility_only
catalog.code != user_badge_award
catalog.code != producer_handoff
isEarned = Boolean(backend_awarded_badge_read)
awardedAt_visible_in_projection = display_of_backend_award_timestamp_where_backend_backed
projection_without_awarded_read != ownership
```

The phrase "visible badge" therefore has two different meanings that must not be collapsed:

```text
catalog_visible_badge = badge_definition_is_visible
user_visible_awarded_badge = user_badge_award_is_projected_to_UI
catalog_visible_badge != user_visible_awarded_badge
```

## Badge Ownership Boundary

Badge ownership is Points-owned off-chain recognition ownership. It requires a Points-owned user badge award fact.

Authority:

```text
badge_ownership_authority: Points Service
badge_catalog_authority: Points Service / badges table
badge_ownership_proof: user_badges award row or equivalent Points-owned user badge award fact
badge_award_endpoint: POST /internal/points/badges/award
```

Runtime-backed badge ownership facts:

| Fact | Authority class | Ownership meaning |
|---|---|---|
| `user_badges` row | Badge ownership proof | User has an off-chain badge award for a badge. |
| `earned_at` / API `awardedAt` | Award timestamp projection | Timestamp of the Points-owned award fact exposed to clients. |
| `source_service`, `source_type`, `source_id` | Audit/idempotency context | Identifies the producer source for the award; not exposed equally on all projections. |
| `/v1/points/badges/mine` item | User-facing read of ownership | Backend-backed projection of user badge awards. |
| `/v1/points/connect-dashboard` badge item | Convenience projection | Recent award display; not full audit trail and not producer authority. |
| `/internal/points/badges/award` response with `applied=true` | Award creation result | New off-chain badge award was created. |
| `/internal/points/badges/award` response with `applied=false` | Idempotent duplicate result | Existing award was returned; not a new award. |

Non-ownership facts:

| Surface or fact | Why it is not ownership |
|---|---|
| Badge catalog entry | Defines a possible active badge, not a user's award. |
| Quest completion | Quest to Badge handoff is absent; completion does not create badge ownership. |
| Quest reward preview | Preview/config only, not award proof. |
| Connect UI card by itself | Projection only; it must mirror backend facts. |
| `BadgeAchievement` type | Frontend projection DTO, not a domain authority. |
| `isEarned` without backend award read | Invalid as authority; local flags cannot create ownership. |
| localStorage | UX cache only. |
| mock badge list | Fixture/demo only. |
| NFT badge label | Future-compatible presentation, not ownership. |

Badge ownership rules:

```text
user_badges_row = badge_ownership_proof
badge_catalog_entry != badge_ownership
badge_visible != badge_awarded
badge_awarded != Points_granted
badge_award != Points_ledger_mutation
badge_award != user_balance_mutation
badge_award != payout
badge_award != entitlement
badge_award != NFT_mint
Quest_completion != badge_awarded
```

OpenAPI and runtime both state that badge awards are off-chain achievements only and must not create a Points transaction or mutate Points balance. A badge can recognize participation; it cannot, by itself, create spendability, payout, entitlement, settlement or token/NFT ownership.

## Achievement Semantics Boundary

Achievement is semantic and UI vocabulary in the current system.

Definition:

```text
achievement = semantic_or_UI_vocabulary_for_milestone_recognition
achievement != runtime_entity
achievement != runtime_authority
achievement != separate_service
achievement != separate_table
achievement != API_resource
achievement != reward_grant
achievement != badge_award_unless_backed_by_user_badges_read
achievement != payout_trigger
achievement != NFT_mint_trigger
```

Current Achievement readings:

| Surface | Current meaning | Authority status |
|---|---|---|
| Economy compatibility docs | Milestone, recognition, prestige and retention language | Semantic only. |
| Connect Levels section "Достижения" | UI vocabulary over badge catalog and user badge reads | Projection only; no Achievement runtime. |
| Connect `BadgeAchievement` frontend type | Presentation shape for badge display | Projection DTO, not runtime entity. |
| Mock achievements in frontend fixtures where present | Demo/legacy data | Non-authoritative. |
| "achievement unlocked" style vocabulary | Semantic/future vocabulary unless separately backed | Not reward, payout, badge or NFT authority. |

Rules:

```text
achievement_unlocked != reward_granted
achievement_unlocked != badge_awarded_without_user_badges_fact
achievement_display != ledger_truth
achievement_display != ownership_proof
achievement_display != payout
achievement_display != entitlement
achievement_display != NFT_mint
achievement_UI_label != runtime_authority
```

Connect can use "Достижения" as a presentation label only if the safe reading remains:

```text
Connect_Achievements_section = UI_label_over_badge_projection
Connect_Achievements_section != Achievement_runtime
Connect_Achievements_section != reward_producer
```

Any future Achievement runtime would require a separate explicit contract, API, schema, runtime and review. Stage 8.5 does not propose or design it.

## NFT / Minted Asset Boundary

NFT-shaped badge terminology is dangerous because it can imply on-chain ownership, marketplace assets, tradability, scarcity economics or external financial value. None of that is active in Stage 8.5.

Rules:

```text
badge != NFT
badge_runtime = off_chain_Points_owned_recognition
NFT_label != minted_asset
NFTBadge_component != on_chain_proof
NFTBadge_type_name != runtime_NFT
NFTBadge_share_text != ownership_proof
mock_NFT_badge != minted_asset
future_compatible_display != NFT_activation
NFT_export_candidate != on_chain_export
on_chain_activation_status: not_activated
NFT_activation_status: not_activated
```

Surface classification:

| Surface | Current class | Safe reading | Dangerous misread |
|---|---|---|---|
| `NFTBadgeDisplay.tsx` | Future-compatible/local badge metadata display | UI display for badge-like metadata only; backend confirms any real badge fact. | Minted NFT, awarded asset, on-chain proof. |
| Quest `mockNFTBadges` | Mock fixture | Demo reward metadata. | Runtime award or NFT ownership. |
| Space mock badges/NFT views | Mock/demo projection | Fixture data where mounted; not authority. | User-owned NFT collection or marketplace inventory. |
| Economy NFT compatibility docs | Future-compatible vocabulary | Future boundary language only. | Current runtime activation. |
| Points badge award | Off-chain recognition | User badge award in Points. | NFT mint or tokenized asset. |

NFT terminology must remain future-compatible and non-active unless a separate approved NFT/on-chain runtime contract exists.

## Projection vs Ownership

Projection can display, summarize or explain facts. Ownership requires a service-owned award fact.

| Zone | Projection | Ownership proof | Semantic-only part | Dangerous misread | Safe reading |
|---|---|---|---|---|---|
| Connect Levels catalog | Active badge definitions from Points catalog | None for unawarded catalog entries | Category, empty hints, display order | Visible catalog card means user owns badge. | Catalog visibility only. |
| Connect Levels earned cards | `BadgeAchievement` card with `isEarned=true` | Backend `UserBadgeItem` / `awardedAt` read | Section title "Достижения" | Achievement runtime or payout. | Off-chain badge award projection. |
| Connect Dashboard badges count | `totalBadges` read model | Derived from `user_badges` count | Dashboard summary copy | Count means entitlement or spendability. | Count of backend-backed off-chain awards. |
| Connect Dashboard recent badges | Recent badge read model | Backend user badge read | "Последние достижения" wording | Full audit trail or separate Achievement runtime. | Recent display projection only. |
| Quest card badges | Quest metadata labels | None | Card labels like RF/offline/preview | Points badge award. | Presentation metadata. |
| Quest reward preview | Points preview and off-chain preview labels | None | Reward/config language | Granted reward or awarded badge. | Config/projection only. |
| `NFTBadgeDisplay` | Local/future-compatible metadata | None | Rarity and share UI | Minted/on-chain asset. | Non-authoritative display. |
| Space badges/NFT | Mock fixtures | None | Demo "earnedAt" style fields | Live ownership proof. | Mock/demo only. |
| localStorage completion route after Stage 8.4 | Legacy isolation notice | None | Linkout to backend-backed surfaces | Reward or badge receipt. | Isolated legacy route only. |

Projection rules:

```text
projection != ownership
display != award
visible != earned_unless_backed_by_user_badges
catalog != producer_handoff
UI_label != runtime_state
copy != proof
Connect_summary != producer
mock != runtime_truth
localStorage != backend_proof
```

## Dangerous Forbidden Assumptions

The following assumptions are forbidden by this contract:

| Forbidden assumption | Why forbidden | Safe reading |
|---|---|---|
| `badge visible => badge awarded` | Catalog/display visibility can exist without user award. | Award requires a Points-owned user badge fact. |
| `catalog entry => user owns badge` | Catalog defines possible badges only. | Catalog is definition/projection, not ownership. |
| `catalog entry first_quest_completed => Quest handoff exists` | Quest to Badge handoff is absent. | Catalog semantics do not prove producer wiring. |
| `Quest completed => badge awarded` | Completion is Quest-owned; award is Points-owned. | Read Quest completion and badge award separately. |
| `isEarned => ownership without backend read` | UI flags are not authority by themselves. | `isEarned` is safe only when derived from user badge reads. |
| `Connect Levels => badge producer` | Connect is read-only projection. | Points Service owns badge writes. |
| `Connect Dashboard => full badge audit trail` | Dashboard omits some producer/audit details and is a convenience read model. | Use it as display projection only. |
| `achievement unlocked => runtime authority` | Achievement runtime is absent. | Achievement is semantic/UI vocabulary. |
| `achievement displayed => ownership` | Display can be label or projection. | Ownership requires the relevant backend fact. |
| `badge earned => entitlement` | Badge is recognition, not spendability. | Entitlements need separate runtime authority. |
| `badge awarded => payout` | Badge award is not a financial action. | Payout is inactive and out of scope. |
| `badge awarded => Points grant` | Badge award does not mutate Points balance. | Points grants require Points ledger transaction. |
| `badge awarded => NFT mint` | Current badge runtime is off-chain. | NFT activation is future-only. |
| `NFT label => on-chain proof` | Labels/components can be future-compatible or mock. | Minted asset requires separate NFT/on-chain authority. |
| `cardBadge => backend award` | Quest card badge is presentation metadata. | Backend award requires `user_badges`. |
| `mock badge => runtime badge` | Mock data is fixture/demo only. | Runtime truth comes from backend APIs/persistence. |
| `local badge display => ownership proof` | Local UI and localStorage are not backend authority. | Backend proof must be service-owned. |
| `tests => rollout` | Tests are local confidence only. | Rollout requires separate approval. |
| `docs => rollout` | Docs-first contracts do not activate runtime. | Separate rollout artifact required. |

Required rule block:

```text
badge_visible != badge_awarded
badge_catalog_entry != badge_award
Quest_completion != badge_awarded
badge_award != Points_ledger_mutation
badge != entitlement
badge != payout
badge != NFT
achievement != runtime_authority
achievement_unlocked != reward_granted
NFT_label != minted_asset
cardBadge != backend_award
Connect_projection != badge_producer
mock_badge != runtime_badge
local_badge_display != ownership_proof
projection != authority
contract != activation
```

## Vocabulary Boundary

Badge, Achievement and NFT surfaces use terms that can be safe in one layer and dangerous in another. Each term must be read with its authority owner and proof class.

| Term | Runtime reading | Projection reading | Semantic-only reading | Dangerous ambiguity | Economic implication risk |
|---|---|---|---|---|---|
| `badge` | Points-owned off-chain catalog or user award where backend-backed. | UI card, catalog entry, Quest metadata, mock badge. | Recognition/progression signal. | Can imply ownership, entitlement or NFT. | Badge can be misread as money, payout or spendable value. |
| `earned` / `Получен` | Safe only when backed by `user_badges` award read. | UI label over `isEarned`. | Recognition wording. | Can imply income, grant or entitlement. | High if used near rewards or payout wording. |
| `unlocked` | No Achievement runtime meaning today unless separately backed. | UI state or future copy. | Milestone language. | Can imply entitlement or activation. | Medium to high near VIP/NFT/reward surfaces. |
| `awarded` | Points-owned user badge award if backend-backed. | Display copy of `awardedAt`. | Recognition wording. | Can imply payout or Points grant. | Medium; must stay off-chain recognition. |
| `achievement` / `Достижения` | No runtime entity today. | Connect section label over badge projection. | Milestone/prestige vocabulary. | Can imply Achievement engine. | Medium to high if tied to rewards. |
| `NFT` / `NFTBadge` | No current badge NFT runtime. | Future-compatible/mock display label. | Future externalization vocabulary. | Can imply minted asset or tradable item. | High regulatory/brand risk. |
| `minted` | No active runtime meaning in Stage 8.5. | Forbidden unless separately backed. | Future-only concept. | Can imply on-chain ownership. | High. |
| `collected` | No current ownership proof unless mapped to user badge reads. | Collection UI or mock list. | Personal archive language. | Can imply owned inventory. | Medium, especially with NFT wording. |
| `visible` | Backend visible catalog or read model where API-backed. | UI display. | Presentation language. | Can imply ownership. | Medium. |
| `active` | Catalog `isActive` means definition is active. | UI active/filter state. | Availability language. | Can imply user entitlement or claimability. | Medium. |
| `available` | Must be scoped; not badge award by default. | Catalog item, filter or UI hint. | Potential/future wording. | Can imply claimable award or payout. | High near economy surfaces. |

Vocabulary conclusion:

```text
highest_risk_terms_in_badge_projection_context: earned, awarded, achievement, NFT, minted, available
medium_risk_terms_in_badge_projection_context: visible, active, unlocked, collected
required_qualifier: owner_service_and_proof_class
```

## Runtime Drift Classification

This section classifies drifts only for the Badge / Achievement Projection Boundary. It is not a roadmap and does not sequence implementation.

### Dangerous Drifts

Dangerous drifts:

- badge catalog visibility being read as user badge award;
- catalog entries such as `first_quest_completed` being read as proof that Quest currently awards badges;
- Quest completion being read as badge award;
- `earned`, `Получен`, `Получено бейджей` or similar wording being read as economic grant, entitlement or payout;
- Connect "Достижения" wording being read as Achievement runtime;
- mock achievements being treated as live runtime data;
- Quest `NFTBadge` names, rarity labels or share surfaces being read as minted assets;
- Space/Quest mock badge `earnedAt` style fields being read as backend ownership proof;
- Connect badge projection being used as producer authority;
- dashboard badge summaries being used as full audit trail or dispute-grade proof.

### Implementation-Blocking Drifts

Implementation-blocking for authoritative interpretation:

| Drift | Blocks safe authoritative interpretation of |
|---|---|
| Quest to Badge handoff absent | Any projection claiming Quest completion awards a badge. |
| Achievement runtime absent | Any runtime Achievement ownership, unlock, claim, entitlement or payout UI. |
| NFT/on-chain runtime absent | Any UI claim that a badge is minted, tradable, on-chain or wallet-owned. |
| localStorage/mock badge data near reward surfaces | Any authoritative badge or NFT receipt interpretation from local/mock data. |
| Dashboard badge projection lacking full producer context | Any use as complete audit/dispute trail without dedicated backend proof. |

Implementation-blocking does not mean implementation is approved. It means later separately approved work must not treat the affected projection as authority while the gap remains unresolved.

### Safe-to-Defer Drifts

Safe-to-defer for this contract:

- orphaned mock badge or mock Achievement fixtures that are not mounted on live reward-critical routes;
- Space mock NFT and Quest mock data while not used as runtime badge authority;
- mixed internal names like `NFTBadge` where not surfaced as proof;
- broad copy remediation beyond directly dangerous receipt surfaces;
- badge projection frontend guard tests;
- Quest to Badge integration tests while Quest to Badge remains out of scope;
- staging/live evidence because Stage 7.2 freeze remains in effect.

Safe-to-defer does not mean approved, activated or forgotten.

### Stable-Enough Badge Boundaries

Stable-enough readings:

- Points owns active badge catalog definitions.
- Points owns user badge award facts.
- `user_badges` is the backend ownership proof class.
- `awardedAt` is a user-facing timestamp projection of the backend award fact.
- Connect Levels can safely project catalog and user badge reads where SDK/backend-backed.
- Connect Dashboard can safely project recent badges and counts as read-only convenience display.
- Quest metadata, mock data, localStorage and `NFTBadge` labels are not authority.
- Achievement remains semantic/UI vocabulary only.
- NFT/token/on-chain/payout/settlement remain inactive.

Stable enough means these readings can be referenced by later separately approved slices. It does not mean implementation-ready, launch-ready, security-complete, QA-complete or staging-approved.

## Stable-Enough Interpretation Boundaries

Stage 8.5 defines the following interpretation layer for future references:

```text
badge_projection:
  authority: read_UI_or_read_model_only
  meaning: display catalog entries and/or backend-backed user badge reads
  not: ownership producer, entitlement, payout, NFT mint

badge_catalog:
  authority: Points Service
  meaning: active off-chain badge definitions
  not: user ownership, Quest handoff proof, payout

badge_ownership:
  authority: Points Service user badge award fact
  meaning: off-chain recognition ownership
  not: Quest completion, catalog entry, UI label, Points grant, NFT

badge_awarded:
  authority: Points Service / user_badges
  meaning: user has backend-backed off-chain badge award
  not: user balance mutation, spend permission, payout, minted asset

badge_visible:
  authority: projection or catalog read depending on surface
  meaning: badge is displayed
  not: badge is awarded unless backed by user_badges read

achievement:
  authority: none as runtime entity
  meaning: semantic/UI milestone vocabulary
  not: grant, receipt, payout, runtime ownership, NFT mint

NFT_presentation:
  authority: none for current on-chain ownership
  meaning: future-compatible or mock display metadata
  not: minted asset, wallet asset, badge award substitute
```

This interpretation layer does not add new runtime states. It only fixes safe readings of existing APIs, UI labels, service data and fixtures.

## Deferred / Future-Only Areas

Deferred and future-only areas:

- Quest to Badge producer handoff;
- Achievement runtime entity, service, table, API, engine or event model;
- unified progression or missions runtime;
- Connect Levels redesign;
- Connect Dashboard badge audit trail design;
- broad badge/achievement copy remediation;
- mock badge, mock Achievement and mock NFT cleanup;
- Quest `NFTBadge` type/name migration;
- NFT minting, tokenization, on-chain export, wallet integration or marketplace behavior;
- reward receipt design;
- reward delivery status API;
- Points enforcement expansion;
- badge-award integration tests across Quest and Points;
- staging/live evidence collection;
- production/public rollout;
- Slice 16 movement.

Deferred means not activated by this contract. It does not mean approved or scheduled.

## Relationship to Existing SSOT

This document adds projection-boundary language only.

It does not replace:

- `docs/economy/points_policy_v1.md`;
- `docs/economy/referral_network_rewards_policy_v1.md`;
- `docs/economy/quest_badge_achievement_compatibility_v1.md`;
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`;
- `docs/openapi/points.yaml`;
- `docs/architecture/domain/stage_8_quest_badge_authority_boundary_contract_v1.md`;
- `docs/architecture/domain/stage_8_projection_vs_reward_authority_runtime_drift_prioritization_v1.md`;
- `docs/architecture/domain/stage_8_quest_completion_vs_reward_delivery_separation_contract_v1.md`;
- `docs/architecture/domain/stage_8_localStorage_reward_screen_isolation_patch_v1.md`;
- Stage 7 RF/Rielt contracts.

SSOT precedence for current runtime interpretation:

```text
runtime_aligned_policy_and_current_runtime
> OpenAPI_wire_contracts
> service_runtime_behavior
> stage_8_1_authority_boundary_contract
> stage_8_3_completion_delivery_separation_contract
> this_badge_achievement_projection_boundary_contract
> stage_8_2_drift_prioritization_for_risk_context
> quest_badge_achievement_compatibility_v1
> frontend_projection
> localStorage_or_mock
```

If this document appears to conflict with runtime-aligned policy, OpenAPI or actual Points runtime behavior, those higher-authority inputs control runtime interpretation. This document controls only safe readings of visible badge, Achievement and NFT-shaped projection language.

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
do_not_reopen_stage_7_2_staging_freeze_via_stage_8_5
slice_16_status: blocked_not_triggered
```

Stage 8.5-specific stop rules:

```text
do_not_create_achievement_engine
do_not_create_unified_progression_system
do_not_create_badge_handoff_in_this_contract
do_not_activate_badge_handoff_without_separate_artifact
do_not_treat_catalog_visibility_as_award
do_not_treat_Connect_Levels_or_Dashboard_as_badge_producer
do_not_treat_achievement_UI_label_as_runtime_entity
do_not_treat_NFTBadge_as_mint_proof
do_not_treat_mock_badges_as_runtime_awards
do_not_treat_localStorage_or_local_badge_display_as_ownership_proof
do_not_use_stage_8_4_patch_as_rollout_approval
do_not_reopen_stage_8_2_as_full_drift_inventory
do_not_expand_into_reward_receipt_design
do_not_expand_into_Quest_completion_delivery_tables
do_not_add_tests_in_this_contract_slice
do_not_execute_tests_as_staging_evidence
do_not_activate_NFT_token_G2A_wallet_on_chain
do_not_activate_payout_settlement_cashback
```

Allowed future work must be triggered by a separate explicit implementation, API, runtime, security or evidence artifact. This contract is not that artifact.

## Acceptance Criteria

This contract is accepted if:

- badge projection semantics are explicit;
- badge ownership semantics are explicit;
- `badge_visible != badge_awarded` is explicit;
- badge catalog versus user badge award is explicit;
- backend-backed badge facts are identified;
- Connect badge projection boundaries are explicit;
- Achievement semantic-only boundary is explicit;
- `achievement != runtime authority` is explicit;
- NFT / minted asset boundary is explicit;
- `NFT_label != minted_asset` is explicit;
- projection versus ownership is explicit per reviewed surface class;
- dangerous forbidden assumptions are explicit;
- vocabulary ambiguity is classified;
- runtime drifts are classified as dangerous, implementation-blocking, safe-to-defer or stable-enough;
- stable-enough interpretation boundaries are explicit;
- existing automated tests are classified as local confidence only, not rollout or staging proof;
- known test gaps are documented without closing them in this slice;
- deferred and future-only areas are recorded without roadmap;
- no implementation is added;
- no tests are added;
- no new semantics are invented;
- no governance recursion is introduced;
- no rollout approval is implied;
- Slice 16 remains `blocked_not_triggered`.

## Review Gate Results

This table records an internal docs-first projection-boundary posture. It is not external operational approval, not staging sign-off, not QA sign-off, not implementation approval and not runtime rollout.

| Review gate | Result | Notes |
|---|---|---|
| Requirements Review | `PASS_DOCS_FIRST` | Scope remains Badge / Achievement projection-boundary contract only. |
| Architecture Review | `PASS_DOCS_FIRST` | Badge projection, badge ownership, Achievement semantics and NFT boundaries are separated. |
| Backend/API Review | `PASS_DOCS_FIRST` | Points-owned badge catalog and `user_badges` authority are interpreted without API changes. |
| Frontend Review | `PASS_DOCS_FIRST_WITH_DANGEROUS_COPY_GAPS` | Connect, Quest and Space projection surfaces are classified without redesign. |
| QA Review | `PASS_DOCS_ONLY_WITH_TEST_GAPS` | Existing tests are inventoried as local confidence only; no tests added or executed. |
| Security / Abuse Review | `PASS_DOCS_FIRST_WITH_GAPS` | Projection-as-ownership, entitlement, payout and NFT misreads are forbidden without enforcement activation. |
| Canon Review | `PASS_DOCS_FIRST` | No new governance framework, roadmap, SSOT replacement or rollout approval is introduced. |

## Final Status

```text
stage_8_5_status: docs_first_badge_achievement_projection_boundary_contract_reviewed_planning_pass
stage_8_1_boundary_contract_inherited: true
stage_8_2_drift_prioritization_referenced_not_reopened: true
stage_8_3_completion_delivery_separation_inherited: true
stage_8_4_patch_acknowledged_not_expanded: true
stage_7_constraints_preserved: true

badge_projection_boundary_explicit: true
badge_ownership_boundary_explicit: true
badge_catalog_vs_award_explicit: true
badge_visible_not_equal_badge_awarded_explicit: true
backend_backed_badge_fact_explicit: true
Connect_badge_projection_boundary_explicit: true
achievement_semantic_only_boundary_explicit: true
achievement_runtime_absence_explicit: true
nft_minted_asset_boundary_explicit: true
NFT_label_not_minted_asset_explicit: true
projection_vs_ownership_explicit: true
vocabulary_boundary_explicit: true
dangerous_assumptions_forbidden_explicit: true
runtime_drifts_classified_for_projection_boundary: true
stable_enough_interpretation_boundaries_explicit: true
test_gaps_documented_not_closed: true

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
API_changes: false
OpenAPI_changes: false
SDK_changes: false
schema_changes: false
migrations: false
tests_added: false
runtime_execution_status: not_executed
staging_evidence_collection: not_opened

badge_handoff_activation: false
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

Stage 8.5 fixes the boundary between visible badge/Achievement/NFT-shaped projection and Points-owned badge ownership.

The core answer is:

```text
visible_badge_can_mean_catalog_projection_or_award_projection
visible_badge_does_not_by_itself_mean_user_owns_badge
badge_ownership_requires_Points_owned_user_badge_award_fact
achievement_is_semantic_or_UI_vocabulary_only
NFT_label_does_not_mean_minted_or_on_chain_asset
projection_does_not_create_authority
```

This artifact does not implement badge runtime changes, create Achievement runtime, activate Quest to Badge handoff, activate NFT/token/on-chain behavior, create entitlement/payout semantics, add tests, approve rollout, reopen governance, or move Slice 16.
