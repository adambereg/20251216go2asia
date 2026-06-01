# Stage 13B.5-R — FT-3D Save/Publish Implementation

## 1. Scope Verification

Execution mode:

- `BOUNDED_IMPLEMENTATION_SLICE_FT_3D_ONLY`
- authorization: `FT_3D_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` (13B.5-Q)
- prerequisites: FT-3A accepted (NR); FT-3C accepted (PR); WS-5 Phase A complete

Scope confirmation:

| Check | Result |
| --- | --- |
| FT-3D Save/Publish boundary only | PASS |
| No FT-3B / WS-2 | PASS |
| No Source Reference implementation | PASS — `repostTarget*` rejected on publish path |
| No visibility policy | PASS |
| No Foundation Trio closure | PASS — proof tokens hard-coded FALSE |
| No migrations / OpenAPI / SDK / UI | PASS |
| No bookmark / Reactions redesign | PASS — structural P3 negatives only |
| FT-3A / FT-3C / FT-5 consumed, not replaced | PASS |
| Save uses `private_repost_intent` (no new primitive) | PASS |
| Publish uses `authorial_expression_intent` (no new primitive) | PASS |

## 2. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/domain/savePublishBoundary.ts` | **NEW** — dual-intent boundary module |
| `apps/space-service/test/savePublishBoundary.test.ts` | **NEW** — E7 T1–T14 |
| `apps/space-service/src/domain/authorialIndependence.ts` | **MODIFIED** — E6 `notSavePublishDependent` from FT-3D; forbidden keys re-export |
| `apps/space-service/src/services/spaceService.ts` | **MODIFIED** — `assertSavePublishBoundaryWrite`; event `savePublishBoundary` |

Files not changed:

- `authorialExpression.ts` (FT-3A regression preserved)
- FT-5A–5D modules
- OpenAPI, SDK, DB schema, Reactions service

## 3. Save/Publish Boundary Module

Module: `savePublishBoundary.ts`

| Capability | Purpose |
| --- | --- |
| `SAVE_PUBLISH_BOUNDARY_CLASSIFIER` | Canonical dual-intent classifier token |
| `classifySaveIntent` | Maps Save → `private_repost_intent` (P1) |
| `classifyPublishIntent` | Maps Publish → `authorial_expression_intent` (P4) |
| `buildSaveIntentProof` / `buildPublishIntentProof` | E5 per-intent proofs |
| `buildDualIntentBoundaryProof` | E5 dual-intent proof object |
| `buildSavePublishNegativesProof` | E6 collapse negatives |
| `assertSavePublishBoundaryWrite` | Write-path gate (after FT-3A + FT-3C) |
| `assertNoForbiddenDualIntentBodyFields` | Combined / dependency body key rejection |
| `classifySavePublishBoundary` | Classifier when save or publish path active |

## 4. Save Intent Layer

Save intent is **not** a new primitive. It reuses WS-1 retention classification:

- `postType: repost` + `visibility: private` → `classifyRepostWriteIntent` → `private_repost_intent`
- `SaveIntentProof.isSaveIntent` true only on that path
- `isNotPublishIntent` requires `authorialExpressionIntent` false
- Retention dedupe scope remains `retention` in `spaceService` (unchanged)

## 5. Publish Intent Layer

Publish intent reuses FT-3A expression classification:

- `postType: post` + `authorialExpressionIntent: true` → `authorial_expression_intent`
- `PublishIntentProof.isPublishIntent` true only on that path
- `isNotSaveIntent` requires `postType: post` (not repost carrier)
- No `requiresPriorSave` / `requiresSave` body keys permitted

## 6. E3 Dual Write Paths

| Path | Write evidence |
| --- | --- |
| Save (retention) | Private repost create; `assertSavePublishBoundaryWrite` on repost+private |
| Publish (expression) | Authorial post create with opt-in flag; boundary after FT-3A/3C |
| Orthogonality | Same request cannot carry both intents; `authorialExpressionIntent` blocked on repost in `spaceService` |
| Dedupe | Authorial `post` path does not enter retention dedupe query (existing + `assertDedupeScopeNotBlockingAuthorial`) |

Event staging: `savePublishBoundary` field on create emit when classifier active.

## 7. E5 Boundary Proof

`DualIntentBoundaryProof` fields:

| Field | Meaning |
| --- | --- |
| `saveIntentProof` / `publishIntentProof` | Underlying intents (P1 / P4 classifiers) |
| `saveNotEqualsPublish` | Single write cannot be both |
| `publishNotEqualsSave` | Mutual exclusion |
| `bookmarkNotPublish` / `bookmarkNotSave` | P3 structural separation (true) |
| `retentionNotPublish` | Save path ≠ publish semantics |
| `publishDoesNotRequireSave` | No requires* save keys on body |
| `saveDoesNotRequirePublish` | No requires* publish keys on body |
| `noSourceReferenceHiddenInSavePublish` | No `repostTarget*` on publish path |
| `isDualIntentBoundaryProof` | Aggregate PASS |
| `isFoundationTrioReady` / `isSourceReferenceEstablished` | **false** (CO-Q11) |

## 8. E6 Negatives

| Negative | Implementation |
| --- | --- |
| Save = Publish | Reject same-write dual intent; repost+authorial flag blocked |
| Publish = Save | Publish requires `post` carrier; save requires repost+private |
| Bookmark = Publish / Save | `bookmarkNotPublish` / `bookmarkNotSave` always true (P3 not Space write) |
| Retention = Publish | `retentionNotPublish` on save path |
| Publish requires Save | `PUBLISH_REQUIRES_SAVE_BODY_KEYS` rejected |
| Save requires Publish | `SAVE_REQUIRES_PUBLISH_BODY_KEYS` rejected |
| SR hidden in save/publish | `assertNoSourceReferenceOnPublishPath` (CO-Q2) |
| FT-3C stub fixed | `authorialIndependence` `notSavePublishDependent` uses `buildSavePublishNegativesProof` |

## 9. E7 Tests

| ID | Test | File |
| --- | --- | --- |
| T1 | Save intent | `savePublishBoundary.test.ts` |
| T2 | Publish intent | `savePublishBoundary.test.ts` |
| T3 | Dedupe independence | `savePublishBoundary.test.ts` |
| T4 | Combined intent reject | `savePublishBoundary.test.ts` |
| T5 | Publish without save | `savePublishBoundary.test.ts` |
| T6 | Save without publish | `savePublishBoundary.test.ts` |
| T7 | Bookmark negative | `savePublishBoundary.test.ts` |
| T8 | Activity regression | `savePublishBoundary.test.ts` |
| T9 | Profile publication boundary | `savePublishBoundary.test.ts` |
| T10 | postType carrier negative | `savePublishBoundary.test.ts` |
| T11 | SR negative | `savePublishBoundary.test.ts` |
| T12 | Legacy propagation negative | `savePublishBoundary.test.ts` |
| T13 | E6 proof object | `savePublishBoundary.test.ts` |
| T14 | OpenAPI negative | `savePublishBoundary.test.ts` |

HTTP regressions: existing `request.test.ts` (save/publish fields, retention, bookmark dedupe, authorial) — **50/50 PASS**.

## 10. FT-X1 Compliance

| Collapse edge | Guard |
| --- | --- |
| Private Repost → Authorial Post | Save vs publish classifiers mutually exclusive |
| Bookmark → Private Repost / Authorial Post | Structural negatives; no Reactions changes |
| `repostTarget*` → Source Reference | CO-Q2 on publish path |
| `postType: post` alone → P4 | Publish requires `authorialExpressionIntent` |

## 11. FT-X2 Compliance

| WS-3 spine step | Progress |
| --- | --- |
| E3 authorial write (step 4) | FILLED (FT-3A, unchanged) |
| E5 independence (step 5) | FILLED bounded (FT-3C) |
| E6 retention vs expression (step 6) | **PROGRESS → bounded FILLED** for Space-service slice |
| P5 / Trio / WS-2 | BLOCKED (unchanged) |

## 12. Carve-Out Verification

| ID | Result |
| --- | --- |
| CO-Q2 (no SR in FT-3D) | PASS |
| CO-Q3 (no WS-2) | PASS |
| CO-Q5 (no visibility policy) | PASS |
| CO-Q10 (no DB migration) | PASS |
| CO-Q11 (no Trio/SR token upgrade) | PASS |
| CO-Q15 (FT-3B after FT-3D JR) | PASS — no FT-3B in diff |

**Carve-out stage verdict: PASS**

## 13. Validation Results

| Check | Result |
| --- | --- |
| `npm run test` (space-service) | **151/151 PASS** |
| `npm run typecheck` (space-service) | **PASS** |
| `git diff --check` | **PASS** (no whitespace errors) |

## 14. PASS / FAIL Assessment

Mapped to Stage 13B.5-Q PASS criteria (§9):

| # | Criterion | Result |
| --- | --- | --- |
| 1 | Dual write-path classifiers (E3) | PASS |
| 2 | E5 retention vs expression proofs | PASS |
| 3 | E6 negatives (Save≠Publish, etc.) | PASS |
| 4 | E7 §8.3 tests executed | PASS |
| 5 | FT-3A/3C preserved | PASS |
| 6 | Retention dedupe does not block authorial | PASS |
| 7 | No SR in diff | PASS |
| 8 | No WS-2 in diff | PASS |
| 9 | E2 report (this document) | PASS |
| 10–11 | SR/Trio/WS-2 tokens FALSE | PASS |
| 12 | FT-3B not claimed | PASS |
| 13 | False-pass catalog not triggered | PASS |
| 14 | WS-3 spine step 6 progress | PASS |

**Implementation assessment: PASS** (ready for **13B.5-RR** FT-3D implementation review / JR)

**Not claimed at this stage:**

- `source_reference_runtime_primitive_established`
- `foundation_trio_ready`
- `ws2_authorized`
- Full P4 lifecycle / read intent persistence (NR-N1 / PR-N1 carry-forward)

## 15. Final Tokens

```yaml
stage_13B_5_R_status: IMPLEMENTATION_COMPLETE
stage_13B_5_R_ft_3d_complete: TRUE
stage_13B_5_R_implementation_verdict: FT_3D_IMPLEMENTATION_PASS_PENDING_JR
stage_13B_5_R_authorial_post_runtime_primitive_established: TRUE  # bounded carry-forward NR/PR; not upgraded by FT-3D alone
stage_13B_5_R_source_reference_runtime_primitive_established: FALSE
stage_13B_5_R_foundation_trio_ready: FALSE
stage_13B_5_R_ws2_authorized: FALSE
stage_13B_5_R_dual_intent_boundary_established: TRUE  # write-bounded Space-service slice
stage_13B_5_R_next_safe_step: STAGE_13B_5_RR_FT_3D_IMPLEMENTATION_REVIEW_AND_ACCEPTANCE
```

## Execution Summary

| Deliverable | Value |
| --- | --- |
| Report | `docs/reports/stage_13B_5_R_ft_3D_save_publish_implementation_v1.md` |
| Verdict | **PASS** (pending JR) |
| Tests | **151/151** |
| Dual-intent proof | **ESTABLISHED** (write-bounded) |
| Next step | **13B.5-RR** — FT-3D Review; then FT-3B gate per cutline |

### Invariants (preserved)

```
FT-3D Complete ≠ Source Reference Established
Source Reference Established ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
