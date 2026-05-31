# Stage 13B.5-FR — FT-5A Implementation Review & Acceptance

## 1. Inputs Reviewed

Execution mode:

- `REVIEW_AND_ACCEPTANCE_ONLY`
- no coding;
- no implementation fixes;
- no test rewrites for fixing;
- no refactoring;
- findings recorded only.

Multi-agent mode:

- activated before this review using `docs/ai` role model;
- Runtime Validation Agent + Slice Strategist (readonly): scope, behavior safety, taxonomy correctness.

Governance documents:

- `docs/reports/stage_13B_5_F_ft_5A_legacy_taxonomy_implementation_v1.md`
- `docs/reports/stage_13B_5_E_ft_5A_legacy_taxonomy_implementation_authorization_gate_v1.md`
- `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md`
- `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md`
- `docs/reports/stage_13B_5_DR_cutline_review_and_first_slice_confirmation_v1.md`

Code inspected (read-only):

- `apps/space-service/src/domain/legacyTaxonomy.ts`
- `apps/space-service/test/legacyTaxonomy.test.ts`
- `apps/space-service/src/services/spaceService.ts` (FT-5A hook only)
- `apps/space-service/test/request.test.ts` (regression baseline)

Git working tree (FT-5A slice files):

| Path | Status |
| --- | --- |
| `apps/space-service/src/domain/legacyTaxonomy.ts` | untracked (new) |
| `apps/space-service/test/legacyTaxonomy.test.ts` | untracked (new) |
| `apps/space-service/src/services/spaceService.ts` | modified (+import, +hook) |

## 2. Scope Compliance Review

| Check | Result | Evidence |
| --- | --- | --- |
| Only FT-5A slice | PASS | Three files only; no FT-5B/5C/5D/3x |
| Taxonomy / classification only | PASS | `legacyTaxonomy.ts` — classifiers + proof helpers |
| No migrations / DB | PASS | No `packages/db` changes |
| No OpenAPI / SDK | PASS | No `docs/openapi`, `packages/sdk`, `packages/types` changes |
| No UI / frontend | PASS | No PWA changes |
| No hide/delete/migrate | PASS | No query/filter/delete logic changed |
| No WS-2 / Trio claims | PASS | Tokens in F report; FR tokens §11 |

**Scope compliance: PASS**

## 3. Runtime Behavior Safety Review

### 3.1 `mapPostResponse` hook analysis

```174:187:apps/space-service/src/services/spaceService.ts
function applyFt5aLegacyTaxonomyBoundaryCheck(post: SpacePostRow): void {
  if (post.post_type !== 'repost') return;
  const legacyClass = classifyLegacySpacePostRow({
    postType: post.post_type,
    visibility: post.visibility,
    text: post.text,
    repostTargetType: post.repost_target_type,
    repostTargetId: post.repost_target_id,
  });
  assertLegacyPrimitiveBoundaries(legacyClass);
}

async function mapPostResponse(db: ReturnType<typeof createDb>, post: SpacePostRow) {
  applyFt5aLegacyTaxonomyBoundaryCheck(post);
  // ... unchanged response object
}
```

| Safety question | Result | Notes |
| --- | --- | --- |
| Adds API fields? | PASS — no | Return object keys unchanged |
| Changes response shape? | PASS — no | Same fields as before FT-5A |
| Changes visibility? | PASS — no | `canViewPost` untouched |
| Changes feed reason / filters? | PASS — no | Feed queries unchanged |
| Changes activity materialization? | PASS — no | `createPost` / activity SQL unchanged |
| Changes write paths? | PASS — no | Hook only on read mapping |

### 3.2 Assert throw risk

`assertLegacyPrimitiveBoundaries` throws only if proof flags are false for a non-null class. Current `legacyPrimitiveProof` always sets all flags `true` when `taxonomyClass !== null`. Therefore:

- **no production throw path today** for valid classifier output;
- private repost → `null` class → early return, no throw;
- regression tests (60) pass including legacy feed test.

**Finding FR-N1 (note, non-blocking):** assert is scaffolding, not a live safety net until proof logic becomes substantive (expected in FT-5B+).

**Runtime behavior safety: PASS**

## 4. Taxonomy Correctness Review

### 4.1 Seven L_* classes

| Token | In `LEGACY_TAXONOMY_CLASSES` | Test coverage |
| --- | --- | --- |
| L_PUBLIC_REPOST | YES | YES |
| L_GROUP_REPOST | YES | YES |
| L_REPOST_COMMENTARY | YES | YES |
| L_SPACE_POST_CHAIN_ARTIFACT | YES | YES |
| L_REPOST_ACTIVITY | YES | YES |
| L_REPOST_HIGHLIGHT | YES | YES |
| L_PROFILE_REPOST_ITEM | YES | YES (via `surface: 'profile'`) |

### 4.2 Post-transition Private Repost

- `isLegacyRepostShapedRow` excludes `private_repost_intent`
- Tests confirm `classifyLegacySpacePostRow` → `null` for private retention row
- Aligns with P1 ≠ P6 (FT-X1)

### 4.3 Single-class assignment

Priority order in `classifyLegacySpacePostRow`:

1. not legacy-shaped → `null`
2. `surface` profile/publications → `L_PROFILE_REPOST_ITEM`
3. `space_post` target → `L_SPACE_POST_CHAIN_ARTIFACT`
4. non-empty text → `L_REPOST_COMMENTARY`
5. `group` visibility → `L_GROUP_REPOST`
6. default → `L_PUBLIC_REPOST`

Deterministic re-run verified in tests.

### 4.4 Review notes (non-blocking)

| ID | Note | Impact |
| --- | --- | --- |
| FR-N2 | `mapPostResponse` does not pass `surface` → `L_PROFILE_REPOST_ITEM` not assigned on read path; domain API supports it for FT-5D | Expected per CO-9; not scope creep |
| FR-N3 | `visibility: 'followers'` legacy repost falls through to `L_PUBLIC_REPOST`; no dedicated spec token or test | Document in FT-5B distinction rule |
| FR-N4 | `surface: 'publications'` not covered by test | Minor |
| FR-N5 | Gate E7 T6 (text role vs `private_note`) not explicit in taxonomy tests; covered indirectly via `retentionIntent` elsewhere | Minor E7 gap |

**Taxonomy correctness: PASS (with notes FR-N2–N5)**

## 5. FT-X1 Compliance Review

| Boundary | Review | Result |
| --- | --- | --- |
| P6 ≠ P1 | Private repost excluded from legacy classifier | PASS |
| P6 ≠ P4 | `postType: post` → null | PASS |
| P6 ≠ P5 | Chain class + `isNotSourceReference`; no `sourceReference` field added | PASS |
| Legacy Row HISTORICAL_ARTIFACT_ONLY | `legacyPrimitiveProof` when class assigned | PASS |
| No collapse into Authorial Text / Private Note via taxonomy | Commentary class is propagation lane, not authorial | PASS |

**FT-X1 compliance: PASS**

## 6. FT-X2 Compliance Review

| E-class | FT-5A expectation | Review |
| --- | --- | --- |
| E1 | Canon carried | PASS |
| E2 | F implementation report complete | PASS |
| E5 | Taxonomy PRIMARY — domain + tests | PASS — spine step 2 filled for FT-5A scope |
| E7 | Tests executed | PASS — 13 + 47 regression |
| E3 | Not required (no write change) | PASS — N/A |
| E4 | Supporting only | PASS — read hook only |
| E6 | Partial via negatives | PASS |
| E8 | Not claimed | PASS |
| E9 | Not used as proof | PASS |
| FT-5B/5C/5D complete | Not claimed | PASS |

**FT-X2 compliance: PASS**

## 7. Validation Results

Commands run during this review (reproduced):

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service test -- legacyTaxonomy.test.ts request.test.ts` | **PASS** — 60 tests (13 + 47) |
| `pnpm --filter @go2asia/space-service typecheck` | **PASS** |
| `git diff -- apps/space-service/...` | Only `spaceService.ts` in diff; new files untracked |
| `git diff --check` | **PASS** — no conflict markers |

Lint: scoped lint not run (not required; no lint regressions observed in changed files).

## 8. PASS / FAIL Criteria Review

### 8.1 Stage 13B.5-E PASS criteria (12/12)

| # | Criterion | FR assessment |
| --- | --- | --- |
| 1 | Seven L_* with traceability | PASS |
| 2 | One class per legacy shape | PASS |
| 3 | Private Repost not L_* | PASS |
| 4 | P6 historical artifact | PASS |
| 5 | P6 ≠ P1/P4/P5 | PASS |
| 6 | WS-5 spine step 2 E5 | PASS |
| 7 | E7 tests pass | PASS (minor T6 note FR-N5) |
| 8 | E2 scope/carve-outs | PASS |
| 9 | No hide/delete/migrate | PASS |
| 10 | Non-claim tokens | PASS |
| 11 | FT-5B/5C/5D not claimed | PASS |
| 12 | Cutline preserved | PASS |

### 8.2 Stage 13B.5-E FAIL criteria (14/14 not triggered)

| FAIL trigger | Observed? |
| --- | --- |
| F-1 hide/delete pass | NO |
| F-2 legacy as P4/P5 | NO |
| F-3 OpenAPI as proof | NO |
| F-4 UI-only | NO |
| F-5 Trio/WS-2 tokens | NO |
| F-6 full WS-5 claim | NO |
| F-7 scope drift FT-5B/C/D | NO |
| F-8 FT-3A in diff | NO |
| F-9 missing E7 | NO |
| F-10 BV ambiguity | NO (classifier sufficient for FT-5A scope) |
| F-11 private as legacy | NO |
| F-12 commentary as authorial | NO |
| F-13 gate = impl auth | NO |
| F-14 gate doc as coding permission | NO — E gate + F impl separate |

**PASS/FAIL criteria review: PASS — no FAIL triggers**

## 9. Acceptance Verdict

Final verdict:

`FT_5A_IMPLEMENTATION_ACCEPTED_WITH_NOTES`

Why accepted:

- implementation matches 13B.5-E gate scope and carve-outs;
- no scope creep or hidden behavior change detected;
- FT-X1 and FT-X2 requirements satisfied for FT-5A bounded slice;
- validation reproduced (60 tests, typecheck);
- first coding slice is safe to treat as complete for cutline progression.

Why with notes (not plain ACCEPTED):

- FR-N1: tautological assert on read path (scaffolding only);
- FR-N2: profile surface class not wired in `mapPostResponse` (deferred to FT-5D);
- FR-N3: `followers` visibility implicit `L_PUBLIC_REPOST` without test;
- FR-N4–N5: minor test coverage gaps.

Why not REJECTED or REVIEW_REQUIRED:

- no blocking defect;
- notes are carry-forward for FT-5B/5D, not FT-5A rework.

### Findings summary

| ID | Severity | Action |
| --- | --- | --- |
| FR-N1 | Note | Strengthen proof in FT-5B+ if assert should be live |
| FR-N2 | Note | Wire `surface` in FT-5D per-surface matrix |
| FR-N3 | Note | Add followers rule/test in FT-5B distinction |
| FR-N4 | Note | Add `publications` surface test when wiring surfaces |
| FR-N5 | Note | Optional explicit T6 test in future slice |

No fixes applied in this stage (per mandate).

## 10. Next Safe Step

Recommended next safe stage:

`Stage 13B.5-G — FT-5B Distinction Rule Implementation Authorization Gate`

Scope:

- governance-only authorization for legacy / target / regression distinction rule;
- carry forward FR-N1–N3 as planning inputs;
- `implementation_authorized: FALSE` until separate FT-5B implementation gate and slice.

Not safe next:

- FT-5B coding without 13B.5-G gate;
- FT-3A implementation;
- claiming `ws5_full_complete` or Foundation Trio readiness.

## 11. Final Tokens

- `stage_13B_5_FR_status: FT_5A_IMPLEMENTATION_REVIEW_AND_ACCEPTANCE_COMPLETE`
- `stage_13B_5_FR_execution_mode: REVIEW_AND_ACCEPTANCE_ONLY`
- `stage_13B_5_FR_verdict: FT_5A_IMPLEMENTATION_ACCEPTED_WITH_NOTES`
- `stage_13B_5_FR_ft_5a_accepted: TRUE`
- `stage_13B_5_FR_ft_5a_complete: TRUE`
- `stage_13B_5_FR_implementation_result_carried_forward: FT_5A_IMPLEMENTATION_PASS`
- `stage_13B_5_FR_ws5_spine_step_2_e5_taxonomy: FILLED`
- `stage_13B_5_FR_ws5_full_complete: FALSE`
- `stage_13B_5_FR_foundation_trio_ready: FALSE`
- `stage_13B_5_FR_ws2_authorized: FALSE`
- `stage_13B_5_FR_ws3_implementation_authorized: FALSE`
- `stage_13B_5_FR_authorial_post_runtime_primitive_established: FALSE`
- `stage_13B_5_FR_source_reference_runtime_primitive_established: FALSE`
- `stage_13B_5_FR_legacy_row_status: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_5_FR_review_findings: FR-N1,FR-N2,FR-N3,FR-N4,FR-N5`
- `stage_13B_5_FR_review_findings_blocking: FALSE`
- `stage_13B_5_FR_next_safe_step: STAGE_13B_5_G_FT_5B_DISTINCTION_RULE_IMPLEMENTATION_AUTHORIZATION_GATE`

## 12. Execution Summary

| Deliverable | Path |
| --- | --- |
| FT-5A review & acceptance report | `docs/reports/stage_13B_5_FR_ft_5A_implementation_review_and_acceptance_v1.md` |

| Item | Value |
| --- | --- |
| Verdict | `FT_5A_IMPLEMENTATION_ACCEPTED_WITH_NOTES` |
| FT-5A accepted | **YES** |
| Blocking findings | **NONE** |
| Notes | FR-N1 … FR-N5 |
| Validation | 60 tests PASS, typecheck PASS |
| 13B.5-E criteria | 12/12 PASS; 0/14 FAIL |
| Next step | **13B.5-G** — FT-5B Authorization Gate |

Invariant reminder:

```text
FT-5A Accepted ≠ WS-5 Complete
WS-5 Complete ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
