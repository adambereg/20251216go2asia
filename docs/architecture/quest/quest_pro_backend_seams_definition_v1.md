# Quest PRO Backend Seams Definition v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** SSOT definition for bounded backend-preparation layer before PRO Console UI  
**Status:** Active planning anchor  
**Depends on:** `quest_wave_1_5b_closure_note_v1.md`, `quest_post_1_5b_sequencing_note_v1.md`, `adr_0024_quest_runtime_metadata_canonicalization.md`, `adr_0025_quest_map_scope_post_1_5b.md`

---

## 1. Definition

**Quest PRO backend seams** are the minimum server-side capabilities required so a future PRO/curator interface can create, maintain, publish, and review quests without forcing emergency backend redesign during UI buildout.

This is a **bounded backend-preparation pass**. It is not a PRO Console delivery, not a CMS migration, and not a visual authoring system.

---

## 2. Why This Is a Separate Pass

Quest player-facing work (1.5B, bridge retirement, proof UX, map) already stabilized runtime consumption and execution flows.  
PRO authoring concerns belong to a different layer: owner-scoped management, draft lifecycle control, review operations, and curator-oriented reads.

Keeping this pass separate prevents scope mixing:

- player flow improvements stay in player passes;
- curator/authoring readiness stays in backend seams;
- verification hardening stays a trust-model pass.

---

## 3. Why Before PRO Console UI

Running this pass before console UI reduces UI-driven backend drift:

- PRO Console can consume pre-defined server seams instead of inventing contracts ad hoc;
- ownership/lifecycle/review responsibilities are fixed in backend first;
- future UI complexity does not accidentally define domain boundaries.

This pass intentionally prepares the server for future console slices while avoiding early investment into UI workflows.

---

## 4. What This Pass Is Not

This pass must **not** become:

- a universal authoring framework;
- a full CMS-like content platform;
- a workflow engine with rich visual editing;
- a broad moderation/analytics platform.

The output is a narrow, practical seam set for Quest PRO readiness.

---

## 5. Guardrail Statement

The goal is to prepare backend seams for a future curator/PRO layer, **without opening the layer itself**.

If a proposed change needs visual builder semantics, collaborative UI workflows, or broad product-surface expansion, it is outside this pass and must be deferred to PRO Console planning/implementation phases.

---

## 6. Recommended Position in Post-1.5B Queue

Recommended order:

1. **Quest PRO backend seams**
2. **Verification Hardening / Anti-Fraud**
3. **Social / My Quests / Leaderboard**
4. **PRO Console planning + UI**
5. **PRO Console implementation**

This ordering keeps backend authoring boundaries explicit before verification and before any console UI delivery.
