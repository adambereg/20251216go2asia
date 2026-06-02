# Stage 13B.5-WS2-IMPL-WRITE — Public/Group Repost Write Block Implementation

**Document class:** `WS2_IMPL_WRITE_IMPLEMENTATION_ONLY`  
**Not:** WS-2 Authorization Gate · `WS2_AUTHORIZED` · global `implementation_authorized` · WS2-BV-EXEC · READ/ACTIVITY/COPY slices

**Authority input:** `stage_13B_5_WS2_IMPL_AUTH_WRITE_public_group_repost_write_block_authorization_gate_v1.md` — `WS2_IMPL_WRITE_AUTHORIZED`

**Policy input:** `stage_13B_5_WS2_POLICY_propagation_elimination_policy_gate_v1.md` — `WS2_PROPAGATION_POLICY_ACCEPTED`

**Multi-agent mode:** `docs/ai/roles/` — §9 records **seven separate Agent Findings** (no merged summary).

**Pre-flight confirmation:** This stage implemented **WS2-IMPL-WRITE** write boundary only. It does **not** grant `WS2_AUTHORIZED` or global `implementation_authorized`.

---

## 1. Executive Summary

**Goal:** Block post-transition **public/group/followers** repost **writes** while preserving **private retention**, **authorial publish**, and **Source Reference on P4**.

**Result:** Write boundary enforced in `createPost` via `assertWs2PropagationWriteAllowed`; `repostPost` no longer defaults to `visibility: public`.

**Error code:** `WS2_PROPAGATION_REPOST_FORBIDDEN` (HTTP 400).

**Verdict:** **`WS2_IMPL_WRITE_IMPLEMENTATION_COMPLETE`**

**Runtime note:** `ws_2_runtime_baseline` remains **`RUNTIME_PRE_TRANSITION`** for **read/activity/copy** surfaces — only **write propagation** is blocked.

```yaml
stage_13B_5_WS2_IMPL_WRITE_next_safe_step: STAGE_13B_5_WS2_IMPL_WRITE_REVIEW
```

---

## 2. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/domain/ws2PropagationWritePolicy.ts` | **NEW** — WS-2 write policy assert + error class |
| `apps/space-service/src/services/spaceService.ts` | Guard in `createPost`; remove `repostPost` public default |
| `apps/space-service/test/ws2PropagationWritePolicy.test.ts` | **NEW** — domain unit tests (3) |
| `apps/space-service/test/request.test.ts` | WS2 reject tests; private dedupe/repostPost tests updated |

**Not changed:** OpenAPI, SDK, DB migrations, PWA, feed/read paths, activity projection logic (beyond never reaching insert on reject), proof literals.

---

## 3. Write Boundary Changes

### 3.1 `ws2PropagationWritePolicy.ts`

- `isWs2PropagationRepostWrite` — true when `postType === 'repost'` and `classifyRepostWriteIntent` is `propagation_repost` (`visibility !== 'private'`).
- `assertWs2PropagationWriteAllowed` — throws `Ws2PropagationRepostForbiddenError` with policy-aligned message.

### 3.2 `createPost` (`spaceService.ts`)

- After `postType` + `visibility` validation, **before** authorial/repost field rules:
  - Calls `assertWs2PropagationWriteAllowed`.
  - Maps to `errorResponse('WS2_PROPAGATION_REPOST_FORBIDDEN', ..., 400)`.
- Reject path **never reaches** `insertSpacePost` or `materializeOutgoingPostActivity` / incoming repost activity (WB-11).

### 3.3 `repostPost` (`spaceService.ts`)

- **Removed** `visibility: body?.visibility ?? 'public'`.
- Passes `visibility: body?.visibility` only — missing visibility → `VALIDATION_ERROR` (T-WS2-W3).
- Explicit `visibility: 'public'` on route → `WS2_PROPAGATION_REPOST_FORBIDDEN` (T-WS2-W3b).

### 3.4 WB checklist

| ID | Status | Notes |
| --- | --- | --- |
| WB-1 | **DONE** | public repost create rejected |
| WB-2 | **DONE** | group repost create rejected |
| WB-3 | **DONE** | repostPost default public eliminated |
| WB-4 | **DONE** | followers repost rejected |
| WB-5 | **DONE** | private repost create unchanged |
| WB-6 | **DONE** | private dedupe tests pass |
| WB-7 | **DONE** | authorial publish tests pass |
| WB-8 | **DONE** | SR on repost still rejected |
| WB-9 | **DONE** | no migration/delete/convert |
| WB-10 | **DONE** | literals unchanged (grep verified) |
| WB-11 | **DONE** | no propagation activity SQL on reject |

---

## 4. Test Changes

| Test ID | Implementation |
| --- | --- |
| **T-WS2-W1** | `T-WS2-W1: rejects public space-post repost create without propagation activity` |
| **T-WS2-W2** | `T-WS2-W2: rejects group space-post repost create` |
| **T-WS2-W3** | `T-WS2-W3` + `T-WS2-W3b` — repostPost without visibility / with public |
| **T-WS2-W4** | `T-WS2-W4/WB-4: rejects followers visibility repost as propagation` |
| **T-WS2-W5** | Existing private create tests (retention) |
| **T-WS2-W6** | `resolves repeated private retention...` + dedupe tests |
| **T-WS2-W7** | Existing authorial create tests |
| **T-WS2-W8** | `rejects authorialExpressionIntent on repost writes` + SR guards |

**Refactored:** Public/group activity success tests → reject tests; duplicate/event/convenience repost tests use **private** where dedupe is exercised.

**New file:** `test/ws2PropagationWritePolicy.test.ts` (3 cases).

---

## 5. Validation Results

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service test` | **210/210 PASS** (was 205 + 3 domain + 2 net HTTP) |
| `vitest run test/establishmentTier.contract.test.ts` | **24/24 PASS** |
| `pnpm --filter @go2asia/space-service typecheck` | **PASS** |
| `pnpm --filter @go2asia/space-service lint` | **PASS** (0 errors; pre-existing import/order warnings only) |

---

## 6. False Pass Review

| ID | Risk | Result |
| --- | --- | --- |
| FP-1 | UI-only removal | **PASS** — service rejects propagation writes |
| FP-2 | hide/delete legacy | **PASS** — no data mutations |
| FP-3 | OpenAPI-only | **PASS** — no OpenAPI change |
| FP-4 | block private repost | **PASS** — private paths green |
| FP-5 | silent convert to authorial | **PASS** — hard reject only |
| FP-6 | WS2 complete claim | **PASS** — READ/ACTIVITY not done |
| FP-7 | WS2 authorized | **PASS** — tokens false |
| FP-8 | global impl auth | **PASS** — not granted |
| FP-9 | repostPost default public | **PASS** — default removed |
| FP-10 | literal flips | **PASS** — unchanged |
| FP-11 | READ alignment claimed | **PASS** — feeds unchanged |

---

## 7. Agent Findings

### 7.1 AI Program Director / Project Orchestrator

- **WS2W-ORCH-1:** First authorized WS-2 slice **delivered** within gate scope — **PASS**.
- **WS2W-ORCH-2:** **`WS2_IMPL_WRITE_IMPLEMENTATION_COMPLETE`** does **not** imply `WS2_AUTHORIZED` — **PASS**.
- **WS2W-ORCH-3:** **Next** = **`STAGE_13B_5_WS2_IMPL_WRITE_REVIEW`** (PR/RR) — **PASS**.
- **WS2W-ORCH-4:** PWA may still call API; service **must** reject — documented carve-out honored — **PASS**.

### 7.2 Slice Strategist

- **WS2W-STRAT-1:** Scope limited to write boundary — **no** READ/ACTIVITY/COPY files — **PASS**.
- **WS2W-STRAT-2:** Single domain module — minimal abstraction — **PASS**.
- **WS2W-STRAT-3:** Dedupe tests retained with **private** visibility — **PASS**.

### 7.3 Runtime Governance Architect

- **WS2W-GOV-1:** Implementation matches **WS2-PD-1 P1/P2/P4/P5** and auth gate WB list — **PASS**.
- **WS2W-GOV-2:** No scope expansion into WS-2 full program — **PASS**.
- **WS2W-GOV-3:** `isWs2Authorized: false`, `isFoundationTrioReady: false` in domain proof objects — **PASS**.
- **WS2W-GOV-4:** E3 **partial** closure at write tier only — E8/read still open — **PASS**.

### 7.4 Runtime Validation Agent

- **WS2W-VAL-1:** WB-1..WB-11 covered by tests or code path — **PASS**.
- **WS2W-VAL-2:** Establishment contract **24/24** — **PASS**.
- **WS2W-VAL-3:** **WS2-BV-EXEC** still required before auth gate — **PASS**.

### 7.5 Backend Developer

- **WS2W-BE-1:** Guard placement **early** in `createPost` — **PASS**.
- **WS2W-BE-2:** `repostPost` FP-9 fix confirmed — **PASS**.
- **WS2W-BE-3:** Private retention + authorial paths regression green — **PASS**.

### 7.6 QA Agent

- **WS2W-QA-1:** FP-9 was primary risk — **mitigated** — **PASS**.
- **WS2W-QA-2:** FP-4 private path — **PASS**.
- **WS2W-QA-3:** Activity SQL absent on reject paths — **PASS**.

### 7.7 Technical Canon Writer

- **WS2W-CANON-1:** Stable error code **`WS2_PROPAGATION_REPOST_FORBIDDEN`** — **PASS**.
- **WS2W-CANON-2:** Do **not** document `WS2_AUTHORIZED` in impl summary — **PASS**.
- **WS2W-CANON-3:** Review stage prompt: verify scope + tests + no literal flip — **PASS**.

### 7.8 Disagreements

**Blocking disagreement:** None.

---

## 8. Final Verdict

**`WS2_IMPL_WRITE_IMPLEMENTATION_COMPLETE`**

| Verdict | Used? |
| --- | --- |
| `WS2_IMPL_WRITE_IMPLEMENTATION_COMPLETE` | **YES** |
| `WS2_IMPL_WRITE_IMPLEMENTATION_PARTIAL` | **NO** |
| `WS2_IMPL_WRITE_IMPLEMENTATION_DEFERRED` | **NO** |
| Forbidden grants | **NONE** |

### Implementation tokens

```yaml
stage_13B_5_WS2_IMPL_WRITE_status: PASS
stage_13B_5_WS2_IMPL_WRITE_verdict: WS2_IMPL_WRITE_IMPLEMENTATION_COMPLETE
ws2_impl_write_implementation_authorized: TRUE
ws2_impl_write_implementation_complete: TRUE
implementation_authorized_global: FALSE
ws2_authorized: FALSE
foundation_trio_ready: TRUE
ws_2_write_propagation_blocked: TRUE
ws_2_runtime_baseline: RUNTIME_PRE_TRANSITION
stage_13B_5_WS2_IMPL_WRITE_next_safe_step: STAGE_13B_5_WS2_IMPL_WRITE_REVIEW
```

---

## Execution Summary

| Field | Value |
| --- | --- |
| **Report** | `docs/reports/stage_13B_5_WS2_IMPL_WRITE_public_group_repost_write_block_implementation_v1.md` |
| **Verdict** | `WS2_IMPL_WRITE_IMPLEMENTATION_COMPLETE` |
| **Next** | `STAGE_13B_5_WS2_IMPL_WRITE_REVIEW` |
| **Tests** | **210/210** space-service; **24/24** establishment |
