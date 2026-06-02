# Stage 13B.5-WS2-IMPL-AUTH-WRITE — Public/Group Repost Write Block Implementation Authorization Gate

**Document class:** `WS2_IMPL_WRITE_SLICE_AUTHORIZATION_GATE_ONLY`  
**Not:** WS-2 Authorization Gate · `WS2_AUTHORIZED` · global `implementation_authorized` · WS-2 implementation execution · WS2-BV-EXEC · READ/ACTIVITY/COPY slices · runtime / tests / OpenAPI / SDK / DB / literal changes in this stage

**Authority inputs:**

| Document | Verdict / role |
| --- | --- |
| `stage_13B_5_WS2_PLANNING_ws2_authorization_planning_v1.md` | `WS2_AUTHORIZATION_PLANNING_COMPLETE` |
| `stage_13B_5_WS2_POLICY_propagation_elimination_policy_gate_v1.md` | `WS2_PROPAGATION_POLICY_ACCEPTED` |

**Authority baseline:** `foundation_trio_ready: TRUE`; `ws2_authorized: FALSE`; `implementation_authorized: FALSE` (global); `ws_2_runtime_baseline: RUNTIME_PRE_TRANSITION`

**Multi-agent mode:** `docs/ai/roles/` — §12 records **seven separate Agent Findings** (no merged summary).

**Pre-flight confirmation:** This stage is a **per-slice implementation authorization gate** for **`WS2-IMPL-WRITE`** only. It has **no authority** to grant `WS2_AUTHORIZED`, global `implementation_authorized`, or perform implementation.

---

## 1. Executive Summary

**Main question:** May per-slice implementation authorization be issued for **`WS2-IMPL-WRITE`** (public/group repost write block)?

**Answer:** **YES.**

**Gate verdict:** **`WS2_IMPL_WRITE_AUTHORIZED`**

**Meaning:** The next stage may implement **write-boundary** enforcement per WS2-PD-1/PD-2 in `apps/space-service` only, with required tests. This **does not** authorize read-surface alignment, activity/copy slices, OpenAPI/SDK churn by default, or `ws2_authorized`.

```yaml
stage_13B_5_WS2_IMPL_AUTH_WRITE_next_safe_step: STAGE_13B_5_WS2_IMPL_WRITE
```

---

## 2. Prerequisite Review (Investigation №1)

| Prerequisite | Required state | Evidence | Result |
| --- | --- | --- | --- |
| **Foundation Trio Ready** | `TRUE` | Ready Gate v3 + APPLY; FT-X2 §4.4 step 8 FILLED | **PASS** |
| **WS2-POLICY** | `WS2_PROPAGATION_POLICY_ACCEPTED` | `stage_13B_5_WS2_POLICY_propagation_elimination_policy_gate_v1.md` | **PASS** |
| **FT-X2 §6.4 gaps documented** | E3/E6 open; WS-2 auth separate | WS2-PLANNING §2; C2 §6.4 | **PASS** |
| **WS2-PD-1 hard reject** | Accepted | POLICY §2.4 P1–P5 | **PASS** |
| **WS2-PD-2 save/publish dual-intent** | Accepted | POLICY §3 S1–S3 | **PASS** |
| **WS2-PD-3 legacy policy** | Accepted | POLICY §4 V1–V3 | **PASS** |
| **WS2-PD-4/5** | Accepted (core) | POLICY §5–6 | **PASS** |
| **No conflicting canon** | Frozen 13B.2/13B.3-D; ZR lock | 13B.3-D REMOVE targets; FT-X1/FT-X2 | **PASS** |
| **WS-1/3/5 prerequisites** | FILLED / ESTABLISHED | Trio spines; FE-P4/P5 | **PASS** |
| **Prior WS-2 impl auth** | None issued | First WS-2 impl slice | **PASS** (vacant slot) |

**Aggregate:** **All mandatory prerequisites PASS.** No **FAIL** blocker for gate issuance.

**PARTIAL (non-blocking for this gate):**

| Item | Note |
| --- | --- |
| FT-X2 §6.4 E3/E6 | **OPEN** — expected; WRITE slice is the **first** E3 closure step |
| PWA Share-to-Space UI | Out of bounded slice — **carve-out CO-WS2-10** |
| READ/ACTIVITY surfaces | Deferred to later slices — **not** WRITE blockers |

---

## 3. WS2-IMPL-WRITE Scope (Investigation №2)

### 3.1 IN scope (write boundary only)

| # | Behavior | Policy anchor |
| --- | --- | --- |
| 1 | **Reject** `createPost` with `postType: repost` + `visibility: public` | PD-1 P1 |
| 2 | **Reject** `createPost` with `postType: repost` + `visibility: group` (+ valid `groupId`) | PD-1 P1 |
| 3 | **Reject** `repostPost` when resolved visibility is `public` or `group` (including default `public`) | PD-1 P1, P4 |
| 4 | **Reject** `postType: repost` + `visibility: followers` as propagation (treat as non-private retention) | PD-1 P2 alignment with `classifyRepostWriteIntent` |
| 5 | **Allow** `postType: repost` + `visibility: private` + valid repost target (WS-1 retention) | PD-1 P2 |
| 6 | **Preserve** private repost dedupe scopes (retention vs propagation by visibility) | PD-2, VIS |
| 7 | **Preserve** `postType: post` create with `authorialExpressionIntent` (P4 publish) | PD-2 |
| 8 | **Preserve** optional Source Reference on P4 only (`parseSourceReferenceFromBody` + existing guards) | PD-2, FT-3B |
| 9 | **Preserve** existing domain asserts (`authorialExpression`, `savePublishBoundary`, `sourceReferenceBoundary`, `authorialIndependence`) | FT-X1 |
| 10 | **No** DB migration, delete, or legacy row rewrite | PD-3, PD-5 |

### 3.2 OUT of scope (explicit non-scope)

| Area | Owner slice |
| --- | --- |
| Home/public feed read exclusion | `WS2-IMPL-READ-PUB` |
| Group feed authorial-only read | `WS2-IMPL-READ-GRP` / WS-4 |
| Activity categories / incoming pressure | `WS2-IMPL-ACTIVITY` / WS-6 |
| UI copy / Share-to-Space composer layout | WS-7 / PWA (carve-out) |
| OpenAPI/SDK schema changes | **Forbidden unless** stable error code requires doc sync — default **no** |
| `ws2_authorized` / proof literal flip | WS-2 AUTH gate + LIT track |
| Global `implementation_authorized` | **Forbidden** |
| WS2-BV-EXEC | After impl + PR/RR |

### 3.3 Slice minimality

**WRITE is the minimal first slice:** it is the only slice that can produce **observable E3** proof (no new public/group repost rows) without claiming full WS-2 completion.

---

## 4. Target Surfaces / Files (Investigation №3)

Read-only analysis on current branch. **No files modified in this gate.**

### 4.1 Primary implementation surfaces

| Path | Role | Expected change class |
| --- | --- | --- |
| `apps/space-service/src/services/spaceService.ts` | **`createPost`**, **`repostPost`** — central write paths | Early reject after `postType` + `visibility` known; `repostPost` must not default to public propagation |
| `apps/space-service/src/routes/posts.ts` | Routes to `createPost` / `repostPost` | **No logic** unless thin delegate only — prefer service-layer guard |

### 4.2 Recommended domain surface (new or extended)

| Path | Role |
| --- | --- |
| `apps/space-service/src/domain/retentionIntent.ts` | Existing `classifyRepostWriteIntent` — **`propagation_repost`** vs **`private_repost_intent`** |
| **New (recommended):** `apps/space-service/src/domain/ws2PropagationWritePolicy.ts` | Single `assertWs2PropagationWriteAllowed(...)` cited by gate — keeps `spaceService.ts` readable |

**Optional touch (only if assert delegation requires):**

| Path | Role |
| --- | --- |
| `apps/space-service/src/domain/savePublishBoundary.ts` | Already classifies save vs publish — **do not** weaken private path |
| `apps/space-service/src/domain/sourceReferenceBoundary.ts` | Ensure reject paths unchanged for P4 |

### 4.3 Explicitly out of slice file list

| Path | Reason |
| --- | --- |
| `apps/go2asia-pwa-shell/**` | CO-WS2-10 carve-out |
| `docs/openapi/space.yaml` | Default no change |
| `packages/**` SDK | Default no change |
| `packages/db/migrations/**` | Forbidden |
| Feed/list SQL in `db/queries/space.ts` | READ slice |
| `updateRepostCommentary` | Private note machinery — **only** if PATCH allows public commentary expansion; default **unchanged** unless audit finds public propagation via PATCH |

### 4.4 Dedupe / insert path

| Path | Role |
| --- | --- |
| `apps/space-service/src/services/spaceService.ts` (dedupe block ~L568+) | Must remain scoped: private retention dedupe **unchanged** |

---

## 5. Required Implementation Behavior (Investigation №4)

| ID | Behavior | Acceptance signal |
| --- | --- | --- |
| **WB-1** | Public `postType: repost` create → **4xx** with stable error identity | HTTP test; no INSERT |
| **WB-2** | Group `postType: repost` create → **4xx** | HTTP test |
| **WB-3** | `POST .../posts/{id}/repost` with public (or default public) → **4xx** | HTTP test on `repostPost` |
| **WB-4** | `POST .../repost` with group visibility → **4xx** | HTTP test |
| **WB-5** | Private repost create (object-bound + space_post) → **201** (or existing success semantics) | Existing tests adapted |
| **WB-6** | Private repost dedupe still scopes retention | `request.test` dedupe cases |
| **WB-7** | Authorial `postType: post` + `authorialExpressionIntent: true` → **201** | Existing authorial tests |
| **WB-8** | Source Reference on P4 → allowed; on repost → **rejected** (existing) | `E-AC-04` / request tests |
| **WB-9** | No legacy row UPDATE/DELETE/conversion | No migration SQL in diff |
| **WB-10** | `isWs2Authorized` / `isFoundationTrioReady` literals remain **false** | Code inspection at PR/RR |
| **WB-11** | Public/group propagation repost does **not** emit `space.repost_created` / `space.post_reposted_by_other` | SQL assertion on reject paths |

**Error policy (implementation choice within slice):**

- Prefer dedicated code e.g. **`WS2_PROPAGATION_REPOST_FORBIDDEN`** in JSON error body.
- May reuse **`VALIDATION_ERROR`** if message is **stable and documented** in impl report — OpenAPI sync **not required** for gate.

**`repostPost` default visibility:** Must change from `body?.visibility ?? 'public'` to **reject** unless explicitly **private** (policy P1/P4).

---

## 6. Required Tests (Investigation №5)

### 6.1 Mandatory new/updated HTTP tests

**Primary file:** `apps/space-service/test/request.test.ts`

| Test ID | Description | Expected |
| --- | --- | --- |
| **T-WS2-W1** | `createPost` repost + `visibility: public` | **4xx**; no insert |
| **T-WS2-W2** | `createPost` repost + `visibility: group` + `groupId` | **4xx** |
| **T-WS2-W3** | `repostPost` default (no visibility) | **4xx** (no longer 201 public) |
| **T-WS2-W4** | `repostPost` explicit `visibility: group` | **4xx** |
| **T-WS2-W5** | `createPost` repost + `visibility: private` (place target) | **201** (retain/regress private path) |
| **T-WS2-W6** | `createPost` repost + `visibility: private` (space_post) | **201**; no public activity SQL |
| **T-WS2-W7** | Authorial post publish still **201** | Regress existing authorial cases |
| **T-WS2-W8** | SR on repost write still rejected | Regress `rejects authorialExpressionIntent on repost writes` / E-AC-04 |

### 6.2 Tests to refactor (not delete coverage)

| Current test (approx.) | Change |
| --- | --- |
| `preserves incoming repost activity for public space-post reposts` | Expect **reject**; rename to reject variant |
| `preserves incoming repost activity for group space-post reposts` | Expect **reject** |
| `does not let public propagation repost satisfy private retention dedupe` | May keep as **reject-before-insert** or dedupe isolation — align with WB-6 |

### 6.3 Domain / contract tests (regression)

| File | Role |
| --- | --- |
| `apps/space-service/test/establishmentTier.contract.test.ts` | Must remain **PASS** — no literal flip |
| `apps/space-service/test/retentionIntent.test.ts` (if exists) or add | Classify propagation vs private — optional |
| `apps/space-service/test/savePublishBoundary.test.ts` | No private path regression |
| `apps/space-service/test/sourceReferenceBoundary.test.ts` | P5 on P4 only |

### 6.4 Suite commands (future impl acceptance)

```bash
pnpm --filter @go2asia/space-service test
pnpm --filter @go2asia/space-service exec vitest run test/establishmentTier.contract.test.ts
pnpm --filter @go2asia/space-service typecheck
pnpm --filter @go2asia/space-service lint
```

---

## 7. Acceptance Criteria (Investigation №6)

Future stage **`Stage 13B.5-WS2-IMPL-WRITE`** (implementation + review) must satisfy:

| # | Criterion |
| --- | --- |
| **AC-1** | All §5 behavior IDs **WB-1..WB-11** implemented |
| **AC-2** | All §6 mandatory tests **T-WS2-W1..W8** green |
| **AC-3** | Full `@go2asia/space-service` test suite **PASS** |
| **AC-4** | `establishmentTier.contract.test.ts` **PASS** |
| **AC-5** | `typecheck` **PASS** |
| **AC-6** | `lint` **PASS** |
| **AC-7** | Diff scope ⊆ §3.1; no §3.2 files without explicit gate amendment |
| **AC-8** | No OpenAPI/SDK change **unless** documented in impl report with justification |
| **AC-9** | No DB migration / legacy mutation |
| **AC-10** | `isWs2Authorized`, `isFoundationTrioReady`, CO-13/CO-S12 literals **unchanged (false)** |
| **AC-11** | `ws2_authorized` program token **unchanged (FALSE)** |
| **AC-12** | Impl review report: **`WS2_IMPL_WRITE_IMPLEMENTATION_COMPLETE`** (or DEFERRED with blockers) |

**This gate does not run AC-1..AC-12** — it only authorizes the attempt.

---

## 8. False-Pass Catalog (Investigation №7)

| ID | False pass pattern | Guard |
| --- | --- | --- |
| **FP-1** | UI-only Share-to-Space removal; API still creates public repost | WB-1/3 + T-WS2-W1/W3 |
| **FP-2** | Hide/delete legacy rows | Forbidden in scope; PR review |
| **FP-3** | OpenAPI-only “repost deprecated” without write reject | FP-1 |
| **FP-4** | Block **all** repost including private | T-WS2-W5/W6 |
| **FP-5** | Silent convert public repost request → authorial post | Forbidden; must **reject** |
| **FP-6** | Policy gate treated as implementation complete | Separate PR/RR stage |
| **FP-7** | Impl slice treated as `WS2_AUTHORIZED` | Token lock in AC-10/11 |
| **FP-8** | Global `implementation_authorized: TRUE` | Forbidden token |
| **FP-9** | `repostPost` still defaults to `public` | WB-3; code review `spaceService.ts` L699 |
| **FP-10** | Flip `isWs2Authorized` in proof objects | AC-10 |
| **FP-11** | READ feed still shows new public repost while claiming WRITE done | WRITE ≠ WS-2 auth; document in PR |

---

## 9. Gate Decision (Investigation №8)

**Decision:** **`WS2_IMPL_WRITE_AUTHORIZED`**

**Rationale:** All §2 prerequisites **PASS**; policy **ACCEPTED**; scope is **bounded** and **minimal**; target surfaces identified; tests and false-pass catalog are **actionable**; no canon conflict.

**Not deferred because:** No missing policy decision blocks write-only enforcement; Trio + WS-5 distinction already operational for collapse prevention.

### 9.1 If Authorized — next stage package

| Field | Value |
| --- | --- |
| **Next stage ID** | **`Stage 13B.5-WS2-IMPL-WRITE`** — Public/Group Repost Write Block Implementation |
| **Token (per-slice)** | `ws2_impl_write_implementation_authorized: TRUE` |
| **Global token** | `implementation_authorized: FALSE` |
| **Deliverable** | Code + tests in §4–§6; implementation report `stage_13B_5_WS2_IMPL_WRITE_public_group_repost_write_block_implementation_v1.md` |
| **Review** | Follow-on **`WS2-IMPL-WRITE-PR`** or `PR/RR` pattern per program (`WS2_IMPL_WRITE_IMPLEMENTATION_REVIEW`) |
| **Forbidden in impl** | §3.2, §8 FP-1..FP-11 |

### 9.2 Carve-outs (implementation stage)

| ID | Carve-out |
| --- | --- |
| **CO-WS2-10** | PWA / `ContentActionRow` / `ShareToSpaceComposer` may still call API until separate client slice — service **must** reject propagation |
| **CO-WS2-11** | `followers` visibility on repost → reject as propagation (align with `propagation_repost` classifier) |
| **CO-WS2-12** | READ surfaces may still **display** legacy propagation rows until READ slice |

---

## 10. Agent Findings

### 10.1 AI Program Director / Project Orchestrator

- **WS2AW-ORCH-1:** **First WS-2 implementation slice may open** — prerequisites satisfied — **PASS**.
- **WS2AW-ORCH-2:** **Per-slice auth ≠ `WS2_AUTHORIZED`** — explicit token separation — **PASS**.
- **WS2AW-ORCH-3:** **Per-slice auth ≠ global `implementation_authorized`** — **PASS**.
- **WS2AW-ORCH-4:** **Next** = **`STAGE_13B_5_WS2_IMPL_WRITE`** — **PASS**.
- **WS2AW-ORCH-5:** PWA out of scope with **service-side reject** mandatory — **PASS**.

### 10.2 Slice Strategist

- **WS2AW-STRAT-1:** Scope is **minimal** — write boundary only — **PASS**.
- **WS2AW-STRAT-2:** **READ-PUB**, **READ-GRP**, **ACTIVITY**, **COPY** explicitly **out** — **PASS**.
- **WS2AW-STRAT-3:** **`repostPost` default public** must be in slice — highest-leak path — **PASS**.
- **WS2AW-STRAT-4:** No OpenAPI/SDK unless error code policy forces — default **exclude** — **PASS**.

### 10.3 Runtime Governance Architect

- **WS2AW-GOV-1:** Authorization aligns with **WS2-PD-1 P1/P2/P4/P5** and **PD-2 S1–S3** — **PASS**.
- **WS2AW-GOV-2:** Does **not** claim E6/E8 full closure — only E3 **write** step — **PASS**.
- **WS2AW-GOV-3:** Legacy **no mutate** — WS-5 aligned — **PASS**.
- **WS2AW-GOV-4:** Proof literals stay **false** — **PASS**.
- **WS2AW-GOV-5:** **`followers`** repost treated as propagation — **PASS**.

### 10.4 Runtime Validation Agent

- **WS2AW-VAL-1:** Test requirements **sufficient** for bounded slice — **PASS**.
- **WS2AW-VAL-2:** Must **invert** public/group success tests in `request.test.ts` — **PASS**.
- **WS2AW-VAL-3:** Establishment suite remains mandatory gate — **PASS**.
- **WS2AW-VAL-4:** **WS2-BV-EXEC** remains **downstream** — **PASS**.
- **WS2AW-VAL-5:** Negative SQL assertions for activity on reject paths — **PASS**.

### 10.5 Backend Developer

- **WS2AW-BE-1:** Primary edit surface: **`spaceService.ts`** `createPost` + **`repostPost`** — **PASS**.
- **WS2AW-BE-2:** Recommend **`assertWs2PropagationWriteAllowed`** in `domain/` before heavy assert chain — early fail — **PASS**.
- **WS2AW-BE-3:** **Risk:** reject too late after partial validation — place guard **immediately after** `postType` + `visibility` validated — **PASS**.
- **WS2AW-BE-4:** **Risk:** `repostPost` spread body bypass — normalize visibility before policy assert — **PASS**.
- **WS2AW-BE-5:** Dedupe block must still see **only** private retention creates — **PASS**.

### 10.6 QA Agent

- **WS2AW-QA-1:** **Highest risk:** FP-9 `repostPost` public default — **FLAG** for impl review — **PASS**.
- **WS2AW-QA-2:** Second risk: FP-4 blocking private repost — **FLAG** — **PASS**.
- **WS2AW-QA-3:** Third risk: FP-7 confusing impl auth with WS-2 auth — **PASS**.
- **WS2AW-QA-4:** Tests at L506+ (public/group activity) **must** flip to reject — **PASS**.
- **WS2AW-QA-5:** FP-11: do not sign WS-2 auth at WRITE PR — **PASS**.

### 10.7 Technical Canon Writer

- **WS2AW-CANON-1:** Impl prompt opening: *"Implement WS2-IMPL-WRITE per WS2-PD-1 hard reject; private repost only; no ws2_authorized flip."* — **PASS**.
- **WS2AW-CANON-2:** Verdict string: **`WS2_IMPL_WRITE_AUTHORIZED`** **≠** **`WS2_AUTHORIZED`** — **PASS**.
- **WS2AW-CANON-3:** Cite **`POST_TRANSITION_PROPAGATION_REPOST_FORBIDDEN`** policy token from POLICY gate — **PASS**.
- **WS2AW-CANON-4:** PR title pattern: `feat(stage-13b5): WS2-IMPL-WRITE block public/group repost writes` — **PASS**.
- **WS2AW-CANON-5:** Completion token: **`WS2_IMPL_WRITE_IMPLEMENTATION_COMPLETE`** — reserved for impl stage — **PASS**.

### 10.8 Disagreements

| Topic | A | B | Resolution |
| --- | --- | --- | --- |
| New domain file vs inline | New `ws2PropagationWritePolicy.ts` | Inline only | **Recommend new file**; inline acceptable if single assert |
| OpenAPI sync | Required | Optional | **Optional** if stable JSON code without schema change |
| `followers` repost | Defer | Reject now | **Reject now** (CO-WS2-11) |

**Blocking disagreement:** None.

---

## 11. Final Verdict

**`WS2_IMPL_WRITE_AUTHORIZED`**

| Verdict | Used? |
| --- | --- |
| `WS2_IMPL_WRITE_AUTHORIZED` | **YES** |
| `WS2_IMPL_WRITE_AUTH_DEFERRED` | **NO** |
| Forbidden: `WS2_AUTHORIZED`, `IMPLEMENTATION_AUTHORIZED_GLOBAL`, `WS2_IMPLEMENTATION_STARTED`, `WS2_BV_EXECUTION_PASS` | **NONE issued** |

### Authorization tokens

```yaml
stage_13B_5_WS2_IMPL_AUTH_WRITE_status: PASS
stage_13B_5_WS2_IMPL_AUTH_WRITE_verdict: WS2_IMPL_WRITE_AUTHORIZED
stage_13B_5_WS2_IMPL_AUTH_WRITE_execution_mode: GOVERNANCE_SLICE_AUTHORIZATION_GATE_ONLY
ws2_impl_write_implementation_authorized: TRUE
implementation_authorized_global: FALSE
ws2_authorized: FALSE
foundation_trio_ready: TRUE
ws_2_runtime_baseline: RUNTIME_PRE_TRANSITION
stage_13B_5_WS2_IMPL_AUTH_WRITE_next_safe_step: STAGE_13B_5_WS2_IMPL_WRITE
```

---

## Execution Summary

| Field | Value |
| --- | --- |
| **Report** | `docs/reports/stage_13B_5_WS2_IMPL_AUTH_WRITE_public_group_repost_write_block_authorization_gate_v1.md` |
| **Verdict** | `WS2_IMPL_WRITE_AUTHORIZED` |
| **Next** | `STAGE_13B_5_WS2_IMPL_WRITE` |
| **Code changes** | **NONE** |

### Invariant reminder

```text
WS2-IMPL-AUTH-WRITE ≠ WS2_AUTHORIZED
Per-slice implementation authorization ≠ global implementation_authorized
Authorization gate ≠ implementation
```
