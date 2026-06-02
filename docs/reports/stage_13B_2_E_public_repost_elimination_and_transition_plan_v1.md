# Stage 13B.2-E - Public Repost Elimination & Transition Plan

## Execution mode

Doctrine transition planning / read-only.

This is a product-architecture transition plan. It is not an implementation slice.

This report does not design or change:

- code;
- frontend;
- backend;
- OpenAPI;
- SDK/types;
- Prisma;
- DB schema;
- migrations;
- API endpoints;
- sourceReference implementation;
- activity implementation;
- economy, points, rewards;
- moderation implementation.

No tests or runtime validation were required or run.

Task type: doctrine transition planning.

Risk level: HIGH, because this plan transitions Space from an already implemented public repost model toward an Authorial Post model.

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

## Current state

The current runtime and earlier Stage 13B.1-D contract still contain the old public repost doctrine.

Current model:

- Source object page can create a Space `repost`.
- Stage 13B.2-A composer creates `postType: 'repost'` with `visibility: 'public'`.
- Stage 13B.2-B added edit/upgrade for repost commentary by changing only `text` on the same repost object.
- Stage 13B.2-BR closed gateway/service runtime wiring for PATCH commentary.
- Repost can appear as a public feed item.
- Repost can be counted and filtered as "Репосты" in the feed.
- Backend allows the concept of `postType: 'repost'` with `visibility: 'group'` if group fields are valid.
- Group feed query does not conceptually exclude repost rows.
- Activity can materialize `space.repost_created` and `space.post_reposted_by_other`.
- `space_post` as repost target can imply repost-of-post behavior.

What still belongs to the old doctrine:

- "Share-to-Space creates public repost."
- "Repost is social propagation."
- "Repost can be a public feed item."
- "Repost can be a group feed item."
- "Repost can generate visible social activity."
- "Repost with text can function like a public quote-like item."
- "Feed highlight after share points to public repost success."

Important preservation:

- Stage 13B.2-A/B/BR work remains technically valid.
- Under the new doctrine, it should be reinterpreted as private-context machinery, not as the target public publishing model.
- Reactions still own like/bookmark facts.
- Space still owns posts and repost records.
- Blog still owns curated publication.
- Economy remains out of scope.

## Target state

Target doctrine:

- Repost is private user context.
- Repost is not a public social publication.
- Repost is not a group publishing format.
- Repost is not a Blog candidate by itself.
- Authorial Post is the primary unit of public/group expression.
- Group feed contains standalone authorial materials.
- Source material is context, inspiration, or reference, not a discussion-chain element.
- The user does not answer a publication. The user publishes their own material.
- Another post or object may be the source of inspiration, but it is not a parent in a discussion tree.

What should remain:

- Private repost as personal context/retention.
- Optional private note/commentary on repost.
- Repost target binding for private context.
- Repost dedupe for private context.
- Authorial `postType: post` as the public/group publishing base.
- One-hop source/reference concept for Authorial Post, specified at doctrine level in Stage 13B.2-D.
- Reactions like/bookmark facts.
- Space ownership of social user content.
- Blog's editorial role.

What should disappear from target public doctrine:

- Public repost as expression.
- Group repost.
- Repost filter as a public social category.
- Repost chain as discourse.
- `post_reposted_by_other` as incoming social pressure for new private reposts.
- "Комментарий к репосту" as public/group publishing language.
- "Share-to-Space = publish repost" as the default user mental model.

## Public repost inventory

Public repost concepts identified during Stage 13B.2-C and reinforced by Stage 13B.2-D:

1. Public object-bound repost.
2. Repost with optional commentary shown in public feed.
3. Repost edit/upgrade controls on feed cards.
4. "Репосты" feed filter and counters.
5. Public feed highlight after share.
6. Group repost through `postType: repost`, `visibility: group`, `groupId`.
7. Group feed display of repost rows.
8. `space_post` repost target.
9. Convenience repost of an existing Space post.
10. Repost-of-repost / repost chain implication.
11. `space.repost_created` outgoing activity.
12. `space.post_reposted_by_other` incoming activity.
13. Activity tab "repost" language and CTA.
14. Share-to-Space as product label for public repost.
15. Repost composer copy: "реакция к репосту", "комментарий к репосту".
16. Repost preview hydration and source card display.
17. Repost dedupe policy.
18. Legacy/mock comment/reply/shares language in Space mock surfaces.
19. Stage 13B.1-D public propagation language.
20. Existing public/group repost rows in data.

## Classification matrix

| Concept | Classification | Reason |
| --- | --- | --- |
| Private repost object | KEEP | Remains personal context and retention. |
| Repost target binding | KEEP / TRANSFORM | Keep for private repost, stop treating as public propagation reference. |
| Repost text/commentary | TRANSFORM | Becomes private note, not public/group commentary. |
| Repost dedupe | KEEP | Still valid for private context; should not block Authorial Posts. |
| Public object-bound repost | DEPRECATE | Old public propagation model conflicts with Authorial Post doctrine. |
| Public repost feed item | REMOVE from target public doctrine | Public feed should not use repost as expression unit. |
| Repost with public commentary | TRANSFORM / DEPRECATE | Private note remains; public quote-like behavior is deprecated. |
| Repost edit controls | TRANSFORM | Valid for private context, not as group/public authoring. |
| "Репосты" public feed filter | DEPRECATE | Reinforces repost as social category. |
| Public feed highlight after share | DEPRECATE | Polishes a destination no longer canonical for repost. |
| Group repost | REMOVE from target doctrine | Group feed is Authorial Post only. |
| Group feed repost display | REMOVE from target doctrine | Existing rows need legacy policy; future group feed should be authorial-only. |
| `space_post` repost target | TRANSFORM / DEPRECATE | Private nearest context may remain; public chain semantics deprecated. |
| Convenience repost of Space post | DEPRECATE as public primitive | Encourages repost-of-post chains. |
| Repost-of-repost chain | REMOVE | Explicitly forbidden by Stage 13B.2-C/D. |
| `space.repost_created` activity | TRANSFORM | If retained, it becomes private self-context, not social propagation. |
| `space.post_reposted_by_other` activity | REMOVE for new private repost doctrine | Private repost should not notify another author as social pressure. |
| Activity tab repost CTA | TRANSFORM | Should not route user toward public repost chain semantics. |
| Share-to-Space label | TRANSFORM | Split into "save for myself" and "publish my thoughts" intents. |
| Repost composer copy | TRANSFORM | Public wording should move toward private note or Authorial Post language. |
| Repost preview hydration | KEEP / TRANSFORM | Useful for private context and future source reference preview. |
| Legacy mock comments/replies | DEPRECATE | Not canonical; dangerous forum creep. |
| 13B.1-D propagation language | DEPRECATE at product semantics level | Ownership boundaries remain, public propagation semantics superseded. |
| Existing public/group repost rows | TRANSFORM under legacy policy | Preserve as legacy records, but remove from target public/group doctrine. |

## Legacy repost policy

Conceptual policy for already existing public/group repost rows:

1. Do not auto-convert legacy public reposts into Authorial Posts.
2. Do not treat legacy public reposts as Blog candidates.
3. Do not use legacy public reposts as proof that public repost remains canonical.
4. Preserve them as legacy records until a future data/runtime decision is made.
5. Suppress them conceptually from target group feed and public social doctrine.
6. Allow owner-context access if the future private repost surface supports it.
7. Avoid destructive or invisible semantic rewrite without explicit future decision.

Chosen conceptual policy:

Legacy public/group repost rows should be treated as legacy private-context candidates, not as active public/group authorial content.

This means:

- no automatic transformation into Authorial Post;
- no automatic deletion in this doctrine plan;
- no promotion to Blog candidate;
- no reliance on them for group quality;
- future alignment should decide whether they are hidden, archived, grandfathered read-only, or reclassified into owner context.

This report does not choose a technical migration strategy. It chooses the product policy: legacy public reposts are not part of the target public/group content model.

## Group feed transition

Target group feed doctrine:

- group feed contains Authorial Posts;
- group feed does not contain reposts;
- group feed does not contain comments;
- group feed does not contain replies;
- group feed does not contain quote-post trees;
- group feed does not contain repost chains;
- group feed grows user-authored materials that can later become Blog candidates.

Transition policy:

1. Stop treating repost rows as valid group content.
2. Treat existing group repost rows as legacy content requiring policy handling.
3. Define group feed quality around authorial independence.
4. Treat "response" as "new Authorial Post with optional source/reference context", not as a reply.
5. Preserve group membership/topic context without introducing discussion threads.
6. Keep group feed flat: source references may exist, but no visible ancestry tree.

Conceptual target:

Group source material  
↓  
User writes new Authorial Post  
↓  
Optional one-hop source reference  
↓  
Standalone group feed item  
↓  
Possible Blog candidate

Not target:

Group post  
↓  
Reply/comment  
↓  
Nested discussion  
↓  
Thread tree

## Activity transition

Current activity concepts:

- `space.repost_created`: outgoing activity for repost create.
- `space.post_reposted_by_other`: incoming activity when another user reposts a Space post.

Target doctrine:

- Private repost should not generate public social pressure.
- Private repost should not create incoming activity for another author.
- Authorial Post publication can remain activity-worthy as post creation or group publication.
- Repost note edit remains silent and private-context only.

Conceptual direction:

`space.repost_created`

- TRANSFORM.
- If retained conceptually, it should mean "I saved this into my private context", not "I publicly reposted this".
- It should not be used as a public social proof signal.
- It should not drive Blog candidacy.

`space.post_reposted_by_other`

- REMOVE for the target doctrine.
- Private repost should not notify or pressure the original post author.
- Existing historical activity may require legacy display policy, but new private repost doctrine should not create this meaning.

Activity transition principles:

1. Activity remains projection, not economy.
2. Activity does not reconstruct discussions.
3. Activity does not build chains.
4. Activity for Authorial Posts is separate from repost activity.
5. Activity for private repost is owner-context only or absent, depending on future private context specification.

## Share-to-Space transition

Old model:

Share-to-Space  
↓  
Space repost  
↓  
Public feed item  
↓  
Repost activity

Target model:

User intent is split:

Save for myself  
↓  
Private Repost

Publish my thoughts  
↓  
Authorial Post  
↓  
Optional source reference  
↓  
Group/public authorial surface

Conceptual transition:

- "Share-to-Space" should stop meaning "publish a public repost".
- Source object surfaces should distinguish retention from expression.
- Repost composer text should stop serving as public commentary.
- Authorial publishing should become the route for public/group user thought.
- Like/bookmark remain Reactions facts and are not confused with Authorial Post.

Product language target:

- "Save to my Space" or equivalent: private repost/retention.
- "Write my take" / "Publish my material" / "Write authorial post": Authorial Post.
- "Related material" / "source" / "inspired by": source reference.
- Avoid "answer", "reply", "comment", "quote", and "discussion thread".

Canon reinforcement from user:

The user does not answer a publication. The user publishes their own material. Other materials are only context, inspiration, or source for that publication.

## Risks

### User confusion risks

- Users may already understand "Share-to-Space" as public publication.
- Existing "Репосты" filters may make users expect public repost visibility.
- "Комментарий к репосту" may be understood as public comment.
- Removing public repost without authorial alternative may feel like feature loss.
- Existing URLs/highlights may point to legacy public repost cards.

### Migration risks

- Existing public/group repost rows can confuse target group feed behavior.
- Auto-transforming reposts into Authorial Posts would misrepresent authorship.
- Hiding rows without clear policy can break user trust.
- Activity history may continue to show old repost semantics.
- Dedupe rules for private repost must not accidentally constrain Authorial Posts.

### Doctrine drift risks

- Reintroducing "reply" language as convenience.
- Treating `space_post` reference as parent/child thread.
- Using activity feed to simulate discussion.
- Treating source preview as the main content in group feed.
- Treating Blog candidacy as reward/economy.
- Letting legacy/mock comment UI become canonical.

### Legacy runtime risks

- Current runtime still supports public repost behavior.
- Current backend model allows group repost conceptually.
- Current feed model can surface reposts publicly.
- Current activity projection can materialize repost as social event.
- Current Stage 13B.1-D language still describes repost as propagation.

## Dependency map

Before implementation can begin, future slices must define:

1. Private Repost Context Specification.
   - What is the user's private repost surface?
   - How does owner-only context differ from profile/home feed?
   - What language describes private repost notes?

2. Legacy Public Repost Row Policy.
   - Hide, archive, grandfather, or owner-context reclassification.
   - Historical activity display policy.
   - User expectation policy.

3. Authorial Source Reference Specification.
   - One-hop source/reference details.
   - Valid source domains.
   - Preview/copy boundaries.
   - Relationship to nearest Space post.

4. Authorial Publishing Boundary Specification.
   - What makes a group post sufficiently authorial?
   - Whether v1 supports public non-group authorial posts or group-first only.
   - Blog candidate gate language.

5. Runtime Alignment Plan.
   - Only after 1-4 are canonically complete.
   - Must remain separate from this doctrine transition plan.

6. Runtime Verification Plan.
   - Confirm no new public/group repost.
   - Confirm group feed authorial-only.
   - Confirm private repost remains owner-context.
   - Confirm no comments/replies/quote/thread drift.

## Canonical transition roadmap

Stage 13B.2-C  
Repost Doctrine Audit  
↓  
Stage 13B.2-D  
Authorial Post Model Specification  
↓  
Stage 13B.2-E  
Public Repost Elimination & Transition Plan  
↓  
Stage 13B.2-F  
Private Repost Context & Legacy Row Policy  
↓  
Stage 13B.2-G  
Authorial Source Reference Specification  
↓  
Stage 13B.2-H  
Authorial Publishing Boundary & Group Feed Quality Model  
↓  
Stage 13B.2-I  
Runtime Alignment Plan  
↓  
Implementation stages  
↓  
BV runtime reverification

Why this sequence:

- E cannot implement because private context and legacy rows are unresolved.
- F must decide where private repost lives and what old rows mean.
- G must define source/reference before replacing public repost with Authorial Post.
- H must define group quality before group feed runtime alignment.
- I can then plan implementation safely.

Not recommended next:

- feed highlight polish for public repost;
- Track B economy;
- points/rewards;
- comments/replies;
- quote-post;
- public repost UI cleanup without private/legacy policy.

## Open questions

1. What is the canonical product surface for private repost context?
2. Are existing public reposts shown to the author, hidden globally, or retained in legacy read-only mode?
3. Should existing group reposts be suppressed from group feed even before full Authorial Post implementation?
4. What should happen to historical `post_reposted_by_other` activity?
5. What copy replaces "Share-to-Space" on source object pages?
6. What copy replaces "Комментарий к репосту" in private context?
7. Should public non-group Authorial Posts exist in v1, or should Authorial publishing be group-first?
8. Can an Authorial Post reference a Space post outside the same group?
9. How should Blog candidacy be signaled without reward/economy semantics?
10. Which old 13B.1-D documents need supersession notes?
11. Should legacy mock comment/reply UI be removed or only canonically quarantined in a later cleanup?
12. How should staging verification distinguish old legacy rows from new target behavior?

## Review gates

### Requirements Review

Result: pass with open decisions.

Current and target states are clearly defined. Public repost concepts are inventoried and classified. Open questions remain for private context surface and legacy row policy, but they are intentionally deferred to future read-only decision slices.

### Architecture Review

Result: pass.

The plan preserves ownership boundaries:

- Space owns posts and private repost context.
- Reactions own like/bookmark facts.
- Source modules own source truth.
- Blog owns curated publication.
- Economy is not activated.

No API, DB, migration, endpoint, or frontend design is proposed.

### Runtime Governance Review

Result: pass with `RUNTIME_PRE_TRANSITION`.

Runtime currently remains pre-transition because public/group repost concepts still exist. The plan defines the transition doctrine and blocks implementation until private context, legacy rows, and source reference are specified.

### Canon Review

Result: pass.

This plan supersedes public propagation semantics from Stage 13B.1-D at the product level while preserving service ownership boundaries. It reinforces the Stage 13B.2-D canon: the user publishes their own material; other materials are context, inspiration, or source.

## Status tokens

stage_13B_2_E_status: COMPLETE_AS_PUBLIC_REPOST_ELIMINATION_TRANSITION_PLAN
stage_13B_2_E_execution_mode: READ_ONLY_DOCTRINE_TRANSITION_PLANNING_NO_IMPLEMENTATION
stage_13B_2_E_current_state_documented: TRUE
stage_13B_2_E_target_state_documented: TRUE
stage_13B_2_E_public_repost_inventory_complete: TRUE
stage_13B_2_E_transition_policy_defined: TRUE
stage_13B_2_E_group_feed_transition_defined: TRUE
stage_13B_2_E_activity_transition_defined: TRUE
stage_13B_2_E_requires_implementation: FALSE
stage_13B_2_E_next_recommended_step: STAGE_13B_2_F_PRIVATE_REPOST_CONTEXT_AND_LEGACY_ROW_POLICY
