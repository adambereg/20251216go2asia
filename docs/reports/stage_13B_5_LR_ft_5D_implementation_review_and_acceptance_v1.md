# Stage 13B.5-LR — FT-5D Implementation Review & Acceptance

## 1. Inputs Reviewed

Execution mode:

- `REVIEW_AND_ACCEPTANCE_ONLY`
- no coding;
- no implementation fixes;
- findings recorded only.

Multi-agent mode:

- activated before this review using `docs/ai` role model;
- Slice Strategist + Runtime Governance Architect (readonly): surface coverage, FR-N2, F9/F11/F12/F13 blockers;
- Runtime Validation Agent (readonly): `mapPostResponse` / feed wiring safety.

Governance documents:

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_L_ft_5D_per_surface_legacy_matrix_implementation_v1.md` | Implementation under review |
| `docs/reports/stage_13B_5_K_ft_5D_per_surface_legacy_matrix_implementation_authorization_gate_v1.md` | PASS/FAIL (14/18), surface matrix, carve-outs |
| `docs/reports/stage_13B_5_JR_ft_5C_implementation_review_and_acceptance_v1.md` | FT-5C accepted; JR carry-forward |
| `docs/reports/stage_13B_5_HR_ft_5B_implementation_review_and_acceptance_v1.md` | FT-5B accepted |
| `docs/reports/stage_13B_5_FR_ft_5A_implementation_review_and_acceptance_v1.md` | FT-5A accepted; FR-N2 origin |
| `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` | P6 per-surface must-not |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | WS-5 step 5 E8 |
| `docs/reports/stage_13B_3_C_ws_5_legacy_runtime_handling_specification_v1.md` | Surface semantics canon |

Code inspected (read-only):

| Path | Role |
| --- | --- |
| `apps/space-service/src/domain/perSurfaceLegacyMatrix.ts` | FT-5D matrix layer |
| `apps/space-service/src/domain/legacyTaxonomy.ts` | `surface` hint consumer |
| `apps/space-service/src/domain/legacyDistinction.ts` | distinction per row |
| `apps/space-service/src/domain/forbiddenTransformations.ts` | guards via row context |
| `apps/space-service/src/services/spaceService.ts` | surface wiring |
| `apps/space-service/test/perSurfaceLegacyMatrix.test.ts` | E7 T1–T12 |
| `apps/space-service/test/request.test.ts` | HTTP regression |

Git context:

| Field | Value |
| --- | --- |
| Branch | `feat/stage-13b5-ft5a-ft5b-ws5-legacy-distinction` |
| Commit under review | `165f368` — FT-5D implementation |

## 2. Scope Compliance Review

| Check | Result | Evidence |
| --- | --- | --- |
| Only FT-5D slice | PASS | 2 new files + `spaceService` wiring; no FT-3x |
| Per-surface matrix only | PASS | `perSurfaceLegacyMatrix.ts`; no policy module |
| Uses FT-5A + FT-5B + FT-5C | PASS | `applyFt5SurfaceLegacyGuards` chains all three |
| No FT-3A / P4 / P5 establishment | PASS | No authorial writes |
| No WS-2 elimination | PASS | No route/query elimination |
| No visibility policy (CO-4, F-13) | PASS | No `canViewPost` changes |
| No hide/delete/suppress (CO-5, F-9) | PASS | `assertNonEmptySurfaceId` only |
| No migrations / OpenAPI / SDK / UI | PASS | Domain + service hook only |
| No feed SQL redesign (CO-12) | PASS | `listHomeFeedPosts` etc. unchanged |

**Scope compliance: PASS**

## 3. Runtime Behavior Safety Review

### 3.1 Surface wiring

```176:181:apps/space-service/src/services/spaceService.ts
async function mapPostResponse(
  db: ReturnType<typeof createDb>,
  post: SpacePostRow,
  surface: LegacySurfaceId
) {
  applyFt5SurfaceLegacyGuards(surface, spacePostRowInput(post, surface));
```

| Safety question | Result | Notes |
| --- | --- | --- |
| Adds API fields? | PASS — no | Response JSON unchanged |
| Changes response shape? | PASS — no | Same keys in feed/post payloads |
| Changes visibility? | PASS — no | `canViewPost` untouched |
| Changes feed SQL? | PASS — no | Query functions unchanged |
| Changes activity materialization? | PASS — no | Only assert on activity **read** list |
| Changes write paths? | PASS — no | Guards on read mapping only |

### 3.2 Throw risk on read path

`applyFt5SurfaceLegacyGuards` may throw on repost reads when matrix/FT-5B/FT-5C invariants fail (e.g. legacy on profile without `L_PROFILE_REPOST_ITEM`).

**Mitigation:** `request.test.ts` 47 tests including profile feed legacy repost — **all pass** (105/105 total).

**Runtime behavior safety: PASS**

## 4. Surface Coverage Review

| Surface | Gate minimum | Code | E7 test | HTTP wiring |
| --- | --- | --- | --- | --- |
| `home_feed` | YES | YES | T1 | `getHomeFeed` |
| `group_feed` | YES | YES | T2 | `getGroupFeed` |
| `profile_feed` | YES | YES | T3 | `getProfileFeed` |
| `publications` | YES | YES | T4 | Domain only (see LR-N1) |
| `activity_feed` | YES | YES | T5 | `getActivityFeed` assert |
| `highlight` | YES | YES | T6 | Domain only (see LR-N2) |
| `post_detail` | YES | YES | T7 | `getPost` / create / PATCH |
| `followers_feed` | Additional | YES | T8 | Domain/tests |

**Minimum handshake: 7/7 — PASS**

## 5. FR-N2 Resolution Review

| Layer | Surface propagation | Verified |
| --- | --- | --- |
| FT-5A | `rowInputForSurface` → `surface: 'profile' \| 'publications'` | YES — T3/T4, taxonomy tests |
| FT-5B | `classifyRepostArtifactDistinction({ row })` with surfaced row | YES — subkind changes per surface (T11) |
| FT-5C | `buildForbiddenGuardContext(row)` with surfaced row | YES — T12 integration |
| `mapPostResponse` | Required `LegacySurfaceId` parameter | YES — FR-N2 **closed** for post-shaped HTTP reads |

### 5.1 FR-N2 verdict

`FR_N2_SURFACE_WIRING: CLOSED` for bounded HTTP surfaces (home, group, profile, post_detail).

Partial wiring (non-blocking):

- `publications` — matrix row + tests; no separate publications HTTP mapper yet (LR-N1).
- `highlight` — artifact assert API + tests; no highlight URL parser hook (LR-N2).

## 6. Matrix Correctness Review

| Category | Surface behavior | Verified |
| --- | --- | --- |
| Legacy Carve-Out | Profile/publications require `L_PROFILE_REPOST_ITEM`; activity = `L_REPOST_ACTIVITY`; highlight = `legacy_highlight_carve_out` | YES — asserts + tests |
| Target Behavior | Private retention on `profile_feed` = `target_private_repost`, not legacy | YES — T12 |
| Regression | `isPostAlignmentRegression` → not legacy; no L_* on regression | YES — T9 |
| Not policy | No hide/archive/visibility resolution | YES — CO-4/5/13 clear |

Matrix is **classification/guard** layer, not product policy — PASS.

**Matrix correctness: PASS**

## 7. FT-X1 Compliance Review

| Boundary | Result |
| --- | --- |
| P6 ≠ P1 | Private retention target on profile surface |
| P6 ≠ P4 | Legacy on profile/publications must be repost + `L_PROFILE_REPOST_ITEM` |
| P6 ≠ P5 | Historical binding unchanged (FT-5B/5C) |
| Legacy `HISTORICAL_ARTIFACT_ONLY` | Reinforced per surface E8 proofs |

**FT-X1 compliance: PASS**

## 8. FT-X2 Compliance Review

| E-class | Review |
| --- | --- |
| E8 | PRIMARY — `SurfaceMatrixProof` + `assertSurfaceLegacyMatrix`; step 5 **FILLED** |
| E7 | PRIMARY — 14 tests executed (T1–T12 + extras) |
| E5 | PRIMARY — per-surface taxonomy/distinction via `buildSurfaceLegacyContext` |
| E6 | SUPPORTING — FT-5C inside `applyFt5SurfaceLegacyGuards` |
| E9 | Not used as proof — PASS |

**FT-X2 compliance: PASS**

## 9. Validation Results

Commands executed in review (2026-05-31):

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service test -- perSurfaceLegacyMatrix.test.ts forbiddenTransformations.test.ts legacyTaxonomy.test.ts legacyDistinction.test.ts request.test.ts` | **PASS — 105/105** |
| `pnpm --filter @go2asia/space-service typecheck` | **PASS** |
| `git diff --check` (FT-5D paths on `165f368`) | **PASS** |

Impl report claims independently reproduced.

## 10. PASS / FAIL Criteria Review

### 10.1 Stage 13B.5-K PASS criteria (14/14)

| # | Criterion | JR assessment |
| --- | --- | --- |
| 1 | Minimum handshake surfaces | PASS |
| 2 | FT-5A + FT-5B + FT-5C consumed | PASS |
| 3 | FR-N2 surface wiring | PASS (with LR-N1/N2 notes) |
| 4 | Spine step 5 FILLED | PASS |
| 5 | E7 tests pass | PASS |
| 6 | Profile legacy ≠ authorial publication | PASS |
| 7 | Regression detectable per surface | PASS |
| 8 | No hide/delete alignment | PASS |
| 9 | E2 scope/carve-outs | PASS |
| 10 | Non-claim tokens | PASS |
| 11 | FT-3A not authorized by FT-5D alone | PASS |
| 12 | Dependencies unchanged | PASS |
| 13 | Cutline preserved | PASS |
| 14 | F9/F12/F15/F8 avoided | PASS |

### 10.2 Stage 13B.5-K FAIL criteria (18/18 not triggered)

| ID | Emphasis | Triggered? |
| --- | --- | --- |
| F-1 / F9 | Empty surface false pass | NO — `assertNonEmptySurfaceId` |
| F-10 | Legacy visibility as canon | NO — matrix asserts carve-out only |
| F-11 | Regression → legacy on feed | NO — T9 + `assertRegressionNotLegacyOnSurface` |
| F-12 | Matrix as WS-2 proof | NO |
| F-13 | Visibility policy impl | NO |

**PASS/FAIL criteria review: PASS — no FAIL triggers**

## 11. Acceptance Verdict

Final verdict:

`FT_5D_IMPLEMENTATION_ACCEPTED_WITH_NOTES`

Why accepted:

- implementation matches 13B.5-K scope and carve-outs;
- matrix layer operational with E8/E7/E5 evidence;
- FR-N2 closed for all post-shaped HTTP read paths in Space service;
- minimum 7/7 surfaces covered in code and tests;
- no scope creep, no API shape change, HTTP suite green;
- Phase A WS-5 minimum (FT-5A → FT-5B → FT-5C → FT-5D) now review-complete.

Why with notes (not plain `FT_5D_IMPLEMENTATION_ACCEPTED`):

- LR-N1: `publications` surface has matrix + E7 but no dedicated HTTP call site passing `surface: 'publications'` (profile feed uses `profile_feed`);
- LR-N2: `highlight` surface covered in domain/tests only — no highlight URL read hook in `spaceService`;
- LR-N3: HR-N1/JR-N3 carry-forward — regression marker not persisted on DB read path;
- LR-N4: `assertHomeFeedSurface` is permissive for commentary/chain on home (intentional; not a blocker).

Why not `FT_5D_IMPLEMENTATION_REVIEW_REQUIRED` or `FT_5D_IMPLEMENTATION_REJECTED`:

- no blocking defect;
- notes are carry-forward for FT-3A / WS-6 / future surface hooks, not FT-5D rework.

### Findings summary

| ID | Severity | Action |
| --- | --- | --- |
| LR-N1 | Note | Wire `publications` when publication-count API exists |
| LR-N2 | Note | Wire `highlight` when highlight resolver exists in Space service |
| LR-N3 | Note | Persist regression epoch when governance authorizes |
| LR-N4 | Note | Optional tighten home_feed taxonomy asserts in future hardening |

No fixes applied in this stage (per mandate).

## 12. Next Safe Step

Recommended next safe stage:

`Stage 13B.5-M (or equivalent) — FT-3A Authorial Expression Implementation Authorization Gate`

Scope:

- governance-only authorization for WS-3 P4 expression boundary;
- prerequisites now satisfied: Phase A WS-5 minimum (FT-5A/5B/5C/5D accepted);
- carry WS5-P5/P6 policy carve-outs per 13B.5-D;
- do not claim `foundation_trio_ready` or `ws2_authorized`.

Not safe next:

- FT-3A coding without separate implementation gate;
- claiming `ws5_full_complete` (still requires WS5-P5/P6 and governance minimum beyond bounded FT-5D);
- WS-2 work.

## 13. Final Tokens

- `stage_13B_5_LR_status: FT_5D_IMPLEMENTATION_REVIEW_AND_ACCEPTANCE_COMPLETE`
- `stage_13B_5_LR_execution_mode: REVIEW_AND_ACCEPTANCE_ONLY`
- `stage_13B_5_LR_verdict: FT_5D_IMPLEMENTATION_ACCEPTED_WITH_NOTES`
- `stage_13B_5_LR_ft_5d_accepted: TRUE`
- `stage_13B_5_LR_ft_5d_complete: TRUE`
- `stage_13B_5_LR_implementation_under_review: STAGE_13B_5_L`
- `stage_13B_5_LR_fr_n2_surface_wiring: CLOSED`
- `stage_13B_5_LR_ws5_spine_step_5_per_surface_matrix: FILLED`
- `stage_13B_5_LR_ws5_spine_step_4_forbidden_transforms: FILLED`
- `stage_13B_5_LR_ws5_spine_step_3_distinction: FILLED`
- `stage_13B_5_LR_ws5_spine_step_2_taxonomy: FILLED`
- `stage_13B_5_LR_ws5_full_complete: FALSE`
- `stage_13B_5_LR_foundation_trio_ready: FALSE`
- `stage_13B_5_LR_ws2_authorized: FALSE`
- `stage_13B_5_LR_ws3_implementation_authorized: FALSE`
- `stage_13B_5_LR_authorial_post_runtime_primitive_established: FALSE`
- `stage_13B_5_LR_source_reference_runtime_primitive_established: FALSE`
- `stage_13B_5_LR_legacy_row_status: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_5_LR_surface_coverage: home_feed,group_feed,profile_feed,publications,activity_feed,highlight,post_detail,followers_feed`
- `stage_13B_5_LR_review_findings_blocking: FALSE`
- `stage_13B_5_LR_carry_forward_notes: LR_N1,LR_N2,LR_N3,LR_N4,HR_N1,JR_N3`
- `stage_13B_5_LR_phase_a_ws5_minimum: COMPLETE`
- `stage_13B_5_LR_next_safe_step: STAGE_13B_5_M_FT_3A_AUTHORIAL_EXPRESSION_IMPLEMENTATION_AUTHORIZATION_GATE`

## 14. Execution Summary

| Item | Value |
| --- | --- |
| Report | `docs/reports/stage_13B_5_LR_ft_5D_implementation_review_and_acceptance_v1.md` |
| Verdict | `FT_5D_IMPLEMENTATION_ACCEPTED_WITH_NOTES` |
| FR-N2 | **CLOSED** (HTTP post reads); partial for publications/highlight routes |
| Validation | 105/105 tests, typecheck PASS |
| WS-5 spine step 5 | **FILLED** |
| Phase A WS-5 minimum | **COMPLETE** (FT-5A..5D accepted) |
| Next step | **FT-3A authorization gate** |

Invariant reminder:

```text
FT-5D Accepted ≠ WS-5 Complete
WS-5 Complete ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
