# Stage 13B.3-B - Authorial Post & Source Reference Runtime Specification

## Execution mode

Runtime alignment specification / read-only.

This slice prepares the runtime alignment specification for WS-3 - Authorial Post and Source Reference Alignment, as defined in Stage 13B.2-I.

This is not an implementation slice. It does not design or change:

- code;
- frontend implementation;
- backend implementation;
- API routes;
- OpenAPI;
- SDK/types;
- DB schema;
- migrations;
- UI screens or components;
- Authorial Post doctrine;
- Source Reference doctrine;
- Group Feed doctrine;
- Private Repost doctrine;
- moderation;
- economy, points, rewards, Quest proof, RF claim, or commercial authority.

No tests were run. No runtime changes were made.

Task type: runtime surface alignment specification.

Risk level: HIGH, because current runtime still routes object-bound expression through public repost machinery, while frozen Stage 13B.2 canon defines Authorial Post as the public/group expression primitive and Source Reference as one-hop context on Authorial Post only.

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

This report focuses only on WS-3.

WS-3 owns:

- runtime meaning of Authorial Post as the expression unit;
- runtime meaning of Source Reference as one-hop context on Authorial Post;
- separation between retention intent and expression intent at runtime semantics level;
- conceptual visibility and surface boundaries for Authorial Post and Source Reference;
- separation from `repostTargetType` / `repostTargetId`, Private Repost, Reactions, and legacy rows;
- conceptual verification targets for future implementation.

WS-3 does not own:

- Authorial Post product doctrine;
- Source Reference product doctrine;
- Group Feed doctrine or authorial-only implementation;
- Private Repost runtime surface;
- public repost elimination mechanics;
- full legacy row display or migration policy;
- activity projection implementation;
- copy rewrite implementation;
- final BV evidence bundle.

## Canon anchors

Stage 13B.2 doctrine is frozen. This report does not change it.

Approved canon used by WS-3:

- Stage 13B.2-C: repost is private context; reaction to material should become standalone authorial material, not public repost.
- Stage 13B.2-D: Authorial Post is standalone authored material; author text is primary.
- Stage 13B.2-E: public repost is deprecated; retention must split from expression.
- Stage 13B.2-F: Source Reference is one-hop provenance/context on Authorial Post; it is not repost target binding.
- Stage 13B.2-G: Private Repost Context is owner-only retention and not Authorial Post.
- Stage 13B.2-H: Group Feed exists for authorial content; weak/repost-shaped content is not target group content.
- Stage 13B.2-I: WS-3 aligns expression around Authorial Post and source context around Source Reference before public repost elimination is user-safe.
- Stage 13B.3-A: WS-1 defines Private Repost as owner-only retention; WS-3 references it only as a boundary.

Fundamental canon:

The user does not answer a publication. The user publishes their own material. Other materials are context, inspiration, or source.

## SECTION 1 - Current Runtime State

Current runtime state: `RUNTIME_PRE_TRANSITION`.

Today, Authorial Post exists only as a partial technical shape. Source Reference does not exist as a canonical runtime primitive.

Current Authorial Post behavior:

- `postType: post` exists in `spaceService.ts` and requires text.
- `postType: post` is technically distinct from `postType: repost`.
- `repostTargetType` and `repostTargetId` are rejected for non-repost posts, which is a useful separation discipline.
- There is no canonical object-bound path for "publish my thoughts" from source material into an Authorial Post.
- The current object-bound PWA path in `ContentActionRow.tsx` creates `postType: 'repost'` with `visibility: 'public'`.
- Group runtime has a read surface through `GroupPageClient.tsx` and `SpaceFeedCard`, but no authorial publishing runtime surface.
- Profile/publications copy and counters still include reposts alongside authored rows.
- Group feed query filters by group and visibility, not by authorial post type.

Current Source Reference behavior:

- No canonical Source Reference runtime primitive is present in the current Space runtime inventory.
- The only one-hop binding in current Space post runtime is `repostTargetType` / `repostTargetId` on `postType: repost`.
- Repost preview hydration and feed cards resolve repost targets, not Source References on Authorial Posts.
- The convenience `repostPost` path creates `postType: repost` with `repostTargetType: 'space_post'`, which preserves repost-of-post chain risk.
- Source modules remain owners of source truth, but runtime has no canonical pointer from Authorial Post to a source object.

Current gaps in short form:

- expression path is missing;
- Source Reference primitive is missing;
- save and publish intents remain conflated;
- repost target binding is the only source-like binding;
- group authorial publishing is absent;
- Blog candidate pathway is conceptual only;
- authorial independence is not represented in runtime.

Current baseline tokens:

```text
ws_3_runtime_baseline: RUNTIME_PRE_TRANSITION
ws_3_current_expression_path: PUBLIC_REPOST_PATH
ws_3_current_authorial_post_shape: POST_TYPE_POST_PARTIAL
ws_3_current_source_reference_primitive: ABSENT
ws_3_current_save_publish_split: CONFLATED
ws_3_current_repost_target_meaning: REPOST_BINDING_NOT_SOURCE_REFERENCE
ws_3_current_group_authorial_path: ABSENT
```

## SECTION 2 - Canon Target State

As defined by Stage 13B.2-D and Stage 13B.2-H, Authorial Post is a Space-owned user publication whose primary value is the author's own text, observation, argument, experience, synthesis, comparison, route, warning, or recommendation.

Target Authorial Post behavior:

- Authorial Post is the canonical expression primitive.
- Author text is primary.
- Source context is optional and secondary.
- Authorial Post can exist without any Source Reference.
- Authorial Post must remain meaningful if source preview is unavailable.
- Authorial Post does not depend on reply, comment, quote, thread, or repost-chain semantics.
- Authorial Post can participate in Group Feed because it is standalone authored material.
- Authorial Post can become a Blog candidate only through a future editorial/curatorial path.

As defined by Stage 13B.2-F, Source Reference is an optional one-hop contextual pointer from an Authorial Post to material that inspired, grounded, challenged, or contextualized the author's own publication.

Target Source Reference behavior:

- Source Reference exists only in relation to Authorial Post.
- Source Reference is optional.
- Source Reference is zero-or-one in the base model.
- Source Reference is one-hop only.
- Source Reference is provenance/context, not conversation.
- Source Reference is not `repostTargetType` / `repostTargetId`.
- Source Reference does not become a parent, reply, quote, thread root, activity event, reward signal, or ownership transfer.

Target primitive comparison:

| Primitive | Runtime meaning | Audience | Text role | Relationship to source |
| --- | --- | --- | --- | --- |
| Authorial Post | User-authored expression | Per publish policy | Primary content | May have optional Source Reference |
| Source Reference | Provenance/context on Authorial Post | Inherits Authorial Post audience | Secondary context | One-hop pointer only |
| Private Repost | Personal retention | Owner only | Optional private note | Retention binding, not public context |
| Repost target binding | Private retention target after WS-1 alignment | Owner-only private context | Not authorial text | Not Source Reference |
| Bookmark / Like | Reactions fact | Per Reactions policy | None | Not Space publication |
| Legacy repost row | Deprecated historical artifact | Legacy policy only | Historical commentary | Not Authorial Post and not Source Reference |

Target state tokens:

```text
ws_3_target_expression_primitive: AUTHORIAL_POST
ws_3_target_source_context_primitive: SOURCE_REFERENCE
ws_3_target_reference_cardinality: ZERO_OR_ONE
ws_3_target_reference_hop_count: ONE
ws_3_target_author_text_role: PRIMARY
ws_3_target_source_context_role: SECONDARY
ws_3_target_repost_target_binding_role: NOT_SOURCE_REFERENCE
ws_3_target_save_publish_split: SEPARATED
```

## SECTION 3 - Runtime Gap Inventory

Runtime gap inventory:

| # | Gap | Current runtime | Canon target |
| --- | --- | --- | --- |
| 1 | Authorial expression path absent | Object-bound expression creates public repost | User can publish Authorial Post as expression |
| 2 | Source Reference primitive absent | No canonical runtime primitive | Optional one-hop context on Authorial Post |
| 3 | Save/publish conflated | Share-to-Space is single repost path | Retention and expression are separate intents |
| 4 | Repost target is only binding | `repostTargetType` / `repostTargetId` on repost | Source Reference is separate from repost target |
| 5 | Source object to Authorial Post path missing | Source pages use ContentActionRow repost path | Source can inspire Authorial Post with optional reference |
| 6 | Authorial independence not represented | Repost preview + commentary can dominate | Author text primary; source secondary |
| 7 | One-hop discipline sits on repost | Repost target is one-hop but has wrong meaning | One-hop belongs to Source Reference on Authorial Post |
| 8 | Dedupe scope risk | Repost dedupe by owner+target exists | Private repost dedupe must not block Authorial Posts |
| 9 | Group authorial publish path absent | Group page reads feed, no authorial runtime path | Group expression is Authorial Post |
| 10 | Group read can include repost-shaped rows | Query filters group/visibility, not post type | Target group expression is authorial-only |
| 11 | Profile includes reposts in publication framing | Reposts counted alongside authored rows | Authorial output excludes Private/legacy repost |
| 12 | Blog candidate runtime absent | No candidate pathway | Quality Authorial Posts may become candidates conceptually |
| 13 | Activity and repost endpoint preserve chain risk | `repostPost` creates `space_post` repost | Response near a post is new Authorial Post with nearest Source Reference |
| 14 | Legacy rows can look like expression | Existing repost rows not distinguished | Legacy rows are not Authorial Posts or Source References |

Gap severity:

- P0 for WS-3: absent Source Reference primitive, absent object-bound Authorial Post expression path, repostTarget/source-reference confusion, save/publish conflation.
- P1 for WS-3: authorial independence not represented, profile/publication conflation, group authorial path absence, Blog candidate relationship absent.
- Cross-workstream dependencies: WS-1 private retention boundary, WS-2 public repost elimination, WS-4 group feed read policy, WS-5 legacy distinction, WS-6 activity projection, WS-7 copy quarantine.

## SECTION 4 - Authorial Post Runtime Surface

This section defines runtime behavior only. It does not define UI, routes, components, APIs, schemas, or storage.

### Where Authorial Post belongs

Authorial Post belongs in the expression surface class of Space.

That surface class is responsible for:

- publishing the user's own thought;
- carrying author text as primary content;
- optionally carrying a Source Reference as secondary context;
- participating in group/public expression according to future publish policy;
- becoming eligible for future Blog candidate consideration only through authorial quality and editorial/curatorial attention.

Authorial Post belongs in:

- Group Feed as standalone authorial material;
- profile/publications as authorial output;
- home/public feed only where future publish policy allows public authorial posts;
- Blog candidate relationship as possible input, not automatic promotion.

### Where Authorial Post does not belong

Authorial Post does not belong in:

- Private Repost owner-only inventory;
- Reactions like/bookmark facts;
- public repost filters or repost counters;
- legacy repost row reinterpretation;
- reply/comment/quote/thread surfaces;
- activity events as content;
- Quest proof, RF claim, reward, or commercial authority surfaces.

### Relationship to Group Feed

Group Feed target content is Authorial Post with optional one-hop Source Reference.

WS-3 defines what Authorial Post means for group expression:

- it is standalone;
- it is flat;
- it does not nest under a referenced post;
- it does not rely on ancestry;
- it does not use repost to simulate response.

WS-3 does not define group feed query policy. That belongs to WS-4.

### Relationship to profile

Authorial Post is profile-visible authorial output according to future visibility policy.

Target profile relationship:

- Authorial Posts count as publications;
- Private Reposts do not count as authorial output;
- legacy repost rows require WS-5 carve-out;
- Source Reference appears only as context on an Authorial Post, not as a separate profile item.

### Relationship to Blog candidate flow

Authorial Post is the only WS-3 primitive that can become a Blog candidate.

This is conceptual only:

- candidate status is not automatic;
- candidate status is not an economy reward;
- candidate status is editorial/curatorial;
- Source Reference may provide provenance for review;
- Blog publication is a curated artifact, not a raw Space row copied verbatim.

Boundary rule:

Bookmark saves a reaction fact. Private Repost saves context. Authorial Post publishes thought. Source Reference explains provenance on Authorial Post.

## SECTION 5 - Source Reference Runtime Surface

This section defines runtime behavior only. It does not define UI, routes, components, APIs, schemas, or storage.

### Where Source Reference belongs

Source Reference belongs only on Authorial Post.

Runtime surface meaning:

- one optional source-context relation;
- one-hop pointer to nearest relevant source;
- secondary provenance/context visible through the Authorial Post;
- source module ownership preserved;
- support for readers and future editors to understand where the author's thought originated.

### Where Source Reference does not belong

Source Reference does not belong as:

- a standalone post;
- a repost;
- a Private Repost;
- a bookmark;
- a reaction fact;
- an activity event;
- a reply pointer;
- a comment parent;
- a quote-post relation;
- a thread root;
- a reward/proof/commercial claim;
- an automatic conversion from legacy repost rows.

### Relationship to Authorial Post

Source Reference is attached to Authorial Post as secondary context.

Rules:

- Authorial Post can exist without Source Reference.
- Source Reference cannot replace author text.
- Source Reference cannot make weak text authorial.
- If the Source Reference preview disappears, the Authorial Post should still communicate useful thought.
- Source Reference may help explain inspiration, context, source material, counterpoint, or nearest relation.

### Relationship to repostTarget

`repostTargetType` / `repostTargetId` are not Source Reference.

Boundary:

- repost target binding belongs to repost/private retention semantics;
- Source Reference belongs to Authorial Post expression semantics;
- repost target centers the source object;
- Source Reference supports the author's material;
- repost dedupe must not constrain Authorial Posts about the same source;
- Source Reference must not be implemented conceptually as a renamed repost target.

### Relationship to group feed

Source Reference appears in Group Feed only through an Authorial Post.

It must not:

- create nested group rendering;
- create reply counts;
- create parent/child semantics;
- create incoming social pressure on the referenced author;
- make group content source-dominated;
- reconstruct a chain behind the referenced source.

### Anti-drift forbidden list

1. Treat repost target binding as Source Reference.
2. Treat Private Repost as Source Reference.
3. Create multi-hop Source Reference chains.
4. Use Source Reference as reply/comment parent.
5. Auto-create Source Reference from legacy repost rows.
6. Use Source Reference for economy, rewards, proof, or commercial authority.
7. Let Source Reference replace author text as primary payload.
8. Reconstruct discussion ancestry through references.
9. Treat Source Reference as attribution-only label.
10. Treat Source Reference preview as the body of the post.
11. Use Source Reference to create incoming social pressure.
12. Treat Source Reference as Blog candidate by itself.

## SECTION 6 - Visibility Rules

WS-3 defines semantic visibility outcomes, not implementation mapping to existing `visibility` fields.

Conceptual visibility:

| Actor / audience | Authorial Post | Source Reference |
| --- | --- | --- |
| Author | Can view and manage own authorial material per future authorial policy | Can view reference context attached to own post |
| Group members | Can view group-published Authorial Posts per group visibility | Visible only through the Authorial Post and only within allowed audience |
| Public | Can view public Authorial Posts if future policy allows public authorial posts | Visible only through public Authorial Post |
| Non-audience | No access to restricted/group-only Authorial Post | No standalone discovery or audience expansion |
| Source author | No special incoming pressure from reference alone | No reply-chain or repost-chain semantics |
| Private Repost owner context | Not applicable; separate primitive | Not applicable; Source Reference is not private retention |
| Blog/editorial context | May inspect candidate Authorial Post per future editorial policy | Provenance context only; not promoted content |

Visibility inheritance rule:

- Source Reference inherits visibility from the Authorial Post.
- Source Reference does not create its own audience.
- Source Reference must not leak source content beyond source module policy.
- Source Reference must not make an inaccessible source visible merely because the Authorial Post is visible.

Open visibility questions from Stage 13B.2-D/F/H remain unresolved by this report:

- whether v1 Authorial Posts are group-first or can also be public non-group posts;
- whether cross-group Space post references are allowed;
- what happens when a referenced source is private, restricted, removed, or unavailable;
- whether Source Reference is immutable after publication.

These are implementation blockers or carve-out decisions, not doctrine changes.

## SECTION 7 - Authorial Independence Boundary

Stage 13B.2-H defines the authorial boundary. WS-3 translates it into runtime-alignment language.

Authorial independence means:

- author text has standalone value;
- source is secondary context;
- the post can be understood without opening the source;
- the post contributes observation, experience, synthesis, comparison, warning, route, recommendation, or argument;
- the post does not depend on reply/comment/quote/repost-chain semantics;
- the post does not use Source Reference to compensate for weak author text.

Runtime-alignment boundary:

- `postType: post` plus text is necessary but not sufficient to prove authorial meaning.
- Empty or trivial text with a strong source remains weak content.
- Source preview plus short reaction is not Authorial Post.
- Repost with commentary is not Authorial Post.
- Private repost note moved into public/group context is not automatically authorial.
- Legacy repost text is not automatically authorial material.

Authorial independence test:

If the Source Reference disappears, does the post still communicate a useful thought?

- Pass: the author's text still carries the meaning.
- Fail: the source preview was the actual body.

No chain reconstruction rule:

- Authorial Post may reference nearest source.
- It must not pull through the source's own references.
- It must not become a child of the referenced source.
- It must not create thread ancestry.
- It must not generate quote/repost/reply taxonomy.

## SECTION 8 - Blog Candidate Relationship

This section defines runtime relationship only. It does not define scoring, ranking, moderation, nomination, editorial workflow, or implementation.

Authorial Post relationship to Blog candidate flow:

- Authorial Post can be a future candidate input.
- Candidate status depends on authorial quality and editorial/curatorial attention.
- Group-published Authorial Posts are the strongest conceptual source for Blog candidates.
- Public non-group Authorial Post candidate policy remains a future product decision.
- Blog article is a curated artifact, not raw Space post replication.

Source Reference relationship to Blog candidate flow:

- Source Reference provides provenance/context for the Authorial Post.
- Source Reference may help editors understand the source of the author's thought.
- Source Reference does not become the candidate.
- Source Reference does not promote the referenced source into Blog.
- Source Reference does not create editorial attribution policy by itself.

Explicit exclusions:

- Private Repost is not a Blog candidate.
- Legacy public/group repost row is not a Blog candidate.
- Source Reference alone is not a Blog candidate.
- Bookmark/like is not a Blog candidate.
- Activity event is not a Blog candidate.
- Quest proof or RF transaction state is not a Blog candidate.
- Weak or source-dominated content is not a Blog candidate.

Blog candidate boundary:

Authorial Post in Group -> quality group contribution -> editorial attention or candidate nomination -> curated Blog draft or decline -> Blog Asia publication if accepted.

## SECTION 9 - Verification Targets

These are conceptual targets for future runtime implementation and BV. They are not test implementation.

### Positive verification targets

Future implementation must prove:

1. A user can express a thought as an Authorial Post without creating public/group repost.
2. Authorial Post exists as a standalone expression primitive distinct from repost, bookmark, reaction, comment, reply, and quote.
3. Author text is primary in runtime meaning.
4. Authorial Post without Source Reference remains valid when independently meaningful.
5. Optional Source Reference attaches only to Authorial Post.
6. Source Reference is zero-or-one and one-hop.
7. Source Reference is visible only through the Authorial Post.
8. `repostTargetType` / `repostTargetId` are not treated as Source Reference.
9. Private Repost target binding is distinct from Source Reference.
10. Private Repost dedupe does not block Authorial Posts about the same source.
11. Legacy repost rows are distinguishable from post-transition Authorial Posts.
12. Legacy repost rows are not auto-promoted into Authorial Posts or Source References.
13. Group-bound expression produces Authorial Post semantics, not repost semantics.
14. Group Feed can use Authorial Posts as target content semantics; read policy remains WS-4.
15. Source module ownership is preserved in reference resolution.
16. Source Reference does not reconstruct reply/comment/quote/repost chains.
17. Source Reference does not create incoming social pressure for referenced source author.
18. Blog candidate relationship begins from quality Authorial Post, not Source Reference alone.

### Negative release-blocking signals

Future runtime alignment fails if:

- new object-bound expression creates `postType: repost` as the default path;
- Source Reference is implemented conceptually as alias of `repostTargetType` / `repostTargetId`;
- Private Repost binding is displayed as Source Reference;
- Authorial Post requires repost dedupe clearance before publishing;
- Authorial Post is empty or source-preview-dominated while still treated as authorial;
- Source Reference creates multi-hop ancestry display;
- referenced Space post receives reply/thread/child semantics from Source Reference;
- Source Reference creates `post_reposted_by_other` or equivalent incoming pressure;
- group expression uses repost-of-post as response path;
- legacy public/group repost row auto-converts to Authorial Post;
- legacy public/group repost row auto-converts to Source Reference;
- Source Reference alone becomes Blog candidate input;
- weak content becomes candidate input because it has a Source Reference;
- verification cannot distinguish legacy repost row from post-transition Authorial Post.

### Verification traceability matrix

| Frozen canon rule | Future observable proof |
| --- | --- |
| Authorial Post is standalone authored material | Expression primitive exists and text is primary |
| Source Reference is one-hop context | Optional single nearest source, no ancestry |
| Source Reference is not repost target binding | Distinct runtime meaning from `repostTarget*` |
| Private Repost is retention | Retention path remains separate from expression path |
| Authorial text is primary | Source preview is secondary and cannot carry the post |
| Group response is new Authorial Post | No reply/comment/repost chain required |
| Group Feed cultivates authorial content | New group expression uses Authorial Post semantics |
| Blog candidates come from quality Authorial Posts | Repost/reference/reaction excluded from candidate input |
| Legacy rows are artifacts | Legacy rows not auto-converted or used as proof of target doctrine |

## SECTION 10 - Runtime Risks

### Product risks

- Removing public repost before Authorial Post path exists may create an expression gap.
- Users currently understand source-object sharing as "Поделиться в Space".
- If authorial path is not clearly separated from Private Repost, users may not understand save vs publish.
- If Source Reference is too source-dominant, users may keep producing quote-like repost cards.

### Doctrine drift risks

- `repostTargetType` / `repostTargetId` may be reused as Source Reference under a new name.
- "Комментарий к репосту" may be treated as Authorial Post text.
- Source Reference may become a reply pointer or thread parent.
- Source Reference may become attribution-only label and lose product meaning.
- Private Repost note may be mistaken for authorial material.
- Legacy repost rows may be treated as already-existing Authorial Posts.

### Repost/source confusion risks

- The current one-hop discipline on repost target may create a false sense that Source Reference already exists.
- Repost preview hydration may be reused conceptually in source-first shape, preserving quote-post mental model.
- `space_post` repost endpoint may remain the easiest "respond to post" path and recreate chain semantics.
- Repost dedupe may accidentally constrain authorial posts if retention and expression remain linked.

### Chain reconstruction risks

- A references B and B references C, so runtime shows C on A.
- A references B, therefore B receives reply count or incoming pressure.
- A references B, therefore group feed nests A under B.
- A references a legacy repost row, therefore the original repost target is pulled into A.
- Activity reconstructs an "answered by" graph from Source References.

### Weak-content risks

- Source preview plus trivial text is accepted as authorial.
- Source Reference is used to make weak content look stronger.
- Group Feed fills with source-dominated cards rather than authored materials.
- Blog candidate path receives weak or repost-shaped content.
- Future incentives, if added later, reward volume instead of substance.

### Cross-workstream risks

- WS-2 depends on WS-1, WS-3, and WS-5; public repost elimination is unsafe without private retention, authorial expression, and legacy distinction.
- WS-4 cannot prove authorial-only Group Feed until WS-3 defines Authorial Post runtime meaning.
- WS-5 must distinguish legacy rows so they do not mask missing Authorial Post path.
- WS-6 must avoid creating source-author pressure from Source Reference.
- WS-7 must quarantine old "share/repost/commentary/reply" language after semantics are accepted.

## SECTION 11 - Readiness

WS-3 specification readiness:

| Area | Status | Notes |
| --- | --- | --- |
| Current runtime state documented | Ready | Baseline is `RUNTIME_PRE_TRANSITION` |
| Canon target state documented | Ready | Anchored in Stage 13B.2-D/F/H |
| Runtime gaps identified | Ready | WS-3 gap inventory complete |
| Authorial Post runtime role defined | Ready | Expression semantics defined |
| Source Reference runtime role defined | Ready | One-hop secondary context defined |
| Visibility rules | Ready | Semantic outcomes defined |
| Authorial independence boundary | Ready | Stage 13B.2-H translated to runtime alignment language |
| Blog candidate relationship | Ready | Conceptual relationship defined |
| Verification targets | Ready | Positive and negative targets defined |
| Implementation readiness | Not ready | Implementation remains unauthorized |

Is WS-3 ready for implementation after this specification?

No. This report makes WS-3 ready for review and acceptance as a runtime alignment specification. It does not authorize implementation.

What is ready:

- WS-3 target runtime semantics.
- Authorial Post runtime role as expression primitive.
- Source Reference runtime role as one-hop context.
- Visibility inheritance and authorial independence boundaries.
- Blog candidate relationship.
- WS-3 verification targets.

What remains before implementation:

- explicit implementation authorization;
- decisions or carve-outs for unresolved Stage 13B.2-D/F/H visibility and reference questions;
- WS-5 legacy runtime handling specification;
- WS-2 public repost elimination specification after WS-1, WS-3, and WS-5 are accepted;
- WS-4 group feed authorial-only specification;
- WS-6 activity projection specification;
- WS-7 language and canon quarantine specification.

Recommended next step:

Stage 13B.3-C should prepare WS-5 - Legacy Runtime Handling Specification. The reason is sequencing: WS-1 and WS-3 now define the new private retention and authorial expression surfaces, while WS-5 is needed to distinguish old public/group repost artifacts from post-transition behavior before WS-2 and WS-4 can be specified safely.

Parallel planning can continue for unresolved Stage 13B.2-D/F/H open questions, but those should be treated as product decision gates or carve-outs, not doctrine redesign.

## Review gates

### Requirements Review

Result: pass.

The report answers the required sections for WS-3: current runtime state, canon target state, gap inventory, Authorial Post runtime surface, Source Reference runtime surface, visibility, authorial independence, Blog candidate relationship, verification targets, risks, and readiness.

### Architecture Review

Result: pass at runtime-specification level.

Ownership boundaries are preserved:

- Space owns Authorial Posts and Private Repost Context.
- Source modules own source truth.
- Reactions own like/bookmark facts.
- Blog owns curated publication.
- Economy remains out of scope.

No API, DB, route, schema, migration, frontend/backend design, or implementation is proposed.

### Runtime Governance Review

Result: pass with `RUNTIME_PRE_TRANSITION`.

The report defines target runtime semantics without authorizing runtime implementation.

### QA Review

Result: pass.

Future verification targets and release-blocking negative signals are defined, including Authorial Post independence, Source Reference one-hop integrity, repostTarget separation, group expression semantics, Blog candidate boundaries, and legacy distinction.

### Canon Review

Result: pass.

No doctrine changes were introduced. Stage 13B.2 canon is treated as immutable. Authorial Post, Source Reference, Group Feed, and Private Repost are not redesigned.

## Status tokens

```text
stage_13B_3_B_status: COMPLETE_AS_WS_3_AUTHORIAL_POST_SOURCE_REFERENCE_RUNTIME_SPECIFICATION
stage_13B_3_B_execution_mode: READ_ONLY_RUNTIME_ALIGNMENT_SPECIFICATION
stage_13B_3_B_runtime_gap_inventory_complete: TRUE
stage_13B_3_B_authorial_runtime_role_defined: TRUE
stage_13B_3_B_source_reference_runtime_role_defined: TRUE
stage_13B_3_B_visibility_rules_defined: TRUE
stage_13B_3_B_verification_targets_defined: TRUE
stage_13B_3_B_requires_implementation: FALSE
stage_13B_3_B_next_recommended_step: STAGE_13B_3_C_WS_5_LEGACY_RUNTIME_HANDLING_SPECIFICATION
stage_13B_3_B_workstream: WS_3_AUTHORIAL_POST_AND_SOURCE_REFERENCE_ALIGNMENT
stage_13B_3_B_current_runtime_state: RUNTIME_PRE_TRANSITION
stage_13B_3_B_authorial_independence_boundary_defined: TRUE
stage_13B_3_B_blog_candidate_relationship_defined: TRUE
stage_13B_3_B_repost_target_separation_defined: TRUE
stage_13B_3_B_one_hop_integrity_defined: TRUE
stage_13B_3_B_save_publish_split_defined: TRUE
stage_13B_3_B_readiness_assessed: TRUE
stage_13B_3_B_authorial_post_redesign: FALSE
stage_13B_3_B_source_reference_redesign: FALSE
stage_13B_3_B_group_feed_redesign: FALSE
stage_13B_3_B_private_repost_redesign: FALSE
stage_13B_3_B_implementation_proposed: FALSE
stage_13B_3_B_api_design_proposed: FALSE
stage_13B_3_B_db_design_proposed: FALSE
stage_13B_3_B_frontend_design_proposed: FALSE
stage_13B_3_B_backend_design_proposed: FALSE
stage_13B_3_B_implementation_authorized: FALSE
```
