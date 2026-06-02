# Stage 13B.3-C - WS-5 Legacy Runtime Handling Specification

## Execution mode

Runtime alignment specification / read-only.

This slice prepares the runtime alignment specification for WS-5 - Legacy Runtime Handling, as defined in Stage 13B.2-I.

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
- data conversion strategies;
- retention policy implementation;
- UI screens or components;
- Private Repost doctrine;
- Authorial Post doctrine;
- Source Reference doctrine;
- Group Feed doctrine;
- Blog Candidate doctrine;
- moderation;
- economy, points, rewards, Quest proof, RF claim, or commercial authority.

No tests were run. No runtime changes were made.

Task type: legacy runtime relationship specification.

Risk level: HIGH, because legacy public/group repost artifacts still share runtime surfaces with active feed, profile, activity, and highlight behavior. Without WS-5 distinction, downstream WS-2, WS-4, WS-6, and WS-8 cannot produce reliable evidence.

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

This report focuses only on WS-5.

WS-5 owns:

- legacy artifact relationship semantics;
- legacy artifact taxonomy;
- legacy vs post-transition distinction boundary;
- conceptual visibility boundaries for owner, public, and group relationships;
- forbidden legacy transformations;
- relationship to group feed and activity at semantic level;
- conceptual verification targets for future runtime alignment.

WS-5 does not own:

- Private Repost runtime surface;
- Authorial Post or Source Reference runtime surface;
- public repost elimination mechanics;
- Group Feed authorial-only implementation;
- activity projection implementation;
- copy rewrite implementation;
- final BV evidence bundle;
- migrations, schema, data conversion, SQL plans, or retention implementation.

## Canon anchors

Stage 13B.2 doctrine is frozen. This report does not change it.

Approved canon used by WS-5:

- Stage 13B.2-C: public/group repost is a doctrine mismatch; group feed should contain standalone authorial posts.
- Stage 13B.2-D: Authorial Post is standalone authored material; legacy repost is not Authorial Post.
- Stage 13B.2-E: existing public/group repost rows become legacy policy concerns; public repost is deprecated.
- Stage 13B.2-F: Source Reference is one-hop context on Authorial Post; legacy repost rows are not Source References.
- Stage 13B.2-G: legacy public/group repost rows are deprecated artifacts and possible owner-context candidates under future policy.
- Stage 13B.2-H: legacy repost rows are not target Group Feed content, not group quality inputs, and not Blog candidates.
- Stage 13B.2-I: WS-5 must distinguish legacy rows from post-transition behavior before public/group feed and activity claims are reliable.
- Stage 13B.3-A: WS-1 defines post-transition Private Repost as owner-only retention; legacy rows are boundary artifacts.
- Stage 13B.3-B: WS-3 defines Authorial Post and Source Reference runtime roles; legacy rows must not be confused with either.

Fundamental canon:

The user does not answer a publication. The user publishes their own material. Other materials are context, inspiration, or source.

## SECTION 1 - Current Legacy Runtime State

Current runtime state: `RUNTIME_PRE_TRANSITION`.

Today, legacy artifacts are not separated from active repost runtime. Existing `postType: repost` rows with public or group visibility share the same feed, profile, activity, and highlight surfaces as current repost behavior.

Current legacy runtime inventory:

| Runtime area | Current legacy behavior |
| --- | --- |
| Public/home feed | Legacy public repost rows may still appear as feed items and may receive `reason: repost`. |
| Group feed | Legacy group repost rows may still appear because group feed query filters by group and visibility, not authorial type. |
| Feed card | Repost rows render source preview and "Комментарий к репосту", preserving quote-like public semantics. |
| Profile/publications | Profile feed includes repost rows by author; publications surface counts reposts alongside authored rows. |
| Activity | Historical repost activity can appear as `repost_created` or `post_reposted_by_other`, with "Репосты" filtering and repost CTAs. |
| Highlight URLs | `/space/feed?highlight=...` links may point to legacy repost cards. |
| Share-to-Space success | Current object-bound repost success still points to feed highlight, reinforcing deprecated public repost destination. |
| Space post repost chain | `repostPost` creates `postType: repost` with `repostTargetType: 'space_post'`, preserving chain-shaped runtime risk. |
| Saved/private context | No owner-only Private Repost Context exists yet to reinterpret legacy rows. |
| Blog candidate relationship | No canonical runtime candidate flow exists; canon excludes legacy rows from future candidate input. |

Legacy artifact examples in current runtime:

- public repost rows;
- group repost rows;
- reposts with public commentary text;
- reposts of Space posts;
- repost activity rows;
- repost highlight links;
- repost profile/publication items.

Current baseline tokens:

```text
ws_5_runtime_baseline: RUNTIME_PRE_TRANSITION
ws_5_legacy_row_class_present: TRUE
ws_5_legacy_post_transition_distinction: ABSENT
ws_5_legacy_public_feed_surface: ACTIVE
ws_5_legacy_group_feed_surface: ACTIVE
ws_5_legacy_activity_surface: ACTIVE
ws_5_legacy_profile_surface: ACTIVE
ws_5_legacy_highlight_surface: ACTIVE
```

## SECTION 2 - Canon Position

According to Stage 13B.2-E and Stage 13B.2-G, legacy public/group repost rows are historical artifacts of the superseded public propagation model.

Legacy rows are:

- deprecated publication artifacts;
- possible owner-context candidates under a future policy;
- preserved conceptually until a future runtime/data policy is accepted;
- outside target public/group content doctrine;
- evidence of historical runtime state, not evidence of target doctrine.

Legacy rows are not:

- canonical Private Reposts;
- Authorial Posts;
- Source References;
- target Group Feed content;
- Blog candidates;
- group quality inputs;
- proof that public/group repost remains canonical;
- reply, comment, quote, or discussion-chain primitives.

Canon relationship matrix:

| Artifact | Private Repost | Authorial Post | Source Reference | Group Feed target | Blog Candidate |
| --- | --- | --- | --- | --- | --- |
| Legacy public repost row | Not canonical; possible owner-context candidate by future policy | No | No | No target role | No |
| Legacy group repost row | Not canonical; possible owner-context candidate by future policy | No | No | Excluded from target doctrine | No |
| Legacy repost with commentary | Historical commentary only | Not authorial text | No | No target role | No |
| Legacy repost activity | Historical projection | No | No | Not content | No |
| Post-transition Private Repost | Owner-only retention per WS-1 | No | No | No | No |
| Post-transition Authorial Post | No | Yes | May have Source Reference | Yes | Possible via authorial path only |

Target relationship tokens:

```text
ws_5_target_legacy_meaning: DEPRECATED_PUBLICATION_ARTIFACT
ws_5_target_legacy_canon_proof_role: NONE
ws_5_target_legacy_group_quality_role: NONE
ws_5_target_legacy_blog_role: NONE
ws_5_target_legacy_authorial_role: NONE
ws_5_target_legacy_source_reference_role: NONE
```

This section references frozen doctrine only. It does not redefine Private Repost, Authorial Post, Source Reference, Group Feed, or Blog Candidate.

## SECTION 3 - Legacy Artifact Taxonomy

WS-5 taxonomy is conceptual. It is not a schema, migration, enum, or data conversion design.

| Category | Runtime shape | Relationship meaning | Target doctrine relationship |
| --- | --- | --- | --- |
| Legacy public repost | `postType: repost`, public surface, non-group or public visibility | Historical public propagation artifact | Outside target public doctrine |
| Legacy group repost | `postType: repost`, `visibility: group`, group context | Historical group propagation artifact | Outside target group doctrine |
| Legacy repost with commentary | Repost row with non-empty text | Historical public/group commentary under old semantics | Not authorial material |
| Legacy repost of Space post | Repost row with `space_post` target | Possible chain-shaped artifact | Not discussion chain |
| Legacy repost activity | `repost_created` or `post_reposted_by_other` activity | Historical social propagation projection | Legacy carve-out; WS-6 owns future projection |
| Legacy repost highlight | Deep link to feed highlight for repost row | Deprecated public repost destination | Not post-transition success path |
| Legacy repost profile item | Repost row visible/countable on profile/publications | Historical profile artifact | Not authorial output |

Classification rule:

A row is legacy when its product relationship was created or displayed under the superseded public/group repost doctrine. A row is post-transition only when its relationship matches WS-1 Private Repost or WS-3 Authorial Post / Source Reference target semantics after alignment.

Short taxonomy tokens:

```text
legacy_public_repost: L_PUBLIC_REPOST
legacy_group_repost: L_GROUP_REPOST
legacy_repost_commentary: L_REPOST_COMMENTARY
legacy_space_post_repost: L_SPACE_POST_CHAIN_ARTIFACT
legacy_repost_activity: L_REPOST_ACTIVITY
legacy_repost_highlight: L_REPOST_HIGHLIGHT
legacy_profile_repost_item: L_PROFILE_REPOST_ITEM
```

## SECTION 4 - Legacy Visibility Boundary

WS-5 defines conceptual visibility boundaries. It does not choose an implementation stance.

### Owner relationship

Owner relationship to legacy rows:

- owner may have a future owner-visible relationship to legacy rows;
- owner access is a policy option, not a canonical Private Repost conversion;
- owner-visible legacy rows remain legacy unless explicitly reclassified by a future accepted policy;
- hiding legacy rows without an owner-facing policy is a product trust risk.

Allowed conceptual owner stances from Stage 13B.2-G:

- owner-visible legacy archive;
- owner private-context reclassification with explicit policy;
- read-only historical artifact;
- suppressed from active public/group surfaces;
- grandfathered display with clear legacy semantics.

### Public relationship

Public relationship to legacy public repost rows:

- public visibility, if retained, is a legacy carve-out, not target public doctrine;
- public legacy rows must not justify new public repost behavior;
- public legacy rows must not count as Authorial Posts;
- public legacy rows must not become Source References or Blog candidates;
- non-owner historical read mode remains a policy gate.

### Group relationship

Group relationship to legacy group repost rows:

- legacy group reposts are not target group content;
- legacy group reposts are not group quality inputs;
- legacy group reposts must not prove that group repost remains allowed;
- any group visibility is a legacy carve-out until WS-4 defines target read policy;
- group feed verification must distinguish legacy group reposts from post-transition group Authorial Posts.

Visibility boundary matrix:

| Audience | Legacy public repost | Legacy group repost | New Private Repost | New Authorial Post |
| --- | --- | --- | --- | --- |
| Owner | Policy option: archive/context candidate | Policy option: archive/context candidate | Owner-only retention | Authorial output per policy |
| Public | Legacy carve-out only | Not applicable unless separately visible | No | Per authorial visibility policy |
| Group | Not target group content | Legacy carve-out only | No | Target group expression |
| Source author | Historical activity may exist | Historical activity may exist | No incoming pressure | No Source Reference pressure |

Open visibility questions:

| Question | Status |
| --- | --- |
| Should legacy public repost rows remain visible to non-owners? | POLICY_GATE |
| Should legacy group repost rows be suppressed before full runtime alignment? | POLICY_GATE |
| How should owner-visible legacy rows be labeled? | POLICY_GATE |
| How should legacy public feed highlight URLs behave? | CARVE_OUT_REQUIRED |
| How should historical repost activity be displayed or retired? | CARVE_OUT_REQUIRED |

## SECTION 5 - Legacy vs Post-Transition Distinction

The core WS-5 invariant:

Future runtime verification must distinguish visible legacy artifacts from post-transition Private Reposts, Authorial Posts, and Source References.

Conceptual distinction matrix:

| Signal | Legacy artifact relationship | Post-transition relationship |
| --- | --- | --- |
| Repost-shaped public feed card | Legacy public repost, if created under old doctrine | Regression if new public repost is created |
| Repost-shaped group feed card | Legacy group repost, if carved out | Regression if new group repost is created |
| Repost text/commentary | Historical commentary | Private note only in WS-1; authorial text only in WS-3 |
| Repost target binding | Historical propagation or private retention binding | Not Source Reference |
| Owner-only saved context | Possible owner-context candidate if explicitly policy-carved | Private Repost per WS-1 |
| Primary author text | Not inferred from legacy commentary | Authorial Post per WS-3 |
| One-hop provenance on Authorial Post | Not legacy repost binding | Source Reference per WS-3 |
| Activity `post_reposted_by_other` | Historical repost activity | Forbidden for new Private Repost |
| Highlight link to feed card | Legacy deep-link carve-out | Not post-transition save success |
| Profile repost row | Legacy profile artifact | Not Authorial Post publication |

What WS-5 defines:

- legacy taxonomy;
- conceptual distinction requirement;
- semantic carve-out classes;
- relationship to owner/public/group/activity/profile/highlight surfaces;
- verification targets that prevent false pass and false fail.

What WS-5 does not define:

- archive, hide, grandfather, or reclassification mechanics;
- data conversion or migration;
- epoch marker or schema shape;
- query, endpoint, SDK, or route changes;
- UI labels, components, or frontend implementation.

Release-blocking distinction rule:

If a reviewer cannot tell whether a visible repost-shaped behavior is a legacy carve-out or post-transition regression, WS-5 verification fails.

## SECTION 6 - Forbidden Transformations

Stage 13B.2-G defines forbidden transformations. WS-5 organizes them as runtime relationship rules.

Forbidden transformations:

1. Do not automatically convert a legacy public/group repost into an Authorial Post.
2. Do not automatically treat repost text as authorial material.
3. Do not automatically make legacy reposts Blog candidates.
4. Do not automatically delete legacy rows in a doctrine or governance slice.
5. Do not silently rewrite legacy rows into Source References.
6. Do not use legacy public rows to justify new public repost behavior.
7. Do not use legacy group rows as group quality signals.
8. Do not reconstruct discussion chains from legacy repost-of-post rows.
9. Do not create incoming social pressure from new private reposts.
10. Do not let private repost dedupe constrain Authorial Posts.
11. Do not treat old "commentary to repost" language as public/group canon.
12. Do not make legacy repost rows part of the Blog pipeline.

WS-5 anti-drift rules:

1. Legacy public/group repost rows are not proof that public repost remains canonical.
2. Legacy public/group repost rows are not Source References.
3. Legacy public/group repost rows are not Authorial Posts.
4. Legacy public/group repost rows are not canonical Private Reposts.
5. Legacy public/group repost rows are not group quality inputs.
6. Legacy repost activity is not post-transition activity doctrine.
7. Legacy highlight URLs are not post-transition success paths.
8. Legacy profile items are not authorial publication metrics.
9. Legacy repost target binding is not one-hop provenance on Authorial Post.
10. Legacy repost-of-post rows do not create discussion ancestry.
11. Legacy row presence must not mask missing Private Repost Context.
12. Legacy row presence must not mask missing Authorial Post / Source Reference path.
13. Legacy row visibility must not be used as BV pass evidence for public/group repost doctrine.

Allowed conceptual stances, without choosing implementation:

- owner-visible legacy archive;
- owner private-context reclassification with explicit policy;
- read-only historical artifact;
- suppressed from active public/group surfaces;
- grandfathered display with clear legacy semantics.

This document does not choose a technical migration, conversion, retention, deletion, archive, or display implementation strategy.

## SECTION 7 - Relationship to Group Feed

Stage 13B.2-H defines target Group Feed as a flat stream of standalone Authorial Posts. WS-5 defines only how legacy artifacts relate to that target.

Current relationship:

- legacy group repost rows may appear in group feed because current group feed runtime does not distinguish repost rows from authorial rows at target doctrine level;
- `SpaceFeedCard` renders repost preview and commentary in group contexts;
- this creates false evidence that group repost remains acceptable.

Target semantic relationship:

- legacy group repost rows are not target group content;
- legacy group repost rows are not Authorial Posts;
- legacy group repost rows are not Source References;
- legacy group repost rows are not group quality inputs;
- legacy group repost rows are not Blog candidate inputs;
- legacy group repost rows must not justify new group repost creation.

Group feed dependency:

- WS-4 owns future authorial-only group feed alignment.
- WS-5 supplies the legacy carve-out needed before WS-4 can claim group feed compliance.
- WS-8 must prove that any visible repost-shaped group artifact is either explicit legacy carve-out or regression.

Group feed negative blockers:

- legacy group repost row appears indistinguishable from post-transition Authorial Post;
- legacy group repost row counts as quality contribution;
- legacy group repost row is used as Blog candidate input;
- legacy group repost row is used to keep "respond by repost" behavior alive;
- legacy group repost row reconstructs thread or ancestry semantics.

## SECTION 8 - Relationship to Activity

WS-5 defines legacy activity relationship meaning. It does not define activity projection implementation.

Current relationship:

- `space.repost_created` represents outgoing repost activity;
- `space.post_reposted_by_other` represents incoming repost pressure;
- Activity page groups these under "Репосты";
- activity CTAs may link to `/space/feed?highlight=...`;
- historical repost activity shares the same social mental model as current public repost.

Target semantic relationship:

- legacy repost activity is historical activity under the old social propagation model;
- legacy repost activity is not proof that new Private Reposts should create activity;
- legacy repost activity is not Authorial Post activity;
- legacy repost activity is not Source Reference activity;
- legacy repost activity must not reconstruct discussion chains;
- legacy repost activity must not create Blog, economy, reward, Quest proof, or RF authority.

Activity split:

| Concern | Workstream owner |
| --- | --- |
| Legacy activity classification and carve-out semantics | WS-5 |
| New Private Repost activity silence / owner-context | WS-1 / WS-6 |
| Activity projection implementation | WS-6 |
| Activity copy quarantine | WS-7 |

Activity verification requirement:

Future verification must distinguish historical `repost_created` / `post_reposted_by_other` from post-transition Private Repost and Authorial Post behavior.

## SECTION 9 - Verification Targets

These are conceptual targets for future runtime alignment and BV. They are not test implementation.

### Positive verification targets

Future implementation must prove:

1. Legacy public repost rows are distinguishable from post-transition Private Reposts, Authorial Posts, and Source References.
2. Legacy group repost rows are distinguishable from post-transition group Authorial Posts.
3. Legacy repost activity is distinguishable from post-transition activity behavior.
4. Legacy highlight URLs are distinguishable from post-transition save/publish success paths.
5. Legacy profile repost items are distinguishable from authorial publications.
6. Legacy rows do not redefine doctrine or justify new public/group repost behavior.
7. Legacy rows do not become Authorial Posts.
8. Legacy rows do not become Source References.
9. Legacy rows do not become Blog candidate inputs.
10. Legacy rows do not become group quality inputs.
11. Legacy repost-of-post rows do not reconstruct chains.
12. Legacy rows do not mask missing Private Repost Context evidence.
13. Legacy rows do not mask missing Authorial Post / Source Reference evidence.
14. Legacy activity does not legitimize incoming social pressure for new Private Reposts.
15. Group feed verification can separate legacy carve-out from post-transition regression.

### Negative release-blocking signals

Future runtime alignment fails if:

- legacy rows cannot be distinguished from post-transition behavior;
- legacy public repost visibility is used as proof that public repost remains canonical;
- legacy group repost visibility is used as proof that group repost remains canonical;
- legacy repost text is treated as Authorial Post text;
- legacy repost target binding is treated as Source Reference;
- legacy rows are auto-converted to Authorial Posts;
- legacy rows are silently rewritten as Source References;
- legacy rows are made Blog candidates;
- legacy rows are used as group quality inputs;
- legacy repost-of-post rows reconstruct a reply/repost chain;
- legacy activity legitimizes new `post_reposted_by_other` pressure;
- legacy highlight URLs become post-transition success destinations;
- legacy profile rows inflate authorial publication metrics;
- hiding all repost-shaped behavior causes a false pass without proving Private Repost and Authorial Post paths.

### Verification traceability matrix

| Frozen canon rule | Future observable proof |
| --- | --- |
| Legacy rows are deprecated artifacts | Legacy rows classifiable separately from post-transition behavior |
| Legacy rows are not Authorial Posts | No authorial output inferred from legacy repost shape or text |
| Legacy rows are not Source References | No provenance inferred from legacy `repostTarget*` |
| Legacy rows are not target group content | Group verification treats them as carve-out or excludes them from pass evidence |
| Legacy rows are not Blog candidates | No legacy row enters candidate input |
| Legacy rows are not group quality inputs | No group quality signal derived from legacy row |
| Legacy rows must not redefine doctrine | Legacy visibility never justifies new public/group repost |
| Legacy rows require distinction | BV cannot pass without legacy/post-transition classification |

## SECTION 10 - Runtime Risks

### User confusion risks

- Users may see legacy repost cards and assume public repost remains an active feature.
- Users may see "Репосты" filters and expect public propagation to continue.
- Users may see "Комментарий к репосту" and confuse legacy commentary with authorial content.
- Users may follow legacy highlight links and interpret them as current post-transition destinations.
- Owners may lose trust if legacy rows disappear without explicit owner-facing policy.

### Doctrine drift risks

- Legacy repost text may be treated as Authorial Post text.
- Legacy `repostTarget*` may be treated as Source Reference.
- Legacy group repost rows may be treated as acceptable group content.
- Legacy repost-of-post rows may preserve hidden reply/thread behavior.
- Legacy profile rows may be treated as authorial productivity.

### Historical data risks

- Historical rows may remain visible in surfaces that now carry different target semantics.
- Historical activity may continue to project old social pressure.
- Historical highlight URLs may point to deprecated public repost cards.
- Historical group rows may block clean verification of authorial-only Group Feed.

### Verification risks

- False pass: all repost-shaped UI hidden without proving owner Private Repost and Authorial Post paths.
- False fail: legacy grandfathered rows misread as post-transition regressions.
- Masking: legacy rows hide absence of WS-1 or WS-3 runtime surfaces.
- Ambiguity: no reliable distinction between historical artifact and new behavior.

### Sequencing risks

- WS-2 cannot safely eliminate public repost until WS-5 distinguishes legacy from new behavior.
- WS-4 cannot prove authorial-only Group Feed without legacy group carve-out semantics.
- WS-6 cannot align activity without legacy activity stance.
- WS-8 cannot close BV without legacy distinction.

Dependency sentence:

WS-1 + WS-3 + WS-5 -> WS-2 -> WS-4 -> WS-6 -> WS-7 -> WS-8.

## SECTION 11 - Readiness

WS-5 specification readiness:

| Area | Status | Notes |
| --- | --- | --- |
| Current legacy runtime state documented | Ready | Baseline is `RUNTIME_PRE_TRANSITION` |
| Canon position documented | Ready | Anchored in Stage 13B.2-E/G/H |
| Legacy taxonomy defined | Ready | Public, group, commentary, activity, highlight, profile classes |
| Visibility boundaries defined | Ready | Owner/public/group relationships defined conceptually |
| Legacy vs post-transition distinction defined | Ready | Core WS-5 invariant documented |
| Forbidden transformations defined | Ready | Stage 13B.2-G transformations organized |
| Group Feed relationship defined | Ready | Target relationship and WS-4 dependency documented |
| Activity relationship defined | Ready | Legacy activity stance and WS-6 dependency documented |
| Verification targets defined | Ready | Positive and negative targets documented |
| Implementation readiness | Not ready | Implementation remains unauthorized |

Is WS-5 ready for implementation after this specification?

No. This report makes WS-5 ready for review and acceptance as a runtime alignment specification. It does not authorize implementation, migrations, data conversion, API design, DB design, frontend design, backend design, or retention policy implementation.

What is ready:

- WS-5 legacy taxonomy.
- WS-5 legacy relationship semantics.
- WS-5 owner/public/group visibility boundaries.
- WS-5 legacy vs post-transition distinction requirement.
- WS-5 forbidden transformations.
- WS-5 verification targets.

What remains before implementation:

- explicit implementation authorization;
- product decisions or carve-outs for legacy non-owner visibility, group suppression timing, legacy activity treatment, legacy highlight handling, and owner legacy labeling;
- WS-2 Public Repost Elimination Specification;
- WS-4 Group Feed Authorial-Only Specification;
- WS-6 Activity Projection Specification;
- WS-7 Language and Canon Quarantine Specification;
- WS-8 Verification and BV Alignment.

Recommended next step:

Stage 13B.3-D should prepare WS-2 - Public Repost Elimination Specification. WS-1, WS-3, and WS-5 now define the private retention surface, the authorial/source-reference surface, and the legacy distinction boundary needed before public repost elimination can be specified safely.

## Review gates

### Requirements Review

Result: pass.

The report answers the required sections for WS-5: current legacy runtime state, canon position, taxonomy, visibility boundary, legacy/post-transition distinction, forbidden transformations, Group Feed relationship, activity relationship, verification targets, risks, and readiness.

### Architecture Review

Result: pass at runtime-specification level.

Ownership boundaries are preserved:

- Space owns posts, legacy rows, Private Repost Context, and Authorial Posts.
- Source modules own source truth.
- Reactions own like/bookmark facts.
- Blog owns curated publication.
- Economy remains out of scope.

No API, DB, route, schema, migration, SQL plan, data conversion, frontend/backend design, or implementation is proposed.

### Runtime Governance Review

Result: pass with `RUNTIME_PRE_TRANSITION`.

The report defines legacy relationship semantics without authorizing runtime implementation.

### QA Review

Result: pass.

Future verification targets and release-blocking negative signals are defined, including legacy taxonomy, legacy/post-transition distinction, non-promotion, Group Feed exclusion, activity carve-out, highlight boundary, and profile publication boundary.

### Canon Review

Result: pass.

No doctrine changes were introduced. Stage 13B.2 canon is treated as immutable. Private Repost, Authorial Post, Source Reference, Group Feed, and Blog Candidate are not redesigned.

## Status tokens

```text
stage_13B_3_C_status: COMPLETE_AS_WS_5_LEGACY_RUNTIME_HANDLING_SPECIFICATION
stage_13B_3_C_execution_mode: READ_ONLY_RUNTIME_ALIGNMENT_SPECIFICATION
stage_13B_3_C_legacy_taxonomy_defined: TRUE
stage_13B_3_C_visibility_boundaries_defined: TRUE
stage_13B_3_C_forbidden_transformations_defined: TRUE
stage_13B_3_C_verification_targets_defined: TRUE
stage_13B_3_C_requires_implementation: FALSE
stage_13B_3_C_next_recommended_step: STAGE_13B_3_D_WS_2_PUBLIC_REPOST_ELIMINATION_SPECIFICATION
stage_13B_3_C_workstream: WS_5_LEGACY_RUNTIME_HANDLING
stage_13B_3_C_current_runtime_state: RUNTIME_PRE_TRANSITION
stage_13B_3_C_legacy_post_transition_boundary_defined: TRUE
stage_13B_3_C_group_feed_relationship_defined: TRUE
stage_13B_3_C_activity_relationship_defined: TRUE
stage_13B_3_C_readiness_assessed: TRUE
stage_13B_3_C_private_repost_redesign: FALSE
stage_13B_3_C_authorial_post_redesign: FALSE
stage_13B_3_C_source_reference_redesign: FALSE
stage_13B_3_C_group_feed_redesign: FALSE
stage_13B_3_C_blog_candidate_redesign: FALSE
stage_13B_3_C_implementation_proposed: FALSE
stage_13B_3_C_migration_proposed: FALSE
stage_13B_3_C_data_conversion_proposed: FALSE
stage_13B_3_C_api_design_proposed: FALSE
stage_13B_3_C_db_design_proposed: FALSE
stage_13B_3_C_frontend_design_proposed: FALSE
stage_13B_3_C_backend_design_proposed: FALSE
stage_13B_3_C_implementation_authorized: FALSE
```
