# Stage 13B.5-PM — Foundation Trio Persistence Migration Implementation Authorization Gate

## 1. Inputs Reviewed

Execution mode:

- `GOVERNANCE_SLICE_MIGRATION_IMPLEMENTATION_AUTHORIZATION_GATE_ONLY`
- no coding;
- no implementation;
- no migration **execution**;
- no schema / DB / OpenAPI / SDK / UI / backend / runtime changes in this stage;
- no Foundation Trio closure;
- no `foundation_trio_ready` lift;
- no WS-2 authorization.

AI-agent docs reviewed:

| Document | Role |
| --- | --- |
| `docs/ai/agents_index.md` | Agent registry |
| `docs/ai/roles_overview.md` | Role boundaries |
| `docs/ai/roles/orchestrator.md` | Program Director / Orchestrator |
| `docs/ai/roles/slice_strategist.md` | Bounded slice discipline |
| `docs/ai/roles/runtime_governance_architect.md` | Runtime invariants |
| `docs/ai/roles/runtime_validation_agent.md` | E3–E9 |
| `docs/ai/roles/backend_dev.md` | Service/domain review |
| `docs/ai/roles/qa.md` | Test requirements |
| `docs/ai/roles/tech_writer.md` | Canon alignment |

Governance documents:

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_PV_foundation_trio_persistence_review_v1.md` | **Primary input** — plan accepted; PM-C1..8 |
| `docs/reports/stage_13B_5_PP_foundation_trio_persistence_planning_v1.md` | Architecture; columns; CK; T-PP |
| `docs/reports/stage_13B_5_PG_foundation_trio_persistence_authorization_gate_v1.md` | PG-HB2; scope |
| `docs/reports/stage_13B_5_ZR_ft_x3_foundation_trio_closure_review_v1.md` | Y-HB2; deferral |
| `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` | Collapse edges |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | E3/E4/E5/E7 |

Code inspected (read-only — `main` @ `64ef573`, 2026-06-01):

| Path | Role |
| --- | --- |
| `packages/db/migrations/0015_space_core_v1.sql` | Baseline `space_post` |
| `apps/space-service/src/db/queries/space.ts` | `insertSpacePost`; `SpacePostRow` |
| `apps/space-service/src/services/spaceService.ts` | `createPost`; `mapPostResponse`; staging |
| `apps/space-service/src/domain/authorialExpression.ts` | P4 write/read |
| `apps/space-service/src/domain/authorialIndependence.ts` | Independence |
| `apps/space-service/src/domain/savePublishBoundary.ts` | Dual intent |
| `apps/space-service/src/domain/sourceReferenceBoundary.ts` | P5; `SOURCE_MATERIAL_TYPES` |
| `apps/space-service/src/domain/perSurfaceLegacyMatrix.ts` | `spacePostRowInput` (no intent today) |
| `apps/space-service/src/domain/legacyTaxonomy.ts` | `LegacySpacePostRowInput` |

Latest migration index on `main`: `0057_*` — persistence migration must be **new numbered file** (impl stage), not in PM.

## 2. Multi-Agent Execution Review

Multi-agent mode: **activated**. Seven mandated roles; findings **per agent**; disagreements in §2.2.

| # | Agent | Finding ID(s) | Disposition |
| --- | --- | --- | --- |
| 1 | **AI Program Director / Project Orchestrator** | ORCH-1, ORCH-2 | PASS |
| 2 | **Slice Strategist** | STRAT-1, STRAT-2 | PASS |
| 3 | **Runtime Governance Architect** | GOV-1, GOV-2 | PASS |
| 4 | **Runtime Validation Agent** | VAL-1, VAL-2 | PASS |
| 5 | **Backend Developer (review)** | BE-1, BE-2, BE-3 | PASS |
| 6 | **QA Agent** | QA-1 | PASS |
| 7 | **Technical Canon Writer** | CANON-1 | PASS |

### 2.1 Per-agent findings (detail)

**1 — AI Program Director / Project Orchestrator (ORCH-1, ORCH-2)**

- ORCH-1: User accepted **PV** (`PERSISTENCE_PLAN_ACCEPTED_WITH_NOTES`, `pm_ready: TRUE`) — PM is the mandated gate before any DDL or service code.
- ORCH-1: Program track **PG → PP → PV → PM → PI (impl) → PJR (review)** — PM authorizes **bounded implementation**, not migration execution in this document.
- ORCH-2: PM addresses **Y-HB2** subset only — ZR blockers Y-HB3 (E9), Y-HB4 (BV), Y-HB6 (visibility) remain after successful persistence JR.

**2 — Slice Strategist (STRAT-1, STRAT-2)**

- STRAT-1: Authorized slice = **minimal persistence vertical** per PP §9.1 — one migration + query/service/domain wire + E7 tests.
- STRAT-1 OUT: WS-2, OpenAPI, activity projection, feed SQL, visibility policy, Trio closure (PP §9.2).
- STRAT-2: Implementation branch naming: propose **`feat/stage-13b5-persistence-minimal`** — single PR family; no bundled E9.

**3 — Runtime Governance Architect (GOV-1, GOV-2)**

- GOV-1: Authorized DDL limited to **three columns + five CHECKs** on `space_post` — no proof JSON, no `repost_target_*` rename.
- GOV-2: Post-impl proof types (`isFoundationTrioReady: false`, etc.) **must remain false** in domain code — JR verifies no accidental lift.
- GOV-2: Events on create must **mirror** persisted facts — already emit intent/SR today; impl adds DB as authority (PP-R2).

**4 — Runtime Validation Agent (VAL-1, VAL-2)**

- VAL-1: T-PP-1..6 are **blocking** for PJR PASS — PM MUST embed; no waiver.
- VAL-1: E4 proof requires GET after POST on **post_detail** and **home_feed** minimum — aligns with PP §10.
- VAL-2: E8 regression: full FT-5D + authorial suites must pass after backfill false/null — 168+ new tests.

**5 — Backend Developer — review mode (BE-1, BE-2, BE-3)**

- BE-1: `SpacePostRow` type and all SELECTs listing posts must include three new fields — planning-complete; impl touches `space.ts` + row mappers.
- BE-2: `createPost` persists after existing assert chain — order unchanged: asserts → `insertSpacePost` with flags.
- BE-3: v1 **no authorial update endpoint** (PV-N2) — persistence write scope = **create path only**; `updateRepostTextByAuthor` unchanged.

**6 — QA Agent (QA-1)**

- QA-1: PM MUST require **T-PP-1..6** plus regression **168/168** baseline green post-impl.
- QA-1: Recommend dedicated `persistenceRehydration.test.ts` per PP — authorized in slice.

**7 — Technical Canon Writer (CANON-1)**

- CANON-1: PM satisfies PV **PM-C1..C8** at authorization tier.
- CANON-1: JR tokens must state: `PERSISTENCE_BOUNDED_COMPLETE` (proposed) ≠ `foundation_trio_ready` ≠ `FOUNDATION_TRIO_CLOSED`.

### 2.2 Disagreements between agents

| Topic | Agent A | Agent B | Resolution |
| --- | --- | --- | --- |
| Authorization strictness | Orchestrator: **YES_WITH_CONDITIONS** | QA: **YES** if T-PP binding | **YES_WITH_CONDITIONS** — PM-COND-1..8 |
| Optional DB enum for material type | Backend: app enum sufficient | Governance: optional CHECK | **App assert required**; DB enum CHECK **optional** (PM-COND-3) |
| Staging removal timing | Strategist: remove in same PR | Validation: JR proves parity first | **Same PR** with T-PP-1/2 proving GET parity (PV-N4) |

**Blocking disagreement:** None.

## 3. PP/PV Readiness Review

| Input | Expected | Verified |
| --- | --- | --- |
| PP accepted (user + PV) | YES | PASS |
| PV verdict | `PERSISTENCE_PLAN_ACCEPTED_WITH_NOTES` | PASS |
| `pm_ready` | TRUE | PASS |
| Model | `MINIMAL_PERSISTENCE` | PASS — unchanged |
| PV notes | PV-N1..N5 | PASS — folded into PM MUST/COND |

**PP/PV readiness: PASS** — no replan required.

## 4. Candidate Columns Review

| Column | PP/PV | Code baseline | PM |
| --- | --- | --- | --- |
| `authorial_expression_intent` | Required | Absent | **AUTHORIZED** |
| `source_material_type` | Required | Absent | **AUTHORIZED** |
| `source_material_id` | Required | Absent | **AUTHORIZED** |

**Column blocker:** None.

**Extra columns:** None authorized.

**Missing columns:** None for minimal model.

## 5. Constraint Review (CK-PP-1..5)

| ID | Rule (from PP) | Needed? | Sufficient? | PM |
| --- | --- | --- | --- | --- |
| **CK-PP-1** | Authorial post ⇒ non-empty trimmed `text` | YES | YES (with app validation) | **REQUIRED** |
| **CK-PP-2** | `repost` ⇒ intent false | YES | YES | **REQUIRED** |
| **CK-PP-3** | intent false ⇒ SR null | YES | YES | **REQUIRED** |
| **CK-PP-4** | SR pair both set or both null | YES | YES | **REQUIRED** |
| **CK-PP-5** | authorial intent ⇒ no `repost_target_*` | YES | YES — anti P5 collapse | **REQUIRED** |

**Constraint review: PASS** — all five required; no additional CHECKs mandated beyond optional material-type enum (PM-COND-3).

**PV-N3:** CK-PP-1 trim semantics must match `parseCreatePostText` / FT-3A non-empty text rule.

## 6. Read Rehydration Review

| Criterion | PP/PV | PM authorization |
| --- | --- | --- |
| Single pipeline | `rehydrateAuthorialFieldsFromRow` (impl) | **REQUIRED** |
| All `mapPostResponse` surfaces | `LEGACY_SURFACE_IDS` | **REQUIRED** |
| Extend `LegacySpacePostRowInput` + `spacePostRowInput` | PV-N1 | **REQUIRED** |
| Remove create staging param | PP-D8 / PV-N4 | **REQUIRED** after parity |
| `authorialExpressionIntent` omit when false | PP-D9 | **REQUIRED** on API JSON |
| `sourceReference` from DB when pair set | PP §6.3 | **REQUIRED** |

**Read rehydration: PASS** at gate tier.

## 7. Backfill Review

| Rule | PP | PM |
| --- | --- | --- |
| BF-1 default false/null | YES | **REQUIRED** in migration |
| BF-2 no automatic upgrade | YES | **REQUIRED** — no heuristic UPDATE |
| BF-3 no SR from `repost_target_*` | YES | **REQUIRED** |
| BF-4 private repost unchanged | YES | **REQUIRED** |
| BF-5 no event replay upgrade | YES | **REQUIRED** |
| BF-6 new writes from assert path | YES | **REQUIRED** |

**Backfill: PASS**

## 8. Migration Risks Review

| Risk | PP/PV ID | Mitigation in authorized slice | PM status |
| --- | --- | --- | --- |
| Proof authority | PP-R1 | No JSON columns; PM-FAIL-4 | **MITIGATED** (gate) |
| Write/read drift | PP-R2 | Single mapper; staging removal; T-PP-1/2 | **MITIGATED** (gate) |
| Legacy reinterpretation | PP-R3 | Backfill false; BF-1 | **MITIGATED** (gate) |
| P5 collapse | PP-R4 | Separate columns; CK-PP-5; PM-FAIL-5 | **MITIGATED** (gate) |
| WS-2 scope creep | PP-R5 | PM-FAIL-6; OUT scope | **MITIGATED** (gate) |

### 8.1 Migration blockers

**Blockers to opening PM gate (this stage):** **NONE**

**Blockers to starting implementation without PM PASS:** **PM gate itself** — resolved by this report upon acceptance.

**Blockers that remain after authorized implementation (expected):**

| ID | Blocker | Until |
| --- | --- | --- |
| MB-1 | Y-HB3 E9 OpenAPI | E9 gate |
| MB-2 | Y-HB4 BV | BV gate |
| MB-3 | Y-HB6 visibility policy | Policy gate |
| MB-4 | `foundation_trio_ready` | C2 §6.3 + closure acceptance |

## 9. Evidence Plan Review (E3/E4/E5/E7)

| E-class | PP requirement | Sufficient? | PM binding |
| --- | --- | --- | --- |
| **E3** | Insert matches body flags/SR | YES | PM-MUST-5; T-PP-5 |
| **E4** | GET detail + feed rehydrate | YES | T-PP-1,2,3 |
| **E5** | Classify from row flag | YES | T-PP-6; domain wire |
| **E6** | Collapse negatives | YES | PM-MUST-12; existing + new negatives |
| **E7** | T-PP-1..6 + 168 regression | YES | PM-MUST-11 |
| **E8** | FT-5D legacy matrix | YES | PM-MUST-13 |
| **E9** | Not in slice | N/A (deferred) | PM-FAIL-7 |

**Evidence plan: PASS** — sufficient for bounded persistence JR; not sufficient for Trio ready.

## 10. Authorization Decision

**`YES_WITH_CONDITIONS`**

| Question | Answer |
| --- | --- |
| May program open **bounded persistence implementation**? | **YES_WITH_CONDITIONS** |
| May program execute migration DDL in this stage? | **NO** |
| May program set `foundation_trio_ready: TRUE`? | **NO** |
| May program authorize WS-2? | **NO** |

### 10.1 PM conditions (PM-COND-1..8)

| ID | Condition |
| --- | --- |
| PM-COND-1 | Implementation scope = PP §9.1 only |
| PM-COND-2 | Migration includes CK-PP-1..5 |
| PM-COND-3 | `source_material_type` validated against `SOURCE_MATERIAL_TYPES` at write (app); DB enum CHECK optional |
| PM-COND-4 | PV-N1 row input extension mandatory |
| PM-COND-5 | PV-N2 create-only persistence — no new update routes for intent/SR |
| PM-COND-6 | PJR required before token lift; T-PP-1..6 blocking |
| PM-COND-7 | `foundation_trio_ready` and `ws2_authorized` remain FALSE in impl/JR reports |
| PM-COND-8 | Single PR/slice — no E9/OpenAPI in same implementation |

## 11. PM MUST List

Implementation slice **must** deliver all items below. Omission = PJR FAIL.

| ID | Requirement |
| --- | --- |
| **PM-MUST-1** | Add migration: `authorial_expression_intent BOOLEAN NOT NULL DEFAULT false`, `source_material_type TEXT NULL`, `source_material_id TEXT NULL` on `space_post` |
| **PM-MUST-2** | Migration includes CHECK constraints **CK-PP-1** through **CK-PP-5** (exact semantics per PP §5) |
| **PM-MUST-3** | One-time backfill: all existing rows → intent `false`, SR columns `NULL` (BF-1..BF-5) |
| **PM-MUST-4** | Update `insertSpacePost` + `SpacePostRow` + all post SELECT queries to read/write three fields |
| **PM-MUST-5** | `createPost`: after asserts, persist `authorial_expression_intent` from body; persist SR pair when parsed SR present; else NULL |
| **PM-MUST-6** | Implement `rehydrateAuthorialFieldsFromRow` (or equivalent) used by **every** `mapPostResponse` call |
| **PM-MUST-7** | Extend `LegacySpacePostRowInput` and `spacePostRowInput()` with `authorialExpressionIntent: boolean` from DB (PV-N1) |
| **PM-MUST-8** | Thread persisted intent into read guards / classifiers — not carrier-shape inference alone |
| **PM-MUST-9** | Remove `sourceReferenceResponseStaging` parameter from `mapPostResponse` when T-PP-1/2 pass (PP-D8) |
| **PM-MUST-10** | API JSON: include `sourceReference` when DB pair set; omit `authorialExpressionIntent` when false (PP-D9) |
| **PM-MUST-11** | Pass E7 tests **T-PP-1** through **T-PP-6** (PP §10.1) |
| **PM-MUST-12** | Pass E6 collapse tests: repost+intent rejected; SR on repost rejected; repostTarget on authorial post rejected; backfilled legacy unchanged |
| **PM-MUST-13** | Regression: existing space-service tests (≥168) remain PASS; FT-5D + FT-3x suites PASS |
| **PM-MUST-14** | Domain proof literals remain `isFoundationTrioReady: false`, `isWs2Authorized: false` where applicable |
| **PM-MUST-15** | Create events continue to emit classifiers; values must match DB row on create |
| **PM-MUST-16** | Produce implementation report **`stage_13B_5_PI_*`** and seek **`stage_13B_5_PJR_*`** review |
| **PM-MUST-17** | Explicit JR non-claims: `foundation_trio_ready: FALSE`, `ws2_authorized: FALSE`, `FOUNDATION_TRIO_CLOSED: FALSE` |

### 11.1 Authorized file touch set (indicative)

| Area | Files (expected) |
| --- | --- |
| Migration | `packages/db/migrations/0058_space_post_authorial_persistence_v1.sql` (name indicative) |
| DB queries | `apps/space-service/src/db/queries/space.ts` |
| Service | `apps/space-service/src/services/spaceService.ts` |
| Domain | `legacyTaxonomy.ts`, `perSurfaceLegacyMatrix.ts`, optional thin `persistenceRehydration.ts` |
| Tests | `test/persistenceRehydration.test.ts`, `test/request.test.ts` extensions |

## 12. PM FAIL Catalog

Any single item below → implementation **INVALID**; PJR must **REJECT**.

| ID | FAIL condition |
| --- | --- |
| **PM-FAIL-1** | Migration or code changes outside PM-MUST scope (WS-2, OpenAPI, UI, activity, feed SQL) |
| **PM-FAIL-2** | Proof JSON or classifier blob columns added to `space_post` |
| **PM-FAIL-3** | `repost_target_*` renamed, aliased, or populated from SR fields |
| **PM-FAIL-4** | Read path uses create-only staging as sole SR source after migration (PP-R2 / PV-N4) |
| **PM-FAIL-5** | SR stored in `repost_target_*` or authorial post carries both SR and `repost_target_*` |
| **PM-FAIL-6** | Public/group repost elimination, new propagation routes, or WS-2 tokens set |
| **PM-FAIL-7** | OpenAPI/SDK changed in same slice without E9 gate |
| **PM-FAIL-8** | Backfill infers authorial intent from text, visibility, events, or `repost_target_*` |
| **PM-FAIL-9** | Report or JR sets `foundation_trio_ready: TRUE` or claims Foundation Trio closed |
| **PM-FAIL-10** | Report or JR sets `ws2_authorized: TRUE` |
| **PM-FAIL-11** | T-PP-1..6 any failing |
| **PM-FAIL-12** | Missing any CK-PP-1..5 in migration |
| **PM-FAIL-13** | `authorial_expression_intent` true on `post_type=repost` in DB |
| **PM-FAIL-14** | GET feed/detail omits rehydration while 201 still uses staging-only SR |
| **PM-FAIL-15** | Domain code sets `isFoundationTrioReady: true` or removes false guards |

## 13. Next Safe Step

1. **`Stage 13B.5-PI — Foundation Trio Persistence Implementation`** — execute PM-MUST-1..17 on a bounded branch.
2. **`Stage 13B.5-PJR — Foundation Trio Persistence Implementation Review & Acceptance`** — JR with E3/E4/E5/E6/E7 proof; no token lift beyond persistence-bounded notes.
3. After PJR: re-score **Y-HB2** in governance; proceed **E9 gate** (ZR order) — not WS-2.
4. Do **not** execute DDL before PI slice starts with this PM acceptance.

## 14. Final Tokens

```yaml
stage_13B_5_PM_status: PASS
stage_13B_5_PM_authorization_decision: YES_WITH_CONDITIONS
stage_13B_5_PM_implementation_authorized: TRUE
stage_13B_5_PM_authorization_conditions: PM-COND-1,PM-COND-2,PM-COND-3,PM-COND-4,PM-COND-5,PM-COND-6,PM-COND-7,PM-COND-8
stage_13B_5_PM_foundation_trio_ready: FALSE
stage_13B_5_PM_ws2_authorized: FALSE
stage_13B_5_PM_persistence_model: MINIMAL_PERSISTENCE
stage_13B_5_PM_next_safe_step: STAGE_13B_5_PI_FOUNDATION_TRIO_PERSISTENCE_IMPLEMENTATION
```

Program tokens (unchanged):

```yaml
persistence_planning_authorized: TRUE
persistence_review_authorized: TRUE
persistence_verdict: PERSISTENCE_PLAN_ACCEPTED_WITH_NOTES
foundation_trio_ready: FALSE
ws2_authorized: FALSE
closure_outcome: CLOSURE_DEFERRED
```

## Execution Summary

| Deliverable | Value |
| --- | --- |
| Report | `docs/reports/stage_13B_5_PM_foundation_trio_persistence_migration_implementation_authorization_gate_v1.md` |
| Agents used | 7/7 |
| Authorization decision | **YES_WITH_CONDITIONS** |
| `implementation_authorized` | **TRUE** |
| MUST list | PM-MUST-1..17 (§11) |
| FAIL catalog | PM-FAIL-1..15 (§12) |
| Migration blockers (pre-impl) | **NONE** |
| Next step | **13B.5-PI** — Persistence Implementation |

### Invariants (preserved)

```
Migration Authorization ≠ Migration Implementation
Migration Implementation ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
