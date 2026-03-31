# Guru Asia: Multi-Level Geography Logic v1

**Status:** accepted design decision  
**Scope:** Go2Asia / Guru Asia  
**Suggested path in monorepo:** `docs/architecture/guru/guru_multi_level_geography_v1.md`

---

## 1. Purpose

This document fixes the multi-level geography logic for **Guru Asia** and aligns it with the evolving geo model of **Atlas Asia**.

The goal is to ensure that:

- geographic navigation works at different scales;
- “nearby” logic behaves differently at city scale and district scale;
- places, quests, and people can be shown with the right precision;
- Bangkok pilot decisions become part of a reusable geo backbone for the ecosystem.

This is not only a Guru-specific decision.  
This is a shared geo principle that should later be reused across:

- Atlas Asia
- Guru Asia
- Quest Asia
- Rielt Market
- future map and nearby features

---

## 2. Core Principle

The mandatory geographic hierarchy is:

**country → city → district → container (optional) → place**

This hierarchy is the base spatial model for urban geography in Go2Asia.

### Meaning of each level

#### Country
Top-level geographic unit.

Examples:
- Thailand
- Vietnam

#### City
Main urban unit inside a country.

Examples:
- Bangkok
- Ho Chi Minh City
- Phuket Town

#### District
A real sub-city geographic unit used for:
- city content structure;
- map zoom logic;
- place attribution;
- nearby filtering;
- grouping of containers and places.

District is a required level for cities where meaningful internal urban structure exists.

#### Container
An optional intermediate level between district and place.

Container is used only when a place is clearly part of a larger object, such as:
- mall
- market
- hotel
- tower
- large complex
- palace complex
- urban cluster / area-like zone

Examples:
- State Tower
- Banyan Tree Bangkok
- ICONSIAM
- Chatuchak Weekend Market

#### Place
A concrete destination, POI, venue, landmark, business, attraction, or specific point.

Examples:
- Sirocco Sky Bar
- Jay Fai
- Wat Pho
- Blue Elephant Bangkok

---

## 3. Why District Is a First-Class Entity

District is **not** just an attribute on a place.

District has two roles at the same time:

### 3.1 Content role
District is part of the city’s editorial/content structure.

Example:
On the city page in Atlas, the tab **“Районы” / “Districts”** should show real district records with descriptions, not only raw text.

District content may include:
- district title
- short description
- character of the district
- what it is known for
- what kinds of places or activities are inside

### 3.2 Structural role
District is a geo anchor used for:
- assigning places to parts of the city;
- grouping map results;
- nearby logic;
- filtering;
- recommendations;
- future cross-module spatial behavior.

Therefore district must exist as a separate entity in the data model.

---

## 4. Why Container Is Optional

Not every place needs a container.

### Cases without container
The place can be attached directly to district if it is already a standalone destination.

Examples:
- Jay Fai
- Wat Pho
- Wat Arun
- Blue Elephant Bangkok

### Cases with container
The place should be attached through a container if it lives inside a larger structure.

Examples:
- Sirocco Sky Bar → State Tower
- Vertigo & Moon Bar → Banyan Tree Bangkok
- a shop inside ICONSIAM → ICONSIAM
- a venue inside Chatuchak Weekend Market → Chatuchak Weekend Market

Container is therefore **optional**, but important for dense city environments.

---

## 5. Multi-Level Geography in Guru Asia

Guru Asia will use geography not only for content display, but for **proximity logic**, **map behavior**, and **context-aware discovery**.

The same city should behave differently depending on map scale.

---

## 6. Map Scale Logic

### 6.1 Country scale
At country scale, the system should show only large and high-signal geographic units.

Typical outputs:
- cities
- major destinations
- broad travel clusters

Do **not** show dense low-level point clutter here.

---

### 6.2 City scale
At city scale, the map should show broader urban structure.

Typical outputs:
- districts
- major containers
- major places
- major quests
- people / gurus / experts with broad “available in city” presence

City scale should answer:
- what is available in this city;
- what city areas matter;
- what is roughly nearby at urban level.

At this scale, district is the main organizing level.

---

### 6.3 District scale
At district scale, the system should become more concrete and local.

Typical outputs:
- specific places inside the district
- specific quests inside the district
- specific people / gurus / experts nearby
- district-level recommendations
- container-aware place clusters

District scale should answer:
- what is near me in this district;
- what is inside this part of the city;
- which experts / quests / places are actually close enough to matter now.

This is the main working scale for “nearby” logic in dense cities.

---

### 6.4 Container scale
Where containers exist, the map and discovery logic may go one level deeper.

Typical outputs:
- places inside the container
- sub-locations inside a market / mall / hotel / tower / complex
- very precise nearby or same-building recommendations

This layer matters especially in:
- malls
- markets
- towers
- hotels
- palace/temple complexes
- large cultural clusters

---

### 6.5 Place scale
The most specific level.

Used for:
- direct place detail
- exact navigation
- exact nearby behavior
- final recommendation target

---

## 7. “Nearby” Logic by Scale

Guru Asia must not treat “nearby” as one single universal radius.

“Nearby” should depend on geographic scale.

### 7.1 Nearby at city scale
City-scale nearby means:
- roughly relevant within the same city;
- useful for orientation;
- not necessarily walkable;
- good for broad discovery.

Examples:
- notable districts in Bangkok
- high-value places across the city
- city-wide experts or services
- major quests visible from urban overview

### 7.2 Nearby at district scale
District-scale nearby means:
- more concrete;
- more local;
- more action-oriented;
- more relevant to immediate movement.

Examples:
- places in Phra Nakhon
- experts near Bang Rak
- quests within Pathum Wan
- specific venues inside Sathorn

### 7.3 Nearby at container/place scale
This is the most precise level.

Examples:
- venues inside ICONSIAM
- rooftop inside State Tower
- shops inside Chatuchak Weekend Market
- sub-POIs inside a palace or temple complex

---

## 8. Relationship to Atlas Asia

Guru Asia must reuse the geo backbone defined in Atlas.

Atlas should become the source of structured city geography:

- country
- city
- district
- container
- place

This means Guru Asia should **not invent its own parallel geo model**.

Instead, Guru Asia should consume and apply the structured geography coming from Atlas and shared geo entities.

---

## 9. Required Data Model Direction

This document does not define final DB schema, but it fixes the required domain direction.

### 9.1 District entity is mandatory
A separate city district table/entity is required.

Suggested conceptual entity:
- `city_district`

District belongs to a city and acts as:
- content record
- geo anchor
- parent for containers and places

### 9.2 Container entity is required
A separate container table/entity is required.

Suggested conceptual entity:
- `place_container`

Container belongs to:
- a city
- a district
- optionally another higher-level urban structure in the future

### 9.3 Place must reference district and optionally container
A place should be linkable to:
- city
- district
- optional container

This ensures stable hierarchy and clean nearby logic.

---

## 10. Example Hierarchy

### Example 1
Thailand → Bangkok → Bang Rak → State Tower → Sirocco Sky Bar

### Example 2
Thailand → Bangkok → Sathon → Banyan Tree Bangkok → Vertigo & Moon Bar

### Example 3
Thailand → Bangkok → Khlong San → ICONSIAM → [sub-places inside ICONSIAM, if needed]

### Example 4
Thailand → Bangkok → Phra Nakhon → Wat Pho

---

## 11. Bangkok Pilot Implication

Bangkok should be used as the first pilot city for this model.

The Bangkok pilot should:

1. introduce district records as real city entities;
2. introduce containers where truly needed;
3. connect existing Atlas Bangkok places to districts;
4. connect selected places to containers where relevant;
5. gradually replace the raw textual “districts” content block with structured district records.

This pilot is not only a Bangkok content improvement.  
It is the first operational validation of the geo backbone.

---

## 12. Rules to Prevent Scope Drift

### Rule 1
District must not be reduced to a plain text field on place only.

### Rule 2
Districts must serve both:
- city content structure;
- spatial logic.

### Rule 3
Container must remain optional.
Do not force a container for every place.

### Rule 4
Guru Asia must consume the shared geography model, not invent a separate one.

### Rule 5
Map results and nearby logic must vary by scale:
- country
- city
- district
- container
- place

### Rule 6
For dense urban environments, district is the default working unit for meaningful local discovery.

---

## 13. Practical Outcome

This decision gives Go2Asia a reusable urban geo backbone:

**country → city → district → container (optional) → place**

This backbone supports:
- Atlas city structure
- Guru nearby logic
- district-aware maps
- container-aware dense urban navigation
- future quest and real estate mapping
- cleaner filtering and discovery

---

## 14. Decision

Accepted:

1. District is a first-class entity.
2. Container is an optional intermediate entity.
3. The mandatory urban hierarchy is:

**country → city → district → container (optional) → place**

4. Guru Asia nearby logic and map logic must operate differently depending on scale.
5. Atlas and Guru must converge on the same shared geographic model.

---

## 15. Next Recommended Follow-Up

Recommended implementation follow-up outside this document:

- create `city_districts` as a separate entity/table;
- create `place_containers` as a separate entity/table;
- extend places to reference district and optional container;
- run Bangkok as the first structured pilot;
- later align Guru map logic with these entities.