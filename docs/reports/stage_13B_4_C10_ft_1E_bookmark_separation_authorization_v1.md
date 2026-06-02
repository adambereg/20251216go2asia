# Stage 13B.4-C10 - FT-1E Bookmark Separation Authorization Gate

## 1. Executive Summary

Stage 13B.4-C10 is a governance and authorization report.

This document does not implement code, migrations, API design, schema design, OpenAPI changes, SDK changes, frontend changes, UI text changes, runtime rewrites, UI rewrites, or activity rewrites.

Accepted upstream state:

- Stage 13B.4-C1 completed with `FT_1A_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C3 completed with `FT_1B_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C6 completed with `FT_1C_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C8 completed with `FT_1D_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C9 completed with `CONTINUE_WS1_RECOMMENDED`.
- FT-1E has not yet been authorized.

Purpose of this document:

- decide whether FT-1E Bookmark Separation can be safely opened;
- define the authorization boundary for FT-1E if opened;
- preserve the primitive boundary that bookmark is not Private Repost, Private Note, retention runtime proof, or Authorial Post.

Recommendation:

`AUTHORIZED_FOR_FT_1E_IMPLEMENTATION`

Recommended authorization token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1E_BOOKMARK_SEPARATION_ONLY`

## 2. Current WS-1 Review

This section uses accepted reports only. It does not re-check code.

Current WS-1 state:

- FT-1A Retention Intent: complete.
- FT-1B Owner Visibility: complete.
- FT-1C Private Note: complete.
- FT-1D Retention Dedupe: complete.
- FT-1E Bookmark Separation: not implemented and not yet authorized before this gate.
- FT-1F Legacy Boundary: not implemented.
- FT-1G Activity Alignment: not implemented.
- FT-1H WS-1 Closure Evidence: not reached.

What is proven by accepted C1, C3, C6, and C8:

- Private Repost Intent can exist as post-transition owner-only retention.
- Owner visibility and non-owner absence are proven in accepted surfaces.
- Optional text on Private Repost is Private Note, not public repost commentary or Authorial Text.
- Retention dedupe is scoped to retention and does not use Private Note text as identity.
- Public/group propagation reposts and legacy-shaped repost rows do not satisfy retention dedupe.
- WS-3 remains unauthorized.
- WS-1 closure and Foundation Trio closure have not been claimed.

Remaining WS-1 gaps after C8/C9:

- bookmark/Reactions separation from Private Repost;
- legacy public/group repost distinction;
- activity/no-pressure alignment for Private Repost;
- WS-1 closure evidence rollup.

## 3. Bookmark Separation Problem Definition

FT-1E solves the primitive-boundary problem between Reactions bookmark and Space Private Repost.

Bookmark:

- is a Reactions-owned reaction fact;
- represents owner-qualified save/bookmark intent;
- is identified by actor, target, and reaction type;
- does not create Space retained context by itself;
- does not carry Private Note;
- does not publish, propagate, or author content.

Private Repost:

- is a Space-owned retained context for a source object;
- is owner-only after the post-transition FT-1A/FT-1B/FT-1C/FT-1D slices;
- may carry Private Note;
- has retention target binding;
- is not a Reactions bookmark fact.

Private Note:

- is optional owner-only text attached to Private Repost;
- is not bookmark metadata;
- is not Authorial Text;
- is not Source Reference.

Retention intent:

- is the semantic direction of keeping source context for myself;
- can be expressed through Private Repost runtime after FT-1A;
- must not be proven merely by presence of a bookmark fact or saved tab entry.

Authorial primitives:

- Authorial Post and Source Reference belong to WS-3;
- bookmark is not authorial expression;
- bookmark cannot be used as authorial signal, Blog candidate signal, group quality signal, or publication proof.

FT-1E therefore must prove separation, not merge:

- bookmark remains a reaction fact;
- Private Repost remains retained context;
- both may eventually coexist for the same source without one becoming proof of the other.

## 4. Primitive Boundary Review

Primitive-collapse risks currently under review:

- bookmark may be mistaken for Private Repost because both are retention-adjacent;
- saved surfaces may be mistaken for retained-context inventory;
- repost-shaped rows may still visually suggest saved/public propagation ambiguity;
- future Authorial Post work may be polluted if bookmark is treated as expression signal.

Boundaries FT-1E must preserve:

- bookmark is not Private Repost;
- bookmark is not Private Note;
- bookmark is not retention target binding;
- bookmark is not repost;
- bookmark is not Authorial Post;
- bookmark is not Source Reference;
- saved tab or saved surface is not proof that Private Repost exists;
- Private Repost duplicate handling must not use bookmark existence as dedupe proof;
- bookmark can be owner-qualified without becoming Space retained context;
- Private Repost can exist without requiring a Reactions bookmark.

Primitive boundary conclusion:

- there is enough accepted upstream runtime to authorize FT-1E;
- there is still enough primitive-collapse risk that the authorization must be narrow;
- FT-1E must establish observable proof of separation, not a UI label or copy distinction.

## 5. Scope Definition

In scope for FT-1E authorization:

- define bookmark as separate from Private Repost within WS-1 proof;
- prove that Reactions bookmark remains a reaction fact;
- prove that Private Repost remains Space retained context;
- prove that saved/bookmark surfaces are not counted as Private Repost inventory;
- prove that bookmark presence is not Private Repost dedupe proof;
- prove that bookmark absence does not invalidate Private Repost existence;
- preserve FT-1A, FT-1B, FT-1C, and FT-1D semantics;
- add observable proof in the later implementation report;
- document remaining WS-1 gaps after implementation.

Out of scope for FT-1E:

- FT-1F Legacy Boundary;
- FT-1G Activity Alignment;
- FT-1H WS-1 Closure Evidence;
- WS-2 public/group repost elimination;
- WS-3 Authorial Post;
- WS-3 Source Reference;
- WS-5 legacy taxonomy, distinction, conversion, deletion, hiding, or migration;
- WS-6 activity projection rewrite;
- WS-7 language/copy rewrite;
- WS-8 BV execution;
- universal bookmark rollout;
- broad `/space/saved` hub redesign;
- new targetType bookmark expansion;
- bookmark-to-Private-Repost merge;
- bookmark-based retention dedupe;
- bookmark-based authorial signal;
- DB schema changes;
- migrations;
- OpenAPI changes;
- SDK generation;
- broad frontend rewrite;
- UI-only separation as acceptance proof;
- language-only separation as acceptance proof.

FT-1E must not claim:

- WS-1 closure;
- Foundation Trio closure;
- WS-2 progress;
- WS-3 readiness;
- WS-3 authorization;
- legacy resolution;
- activity alignment;
- universal bookmark completion;
- language alignment.

## 6. False Pass Review

Scenario: saved tab used as Private Repost proof.

Verdict: `BLOCKING_FALSE_PASS`.

Reason: a saved tab or saved surface can display bookmark-derived or projection-derived items. It does not prove that Space retained context exists as Private Repost.

Scenario: bookmark merged with retention.

Verdict: `BLOCKING_SCOPE_VIOLATION`.

Reason: bookmark is a Reactions-owned reaction fact. Private Repost is Space retained context. FT-1E must separate the primitives, not collapse them into one object or identity.

Scenario: bookmark used as authorial signal.

Verdict: `BLOCKING_FALSE_PASS`.

Reason: bookmark is owner-qualified retention only. It is not Authorial Text, Authorial Post, Source Reference, publication, Blog candidate, group quality input, or expression signal.

Scenario: UI-only separation.

Verdict: `BLOCKING_FALSE_PASS`.

Reason: changing UI placement, labels, redirect, or button grouping does not prove primitive separation without observable runtime/service proof.

Scenario: language-only separation.

Verdict: `BLOCKING_FALSE_PASS`.

Reason: copy changes cannot be used as proof that bookmark remains a reaction fact and Private Repost remains retained context. WS-7 remains separate.

Additional blocking patterns:

- treating bookmark existence as Private Repost dedupe identity;
- treating Private Repost as a bookmark row;
- treating a saved count, saved badge, or saved list as retention-context proof;
- expanding universal bookmark target policy inside FT-1E;
- opening WS-3 automatically after FT-1E;
- claiming WS-1 closure after FT-1E alone.

## 7. Acceptance Framework

This is an authorization-level acceptance framework only. It does not define implementation details.

Positive acceptance criteria:

1. Bookmark remains a Reactions-owned reaction fact.
2. Private Repost remains Space retained context.
3. Bookmark is not Private Repost.
4. Bookmark is not Private Note.
5. Bookmark is not Authorial Post, Authorial Text, or Source Reference.
6. Saved/bookmark surfaces are not used as proof that Private Repost exists.
7. Bookmark presence is not used as Private Repost dedupe proof.
8. Private Repost can be reasoned about without requiring bookmark existence.
9. Bookmark and Private Repost may coexist for the same source without merging identity.
10. Proof is observable at runtime/service boundary, not UI-only or language-only.
11. FT-1A intent, FT-1B visibility, FT-1C Private Note, and FT-1D retention dedupe remain intact.
12. Implementation report explicitly lists remaining gaps: FT-1F, FT-1G, and FT-1H.

Negative acceptance blockers:

1. FT-1E claims WS-1 closure.
2. FT-1E claims Foundation Trio closure.
3. FT-1E claims WS-2 progress.
4. FT-1E claims WS-3 readiness or authorization.
5. FT-1E introduces Authorial Post or Source Reference behavior.
6. FT-1E changes legacy handling.
7. FT-1E suppresses or rewrites activity projection.
8. FT-1E rewrites language/copy as proof.
9. FT-1E expands universal bookmark target policy.
10. FT-1E treats saved tab as Private Repost inventory.
11. FT-1E merges bookmark and Private Repost identity.
12. FT-1E changes OpenAPI, SDK, schema, or migrations without stopping for a blocker.

Required proof shape for the later implementation report:

- observable bookmark-vs-Private-Repost separation proof;
- saved-surface non-proof review;
- coexistence or non-merge proof at primitive boundary;
- negative proof that bookmark is not authorial signal;
- forbidden-scope verification;
- drift review;
- explicit statement that WS-3 remains unauthorized.

## 8. Dependency Review

Interaction with FT-1F:

- FT-1E does not resolve legacy boundary.
- FT-1F remains required to distinguish legacy public/group repost rows from post-transition behavior.
- FT-1E reduces saved/bookmark ambiguity but does not classify legacy artifacts.

Interaction with FT-1G:

- FT-1E does not resolve activity alignment.
- FT-1G remains required to prove Private Repost does not create incoming social pressure.
- FT-1E must not suppress, rewrite, or reinterpret activity as proof.

Interaction with FT-1H:

- FT-1E is required input for WS-1 closure evidence.
- FT-1H remains blocked until FT-1E, FT-1F, and FT-1G are complete or explicitly carved out by governance.
- FT-1E completion alone must not claim WS-1 closure.

Interaction with future WS-3:

- FT-1E improves future save/publish reasoning by separating bookmark from retained context.
- FT-1E does not authorize Authorial Post, Source Reference, or WS-3 planning.
- FT-1E completion does not equal WS-3 readiness.
- Future WS-3 planning must still account for WS-5 legacy distinction and remaining WS-1 closure evidence.

Dependency conclusion:

- FT-1E is safe to authorize now.
- It is the correct next WS-1 primitive-boundary slice after FT-1D/C9.
- It does not remove the need for FT-1F, FT-1G, FT-1H, WS-5, or explicit WS-3 authorization.

## 9. Recommended Authorization Status

Recommended status:

`AUTHORIZED_FOR_FT_1E_IMPLEMENTATION`

Authorization wording:

Stage 13B.4-C10 authorizes only the bounded WS-1 implementation slice FT-1E Bookmark Separation. This authorization allows later implementation work only on proving that Reactions bookmark remains a reaction fact and Private Repost remains Space retained context. It does not authorize FT-1F, FT-1G, FT-1H, WS-2, WS-3, WS-5, WS-6, WS-7, WS-8, migrations, DB changes, OpenAPI changes, SDK changes, frontend rewrites, language rewrites, activity rewrites, legacy conversion, universal bookmark rollout, or closure claims.

Authorization token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1E_BOOKMARK_SEPARATION_ONLY`

## 10. Recommended Next Gate

After FT-1E implementation completes and is reviewed, the recommended next gate is:

`FT_1F_LEGACY_BOUNDARY_AUTHORIZATION_GATE`

Reason:

- FT-1E resolves bookmark-vs-retention primitive separation.
- Legacy public/group repost rows remain unclassified and still require WS-5-aware boundary work.
- FT-1G and FT-1H remain open after FT-1E.
- WS-3 must not open automatically after FT-1E.

Reserve later planning track:

- a paired WS-3 + WS-5 planning/authorization review may be considered after FT-1E review and with clearer FT-1F context;
- it must remain read-only and must not authorize FT-3A implementation.

Not recommended after FT-1E:

- automatic WS-3 authorization;
- WS-2 authorization;
- Foundation Trio closure gate;
- WS-1 closure rollup before FT-1F and FT-1G are addressed;
- bundling legacy, activity, or authorial work into FT-1E implementation.

## 11. Final Decision

Final decision:

`AUTHORIZED_FOR_FT_1E_IMPLEMENTATION`

Final tokens:

- `stage_13B_4_C10_status: AUTHORIZED_FOR_FT_1E_IMPLEMENTATION`
- `stage_13B_4_C10_authorization_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1E_BOOKMARK_SEPARATION_ONLY`
- `stage_13B_4_C10_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_PRIVATE_NOTE_AND_RETENTION_DEDUPE_ONLY`
- `stage_13B_4_C10_implementation_started: FALSE`
- `stage_13B_4_C10_migrations_proposed: FALSE`
- `stage_13B_4_C10_api_design_proposed: FALSE`
- `stage_13B_4_C10_schema_design_proposed: FALSE`
- `stage_13B_4_C10_openapi_changes_proposed: FALSE`
- `stage_13B_4_C10_sdk_changes_proposed: FALSE`
- `stage_13B_4_C10_frontend_changes_proposed: FALSE`
- `stage_13B_4_C10_language_changes_proposed: FALSE`
- `stage_13B_4_C10_activity_changes_proposed: FALSE`
- `stage_13B_4_C10_runtime_changes_proposed: FALSE`
- `stage_13B_4_C10_ws1_closure_claimed: FALSE`
- `stage_13B_4_C10_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C10_ws2_progress_claimed: FALSE`
- `stage_13B_4_C10_ws3_authorized: FALSE`
- `stage_13B_4_C10_bookmark_equals_private_repost: FALSE`
- `stage_13B_4_C10_bookmark_equals_private_note: FALSE`
- `stage_13B_4_C10_bookmark_equals_authorial_post: FALSE`
- `stage_13B_4_C10_next_gate_after_implementation: FT_1F_LEGACY_BOUNDARY_AUTHORIZATION_GATE`

FT-1E can be opened safely because FT-1A established retention intent, FT-1B established owner visibility, FT-1C established Private Note semantics, FT-1D established retention-scoped dedupe, and C9 recommended continuing WS-1 through Bookmark Separation. Authorization remains narrow: bookmark separation only, no WS-1 closure, no Foundation Trio closure, no WS-2 progress, and no WS-3 authorization.
