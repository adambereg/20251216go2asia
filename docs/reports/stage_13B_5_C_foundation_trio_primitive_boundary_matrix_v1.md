# Stage 13B.5-C — Foundation Trio Primitive Boundary Matrix

**Establishment canon alignment (13B.6-C-APPLY):** This document is aligned with operative **`Go2Asia Foundation Primitive Maturity & Establishment Canon v1`** (`stage_13B_6_B_establishment_canon_proposal_v1.md` §11; lock: `stage_13B_6_C_establishment_canon_adoption_and_lock_gate_v1.md`). Maturity tiers: IDEA → SPECIFIED → IMPLEMENTED → ACCEPTED → **ESTABLISHED_BOUNDED** → **ESTABLISHED** → READY (WS-2 separate).

**P4 tier display (13B.5-FE-P4-APPLY):** P4 current tier **`ESTABLISHED`** (full) per `stage_13B_5_FE_P4_full_establishment_gate_v1.md` (`P4_ESTABLISHED_GRANTED`). Prior bounded grant: `stage_13B_5_P4_establishment_bounded_reassessment_gate_v1.md`. CO-13 literal remains **`false`**.

**P5 tier display (13B.5-FE-P5-APPLY):** P5 current tier **`ESTABLISHED`** (full) per `stage_13B_5_FE_P5_full_establishment_gate_v1.md` (`P5_ESTABLISHED_GRANTED`). Prior bounded grant: `stage_13B_5_P5_establishment_bounded_reassessment_gate_v1.md`. CO-S12 literal remains **`false`**.

**Foundation Trio Ready display (13B.5-FOUNDATION-TRIO-READY-APPLY):** Program token **`foundation_trio_ready: TRUE`** per `stage_13B_5_foundation_trio_ready_gate_v3.md` (`FOUNDATION_TRIO_READY_GRANTED`). **≠** WS-2 · **≠** literal CO-13/CO-S12 · **≠** `implementation_authorized`.

## 1. Inputs Reviewed

Execution mode:

- `GOVERNANCE_AND_BOUNDARY_MATRIX_AUTHORIZATION_ONLY`
- no coding;
- no implementation;
- no migrations;
- no DB changes;
- no OpenAPI changes;
- no SDK changes;
- no frontend changes;
- no backend changes;
- no runtime changes;
- no UI changes;
- no policy decisions on visibility;
- no WS-2 opening;
- no implementation authorization.

Multi-agent mode:

- activated before this work using `docs/ai` role model;
- Runtime Governance Architect (readonly): primitive boundaries, collapse prevention, evidence tiers, interaction edges;
- Technical Canon Writer (readonly): report completeness, adjunct concepts, authorization-readiness assessment;
- agent outputs used as governance inputs only, not as implementation permission.

Required inputs reviewed:

- `docs/reports/stage_13B_5_A_B_foundation_trio_ws3_ws5_readiness_and_joint_planning_v1.md`
- `docs/reports/stage_13B_4_ZR_audit_review_and_canon_lock_v1.md`
- `docs/reports/stage_13B_4_Z_foundation_trio_preflight_audit_v1.md`
- `docs/reports/stage_13B_4_C17_ft_1H_ws1_closure_evidence_review_v1.md`

Additional inputs reviewed:

- `docs/reports/stage_13B_3_B_authorial_post_and_source_reference_runtime_specification_v1.md`
- `docs/reports/stage_13B_3_C_ws_5_legacy_runtime_handling_specification_v1.md`
- `docs/reports/stage_13B_3_F_ws_6_activity_projection_specification_v1.md`
- `docs/reports/stage_13B_4_B_foundation_trio_implementation_planning_v1.md`

Accepted canon baseline carried forward:

- `WS1_BOUNDED_COMPLETE`
- `FOUNDATION_TRIO_PREFLIGHT_AUDIT_COMPLETE`
- `CANON_LOCK_ACCEPTED_WITH_CLARIFICATIONS`
- `FOUNDATION_TRIO_PLANNING_AUTHORIZED_WITH_CONDITIONS`
- Authorial Post **current tier:** `ESTABLISHED` (full — granted `stage_13B_5_FE_P4_full_establishment_gate_v1.md`; bounded prerequisite `stage_13B_5_P4_establishment_bounded_reassessment_gate_v1.md`)
- Source Reference **current tier:** `ESTABLISHED` (full — granted `stage_13B_5_FE_P5_full_establishment_gate_v1.md`; bounded prerequisite `stage_13B_5_P5_establishment_bounded_reassessment_gate_v1.md`)
- Legacy Row remains `HISTORICAL_ARTIFACT_ONLY`
- Foundation Trio Ready **granted** at governance display (Ready Gate v3 + APPLY) — **`foundation_trio_ready: TRUE`**
- WS-2 remains not authorized
- Planning Authorization ≠ Implementation Authorization

## 2. Primitive Inventory Confirmation

### 2.1 Core primitives (FT-X1 matrix scope)

| ID | Primitive | Workstream | Runtime establishment |
| --- | --- | --- | --- |
| P1 | Private Repost | WS-1 | `ESTABLISHED_BOUNDED` (C17 / FT-1A–1G) |
| P2 | Private Note | WS-1 | `ESTABLISHED_BOUNDED` (FT-1C) |
| P3 | Bookmark | WS-1 / Reactions | `ESTABLISHED_BOUNDED` (FT-1E) |
| P4 | Authorial Post | WS-3 | **`ESTABLISHED`** *(current, full)* — `stage_13B_5_FE_P4_full_establishment_gate_v1.md` (Canon v1 §5) |
| P5 | Source Reference | WS-3 | **`ESTABLISHED`** *(current, full)* — `stage_13B_5_FE_P5_full_establishment_gate_v1.md` (Canon v1 §5) |
| P6 | Legacy Row | WS-5 | `CLASSIFIED_ONLY` (FT-1F WS-1-side; full WS-5 incomplete) |

### 2.1.1 Per-primitive establishment tier model (§4.5 index — Canon v1)

| Tier | Meaning |
| --- | --- |
| `NOT_ESTABLISHED` | No bounded or full establishment gate verdict yet |
| `ESTABLISHED_BOUNDED` | Bounded establishment gate PASS (EBB criteria — Canon v1 §4) |
| `ESTABLISHED` | Full establishment gate PASS (EST criteria — Canon v1 §5) |
| `ESTABLISHED_BOUNDED` ≠ `ESTABLISHED` | Bounded tier does not imply Trio Ready or WS-2 |

**Current file status:** P4 **`ESTABLISHED`** (full). P5 **`ESTABLISHED`** (full). **`foundation_trio_ready: TRUE`** (governance display — `stage_13B_5_foundation_trio_ready_gate_v3.md`). **Foundation Trio Ready ≠ WS-2 Authorized**. CO-13 / CO-S12 literals remain **`false`**.

Inventory confirmation:

- the six primitives above are necessary and sufficient for the Foundation Trio Primitive Boundary Matrix;
- no seventh storage/runtime primitive is required to make the matrix internally complete;
- adjunct concepts (below) must appear in the matrix but are not promoted to primitives.

### 2.2 Adjunct concepts (in matrix, not primitives)

| Adjunct | Role in matrix | Why not a primitive |
| --- | --- | --- |
| Authorial Text | Primary textual payload of Authorial Post only | Text role, not a separate retention/expression/history unit |
| Retention Target Binding | Owner-only saved-source binding inside Private Repost | Binding semantics of P1, not Source Reference |
| Repost Commentary (legacy/public) | Historical quote-like text on legacy/public repost lanes | Legacy surface class (WS5-P1), not P2 or Authorial Text |
| Retention Intent | Save-for-myself semantic intent | Cross-primitive invariant (Private Repost / Bookmark) |
| Expression Intent | Publish-my-thought semantic intent | Cross-primitive invariant (Authorial Post) |
| Activity Projection / Activity Event | Derived social timeline surface | WS-6 projection; not authority for primitive proof |
| Feed / Profile / Group Projections | Read/render surfaces | Not primitives; governed by WS-4/WS-5/WS-7 carve-outs |
| Public/Group Repost Propagation | Pre-transition write path | WS-2 debt; blocked until Foundation Trio closure |

### 2.3 Completeness answer (Task 2)

Question: do additional primitives exist without which the Foundation Trio Boundary Matrix would be incomplete?

Answer:

`MATRIX_PRIMITIVE_SET_COMPLETE`

Explanation:

- the old repost runtime conflated retention, expression, and history;
- Foundation Trio separation is fully addressable with P1–P6;
- adjunct concepts must be referenced to prevent collapse but must not be invented as new product primitives;
- gaps that remain are **runtime establishment** and **policy matrices** (WS-3/WS-5), not missing primitive slots in FT-X1.

## 3. FT-X1 Primitive Boundary Matrix

Legend:

- **ESTABLISHED_BOUNDED** = bounded primitive establishment per Canon v1 (WS-1: C17/FT-1A–1G; WS-3: EBB gate required for P4/P5)
- **ESTABLISHED** = full primitive establishment per Canon v1 (EST gate + spine step 13b)
- **NOT_ESTABLISHED** = no bounded or full establishment gate verdict yet (tier model label; **current:** P4 and P5 **`ESTABLISHED`** (full))
- **Classified only** = distinction proof exists; full policy matrix incomplete

### 3.1 Private Repost (P1)

| Field | Definition |
| --- | --- |
| Canonical Role | WS-1 owner-only retention primitive: save source context for the owner without public/group publication or social propagation. |
| Positive Definition | Post-transition retention classified as `private_repost_intent`; carrier `postType: repost` + `visibility: private`; owner can view retained context; retention dedupe scoped to owner+target; no social repost activity pressure for new private retention. |
| Negative Definition | Not Authorial Post; not Bookmark; not Source Reference; not Legacy Row; not public/group repost; not publication output; not proof of expression intent. |
| Allowed Relations | May contain optional Private Note (P2); may retain owner-only binding to external source material (Retention Target Binding adjunct); may coexist in same ecosystem with Bookmark on same target without identity merge. |
| Forbidden Relations | Must not collapse into Bookmark, Authorial Post, Source Reference, Legacy Row, or public/group propagation path. |
| Evidence Requirements | See Section 6 (P1 row). |
| False-Pass Risks | `WS1_BOUNDED_COMPLETE` read as Foundation Trio ready; Saved UI read as retention inventory; legacy repost row read as Private Repost; UI copy "publish/repost" read as propagation proof. |

### 3.2 Private Note (P2)

| Field | Definition |
| --- | --- |
| Canonical Role | Optional owner-only text attached to Private Repost; retention annotation, not public expression. |
| Positive Definition | Text role `private_note` inside Private Repost; owner display/edit on retention surfaces; silent owner-only edit without publication semantics. |
| Negative Definition | Not Authorial Text; not public repost commentary; not group/public publication; not Source Reference caption; not legacy commentary proof. |
| Allowed Relations | Attached only to Private Repost (P1); may reference owner's retention context only. |
| Forbidden Relations | Must not attach to Authorial Post as primary text; must not serve public/group feed as authorial payload; must not be relabeled as repost commentary for publication lanes. |
| Evidence Requirements | See Section 6 (P2 row). |
| False-Pass Risks | Private Note treated as Authorial Text; public commentary lane renamed to Authorial Post; same text field serves retention and publication. |

### 3.3 Bookmark (P3)

| Field | Definition |
| --- | --- |
| Canonical Role | Reactions-owned reaction fact (`reactionType: bookmark`); pointer to material, not Space retention primitive. |
| Positive Definition | Written and owned by Reactions service; hydrated on saved surfaces; independent of Space retention dedupe and Private Repost create path. |
| Negative Definition | Not Private Repost; not Private Note; not Authorial Post; not Source Reference; not Legacy Row identity; not retention dedupe participant. |
| Allowed Relations | May reference any bookmarkable target including `space_post` and legacy-shaped posts; may coexist with P1 on same target without merge. |
| Forbidden Relations | Must not be implemented as Space `postType: repost` private row; must not be used as WS-1 retention proof; must not imply authorial publication. |
| Evidence Requirements | See Section 6 (P3 row). |
| False-Pass Risks | Saved UI treated as Private Repost inventory; bookmark on legacy row treated as primitive identity merge; Reactions write cited as retention proof. |

### 3.4 Authorial Post (P4) — ESTABLISHED (full, current)

| Field | Definition |
| --- | --- |
| Canonical Role | Future WS-3 expression primitive: standalone user-authored publication whose primary value is the author's own material (Authorial Text). |
| Positive Definition | Expression unit for public/group thought; author text is primary; may exist with zero Source References; save/publish split separates from retention; independent of source preview for meaning. |
| Negative Definition | Not `postType: post` alone; not Private Note; not repost commentary; not Legacy Row; not Bookmark; not Private Repost; not activity projection; not generated DTO vocabulary. |
| Allowed Relations | Carries Authorial Text (adjunct); may optionally attach zero or one Source Reference (P5) one-hop; conceptual save/publish split opposite to Private Repost retention. |
| Forbidden Relations | Must not be proven from legacy profile/feed rows; must not inherit `repostTarget*` semantics; must not use Private Note or commentary fields. |
| Evidence Requirements | See Section 6 (P4 row). |
| False-Pass Risks | `postType: post` cited as runtime proof; `PARTIAL TECHNICAL SHAPE ONLY` overread as WS-3 readiness; legacy row cited as existing Authorial Post; object-bound path still creating public repost treated as aligned. |

### 3.5 Source Reference (P5) — ESTABLISHED (full, current)

| Field | Definition |
| --- | --- |
| Canonical Role | Future WS-3 optional zero-or-one one-hop secondary context attached only to Authorial Post; provenance/inspiration, not repost binding. |
| Positive Definition | At most one hop; secondary to Authorial Text; attached only to P4; does not create thread/reply/quote/repost chain; does not create incoming social pressure by itself. |
| Negative Definition | Not `repostTargetType` / `repostTargetId`; not Private Repost retention binding; not legacy repost binding; not Bookmark; not activity authority; not Blog candidate alone. |
| Allowed Relations | Points one-hop to source material only via Authorial Post (P4 → P5 → source). |
| Forbidden Relations | Must not exist on Private Repost, Legacy Row, Bookmark, or standalone; must not be implemented as column rename of repost target fields. |
| Evidence Requirements | See Section 6 (P5 row). |
| False-Pass Risks | `repostTarget*` rename; legacy binding as Source Reference proof; generated `SpacePostRepostRef` as canon proof; repost preview on `postType: post` treated as SR hydration. |

### 3.6 Legacy Row (P6) — HISTORICAL_ARTIFACT_ONLY

| Field | Definition |
| --- | --- |
| Canonical Role | Pre-transition repost-shaped historical artifact (public/group/chain/activity/profile/highlight); classified and governed, not converted silently. |
| Positive Definition | Exists in storage and projections as `postType: repost` with non-private visibility or historical carve-out; FT-1F proves distinction from post-transition Private Repost; WS-5 owns taxonomy, distinction rule, forbidden transformations, per-surface matrix. |
| Negative Definition | Not Private Repost; not Authorial Post; not Source Reference; not Bookmark; not proof of post-transition primitives; not Blog/group-quality input. |
| Allowed Relations | May appear on feed/profile/group/activity/highlight/saved surfaces under WS-5 carve-out policy; may be bookmarked (P3) without becoming P1/P4/P5. |
| Forbidden Relations | Must not auto-convert to P1/P4/P5; must not be hidden/deleted/migrated merely to pass verification; must not supply Source Reference or Authorial Post proof. |
| Evidence Requirements | See Section 6 (P6 row). |
| False-Pass Risks | Hide/delete legacy to pass tests; legacy commentary as Authorial Text; legacy `repostTarget*` as Source Reference; disappearance of repost UI read as doctrine alignment. |

### 3.7 Master boundary table (compact)

| Primitive | Must never be proof for | Must never collapse into |
| --- | --- | --- |
| Private Repost | Authorial Post, Source Reference, Bookmark, Legacy Row, WS-2 alignment | Bookmark, public repost, authorial publication |
| Private Note | Authorial Text, public commentary, Source Reference | Authorial Text, repost commentary, publication |
| Bookmark | Private Repost, Private Note, Authorial Post, Source Reference | Private Repost, retention row, authorial output |
| Authorial Post | Private Note, Legacy Row, Bookmark, `postType: post` alone | Private Note, legacy row, repost commentary |
| Source Reference | `repostTarget*`, Private Repost binding, Legacy binding | Repost target rename, retention binding, legacy binding |
| Legacy Row | P1/P4/P5 establishment, Foundation Trio readiness | Authorial Post, Source Reference, Private Repost |

## 4. Primitive Interaction Matrix

Allowed relations only (canon-level; not implementation design).

| From | Relation | To | Constraint |
| --- | --- | --- | --- |
| Private Repost (P1) | contains (optional) | Private Note (P2) | owner-only |
| Private Repost (P1) | retains (owner-only) | external source material | Retention Target Binding adjunct; not P5 |
| Bookmark (P3) | references | bookmarkable target | reaction fact; no Space identity merge |
| Authorial Post (P4) | carries (primary) | Authorial Text | adjunct; WS-3 target |
| Authorial Post (P4) | optionally attaches 0..1 one-hop | Source Reference (P5) | WS-3 target; **P4 and P5 `ESTABLISHED` (full)**; **`foundation_trio_ready: TRUE`** (governance) — **≠ WS-2** |
| Source Reference (P5) | points (one-hop) | source material | only via P4 |
| Legacy Row (P6) | may display on | feed/profile/group/activity/highlight | WS-5 carve-out; historical only |
| Legacy Row (P6) | may be referenced by | Bookmark (P3) | bookmark does not change legacy class |
| Retention Intent | applies to | P1, P3 | save-for-myself semantics |
| Expression Intent | applies to | P4 | publish-my-thought semantics |

Explicitly forbidden interaction edges (no allowed relation):

| From | To | Reason |
| --- | --- | --- |
| Private Note (P2) | Authorial Text / Authorial Post (P4) | retention text ≠ expression text |
| Bookmark (P3) | Private Repost (P1) | separate owners and write paths |
| Private Repost (P1) | Source Reference (P5) | retention binding ≠ public provenance |
| `repostTarget*` | Source Reference (P5) | rename collapse |
| Legacy Row (P6) | Authorial Post (P4) or Source Reference (P5) | history ≠ post-transition expression |
| Activity projection | any primitive proof | projection is not authority |
| UI copy / generated DTO | any primitive proof | vocabulary ≠ runtime canon |

## 5. Collapse Prevention Matrix

| Dangerous collapse | Why false | Reviewer detection signals |
| --- | --- | --- |
| Private Note → Authorial Text | Owner-only retention annotation must not become primary public/group expression. | Same text field or role used for owner retention and publication; WS-3 evidence cites private note paths. |
| Bookmark → Private Repost | Reactions fact must not become Space retention row. | Saved hydration cited as retention proof; Space dedupe reads Reactions; bookmark write paired with private repost create. |
| `repostTarget*` → Source Reference | Legacy binding field is propagation/quote semantics, not WS-3 one-hop context on Authorial Post. | SR implemented as column rename, DTO alias, or repost preview on `postType: post` without separate primitive proof. |
| `postType: post` → Authorial Post | Generic pre-WS-3 carrier is insufficient for canon Authorial Post runtime. | Evidence cites post create only; no authorial independence, save/publish split, or primary Authorial Text proof. |
| Private Repost → Authorial Post | Retention saves context; expression publishes thought. | Private visibility row counted as authorial output; profile/publication includes retention as publication. |
| Legacy Row → Authorial Post | Historical artifact must not prove post-transition expression primitive. | Profile/feed/publication counts legacy repost as authorial; Blog candidate from legacy row. |
| Legacy Row → Source Reference | Legacy binding is historical, not post-transition provenance. | Legacy `repostTarget*` presented as Source Reference establishment. |
| Private Repost retention binding → Source Reference | Owner-only context binding is not public/group one-hop reference. | Retention target on private repost used as authorial provenance in public surfaces. |
| Private Note → repost commentary | Public commentary lane is legacy/propagation semantics, not P2. | Public/group repost text relabeled as Private Note or Authorial Text without role separation. |
| Legacy Row → Private Repost | Post-transition private retention must be distinguishable from historical rows. | Legacy public/group row treated as new Private Repost proof; missing `HISTORICAL_ARTIFACT_ONLY` classification. |
| Activity projection → primitive authority | Activity is derived; must not establish P1–P6. | Implementation evidence is activity-only; incoming/outgoing pressure proof from projection insert alone. |
| UI copy → runtime proof | WS-7 language is not primitive establishment. | Evidence bundle is label/copy change only; runtime behavior unchanged. |
| Generated DTO / OpenAPI vocabulary → canon proof | Contract inventory ≠ runtime primitive. | SDK type presence cited as Authorial Post or Source Reference proof. |
| Tests/mocks alone → product readiness | Fixtures prove boundaries, not full WS-3/WS-5 establishment. | Mock legacy row or post shape cited without observable runtime path. |
| Migrations/hide/delete → alignment | Removing legacy rows is forbidden transformation, not proof. | Feed/profile/activity empty of reposts without distinction rule and taxonomy evidence. |
| `WS1_BOUNDED_COMPLETE` → Foundation Trio ready | WS-1 is only retention side of Trio. | Closure token used to authorize WS-3/WS-5 or WS-2 without separate gates. |

## 6. Evidence Requirement Matrix

### 6.1 Per-primitive evidence

| Primitive | May count as evidence | Must NOT count as evidence |
| --- | --- | --- |
| **Private Repost (P1)** | `private_repost_intent` classification; `postType: repost` + `visibility: private`; owner visibility paths; retention dedupe scope separation; FT-1A/B/D/G accepted reports; targeted service tests | public/group repost rows; bookmark writes; legacy rows; activity materialization for new private retention; UI copy; projections alone |
| **Private Note (P2)** | `private_note` text role; owner display/edit on retention surfaces; FT-1C report and tests | public commentary lane; Authorial Text; legacy commentary; publication counters |
| **Bookmark (P3)** | Reactions `reactionType: bookmark`; saved hydration path; FT-1E report and tests; proof Space dedupe does not read Reactions | Private Repost create/read; retention inventory semantics; identity merge with repost row |
| **Authorial Post (P4)** | **@ ESTABLISHED_BOUNDED:** `authorial_expression_intent` + `AUTHORIAL_TEXT_ROLE`; FT-3A/3C/3D acceptances; independence; save/publish split; persistence + rehydration; E4 inventory; request integration positives; E6/E7 negatives (not alone). **@ ESTABLISHED (full):** above + E4 FILLED at establishment tier; E8 handshake FILLED; EST-TEST-1; spine step 13b; EST gate PASS | `postType: post` alone; FT-1D proxy alone; legacy rows; UI copy; generated DTO/OpenAPI alone; activity; migrations alone; classification proof without gate; EBB tier alone for Ready |
| **Source Reference (P5)** | **@ ESTABLISHED_BOUNDED:** MATERIAL_ONLY contract; parse/persist/read staging; one-hop on P4 only; FT-3B acceptance; HTTP SR positive; E6/E7 negatives (not alone). **@ ESTABLISHED (full):** above + EST gate PASS; spine step 13b; EST-TEST-1; E4/E8 as required for P5 chain | `repostTarget*` fields; Private Repost binding; legacy binding; C13 negatives alone; OpenAPI rename without behavior; boundary proof without gate; EBB alone for Ready |
| **Legacy Row (P6)** | FT-1F distinction tests; `HISTORICAL_ARTIFACT_ONLY` classification; WS-5 taxonomy + distinction rule + forbidden transformation adoption | proof of P1/P4/P5; hide/delete/migrate to pass; auto-convert; per-surface policy without WS5-P4 matrix |

### 6.2 Cross-cutting evidence rules

| Evidence type | Rule |
| --- | --- |
| UI copy | Never sufficient alone for any primitive establishment (WS-7). |
| Projections (feed/profile/group/activity) | May support distinction or carve-out only when paired with classification rules; never sole authority. |
| Generated DTO / OpenAPI | Contract inventory only; not canon primitive proof. |
| Activity events | May prove absence of pressure (WS-1) or historical carve-out; cannot establish P4/P5. |
| Legacy rows | May prove P6 classification; cannot prove P1/P4/P5. |
| Tests | Required for bounded slices; mocks prove boundaries, not full Trio readiness. |
| Migrations | Schema history is not primitive semantics; migration without distinction policy is forbidden transformation risk. |

### 6.3 Evidence tier summary

| Tier | Primitives | Minimum bar |
| --- | --- | --- |
| **ESTABLISHED_BOUNDED** | P1, P2, P3 | C17 `WS1_BOUNDED_COMPLETE` + FT-1A–1G accepted reports + observable tests |
| **ESTABLISHED** *(full)* | P4 | `stage_13B_5_FE_P4_full_establishment_gate_v1.md` — **current tier** |
| **ESTABLISHED** *(full)* | P5 | `stage_13B_5_FE_P5_full_establishment_gate_v1.md` — **current tier** |
| Classified historical | P6 | FT-1F WS-1-side distinction + WS-5 taxonomy/matrix/policy gates before full WS-5 proof |

## 7. Boundary Completeness Review

### 7.1 Matrix coverage

| Check | Result |
| --- | --- |
| Six required primitives defined with all seven fields | PASS |
| Adjunct concepts documented without inventing primitives | PASS |
| Interaction matrix lists allowed and forbidden edges | PASS |
| Collapse prevention covers ZR/13B.5-A/B false-pass catalog | PASS |
| Evidence matrix separates established vs not established | PASS |
| ZR canon clarifications embedded (`postType: post`, `repostTarget*`, Legacy terminology) | PASS |

### 7.2 Documented gaps (do not invalidate FT-X1 primitive set)

| Gap ID | Gap | Impact on matrix | Blocks matrix acceptance? |
| --- | --- | --- | --- |
| G1 | Authorial Post runtime tier | P4 **`ESTABLISHED`** (full) granted | P4 bounded + full EST **CLOSED**; literal flip **OPEN** (LIT-P4) |
| G2 | Source Reference runtime tier | P5 **`ESTABLISHED`** (full) granted | P5 bounded + full EST **CLOSED**; literal flip **OPEN** (LIT-P5) |
| G3 | WS-5 per-surface legacy matrix (WS5-P4) not fully enumerated | P6 display rules reference future matrix | NO — documented deferral |
| G4 | WS-3/WS-5 visibility and policy gates open (WS3-P6, WS5-P5) | Does not blur primitive boundaries; blocks implementation auth | NO for FT-X1 |
| G5 | Public/group repost propagation (WS-2 debt) listed as adjunct, not primitive | Prevents false "matrix incomplete" primitive invention | NO |
| G6 | FT-X2 Foundation Evidence Spine not yet authored | Future gate may reference this matrix + evidence bundle | NO for FT-X1 acceptance |

Completeness verdict:

- primitive set: `COMPLETE`
- operational/policy closure for implementation: `INCOMPLETE` (by design until later gates)

## 8. Authorization Assessment

Question: can the Primitive Boundary Matrix serve as a sufficient foundation for future implementation authorization gates?

Answer:

`YES_AS_BOUNDARY_PRECONDITION_NOT_AS_SOLE_GATE`

Assessment:

| Criterion | Result |
| --- | --- |
| Reviewer can classify P1–P6 positively and negatively | YES |
| Reviewer can detect collapse cases without reading implementation code first | YES — Section 5 signals |
| Matrix carries ZR clarifications forward | YES |
| Matrix replaces per-slice FT-3x / FT-5x authorization reports | NO |
| Matrix alone authorizes WS-3 or WS-5 implementation | NO |
| Matrix alone makes Foundation Trio ready or opens WS-2 | NO |

Required companions for future implementation authorization gates:

- this FT-X1 matrix (accepted);
- false-pass catalog from 13B.5-A/B adopted as blocking policy;
- WS-5 minimum taxonomy + distinction rule + forbidden transformations + per-surface matrix;
- WS-3 Source Reference anti-collapse rules before API/schema discussion;
- separate bounded-slice authorization per C10-style pattern;
- optional FT-X2 Foundation Evidence Spine for end-to-end proof chaining.

Implementation authorization at this stage:

`NOT_AUTHORIZED`

Foundation Trio readiness at this stage:

`FALSE`

WS-2 authorization at this stage:

`FALSE`

## 9. Verdict

Final verdict:

`FT_X1_BOUNDARY_MATRIX_ACCEPTED_WITH_GAPS`

Why not `FT_X1_BOUNDARY_MATRIX_REVIEW_REQUIRED`:

- no canonical contradiction found across inputs;
- six-primitive set is complete;
- gaps G3–G6 are expected deferrals (WS-5 surface matrix, policy gates, Trio/WS-2 gates); P4/P5 full EST **granted** — not missing primitive definitions.

Why not `FT_X1_BOUNDARY_MATRIX_ACCEPTED` without qualification:

- P4 and P5 are **`ESTABLISHED`** (full gates granted); **Foundation Trio Ready** **granted** at governance display (Ready v3 + APPLY); **WS-2** remains **not granted**;
- WS-5 per-surface matrix and policy gates remain open for implementation authorization (documented in G3–G4).

Acceptance scope:

- FT-X1 is accepted as the canonical Foundation Trio Primitive Boundary Matrix artifact;
- acceptance authorizes use of this matrix in future governance gates;
- acceptance does not authorize implementation, WS-2, or Foundation Trio closure.

## 10. Next Safe Step

Recommended next safe stage:

`Stage 13B.5-D — WS-3 / WS-5 Planning Acceptance & Implementation Cutline Authorization`

Scope:

- governance/authorization only;
- evaluate 13B.5-A/B joint planning plus this FT-X1 matrix;
- decide whether a first bounded WS-3 or WS-5 implementation slice may be **proposed** for a later gate;
- preserve `implementation_authorized: FALSE` unless a separate slice authorization explicitly passes.

Optional follow-on (if cutline deferred):

`Stage 13B.5-C2 — FT-X2 Foundation Evidence Spine (governance-only)`

Not safe next:

- WS-3 implementation;
- WS-5 implementation;
- Source Reference implementation;
- legacy migration, hide, or delete-to-pass;
- OpenAPI/SDK changes as proof of primitives;
- WS-2;
- Foundation Trio closure claim.

## 11. Final Tokens

- `stage_13B_5_C_status: FT_X1_PRIMITIVE_BOUNDARY_MATRIX_AUTHORIZATION_COMPLETE`
- `stage_13B_5_C_execution_mode: GOVERNANCE_AND_BOUNDARY_MATRIX_AUTHORIZATION_ONLY`
- `stage_13B_5_C_ft_x1_verdict: FT_X1_BOUNDARY_MATRIX_ACCEPTED_WITH_GAPS`
- `stage_13B_5_C_boundary_matrix_complete: TRUE`
- `stage_13B_5_C_primitive_set_complete: TRUE`
- `stage_13B_5_C_authorization_ready: TRUE`
- `stage_13B_5_C_implementation_authorized: FALSE`
- `stage_13B_5_C_foundation_trio_ready: TRUE`
- `stage_13B_5_C_ws2_authorized: TRUE` *(governance display @ `stage_13B_5_WS2_AUTH_APPLY_display_and_token_patch_v1.md`; ≠ literal CO-13/CO-S12)*
- `stage_13B_5_C_ws3_implementation_authorized: FALSE`
- `stage_13B_5_C_ws5_implementation_authorized: FALSE`
- `stage_13B_5_C_authorial_post_runtime_primitive_established: FALSE`
- `stage_13B_5_C_source_reference_runtime_primitive_established: FALSE`
- `stage_13B_5_C_legacy_row_status: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_5_C_ws1_bounded_complete_carried_forward: TRUE`
- `stage_13B_5_C_canon_lock_carried_forward: CANON_LOCK_ACCEPTED_WITH_CLARIFICATIONS`
- `stage_13B_5_C_planning_authorized_carried_forward: FOUNDATION_TRIO_PLANNING_AUTHORIZED_WITH_CONDITIONS`
- `stage_13B_5_C_documented_gaps: G1,G2,G3,G4,G5,G6`
- `stage_13B_5_C_next_safe_step: STAGE_13B_5_WS2_PLANNING`

## 12. Execution Summary

| Deliverable | Path |
| --- | --- |
| FT-X1 Primitive Boundary Matrix report | `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` |

Invariant reminder:

```text
Primitive Boundary Matrix ≠ Implementation Authorization
Implementation Authorization ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
