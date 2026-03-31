# Geo Canon v1
## Go2Asia — canonical geo model for MVP / Phase 2 delivery

**Status:** Draft for SSOT discussion  
**Scope:** Atlas / Pulse / Blog / Space / Quest / Rielt / Guru / RF / supporting domain contracts  
**Purpose:** establish a single geo reference model for the ecosystem without introducing a separate geo-service at this stage

---

## Purpose

`Geo Canon v1` defines the canonical way geography must be represented across Go2Asia services and modules.

Its goals are:

- keep **Atlas** as the current geography source of truth for MVP / current Phase 2 work;
- ensure all new and existing domains use compatible normalized geo references;
- support `nearby` and cross-domain aggregation for `Guru`;
- support practical domains such as `Rielt` and partner/location flows in `RF`;
- prepare the platform for `Knowledge Graph MVP` without prematurely building a standalone geo layer.

This canon is intentionally **MVP-realistic**:

- it does **not** introduce a separate `geo-service`;
- it does **not** require a graph database;
- it does **not** require a full ontology engine;
- it **does** require stable geo entities, normalized references, coordinates where needed, and consistent contracts across services.

### Core principle

The platform must treat geography through the following canonical hierarchy:

`Country -> City -> District -> Place -> Coordinates`

Where:

- `Country`, `City`, `District`, `Place` are first-class geo-capable entities;
- `coordinates` support nearby, geo checkpoints, viewport logic, map-based UX, and later geo-layer extraction;
- `Atlas` remains the current authoritative source of geo identity.

---

## Canonical vs Bridge-Compatible Adoption

Geo Canon v1 defines the **target contract** for geography across the ecosystem.

This document does **not** imply that all current live data already fully conforms to that target.  
During migration and enrichment, some records may remain in a **bridge-compatible** state.

### Full canonical state
A record is fully canonical when:
- it references normalized geo entities through stable IDs where required;
- its hierarchy is consistent (`country -> city -> district -> place`, where applicable);
- required coordinates are present for the operational use case;
- free-text geography is not used as the source of truth.

### Bridge-compatible state
A record may be considered bridge-compatible for one execution cycle when:
- public routing slugs are present and operationally usable;
- some FK references are temporarily missing but do not contradict the canonical geo meaning;
- district-level enrichment is not yet complete;
- legacy display fields still exist but are treated as non-canonical;
- the record is explicitly tracked as migration/enrichment debt.

### Important rule
Bridge-compatible state is a temporary operational allowance.  
It must not be treated as a competing canonical model.

---

## Target Contract Status

Geo Canon v1 is the **canonical target contract** for geography across Go2Asia.

It defines:
- how geo entities should be modeled,
- how downstream modules should reference them,
- what must be treated as canonical,
- and what must not be treated as source of truth.

Geo Canon v1 does **not** claim that the current live Atlas / Pulse / Blog / downstream data already fully conforms to this model.

Live conformance must be assessed separately through:
- data audits,
- bounded correction plans,
- enrichment passes,
- and downstream adoption work.

In other words:

- **Geo Canon v1 = target contract**
- **live data = conformance subject**

---

## Conformance Evaluation Rule

Geo Canon v1 defines the target contract, but operational rollout must be evaluated separately.

Conformance should be assessed per contour as one of:
- fully canonical
- bridge-compatible
- partially conformant
- non-conformant

This allows the platform to evolve toward the canon without confusing target rules with current live state.

---

## Entities

## 1. Country

Top-level geo entity.

### Role
Used for:
- country pages in Atlas;
- country-level grouping and filtering;
- cross-domain normalization for places, events, partners, listings, and posts.

### Required fields
- `id`
- `slug`
- `name_ru`
- `name_en`
- `coordinates_lat`
- `coordinates_lng`
- `canonical_status`
- `updated_at`

### Optional fields
- `iso2`
- `iso3`
- `timezone_default`
- `source_type`
- `trust_score`
- `freshness_score`
- `created_by`

---

## 2. City

Primary geo bucket for most ecosystem flows.

### Role
Used for:
- Atlas city pages;
- Pulse event linking;
- Blog / Space geo linking;
- Rielt listings;
- Guru aggregation;
- RF partner locations.

### Required fields
- `id`
- `country_id`
- `slug`
- `name_ru`
- `name_en`
- `coordinates_lat`
- `coordinates_lng`
- `canonical_status`
- `updated_at`

### Optional fields
- `alt_names_json`
- `timezone`
- `viewport_json`
- `source_type`
- `trust_score`
- `freshness_score`
- `created_by`

---

## 3. District

`District` is the canonical **sub-city or sub-region geo layer** used to represent meaningful localized zones inside a broader geo parent.

A district is **not limited to an official administrative city district**.  
In Go2Asia, `District` may represent any stable, user-meaningful, geo-coherent zone that is smaller than its parent geo entity and useful for navigation, filtering, nearby logic, listings, partner placement, recommendations, and social geo-tagging.

### A district may represent:
- an intra-city district or neighborhood,
- a named urban zone,
- a waterfront / old town / business / nightlife / expat area,
- a resort zone,
- a beach area,
- a peninsula / bay-side zone,
- a meaningful sub-island area,
- another stable local area that functions as a practical geographic unit for the product.

### Parent rule
A district must belong to exactly one canonical parent geo entity.

Its parent may be:
- a `city`, where city-level structure exists and is meaningful;
- or another canonical geo container explicitly allowed by the model (for example an island-level or territory-like parent), where city structure is weak, absent, or not the most useful operational layer.

### District rules
- `district.id` must be stable.
- `district.slug` should be stable for routing.
- `district.title` must be human-readable.
- `district` should have coordinates (centroid acceptable during bridge-compatible stages).
- `district` must not be invented ad hoc in downstream modules.
- free-text local area labels must not compete with canonical district entities once a district exists.
- if district-level precision is operationally important for a use case, downstream modules should reference `district_id`.

### Product meaning
`District` is a **canonical local zone layer**, not merely an administrative label.

Its purpose is to make the ecosystem geographically consistent and operationally useful across:
- Atlas,
- Pulse,
- Rielt,
- RF,
- Space,
- Guru,
- Quest.

### Bridge-compatible note
During migration or enrichment, some records may still lack district linkage.
That state should be treated as **explicit geo-enrichment debt**, not as permission to recreate competing free-text geography.

---

## 4. Place

`Place` is the most concrete canonical geo-linked object in the Atlas layer.

A place should reference:
- `country_id`
- `city_id` where city-level placement is meaningful
- `district_id` where district-level precision exists and matters for the use case

### Place rules
- `place.id` must be stable.
- `place.slug` should be stable for public routing.
- `country_id` is required.
- `city_id` is strongly recommended and should be treated as required where city context is meaningful.
- `district_id` is required where a canonical district layer exists and is relevant to the use case.
- `district_id` may remain nullable during bridge-compatible enrichment stages, but this must be treated as explicit geo-enrichment debt.
- `lat/lng` should be treated as operationally required for map/nearby/location-aware surfaces.

---

## 5. Coordinates Policy

Coordinates are required, but their required precision depends on the geo layer and use case.

### Country
- Country coordinates should exist.
- Country-level coordinates may be represented by a centroid.

### City
- City coordinates should exist.
- City-level coordinates may be represented by a centroid unless a more precise representation is needed.

### District
- District coordinates should exist where district-level routing/filtering/nearby behavior is part of the product.
- A centroid is acceptable during bridge-compatible stages.

### Place
- Place coordinates are operationally important.
- For place-level nearby, map rendering, listing/partner attachment, and event-location association, `lat/lng` should be treated as required.
- Missing place coordinates must be treated as data-quality debt and explicitly tracked.

### General rule
Coordinates must not be silently invented.  
If missing, they must be marked as missing/enrichment-required rather than guessed.

---

## 6. Metadata layer for geo entities

This is intentionally aligned with `Knowledge Graph MVP` metadata principles.

### Required minimum
- `canonical_status`
- `updated_at`

### Recommended metadata
- `source_type`
- `trust_score`
- `freshness_score`
- `created_by`

### Allowed `canonical_status` values
- `canonical`
- `user_generated`
- `pending_review`

### Allowed `source_type` values
- `editorial`
- `space`
- `blog`
- `partner`
- `imported`

---

## Field Contract

## 1. Canonical geo reference block

All geo-aware services must converge on the following normalized reference contract:

```json
{
  "country_id": "country_thailand",
  "city_id": "city_phuket",
  "district_id": "district_patong",
  "place_id": "place_blue_mango_cafe",
  "coordinates": {
    "lat": 7.8981,
    "lng": 98.2987
  }
}
```

### Note on ID examples
Example IDs in this document are illustrative.
The canon requires stability and uniqueness, not a mandatory literal prefixing scheme.
If the platform adopts a formal ID convention, it should be documented separately.

### Contract rules
- `country_id` is required for all geo-aware entities.
- `city_id` is required for all geo-aware entities below country level.
- `district_id` is required wherever the object participates in an intra-city experience and district meaningfully exists.
- `place_id` is optional unless the entity is tied to a specific concrete location.
- `coordinates` are required for geo-proximity scenarios.

---

## 2. Stable IDs vs slugs vs display text

### `id`
- canonical internal reference;
- stable across services;
- must not depend on UI language.

### `slug`
- intended for URLs and routing;
- may change carefully if needed;
- must not be the only source of identity.

### display text
- used for UI only;
- must not be the canonical join key.

---

## 3. Identity/content split

Geo entities should conceptually support two layers:

### Identity layer
- `id`
- `parent references`
- `slug`
- `coordinates`
- `canonical_status`
- metadata fields

### Content layer
- article/description blocks
- editorial media
- guides
- tips
- curated sections

This means Atlas should be treated not only as “content pages”, but as a combination of:
- geo identity layer;
- content projection layer.

---

## 4. Minimum normalized fields in full canonical state

| Entity   | Required refs                         | Required coords | Notes |
|----------|---------------------------------------|-----------------|-------|
| Country  | none                                  | yes             | centroid acceptable |
| City     | `country_id`                          | yes             | city centroid minimum |
| District | `country_id`, `city_id`               | yes             | district centroid minimum |
| Place    | `country_id`, `city_id`, `district_id`| yes             | exact or approximate per privacy rules |
| Event    | `country_id`, `city_id`; `place_id` if applicable | yes | exact venue preferred |
| Listing  | `country_id`, `city_id`, `district_id` | yes | exact internal coords allowed even if UI masks precision |
| Partner location | `country_id`, `city_id`, `district_id`; `place_id` if applicable | yes | multi-location partners allowed |
| Space post | `city_id` required; `place_id` optional | optional | geo derived from linked entities where needed |
| Blog post | `country_id` and/or `city_id`; `place_id` optional | optional | editorial geo linkage |
| Quest step | target refs + coords when needed | yes for geo checkpoint | depends on target type |

---

## Service Rules

## 1. Atlas

### Role
Atlas remains the current geography source of truth for the ecosystem.

### Rules
- Atlas owns canonical `Country`, `City`, `District`, `Place` identity.
- Other services must reference Atlas-compatible geo IDs.
- Atlas content pages must not be treated as the only geo representation; geo identity must be conceptually separable from content blocks.
- New geo-aware domains must not invent incompatible geo DTOs.

### Atlas must guarantee
- stable geo IDs;
- normalized parent hierarchy;
- coordinates on all main geo layers;
- compatibility with nearby and future geo extraction.

---

## 2. Pulse

### Role
Pulse is the event domain.

### Rules
- Every event should converge toward canonical geo references.
- `city_id` is required in the full canonical state.
- During bridge-compatible migration stages, `city_slug` may remain operationally usable where `city_id` is still missing, provided no geo contradiction exists.
- `place_id` is strongly preferred where a concrete venue exists.
- `district_id` is required where the venue is district-specific and a canonical district exists.
- free-text address may exist as display/helper only.
- event coordinates are required for nearby and map use cases, and should be treated as enrichment-required where still missing.

### Consistency rule
If `place_id` exists, event geo fields must be consistent with the linked place.

---

## 3. Blog and Geo Linking

Blog content should be geo-linkable **where geography is part of the editorial object**.

Geo linking for Blog should follow these principles:

- Country-level posts should reference `country_id` where country identity is central to the post.
- City-level posts should reference `city_id` where city identity is central to the post.
- Place-specific posts should reference `place_id` where the post is materially about a specific place.
- District-level linkage should be used where district precision matters editorially and a canonical district exists.

### Important limitation
Geo Canon v1 does not require every blog post to be forced into place-level granularity.

The practical minimum is:
- country linkage for country-level editorial content,
- city linkage for city-specific editorial content,
- place linkage where the editorial object is clearly place-bound.

Blog must not become a driver for giant geo correction scope.  
It should adopt the canonical geo layer progressively and truthfully.

---

## 4. Space

### Role
Space is the social/UGC layer.

### Rules
- `city_id` is required for geo-aware posts.
- `place_id` is optional but strongly encouraged for place-based posts.
- `primary_topic_id` should coexist with geo linking.
- Space does not own geo truth; it references canonical geo entities.
- UGC geo linking must use normalized entities instead of free-text if possible.

This aligns with KG MVP linking guidance: user content should be attached to city/place/topic via simple linking rather than heavy AI.

---

## 5. Quest

### Role
Quest is the gamification engine.

### Rules
- Quest steps that reference location must use canonical geo targets.
- `target_type` and `target_id` are required for place/event/partner-linked steps.
- `coordinates` and `radius_meters` are required for geo checkpoint steps.
- Quest does not own geo identity.

---

## 6. Rielt

### Role
Rielt is the practical listing/discovery layer for housing-related surfaces in the ecosystem.

### Rules
- Listings must use normalized geo references.
- `country_id`, `city_id`, and `district_id` are required.
- `coordinates` are required for nearby and Guru projections.
- `place_id` is optional where the listing is tied to a canonical place or partner location.
- listing location must not live only as free-text.

### Precision/privacy rule
Exact coordinates may be stored internally while UI exposes lower precision if needed.

---

## 7. RF

### Role
RF is the partner hub / partial marketplace layer.

### Rules
- Partner profiles and partner locations must be separated conceptually.
- A partner may have multiple locations.
- Partner locations must use canonical geo references.
- Offer/voucher targets must be geo-linkable where relevant.
- RF does not invent its own incompatible geo identity system.

---

## 8. Guru

### Role
Guru is an aggregation/BFF layer, not a geo source of truth.

### Rules
- Guru reads geo-aware entities from upstream domains.
- Every Guru card must expose a normalized geo projection.
- Nearby ranking depends on canonical coordinates.
- Guru must not become a hidden source of alternative geo truth.

### Guru card geo contract
- `target_type`
- `target_id`
- `country_id`
- `city_id`
- `district_id`
- `place_id` (if any)
- `coordinates`
- `distance_meters` (when queried nearby)
- `geo_source`

---

## 9. Notifications / Reactions / Thread-style services

### Role
These services are not geo sources of truth.

### Rules
- They may store geo-linked target references.
- They must reference canonical targets.
- They must not introduce independent geo identity fields as source of truth.

---

## Examples

## 1. Country example

```json
{
  "id": "country_thailand",
  "slug": "thailand",
  "name_ru": "Таиланд",
  "name_en": "Thailand",
  "iso2": "TH",
  "iso3": "THA",
  "coordinates_lat": 15.8700,
  "coordinates_lng": 100.9925,
  "canonical_status": "canonical",
  "source_type": "editorial"
}
```

---

## 2. City example

```json
{
  "id": "city_phuket",
  "country_id": "country_thailand",
  "slug": "phuket",
  "name_ru": "Пхукет",
  "name_en": "Phuket",
  "coordinates_lat": 7.8804,
  "coordinates_lng": 98.3923,
  "canonical_status": "canonical",
  "source_type": "editorial"
}
```

---

## 3. District example

```json
{
  "id": "district_patong",
  "country_id": "country_thailand",
  "city_id": "city_phuket",
  "slug": "patong",
  "name_ru": "Патонг",
  "name_en": "Patong",
  "coordinates_lat": 7.8966,
  "coordinates_lng": 98.2966,
  "canonical_status": "canonical",
  "source_type": "editorial"
}
```

---

## 4. Place example

```json
{
  "id": "place_blue_mango_cafe",
  "country_id": "country_thailand",
  "city_id": "city_phuket",
  "district_id": "district_patong",
  "slug": "blue-mango-cafe-patong",
  "name": "Blue Mango Cafe",
  "place_type": "cafe",
  "coordinates_lat": 7.8981,
  "coordinates_lng": 98.2987,
  "canonical_status": "canonical",
  "source_type": "partner"
}
```

---

## 5. Pulse event example

```json
{
  "id": "event_lantern_festival_2026",
  "country_id": "country_vietnam",
  "city_id": "city_hoi_an",
  "district_id": "district_old_town",
  "place_id": "place_old_town_square",
  "coordinates_lat": 15.8794,
  "coordinates_lng": 108.3380,
  "starts_at": "2026-05-14T18:00:00Z",
  "ends_at": "2026-05-14T22:00:00Z"
}
```

---

## 6. Blog post example

```json
{
  "id": "blog_best_breakfasts_in_patong",
  "country_id": "country_thailand",
  "city_id": "city_phuket",
  "place_id": "place_blue_mango_cafe",
  "primary_topic_id": "topic_food",
  "source_type": "blog",
  "canonical_status": "canonical"
}
```

---

## 7. Space post example

```json
{
  "id": "spacepost_9f2k3",
  "city_id": "city_danang",
  "place_id": "place_my_khe_beach",
  "primary_topic_id": "topic_beaches",
  "source_type": "space",
  "canonical_status": "user_generated"
}
```

---

## 8. Rielt listing example

```json
{
  "id": "listing_patong_aparthotel_101",
  "country_id": "country_thailand",
  "city_id": "city_phuket",
  "district_id": "district_patong",
  "coordinates_lat": 7.8972,
  "coordinates_lng": 98.3005,
  "geo_precision": "building_exact",
  "partner_id": "partner_rf_441"
}
```

---

## 9. RF partner location example

```json
{
  "partner_id": "partner_rf_blue_mango",
  "location_id": "partnerloc_001",
  "country_id": "country_thailand",
  "city_id": "city_phuket",
  "district_id": "district_patong",
  "place_id": "place_blue_mango_cafe",
  "coordinates_lat": 7.8981,
  "coordinates_lng": 98.2987
}
```

---

## 10. Guru card example

```json
{
  "target_type": "listing",
  "target_id": "listing_patong_aparthotel_101",
  "country_id": "country_thailand",
  "city_id": "city_phuket",
  "district_id": "district_patong",
  "coordinates": {
    "lat": 7.8972,
    "lng": 98.3005
  },
  "distance_meters": 420,
  "geo_source": "listing"
}
```

---

## 11. Quest step example

```json
{
  "quest_step_id": "queststep_22",
  "target_type": "place",
  "target_id": "place_blue_mango_cafe",
  "country_id": "country_thailand",
  "city_id": "city_phuket",
  "district_id": "district_patong",
  "coordinates_lat": 7.8981,
  "coordinates_lng": 98.2987,
  "radius_meters": 100
}
```

---

## Guardrails

## 1. Forbidden as canonical geo model

The following are not acceptable as source of truth:

- `city = "Phuket"` with no `city_id`
- `district = "Patong Beach area"` as the only district reference
- free-text-only location fields for listings, events, or partner locations
- using only slug as the sole geo identity
- missing coordinates on place/event/listing/partner location records where nearby is required
- hidden duplication of alternative geo DTOs across services

---

## 2. Allowed only as helper/display data

These are acceptable only as non-canonical support fields:
- `address_text`
- localized display names
- marketing labels
- venue description text
- route hints
- approximate public display strings

---

## 3. Consistency requirements

- `city_id` must belong to the referenced `country_id`.
- `district_id` must belong to the referenced `city_id`.
- `place_id` must resolve to a place whose geo hierarchy is consistent with its parent refs.
- entities with explicit `coordinates` must not contradict their parent geo refs without a documented reason.

---

## 4. Nearby rule

Any entity participating in `nearby`, map UX, or geo ranking must have usable coordinates.

This especially applies to:
- places
- events
- listings
- partner locations
- geo quest steps
- Guru cards/projections

---

## 5. KG compatibility rule

Geo-linked content must be attachable to canonical entities through simple relations.

This supports `Knowledge Graph MVP` relation patterns like:
- `place_city`
- `place_district`
- `event_place`
- `post_place`
- `post_city`
- `post_topic`
- `event_topic`
- `related_entities`

---

## Migration Notes

## 1. Intent

These notes are not a full migration plan.  
They define how to evolve current services toward `Geo Canon v1` with minimal disruption.

---

## 2. Current platform constraint

The current plan explicitly says:
- do not build a full Geo Layer prematurely;
- keep Atlas as geography source of truth for now;
- require normalized references across new domains.

Therefore migration toward Geo Canon v1 should be:
- incremental;
- contract-driven;
- focused on normalized IDs and coordinates;
- compatible with current service sequencing.

---

## 3. Minimum normalization package before / during Step 8–11

### Before or during Step 8 (`rielt-service`)
Required:
- stable `country_id`
- stable `city_id`
- stable `district_id`
- coordinates for listings / listing-relevant targets
- no free-text-only geo model

### Before or during Step 9 (`guru-service`)
Required:
- unified geo projection contract
- coordinates available for nearby-capable entities
- no conflicting geo DTOs

### Before or during Step 10 (`rf-service`)
Required:
- partner locations modeled with canonical geo refs
- offers/vouchers geo-linkable where relevant

### By Step 11
Required:
- all new domains aligned to normalized references
- Atlas still functioning as authoritative geography source
- no incompatible temporary geo contracts introduced

---

## 4. Preferred migration pattern

Use the following order when adapting existing tables or DTOs:

1. add canonical IDs and coordinates;
2. backfill from existing Atlas-compatible data;
3. keep legacy display/free-text fields temporarily if needed;
4. update contracts and SDKs to consume canonical refs;
5. only later remove or deprecate legacy geo fields.

---

## 5. Specific hardening priorities

Priority items to audit/fix first:
- missing `district` as first-class entity;
- unstable IDs disguised as slugs/text;
- missing coordinates for places/events/listings;
- free-text geo in Blog/Pulse/Rielt-like flows;
- lack of separation between Atlas identity and content layers.

---

## 6. Out of scope for v1

The following are intentionally out of scope:
- standalone `geo-service`
- dedicated graph database
- advanced GIS platform
- multi-hop geo reasoning engine
- full viewport/search-tiles subsystem
- complex map orchestration

---

## 7. Final canonical statement

`Geo Canon v1` is the minimum normalized geo contract for Go2Asia MVP / Phase 2 delivery.

It establishes:
- Atlas as the current geography source of truth;
- `Country`, `City`, `District`, `Place`, and `Coordinates` as the canonical geo model;
- stable geo references across all domains;
- compatibility with nearby-first aggregation and `Knowledge Graph MVP`;
- a migration path that avoids premature geo-layer overengineering while preventing future cross-domain geo chaos.