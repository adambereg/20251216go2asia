# Atlas Service — Service Production Architecture v1

**Project:** Go2Asia  
**Domain:** Atlas / Atlas Asia  
**Document role:** SSOT production architecture for `atlas-service`  
**Status:** Draft v1  
**Purpose:** Define the production-ready service shape, runtime components, deployment expectations, storage/runtime topology, operational hardening rules, rollout phases, and extraction-safe production baseline for `atlas-service`.

---

## 1. Purpose

This document defines the production architecture baseline for `atlas-service`.

If:

- `atlas_domain_model_v1.md` defines **what Atlas is**,
- `atlas_openapi_outline_v1.md` defines **how Atlas is exposed**,
- `atlas_backend_architecture_v1.md` defines **how Atlas is structured internally**,
- `atlas_dependency_map_v1.md` defines **how Atlas relates to the rest of the ecosystem**,

then this document defines:

- how `atlas-service` should exist in production;
- which runtime pieces are required;
- how canonical geo/place truth should be operated safely;
- how guide-content workflows should run in production;
- how Atlas should support downstream domains without losing ownership discipline.

This is the **implementation and runtime baseline** for real deployment.

---

## 2. Production Role of Atlas

In production, `atlas-service` is the foundational geo/place backbone of Go2Asia.

It must support several simultaneously important responsibilities:

- canonical geo identity management;
- canonical place identity and containment;
- public Atlas reads for countries/cities/districts/places/guides;
- editorial and moderation workflows;
- internal validation/projection surfaces for RF / Pulse / Quest / Rielt / Guru / Space;
- stable reference behavior for the rest of the ecosystem.

That means Atlas is not merely a content module and not merely a guide frontend backend.  
It is a production reference service.

---

## 3. Production Design Principles

The production shape of `atlas-service` must follow these principles:

1. **Atlas is the sole writer of Atlas geo/place truth**
2. **Atlas must remain operationally independent from downstream business/event/social domains**
3. **Atlas must treat identity integrity as more important than presentation convenience**
4. **Atlas must separate canonical write truth from read convenience and SEO/public projections**
5. **Atlas must support editorial and moderation workflows as first-class runtime concerns**
6. **Atlas must tolerate downstream read/index/cache failures without corrupting canonical geo truth**
7. **Atlas must remain extraction-safe from day one because it is a foundational domain**

---

## 4. Production Runtime Shape

The recommended production shape for `atlas-service` is:

- one primary HTTP/API service;
- one primary relational database;
- one transactional outbox/event emission mechanism;
- optional background worker(s) for asynchronous tasks;
- optional projection refresh and cache invalidation jobs;
- structured logging, metrics, moderation/audit streams.

In minimal initial production form, this may still be deployed as:

- one Atlas API process/app;
- one DB schema;
- one outbox table/publisher loop;
- optional scheduled/background process.

But the code and data model must already allow later separation.

---

## 5. Required Production Components

## 5.1 API runtime

Handles:

- public Atlas reads;
- editorial/admin writes;
- moderation/review actions;
- guide content creation and publication;
- internal validation and projection endpoints.

This is the primary request-time runtime.

---

## 5.2 Primary relational database

Stores:

- canonical Atlas write model;
- moderation and editorial support records;
- guide content versions;
- place hierarchy and relation records;
- optional read-side materialized/projection tables.

This is the source of truth.

---

## 5.3 Transactional outbox

Stores Atlas domain events produced as part of Atlas transactions.

Purpose:
- enable reliable downstream refresh;
- avoid cross-service writes inside Atlas transactions;
- support search/index/cache refresh and downstream consumers safely.

This is strongly recommended.

---

## 5.4 Background worker / async runner

Handles non-request-critical tasks such as:

- outbox publishing;
- projection refresh;
- breadcrumb/materialized hierarchy rebuilds;
- stale moderation reminders;
- cache invalidation handoff;
- optional integrity/reconciliation checks.

In smaller deployments this may initially be a scheduled job or colocated worker process.

---

## 5.5 Observability pipeline

Atlas production runtime must support:

- structured logs;
- request IDs / correlation IDs;
- entity mutation audit traces;
- moderation action traces;
- projection refresh traces;
- error categorization;
- metrics around publication and validation flows.

---

## 6. Recommended Deployment Topology

### Minimal production-safe topology
- `atlas-service` API app
- Atlas primary database
- outbox publisher loop
- scheduled/background task runner

### Mature topology
- `atlas-service-api`
- `atlas-service-worker`
- Atlas database
- outbox stream / broker integration
- projection rebuild workers
- cache invalidation consumers
- dedicated dashboards and alerts

The architecture should allow starting simple without redesigning Atlas contracts later.

---

## 7. Production Data Topology

Atlas production data should be divided conceptually into:

1. **authoritative transactional tables**
2. **editorial/moderation support tables**
3. **outbox/event tables**
4. **optional read projection tables**

### 7.1 Authoritative transactional tables
Examples:
- `atlas_countries`
- `atlas_regions`
- `atlas_cities`
- `atlas_districts`
- `atlas_place_types`
- `atlas_places`
- `atlas_place_relations`
- `atlas_guide_contents`
- `atlas_media_refs`

### 7.2 Editorial/moderation support tables
Examples:
- `atlas_moderation_cases`
- optional editorial activity/audit tables

### 7.3 Outbox/event tables
Examples:
- `atlas_outbox_events`

### 7.4 Optional read projection tables
Examples:
- `atlas_country_cards`
- `atlas_city_cards`
- `atlas_district_cards`
- `atlas_place_cards`
- `atlas_place_breadcrumbs`
- `atlas_place_children`
- `atlas_public_guides`
- `atlas_internal_place_projections`

---

## 8. Production Module-to-Runtime Mapping

### Countries module
Production concerns:
- canonical country identity
- slug/code uniqueness
- publication lifecycle
- downstream projection refresh

### Regions module
Production concerns:
- optional intermediate geo layer
- country consistency
- region-type normalization

### Cities module
Production concerns:
- stable city identity
- region/country consistency
- public city card projections
- high reuse by downstream services

### Districts module
Production concerns:
- city anchoring integrity
- neighborhood/district normalization
- downstream location precision

### Place types module
Production concerns:
- stable type taxonomy
- controlled edits
- low-frequency but high-impact changes

### Places module
Production concerns:
- canonical place identity
- host/container semantics
- publication and verification
- breadcrumb source data
- downstream validation surfaces

### Place relations module
Production concerns:
- explicit place-to-place semantics
- relation integrity
- rebuild of derived hierarchy read views where needed

### Guide content module
Production concerns:
- draft/published content lifecycle
- locale/version handling
- separation from entity identity
- public guide rendering inputs

### Moderation module
Production concerns:
- review queues
- publish/reject/flag flows
- reviewer attribution
- auditability

---

## 9. Production-Critical Write Flows

The following flows are production-critical and require stronger correctness guarantees than simple CRUD.

## 9.1 City creation/update
Must:
- preserve country/region consistency;
- enforce slug uniqueness rules;
- avoid duplicate canonical identity creation.

## 9.2 District creation/update
Must:
- preserve city/country alignment;
- avoid cross-city inconsistency;
- support later downstream reference safety.

## 9.3 Place creation/update
Must:
- validate city/country/district coherence;
- validate place type existence;
- validate host place legality if set;
- preserve canonical place identity integrity.

## 9.4 Place publication
Must:
- ensure entity completeness;
- validate minimum canonical identity fields;
- preserve publication timestamps atomically;
- trigger downstream refresh events safely.

## 9.5 Guide content create/update/publish
Must:
- ensure target Atlas entity exists;
- preserve locale/version consistency;
- separate content lifecycle from identity lifecycle;
- publish atomically with content state changes.

## 9.6 Place relation creation/update
Must:
- validate both places exist;
- validate allowed relation semantics;
- avoid illegal self or contradictory relation patterns where policy forbids them.

## 9.7 Moderation resolve/reject/flag
Must:
- be actor-authorized;
- preserve reviewer and timestamps;
- update lifecycle-related fields correctly;
- remain auditable.

---

## 10. Transaction Rules in Production

Atlas production write flows should follow these rules:

1. commit local canonical data in one DB transaction where possible;
2. include moderation/audit/outbox writes in the same transaction when appropriate;
3. never depend on RF/Pulse/Quest/Rielt/Space/Guru writes to complete local state transition;
4. handle downstream side effects asynchronously after local commit.

### Example
Place publication transaction should ideally include:
- update place publication fields;
- write audit/moderation resolution fields if applicable;
- enqueue outbox event.

All of that should succeed or fail together.

---

## 11. Outbox and Event Production Pattern

Atlas should use transactional outbox or equivalent durable event publication strategy.

### Why
Because Atlas updates may matter to:
- RF validation/read-side context
- Pulse venue read refresh
- Guru place projections
- search/index pipelines
- cache refresh
- analytics
- public guide refresh

### Required event characteristics
- stable event name
- event ID
- aggregate/entity ID
- occurred-at timestamp
- minimal payload sufficient for consumers
- replay-safe semantics where possible

### Recommended event families
- `atlas.country.created`
- `atlas.country.published`
- `atlas.city.created`
- `atlas.city.published`
- `atlas.district.created`
- `atlas.district.published`
- `atlas.place.created`
- `atlas.place.updated`
- `atlas.place.published`
- `atlas.place.verified`
- `atlas.place_relation.created`
- `atlas.guide.created`
- `atlas.guide.published`

---

## 12. Worker Responsibilities in Production

A dedicated or semi-dedicated worker path should eventually handle:

### 12.1 Outbox publishing
Publish pending outbox events to platform event infrastructure.

### 12.2 Breadcrumb/projection refresh
Refresh derived breadcrumb or place-card read structures after place and relation changes.

### 12.3 Cache invalidation handoff
Trigger refresh/invalidation for public guide/place/city caches.

### 12.4 Reminder/escalation jobs
Examples:
- pending moderation reminders
- stale draft reminders
- unresolved review case reminders

### 12.5 Reconciliation tasks
Detect:
- orphaned content/entity links
- inconsistent place parent/host references
- stuck outbox items
- stale projections
- duplicate or conflicting slug issues

---

## 13. Place Production Architecture

Place handling is the most critical Atlas production concern.

### 13.1 Place integrity requirements
Production place logic must guarantee:

- one canonical place identity per intended place record;
- stable geo anchoring;
- valid city/country alignment;
- valid place type reference;
- safe host/container linkage when present;
- publication state integrity;
- no accidental downstream-driven mutation of place truth.

### 13.2 Recommended write controls
Use one or more of:
- unique constraints on slug strategy;
- foreign-key integrity for parent geo references;
- application-layer hierarchy validation;
- optimistic locking/version fields for edit-sensitive flows if needed;
- audit logging for high-impact mutations.

### 13.3 Host/container semantics
Production design must support common SEA scenarios such as:
- shop inside mall
- restaurant inside resort
- tower inside condo project
- office inside business center
- vendor inside market

This means `atlas_places` must be able to represent:
- direct host place reference;
- standalone place;
- container place;
- independent place inside container.

### 13.4 Place relation support
`atlas_place_relations` should support richer semantics beyond direct containment but should remain controlled and type-safe.

---

## 14. Geo Hierarchy Production Architecture

Atlas production runtime must preserve geographic hierarchy correctness.

### Required invariants
- region belongs to one country;
- city belongs to one country and optional one region;
- district belongs to one city and one country;
- place belongs to one city and one country;
- place optional district must align with city;
- host place must be legally compatible with the place context.

### Validation strategy in production
Use layered validation:
- transport validation;
- application validation;
- domain invariant enforcement;
- database integrity constraints where practical.

### Important note
Do not allow downstream convenience to weaken hierarchy correctness.

---

## 15. Guide Content Production Architecture

Guide content is a first-class production subsystem.

### 15.1 Guide content requirements
Production guide handling must support:

- draft and published states;
- attachment to a canonical Atlas entity;
- locale support;
- versioning or revision-safe editing model;
- publication timestamps;
- moderation/review where policy requires it.

### 15.2 Identity/content separation
A published city/place must not require that all guide content logic live in the same table as the identity record.

This separation makes it easier to:
- support multiple locales;
- support future revisions;
- support content-specific moderation;
- keep geo identity stable.

### 15.3 Public guide rendering
Public guide pages may be projection-based or assembled from guide content + linked entity.  
But canonical ownership remains in Atlas write truth.

---

## 16. Moderation Production Architecture

Moderation is a real runtime concern in Atlas.

### 16.1 Moderation runtime concerns
- editorial review queues
- publish/reject/flag actions
- reason note persistence
- reviewer identity attribution
- timestamps and auditability

### 16.2 State separation
Production schema and runtime should keep separate:
- `status`
- `publicationStatus`
- `verificationStatus` where used

Do not collapse these into one field.

### 16.3 Queue strategy
Moderation queue may initially be query-driven from transactional tables and moderation cases.

Later it may be supported by dedicated projection tables for:
- pending entity reviews
- pending guide reviews
- flagged place/content items
- stale drafts needing attention

---

## 17. Internal Validation and Projection Production Architecture

Atlas is an upstream validation service for other domains.

### Production surfaces that matter
- validate geo references
- fetch minimal place/city/district projections
- fetch breadcrumb path
- fetch host/container context

### Requirements
These internal surfaces should be:
- narrow;
- stable;
- reasonably fast;
- independent from public SEO presentation shape.

### Important distinction
Atlas must expose internal geo truth, not public-page HTML or presentation artifacts.

---

## 18. API Runtime Hardening

Production Atlas API must include:

- request ID propagation;
- structured error envelopes;
- actor context extraction;
- route-level auth gates;
- application-level policy checks;
- input validation;
- lifecycle transition validation;
- safe moderation action handling.

### Especially sensitive endpoints
- place create/update/publish
- guide create/update/publish
- moderation reject/flag/resolve
- internal validate endpoints consumed by other services

These need stronger controls and logging than simple public reads.

---

## 19. Authorization Production Model

Authorization should be layered.

### 19.1 Authentication layer
Verifies actor identity.

### 19.2 Role/principal layer
Understands actor type:
- user
- atlas_editor
- atlas_moderator
- admin
- internal_service

### 19.3 Domain policy layer
Determines whether actor may perform the exact action on the exact Atlas resource.

### Examples
- editor may create/update draft place
- moderator/admin may publish place
- editor may create guide draft
- moderator/admin may publish or reject guide
- internal service may validate references but not mutate Atlas truth

Production must not rely on frontend assumptions about authority.

---

## 20. Idempotency and Retry Strategy

Certain Atlas production endpoints should support retry-safe behavior.

### Higher-priority candidates
- publish place
- publish guide
- submit-for-review operations
- resolve moderation case
- create relation if client retries are possible

### Recommended techniques
- unique constraints
- version fields where needed
- safe duplicate-request handling
- explicit terminal-state checks
- optionally idempotency keys for selected mutation endpoints if frontend/network behavior makes them necessary

Production goal:
retries should not create duplicate canonical entities or duplicate publication side effects.

---

## 21. Observability Production Baseline

### 21.1 Logs
Atlas should emit structured logs with:
- request ID
- actor ID
- actor type
- endpoint/use case
- entity kind
- entity ID
- outcome
- error code if failed

### 21.2 Metrics
Recommended metrics:
- country/city/district/place create counts
- place publish success/fail counts
- guide publish success/fail counts
- moderation queue size
- validation endpoint usage
- breadcrumb/projection refresh counts
- outbox lag
- worker retry counts

### 21.3 Audit streams
Critical actions should be auditable:
- place mutations
- guide mutations
- moderation actions
- publication/verification actions
- relation changes

### 21.4 Tracing/correlation
Where platform supports it, correlate:
- HTTP request
- DB transaction
- outbox event
- worker handling
- downstream projection refresh

---

## 22. Failure Handling Strategy

Production Atlas must distinguish between:

### 22.1 Core write failure
Examples:
- invalid hierarchy reference
- invalid host place
- slug conflict
- authorization failure
- lifecycle violation
- DB constraint failure

These should fail request immediately and clearly.

### 22.2 Downstream side-effect failure
Examples:
- search/index refresh failed
- cache invalidation delayed
- analytics sink unavailable
- downstream consumer offline

These must not roll back already committed Atlas truth if local transaction succeeded.

### 22.3 Upstream support dependency failure
Examples:
- auth principal resolver unavailable
- media metadata check timeout
- localization helper unavailable

These need explicit policy:
- block when dependency is required for safe write;
- degrade gracefully when dependency is optional and not truth-critical.

---

## 23. Production Security Considerations

Atlas production design should assume sensitive editorial workflows.

### Sensitive data classes
- unpublished draft content
- moderation notes
- reviewer identities
- internal projection endpoints
- editorial audit trails

### Security baseline
- authenticated editorial/moderator routes
- policy enforcement
- no direct DB exposure
- minimal internal endpoint scope
- no leaking moderation data into public reads
- careful log redaction where needed
- no trust in client-supplied role assertions

### Special concern
Internal validation/projection endpoints must not become a backdoor to all Atlas internals.

---

## 24. Performance and Scaling Direction

Atlas does not need premature over-distribution, but must scale sensibly because it is widely read.

### 24.1 Likely early hotspots
- public city/place/guide reads
- breadcrumbs and child-place reads
- internal reference validation
- public place card queries
- guide-by-entity queries
- moderation queue views

### 24.2 Safe scaling levers
- projection tables
- targeted read caching
- worker separation
- query optimization/indexing
- precomputed breadcrumbs/place cards
- careful internal projection optimization

### 24.3 Unsafe scaling shortcuts
- letting other services store alternative canonical place truth
- moving geo hierarchy logic into frontend
- embedding public rendering assumptions into write truth
- skipping moderation/audit logging on critical flows

---

## 25. Indexing and Query Baseline

Production schema should plan indexes for common Atlas access patterns.

### Likely index groups
- country by slug/code/status/publication
- region by country/status/publication
- city by country/region/slug/status/publication
- district by city/country/slug/status/publication
- place by city/district/type/slug/host/status/publication/verification
- guide content by entity kind/entity ID/locale/publication/status
- moderation cases by entity kind/status/reviewer/createdAt
- outbox by publish status/createdAt

Exact index set will follow implementation details, but production planning should assume these access paths.

---

## 26. Projection and Cache Freshness Rules

If Atlas uses projections or caches, production behavior should define freshness expectations.

### Strong consistency required
- canonical geo/place truth
- moderation action results
- internal validation responses
- entity/content publication result in write path

### Eventual consistency acceptable
- public place cards
- public city/district summaries
- breadcrumbs if projection-based and refreshed quickly
- public guide cache
- search indexes
- analytics dashboards

This distinction is important because Atlas serves both truth and presentation.

---

## 27. Migration and Rollout Strategy

Atlas should ship in phases.

## 27.1 Phase A — canonical Atlas baseline
Required:
- countries
- cities
- districts
- place types
- places
- guide content
- moderation basics
- public reads
- internal place validation/projection
- stable IDs/slugs
- outbox scaffold

## 27.2 Phase B — operational hardening
Add:
- worker split
- richer moderation queues
- breadcrumb/materialized projection refresh
- more robust audit views
- stronger cache/index refresh flow
- alerts and metrics dashboards

## 27.3 Phase C — ecosystem integration maturation
Add:
- cleaner RF/Pulse/Rielt validation adapters
- richer Guru projections
- richer locale/version content workflows
- stronger data reconciliation and anomaly detection

The key is that Phase A must already be architecturally compatible with Phase B/C.

---

## 28. Production Readiness Checklist

A production-ready Atlas baseline should satisfy:

- Atlas owns all Atlas writes
- auth/editorial identity integration is live
- place hierarchy validation is live
- host/container place validation is live
- place and guide publication are auditable
- internal validation/projection endpoints are narrow and stable
- outbox exists or equivalent reliable event publishing exists
- public reads do not leak moderation/private editorial data
- downstream failures do not corrupt Atlas write truth
- no downstream domain can mutate Atlas truth directly

---

## 29. What Must Not Be Deferred Too Long

Some hardening can wait, but these should not be postponed excessively:

1. hierarchy integrity validation
2. host/container place validation
3. publication/moderation audit trail
4. outbox/reliable event publication
5. stable internal validation/projection contracts
6. slug uniqueness discipline
7. identity/content separation for guide content

Deferring these too long would create real Atlas architecture debt.

---

## 30. What Can Start Simple

These areas may begin with simpler implementations if contracts remain clean:

- region layer may remain lightly used in some geographies
- breadcrumb projections may start as query-built rather than fully materialized
- worker may start as scheduled job
- public guide caching may start light
- advanced editorial analytics may start later
- some downstream consumers may initially use direct internal reads rather than richer projections

The rule is:
**simple implementation is acceptable; wrong ownership is not.**

---

## 31. Service Extraction Readiness

Even if `atlas-service` is initially deployed inside a larger monorepo/platform runtime, its production architecture must make later extraction easy.

### Extraction-safe properties
- isolated DB schema ownership
- isolated API namespace
- isolated event names
- isolated application modules
- no foreign table writes
- no downstream service treating Atlas internal tables as contract

### Extraction warning signs
- RF/Pulse/Rielt keep their own canonical place truth
- frontend owns breadcrumb logic
- another service writes Atlas tables directly
- Atlas write transaction depends on downstream service success
- public CMS/presentation logic is treated as Atlas identity source of truth

---

## 32. Production Non-Goals

This production architecture intentionally excludes:

- RF/business workflows
- event lifecycle runtime
- quest progression runtime
- listing/inquiry runtime
- social publication runtime
- reward/token/on-chain runtime
- platform-wide recommendation engine
- platform-wide search engine ownership

These may consume Atlas truth, but are not Atlas production ownership responsibilities.

---

## 33. Final Production Formula

The shortest correct production formula is:

> `atlas-service` should run in production as an independently owned reference service with one authoritative Atlas write store, reliable outbox/event emission, auditable editorial and moderation workflows, strict geo/place hierarchy integrity, and narrow internal validation/projection boundaries for the rest of the ecosystem.

---

## 34. Most Important Conclusion

The right production architecture for Atlas is not:

- a thin CMS over travel guide pages,
- nor a folder-backed content API,
- nor a shared helper database for other modules,
- nor a presentation-first SEO backend.

It is a real foundational service that must already behave like production reference infrastructure:

- canonical,
- auditable,
- hierarchy-safe,
- projection-capable,
- content-aware but identity-first,
- and resistant to downstream ownership drift.

That is the correct production baseline for `atlas-service`.