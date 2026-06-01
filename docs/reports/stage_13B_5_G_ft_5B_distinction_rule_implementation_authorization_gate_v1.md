# Stage 13B.5-G — FT-5B Distinction Rule Implementation Authorization Gate

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
- Slice Strategist + Delivery Planner (readonly): bounded scope, carve-outs, deliverables;
- Runtime Governance Architect + Runtime Validation Agent (readonly): WS5-P2 distinction rule, FT-X1 P6, FT-X2 E-classes, false-pass blockers;
- agent outputs used as gate inputs only (not substitute for this report).

Required governance inputs:

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_FR_ft_5A_implementation_review_and_acceptance_v1.md` | FT-5A acceptance; carry-forward notes FR-N1..N5 |
| `docs/reports/stage_13B_5_F_ft_5A_legacy_taxonomy_implementation_v1.md` | FT-5A implementation baseline |
| `docs/reports/stage_13B_5_E_ft_5A_legacy_taxonomy_implementation_authorization_gate_v1.md` | Gate pattern; CO-7 distinction carve-out |
| `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` | P6 boundaries; distinction evidence tier |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | WS-5 step 3; E5/E6/E7; F9/F15 |
| `docs/reports/stage_13B_3_C_ws_5_legacy_runtime_handling_specification_v1.md` | Release-blocking distinction rule §5 |

Additional inputs:

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_DR_cutline_review_and_first_slice_confirmation_v1.md` | Cutline: FT-5B second after FT-5A |
| `docs/reports/stage_13B_5_D_ws3_ws5_planning_acceptance_and_implementation_cutline_v1.md` | FT-5B inventory; E5+E6; BV risk |
| `docs/reports/stage_13B_4_C13_ft_1F_legacy_boundary_implementation_v1.md` | WS-1-side distinction baseline (not full WS-5) |
| `docs/reports/stage_13B_4_ZR_audit_review_and_canon_lock_v1.md` | Canon locks |

Code inspected (read-only — baseline for gate, not re-implementation):

| Path | Role |
| --- | --- |
| `apps/space-service/src/domain/legacyTaxonomy.ts` | FT-5A L_* taxonomy; distinction builds on this |
| `apps/space-service/test/legacyTaxonomy.test.ts` | FT-5A E7 baseline; distinction tests extend |

Accepted upstream state:

| Token / artifact | Status |
| --- | --- |
| `FT_5A_IMPLEMENTATION_ACCEPTED_WITH_NOTES` | TRUE (13B.5-FR) |
| `stage_13B_5_FR_ft_5a_accepted` | TRUE |
| `stage_13B_5_FR_ft_5a_complete` | TRUE |
| WS-5 evidence spine step 2 (E5 taxonomy) | FILLED (FT-5A) |
| WS-5 evidence spine step 3 (WS5-P2 distinction) | STRUCTURE — target of FT-5B |
| P4 / P5 runtime | `NOT_ESTABLISHED` |
| P6 Legacy Row | `HISTORICAL_ARTIFACT_ONLY` |
| Foundation Trio | NOT READY |
| WS-2 | NOT AUTHORIZED |

## 2. Authorization Review

### 2.1 Task 1 — Is FT-5A result sufficient to open the FT-5B gate?

Answer:

`YES`

Evidence:

| Criterion | Evidence |
| --- | --- |
| FT-5A implementation complete | 13B.5-F `FT_5A_IMPLEMENTATION_PASS`; seven L_* in `legacyTaxonomy.ts` |
| FT-5A review accepted | 13B.5-FR `FT_5A_IMPLEMENTATION_ACCEPTED_WITH_NOTES`; `ft_5a_accepted: TRUE` |
| No blocking findings | FR `review_findings_blocking: FALSE` |
| Hard dependency satisfied | 13B.5-D §3.4 — FT-5B requires FT-5A; DR §4.1 — FT-5B cannot replace FT-5A as first |
| Taxonomy operational | `classifyLegacySpacePostRow`, `classifyLegacyArtifact`; 13 taxonomy tests PASS |
| Post-transition exclusion | Private retention → `null` class; P6 ≠ P1 proven in FT-5A |
| F-10 not triggered for FT-5A scope | Reviewer can assign L_* to legacy fixtures; ambiguity on **legacy vs target vs regression** remains — owned by FT-5B |
| Cutline position | 13B.5-DR §4.6 — FT-5B is strongest immediate follow-on after FT-5A |
| FR next step | Explicitly names this stage (13B.5-G) |

Boundary:

- FT-5A sufficient to **open governance gate 13B.5-G**;
- FT-5A does **not** authorize FT-5B coding — `implementation_authorized` remains FALSE until this gate passes and a future implementation stage is authorized.

### 2.2 Can the FT-5B implementation authorization gate be opened?

Answer:

`YES — GATE MAY BE OPENED`

### 2.3 Blockers that do not block gate issuance

| Blocker | Why it does not block 13B.5-G |
| --- | --- |
| FR-N1 tautological assert | Expected; FT-5B may strengthen proof — condition in §9 |
| FR-N2 surface not in mapPostResponse | FT-5D owns per-surface wiring |
| FR-N3 followers visibility | Must be addressed in FT-5B scope — condition in §9 |
| WS5-P4 matrix empty | FT-5D; not prerequisite for distinction **gate** |
| FT-5C not done | Parallel after 5A; not blocker for 5B **gate** |
| P4/P5 NOT_ESTABLISHED | FT-5B does not establish P4/P5 |

## 3. FT-5B Scope Definition

### 3.1 Slice identity

| Field | Value |
| --- | --- |
| Slice ID | `FT-5B` |
| Workstream | WS-5 Legacy Runtime Handling |
| Planning slice | WS5-P2 Legacy vs post-transition distinction rule |
| Primitive | P6 Legacy Row (distinction layer on top of taxonomy) |
| Goal | Operationalize reviewer-facing **legacy / target / regression** distinction rule |

### 3.2 IN scope (exhaustive)

FT-5B implementation may include only:

1. **Release-blocking distinction rule** from 13B.3-C §5:
   - If a reviewer cannot tell whether visible repost-shaped behavior is a **legacy carve-out** or **post-transition regression**, WS-5 verification fails.
2. **Conceptual distinction matrix** (13B.3-C §5 table) operationalized as classifiers or reviewer rules bound to L_* taxonomy:
   - Repost-shaped public/group feed card → legacy vs regression
   - Repost text/commentary → historical commentary vs private note (WS-1) vs authorial text (WS-3)
   - Repost target binding → historical propagation vs not Source Reference
   - Activity `post_reposted_by_other` → historical vs forbidden for new Private Repost
   - Highlight / profile rows → legacy carve-out vs post-transition success paths
3. **Three primary distinction categories** (minimum):
   - **Legacy Carve-Out** — historical artifact under superseded doctrine; visibility is carve-out, not target canon
   - **Target Behavior** — post-transition WS-1 Private Repost, WS-3 Authorial Post, WS-3 Source Reference semantics
   - **Regression** — new public/group repost-shaped behavior after alignment (not legacy)
4. **Classification rule dimension** (13B.3-C §3): superseded public/group repost doctrine vs post-transition primitives.
5. **E5 distinction evidence** — PRIMARY: reviewer can classify each in-scope repost-shaped fixture.
6. **E6 negative evidence** — PRIMARY for distinction claims: reinforce P6 ≠ P1/P4/P5; extend FT-1F patterns to full WS5-P2 (not FT-1F-as-full-WS-5).
7. **Substantive P6 proof** on distinction path (addresses FR-N1): `legacyPrimitiveProof` / assert logic must not be tautology-only if used as safety net.
8. **Followers visibility distinction** (addresses FR-N3): explicit rule + test for `visibility: 'followers'` legacy repost (currently implicit `L_PUBLIC_REPOST` in FT-5A).
9. **E7 distinction reviewer tests** — executed in implementation stage; minimum plan declared in §5.3.
10. **E2 bounded slice implementation report** with scope, carve-outs, PASS/FAIL, forbidden scope verification.
11. **WS-5 evidence spine step 3** marked `[FILLED]` in E2 report (WS5-P2 distinction rule operational).
12. **Optional reviewer runbook** — documents how to apply rule to fixtures; does not replace automated tests.

### 3.3 OUT of scope (exhaustive — scope creep forbidden)

| Area | Out of scope | Owns |
| --- | --- | --- |
| FT-5A taxonomy | L_* class map redefinition | Complete — extend only if gate condition FR-N3 requires taxonomy adjunct |
| FT-5C Forbidden transformations | no auto-convert, hide/delete guards | Future 13B.5-H gate / parallel slice |
| FT-5D Per-surface matrix | feed/group/profile/activity/highlight/saved enforcement | Future gate; FR-N2 surface wiring |
| FT-3A–3D | Authorial Post, Source Reference, save/publish | WS-3 gates |
| P4 / P5 establishment | any `authorial_post_established` token | FT-3x |
| Migrations / SQL / hide / delete / suppress | alignment via disappearance | F9, F14; WS5-P3 |
| Auto-convert legacy → P1/P4/P5 | transformation | 13B.3-C §6 |
| OpenAPI / SDK as primary proof | contract-as-canon | E9 never sufficient |
| UI copy / component redesign | WS-7 | Separate |
| Feed / profile / activity query redesign | projection implementation | FT-5D |
| WS-2 public/group repost elimination | propagation removal | FT-X3 + WS-2 gate |
| Foundation Trio closure | Trio ready | FT-X3 |
| Full WS-5 completion | `ws5_full_complete` | Requires FT-5C/5D minimum |
| BV / WS-8 execution | verification bundle | Post-Trio |
| Policy resolution WS5-P5/P6 | non-owner visibility implementation | Carve-out inventory only |

### 3.4 Scope creep detection signals

Implementation review must flag scope creep if diff touches:

- New `postType: post` authorial write paths;
- `repostTarget*` rename or Source Reference DTO fields;
- Hide/delete/migrate as distinction strategy;
- Full WS5-P4 per-surface matrix enforcement (FT-5D);
- Forbidden transformation guard implementation (FT-5C);
- OpenAPI bundle regeneration as primary deliverable;
- Claims `ws5_full_complete`, `foundation_trio_ready`, or `ws2_authorized`.

## 4. Distinction Categories

### 4.1 Primary categories (mandatory)

| Category | Definition | Reviewer question | Spec anchor |
| --- | --- | --- | --- |
| **Legacy Carve-Out** | Visible repost-shaped artifact created under superseded public/group repost doctrine; retained as historical artifact; L_* class applies | Is this row/projection a classified legacy artifact with carve-out semantics? | 13B.3-C §5 legacy column |
| **Target Behavior** | Post-transition product semantics: WS-1 Private Repost, WS-3 Authorial Post, WS-3 Source Reference | Is this post-transition target behavior (not legacy, not regression)? | 13B.3-C §3 classification rule |
| **Regression** | New repost-shaped public/group behavior created after doctrine alignment | Is this new propagation that should not exist post-alignment? | 13B.3-C §5 regression column |

### 4.2 Supporting semantic dimensions (in scope for rule definition)

| Dimension | Legacy Carve-Out | Target Behavior | Regression |
| --- | --- | --- | --- |
| Public feed repost card | Legacy public repost if old doctrine | N/A for new public repost | New public repost-shaped card |
| Group feed repost card | Legacy group repost carve-out | Target group Authorial Post (future) | New group repost-shaped card |
| Repost commentary text | Historical commentary | Private note (WS-1) / Authorial Text (WS-3) | N/A |
| `repostTarget*` binding | Historical propagation / retention | Not Source Reference | N/A |
| Activity projection | Historical repost activity | Forbidden incoming for new Private Repost | New activity matching forbidden pattern |
| Highlight deep-link | Legacy carve-out | Not save/publish success | N/A |
| Profile/publications row | Legacy profile artifact | Not Authorial publication | N/A |
| `visibility: followers` | Explicit rule required (FR-N3) | Private Repost uses `private` | New followers repost = regression signal |

### 4.3 Category assignment rules (governance — not code)

1. Apply **FT-5A taxonomy first**: if not legacy-shaped (`null` L_*), distinction category is **Target Behavior** (post-transition path).
2. If L_* assigned, default distinction category is **Legacy Carve-Out** unless fixture is explicitly a **Regression** test (synthetic new public/group repost after cutover marker or documented regression fixture).
3. **Regression** must never be classified as Legacy Carve-Out without explicit regression fixture metadata.
4. **Target Behavior** must never use legacy L_* classes as proof of P4/P5.
5. Distinction rule does not choose hide/archive/label implementation — only classification semantics.

## 5. FT-5B Carve-Out Matrix

| ID | Domain | Allowed in FT-5B | Forbidden / carved out | Reference |
| --- | --- | --- | --- | --- |
| CO-1 | Taxonomy | Use L_* from FT-5A; adjunct rules for followers only | Redefine seven L_* tokens | FT-5A complete |
| CO-2 | Distinction rule | Full WS5-P2 legacy/target/regression rule | — | 13B.3-C §5 |
| CO-3 | Forbidden transforms | Reference in negatives only | Guard implementation | FT-5C |
| CO-4 | Per-surface matrix | Distinction semantics per surface in rule text/tests | Query/filter enforcement | FT-5D |
| CO-5 | Hide / delete | — | Empty surfaces as distinction pass | F9 |
| CO-6 | Auto-convert | — | Legacy → P1/P4/P5 | 13B.3-C §6 |
| CO-7 | OpenAPI / SDK | Inventory in E2 only | Contract change as proof | E9 |
| CO-8 | UI | Debug/reviewer labels if needed for E7 | Copy-only pass | F6 |
| CO-9 | Write paths | Classification on read/review path | New expression or retention writes | FT-X1 |
| CO-10 | P4 / P5 | Negative distinction only | Establishment | F3, F12 |
| CO-11 | WS-1 | Extend FT-1F distinction patterns | Re-open WS-1 closure | C17 |
| CO-12 | WS-2 | — | Elimination work | ZR |
| CO-13 | WS-3 impl | — | FT-3A coding | 13B.5-D |
| CO-14 | Trio / WS-5 complete | Partial step 3 only | `foundation_trio_ready`, `ws5_full_complete` | F15 |
| CO-15 | mapPostResponse surface | Distinction metadata in domain/tests | Full surface wiring | FR-N2 → FT-5D |
| CO-16 | Activity authority | Classify activity-shaped legacy vs regression | Activity as P4/P5 proof | F8 |
| CO-17 | Cutline | Enables FT-5C/5D | Skip to FT-3A without governance | 13B.5-DR |

## 6. Evidence Requirements

Based on FT-X2 (no new evidence classes).

### 6.1 Mandatory at this gate (13B.5-G)

| E-class | Requirement at gate stage |
| --- | --- |
| **E1** | This report; carried tokens; false-pass catalog |
| **E2** | Template structure and PASS/FAIL checklist declared (§7–8) |
| **E5** | Distinction rule target definition (not yet executed at runtime) |
| **E6** | Negative distinction claims declared (P6 anti-collapse extension) |
| **E7** | Distinction test plan declared (§6.3) |

Prior E2 required:

- `stage_13B_5_F_ft_5A_legacy_taxonomy_implementation_v1.md` PASS
- `stage_13B_5_FR_ft_5A_implementation_review_and_acceptance_v1.md` ACCEPTED

### 6.2 Mandatory at future implementation stage

| E-class | Requirement at impl stage |
| --- | --- |
| **E1** | Unchanged canon; explicit non-claim tokens |
| **E2** | FT-5B implementation report with PASS/FAIL |
| **E5** | **PRIMARY** — distinction rule operational; reviewer classification proof |
| **E6** | **PRIMARY** — distinction negatives; legacy ≠ P1/P4/P5; no collapse |
| **E7** | **PRIMARY** — executed distinction tests (not plan-only) |
| **E8** | SUPPORTING only — surface notes paired with E5; not sole authority |

### 6.3 E7 test plan (declared at gate — execution deferred)

Minimum test categories:

| Category | Intent |
| --- | --- |
| T1 | Legacy carve-out: each major L_* class has fixture classified as Legacy Carve-Out |
| T2 | Target behavior: post-transition Private Repost, standard post (future authorial), not legacy/regression |
| T3 | Regression: synthetic new public/group repost-shaped fixture classified as Regression, not Legacy Carve-Out |
| T4 | Ambiguity guard: no fixture where reviewer cannot pick exactly one of legacy / target / regression |
| T5 | P6 anti-collapse: legacy distinction does not imply P4, P5, or P1 |
| T6 | Commentary: legacy commentary ≠ private_note ≠ Authorial Text (extends FT-5A T6) |
| T7 | `repostTarget*`: legacy binding ≠ Source Reference proof |
| T8 | Activity: historical repost activity vs forbidden new private repost pressure |
| T9 | Followers visibility: explicit rule + test (FR-N3) |
| T10 | FT-1F extension: WS-5 distinction tests exceed WS-1-only negative scope |

Suggested execution surface:

- `apps/space-service/src/domain/` distinction module or extension of `legacyTaxonomy.ts` bounded to distinction only;
- `legacyTaxonomy.test.ts` additions and/or `distinctionRule.test.ts`;
- bounded `request.test.ts` additions only where distinction needs HTTP fixture (avoid feed redesign).

### 6.4 Insufficient evidence (must not pass FT-5B review)

| Evidence type | Verdict |
| --- | --- |
| FT-5A taxonomy alone without distinction rule | INSUFFICIENT |
| FT-1F tests alone without WS5-P2 rule | INSUFFICIENT (F15) |
| UI copy / label only | INSUFFICIENT (F6) |
| OpenAPI / SDK presence | INSUFFICIENT (F5) |
| Empty feed/profile/activity | INSUFFICIENT (F9) |
| Hide/delete/migrate | INSUFFICIENT (F14) |
| Planning report citation without distinction classifiers | INSUFFICIENT |
| E8 projection matrix without E5 distinction | INSUFFICIENT (R4) |

## 7. PASS Criteria

After future FT-5B implementation, the slice passes only if all are true:

1. Release-blocking rule from 13B.3-C §5 is implemented and documented in E2 report with traceability.
2. Reviewer can classify every in-scope repost-shaped fixture as exactly one of: Legacy Carve-Out, Target Behavior, or Regression.
3. Regression fixtures are never classified as Legacy Carve-Out.
4. Post-transition Private Repost fixtures are Target Behavior, not Legacy Carve-Out or Regression.
5. P6 anti-collapse reinforced: distinction path proves legacy ≠ P1/P4/P5 (substantive proof if assert used — FR-N1).
6. WS-5 evidence spine step 3 marked `[FILLED]` with E5/E6 evidence (not STRUCTURE-only).
7. E7 tests per §6.3 executed and passing.
8. FR-N3 resolved: `visibility: followers` distinction rule documented and tested.
9. E2 report includes scope, carve-outs, forbidden scope verification, FAIL triggers avoided.
10. No hide/delete/migration used as distinction strategy (CO-5).
11. Tokens in impl report: `foundation_trio_ready: FALSE`, `ws2_authorized: FALSE`, `ws5_full_complete: FALSE`, `authorial_post_runtime_primitive_established: FALSE`, `source_reference_runtime_primitive_established: FALSE`.
12. FT-5C/5D not claimed complete; FT-3A not authorized by FT-5B report alone.
13. FT-1F cited as baseline only, not as full WS-5 complete (F15).
14. Cutline preserved: FT-5A → FT-5B → FT-5C → FT-5D → FT-3A.

PASS token for implementation review stage:

`FT_5B_IMPLEMENTATION_COMPLETE`

## 8. FAIL Criteria

Implementation fails if any condition holds:

| ID | FAIL condition | False-pass / risk |
| --- | --- | --- |
| F-1 | Distinction pass via hiding/deleting/migrating rows | F9, F14 |
| F-2 | Legacy carve-out cited or implemented as Authorial Post or Source Reference | F12, F3; Legacy → Target collapse |
| F-3 | OpenAPI/SDK cited as distinction proof without E5 rule | F5 |
| F-4 | UI label only; distinction rule unchanged | F6 |
| F-5 | Report claims `foundation_trio_ready: TRUE` or `ws2_authorized: TRUE` | F1, F18 |
| F-6 | Report claims `ws5_full_complete: TRUE` | F15 |
| F-7 | Scope includes FT-5C guards or FT-5D matrix implementation | Scope creep |
| F-8 | Scope includes FT-3A write path or P5 rename | F3, F4 |
| F-9 | Empty surfaces cited as distinction alignment | F9; Distinction through hiding |
| F-10 | **`BV_FAIL_AMBIGUITY`**: reviewer cannot distinguish legacy carve-out from target or regression | 13B.3-C §5; 13B.5-D §4.2 |
| F-11 | Regression classified as Legacy Carve-Out | Regression → Legacy disguise |
| F-12 | Target Behavior classified as Legacy Carve-Out for post-transition Private Repost | P1/P6 collapse |
| F-13 | Legacy row used to justify new public/group repost doctrine | Doctrine false pass |
| F-14 | FT-1F alone cited as full WS-5 distinction complete | F15 |
| F-15 | `implementation_authorized: TRUE` set at 13B.5-G gate stage | Gate ≠ impl invariant |
| F-16 | This gate interpreted as coding permission without E2 PASS | F18 |
| F-17 | Distinction rule collapses legacy visibility into target canon without carve-out semantics | Legacy → Target collapse |
| F-18 | E7 only negatives without legacy/target/regression positive fixtures | F16 analog |

FAIL token for implementation review stage:

`FT_5B_IMPLEMENTATION_FAILED` or `FT_5B_IMPLEMENTATION_BLOCKED`

## 9. Expected Implementation Deliverables

Future implementation stage (not executed in 13B.5-G) must produce:

| # | Deliverable | E-class | Notes |
| --- | --- | --- | --- |
| D1 | FT-5B implementation report | E2 | e.g. `stage_13B_5_H_ft_5B_distinction_rule_implementation_v1.md` |
| D2 | Distinction rule module / reviewer API | E5 | legacy / target / regression on top of L_* |
| D3 | Automated tests per §6.3 | E7 | Executed, cited in E2 |
| D4 | Distinction traceability table (category → rule → L_* → test id) | E5 | In E2 report |
| D5 | Forbidden scope verification | E2 | Mirrors §5 carve-outs |
| D6 | Substantive P6 proof on distinction path (FR-N1) | E5/E6 | If assert retained |
| D7 | Followers visibility rule + test (FR-N3) | E5/E7 | Mandatory |
| D8 | Final implementation tokens block | E1 | PASS/FAIL only |
| D9 | Optional reviewer runbook | E5 | Supports BV; not replacement for E7 |

Not expected:

- OpenAPI bundle as primary proof;
- Migrations;
- FT-5C/5D/3x reports;
- BV bundle;
- Full WS5-P4 matrix enforcement.

## 10. Authorization Verdict

### 10.1 Gate authorization

Final verdict:

`FT_5B_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS`

Why authorized:

- FT-5A accepted with evidence (§2.1 YES);
- WS5-P2 planning complete at spec level (13B.3-C §5);
- cutline requires FT-5B before FT-3A gate to reduce `BV_FAIL_AMBIGUITY` (13B.5-D);
- FT-X1/FT-X2 permit per-slice gate with P6 distinction touch only;
- first Foundation Trio coding slice (FT-5A) successfully reviewed — safe to authorize next bounded slice gate.

Why with conditions (not unqualified):

- FR-N1: distinction implementation must strengthen proof beyond FT-5A scaffolding if assert is operational;
- FR-N3: followers visibility rule mandatory in implementation PASS;
- E7 test plan declared here but must be executed before implementation PASS;
- FR-N4/N5: minor gaps — publications surface test deferred to FT-5D; T6 explicit test optional;
- implementation must respect all carve-outs (§5);
- false-pass catalog remains blocking.

Why not blocked:

- no contradiction between FR, 13B.5-D, FT-X1, FT-X2, 13B.3-C;
- FT-5A dependency satisfied;
- policy gates block FT-3A/WS-2, not FT-5B gate issuance.

### 10.2 Authorization tokens

Gate authorization (this stage):

| Token | Value |
| --- | --- |
| Gate opened | `TRUE` |
| Recommended implementation authorization token (future impl stage only) | `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5B_DISTINCTION_RULE_ONLY` |

Explicit non-authorization (this stage):

| Token | Value |
| --- | --- |
| `stage_13B_5_G_implementation_authorized` | **FALSE** |
| `stage_13B_5_G_foundation_trio_ready` | **FALSE** |
| `stage_13B_5_G_ws2_authorized` | **FALSE** |
| `stage_13B_5_G_ws3_implementation_authorized` | **FALSE** |
| `stage_13B_5_G_ws5_full_complete` | **FALSE** |
| `stage_13B_5_G_authorial_post_runtime_primitive_established` | **FALSE** |
| `stage_13B_5_G_source_reference_runtime_primitive_established` | **FALSE** |

## 11. Next Safe Step

Recommended next stage:

`Stage 13B.5-H — FT-5B Distinction Rule Implementation`

Scope:

- bounded coding slice per this gate;
- deliverables §9;
- authorization token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5B_DISTINCTION_RULE_ONLY` (issued at implementation stage start, not here).

Optional parallel governance (does not block 13B.5-H):

- `Stage 13B.5-I` (or equivalent ID) — FT-5C Forbidden Transformations Implementation Authorization Gate (13B.5-D allows parallel with FT-5B after FT-5A).

Not safe next:

- FT-5B coding without reading this gate report;
- FT-3A implementation;
- claiming WS-5 complete or Foundation Trio readiness;
- WS-2 work.

## 12. Final Tokens

- `stage_13B_5_G_status: FT_5B_IMPLEMENTATION_GATE_COMPLETE`
- `stage_13B_5_G_execution_mode: GOVERNANCE_SLICE_AUTHORIZATION_GATE_ONLY`
- `stage_13B_5_G_verdict: FT_5B_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS`
- `stage_13B_5_G_gate_authorized: TRUE`
- `stage_13B_5_G_implementation_authorized: FALSE`
- `stage_13B_5_G_ft_5a_prerequisite_satisfied: TRUE`
- `stage_13B_5_G_ft_5b_gate_opened: TRUE`
- `stage_13B_5_G_ws5_spine_step_3_distinction: AUTHORIZED_TO_FILL`
- `stage_13B_5_G_ws5_full_complete: FALSE`
- `stage_13B_5_G_foundation_trio_ready: FALSE`
- `stage_13B_5_G_ws2_authorized: FALSE`
- `stage_13B_5_G_ws3_implementation_authorized: FALSE`
- `stage_13B_5_G_authorial_post_runtime_primitive_established: FALSE`
- `stage_13B_5_G_source_reference_runtime_primitive_established: FALSE`
- `stage_13B_5_G_legacy_row_status: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_5_G_gate_conditions: FR-N1_SUBSTANTIVE_PROOF,FR-N3_FOLLOWERS_RULE,E7_PLAN_EXECUTED,CO_MATRIX_RESPECTED`
- `stage_13B_5_G_next_safe_step: STAGE_13B_5_H_FT_5B_DISTINCTION_RULE_IMPLEMENTATION`
- `stage_13B_5_G_recommended_impl_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5B_DISTINCTION_RULE_ONLY`

## 13. Execution Summary

| Item | Value |
| --- | --- |
| Report | `docs/reports/stage_13B_5_G_ft_5B_distinction_rule_implementation_authorization_gate_v1.md` |
| Verdict | `FT_5B_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` |
| FT-5A ready for FT-5B gate | **YES** |
| Gate authorized | **TRUE** |
| Implementation authorized (this stage) | **FALSE** |

### Scope summary

| IN | OUT |
| --- | --- |
| WS5-P2 legacy / target / regression distinction rule | FT-5C forbidden transforms |
| E5 + E6 + E7 distinction evidence | FT-5D per-surface matrix |
| FR-N1 proof strengthening, FR-N3 followers rule | FT-3x, WS-2, migrations, OpenAPI-as-proof |

### Distinction categories

Legacy Carve-Out · Target Behavior · Regression (+ semantic dimensions §4.2)

### Carve-outs (top)

FT-5C/5D/3x · hide/delete · auto-convert · OpenAPI proof · Trio/WS-2 claims · full surface wiring (FT-5D)

### PASS (implementation)

14 criteria §7 — distinction operational, step 3 FILLED, E7 pass, FR-N3 resolved, no false-pass tokens

### FAIL (implementation)

18 criteria §8 — emphasis F-10 `BV_FAIL_AMBIGUITY`, F-11/F-12 collapse, F-9 hiding, F-17 legacy→target collapse

### Next safe step

**13B.5-H** — FT-5B Distinction Rule Implementation (coding; not executed in 13B.5-G)

Invariant reminder:

```text
FT-5B Gate Authorized ≠ FT-5B Implemented
FT-5B Implemented ≠ WS-5 Complete
WS-5 Complete ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
