# Stage 13B.5-E9-PI — Contract / OpenAPI + SDK Implementation

## 1. Scope Verification

**Mode:** `FOUNDATION_TRIO_CONTRACT_OPENAPI_IMPLEMENTATION_ONLY` (E9-PI).

| Constraint | Status |
| --- | --- |
| Contract-only: OpenAPI + bundle + generated types/SDK + this report | **PASS** |
| No `apps/space-service` edits | **PASS** |
| No `packages/db` edits | **PASS** |
| No runtime / UI / PWA / visibility / BV / WS-2 | **PASS** |
| E9-D2 MATERIAL_ONLY locked in public schemas | **PASS** |
| `foundation_trio_ready` / `ws2_authorized` not lifted | **PASS** |
| Y-HB3 not cleared at PI | **PASS** |

**Branch:** `feat/stage-13b5-e9-space-contract` (from `main`).

**Inputs (read via persistence branch / prior gates):** E9 gate, PP, PV, PM authorization; PJR persistence accepted as runtime mirror authority.

### Multi-agent mode (7/7)

| # | Agent | PI finding |
| --- | --- | --- |
| 1 | **AI Program Director / Project Orchestrator** | E9-PI executed as bounded contract slice; no Trio/WS-2 closure; next step E9-PJR. |
| 2 | **Slice Strategist** | Touch set limited to `docs/openapi/space.yaml`, bundle, `packages/types` + `packages/sdk` generated trees, PI report. |
| 3 | **Runtime Governance Architect** | MATERIAL_ONLY SR components; separate `SpaceSourceMaterialType`; anti-collapse copy on SR and `repostTarget*`. |
| 4 | **Runtime Validation Agent** | `pnpm --filter @go2asia/space-service test` — **168/168 PASS** (main-line baseline); `tsc --noEmit` PASS; no runtime diff. |
| 5 | **Backend Developer** | OpenAPI mirrors nested SR + authorial intent semantics aligned with `sourceReferenceBoundary.ts` / `spaceService` (read-only verify). |
| 6 | **QA Agent** | Generated types/SDK lack classifier/hopCount; additive optional fields only; `openapi:check` pending commit (E9-MUST-10). |
| 7 | **Technical Canon Writer** | PI tokens: `OPEN_UNTIL_E9_PJR`, Trio/WS-2 FALSE; invariants preserved in §16. |

---

## 2. Files Changed

| Path | Action |
| --- | --- |
| `docs/openapi/space.yaml` | Modified |
| `docs/openapi/openapi.bundle.yaml` | Modified (bundled) |
| `packages/types/src/generated/createSpacePostRequest.ts` | Modified |
| `packages/types/src/generated/spacePostResponse.ts` | Modified |
| `packages/types/src/generated/spaceRepostTargetType.ts` | Modified (description) |
| `packages/types/src/generated/index.ts` | Modified |
| `packages/types/src/generated/spaceSourceMaterialType.ts` | **New** |
| `packages/types/src/generated/spaceSourceReference.ts` | **New** |
| `packages/types/src/generated/spaceSourceReferenceInput.ts` | **New** |
| `packages/sdk/src/generated/createSpacePostRequest.ts` | Modified |
| `packages/sdk/src/generated/spacePostResponse.ts` | Modified |
| `packages/sdk/src/generated/spaceRepostTargetType.ts` | Modified |
| `packages/sdk/src/generated/index.ts` | Modified |
| `packages/sdk/src/generated/spaceSourceMaterialType.ts` | **New** |
| `packages/sdk/src/generated/spaceSourceReference.ts` | **New** |
| `packages/sdk/src/generated/spaceSourceReferenceInput.ts` | **New** |
| `docs/reports/stage_13B_5_E9_PI_contract_openapi_sdk_implementation_v1.md` | **New** (this report) |

**Not changed:** `apps/space-service/**`, `packages/db/**`, PWA, api-gateway runtime code.

---

## 3. OpenAPI Changes

In `docs/openapi/space.yaml`:

1. New components: `SpaceSourceMaterialType`, `SpaceSourceReferenceInput`, `SpaceSourceReference`.
2. `SpaceRepostTargetType` — augmented description (P1/P6 binding, not P5).
3. `CreateSpacePostRequest` — `authorialExpressionIntent`, `sourceReference`; augmented `repostTarget*` descriptions.
4. `SpacePostResponse` — `authorialExpressionIntent`, `sourceReference` (applies wherever `SpacePostResponse` is referenced, including feed embeddings).

---

## 4. CreateSpacePostRequest

| Field | Type | Semantics |
| --- | --- | --- |
| `authorialExpressionIntent` | `boolean`, optional, **default: false** | P4 opt-in on `postType=post`; false/omitted on repost; true requires trimmed non-empty text. |
| `sourceReference` | `SpaceSourceReferenceInput`, optional, **nullable** | P5 nested canonical form; 0..1; requires `authorialExpressionIntent=true` on create; not repost/quote-repost. |

---

## 5. SpacePostResponse

| Field | Type | Semantics |
| --- | --- | --- |
| `authorialExpressionIntent` | `boolean`, optional | Documented **omit-when-false** — not emitted as `false`. |
| `sourceReference` | `SpaceSourceReference`, optional, **nullable** | MATERIAL_ONLY pair when persisted; omitted when absent. |

---

## 6. SourceReference Components

### SpaceSourceMaterialType

```yaml
enum: [space_post, blog_post, place, event, partner, listing, quest]
```

Standalone enum — **not** `$ref` to `SpaceRepostTargetType`.

### SpaceSourceReferenceInput (create)

- Required: `sourceMaterialType`, `sourceMaterialId`
- `additionalProperties: false`
- MATERIAL_ONLY

### SpaceSourceReference (read)

- Required: `sourceMaterialType`, `sourceMaterialId`
- `additionalProperties: false`
- MATERIAL_ONLY

---

## 7. MATERIAL_ONLY Verification

| Check | Result |
| --- | --- |
| `classifier` in `space.yaml` SR components | **ABSENT** |
| `hopCount` in public SR schemas | **ABSENT** |
| `authorialIndependence` / `savePublishBoundary` / proof JSON on post DTOs | **ABSENT** |
| Generated `spaceSourceReference*.ts` fields | Only `sourceMaterialType`, `sourceMaterialId` |

---

## 8. Anti-Collapse Descriptions

Coverage (D-SR pack + repostTarget augmentation):

| Theme | Where documented |
| --- | --- |
| sourceReference ≠ repostTarget | SR input/response/create field descriptions; `SpaceRepostTargetType` description |
| sourceReference ≠ repost / quote-repost | SR + create `sourceReference` descriptions |
| sourceReference optional, one-hop, secondary context | SR component + response descriptions |
| Requires `authorialExpressionIntent` on create | `CreateSpacePostRequest.sourceReference` |
| repostTarget = propagation/retention binding, not P5 | `repostTargetType` / `repostTargetId` on create |
| Nested SR canonical; flat keys non-normative | `SpaceSourceReferenceInput` description (PV-N1 footnote) |
| Response intent omit-when-false | `SpacePostResponse.authorialExpressionIntent` |

---

## 9. Generated Types

**New files:**

- `packages/types/src/generated/spaceSourceMaterialType.ts`
- `packages/types/src/generated/spaceSourceReference.ts`
- `packages/types/src/generated/spaceSourceReferenceInput.ts`

**Updated:**

- `createSpacePostRequest.ts` — optional `authorialExpressionIntent`, `sourceReference`
- `spacePostResponse.ts` — optional `authorialExpressionIntent`, `sourceReference`
- `spaceRepostTargetType.ts` — description only
- `index.ts` — exports for new schemas

---

## 10. Generated SDK

Mirror of types package:

- New: `spaceSourceMaterialType.ts`, `spaceSourceReference.ts`, `spaceSourceReferenceInput.ts`
- Updated: `createSpacePostRequest.ts`, `spacePostResponse.ts`, `spaceRepostTargetType.ts`, `index.ts`

---

## 11. Contract Validation

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm openapi:bundle` | **PASS** | `docs/openapi/openapi.bundle.yaml` updated |
| `pnpm gen:types` | **PASS** | Orval types regenerated |
| `pnpm gen:sdk` | **PASS** | Orval SDK regenerated |
| `pnpm openapi:check` | **PASS** | Verified after commit `dc2a093` (drift guard clean). |

---

## 12. Runtime Regression

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/space-service test` | **PASS — 168/168** (9 files) |
| `pnpm --filter @go2asia/space-service exec tsc --noEmit` | **PASS** |
| `git diff --check` | **PASS** |

**Note on E9-MUST-13 (176/176):** This branch is cut from `main` without persistence-only tests (`test/persistenceRehydration.test.ts` et al.). **No test failures** from contract-only diff. When merged with `feat/stage-13b5-persistence-minimal`, E9-PJR should re-run suite for **176/176** authority baseline.

---

## 13. E9 MUST Verification

| ID | PI status |
| --- | --- |
| E9-MUST-1 | **PASS** — create fields added |
| E9-MUST-2 | **PASS** — MATERIAL_ONLY, `additionalProperties: false` |
| E9-MUST-3 | **PASS** — separate `SpaceSourceMaterialType`, 7 members |
| E9-MUST-4 | **PASS** — nested canonical + flat footnote |
| E9-MUST-5 | **PASS** — anti-collapse + repostTarget descriptions |
| E9-MUST-6 | **PASS** — response fields on `SpacePostResponse` |
| E9-MUST-7 | **PASS** — omit-when-false documented |
| E9-MUST-8 | **PASS** — bundle regenerated |
| E9-MUST-9 | **PASS** — types + SDK regenerated |
| E9-MUST-10 | **PASS** — committed; `openapi:check` exit 0 |
| E9-MUST-11 | **PASS** — generated fields + new modules |
| E9-MUST-12 | **PASS** — no runtime/DB/PWA |
| E9-MUST-13 | **PASS_WITH_NOTE** — 168/168 on branch; 176 at PJR after persistence merge |
| E9-MUST-14 | **PASS** — this report |
| E9-MUST-15 | **PASS** — tokens §16 |
| E9-MUST-16 | **N/A at PI** — E9-PJR responsibility |
| E9-MUST-17 | **N/A at PI** — E9-PJR (PV-N2 wire superset) |

---

## 14. E9 FAIL Verification

| ID | Triggered? |
| --- | --- |
| E9-FAIL-1 | **NO** |
| E9-FAIL-2 | **NO** |
| E9-FAIL-3 | **NO** |
| E9-FAIL-4 | **NO** |
| E9-FAIL-5 | **NO** |
| E9-FAIL-6 | **NO** |
| E9-FAIL-7 | **NO** |
| E9-FAIL-8 | **NO** |
| E9-FAIL-9 | **NO** |
| E9-FAIL-10 | **NO** |
| E9-FAIL-11 | **NO** — Y-HB3 not cleared |
| E9-FAIL-12 | **NO** |
| E9-FAIL-13 | **NO** |
| E9-FAIL-14 | **NO** |
| E9-FAIL-15 | **NO** |

---

## 15. Validation Results

```
pnpm openapi:bundle          → PASS
pnpm gen:types               → PASS
pnpm gen:sdk                 → PASS
pnpm openapi:check           → PASS (post-commit dc2a093)
pnpm --filter @go2asia/space-service test     → PASS 168/168
pnpm --filter @go2asia/space-service exec tsc --noEmit → PASS
git diff --check             → PASS
```

---

## 16. Final Tokens

```yaml
stage_13B_5_E9_PI_status: PASS
stage_13B_5_E9_PI_contract_impl_complete: TRUE
stage_13B_5_E9_PI_y_hb3_status: OPEN_UNTIL_E9_PJR
stage_13B_5_E9_PI_foundation_trio_ready: FALSE
stage_13B_5_E9_PI_ws2_authorized: FALSE
FOUNDATION_TRIO_CLOSED: FALSE
```

### Invariants (preserved)

```
E9 Implementation ≠ Y-HB3 Cleared
Y-HB3 Cleared ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
OpenAPI ≠ Runtime Proof
```

---

## Execution Summary

| Item | Value |
| --- | --- |
| Changed files | See §2 (15 contract artifacts + 1 report) |
| Validation | Bundle/gen PASS; tests 168/168; `openapi:check` after commit |
| PI outcome | **PASS** — committed `dc2a093`, pushed `feat/stage-13b5-e9-space-contract` |
| Next safe step | **Stage 13B.5-E9-PJR — Contract Implementation Review & Acceptance** |

**Remote:** `origin/feat/stage-13b5-e9-space-contract` — open PR when ready.
