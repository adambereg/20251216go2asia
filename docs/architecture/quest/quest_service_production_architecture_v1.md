# Quest Service — Production Architecture v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Service:** `quest-service`  
**Document role:** SSOT draft for production architecture and implementation baseline  
**Status:** Draft for engineering implementation (Cursor)

**Authoritative stack note:** this document is canonical together with:
- `quest_domain_model_v1.md` (domain ownership/model)
- `quest_dependency_map_v1.md` (dependency boundaries)
- `quest_openapi_outline_v1.md` + `docs/openapi/quest.yaml` (API contract direction)

**Runtime status rubric:**
- Current runtime: `quest-service` handles CRUD/progress/submissions and uses staged/noop event publishing.
- Current step target: keep Quest write model narrow and source-aware via external references.
- Future integration target: full downstream event bus propagation and deeper cross-service validation hooks.

---

# 1. Purpose

This document defines the **production architecture of quest-service**.

It provides:

- domain boundaries
- canonical entities and responsibilities
- integration model with other services
- event-driven architecture
- validation and anti-abuse principles
- scaling strategy
- implementation guidance

Quest Service must be implemented as a **real backend domain**, not as a UI extension or feature layer.

---

# 2. Architectural Role of Quest

Quest Service is the **activity engine of Go2Asia**.

It connects:

- Atlas (places)
- Pulse (events)
- RF (partners)
- Space (social layer)
- Connect / Points (economy)

---

## Product meaning

> Quest transforms ecosystem objects into structured user activity scenarios.

---

## Technical meaning

> Quest Service = state machine + validation engine for user actions

---

# 3. Domain Boundary

## 3.1 What Quest Service owns

- quests
- quest steps
- quest progress
- submissions (proofs)
- validation lifecycle
- quest-related events

---

## 3.2 What Quest Service does NOT own

Quest must not absorb other domains.

It does NOT own:

- posts → `space-service`
- reactions → `reactions-service`
- points / balances → `points-service`
- vouchers (lifecycle) → `rf-service` (future integration path)
- identity → `user-service`
- AI orchestration → assistant layer
- partner management → RF domain
- geo data → Atlas / Geo layer

---

## 3.3 Core rule

> Quest owns behavior, not content and not economy.

---

# 4. Production Design Principles

---

## 4.1 Scenario-first modeling

Quest must support **composed multi-step scenarios**.

Not:

- simple checklist

But:

- structured journey

---

## 4.2 External references only

Quest must reference:

- places
- events
- partners
- posts

Never duplicate them.

---

## 4.3 Proof-based execution

Each step requires:

- proof
- validation
- approval (optional)

---

## 4.4 Event-driven architecture

Quest must emit events for:

- rewards
- notifications
- analytics

---

## 4.5 Backend-first

UI must adapt to Quest API, not define it.

---

# 5. Canonical Entities

---

## 5.1 quest

Scenario definition.

---

## 5.2 quest_step

Action inside scenario.

---

## 5.3 quest_progress

User state machine instance.

---

## 5.4 quest_submission

Proof and validation.

---

---

# 6. Database Architecture

---

## 6.1 Core tables

- quest
- quest_step
- quest_progress
- quest_submission

---

## 6.2 Relations

- one quest → many steps
- one quest → many progress records
- one progress → many submissions
- one step → many submissions

---

## 6.3 Important constraints

- step order must be deterministic
- progress must be sequential
- submission belongs to progress

---

# 7. API Architecture

---

## 7.1 Endpoint groups

- public discovery
- progress
- submission
- PRO creation
- validation

---

## 7.2 Rules

- no economy data
- no social data
- no duplication of external domains

---

---

# 8. Event Model

Quest must emit events.

---

## 8.1 Core events

- quest.started
- quest.step.completed
- quest.submission.created
- quest.submission.approved
- quest.completed

---

## 8.2 Event consumers

Current runtime:

- staged/noop publisher only (events are built and logged, without full downstream propagation)

Target consumers:

- Points / Connect
- Notification service
- Analytics
- AI layer

---

## 8.3 Why events matter

- decouples rewards
- decouples notifications
- allows scaling

---

---

# 9. Integration Architecture

---

## 9.1 Space Service

Use case: social steps

Flow:

1. Quest requires social proof/reference
2. User creates post in Space
3. Quest validates reference payload/state

Current runtime note:

- Quest keeps proof references/validation state locally.
- Cross-service validation against Space content APIs is phased and not assumed as universally active.

---

## 9.2 Points Service

Flow:

Target flow:

quest.completed → event → points

Current runtime note:

- Quest does not execute Points ledger operations directly.
- Downstream Points propagation depends on non-noop event transport wiring.

---

## 9.3 RF voucher lifecycle (future integration)

Flow:

quest unlock → voucher usage

---

## 9.4 Atlas / Geo

Used for:

- location validation
- geo queries

---

---

# 10. Validation Model

---

## 10.1 Types

- auto
- geo
- qr
- manual (PRO)
- social (Space)

---

## 10.2 Manual validation

PRO can:

- approve
- reject

---

---

# 11. Anti-Abuse

---

## Basic protections

- duplicate submissions
- GPS spoofing checks
- rate limiting
- step order enforcement

---

---

# 12. Scalability

---

## Write path

- lightweight writes
- async validation

---

## Read path

- cached quest lists
- indexed queries

---

## Future extraction

Possible future services:

- quest-analytics
- quest-validation workers

---

---

# 13. Geo Support

Quest must support:

- city-level
- coordinates
- nearby queries

---

---

# 14. Repository Structure

```text
apps/
  quest-service/
    routes/
    services/
    validation/
    events/
    db/
    app.ts

packages/
  db/
    schema/quest.ts

docs/
  openapi/quest.yaml
```

---

---

# 15. Implementation Phases

---

## Phase A — Design

- approve domain model
- write OpenAPI

---

## Phase B — Core

- quest
- steps
- progress
- submission

---

## Phase C — Validation

- manual validation
- social steps

---

## Phase D — Integration

- points
- space
- notifications

---

## Phase E — Scaling

- caching
- async workers

---

---

# 16. Most Important Rule

> Quest Service must remain a **clean activity engine**, not a monolith.

---

# 17. Final Summary

Quest Service is:

- a state machine
- a validation engine
- a scenario builder

It is NOT:

- a social network
- a wallet
- a partner system
- a UI aggregator

---

## Final formula

> **Quest = scenario + steps + progress + validation + events**
