# Stage 13B.4-C7 — FT-1D Retention Dedupe Authorization Gate

## 1. Executive Summary

Stage 13B.4-C7 is a governance and authorization report.

This document does not implement code, migrations, API design, schema design, OpenAPI changes, SDK changes, frontend changes, UI text changes, runtime rewrites, UI rewrites, or activity rewrites.

Accepted upstream state:

- Stage 13B.4-C1 completed with `FT_1A_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C3 completed with `FT_1B_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C6 completed with `FT_1C_IMPLEMENTATION_COMPLETE`.
- FT-1D has not yet been authorized.

Purpose of this document:

- decide whether FT-1D Retention Dedupe can be safely opened;
- define the authorization boundary for FT-1D if opened;
- confirm the dependency rule that FT-1D is mandatory before any WS-3 authorization.

Recommendation:

`AUTHORIZED_FOR_FT_1D_IMPLEMENTATION`

Recommended authorization token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1D_RETENTION_DEDUPE_ONLY`

## 2. Current WS-1 Review

This section uses accepted reports only. It does not re-check code.

Current WS-1 state:

- FT-1A Retention Intent: complete.
- FT-1B Owner Visibility: complete.
- FT-1C Private Note: complete.
- FT-1D Retention Dedupe: not implemented and not yet authorized before this gate.
- FT-1E Bookmark Separation: not implemented.
- FT-1F / WS-5 Legacy Boundary: not implemented.
- FT-1G / WS-6 Activity Silence: not implemented.
- FT-1H WS-1 Closure Evidence: not reached.

What is proven by accepted C1, C3, and C6:

- save-for-myself can exist as post-transition Private Repost Intent;
- owner visibility and non-owner absence are proven in accepted surfaces;
- optional text on private retention is now Private Note, not repost commentary;
- Private Note is not Authorial Text, Source Reference, bookmark, or publication output;
- no WS-1 closure or Foundation Trio closure has been claimed.

Remaining WS-1 gaps:

- retention dedupe remains unscoped;
- bookmark and Private Repost remain separate unresolved primitives;
- legacy public/group repost rows remain unresolved historical artifacts;
- activity semantics remain deferred;
- WS-1 closure evidence is not available.

## 3. Dedupe Problem Definition

FT-1D solves the dedupe-scope problem inside post-transition Private Repost runtime.

Current dedupe behavior, as recorded by accepted C1/C6 drift:

- active repost dedupe is keyed broadly by author and target;
- it is not scoped to retention intent;
- it does not distinguish private retention from public/group propagation or legacy-shaped repost rows;
- an existing public or legacy repost can still block a private retention write for the same target.

Retention vs propagation conflict:

- Private Repost is owner-only retention.
- Propagation repost is public/group social distribution.
- A dedupe rule that treats both as the same object can collapse retention back into the old repost model.

Legacy collision risk:

- Existing public/group repost rows may be historical artifacts.
- FT-1D must not treat legacy rows as proof that private retention already exists.
- FT-1D must not delete, hide, migrate, reclassify, or convert legacy rows.

Future WS-3 blocking risk:

- Future Authorial Post behavior must not be blocked by private retention dedupe.
- A user must eventually be able to retain a source privately and also publish an Authorial Post about the same source under a separate WS-3 primitive.
- FT-1D therefore has a required negative proof target: retention dedupe must not block future Authorial Post behavior.

This section defines the problem only. It does not define implementation details, query design, schema design, API shape, or UI behavior.

## 4. Runtime Dependency Review

Interaction with FT-1A:

- FT-1A established the retention intent boundary.
- FT-1D depends on that boundary because dedupe must know the difference between private retention and propagation repost.
- This dependency is satisfied.

Interaction with FT-1B:

- FT-1B established owner visibility and non-owner absence for private retention.
- FT-1D must preserve owner-positive resolution and must not route retention duplicate handling through public feed/highlight semantics.
- This dependency is satisfied as a governance input.

Interaction with FT-1C:

- FT-1C established Private Note semantics on private retention rows.
- FT-1D must not treat note text as a dedupe key, Authorial Text, Source Reference, or publication content.
- This sequencing dependency is satisfied.

Dependency conclusion:

- all prerequisites needed to authorize FT-1D are complete;
- no dependency blocker prevents opening FT-1D;
- FT-1D remains high-risk and must be scoped narrowly.

## 5. Scope Definition

In scope for FT-1D authorization:

- define retention dedupe as a Private Repost Intent boundary;
- prove repeated owner retention for the same target resolves inside retention scope;
- prove public/group/legacy repost-shaped rows do not falsely prove that private retention exists;
- prove retention dedupe does not block future Authorial Post behavior;
- preserve FT-1A intent, FT-1B visibility, and FT-1C private-note semantics;
- add observable proof for retention dedupe behavior in the later implementation report;
- document remaining WS-1 gaps after implementation.

Out of scope for FT-1D:

- FT-1E bookmark separation;
- FT-1F legacy boundary handshake;
- FT-1G activity silence/alignment;
- FT-1H WS-1 closure rollup;
- WS-2 public/group repost elimination;
- WS-3 Authorial Post;
- WS-3 Source Reference;
- WS-5 legacy taxonomy, distinction, conversion, deletion, hiding, or migration;
- WS-6 activity projection rewrite;
- WS-7 language/copy rewrite;
- WS-8 BV execution;
- DB schema changes unless a later implementation stage reports a blocker and stops;
- migrations;
- OpenAPI changes;
- SDK generation;
- broad frontend rewrite;
- UI-only duplicate behavior as acceptance proof.

FT-1D must not claim:

- WS-1 closure;
- Foundation Trio closure;
- WS-2 progress;
- WS-3 readiness;
- WS-3 authorization;
- legacy resolution;
- bookmark separation;
- activity alignment;
- language alignment.

## 6. False Pass Review

Scenario: dedupe used as WS-2 progress.

Verdict: `BLOCKING_FALSE_PASS`.

Reason: dedupe scoping is not public/group repost elimination. FT-1D cannot claim write removal, button removal, feed cleanup, or WS-2 entry.

Scenario: dedupe used as WS-3 readiness.

Verdict: `BLOCKING_FALSE_PASS`.

Reason: FT-1D can remove one blocking risk for future WS-3, but it does not create Authorial Post, Source Reference, save/publish split, or WS-3 authorization.

Scenario: dedupe fixes through legacy masking.

Verdict: `BLOCKING_FALSE_PASS`.

Reason: hiding, deleting, reclassifying, or converting legacy rows belongs to WS-5/FT-1F and cannot be FT-1D proof.

Scenario: dedupe fixes through bookmark merge.

Verdict: `BLOCKING_SCOPE_VIOLATION`.

Reason: bookmark and Private Repost remain separate primitives. FT-1E owns bookmark separation; FT-1D cannot use Reactions bookmarks as dedupe proof.

Scenario: dedupe fixes through UI-only behavior.

Verdict: `BLOCKING_FALSE_PASS`.

Reason: suppressing a client action, changing a redirect, or showing "already saved" in UI does not prove retention-scoped dedupe without observable runtime proof.

Additional blocking patterns:

- using legacy row existence as Private Repost proof;
- treating propagation repost duplicate as private retention duplicate;
- changing activity to hide dedupe side effects;
- claiming Foundation Trio readiness after dedupe alone;
- opening WS-3 automatically after FT-1D.

## 7. Acceptance Framework

This is an authorization-level acceptance framework only. It does not define implementation details.

Positive acceptance criteria:

1. A repeated post-transition Private Repost Intent for the same owner and target is resolved within retention scope.
2. A public/group propagation repost does not falsely satisfy private retention dedupe.
3. A legacy public/group repost-shaped row does not mask absence of post-transition Private Repost.
4. Retention dedupe does not block future Authorial Post behavior about the same source.
5. Private Note remains secondary retention text and is not part of the dedupe identity.
6. Bookmark/Reactions behavior remains unchanged.
7. Proof is observable at runtime/service boundary, not UI-only or language-only.
8. Implementation report explicitly lists remaining WS-1 gaps, including FT-1E, FT-1F, FT-1G, and FT-1H.

Negative acceptance blockers:

1. FT-1D claims WS-1 closure.
2. FT-1D claims Foundation Trio closure.
3. FT-1D claims WS-2 progress.
4. FT-1D claims WS-3 readiness or authorization.
5. FT-1D introduces Authorial Post or Source Reference behavior.
6. FT-1D changes bookmark behavior.
7. FT-1D hides, reclassifies, deletes, migrates, or converts legacy rows.
8. FT-1D suppresses or rewrites activity projection.
9. FT-1D relies on UI-only duplicate handling as proof.
10. FT-1D changes OpenAPI, SDK, schema, or migrations without stopping for a blocker.

Required proof shape for the later implementation report:

- private-retention duplicate proof;
- public/propagation collision proof;
- legacy collision proof without legacy mutation;
- future Authorial Post non-blocking proof at governance/runtime boundary, without implementing WS-3;
- forbidden-scope verification;
- drift review;
- explicit statement that WS-3 remains unauthorized.

## 8. Dependency Rule Confirmation

Rule under review:

`FT-1D mandatory before WS-3 authorization`

Verdict:

`CONFIRMED`

Reason:

- Stage 13B.4-B defines the WS-1 to WS-3 dependency: Private Repost dedupe must not block Authorial Posts about the same source.
- Stage 13B.4-C4 identified FT-1D as mandatory before safe WS-3 progression.
- Stage 13B.4-C5 and C6 preserved the rule explicitly.
- The current accepted runtime still has unscoped dedupe as an open WS-1 gap.

Governance invariant:

- FT-1D is a prerequisite for any WS-3 authorization.
- FT-1D completion does not automatically authorize WS-3.
- WS-3 still requires its own explicit authorization gate.
- FT-1D cannot be used as WS-3 readiness proof by itself.

## 9. Recommended Authorization Status

Recommended status:

`AUTHORIZED_FOR_FT_1D_IMPLEMENTATION`

Authorization wording:

Stage 13B.4-C7 authorizes only the bounded WS-1 implementation slice FT-1D Retention Dedupe. This authorization allows work only on proving retention-scoped dedupe for post-transition Private Repost Intent and proving that retention dedupe does not block future Authorial Post behavior. It does not authorize FT-1E, FT-1F, FT-1G, FT-1H, WS-2, WS-3, WS-5, WS-6, WS-7, WS-8, migrations, DB changes, OpenAPI changes, SDK changes, frontend rewrites, language rewrites, activity rewrites, legacy conversion, bookmark merge, or closure claims.

Authorization token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1D_RETENTION_DEDUPE_ONLY`

## 10. Recommended Next Gate

After FT-1D implementation completes and is reviewed, the recommended next gate is:

`FT_1E_BOOKMARK_SEPARATION_SLICE_AUTHORIZATION_GATE`

Reason:

- FT-1E remains the next unresolved WS-1 primitive after dedupe.
- Bookmark/Reactions and Private Repost separation remains required before WS-1 closure.
- WS-3 must not open automatically after FT-1D.
- Foundation Trio closure remains blocked until WS-1, WS-3, and WS-5 are independently provable.

Not recommended after FT-1D:

- automatic WS-3 authorization;
- WS-2 authorization;
- Foundation Trio closure gate;
- WS-1 closure rollup before remaining WS-1 gaps are addressed;
- bundling FT-1E, WS-3, or WS-5 into FT-1D implementation.

Recommended next authorization token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1E_BOOKMARK_SEPARATION_ONLY`

## 11. Final Decision

Final decision:

`AUTHORIZED_FOR_FT_1D_IMPLEMENTATION`

Final tokens:

- `stage_13B_4_C7_status: AUTHORIZED_FOR_FT_1D_IMPLEMENTATION`
- `stage_13B_4_C7_authorization_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1D_RETENTION_DEDUPE_ONLY`
- `stage_13B_4_C7_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_AND_PRIVATE_NOTE_ONLY`
- `stage_13B_4_C7_implementation_started: FALSE`
- `stage_13B_4_C7_migrations_proposed: FALSE`
- `stage_13B_4_C7_api_design_proposed: FALSE`
- `stage_13B_4_C7_schema_design_proposed: FALSE`
- `stage_13B_4_C7_openapi_changes_proposed: FALSE`
- `stage_13B_4_C7_sdk_changes_proposed: FALSE`
- `stage_13B_4_C7_frontend_changes_proposed: FALSE`
- `stage_13B_4_C7_language_changes_proposed: FALSE`
- `stage_13B_4_C7_activity_changes_proposed: FALSE`
- `stage_13B_4_C7_runtime_changes_proposed: FALSE`
- `stage_13B_4_C7_ws1_closure_claimed: FALSE`
- `stage_13B_4_C7_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C7_ws2_progress_claimed: FALSE`
- `stage_13B_4_C7_ws3_authorized: FALSE`
- `stage_13B_4_C7_ft_1d_mandatory_before_ws3: TRUE`
- `stage_13B_4_C7_next_gate_after_implementation: FT_1E_BOOKMARK_SEPARATION_SLICE_AUTHORIZATION_GATE`

FT-1D can be opened safely because FT-1A established intent, FT-1B established owner visibility, FT-1C established private note semantics, and unscoped dedupe remains the next mandatory WS-1 blocker before any WS-3 authorization. Authorization remains narrow: Retention Dedupe only, no WS-1 closure, no Foundation Trio closure, no WS-2 progress, and no WS-3 authorization.
