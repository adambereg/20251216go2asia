# Quest Dependency Map v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Service focus:** `quest-service`  
**Document role:** Engineering reference describing service dependencies around Quest  
**Status:** Draft for Cursor

**Authoritative stack note:** this dependency map is canonical only together with:
- `quest_domain_model_v1.md` (domain ownership/model)
- `quest_openapi_outline_v1.md` and `docs/openapi/quest.yaml` (contract direction)
- `quest_service_production_architecture_v1.md` (runtime/production framing)

---

# 1. Purpose

This document defines dependency relationships around **Quest Service**, which acts as the **activity engine of Go2Asia**.

It clarifies:

- which services **read** Quest data
- which services **write** through Quest API
- which services **subscribe to Quest events**
- which dependencies are **forbidden**

---

# 2. Core Rule

> Quest data is widely readable but only writable by Quest Service.

Only Quest Service writes:

- quest
- quest_step
- quest_progress
- quest_submission

All other services interact via:

- API
- events

---

# 3. Services That Read Quest

---

## 3.1 User Dashboard

**Reads:**

- quest_progress
- active quests
- completion status

**Purpose:**

- display user progress
- show active quests

---

## 3.2 PRO Console

**Reads:**

- quests
- steps
- submissions
- progress analytics

**Purpose:**

- manage quests
- validate steps
- analyze performance

---

## 3.3 Points / Connect Service

**Reads:**

- quest completion events

**Purpose:**

- reward user activity

**Dependency type:**

event-driven

---

## 3.4 Notification Service

**Reads:**

- quest events
- user progress

**Purpose:**

- notify users about:
  - step completion
  - quest completion
  - validation results

---

## 3.5 Analytics / Observability

**Reads:**

- quests
- progress
- submissions
- event stream

**Purpose:**

- engagement metrics
- completion rates
- funnel analysis

---

## 3.6 AI / Assistant Layer

**Reads:**

- quest progress
- user behavior

**Purpose:**

- recommendations
- guidance
- automation

---

## 3.7 Guru / Discovery Layer

**Reads:**

- quest metadata
- geo-linked quests

**Purpose:**

- nearby quest discovery

---

# 4. Services That Write Through Quest API

---

## 4.1 Frontend (VIP)

**Actions:**

- start quest
- submit step
- check progress

---

## 4.2 PRO Console

**Actions:**

- create quest
- add steps
- publish quest
- validate submissions

---

## 4.3 AI / Assistant Layer

**Actions:**

- suggest quests (optional future)
- assisted step submission (controlled)

---

# 5. Services Subscribing to Quest Events

---

## Core events

- quest.started
- quest.step.completed
- quest.submission.created
- quest.submission.approved
- quest.completed

---

## Event consumers

Current runtime:

- staged/noop publisher only (domain events are constructed, but external propagation is not yet wired as a production event bus)

Target integrations:

- Points / Connect
- Notification Service
- Analytics
- AI Assistant Layer

---

# 6. Integration with Other Domains

---

## 6.1 Space Service

**Interaction type:**

reference + validation

**Use cases:**

- social step (post required)
- quest-related posts

---

## Rule

Quest must not store social content.

---

## 6.2 Points Service

**Interaction type:**

event-driven

---

## Rule

Quest does not calculate rewards.
Quest may keep a bounded delivery outbox for its own `quest.completed` events, but balances and ledger truth remain in Points.

---

## 6.3 Pulse Service

**Interaction type:**

reference + validation dependency

---

## Rule

For `attend_event` steps, Quest relies on Pulse event/attendance truth and must not treat event participation as Quest-owned data.

---

## 6.4 RF Service

**Interaction type:**

reference + validation dependency

---

## Rule

For partner/branch-related steps, Quest relies on RF partner/branch truth and must not own partner identity or voucher lifecycle.

---

## 6.5 RF voucher lifecycle (future integration)

**Interaction type:**

reference + unlock logic

---

## Rule

Quest does not store vouchers.

---

## 6.6 Atlas / Geo

**Interaction type:**

reference

---

## Rule

Quest does not own location data.

---

# 7. Forbidden Dependencies

---

## Direct DB writes

The following must NEVER write directly:

- Space Service
- Points Service
- Voucher Service
- AI Layer
- PRO Console backend

---

## Domain violations

Quest must not absorb:

- social content
- rewards
- vouchers
- identity
- partner management

---

# 8. Dependency Strength

---

## Strong

- Dashboard
- PRO Console

---

## Medium

- Points / Connect
- Notifications
- Analytics

---

## Weak

- AI Layer
- Guru
- Campaign systems

---

# 9. Architecture Diagram

```
            +------------------+
            |   User/Auth      |
            +------------------+
                     |
                     v
+-------------+   +------------------+   +------------------+
| Atlas/Geo   |-->|  Quest Service   |-->| Points / Connect |
+-------------+   +------------------+   +------------------+
                     |
                     +----> Space Service (target integration edge)
                     |
                     +----> Notification Service (target integration edge)
                     |
                     +----> Analytics (target integration edge)
                     |
                     +----> AI / Assistant (target integration edge)
                     |
                     +----> PRO Console
                     |
                     +----> User Dashboard
                     |
                     +----> Pulse Service (validation dependency for event steps)
                     |
                     +----> RF Service (validation dependency for partner/branch steps)
```

---

# 10. Key Architectural Rule

> Quest Service must be **narrowly writable and widely readable**.

---

# 11. Implementation Guidance

Before adding new logic:

- check domain ownership
- prefer new service over expanding Quest
- use events instead of sync calls

---

# 12. Final Summary

Quest Dependency Model ensures:

- clean architecture
- decoupled services
- scalable event-driven system

---

## Final formula

> Quest = activity engine with controlled writes and open reads
