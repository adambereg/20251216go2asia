# Stage 13B.5-H — FT-5B Distinction Rule Implementation

## 1. Scope Verification

Execution mode:

- `BOUNDED_IMPLEMENTATION_SLICE_FT_5B_ONLY`
- authorization: `FT_5B_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` (13B.5-G)
- recommended token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5B_DISTINCTION_RULE_ONLY`

Multi-agent mode:

- activated before implementation using `docs/ai` role model (readonly gate review inputs).

Scope confirmation:

| Check | Result |
| --- | --- |
| FT-5B distinction rule only | PASS |
| Uses FT-5A taxonomy (does not replace) | PASS |
| Legacy / Target / Regression categories | PASS |
| No FT-5C forbidden transforms | PASS |
| No FT-5D per-surface matrix | PASS |
| No FT-3A–3D | PASS |
| No migrations / OpenAPI / SDK / UI | PASS |
| No hide/delete/auto-convert | PASS |
| No Foundation Trio / WS-2 claims | PASS |

## 2. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/domain/legacyDistinction.ts` | **NEW** — distinction layer, substantive proof, release-blocking assert |
| `apps/space-service/test/legacyDistinction.test.ts` | **NEW** — FT-5B E7 distinction tests (14 cases) |
| `apps/space-service/src/services/spaceService.ts` | **MODIFIED** — `applyFt5bDistinctionBoundaryCheck` in `mapPostResponse` |
| `apps/space-service/src/domain/legacyTaxonomy.ts` | **MODIFIED** — comment clarifying FT-5A vs FT-5B proof paths (no taxonomy logic change) |

Files not changed:

- `docs/openapi/*`, `packages/sdk/*`, `packages/types/*`
- DB / migrations
- PWA / frontend
- `apps/reactions-service/*`
- Feed / activity / profile query logic

## 3. Distinction Rule Layer

Module: `legacyDistinction.ts`

Capabilities:

| Function | Purpose |
| --- | --- |
| `classifyRepostArtifactDistinction` | Primary classifier for `space_post` repost rows |
| `classifyArtifactDistinction` | Unified entry (space_post, activity, highlight, profile_surface) |
| `buildDistinctionPrimitiveProof` | Substantive P6 proof from category + row context (FR-N1) |
| `assertDistinctionResolved` | Release-blocking rule — throws on ambiguity (13B.3-C §5) |
| `assertDistinctionPrimitiveBoundaries` | P6 anti-collapse asserts per category |

Read-path hook (`spaceService.ts`):

- `applyFt5bDistinctionBoundaryCheck` replaces FT-5A-only taxonomy assert;
- classifies distinction for repost rows on read mapping;
- does **not** add API fields or change visibility / feed / activity / writes.

Regression detection:

- `isPostAlignmentRegression` marker on classifier input (tests / future governance metadata);
- not persisted on DB read path — existing rows default to legacy carve-out or target private repost.

## 4. Distinction Categories

| Category | Token | When assigned |
| --- | --- | --- |
| Legacy Carve-Out | `legacy_carve_out` | L_* taxonomy assigned; not post-alignment regression |
| Target Behavior | `target_behavior` | Post-transition Private Repost; non-repost carrier |
| Regression | `regression` | Propagation repost + `isPostAlignmentRegression: true` |

Subkinds (extensible, not primitives):

- Legacy: `legacy_public_carve_out`, `legacy_followers_carve_out`, `legacy_group_carve_out`, `legacy_commentary_carve_out`, `legacy_chain_carve_out`, `legacy_profile_carve_out`, `legacy_activity_carve_out`, `legacy_highlight_carve_out`
- Target: `target_private_repost`, `target_standard_post_carrier`
- Regression: `regression_public_propagation`, `regression_group_propagation`, `regression_followers_propagation`

## 5. FR-N1 Resolution

**Before:** `legacyPrimitiveProof` returned all `true` for any non-null L_* class (tautological).

**After:** `buildDistinctionPrimitiveProof` derives proof from:

- distinction category;
- `isLegacyRepostShapedRow` + propagation vs private intent;
- `repostTargetBindingRole: historical_propagation` for legacy repost rows;
- `textRole: historical_commentary` when legacy text uses `propagation_commentary` (not `private_note`).

`assertDistinctionPrimitiveBoundaries` throws if legacy proof flags fail substantive checks.

FT-5A `legacyPrimitiveProof` unchanged for taxonomy-only unit tests; production read path uses FT-5B distinction proof.

**FR-N1: CLOSED** for distinction path.

## 6. FR-N3 Resolution

Explicit rule:

- `visibility: followers` + legacy propagation repost → `legacy_carve_out` / subkind `legacy_followers_carve_out` (L_* remains `L_PUBLIC_REPOST` per FT-5A).
- `visibility: followers` + `isPostAlignmentRegression` → `regression` / `regression_followers_propagation`.

Tests:

- `classifies legacy followers repost as legacy_followers carve-out (FR-N3)`
- `classifies post-alignment followers propagation as regression (FR-N3)`

**FR-N3: CLOSED**

## 7. Automated Tests

### 7.1 FT-5B E7 (`legacyDistinction.test.ts`) — 14 tests

| Gate category | Covered |
| --- | --- |
| T1 Legacy fixtures | public, group, followers, activity |
| T2 Target fixtures | private repost |
| T3 Regression fixtures | public, group, followers |
| T4 Ambiguity | `assertDistinctionResolved` throw |
| T5 P6 ≠ P1/P4/P5 | substantive proof test |
| T6 Commentary vs private_note | E7 explicit |
| T7 repostTarget ≠ P5 | historical_propagation binding |
| T9 Followers | FR-N3 pair |
| T10 FT-1F extension | activity legacy carve-out |

### 7.2 Regression suite

| Suite | Result |
| --- | --- |
| `legacyTaxonomy.test.ts` | 13 PASS (FT-5A unchanged) |
| `legacyDistinction.test.ts` | 14 PASS |
| `request.test.ts` | 47 PASS |
| **Total** | **74 PASS** |

## 8. FT-X1 Compliance

| Boundary | Result |
| --- | --- |
| P6 ≠ P1 | Private repost → `target_behavior`, no L_* |
| P6 ≠ P4 | Legacy carve-out requires `postType: repost` proof |
| P6 ≠ P5 | `historical_propagation` binding role; assert on legacy path |
| Legacy Row HISTORICAL_ARTIFACT_ONLY | Legacy carve-out category only when L_* assigned |
| No P4/P5 establishment | PASS — no authorial/SR write paths |

## 9. FT-X2 Compliance

| E-class | FT-5B contribution |
| --- | --- |
| E5 | PRIMARY — distinction rule operational |
| E6 | PRIMARY — category-specific negatives |
| E7 | PRIMARY — 14 executed distinction tests |
| E2 | This report |
| E1 | Non-claim tokens §13 |
| E8 | Not claimed (FT-5D) |
| E9 | Not used |

WS-5 evidence spine:

| Step | Status after FT-5B |
| --- | --- |
| Step 2 (taxonomy) | FILLED (FT-5A) |
| Step 3 (WS5-P2 distinction) | **FILLED** |
| Step 4–8 | STRUCTURE — FT-5C/5D |

## 10. Carve-Out Verification

| Carve-out | Result |
| --- | --- |
| CO-3 Forbidden transforms | PASS — not implemented |
| CO-4 Per-surface matrix | PASS — no query/filter enforcement |
| CO-5 Hide/delete | PASS — no row suppression |
| CO-9 Write paths | PASS — read-path classification only |
| CO-10 P4/P5 establishment | PASS — negatives only |
| CO-14 Trio/WS-5 complete claims | PASS — tokens FALSE |
| CO-15 surface wiring (FR-N2) | PASS — deferred to FT-5D |

**Carve-out verification: PASS**

## 11. Validation Results

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service typecheck` | PASS |
| `pnpm --filter @go2asia/space-service test -- legacyTaxonomy.test.ts legacyDistinction.test.ts request.test.ts` | PASS — 74/74 |
| `git diff --check` | PASS |

## 12. PASS / FAIL Assessment

### 12.1 Stage 13B.5-G PASS criteria (14/14)

| # | Criterion | Assessment |
| --- | --- | --- |
| 1 | Release-blocking rule implemented | PASS |
| 2 | Reviewer can classify legacy/target/regression | PASS |
| 3 | Regression ≠ Legacy Carve-Out | PASS |
| 4 | Private Repost = Target | PASS |
| 5 | Substantive P6 proof (FR-N1) | PASS |
| 6 | Spine step 3 FILLED | PASS |
| 7 | E7 tests passing | PASS |
| 8 | FR-N3 followers rule + test | PASS |
| 9 | E2 scope/carve-outs | PASS |
| 10 | No hide/delete strategy | PASS |
| 11 | Non-claim tokens | PASS |
| 12 | FT-5C/5D not claimed | PASS |
| 13 | FT-1F ≠ full WS-5 | PASS |
| 14 | Cutline preserved | PASS |

### 12.2 FAIL triggers — none observed

Implementation assessment:

`FT_5B_IMPLEMENTATION_PASS`

### 12.3 Open notes (non-blocking)

| ID | Status |
| --- | --- |
| FR-N2 | OPEN — surface not passed in `mapPostResponse` (FT-5D) |
| FR-N4 | OPEN — `publications` surface test (FT-5D) |
| FR-N5 | PARTIAL — T6 explicit in FT-5B distinction tests |

## 13. Final Tokens

- `stage_13B_5_H_status: FT_5B_DISTINCTION_RULE_IMPLEMENTATION_COMPLETE`
- `stage_13B_5_H_execution_mode: BOUNDED_IMPLEMENTATION_SLICE_FT_5B_ONLY`
- `stage_13B_5_H_authorization_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5B_DISTINCTION_RULE_ONLY`
- `stage_13B_5_H_ft_5b_complete: TRUE`
- `stage_13B_5_H_implementation_result: FT_5B_IMPLEMENTATION_PASS`
- `stage_13B_5_H_ws5_spine_step_3_distinction: FILLED`
- `stage_13B_5_H_ws5_spine_step_2_taxonomy: FILLED`
- `stage_13B_5_H_ws5_full_complete: FALSE`
- `stage_13B_5_H_foundation_trio_ready: FALSE`
- `stage_13B_5_H_ws2_authorized: FALSE`
- `stage_13B_5_H_ws3_implementation_authorized: FALSE`
- `stage_13B_5_H_authorial_post_runtime_primitive_established: FALSE`
- `stage_13B_5_H_source_reference_runtime_primitive_established: FALSE`
- `stage_13B_5_H_legacy_row_status: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_5_H_fr_n1_closed: TRUE`
- `stage_13B_5_H_fr_n3_closed: TRUE`
- `stage_13B_5_H_next_safe_step: STAGE_13B_5_HR_FT_5B_IMPLEMENTATION_REVIEW_AND_ACCEPTANCE`

## 14. Execution Summary

| Item | Value |
| --- | --- |
| Verdict | `FT_5B_IMPLEMENTATION_PASS` |
| Files | 2 new + 2 modified |
| Tests | 74 passed (14 new distinction + 60 prior) |
| FR-N1 | **Closed** |
| FR-N3 | **Closed** |
| WS-5 spine step 3 | **FILLED** |
| Next safe step | **13B.5-HR** — FT-5B Implementation Review & Acceptance |

Invariant reminder:

```text
FT-5B Complete ≠ WS-5 Complete
WS-5 Complete ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
