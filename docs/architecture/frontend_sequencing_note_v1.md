# Go2Asia - Frontend Sequencing Note v1

Status: active sequencing reference

## 1. Purpose

This note defines the recommended frontend sequencing after the current backend/runtime maturity state.
It is a sequencing note for delivery governance, not a new implementation roadmap and not a redesign brief.

## 2. Current platform context

- The major execution cycle is closed with minor residual debt.
- Atlas Geo/Place Foundation Pass is completed and establishes minimal cross-domain place-linking truth.
- Guru is now a meaningful multi-source live aggregation baseline within declared semantics.
- Backend/runtime maturity is ahead of frontend maturity across several practical modules.
- The frontend wave should now proceed in controlled dependency order.

## 3. Why sequencing must follow dependency truth

- Atlas provides the platform place truth and geo reference layer used by practical domains.
- RF depends on Atlas place truth for partner place/host linking consistency.
- Rielt depends on the same Atlas place truth for listing place/container semantics.
- Guru quality and semantic honesty improve when upstream practical modules are linked through the same place layer.
- Space should not lead this wave because it is an integration-facing shell that benefits from more visible and stable upstream practical modules.

## 4. Recommended frontend sequence

### Step 1 - Atlas geo/place foundation pass

Already completed. This step is the enabling foundation and is not a pending frontend step.

### Step 2 - RF frontend / live adoption

Proceed now to move RF UI surfaces to live runtime behavior on top of the completed Atlas place-link foundation.

### Step 3 - Rielt frontend / live adoption

Proceed after RF to expand practical live adoption with the same place truth conventions and avoid parallel geo assumptions.

### Step 4 - Guru frontend / live adoption

Proceed after practical modules so Guru UI reflects stable upstream live semantics rather than partially adopted domain surfaces.

### Step 5 - Quest frontend

Proceed next as a separate domain UI pass after practical/discovery layers are already visible and operationally clearer.

### Step 6 - Atlas/Pulse broader UI realignment

Run broader UI realignment later, after earlier practical live adoption steps, to reduce speculative UI work and avoid avoidable rewrites.

### Step 7 - Space Asia

Keep Space later in this wave as an integration-facing shell, not as the leading frontend priority.

## 5. What this sequencing is optimizing for

- Structural truth before UI polish.
- Fewer future rewrites caused by dependency reordering.
- Cleaner cross-domain linking around Atlas place semantics.
- Frontend adoption of already mature backend/runtime modules.
- Delayed integration shell work until upstream module visibility is stronger.

## 6. What this note does not imply

- It does not require a full Atlas rebuild before all frontend work.
- It does not call for a broad frontend rewrite all at once.
- It does not imply that Space is unimportant.
- It does not require complete Atlas/Pulse content cleanup before RF/Rielt frontend adoption.
- It does not replace per-module implementation planning and acceptance criteria.

## 7. Practical implication

The next frontend-oriented segment should start from RF frontend/live adoption, specifically because Atlas foundation is now in place.
Subsequent frontend segments should continue in the sequence above unless a new explicit blocker-level reason justifies deviation.

## 8. Related documents

- `docs/architecture/execution_cycle_closure_note_v1.md`
- `docs/architecture/ssot_reconciliation_closure_note_v1.md`
- `docs/plans/go2asia_next_steps_plan_2026_march_10.md`
- `docs/architecture/atlas/atlas_geo_place_foundation_pass_v1.md`
- `docs/architecture/guru/guru_semantic_policy_and_pulse_acceptance_v1.md`
- `docs/architecture/guru/guru_live_aggregation_milestone_note_v1.md`
- `docs/architecture/rf/*`
- `docs/architecture/rielt/*`
- `docs/architecture/guru/*`
- `docs/architecture/quest/*`
- `docs/architecture/atlas/*`
- `docs/architecture/space/*`
