# Stage 13B.3-A - Private Repost Runtime Surface Specification

## Execution mode

Runtime alignment specification / read-only.

This slice prepares the runtime alignment specification for WS-1 - Private Repost Context Alignment, as defined in Stage 13B.2-I.

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
- Source Reference doctrine;
- Authorial Post doctrine;
- moderation;
- economy, points, rewards, Quest proof, RF claim, or commercial authority.

No tests were run. No runtime changes were made.

Task type: runtime surface alignment specification.

Risk level: HIGH, because the current runtime still treats repost as public/group social propagation, while the frozen Stage 13B.2 canon defines Private Repost as owner-only retention context.

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

This report focuses only on WS-1.

WS-1 owns:

- runtime meaning of Private Repost Context;
- owner-only retention surface boundaries;
- conceptual visibility rules;
- relationship to feeds, profile, activity, and bookmarks;
- relationship to legacy repost rows at the WS-1 boundary;
- conceptual verification targets for future implementation.

WS-1 does not own:

- public repost elimination mechanics;
- Authorial Post runtime design;
- Source Reference runtime design;
- Group Feed authorial-only implementation;
- full legacy row display or migration policy;
- activity projection implementation;
- copy rewrite implementation;
- final BV evidence bundle.

## Canon anchors

Stage 13B.2 doctrine is frozen. This report does not change it.

Approved canon used by WS-1:

- Stage 13B.2-C: repost is private user context; public/group repost is a doctrine mismatch.
- Stage 13B.2-D: Authorial Post is standalone authored material; repost is not Authorial Post.
- Stage 13B.2-E: public repost is deprecated; retention must split from expression.
- Stage 13B.2-F: Source Reference is one-hop context on Authorial Post; it is not repost target binding.
- Stage 13B.2-G: Private Repost Context is owner-only personal retention with optional private note.
- Stage 13B.2-H: Group Feed exists for authorial content, not repost propagation, reactions, or weak content.
- Stage 13B.2-I: WS-1 aligns repost runtime meaning with owner-only retention before public repost elimination.

Fundamental canon:

The user does not answer a publication. The user publishes their own material. Other materials are context, inspiration, or source.

## SECTION 1 - Current Runtime State

Current runtime state: `RUNTIME_PRE_TRANSITION`.

Today, Private Repost does not exist as an owner-only runtime surface. The existing runtime has repost infrastructure, but its product meaning is still public/group propagation.

Current behavior:

- `ContentActionRow.tsx` creates object-bound reposts with `postType: 'repost'` and `visibility: 'public'`.
- The Share-to-Space path frames the action as publishing into Space, not saving into private context.
- `ShareToSpaceComposer.tsx` uses public-propagation language such as "Поделиться в Space", "реакция к репосту", and "Комментарий к репосту".
- Repost success and duplicate states link to `/space/feed?highlight=...`, making public feed the destination.
- `spaceService.ts` treats repost as a first-class `postType` with target binding and creates activity on repost creation.
- Repost dedupe exists by author and target, but its current runtime placement is public repost dedupe, not private retention dedupe.
- Repost note editing exists through the Stage 13B.2-B/BR PATCH path, but the edit control is attached to public feed cards.
- Home feed, activity, and profile/publications surfaces can treat repost as social/public output.
- Group repost remains possible conceptually in the service because `postType: repost`, `visibility: group`, and `groupId` are not rejected as a repost combination.
- Group feed queries filter by group and visibility, not by authorial post type.
- `SavedPostsPageClient.tsx` represents Reactions bookmarks, not Private Repost Context.
- `ActivityPageClient.tsx` exposes repost activity categories and feed-highlight links.

Current partial assets:

- Repost target binding can be reused conceptually as a private retention binding.
- Optional repost text can be reinterpreted as private note text.
- Repost dedupe is useful if scoped to owner-only retention.
- `visibility: private` exists in the contract and service read model, but is not the active PWA repost path.
- PATCH note editing is already silent and can align with private-note behavior.

Current baseline tokens:

```text
ws_1_runtime_baseline: RUNTIME_PRE_TRANSITION
ws_1_private_repost_surface: ABSENT
ws_1_default_repost_visibility: PUBLIC
ws_1_current_repost_meaning: PUBLIC_GROUP_PROPAGATION
ws_1_current_repost_note_meaning: PUBLIC_COMMENTARY
ws_1_current_activity_pressure: ACTIVE
```

## SECTION 2 - Canon Target State

Private Repost Context target state is defined by Stage 13B.2-G.

Private Repost Context is a Space-owned personal retention context. It binds one owner to one source target as "saved for myself" context, with optional private note text.

Target behavior:

- Private Repost begins with retention intent, not publication intent.
- The audience is owner-only.
- Optional text is a private note, not public commentary.
- The source target remains the center of the saved context.
- Private Repost does not appear in public feed, group feed, or author profile publication stream.
- Private Repost does not become Blog candidate material.
- Private Repost does not create reply, quote, comment, or repost-chain semantics.
- Private Repost does not create incoming social pressure for the referenced source author.
- Private Repost dedupe can exist in private scope and must not limit Authorial Posts about the same source.
- Private Repost may precede Authorial Post, but does not automatically create one.

Target primitive comparison:

| Primitive | Runtime meaning | Audience | Text role | Public/group role |
| --- | --- | --- | --- | --- |
| Private Repost | Personal retention | Owner only | Optional private note | None |
| Authorial Post | User-authored publication | Per publish policy | Primary content | Canonical expression unit |
| Source Reference | Context on Authorial Post | Readers of the Authorial Post | Secondary context | Only through Authorial Post |
| Bookmark / Like | Reactions fact | Per Reactions policy | None | Not Space publication |
| Legacy repost row | Deprecated historical artifact | Legacy policy only | Historical commentary | Not target doctrine |

Target state tokens:

```text
ws_1_target_repost_meaning: OWNER_ONLY_RETENTION
ws_1_target_repost_text_meaning: PRIVATE_NOTE
ws_1_target_activity_pressure: NONE
ws_1_target_public_feed_role: NONE
ws_1_target_group_feed_role: NONE
ws_1_target_profile_publication_role: NONE
```

## SECTION 3 - Runtime Gaps

Runtime gap inventory:

| # | Gap | Current runtime | Canon target |
| --- | --- | --- | --- |
| 1 | Private Repost surface absent | No owner-only retention context | Owner-only Private Repost Context exists as a runtime surface class |
| 2 | Repost write path is public | Share-to-Space creates `visibility: public` repost | Save-for-myself creates owner-only retention |
| 3 | Save and publish intents are conflated | One action means public share/repost | Retention and expression are separate intents |
| 4 | Repost text is public commentary | "Комментарий к репосту" shown in public feed | Optional private note |
| 5 | Public feed is repost destination | Success uses `/space/feed?highlight=...` | Private Repost resolves in owner context |
| 6 | Profile counts repost as output | Reposts can be publication-like records | Private Repost is not authorial publication |
| 7 | Group repost remains possible | Group visibility is not forbidden for repost shape | Private Repost does not belong in groups |
| 8 | Activity creates social pressure | `space.repost_created` and `post_reposted_by_other` exist | Owner-context or silent, no incoming pressure |
| 9 | Dedupe is in public repost path | Existing repost blocks duplicate public-looking action | Dedupe scoped to private retention only |
| 10 | Bookmarks and private retention are not both represented | Saved surface is Reactions bookmarks only | Bookmark and Private Repost remain separate |
| 11 | Legacy rows are not distinguishable | Old reposts and target behavior share surfaces | Legacy rows require explicit carve-out |
| 12 | Source Reference boundary can drift | Repost target binding looks like public context link | Retention binding is not Source Reference |

Gap severity:

- P0 for WS-1: public repost creation as default, absent owner-only surface, incoming social pressure, and dedupe scope ambiguity.
- P1 for WS-1: profile/publication counting, public feed highlight destination, bookmark/private-context confusion, legacy distinction.
- Cross-workstream dependencies: group feed exclusion, public repost elimination, Source Reference runtime, full activity projection rewrite, and legacy display policy.

## SECTION 4 - Runtime Surface Definition

This section defines runtime behavior only. It does not define UI, routes, components, APIs, schemas, or storage.

### Where Private Repost belongs

Private Repost belongs in an owner-only Space retention surface class.

That surface class is responsible for:

- personal saved source inventory;
- source target binding;
- resolved source preview in owner context;
- optional private note;
- owner-only note edit;
- owner-only removal or lifecycle management;
- dedupe-resolved "already saved for myself" state.

Private Repost may retain material that later inspires an Authorial Post. That future Authorial Post is a separate expression act and is outside WS-1.

### Where Private Repost does not belong

Private Repost does not belong in:

- public home feed as a publication;
- group feed as content;
- author profile publication stream;
- Blog candidate queue;
- Reactions saved/bookmark inventory;
- public repost filters or counters;
- incoming social activity for source authors;
- reply/comment/quote/repost-chain surfaces;
- economy, rewards, Quest proof, RF claim, or commercial authority.

### Relationship to feeds

Private Repost must not be a public feed item.

For future aligned runtime:

- owner can access Private Repost through owner context;
- non-owner must not discover Private Repost through public feed;
- group members must not discover Private Repost through group feed;
- public feed highlight links must not be the canonical destination for post-transition Private Reposts.

Legacy public feed repost rows are not proof that public repost remains canonical. They are legacy artifacts governed by WS-5.

### Relationship to profile

Private Repost is not authorial output.

Target relationship:

- owner may have owner-only access to retained sources;
- non-owner profile viewers must not see Private Reposts as publications;
- Private Reposts must not count as Authorial Posts;
- Private Repost note text must not be treated as published author text.

### Relationship to activity

Private Repost is not public social propagation.

Target relationship:

- new Private Repost must not generate incoming `post_reposted_by_other` pressure;
- outgoing activity, if retained conceptually, must be owner-context only;
- private note edit remains silent;
- activity must not reconstruct repost chains;
- historical repost activity requires legacy policy outside WS-1.

### Relationship to bookmarks

Bookmarks remain Reactions facts.

Private Repost is separate because it:

- belongs to Space, not Reactions;
- has optional private note;
- preserves source context in a Space retention layer;
- can coexist with bookmark on the same source;
- is not a like, bookmark, or lightweight reaction.

Boundary rule:

Bookmark saves a reaction fact. Private Repost saves context. Authorial Post publishes thought.

## SECTION 5 - Visibility Rules

Conceptual visibility rules for post-transition Private Repost:

| Actor / audience | Rule |
| --- | --- |
| Owner | Can view and manage Private Repost in owner-only context |
| Non-owner | Cannot view, discover, or treat it as social content |
| Public | Cannot see it in public feed, public profile, public activity, or public counters |
| Group | Cannot see it in group feed or group activity as content |
| Source author | Does not gain visibility or notification merely because their object was privately saved |
| Blog/editorial surfaces | No direct visibility as candidate material |

Owner visibility includes:

- retained source target;
- private note;
- resolved preview if available;
- dedupe-resolved existing saved context;
- private lifecycle state.

Non-owner/public/group visibility excludes:

- feed cards;
- profile publication rows;
- activity notifications;
- repost counters;
- direct social deep links;
- group feed rows;
- Blog candidate projections.

Conceptual contract rule:

`visibility: private` is a useful existing shape, but WS-1 defines semantic visibility, not an implementation mapping. The required semantic outcome is owner-only retention.

## SECTION 6 - Legacy Row Relationship

Legacy public/group repost rows are existing rows from the old public propagation model.

WS-1 relationship to legacy rows:

- legacy rows are not canonical Private Reposts;
- legacy rows are deprecated publication artifacts;
- legacy rows are possible owner-context candidates under a future WS-5 policy;
- legacy rows must not be auto-converted into Authorial Posts;
- legacy rows must not be silently rewritten into Source References;
- legacy rows must not be used as proof that public/group repost remains valid;
- legacy rows must not become Blog candidates or group quality signals.

What WS-1 defines:

- post-transition Private Repost behavior must be owner-only;
- legacy row visibility is a separate carve-out problem;
- future verification must distinguish legacy rows from post-transition Private Reposts.

What WS-1 does not define:

- whether legacy public rows remain visible to non-owners;
- whether legacy rows are archived, grandfathered, hidden, or reclassified;
- how legacy highlight URLs are handled;
- how legacy activity rows are displayed or retired;
- any migration, epoch marker, schema, or data rewrite.

Forbidden legacy drift:

1. Auto-convert legacy public/group repost into Authorial Post.
2. Treat legacy repost text as authorial material.
3. Promote legacy repost to Blog candidate.
4. Delete legacy rows in this specification.
5. Rewrite legacy rows into Source References.
6. Use legacy public rows to justify new public repost behavior.
7. Use legacy group rows as group quality signals.
8. Reconstruct discussion chains from legacy repost-of-post rows.
9. Let legacy row presence hide failure of post-transition Private Repost visibility.

## SECTION 7 - Activity Relationship

Current activity relationship is misaligned because repost is materialized as social propagation.

Current activity concepts:

- `space.repost_created` represents outgoing social repost activity.
- `space.post_reposted_by_other` creates incoming pressure for a referenced Space post author.
- activity UI contains repost categories and links back to public feed highlights.
- PATCH note edit is silent, which aligns with private note behavior.

Target activity relationship for Private Repost:

- create Private Repost: owner-context only or silent;
- edit private note: silent;
- source author incoming activity: forbidden for post-transition Private Repost;
- public activity CTA: not applicable;
- group/public social activity: not applicable;
- Blog/economy activity authority: not applicable.

WS-1 defines activity meaning, not implementation:

- Private Repost must not produce a social proof event.
- Private Repost must not notify the source author.
- Private Repost must not create a reply, quote, comment, or chain activity.
- Historical activity rows are legacy artifacts and require WS-5/WS-6 handling.

Activity alignment dependencies:

- WS-6 owns activity projection alignment.
- WS-5 owns legacy activity carve-outs.
- WS-1 provides the target semantic boundary that WS-6 must follow.

## SECTION 8 - Verification Targets

These are conceptual targets for future runtime implementation and BV. They are not test implementation.

### Positive verification targets

Future implementation must prove:

1. A user can save a source into Private Repost Context without publishing it to public or group surfaces.
2. The owner can view the retained source and optional private note in owner-only context.
3. A non-owner cannot discover a post-transition Private Repost through feed, profile, activity, group, or deep social link.
4. Group feed does not contain post-transition Private Reposts.
5. Profile/publications do not count post-transition Private Reposts as authorial output.
6. Private note edit remains silent and owner-only.
7. Source author receives no `post_reposted_by_other` or equivalent incoming pressure for post-transition Private Repost.
8. Dedupe applies only to private retention for the same owner and target.
9. Private Repost dedupe does not block future Authorial Posts about the same source.
10. Bookmarks remain Reactions facts and do not collapse into Private Repost.
11. Private Repost target binding is not treated as Source Reference.
12. Legacy repost rows are distinguishable from post-transition Private Reposts during verification.

### Negative release-blocking signals

Future runtime alignment fails if:

- a new retention action creates a public or group-visible repost;
- a post-transition Private Repost appears in public feed;
- a post-transition Private Repost appears in group feed;
- a post-transition Private Repost appears in profile publications as authorial output;
- `post_reposted_by_other` is generated for a new Private Repost;
- `space.repost_created` functions as public social proof for new Private Repost;
- a duplicate private save blocks an Authorial Post about the same source;
- bookmark and Private Repost are treated as the same primitive;
- repost target binding is treated as Source Reference;
- legacy rows are auto-converted to Authorial Posts;
- legacy rows are silently rewritten as Source References;
- verification cannot distinguish legacy public/group repost rows from post-transition Private Reposts.

### Verification traceability matrix

| Canon rule | Future observable proof |
| --- | --- |
| Private Repost is owner-only | Non-owner/public/group absence; owner access present |
| Private note is private | Edit is owner-only and silent |
| Repost is not publication | No public feed/profile/group publication role |
| Repost does not create pressure | No incoming source-author activity |
| Dedupe is retention-scoped | Duplicate save resolves private record; Authorial Post remains allowed |
| Bookmark is separate | Reactions saved facts remain independent |
| Source Reference is separate | Repost target binding is not used as provenance on Authorial Post |
| Legacy rows are artifacts | Legacy and post-transition rows are distinguishable |

## SECTION 9 - Runtime Risks

### Product risks

- Removing public repost behavior before owner-only Private Repost Context exists may look like feature loss.
- Users currently understand "Share-to-Space" as public publishing.
- "Комментарий к репосту" can be mistaken for public commentary or forum-like behavior.
- Saved/bookmarked content may be confused with Private Repost Context.

### Runtime risks

- The current PWA still creates public reposts by default.
- Group repost remains possible in the existing service shape.
- Feed/profile/activity surfaces currently reinforce repost as social output.
- Incoming repost activity can persist unless WS-6 aligns projection.
- Dedupe may keep old public semantics unless explicitly scoped to private retention.

### Governance risks

- Source Reference could be treated as renamed repost target binding.
- Private Repost could become a hidden public repost if owner-only visibility is not enforced.
- Legacy rows could be used to justify continued public repost behavior.
- Legacy rows could be auto-transformed into Authorial Posts, misrepresenting authorship.
- Stage 13B.2-A/B/BR commentary machinery could remain public-commentary machinery instead of private-note machinery.

### Sequencing risks

- WS-2 cannot safely remove public repost until WS-1 provides a private retention target.
- WS-6 cannot align activity until WS-1 settles Private Repost semantics.
- WS-8 cannot verify alignment without legacy-vs-post-transition distinction.
- WS-3 must remain separate so Authorial Post and Source Reference are not designed inside WS-1.

## SECTION 10 - Readiness

WS-1 specification readiness:

| Area | Status | Notes |
| --- | --- | --- |
| Current runtime state documented | Ready | Baseline is `RUNTIME_PRE_TRANSITION` |
| Canon target state documented | Ready | Anchored in Stage 13B.2-G |
| Runtime gaps identified | Ready | Public/group propagation gaps listed |
| Surface definition | Ready | Owner-only context and exclusions defined |
| Visibility rules | Ready | Owner/non-owner/group/public boundaries defined |
| Legacy relationship | Ready | Boundary defined; full policy deferred to WS-5 |
| Activity relationship | Ready | Target semantics defined; implementation deferred to WS-6 |
| Verification targets | Ready | Positive and negative targets defined |
| Implementation readiness | Not ready | Implementation remains unauthorized |

Is WS-1 ready for implementation after this specification?

No. This report makes WS-1 ready for review and acceptance as a runtime alignment specification. Implementation should not begin until the broader alignment gate resolves or explicitly carves out open product/runtime questions around owner surface naming, legacy row distinction, activity treatment, and copy quarantine.

What is ready:

- WS-1 target runtime semantics.
- WS-1 visibility boundaries.
- WS-1 relationship to feeds, profile, activity, bookmarks, and legacy rows.
- WS-1 verification targets.

What remains before implementation:

- explicit implementation authorization;
- product decisions or carve-outs for unresolved Stage 13B.2-G questions;
- WS-5 legacy runtime handling specification;
- WS-3 Authorial Post and Source Reference runtime alignment specification;
- later WS-6 activity projection specification.

Recommended next step:

Stage 13B.3-B should specify the next critical dependency rather than implement WS-1 immediately. The strongest next candidate is WS-5 - Legacy Runtime Handling Specification, because legacy row distinction is required before public/group feed and activity verification can produce reliable evidence.

Parallel planning can also proceed for WS-3 - Authorial Post and Source Reference Alignment Specification, because WS-1, WS-3, and WS-5 were identified by Stage 13B.2-I as the preconditions for WS-2 public repost elimination.

## Review gates

### Requirements Review

Result: pass.

The report answers the required sections for WS-1: current runtime state, canon target state, gaps, runtime surface definition, visibility, legacy relationship, activity relationship, verification targets, risks, and readiness.

### Architecture Review

Result: pass at runtime-specification level.

Ownership boundaries are preserved:

- Space owns Private Repost Context.
- Reactions own like/bookmark facts.
- Authorial Post remains the expression primitive.
- Source Reference remains context on Authorial Post only.
- Blog owns curated publication.

No API, DB, route, schema, or frontend/backend design is proposed.

### Runtime Governance Review

Result: pass with `RUNTIME_PRE_TRANSITION`.

The report defines target runtime semantics without authorizing runtime implementation.

### QA Review

Result: pass.

Future verification targets and release-blocking negative signals are defined, including owner-only visibility, public/group absence, activity silence, dedupe scope, bookmark separation, and legacy distinction.

### Canon Review

Result: pass.

No doctrine changes were introduced. Stage 13B.2 canon is treated as immutable. Authorial Post and Source Reference are only referenced as boundaries.

## Status tokens

```text
stage_13B_3_A_status: COMPLETE_AS_WS_1_PRIVATE_REPOST_RUNTIME_SURFACE_SPECIFICATION
stage_13B_3_A_execution_mode: READ_ONLY_RUNTIME_ALIGNMENT_SPECIFICATION
stage_13B_3_A_runtime_gap_inventory_complete: TRUE
stage_13B_3_A_visibility_rules_defined: TRUE
stage_13B_3_A_legacy_relationship_defined: TRUE
stage_13B_3_A_verification_targets_defined: TRUE
stage_13B_3_A_requires_implementation: FALSE
stage_13B_3_A_next_recommended_step: STAGE_13B_3_B_WS_5_LEGACY_RUNTIME_HANDLING_SPECIFICATION
stage_13B_3_A_workstream: WS_1_PRIVATE_REPOST_CONTEXT_ALIGNMENT
stage_13B_3_A_current_runtime_state: RUNTIME_PRE_TRANSITION
stage_13B_3_A_private_repost_surface_definition_complete: TRUE
stage_13B_3_A_activity_relationship_defined: TRUE
stage_13B_3_A_readiness_assessed: TRUE
stage_13B_3_A_authorial_post_redesign: FALSE
stage_13B_3_A_source_reference_redesign: FALSE
stage_13B_3_A_implementation_proposed: FALSE
stage_13B_3_A_api_design_proposed: FALSE
stage_13B_3_A_db_design_proposed: FALSE
stage_13B_3_A_frontend_design_proposed: FALSE
stage_13B_3_A_implementation_authorized: FALSE
```
