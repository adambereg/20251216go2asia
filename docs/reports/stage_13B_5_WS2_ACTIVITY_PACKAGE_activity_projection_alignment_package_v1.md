# Stage 13B.5-WS2-ACTIVITY-PACKAGE — Activity Projection Alignment Package

**Document class:** `WS2_ACTIVITY_PACKAGE_ORCHESTRATED_IMPLEMENTATION`  
**Slice ID:** `WS2-ACTIVITY` (activity read / projection feed alignment)  
**Not:** `WS2_AUTHORIZED` · `WS2_COMPLETE` · `IMPLEMENTATION_AUTHORIZED_GLOBAL` · COPY · WS2-BV-EXEC · WRITE / READ-PUB / READ-GRP changes

**Pre-flight:** Orchestrated package for **activity layer read alignment** only. No authority to grant `WS2_AUTHORIZED`, global `implementation_authorized`, or WS2-BV-EXEC.

---

## 1. Executive Summary

Activity feed assembly in **space-service** now aligns with **WS-2 / WS-6** doctrine:

- **Legacy repost activity** (`space.repost_created`, `space.post_reposted_by_other`) remains **visible** with feed type **`legacy_repost_activity_carve_out`**.
- **Regression-marked** propagation activity is **excluded** from target activity `items[]`.
- **Authorial** `space.post_created` and non-repost activity types **unchanged**.
- **WRITE** paths unchanged (private retention may still materialize rows; read reclassifies).
- **No** activity delete/migrate; **no** blanket SQL removal.

**Package verdict:** **`WS2_ACTIVITY_PACKAGE_COMPLETE`**

```yaml
stage_13B_5_WS2_ACTIVITY_PACKAGE_next_safe_step: STAGE_13B_5_WS2_ACTIVITY_REVIEW
ws2_activity_alignment_complete: TRUE
ws2_authorized: FALSE
implementation_authorized_global: FALSE
```

**Program note:** After review, planning may proceed to **`STAGE_13B_5_WS2_COPY_PACKAGE`** or **`STAGE_13B_5_WS2_BV_EXEC`** per WS-2 sequencing.

---

## 2. Orchestrator Decision

| Gate | Decision |
| --- | --- |
| Scope | Activity **read** only — **PASS** |
| WRITE untouched | **PASS** |
| READ-PUB / READ-GRP untouched | **PASS** |
| Validation | **241/241** + 24/24 + 14/14 — **PASS** |

---

## 3. Agent Participation Matrix

| Role | Contribution |
| --- | --- |
| **AI Program Director / Orchestrator** | Package workflow, verdict |
| **Software Architect** | Separate `ws2PropagationActivityReadPolicy` module |
| **Runtime Governance Architect** | WS-6 / WS2-PD-3 alignment |
| **Backend Developer** | `getActivityFeed` filter + type mapping |
| **Runtime Validation Agent** | T-READ-ACT-1..5 |
| **QA Agent** | FP-A1..A8 |
| **Technical Canon Writer** | Tokens + next step |

---

## 4. Subtask Breakdown

| Subtask | Status |
| --- | --- |
| **A — Activity audit** | **DONE** — gap: SQL `type` mapped canonical repost types |
| **B — Classification policy** | **DONE** — legacy carve-out vs regression marker |
| **C — Runtime alignment** | **DONE** — filter + `resolveActivityFeedItemType` |
| **D — Feed semantics** | **DONE** — `legacy_repost_activity_carve_out` |
| **E — Tests** | **DONE** — T-READ-ACT-1..5 + domain tests |

---

## 5. Files Read

| File | Purpose |
| --- | --- |
| `stage_13B_3_F_ws_6_activity_projection_specification_v1.md` | WS-6 canon |
| `ws2PropagationReadPolicy.ts` / `ws2PropagationGroupReadPolicy.ts` | Pattern |
| `spaceService.ts` | `getActivityFeed`, materialize* (read-only audit) |
| `queries/space.ts` | `listActivityFeedRows` |
| `perSurfaceLegacyMatrix.ts` | `assertActivityFeedSurfaceProjection` |
| `request.test.ts` | Activity HTTP tests |

---

## 6. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/domain/ws2PropagationActivityReadPolicy.ts` | **NEW** |
| `apps/space-service/src/services/spaceService.ts` | `getActivityFeed` filter + type |
| `apps/space-service/test/ws2PropagationActivityReadPolicy.test.ts` | **NEW** — 4 tests |
| `apps/space-service/test/request.test.ts` | T-READ-ACT-1..5; legacy activity expectation update |

**Not changed:** WRITE materializers, READ-PUB/GRP modules, OpenAPI, SDK, SQL, literals.

---

## 7. Activity Alignment Changes

| Concern | Before | After |
| --- | --- | --- |
| Repost activity `type` in feed | `repost_created` / `post_reposted_by_other` | **`legacy_repost_activity_carve_out`** |
| Regression propagation activity | Visible as canonical type | **Excluded** from `items[]` |
| `space.post_created` | `post_created` | **Unchanged** |
| `actionType` field | Raw DB value | **Unchanged** (audit trail) |

---

## 8. Legacy Activity Handling

- FT-5D **`assertActivityFeedSurfaceProjection`** still invoked for repost activity types (WS-5).
- Historical rows **not** deleted or `removed_at` mass-updated.
- Private retention outgoing activity remains **visible**, reclassified on read.

---

## 9. Test Changes

| Test ID | Status |
| --- | --- |
| T-READ-ACT-1 | PASS — legacy `space.repost_created` visible + carve-out type |
| T-READ-ACT-2 | PASS — regression excluded |
| T-READ-ACT-3 | PASS — `post_created` unchanged |
| T-READ-ACT-4 | PASS — incoming legacy classified |
| T-READ-ACT-5 | PASS — `group_joined` unchanged |

**Regression:** `returns activity projection rows...` updated for item[1] type.

**Count:** 232 → **241** tests (+9)

---

## 10. Validation Results

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service test` | **241/241 PASS** |
| `establishmentTier.contract.test.ts` | **24/24 PASS** |
| `perSurfaceLegacyMatrix.test.ts` | **14/14 PASS** |
| `typecheck` | **PASS** |
| `lint` | **0 errors** |

---

## 11. False Pass Review

| ID | Result |
| --- | --- |
| FP-A1 hide legacy | **PASS** — T-READ-ACT-1 |
| FP-A2 delete history | **PASS** — no DELETE |
| FP-A3 legacy as authorial | **PASS** — type ≠ `post_created` |
| FP-A4 blanket remove | **PASS** — no SQL filter on action_type |
| FP-A5 WS2 complete | **PASS** |
| FP-A6 WS2 authorized | **PASS** |
| FP-A7 COPY/UI | **PASS** |
| FP-A8 OpenAPI/SDK | **PASS** |

---

## 12. Boundary Review

| Boundary | Status |
| --- | --- |
| AB-1..AB-10 | **PASS** |
| WRITE regression | **PASS** — T-WS2-W1 still no INSERT |
| READ-PUB / READ-GRP | **PASS** — no module edits |

---

## 13. Corrections Applied

None required post-review.

---

## 14. Remaining Risks / Non-blockers

| Risk | Note |
| --- | --- |
| New private repost still materializes `space.repost_created` rows | Read reclassifies; WRITE out of scope |
| Regression marker not in DB | Reviewer/test pattern (same as READ-PUB/GRP) |
| COPY/PWA labels still say “repost” | **WS-7** downstream |

---

## 15. Agent Findings

### 15.1 AI Program Director / Orchestrator

- **PKG-ORCH-1:** Activity package complete within boundaries — **PASS**.
- **PKG-ORCH-2:** Next **`STAGE_13B_5_WS2_ACTIVITY_REVIEW`** — **PASS**.

### 15.2 Software Architect

- **PKG-ARCH-1:** Isolated activity read module — **PASS**.

### 15.3 Runtime Governance Architect

- **PKG-GOV-1:** Legacy visible + classified — **PASS**.
- **PKG-GOV-2:** No target propagation category on read — **PASS**.

### 15.4 Backend Developer

- **PKG-BE-1:** Service-layer filter on activity feed — **PASS**.
- **PKG-BE-2:** `actionType` preserved for audit — **PASS**.

### 15.5 Runtime Validation Agent

- **PKG-VAL-1:** AB-* covered — **PASS**.

### 15.6 QA Agent

- **PKG-QA-1:** FP-A4 mitigated — **PASS**.

### 15.7 Technical Canon Writer

- **PKG-CANON-1:** No `WS2_AUTHORIZED` claim — **PASS**.

---

## 16. Final Verdict

**`WS2_ACTIVITY_PACKAGE_COMPLETE`**

```yaml
stage_13B_5_WS2_ACTIVITY_PACKAGE_verdict: WS2_ACTIVITY_PACKAGE_COMPLETE
stage_13B_5_WS2_ACTIVITY_PACKAGE_next_safe_step: STAGE_13B_5_WS2_ACTIVITY_REVIEW
ws2_authorized: FALSE
implementation_authorized_global: FALSE
```
