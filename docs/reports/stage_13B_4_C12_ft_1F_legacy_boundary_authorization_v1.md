# Stage 13B.4-C12 - FT-1F Legacy Boundary Authorization Gate

## 1. Executive Summary

Stage 13B.4-C12 is a governance and authorization report.

This document does not implement code, migrations, API design, schema design, OpenAPI changes, SDK changes, frontend changes, UI text changes, runtime rewrites, UI rewrites, or activity rewrites.

Accepted upstream state:

- Stage 13B.4-C1 completed with `FT_1A_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C3 completed with `FT_1B_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C6 completed with `FT_1C_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C8 completed with `FT_1D_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C11 completed with `FT_1E_IMPLEMENTATION_COMPLETE`.
- FT-1F has not yet been authorized.

Purpose of this document:

- decide whether FT-1F Legacy Boundary can be safely opened;
- define the authorization boundary for FT-1F if opened;
- preserve the doctrine that legacy repost-shaped rows are historical artifacts, not proof of post-transition runtime.

Recommendation:

`AUTHORIZED_FOR_FT_1F_IMPLEMENTATION`

Recommended authorization token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1F_LEGACY_BOUNDARY_ONLY`

## 2. Current WS-1 Review

This section uses accepted reports only. It does not re-check code.

Current WS-1 state:

- FT-1A Retention Intent: complete.
- FT-1B Owner Visibility: complete.
- FT-1C Private Note: complete.
- FT-1D Retention Dedupe: complete.
- FT-1E Bookmark Separation: complete.
- FT-1F Legacy Boundary: not implemented and not yet authorized before this gate.
- FT-1G Activity Alignment: not implemented.
- FT-1H WS-1 Closure Evidence: not reached.

What is proven by accepted C1, C3, C6, C8, and C11:

- post-transition Private Repost Intent exists;
- owner-only visibility is proven;
- Private Note semantics are bounded inside private repost;
- retention dedupe is scoped to retention and not blocked by propagation/legacy-shaped rows;
- bookmark and retention are separated primitives.

What remains unproven:

- legacy repost-shaped rows are still not explicitly bounded on WS-1 side as historical artifacts distinct from post-transition runtime;
- activity alignment remains open;
- WS-1 closure evidence remains open.

Current open WS-1 gaps:

- FT-1F legacy boundary distinction;
- FT-1G activity/no-pressure alignment;
- FT-1H closure evidence rollup.

## 3. Legacy Boundary Problem Definition

FT-1F solves the WS-1-side distinction problem between historical legacy repost-shaped rows and post-transition primitives.

Legacy repost-shaped rows:

- are historical artifacts from superseded public/group repost doctrine;
- can still be visible on runtime surfaces;
- must not be used as proof that post-transition primitives exist.

Legacy rows are different from post-transition Private Repost:

- Private Repost is post-transition owner-only retained context;
- legacy rows are historical publication-era artifacts;
- legacy rows cannot substitute retained-context proof.

Legacy rows are different from Private Note:

- Private Note is owner-only text role inside post-transition private repost;
- legacy repost text remains historical repost commentary context;
- legacy rows cannot be used to prove private-note semantics.

Legacy rows are different from Bookmark:

- bookmark is Reactions-owned reaction fact;
- legacy repost-shaped rows are Space publication-era artifacts;
- legacy rows cannot substitute bookmark proof and bookmark cannot classify legacy rows.

Legacy rows are different from future WS-3 primitives:

- legacy rows are not Authorial Post;
- legacy repost binding is not Source Reference;
- legacy rows cannot be used as proof that WS-3 expression runtime exists.

FT-1F objective:

- establish WS-1-side legacy distinction and prevent misclassification;
- not implement full WS-5.

## 4. Legacy Ambiguity Review

Current false interpretations still possible if FT-1F remains open:

- legacy row mistaken for post-transition Private Repost evidence;
- legacy repost text mistaken for Private Note semantics;
- legacy row mistaken for Authorial Post output;
- legacy repost binding mistaken for Source Reference;
- legacy visibility mistaken as proof that repost doctrine is still canonical;
- legacy presence masking missing post-transition evidence.

Observed ambiguity classes:

- feed-level ambiguity: visible repost-shaped cards can be read as current behavior;
- profile/publication ambiguity: legacy rows can be mistaken for authorial output;
- activity ambiguity: historical repost activity can be misread as post-transition social signal;
- highlight ambiguity: old repost links can be read as current success destinations.

Ambiguity conclusion:

- FT-1D and FT-1E reduced dedupe and bookmark confusion;
- legacy artifact ambiguity remains a distinct WS-1 blocker;
- FT-1F is required before reliable WS-1 closure evidence.

## 5. Scope Definition

In scope for FT-1F authorization:

- define WS-1-side distinction between legacy repost-shaped artifacts and post-transition Private Repost semantics;
- prove legacy rows are not valid proof for post-transition retained context;
- prove legacy rows are not used as Private Note proof;
- prove legacy rows are not used as bookmark proof;
- prove legacy rows are not used as authorial/source-reference proof;
- require observable runtime/service-level proof in later implementation report;
- preserve FT-1A through FT-1E behavior.

Out of scope for FT-1F:

- FT-1G Activity Alignment;
- FT-1H WS-1 Closure Evidence;
- WS-2 public/group repost elimination;
- WS-3 Authorial Post and Source Reference implementation;
- WS-5 full implementation;
- WS-6 activity projection rewrite;
- WS-7 language rewrite;
- WS-8 BV execution;
- legacy hiding as solution;
- legacy deletion as solution;
- legacy migration as solution;
- legacy conversion as solution;
- OpenAPI changes;
- SDK generation;
- DB schema changes;
- migrations;
- broad frontend rewrite;
- UI-only distinction as acceptance proof;
- language-only distinction as acceptance proof.

Important scope invariant:

- FT-1F implements only WS-1 side of legacy distinction;
- FT-1F does not implement full WS-5.

## 6. False Pass Review

Scenario: legacy hiding used as distinction proof.

Verdict: `BLOCKING_FALSE_PASS`.

Reason: hiding legacy rows does not prove semantic distinction and can mask missing runtime boundaries.

Scenario: legacy deletion used as distinction proof.

Verdict: `BLOCKING_SCOPE_VIOLATION`.

Reason: deletion is WS-5/data-policy territory and is not allowed as FT-1F proof.

Scenario: legacy migration used as distinction proof.

Verdict: `BLOCKING_SCOPE_VIOLATION`.

Reason: migration is out of scope for FT-1F authorization.

Scenario: legacy conversion used as distinction proof.

Verdict: `BLOCKING_FALSE_PASS`.

Reason: converting legacy rows into new primitives would erase doctrine boundary instead of proving it.

Scenario: UI-only distinction.

Verdict: `BLOCKING_FALSE_PASS`.

Reason: visual suppression/labeling alone is not runtime/service-level evidence.

Scenario: language-only distinction.

Verdict: `BLOCKING_FALSE_PASS`.

Reason: wording changes cannot prove classification boundary; WS-7 remains separate.

Additional blocking patterns:

- using legacy row existence as Private Repost proof;
- using legacy row existence as Authorial Post proof;
- using legacy repost binding as Source Reference proof;
- using FT-1F to claim WS-5 closure;
- using FT-1F to open WS-3 automatically.

## 7. Acceptance Framework

This is authorization-level acceptance only. It does not define implementation details.

Positive acceptance criteria:

1. Legacy repost-shaped rows are explicitly treated as historical artifacts.
2. Legacy rows are not used as proof of post-transition Private Repost existence.
3. Legacy rows are not used as proof of Private Note semantics.
4. Legacy rows are not used as bookmark proof.
5. Legacy rows are not used as Authorial Post proof.
6. Legacy repost binding is not used as Source Reference proof.
7. Legacy rows are not used as retention dedupe identity proof.
8. Proof is observable at runtime/service boundary, not UI-only or language-only.
9. FT-1A through FT-1E behavior remains intact.
10. Remaining WS-1 gaps are explicitly documented in implementation report.

Negative acceptance blockers:

1. FT-1F claims WS-1 closure.
2. FT-1F claims Foundation Trio closure.
3. FT-1F claims WS-2 progress.
4. FT-1F claims WS-3 readiness or authorization.
5. FT-1F claims full WS-5 implementation/closure.
6. Legacy rows are hidden, deleted, migrated, or converted as proof strategy.
7. FT-1F changes activity behavior.
8. FT-1F uses UI-only distinction as proof.
9. FT-1F uses language-only distinction as proof.
10. FT-1F introduces OpenAPI/SDK/schema/migration changes without blocker stop.

Required proof shape for later implementation report:

- explicit legacy-vs-post-transition boundary evidence;
- explicit negatives for private repost/private note/bookmark/authorial/source-reference misclassification;
- forbidden-scope verification;
- runtime drift review;
- explicit statement that WS-3 remains unauthorized.

Core acceptance statement:

- legacy rows must not be used as proof of post-transition runtime.

## 8. Dependency Review

Interaction with FT-1G:

- FT-1F does not implement activity alignment;
- FT-1G remains required for no-pressure activity boundary;
- FT-1F must not rewrite activity behavior.

Interaction with FT-1H:

- FT-1F is required input for WS-1 closure evidence;
- FT-1H remains blocked until FT-1G is also completed or explicitly carved out;
- FT-1F completion alone must not claim WS-1 closure.

Interaction with future WS-5:

- FT-1F provides only WS-1-side legacy distinction handshake;
- full legacy taxonomy/matrix/policy implementation remains WS-5 work;
- FT-1F must not be treated as full WS-5 completion.

Interaction with future WS-3:

- FT-1F reduces legacy misread risk for future authorial planning;
- FT-1F does not authorize WS-3 implementation;
- WS-3 remains closed for implementation after FT-1F.

Interaction with Foundation Trio:

- FT-1F advances WS-1 side of legacy distinction;
- Foundation Trio readiness still blocked by FT-1G, FT-1H, WS-3, and WS-5 implementation layers;
- no Trio closure claim is allowed at C12.

Dependency conclusion:

- FT-1F is safe to authorize now as a narrow slice;
- it is a prerequisite-quality step for reliable WS-1 closure;
- it does not open WS-3 and does not replace WS-5.

## 9. Recommended Authorization Status

Recommended status:

`AUTHORIZED_FOR_FT_1F_IMPLEMENTATION`

Authorization wording:

Stage 13B.4-C12 authorizes only the bounded WS-1 implementation slice FT-1F Legacy Boundary. This authorization allows work only on proving WS-1-side legacy distinction so that legacy repost-shaped rows are not used as proof of post-transition runtime primitives. It does not authorize FT-1G, FT-1H, WS-2, WS-3, WS-5 full implementation, WS-6, WS-7, WS-8, migrations, DB changes, OpenAPI changes, SDK changes, frontend rewrites, language rewrites, activity rewrites, legacy hiding/deletion/migration/conversion, or closure claims.

Authorization token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1F_LEGACY_BOUNDARY_ONLY`

## 10. Recommended Next Gate

After FT-1F implementation completes and is reviewed, the recommended next gate is:

`FT_1G_ACTIVITY_ALIGNMENT_AUTHORIZATION_GATE`

Reason:

- FT-1F resolves WS-1-side legacy distinction only;
- FT-1G remains required for WS-1 no-pressure activity boundary;
- FT-1H closure evidence remains blocked without FT-1G;
- WS-3 must not open automatically after FT-1F.

Reserve planning track:

- paired WS-3 + WS-5 planning review can be considered later as read-only governance track;
- it must not authorize WS-3 implementation in this gate sequence.

Not recommended after FT-1F:

- automatic WS-3 authorization;
- WS-5 full implementation authorization;
- WS-1 closure gate before FT-1G;
- Foundation Trio closure claim.

## 11. Final Decision

Final decision:

`AUTHORIZED_FOR_FT_1F_IMPLEMENTATION`

Final tokens:

- `stage_13B_4_C12_status: AUTHORIZED_FOR_FT_1F_IMPLEMENTATION`
- `stage_13B_4_C12_authorization_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1F_LEGACY_BOUNDARY_ONLY`
- `stage_13B_4_C12_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_PRIVATE_NOTE_RETENTION_DEDUPE_AND_BOOKMARK_SEPARATION_ONLY`
- `stage_13B_4_C12_implementation_started: FALSE`
- `stage_13B_4_C12_migrations_proposed: FALSE`
- `stage_13B_4_C12_api_design_proposed: FALSE`
- `stage_13B_4_C12_schema_design_proposed: FALSE`
- `stage_13B_4_C12_openapi_changes_proposed: FALSE`
- `stage_13B_4_C12_sdk_changes_proposed: FALSE`
- `stage_13B_4_C12_frontend_changes_proposed: FALSE`
- `stage_13B_4_C12_language_changes_proposed: FALSE`
- `stage_13B_4_C12_activity_changes_proposed: FALSE`
- `stage_13B_4_C12_runtime_changes_proposed: FALSE`
- `stage_13B_4_C12_ws1_closure_claimed: FALSE`
- `stage_13B_4_C12_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C12_ws2_progress_claimed: FALSE`
- `stage_13B_4_C12_ws3_authorized: FALSE`
- `stage_13B_4_C12_ws5_closure_claimed: FALSE`
- `stage_13B_4_C12_next_gate_after_implementation: FT_1G_ACTIVITY_ALIGNMENT_AUTHORIZATION_GATE`

FT-1F can be opened safely because FT-1A through FT-1E are complete and legacy ambiguity remains the next WS-1 blocker. Authorization stays narrow: WS-1-side legacy distinction only, with explicit prohibition on WS-5 full implementation, WS-3 opening, and any closure claim.
