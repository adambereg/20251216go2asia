# Stage 13B.5-F — FT-5A Legacy Taxonomy Implementation

## 1. Scope Verification

Execution mode:

- `BOUNDED_IMPLEMENTATION_SLICE_FT_5A_ONLY`
- authorization token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5A_LEGACY_TAXONOMY_ONLY` (13B.5-E)

Upstream gate:

- `FT_5A_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS`

Scope confirmation:

| Check | Result |
| --- | --- |
| WS-5 legacy taxonomy (WS5-P1) only | PASS |
| Seven L_* classes operationalized | PASS |
| P6 classification layer only | PASS |
| No FT-5B/5C/5D | PASS |
| No FT-3x | PASS |
| No migrations / OpenAPI / SDK / UI redesign | PASS |
| No hide/delete/migrate strategy | PASS |
| No Foundation Trio / WS-2 claims | PASS |

## 2. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/domain/legacyTaxonomy.ts` | **NEW** — L_* taxonomy types, classifiers, P6 primitive proof helpers |
| `apps/space-service/test/legacyTaxonomy.test.ts` | **NEW** — FT-5A E7 automated boundary tests (13 cases) |
| `apps/space-service/src/services/spaceService.ts` | **MODIFIED** — read-path boundary check in `mapPostResponse` (no API field added) |

Files not changed (carve-out compliance):

- `docs/openapi/*`, `packages/sdk/*`, `packages/types/*`
- DB migrations / schema
- PWA / frontend
- `apps/reactions-service/*`

## 3. Runtime Classification Layer

### 3.1 Module: `legacyTaxonomy.ts`

Bounded runtime taxonomy layer providing:

- `LegacyTaxonomyClass` — seven L_* tokens aligned to 13B.3-C §3
- `LEGACY_TAXONOMY_CLASSES` — canonical list for tests and reviewers
- `isLegacyRepostShapedRow` — legacy discriminator (repost + not post-transition private retention)
- `classifyLegacySpacePostRow` — assigns exactly one L_* class per legacy `space_post` shape
- `classifyLegacyActivityProjection` — `L_REPOST_ACTIVITY`
- `classifyLegacyHighlightReference` — `L_REPOST_HIGHLIGHT`
- `classifyLegacyArtifact` — unified entry for space_post / activity / highlight / profile_surface
- `legacyPrimitiveProof` / `assertLegacyPrimitiveBoundaries` — P6 ≠ P1/P4/P5 runtime assertions

### 3.2 Read-path hook (`spaceService.ts`)

`applyFt5aLegacyTaxonomyBoundaryCheck(post)` runs inside `mapPostResponse` for `post_type === 'repost'`:

- classifies legacy vs post-transition private retention;
- asserts P6 primitive boundaries when legacy class is assigned;
- does **not** add fields to API JSON response;
- does **not** alter visibility, feed reason, activity materialization, or write paths.

## 4. Legacy Taxonomy Mapping

Classification priority for legacy `space_post` rows (single class output):

| Order | Condition | L_* class |
| --- | --- | --- |
| — | `postType !== 'repost'` OR post-transition `private_repost_intent` | `null` (not P6 legacy taxonomy) |
| 1 | `surface` is `profile` or `publications` | `L_PROFILE_REPOST_ITEM` |
| 2 | `repostTargetType === 'space_post'` with target id | `L_SPACE_POST_CHAIN_ARTIFACT` |
| 3 | non-empty `text` | `L_REPOST_COMMENTARY` |
| 4 | `visibility === 'group'` | `L_GROUP_REPOST` |
| 5 | default non-private legacy repost | `L_PUBLIC_REPOST` |

Non-`space_post` artifact kinds:

| Input kind | L_* class |
| --- | --- |
| `activity_projection` with `space.repost_created` or `space.post_reposted_by_other` | `L_REPOST_ACTIVITY` |
| `highlight_reference` | `L_REPOST_HIGHLIGHT` |
| `profile_surface` | uses profile surface rule on row |

Post-transition Private Repost (`visibility: private` + `private_repost_intent`) returns `null` — remains **P1**, not P6.

## 5. Automated Tests

### 5.1 New: `test/legacyTaxonomy.test.ts` (13 tests)

| Test category | Coverage |
| --- | --- |
| Taxonomy inventory | All 7 L_* classes defined |
| P1 negative | Private repost not classified as legacy |
| P4 carrier negative | `postType: post` not in legacy repost taxonomy |
| Positive classification | L_PUBLIC_REPOST, L_GROUP_REPOST, L_REPOST_COMMENTARY, L_SPACE_POST_CHAIN_ARTIFACT |
| Single-class assignment | Deterministic repeat classification |
| Profile surface | L_PROFILE_REPOST_ITEM |
| Activity / highlight | L_REPOST_ACTIVITY, L_REPOST_HIGHLIGHT |
| P6 primitive proof | P6 ≠ P1/P4/P5 |
| P5 negative | `repostTarget` binding ≠ Source Reference proof |

### 5.2 Regression: `test/request.test.ts`

- 47 existing tests — **PASS** (unchanged behavior; taxonomy hook does not alter responses)

### 5.3 Total

- **60 tests passed** in space-service for this slice scope

## 6. FT-X1 Compliance

| Boundary | Verification |
| --- | --- |
| P6 ≠ P1 | Private repost intent excluded from legacy classification; tests + `isLegacyRepostShapedRow` |
| P6 ≠ P4 | `postType: post` returns `null` from legacy taxonomy classifier |
| P6 ≠ P5 | Legacy `repostTarget*` maps to chain artifact class, not Source Reference; `isNotSourceReference` proof |
| Collapse prevention | No Authorial Text / Private Note conflation in taxonomy layer (commentary class is propagation lane, not authorial) |
| Historical artifact only | `legacyPrimitiveProof.isHistoricalLegacyArtifact` when class assigned |

FT-X1 compliance: **PASS**

## 7. FT-X2 Compliance

| E-class | Status |
| --- | --- |
| E1 Canon lock | Carried forward; non-claim tokens in this report §11 |
| E2 Bounded slice report | This document |
| E5 Primitive classification | **PRIMARY** — classifiers + 13 tests |
| E7 Automated boundary tests | **PRIMARY** — `legacyTaxonomy.test.ts` executed |
| E3 Write-path | Not used (no write semantic change) |
| E4 Read-path | Supporting — `mapPostResponse` boundary check only |
| E6 Cross-primitive negative | Supporting — tests prove P6 ≠ P1/P4/P5 |
| E8 Projection carve-out | Not claimed (FT-5D) |
| E9 Contract inventory | Not used |

WS-5 evidence spine step 2 (E5 taxonomy): **`[FILLED]`** for FT-5A scope only.

FT-X2 compliance: **PASS**

## 8. Carve-Out Verification

| ID | Verification | PASS/FAIL |
| --- | --- | --- |
| CO-1 Data / DB | No migrations or schema enums | PASS |
| CO-2 Write paths | No expression/retention write changes | PASS |
| CO-3 Hide / delete | No hide/delete/migrate | PASS |
| CO-4 Auto-convert | No conversion logic | PASS |
| CO-5 OpenAPI / SDK | Not changed | PASS |
| CO-6 UI | Not changed | PASS |
| CO-7 Distinction rule | Not implemented (FT-5B) | PASS |
| CO-8 Forbidden transforms | Not implemented (FT-5C) | PASS |
| CO-9 Per-surface matrix | Not implemented (FT-5D) | PASS |
| CO-10 P4 / P5 | Negative proof only | PASS |
| CO-11 WS-1 | Private repost semantics preserved | PASS |
| CO-12 WS-2 | Not touched | PASS |
| CO-13 Trio / WS-5 complete | Not claimed | PASS |
| CO-14 Cutline order | FT-5A only; no reorder | PASS |
| CO-15 Activity authority | Activity class only; no projection rewrite | PASS |
| CO-16 Bookmark | Not conflated | PASS |

Carve-out verification: **PASS (16/16)**

## 9. Validation Results

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service test -- legacyTaxonomy.test.ts request.test.ts` | **PASS** — 60 tests |
| `pnpm --filter @go2asia/space-service typecheck` | **PASS** |

Lint: no new issues introduced in changed files (project lint not re-run globally).

## 10. PASS / FAIL Assessment

Mapped to 13B.5-E §6 PASS criteria:

| # | Criterion | Result |
| --- | --- | --- |
| 1 | Seven L_* classes with traceability | PASS |
| 2 | Exactly one class per legacy shape | PASS |
| 3 | Post-transition Private Repost not L_* | PASS |
| 4 | P6 historical artifact proof | PASS |
| 5 | P6 ≠ P1/P4/P5 | PASS |
| 6 | WS-5 spine step 2 filled (FT-5A scope) | PASS |
| 7 | E7 tests executed and passing | PASS |
| 8 | E2 report with scope/carve-outs | PASS (this report) |
| 9 | No hide/delete/migrate strategy | PASS |
| 10 | Non-claim tokens | PASS (§11) |
| 11 | FT-5B/5C/5D not claimed complete | PASS |
| 12 | Cutline preserved | PASS |

### FAIL triggers (13B.5-E §7) — none observed

Implementation assessment:

`FT_5A_IMPLEMENTATION_PASS`

## 11. Final Tokens

- `stage_13B_5_F_status: FT_5A_LEGACY_TAXONOMY_IMPLEMENTATION_COMPLETE`
- `stage_13B_5_F_execution_mode: BOUNDED_IMPLEMENTATION_SLICE_FT_5A_ONLY`
- `stage_13B_5_F_authorization_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5A_LEGACY_TAXONOMY_ONLY`
- `stage_13B_5_F_ft_5a_complete: TRUE`
- `stage_13B_5_F_implementation_result: FT_5A_IMPLEMENTATION_PASS`
- `stage_13B_5_F_ws5_spine_step_2_e5_taxonomy: FILLED`
- `stage_13B_5_F_ws5_full_complete: FALSE`
- `stage_13B_5_F_foundation_trio_ready: FALSE`
- `stage_13B_5_F_ws2_authorized: FALSE`
- `stage_13B_5_F_ws3_implementation_authorized: FALSE`
- `stage_13B_5_F_authorial_post_runtime_primitive_established: FALSE`
- `stage_13B_5_F_source_reference_runtime_primitive_established: FALSE`
- `stage_13B_5_F_legacy_row_status: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_5_F_implementation_authorized_at_trio_level: FALSE`
- `stage_13B_5_F_next_safe_step: STAGE_13B_5_G_FT_5B_DISTINCTION_RULE_IMPLEMENTATION_AUTHORIZATION_GATE`

## 12. Execution Summary

| Item | Value |
| --- | --- |
| Verdict | `FT_5A_IMPLEMENTATION_PASS` |
| Files | 3 (1 new domain, 1 new tests, 1 service hook) |
| Tests | 60 passed |
| 13B.5-E criteria closed | 12/12 PASS criteria |
| Open after FT-5A | FT-5B, FT-5C, FT-5D, FT-3x, FT-X3, WS-2, full WS-5, Foundation Trio |
| Next safe step | **13B.5-G** — FT-5B Distinction Rule Implementation Authorization Gate |

Invariant reminder:

```text
FT-5A Complete ≠ WS-5 Complete
WS-5 Complete ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
