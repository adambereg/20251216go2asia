# Quest PRO Console — Quest Execution Plan v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Bounded UI implementation slicing plan for Quest PRO Console first wave  
**Status:** Planning-only; no implementation included  
**Depends on:** `quest_pro_console_quest_slice_definition_v1.md`, `quest_pro_console_quest_slice_scope_matrix_v1.md`, `quest_pro_console_quest_ui_ia_v1.md`, `quest_pro_console_quest_user_flows_v1.md`

---

## 1. Planning boundary

This plan defines Quest-only PRO Console UI slices.

It does not include:

- backend seam redesign
- full visual builder
- analytics/moderation platform expansion
- non-Quest PRO modules

---

## 2. Minimum viable Quest PRO Console slice

First wave mandatory surfaces:

1. `My quests`
2. Quest management detail
3. Draft edit panel
4. Review queue
5. Stats mini-block

---

## 3. Recommended sequencing (single recommended order)

1. Management shell / `My quests`
2. Quest detail / management view
3. Draft editing UI
4. Lifecycle controls
5. Review queue UI
6. Curator stats block
7. Richer builder later

---

## 4. Slice plan

## UI Slice 1 — Management shell + `My quests`

**Goal**

- establish Quest PRO entry and owner-scoped list operations

**Deliverables**

- Quest section entry route/shell (Quest-only)
- `My quests` list with bounded filters
- navigation to quest detail

**Exit criteria**

- PRO user can list and open owned quests in management context

**Risks / dependencies**

- dependency on stable owner-scoped list contracts

**Decision points**

- list density and metadata verbosity in first wave

---

## UI Slice 2 — Quest detail / management view

**Goal**

- provide single management surface for one quest

**Deliverables**

- detail read surface with lifecycle, draft, review, stats sections
- guardrail handling for ownership and forbidden states

**Exit criteria**

- quest-level management context is fully readable and action entry points are present

**Risks / dependencies**

- dependency on owner detail seam stability

**Decision points**

- section layout strategy (single page vs segmented tabs)

---

## UI Slice 3 — Draft editing UI

**Goal**

- operationalize bounded draft mutation surface

**Deliverables**

- quest-level draft field editor
- step management controls (add/update/delete)
- bounded validation/conflict handling

**Exit criteria**

- draft mutation flows complete within backend seam boundaries

**Risks / dependencies**

- dependency on draft-only enforcement semantics

**Decision points**

- reorder UX approach under current bounded backend constraints

---

## UI Slice 4 — Lifecycle controls

**Goal**

- make publish/archive operations explicit and safe

**Deliverables**

- publish control with readiness feedback
- archive control with conflict feedback

**Exit criteria**

- lifecycle actions are user-operable with deterministic error handling

**Risks / dependencies**

- dependency on lifecycle conflict message quality

**Decision points**

- preflight readiness presentation style (inline vs blocking panel)

---

## UI Slice 5 — Review queue UI

**Goal**

- deliver usable per-quest manual review operations

**Deliverables**

- queue list with `status`/`stepId` filters
- approve/reject actions
- rejection context visibility

**Exit criteria**

- manual review flow works end-to-end in Quest management context

**Risks / dependencies**

- dependency on submission context completeness in API responses

**Decision points**

- queue interaction pattern (list-detail split vs inline actions)

---

## UI Slice 6 — Curator stats block

**Goal**

- expose minimum operational counters in management detail

**Deliverables**

- stats mini-block:
  - `startedCount`
  - `completedCount`
  - `pendingReviewCount`

**Exit criteria**

- operators can read minimum stats without analytics platform dependency

**Risks / dependencies**

- dependency on stats endpoint availability and access semantics

**Decision points**

- placement and refresh strategy in detail view

---

## UI Slice 7 — Richer builder (deferred)

**Goal**

- intentionally deferred extension seam for post-v1

**Deliverables**

- none in first-wave plan

**Exit criteria**

- explicit non-goal remains enforced during first wave

---

## 5. Recommended next practical step

After this doc-pack, proceed to first implementation slice:

**Quest PRO Console UI-1: Management shell + My quests + Quest detail (read-first)**.
