# Stage 13B.2-H - Authorial Publishing Boundary & Group Feed Quality Model

## Execution mode

Doctrine design / quality model specification / read-only.

This slice defines the conceptual boundary for authorial publishing and the product quality model for Group Feed. It does not design or change:

- code;
- moderation implementation;
- anti-spam implementation;
- scoring algorithms;
- ranking algorithms;
- recommendation algorithms;
- economy implementation;
- points implementation;
- rewards implementation;
- OpenAPI;
- SDK/types;
- DB schema;
- migrations;
- frontend/backend implementation.

No tests, runtime validation, moderation design, scoring design, ranking design, recommendation design, rewards design, or implementation work was required or performed.

Task type: product doctrine and content quality model specification.

Risk level: HIGH, because this slice defines what Group Feed should contain after public repost has been deprecated and before runtime alignment can be safely planned.

## Agents

Multi-agent mode was activated using the `docs/ai` role model.

- Lead: AI Program Director / Orchestrator.
- Requirements Analyst.
- Product Analyst.
- Software Architect.
- Runtime Governance Architect.
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
- group feed should contain standalone authorial posts;
- Go2Asia does not need to store or show full reply/repost chains;
- group feed exists to grow high-quality authorial materials that may become Blog Asia candidates.

Stage 13B.2-D defined Authorial Post:

- author text is primary;
- the source is context, not content itself;
- Authorial Post can participate in group feed;
- Authorial Post can become a Blog Asia candidate through curation.

Stage 13B.2-E defined the transition away from public repost:

- public/group repost is deprecated as expression;
- group feed contains Authorial Posts;
- repost rows are not group content in the target doctrine.

Stage 13B.2-F defined Source Reference:

- Source Reference is one-hop context on Authorial Post;
- Source Reference cannot rescue weak content;
- if reference preview disappears, the post should still communicate useful thought.

Stage 13B.2-G defined Private Repost Context:

- Private Repost is owner-only retention;
- Private Repost is not Authorial Post;
- legacy public/group repost rows are not group quality inputs.

The remaining doctrine gap is the authorial publishing boundary:

- when is a publication sufficiently authorial?
- what is weak content?
- what does Group Feed exist to cultivate?
- how does quality relate to Blog candidate potential?
- how can future points/rewards avoid encouraging farming without designing rewards now?

Fundamental doctrine:

The user does not answer a publication. The user publishes their own material. Other materials are context, inspiration, or source.

Group Feed exists not for discussions, but for growing authorial content.

## Authorial publishing definition

Authorial publishing is the act of publishing a standalone user-authored material whose primary value is the user's own thought, observation, experience, synthesis, comparison, argument, route, warning, or recommendation.

An Authorial Post is sufficiently authorial when:

- the author's text is the primary content;
- the post communicates independent meaning;
- the post can be understood without opening the source;
- any Source Reference is secondary context;
- the post does not rely on reply/comment/quote/repost-chain semantics;
- the post fits the topic or purpose of the group where it appears;
- the post contributes something useful, specific, interpretive, experiential, or synthetic.

Minimum authorial criteria:

1. Author text has standalone value.
2. The post is not just a reaction.
3. The post is not just source distribution.
4. The post is not a private retention note.
5. The post is not a legacy repost artifact.
6. The post does not require a discussion chain to make sense.
7. The post can plausibly help another user understand, decide, compare, plan, or reflect.

Positive examples:

- a short relocation observation about a specific neighborhood;
- a practical checklist after trying an RF partner offer;
- a counterpoint to a Blog article based on personal experience;
- a comparison of two routes, cities, events, or choices;
- a warning grounded in observed detail;
- a synthesis that turns several impressions into a useful takeaway.

## Authorial boundary

The authorial boundary separates public/group expression from retention, reaction, and propagation.

Target Group Feed content:

Authorial Post  
->  
optional one-hop Source Reference  
->  
standalone group contribution  
->  
possible Blog candidate through editorial curation

Not target Group Feed content:

- Private Repost.
- Legacy public/group repost row.
- Source preview plus trivial line.
- Like/bookmark sentiment written as a post.
- Comment/reply/quote tree node.
- Activity event.
- Quest proof or RF transaction state.
- Public repost with commentary.

Boundary summary:

| Dimension | Authorial Post | Non-authorial content |
| --- | --- | --- |
| Center | User's thought | Source object, reaction, or chain |
| Text | Primary value | Trivial, absent, or dependent |
| Source | Secondary context | Main payload |
| Group role | Standalone contribution | Noise, retention, propagation, or discussion |
| Blog relation | Possible candidate | Excluded |
| Chain dependency | None | Depends on parent/thread/repost chain |

## Non-authorial content

Non-authorial content is any content that does not create a standalone authored contribution.

Clear non-authorial examples:

- "Interesting."
- "Agree."
- "Nice place."
- "Read this."
- "Look at this."
- "+1."
- source preview with one sentence of generic praise;
- repost preview with short reaction;
- copied source excerpt without author interpretation;
- a private note moved into public/group context;
- legacy public/group repost row;
- activity event displayed as content;
- Quest proof or RF claim presented as a group post.

Why these fail:

- they are reaction-like;
- they are source-dominated;
- they are distribution-oriented;
- they do not add independent meaning;
- they do not help the group grow durable authorial material;
- they can easily become farming behavior if rewarded.

Borderline examples:

| Pattern | Boundary issue |
| --- | --- |
| "Good article, recommended" | Reaction, not interpretation |
| One-sentence source summary | Dependent on source |
| "I agree with Post A" | Reply-like, not standalone |
| Generic city praise | Too vague to be useful |
| Long paraphrase of Blog article | Length without authorial substance |
| Repeated templated posts | Farming risk |

## Authorial independence test

The Authorial Independence Test expands the test introduced in Stage 13B.2-F.

Primary question:

If the Source Reference disappears, does the post still matter?

Pass:

- the post still communicates a useful thought;
- the reader can understand the main point without opening the source;
- the author added interpretation, experience, comparison, or practical value.

Fail:

- the post becomes empty without preview;
- the reader needs the source to understand the point;
- the post is only "look at this", "agree", "interesting", or a paraphrase.

Secondary checks:

1. Text primacy: author text is the main visible value.
2. Independent meaning: the post makes a claim, observation, comparison, synthesis, warning, route, or recommendation.
3. Context fit: the post belongs in the group topic.
4. Source discipline: reference is optional, one-hop, and secondary.
5. No chain dependency: the post does not need ancestry, parent post, thread, or quote tree.
6. No wrong primitive: the post is not a disguised like, bookmark, private repost, RF claim, Quest proof, or activity event.

Reference cannot rescue weak content.

Source Reference improves context, but it does not turn weak text into authorial material. A strong source plus weak author text is still weak.

Authorial Post without reference remains valid if it independently contributes meaning.

## Quality dimensions

The following dimensions define conceptual quality for Go2Asia Group Feed. They are not scores, rankings, algorithms, automated moderation rules, or reward formulas.

| Dimension | Meaning | Strong signal | Weak signal |
| --- | --- | --- | --- |
| Substance | The post has real content | Argument, observation, synthesis, experience | Empty reaction, generic praise |
| Independence | The post stands without source | Useful if preview disappears | Source card carries meaning |
| Usefulness | Reader can learn or decide | Checklist, route, warning, comparison | Vague sentiment |
| Specificity | Concrete details are present | Place, time, tradeoff, condition | Abstract filler |
| Experience | Lived or observed context | "After trying...", "I noticed..." | Unanchored opinion |
| Synthesis | Turns inputs into insight | Connects events, places, offers, posts | Simple paraphrase |
| Comparison | Helps choose between options | Pros/cons, alternatives, constraints | One-sided praise |
| Practical value | Supports action | Advice, steps, caveats | No next-use value |
| Topical fit | Belongs in the group | Relevant to group theme | Off-topic or generic |
| Durability potential | Can mature into Blog-like content | Durable insight | Ephemeral chat reaction |
| Provenance clarity | Source is used properly | One-hop secondary reference | Preview-as-body |

Quality model principles:

- Quality is conceptual, not algorithmic.
- Quality is not measured by word count.
- Quality is not measured by posting frequency.
- Quality is not measured by number of sources.
- Quality is not created by Source Reference alone.
- Quality is not created by likes, points, or activity volume.
- Quality is compatible with short, dense posts.

## Group Feed purpose

Group Feed exists to cultivate authorial content around a thematic context.

It is:

- a flat stream of standalone authorial contributions;
- a thematic incubation space;
- a pre-Blog discovery surface;
- a place where users turn source reactions into useful material;
- a bridge from raw Space UGC to curated Blog Asia candidates.

It is not:

- a forum;
- a comment section;
- a reply tree;
- a quote-post stream;
- a repost distribution channel;
- a private saved list;
- an activity log;
- a rewards farming surface.

Group Feed should value effort, clarity, context, usefulness, and authorial independence as product values. This report does not define how any future system enforces, ranks, or rewards those values.

## Weak content model

Weak content is content that may look like a post, but does not satisfy the authorial boundary.

Weak content categories:

| Category | Pattern | Why weak |
| --- | --- | --- |
| Trivial reaction | "Interesting", "Agree", "+1" | Reaction, not material |
| Distribution-only | "Read this", "Look at this" | Propagation, not expression |
| Source-dominated | Preview carries the meaning | Fails authorial primacy |
| Dependent summary | Retells source without insight | Fails independence |
| Chain-dependent | Needs parent/thread context | Violates anti-forum doctrine |
| Template noise | Repeated generic form | Farming risk |
| Vague praise | "Nice place", "Good event" | No useful specificity |
| Wrong primitive | Like/bookmark/private save as post | Belongs elsewhere |
| Legacy repost-shaped | Repost card plus short line | Deprecated public repost form |
| Lifecycle bleed | RF claim, Quest proof, reward event | Wrong domain authority |

Weak content doctrine:

- Weak content is not a Blog candidate.
- Weak content should not define Group Feed norms.
- Weak content should not be treated as publication quality.
- Weak content should be redirected conceptually to the correct primitive: reaction, bookmark, private repost, or Authorial Post rewrite.

This is not a moderation design and does not define enforcement.

## Blog candidate relationship

Blog Asia receives candidates from quality authorial material in Group Feed.

A Group Feed post can become a Blog candidate when it:

- passes the Authorial Independence Test;
- has substance;
- fits the group topic;
- contains useful experience, synthesis, comparison, or practical insight;
- has durability potential;
- can be curated into a stronger editorial artifact;
- is not dependent on a source preview as its body.

Blog candidate does not mean:

- automatic promotion;
- reward trigger;
- points event;
- popularity contest;
- repost upgrade;
- source promotion;
- direct copy of Space post into Blog.

Explicit exclusions:

- Private Repost;
- legacy public/group repost rows;
- weak content;
- Source Reference alone;
- like/bookmark facts;
- activity events;
- comments/replies/quote trees;
- Quest proof or RF transaction states.

Conceptual pipeline:

Authorial Post in Group  
->  
Quality group contribution  
->  
Editorial attention or candidate nomination  
->  
Curated Blog draft or decline  
->  
Blog Asia publication if accepted

## Quality vs length

Length is not a proxy for authorial quality.

Short posts can be authorial when:

- they contain a concrete observation;
- they express a useful tradeoff;
- they give a practical warning;
- they summarize an experience clearly;
- they help the group decide or understand something.

Long posts can be weak when:

- they paraphrase a source without original insight;
- they add volume but not meaning;
- they rely on a preview as the actual body;
- they repeat generic advice;
- they are written to farm visibility or future rewards.

Examples:

| Example | Length | Verdict |
| --- | --- | --- |
| "After a week near this station: metro is easy, but construction noise runs late. Good for remote work, bad for families." | Short | Authorial |
| "Interesting place, I liked it." | Short | Weak |
| A long paraphrase of a Blog article with no personal view | Long | Weak |
| A compact checklist from firsthand RF partner experience | Short/medium | Authorial |

Quality comes from meaning density, usefulness, independence, and context, not word count.

## Anti-farming doctrine

Anti-farming doctrine is conceptual only. It does not define rewards, anti-abuse systems, scoring, detection, ranking, or moderation.

Future Points may reward publication, so the doctrine must state what should never become dominant behavior.

Publication should not optimize for:

- maximum number of posts;
- source previews with minimal text;
- repeated templated micro-posts;
- repost-like public propagation;
- reaction phrases disguised as posts;
- cross-posting the same shallow material into multiple groups;
- using Source Reference to inflate perceived quality;
- converting every private saved item into a weak public post;
- farming Blog candidate visibility through volume;
- farming future rewards through low-effort publication.

Anti-farming principles:

1. One authorial act should produce one meaningful standalone material.
2. Multiple posts about the same source are acceptable only if each has independent meaning.
3. Private Repost remains the correct primitive for saving without expression.
4. Like/bookmark remain the correct primitives for lightweight reactions.
5. Group Feed quality should be defined by substance and usefulness, not volume.
6. Blog candidacy should remain editorial/curatorial, not a points milestone.
7. Activity volume should not become evidence of quality.

This doctrine is a future governance boundary, not an implementation plan.

## Anti-forum doctrine

The quality model reinforces Go2Asia's anti-forum doctrine.

Forbidden canonical patterns:

- comments under group posts;
- replies under group posts;
- reply counts as discourse metrics;
- quote-post type;
- repost-of-repost public discourse;
- activity feed used to reconstruct conversation trees;
- incoming "someone reposted you" social pressure for new private reposts;
- group item whose primary payload is another object's preview;
- nested rendering under referenced posts;
- thread root / parent-child semantics;
- Source Reference ancestry reconstruction.

Positive replacement:

- user writes a new Authorial Post;
- post may include one-hop Source Reference;
- post stands independently in a flat Group Feed;
- group cultivates stronger material;
- Blog Asia curates the strongest material.

How quality supports anti-forum:

- independence test prevents parent/thread dependency;
- weak content model rejects reply-like and reaction-like posts;
- Source Reference remains secondary and one-hop;
- Blog candidate relationship values durable material, not debate chains;
- anti-farming doctrine discourages volume-driven micro-responses.

## Open questions

1. Should v1 Authorial publishing be group-first, or should public non-group Authorial Posts exist in v1?
2. What minimum substance threshold should future product surfaces communicate without creating moderation rules?
3. Should quality dimensions be visible to users, moderators, editors, or only internal canon?
4. How should Blog candidate nomination work conceptually without becoming reward/economy behavior?
5. Should Source Reference include a user-facing meaning label such as "inspired by" or "counterpoint"?
6. Can an Authorial Post reference a Space post outside the same group?
7. What should happen when a referenced source becomes unavailable?
8. Should legacy group repost rows be suppressed before full runtime alignment?
9. How should Russian copy avoid "ответить" while still allowing users to write near another post?
10. How should future verification distinguish weak authorial posts from legacy repost artifacts without designing moderation?
11. Should repeated posts on the same source be handled by product education, editor policy, or future runtime guardrails?
12. How should future Points avoid rewarding volume without designing rewards in this slice?
13. Which older Stage 13B.1 documents need supersession notes after H closes the authorial boundary?
14. Should authorial edit policy affect Blog candidate eligibility?

## Review gates

### Requirements Review

Result: pass with open questions.

Authorial boundary, weak content boundary, Group Feed purpose, quality dimensions, Blog relationship, anti-farming doctrine, and anti-forum doctrine are defined at product level.

### Architecture Review

Result: pass at conceptual architecture level.

The model preserves boundaries:

- Space owns Authorial Posts and Private Repost Context.
- Reactions own like/bookmark facts.
- Source modules own source truth.
- Blog owns curated publication.
- Economy remains out of scope.

No API, DB, schema, migration, frontend/backend implementation, moderation system, scoring, ranking, or recommendation design is proposed.

### Runtime Governance Review

Result: pass with `RUNTIME_PRE_TRANSITION`.

Current runtime still contains public/group repost behavior and lacks the full Authorial Post + Source Reference target model. This document defines the quality boundary needed before a Runtime Alignment Plan. It does not authorize runtime implementation.

### Canon Review

Result: pass.

The report locks the Group Feed canon: Group Feed exists for standalone authorial materials, not discussion, repost streams, reactions, private retention, or farming. Blog Asia candidate potential comes from quality authorial material, not volume or repost behavior.

## Status tokens

stage_13B_2_H_status: COMPLETE_AS_AUTHORIAL_PUBLISHING_BOUNDARY_AND_GROUP_FEED_QUALITY_MODEL
stage_13B_2_H_execution_mode: READ_ONLY_DOCTRINE_DESIGN_QUALITY_MODEL_SPECIFICATION
stage_13B_2_H_authorial_boundary_defined: TRUE
stage_13B_2_H_quality_model_defined: TRUE
stage_13B_2_H_group_feed_purpose_defined: TRUE
stage_13B_2_H_blog_relationship_defined: TRUE
stage_13B_2_H_anti_farming_defined: TRUE
stage_13B_2_H_anti_forum_defined: TRUE
stage_13B_2_H_requires_implementation: FALSE
stage_13B_2_H_next_recommended_step: STAGE_13B_2_I_RUNTIME_ALIGNMENT_PLAN
