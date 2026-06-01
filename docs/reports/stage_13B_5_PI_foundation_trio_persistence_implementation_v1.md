# Stage 13B.5-PI — Foundation Trio Persistence Implementation

## 1. Scope Verification

Execution mode:

- `FOUNDATION_TRIO_PERSISTENCE_IMPLEMENTATION_SLICE`
- bounded to **PM-MUST-1..17** and **PP minimal persistence** model;
- no OpenAPI / SDK / UI / WS-2 / visibility policy / feed SQL / activity redesign;
- no `foundation_trio_ready` or `ws2_authorized` lift.

| PM scope check | Result |
| --- | --- |
| Only PP §9.1 IN scope | PASS |
| PP §9.2 OUT forbidden | PASS — not touched |
| Three columns + CK-PP-1..5 | PASS |
| Backfill false/null | PASS |
| Read rehydration all surfaces | PASS |
| Staging removed | PASS |
| T-PP-1..6 | PASS |
| Proof JSON columns | PASS — not added |

**Branch (recommended):** `feat/stage-13b5-persistence-minimal`

## 2. Multi-Agent Execution Review

Multi-agent mode: **activated** for implementation. Seven roles; findings **per agent**; disagreements in §2.2.

| # | Agent | Finding ID(s) | Disposition |
| --- | --- | --- | --- |
| 1 | **AI Program Director / Project Orchestrator** | ORCH-1, ORCH-2 | PASS |
| 2 | **Slice Strategist** | STRAT-1 | PASS |
| 3 | **Runtime Governance Architect** | GOV-1, GOV-2 | PASS |
| 4 | **Runtime Validation Agent** | VAL-1, VAL-2 | PASS |
| 5 | **Backend Developer** | BE-1, BE-2, BE-3 | PASS |
| 6 | **QA Agent** | QA-1 | PASS |
| 7 | **Technical Canon Writer** | CANON-1 | PASS |

### 2.1 Per-agent findings (detail)

**1 — AI Program Director / Project Orchestrator (ORCH-1, ORCH-2)**

- ORCH-1: PM **YES_WITH_CONDITIONS** honored — implementation limited to persistence vertical; governance reports PG/PP/PV/PM drive scope.
- ORCH-2: Slice closes **PG-HB2-1,2,5,6** at implementation tier; **PG-HB2-3,4** via read-time derive; **Y-HB3/4/6** remain for later gates.
- ORCH-2: Next mandatory stage: **13B.5-PJR** — not Trio closure, not WS-2.

**2 — Slice Strategist (STRAT-1)**

- STRAT-1: Single migration `0058` + space-service wire — no scope creep detected in diff.
- STRAT-1: `buildSourceReferenceResponseStaging` retained in domain for response shape; **not** used as create-only API bypass — parity via DB rehydration.

**3 — Runtime Governance Architect (GOV-1, GOV-2)**

- GOV-1: CHECK constraints CK-PP-1..5 implemented in migration — DB-layer anti-collapse for P5 vs `repost_target_*`.
- GOV-2: Domain proof literals unchanged (`isFoundationTrioReady: false`, etc.) — PM-FAIL-15 satisfied.

**4 — Runtime Validation Agent (VAL-1, VAL-2)**

- VAL-1: E3: insert persists intent + SR pair from assert path; E4: GET detail + home feed rehydrate; E5: independence derive at read when intent true (T-PP-6).
- VAL-2: Events on create unchanged structurally — still mirror write classifiers; DB is now authoritative for lifecycle reads.

**5 — Backend Developer (BE-1, BE-2, BE-3)**

- BE-1: `SPACE_POST_SELECT_FIELDS` shared fragment — all post SELECT paths include persistence columns.
- BE-2: `rehydrateAuthorialFieldsFromRow` centralizes API projection; `mapPostResponse` staging parameter **removed**.
- BE-3: v1 create-only write path — no authorial PATCH (PV-N2 preserved).

**6 — QA Agent (QA-1)**

- QA-1: **176/176** tests PASS (168 baseline + 8 new: 4 unit + 4 HTTP T-PP).
- QA-1: T-PP-5 verifies INSERT carries `false` / `null` for non-authorial create.

**7 — Technical Canon Writer (CANON-1)**

- CANON-1: Implementation report documents non-claims; PJR must not set `foundation_trio_ready: TRUE`.
- CANON-1: Bounded tokens may narrow NR-N1/TR-N1 at JR — not auto-upgraded in PI.

### 2.2 Disagreements between agents

| Topic | Agent A | Agent B | Resolution |
| --- | --- | --- | --- |
| Expose `authorialExpressionIntent` on GET | Validation: required for T-PP-1 | Governance: PP-D9 omit when false only | **ACCEPTED** — expose `true` when persisted; omit when false |
| T-PP-1 vs T-PP-2 overlap | QA: separate tests | Backend: same row fixture | **ACCEPTED** — split intent-only vs SR cases |

**Blocking disagreement:** None.

## 3. Files Changed

| Path | Change |
| --- | --- |
| `packages/db/migrations/0058_space_post_authorial_persistence_v1.sql` | **NEW** — columns, backfill, CHECK |
| `apps/space-service/src/domain/persistenceRehydration.ts` | **NEW** — `rehydrateAuthorialFieldsFromRow` |
| `apps/space-service/src/db/queries/space.ts` | `SpacePostRow`, `insertSpacePost`, shared SELECT |
| `apps/space-service/src/services/spaceService.ts` | persist on create; rehydrate on read; no staging |
| `apps/space-service/src/domain/legacyTaxonomy.ts` | optional `authorialExpressionIntent` on row input |
| `apps/space-service/src/domain/perSurfaceLegacyMatrix.ts` | `spacePostRowInput` reads DB flag |
| `apps/space-service/src/domain/authorialIndependence.ts` | read independence rehydration when intent true |
| `apps/space-service/test/persistenceRehydration.test.ts` | **NEW** — T-PP-4, T-PP-6, unit rehydrate |
| `apps/space-service/test/request.test.ts` | persistence fixtures; T-PP-1..3, T-PP-5 |

## 4. Migration

**File:** `packages/db/migrations/0058_space_post_authorial_persistence_v1.sql`

| Column | Type | Default |
| --- | --- | --- |
| `authorial_expression_intent` | `boolean NOT NULL` | `false` |
| `source_material_type` | `text` | `NULL` |
| `source_material_id` | `text` | `NULL` |

| Constraint | ID |
| --- | --- |
| Authorial post requires non-empty trimmed text | `ck_space_post_pp1_authorial_text_required` |
| Repost cannot carry authorial intent | `ck_space_post_pp2_repost_no_authorial_intent` |
| Intent false ⇒ no SR | `ck_space_post_pp3_intent_false_implies_no_sr` |
| SR pair complete | `ck_space_post_pp4_sr_pair_complete` |
| Authorial intent ⇒ no repost_target | `ck_space_post_pp5_authorial_no_repost_target` |

## 5. Backfill

```sql
UPDATE space_post SET
  authorial_expression_intent = false,
  source_material_type = NULL,
  source_material_id = NULL;
```

- No inference from `text`, `visibility`, or `repost_target_*`.
- No event replay upgrade (BF-5).

## 6. Persistence Wiring

**Write (`createPost`):**

- After existing FT-3A/3C/3D/3B asserts, `insertSpacePost` receives:
  - `authorialExpressionIntent: postType === 'post' && body intent true`
  - `sourceMaterialType` / `sourceMaterialId` from parsed SR or null

**Read:**

- All `getPostById` / feed list queries return three columns via `SPACE_POST_SELECT_FIELDS`.

## 7. Read Rehydration

**Function:** `rehydrateAuthorialFieldsFromRow(post: SpacePostRow)`

| Output | Rule |
| --- | --- |
| `authorialExpressionIntent` | Present as `true` only when column true (PP-D9) |
| `sourceReference` | When both material columns set — uses `buildSourceReferenceResponseStaging` shape |

**`mapPostResponse`:** always rehydrates from DB; **no** staging parameter (PP-D8 / PV-N4).

## 8. Surface Coverage

All `mapPostResponse` call sites use unified pipeline (via `spacePostRowInput` + rehydrate):

| Surface | `LegacySurfaceId` |
| --- | --- |
| Feed home | `home_feed` |
| Feed followers | `followers_feed` |
| Feed activity | `activity_feed` |
| Group | `group_feed` |
| Profile | `profile_feed` |
| Publications | `publications` |
| Highlight | `highlight` |
| Detail | `post_detail` |

## 9. E3 Evidence (write persistence)

| Evidence | Result |
| --- | --- |
| Authorial create persists `authorial_expression_intent = true` | INSERT path + asserts |
| SR create persists type/id pair | INSERT when body SR present |
| Non-authorial create persists false/null | **T-PP-5** |

## 10. E4 Evidence (read rehydration)

| Evidence | Result |
| --- | --- |
| GET detail rehydrates intent | **T-PP-1** |
| GET detail rehydrates SR | **T-PP-2** |
| Home feed rehydrates SR | **T-PP-3** |

## 11. E5 Evidence (classification from persisted facts)

| Evidence | Result |
| --- | --- |
| `classifyAuthorialIndependence` with DB intent at read | **T-PP-6** |
| Read guards use `spacePostRowInput` with persisted flag | PV-N1 implemented |

## 12. E6 Evidence (collapse protection)

| Edge | Protection |
| --- | --- |
| P5 vs `repost_target_*` | Write asserts + CK-PP-5 |
| SR on repost | Write rejects + CK-PP-3 |
| Legacy row as authorial | Backfill false + existing FT-5 guards |
| Proof JSON in DB | Not added (PM-FAIL-2) |

## 13. E7 Tests (T-PP-1..6)

| ID | Test | Location | Result |
| --- | --- | --- | --- |
| T-PP-1 | GET detail — intent from DB | `request.test.ts` | PASS |
| T-PP-2 | GET detail — SR from DB | `request.test.ts` | PASS |
| T-PP-3 | Home feed — SR from DB | `request.test.ts` | PASS |
| T-PP-4 | Legacy row non-authorial | `persistenceRehydration.test.ts` | PASS |
| T-PP-5 | Non-authorial INSERT false/null | `request.test.ts` | PASS |
| T-PP-6 | Independence derive at read | `persistenceRehydration.test.ts` | PASS |

## 14. Regression Results

| Suite | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service test` | **176/176 PASS** |
| FT-3A / 3C / 3D / 3B / FT-5 stacks | Included in regression pack |

## 15. PM MUST Verification (PM-MUST-1..17)

| ID | Met? |
| --- | --- |
| PM-MUST-1 | YES |
| PM-MUST-2 | YES |
| PM-MUST-3 | YES |
| PM-MUST-4 | YES |
| PM-MUST-5 | YES |
| PM-MUST-6 | YES |
| PM-MUST-7 | YES |
| PM-MUST-8 | YES |
| PM-MUST-9 | YES |
| PM-MUST-10 | YES |
| PM-MUST-11 | YES |
| PM-MUST-12 | YES |
| PM-MUST-13 | YES |
| PM-MUST-14 | YES |
| PM-MUST-15 | YES |
| PM-MUST-16 | YES (this report) |
| PM-MUST-17 | YES — tokens below |

## 16. PM FAIL Verification (PM-FAIL-1..15)

| ID | Triggered? |
| --- | --- |
| PM-FAIL-1..15 | **NO** |

## 17. Validation Results

| Check | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service exec tsc --noEmit` | PASS |
| `pnpm --filter @go2asia/space-service test` | **176/176 PASS** |
| `git diff --check` | PASS |

## 18. Final Tokens

```yaml
stage_13B_5_PI_status: PASS
stage_13B_5_PI_persistence_impl_complete: TRUE
stage_13B_5_PI_foundation_trio_ready: FALSE
stage_13B_5_PI_ws2_authorized: FALSE
stage_13B_5_PI_next_safe_step: STAGE_13B_5_PJR_FOUNDATION_TRIO_PERSISTENCE_IMPLEMENTATION_REVIEW_AND_ACCEPTANCE
```

**Explicit non-claims (PM-MUST-17):**

```yaml
foundation_trio_ready: FALSE
ws2_authorized: FALSE
FOUNDATION_TRIO_CLOSED: FALSE
```

## Execution Summary

| Deliverable | Value |
| --- | --- |
| Migration | `packages/db/migrations/0058_space_post_authorial_persistence_v1.sql` |
| Core module | `apps/space-service/src/domain/persistenceRehydration.ts` |
| Tests | `persistenceRehydration.test.ts` + T-PP in `request.test.ts` |
| Result | **PASS** — 176/176 tests |
| Next step | **13B.5-PJR** — Implementation Review & Acceptance |

### Invariants (preserved)

```
Persistence Implementation ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
