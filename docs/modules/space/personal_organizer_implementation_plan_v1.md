# Personal Organizer Implementation Plan v1

Status: planning draft grounded in current repo state  
Scope: audit-backed implementation plan for introducing the new Personal Organizer inside `Space Asia` without opening an unbounded redesign

## 1. Framing

This document is not a rewrite of the new SSOT. It translates the new Personal Organizer canon into an implementation plan that fits the actual current shape of `Space Asia` in this repository.

Module-level framing for this plan is explicit:

- `Space Asia` remains a dashboard-first personal/social hub
- `Personal Organizer` is a trip-first subsection inside `Space Asia`

Accordingly, this plan is about how to introduce Organizer into the broader `Space` shell, not about redefining the whole `Space` module around trip planning.

The plan is based on three inputs:

- current `Space` runtime/code/contracts/frontend status
- legacy organizer traces already present in docs and partial frontend behavior
- the new canonical Personal Organizer docs:
  - `docs/modules/space/go_2_asia_personal_organizer_ssot_v_1.md`
  - `docs/modules/space/Placement-of-Personal-Organizer-inside-Space-Asia.md`

Core planning rule:

> do not design Organizer as if `Space` started from zero  
> do not read trip-first Organizer logic as the identity of the whole `Space Asia` module  
> do not force the new trip-first model into the old social/execution organizer shape  
> do not overload `space-service` with planner ownership that current architecture explicitly keeps optional/transitional

## 2. Phase A. Space Current-State Audit

### 2.1 Current module truth

`Space Asia` currently exists in two different but connected forms:

- `Space` as the user-facing shell/module
- `space-service` as the bounded social-core backend

This split is explicitly documented in:

- `docs/architecture/space/space_status_framing_audit_2026_04_12.md`
- `docs/architecture/space/space_backend_architecture_v_1.md`
- `docs/architecture/space/space_domain_model_v_1.md`
- `docs/modules/space/space_ui_backend_mapping_v_1.md`

### 2.2 What already exists for real

Backend/runtime assets already present:

- `apps/space-service`
- `docs/openapi/space.yaml`
- `packages/db/src/schema/space.ts`
- gateway-facing `/v1/space/*` contract and service routing
- generated Space SDK/types consumed by frontend

Real backend/domain surface today:

- posts / reposts
- groups / memberships
- profile projections
- feed surfaces
- activity feed
- media attach relations

Evidence:

- `apps/space-service/src/routes/posts.ts`
- `apps/space-service/src/routes/feed.ts`
- `apps/space-service/src/services/spaceService.ts`
- `docs/openapi/space.yaml`
- `packages/db/src/schema/space.ts`

Real frontend Space routes today:

- `/space`
- `/space/community`
- `/space/community/feed`
- `/space/community/groups/[groupId]`
- `/space/posts`
- `/space/saved`
- `/space/activity`
- `/space/profiles/[userId]`

Additional placeholder/deferred pages also exist in the route tree, but they are not honest live product slices:

- `/space/balance`
- `/space/quests`
- `/space/vouchers`
- `/space/nft`
- `/space/referrals`
- `/space/settings`

Evidence:

- `apps/go2asia-pwa-shell/app/(public)/space`
- `apps/go2asia-pwa-shell/components/space/Shared/SpaceNav.tsx`
- `docs/modules/space/space_frontend_baseline_status_note_v1.md`

### 2.3 What is live vs planned vs partial

#### Real / live enough now

- dashboard-shell baseline on `/space`
- community root baseline on `/space/community`
- full social feed surface on `/space/community/feed`
- public group detail baseline
- authored posts baseline
- narrow activity baseline
- saved posts baseline backed by reactions bookmarks for `space_post`

Evidence:

- `docs/modules/space/space_frontend_baseline_status_note_v1.md`
- `docs/architecture/space/space_current_cycle_closure_note_v1.md`
- `apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/community/CommunityRootPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/saved/SavedPostsPageClient.tsx`

#### Partial / thin by design

- dashboard composition is real but still preview-heavy
- organizer exists only as dashboard preview semantics, not as a full route
- community root is discovery-first and intentionally not a full community engine
- saved is live only for `space_post` bookmarks
- activity is narrow and not a notification center

Evidence:

- `apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/useSpaceSavedReactions.ts`
- `docs/modules/space/space_frontend_baseline_status_note_v1.md`
- `docs/plans/Space-Asia-Live-Surfaces-Sequencing-v1.md`

#### Only in SSOT / planning / architecture docs

- `/space/organizer` as a real route
- organizer-specific backend endpoints
- organizer storage model in runtime schema
- trip-first Organizer/planner domain local to the Organizer section, not to the whole `Space` module
- cross-module saved-to-trip execution
- map/day/reminder/comparison/trip dashboard model from the new Personal Organizer SSOT

Evidence:

- `docs/modules/space/space_frontend_information_architecture_v_1.md`
- `docs/modules/space/space_ui_backend_mapping_v_1.md`
- `docs/architecture/space/space_openapi_outline_v_1.md`
- `docs/architecture/space/space_domain_model_v_1.md`
- `docs/modules/space/go_2_asia_personal_organizer_ssot_v_1.md`

### 2.4 Existing navigation assumptions

Current actual primary navigation in code:

- Dashboard
- Community
- Feed
- Posts
- Saved
- Activity

Organizer is not in current nav. Profile is not in `SpaceNav`, even though profile route exists. Connections is not an implemented Space section at all; the closest real contour is community/groups.

Evidence:

- `apps/go2asia-pwa-shell/components/space/Shared/SpaceNav.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/profiles/[userId]/page.tsx`

### 2.5 Current structural rigidity vs expansion room

#### Rigid today

- `space-service` is socially bounded and should not become planner truth
- actual runtime contract `docs/openapi/space.yaml` contains no organizer endpoints
- actual DB schema `packages/db/src/schema/space.ts` contains no organizer entities
- current saved runtime is tied to `reactions-service` bookmarks of `space_post`

Evidence:

- `docs/architecture/space/space_backend_architecture_v_1.md`
- `docs/architecture/space/space_service_implementation_plan.md`
- `docs/openapi/space.yaml`
- `packages/db/src/schema/space.ts`
- `apps/reactions-service/src/services/reactionsService.ts`

#### Expandable today

- `Space` frontend shell already supports new first-level sections
- dashboard already contains Organizer preview and saved-to-action language
- current IA docs already reserve Organizer as a primary surface
- `Saved` already behaves as a source layer rather than an end-state layer
- architecture docs already permit an extraction-friendly adjacent organizer/planner domain

Evidence:

- `apps/go2asia-pwa-shell/components/space/Shared/SpaceLayout.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx`
- `docs/modules/space/space_frontend_information_architecture_v_1.md`
- `docs/architecture/space/space_backend_architecture_v_1.md`

## 3. Phase B. Legacy Organizer Discovery and Assessment

### 3.1 What the legacy organizer actually was

The legacy organizer was not the new Personal Organizer.

It was a bounded execution/coordination layer inside `Space`, centered on:

- saved-to-action conversion
- follow-ups
- reminders
- growth goals
- social/community rhythm
- AI-assisted next actions
- practical execution around existing social/ecosystem signals

It was explicitly not designed as:

- a generic todo app
- a full trip planner
- a trip-first travel workspace

Evidence:

- `content/space/Space-Asia-Organizer-Content-Pack-v1.md`
- `docs/modules/space/space_ui_ux_concept_v_3.md`
- `docs/modules/space/space_frontend_information_architecture_v_1.md`

### 3.2 Where legacy organizer is already reflected

#### Docs / IA / planning

- dedicated organizer content pack with `/space/organizer`
- Organizer in frontend IA as a primary route
- UI/backend mapping with optional organizer endpoints
- domain model with optional `space_organizer_item`
- openapi outline with optional organizer contract
- execution roadmap and sequencing docs with organizer preview/baseline phase

Evidence:

- `content/space/Space-Asia-Organizer-Content-Pack-v1.md`
- `docs/modules/space/space_frontend_information_architecture_v_1.md`
- `docs/modules/space/space_ui_backend_mapping_v_1.md`
- `docs/architecture/space/space_domain_model_v_1.md`
- `docs/architecture/space/space_openapi_outline_v_1.md`
- `docs/plans/Space-Asia-Execution-Roadmap.md`
- `docs/plans/Space-Asia-Live-Surfaces-Sequencing-v1.md`

#### Frontend traces

- dashboard has an `Organizer Preview` block
- organizer-preview items are sourced from saved/community/activity heuristics
- wording still frames organizer as a thin execution layer, not as trip workspace

Evidence:

- `apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx`
- `content/space/Space-Asia-Dashboard-Content-Pack-v1.md`

#### Backend / domain / API traces

- optional `space_organizer_item` is documented
- optional `/v1/space/organizer` endpoints are documented in architecture outlines
- but none of this is present in actual runtime contract/schema/routes

Evidence:

- `docs/architecture/space/space_domain_model_v_1.md`
- `docs/architecture/space/space_openapi_outline_v_1.md`
- `docs/modules/space/space_ui_backend_mapping_v_1.md`
- `docs/openapi/space.yaml`
- `packages/db/src/schema/space.ts`
- `apps/space-service/src/routes`

### 3.3 How deeply legacy organizer is integrated today

Depth of integration is currently:

- strong in docs/planning
- light in frontend preview semantics
- absent in backend runtime ownership

This matters because the repository already has a conceptual organizer contour, but not an implemented organizer subsystem.

### 3.4 Reuse value from legacy organizer

What should be preserved:

- Organizer lives inside `Space Asia`, not as a separate top-level module
- Organizer is a primary section, not a buried widget
- Saved is a source layer, not the organizer itself
- Dashboard preview can remain as the lightweight entry/promise layer
- extraction-friendly boundary remains the right architectural discipline
- calm action-oriented UX is still valid

What can be selectively reused:

- preview semantics for dashboard
- saved-to-action entry logic
- AI state labeling such as suggested/prepared/requires-confirmation
- the principle that composite organizer data should come through adapters/BFF, not by overstuffing `space-service`

### 3.5 What must be discarded from legacy organizer

- the single-item `space_organizer_item` model as the primary conceptual center
- the old block set `Timeline / Plans / Actions / Signals / Growth / AI actions` as the main canon for the new product
- social/community-maintenance tasks as organizer core semantics
- the assumption that a planner-like route can be truthfully modeled without explicit trip containers
- the implicit blending of saved/execution/growth/community signals into one generic execution bucket

### 3.6 Conflict with new Personal Organizer SSOT

Main conflicts:

- legacy organizer is action-first but not trip-first
- legacy organizer treats plans as broad practical intent, not as canonical `Trip`
- legacy organizer centers organizer items; new SSOT centers `Trip`
- legacy organizer is compatible with saved-to-action; new SSOT requires saved-to-trip separation
- legacy organizer has no real trip entity graph
- legacy organizer is partially social/community execution; new SSOT is explicitly travel-specific

Evidence:

- `content/space/Space-Asia-Organizer-Content-Pack-v1.md`
- `docs/architecture/space/space_domain_model_v_1.md`
- `docs/modules/space/go_2_asia_personal_organizer_ssot_v_1.md`

### 3.7 Migration style recommendation

Recommended mode:

**conceptual replacement with selective evolutionary reuse**

Not recommended:

- pure migration of legacy organizer item model into production
- direct implementation of `space_organizer_item` as the main v1 foundation
- pretending that the new Personal Organizer is just "legacy organizer but deeper"

Why:

- the old contour gives useful placement/navigation principles
- but its domain center conflicts with the new trip-first SSOT

## 4. Phase C. Organizer Placement Analysis

### 4.1 Why Organizer should live inside Space Asia

Because the real current `Space` shell already contains the user-facing context that naturally feeds Organizer:

- dashboard
- saved
- community/group context
- posts/profile identity
- activity

This is already the broader dashboard-first personal/social shell where the user moves between discovery, curation, social participation and action. The new SSOT therefore fits the module boundary, even though planner ownership should not default to `space-service`.

That does not mean the whole `Space` module becomes trip-first. It means Organizer is a new trip-first section inside a wider `Space Asia` hub.

### 4.2 Why Organizer should be a primary section / tab

Grounded in current state:

- current `/space` dashboard already exposes Organizer as a distinct preview promise
- current IA docs already reserve `/space/organizer`
- saved is already separate and cannot carry trip context alone
- dashboard would become overloaded if trip planning stayed only as cards/previews

Therefore Organizer should be promoted to first-level navigation, not hidden under `Saved`, `Feed`, `Profile`, or dashboard widgets.

This promotion should be read as giving Organizer a clear primary section/tab inside `Space`, not as making Organizer the new center of all `Space` behavior.

### 4.3 Relation to current real Space sections

#### Dashboard

Dashboard should remain the cockpit and preview layer.

Organizer should not replace `/space`; it should be the deeper planning mode reached from dashboard preview and direct nav.

#### Community / Feed

Community and feed remain discovery/social input surfaces.

Organizer consumes signals from them only when they become relevant to a trip.

#### Saved

Saved remains the global shortlist/source layer.

Organizer consumes saved items into trip context, but must not collapse saved and trip into one list.

#### Posts / Profile

These remain social identity surfaces, not planning surfaces.

They can provide entry points only when an object or post should be saved or added to a trip.

#### Connections

There is no real standalone `Connections` section in the current Space shell/code. Planning should therefore avoid assuming an existing connections tab. If a future connections layer appears, Organizer may consume it as signal/context, but it should not shape v1 navigation.

### 4.4 Boundary between global saved and trip context

This boundary must stay strict:

- global saved = user-level shortlist/reference pool
- organizer trip context = selected subset plus travel-specific status/tasks/notes/next-step logic

In current repo terms:

- today `Saved` is backed by reactions bookmarks of `space_post`
- tomorrow Organizer must read from a broader saved abstraction, not from trip items pretending to be bookmarks

This is one of the most important design protections against scope confusion.

### 4.5 Practical placement inside the current shell

Recommended first-level nav evolution for the Organizer rollout:

- Dashboard
- Community
- Organizer
- Saved
- Activity

`Feed` and `Posts` can still remain reachable as direct or contextual Space entries even if the first implementation slice uses a compressed top-level shell.

If nav compression is needed in the first implementation slice, `Posts` may temporarily remain a secondary route/entry, but this should be treated as a shell simplification only, not as a loss of product role inside the broader dashboard-first/personal-social `Space` module.

This is more practical than trying to insert Organizer without reducing nav noise. It is not a claim that Organizer replaces `Dashboard`, `Communities`, `Feed`, `Posts`, `Saved`, or `Activity` as core `Space` sections.

Evidence:

- `apps/go2asia-pwa-shell/components/space/Shared/SpaceNav.tsx`
- `docs/modules/space/space_frontend_information_architecture_v_1.md`
- `docs/modules/space/Placement-of-Personal-Organizer-inside-Space-Asia.md`

### 4.6 Recommended minimal navigation contour

For the first real implementation slice:

- `/space/organizer`
- `/space/organizer/trips/[tripId]`

Do not open full second-level route explosion in the first slice.

Inside `/space/organizer`, use in-page sections or lightweight tabs:

- Overview
- Trips
- Saved intake

Inside `/space/organizer/trips/[tripId]`, use bounded internal sections:

- Dashboard
- Items
- Tasks
- Notes

Defer dedicated first-wave routes for:

- map
- day planner
- AI workspace
- comparisons
- reminders center

## 5. Phase D. Bounded Implementation Plan

### 5.1 Product understanding

The new Personal Organizer is:

- a trip-first personal travel workspace
- a layer that turns saved interest into structured trip execution
- not equal to favorites/bookmarks
- not equal to legacy organizer execution cards
- not equal to a generic planner or notes tool

This trip-first definition applies to the Organizer section itself inside `Space`, not to `Space Asia` as a whole.

Key user contour:

discover -> save -> create/select trip -> move relevant items into trip -> decide -> prepare -> execute

### 5.2 First practical implementation slice

#### First slice definition

**Organizer skeleton inside Space with real trip containers and saved-to-trip baseline**

#### Must be inside the first slice

- Organizer promoted to first-level Space section
- trip container creation/listing
- active trip / draft trip surface
- add saved items into trip
- trip dashboard baseline
- simple `what matters now`
- simple `next step`
- trip item statuses
- travel-specific tasks
- trip notes

#### Keep in v1.1 / later

- full day planning
- map-first planning
- reminders system depth
- comparison layer
- cross-trip advanced switching
- explainable AI graph
- offline field mode
- collaboration/shared trips

#### Execution-critical parts of the new SSOT for the first slice

- `Trip` as the primary container
- separation of `Saved layer` and `Trip layer`
- trip-specific statuses
- action-oriented dashboard
- minimal next-step logic
- travel-specific tasks, not generic todos

#### Future-facing parts of the SSOT

- full `TripDayAssignment`
- route logic
- comparison sets
- deep reminders
- context signal graph
- advanced AI readiness audit
- nearby/map orchestration

### 5.3 Frontend / IA / routing scope

#### Required first routes

- `/space/organizer`
- `/space/organizer/trips/[tripId]`

#### Required first screens

- Organizer home
- create/select trip
- trip dashboard
- add-to-trip flow from saved source

#### Required first UI states

- auth required
- no trips yet
- no saved items yet
- trip exists but empty
- loading / sync
- thin cross-domain unavailable state

#### Minimal navigation contour

- top-level Organizer in `SpaceNav`
- dashboard preview CTA continues to point into Organizer
- `Saved` gets explicit CTA: `Add to trip`
- trip detail uses local segmented navigation, not many first-wave subroutes

#### Scope control rule

Do not rebuild the whole `Space` shell for Organizer.

Add one primary section and two real routes; keep the rest inside those routes as bounded screen composition.

### 5.4 Backend / domain / API implications

#### Recommended backend boundary

Do **not** make `space-service` the long-term owner of the new Personal Organizer domain.

Canonical decision reference: `docs/decisions/adr_0028_personal_organizer_backend_boundary.md`

Recommended direction:

- introduce a dedicated organizer/planner boundary from the start
- expose it to Space UI through composition/BFF/adapters
- allow temporary "Space-adjacent" delivery, but not `space-service` ownership drift

Why:

- current real `space-service` contract/schema is social-core only
- the new SSOT requires trip entities that are much richer than legacy optional organizer items
- forcing this into `space-service` will immediately fight the current architecture

#### Real entities needed in the first slice

- `Trip`
- `SavedItem` or saved-source reference abstraction
- `TripItem`
- `TripTask`
- `TripNote`
- lightweight `TripInsight` or rule-based derived trip summary

#### Entities to defer

- `TripDay`
- `TripDayAssignment`
- `Reminder` as full subsystem
- `ComparisonSet`
- `TripRoute`
- `ContextSignal` as explicit stored graph

#### Temporary simplifications that do not break canon

- rule-based `what matters now` and `next step`
- one trip dashboard layout before full plan/map split
- tasks and notes stored without full reminder engine
- no full day planner in the first slice

#### Existing structures that can be reused

- reactions bookmark list as the current saved source for `space_post`
- current `source_module` / `linked_entity_type` / `linked_entity_id` thinking from legacy organizer docs
- frontend composition/adapters already used by Space shell

#### Existing structures that should not be overloaded

- `space-service` tables
- legacy `space_organizer_item`
- reactions bookmarks as if they were full saved/trip truth

### 5.5 Integration with Space and other modules

#### Mandatory Space integrations

- dashboard organizer preview -> Organizer home
- saved posts baseline -> add-to-trip
- community/feed/post cards -> save entry remains upstream intake
- activity may later surface trip-relevant reminders, but not in first slice

#### How Organizer should consume saved objects

Short term:

- consume the current `Saved` surface as one source
- keep an adapter abstraction ready for other source modules

Canonical target model:

- `source_module`
- `source_entity_type`
- `source_entity_id`

This lets Organizer scale beyond `space_post` without rethinking the whole model later.

#### Entry points/hooks to prepare now

- `Add to trip`
- `Open Organizer`
- `Create trip from saved`
- `Move saved item into trip`

#### What can be mocked or deferred

- non-Space saved sources that do not yet have a stable saved runtime path
- complex cross-module enrichment
- reminders notifications
- map aggregation

### 5.6 AI scope

#### Realistic first-pass AI scope

- no autonomous trip planning engine
- no open-ended AI workspace as primary UX

#### First-pass rule-based/system-driven scope

- derive `what matters now` from missing required trip fields
- derive `next step` from trip status + item/task states
- derive simple "trip still empty" and "saved items available" prompts

#### AI later

- shortlist generation
- day suggestions
- readiness audit
- route conflict detection
- nearby opportunities
- explainability layer

#### What not to do in the first pass

- AI-generated full itinerary as core product
- AI-first data model
- autonomous execution or booking behavior
- conversational planning as the main entry point

### 5.7 Execution roadmap

#### Phase 0 — Audit / Framing / Architecture Alignment

Goal:

- freeze current-state truth and organizer boundary decision

Deliverables:

- this planning document
- architecture decision: dedicated organizer/planner boundary vs temporary Space-adjacent delivery
- agreed first-slice cut line

Dependencies:

- current Space audit
- legacy organizer assessment
- new SSOT accepted as canon

Exit criteria:

- no ambiguity about current Space truth
- no ambiguity that new Personal Organizer is not the legacy organizer
- first-slice scope accepted

#### Phase 1 — Organizer Skeleton Inside Space

Goal:

- add Organizer as a real first-level Space section

Deliverables:

- `Organizer` nav entry
- `/space/organizer`
- organizer home empty/loading/auth/thin states
- dashboard preview connected to Organizer route

Dependencies:

- shell/nav update
- initial organizer read contract

Exit criteria:

- Organizer exists as a truthful route
- no fake trip data is shown
- shell integration is stable and bounded

#### Phase 2 — Core Trip Model and Flows

Goal:

- introduce real trip containers and saved-to-trip movement

Deliverables:

- trip create/list/select
- trip dashboard
- add-to-trip from saved
- trip items with statuses
- tasks and notes baseline

Dependencies:

- organizer domain contract
- saved-source adapter

Exit criteria:

- user can create a trip
- user can move saved items into a trip
- user sees a real trip dashboard instead of generic organizer cards

#### Phase 3 — Planning / Execution UX

Goal:

- deepen practical trip execution without opening full planner complexity

Deliverables:

- stronger `what matters now`
- stronger `next step`
- richer tasks
- baseline day/reminder support only if phase 2 proves stable

Dependencies:

- real trip data
- enough user state to derive execution signals

Exit criteria:

- organizer is clearly useful for trip progression
- still no scope explosion into full itinerary/map/comparison suite

#### Phase 4 — AI / Advanced Logic / Expansion

Goal:

- add assistance after the trip model is stable

Deliverables:

- readiness audit
- shortlist suggestions
- day suggestions
- explainable insights

Dependencies:

- stable trip model
- usable saved/trip dataset

Exit criteria:

- AI improves trip progress without becoming the core control surface

### 5.8 Risks / ambiguity / decisions needed

#### Ambiguities still open

- exact first-slice contract namespace and adapter/BFF shape under `docs/decisions/adr_0028_personal_organizer_backend_boundary.md`
- whether first slice supports only `space_post` saved intake or also selected cross-domain saved objects
- whether `TripDay` enters the first real implementation slice or waits one phase

#### Decisions needed before implementation

- approve Organizer as first-level nav item in the actual current shell
- if nav compression is needed, decide whether `Posts` should stay primary or become temporarily secondary without changing the broader `Space > Organizer` hierarchy
- approve dedicated organizer/planner boundary instead of extending `space-service`
- approve minimal entity scope for first slice

#### Main scope explosion risks

- trying to implement full trip planning, map, reminders, comparison, AI and offline in the same pass
- turning Organizer into a catch-all for all deferred Space surfaces
- treating current reactions bookmarks as the full saved system
- treating legacy organizer docs as if they were the new domain canon

#### What must stay bounded in the first slice

- two real organizer routes max
- trip containers + saved-to-trip + task/note dashboard only
- rule-based execution signals before AI
- no map/comparison/offline/collaboration wave
- no ownership drift into `space-service`

## 6. Final Recommendation

The new Personal Organizer should be introduced inside `Space Asia` as a new first-level section within a broader dashboard-first personal/social module, but **not** as a continuation of the old organizer item model and **not** as an expansion of `space-service`.

The correct bounded path is:

1. preserve the legacy placement insight: Organizer belongs inside Space
2. preserve the saved-as-source principle
3. replace the legacy execution-item core with a real trip-first Organizer domain
4. introduce a minimal organizer/planner boundary and integrate it into the existing Space shell
5. ship a narrow first slice around `Trip + Saved-to-Trip + Organizer Dashboard + Tasks + Notes`

That gives a practical evolutionary path in which `Space Asia` stays the wider dashboard-first personal/social hub, while `Personal Organizer` becomes a trip-first section inside it without carrying forward the wrong conceptual center from the legacy organizer contour.
