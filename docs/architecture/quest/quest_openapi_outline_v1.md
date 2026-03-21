# Quest OpenAPI Outline v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Service:** `quest-service`  
**Document role:** Draft OpenAPI outline and engineering contract scaffold for `docs/openapi/quest.yaml`  
**Status:** Pre-spec outline for Cursor

**Authoritative stack note:** this outline is canonical only together with:
- `docs/openapi/quest.yaml` (authoritative machine-readable contract)
- `quest_domain_model_v1.md` (domain ownership/model)
- `quest_dependency_map_v1.md` and `quest_service_production_architecture_v1.md` (dependency/runtime framing)

---

# 1. Purpose

This document defines the contract outline for Quest Service.

It serves as a scaffold for:

- OpenAPI YAML (`quest.yaml`)
- DTO definitions
- SDK generation
- route contracts
- validation rules

Quest Service exposes **activity scenarios**, not content or economy.

---

# 2. API Design Principles

## 2.1 Namespace

```text
/v1/quests/*
```

---

## 2.2 Ownership

Quest API must expose only:

- quests
- steps
- progress
- submissions
- validation

---

## 2.3 Explicit exclusions

Do NOT include:

- points balance
- NFT ownership
- vouchers
- posts (Space)
- user identity

---

## 2.4 OpenAPI-first

- Schema-first design
- SDK generated from spec
- DTO alignment required

---

# 3. Endpoint Groups

1. Public (Quest discovery)
2. Progress
3. Steps / Submission
4. PRO (creation)
5. Validation / Moderation

---

# 4. Public Endpoints

## 4.1 GET /v1/quests

Get list of quests.

### Query params

- cityId
- theme
- difficulty
- page
- pageSize

Runtime baseline note:

- nearby filtering by `lat/lng` is deferred and is not part of current operational Step 7 API behavior.

Ownership caveat:

- event-related quest validation must respect Pulse attendance truth;
- nearby/event interpretation must respect event spatial scope model (place/container/city/country/distributed/moving) and must not force broad events into fake single-place bindings.

### Response

`QuestListResponse`

---

## 4.2 GET /v1/quests/{questId}

Get quest details.

---

# 5. Progress Endpoints

## 5.1 POST /v1/quests/{questId}/start

Start quest.

---

## 5.2 GET /v1/quests/{questId}/progress

Get user progress.

---

# 6. Step Submission

## 6.1 POST /v1/quests/{questId}/steps/{stepId}/submit

Submit proof.

### Request

```json
{
  "proofType": "photo",
  "proofData": {}
}
```

---

# 7. PRO Endpoints

## 7.1 POST /v1/quests

Create quest.

---

## 7.2 POST /v1/quests/{questId}/steps

Add step.

---

## 7.3 POST /v1/quests/{questId}/publish

Publish quest.

---

# 8. Validation

## 8.1 GET /v1/quests/{questId}/submissions

List submissions.

---

## 8.2 POST /v1/submissions/{submissionId}/review

Approve / reject.

---

# 9. Schemas

---

## 9.1 QuestResponse

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "steps": []
}
```

---

## 9.2 QuestProgressResponse

```json
{
  "status": "in_progress",
  "currentStep": 2
}
```

---

## 9.3 QuestSubmissionResponse

```json
{
  "id": "uuid",
  "status": "pending"
}
```

---

# 10. Enums

## StepType

- visit_place
- attend_event
- visit_partner
- challenge
- photo_proof
- geo_checkin
- qr_code
- space_action

---

## ProgressStatus

- not_started
- in_progress
- pending_review
- completed
- failed
- expired

---

## SubmissionStatus

- pending
- approved
- rejected

---

# 11. Error Model

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Human readable message"
  },
  "requestId": "uuid"
}
```

---

# 12. Auth Rules

## Public read

- GET quests

## Auth required

- start quest
- submit step
- PRO actions
- validation

---

# 13. Rate Limits

- reserved for future hardening

Current runtime note:

- explicit per-route rate limiting is not enabled in current Step 7 baseline.

---

# 14. Event Reference

- quest.started
- quest.step.completed
- quest.submission.created
- quest.submission.approved
- quest.completed

---

# 15. Final Summary

Quest OpenAPI defines:

> **scenario interaction contract**

It must remain:

- minimal
- domain-focused
- decoupled from economy and social layers
