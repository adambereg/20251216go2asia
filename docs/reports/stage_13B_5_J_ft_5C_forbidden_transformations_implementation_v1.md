# Stage 13B.5-J — FT-5C Forbidden Transformations Implementation

## 1. Scope Verification

Execution mode:

- `BOUNDED_IMPLEMENTATION_SLICE_FT_5C_ONLY`
- authorization: `FT_5C_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` (13B.5-I)
- recommended token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5C_FORBIDDEN_TRANSFORMATIONS_ONLY`

Multi-agent mode:

- activated before implementation using `docs/ai` role model (readonly gate inputs).

Scope confirmation:

| Check | Result |
| --- | --- |
| FT-5C forbidden transforms only | PASS |
| Uses FT-5A taxonomy + FT-5B distinction | PASS |
| No hide/delete/archive/grandfather/suppress implementation | PASS |
| No FT-5D per-surface matrix | PASS |
| No FT-3x | PASS |
| No migrations / OpenAPI / SDK / UI | PASS |
| No visibility/feed/activity redesign | PASS |
| No policy choice (CO-16) | PASS |
| No Foundation Trio / WS-2 claims | PASS |

## 2. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/domain/forbiddenTransformations.ts` | **NEW** — WS5-P3 guard layer |
| `apps/space-service/test/forbiddenTransformations.test.ts` | **NEW** — 17 E7 guard tests |
| `apps/space-service/src/services/spaceService.ts` | **MODIFIED** — `applyFt5LegacyRuntimeGuards` chains FT-5B + FT-5C on read path |

Files not changed:

- `legacyTaxonomy.ts` / `legacyDistinction.ts` logic (dependencies only)
- OpenAPI, SDK, DB, PWA, feed queries

## 3. Forbidden Transformation Guard Layer

Module: `forbiddenTransformations.ts`

| Capability | Purpose |
| --- | --- |
| `buildForbiddenGuardContext` | Builds ctx from row using FT-5A + FT-5B |
| `buildForbiddenGuardProof` | E6 negative proof object |
| `assertForbiddenTransformationGuards` | Read-path guard after distinction |
| `assertVerificationAlignmentStrategyAllowed` | Blocks FT-HIDE/FT-DEL/FT-MIG/FT-04 alignment |
| `assertLegacyArtifactNotConvertedTo` | Blocks FT-P1/FT-P4/FT-P5 conversion attempts |
| `assertRegressionNotDisguisedAsLegacy` | FT-R2L |
| `assertLegacyCarveOutNotTreatedAsTarget` | FT-L2T |
| Specialized asserts | FT-03/12, FT-06, FT-07, FT-08, FT-09, FT-10 |

Read-path integration (`spaceService.ts`):

- `applyFt5LegacyRuntimeGuards` = FT-5B distinction assert + FT-5C forbidden guards
- Invoked from `mapPostResponse` for `post_type === 'repost'` only
- No API field changes

## 4. Forbidden Catalog Coverage

| ID | Covered | Mechanism |
| --- | --- | --- |
| FT-01 | YES | Shape guard + `assertLegacyArtifactNotConvertedTo('authorial_post')` + E6 proof |
| FT-02 | YES | `assertLegacyCarveOutShapeGuards` + commentary proof |
| FT-03 | YES | `assertLegacyNotBlogCandidate` |
| FT-04 | YES | `assertVerificationAlignmentStrategyAllowed` |
| FT-05 | YES | `assertLegacyArtifactNotConvertedTo('source_reference')` + E6 |
| FT-06 | YES | `assertLegacyNotJustifyingNewPropagation` |
| FT-07 | YES | `assertLegacyNotGroupQualitySignal` |
| FT-08 | YES | `assertLegacyChainNotReconstructedAsAncestry` |
| FT-09 | YES | `assertPrivateRepostNotIncomingPressure` |
| FT-10 | YES | `assertDedupeScopeNotBlockingAuthorial` |
| FT-11 | YES | Commentary role quarantine in shape guards |
| FT-12 | YES | `assertLegacyNotBlogCandidate` |
| FT-HIDE | YES | `assertVerificationAlignmentStrategyAllowed('hide')` |
| FT-DEL | YES | `assertVerificationAlignmentStrategyAllowed('delete')` |
| FT-MIG | YES | `assertVerificationAlignmentStrategyAllowed('migrate')` |
| FT-P1 | YES | `assertLegacyArtifactNotConvertedTo('private_repost')` |
| FT-P4 | YES | `assertLegacyArtifactNotConvertedTo('authorial_post')` |
| FT-P5 | YES | `assertLegacyArtifactNotConvertedTo('source_reference')` |
| FT-R2L | YES | `assertRegressionNotDisguisedAsLegacy` |
| FT-L2T | YES | `assertLegacyCarveOutNotTreatedAsTarget` + distinction consistency |

**Coverage: 20/20 catalog IDs from gate 13B.5-I §4**

## 5. E6 Guard Proofs

`ForbiddenGuardProof` fields prove blocked transforms for legacy carve-out:

- `legacyToP1Blocked`, `legacyToP4Blocked`, `legacyToP5Blocked`
- `regressionToLegacyBlocked`, `legacyToTargetBlocked`
- `hideDeleteMigrateAlignmentBlocked` (verification API)
- `blogCandidacyBlocked`, `groupQualitySignalBlocked`
- `chainAncestryReconstructionBlocked`
- `authorialTextFromLegacyCommentaryBlocked`, `commentaryCanonQuarantineBlocked`
- `doctrineJustificationFromLegacyBlocked`, `incomingPressureOnPrivateRepostBlocked`
- `dedupeMustNotBlockAuthorial`

Read-path `assertForbiddenTransformationGuards` validates E6 proof flags for legacy and regression categories.

## 6. E7 Guard Tests

`forbiddenTransformations.test.ts` — **17 tests**:

- Catalog presence (FT-01..FT-L2T)
- FT-HIDE/FT-DEL/FT-MIG alignment blocked
- FT-P1/P4/P5 conversion blocked
- FT-R2L / FT-L2T
- FT-03/12 blog
- FT-07 group quality
- FT-08 chain
- FT-06 doctrine
- FT-09 private pressure
- FT-10 dedupe
- Integrated read-shape guard pass
- Regression vs legacy

## 7. FT-X1 Compliance

| Boundary | Result |
| --- | --- |
| P6 ≠ P1 | Guards block legacy → P1 conversion |
| P6 ≠ P4 | Shape + E6 legacyToP4Blocked |
| P6 ≠ P5 | E6 legacyToP5Blocked + conversion assert |
| Legacy HISTORICAL_ARTIFACT_ONLY | Guards reinforce carve-out, not target primitives |

## 8. FT-X2 Compliance

| E-class | FT-5C contribution |
| --- | --- |
| E6 | **PRIMARY** — WS-5 spine step 4 **FILLED** |
| E7 | **PRIMARY** — 17 guard tests executed |
| E5 | SUPPORTING — uses taxonomy/distinction inputs |
| E2 | This report |
| E8 | Not claimed |
| E9 | Not used |

## 9. Carve-Out Verification

| Carve-out | Result |
| --- | --- |
| CO-3 hide/delete/migrate | PASS — guards block alignment only; no disappearance impl |
| CO-4 per-surface matrix | PASS — no feed query changes |
| CO-5 visibility policy | PASS — no policy resolution |
| CO-9 write paths | PASS — no new P4/P5/authorial writes |
| CO-14 Trio/WS-5 complete | PASS — tokens FALSE |
| CO-16 allowed stances | PASS — no archive/grandfather/suppress impl |

**Carve-out verification: PASS**

## 10. Validation Results

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service typecheck` | PASS |
| `pnpm --filter @go2asia/space-service test -- forbiddenTransformations.test.ts legacyTaxonomy.test.ts legacyDistinction.test.ts request.test.ts` | PASS — **91/91** |
| `git diff --check` | PASS (when run on changed files) |

## 11. PASS / FAIL Assessment

### 11.1 Stage 13B.5-I PASS criteria (14/14)

| # | Criterion | Assessment |
| --- | --- | --- |
| 1 | §4.1 rules guarded | PASS — 12/12 + traceability |
| 2 | FT-HIDE..FT-L2T | PASS — 8/8 |
| 3 | Uses FT-5A + FT-5B | PASS |
| 4 | Spine step 4 FILLED | PASS |
| 5 | E7 tests pass | PASS |
| 6 | No hide/delete/migrate strategy | PASS |
| 7 | Legacy HISTORICAL_ARTIFACT_ONLY | PASS |
| 8 | Regression/legacy confusion blocked | PASS |
| 9 | E2 scope/carve-outs | PASS |
| 10 | Non-claim tokens | PASS |
| 11 | FT-5D not claimed | PASS |
| 12 | FT-5A/5B unchanged | PASS |
| 13 | Cutline preserved | PASS |
| 14 | False evidence F9/F14/F5 avoided | PASS |

### 11.2 FAIL triggers — none observed

`FT_5C_IMPLEMENTATION_PASS`

## 12. Final Tokens

- `stage_13B_5_J_status: FT_5C_FORBIDDEN_TRANSFORMATIONS_IMPLEMENTATION_COMPLETE`
- `stage_13B_5_J_execution_mode: BOUNDED_IMPLEMENTATION_SLICE_FT_5C_ONLY`
- `stage_13B_5_J_authorization_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5C_FORBIDDEN_TRANSFORMATIONS_ONLY`
- `stage_13B_5_J_ft_5c_complete: TRUE`
- `stage_13B_5_J_implementation_result: FT_5C_IMPLEMENTATION_PASS`
- `stage_13B_5_J_ws5_spine_step_4_forbidden_transforms: FILLED`
- `stage_13B_5_J_ws5_spine_step_2_taxonomy: FILLED`
- `stage_13B_5_J_ws5_spine_step_3_distinction: FILLED`
- `stage_13B_5_J_ws5_full_complete: FALSE`
- `stage_13B_5_J_foundation_trio_ready: FALSE`
- `stage_13B_5_J_ws2_authorized: FALSE`
- `stage_13B_5_J_ws3_implementation_authorized: FALSE`
- `stage_13B_5_J_authorial_post_runtime_primitive_established: FALSE`
- `stage_13B_5_J_source_reference_runtime_primitive_established: FALSE`
- `stage_13B_5_J_legacy_row_status: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_5_J_catalog_coverage: FT_01_THROUGH_FT_12,FT_HIDE_THROUGH_FT_L2T`
- `stage_13B_5_J_next_safe_step: STAGE_13B_5_JR_FT_5C_IMPLEMENTATION_REVIEW_AND_ACCEPTANCE`

## 13. Execution Summary

| Item | Value |
| --- | --- |
| Verdict | `FT_5C_IMPLEMENTATION_PASS` |
| Files | 2 new + 1 modified |
| Tests | 91 passed (17 new forbidden + 74 prior) |
| FT-01..FT-12 | **12/12 covered** |
| FT-HIDE..FT-L2T | **8/8 covered** |
| WS-5 spine step 4 | **FILLED** |
| Next step | **13B.5-JR** — FT-5C Review & Acceptance |

Invariant reminder:

```text
FT-5C Complete ≠ WS-5 Complete
WS-5 Complete ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
