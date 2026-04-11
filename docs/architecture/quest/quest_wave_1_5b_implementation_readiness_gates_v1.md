# Quest Wave 1.5B Implementation Readiness Gates v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Hard readiness gates before implementation slices  
**Status:** Active gating reference  
**Depends on:** `quest_wave_1_5b_definition_v1.md`, `quest_wave_1_5b_scope_matrix_v1.md`, `quest_truth_model_v1.md`, `quest_level_metadata_model_v1.md`, `quest_wave_1_5b_contract_delta_v1.md`, `quest_wave_1_5b_execution_roadmap_v1.md`

---

# 1. Purpose

This document defines strict go/no-go gates for Wave 1.5B implementation.

It is intentionally short and operational.

---

# 2. Gate A — Before Backend Implementation

All conditions must be true:

- Wave 1.5B definition is approved and frozen
- scope matrix is approved and out-of-scope zones are accepted
- truth model is approved (`authoring -> runtime -> frontend`)
- metadata model has minimum required field set locked
- contract delta namespacing strategy is locked (unified `metadata`)

If any condition is missing: backend implementation must not start.

---

# 3. Gate B — Before Frontend Migration

All conditions must be true:

- backend-facing contract target is approved for list/detail parity
- frontend migration plan is approved as runtime-first
- temporary fallback policy is approved as non-primary and bounded
- step-level boundary (`requirements.contentV2`) remains isolated from quest-level metadata

If any condition is missing: frontend migration must not switch primary source.

---

# 4. Gate C — Condition to Disable Primary Static Mapping

Primary static quest-level mapping can be disabled only when all conditions are true:

- list response supplies card-critical metadata for target quest set
- detail response supplies hero/gallery-critical metadata for target quest set
- parity validation passes for catalog and detail surfaces
- draft/private visibility semantics are unchanged and verified
- rollback-safe fallback path exists during cutover window

---

# 5. Gate D — Wave 1.5B Closure Condition

Wave 1.5B can be declared closed only when:

- runtime metadata canonicalization is complete for minimum required field set
- frontend no longer depends on static mapping as primary quest-level source
- all deferred zones are logged outside 1.5B (map/proof/verification/social)
- closure note and residual debt note are published

---

# 6. Non-Gates (Must Not Block 1.5B Closure)

The following are intentionally post-1.5B and must not block closure:

- map UI layer
- proof UX completion
- verification hardening / anti-fraud
- my quests / leaderboard / social integration
- authoring platform migration
