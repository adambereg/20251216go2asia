# Stage 13B.3-E - WS-4 Group Feed Authorial-Only Specification

## Execution mode

Runtime alignment specification / read-only.

This slice prepares the runtime alignment specification for WS-4 - Group Feed Authorial-Only, as defined in Stage 13B.2-I.

This is not an implementation slice. It does not design or change:

- code;
- frontend implementation;
- backend implementation;
- API routes;
- OpenAPI;
- SDK/types;
- DB schema;
- migrations;
- SQL plans;
- data conversion;
- UI screens or components;
- Private Repost doctrine;
- Authorial Post doctrine;
- Source Reference doctrine;
- Legacy Policy;
- Blog Candidate doctrine;
- ranking algorithms;
- recommendation algorithms;
- moderation systems;
- economy, points, rewards, Quest proof, RF claim, or commercial authority;
- Blog editorial workflow.

No tests were run. No runtime changes were made.

Task type: group feed authorial-only runtime specification.

Risk level: HIGH, because current group feed runtime can read group-visible repost rows and render repost-shaped cards, while frozen Stage 13B.2 canon defines Group Feed as a flat stream of standalone Authorial Posts with optional one-hop Source Reference.

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

This report focuses only on WS-4.

WS-4 owns:

- target runtime semantics of Group Feed as a post-transition authorial-only surface;
- group feed read policy semantics: what counts as target group content, what is excluded, and what is a legacy carve-out;
- group feed publish semantics: post-transition group expression is Authorial Post, not repost-shaped propagation;
- flat stream semantics for group content;
- relationship between Group Feed, Source Reference, legacy group repost rows, and excluded primitives;
- conceptual verification targets for future runtime alignment.

WS-4 does not own:

- Private Repost surface definition or retention behavior;
- Authorial Post or Source Reference doctrine;
- Public Repost elimination doctrine;
- Legacy Policy redesign;
- Blog Candidate workflow;
- activity projection implementation;
- language/copy quarantine implementation;
- OpenAPI, SDK, DB, routes, screens, components, or queries;
- moderation, ranking, recommendation, reward, or economy design.

## Canon anchors

Stage 13B.2 doctrine is frozen. This report does not change it.

Approved canon used by WS-4:

- Stage 13B.2-C: repost is private user context; group feed should not be a public repost surface.
- Stage 13B.2-D: Authorial Post is the public/group expression primitive.
- Stage 13B.2-E: public/group repost is deprecated as expression.
- Stage 13B.2-F: Source Reference is one-hop context on Authorial Post, not a reply, repost, or chain.
- Stage 13B.2-G: Private Repost is owner-only retention; legacy public/group repost rows are deprecated artifacts.
- Stage 13B.2-H: Group Feed exists to cultivate standalone authorial material, not discussions, repost streams, private saves, activity, or farming.
- Stage 13B.2-I: WS-4 aligns Group Feed as a flat stream of Authorial Posts and excludes private reposts, legacy repost rows, weak content, and repost-shaped content from the target group model.
- Stage 13B.3-A: WS-1 defines Private Repost runtime surface as owner-only retention and not group content.
- Stage 13B.3-B: WS-3 defines Authorial Post and Source Reference runtime surfaces.
- Stage 13B.3-C: WS-5 defines legacy artifact taxonomy and carve-out boundaries.
- Stage 13B.3-D: WS-2 defines that new public/group repost behavior must disappear from the post-transition model.

Fundamental canon:

The user does not answer a publication. The user publishes their own material. Other materials are context, inspiration, or source.

Dependency path:

WS-1 + WS-3 + WS-5 -> WS-2 -> WS-4 -> WS-6 -> WS-7 -> WS-8.

## SECTION 1 - Current Group Feed Runtime

Current runtime state: `RUNTIME_PRE_TRANSITION`.

Current group feed runtime concepts:

| Runtime concept | Current evidence | Current group meaning |
| --- | --- | --- |
| Group feed read path | `listGroupFeedPosts` filters by `group_id`, `visibility = 'group'`, active status, and deletion state | Group visibility is the active read boundary |
| Missing authorial-only read distinction | `listGroupFeedPosts` selects `post_type`, `repost_target_type`, and `repost_target_id` but does not require an authorial target type | Group-visible repost rows can fit the current read shape |
| Group feed rendering surface | `GroupPageClient.tsx` loads group feed items and renders each through `SpaceFeedCard` | Group feed inherits the generic Space card semantics |
| Repost-shaped card possibility | `SpaceFeedCard.tsx` renders repost labels, source preview, and repost commentary semantics for repost rows | A group row can look like repost expression, not authorial group material |
| Group repost write shape | `spaceService.ts` validates `visibility = 'group'` with `groupId`, but current canon evidence has not identified a post-transition authorial-only guard | Group repost remains a possible runtime shape before transition |
| Source Reference primitive | Runtime has no separate canonical Source Reference primitive outside doctrine reports | Source context can be confused with `repostTarget*` |
| Legacy group repost distinction | WS-5 defines conceptual legacy distinction, but current group read surface does not carry target semantics in this report | Legacy and post-transition repost-shaped rows are easy to confuse |
| Group activity assumptions | Activity and highlight surfaces still contain repost meanings in accepted WS-2 inventory | Group feed can be mentally connected to repost/activity until WS-6/WS-7 |

Current baseline tokens:

```text
ws_4_runtime_baseline: RUNTIME_PRE_TRANSITION
ws_4_group_feed_read_policy: UNDIFFERENTIATED_PRE_TRANSITION
ws_4_group_repost_rows_visible: POSSIBLE_PRE_TRANSITION
ws_4_group_authorial_publish_path: NOT_RUNTIME_ALIGNED
ws_4_group_feed_flat_stream: NOT_PROVEN
ws_4_legacy_group_repost_indistinguishable: ACTIVE_RISK
ws_4_source_reference_runtime_surface: ABSENT_PRE_TRANSITION
```

## SECTION 2 - Canon Position

According to Stage 13B.2-H, Group Feed exists to cultivate authorial content around a thematic context.

Group Feed is:

- a flat stream of standalone authorial contributions;
- a thematic incubation space;
- a pre-Blog discovery surface;
- a place where users turn source reactions into useful material;
- a bridge from raw Space UGC to curated Blog Asia candidates.

Group Feed is not:

- a forum;
- a comment section;
- a reply tree;
- a quote-post stream;
- a repost distribution channel;
- a private saved list;
- an activity log;
- a rewards farming surface.

Target Group Feed content:

```text
Authorial Post
-> optional one-hop Source Reference
-> standalone group contribution
-> possible Blog candidate through editorial curation
```

Target Group Feed does not contain post-transition repost as expression. A user does not answer a group post through repost, quote, comment, reply, or chain. A user publishes a standalone Authorial Post that may carry one optional Source Reference as secondary context.

Target state tokens:

```text
ws_4_target_group_feed_content: AUTHORIAL_POST_ONLY
ws_4_target_group_feed_shape: FLAT_STANDALONE_STREAM
ws_4_target_group_repost_expression: ABSENT_POST_TRANSITION
ws_4_target_private_repost_in_group_feed: ABSENT
ws_4_target_source_reference_in_feed: SECONDARY_ONE_HOP_VIA_AUTHORIAL_POST
ws_4_target_repost_chain_in_group_feed: ABSENT
ws_4_target_weak_content_as_group_norm: ABSENT
```

This section references frozen doctrine only. It does not redefine Private Repost, Authorial Post, Source Reference, Group Feed doctrine, Legacy Policy, or Blog Candidate.

## SECTION 3 - Group Feed Runtime Taxonomy

WS-4 taxonomy is conceptual. It is not an API, DB, route, UI, query, schema, migration, ranking, or moderation design.

| Category | Current group meaning | Target group-feed outcome |
| --- | --- | --- |
| `GF_ITEM_AUTHORIAL_POST` | Current `postType: post` exists but is not fully separated from all weak/non-authorial patterns | Include as target content when it carries Authorial Post semantics |
| `GF_ITEM_AUTHORIAL_WITH_SOURCE_REF` | No separate Source Reference runtime primitive exists | Include as target content only when the reference is secondary and one-hop |
| `GF_READ_GROUP_REPOST_POST_TRANSITION` | Group-visible repost rows can fit current read shape | Exclude / absent from target group feed |
| `GF_READ_LEGACY_GROUP_REPOST` | Historical group repost rows may exist | Legacy carve-out only under WS-5; not target group content |
| `GF_READ_PRIVATE_REPOST` | Private Repost target is defined by WS-1, not current group read | Absent from Group Feed |
| `GF_READ_WEAK_REPOST_SHAPED` | Repost card plus short text can appear author-like | Excluded as target group norm |
| `GF_READ_PUBLIC_REPOST_IN_GROUP_CONTEXT` | Repost semantics can bleed into group context | Excluded post-transition |
| `GF_PUBLISH_GROUP_AUTHORIAL` | Target expression path is not runtime-aligned in this report | Target publish semantics |
| `GF_PUBLISH_GROUP_REPOST` | Group repost remains possible as a pre-transition shape | Removed post-transition by WS-2 and excluded by WS-4 |
| `GF_NEST_UNDER_SOURCE` | Not a canonical target, but chain risk exists if source/repost previews dominate | Absent |
| `GF_THREAD_REPLY_NODE` | Forum-like structures are forbidden by 13B.2-H | Absent |
| `GF_ACTIVITY_AS_CONTENT` | Activity surfaces exist separately | Absent from group content |
| `GF_REACTION_AS_POST` | Like/bookmark facts exist in Reactions | Absent from group content |
| `GF_BLOG_CANDIDATE_SIGNAL` | Blog relation is conceptual only | Possible only for quality Authorial Post; no workflow in WS-4 |

Short taxonomy tokens:

```text
gf_authorial_post: GF_ITEM_AUTHORIAL_POST
gf_authorial_source_reference: GF_ITEM_AUTHORIAL_WITH_SOURCE_REF
gf_group_repost_post_transition: GF_READ_GROUP_REPOST_POST_TRANSITION
gf_legacy_group_repost: GF_READ_LEGACY_GROUP_REPOST
gf_private_repost: GF_READ_PRIVATE_REPOST
gf_weak_repost_shaped: GF_READ_WEAK_REPOST_SHAPED
gf_group_authorial_publish: GF_PUBLISH_GROUP_AUTHORIAL
gf_group_repost_publish: GF_PUBLISH_GROUP_REPOST
gf_activity_as_content: GF_ACTIVITY_AS_CONTENT
gf_reaction_as_content: GF_REACTION_AS_POST
```

## SECTION 4 - Allowed Group Feed Content

Allowed Group Feed content means valid target content in the post-transition group model. This section defines runtime semantics only and does not choose implementation mechanisms.

| Primitive or content role | Classification | Why |
| --- | --- | --- |
| Authorial Post in group | ALLOWED / TARGET | It is the standalone group expression unit defined by Stage 13B.2-D and H |
| Authorial Post with optional Source Reference | ALLOWED / TARGET | The source is secondary, one-hop context for the author's own material |
| Authorial Post without Source Reference | ALLOWED / TARGET | A group contribution does not need a source if the author's text carries independent value |
| Short but substantive Authorial Post | ALLOWED / TARGET | 13B.2-H states quality comes from meaning density, usefulness, independence, and context, not length |
| Practical observation, comparison, route, warning, synthesis, or recommendation | ALLOWED / TARGET | These are authorial contributions that can help another user understand, decide, compare, plan, or reflect |
| Group Authorial Post as possible Blog candidate | ALLOWED AS CONCEPTUAL RELATION | Blog candidate potential belongs to quality authorial material, without auto-promotion or workflow design |

Allowed content invariants:

1. Author text is the primary visible value.
2. The post communicates independent meaning.
3. The post can be understood without opening the source.
4. Any Source Reference is optional, one-hop, and secondary.
5. The post does not need ancestry, parent post, thread, reply, quote, or repost-chain context.
6. The post fits the group theme or purpose.
7. The post can plausibly help another user learn, decide, compare, plan, or reflect.

Allowed content tokens:

```text
ws_4_allowed_authorial_post: TRUE
ws_4_allowed_authorial_post_with_source_reference: TRUE
ws_4_allowed_authorial_post_without_source_reference: TRUE
ws_4_allowed_source_reference_standalone: FALSE
ws_4_allowed_blog_candidate_auto_promotion: FALSE
```

## SECTION 5 - Forbidden Group Feed Content

Forbidden Group Feed content means content that must not define the post-transition target group model. This section does not define moderation, enforcement, ranking, recommendation, or deletion.

| Primitive or content role | Classification | Why |
| --- | --- | --- |
| Private Repost | FORBIDDEN AS GROUP CONTENT | Private Repost is owner-only retention under WS-1 |
| New group repost | FORBIDDEN POST-TRANSITION | Group expression must be Authorial Post, not repost |
| Public repost with commentary | FORBIDDEN AS GROUP NORM | Repost with text is quote-like propagation, not standalone authorial material |
| Repost chain or repost-of-repost | FORBIDDEN | Violates anti-forum and one-hop Source Reference doctrine |
| Legacy group repost as target content | FORBIDDEN AS TARGET; LEGACY CARVE-OUT ONLY | WS-5 allows distinction, not doctrine reactivation |
| Activity item | FORBIDDEN AS GROUP CONTENT | Activity projection is separate and belongs to WS-6 |
| Reaction or bookmark fact | FORBIDDEN AS GROUP CONTENT | Reactions own lightweight sentiment and retention facts |
| Source Reference alone | FORBIDDEN AS STANDALONE CONTENT | Source Reference belongs only on an Authorial Post |
| Source preview plus trivial line | FORBIDDEN AS TARGET NORM | Reference cannot rescue weak content |
| Comment, reply, quote tree node | FORBIDDEN | Go2Asia is not building forum/discussion chains |
| Quest proof or RF transaction state | FORBIDDEN AS GROUP CONTENT | Wrong domain authority and not authorial contribution |
| Weak/repost-shaped content | FORBIDDEN AS TARGET NORM | It is reaction-like, source-dominated, chain-dependent, or distribution-oriented |

Negative group content tokens:

```text
ws_4_forbidden_private_repost_in_group_feed: TRUE
ws_4_forbidden_new_group_repost: TRUE
ws_4_forbidden_repost_chain: TRUE
ws_4_forbidden_activity_as_group_content: TRUE
ws_4_forbidden_reactions_as_group_content: TRUE
ws_4_forbidden_legacy_group_repost_as_target_content: TRUE
ws_4_forbidden_source_reference_standalone: TRUE
ws_4_forbidden_weak_content_as_group_norm: TRUE
```

## SECTION 6 - Relationship to Source Reference

Source Reference appears inside Group Feed only as secondary context on an Authorial Post.

Target Source Reference relationship in Group Feed:

- Source Reference is not a feed item.
- Source Reference is not a repost target binding.
- Source Reference is not a reply edge.
- Source Reference is not a quote-post relation.
- Source Reference is not a parent/child relation.
- Source Reference is not a discussion-chain reconstruction tool.
- Source Reference is zero-or-one and one-hop only.
- Source Reference inherits its group meaning from the Authorial Post that carries it.

Runtime relationship matrix:

| Concern | WS-4 relationship |
| --- | --- |
| Authorial Post with no Source Reference | Valid group content if independently meaningful |
| Authorial Post with Source Reference | Valid group content if author text remains primary |
| Source Reference alone | Not group content |
| `repostTargetType` / `repostTargetId` | Must not be treated as Source Reference |
| Space post as source | May be a source only through frozen Source Reference semantics; no chain reconstruction |
| Source preview | Secondary context, not the body of the post |
| Missing or unavailable source | The Authorial Post should still carry useful meaning under 13B.2-H |

Authorial independence boundary:

If the source disappears, the group post should still matter. The reader should understand the author's useful thought, observation, comparison, warning, route, recommendation, or synthesis without relying on the source as the main payload.

This section references frozen doctrine only. It does not redefine Private Repost, Authorial Post, Source Reference, Group Feed doctrine, Legacy Policy, or Blog Candidate.

## SECTION 7 - Legacy Boundary

WS-4 interacts with WS-5 legacy carve-outs but does not redesign Legacy Policy.

Legacy group repost principles:

- legacy group repost rows are historical artifacts, not target group content;
- legacy group repost rows must not prove that group repost remains canonical;
- legacy group repost rows must not become Authorial Posts;
- legacy group repost rows must not become Source References;
- legacy group repost rows must not be Blog candidate inputs;
- legacy group repost rows must not be quality inputs;
- legacy group repost rows must not reconstruct discussion chains;
- legacy group repost rows must be distinguishable from post-transition regressions for future verification.

Boundary matrix:

| Surface or concern | Post-transition WS-4 target | WS-5 legacy carve-out |
| --- | --- | --- |
| Group feed item | Authorial Post semantics only | Legacy group repost may exist only as distinguishable historical artifact |
| Group publish | New group expression is Authorial Post | No legacy write path; legacy is historical only |
| Group repost card | Not target content | Requires carve-out classification if visible |
| Source/repost preview | Secondary only through Source Reference on Authorial Post | Legacy preview must not be reinterpreted as Source Reference |
| Group quality model | Authorial material only | Legacy repost excluded from quality norms |
| Blog candidate relation | Possible only for quality Authorial Post | Legacy repost excluded |
| Verification evidence | New items must satisfy WS-4 target semantics | Legacy rows must not be counted as pass or fail without WS-5 classification |

Release-blocking rule:

If a reviewer cannot distinguish a legacy group repost carve-out from a post-transition group repost regression, WS-4 verification fails.

WS-4 must not auto-convert, auto-delete, migrate, rewrite, or redesign legacy rows.

This section references frozen doctrine only. It does not redefine Private Repost, Authorial Post, Source Reference, Group Feed doctrine, Legacy Policy, or Blog Candidate.

## SECTION 8 - Verification Targets

These are conceptual targets for future runtime alignment and BV. They are not test implementation.

### Positive verification targets

Future implementation must prove:

1. Post-transition group feed items use Authorial Post semantics.
2. Post-transition group publish semantics produce Authorial Post meaning, not repost meaning.
3. Group feed does not use new repost-shaped rows as expression.
4. Private Repost is absent from Group Feed.
5. Source Reference appears only through Authorial Post.
6. Source Reference remains one-hop and secondary.
7. Source Reference does not create parent/child, thread, reply, quote, or repost-chain semantics.
8. Group feed remains a flat stream of standalone contributions.
9. Group feed does not materialize reactions, bookmarks, Quest proof, RF transaction state, or activity events as content.
10. Legacy group repost rows are distinguishable from post-transition Authorial Posts.
11. Legacy group repost rows do not count as target group content, quality inputs, or Blog candidate inputs.
12. Weak/repost-shaped content does not define target Group Feed norms.
13. `repostTarget*` is not treated as Source Reference.
14. WS-2 group repost elimination and WS-4 group feed read alignment are jointly provable.
15. Removal of repost-shaped group content does not mask the absence of Authorial Post semantics.

### Negative release-blocking signals

Future runtime alignment fails if:

- a new group repost row can be created post-transition;
- a new group repost-shaped row appears as target content;
- Group Feed treats repost card plus commentary as canonical group expression;
- Private Repost appears in Group Feed;
- Source Reference appears as standalone feed content;
- `repostTargetType` / `repostTargetId` is renamed into Source Reference;
- a Space post repost becomes a group response path;
- Group Feed renders nesting, ancestry, reply chains, quote trees, or repost chains;
- activity items appear as group feed content;
- reactions/bookmarks appear as group feed content;
- legacy group repost rows are indistinguishable from post-transition Authorial Posts;
- legacy group repost visibility is used as proof that group repost remains canonical;
- weak/repost-shaped content is treated as a quality group contribution;
- all repost-shaped rows are hidden without proving Authorial Post and Private Repost boundaries.

### Verification traceability matrix

| Frozen rule | Future observable proof |
| --- | --- |
| Group Feed is authorial-only | New group content has Authorial Post semantics |
| Repost is private context | Private Repost absent from group feed |
| Public/group repost deprecated | No new group repost as expression |
| Source Reference is secondary | Source appears only through Authorial Post and does not dominate the content |
| Source Reference is one-hop | No chain reconstruction or ancestry pull-through |
| Group Feed is flat | No nesting, reply tree, quote tree, or parent/child semantics |
| Legacy is carve-out | Legacy group rows are distinguishable and excluded from quality/Blog signals |
| Activity is separate | Activity events are not group feed content |
| Weak content is not target norm | Repost-shaped, source-dominated, reaction-like content is excluded from target semantics |

## SECTION 9 - Runtime Risks

### Doctrine drift risks

- Repost card plus commentary could be treated as an Authorial Post.
- Source Reference could be reduced to renamed `repostTarget*`.
- Group Feed could become a quote-post stream.
- Group Feed could become a forum-like reply surface.
- Weak source-dominated posts could become accepted as group norms.
- Blog candidate language could be misread as automatic promotion or reward behavior.

### Repost reintroduction risks

- Group repost write shape could remain active after WS-2.
- Space-post repost could survive as a response path.
- Public repost mental model could be reintroduced through group sharing copy.
- Existing repost preview components could keep teaching repost-as-expression.
- Dedupe semantics from repost could accidentally constrain Authorial Posts about the same source.

### Chain reconstruction risks

- Source Reference could be rendered as parent/child relation.
- Legacy repost-of-post rows could be read as discussion history.
- Activity links could reconstruct repost chains around group posts.
- Highlight URLs could preserve old repost navigation meaning.

### Legacy confusion risks

- Legacy group repost rows may look like post-transition regressions.
- Legacy group repost visibility may look like active doctrine.
- Legacy rows may create false failures if WS-5 classification is absent.
- Hiding all repost-shaped rows may create false passes if Authorial Post semantics are not proven.

### Sequencing risks

- Closing WS-4 before WS-2 leaves group repost write semantics unresolved.
- Closing WS-4 without WS-3 leaves no clear authorial replacement semantics.
- Closing WS-4 without WS-5 makes legacy group rows unverifiable.
- Starting WS-6 before WS-4 may let activity projection contradict target group content semantics.
- Starting WS-7 before WS-4 may quarantine copy before the group content model is accepted.

## SECTION 10 - Dependency Relationship

WS-4 depends on accepted WS-1, WS-3, WS-5, and WS-2 boundaries.

| Dependency | Why WS-4 depends on it |
| --- | --- |
| WS-1 Private Repost Runtime Surface | Group Feed must exclude owner-only retention and keep save-for-myself out of group content |
| WS-3 Authorial Post + Source Reference Runtime Surface | Group Feed needs accepted expression and source-context semantics before it can be authorial-only |
| WS-5 Legacy Runtime Handling | Group Feed cannot be verified without distinguishing legacy group repost artifacts from post-transition regressions |
| WS-2 Public Repost Elimination | Group Feed cannot become authorial-only while new group repost remains a target expression path |

WS-4 enables downstream workstreams:

| Downstream workstream | How WS-4 enables it |
| --- | --- |
| WS-6 Activity Projection Alignment | Activity can be aligned against a settled group content boundary: authorial content is not repost activity |
| WS-7 Language and Canon Quarantine | Group copy can stop teaching repost/comment/reply mental models after the target group semantics are accepted |
| WS-8 Verification and BV Alignment | BV can verify group feed authorial-only behavior with legacy carve-outs and negative signals |

Critical path:

WS-1 + WS-3 + WS-5 -> WS-2 -> WS-4 -> WS-6 -> WS-7 -> WS-8.

## SECTION 11 - Readiness

WS-4 specification readiness:

| Area | Status | Notes |
| --- | --- | --- |
| Current group feed runtime documented | Ready | Baseline is `RUNTIME_PRE_TRANSITION` |
| Canon position documented | Ready | Anchored in Stage 13B.2-H and accepted Stage 13B.3 dependencies |
| Group content taxonomy defined | Ready | Authorial, Source Reference, legacy, private repost, repost, reaction, activity, weak content categories defined |
| Allowed content defined | Ready | Target content is Authorial Post with optional one-hop Source Reference |
| Forbidden content defined | Ready | Private Repost, repost chains, new group repost, activity, reactions, legacy-as-target, weak content excluded |
| Source Reference relationship defined | Ready | Secondary one-hop relationship through Authorial Post only |
| Legacy boundary defined | Ready | WS-5 carve-out respected without redesign |
| Verification targets defined | Ready | Positive and negative targets documented |
| Runtime risks documented | Ready | Doctrine drift, repost reintroduction, chain reconstruction, legacy confusion, and sequencing risks documented |
| Dependency relationship defined | Ready | WS-1/WS-3/WS-5/WS-2 dependencies and WS-6/WS-7/WS-8 enablement documented |
| Implementation readiness | Not ready | Implementation remains unauthorized |

Is WS-4 ready for implementation after this specification?

No. This report makes WS-4 ready for review and acceptance as a runtime alignment specification. It does not authorize implementation, migrations, data conversion, API design, DB design, frontend design, backend design, query design, moderation systems, ranking, recommendation, rewards, or Blog workflow.

What is ready:

- WS-4 current group feed runtime inventory.
- WS-4 canon position.
- WS-4 group content taxonomy.
- WS-4 allowed and forbidden content boundaries.
- WS-4 Source Reference relationship boundary.
- WS-4 legacy carve-out boundary.
- WS-4 verification targets.
- WS-4 dependency map.

What remains before implementation:

- explicit implementation authorization;
- accepted WS-6 Activity Projection Specification;
- accepted WS-7 Language and Canon Quarantine Specification;
- accepted WS-8 Verification and BV Alignment;
- product decisions for unresolved legacy visibility and user-facing copy questions where needed.

Recommended next step:

Stage 13B.3-F should prepare WS-6 - Activity Projection Specification. WS-4 now defines that Group Feed target runtime is authorial-only; WS-6 should align activity so it does not preserve repost social pressure, chain reconstruction, or activity-as-content semantics.

## Review gates

### Requirements Review

Result: pass.

The report answers the required sections for WS-4: current group feed runtime, canon position, group feed taxonomy, allowed content, forbidden content, relationship to Source Reference, legacy boundary, verification targets, runtime risks, dependency relationship, and readiness.

### Architecture Review

Result: pass at runtime-specification level.

Ownership boundaries are preserved:

- Space owns posts, Private Repost Context, Authorial Posts, group feed, and legacy rows.
- Source modules own source truth.
- Reactions own like/bookmark facts.
- Blog owns curated publication.
- Economy remains out of scope.

No API, DB, route, schema, migration, SQL plan, data conversion, frontend/backend design, query design, moderation, ranking, recommendation, Blog workflow, or implementation is proposed.

### Runtime Governance Review

Result: pass with `RUNTIME_PRE_TRANSITION`.

The report defines Group Feed authorial-only target semantics without authorizing runtime implementation. It explicitly separates post-transition group content from Private Repost, public/group repost, activity, reactions, weak content, and legacy carve-outs.

### QA Review

Result: pass.

Future verification targets and release-blocking negative signals are defined, including Authorial Post-only group content, no group repost as expression, no Private Repost in group feed, one-hop Source Reference, flat stream semantics, no chain reconstruction, no activity/reaction rows, and distinguishable legacy group repost carve-outs.

### Canon Review

Result: pass.

No doctrine changes were introduced. Stage 13B.2 canon is treated as immutable. Private Repost, Authorial Post, Source Reference, Group Feed doctrine, Legacy Policy, and Blog Candidate doctrine are not redesigned.

## Status tokens

```text
stage_13B_3_E_status: COMPLETE_AS_WS_4_GROUP_FEED_AUTHORIAL_ONLY_SPECIFICATION
stage_13B_3_E_execution_mode: READ_ONLY_RUNTIME_ALIGNMENT_SPECIFICATION
stage_13B_3_E_workstream: WS_4_GROUP_FEED_AUTHORIAL_ONLY_ALIGNMENT
stage_13B_3_E_current_runtime_state: RUNTIME_PRE_TRANSITION
stage_13B_3_E_group_content_taxonomy_defined: TRUE
stage_13B_3_E_allowed_content_defined: TRUE
stage_13B_3_E_forbidden_content_defined: TRUE
stage_13B_3_E_legacy_boundary_defined: TRUE
stage_13B_3_E_verification_targets_defined: TRUE
stage_13B_3_E_source_reference_relationship_defined: TRUE
stage_13B_3_E_dependency_relationship_defined: TRUE
stage_13B_3_E_readiness_assessed: TRUE
stage_13B_3_E_group_feed_gap_inventory_complete: TRUE
stage_13B_3_E_read_policy_semantics_defined: TRUE
stage_13B_3_E_publish_policy_semantics_defined: TRUE
stage_13B_3_E_flat_stream_semantics_defined: TRUE
stage_13B_3_E_requires_implementation: FALSE
stage_13B_3_E_implementation_authorized: FALSE
stage_13B_3_E_implementation_proposed: FALSE
stage_13B_3_E_next_recommended_step: STAGE_13B_3_F_WS_6_ACTIVITY_PROJECTION_SPECIFICATION
stage_13B_3_E_private_repost_redesign: FALSE
stage_13B_3_E_authorial_post_redesign: FALSE
stage_13B_3_E_source_reference_redesign: FALSE
stage_13B_3_E_group_feed_redesign: FALSE
stage_13B_3_E_legacy_policy_redesign: FALSE
stage_13B_3_E_blog_candidate_redesign: FALSE
stage_13B_3_E_migration_proposed: FALSE
stage_13B_3_E_data_conversion_proposed: FALSE
stage_13B_3_E_api_design_proposed: FALSE
stage_13B_3_E_db_design_proposed: FALSE
stage_13B_3_E_frontend_design_proposed: FALSE
stage_13B_3_E_backend_design_proposed: FALSE
stage_13B_3_E_ranking_proposed: FALSE
stage_13B_3_E_recommendation_proposed: FALSE
stage_13B_3_E_moderation_proposed: FALSE
stage_13B_3_E_economy_proposed: FALSE
stage_13B_3_E_rewards_proposed: FALSE
stage_13B_3_E_blog_workflow_proposed: FALSE
```
