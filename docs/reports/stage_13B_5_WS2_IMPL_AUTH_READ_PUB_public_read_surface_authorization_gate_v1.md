# Stage 13B.5-WS2-IMPL-AUTH-READ-PUB — Public Read Surface Implementation Authorization Gate

**Document class:** `WS2_IMPL_READ_PUB_SLICE_AUTHORIZATION_GATE_ONLY`  
**Not:** READ-PUB implementation · `WS2_AUTHORIZED` · global `implementation_authorized` · READ-GRP · ACTIVITY · COPY · WS2-BV-EXEC · runtime / tests / OpenAPI / SDK / DB / literal changes

**Authority inputs:**

| Document | Verdict / role |
| --- | --- |
| `stage_13B_5_WS2_PLANNING_ws2_authorization_planning_v1.md` | `WS2_AUTHORIZATION_PLANNING_COMPLETE` |
| `stage_13B_5_WS2_POLICY_propagation_elimination_policy_gate_v1.md` | `WS2_PROPAGATION_POLICY_ACCEPTED` |
| `stage_13B_5_WS2_IMPL_AUTH_WRITE_...authorization_gate_v1.md` | `WS2_IMPL_WRITE_AUTHORIZED` |
| `stage_13B_5_WS2_IMPL_WRITE_...implementation_v1.md` | `WS2_IMPL_WRITE_IMPLEMENTATION_COMPLETE` |
| `stage_13B_5_WS2_IMPL_WRITE_REVIEW_v1.md` | `WS2_IMPL_WRITE_REVIEW_ACCEPTED` |

**Authority baseline:** `foundation_trio_ready: TRUE`; `ws2_authorized: FALSE`; `ws2_impl_write_implementation_complete: TRUE`; `ws2_impl_write_review_accepted: TRUE`; `ws_2_write_propagation_blocked: TRUE`

**Multi-agent mode:** `docs/ai/roles/` — §11 records **seven separate Agent Findings** (no merged summary).

**Pre-flight confirmation:** This stage is a **per-slice authorization gate** for **`WS2-IMPL-READ-PUB`** only. It has **no authority** to grant `WS2_AUTHORIZED`, global `implementation_authorized`, READ-GRP, ACTIVITY, COPY, or perform implementation.

---

## 1. Executive Summary

**Main question:** May per-slice implementation authorization be issued for **`WS2-IMPL-READ-PUB`** (Public Read Surface Alignment)?

**Answer:** **YES.**

**Gate verdict:** **`WS2_IMPL_READ_PUB_AUTHORIZED`**

**Meaning:** The next stage may align **public read surfaces** so propagation repost is **not target public expression**, while **legacy public repost** remains **visible + classified** per WS-5 and WS2-PD-3/PD-5. **Write boundary is already closed** — READ-PUB addresses **read-path doctrine debt** (13B.3-D PR_READ_*), not new row creation.

```yaml
stage_13B_5_WS2_IMPL_AUTH_READ_PUB_next_safe_step: STAGE_13B_5_WS2_IMPL_READ_PUB
```

---

## 2. Prerequisite Review (Investigation №1)

| Prerequisite | Required | Evidence | Result |
| --- | --- | --- | --- |
| **Foundation Trio Ready** | `TRUE` | Ready v3 + APPLY | **PASS** |
| **WS2-POLICY** | `WS2_PROPAGATION_POLICY_ACCEPTED` | POLICY gate; PD-3 visible+classified | **PASS** |
| **WS2-IMPL-WRITE complete** | `TRUE` | Impl report + `d8fc0b8` | **PASS** |
| **WRITE review accepted** | `TRUE` | `WS2_IMPL_WRITE_REVIEW_ACCEPTED` | **PASS** |
| **Legacy policy accepted** | WS2-PD-5 + WS-5 | No delete/convert; historical artifact | **PASS** |
| **No conflicting canon** | Frozen 13B.2/13B.3-D; FT-X1/FT-X2 | ZR lock; WRITE ≠ READ | **PASS** |
| **FT-X2 §6.4 E3/E8** | Partial at write; READ open | Expected sequencing | **PARTIAL** (non-blocking) |

**Aggregate:** **PASS** — no **FAIL** blocker for READ-PUB auth gate.

**PARTIAL note:** Full `WS2_AUTHORIZATION_EVIDENCE` still requires READ-GRP + BV + auth gate — **not** READ-PUB scope.

---

## 3. READ-PUB Scope (Investigation №2)

### 3.1 IN scope — public read surfaces (space-service)

| Surface ID | Route / handler | Current behavior (read-only audit) | READ-PUB target outcome |
| --- | --- | --- | --- |
| **home_feed** | `GET /v1/space/feed/home` → `getHomeFeed` | SQL returns public + group + own rows; `reason: 'repost'` for all reposts | Propagation repost **not target expression**; legacy **visible + classified** |
| **profile_feed** | `GET /v1/space/feed/profile/:userId` → `getProfileFeed` | Profile list includes repost rows | Same; owner-visible legacy OK |
| **publications** | `GET /v1/space/feed/publications/:userId` → `getPublicationsFeed` | Uses profile rows + `publications` surface (FE-P4-SURF) | Legacy repost **not authorial publication**; authorial + SR preserved |
| **highlight** | `GET /v1/space/highlight/:postId` → `getHighlightPostRead` | Post-shaped read via `highlight` surface | Legacy carve-out only; not post-transition propagation destination |
| **highlight_reference** | `GET /v1/space/highlight/reference` | Reference artifact JSON | Preserve legacy reference proof; no propagation canon |
| **post_detail** (public-visible propagation-shaped) | `GET /v1/space/posts/:id` → `getPost` | `mapPostResponse` + read guards | Legacy distinguished; regression propagation not target canon |

**Feed builder:** `buildFeedResponse` — **`reason`** field must align with WS-2 (no target `repost` social category for post-transition propagation).

### 3.2 OUT of scope (explicit non-scope)

| Area | Owner |
| --- | --- |
| **group_feed** (`listGroupFeedPosts`, `getGroupFeed`) | **WS2-IMPL-READ-GRP** / WS-4 |
| **activity** (`listActivityFeedRows`, projections) | **WS2-IMPL-ACTIVITY** / WS-6 |
| **COPY / PWA** (`SpaceFeedSurface`, filters, labels) | **WS-7** / PWA carve-out |
| **search / discovery ranking** | **DEFERRED** (POLICY V4) |
| **OpenAPI / SDK** | Default **no** unless DTO metadata required |
| **DB migrations / delete / hide** | **Forbidden** |
| **Write paths** | **Closed** (WRITE slice) |

### 3.3 Slice isolation

**READ-PUB is sufficiently isolated:** changes confined to read assembly (`getHomeFeed`, `getProfileFeed`, `getPublicationsFeed`, `getHighlightPostRead`, `buildFeedResponse`, optional `ws2PropagationReadPolicy.ts`, optional narrow SQL only if service-layer filter insufficient).

---

## 4. Legacy Handling Policy Mapping (Investigation №3)

Source: WS2-PD-3, WS2-PD-5; `legacyDistinction.ts`; `perSurfaceLegacyMatrix.ts` (FT-5D).

| Legacy artifact | WS-5 / distinction | READ-PUB policy application |
| --- | --- | --- |
| **Legacy public repost** | `legacy_public_carve_out` / `L_PUBLIC_REPOST` | **Visible** on allowed surfaces; **not** authorial; **not** target expression |
| **Legacy group repost** (visible on public profile paths) | `legacy_group_carve_out` | Classified; **not** group target content (GRP slice owns group feed) |
| **Legacy chains** | `legacy_chain_carve_out` | **Frozen** — no new chains; read shows carve-out only |
| **Regression propagation** (`isPostAlignmentRegression` / post-transition) | `regression_*_propagation` | **Exclude from target public feed streams** (not hidden legacy) |
| **Private retention** | `target_private_repost` | **Out of public feeds** by visibility SQL — unchanged |

**Forbidden:** hide/delete/migrate (FP-R1, FP-R2); count legacy as authorial (FP-R3).

**WS-5 consumption:** Reuse `classifyRepostArtifactDistinction`, `applyAuthorialExpressionReadGuards` → `applyFt5SurfaceLegacyGuards` — **do not** redefine taxonomy in READ-PUB.

---

## 5. Target Files Review (Investigation №4)

Read-only audit on `feat/stage-13b5-ws2-impl-write` @ `d8fc0b8`.

### 5.1 Primary (expected)

| Path | Expected change class |
| --- | --- |
| `apps/space-service/src/services/spaceService.ts` | `buildFeedResponse`, `getHomeFeed`, `getProfileFeed`, `getPublicationsFeed`, `getHighlightPostRead`; optional row filter before feed build |
| `apps/space-service/src/domain/ws2PropagationReadPolicy.ts` | **NEW (recommended)** — `shouldIncludeInPublicTargetFeed`, `resolveFeedItemReason`, distinction helpers |
| `apps/space-service/src/domain/legacyDistinction.ts` | **Read-only consume** — unlikely edit unless shared helper extraction |
| `apps/space-service/src/domain/perSurfaceLegacyMatrix.ts` | **Read-only consume** via existing guards |

### 5.2 Secondary (optional)

| Path | When |
| --- | --- |
| `apps/space-service/src/db/queries/space.ts` | **Only if** service-layer filter cannot meet RB-1 without false-pass; document in impl report |
| `apps/space-service/src/routes/feed.ts` | **No logic** expected — delegates to service |

### 5.3 Forbidden touch list

| Path | Reason |
| --- | --- |
| `ws2PropagationWritePolicy.ts` | WRITE slice — **no regression** |
| `listGroupFeedPosts` / `getGroupFeed` | READ-GRP |
| Activity projection writers/readers | ACTIVITY |
| `docs/openapi/space.yaml`, `packages/**` | Default excluded |
| PWA | CO-READ-1 |

---

## 6. Required Behavior (Investigation №5)

| ID | Required behavior | Policy / canon |
| --- | --- | --- |
| **RB-1** | **Post-transition propagation repost** (`regression_*_propagation`) **excluded** from **target** home/public feed item streams | WS2-PD-3 V1; 13B.3-D PR_READ_PUBLIC |
| **RB-2** | **Legacy public repost** may remain in feeds **only** as **legacy carve-out** (visible + classified), not as target authorial/social expression | WS2-PD-3 V2; WS-5 |
| **RB-3** | **Publications** surface: authorial posts + SR display **unchanged**; legacy repost **not** authorial publication proof | FE-P4-SURF / FT-5D F12 |
| **RB-4** | **Profile feed** (public viewer): same classification rules as publications where applicable | WS2-PD-5 |
| **RB-5** | **Highlight** read: authorial rehydration preserved; legacy public repost **non-authorial**; propagation **not** valid post-transition highlight destination | POLICY V5; SURF-HL-* |
| **RB-6** | **Feed `reason` field** must not label legacy/propagation repost as target **`author_post`** or canonical social **`repost`** category | 13B.3-D PR_PUBLIC_CATEGORY |
| **RB-7** | **Authorial** `postType: post` rows with optional SR **unchanged** on all in-scope surfaces | WS-3 |
| **RB-8** | **No** row DELETE/UPDATE migration; **no** visibility rewrite | WB-9 / WS2-PD-5 |
| **RB-9** | Proof literals **`isWs2Authorized`**, **`isFoundationTrioReady`** remain **false** | WB-10 |
| **RB-10** | **No** claim that WS-2 or group/activity/copy slices complete | Boundary |

---

## 7. Required Tests (Investigation №6)

**Primary file:** `apps/space-service/test/request.test.ts` (extend FE-P4-SURF block + new `T-READ-PUB-*`)

**Secondary:** `apps/space-service/test/ws2PropagationReadPolicy.test.ts` (NEW domain tests)

| Test ID | Description | Expected |
| --- | --- | --- |
| **T-READ-PUB-1** | Home feed: legacy public repost row → **included** with legacy classification / non-authorial reason | 200; not `reason: author_post` for legacy carve-out |
| **T-READ-PUB-2** | Home feed: regression propagation repost fixture → **excluded** from feed items | Not in `items[]` |
| **T-READ-PUB-3** | Publications: authorial post + SR → **present** (regress SURF-PUB-1) | 200; authorial fields |
| **T-READ-PUB-4** | Publications: legacy public repost → **present** as repost shape but **not** authorial establishment proof | Extend SURF-PUB-2 semantics |
| **T-READ-PUB-5** | Highlight authorial (SURF-HL-1) → **unchanged** | 200 |
| **T-READ-PUB-6** | Highlight legacy repost (SURF-HL-3) → **non-authorial** | 200; guards pass |
| **T-READ-PUB-7** | Cannot create new public repost then see as target feed item | Write reject + feed exclusion (defense in depth) |
| **T-READ-PUB-8** | Profile feed public view: legacy vs authorial distinction | 200 |

**Regression suites (mandatory at impl acceptance):**

- Full `pnpm --filter @go2asia/space-service test` (baseline **210/210**)
- `establishmentTier.contract.test.ts` (**24/24**)
- `perSurfaceLegacyMatrix.test.ts` — no WS-5 regression

---

## 8. False Pass Catalog (Investigation №7)

| ID | Pattern | Guard in READ-PUB slice |
| --- | --- | --- |
| **FP-R1** | Hide legacy rows from feeds | RB-2 requires **visible** legacy; tests T-READ-PUB-1/4 |
| **FP-R2** | Delete legacy | RB-8 forbidden |
| **FP-R3** | Count legacy as authorial / `author_post` reason | RB-3, RB-6; FT-5D F12 |
| **FP-R4** | Remove rows instead of classify | Use distinction + reason, not SQL DELETE |
| **FP-R5** | Claim READ complete while group feed unchanged | RB-10; gate scope excludes `getGroupFeed` |
| **FP-R6** | Claim WS-2 complete | Forbidden verdict tokens |
| **FP-R7** | UI-only filter in PWA without service alignment | Service-layer RB-1 required (CO-READ-1 notes PWA) |
| **FP-R8** | OpenAPI-only DTO rename | Runtime feed assembly must change |
| **FP-R9** | SQL hide `WHERE post_type <> 'repost'` (drops legacy) | **Reject** — use distinction filter |

---

## 9. Gate Decision (Investigation №8)

**Decision:** **`WS2_IMPL_READ_PUB_AUTHORIZED`**

**Rationale:** Prerequisites satisfied; WRITE + review accepted; policy mandates visible classified legacy; FT-5D/WS-5 infrastructure exists; scope isolatable; tests definable; no canon conflict.

**Not deferred because:** No missing policy decision blocks READ-PUB (highlight V5 assigned to this slice); group/activity explicitly excluded.

### 9.1 If Authorized — implementation package

| Field | Value |
| --- | --- |
| **Next stage** | **`Stage 13B.5-WS2-IMPL-READ-PUB`** — Public Read Surface Alignment Implementation |
| **Per-slice token** | `ws2_impl_read_pub_implementation_authorized: TRUE` |
| **Global token** | `implementation_authorized_global: FALSE` |
| **Deliverable** | Code + tests per §6–§7; report `stage_13B_5_WS2_IMPL_READ_PUB_public_read_surface_alignment_implementation_v1.md` |
| **Review follow-on** | `STAGE_13B_5_WS2_IMPL_READ_PUB_REVIEW` (program pattern) |
| **Forbidden** | READ-GRP, ACTIVITY, COPY, BV, `WS2_AUTHORIZED`, migrations, literal flips |

### 9.2 Carve-outs

| ID | Carve-out |
| --- | --- |
| **CO-READ-1** | PWA repost filter / card copy unchanged — service must still enforce RB-1..RB-6 |
| **CO-READ-2** | Search/index — POLICY V4 deferred |
| **CO-READ-3** | Optional OpenAPI fields for `legacyArtifact: true` — only if impl proves necessary |

---

## 10. Agent Findings

### 10.1 AI Program Director / Project Orchestrator

- **WS2AP-ORCH-1:** **READ-PUB may open** — WRITE + review chain complete — **PASS**.
- **WS2AP-ORCH-2:** **READ-PUB ≠ WS2_AUTHORIZED** — explicit — **PASS**.
- **WS2AP-ORCH-3:** **Next** = **`STAGE_13B_5_WS2_IMPL_READ_PUB`** — **PASS**.
- **WS2AP-ORCH-4:** Sequencing: READ-PUB before READ-GRP per planning Variant A — **PASS**.

### 10.2 Slice Strategist

- **WS2AP-STRAT-1:** Scope **isolatable** — no group/activity routes in slice — **PASS**.
- **WS2AP-STRAT-2:** Prefer **service-layer** distinction filter over blanket SQL repost exclusion — **PASS**.
- **WS2AP-STRAT-3:** `buildFeedResponse` **reason** field in scope — critical for FP-R3 — **PASS**.

### 10.3 Runtime Governance Architect

- **WS2AP-GOV-1:** Aligns with **WS2-PD-3** visible+classified + **WS2-PD-5** — **PASS**.
- **WS2AP-GOV-2:** Reuses **WS-5** FT-5D matrix — no taxonomy invention — **PASS**.
- **WS2AP-GOV-3:** Does **not** authorize READ-GRP / ACTIVITY / COPY — **PASS**.
- **WS2AP-GOV-4:** Regression propagation **≠** legacy — `legacyDistinction` categories — **PASS**.

### 10.4 Runtime Validation Agent

- **WS2AP-VAL-1:** RB-1..RB-10 mapped to tests — **PASS**.
- **WS2AP-VAL-2:** Extend **SURF-PUB** / **SURF-HL** tests — efficient baseline — **PASS**.
- **WS2AP-VAL-3:** **WS2-BV-EXEC** still downstream — **PASS**.

### 10.5 Backend Developer

- **WS2AP-BE-1:** Critical surfaces: **`getHomeFeed`**, **`getPublicationsFeed`**, **`buildFeedResponse`** — **PASS**.
- **WS2AP-BE-2:** `listHomeFeedPosts` still returns repost rows — filter at **assembly** layer — **PASS**.
- **WS2AP-BE-3:** `applyAuthorialExpressionReadGuards` already chains FT-5D — extend with READ policy helper — **PASS**.

### 10.6 QA Agent

- **WS2AP-QA-1:** **Highest risk FP-R1** hide-all-reposts SQL — **FLAG** — forbid FP-R9 — **PASS**.
- **WS2AP-QA-2:** **FP-R3** legacy counted authorial via `reason` — **FLAG** — RB-6 — **PASS**.
- **WS2AP-QA-3:** **FP-R5** group feed scope creep — **PASS** — excluded.

### 10.7 Technical Canon Writer

- **WS2AP-CANON-1:** Impl prompt: *"READ-PUB: legacy visible classified; regression propagation excluded from target public feeds; no ws2_authorized."* — **PASS**.
- **WS2AP-CANON-2:** Verdict **`WS2_IMPL_READ_PUB_AUTHORIZED`** **≠** **`WS2_AUTHORIZED`** — **PASS**.
- **WS2AP-CANON-3:** Distinguish **`legacy_repost_carve_out`** vs **`target_expression`** in feed reason vocabulary — **PASS**.

### 10.8 Disagreements

| Topic | A | B | Resolution |
| --- | --- | --- | --- |
| SQL vs service filter | SQL repost exclusion | Distinction at assembly | **Service first**; SQL only with gate amendment |
| Legacy in home feed | Hide | Visible classified | **Visible classified** per policy |

**Blocking disagreement:** None.

---

## 11. Final Verdict

**`WS2_IMPL_READ_PUB_AUTHORIZED`**

| Verdict | Used? |
| --- | --- |
| `WS2_IMPL_READ_PUB_AUTHORIZED` | **YES** |
| `WS2_IMPL_READ_PUB_AUTH_DEFERRED` | **NO** |
| Forbidden: `WS2_AUTHORIZED`, `IMPLEMENTATION_AUTHORIZED_GLOBAL`, `WS2_IMPLEMENTATION_STARTED` | **NONE issued** |

### Authorization tokens

```yaml
stage_13B_5_WS2_IMPL_AUTH_READ_PUB_status: PASS
stage_13B_5_WS2_IMPL_AUTH_READ_PUB_verdict: WS2_IMPL_READ_PUB_AUTHORIZED
stage_13B_5_WS2_IMPL_AUTH_READ_PUB_execution_mode: GOVERNANCE_SLICE_AUTHORIZATION_GATE_ONLY
ws2_impl_read_pub_implementation_authorized: TRUE
implementation_authorized_global: FALSE
ws2_authorized: FALSE
ws2_impl_write_implementation_complete: TRUE
ws2_impl_write_review_accepted: TRUE
ws_2_write_propagation_blocked: TRUE
stage_13B_5_WS2_IMPL_AUTH_READ_PUB_next_safe_step: STAGE_13B_5_WS2_IMPL_READ_PUB
```

---

## Execution Summary

| Field | Value |
| --- | --- |
| **Report** | `docs/reports/stage_13B_5_WS2_IMPL_AUTH_READ_PUB_public_read_surface_authorization_gate_v1.md` |
| **Verdict** | `WS2_IMPL_READ_PUB_AUTHORIZED` |
| **Next** | `STAGE_13B_5_WS2_IMPL_READ_PUB` |
| **Code changes** | **NONE** |
