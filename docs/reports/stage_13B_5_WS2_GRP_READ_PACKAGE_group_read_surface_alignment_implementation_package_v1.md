# Stage 13B.5-WS2-GRP-READ-PACKAGE — Group Read Surface Alignment Implementation Package

**Document class:** `WS2_GRP_READ_PACKAGE_ORCHESTRATED_IMPLEMENTATION`  
**Authority:** `stage_13B_5_WS2_IMPL_AUTH_READ_GRP_group_read_surface_authorization_gate_v1.md` → `WS2_IMPL_READ_GRP_AUTHORIZED`  
**Slice ID:** `WS2-IMPL-READ-GRP` (package execution)  
**Not:** `WS2_AUTHORIZED` · `WS2_COMPLETE` · `IMPLEMENTATION_AUTHORIZED_GLOBAL` · ACTIVITY · COPY · WS2-BV-EXEC · WS2-AUTH

**Pre-flight:** Orchestrated package for **READ-GRP only**. No authority to grant `WS2_AUTHORIZED`, global `implementation_authorized`, ACTIVITY, COPY, or WS2-BV-EXEC.

---

## 1. Executive Summary

Group read surfaces in **space-service** now align with **WS-4** (authorial-only target group feed) and **WS-2** propagation policy:

- **Legacy group repost** remains **visible** with reason **`legacy_group_repost_carve_out`**.
- **Regression propagation** excluded from target group feed `items[]`.
- **Authorial group posts + Source Reference** preserved.
- **READ-PUB** paths unchanged (separate module).
- **No** blanket SQL repost hide; **no** legacy delete/migrate.

**Package verdict:** **`WS2_GRP_READ_PACKAGE_COMPLETE`**

```yaml
stage_13B_5_WS2_GRP_READ_PACKAGE_next_safe_step: STAGE_13B_5_WS2_IMPL_READ_GRP_REVIEW
ws2_impl_read_grp_implementation_complete: TRUE
ws2_authorized: FALSE
implementation_authorized_global: FALSE
```

---

## 2. Orchestrator Decision

| Gate | Decision |
| --- | --- |
| Authorization | `WS2_IMPL_READ_GRP_AUTHORIZED` — **honored** |
| Scope | Group feed + highlight parity tests only — **PASS** |
| READ-PUB regression | Public filter module untouched — **PASS** |
| Validation | 232/232 + 24/24 + 14/14 + typecheck — **PASS** |
| Review gates | Specialist criteria met per subtask — **PASS** |

**Proceed to:** `STAGE_13B_5_WS2_IMPL_READ_GRP_REVIEW`

---

## 3. Agent Participation Matrix

| Role | Subtasks | Output |
| --- | --- | --- |
| **AI Program Director / Orchestrator** | A–F, integration | Package plan, verdict |
| **Software Architect** | B, C | Split `ws2PropagationGroupReadPolicy` vs READ-PUB |
| **Runtime Governance Architect** | A, D, legacy mapping | WS-4 / WS2-PD-3 compliance |
| **Backend Developer** | B, C | Policy + `buildFeedResponse` |
| **Runtime Validation Agent** | E, validation | T-READ-GRP-1..8, suites |
| **QA Agent** | FP-G1..G9 | False-pass checklist |
| **Technical Canon Writer** | Final | Tokens + next step |

---

## 4. Subtask Breakdown

| Subtask | Status | Summary |
| --- | --- | --- |
| **A — Read-only audit** | **DONE** | Gap: `group_feed` used `reason: 'repost'`; no group filter |
| **B — Group read policy** | **DONE** | `ws2PropagationGroupReadPolicy.ts` |
| **C — buildFeedResponse integration** | **DONE** | Group branch filter + reason resolver |
| **D — Highlight / post detail parity** | **DONE (no code)** | Existing `mapPostResponse` + FT-5D; tests T-READ-GRP-5/6 |
| **E — Tests** | **DONE** | T-READ-GRP-1..8 + domain tests; T-READ-GRP-9 pre-existing |
| **F — Integration + validation** | **DONE** | 232 tests green |

---

## 5. Files Read

| File | Purpose |
| --- | --- |
| `stage_13B_5_WS2_IMPL_AUTH_READ_GRP_...gate_v1.md` | GB-*, T-READ-GRP-* |
| `ws2PropagationReadPolicy.ts` | Pattern for READ-PUB |
| `spaceService.ts` | `getGroupFeed`, `buildFeedResponse` |
| `queries/space.ts` | `listGroupFeedPosts` (unchanged) |
| `perSurfaceLegacyMatrix.ts` / tests | FT-5D group_feed |
| `request.test.ts` | Group feed + READ-PUB tests |

---

## 6. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/domain/ws2PropagationGroupReadPolicy.ts` | **NEW** |
| `apps/space-service/src/services/spaceService.ts` | Group feed filter + reason in `buildFeedResponse` |
| `apps/space-service/test/ws2PropagationGroupReadPolicy.test.ts` | **NEW** — 3 tests |
| `apps/space-service/test/request.test.ts` | T-READ-GRP-1..8 block |

**Not changed:** `queries/space.ts`, `ws2PropagationReadPolicy.ts`, OpenAPI, SDK, PWA, activity, literals.

---

## 7. Group Read Surface Changes

| Surface | Handler | After package |
| --- | --- | --- |
| **group_feed** | `getGroupFeed` → `buildFeedResponse(..., 'group_feed')` | Filters regression; legacy visible with `legacy_group_repost_carve_out`; authorial `group_post` + SR |

**Reason vocabulary (group_feed only):**

| Row kind | `reason` |
| --- | --- |
| Authorial group post | `group_post` |
| Legacy group repost | `legacy_group_repost_carve_out` |
| Regression propagation | *(excluded from items[])* |
| System | `system` |

---

## 8. Legacy Classification / Carve-Out Handling

- Reuses **`classifyRepostArtifactDistinction`** (WS-5).
- **`shouldIncludeInGroupTargetFeed`:** `regression` → false; `legacy_carve_out` → true.
- Reviewer marker **`ws2_post_alignment_regression`** via shared `ws2PropagationReadOptionsFromPost` (READ-PUB helper, read-only import).
- FT-5D **`group_feed`** guards unchanged in `mapPostResponse`.

---

## 9. Test Changes

| Test ID | Status |
| --- | --- |
| T-READ-GRP-1 | PASS — legacy included + carve-out reason |
| T-READ-GRP-2 | PASS — regression excluded |
| T-READ-GRP-3 | PASS — authorial + SR |
| T-READ-GRP-4 | PASS — legacy not authorial proof |
| T-READ-GRP-5 | PASS — highlight authorial (membership mock) |
| T-READ-GRP-6 | PASS — highlight legacy non-authorial |
| T-READ-GRP-7 | PASS — write 400 + feed defense |
| T-READ-GRP-8 | PASS — authorial vs legacy distinction |
| T-READ-GRP-9 | PASS — existing `filters non-group visibility rows` |

**Domain:** `ws2PropagationGroupReadPolicy.test.ts` (3 tests)

**Count:** 221 → **232** space-service tests (+11)

---

## 10. Validation Results

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service test` | **232/232 PASS** |
| `vitest run test/establishmentTier.contract.test.ts` | **24/24 PASS** |
| `vitest run test/perSurfaceLegacyMatrix.test.ts` | **14/14 PASS** |
| `pnpm --filter @go2asia/space-service typecheck` | **PASS** |
| `pnpm --filter @go2asia/space-service lint` | **0 errors** (warnings only) |

---

## 11. False Pass Review

| ID | Result |
| --- | --- |
| FP-G1 hide legacy | **PASS** — T-READ-GRP-1 |
| FP-G2 delete legacy | **PASS** — no mutation |
| FP-G3 legacy as authorial | **PASS** — `legacy_group_repost_carve_out` |
| FP-G4 blanket SQL | **PASS** — `listGroupFeedPosts` unchanged |
| FP-G5 ACTIVITY aligned | **PASS** — no activity touch |
| FP-G6 WS2 complete | **PASS** — verdict forbids |
| FP-G7 READ-PUB regression | **PASS** — separate module |
| FP-G8 OpenAPI-only | **PASS** — service-layer reason |
| FP-G9 hide all repost-shaped | **PASS** — legacy remains visible |

---

## 12. Boundary Review

| Boundary | Status |
| --- | --- |
| GB-1..GB-10 | **PASS** |
| READ-GRP ≠ WS2_AUTHORIZED | **PASS** |
| READ-GRP ≠ ACTIVITY / COPY | **PASS** |
| READ-PUB unchanged | **PASS** |
| Proof literals false | **PASS** |

---

## 13. Corrections Applied After Review

| Issue | Correction |
| --- | --- |
| T-READ-GRP-5/6 returned **403** without membership | Added gateway auth + membership mock (Subtask D test fix) |
| T-READ-GRP-8 media mocks | Added third empty media mock for second post |

**No production code defects required post-review.**

---

## 14. Remaining Risks / Non-blockers

| Risk | Severity | Note |
| --- | --- | --- |
| Regression marker not in DB | **Low** | Same as READ-PUB; WRITE block + reviewer marker |
| Feed pagination after filter | **Low** | May return fewer than `limit` items; acceptable per READ-PUB precedent |
| PWA group card copy | **Out of scope** | CO-GRP-2 — service enforces semantics |

---

## 15. Agent Findings

### 15.1 AI Program Director / Orchestrator

- **PKG-ORCH-1:** Package delivered within **WS2_IMPL_READ_GRP_AUTHORIZED** scope — **PASS**.
- **PKG-ORCH-2:** **`WS2_GRP_READ_PACKAGE_COMPLETE`** — **PASS**.
- **PKG-ORCH-3:** Next **`STAGE_13B_5_WS2_IMPL_READ_GRP_REVIEW`** — **PASS**.

### 15.2 Software Architect

- **PKG-ARCH-1:** Separate **`ws2PropagationGroupReadPolicy`** protects READ-PUB — **PASS**.
- **PKG-ARCH-2:** `buildFeedResponse` tri-branch (public / group / legacy) — **PASS**.

### 15.3 Runtime Governance Architect

- **PKG-GOV-1:** WS-4 authorial-only target stream — **PASS**.
- **PKG-GOV-2:** Legacy visible + classified — **PASS**.
- **PKG-GOV-3:** No hide/delete/migrate — **PASS**.

### 15.4 Backend Developer

- **PKG-BE-1:** Service-layer filter on `group_feed` — **PASS**.
- **PKG-BE-2:** No SQL `post_type` blanket — **PASS**.
- **PKG-BE-3:** Shared read options import from READ-PUB module (read-only) — **PASS**.

### 15.5 Runtime Validation Agent

- **PKG-VAL-1:** GB-1..GB-10 covered — **PASS**.
- **PKG-VAL-2:** T-READ-GRP-1..8 green — **PASS**.
- **PKG-VAL-3:** Regression suites green — **PASS**.

### 15.6 QA Agent

- **PKG-QA-1:** FP-G4 / FP-G9 highest risk — **mitigated** — **PASS**.
- **PKG-QA-2:** FP-G7 READ-PUB — **PASS**.

### 15.7 Technical Canon Writer

- **PKG-CANON-1:** Does not claim `WS2_AUTHORIZED` — **PASS**.
- **PKG-CANON-2:** `legacy_group_repost_carve_out` aligns with `legacy_group_carve_out` — **PASS**.

---

## 16. Final Verdict

**`WS2_GRP_READ_PACKAGE_COMPLETE`**

```yaml
stage_13B_5_WS2_GRP_READ_PACKAGE_verdict: WS2_GRP_READ_PACKAGE_COMPLETE
stage_13B_5_WS2_GRP_READ_PACKAGE_next_safe_step: STAGE_13B_5_WS2_IMPL_READ_GRP_REVIEW
ws2_impl_read_grp_implementation_complete: TRUE
ws2_authorized: FALSE
implementation_authorized_global: FALSE
ws_2_write_propagation_blocked: TRUE
```

| Verdict | Used? |
| --- | --- |
| `WS2_GRP_READ_PACKAGE_COMPLETE` | **YES** |
| Forbidden tokens | **NONE** |

---

## Execution Summary

| Field | Value |
| --- | --- |
| **Report** | `docs/reports/stage_13B_5_WS2_GRP_READ_PACKAGE_group_read_surface_alignment_implementation_package_v1.md` |
| **Tests** | 232/232 |
| **Next** | `STAGE_13B_5_WS2_IMPL_READ_GRP_REVIEW` |
