# Pulse Service — Domain Model v1

**Project:** Go2Asia  
**Domain:** Pulse / Pulse Asia  
**Document role:** SSOT domain model for `pulse-service`  
**Status:** Draft v1  
**Purpose:** Define the canonical Pulse domain boundary, entities, relationships, invariants, and lifecycle rules before OpenAPI and implementation alignment.

---

## 1. Purpose

This document defines the canonical domain model for `pulse-service`.

`pulse-service` is the **event and attendance truth domain** of Go2Asia.

Pulse is the domain that answers:

- what event exists in the ecosystem;
- when it happens;
- where it happens;
- who organizes or hosts it in event terms;
- whether users can register, RSVP, or attend;
- what the lifecycle state of the event is;
- what the canonical attendance/registration truth is for other services.

Pulse is not merely a calendar frontend and not merely a content feed.  
It is the **system of record for event identity, schedule, registration, and attendance lifecycle** across the ecosystem.

This document establishes Pulse as the canonical event substrate that other domains reference but do not own.

---

## 2. Architectural Role of Pulse

Pulse is the canonical event bounded context of Go2Asia.

In product terms, Pulse provides the time-bound activity layer that the rest of the ecosystem depends on.

Pulse makes it possible for other modules to answer questions such as:

- what events are happening in a city or place;
- when does the event start and end;
- is this event published, cancelled, completed, or archived;
- can a user register or RSVP;
- did a user attend;
- which place is the canonical venue reference for this event;
- what event should RF, Quest, Guru, Atlas, or Space refer to?

### 2.1 Pulse is

Pulse is:

- the owner of event identity;
- the owner of event schedule and timing;
- the owner of event lifecycle state;
- the owner of event registration / RSVP / attendance truth;
- the owner of event-facing publication status;
- the owner of organizer-facing and attendee-facing event workflows;
- the canonical event substrate for the platform.

### 2.2 Pulse is not

Pulse is not:

- the owner of canonical place identity;
- the owner of partner/business presence;
- the owner of voucher lifecycle;
- the owner of quest progression;
- the owner of real-estate listing truth;
- the owner of social posts as platform truth;
- the owner of balances, tokens, or on-chain logic;
- the owner of platform-wide ranking/recommendation truth.

Other domains remain responsible for their own truth:

- Atlas owns geography and place identity.
- RF owns partner/business presence, offers, and vouchers.
- Quest owns progression/proof.
- Rielt owns listing/property truth.
- Space owns social publication/distribution.
- Points owns reward ledger logic.

Pulse may reference these domains, but must not absorb their ownership.

---

## 3. Domain Boundary

## 3.1 What `pulse-service` owns

`pulse-service` owns:

- event records;
- event schedule and date/time truth;
- event status and publication state;
- event visibility and registration mode;
- organizer-facing event management lifecycle;
- user registration / RSVP records;
- attendance records and attendance status;
- event moderation/review state where applicable;
- event media/content references attached to event truth;
- event-level public read projections;
- internal event projections for downstream services.

---

## 3.2 What `pulse-service` does not own

`pulse-service` does not own:

- countries, cities, districts, places;
- partner branches and business lines;
- offers and vouchers;
- quest progression and proof logic;
- social posts/comments/groups;
- listing inventory and inquiry flows;
- wallet/balance/token/on-chain state;
- recommendation/ranking ownership;
- generic geo-service logic.

---

## 3.3 Pulse as reference domain

Pulse is primarily a **reference domain for events**.

This means other domains should typically use Pulse IDs as references instead of creating their own parallel event identities.

Examples:

- RF offer may reference `relatedPulseEventId`
- Quest may reference `pulseEventId` as target/condition context
- Space may share or comment around a Pulse event
- Guru may consume Pulse event cards
- Atlas place pages may surface Pulse events happening there

Pulse owns the event.  
Other services may contextualize it, but do not replace it.

---

## 4. Core Domain Concepts

## 4.1 Event vs place

Pulse must distinguish clearly between **event identity** and **place identity**.

Atlas answers:
- what place is this?

Pulse answers:
- what event is happening here?
- when does it happen?
- can users register?
- who attended?
- what is the event lifecycle state?

A place is not an event.  
An event references a place, but does not own place truth.

---

## 4.2 Event vs social post

Pulse must distinguish between an event and any social circulation around it.

An event may be:
- announced in Space;
- discussed in Space;
- reposted or commented on by users.

But the event itself remains a Pulse-owned object, not a Space-owned social object.

---

## 4.3 Event vs offer/voucher

Pulse must distinguish between:
- the event as a scheduled activity;
- an RF offer or voucher related to the event.

An offer may be event-related.  
A voucher may be claimable or redeemable because of event context.  
But Pulse does not own offer or voucher lifecycle.

---

## 4.4 Registration vs attendance

Pulse must distinguish between:

- interest / RSVP / registration intent;
- actual attendance truth.

A user may:
- register but not attend;
- attend after registration;
- attend under a different validation flow if policy allows.

This distinction is essential because Quest, RF, and rewards may depend on attendance-related facts without owning them.

---

## 5. Canonical Entity Set

The recommended canonical Pulse entity set is:

- `PulseEvent`
- `PulseEventSchedule`
- `PulseEventVenueRef`
- `PulseEventOrganizerRef`
- `PulseEventRegistration`
- `PulseEventAttendance`
- `PulseEventMediaRef`
- `PulseModerationCase`
- `PulseEventTag` (supporting)

These entities provide the minimal domain foundation for Pulse as a platform event service.

---

## 6. Entity Definitions

## 6.1 `PulseEvent`

Represents a canonical event identity.

### Purpose
Acts as the top-level event object used across the ecosystem.

### Core fields
- `id`
- `slug`
- `title`
- `subtitle` optional
- `summary` optional
- `description_full` optional
- `event_type`
- `status`
- `publication_status`
- `visibility`
- `registration_mode`
- `attendance_mode`
- `country_id`
- `city_id`
- `district_id` optional
- `atlas_place_id` optional
- `host_atlas_place_id` optional
- `primary_schedule_id` optional
- `created_by_user_id`
- `created_at`
- `updated_at`
- `published_at` optional

### Status direction
- `draft`
- `scheduled`
- `cancelled`
- `completed`
- `archived`

### Publication direction
- `hidden`
- `published`

### Visibility direction
- `public`
- `private`
- `invite_only`

### Registration mode direction
- `open`
- `approval_required`
- `closed`
- `external_only`

### Attendance mode direction
- `manual`
- `verified`
- `external`
- `none`

### Notes
Event identity is separate from schedule row(s), separate from venue truth, and separate from attendance records.

---

## 6.2 `PulseEventSchedule`

Represents the time window or occurrence schedule of an event.

### Purpose
Stores canonical timing truth for the event.

### Core fields
- `id`
- `event_id`
- `starts_at`
- `ends_at` optional
- `timezone`
- `all_day`
- `schedule_status`
- `created_at`
- `updated_at`

### Schedule status direction
- `active`
- `rescheduled`
- `cancelled`

### Notes
A simple v1 event may use one primary schedule.  
The model still keeps schedule separate so Pulse does not collapse identity and timing into one inseparable blob.

---

## 6.3 `PulseEventVenueRef`

Represents the event’s canonical venue reference to Atlas.

### Purpose
Links the event to Atlas geo/place truth without making Pulse the owner of venue identity.

### Core fields
- `id`
- `event_id`
- `country_id`
- `city_id`
- `district_id` optional
- `atlas_place_id` optional
- `host_atlas_place_id` optional
- `address_text` optional
- `unit` optional
- `floor` optional
- `zone` optional
- `landmark_note` optional
- `created_at`
- `updated_at`

### Notes
Venue reference may represent:
- a standalone place;
- a place inside host/container place;
- a normalized place plus local positioning metadata.

This is important for malls, resorts, markets, condos, festivals, and multi-use venues across SEA.

---

## 6.4 `PulseEventOrganizerRef`

Represents the organizer/host relationship for the event.

### Purpose
Connects event ownership/hosting context to user or business actors without transferring external truth into Pulse.

### Core fields
- `id`
- `event_id`
- `organizer_kind`
- `organizer_id`
- `display_name_snapshot` optional
- `status`
- `created_at`
- `updated_at`

### Organizer kind direction
- `user`
- `rf_partner`
- `rf_branch`
- `external`
- `system`

### Status direction
- `active`
- `inactive`

### Notes
Pulse may reference RF actors as organizers, but Pulse does not own RF partner/branch truth.

---

## 6.5 `PulseEventRegistration`

Represents a user’s registration or RSVP state for an event.

### Purpose
Stores event participation intent and registration workflow truth.

### Core fields
- `id`
- `event_id`
- `user_id`
- `status`
- `source`
- `registered_at`
- `approved_at` optional
- `cancelled_at` optional
- `created_at`
- `updated_at`

### Status direction
- `pending`
- `registered`
- `waitlisted`
- `cancelled`
- `rejected`

### Source direction
- `direct`
- `invite`
- `partner_flow`
- `external_sync`

### Notes
Registration is not attendance.  
This entity records intent/admission state, not proof of presence.

---

## 6.6 `PulseEventAttendance`

Represents canonical attendance truth for a user and event.

### Purpose
Stores whether and how a user actually attended.

### Core fields
- `id`
- `event_id`
- `user_id`
- `registration_id` optional
- `status`
- `attendance_verified_by_kind` optional
- `attendance_verified_by_id` optional
- `attended_at` optional
- `checked_in_at` optional
- `created_at`
- `updated_at`

### Status direction
- `not_attended`
- `checked_in`
- `attended`
- `no_show`
- `revoked`

### Attendance verified by kind
- `system`
- `organizer`
- `rf_operator`
- `admin`
- `external`

### Notes
Quest, RF, and rewards may depend on attendance-related facts, but Pulse owns attendance truth.

---

## 6.7 `PulseEventMediaRef`

Represents semantic media linkage for an event.

### Purpose
Supports hero/gallery/media usage without making Pulse the binary storage service itself.

### Core fields
- `id`
- `event_id`
- `media_kind`
- `media_key`
- `sort_order`
- `status`
- `created_at`

### Notes
Pulse may own semantic event-media linkage while relying on external media infrastructure for storage and delivery.

---

## 6.8 `PulseModerationCase`

Represents moderation/review support for event publication and integrity workflows.

### Purpose
Supports review lifecycle for events and related publication decisions.

### Core fields
- `id`
- `event_id`
- `case_type`
- `status`
- `reviewer_user_id` optional
- `reason_note` optional
- `created_at`
- `updated_at`
- `resolved_at` optional

### Case type direction
- `review`
- `flag`
- `suspension`
- `verification`

### Status direction
- `open`
- `in_review`
- `resolved`
- `rejected`

---

## 6.9 `PulseEventTag`

Represents lightweight categorization for events.

### Purpose
Supports structured discovery without turning Pulse into a free-form taxonomy chaos.

### Core fields
- `id`
- `event_id`
- `tag_code`
- `created_at`

### Notes
Tags may help with:
- family
- expat
- networking
- business
- kids
- wellness
- nightlife
- sport

This is helpful for discovery but should remain lightweight in v1.

---

## 7. Event Identity and Schedule Rules

The primary event model is:

- one `PulseEvent`
- one or more `PulseEventSchedule` rows if needed
- one canonical current/primary schedule for ordinary usage

### 7.1 Event identity rule
An event must have one canonical event record.

### 7.2 Schedule anchoring rule
A published/scheduled event must have at least one valid schedule.

### 7.3 Time coherence rule
`ends_at`, if present, must not be earlier than `starts_at`.

### 7.4 Lifecycle rule
An event may exist in draft before publication and before registrations begin.

---

## 8. Venue and Atlas Relationship Rules

Pulse must reference Atlas as geo/place truth.

## 8.1 Standalone venue pattern
Use:
- `atlas_place_id`

When the event occurs at a specific standalone place.

## 8.2 Host/container venue pattern
Use:
- `host_atlas_place_id`
plus optional local positioning metadata.

When the event occurs:
- inside mall
- inside resort
- inside condo complex
- inside market
- inside large venue/campus

## 8.3 Dual reference pattern
Allow both:
- `atlas_place_id`
- `host_atlas_place_id`

When the event occurs at a meaningful sub-place inside a larger host place.

### Domain rule
Pulse must not invent canonical place truth.  
At least one canonical geo anchor must exist for a published event:
- `atlas_place_id`, or
- `host_atlas_place_id`, or
- approved normalized fallback strategy during transition.

---

## 9. Organizer Reference Rules

Pulse may link an event to organizer/host context, but must not absorb ownership of those domains.

### Allowed organizer kinds
- user
- RF partner
- RF branch
- external organizer
- system/curated platform owner

### Domain rule
Organizer reference is linkage/context only.  
If organizer kind is RF-based, RF remains source of truth for that actor.

---

## 10. Registration Model

Pulse must support registration intent separately from attendance.

### Domain rule
Registration answers:
- did the user register / RSVP / get approved?

It does not answer:
- did the user actually attend?

### Registration scenarios
- open registration
- approval-required registration
- invite-only registration
- external registration synced back as reference state

### Registration invariants
- one user should not have conflicting simultaneous active registrations for the same event under the same participation policy;
- cancelled registration is not active;
- rejected registration is terminal unless explicitly recreated.

---

## 11. Attendance Model

Pulse must support attendance as canonical event participation truth.

### Domain rule
Attendance answers:
- did the user attend?
- was attendance checked in or verified?
- what is the final attendance state?

### Attendance scenarios
- user registered and attended;
- user registered but was no-show;
- user checked in but final attendance was revoked/invalidated;
- attendance came from organizer/manual verification;
- attendance came from external system integration.

### Attendance invariants
- attendance belongs to exactly one event and one user;
- attendance may optionally link to one registration;
- attendance truth must not be owned by Quest, RF, or Space.

---

## 12. Event Lifecycle Model

Pulse must maintain explicit lifecycle semantics.

### Event lifecycle states
- `draft`
- `scheduled`
- `cancelled`
- `completed`
- `archived`

### Publication lifecycle
- `hidden`
- `published`

### Registration lifecycle
Independent from event lifecycle, but constrained by it.

Examples:
- draft event should not accept public registration;
- cancelled event should not accept new registration;
- completed event should not transition back to ordinary scheduled state without explicit administrative rescheduling flow.

---

## 13. Event Content and Media

Pulse may contain event-facing descriptive payload and semantic media references, but must not become a generic CMS for all domains.

### Allowed Pulse content scope
- event title
- subtitle
- summary
- full description
- event-specific media refs
- event tags
- event schedule and venue info

### Forbidden drift
Pulse must not absorb:
- full Atlas place guide ownership;
- Space post ownership;
- RF partner profile ownership.

---

## 14. Pulse and Atlas Relationship

Atlas depends are reversed here: Pulse depends on Atlas.

### Atlas owns
- country/city/district/place identity
- place hierarchy
- host/container semantics

### Pulse owns
- event identity
- event schedule
- registration
- attendance

### Allowed relation
Pulse stores Atlas references such as:
- `countryId`
- `cityId`
- `districtId`
- `atlasPlaceId`
- `hostAtlasPlaceId`

### Forbidden drift
Pulse must not create its own canonical place system.

---

## 15. Pulse and RF Relationship

RF and Pulse are strongly adjacent but must remain separate.

### Pulse owns
- event truth
- registration truth
- attendance truth

### RF owns
- partner/business presence
- branch truth
- offers
- vouchers

### Allowed relation
- RF partner/branch may be referenced as organizer context
- RF offer/voucher may reference `relatedPulseEventId`

### Forbidden drift
- Pulse must not own voucher lifecycle
- RF must not own event lifecycle or attendance truth

This separation is especially important for event-related offers and event-hosted partner scenarios.

---

## 16. Pulse and Quest Relationship

Quest may depend on event or attendance context, but must not own it.

### Pulse owns
- event truth
- attendance truth

### Quest owns
- quest definitions
- progression
- completion
- proof logic

### Allowed relation
Quest may reference:
- `pulseEventId`
- attendance-derived conditions
- event completion context

### Forbidden drift
Quest must not become source of truth for attendance or event lifecycle.

---

## 17. Pulse and Space Relationship

Space may socially circulate events, but must not own them.

### Allowed patterns
- share event page
- discuss event
- repost event announcement
- attach commentary to event context

### Forbidden pattern
Space must not become source of truth for event identity, schedule, or attendance.

---

## 18. Pulse and Guru Relationship

Guru is a read/composition layer and strongly depends on Pulse.

### Pulse provides
- event cards
- event schedule
- event venue references
- event public visibility state

### Guru consumes
- nearby event projections
- time-aware event context
- place + event composition

### Forbidden drift
Guru must not own canonical event identity or recommendation-backed fake event truth.

---

## 19. Pulse and Rielt Relationship

Rielt may intersect with Pulse through:
- open houses
- investment meetups
- condo/project events
- real-estate partner events

### Pulse owns
- event lifecycle

### Rielt owns
- listing/property truth
- inquiry flow
- commercial real-estate domain logic

### Allowed relation
Rielt-related actors or places may be referenced in event context.

### Forbidden drift
Pulse must not absorb listing/inquiry truth.

---

## 20. Domain Invariants

The following invariants are mandatory.

### 20.1 Event invariant
Event slug must be unique under the chosen uniqueness strategy.

### 20.2 Schedule invariant
Schedule must belong to exactly one event.

### 20.3 Venue invariant
Published event must have canonical geo anchor.

### 20.4 Organizer invariant
Organizer reference must belong to exactly one event.

### 20.5 Registration invariant
Registration must belong to exactly one event and one user.

### 20.6 Attendance invariant
Attendance must belong to exactly one event and one user.

### 20.7 Attendance ownership invariant
Attendance truth must remain Pulse-owned even when downstream systems consume it.

### 20.8 Publication invariant
Published public event must reference complete enough canonical event identity and schedule state.

### 20.9 Registration coherence invariant
A cancelled or archived event cannot accept new ordinary registrations.

### 20.10 Attendance coherence invariant
Attendance should not be marked as valid if event lifecycle/state makes that impossible under policy.

---

## 21. Read Model Direction

Pulse write truth should remain normalized around:

- event
- schedule
- venue reference
- organizer reference
- registration
- attendance

Read models may later project:

- event cards
- event calendar items
- place event lists
- user registration items
- user attendance items
- organizer event dashboard items
- Guru-ready nearby event projections

These are read conveniences only.  
They do not redefine Pulse ownership.

---

## 22. Pulse as Canonical Event Layer

The shortest correct formula for Pulse is:

> Pulse is the canonical event, registration, and attendance domain of Go2Asia.

This means Pulse should be treated by the ecosystem as:

- stable ID authority for events;
- canonical owner of event schedule and lifecycle;
- canonical owner of registration/RSVP truth;
- canonical owner of attendance truth;
- owner of event-facing publication state.

---

## 23. Non-Goals for v1

This v1 Pulse domain model intentionally does **not** introduce:

- partner/business truth;
- offer/voucher lifecycle;
- quest progression truth;
- listing/inquiry truth;
- social truth;
- generic graph database for all modules;
- platform-wide recommendation ownership;
- wallet/token ownership;
- geo/place ownership.

Pulse may support these domains through references, but must not absorb them.

---

## 24. Final Domain Formula

The shortest correct domain formula for Pulse is:

> **Pulse is the event and attendance truth domain of Go2Asia.**  
> It owns events, schedules, venue references, organizer references, registration state, and attendance state.  
> Other services reference Pulse events; they do not replace Pulse as the owner of event lifecycle or attendance truth.

---

## 25. Most Important Conclusion

Pulse must not be implemented as:

- only a calendar UI backend,
- only a feed of event cards,
- only a social announcement stream,
- or a thin metadata wrapper around places.

Pulse must be implemented as a real bounded context with:

- canonical event identity;
- canonical event schedule;
- canonical registration truth;
- canonical attendance truth;
- Atlas-linked venue discipline;
- clean separation from RF, Quest, Space, and Rielt ownership.

That is the correct domain baseline for `pulse-service`.