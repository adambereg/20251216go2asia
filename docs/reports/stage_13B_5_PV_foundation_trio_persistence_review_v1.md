# Stage 13B.5-PV — Foundation Trio Persistence Review

## 1. Inputs Reviewed

Execution mode:

- `FOUNDATION_TRIO_PERSISTENCE_REVIEW_ONLY`
- no coding;
- no implementation;
- no migrations;
- no schema / DB / OpenAPI / SDK / UI / backend / runtime changes;
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
| `docs/ai/roles/qa.md` | Test plan review |
| `docs/ai/roles/tech_writer.md` | Canon alignment |

Governance documents:

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_PP_foundation_trio_persistence_planning_v1.md` | **Primary artifact under review** |
| `docs/reports/stage_13B_5_PG_foundation_trio_persistence_authorization_gate_v1.md` | PG-HB2; PG-C* |
| `docs/reports/stage_13B_5_ZR_ft_x3_foundation_trio_closure_review_v1.md` | Y-HB2; deferral |
| `docs/reports/stage_13B_5_NR_ft_3A_implementation_review_and_acceptance_v1.md` | NR-N1 |
| `docs/reports/stage_13B_5_PR_ft_3C_implementation_review_and_acceptance_v1.md` | PR-N1 |
| `docs/reports/stage_13B_5_RR_ft_3D_implementation_review_and_acceptance_v1.md` | RR-N1 |
| `docs/reports/stage_13B_5_TR_ft_3B_implementation_review_and_acceptance_v1.md` | TR-N1 |
| `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` | Collapse matrix |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | E3/E4/E5/E7 |

Code inspected (read-only — `main` @ `64ef573`, 2026-06-01):

| Path | Role |
| --- | --- |
| `apps/space-service/src/domain/authorialExpression.ts` | P4; `applyAuthorialExpressionReadGuards` |
| `apps/space-service/src/domain/authorialIndependence.ts` | `classifyAuthorialIndependence` inputs |
| `apps/space-service/src/domain/savePublishBoundary.ts` | `classifySavePublishBoundary` inputs |
| `apps/space-service/src/domain/sourceReferenceBoundary.ts` | P5; staging builder |
| `apps/space-service/src/domain/perSurfaceLegacyMatrix.ts` | `spacePostRowInput` — no intent field today |
| `apps/space-service/src/domain/legacyTaxonomy.ts` | `LegacySpacePostRowInput` shape |
| `apps/space-service/src/services/spaceService.ts` | `createPost`; `mapPostResponse`; feeds |
| `apps/space-service/src/db/queries/space.ts` | `insertSpacePost`; updates (repost text only) |
| `packages/db/migrations/0015_space_core_v1.sql` | Baseline `space_post` DDL |

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
| 7 | **Technical Canon Writer** | CANON-1, CANON-2 | PASS |

### 2.1 Per-agent findings (detail)

**1 — AI Program Director / Project Orchestrator (ORCH-1, ORCH-2)**

- ORCH-1: **13B.5-PP** is the program artifact for PV — user acceptance implied by this PV mandate; PP quality sufficient to advance **PM gate** without re-planning.
- ORCH-1: Sequence **PG → PP → PV → PM → impl + JR** preserves invariants; PV does not authorize DDL.
- ORCH-2: PM opening addresses **Y-HB2** only — does not close Y-HB3/4/6 or Trio governance deferral (ZR).

**2 — Slice Strategist (STRAT-1, STRAT-2)**

- STRAT-1: PP scope matches PG/PP §9 — single migration family; no WS-2/E9/BV bundling.
- STRAT-2: **Minimal persistence** affirmed — no Medium/Maximal escalation required for PG-HB2 closure at planning tier.
- STRAT-2: PM must cap slice to PP §9 IN — reject scope creep in PM gate if proposed.

**3 — Runtime Governance Architect (GOV-1, GOV-2)**

- GOV-1: PP-D1/D5/D7 align with FT-X2 — DB facts primary; proof derived; backfill non-authorial.
- GOV-2: CHECK constraints CK-PP-1..5 are **necessary** for PP-R3/R4 at DB layer — PM must include all five.
- GOV-2: `LegacySpacePostRowInput` today **lacks** `authorialExpressionIntent` — impl must extend type (PV-N1); not a plan rejection.

**4 — Runtime Validation Agent (VAL-1, VAL-2)**

- VAL-1: PP E7 plan (T-PP-1..6) is **minimum sufficient** for E3/E4 read proof at persistence slice — PM/JR must not waive.
- VAL-1: Read guards today use **carrier shape** (`postType=post` without `repostTarget*`) — after persistence, guards must consume **DB flag** to avoid false authorial inference on generic posts (BF-1).
- VAL-2: E9 deferred (PP-D10) correct — runtime JSON may lead contract; OpenAPI not PM blocker.

**5 — Backend Developer — review mode (BE-1, BE-2, BE-3)**

- BE-1: Domain functions already accept `authorialExpressionIntent: boolean` — persistence wires **row → classifier inputs**; no new primitive semantics.
- BE-2: `insertSpacePost` and `SpacePostRow` type extensions are the critical impl touchpoints — PP correctly identifies them.
- BE-3: v1 **no authorial post update route** — only `updateRepostTextByAuthor` on reposts (PV-N2); create-only persistence for intent/SR is **consistent** with current API surface.

**6 — QA Agent (QA-1)**

- QA-1: T-PP-1..6 from PP §10.1 are **blocking** for implementation JR — recommend PM gate embed them as PM-MUST tests.
- QA-1: 168-test regression baseline must pass post-impl — not a PV blocker.

**7 — Technical Canon Writer (CANON-1, CANON-2)**

- CANON-1: PP aligns with NR/PR/RR/TR carry-forwards (N1 notes) — persistence is the **planned resolution**, not scope drift.
- CANON-2: Post-impl tokens must not auto-upgrade to `foundation_trio_ready` — PM/JR explicit per PP-R7.

### 2.2 Disagreements between agents

| Topic | Agent A | Agent B | Resolution |
| --- | --- | --- | --- |
| Verdict strictness | Orchestrator: **ACCEPTED_WITH_NOTES** | Validation: could be **ACCEPTED** outright | **ACCEPTED_WITH_NOTES** — PV-N1..N5 are carry-forward, not plan defects |
| Read guard + intent | Governance: extend row input type | Backend: optional field on row only | **ACCEPTED** — PP-D6 + PV-N1 clarify impl |
| CK-PP-1 in SQL | Backend: app already validates text | Governance: keep DB CHECK | **ACCEPTED_WITH_NOTE** — both app + CHECK (PV-N3) |

**Blocking disagreement:** None.

## 3. PP Decisions Review (PP-D1..PP-D10)

| ID | Decision | Verdict | Notes |
| --- | --- | --- | --- |
| **PP-D1** | Source of truth = `space_post` columns | **ACCEPT** | Aligns with PG GOV-1; events secondary |
| **PP-D2** | Persist `authorial_expression_intent` | **ACCEPT** | Closes PG-HB2-1; domain already keyed on boolean |
| **PP-D3** | Persist SR type + id pair | **ACCEPT** | Closes PG-HB2-5/6; separate from `repost_target_*` |
| **PP-D4** | Derive independence + save/publish | **ACCEPT** | `classifyAuthorialIndependence` / `classifySavePublishBoundary` support derive |
| **PP-D5** | Never persist proof JSON | **ACCEPT** | PP-R1 mitigated at design tier |
| **PP-D6** | Unified read rehydration all surfaces | **ACCEPT WITH NOTE** | PV-N1: extend `LegacySpacePostRowInput` + `spacePostRowInput` |
| **PP-D7** | Backfill false/null; no event upgrade | **ACCEPT** | BF-1..BF-6 sufficient |
| **PP-D8** | Remove create staging after parity | **ACCEPT WITH NOTE** | PV-N4: JR must prove removal or no-op equivalence |
| **PP-D9** | Omit `authorialExpressionIntent` when false | **ACCEPT** | Matches current HTTP tests |
| **PP-D10** | OpenAPI deferred to E9 | **ACCEPT** | PM OUT scope correct |

**PP decisions summary:** **10/10 accepted** (2 with implementation notes).

## 4. Persistence Model Review

| Model | Sufficient for PG-HB2? | PV conclusion |
| --- | --- | --- |
| **Minimal** | YES — HB2-1,2,5,6 direct; 3,4 derive | **CONFIRMED** — recommended model stands |
| **Medium** | Over-capacity | **NOT REQUIRED** |
| **Maximal** | Over-capacity + PP-R1 risk | **REJECTED** for this program slice |

**Answer:** **Minimal persistence is sufficient.** Medium and Maximal add redundancy or proof-authority risk without closing additional ZR blockers (Y-HB3/4/6 remain outside persistence).

## 5. Candidate Columns Review

| Column | Sufficient? | Extra? | Missing? | PV |
| --- | --- | --- | --- | --- |
| `authorial_expression_intent` | YES | NO | NO | **ACCEPT** |
| `source_material_type` | YES (pair) | NO | NO | **ACCEPT** |
| `source_material_id` | YES (pair) | NO | NO | **ACCEPT** |

**Column set:** **Complete** for minimal model — no additional columns required for PG-HB2 at v1 create path.

**CHECK constraints CK-PP-1..5:** **Required** in PM migration — not optional.

**Explicitly not missing for v1:**

| Omitted | Why OK |
| --- | --- |
| `authorial_text_role` column | Derived (PP §4.1) |
| `authorial_independence` column | Derived (PP §4.2) |
| `save_publish_boundary` column | Derived (PP §4.3) |

## 6. Derived Strategy Review

| Derived item | PP claim | Code support | PV |
| --- | --- | --- | --- |
| **Independence** | From intent + text + post_type + visibility | `classifyAuthorialIndependence({ authorialExpressionIntent, ... })` | **CONFIRMED** |
| **Save/Publish** | From post_type, visibility, intent, repost_target | `classifySavePublishBoundary` same inputs | **CONFIRMED** |
| **Authorial text role** | `classifyAuthorialTextRole` | Same pattern | **CONFIRMED** |
| **P5 classifier** | From persisted material pair | `classifySourceReference` | **CONFIRMED** |

**Caveat (PV-N1):** Read guards must pass **persisted** `authorialExpressionIntent` into row input — today `spacePostRowInput` omits intent; derive-at-read **fails** for E5 on read until impl extends types.

**Opposed:** Persisting independence or dual-intent flags — **correctly rejected** in PP.

## 7. Backfill Strategy Review

| Rule | PP | PV |
| --- | --- | --- |
| BF-1 false/null default | YES | **ACCEPT** |
| BF-2 no automatic upgrade | YES | **ACCEPT** — critical for PP-R3 |
| BF-3 no SR from `repost_target_*` | YES | **ACCEPT** — PP-R4 |
| BF-4 private repost unchanged | YES | **ACCEPT** |
| BF-5 no event replay upgrade | YES | **ACCEPT** — events ≠ authority |
| BF-6 new writes from assert path | YES | **ACCEPT** |

**Backfill strategy: PASS** — no gaps identified for PM planning.

## 8. Read Rehydration Review

| Criterion | PP | Code today | PV |
| --- | --- | --- | --- |
| Single pipeline | `rehydrateAuthorialFieldsFromRow` (planned) | Staging param on create only | **ACCEPT** — impl required |
| All surfaces | §6.2 `LEGACY_SURFACE_IDS` | All use `mapPostResponse` | **ACCEPT** |
| Parity vs staging | Remove staging after parity | `buildSourceReferenceResponseStaging` on 201 only | **ACCEPT WITH NOTE** (PP-D8 / PV-N4) |
| Visibility unchanged | Yes | `canViewPost` separate | **ACCEPT** |

**Read model: PASS** at planning tier — implementation must wire DB columns into `mapPostResponse` and extended `spacePostRowInput`.

## 9. Persistence Risks Review

| ID | PP mitigation | PV status | Notes |
| --- | --- | --- | --- |
| **PP-R1** | No proof JSON columns | **MITIGATED** (design) | PM must reject proof columns |
| **PP-R2** | Single mapper; remove staging | **MITIGATED** (plan) | Proven at JR only |
| **PP-R3** | BF-1..4 backfill | **MITIGATED** (plan) | PM migration script review |
| **PP-R4** | Separate SR columns; CK-PP-5; E6 tests | **MITIGATED** (plan) | T-PP collapse tests mandatory |
| **PP-R5** | PM OUT §9.2 | **MITIGATED** (plan) | PM gate enforces |
| PP-R6 | Read plan before PM | **MITIGATED** | PP complete |
| PP-R7 | Token lock | **MITIGATED** (governance) | JR explicit |
| PP-R8 | Enum validation | **PARTIALLY MITIGATED** | App assert + optional DB enum CHECK (PV-N3) |
| PP-R9 | CK-PP-4 pair rule | **MITIGATED** (plan) | |

### 9.1 Persistence blockers

**Blockers to PV / plan acceptance:** **NONE**

**Blockers to PM gate opening:** **NONE** (plan accepted)

**Blockers to implementation (remain until PM+impl+JR):**

| ID | Blocker |
| --- | --- |
| PB-1 | No migration authorization (PM not yet executed) |
| PB-2 | `LegacySpacePostRowInput` / read path not yet wired (PV-N1) |
| PB-3 | Y-HB3, Y-HB4, Y-HB6 — outside persistence slice |

## 10. PM Readiness Review

**Answer: `YES_WITH_CONDITIONS`**

| Question | Answer |
| --- | --- |
| May program open **13B.5-PM** (Migration Implementation Authorization Gate)? | **YES_WITH_CONDITIONS** |
| May program implement DDL now? | **NO** — PM gate first |
| May program set `foundation_trio_ready: TRUE` in PM? | **NO** |

### 10.1 PM opening conditions (PM-C1..PM-C8)

| ID | Condition |
| --- | --- |
| PM-C1 | PM scope = PP §9 IN only |
| PM-C2 | PM embeds CK-PP-1..5 in authorized migration spec |
| PM-C3 | PM embeds T-PP-1..6 as mandatory JR tests |
| PM-C4 | PM forbids PP §9.2 OUT (WS-2, OpenAPI, Trio ready, proof JSON) |
| PM-C5 | PM requires `LegacySpacePostRowInput` extension (PV-N1) |
| PM-C6 | PM documents v1 create-only persistence for intent/SR (PV-N2) |
| PM-C7 | PM requires JR token: persistence bounded — not Trio ready |
| PM-C8 | Separate implementation gate after PM PASS — no coding in PM report |

## 11. PM Prerequisites

### 11.1 PM MUST do

| # | Requirement |
| --- | --- |
| 1 | Authorize **only** DDL/DML/code in PP §9.1 |
| 2 | Specify migration adding 3 columns + CK-PP-1..5 |
| 3 | Specify backfill script per BF-1..BF-6 |
| 4 | Require read rehydration in **all** `mapPostResponse` call sites |
| 5 | Require removal or equivalence proof for create staging (PP-D8) |
| 6 | Bind E7 tests T-PP-1..6 to implementation JR PASS |
| 7 | State explicit non-claims: `foundation_trio_ready: FALSE`, `ws2_authorized: FALSE` |
| 8 | Reference FT-X1 collapse edges in PM FAIL catalog |

### 11.2 PM MUST NOT do

| # | Prohibition |
| --- | --- |
| 1 | Authorize WS-2 work |
| 2 | Authorize OpenAPI/SDK changes (E9 gate) |
| 3 | Authorize `foundation_trio_ready: TRUE` |
| 4 | Authorize proof JSON columns |
| 5 | Authorize `repost_target_*` rename or SR aliasing |
| 6 | Authorize event-only persistence without DB |
| 7 | Authorize feed SQL / activity / visibility policy changes |
| 8 | Authorize implementation without subsequent bounded JR |

## 12. Persistence Review Verdict

**`PERSISTENCE_PLAN_ACCEPTED_WITH_NOTES`**

| Verdict tier | Applies? |
| --- | --- |
| PERSISTENCE_PLAN_ACCEPTED | Subsumed |
| **PERSISTENCE_PLAN_ACCEPTED_WITH_NOTES** | **YES** — PV-N1..N5 |
| PERSISTENCE_PLAN_REVIEW_REQUIRED | NO — review complete |
| PERSISTENCE_PLAN_REJECTED | NO |

### 12.1 Carry-forward notes (PV-N*)

| Note | Description |
| --- | --- |
| **PV-N1** | Extend `LegacySpacePostRowInput` and `spacePostRowInput()` with `authorialExpressionIntent` from DB; thread into read guards |
| **PV-N2** | v1 persistence on **create** only — no authorial update API; repost text update unchanged |
| **PV-N3** | CK-PP-1 text rule must align with app trim validation (`parseCreatePostText`) |
| **PV-N4** | JR must demonstrate PP-D8 staging removal or behavioral equivalence on 201 vs GET |
| **PV-N5** | Post-impl governance may narrow NR-N1/PR-N1/RR-N1/TR-N1 — not eliminate Y-HB3/4/6 |

## 13. Next Safe Step

1. **`Stage 13B.5-PM — Foundation Trio Persistence Migration Implementation Authorization Gate`** — governance only; embed PM-C1..C8 and §11.
2. On PM PASS: **bounded implementation slice** (migration + service + domain wire + tests) + **JR**.
3. Do **not** skip to E9 or BV — ZR order unchanged.
4. Optional: user commit governance reports (PG, PP, PV) when ready.

## 14. Final Tokens

```yaml
stage_13B_5_PV_status: PASS
stage_13B_5_PV_persistence_verdict: PERSISTENCE_PLAN_ACCEPTED_WITH_NOTES
stage_13B_5_PV_pm_ready: TRUE
stage_13B_5_PV_pm_readiness: YES_WITH_CONDITIONS
stage_13B_5_PV_pm_conditions: PM-C1,PM-C2,PM-C3,PM-C4,PM-C5,PM-C6,PM-C7,PM-C8
stage_13B_5_PV_foundation_trio_ready: FALSE
stage_13B_5_PV_ws2_authorized: FALSE
stage_13B_5_PV_carry_forward_notes: PV-N1,PV-N2,PV-N3,PV-N4,PV-N5
stage_13B_5_PV_next_safe_step: STAGE_13B_5_PM_PERSISTENCE_MIGRATION_IMPLEMENTATION_AUTHORIZATION_GATE
```

Program tokens (unchanged):

```yaml
persistence_planning_authorized: TRUE
persistence_review_authorized: TRUE
persistence_review_ready: TRUE
recommended_persistence_model: MINIMAL_PERSISTENCE
closure_outcome: CLOSURE_DEFERRED
foundation_trio_ready: FALSE
ws2_authorized: FALSE
```

## Execution Summary

| Deliverable | Value |
| --- | --- |
| Report | `docs/reports/stage_13B_5_PV_foundation_trio_persistence_review_v1.md` |
| Agents used | 7/7 |
| Persistence verdict | **PERSISTENCE_PLAN_ACCEPTED_WITH_NOTES** |
| PM readiness | **YES_WITH_CONDITIONS** |
| Notes | PV-N1..PV-N5 |
| Persistence blockers (impl) | PB-1..PB-3 — expected until PM+impl |
| Next step | **13B.5-PM** |

### Invariants (preserved)

```
Persistence Review ≠ Migration Authorization
Migration Authorization ≠ Persistence Implementation
Persistence Implementation ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
