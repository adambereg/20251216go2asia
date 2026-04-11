# Quest PRO Console — Quest UI/IA v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Target UI/IA architecture for Quest-first PRO Console wave  
**Status:** Planning-only; no implementation included  
**Depends on:** `quest_pro_console_quest_slice_definition_v1.md`, `quest_pro_console_quest_slice_scope_matrix_v1.md`

---

## 1. IA top-level for Quest slice

Quest slice navigation (v1):

1. `My quests`
2. `Quest detail`
3. `Draft editing` (within detail)
4. `Review queue` (within detail)
5. `Curator stats` (within detail)

No cross-module shell assumptions are required for this v1 IA.

---

## 2. UI zones

## 2.1 `My quests`

**What user sees**

- owner-scoped quest list
- status/visibility/difficulty/basic recency signals
- lightweight operational posture (at list row level only if already available)

**Key actions**

- open quest management detail
- create new draft quest
- filter list (`status`, `visibility`)

**Backend seams coverage**

- owner-scoped list reads (Slice 1)

**First-wave boundary**

- no bulk actions
- no cross-quest analytics dashboard

---

## 2.2 Quest management detail

**What user sees**

- full quest record in management context
- step list and lifecycle status
- links to draft editing/review/stats blocks

**Key actions**

- enter edit mode for draft
- publish/archive actions (when applicable)

**Backend seams coverage**

- owner-scoped detail read (Slice 1)
- lifecycle controls (Slice 2)

**First-wave boundary**

- no historical timeline UI
- no advanced workflow dashboard

---

## 2.3 Draft editing

**What user sees**

- bounded editable quest fields in draft state
- explicit field-level validation/conflict states

**Key actions**

- patch draft quest-level fields
- save draft changes

**Backend seams coverage**

- bounded draft quest update seam (Slice 3)

**First-wave boundary**

- no rich content/CMS model
- no free-form builder semantics

---

## 2.4 Step management

**What user sees**

- ordered step list for draft quest
- step-level bounded fields and operational controls

**Key actions**

- add/update/delete draft step
- maintain valid step order under current backend constraints

**Backend seams coverage**

- bounded step maintenance seam (Slice 3)

**First-wave boundary**

- no drag-and-drop graph/workflow editor
- no advanced branch/conditional step modeling

---

## 2.5 Publish/archive controls

**What user sees**

- lifecycle action controls with clear current state
- readiness/conflict messages from backend responses

**Key actions**

- publish draft quest
- archive published quest

**Backend seams coverage**

- lifecycle tightening seam (Slice 2)

**First-wave boundary**

- no custom workflow orchestration
- no multi-stage approval workflow

---

## 2.6 Review queue

**What user sees**

- per-quest submission queue
- filters (`status`, `stepId`)
- submission decision context including `rejectionReason`

**Key actions**

- approve submission
- reject submission with reason

**Backend seams coverage**

- manual review seam completion (Slice 4)

**First-wave boundary**

- no cross-quest moderation center
- no case-management/thread workflows

---

## 2.7 Curator stats block

**What user sees**

- minimum operational counters:
  - `startedCount`
  - `completedCount`
  - `pendingReviewCount`

**Key actions**

- read operational posture for current quest
- use counts to prioritize review/publish actions

**Backend seams coverage**

- curator stats minimum seam (Slice 5)

**First-wave boundary**

- no trends/time-series/cohorts/funnels

---

## 2.8 Reference selection surfaces (Atlas/Pulse/RF)

**What user sees**

- bounded reference fields in step/draft forms (ID/type-level integration points)

**Key actions**

- set/replace quest-related references used by steps

**Backend seams coverage**

- bounded draft/step mutation seams already accept reference-oriented fields

**First-wave boundary**

- no full picker platform, no cross-module authoring UX

---

## 2.9 Guardrails and readiness feedback

**What user sees**

- draft-only edit restrictions
- ownership/forbidden states
- lifecycle conflict and readiness errors

**Key actions**

- resolve blockers before publish/archive/review actions

**Backend seams coverage**

- lifecycle + permission hooks + baseline audit events (Slices 2/6)

**First-wave boundary**

- no policy authoring UI

---

## 2.10 Future extension seams

Future evolutions (deferred):

- richer visual builder
- expanded review operations
- advanced analytics surfaces

V1 IA keeps these as extension seams without pre-building platform abstractions.
