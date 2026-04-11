# Quest Wave 1.5B Contract Delta v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Runtime contract delta design for Wave 1.5B  
**Status:** Planning SSOT (no implementation)  
**Depends on:** `quest_wave_1_5b_definition_v1.md`, `quest_truth_model_v1.md`, `quest_level_metadata_model_v1.md`, `docs/openapi/quest.yaml`

---

# 1. Purpose

This document defines runtime contract deltas required to remove quest-level static mapping as primary frontend source.

This is a contract design document, not an implementation spec.

---

# 2. Delta Intent

Current transitional state:

- list/detail runtime is live
- step-level `contentV2` is runtime-first
- quest-level media/presentation still has hybrid static mapping dependence

Target contract state:

- list/detail responses carry canonical quest-level metadata required by frontend surfaces
- step-level boundary remains explicit and separate

---

# 2.1 Response Shape Namespacing Strategy (Planning Lock)

To avoid backend/frontend divergence, Wave 1.5B sets a preferred namespacing strategy.

## Considered strategies

- **S1: Unified `metadata` object** (single nested object for narrative/media/presentation/governance)
- **S2: Multiple top-level blocks** (`media`, `presentation`, `narrative` at top level)
- **S3: Additive flat fields** (all new fields at top level)

## Preferred strategy for 1.5B

**S1 is preferred**:

- keeps contract growth bounded and structured
- avoids top-level field sprawl
- makes list/detail parity and SDK typing clearer
- cleanly separates quest-level metadata from step-level `requirements.contentV2`

## Strategy lock for implementation planning

- list/detail deltas in this document assume unified `metadata` namespacing
- S2/S3 require explicit ADR override before implementation

---

# 3. List Response Delta (Card-Critical Fields)

List response must provide all fields needed to render catalog cards without quest-level static mapping.

## Required list-level additions

- `slug`
- `summary`
- `metadata.media.cardMediaKey` (or equivalent namespace)
- `metadata.media.cardMediaAlt` (optional but recommended)
- `metadata.presentation.cardBadge` (optional)
- `metadata.presentation.cardTagline` (optional)
- `metadata.presentation.estimatedMinutes` (optional)

## Existing list-level fields that remain card-critical

- `title`
- `difficulty`
- `stepsCount`
- `status` / `visibility` (runtime control; UI may not foreground them)

---

# 4. Detail Response Delta (Hero/Gallery/Detail-Critical Fields)

Detail response must provide full quest-level metadata required by detail page without static mapping.

## Required detail-level additions

- `metadata.media.mediaPrefix`
- `metadata.media.heroMediaKey`
- `metadata.media.heroMediaAlt` (recommended)
- `metadata.media.galleryMedia[]` (`key`, `alt`)
- `metadata.narrative.summary`
- `metadata.narrative.bodyMarkdown` (optional)
- `metadata.presentation.detailHighlights[]` (optional)
- `metadata.presentation.presentationFlags` (optional)

---

# 5. Step Boundary Rule

Step-level `requirements.contentV2` remains step-scoped and must not be overloaded with quest-level hero/gallery/card metadata.

Allowed in step scope:

- step instruction/presentation hints
- step-level media keys
- step-level runtime UX flags

Not allowed in step scope:

- quest-level card metadata
- quest-level hero/gallery metadata

---

# 6. Frontend Dependency Outcome

After this contract delta is implemented:

- catalog and detail can consume quest-level media/presentation directly from runtime/API/SDK
- frontend static quest-id mapping is no longer primary source
- migration fallback may remain temporarily for data parity windows only

---

# 7. Backward Compatibility and Migration Notes

## 7.1 Migration strategy

- additive contract expansion first
- frontend switches to runtime-first consumption for quest-level metadata
- static mapping remains temporary fallback during parity window
- fallback is removed (or demoted to explicit emergency path) after parity validation

## 7.2 Compatibility constraints

- existing clients must continue to function while new metadata fields are optional
- no lifecycle semantic changes
- no proof/verification semantic changes

## 7.3 Validation checkpoint

Before fallback deprecation:

- list card parity validated for target quest set
- detail hero/gallery parity validated for target quest set
- draft/private visibility semantics remain unchanged

---

# 8. Non-Goals

This delta does not define:

- exact OpenAPI YAML snippets
- exact SDK type generation details
- backend storage implementation strategy
- map or proof UX contracts
