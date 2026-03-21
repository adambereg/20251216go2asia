# Cross-Domain Architecture Note v1
## Atlas + RF + Pulse + Quest + Rielt + Guru + Space

Version: v1  
Status: Draft / Architectural baseline  
Purpose: align domain ownership, identity model, and cross-domain interaction rules before SSOT work for `rf-service` and adjacent services.

---

## 1. Purpose and scope

This note defines the cross-domain architecture baseline for the following Go2Asia modules:

- **Atlas Asia**
- **Russian Friendly Asia (RF)**
- **Pulse Asia**
- **Quest Asia**
- **Rielt Market**
- **Guru Asia**
- **Space Asia**

The goal is to fix:

- ownership boundaries,
- canonical identity rules,
- place / business / event / property relationships,
- container and host-place scenarios,
- aggregation rules for nearby/discovery surfaces,
- anti-drift guardrails before implementation work.

This note is not an implementation spec and not an API contract.  
It is a cross-domain architecture baseline.

---

## 2. Core architectural problem

Go2Asia contains several modules that all depend on location, identity, and cross-links:

- Atlas models geography and place identity.
- RF models partner businesses, branches, offers, and vouchers.
- Pulse models events.
- Quest models progression and proof scenarios.
- Rielt models real-estate objects and related user flows.
- Guru aggregates nearby and discovery results from multiple domains.
- Space models social publishing, reposts, reputation, and community context around canonical entities.

If these modules evolve independently, the platform will drift into conflicting models:

- one module treating a place as a business,
- another treating it as a venue,
- another treating it as a property,
- another treating it as a quest target,
- and Guru trying to combine all of them through fragile adapters.

This note establishes a shared model:

- **Atlas owns geography**
- **RF owns business presence**
- **Pulse owns events and attendance truth**
- **Quest owns progression/proof**
- **Rielt owns property domain**
- **Guru aggregates but does not own source truth**
- **Space owns social layer semantics**

---

## 3. Architectural principles

### 3.1. Single ownership per core concept
Each core concept must have one owning domain.

### 3.2. Cross-domain links must be explicit
Cross-domain scenarios must rely on stable IDs and explicit references, not free text.

### 3.3. Geography is foundational
All place-aware modules must rely on a shared geographic substrate.

### 3.4. Aggregation and social layers do not own source truth
Guru may aggregate and enrich, and Space may socially distribute and contextualize, but neither should become the source of truth for place, event, property, business, or quest identity.

### 3.5. Cross-domain overlays are allowed
A single Atlas place may be enriched by RF, Pulse, Rielt, and Quest, but the place itself remains owned by Atlas.

### 3.6. Product surfaces may compose multiple domains
A page or card may show combined data, but domain ownership must remain separate in storage and contracts.

---

## 4. Domain ownership model

## 4.1. Atlas Asia owns geographic identity

Atlas owns:

- countries
- cities
- places
- place slugs and canonical IDs
- geographic coordinates
- geographic hierarchy
- place type baseline
- country/city/place relationships
- place discoverability as a geo entity

Atlas may include:

- attractions
- commercial places
- infrastructure places
- complexes / container places
- districts
- landmarks
- venues as geographic objects

Atlas does **not** own:

- business partner identity
- business operations
- offers/vouchers
- event lifecycle
- quest progression
- property business logic

---

## 4.2. RF owns partner/business presence

RF owns:

- business partner
- partner representative
- partner business line
- partner branch
- partner branch ↔ business line mapping
- partner ↔ PRO relationship
- offers
- vouchers
- claim/redeem lifecycle
- partner moderation and verification
- partner operations surfaces (user / PRO / business)

RF does **not** own:

- raw geographic place identity
- city/country/place hierarchy
- event lifecycle
- quest logic
- property domain logic
- global discovery aggregation

---

## 4.3. Pulse owns events and attendance truth

Pulse owns:

- event
- event lifecycle
- event status
- event registration / participation truth
- event schedule semantics
- event detail content
- event publication state

Pulse does **not** own:

- canonical place hierarchy
- business partner identity
- voucher ownership
- quest completion logic
- real-estate domain logic

---

## 4.4. Quest owns progression and proof

Quest owns:

- quest
- quest step
- quest progression
- proof policy
- completion rules
- reward trigger semantics
- target evaluation logic

Quest does **not** own:

- places
- business branches
- event source truth
- voucher lifecycle
- property source truth

---

## 4.5. Rielt owns property domain

Rielt owns:

- property/listing identity
- property metadata
- inquiry / lead flow
- real-estate specific status
- listing availability semantics
- property presentation and market logic

Rielt does **not** own:

- geographic source truth
- general partner layer
- event source truth
- quest source truth

---

## 4.6. Guru owns aggregation/discovery only

Guru owns:

- cross-domain nearby aggregation
- unified discovery cards
- ranking and presentation logic
- discovery-oriented read models
- multi-domain surface composition

Guru does **not** own:

- place identity
- business identity
- event identity
- property identity
- quest proof truth

---

## 4.7. Space owns social layer semantics

Space owns the platform’s social semantics at the domain level.

Space includes:

- social publishing
- repost-based distribution
- reactions and interaction signals
- personal feed behavior
- group/community behavior
- thematic groups
- reputation and community context
- social attachment of user-authored context to canonical entities

Space does **not** own:

- geographic source truth
- business source truth
- event source truth
- event attendance truth
- voucher lifecycle
- quest proof truth
- property source truth

Important: Space is a **domain**, not a single service.  
Its ownership is implemented across multiple services such as `space-service` (social publication core), Reactions Service, Feed Service, and partially User Service.

---

## 5. Canonical identity model

The platform must distinguish the following identities:

### 5.1. Geo identity
Owned by Atlas.

Examples:
- country
- city
- place
- district
- complex
- venue as geographic object

### 5.2. Business identity
Owned by RF.

Examples:
- business partner
- partner branch
- business line
- representative
- offer
- voucher

### 5.3. Event identity
Owned by Pulse.

Examples:
- event
- event registration
- event attendance truth

### 5.4. Property identity
Owned by Rielt.

Examples:
- listing
- unit
- property object
- inquiry

### 5.5. Progression identity
Owned by Quest.

Examples:
- quest
- quest step
- proof result
- completion state

### 5.6. Aggregation identity
Owned by Guru only for read/composition purposes.

Examples:
- unified nearby card
- multi-domain discovery result
- ranking snapshot

### 5.7. Social identity

Owned by Space domain.

Examples:
- post
- repost
- reaction artifact
- thematic group
- social anchor to canonical entity
- feed/distribution context
- saved/liked/shared social state

Social identity must not be confused with source truth identity from Atlas, RF, Pulse, Quest, or Rielt.

---

## 6. Atlas as canonical geo substrate

Atlas is the canonical geographic substrate for all place-aware modules.

### 6.1. Every published location-aware domain entity should map to Atlas
Examples:

- RF branch -> Atlas place
- Pulse event venue -> Atlas place
- Rielt listing / project -> Atlas place or Atlas-linked geo entity
- Quest target -> Atlas-linked place/event/property/business context
- Guru card -> sourced from Atlas-linked identities

### 6.2. Atlas place is a geo object, not a business object
A place may represent:

- an attraction,
- a commercial venue,
- a shopping mall,
- a hotel complex,
- a market,
- a condo complex,
- a restaurant,
- a beach,
- a temple,
- a coworking space.

This does not mean Atlas owns the business operating there.

### 6.3. Atlas commercial places must not depend exclusively on RF
Atlas should be able to store commercial places that are not RF partners.

### 6.4. Atlas may later support hierarchy
Useful future fields:

- `parent_place_id`
- `is_container`

This is especially relevant for:

- malls
- markets
- hotel complexes
- residential projects
- resorts
- mixed-use buildings
- large venues

---

## 7. RF as partner/business presence layer

RF should model business presence separately from geography.

## 7.1. Core RF entities
- `RfBusinessPartner`
- `RfPartnerRepresentative`
- `RfPartnerBusinessLine`
- `RfPartnerBranch`
- `RfPartnerBranchBusinessLine`
- `RfOffer`
- `RfVoucher`

## 7.2. Why branch is required
A partner is not the same thing as a place.

One partner may:
- operate multiple branches,
- have multiple business lines,
- work in multiple cities or countries,
- operate multiple commercial units within one complex.

One branch may:
- live in one Atlas place,
- exist inside a larger host place,
- expose several business lines.

## 7.3. Branch-place rules
A published RF branch must reference Atlas geography through one of the following patterns:

### Pattern A: standalone place
`branch -> atlas_place_id`

### Pattern B: inside a host/container place
`branch -> host_atlas_place_id`  
plus optional local positioning:
- unit
- floor
- zone
- landmark note

### Pattern C: mature dual reference
A branch may eventually support both:
- own `atlas_place_id`
- host `host_atlas_place_id`

This is useful for malls, markets, and complexes.

---

## 8. Pulse as event and attendance truth

Pulse must evolve from text-only location semantics toward canonical event location identity.

## 8.1. Pulse source truth
Pulse owns:
- event identity
- event schedule
- publication state
- registration
- attendance truth

## 8.2. Pulse location must not remain text-only forever
A free-text `location` field is not enough for cross-domain scenarios.

To support RF, Quest, Rielt, and Guru properly, Pulse needs stable location identity.

### Minimum future direction
Pulse should be able to associate an event with:
- an Atlas place,
- and optionally a host/container place,
- and optionally a related RF branch/business context.

## 8.3. Event-hosted-by-business scenario
An event may be:

- hosted by a business partner,
- held at a partner branch,
- held inside a container place,
- promoted through RF,
- included in a Quest flow.

This requires separation between:
- event identity,
- venue place identity,
- business host identity.

Pulse owns the event, not the business host.

---

## 8A. Event spatial scope model

Not every Pulse event must resolve to a specific Atlas place.

Pulse events should support different levels of spatial anchoring depending on the nature of the event.  
The platform must distinguish between **place-bound events** and **broad-scope events**.

### 8A.1. Principle

Pulse must not require `atlas_place_id` for every event.  
Instead, each event must have a meaningful **spatial scope**, expressed at the appropriate geographic level.

Atlas remains the canonical geographic substrate, but event linkage to Atlas may happen through:

- place
- container place
- city
- country
- distributed multi-venue scope
- moving route-based scope

### 8A.2. Suggested event spatial scope categories

#### a. `place`
The event is tied to a specific Atlas place.

Examples:
- concert in a bar
- workshop in a coworking space
- dinner event in a restaurant
- open house in a showroom

Expected linkage:
- `atlas_place_id`
- optional `host_place_id`
- optional RF branch/business context

#### b. `container_place`
The event is tied to a host/container place, but not necessarily to a single leaf venue.

Examples:
- fair in a shopping mall
- event in a resort complex
- market event inside a large venue

Expected linkage:
- `atlas_place_id` pointing to a host/container place
- optional child venue context if available later

#### c. `city`
The event is city-wide and should not be artificially reduced to one place.

Examples:
- city festival
- New Year celebrations across the city
- city-wide flower festival
- city-scale religious holiday observances

Expected linkage:
- `city_id`
- optional `country_id`
- no mandatory `atlas_place_id`

#### d. `country`
The event is national or country-scale.

Examples:
- nationwide Buddhist holiday
- Songkran across Thailand
- country-wide public holiday celebrations

Expected linkage:
- `country_id`
- no mandatory `city_id`
- no mandatory `atlas_place_id`

#### e. `distributed`
The event spans multiple venues or multiple places.

Examples:
- festival with many official venues
- city route event
- multi-location cultural week
- event spread across several districts

Expected linkage:
- anchor `city_id` and/or `country_id`
- optional future support for multiple venue bindings
- no forced single `atlas_place_id`

#### f. `moving`
The event has a route or shifting physical location.

Examples:
- parade
- procession
- marathon
- cycling event
- moving street celebration

Expected linkage:
- anchor `city_id` and/or `country_id`
- optional future route geometry/polyline support
- no forced single `atlas_place_id`

### 8A.3. Cross-domain implications

#### Atlas
Atlas remains the source of geographic identity at all relevant levels:
- place
- city
- country
- later, possibly route/container hierarchy

#### RF
RF integration is relevant only for events that are actually tied to:
- a business partner
- a partner branch
- a venue with offer/voucher relevance

Not every Pulse event should have RF semantics.

#### Quest
Quest must not assume that every event is equivalent to a single place visit.

Examples:
- attend a specific venue event
- participate in a city-wide event
- join one official point of a distributed festival
- complete a route-based celebration task

#### Guru
Only events with local discovery relevance should appear in nearby-oriented surfaces.

Examples:
- `place` and `container_place` events are strongly nearby-compatible
- `city` events may appear in city discovery surfaces
- `country`, `distributed`, and `moving` events should be handled carefully to avoid noisy nearby output

### 8A.4. Guardrail

Do not force broad-scope events into fake single-place bindings just to satisfy a place-centric model.  
This would create false geographic precision and weaken event semantics across Pulse, Quest, Guru, and RF.

---

## 9. Quest as progression/proof layer

Quest should not own content truth.  
Quest should reference other domains as targets.

## 9.1. Quest target patterns
Quest steps may target:
- Atlas place
- Pulse event
- RF branch
- Rielt property/listing
- mixed route scenarios

## 9.2. Proof must be source-aware
Quest completion must be validated against source truth where relevant.

Examples:
- attend event -> validated against Pulse participation truth
- visit partner branch -> validated against RF/Atlas-linked logic
- visit location -> Atlas-linked or geo-based rule
- inquiry on property -> Rielt truth

Quest must not rely only on frontend simulation for critical proof.

---

## 10. Rielt as property vertical

Rielt is a specialized vertical domain.

It should not be collapsed into RF, but it should align with the same identity architecture.

## 10.1. Rielt and Atlas
Every meaningful property object should rely on Atlas geography.

Examples:
- building
- condo complex
- residential project
- neighborhood context
- map placement

## 10.2. Rielt and RF
Many Rielt actors are also RF-compatible business actors:

- developers
- agencies
- property managers
- hospitality operators
- rental operators

RF can provide:
- partner layer
- trust layer
- onboarding
- promotions/vouchers
- PRO-mediated relationships

But Rielt retains its own domain logic:
- listing state
- inquiry flow
- property data
- commercial real-estate workflows

## 10.3. Rielt and Pulse
Property-linked events are natural:
- open house
- showroom event
- sales presentation
- investment meetup
- neighborhood tour

This increases the importance of place-linked Pulse identity.

---

## 11. Guru as aggregation/discovery layer

Guru is the biggest consumer of correct cross-domain identity.

## 11.1. Guru should aggregate:
- Atlas places
- RF branches
- Pulse events
- Rielt objects
- Quest targets or quest-aware results

## 11.2. Guru cards should be domain-aware
A nearby result may represent:
- a place,
- a partner branch,
- an event,
- a property,
- a quest-related destination.

The card layer may unify presentation, but source truth must remain domain-owned.

## 11.3. Guru depends on place-linked identity
Without stable place and cross-domain references, Guru becomes:
- mock-heavy,
- adapter-heavy,
- text-join-heavy,
- semantically weak.

---

## 11.4. Space as social and reputation layer

Space Asia should be integrated into the cross-domain model as a **social layer**, **distribution layer**, and **reputation layer**, but not as a source-of-truth domain for geography, partners, events, properties, or quest completion.

### 11.4.1. Role of Space

In the wider platform architecture:

- **Atlas** = where
- **RF** = who operates / who offers
- **Pulse** = what happens and when
- **Quest** = what the user does and how it is verified
- **Rielt** = what property object is offered
- **Guru** = what is relevant nearby
- **Space** = what people say, share, save, repost, discuss, and socially signal about those entities

Space provides:

- user-authored posts
- reposts
- reactions
- social summaries
- thematic groups
- community visibility
- reputation signals
- distribution of canonical entities through social surfaces

Space must not become the owner of source facts from other domains.

### 11.4.2. Space domain ownership vs service implementation

Space Asia should be understood as a **social domain**, not as a single backend service.

The Space domain owns the platform’s social layer conceptually, but this ownership is implemented across multiple services.  
This distinction is important to avoid confusion between:

- **domain ownership**
- **service-level responsibility**

#### Space domain scope

At the domain level, Space includes:

- social publishing
- repost-based distribution
- reactions and interaction signals
- personal and group feed behavior
- thematic groups
- reputation and community context
- user-authored social commentary around canonical entities

This does **not** imply that one technical service stores or manages all of these concepts.

#### Typical service-level distribution

The split below distinguishes **current runtime contour** from **target extraction contour**:

- **Space Service (current social publication contour)**  
  owns post-like social publication objects, including user posts and repost materialization

- **Reactions Service**  
  owns reaction and interaction objects, such as likes, bookmarks, feedback, ratings, short reviews, questions, and thread-style replies

- **Feed Service (target/when extracted)**  
  owns feed composition, distribution, ranking inputs, and user/group feed state  
  (during transitional phases, some feed surfaces may still be delivered by `space-service`)

- **User Service**  
  owns friendship/follow relationships, privacy-relevant social graph state, and identity-level relationship primitives

- **Notification Service**  
  delivers notifications related to social activity, but is not the source of truth for social entities themselves

#### Important clarification on reposts

Repost ownership must remain unambiguous:

- as a **social publication object**, repost belongs to the Space publication context (`space-service`)
- interaction signals around reposts may be handled by Reactions

This is acceptable and does not violate ownership, as long as the distinction between interaction semantics and publication object ownership remains explicit.

#### Important clarification on “comments”

The architecture should avoid assuming a legacy “comments under every object” model as the primary source of social discussion.

Instead, social discussion in Space should be expressed through structured social artifacts such as:

- repost commentary
- short reviews
- feedback
- questions
- thread-style replies
- other reaction-linked discussion forms

This keeps Space aligned with the platform’s move away from fragmented inline comment systems embedded separately into Atlas, RF, Pulse, Rielt, or Quest.

#### Ownership guardrail

When this note says that “Space owns” some social concept, it means:

- the concept belongs to the **Space domain**
- not necessarily to one dedicated backend service

This note must therefore be read as a **domain architecture statement**, not as a one-service storage map.

### 11.4.3. Canonical cross-domain references in Space

Space should support cross-domain references to canonical entities from:

- Atlas place
- RF partner
- RF branch
- Pulse event
- Quest
- Rielt property/listing
- other canonical platform entities where explicitly allowed

However, these references should preferably be expressed through **structured reposts**, not loose text links.

### 11.4.4. Repost-first rule

When a Spacer wants to refer to a canonical entity from another domain, the preferred mechanism is:

- **repost the canonical entity**
- then add personal commentary, context, or opinion around that repost

This is preferred over plain free-text mention because a repost preserves:

- stable canonical identity
- source domain
- canonical title
- canonical media
- canonical location/event/property/partner context
- source-linked metadata that may evolve independently from the social post

Reposts therefore act as **structured social links**.
A repost should be treated as a **social anchor** to a canonical entity, not as a replacement for the canonical entity itself.

### 11.4.5. Why repost-first is important

Repost-first linking reduces architectural drift by ensuring that:

- Space does not become a secondary source of factual truth
- users do not create fragmented shadow copies of places/events/partners/properties
- cross-domain linking stays machine-readable
- other modules can consume social activity without ambiguity
- canonical entities can be updated in their own source domains while retaining identity continuity in Space

### 11.4.6. Free-form posts and canonical attachments

Space may still allow fully free-form posts.  
However, where a post is intended to discuss or promote a canonical entity, the preferred pattern is:

- primary repost
- optional commentary

If free-form posting with attachment is supported later, it should still preserve explicit canonical reference identity.

### 11.4.7. Thematic groups in Space

Thematic groups may be created by:

- PRO users
- admins

A thematic group may be one of two kinds:

#### a. Free thematic group
A group with no required canonical anchor.

Examples:
- “Festival life in Danang”
- “Wintering in Thailand”
- “Buddhist holidays in Southeast Asia”
- “How to live cheaply in Vietnam”

These are community/topic-first groups.

#### b. Canonically anchored group
A group anchored to a specific canonical entity through repost-based binding.

Examples:
- a group around an RF partner
- a group around an Atlas place
- a group around a Pulse event
- a group around a Quest
- a group around a Rielt property/listing

This kind of group should use a **primary canonical anchor**.

### 11.4.8. Primary anchor rule for groups

A canonically anchored group should have:

- one **primary canonical entity** as identity root
- optional future support for secondary related entities

Examples:
- group primary anchor = Pulse event
- group primary anchor = RF partner
- group primary anchor = Atlas place
- group primary anchor = Quest
- group primary anchor = Rielt property/listing

This avoids ambiguous ownership and identity drift.

### 11.4.9. Group creation through repost

When a canonical thematic group is created, the preferred flow is:

- select canonical entity
- create or attach repost
- use repost as primary anchor
- allow group discussion to form around that anchor

This preserves:

- source-truth continuity
- metadata reuse
- consistent linking to related entities
- clearer UX for users and moderators

### 11.4.10. Space as reputation layer

Space should provide reputation and social proof around canonical entities, especially for:

- RF branches and partners
- Pulse events
- Atlas places
- Rielt properties
- Quest-related activities

Examples of social value:
- community discussion
- repost momentum
- user impressions
- saved/liked/shared activity
- visible community engagement

However, social proof must not be confused with source truth.

### 11.4.11. Space and Guru

Guru may optionally consume Space-derived social metadata as **enrichment**, but this must remain:

- optional
- non-blocking
- non-dominant in early nearby ranking

Early Guru ranking should remain primarily driven by:

- geographic relevance
- domain relevance
- freshness/availability
- product/business rules

Space-derived social signals may later be used for:
- enrichment badges
- “discussed in Space”
- “recent community activity”
- weak secondary ranking hints

But Space must not become a required ranking dependency for Guru.

### 11.4.12. Guardrails

1. Do not let Space own source truth for places, events, partners, properties, or quest completion.
2. Do not treat social posts as replacements for canonical entities.
3. Do not rely on free-text mentions when structured repost references are available.
4. Do not let thematic groups become shadow databases of source-domain objects.
5. Do not make Guru dependent on Space signals for core nearby usefulness.
6. Do not confuse social proof with factual verification.
7. Do not treat repost popularity as authoritative truth about safety, quality, or availability.
8. Do not assume that every canonical entity must have a Space-layer anchor.
9. Do not treat a thematic group anchor as a transfer of ownership from the source domain into Space.
10. Do not allow repost-based social shells to become shadow copies of source-domain entities.

---

## 12. Cross-domain reference rules

The following rules should guide cross-domain linking.

## 12.1. Atlas references
Other domains may reference Atlas entities, but Atlas should not absorb their business semantics.

## 12.2. RF references
RF may reference:
- Atlas place
- Pulse event (for related offers/promotions)
- Quest flows
- Rielt objects indirectly where relevant

But RF remains owner only of business presence and voucher flows.

## 12.3. Pulse references
Pulse may reference:
- Atlas place
- RF branch/business host
- Quest relationships
- Rielt context where relevant

But Pulse remains owner only of the event and attendance truth.

## 12.4. Quest references
Quest may reference:
- Atlas
- RF
- Pulse
- Rielt

But Quest owns only progression/proof state and rules.

## 12.5. Rielt references
Rielt may reference:
- Atlas place
- RF partner/business context
- Pulse events
- Quest scenarios

But Rielt owns only property/listing logic.

## 12.6. Guru references
Guru may read all domains and compose nearby/discovery results, but should not become write-owner for any source domain concept.

## 12.7. Space references

Space may reference canonical entities from Atlas, RF, Pulse, Quest, and Rielt, but should do so through structured social attachment rather than loose textual mention wherever possible.

Preferred mechanism:
- repost canonical entity
- add user-authored commentary around that repost

This preserves:
- canonical identity
- source domain
- metadata continuity
- machine-readable cross-domain linkage

A Space reference must not transfer ownership of source truth into the Space domain.

For canonically anchored thematic groups, Space should use:
- one **primary canonical anchor**
- optional future secondary related entities

The primary anchor defines what the group is socially centered around, but does not make Space the source of truth for that entity.

---

## 13. Container / host / branch scenarios

These scenarios are central for Southeast Asia and must be considered first-class.

## 13.1. Shopping mall scenario
- Atlas place: shopping mall (container)
- RF branches: many partner businesses inside
- Pulse events: pop-up fair, performance, special event inside mall
- Quest: visit event + visit partner branch
- Guru: nearby should show host place, branches, events intelligently

## 13.2. Hotel / resort complex scenario
- Atlas place: hotel complex / resort
- RF branches: spa, restaurant, tour desk, beach club
- Pulse events: live music, dinner event, workshop
- Quest: resort activity path
- Rielt: branded residence or investment property context may coexist

## 13.3. Condo / residential project scenario
- Atlas place: condo complex / project
- Rielt: listings and property info
- Pulse: open house / sales event
- RF: developer/agency/management partner
- Quest: promotional route
- Guru: nearby combines property, event, services

## 13.4. Market / walking street scenario
- Atlas place: market / street container
- RF branches: multiple stalls/vendors/shops
- Pulse: market events or live shows
- Quest: food route / local discovery
- Guru: nearby aggregation across all layers

---

## 14. Event-in-partner-venue scenarios

These scenarios require careful ownership separation.

## 14.1. Business-hosted event
A business partner may host an event.

Ownership:
- event -> Pulse
- partner/branch -> RF
- venue place -> Atlas
- proof/quest relation -> Quest
- discovery -> Guru

## 14.2. Event vouchers
A voucher may be related to an event.

Ownership:
- voucher lifecycle -> RF
- event lifecycle -> Pulse

A voucher should not transform Pulse into a voucher domain.
A Pulse event should not transform RF into an event domain.

## 14.3. Event inside branch inside host place
Example:
- event in coffee shop
- coffee shop is an RF branch
- coffee shop is inside mall
- mall is Atlas container place

This is a valid and important scenario.

---

## 15. Voucher and quest interaction boundaries

## 15.1. RF owns voucher lifecycle
RF owns:
- offer creation
- voucher issuance
- claim
- redeem
- voucher status

## 15.2. Pulse may be voucher-related, but not voucher-owned
Pulse may expose or reference event-related voucher availability, but should not own claim/redeem logic.

## 15.3. Quest may reward or depend on vouchers/events, but should not own them
Quest may:
- reference event attendance
- reference voucher usage
- trigger reward logic

But Quest must not become source truth for:
- voucher lifecycle
- event participation
- partner branch identity

---

## 16. Recommended evolution path

This note does not prescribe exact implementation order, but the platform should evolve roughly in this direction:

### Phase A. Fix cross-domain ownership
Document and freeze ownership boundaries.

### Phase B. Align Atlas as geo substrate
Keep Atlas as canonical geo layer.  
Decide whether and when to introduce:
- `parent_place_id`
- `is_container`

### Phase C. Formalize RF partner/business presence model
Establish:
- partner
- business line
- branch
- offers/vouchers
- branch-place rules

### Phase D. Strengthen Pulse location identity
Move from text-only venue semantics toward canonical place-linked event identity.

### Phase E. Strengthen Quest proof rules
Quest should validate event attendance and other cross-domain flows against source truth.

### Phase F. Align Rielt with shared geo/business model
Rielt should reuse geo substrate and partner-compatible rules where useful without losing its vertical domain identity.

### Phase G. Formalize Space as social attachment and reputation layer
Space should standardize repost-first canonical linking, thematic group anchoring, and cross-domain social attachment rules without taking ownership of source-domain truth.

### Phase H. Mature Guru aggregation
Guru should consume stable, place-linked identities from all domains.

---

## 17. What each domain must not own

### Atlas must not own
- partner operations
- voucher lifecycle
- event lifecycle
- quest logic
- property market logic

### RF must not own
- geography
- event lifecycle
- quest progression
- property source truth

### Pulse must not own
- geography
- partner identity
- voucher lifecycle
- quest proof logic
- property truth

### Quest must not own
- place truth
- event truth
- partner truth
- property truth

### Rielt must not own
- geography
- general voucher/event infrastructure
- general quest infrastructure

### Guru must not own
- source truth for any core domain entity

### Space must not own
- place truth
- business partner truth
- branch truth
- event truth
- event attendance truth
- voucher truth
- quest proof truth
- property truth

Space may provide social proof, distribution, discussion, and repost-based context around these entities, but must never become their factual source of truth.

---

## 18. Anti-drift guardrails

1. Do not collapse business identity into Atlas place identity.
2. Do not let RF become a generic marketplace god-domain.
3. Do not let Pulse remain permanently text-only for venue semantics if cross-domain scenarios matter.
4. Do not let Quest validate core proof only through frontend simulation.
5. Do not let Guru become the hidden source of truth for domain joins.
6. Do not force Atlas commercial geography to depend only on RF.
7. Do not merge Rielt into RF even if they share partner/business patterns.
8. Do not mix event ownership and voucher ownership.
9. Do not model container/host scenarios only through prose if machine-readable linking is required.
10. Do not rely on mocks or placeholder adapters as evidence of architectural completeness.

---

## 19. Baseline reference model

A useful mental model for the platform is:

- **Atlas** = where
- **RF** = who sells / who operates
- **Pulse** = what happens and when
- **Quest** = what the user must do and how it is verified
- **Rielt** = what property object is offered
- **Guru** = what is relevant nearby right now
- **Space** = what people say, share, repost, discuss, save, and socially signal

---

## 20. Final architectural statement

Go2Asia should evolve as a layered, cross-domain ecosystem where Atlas provides canonical geographic identity, RF provides partner and business presence, Pulse provides event truth, Quest provides progression and proof, Rielt provides property vertical logic, Guru aggregates these domains into a unified nearby/discovery experience, and Space provides the social, repost, reputation, and community layer around canonical entities.

Cross-domain scenarios such as partner-hosted events, vouchers tied to venues, property-linked events, socially amplified discovery, and quest-driven journeys require stable place-linked identity, structured canonical references, and explicit domain ownership boundaries.