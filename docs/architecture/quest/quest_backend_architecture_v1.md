# Quest Backend Architecture v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** SSOT draft for backend architecture and service layering of Quest Asia  
**Status:** Draft for engineering review and Cursor implementation guidance

---

# 1. Purpose

This document defines the backend architecture of **Quest Asia** and clarifies:

1. Quest Asia as a product module
2. Quest Service as the backend activity engine
3. Other services that participate in Quest flows but must not be absorbed

The goal is to prevent Quest from becoming a monolith and to preserve clean service boundaries.

---

# 2. High-Level Definition

## 2.1 Quest Asia

Quest Asia is the **activity layer** of Go2Asia.

It provides:

- structured scenarios (quests)
- user progression
- validation flows
- integration with offline + social actions

Quest Asia is not just a feature — it is a **behavior engine for the ecosystem**.

---

## 2.2 Quest Service

Quest Service is the backend source of truth for:

- quest definitions
- step logic
- user progress
- submissions
- validation lifecycle

Short formula:

> **Quest Service = source of truth for activity scenarios and execution state**

---

# 3. What Quest Service Must Not Become

Quest Service must not absorb:

- social content → Space
- interactions → Reactions
- economy → Points / Connect
- vouchers (lifecycle) → RF domain (future integration path)
- partner management → RF
- identity → User Service
- AI orchestration → Assistant layer

This is critical to avoid a “God Service”.

---

# 4. Correct Architectural Role of Quest Service

Quest Service sits between:

- PRO Console (scenario creation)
- VIP Dashboard (scenario execution)

---

## 4.1 Quest Service owns

### A. Scenario definition
- quests
- steps

### B. Execution state
- progress
- step completion

### C. Validation
- submission
- approval/rejection

### D. Event emission
- lifecycle events

---

# 5. Relationship Between Quest UI and Quest Service

## 5.1 Quest UI

User-facing surfaces:

- quest catalog
- quest page
- progress UI
- submission UI

---

## 5.2 Quest Service

Backend system:

- state machine
- validation engine

---

## 5.3 Other services

Provide:

- social content (Space)
- rewards (Points)
- partner benefits (RF / Voucher)
- geo data (Atlas)

---

# 6. Backend Layers Around Quest

---

## 6.1 Core Activity Layer

Quest Service:

- quests
- steps
- progress
- submissions

---

## 6.2 Validation Layer

Handles:

- manual validation (PRO)
- automated validation (geo / QR)
- social validation (Space)

Current runtime note:

- baseline validation is local to Quest using submitted proof payloads and Quest-owned state.
- cross-service proof verification hooks (Pulse/RF/Space as source-aware validators) are phased target integrations.

---

## 6.3 Integration Layer

Target integration layer connects Quest with:

- Space Service
- Points Service
- Geo / Atlas
- RF voucher lifecycle (future)

Current runtime note:

- Quest uses explicit references to external domains.
- broad runtime cross-service validation/wiring is not assumed as fully active by default.

---

## 6.4 External Layers

- PRO Console
- User Dashboard
- AI Assistant Layer

---

# 7. Quest vs Space

This boundary must be strictly enforced.

| Space | Quest |
|------|------|
| posts | scenarios |
| discussion | progression |
| content | actions |

---

## Key rule

> Space stores content. Quest validates actions.

---

# 8. Social Integration Pattern

---

## Example flow

1. Quest requires post
2. User creates post in Space
3. Quest stores reference
4. Quest validates reference/state in Quest context

---

## Important constraint

Quest must NOT store:

- post content
- reactions

Only:

- reference
- validation state

---

# 9. PRO Console Role

PRO Console is a separate operational layer.

It:

- creates quests
- defines steps
- connects partners
- validates submissions

Quest Service provides API only.

---

# 10. User Dashboard Role

Dashboard aggregates:

- active quests
- progress
- rewards (from Points)
- vouchers (future)

Quest Service only provides progress data.

---

# 11. Event-Driven Architecture

Quest must emit events.

---

## Core events

- quest.started
- quest.step.completed
- quest.submission.created
- quest.submission.approved
- quest.completed

---

## Consumers

- Points Service
- Notification Service
- Analytics
- AI layer

---

# 12. Quest Service ↔ Space Service

---

## Pattern

Quest → requires social action  
Space → stores post  
Quest → validates  

---

## Rule

No direct DB access.

Only:

- API
- events

---

# 13. Quest Service ↔ Points Service

---

## Target flow

quest.completed → event → points

Current runtime note:

- Quest does not execute Points ledger operations directly.
- downstream Points propagation depends on non-noop event transport wiring.

---

## Rule

Quest must NOT calculate rewards.

---

# 14. Quest Service ↔ Voucher Layer (future)

---

## Flow

quest unlock → voucher availability

---

## Rule

Voucher logic must remain separate.

---

# 15. Quest Service ↔ Geo / Atlas

---

## Used for

- place validation
- nearby queries

---

## Rule

Quest stores references only.

---

# 16. Quest Service ↔ AI Layer

---

## Quest provides

- progress state
- user behavior data

---

## AI provides

- recommendations
- automation

---

## Rule

AI does not live inside Quest Service.

---

# 17. Core Backend Pattern

Quest Service is:

- state machine
- validation engine
- event emitter

---

## Lifecycle

start → progress → submit → validate → complete

---

# 18. Anti-Abuse Layer

---

## Required controls

- submission limits
- duplicate prevention
- step order enforcement
- geo validation checks

---

# 19. Scalability

---

## Write path

- simple inserts
- async validation

---

## Read path

- indexed queries
- caching for quest catalog

---

## Future extraction

- validation workers
- analytics service

---

# 20. Repository Structure

```text
apps/
  quest-service/
    routes/
    services/
    validation/
    events/
    db/
    app.ts
    server.ts

packages/
  db/
    schema/quest.ts

docs/
  openapi/quest.yaml
```

---

# 21. Frontend Integration Rules

- use generated SDK
- no mock-driven contracts
- DTO → ViewModel mapping

---

# 22. Implementation Phases

---

## Phase A — Design

- domain model
- OpenAPI

---

## Phase B — Core

- quest
- steps
- progress
- submission

---

## Phase C — Validation

- manual
- social

---

## Phase D — Integration

- points
- space

---

## Phase E — Scale

- caching
- async workers

---

# 23. Most Important Conclusion

Quest Service must be:

- central
- but minimal

---

## Final formula

> **Quest = activity engine, not content layer**
