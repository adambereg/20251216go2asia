# Stage 13B.5-K — FT-5D Per-Surface Legacy Matrix Implementation Authorization Gate

## 1. Inputs Reviewed

Execution mode:

- `GOVERNANCE_SLICE_AUTHORIZATION_GATE_ONLY`
- no coding;
- no implementation;
- no migrations;
- no DB changes;
- no OpenAPI changes;
- no SDK changes;
- no frontend changes;
- no backend changes;
- no runtime changes;
- no verification execution in this stage.

Multi-agent mode:

- activated before this work using `docs/ai` role model;
- Slice Strategist + Runtime Governance Architect (readonly): WS5-P4 scope, surface inventory, E8 spine step 5, FT-3A handshake preconditions;
- Runtime Validation Agent (readonly): false-pass blockers F9/F12/F15, FR-N2/JR-N2 surface wiring gaps;
- agent outputs used as gate inputs only.

Required governance inputs:

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_JR_ft_5C_implementation_review_and_acceptance_v1.md` | FT-5C accepted; JR-N1..N4 carry-forward |
| `docs/reports/stage_13B_5_J_ft_5C_forbidden_transformations_implementation_v1.md` | FT-5C PASS; step 4 FILLED |
| `docs/reports/stage_13B_5_I_ft_5C_forbidden_transformations_implementation_authorization_gate_v1.md` | Gate pattern; CO-4 defers matrix to FT-5D |
| `docs/reports/stage_13B_5_HR_ft_5B_implementation_review_and_acceptance_v1.md` | FT-5B accepted; HR-N1/N4 |
| `docs/reports/stage_13B_5_H_ft_5B_distinction_rule_implementation_v1.md` | FT-5B implementation baseline |
| `docs/reports/stage_13B_5_FR_ft_5A_implementation_review_and_acceptance_v1.md` | FT-5A accepted; FR-N2 surface gap |
| `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` | P6 per-surface must-not; G3 matrix deferral |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | WS-5 step 5 E8; F9/F12/F15 |
| `docs/reports/stage_13B_3_C_ws_5_legacy_runtime_handling_specification_v1.md` | §3–§5 surfaces; distinction matrix |
| `docs/reports/stage_13B_5_D_ws3_ws5_planning_acceptance_and_implementation_cutline_v1.md` | FT-5D position; Phase A minimum |
| `docs/reports/stage_13B_5_A_B_foundation_trio_ws3_ws5_readiness_and_joint_planning_v1.md` | WS5-P4 inventory |

Code inspected (read-only — baseline; FT-5D not yet implemented):

| Path | Role |
| --- | --- |
| `apps/space-service/src/domain/legacyTaxonomy.ts` | L_* classes; `surface` input for profile/publications |
| `apps/space-service/src/domain/legacyDistinction.ts` | legacy/target/regression; activity/highlight/profile artifact kinds |
| `apps/space-service/src/domain/forbiddenTransformations.ts` | FT-5C guards; surface-specialized asserts (test/API level) |
| `apps/space-service/src/services/spaceService.ts` | Feed/profile/group/activity routes; `mapPostResponse` hook (no `surface` param) |

Accepted upstream state (user-confirmed):

| Token / artifact | Status |
| --- | --- |
| Stage 13B.5-F / FR | FT-5A `ACCEPTED_WITH_NOTES`; complete |
| Stage 13B.5-H / HR | FT-5B `ACCEPTED_WITH_NOTES`; complete |
| Stage 13B.5-J / JR | FT-5C `ACCEPTED_WITH_NOTES`; complete |
| WS-5 spine step 2 (taxonomy) | FILLED |
| WS-5 spine step 3 (distinction) | FILLED |
| WS-5 spine step 4 (forbidden transforms) | FILLED |
| WS-5 spine step 5 (per-surface matrix) | AUTHORIZATION_CANDIDATE → target of this gate |
| WS-5 complete | FALSE |
| Foundation Trio | NOT READY |
| WS-2 | NOT AUTHORIZED |
| P4 / P5 runtime | NOT_ESTABLISHED |
| P6 Legacy Row | HISTORICAL_ARTIFACT_ONLY |

## 2. Authorization Review

### 2.1 Task 1 — Are FT-5A, FT-5B, and FT-5C sufficient to open the FT-5D gate?

Answer:

`YES`

Evidence:

| Criterion | Evidence |
| --- | --- |
| FT-5A accepted | 13B.5-FR `FT_5A_IMPLEMENTATION_ACCEPTED_WITH_NOTES`; L_* taxonomy operational |
| FT-5B accepted | 13B.5-HR `FT_5B_IMPLEMENTATION_ACCEPTED_WITH_NOTES`; distinction on repost read path |
| FT-5C accepted | 13B.5-JR `FT_5C_IMPLEMENTATION_ACCEPTED_WITH_NOTES`; forbidden guards operational (read path + domain API) |
| 13B.5-D hard deps for FT-5D | FT-5A + FT-5B required — **satisfied** |
| 13B.5-D Phase A minimum | FT-5A + FT-5B + FT-5C + **bounded FT-5D** — 5C complete; 5D is next bounded slice |
| FT-X2 WS-5 step 5 | E8 per-surface matrix — **STRUCTURE** until FT-5D impl |
| No blocking JR findings | `review_findings_blocking: FALSE` |
| Classifier stack exists | Taxonomy + distinction + forbidden guards consumable per surface context |
| CO-4 from FT-5C | Per-surface enforcement explicitly deferred to FT-5D — gap is expected, not a blocker for **gate** |

Boundary:

- FT-5A/5B/5C sufficient to **open governance gate 13B.5-K**;
- does **not** authorize coding until this gate passes and a future implementation stage issues the impl token;
- WS5-P5 policy gates remain open — gate is **WITH CONDITIONS**, not unqualified.

### 2.2 Blockers that do not block gate issuance

| Blocker | Why it does not block 13B.5-K |
| --- | --- |
| FR-N2 `surface` not passed in `mapPostResponse` | Expected FT-5D deliverable |
| JR-N2 specialized FT-5C asserts not wired to feed consumers | FT-5D may attach at surface call sites |
| JR-N3 / HR-N1 regression marker not in DB | Document in conditions; matrix uses distinction category |
| WS5-P5/P6 policy open | FT-5D inventories carve-outs; does not resolve policy |
| `saved` surface cross-service | Matrix row at governance level; bounded Space slice only in impl |

### 2.3 Can the FT-5D implementation authorization gate be opened?

Answer:

`YES — GATE MAY BE OPENED`

## 3. FT-5D Scope Definition

### 3.1 Slice identity

| Field | Value |
| --- | --- |
| Slice ID | `FT-5D` |
| Workstream | WS-5 Legacy Runtime Handling |
| Planning slice | WS5-P4 Per-Surface Legacy Matrix |
| Primitive | P6 Legacy Row (projection / surface semantics) |
| Goal | Operationalize **per-surface** rules so reviewers can tell how legacy carve-out, target behavior, and regression appear on each read surface — without choosing visibility policy or eliminating WS-2 |

### 3.2 IN scope (exhaustive)

FT-5D implementation may include only:

1. **Per-surface legacy matrix module** — bounded domain layer (e.g. `perSurfaceLegacyMatrix.ts` or equivalent) mapping surface ID → distinction/taxonomy expectations.
2. **Surface context propagation** — pass `surface` (and artifact kind where needed) into FT-5A/5B/5C classifiers at **bounded** call sites: feed mappers, `mapPostResponse`, activity projection mapping, highlight reference handling.
3. **E8 PRIMARY** — WS-5 evidence spine step 5 `[FILLED]` with per-surface carve-out proof objects.
4. **E7 PRIMARY** — executed per-surface tests (minimum rows in §5.2).
5. **E5 SUPPORTING** — classification per surface reuses FT-5A L_* + FT-5B category (no orphan heuristics).
6. **E6 SUPPORTING** — invoke or extend FT-5C guards where surface could trigger forbidden inference (group quality, blog, chain, feed canon).
7. **Negative projection rules** — legacy rows must not be counted/read as authorial publications, Source References, or post-transition success paths **on each surface**.
8. **Regression detection per surface** — new public/group repost-shaped appearance on feed/group surfaces = regression signal (with fixture marker until DB epoch).
9. **Traceability table** — surface → matrix row → classifier hook → test id.
10. **E2 bounded implementation report** with scope, carve-outs, PASS/FAIL.
11. **Minimum handshake rows** per 13B.5-D §5.3 step 4 — not necessarily full product suppression.

### 3.3 OUT of scope (exhaustive — scope creep forbidden)

| Area | Out of scope | Owns |
| --- | --- | --- |
| FT-5A taxonomy | L_* definition | Complete |
| FT-5B distinction | Category rule | Complete |
| FT-5C forbidden transforms | Transform guards | Complete |
| FT-3A–3D | P4/P5 establishment, authorial writes | WS-3 gates |
| WS-2 | Public/group repost elimination | Separate authorization |
| WS-4 | Authorial-only group feed enforcement | Future WS-4 |
| WS-6 full activity redesign | Projection implementation | WS-6 |
| WS5-P5/P6 policy resolution | Non-owner visibility, labels, suppress timing | Policy gates |
| Hide/delete/migrate/suppress/archive/grandfather **implementation** | disappearance strategy | Policy + forbidden in FT-5C |
| Visibility policy decisions | who sees what in prod | WS5-P5/P6 |
| Feed SQL redesign / empty feed as proof | F9 false pass | Forbidden |
| OpenAPI / SDK as primary proof | E9 never sufficient | Inventory only |
| UI copy / component redesign | WS-7 | Separate |
| Migrations / schema / epoch markers | E9 negative | Future if governed |
| `ws5_full_complete` without bounded minimum | F15 | FT-5D minimum + later WS5-P5/P6 |
| `foundation_trio_ready` / `ws2_authorized` | F1, F18 | FT-X3 / WS-2 |
| Reactions-service saved UI | full saved product | Carve-out: matrix row + boundary test if in scope |

### 3.4 Scope creep detection signals

Implementation review must flag scope creep if diff touches:

- Redefinition of L_* or distinction categories;
- New forbidden transform guard catalog (FT-5C rework);
- `postType: post` authorial write paths (FT-3A);
- Hide/delete/migrate product features;
- WS-2 route elimination;
- OpenAPI bundle as primary deliverable;
- Claims `foundation_trio_ready`, `ws2_authorized`, or unqualified `ws5_full_complete`.

## 4. Surface Inventory

Canonical surfaces for WS5-P4 (from 13B.5-A/B, 13B.3-C, FT-X2 E8, runtime inspection).

### 4.1 Primary surfaces (mandatory minimum)

| Surface ID | Description | Runtime anchor (Space service) | Taxonomy / artifact kind |
| --- | --- | --- | --- |
| `home_feed` | Authenticated home feed | `GET /v1/space/feed/home` → `listHomeFeedPosts` → `mapPostResponse` | `L_PUBLIC_REPOST`, commentary, chain |
| `group_feed` | Group feed items | `GET /v1/space/feed/group/:groupId` → `listGroupFeedPosts` | `L_GROUP_REPOST` |
| `profile_feed` | Profile timeline by author | `GET /v1/space/feed/profile/:userId` → `listProfileFeedPosts` | `L_PROFILE_REPOST_ITEM` when `surface: 'profile'` |
| `publications` | Publication/count semantics on profile | Same rows as profile; classifier `surface: 'publications'` | `L_PROFILE_REPOST_ITEM` |
| `activity_feed` | Activity projection list | `GET /v1/space/feed/activity` → `listActivityFeedRows` + post payload | `L_REPOST_ACTIVITY` via `classifyLegacyArtifact({ kind: 'activity_projection' })` |
| `highlight` | Feed deep-link `?highlight=` to repost card | Highlight reference kind | `L_REPOST_HIGHLIGHT` |
| `post_detail` | Direct post read | `GET /v1/space/posts/:id` → `mapPostResponse` | Row-shaped L_* |
| `saved` | Owner saved/bookmark inventory (cross-primitive) | Reactions/bookmark domain; **not** Space feed SQL | Governance row: P3 bookmark ≠ P6 legacy proof |

### 4.2 Additional surfaces (spec-real, bounded in matrix)

| Surface ID | Description | Notes |
| --- | --- | --- |
| `share_success_destination` | Share-to-Space success → feed highlight | 13B.3-C: legacy highlight ≠ post-transition save success |
| `followers_feed` | `visibility: followers` repost-shaped items in feeds | FR-N3 / `legacy_followers_carve_out` subkind |
| `generated_contract` | API JSON from `mapPostResponse` / feed item envelope | E9 inventory; E8 proves distinction metadata or negative labels in domain proof only |
| `group_feed_anonymous` | Public group feed without auth | Same matrix as `group_feed` with visibility carve-out reference only |

### 4.3 Surface inventory verdict

| Check | Result |
| --- | --- |
| User-mandated six surfaces | **PASS** — feed (home), profile, publications, activity, highlight, saved |
| Spec additions | group_feed, post_detail, share_success, followers, generated_contract |
| Total matrix rows (minimum impl) | **10** primary/additional (saved as governance + boundary row) |

## 5. Per-Surface Matrix

Governance authorization framework only — **not implemented** in this stage.

Legend:

- **LCO** = Legacy Carve-Out behavior on surface
- **TGT** = Target Behavior on surface
- **REG** = Regression handling
- **AV** = Allowed visibility (conceptual; **not** policy resolution)
- **FA** = Forbidden assumptions on surface

### 5.1 Matrix — feed surfaces

| Surface | LCO | TGT | REG | AV (conceptual) | FA |
| --- | --- | --- | --- | --- | --- |
| `home_feed` | Legacy public repost may appear as `reason: repost` card; historical propagation | Private retention not shown as public feed canon; future P4 cards not legacy-shaped | New public repost card after alignment = **regression** | Legacy: public carve-out only; Target: per future authorial policy | Legacy ≠ authorial feed proof; legacy ≠ WS-2 elimination proof; empty home feed ≠ PASS |
| `group_feed` | Legacy group repost may appear in group query results | Post-transition **group Authorial Post** (future FT-3A) must not use legacy L_GROUP_* | New group repost card = **regression** | Legacy: group visibility carve-out; Target: group authorial per WS-4 handshake | Legacy ≠ group quality input (FT-07); legacy ≠ authorial-only WS-4 proof alone |
| `followers_feed` | Followers-visible legacy repost = `legacy_followers_carve_out` | Private repost uses `private`, not followers propagation | New followers repost = regression signal | Legacy carve-out; not target public doctrine | Do not treat as `L_PUBLIC_REPOST` without explicit rule (FR-N3) |

### 5.2 Matrix — profile & publications

| Surface | LCO | TGT | REG | AV (conceptual) | FA |
| --- | --- | --- | --- | --- | --- |
| `profile_feed` | Repost rows listable as historical profile artifacts | Owner private retention visible to owner on profile direct read only | New public/group repost on profile = regression | Owner may see legacy rows per policy gate; non-owner per WS5-P5 | Legacy profile row ≠ authorial publication metric (F12) |
| `publications` | Same row as profile with publications surface flag → `L_PROFILE_REPOST_ITEM` | Authorial publication counts exclude legacy repost rows | Regression if legacy counted as publication | Inventory only until policy resolved | **Forbidden:** legacy repost inflates authorial output |

### 5.3 Matrix — activity, highlight, saved

| Surface | LCO | TGT | REG | AV (conceptual) | FA |
| --- | --- | --- | --- | --- | --- |
| `activity_feed` | `repost_created` / `post_reposted_by_other` as historical activity | New Private Repost must not create incoming pressure activity (FT-09) | New activity matching old public repost social model = regression | Historical activity may remain visible per CARVE_OUT | Legacy activity ≠ post-transition activity doctrine; ≠ Blog/economy proof |
| `highlight` | Deep link to legacy repost feed card | Post-transition save/publish success must not use legacy highlight destination | New highlight to public repost card = regression | Legacy URL carve-out | Highlight ≠ P1 retention success path |
| `saved` | Bookmark/saved may reference legacy targets only as historical context | P3 bookmark hydration ≠ P6 legacy row establishment | N/A for repost-shaped save conflation | Owner inventory per WS-1 | Saved UI ≠ legacy taxonomy pass; bookmark ≠ Private Repost proof (F7) |

### 5.4 Matrix — detail, share, contract

| Surface | LCO | TGT | REG | AV (conceptual) | FA |
| --- | --- | --- | --- | --- | --- |
| `post_detail` | Full repost row readable with distinction + FT-5C guards | Private retention 200 owner-only; standard post carrier separate | Ambiguous repost on read = fail distinction (FT-5B) | `canViewPost` unchanged by FT-5D | Response shape change alone ≠ E8 (F5) |
| `share_success_destination` | Success may still point at highlight under legacy carve-out | Future success paths must not reinforce public repost doctrine | New share flows to public repost = regression | CARVE_OUT_REQUIRED per 13B.3-C | ≠ WS-1 save proof |
| `generated_contract` | Domain proof may expose reviewer metadata (optional); not required consumer-facing fields | Contract fields must not imply P4/P5 from legacy shape | — | E9 inventory separate | OpenAPI presence ≠ matrix PASS |

### 5.5 Cross-surface invariants (all rows)

| Invariant | Statement |
| --- | --- |
| M-1 | Every surface row must cite FT-5B category before surface-specific rules |
| M-2 | Legacy on any surface remains `HISTORICAL_ARTIFACT_ONLY` |
| M-3 | Regression on feed/group/profile surfaces must not be classified as LCO without explicit fixture |
| M-4 | FT-5C forbidden transforms apply on all surfaces where inference could occur |
| M-5 | Matrix PASS must not use hide/delete/empty surface (F9) |

### 5.6 Minimum handshake rows (Phase A — impl stage)

Future FT-5D implementation must fill at minimum:

`home_feed`, `group_feed`, `profile_feed`, `publications`, `activity_feed`, `highlight`, `post_detail`

Optional but recommended in same slice: `saved` (boundary row), `share_success_destination`, `followers_feed`.

## 6. FT-5D Carve-Out Matrix

| ID | Domain | Allowed in FT-5D | Forbidden / carved out | Reference |
| --- | --- | --- | --- | --- |
| CO-1 | Taxonomy | Consume L_*; pass `surface` | Redefine L_* | FT-5A complete |
| CO-2 | Distinction | Per-surface category application | Redefine WS5-P2 rule | FT-5B complete |
| CO-3 | Forbidden transforms | Call FT-5C guards at surface boundaries | Reimplement FT-5C catalog | FT-5C complete |
| CO-4 | Visibility policy | Inventory AV column conceptually | Resolve WS5-P5/P6 non-owner visibility | Policy gates |
| CO-5 | Hide/delete/suppress | Detect F9 false pass | Empty feed / hide as alignment | F9; FT-5C |
| CO-6 | WS-2 | Matrix may note legacy on public surfaces | Elimination implementation | ZR |
| CO-7 | FT-3A | Negative: legacy ≠ P4 on profile/publications | Authorial write/read establishment | FT-3A gate |
| CO-8 | FT-3B/P5 | Negative: legacy binding ≠ SR | Source Reference implementation | FT-3B |
| CO-9 | Save/publish | Negative on highlight/share | Save/publish split impl | FT-3D |
| CO-10 | OpenAPI/SDK | E9 inventory in E2 | Contract change as proof | F5 |
| CO-11 | UI | Debug surface labels optional | Copy-only pass | F6 |
| CO-12 | Feed SQL redesign | Bounded context param + asserts | Full query rewrite / filtering product | Out of bounded slice unless gate amends |
| CO-13 | Trio / WS-5 complete | Step 5 E8 FILLED only | `foundation_trio_ready`, `ws5_full_complete` without minimum | F15 |
| CO-14 | WS-6 | Activity matrix semantics | Full projection rewrite | WS-6 |
| CO-15 | Saved cross-service | Governance row + boundary test if scoped | Reactions UI implementation | WS-1 / Reactions |
| CO-16 | Regression marker | Fixture/metadata per HR-N1 | DB epoch in FT-5D unless separate gate | HR-N1 / JR-N3 |
| CO-17 | Cutline | Enables FT-3A gate after minimum | Skip FT-5D before FT-3A without governance | 13B.5-D §5.4 |

## 7. Evidence Requirements

Based on FT-X2 (no new evidence classes).

### 7.1 Mandatory at this gate (13B.5-K)

| E-class | Requirement at gate stage |
| --- | --- |
| **E1** | This report; carried tokens; false-pass catalog (F9, F12, F15, F8) |
| **E2** | PASS/FAIL template and deliverables declared (§8–10) |
| **E8** | WS5-P4 matrix **defined** at governance level (§5) — not yet executed |
| **E7** | Per-surface test **plan** declared (§7.3) |

Prior E2 required:

- `stage_13B_5_F_*` + `stage_13B_5_FR_*` (FT-5A)
- `stage_13B_5_H_*` + `stage_13B_5_HR_*` (FT-5B)
- `stage_13B_5_J_*` + `stage_13B_5_JR_*` (FT-5C)

### 7.2 Mandatory at future implementation stage

| E-class | Requirement at impl stage |
| --- | --- |
| **E1** | Unchanged canon; explicit non-claim tokens |
| **E2** | FT-5D implementation report with PASS/FAIL |
| **E8** | **PRIMARY** — per-surface matrix operational; spine step 5 `[FILLED]` |
| **E7** | **PRIMARY** — executed per-surface tests (§7.3) |
| **E5** | **PRIMARY** — classification per surface with taxonomy + distinction |
| **E6** | **SUPPORTING** — FT-5C guards invoked where surface triggers forbidden inference |
| **E4** | **SUPPORTING** — read visibility unchanged unless explicitly in scope (expected: unchanged) |
| **E9** | **NEVER-SUFFICIENT** — contract inventory note only |

E6 from FT-5C remains FILLED at step 4; FT-5D must not replace step 4 evidence.

### 7.3 E7 test plan (declared at gate — execution deferred)

| ID | Surface | Intent |
| --- | --- | --- |
| T1 | `home_feed` | Legacy public repost maps LCO; not authorial canon |
| T2 | `group_feed` | Legacy group repost LCO; not group quality (FT-07 hook) |
| T3 | `profile_feed` | `surface: 'profile'` → `L_PROFILE_REPOST_ITEM`; not authorial publication |
| T4 | `publications` | `surface: 'publications'` → profile artifact class; count semantics negative |
| T5 | `activity_feed` | Activity projection LCO; private target no incoming pressure |
| T6 | `highlight` | Highlight reference = legacy carve-out |
| T7 | `post_detail` | `mapPostResponse` + surface context; guards pass for fixtures |
| T8 | `followers_feed` | Followers legacy subkind explicit |
| T9 | Regression | Feed fixture with regression marker ≠ LCO |
| T10 | F9 negative | Assert empty feed not cited as matrix PASS |
| T11 | Cross-surface | Same row classified consistently across surfaces |
| T12 | FT-5C integration | Surface call invokes forbidden guard where applicable |

Suggested execution surface:

- `apps/space-service/src/domain/perSurfaceLegacyMatrix.ts` (or equivalent bounded name);
- `perSurfaceLegacyMatrix.test.ts`;
- bounded changes to feed mappers / `mapPostResponse` to pass `surface`;
- extend `request.test.ts` for profile/group feed legacy semantics where needed.

### 7.4 Insufficient evidence (must not pass FT-5D review)

| Evidence type | Verdict |
| --- | --- |
| FT-5A/5B/5C alone without per-surface matrix | INSUFFICIENT |
| Empty feed/profile/activity as alignment | INSUFFICIENT (F9) |
| OpenAPI/SDK only | INSUFFICIENT (F5) |
| UI label only | INSUFFICIENT (F6) |
| Matrix claims WS-2 eliminated | INSUFFICIENT — scope creep |
| E8 without E5 per surface | INSUFFICIENT (FT-X2 R4) |

## 8. PASS Criteria

After future FT-5D implementation, the slice passes only if all are true:

1. Minimum handshake surfaces (§5.6) have matrix rows implemented in code with traceability.
2. Each row applies FT-5A taxonomy + FT-5B distinction + FT-5C guards (not orphan surface heuristics).
3. `surface` (and artifact kind) propagated at bounded call sites (addresses FR-N2).
4. WS-5 evidence spine step 5 marked `[FILLED]` with E8 evidence references.
5. E7 tests per §7.3 executed and passing.
6. Legacy on profile/publications cannot be read as authorial publication proof (F12).
7. Regression on feed/group surfaces detectable and not classified as legacy carve-out without marker.
8. No hide/delete/empty-surface used as primary alignment (CO-5, F9).
9. E2 report includes scope, carve-outs, forbidden scope verification.
10. Tokens: `foundation_trio_ready: FALSE`, `ws2_authorized: FALSE`, `ws5_full_complete: FALSE` (unless later governance defines bounded full WS-5).
11. FT-3A not authorized by FT-5D report alone — but FT-3A **gate** may open after minimum matrix PASS.
12. FT-5A/5B/5C modules unchanged except as dependencies.
13. Cutline preserved: FT-5A → FT-5B → FT-5C → FT-5D → FT-3A.
14. False Evidence Catalog F9/F12/F15/F8 not triggered in review.

PASS token for implementation review stage:

`FT_5D_IMPLEMENTATION_COMPLETE`

## 9. FAIL Criteria

Implementation fails if any condition holds:

| ID | FAIL condition | False-pass / risk |
| --- | --- | --- |
| F-1 | Verification pass via hiding/deleting/empty surfaces | F9 |
| F-2 | Legacy row cited or counted as P4, P5, or authorial publication | F12, F13 |
| F-3 | OpenAPI/SDK cited as per-surface proof without E8 runtime matrix | F5 |
| F-4 | UI label only; matrix unchanged | F6 |
| F-5 | Report claims `foundation_trio_ready: TRUE` or `ws2_authorized: TRUE` | F1, F18 |
| F-6 | Report claims `ws5_full_complete: TRUE` without bounded minimum + governance | F15 |
| F-7 | Scope includes FT-3A write paths or WS-2 elimination | Scope creep |
| F-8 | Scope reimplements FT-5A/5B/5C taxonomy/distinction/forbidden catalog | Scope creep |
| F-9 | Surface ambiguity: reviewer cannot classify row on surface | BV_FAIL_AMBIGUITY analog |
| F-10 | Legacy visibility treated as active public/group doctrine | 13B.3-C §4 false pass |
| F-11 | Regression treated as legacy carve-out on feed/group | F-11 analog / FT-R2L surface |
| F-12 | Matrix used as proof WS-2 public repost eliminated | WS-2 scope creep |
| F-13 | Visibility policy implemented (non-owner rules) | CO-4 violation |
| F-14 | Full feed SQL redesign as primary deliverable | CO-12 violation |
| F-15 | E7 missing or only taxonomy tests without per-surface cases | F16 analog |
| F-16 | `implementation_authorized: TRUE` at 13B.5-K gate stage | Gate ≠ impl invariant |
| F-17 | This gate interpreted as coding permission without E2 PASS | F18 |
| F-18 | E8 claimed from projections alone without E5 distinction per surface | FT-X2 R4 |

FAIL token for implementation review stage:

`FT_5D_IMPLEMENTATION_FAILED` or `FT_5D_IMPLEMENTATION_BLOCKED`

## 10. Expected Implementation Deliverables

Future implementation stage (not executed in 13B.5-K) must produce:

| # | Deliverable | E-class | Notes |
| --- | --- | --- | --- |
| D1 | FT-5D implementation report | E2 | e.g. `stage_13B_5_L_ft_5D_per_surface_legacy_matrix_implementation_v1.md` |
| D2 | Per-surface matrix module | E8 | Bounded to §5 matrix |
| D3 | Surface context wiring in feed/detail mappers | E8/E5 | FR-N2 closure |
| D4 | Automated tests per §7.3 | E7 | Executed, cited in E2 |
| D5 | Traceability table (surface → row → hook → test) | E8 | In E2 report |
| D6 | Forbidden scope verification | E2 | Mirrors §6 carve-outs |
| D7 | Final implementation tokens | E1 | PASS/FAIL only |
| D8 | Optional: `request.test.ts` extensions | E7 | Profile/group legacy feed cases |

Not expected:

- WS-2 elimination;
- Visibility policy product decisions;
- FT-3A authorial writes;
- Migration scripts;
- OpenAPI bundle as primary proof;
- Full WS5-P5/P6 resolution.

## 11. Authorization Verdict

### 11.1 Gate authorization

Final verdict:

`FT_5D_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS`

Why authorized:

- FT-5A, FT-5B, and FT-5C accepted and complete (§2.1 YES);
- WS5-P4 spec and planning map ready (13B.3-C, 13B.5-A/B);
- cutline positions FT-5D before FT-3A handshake (13B.5-D §5.3–5.4);
- FT-X2 permits E8 gate for per-surface slice;
- no contradiction with JR/FR/HR carry-forward notes;
- user invariant: step 5 = AUTHORIZATION_CANDIDATE — satisfied by this gate.

Why with conditions (not unqualified):

- WS5-P5/P6 policy gates remain open — matrix must not implement visibility policy (CO-4);
- FR-N2 / JR-N2: `surface` wiring is explicit impl deliverable;
- HR-N1/JR-N3: regression marker carry-forward;
- `saved` surface may require cross-service boundary test only;
- Phase A requires **minimum** matrix rows, not full product suppression (13B.5-D §5.3);
- `ws5_full_complete` still requires governance minimum beyond single slice (F15).

Why not blocked:

- prerequisites satisfied;
- surface ambiguity addressable in bounded slice;
- no scope conflict with accepted FT-5A/5B/5C tokens.

### 11.2 Authorization tokens

Gate authorization (this stage):

| Token | Value |
| --- | --- |
| Gate opened | `TRUE` |
| Recommended implementation authorization token (future impl stage only) | `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5D_PER_SURFACE_LEGACY_MATRIX_ONLY` |

Explicit non-authorization (this stage):

| Token | Value |
| --- | --- |
| `stage_13B_5_K_implementation_authorized` | **FALSE** |
| `stage_13B_5_K_foundation_trio_ready` | **FALSE** |
| `stage_13B_5_K_ws2_authorized` | **FALSE** |
| `stage_13B_5_K_ws3_implementation_authorized` | **FALSE** |
| `stage_13B_5_K_ws5_full_complete` | **FALSE** |

Gate conditions:

`FT_5A_ACCEPTED,FT_5B_ACCEPTED,FT_5C_ACCEPTED,MINIMUM_MATRIX_ROWS,E7_PLAN_DECLARED,FR_JR_SURFACE_WIRING,HR_REGRESSION_MARKER_CARRY_FORWARD,POLICY_GATES_CARVE_OUT_ONLY,WS2_NOT_IN_SCOPE`

## 12. Next Safe Step

Recommended next stage:

`Stage 13B.5-L — FT-5D Per-Surface Legacy Matrix Implementation`

Scope:

- bounded coding slice per this gate;
- deliverables §10;
- authorization token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5D_PER_SURFACE_LEGACY_MATRIX_ONLY` (issued at implementation stage start, not here).

Optional parallel governance (does not block 13B.5-L):

- `Stage 13B.5-M` — FT-3A Authorial Expression Implementation Authorization Gate (may open **after** FT-5D minimum impl or in parallel planning once L minimum is committed).

Not safe next:

- FT-5D coding without reading this gate report;
- claiming WS-5 complete or Foundation Trio readiness;
- WS-2 implementation;
- FT-3A coding before Phase A minimum (FT-5D bounded matrix PASS per 13B.5-D).

## 13. Final Tokens

- `stage_13B_5_K_status: FT_5D_IMPLEMENTATION_GATE_COMPLETE`
- `stage_13B_5_K_execution_mode: GOVERNANCE_SLICE_AUTHORIZATION_GATE_ONLY`
- `stage_13B_5_K_verdict: FT_5D_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS`
- `stage_13B_5_K_gate_authorized: TRUE`
- `stage_13B_5_K_implementation_authorized: FALSE`
- `stage_13B_5_K_ft_5a_prerequisite_satisfied: TRUE`
- `stage_13B_5_K_ft_5b_prerequisite_satisfied: TRUE`
- `stage_13B_5_K_ft_5c_prerequisite_satisfied: TRUE`
- `stage_13B_5_K_ft_5d_gate_opened: TRUE`
- `stage_13B_5_K_ft_5a_complete: TRUE`
- `stage_13B_5_K_ft_5b_complete: TRUE`
- `stage_13B_5_K_ft_5c_complete: TRUE`
- `stage_13B_5_K_ft_5d_complete: FALSE`
- `stage_13B_5_K_ws5_spine_step_2_taxonomy: FILLED`
- `stage_13B_5_K_ws5_spine_step_3_distinction: FILLED`
- `stage_13B_5_K_ws5_spine_step_4_forbidden_transforms: FILLED`
- `stage_13B_5_K_ws5_spine_step_5_per_surface_matrix: AUTHORIZED_TO_FILL`
- `stage_13B_5_K_ws5_full_complete: FALSE`
- `stage_13B_5_K_foundation_trio_ready: FALSE`
- `stage_13B_5_K_ws2_authorized: FALSE`
- `stage_13B_5_K_ws3_implementation_authorized: FALSE`
- `stage_13B_5_K_authorial_post_runtime_primitive_established: FALSE`
- `stage_13B_5_K_source_reference_runtime_primitive_established: FALSE`
- `stage_13B_5_K_legacy_row_status: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_5_K_surface_inventory: home_feed,group_feed,profile_feed,publications,activity_feed,highlight,post_detail,saved,share_success_destination,followers_feed,generated_contract`
- `stage_13B_5_K_minimum_handshake_surfaces: home_feed,group_feed,profile_feed,publications,activity_feed,highlight,post_detail`
- `stage_13B_5_K_gate_conditions: FT_5A_ACCEPTED,FT_5B_ACCEPTED,FT_5C_ACCEPTED,MINIMUM_MATRIX_ROWS,E7_PLAN_DECLARED,FR_JR_SURFACE_WIRING,HR_REGRESSION_MARKER_CARRY_FORWARD,POLICY_GATES_CARVE_OUT_ONLY,WS2_NOT_IN_SCOPE`
- `stage_13B_5_K_next_safe_step: STAGE_13B_5_L_FT_5D_PER_SURFACE_LEGACY_MATRIX_IMPLEMENTATION`
- `stage_13B_5_K_recommended_impl_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5D_PER_SURFACE_LEGACY_MATRIX_ONLY`

## 14. Execution Summary

| Item | Value |
| --- | --- |
| Report | `docs/reports/stage_13B_5_K_ft_5D_per_surface_legacy_matrix_implementation_authorization_gate_v1.md` |
| Verdict | `FT_5D_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` |
| FT-5A + FT-5B + FT-5C ready | **YES** |
| Gate authorized | **TRUE** |
| Implementation authorized (this stage) | **FALSE** |
| Surface inventory | **11** surfaces (7 minimum handshake) |
| Matrix | §5 governance framework — **defined, not implemented** |
| Carve-outs | CO-1..CO-17 (policy, WS-2, FT-3x, hide/delete, OpenAPI) |
| PASS criteria | **14** (§8) |
| FAIL criteria | **18** (§9) |
| Next step | **13B.5-L** — FT-5D Implementation |

Invariant reminder:

```text
FT-5D Gate Authorized ≠ FT-5D Implemented
FT-5D Implemented ≠ WS-5 Complete
WS-5 Complete ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
