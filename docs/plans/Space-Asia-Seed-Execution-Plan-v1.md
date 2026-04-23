# Space Asia Seed Execution Plan v1

**Project:** Go2Asia
**Module:** Space Asia
**Document role:** Execution plan for turning Space seed content into usable runtime data and development-ready surfaces
**Status:** Draft v1
**Scope:** Sequenced materialization of Space seed content into runtime-ready layers, without broad rollout drift

---

## 1. Purpose

This document defines how the Space seed content should be executed into usable runtime reality.

It exists because `Space-Asia-Full-Seed-Content-Pack-v1.md` is a **content source**, not an execution plan.

This plan answers:

* what must be materialized first;
* what may remain reference-only initially;
* what should be seeded directly into runtime-facing storage;
* what should be deferred;
* what order should be followed to avoid chaos;
* how to keep Space aligned with current SSOT and bounded rollout discipline.

This document is intended to guide:

* Cursor implementation sequencing;
* seed/import scripts;
* runtime preparation;
* frontend live-adoption readiness;
* cross-module social realism without fake completeness.

---

## 2. Core Principle

Space seed execution must follow this rule:

> **First materialize the minimum social truth that other surfaces depend on.**
> **Only then materialize richer interaction, activity, and coordination layers.**

Short formula:

> **profiles → groups → memberships → posts/reposts → reactions/activity → saved/organizer → optional enrichments**

This keeps Space from becoming a mock-heavy shell and avoids trying to seed advanced surfaces before basic social identity exists.

---

## 3. Execution Philosophy

This execution plan is designed around five constraints:

1. **Space is broader than space-service**
   Not all UI-visible data belongs inside `space-service`.

2. **Space service boundary must stay clean**
   Reactions, Connect, AI, and external domains must not be silently absorbed into Space runtime.

3. **Not every seed item must be materialized on day one**
   Some data may stay as reference content until the corresponding runtime contour is ready.

4. **Frontend should not wait for total completeness**
   The plan should create enough real data for honest live-adoption slices without requiring every future domain to be fully live.

5. **Cross-module references must remain references**
   Repost targets from Atlas, Pulse, Blog, Quest, RF, and Rielt should stay external-domain references.

---

## 4. Input Artifacts

This execution plan assumes the existence of the following input artifacts:

### Required

* `content/space/Space-Asia-Full-Seed-Content-Pack-v1.md`

### Supporting SSOT

* `docs/architecture/space/Space-Asia-Thematic-Groups-Canon-v1.md`
* `docs/architecture/space/space_domain_model_v_1.md`
* `docs/architecture/space/space_backend_architecture_v_1.md`
* `docs/architecture/space/space_service_production_architecture_v_1.md`
* `docs/architecture/space/space_openapi_outline_v_1.md`
* `docs/architecture/space/space_dependency_map_v_1.md`

### Runtime / contract references

* `docs/openapi/space.yaml`
* current `space-service` implementation
* current gateway routing for `/v1/space/*`

---

## 5. Seed Execution Layers

The seed plan is divided into execution layers.

### Layer A — Identity-adjacent social rendering layer

Materialize first:

* users used by Space
* social profile projections

### Layer B — Community container layer

Materialize next:

* groups
* memberships

### Layer C — Social publication layer

Materialize next:

* posts
* reposts
* media references
* group posts

### Layer D — Social interaction and visibility layer

Materialize next:

* reactions
* activity items
* feed examples / projections if needed

### Layer E — Personal coordination layer

Materialize next:

* saved items
* organizer items
* ecosystem summary signals

### Layer F — Optional realism enrichments

Materialize later:

* moderation cases
* assistant-layer context
* advanced private/invite-only cases
* denser scenario richness

---

## 6. Materialization Categories

Each seed item must be assigned to one of three categories.

### 6.1 Runtime materialized now

These should become real runtime data in the current phase.

### 6.2 Reference-only for now

These remain content/source artifacts until the runtime contour is ready.

### 6.3 Deferred

These are intentionally postponed and must not be materialized in the current execution cycle.

---

## 7. Phase 1 — Social Identity Baseline

### Goal

Create a believable Space-facing social identity layer so that later posts, groups, and feeds render honestly.

### Runtime materialize now

* users already existing in auth/user layer
* `space_profile_projection` records for seed users

### Input sections from content pack

* `users`
* `profile_projections`

### Expected runtime outputs

* social display name for each seed user
* role label for each visible user
* city/country for rendering
* stable social profile projection rows

### Why this phase comes first

Without profile projections:

* posts degrade into anonymous technical rows;
* groups feel empty;
* activity and feed rendering look broken or fake.

### Done criteria

* all selected seed users have usable Space-facing profile projections
* profiles can be rendered without fallback-to-user-id ugliness

---

## 8. Phase 2 — Group Container Baseline

### Goal

Create real group containers and memberships before seeding posts into them.

### Runtime materialize now

* `space_group`
* `space_group_member`

### Input sections from content pack

* `groups`
* `group_membership_matrix`
* `group_character_notes` as optional reference metadata

### Public-first rule

This phase should prioritize:

* public groups
* active memberships

### Keep out for now

* private/invite-only hardening beyond minimal representation
* complex membership edge cases
* discovery/ranking/search logic

### Expected runtime outputs

* real public groups exist in Space runtime
* owners and moderators are assigned
* members are attached to correct groups
* group identities can be fetched by runtime APIs

### Done criteria

* `GET /v1/space/groups/{id}` is meaningful for seeded groups
* memberships exist for group-dependent reads and later group posts

---

## 9. Phase 3 — Publication Baseline

### Goal

Create actual social publication inside and outside groups.

### Runtime materialize now

* `space_post`
* repost posts
* group posts
* optional media relations if media refs are available

### Input sections from content pack

* `posts`
* `group_posts`
* `non_public_posts`
* `private_to_group_sharing_cases` as reference
* `media_registry`
* `repost_targets`

### Rules

* keep canonical post types only:

  * `post`
  * `repost`
  * `system`
* use `visibility = group` for in-group publications
* keep repost target references external

### Keep out for now

* private→group storage tactic hardening
* rich edit/delete workflows
* advanced moderation flows

### Expected runtime outputs

* public posts exist
* group posts exist
* reposts exist
* feed-relevant data becomes non-empty

### Done criteria

* `GET /v1/space/feed/home` returns believable items
* `GET /v1/space/feed/group/{groupId}` returns real group posts
* group context is visible in publication data where applicable

---

## 10. Phase 4 — Reactions and Activity Baseline

### Goal

Turn publication into social response.

### Runtime materialize now if service contour is available

* basic reactions relevant to current live surfaces
* activity items or their source events, depending on runtime architecture

### Input sections from content pack

* `reactions`
* `threads`
* `activity_items`
* `feed_examples` as validation reference, not necessarily direct runtime input

### Important boundary rule

If `reactions-service` is not yet ready for full ingestion, do not fake full runtime completeness inside Space.

Allowed approaches:

* materialize only currently supported reactions
* keep richer reaction types as reference content
* generate activity examples from available signals only

### Keep out for now if not ready

* complete no-chat communication graph
* full thread workflow hardening
* complete notification linkage

### Expected runtime outputs

* visible social response around posts or reposts
* activity screen or activity-like data can render meaningfully
* users are no longer posting into a silent void

### Done criteria

* at least minimal social response is visible on seeded content
* activity examples are no longer purely theoretical

---

## 11. Phase 5 — Saved and Organizer Baseline

### Goal

Make Space visibly more than a feed.

### Runtime materialize now if adjacent contour is ready

* saved items
* organizer items

### Input sections from content pack

* `saved_items`
* `organizer_items`

### Boundary caution

If organizer is not yet runtime-owned near Space:

* keep organizer content reference-only for UI planning
* do not force incorrect ownership into `space-service`

### Expected outputs

* user has practical planning layer, not only social layer
* seeded users can have next actions, follow-ups, and saved context

### Done criteria

* at least one meaningful saved scenario is renderable
* at least one meaningful organizer scenario is renderable or reference-ready

---

## 12. Phase 6 — Ecosystem Signal Baseline

### Goal

Seed the short summary widgets and cross-module human-facing context around Space.

### Runtime materialize now only if the source surfaces already exist

* lightweight summary signals only

### Input sections from content pack

* `ecosystem_signals`
* `pro_space_layer`

### Keep out for now

* real balance logic
* real NFT logic
* real referral computation
* real voucher engine
* real quest ownership logic

### Principle

Space should show **human-facing summaries**, not steal source-of-truth responsibility.

### Done criteria

* dashboard-like surfaces can show believable ecosystem snippets
* PRO identities inside Space feel richer and more grounded

---

## 13. Phase 7 — Scenario Validation Layer

### Goal

Validate that the seeded data creates believable product behavior.

### Input sections from content pack

* `scenarios`

### What to do

Use scenario pack for:

* QA walkthroughs
* UI/UX checks
* runtime smoke validation
* future demo realism
* Cursor orientation when implementing next live surfaces

### Done criteria

* each major scenario has enough data to be manually or programmatically verified
* no major product surface remains abstract-only

---

## 14. Recommended Execution Order

### Recommended order

1. **Profile projections**
2. **Public groups**
3. **Public memberships**
4. **Posts and reposts**
5. **Group posts**
6. **Basic reactions / activity**
7. **Saved items**
8. **Organizer items**
9. **Ecosystem summary signals**
10. **Optional enrichments**

### Hard rule

Do **not** start from reactions, activity, or organizer while users/groups/posts are still empty.

---

## 15. Public-First Seeding Strategy

For current practical development, use this rule:

### Materialize first

* public users
* public groups
* active memberships
* public posts
* group posts
* public reposts
* public group feeds

### Defer initially

* private groups
* invite-only flows
* blocked membership cases
* private→group storage mechanics
* advanced moderator flows
* full thread complexity

This lets Cursor build visible and honest live surfaces without premature complexity.

---

## 16. Cross-Module Reference Strategy

Space content depends heavily on external objects.

### Recommended rule

Cross-module repost targets should initially be treated as:

* referenceable by stable hint / slug / external id
* not copied into Space-owned truth

### Needed external categories

* places
* events
* blog posts
* quests
* partners
* listings

### If real canonical IDs exist

Prefer using them.

### If real canonical IDs do not yet exist

Use stable `target_hint` placeholders until the reference pack is hardened.

---

## 17. Seed Execution Modes

There are three valid seed execution modes.

### Mode A — Direct DB seed

Useful for:

* profile projections
* groups
* memberships
* posts
* group posts

### Mode B — API-driven seed

Useful for:

* runtime-faithful create flows
* group creation
* posting
* join/leave
* reactions if route behavior matters

### Mode C — Reference-only seed

Useful for:

* organizer items not yet runtime-owned
* ecosystem signals
* assistant context
* unresolved cross-module edges

### Recommended mixed strategy

* DB seed for core stable entities
* API seed for behavior-sensitive flows
* reference-only for unresolved adjacent contours

---

## 18. Suggested Ownership by Seed Layer

### Space-owned runtime seed

* profile projections
* groups
* memberships
* posts
* group posts
* media relations if already supported

### Reactions-owned seed

* likes
* bookmarks
* ratings
* short reviews
* questions
* thread replies

### Space-adjacent or reference-only seed

* organizer
* saved
* ecosystem signals
* assistant suggestions
* moderation examples

---

## 19. Execution Output Artifacts

This plan expects eventual creation of some or all of the following:

* seed source file:

  * `content/space/Space-Asia-Full-Seed-Content-Pack-v1.md`
* optional transformed seed file(s):

  * `content/space/generated/*.json`
* optional import/seed scripts:

  * `scripts/space_seed_profiles_*`
  * `scripts/space_seed_groups_*`
  * `scripts/space_seed_posts_*`
* optional seed runbook:

  * `docs/runbooks/space_seed_runbook_v1.md`

---

## 20. Quality Gates Before Frontend Live-Adoption

Before opening serious frontend live-adoption for any Space surface, the following should be true.

### Required

* seeded profile projections exist
* seeded public groups exist
* seeded memberships exist
* seeded posts and group posts exist
* at least some repost targets are resolvable
* seeded content produces non-empty home/group surfaces

### Strongly recommended

* at least minimal activity exists
* at least minimal saved/organizer examples exist
* at least one PRO-led social context exists
* at least one newcomer scenario exists

---

## 21. What Must Not Happen

### Do not:

* seed everything into `space-service` just because it appears in Space UI
* force organizer ownership into Space if runtime contour is not ready
* treat cross-module repost targets as copied Space truth
* build private/invite-only complexity before public baseline is stable
* let seed execution reopen feed architecture debates
* confuse content completeness with runtime readiness

---

## 22. Suggested Immediate Practical Scope

For the **next practical content execution cycle**, the safest bounded scope is:

### Materialize now

* profile projections
* public groups
* active memberships
* public posts
* group posts
* public reposts
* selected repost targets
* minimal activity examples

### Keep reference-only for now

* private posts
* private→group cases
* organizer items
* ecosystem signals
* assistant context
* moderation cases

This gives Cursor a strong live social baseline without forcing all of Space at once.

---

## 23. Recommended Sequencing for Cursor

When Cursor is asked to use this plan, the recommended order of work is:

1. ingest and normalize content pack
2. materialize Space-facing profile projections
3. materialize public groups
4. materialize memberships
5. materialize posts/reposts/group posts
6. validate group feed and home feed non-empty behavior
7. optionally materialize basic reactions/activity
8. only then open narrow frontend live-adoption slices

---

## 24. Completion Checklist

```yaml id="816jtv"
seed_execution_checklist:
  content_pack_reviewed: false
  profile_projections_materialized: false
  public_groups_materialized: false
  active_memberships_materialized: false
  posts_materialized: false
  reposts_materialized: false
  group_posts_materialized: false
  repost_targets_resolved_or_stubbed: false
  home_feed_non_empty: false
  group_feed_non_empty: false
  basic_activity_available: false
  saved_reference_layer_prepared: false
  organizer_reference_layer_prepared: false
  ecosystem_signals_reference_layer_prepared: false
  scenario_validation_ready: false
```

---

## 25. Final Summary

`Space-Asia-Full-Seed-Content-Pack-v1.md` gives Space rich content.

This document explains how to **turn that content into usable runtime reality**.

Short formula:

> **Seed content is the source.**
> **Seed execution turns it into runtime truth in bounded layers.**

And even shorter:

> **profiles → groups → memberships → posts → reactions/activity → coordination**

---

## 26. Recommended Repository Placement

```text
docs/plans/Space-Asia-Seed-Execution-Plan-v1.md
```

Alternative:

```text
docs/architecture/space/Space-Asia-Seed-Execution-Plan-v1.md
```

If you want this treated more as execution governance than architecture canon, `docs/plans/` is preferable.
