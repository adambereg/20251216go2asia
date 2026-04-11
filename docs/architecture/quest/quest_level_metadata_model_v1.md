# Quest Level Metadata Model v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Target quest-level metadata model for Wave 1.5B  
**Status:** Planning SSOT (model-only, no implementation)  
**Depends on:** `quest_wave_1_5b_definition_v1.md`, `quest_truth_model_v1.md`, `quest_domain_model_v1.md`, `docs/architecture/Go2Asia_Canon_Architecture_v1.0.md`

---

# 1. Purpose

This document defines the target quest-level metadata model required to make catalog/detail presentation runtime-canonical.

This is a model document, not a schema or implementation spec.

---

# 2. Design Principles

- keep quest-level metadata separate from step-level runtime payload
- preserve Quest activity domain boundaries
- provide list/detail parity for required presentation fields
- align media fields with platform media canon (key-based)
- keep references to external domains as reference-only

---

# 3. Field Groups

## 3.1 Identity / Routing

| Field | Required | Purpose |
|---|---|---|
| `questId` | Yes | Stable runtime quest identifier |
| `slug` | Yes | Canonical route and authoring/runtime alignment |
| `countrySlug` | Yes | Media canon path and regional grouping |
| `citySlug` | Yes | Catalog grouping and media canon path |

## 3.2 Narrative / Copy

| Field | Required | Purpose |
|---|---|---|
| `title` | Yes | Core display title across list/detail |
| `summary` | Yes | Card teaser and hero subtitle baseline |
| `shortDescription` | Optional | Compact product copy variant for card/detail |
| `bodyMarkdown` | Optional | Long-form detail content block |
| `estimatedMinutes` | Optional | Experience expectation on card/detail |
| `preparationNotes` | Optional | User preparation guidance |

## 3.3 Media (Quest-Level)

| Field | Required | Purpose |
|---|---|---|
| `mediaPrefix` | Yes | Canonical media namespace for quest |
| `cardMediaKey` | Optional | Catalog card visual key |
| `cardMediaAlt` | Optional | Accessibility text for card media |
| `heroMediaKey` | Yes | Detail hero visual key |
| `heroMediaAlt` | Optional | Accessibility text for hero media |
| `galleryMedia[]` (`key`, `alt`) | Optional | Detail gallery secondary visuals |

## 3.4 Catalog Presentation

| Field | Required | Purpose |
|---|---|---|
| `cardBadge` | Optional | User-facing categorization badge |
| `cardTagline` | Optional | One-line card context |
| `difficultyLabel` | Yes | Card and detail parity display |
| `stepsCount` | Yes | Card and detail parity display |
| `presentationFlags` | Optional | Visibility toggles (`showInCatalog`, `showGallery`, etc.) |

## 3.5 Detail Presentation

| Field | Required | Purpose |
|---|---|---|
| `heroEyebrow` | Optional | Detail hero context label |
| `detailHighlights[]` | Optional | Structured quick facts for detail page |
| `startPointLabel` | Optional | Human-readable starting point |
| `startPointReferenceId` | Optional | Reference-only link to external domain data |

## 3.6 Governance / Provenance

| Field | Required | Purpose |
|---|---|---|
| `status` | Yes | Runtime lifecycle visibility control |
| `visibility` | Yes | Public/private discoverability control |
| `contentSchemaVersion` | Yes | Metadata structure versioning |
| `sourceWave` | Optional | Provenance marker for rollout control |
| `sourceRevision` | Optional | Import/projection traceability |

## 3.7 Relations (Reference-Only)

| Field | Required | Purpose |
|---|---|---|
| `relatedPlaceIds[]` | Optional | Atlas references |
| `relatedEventIds[]` | Optional | Pulse references |
| `relatedPartnerIds[]` | Optional | RF references |
| `relatedSpaceTopicIds[]` | Optional | Social-context references without ownership transfer |

---

# 4. Minimum vs Extended Set (Wave 1.5B Guardrail)

This section prevents Wave 1.5B from expanding into a small Wave 2.

## 4.1 Minimum required field set for 1.5B implementation

Only this set is required to close 1.5B canonicalization goals:

- identity/routing: `questId`, `slug`, `countrySlug`, `citySlug`
- core narrative: `title`, `summary`
- core media: `mediaPrefix`, `heroMediaKey`, `cardMediaKey`, `galleryMedia[]` (if gallery exists)
- card/detail parity basics: `difficultyLabel`, `stepsCount`
- runtime governance basics: `status`, `visibility`, `contentSchemaVersion`

## 4.2 Extended future-ready set (not required to close 1.5B)

These fields are valid model extensions but not mandatory for 1.5B closure:

- narrative extensions: `shortDescription`, `bodyMarkdown`, `preparationNotes`, `estimatedMinutes`
- presentation extensions: `heroEyebrow`, `detailHighlights[]`, `cardBadge`, `cardTagline`, rich `presentationFlags`
- provenance extensions: `sourceWave`, `sourceRevision`
- relations extensions: `relatedPlaceIds[]`, `relatedEventIds[]`, `relatedPartnerIds[]`, `relatedSpaceTopicIds[]`
- optional detail helpers: `startPointLabel`, `startPointReferenceId`

## 4.3 Rule

If an implementation task depends only on extended fields, it must not block 1.5B closure unless promoted by explicit scope decision.

---

# 5. Quest-Level vs Step-Level Media Boundary

## Quest-level media

Quest-level media fields (`cardMediaKey`, `heroMediaKey`, `galleryMedia[]`, `mediaPrefix`) belong to quest metadata and are consumed by catalog/detail surfaces.

## Step-level media

Step-level media (`stepImageKey` and related step fields) remains part of step payload boundary and must not be merged into quest-level metadata object.

---

# 6. Surface Requirements Mapping

## Catalog card minimum set

Required for list card parity:

- `questId`
- `slug`
- `title`
- `summary`
- `difficultyLabel`
- `stepsCount`
- `cardMediaKey` (or explicit fallback policy)

## Detail hero minimum set

Required for detail hero parity:

- `title`
- `summary`
- `heroMediaKey`
- `heroMediaAlt` (recommended)
- `difficultyLabel`
- `stepsCount`

## Gallery block minimum set

If gallery is enabled:

- `galleryMedia[]`
- `presentationFlags.showGallery` (or equivalent)

## List/detail parity rule

Fields required for card rendering must be available directly in list response, not only in detail response.

---

# 7. Non-Goals

This model does not define:

- DB migration shape
- OpenAPI syntax-level schema
- SDK code generation
- importer implementation details

Those are addressed in implementation phases after this model is accepted.
