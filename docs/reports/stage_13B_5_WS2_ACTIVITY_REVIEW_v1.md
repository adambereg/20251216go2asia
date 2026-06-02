# Stage 13B.5-WS2-ACTIVITY-REVIEW — Activity Projection Alignment Review

**Document class:** `WS2_ACTIVITY_REVIEW_AND_ACCEPTANCE_ONLY`  
**Not:** `WS2_AUTHORIZED` · `WS2_COMPLETE` · `WS2_BV_EXECUTION_PASS` · `IMPLEMENTATION_AUTHORIZED_GLOBAL` · COPY · WS2-BV-EXEC · WS2-AUTH · code/test/OpenAPI/SDK/literal changes

**Inputs under review:**

| Document / artifact | Role |
| --- | --- |
| `stage_13B_5_WS2_ACTIVITY_PACKAGE_activity_projection_alignment_package_v1.md` | Package claim |
| `stage_13B_3_F_ws_6_activity_projection_specification_v1.md` | WS-6 canon |
| Git commit `e05597e` on `feat/stage-13b5-ws2-impl-write` | Runtime + test diff |

**Multi-agent mode:** `docs/ai/roles/` — §10 records **six separate Agent Findings** (no merged summary).

**Pre-flight confirmation:** This stage is **review/re-certification** for **WS2-ACTIVITY-PACKAGE** only. It has **no authority** to grant `WS2_AUTHORIZED`, run **WS2-BV-EXEC**, or modify WRITE / READ-PUB / READ-GRP slices.

---

## 1. Executive Summary

**Question:** Does the Activity Package match its scope without regressions or false passes?

**Answer:** **YES.**

**Review verdict:** **`WS2_ACTIVITY_REVIEW_ACCEPTED`**

**Re-certified tokens:**

- `ws2_activity_alignment_complete: TRUE`
- `ws2_activity_review_accepted: TRUE`
- `ws2_authorized: FALSE` (unchanged)
- `implementation_authorized_global: FALSE` (unchanged)

**Validation reproduced @ review:** **241/241** space-service tests; **24/24** establishment; **14/14** perSurfaceLegacyMatrix; **typecheck PASS**; **lint 0 errors**.

```yaml
stage_13B_5_WS2_ACTIVITY_REVIEW_next_safe_step: STAGE_13B_5_WS2_COPY_PACKAGE
```

**Program note:** `STAGE_13B_5_WS2_BV_EXEC` remains required **before** `WS2-AUTH` per WS2 planning; COPY (WS-7) may run **before or in parallel with** BV prep once COPY package is authorized — see §9.

---

## 2. Scope Compliance Review (Investigation №1)

| AB | Requirement | Implemented? | Evidence | Result |
| --- | --- | --- | --- | --- |
| **AB-1** | Legacy activity remains visible | **YES** | `shouldIncludeInActivityTargetStream` returns true for repost action types without regression marker; T-READ-ACT-1, T-READ-ACT-4 | **PASS** |
| **AB-2** | Legacy activity classified | **YES** | `type: legacy_repost_activity_carve_out`; FT-5D `assertActivityFeedSurfaceProjection` | **PASS** |
| **AB-3** | Authorial activity preserved | **YES** | `space.post_created` → `type: post_created` unchanged; T-READ-ACT-3 | **PASS** |
| **AB-4** | Source reference activity preserved | **N/A** | No dedicated SR activity `action_type` in runtime; SR lives on post reads (READ-PUB) — no regression introduced | **PASS** |
| **AB-5** | Regression propagation activity excluded from target stream | **YES** | `isPostAlignmentRegression` → filter excludes; T-READ-ACT-2 | **PASS** |
| **AB-6** | No delete | **YES** | No `markActivityProjectionRemoved` bulk paths in diff | **PASS** |
| **AB-7** | No migration | **YES** | No SQL/schema changes | **PASS** |
| **AB-8** | No literal flips | **YES** | No ws2* policy literal files touched | **PASS** |
| **AB-9** | No `WS2_AUTHORIZED` claim | **YES** | Package/review verdicts scoped | **PASS** |
| **AB-10** | No `ACTIVITY_COMPLETE` outside package verdict | **YES** | Uses `WS2_ACTIVITY_PACKAGE_COMPLETE` + this review only | **PASS** |

**Aggregate:** **PASS (10/10)** — AB-4 **N/A** with no negative evidence.

---

## 3. File Scope Review (Investigation №2)

### 3.1 Commit `e05597e` — expected files

| File | Expected? | Result |
| --- | --- | --- |
| `ws2PropagationActivityReadPolicy.ts` | **YES** | **PASS** |
| `spaceService.ts` (`getActivityFeed` only) | **YES** | **PASS** — `materializeOutgoingPostActivity` unchanged |
| `request.test.ts` | **YES** | **PASS** |
| `ws2PropagationActivityReadPolicy.test.ts` | **YES** | **PASS** |
| Package report | **YES** | **PASS** |

### 3.2 Forbidden / unexpected changes

| Check | Result |
| --- | --- |
| WRITE (`materializeOutgoingPostActivity`, `createPost`) | **NO diff** — **PASS** |
| `ws2PropagationReadPolicy.ts` | **NO diff** — **PASS** |
| `ws2PropagationGroupReadPolicy.ts` | **NO diff** — **PASS** |
| `queries/space.ts` (`listActivityFeedRows`) | **NO diff** — **PASS** (FP-A4) |
| OpenAPI / SDK / PWA / migrations | **NO** — **PASS** |

**File scope aggregate:** **PASS**

---

## 4. Activity Behavior Review (Investigation №3)

| Behavior | Confirmed? | Evidence |
| --- | --- | --- |
| Legacy repost activity **visible** | **YES** | Items remain in feed; not `removed_at` bulk |
| Legacy repost activity **classified** | **YES** | `legacy_repost_activity_carve_out` replaces canonical `repost_created` / `post_reposted_by_other` **type** |
| Regression activity **excluded** | **YES** | `ws2_post_alignment_regression` marker → empty items |
| `post_created` **unchanged** | **YES** | T-READ-ACT-3 |
| Non-repost activity (`group_joined`, etc.) **unchanged** | **YES** | T-READ-ACT-5 |
| **`actionType` preserved** | **YES** | Raw `row.action_type` still emitted for audit |

**Behavior review aggregate:** **PASS**

---

## 5. Regression Review (Investigation №4)

| Spine | Check | Result |
| --- | --- | --- |
| **WRITE** | T-WS2-W1 still rejects public repost; no regression in `materialize*` | **PASS** |
| **READ-PUB** | `ws2PropagationReadPolicy.ts` untouched @ `e05597e` | **PASS** |
| **READ-GRP** | `ws2PropagationGroupReadPolicy.ts` untouched | **PASS** |
| **WS-5** | `classifyArtifactDistinction` / activity_projection reused | **PASS** |
| **FT-5D** | `assertActivityFeedSurfaceProjection` still invoked; matrix test T88 green | **PASS** |
| **Existing activity HTTP test** | Updated item[1] `type` only — semantic alignment | **PASS** |

**Regression review aggregate:** **PASS**

---

## 6. False Pass Review (Investigation №5)

| ID | Risk | Result |
| --- | --- | --- |
| **FP-A1** | Hide legacy activity | **PASS** — T-READ-ACT-1/4 |
| **FP-A2** | Delete activity history | **PASS** — no DELETE paths |
| **FP-A3** | Legacy as authorial (`post_created`) | **PASS** — repost types → carve-out type |
| **FP-A4** | Blanket remove repost activity in SQL | **PASS** — `listActivityFeedRows` unchanged |
| **FP-A5** | Claim WS2 complete | **PASS** |
| **FP-A6** | Claim WS2 authorized | **PASS** |
| **FP-A7** | MODIFY COPY/UI | **PASS** |
| **FP-A8** | OpenAPI/SDK only | **PASS** |

**False pass aggregate:** **PASS (8/8)**

---

## 7. Validation Review (Investigation №6)

| Command | Claimed | Reproduced | Result |
| --- | --- | --- | --- |
| `pnpm --filter @go2asia/space-service test` | 241/241 | **241/241** | **PASS** |
| `establishmentTier.contract.test.ts` | 24/24 | **24/24** | **PASS** |
| `perSurfaceLegacyMatrix.test.ts` | 14/14 | **14/14** | **PASS** |
| `typecheck` | PASS | **PASS** | **PASS** |
| `lint` | 0 errors | **0 errors** | **PASS** |

**Validation review aggregate:** **PASS — reproducible**

---

## 8. WS-2 Boundary Review (Investigation №7)

| Slice | Implemented in `e05597e`? | Claimed? | Result |
| --- | --- | --- | --- |
| **COPY (WS-7)** | **NO** | **NO** | **PASS** |
| **WS2-BV-EXEC** | **NO** | **NO** | **PASS** |
| **WS2-AUTH** | **NO** | **NO** | **PASS** |
| **`WS2_AUTHORIZED`** | **NO** | **NO** | **PASS** |

**Boundary review aggregate:** **PASS**

---

## 9. Review Decision (Investigation №8)

**Decision:** **`WS2_ACTIVITY_REVIEW_ACCEPTED`**

**Rationale:** AB/FP pass; file scope clean; WRITE/READ slices untouched; validation green; no blocking defects.

**Not deferred:** No FAIL on scope or false-pass catalog.

### 9.1 Confirmed tokens

```yaml
ws2_activity_alignment_complete: TRUE
ws2_activity_review_accepted: TRUE
ws2_authorized: FALSE
implementation_authorized_global: FALSE
```

### 9.2 Next safe step (program sequencing)

| Step | ID | Rationale |
| --- | --- | --- |
| **Recommended next** | **`STAGE_13B_5_WS2_COPY_PACKAGE`** | WS-7 language quarantine after semantics; user-expected path |
| **Before WS2-AUTH** | **`STAGE_13B_5_WS2_BV_EXEC`** | Planning requires `WS2_BV_EXECUTION_PASS` before auth gate — **not skipped** |

COPY deferral to BV-only path is **not recommended** — COPY is low-risk and independent of BV bundle execution.

---

## 10. Agent Findings

### 10.1 AI Program Director / Orchestrator

- **REV-ORCH-1:** Activity package accepted for re-certification — **PASS**.
- **REV-ORCH-2:** Does not grant `WS2_AUTHORIZED` — **PASS**.
- **REV-ORCH-3:** Next **`STAGE_13B_5_WS2_COPY_PACKAGE`**; BV still on critical path to auth — **PASS**.

### 10.2 Runtime Governance Architect

- **REV-GOV-1:** Legacy activity visible + classified per WS-6 / WS2-PD-3 — **PASS**.
- **REV-GOV-2:** `actionType` preserved for historical audit — **PASS**.
- **REV-GOV-3:** No activity delete/migrate — **PASS**.

### 10.3 Runtime Validation Agent

- **REV-VAL-1:** AB-1..AB-10 evidenced — **PASS**.
- **REV-VAL-2:** T-READ-ACT-1..5 + domain tests — **PASS**.
- **REV-VAL-3:** 241-test baseline holds — **PASS**.

### 10.4 Backend Developer (review mode)

- **REV-BE-1:** `getActivityFeed` filter at assembly layer — **PASS**.
- **REV-BE-2:** `materializeOutgoingPostActivity` unchanged (WRITE boundary) — **PASS**.
- **REV-BE-3:** READ-PUB/GRP modules not imported into activity policy — **PASS**.

### 10.5 QA Agent

- **REV-QA-1:** FP-A4 SQL blanket — **mitigated** — **PASS**.
- **REV-QA-2:** FP-A3 legacy vs `post_created` — **PASS**.
- **REV-QA-3:** Confusing `WS8_BV` with WS-2 activity complete — **PASS** — not claimed.

### 10.6 Technical Canon Writer

- **REV-CANON-1:** Review verdict ≠ `WS2_AUTHORIZED` — **PASS**.
- **REV-CANON-2:** `legacy_repost_activity_carve_out` vocabulary suitable for WS-7 COPY — **PASS**.

### 10.7 Disagreements

**Blocking disagreement:** None.

---

## 11. Final Verdict

**`WS2_ACTIVITY_REVIEW_ACCEPTED`**

| Verdict | Used? |
| --- | --- |
| `WS2_ACTIVITY_REVIEW_ACCEPTED` | **YES** |
| `WS2_ACTIVITY_REVIEW_DEFERRED` | **NO** |
| Forbidden tokens | **NONE** |

```yaml
stage_13B_5_WS2_ACTIVITY_REVIEW_status: PASS
stage_13B_5_WS2_ACTIVITY_REVIEW_verdict: WS2_ACTIVITY_REVIEW_ACCEPTED
stage_13B_5_WS2_ACTIVITY_REVIEW_execution_mode: GOVERNANCE_SLICE_REVIEW_ONLY
ws2_activity_review_accepted: TRUE
ws2_activity_alignment_complete: TRUE
ws2_authorized: FALSE
implementation_authorized_global: FALSE
stage_13B_5_WS2_ACTIVITY_REVIEW_next_safe_step: STAGE_13B_5_WS2_COPY_PACKAGE
```

---

## Execution Summary

| Field | Value |
| --- | --- |
| **Report** | `docs/reports/stage_13B_5_WS2_ACTIVITY_REVIEW_v1.md` |
| **Reviewed commit** | `e05597e` |
| **Verdict** | `WS2_ACTIVITY_REVIEW_ACCEPTED` |
| **Next** | `STAGE_13B_5_WS2_COPY_PACKAGE` (then `STAGE_13B_5_WS2_BV_EXEC` before auth) |
| **Code changes** | **NONE** |
