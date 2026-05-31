# Stage 13B.5-N — FT-3A Authorial Expression Implementation

## 1. Scope Verification

Execution mode:

- `BOUNDED_IMPLEMENTATION_SLICE_FT_3A_ONLY`
- authorization: `FT_3A_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` (13B.5-M)
- WS-5 Phase A: **COMPLETE** (consumed, not modified)

Scope confirmation:

| Check | Result |
| --- | --- |
| FT-3A Authorial Expression only | PASS |
| No FT-3B / FT-3C / FT-3D | PASS |
| No WS-2 | PASS |
| No Source Reference implementation | PASS |
| No save/publish / visibility policy | PASS |
| No migrations / OpenAPI / SDK / UI | PASS |
| WS-5 stack consumed (FT-5A–5D unchanged) | PASS |
| CO-2 / CO-3 / CO-5 / CO-7 / CO-10 / CO-13 respected | PASS |

## 2. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/domain/authorialExpression.ts` | **NEW** — FT-3A bounded domain module |
| `apps/space-service/test/authorialExpression.test.ts` | **NEW** — E7 T1–T12 + E6 read negative |
| `apps/space-service/src/services/spaceService.ts` | **MODIFIED** — E3 write path + read guards via `mapPostResponse` |
| `apps/space-service/test/request.test.ts` | **MODIFIED** — E3 integration + CO-2/CO-13 HTTP negatives |

Files not changed:

- `legacyTaxonomy.ts`, `legacyDistinction.ts`, `forbiddenTransformations.ts`, `perSurfaceLegacyMatrix.ts` (logic)
- `retentionIntent.ts` (P1/P2 unchanged; FT-3A composes alongside)
- OpenAPI, SDK, DB schema, PWA

## 3. Authorial Expression Module

Module: `authorialExpression.ts`

| Capability | Purpose |
| --- | --- |
| `AUTHORIAL_EXPRESSION_WRITE_INTENT` / `AUTHORIAL_TEXT_ROLE` | Canonical intent + text role tokens |
| `parseAuthorialExpressionIntentFromBody` | Explicit write opt-in (`authorialExpressionIntent: true`) |
| `classifyAuthorialExpressionWriteIntent` | E3 intent classifier (post only) |
| `classifyAuthorialTextRole` | Authorial Text role (non-empty text + intent) |
| `buildAuthorialP4ClassificationProof` | E5 bounded P4 proof object (`isAuthorialPostRuntimePrimitiveEstablished: false`) |
| `buildAuthorialNegativesProof` | E6 collapse negatives |
| `assertAuthorialExpressionWrite` | Write-path boundary (text, no repostTarget*, dedupe FT-10) |
| `assertAuthorialReadCarrier` | Read-path carrier reinforcement |
| `applyAuthorialExpressionReadGuards` | FT-5D + authorial read chain |

## 4. Authorial Intent Layer

Write intent is **explicit** and separate from retention:

| Path | Classifier | Module |
| --- | --- | --- |
| Authorial expression | `authorial_expression_intent` | `authorialExpression.ts` |
| Private repost | `private_repost_intent` | `retentionIntent.ts` |
| Propagation repost | `propagation_repost` | `retentionIntent.ts` |

HTTP contract (bounded, no OpenAPI change):

- Request body field: `authorialExpressionIntent: true` (boolean)
- Required with `postType: post` for E3 authorial write proof
- Rejected on `postType: repost` (400)

Event payload (internal, not API DTO):

- `authorialExpressionIntent: 'authorial_expression_intent'`
- `authorialTextRole: 'authorial_text'`

Generic `createPost({ postType: 'post', text })` **without** intent remains ZR generic carrier — not P4 proof.

## 5. Authorial Text Role

| Role | Carrier | Condition |
| --- | --- | --- |
| `authorial_text` | `postType: post` | `authorialExpressionIntent: true` + non-empty trimmed text |
| `private_note` | `postType: repost`, private | `retentionIntent` (unchanged) |
| `propagation_commentary` / `historical_commentary` | repost-shaped legacy | FT-5B/5C (unchanged) |

Authorial Text is never assigned on repost rows.

## 6. E3 Write Path

Observable path: `POST /v1/space/posts` → `createPost` in `spaceService.ts`

Flow:

1. Parse `authorialExpressionIntent` from body
2. Validate repost/authorial intent mutual exclusion
3. `assertAuthorialExpressionWrite` before insert
4. `insertSpacePost` (unchanged schema)
5. Emit `space.post.created` with authorial intent/text roles when applicable

Integration tests:

- Retention dedupe does not query repost table for authorial write (`request.test.ts`)
- `repostTarget*` on post rejected (existing validation + authorial assert)
- `authorialExpressionIntent` on repost rejected

## 7. E5 Classification Proof

`buildAuthorialP4ClassificationProof` returns:

- `primitive: 'P4'`
- `isP4ClassificationProof: true` only when explicit intent + `authorial_text`
- `isAuthorialPostRuntimePrimitiveEstablished: false` (CO-13)
- `isNotPostTypePostAloneProof: true` when intent absent or proof incomplete

**Not declared:** `authorial_post_runtime_primitive_established = TRUE`

## 8. E6 Negatives

| Negative | Implementation |
| --- | --- |
| Private Note ≠ Authorial Text | `buildAuthorialNegativesProof` + T5 |
| Legacy Commentary ≠ Authorial Text | T4 + FT-5C consumption on repost reads |
| Legacy Row ≠ Authorial Post | T12 + `assertAuthorialReadCarrier` legacy block |
| `repostTarget*` ≠ Source Reference | T6 + CO-2 write/read asserts |

## 9. E7 Tests

| ID | Test | File |
| --- | --- | --- |
| T1 | `authorial_expression_intent` write classify | `authorialExpression.test.ts` |
| T2 | P4 classification proof | `authorialExpression.test.ts` |
| T3 | P1 ≠ P4 (private repost) | `authorialExpression.test.ts` |
| T4 | P6 commentary ≠ Authorial Text | `authorialExpression.test.ts` |
| T5 | private_note ≠ Authorial Text | `authorialExpression.test.ts` |
| T6 | repostTarget collapse rejected | `authorialExpression.test.ts` + `request.test.ts` |
| T7 | profile_feed read carrier | `authorialExpression.test.ts` |
| T8 | dedupe independence | `authorialExpression.test.ts` + `request.test.ts` |
| T9 | empty authorial payload F19 | `authorialExpression.test.ts` |
| T10 | OpenAPI-alone negative | `authorialExpression.test.ts` |
| T11 | WS-5 + authorial read chain | `authorialExpression.test.ts` |
| T12 | regression repost ≠ authorial | `authorialExpression.test.ts` |

**Executed:** 13 domain + 3 HTTP integration = 16 FT-3A-focused cases; full suite 120/120.

## 10. FT-X1 Compliance

| Boundary | Status |
| --- | --- |
| P4 expression ≠ P1 private repost | PASS |
| P4 text ≠ P2 private note | PASS |
| P4 ≠ P6 legacy commentary | PASS (via repost classifiers) |
| `postType: post` alone ≠ establishment | PASS (intent required) |
| FT-5 stack not replaced | PASS |

## 11. FT-X2 Compliance

WS-3 evidence spine (partial fill per 13B.5-M §7.2):

| Step | Status |
| --- | --- |
| E3 authorial write | **FILLED** (bounded explicit intent path) |
| E5 P4 classification | **PARTIAL** (proof object; not ESTABLISHED) |
| P5 / SR / Trio / WS-2 | **NOT FILLED** (out of scope) |

## 12. Carve-Out Verification

| ID | Verification | Result |
| --- | --- | --- |
| CO-2 | No SR / no `repostTarget*` on authorial post write | PASS |
| CO-3 | Save/publish not implemented; referenced only | PASS |
| CO-5 | Visibility rules unchanged | PASS |
| CO-7 | No WS-2 work | PASS |
| CO-10 | No PWA / ContentActionRow diff | PASS |
| CO-13 | `isAuthorialPostRuntimePrimitiveEstablished` always false | PASS |

**Carve-out matrix: PASS**

## 13. Validation Results

| Check | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service typecheck` | PASS |
| `pnpm --filter @go2asia/space-service test` (FT-3A + WS-5 + request) | **120/120 PASS** |
| `git diff --check` | PASS |

## 14. PASS / FAIL Assessment

Alignment with 13B.5-M gate:

| Gate requirement | Impl status |
| --- | --- |
| Bounded authorial expression module | PASS |
| Authorial intent separate from retention/legacy | PASS |
| Authorial Text role | PASS |
| P4 classification proof (not established) | PASS |
| E3 write path | PASS |
| E5 / E6 / E7 | PASS |
| FT-5 consumption | PASS |
| No scope creep (FT-3B/3C/3D, WS-2, schema, OpenAPI) | PASS |

**Stage 13B.5-N verdict: PASS**

## 15. Final Tokens

```yaml
stage_13B_5_N_status: ACCEPTED
stage_13B_5_N_ft_3a_complete: TRUE
stage_13B_5_N_authorial_post_runtime_primitive_established: FALSE
stage_13B_5_N_source_reference_runtime_primitive_established: FALSE
stage_13B_5_N_foundation_trio_ready: FALSE
stage_13B_5_N_ws2_authorized: FALSE
```

## Execution Summary

### Changed files (FT-3A slice)

- `apps/space-service/src/domain/authorialExpression.ts` (new)
- `apps/space-service/test/authorialExpression.test.ts` (new)
- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/test/request.test.ts`
- `docs/reports/stage_13B_5_N_ft_3A_authorial_expression_implementation_v1.md` (this report)

### Evidence status

| Class | Status |
| --- | --- |
| E3 | **PRIMARY — PASS** |
| E5 | **PRIMARY — PASS** (bounded; not ESTABLISHED) |
| E6 | **PRIMARY — PASS** |
| E7 | **PRIMARY — PASS** (T1–T12 executed) |
| E2 | **PASS** (this report) |

### Invariants (preserved)

```
FT-3A Complete ≠ Authorial Post Established
Authorial Post Established ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```

### Next safe step

**Stage 13B.5-NR** — FT-3A Implementation Review & Acceptance (JR). Do not claim `authorial_post_runtime_primitive_established: TRUE` until JR. After NR PASS, safe gate candidates: **FT-3C** (independence) or **FT-3B** (Source Reference) per 13B.5-D cutline — not before JR.
