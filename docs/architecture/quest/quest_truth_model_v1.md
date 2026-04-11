# Quest Truth Model v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Target truth model for Quest Wave 1.5B  
**Status:** Planning SSOT  
**Depends on:** `quest_wave_1_5b_definition_v1.md`, `quest_wave_1_5b_scope_matrix_v1.md`, `quest_domain_model_v1.md`, `docs/architecture/Go2Asia_Canon_Architecture_v1.0.md`, `docs/architecture/media/media_domain_model_v1.md`

---

# 1. Purpose

This document fixes the source-of-truth model for Quest data and media after Wave 1 baseline and transitional hybrid media hookup.

---

# 2. Truth Layers

## 2.1 Authoring truth

Authoring truth is the quest markdown/content layer (currently `content/quest/...`).

Authoring truth includes:

- quest-level narrative and product copy intent
- quest-level media keys and presentation intent
- step-level content inputs that are projected into runtime structures

## 2.2 Runtime truth

Runtime truth is Quest DB + quest-service + API contracts.

Runtime truth is responsible for:

- serving canonical quest-level metadata to list/detail consumers
- serving step-level runtime data and step-level content projection boundaries
- preserving lifecycle/activity semantics defined by Quest domain model

## 2.3 Frontend consumption truth

Frontend consumption truth must be API/SDK payloads, not direct dependency on markdown files or static quest-id mapping as primary source.

Frontend may use temporary migration bridge logic only when explicitly declared and bounded.

---

# 3. Boundary: Where Markdown Ends

Markdown is the authoring input boundary.

Markdown must not remain a permanent frontend runtime dependency for quest-level presentation.

The boundary is:

`authoring source -> projection/import process -> runtime canonical contract -> frontend consumption`.

---

# 4. Runtime Responsibility Boundary

DB/runtime/OpenAPI responsibility begins at canonical projection output.

At that boundary, runtime must own:

- typed quest-level metadata fields needed by card/detail
- clear separation between quest-level and step-level media
- stable payload shapes for list/detail parity

---

# 5. Alignment with Go2Asia Media Canon

Quest must align with platform media canon:

- key-based media references (no full URLs in DB)
- deterministic media path strategy via canonical keys
- API/SDK exposure of keys required by UI
- client-side URL resolution via media resolver utilities

Quest-specific implication:

- quest-level cover/card/gallery keys must be runtime-accessible metadata
- step-level media remains tied to step payload boundary

---

# 6. Transitional Bridge Policy

A temporary bridge/fallback is acceptable during migration only if:

- it is explicitly documented
- it has a bounded lifetime
- it is not treated as primary canonical source

A bridge model is not acceptable as target-state architecture.

---

# 7. Current -> Target State Summary

## Current state (transitional)

- authoring truth: markdown
- runtime truth: lifecycle + step-level contentV2 projection
- quest-level media truth for frontend: hybrid static mapping bridge

## Target state (1.5B outcome)

- authoring truth: markdown (or future authoring system)
- runtime truth: includes canonical quest-level metadata model for list/detail
- frontend truth: runtime/API/SDK payloads as primary source

---

# 8. Non-Goals for This Model

This truth model does not introduce:

- anti-fraud trust architecture
- map rendering layer
- proof UX completion semantics
- social/leaderboard/my-quests product surfaces
