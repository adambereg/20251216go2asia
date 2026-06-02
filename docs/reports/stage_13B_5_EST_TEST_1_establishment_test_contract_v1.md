# Stage 13B.5-EST-TEST-1 — Establishment Test Contract Specification & Implementation

**Document class:** `ESTABLISHMENT_TEST_CONTRACT_IMPLEMENTATION`  
**Not:** Full Establishment Gate · tier grant · Ready · WS-2 · literal flip · FT-X1/FT-X2 full EST display

**Authority:** `stage_13B_5_FE_PP_p4_p5_full_establishment_planning_v1.md` — **`FULL_ESTABLISHMENT_PLAN_COMPLETE`**

**Operative canon:** `Go2Asia Foundation Primitive Maturity & Establishment Canon v1` — **EST-E1** (`stage_13B_6_B_establishment_canon_proposal_v1.md` §5.3)

**Multi-agent mode:** `docs/ai/roles/` — 7 agents, §11 per-agent findings.

---

## 1. Executive Summary

**EST-TEST-1** is implemented as a **named Vitest contract** in `apps/space-service/test/establishmentTier.contract.test.ts` with **23 establishment-tier cases** (`E-P4-*`, `E-P5-*`, `E-AC-*`), runnable via **`pnpm --filter @go2asia/space-service test:establishment`**.

**Regression:** Full space-service suite **199/199 PASS** (176 prior + 23 establishment). **Typecheck PASS.** **Lint PASS** (0 errors; pre-existing import-order warnings).

**Verdict:** **`EST_TEST_1_IMPLEMENTED_AND_PASSING`**

**This stage does not grant:** P4/P5 full `ESTABLISHED`, `foundation_trio_ready`, `ws2_authorized`, or CO-13/CO-S12 `true`.

**Deferred (documented, not fixed here):** P4 **E4 HTTP** for `publications` / `highlight` routes (LR-N1 / LR-N2) — remains blocker for **EST-R3** at FE-P4 gate; domain matrix coverage included in **E-P4-07**.

**Next safe step:** **`Stage 13B.5-FE-P4-SURF`** (publications/highlight HTTP evidence) **then** **`Stage 13B.5-FE-P4`** Full Establishment Gate.

---

## 2. EST-TEST-1 Contract Definition (Investigation №1)

| Question | Answer |
| --- | --- |
| **What is EST-TEST-1?** | Canon **EST-E1** automated contract: establishment-tier behavioral proof for P4/P5 + anti-collapse rollup. |
| **Where it lives** | `apps/space-service/test/establishmentTier.contract.test.ts` |
| **Documentation** | `apps/space-service/test/EST_TEST_1.md` |
| **Naming** | Describe prefix: `EST-TEST-1 —`; evidence IDs in test titles: `E-P4-01`, `E-P5-01`, `E-AC-01` |
| **How to run** | `pnpm --filter @go2asia/space-service test:establishment` |
| **Pass condition** | Exit code **0** on establishment file; full `test` remains green |
| **Included** | Domain write/read/rehydrate; P4 chain (3A+3C+3D); P5 chain (3B+persist); anti-collapse; CO literals stay `false`; routed read surfaces; publications **domain** guard |
| **Excluded** | OpenAPI-only; SDK-only; DB migration alone; governance verdict; literal `true`; WS-2 semantics; full HTTP publications/highlight routes |
| **Bounded vs establishment** | **Bounded:** `FT-3A`…`FT-3B` `*.test.ts`, `request.test` slice paths → EBB. **Establishment:** `establishmentTier.contract.test.ts` → EST-E1 for **future EST gates**. Companion HTTP: cite `request.test.ts` in gates (authorial create, SR create, T-PP). |

---

## 3. Files Changed

| File | Action |
| --- | --- |
| `apps/space-service/test/establishmentTier.contract.test.ts` | **CREATED** — 23 tests |
| `apps/space-service/test/EST_TEST_1.md` | **CREATED** — contract doc |
| `apps/space-service/package.json` | **UPDATED** — `test:establishment` script |
| `docs/reports/stage_13B_5_EST_TEST_1_establishment_test_contract_v1.md` | **CREATED** — this report |

**Not changed:** `src/**` runtime, OpenAPI, SDK, DB, CO-13/CO-S12 literals, FT-X1/FT-X2 tier display.

---

## 4. P4 Establishment Test Coverage (Investigation №2)

| Requirement | Evidence ID | Status |
| --- | --- | --- |
| Independent authorial object (not repost) | E-P4-01 | **PASS** |
| Not private save (P1) | E-P4-02 | **PASS** |
| No legacy repost mechanics on write | E-P4-03 | **PASS** |
| Expression + independence + save/publish chain | E-P4-04 | **PASS** |
| CO-13 literal `false` | E-P4-05 | **PASS** |
| Read-visible routed surfaces (domain) | E-P4-06 | **PASS** — home, profile, group, activity, post_detail |
| Publications domain guard | E-P4-07 | **PASS** (domain); **HTTP deferred** |
| Legacy row ≠ authorial on read | E-P4-08 | **PASS** |
| Save/publish collapse rejected | E-P4-09 | **PASS** |

**Companion bounded/HTTP (cite in FE-P4, not duplicated):** `request.test.ts` — authorial create, repostTarget rejection, save/publish rejection, dedupe non-block.

**Gap after EST-TEST-1:** **highlight** surface has **no** `applyAuthorialExpressionReadGuards('highlight', …)` case in establishment suite (matrix domain tests in `perSurfaceLegacyMatrix.test.ts` only). **HTTP** for publications/highlight — **FE-P4-SURF**.

---

## 5. P5 Establishment Test Coverage (Investigation №3)

| Requirement | Evidence ID | Status |
| --- | --- | --- |
| SR only on P4; optional 0..1 | E-P5-01 | **PASS** |
| One-hop on authorial post | E-P5-02 | **PASS** |
| repostTarget ≠ SR | E-P5-03 | **PASS** |
| Non-authorial rejected | E-P5-04 | **PASS** |
| Persist + rehydrate with P4 | E-P5-05 | **PASS** |
| Legacy repost cannot carry SR | E-P5-06 | **PASS** |
| CO-S12 literal `false`; not WS-2/Ready | E-P5-07 | **PASS** |
| Chain keys rejected | E-P5-08 | **PASS** |
| Combined P4+P5 write path | E-P5-09 | **PASS** |

**Companion HTTP:** `request.test.ts` — SR on authorial create; T-PP-2/3 rehydration (`persistenceRehydration.test.ts` also cited).

---

## 6. Anti-Collapse Test Coverage (Investigation №4)

| Collapse risk | Evidence ID | Status |
| --- | --- | --- |
| P4 → P1 Private Repost | E-AC-01 | **PASS** |
| P4 → P2 Private Note | E-AC-02 | **PASS** |
| P5 → repostTarget | E-AC-03 | **PASS** |
| P5 → public repost / WS-2 semantics | E-AC-04 | **PASS** |
| Legacy row ≠ P4/P5 rehydration | E-AC-05 | **PASS** |

**Note:** P3 Bookmark collapse covered in bounded `FT-3B` / `authorialExpression` suites — establishment rollup focuses P4/P5/legacy per FE-PP scope.

---

## 7. Evidence IDs for Future Gates (Investigation №5)

### 7.1 Commands and suite

| Artifact | Value |
| --- | --- |
| **Primary command** | `pnpm --filter @go2asia/space-service test:establishment` |
| **Regression command** | `pnpm --filter @go2asia/space-service test` |
| **Suite file** | `test/establishmentTier.contract.test.ts` |
| **Pass condition** | **23/23** establishment tests PASS; **199/199** full suite PASS |
| **JUnit** | `apps/space-service/test-results/junit.xml` (Vitest CI reporter) |

### 7.2 FE-P4 gate may cite

| Evidence ID | Description |
| --- | --- |
| **EST-TEST-1-SUITE** | Establishment contract PASS (this stage) |
| **E-P4-01..09** | P4 establishment-tier domain matrix |
| **E-AC-01..05** | Anti-collapse rollup |
| **request.test** (companion) | HTTP authorial paths |
| **FT-3A/3C/3D** (bounded) | Slice acceptances — still required per EST-G6 |

### 7.3 FE-P5 gate may cite

| Evidence ID | Description |
| --- | --- |
| **EST-TEST-1-SUITE** | Establishment contract PASS |
| **E-P5-01..09** | P5 establishment-tier domain matrix |
| **E-AC-03..05** | SR collapse guards |
| **request.test T-PP** (companion) | HTTP + persistence rehydration |

### 7.4 Still missing after EST-TEST-1 (for full ESTABLISHED)

| Gap | Blocks | Next slice |
| --- | --- | --- |
| **EST-G1** Full Establishment Gate verdict | `P_ESTABLISHED` label | FE-P4 / FE-P5 |
| **EST-R3** E4 HTTP publications/highlight | P4 full surface story | **FE-P4-SURF** |
| **EST-R4** E8 FILLED at establishment tier | P4 legacy handshake | FE-P4 + WS-5 evidence |
| **FT-X2 13b** | Spine full EST slot | FE-*-APPLY after gates |
| **EST-R5 / EST-L2** | Literal `true` | LIT-P4 / LIT-P5 |
| **WS-3 steps 1–12 FILLED** | Strict spine tier | Gate + spine refresh |

---

## 8. Commands Executed

| Command | Applicable? | Result |
| --- | --- | --- |
| `pnpm --filter @go2asia/space-service test:establishment` | **YES** | **23/23 PASS** |
| `pnpm --filter @go2asia/space-service test` | **YES** | **199/199 PASS** |
| `pnpm --filter @go2asia/space-service typecheck` | **YES** | **PASS** |
| `pnpm --filter @go2asia/space-service lint` | **YES** | **PASS** (0 errors) |

---

## 9. Results

| Metric | Value |
| --- | --- |
| Establishment tests added | **23** |
| Prior space-service tests | **176** |
| Total after stage | **199** |
| Runtime / API / literal changes | **NONE** |
| Tier grants | **NONE** |

---

## 10. Known Gaps / Deferred Items

| ID | Gap | Why not in EST-TEST-1 | Owner stage |
| --- | --- | --- | --- |
| **GAP-EST-HTTP-PUB** | No HTTP handler passes `surface: 'publications'` | Feature/surface slice (LR-N1) | **FE-P4-SURF** |
| **GAP-EST-HTTP-HL** | No highlight URL read hook in `spaceService` | Feature/surface slice (LR-N2) | **FE-P4-SURF** |
| **GAP-EST-E8** | FT-X2 step 12 `[STRUCTURE]` not establishment FILLED | Requires gate + WS-5 handshake evidence | **FE-P4** |
| **GAP-EST-LIT** | CO-13/CO-S12 remain `false` | By design until LIT slice | **LIT-P4/P5** |
| **GAP-EST-13B** | FT-X2 step 13b BLOCKED | Requires EST gate | **FE-P4/P5** |

**Scope discipline:** No publications/highlight HTTP implementation in this stage — **honored**.

---

## 11. Agent Findings

### 11.1 AI Program Director / Project Orchestrator

- **ET1-ORCH-1:** Stage aligns with **FE-PP** roadmap next step — **PASS**.
- **ET1-ORCH-2:** **No forbidden status** granted — **PASS**.
- **ET1-ORCH-3:** Evidence layer **ready** for FE gates with documented HTTP gap — **PASS**.
- **ET1-ORCH-4:** **EST-TEST-1 ≠ ESTABLISHED** — communicated in contract doc — **PASS**.
- **ET1-ORCH-5:** Recommend **FE-P4-SURF** before **FE-P4** due to GAP-EST-HTTP-*.

### 11.2 Slice Strategist

- **ET1-STRAT-1:** Scope **bounded** to test contract — no surface impl — **PASS**.
- **ET1-STRAT-2:** **FE-P4-SURF** correctly **out-of-band** — **PASS**.
- **ET1-STRAT-3:** `test:establishment` script enables **repeatable gate CI** — **PASS**.
- **ET1-STRAT-4:** Next: **FE-P4-SURF** → **FE-P4** → **FE-P5** — **PASS**.

### 11.3 Runtime Governance Architect

- **ET1-GOV-1:** **Canon v1 EST-E1** satisfied at **evidence-contract** layer — **PASS**.
- **ET1-GOV-2:** **ESTABLISHED_BOUNDED ≠ ESTABLISHED** — no tier conflation — **PASS**.
- **ET1-GOV-3:** Tests **do not replace** governance gate — **PASS**.
- **ET1-GOV-4:** Literals **unchanged** — **PASS**.
- **ET1-GOV-5:** **P5 ≠ repostTarget / ≠ WS-2** covered in E-P5/E-AC — **PASS**.

### 11.4 Runtime Validation Agent

- **ET1-VAL-1:** Matrix covers **write, read, rehydrate, negatives** — **adequate for EST-E1 contract**.
- **ET1-VAL-2:** **Routed surfaces** exercised; **highlight** establishment read case **deferred** — note GAP-EST-HTTP-HL.
- **ET1-VAL-3:** **199/199** regression — **no bounded regression**.
- **ET1-VAL-4:** HTTP positives remain **companion** evidence in `request.test` — **PASS**.

### 11.5 Backend Developer

- **ET1-BE-1:** **Tests-only** change in `test/` + `package.json` script — **PASS**.
- **ET1-BE-2:** **No `src/` edits** — **PASS**.
- **ET1-BE-3:** Assertions use **existing domain APIs** — stable — **PASS**.
- **ET1-BE-4:** Proof field names aligned to **`buildAuthorialP4ClassificationProof`** / **`buildSourceReferenceProof`** — **PASS**.

### 11.6 QA Agent

- **ET1-QA-1:** Commands **reproducible** on Windows PowerShell — **PASS**.
- **ET1-QA-2:** **PASS/FAIL:** establishment **23/23**, full **199/199** — **PASS**.
- **ET1-QA-3:** Evidence IDs **machine-grep-friendly** (`E-P4-`, `E-P5-`, `E-AC-`) — **PASS**.
- **ET1-QA-4:** JUnit output path documented for CI — **PASS**.

### 11.7 Technical Canon Writer

- **ET1-CANON-1:** Wording **EST-TEST-1** / **EST-E1** aligned with Canon v1 — **PASS**.
- **ET1-CANON-2:** **FE-P4** may cite: `EST-TEST-1-SUITE`, `E-P4-*`, companion `request.test` — **PASS**.
- **ET1-CANON-3:** **FE-P5** may cite: `E-P5-*`, T-PP companion — **PASS**.
- **ET1-CANON-4:** Report states **tests alone ≠ ESTABLISHED** — **PASS**.

### 11.8 Disagreements

None blocking.

---

## 12. Final Verdict

**`EST_TEST_1_IMPLEMENTED_AND_PASSING`**

| Verdict | Used? |
| --- | --- |
| `EST_TEST_1_IMPLEMENTED_AND_PASSING` | **YES** |
| `EST_TEST_1_SPECIFIED_WITH_GAPS` | **NO** (contract implemented; HTTP gap deferred explicitly) |
| `EST_TEST_1_DEFERRED_RUNTIME_GAP_FOUND` | **NO** |
| Forbidden grants | **NONE** |

### Final tokens

```yaml
stage_13B_5_EST_TEST_1_status: PASS
stage_13B_5_EST_TEST_1_verdict: EST_TEST_1_IMPLEMENTED_AND_PASSING
stage_13B_5_est_test_1_suite_file: apps/space-service/test/establishmentTier.contract.test.ts
stage_13B_5_est_test_1_test_count: 23
stage_13B_5_est_test_1_command: pnpm --filter @go2asia/space-service test:establishment
stage_13B_5_p4_current_tier: ESTABLISHED_BOUNDED
stage_13B_5_p5_current_tier: ESTABLISHED_BOUNDED
stage_13B_5_p4_established_full: FALSE
stage_13B_5_p5_established_full: FALSE
foundation_trio_ready: FALSE
ws2_authorized: FALSE
stage_13B_5_EST_TEST_1_next_safe_step: STAGE_13B_5_FE_P4_SURF_PUBLICATIONS_HIGHLIGHT_SURFACE_EVIDENCE
```

### Invariants (preserved)

```
ESTABLISHED_BOUNDED ≠ ESTABLISHED
EST-TEST-1 ≠ Full ESTABLISHED grant
ESTABLISHED ≠ READY ≠ WS-2 AUTHORIZED
P5 ≠ repostTarget ≠ WS-2 propagation replacement
Persistence/OpenAPI/SDK/tests alone ≠ governance establishment
```

---

## Execution Summary

| Field | Value |
| --- | --- |
| **Report** | `docs/reports/stage_13B_5_EST_TEST_1_establishment_test_contract_v1.md` |
| **Contract** | `apps/space-service/test/EST_TEST_1.md` |
| **Tests** | **23** new + **176** existing = **199 PASS** |
| **Verdict** | **`EST_TEST_1_IMPLEMENTED_AND_PASSING`** |
| **Next** | **FE-P4-SURF** (HTTP gap), then **FE-P4** gate |
