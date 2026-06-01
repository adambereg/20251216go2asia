# Stage 13B.5-T — FT-3B Source Reference Implementation

## 1. Scope Verification

Execution mode:

- `BOUNDED_IMPLEMENTATION_SLICE_FT_3B_ONLY`
- authorization: `FT_3B_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` (Stage 13B.5-S — accepted per user cutline; gate report path consumed from program context)
- prerequisites: FT-3A (NR), FT-3C (PR), FT-3D (RR), FT-5A–5D in main

Multi-agent mode (readonly governance + implementation):

| Agent | Role in this slice |
| --- | --- |
| AI Program Director / Project Orchestrator | Cutline enforcement; no WS-2 / Trio lift |
| Slice Strategist | FT-3B-only scope; P5 separate from P4/P1 |
| Runtime Governance Architect | CO-S2/3/5/8/12/15 carve-out watch |
| Runtime Validation Agent | E3/E5/E6/E7 evidence mapping |
| Backend Developer | `sourceReferenceBoundary.ts` + `spaceService` hooks |
| QA Agent | 168/168 tests; HTTP T12 |
| Technical Canon Writer | This report + final tokens |

Scope confirmation:

| Check | Result |
| --- | --- |
| FT-3B Source Reference boundary only | PASS |
| No WS-2 | PASS |
| No quote repost / chain reconstruction | PASS — forbidden body keys + 0..1 count |
| No visibility policy | PASS |
| No Foundation Trio closure | PASS — tokens FALSE |
| No migrations / schema / OpenAPI / SDK / UI | PASS |
| No `repostTarget*` as Source Reference | PASS — CO-S2 |
| No legacy row → SR conversion | PASS — repost path rejects SR |
| FT-3A / FT-3C / FT-3D / FT-5 consumed, not replaced | PASS — T14 regression |
| Write-bounded staging (no DB persistence) | PASS — create response + event only |

## 2. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/domain/sourceReferenceBoundary.ts` | **NEW** — P5 bounded module |
| `apps/space-service/test/sourceReferenceBoundary.test.ts` | **NEW** — E7 T1–T14 |
| `apps/space-service/src/services/spaceService.ts` | **MODIFIED** — parse, assert, event, create response staging |
| `apps/space-service/test/request.test.ts` | **MODIFIED** — HTTP positive + negatives |

Files not changed:

- `authorialExpression.ts`, `authorialIndependence.ts`, `savePublishBoundary.ts` (logic unchanged)
- FT-5A–5D modules, OpenAPI, SDK, DB schema, Reactions service

## 3. Source Reference Module

Module: `sourceReferenceBoundary.ts`

| Export | Purpose |
| --- | --- |
| `SOURCE_REFERENCE_CLASSIFIER` | Canonical P5 classifier token |
| `SOURCE_REFERENCE_WRITE_INTENT` | Staging intent label (`source_reference_attached`) |
| `SOURCE_MATERIAL_TYPES` | Allowed `sourceMaterialType` values (aligned with material inventory, not `repostTarget*`) |
| `parseSourceReferenceFromBody` | Nested `sourceReference` object or flat `sourceMaterialType` / `sourceMaterialId` |
| `buildSourceReferenceProof` | E5 proof object |
| `buildSourceReferenceNegativesProof` | E6 negatives |
| `assertSourceReferenceBoundaryWrite` | Write gate after FT-3A → FT-3C → FT-3D |
| `buildSourceReferenceResponseStaging` | Write-bounded HTTP overlay on create |

## 4. Source Reference Classifier

Modes implemented:

| Mode | Condition |
| --- | --- |
| `optional` | Authorial post (`post` + `authorialExpressionIntent`) with zero references |
| `one_hop` | Same carrier with exactly one `sourceMaterialType` + `sourceMaterialId` |
| `authorial_only` | SR attachment rejected unless authorial path active |

`classifySourceReference` returns `source_reference` when `buildSourceReferenceProof.isSourceReferenceBoundaryProof` is true on authorial writes.

## 5. Source Reference Proof

`SourceReferenceProof` minimum fields:

| Proof field | Meaning |
| --- | --- |
| `secondaryToAuthorText` | SR requires text-primary author text when attached (F19) |
| `notRepost` | `postType: post` only |
| `notQuote` | No `quoteRepost*` body keys |
| `notChain` | `hopCount` ≤ 1; no chain body keys |
| `isNotRepostTargetAlias` | No `repostTarget*` on authorial path |
| `isOptionalAttachment` | Zero SR valid |
| `isOneHop` | At most one material pointer |
| `isAuthorialOnly` | SR only with `authorial_expression_intent` |
| `isFoundationTrioReady` / `isWs2Authorized` / `isSourceReferenceRuntimePrimitiveEstablished` | **false** (CO-S12) |

## 6. 0..1 Boundary

| Rule | Enforcement |
| --- | --- |
| Zero references | Default authorial path |
| One reference | Single nested object or single flat pair |
| Multiple references | `countSourceReferencesInBody` > 1 → throw |
| Chain / nested | `FORBIDDEN_CHAIN_BODY_KEYS` rejected |
| Second reference field | `secondSourceReference` counted and rejected |

## 7. E3 Positive Paths

| Path | Evidence |
| --- | --- |
| Authorial without SR | T1 unit; existing HTTP authorial create (`sourceReference` undefined) |
| Authorial with SR | T2 unit; HTTP `returns write-bounded sourceReference on authorial create` (T12) |
| Hook order | `assertAuthorialExpressionWrite` → `assertAuthorialIndependenceWrite` → `assertSavePublishBoundaryWrite` → `assertSourceReferenceBoundaryWrite` |
| Event staging | `sourceReference` classifier + `sourceMaterialType` / `sourceMaterialId` on `space.post.created` |

## 8. E5 Source Reference Proof

Aggregate: `isSourceReferenceBoundaryProof` on authorial writes.

Write-bounded read proof: `buildSourceReferenceResponseStaging` adds `sourceReference` to **create** response only (not persisted; GET/read paths unchanged).

## 9. E6 Negatives

| Negative | Implementation |
| --- | --- |
| `repostTarget*` ≠ Source Reference | `assertRepostTargetNotSourceReference` + existing HTTP repostTarget rejection |
| Repost ≠ Source Reference | `assertSourceReferenceNotOnRepostOrRetention` |
| Quote repost ≠ Source Reference | `FORBIDDEN_CHAIN_BODY_KEYS` includes `quoteRepost*` |
| Chain ≠ Source Reference | chain keys + multi-count |
| SR not required for publish | `FORBIDDEN_SR_REQUIREMENT_BODY_KEYS` |
| SR not required for independence | same + FT-3C unchanged (optional SR) |
| Legacy row ≠ Source Reference | SR on `postType: repost` rejected |
| Retention binding ≠ Source Reference | private repost + SR rejected (CO-S5) |
| Propagation repost ≠ SR | public/group repost + SR rejected (T10) |

## 10. E7 Tests

| ID | Test | File |
| --- | --- | --- |
| T1 | Authorial without SR | `sourceReferenceBoundary.test.ts` |
| T2 | Authorial with SR | `sourceReferenceBoundary.test.ts` |
| T3 | Second reference reject | `sourceReferenceBoundary.test.ts` |
| T4 | Non-authorial reject | `sourceReferenceBoundary.test.ts` + `request.test.ts` |
| T5 | repostTarget reject | `sourceReferenceBoundary.test.ts` + existing HTTP |
| T6 | Weak text + SR fail | `sourceReferenceBoundary.test.ts` |
| T7 | Strong text without SR pass | `sourceReferenceBoundary.test.ts` |
| T8 | Legacy row reject | `sourceReferenceBoundary.test.ts` |
| T9 | Retention binding reject | `sourceReferenceBoundary.test.ts` |
| T10 | Propagation reject | `sourceReferenceBoundary.test.ts` |
| T11 | Dedupe independence | `sourceReferenceBoundary.test.ts` |
| T12 | HTTP sourceReference positive | `request.test.ts` |
| T13 | OpenAPI negative | `assertOpenApiTypeAloneNotSourceReferenceProof` + T13 unit |
| T14 | FT-3A/3C/3D regression | `sourceReferenceBoundary.test.ts` |

**Test run:** `pnpm --filter @go2asia/space-service test` → **168/168 PASS**

## 11. FT-X1 Compliance

| Boundary | Result |
| --- | --- |
| P4 (FT-3A) not redefined | PASS — intent unchanged |
| P1/P2 (retention) not redefined | PASS — repost paths unchanged |
| P5 bounded write only | PASS — no read persistence |
| Trio not ready | PASS — explicit FALSE tokens |

## 12. FT-X2 Compliance

| Spine item | Progress |
| --- | --- |
| WS-3 P5 write classifier | **Bounded established on write path** (JR still required for runtime primitive token) |
| WS-3 evidence spine E3/E5/E6/E7 | PASS for FT-3B slice |
| WS-2 | **Not authorized** |
| Foundation Trio | **Not ready** |

## 13. Carve-Out Verification

| Carve-out | Result | Notes |
| --- | --- | --- |
| CO-S2 | PASS | `repostTarget*` blocked; SR uses `sourceMaterial*` only |
| CO-S3 | PASS | SR optional; not required for publish/independence |
| CO-S5 | PASS | Retention repost cannot carry SR |
| CO-S8 | PASS | No quote/chain body fields |
| CO-S12 | PASS | No Trio / WS-2 / P5 establishment flags in code |
| CO-S15 | PASS | No migrations / OpenAPI / SDK / UI |

**Carve-out verification: PASS**

## 14. Validation Results

| Check | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service test` | PASS (168/168) |
| `pnpm --filter @go2asia/space-service exec tsc --noEmit` | PASS |
| `git diff --check` | PASS |

## 15. PASS / FAIL Assessment

Alignment with Stage 13B.5-S authorization (FT-3B bounded implementation):

| Gate requirement | Impl result |
| --- | --- |
| Bounded P5 module | PASS |
| Classifier optional / one-hop / authorial-only | PASS |
| Proof secondary / not repost / not quote / not chain | PASS |
| 0..1 boundary | PASS |
| E3 / E5 / E6 / E7 | PASS |
| Scope exclusions (WS-2, Trio, schema, OpenAPI, UI) | PASS |

**Stage 13B.5-T assessment: PASS** (implementation complete; JR not performed in this slice)

## 16. Final Tokens

```yaml
stage_13B_5_T_status: PASS
stage_13B_5_T_ft_3b_complete: TRUE
stage_13B_5_T_source_reference_runtime_primitive_established: FALSE
stage_13B_5_T_foundation_trio_ready: FALSE
stage_13B_5_T_ws2_authorized: FALSE
```

P5 note: write-bounded classifier and proof exist; `source_reference_runtime_primitive_established` remains **FALSE** until **13B.5-TR** (FT-3B Implementation Review & Acceptance).

---

## Execution Summary

| Item | Value |
| --- | --- |
| Branch | `feat/stage-13b5-ft3b-source-reference-impl` |
| Changed code files | 4 (2 new domain/test, 2 modified service/tests) |
| Tests | 168/168 PASS |
| PASS/FAIL | **PASS** |
| P5 status | **BOUNDED_WRITE_ESTABLISHED** — not full runtime primitive / not Trio |
| Next safe step | **Stage 13B.5-TR** — FT-3B Implementation Review & Acceptance |

**Invariants preserved:**

- FT-3B Complete ≠ Foundation Trio Ready  
- Source Reference Established (JR) ≠ WS-2 Authorized  
- Source Reference ≠ repost / quote repost / chain  
- `repostTarget*` ≠ Source Reference  
