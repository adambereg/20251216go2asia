# Stage 13B.3-F - WS-6 Activity Projection Specification

## Execution mode

Runtime alignment specification / read-only.

This slice prepares the runtime alignment specification for WS-6 - Activity Projection Alignment, as defined in Stage 13B.2-I.

This is not an implementation slice. It does not design or change:

- code;
- frontend implementation;
- backend implementation;
- event schema;
- API routes;
- OpenAPI;
- SDK/types;
- DB schema;
- migrations;
- SQL plans;
- data conversion;
- UI screens or components;
- notification systems;
- Private Repost doctrine;
- Authorial Post doctrine;
- Source Reference doctrine;
- Group Feed doctrine;
- Legacy Policy;
- Blog Candidate doctrine;
- moderation systems;
- ranking algorithms;
- recommendation algorithms;
- economy, points, rewards, Quest proof, RF claim, or commercial authority.

No tests were run. No runtime changes were made.

Task type: activity projection target semantics specification.

Risk level: HIGH, because current activity runtime still materializes repost as outgoing social propagation and incoming social pressure, while frozen Stage 13B.2 canon requires Private Repost to be owner-only context and prevents activity from reconstructing repost chains, discussions, Group Feed content, economy, or Blog authority.

## Agents

Multi-agent mode was activated using the `docs/ai` role model.

- Lead: AI Program Director / Orchestrator.
- Requirements Analyst.
- Software Architect.
- Runtime Governance Architect.
- Product Analyst.
- Delivery Planner.
- Technical Canon Writer.
- QA Agent.

Review gates:

- Requirements Review.
- Architecture Review.
- Runtime Governance Review.
- QA Review.
- Canon Review.

## Scope

This report focuses only on WS-6.

WS-6 owns:

- target runtime semantics of Space activity projection;
- conceptual activity taxonomy;
- allowed and forbidden activity meanings after repost/authorial/group alignment;
- relationship between activity and Private Repost, Authorial Post, Source Reference, Group Feed, and legacy activity;
- conceptual verification targets for future runtime alignment.

WS-6 does not own:

- Private Repost surface definition or retention behavior;
- Authorial Post or Source Reference doctrine;
- Group Feed authorial-only read policy;
- Public Repost elimination doctrine;
- Legacy Policy redesign;
- Blog Candidate workflow;
- event schema;
- activity projection implementation;
- notification systems;
- language/copy quarantine implementation;
- OpenAPI, SDK, DB, routes, screens, components, queries, or event payloads;
- moderation, ranking, recommendation, reward, or economy design.

## Canon anchors

Stage 13B.2 doctrine is frozen. This report does not change it.

Approved canon used by WS-6:

- Stage 13B.2-C: repost is private user context; public/group repost is a doctrine mismatch.
- Stage 13B.2-D: Authorial Post is standalone authored material.
- Stage 13B.2-E: public/group repost is deprecated as expression.
- Stage 13B.2-F: Source Reference is one-hop context on Authorial Post, not a reply, repost, quote, or chain.
- Stage 13B.2-G: Private Repost is owner-only retention; legacy rows and activity are deprecated artifacts.
- Stage 13B.2-H: Group Feed cultivates authorial material and activity is not content, quality, economy, or Blog authority.
- Stage 13B.2-I: WS-6 removes incoming social pressure from the new Private Repost doctrine, prevents discussion-chain reconstruction, keeps repost-note edits silent, and keeps activity separate from economy and Blog candidate authority.
- Stage 13B.3-A: WS-1 defines Private Repost as owner-only context with no incoming pressure.
- Stage 13B.3-B: WS-3 defines Authorial Post and Source Reference; Source Reference is not an activity event.
- Stage 13B.3-C: WS-5 defines legacy activity as historical carve-out, not post-transition doctrine.
- Stage 13B.3-D: WS-2 defines that public repost activity meanings must cease for post-transition behavior.
- Stage 13B.3-E: WS-4 defines that activity is not Group Feed content.

Fundamental canon:

The user does not answer a publication. The user publishes their own material. Other materials are context, inspiration, or source.

Dependency path:

WS-1 + WS-3 + WS-5 -> WS-2 -> WS-4 -> WS-6 -> WS-7 -> WS-8.

## SECTION 1 - Current Activity Runtime

Current runtime state: `RUNTIME_PRE_TRANSITION`.

Current activity runtime concepts:

| Runtime concept | Current evidence | Current activity meaning |
| --- | --- | --- |
| Activity projection storage | `space_activity_projection` is written by Space and Reactions services through projection rows | Activity is a per-recipient read projection |
| Activity read route | `/v1/space/feed/activity` supports `all`, `incoming`, and `my_actions` filters | Activity is organized by direction |
| Outgoing post activity | `materializeOutgoingPostActivity` maps non-repost posts to `space.post_created` | A normal post is an outgoing social action |
| Outgoing repost activity | `materializeOutgoingPostActivity` maps repost posts to `space.repost_created` | Repost is currently outgoing social propagation |
| Incoming repost pressure | `materializeIncomingRepostActivity` creates `space.post_reposted_by_other` for reposts of another user's `space_post` | Repost can notify the original author and create social pressure |
| Group membership activity | `materializeGroupJoinedActivity` creates `space.group_joined` | Group join is outgoing social projection |
| Incoming like activity | Reactions service can project `space.post_liked_by_other` | Like is bounded incoming social projection for Space posts |
| Activity row retraction | Activity rows can be soft-removed when related posts, group joins, or likes are removed | Activity follows owner facts and can be retracted |
| Activity UI filters | `ActivityPageClient.tsx` has "Все", "Входящие", "Мои действия" and type filter "Репосты" | Repost is a visible activity category |
| Activity repost copy | Activity titles include "Вы сделали репост" and "сделал(а) репост вашей публикации" | Activity teaches repost as public/social behavior |
| Activity highlight CTA | Activity hrefs for `space_post` use `/space/feed?highlight=...`; repost-related CTA can show "Открыть репост" | Activity can route into public repost highlight semantics |
| Activity boundary copy | Activity footer states that the surface is not notifications, not feed duplication, not Connect ledger, and not economy | Projection boundary is partially aligned in copy |

Current baseline tokens:

```text
ws_6_runtime_baseline: RUNTIME_PRE_TRANSITION
ws_6_repost_created_public_social_proof: ACTIVE_PRE_TRANSITION
ws_6_post_reposted_by_other_incoming_pressure: ACTIVE_PRE_TRANSITION
ws_6_repost_activity_filter_category: ACTIVE_PRE_TRANSITION
ws_6_activity_highlight_repost_cta: ACTIVE_PRE_TRANSITION
ws_6_activity_chain_reconstruction_risk: ACTIVE_RISK
ws_6_private_repost_activity_silence: PARTIAL_PATCH_NOTE_ONLY
ws_6_authorial_post_activity_boundary: UNDIFFERENTIATED_PRE_TRANSITION
ws_6_legacy_activity_indistinguishable: ACTIVE_RISK
ws_6_activity_economy_boundary: PARTIALLY_ALIGNED_COPY_ONLY
```

## SECTION 2 - Canon Position

Activity is a bounded projection surface. It can describe selected recent Space-related actions for the viewer, but it does not create canonical owner facts and must not become a replacement for feeds, notifications, economy, Blog curation, or discussion mechanics.

According to Stage 13B.2 canon and accepted Stage 13B.3 workstreams, Activity should represent:

- owner-relevant social projection;
- bounded incoming signals that do not create propagation pressure;
- outgoing authorial publication signals where they remain distinct from repost;
- group membership actions;
- legacy activity only as distinguishable historical carve-out;
- projection of existing facts, not ownership of the facts.

Activity should not represent:

- public repost as canonical expression;
- incoming repost pressure for new Private Reposts;
- repost chains or repost-of-post discussion ancestry;
- Source Reference as a standalone event;
- Group Feed content;
- bookmark/private retention as public propagation;
- Blog candidate authority;
- economy, reward, Quest proof, RF claim, or commercial authority;
- notification system design.

Canon position tokens:

```text
ws_6_canon_activity_is_projection_only: TRUE
ws_6_canon_activity_not_content_feed: TRUE
ws_6_canon_activity_not_notification_system: TRUE
ws_6_canon_activity_not_economy_authority: TRUE
ws_6_canon_activity_not_blog_authority: TRUE
ws_6_canon_activity_not_group_content: TRUE
ws_6_canon_no_repost_chain_reconstruction: TRUE
ws_6_canon_no_incoming_pressure_for_private_repost: TRUE
```

This section references frozen doctrine only. It does not redefine Private Repost, Authorial Post, Source Reference, Group Feed doctrine, Legacy Policy, or Blog Candidate.

## SECTION 3 - Activity Runtime Taxonomy

WS-6 taxonomy is conceptual. It is not an event schema, API, DB, route, UI, query, SDK, or migration design.

| Activity semantic category | Current pre-transition meaning | Target post-transition role | Classification |
| --- | --- | --- | --- |
| Outgoing repost activity | `space.repost_created` means "I reposted" as social propagation | Must not remain public/social proof for post-transition Private Repost | TRANSFORM / SILENCE |
| Incoming repost pressure | `space.post_reposted_by_other` means another user reposted your post | Must not exist for post-transition Private Repost | REMOVE |
| Authorial publication activity | `space.post_created` means generic post creation | Allowed as publication-class activity when distinct from repost | ALLOW |
| Incoming like activity | `space.post_liked_by_other` means someone liked your Space post | Allowed as bounded incoming social signal | ALLOW_BOUNDED |
| Group joined activity | `space.group_joined` means the viewer joined a group | Allowed as membership projection | ALLOW |
| Bookmark/save activity | Not active canonical Space activity class in current runtime | Must not become public propagation or social pressure | FORBID_AS_PROPAGATION |
| Private note edit activity | PATCH repost commentary is currently silent | Must remain silent for private note edits | SILENCE |
| Source Reference activity | Absent as a runtime class | Must not become standalone pressure or event | FORBID |
| Legacy repost activity | Historical `repost_created` / `post_reposted_by_other` may exist | Legacy carve-out only, distinguishable from post-transition behavior | LEGACY_CARVE_OUT |
| Activity filter "Репосты" | Repost is a first-class activity category | Must not teach post-transition repost as active social taxonomy | DEPRECATE / TRANSFORM |
| Activity-as-content | Activity is visually adjacent to feed/deep-link surfaces | Forbidden as Group Feed or publication content | FORBID |

Taxonomy tokens:

```text
ws_6_taxonomy_repost_as_social_proof: DEPRECATE_POST_TRANSITION
ws_6_taxonomy_incoming_repost_pressure: REMOVE_POST_TRANSITION
ws_6_taxonomy_legacy_repost_activity: LEGACY_CARVE_OUT
ws_6_taxonomy_authorial_post_activity: ALLOW
ws_6_taxonomy_incoming_like_activity: ALLOW_BOUNDED
ws_6_taxonomy_group_join_activity: ALLOW
ws_6_taxonomy_bookmark_as_activity: FORBID_AS_PROPAGATION
ws_6_taxonomy_activity_as_group_content: FORBID
```

## SECTION 4 - Allowed Activity Semantics

Allowed Activity semantics are conceptual. This section does not choose event payloads, routes, storage, UI, or notification behavior.

| Allowed activity meaning | Preconditions | Must remain true |
| --- | --- | --- |
| Authorial Post created | Expression happens through Authorial Post, not repost | Activity reflects authored publication, not propagation |
| Incoming like on `space_post` | Bounded Reactions fact projection | Social-only; not reward, economy, ranking, or quality signal |
| Group joined | Membership fact exists | Not content propagation and not Group Feed content |
| Legacy repost activity display | WS-5 carve-out only | Historical artifact; not doctrine reactivation |
| Owner-context private retention reference, if any | WS-1 boundary only | Owner-only or silent; no source-author pressure |
| Activity row retraction | Source fact is removed or no longer active | Projection follows facts and does not own them |

Allowed activity tokens:

```text
ws_6_allowed_authorial_post_activity: TRUE
ws_6_allowed_incoming_like_bounded: TRUE
ws_6_allowed_group_joined: TRUE
ws_6_allowed_legacy_activity_carve_out: TRUE
ws_6_allowed_owner_context_private_reference: CONDITIONAL_WS_1_ONLY
ws_6_allowed_projection_retraction: TRUE
```

## SECTION 5 - Forbidden Activity Semantics

Forbidden Activity semantics are invalid in the target post-transition model. This section does not define deletion, migration, hiding, moderation, ranking, recommendation, or notification delivery.

| Forbidden activity meaning | Classification | Why |
| --- | --- | --- |
| Public repost social proof | FORBID_POST_TRANSITION | WS-2: repost is not public/group expression |
| `post_reposted_by_other` for new Private Repost | FORBID_POST_TRANSITION | WS-1: no source-author pressure |
| Repost chain reconstruction via activity links | FORBID | Anti-forum and one-hop doctrine |
| Activity-as-content in Group Feed | FORBID | WS-4: activity is not group content |
| Bookmark/save as activity propagation | FORBID | Retention is not public social propagation |
| Source Reference as activity event | FORBID | WS-3: Source Reference is secondary context only |
| Repost note edit as public/social signal | FORBID | WS-1: private note edits are silent |
| Economy, reward, Quest proof, RF authority | FORBID | Activity is projection-only |
| Blog candidate signal from activity | FORBID | Blog owns curated publication; activity volume is not quality |
| Legacy activity as proof of canonical repost | FORBID_AS_NORM | WS-5: legacy is carve-out only |
| Discussion ancestry, reply graph, or quote-post propagation | FORBID | Go2Asia is not building forum mechanics |

Forbidden activity tokens:

```text
ws_6_forbidden_public_repost_social_proof: TRUE
ws_6_forbidden_incoming_repost_pressure: TRUE
ws_6_forbidden_repost_chain_reconstruction: TRUE
ws_6_forbidden_activity_as_group_content: TRUE
ws_6_forbidden_bookmark_as_activity: TRUE
ws_6_forbidden_source_reference_as_activity: TRUE
ws_6_forbidden_private_note_edit_activity: TRUE
ws_6_forbidden_economy_from_activity: TRUE
ws_6_forbidden_blog_authority_from_activity: TRUE
ws_6_forbidden_legacy_as_canonical_norm: TRUE
```

## SECTION 6 - Relationship to Private Repost

WS-6 inherits Private Repost semantics from WS-1 and does not redesign them.

Target relationship:

- new Private Repost must not create incoming `post_reposted_by_other` or equivalent source-author pressure;
- new Private Repost must not function as public/social proof;
- outgoing activity for private retention, if retained conceptually, must be owner-context only or silent;
- private note edit remains silent;
- activity must not expose Private Repost to non-owner, public, group, profile, or Blog surfaces;
- activity must not reconstruct a repost chain from a private retention action;
- activity must not merge Private Repost with bookmark/save facts.

Private Repost activity boundary:

| Concern | WS-6 target relationship |
| --- | --- |
| Create private retention | Owner-context or silent; no public propagation |
| Source author | No incoming pressure |
| Non-owner | No discovery through activity |
| Private note edit | Silent |
| Bookmark relation | Separate primitive; not activity propagation |
| Dedupe | Must not create public duplicate/social proof semantics |

## SECTION 7 - Relationship to Authorial Post

WS-6 inherits Authorial Post and Source Reference semantics from WS-3 and Group Feed semantics from WS-4. It does not redesign them.

Target relationship:

- Authorial Post may have publication-class outgoing activity;
- Authorial activity must remain distinct from repost activity;
- Source Reference on Authorial Post must not create standalone activity;
- Source Reference must not create incoming source-author pressure;
- Authorial Post activity must not imply reply, quote, comment, repost, or discussion ancestry;
- Group Authorial Post activity, if represented, must not become Group Feed content;
- activity volume must not become quality, Blog candidacy, ranking, or reward proof.

Authorial activity boundary:

| Concern | WS-6 target relationship |
| --- | --- |
| Authorial Post creation | Allowed as publication-class projection |
| Source Reference | No standalone activity, no incoming pressure |
| Group Feed | Activity is separate from group content |
| Blog candidate | No automatic activity-based authority |
| Repost chain | Not reconstructed through authorial activity |
| Weak content | Not made valid by activity volume |

## SECTION 8 - Legacy Activity Boundary

WS-6 interacts with WS-5 legacy carve-outs but does not redesign Legacy Policy.

Legacy activity principles:

- legacy `space.repost_created` and `space.post_reposted_by_other` rows are historical activity under the old social propagation model;
- legacy activity must not prove that new Private Repost should create activity;
- legacy activity must not become Authorial Post, Source Reference, Group Feed content, Blog candidate input, or economy authority;
- legacy activity must not reconstruct discussion chains;
- legacy activity must be distinguishable from post-transition Private Repost and Authorial Post behavior.

Boundary matrix:

| Activity concern | Post-transition WS-6 target | WS-5 legacy carve-out |
| --- | --- | --- |
| Outgoing repost activity | No public/social proof for new Private Repost | Historical `repost_created` may exist as legacy artifact |
| Incoming repost pressure | No new `post_reposted_by_other` for Private Repost | Historical incoming repost activity requires carve-out |
| Repost filter/CTA | Must not teach active post-transition repost taxonomy | Legacy display/copy handled downstream by WS-7 and WS-8 |
| Highlight links | Not post-transition save or publish success path | Legacy highlight may exist only as distinguishable artifact |
| Verification | New behavior judged by WS-6 target | Legacy rows must not be counted as pass/fail without WS-5 classification |

Release-blocking rule:

If a reviewer cannot distinguish legacy repost activity from post-transition Private Repost or Authorial Post activity behavior, WS-6 verification fails.

WS-6 must not auto-convert, auto-delete, migrate, rewrite, or redesign legacy activity rows.

## SECTION 9 - Verification Targets

These are conceptual targets for future runtime alignment and BV. They are not test implementation.

### Positive verification targets

Future implementation must prove:

1. Post-transition Private Repost creates no `post_reposted_by_other`.
2. Post-transition Private Repost creates no source-author incoming pressure.
3. Post-transition Private Repost does not function as public/social proof.
4. Private note edits remain silent.
5. Activity does not expose Private Repost to non-owners, groups, public profile, or Blog surfaces.
6. Authorial Post activity is distinct from repost activity.
7. Source Reference creates no standalone activity and no source-author pressure.
8. Activity does not reconstruct repost chains, reply trees, quote graphs, or discussion ancestry.
9. Activity items do not appear as Group Feed content.
10. Incoming like activity remains bounded and does not become economy, reward, ranking, or quality authority.
11. Bookmark/save facts do not become public propagation activity.
12. Legacy repost activity is distinguishable from post-transition behavior.
13. Legacy activity does not justify new public/group repost behavior.
14. Activity CTAs and highlight relationships do not preserve repost success or chain semantics as canonical.
15. Removing repost activity does not mask missing Private Repost and Authorial Post paths.

### Negative release-blocking signals

Future runtime alignment fails if:

- new Private Repost creates `post_reposted_by_other`;
- new Private Repost creates outgoing activity that reads as public repost;
- Source Reference creates incoming activity for the referenced source author;
- activity links reconstruct repost-of-post chains;
- activity items are treated as Group Feed content;
- activity volume is treated as Blog candidate, quality, economy, or reward proof;
- bookmarks/saves are presented as social propagation;
- legacy repost activity is indistinguishable from post-transition activity;
- legacy activity is used as proof that public/group repost remains canonical;
- all repost activity is hidden without proving WS-1 Private Repost and WS-3 Authorial Post boundaries.

### Verification traceability matrix

| Frozen rule | Future observable proof |
| --- | --- |
| Private Repost is owner-only context | No incoming source-author pressure and no non-owner activity discovery |
| Public/group repost is deprecated | No post-transition public repost social proof activity |
| Source Reference is not repost | No Source Reference activity event or incoming pressure |
| Group Feed is authorial-only | Activity is not group content |
| Anti-forum doctrine | No chain, reply, quote, or ancestry reconstruction through activity |
| Legacy is carve-out | Legacy activity is distinguishable and never post-transition pass evidence |
| Activity is projection-only | No economy, reward, Blog, RF, Quest, or quality authority |

## SECTION 10 - Runtime Risks

### Doctrine drift risks

- Repost activity can keep teaching that repost is public expression.
- Source Reference can be mistaken for renamed `post_reposted_by_other`.
- Activity can become a hidden forum through chains, highlights, and "someone reposted you" pressure.
- Activity volume can be mistaken for authorial quality or Blog candidate value.

### Activity inflation risks

- Too many projected actions can turn Activity into a universal interaction hub.
- Bookmark/save projection can blur retention and public propagation.
- Group activity can substitute for Group Feed content.
- Activity rows can become false evidence for progression, ranking, or rewards.

### Social pressure risks

- Incoming repost pressure can survive after Private Repost becomes owner-only.
- Source authors can receive pressure from Source Reference if activity invents reference events.
- Users can keep reading "share/save" as public social broadcasting.

### Legacy confusion risks

- Legacy `repost_created` and `post_reposted_by_other` rows can look like post-transition regressions.
- Legacy highlight CTAs can preserve old repost navigation meaning.
- Hiding all legacy activity can create false passes and trust issues.

### Sequencing risks

- Closing WS-6 without WS-5 distinction creates false pass/fail risk.
- Closing WS-6 without WS-4 can let activity contradict group authorial-only semantics.
- Starting WS-7 before WS-6 acceptance can rewrite copy against unstable activity meaning.
- WS-8 cannot verify activity alignment without accepted WS-6 semantics.

## SECTION 11 - Readiness

WS-6 specification readiness:

| Area | Status | Notes |
| --- | --- | --- |
| Current activity runtime documented | Ready | Baseline is `RUNTIME_PRE_TRANSITION` |
| Canon position documented | Ready | Anchored in Stage 13B.2 and accepted Stage 13B.3-A through E |
| Activity taxonomy defined | Ready | Semantic categories only |
| Allowed activity defined | Ready | Authorial post, bounded like, group join, legacy carve-out, owner-context retention boundary |
| Forbidden activity defined | Ready | Repost pressure, chains, activity-as-content, Source Reference activity, economy/Blog authority excluded |
| Private Repost relationship defined | Ready | WS-1 boundary inherited without redesign |
| Authorial Post relationship defined | Ready | WS-3 and WS-4 boundaries inherited without redesign |
| Legacy boundary defined | Ready | WS-5 carve-out respected |
| Verification targets defined | Ready | Positive and negative targets documented |
| Runtime risks documented | Ready | Doctrine drift, inflation, social pressure, legacy confusion, and sequencing risks documented |
| Implementation readiness | Not ready | Implementation remains unauthorized |

Is WS-6 ready for implementation after this specification?

No. This report makes WS-6 ready for review and acceptance as a runtime alignment specification. It does not authorize implementation, event schema design, migrations, data conversion, API design, DB design, frontend design, backend design, notification systems, moderation, ranking, recommendation, rewards, economy, or Blog workflow.

What is ready:

- WS-6 current activity runtime inventory.
- WS-6 activity taxonomy.
- WS-6 allowed and forbidden activity semantics.
- WS-6 relationship to Private Repost, Authorial Post, Source Reference, Group Feed, and legacy activity.
- WS-6 verification targets.
- WS-6 dependency map.

What remains before implementation:

- explicit implementation authorization;
- accepted WS-7 Language and Canon Quarantine Specification;
- accepted WS-8 Verification and BV Alignment;
- product decisions for legacy visibility/copy where needed.

Recommended next step:

Stage 13B.3-G should prepare WS-7 - Language and Canon Quarantine Specification. WS-6 now defines the activity semantics; WS-7 should align user-facing language, filters, CTAs, and legacy wording without changing the doctrine.

## Review gates

### Requirements Review

Result: pass.

The report answers the required sections for WS-6: current activity runtime, canon position, activity taxonomy, allowed activity, forbidden activity, relationship to Private Repost, relationship to Authorial Post, legacy activity boundary, verification targets, runtime risks, and readiness.

### Architecture Review

Result: pass at runtime-specification level.

Ownership boundaries are preserved:

- Space owns Space activity projection and Space posts.
- Reactions owns like/bookmark facts and bounded reaction projection.
- Source modules own source truth.
- Blog owns curated publication.
- Economy remains out of scope.

No event schema, API, DB, route, schema, migration, SQL plan, data conversion, frontend/backend design, notification design, moderation, ranking, recommendation, or implementation is proposed.

### Runtime Governance Review

Result: pass with `RUNTIME_PRE_TRANSITION`.

The report defines target activity semantics without authorizing runtime implementation. It separates post-transition activity from Private Repost pressure, public/group repost propagation, Group Feed content, Source Reference events, legacy activity, and economy/Blog authority.

### QA Review

Result: pass.

Future verification targets and release-blocking negative signals are defined, including no repost social pressure, no incoming repost pressure, no repost-chain activity, no discussion reconstruction, no activity-as-group-content, and distinguishable legacy activity.

### Canon Review

Result: pass.

No doctrine changes were introduced. Stage 13B.2 canon is treated as immutable. Private Repost, Authorial Post, Source Reference, Group Feed, Legacy Policy, and Blog Candidate doctrine are not redesigned.

## Status tokens

```text
stage_13B_3_F_status: COMPLETE_AS_WS_6_ACTIVITY_PROJECTION_SPECIFICATION
stage_13B_3_F_execution_mode: READ_ONLY_RUNTIME_ALIGNMENT_SPECIFICATION
stage_13B_3_F_workstream: WS_6_ACTIVITY_PROJECTION_ALIGNMENT
stage_13B_3_F_current_runtime_state: RUNTIME_PRE_TRANSITION
stage_13B_3_F_activity_gap_inventory_complete: TRUE
stage_13B_3_F_activity_taxonomy_defined: TRUE
stage_13B_3_F_allowed_activity_defined: TRUE
stage_13B_3_F_forbidden_activity_defined: TRUE
stage_13B_3_F_allowed_activity_semantics_defined: TRUE
stage_13B_3_F_forbidden_activity_semantics_defined: TRUE
stage_13B_3_F_private_repost_relationship_defined: TRUE
stage_13B_3_F_authorial_post_relationship_defined: TRUE
stage_13B_3_F_legacy_boundary_defined: TRUE
stage_13B_3_F_legacy_activity_boundary_defined: TRUE
stage_13B_3_F_verification_targets_defined: TRUE
stage_13B_3_F_dependency_relationship_defined: TRUE
stage_13B_3_F_readiness_assessed: TRUE
stage_13B_3_F_private_repost_activity_boundary_defined: TRUE
stage_13B_3_F_public_repost_activity_elimination_boundary_defined: TRUE
stage_13B_3_F_authorial_activity_boundary_defined: TRUE
stage_13B_3_F_source_reference_activity_boundary_defined: TRUE
stage_13B_3_F_group_feed_activity_boundary_defined: TRUE
stage_13B_3_F_no_chain_reconstruction_defined: TRUE
stage_13B_3_F_no_incoming_pressure_defined: TRUE
stage_13B_3_F_requires_implementation: FALSE
stage_13B_3_F_implementation_authorized: FALSE
stage_13B_3_F_implementation_proposed: FALSE
stage_13B_3_F_next_recommended_step: STAGE_13B_3_G_WS_7_LANGUAGE_AND_CANON_QUARANTINE_SPECIFICATION
stage_13B_3_F_private_repost_redesign: FALSE
stage_13B_3_F_authorial_post_redesign: FALSE
stage_13B_3_F_source_reference_redesign: FALSE
stage_13B_3_F_group_feed_redesign: FALSE
stage_13B_3_F_legacy_policy_redesign: FALSE
stage_13B_3_F_blog_candidate_redesign: FALSE
stage_13B_3_F_migration_proposed: FALSE
stage_13B_3_F_data_conversion_proposed: FALSE
stage_13B_3_F_api_design_proposed: FALSE
stage_13B_3_F_db_design_proposed: FALSE
stage_13B_3_F_event_schema_proposed: FALSE
stage_13B_3_F_frontend_design_proposed: FALSE
stage_13B_3_F_backend_design_proposed: FALSE
stage_13B_3_F_notification_proposed: FALSE
stage_13B_3_F_moderation_proposed: FALSE
stage_13B_3_F_ranking_proposed: FALSE
stage_13B_3_F_recommendation_proposed: FALSE
stage_13B_3_F_economy_proposed: FALSE
stage_13B_3_F_rewards_proposed: FALSE
stage_13B_3_F_blog_workflow_proposed: FALSE
```
