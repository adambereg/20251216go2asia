# Quest Implementation Planning Pack v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Implementation planning pack for Quest wave 1  
**Status:** Active planning reference  
**Depends on:** `quest_normalization_pack_v1.md`, Quest SSOT package, `docs/openapi/quest.yaml`

---

# 1. Purpose

This document defines the practical implementation plan for **Quest wave 1**.

It exists to answer, without reopening scope drift:

- what belongs to current Quest wave 1
- what is explicitly deferred
- what backend slices go first
- what frontend surfaces are required
- what blocks wave 1 and what does not
- what must be true before wave 1 is considered done

This document must be read together with:

- `docs/architecture/quest/quest_normalization_pack_v1.md`
- `docs/knowledge/quest_asia.md`
- `docs/openapi/quest.yaml`
- Quest SSOT package in `docs/architecture/quest/`

---

# 2. Wave 1 Implementation Summary

## Planning verdict

Quest wave 1 is the **current runtime-backed scenario baseline**:

- Quest backend as a narrow activity engine
- Quest API aligned to `docs/openapi/quest.yaml`
- Quest frontend limited to the real baseline:
  - `/quest`
  - `/quest/[id]`
  - `/quest/[id]/run`

Wave 1 is **not**:

- a wallet or economy rollout
- a voucher rollout
- a broad social layer rollout
- a wide PRO Console rollout
- a dashboard or leaderboard rollout

---

# 3. Wave 1 Scope

## 3.1 Backend core

Wave 1 backend must include:

- canonical Quest entities:
  - `quest`
  - `quest_step`
  - `quest_progress`
  - `quest_submission`
- narrow Quest-owned write model
- lifecycle/state machine:
  - start
  - progress
  - submit
  - review
  - completion
- baseline proof handling
- manual review path
- domain event formation at key lifecycle points
- runtime/readiness endpoints

Wave 1 backend must keep out:

- social content ownership
- reward ledger execution
- voucher lifecycle ownership
- partner management ownership
- identity ownership

---

## 3.2 API slice

Wave 1 mandatory endpoint groups:

- health:
  - `GET /health`
  - `GET /version`
  - `GET /ready`
- public read:
  - `GET /v1/quests`
  - `GET /v1/quests/{questId}`
- VIP lifecycle:
  - `POST /v1/quests/{questId}/start`
  - `GET /v1/quests/{questId}/progress`
  - `POST /v1/quests/{questId}/steps/{stepId}/submit`
- PRO creation:
  - `POST /v1/quests`
  - `POST /v1/quests/{questId}/steps`
  - `POST /v1/quests/{questId}/publish`
- moderation:
  - `GET /v1/quests/{questId}/submissions`
  - `POST /v1/submissions/{submissionId}/review`

Wave 1 API rules:

- public list/detail only for published public quests
- authenticated lifecycle/mutation paths through gateway auth
- no points balance, voucher objects, Space post bodies, or user identity payload ownership in Quest API

---

## 3.3 Frontend slice

Wave 1 frontend must include only the real baseline:

- `/quest`
- `/quest/[id]`
- `/quest/[id]/run`

Supporting frontend truth:

- `packages/sdk/src/quest.ts`
- `docs/openapi/quest.yaml`
- `docs/architecture/quest/quest_frontend_live_adoption_milestone_note_v1.md`

Wave 1 frontend goal:

- one honest runtime-backed user journey:
  - discover quest
  - open quest
  - start quest
  - observe progress
  - submit proof
  - observe pending/completed/non-active outcomes

---

## 3.4 Explicitly deferred

The following are explicitly out of Quest wave 1:

- `/quest/my`
- leaderboard
- rich final completion / rewards screen
- wider PRO Console UI
- dashboard aggregation surface
- deep Space-linked Quest surfaces
- mature social proof toolset
- voucher lifecycle / voucher UX
- NFT ownership / richer reward UX
- G2A / broader token economy
- Guru / nearby-first quest discovery
- full downstream reward propagation as a done-gate
- deep cross-service validation as a done-gate

---

# 4. Backend Slices

## 4.1 Slice 1 — Domain and Data

Mandatory:

- create Quest-owned schema/tables for:
  - `quest`
  - `quest_step`
  - `quest_progress`
  - `quest_submission`
- preserve canonical relations:
  - one quest -> many steps
  - one quest -> many progress rows
  - one progress -> many submissions
  - one step -> many submissions
- store external references by `targetType` / `targetId`, not copied domain objects
- add minimum indexes for user progress and submissions by progress

Important rules:

- deterministic step order
- submission belongs to one progress
- Quest remains single writer for Quest-owned state

Status:

- **mandatory for wave 1**

---

## 4.2 Slice 2 — Lifecycle / State Machine

Mandatory:

- quest definition lifecycle:
  - draft
  - published
  - archived-ready in schema/contract where applicable
- user lifecycle:
  - not_started
  - in_progress
  - pending_review
  - completed
  - failed
  - expired
- step submission lifecycle:
  - pending
  - approved
  - rejected
- progression flow:
  - start
  - progress read
  - submit
  - review
  - completion decision

Important rules:

- sequential progress only
- step order enforced
- non-active states block further submit where appropriate
- start behavior must be predictable for repeated calls

Status:

- **mandatory for wave 1**

---

## 4.3 Slice 3 — Validation

Mandatory:

- local proof intake
- baseline proof persistence
- manual review path for moderation
- predictable handling of:
  - text proof
  - photo proof
  - geo proof
  - qr proof
  - space_post proof
- explicit invalid/blocked state handling

Explicitly not required in wave 1:

- deep Pulse attendance validation
- deep RF truth validation
- deep Space content API validation
- production-grade anti-fraud stack
- full geo anti-spoof enforcement

Important framing:

- wave 1 validation is a **baseline validation path**
- source-aware deep validators are **future-ready**, not required for wave 1 closure

Status:

- local proof + manual review = **mandatory**
- richer cross-service validation = **deferred**

---

## 4.4 Slice 4 — Events

Wave 1 event names must exist for:

- `quest.started`
- `quest.step.completed`
- `quest.submission.created`
- `quest.submission.approved`
- `quest.completed`

Wave 1 event expectations:

- event formation points are real and stable
- event transport may remain staged/noop
- downstream Points / notifications / analytics are not wave 1 done-gates

Status:

- event naming + internal emit points = **mandatory**
- full downstream delivery = **desirable but deferrable**
- production event bus maturity = **deferred**

---

# 5. Frontend Slices

## 5.1 `/quest`

Wave 1 meaning:

- runtime-backed public quest catalog

Required minimum:

- fetch via live Quest API
- loading state
- error state
- empty state
- list of published quests
- basic display fields:
  - title
  - description
  - difficulty
  - theme
  - steps count
  - reward points intent
- link to quest detail

Must not promise:

- nearby discovery as current default
- leaderboard
- wallet or reward issuance
- broad filtering beyond current contract

---

## 5.2 `/quest/[id]`

Wave 1 meaning:

- honest quest detail screen backed by live contract

Required minimum:

- fetch detail via live Quest API
- 404 / unavailable handling
- core quest metadata
- step list
- clear CTA to run
- explicit note that authentication is required for lifecycle actions
- explicit note that review/pending states may occur

Must not promise:

- rich rewards theater
- deep partner/social/economy flows
- full PRO/operator behavior on this screen

---

## 5.3 `/quest/[id]/run`

Wave 1 meaning:

- minimal live lifecycle runner

Required minimum:

- initialize/start quest
- fetch current progress
- display lifecycle state
- display current step
- allow proof submission
- display last submission state
- display blocked states such as pending review / completed / failed / expired

Acceptable technical UI:

- proof type selector
- JSON proof payload input
- explicit runtime messaging
- basic refresh/retry actions

Product minimum that still must exist:

- the user must understand whether the quest is active
- the user must understand whether submission succeeded
- the user must understand when review is pending
- the user must not be misled into thinking wallet/reward settlement already happened in Quest

---

## 5.4 Do not touch in wave 1

Do not reopen in wave 1:

- `/quest/my`
- `/quest/leaderboard`
- `/space/quests`
- rich completion / rewards theater
- broad operator console
- dashboard-level quest aggregation
- richer proof UX toolset

---

# 6. Blockers and Dependency Edges

## 6.1 Hard blockers

Wave 1 cannot start or close correctly without:

- one stable Quest-owned data model for the four canonical entities
- OpenAPI alignment to `docs/openapi/quest.yaml`
- gateway-authenticated mutation paths
- single-writer discipline for Quest-owned state
- clear lifecycle/state-machine implementation
- manual review path
- real frontend alignment to `/quest`, `/quest/[id]`, `/quest/[id]/run`

---

## 6.2 Soft blockers

These are important but must not stop wave 1 start:

- event bus maturity beyond staged/noop
- deeper Space/Pulse/RF validation hooks
- broader PRO UI
- more polished proof UX
- better anti-abuse hardening

These may affect completeness or polish, but should not block initial implementation planning or baseline delivery.

---

## 6.3 Non-blockers

These must not be allowed to block wave 1:

- voucher-service design
- voucher lifecycle rollout
- richer NFT/reward UX
- G2A / token economy
- Guru / nearby-first discovery
- dashboard aggregation
- leaderboard
- `/quest/my`
- deep Space-linked surfaces
- broad PRO Console breadth

---

# 7. Recommended Execution Order

Use this order unless a concrete repo/runtime constraint forces a narrow reorder:

1. schema + core entities
2. public list/detail read slice
3. start/progress lifecycle slice
4. submit/review/completion slice
5. PRO draft/steps/publish slice
6. frontend alignment for `/quest`, `/quest/[id]`, `/quest/[id]/run`
7. event baseline and staged/noop emission points
8. hardening pass for acceptance criteria closure

Why this order:

- it establishes Quest as a real domain before UI polish
- it closes the end-to-end user lifecycle before deferred surfaces
- it keeps events honest without forcing downstream integrations into wave 1

---

# 8. Acceptance Criteria

## 8.1 Backend acceptance

Backend wave 1 is done when:

- Quest-owned schema exists for all four canonical entities
- all mandatory wave 1 endpoints from `quest.yaml` behave according to contract
- published/public list and detail work correctly
- lifecycle transitions are predictable and consistent
- submit/review/completion logic works for the baseline path
- manual review is functional
- event formation points exist for the canonical Quest events
- Quest does not absorb social, economy, voucher, partner-management, or identity ownership

---

## 8.2 Frontend acceptance

Frontend wave 1 is done when:

- `/quest` is runtime-backed and honest in loading/error/empty/data states
- `/quest/[id]` is runtime-backed and honest about what the screen represents
- `/quest/[id]/run` performs real start/progress/submit against live Quest API
- lifecycle states are clearly visible to the user
- proof submission is usable, even if technically minimal
- deferred surfaces remain clearly out of scope and are not falsely presented as live Quest truth

---

## 8.3 Architecture acceptance

Architecture wave 1 is done when:

- Quest is still a narrow activity engine
- Quest remains a state machine / validation engine, not a God Service
- external domains are referenced, not absorbed
- deferred and future-only items have not leaked into wave 1 scope
- the implementation is not mock-driven where the baseline claims live runtime truth

---

# 9. Post-Wave-1 Horizon

Logical next items after wave 1, but not inside it:

- `/quest/my`
- leaderboard
- richer proof UX
- wider PRO Console
- dashboard aggregation
- deeper Space validation
- deeper RF partner/branch/voucher-linked flows
- richer event consumers
- Guru discovery
- richer rewards presentation

These belong to a later, explicitly reopened Quest wave, not to wave 1 closure.

---

# 10. Final Rule

If another engineer can read only this planning pack plus the normalized Quest docs and immediately start Quest wave 1 without reopening:

- current scope
- frontend truth
- deferred surfaces
- vouchers/rewards/social drift

then this planning pack is sufficient.
