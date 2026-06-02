# Stage 13B.5-E9-PP — Contract / OpenAPI Planning

## 1. Inputs Reviewed

Execution mode:

- `FOUNDATION_TRIO_CONTRACT_OPENAPI_PLANNING_ONLY`
- no coding;
- no OpenAPI edits;
- no SDK generation;
- no schema / DB / runtime / frontend / backend changes;
- no Foundation Trio closure;
- no `foundation_trio_ready` lift;
- no WS-2 authorization.

### Governance documents

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_E9_contract_openapi_authorization_gate_v1.md` | **Primary input** — YES_WITH_CONDITIONS; inventory; E9-COND-1..8 |
| `docs/reports/stage_13B_5_PJR_foundation_trio_persistence_implementation_review_and_acceptance_v1.md` | Runtime authority; T-PP; Y-HB2 cleared |
| `docs/reports/stage_13B_5_PI_foundation_trio_persistence_implementation_v1.md` | API projection rules (PP-D9) |
| `docs/reports/stage_13B_5_ZR_ft_x3_foundation_trio_closure_review_v1.md` | Y-HB3; NR-N2/TR-N2 |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | E9 NEVER-SUFFICIENT; false-pass catalog |

### Code / contract inspected (read-only)

| Path | Role |
| --- | --- |
| `docs/openapi/space.yaml` | SSOT fragment — baseline without authorial/SR |
| `docs/openapi/openapi.bundle.yaml` | Orval input bundle |
| `orval.config.ts` | `gen:types`, `gen:sdk` from bundle |
| `packages/types/src/generated/createSpacePostRequest.ts` | Current create DTO |
| `packages/types/src/generated/spacePostResponse.ts` | Current response DTO |
| `packages/sdk/src/generated/*` | SDK mirror |
| `apps/space-service/src/domain/sourceReferenceBoundary.ts` | `SOURCE_MATERIAL_TYPES`; parse/write rules |
| `apps/space-service/src/domain/persistenceRehydration.ts` | Read projection |
| `apps/space-service/src/domain/authorialExpression.ts` | `parseAuthorialExpressionIntentFromBody` |
| `apps/space-service/src/services/spaceService.ts` | `createPost`; `mapPostResponse` |
| `apps/space-service/test/request.test.ts` | HTTP shape evidence (authorial create, T-PP-1..3) |

### Program posture (accepted inputs)

| Token | Value |
| --- | --- |
| E9 gate | **YES_WITH_CONDITIONS** |
| `e9_contract_track_authorized` | **TRUE** |
| `e9_openapi_implementation_authorized` | **FALSE** (until E9-PM) |
| Y-HB3 | **OPEN_UNTIL_IMPL_COMPLETE** |
| `foundation_trio_ready` | **FALSE** |
| `ws2_authorized` | **FALSE** |

### Multi-agent mode

**Activated.** Seven mandated roles; §2 lists **per-agent findings** (not a merged summary).

---

## 2. Multi-Agent Execution Review

| # | Agent | Finding IDs | Disposition |
| --- | --- | --- | --- |
| 1 | **AI Program Director / Project Orchestrator** | ORCH-PP-1..4 | PASS |
| 2 | **Slice Strategist** | STRAT-PP-1..4 | PASS |
| 3 | **Runtime Governance Architect** | GOV-PP-1..4 | PASS |
| 4 | **Runtime Validation Agent** | VAL-PP-1..4 | PASS_WITH_NOTE |
| 5 | **Backend Developer (review mode)** | BE-PP-1..4 | PASS |
| 6 | **QA Agent** | QA-PP-1..4 | PASS_WITH_NOTE |
| 7 | **Technical Canon Writer** | CANON-PP-1..4 | PASS |

### 2.1 Per-agent findings (detail)

**1 — AI Program Director / Project Orchestrator**

- **ORCH-PP-1:** User accepted **E9 gate** (`YES_WITH_CONDITIONS`); **E9-PP** fulfills E9-COND-2/4 (shape lock + anti-collapse descriptions) before PV/PM/PI.
- **ORCH-PP-2:** Planning closes the **contract vocabulary gap** (NR-N2, TR-N2) at design tier — not Y-HB3 clearance (requires E9-PI + E9-PJR).
- **ORCH-PP-3:** Recommended track: **E9-PP → E9-PV → E9-PM → E9-PI → E9-PJR** — mirrors persistence program rhythm.
- **ORCH-PP-4:** Parallel blockers **Y-HB1, Y-HB4, Y-HB6** remain; E9-PP does not reorder BV/visibility/E4 gates.

**2 — Slice Strategist**

- **STRAT-PP-1:** E9-PI slice (planned) = `docs/openapi/space.yaml` + bundle regen + `gen:types` + `gen:sdk` + CI `openapi:check` — **no** `space-service`, DB, UI.
- **STRAT-PP-2:** Branch: **`feat/stage-13b5-e9-space-contract`** — single PR family per E9 gate STRAT-E9-4.
- **STRAT-PP-3:** Consumer adoption (PWA shell typing) is **follow-on** — not required inside E9-PI; optional separate UI slice after E9-PJR.
- **STRAT-PP-4:** Reject bundling proof classifiers, WS-2, Trio closure, or runtime “cleanup” into E9-PI.

**3 — Runtime Governance Architect**

- **GOV-PP-1:** **Runtime primary** — OpenAPI must mirror post-PJR `mapPostResponse` / `createPost` behavior, not redefine semantics (E9-COND-1).
- **GOV-PP-2:** **Public contract = material-only** for `sourceReference` (E9-D2) — no `classifier`, `hopCount`, or proof blobs in published schemas (E9-COND-2 satisfied).
- **GOV-PP-3:** **`SpaceSourceMaterialType`** separate from **`SpaceRepostTargetType`** — same string values allowed, different semantic enums (E9-COND-3).
- **GOV-PP-4:** Anti-collapse description pack required on create fields + `repost` vs `sourceReference` (E9-COND-4).

**4 — Runtime Validation Agent**

- **VAL-PP-1:** Write validation mirrors runtime: `authorialExpressionIntent === true` only; SR nested object with paired type/id; repost rejects both.
- **VAL-PP-2:** Read contract documents **omit-when-false** for intent (T-PP-1); SR when DB pair set (T-PP-2/3).
- **VAL-PP-3:** E9-JR evidence = runtime tests **plus** contract diff — OpenAPI alone never E3/E5 FILLED (C2).
- **VAL-PP-4:** **NOTE:** Runtime today may JSON-serialize extra SR keys (`classifier`, `hopCount`); normative contract is material-only — JR must not treat OpenAPI as forcing runtime trim in E9-PI.

**5 — Backend Developer (review mode)**

- **BE-PP-1:** `parseAuthorialExpressionIntentFromBody` — strict `=== true`; plan documents optional boolean default false.
- **BE-PP-2:** `parseSourceReferenceFromBody` — accepts nested `sourceReference` or flat `sourceMaterialType`/`sourceMaterialId`; **plan documents nested form only** on public create (flat form internal/legacy tolerance optional in description footnote).
- **BE-PP-3:** Material type validation uses `SOURCE_MATERIAL_TYPES` set at runtime — OpenAPI enum must list same seven values.
- **BE-PP-4:** Event payloads (`authorialIndependence`, `savePublishBoundary`, classifier objects) remain **OUT** of `SpacePostResponse`.

**6 — QA Agent**

- **QA-PP-1:** Adding optional OpenAPI fields is **backward compatible** for JSON; codegen gains optional properties — no required-field breaking change.
- **QA-PP-2:** E9-PI verification: `openapi:check` (bundle+gen+diff) + manual diff review of `createSpacePostRequest.ts` / `spacePostResponse.ts`.
- **QA-PP-3:** Contract assertions should use **`toMatchObject` minimum** (material fields) — aligns with T-PP-2/3 tests, not classifier keys.
- **QA-PP-4:** PWA shell still untyped for authorial fields until regen + optional consumer PR — not E9-PP blocker.

**7 — Technical Canon Writer**

- **CANON-PP-1:** **E9 Planning ≠ E9 Implementation ≠ Trio Ready** — tokens in §16.
- **CANON-PP-2:** **E9-D2 (material-only)** resolves E9 gate disagreement — public DTO excludes proof; runtime superset documented as non-normative until optional future trim slice.
- **CANON-PP-3:** Y-HB3 clears only after **E9-PJR** — PP enables **PV/PM** only.
- **CANON-PP-4:** NR-N2/TR-N2 **planned for closure** at contract tier post-impl; PR-N2/RR-N1/BV/visibility unchanged.

### 2.2 Disagreements between agents

| Topic | Agent A | Agent B | Resolution |
| --- | --- | --- | --- |
| `sourceReference` shape | Runtime: classifier-enriched today | Governance: material-only contract | **E9-D2 MATERIAL_ONLY** — normative OpenAPI; extras non-normative (VAL-PP-4) |
| Flat SR on create body | Backend: runtime accepts flat keys | Strategist: one public shape | **Nested `sourceReference` only** in OpenAPI; flat noted as runtime tolerance in description |
| Runtime trim in E9-PI | QA: tests match material only | — | **OUT of E9-PI** — optional future slice; not blocking contract mirror |
| Review readiness | Orchestrator: YES after PP | Validation: YES_WITH_CONDITIONS | **YES_WITH_CONDITIONS** — PV-COND-1..4 |

**Blocking disagreement:** None.

---

## 3. Runtime Source of Truth

| Principle | Planning rule |
| --- | --- |
| **Runtime primary** | `space-service` HTTP behavior + persistence rehydration is authoritative for field presence and validation outcomes. |
| **OpenAPI mirror** | `docs/openapi/space.yaml` documents what clients may send/expect — must not introduce new semantics. |
| **OpenAPI ≠ proof** | C2 E9 NEVER-SUFFICIENT; Z-F4 — contract alignment does not establish P4/P5 or `foundation_trio_ready`. |
| **DB not in OpenAPI** | Columns `authorial_expression_intent`, `source_material_*` stay internal; API projection only. |

### Authority chain (create/read)

```
Client JSON
  → createPost asserts (FT-3A/3B/3C/3D)
  → insertSpacePost (persist)
  → getPostById
  → mapPostResponse → rehydrateAuthorialFieldsFromRow
  → HTTP 201 / GET / feed JSON
```

OpenAPI must describe **HTTP JSON** at the boundary, not domain proof types.

---

## 4. CreateSpacePostRequest Plan

### 4.1 Fields to add

| Field | OpenAPI type | Required | Default / null |
| --- | --- | --- | --- |
| `authorialExpressionIntent` | `boolean` | **No** (optional) | default: `false` if omitted |
| `sourceReference` | `$ref: SpaceSourceReferenceInput` | **No** | nullable |

### 4.2 Validation semantics (documented + JSON Schema where feasible)

| Rule ID | Semantics | Runtime alignment |
| --- | --- | --- |
| **CR-VAL-1** | Only when `postType = post` may `authorialExpressionIntent` be `true` | `rejects authorialExpressionIntent on repost` |
| **CR-VAL-2** | When `postType = repost`, `authorialExpressionIntent` must be absent or `false` | Same |
| **CR-VAL-3** | When `postType = post`, `repostTargetType` / `repostTargetId` must be absent | FT-3A/3C |
| **CR-VAL-4** | `sourceReference` only when `postType = post` and `authorialExpressionIntent = true` | FT-3B |
| **CR-VAL-5** | `sourceReference` requires both `sourceMaterialType` and `sourceMaterialId` | `parseSourceReferenceFromBody` |
| **CR-VAL-6** | `sourceMaterialType` ∈ `SpaceSourceMaterialType` | `assertSourceReferenceMaterialValid` |
| **CR-VAL-7** | At most one SR (no array) | Runtime throws on array |

### 4.3 Relation to `postType`

| `postType` | `authorialExpressionIntent` | `sourceReference` | `repostTarget*` |
| --- | --- | --- | --- |
| `post` | optional (`true` opts into P4) | optional 0..1 on authorial | **forbidden** |
| `repost` | **forbidden** | **forbidden** | required pair |

### 4.4 Relation to `repostTarget*`

| Statement | Planning |
| --- | --- |
| `repostTarget*` | Propagation / retention binding (P1/P6) — **not** Source Reference |
| `sourceReference` | P5 one-hop material context on **authorial** posts only |
| Mutual exclusion | Authorial post cannot carry both SR and `repostTarget*` (DB CK-PP-5 + write asserts) |

### 4.5 JSON Schema sketch (for E9-PI)

```yaml
# Add to CreateSpacePostRequest.properties:
authorialExpressionIntent:
  type: boolean
  default: false
  description: |
    Opt-in P4 authorial expression on postType=post only. Must be false or omitted on repost.
sourceReference:
  $ref: '#/components/schemas/SpaceSourceReferenceInput'
  nullable: true
# Optional allOf guards (E9-PI): if postType=repost then forbid authorial fields
```

---

## 5. SpacePostResponse Plan

### 5.1 Fields to add

| Field | OpenAPI type | Required on schema |
| --- | --- | --- |
| `authorialExpressionIntent` | `boolean` | **No** — optional property |
| `sourceReference` | `$ref: SpaceSourceReference` | **No** — optional, nullable |

### 5.2 When present (normative contract)

| Field | Present when | Absent when |
| --- | --- | --- |
| `authorialExpressionIntent` | Persisted flag `true` | Omitted when false (PP-D9 / T-PP-1) — **do not** emit `false` |
| `sourceReference` | Both `source_material_*` set in DB | Omitted when null |

### 5.3 Read surfaces (same `SpacePostResponse` schema)

| Operation / embedding | Planned coverage |
| --- | --- |
| `GET /v1/space/posts/{id}` | Yes |
| `POST /v1/space/posts` 201 | Yes |
| `PATCH` repost commentary 200 | Yes (inherits mapper) |
| `SpaceFeedItem.post` (home, group, profile, activity feeds) | Yes — nested same schema |
| Convenience repost endpoints | Yes where response is `SpacePostResponse` |

### 5.4 Backwards compatibility

| Aspect | Plan |
| --- | --- |
| Existing clients | New fields optional — no breakage for parsers ignoring unknown keys |
| Codegen clients | Gain optional properties — compile-time additive |
| Legacy DB rows | Backfill `intent=false`, SR null — responses omit authorial fields (T-PP-4 semantics) |
| `false` intent on wire | **Not emitted** — document omit-when-false explicitly |

---

## 6. SourceReference Public Shape

### 6.1 Options considered

| Option | OpenAPI content | Verdict |
| --- | --- | --- |
| **A — Material-only** | `sourceMaterialType` + `sourceMaterialId` | **SELECTED (E9-D2)** |
| B — Classifier-enriched | + `classifier`, `hopCount` | **REJECTED** — proof-adjacent; false-pass risk |
| C — Hybrid optional classifier | classifier optional on response | **REJECTED** — still fixes proof vocabulary in contract |

### 6.2 Selected shape: **MATERIAL_ONLY**

**`SpaceSourceReferenceInput`** (request):

```yaml
type: object
required: [sourceMaterialType, sourceMaterialId]
properties:
  sourceMaterialType:
    $ref: '#/components/schemas/SpaceSourceMaterialType'
  sourceMaterialId:
    type: string
    minLength: 1
additionalProperties: false
```

**`SpaceSourceReference`** (response):

```yaml
type: object
required: [sourceMaterialType, sourceMaterialId]
properties:
  sourceMaterialType:
    $ref: '#/components/schemas/SpaceSourceMaterialType'
  sourceMaterialId:
    type: string
additionalProperties: false
```

### 6.3 Runtime superset note (non-normative)

Today `buildSourceReferenceResponseStaging` may add `classifier` and `hopCount: 1` to HTTP JSON. **E9-PI does not change runtime** (E9 scope OUT). Plan:

| Layer | Rule |
| --- | --- |
| **Normative contract** | Material pair only |
| **Runtime (current)** | May include extra keys — clients **must not** depend on them |
| **Future (optional)** | Separate runtime projection trim slice — **not** part of E9-PI |
| **E9-PJR** | PASS if OpenAPI material-only + runtime tests still green; document superset in JR notes |

---

## 7. SpaceSourceMaterialType Plan

### 7.1 New enum (separate from `SpaceRepostTargetType`)

| Value | Notes |
| --- | --- |
| `space_post` | Same string as repost target enum — **different schema** |
| `blog_post` | |
| `place` | |
| `event` | |
| `partner` | |
| `listing` | |
| `quest` | |

**Source of truth:** `SOURCE_MATERIAL_TYPES` in `sourceReferenceBoundary.ts` (7 values).

### 7.2 Why not reuse `SpaceRepostTargetType`

| Risk | Mitigation |
| --- | --- |
| Client maps P5 → repost propagation | Separate type name `SpaceSourceMaterialType` |
| OpenAPI codegen collapse | Distinct TypeScript type `SpaceSourceMaterialType` in generated SDK |
| BV-R1/R3 | Descriptions tie enum to **P5 material context** only |

---

## 8. OpenAPI Description Plan

### 8.1 `authorialExpressionIntent` (create + response)

| Description element | Text intent |
| --- | --- |
| Scope | Only `postType=post` |
| Meaning | Opt-in P4 authorial expression — not implied by `postType=post` alone |
| Response | Omitted unless `true` (persisted authorial row) |

### 8.2 `sourceReference` (create + response)

| # | Required description statement |
| --- | --- |
| D-SR-1 | **Source Reference ≠ `repostTarget*`** — different primitives (P5 vs P1/P6) |
| D-SR-2 | **Source Reference ≠ repost** — not a repost row; does not create `postType=repost` |
| D-SR-3 | **Not a quote-repost** — one-hop material context, not propagation |
| D-SR-4 | **Optional** — 0..1 per authorial post |
| D-SR-5 | **One-hop** — single `sourceMaterialType` + `sourceMaterialId` pair |
| D-SR-6 | **Secondary context** — subordinate to author text on authorial posts |
| D-SR-7 | **Requires authorial intent** on create — ignored/rejected without `authorialExpressionIntent: true` |

### 8.3 `repostTarget*` (existing — augment)

| Description element | Text intent |
| --- | --- |
| Scope | `postType=repost` propagation/retention binding |
| Not P5 | Must not be used to attach Source Reference material |

---

## 9. SDK / Types Impact

### 9.1 Toolchain (unchanged)

| Config | Path |
| --- | --- |
| Orval input | `docs/openapi/openapi.bundle.yaml` |
| Types output | `packages/types/src/generated/` |
| SDK output | `packages/sdk/src/generated/` |

### 9.2 Generated files expected to change (E9-PI)

| File (representative) | Change |
| --- | --- |
| `createSpacePostRequest.ts` | +`authorialExpressionIntent?`, +`sourceReference?` |
| `spacePostResponse.ts` | +`authorialExpressionIntent?`, +`sourceReference?` |
| **NEW** `spaceSourceMaterialType.ts` | Enum |
| **NEW** `spaceSourceReference.ts` | Response schema |
| **NEW** `spaceSourceReferenceInput.ts` | Request schema |
| `index.ts` (types + sdk) | Re-export new modules |
| `spaceFeedItem.ts` | Indirect — nested `SpacePostResponse` updated |
| All operation wrappers using post types | Type-only drift |

### 9.3 Consumers (informational)

| Consumer | Impact |
| --- | --- |
| `apps/go2asia-pwa-shell` | Becomes able to type authorial fields after regen + import update (follow-on) |
| `apps/api-gateway` | If validates against bundle — regen may be needed in gateway CI path |
| CI `openapi:check` | Will require committing bundle + generated artifacts |

---

## 10. Contract Tests / Checks

| Step | Command | Role in E9-PI |
| --- | --- | --- |
| 1 | `pnpm openapi:bundle` | Regenerate `docs/openapi/openapi.bundle.yaml` |
| 2 | `pnpm openapi:check` | Bundle + `gen:types` + `gen:sdk` + diff gate (CI) |
| 3 | `pnpm gen:types` | (included in check) Types regen |
| 4 | `pnpm gen:sdk` | (included in check) SDK regen |
| 5 | **Manual** generated diff review | Confirm new fields + enums; no classifier types |
| 6 | CI workflow | `.github/workflows/ci.yml` runs `openapi:check` on PR |
| 7 | Space-service tests | **No substitute** — remain 176/176; prove runtime authority |
| 8 | Content contract tests (if present) | Run after regen — confirm no unintended breakage |

**E9-PI JR must record:** `openapi:check` exit 0 after committing intended generated files.

---

## 11. E9 Implementation Scope

### 11.1 IN scope (E9-PI — after E9-PM)

| # | Item |
| --- | --- |
| 1 | Edit `docs/openapi/space.yaml` per §4–§8 |
| 2 | Add components: `SpaceSourceMaterialType`, `SpaceSourceReferenceInput`, `SpaceSourceReference` |
| 3 | Extend `CreateSpacePostRequest`, `SpacePostResponse` |
| 4 | `pnpm openapi:bundle` |
| 5 | `pnpm gen:types`, `pnpm gen:sdk` |
| 6 | Commit bundle + generated artifacts |
| 7 | `pnpm openapi:check` PASS |
| 8 | Governance reports: E9-PI, E9-PJR |

### 11.2 OUT scope

| Item | Reason |
| --- | --- |
| `space-service` code changes | Runtime already correct |
| DB / migrations | Persistence closed |
| Proof classifiers in OpenAPI | E9-FAIL-4 |
| UI / PWA changes | Separate adoption |
| Gateway behavior change | Unless required by check — default OUT |
| Runtime SR projection trim (`classifier` removal) | Optional future slice |
| WS-2, Trio closure, BV, visibility | Separate gates |
| `foundation_trio_ready` / `ws2_authorized` lift | Forbidden |

---

## 12. PASS Criteria (E9 implementation JR)

Carry forward E9 gate §8 with PP additions:

| ID | Criterion |
| --- | --- |
| E9-PASS-1..10 | As `stage_13B_5_E9_contract_openapi_authorization_gate_v1.md` §8 |
| **E9-PASS-11** | `SpaceSourceMaterialType` enum matches `SOURCE_MATERIAL_TYPES` (7 values) |
| **E9-PASS-12** | `sourceReference` schemas are **material-only** (`additionalProperties: false`) |
| **E9-PASS-13** | Description pack D-SR-1..7 present on SR fields |
| **E9-PASS-14** | Omit-when-false documented for response `authorialExpressionIntent` |

---

## 13. FAIL Criteria (E9 implementation JR)

Carry forward E9 gate §9 — emphasize:

| ID | FAIL condition |
| --- | --- |
| E9-FAIL-1 | OpenAPI/SDK cited as runtime or primitive **proof** |
| E9-FAIL-4 | Proof/classifier blobs in public post schemas |
| E9-FAIL-5 | `sourceReference` aliased to `repostTarget*` |
| E9-FAIL-2/3 | Trio closure or WS-2 tokens |
| E9-FAIL-6 | Runtime/DB/UI in same PR |
| E9-FAIL-7 | Contract contradicts omit-when-false or SR pairing rules |

---

## 14. Contract Decisions (E9-D*)

| ID | Decision | Value |
| --- | --- | --- |
| **E9-D1** | Runtime authority | **Runtime > OpenAPI mirror** |
| **E9-D2** | Public `sourceReference` shape | **MATERIAL_ONLY** |
| **E9-D3** | `SpaceSourceMaterialType` | **Separate enum** (not `SpaceRepostTargetType`) |
| **E9-D4** | Create SR wire form | **Nested `sourceReference` object** (canonical) |
| **E9-D5** | Response `authorialExpressionIntent` | **Omit when false** (not `false`) |
| **E9-D6** | Classifiers in public DTO | **OUT** |
| **E9-D7** | Runtime extras (`classifier`, `hopCount`) | **Non-normative superset** until optional trim slice |
| **E9-D8** | E9-PI changes runtime | **NO** |
| **E9-D9** | Y-HB3 clearance | **E9-PJR only** |
| **E9-D10** | Breaking change posture | **Additive optional fields only** |

---

## 15. E9 Risks

| Risk ID | Risk | Severity | Mitigation |
| --- | --- | --- | --- |
| **E9-R1** | OpenAPI treated as primitive proof | CRITICAL | E9-FAIL-1; C2; JR non-claims |
| **E9-R2** | Classifier fields added to schema | CRITICAL | E9-D2; E9-FAIL-4 |
| **E9-R3** | P5 ↔ `repostTarget*` collapse in SDK | HIGH | E9-D3 + D-SR-1..7 |
| **E9-R4** | Contract/runtime mismatch on omit-when-false | MEDIUM | E9-PASS-14; T-PP-1 |
| **E9-R5** | Runtime superset confuses codegen clients | MEDIUM | E9-D7; document in descriptions |
| **E9-R6** | `openapi:check` drift not committed | MEDIUM | E9-PI checklist §10 |
| **E9-R7** | Scope creep (runtime fix in E9 PR) | HIGH | E9-FAIL-6 |
| **E9-R8** | Trio/WS-2 false lift | CRITICAL | E9-FAIL-2/3; tokens FALSE |
| **E9-R9** | Enum drift (runtime adds 8th type) | MEDIUM | E9-PASS-11 cross-check |
| **E9-R10** | Gateway validation strips new fields | MEDIUM | Verify gateway uses updated bundle post-PI |

---

## 16. E9 Review Readiness

### Can program open **E9 Contract Review (PV)**?

**`YES_WITH_CONDITIONS`**

| Condition ID | Statement |
| --- | --- |
| PV-COND-1 | PV reviews this PP artifact — no OpenAPI file edits in PV |
| PV-COND-2 | PV confirms **E9-D2 MATERIAL_ONLY** and **E9-D3** separate enum |
| PV-COND-3 | PV does not treat planning as Y-HB3 cleared |
| PV-COND-4 | PM gate (recommended) produces E9-MUST/FAIL before E9-PI |

| Verdict tier | Applicable? |
| --- | --- |
| YES | After PV-COND satisfied |
| YES_WITH_CONDITIONS | **Selected** — plan complete; PV/PM still required |
| NO | **Not applicable** — E9 gate authorized planning |

---

## 17. Next Safe Step

1. **`Stage 13B.5-E9-PV — Contract / OpenAPI Review`** — multi-agent review of this PP.
2. **`Stage 13B.5-E9-PM — Contract Implementation Authorization Gate`** (recommended) — E9-MUST/FAIL for PI.
3. **`Stage 13B.5-E9-PI — OpenAPI + SDK Implementation`** — execute §11.1 only on `feat/stage-13b5-e9-space-contract`.
4. **`Stage 13B.5-E9-PJR — Contract Implementation Review`** — may clear **Y-HB3**.

**Not next:** Foundation Trio closure; WS-2; runtime changes in contract PR.

---

## 18. Final Tokens

```yaml
stage_13B_5_E9_PP_status: PASS
stage_13B_5_E9_PP_plan_accepted: TRUE
stage_13B_5_E9_PP_review_ready: YES_WITH_CONDITIONS
stage_13B_5_E9_PP_source_reference_shape: MATERIAL_ONLY
stage_13B_5_E9_PP_foundation_trio_ready: FALSE
stage_13B_5_E9_PP_ws2_authorized: FALSE
stage_13B_5_E9_PP_y_hb3_status: OPEN_UNTIL_IMPL_COMPLETE
stage_13B_5_E9_PP_next_safe_step: STAGE_13B_5_E9_PV_CONTRACT_OPENAPI_REVIEW
stage_13B_5_E9_PP_decisions: E9-D1,E9-D2,E9-D3,E9-D4,E9-D5,E9-D6,E9-D7,E9-D8,E9-D9,E9-D10
```

Program tokens (unchanged):

```yaml
e9_contract_track_authorized: TRUE
e9_openapi_implementation_authorized: FALSE
persistence_accepted: TRUE
foundation_trio_ready: FALSE
ws2_authorized: FALSE
closure_outcome: CLOSURE_DEFERRED
```

### Invariants (preserved)

```
E9 Planning ≠ E9 Implementation
E9 Implementation ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
Runtime Authority > OpenAPI Mirror
OpenAPI ≠ Primitive Proof
```

---

## Execution Summary

| Deliverable | Value |
| --- | --- |
| Report | `docs/reports/stage_13B_5_E9_PP_contract_openapi_planning_v1.md` |
| Agents used | **7/7** |
| Selected `sourceReference` shape | **MATERIAL_ONLY** (`sourceMaterialType` + `sourceMaterialId`) |
| E9 review readiness | **`YES_WITH_CONDITIONS`** |
| Next safe step | **E9-PV — Contract / OpenAPI Review** |
