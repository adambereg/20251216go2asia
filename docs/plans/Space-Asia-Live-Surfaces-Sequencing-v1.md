Space Asia Live Surfaces Sequencing v1

Project: Go2Asia
Module: Space Asia
Document role: Sequencing plan for gradual live activation of Space Asia user-facing surfaces
Status: Draft v1
Scope: Defines the order in which Space Asia surfaces should become honestly live, based on current SSOT, runtime maturity, seed readiness, and architectural constraints

1. Purpose

This document defines the live-surfaces sequencing for Space Asia.

Its purpose is to answer:

which Space Asia surfaces should become live first;
which surfaces are already partially live;
which surfaces should remain deferred;
how to avoid fake completeness;
how to align frontend rollout with current runtime truth and current seed readiness;
how to keep Space rollout bounded and architecture-safe.

This document exists because:

Space-Asia-Full-Seed-Content-Pack-v1.md defines the content reality;
Space-Asia-Seed-Execution-Plan-v1.md defines how seed content becomes runtime reality;
but neither of those defines which user-facing Space surfaces should be activated first.

This document provides that sequencing layer.

2. Core Principle

Space Asia must not be rolled out as a visually rich but runtime-thin shell.

Every live surface must satisfy one rule:

A surface becomes live only when its underlying data path is sufficiently real, bounded, and honest.

Short formula:

No fake richness. No broad shell-first illusion. No surface before runtime truth.

This is especially important for Space because:

the module is broad;
the UI can easily suggest more functionality than runtime actually supports;
the ecosystem around it is multi-service and unevenly mature.
3. What Counts as a “Live Surface”

A live surface is a Space Asia user-facing route or panel that:

reads real runtime-backed data;
does not depend mainly on mock data;
reflects actual current behavior honestly;
has bounded and understandable empty/loading/error states;
does not pretend adjacent deferred capabilities already exist.

A surface is not considered fully live if it is:

mostly placeholder content;
built on dead mock structures;
visually complete but logically disconnected;
overly dependent on unresolved backend boundary questions.
4. Sequencing Philosophy

The sequencing for Space Asia must follow four principles.

4.1 Social truth before broad dashboard richness

The social core must become visibly real before advanced surrounding surfaces pretend to be meaningful.

4.2 Public-first before edge-case complexity

Public, readable, safe surfaces should be activated before:

private/invite-only complexity,
advanced moderation,
deep operational overlays.
4.3 Runtime-confirmed before UX expansion

If a surface depends on unresolved feed, reactions, membership, or adjacent runtime debt, it should not be activated just because the UI exists.

4.4 Group context must emerge gradually

Groups are first-class social containers, but that does not mean the whole group product should be turned on at once.

5. Input Artifacts

This sequencing plan assumes the existence of the following artifacts.

Product / canon
docs/architecture/space/Space-Asia-Thematic-Groups-Canon-v1.md
Space SSOT
docs/architecture/space/space_domain_model_v_1.md
docs/architecture/space/space_backend_architecture_v_1.md
docs/architecture/space/space_service_production_architecture_v_1.md
docs/architecture/space/space_openapi_outline_v_1.md
docs/architecture/space/space_dependency_map_v_1.md
Content / seed
content/space/Space-Asia-Full-Seed-Content-Pack-v1.md
docs/plans/Space-Asia-Seed-Execution-Plan-v1.md
Runtime / phase context
docs/plans/go2asia_status_anchor_v1.md
docs/plans/go2asia_execution_master_plan_v1.md
relevant space_phase1_* notes
current space-service and api-gateway code reality
6. Current Surface Classification

The current Space Asia landscape should be read as a mix of:

partially live social surfaces;
runtime-backed but still narrow surfaces;
placeholder surfaces;
deferred surfaces.

For sequencing purposes, each surface should be assigned one of four states:

A. Live enough

Can already serve as a foundation for further bounded rollout.

B. Live but narrow

Real enough to build upon, but not yet broad or feature-rich.

C. Placeholder / shell

Exists in UI or docs, but not yet honest as a live surface.

D. Deferred

Should remain intentionally out of active rollout for now.

7. Surface Inventory

The following Space Asia surfaces matter for sequencing.

Social core surfaces
/space
home feed
profile feed
group feed
post identity / card rendering
group context in feed
Community surfaces
/space/community
group identity surface
group membership surface
group list/discovery surface
Personal coordination surfaces
saved
organizer
dashboard summary widgets
ecosystem signals
growth/progress surfaces
Activity surfaces
activity feed / notifications-like social mirror
Author surfaces
my posts
public profile
curator / PRO presence inside Space
Deferred adjacent surfaces
private group UX
invite-only group UX
full moderation UI
deep PRO admin overlays inside Space
assistant-heavy automation surfaces
8. Recommended Live Surface Order

The recommended rollout order is:

Phase 1 — Core social visibility
/space root as honest social entry point
home feed runtime-backed baseline
post cards with real social metadata
visible group signals inside existing runtime feed
Phase 2 — Public group context
public group identity surface
public group feed surface
public group membership actions (read/join/leave where appropriate)
Phase 3 — Personal social surfaces
public user profile surface
my posts / authored content surface
activity surface
Phase 4 — Practical personal coordination
saved surface
organizer preview or organizer baseline
ecosystem summary widgets
Phase 5 — Community expansion
group discovery/list surface
richer community root
more nuanced group filtering and routing
Phase 6 — Later complexity
private/invite-only group UX
advanced reactions visibility
deeper organizer/assistant surfaces
operational-adjacent integrations only where explicitly safe
9. Phase 1 — Core Social Visibility
Goal

Make Space visibly real as a social module before trying to make it broad.

Surfaces
/space
runtime-backed home feed
post rendering with honest metadata
basic group signal presence in feed
Why this comes first

Because this is where the current runtime is strongest:

home feed already exists in some live form;
publication core is already real;
this surface can be made more honest without broad expansion.
Included
real feed items
repost signals
group-origin signal on posts where available
no heavy discovery, no full group module
Excluded
full community tab activation
full groups module
complete reactions UX
organizer and dashboard richness
Done criteria
/space is clearly a real social surface
posts no longer feel detached from group context where group data exists
no hidden dependency on mock-only group UI
10. Phase 2 — Public Group Context
Goal

Bring groups into live product reality as public social containers, not just hints inside feed.

Surfaces
public group identity surface
public group feed surface
public membership baseline
read + join/leave for public groups where contract supports it
Why this is second

Because:

group runtime already exists;
groups are canonical first-class social containers;
but current group UI is not yet honestly live enough to go first.
Included
group title/description/owner/moderator/member count where available
group feed read
public join/leave baseline
public group social context
Excluded
group discovery/search
invite-only/private complexity
broad group management UI
PRO operational overlays
Done criteria
a public group can be opened as a real entity
it clearly reads as a community container, not just as a filtered feed
public membership behavior is understandable
group feed is visibly group-scoped
11. Phase 3 — Personal Social Surfaces
Goal

Make Space feel like a user’s social presence, not just a public stream.

Surfaces
public profile
authored posts / my posts
profile feed
lightweight visible identity surfaces
Why this is third

Because once social publishing and group context are live, users need a coherent personal social identity.

Included
profile projection rendering
authored content
visibility of role label / city / bio where appropriate
Excluded
deep profile editing workflows
full follower graph UX
heavy reputation analytics
Done criteria
a user in Space has visible identity
authored content can be explored in a bounded way
PRO still reads as normal user inside Space, not as Console entity
12. Phase 4 — Activity Surface
Goal

Make Space feel socially responsive.

Surfaces
activity feed
social response mirror
lightweight “what happened around me” surface
Why this is fourth

Because activity becomes meaningful only after:

users,
posts,
groups,
and some social interactions exist.
Included
like/repost/question/bookmark-derived activity where available
group-related activity signals
bounded, honest activity rendering
Excluded
complete notification preferences
real-time systems
chat-like behavior
Done criteria
user can see at least a minimal social response layer
activity does not feel like a dead placeholder
13. Phase 5 — Saved Surface
Goal

Show that Space is not only social, but also practical.

Surfaces
saved content surface
saved posts / places / events / listings / partners / quests
Why after social core

Because saved becomes useful when social circulation is already meaningful.

Included
saved item cards
linked object context
practical revisit behavior
Excluded
heavy trip-building logic
broad planner behavior
assistant automations
Done criteria
saved surface reflects actual user selection patterns
it feels like a practical layer, not only decorative UI
14. Phase 6 — Organizer Baseline
Goal

Introduce the personal coordination layer carefully.

Surfaces
organizer preview
limited organizer baseline
maybe dashboard fragment before full organizer route
Why not earlier

Because organizer without seeded social and practical context becomes artificial.

Included
a few meaningful reminder/follow-up/growth/saved-action items
lightweight task rendering
links to ecosystem-related context
Excluded
full productivity suite behavior
assistant-driven execution
full planner-service assumptions
broad automation workflows
Done criteria
organizer reads as ecosystem coordination, not abstract todo app
user actions inside Space feel connected to the rest of Go2Asia
15. Phase 7 — Ecosystem Signals
Goal

Make Space feel like the human-facing center of the ecosystem.

Surfaces
dashboard summary snippets
progress signals
quest summary
voucher / referral / balance summary
PRO summary blocks where appropriate
Why later

Because these widgets are meaningful only after social and coordination context exists.

Included
lightweight summary cards only
links outward to owning domains
Excluded
ownership transfer into Space
full transactional detail
console-like operational data
Done criteria
dashboard hints feel connected and truthful
Space remains aggregation surface, not source of truth
16. Phase 8 — Community Root Expansion
Goal

Turn /space/community from placeholder into meaningful community entry.

Surfaces
community root
public group list
selected recommended groups
maybe active groups / featured groups
Why not first

Because community discovery without real groups and real group surfaces becomes fake.

Included
public groups only
real group identity and routing
selected recommendation logic if available
Excluded
advanced sorting/ranking
invite-only/private flows
full growth/search engine
Done criteria
/space/community is no longer static placeholder
it helps user discover real communities
17. Phase 9 — Deferred Complexity

The following surfaces should remain intentionally later:

private groups UX
invite-only flows
advanced membership edge cases
full moderation suite
deep reactions-rich rendering
assistant execution surfaces
operational overlays that risk drifting into PRO Console
taxonomy-coded group type UI if not yet runtime-justified

These should not be dragged into earlier phases.

18. Surface-by-Surface Sequencing Table
Surface	Recommended phase	Readiness type	Why
/space root	1	Live but narrow	Best current entry point
Home feed	1	Live enough	Existing runtime social backbone
Group signal in feed	1	Ready after seed	Low-risk realism improvement
Public group identity page	2	Backend ready, UI not yet	Natural next group surface
Public group feed	2	Runtime exists	Must stay separate from broad feed redesign
Public join/leave	2	Runtime exists	Good bounded public behavior
Public profile	3	Depends on profile projections	Strong identity surface
My posts	3	Depends on seeded authored posts	Personal social continuity
Activity	4	Depends on seeded interactions	Social response layer
Saved	5	Depends on saved seed	Practical value layer
Organizer	6	Depends on organizer seed/runtime choice	Coordination layer
Ecosystem summary widgets	7	Depends on reference signals	Aggregation, not ownership
Community root	8	Needs real public groups first	Discovery should follow substance
Private/invite-only groups	9	Deferred	Not public-first safe slice
19. Readiness Gates Per Phase
Gate to open Phase 1
real seeded posts exist
real seeded users/profile projections exist
home feed is non-empty
Gate to open Phase 2
public groups exist
memberships exist
public group runtime path is hardened
group feed returns meaningful data
Gate to open Phase 3
profile projections are stable
authored posts exist per visible user
Gate to open Phase 4
at least minimal reaction/activity data exists
Gate to open Phase 5
saved data exists and linked objects are meaningful
Gate to open Phase 6
organizer seed exists and ownership/runtime choice is bounded enough
Gate to open Phase 7
ecosystem signals can be shown without fake source-of-truth confusion
Gate to open Phase 8
groups are no longer only backend/runtime objects but visible social surfaces
20. Surface Activation Rules

Whenever a surface is considered for activation, apply this checklist:

Activation checklist
Does it read real runtime data?
Does it avoid major unresolved boundary debt?
Does it have meaningful seed content?
Can it render honest empty/error/loading states?
Does it avoid suggesting broader capability than actually exists?
Does it stay within current SSOT and bounded phase logic?

If the answer is “no” to any of these, the surface should not yet be promoted to live.

21. Recommended Immediate Practical Sequencing

Given current Space state, the safest immediate order is:

strengthen current /space social realism
surface group-origin signals in the live feed
open public group identity + public group feed
only then expand to public profile / my posts
then activity
then saved
then organizer preview
then community root expansion

This avoids opening broad group UX before group runtime and group identity are visible enough.

22. What This Document Does Not Decide

This document does not decide:

schema design changes
group_type introduction
feed-service vs space-service final resolution
private→group storage tactic
full organizer ownership
full reactions-service rollout
exact assistant orchestration model
PRO Console roadmap

It defines surface sequencing only.

23. Completion Checklist
live_surfaces_sequencing_checklist:
  phase_1_core_social_visibility_ready: false
  phase_2_public_group_context_ready: false
  phase_3_personal_social_surfaces_ready: false
  phase_4_activity_ready: false
  phase_5_saved_ready: false
  phase_6_organizer_ready: false
  phase_7_ecosystem_signals_ready: false
  phase_8_community_root_ready: false
  phase_9_deferred_complexity_still_deferred: true
24. Final Summary

Space Asia should not go live as one giant module.

It should become live in honest layers:

social core first
public group context second
personal identity third
activity and practical coordination after that

Short formula:

feed → group context → profile → activity → saved → organizer → ecosystem signals → community expansion

25. Recommended Repository Placement

Recommended path:

docs/plans/Space-Asia-Live-Surfaces-Sequencing-v1.md

Alternative:

docs/architecture/space/Space-Asia-Live-Surfaces-Sequencing-v1.md

If you want this document to behave more as rollout governance than architecture canon, docs/plans/ is preferable.