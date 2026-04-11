# Quest Wave 1 Execution Brief v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Bounded execution brief for Quest wave 1  
**Status:** Active execution reference  
**Depends on:** `quest_normalization_pack_v1.md`, `quest_implementation_planning_pack_v1.md`, Quest SSOT package, `docs/openapi/quest.yaml`

---

# 1. Purpose

This document turns the Quest wave 1 planning pack into an execution-minded brief.

It exists to answer:

- what to do first
- what to do next
- what must be true before each phase starts
- what must not be reopened in wave 1
- what counts as done

This is not a new audit and not a new planning pack.

---

# 2. Execution Brief Summary

Quest wave 1 execution means:

- implement Quest as a **narrow activity engine**
- keep Quest aligned to `docs/openapi/quest.yaml`
- deliver only the real frontend baseline:
  - `/quest`
  - `/quest/[id]`
  - `/quest/[id]/run`
- keep deferred and future-only items out of the execution path

Main execution verdict:

> Start with **contract + schema + public read**, then close the user lifecycle, then align the three live frontend surfaces, then finish with event baseline and hardening.

---

# 3. Execution Phases

## Phase 0 — Contract Lock

### Goal

Freeze Quest wave 1 against the normalized Quest docs set and `docs/openapi/quest.yaml`.

### In scope

- confirm Quest wave 1 uses:
  - `quest_normalization_pack_v1.md`
  - `quest_implementation_planning_pack_v1.md`
  - Quest SSOT package
  - `docs/openapi/quest.yaml`
- confirm `quest_ui.md` is not used as scope or route truth
- confirm deferred and non-scope items stay out

### Out of scope

- changing wave 1 scope
- reopening vouchers / rewards / broad social / leaderboard / dashboard

### Dependencies

- normalized Quest docs already exist

### Exit criteria

- one implementation branch or workstream can proceed without reopening scope
- all contributors agree the contract source is `docs/openapi/quest.yaml`

---

## Phase 1 — Schema and Domain Foundation

### Goal

Establish Quest as a real backend domain with stable Quest-owned state.

### In scope

- schema/tables for:
  - `quest`
  - `quest_step`
  - `quest_progress`
  - `quest_submission`
- canonical relations
- minimum indexes
- external references through `targetType` / `targetId`
- Quest single-writer discipline
- deterministic step order support

### Out of scope

- cross-service validators
- reward propagation
- voucher logic
- broad analytics

### Dependencies

- Phase 0 complete
- domain model accepted as execution truth

### Exit criteria

- all four canonical entities exist in schema/storage
- relations and minimum indexes are in place
- no foreign-domain ownership is introduced into Quest tables

---

## Phase 2 — Public Read Baseline

### Goal

Close the public Quest read model before adding lifecycle mutations.

### In scope

- `GET /health`
- `GET /version`
- `GET /ready`
- `GET /v1/quests`
- `GET /v1/quests/{questId}`
- list/detail behavior for published public quests only

### Out of scope

- start/progress
- submit/review
- authoring
- nearby-first discovery

### Dependencies

- Phase 1 complete

### Exit criteria

- read endpoints match `quest.yaml`
- public read does not leak drafts or non-public quests
- health/readiness behavior is stable enough for downstream integration and frontend usage

---

## Phase 3 — Lifecycle Foundation

### Goal

Make Quest a real state machine for the user journey.

### In scope

- lifecycle rules for:
  - draft / published / archived-ready
  - not_started / in_progress / pending_review / completed / failed / expired
  - pending / approved / rejected
- `POST /v1/quests/{questId}/start`
- `GET /v1/quests/{questId}/progress`
- repeated start behavior
- sequential progression rules

### Out of scope

- submit/review
- deep validation
- frontend polishing

### Dependencies

- Phase 2 complete

### Exit criteria

- start/progress endpoints behave predictably
- progress reflects state-machine truth
- repeated start does not create undefined behavior

---

## Phase 4 — Submit, Review, Completion

### Goal

Close the baseline Quest user loop end-to-end.

### In scope

- `POST /v1/quests/{questId}/steps/{stepId}/submit`
- `GET /v1/quests/{questId}/submissions`
- `POST /v1/submissions/{submissionId}/review`
- baseline proof handling
- manual review path
- completion decision path
- non-active state blocking for submit where applicable

### Out of scope

- deep Pulse/RF/Space validators
- rich anti-fraud
- reward delivery closure

### Dependencies

- Phase 3 complete

### Exit criteria

- submit -> pending review -> approve/reject path works
- completion becomes reachable through the baseline path
- blocked/non-active states behave honestly and predictably

---

## Phase 5 — PRO Authoring Baseline

### Goal

Enable the narrow PRO write path required by Quest wave 1 API.

### In scope

- `POST /v1/quests`
- `POST /v1/quests/{questId}/steps`
- `POST /v1/quests/{questId}/publish`
- draft -> steps -> publish behavior

### Out of scope

- wide PRO Console UI
- admin/operator suite
- analytics suite

### Dependencies

- Phase 4 complete

### Exit criteria

- narrow authoring path exists and matches contract
- publishing controls what becomes visible to public list/detail

---

## Phase 6 — Frontend Baseline Alignment

### Goal

Align the real Quest frontend baseline to live Quest runtime truth.

### In scope

- `/quest`
- `/quest/[id]`
- `/quest/[id]/run`
- live use of Quest API / SDK
- honest loading / error / empty / state messaging
- acceptable technical proof UX

### Out of scope

- `/quest/my`
- leaderboard
- rewards theater
- broad PRO/operator UI
- dashboard aggregation
- deep Space-linked Quest surfaces

### Dependencies

- Phase 4 complete for user lifecycle
- Phase 5 complete if authoring paths are needed for broader validation, but not required for public baseline screens

### Exit criteria

- three baseline routes are runtime-backed
- deferred routes are not presented as live Quest truth
- UI does not promise wallet/reward settlement or broad social capability

---

## Phase 7 — Event Baseline and Hardening

### Goal

Finish wave 1 with stable emit points and closure against acceptance criteria.

### In scope

- event formation points for:
  - `quest.started`
  - `quest.step.completed`
  - `quest.submission.created`
  - `quest.submission.approved`
  - `quest.completed`
- staged/noop transport if needed
- hardening pass against acceptance criteria

### Out of scope

- full event bus rollout
- full Points/notifications/analytics propagation
- wave 2 surfaces

### Dependencies

- Phases 1-6 complete

### Exit criteria

- event names and emit points are stable
- wave 1 acceptance criteria are satisfied

---

# 4. Backend Execution Path

Use this exact order unless a concrete repo/runtime constraint forces a local reorder:

1. schema/tables
2. entity relations and invariants
3. health/ready/version
4. list/detail
5. start/progress
6. submit
7. review
8. completion logic
9. PRO create/steps/publish
10. event emit points
11. contract hardening against `quest.yaml`

Why this order:

- list/detail before mutations gives a stable public read baseline
- start/progress before submit avoids reworking lifecycle behavior later
- review/completion must be built after baseline submission semantics exist
- PRO write path should not outrun lifecycle correctness
- emit points should be attached to stable domain transitions, not invented early

Hard stop checks inside backend path:

- do not implement submit before progression rules are stable
- do not expose public list/detail before publish visibility rules are stable
- do not extend Quest API with vouchers, balances, Space post bodies, or identity ownership
- do not make deep cross-service validation a required closure condition for wave 1

---

# 5. Frontend Execution Path

## 5.1 `/quest`

### Minimal live scope

- runtime-backed catalog from Quest API
- loading / error / empty / data states
- published public quests only
- basic metadata display

### Acceptable technical UI

- utilitarian cards/list items
- simple metadata blocks
- no nearby-first or rich gamification behavior

### Must not promise

- leaderboard
- wallet/reward issuance
- nearby discovery as current default

### Required runtime states

- loading
- API unavailable / error
- empty
- list loaded

### Product minimum

- user must understand there are live published quests
- user must be able to navigate to detail

---

## 5.2 `/quest/[id]`

### Minimal live scope

- runtime-backed detail
- core metadata
- ordered step list
- CTA to run

### Acceptable technical UI

- utilitarian metadata panels
- textual step summaries
- explicit lifecycle disclaimers

### Must not promise

- rich rewards theater
- full partner/social/economy experience
- broad operator behavior

### Required runtime states

- loading if applicable
- not found / unavailable
- detail loaded

### Product minimum

- user must understand what the quest is
- user must understand that lifecycle actions require auth
- user must understand review/pending may happen

---

## 5.3 `/quest/[id]/run`

### Minimal live scope

- initialize/start quest
- fetch progress
- show lifecycle status
- show current step
- submit proof
- show last submission state

### Acceptable technical UI

- proof type selector
- JSON proof payload input
- basic refresh/retry
- plain runtime status messages

### Must not promise

- complete production-grade proof toolkit
- wallet settlement
- full downstream reward propagation
- broad social validation depth

### Required runtime states

- initializing / loading
- progress unavailable
- in_progress
- pending_review
- completed
- failed
- expired
- submission success/error feedback

### Product minimum

- user must understand if the quest is active
- user must understand if proof was submitted
- user must understand if review is pending
- user must not be misled into thinking Quest already completed broader wallet/reward settlement

---

# 6. Execution Guardrails

## 6.1 Do not open in wave 1

- `/quest/my`
- leaderboard
- rich final completion / rewards screen
- wider PRO Console UI
- dashboard aggregation
- deep Space-linked Quest surfaces
- mature social proof toolset
- voucher lifecycle
- voucher-service design
- NFT ownership / richer reward UX
- G2A / broader token economy
- Guru / nearby-first discovery

---

## 6.2 Do not do architecturally

- do not pull ownership of social content into Quest
- do not pull reward ledger execution into Quest
- do not pull voucher or partner-management ownership into Quest
- do not turn Quest into a cross-domain God Service
- do not use direct writes from other services into Quest-owned state
- do not require deep Pulse/RF/Space validation to close wave 1

---

## 6.3 Do not mask

- do not present staged/noop events as full downstream production propagation
- do not present minimal proof UX as a complete production toolkit
- do not present deferred screens as live Quest truth
- do not present reward points intent as wallet settlement
- do not use mock-driven UI where wave 1 claims live runtime truth

---

# 7. Blockers Matrix

## 7.1 Hard blockers

- stable Quest-owned schema for all four canonical entities
- OpenAPI alignment to `docs/openapi/quest.yaml`
- gateway-authenticated mutation paths
- lifecycle/state-machine correctness
- manual review path
- real frontend baseline on `/quest`, `/quest/[id]`, `/quest/[id]/run`

---

## 7.2 Soft blockers

- event bus maturity beyond staged/noop
- deeper Space/Pulse/RF validation hooks
- broader PRO UI
- stronger anti-abuse hardening
- more polished proof UX

These matter, but they must not stop wave 1 start.

---

## 7.3 False blockers

- vouchers
- voucher-service design
- richer reward UX
- NFT ownership
- G2A / token economy
- Guru / nearby
- dashboard aggregation
- leaderboard
- `/quest/my`
- deep Space-linked surfaces
- broad PRO Console breadth

These are out-of-scope noise for wave 1 closure.

---

# 8. First Implementation Pass

If Quest wave 1 implementation starts now, the first bounded pass should be:

> **Phase 1 + Phase 2**

Meaning:

- schema + canonical entities + invariants
- health / ready / version
- `GET /v1/quests`
- `GET /v1/quests/{questId}`

Why this is the safest starting pass:

- it locks the domain and contract before lifecycle complexity
- it gives a real mergeable baseline without reopening vouchers/rewards/social scope
- it enables immediate frontend read alignment later without mock drift
- it reduces the risk of rewriting state-machine behavior after UI work already starts

---

# 9. Wave 1 Done-Definition

## 9.1 Backend done

Quest backend wave 1 is done when:

- all four canonical entities exist as Quest-owned state
- all mandatory wave 1 endpoints behave according to `quest.yaml`
- published/public list-detail are correct
- start/progress/submit/review/completion baseline path works
- manual review works
- canonical Quest event emit points exist
- Quest has not absorbed social/economy/voucher/partner/identity ownership

---

## 9.2 Frontend done

Quest frontend wave 1 is done when:

- `/quest` is live and honest in all core states
- `/quest/[id]` is live and honest
- `/quest/[id]/run` is live and honest
- lifecycle states are visible and understandable
- proof submission is usable, even if technically minimal
- deferred surfaces are not falsely presented as live truth

---

## 9.3 Architecture done

Quest wave 1 is architecturally done when:

- Quest still behaves as activity engine / state machine / validation engine
- Quest has not expanded into a God Service
- external domains remain reference-based
- future and deferred surfaces have not leaked into wave 1 execution
- live-claimed surfaces are not backed by mock truth

---

# 10. Final Rule

If another engineer can read only this execution brief and start Quest wave 1 in the correct order without reopening:

- current scope
- deferred surfaces
- frontend truth
- vouchers/rewards/social drift

then this brief is sufficient.
