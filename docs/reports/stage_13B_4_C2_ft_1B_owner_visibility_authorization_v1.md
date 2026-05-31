# Stage 13B.4-C2 — FT-1B Owner Visibility Authorization

## 1. Executive Summary

This is a governance and authorization report for Stage 13B.4-C2.

It does not implement code, migrations, schema changes, OpenAPI changes, SDK changes, frontend changes, UI copy changes, activity changes, group feed changes, or runtime rewrites.

Accepted upstream gates:

- Stage 13B.4-A: accepted.
- Stage 13B.4-B: accepted.
- Stage 13B.4-C0: accepted.
- Stage 13B.4-C1: completed with `FT_1A_IMPLEMENTATION_COMPLETE`.

Current runtime state:

- `stage_13B_4_C2_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_ONLY`
- `stage_13B_4_C2_ft_1a_status: FT_1A_IMPLEMENTATION_COMPLETE`
- `stage_13B_4_C2_ft_1b_implementation_started: FALSE`
- `stage_13B_4_C2_ws1_closure_claimed: FALSE`
- `stage_13B_4_C2_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C2_bv_execution: NOT_AUTHORIZED`

FT-1A created the retention intent boundary and introduced `Private Repost Intent` as a separate runtime concept. It intentionally did not implement owner visibility, private note semantics, retention dedupe, bookmark separation, Authorial Post, Source Reference, legacy distinction, activity alignment, group feed alignment, or language alignment.

The purpose of this document is to decide whether FT-1B Owner Visibility can be safely opened and, if yes, what its authorization boundary must be.

Recommendation:

`AUTHORIZED_FOR_FT_1B_IMPLEMENTATION`

Recommended implementation token for the next stage:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1B_OWNER_VISIBILITY_ONLY`

## 2. FT-1A Completion Review

FT-1A completion is accepted based on `docs/reports/stage_13B_4_C1_ft_1A_retention_intent_implementation_v1.md`.

This report does not re-review FT-1A code. It uses the accepted FT-1A completion report as the governing input.

FT-1A completed these required outcomes:

- Retention intent exists as a separate runtime concept.
- Object-bound retention create is no longer forced to mean public/group repost.
- `Private Repost Intent` exists as the first post-transition primitive.
- FT-1A did not create Authorial Post.
- FT-1A did not create Source Reference.
- FT-1A did not classify legacy rows.
- FT-1A did not align activity.
- FT-1A did not change group feed semantics.
- FT-1A did not change language/copy.
- FT-1A did not claim WS-1 closure.
- FT-1A did not claim Foundation Trio closure.

Open gaps carried forward from FT-1A:

- Owner visibility is not implemented.
- Private note model is not implemented.
- Retention dedupe remains unscoped.
- Bookmark separation is not implemented.
- Activity still carries repost-shaped semantics.
- Group feed alignment is not implemented.
- Language/copy remains pre-transition.
- Legacy rows remain unclassified.

Blocker assessment for FT-1B:

- No blocker prevents opening FT-1B.
- The remaining gaps are expected because FT-1A was intentionally narrow.
- FT-1B must not treat those gaps as permission to bundle adjacent slices.
- Activity, dedupe, bookmark, private note, legacy, language, Authorial Post, and Source Reference remain outside FT-1B.

## 3. FT-1B Scope Definition

FT-1B purpose:

Define and authorize the owner visibility boundary for post-transition `Private Repost Intent`.

FT-1B owns:

- owner can access retained context;
- non-owner cannot access retained context through owner/public/profile/direct-link surfaces inside the authorized boundary;
- private retention is not represented as public/group publication;
- private retention is not counted as authorial/public output inside authorized visibility surfaces;
- post-transition private retention has a positive owner-access path rather than only hidden public absence;
- implementation proof must use observable behavior, not copy changes or hidden UI.

FT-1B does not own:

- FT-1C private note model;
- FT-1D retention dedupe;
- FT-1E bookmark separation;
- FT-1F legacy handshake;
- FT-1G activity silence contract;
- FT-1H WS-1 closure evidence;
- WS-2 public/group repost elimination;
- WS-3 Authorial Post or Source Reference;
- WS-4 group feed authorial-only alignment;
- WS-5 legacy taxonomy or distinction;
- WS-6 activity projection alignment;
- WS-7 language/copy alignment;
- WS-8 BV execution.

FT-1B must not claim:

- full WS-1 closure;
- Foundation Trio closure;
- public repost elimination;
- legacy resolution;
- activity alignment;
- language alignment;
- BV readiness.

## 4. Visibility Surface Inventory

This inventory lists runtime surfaces where Private Repost owner visibility may manifest. It is analysis only and does not authorize implementation outside the boundary in Section 6.

| Surface | Current post-FT-1A condition | FT-1B relevance |
| --- | --- | --- |
| Owner-only retention surface | No dedicated owner retention surface exists yet | Primary positive proof surface |
| Home feed | Owner can see own private rows because owner rows are included; row can still look like feed repost | High relevance, high false-pass risk |
| Profile feed | Owner can see own private rows; non-owner is filtered by service visibility checks | High relevance |
| Profile/publications surface | Private repost-shaped rows can still be counted or framed as repost/publication | High relevance |
| Direct link / getPost | Existing `visibility: private` logic allows owner and rejects non-owner | Core observable proof surface |
| Highlight links | FT-1A still links to `/space/feed?highlight=...` | High relevance as destination risk |
| Group feed | Private rows do not match `visibility: group`; legacy group repost remains separate | Bounded relevance only |
| Activity | Repost-shaped activity semantics remain | Inventory only; forbidden for FT-1B |
| Search | No current Space post search surface was identified | Guardrail only |
| Counters / filters | Repost counters and filters can include private rows in owner-visible social buckets | High relevance where tied to owner/publication visibility |
| Saved/bookmark | Reactions bookmark surface remains separate | Inventory only; forbidden for FT-1B |
| Domain events | `space.post.reposted` exists for repost-shaped writes | Bounded relevance only; no consumer rewrite |
| Source author discovery | Possible through activity for some `space_post` repost flows | WS-6 / FT-1G risk, not FT-1B implementation scope |
| Legacy repost rows | Existing public/group rows still visible by legacy behavior | WS-5 risk, not FT-1B scope |
| UI copy | Still says repost/publish/share | WS-7 risk, not FT-1B scope |

## 5. Owner Visibility Risk Review

| Surface | Risk | Dependency | False-pass possibility |
| --- | --- | --- | --- |
| Owner-only retention surface | High if absent | FT-1A intent | Empty public feed could be mistaken for owner visibility |
| Home feed | High | Feed read model | Private row hidden from public but still treated as social feed item |
| Profile feed | High | Profile read model and `canViewPost` | Non-owner absence claimed while owner has no proper retention context |
| Profile/publications | High | Profile surface classification | Private retention counted as publication/repost |
| Direct link / getPost | Medium | Service visibility check | 403 for non-owner claimed as enough without owner positive proof |
| Highlight links | High | Post-write destination semantics | Public feed URL remains canonical retention destination |
| Group feed | Medium | WS-4 and WS-5 later | Private row absence used to claim group feed alignment |
| Activity | High | WS-6 later | Activity suppression or UI cleanup counted as FT-1B |
| Search | Low current, high future | Future search work | Missing search surface treated as proof |
| Counters / filters | High | Feed/profile surfaces | Counters cleaned without proving owner access |
| Saved/bookmark | Medium | FT-1E later | Saved tab treated as Private Repost surface |
| Domain events | Medium | Future consumers | Event label treated as social proof or notification |
| Legacy repost rows | High | WS-5 later | Legacy hiding masks missing post-transition proof |
| UI copy | High | WS-7 later | Text rename treated as semantic alignment |

No risk requires blocking FT-1B authorization if the authorization boundary is narrow and explicit.

## 6. Authorization Boundary

FT-1B may authorize only owner visibility work for post-transition `Private Repost Intent`.

Allowed FT-1B surfaces:

- positive owner-only retention access surface;
- direct owner/non-owner access proof for a post-transition private retention row;
- profile/feed read classification only where needed to prove private retention is not public authorial output;
- owner post-write resolution/destination semantics only where needed to avoid public feed as the canonical retention destination;
- owner discovery of an existing private retention row, without changing dedupe rules;
- counters/filters only where required to prevent private retention from being counted as public/profile publication output;
- bounded group-surface assertion that post-transition private retention is not group content, without implementing WS-4;
- bounded event/audience documentation that private retention must not be treated as public propagation, without implementing notification or activity consumers.

Forbidden in FT-1B:

- FT-1C private note model or note UX semantics;
- FT-1D dedupe rewrite or dedupe scoping;
- FT-1E bookmark/saved surface merge or separation implementation;
- FT-1F/WS-5 legacy taxonomy, migration, hiding, deletion, conversion, or carve-out;
- FT-1G/WS-6 activity projection rewrite, suppression, or UI alignment;
- WS-2 public/group repost write blocking or button removal;
- WS-3 Authorial Post, Source Reference, authorial profile taxonomy, or source pointer design;
- WS-4 group feed authorial-only filtering;
- WS-7 language/copy rewrite;
- WS-8 BV execution;
- DB schema changes, migrations, OpenAPI changes, SDK generation, broad cleanup, or hidden UI-only changes.

Authorization principle:

FT-1B may prove owner visibility, but it must not try to close every WS-1 negative target. Any unresolved activity, legacy, note, dedupe, bookmark, language, or WS-2 behavior must remain documented debt rather than silently fixed or counted as pass evidence.

## 7. False Pass Review

Scenario: "not shown" instead of "owner-only".

Verdict: BLOCKING FALSE PASS if used alone. FT-1B requires both owner-positive access and non-owner absence inside authorized surfaces.

Scenario: hiding UI.

Verdict: BLOCKING FALSE PASS. Removing a card/button/filter without proving semantic owner visibility is not alignment.

Scenario: activity suppression.

Verdict: OUT OF SCOPE. Suppressing activity belongs to FT-1G / WS-6. FT-1B must document activity drift, not fix it or claim it.

Scenario: profile cleanup.

Verdict: CONDITIONAL. FT-1B may prevent private retention from appearing as public/profile publication output, but must not implement full Authorial Post profile taxonomy or WS-5 legacy handling.

Scenario: language rewrite.

Verdict: OUT OF SCOPE. Copy changes belong to WS-7 and cannot be FT-1B acceptance evidence.

Scenario: legacy masking.

Verdict: BLOCKING FALSE PASS. Hiding or reclassifying legacy public/group repost rows would be WS-5 scope creep and cannot prove post-transition owner visibility.

Scenario: group feed absence.

Verdict: CONDITIONAL. It is acceptable to verify post-transition private retention is not group content, but this does not authorize WS-4 group feed alignment.

Scenario: saved/bookmark reuse.

Verdict: OUT OF SCOPE. The saved/bookmark surface remains Reactions-owned until FT-1E.

Scenario: dedupe behavior changes.

Verdict: OUT OF SCOPE. Retention dedupe belongs to FT-1D.

Scenario: Source Reference or Authorial Post creation.

Verdict: BLOCKING SCOPE VIOLATION. FT-1B cannot implement WS-3.

## 8. FT-1B Acceptance Framework

This is an authorization-level framework only. It does not define implementation details, schema, API shape, route design, component design, or migration strategy.

Positive acceptance criteria:

1. A post-transition Private Repost Intent has an observable owner-access path.
2. The owner can access retained context without relying on public/group publication semantics.
3. A non-owner cannot access the same post-transition private retention row through direct link or authorized read surfaces.
4. A post-transition Private Repost Intent is not represented as public/group content in the authorized surfaces.
5. A post-transition Private Repost Intent is not counted as authorial/profile publication output in the authorized surfaces.
6. Owner visibility proof does not rely on UI hiding, copy changes, or removed buttons.
7. FT-1B implementation remains distinguishable from FT-1C, FT-1D, FT-1E, WS-3, WS-5, WS-6, and WS-7.
8. The implementation report after FT-1B must explicitly list remaining WS-1 gaps.

Negative acceptance blockers:

1. FT-1B claims WS-1 closure.
2. FT-1B claims Foundation Trio closure.
3. FT-1B implements private note semantics.
4. FT-1B changes dedupe rules.
5. FT-1B merges or rewrites bookmark/saved behavior.
6. FT-1B classifies or hides legacy rows.
7. FT-1B suppresses or rewrites activity projection.
8. FT-1B changes UI language/copy as proof.
9. FT-1B blocks public/group repost writes as WS-2 proxy.
10. FT-1B introduces Authorial Post or Source Reference behavior.

Required proof shape for the later implementation report:

- owner positive proof;
- non-owner absence proof;
- public/group absence proof for post-transition private retention inside authorized surfaces;
- publication/counter exclusion proof where those surfaces are touched;
- forbidden-scope verification;
- runtime drift review;
- explicit statement that BV execution remains unauthorized.

## 9. Recommended Authorization Status

Recommended status:

`AUTHORIZED_FOR_FT_1B_IMPLEMENTATION`

Authorization wording:

Stage 13B.4-C2 authorizes only the next bounded WS-1 implementation slice: FT-1B Owner Visibility. This authorization allows work only on proving owner-only visibility for post-transition Private Repost Intent within the explicitly authorized surfaces. It does not authorize FT-1C, FT-1D, FT-1E, WS-2, WS-3, WS-5, WS-6, WS-7, WS-8, DB/schema migrations, OpenAPI changes, SDK generation, language rewrite, activity rewrite, group feed alignment, legacy taxonomy, or broad cleanup.

Recommended token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1B_OWNER_VISIBILITY_ONLY`

## 10. Next Gate

If FT-1B implementation completes successfully, the next gate should be:

`FT_1C_PRIVATE_NOTE_SLICE_AUTHORIZATION_GATE`

Reason:

- FT-1A established intent.
- FT-1B should establish owner visibility.
- The next unresolved WS-1 primitive is private note semantics.
- FT-1C must remain separate from retention dedupe, bookmark separation, legacy distinction, activity alignment, WS-3, and WS-2.

If FT-1B implementation is blocked, the blockers to resolve should be limited to:

- inability to prove owner-positive access;
- inability to prove non-owner absence in authorized surfaces;
- unavoidable dependency on forbidden activity, legacy, dedupe, bookmark, language, schema, OpenAPI, or WS-3 work.

## 11. Final Decision

Final decision:

`AUTHORIZED_FOR_FT_1B_IMPLEMENTATION`

FT-1B is safe to open because FT-1A established the required retention intent boundary and no blocker prevents the next owner visibility slice.

Authorization is narrow:

- owner visibility only;
- post-transition Private Repost Intent only;
- no WS-1 closure;
- no Foundation Trio closure;
- no downstream workstreams;
- no activity, language, legacy, dedupe, bookmark, Authorial Post, Source Reference, OpenAPI, SDK, DB, or migration work.

Final tokens:

- `stage_13B_4_C2_status: AUTHORIZED_FOR_FT_1B_IMPLEMENTATION`
- `stage_13B_4_C2_authorization_token: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1B_OWNER_VISIBILITY_ONLY`
- `stage_13B_4_C2_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_ONLY`
- `stage_13B_4_C2_implementation_started: FALSE`
- `stage_13B_4_C2_migrations_proposed: FALSE`
- `stage_13B_4_C2_api_design_proposed: FALSE`
- `stage_13B_4_C2_schema_design_proposed: FALSE`
- `stage_13B_4_C2_openapi_changes_proposed: FALSE`
- `stage_13B_4_C2_sdk_changes_proposed: FALSE`
- `stage_13B_4_C2_frontend_changes_proposed: FALSE`
- `stage_13B_4_C2_language_changes_proposed: FALSE`
- `stage_13B_4_C2_activity_changes_proposed: FALSE`
- `stage_13B_4_C2_group_feed_changes_proposed: FALSE`
- `stage_13B_4_C2_ws1_closure_claimed: FALSE`
- `stage_13B_4_C2_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C2_next_gate_after_implementation: FT_1C_PRIVATE_NOTE_SLICE_AUTHORIZATION_GATE`
