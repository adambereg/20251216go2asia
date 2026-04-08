# Quest Normalization Pack v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Cleanup brief and truth-hierarchy anchor for Quest documentation  
**Status:** Active normalization reference for implementation planning

---

# 1. Purpose

This document fixes the working document hierarchy for Quest Asia so that product narrative, engineering SSOT, and legacy concept docs are no longer mixed during planning or implementation.

Use this file when a new developer or Cursor agent needs a single safe entry point into Quest documentation.

---

# 2. Quest Source-of-Truth Hierarchy

## 2.1 Product narrative sources

These documents explain product meaning, user roles, and ecosystem intent.

- `docs/knowledge/quest_asia.md` — **primary operational product narrative source**
- `docs/Quest Asia.docx` — stakeholder/source narrative input, not the operational working source

Rule:

- product narrative documents describe **why Quest exists**
- they do **not** define API contract truth
- they do **not** override engineering ownership boundaries

---

## 2.2 Engineering truth sources

These documents define what Quest currently means for architecture and implementation.

- `docs/architecture/quest/quest_domain_model_v1.md`
- `docs/architecture/quest/quest_openapi_outline_v1.md`
- `docs/architecture/quest/quest_service_production_architecture_v1.md`
- `docs/architecture/quest/quest_backend_architecture_v1.md`
- `docs/architecture/quest/quest_dependency_map_v1.md`
- `docs/openapi/quest.yaml`

Priority inside the engineering layer:

1. `docs/openapi/quest.yaml` = machine-readable contract truth
2. domain model + dependency map + production architecture = ownership/runtime truth
3. openapi outline + backend architecture = explanatory engineering context

---

## 2.3 Legacy / non-authoritative sources

These documents must not drive current implementation scope.

- `frontend-shell/docs/ui/quest_ui.md` — **legacy / very old / concept-only / not SSOT**

Rule:

- do not use it as route truth
- do not use it as frontend readiness proof
- do not use it as current scope definition
- it may be used only as a historical concept reference

---

# 3. Narrative Alignment Check

## 3.1 `Quest Asia.docx` vs `docs/knowledge/quest_asia.md`

Normalization verdict:

> **partially aligned**

Why:

- a substantial narrative block in `Quest Asia.docx` matches the wording and structure of `docs/knowledge/quest_asia.md`
- however, the Word file also mixes in older architecture, UI, and broader platform assumptions
- `docs/knowledge/quest_asia.md` is the cleaner and safer narrative layer for ongoing work

Operational rule:

- treat `docs/knowledge/quest_asia.md` as the **working narrative source**
- treat `Quest Asia.docx` as **background/stakeholder input**, not as the operational file for Cursor work

---

# 4. Current vs Future vs Deferred

## 4.1 Current scope

These items belong to the current Quest baseline and may safely drive implementation planning.

- Quest as an activity/scenario engine
- canonical entities: `quest`, `quest_step`, `quest_progress`, `quest_submission`
- public quest list and detail
- user lifecycle: start, progress, submit
- PRO API contours: create draft, add step, publish, review submissions
- local proof handling + manual review path
- external references to place/event/partner/Space post without ownership transfer
- event naming and event intent
- narrow Quest write model with broad read consumption

---

## 4.2 Future-ready but not current

These items may remain in the product or architecture story, but must not be read as current implementation scope.

- voucher unlock / voucher usage flows
- richer NFT reward presentation
- broader token economy / G2A
- Guru quest discovery and nearby-first map behavior
- full downstream event propagation to Points / notifications / analytics
- deep Space / Pulse / RF source-aware validation hooks
- wider PRO Console breadth beyond current Quest API contours
- dashboard aggregation beyond Quest-owned progress data
- dedicated validation workers / quest analytics extraction

---

## 4.3 Deferred surfaces

These surfaces must be treated as deferred for frontend and implementation planning unless explicitly reopened.

- `/quest/my`
- leaderboard
- rich final completion / rewards theater
- wider PRO Console UI
- dashboard aggregation surface
- deep Space-linked Quest surfaces
- mature social proof toolset

---

# 5. Frontend Normalization

## 5.1 Real frontend baseline

The current Quest frontend baseline is the runtime-backed flow implemented in `apps/go2asia-pwa-shell`:

- `/quest`
- `/quest/[id]`
- `/quest/[id]/run`

Supporting truth sources:

- `packages/sdk/src/quest.ts`
- `docs/openapi/quest.yaml`
- `docs/architecture/quest/quest_frontend_live_adoption_milestone_note_v1.md`

---

## 5.2 Frontend interpretation rule

Do not assume the current frontend already includes:

- my quests
- leaderboard
- final rewards surface
- broad PRO operator suite
- dashboard aggregation
- deep Space-linked Quest UI

If a surface is not present in the current PWA baseline or is still placeholder/mocked, it is **not current frontend truth**.

---

# 6. Product Wording Guardrails

## 6.1 Keep strong

- Quest as the activity engine
- combined scenarios as the core product idea
- Quest as a cross-module activity layer
- PRO as curator/operator of scenarios
- Quest Service as `state machine + validation engine`

---

## 6.2 Soften for safe engineering interpretation

- "deeply integrated with vouchers/rewards"
- "fully integrated ecosystem engine"
- wording that implies production-complete cross-service validation
- wording that implies Quest directly owns partner, wallet, or social truth

Safe replacement pattern:

> Quest orchestrates scenarios through references, proof state, and events; ownership of content, balances, vouchers, and external truth remains outside Quest.

---

## 6.3 Mark future-only

- vouchers as normal current Quest UX
- NFT as a normal current reward layer
- G2A / broader token economy
- Guru nearby quest discovery
- rich operator and social surfaces beyond current baseline

---

# 7. Recommended Next Step

After this cleanup, the correct next step is:

> **Quest implementation planning pack**

This should use:

- `docs/knowledge/quest_asia.md` as the product narrative source
- the Quest SSOT package + `docs/openapi/quest.yaml` as engineering truth
- this normalization pack as the anti-drift guardrail

---

# 8. Final Rule

If a new Cursor agent can read only this document set and immediately distinguish:

- product vision
- engineering truth
- future/deferred items
- legacy noise

then the Quest docs set is normalized enough for planning.
