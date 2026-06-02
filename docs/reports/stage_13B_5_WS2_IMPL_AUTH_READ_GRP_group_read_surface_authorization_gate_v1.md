# Stage 13B.5-WS2-IMPL-AUTH-READ-GRP — Group Read Surface Implementation Authorization Gate

**Document class:** `WS2_IMPL_READ_GRP_SLICE_AUTHORIZATION_GATE_ONLY`  
**Not:** READ-GRP implementation · `WS2_AUTHORIZED` · global `implementation_authorized` · ACTIVITY · COPY · WS2-BV-EXEC · WS2-AUTH · runtime / tests / OpenAPI / SDK / DB / literal changes

**Authority inputs:**

| Document | Verdict / role |
| --- | --- |
| `stage_13B_5_WS2_PLANNING_ws2_authorization_planning_v1.md` | `WS2_AUTHORIZATION_PLANNING_COMPLETE` |
| `stage_13B_5_WS2_POLICY_propagation_elimination_policy_gate_v1.md` | `WS2_PROPAGATION_POLICY_ACCEPTED` (V3 group authorial-only) |
| `stage_13B_3_E_ws_4_group_feed_authorial_only_specification_v1.md` | WS-4 frozen target semantics |
| `stage_13B_5_WS2_IMPL_WRITE_REVIEW_v1.md` | `WS2_IMPL_WRITE_REVIEW_ACCEPTED` |
| `stage_13B_5_WS2_IMPL_READ_PUB_REVIEW_v1.md` | `WS2_IMPL_READ_PUB_REVIEW_ACCEPTED` |

**Authority baseline:** `foundation_trio_ready: TRUE`; `ws2_authorized: FALSE`; `ws2_impl_write_review_accepted: TRUE`; `ws2_impl_read_pub_review_accepted: TRUE`; `ws_2_write_propagation_blocked: TRUE`

**Multi-agent mode:** `docs/ai/roles/` — §11 records **seven separate Agent Findings** (no merged summary).

**Pre-flight confirmation:** This stage is a **per-slice authorization gate** for **`WS2-IMPL-READ-GRP`** only. It has **no authority** to grant `WS2_AUTHORIZED`, global `implementation_authorized`, ACTIVITY, COPY, WS2-BV-EXEC, or perform implementation.

---

## 1. Executive Summary

**Main question:** May per-slice implementation authorization be issued for **`WS2-IMPL-READ-GRP`** (Group Read Surface Alignment per WS-4 + WS-2)?

**Answer:** **YES.**

**Gate verdict:** **`WS2_IMPL_READ_GRP_AUTHORIZED`**

**Meaning:** The next stage may align **group read surfaces** so **target group feed expression is authorial-only** (WS-4), while **legacy group repost** remains **visible + classified** (WS-5 / WS2-PD-3). **WRITE** and **READ-PUB** are complete — READ-GRP closes the **group_feed** read-path debt explicitly deferred in READ-PUB review (FP-R5).

```yaml
stage_13B_5_WS2_IMPL_AUTH_READ_GRP_next_safe_step: STAGE_13B_5_WS2_IMPL_READ_GRP
```

---

## 2. Prerequisite Review (Investigation №1)

| Prerequisite | Required | Evidence | Result |
| --- | --- | --- | --- |
| **Foundation Trio Ready** | `TRUE` | Ready v3 + APPLY | **PASS** |
| **WS2-POLICY** | `WS2_PROPAGATION_POLICY_ACCEPTED` | WS2-PD-3 V3: group target authorial-only | **PASS** |
| **WRITE accepted** | `ws2_impl_write_review_accepted: TRUE` | `WS2_IMPL_WRITE_REVIEW_ACCEPTED`; group repost write blocked | **PASS** |
| **READ-PUB accepted** | `ws2_impl_read_pub_review_accepted: TRUE` | `WS2_IMPL_READ_PUB_REVIEW_ACCEPTED` @ `8e66822` | **PASS** |
| **WS-4 canon** | Frozen spec | `stage_13B_3_E_ws_4_group_feed_authorial_only_specification_v1.md` | **PASS** |
| **WS-5 distinction** | FT-5D group_feed | `perSurfaceLegacyMatrix.test.ts` T2; `L_GROUP_REPOST` | **PASS** |
| **No conflicting doctrine** | 13B.2-H, 13B.3-D, READ-PUB scope | Public surfaces aligned; group explicitly deferred | **PASS** |
| **FT-X2 §6.4 (group E3/E8)** | Partial until READ-GRP | Expected; same pattern as READ-PUB | **PARTIAL** (non-blocking) |

**Aggregate:** **PASS** — no **FAIL** blocker for READ-GRP auth gate.

**PARTIAL note:** Full `WS2_AUTHORIZATION_EVIDENCE` still requires ACTIVITY + COPY + BV + WS2-AUTH — **not** READ-GRP scope.

---

## 3. READ-GRP Scope (Investigation №2)

### 3.1 IN scope — group read surfaces (space-service)

| Surface ID | Route / handler | Current behavior (read-only audit @ `8e66822`) | READ-GRP target outcome |
| --- | --- | --- | --- |
| **group_feed** | `GET /v1/space/feed/group/:groupId` → `getGroupFeed` | `listGroupFeedPosts` returns all `visibility=group` rows; `buildFeedResponse` uses **legacy** branch: `reason: 'repost'` for all reposts; **no** `filterSpacePostsForWs2PublicTargetFeed` | Target stream **authorial-only**; legacy group repost **visible + classified**; regression **excluded** |
| **group post list** | Same handler (paginated `items[]`) | Same SQL + assembly | Same as group_feed |
| **group visibility read (by post id)** | `GET /v1/space/posts/:id`, `GET /v1/space/highlight/:id` when row is `visibility=group` | `mapPostResponse` + FT-5D; highlight uses `highlight` surface | Legacy group repost **non-authorial**; not target authorial proof; regression marker support (parity with READ-PUB) |
| **group membership gate** | `canViewGroup` in `getGroupFeed` | Unchanged | **No change** expected |

**Feed builder:** Extend `buildFeedResponse` **group_feed** branch (parallel to READ-PUB public branch) — **not** by modifying `WS2_PUBLIC_TARGET_FEED_SURFACES`.

### 3.2 OUT of scope (explicit non-scope)

| Area | Owner |
| --- | --- |
| **home_feed / profile / publications** | **READ-PUB** (closed) |
| **activity** (`getActivityFeed`, projections) | **WS2-IMPL-ACTIVITY** / WS-6 |
| **COPY / PWA** | **WS-7** |
| **search / ranking** | **DEFERRED** (WS2-PD-3 V4) |
| **Separate “group publications” route** | **Not present** — no new route in slice |
| **WS2-BV-EXEC / WS2-AUTH** | Downstream program gates |
| **OpenAPI / SDK** | Default **no** unless DTO metadata required |
| **Write paths** | **Closed** (WRITE slice) |
| **DB migrations / delete / hide** | **Forbidden** |

### 3.3 Slice isolation

**READ-GRP is sufficiently isolated:** primary touch `getGroupFeed` → `buildFeedResponse(..., 'group_feed')` + optional `ws2PropagationGroupReadPolicy.ts`; must **not** regress READ-PUB public filter paths.

---

## 4. Group Doctrine Mapping (Investigation №3)

Source: WS-4 §4–§8; WS2-PD-3 V3; 13B.2-H group feed quality model.

| Content role | WS-4 target | READ-GRP read policy |
| --- | --- | --- |
| **Authorial Post** (`postType: post`, group visibility) | **TARGET** / allowed | **Include** in target group feed stream; `reason: author_post` or `group_post` per existing convention |
| **Authorial Post + Source Reference** | **TARGET** | **Include**; SR rehydration unchanged (WS-3 / P4) |
| **Legacy group repost** | **Legacy carve-out only** — not target | **Visible** in feed with classified reason (e.g. `legacy_group_repost_carve_out`); **not** authorial; **not** group quality input (FT-5D FT-07) |
| **Legacy chains** (`L_SPACE_POST_CHAIN_ARTIFACT`) | Forbidden as target; carve-out | **Visible + classified** if in group SQL result; not target stream semantics |
| **Regression group propagation** | Forbidden post-transition | **Exclude** from target `items[]` (same marker pattern as READ-PUB: `ws2_post_alignment_regression`) |
| **Private repost** | Forbidden in group feed | **Excluded** by SQL (`visibility = 'group'`) — unchanged |
| **New group repost write** | Forbidden (WS-2) | **Blocked** at write; READ defense in depth |

**Group Feed Authorial-Only (target stream):** Post-transition **target** group feed items must present **authorial** expression only. Legacy group repost may appear **outside** target semantics as **historical artifact**, not as proof that group repost remains canonical (WS-4 §7–§8).

---

## 5. Legacy Policy Mapping (Investigation №4)

Source: WS2-PD-3, WS2-PD-5; `legacyDistinction.ts`; `perSurfaceLegacyMatrix.ts`.

| Policy rule | READ-GRP application |
| --- | --- |
| **Visible + classified** | Legacy group repost **in** `items[]` with distinction reason; `postType: repost` shape preserved |
| **No hide** | Forbidden blanket SQL `post_type <> 'repost'` on `listGroupFeedPosts` (WS-4 negative signal #15) |
| **No delete / migrate** | No row mutation |
| **Not authorial proof** | No `authorialExpressionIntent` on legacy repost; FT-5D `notGroupQualityInputOnSurface` |
| **WS-5 taxonomy** | `L_GROUP_REPOST` / `legacy_group_carve_out` via existing classifiers |

**Reuse:** `classifyRepostArtifactDistinction`, `applyAuthorialExpressionReadGuards` → `applyFt5SurfaceLegacyGuards` with `surface: 'group_feed'`.

---

## 6. Target Files Review (Investigation №5)

Read-only audit on `feat/stage-13b5-ws2-impl-write` @ `8e66822`.

### 6.1 Primary (expected)

| Path | Expected change class |
| --- | --- |
| `apps/space-service/src/services/spaceService.ts` | `buildFeedResponse` group_feed branch; optional `getGroupFeed` pre-filter hook |
| `apps/space-service/src/domain/ws2PropagationGroupReadPolicy.ts` | **NEW (recommended)** — `WS2_GROUP_TARGET_FEED_SURFACES`, `shouldIncludeInGroupTargetFeed`, `resolveGroupFeedItemReason`, `filterSpacePostsForWs2GroupTargetFeed` |
| `apps/space-service/src/domain/ws2PropagationReadPolicy.ts` | **Read-only consume** or shared helper extraction — **avoid** widening public surface list in READ-GRP slice |

### 6.2 Secondary (optional)

| Path | When |
| --- | --- |
| `apps/space-service/src/db/queries/space.ts` | **Only if** service-layer filter cannot meet GB-1 without FP-G4 — document in impl report |
| `apps/space-service/src/routes/feed.ts` | **No logic** expected — delegates to `getGroupFeed` |

### 6.3 Forbidden touch list

| Path | Reason |
| --- | --- |
| `ws2PropagationWritePolicy.ts` | WRITE slice — no regression |
| `ws2PropagationReadPolicy.ts` public surface constants | READ-PUB closed — extend via **group** module |
| `getHomeFeed` / `getPublicationsFeed` / public filter | READ-PUB regression risk |
| Activity / PWA / OpenAPI / SDK | Out of scope |
| Proof literals in domain modules | RB-9 / GB-9 |

### 6.4 Current gap (evidence)

```1235:1243:apps/space-service/src/services/spaceService.ts
      const reason = isWs2PublicTargetFeedSurface(surface)
        ? resolvePublicFeedItemReason(rowInput, readOptions, { groupId: row.group_id })
        : row.post_type === 'repost'
          ? 'repost'
          : row.group_id
            ? 'group_post'
            : ...
```

For `surface === 'group_feed'`, repost rows still receive canonical social **`repost`** reason — **doctrine debt** READ-GRP must close.

---

## 7. Required Behavior (Investigation №6)

| ID | Required behavior | Policy / canon |
| --- | --- | --- |
| **GB-1** | **Target group feed stream** excludes post-transition **regression** propagation repost from `items[]` | WS-4 + WS2-PD-3 V1/V3 |
| **GB-2** | **Legacy group repost** remains **visible** as **legacy carve-out**, not target group content | WS-4 §7; WS2-PD-3 V2 |
| **GB-3** | **Authorial group posts** with optional **Source Reference** unchanged in group feed | WS-3 / WS-4 §6 |
| **GB-4** | Feed **`reason`** must not label legacy/regression repost as **`author_post`** or canonical target **`repost`** social category | WS-4 verification; mirror READ-PUB RB-6 |
| **GB-5** | **Group-visible** highlight/post reads: legacy repost **non-authorial**; authorial rehydration preserved | FT-5D + READ-PUB parity |
| **GB-6** | **No** row DELETE/UPDATE migration; **no** visibility rewrite | WS2-PD-5 |
| **GB-7** | **`repostTarget*`** not treated as Source Reference (existing guards) | WS-4 §6 |
| **GB-8** | Legacy group repost **not** group quality / blog-candidate input | FT-5D FT-07 / WS-4 §7 |
| **GB-9** | Proof literals **`isWs2Authorized`**, **`isFoundationTrioReady`** remain **false** | WB-10 |
| **GB-10** | **No** claim WS-2 / ACTIVITY / COPY / public read complete | Boundary |

---

## 8. Required Tests (Investigation №7)

**Primary file:** `apps/space-service/test/request.test.ts` (new `T-READ-GRP-*` block)

**Secondary:** `apps/space-service/test/ws2PropagationGroupReadPolicy.test.ts` (NEW domain tests, mirror READ-PUB)

| Test ID | Description | Expected |
| --- | --- | --- |
| **T-READ-GRP-1** | Group feed: legacy group repost row → **included** with legacy classification / non-authorial reason | 200; reason ≠ `author_post` |
| **T-READ-GRP-2** | Group feed: regression propagation fixture (`ws2_post_alignment_regression`) → **excluded** from `items[]` | Empty or absent id |
| **T-READ-GRP-3** | Group feed: authorial group post + SR → **present** | 200; `authorialExpressionIntent` + `sourceReference` |
| **T-READ-GRP-4** | Group feed: legacy group repost **not** counted as authorial establishment proof | No authorial intent on legacy |
| **T-READ-GRP-5** | Highlight read on group-visible authorial post → **unchanged** | 200; authorial fields |
| **T-READ-GRP-6** | Highlight read on group-visible legacy group repost → **non-authorial** | 200; `postType: repost`; no authorial intent |
| **T-READ-GRP-7** | Group repost write rejected (T-WS2-W2) + regression row **not** in group feed items | 400 + feed defense |
| **T-READ-GRP-8** | Group feed: authorial `group_post` vs legacy repost distinction in same feed | Two items; distinct reasons |
| **T-READ-GRP-9** | `filters non-group visibility rows` regression | Existing test remains **PASS** |

**Regression suites (mandatory at impl acceptance):**

- Full `pnpm --filter @go2asia/space-service test` (baseline **221/221** post READ-PUB)
- `establishmentTier.contract.test.ts` (**24/24**)
- `perSurfaceLegacyMatrix.test.ts` (**14/14**, especially T2 group_feed)

---

## 9. False Pass Catalog (Investigation №8)

| ID | Pattern | Guard in READ-GRP slice |
| --- | --- | --- |
| **FP-G1** | Hide legacy group repost from feed | GB-2 + T-READ-GRP-1 |
| **FP-G2** | Delete legacy group repost | GB-6 forbidden |
| **FP-G3** | Count legacy as authorial / `author_post` | GB-4, GB-8; T-READ-GRP-4 |
| **FP-G4** | Blanket SQL `post_type <> 'repost'` on group list | **Reject** — WS-4 §8 negative #15 |
| **FP-G5** | Claim ACTIVITY aligned | GB-10; no activity file touch |
| **FP-G6** | Claim WS2 complete | Forbidden verdict tokens |
| **FP-G7** | Modify READ-PUB public filter | Isolate group module only |
| **FP-G8** | OpenAPI-only reason rename | Service `buildFeedResponse` must change |
| **FP-G9** | Hide all repost-shaped rows to fake authorial-only | Distinction filter, not SQL erase |

---

## 10. Gate Decision (Investigation №9)

**Decision:** **`WS2_IMPL_READ_GRP_AUTHORIZED`**

**Rationale:** Prerequisites satisfied; WS-4 + WS2-PD-3 V3 provide clear target; WRITE + READ-PUB complete; FT-5D group_feed infrastructure exists; scope isolatable; tests definable; no canon conflict.

**Not deferred because:** Group feed read debt is explicit post-READ-PUB; policy and spec are frozen; no missing WRITE decision.

### 10.1 If Authorized — implementation package

| Field | Value |
| --- | --- |
| **Next stage** | **`Stage 13B.5-WS2-IMPL-READ-GRP`** — Group Read Surface Alignment Implementation |
| **Per-slice token** | `ws2_impl_read_grp_implementation_authorized: TRUE` |
| **Global token** | `implementation_authorized_global: FALSE` |
| **Deliverable** | Code + tests per §7–§8; report `stage_13B_5_WS2_IMPL_READ_GRP_group_read_surface_alignment_implementation_v1.md` |
| **Review follow-on** | `STAGE_13B_5_WS2_IMPL_READ_GRP_REVIEW` |
| **Forbidden** | ACTIVITY, COPY, BV, `WS2_AUTHORIZED`, migrations, literal flips, READ-PUB regression |

### 10.2 Carve-outs

| ID | Carve-out |
| --- | --- |
| **CO-GRP-1** | No dedicated group-publications API — profile/publications remain READ-PUB |
| **CO-GRP-2** | PWA group card copy unchanged — service must enforce GB-* |
| **CO-GRP-3** | `ws2_post_alignment_regression` reviewer marker only (not DB column), same as READ-PUB |

### 10.3 If Deferred (not applicable)

No blockers identified.

---

## 11. Agent Findings

### 11.1 AI Program Director / Project Orchestrator

- **WS2AP-ORCH-1:** **READ-GRP may open** — WRITE + READ-PUB reviews accepted — **PASS**.
- **WS2AP-ORCH-2:** **READ-GRP ≠ WS2_AUTHORIZED** — explicit — **PASS**.
- **WS2AP-ORCH-3:** Next = **`STAGE_13B_5_WS2_IMPL_READ_GRP`** — **PASS**.
- **WS2AP-ORCH-4:** Sequencing per planning step 6–7 (AUTH-GRP → IMPL-GRP) — **PASS**.

### 11.2 Slice Strategist

- **WS2AP-STRAT-1:** Scope **isolatable** — `group_feed` branch only for feed filter; public paths frozen — **PASS**.
- **WS2AP-STRAT-2:** Recommend **separate** `ws2PropagationGroupReadPolicy.ts` to avoid READ-PUB regression — **PASS**.
- **WS2AP-STRAT-3:** `listGroupFeedPosts` SQL unchanged by default — service-layer first — **PASS**.

### 11.3 Runtime Governance Architect

- **WS2AP-GOV-1:** Aligns with **WS-4** authorial-only target + **WS2-PD-3 V3** — **PASS**.
- **WS2AP-GOV-2:** Legacy **visible + classified**; no hide/delete — **PASS**.
- **WS2AP-GOV-3:** Does **not** authorize ACTIVITY / COPY / WS2-AUTH — **PASS**.
- **WS2AP-GOV-4:** FT-5D `group_feed` + `L_GROUP_REPOST` already enforced in matrix tests — **PASS**.

### 11.4 Runtime Validation Agent

- **WS2AP-VAL-1:** GB-1..GB-10 mapped to tests — **PASS**.
- **WS2AP-VAL-2:** T-READ-GRP-1..9 + domain tests proposed — **PASS**.
- **WS2AP-VAL-3:** Regression baselines 221/24/14 cited from READ-PUB — **PASS**.

### 11.5 Backend Developer

- **WS2AP-BE-1:** Critical path: **`getGroupFeed`** + **`buildFeedResponse` group_feed branch** — **PASS**.
- **WS2AP-BE-2:** Current gap: `reason: 'repost'` for group repost — must become legacy carve-out vocabulary — **PASS**.
- **WS2AP-BE-3:** `listGroupFeedPosts` returns repost rows — filter at assembly — **PASS**.

### 11.6 QA Agent

- **WS2AP-QA-1:** **Highest risk FP-G4** blanket SQL hide — **FLAG** — forbid — **PASS**.
- **WS2AP-QA-2:** **FP-G3** legacy as authorial via `author_post` reason — **FLAG** — GB-4 — **PASS**.
- **WS2AP-QA-3:** **FP-G7** READ-PUB regression — **PASS** — separate module.

### 11.7 Technical Canon Writer

- **WS2AP-CANON-1:** Impl prompt: *"READ-GRP: WS-4 target group feed authorial-only; legacy group repost visible classified; no ws2_authorized."* — **PASS**.
- **WS2AP-CANON-2:** Verdict **`WS2_IMPL_READ_GRP_AUTHORIZED`** **≠** **`WS2_AUTHORIZED`** — **PASS**.
- **WS2AP-CANON-3:** Reason token **`legacy_group_repost_carve_out`** (or equivalent) aligned with `legacy_group_carve_out` subkind — **PASS**.

### 11.8 Disagreements

| Topic | A | B | Resolution |
| --- | --- | --- | --- |
| Single vs split read policy module | Extend `ws2PropagationReadPolicy.ts` | New `ws2PropagationGroupReadPolicy.ts` | **Prefer split** to protect READ-PUB |
| Group reason string | Reuse `legacy_repost_carve_out` | `legacy_group_repost_carve_out` | **Prefer group-specific** for FP-G3 clarity |

**Blocking disagreement:** None.

---

## 12. Final Verdict

**`WS2_IMPL_READ_GRP_AUTHORIZED`**

| Verdict | Used? |
| --- | --- |
| `WS2_IMPL_READ_GRP_AUTHORIZED` | **YES** |
| `WS2_IMPL_READ_GRP_AUTH_DEFERRED` | **NO** |
| Forbidden: `WS2_AUTHORIZED`, `IMPLEMENTATION_AUTHORIZED_GLOBAL`, `WS2_IMPLEMENTATION_STARTED` | **NONE issued** |

### Authorization tokens

```yaml
stage_13B_5_WS2_IMPL_AUTH_READ_GRP_status: PASS
stage_13B_5_WS2_IMPL_AUTH_READ_GRP_verdict: WS2_IMPL_READ_GRP_AUTHORIZED
stage_13B_5_WS2_IMPL_AUTH_READ_GRP_execution_mode: GOVERNANCE_SLICE_AUTHORIZATION_GATE_ONLY
ws2_impl_read_grp_implementation_authorized: TRUE
implementation_authorized_global: FALSE
ws2_authorized: FALSE
ws2_impl_write_review_accepted: TRUE
ws2_impl_read_pub_review_accepted: TRUE
ws_2_write_propagation_blocked: TRUE
stage_13B_5_WS2_IMPL_AUTH_READ_GRP_next_safe_step: STAGE_13B_5_WS2_IMPL_READ_GRP
```

---

## Execution Summary

| Field | Value |
| --- | --- |
| **Report** | `docs/reports/stage_13B_5_WS2_IMPL_AUTH_READ_GRP_group_read_surface_authorization_gate_v1.md` |
| **Verdict** | `WS2_IMPL_READ_GRP_AUTHORIZED` |
| **Next** | `STAGE_13B_5_WS2_IMPL_READ_GRP` |
| **Code changes** | **NONE** |
