# Stage 13B.5-S — FT-3B Source Reference Implementation Authorization Gate

## 1. Inputs Reviewed

Execution mode:

- `GOVERNANCE_SLICE_AUTHORIZATION_GATE_ONLY`
- no coding;
- no implementation;
- no migrations;
- no DB / OpenAPI / SDK / UI / backend runtime changes in this stage.

AI-agent docs reviewed:

| Document | Role |
| --- | --- |
| `docs/ai/agents_index.md` | Agent registry |
| `docs/ai/roles_overview.md` | Role boundaries |
| `docs/ai/roles/orchestrator.md` | Program Director / Orchestrator |
| `docs/ai/roles/slice_strategist.md` | Bounded slice discipline |
| `docs/ai/roles/runtime_governance_architect.md` | Runtime invariants |
| `docs/ai/roles/runtime_validation_agent.md` | E3/E5/E6/E7/E9 evidence |
| `docs/ai/roles/backend_dev.md` | Service/domain review |
| `docs/ai/roles/qa.md` | Test coverage |
| `docs/ai/roles/tech_writer.md` | Canon / report alignment |

Governance documents:

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_RR_ft_3D_implementation_review_and_acceptance_v1.md` | FT-3D accepted; next = FT-3B gate |
| `docs/reports/stage_13B_5_R_ft_3D_save_publish_implementation_v1.md` | FT-3D impl baseline |
| `docs/reports/stage_13B_5_Q_ft_3D_save_publish_implementation_authorization_gate_v1.md` | Gate pattern; CO-17 FT-3B after FT-3D |
| `docs/reports/stage_13B_5_PR_ft_3C_implementation_review_and_acceptance_v1.md` | FT-3C accepted; SR deferred |
| `docs/reports/stage_13B_5_NR_ft_3A_implementation_review_and_acceptance_v1.md` | FT-3A accepted; repostTarget ≠ SR |
| `docs/reports/stage_13B_5_LR_ft_5D_implementation_review_and_acceptance_v1.md` | WS-5 Phase A complete |
| `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` | P5 boundaries; collapse matrix |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | WS-3 step 7–8 P5; E9 rules |
| `docs/reports/stage_13B_3_B_authorial_post_and_source_reference_runtime_specification_v1.md` | §5 Source Reference; anti-drift list |
| `docs/reports/stage_13B_4_ZR_audit_review_and_canon_lock_v1.md` | SR ≠ repostTarget rename |

Code inspected (read-only — post-merge `main`):

| Path | Role |
| --- | --- |
| `apps/space-service/src/domain/authorialExpression.ts` | Blocks `repostTarget*` on authorial path (CO-2 negative) |
| `apps/space-service/src/domain/authorialIndependence.ts` | SR-optional / source-disappears; no P5 impl |
| `apps/space-service/src/domain/savePublishBoundary.ts` | `assertNoSourceReferenceOnPublishPath`; P5 token FALSE |
| `apps/space-service/src/domain/retentionIntent.ts` | P1 retention; not P5 |
| `apps/space-service/src/domain/perSurfaceLegacyMatrix.ts` | Legacy ≠ authorial publication |
| `apps/space-service/src/domain/legacyDistinction.ts` | `isNotSourceReference` on legacy rows |
| `apps/space-service/src/domain/forbiddenTransformations.ts` | Legacy → `source_reference` conversion blocked |
| `apps/space-service/src/services/spaceService.ts` | `repostTarget*` on repost only; no SR DTO on create |
| `apps/space-service/test/request.test.ts` | `sourceReference` undefined on responses |
| `apps/space-service/test/savePublishBoundary.test.ts` | T11 SR negative on publish path |
| `apps/space-service/test/authorialIndependence.test.ts` | Independence without SR fields |
| `apps/space-service/test/authorialExpression.test.ts` | FT-3A regression |
| `apps/space-service/test/forbiddenTransformations.test.ts` | FT-P5 legacy conversion guard |

## 2. Multi-Agent Execution Review

Multi-agent mode: **activated** for this gate. Seven mandated roles executed as structured readonly review passes. Findings recorded **per agent** below; disagreements in §2.2.

| # | Agent | Role performed | Finding ID(s) | Disposition |
| --- | --- | --- | --- | --- |
| 1 | **AI Program Director / Project Orchestrator** | Post-merge main readiness; Q→RR→S sequence | ORCH-1 | PASS |
| 2 | **Slice Strategist** | FT-3B-only scope; cutline position | STRAT-1, STRAT-2 | PASS |
| 3 | **Runtime Governance Architect** | P5 vs P4/P1/legacy; Trio/WS-2 tokens | GOV-1, GOV-2, S-N1 | PASS with carry-forward |
| 4 | **Runtime Validation Agent** | E3/E5/E6/E7/E9; F-B1..B8 fail catalog | VAL-1, VAL-2 | PASS |
| 5 | **Backend Developer (review)** | Current negatives; no SR module | BE-1, BE-2 | PASS |
| 6 | **QA Agent** | Test plan for future impl; no false-pass | QA-1, QA-2 | PASS |
| 7 | **Technical Canon Writer** | 13B.3-B §5; FT-X1 P5 row; ZR | CANON-1 | PASS |

### 2.1 Per-agent findings (detail)

**1 — AI Program Director / Project Orchestrator (ORCH-1)**

- `main` at `cbe0d0a` includes merge PR #104 (`feat/stage-13b5-ft5a-ft5b-ws5-legacy-distinction`).
- Commit chain on `main`: FT-5A→5B→5C→5D (`1406812`…`165f368`), FT-3A (`2dd6f77`), FT-3C (`9e843de`), FT-3D (`b82313f`), RR (`d951075`).
- RR explicitly directed **13B.5-S** as next governance step; this gate does not authorize coding.
- Recommended next after gate: **13B.5-T — FT-3B Implementation** on a feature branch from `main`.

**2 — Slice Strategist (STRAT-1, STRAT-2)**

- STRAT-1: FT-3B scope is **P5 Source Reference boundary only** — optional 0..1 one-hop on P4 authorial path per 13B.3-B §5.
- STRAT-1 OUT: WS-2, quote repost, chain reconstruction, SR UI, visibility policy, Trio closure, OpenAPI-as-proof.
- STRAT-2: Cutline satisfied — FT-3A/3C/3D accepted before FT-3B; WS-5 Phase A (LR) provides legacy/SR false-pass guards.
- STRAT-2: Must **not** implement P5 by renaming `repostTarget*` or reusing propagation repost machinery.

**3 — Runtime Governance Architect (GOV-1, GOV-2, S-N1)**

- GOV-1: P5 is a **separate primitive** from retention binding (`repostTarget*` on repost) and from legacy `historical_propagation` binding role (FT-5B/5D).
- GOV-1: Current runtime **rejects** SR-shaped data on authorial writes via FT-3A/3C/3D negatives — correct pre-P5 posture, not P5 establishment.
- GOV-2: Proof objects must keep `isSourceReferenceEstablished: false` until separate JR after impl; must not set `foundation_trio_ready` or `ws2_authorized`.
- S-N1 (carry-forward): NR-N1/PR-N1/RR-N1 — intent/SR metadata may remain write-bounded without DB persistence unless separate migration gate.

**4 — Runtime Validation Agent (VAL-1, VAL-2)**

- VAL-1: WS-3 spine steps 7–8 (P5 positive path + `repostTarget*` ≠ P5) are **`[STRUCTURE]`** in C2 — FT-3B impl must supply **E3+E5 positives**, not negatives alone.
- VAL-1: E9 (OpenAPI/SDK) may inventory SR-shaped types but is **NEVER-SUFFICIENT** alone (F5 / F-B17).
- VAL-2: Existing E6 partials: `assertAuthorialWriteRejectsSourceReferenceCollapse`, `assertNoSourceReferenceOnPublishPath`, `forbiddenTransformations` legacy→`source_reference`, `request.test.ts` expects `sourceReference: undefined` — adequate **pre-gate** negatives, not FT-3B complete.

**5 — Backend Developer — review mode (BE-1, BE-2)**

- BE-1: No `sourceReference.ts` or P5 classifier module — **FT-3B not implemented** (expected).
- BE-1: `spaceService` uses `repostTargetType`/`repostTargetId` only when `postType === 'repost'` — authorial `post` path forbids those fields before FT-3B adds **separate** SR fields.
- BE-2: Future FT-3B should add bounded module (e.g. `sourceReferenceBoundary.ts`) and hook **after** FT-3A/3C/3D asserts without weakening repostTarget guards on repost path.

**6 — QA Agent (QA-1, QA-2)**

- QA-1: Future E7 must include: optional SR attach; 0..1 hop reject second hop; authorial without SR; weak text + SR fails; legacy row no auto-SR; repostTarget on post still rejected; HTTP `sourceReference` only when positively established (not OpenAPI-only).
- QA-2: Gate must fail if impl only extends negatives without positive P5 write/read proof (F-B13 analog to F-Q13).

**7 — Technical Canon Writer (CANON-1)**

- 13B.3-B §5 anti-drift list (12 items) maps to FAIL criteria §11.
- FT-X1: `repostTarget*` → Source Reference is **Critical** collapse edge — FT-3B must use distinct field semantics.
- ZR: Source Reference is not `repostTarget` rename; legacy rows must not auto-become P5.

### 2.2 Disagreements between agents

| Topic | Agent A | Agent B | Resolution |
| --- | --- | --- | --- |
| P5 field naming vs OpenAPI | Backend: defer OpenAPI to inventory | Governance: NR-N2 OpenAPI gap | **CONDITION** — E9 inventory in impl report; no OpenAPI change in gate-authorized slice unless separate gate |
| Negative-only sufficiency | QA: require positive E3 | Validation: C2 already requires positives | **AGREED** — PASS criteria §10 mandate positives |

**Blocking disagreement:** None.

## 3. Post-Merge Readiness Review

### 3.1 Task 1 — Main and working base

| Check | Result | Evidence |
| --- | --- | --- |
| `main` contains FT-5A–5D | PASS | `git log main`: `1406812` … `165f368` |
| `main` contains FT-3A/3C/3D + RR | PASS | `2dd6f77`, `9e843de`, `b82313f`, `d951075`; merge `cbe0d0a` |
| Local `main` synced with `origin/main` | PASS | `git pull origin main` fast-forward to `cbe0d0a` |
| Tracked working tree clean | PASS | No staged/modified tracked files on `main` |
| FT-3B not implemented | PASS | No P5 module; `sourceReference` undefined in API responses/tests |
| Prior tokens preserved | PASS | RR tokens; P4/independence/dual-intent established with conditions |

**Local hygiene note:** Unrelated untracked audit reports remain in workspace (not blocking gate). Unrelated `reactions-service` test edits were **stashed** (`local reactions tests WIP`) before switching to `main`.

**Post-merge readiness: PASS**

## 4. Authorization Review

### 4.1 Task 2 — Are FT-3A, FT-3C, FT-3D, and WS-5 Phase A sufficient to open the FT-3B gate?

Answer:

**`YES`**

Evidence:

| Criterion | Evidence |
| --- | --- |
| FT-3A accepted | NR `FT_3A_IMPLEMENTATION_ACCEPTED_WITH_NOTES`; on `main` |
| FT-3C accepted | PR `FT_3C_IMPLEMENTATION_ACCEPTED_WITH_NOTES`; on `main` |
| FT-3D accepted | RR `FT_3D_IMPLEMENTATION_ACCEPTED_WITH_NOTES`; on `main` |
| WS-5 Phase A | LR accepted; FT-5A–5D on `main` |
| P4 expression path operational | `authorialExpression.ts` + `createPost` hooks |
| Independence operational | `authorialIndependence.ts`; source-disappears test |
| Save/publish split operational | `savePublishBoundary.ts`; dual-intent proof |
| SR negatives in place | repostTarget blocked on authorial; legacy≠P5 guards |
| Cutline permits FT-3B now | 13B.5-D §5.3 #8 after 3A/3C/3D; RR next step |
| P5 not yet established | Correct — target of FT-3B impl |
| No blocking FAIL from 3A/3C/3D | NR/PR/RR PASS matrices |

**Not required for this gate:**

- Foundation Trio closure
- WS-2 authorization
- Full P4 read persistence (S-N1 carve-out)
- Source Reference UI or cross-module source preview pipeline

### 4.2 Gate open decision

| Question | Answer |
| --- | --- |
| May FT-3B receive bounded **implementation authorization** at a future stage? | **YES** (subject to conditions §13) |
| Is implementation authorized **at this gate stage**? | **NO** |

## 5. Primitive State Review

### 5.1 Task 3 — Current primitive states

| State | Value | Evidence |
| --- | --- | --- |
| P4 bounded established | **YES (with conditions)** | NR `P4_BOUNDED_RUNTIME_PRIMITIVE_ESTABLISHED_WITH_CONDITIONS` |
| Authorial independence established | **YES (with conditions)** | PR `AUTHORIAL_INDEPENDENCE_ESTABLISHED_WITH_CONDITIONS` |
| Dual intent boundary established | **YES (with conditions)** | RR `DUAL_INTENT_BOUNDARY_ESTABLISHED_WITH_CONDITIONS` |
| P5 Source Reference established | **NO** | No SR runtime module; tests expect undefined |
| Foundation Trio ready | **NO** | ZR, FT-X1, RR tokens |
| WS-2 authorized | **NO** | Cutline Phase C; RR tokens |

**Interpretation for FT-3B gate:**

- FT-3B may **establish bounded P5** on top of accepted P4 path without revoking FT-3A/3C/3D acceptance.
- FT-3B must **not** conflate P5 establishment with Trio or WS-2.

## 6. FT-3B Scope Definition

### 6.1 Task 4 — Slice identity

| Field | Value |
| --- | --- |
| Slice ID | `FT-3B` |
| Workstream | WS-3 Authorial Post & Source Reference Alignment |
| Planning slices | WS3-P2 Source Reference; WS3-P5 guards |
| Primitive | **P5 Source Reference only** |
| Goal | Operationalize **optional 0..1 one-hop** source context on **Authorial Post (P4)** write/read boundary without repost/quote/chain collapse |

### 6.2 IN scope (exhaustive)

FT-3B implementation may include only:

1. **P5 classifier / proof object** — distinct from `repostTarget*`; optional; max one hop.
2. **Bounded authorial write path** — attach SR only when `authorialExpressionIntent: true` and P4 proof passes.
3. **Separate SR field semantics** (names illustrative: `sourceReference` / `sourceMaterialType` + `sourceMaterialId` — must not alias `repostTarget*`).
4. **Secondary-to-text enforcement** — SR cannot satisfy authorial text-primary alone; extends FT-3C source-disappears.
5. **E3 PRIMARY** — observable write with/without optional SR on authorial path.
6. **E5 PRIMARY** — P5 classification proof; 0 or 1 reference; not repost primitive.
7. **E6 PRIMARY** — negatives: repostTarget≠P5; legacy≠P5; retention binding≠P5; no chain; no quote-repost.
8. **E7 PRIMARY** — test suite §9.3.
9. **E4 SUPPORTING** — read surfaces expose SR only through authorial post carrier (bounded).
10. **Consumption of FT-3A/3C/3D/FT-5** — extend hooks; do not replace.
11. **E2 implementation report** with carve-outs and PASS/FAIL.
12. **WS-3 spine steps 7–8 progress** — P5 positive path + anti-collapse (C2).

### 6.3 OUT of scope (exhaustive)

| Area | Out of scope | Owns |
| --- | --- | --- |
| WS-2 | Public/group repost elimination | Separate authorization |
| Quote repost | Quote-post relation semantics | Forbidden |
| Source chain / nested reference | Multi-hop ancestry | Forbidden |
| Source Reference UI | Preview cards, editor UX | Out of Space-service slice |
| Visibility policy (WS3-P6) | public/group rules | Inventory only |
| Foundation Trio closure | `foundation_trio_ready` | FT-X3 |
| `ws2_authorized` | propagation elimination | WS-2 gate |
| OpenAPI / SDK as primary proof | E9 never sufficient | Separate contract gate |
| Migrations / schema | persist SR in DB | Separate gate (S-N1) |
| `repostTarget*` rename | Retention/propagation binding | WS-1 / legacy |
| Legacy row auto-conversion to P5 | Historical artifacts | WS-5 + forbidden transforms |
| Blog pipeline / activity redesign | WS-6 / WS3-P8 | Future |
| Full unbounded P4 lifecycle upgrade | JR separate | Not FT-3B alone |

### 6.4 Scope creep detection signals

Flag if future diff:

- Eliminates public/group repost routes (WS-2);
- Implements quote-repost or chain reconstruction;
- Uses `repostTarget*` on `postType: post` as SR;
- Auto-migrates legacy repost rows to P5;
- Claims `foundation_trio_ready` or `ws2_authorized`;
- Adds OpenAPI-only types without E3/E5 runtime path;
- Makes SR required for authorial publish.

## 7. Source Reference Boundary Definition

### 7.1 Task 5 — Canon semantics (13B.3-B §5)

| Property | Requirement |
| --- | --- |
| Optional | Authorial Post may have **zero** Source References |
| Cardinality | **0..1** one-hop per Authorial Post |
| Role | **Secondary** context; author text remains primary |
| Pointer | One-hop to nearest relevant **source material** (not repost object center) |
| Attachment | **Only on P4** (authorial expression path) |
| Not a repost | Must not use `postType: repost` or propagation semantics |
| Not quote-repost | No quote-post parent/child |
| Not chain | No multi-hop reference graph |
| Not proof of P4 | SR presence does not establish Authorial Post |
| Not replacement for text | Preview disappearance must not void thought (FT-3C test) |
| Not WS-2 | SR does not eliminate propagation repost |
| Not Trio | P5 alone does not close Foundation Trio |

### 7.2 Boundary matrix (P5 vs neighbors)

| Neighbor | Must-not collapse | Current runtime support |
| --- | --- | --- |
| `repostTarget*` (P1/propagation) | Source Reference | Blocked on authorial `post` path (FT-3A/3D) |
| Private Repost binding | P5 | `private_repost_intent` separate |
| Legacy `repostTarget*` | P5 | FT-5B `historical_propagation`; FT-5C conversion block |
| Bookmark (P3) | P5 | No SR on reactions path |
| Authorial Text (P4) | SR cannot be primary | FT-3C text-primary |
| Save/Publish (FT-3D) | SR hidden in save/publish | `noSourceReferenceHiddenInSavePublish` |

### 7.3 Target write-path semantics (declarative — not implemented in S)

Future FT-3B may allow on authorial write:

- `authorialExpressionIntent: true` + valid authorial text;
- optional **single** source reference payload (distinct fields);
- SR dedupe scope **must not** reuse retention/propagation repost dedupe as authorial blocker (13B.3-B §5).

Future FT-3B must reject:

- SR on non-authorial writes;
- SR + `repostTarget*` on same authorial carrier;
- Second hop / chain fields;
- SR without text-primary (weak author + strong source);
- SR on `postType: repost`.

## 8. FT-3B Carve-Out Matrix

### 8.1 Task 6 — Carve-outs

| ID | Domain | Allowed in FT-3B | Forbidden / carved out | Reference |
| --- | --- | --- | --- | --- |
| CO-S1 | FT-3A/3C/3D | Extend authorial write chain | Redefine expression/independence/save-publish | NR/PR/RR |
| CO-S2 | `repostTarget*` | Negative: must stay on repost only | Rename to SR on `postType: post` | 13B.3-B §5; ZR |
| CO-S3 | WS-2 | — | Public/group repost elimination | 13B.3-D |
| CO-S4 | Quote repost | — | Quote-post implementation | User mandate |
| CO-S5 | Chain | — | Multi-hop / ancestry reconstruction | 13B.3-B §5 |
| CO-S6 | SR UI | — | Frontend preview/editor | Out of slice |
| CO-S7 | Visibility policy | Inventory only | WS3-P6 resolution | Open gates |
| CO-S8 | Foundation Trio | Partial P5 spine only | `foundation_trio_ready` | FT-X3 |
| CO-S9 | OpenAPI/SDK | E9 inventory note | Contract-as-proof | F5 |
| CO-S10 | Persistence | Write-bounded proof OK | DB migration without gate | S-N1 |
| CO-S11 | WS-5 stack | Consume distinction/forbidden/matrix | Redefine FT-5A–5D | LR |
| CO-S12 | Legacy rows | Negative + no auto-convert | Legacy→P5 migration | FT-5C FT-P5 |
| CO-S13 | Activity | No incoming pressure from SR | WS-6 redesign | 13B.3-B §5 |
| CO-S14 | Dedupe | Authorial path not blocked by retention dedupe | Repurpose repost dedupe as SR gate | FT-1D/FT-3D |
| CO-S15 | Cutline | FT-3B after 3A/3C/3D | FT-3B before expression path | 13B.5-D; RR |

## 9. Evidence Requirements

Based on FT-X2 (no new evidence classes).

### 9.1 Task 7 — Mandatory at this gate (13B.5-S)

| E-class | Requirement at gate stage |
| --- | --- |
| **E1** | This report; 13B.3-B §5; ZR SR≠repostTarget |
| **E2** | PASS/FAIL template; deliverables §12 |
| **E3** | P5 write-path targets declared |
| **E5** | P5 classification targets declared |
| **E6** | Anti-collapse targets declared |
| **E7** | Test plan §9.3 declared |
| **E9** | Inventory-only note declared (never sufficient) |

Prior E2 on `main`: NR, PR, RR, LR, Q, R, RR reports.

### 9.2 Mandatory at future implementation stage

| E-class | Requirement at impl stage | FT-3B emphasis |
| --- | --- | --- |
| **E3** | **PRIMARY** — authorial write with optional 0..1 SR | Positive path required |
| **E5** | **PRIMARY** — P5 proof object; not repostTarget alias | Distinct primitive ID |
| **E6** | **PRIMARY** — repost/legacy/retention/chain/quote negatives | §11 FAIL mirror |
| **E7** | **PRIMARY** — §9.3 tests executed | Bounded Space-service |
| **E4** | SUPPORTING — read carrier exposes SR only on authorial posts | NR-N1 bounded |
| **E8** | SUPPORTING — legacy surfaces do not show SR as P5 proof | FT-5D |
| **E2** | Implementation report | Stage 13B.5-T |
| **E9** | **NEVER-SUFFICIENT alone** | OpenAPI type inventory only |

WS-3 spine contribution (partial):

- Step 7 (E3+E5 P5 on P4): target **progress toward FILLED**
- Step 8 (E6 `repostTarget*` ≠ P5): strengthen from PARTIAL to **bounded FILLED** for slice
- Step 13 (P4 and P5 independently established): P5 may approach **ESTABLISHED_BOUNDED** at JR — P4 remains bounded

### 9.3 E7 test plan (declared at gate — execution deferred)

| ID | Intent |
| --- | --- |
| T1 | Authorial write **without** SR classifies P4 only (no P5) |
| T2 | Authorial write **with** one SR classifies P5 attached to P4 |
| T3 | Second SR / chain hop rejected |
| T4 | SR on non-authorial write rejected |
| T5 | `repostTarget*` on authorial `post` still rejected (not renamed to SR) |
| T6 | Weak text + SR fails text-primary / source-disappears |
| T7 | Strong text without SR passes (SR optional) |
| T8 | Legacy repost row does not auto-attach SR |
| T9 | Private repost retention binding ≠ P5 |
| T10 | Propagation repost ≠ P5 |
| T11 | Retention dedupe does not block authorial+SR on same thematic target |
| T12 | HTTP response: `sourceReference` present only when established (not always undefined) |
| T13 | OpenAPI type alone insufficient (F5) |
| T14 | FT-3A/3C/3D regression suite still green |

Suggested execution surface:

- `sourceReferenceBoundary.ts` (or governed name);
- `sourceReferenceBoundary.test.ts`;
- bounded hooks in `spaceService.ts` `createPost` / `mapPostResponse`;
- extend `request.test.ts` for HTTP SR positive/negative;
- **no** WS-2; **no** `repostTarget*` on post path.

### 9.4 Insufficient evidence (must not pass FT-3B review)

| Evidence type | Verdict |
| --- | --- |
| Negatives only (no positive P5 write) | INSUFFICIENT (F-B13) |
| `repostTarget*` rename on post | INSUFFICIENT (F-B1) |
| OpenAPI/SDK only | INSUFFICIENT (F-B17) |
| Legacy row as P5 proof | INSUFFICIENT (F-B8) |
| FT-3C source-disappears test alone | INSUFFICIENT — needs P5 fields |

## 10. PASS Criteria

### 10.1 Task 8 — After future FT-3B implementation

The slice passes only if all are true:

1. Bounded P5 write path on authorial posts with **optional** 0..1 one-hop SR (E3).
2. E5 proof distinguishes P5 from repostTarget/retention/legacy (distinct fields/classifier).
3. E6 negatives pass: §11 FAIL catalog not triggered.
4. E7 tests §9.3 executed and passing (including HTTP where applicable).
5. FT-3A/3C/3D behavior preserved; FT-5 guards consumed on legacy reads.
6. Authorial post **not required** to include SR.
7. SR cannot replace author text as primary payload.
8. No WS-2, quote repost, or chain code in diff.
9. E2 report with scope and carve-outs §8.
10. Tokens: `foundation_trio_ready: FALSE`, `ws2_authorized: FALSE` until separate gates.
11. `source_reference_runtime_primitive_established` may be set only by **JR** — not at impl stage alone without review.
12. No OpenAPI-only deliverable without runtime proof.
13. False-pass F3/F12/F14/F5 (ZR) not triggered.
14. WS-3 spine steps 7–8 marked progress in E2.

PASS token for implementation review:

`FT_3B_IMPLEMENTATION_COMPLETE` (separate JR decides P5 establishment token)

## 11. FAIL Criteria

### 11.1 Task 9 — Implementation fails if any condition holds

| ID | FAIL condition | Collapse / risk |
| --- | --- | --- |
| F-B1 | `repostTarget*` cited or used as Source Reference on authorial path | **Critical** — ZR, 13B.3-B |
| F-B2 | Source Reference implemented as repost / `postType: repost` | P5→propagation |
| F-B3 | Source Reference implemented as quote repost | Quote collapse |
| F-B4 | Multi-hop / chain / parent reference graph | Chain forbidden |
| F-B5 | SR used as authorial text / preview = body | F-B5 / weak text |
| F-B6 | Authorial post **requires** SR to publish | Optional violated |
| F-B7 | SR establishes WS-2 or eliminates propagation | Scope creep |
| F-B8 | SR establishes Foundation Trio | F1 false pass |
| F-B9 | Legacy row auto-converted to P5 | FT-5C / historical |
| F-B10 | Private repost binding presented as P5 | P1→P5 |
| F-B11 | Retention dedupe blocks authorial+SR | FT-1D regression |
| F-B12 | Scope includes WS-2 elimination | Scope creep |
| F-B13 | Negatives only; no positive P5 E3/E5 | F-Q13 analog |
| F-B14 | OpenAPI/SDK only | F5 |
| F-B15 | UI-only SR surface | F6 |
| F-B16 | Redefines FT-5A–5D or revokes FT-3A/3C/3D | Regression |
| F-B17 | Report claims `ws2_authorized: TRUE` | F18 |
| F-B18 | Report claims `foundation_trio_ready: TRUE` at impl | F1 |
| F-B19 | SR required for independence proof | FT-3C violation |

FAIL token:

`FT_3B_IMPLEMENTATION_FAILED` or `FT_3B_IMPLEMENTATION_BLOCKED`

## 12. Expected Implementation Deliverables

Future implementation stage (not executed in 13B.5-S):

| # | Deliverable | E-class |
| --- | --- | --- |
| D1 | FT-3B implementation report | E2 |
| D2 | Source Reference boundary domain module | E3/E5 |
| D3 | Write/read hooks on authorial path in `spaceService.ts` | E3/E4 |
| D4 | Automated tests per §9.3 | E7 |
| D5 | Traceability (P5 classifier → proof → test) | E5 |
| D6 | Carve-out verification + S-N1 persistence note | E2 |
| D7 | E9 OpenAPI inventory note (no contract change unless separate gate) | E9 |
| D8 | Final tokens | E1 |

Not expected:

- WS-2 work;
- Quote repost or chain;
- SR UI components;
- Foundation Trio closure;
- DB migration (unless separate gate);
- `repostTarget*` semantics change on repost path.

Recommended impl token (future stage only):

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_3B_SOURCE_REFERENCE_BOUNDARY_ONLY`

## 13. Authorization Verdict

### 13.1 Gate authorization

Final verdict:

**`FT_3B_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS`**

Why authorized:

- **main** contains accepted FT-5A–5D, FT-3A, FT-3C, FT-3D (merge PR #104);
- RR directed this gate; cutline CO-17 satisfied;
- P4 + independence + dual-intent **established with conditions** — adequate P4 host for optional P5;
- 13B.3-B §5 and FT-X1 P5 boundaries are defined and testable;
- Pre-P5 **negatives** exist (repostTarget block, legacy conversion block, undefined `sourceReference` in API);
- FT-X2 permits E3+E5+E6+E7 bounded slice;
- No blocking agent disagreement.

Why with conditions (not unqualified):

- **S-N1:** NR-N1/PR-N1/RR-N1 — write-bounded; DB/OpenAPI persistence not in FT-3B unless separate gates;
- **NR-N2:** `authorialExpressionIntent` / future SR fields may be absent from OpenAPI — E9 inventory only;
- **C2:** WS-3 P5 steps were `[STRUCTURE]` — FT-3B must deliver **positive** E3/E5, not negatives alone;
- **CO-S2:** Distinct SR fields mandatory — no `repostTarget*` rename;
- **CO-S8/CO-S3:** P5 ≠ Trio ≠ WS-2.

Why not blocked:

- All prerequisites accepted on `main`;
- SR collapse risks addressable in bounded Space-service slice;
- FT-3B is the explicit next WS-3 primitive after save/publish split.

### 13.2 Authorization tokens (this stage)

| Token | Value |
| --- | --- |
| Gate opened | `TRUE` |
| Implementation authorized (this stage) | `FALSE` |

Gate conditions:

`FT_3A_ACCEPTED,FT_3C_ACCEPTED,FT_3D_ACCEPTED,WS5_PHASE_A_COMPLETE,P4_BOUNDED_ESTABLISHED,AUTHORIAL_INDEPENDENCE_BOUNDED,DUAL_INTENT_BOUNDARY_BOUNDED,ZR_REPOSTTARGET_NOT_SR,13B_3_B_SECTION_5,ADOPT_FT_X2,CONSUME_FT_3A_3C_3D_FT_5,S_N1_PERSISTENCE_CARVE_OUT,NR_N2_OPENAPI_INVENTORY,E9_NEVER_SUFFICIENT_ALONE,POSITIVE_E3_E5_REQUIRED,WS2_NOT_IN_SCOPE,TRIO_NOT_IN_SCOPE,QUOTE_CHAIN_UI_OUT_OF_SCOPE`

## 14. Next Safe Step

Recommended next stage:

**`Stage 13B.5-T — FT-3B Source Reference Implementation`**

Scope:

- bounded coding slice per this gate;
- deliverables §12;
- feature branch from `main`;
- token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_3B_SOURCE_REFERENCE_BOUNDARY_ONLY` (issued at implementation stage start, not here).

After FT-3B implementation + JR:

- FT-X3 Trio closure gate (future);
- WS-2 authorization gate (separate);
- optional persistence/OpenAPI gates (S-N1, NR-N2).

Not safe next:

- FT-3B coding without reading this gate;
- WS-2 or quote/chain work bundled into FT-3B;
- claiming `foundation_trio_ready` or `ws2_authorized` from P5;
- treating gate authorization as P5 established.

## 15. Final Tokens

```yaml
stage_13B_5_S_status: FT_3B_IMPLEMENTATION_GATE_COMPLETE
stage_13B_5_S_execution_mode: GOVERNANCE_SLICE_AUTHORIZATION_GATE_ONLY
stage_13B_5_S_verdict: FT_3B_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS
stage_13B_5_S_gate_authorized: TRUE
stage_13B_5_S_implementation_authorized: FALSE
stage_13B_5_S_ft_3a_prerequisite: ACCEPTED
stage_13B_5_S_ft_3c_prerequisite: ACCEPTED
stage_13B_5_S_ft_3d_prerequisite: ACCEPTED
stage_13B_5_S_ws5_phase_a_prerequisite: ACCEPTED
stage_13B_5_S_p4_state: P4_BOUNDED_RUNTIME_PRIMITIVE_ESTABLISHED_WITH_CONDITIONS
stage_13B_5_S_authorial_independence_state: AUTHORIAL_INDEPENDENCE_ESTABLISHED_WITH_CONDITIONS
stage_13B_5_S_dual_intent_state: DUAL_INTENT_BOUNDARY_ESTABLISHED_WITH_CONDITIONS
stage_13B_5_S_authorial_post_runtime_primitive_established: TRUE  # bounded carry-forward; not upgraded by gate
stage_13B_5_S_source_reference_runtime_primitive_established: FALSE
stage_13B_5_S_foundation_trio_ready: FALSE
stage_13B_5_S_ws2_authorized: FALSE
stage_13B_5_S_ws3_spine_step_7_p5_on_p4: AUTHORIZATION_TARGET
stage_13B_5_S_ws3_spine_step_8_reposttarget_not_p5: AUTHORIZATION_TARGET
stage_13B_5_S_gate_conditions: FT_3A_ACCEPTED,FT_3C_ACCEPTED,FT_3D_ACCEPTED,WS5_PHASE_A_COMPLETE,POSITIVE_E3_E5_REQUIRED,REPOSTTARGET_NOT_SR,WS2_NOT_IN_SCOPE,TRIO_NOT_IN_SCOPE
stage_13B_5_S_next_safe_step: STAGE_13B_5_T_FT_3B_SOURCE_REFERENCE_IMPLEMENTATION
stage_13B_5_S_recommended_impl_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_3B_SOURCE_REFERENCE_BOUNDARY_ONLY
stage_13B_5_S_carry_forward_notes: S-N1,NR-N2,RR-N1,PR-N1
```

## Execution Summary

| Item | Value |
| --- | --- |
| Report | `docs/reports/stage_13B_5_S_ft_3B_source_reference_implementation_authorization_gate_v1.md` |
| Base branch | `main` @ `cbe0d0a` (PR #104 merged) |
| Working tree | Tracked files clean; unrelated edits stashed |
| Agents used | 7/7 mandated |
| Verdict | `FT_3B_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` |
| Prerequisite YES? | **YES** (FT-3A, FT-3C, FT-3D, WS-5 Phase A) |
| FT-3B implemented? | **NO** (expected) |
| Next step | **13B.5-T** — FT-3B Implementation (do not execute now) |

### Source Reference boundary summary

Optional **0..1 one-hop** source context on **Authorial Post only**; **secondary** to author text; **distinct** from `repostTarget*`, repost, quote-repost, and chains; must not establish Trio, WS-2, or replace P4.

### Carve-outs (short)

WS-2, quote repost, chain, SR UI, visibility policy, Trio closure, OpenAPI-as-proof, `repostTarget*` rename, legacy auto-conversion.

### Invariants (preserved)

```
FT-3B Gate Authorized ≠ FT-3B Implemented
FT-3B Implemented ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
Source Reference ≠ repost / quote repost / chain
repostTarget* ≠ Source Reference
```
