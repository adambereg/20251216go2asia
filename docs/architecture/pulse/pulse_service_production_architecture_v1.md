# Pulse Service — Service Production Architecture v1

**Project:** Go2Asia  
**Domain:** Pulse / Pulse Asia  
**Document role:** SSOT production architecture for `pulse-service`  
**Status:** Draft v1  
**Purpose:** Define the production-ready service shape, runtime components, deployment expectations, storage/runtime topology, operational hardening rules, rollout phases, and extraction-safe production baseline for `pulse-service`.

---

## 1. Purpose

This document defines the production architecture baseline for `pulse-service`.

If:

- `pulse_domain_model_v1.md` defines **what Pulse is**,
- `pulse_openapi_outline_v1.md` defines **how Pulse is exposed**,
- `pulse_backend_architecture_v1.md` defines **how Pulse is structured internally**,
- `pulse_dependency_map_v1.md` defines **how Pulse relates to the rest of the ecosystem**,

then this document defines:

- how `pulse-service` should exist in production;
- which runtime pieces are required;
- how event and attendance truth should be operated safely;
- how organizer/user/moderation workflows should run in production;
- how Pulse should support downstream domains without losing ownership discipline.

This is the **implementation and runtime baseline** for real deployment.

---

## 2. Production Role of Pulse

In production, `pulse-service` is the canonical operational backbone of the event layer in Go2Asia.

It must support several simultaneously important responsibilities:

- canonical event identity management;
- schedule and timing truth;
- public event reads;
- user registration / RSVP flows;
- user attendance truth;
- organizer-facing event operations;
- moderator/admin event review and lifecycle control;
- internal validation/projection surfaces for RF / Quest / Guru / Space / Rielt / Points-related downstream consumers.

That means Pulse is not merely a calendar feed backend and not merely an event content list.  
It is a production workflow service.

---

## 3. Production Design Principles

The production shape of `pulse-service` must follow these principles:

1. **Pulse is the sole writer of Pulse event, registration, and attendance truth**
2. **Pulse must remain operationally independent from downstream business, social, reward, and quest domains**
3. **Pulse must treat attendance integrity as first-class production truth**
4. **Pulse must separate canonical write truth from read convenience and public/event-feed projections**
5. **Pulse must support organizer and moderation workflows as first-class runtime concerns**
6. **Pulse must tolerate downstream consumer failure without corrupting local event or attendance state**
7. **Pulse must remain extraction-safe from day one because it is a likely high-traffic workflow domain**

---

## 4. Production Runtime Shape

The recommended production shape for `pulse-service` is:

- one primary HTTP/API service;
- one primary relational database;
- one transactional outbox/event emission mechanism;
- optional background worker(s) for asynchronous tasks;
- optional projection refresh and cache invalidation jobs;
- structured logging, metrics, moderation/audit streams.

In minimal initial production form, this may still be deployed as:

- one Pulse API process/app;
- one DB schema;
- one outbox table/publisher loop;
- optional scheduled/background process.

But the code and data model must already allow later separation.

---

## 5. Required Production Components

## 5.1 API runtime

Handles:

- public event reads;
- user registration and attendance reads;
- organizer/admin writes;
- schedule management;
- moderation/review actions;
- internal validation and projection endpoints.

This is the primary request-time runtime.

---

## 5.2 Primary relational database

Stores:

- canonical Pulse write model;
- registration and attendance truth;
- moderation support records;
- event media references;
- optional read-side materialized/projection tables.

This is the source of truth.

---

## 5.3 Transactional outbox

Stores Pulse domain events produced as part of Pulse transactions.

Purpose:
- enable reliable downstream refresh;
- avoid cross-service writes inside Pulse transactions;
- support Quest / Points / notifications / search / social downstream reactions safely.

This is strongly recommended.

---

## 5.4 Background worker / async runner

Handles non-request-critical tasks such as:

- outbox publishing;
- schedule/time-based lifecycle jobs;
- attendance reconciliation or delayed verification support;
- projection refresh;
- stale moderation reminders;
- cache invalidation handoff.

In smaller deployments this may initially be a scheduled job or colocated worker process.

---

## 5.5 Observability pipeline

Pulse production runtime must support:

- structured logs;
- request IDs / correlation IDs;
- event mutation audit traces;
- registration and attendance transition traces;
- moderation action traces;
- projection refresh traces;
- error categorization;
- metrics around publication, registration, and attendance flows.

---

## 6. Recommended Deployment Topology

### Minimal production-safe topology
- `pulse-service` API app
- Pulse primary database
- outbox publisher loop
- scheduled/background task runner

### Mature topology
- `pulse-service-api`
- `pulse-service-worker`
- Pulse database
- outbox stream / broker integration
- projection rebuild workers
- cache invalidation consumers
- dedicated dashboards and alerts

The architecture should allow starting simple without redesigning Pulse contracts later.

---

## 7. Production Data Topology

Pulse production data should be divided conceptually into:

1. **authoritative transactional tables**
2. **moderation and operational support tables**
3. **outbox/event tables**
4. **optional read projection tables**

### 7.1 Authoritative transactional tables
Examples:
- `pulse_events`
- `pulse_event_schedules`
- `pulse_event_venue_refs`
- `pulse_event_organizer_refs`
- `pulse_event_registrations`
- `pulse_event_attendances`
- `pulse_event_media_refs`

### 7.2 Moderation and operational support tables
Examples:
- `pulse_moderation_cases`
- optional activity/audit tables

### 7.3 Outbox/event tables
Examples:
- `pulse_outbox_events`

### 7.4 Optional read projection tables
Examples:
- `pulse_public_event_cards`
- `pulse_city_event_cards`
- `pulse_place_event_cards`
- `pulse_user_registrations`
- `pulse_user_attendances`
- `pulse_organizer_registration_queue`
- `pulse_organizer_attendance_queue`
- `pulse_internal_event_projections`

---

## 8. Production Module-to-Runtime Mapping

### Events module
Production concerns:
- canonical event identity
- slug uniqueness
- lifecycle transitions
- publication state

### Schedules module
Production concerns:
- canonical event timing
- reschedule/cancel timing transitions
- time coherence

### Venues module
Production concerns:
- Atlas-linked venue discipline
- host/container semantics by reference
- event location integrity

### Organizers module
Production concerns:
- organizer linkage
- external organizer reference discipline
- organizer-scoped permissions

### Registrations module
Production concerns:
- registration mode enforcement
- duplicate active registration prevention where policy requires
- approval/waitlist/reject/cancel transitions

### Attendances module
Production concerns:
- check-in / attendance verification
- no-show/revoke handling
- auditability
- downstream validation truth

### Moderation module
Production concerns:
- review queues
- publish/reject/flag actions
- moderator attribution
- auditability

### Media refs module
Production concerns:
- semantic event media linkage
- order/visibility semantics

---

## 9. Production-Critical Write Flows

The following flows are production-critical and require stronger correctness guarantees than simple CRUD.

## 9.1 Event submission for review
Must:
- validate draft completeness;
- validate schedule presence when policy requires;
- validate venue references;
- persist review transition atomically;
- emit downstream event if needed.

## 9.2 Event publication
Must:
- validate canonical event completeness;
- validate schedule legality;
- validate venue references;
- preserve publication timestamps atomically;
- trigger downstream refresh events safely.

## 9.3 Event cancellation
Must:
- update event lifecycle atomically;
- preserve auditability;
- constrain future registrations appropriately;
- emit downstream cancellation signal safely.

## 9.4 Schedule create/update/cancel
Must:
- preserve time coherence;
- remain consistent with event lifecycle;
- avoid broken active schedule state;
- trigger read projection refresh safely.

## 9.5 Registration create
Must:
- validate event eligibility and registration mode;
- prevent invalid duplicates where policy forbids them;
- persist registration state atomically;
- support downstream notification/reward reactions without blocking local truth.

## 9.6 Registration approval/reject/waitlist/cancel
Must:
- enforce organizer/admin authority;
- preserve transition legality;
- remain auditable;
- not corrupt user participation truth.

## 9.7 Attendance check-in/verify
Must:
- validate event state;
- validate actor scope;
- preserve attendance truth atomically;
- prevent duplicate or contradictory attendance states;
- support downstream validation consumers safely.

## 9.8 Attendance revoke/no-show
Must:
- be explicitly authorized;
- preserve auditability;
- prevent silent truth drift for Quest/Points downstream consumers.

---

## 10. Transaction Rules in Production

Pulse production write flows should follow these rules:

1. commit local authoritative data in one DB transaction where possible;
2. include moderation/audit/outbox writes in the same transaction when appropriate;
3. never depend on Atlas/RF/Quest/Space/Rielt/Points writes to complete local state transition;
4. handle downstream side effects asynchronously after local commit.

### Example
Attendance verification transaction should ideally include:
- update attendance state;
- write audit/operation metadata;
- enqueue outbox event.

All of that should succeed or fail together.

---

## 11. Outbox and Event Production Pattern

Pulse should use transactional outbox or equivalent durable event publication strategy.

### Why
Because Pulse updates may matter to:
- Quest progression/eligibility consumers
- Points/reward consumers
- notifications
- search/index refresh
- Guru event projections
- Space/social amplification
- analytics

### Required event characteristics
- stable event name
- event ID
- aggregate/entity ID
- occurred-at timestamp
- minimal payload sufficient for consumers
- replay-safe semantics where possible

### Recommended event families
- `pulse.event.created`
- `pulse.event.submitted_for_review`
- `pulse.event.published`
- `pulse.event.cancelled`
- `pulse.event.completed`
- `pulse.registration.created`
- `pulse.registration.approved`
- `pulse.registration.cancelled`
- `pulse.attendance.checked_in`
- `pulse.attendance.verified`
- `pulse.attendance.revoked`

---

## 12. Worker Responsibilities in Production

A dedicated or semi-dedicated worker path should eventually handle:

### 12.1 Outbox publishing
Publish pending outbox events to platform event infrastructure.

### 12.2 Time-based lifecycle jobs
Examples:
- mark stale schedules as cancelled where policy requires;
- transition completed events if policy uses automated completion assistance.

### 12.3 Projection refresh
Refresh derived public event cards, city/place-scoped lists, organizer queues, and user-facing lists.

### 12.4 Reminder/escalation jobs
Examples:
- pending event review reminders
- organizer reminders for upcoming events
- registration approval reminders if applicable

### 12.5 Reconciliation tasks
Detect:
- inconsistent schedule states
- stale outbox items
- broken projection lag
- abnormal attendance lifecycle drift
- duplicate or conflicting registration states

---

## 13. Event Production Architecture

Event handling is the foundational Pulse production concern.

### 13.1 Event integrity requirements
Production event logic must guarantee:

- one canonical event identity per intended event record;
- stable event lifecycle;
- valid current schedule state;
- valid Atlas venue linkage by reference;
- organizer linkage without ownership drift;
- publication state integrity;
- no accidental downstream-driven mutation of event truth.

### 13.2 Recommended write controls
Use one or more of:
- unique constraints on slug strategy;
- foreign-key integrity for schedule/event linkage;
- application-layer venue and lifecycle validation;
- optimistic locking/version fields for edit-sensitive flows if needed;
- audit logging for high-impact mutations.

### 13.3 Venue host/container support
Production design must support common SEA scenarios such as:
- meetup inside mall cafe
- networking event inside resort
- market event inside market/street container
- condo open house inside project complex

This means venue references must preserve:
- place ID and/or host place ID;
- local positioning metadata where needed;
- independent event identity.

---

## 14. Schedule Production Architecture

Schedule handling deserves explicit production treatment.

### 14.1 Schedule integrity requirements
Production schedule logic must guarantee:

- valid start/end relationships;
- timezone clarity;
- explicit active/rescheduled/cancelled semantics;
- no ambiguous current schedule truth for published events.

### 14.2 Recommended controls
Use:
- application validation for time legality;
- event lifecycle compatibility checks;
- careful handling of rescheduling;
- projection refresh on schedule changes.

### 14.3 Public time truth
Public event cards and city/place event lists may derive from schedule projections, but canonical timing remains in Pulse write truth.

---

## 15. Registration Production Architecture

Registration is a first-class production subsystem.

### 15.1 Registration requirements
Production registration logic must support:

- one user-to-event participation intent record under defined policy;
- open / approval-required / invite / external-sync modes;
- approval/waitlist/reject/cancel transitions;
- clear timestamps and auditability.

### 15.2 Duplicate registration control
Pulse production logic should define whether multiple registrations per user/event are ever allowed.  
The default v1 assumption should be:
- prevent conflicting simultaneous active registrations for the same event and user.

### 15.3 Organizer queue support
Production must allow organizer/admin surfaces to efficiently inspect:
- pending registrations
- approved registrations
- waitlisted registrations
- cancelled/rejected flows if needed

This may begin query-driven and later evolve into specialized read projections.

---

## 16. Attendance Production Architecture

Attendance is the most sensitive downstream-facing truth in Pulse.

### 16.1 Attendance integrity requirements
Production attendance logic must guarantee:

- one attendance truth per event/user under defined policy;
- check-in and attended states are explicit;
- attendance verification has actor attribution;
- revocation/no-show flows are auditable;
- attendance truth remains authoritative for downstream consumers.

### 16.2 Recommended controls
Use one or more of:
- unique constraints or policy-based uniqueness rules;
- row-level locking or optimistic version checks where needed;
- explicit terminal/non-terminal state handling;
- operation logs or audit streams for all important attendance transitions.

### 16.3 Downstream sensitivity
Quest and reward consumers may depend on attendance truth, so attendance transitions must not be casual UI flags.  
They must be production-grade lifecycle operations.

---

## 17. Moderation Production Architecture

Moderation is a real runtime concern in Pulse.

### 17.1 Moderation runtime concerns
- event review queues
- publish/reject/flag actions
- reason note persistence
- reviewer identity attribution
- timestamps and auditability

### 17.2 State separation
Production schema and runtime should keep separate:
- `status`
- `publicationStatus`
- registration/attendance truth
- moderation support state

Do not collapse all of this into one generic field.

### 17.3 Queue strategy
Moderation queue may initially be query-driven from transactional tables and moderation cases.

Later it may be supported by dedicated projection tables for:
- pending event reviews
- flagged events
- suspension candidates
- attendance anomaly candidates if policy requires

---

## 18. Atlas Venue Validation Production Architecture

Pulse depends critically on Atlas for venue truth.

### 18.1 Published event rule
A published event must not be publicly published unless it has a valid Atlas-linked geo anchor.

Accepted shapes:
- `atlasPlaceId`
- `hostAtlasPlaceId`
- both, where valid
- tightly controlled fallback strategy during migration only

### 18.2 Validation options
Production may validate venue references through:
- synchronous Atlas API validation;
- cached reference tables;
- internal geo adapter service;
- preloaded Atlas projections.

The exact mechanism may evolve, but Atlas remains authoritative.

### 18.3 Important principle
Pulse must never “heal” bad venue truth by inventing its own canonical places.

---

## 19. Internal Validation and Projection Production Architecture

Pulse is an upstream validation service for some downstream consumers.

### Production surfaces that matter
- validate event references
- validate attendance state
- fetch minimal event projections
- fetch attendance summary projections

### Requirements
These internal surfaces should be:
- narrow;
- stable;
- reasonably fast;
- independent from public event page presentation shape.

### Important distinction
Pulse must expose internal event truth, not frontend feed artifacts as if they were canonical contracts.

---

## 20. API Runtime Hardening

Production Pulse API must include:

- request ID propagation;
- structured error envelopes;
- actor context extraction;
- route-level auth gates;
- application-level policy checks;
- input validation;
- lifecycle transition validation;
- safe handling of registration and attendance mutations.

### Especially sensitive endpoints
- register
- approve/reject/waitlist registration
- check-in attendance
- verify/revoke attendance
- publish/cancel event
- internal attendance validation endpoints

These need stronger controls and logging than simple public reads.

---

## 21. Authorization Production Model

Authorization should be layered.

### 21.1 Authentication layer
Verifies actor identity.

### 21.2 Role/principal layer
Understands actor type:
- user
- event_organizer
- pulse_moderator
- admin
- internal_service

### 21.3 Domain policy layer
Determines whether actor may perform the exact action on the exact Pulse resource.

### Examples
- user may register for eligible event
- only current user may cancel own registration unless organizer/admin override path exists
- organizer may update own event draft
- moderator/admin may publish or reject
- organizer/admin may verify attendance
- internal service may validate attendance but not mutate Pulse truth

Production must not rely on frontend assumptions about authority.

---

## 22. Idempotency and Retry Strategy

Certain Pulse production endpoints should support retry-safe behavior.

### Higher-priority candidates
- register
- cancel registration
- attendance check-in
- attendance verify
- publish/cancel event
- submit-for-review operations

### Recommended techniques
- unique constraints
- version fields where needed
- safe duplicate-request handling
- explicit terminal/non-terminal checks
- optionally idempotency keys for selected mutation endpoints if client/network behavior makes them necessary

Production goal:
retries should not create duplicate registrations, duplicate attendance records, or duplicate lifecycle side effects.

---

## 23. Observability Production Baseline

### 23.1 Logs
Pulse should emit structured logs with:
- request ID
- actor ID
- actor type
- endpoint/use case
- entity kind
- entity ID
- outcome
- error code if failed

### 23.2 Metrics
Recommended metrics:
- event create/update counts
- event publish/cancel/complete counts
- registration create/approve/reject/cancel counts
- attendance check-in/verify/revoke/no-show counts
- moderation queue size
- internal validation endpoint usage
- outbox lag
- worker retry counts

### 23.3 Audit streams
Critical actions should be auditable:
- event mutations
- schedule mutations
- moderation actions
- registration transitions
- attendance transitions

### 23.4 Tracing/correlation
Where platform supports it, correlate:
- HTTP request
- DB transaction
- outbox event
- worker handling
- downstream projection refresh or notification

---

## 24. Failure Handling Strategy

Production Pulse must distinguish between:

### 24.1 Core write failure
Examples:
- invalid Atlas reference
- invalid lifecycle transition
- duplicate registration conflict
- unauthorized attendance verification
- event not registrable
- DB constraint failure

These should fail request immediately and clearly.

### 24.2 Downstream side-effect failure
Examples:
- notification publish failed
- search/index refresh delayed
- reward consumer unavailable
- social amplification failed

These must not roll back already committed Pulse truth if local transaction succeeded.

### 24.3 Upstream support dependency failure
Examples:
- Atlas validation timeout
- auth principal resolver unavailable
- RF organizer reference check unavailable if required for certain organizer modes

These need explicit policy:
- block when dependency is required for safe write;
- degrade gracefully when dependency is optional and not truth-critical.

---

## 25. Production Security Considerations

Pulse production design should assume sensitive workflow surfaces.

### Sensitive data classes
- unpublished events
- organizer operation surfaces
- registration data
- attendance data
- moderation notes
- internal projection endpoints

### Security baseline
- authenticated organizer/moderator routes
- policy enforcement
- no direct DB exposure
- minimal internal endpoint scope
- no leaking moderation/private operational data into public reads
- careful log redaction where needed
- no trust in client-supplied role assertions

### Special concern
Attendance and internal attendance validation routes should be treated as integrity-sensitive surfaces.

---

## 26. Performance and Scaling Direction

Pulse does not need premature over-distribution, but must scale sensibly because it may become a high-traffic workflow service.

### 26.1 Likely early hotspots
- public event list/detail reads
- city/place event lists
- registration endpoints
- organizer registration queues
- attendance check-in/verify endpoints
- moderation queue views
- internal attendance validation

### 26.2 Safe scaling levers
- read projections
- targeted read caching for public event surfaces
- worker separation
- query optimization/indexing
- denormalized organizer/user queue materializations

### 26.3 Unsafe scaling shortcuts
- letting RF/Quest/Space infer or own attendance truth
- moving event lifecycle logic into frontend
- embedding public feed assumptions into write truth
- skipping audit logging on critical participation flows

---

## 27. Indexing and Query Baseline

Production schema should plan indexes for common Pulse access patterns.

### Likely index groups
- events by slug/status/publication/visibility/type
- event schedules by event/start time/status
- venue refs by city/district/place/host place
- organizer refs by organizer kind/organizer ID/event
- registrations by event/user/status/registeredAt
- attendances by event/user/status/attendedAt/checkedInAt
- moderation cases by status/case type/reviewer/createdAt
- outbox by publish status/createdAt

Exact index set will follow implementation details, but production planning should assume these access paths.

---

## 28. Projection and Cache Freshness Rules

If Pulse uses projections or caches, production behavior should define freshness expectations.

### Strong consistency required
- event lifecycle truth
- registration truth
- attendance truth
- moderation action results
- internal validation responses

### Eventual consistency acceptable
- public event cards
- city/place event lists
- organizer dashboards if projection-based
- search indexes
- analytics dashboards
- social amplification side effects

This distinction is important because Pulse serves both workflow truth and public discovery surfaces.

---

## 29. Migration and Rollout Strategy

Pulse should ship in phases.

## 29.1 Phase A — canonical Pulse baseline
Required:
- events
- schedules
- venue refs
- organizer refs
- registrations
- attendances
- moderation basics
- public reads
- user registration/attendance surfaces
- internal event/attendance validation
- outbox scaffold

## 29.2 Phase B — operational hardening
Add:
- worker split
- richer moderation queues
- stronger organizer/user projections
- reminder and reconciliation jobs
- stronger audit views
- alerts and metrics dashboards

## 29.3 Phase C — ecosystem integration maturation
Add:
- cleaner Quest attendance adapters
- richer Guru event projections
- cleaner RF event-related organizer and offer context integrations
- stronger anomaly detection and operational analytics

The key is that Phase A must already be architecturally compatible with Phase B/C.

---

## 30. Production Readiness Checklist

A production-ready Pulse baseline should satisfy:

- Pulse owns all Pulse writes
- auth identity integration is live
- Atlas venue validation is live
- event publication is auditable
- registration lifecycle is auditable
- attendance lifecycle is auditable
- internal validation/projection endpoints are narrow and stable
- outbox exists or equivalent reliable event publishing exists
- public reads do not leak moderation/private organizer data
- downstream failures do not corrupt Pulse write truth
- no downstream domain can mutate Pulse truth directly

---

## 31. What Must Not Be Deferred Too Long

Some hardening can wait, but these should not be postponed excessively:

1. Atlas reference validation discipline
2. registration duplicate/conflict control
3. attendance audit trail
4. moderation/publication audit trail
5. outbox/reliable event publication
6. stable internal attendance validation contracts
7. explicit separation of registration and attendance truth

Deferring these too long would create real Pulse architecture debt.

---

## 32. What Can Start Simple

These areas may begin with simpler implementations if contracts remain clean:

- organizer projections may start query-driven
- worker may start as scheduled job
- public event caching may start light
- advanced anomaly detection may start as logs/metrics
- some downstream integrations may initially consume simple internal projections
- media refs may stay lightweight at first

The rule is:
**simple implementation is acceptable; wrong ownership is not.**

---

## 33. Service Extraction Readiness

Even if `pulse-service` is initially deployed inside a larger monorepo/platform runtime, its production architecture must make later extraction easy.

### Extraction-safe properties
- isolated DB schema ownership
- isolated API namespace
- isolated event names
- isolated application modules
- no foreign table writes
- no downstream service treating Pulse internal tables as contract

### Extraction warning signs
- RF or Quest keeps its own attendance truth
- frontend owns event lifecycle logic
- another service writes Pulse tables directly
- Pulse write transaction depends on downstream service success
- public feed artifacts are treated as canonical event truth

---

## 34. Production Non-Goals

This production architecture intentionally excludes:

- Atlas place management
- RF/business workflows
- offer/voucher runtime
- quest progression runtime
- listing/inquiry runtime
- social publication runtime
- reward/token/on-chain runtime
- platform-wide recommendation engine
- platform-wide search engine ownership

These may consume Pulse truth, but are not Pulse production ownership responsibilities.

---

## 35. Final Production Formula

The shortest correct production formula is:

> `pulse-service` should run in production as an independently owned workflow service with one authoritative Pulse write store, reliable outbox/event emission, auditable event/registration/attendance operations, Atlas-linked venue discipline, and narrow internal validation/projection boundaries for the rest of the ecosystem.

---

## 36. Most Important Conclusion

The right production architecture for Pulse is not:

- a thin calendar CRUD layer,
- nor a feed-only event list service,
- nor a social announcement backend,
- nor a simple RSVP table attached to frontend pages.

It is a real operational service that must already behave like production workflow infrastructure:

- canonical,
- auditable,
- attendance-safe,
- event-capable,
- Atlas-disciplined,
- and resistant to cross-domain ownership drift.

That is the correct production baseline for `pulse-service`.