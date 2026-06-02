# Stage 13B.2-D - Authorial Post Model Specification

## Execution mode

Doctrine design / architecture specification / read-only.

This slice defines product and architectural doctrine only. It does not design or change:

- code;
- database schema;
- migrations;
- OpenAPI;
- SDK/types;
- frontend implementation;
- API endpoints;
- runtime visibility rules;
- group feed implementation;
- repost elimination implementation;
- activity projection semantics;
- economy, points, rewards;
- comments, replies, quote-post, discussion trees, or moderation implementation.

Task type: product doctrine and conceptual architecture specification.

Risk level: HIGH, because the model redefines the public social meaning of Space content after Stage 13B.2-C identified a mismatch between current public repost runtime and the new repost doctrine.

No tests or runtime validation were required or run.

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

Stage 13B.2-C established that the current runtime and earlier Stage 13B.1-D doctrine were built around public Space repost propagation:

- object page creates a Space `repost`;
- repost can be public;
- group repost is possible at the contract/runtime level;
- feed and activity can treat repost as a public social item.

The new product doctrine changes that direction:

- repost is private user context;
- repost is not a public social entity;
- repost is not a group publishing format;
- a user's public reaction should become standalone authorial material;
- group feed should cultivate quality authorial posts;
- Blog Asia should receive candidates from authorial posts, not repost chains.

Product formula:

Source Object  
↓  
Private Repost  
↓  
Authorial Post  
↓  
Group Feed  
↓  
Blog Candidate  
↓  
Blog Asia

Main principle:

Go2Asia does not build chains of reactions. Go2Asia stimulates users to turn reaction into standalone authorial material.

This specification defines Authorial Post as the product concept that can replace public repost as the main mechanism for publishing user thoughts and opinions.

## Authorial Post definition

An Authorial Post is a Space-owned user publication whose primary value is the author's own text, observation, argument, experience, or interpretation.

It is not a repost with extra text. It is not a comment attached to an object. It is not a quote-post. It is not a reply node. It is not a forum thread entry.

Core definition:

- Authorial Post is a standalone user-authored material.
- The author's text is the primary content.
- A source reference may exist, but the source is context, not the content itself.
- The post should remain meaningful even if the source preview is unavailable.
- It can participate in group feed because it is authorial material, not propagation.
- It can become a Blog Asia candidate through curation.

Purpose inside Go2Asia:

1. Convert passive reaction into written user contribution.
2. Give groups high-quality user materials instead of repost traffic.
3. Create a bridge from raw Space UGC to curated Blog Asia content.
4. Preserve module boundaries: Space owns user posts, source modules own source truth, Blog owns editorial publication.
5. Avoid forum, reply, and repost-chain mechanics.

Authorial Post can exist without any reference. In that case it is simply a standalone user publication.

## Relationship with repost

Repost and Authorial Post are different product primitives.

Repost:

- private user context;
- source retention;
- personal note or reminder;
- one user keeping an object for themselves;
- not group content;
- not public social propagation;
- not Blog candidate material by itself.

Authorial Post:

- public, group, or otherwise intentionally published user expression;
- author's own text as the primary content;
- optional reference to source material;
- eligible for group feed;
- eligible for Blog candidate lifecycle.

Why repost is not enough:

- Repost centers the source object, not the user's thinking.
- Repost creates a propagation artifact, not a new material.
- Public repost tends to produce chains, repeated previews, and low-effort distribution.
- Repost does not raise the quality bar for group feeds.
- Repost with commentary is quote-like and can drift toward hidden quote-post taxonomy.

Why Authorial Post exists:

- It forces the user's thought to become the artifact.
- It makes group feed a publishing surface for ideas, experience, routes, comparisons, advice, reports, and reflections.
- It gives Blog Asia a meaningful candidate pool.
- It avoids treating public reaction as a mechanical repost.

Relationship between private repost and Authorial Post:

- A user may privately repost a source first, then later write an Authorial Post inspired by it.
- A private repost does not automatically create an Authorial Post.
- Editing private repost text remains private-context behavior, not group publishing.
- Dedupe policy for private repost should not block multiple independent Authorial Posts about the same source.

Conceptual user intent split:

User wants to remember source  
→ Private Repost

User wants to express a thought  
→ Authorial Post

User wants to answer another group post  
→ New Authorial Post with optional nearest reference

User wants to like/save  
→ Reactions fact, not Authorial Post and not repost

## Reference model

A reference is a local one-step pointer from an Authorial Post to the source material that inspired or contextualizes it.

Why references exist:

- They preserve source attribution.
- They help readers understand context.
- They let Go2Asia connect Space writing back to Atlas, Pulse, Blog, RF, Quest, or another Space post.
- They avoid copying or transferring source ownership into Space.
- They make group content richer without turning it into repost propagation.

What can be referenced in conceptual v1:

- Blog article: valid reference.
- Atlas place: valid reference.
- Pulse event: valid reference.
- RF voucher or RF partner/offer context: valid reference only as source context, not as reward, settlement, claim, or commercial authority.
- Quest: valid reference only as source/context; Quest progress, proof, and reward lifecycle remain separate.
- User post: valid reference only as nearest source in a flat authorial response model.

Potentially valid later, requiring separate eligibility clarification:

- Atlas country/city/guide.
- Rielt listing.
- Partner profile beyond RF source context.
- Guide-like content that has its own canonical content owner.

Reference is not:

- repost target binding;
- parent post;
- reply pointer;
- thread root;
- quote relationship;
- activity event;
- ownership transfer;
- embedded copy of the source material.

Conceptual reference language:

- "inspired by";
- "source";
- "related material";
- "in response to this post";
- "reference".

Terms to avoid for this model:

- comment;
- reply;
- quote;
- thread;
- repost chain.

## Reference rules

Mandatory or optional:

- Reference is optional.
- Authorial Post without reference is valid if the author text is independently meaningful.
- Reference should never be required just because the post is in a group.

One reference or many:

- Conceptual v1 should use one reference.
- Multiple references would turn the model toward article composition, bibliography, or thread aggregation.
- If multi-reference authoring becomes necessary, it should be specified later as a different editorial feature, not as the base Authorial Post model.

Nearest reference only:

- The model uses nearest reference only.
- If a user responds to another group post, the Authorial Post may reference that nearest post.
- The system should not expose or reconstruct the full ancestry behind that post.
- If the nearest post itself references another object, readers may inspect it separately, but the current Authorial Post does not become part of a visible chain.

How much context should travel:

- Minimum: source type/domain, source identity, source title or label if resolvable, and a compact preview.
- Optional: short source excerpt or image preview if already permitted by the source owner.
- Not included: full source body, full chain, comments, replies, engagement history, reward state, or moderation history.

Reference stability:

- Conceptually, source reference should be stable after publication.
- Text may be edited according to future authorial edit policy.
- Changing the source after publication risks rewriting context and should require a separate product decision.

Reference ownership:

- Space owns the Authorial Post.
- Source module owns source truth.
- Blog owns Blog article truth.
- Atlas owns place/city/country/guide truth.
- Pulse owns event truth.
- RF owns RF commercial truth.
- Quest owns Quest/progress truth.

## Authorial independence

An Authorial Post becomes sufficiently independent from its reference when:

1. The author's text is the primary value.
2. The text can be understood without opening the source.
3. The post expresses original observation, experience, argument, comparison, recommendation, warning, story, route, or synthesis.
4. The source preview is supportive context, not the body of the post.
5. The post does not depend on showing a chain of earlier posts.
6. The post is not just "look at this", "agree", "saved", or "sharing this".

Examples of authorial intent:

- "Why this Tokyo neighborhood works better for first-week relocation than it looks on paper."
- "What this event says about the local founder community in Bangkok."
- "My checklist after trying this RF partner offer."
- "A counterpoint to the advice in this Blog article."
- "A five-day route inspired by this Atlas place."

Non-authorial or weak cases:

- Empty text with source preview.
- "Interesting."
- "Agree."
- "Read this."
- Repost preview with a short reaction line.
- Group item whose primary visible content is the source card rather than the author text.

Can an Authorial Post exist without reference?

- Yes.
- Reference is a bridge, not a requirement.
- A user can publish an original group post that is not tied to a source object.

Can a reference make weak content authorial?

- No.
- Reference improves context but does not substitute for authorial substance.

## Group publishing model

Groups receive Authorial Posts because groups are topic-based authorial surfaces.

Groups do not receive reposts because:

- repost centers the source object rather than the author's contribution;
- repost encourages low-effort distribution;
- repost can create public chains;
- repost weakens group quality;
- repost does not produce good Blog candidates by itself.

Role of groups:

- thematic context;
- authorial incubation;
- quality filtering by audience, moderators, or editors;
- pre-Blog discovery surface;
- place where users develop ideas into stronger materials.

Group feed doctrine:

- group feed is not a forum;
- group feed is not a comment section;
- group feed is not a repost distribution channel;
- group feed is not a nested debate tree;
- group feed is a flat stream of standalone authorial contributions.

Response model inside groups:

- A user does not reply with a comment.
- A user writes a new Authorial Post.
- That post may reference the nearest prior post.
- The system does not render nested ancestry.
- Each contribution must stand on its own.

Group publishing quality principle:

The group feed should reward effort, clarity, context, and usefulness, not the speed or volume of reactions.

## Blog candidate model

Authorial Posts can become Blog Asia candidates through a conceptual editorial lifecycle.

This is not an implementation workflow. It is a product lifecycle:

Authorial Post in Group  
↓  
Visible Group Contribution  
↓  
Quality Signal or Editorial Attention  
↓  
Curated Candidate  
↓  
Editorial Review  
↓  
Blog Draft or Decline  
↓  
Blog Asia Publication if accepted

How Authorial Posts become candidates:

- the post is substantive;
- it fits the group's topic;
- it contains useful first-hand experience or synthesis;
- it can be edited into durable content;
- it may reference source material but is not dependent on it;
- it attracts meaningful attention or moderator/editor interest.

What does not become a Blog candidate by itself:

- private repost;
- public repost;
- bookmark;
- like;
- low-effort reaction;
- activity projection;
- reward event;
- comment/reply chain;
- Quest proof;
- RF transaction state.

Blog candidate principles:

- Candidate status is not automatic.
- Candidate status is not an economy reward.
- Candidate status is editorial/curatorial.
- A Blog article is a new curated media artifact, not a raw Space post copied verbatim.
- Blog may credit the original author or reference the original Space post according to future editorial policy.

## Anti-forum doctrine

Go2Asia is not:

- a comment system;
- a reply system;
- a quote-post tree;
- a forum discussion engine;
- a repost chain graph;
- a viral propagation graph;
- a messenger;
- a nested debate UI;
- a place where source previews replace authored material.

Forbidden canonical patterns:

- comment under a group post;
- reply under a group post;
- reply count as group discourse metric;
- quote-post type;
- repost of repost as public discourse;
- activity feed used to reconstruct a conversation tree;
- public "someone reposted your post" chain as social pressure;
- group feed item whose primary payload is another object's preview.

Positive replacement:

- write a new Authorial Post;
- optionally reference the nearest source;
- keep the post standalone;
- let group feed cultivate strong materials;
- let Blog Asia curate the best of them.

Language discipline:

- In public/group context, prefer "authorial post", "source reference", "inspired by", "related material".
- Reserve "private repost note" for repost text in private user context.
- Avoid "commentary to repost" as a group/public publishing concept.
- Avoid "reply" unless a future product doctrine explicitly defines a non-threaded meaning.

## Canonical lifecycle

### Main lifecycle

Source Material  
↓  
Private Repost, if the user wants personal context  
↓  
Authorial Reflection, if the user wants to publish a thought  
↓  
Group Publication, if the thought belongs in a thematic group  
↓  
Curated Candidate, if the material becomes strong enough  
↓  
Blog Publication, if accepted by Blog Asia editorial flow

### User intent lifecycle

Encounter Source  
↓  
Choose Intent  
↓  
Like / Bookmark: Reactions fact  
Private Repost: personal context  
Authorial Post: standalone publication  
↓  
If Authorial Post has group intent  
↓  
Publish to Group Feed  
↓  
Potential Blog Candidate

### Group response lifecycle

Read Group Authorial Post A  
↓  
Write Authorial Post B  
↓  
Optionally reference Post A as nearest source  
↓  
Publish B as standalone group item  
↓  
No nested reply  
↓  
No thread tree  
↓  
No repost chain

### Blog candidate lifecycle

Authorial Post Published  
↓  
Group Audience Reads  
↓  
Quality Signal / Moderator or Editor Attention  
↓  
Candidate Flag  
↓  
Editorial Review  
↓  
Accepted: Blog Draft  
or  
Declined: Remains Space Material  
↓  
Blog Publication only after curated transformation

## Open questions

1. What is the exact product surface for the user's personal private repost context?
2. Should Authorial Posts be allowed as public non-group posts in v1, or should v1 focus on group publishing?
3. What is the minimum quality threshold for "authorial" without designing moderation implementation?
4. Should source reference be immutable after publication in all cases?
5. Should a user post be referenceable only if it is visible in the same group, or can cross-group references exist?
6. Should RF voucher references point to voucher, partner, offer, or article-like RF source context?
7. Should Quest references point to Quest definition only, or can they reference Quest completion narratives later?
8. How should existing public/group repost rows be treated in future elimination planning?
9. What language should replace "Share-to-Space" once the product has both private repost and authorial post paths?
10. Should Blog candidate status be visible to author, moderators only, or editors only?
11. How does PRO/editor nomination work conceptually without becoming a reward or economy mechanism?
12. Should source reference preview carry only title/domain, or also image/excerpt?
13. How should legacy/mock comment/reply UI be quarantined or renamed in future canon cleanup?
14. How should old 13B.1-D "repost as propagation" language be superseded without losing ownership boundaries?

## Review gates

### Requirements Review

Result: pass with open questions.

The specification defines Authorial Post, its purpose, relationship to private repost, reference model, group publishing model, Blog candidate lifecycle, and anti-forum doctrine. Future slices must resolve private repost surface and existing public repost row treatment before implementation.

### Architecture Review

Result: pass at conceptual architecture level.

The model preserves service boundaries:

- Space owns user posts and private repost context.
- Source modules own source truth.
- Blog owns curated publication.
- Reactions owns like/bookmark facts.
- Economy is not activated.

No API, DB, endpoint, or frontend design is proposed.

### Runtime Governance Review

Result: pass with mismatch acknowledged.

Current runtime is not aligned because public/group repost exists. This specification defines the target doctrine, not the runtime realignment plan. Runtime alignment must be handled in a later slice.

### Canon Review

Result: pass.

The document establishes Authorial Post as the canonical replacement for public repost as expression. It also records that old public propagation language from Stage 13B.1-D is superseded at product semantics level while preserving ownership boundaries.

## Status tokens

stage_13B_2_D_status: COMPLETE_AS_AUTHORIAL_POST_MODEL_SPECIFICATION
stage_13B_2_D_execution_mode: READ_ONLY_DOCTRINE_DESIGN_ARCHITECTURE_SPECIFICATION
stage_13B_2_D_authorial_post_defined: TRUE
stage_13B_2_D_reference_model_defined: TRUE
stage_13B_2_D_group_publishing_defined: TRUE
stage_13B_2_D_blog_candidate_defined: TRUE
stage_13B_2_D_anti_forum_doctrine: TRUE
stage_13B_2_D_requires_implementation: FALSE
stage_13B_2_D_next_recommended_step: STAGE_13B_2_E_PUBLIC_REPOST_ELIMINATION_PLAN
