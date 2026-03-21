# RF Service — Dependency Map v1

**Project:** Go2Asia  
**Domain:** Russian Friendly / RF  
**Document role:** SSOT dependency map for `rf-service`  
**Status:** Draft v1  
**Purpose:** Define upstream dependencies, downstream consumers, ownership boundaries, read/write contracts, and forbidden dependency patterns for `rf-service`.

---

## 1. Purpose

This document defines the dependency map around `rf-service`.

Its goal is to make one thing unambiguous:

- what `rf-service` depends on;
- what depends on `rf-service`;
- which dependencies are read-only;
- which dependencies are write-forbidden;
- where orchestration is allowed;
- where ownership transfer is forbidden.

This document is not a production deployment diagram.  
It is a domain-boundary and service-dependency document.

---

## 2. Role of RF in the Ecosystem

`rf-service` is the partner/business presence and voucher lifecycle domain of Go2Asia.

It sits between:

- identity/auth actors;
- Atlas geo/place truth;
- user-facing discovery surfaces;
- partner/pro/business workflows;
- reward/social/quest/event integrations.

RF is therefore a **mid-graph operational domain**:

- upstream from public discovery and downstream consumption layers,
- but downstream from identity and geo truth,
- and lateral to event, quest, social, and real-estate domains.

This makes dependency discipline especially important.

---

## 3. Dependency Categories

For RF, dependencies should be classified into five categories:

1. **Authoritative upstream dependency**  
   Another service/domain owns truth that RF must reference but not mutate.

2. **Operational upstream dependency**  
   Another service provides supporting runtime input required for RF operations.

3. **Downstream consumer**  
   Another service consumes RF projections, events, or API responses.

4. **Peer bounded context**  
   Another service is domain-adjacent, but neither side owns the other’s truth.

5. **Forbidden dependency**  
   A dependency pattern that would blur ownership or create illegal coupling.

---

## 4. RF Dependency Summary

### Authoritative upstream
- Auth / User identity
- Atlas

### Operational upstream
- role/permission context if externalized
- internal platform messaging/events infrastructure

### Peer bounded contexts
- Pulse
- Quest
- Space
- Guru
- Rielt
- Points

### Downstream consumers
- Guru read layer
- Space social/distribution layer
- PRO/business/user frontends
- moderator/admin surfaces
- analytics/search/read projections
- rewards/notification pipelines

### Forbidden ownership merges
- RF → Atlas writes
- RF → Pulse writes
- RF → Quest truth writes
- RF → Rielt listing writes
- RF → Space post writes as owned state
- RF → Points ledger writes as owned state

---

## 5. Core Dependency Graph (Compact)

Recommended conceptual graph:

- Auth/User → RF
- Atlas → RF
- RF ↔ Pulse
- RF ↔ Quest
- RF ↔ Space
- RF → Guru
- RF ↔ Rielt
- RF → Points/events pipeline
- RF → frontends / partner surfaces / moderator surfaces

Key principle:

- upstream truth flows into RF by reference;
- RF truth flows outward by API/projection/event;
- no neighboring service may directly mutate RF write state.

---

## 6. Upstream Dependencies

## 6.1 Auth / User Identity

### Dependency type
Authoritative upstream dependency

### Why RF depends on it
RF needs identity principals for:
- partner representatives;
- PRO actors;
- voucher owners/users;
- moderators/admins;
- actor attribution in audit trails.

### RF reads from Auth/User
- authenticated actor ID
- role/principal claims
- possibly user display hints if exposed
- account existence/validity

### RF must not own
- user account source truth
- password/session/OAuth state
- canonical identity lifecycle

### Allowed dependency direction
Auth/User → RF (identity truth)
RF → downstream usage of user IDs only

### Forbidden pattern
RF must not create its own shadow user system as identity source of truth.

---

## 6.2 Atlas

### Dependency type
Authoritative upstream dependency

### Why RF depends on it
RF needs canonical geo and place references for:
- partner geographic presence;
- branch geographic anchoring;
- host/container place semantics;
- city/district/country alignment.

### RF reads from Atlas
- country IDs
- city IDs
- district IDs
- place IDs
- host/container place IDs
- optionally display/projection fields for read composition

### RF must not own
- place creation/update
- canonical geo normalization truth
- place taxonomy as platform truth

### Allowed dependency direction
Atlas → RF (geo truth by stable reference)

### RF may do
- validate referenced Atlas IDs
- expose Atlas-linked IDs in RF DTOs
- maintain read-side enrichments for display only

### Forbidden pattern
RF must not invent parallel canonical place truth or become a geography service.

---

## 6.3 Role/Permission Context (if externalized)

### Dependency type
Operational upstream dependency

### Why RF may depend on it
If the platform externalizes role resolution or policy lookup, RF may consume it for:
- admin/moderator privilege checks;
- PRO status verification;
- scoped authorization decisions.

### Allowed dependency direction
Permission context → RF at request time or via claims

### Forbidden pattern
RF should not become dependent on a fragile cross-service policy roundtrip for every trivial operation if stable claims/local policy can suffice.

---

## 6.4 Infrastructure / Messaging Layer

### Dependency type
Operational upstream dependency

### Why RF depends on it
RF may rely on shared platform infrastructure for:
- event emission;
- outbox delivery;
- queue-based background handling;
- notifications or analytics fanout.

### Important note
This is infrastructure dependency, not business-domain ownership dependency.

---

## 7. Peer Bounded Context Dependencies

## 7.1 RF ↔ Pulse

### Dependency type
Peer bounded context

### Relationship summary
Pulse owns event truth.  
RF owns partner/business presence, offers, vouchers.

### RF may read from Pulse
- event existence/ID validation
- event metadata for read enrichment
- event-linked contextual references where needed

### Pulse may read from RF
- partner projections
- branch projections
- offer/voucher-linked partner context
- verified business presence context

### Allowed RF references
- `relatedPulseEventId` on offer/voucher/read models

### Write ownership rule
- Pulse writes Pulse entities only
- RF writes RF entities only

### Forbidden patterns
- RF owning event lifecycle
- Pulse owning voucher lifecycle
- direct writes by Pulse into RF voucher/offer tables
- RF storing full event truth as owned state

### Recommended integration mode
- stable IDs
- projection fetches
- event-driven downstream reactions
- limited synchronous validation when required

---

## 7.2 RF ↔ Quest

### Dependency type
Peer bounded context

### Relationship summary
Quest owns progression, completion, and proof logic.  
RF owns partners, branches, offers, and vouchers.

### RF may read from Quest
- eligibility/proof outcome where contractually needed
- quest-linked redeem conditions if explicitly modeled

### Quest may read from RF
- branch targets
- voucher targets
- verified partner/branch status
- branch metadata for quest surfaces

### Allowed RF behavior
- store opaque or narrow eligibility context references
- validate voucher redemption with quest-aware inputs via adapter if needed

### Forbidden patterns
- RF owning quest completion truth
- Quest owning voucher lifecycle
- RF embedding full quest engine logic
- Quest directly mutating RF voucher state outside RF API

### Recommended integration mode
- ID/reference-based
- explicit validation endpoint or event consumption
- no shared ownership

---

## 7.3 RF ↔ Space

### Dependency type
Peer bounded context

### Relationship summary
Space owns the social publication/distribution layer (circulation).  
RF owns partner/business presence and voucher lifecycle.

### RF may expose to Space
- partner public projections
- branch public projections
- offer campaign objects
- partner verification/publication signals

### Space may expose to RF
- nothing as owned truth
- optionally social engagement summaries in read-only derived scenarios, if ever needed

### Forbidden patterns
- RF storing Space post/group/comment truth
- Space owning partner profile truth
- social content embedded as RF-owned records

### Recommended integration mode
- event-driven campaign amplification
- API/projection fetches
- no shared write tables

---

## 7.4 RF ↔ Guru

### Dependency type
Peer bounded context with strong downstream read skew

### Relationship summary
Guru is mostly a read/composition layer.  
RF is a source service for partner/branch/offer truth.

### Guru may read from RF
- public partners
- public branches
- public offers
- lightweight nearby-eligible projections
- verified business presence data

### RF may read from Guru
Usually none.

If ever needed, it should be minimal and non-authoritative.

### Forbidden patterns
- RF becoming a recommendation/ranking engine
- Guru mutating RF state
- Guru becoming canonical source for RF objects

### Recommended integration mode
RF → Guru via:
- public APIs
- internal projection APIs
- read-model feeds/events

This is primarily a downstream consumer dependency.

---

## 7.5 RF ↔ Rielt

### Dependency type
Peer bounded context

### Relationship summary
Rielt owns listings/inquiries/property truth.  
RF may model some of the same business actors as partners.

### RF may provide to Rielt
- partner verification/trust context
- business presence / branch context
- PRO onboarding relationship context
- offer/voucher/business promotion context

### Rielt may provide to RF
- references only, if an RF partner is related to a real-estate business actor
- possibly property-event/promo linkage via external references

### Forbidden patterns
- RF owning listings
- Rielt owning partner profile truth for platform-wide RF
- direct shared writes to each other’s tables
- RF collapsing into a real-estate service

### Recommended integration mode
- partner IDs / branch IDs as references
- projection reads
- event-based sync of derived read views only

---

## 7.6 RF ↔ Points

### Dependency type
Peer bounded context / downstream event consumer relationship

### Relationship summary
RF may emit operational signals that drive rewards/economics elsewhere.  
Points owns points/reward ledger logic.

### RF may send to Points
- voucher claimed
- voucher redeemed
- partner onboarding milestone
- branch verified
- partner verified
- campaign participation signal if policy says so

### RF may read from Points
Typically none for Step 10 core write paths.

At most:
- read-only reward display hints in downstream surfaces, not required for RF truth.

### Forbidden patterns
- RF owning balance ledger
- Points directly mutating RF domain truth
- RF embedding on-chain or token wallet logic

### Recommended integration mode
RF → Points via events/outbox, not synchronous hard dependency for core writes.

---

## 8. Downstream Consumers

## 8.1 User-facing Frontends

### Dependency type
Downstream consumer

These may consume:
- public partners
- public branches
- public offers
- current-user vouchers

They must not:
- write RF tables directly
- invent alternative domain state outside RF APIs

---

## 8.2 Business/Partner Frontends

### Dependency type
Downstream consumer

These consume:
- editable partner detail
- representatives
- business lines
- branches
- offers
- voucher operations
- moderation/verification status

All writes must go through RF APIs.

---

## 8.3 PRO Surfaces / PRO Console

### Dependency type
Downstream consumer

These consume:
- PRO-linked partner queue
- onboarding status
- partner support relationship state
- possibly branch/offer visibility relevant to PRO workflows

### Important note
PRO Console is a consuming surface and workflow layer, not the owner of RF truth.

---

## 8.4 Moderator/Admin Surfaces

### Dependency type
Downstream consumer

These consume:
- moderation queues
- verification states
- suspension actions
- audit views
- voucher anomaly signals

They operate through RF-owned moderation endpoints and policy checks.

---

## 8.5 Search / Analytics / Read Projection Pipelines

### Dependency type
Downstream consumer

These may consume RF events or projections for:
- search indexing
- analytics aggregation
- recommendation features
- dashboard metrics

They must not write back into RF-owned truth unless through explicit RF APIs.

---

## 8.6 Notification Pipelines

### Dependency type
Downstream consumer

Notifications may react to:
- representative invitation
- partner verification
- voucher claim
- voucher expiry
- voucher redemption
- PRO link acceptance

Again, notification systems consume RF events.  
They do not own RF business state.

---

## 9. Read vs Write Dependency Rules

## 9.1 Read dependency rule

It is acceptable for RF to read from external authoritative services to validate references or enrich read models.

Examples:
- Atlas place lookup
- Auth principal lookup
- Pulse event existence check

---

## 9.2 Write dependency rule

RF must never write external domain truth directly.

Examples of forbidden writes:
- writing Atlas place tables
- writing Pulse event tables
- writing Quest progression tables
- writing Rielt listing tables
- writing Space post tables
- writing Points ledger tables

---

## 9.3 Reverse write rule

External services must never write RF-owned tables directly.

They must interact through:
- RF public/internal APIs
- RF application endpoints
- RF events as downstream reactions only

---

## 10. Dependency Direction by Object Type

### Partner
- Upstream refs: Auth/User, Atlas
- Downstream consumers: Space, Guru, Rielt, frontends, moderators

### Branch
- Upstream refs: Atlas
- Downstream consumers: Guru, Quest, Space, Pulse-related views, frontends

### ProLink
- Upstream refs: Auth/User, role context
- Downstream consumers: PRO surfaces, business surfaces

### Offer
- Upstream refs: optional Pulse event ID, partner/branch IDs
- Downstream consumers: user-facing discovery, Space, Guru, business dashboards

### Voucher
- Upstream refs: user identity, optional Pulse/Quest context
- Downstream consumers: user wallet UI, partner operations UI, Points/rewards pipeline, analytics

---

## 11. Dependency Matrix (Compact)

| Neighbor | Category | RF Reads | RF Writes | Neighbor Reads RF | Neighbor Writes RF | Notes |
|---|---|---|---|---|---|---|
| Auth/User | Authoritative upstream | Yes | No | No direct domain dependency required | No | Identity truth only |
| Atlas | Authoritative upstream | Yes | No | Possibly none / limited | No | Geo truth only |
| Pulse | Peer | Limited | No | Yes | No | Event-linked references only |
| Quest | Peer | Limited | No | Yes | No | Eligibility/proof context only |
| Space | Peer | Minimal | No | Yes | No | Social circulation only |
| Guru | Downstream/peer | Usually no | No | Yes | No | Read/composition consumer |
| Rielt | Peer | Limited | No | Yes | No | Shared business actors, separate truth |
| Points | Peer/downstream | Usually no | No | Consumes events | No | Reward logic outside RF |
| Frontends | Downstream | N/A | Through API only | Yes | No direct writes | Surface consumers |
| Moderator tools | Downstream | N/A | Through RF API only | Yes | No direct writes | Action through policy |

---

## 12. Allowed Integration Styles

The preferred integration styles around RF are:

### 12.1 Stable ID references
Use when linking to Atlas, Pulse, Quest, Rielt, users, etc.

### 12.2 Narrow internal projection APIs
Use when another service needs minimal RF data without coupling to full RF internals.

### 12.3 Domain events / outbox
Use for:
- Points/rewards
- notifications
- analytics
- search indexing
- social amplification side effects

### 12.4 Controlled synchronous validation
Use when request-time correctness requires it, such as:
- geo reference validation
- actor permission context resolution
- event existence check where needed

---

## 13. Forbidden Integration Styles

RF should explicitly avoid:

- shared database writes across services
- importing foreign aggregates into RF write ownership
- wide “give me everything” internal APIs
- embedding business logic of neighboring services inside RF
- cyclic orchestration where RF write success depends on multiple peer service writes
- frontend-owned business rules replacing RF backend truth

---

## 14. Cyclic Dependency Risks

RF is especially vulnerable to cyclic dependency loops because it touches many domains.

Common bad loop examples:

### Bad loop A
RF needs Atlas to validate branch  
Atlas needs RF to publish place  
This must be avoided by keeping Atlas independent and authoritative.

### Bad loop B
RF voucher redeem depends on Quest completion  
Quest completion depends on RF redeem success  
This creates illegal cyclical truth.  
One side must stay validation-only, the other state-owning.

### Bad loop C
Space campaign post creates partner object in RF  
RF publication depends on Space campaign existing  
This makes social circulation an ownership dependency and must be avoided.

### Bad loop D
Rielt listing publication requires RF partner publication  
RF partner publication requires Rielt listing existence  
This must be resolved via optional references and staged workflows, not cyclic hard requirements.

---

## 15. RF as Source vs RF as Consumer

RF should more often behave as a **source service** than as a **heavy consumer**.

RF is source for:
- partner truth
- branch truth
- PRO link truth
- offer truth
- voucher truth
- moderation/verification truth

RF is consumer for:
- identity truth
- geo truth
- optional event/progression validation inputs

This ratio matters.  
If RF starts consuming too much neighboring state into its own writes, it is becoming a god-service.

---

## 16. Internal Projection Contracts

RF may expose internal projections for safe cross-service consumption.

Recommended projection families:

- partner minimal projection
- branch minimal projection
- voucher minimal projection

These projections should:
- be narrow;
- be stable;
- contain IDs and a few operational fields;
- avoid leaking internal table shape.

### Example appropriate use
Guru needs a branch card projection.  
Quest needs verified branch visibility check.  
Points needs voucher redemption confirmation metadata.

### Example inappropriate use
Another service requests full RF relational state and reconstructs RF logic externally.

---

## 17. Event Dependency Rules

RF events should be treated as downstream facts, not upstream commands.

### Good event usage
- `rf.voucher.redeemed` triggers reward processing
- `rf.partner.verified` triggers search index refresh
- `rf.pro_link.accepted` triggers notification

### Bad event usage
- another service emits event that directly changes RF truth without RF validating and owning the transition
- RF waits for multiple peer confirmations before committing core local state

RF local truth should be committed first.  
Downstream reactions happen afterward.

---

## 18. Frontend Dependency Rules

All RF frontends are downstream consumers of RF APIs.

This includes:
- public RF pages
- partner/business dashboards
- PRO console surfaces
- moderator/admin panels

### Allowed pattern
Frontend → RF API → RF application layer → RF data

### Forbidden pattern
Frontend → direct DB mutation  
Frontend → write neighboring service state as if it were RF truth  
Frontend → duplicate lifecycle rules in client as source of truth

---

## 19. Dependency Priorities for Step 10

For Step 10, the most important dependencies are:

### Hard upstream
1. Auth/User
2. Atlas

### Critical peer integrations
3. Points/events pipeline
4. Pulse references
5. PRO/business/admin frontends

### Secondary peer integrations
6. Quest
7. Guru
8. Space
9. Rielt

This means RF should not block initial implementation on full deep integration with every neighboring domain.

---

## 20. Minimal Integration Baseline

A minimal correct RF dependency implementation can be:

- auth principal resolution
- Atlas reference validation
- RF-owned write store
- RF-owned read APIs
- RF outbox/domain events
- no direct synchronous dependency on Points, Space, Quest, or Guru for core writes

This keeps RF operationally independent enough to ship safely.

---

## 21. Dependency Ownership Formula by Neighbor

### Atlas
RF depends on Atlas for place truth.  
Atlas does not depend on RF for geo truth.

### Pulse
RF may reference Pulse events.  
Pulse may reference RF partner/branch context.  
Neither owns the other.

### Quest
RF may validate against Quest context.  
Quest may target RF entities.  
Neither owns the other.

### Space
Space may circulate RF objects.  
RF never depends on Space for partner truth.

### Guru
Guru composes RF data.  
RF does not depend on Guru for source truth.

### Rielt
Rielt and RF may refer to the same business actor.  
Each owns different truths.

### Points
Points may reward RF operations.  
RF does not own the ledger.

---

## 22. Forbidden Ownership Transfers

The following ownership transfers must be explicitly prohibited:

- Atlas place truth → RF
- Pulse event lifecycle → RF
- Quest completion truth → RF
- Space social object truth → RF
- Rielt listing truth → RF
- Points ledger truth → RF

And in the opposite direction:

- RF partner truth → Space
- RF voucher truth → Quest
- RF branch truth → Guru
- RF offer truth → Pulse
- RF representative truth → frontend client state

RF may share projections, never transfer ownership.

---

## 23. Risk Map

### High-risk coupling risks
- Atlas/RF geo duplication
- Pulse/RF event-offer ownership blur
- Quest/RF redemption/proof cycles
- Rielt/RF business actor overlap
- Points/RF reward coupling turning synchronous

### Medium-risk coupling risks
- Space campaign automation creeping into RF core writes
- Guru search/ranking logic creeping into RF APIs
- frontend dashboards becoming business-logic owners

### Low-risk dependencies
- auth claims
- read-only internal projections
- notification consumption of RF events

---

## 24. What a Correct RF Dependency Shape Looks Like

A correct dependency shape for RF looks like this:

- RF validates identity upstream
- RF validates geo upstream
- RF commits its own truth locally
- RF emits its own events
- neighbors consume RF truth through projections/events/APIs
- neighbors keep their own truths local
- no service writes another bounded context’s tables

This is the architecture-safe dependency pattern.

---

## 25. Final Dependency Formula

The shortest correct dependency formula is:

> `rf-service` depends upstream on identity and Atlas, interacts laterally with Pulse / Quest / Space / Guru / Rielt / Points through references and events, and serves downstream frontends and read consumers as the sole writer and source of truth for RF partner, branch, offer, voucher, and PRO-link state.

---

## 26. Most Important Conclusion

RF has many neighbors, but that does **not** justify blurred ownership.

The correct dependency map is:

- few authoritative upstream truths,
- many downstream consumers,
- narrow peer integrations,
- zero shared ownership.

That is what keeps `rf-service` usable, scalable, and extraction-safe.