# Stage 13B.5-NR — FT-3A Implementation Review & Acceptance

## 1. Inputs Reviewed

Execution mode:

- `REVIEW_AND_ACCEPTANCE_ONLY`
- no coding;
- no implementation fixes;
- findings recorded only.

Multi-agent mode:

- activated before this review using `docs/ai` role model (readonly);
- Slice Strategist + Runtime Governance Architect: scope, P4 establishment boundary, WS-5 consumption;
- Runtime Validation Agent: E3 write path, read guards, test execution.

Governance documents:

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_N_ft_3A_authorial_expression_implementation_v1.md` | Implementation under review |
| `docs/reports/stage_13B_5_M_ft_3A_authorial_expression_implementation_authorization_gate_v1.md` | PASS/FAIL (14/18), E7 plan, carve-outs |
| `docs/reports/stage_13B_5_LR_ft_5D_implementation_review_and_acceptance_v1.md` | WS-5 Phase A accepted baseline |
| `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` | P4/P5/Trio boundaries |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | E3/E5 spine |
| `docs/reports/stage_13B_3_B_authorial_post_and_source_reference_runtime_specification_v1.md` | Authorial canon |
| `docs/reports/stage_13B_4_ZR_audit_review_and_canon_lock_v1.md` | `postType: post` ≠ establishment |

Code inspected (read-only):

| Path | Role |
| --- | --- |
| `apps/space-service/src/domain/authorialExpression.ts` | FT-3A domain module |
| `apps/space-service/test/authorialExpression.test.ts` | E7 T1–T12 |
| `apps/space-service/src/services/spaceService.ts` | E3 hooks, `mapPostResponse` read chain |
| `apps/space-service/test/request.test.ts` | HTTP integration |
| `apps/space-service/src/domain/retentionIntent.ts` | P1/P2 unchanged |
| `apps/space-service/src/domain/perSurfaceLegacyMatrix.ts` | FT-5D consumer |
| `apps/space-service/src/domain/legacyDistinction.ts` | distinction on read |
| `apps/space-service/test/forbiddenTransformations.test.ts` | WS-5 regression (executed) |
| `apps/space-service/test/perSurfaceLegacyMatrix.test.ts` | WS-5 regression (executed) |

Git context:

| Field | Value |
| --- | --- |
| Branch | `feat/stage-13b5-ft5a-ft5b-ws5-legacy-distinction` |
| Commit under review | `2dd6f77` — FT-3A implementation |
| Diff scope | 4 code files + 4 governance reports in commit; FT-5 domain logic files **not modified** |

## 2. Scope Compliance Review

| Check | Result | Evidence |
| --- | --- | --- |
| Only FT-3A | PASS | New `authorialExpression.ts`; bounded `spaceService` hooks only |
| Authorial Expression Boundary only | PASS | Intent + text role + P4 proof; no SR fields |
| No FT-3B / FT-3C / FT-3D | PASS | No source reference, independence slice, save/publish split |
| No WS-2 | PASS | No route elimination or repost policy change |
| No migrations / DB | PASS | `insertSpacePost` shape unchanged |
| No OpenAPI / SDK | PASS | No `packages/openapi` or SDK diff in commit |
| No UI / PWA | PASS | No frontend diff |
| FT-5A–5D not redefined | PASS | `git diff 165f368..2dd6f77 -- apps/space-service/src/domain/` shows only `authorialExpression.ts` added |
| Carve-outs CO-2/3/5/7/10/13 | PASS | See §12 |

**Scope compliance: PASS**

## 3. E3 Write Path Review

| Requirement | Result | Evidence |
| --- | --- | --- |
| Real `POST /v1/space/posts` | PASS | `createPost` in `spaceService.ts` |
| Explicit authorial opt-in | PASS | `parseAuthorialExpressionIntentFromBody` requires `authorialExpressionIntent === true` |
| Generic `postType: post` without intent | PASS | `creates a post and materializes outgoing activity projection` — body has no intent flag; `classifyAuthorialExpressionWriteIntent` returns null |
| Intent on repost rejected | PASS | HTTP 400 + `assertAuthorialExpressionIntentNotOnRepost` |
| `repostTarget*` on authorial path rejected | PASS | `assertAuthorialWriteRejectsSourceReferenceCollapse`; HTTP test uses existing `repost target fields are only allowed for repost` validation (CO-2 still blocked) |
| Write asserts before insert | PASS | `assertAuthorialExpressionWrite` try/catch → 400 |
| Not projection-only | PASS | E3 is create route, not feed label |

**E3 write path: PASS**

## 4. Authorial Intent Review

| Requirement | Result | Evidence |
| --- | --- | --- |
| `authorial_expression_intent` exists | PASS | `AUTHORIAL_EXPRESSION_WRITE_INTENT` constant |
| ≠ `private_repost_intent` | PASS | Separate modules; T3 |
| Not inferred from `postType: post` alone | PASS | `classifyAuthorialExpressionWriteIntent` returns null without boolean flag |
| Not inferred from read/projection label | PASS | Read uses `assertAuthorialReadCarrier` on carrier shape; no feed label classifier |

**Authorial intent layer: PASS**

## 5. Authorial Text Role Review

| Requirement | Result | Evidence |
| --- | --- | --- |
| `authorial_text` only with explicit intent | PASS | `classifyAuthorialTextRole` gates on `authorialExpressionIntent` |
| `private_note` ≠ `authorial_text` | PASS | T5; `classifyRepostTextRole` vs `classifyAuthorialTextRole` |
| `propagation_commentary` ≠ `authorial_text` | PASS | T4 |
| Legacy commentary path unchanged | PASS | Repost text roles remain in `retentionIntent` / FT-5B |

**Authorial text role: PASS**

## 6. E5 P4 Classification Proof Review

| Requirement | Result | Evidence |
| --- | --- | --- |
| Proof object exists | PASS | `buildAuthorialP4ClassificationProof` |
| Proof ≠ `postType: post` alone | PASS | `isP4ClassificationProof` requires intent + `authorial_text`; T9/T10 |
| No final P4 runtime establishment in code | PASS | Type literal `isAuthorialPostRuntimePrimitiveEstablished: false`; runtime assert at CO-13 |
| Bounded write proof | PASS | T2 |

**E5 classification proof: PASS (bounded)**

## 7. E6 Negatives Review

| Negative | Result | Evidence |
| --- | --- | --- |
| P1 ≠ P4 | PASS | T3 |
| P2 ≠ P4 (private note text) | PASS | T5 |
| P6 ≠ P4 (legacy commentary) | PASS | T4 |
| `repostTarget*` ≠ Source Reference | PASS | T6 + read guard E6 test |
| Legacy row ≠ Authorial Post | PASS | T12; `assertAuthorialReadCarrier` throws on `legacy_carve_out` |

**E6 negatives: PASS**

## 8. WS-5 Stack Consumption Review

| Requirement | Result | Evidence |
| --- | --- | --- |
| FT-5A–5D logic unchanged | PASS | Commit diff excludes taxonomy/distinction/forbidden/matrix files |
| Repost reads use WS-5 | PASS | `applyAuthorialExpressionReadGuards` → `applyFt5SurfaceLegacyGuards` for `postType: repost` |
| Legacy not promoted to P4 | PASS | Read guard blocks legacy carve-out on post carrier; FT-5C proofs unchanged |
| Authorial post carrier on profile | PASS | T7 — `target_standard_post_carrier` |

**WS-5 consumption: PASS**

## 9. Runtime Behavior Safety Review

| Surface | Changed? | Result |
| --- | --- | --- |
| HTTP response DTO (`mapPostResponse`) | No new fields | PASS |
| Visibility rules | Unchanged | PASS |
| Feed SQL queries | Unchanged | PASS |
| Write path | Bounded intent validation only | PASS |
| Event payload | Optional `authorialExpressionIntent` / `authorialTextRole` on emit | PASS — internal staging only; **not** API proof (F-5) |
| Request body | New optional `authorialExpressionIntent` boolean | NOTE NR-N2 — undocumented in OpenAPI (gate CO-9 inventory; acceptable for bounded slice) |

**Runtime behavior safety: PASS**

## 10. Validation Results

Executed at review time (2026-05-31):

```bash
pnpm --filter @go2asia/space-service typecheck
# PASS

pnpm --filter @go2asia/space-service test -- \
  authorialExpression.test.ts \
  perSurfaceLegacyMatrix.test.ts \
  forbiddenTransformations.test.ts \
  legacyTaxonomy.test.ts \
  legacyDistinction.test.ts \
  request.test.ts
# 120/120 PASS

git diff --check
# PASS (no whitespace errors on tracked diff)
```

| Check | Result |
| --- | --- |
| typecheck | PASS |
| tests | **120/120 PASS** |
| `git diff --check` | PASS |

## 11. PASS / FAIL Criteria Review (Stage 13B.5-M)

### 11.1 PASS criteria (14/14)

| # | Criterion | Review |
| --- | --- | --- |
| 1 | Bounded authorial write + intent classifier (E3) | PASS |
| 2 | P4 classification proof — not carrier rename (E5) | PASS |
| 3 | E6 negatives | PASS |
| 4 | E7 §7.3 executed | PASS (13 + 3 HTTP) |
| 5 | WS-5 consumed; no legacy → P4 | PASS |
| 6 | No `repostTarget*` on authorial path | PASS |
| 7 | No Source Reference in diff | PASS |
| 8 | E2 report (13B.5-N) | PASS |
| 9 | `foundation_trio_ready: FALSE` | PASS |
| 10 | `ws2_authorized: FALSE` | PASS |
| 11 | `source_reference_runtime_primitive_established: FALSE` | PASS |
| 12 | Gate-stage P4 ESTABLISHED not claimed in impl alone | PASS — JR now decides |
| 13 | FT-3B/3D not claimed | PASS |
| 14 | WS-3 spine step 4 progress (E3) | PASS — partial FILLED |

### 11.2 FAIL criteria (18/18 not triggered)

| ID | Triggered? | Notes |
| --- | --- | --- |
| F-1 | NO | Generic post without intent still carrier-only |
| F-2 | NO | Private note / commentary not authorial_text |
| F-3 | NO | Legacy rows not authorial posts |
| F-4 | NO | E3 write required for proof |
| F-5 | NO | OpenAPI not cited as proof |
| F-6 | NO | repostTarget blocked on post |
| F-7 | NO | No FT-3B/3D scope |
| F-8 | NO | No WS-2 |
| F-9 | NO | No hide/delete legacy |
| F-10 | NO | No `foundation_trio_ready: TRUE` |
| F-11 | NO | No `ws2_authorized: TRUE` |
| F-12 | NO | Impl code hard-codes establishment false |
| F-13 | NO | No visibility policy |
| F-14 | NO | FT-5 not redefined |
| F-15 | NO | Dedicated E7 suite present |
| F-16 | N/A | Gate-stage only |
| F-17 | N/A | Gate-stage only |
| F-18 | NO | Dedupe does not block authorial path (T8) |

**PASS/FAIL matrix: 14 PASS / 0 FAIL**

## 12. Acceptance Verdict

### 12.1 Findings (non-blocking)

| ID | Severity | Finding |
| --- | --- | --- |
| NR-N1 | NOTE | **Authorial intent is not persisted in DB.** Read path cannot rehydrate `authorial_expression_intent` from stored row alone; E5 proof is **write-bounded** + event staging. Acceptable per gate (no migrations); limits full read-time P4 re-classification until a future persistence gate. |
| NR-N2 | NOTE | Request field `authorialExpressionIntent` is not in OpenAPI/SDK (CO-9 inventory). Bounded slice acceptable; document for client adoption. |
| NR-N3 | NOTE | HTTP CO-2 negative for `repostTarget` on post hits generic validation message before FT-3A assert — behavior still correct (400). |
| NR-N4 | NOTE | `applyAuthorialExpressionReadGuards` runs on **all** `postType: post` reads as carrier shape guard (`target_standard_post_carrier`), not only rows created with authorial intent — safe negative reinforcement, not authorial establishment on read. |

No blocking findings. No scope creep. No hidden P4 establishment in code.

### 12.2 Verdict

**`FT_3A_IMPLEMENTATION_ACCEPTED_WITH_NOTES`**

Rationale:

- All 14 PASS criteria satisfied;
- Zero FAIL criteria triggered;
- Explicit authorial write path and classifiers verified;
- ZR invariant preserved (`postType: post` alone ≠ Authorial Post);
- WS-5 stack intact and consumed;
- NR-N1–N4 are carry-forward conditions, not rejections.

Not `REJECTED` or `REVIEW_REQUIRED` — evidence is complete and tests green.

Not unqualified `ACCEPTED` — persistence and OpenAPI inventory notes require explicit conditions on P4 token.

## 13. P4 Establishment Decision

Question: After NR, can bounded Authorial Post runtime primitive be considered **ESTABLISHED**?

**Decision: `P4_BOUNDED_RUNTIME_PRIMITIVE_ESTABLISHED_WITH_CONDITIONS`**

| Condition | Status |
| --- | --- |
| Write path + explicit intent classifier operational | YES |
| Authorial Text role on write | YES |
| E5 bounded proof object | YES |
| E6/E7 evidence | YES |
| Read can rehydrate authorial intent from DB alone | **NO** (NR-N1) |
| Full P4 independence (FT-3C) | **NO** — deferred |
| Source Reference (P5) | **NO** |
| Foundation Trio ready | **NO** |
| OpenAPI/SDK as contract proof | **NO** |

Interpretation:

- **Bounded P4 expression primitive** at Space-service runtime is **established for write + classification semantics**, not for full Authorial Post lifecycle or Trio closure.
- `isAuthorialPostRuntimePrimitiveEstablished` in code correctly remains `false` as implementation guard; governance token may be **TRUE (bounded)** at NR layer with NR-N1 disclaimer.

**P4 bounded established does not imply Foundation Trio ready.**

## 14. Next Safe Step

1. **Lock FT-3A acceptance** — use tokens in §15; do not claim Trio/WS-2/SR.
2. **Stage 13B.5-O or cutline next gate** — per `13B.5-D`:
   - **FT-3C** (Authorial independence / WS3-P3), or
   - **FT-3D** (save/publish split), before **FT-3B** (Source Reference) per CO-17.
3. Optional follow-up (separate gate, not NR fix): persist `authorialExpressionIntent` or equivalent governance metadata if read-time P4 proof is required.

## 15. Final Tokens

```yaml
stage_13B_5_NR_status: ACCEPTED
stage_13B_5_NR_ft_3a_accepted: TRUE
stage_13B_5_NR_ft_3a_implementation_verdict: FT_3A_IMPLEMENTATION_ACCEPTED_WITH_NOTES
stage_13B_5_NR_p4_establishment_decision: P4_BOUNDED_RUNTIME_PRIMITIVE_ESTABLISHED_WITH_CONDITIONS
stage_13B_5_NR_authorial_post_runtime_primitive_established: TRUE  # bounded write-path primitive only; see NR-N1
stage_13B_5_NR_source_reference_runtime_primitive_established: FALSE
stage_13B_5_NR_foundation_trio_ready: FALSE
stage_13B_5_NR_ws2_authorized: FALSE
```

Carry-forward notes for next gate:

- NR-N1: no DB persistence of authorial intent
- NR-N2: OpenAPI/SDK field inventory pending
- NR-N4: read guards are carrier-shape safety, not read-time authorial establishment

## Execution Summary

| Deliverable | Status |
| --- | --- |
| Report file | `docs/reports/stage_13B_5_NR_ft_3A_implementation_review_and_acceptance_v1.md` |
| Verdict | `FT_3A_IMPLEMENTATION_ACCEPTED_WITH_NOTES` |
| P4 decision | `P4_BOUNDED_RUNTIME_PRIMITIVE_ESTABLISHED_WITH_CONDITIONS` |
| Tests | 120/120 PASS |
| Next step | FT-3C or FT-3D gate per cutline; not FT-3B before independence/save-publish policy |

### Invariants (preserved)

```
FT-3A Accepted ≠ Foundation Trio Ready
P4 Bounded Established ≠ Source Reference Established
Source Reference Established ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
