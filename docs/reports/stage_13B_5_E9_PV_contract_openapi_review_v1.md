# Stage 13B.5-E9-PV — Contract / OpenAPI Review

## 1. Inputs Reviewed

Execution mode:

- `FOUNDATION_TRIO_CONTRACT_OPENAPI_REVIEW_ONLY`
- no coding;
- no OpenAPI edits;
- no SDK generation;
- no runtime / schema / DB / frontend / backend changes;
- no Foundation Trio closure;
- no `foundation_trio_ready` lift;
- no WS-2 authorization.

### Governance documents

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_E9_PP_contract_openapi_planning_v1.md` | **Primary artifact under review** |
| `docs/reports/stage_13B_5_E9_contract_openapi_authorization_gate_v1.md` | E9 gate; E9-COND; PASS/FAIL catalog |
| `docs/reports/stage_13B_5_PJR_foundation_trio_persistence_implementation_review_and_acceptance_v1.md` | Runtime authority; T-PP |
| `docs/reports/stage_13B_5_ZR_ft_x3_foundation_trio_closure_review_v1.md` | Y-HB3; NR-N2/TR-N2 |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | E9 NEVER-SUFFICIENT |

### Code / contract inspected (read-only)

| Path | Role |
| --- | --- |
| `docs/openapi/space.yaml` | Baseline — no authorial/SR fields (grep confirmed) |
| `docs/openapi/openapi.bundle.yaml` | Orval input — same gap |
| `orval.config.ts` | `gen:types` / `gen:sdk` |
| `packages/types/src/generated/createSpacePostRequest.ts` | Drift vs runtime write |
| `packages/types/src/generated/spacePostResponse.ts` | Drift vs runtime read |
| `packages/sdk/src/generated/*` | SDK mirror |
| `apps/space-service/src/domain/sourceReferenceBoundary.ts` | `SOURCE_MATERIAL_TYPES`; parse rules; staging shape |
| `apps/space-service/src/domain/persistenceRehydration.ts` | Read projection |
| `apps/space-service/src/services/spaceService.ts` | `createPost`; `mapPostResponse` |
| `apps/go2asia-pwa-shell/**` (sample) | Primary consumer of `generated.SpacePostResponse` |

### User acceptance (planning)

User accepted **E9-PP** without substantial objections; affirmed **E9-D2 MATERIAL_ONLY** as the defining architectural decision for the E9 track.

### Multi-agent mode

**Activated.** Seven mandated roles; §2 records **per-agent findings** individually.

---

## 2. Multi-Agent Execution Review

| # | Agent | Finding IDs | Disposition |
| --- | --- | --- | --- |
| 1 | **AI Program Director / Project Orchestrator** | ORCH-PV-1..4 | PASS |
| 2 | **Slice Strategist** | STRAT-PV-1..4 | PASS |
| 3 | **Runtime Governance Architect** | GOV-PV-1..4 | PASS |
| 4 | **Runtime Validation Agent** | VAL-PV-1..4 | PASS_WITH_NOTE |
| 5 | **Backend Developer (review mode)** | BE-PV-1..4 | PASS_WITH_NOTE |
| 6 | **QA Agent** | QA-PV-1..4 | PASS |
| 7 | **Technical Canon Writer** | CANON-PV-1..4 | PASS |

### 2.1 Per-agent findings (detail)

**1 — AI Program Director / Project Orchestrator**

- **ORCH-PV-1:** **E9-PP** satisfies E9 gate conditions E9-COND-2/3/4 at planning tier; user acceptance removes PV-COND ambiguity on MATERIAL_ONLY.
- **ORCH-PV-2:** **PV** authorizes **E9-PM** (implementation authorization gate) — not E9-PI execution in this document.
- **ORCH-PV-3:** Program sequence remains **E9-PV → E9-PM → E9-PI → E9-PJR**; Y-HB3 clears at **E9-PJR** only (E9-D9).
- **ORCH-PV-4:** **Y-HB1, Y-HB4, Y-HB6** unchanged — contract plan does not claim E4 FILLED or BV cleared.

**2 — Slice Strategist**

- **STRAT-PV-1:** PP §11.1/11.2 boundary is **correct** — OpenAPI + bundle + Orval artifacts only on `feat/stage-13b5-e9-space-contract`.
- **STRAT-PV-2:** PP correctly **excludes** runtime trim, UI adoption, WS-2, Trio closure from E9-PI — STRAT-PP-4 upheld.
- **STRAT-PV-3:** PWA shell (`SpacePageClient`, `SpaceFeedCard`, `PostsPublicationsSurface`, etc.) is **informational consumer** — follow-on after regen, not PM blocker.
- **STRAT-PV-4:** PM must embed **E9-FAIL-6** — no bundled persistence/BV/visibility fixes in contract PR.

**3 — Runtime Governance Architect**

- **GOV-PV-1:** **E9-D2 MATERIAL_ONLY** is **architecturally correct** — prevents E9-R1/R2 false-pass (proof vocabulary in public contract).
- **GOV-PV-2:** **E9-D3** separate enum required — `SpaceRepostTargetType` and planned `SpaceSourceMaterialType` share seven string values but **must not** share schema type (BV-R3).
- **GOV-PV-3:** **E9-D7** correctly handles runtime superset (`classifier`, `hopCount` from `buildSourceReferenceResponseStaging`) without forcing E9-PI runtime edits — normative contract ≠ wire superset.
- **GOV-PV-4:** Anti-collapse pack D-SR-1..7 in PP §8.2 is **necessary and sufficient** for PM to copy into OpenAPI descriptions.

**4 — Runtime Validation Agent**

- **VAL-PV-1:** PP validation rules CR-VAL-1..7 match runtime rejects in `request.test.ts` (repost+intent, SR on repost, authorial+repostTarget).
- **VAL-PV-2:** Omit-when-false (E9-D5) matches **T-PP-1** — contract must not document `false` on response.
- **VAL-PV-3:** E9-JR must cite **176/176** space-service tests + contract diff — OpenAPI green ≠ primitive proof (C2).
- **VAL-PV-4:** **NOTE:** Tests use `toMatchObject` on material SR fields — consistent with MATERIAL_ONLY; extra runtime keys non-blocking for JR if documented (PV-N2).

**5 — Backend Developer (review mode)**

- **BE-PV-1:** `parseAuthorialExpressionIntentFromBody` — `=== true` aligns with optional boolean + default false in plan.
- **BE-PV-2:** `parseSourceReferenceFromBody` accepts **nested** and **flat** keys — PP **E9-D4** documents nested as canonical; recommend description footnote for flat tolerance (PV-N1) — not a plan rejection.
- **BE-PV-3:** Seven `SOURCE_MATERIAL_TYPES` === seven `SpaceRepostTargetType` enum members — separate schema names still required (E9-D3).
- **BE-PV-4:** `SourceReferenceResponseStaging` includes `classifier` + `hopCount` — **excluded** from OpenAPI per E9-D2/D6 — correct.

**6 — QA Agent**

- **QA-PV-1:** **E9-D10** additive-only — optional fields on request/response; no new required top-level properties — backward compatible.
- **QA-PV-2:** PP §9 generated file list is **adequate** for Orval split mode; expect 3 new schema modules + 2 DTO updates + index re-exports.
- **QA-PV-3:** `pnpm openapi:check` in CI (`.github/workflows/ci.yml`) is the right gate for E9-PI — PM must require committed artifacts.
- **QA-PV-4:** Contract test strategy: minimum material assertions — aligns with T-PP-2/3; do not require classifier in contract tests.

**7 — Technical Canon Writer**

- **CANON-PV-1:** **Contract Review ≠ Contract Implementation** — this PV does not authorize OpenAPI edits (tokens §15).
- **CANON-PV-2:** **E9-D2** is the canon lock for the E9 track — public DTO material-only; proof stays domain/events.
- **CANON-PV-3:** `pm_ready: TRUE` after PV — does not lift `foundation_trio_ready` or `ws2_authorized`.
- **CANON-PV-4:** NR-N2/TR-N2 targeted for closure at **E9-PJR** — not at PV or PM.

### 2.2 Disagreements between agents

| Topic | Agent A | Agent B | Resolution |
| --- | --- | --- | --- |
| Verdict tier | User: accept without substantial notes | QA: minor PV-N notes | **CONTRACT_PLAN_ACCEPTED_WITH_NOTES** — notes are carry-forward, not plan defects |
| Flat SR on create | Backend: document footnote | PP: nested only | **ACCEPT_WITH_NOTE** on E9-D4 (PV-N1) |
| MATERIAL_ONLY vs runtime wire | Governance: contract material-only | Validation: runtime superset OK | **ACCEPTED** — E9-D7 |
| PM readiness | Orchestrator: open PM now | — | **YES_WITH_CONDITIONS** — PM-COND-1..6 |

**Blocking disagreement:** None.

### 2.3 E9 blockers (PV-specific)

| ID | Blocker | Status after PV |
| --- | --- | --- |
| EB-PV-1 | Plan rejected or MATERIAL_ONLY overturned | **NONE** — D2 affirmed |
| EB-PV-2 | E9-PM cannot open | **NONE** — `pm_ready: TRUE` |
| EB-PV-3 | Y-HB3 cleared at PV | **NOT CLAIMED** — remains open until E9-PJR |
| EB-PV-4 | OpenAPI implementation without PM | **PREVENTED** — `e9_openapi_implementation_authorized` stays FALSE until PM |

**PV acceptance blockers:** **NONE**.

---

## 3. E9 Decisions Review (E9-D1..D10)

| ID | Decision | Verdict | Notes |
| --- | --- | --- | --- |
| **E9-D1** | Runtime > Contract | **ACCEPT** | Aligns with PJR, C2, E9 gate |
| **E9-D2** | SourceReference = **MATERIAL_ONLY** | **ACCEPT** | **Defining E9 track decision** — see §4 |
| **E9-D3** | `SpaceSourceMaterialType` separate enum | **ACCEPT** | Same values ≠ same type (§5) |
| **E9-D4** | Create uses nested `sourceReference` | **ACCEPT_WITH_NOTE** | PV-N1: runtime tolerates flat keys; OpenAPI canonical = nested |
| **E9-D5** | `authorialExpressionIntent` omit when false | **ACCEPT** | T-PP-1, PP-D9 |
| **E9-D6** | Classifiers OUT of public DTO | **ACCEPT** | Events/domain only |
| **E9-D7** | Runtime extras non-normative | **ACCEPT** | E9-PI does not trim runtime |
| **E9-D8** | E9-PI does not change runtime | **ACCEPT** | Scope §11.2 |
| **E9-D9** | Y-HB3 clears only after E9-PJR | **ACCEPT** | No early lift |
| **E9-D10** | Additive-only contract changes | **ACCEPT** | Optional fields |

**Summary:** **10/10 accepted** (1 with note on D4).

---

## 4. SourceReference Shape Review (MATERIAL_ONLY)

### 4.1 Is MATERIAL_ONLY correct?

**YES — ACCEPT as the normative public contract shape.**

| Criterion | Assessment |
| --- | --- |
| **Classifier exclusion** | **PASS** — `classifier: 'source_reference'` is proof/staging vocabulary; must not appear in OpenAPI (E9-D6, E9-FAIL-4). |
| **Proof exclusion** | **PASS** — no `authorialIndependence`, `savePublishBoundary`, or hop-chain objects in public schema. |
| **Runtime superset compatibility** | **PASS** — HTTP may still emit extra keys via `buildSourceReferenceResponseStaging`; clients typed to `SpaceSourceReference` use material fields only; JR documents superset (E9-D7). |
| **Test alignment** | **PASS** — T-PP-2/3 assert `sourceMaterialType` + `sourceMaterialId` via `toMatchObject`. |
| **False-pass prevention** | **PASS** — prevents E9-R1/R2 (contract as proof authority). |

### 4.2 Rejected alternatives (confirm PP)

| Option | PV disposition |
| --- | --- |
| Classifier-enriched OpenAPI | **REJECT** — would violate E9-D6 and user-stated architecture |
| Hybrid optional classifier | **REJECT** — still fixes proof tokens in public contract |

### 4.3 E9-D2 governance lock

PM and E9-PI **must not** expand `SpaceSourceReference` beyond material pair without a new planning gate. Any proposal to add `classifier` or `hopCount` to OpenAPI → **E9-FAIL-4** at JR.

---

## 5. Enum Review (SpaceSourceMaterialType)

| Check | Result |
| --- | --- |
| Separate schema name | **PASS** — planned `SpaceSourceMaterialType` ≠ `SpaceRepostTargetType` |
| Value set | **PASS** — seven values match `SOURCE_MATERIAL_TYPES` and `SpaceRepostTargetType` members: `space_post`, `blog_post`, `place`, `event`, `partner`, `listing`, `quest` |
| Reuse `SpaceRepostTargetType` for P5 | **REJECT** (correctly avoided in PP) — would collapse TypeScript types and client mental model |
| E9-PASS-11 | PM must require byte-for-byte enum parity at PI |

**Enum review: PASS**

---

## 6. Request Contract Review (CreateSpacePostRequest)

| Planned element | Verdict | Runtime evidence |
| --- | --- | --- |
| Optional `authorialExpressionIntent` (default false) | **PASS** | `parseAuthorialExpressionIntentFromBody` |
| Nested `sourceReference` | **PASS** | Primary write path in tests (~L1051) |
| CR-VAL-1..7 semantics | **PASS** | `request.test.ts` negative cases |
| Mutual exclusion post vs repost fields | **PASS** | FT-3A/3B asserts |
| `additionalProperties: false` on SR input | **PASS** | PP §6.2 — prevents proof keys on create |

**CreateSpacePostRequest plan: PASS**

---

## 7. Response Contract Review (SpacePostResponse)

| Planned element | Verdict | Runtime evidence |
| --- | --- | --- |
| Optional `authorialExpressionIntent` on schema | **PASS** | Not in required[] |
| Omit when false (not `false`) | **PASS** | `rehydrateAuthorialFieldsFromRow`; T-PP-1 |
| Optional nullable `sourceReference` | **PASS** | T-PP-2/3 on GET/feed |
| Same schema in `SpaceFeedItem.post` | **PASS** | `mapPostResponse` on all feed paths |
| Legacy rows omit fields | **PASS** | Backfill false/null; T-PP-4 |

**SpacePostResponse plan: PASS**

---

## 8. Anti-Collapse Review

| Description ID | Required statement | PP coverage | PV |
| --- | --- | --- | --- |
| D-SR-1 | sourceReference ≠ repostTarget* | §8.2 | **PASS** |
| D-SR-2 | sourceReference ≠ repost | §8.2 | **PASS** |
| D-SR-3 | Not quote-repost / one-hop | §8.2 | **PASS** |
| D-SR-4 | Optional 0..1 | §8.2 | **PASS** |
| D-SR-5 | One-hop material pair | §8.2 | **PASS** |
| D-SR-6 | Secondary to author text | §8.2 | **PASS** |
| D-SR-7 | Requires authorial intent on create | §8.2 | **PASS** |
| Repost target augmentation | §8.3 | **PASS** |

**Anti-collapse review: PASS** — PM must copy verbatim into OpenAPI (E9-PASS-13).

---

## 9. SDK / Types Review

| Check | Result |
| --- | --- |
| PP §9 file list sufficient | **PASS** — covers DTOs + new enums/schemas + index |
| Orval split mode | **PASS** — new files `spaceSourceMaterialType.ts`, `spaceSourceReference.ts`, `spaceSourceReferenceInput.ts` expected |
| Hidden consumers | **PASS_WITH_NOTE** — PWA shell is main `SpacePostResponse` consumer; api-gateway may reference bundle — PV-N3 for PM |
| `openapi:check` workflow | **PASS** — CI enforced |
| No classifier types in generated output | **PASS** — PM MUST verify at PI (E9-PASS-12) |

**SDK/types review: PASS**

---

## 10. E9 Risks Review (E9-R1..R10)

| Risk | PP mitigation | PV status |
| --- | --- | --- |
| **E9-R1** OpenAPI as proof | E9-FAIL-1; C2 | **MITIGATED** at plan tier |
| **E9-R2** Classifier in schema | E9-D2; E9-FAIL-4 | **MITIGATED** |
| **E9-R3** P5 ↔ repostTarget collapse | E9-D3; D-SR pack | **MITIGATED** |
| **E9-R4** omit-when-false drift | E9-PASS-14 | **MITIGATED** |
| **E9-R5** Runtime superset confusion | E9-D7; descriptions | **PARTIALLY MITIGATED** — JR must document (PV-N2) |
| **E9-R6** openapi:check drift | E9-PI checklist | **UNRESOLVED** until PI — expected |
| **E9-R7** Scope creep | E9-FAIL-6 | **MITIGATED** |
| **E9-R8** Trio/WS-2 false lift | E9-FAIL-2/3 | **MITIGATED** |
| **E9-R9** Enum drift | E9-PASS-11 | **MITIGATED** at plan tier |
| **E9-R10** Gateway strips fields | PP note | **PARTIALLY MITIGATED** — PM-COND-6 (PV-N3) |

### 10.1 Contract risks (consolidated)

| Risk | Severity | PV disposition |
| --- | --- | --- |
| Contract mirrors proof | CRITICAL | **Controlled** by E9-D2/D6 |
| SDK type collapse P5/P1 | HIGH | **Controlled** by E9-D3 |
| Wire superset vs schema | MEDIUM | **Accepted** under E9-D7 |
| Consumer lag (PWA) | LOW | **Out of E9-PI scope** |

---

## 11. E9-PM Readiness

### Can program open **E9-PM** (Contract Implementation Authorization Gate)?

**`YES_WITH_CONDITIONS`**

| Question | Answer |
| --- | --- |
| Open E9-PM? | **YES_WITH_CONDITIONS** |
| Open E9-PI in PV? | **NO** |
| Clear Y-HB3 in PV? | **NO** |
| `foundation_trio_ready: TRUE`? | **NO** |
| WS-2 authorized? | **NO** |

---

## 12. E9-PM Prerequisites

PM gate **must** produce before E9-PI:

| ID | Prerequisite |
| --- | --- |
| **PM-COND-1** | Bind E9-PASS-1..14 and E9-FAIL-1..10 from E9 gate + PP §12–13 |
| **PM-COND-2** | **Lock E9-D2 MATERIAL_ONLY** — PM-FAIL if classifier/hopCount added to public schemas |
| **PM-COND-3** | Require `SpaceSourceMaterialType` separate from `SpaceRepostTargetType` |
| **PM-COND-4** | Require D-SR-1..7 + §8.3 text in `space.yaml` |
| **PM-COND-5** | E9-PI scope = §11.1 only; E9-FAIL-6 enforced |
| **PM-COND-6** | Note gateway/PWA follow-on; optional smoke that gateway forwards unknown JSON fields (PV-N3) |
| **PM-MUST-1** | (Indicative) Edit `space.yaml` per PP §4–8 |
| **PM-MUST-2** | `additionalProperties: false` on SR schemas |
| **PM-MUST-3** | `pnpm openapi:bundle` + `gen:types` + `gen:sdk` + commit artifacts |
| **PM-MUST-4** | `pnpm openapi:check` PASS |
| **PM-MUST-5** | No runtime/DB/UI in same PR |
| **PM-MUST-6** | E9-PJR required before `y_hb3_status: CLEARED` |
| **PM-MUST-7** | JR tokens: `foundation_trio_ready: FALSE`, `ws2_authorized: FALSE` |

---

## 13. Review Verdict

**`CONTRACT_PLAN_ACCEPTED_WITH_NOTES`**

| Tier | Applicable? |
| --- | --- |
| CONTRACT_PLAN_ACCEPTED | Could apply given user acceptance |
| **CONTRACT_PLAN_ACCEPTED_WITH_NOTES** | **SELECTED** — carry-forward notes only |
| CONTRACT_PLAN_REVIEW_REQUIRED | **NO** — plan sufficient |
| CONTRACT_PLAN_REJECTED | **NO** |

### 13.1 Carry-forward notes (PV-N*)

| Note | Statement |
| --- | --- |
| **PV-N1** | OpenAPI documents **nested** `sourceReference` on create; runtime also accepts flat `sourceMaterialType`/`sourceMaterialId` — optional description footnote only |
| **PV-N2** | E9-PJR documents runtime JSON superset (`classifier`, `hopCount`) as non-normative under MATERIAL_ONLY contract |
| **PV-N3** | Post-PI: verify api-gateway does not strip undocumented authorial fields on proxy paths |

---

## 14. Next Safe Step

1. **`Stage 13B.5-E9-PM — Contract / OpenAPI Implementation Authorization Gate`** — E9-MUST/FAIL; `implementation_authorized` for OpenAPI slice.
2. **`Stage 13B.5-E9-PI — OpenAPI + SDK Implementation`** — on `feat/stage-13b5-e9-space-contract`.
3. **`Stage 13B.5-E9-PJR — Contract Implementation Review`** — may clear **Y-HB3**.

**Not next:** E9-PI without PM; Foundation Trio closure; WS-2.

---

## 15. Final Tokens

```yaml
stage_13B_5_E9_PV_status: PASS
stage_13B_5_E9_PV_review_verdict: CONTRACT_PLAN_ACCEPTED_WITH_NOTES
stage_13B_5_E9_PV_pm_ready: TRUE
stage_13B_5_E9_PV_plan_accepted: TRUE
stage_13B_5_E9_PV_source_reference_shape_confirmed: MATERIAL_ONLY
stage_13B_5_E9_PV_foundation_trio_ready: FALSE
stage_13B_5_E9_PV_ws2_authorized: FALSE
stage_13B_5_E9_PV_y_hb3_status: OPEN_UNTIL_IMPL_COMPLETE
stage_13B_5_E9_PV_carry_forward_notes: PV-N1,PV-N2,PV-N3
stage_13B_5_E9_PV_next_safe_step: STAGE_13B_5_E9_PM_CONTRACT_IMPLEMENTATION_AUTHORIZATION_GATE
```

Program tokens (updated):

```yaml
e9_contract_track_authorized: TRUE
e9_plan_accepted: TRUE
e9_openapi_implementation_authorized: FALSE
persistence_accepted: TRUE
foundation_trio_ready: FALSE
ws2_authorized: FALSE
```

### Invariants (preserved)

```
Contract Review ≠ Contract Implementation
Contract Implementation ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
E9-D2 MATERIAL_ONLY = public contract lock (proof excluded)
```

---

## Execution Summary

| Deliverable | Value |
| --- | --- |
| Report | `docs/reports/stage_13B_5_E9_PV_contract_openapi_review_v1.md` |
| Agents used | **7/7** |
| Review verdict | **`CONTRACT_PLAN_ACCEPTED_WITH_NOTES`** |
| PM readiness | **`YES_WITH_CONDITIONS`** (`pm_ready: TRUE`) |
| E9-D2 confirmed | **MATERIAL_ONLY** |
| Next safe step | **E9-PM — Contract Implementation Authorization Gate** |
