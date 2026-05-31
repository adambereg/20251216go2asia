# Stage 13B.4-C4 — FT-1C vs FT-1D Prioritization Review

## 1. Executive Summary

Stage 13B.4-C4 is a governance/prioritization step only.

This document does not implement code, migrations, API/schema changes, SDK/frontend changes, runtime rewrites, UI rewrites, or activity rewrites.

Accepted upstream status:

- FT-1A completed: `FT_1A_IMPLEMENTATION_COMPLETE`.
- FT-1B completed: `FT_1B_IMPLEMENTATION_COMPLETE`.
- WS-1 remains incomplete.

Purpose of this report:

- determine which slice must be next: `FT-1C Private Note` or `FT-1D Retention Dedupe`;
- provide a governance recommendation with primary and reserve candidate;
- define the next authorization gate only.

## 2. Current WS-1 State Review

Current WS-1 state after accepted C1 and C3:

- implemented: retention intent boundary (FT-1A);
- implemented: owner visibility boundary (FT-1B);
- not implemented: private note boundary (FT-1C);
- not implemented: retention-scoped dedupe (FT-1D);
- not implemented: bookmark separation (FT-1E).

What is now proven:

- save-for-myself can exist as post-transition private retention intent;
- owner has a positive retention access path;
- non-owner absence is proven in direct-link/profile visibility surfaces;
- private retention is excluded from touched publication/repost counters.

Remaining WS-1 gaps:

- text-role gap: optional text is not yet proven as private note;
- dedupe gap: existing dedupe scope can still mix retention and legacy/public rows;
- primitive separation gap: bookmark vs private retention remains open;
- no WS-1 closure evidence rollup.

This section relies on accepted reports `stage_13B_4_C1_ft_1A_retention_intent_implementation_v1.md`, `stage_13B_4_C2_ft_1B_owner_visibility_authorization_v1.md`, `stage_13B_4_C3_ft_1B_owner_visibility_implementation_v1.md`, and planning baseline `stage_13B_4_B_foundation_trio_implementation_planning_v1.md`.

## 3. FT-1C Review

FT-1C scope label: `Private Note`.

Problem FT-1C solves:

- removes semantic ambiguity where retention text can still be interpreted as repost commentary;
- defines private-retention text as owner-only note semantics inside WS-1 boundary;
- prevents false interpretation that visibility-only completion already means WS-1 semantic completion.

Dependencies:

- hard dependency: FT-1A intent boundary (already satisfied);
- practical sequencing dependency: FT-1B visibility boundary already satisfied and reduces false-pass risk for note semantics;
- no hard dependency on FT-1D.

What remains blocked without FT-1C:

- WS-1 note-related acceptance criteria cannot be considered complete;
- Foundation Trio proof remains vulnerable to text-role ambiguity;
- downstream WS-3/WS-2 governance can be distorted by unresolved note-vs-commentary semantics.

Risks if FT-1C is next:

- implementation risk: medium (contained to WS-1 semantics);
- governance risk: medium/high (possible scope creep into WS-7 language or WS-3 expression);
- false-pass risk: high if copy rename is misused as proof;
- dependency risk: medium.

## 4. FT-1D Review

FT-1D scope label: `Retention Dedupe`.

Problem FT-1D solves:

- scopes duplicate resolution to retention intent instead of broad repost shape;
- reduces collisions where legacy/public repost rows can block private retention behavior;
- protects future split between retention and authorial expression for same source target.

Dependencies:

- hard dependency: FT-1A intent boundary (already satisfied);
- cross-workstream dependency awareness: WS-3 authorial path constraints (from B/C0 planning), even without WS-3 implementation;
- no hard dependency on FT-1C.

What remains blocked without FT-1D:

- reliable retention dedupe criteria inside WS-1 remain open;
- WS-3 downstream readiness risk remains high because dedupe can accidentally block authorial flow;
- Foundation Trio closure gate cannot be safely reached.

Risks if FT-1D is next:

- implementation risk: high (write-path and duplicate semantics are sensitive);
- governance risk: high (easy to overreach into WS-3/WS-2/legacy behavior);
- false-pass risk: high (can be misread as WS-2 progress or WS-1 closure);
- dependency risk: high.

## 5. Runtime Impact Comparison

Comparison across required dimensions:

- **User value now**
  - FT-1C: clarifies meaning of retained text and reduces cognitive mismatch.
  - FT-1D: fixes duplicate-resolution pain and legacy collision behavior.
- **Retention runtime impact**
  - FT-1C: semantic integrity of retained context.
  - FT-1D: operational integrity of repeated save behavior.
- **False-pass risk**
  - FT-1C: high if treated as language-only cleanup.
  - FT-1D: high if treated as WS-2 proxy or expression gate completion.
- **Foundation Trio impact**
  - FT-1C: closes missing WS-1 primitive boundary (text semantics).
  - FT-1D: closes WS-1/WS-3 coupling risk (dedupe boundary).
- **Influence on WS-3**
  - FT-1C: reduces ambiguity between note text and authorial text.
  - FT-1D: directly reduces risk that retention dedupe blocks authorial publish pathways.
- **Influence on WS-2**
  - FT-1C: prepares semantic correctness before elimination phases.
  - FT-1D: prevents dedupe drift being mistaken as elimination completeness.

Synthesis:

- FT-1D has stronger immediate technical pressure on future WS-3 readiness.
- FT-1C has stronger sequencing alignment with accepted WS-1 primitive progression after FT-1A/FT-1B.

## 6. Dependency Analysis

Which slice opens more downstream capability:

- FT-1C first opens cleaner semantic handoff from retention to later WS-3 authorial semantics, with lower cross-workstream blast radius.
- FT-1D first opens stronger dedupe safety before WS-3 gates, but with materially higher governance/verification burden.

Specific downstream checks:

- **Authorial Post impact**
  - FT-1C first: reduces text-role confusion before authorial primitives.
  - FT-1D first: reduces blocking risk for same-source authorial actions.
- **Source Reference impact**
  - FT-1C first: improves narrative boundary between private note and source-linked authorial context.
  - FT-1D first: prevents dedupe overreach affecting source-related authorial attempts.
- **Foundation Trio Closure**
  - both are required before closure;
  - FT-1C first preserves accepted narrow-step governance cadence;
  - FT-1D first increases chance of mixed-scope implementation drift.
- **WS-2 impact**
  - neither authorizes WS-2 entry;
  - FT-1D carries higher false signal risk for apparent elimination progress.

Dependency conclusion:

- primary sequencing remains FT-1C then FT-1D, unless governance intentionally chooses higher-risk WS-3-readiness-first strategy.

## 7. User Experience Review

From current runtime perspective after FT-1A/FT-1B:

- missing private note semantics is visible as conceptual mismatch: owner-only retention exists, but text meaning remains ambiguous;
- dedupe issue is visible as operational mismatch: repeated retention can resolve through non-ideal duplicate logic, especially with legacy overlap.

Which feels more strange for users right now:

- for broad everyday understanding, absence of private-note semantics is more consistently strange;
- for frequent re-save scenarios, dedupe collisions are more sharply painful when they occur.

UX prioritization conclusion:

- FT-1C better addresses baseline mental-model coherence for all retention users;
- FT-1D better addresses high-friction edge flows and future authorial coupling safety.

## 8. Risk Analysis

Risk matrix by candidate:

- **FT-1C**
  - implementation risk: medium;
  - governance risk: medium/high;
  - false-pass risk: high (copy/terminology substitutions);
  - dependency risk: medium.

- **FT-1D**
  - implementation risk: high;
  - governance risk: high;
  - false-pass risk: high (misread as WS-2 or closure progress);
  - dependency risk: high (WS-3 coupling sensitivity).

Risk conclusion:

- FT-1D is strategically important but operationally riskier as immediate next slice.
- FT-1C is lower-risk next step within current WS-1 cadence established by accepted gates.

## 9. Recommendation

Primary candidate:

- `FT-1C Private Note`.

Reserve candidate:

- `FT-1D Retention Dedupe`.

Why FT-1C is primary:

- aligns with accepted post-C3 gate trajectory and WS-1 primitive sequencing;
- closes the most visible semantic gap left after intent + visibility;
- keeps next authorization narrow and avoids immediate high-risk dedupe surgery.

Why FT-1D is reserve:

- remains mandatory before Foundation Trio closure and before safe WS-3 progression;
- should be opened next if C4 governance chooses WS-3-readiness pressure over semantic-sequencing stability.

## 10. Recommended Next Gate

Given selected recommendation (FT-1C primary), recommended gate:

- `FT_1C_PRIVATE_NOTE_SLICE_AUTHORIZATION_GATE`
- authorization token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1C_PRIVATE_NOTE_ONLY`

If governance chooses FT-1D instead, gate would be:

- `FT_1D_RETENTION_DEDUPE_SLICE_AUTHORIZATION_GATE`
- authorization token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1D_RETENTION_DEDUPE_ONLY`

Gate rules for both options:

- no WS-2, WS-3, WS-5, WS-6, WS-7 bundling;
- no migrations, DB changes, OpenAPI/SDK/frontend rewrites;
- no WS-1 or Foundation Trio closure claims in slice implementation report.

## 11. Final Decision

Final status:

`NEXT_SLICE_FT_1C_RECOMMENDED`

Decision rationale:

- FT-1A and FT-1B are complete, but WS-1 remains semantically incomplete;
- FT-1C is the lower-risk, governance-consistent next step to close the remaining core WS-1 semantic boundary;
- FT-1D stays critical and should be the immediate reserve/next candidate after FT-1C authorization and bounded implementation review.

Decision tokens:

- `stage_13B_4_C4_status: NEXT_SLICE_FT_1C_RECOMMENDED`
- `stage_13B_4_C4_primary_candidate: FT_1C_PRIVATE_NOTE`
- `stage_13B_4_C4_reserve_candidate: FT_1D_RETENTION_DEDUPE`
- `stage_13B_4_C4_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_AND_OWNER_VISIBILITY_ONLY`
- `stage_13B_4_C4_ws1_closure_claimed: FALSE`
- `stage_13B_4_C4_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C4_implementation_started: FALSE`
