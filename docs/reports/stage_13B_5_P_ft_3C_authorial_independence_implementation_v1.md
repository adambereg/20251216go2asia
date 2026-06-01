# Stage 13B.5-P — FT-3C Authorial Independence Implementation

## 1. Scope Verification

Execution mode:

- `BOUNDED_IMPLEMENTATION_SLICE_FT_3C_ONLY`
- authorization: `FT_3C_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` (13B.5-O)
- prerequisites: FT-3A accepted (NR); P4 bounded established with conditions

Scope confirmation:

| Check | Result |
| --- | --- |
| FT-3C Authorial Independence only | PASS |
| No FT-3B / FT-3D / WS-2 | PASS |
| No Source Reference implementation | PASS |
| No save/publish product implementation | PASS (reject body keys only) |
| No visibility policy | PASS |
| No migrations / OpenAPI / SDK / UI | PASS |
| FT-3A intent layer unchanged | PASS — `authorialExpression.ts` not modified |
| FT-5 stack unchanged | PASS |
| Consumes FT-3A on write/read | PASS |

## 2. Files Changed

| File | Change |
| --- | --- |
| `apps/space-service/src/domain/authorialIndependence.ts` | **NEW** — independence proof + classifier |
| `apps/space-service/test/authorialIndependence.test.ts` | **NEW** — E7 T1–T14 |
| `apps/space-service/src/services/spaceService.ts` | **MODIFIED** — independence assert on write; read carrier; event field |
| `apps/space-service/test/request.test.ts` | **MODIFIED** — HTTP T14 save/publish negative |

Files not changed:

- `authorialExpression.ts` (FT-3A regression preserved)
- FT-5A–5D modules
- OpenAPI, SDK, DB schema

## 3. Authorial Independence Module

Module: `authorialIndependence.ts`

| Capability | Purpose |
| --- | --- |
| `AUTHORIAL_INDEPENDENCE_CLASSIFIER` | Canonical independence classifier token |
| `isAuthorialTextPrimary` | Text-primary guard (min length + min 3 words; weak labels rejected) |
| `passesSourceDisappearsTest` | 13B.3-B §7 — meaning without `repostTarget*` |
| `classifyAuthorialIndependence` | Classifier on explicit authorial write only |
| `buildAuthorialIndependenceProof` | E5 proof object |
| `buildAuthorialIndependenceNegativesProof` | E6 collapse negatives |
| `assertAuthorialIndependenceWrite` | Write-path gate (after FT-3A) |
| `assertNoSavePublishFieldsOnAuthorialWrite` | FT-3D negative (CO-4) |
| `assertAuthorialIndependenceReadCarrier` | Read carrier safety (NR-N1 bounded) |

## 4. Independence Proof

`AuthorialIndependenceProof` fields:

| Field | Meaning |
| --- | --- |
| `isTextPrimary` | Author text is substantive payload |
| `isRepostIndependent` | `postType: post` + explicit intent; not repost path |
| `isSourceReferenceOptional` | No `repostTarget*` on carrier |
| `isSavePublishIndependent` | No save/publish body keys |
| `passesSourceDisappearsTest` | Text carries meaning if SR absent |
| `isAuthorialIndependenceProof` | All above on authorial write |
| `isFullP4LifecycleEstablished` | **false** (CO-13) |

## 5. Source Disappears Test

Implemented as `passesSourceDisappearsTest`:

- Requires `authorialExpressionIntent: true`, `postType: post`, no `repostTarget*`
- Requires `isAuthorialTextPrimary(text)` — author thought stands alone
- **Does not implement Source Reference** — proves independence in absence of SR fields

## 6. E5 Independence Proof

| Evidence | Status |
| --- | --- |
| Independence proof object on write | PASS |
| Classifier `authorial_independence` | PASS |
| Not `postType: post` alone | PASS (T9) |
| Not OpenAPI-only | PASS (T10) |
| Event staging `authorialIndependence` | PASS (internal payload) |

## 7. E6 Negatives

| Negative | Implementation |
| --- | --- |
| Repost dependency | `notRepostDependent`; T2, T3 |
| Source dependency | `notSourceReferenceDependent`; T7 |
| Save/publish dependency | `FORBIDDEN_SAVE_PUBLISH_BODY_KEYS`; T14 |
| Legacy dependency | `notLegacyRowDependent`; T5, T6 |
| Private note dependency | `notPrivateNoteDependent`; T4 |

## 8. E7 Tests

| ID | Test | File |
| --- | --- | --- |
| T1 | text-primary | `authorialIndependence.test.ts` |
| T2 | no repost dependency | `authorialIndependence.test.ts` |
| T3 | P1 negative | `authorialIndependence.test.ts` |
| T4 | P2 negative | `authorialIndependence.test.ts` |
| T5 | P6 commentary negative | `authorialIndependence.test.ts` |
| T6 | P6 row negative | `authorialIndependence.test.ts` |
| T7 | source disappears | `authorialIndependence.test.ts` |
| T8 | weak text fail | `authorialIndependence.test.ts` |
| T9 | postType only fail | `authorialIndependence.test.ts` |
| T10 | OpenAPI fail | `authorialIndependence.test.ts` |
| T11 | FT-3A regression | `authorialIndependence.test.ts` |
| T12 | WS-5 regression | `authorialIndependence.test.ts` |
| T13 | dedupe independence | `authorialIndependence.test.ts` |
| T14 | save/publish negative | `authorialIndependence.test.ts` + `request.test.ts` |

**Executed:** 14 domain + 1 HTTP = 15 FT-3C-focused; full suite **135/135 PASS**.

## 9. FT-X1 Compliance

| Boundary | Status |
| --- | --- |
| P4 independence ≠ P1 private repost | PASS |
| P4 independence ≠ P2 private note | PASS |
| P4 independence ≠ P6 legacy | PASS |
| P4 independence ≠ P5 SR | PASS (negative only) |
| P4 independence ≠ save/publish | PASS |
| `postType: post` alone insufficient | PASS |
| FT-3A + FT-5 not replaced | PASS |

## 10. FT-X2 Compliance

WS-3 spine progress:

| Step | Status after FT-3C |
| --- | --- |
| E3 authorial write (step 4) | FILLED (FT-3A; unchanged) |
| E5 independence leg (step 5) | **PARTIAL → progress FILLED at write** |
| P5 SR (step 7) | NOT FILLED |
| Trio rollup | BLOCKED |

Note: read-time independence rehydration remains write-bounded per NR-N1 (not in FT-3C scope).

## 11. Carve-Out Verification

| ID | Result |
| --- | --- |
| CO-3 (SR negative only) | PASS |
| CO-4 (save/publish reject keys only) | PASS |
| CO-5 (visibility unchanged) | PASS |
| CO-12 (no P5) | PASS |
| CO-13 (no full P4/Trio claim) | PASS |
| CO-17 (before FT-3B) | PASS |

**Carve-out matrix: PASS**

## 12. Validation Results

| Check | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service typecheck` | PASS |
| `pnpm --filter @go2asia/space-service test` (FT-3A + FT-3C + WS-5 + request) | **135/135 PASS** |
| `git diff --check` | PASS |

## 13. PASS / FAIL Assessment

Alignment with Stage 13B.5-O gate (14 PASS / 19 FAIL criteria):

| Gate requirement | Impl status |
| --- | --- |
| Independence on explicit authorial write (E3+E5) | PASS |
| Text-primary without SR | PASS |
| E6 negatives | PASS |
| E7 T1–T14 | PASS |
| FT-3A unchanged | PASS |
| WS-5 consumed | PASS |
| No SR / save-publish / WS-2 scope creep | PASS |
| Tokens: SR/Trio/WS-2 FALSE | PASS |

**Stage 13B.5-P verdict: PASS**

## 14. Final Tokens

```yaml
stage_13B_5_P_status: ACCEPTED
stage_13B_5_P_ft_3c_complete: TRUE
stage_13B_5_P_authorial_post_runtime_primitive_established: TRUE  # bounded expression + independence write path; NR-N1 read persistence carve-out remains
stage_13B_5_P_source_reference_runtime_primitive_established: FALSE
stage_13B_5_P_foundation_trio_ready: FALSE
stage_13B_5_P_ws2_authorized: FALSE
```

## Execution Summary

### Changed files

- `apps/space-service/src/domain/authorialIndependence.ts` (new)
- `apps/space-service/test/authorialIndependence.test.ts` (new)
- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/test/request.test.ts`
- `docs/reports/stage_13B_5_P_ft_3C_authorial_independence_implementation_v1.md`

### Independence proof status

| Class | Status |
| --- | --- |
| E3 | **PRIMARY — PASS** |
| E5 | **PRIMARY — PASS** |
| E6 | **PRIMARY — PASS** |
| E7 | **PRIMARY — PASS** (T1–T14) |

### Next safe step

**Stage 13B.5-PR** — FT-3C Implementation Review & Acceptance.

Then per cutline: **FT-3D** save/publish gate/impl or **FT-3B** Source Reference gate — not before FT-3C JR.

### Invariants

```
FT-3C Complete ≠ Source Reference Established
Source Reference Established ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
