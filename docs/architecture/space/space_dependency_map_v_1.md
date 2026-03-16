# Space Dependency Map v1

**Project:** Go2Asia  
**Module:** Space Asia  
**Service focus:** `space-service`  
**Document role:** Engineering reference describing service dependencies around Space  
**Status:** Draft for Cursor

---

# 1. Purpose

This document defines the dependency relationships around **Space Service**, which acts as the **social core of the Go2Asia ecosystem**.

The goal is to make clear:

- which services **read** Space data
- which services **write** through the Space API
- which services **subscribe to Space events**
- which dependencies are **explicitly forbidden**

This ensures that Space remains a **clean, stable social-core service** rather than becoming an uncontrolled monolith.

---

# 2. Core Rule

Space must follow a strict dependency discipline:

**Space data is widely readable but only writable by Space Service.**

In short:

> Only Space Service writes Space-owned tables.

Other services must interact through:

- public API
- internal API
- event streams

Never through direct database access.

---

# 3. Services That Read Space

These services consume Space data or projections.

## 3.1 Feed Layer / Feed Service

**Reads:**

- `space_post`
- `space_group`
- `space_group_member`

**Purpose:**

- build home feed
- build profile feed
- build group feed
- assemble delivery streams

**Dependency type:**

read + event subscription

---

## 3.2 Reactions Service

**Reads:**

- post existence
- group existence
- visibility context

**Purpose:**

- validate interaction targets
- attach likes, bookmarks, questions

**Dependency type:**

read validation

---

## 3.3 Notification Service

**Reads:**

- post author
- group membership
- profile projections

**Purpose:**

- generate social notifications

**Dependency type:**

event-driven + lightweight reads

---

## 3.4 Points / Connect Service

**Reads:**

- social activity events
- optional author metadata

**Purpose:**

- reward social activity
- compute reputation signals

**Dependency type:**

event-driven

---

## 3.5 Analytics / Observability

**Reads:**

- posts
- groups
- publication activity
- event stream

**Purpose:**

- growth metrics
- engagement analysis

**Dependency type:**

warehouse / projection

---

## 3.6 AI / Assistant Layer

**Reads:**

- posts
- reposts
- groups
- profile projections
- organizer signals (if present)

**Purpose:**

- generate suggestions
- reminders
- planning assistance

**Dependency type:**

context read

---

## 3.7 Blog / Editorial Workflows

**Reads:**

- selected user posts
- popularity signals

**Purpose:**

- identify UGC suitable for editorial promotion

**Dependency type:**

read-only

---

## 3.8 Guru / Discovery Layer

**Reads:**

- social signals around places
- curator activity

**Purpose:**

- enrich nearby discovery with human context

**Dependency type:**

aggregated projection

---

# 4. Services That Write Through Space API

These services may trigger Space actions but must **never write directly to Space tables**.

## 4.1 Space UI / Frontend

**Actions:**

- create post
- repost
- join group
- attach media

**Dependency type:**

public API client

---

## 4.2 Blog Workflows

**Actions:**

- editorial repost
- article announcement post

**Dependency type:**

API or event-triggered write

---

## 4.3 Quest Workflows

**Actions:**

- quest completion post
- quest announcement

**Dependency type:**

API-triggered write

---

## 4.4 Partner Campaign Workflows (RF)

**Actions:**

- partner campaign post
- promotional announcement

**Dependency type:**

system-triggered write

---

## 4.5 AI / Assistant Layer

**Actions:**

- suggested post
- assisted publication

**Dependency type:**

controlled API write

AI must never publish silently without permission rules.

---

# 5. Services Subscribing to Space Events

Space should emit events consumed by other services.

## Core events

- `space.post.created`
- `space.post.updated`
- `space.post.deleted`
- `space.post.reposted`
- `space.group.created`
- `space.group.member_joined`
- `space.group.member_left`
- `space.post.media_attached`

## Event consumers

- Feed Service
- Reactions Service
- Notification Service
- Points / Connect
- Analytics
- AI assistant layer

---

# 6. Forbidden Dependencies

The following architectural patterns are **not allowed**.

### Direct database writes

The following services must not write directly to Space tables:

- Quest Service
- Blog Service
- RF Service
- AI layer
- Reactions Service
- Connect Service

### Ownership violations

The following domains must not migrate into Space Service:

- reactions
- rewards
- partner workflows
- quest management
- planner logic
- AI orchestration

---

# 7. Dependency Strength Levels

Dependencies can be classified by strength.

## Strong dependencies

Essential for social loop operation:

- Feed Service
- Reactions Service
- Notification Service

## Medium dependencies

Useful but not critical for publication flow:

- Connect / Points
- Analytics
- AI layer

## Weak dependencies

Contextual integrations:

- Blog editorial
- Guru projections
- partner campaigns

---

# 8. Architecture Diagram

```
                 +------------------+
                 |   User/Auth      |
                 +------------------+
                          |
                          v
+-------------+    +------------------+    +------------------+
| Media       |<-->|   Space Service  |--->| Feed Service     |
+-------------+    +------------------+    +------------------+
                          |
                          +----> Reactions Service
                          |
                          +----> Notification Service
                          |
                          +----> Points / Connect
                          |
                          +----> Analytics
                          |
                          +----> AI / Assistant Layer
                          |
                          +----> Blog Editorial Workflows
                          |
                          +----> Guru Discovery Layer
```

---

# 9. Key Architectural Rule

The most important principle of the Space dependency model is:

> Space Service should be **widely readable but narrowly writable**.

This keeps Space stable while allowing the rest of the ecosystem to evolve around it.

---

# 10. Implementation Guidance for Cursor

Cursor should use this document when implementing:

- service boundaries
- event contracts
- cross-service integrations

Before implementing new logic inside Space Service, verify that the logic truly belongs to the **social publication domain** and does not belong to another service.

If uncertain, prefer creating a new service rather than expanding Space.

