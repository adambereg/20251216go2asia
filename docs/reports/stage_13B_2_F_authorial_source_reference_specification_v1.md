# Stage 13B.2-F - Authorial Source Reference Specification

## Execution mode

Doctrine design / conceptual architecture / read-only.

This slice defines Source Reference as a product and conceptual architecture primitive. It does not design or change:

- code;
- OpenAPI;
- SDK/types;
- DB schema;
- migrations;
- frontend implementation;
- backend implementation;
- API endpoints;
- runtime alignment;
- private repost implementation;
- group feed implementation;
- moderation implementation;
- economy, points, rewards.

No tests or runtime validation were required or run.

Task type: doctrine specification for a single conceptual primitive.

Risk level: HIGH, because Source Reference is the boundary object that prevents future confusion between reference, repost, quote, reply, attribution, source, and discussion chain.

Note on sequencing:

- Stage 13B.2-E recommended `STAGE_13B_2_F_PRIVATE_REPOST_CONTEXT_AND_LEGACY_ROW_POLICY`.
- This task intentionally assigns 13B.2-F to Authorial Source Reference Specification.
- The private repost / legacy row policy remains an open downstream slice.

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

Stage 13B.2-C introduced the new repost doctrine:

- repost is private user context;
- public repost is not the target model;
- group feed should contain standalone authorial posts;
- Go2Asia does not build reaction chains.

Stage 13B.2-D defined Authorial Post:

- author text is primary;
- source may be context;
- group feed cultivates authorial material;
- Blog Asia may receive curated candidates.

Stage 13B.2-E defined the transition away from public repost:

- public/group repost is deprecated as expression;
- Share-to-Space must split retention from expression;
- public repost rows become legacy policy concerns;
- source/reference remains the missing conceptual bridge.

The central unresolved primitive is Source Reference.

Without Source Reference doctrine, future slices will keep confusing:

- reference;
- repost;
- quote;
- attribution;
- source;
- response;
- comment;
- discussion chain.

Core product formula:

The user does not answer a publication. The user publishes their own material. Other materials are context, inspiration, or source for that publication.

## Source Reference definition

Source Reference is an optional one-hop contextual pointer from an Authorial Post to a material that inspired, grounded, challenged, or contextualized the author's own publication.

It is a relation of provenance and context, not a relation of conversation.

It says:

- this authorial material has a source context;
- the user's thought originated near this source;
- the source helps readers understand where the idea came from;
- the source does not become the body of the post;
- the source does not become a parent in a discussion tree.

Canonical definition:

Source Reference is a bounded, optional, one-hop source-context link attached to an Authorial Post. It points to one eligible source material and helps explain the origin or context of the author's own material.

Role inside Go2Asia:

- connects Space authorial writing to Blog, Atlas, Pulse, RF, Quest, or Space context;
- preserves module ownership;
- supports group feed without forum mechanics;
- supports Blog candidate review without turning Space into Blog;
- replaces public repost as the correct public context mechanism for authored thoughts.

Source Reference exists only in relation to Authorial Post. Private repost uses a separate private context binding and should not be treated as Source Reference.

## Purpose

Source Reference exists because Authorial Post needs context without losing authorial independence.

Why Authorial Post needs Source Reference:

- users often write because they saw a place, event, article, offer, quest, or another post;
- readers need a lightweight way to understand that origin;
- groups need topic continuity without threads;
- Blog editors may need provenance when reviewing strong Space materials;
- source modules need to remain owners of their own truth.

Why repost is not enough:

- repost centers the source object;
- repost carries retention/propagation semantics;
- public repost can become a chain;
- repost with text becomes quote-like;
- repost does not require authorial independence;
- repost is now private context, not public expression.

Why attribution alone is not enough:

- attribution credits or names a source, but does not define the product relationship;
- attribution can be editorial, legal, social, or UI-only;
- Source Reference is narrower: it is the bounded source-context relation inside an Authorial Post;
- attribution may be a downstream display consequence, but Source Reference is the conceptual origin relation.

What Source Reference must preserve:

- authorial primacy;
- one-hop context;
- source module ownership;
- no discussion tree;
- no repost propagation;
- no reward/economy semantics.

## Comparison matrix

| Concept | What it means | Source Reference is different because |
| --- | --- | --- |
| Repost | Private user context / retention of source material | Source Reference belongs to Authorial Post and supports authored expression, not retention. |
| Reply | A response node attached to a parent item | Source Reference has no parent/child semantics and does not create reply counts or nested UI. |
| Comment | Low-friction annotation under another object | Source Reference does not attach text under a source; the text is a standalone Authorial Post. |
| Quote | Re-publication or embedded citation with commentary | Source Reference does not make the source the main payload and does not create quote-post taxonomy. |
| Attribution | Credit or acknowledgement of source/author | Source Reference is a product relation of source context; attribution may use it but does not define it. |
| Source | The original object or material | Source Reference is the pointer from Authorial Post to that source, not the source itself. |
| Discussion Chain | A sequence of replies/reposts/comments | Source Reference is one-hop only and never reconstructs ancestry. |
| Activity Event | Projection of something that happened | Source Reference is not an event and should not be used to build social pressure. |
| Bookmark / Like | Reactions facts | Source Reference is part of authorial publishing context, not a reaction fact. |

Short rule:

Reference points to context. Repost saves context. Reply/comment starts conversation. Quote embeds another voice. Attribution credits. Source Reference does none of those fully; it only declares where the author's own material is grounded.

## Source domains

Conceptual eligibility is not implementation eligibility. This section defines product-level source domains only.

### Conceptually valid in v1 doctrine

Blog article:

- valid source domain;
- used for counterpoints, expansions, reflections, or personal experience inspired by an article;
- Blog remains source truth owner.

Atlas place:

- valid source domain;
- used for place experience, relocation observations, route notes, neighborhood opinions;
- Atlas remains source truth owner.

Pulse event:

- valid source domain;
- used for event reflections, community observations, founder/community notes;
- Pulse remains source truth owner.

RF offer / RF partner:

- conceptually valid as source context with strict boundary;
- used for user experience, checklist, caution, practical note;
- does not carry voucher claim, settlement, payout, reward, or commercial authority;
- RF remains business/commercial truth owner.

Quest:

- conceptually valid as source context with strict boundary;
- used for learning journey, route, challenge reflection, travel narrative;
- does not carry Quest proof, completion, reward, or progression authority;
- Quest remains lifecycle truth owner.

Space post:

- valid only as nearest source for a flat authorial relation;
- used when a user publishes their own material inspired by a prior post;
- not a parent, reply root, thread root, or repost target in public discourse.

### Requires future eligibility review

Atlas city:

- conceptually plausible;
- needs future eligibility review because city-level references may become broad topic containers rather than concrete source material.

Atlas country:

- conceptually plausible;
- needs future eligibility review because country references may be too broad and may overlap with guide/editorial domains.

Atlas guide:

- conceptually plausible;
- needs source ownership and preview policy clarification.

Rielt listing:

- requires future eligibility review because housing/commercial inquiry boundaries are sensitive.

Partner profile beyond RF offer context:

- requires future eligibility review because partner identity, promotion, and commercial authority can blur.

External URL:

- outside v1 doctrine;
- needs separate trust, spam, ownership, and preview policy.

### Conceptually invalid as Source Reference

- Reaction fact.
- Bookmark.
- Activity event.
- Reward or points event.
- Private repost row.
- Legacy public repost row as a public source primitive.
- Comment/reply/quote object.
- Lifecycle action such as register, redeem, proof submit, inquiry, or booking.

## Meaning model

Source Reference can communicate several product meanings. These are conceptual meanings, not implementation enums.

Valid meanings:

Inspiration:

- "This material inspired my post."
- Common for Atlas places, Blog articles, Pulse events.

Context:

- "This source gives background for my post."
- Common for group posts and practical reports.

Origin of idea:

- "My thought started from this material."
- Useful for Blog candidate traceability.

Source material:

- "This is the source material I am writing around."
- Useful when post comments on article/event/place substance.

Counterpoint:

- "My material disagrees with or qualifies this source."
- Valid only when the post remains standalone.

Continuation of topic:

- "I continue the topic started near this source."
- Valid only as topic continuity, not discussion chain.

Nearest relation:

- "This is the nearest post/object my material is related to."
- Especially for Space post references in groups.

Meanings that do not belong:

- parent;
- child;
- reply;
- quote;
- repost;
- proof;
- reward trigger;
- commercial claim;
- lifecycle transition.

## One-hop doctrine

Source Reference is one-hop only.

Rules:

1. An Authorial Post may have zero or one Source Reference in the base model.
2. A Source Reference points to the nearest relevant source.
3. The system does not reconstruct references behind the referenced source.
4. The group feed does not render ancestry.
5. Activity does not reconstruct discussion from references.
6. Blog candidate review may inspect context, but the public product model remains one-hop.

Why one-hop:

- prevents forum/thread behavior;
- prevents repost chains returning under a new name;
- keeps Authorial Post standalone;
- avoids complexity where every post becomes a graph node;
- protects readers from needing ancestry to understand a post;
- supports clean Blog candidate review.

Forbidden ancestry patterns:

- A references B, B references C, so A displays C.
- A references B, therefore B gets reply count.
- A references B, therefore activity says "A answered B".
- A references B, therefore group feed nests A under B.
- A references a repost row, therefore the original repost target is pulled into A.

Canonical group example:

User reads Post A.  
User writes Post B.  
Post B may reference Post A.  
Post B appears as a standalone Authorial Post.  
Post A is not a parent.  
No tree is rendered.

## Authorial independence

Source Reference must coexist with Authorial independence.

The Authorial Post is still authorial when:

- author text is primary;
- source preview is secondary;
- post makes sense without opening the source;
- post expresses experience, argument, observation, synthesis, comparison, route, warning, or recommendation;
- reference helps readers but does not carry the post.

The post becomes too dependent on its source when:

- text is empty or trivial;
- source card is the main payload;
- post says only "read this", "agree", "interesting";
- author has not added independent meaning;
- reader must open the source to understand the post;
- the post is effectively a quote/repost with a tiny reaction.

Source Reference cannot make weak text authorial.

Authorial independence test:

If the reference preview disappears, does the post still communicate a useful thought? If yes, it may be authorial. If no, it is too dependent on the source.

## Group semantics

Inside groups, Source Reference supports continuity without discussion mechanics.

Group rules:

- group feed receives Authorial Posts, not reposts;
- Source Reference enriches an Authorial Post;
- Source Reference does not create reply relationship;
- Source Reference does not create comment thread;
- Source Reference does not create forum discussion;
- Source Reference does not create activity pressure on referenced author by itself;
- multiple posts may reference the same source as parallel authorial materials.

Group feed model:

Standalone Authorial Post  
->  
Optional Source Reference  
->  
Flat group feed item  
->  
Possible Blog candidate

Not group feed model:

Source post  
->  
Reply  
->  
Nested discussion  
->  
Thread tree

Language for group context:

- "related material";
- "source";
- "inspired by";
- "context";
- "near this post";

Avoid:

- "reply";
- "comment";
- "answer";
- "quote";
- "thread";
- "discussion chain".

## Blog relationship

Source Reference supports the Space -> Blog pipeline without creating repost chains.

It helps Blog Asia because:

- editors can see what source context inspired the author;
- the Authorial Post remains the candidate, not the source reference;
- source ownership remains clear;
- reference can show whether a post is counterpoint, experience, guide-like reflection, or continuation of topic;
- curated Blog transformation can preserve credit/context without copying raw Space UGC.

Source Reference does not:

- make the post a Blog candidate automatically;
- turn source material into a Blog candidate;
- copy source into Blog;
- create editorial attribution policy by itself;
- create reward/economy semantics;
- make a private repost eligible for Blog.

Blog candidate relation:

Source Material  
->  
Authorial Post with optional Source Reference  
->  
Group Feed  
->  
Editorial Attention  
->  
Blog Candidate  
->  
Curated Blog Publication

The source reference is evidence of provenance, not the content being promoted.

## Anti-drift rules

1. Reference is not repost.
   - Do not reuse public repost language for Source Reference.
   - Do not treat `repostTarget` semantics as equivalent to Source Reference.

2. Reference is not reply.
   - Do not create parent/child mental model.
   - Do not add reply counts or nested rendering as a consequence of reference.

3. Reference is not comment.
   - Do not attach user text under source object.
   - The text belongs to a standalone Authorial Post.

4. Reference is not quote.
   - Do not let source preview dominate the card.
   - Do not make "quote with take" the visible product pattern.

5. Reference is not attribution alone.
   - Attribution may be a display or editorial consequence.
   - Source Reference is the product relation of context/provenance.

6. Reference is not discussion chain.
   - One-hop only.
   - No ancestry reconstruction.
   - No tree rendering.

7. Reference does not transfer ownership.
   - Source module owns source truth.
   - Space owns Authorial Post.

8. Reference does not activate economy.
   - No points, rewards, settlement, voucher claim, Quest proof, or progress semantics.

9. Reference does not rescue weak content.
   - Weak author text remains weak even with a strong source.

10. Reference in group does not create forum.
    - It supports a flat stream of authorial materials.

11. Reference to Space post is nearest only.
    - It must not create `post -> post -> post` discourse graph.

12. Legacy public repost rows are not Source References.
    - They remain legacy transition objects until a future policy decides their fate.

## Open questions

1. Should Source Reference be immutable after Authorial Post publication?
2. Can an Authorial Post reference a Space post outside the same group?
3. Can an Authorial Post reference a private or restricted Space post?
4. Should RF reference target offer, voucher, partner, or a separate RF content object?
5. Should Quest reference target Quest definition only, or can it reference completion narratives later?
6. Should Atlas city/country/guide be promoted into v1 eligibility or stay deferred?
7. Should a source reference carry a user-facing meaning label, such as "inspired by" or "counterpoint"?
8. Should preview include image/excerpt or title/domain only?
9. What should happen if a referenced source is removed, unpublished, or inaccessible?
10. Can an Authorial Post have more than one reference in a later editorial mode?
11. How should legacy public repost rows be displayed if they are not Source References?
12. Should Blog candidate review see Source Reference metadata differently from normal readers?
13. What exact Russian copy should replace "ответить" when user creates a new post near another post?
14. How should Source Reference be positioned relative to future private repost context?

## Review gates

### Requirements Review

Result: pass with open questions.

Source Reference is clearly defined, its purpose is documented, adjacent concepts are separated, and one-hop doctrine is explicit. Future slices must resolve immutability, cross-group visibility, domain granularity, and preview depth.

### Architecture Review

Result: pass at conceptual architecture level.

The specification preserves ownership boundaries:

- Space owns Authorial Post.
- Source modules own source truth.
- Blog owns curated publication.
- Reactions own like/bookmark facts.
- Economy remains out of scope.

No API, schema, storage, endpoint, migration, or frontend design is proposed.

### Runtime Governance Review

Result: pass with `RUNTIME_PRE_TRANSITION`.

Current runtime does not yet have canonical Source Reference and still uses repost target semantics for public repost. This specification defines the target concept only and does not authorize runtime implementation.

### Canon Review

Result: pass.

The document locks the core distinction: the user publishes their own material; other materials are context, inspiration, or source. Source Reference is one-hop and cannot become repost, reply, comment, quote, attribution-only, or discussion chain.

## Status tokens

stage_13B_2_F_status: COMPLETE_AS_AUTHORIAL_SOURCE_REFERENCE_SPECIFICATION
stage_13B_2_F_execution_mode: READ_ONLY_DOCTRINE_DESIGN_CONCEPTUAL_ARCHITECTURE
stage_13B_2_F_source_reference_defined: TRUE
stage_13B_2_F_one_hop_doctrine: TRUE
stage_13B_2_F_group_semantics_defined: TRUE
stage_13B_2_F_blog_relationship_defined: TRUE
stage_13B_2_F_repost_boundary_defined: TRUE
stage_13B_2_F_anti_drift_rules: TRUE
stage_13B_2_F_requires_implementation: FALSE
stage_13B_2_F_next_recommended_step: STAGE_13B_2_G_PRIVATE_REPOST_CONTEXT_AND_LEGACY_ROW_POLICY
