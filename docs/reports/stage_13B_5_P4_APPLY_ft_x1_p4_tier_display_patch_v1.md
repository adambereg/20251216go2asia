# Stage 13B.5-P4-APPLY — FT-X1 P4 Tier Display Patch

**Document class:** `DOCS_ONLY_TIER_DISPLAY_PATCH`  
**Not:** gate · reassessment · implementation · Ready · WS-2

**Authority:** `stage_13B_5_P4_establishment_bounded_reassessment_gate_v1.md` — **`P4_ESTABLISHED_BOUNDED_GRANTED`**

---

## 1. Scope

| Check | Result |
| --- | --- |
| Docs-only | **YES** |
| Code / runtime / OpenAPI / SDK / DB / tests | **NO** |
| Program token changes | **NO** |
| P4 full **ESTABLISHED** grant | **NO** |
| P5 tier change | **NO** |

---

## 2. Inputs

| Document | Role |
| --- | --- |
| `docs/reports/stage_13B_5_P4_establishment_bounded_reassessment_gate_v1.md` | **Primary** — tier grant |
| `docs/reports/stage_13B_6_C_APPLY_establishment_canon_application_v1.md` | Prior FT-X alignment |
| `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` | FT-X1 patch target |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | FT-X2 optional patch |

---

## 3. Files Changed

| File | Action |
| --- | --- |
| `docs/reports/stage_13B_5_C_foundation_trio_primitive_boundary_matrix_v1.md` | **UPDATED** |
| `docs/reports/stage_13B_5_C2_ft_x2_foundation_evidence_spine_v1.md` | **UPDATED** (P4-specific 13a / §4.5) |
| `docs/reports/stage_13B_5_P4_APPLY_ft_x1_p4_tier_display_patch_v1.md` | **CREATED** |

---

## 4. Changes Applied

### 4.1 FT-X1 (`stage_13B_5_C_*`)

| Location | Change |
| --- | --- |
| Header | P4-APPLY banner + link to P4 reassessment gate |
| Accepted baseline | P4 → `ESTABLISHED_BOUNDED`; P5 unchanged |
| **§2.1** inventory | P4 row: **`ESTABLISHED_BOUNDED`** |
| **§2.1.1** current file status | P4 bounded granted; P5 pending; full EST not granted |
| §3.4 title | ESTABLISHED_BOUNDED (current) |
| §4 interaction | P4/P5 tier wording |
| **§6.3** tier summary | P4 current = ESTABLISHED_BOUNDED; P5 = NOT_ESTABLISHED |
| §7 G1/G2 | P4 gap closed; P5 open |
| §11 closure note | P4 bounded; P5 pending |

### 4.2 FT-X2 (`stage_13B_5_C2_*`) — optional per P4-APPLY-4

| Location | Change |
| --- | --- |
| Header | P4-APPLY note |
| **§4.2 step 13a** | Split: **13a (P4) `[FILLED]`**; **13a (P5) `[BLOCKED]`** |
| **§4.2 step 13b** | Remains **`[BLOCKED]`** for P4 and P5 (full EST not granted) |
| **§4.5** index | P4 → **`ESTABLISHED_BOUNDED`**; P5 → **`NOT_ESTABLISHED`** |
| X2-G1 | Updated for P4 13a FILLED |

---

## 5. Non-Changes

| Item | Changed? |
| --- | --- |
| P5 tier | **NO** — remains **`NOT_ESTABLISHED`** |
| P4 full **ESTABLISHED** | **NO** |
| `foundation_trio_ready` | **NO** — **FALSE** |
| `ws2_authorized` | **NO** — **FALSE** |
| Code / OpenAPI / tests | **NO** |
| P4 reassessment gate report | **NO** (read-only authority) |

---

## 6. Validation

| Check | Result |
| --- | --- |
| FT-X1 §2.1 P4 = `ESTABLISHED_BOUNDED` | **PASS** |
| FT-X1 §2.1 P5 = `NOT_ESTABLISHED` | **PASS** |
| FT-X1 no stale "P4 current NOT_ESTABLISHED" (inventory) | **PASS** (grep: no P4+NOT_ESTABLISHED pairing in §2.1) |
| FT-X2 §4.5 P4 tier | **PASS** — `ESTABLISHED_BOUNDED` |
| FT-X2 step 13b P4 FILLED | **PASS** — not FILLED (BLOCKED) |
| FT-X2 step 13a P4 | **PASS** — FILLED |
| FT-X2 step 13a P5 | **PASS** — BLOCKED |
| `foundation_trio_ready` in patch files | **FALSE** (unchanged program posture) |
| `ws2_authorized` in patch files | **FALSE** |

**Validation status:** **`P4_APPLY_VALIDATION_PASS`**

---

## 7. Next Safe Step

**`Stage 13B.5-P5 — P5 Establishment Bounded Reassessment Gate`**

Then (optional): **P5-APPLY** FT-X1/FT-X2 tier display patch if P5 EBB granted.

---

## Final Tokens

```yaml
stage_13B_5_P4_apply_status: PASS
ft_x1_p4_current_tier: ESTABLISHED_BOUNDED
ft_x1_p5_current_tier: NOT_ESTABLISHED
stage_13B_5_P4_established_full: FALSE
foundation_trio_ready: FALSE
ws2_authorized: FALSE
stage_13B_5_P4_apply_next_safe_step: STAGE_13B_5_P5_ESTABLISHMENT_BOUNDED_REASSESSMENT_GATE
```

### Invariants (preserved)

```
P4_ESTABLISHED_BOUNDED ≠ P4_ESTABLISHED (full)
P4_ESTABLISHED ≠ foundation_trio_ready
foundation_trio_ready ≠ ws2_authorized
Display patch ≠ new establishment grant
```

---

## Execution Summary

| Field | Value |
| --- | --- |
| **Files changed** | FT-X1, FT-X2, this APPLY report |
| **Validation** | **P4_APPLY_VALIDATION_PASS** |
| **Next safe step** | **P5 Establishment Bounded Reassessment Gate** |
