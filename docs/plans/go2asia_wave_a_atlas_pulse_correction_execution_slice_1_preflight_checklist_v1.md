# Go2Asia Slice 1 Preflight Checklist v1

Status: operator pre-run checklist (non-execution)  
Date: 2026-03-24  
Scope: bounded correction slice 1 only

## 1. Purpose

Короткий checklist перед возможным write-run по slice 1.  
Этот документ не является run execution и не запускает correction.

## 2. Environment Confirmation

- [x] Target environment confirmed (staging, not production)
- [x] Correct database and branch context confirmed
- [x] Correct schema confirmed
- [x] Write permission intentionally approved for this run only
- [x] No accidental production target risk

## 3. Scope Freeze Confirmation

- [x] Slice 1 scope freeze confirmed
- [x] P0/P1 record list approved
- [x] Out-of-scope buckets explicitly excluded
- [x] No silent scope expansion allowed during run
- [x] `events.id` identity-first guardrail confirmed

## 4. Manual-Review Confirmation

- [x] Ambiguous cases resolved or excluded
- [x] Manual-review queue frozen
- [x] No unresolved ambiguous records inside write set
- [x] Slug/FK conflict unresolved cases excluded from auto-run
- [x] Time-conflict unresolved cases excluded from auto-run

## 5. Before-State Safeguards

- [x] Backups/exports/snapshots prepared for target subsets
- [x] Before counts captured (`countries/cities/places/events/blog_posts`)
- [x] Before metrics captured:
  - [x] `events` target subset size
  - [x] city-null target count
  - [x] slug/FK conflict target count
  - [x] time-conflict target count
  - [x] target `places` lat/lng gap subset count (if in scope)
- [x] Key reference integrity baseline captured
- [x] Target record list archived

## 6. Operator Safety Confirmations

- [x] Slice 1 runbook reviewed (`..._runbook_v1.md`)
- [x] Abort criteria understood
- [x] Run is correction-only (no refresh/render tasks mixed)
- [x] No non-target module work mixed in same run
- [x] No auto-create/no opportunistic cleanup rules acknowledged

## 7. GO / NO-GO

- Decision: [ ] GO  [x] NO-GO
- Blockers (if any):
  - Отсутствует явный approved ID-level write set (`accepted`) в артефактах slice 1.
  - Safe non-ambiguous кандидаты для `events.city_id` updates по deterministic alias/city slug mapping = 0.
- Approver (name/role): Human approval received (per operator instruction), final write set not attached
- Operator (name/role): Cursor execution operator
- Date/time: 2026-03-24T07:03:11Z
- Notes:
  - Run aborted pre-write per runbook stop discipline.
  - No write queries executed.

