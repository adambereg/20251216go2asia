# Pulse Service — Backend Architecture v1

**Project:** Go2Asia  
**Domain:** Pulse / Pulse Asia  
**Document role:** SSOT backend architecture for `pulse-service`  
**Status:** Draft v1  
**Purpose:** Define service boundary, internal structure, write/read responsibilities, storage model direction, integration rules, and implementation constraints for `pulse-service`.

---

## 1. Purpose

This document defines the backend architecture baseline for `pulse-service`.

`pulse-service` is the canonical backend bounded context for:

- event identity;
- event schedule;
- venue references to Atlas;
- organizer references;
- user registration / RSVP state;
- attendance truth;
- event moderation/publication workflows;
- internal event and attendance projections for downstream consumers.

This document translates the Pulse domain model and OpenAPI outline into service-level backend architecture.

It does **not** fully define runtime topology, deployment hardening, worker split, observability matrix, or rollout sequencing depth. Those belong to `pulse_service_production_architecture_v1.md`.

---

## 2. Architectural Role of `pulse-service`

`pulse-service` is the **system of record** for event lifecycle and attendance truth in Go2Asia.

It exists to provide one stable backend owner for:

- what event exists;
- when it happens;
- where it happens by reference to Atlas;
- who organizes it in event terms;
- whether a user registered;
- whether a user attended;
- which event state is current and canonical.

This service must not drift into becoming:

- a place/geo service;
- a partner/business service;
- a voucher service;
- a quest engine;
- a social feed service;
- a listing service;
- a wallet/token service;
- a global recommendation engine.

---

## 3. Service Boundary

## 3.1 What `pulse-service` owns

`pulse-service` owns the write model and source of truth for:

- `PulseEvent`
- `PulseEventSchedule`
- `PulseEventVenueRef`
- `PulseEventOrganizerRef`
- `PulseEventRegistration`
- `PulseEventAttendance`
- `PulseEventMediaRef`
- `PulseModerationCase`
- event publication state
- event registration state
- event attendance state
- event-level public/read projections
- internal event/attendance validation and projection logic

---

## 3.2 What `pulse-service` reads but does not own

`pulse-service` may read or validate external references to:

- Atlas geography/place IDs and place projections
- auth/user identity for creators, attendees, moderators, and organizers
- RF organizer references where event organizer is partner/branch-based
- media asset existence or metadata if media storage is externalized
- optional notification/reward/search infrastructure as downstream integrations

These are external references, not owned domain entities.

---

## 3.3 What `pulse-service` must never own

`pulse-service` must never become source of truth for:

- countries/cities/districts/places;
- partner/business presence;
- offers and vouchers;
- quest definitions/progression/proof truth;
- social posts/comments/groups;
- listing/property/inquiry truth;
- token balances, wallets, NFT state, on-chain bridge state;
- platform-wide search/ranking truth.

---

## 4. Architectural Style

`pulse-service` should be implemented as a modular service with:

- explicit domain layer;
- application/use-case layer;
- repository/data access layer;
- HTTP/interface layer;
- internal projection/validation layer;
- moderation/publication orchestration;
- optional event emission points for downstream consumers.

The preferred style is:

- bounded context first;
- modular monolith implementation for first production phase;
- extraction-safe internals;
- one clear write owner for Pulse truth;
- no direct table sharing with neighboring domains.

This means:

- Pulse owns Pulse writes;
- other services consume Pulse through APIs, projections, or events;
- no neighboring service writes Pulse tables directly.

---

## 5. Core Backend Responsibilities

The backend responsibilities of `pulse-service` are:

1. create/update/archive event identity objects;
2. manage schedule lifecycle and timing truth;
3. manage Atlas-linked venue references;
4. manage organizer references;
5. manage registration / RSVP lifecycle;
6. manage attendance lifecycle and verification;
7. manage moderation/publication workflows;
8. expose public event read surfaces;
9. expose user registration/attendance surfaces;
10. expose narrow internal event and attendance projections/validation surfaces.

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

- `modules/events`
- `modules/schedules`
- `modules/venues`
- `modules/organizers`
- `modules/registrations`
- `modules/attendances`
- `modules/media-refs`
- `modules/moderation`
- `modules/public-read`
- `modules/user-read`
- `modules/internal-projections`

This modular split is preferred over a flat controller/service/model directory.

---

## 7. Layer Responsibilities

## 7.1 Domain layer

Contains:

- entity definitions;
- aggregate boundaries;
- event lifecycle invariants;
- registration/attendance separation rules;
- schedule legality rules;
- venue reference rules;
- value objects and domain services where needed.

Examples:
- published event must have valid schedule;
- event must have canonical geo anchor by reference;
- registration is not attendance;
- attendance belongs to event and user only;
- cancelled event cannot accept new ordinary registrations.

The domain layer must not depend on HTTP or transport DTOs.

---

## 7.2 Application layer

Contains use cases and orchestration logic.

Examples:
- create event draft
- update event
- submit event for review
- publish event
- cancel event
- complete event
- create schedule
- register user
- approve registration
- check in attendance
- verify attendance
- reject event submission
- validate event reference
- validate attendance state

This layer coordinates:
- authorization preconditions
- repository access
- external reference validation
- transaction boundaries
- event emission where applicable

---

## 7.3 Infrastructure layer

Contains:

- ORM/data mapping;
- repository implementations;
- persistence schemas;
- id/slug generation helpers;
- internal projection builders;
- media reference persistence;
- moderation case persistence;
- optional outbox/event adapters.

---

## 7.4 Interface layer

Contains:

- HTTP handlers/controllers;
- OpenAPI request/response binding;
- auth context parsing;
- transport validation;
- internal service endpoints.

This layer should stay thin.

---

## 8. Aggregate Direction

Recommended aggregate direction for Pulse v1:

### `Event` aggregate
Owns:
- event root
- schedule linkage
- venue reference linkage
- organizer reference linkage
- publication/lifecycle state

### `Registration` aggregate
Owns:
- registration root
- registration lifecycle transitions

### `Attendance` aggregate
Owns:
- attendance root
- check-in / verification / no-show / revoke lifecycle

### `ModerationCase` aggregate
Owns:
- review / flag / suspension workflow support

### `MediaRef` aggregate or support record
Owns:
- semantic linkage of media to event

The key rule is to keep aggregates small enough for transactional correctness without collapsing all event-related truths into one giant aggregate.

---

## 9. Write Model Principles

## 9.1 Single writer rule

Only `pulse-service` may mutate Pulse-owned records.

No other service should write Pulse tables directly.

---

## 9.2 Explicit lifecycle transitions

State changes must be represented by explicit application actions, not arbitrary field patching.

Examples:
- submit for review
- publish
- cancel
- complete
- archive
- approve registration
- reject registration
- waitlist registration
- check in attendance
- verify attendance
- revoke attendance

---

## 9.3 Transaction discipline

A single Pulse mutation should commit within one local DB transaction where possible.

Examples:
- register user + write registration audit support if needed
- verify attendance + write attendance state + log/outbox record
- publish event + set publish timestamps + enqueue outbox event
- cancel event + update event state + close relevant registration behavior

Cross-domain updates must not be done as distributed write transactions.

---

## 10. Read Model Principles

`pulse-service` should support separate read projections for:

- public event cards
- public place-scoped and city-scoped event lists
- user registration list
- user attendance list
- organizer event dashboards
- organizer registration queue
- organizer attendance dashboard
- moderation queue
- internal event and attendance projections

The write model remains normalized.  
Read models may be denormalized for performance and clarity.

---

## 11. Storage Model Direction

The persistence layer should use relational storage as the primary system of record.

Recommended high-level tables:

- `pulse_events`
- `pulse_event_schedules`
- `pulse_event_venue_refs`
- `pulse_event_organizer_refs`
- `pulse_event_registrations`
- `pulse_event_attendances`
- `pulse_event_media_refs`
- `pulse_moderation_cases`

Optional later read/projection tables:

- `pulse_public_event_cards`
- `pulse_city_event_cards`
- `pulse_place_event_cards`
- `pulse_user_registrations`
- `pulse_user_attendances`
- `pulse_organizer_registration_queue`
- `pulse_organizer_attendance_queue`
- `pulse_internal_event_projections`

---

## 12. Table-Level Intent

## 12.1 `pulse_events`

Stores canonical event roots.

Core concerns:
- slug/title/type
- lifecycle state
- publication state
- visibility and participation modes
- creator identity
- high-level geo references if duplicated for convenience

---

## 12.2 `pulse_event_schedules`

Stores canonical time windows for events.

Core concerns:
- event linkage
- start/end datetime
- timezone
- schedule state

---

## 12.3 `pulse_event_venue_refs`

Stores Atlas-linked venue references.

Core concerns:
- event linkage
- country/city/district references
- `atlas_place_id`
- `host_atlas_place_id`
- local positioning metadata

---

## 12.4 `pulse_event_organizer_refs`

Stores organizer linkage.

Core concerns:
- event linkage
- organizer kind
- organizer ID
- display snapshot if needed
- active/inactive state

---

## 12.5 `pulse_event_registrations`

Stores registration / RSVP truth.

Core concerns:
- event linkage
- user linkage
- registration lifecycle
- source
- timestamps for register/approve/cancel

---

## 12.6 `pulse_event_attendances`

Stores attendance truth.

Core concerns:
- event linkage
- user linkage
- optional registration linkage
- attendance status
- verifier metadata
- check-in/attended timestamps

---

## 12.7 `pulse_event_media_refs`

Stores semantic media linkage.

Core concerns:
- event linkage
- media key
- media kind
- sort order

---

## 12.8 `pulse_moderation_cases`

Stores moderation/review support.

Core concerns:
- event linkage
- case type
- reviewer
- status
- reason note
- timestamps

---

## 13. Event and Schedule Architecture Rules

Pulse must keep event identity and timing distinct.

### Event identity rule
Event must have one canonical event record.

### Schedule rule
Schedule rows belong to one event and represent time truth, not event identity.

### Published event rule
A published/scheduled event must have a valid current schedule.

### Time legality rule
`ends_at`, if present, must not be earlier than `starts_at`.

### Backend implication
Do not collapse event and schedule into one inseparable record if that would make rescheduling or schedule-specific lifecycle awkward.

---

## 14. Venue and Atlas Integration Boundary

Atlas is the source of truth for geo and place identity.

`pulse-service` may:

- store Atlas IDs;
- validate that referenced country/city/district/place IDs exist;
- expose those IDs in Pulse responses;
- derive public read projections enriched with Atlas display data if needed.

`pulse-service` must not:

- create or mutate Atlas places;
- store its own alternative place truth as canonical;
- become a geo resolver for the platform.

### Backend implication

Event create/update flows should validate venue references through:
- synchronous internal Atlas validation API, or
- cached Atlas projections, or
- prevalidated reference adapter.

The validation mechanism may evolve, but ownership must remain with Atlas.

---

## 15. Venue Reference Architecture Rules

A published event must have a canonical geo anchor.

Accepted patterns:

### Pattern A — standalone place
- `atlasPlaceId` present

### Pattern B — host/container place
- `hostAtlasPlaceId` present
- optional `unit`, `floor`, `zone`, `landmarkNote`

### Pattern C — dual reference
- both `atlasPlaceId` and `hostAtlasPlaceId` present

### Backend implication
Event write validators must enforce:
- no publish without geo anchor;
- no invalid place/host place combination;
- no event scheduling/publication with broken Atlas references.

---

## 16. Organizer Architecture Boundary

Pulse may store organizer references but does not own organizer truth when external.

Allowed organizer kinds:
- user
- RF partner
- RF branch
- external
- system

### Backend implication
Organizer linkage should be modeled as a reference/support record.  
If organizer kind is RF-based, RF remains the source of truth for that actor.

Pulse must not absorb RF partner/branch lifecycle into its own write model.

---

## 17. Registration Architecture

Registration handling is one of the most important Pulse backend responsibilities.

### Registration responsibilities
- create registration / RSVP
- enforce registration mode rules
- support pending/approval/waitlist/cancel/reject transitions
- prevent invalid duplicate active registrations where policy forbids them
- expose user and organizer registration projections

### Backend rule
Registration logic should live in a dedicated module/service inside Pulse, not be spread across event handlers.

### Key distinction
Registration is participation intent/admission state, not attendance truth.

---

## 18. Attendance Architecture

Attendance handling is the other critical Pulse backend responsibility.

### Attendance responsibilities
- create checked-in records
- verify attended state
- mark no-show
- revoke attendance where policy allows
- preserve verifier metadata and timestamps
- expose internal validation for authorized downstream integrations

### Backend rule
Attendance logic should remain in a dedicated module/service and must not be hidden inside general event update code.

### Key distinction
Attendance is canonical event participation truth and must remain Pulse-owned.

---

## 19. Registration vs Attendance Separation

This separation must be explicit in backend design.

### Registration answers
- did the user register?
- was the registration approved?
- was the user waitlisted or rejected?

### Attendance answers
- did the user actually appear/check in/attend?
- was attendance verified or revoked?

### Forbidden drift
Do not model attendance as a flag on registration.  
Do not let downstream services infer attendance truth from registration alone.

---

## 20. Moderation and Publication Architecture

Pulse moderation is not optional.

Recommended moderation backend capabilities:

- queue pending event reviews
- publish/reject/flag/suspend eligible events
- record reviewer action
- store reason notes
- keep audit timestamps
- separate moderation/review support from ordinary event editing

### Important distinction
Event lifecycle state and publication state are not the same thing.

An event can be:
- draft and hidden
- scheduled and published
- cancelled but still visible as cancelled
- archived and no longer operational

These states should not be flattened into a single boolean.

---

## 21. User Identity Dependency

`pulse-service` depends on external auth/user identity for:

- current authenticated actor
- event creator identity
- user registrations
- attendance user identity
- moderator/admin identity in audit trails
- organizer identity when organizer kind is user

Pulse should treat user identity as an external principal, not as a locally owned user table.

Minimal cached display hints are acceptable if needed, but not as identity source of truth.

---

## 22. Authorization Model in Backend

Authorization should be enforced in the application layer via explicit policy checks.

Recommended policy dimensions:

- actor type
- event creator / organizer relationship
- moderator/admin privilege
- registration ownership for user self-service
- attendance verification scope
- event lifecycle gates

Examples:
- only organizer/admin can update event draft
- only moderator/admin can publish or reject
- only current user can cancel own registration unless admin path is used
- only authorized organizer/admin can verify attendance
- internal service may read attendance validation only through narrow contracts

Do not rely solely on route-level coarse auth.

---

## 23. Internal Projection Architecture

Pulse should provide narrow internal projections for safe cross-service consumption.

Recommended projection families:

- event minimal projection
- attendance minimal projection
- attendance summary
- event validation result

These projections should:
- be narrow;
- be stable;
- contain only fields necessary for downstream use;
- avoid exposing raw table shape.

Examples:
- RF checks event existence for event-related offer context
- Quest validates attendance condition
- Guru consumes public/internal event card projections

---

## 24. Quest Integration Boundary

Quest owns progression and completion truth.

`pulse-service` may:
- validate event existence/state;
- validate attendance status through narrow internal contracts;
- emit attendance-related events for downstream logic.

`pulse-service` must not:
- store quest completion state;
- become a quest rules engine;
- duplicate progression truth.

### Backend implication
Quest-related dependencies should be expressed via explicit internal validation or event consumption, not shared ownership.

---

## 25. RF Integration Boundary

RF owns partner/business presence, offers, and vouchers.

`pulse-service` may:
- reference RF actor as organizer;
- be referenced by RF offers/vouchers through `relatedPulseEventId`;
- emit event/attendance facts that RF may react to downstream where policy allows.

`pulse-service` must not:
- own partner profile truth;
- own voucher lifecycle;
- embed RF offer/business logic in Pulse write model.

### Backend implication
Keep organizer reference externalized and event-related voucher logic out of Pulse core ownership.

---

## 26. Space Integration Boundary

Space owns social publication and distribution.

`pulse-service` may:
- expose public event objects that Space may share;
- emit publication signals for downstream social amplification.

`pulse-service` must not:
- own posts/comments/groups;
- store social circulation state as canonical event truth.

### Backend implication
If social amplification exists, it should be event-driven or API-driven, not embedded in Pulse aggregates.

---

## 27. Guru Integration Boundary

Guru is a read/composition layer.

`pulse-service` may:
- expose event cards
- expose place/city scoped event lists
- expose internal/public projections

`pulse-service` must not:
- become a nearby ranking engine;
- own recommendation logic.

### Backend implication
Provide narrow projection endpoints or event-fed read models, not generalized recommendation orchestration.

---

## 28. Rielt Integration Boundary

Rielt owns listing/inquiry/property truth.

`pulse-service` may:
- host events related to projects, condos, open houses, or investment meetups;
- reference Atlas place and external organizer context relevant to Rielt.

`pulse-service` must not:
- own listing inventory;
- own inquiry lifecycle;
- absorb Rielt business logic into event truth.

### Backend implication
Use stable references and keep bounded contexts separate.

---

## 29. Search and Filtering Direction

Pulse should support structured filtering in-service.

Allowed in-service filtering:
- event status / publication status / visibility
- event type
- country/city/district/place
- time window
- registration status
- attendance status

Pulse should avoid building platform-wide fuzzy search ownership inside the service.

If richer search is needed later, it should rely on dedicated search projections or platform search infrastructure.

---

## 30. Validation Strategy

Validation should occur at multiple layers.

### Transport validation
- shape
- required fields
- enum membership
- datetime format sanity

### Application validation
- Atlas reference validity
- organizer permission
- event existence
- lifecycle transition legality
- registration mode constraints
- attendance action legality

### Domain validation
- invariant enforcement
- published event schedule requirement
- registration/attendance separation
- no illegal state regression
- event venue coherence

Do not place all validation in controllers.

---

## 31. Caching Direction

Caching may be used for read-heavy Pulse projections, but never as source of truth.

Safe cache candidates:
- public event cards
- city/place event lists
- public schedule projections
- internal minimal event projections

Unsafe cache ownership:
- registration truth
- attendance truth
- publication/moderation truth
- authorization decisions for organizer actions

Critical participation and moderation decisions must read authoritative state.

---

## 32. Event Direction

Pulse may emit domain events for downstream consumers.

Suggested event families:

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

### Architectural recommendation
Use transactional outbox or equivalent reliable delivery mechanism later in production architecture.  
Backend architecture should already leave clear event emission points.

---

## 33. Error Handling Direction

Backend should expose stable Pulse-specific error codes.

Examples:
- `PULSE_EVENT_NOT_FOUND`
- `PULSE_SCHEDULE_NOT_FOUND`
- `PULSE_REGISTRATION_NOT_FOUND`
- `PULSE_ATTENDANCE_NOT_FOUND`
- `PULSE_INVALID_ATLAS_REFERENCE`
- `PULSE_EVENT_NOT_REGISTRABLE`
- `PULSE_REGISTRATION_ALREADY_EXISTS`
- `PULSE_ATTENDANCE_INVALID`
- `PULSE_EVENT_CANCELLED`
- `PULSE_MODERATION_REQUIRED`

Internally, error categories should distinguish:
- validation errors
- authorization errors
- lifecycle/invariant errors
- not found errors
- external dependency validation issues
- infrastructure failures

---

## 34. Observability Hooks at Backend Level

Detailed production observability belongs in the production architecture doc, but backend design should already include structured emit points for:

- event mutation audit logs
- moderation actions
- registration transitions
- attendance transitions
- external Atlas validation failures
- event emission attempts/failures

This allows later production hardening without redesigning core flows.

---

## 35. Extraction-Safe Design Rules

Even if Pulse begins inside a larger monorepo/runtime, its backend architecture must remain extraction-safe.

Required properties:
- clear module boundaries
- no direct table sharing with neighboring domains
- APIs/projections/events for external access
- no leakage of Atlas/RF/Quest/Rielt/Space truth into Pulse write ownership
- no business logic hidden in UI/frontend

This is essential because Pulse is a likely high-traffic workflow service.

---

## 36. Recommended First Backend Implementation Cut

The minimum viable backend cut for Pulse should include:

### Core write modules
- events
- schedules
- venues
- organizers
- registrations
- attendances
- moderation

### Important optional/next modules
- media-refs
- richer organizer support projections

### Required read surfaces
- public events
- public city/place event lists
- user registrations
- user attendances
- organizer registration list
- organizer attendance list
- internal event projection
- internal event validation
- internal attendance validation

### Required integration basics
- auth principal resolution
- Atlas reference validation
- stable slug/ID handling
- lifecycle transition scaffold
- moderation lifecycle scaffold

---

## 37. What Must Stay Out of `pulse-service`

To prevent scope drift, keep these out:

- place management
- partner/business workflows
- offer/voucher lifecycle
- quest progression/proof logic
- listing/inquiry engine
- social publication workflows
- wallet/token/on-chain logic
- recommendation/ranking ownership
- platform-wide search ownership

These may integrate with Pulse, but are not Pulse backend responsibilities.

---

## 38. Final Backend Formula

The shortest correct backend formula is:

> `pulse-service` is the backend system of record for event identity, schedule, registration, and attendance.  
> It owns Pulse writes, exposes Pulse read projections, validates Atlas-linked venue references, and remains extraction-safe by refusing shared ownership.

---

## 39. Most Important Conclusion

The correct backend implementation of Pulse is not a calendar feed API and not a social announcement wrapper.

It is a proper bounded backend context that:

- owns event truth;
- owns registration truth;
- owns attendance truth;
- enforces Atlas-linked venue discipline;
- separates identity from participation state;
- supports RF / Quest / Guru / Space / Rielt through clean references and projections;
- avoids becoming a god-service.

That is the correct backend baseline for `pulse-service`.