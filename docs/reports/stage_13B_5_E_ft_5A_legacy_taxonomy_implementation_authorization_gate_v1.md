# Stage 13B.5-E — FT-5A Legacy Taxonomy Implementation Authorization Gate

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
- no UI copy changes;
- no verification execution;
- no BV execution.

Multi-agent mode:

- activated before this work using `docs/ai` role model;
- Slice Strategist + Delivery Planner (readonly): bounded scope, carve-outs, deliverables;
- Runtime Governance Architect + Runtime Validation Agent (readonly): FT-X1 P6, FT-X2 E-classes, false-pass blockers;
- agent outputs used as gate inputs only.

Required inputs reviewed:

- `docs/reports/stage_13B_5_DR_cutline_review_and_first_slice_confirmation_v1.md`
- `docs/reports/stage_13B_5_D_ws3_ws5_planning_acceptance_and_implementation_cutline_v1.md`
- `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md`
- `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md`
- `docs/reports/stage_13B_5_A_B_foundation_trio_ws3_ws5_readiness_and_joint_planning_v1.md`
- `docs/reports/stage_13B_4_ZR_audit_review_and_canon_lock_v1.md`

Additional inputs reviewed:

- `docs/reports/stage_13B_3_C_ws_5_legacy_runtime_handling_specification_v1.md`
- `docs/reports/stage_13B_4_B_foundation_trio_implementation_planning_v1.md`
- `docs/reports/stage_13B_4_C13_ft_1F_legacy_boundary_implementation_v1.md` (WS-1-side distinction baseline)

Accepted upstream state:

| Token / artifact | Status |
| --- | --- |
| `WS1_BOUNDED_COMPLETE` | TRUE (C17) |
| `FT_X1_BOUNDARY_MATRIX_ACCEPTED_WITH_GAPS` | TRUE (13B.5-C) |
| `FT_X2_EVIDENCE_SPINE_ACCEPTED_WITH_GAPS` | TRUE (13B.5-C2) |
| `IMPLEMENTATION_CUTLINE_DEFINED_WITH_BLOCKERS` | TRUE (13B.5-D) |
| `FT_5A_CONFIRMED_AS_FIRST_SLICE` | TRUE (13B.5-DR) |
| `FT_3A_CONFIRMED_AS_FIRST_EXPRESSION_SLICE` | TRUE (user acceptance; Phase B only) |
| P4 / P5 runtime | `NOT_ESTABLISHED` |
| P6 Legacy Row | `HISTORICAL_ARTIFACT_ONLY` |
| Foundation Trio | NOT READY |
| WS-2 | NOT AUTHORIZED |

## 2. Authorization Review

### 2.1 Task 1 — Can FT-5A be considered a bounded slice?

Answer:

`YES`

Evidence:

| Criterion | Evidence |
| --- | --- |
| Named in cutline inventory | 13B.5-D §3.4 — FT-5A Legacy Taxonomy |
| First-slice confirmed | 13B.5-DR verdict `FT_5A_CONFIRMED_AS_FIRST_SLICE` |
| Single workstream owner | WS-5 only (13B.4-B FT-5A) |
| Single primitive focus | P6 Legacy Row classification (FT-X1 §3.6) |
| Zero prior FT-* PASS dependency | 13B.5-D §3.4, §6.2 |
| Planning spec exists | 13B.3-C §3 — seven L_* taxonomy tokens |
| Distinct from FT-1F | FT-1F = WS-1-side distinction proof; FT-5A = WS-5 taxonomy operationalization (WS5-P1), not duplicate closure |
| Not a mega-slice | Excludes FT-5B/5C/5D and all FT-3x (13B.5-D §4.4) |
| Gate ≠ coding | FT-X2 §6.2; 13B.5-DR invariant |

### 2.2 Can the implementation authorization gate be opened?

Answer:

`YES — GATE MAY BE OPENED`

Boundary:

- this stage **authorizes the gate document and bounded slice contract** for future FT-5A implementation;
- this stage does **not** authorize coding, runtime changes, or Foundation Trio progress claims.

### 2.3 Blockers that do not block gate issuance

| Blocker | Why it does not block 13B.5-E |
| --- | --- |
| X2-G1 P4/P5 NOT_ESTABLISHED | FT-5A does not establish P4/P5 |
| X2-G5 policy gates open | Blocks FT-3A gate; not FT-5A taxonomy gate |
| X2-G6 no prior FT-* E2 report | First gate defines E2 template (condition below) |
| WS5-P4 incomplete | Blocks FT-3A authorization; FT-5D follows FT-5A |

## 3. FT-5A Scope Definition

### 3.1 Slice identity

| Field | Value |
| --- | --- |
| Slice ID | `FT-5A` |
| Workstream | WS-5 Legacy Runtime Handling |
| Planning slice | WS5-P1 Legacy Taxonomy |
| Primitive | P6 Legacy Row (`HISTORICAL_ARTIFACT_ONLY`) |
| Goal | Operationalize L_* legacy taxonomy for runtime classification |

### 3.2 IN scope (exhaustive)

FT-5A implementation may include only:

1. **L_* taxonomy map** aligned to 13B.3-C §3 short tokens:
   - `L_PUBLIC_REPOST`
   - `L_GROUP_REPOST`
   - `L_REPOST_COMMENTARY`
   - `L_SPACE_POST_CHAIN_ARTIFACT`
   - `L_REPOST_ACTIVITY`
   - `L_REPOST_HIGHLIGHT`
   - `L_PROFILE_REPOST_ITEM`
2. **Classification rule** implementation: legacy vs post-transition discriminator inputs (per 13B.3-C classification rule — product relationship under superseded doctrine vs WS-1/WS-3 post-transition semantics).
3. **Runtime role classifiers** (or equivalent bounded classification hooks) that assign repost-shaped artifacts to exactly one L_* class where shape matches taxonomy.
4. **P6 positive proof**: legacy rows remain `HISTORICAL_ARTIFACT_ONLY`; not P1 Private Repost, not P4 Authorial Post, not P5 Source Reference.
5. **P6 negative proof**: reinforcement that legacy binding is not Source Reference; legacy text is not Authorial Text (adjunct); legacy rows are not Bookmark proof.
6. **WS-5 evidence spine step 2** (FT-X2 §4.3): E5 Primitive Classification Proof for taxonomy slot.
7. **E7 automated boundary tests** for taxonomy assignment and P6 negatives (declared in this gate; executed in implementation stage).
8. **E2 bounded slice implementation report** with scope, carve-outs, PASS/FAIL, forbidden scope verification.
9. **Relationship to FT-1F**: may reference FT-1F WS-1-side distinction as baseline; must not claim FT-1F equals full WS-5.

### 3.3 OUT of scope (exhaustive — scope creep forbidden)

| Area | Out of scope | Owns |
| --- | --- | --- |
| FT-5B Distinction rule | legacy / target / regression reviewer rule | Future 13B.5-G gate |
| FT-5C Forbidden transformations | no auto-convert, hide/delete guards | Future 13B.5-H gate |
| FT-5D Per-surface matrix | feed/group/profile/activity/highlight/saved matrix | Future gate |
| FT-3A–3D | Authorial Post, Source Reference, save/publish | WS-3 gates |
| P4 / P5 establishment | any `authorial_post_established` token | FT-3x |
| Migrations / SQL / schema enums | data layer redesign | Forbidden WS5-P3 |
| Hide / delete / suppress rows | alignment via disappearance | F9, F14 (FT-X2) |
| Auto-convert legacy → new primitives | transformation | 13B.3-C §6 |
| OpenAPI / SDK / generated DTO changes as proof | contract-as-canon | E9 never sufficient |
| UI copy / component redesign | WS-7 | Separate workstream |
| Feed / profile / activity query redesign | projection implementation | FT-5D / WS-6 |
| WS-2 public/group repost elimination | propagation removal | FT-X3 + WS-2 gate |
| Foundation Trio closure | Trio ready | FT-X3 |
| BV / WS-8 execution | verification bundle | Post-Trio |
| Policy resolution WS5-P5 / WS3-P6 | visibility policy implementation | Optional 13B.5-E-alt; carve-out at FT-3A gate |
| Full WS-5 completion claim | `ws5_full_complete` | Requires FT-5B/5C/5D |

### 3.4 Scope creep detection signals

Implementation review must flag scope creep if diff touches:

- `postType: post` authorial write paths;
- `repostTarget*` rename or Source Reference fields;
- publication/profile counter logic beyond classification metadata;
- activity materialization changes beyond classification labels;
- OpenAPI bundle regeneration as primary deliverable.

## 4. FT-5A Carve-Out Matrix

| ID | Domain | Allowed in FT-5A | Forbidden / carved out | FT-X2 / DR reference |
| --- | --- | --- | --- | --- |
| CO-1 | Data / DB | Classification metadata, read classifiers | Migrations, enum schema design, row deletion | DR-R1; F9 |
| CO-2 | Write paths | Classification hooks on read/classify path only | New expression or retention write semantics | FT-X1 P4/P1 |
| CO-3 | Hide / delete | — | Empty surfaces or deleted rows as taxonomy pass | F9, F14 |
| CO-4 | Auto-convert | — | Legacy → P1/P4/P5 conversion | 13B.3-C |
| CO-5 | OpenAPI / SDK | Inventory note in E2 report only | Contract change as proof of taxonomy | F5; E9 |
| CO-6 | UI | Debug/classification labels if required for proof | Copy-only WS-7 pass | F6 |
| CO-7 | Distinction rule | — | Full legacy/target/regression rule (FT-5B) | WS5-P2 |
| CO-8 | Forbidden transforms | — | Guard implementation (FT-5C) | WS5-P3 |
| CO-9 | Per-surface policy | Taxonomy class per shape | Full WS5-P4 matrix enforcement | FT-5D |
| CO-10 | P4 / P5 | Negative assertions only | Authorial Post or Source Reference establishment | F3, F12; ZR |
| CO-11 | WS-1 | Reference FT-1F baseline | Re-open WS-1 closure or change Private Repost | C17 |
| CO-12 | WS-2 | — | Any WS-2 authorization or elimination work | ZR |
| CO-13 | Trio / WS-5 complete | Partial WS-5 step 2 only | `foundation_trio_ready`, `ws5_full_complete` | F15; DR-R2/R3 |
| CO-14 | Cutline order | Enables FT-5B/5C | Reorder to FT-3A first without new governance | 13B.5-DR |
| CO-15 | Activity authority | Classify activity-shaped legacy | Activity projection as primitive proof | F8; E8 not authority |
| CO-16 | Bookmark | Classify bookmark target type if needed | Bookmark ≡ Private Repost | FT-X1 P3 |

## 5. Evidence Requirements

Based on FT-X2 (no new evidence classes).

### 5.1 Mandatory at this gate (13B.5-E)

| E-class | Requirement at gate stage |
| --- | --- |
| **E1** Canon & Governance Lock | This report; carried tokens; false-pass catalog reference |
| **E2** Bounded Slice Report | Template structure and PASS/FAIL checklist declared (§6–7) |
| **E5** Primitive Classification | Target definition for P6 L_* map (not yet executed) |
| **E7** Automated Boundary Test | Test plan declared (§5.3) |

### 5.2 Mandatory at future implementation stage

| E-class | Requirement at impl stage |
| --- | --- |
| **E1** | Unchanged canon; explicit non-claim tokens in impl report |
| **E2** | `stage_13B_5_F_*` or equivalent FT-5A implementation report with PASS/FAIL |
| **E5** | **PRIMARY** — all seven L_* classes assigned with observable classification proof |
| **E7** | **PRIMARY** — executed tests; not plan-only |
| **E6** | SUPPORTING — P6 ≠ P1/P4/P5 negative tests (may overlap FT-1F patterns; must extend taxonomy) |

### 5.3 E7 test plan (declared at gate — execution deferred)

Minimum test categories:

| Category | Intent |
| --- | --- |
| T1 | Each L_* class has at least one positive classification fixture |
| T2 | Repost-shaped legacy fixture maps to exactly one L_* class |
| T3 | Post-transition Private Repost is not classified as any L_* legacy class |
| T4 | Legacy row negative: not proof of P4, P5, P1 |
| T5 | `repostTarget*` on legacy row does not produce Source Reference proof shape |
| T6 | Legacy commentary text role ≠ `private_note` and ≠ Authorial Text |

Suggested execution surface (implementation stage choice, not mandated here):

- `apps/space-service` domain classifier module + `request.test.ts` additions bounded to FT-5A.

### 5.4 Insufficient evidence (must not pass FT-5A review)

| Evidence type | Verdict |
| --- | --- |
| UI copy change only | INSUFFICIENT |
| OpenAPI / generated DTO presence | INSUFFICIENT |
| Empty feed/profile/activity | INSUFFICIENT |
| Migration file without classifiers | INSUFFICIENT |
| FT-1F tests alone without L_* taxonomy | INSUFFICIENT |
| Planning report citation without runtime classifier | INSUFFICIENT |
| C13 negative tests alone without taxonomy positives | INSUFFICIENT (analogous to F16 for WS-3) |

## 6. PASS Criteria

After future FT-5A implementation, the slice passes only if all are true:

1. All seven L_* tokens from 13B.3-C §3 have a documented runtime classifier mapping with traceability table in E2 report.
2. Every in-scope repost-shaped test fixture maps to exactly one L_* class (no orphan, no double assignment).
3. Post-transition Private Repost fixtures are explicitly **not** mapped to any L_* legacy class.
4. P6 status is proven: classified legacy artifacts remain `HISTORICAL_ARTIFACT_ONLY`.
5. Negative proof: legacy rows do not establish P1, P4, or P5 (FT-X1 §6.1 P6 row).
6. WS-5 evidence spine step 2 is marked `[FILLED]` in E2 report with E5 evidence references (not planning-only).
7. E7 tests executed and passing per gate test plan §5.3.
8. E2 report includes: scope, carve-outs, forbidden scope verification, explicit FAIL triggers avoided.
9. No hide/delete/migration used as primary taxonomy strategy (CO-3, CO-4).
10. Tokens in impl report explicitly state: `foundation_trio_ready: FALSE`, `ws2_authorized: FALSE`, `ws5_full_complete: FALSE`, `authorial_post_runtime_primitive_established: FALSE`, `source_reference_runtime_primitive_established: FALSE`.
11. FT-5B/5C/5D remain not claimed as complete in FT-5A report.
12. Cutline sequence unchanged; FT-5A does not authorize FT-3A or WS-2.

PASS token for implementation review stage:

`FT_5A_IMPLEMENTATION_COMPLETE`

## 7. FAIL Criteria

Implementation fails if any condition holds:

| ID | FAIL condition | False-pass / risk |
| --- | --- | --- |
| F-1 | Taxonomy pass achieved by hiding/deleting/migrating repost rows | F9, F14; CO-3 |
| F-2 | Legacy row cited or implemented as Authorial Post or Source Reference | F12, F3 |
| F-3 | OpenAPI/SDK regeneration cited as taxonomy proof without E5 classifiers | F5 |
| F-4 | UI label change only; classifiers unchanged | F6 |
| F-5 | FT-5A report claims `foundation_trio_ready: TRUE` or `ws2_authorized: TRUE` | F1, F18 |
| F-6 | FT-5A report claims `ws5_full_complete: TRUE` or full WS-5 spine filled | F15 |
| F-7 | Scope includes FT-5B distinction rule, FT-5C guards, or FT-5D matrix | Scope creep |
| F-8 | Scope includes FT-3A expression write path or P5 `repostTarget*` rename | F3, F4 |
| F-9 | E7 tests missing, not run, or only negatives without L_* positives | F16 analog |
| F-10 | Reviewer cannot assign visible repost-shaped fixture to L_* class using implemented map | `BV_FAIL_AMBIGUITY` signal → FT-5B required |
| F-11 | Post-transition Private Repost classified as legacy L_* class | P1/P6 collapse |
| F-12 | Legacy commentary or `private_note` conflated with Authorial Text | FT-X1 §5 |
| F-13 | `implementation_authorized: TRUE` set at 13B.5-E gate stage | Gate ≠ impl invariant |
| F-14 | This gate document interpreted as coding permission without E2 PASS | F18 |

FAIL token for implementation review stage:

`FT_5A_IMPLEMENTATION_FAILED` or `FT_5A_IMPLEMENTATION_BLOCKED`

## 8. Expected Implementation Deliverables

Future implementation stage (not executed in 13B.5-E) must produce:

| # | Deliverable | E-class | Notes |
| --- | --- | --- | --- |
| D1 | FT-5A implementation report | E2 | e.g. `stage_13B_5_F_ft_5A_legacy_taxonomy_implementation_v1.md` |
| D2 | Taxonomy classifier module / role map | E5 | Bounded to L_* + post-transition exclusion |
| D3 | Automated tests per §5.3 | E7 | Executed, cited in E2 |
| D4 | L_* traceability table (spec token → runtime rule → test id) | E5 | In E2 report |
| D5 | Forbidden scope verification section | E2 | Mirrors §4 carve-outs |
| D6 | Final implementation tokens block | E1 | PASS/FAIL tokens only |
| D7 | Optional: short classification runbook for reviewers | E5 | Supports future FT-5B, not replacement |

Not expected in implementation deliverables:

- OpenAPI bundle diff as primary proof;
- Migration scripts;
- FT-5B/5C/5D reports;
- FT-3A artifacts;
- BV bundle.

## 9. Authorization Verdict

### 9.1 Gate authorization

Final verdict:

`FT_5A_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS`

Why authorized:

- FT-5A is a valid bounded slice (§2.1 YES);
- first-slice confirmation (13B.5-DR) stands;
- taxonomy spec ready at planning level (13B.3-C);
- FT-X1/FT-X2 permit per-slice gate with P6-only touch;
- cutline and handshake require WS5-P1 before WS-3 coding.

Why with conditions (not unqualified):

- first FT-* E2 report template must be created at implementation stage (X2-G6);
- E7 test plan is declared in this gate but must be executed before PASS;
- implementation must respect all carve-outs (§4);
- false-pass catalog remains blocking.

Why not blocked:

- no contradiction between DR, 13B.5-D, FT-X1, FT-X2;
- policy gate openness blocks FT-3A, not FT-5A gate issuance.

### 9.2 Authorization tokens

Gate authorization (this stage):

| Token | Value |
| --- | --- |
| Gate opened | `TRUE` |
| Recommended implementation authorization token (future impl stage only) | `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5A_LEGACY_TAXONOMY_ONLY` |

Explicit non-authorization (this stage):

| Token | Value |
| --- | --- |
| `stage_13B_5_E_implementation_authorized` | **FALSE** |
| `stage_13B_5_E_foundation_trio_ready` | **FALSE** |
| `stage_13B_5_E_ws2_authorized` | **FALSE** |
| `stage_13B_5_E_ws3_implementation_authorized` | **FALSE** |
| `stage_13B_5_E_ft_3a_authorized` | **FALSE** |
| `stage_13B_5_E_ws5_full_complete` | **FALSE** |

### 9.3 Conditions for implementation stage

1. Implementation must cite this gate report and authorization token verbatim.
2. Diff scope must match §3 IN scope only.
3. E2 report must include §6 PASS / §7 FAIL checklist results.
4. E7 tests from §5.3 must run and pass.
5. No token may claim Trio ready, WS-2, full WS-5, or P4/P5 established.
6. If F-10 ambiguity appears in review, stop and open FT-5B gate — do not stretch FT-5A scope.

## 10. Next Safe Step

Recommended next stage:

`Stage 13B.5-F — FT-5A Legacy Taxonomy Implementation`

Scope:

- bounded coding per this gate;
- produce deliverables §8 D1–D7;
- seek `FT_5A_IMPLEMENTATION_COMPLETE` only after §6 PASS criteria;
- maintain `implementation_authorized: FALSE` until human acceptance of implementation review (separate acceptance message or follow-on governance review stage if required by project convention).

Follow-on after FT-5A PASS:

- `Stage 13B.5-G — FT-5B Distinction Rule Implementation Authorization Gate`
- `Stage 13B.5-H — FT-5C Forbidden Transformations Implementation Authorization Gate` (may parallel G)

Not safe next:

- coding without citing `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5A_LEGACY_TAXONOMY_ONLY`;
- FT-3A implementation;
- WS-2;
- Foundation Trio closure;
- changing FT-X1 or FT-X2.

## 11. Final Tokens

- `stage_13B_5_E_status: FT_5A_IMPLEMENTATION_GATE_AUTHORIZATION_COMPLETE`
- `stage_13B_5_E_execution_mode: GOVERNANCE_SLICE_AUTHORIZATION_GATE_ONLY`
- `stage_13B_5_E_verdict: FT_5A_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS`
- `stage_13B_5_E_gate_authorized: TRUE`
- `stage_13B_5_E_implementation_authorized: FALSE`
- `stage_13B_5_E_authorization_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_5A_LEGACY_TAXONOMY_ONLY`
- `stage_13B_5_E_bounded_slice: FT_5A_LEGACY_TAXONOMY`
- `stage_13B_5_E_ws5_planning_slice: WS5_P1_LEGACY_TAXONOMY`
- `stage_13B_5_E_ws5_spine_target: STEP_2_E5_TAXONOMY_ONLY`
- `stage_13B_5_E_foundation_trio_ready: FALSE`
- `stage_13B_5_E_ws2_authorized: FALSE`
- `stage_13B_5_E_ws3_implementation_authorized: FALSE`
- `stage_13B_5_E_ft_3a_authorized: FALSE`
- `stage_13B_5_E_ws5_full_complete: FALSE`
- `stage_13B_5_E_authorial_post_runtime_primitive_established: FALSE`
- `stage_13B_5_E_source_reference_runtime_primitive_established: FALSE`
- `stage_13B_5_E_legacy_row_status: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_5_E_first_slice_confirmed_carried_forward: TRUE`
- `stage_13B_5_E_mandatory_e_classes_gate: E1,E2_TEMPLATE,E5_TARGET,E7_PLAN`
- `stage_13B_5_E_mandatory_e_classes_impl: E1,E2,E5,E7`
- `stage_13B_5_E_documented_carve_outs: CO-1_THROUGH_CO-16`
- `stage_13B_5_E_next_safe_step: STAGE_13B_5_F_FT_5A_LEGACY_TAXONOMY_IMPLEMENTATION`

## 12. Execution Summary

| Deliverable | Path |
| --- | --- |
| FT-5A Implementation Authorization Gate | `docs/reports/stage_13B_5_E_ft_5A_legacy_taxonomy_implementation_authorization_gate_v1.md` |

| Item | Summary |
| --- | --- |
| Verdict | `FT_5A_IMPLEMENTATION_GATE_AUTHORIZED_WITH_CONDITIONS` |
| Bounded slice | **YES** |
| Gate authorized | **TRUE** |
| Implementation authorized | **FALSE** |
| Scope | L_* taxonomy + P6 classifiers + E5/E7; no FT-5B/5C/5D, no FT-3x |
| Carve-outs | 16 rows (§4); core: no migration/hide/delete, no P4/P5, no WS-2 |
| PASS | 12 criteria (§6) |
| FAIL | 14 conditions (§7) |
| Next step | **13B.5-F** — FT-5A Implementation |

Invariant reminder:

```text
Implementation Gate Authorized ≠ Implementation Authorized
Implementation Authorized ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```
