# Stage 13B.5-WS2-IMPL-READ-PUB — Public Read Surface Alignment Implementation

**Document class:** `WS2_IMPL_READ_PUB_SLICE_IMPLEMENTATION`  
**Authority:** `stage_13B_5_WS2_IMPL_AUTH_READ_PUB_public_read_surface_authorization_gate_v1.md` → `WS2_IMPL_READ_PUB_AUTHORIZED`  
**Not:** `WS2_AUTHORIZED` · `WS2_COMPLETE` · READ-GRP · ACTIVITY · COPY · WS2-BV-EXEC · OpenAPI · SDK · PWA · migrations · literal flips

**Pre-flight:** This stage implements **only** `WS2-IMPL-READ-PUB`. It has **no authority** to grant `WS2_AUTHORIZED`, perform READ-GRP / ACTIVITY / COPY, or execute WS2-BV-EXEC.

---

## 1. Executive Summary

Public read surfaces in **space-service** now align with WS-2 propagation elimination policy:

- **Legacy public repost** remains **visible** in home / profile / publications feeds with reason **`legacy_repost_carve_out`** (not `author_post` or canonical social `repost`).
- **Post-transition regression propagation** (reviewer marker `ws2_post_alignment_regression`) is **excluded** from target public feed item streams.
- **Authorial posts + Source Reference** unchanged on publications, highlight, and profile paths.
- **Group feed** unchanged (READ-GRP deferred).
- **No** SQL blanket `post_type <> 'repost'`, **no** row delete/hide/migrate.

**Verdict:** **`WS2_IMPL_READ_PUB_IMPLEMENTATION_COMPLETE`**

```yaml
stage_13B_5_WS2_IMPL_READ_PUB_next_safe_step: STAGE_13B_5_WS2_IMPL_READ_PUB_REVIEW
ws2_impl_read_pub_implementation_complete: TRUE
ws2_authorized: FALSE
implementation_authorized_global: FALSE
```

---

## 2. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/domain/ws2PropagationReadPolicy.ts` | **NEW** — inclusion filter, feed reason resolver, WS-5 distinction reuse |
| `apps/space-service/src/services/spaceService.ts` | `buildFeedResponse` filter + reason; `mapPostResponse` threads regression marker to FT-5D guards |
| `apps/space-service/src/domain/authorialExpression.ts` | `applyAuthorialExpressionReadGuards` accepts `ApplySurfaceGuardsOptions` |
| `apps/space-service/test/ws2PropagationReadPolicy.test.ts` | **NEW** — domain unit tests |
| `apps/space-service/test/request.test.ts` | T-READ-PUB-1..8; SURF-PUB-2 + legacy profile test reason updates |

**Not touched:** `queries/space.ts`, OpenAPI, SDK, PWA, group feed logic, activity, write policy.

---

## 3. Public Read Surface Changes

| Surface | Handler | Behavior |
| --- | --- | --- |
| **home_feed** | `getHomeFeed` → `buildFeedResponse` | Filters regression rows; legacy visible with `legacy_repost_carve_out` |
| **profile_feed** | `getProfileFeed` | Same filter/reason semantics |
| **publications** | `getPublicationsFeed` | Same; FT-5D `publications` surface hint preserved |
| **highlight** | `getHighlightPostRead` | Authorial rehydration unchanged; legacy non-authorial via existing guards |
| **post_detail** | `getPost` | Regression marker passed to read guards (no feed filter) |
| **group_feed** | `getGroupFeed` | **Unchanged** — still uses legacy `repost` reason path (out of READ-PUB scope) |

**Feed reason vocabulary (public target surfaces only):**

| Row kind | `reason` |
| --- | --- |
| Authorial `post` | `author_post` |
| Group post | `group_post` |
| System | `system` |
| Legacy carve-out repost | `legacy_repost_carve_out` |
| Regression propagation | *(excluded from `items[]`)* |

---

## 4. Legacy Classification / Carve-Out Handling

- Uses **`classifyRepostArtifactDistinction`** (WS-5 / FT-5B) — no new taxonomy.
- **`shouldIncludeInPublicTargetFeed`:** `regression` → false; `legacy_carve_out` → true; ambiguous propagation → false.
- **Reviewer marker** `ws2_post_alignment_regression` on row objects (tests only; not a DB column) maps to `isPostAlignmentRegression`.
- **`applyAuthorialExpressionReadGuards`** receives read options so FT-5D matrix applies consistently on `mapPostResponse`.

---

## 5. Test Changes

| Test ID | Status |
| --- | --- |
| T-READ-PUB-1 | PASS — legacy home feed + `legacy_repost_carve_out` |
| T-READ-PUB-2 | PASS — regression excluded from home items |
| T-READ-PUB-3 | PASS — publications authorial + SR |
| T-READ-PUB-4 | PASS — publications legacy visible, non-authorial |
| T-READ-PUB-5 | PASS — highlight authorial |
| T-READ-PUB-6 | PASS — highlight legacy non-authorial |
| T-READ-PUB-7 | PASS — write 400 + feed defense |
| T-READ-PUB-8 | PASS — profile authorial vs legacy distinction |

**Domain:** `ws2PropagationReadPolicy.test.ts` (3 tests)

**Regression updates:** `SURF-PUB-2`, `keeps legacy-shaped repost row…` → expect `legacy_repost_carve_out`

---

## 6. Validation Results

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service test` | **221/221 PASS** |
| `vitest run test/establishmentTier.contract.test.ts` | **24/24 PASS** |
| `vitest run test/perSurfaceLegacyMatrix.test.ts` | **14/14 PASS** |
| `pnpm --filter @go2asia/space-service typecheck` | **PASS** |
| `pnpm --filter @go2asia/space-service lint` | **PASS** (0 errors; pre-existing import/order warnings only) |

---

## 7. False Pass Review

| ID | Guard |
| --- | --- |
| FP-R1 hide legacy | Legacy rows remain in `items[]` (T-READ-PUB-1, T-READ-PUB-4) |
| FP-R2 delete legacy | No DELETE/UPDATE paths |
| FP-R3 count legacy as authorial | `legacy_repost_carve_out` ≠ `author_post`; no `authorialExpressionIntent` on legacy |
| FP-R4 remove rows | Filter excludes regression only, not legacy |
| FP-R5 claim READ complete for group | `getGroupFeed` untouched |
| FP-R6 claim WS2 complete | Verdict tokens forbid |
| FP-R7 UI-only | Service-layer filter in `buildFeedResponse` |
| FP-R8 OpenAPI-only | No OpenAPI change |
| FP-R9 blanket SQL | No SQL `post_type` filter added |

---

## 8. Boundary Review

| Boundary | Status |
| --- | --- |
| READ-PUB ≠ WS2_AUTHORIZED | **PASS** — literals unchanged |
| READ-PUB ≠ READ-GRP | **PASS** — group feed unchanged |
| READ-PUB ≠ ACTIVITY / COPY | **PASS** |
| RB-1..RB-10 | **PASS** — see §3–§4 |
| CO-READ-1 PWA | **PASS** — PWA not modified |

---

## 9. Agent Findings

### 9.1 AI Program Director / Project Orchestrator

- **WS2AP-ORCH-1:** READ-PUB implementation matches authorized scope — **PASS**.
- **WS2AP-ORCH-2:** Next step **`STAGE_13B_5_WS2_IMPL_READ_PUB_REVIEW`** — **PASS**.
- **WS2AP-ORCH-3:** `ws2_authorized` remains false — **PASS**.

### 9.2 Slice Strategist

- **WS2AP-STRAT-1:** Changes isolated to public feed surfaces + read policy module — **PASS**.
- **WS2AP-STRAT-2:** No scope creep into group/activity — **PASS**.

### 9.3 Runtime Governance Architect

- **WS2AP-GOV-1:** Aligns with READ-PUB authorization and WS2-PD-3 visible+classified — **PASS**.
- **WS2AP-GOV-2:** WS-5 distinction reused; no hide/delete — **PASS**.
- **WS2AP-GOV-3:** No scope expansion — **PASS**.

### 9.4 Runtime Validation Agent

- **WS2AP-VAL-1:** RB-1..RB-10 covered by implementation + T-READ-PUB-1..8 — **PASS**.
- **WS2AP-VAL-2:** Establishment + perSurfaceLegacyMatrix regressions green — **PASS**.

### 9.5 Backend Developer

- **WS2AP-BE-1:** Service-layer filter in `buildFeedResponse`; no blanket SQL — **PASS**.
- **WS2AP-BE-2:** Authorial/SR paths unchanged (T-READ-PUB-3, T-READ-PUB-5, T-PP-3) — **PASS**.

### 9.6 QA Agent

- **WS2AP-QA-1:** FP-R1/FP-R9 risks mitigated — **PASS**.
- **WS2AP-QA-2:** FP-R3 reason semantics enforced — **PASS**.

### 9.7 Technical Canon Writer

- **WS2AP-CANON-1:** Implementation does not claim `WS2_AUTHORIZED` — **PASS**.
- **WS2AP-CANON-2:** Does not claim READ-GRP / ACTIVITY / COPY completion — **PASS**.

---

## 10. Final Verdict

**`WS2_IMPL_READ_PUB_IMPLEMENTATION_COMPLETE`**

```yaml
stage_13B_5_WS2_IMPL_READ_PUB_verdict: WS2_IMPL_READ_PUB_IMPLEMENTATION_COMPLETE
stage_13B_5_WS2_IMPL_READ_PUB_next_safe_step: STAGE_13B_5_WS2_IMPL_READ_PUB_REVIEW
ws2_impl_read_pub_implementation_complete: TRUE
ws2_authorized: FALSE
implementation_authorized_global: FALSE
ws_2_write_propagation_blocked: TRUE
```

---

## Execution Summary

| Field | Value |
| --- | --- |
| **Report** | `docs/reports/stage_13B_5_WS2_IMPL_READ_PUB_public_read_surface_alignment_implementation_v1.md` |
| **Verdict** | `WS2_IMPL_READ_PUB_IMPLEMENTATION_COMPLETE` |
| **Next** | `STAGE_13B_5_WS2_IMPL_READ_PUB_REVIEW` |
