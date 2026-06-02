# Stage 13B.5-E9 — Contract / OpenAPI Authorization Gate

## 1. Inputs Reviewed

Execution mode:

- `FOUNDATION_TRIO_CONTRACT_OPENAPI_AUTHORIZATION_GATE_ONLY`
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
| `docs/reports/stage_13B_5_PJR_foundation_trio_persistence_implementation_review_and_acceptance_v1.md` | **Primary input** — persistence accepted; Y-HB2 cleared; E9 next |
| `docs/reports/stage_13B_5_PI_foundation_trio_persistence_implementation_v1.md` | Runtime JSON projection; T-PP |
| `docs/reports/stage_13B_5_PM_foundation_trio_persistence_migration_implementation_authorization_gate_v1.md` | PM-FAIL-7 (OpenAPI in persistence slice) |
| `docs/reports/stage_13B_5_PV_foundation_trio_persistence_review_v1.md` | PP-D10 E9 deferral |
| `docs/reports/stage_13B_5_ZR_ft_x3_foundation_trio_closure_review_v1.md` | Y-HB3; E9 inventory appendix (pre-PJR baseline) |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | E9 NEVER-SUFFICIENT; false-pass catalog |

### Code / contract inspected (read-only)

| Path | Role |
| --- | --- |
| `docs/openapi/space.yaml` | Space contract SSOT fragment |
| `docs/openapi/openapi.bundle.yaml` | Bundled input for Orval |
| `orval.config.ts` | `gen:types` / `gen:sdk` from bundle |
| `packages/types/src/generated/createSpacePostRequest.ts` | Generated create DTO |
| `packages/types/src/generated/spacePostResponse.ts` | Generated response DTO |
| `packages/sdk/src/generated/*` | SDK mirror of types |
| `apps/space-service/src/domain/authorialExpression.ts` | P4 write/read |
| `apps/space-service/src/domain/sourceReferenceBoundary.ts` | P5; `SOURCE_MATERIAL_TYPES` |
| `apps/space-service/src/domain/persistenceRehydration.ts` | API projection from DB |
| `apps/space-service/src/services/spaceService.ts` | `createPost`; `mapPostResponse` |
| `apps/space-service/test/request.test.ts` | Runtime HTTP shape evidence (T-PP, authorial create) |
| `apps/go2asia-pwa-shell/**` (sample) | Clients consume `generated.SpacePostResponse` without authorial fields |

### Review base

| Item | Value |
| --- | --- |
| Post-PJR runtime | Persistence + read rehydration **live** on staging |
| OpenAPI grep (`space.yaml`, bundle) | **0** matches for `authorialExpressionIntent`, `sourceReference` |
| Program blockers (post-PJR) | **Y-HB1, Y-HB3, Y-HB4, Y-HB6** |

### Multi-agent mode

**Activated.** Seven mandated roles; §2 records **per-agent findings** (not a merged summary).

---

## 2. Multi-Agent Execution Review

| # | Agent | Finding IDs | Disposition |
| --- | --- | --- | --- |
| 1 | **AI Program Director / Project Orchestrator** | ORCH-E9-1..4 | PASS_WITH_NOTE |
| 2 | **Slice Strategist** | STRAT-E9-1..4 | PASS |
| 3 | **Runtime Governance Architect** | GOV-E9-1..4 | PASS_WITH_NOTE |
| 4 | **Runtime Validation Agent** | VAL-E9-1..4 | PASS_WITH_NOTE |
| 5 | **Backend Developer (review mode)** | BE-E9-1..4 | PASS_WITH_NOTE |
| 6 | **QA Agent** | QA-E9-1..4 | PASS_WITH_NOTE |
| 7 | **Technical Canon Writer** | CANON-E9-1..4 | PASS_WITH_NOTE |

### 2.1 Per-agent findings (detail)

**1 — AI Program Director / Project Orchestrator**

- **ORCH-E9-1:** User accepted **PJR** (`PERSISTENCE_IMPLEMENTATION_ACCEPTED_WITH_NOTES`); program order **PJR → E9 gate → E9 planning/impl → BV → visibility → E4** remains valid per ZR §12 and PJR §14.
- **ORCH-E9-2:** E9 gate authorizes **contract track opening only** — not OpenAPI editing, not SDK regen, not Trio closure (invariant: E9 Authorized ≠ E9 Implemented).
- **ORCH-E9-3:** **Y-HB3** is the closure blocker this gate addresses; **Y-HB1, Y-HB4, Y-HB6** stay parallel — E9 PASS does not collapse program gates.
- **ORCH-E9-4:** Post-PJR, **NR-N2 / TR-N2** are the primary carry-forwards E9 must close at **contract tier**; persistence runtime is ahead of published contract.

**2 — Slice Strategist**

- **STRAT-E9-1:** Bounded E9-impl slice (future) = **`docs/openapi/space.yaml`** (+ bundle) + **`pnpm gen:types` / `gen:sdk`** + contract validation scripts — **OUT:** `space-service` domain, DB, UI behavior, WS-2.
- **STRAT-E9-2:** PM-FAIL-7 from persistence slice is **honored** — no OpenAPI in PI/PM/PJR diffs; E9 is the **first authorized** contract edit track.
- **STRAT-E9-3:** Do not bundle BV (Y-HB4), visibility policy (Y-HB6), or E4 surface-role proof (Y-HB1) into E9 implementation PR.
- **STRAT-E9-4:** Recommend branch family: `feat/stage-13b5-e9-space-contract` — single PR for OpenAPI + generated artifacts + contract tests only.

**3 — Runtime Governance Architect**

- **GOV-E9-1:** **Post-PJR drift:** runtime exposes `authorialExpressionIntent` and `sourceReference` on create/read/feed; OpenAPI has **neither** — Y-HB3 driver (supersedes stale ZR §7.2 “not persisted”).
- **GOV-E9-2:** C2 **E9 NEVER-SUFFICIENT** — contract inventory/alignment cannot establish P4/P5 or Trio readiness; OpenAPI must not become proof authority (Z-F4).
- **GOV-E9-3:** **`repostTarget*` documented, `sourceReference` absent** — collapse vocabulary risk (BV-R1/R3); E9 must add fields **and** normative descriptions separating P1/P6 vs P5.
- **GOV-E9-4:** Response `sourceReference` runtime includes `classifier` + `hopCount: 1` via `buildSourceReferenceResponseStaging`; PP §6.3 planned material-only — **projection lock required** before E9-impl authorization.

**4 — Runtime Validation Agent**

- **VAL-E9-1:** Runtime write accepts `authorialExpressionIntent` + nested `sourceReference` on `POST /v1/space/posts` (`spaceService.ts`, `request.test.ts` authorial tests).
- **VAL-E9-2:** Runtime read rehydrates from DB on GET detail and `home_feed` (T-PP-1..3) — contract must document **read** parity, not create-only staging (ZR §7.2 obsolete).
- **VAL-E9-3:** E9 evidence class remains **inventory / negative-only** per C2 — E9-impl JR must cite **runtime tests + contract diff**, never OpenAPI alone as E3/E5 FILLED.
- **VAL-E9-4:** Future E9-impl PASS should require **contract tests** (repo `openapi:check`, content contract tests in CI if applicable) green after regen — not runtime suite substitution.

**5 — Backend Developer (review mode)**

- **BE-E9-1:** Write path: `parseAuthorialExpressionIntentFromBody`, `parseSourceReferenceFromBody` — request fields exist in service; absent from `CreateSpacePostRequest` schema.
- **BE-E9-2:** Read path: `rehydrateAuthorialFieldsFromRow` spreads into `mapPostResponse` — response fields exist in HTTP JSON; absent from `SpacePostResponse` schema.
- **BE-E9-3:** `SOURCE_MATERIAL_TYPES` (7 values) is runtime enum; OpenAPI has `SpaceRepostTargetType` (7 overlapping values) — E9 needs **`SpaceSourceMaterialType`** (or documented alias policy), not reuse of `repostTarget` enums for P5.
- **BE-E9-4:** Proof classifiers (`authorialIndependence`, `savePublishBoundary`, full classifier blobs) are **event payloads**, not stable public post DTO — keep **OUT** of OpenAPI per FT-3x doctrine.

**6 — QA Agent**

- **QA-E9-1:** Runtime tests prove authorial HTTP behavior without OpenAPI (`176/176` space-service) — clients using generated types are **blind** to authorial fields (PWA shell uses `SpacePostResponse` without them).
- **QA-E9-2:** Future E9-impl should add **contract-level** checks: bundled spec includes new fields; Orval regen diff reviewed; optional snapshot test on example authorial POST/GET payloads.
- **QA-E9-3:** **Breaking-change posture:** adding optional request/response fields is **backward compatible** for JSON clients; codegen clients gain optional properties — document in E9-impl JR.
- **QA-E9-4:** Do not treat `openapi:check` green alone as E4 FILLED — surface-role proof remains Y-HB1.

**7 — Technical Canon Writer**

- **CANON-E9-1:** Tokens: `E9 Authorized` ≠ `E9 Implemented` ≠ `foundation_trio_ready` ≠ `ws2_authorized` — enforced in §12.
- **CANON-E9-2:** Clearing **Y-HB3** requires **E9 implementation + JR**, not this gate alone; this gate clears **authorization to plan/implement** contract alignment.
- **CANON-E9-3:** NR-N2 / TR-N2 narrow at contract tier when OpenAPI+SDK ship; **PR-N2, RR-N1, BV, visibility** remain informational blockers.
- **CANON-E9-4:** Next after E9 gate: **E9-PP (Planning)** or **E9-PV (Review)** then **E9-PI (OpenAPI+SDK impl)** — not Closure Acceptance, not WS-2.

### 2.2 Disagreements between agents

| Topic | Agent A | Agent B | Resolution |
| --- | --- | --- | --- |
| Authorization strictness | Orchestrator: open track now | Governance: shape lock first | **YES_WITH_CONDITIONS** — E9-COND-1..8 before E9-PI |
| Response `sourceReference` shape | PP §6.3: type+id only | Runtime: +classifier+hopCount | **E9-COND-4** — pick normative public shape in E9-PP |
| Y-HB3 clearance timing | Canon: open gate only | Validation: HB3 until impl | **ACCEPTED** — gate YES; Y-HB3 **OPEN_UNTIL_IMPL** |
| Classifier in OpenAPI | Backend: OUT | QA: document runtime extras | **OUT** for public schema; optional `x-runtime-notes` in planning only |

**Blocking disagreement:** None.

---

## 3. Y-HB3 Review

### What Y-HB3 blocks

| Layer | Blocker statement |
| --- | --- |
| **Closure** | Contract-complete Foundation Trio closure cannot proceed while public API vocabulary omits persisted P4/P5 fields (ZR §5.1 **Y-HB3**). |
| **NR-N2** | `authorialExpressionIntent` not in OpenAPI/SDK — clients cannot type authorial creates or reads. |
| **TR-N2** | `sourceReference` not in OpenAPI/SDK — P5 one-hop context invisible to contract consumers. |
| **E9 class (C2)** | E9 inventory was **OPEN** at ZR; post-PJR runtime **advanced** without contract update — drift widened. |

### What Y-HB3 is **not**

| Misread | Correction |
| --- | --- |
| “Runtime lacks authorial fields” | **False post-PJR** — service emits fields; contract does not. |
| “OpenAPI proves P4/P5” | **Forbidden** (C2 E9 NEVER-SUFFICIENT, Z-F4). |
| “E9 fixes persistence” | **False** — Y-HB2 cleared by PJR; E9 is contract mirror only. |
| “E9 clears Trio ready” | **Forbidden** — Y-HB1, Y-HB4, Y-HB6 remain. |

### Y-HB3 decomposition (post-PJR)

| Gap ID | Description | Blocks |
| --- | --- | --- |
| **Y-HB3-1** | Create request missing `authorialExpressionIntent` | NR-N2; typed client writes |
| **Y-HB3-2** | Create request missing `sourceReference` object | TR-N2; typed client writes |
| **Y-HB3-3** | Response/feed `SpacePostResponse` missing both fields | NR-N2, TR-N2; read/SDK |
| **Y-HB3-4** | No `SpaceSourceReference` / material type schema | SDK surface, validators |
| **Y-HB3-5** | Generated `packages/types` + `packages/sdk` drift | Monorepo consumers, PWA shell |
| **Y-HB3-6** | Semantic doc gap: `repostTarget*` vs P5 | BV-R3; collapse education |

**Y-HB3 status at E9 gate:** **OPEN** — authorization to close via **future E9 implementation slice**.

---

## 4. Runtime vs Contract Drift Review

### 4.1 Drift matrix (Foundation Trio API fields)

| Concern | Runtime write (`POST`) | Runtime read (`GET` / feeds / `201`) | OpenAPI `CreateSpacePostRequest` | OpenAPI `SpacePostResponse` | Drift |
| --- | --- | --- | --- | --- | --- |
| **P4 — `authorialExpressionIntent`** | Accepted on `postType=post`; rejected on repost | Present as `true` when DB flag true; **omitted when false** (PP-D9, T-PP-1) | **Absent** | **Absent** | **YES** |
| **P5 — `sourceReference`** | Nested `{ sourceMaterialType, sourceMaterialId }` on authorial create | Rehydrated from DB when pair set (T-PP-2, T-PP-3); shape includes `classifier`, `hopCount: 1` in service | **Absent** | **Absent** | **YES** |
| **P4 persisted** | `authorial_expression_intent` column | Read via `rehydrateAuthorialFieldsFromRow` | N/A (DB not in OpenAPI) | N/A | **API projection drift only** |
| **P5 persisted** | `source_material_type/id` columns | Same rehydration path | N/A | N/A | **API projection drift only** |
| **`repostTarget*`** | On repost writes | `repost` object on response | **Present** | **Present** (`repost`) | **Aligned** (different primitive) |

### 4.2 Runtime primitives intentionally **not** in contract

| Primitive | Runtime location | OpenAPI | Notes |
| --- | --- | --- | --- |
| `authorialIndependence` classifier | Events; domain only | Missing | **Correct omission** for public DTO |
| `savePublishBoundary` classifier | Events; domain only | Missing | **Correct omission** |
| `authorialTextRole` / write intents | Events | Missing | **Correct omission** |
| Full proof JSON blobs | Forbidden in DB (PM-FAIL-2) | Missing | **Correct omission** |

### 4.3 Stale inventory superseded

ZR §7.2 stated `sourceReference` — “write-bounded staging on create only”. **Post-PJR:** read rehydration from DB on GET/feed (`persistenceRehydration.ts`, T-PP-1..3). E9 inventory must use **post-PJR runtime** as source of truth.

**Drift review verdict:** **MATERIAL DRIFT** on P4/P5 public fields — expected after PP-D10 deferral; now authorized to plan closure.

---

## 5. E9 Inventory

**Scope:** inventory only — no file changes in this stage.

### 5.1 Missing request fields (`CreateSpacePostRequest`)

| Field | Runtime behavior | Proposed contract (planning) |
| --- | --- | --- |
| `authorialExpressionIntent` | Optional `boolean`; only when `postType=post` | `boolean`, default false, optional |
| `sourceReference` | Optional object; requires type+id; authorial post only | New schema `SpaceSourceReferenceInput` |

**Not in runtime / must stay out of create schema:** `saveIntent`, `publishIntent`, `authorialIndependence`, proof classifiers.

### 5.2 Missing response fields (`SpacePostResponse` and nested in `SpaceFeedItem`)

| Field | Runtime behavior | Proposed contract |
| --- | --- | --- |
| `authorialExpressionIntent` | `true` when persisted; omitted when false | `boolean`, optional (document omit-when-false) |
| `sourceReference` | When DB pair set | `SpaceSourceReference`, optional, nullable |

**Applies to:** `GET /v1/space/posts/{id}`, `POST` 201, `PATCH` 200, all feed items embedding `SpacePostResponse`.

### 5.3 Missing schema definitions (components)

| Schema | Purpose |
| --- | --- |
| `SpaceSourceMaterialType` | Enum aligned with `SOURCE_MATERIAL_TYPES`: `space_post`, `blog_post`, `place`, `event`, `partner`, `listing`, `quest` |
| `SpaceSourceReference` (response) | Material + optional governance fields per E9-COND-4 |
| `SpaceSourceReferenceInput` (request) | `{ sourceMaterialType, sourceMaterialId }` required together |

### 5.4 Missing SDK / types surfaces

| Artifact | Path | Gap |
| --- | --- | --- |
| `CreateSpacePostRequest` | `packages/types/src/generated/createSpacePostRequest.ts` | No authorial/SR fields |
| `SpacePostResponse` | `packages/types/src/generated/spacePostResponse.ts` | No authorial/SR fields |
| SDK re-exports | `packages/sdk/src/generated/*` | Mirror of above |
| PWA / shell | `apps/go2asia-pwa-shell` | Uses `generated.SpacePostResponse` — no typed authorial access |

### 5.5 Toolchain surfaces (future E9-PI)

| Command / script | Role |
| --- | --- |
| `pnpm openapi:bundle` | Regenerate `docs/openapi/openapi.bundle.yaml` |
| `pnpm openapi:check` | Contract validation |
| `pnpm gen:types` | Orval → `packages/types` |
| `pnpm gen:sdk` | Orval → `packages/sdk` |

### 5.6 OpenAPI documentation gaps (non-field)

| Topic | Current | Needed in E9-impl |
| --- | --- | --- |
| P5 vs `repostTarget*` | `repostTarget` documented as repost binding | Explicit: **not** Source Reference |
| Legacy rows | N/A | Note: backfilled rows omit authorial fields until new authorial creates |
| Optional SR | N/A | 0..1 on authorial posts only |

**Inventory status:** **COMPLETE** for gate authorization.

---

## 6. Contract Risks Review

| Risk ID | Risk | Severity | Mitigation (future E9-impl) |
| --- | --- | --- | --- |
| **CR-1** | Runtime ≠ contract — clients cannot use codegen for authorial features | **HIGH** | E9-PI + regen SDK/types |
| **CR-2** | SDK drift — PWA uses stale `SpacePostResponse` | **HIGH** | `gen:types` + consumer PR (separate UI gate if needed) |
| **CR-3** | False proof via OpenAPI (Z-F4, C2 R5) | **CRITICAL** | E9-FAIL-1; JR non-claims |
| **CR-4** | P5 ↔ `repostTarget*` collapse in client mental model | **HIGH** | Descriptions + separate enums (CR-3) |
| **CR-5** | Gateway/validator strips undocumented request fields | **MEDIUM** | Publish contract before enforcing gateway schemas |
| **CR-6** | Breaking change fear blocks field addition | **LOW** | Optional fields only; document compat |
| **CR-7** | Locking `classifier`/`hopCount` in OpenAPI locks staging semantics | **MEDIUM** | E9-COND-4: prefer material-only public schema |
| **CR-8** | E9 scope creep (runtime/BV/visibility in same PR) | **HIGH** | E9-FAIL-6; STRAT-E9-3 |
| **CR-9** | OpenAPI treated as Trio closure or WS-2 authorization | **CRITICAL** | E9-FAIL-2, E9-FAIL-3 |
| **CR-10** | Contract added but runtime changes “to match doc” backwards | **MEDIUM** | Runtime-first rule: spec follows `mapPostResponse` |

### 6.1 E9 blockers (gate-specific)

| ID | Blocker | Cleared by |
| --- | --- | --- |
| **EB-1** | Y-HB3 open | E9-PI + E9-JR |
| **EB-2** | NR-N2 / TR-N2 contract gap | E9-PI |
| **EB-3** | Normative `sourceReference` shape unset (GOV-E9-4) | E9-PP / E9-COND-4 |
| **EB-4** | SDK/types not regenerated | E9-PI |
| **EB-5** | E9 planning/review not yet run | **This gate** → next stages |

**E9 gate opening blockers:** **NONE** (PJR mandates E9 as next safe step).

---

## 7. E9 Scope Definition (future implementation)

### 7.1 IN scope (E9-PI — when separately authorized)

| Item | Description |
| --- | --- |
| OpenAPI | Update `docs/openapi/space.yaml` — request/response fields + new schemas + descriptions |
| Bundle | `pnpm openapi:bundle` |
| Types/SDK | `pnpm gen:types`, `pnpm gen:sdk` |
| Validation | `pnpm openapi:check`; contract/content tests if in CI path |
| Docs | E9 implementation + JR reports only |

### 7.2 OUT scope (forbidden in E9-PI)

| Item | Reason |
| --- | --- |
| `space-service` runtime logic changes | Runtime already correct post-PJR |
| DB / migrations | PM-FAIL / persistence slice closed |
| Proof classifier public schemas | PM-FAIL-2 analogue; C2 |
| WS-2 / repost elimination | PM-FAIL-6 |
| Visibility policy (Y-HB6) | Separate gate |
| BV resolution (Y-HB4) | Separate gate |
| Foundation Trio closure | ZR deferral |
| `foundation_trio_ready` / `ws2_authorized` lift | Program invariant |
| UI redesign | Separate consumer adoption |

### 7.3 E9-PP / E9-PV (authorized by this gate)

| Stage | Purpose |
| --- | --- |
| **E9-PP** | Lock projection shape (E9-COND-4), enum list, compatibility notes |
| **E9-PV** | Review inventory + risks before E9-PM / E9-PI |
| **E9-PM** | Implementation authorization (optional pattern from persistence track) |
| **E9-PI** | OpenAPI + SDK only |
| **E9-PJR** | Contract JR — may clear Y-HB3; not Trio ready |

---

## 8. PASS Criteria (future E9 implementation JR)

| ID | Criterion |
| --- | --- |
| **E9-PASS-1** | `CreateSpacePostRequest` documents `authorialExpressionIntent` + `sourceReference` consistent with runtime write rejects/accepts |
| **E9-PASS-2** | `SpacePostResponse` documents both fields consistent with `mapPostResponse` / `rehydrateAuthorialFieldsFromRow` |
| **E9-PASS-3** | New component schemas for source material type + source reference (request/response) |
| **E9-PASS-4** | `pnpm openapi:bundle` + `openapi:check` PASS |
| **E9-PASS-5** | `pnpm gen:types` + `gen:sdk` executed; generated files include new fields |
| **E9-PASS-6** | OpenAPI descriptions state `repostTarget*` ≠ `sourceReference` (anti-collapse) |
| **E9-PASS-7** | PP-D9 documented: `authorialExpressionIntent` optional, omitted when false on response |
| **E9-PASS-8** | No proof classifier blobs added to public post schemas |
| **E9-PASS-9** | JR explicitly states: **contract alignment only**; cites runtime tests as authority |
| **E9-PASS-10** | `foundation_trio_ready: FALSE`, `ws2_authorized: FALSE` in JR tokens |

---

## 9. FAIL Criteria (future E9 implementation JR)

| ID | FAIL condition |
| --- | --- |
| **E9-FAIL-1** | OpenAPI or SDK cited as **runtime proof** or primitive establishment (C2 / Z-F4) |
| **E9-FAIL-2** | E9 implementation JR claims **Foundation Trio closed** or sets `foundation_trio_ready: TRUE` |
| **E9-FAIL-3** | E9 implementation JR sets `ws2_authorized: TRUE` or authorizes WS-2 |
| **E9-FAIL-4** | Public schemas add proof/classifier JSON blobs (`authorialIndependence`, etc.) |
| **E9-FAIL-5** | `sourceReference` documented as alias of `repostTarget*` or shared column semantics |
| **E9-FAIL-6** | Same PR/slice changes runtime, DB, visibility, BV, or WS-2 |
| **E9-FAIL-7** | Contract fields contradict runtime (required vs omitted, wrong enums) |
| **E9-FAIL-8** | SDK/types not regenerated after OpenAPI change |
| **E9-FAIL-9** | Breaking required-field changes on existing clients without migration plan |
| **E9-FAIL-10** | Y-HB3 marked CLEARED at **this gate** without E9-PI + E9-JR |

Any **E9-FAIL** triggered → implementation JR must **REJECT** (analogous to PM-FAIL).

---

## 10. Authorization Decision

### Can program open Contract / OpenAPI track (planning + review)?

**`YES_WITH_CONDITIONS`**

| Question | Answer |
| --- | --- |
| Open **E9 Planning / Review**? | **YES_WITH_CONDITIONS** |
| Open **E9 OpenAPI implementation** in this stage? | **NO** — separate E9-PM / E9-PI after planning |
| Clear **Y-HB3** in this stage? | **NO** — remains **OPEN_UNTIL_IMPL** |
| Clear **Y-HB1, Y-HB4, Y-HB6**? | **NO** |
| Set `foundation_trio_ready: TRUE`? | **NO** |
| Authorize WS-2? | **NO** |

### 10.1 E9 gate conditions (E9-COND-1..8)

| ID | Condition |
| --- | --- |
| E9-COND-1 | Runtime-first: OpenAPI mirrors **post-PJR** `mapPostResponse` JSON, not pre-persistence ZR appendix |
| E9-COND-2 | E9-PP locks public `sourceReference` shape (material-only vs classifier-enriched) |
| E9-COND-3 | Separate `SpaceSourceMaterialType` enum — do not overload `SpaceRepostTargetType` for P5 |
| E9-COND-4 | Anti-collapse descriptions for `repostTarget*` vs `sourceReference` |
| E9-COND-5 | E9-PI scope = OpenAPI + bundle + gen:types/sdk + contract checks only |
| E9-COND-6 | E9-JR required before Y-HB3 token lift |
| E9-COND-7 | JR non-claims: `foundation_trio_ready: FALSE`, `ws2_authorized: FALSE` |
| E9-COND-8 | No Trio closure or WS-2 bundling |

---

## 11. Next Safe Step

1. **`Stage 13B.5-E9-PP — Contract / OpenAPI Planning`** — resolve E9-COND-2/4; finalize field inventory §5.
2. **`Stage 13B.5-E9-PV — Contract Review`** (optional but recommended) — multi-agent review of plan.
3. **`Stage 13B.5-E9-PM — Contract Implementation Authorization`** — MUST/FAIL lists for OpenAPI slice.
4. **`Stage 13B.5-E9-PI — OpenAPI + SDK Implementation`** — execute §7.1 only.
5. **`Stage 13B.5-E9-PJR — Contract Implementation Review`** — may set `y_hb3_status: CLEARED` if E9-PASS met.

**Parallel program gates (unchanged):** BV (Y-HB4), visibility (Y-HB6), E4 surface role (Y-HB1) — after or in program order with E9, not inside E9-PI.

**Not next:** Foundation Trio Closure Acceptance; WS-2 Authorization.

---

## 12. Final Tokens

```yaml
stage_13B_5_E9_status: PASS
stage_13B_5_E9_authorization_decision: YES_WITH_CONDITIONS
stage_13B_5_E9_authorized: TRUE
stage_13B_5_E9_contract_track_open: TRUE
stage_13B_5_E9_openapi_implementation_authorized: FALSE
stage_13B_5_E9_y_hb3_status: OPEN_UNTIL_IMPL_COMPLETE
stage_13B_5_E9_foundation_trio_ready: FALSE
stage_13B_5_E9_ws2_authorized: FALSE
stage_13B_5_E9_closure_blockers_active: Y-HB1,Y-HB3,Y-HB4,Y-HB6
stage_13B_5_E9_next_safe_step: STAGE_13B_5_E9_PP_CONTRACT_OPENAPI_PLANNING
```

Program tokens (post-PJR, updated for E9 gate):

```yaml
persistence_accepted: TRUE
y_hb2_status: CLEARED
foundation_trio_ready: FALSE
ws2_authorized: FALSE
closure_outcome: CLOSURE_DEFERRED
e9_contract_track_authorized: TRUE
```

### Invariants (preserved)

```
E9 Authorized ≠ E9 Implemented
E9 Implemented ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
Runtime Authority > OpenAPI Mirror
OpenAPI Presence ≠ Primitive Proof (C2 E9)
```

---

## Execution Summary

| Deliverable | Value |
| --- | --- |
| Report | `docs/reports/stage_13B_5_E9_contract_openapi_authorization_gate_v1.md` |
| Agents used | **7/7** |
| Authorization decision | **`YES_WITH_CONDITIONS`** |
| E9 blockers (active) | Y-HB3; NR-N2; TR-N2; SDK drift; shape lock (EB-1..4) |
| E9 gate blockers | **NONE** |
| Next safe step | **E9-PP — Contract / OpenAPI Planning** |
