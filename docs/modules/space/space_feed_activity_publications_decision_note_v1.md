# Space Feed Activity Publications Decision Note v1

## Status

Decision/spec pass.

This note defines the product model for three Space Asia surfaces:

- Feed
- Activity
- Publications

It is SSOT-adjacent and intended to guide future implementation planning.
It does not rewrite the whole Space canon and does not open a new product wave.

## Purpose

This note fixes:

- the role of each surface;
- hard distinctions between them;
- inclusion rules and filters;
- minimal data requirements;
- boundaries with other Space surfaces.

This note explicitly uses:

- current runtime as factual constraint;
- existing Space docs as product context;
- Bolt.New prototypes only as UX/product reference, not as domain truth.

## Surfaces in scope

In current runtime terms, the three surfaces map to:

- `Feed` -> current feed surface under `/space/community/feed`
- `Activity` -> `/space/activity`
- `Publications` -> current authored-content surface under `/space/posts`

In Space IA terms, they belong to the stable primary/secondary shell set:

- Home
- Feed
- Groups
- Saved
- Organizer
- Activity
- Publications

## Feed: role and boundaries

### Formula

Feed = the personal social reading stream of Space Asia.

It answers:

- what is happening in my social contour;
- what should I read now;
- what social content is circulating through Space;
- what content from groups, authors, reposts, and ecosystem-linked circulation is socially relevant to me.

### Feed is

- a read-oriented stream surface;
- the main social delivery layer of Space;
- the place where circulation is normalized into readable cards;
- the place where ecosystem objects may appear only through social circulation formats.

### Feed is not

- not an author cabinet;
- not a management surface for my own published objects;
- not a group directory;
- not a group-specific feed;
- not an event log;
- not a dumping ground for every ecosystem widget;
- not an Organizer substitute.

### Allowed Feed item classes

Feed may contain only feed-grade social items:

- authored post
- group-shared post
- repost of a Space post
- repost of an ecosystem object
- socially meaningful reaction-driven item
- system-grade social circulation item, if it behaves like a stream item and is readable as content

Feed should not contain raw operational events such as:

- "you saved this"
- "you opened this"
- "you clicked this"
- "quest step completed"
- "referral recorded"

unless they are deliberately normalized into a social/post-like circulation item.

## Feed filters and inclusion model

### All

Default personal social stream.

Includes:

- all feed-grade items eligible for the viewer;
- authored posts from others that are visible to the viewer;
- group-related stream items eligible to the viewer;
- reposts and meaningful reaction-derived stream items.

### Groups

Feed items whose primary circulation context is a group.

This includes:

- posts published into a group;
- reposts whose effective circulation context is a group;
- socially meaningful group-centered reaction items if such items are later introduced.

This filter does not replace:

- Community root
- group detail
- group feed

### Reposts

Feed items where the primary object in the stream is a repost/circulation act.

This includes:

- reposts of Space posts;
- reposts of ecosystem objects from Atlas, Pulse, Blog, Quest, RF, Rielt;
- repost-like circulation items that remain readable as a content card.

### Reactions

Reactions in Feed means feed-grade reaction-driven social signals, not the raw reaction ledger.

This filter should include only meaningful social items such as:

- reaction-driven social momentum around a post or object;
- socially visible response items with enough context to read as a stream card;
- aggregated or normalized response items that materially change what is socially worth reading.

This filter should not be used for:

- every like as a separate row;
- every save as a separate row;
- internal counters without readable context.

### My

`My` in Feed is a stream lens, not an ownership cabinet.

It should include:

- my authored posts that are stream-visible;
- my reposts;
- my posts shared into groups;
- my socially visible contribution to the stream.

It should not include:

- private author-only posts as the primary target use case;
- drafts;
- hidden/deleted authored objects;
- non-publication actions such as save/join/referral/quest-step completion;
- the full management state of my authored content.

Hard decision:

`My` in Feed means "my contribution to the social stream", not "everything I own as an author".

## Activity: role and boundaries

### Formula

Activity = the personal event mirror of what happened around me and what I did that matters as an activity event.

It answers:

- what changed around my social/account contour;
- what happened to my content or social presence;
- what I did that should remain visible as an event trail;
- which events require attention or at least acknowledgement.

### Activity is

- event-oriented, not content-oriented;
- user-centric, not group-directory-centric;
- a mixed but disciplined mirror of social and system events;
- narrower than a full notification center unless explicitly expanded later.

### Activity is not

- not a feed of posts;
- not a second home feed;
- not an authored content cabinet;
- not a raw database log;
- not a sink for all ecosystem summaries;
- not a dashboard replacement;
- not a module-wide alert center for every product in Go2Asia.

### Activity item vs post/content item

A Feed item is a content unit to read.

An Activity item is an event unit to acknowledge or inspect.

Examples of event items:

- someone reacted to my post
- someone replied to me
- my post was reposted
- I reposted an item
- I joined a group
- my group role changed
- a publication was hidden/flagged
- a system action affected my social contour

Examples of non-activity content items:

- the post itself
- a repost card itself
- a public article-like Space post

Those belong to Feed or Publications, not to Activity as primary objects.

## Activity filters and event model

### All

All meaningful activity items visible to the user.

### Incoming

Events directed at me, my content, or my social presence.

Typical classes:

- reactions received
- replies or mentions received
- reposts of my content
- group invitations or membership changes affecting me
- moderation/system decisions affecting my publications

### My actions

My actions means outbound actions that are meaningful enough to keep as activity events.

Include:

- created post
- created repost
- joined group
- left group
- sent socially visible response action
- other user actions that changed my visible social/account contour

Do not include by default:

- private save/bookmark
- passive reading
- organizer step completion
- referral bookkeeping
- quest progression
- back-office or hidden operational actions

Hard decision:

`My actions` is not "everything I did in the ecosystem".
It is only the subset of my actions that form a meaningful Space-facing event trail.

### Social

Human/social interactions and group-social events.

Examples:

- likes/reactions with social meaning
- replies
- reposts
- mentions
- group join/leave/invite-related social events

### System

System events that affect my social/account contour and deserve explicit visibility.

Allowed classes:

- moderation status affecting my publication
- publication processing/status change
- group access or membership state change
- system-level notices directly tied to Space social surfaces

Not allowed by default:

- broad balance/NFT/referral summaries
- organizer reminders
- vouchers/promotions
- general ecosystem widget noise

Those belong in Dashboard or module-specific surfaces unless turned into a clear user-centric event.

## Publications: role and boundaries

### Formula

Publications = the author ownership and management surface for content I created in Space.

It answers:

- what I created;
- what state my publications are in;
- what I can manage as an author;
- how my publications perform and where they are visible.

### Publications is

- ownership-oriented;
- management-oriented;
- author-centric;
- the canonical place for lifecycle/status handling of my content objects.

### Publications is not

- not the main reading stream;
- not an activity log;
- not replaced by `My` in Feed;
- not a group feed;
- not Saved;
- not a dashboard widget.

### Objects that belong in Publications

Publications should contain:

- authored posts
- authored reposts
- drafts
- private posts
- hidden posts
- deleted/archived author-owned records where product chooses to retain them

Publications may also expose:

- moderation state
- visibility state
- reaction/engagement summary

### Allowed actions in Publications

Publications should be the place for author-side actions such as:

- open published object
- edit publication
- change visibility
- delete publication
- restore if product later supports it
- inspect reactions/engagement
- inspect circulation context

Hard constraint:

These are management actions.
They do not belong to Feed as primary interaction model.

## Why Publications remain separate from Feed

### Hard decision

Yes, Publications must remain a separate tab even if Feed has a `My` filter.

### Why

`My` in Feed and `Publications` solve different jobs:

- `My` in Feed = read my stream-visible contribution in stream context
- `Publications` = manage my author-owned objects across all statuses

`My` in Feed is bounded by stream logic.
Publications is bounded by ownership logic.

Without a separate Publications tab, the product loses:

- private content handling
- draft handling
- hidden/deleted state handling
- management actions
- stable author cabinet semantics

So:

- Feed `My` is a lens
- Publications is a surface

## Relationship between Feed / Activity / Publications

### Feed

- content delivery
- reading
- circulation
- social relevance

### Activity

- event mirror
- what happened around me
- what I did that matters as an event

### Publications

- ownership
- management
- author lifecycle

### Hard distinctions

- Feed does not replace Publications.
- Feed `My` does not replace author management.
- Activity does not replace Feed.
- Activity is not a list of publications.
- Publications is not an event log.
- Publications is not a second profile feed unless explicitly designed as one.
- Feed does not replace group feed.
- Activity does not become a dumping ground for dashboard widgets.

## Private posts and author-owned content handling

### Hard decision

Private author-only posts belong primarily to Publications.

They may also appear in:

- author-owned self-profile views
- author-owned internal authored contexts

They should not be part of:

- default Feed
- group feed
- public profile view for others
- Activity as content objects

If a private post generates an event that matters to the author, Activity may reflect the event.
But the post itself remains author-owned content, not public stream material.

This is stricter than some current runtime shortcuts and should be treated as the target product rule.

## Ecosystem object circulation rules

Space may carry social life for ecosystem objects from:

- Atlas
- Pulse
- Blog
- Quest
- RF
- Rielt
- Connect-related signals

### Feed

Feed may include ecosystem-linked circulation only when it is normalized into a readable social item:

- repost of ecosystem object
- discussion-carrying post about ecosystem object
- reaction-driven social signal around ecosystem object

### Activity

Activity may include ecosystem-linked events only when they are user-centric events around my social/account contour.

Examples allowed:

- my repost succeeded
- my ecosystem-linked publication changed state
- my socially visible action around an ecosystem object produced an event worth reflecting

Examples not default-allowed:

- raw quest progression
- raw referral bookkeeping
- raw balance changes
- raw voucher state

### Publications

Publications contains author-owned Space publication objects.

It does not become an ownership cabinet for external Atlas/Pulse/Quest/RF/Rielt objects.
Those external objects remain targets or references, not owned publication records.

## Minimal data requirements for each surface

### Feed

- feed item id
- publication id
- item class (`post`, `group_post`, `repost`, `reaction_signal`, `system_social`)
- author identity
- publication type
- visibility
- timestamp
- group context if any
- repost target metadata if any
- social counters/summary
- reaction-signal metadata if item class is reaction-driven
- viewer eligibility / filter classification fields

### Activity

- activity item id
- actor
- direction (`incoming`, `outgoing`)
- action type
- target summary
- timestamp
- optional related publication id
- optional related entity type/id
- social vs system classification
- optional CTA
- read/ack state if introduced later

### Publications

- publication id
- owned content object
- publication type
- visibility
- author ownership
- lifecycle status (`published`, `draft`, `hidden`, `deleted`, later `archived` if needed)
- created/published/updated timestamps
- metrics summary
- moderation/status flags
- allowed management actions

## What these surfaces are not

### Feed is not

- not an author cabinet
- not a group directory
- not a management grid
- not an event log

### Activity is not

- not a post feed
- not a social reading stream
- not a publication management surface
- not a container for every ecosystem summary

### Publications is not

- not a feed replacement
- not an event timeline
- not a group feed
- not a substitute for Saved

## Final product decisions

1. Feed remains the central personal social reading stream of Space.
2. Activity remains a disciplined event mirror, not a second feed.
3. Publications remains a separate author-owned management surface.
4. `My` in Feed means my stream-visible social contribution, not my whole author cabinet.
5. Publications is required even when `My` exists in Feed.
6. Reaction items in Feed must be meaningful reaction-driven social signals, not raw likes/saves.
7. Private author-only posts belong primarily to Publications and author-owned contexts, not to the main Feed.
8. Activity `My actions` includes only meaningful Space-facing event actions, not every ecosystem action performed by the user.
9. System signals in Activity must stay narrow and user-centric; broad ecosystem status belongs elsewhere unless normalized into a genuine activity event.

## Out of scope

- implementation planning
- schema redesign
- API migration plan
- Community detailed spec
- Organizer scope
- dashboard redesign
- Bolt visual review
- moderation/product policy detail beyond what is needed to define surface roles

## References

- `docs/modules/space/space_community_feed_audit_v1.md`
- `docs/modules/space/space_ui_backend_mapping_v_1.md`
- `docs/modules/space/space_frontend_information_architecture_v_1.md`
- `docs/modules/space/space_frontend_baseline_status_note_v1.md`
- `docs/architecture/space/space_domain_model_v_1.md`
- `docs/plans/Space-Asia-Live-Surfaces-Sequencing-v1.md`
- `apps/go2asia-pwa-shell/app/(public)/space/community/feed/CommunityFeedPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/useSpaceHomeFeed.ts`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceProfileSurface.tsx`
- `apps/space-service/src/routes/feed.ts`
- `apps/space-service/src/routes/posts.ts`
- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/src/db/queries/space.ts`
- `packages/db/src/schema/space.ts`
