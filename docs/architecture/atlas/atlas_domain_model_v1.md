# Atlas Service — Domain Model v1

**Project:** Go2Asia  
**Domain:** Atlas / Atlas Asia  
**Document role:** SSOT domain model for `atlas-service`  
**Status:** Draft v1  
**Purpose:** Define the canonical Atlas domain boundary, entities, relationships, invariants, and ownership rules before OpenAPI and implementation alignment.

---

## 1. Purpose

This document defines the canonical domain model for `atlas-service`.

`atlas-service` is the **geographic and place truth domain** of Go2Asia.

Atlas is the domain that answers:

- what geographic units exist in the ecosystem;
- what countries, regions, cities, districts, and places are canonically recognized;
- how those geographic objects relate to each other;
- how places are typed and positioned in the geographic hierarchy;
- which object is the canonical geo/place reference for other services.

Atlas is not merely a content module and not merely a guide frontend.  
It is the **system of record for geographic and place identity** across the ecosystem.

This document intentionally establishes Atlas as the geo substrate that other domains reference but do not own.

---

## 2. Architectural Role of Atlas

Atlas is the canonical geo/place bounded context of Go2Asia.

In product terms, Atlas provides the spatial and location model that the rest of the ecosystem depends on.

Atlas makes it possible for other modules to answer questions such as:

- where is this event?
- where is this partner branch?
- what city or district does this object belong to?
- what places exist nearby or inside one another?
- what is the canonical location identity behind a guide, event, branch, listing, or quest target?

### 2.1 Atlas is

Atlas is:

- the owner of country identity;
- the owner of region/province/state identity where applicable;
- the owner of city identity;
- the owner of district/neighborhood identity where modeled;
- the owner of place identity;
- the owner of place hierarchy and containment;
- the owner of canonical geo slugs and stable IDs;
- the owner of geo-linked guide content as Atlas-native content objects;
- the canonical geo substrate for the platform.

### 2.2 Atlas is not

Atlas is not:

- the owner of partner/business presence;
- the owner of event lifecycle;
- the owner of quest progression;
- the owner of real-estate listing truth;
- the owner of social posts;
- the owner of voucher or reward logic;
- the owner of generic knowledge graph for all domains;
- the owner of user-generated reviews as platform-wide truth.

Other domains remain responsible for their own truth:

- RF owns partner/business presence and vouchers.
- Pulse owns event lifecycle.
- Quest owns progression/proof.
- Rielt owns listing/property truth.
- Space owns social publication/distribution.
- Points owns reward ledger logic.

Atlas may be referenced by all of them, but must not absorb their ownership.

---

## 3. Domain Boundary

## 3.1 What `atlas-service` owns

`atlas-service` owns:

- countries;
- regions/provinces/states where applicable;
- cities;
- districts/neighborhoods where applicable;
- canonical places;
- place type classification;
- place hierarchy and containment;
- place-to-city/district/country linkage;
- optional host/container semantics at place level;
- Atlas-native guide content attached to Atlas entities;
- publication and moderation state for Atlas content objects;
- canonical slugs and stable geo/place identity.

---

## 3.2 What `atlas-service` does not own

`atlas-service` does not own:

- partner branches and business lines;
- offers and vouchers;
- event schedules, registration, attendance;
- quest completion state;
- social posts, comments, groups;
- listing inventory and inquiry flows;
- wallet/balance/token state;
- global platform search ranking;
- downstream recommendation logic.

---

## 3.3 Atlas as reference domain

Atlas is primarily a **reference domain** for the ecosystem.

This means other domains should typically use Atlas IDs and slugs as references instead of creating their own parallel place identities.

Examples:

- RF branch references `atlasPlaceId` or `hostAtlasPlaceId`
- Pulse event references `atlasPlaceId`
- Quest target may reference `atlasPlaceId`
- Rielt object may reference district/city/place IDs
- Guru consumes Atlas place projections
- Space may attach posts to Atlas-linked context

---

## 4. Core Domain Concepts

## 4.1 Geography vs place

Atlas must distinguish between **geographic units** and **places**.

Geographic units are administrative or spatial containers:
- country
- region/province/state
- city
- district/neighborhood

Places are concrete or semantically meaningful locations:
- beach
- mall
- cafe
- hospital
- school
- walking street
- park
- market
- temple
- condo complex
- resort
- airport
- viewpoint

This distinction is essential.  
A city is not the same thing as a place, and a place may exist inside another place.

---

## 4.2 Atlas as identity layer, not just prose content

Atlas is not only guide text.

Atlas is the domain that provides canonical identity objects.  
Guide content is attached to those objects, but does not replace them.

For example:

- `Phuket` as city identity is not the same thing as a city guide article
- `Central Phuket` as place identity is not the same thing as its long-form writeup
- `Patong` as district identity is not the same thing as a district guide page

Atlas must therefore separate:
- canonical entity record;
- Atlas-native content payload or guide representation.

---

## 4.3 Place vs host/container place

Atlas must support place containment.

A place may be:
- standalone;
- inside a larger host place;
- both independently meaningful and contained by another place.

Examples:
- a cafe inside a mall;
- a clinic inside a hospital complex;
- a restaurant inside a resort;
- a stall inside a market;
- a tower inside a condo project.

This is critical because multiple other modules depend on this semantics.

---

## 5. Canonical Entity Set

The recommended canonical Atlas entity set is:

- `AtlasCountry`
- `AtlasRegion`
- `AtlasCity`
- `AtlasDistrict`
- `AtlasPlace`
- `AtlasPlaceType`
- `AtlasPlaceRelation`
- `AtlasGuideContent`
- `AtlasMediaRef` (supporting)
- `AtlasModerationCase` (supporting)

These entities provide the minimal domain foundation for Atlas as a platform reference service.

---

## 6. Entity Definitions

## 6.1 `AtlasCountry`

Represents a country in the Atlas domain.

### Purpose
Top-level geographic anchor for cities, regions, districts, and places.

### Core fields
- `id`
- `slug`
- `code`
- `display_name`
- `native_name` optional
- `status`
- `publication_status`
- `latitude` optional
- `longitude` optional
- `created_at`
- `updated_at`
- `published_at` optional

### Notes
A country is a geo identity object first.  
Guide text, hero image, and structured guide sections belong to attached Atlas content, not to the identity concept itself.

---

## 6.2 `AtlasRegion`

Represents a country subdivision where applicable.

Examples:
- province
- state
- region
- territory

### Purpose
Intermediate administrative/spatial layer between country and city where relevant.

### Core fields
- `id`
- `country_id`
- `slug`
- `display_name`
- `native_name` optional
- `region_type`
- `status`
- `publication_status`
- `created_at`
- `updated_at`
- `published_at` optional

### Notes
Not every country must use regions.  
Atlas must allow this layer to be optional.

---

## 6.3 `AtlasCity`

Represents a city or major urban locality.

### Purpose
Primary urban anchor used by most downstream modules.

### Core fields
- `id`
- `country_id`
- `region_id` optional
- `slug`
- `display_name`
- `native_name` optional
- `status`
- `publication_status`
- `latitude` optional
- `longitude` optional
- `timezone` optional
- `created_at`
- `updated_at`
- `published_at` optional

### Notes
City is one of the most reused Atlas entities and should be treated as a stable reference object for the rest of the ecosystem.

---

## 6.4 `AtlasDistrict`

Represents a district, neighborhood, area, or local subdivision inside a city.

### Purpose
Finer-grained urban layer for place grouping, discovery, listings, partner branches, and local guides.

### Core fields
- `id`
- `country_id`
- `region_id` optional
- `city_id`
- `slug`
- `display_name`
- `native_name` optional
- `district_type` optional
- `status`
- `publication_status`
- `latitude` optional
- `longitude` optional
- `created_at`
- `updated_at`
- `published_at` optional

### Notes
District is optional in some geographies, but where present it becomes an important reference layer for RF, Pulse, Rielt, and Guru.

---

## 6.5 `AtlasPlaceType`

Represents normalized type classification for places.

Examples:
- cafe
- restaurant
- beach
- hospital
- mall
- market
- condo
- school
- museum
- airport
- temple
- park

### Purpose
Allows consistent typing of places without embedding type chaos in each place record.

### Core fields
- `id`
- `code`
- `display_name`
- `parent_type_code` optional
- `status`
- `created_at`
- `updated_at`

### Notes
Place types should support hierarchy or grouping, but Atlas should avoid overcomplicating taxonomy in v1.

---

## 6.6 `AtlasPlace`

Represents a canonical place identity.

This is one of the most important Atlas entities.

### Purpose
Provide a stable identity for concrete, meaningful, or referencable locations used across the ecosystem.

### Core fields
- `id`
- `country_id`
- `region_id` optional
- `city_id`
- `district_id` optional
- `slug`
- `display_name`
- `native_name` optional
- `place_type_id`
- `status`
- `publication_status`
- `verification_status` optional
- `latitude` optional
- `longitude` optional
- `address_text` optional
- `host_place_id` optional
- `is_container`
- `is_landmark`
- `created_at`
- `updated_at`
- `published_at` optional

### Notes
Place identity is not owned by RF, Pulse, Rielt, or Quest.  
It is owned by Atlas and referenced by those domains.

---

## 6.7 `AtlasPlaceRelation`

Represents explicit relation between places.

### Purpose
Capture spatial or semantic relationships not fully expressible via simple `host_place_id`.

Examples:
- inside
- near
- part_of
- entrance_of
- terminal_of
- building_of
- wing_of

### Core fields
- `id`
- `from_place_id`
- `to_place_id`
- `relation_type`
- `status`
- `created_at`

### Notes
`host_place_id` covers the common containment pattern, while `AtlasPlaceRelation` supports richer semantics when needed.

---

## 6.8 `AtlasGuideContent`

Represents Atlas-native structured content attached to a geo/place entity.

### Purpose
Store guide-facing canonical content while keeping identity separate from article payload.

### Core fields
- `id`
- `entity_kind`
- `entity_id`
- `version`
- `locale`
- `status`
- `publication_status`
- `title`
- `subtitle` optional
- `summary` optional
- `body_structured` optional
- `seo_title` optional
- `seo_description` optional
- `created_at`
- `updated_at`
- `published_at` optional

### Entity kinds
- `country`
- `region`
- `city`
- `district`
- `place`

### Notes
This allows Atlas to remain both:
- canonical geo identity layer;
- guide content domain.

But content must remain attached to canonical entity identity, not replace it.

---

## 6.9 `AtlasMediaRef`

Represents a reference to media assets linked to an Atlas entity or guide content.

### Purpose
Support hero/gallery/media usage without making Atlas the binary storage system itself.

### Core fields
- `id`
- `entity_kind`
- `entity_id`
- `guide_content_id` optional
- `media_kind`
- `media_key`
- `sort_order`
- `status`
- `created_at`

### Notes
Atlas may own semantic linkage of media, but not low-level media storage binary truth.

---

## 6.10 `AtlasModerationCase`

Represents moderation/review support for Atlas content/entity publication.

### Purpose
Support review lifecycle for canonical content and place visibility.

### Core fields
- `id`
- `entity_kind`
- `entity_id`
- `case_type`
- `status`
- `reviewer_user_id` optional
- `reason_note` optional
- `created_at`
- `updated_at`
- `resolved_at` optional

---

## 7. Atlas Identity Hierarchy

The primary geographic hierarchy is:

- Country
  - Region (optional)
    - City
      - District (optional)
        - Place

However, Atlas must not assume every country uses the full chain.

Allowed variations:

- Country → City → Place
- Country → Region → City → Place
- Country → City → District → Place
- Country → Region → City → District → Place

The hierarchy must be flexible, but the ownership model must remain canonical.

---

## 8. Place Containment and Host Semantics

Atlas must support **container/host semantics** as first-class domain behavior.

## 8.1 Standalone place
Example:
- beach
- hospital
- mall
- airport
- standalone cafe

Modeled as:
- place with no host place

## 8.2 Place inside host/container place
Example:
- shop inside mall
- restaurant inside resort
- clinic inside hospital complex
- tower inside condo project

Modeled as:
- place with `host_place_id`

## 8.3 Dual meaningful identity
Some places are both:
- meaningful individually;
- and part of another place.

Example:
- a famous restaurant inside a famous resort.

Atlas must allow:
- child place identity;
- explicit host/container relation.

This is critical for RF branches, Pulse events, Guru nearby logic, and Rielt project semantics.

---

## 9. Canonical Place Rules

Atlas places must follow these rules.

### 9.1 Place identity rule
A place must have one canonical identity record in Atlas.

### 9.2 City anchoring rule
A place must belong to exactly one canonical city.

### 9.3 Country anchoring rule
A place must belong to exactly one canonical country.

### 9.4 District optionality rule
A place may belong to zero or one district.

### 9.5 Type rule
A place must have one normalized place type.

### 9.6 Host rule
A place may reference zero or one direct host place in the common containment model.

### 9.7 Publication rule
A place may exist in draft/unpublished state before public exposure.

---

## 10. Content Attachment Rules

Atlas content must be attached to Atlas entities, not replace them.

### 10.1 Identity before content
A city/place object must exist before its guide content can exist.

### 10.2 One entity, multiple content versions
The same entity may have:
- different locales;
- multiple versions;
- draft and published content states.

### 10.3 Structured content preference
Atlas content should prefer structured sections over unbounded prose blobs where practical.

### 10.4 SEO/public surface distinction
Atlas entity identity is canonical backend truth.  
SEO pages and rendered guide pages are downstream surface representations.

---

## 11. Publication and Verification Model

Atlas should distinguish at least:

- entity status
- publication status
- verification status where relevant

### Entity status
Operational lifecycle example:
- `draft`
- `active`
- `archived`

### Publication status
Visibility lifecycle example:
- `hidden`
- `published`

### Verification status
Trust/review lifecycle example:
- `unverified`
- `verified`
- `flagged`
- `rejected`

Not every Atlas entity may need all three immediately, but the model should allow separation.

---

## 12. Atlas and RF Relationship

RF depends on Atlas as geo/place truth.

### Atlas owns
- countries
- cities
- districts
- places
- host/container place truth

### RF owns
- business partners
- partner branches
- offers
- vouchers
- PRO links

### Allowed relation
RF stores Atlas references such as:
- `countryId`
- `cityId`
- `districtId`
- `atlasPlaceId`
- `hostAtlasPlaceId`

### Forbidden drift
RF must not create its own canonical place system.

This makes Atlas the stable geo substrate for RF.

---

## 13. Atlas and Pulse Relationship

Pulse depends on Atlas for venue/place truth.

### Atlas owns
- place identity and hierarchy

### Pulse owns
- event identity
- schedule
- attendance
- registration lifecycle

### Allowed relation
Pulse event may reference:
- country/city/district
- `atlasPlaceId`

### Forbidden drift
Pulse must not become canonical owner of venue/place identity.

---

## 14. Atlas and Quest Relationship

Quest may use Atlas places as route nodes or visit targets.

### Atlas owns
- place/city/district identity

### Quest owns
- quest definitions
- progression
- completion
- proof logic

### Allowed relation
Quest may reference Atlas entities as:
- targets
- stops
- location anchors

### Forbidden drift
Quest must not duplicate Atlas place truth or invent competing place identity.

---

## 15. Atlas and Rielt Relationship

Rielt depends on Atlas for location truth of listings and projects.

### Atlas owns
- geographic hierarchy
- place identity
- district/city/country truth
- host/container project place identity if modeled as place

### Rielt owns
- property/listing truth
- inquiry lifecycle
- commercial listing data

### Allowed relation
Rielt entities may reference:
- country/city/district IDs
- project/complex place IDs
- neighborhood place IDs

### Forbidden drift
Rielt must not become a parallel geography service.

---

## 16. Atlas and Space Relationship

Space may circulate Atlas-linked content socially, but must not own Atlas truth.

### Allowed patterns
- posts attached to city/place context
- shared guides
- commentary around places

### Forbidden pattern
Space must not become source of truth for place or city identity.

---

## 17. Atlas and Guru Relationship

Guru is a read/composition layer and strongly depends on Atlas.

### Atlas provides
- place truth
- city/district truth
- place containment semantics
- guide content substrate

### Guru consumes
- nearby place projections
- city/place cards
- contextual geo info

### Forbidden drift
Guru must not own canonical place identity or ranking-backed fake truth.

---

## 18. Domain Invariants

The following invariants are mandatory.

### 18.1 Country invariant
Country slug must be unique.

### 18.2 Region invariant
Region must belong to exactly one country.

### 18.3 City invariant
City must belong to exactly one country and at most one region.

### 18.4 District invariant
District must belong to exactly one city and one country.

### 18.5 Place invariant
Place must belong to exactly one city and one country.

### 18.6 Place type invariant
Place must have exactly one normalized place type.

### 18.7 Host containment invariant
A place may have at most one direct host place in the primary containment model.

### 18.8 Guide content invariant
Guide content must reference an existing Atlas entity.

### 18.9 Canonical slug invariant
Slugs must be unique within their entity class under the chosen uniqueness strategy.

### 18.10 Publication invariant
Published public Atlas entity/content must reference complete enough canonical identity state.

---

## 19. Read Model Direction

Atlas write truth should remain normalized around:

- countries
- regions
- cities
- districts
- places
- guide content

Read models may later project:

- city cards
- place cards
- guide pages
- place breadcrumb trees
- district summary cards
- nearby place lists
- host/container place composites

These are read conveniences only.  
They do not redefine Atlas ownership.

---

## 20. Atlas as Canonical Reference Layer

The shortest correct formula for Atlas is:

> Atlas is the canonical geographic and place identity domain of Go2Asia.

This means Atlas should be treated by the ecosystem as:

- stable ID authority for geo/place references;
- stable slug authority for geo-facing URLs where appropriate;
- canonical owner of place hierarchy and containment;
- owner of Atlas-native guide content attached to canonical entities.

---

## 21. Non-Goals for v1

This v1 Atlas domain model intentionally does **not** introduce:

- partner/business truth;
- event lifecycle;
- quest lifecycle;
- listing/inquiry truth;
- social truth;
- generic graph database for all modules;
- review/rating platform-wide ownership;
- recommendation/ranking ownership;
- wallet/token ownership;
- global search ownership.

Atlas may support these domains through references, but must not absorb them.

---

## 22. Final Domain Formula

The shortest correct domain formula for Atlas is:

> **Atlas is the geo/place truth domain of Go2Asia.**  
> It owns countries, regions, cities, districts, places, place hierarchy, place containment, and Atlas-native guide content attached to canonical geo/place entities.  
> Other services reference Atlas; they do not replace it.

---

## 23. Most Important Conclusion

Atlas must not be implemented as:

- only a content CMS,
- only a guide frontend,
- only a folder of markdown files,
- or a thin helper service for other modules.

Atlas must be implemented as a real bounded context with:

- canonical geographic identity;
- canonical place identity;
- place containment semantics;
- attached guide content;
- stable cross-domain reference value.

That is the correct domain baseline for `atlas-service`.