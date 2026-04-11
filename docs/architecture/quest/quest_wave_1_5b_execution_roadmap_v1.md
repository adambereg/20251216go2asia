# Quest Wave 1.5B Execution Roadmap v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Execution roadmap anchor for Wave 1.5B  
**Status:** Planning SSOT (implementation-ready planning)  
**Depends on:** `quest_wave_1_5b_definition_v1.md`, `quest_wave_1_5b_scope_matrix_v1.md`, `quest_truth_model_v1.md`, `quest_level_metadata_model_v1.md`, `quest_wave_1_5b_contract_delta_v1.md`, `quest_wave_1_5b_implementation_readiness_gates_v1.md`

---

# 1. Purpose

This roadmap defines bounded implementation planning phases for Wave 1.5B.

Each phase includes goals, deliverables, exit criteria, risks/dependencies, and decision points.

---

# 2. Phase 0 — Definition Lock

## Goal

Freeze Wave 1.5B meaning and boundaries before any implementation slice.

## Deliverables

- approved 1.5B definition
- approved scope matrix
- approved exclusion list (proof/map/verification/social)

## Exit criteria

- all downstream implementers reference the same wave definition
- no unresolved disagreement on in-scope vs deferred zones

## Risks / dependencies

- risk: scope creep from adjacent feature requests
- dependency: Wave 1 baseline and transitional media hookup state are already acknowledged

## Decision points

- DP-0.1: naming lock (`Runtime Metadata Canonicalization`) accepted
- DP-0.2: map explicitly moved post-1.5B

---

# 3. Phase 1 — Truth and Model Fixation

## Goal

Fix target truth model and quest-level metadata model as architecture SSOT.

## Deliverables

- approved truth model document
- approved quest-level metadata model document
- explicit quest-level vs step-level media boundary policy

## Exit criteria

- every card/detail field has defined canonical source
- markdown boundary vs runtime responsibility is explicit and accepted

## Risks / dependencies

- risk: over-designing model beyond bounded needs
- dependency: alignment with Quest domain model and media canon

## Decision points

- DP-1.1: minimal required field set for list/detail parity
- DP-1.2: required vs optional media/presentation fields

---

# 4. Phase 2 — Contract Design Lock

## Goal

Define additive runtime contract deltas for list/detail consumption.

## Deliverables

- approved contract delta document
- list/detail field parity matrix
- backward compatibility notes

## Exit criteria

- list response has defined card-complete metadata target
- detail response has defined hero/gallery-complete metadata target
- step-level boundary remains isolated from quest-level metadata

## Risks / dependencies

- risk: contract ambiguity causing divergent backend/frontend interpretation
- dependency: phase 1 model acceptance

## Decision points

- DP-2.1: final response namespacing strategy for metadata fields
- DP-2.2: temporary fallback lifetime policy

---

# 5. Phase 3 — Runtime Projection Strategy Lock

## Goal

Choose bounded projection strategy from authoring truth to runtime canonical metadata.

## Deliverables

- projection strategy decision (documented)
- migration/backfill planning note
- validation checkpoint definition for parity

## Exit criteria

- clear plan exists for removing quest-level static mapping as primary source
- projection strategy is compatible with existing lifecycle/runtime boundaries

## Risks / dependencies

- risk: under-specified projection creates hidden drift
- dependency: contract lock from phase 2

## Decision points

- DP-3.1: projection storage shape (without reopening wave scope)
- DP-3.2: fallback demotion/removal criteria

---

# 6. Phase 4 — Frontend Migration Planning

## Goal

Prepare bounded frontend migration plan from hybrid quest-level mapping to runtime-first metadata.

## Deliverables

- frontend migration sequence plan
- runtime-first consumption acceptance checklist
- fallback-only emergency policy

## Exit criteria

- catalog/detail migration path is explicit and testable
- no dependency on markdown/static mapping as primary source in target state

## Risks / dependencies

- risk: partial rollout leaves long-lived hybrid behavior
- dependency: stable contract and runtime projection outputs

## Decision points

- DP-4.1: parity gate for switching off primary static mapping
- DP-4.2: rollout strategy for old/new quests coexistence

---

# 7. Phase 5 — Closure and Residual Debt Fixation

## Goal

Close 1.5B with explicit completion criteria and deferred backlog.

## Deliverables

- wave closure note
- residual debt log
- post-1.5B sequencing recommendation

## Exit criteria

- 1.5B completion condition is explicit and auditable
- deferred areas are documented as separate passes, not hidden scope

## Risks / dependencies

- risk: unresolved items silently carried into unrelated implementation work
- dependency: prior phases complete and accepted

## Decision points

- DP-5.1: declare 1.5B complete vs extend
- DP-5.2: lock post-1.5B priority order (proof UX, map, verification hardening)

---

# 8. Hard Rules for Follow-Up Implementation Passes

- do not mix map UI implementation into 1.5B
- do not mix proof hardening into 1.5B
- do not re-open Wave 1 lifecycle semantics
- do not treat migration fallback as permanent architecture

---

# 9. Success Condition (Roadmap-Level)

Wave 1.5B is done when runtime metadata canonicalization is fully specified, contract-delivered in planning artifacts, and implementation passes can execute without redefining architecture boundaries.

---

# 10. Gating Reference

For strict go/no-go implementation checks, use:

- `quest_wave_1_5b_implementation_readiness_gates_v1.md`

This roadmap remains sequencing-oriented, while readiness gates are execution-control oriented.
