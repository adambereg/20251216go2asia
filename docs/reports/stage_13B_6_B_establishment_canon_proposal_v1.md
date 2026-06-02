# Stage 13B.6-B — Establishment Canon Proposal

**Document class:** `CANON_PROPOSAL_ONLY`  
**Not:** adoption · canon lock · FT-X1/C2/FT-X3 amendment · implementation · establishment verdict · Ready Gate · WS-2 gate

**Inherited from 13B.6-A (unchanged by this proposal until 13B.6-C):**

| 13B.6-A outcome | Value |
| --- | --- |
| Term **ESTABLISHED** | **REQUIRED** |
| Primary direction | **ADOPT_DIRECTION_C** (`ESTABLISHED_BOUNDED` for P4/P5) |
| Full tier criteria | **DIR-A** (governance checklist) |
| State model | **MIXED-STATE** (governance-primary, runtime-corroborated) |

**Scope lock:** This proposal **does not** edit `stage_13B_5_C_*` (FT-X1), `stage_13B_5_C2_*` (FT-X2), FT-X3 reports, code, literals, or program tokens. §8–9 describe **future amendments** as **draft text for review**.

---

## 1. Inputs Reviewed

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_6_A_establishment_definition_and_adoption_gate_v1.md` | **Primary** — adoption direction; candidate definitions |
| `docs/reports/stage_13B_6_establishment_canon_synchronization_v1.md` | Problem statement; migration context |
| `docs/reports/stage_13B_5_p4_p5_primitive_establishment_review_v1.md` | P4/P5 operational tiers |
| `docs/reports/stage_13B_5_foundation_trio_ready_gate_v1.md` | Ready deferral; blockers |
| `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` | FT-X1 §4.5, §6.1 |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | FT-X2 §4.2, §6.3 |

**Program tokens (proposal does not change):**

| Token | Current value |
| --- | --- |
| `foundation_trio_accepted` | TRUE |
| `foundation_trio_ready` | FALSE |
| `ws2_authorized` | FALSE |
| P4/P5 canon tier (FT-X1 §4.5) | `NOT_ESTABLISHED` |

---

## 2. Multi-Agent Execution Review

| # | Agent | Finding IDs | Disposition |
| --- | --- | --- | --- |
| 1 | **AI Program Director / Project Orchestrator** | PROP-ORCH-1..7 | PASS |
| 2 | **Slice Strategist** | PROP-STRAT-1..6 | PASS |
| 3 | **Runtime Governance Architect** | PROP-GOV-1..8 | PASS |
| 4 | **Runtime Validation Agent** | PROP-VAL-1..6 | PASS |
| 5 | **Backend Developer (review mode)** | PROP-BE-1..7 | PASS |
| 6 | **QA Agent** | PROP-QA-1..6 | PASS |
| 7 | **Technical Canon Writer** | PROP-CANON-1..8 | PASS |

### 2.1 Per-agent findings (detail)

**1 — AI Program Director / Project Orchestrator**

- **PROP-ORCH-1:** **13B.6-A** provides sufficient direction — this proposal **instantiates** DIR-C + DIR-A into **actionable canon text**.
- **PROP-ORCH-2:** **Candidate canon** (§11) is the **single integrative artifact** for stakeholder review before **13B.6-C**.
- **PROP-ORCH-3:** **Migration** must be **phased** — glossary lock → tier reassessment → optional literal policy slice → Ready re-run — **no big-bang token flip**.
- **PROP-ORCH-4:** **P4/P5 likely satisfy ESTABLISHED_BOUNDED criteria** on evidence today — **reassessment gate** after lock, **not** in this proposal.
- **PROP-ORCH-5:** **ADOPT_WITH_CONDITIONS** recommended — conditions are **13B.6-C lock mechanics**, not rejection of model.
- **PROP-ORCH-6:** **13B.6-C: YES** — without lock, proposal remains **non-operative**.
- **PROP-ORCH-7:** **WS-2 / ready** stay **downstream** — proposal preserves invariants.

**2 — Slice Strategist**

- **PROP-STRAT-1:** **Glossary** must include **ESTABLISHED_BOUNDED** explicitly — fixes P1–P3 vs P4/P5 **asymmetry**.
- **PROP-STRAT-2:** **IMPLEMENTED → ACCEPTED → ESTABLISHED_BOUNDED → ESTABLISHED → READY** is the **program slice order** for post-transition primitives.
- **PROP-STRAT-3:** **FT-X3 token rename** (`*_ESTABLISHED_WITH_CONDITIONS` → `*_ESTABLISHED_BOUNDED`) belongs in **migration Phase 1** documentation reconciliation.
- **PROP-STRAT-4:** **Full ESTABLISHED** for P4/P5 still requires **WS-3 spine FILLED** at establishment tier — bounded tier **does not** shortcut spine.
- **PROP-STRAT-5:** After lock: **P4/P5 Bounded Establishment Gate** before **Full Establishment Gate** before **Ready Gate**.
- **PROP-STRAT-6:** **Reject** interpreting merge-to-main as **ACCEPTED** without PJR/gate record.

**3 — Runtime Governance Architect**

- **PROP-GOV-1:** **ESTABLISHED_BOUNDED** governance requirements must cite **named gates** (13B.5 slice acceptances + closure acceptance bounded layer).
- **PROP-GOV-2:** **ESTABLISHED** governance requirements = **Establishment Gate PASS** + **EB checklist cleared** + **C2 step 13 satisfied per primitive**.
- **PROP-GOV-3:** **E1 never sufficient alone** and **E6 never sufficient alone for positive tier** — **preserved** in both criteria blocks.
- **PROP-GOV-4:** **FT-X2 §6.3** proposal: Ready requires **P4 and P5 full ESTABLISHED** (not bounded) + existing WS-1/WS-5/spine rules.
- **PROP-GOV-5:** **Literal policy:** `is*RuntimePrimitiveEstablished` may remain **`false` at ESTABLISHED_BOUNDED**; may become **`true` only at full ESTABLISHED** after **Literal Policy Authorization** sub-slice.
- **PROP-GOV-6:** **isFoundationTrioReady** remains **`false` until Ready Gate** — unrelated to per-primitive establishment tiers except as rollup prerequisite.
- **PROP-GOV-7:** **FT-X1 §6.1** proposal replaces stale “until WS-3 authorization” with **tiered may-count tables**.
- **PROP-GOV-8:** Proposal **rejects** governance verdict from CI green alone.

**4 — Runtime Validation Agent**

- **PROP-VAL-1:** **ESTABLISHED_BOUNDED** evidence: current **176/176** + positive HTTP paths + persistence tests — **corroboration sufficient** for **bounded tier reassessment** post-lock.
- **PROP-VAL-2:** **ESTABLISHED** evidence: requires **new establishment-tier test contract** in proposal — **EST-TEST-1** (named suite or tag convention).
- **PROP-VAL-3:** **Classification/boundary proof** maps to **IMPLEMENTED/ACCEPTED corroboration**, not **ESTABLISHED**.
- **PROP-VAL-4:** Validation agent role post-lock: **certify checklist rows** per gate, not invent tiers.
- **PROP-VAL-5:** **Forbidden shortcuts** list must appear in **QA gate templates**.
- **PROP-VAL-6:** No test or code changes in proposal stage — **correct**.

**5 — Backend Developer (review mode)**

- **PROP-BE-1:** **CO-13 / CO-S12** semantics under proposal: **`false` = “full runtime primitive establishment not governance-granted”** — compatible with **ESTABLISHED_BOUNDED**.
- **PROP-BE-2:** Flipping literals to **`true`** is **implementation authorization**, not **canon lock** — separate slice after full **ESTABLISHED** verdict.
- **PROP-BE-3:** **`isFoundationTrioReady`** = Trio rollup only; **decoupled** from `isAuthorialPostRuntimePrimitiveEstablished`.
- **PROP-BE-4:** **`isSourceReferenceEstablished`** in save/publish module = **adjunct proof flag**, not **P5 ESTABLISHED** — proposal should **rename or document** in 13B.6-C follow-up (open note).
- **PROP-BE-5:** Runtime modules already separate **boundary proof** vs **primitive established** — proposal **aligns vocabulary** with code structure.
- **PROP-BE-6:** **MIXED-STATE:** governance gate PASS is **necessary**; runtime paths are **necessary** for both tiers; literals **`true`** is **optional corroboration** at full tier only.
- **PROP-BE-7:** No code edits in proposal — **correct**.

**6 — QA Agent**

- **PROP-QA-1:** **Gate templates** (bounded / full / ready) are **required deliverable** of adoption — included in §11 Candidate Canon.
- **PROP-QA-2:** **ACCEPTED** definition must reference **PJR/RR/acceptance gate PASS** — stops “merged = accepted” confusion.
- **PROP-QA-3:** **AI safety:** glossary gives agents **forbidden promotion paths** — **1–5y** value **high** if locked.
- **PROP-QA-4:** **ADOPT_WITH_CONDITIONS:** condition = **publish reconciliation table** for FT-X3 historical tokens in lock stage.
- **PROP-QA-5:** QA will not write “ESTABLISHED” in reports for P4/P5 until **post-lock reassessment** verdict.
- **PROP-QA-6:** **ESTABLISHED_BOUNDED** reports should use **new label** after lock — not “bounded implementation” alone.

**7 — Technical Canon Writer**

- **PROP-CANON-1:** **Candidate Canon** (§11) is **normative draft** — **13B.6-C** decides **ADOPT / ADOPT_WITH_CONDITIONS / REJECT** of proposal text.
- **PROP-CANON-2:** **FT-X1 §4.5** proposal adds **`ESTABLISHED_BOUNDED`** row for P4/P5 — **does not** auto-promote them on proposal publish.
- **PROP-CANON-3:** **FT-X2 step 13** proposal splits into **13a bounded token** and **13b full ESTABLISHED** — removes ambiguous single boolean.
- **PROP-CANON-4:** **P6 `CLASSIFIED_ONLY`** unchanged — outside establishment ladder terminus.
- **PROP-CANON-5:** **Invariants block** (§6) is **binding** on all future gates.
- **PROP-CANON-6:** **ADOPT_WITH_CONDITIONS** — recommend; conditions are **procedural**, not semantic weakening.
- **PROP-CANON-7:** **13B.6-C: YES** — mandatory for operative canon.
- **PROP-CANON-8:** **Proposal ≠ P4/P5 ESTABLISHED verdict** — honored.

### 2.2 Disagreements

| Topic | A | B | Resolution |
| --- | --- | --- | --- |
| Adoption enum | ORCH/QA: ADOPT_WITH_CONDITIONS | CANON: could be ADOPT_PROPOSAL | **ADOPT_WITH_CONDITIONS** — lock-stage conditions only |
| P4/P5 pass bounded today? | ORCH/VAL: likely yes | GOV: reassessment gate required | **Hint only** — no verdict in proposal |
| Rename `isSourceReferenceEstablished` | BE: document/rename later | — | **Open in §14** |

**Blocking disagreement:** None.

---

## 3. Candidate Establishment Glossary

**Status:** PROPOSED — not operative until 13B.6-C lock.

| Stage | Definition | Role | Constraints (must not) |
| --- | --- | --- | --- |
| **IDEA** | Pre-spec doctrine intent: problem, primitive slot hypothesis, collapse risks identified. | Seed workstream; justify SPECIFIED. | Not implementation proof; not ESTABLISHED; not Ready. |
| **SPECIFIED** | Frozen specification artifacts adopted (13B.3x / matrix rows / verification targets) with ZR-style locks where required. | Authorize planning guards and slice cutlines. | Not runtime proof; not ACCEPTED without gate; not ESTABLISHED. |
| **IMPLEMENTED** | Authorized code paths exist: domain modules + service orchestration + migrations (if in scope) + tests proving bounded behavior. | Operational truth; input to ACCEPTED. | Not ACCEPTED without review gate; not ESTABLISHED; CI green alone insufficient. |
| **ACCEPTED** | Governance gate PASS on implementation slice(s): PJR/RR/acceptance report; bounded conditions documented. | Program sign-off on slice quality. | Not ESTABLISHED_BOUNDED without establishment-tier reassessment; merge ≠ ACCEPTED. |
| **ESTABLISHED_BOUNDED** | Governance **Bounded Establishment Gate PASS** + IMPLEMENTED + PERSISTED + CONTRACTED (if applicable) + READ_VISIBLE + E6 negatives + E7 tests for authorized bounded scope. | Label post-transition primitives (P4/P5) at WS-3 bounded completeness; align P1–P3 pattern. | **Must not** imply full ESTABLISHED, `foundation_trio_ready`, or `ws2_authorized`; CO full literals may stay `false`. |
| **ESTABLISHED** | Governance **Full Establishment Gate PASS** + ESTABLISHED criteria (§5) + FT-X2 spine steps **FILLED** at establishment tier for P + literal policy satisfied if used. | Foundational primitive identity for downstream architecture references. | **Must not** imply Ready or WS-2 alone; classification/boundary proof insufficient alone. |
| **READY** | `foundation_trio_ready` TRUE via **Foundation Trio Ready Gate** after C2 §6.3 (rollup): WS-1 FILLED, WS-3/WS-5 spines FILLED, **P4+P5 full ESTABLISHED**, Trio gates, BV, etc. | Permit **discussion/planning** of next major layer — not WS-2 implementation by itself. | **Must not** open WS-2 without separate authorization; not per-primitive label. |

**WS-2 Authorized** is **outside** this ladder (separate token: `ws2_authorized`).

---

## 4. ESTABLISHED_BOUNDED Criteria

### 4.1 Governance requirements (all required)

| ID | Requirement |
| --- | --- |
| **EBB-G1** | **Bounded Establishment Gate** report issued per primitive (or joint P4+P5 gate with independent verdicts). |
| **EBB-G2** | All **authorized FT-3x / FT-5x** slices for that primitive **ACCEPTED** (PJR/RR PASS). |
| **EBB-G3** | **Foundation Trio Closure Acceptance** bounded layer acknowledged (Trio accepted ≠ ready). |
| **EBB-G4** | **HB gates** applicable to primitive scope **CLEARED** (inventory tier). |
| **EBB-G5** | Gate explicitly states: **`P_ESTABLISHED_BOUNDED`** — not full **`P_ESTABLISHED`**. |
| **EBB-G6** | **No open EBB blockers** (forbidden shortcut findings). |

### 4.2 Runtime requirements (all required)

| ID | Requirement |
| --- | --- |
| **EBB-R1** | **Write path:** expression intent (P4) and/or source material attach (P5) on `postType=post` with guards. |
| **EBB-R2** | **Persist path:** columns populated and migration accepted (if persistence in scope). |
| **EBB-R3** | **Read path:** rehydration + read guards on **routed HTTP surfaces** (`home_feed`, `profile_feed`, `group_feed`, `activity_feed`, `post_detail`). |
| **EBB-R4** | **Anti-collapse** enforced on write (repostTarget rejection, chain keys, etc.). |
| **EBB-R5** | **`is*RuntimePrimitiveEstablished` may remain `false`** — not a failure for EBB tier. |

### 4.3 Evidence requirements (all required)

| ID | Requirement |
| --- | --- |
| **EBB-E1** | **E7:** automated tests PASS for bounded modules + request integration positives. |
| **EBB-E2** | **E6:** negative/cross-primitive tests PASS (not sole evidence). |
| **EBB-E3** | **E3/E5:** positive write classification / material-only path observable. |
| **EBB-E4** | **E9 (if contracted):** OpenAPI present — **inventory only**, paired with EBB-R1–R3. |
| **EBB-E5** | **E2:** slice acceptance reports cited in gate evidence table. |

### 4.4 Forbidden shortcuts (never sufficient alone for EBB)

| ID | Forbidden shortcut |
| --- | --- |
| **EBB-X1** | OpenAPI / SDK types only (C2 F5) |
| **EBB-X2** | Persistence columns without read/write guards |
| **EBB-X3** | Negatives-only tests (C2 F16) |
| **EBB-X4** | `postType: post` alone (C2 F20) |
| **EBB-X5** | Classification or boundary proof booleans without **EBB-G5** gate verdict |
| **EBB-X6** | UI copy / projections alone |
| **EBB-X7** | Closure/Ready/WS-2 tokens inferred from bounded work |

### 4.5 Proposed FT-X1 §6.1 may-count (P4 — bounded tier) — draft

| May count | Must NOT count |
| --- | --- |
| `authorial_expression_intent` + `AUTHORIAL_TEXT_ROLE`; FT-3A/3C/3D acceptances; independence module; save/publish split; E4 surface inventory; persistence + rehydration; request.test authorial positives | `postType: post` alone; legacy rows; activity as establishment; migration without behavior; full WS-5 FILLED |

### 4.6 Proposed FT-X1 §6.1 may-count (P5 — bounded tier) — draft

| May count | Must NOT count |
| --- | --- |
| MATERIAL_ONLY contract; parse/persist/read staging; one-hop on P4 only; FT-3B acceptance; HTTP create with SR positive | `repostTarget*`; private repost binding; legacy binding; OpenAPI-only; negatives-only |

---

## 5. ESTABLISHED Criteria (full tier — DIR-A)

### 5.1 Governance requirements (all required)

| ID | Requirement |
| --- | --- |
| **EST-G1** | **Full Establishment Gate** PASS per primitive with **`P_ESTABLISHED`** verdict. |
| **EST-G2** | **ESTABLISHED_BOUNDED** already granted for same primitive (no skip). |
| **EST-G3** | **Explicit checklist** signed: E3+E5+E6+E7 positives and negatives per FT-X1 row. |
| **EST-G4** | **No open EST blockers** from false-pass catalog (C2 F5, F16, F20, etc.). |
| **EST-G5** | **E1:** canon lock stage (13B.6-C) completed for establishment glossary and tier rules. |
| **EST-G6** | **E2:** all WS-3 (and applicable WS-5 handshake) slice reports **ACCEPTED** at **establishment tier**, not planning-only. |

### 5.2 Runtime requirements (all required)

| ID | Requirement |
| --- | --- |
| **EST-R1** | **EBB-R1–R4** satisfied (bounded paths remain required). |
| **EST-R2** | **Positive establishment path** documented beyond classification/boundary proof (integration + domain tests). |
| **EST-R3** | **E4:** public/group **surface role** evidence **FILLED** at establishment tier (not inventory-only). |
| **EST-R4** | **E8:** profile/publication legacy handshake **FILLED** where in P4 chain (publications/highlight policy resolved or carved). |
| **EST-R5** | **Literal policy:** if program uses `is*RuntimePrimitiveEstablished`, **Literal Policy Authorization** issued before setting **`true`**. |

### 5.3 Evidence requirements (all required)

| ID | Requirement |
| --- | --- |
| **EST-E1** | **EST-TEST-1:** establishment-tier test contract PASS (tagged tests or dedicated suite). |
| **EST-E2** | **E6+E7:** positives **and** negatives (C2 step 10 satisfied). |
| **EST-E3** | **E3+E5:** P5 optional 0..1 on P4 only — positive path proven. |
| **EST-E4** | **E8:** per-surface carve-outs where surfaces involved. |
| **EST-E5** | **E1 never sufficient alone; E6 never sufficient alone for positive claim** — reaffirmed. |

### 5.4 Spine requirements (FT-X2 — per primitive)

| ID | Requirement |
| --- | --- |
| **EST-S1** | WS-3 §4.2 steps **1–12** `[FILLED]` at **establishment tier** (not STRUCTURE-only). |
| **EST-S2** | WS-3 §4.2 **step 13b:** primitive marked **`ESTABLISHED`** (full). |
| **EST-S3** | P4 and P5 **independently** satisfy EST-S1–S2 (no collapsed proof). |
| **EST-S4** | WS-5 handshake steps required for P4 E8 chain **FILLED** per C2. |

### 5.5 Literal policy requirements

| ID | Rule |
| --- | --- |
| **EST-L1** | At **ESTABLISHED_BOUNDED:** `isAuthorialPostRuntimePrimitiveEstablished` and `isSourceReferenceRuntimePrimitiveEstablished` **SHOULD remain `false`**. |
| **EST-L2** | At **full ESTABLISHED:** literals **MAY** become **`true`** only after **EST-R5** authorization and **assert function** update in implementation slice. |
| **EST-L3** | **`isFoundationTrioReady`** unchanged by per-primitive establishment; only **Ready Gate** may set program token. |
| **EST-L4** | Proof objects **MUST throw** if literals set `true` without **EST-L2** authorization (preserve CO intent). |

### 5.6 Forbidden shortcuts (never sufficient alone for full EST)

All **EBB-X*** plus:

| ID | Additional forbidden shortcut |
| --- | --- |
| **EST-X1** | **ESTABLISHED_BOUNDED** alone |
| **EST-X2** | WS-1 **`ESTABLISHED_BOUNDED`** alone for P4/P5 |
| **EST-X3** | FT-X3 bounded tokens alone without full establishment gate |
| **EST-X4** | Trio **ACCEPTED** or HB cleared alone |

---

## 6. Status Relationship Matrix

| From → To | Allowed? | Rule |
| --- | --- | --- |
| **IMPLEMENTED → ACCEPTED** | Only with gate | ACCEPTED requires PJR/RR/acceptance PASS |
| **ACCEPTED → ESTABLISHED_BOUNDED** | Only with EBB gate | ACCEPTED alone insufficient |
| **ESTABLISHED_BOUNDED → ESTABLISHED** | Only with EST gate | Bounded ≠ full; EST-G2 requires EBB first |
| **ESTABLISHED → READY** | Only via Ready Gate | Per-primitive ESTABLISHED is **necessary** not **sufficient** for Ready |
| **READY → WS-2** | Only with WS-2 Authorization Gate | C2 §6.4 separate |
| **IMPLEMENTED → ESTABLISHED** | **NO** | Skips ACCEPTED and EBB |
| **ACCEPTED → READY** | **NO** | Skips establishment tiers |
| **ESTABLISHED_BOUNDED → READY** | **NO** | **EBB-X7** |
| **EBB → WS-2** | **NO** | WS-2 requires Ready chain |

```text
IDEA → SPECIFIED → IMPLEMENTED → ACCEPTED → ESTABLISHED_BOUNDED → ESTABLISHED
                                                                    ↓
                                              (Trio rollup) READY → (separate) WS-2 Authorized
```

---

## 7. Runtime Literal Model (proposed semantics)

| Literal | Module | Proposed meaning | EBB tier | Full ESTABLISHED |
| --- | --- | --- | --- | --- |
| `isAuthorialPostRuntimePrimitiveEstablished` | `authorialExpression.ts` | “Governance granted **full** P4 runtime primitive establishment; literal unlock authorized.” | **`false` (expected)** | **`true` allowed** only after EST-L2 |
| `isSourceReferenceRuntimePrimitiveEstablished` | `sourceReferenceBoundary.ts` | “Governance granted **full** P5 runtime primitive establishment.” | **`false` (expected)** | **`true` allowed** only after EST-L2 |
| `isFoundationTrioReady` | `savePublishBoundary.ts`, `sourceReferenceBoundary.ts` | “Trio Ready token encoded in proof object — **only** when Ready Gate passes.” | **`false`** | **`false`** until Ready Gate |
| `isWs2Authorized` | `sourceReferenceBoundary.ts` | “WS-2 authorization token.” | **`false`** | **`false`** until WS-2 Gate |
| `isSourceReferenceEstablished` | `savePublishBoundary.ts` | **Adjunct** save/publish proof — **not** P5 tier (rename/document in follow-up) | **`false`** | **`false`** unless repurposed in lock |

**MIXED-STATE rule:** Governance gate verdict is **authoritative** for tier label; runtime paths **corroborate**; literals **`true`** are **optional encoded corroboration** at full tier only.

---

## 8. FT-X1 Proposal (draft amendments — not applied)

### 8.1 §4.5 Per-primitive index (proposed)

| Primitive | Current | Proposed |
| --- | --- | --- |
| P1 | `ESTABLISHED_BOUNDED` | unchanged |
| P2 | `ESTABLISHED_BOUNDED` | unchanged |
| P3 | `ESTABLISHED_BOUNDED` | unchanged |
| **P4** | `NOT_ESTABLISHED` | **`ESTABLISHED_BOUNDED` (candidate after reassessment gate)** — tier column; **not auto-flip on lock** |
| **P5** | `NOT_ESTABLISHED` | **`ESTABLISHED_BOUNDED` (candidate after reassessment gate)** |
| P6 | `CLASSIFIED_ONLY` | unchanged |

Add glossary footnote: **`NOT_ESTABLISHED`** = no bounded or full establishment granted yet.

### 8.2 §6.1 Per-primitive evidence (proposed)

- Replace P4/P5 “(none until WS-3 authorization)” with **two sub-rows each:**
  - **May count @ ESTABLISHED_BOUNDED** — §4.5/4.6 tables in this proposal
  - **May count @ ESTABLISHED (full)** — adds EST-S*, E4 FILLED, E8 FILLED, EST-TEST-1
- Preserve **must-not** columns; add **EBB-X*** / **EST-X*** references

### 8.3 §6.3 Evidence tier summary (proposed)

| Tier | Primitives |
| --- | --- |
| Established bounded | P1, P2, P3, **P4, P5 (when EBB granted)** |
| Established (full) | **P4, P5 (when EST granted)** |
| Canon target only | **Remove for P4/P5** after EBB exists — replace with tiered rows |
| Classified historical | P6 |

---

## 9. FT-X2 Proposal (draft amendments — not applied)

### 9.1 §4.2 WS-3 step 13 (proposed split)

| Step | Current | Proposed |
| --- | --- | --- |
| **13a** | (part of 13) | E1: P4 and P5 **`ESTABLISHED_BOUNDED`** independently verifiable — `[FILLED]` when EBB gates PASS |
| **13b** | Independent tokens: P4 and P5 `ESTABLISHED` | E1: P4 and P5 **`ESTABLISHED` (full)** — `[FILLED]` when EST gates PASS |

Steps 4–12: annotate **establishment tier** vs **structure tier** in column headers.

### 9.2 §6.3 Foundation Trio Readiness (proposed clarification)

Add explicit bullets:

- **P4 and P5 must be `ESTABLISHED` (full)** — **`ESTABLISHED_BOUNDED` is not sufficient** for Ready.
- **ESTABLISHED_BOUNDED** satisfies **bounded Trio acceptance** context only — not Ready.

### 9.3 §4.5 index alignment

| Primitive | Proposed chain end state for Ready |
| --- | --- |
| P4 | … → **ESTABLISHED (full)** |
| P5 | … → **ESTABLISHED (full)** |

### 9.4 FT-X3 reconciliation (proposed — related artifact)

| Legacy token (ZR) | Proposed canonical label |
| --- | --- |
| `P4_BOUNDED_RUNTIME_PRIMITIVE_ESTABLISHED_WITH_CONDITIONS` | **`P4_ESTABLISHED_BOUNDED`** |
| `SOURCE_REFERENCE_BOUNDED_RUNTIME_PRIMITIVE_ESTABLISHED_WITH_CONDITIONS` | **`P5_ESTABLISHED_BOUNDED`** |

Historical reports **remain valid** with mapping table in lock stage.

---

## 10. Migration Strategy

### Phase 0 — Today (complete)

- 13B.5 bounded implementation + gates; tokens as-is; **definition debt identified**.

### Phase 1 — 13B.6-C Canon Lock (proposed next)

- Adopt glossary + criteria + FT-X1/FT-X2 **draft amendments** into operative canon files.
- Publish **token reconciliation** for FT-X3 naming.
- **No** `foundation_trio_ready` / **no** WS-2 / **no** literal flips.

### Phase 2 — Tier reassessment gates (post-lock)

1. **P4 Bounded Establishment Gate** — verdict `P4_ESTABLISHED_BOUNDED` or DEFERRED.  
2. **P5 Bounded Establishment Gate** — verdict `P5_ESTABLISHED_BOUNDED` or DEFERRED.  
3. Update **FT-X1 §4.5 display tier** only after PASS.

### Phase 3 — Full establishment (optional parallel planning)

- Close WS-3 steps 1–12 at establishment tier.
- **P4 Full Establishment Gate** / **P5 Full Establishment Gate**.
- **Literal Policy Authorization** slice if `true` literals desired.

### Phase 4 — Trio progression

- Re-run **Foundation Trio Ready Gate**.
- Then **WS-2 Authorization Gate** (inventory/planning only until authorized).

### Rollback posture

- If **13B.6-C REJECT_PROPOSAL:** remain on current labels; continue **DEFERRED** pattern; revisit DIR-E only as last resort.

---

## 11. Candidate Canon (integrative normative draft)

**Title:** Go2Asia Foundation Primitive Maturity & Establishment Canon (Candidate v1)

### Article 1 — Purpose

Define maturity stages for Foundation Trio primitives so governance, runtime, and agents share one vocabulary. Prevent false establishment, false readiness, and WS-2 leakage.

### Article 2 — Maturity stages

Adopt §3 Glossary verbatim at lock.

### Article 3 — Tiers for post-transition primitives (P4, P5)

1. **ESTABLISHED_BOUNDED** criteria: §4.  
2. **ESTABLISHED (full)** criteria: §5.  
3. **ESTABLISHED_BOUNDED ≠ ESTABLISHED.**

### Article 4 — Mixed state

Establishment is **governance-primary** and **runtime-corroborated** (§7–8 of 13B.6-A). Literals are subordinate to gate verdicts.

### Article 5 — Foundation Trio relationships

- **ACCEPTED** (Trio bounded) ≠ **READY**.  
- **READY** requires **P4+P5 full ESTABLISHED** plus C2 §6.3 rollup.  
- **WS-2** requires separate authorization after Ready per C2 §6.4.

### Article 6 — Forbidden promotions

Union of **EBB-X*** and **EST-X*** lists.

### Article 7 — Agent rules

- Agents **must not** assign tiers without gate report.  
- Agents **must not** flip literals or tokens in proposal/definition gates.  
- Agents **must** cite checklist row IDs in establishment gates.

### Article 8 — FT-X1 / FT-X2 patches

Operative text = §8–9 proposals upon lock.

### Article 9 — Historical compatibility

FT-X3 ZR tokens map per §9.4; no retroactive invalidation of 13B.5 work.

---

## 12. Adoption Recommendation

**`ADOPT_WITH_CONDITIONS`**

| Condition ID | Condition for lock (13B.6-C) |
| --- | --- |
| **PROP-COND-1** | Stakeholder sign-off on **§3 Glossary** and **§6 Matrix** |
| **PROP-COND-2** | **FT-X1 §4.5/§6.1** and **FT-X2 §4.2/§6.3** amended in lock PR as **single bundle** |
| **PROP-COND-3** | **FT-X3 reconciliation table** published alongside lock |
| **PROP-COND-4** | **Gate templates** for EBB and EST gates added under `docs/reports/` or program template path |
| **PROP-COND-5** | Explicit statement: **lock does not grant P4/P5 tiers or ready/WS-2** — reassessment gates follow |

| Alternative | Why not selected |
| --- | --- |
| **ADOPT_PROPOSAL** | Valid semantically; conditions reduce lock-stage ambiguity — **WITH_CONDITIONS** preferred |
| **REJECT_PROPOSAL** | Would restore definition debt — **not recommended** |

---

## 13. Recommendation for 13B.6-C

**Answer: `YES`**

**Proposed stage:** `Stage 13B.6-C — Establishment Canon Adoption / Canon Lock Gate`

**Gate outcomes (for 13B.6-C design):**

| Verdict | Effect |
| --- | --- |
| `CANON_LOCK_ADOPTED` | Apply §8–9 amendments; glossary operative |
| `CANON_LOCK_ADOPTED_WITH_CONDITIONS` | Partial lock + follow-up patch list |
| `CANON_LOCK_REJECTED` | Proposal returns to program review |

**13B.6-C must not:** grant P4/P5 ESTABLISHED; lift tokens; open WS-2.

---

## 14. Final Notes (open after proposal)

| Topic | Status |
| --- | --- |
| P4/P5 **ESTABLISHED_BOUNDED** verdict | **OPEN** — Phase 2 after lock |
| P4/P5 **full ESTABLISHED** | **OPEN** |
| `foundation_trio_ready` / `ws2_authorized` | **FALSE** |
| Rename `isSourceReferenceEstablished` | **OPEN** — clarify vs P5 tier |
| Publications/highlight E8 FILLED | **OPEN** for full EST |
| EST-TEST-1 suite naming | **OPEN** — define at EST gate template |
| P1–P3 retroactive relabel | **Not required** — already `ESTABLISHED_BOUNDED` |

---

## Execution Summary

| Field | Value |
| --- | --- |
| **Report file** | `docs/reports/stage_13B_6_B_establishment_canon_proposal_v1.md` |
| **Agents used** | **7/7** |
| **Candidate canon** | **Go2Asia Foundation Primitive Maturity & Establishment Canon (Candidate v1)** — §11 |
| **Adoption recommendation** | **`ADOPT_WITH_CONDITIONS`** |
| **Launch 13B.6-C?** | **`YES`** |
| **Code / tokens / FT-X1/C2 files** | **Unchanged** (proposal only) |

### Invariants (preserved)

```
Proposal ≠ canon change
Proposal ≠ token change
Proposal ≠ P4/P5 tier grant
Proposal ≠ WS-2 open
Proposal ≠ foundation_trio_ready TRUE
ESTABLISHED_BOUNDED ≠ ESTABLISHED (full)
ESTABLISHED ≠ READY
READY ≠ WS-2 Authorized
```
