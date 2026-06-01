# Stage 13B.5-Q — FT-3D Save/Publish Implementation Authorization Gate

## 1. Inputs Reviewed

Execution mode:

- `GOVERNANCE_SLICE_AUTHORIZATION_GATE_ONLY`
- no coding;
- no implementation;
- no migrations;
- no DB / OpenAPI / SDK / UI / backend runtime changes in this stage.

Multi-agent mode:

- activated before this work using `docs/ai` role model (readonly);
- outputs from mandated agents used as gate inputs only (no implementation delegation).

Governance documents (mandatory):

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_PR_ft_3C_implementation_review_and_acceptance_v1.md` | FT-3C accepted; independence established with conditions; next = FT-3D gate |
| `docs/reports/stage_13B_5_P_ft_3C_authorial_independence_implementation_v1.md` | FT-3C impl baseline; partial FT-3D negative keys only |
| `docs/reports/stage_13B_5_O_ft_3C_authorial_independence_implementation_authorization_gate_v1.md` | Gate pattern; FT-3D carved from FT-3C |
| `docs/reports/stage_13B_5_NR_ft_3A_implementation_review_and_acceptance_v1.md` | FT-3A accepted; P4 bounded decision; NR-N1..N4 |
| `docs/reports/stage_13B_5_N_ft_3A_authorial_expression_implementation_v1.md` | FT-3A impl baseline |
| `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` | P1/P3/P4 save/publish collapse matrix; Retention vs Expression intents |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | E3/E5/E6/E7 rules; WS-3 spine; false-pass catalog |
| `docs/reports/stage_13B_3_B_authorial_post_and_source_reference_runtime_specification_v1.md` | §4 boundary rule: Bookmark / Private Repost / Authorial Post / SR |
| `docs/reports/stage_13B_4_ZR_audit_review_and_canon_lock_v1.md` | `postType: post` lock; Trio ≠ WS-2; SR ≠ repostTarget |

Supporting cutline (referenced):

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_D_ws3_ws5_planning_acceptance_and_implementation_cutline_v1.md` | FT-3D position #7; WS3-P4; deps FT-3A + FT-1A |
| `docs/reports/stage_13B_5_M_ft_3A_authorial_expression_implementation_authorization_gate_v1.md` | CO-3 save/publish deferral pattern |

Code inspected (read-only):

| Path | Role |
| --- | --- |
| `apps/space-service/src/domain/authorialExpression.ts` | `authorial_expression_intent`; P4 bounded proof; not private repost |
| `apps/space-service/src/domain/authorialIndependence.ts` | `FORBIDDEN_SAVE_PUBLISH_BODY_KEYS` (FT-3C negative only); `isSavePublishIndependent` stub |
| `apps/space-service/src/domain/retentionIntent.ts` | `private_repost_intent` vs `propagation_repost`; `private_note` role |
| `apps/space-service/src/domain/perSurfaceLegacyMatrix.ts` | `notAuthorialPublicationOnSurface`; legacy ≠ publication |
| `apps/space-service/src/services/spaceService.ts` | `createPost`: dedupe scope `retention` vs `propagation`; activity skip for private retention |

Accepted upstream state (user-confirmed + PR/NR tokens):

| Artifact | Status |
| --- | --- |
| FT-5A–5D | Accepted (FR/HR/JR/LR) |
| FT-3A gate (M) | `FT_3A_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` |
| FT-3A impl (N) + review (NR) | `FT_3A_IMPLEMENTATION_ACCEPTED_WITH_NOTES` |
| FT-3C gate (O) + impl (P) + review (PR) | `FT_3C_IMPLEMENTATION_ACCEPTED_WITH_NOTES` |
| P4 expression | `P4_BOUNDED_RUNTIME_PRIMITIVE_ESTABLISHED_WITH_CONDITIONS` |
| Authorial independence | `AUTHORIAL_INDEPENDENCE_ESTABLISHED_WITH_CONDITIONS` |
| WS-5 Phase A | COMPLETE |
| WS-1 (FT-1A/1E) | Bounded complete (retention + bookmark separation) |
| Foundation Trio | NOT READY |
| WS-2 | NOT AUTHORIZED |
| P5 Source Reference | NOT ESTABLISHED |

## 2. Multi-Agent Execution Review

| # | Agent role | Contribution to this gate |
| --- | --- | --- |
| 1 | AI Program Director / Project Orchestrator | Confirmed cutline position (#7), no coding in Q, token invariants preserved |
| 2 | Slice Strategist | FT-3D scope = WS3-P4 Save/Publish only; FT-3B/WS-2/Trio explicitly deferred |
| 3 | Runtime Governance Architect | Dual-intent boundary vs FT-1A retention and FT-3A expression; carve-out matrix CO-Q* |
| 4 | Runtime Validation Agent | E3/E5/E6/E7 requirements; FAIL catalog for Save=Publish collapse |
| 5 | Backend Developer (review mode) | Code inspection: partial negative in FT-3C; dedupe scope; no product save/publish split yet |
| 6 | QA Agent | E7 test plan §7.3; regression risks (dedupe, bookmark, activity) |
| 7 | Technical Canon Writer | 13B.3-B §4 rule + FT-X1 collapse edges; ZR `postType: post` lock |

Agent consensus: **no blocker** to open FT-3D implementation gate with conditions; **no agent** recommends treating FT-3C negative keys as FT-3D complete.

## 3. Authorization Review

### 3.1 Task 1 — Are FT-3A and FT-3C sufficient to open the FT-3D gate?

Answer:

**`YES`**

Evidence:

| Criterion | Evidence |
| --- | --- |
| FT-3A implementation accepted | NR `FT_3A_IMPLEMENTATION_ACCEPTED_WITH_NOTES`; bounded P4 write path operational |
| FT-3C implementation accepted | PR `FT_3C_IMPLEMENTATION_ACCEPTED_WITH_NOTES`; independence proof on FT-3A path |
| Expression intent classifier exists | `authorial_expression_intent` distinct from `private_repost_intent` (`authorialExpression.ts`, `retentionIntent.ts`) |
| Independence includes save/publish **negative** stub | `FORBIDDEN_SAVE_PUBLISH_BODY_KEYS`; PR T14; **not** full dual-intent product split |
| WS-5 stack available | FT-5A–5D accepted; read guards on authorial path |
| WS-1 retention/bookmark baseline | FT-1A private repost + FT-1E bookmark separation (C matrix; `request.test.ts` dedupe/bookmark negatives) |
| Cutline permits FT-3D now | 13B.5-D §5.3: FT-3D after FT-3A; FT-3C completed at #6 before #7 |
| WS3-P4 planning accepted | 13B.5-D WS3-P4 row; 13B.5-A/B conceptual split defined |
| No blocking FAIL from FT-3A/3C | NR 14/14 PASS; PR 14/14 PASS; 135/135 tests at PR |
| ZR lock preserved | Generic `postType: post` without intent remains carrier-only |

**Not required for this gate (explicit):**

- FT-3B Source Reference — after FT-3D per CO-17 / cutline #8
- Foundation Trio closure — FT-X3
- WS-2 authorization
- Full save/publish product implementation — target of **future** FT-3D impl stage only

**Clarification:** FT-3C acceptance is **sufficient** together with FT-3A; cutline preconditions table lists FT-3A + FT-1A for FT-3D, not FT-3C as hard doc row — but FT-3C is **already complete** and strengthens gate readiness (independence + save/publish field rejection) without substituting for FT-3D scope.

### 3.2 Gate open decision

| Question | Answer |
| --- | --- |
| May FT-3D receive bounded **implementation authorization** at a future stage? | **YES** (subject to conditions §12) |
| Is implementation authorized **at this gate stage**? | **NO** |

## 4. Current P4 State Review

### 4.1 Task 2 — State confirmation

| Assertion | Confirmed | Evidence |
| --- | --- | --- |
| Bounded P4 established (with conditions) | **YES** | NR `P4_BOUNDED_RUNTIME_PRIMITIVE_ESTABLISHED_WITH_CONDITIONS`; PR carry-forward |
| Authorial independence established (with conditions) | **YES** | PR `AUTHORIAL_INDEPENDENCE_ESTABLISHED_WITH_CONDITIONS` |
| Source Reference runtime primitive established | **NO** | No P5 fields; PR/O tokens FALSE |
| Foundation Trio ready | **NO** | PR, ZR, FT-X1 |
| WS-2 authorized | **NO** | Cutline Phase C; PR tokens |

### 4.2 Runtime posture (code-backed)

| Layer | State |
| --- | --- |
| Expression write | `authorial_expression_intent` on opt-in `POST` with `authorialExpressionIntent: true` |
| Retention write | `private_repost_intent` via `postType: repost` + `visibility: private` |
| Save/publish product split | **NOT IMPLEMENTED** — only body-key rejection on authorial path (FT-3C CO-4) |
| Dedupe | Scoped `retention` vs `propagation` in `spaceService.ts` — authorial `post` path separate |
| Activity | Private retention skips outgoing activity materialization |
| Bookmark | Reactions-owned; tests prove dedupe does not read bookmarks |

**Interpretation for FT-3D gate:**

- FT-3D may **operationalize** dual-intent save/publish boundary without revoking bounded P4 or independence from NR/PR.
- FT-3D must **not** claim `source_reference_runtime_primitive_established`, `foundation_trio_ready`, or `ws2_authorized`.

## 5. FT-3D Scope Definition

### 5.1 Task 3 — Slice identity

| Field | Value |
| --- | --- |
| Slice ID | `FT-3D` |
| Workstream | WS-3 Authorial Post & Source Reference Alignment |
| Planning slice | WS3-P4 Save/Publish Split |
| Primitive touch | P4 expression **vs** P1 retention **vs** P3 bookmark (boundary only — not P3 impl) |
| Goal | Prove **retention intent** and **expression intent** are separable at Space runtime semantics — Save ≠ Publish |

### 5.2 IN scope (exhaustive)

FT-3D implementation may include only:

1. **Dual-intent classifiers** — explicit `retention_intent` / `expression_intent` (or equivalent governed names) on write path, building on `private_repost_intent` and `authorial_expression_intent`.
2. **Save boundary (P1)** — Private Repost write path remains retention-only; must not classify as publish/expression.
3. **Publish boundary (P4)** — Authorial expression write path remains publication/expression-only; must not require prior save or retention row.
4. **Bookmark boundary (P3)** — negative proof: bookmark reaction fact ≠ Space retention row ≠ authorial publish (reference FT-1E; no Reactions rewrite in Space slice unless separately authorized).
5. **Retention vs expression dedupe** — retention dedupe must not block authorial expression on same thematic target (extend FT-1D awareness / `assertDedupeScopeNotBlockingAuthorial`).
6. **E3 PRIMARY** — observable separate write paths with classified intents (retention vs expression).
7. **E5 PRIMARY** — classification proof objects mapping writes to P1 vs P4 intents (not UI labels).
8. **E6 PRIMARY** — anti-collapse: Save≠Publish, Bookmark≠Publish, Retention≠Publish, Publish⊥Save dependency.
9. **E7 PRIMARY** — executed boundary tests per §8.3.
10. **Extension of FT-3A/3C hooks** — `createPost` / `mapPostResponse` bounded changes in Space-service only.
11. **E2 bounded implementation report** with scope, carve-outs, PASS/FAIL.
12. **WS-3 spine partial fill** — step 6 E6 retention-vs-expression; not full spine or P5.

### 5.3 OUT of scope (exhaustive — scope creep forbidden)

| Area | Out of scope | Owns |
| --- | --- | --- |
| FT-3B Source Reference | P5 primitive, 0..1 one-hop, `repostTarget*` as SR | Future gate after FT-3D JR |
| WS-2 | Public/group repost elimination | Separate authorization |
| WS-4 | Group feed authorial-only SQL | Future WS-4 |
| Visibility policy (WS3-P6) | public/group/non-owner rules | Policy carve-out inventory only |
| Foundation Trio closure | `foundation_trio_ready` | FT-X3 |
| `ws2_authorized` | propagation elimination | WS-2 gate |
| OpenAPI / SDK as primary proof | E9 never sufficient | Inventory note only |
| UI / PWA ContentActionRow | product save/publish UX | Out of Space-service unless separate auth |
| Migrations / schema redesign | intent persistence in DB | Separate gate (NR-N1) |
| Reactions service rewrite | P3 bookmark implementation | FT-1E bounded; reference only |
| Blog / activity / projections as P4 proof | WS-6, WS3-P8 | Future |
| Full P4 lifecycle / Trio tokens upgrade | establishment JR | Not in FT-3D alone |
| FT-3C re-implementation | independence proof | Already accepted — extend only |

### 5.4 Scope creep detection signals

Implementation review must flag scope creep if diff touches:

- Source Reference fields on `postType: post` (FT-3B);
- WS-2 route elimination or public repost deprecation;
- `foundation_trio_ready: TRUE` or `ws2_authorized: TRUE`;
- Bookmark implemented as `postType: repost` private row;
- Private repost counted as authorial publication on profile/public surfaces;
- Single combined API field merging save and publish intents without classifier separation.

## 6. Save / Publish Boundary Definition

### 6.1 Task 4 — Core concepts (declarative — not implemented in Q)

Governance framework for future implementation (WS3-P4). Per 13B.3-B §4 and FT-X1 §5:

| Concept | Canon meaning | Runtime signal (future impl target) |
| --- | --- | --- |
| **Save (retention)** | Owner saves **context** for self (P1 Private Repost) | `private_repost_intent`; `postType: repost` + `visibility: private`; dedupe scope `retention` |
| **Retention** | WS-1 owner-only binding; not publication | No outgoing activity for new private retention (existing `spaceService` behavior) |
| **Bookmark (P3)** | Reactions `reactionType: bookmark`; pointer to material | Separate service; must not prove P1; must not imply publish |
| **Publish (expression)** | User publishes **own thought** (P4 path) | `authorial_expression_intent`; `postType: post` + opt-in flag; not preceded by required save |
| **Authorial Expression** | FT-3A/3C established expression unit | Consumes existing classifiers; FT-3D adds intent **orthogonality** proof |

### 6.2 Boundary matrix (Save/Publish vs neighbors)

| Operation | Primitive | Must-not collapse into | Current runtime |
| --- | --- | --- | --- |
| Save / Private Repost | P1 | Authorial Post (P4); Publish | Classifier exists; not full dual-intent proof object |
| Publish / Authorial write | P4 | Private Repost (P1); Save | Expression path exists; save fields rejected (FT-3C) |
| Bookmark | P3 | P1 retention row; P4 publish | FT-1E separation; dedupe test negative |
| Retention dedupe | P1 scope | Blocks P4 expression | `retention` scope only on repost path |
| Propagation repost | Legacy/propagation | Save or Publish (post-transition) | `propagation_repost` — out of FT-3D positive scope except negative guards |
| `repostTarget*` on post | — | Source Reference (FT-3B) | Blocked on authorial path (FT-3A/3C) |

### 6.3 Target write-path semantics (future FT-3D)

Future FT-3D must prove:

- A retention write cannot be classified as `authorial_expression_intent`.
- An authorial expression write cannot be classified as `private_repost_intent`.
- Authorial write does not **require** existing private repost or bookmark on target.
- Combining `saveIntent` + `publishIntent` (or equivalent) on one authorial write is **rejected** (extend FT-3C list).
- Optional: explicit negative that `postType: repost` + `authorialExpressionIntent: true` is rejected.

Future FT-3D must **not**:

- Implement Source Reference or rename `repostTarget*` to SR.
- Eliminate propagation repost writes (WS-2).
- Treat bookmark hydration as retention inventory proof.

### 6.4 Target read-path semantics (bounded)

- Retention rows must not surface as authorial publication on profile/public/group surfaces (FT-5D `notAuthorialPublicationOnSurface` consumed).
- Authorial posts must not display retention dedupe scope semantics as publish proof.
- Read may remain write-bounded for intent rehydration until persistence gate (NR-N1 / PR-N1).

## 7. FT-3D Carve-Out Matrix

### 7.1 Task 5 — Carve-outs

| ID | Domain | Allowed in FT-3D | Forbidden / carved out | Reference |
| --- | --- | --- | --- | --- |
| CO-Q1 | FT-3A/3C | Extend hooks; consume classifiers | Redefine expression/independence acceptance | NR, PR |
| CO-Q2 | FT-3B / P5 | Negative: no SR fields | Any P5 establishment | 13B.3-B §5 |
| CO-Q3 | WS-2 | — | Public/group repost elimination | ZR |
| CO-Q4 | Foundation Trio | Partial WS-3 E6 step only | `foundation_trio_ready` | FT-X3 |
| CO-Q5 | Visibility policy | Inventory only | WS3-P6 resolution | Open gates |
| CO-Q6 | Bookmark impl | Reference FT-1E; E6 negative tests | Reactions schema redesign | FT-1E |
| CO-Q7 | WS-1 retention | Consume P1/P2 classifiers | Re-implement FT-1A | C17 |
| CO-Q8 | OpenAPI/SDK | E9 inventory | Contract-as-proof | F5 |
| CO-Q9 | Frontend | — | Save/publish UX product slice | 13B.3-B §1 |
| CO-Q10 | Persistence | Write-bounded proof OK | DB migration without gate | NR-N1 |
| CO-Q11 | P4 established token | May strengthen bounded proof | Full lifecycle + Trio from FT-3D alone | User invariant |
| CO-Q12 | FT-3C negatives | Extend forbidden keys / classifiers | Claim FT-3D done because T14 exists | PR scope note |
| CO-Q13 | Activity | Retention no-pressure negative | Activity-as-publish proof | FT-1G |
| CO-Q14 | Legacy | WS-5 guards consumed | Hide/delete legacy | FT-5C |
| CO-Q15 | Cutline | FT-3D impl then FT-3B gate | FT-3B before FT-3D JR | 13B.5-D §5.3 CO-17 |

**Especially excluded (user mandate):**

- FT-3B — Source Reference implementation
- WS-2 — public repost elimination
- Visibility policy implementation
- Foundation Trio closure

## 8. Evidence Requirements

Based on FT-X2 (no new evidence classes).

### 8.1 Mandatory at this gate (13B.5-Q)

| E-class | Requirement at gate stage |
| --- | --- |
| **E1** | This report; ZR locks; false-pass F3/F12/F14; save/publish collapse catalog |
| **E2** | PASS/FAIL template; deliverables §11 |
| **E3** | Dual write-path targets declared (not executed) |
| **E5** | Retention vs expression classification targets declared |
| **E6** | Anti-collapse targets declared (§9 FAIL mirror) |
| **E7** | Test plan §8.3 declared |

Prior E2 required:

- FT-3A NR, FT-3C PR, FT-5 LR, WS-1 C17 bundle
- 13B.3-B, 13B.5-C / C2, 13B.5-D

### 8.2 Mandatory at future implementation stage

| E-class | Requirement at impl stage | FT-3D emphasis |
| --- | --- | --- |
| **E3** | **PRIMARY** — separate retention vs expression write paths with classified intents | Retention write ≠ expression write |
| **E5** | **PRIMARY** — proof objects: P1 retention intent vs P4 expression intent | Not carrier rename |
| **E6** | **PRIMARY** — Save≠Publish; Bookmark≠Publish; Retention≠Publish; no cross-dependency | User FAIL list |
| **E7** | **PRIMARY** — §8.3 tests executed | Bounded Space + existing request tests |
| **E4** | SUPPORTING — read surfaces do not treat retention as publication | FT-5D handshake |
| **E8** | SUPPORTING — profile/publication negatives | FT-5D |
| **E2** | Implementation report | Stage after Q |
| **E9** | NEVER-SUFFICIENT alone | OpenAPI field list ≠ split proof |

WS-3 spine contribution (partial):

- Step 6 (E6 retention dedupe vs P4): target **progress toward FILLED**
- Steps 7–8 (P5): **unchanged BLOCKED** — FT-3B
- Step 13 (P4/P5 independent tokens): **not** FILLED by FT-3D alone

### 8.3 E7 test plan (declared at gate — execution deferred)

| ID | Intent |
| --- | --- |
| T1 | Private repost write classifies `private_repost_intent` only (Save) |
| T2 | Authorial write classifies `authorial_expression_intent` only (Publish) |
| T3 | Same user: retention on target does not block authorial post on related target (dedupe) |
| T4 | Authorial write rejects combined save+publish body keys |
| T5 | Authorial write does not require pre-existing private repost |
| T6 | Private repost write rejects `authorialExpressionIntent: true` (if applicable) |
| T7 | Bookmark dedupe path not consulted for retention dedupe (FT-1E negative) |
| T8 | Retention write does not emit propagation activity (existing behavior regression) |
| T9 | Profile read: private retention not `notAuthorialPublicationOnSurface` failure for authorial |
| T10 | `postType: post` without authorial flag ≠ publish proof (ZR) |
| T11 | `repostTarget*` on authorial path still rejected (SR negative) |
| T12 | Legacy propagation repost ≠ save and ≠ authorial publish |
| T13 | E6 object: `notSavePublishDependent` backed by classifier logic (fix PR-N3 stub if needed) |
| T14 | OpenAPI presence alone does not pass (F5) |

Suggested execution surface:

- `savePublishBoundary.ts` (or bounded extension of `authorialIndependence.ts`);
- `savePublishBoundary.test.ts`;
- hooks in `spaceService.ts` `createPost`;
- extend `request.test.ts` HTTP negatives;
- **no** FT-3B fields; **no** WS-2.

### 8.4 Insufficient evidence (must not pass FT-3D review)

| Evidence type | Verdict |
| --- | --- |
| FT-3C `FORBIDDEN_SAVE_PUBLISH_BODY_KEYS` alone | INSUFFICIENT — partial negative only |
| FT-3A expression path alone | INSUFFICIENT — no dual-intent proof |
| UI copy "Save" / "Publish" | INSUFFICIENT (F6) |
| Bookmark hydration on Saved UI | INSUFFICIENT as retention proof |
| Private repost row count as authorial output | INSUFFICIENT (F12 analog) |
| OpenAPI/SDK only | INSUFFICIENT (F5) |

## 9. PASS Criteria

### 9.1 Task 7 — After future FT-3D implementation

The slice passes only if all are true:

1. Dual write-path intent classifiers operational for retention (Save) vs expression (Publish) (E3).
2. E5 classification proofs distinguish P1 retention intent from P4 expression intent — not visibility label alone.
3. E6 negatives pass: Save≠Publish; Bookmark≠Publish; Retention≠Publish; Publish does not depend on Save; Save does not depend on Publish.
4. E7 tests §8.3 executed and passing (including HTTP layer where applicable).
5. FT-3A/3C paths preserved; no regression on independence or expression acceptance criteria.
6. Retention dedupe scope does not block authorial expression path (FT-1D / forbiddenTransformations).
7. No Source Reference implementation in FT-3D diff.
8. No WS-2 elimination in FT-3D diff.
9. E2 report with scope, carve-outs §7, forbidden scope verification.
10. Tokens: `source_reference_runtime_primitive_established: FALSE`, `foundation_trio_ready: FALSE`, `ws2_authorized: FALSE`.
11. `authorial_post_runtime_primitive_established` may remain bounded TRUE only if JR accepts — FT-3D does not auto-grant full P4 lifecycle.
12. FT-3B not claimed complete in FT-3D report.
13. False Evidence F3/F12/F14/F5/F19 not triggered.
14. WS-3 spine step 6 (E6 retention vs expression) marked progress in E2 — not Trio closure.

PASS token for implementation review stage:

`FT_3D_IMPLEMENTATION_COMPLETE` (separate JR stage decides any establishment token upgrade)

## 10. FAIL Criteria

### 10.1 Task 8 — Implementation fails if any condition holds

| ID | FAIL condition | Collapse / risk |
| --- | --- | --- |
| F-Q1 | **Save = Publish** — same write classifies as both retention and expression | Core WS3-P4 failure |
| F-Q2 | **Bookmark = Publish** — bookmark write treated as authorial publication | P3→P4 collapse |
| F-Q3 | **Bookmark = Save** — bookmark creates Space private repost row | P3→P1 collapse |
| F-Q4 | **Retention = Publish** — private repost surfaces as authorial publication | P1→P4 collapse |
| F-Q5 | **Publish depends on Save** — authorial write requires prior private repost/bookmark | Dependency inversion |
| F-Q6 | **Save depends on Publish** — retention write requires authorial post | Dependency inversion |
| F-Q7 | **Source Reference hidden inside Save/Publish** — `repostTarget*` or SR-shaped fields in FT-3D diff | FT-3B creep |
| F-Q8 | Scope includes FT-3B or WS-2 | Scope creep |
| F-Q9 | Scope includes visibility policy implementation | CO-Q5 |
| F-Q10 | Report claims `foundation_trio_ready: TRUE` | F1 |
| F-Q11 | Report claims `ws2_authorized: TRUE` | F18 |
| F-Q12 | Report claims `source_reference_runtime_primitive_established: TRUE` | P5 false pass |
| F-Q13 | Only FT-3C forbidden keys extended; no dual-intent classifier | Partial negative false pass |
| F-Q14 | Retention dedupe blocks authorial path | FT-1D regression |
| F-Q15 | E7 missing or only generic `createPost` tests | F16 analog |
| F-Q16 | Gate interpreted as coding permission without E2 PASS | Gate invariant |
| F-Q17 | OpenAPI/SDK cited without E3+E5+E6 | F5 |
| F-Q18 | UI copy change only | F6 |
| F-Q19 | Bounded P4/independence from NR/PR revoked without JR | Regression |

FAIL token:

`FT_3D_IMPLEMENTATION_FAILED` or `FT_3D_IMPLEMENTATION_BLOCKED`

## 11. Expected Implementation Deliverables

Future implementation stage (not executed in 13B.5-Q) must produce:

| # | Deliverable | E-class |
| --- | --- | --- |
| D1 | FT-3D implementation report | E2 |
| D2 | Save/publish boundary domain module (or bounded extension) | E3/E5 |
| D3 | Write/read hooks in `spaceService.ts` | E3/E8 |
| D4 | Automated tests per §8.3 | E7 |
| D5 | Traceability matrix (intent classifier → proof → test) | E5 |
| D6 | Carve-out verification + NR-N1/PR-N1 persistence note | E2 |
| D7 | Final tokens | E1 |

Not expected:

- Source Reference fields (FT-3B);
- WS-2 route elimination;
- Foundation Trio closure report;
- OpenAPI bundle as primary proof;
- DB migration (unless separate gate);
- Reactions bookmark reimplementation.

Recommended impl token (future stage only):

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_3D_SAVE_PUBLISH_BOUNDARY_ONLY`

## 12. Authorization Verdict

### 12.1 Gate authorization

Final verdict:

**`FT_3D_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS`**

Why authorized:

- FT-3A **accepted** with bounded P4 (NR);
- FT-3C **accepted** with bounded independence (PR);
- WS-5 Phase A **complete** — legacy publication false-pass mitigated;
- WS-1 retention + bookmark separation **established** (FT-1A/1E);
- 13B.5-D cutline places FT-3D **after FT-3A/FT-3C**, **before FT-3B**;
- 13B.3-B save/publish split is **defined** and testable;
- FT-X2 permits E3+E5+E6+E7 bounded slice;
- Partial FT-3C negative proves gate is **not** starting from zero — but is **not** sufficient alone.

Why with conditions (not unqualified):

- **PR-N3 / FT-3C:** `notSavePublishDependent` in proof object may be stub — FT-3D must back with classifier logic;
- **NR-N1 / PR-N1:** intent not persisted in DB — save/publish read proof may remain write-bounded;
- **NR-N2:** `authorialExpressionIntent` not in OpenAPI;
- **Product UX:** ContentActionRow save/publish flows not in Space-service slice;
- **CO-Q11:** FT-3D does not auto-grant Trio, SR, WS-2, or full P4 lifecycle;
- **FT-3B still separate** after FT-3D JR per CO-17.

Why not blocked:

- FT-3A + FT-3C provide required expression + independence foundation;
- Save/publish conflation is explicit deferred gap from 13B.3-B and PR;
- Collapse risks addressable in bounded Space-service slice without SR/WS-2.

### 12.2 Authorization tokens (this stage)

| Token | Value |
| --- | --- |
| Gate opened | `TRUE` |
| Implementation authorized (this stage) | `FALSE` |

Gate conditions:

`FT_3A_ACCEPTED,FT_3C_ACCEPTED,P4_BOUNDED_ESTABLISHED_WITH_CONDITIONS,AUTHORIAL_INDEPENDENCE_ESTABLISHED_WITH_CONDITIONS,WS5_PHASE_A_COMPLETE,WS1_RETENTION_BOOKMARK_BASELINE,WS3_P4_PLANNING_ACCEPTED,CONSUME_FT_3A_FT_3C_FT_5,ZR_POSTTYPE_POST_LOCK,NR_N1_PR_N1_PERSISTENCE_CARVE_OUT,NR_N2_OPENAPI_INVENTORY,FT_3C_NEGATIVE_KEYS_NOT_SUFFICIENT,FT_3B_NOT_IN_SCOPE,WS2_NOT_IN_SCOPE,TRIO_NOT_IN_SCOPE,NO_SR_NO_VISIBILITY_POLICY`

## 13. Next Safe Step

Recommended next stage:

**`Stage 13B.5-R — FT-3D Save/Publish Implementation`**

Scope:

- bounded coding slice per this gate;
- deliverables §11;
- impl token `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_3D_SAVE_PUBLISH_BOUNDARY_ONLY` (issued at implementation stage start, not here).

After FT-3D implementation + JR:

**`Stage 13B.5-S (proposed) — FT-3B Source Reference Implementation Authorization Gate`**

(per cutline CO-17 — only after FT-3D review acceptance).

Not safe next:

- FT-3D coding without reading this gate;
- FT-3B before FT-3D JR;
- claiming Foundation Trio ready, Source Reference established, or WS-2 authorized;
- treating gate authorization as implementation complete.

## 14. Final Tokens

```yaml
stage_13B_5_Q_status: FT_3D_IMPLEMENTATION_GATE_COMPLETE
stage_13B_5_Q_execution_mode: GOVERNANCE_SLICE_AUTHORIZATION_GATE_ONLY
stage_13B_5_Q_verdict: FT_3D_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS
stage_13B_5_Q_gate_authorized: TRUE
stage_13B_5_Q_implementation_authorized: FALSE
stage_13B_5_Q_ft_3a_prerequisite: ACCEPTED
stage_13B_5_Q_ft_3c_prerequisite: ACCEPTED
stage_13B_5_Q_p4_state: P4_BOUNDED_RUNTIME_PRIMITIVE_ESTABLISHED_WITH_CONDITIONS
stage_13B_5_Q_authorial_independence_state: AUTHORIAL_INDEPENDENCE_ESTABLISHED_WITH_CONDITIONS
stage_13B_5_Q_authorial_post_runtime_primitive_established: TRUE  # bounded carry-forward NR/PR; not full lifecycle
stage_13B_5_Q_source_reference_runtime_primitive_established: FALSE
stage_13B_5_Q_foundation_trio_ready: FALSE
stage_13B_5_Q_ws2_authorized: FALSE
stage_13B_5_Q_ws3_spine_step_4_e3_authorial_write: FILLED  # FT-3A
stage_13B_5_Q_ws3_spine_step_5_independence: FILLED_BOUNDED  # FT-3C PR
stage_13B_5_Q_ws3_spine_step_6_save_publish_split: AUTHORIZATION_TARGET  # FT-3D impl fills
stage_13B_5_Q_gate_conditions: FT_3A_ACCEPTED,FT_3C_ACCEPTED,P4_BOUNDED,AUTHORIAL_INDEPENDENCE_BOUNDED,WS5_PHASE_A_COMPLETE,WS1_BASELINE,WS3_P4_ACCEPTED,FT_3C_NEGATIVE_NOT_SUFFICIENT,FT_3B_NOT_IN_SCOPE,WS2_NOT_IN_SCOPE,TRIO_NOT_IN_SCOPE
stage_13B_5_Q_next_safe_step: STAGE_13B_5_R_FT_3D_SAVE_PUBLISH_IMPLEMENTATION
stage_13B_5_Q_recommended_impl_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_3D_SAVE_PUBLISH_BOUNDARY_ONLY
```

## Execution Summary

| Item | Value |
| --- | --- |
| Report | `docs/reports/stage_13B_5_Q_ft_3D_save_publish_implementation_authorization_gate_v1.md` |
| Verdict | `FT_3D_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` |
| FT-3A + FT-3C sufficient for gate? | **YES** |
| Gate authorized | **TRUE** |
| Implementation authorized (this stage) | **FALSE** |
| P4 / independence | Bounded established (NR/PR); save/publish split deferred to FT-3D impl |
| Source Reference / Trio / WS-2 | **FALSE** |
| Next step | **13B.5-R** — FT-3D Implementation (do not execute now) |

### Save/publish boundary summary

**Save** = owner retention (`private_repost_intent`, P1). **Publish** = authorial expression (`authorial_expression_intent`, P4). **Bookmark** = Reactions fact (P3), orthogonal to both. FT-3D must prove dual-intent separation and anti-dependency — not merely reject a few JSON keys (FT-3C partial negative).

### Carve-outs (short)

FT-3B, WS-2, visibility policy, Foundation Trio closure, OpenAPI-as-proof, frontend product flows, DB migrations without gate.

### PASS / FAIL (short)

**PASS:** E3+E5+E6+E7 dual-intent proofs; no Save=Publish collapse; tokens SR/Trio/WS-2 remain FALSE.  
**FAIL:** Any collapse in user FAIL list; SR inside save/publish; scope creep to FT-3B/WS-2/Trio; FT-3C negatives alone as false pass.

### Agents used

7/7 mandated: Program Director, Slice Strategist, Runtime Governance Architect, Runtime Validation Agent, Backend Developer (review), QA Agent, Technical Canon Writer.

### Invariants (preserved)

```
FT-3D Gate Authorized ≠ FT-3D Implemented
FT-3D Implemented ≠ Source Reference Established
Source Reference Established ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
FT-3A/3C Accepted ≠ Foundation Trio Ready
P4 Bounded Established ≠ Source Reference Established
```
