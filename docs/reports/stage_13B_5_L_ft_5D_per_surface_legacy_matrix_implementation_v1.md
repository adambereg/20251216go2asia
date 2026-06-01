# Stage 13B.5-L — FT-5D Per-Surface Legacy Matrix Implementation

## 1. Scope Verification

Execution mode:

- `BOUNDED_IMPLEMENTATION_SLICE_FT_5D_ONLY`
- authorization: `FT_5D_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` (13B.5-K)
- recommended token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5D_PER_SURFACE_LEGACY_MATRIX_ONLY`

Multi-agent mode:

- activated before implementation using `docs/ai` role model (readonly gate inputs).

Scope confirmation:

| Check | Result |
| --- | --- |
| FT-5D per-surface matrix only | PASS |
| Uses FT-5A + FT-5B + FT-5C | PASS |
| Minimum handshake 7 surfaces | PASS |
| FR-N2 surface wiring | PASS |
| No visibility policy (CO-4) | PASS |
| No hide/delete/suppress (CO-5) | PASS |
| No WS-2 (CO-6) | PASS |
| No FT-3A/P4/P5 (CO-7/8) | PASS |
| No Trio/WS-5 complete claims (CO-13) | PASS |
| No migrations / OpenAPI / SDK / UI | PASS |
| No feed SQL redesign | PASS |

## 2. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/domain/perSurfaceLegacyMatrix.ts` | **NEW** — WS5-P4 matrix layer |
| `apps/space-service/test/perSurfaceLegacyMatrix.test.ts` | **NEW** — 14 E7 tests (T1–T12 + gate) |
| `apps/space-service/src/services/spaceService.ts` | **MODIFIED** — surface wiring on feeds, post detail, activity |

Files not changed:

- `legacyTaxonomy.ts` / `legacyDistinction.ts` / `forbiddenTransformations.ts` logic (dependencies only)
- OpenAPI, SDK, DB, feed SQL queries

## 3. Surface Matrix Layer

Module: `perSurfaceLegacyMatrix.ts`

| Capability | Purpose |
| --- | --- |
| `MINIMUM_HANDSHAKE_SURFACES` | Gate §5.6 surface list |
| `rowInputForSurface` / `surfaceToRowSurfaceHint` | Maps surface → FT-5A `surface` hint |
| `buildSurfaceLegacyContext` | FT-5B distinction + taxonomy per surface |
| `buildSurfaceMatrixProof` | E8 per-surface proof object |
| `assertSurfaceLegacyMatrix` | Surface-specific matrix rules |
| `assertActivityFeedSurfaceProjection` | `activity_feed` artifact surface |
| `assertHighlightSurfaceMatrix` | `highlight` artifact surface |
| `applyFt5SurfaceLegacyGuards` | Chains FT-5B + FT-5C + FT-5D |
| `assertNonEmptySurfaceId` | F9 negative control |

## 4. Surface Inventory Coverage

| Surface ID | Implemented | Runtime wiring |
| --- | --- | --- |
| `home_feed` | YES | `buildFeedResponse(..., 'home_feed')` |
| `group_feed` | YES | `buildFeedResponse(..., 'group_feed')` |
| `profile_feed` | YES | `buildFeedResponse(..., 'profile_feed')` |
| `publications` | YES | Domain + E7 T4 (`surface: 'publications'`) |
| `activity_feed` | YES | `getActivityFeed` repost projection assert |
| `highlight` | YES | `assertHighlightSurfaceMatrix` + E7 T6 |
| `post_detail` | YES | `mapPostResponse(..., 'post_detail')` |
| `followers_feed` | YES | E7 T8 (domain/tests) |

**Minimum handshake: 7/7 covered**

## 5. Surface Wiring

| Call site | Surface passed |
| --- | --- |
| `getHomeFeed` | `home_feed` |
| `getProfileFeed` | `profile_feed` |
| `getGroupFeed` | `group_feed` |
| `getPost` / create / PATCH response | `post_detail` |
| `getActivityFeed` | `activity_feed` (projection kinds) |
| `mapPostResponse` | Required `LegacySurfaceId` — **FR-N2 closed** |

Flow:

```text
mapPostResponse(surface)
  → spacePostRowInput(post, surface)
  → applyFt5SurfaceLegacyGuards(surface, row)
      → FT-5B assertDistinctionPrimitiveBoundaries
      → FT-5C assertForbiddenTransformationGuards
      → FT-5D assertSurfaceLegacyMatrix
```

## 6. E8 Matrix Proofs

`SurfaceMatrixProof` fields per surface:

- `legacyCarveOutOnSurface`, `targetPrivateRepostOnSurface`, `regressionOnSurface`
- `notAuthorialPublicationOnSurface` (profile/publications F12)
- `notGroupQualityInputOnSurface` (group_feed)
- `notPostTransitionHighlightDestination` (highlight)
- `notPostTransitionActivityDoctrine` (activity_feed)
- `hideDeleteEmptySurfaceAlignmentBlocked` (F9)

## 7. E7 Tests

`perSurfaceLegacyMatrix.test.ts` — **14 tests**:

| Test | Gate ID |
| --- | --- |
| minimum handshake surfaces | gate |
| T1 home_feed | T1 |
| T2 group_feed | T2 |
| T3 profile_feed / FR-N2 | T3 |
| T4 publications | T4 |
| T5 activity_feed | T5 |
| T6 highlight | T6 |
| T7 post_detail | T7 |
| T8 followers_feed | T8 |
| T9 regression surface | T9 |
| T10 F9 negative | T10 |
| T11 cross-surface consistency | T11 |
| T12 FT-5C integration | T12 |
| regression disguise blocked | extra |

## 8. FT-X1 Compliance

| Boundary | Result |
| --- | --- |
| P6 ≠ P1 on surfaces | Private retention = target on profile_feed |
| P6 ≠ P4 | Profile/publications require `L_PROFILE_REPOST_ITEM` for legacy |
| P6 ≠ P5 | Historical binding unchanged |
| Legacy HISTORICAL_ARTIFACT_ONLY | Reinforced per surface |

## 9. FT-X2 Compliance

| E-class | FT-5D contribution |
| --- | --- |
| E8 | **PRIMARY** — WS-5 spine step 5 **FILLED** |
| E7 | **PRIMARY** — 14 tests executed |
| E5 | **PRIMARY** — classification per surface |
| E6 | SUPPORTING — FT-5C invoked in `applyFt5SurfaceLegacyGuards` |
| E2 | This report |

## 10. Carve-Out Verification

| Carve-out | Result |
| --- | --- |
| CO-4 visibility policy | PASS — no policy resolution |
| CO-5 hide/delete | PASS — F9 assert only |
| CO-6 WS-2 | PASS — no elimination |
| CO-7 FT-3A | PASS — no authorial writes |
| CO-8 Source Reference | PASS — no P5 establishment |
| CO-13 Trio/WS-5 complete | PASS — tokens FALSE |

**Carve-out verification: PASS**

## 11. Validation Results

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service typecheck` | PASS |
| `pnpm --filter @go2asia/space-service test -- perSurfaceLegacyMatrix.test.ts forbiddenTransformations.test.ts legacyTaxonomy.test.ts legacyDistinction.test.ts request.test.ts` | PASS — **105/105** |
| `git diff --check` | PASS (on changed files) |

## 12. PASS / FAIL Assessment

### 12.1 Stage 13B.5-K PASS criteria (14/14)

| # | Criterion | Assessment |
| --- | --- | --- |
| 1 | Minimum handshake surfaces | PASS — 7/7 |
| 2 | FT-5A + FT-5B + FT-5C consumed | PASS |
| 3 | FR-N2 surface wiring | PASS |
| 4 | Spine step 5 FILLED | PASS |
| 5 | E7 tests pass | PASS |
| 6 | Profile legacy ≠ authorial publication | PASS |
| 7 | Regression detectable per surface | PASS |
| 8 | No hide/delete alignment | PASS |
| 9 | E2 scope/carve-outs | PASS |
| 10 | Non-claim tokens | PASS |
| 11 | FT-3A not authorized by this report | PASS |
| 12 | Dependencies unchanged | PASS |
| 13 | Cutline preserved | PASS |
| 14 | F9/F12/F15 avoided | PASS |

### 12.2 FAIL triggers — none observed

`FT_5D_IMPLEMENTATION_PASS`

## 13. Final Tokens

- `stage_13B_5_L_status: FT_5D_PER_SURFACE_LEGACY_MATRIX_IMPLEMENTATION_COMPLETE`
- `stage_13B_5_L_execution_mode: BOUNDED_IMPLEMENTATION_SLICE_FT_5D_ONLY`
- `stage_13B_5_L_authorization_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5D_PER_SURFACE_LEGACY_MATRIX_ONLY`
- `stage_13B_5_L_ft_5d_complete: TRUE`
- `stage_13B_5_L_implementation_result: FT_5D_IMPLEMENTATION_PASS`
- `stage_13B_5_L_fr_n2_surface_wiring: CLOSED`
- `stage_13B_5_L_ws5_spine_step_5_per_surface_matrix: FILLED`
- `stage_13B_5_L_ws5_spine_step_4_forbidden_transforms: FILLED`
- `stage_13B_5_L_ws5_spine_step_3_distinction: FILLED`
- `stage_13B_5_L_ws5_spine_step_2_taxonomy: FILLED`
- `stage_13B_5_L_ws5_full_complete: FALSE`
- `stage_13B_5_L_foundation_trio_ready: FALSE`
- `stage_13B_5_L_ws2_authorized: FALSE`
- `stage_13B_5_L_ws3_implementation_authorized: FALSE`
- `stage_13B_5_L_authorial_post_runtime_primitive_established: FALSE`
- `stage_13B_5_L_source_reference_runtime_primitive_established: FALSE`
- `stage_13B_5_L_legacy_row_status: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_5_L_surface_coverage: home_feed,group_feed,profile_feed,publications,activity_feed,highlight,post_detail,followers_feed`
- `stage_13B_5_L_next_safe_step: STAGE_13B_5_LR_FT_5D_IMPLEMENTATION_REVIEW_AND_ACCEPTANCE`

## 14. Execution Summary

| Item | Value |
| --- | --- |
| Verdict | `FT_5D_IMPLEMENTATION_PASS` |
| Files | 2 new + 1 modified |
| Tests | 105 passed (14 new matrix + 91 prior) |
| FR-N2 | **CLOSED** |
| WS-5 spine step 5 | **FILLED** |
| Surfaces | **7 minimum + followers_feed** |
| Next step | **13B.5-LR** — FT-5D Review & Acceptance |

Invariant reminder:

```text
FT-5D Complete ≠ WS-5 Complete
WS-5 Complete ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
