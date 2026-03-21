# Atlas Service — Backend Architecture v1

**Project:** Go2Asia  
**Domain:** Atlas / Atlas Asia  
**Document role:** SSOT backend architecture for `atlas-service`  
**Status:** Draft v1  
**Purpose:** Define service boundary, internal structure, write/read responsibilities, storage model direction, integration rules, and implementation constraints for `atlas-service`.

---

## 1. Purpose

This document defines the backend architecture baseline for `atlas-service`.

`atlas-service` is the canonical backend bounded context for:

- country identity;
- region identity where applicable;
- city identity;
- district identity;
- place identity;
- place type taxonomy;
- place hierarchy and containment;
- Atlas-native guide content attached to Atlas entities;
- Atlas moderation/publication workflows;
- internal geo/place projections consumed by other services.

This document translates the Atlas domain model and OpenAPI outline into service-level backend architecture.

It does **not** fully define runtime topology, worker split, deployment hardening, observability matrix, or rollout sequencing depth. Those belong to `atlas_service_production_architecture_v1.md`.

---

## 2. Architectural Role of `atlas-service`

`atlas-service` is the **system of record** for geo and place identity in Go2Asia.

It exists to provide one stable backend owner for:

- what countries, regions, cities, districts, and places exist;
- how those objects relate to each other;
- how containment and host-place semantics work;
- which geo/place object other services should reference;
- which Atlas-native guide content is attached to which Atlas entity.

This service must not drift into becoming:

- a partner/business service;
- an event lifecycle service;
- a quest engine;
- a social feed service;
- a listing service;
- a voucher service;
- a recommendation/ranking engine;
- a general knowledge-graph owner for the whole platform.

---

## 3. Service Boundary

## 3.1 What `atlas-service` owns

`atlas-service` owns the write model and source of truth for:

- `AtlasCountry`
- `AtlasRegion`
- `AtlasCity`
- `AtlasDistrict`
- `AtlasPlace`
- `AtlasPlaceType`
- `AtlasPlaceRelation`
- `AtlasGuideContent`
- `AtlasMediaRef`
- `AtlasModerationCase`
- publication and moderation state for Atlas entities/content
- breadcrumb/hierarchy logic as Atlas-owned geo semantics
- internal geo/place validation and projection logic

---

## 3.2 What `atlas-service` reads but does not own

`atlas-service` may read or validate external references to:

- auth/user identity for editors/moderators/admins;
- media asset existence or metadata if media service is externalized;
- optional localization or translation infrastructure if separated later.

These are support dependencies, not owned domain entities.

---

## 3.3 What `atlas-service` must never own

`atlas-service` must never become source of truth for:

- partner/business presence;
- offers, vouchers, PRO links;
- event schedule, registration, attendance;
- quest definitions, proof, progression;
- social posts/comments/groups;
- listing/property inventory and inquiry flows;
- wallet/token/balance/on-chain state;
- platform-wide ranking/recommendation truth.

---

## 4. Architectural Style

`atlas-service` should be implemented as a modular service with:

- explicit domain layer;
- application/use-case layer;
- repository/data access layer;
- HTTP/interface layer;
- internal projection layer;
- moderation/publication orchestration;
- optional event emission points for downstream consumers.

The preferred style is:

- bounded context first;
- modular monolith implementation for the first production phase;
- extraction-safe internal boundaries;
- strong ownership of write truth;
- no direct table sharing with neighboring domains.

This means:

- Atlas owns Atlas writes;
- other services consume Atlas through APIs, projections, or events;
- no neighboring service writes Atlas tables directly.

---

## 5. Core Backend Responsibilities

The backend responsibilities of `atlas-service` are:

1. create/update/archive geo identity objects;
2. create/update/archive place identity objects;
3. manage place type taxonomy;
4. manage host/container place semantics;
5. manage explicit place relations;
6. manage Atlas-native guide content;
7. manage moderation/publication workflows;
8. expose public geo/place/content read surfaces;
9. expose narrow internal projections for neighboring services;
10. validate geo/place references for internal platform consumers.

---

## 6. Internal Module Structure

Recommended internal structure:

- `domain/`
- `application/`
- `infrastructure/`
- `interfaces/http/`
- `interfaces/internal/`
- `read-models/`
- `events/`
- `validation/`
- `shared/`

A more concrete service layout could be:

- `modules/countries`
- `modules/regions`
- `modules/cities`
- `modules/districts`
- `modules/place-types`
- `modules/places`
- `modules/place-relations`
- `modules/guides`
- `modules/media-refs`
- `modules/moderation`
- `modules/public-read`
- `modules/internal-projections`

This modular split is preferred over a flat service layout.

---

## 7. Layer Responsibilities

## 7.1 Domain layer

Contains:

- entity definitions;
- aggregate boundaries;
- geo hierarchy invariants;
- place containment rules;
- canonical slug rules;
- publication/verification rules;
- value objects and domain services where needed.

Examples:
- place must belong to exactly one city;
- district must belong to exactly one city;
- host place relation legality;
- entity/content publication completeness rule;
- guide content must attach to existing Atlas entity.

The domain layer must not depend on HTTP or transport DTOs.

---

## 7.2 Application layer

Contains use cases and orchestration logic.

Examples:
- create city draft
- update place
- publish place
- create guide draft
- submit guide for review
- create place relation
- validate references
- generate breadcrumb projection
- verify or reject place/content

This layer coordinates:
- authorization preconditions
- repository access
- consistency checks
- transaction boundaries
- event emission where applicable

---

## 7.3 Infrastructure layer

Contains:

- ORM/data mapping;
- repository implementations;
- persistence schemas;
- slug uniqueness enforcement helpers;
- internal projection builders;
- optional event/outbox adapters;
- media reference persistence;
- moderation case persistence.

---

## 7.4 Interface layer

Contains:

- HTTP handlers/controllers;
- OpenAPI request/response binding;
- auth context parsing;
- transport validation;
- internal service endpoints.

This layer should remain thin.

---

## 8. Aggregate Direction

Recommended aggregate direction for Atlas v1:

### `Country` aggregate
Owns:
- country root
- country lifecycle state

### `Region` aggregate
Owns:
- region root
- country linkage
- region lifecycle state

### `City` aggregate
Owns:
- city root
- country/region linkage
- city lifecycle state

### `District` aggregate
Owns:
- district root
- city/country/region linkage
- district lifecycle state

### `Place` aggregate
Owns:
- place root
- host place linkage
- type linkage
- publication/verification state
- containment semantics at entity level

### `GuideContent` aggregate
Owns:
- guide draft/published versions
- content lifecycle state
- entity attachment

### `PlaceRelation` aggregate
Owns:
- explicit relation record between places

Moderation cases may be separate support aggregates or bounded support records.

The goal is to keep aggregates small enough for transactional correctness and identity integrity.

---

## 9. Write Model Principles

## 9.1 Single writer rule

Only `atlas-service` may mutate Atlas-owned records.

No other service should write Atlas tables directly.

---

## 9.2 Explicit lifecycle transitions

State changes should be represented by explicit application actions, not arbitrary field patching.

Examples:
- submit for review
- publish
- archive
- verify
- reject
- flag

---

## 9.3 Transaction discipline

A single Atlas mutation should commit within one local DB transaction where possible.

Examples:
- create place + initial moderation case if policy requires it
- publish guide + update published timestamps
- create place relation + validate both place references
- archive entity + update visibility state

Cross-domain updates must not be done as distributed write transactions.

---

## 10. Read Model Principles

`atlas-service` should support separate read projections for:

- country cards
- city cards
- district cards
- place cards
- guide pages
- breadcrumbs
- place children lists
- place relation lists
- internal geo validation results
- internal place projections for neighboring services

The write model remains normalized.  
Read models may be denormalized for performance and clarity.

---

## 11. Storage Model Direction

The persistence layer should use relational storage as the primary system of record.

Recommended high-level tables:

- `atlas_countries`
- `atlas_regions`
- `atlas_cities`
- `atlas_districts`
- `atlas_place_types`
- `atlas_places`
- `atlas_place_relations`
- `atlas_guide_contents`
- `atlas_media_refs`
- `atlas_moderation_cases`

Optional later read/projection tables:

- `atlas_country_cards`
- `atlas_city_cards`
- `atlas_district_cards`
- `atlas_place_cards`
- `atlas_place_breadcrumbs`
- `atlas_place_children`
- `atlas_public_guides`
- `atlas_internal_place_projections`

---

## 12. Table-Level Intent

## 12.1 `atlas_countries`

Stores canonical country roots.

Core concerns:
- slug/code/display name
- lifecycle state
- publication state

---

## 12.2 `atlas_regions`

Stores optional regional subdivisions.

Core concerns:
- country linkage
- region type
- slug/display name
- lifecycle state

---

## 12.3 `atlas_cities`

Stores canonical cities.

Core concerns:
- country linkage
- optional region linkage
- slug/display name
- coordinates/timezone
- lifecycle/publication state

---

## 12.4 `atlas_districts`

Stores districts/neighborhoods.

Core concerns:
- city linkage
- country/region linkage
- district type
- slug/display name
- lifecycle/publication state

---

## 12.5 `atlas_place_types`

Stores normalized type taxonomy for places.

Core concerns:
- code/display name
- optional parent type code
- active/inactive state

---

## 12.6 `atlas_places`

Stores canonical places.

Core concerns:
- city/country/district linkage
- place type
- host place reference
- coordinates/address
- containment flags
- publication/verification state

---

## 12.7 `atlas_place_relations`

Stores explicit place-to-place relations beyond simple host linkage.

Core concerns:
- from place
- to place
- relation type
- active/archive state

---

## 12.8 `atlas_guide_contents`

Stores Atlas-native guide content.

Core concerns:
- entity kind
- entity ID
- locale
- version
- title/summary/body structured payload
- publication state

---

## 12.9 `atlas_media_refs`

Stores semantic media linkage.

Core concerns:
- attached entity/content
- media key
- media kind
- sort order

---

## 12.10 `atlas_moderation_cases`

Stores moderation/review support.

Core concerns:
- entity kind
- entity ID
- case type
- status
- reviewer
- reason note
- timestamps

---

## 13. Hierarchy Architecture Rules

Atlas hierarchy must be enforced in backend logic.

### Country rule
Country is top-level geo anchor.

### Region rule
Region belongs to exactly one country.

### City rule
City belongs to exactly one country and optionally one region.

### District rule
District belongs to exactly one city and one country.

### Place rule
Place belongs to exactly one city and one country, and optionally one district and one region.

### Backend implication
Create/update validators must ensure these relationships remain internally coherent.

Example:
- a district cannot reference a city from a different country;
- a place cannot reference a district from another city;
- a region ID on a city/place must align with the country.

---

## 14. Place Containment Architecture

Atlas must support place containment as native backend behavior.

### 14.1 Direct containment
The common case is modeled by:
- `host_place_id` on `atlas_places`

This covers:
- shop inside mall
- restaurant inside resort
- tower inside condo project
- vendor inside market

### 14.2 Explicit relation layer
Where richer semantics are needed, use `atlas_place_relations`.

Examples:
- `inside`
- `part_of`
- `building_of`
- `wing_of`
- `near`

### 14.3 Backend implication
Simple and common containment should not require graph-like traversal machinery in v1.  
A direct host relation plus explicit relation table is sufficient for the initial architecture.

---

## 15. Guide Content Architecture

Guide content must remain attached to canonical identity objects.

### Atlas owns
- guide content drafts
- guide content publication lifecycle
- guide locale/versioning support
- content-to-entity linkage

### Backend implication
Guide content should not be embedded as arbitrary blobs inside every geo/place entity record.

A separate `atlas_guide_contents` module/table preserves:
- versioning;
- locale handling;
- moderation/publication flow;
- clean identity/content separation.

---

## 16. Slug and Identity Strategy

Atlas is one of the main slug authorities in the platform.

### Required properties
- stable IDs for service integration
- canonical slugs for public navigation
- uniqueness strategy per entity class
- no silent duplication of geo/place identity

### Backend implication
Slug creation/update should use explicit uniqueness checks and deterministic policies.

Potential uniqueness directions:
- unique per entity class globally, or
- unique within a constrained parent scope if required

The implementation choice may vary, but it must be explicit and stable.

---

## 17. Publication and Verification Architecture

Atlas backend should separate at least:

- `status`
- `publication_status`
- `verification_status` where relevant

### Why this matters
An entity can be:
- active but not published;
- published but not specially verified;
- flagged/rejected without being deleted.

### Backend implication
Do not collapse all lifecycle semantics into one boolean or one generic status string.

This separation is especially important for:
- places;
- guide content;
- selected geo entities requiring moderation.

---

## 18. Internal Projection Architecture

Atlas should provide narrow internal projections for neighboring services.

Recommended projection families:

- country minimal projection
- city minimal projection
- district minimal projection
- place minimal projection
- breadcrumb projection
- reference validation result

These projections should:
- contain only necessary fields;
- remain stable across internal changes;
- avoid exposing raw table shape as contract.

---

## 19. Validation Strategy

Validation should occur at multiple layers.

### Transport validation
- shape
- required fields
- enum membership
- format sanity

### Application validation
- referenced parent existence
- geographic hierarchy coherence
- host place legality
- content/entity existence relationship
- lifecycle transition legality

### Domain validation
- invariants
- single-city anchoring
- single-country anchoring
- type requirement for places
- entity-before-content rule

Do not place all validation in controllers.

---

## 20. Atlas as Upstream Reference Service

Many neighboring services depend on Atlas.

### Atlas provides to others
- canonical geo IDs
- canonical place IDs
- breadcrumb/hierarchy semantics
- host/container semantics
- public or internal place projections
- geo reference validation

### Backend implication
Atlas should optimize for being a stable upstream reference service without absorbing downstream business logic.

It must not become:
- RF branch manager
- Pulse venue manager
- Quest progression engine
- Rielt listing location owner beyond canonical geo identity

---

## 21. RF Integration Boundary

RF depends on Atlas for geo/place truth.

### Atlas may provide to RF
- validation of `countryId`, `cityId`, `districtId`, `atlasPlaceId`, `hostAtlasPlaceId`
- minimal place projection
- breadcrumb/location display support

### Forbidden pattern
Atlas must not store RF branch state or business line logic.

### Backend implication
Any RF branch write requiring geo validation should call Atlas through:
- internal projection/validation endpoint,
- cached read model,
- or bounded adapter.

Ownership remains in Atlas.

---

## 22. Pulse Integration Boundary

Pulse depends on Atlas for venue truth.

### Atlas may provide to Pulse
- place identity
- breadcrumb path
- city/district/place projections

### Forbidden pattern
Atlas must not own event schedule or attendance.

### Backend implication
Event-related place enrichment should be read-side only from the Pulse perspective.

---

## 23. Quest Integration Boundary

Quest may use Atlas places as route/target nodes.

### Atlas may provide to Quest
- canonical place identity
- place hierarchy
- container/host semantics
- city/district references

### Forbidden pattern
Atlas must not store quest completion/proof truth.

---

## 24. Guru Integration Boundary

Guru is largely a downstream read/composition consumer.

### Atlas may provide to Guru
- place cards
- breadcrumb data
- district/city hierarchy
- child-place lists
- host/container semantics

### Forbidden pattern
Atlas must not become a recommendation engine or nearby ranking engine.

---

## 25. Rielt Integration Boundary

Rielt depends on Atlas for location truth.

### Atlas may provide to Rielt
- country/city/district identity
- place/project/complex identity where modeled as Atlas place
- breadcrumb/location projections

### Forbidden pattern
Atlas must not own listing inventory or inquiry flow.

---

## 26. Space Integration Boundary

Space may socially circulate Atlas-linked objects.

### Atlas may provide to Space
- shareable city/place/guide projections

### Forbidden pattern
Atlas must not store social post/group/comment truth.

---

## 27. Media Architecture Boundary

Atlas may own semantic linkage of media, but not necessarily binary storage.

### Atlas owns
- which media belongs to which entity/content;
- hero/gallery semantic references;
- media ordering.

### External media service may own
- upload storage
- binary persistence
- transformation pipeline
- signed URLs

### Backend implication
Use `atlas_media_refs` as semantic linkage layer, not as binary media database.

---

## 28. Moderation Architecture

Atlas moderation is a real subsystem, not a UI afterthought.

Recommended moderation backend capabilities:

- pending review queue for Atlas entities/content
- verify/reject/flag/archive actions
- reviewer identity tracking
- reason note persistence
- timestamps and case history support

### Important distinction
Moderation state is not the same as entity existence.  
A place or guide may exist in draft form before publication or verification.

---

## 29. Search and Filtering Direction

Atlas should support structured filtering in-service.

Allowed in-service filtering:
- by country/region/city/district
- by place type
- by host place
- by entity status/publication status
- by locale/entity kind for guide content

Atlas should avoid building platform-wide fuzzy search ownership inside the service.

If richer search is needed later, it should rely on dedicated search projections or platform search infrastructure.

---

## 30. Read Projection Strategy

Atlas should support internal read projections that are purpose-built.

Recommended projection types:

### Public projections
- country card
- city card
- district card
- place card
- guide page summary
- breadcrumb path

### Internal projections
- minimal place projection
- geo validation result
- city/district/country minimal projections

### Editorial projections
- draft queue items
- moderation queue items
- entity/content status views

Projection strategy should allow later extraction into dedicated read tables or processes without breaking ownership.

---

## 31. Caching Direction

Caching may be used for read-heavy Atlas projections, but never as source of truth.

Safe cache candidates:
- public country/city/place cards
- breadcrumb paths
- guide page summaries
- internal place projection reads

Unsafe cache ownership:
- canonical lifecycle truth
- moderation action truth
- create/update transaction state

Critical editorial and publication decisions should read authoritative state.

---

## 32. Event Direction

Atlas may emit domain events for downstream consumers.

Suggested event families:

- `atlas.country.created`
- `atlas.city.created`
- `atlas.district.created`
- `atlas.place.created`
- `atlas.place.published`
- `atlas.place.verified`
- `atlas.guide.created`
- `atlas.guide.published`
- `atlas.place_relation.created`

### Architectural recommendation
Use transactional outbox or equivalent reliable delivery mechanism later in production architecture.  
Backend architecture should already leave clear event emission points.

---

## 33. Authorization Model in Backend

Authorization should be enforced in the application layer via explicit policy checks.

Recommended policy dimensions:

- actor type
- editor/moderator/admin role
- action type
- entity lifecycle state
- publish/verify privilege level

Examples:
- editor may create/update draft place
- moderator/admin may publish place
- editor may submit guide for review
- moderator/admin may reject or verify guide/place
- internal service may read projection but not mutate Atlas truth

Do not rely solely on route-level coarse auth.

---

## 34. Migration and Compatibility Rules

Atlas backend should support staged evolution.

### Early compatibility allowances
- some guide/body structures may begin simple before richer structuring
- some read projections may be query-built before denormalization
- region layer may be optional per geography

### Hard non-negotiables
- Atlas remains sole writer of Atlas truth
- other domains reference Atlas rather than clone it
- place identity remains separate from guide content
- containment semantics remain Atlas-owned
- no business/event/listing/social truth migrates into Atlas

---

## 35. Error Handling Direction

Backend should expose stable Atlas-specific error codes.

Examples:
- `ATLAS_COUNTRY_NOT_FOUND`
- `ATLAS_CITY_NOT_FOUND`
- `ATLAS_DISTRICT_NOT_FOUND`
- `ATLAS_PLACE_NOT_FOUND`
- `ATLAS_PLACE_TYPE_NOT_FOUND`
- `ATLAS_GUIDE_CONTENT_NOT_FOUND`
- `ATLAS_INVALID_CITY_REFERENCE`
- `ATLAS_INVALID_DISTRICT_REFERENCE`
- `ATLAS_INVALID_HOST_PLACE_REFERENCE`
- `ATLAS_PLACE_TYPE_REQUIRED`
- `ATLAS_SLUG_ALREADY_EXISTS`
- `ATLAS_MODERATION_REQUIRED`

Internally, error categories should distinguish:
- validation errors
- authorization errors
- invariant/lifecycle errors
- not found errors
- external dependency issues
- infrastructure failures

---

## 36. Observability Hooks at Backend Level

Detailed production observability belongs in the production architecture doc, but backend design should already include structured emit points for:

- entity mutation audit logs
- moderation actions
- publication actions
- content publish/reject transitions
- internal validation requests
- event emission attempts/failures

This allows production hardening later without redesigning core flows.

---

## 37. Extraction-Safe Design Rules

Even if Atlas begins inside a broader monorepo/runtime, its backend architecture must remain extraction-safe.

Required properties:
- clear module boundaries
- no direct table sharing with neighboring domains
- APIs/projections/events for external access
- no leakage of RF/Pulse/Rielt/Quest state into Atlas write ownership
- no business logic hidden in UI/frontend

This is essential because Atlas is a foundational upstream domain.

---

## 38. Recommended First Backend Implementation Cut

The minimum viable backend cut for Atlas should include:

### Core write modules
- countries
- cities
- districts
- place-types
- places
- guides
- moderation

### Important optional/next modules
- regions
- place-relations
- media-refs

### Required read surfaces
- public countries
- public cities
- public districts
- public places
- breadcrumbs
- guide-by-entity
- internal place projection
- internal validation endpoint

### Required integration basics
- auth principal resolution
- stable slug/ID handling
- hierarchy validation
- host place validation
- moderation lifecycle scaffold

---

## 39. What Must Stay Out of `atlas-service`

To prevent scope drift, keep these out:

- partner/business workflows
- offer/voucher/pro-link logic
- event lifecycle and attendance
- quest progression/proof
- listing/inquiry engine
- social publication workflows
- wallet/token/on-chain logic
- recommendation/ranking ownership
- platform-wide search ownership

These may integrate with Atlas, but are not Atlas backend responsibilities.

---

## 40. Final Backend Formula

The shortest correct backend formula is:

> `atlas-service` is the backend system of record for geo/place identity, hierarchy, containment, and Atlas-native guide content.  
> It owns Atlas writes, exposes Atlas read projections, validates geo references for neighboring services, and remains extraction-safe by refusing shared ownership.

---

## 41. Most Important Conclusion

The correct backend implementation of Atlas is not a “guide CMS API” and not a “place lookup helper”.

It is a proper bounded backend context that:

- owns geo and place identity;
- enforces canonical hierarchy;
- keeps place containment semantics explicit;
- separates identity from guide content;
- supports downstream RF / Pulse / Quest / Rielt / Guru needs through clean projections;
- avoids becoming a god-service.

That is the correct backend baseline for `atlas-service`.