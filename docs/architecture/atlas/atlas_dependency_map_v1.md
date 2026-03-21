# Atlas Service — Dependency Map v1

**Project:** Go2Asia  
**Domain:** Atlas / Atlas Asia  
**Document role:** SSOT dependency map for `atlas-service`  
**Status:** Draft v1  
**Purpose:** Define upstream dependencies, downstream consumers, ownership boundaries, read/write contracts, and forbidden dependency patterns for `atlas-service`.

---

## 1. Purpose

This document defines the dependency map around `atlas-service`.

Its goal is to make the following unambiguous:

- what `atlas-service` depends on;
- what depends on `atlas-service`;
- which dependencies are read-only;
- which dependencies are write-forbidden;
- where Atlas is authoritative;
- where Atlas is only a consumer of support inputs;
- where ownership transfer is forbidden.

This document is not a deployment diagram.  
It is a domain-boundary and service-dependency document.

---

## 2. Role of Atlas in the Ecosystem

`atlas-service` is the canonical geo/place truth domain of Go2Asia.

It sits unusually high in the ecosystem dependency graph because many other domains depend on Atlas references.

Atlas is therefore:

- an upstream reference domain for multiple services;
- a foundational identity layer for location-aware features;
- a producer of geo/place projections and validation surfaces;
- not a workflow owner for business, event, quest, listing, or social truth.

This makes Atlas dependency discipline critical.

---

## 3. Dependency Categories

For Atlas, dependencies should be classified into five categories:

1. **Authoritative upstream dependency**  
   Another service/domain owns truth that Atlas must reference but not mutate.

2. **Operational upstream dependency**  
   Another service provides supporting runtime input required for Atlas operations.

3. **Downstream consumer**  
   Another service consumes Atlas projections, events, or API responses.

4. **Peer bounded context**  
   Another service is domain-adjacent, but neither side owns the other’s truth.

5. **Forbidden dependency**  
   A dependency pattern that would blur ownership or create illegal coupling.

---

## 4. Atlas Dependency Summary

### Authoritative upstream
- Auth / User identity
- Media storage/runtime only for binary/media existence if externalized

### Operational upstream
- infrastructure / eventing / messaging layer
- optional localization/translation infrastructure if separated later

### Downstream consumers
- RF
- Pulse
- Quest
- Rielt
- Guru
- Space
- public frontend surfaces
- editorial/admin tooling
- search / analytics / indexing pipelines

### Peer bounded contexts
- RF
- Pulse
- Quest
- Rielt
- Space
- Guru
- Media service if semantically separate

### Forbidden ownership merges
- Atlas → RF branch/business writes
- Atlas → Pulse event writes
- Atlas → Quest progression writes
- Atlas → Rielt listing writes
- Atlas → Space social writes
- Atlas → Points ledger writes
- downstream services creating alternative canonical place truth

---

## 5. Core Dependency Graph (Compact)

Recommended conceptual graph:

- Auth/User → Atlas
- Media runtime ↔ Atlas (support-only boundary)
- Atlas → RF
- Atlas → Pulse
- Atlas → Quest
- Atlas → Rielt
- Atlas → Guru
- Atlas → Space
- Atlas → public/editorial frontends
- Atlas → search/indexing/analytics consumers

Key principle:

- Atlas consumes very little authoritative upstream truth;
- Atlas produces canonical geo/place truth for many downstream consumers;
- neighboring services may reference Atlas, but may not replace or mutate Atlas truth.

---

## 6. Upstream Dependencies

## 6.1 Auth / User Identity

### Dependency type
Authoritative upstream dependency

### Why Atlas depends on it
Atlas needs identity principals for:
- editors;
- moderators;
- admins;
- reviewer attribution in moderation cases;
- audit trails for create/update/publish/reject actions.

### Atlas reads from Auth/User
- authenticated actor ID
- actor role claims
- account validity
- possibly display hints if needed for moderation UI

### Atlas must not own
- user account truth
- password/session/OAuth lifecycle
- canonical identity lifecycle

### Allowed dependency direction
Auth/User → Atlas

### Forbidden pattern
Atlas must not create its own shadow user system as identity source of truth.

---

## 6.2 Media Storage / Media Runtime

### Dependency type
Operational upstream or peer support dependency

### Why Atlas depends on it
If media binaries are stored outside Atlas, Atlas may need support from media infrastructure for:
- media existence validation;
- asset metadata retrieval;
- signed/public URL generation;
- ingestion pipeline confirmation.

### Atlas owns
- semantic linkage of media to geo/place/content objects

### Atlas does not own
- binary storage truth
- transformation pipeline truth
- upload runtime truth

### Allowed dependency direction
Media runtime ↔ Atlas with clear semantic split

### Forbidden pattern
Atlas should not become raw binary media storage owner if the platform already has a dedicated media domain.

---

## 6.3 Localization / Translation Infrastructure (if externalized)

### Dependency type
Operational upstream dependency

### Why Atlas may depend on it
Atlas guide content may later use external translation/localization support.

### Allowed usage
- translation suggestions
- locale rendering support
- content localization workflow support

### Forbidden pattern
Atlas should not lose ownership of canonical guide content versions just because translation tooling exists.

---

## 6.4 Infrastructure / Messaging Layer

### Dependency type
Operational upstream dependency

### Why Atlas depends on it
Atlas may rely on platform infrastructure for:
- event emission
- outbox delivery
- read-model rebuild jobs
- notifications to editorial tools
- analytics/indexing fanout

This is infrastructure dependency, not business-domain dependency.

---

## 7. Downstream Consumers

## 7.1 RF

### Dependency type
Downstream consumer / peer bounded context

### Relationship summary
RF depends strongly on Atlas for canonical geography and place identity.

### RF reads from Atlas
- country IDs
- city IDs
- district IDs
- place IDs
- host/container place IDs
- breadcrumb/path context if needed
- reference validation results

### Atlas does not read RF for geo truth
Atlas may know nothing about RF branch/business state in its core write model.

### Allowed integration
RF stores Atlas references such as:
- `countryId`
- `cityId`
- `districtId`
- `atlasPlaceId`
- `hostAtlasPlaceId`

### Forbidden pattern
RF must not create or own an alternative place identity system.

### Dependency direction
Atlas → RF as geo/place truth provider

---

## 7.2 Pulse

### Dependency type
Downstream consumer / peer bounded context

### Relationship summary
Pulse depends on Atlas for venue/place truth.

### Pulse reads from Atlas
- place identity
- city/district/country references
- breadcrumb/location structure
- host/container place semantics where needed

### Atlas may read from Pulse
Usually none in core write paths.

### Forbidden pattern
Pulse must not become owner of canonical venue/place identity.

### Dependency direction
Atlas → Pulse as place/geo truth provider

---

## 7.3 Quest

### Dependency type
Downstream consumer / peer bounded context

### Relationship summary
Quest may use Atlas places as route stops, targets, or visit anchors.

### Quest reads from Atlas
- place IDs and slugs
- city/district anchors
- place hierarchy
- breadcrumb paths
- host/container semantics

### Atlas may read from Quest
Usually none in core write paths.

### Forbidden pattern
Quest must not create parallel place truth or feed place identity back as authoritative state into Atlas.

### Dependency direction
Atlas → Quest as location reference provider

---

## 7.4 Rielt

### Dependency type
Downstream consumer / peer bounded context

### Relationship summary
Rielt depends on Atlas for canonical location truth of listings, projects, districts, and complexes.

### Rielt reads from Atlas
- country/city/district IDs
- project/complex place identities where modeled as places
- breadcrumb/location projections
- district and neighborhood truth

### Atlas may read from Rielt
Usually none in core write paths.

### Forbidden pattern
Rielt must not become a parallel geo/place service.

### Dependency direction
Atlas → Rielt as geo truth provider

---

## 7.5 Guru

### Dependency type
Strong downstream consumer

### Relationship summary
Guru is one of the clearest Atlas consumers because it composes nearby/contextual place-facing experiences.

### Guru reads from Atlas
- place cards
- city cards
- district cards
- breadcrumbs
- place containment semantics
- public guide summaries

### Atlas reads from Guru
Usually none.

### Forbidden pattern
Guru must not become the canonical place source or invent ranking-derived fake place truth.

### Dependency direction
Atlas → Guru

---

## 7.6 Space

### Dependency type
Peer bounded context with Atlas as location reference provider

### Relationship summary
Space may attach social content to geographic or place context, but does not own those geo/place entities.

### Space reads from Atlas
- city/place identity
- breadcrumbs and human-readable geo context
- canonical slugs/IDs for attaching posts or views

### Atlas reads from Space
None for core write model.

### Forbidden pattern
Space must not become source of truth for cities, districts, or places.

### Dependency direction
Atlas → Space for geo context

---

## 7.7 Public Frontend Surfaces

### Dependency type
Downstream consumer

These may consume:
- public country/city/district/place reads
- public guide reads
- breadcrumbs
- child-place lists

They must not:
- write Atlas tables directly;
- invent client-owned canonical geo truth.

---

## 7.8 Editorial / Admin Tooling

### Dependency type
Downstream consumer

These consume:
- draft geo/place entities
- guide content drafts
- moderation queues
- publication actions

All writes must go through Atlas APIs and Atlas policy checks.

---

## 7.9 Search / Analytics / Indexing Pipelines

### Dependency type
Downstream consumer

These may consume Atlas events or projections for:
- search indexing
- analytics aggregation
- geo-aware feature support
- read acceleration
- SEO-related projections

They must not write Atlas truth directly.

---

## 8. Peer Bounded Context Dependencies

## 8.1 Atlas ↔ RF

### Dependency type
Peer bounded context with strong Atlas-upstream skew

### Relationship summary
Atlas owns geo/place truth.  
RF owns partner/business presence, branches, offers, vouchers, and PRO links.

### Atlas may provide to RF
- country/city/district/place projections
- geo reference validation
- host/container place semantics
- breadcrumbs if needed for display

### RF may provide to Atlas
Usually nothing required in Atlas write paths.

### Write ownership rule
- Atlas writes Atlas entities only
- RF writes RF entities only

### Forbidden patterns
- Atlas owning partner branch truth
- RF owning place truth
- direct writes by RF into Atlas place tables
- Atlas storing business branch state as canonical place state

### Recommended integration mode
- stable IDs
- narrow internal projection APIs
- optional read enrichments
- no shared ownership

---

## 8.2 Atlas ↔ Pulse

### Dependency type
Peer bounded context with Atlas-upstream skew

### Relationship summary
Atlas owns place truth.  
Pulse owns event lifecycle.

### Atlas may provide to Pulse
- place identity
- hierarchy/breadcrumbs
- city/district anchors

### Pulse may provide to Atlas
Usually nothing required in Atlas write paths.

### Forbidden patterns
- Atlas owning events
- Pulse owning venues as canonical place truth
- mutual table writes

### Recommended integration mode
- event venue references by Atlas IDs
- read-side enrichment only

---

## 8.3 Atlas ↔ Quest

### Dependency type
Peer bounded context with Atlas-upstream skew

### Relationship summary
Atlas owns location truth.  
Quest owns progression/proof/traversal logic.

### Atlas may provide to Quest
- place targets
- hierarchy context
- child-place semantics
- district/city anchors

### Quest may provide to Atlas
Usually nothing required in Atlas write paths.

### Forbidden patterns
- Atlas owning quest state
- Quest owning location truth
- Quest mutating Atlas place relationships directly

### Recommended integration mode
- ID/reference-based integration
- explicit place projections

---

## 8.4 Atlas ↔ Rielt

### Dependency type
Peer bounded context with Atlas-upstream skew

### Relationship summary
Atlas owns location truth.  
Rielt owns property/listing/inquiry truth.

### Atlas may provide to Rielt
- district and city references
- project/complex place references
- breadcrumbs/location projections

### Rielt may provide to Atlas
Usually nothing required in Atlas write paths.

### Forbidden patterns
- Atlas owning listings
- Rielt owning city/district/place truth
- direct shared writes

### Recommended integration mode
- stable Atlas IDs in Rielt entities
- read-side enrichment only

---

## 8.5 Atlas ↔ Space

### Dependency type
Peer bounded context with Atlas-upstream skew

### Relationship summary
Atlas owns location truth.  
Space owns social circulation/publication.

### Atlas may provide to Space
- attachable city/place identity
- guide objects for sharing
- geo context for posts/pages

### Space may provide to Atlas
Usually nothing.

### Forbidden patterns
- Atlas owning posts/comments/groups
- Space owning or mutating place truth
- Atlas using social state as canonical geo signal

### Recommended integration mode
- stable IDs
- read projections
- no shared ownership

---

## 8.6 Atlas ↔ Guru

### Dependency type
Peer bounded context with strong downstream consumption

### Relationship summary
Guru composes place-aware experiences from Atlas truth.

### Atlas may provide to Guru
- place and hierarchy projections
- public guide summaries
- container/host semantics

### Guru may provide to Atlas
Usually nothing.

### Forbidden patterns
- Guru mutating Atlas truth
- Atlas absorbing recommendation/ranking logic from Guru

### Recommended integration mode
Atlas → Guru through:
- public APIs
- internal place projections
- breadcrumbs and card-like read models

---

## 8.7 Atlas ↔ Media Service

### Dependency type
Peer support dependency

### Relationship summary
Atlas owns semantic media linkage.  
Media service may own storage, transformation, and delivery.

### Atlas may read from Media
- asset existence
- asset metadata
- delivery URLs where necessary

### Media may read from Atlas
- semantic attachment context if needed for downstream processing

### Forbidden patterns
- Atlas storing media binaries as if it were media infrastructure
- Media service becoming owner of Atlas semantic content relationships

### Recommended integration mode
- reference keys
- semantic media refs in Atlas
- binary storage outside Atlas if platform supports it

---

## 9. Read vs Write Dependency Rules

## 9.1 Read dependency rule

It is acceptable for Atlas to read support data from upstream services such as:
- auth/user identity
- media metadata runtime
- translation/localization support

It is also expected that many downstream services will read Atlas projections.

---

## 9.2 Write dependency rule

Atlas must never write external domain truth directly.

Examples of forbidden writes:
- writing RF partner/branch tables
- writing Pulse event tables
- writing Quest progression tables
- writing Rielt listing tables
- writing Space post tables
- writing Points ledger tables

---

## 9.3 Reverse write rule

External services must never write Atlas-owned tables directly.

They must interact through:
- Atlas public/internal APIs
- Atlas validation endpoints
- Atlas projections/events as consumers only

---

## 10. Dependency Direction by Object Type

### Country
- Upstream refs: Auth/User for editorial/moderation only
- Downstream consumers: all geo-aware modules

### City
- Upstream refs: Auth/User
- Downstream consumers: RF, Pulse, Quest, Rielt, Guru, Space, frontends

### District
- Upstream refs: Auth/User
- Downstream consumers: RF, Rielt, Guru, frontends

### Place
- Upstream refs: Auth/User, media support
- Downstream consumers: RF, Pulse, Quest, Rielt, Guru, Space, frontends

### GuideContent
- Upstream refs: Auth/User, optional translation/media support
- Downstream consumers: public frontend, Guru, Space sharing surfaces, search/indexing

### PlaceRelation / Breadcrumbs
- Upstream refs: Atlas-owned place truth only
- Downstream consumers: RF, Quest, Guru, frontends

---

## 11. Dependency Matrix (Compact)

| Neighbor | Category | Atlas Reads | Atlas Writes | Neighbor Reads Atlas | Neighbor Writes Atlas | Notes |
|---|---|---|---|---|---|---|
| Auth/User | Authoritative upstream | Yes | No | No direct domain dependency required | No | Editorial/moderation identity only |
| Media runtime | Operational/peer support | Yes, limited | No | Possibly limited | No | Binary/media support only |
| RF | Peer/downstream consumer | Usually no | No | Yes | No | Uses Atlas geo/place truth |
| Pulse | Peer/downstream consumer | Usually no | No | Yes | No | Uses Atlas venue/place truth |
| Quest | Peer/downstream consumer | Usually no | No | Yes | No | Uses Atlas targets and hierarchy |
| Rielt | Peer/downstream consumer | Usually no | No | Yes | No | Uses Atlas location truth |
| Guru | Downstream consumer | Usually no | No | Yes | No | Consumes Atlas place/context projections |
| Space | Peer/downstream consumer | Usually no | No | Yes | No | Uses Atlas geo context |
| Frontends | Downstream | N/A | Through API only | Yes | No direct writes | Public/editorial surfaces |
| Search/analytics | Downstream | N/A | No | Yes/events | No | Projection/index consumers |

---

## 12. Allowed Integration Styles

The preferred integration styles around Atlas are:

### 12.1 Stable ID references
Use when linking RF, Pulse, Quest, Rielt, Space, and Guru objects to Atlas entities.

### 12.2 Narrow internal projection APIs
Use when another service needs minimal place/city/district/country data without coupling to full Atlas internals.

### 12.3 Reference validation endpoints
Use when downstream write paths need to confirm Atlas IDs are valid and coherent.

### 12.4 Domain events / outbox
Use for:
- search/index refresh
- analytics
- guide publication downstream reactions
- caching/projection refresh
- possible social sharing side effects

### 12.5 Optional bounded synchronous validation
Use when request-time correctness matters, such as:
- validating place references from RF/Pulse/Rielt
- resolving breadcrumb path

---

## 13. Forbidden Integration Styles

Atlas should explicitly avoid:

- shared database writes across services
- importing downstream business aggregates into Atlas write ownership
- wide “give me the whole Atlas DB” internal APIs
- embedding RF/Pulse/Quest/Rielt business logic into Atlas
- cyclic workflows where Atlas write success depends on peer workflow success
- frontend-owned canonical geo logic

---

## 14. Cyclic Dependency Risks

Atlas is foundational, so cyclic dependency loops are especially dangerous.

### Bad loop A
RF branch publication depends on Atlas place existence  
Atlas place creation depends on RF partner existence  
This must be avoided. Atlas place truth cannot require RF business truth.

### Bad loop B
Pulse event venue creation depends on Atlas place  
Atlas place publication depends on Pulse event usage  
This creates illegal venue/event coupling.

### Bad loop C
Rielt project creation depends on Atlas project place  
Atlas project place existence depends on active Rielt listing  
This must be broken by making Atlas place truth independent.

### Bad loop D
Guru ranking chooses which places “exist meaningfully”  
Atlas publication depends on Guru ranking  
This is forbidden because recommendation cannot define canonical truth.

### Bad loop E
Space social popularity influences Atlas place existence/publication as canonical truth  
This would make social activity an authority on geo truth and must be avoided.

---

## 15. Atlas as Source vs Atlas as Consumer

Atlas should behave primarily as a **source service**, not a heavy consumer.

Atlas is source for:
- country truth
- region truth
- city truth
- district truth
- place truth
- place containment truth
- guide content attached to Atlas entities
- breadcrumbs and geo validation semantics

Atlas is consumer for:
- auth identity
- media support/runtime
- optional localization support

This ratio matters.  
If Atlas begins consuming downstream business/event/social state as input to its write truth, it is drifting out of its domain.

---

## 16. Internal Projection Contracts

Atlas may expose internal projections for safe cross-service consumption.

Recommended projection families:

- country minimal projection
- city minimal projection
- district minimal projection
- place minimal projection
- breadcrumb projection
- reference validation result

These projections should:
- be narrow;
- be stable;
- contain IDs and a few operational fields;
- avoid leaking internal table shape.

### Example appropriate use
RF validates `atlasPlaceId` and `hostAtlasPlaceId`.  
Pulse fetches place breadcrumb for display.  
Guru reads place card projection.

### Example inappropriate use
Another service reconstructs Atlas write semantics by depending on Atlas internal relational structure.

---

## 17. Event Dependency Rules

Atlas events should be treated as downstream facts, not upstream commands.

### Good event usage
- `atlas.place.published` triggers search index refresh
- `atlas.guide.published` triggers public content cache refresh
- `atlas.place_relation.created` triggers breadcrumb/materialized read updates

### Bad event usage
- another service emits event that directly mutates Atlas truth without Atlas owning the transition
- Atlas waits for downstream consumer acknowledgment before committing local geo truth

Atlas local truth should be committed first.  
Downstream reactions happen afterward.

---

## 18. Frontend Dependency Rules

All Atlas frontends are downstream consumers of Atlas APIs.

This includes:
- public Atlas pages
- guide pages
- editorial/admin panels
- moderation tools

### Allowed pattern
Frontend → Atlas API → Atlas application layer → Atlas data

### Forbidden pattern
Frontend → direct DB mutation  
Frontend → client-owned canonical geo/place truth  
Frontend → downstream module deciding Atlas entity truth

---

## 19. Dependency Priorities for Atlas SSOT / Delivery

The most important Atlas dependencies are:

### Hard upstream
1. Auth/User

### Important support dependencies
2. Media runtime semantics
3. infrastructure / eventing

### Most important downstream consumers
4. RF
5. Pulse
6. Rielt
7. Guru
8. Quest
9. Space
10. public/editorial frontends

This means Atlas must optimize first for:
- stable geo/place truth;
- stable validation/projection contracts;
- minimal editorial correctness.

---

## 20. Minimal Integration Baseline

A minimal correct Atlas dependency implementation can be:

- auth principal resolution
- Atlas-owned write store
- Atlas-owned public/internal read APIs
- place/geography validation endpoints
- optional outbox/domain events scaffold
- no direct synchronous dependency on RF/Pulse/Quest/Rielt/Guru/Space for core Atlas writes

This keeps Atlas authoritative and operationally independent.

---

## 21. Dependency Ownership Formula by Neighbor

### RF
RF depends on Atlas for geo and place truth.  
Atlas does not depend on RF for place truth.

### Pulse
Pulse depends on Atlas for venue/place identity.  
Atlas does not depend on Pulse for location truth.

### Quest
Quest depends on Atlas for place anchors.  
Atlas does not depend on Quest for canonical place existence.

### Rielt
Rielt depends on Atlas for location truth.  
Atlas does not depend on Rielt for geo identity.

### Guru
Guru composes Atlas data.  
Atlas does not depend on Guru for truth.

### Space
Space attaches social context to Atlas entities.  
Atlas does not depend on Space for geo truth.

### Media runtime
Atlas may depend on media infrastructure for asset support.  
Media runtime does not own Atlas semantic media linkage.

---

## 22. Forbidden Ownership Transfers

The following ownership transfers must be explicitly prohibited:

- RF branch/place truth → Atlas
- Pulse event venue lifecycle → Atlas
- Quest progression target truth → Atlas
- Rielt listing location truth replacing Atlas
- Space social popularity truth → Atlas place truth
- Guru ranking truth → Atlas entity truth

And in the opposite direction:

- Atlas place truth → RF business truth
- Atlas place truth → Pulse event truth
- Atlas place truth → Quest progression truth
- Atlas place truth → Rielt listing truth
- Atlas guide truth → Space post truth

Atlas may share projections, never transfer ownership.

---

## 23. Risk Map

### High-risk coupling risks
- RF creating alternative place identity around branches
- Pulse modeling venues outside Atlas
- Rielt creating project/complex place truth outside Atlas
- Guru/search/ranking logic creeping into Atlas core contracts
- Space or popularity signals distorting canonical place truth

### Medium-risk coupling risks
- media storage semantics bleeding into Atlas write model
- editorial tooling assuming content blob equals entity identity
- frontends hardcoding breadcrumbs or hierarchy logic outside Atlas

### Low-risk dependencies
- auth claims
- narrow projection reads
- downstream cache/index consumers of Atlas events

---

## 24. What a Correct Atlas Dependency Shape Looks Like

A correct dependency shape for Atlas looks like this:

- Atlas validates editorial identity upstream
- Atlas owns all geo/place/content writes locally
- Atlas commits canonical truth without waiting on peer domains
- Atlas exposes stable geo/place IDs and narrow projections
- neighboring services consume Atlas by reference
- no neighboring service writes Atlas tables
- no neighboring service replaces Atlas as canonical place authority

This is the architecture-safe dependency pattern.

---

## 25. Final Dependency Formula

The shortest correct dependency formula is:

> `atlas-service` depends upstream mainly on identity and support infrastructure, serves as the canonical geo/place source for RF / Pulse / Quest / Rielt / Guru / Space and frontend consumers, and must remain the sole writer of Atlas country, city, district, place, hierarchy, and guide-content truth.

---

## 26. Most Important Conclusion

Atlas has many consumers, but that does **not** justify blurred ownership.

The correct dependency map is:

- very few authoritative upstream inputs,
- many downstream consumers,
- narrow peer integrations,
- zero shared ownership.

That is what keeps `atlas-service` stable, reusable, and foundational for the whole Go2Asia ecosystem.