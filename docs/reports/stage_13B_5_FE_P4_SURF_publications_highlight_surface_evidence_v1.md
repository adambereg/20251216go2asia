# Stage 13B.5-FE-P4-SURF — Publications / Highlight Surface Evidence

**Document class:** `P4_SURFACE_EVIDENCE_IMPLEMENTATION`  
**Not:** P4 full ESTABLISHED · P5 ESTABLISHED · Ready · WS-2 · FT-X1/FT-X2 tier grant · Literal authorization · FE-P4 Gate

**Authority:** `stage_13B_5_EST_TEST_1_establishment_test_contract_v1.md` — **GAP-EST-HTTP-PUB**, **GAP-EST-HTTP-HL**

**Operative canon:** Canon v1 **EST-R3** (E4 surface role at establishment tier — `stage_13B_6_B_establishment_canon_proposal_v1.md` §5.2)

---

## 1. Executive Summary

This stage closes **P4 EST-R3 HTTP surface evidence gaps** identified after EST-TEST-1:

| Gap | Status after SURF |
| --- | --- |
| **GAP-EST-HTTP-PUB** | **CLOSED** |
| **GAP-EST-HTTP-HL** | **CLOSED** |

**Implementation:** Minimal read paths wire **`publications`** and **`highlight`** `LegacySurfaceId` values through `mapPostResponse` → `applyAuthorialExpressionReadGuards`, with HTTP routes and establishment-tier tests.

**Verdict:** **`P4_SURFACE_EVIDENCE_IMPLEMENTED`**

**Regression:** **205/205** tests PASS; establishment **24/24** PASS; typecheck PASS.

**Next safe step:** **`Stage 13B.5-FE-P4 — P4 Full Establishment Gate`**

**Explicit non-grants:** `P4_ESTABLISHED`, `foundation_trio_ready`, `ws2_authorized` — unchanged.

---

## 2. GAP-EST-HTTP-PUB Analysis (Investigation №1)

| Field | Detail |
| --- | --- |
| **Source** | `stage_13B_5_EST_TEST_1_establishment_test_contract_v1.md` §10 **GAP-EST-HTTP-PUB**; `stage_13B_5_LR_ft_5D_implementation_review_and_acceptance_v1.md` **LR-N1** |
| **Current before SURF** | FT-5D domain matrix + `perSurfaceLegacyMatrix.test.ts` T4; profile feed HTTP used **`profile_feed`** only |
| **Why gap existed** | `listProfileFeedPosts` results mapped with **`profile_feed`** surface — **`publications`** distinct surface never passed to `mapPostResponse` on HTTP |
| **Minimal closure** | `getPublicationsFeed` + `GET /v1/space/feed/publications/:userId` → `buildFeedResponse(..., 'publications')` |
| **Runtime paths** | `feed.ts` → `getPublicationsFeed` → `canViewPost` filter → `mapPostResponse(db, row, 'publications')` → authorial rehydration |

---

## 3. GAP-EST-HTTP-HL Analysis (Investigation №1)

| Field | Detail |
| --- | --- |
| **Source** | EST-TEST-1 **GAP-EST-HTTP-HL**; LR **LR-N2** |
| **Current before SURF** | `assertHighlightSurfaceMatrix()` domain-only (T6); no HTTP read hook |
| **Why gap existed** | No route invoked `mapPostResponse(..., 'highlight')` for post-shaped reads; no artifact endpoint |
| **Minimal closure** | (1) `GET /v1/space/highlight/:postId` → `getHighlightPostRead` → surface **`highlight`**; (2) `GET /v1/space/highlight/reference` → `getHighlightReferenceSurface` (artifact carve-out, no DB) |
| **Runtime paths** | `posts.ts` (reference before `:postId` regex); `getHighlightPostRead` / `getHighlightReferenceSurface` |

**Route ordering note:** `/v1/space/highlight/reference` is registered **before** `/v1/space/highlight/:postId` regex to avoid treating `reference` as post id.

---

## 4. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/services/spaceService.ts` | `getPublicationsFeed`, `getHighlightPostRead`, `getHighlightReferenceSurface` |
| `apps/space-service/src/routes/feed.ts` | Publications feed route |
| `apps/space-service/src/routes/posts.ts` | Highlight post + reference routes |
| `apps/space-service/test/request.test.ts` | SURF-PUB-1/2, SURF-HL-1/2/3 |
| `apps/space-service/test/establishmentTier.contract.test.ts` | E-P4-08 highlight domain guard |
| `apps/space-service/test/EST_TEST_1.md` | SURF routes + gap closure note |
| `docs/reports/stage_13B_5_FE_P4_SURF_publications_highlight_surface_evidence_v1.md` | This report |

**Not changed:** OpenAPI, SDK, CO-13/CO-S12, FT-X1/FT-X2 display tiers.

---

## 5. Publications Surface Evidence (Investigation №2)

| Check | Result | Evidence |
| --- | --- | --- |
| Route exists | **YES** | `GET /v1/space/feed/publications/:userId` |
| Read path | **YES** | `getPublicationsFeed` → `mapPostResponse(..., 'publications')` |
| Authorial read guards | **YES** | `applyAuthorialExpressionReadGuards('publications', …)` |
| P4 classification / rehydration | **YES** | `authorialExpressionIntent` + `sourceReference` on authorial row |
| Establishment evidence | **YES** | **SURF-PUB-1** (positive), **SURF-PUB-2** (legacy negative), **E-P4-07** (domain) |

---

## 6. Highlight Surface Evidence (Investigation №3)

| Check | Result | Evidence |
| --- | --- | --- |
| Post read route | **YES** | `GET /v1/space/highlight/:postId` |
| Read path | **YES** | `getHighlightPostRead` → `mapPostResponse(..., 'highlight')` |
| Authorial read guards | **YES** | Non-repost authorial carrier passes `assertAuthorialReadCarrier` |
| Reference artifact route | **YES** | `GET /v1/space/highlight/reference` |
| Rehydration | **YES** | **SURF-HL-1** |
| Establishment evidence | **YES** | **SURF-HL-1/2/3**, **E-P4-08** (domain) |

---

## 7. EST-TEST-1 Integration (Investigation №4)

| Evidence ID | Layer | Status |
| --- | --- | --- |
| **E-P4-07** | Domain `publications` | **PASS** |
| **E-P4-08** | Domain `highlight` | **PASS** (new) |
| **SURF-PUB-1** | HTTP publications authorial | **PASS** |
| **SURF-PUB-2** | HTTP publications legacy negative | **PASS** |
| **SURF-HL-1** | HTTP highlight authorial rehydrate | **PASS** |
| **SURF-HL-2** | HTTP highlight reference artifact | **PASS** |
| **SURF-HL-3** | HTTP highlight legacy negative | **PASS** |

**No EST-TEST-2.** Establishment suite: **24** tests (was 23).

**FE-P4 may cite:** `EST-TEST-1-SUITE` + **SURF-*** HTTP IDs + **E-P4-07/08**.

---

## 8. Commands Executed

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service test:establishment` | **24/24 PASS** |
| `pnpm --filter @go2asia/space-service test` | **205/205 PASS** |
| `pnpm --filter @go2asia/space-service typecheck` | **PASS** |
| `pnpm --filter @go2asia/space-service lint` | **PASS** (0 errors; pre-existing warnings) |

---

## 9. Results

| Metric | Value |
| --- | --- |
| GAP-EST-HTTP-PUB | **CLOSED** |
| GAP-EST-HTTP-HL | **CLOSED** |
| EST-R3 HTTP surface layer | **SATISFIED** for publications + highlight |
| P4 tier | **`ESTABLISHED_BOUNDED`** (unchanged) |
| P4 full ESTABLISHED | **FALSE** (unchanged) |

---

## 10. Remaining Establishment Gaps (out of scope — documented only)

| Gap | Why still open | Next stage |
| --- | --- | --- |
| **EST-G1** Full Establishment Gate | Governance verdict not run | **FE-P4** |
| **FT-X2 step 13b** | Full EST not granted | **FE-P4** + APPLY |
| **EST-TEST-1** alone | Evidence ≠ tier | **FE-P4** cites suite |
| **E8 handshake FILLED** (step 12) | WS-5 establishment tier | **FE-P4** |
| **EST-R5 / CO-13 literal `true`** | Literal policy slice | **LIT-P4** after EST |
| **E8 BV / WS-5 full spine** | Ready rollup | **Ready v2** |

**Scope discipline:** No expansion into E8 full handshake implementation beyond what SURF paths require — **honored**.

---

## 11. Agent Findings

### 11.1 AI Program Director / Project Orchestrator

- **SURF-ORCH-1:** Roadmap position correct — SURF after EST-TEST-1, before FE-P4 — **PASS**.
- **SURF-ORCH-2:** **No forbidden status** granted — **PASS**.
- **SURF-ORCH-3:** **GAP-EST-HTTP-*** closed — evidence layer ready for FE-P4 — **PASS**.
- **SURF-ORCH-4:** **FE-P4** is next gate — not SURF — **PASS**.

### 11.2 Slice Strategist

- **SURF-STRAT-1:** Scope **minimal** — two surfaces, three routes — **PASS**.
- **SURF-STRAT-2:** Reused `listProfileFeedPosts` for publications — **no new query** — **PASS**.
- **SURF-STRAT-3:** Highlight reference **no DB** — smallest artifact hook — **PASS**.
- **SURF-STRAT-4:** Next **FE-P4** — not Ready — **PASS**.

### 11.3 Runtime Governance Architect

- **SURF-GOV-1:** **EST-R3 HTTP gap closed** — **YES** for publications/highlight read paths.
- **SURF-GOV-2:** **EST-R3 ≠ Full ESTABLISHED** — surface evidence only — **PASS**.
- **SURF-GOV-3:** **P5 / WS-2** untouched — **PASS**.
- **SURF-GOV-4:** `mapPostResponse` centralizes surface guards — **consistent** with FR-N2.
- **SURF-GOV-5:** Legacy repost on publications/highlight **not** promoted to P4 — negatives pass.

### 11.4 Runtime Validation Agent

- **SURF-VAL-1:** **SURF-PUB-1/2**, **SURF-HL-1/2/3** — HTTP establishment evidence **present**.
- **SURF-VAL-2:** **GAP-EST-HTTP-PUB** / **GAP-EST-HTTP-HL** — **CLOSED** at validation layer.
- **SURF-VAL-3:** **205** regression — **no bounded regression**.
- **SURF-VAL-4:** Authorial rehydration **observable** on both surfaces — **PASS**.

### 11.5 Backend Developer

- **SURF-BE-1:** **No literal changes** — **PASS**.
- **SURF-BE-2:** **No OpenAPI** change — intentional — **PASS**.
- **SURF-BE-3:** Highlight reference route ordering fix — **correct**.
- **SURF-BE-4:** Publications feed mirrors profile visibility filter — **consistent**.

### 11.6 QA Agent

- **SURF-QA-1:** Commands **reproducible** — **PASS**.
- **SURF-QA-2:** **205/205** + **24/24** establishment — **PASS**.
- **SURF-QA-3:** Evidence IDs **SURF-*** grep-friendly for FE-P4 — **PASS**.
- **SURF-QA-4:** Negative tests prevent false P4 on legacy repost — **PASS**.

### 11.7 Technical Canon Writer

- **SURF-CANON-1:** Wording **surface evidence** not **ESTABLISHED** — **PASS**.
- **SURF-CANON-2:** FE-P4 may cite: **SURF-PUB-1/2**, **SURF-HL-1/2/3**, **E-P4-07/08**, **EST-TEST-1-SUITE**.
- **SURF-CANON-3:** **LR-N1/N2** notes **addressed** at HTTP layer — document in FE-P4 gate.
- **SURF-CANON-4:** Remaining gaps §10 — cite verbatim in FE-P4 **deferrals**.

### 11.8 Disagreements

None blocking.

---

## 12. Final Verdict

**`P4_SURFACE_EVIDENCE_IMPLEMENTED`**

| Verdict | Used? |
| --- | --- |
| `P4_SURFACE_EVIDENCE_IMPLEMENTED` | **YES** |
| `P4_SURFACE_EVIDENCE_PARTIAL` | **NO** |
| `P4_SURFACE_RUNTIME_BLOCKER_FOUND` | **NO** |
| Forbidden grants | **NONE** |

### Final tokens

```yaml
stage_13B_5_FE_P4_SURF_status: PASS
stage_13B_5_FE_P4_SURF_verdict: P4_SURFACE_EVIDENCE_IMPLEMENTED
gap_est_http_pub: CLOSED
gap_est_http_hl: CLOSED
stage_13B_5_p4_current_tier: ESTABLISHED_BOUNDED
stage_13B_5_p4_established_full: FALSE
foundation_trio_ready: FALSE
ws2_authorized: FALSE
stage_13B_5_FE_P4_SURF_next_safe_step: STAGE_13B_5_FE_P4_FULL_ESTABLISHMENT_GATE
```

### Invariants (preserved)

```
ESTABLISHED_BOUNDED ≠ ESTABLISHED
Surface evidence ≠ Full ESTABLISHED
EST-R3 evidence ≠ Full ESTABLISHED
Tests alone ≠ Full ESTABLISHED
```

---

## Execution Summary

| Field | Value |
| --- | --- |
| **Report** | `docs/reports/stage_13B_5_FE_P4_SURF_publications_highlight_surface_evidence_v1.md` |
| **Routes** | `feed/publications/:userId`, `highlight/:postId`, `highlight/reference` |
| **Tests added** | 5 HTTP SURF + 1 establishment domain |
| **Verdict** | **P4_SURFACE_EVIDENCE_IMPLEMENTED** |
| **Next** | **P4 Full Establishment Gate** |
