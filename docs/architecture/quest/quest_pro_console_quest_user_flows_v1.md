# Quest PRO Console — Quest User Flows v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Flow-oriented definition for first Quest PRO Console UI wave  
**Status:** Planning-only; no implementation included  
**Depends on:** `quest_pro_console_quest_ui_ia_v1.md`

---

## Flow 1 — Open `My quests`

**Starting point**

- PRO user enters Quest section in PRO Console.

**Key steps**

1. Load owner-scoped quest list.
2. Apply optional `status`/`visibility` filters.
3. Select quest for management detail.

**Backend seam dependency**

- Slice 1 owner-scoped list read.

**Main failure/conflict cases**

- unauthorized principal
- forbidden role (`pro/admin` gate failure)

**Outside first-wave UI**

- cross-module dashboard composition

---

## Flow 2 — Open quest detail

**Starting point**

- User selects quest from `My quests`.

**Key steps**

1. Load owner-scoped quest detail.
2. Render management sections: draft/lifecycle/review/stats.

**Backend seam dependency**

- Slice 1 owner-scoped detail read.

**Main failure/conflict cases**

- quest not found
- non-owner access forbidden

**Outside first-wave UI**

- deep historical activity timeline

---

## Flow 3 — Edit draft quest fields

**Starting point**

- User opens editable draft quest.

**Key steps**

1. Enter draft edit mode.
2. Update bounded quest-level fields.
3. Save via draft update seam.

**Backend seam dependency**

- Slice 3 bounded draft quest update.

**Main failure/conflict cases**

- invalid payload/validation error
- conflict when status is no longer `draft`
- forbidden on ownership mismatch

**Outside first-wave UI**

- rich content/CMS authoring

---

## Flow 4 — Manage draft steps

**Starting point**

- User stays in draft quest context.

**Key steps**

1. Add/update/delete draft step.
2. Keep step ordering and requirements valid.
3. Persist bounded step changes.

**Backend seam dependency**

- Slice 3 bounded step management seam.

**Main failure/conflict cases**

- step validation failures
- conflict/order constraint issues
- non-draft mutation blocked

**Outside first-wave UI**

- drag-and-drop/graph workflow editing

---

## Flow 5 — Publish quest

**Starting point**

- Draft quest ready for launch.

**Key steps**

1. User triggers publish.
2. UI displays readiness errors or success state.

**Backend seam dependency**

- Slice 2 lifecycle tightening and readiness checks.

**Main failure/conflict cases**

- publish readiness conflicts
- invalid lifecycle transition
- forbidden ownership/role

**Outside first-wave UI**

- multi-stage approval pipeline

---

## Flow 6 — Archive quest

**Starting point**

- Published quest in management detail.

**Key steps**

1. User triggers archive action.
2. UI handles blockers (active progress/pending review) or success.

**Backend seam dependency**

- Slice 2 lifecycle archive seam.

**Main failure/conflict cases**

- active progress conflict
- pending submissions conflict
- invalid status transition

**Outside first-wave UI**

- retention/rollback workflow UI

---

## Flow 7 — Open review queue

**Starting point**

- User enters review block in quest detail.

**Key steps**

1. Load per-quest submissions queue.
2. Apply `status` and `stepId` filters.
3. Read submission context and rejection history.

**Backend seam dependency**

- Slice 4 manual review seam completion.

**Main failure/conflict cases**

- invalid filter input
- forbidden non-owner access

**Outside first-wave UI**

- cross-quest moderation center

---

## Flow 8 — Approve/reject submission

**Starting point**

- Reviewer opens pending submission in queue.

**Key steps**

1. Select decision (`approve` / `reject`).
2. Provide reject reason when rejecting.
3. Submit review and refresh queue state.

**Backend seam dependency**

- Slice 4 review action seam.

**Main failure/conflict cases**

- submission already reviewed conflict
- ownership/role forbiddance

**Outside first-wave UI**

- threaded discussion/case workflow

---

## Flow 9 — View curator stats minimum

**Starting point**

- User opens stats block in quest detail.

**Key steps**

1. Read minimum counters:
   - `startedCount`
   - `completedCount`
   - `pendingReviewCount`
2. Use counts for operational prioritization.

**Backend seam dependency**

- Slice 5 curator stats minimum.

**Main failure/conflict cases**

- forbidden non-owner access

**Outside first-wave UI**

- trend analytics, cohorts, funnels

---

## Flow-level first-wave boundary

First Quest UI wave is complete when these nine flows are operational in bounded form.  
Anything requiring platform-wide analytics, moderation, collaboration, or builder semantics is deferred.
