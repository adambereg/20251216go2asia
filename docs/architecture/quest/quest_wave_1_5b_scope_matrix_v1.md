# Quest Wave 1.5B Scope Matrix v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Operational scope guardrail for Wave 1.5B  
**Status:** Active execution guardrail  
**Depends on:** `quest_wave_1_5b_definition_v1.md`, `quest_wave1_execution_brief_v1.md`, `quest_domain_model_v1.md`

---

# 1. Purpose

This matrix prevents Wave 1.5B from expanding into unrelated product or platform zones.

---

# 2. Scope Matrix

| Area | In scope | Out of scope | Explicitly deferred |
|---|---|---|---|
| Quest-level metadata model | Define target model and field groups | Full product redesign of quest pages | Final storage implementation details if unresolved in decision phase |
| Runtime/OpenAPI/SDK contract expansion | Define contract deltas for list/detail consumption | Implement contract changes in this pass | Implementation slices after contract lock |
| De-hybridization of quest-level media | Define migration away from static frontend mapping as primary source | Remove all fallbacks immediately without migration policy | Temporary bridge policy until runtime parity is complete |
| Step-level media boundaries | Clarify quest-level vs step-level responsibilities and boundaries | Step model rewrite beyond current `contentV2` role | Optional future step metadata formalization |
| Map decision | Make architectural decision and enforce boundary (post-1.5B) | Build map UI or spatial interactions | Separate map pass after 1.5B |
| Proof UX | None | Upload UX completion, scanner UX, submit flow redesign | Dedicated proof UX pass after 1.5B |
| Verification hardening | None | Anti-fraud, strict geo trust model, advanced validation | Dedicated verification hardening pass |
| My quests / leaderboard / social | None | `/quest/my`, leaderboard, social/Space growth surfaces | Later product waves |
| Authoring/CMS evolution | Keep markdown as current authoring source and define boundary | CMS rollout, authoring platform migration | Separate authoring/CMS wave |
| Schema/migrations | None in doc-pack pass | DB migrations, schema rewrites, importer rewrites | Address only in implementation phase if required by approved contract |

---

# 3. Hard In-Scope List

Wave 1.5B must deliver documentation-level fixation for:

- quest-level metadata model
- target truth model
- contract delta model for list/detail parity
- migration policy from hybrid to runtime canonical truth
- execution roadmap with phase exits and risks
- ADR decisions for canonicalization and map separation

---

# 4. Hard Out-of-Scope List

Wave 1.5B must not include:

- backend/frontend feature implementation
- OpenAPI edits
- SDK generation
- importer edits
- schema migrations
- proof mechanics expansion
- anti-fraud mechanics
- map UI implementation

---

# 5. Scope Escalation Rule

If a task requires changing verification logic, introducing map UI, or extending social/user lifecycle surfaces, it must be moved to a post-1.5B pass and must not be merged into Wave 1.5B definition scope.
