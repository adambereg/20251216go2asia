# Stage 13B.2-G - Private Repost Context & Legacy Row Policy

## Execution mode

Doctrine design / policy specification / read-only.

This slice defines Private Repost Context and the conceptual policy for legacy public/group repost rows. It does not design or change:

- code;
- frontend implementation;
- backend implementation;
- OpenAPI;
- SDK/types;
- DB schema;
- migrations;
- API endpoints;
- runtime alignment;
- moderation implementation;
- economy, points, rewards.

No tests or runtime validation were required or run.

Task type: product doctrine and legacy policy specification.

Risk level: HIGH, because this slice decides how existing repost machinery is reinterpreted after Stage 13B.2-C/D/E/F moved Go2Asia away from public repost propagation toward Authorial Posts and Source References.

## Agents

Multi-agent mode was activated using the `docs/ai` role model.

- Lead: AI Program Director / Orchestrator.
- Requirements Analyst.
- Software Architect.
- Runtime Governance Architect.
- Product Analyst.
- Delivery Planner.
- Technical Canon Writer.

Review gates:

- Requirements Review.
- Architecture Review.
- Runtime Governance Review.
- Canon Review.

## Problem statement

Stage 13B.2-C established the new repost doctrine:

- repost is private user context;
- public/group repost is a doctrine mismatch;
- group feed should contain standalone authorial posts;
- Go2Asia does not build reply/repost chains.

Stage 13B.2-D defined Authorial Post:

- author text is primary;
- Authorial Post is the public/group expression unit;
- private repost may precede Authorial Post, but does not create it automatically;
- Blog Asia receives candidates from authorial material, not repost chains.

Stage 13B.2-E defined the public repost transition:

- public/group repost is deprecated as expression;
- existing public/group repost rows need legacy policy;
- Share-to-Space must split retention from expression;
- private repost remains valid as personal context.

Stage 13B.2-F defined Source Reference:

- Source Reference is one-hop context on Authorial Post;
- Source Reference is not repost target binding;
- legacy public repost rows are not Source References.

The remaining policy gap is Private Repost Context and the conceptual fate of existing public/group repost rows.

Fundamental doctrine:

The user does not answer a publication. The user publishes their own material. Other materials are context, inspiration, or source for that publication.

Private Repost is not public publication. Private Repost is personal user context.

## Private Repost Context definition

Private Repost Context is the owner-only product context where a user keeps source material for themselves, optionally with a personal note.

Canonical definition:

Private Repost Context is a Space-owned personal retention context. A Private Repost binds one user to one source target as "saved for myself" context, with optional private note text. It is not public expression, not group publishing, not reply/comment/quote, not Source Reference, and not Blog candidate material.

Private Repost means:

- I want to remember this source.
- I may want to return to it later.
- I may add a note for myself.
- I am not publishing an authorial statement to a group or public surface.
- I am not creating social pressure on the source author.

Role inside Go2Asia:

- provides a personal retention layer in Space;
- preserves the useful parts of Stage 13B.2-A/B/BR repost commentary work as private note machinery;
- separates "save for myself" from "publish my thoughts";
- protects group feed from low-effort repost propagation;
- keeps Authorial Post as the only target public/group expression primitive.

## Purpose

Private Repost exists because Authorial Post and Source Reference do not satisfy the personal retention need.

Why Authorial Post is not enough:

- Authorial Post requires authored expression.
- Users often need to keep a source before they know what they want to write.
- Not every useful source deserves a public/group post.
- Forcing every saved source into authorial publishing would create weak public content.

Why Source Reference is not enough:

- Source Reference exists only as context attached to an Authorial Post.
- It communicates provenance for published material.
- It does not create a personal saved item.
- It does not hold a private note.
- It should not be used as a private retention mechanism.

Why users still need Private Repost:

- to keep an object for later reading;
- to collect personal context;
- to write a private note or reminder;
- to return later and possibly create an independent Authorial Post;
- to avoid turning every reaction into public noise.

Private Repost preserves retention without public propagation.

## Comparison matrix

| Concept | Primary meaning | Audience | Text role | Group Feed | Blog Asia | Boundary |
| --- | --- | --- | --- | --- | --- | --- |
| Private Repost | Personal retention / saved context | Owner only | Optional private note | No | No | Not publication |
| Authorial Post | User's own material | Group/public according to future policy | Primary content | Yes | Possible candidate | Not retention |
| Source Reference | One-hop provenance/context on Authorial Post | Readers of the post | Secondary context | Only through Authorial Post | Provenance only | Not repost |
| Bookmark / Like | Reactions fact | According to Reactions policy | None | No | No | Not Space post |
| Legacy public repost | Deprecated public propagation artifact | Legacy policy only | Historical commentary | No in target doctrine | No | Not canonical |
| Legacy group repost | Deprecated group propagation artifact | Legacy policy only | Historical commentary | No in target doctrine | No | Not canonical |

Short rule:

Private Repost saves context. Authorial Post publishes thought. Source Reference explains provenance. Bookmark and like are reactions. Legacy repost rows are historical transition artifacts.

## Private Repost lifecycle

Conceptual lifecycle:

Source material  
->  
User intent: save for myself  
->  
Private Repost Context  
->  
Optional private note  
->  
Possible future Authorial Post  
->  
Private Repost remains personal context unless a future owner action or policy changes it.

Lifecycle rules:

1. Private Repost begins with retention intent, not publication intent.
2. The source target remains the center of the saved context.
3. Optional text is a private note, not public commentary.
4. Editing the note is private-context behavior.
5. A future Authorial Post is a separate act of expression.
6. Private Repost does not automatically create Authorial Post.
7. Private Repost dedupe can exist in private scope and must not limit Authorial Posts about the same source.
8. Private Repost should not create incoming social pressure for the referenced source author.

User intent split:

| User intent | Canonical primitive |
| --- | --- |
| I like this | Reaction fact |
| I want to bookmark this | Reaction fact |
| I want to save this into my Space context | Private Repost |
| I want to publish my thought | Authorial Post |
| I want to write near another post | Authorial Post with optional nearest Source Reference |

## Private Repost role in ecosystem

Private Repost Context plays the role of personal memory and source retention.

It satisfies these user needs:

- remembering source materials;
- collecting future writing prompts;
- keeping private context separate from public identity;
- writing a private note without pressure to publish;
- later using a source as inspiration for independent authorial work.

Conceptual product surface role:

- owner-only context;
- personal saved source inventory;
- private note context;
- not public feed;
- not group feed;
- not author profile publication stream;
- not Blog candidate queue;
- not activity-based social pressure.

This section does not define routes, UI, screens, components, storage, permissions, or endpoints. It defines only the ecosystem role.

## Legacy repost policy

Legacy public/group repost rows are existing rows from the superseded public repost doctrine.

They are:

- historical artifacts of the previous public propagation model;
- deprecated publication-model records;
- possible owner-context candidates in a future policy;
- not canonical public/group content;
- not Authorial Posts;
- not Source References;
- not Blog candidates.

Chosen conceptual policy:

Existing public/group repost rows should be treated as legacy private-context candidates and deprecated publication artifacts. They should be preserved conceptually until a future runtime/data policy decides display or archive behavior, but they should not participate in the target public/group content model.

What this means:

- do not delete automatically;
- do not convert automatically;
- do not treat as active group content;
- do not use as proof that public repost remains canonical;
- allow future owner-context access as a policy option;
- keep them out of the target Blog and group quality model.

Legacy categories:

| Category | Meaning | Target doctrine |
| --- | --- | --- |
| Legacy public repost row | Public repost created before doctrine transition | Deprecated public artifact |
| Legacy group repost row | Group repost created or displayed under old model | Excluded from target group feed |
| Legacy repost with commentary | Repost text under old public semantics | Not Authorial Post |
| Legacy repost of Space post | Possible chain artifact | Not discussion chain |
| Historical repost activity | Activity created under old model | Needs future legacy display policy |

## Legacy transformation rules

Forbidden transformations:

1. Do not automatically convert a legacy public/group repost into an Authorial Post.
2. Do not automatically treat repost text as authorial material.
3. Do not automatically make legacy reposts Blog candidates.
4. Do not automatically delete legacy rows in a doctrine slice.
5. Do not silently rewrite legacy rows into Source References.
6. Do not use legacy public rows to justify new public repost behavior.
7. Do not use legacy group rows as group quality signals.
8. Do not reconstruct discussion chains from legacy repost-of-post rows.
9. Do not create incoming social pressure from new private reposts.
10. Do not let private repost dedupe constrain Authorial Posts.
11. Do not treat old "commentary to repost" language as public/group canon.
12. Do not make legacy repost rows part of the Blog pipeline.

Allowed conceptual stances for future policy:

- owner-visible legacy archive;
- owner private-context reclassification with explicit policy;
- read-only historical artifact;
- suppressed from active public/group surfaces;
- grandfathered display with clear legacy semantics.

This document does not choose a technical migration strategy.

## Group Feed relationship

Private Repost does not belong in Group Feed.

Why:

- Group Feed is for standalone Authorial Posts.
- Private Repost centers the source, not the author's material.
- Private Repost is retention, not expression.
- Repost in group encourages low-effort distribution.
- Group repost can create hidden reply/repost chains.
- Group Feed exists to cultivate material that may become Blog candidates.

Target group doctrine:

- group feed contains Authorial Posts;
- group feed may show Source Reference only as secondary context on an Authorial Post;
- group feed does not contain private reposts;
- group feed does not contain legacy repost rows as target content;
- group feed does not contain comments, replies, quote-post trees, or repost chains.

Response model:

Read group post  
->  
Write a new Authorial Post  
->  
Optionally reference nearest source post  
->  
Publish standalone authorial material  
->  
No reply tree, no repost chain.

## Blog relationship

Private Repost cannot become a Blog candidate directly.

Why:

- it is personal context, not public material;
- optional note is not an authorial publication;
- source preview is not the user's authored work;
- Blog Asia curates durable authorial content, not saved objects;
- Blog candidacy must come through Authorial Post and editorial review.

Blog relationship:

Private Repost may inform the user personally. Later, the user may write an independent Authorial Post inspired by the same source. That Authorial Post can enter the Blog candidate lifecycle if it has enough authorial substance. The Private Repost itself does not enter Blog.

Explicit exclusions:

- Private Repost is not Blog candidate.
- Legacy public repost is not Blog candidate.
- Legacy group repost is not Blog candidate.
- Source Reference alone is not Blog candidate.
- Reaction facts are not Blog candidates.
- Activity events are not Blog candidates.

## Anti-drift rules

1. Private Repost is not public publication.
2. Private Repost is not Group Feed content.
3. Private Repost is not Authorial Post.
4. Private Repost is not Source Reference.
5. Private Repost target binding is not provenance for public material.
6. Private Repost note is not public commentary.
7. Private Repost does not create reply/comment/quote/thread semantics.
8. Private Repost does not create incoming social pressure on source author.
9. Private Repost does not activate Blog candidacy.
10. Private Repost does not activate economy, points, rewards, Quest proof, RF claim, or commercial authority.
11. Bookmark and like remain Reactions facts, not repost variants.
12. Legacy public/group repost rows are not proof that public repost remains canonical.
13. Legacy public/group repost rows are not Source References.
14. Legacy public/group repost rows are not Authorial Posts.
15. Legacy public/group repost rows are not group quality inputs.
16. Stage 13B.2-A/B/BR commentary work is reinterpreted as private-note machinery, not target public authoring.
17. Share-to-Space must conceptually split save intent from publish intent.
18. `space_post` repost target must not become public repost-of-post discourse.

## Open questions

1. What is the exact product surface name for Private Repost Context?
2. Should owner-visible legacy rows be labeled as archived, legacy, or saved context?
3. Should legacy public repost rows remain visible to non-owners in any read-only historical mode?
4. Should legacy group repost rows be suppressed from group feed before full runtime alignment?
5. How should historical `post_reposted_by_other` activity be displayed or retired?
6. What exact Russian copy replaces "Поделиться в Space" for save intent?
7. What exact Russian copy replaces "Комментарий к репосту" in private context?
8. Can a user save another user's Space post privately without notifying the post author?
9. Should `space_post` remain an eligible private repost target after public chain semantics are removed?
10. Can the same user hold a Private Repost and multiple Authorial Posts for the same source?
11. How should legacy public feed highlight URLs be handled conceptually?
12. Should private note edits be silent in all future policies?
13. How should staging/runtime verification distinguish legacy rows from post-transition behavior?
14. Which older 13B.1-D reports need explicit supersession notes?

## Review gates

### Requirements Review

Result: pass with open questions.

Private Repost Context is clearly defined as owner-only retention. Differences from Authorial Post and Source Reference are explicit. Legacy public/group repost rows have a conceptual policy and forbidden transformations.

### Architecture Review

Result: pass at conceptual architecture level.

The policy preserves ownership boundaries:

- Space owns user posts and private repost context.
- Reactions own like/bookmark facts.
- Source modules own source truth.
- Blog owns curated publication.
- Economy remains out of scope.

No API, DB, schema, storage, endpoint, migration, frontend, or runtime implementation is proposed.

### Runtime Governance Review

Result: pass with `RUNTIME_PRE_TRANSITION`.

Current runtime still contains public/group repost behavior and activity semantics from the older model. This report defines product policy only and does not authorize runtime alignment work.

### Canon Review

Result: pass.

The report locks the core canon: Private Repost is personal context; Authorial Post is expression; Source Reference is provenance on Authorial Post; legacy repost rows are deprecated artifacts outside target public/group doctrine.

## Status tokens

stage_13B_2_G_status: COMPLETE_AS_PRIVATE_REPOST_CONTEXT_AND_LEGACY_ROW_POLICY
stage_13B_2_G_execution_mode: READ_ONLY_DOCTRINE_DESIGN_POLICY_SPECIFICATION
stage_13B_2_G_private_repost_defined: TRUE
stage_13B_2_G_legacy_policy_defined: TRUE
stage_13B_2_G_group_feed_boundary_defined: TRUE
stage_13B_2_G_blog_boundary_defined: TRUE
stage_13B_2_G_authorial_boundary_defined: TRUE
stage_13B_2_G_source_reference_boundary_defined: TRUE
stage_13B_2_G_anti_drift_rules: TRUE
stage_13B_2_G_requires_implementation: FALSE
stage_13B_2_G_next_recommended_step: STAGE_13B_2_H_AUTHORIAL_PUBLISHING_BOUNDARY_AND_GROUP_FEED_QUALITY_MODEL
