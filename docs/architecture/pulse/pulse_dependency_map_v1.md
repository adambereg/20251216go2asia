# Pulse Service — Dependency Map v1

**Project:** Go2Asia  
**Domain:** Pulse / Pulse Asia  
**Document role:** SSOT dependency map for `pulse-service`  
**Status:** Draft v1  
**Purpose:** Define upstream dependencies, downstream consumers, ownership boundaries, read/write contracts, and forbidden dependency patterns for `pulse-service`.

---

## 1. Purpose

This document defines the dependency map around `pulse-service`.

Its goal is to make the following unambiguous:

- what `pulse-service` depends on;
- what depends on `pulse-service`;
- which dependencies are read-only;
- which dependencies are write-forbidden;
- where Pulse is authoritative;
- where Pulse is only a consumer of support inputs;
- where ownership transfer is forbidden.

This document is not a deployment diagram.  
It is a domain-boundary and service-dependency document.

---

## 2. Role of Pulse in the Ecosystem

`pulse-service` is the canonical event, registration, and attendance truth domain of Go2Asia.

It sits between:

- Atlas venue/place truth;
- organizer-facing event workflows;
- user-facing registration and attendance flows;
- downstream discovery/composition/social/reward consumers;
- neighboring domains that need event references but must not own event lifecycle.

Pulse is therefore a **mid-graph operational domain**:

- downstream from Atlas for geo/place identity,
- downstream from auth/user identity for actor truth,
- upstream from Guru, Space, Quest, and other event-consuming layers,
- lateral to RF, Rielt, and Points.

This makes dependency discipline especially important.

---

## 3. Dependency Categories

For Pulse, dependencies should be classified into five categories:

1. **Authoritative upstream dependency**  
   Another service/domain owns truth that Pulse must reference but not mutate.

2. **Operational upstream dependency**  
   Another service provides supporting runtime input required for Pulse operations.

3. **Downstream consumer**  
   Another service consumes Pulse projections, events, or API responses.

4. **Peer bounded context**  
   Another service is domain-adjacent, but neither side owns the other’s truth.

5. **Forbidden dependency**  
   A dependency pattern that would blur ownership or create illegal coupling.

---

## 4. Pulse Dependency Summary

### Authoritative upstream
- Auth / User identity
- Atlas

### Operational upstream
- infrastructure / eventing / messaging layer
- media runtime if binary/media support is externalized
- optional notification/search/reward infrastructure as downstream-support systems

### Downstream consumers
- Guru
- Space
- Quest
- RF integrations that reference Pulse event truth
- public frontend surfaces
- organizer/admin/moderator tooling
- analytics/search/indexing pipelines
- reward/notification consumers

### Peer bounded contexts
- Atlas
- RF
- Quest
- Space
- Guru
- Rielt
- Points

### Forbidden ownership merges
- Pulse → Atlas place writes
- Pulse → RF partner/voucher writes
- Pulse → Quest progression writes
- Pulse → Rielt listing writes
- Pulse → Space social writes as owned state
- Pulse → Points ledger writes as owned state
- neighboring services creating alternative canonical event or attendance truth

---

## 5. Core Dependency Graph (Compact)

Recommended conceptual graph:

- Auth/User → Pulse
- Atlas → Pulse
- Media runtime ↔ Pulse (support-only boundary)
- Pulse ↔ RF
- Pulse ↔ Quest
- Pulse ↔ Space
- Pulse → Guru
- Pulse ↔ Rielt
- Pulse → Points/events pipeline
- Pulse → frontends / organizer surfaces / moderator surfaces

Key principle:

- upstream truth flows into Pulse by reference;
- Pulse truth flows outward by API/projection/event;
- no neighboring service may directly mutate Pulse write state.

---

## 6. Upstream Dependencies

## 6.1 Auth / User Identity

### Dependency type
Authoritative upstream dependency

### Why Pulse depends on it
Pulse needs identity principals for:
- event creators;
- organizers where organizer kind is user;
- attendees/users;
- moderators/admins;
- actor attribution in audit trails.

### Pulse reads from Auth/User
- authenticated actor ID
- role/principal claims
- account existence/validity
- optionally user display hints if exposed

### Pulse must not own
- user account source truth
- password/session/OAuth state
- canonical identity lifecycle

### Allowed dependency direction
Auth/User → Pulse

### Forbidden pattern
Pulse must not create its own shadow user identity system as source of truth.

---

## 6.2 Atlas

### Dependency type
Authoritative upstream dependency

### Why Pulse depends on it
Pulse needs canonical geo and place references for:
- event venue anchoring;
- city/place filtering and discovery;
- host/container place semantics;
- venue breadcrumb and location coherence.

### Pulse reads from Atlas
- country IDs
- city IDs
- district IDs
- place IDs
- host/container place IDs
- optionally display/projection fields for read composition

### Pulse must not own
- place creation/update
- canonical geo normalization truth
- place taxonomy as platform truth

### Allowed dependency direction
Atlas → Pulse (geo/place truth by stable reference)

### Pulse may do
- validate referenced Atlas IDs
- expose Atlas-linked IDs in Pulse DTOs
- maintain read-side enrichments for display only

### Forbidden pattern
Pulse must not invent parallel canonical venue/place truth or become a geography service.

---

## 6.3 Media Runtime / Media Service

### Dependency type
Operational upstream or peer support dependency

### Why Pulse may depend on it
If media binaries are stored outside Pulse, Pulse may rely on media infrastructure for:
- media existence validation;
- asset metadata retrieval;
- signed/public URL generation;
- ingestion pipeline confirmation.

### Pulse owns
- semantic linkage of media to event objects

### Pulse does not own
- binary storage truth
- transformation pipeline truth
- upload runtime truth

### Allowed dependency direction
Media runtime ↔ Pulse with clear semantic split

### Forbidden pattern
Pulse should not become raw binary media storage owner if the platform already has a dedicated media domain.

---

## 6.4 Infrastructure / Messaging Layer

### Dependency type
Operational upstream dependency

### Why Pulse depends on it
Pulse may rely on shared platform infrastructure for:
- event emission;
- outbox delivery;
- queue-based background handling;
- notifications or analytics fanout;
- projection refresh.

This is infrastructure dependency, not business-domain dependency.

---

## 7. Peer Bounded Context Dependencies

## 7.1 Pulse ↔ Atlas

### Dependency type
Peer bounded context with strong Atlas-upstream skew

### Relationship summary
Atlas owns place truth.  
Pulse owns event, registration, and attendance truth.

### Pulse may read from Atlas
- venue/place existence
- place/city/district identity
- host/container semantics
- breadcrumb/location context where needed

### Atlas may read from Pulse
Usually none for Atlas write paths.

### Allowed Pulse references
- `countryId`
- `cityId`
- `districtId`
- `atlasPlaceId`
- `hostAtlasPlaceId`

### Write ownership rule
- Atlas writes Atlas entities only
- Pulse writes Pulse entities only

### Forbidden patterns
- Pulse owning place lifecycle
- Atlas owning event lifecycle
- direct writes by Pulse into Atlas place tables
- Pulse storing full place truth as owned state

### Recommended integration mode
- stable IDs
- projection fetches
- limited synchronous validation when required
- no shared ownership

---

## 7.2 Pulse ↔ RF

### Dependency type
Peer bounded context

### Relationship summary
Pulse owns event lifecycle and attendance truth.  
RF owns partner/business presence, offers, and vouchers.

### Pulse may read from RF
- organizer/host actor context when organizer kind is `rf_partner` or `rf_branch`
- possibly partner-facing display enrichments in read-only scenarios

### RF may read from Pulse
- event existence/state
- attendance-related validation through narrow contracts
- public event data for event-related offers/vouchers

### Allowed relation
- event organizer reference to RF actor
- RF `relatedPulseEventId` references

### Forbidden patterns
- Pulse owning vouchers or partner branches
- RF owning event lifecycle
- RF owning attendance truth
- direct writes by RF into Pulse registration/attendance tables

### Recommended integration mode
- stable IDs
- narrow internal validation endpoints
- event-driven downstream reactions
- no shared ownership

---

## 7.3 Pulse ↔ Quest

### Dependency type
Peer bounded context

### Relationship summary
Pulse owns event and attendance truth.  
Quest owns progression, completion, and proof logic.

### Pulse may read from Quest
Usually nothing required for Pulse write truth.

### Quest may read from Pulse
- event existence/state
- attendance validation
- event timing context
- event public visibility

### Allowed Pulse behavior
- expose internal attendance validation
- emit attendance-related facts for downstream quest logic

### Forbidden patterns
- Pulse owning quest progression
- Quest owning event lifecycle
- Quest owning attendance truth
- Pulse embedding quest engine logic
- Quest directly mutating Pulse attendance state outside Pulse API

### Recommended integration mode
- validation endpoints
- event consumption
- no shared ownership

---

## 7.4 Pulse ↔ Space

### Dependency type
Peer bounded context

### Relationship summary
Pulse owns event truth.  
Space owns social publication and circulation.

### Pulse may expose to Space
- public event cards
- event detail projections
- publication signals for downstream sharing

### Space may expose to Pulse
Usually none as owned truth.

### Forbidden patterns
- Pulse storing Space post/group/comment truth
- Space owning event lifecycle truth
- social engagement embedded as Pulse-owned event state

### Recommended integration mode
- event-driven campaign/social amplification
- public/internal projection fetches
- no shared write tables

---

## 7.5 Pulse ↔ Guru

### Dependency type
Peer bounded context with strong downstream read skew

### Relationship summary
Guru is a read/composition layer.  
Pulse is a source service for event/schedule truth.

### Guru may read from Pulse
- public events
- city/place event lists
- event cards
- time-aware event context
- verified/public event availability

### Pulse may read from Guru
Usually none.

### Forbidden patterns
- Pulse becoming a recommendation/ranking engine
- Guru mutating Pulse state
- Guru becoming canonical source for events

### Recommended integration mode
Pulse → Guru via:
- public APIs
- internal projection APIs
- read-model feeds/events

This is primarily a downstream consumer dependency.

---

## 7.6 Pulse ↔ Rielt

### Dependency type
Peer bounded context

### Relationship summary
Rielt owns listings/inquiries/property truth.  
Pulse may host events related to real-estate actors, projects, or venues.

### Pulse may provide to Rielt
- event schedule context
- event cards linked to projects/places
- open house / meetup / launch event truth

### Rielt may provide to Pulse
- references only, if a Pulse event is related to listing/project context
- optional display enrichment in read-only scenarios

### Forbidden patterns
- Pulse owning listings/inquiries
- Rielt owning event lifecycle or attendance truth
- direct shared writes to each other’s tables
- Pulse collapsing into a real-estate workflow service

### Recommended integration mode
- stable place and optional business references
- projection reads
- event-based downstream sync of derived views only

---

## 7.7 Pulse ↔ Points

### Dependency type
Peer bounded context / downstream event consumer relationship

### Relationship summary
Pulse may emit operational signals that drive rewards/economics elsewhere.  
Points owns points/reward ledger logic.

### Pulse may send to Points
- event registration created
- attendance verified
- event completion milestones where policy says so

### Pulse may read from Points
Typically none for core Pulse write paths.

At most:
- read-only reward display hints in downstream surfaces, not required for Pulse truth.

### Forbidden patterns
- Pulse owning balance ledger
- Points directly mutating Pulse domain truth
- Pulse embedding on-chain or token wallet logic

### Recommended integration mode
Pulse → Points via events/outbox, not synchronous hard dependency for core writes.

---

## 8. Downstream Consumers

## 8.1 User-facing Frontends

### Dependency type
Downstream consumer

These may consume:
- public event cards
- public event detail
- city/place event lists
- current-user registrations
- current-user attendances

They must not:
- write Pulse tables directly
- invent alternative event or attendance truth outside Pulse APIs

---

## 8.2 Organizer/Partner/Admin Frontends

### Dependency type
Downstream consumer

These consume:
- editable event detail
- schedules
- registration queues
- attendance queues
- moderation/publication state

All writes must go through Pulse APIs.

---

## 8.3 Moderator/Admin Surfaces

### Dependency type
Downstream consumer

These consume:
- moderation queues
- review states
- event visibility state
- flagged event flows
- attendance anomaly signals where available

They operate through Pulse-owned moderation endpoints and policy checks.

---

## 8.4 Search / Analytics / Read Projection Pipelines

### Dependency type
Downstream consumer

These may consume Pulse events or projections for:
- search indexing
- analytics aggregation
- recommendation features
- dashboard metrics
- public feed acceleration

They must not write back into Pulse-owned truth unless through explicit Pulse APIs.

---

## 8.5 Notification Pipelines

### Dependency type
Downstream consumer

Notifications may react to:
- registration created
- registration approved/rejected
- event published
- event cancelled
- attendance verified

Notification systems consume Pulse events.  
They do not own Pulse business state.

---

## 9. Read vs Write Dependency Rules

## 9.1 Read dependency rule

It is acceptable for Pulse to read from external authoritative services to validate references or enrich read models.

Examples:
- Atlas place lookup
- Auth principal lookup
- RF organizer existence check where required

---

## 9.2 Write dependency rule

Pulse must never write external domain truth directly.

Examples of forbidden writes:
- writing Atlas place tables
- writing RF partner/branch/voucher tables
- writing Quest progression tables
- writing Rielt listing tables
- writing Space post tables
- writing Points ledger tables

---

## 9.3 Reverse write rule

External services must never write Pulse-owned tables directly.

They must interact through:
- Pulse public/internal APIs
- Pulse application endpoints
- Pulse events as downstream reactions only

---

## 10. Dependency Direction by Object Type

### Event
- Upstream refs: Auth/User, Atlas, optional RF organizer reference
- Downstream consumers: Space, Guru, Quest, RF, frontends, moderators

### Schedule
- Upstream refs: Event
- Downstream consumers: public frontend, Guru, Quest, RF-linked event offers

### Registration
- Upstream refs: Auth/User, Event
- Downstream consumers: user/organizer frontends, notifications, analytics

### Attendance
- Upstream refs: Auth/User, Event, optional Registration
- Downstream consumers: Quest, Points/reward pipeline, analytics, organizer tools

### Venue reference
- Upstream refs: Atlas
- Downstream consumers: public event detail, Guru, internal validation consumers

---

## 11. Dependency Matrix (Compact)

| Neighbor | Category | Pulse Reads | Pulse Writes | Neighbor Reads Pulse | Neighbor Writes Pulse | Notes |
|---|---|---|---|---|---|---|
| Auth/User | Authoritative upstream | Yes | No | No direct domain dependency required | No | Identity truth only |
| Atlas | Authoritative upstream | Yes | No | Possibly limited | No | Venue/geo truth only |
| RF | Peer | Limited | No | Yes | No | Organizer/event-related offer context only |
| Quest | Peer | Usually none | No | Yes | No | Attendance validation consumer |
| Space | Peer | Minimal | No | Yes | No | Social circulation only |
| Guru | Downstream/peer | Usually no | No | Yes | No | Read/composition consumer |
| Rielt | Peer | Limited | No | Yes | No | Event context around listings/projects only |
| Points | Peer/downstream | Usually no | No | Consumes events | No | Reward logic outside Pulse |
| Frontends | Downstream | N/A | Through API only | Yes | No direct writes | Surface consumers |
| Moderator tools | Downstream | N/A | Through Pulse API only | Yes | No direct writes | Action through policy |
| Media runtime | Operational/peer support | Yes, limited | No | Possibly limited | No | Binary/media support only |

---

## 12. Allowed Integration Styles

The preferred integration styles around Pulse are:

### 12.1 Stable ID references
Use when linking to Atlas, RF, users, and external contexts.

### 12.2 Narrow internal projection APIs
Use when another service needs minimal Pulse data without coupling to full Pulse internals.

### 12.3 Internal validation endpoints
Use when another service needs authoritative event or attendance checks.

### 12.4 Domain events / outbox
Use for:
- Points/rewards
- notifications
- analytics
- search indexing
- social amplification side effects

### 12.5 Controlled synchronous validation
Use when request-time correctness requires it, such as:
- Atlas venue reference validation
- actor permission context resolution
- attendance state validation for authorized internal use

---

## 13. Forbidden Integration Styles

Pulse should explicitly avoid:

- shared database writes across services
- importing foreign aggregates into Pulse write ownership
- wide “give me everything” internal APIs
- embedding business logic of neighboring services inside Pulse
- cyclic orchestration where Pulse write success depends on multiple peer service writes
- frontend-owned event or attendance truth replacing Pulse backend truth

---

## 14. Cyclic Dependency Risks

Pulse is vulnerable to cyclic dependency loops because it touches events, attendance, organizers, offers, quests, and social circulation.

Common bad loop examples:

### Bad loop A
Pulse event publication depends on Atlas place  
Atlas place creation depends on Pulse event  
This must be avoided by keeping Atlas independently authoritative.

### Bad loop B
RF voucher redeem depends on Pulse attendance  
Pulse attendance verification depends on RF voucher redemption  
This creates illegal cyclical truth.  
One side must remain validation-only; the other remains state-owning.

### Bad loop C
Quest completion depends on Pulse attendance  
Pulse attendance validity depends on Quest completion  
This creates a closed loop and must be broken.  
Attendance remains Pulse truth; Quest consumes it.

### Bad loop D
Space post creates event object in Pulse  
Pulse publication depends on social post existing  
This makes social circulation an ownership dependency and must be avoided.

### Bad loop E
Rielt open house event existence depends on listing  
Listing publication depends on event existing  
This should be resolved by optional references and staged workflows, not cyclic hard requirements.

---

## 15. Pulse as Source vs Pulse as Consumer

Pulse should more often behave as a **source service** than as a heavy consumer.

Pulse is source for:
- event truth
- schedule truth
- registration truth
- attendance truth
- event lifecycle/publication truth

Pulse is consumer for:
- identity truth
- Atlas geo/place truth
- optional organizer reference validation when external
- optional media support

This ratio matters.  
If Pulse starts consuming too much neighboring state into its own writes, it is becoming a god-service.

---

## 16. Internal Projection Contracts

Pulse may expose internal projections for safe cross-service consumption.

Recommended projection families:

- event minimal projection
- attendance minimal projection
- attendance summary
- event validation result

These projections should:
- be narrow;
- be stable;
- contain IDs and a few operational fields;
- avoid leaking internal table shape.

### Example appropriate use
Quest validates that a user attended an event.  
RF verifies an event exists before showing event-related offer context.  
Guru reads a minimal event card projection.

### Example inappropriate use
Another service requests full Pulse relational state and reconstructs Pulse logic externally.

---

## 17. Event Dependency Rules

Pulse events should be treated as downstream facts, not upstream commands.

### Good event usage
- `pulse.attendance.verified` triggers reward processing
- `pulse.event.published` triggers search index refresh
- `pulse.registration.created` triggers notification

### Bad event usage
- another service emits event that directly changes Pulse truth without Pulse validating and owning the transition
- Pulse waits for multiple peer confirmations before committing local event or attendance state

Pulse local truth should be committed first.  
Downstream reactions happen afterward.

---

## 18. Frontend Dependency Rules

All Pulse frontends are downstream consumers of Pulse APIs.

This includes:
- public event pages
- organizer/admin dashboards
- user registration/attendance pages
- moderation tools

### Allowed pattern
Frontend → Pulse API → Pulse application layer → Pulse data

### Forbidden pattern
Frontend → direct DB mutation  
Frontend → write neighboring service state as if it were Pulse truth  
Frontend → duplicate lifecycle rules in client as source of truth

---

## 19. Dependency Priorities for Pulse SSOT / Delivery

For Pulse, the most important dependencies are:

### Hard upstream
1. Auth/User
2. Atlas

### Critical peer/downstream integrations
3. user-facing frontends
4. organizer/admin/moderator frontends
5. Quest attendance consumers
6. Guru event consumers

### Secondary peer integrations
7. RF
8. Space
9. Rielt
10. Points/reward pipeline

This means Pulse should not block initial implementation on deep integration with every neighboring domain.

---

## 20. Minimal Integration Baseline

A minimal correct Pulse dependency implementation can be:

- auth principal resolution
- Atlas reference validation
- Pulse-owned write store
- Pulse-owned public/user/organizer read APIs
- Pulse outbox/domain events
- no direct synchronous dependency on Points, Space, Quest, or Guru for core writes

This keeps Pulse operationally independent enough to ship safely.

---

## 21. Dependency Ownership Formula by Neighbor

### Atlas
Pulse depends on Atlas for venue/place truth.  
Atlas does not depend on Pulse for place truth.

### RF
Pulse may reference RF organizer context; RF may reference Pulse events.  
Neither owns the other.

### Quest
Quest may depend on Pulse attendance/event truth.  
Pulse does not depend on Quest for canonical attendance truth.

### Space
Space may circulate Pulse objects.  
Pulse never depends on Space for event truth.

### Guru
Guru composes Pulse data.  
Pulse does not depend on Guru for source truth.

### Rielt
Rielt and Pulse may reference the same place/business context.  
Each owns different truths.

### Points
Points may reward Pulse operations.  
Pulse does not own the ledger.

---

## 22. Forbidden Ownership Transfers

The following ownership transfers must be explicitly prohibited:

- Atlas place truth → Pulse
- RF partner/voucher truth → Pulse
- Quest progression truth → Pulse
- Space social object truth → Pulse
- Rielt listing truth → Pulse
- Points ledger truth → Pulse

And in the opposite direction:

- Pulse event truth → Space
- Pulse attendance truth → Quest
- Pulse schedule truth → Guru
- Pulse event truth → RF offers as owned lifecycle
- Pulse registration truth → frontend client state

Pulse may share projections, never transfer ownership.

---

## 23. Risk Map

### High-risk coupling risks
- Atlas/Pulse venue ownership blur
- RF/Pulse event-offer/voucher boundary blur
- Quest/Pulse attendance/proof cycles
- Space/Pulse event-social ownership blur
- Points/Pulse reward coupling turning synchronous

### Medium-risk coupling risks
- Guru recommendation logic creeping into Pulse APIs
- Rielt open-house/project-event overlap creeping into Pulse core
- frontend dashboards becoming attendance/business-logic owners

### Low-risk dependencies
- auth claims
- read-only internal projections
- notification/search/index consumers of Pulse events

---

## 24. What a Correct Pulse Dependency Shape Looks Like

A correct dependency shape for Pulse looks like this:

- Pulse validates identity upstream
- Pulse validates venue references upstream through Atlas
- Pulse commits its own event/registration/attendance truth locally
- Pulse emits its own events
- neighbors consume Pulse truth through projections/events/APIs
- neighbors keep their own truths local
- no service writes another bounded context’s tables

This is the architecture-safe dependency pattern.

---

## 25. Final Dependency Formula

The shortest correct dependency formula is:

> `pulse-service` depends upstream on identity and Atlas, interacts laterally with RF / Quest / Space / Guru / Rielt / Points through references and events, and serves downstream frontends and read consumers as the sole writer and source of truth for Pulse event, schedule, registration, and attendance state.

---

## 26. Most Important Conclusion

Pulse has many neighbors, but that does **not** justify blurred ownership.

The correct dependency map is:

- few authoritative upstream truths,
- many downstream consumers,
- narrow peer integrations,
- zero shared ownership.

That is what keeps `pulse-service` usable, scalable, and extraction-safe.