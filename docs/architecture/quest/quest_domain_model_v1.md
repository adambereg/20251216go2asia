# Quest Domain Model v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Service focus:** `quest-service`  
**Document role:** Engineering SSOT for domain model, schema direction, API DTO direction, and event contracts  
**Status:** Draft for Cursor implementation planning

**Authoritative stack note:** this domain model is canonical together with:
- `quest_dependency_map_v1.md` (dependency boundaries)
- `quest_openapi_outline_v1.md` + `docs/openapi/quest.yaml` (contract direction)
- `quest_service_production_architecture_v1.md` (runtime/production framing)

---

# 1. Purpose

This document defines the canonical domain model for Quest Asia.

It provides:

- core entities
- ownership boundaries
- relational structure
- schema direction
- DTO direction
- event model foundation

Quest Service models **user activity scenarios**, not content or social interaction.

---

# 2. Core Modeling Principles

## 2.1 Quest is a state machine

Quest is not a list of tasks.

Quest represents:

- start → progress → submit → validate → complete

---

## 2.2 Quest Service owns activity, not content

Quest owns:

- quests
- steps
- progress
- submissions
- validation lifecycle

Quest does NOT own:

- posts (Space)
- rewards balances (Points)
- vouchers (lifecycle in RF domain)
- users

---

## 2.3 Steps are polymorphic

Each quest step may represent different types of actions:

- offline (visit place)
- event participation
- partner interaction
- social action (Space)
- proof submission

---

## 2.4 External objects are referenced, not owned

Quest references:

- places
- events
- partners
- posts (Space)

Quest must NOT duplicate these models.

---

# 3. Canonical Entity Set

1. quest
2. quest_step
3. quest_progress
4. quest_submission

---

# 4. Entity Definitions

---

## 4.1 quest

Represents a scenario created by a PRO-spacer.

### Fields

- id
- title
- description
- creator_pro_id
- city_id
- geo_scope
- type
- theme
- difficulty
- status
- visibility
- reward_points
- reward_nft_template_id (nullable)
- steps_count
- created_at
- updated_at

---

## 4.2 quest_step

Represents a step inside a quest.

### Fields

- id
- quest_id
- order
- type
- target_type
- target_id
- verification_type
- requirements_json
- reward_points (optional)

---

## Step types

- visit_place
- attend_event
- visit_partner
- challenge
- photo_proof
- geo_checkin
- qr_code
- space_action

---

## Verification types

- auto
- geo
- qr
- manual
- space_post

---

## Source-aware proof notes (ownership-aligned)

- `attend_event` validation relies on Pulse event/attendance truth. Quest stores progression/proof state, not canonical event participation truth.
- `visit_partner` / partner-branch-related validation relies on RF partner/branch truth. Quest stores references and validation outcomes, not partner ownership data.

---

## 4.3 quest_progress

Tracks user progress.

### Fields

- id
- quest_id
- user_id
- status
- current_step
- started_at
- completed_at

---

## Status

- not_started
- in_progress
- pending_review
- completed
- failed
- expired

---

## 4.4 quest_submission

Represents proof of step completion.

### Fields

- id
- progress_id
- step_id
- user_id
- proof_type
- proof_data
- status
- reviewed_by
- reviewed_at
- created_at

---

## Proof types

- photo
- geo
- qr
- space_post
- text

---

## Submission status

- pending
- approved
- rejected

---

# 5. Relational Model

- one quest → many steps
- one quest → many progress records
- one progress → many submissions
- one step → many submissions

---

# 6. Suggested SQL Direction

## quest

```sql
CREATE TABLE quest (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text,
  creator_pro_id uuid NOT NULL,
  city_id uuid,
  type text,
  theme text,
  difficulty text,
  status text,
  visibility text,
  reward_points integer,
  reward_nft_template_id uuid,
  steps_count integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

---

## quest_step

```sql
CREATE TABLE quest_step (
  id uuid PRIMARY KEY,
  quest_id uuid NOT NULL,
  "order" integer,
  type text,
  target_type text,
  target_id uuid,
  verification_type text,
  requirements_json jsonb,
  reward_points integer
);
```

---

## quest_progress

```sql
CREATE TABLE quest_progress (
  id uuid PRIMARY KEY,
  quest_id uuid NOT NULL,
  user_id uuid NOT NULL,
  status text,
  current_step integer,
  started_at timestamptz,
  completed_at timestamptz
);
```

---

## quest_submission

```sql
CREATE TABLE quest_submission (
  id uuid PRIMARY KEY,
  progress_id uuid NOT NULL,
  step_id uuid NOT NULL,
  user_id uuid NOT NULL,
  proof_type text,
  proof_data jsonb,
  status text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

---

# 7. Index Strategy

## quest_progress

```sql
CREATE INDEX idx_quest_progress_user
ON quest_progress(user_id);
```

## quest_submission

```sql
CREATE INDEX idx_quest_submission_progress
ON quest_submission(progress_id);
```

---

# 8. API DTO Direction

## Start Quest

```json
{
  "questId": "uuid"
}
```

---

## Submit Step

```json
{
  "proofType": "photo",
  "proofData": {}
}
```

---

# 9. Event Direction

Quest must emit events:

- quest.started
- quest.step.completed
- quest.submission.created
- quest.submission.approved
- quest.completed

---

# 10. Final Summary

## Canonical glossary (compact)

- **Quest domain / Quest Service**: owner of quest definitions, progression state, submissions, and validation lifecycle.
- **Reward intent**: quest/step reward configuration and trigger semantics in Quest; **balances/ledger execution** remain in Points.
- **Proof vs source truth**: Quest stores proof payloads and validation outcomes; canonical truth for events/attendance is Pulse, for partner/branch identity is RF, and for geo/place identity is Atlas.
- **Reserved ecosystem term**: `Mission` belongs to the future ecosystem orchestration layer. Older Quest docs that used that word for local work units should be read as `quest_step` / product-facing task; canonical engineering terms in this package are `quest`, `quest_step`, `quest_progress`, `quest_submission`.

---

Quest Service domain model is based on:

> **scenario → steps → progress → submission → validation**

This keeps Quest:

- composable
- scalable
- decoupled from other domains

and ready for:

- Points
- NFT
- vouchers
- AI integration
