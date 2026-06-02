# Stage 13B.5-C2 — FT-X2 Foundation Evidence Spine

**Establishment canon alignment (13B.6-C-APPLY):** Aligned with operative **`Go2Asia Foundation Primitive Maturity & Establishment Canon v1`** (`stage_13B_6_B_establishment_canon_proposal_v1.md` §11; lock: `stage_13B_6_C_establishment_canon_adoption_and_lock_gate_v1.md`). WS-3 step **13a/13b** split; Ready (§6.3) requires **full ESTABLISHED** for P4 and P5, not **ESTABLISHED_BOUNDED** alone.

**P4 tier display (13B.5-FE-P4-APPLY):** P4 **`ESTABLISHED`** (full); step **13a** `[FILLED]`; step **13b (P4)** `[FILLED]` per `stage_13B_5_FE_P4_full_establishment_gate_v1.md`. WS-3 steps 4–12 establishment-tier `[FILLED]` per same gate corroboration.

**P5 tier display (13B.5-FE-P5-APPLY):** P5 **`ESTABLISHED`** (full); step **13a (P5)** `[FILLED]`; step **13b (P5)** `[FILLED]` per `stage_13B_5_FE_P5_full_establishment_gate_v1.md`. WS-3 **step 7** `[FILLED]` per same gate.

**WS-5 spine display (13B.5-WS5-SPINE-APPLY):** WS-5 §4.3 steps **1–9** `[FILLED]` per `stage_13B_5_WS5_SPINE_ws5_evidence_spine_completion_gate_v1.md` (`WS5_SPINE_COMPLETION_GRANTED`). Spine status **`WS5_EVIDENCE_SPINE_FILLED`**. **≠** Trio Ready · **≠** WS-2.

**Trio rollup display (13B.5-TRIO-ROLLUP-APPLY):** §4.4 steps **1–7** `[FILLED]` per `stage_13B_5_TRIO_ROLLUP_trio_rollup_completion_gate_v1.md` (`TRIO_ROLLUP_COMPLETION_GRANTED`). Spine status **`TRIO_EVIDENCE_SPINE_FILLED`**.

**Foundation Trio Ready display (13B.5-FOUNDATION-TRIO-READY-APPLY):** §4.4 step **8** `[FILLED]` per `stage_13B_5_foundation_trio_ready_gate_v3.md` (`FOUNDATION_TRIO_READY_GRANTED`). Program token **`foundation_trio_ready: TRUE`** (governance display). **≠** WS-2 · **≠** literal CO-13/CO-S12 · **≠** `implementation_authorized`.

**WS-2 authorization display (13B.5-WS2-AUTH-APPLY):** §6.4 **`[FILLED]`** — **`WS2_AUTHORIZATION_EVIDENCE_SATISFIED`**. Program token **`ws2_authorized: TRUE`** (governance display). Sources: `stage_13B_5_WS2_BV_EXEC_ws2_boundary_verification_execution_gate_v1.md` (`WS2_BV_EXECUTION_PASS`); `stage_13B_5_WS2_AUTHORIZATION_GATE_v1.md` (`WS2_AUTHORIZED_GRANTED`). Evidence bundle: WS2-E3-WRITE, WS2-E6-READ-PUB, WS2-E6-READ-GRP, WS2-E6-ACTIVITY, WS2-E7-COPY, WS2-BV-EXEC, WS2-POLICY, FT-X2-SPINE. **≠** literal CO-13/CO-S12 · **≠** `implementation_authorized_global` · **≠** runtime change @ APPLY.

## 1. Inputs Reviewed

Execution mode:

- `GOVERNANCE_AND_EVIDENCE_SPINE_AUTHORIZATION_ONLY`
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
- no verification execution;
- no BV execution;
- no WS-2 authorization;
- no Foundation Trio closure;
- no implementation authorization.

Multi-agent mode:

- activated before this work using `docs/ai` role model;
- Runtime Governance Architect + Runtime Validation Agent (readonly): evidence taxonomy, authority levels, spine chains, false evidence;
- Technical Canon Writer (readonly): FT-X1 linkage, section completeness, authorization framework assessment;
- agent outputs used as governance inputs only, not as permission to implement or verify.

Required inputs reviewed:

- `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` (FT-X1, accepted)
- `docs/reports/stage_13B_5_A_B_foundation_trio_ws3_ws5_readiness_and_joint_planning_v1.md`
- `docs/reports/stage_13B_4_ZR_audit_review_and_canon_lock_v1.md`
- `docs/reports/stage_13B_4_C17_ft_1H_ws1_closure_evidence_review_v1.md`

Additional inputs reviewed:

- `docs/reports/stage_13B_3_B_authorial_post_and_source_reference_runtime_specification_v1.md`
- `docs/reports/stage_13B_3_C_ws_5_legacy_runtime_handling_specification_v1.md`
- `docs/reports/stage_13B_3_F_ws_6_activity_projection_specification_v1.md`
- `docs/reports/stage_13B_4_B_foundation_trio_implementation_planning_v1.md`

Accepted upstream artifacts:

- `WS1_BOUNDED_COMPLETE` (C17)
- `FOUNDATION_TRIO_PLANNING_AUTHORIZED_WITH_CONDITIONS` (13B.5-A/B)
- `FT_X1_BOUNDARY_MATRIX_ACCEPTED_WITH_GAPS` (13B.5-C)
- `CANON_LOCK_ACCEPTED_WITH_CLARIFICATIONS` (13B.4-ZR)

FT-X2 scope rule:

- FT-X2 does **not** define primitives (FT-X1 owns P1–P6);
- FT-X2 does **not** define implementation;
- FT-X2 does **not** execute verification or BV;
- FT-X2 defines **what kinds of proof exist**, their authority, required chains, false proofs, and authorization-level evidence requirements.

Relationship to FT-X1:

```text
FT-X1 = WHAT primitives are and what they are NOT
FT-X2 = HOW proof is classified, chained, and required per authorization level
```

## 2. Evidence Taxonomy

Canonical evidence classes for Foundation Trio governance (nine classes).

| Class ID | Name | Definition | Typical artifacts |
| --- | --- | --- | --- |
| **E1** | Canon & Governance Lock | Accepted stage reports, status tokens, canon clarifications, and explicit authorization boundaries (Planning ≠ Implementation). | ZR, C17, 13B.5-A/B, FT-X1, slice authorization (C10-style), false-pass catalog adoption |
| **E2** | Bounded Slice Report | Per-slice implementation or review report with declared scope, carve-outs, PASS/FAIL, and forbidden scope verification. | FT-1A–1G reports; future FT-3x / FT-5x reports |
| **E3** | Runtime Write-Path Proof | Observable create/update/delete behavior with classified intent (retention, expression, legacy, propagation). | Service logic paths, intent classifiers, write-scope tests |
| **E4** | Runtime Read-Path & Visibility Proof | Who can read what on direct, profile, group, feed, saved, and activity surfaces. | `canViewPost`, publication filters, non-owner denial tests |
| **E5** | Primitive Classification Proof | Positive/negative mapping of runtime behavior to FT-X1 primitive IDs (P1–P6), not UI labels. | Role classifiers, visibility + type combinations, classification assertions |
| **E6** | Cross-Primitive Negative Proof | Anti-collapse evidence: primitives remain separable under stress (dedupe, bookmark, legacy, binding, activity). | FT-1D/1E/1F tests; future WS-3/WS-5 negative suites |
| **E7** | Automated Boundary Test | Targeted automated tests proving bounded slice claims; mocks prove boundaries only. | `request.test.ts` (Space/Reactions); slice-specific test plans |
| **E8** | Projection & Surface Carve-Out Proof | Derived read surfaces (feed, profile, group, activity, highlight, saved) with explicit legacy vs post-transition vs regression rules. | WS5-P4 matrix; WS-6 carve-outs; distinction rule outcomes |
| **E9** | Contract Inventory | OpenAPI, generated SDK/types, schema inventory — vocabulary and shape catalog only. | `docs/openapi/space.yaml`, generated repost DTOs |

### 2.1 Taxonomy design rules

| Rule | Statement |
| --- | --- |
| R1 | Every future authorization gate must cite at least one E-class per required claim. |
| R2 | No single E-class alone may establish a post-transition primitive (P4/P5) without E3+E5 (+ E6 for collapse risks). |
| R3 | E1 can block or permit **gates**; E1 cannot substitute for **runtime** establishment. |
| R4 | E8 is always **supporting** unless paired with E5 classification and WS-5 distinction rule. |
| R5 | E9 is **never sufficient** for primitive proof; schema presence is not semantics. |

### 2.2 Mapping to user example categories

| User example | FT-X2 class |
| --- | --- |
| Runtime Evidence | E3, E4, E5 (primary runtime family) |
| Boundary Evidence | E6 + FT-X1 collapse matrix reference |
| Distinction Evidence | E5 + E8 under WS5-P2 distinction rule |
| Classification Evidence | E5 (primitive ID assignment) |
| Verification Evidence | E7 + future WS-8 BV bundle (execution out of scope for C2) |
| Projection Evidence | E8 |
| Contract Evidence | E9 |
| Policy Evidence | E1 (governance locks) + E8 (visibility carve-outs when policy resolved) |

## 3. Evidence Authority Matrix

Authority levels:

| Level | Meaning |
| --- | --- |
| **PRIMARY** | May satisfy a claim when combined with required companion classes per spine chain. |
| **SUPPORTING** | Strengthens a claim; cannot close a gate alone. |
| **NEGATIVE-ONLY** | Proves what must **not** happen; cannot establish positive primitive alone. |
| **NEVER-SUFFICIENT** | Must not be cited as sole or decisive proof for the claim type. |

### 3.1 Class authority table

| Class | Authority (default) | UI copy | Projections | Generated DTO | OpenAPI | Tests | Migrations | Reports | Runtime behavior |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **E1** Canon & Governance Lock | PRIMARY for **gate decisions**; NEVER-SUFFICIENT for **primitive establishment** | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | PRIMARY (accepted reports only) | NEVER-SUFFICIENT |
| **E2** Bounded Slice Report | SUPPORTING | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | SUPPORTING (index) | NEVER-SUFFICIENT | PRIMARY (bundle index) | SUPPORTING (describes, does not replace E3) |
| **E3** Runtime Write-Path | PRIMARY (with E5) | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | SUPPORTING | NEGATIVE-ONLY (schema ≠ semantics) | SUPPORTING | PRIMARY |
| **E4** Runtime Read/Visibility | PRIMARY (with E5) | NEVER-SUFFICIENT alone | SUPPORTING | NEVER-SUFFICIENT | NEVER-SUFFICIENT | SUPPORTING | NEVER-SUFFICIENT | SUPPORTING | PRIMARY |
| **E5** Primitive Classification | PRIMARY (with E3/E4) | NEVER-SUFFICIENT | SUPPORTING (with rule) | NEVER-SUFFICIENT | NEVER-SUFFICIENT | PRIMARY (with runtime) | NEVER-SUFFICIENT | SUPPORTING | PRIMARY |
| **E6** Cross-Primitive Negative | PRIMARY for **negative claims**; NEVER-SUFFICIENT for **positive establishment** | NEVER-SUFFICIENT | SUPPORTING | NEGATIVE-ONLY (rename risk) | NEGATIVE-ONLY | PRIMARY (bounded) | NEGATIVE-ONLY | SUPPORTING | PRIMARY |
| **E7** Automated Boundary Test | PRIMARY for **bounded slice** (with E3); NEVER-SUFFICIENT for **Trio closure** | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | PRIMARY (bounded) | NEVER-SUFFICIENT | SUPPORTING | SUPPORTING |
| **E8** Projection Carve-Out | SUPPORTING | NEVER-SUFFICIENT | SUPPORTING (not authority) | SUPPORTING (inventory) | SUPPORTING | SUPPORTING | NEVER-SUFFICIENT | SUPPORTING | SUPPORTING |
| **E9** Contract Inventory | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEVER-SUFFICIENT | NEGATIVE-ONLY (drift risk) | NEVER-SUFFICIENT | NEVER-SUFFICIENT |

### 3.2 Cross-cutting never-sufficient list

The following are **never sufficient alone** for any Foundation Trio primitive establishment or readiness claim:

- UI copy / labels / success messages (WS-7)
- Feed/profile/group/activity empty or hidden state without distinction rule
- Generated DTO or OpenAPI type presence
- Migration file existence or schema rename
- Planning authorization token
- `WS1_BOUNDED_COMPLETE` token for WS-3, WS-5, Foundation Trio, or WS-2
- Mock/fixture rows without observable write/read path
- C13-style negative assertions without positive WS-3 runtime path (for P4/P5)
- Activity projection insert or filter change alone

## 4. Foundation Trio Evidence Spine

Spine format: ordered proof chain (structure only — **not executed** in this stage).

Legend:

- `[FILLED]` = chain slot has accepted evidence today
- `[STRUCTURE]` = chain slot defined; evidence pending
- `[BLOCKED]` = slot must not be filled with false evidence types

### 4.1 WS-1 Evidence Spine (retention) — `[FILLED]`

| Step | E-class | Requirement | Current anchor |
| --- | --- | --- | --- |
| 1 | E1 | Canon lock: WS-1 bounded scope; not Trio ready | C17, ZR, FT-X1 P1–P3 |
| 2 | E1 | Closure token `WS1_BOUNDED_COMPLETE` with explicit non-claims | C17 final tokens |
| 3 | E2 | Accepted slice report bundle FT-1A through FT-1G | C17 evidence matrix |
| 4 | E3 | Retention write: `private_repost_intent`; private repost carrier | FT-1A report |
| 5 | E4 | Owner access; non-owner absence; publication/profile exclusion | FT-1B report |
| 6 | E5 | P1 Private Repost; P2 Private Note (`private_note` role) | FT-X1 §6.1; FT-1A/1C |
| 7 | E6 | P3 bookmark separation; P1 binding ≠ P5; P6 WS-1-side distinction | FT-1D/1E/1F |
| 8 | E7 | Targeted automated tests per slice | C17 rollup; Z preflight commands |
| 9 | E8 | Activity no-pressure for new private retention (carve-out to WS-6) | FT-1G |
| 10 | E1 | Re-check: WS-1 ≠ Foundation Trio ready ≠ WS-2 | C17, FT-X1 §5 |

WS-1 spine status: `WS1_EVIDENCE_SPINE_FILLED`

### 4.2 WS-3 Evidence Spine (expression) — `[FILLED]`

| Step | E-class | Requirement | Status |
| --- | --- | --- | --- |
| 1 | E1 | 13B.3-B verification targets + WS3-P1–P5 planning guards adopted | `[FILLED]` governance |
| 2 | E1 | Per-slice WS-3 implementation authorization (C10-style) | `[FILLED]` — NR/PR/RR/LR slice acceptances; superseded at P4 full EST (`stage_13B_5_FE_P4_full_establishment_gate_v1.md` §7) |
| 3 | E1 | ZR lock: `postType: post` is not P4 proof | `[FILLED]` |
| 4 | E3 | Authorial Post write path with expression intent | `[FILLED]` — FT-3A + EST-TEST-1 E-P4-*; `stage_13B_5_FE_P4_full_establishment_gate_v1.md` |
| 5 | E5 | P4 established: primary Authorial Text; authorial independence | `[FILLED]` — FT-3C + E-P4-04; FE-P4 gate |
| 6 | E6 | P2, P6, legacy commentary ≠ Authorial Text; retention dedupe does not block P4 | `[FILLED]` — FT-1D proxy + dedupe tests; FE-P4 gate |
| 7 | E3+E5 | P5 optional 0..1 one-hop on P4 only | `[FILLED]` — FT-3B + E-P5-01/02/09; `stage_13B_5_FE_P5_full_establishment_gate_v1.md` |
| 8 | E6 | `repostTarget*` ≠ P5; Private Repost binding ≠ P5 | `[FILLED]` — FT-1F negatives + SR guards; FE-P4 gate |
| 9 | E4 | Public/group surface role proof (not feed UI design) | `[FILLED]` — FT-5D + FE-P4-SURF; FE-P4 gate |
| 10 | E7 | Positive + negative runtime tests (not negatives alone) | `[FILLED]` — EST-TEST-1 + 205 tests; FE-P4 gate |
| 11 | E2 | FT-3x implementation reports per authorized slice | `[FILLED]` — FT-3A/3C/3D/5D acceptances; FE-P4 gate |
| 12 | E8 | Profile/publication: legacy rows not counted as authorial (WS-5 handshake) | `[FILLED]` — FT-5D E8 + SURF-PUB-2; FE-P4 gate |
| 13a (P4) | E1 | P4 **`ESTABLISHED_BOUNDED`** independently verifiable (EBB gate; Canon v1 §4) | `[FILLED]` — `stage_13B_5_P4_establishment_bounded_reassessment_gate_v1.md` |
| 13a (P5) | E1 | P5 **`ESTABLISHED_BOUNDED`** independently verifiable (EBB gate; Canon v1 §4) | `[FILLED]` — `stage_13B_5_P5_establishment_bounded_reassessment_gate_v1.md` |
| 13b (P4) | E1 | P4 **`ESTABLISHED`** (full) independently verifiable (EST gate; Canon v1 §5) | `[FILLED]` — `stage_13B_5_FE_P4_full_establishment_gate_v1.md` |
| 13b (P5) | E1 | P5 **`ESTABLISHED`** (full) independently verifiable (EST gate; Canon v1 §5) | `[FILLED]` — `stage_13B_5_FE_P5_full_establishment_gate_v1.md` |

WS-3 spine status: `WS3_EVIDENCE_SPINE_FILLED` *(§4.2 steps 1–12 + 13a/13b (P4+P5) FILLED)*

### 4.3 WS-5 Evidence Spine (history) — `[FILLED]`

| Step | E-class | Requirement | Status |
| --- | --- | --- | --- |
| 1 | E1 | 13B.3-C + WS5-P1–P3 minimum + per-slice WS-5 authorization | `[FILLED]` — 13B.3-C; 13B.5-D; FT-5A–5D auth gates; `stage_13B_5_WS5_SPINE_ws5_evidence_spine_completion_gate_v1.md` |
| 2 | E5 | P6 taxonomy: `HISTORICAL_ARTIFACT_ONLY` classes | `[FILLED]` — FT-5A + `stage_13B_5_FR_ft_5A_implementation_review_and_acceptance_v1.md`; `legacyTaxonomy.test.ts` |
| 3 | E2 | WS5-P2 distinction rule — reviewer can classify legacy vs target vs regression | `[FILLED]` — FT-5B + `stage_13B_5_HR_ft_5B_implementation_review_and_acceptance_v1.md`; `legacyDistinction.test.ts` |
| 4 | E6 | WS5-P3 forbidden transformations (no hide/delete/auto-convert) | `[FILLED]` — FT-5C + `stage_13B_5_JR_ft_5C_implementation_review_and_acceptance_v1.md`; `forbiddenTransformations.test.ts` |
| 5 | E8 | WS5-P4 per-surface legacy matrix (feed/group/profile/activity/highlight/saved/contracts) | `[FILLED]` — FT-5D + `stage_13B_5_LR_ft_5D_implementation_review_and_acceptance_v1.md`; `perSurfaceLegacyMatrix.test.ts`; FE-P4-SURF HTTP |
| 6 | E4+E8 | Legacy visibility carve-outs per resolved or carved policy gates | `[FILLED]` — VIS (`stage_13B_5_VIS_visibility_policy_gate_v1.md`); E4 (`stage_13B_5_E4_surface_role_gate_v1.md`); carve VIS-N1 deferred per WS5-SPINE gate |
| 7 | E6 | Legacy ≠ P1/P4/P5; bookmark on legacy ≠ identity merge | `[FILLED]` — FT-1F; EST-TEST-1 E-AC-05; domain guards |
| 8 | E7 | Distinction + forbidden-transformation test suite | `[FILLED]` — 58 domain tests + `request.test` legacy paths |
| 9 | E2 | FT-5x implementation reports per authorized slice | `[FILLED]` — FR, HR, JR, LR acceptances |
| 10 | E1 | WS-5 full complete ≠ FT-1F WS-1-side only | `[FILLED]` distinction |

WS-5 spine status: `WS5_EVIDENCE_SPINE_FILLED` *(§4.3 steps 1–9 + step 10)*

### 4.4 Foundation Trio rollup spine — `[FILLED]`

| Step | Requirement | Status |
| --- | --- | --- |
| 1 | E1: FT-X1 accepted + false-pass catalog adopted as blocking policy | `[FILLED]` — `stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md`; 13B.5-A/B §4; `stage_13B_5_TRIO_ROLLUP_trio_rollup_completion_gate_v1.md` |
| 2 | WS-1 spine `[FILLED]` | `[FILLED]` — §4.1; C17; FT-1A–1G |
| 3 | WS-3 spine all required steps `[FILLED]` including **13a** and **13b** (full ESTABLISHED) for P4 and P5 independently | `[FILLED]` — `stage_13B_5_FE_P4_full_establishment_gate_v1.md`; `stage_13B_5_FE_P5_full_establishment_gate_v1.md`; FE-P4/FE-P5 APPLY; EST-TEST-1 |
| 4 | WS-5 spine all required steps `[FILLED]` including WS5-P4 | `[FILLED]` — `WS5_SPINE_COMPLETION_GRANTED`; `stage_13B_5_WS5_SPINE_APPLY_ft_x2_ws5_spine_display_patch_v1.md` |
| 5 | E6: Trio-level negative rollup — no FT-X1 collapse edge unguarded | `[FILLED]` — FT-X1 §5; EST-TEST-1 E-AC-*; `stage_13B_5_foundation_trio_closure_acceptance_gate_v1.md`; TRIO-ROLLUP gate |
| 6 | E8: No `BV_FAIL_AMBIGUITY` on repost-shaped artifacts (13B.4-B) | `[FILLED]` — `WS8_BV_EXECUTION_PASS`; `stage_13B_5_WS8_BV_EXEC_ws8_bv_execution_gate_v1.md`; `stage_13B_5_BV_ambiguity_gate_v1.md` |
| 7 | E2: FT-X3 Trio Closure Gate report accepted | `[FILLED]` — `stage_13B_5_Z_ft_x3_foundation_trio_closure_authorization_gate_v1.md`; `FT_X3_TRIO_ROLLUP_READY_TIER_ACCEPTED` (rollup tier; **≠** operational closure) |
| 8 | E1: `FOUNDATION_TRIO_READY` token — explicit non-claim of WS-2 | `[FILLED]` — `stage_13B_5_foundation_trio_ready_gate_v3.md` (`FOUNDATION_TRIO_READY_GRANTED`); **`ws2_authorized` remains FALSE**; literals unchanged (EST-L2) |

Foundation Trio spine status: `TRIO_EVIDENCE_SPINE_FILLED` *(§4.4 steps **1–8** FILLED at governance display; **`foundation_trio_ready: TRUE`** program token; **`ws2_authorized: TRUE`** @ WS2-AUTH-APPLY — distinct from Trio Ready)*

### 4.5 Per-primitive evidence chain index (references FT-X1)

| Primitive | Spine workstream | Chain summary | Tier today |
| --- | --- | --- | --- |
| P1 Private Repost | WS-1 | E1→E2(FT-1A,B,D,G)→E3→E4→E5→E6→E7 | ESTABLISHED_BOUNDED |
| P2 Private Note | WS-1 | E2(FT-1C)→E3→E5→E6→E7 | ESTABLISHED_BOUNDED |
| P3 Bookmark | WS-1 | E2(FT-1E)→E3(Reactions)→E6→E7 | ESTABLISHED_BOUNDED |
| P4 Authorial Post | WS-3 | E1(13B.3-B)→E1(slice auth)→E3→E5→E6→E4→E7→E2→13a→13b | **`ESTABLISHED`** *(current, full)* — 13a + **13b (P4)** FILLED |
| P5 Source Reference | WS-3 | E1→E3(on P4)→E5→E6→E7→13a→13b (positives required) | **`ESTABLISHED`** *(current, full)* — 13a + **13b (P5)** FILLED |
| P6 Legacy Row | WS-5 | E1→E5→E2(FT-5x)→E6→E8→E7 | CLASSIFIED_ONLY — WS-5 spine **FILLED** (P6 ≠ WS-5 complete) |

Detailed may/must-not evidence per primitive: **FT-X1 §6.1** (not repeated here).

### 4.6 Canon → Workstream → Observable Proof index (FT-X2 deliverable)

Planning artifact from 13B.4-B FT-X2 slice:

```text
Canon (13B.2 frozen doctrine + ZR locks)
  -> Workstream specification (13B.3-A/B/C/F)
    -> Planning guards (13B.5-A/B WS3-P*, WS5-P*)
      -> FT-X1 primitive boundaries (P1-P6)
        -> Bounded slice authorization (per FT-* gate)
          -> Runtime write/read proof (E3, E4, E5)
            -> Cross-primitive negative proof (E6)
              -> Automated boundary tests (E7)
                -> Projection carve-out (E8) where surfaces involved
                  -> Slice report acceptance (E2)
                    -> Workstream spine step filled
                      -> Trio rollup (§4.4)
                        -> FT-X3 closure gate (future)
                          -> WS-8 BV bundle (execution future; out of C2 scope)
```

## 5. False Evidence Catalog

| ID | False evidence | Why invalid | Reviewer detection signal |
| --- | --- | --- | --- |
| F1 | `WS1_BOUNDED_COMPLETE` cited for Foundation Trio or WS-2 readiness | WS-1 is retention side only | Closure report without WS-3/5 spine fill |
| F2 | `FOUNDATION_TRIO_PLANNING_AUTHORIZED` cited for implementation | Planning ≠ implementation | Coding authorized without C10-style slice gate |
| F3 | `postType: post` create cited as Authorial Post proof | ZR: generic carrier only | No authorial independence or Authorial Text path |
| F4 | `repostTarget*` field rename cited as Source Reference | Propagation binding ≠ P5 | DTO/SQL alias without separate P5 write path |
| F5 | OpenAPI or generated SDK type cited as primitive establishment | E9 never sufficient | Contract-only bundle |
| F6 | UI label / success copy change cited as runtime proof | WS-7 vocabulary ≠ behavior | Diff is copy-only |
| F7 | Saved/bookmark UI cited as Private Repost inventory | P3 ≠ P1 | Reactions hydration = retention proof |
| F8 | Activity insert or filter cited as primitive authority | E8 not authority alone | Evidence is activity-only |
| F9 | Empty feed/profile/activity cited as alignment | May be hide/delete false pass | No WS5-P2 distinction rule or taxonomy |
| F10 | Migration or schema rename cited as semantics proof | E9 negative-only | Migration without E3/E5 |
| F11 | Mock/fixture row cited as WS-3/WS-5 product readiness | E7 bounded only | No observable service path |
| F12 | Legacy row cited as P4 or P5 proof | P6 historical only | Profile counts legacy as authorial |
| F13 | Legacy `repostTarget*` cited as Source Reference | Historical binding | SR proof cites legacy only |
| F14 | Private Note or repost commentary cited as Authorial Text | Retention/propagation ≠ expression | Shared text field |
| F15 | FT-1F distinction cited as full WS-5 complete | WS-1-side only | Missing WS5-P4 matrix |
| F16 | C13 negative-only tests cited as WS-3 complete | Negatives ≠ positive path | No P4 write establishment |
| F17 | Public/group propagation preserved cited as doctrine alignment | WS-2 debt | Propagation path cited as success |
| F18 | FT-X1 or FT-X2 acceptance cited as implementation authorization | Boundary/spine ≠ coding | `implementation_authorized` overridden |
| F19 | Projection-only behavior change cited as write-path proof | Read ≠ write semantics | No E3 for claimed primitive |
| F20 | `PARTIAL TECHNICAL SHAPE ONLY` overread as WS-3 runtime | ZR clarification | Inventory column read as establishment |

## 6. Authorization Evidence Model

Four authorization levels — **must not be mixed**.

### 6.1 Planning Authorization

Purpose: permit governance-level WS-3/WS-5 planning and boundary artifacts only.

| Required evidence | E-class |
| --- | --- |
| `WS1_BOUNDED_COMPLETE` (C17) | E1 |
| Z preflight + ZR canon lock | E1 |
| `FOUNDATION_TRIO_PLANNING_AUTHORIZED_WITH_CONDITIONS` | E1 |
| 13B.5-A/B joint planning + false-pass catalog adopted | E1, E2 (planning reports) |
| FT-X1 boundary matrix accepted | E1 |
| FT-X2 evidence spine accepted (this stage) | E1 |

Must **not** suffice:

- E3–E6 for WS-3 or WS-5 positive establishment;
- E9 contract inventory;
- any `implementation_authorized: TRUE` token;
- `foundation_trio_ready: TRUE`.

Current status: `PLANNING_AUTHORIZATION_EVIDENCE_SATISFIED` (already granted in 13B.5-A/B).

### 6.2 Implementation Authorization (per bounded slice)

Purpose: permit coding for an explicitly named FT-* slice only.

| Required evidence | E-class |
| --- | --- |
| Explicit slice authorization report (C10-style pattern) | E1 |
| FT-X1 positive/negative requirements for touched primitives | E1 (reference) |
| FT-X2 spine: prior slice steps in chain PASS or `[FILLED]` | E1, E2 |
| WS-3 slices: WS3-P1/P2/P3/P5 + minimum WS5-P1/P2/P3/P4 handshake | E1 |
| WS-5 slices: taxonomy + distinction + forbidden transforms + policy inventory | E1 |
| Declared E7 test plan for the slice | E7 (plan only at auth gate) |
| False-pass catalog as blocking policy | E1 |

Must **not** suffice:

- Planning authorization alone;
- FT-X1 or FT-X2 acceptance alone;
- E9 alone;
- E8 without E5 classification;
- WS-1 closure for WS-3 or WS-5 slices.

Current status: `IMPLEMENTATION_AUTHORIZATION_EVIDENCE_NOT_SATISFIED` — no WS-3/WS-5 slice gate issued.

### 6.3 Foundation Trio Readiness

Purpose: claim retention, expression, and history are **independently provable** before FT-X3 / WS-2 discussion.

| Required evidence | E-class |
| --- | --- |
| WS-1 spine §4.1 fully `[FILLED]` | E1–E7 |
| WS-3 spine §4.2 fully `[FILLED]` at establishment tier; **P4 and P5 independently `ESTABLISHED` (full)** — step **13b** | E3, E5, E6, E7 |
| WS-5 spine §4.3 fully `[FILLED]` including WS5-P4 | E5, E6, E8, E7 |
| Trio rollup §4.4 steps 1–7 complete (step **8** separate Ready token) | E6, E8, E2 |
| FT-X3 Trio Closure Gate accepted | E1, E2 |
| No open Trio-scope negative blockers (13B.4-B rollup criteria) | E6 |
| No `BV_FAIL_AMBIGUITY` on repost-shaped artifacts | E8 + E5 |

**Ready vs bounded (Canon v1 — explicit):**

- **`ESTABLISHED_BOUNDED`** (spine step **13a**) is **not sufficient** for Foundation Trio Ready.
- Ready requires **P4 `ESTABLISHED` (full)** and **P5 `ESTABLISHED` (full)** — not bounded tier alone.
- **`foundation_trio_accepted`** (bounded layer) ≠ **`foundation_trio_ready`**.

Must **not** suffice:

- WS-1 alone;
- WS-3 without WS-5 distinction matrix;
- WS-5 taxonomy-only without P4 positive path;
- UI bundle or E9 bundle;
- hiding legacy rows;
- **P4 or P5 `ESTABLISHED_BOUNDED` alone** (or step 13a alone);
- **HB gates cleared** without full establishment for P4/P5.

Current status: `FOUNDATION_TRIO_READINESS_EVIDENCE_SATISFIED` — post `stage_13B_5_foundation_trio_ready_gate_v3.md` + Ready-APPLY; **WS-2** §6.4 **`[FILLED]`** — `WS2_AUTHORIZATION_EVIDENCE_SATISFIED` post `stage_13B_5_WS2_AUTH_APPLY_display_and_token_patch_v1.md` (WS2-AUTH-APPLY).

### 6.4 WS-2 Authorization

Purpose: permit public/group repost elimination workstream entry.

| Required evidence | E-class |
| --- | --- |
| Foundation Trio Readiness (§6.3) complete | All applicable |
| FT-X3 accepted with explicit non-premature WS-2 guard | E1, E2 |
| E3 proof path for elimination/replacement of public/group propagation write | E3, E5 |
| E6: preserved propagation not treated as aligned doctrine | E6 |
| Separate `13B.4-C` WS-2 authorization issued | E1 |
| No ambiguous repost-shaped artifact on visible surfaces | E8, E5 |

Must **not** suffice:

- `WS1_BOUNDED_COMPLETE`;
- partial WS-3;
- legacy hide/delete;
- copy-only WS-7;
- planning or implementation tokens from WS-1/WS-3 planning only.

Current status: **`[FILLED]`** — **`WS2_AUTHORIZATION_EVIDENCE_SATISFIED`** (governance display @ WS2-AUTH-APPLY).

| Evidence item | Status | Source |
| --- | --- | --- |
| Foundation Trio Readiness (§6.3) | `[FILLED]` | Ready v3 + TRIO-ROLLUP-APPLY |
| FT-X3 + non-premature WS-2 guard | `[FILLED]` | Z gate; BV-EXEC; AUTHORIZATION-GATE |
| E3: propagation write eliminated | `[FILLED]` | `WS2-E3-WRITE`; commit `d8fc0b8` |
| E6: preserved propagation not doctrine | `[FILLED]` | `WS2-E6-READ-PUB/GRP/ACTIVITY`; `WS2-E7-COPY` |
| Separate WS-2 authorization issued | `[FILLED]` | `stage_13B_5_WS2_AUTHORIZATION_GATE_v1.md` (`WS2_AUTHORIZED_GRANTED`) |
| No `BV_FAIL_AMBIGUITY` @ WS-2 tier | `[FILLED]` | `stage_13B_5_WS2_BV_EXEC_ws2_boundary_verification_execution_gate_v1.md` |

Program display (docs only): **`ws2_authorized: TRUE`**; **`ws2_authorization_granted: TRUE`**; **`ws2_bv_execution_pass: TRUE`**. **Non-grants preserved:** `implementation_authorized_global: FALSE`; CO-13/CO-S12 literals **FALSE**; no runtime/OpenAPI/SDK/DB change @ APPLY.

### 6.5 Authorization level separation matrix

| Level | FT-X1 needed | FT-X2 needed | WS-1 spine | WS-3 spine | WS-5 spine | BV execution |
| --- | --- | --- | --- | --- | --- | --- |
| Planning | YES | YES (this stage) | FILLED | STRUCTURE | STRUCTURE | NO |
| Implementation (slice) | YES | YES | FILLED (if WS-1 slice) | Per slice | Per slice | NO |
| Foundation Trio Ready | YES | YES | FILLED | FILLED | FILLED | FILLED (WS8-BV-EXEC) |
| WS-2 | YES | YES | FILLED | FILLED | FILLED | Required before WS-2 claim |

## 7. Completeness Review

### 7.1 Is FT-X2 sufficient as an artifact?

| Check | Result |
| --- | --- |
| Evidence taxonomy defined (canonical classes) | PASS |
| Authority matrix with never-sufficient rules | PASS |
| WS-1 / WS-3 / WS-5 / Trio spines defined | PASS |
| False evidence catalog (≥12 cases) | PASS (20 items) |
| Authorization evidence model with four separated levels | PASS |
| FT-X1 linkage without primitive redefinition | PASS |
| Verification/BV explicitly out of scope | PASS |

FT-X2 artifact status: `EVIDENCE_SPINE_COMPLETE`

### 7.2 Is FT-X1 + FT-X2 sufficient for future authorization gates?

Answer:

`YES_AS_AUTHORIZATION_FRAMEWORK_PRECONDITION_NOT_AS_SOLE_GATE`

| Gate type | FT-X1 + FT-X2 sufficient? | Still required separately |
| --- | --- | --- |
| Planning authorization | YES (already satisfied) | — |
| Per-slice implementation authorization | PARTIAL — framework only | C10-style slice report; E3–E7 execution; WS-3/WS-5 policy resolution |
| Foundation Trio readiness | **SATISFIED** at governance display (Ready v3 + APPLY) | **WS-2** gate separate (§6.4) |
| WS-2 authorization | **SATISFIED** @ governance display (AUTH-GATE + AUTH-APPLY) | Runtime HEAD `ca0f318`; closure review optional |

### 7.3 Documented gaps (evidence infrastructure, not taxonomy gaps)

| Gap ID | Gap | Blocks FT-X2 acceptance? | Blocks future impl gates? |
| --- | --- | --- | --- |
| X2-G1 | WS-3 spine slots empty (P4/P5 full EST not granted) | P4 and P5 **13a + 13b FILLED**; WS-3 §4.2 establishment steps FILLED | **CLOSED** (FE-P5-APPLY) |
| X2-G2 | WS-5 full spine empty beyond FT-1F (WS5-P4, distinction rule) | WS-5 §4.3 **FILLED**; `WS5_EVIDENCE_SPINE_FILLED` | **CLOSED** (WS5-SPINE-APPLY) |
| X2-G3 | FT-X3 Trio Closure Gate not authored | §4.4 **steps 1–8 FILLED**; Ready v3 + APPLY | **CLOSED** for Foundation Trio Ready display |
| X2-G4 | WS-8 BV bundle not executed | `WS8_BV_EXECUTION_PASS`; §4.4 step **6 FILLED** | **CLOSED** (WS8-BV-EXEC) |
| X2-G5 | WS-3/WS-5 visibility policy gates open | NO for C2 | YES for impl authorization |
| X2-G6 | Per-slice E2 reports for FT-3x/FT-5x do not exist yet | NO | YES per slice |

### 7.4 FT-X1 G6 closure

FT-X1 documented gap G6 (`FT-X2 Foundation Evidence Spine not yet authored`) is **closed** by this report.

## 8. Verdict

Final verdict:

`FT_X2_EVIDENCE_SPINE_ACCEPTED_WITH_GAPS`

Why not `FT_X2_EVIDENCE_SPINE_REVIEW_REQUIRED`:

- taxonomy and authority model are consistent with FT-X1, ZR, C17, and 13B.5-A/B;
- no canonical contradiction in evidence classification;
- WS-1 spine is reproducible from accepted reports.

Why not `FT_X2_EVIDENCE_SPINE_ACCEPTED` without qualification:

- All spine and rollup slots **FILLED** including §4.4 step **8** (post Ready-APPLY); **`foundation_trio_ready`** program token **TRUE** at governance display;
- **WS-2 authorization** §6.4 display **`[FILLED]`** @ WS2-AUTH-APPLY — **≠** FT-X2 spine re-acceptance; **≠** literal flip.

Acceptance scope:

- FT-X2 is accepted as the canonical Foundation Evidence Spine for governance;
- acceptance enables use in Stage 13B.5-D and future per-slice authorization gates;
- acceptance does not authorize implementation, BV execution, Foundation Trio readiness, or WS-2.

## 9. Next Safe Step

Recommended next safe stage:

`Stage 13B.5-D — WS-3 / WS-5 Planning Acceptance & Implementation Cutline Authorization`

Scope:

- governance/authorization only;
- evaluate 13B.5-A/B planning, FT-X1 matrix, and FT-X2 spine together;
- decide whether a **first bounded** WS-3 or WS-5 implementation slice may be proposed for a **later** gate;
- maintain `implementation_authorized: FALSE` unless a separate slice authorization explicitly passes.

Not safe next:

- WS-3 or WS-5 implementation;
- BV execution;
- FT-X3 Trio closure claim;
- WS-2 authorization;
- Foundation Trio readiness claim;
- using empty spine slots as if filled.

Future stages (after D, when spines fill):

- `FT-X3 — Foundation Trio Closure Gate` (requires observable proof in WS-3/WS-5 spines);
- `WS-8 — BV evidence bundle` (execution stage, not C2).

## 10. Final Tokens

- `stage_13B_5_C2_status: FT_X2_FOUNDATION_EVIDENCE_SPINE_AUTHORIZATION_COMPLETE`
- `stage_13B_5_C2_execution_mode: GOVERNANCE_AND_EVIDENCE_SPINE_AUTHORIZATION_ONLY`
- `stage_13B_5_C2_ft_x1_carried_forward: FT_X1_BOUNDARY_MATRIX_ACCEPTED_WITH_GAPS`
- `stage_13B_5_C2_ft_x2_verdict: FT_X2_EVIDENCE_SPINE_ACCEPTED_WITH_GAPS`
- `stage_13B_5_C2_evidence_spine_complete: TRUE`
- `stage_13B_5_C2_authorization_framework_ready: TRUE`
- `stage_13B_5_C2_implementation_authorized: FALSE`
- `stage_13B_5_C2_foundation_trio_ready: TRUE`
- `stage_13B_5_C2_ws2_authorized: TRUE`
- `stage_13B_5_C2_ws2_authorization_evidence: WS2_AUTHORIZATION_EVIDENCE_SATISFIED`
- `stage_13B_5_C2_ws2_bv_execution_pass: TRUE`
- `stage_13B_5_C2_ws1_evidence_spine_status: WS1_EVIDENCE_SPINE_FILLED`
- `stage_13B_5_C2_ws3_evidence_spine_status: WS3_EVIDENCE_SPINE_FILLED`
- `stage_13B_5_C2_ws5_evidence_spine_status: WS5_EVIDENCE_SPINE_FILLED`
- `stage_13B_5_C2_trio_evidence_spine_status: TRIO_EVIDENCE_SPINE_FILLED`
- `stage_13B_5_C2_trio_rollup_step_8_status: FILLED`
- `stage_13B_5_C2_ws1_evidence_tier: ESTABLISHED_BOUNDED`
- `stage_13B_5_C2_ws3_evidence_tier: ESTABLISHED` *(P4+P5 full; display — governance gates FE-P4/FE-P5)*
- `stage_13B_5_C2_ws5_evidence_tier: ESTABLISHED` *(WS-5 spine FILLED — display; governance `stage_13B_5_WS5_SPINE_ws5_evidence_spine_completion_gate_v1.md`)*
- `stage_13B_5_C2_authorial_post_runtime_primitive_established: FALSE`
- `stage_13B_5_C2_source_reference_runtime_primitive_established: FALSE`
- `stage_13B_5_C2_legacy_row_status: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_5_C2_ws1_bounded_complete_carried_forward: TRUE`
- `stage_13B_5_C2_canon_lock_carried_forward: CANON_LOCK_ACCEPTED_WITH_CLARIFICATIONS`
- `stage_13B_5_C2_planning_authorized_carried_forward: FOUNDATION_TRIO_PLANNING_AUTHORIZED_WITH_CONDITIONS`
- `stage_13B_5_C2_documented_gaps: X2-G5,X2-G6` *(X2-G1..G4 closed through Ready-APPLY; WS-2 §6.4 closed @ WS2-AUTH-APPLY)*
- `stage_13B_5_C2_ft_x1_g6_closed: TRUE`
- `stage_13B_5_C2_next_safe_step: STAGE_13B_5_WS2_CLOSURE_REVIEW`

## 11. Execution Summary

| Deliverable | Path |
| --- | --- |
| FT-X2 Foundation Evidence Spine report | `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` |

Invariant reminder:

```text
Evidence Spine ≠ Implementation Authorization
Implementation Authorization ≠ Foundation Trio Ready
Foundation Trio Ready ≠ WS-2 Authorized
```

Relationship to FT-X1:

```text
FT-X1 defines primitive boundaries and per-primitive may/must-not evidence (§6.1)
FT-X2 defines evidence classes, authority, spines, false evidence, and authorization-level requirements
Future gates must cite both; neither alone authorizes implementation
```
