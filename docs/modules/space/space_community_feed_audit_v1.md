# Space Community Feed Audit v1

## Status

Audit only.

This note fixes the current runtime understanding of Space Asia community-related surfaces after Organizer merge.
It does not propose implementation changes, UX fixes, or schema redesign.

## Purpose

This audit documents the current runtime relationship between:

- `Community root` (`/space/community`)
- `Community feed` (`/space/community/feed`)
- `Group detail / group feed` (`/space/community/groups/[groupId]`)
- `Profile feed`
- post visibility and inclusion rules

The main goal is to answer a current product ambiguity:

- why a signed-in user can see posts from `Oleg Tran` and `Admin Operator` in `/space/community/feed`;
- whether this screen is truly a community-group feed, or a home/social feed shown under a community label.

## Routes and surfaces reviewed

Frontend routes reviewed:

- `/space/community`
- `/space/community/feed`
- `/space/community/groups/[groupId]`
- `/space/profiles/[userId]`

Frontend UI/runtime files reviewed:

- `apps/go2asia-pwa-shell/app/(public)/space/community/CommunityRootPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/community/feed/CommunityFeedPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/community/groups/[groupId]/GroupPageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/useSpaceHomeFeed.ts`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`
- `apps/go2asia-pwa-shell/components/space/community/discoveryContent.ts`
- `apps/go2asia-pwa-shell/components/space/community/useSpaceCommunityDiscovery.ts`
- `apps/go2asia-pwa-shell/components/space/community/SpaceCommunityGroupCard.tsx`
- `apps/go2asia-pwa-shell/components/space/Shared/SpaceNav.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceProfileSurface.tsx`

## Runtime feed paths reviewed

Backend/runtime feed files reviewed:

- `apps/space-service/src/routes/feed.ts`
- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/src/db/queries/space.ts`
- `apps/space-service/src/index.ts`
- `packages/db/src/schema/space.ts`

Runtime feed paths reviewed:

- `/v1/space/feed/home`
- `/v1/space/feed/group/{groupId}`
- `/v1/space/feed/profile/{userId}`
- `/v1/space/feed/activity`

Related docs/content reviewed:

- `docs/modules/space/space_frontend_shell_alignment_before_organizer_v1.md`
- `docs/modules/space/space_frontend_baseline_status_note_v1.md`
- `docs/modules/space/space_ui_backend_mapping_v_1.md`
- `content/space/Space-Asia-Community-Discovery-Content-Pack-v1.md`
- `content/space/Space-Asia-Full-Seed-Content-Pack-v1.md`

## Community root: what it actually is

`/space/community` is currently a discovery-first surface, not a post feed.

What it actually does:

- renders curated discovery sections from `discoveryContent.ts`;
- uses `communityDiscoveryGroupIds` extracted from that static content;
- enriches cards with runtime summaries through `GET /v1/space/groups/{groupId}`;
- links each card to `/space/community/groups/[groupId]`;
- links separately to `/space/community/feed`.

So current `Community root` is:

- partly curated/static in structure;
- partly runtime-backed in group summaries;
- explicitly separate from the post stream.

It is not a runtime-generated feed of groups.
It is a curated map of entry points into groups.

## Community feed: what it actually is

`/space/community/feed` is currently backed by `useSpaceHomeFeed()`.

This is the most important factual point in the audit.

The page title says:

- `Поток постов сообщества`

But the page runtime mode is driven by:

- `useSpaceHomeFeed`
- `HOME_FEED_URL = /v1/space/feed/home`

The page itself also exposes this in UI:

- `Live mode: home feed`
- `Live mode: public profile fallback`

So current `Community feed` is not implemented as:

- "feed of the groups shown on /space/community"
- "feed of one selected community cluster"
- "group-only stream"

It is implemented as:

- Space home feed, displayed under a community/feed route and label.

If home feed cannot be loaded because of auth failure and `PUBLIC_PROFILE_ID` is configured, it falls back to:

- `/v1/space/feed/profile/{PUBLIC_PROFILE_ID}`

So even in fallback mode, it is still not a groups-derived feed.

## Group detail and group feed: what they actually are

`/space/community/groups/[groupId]` is a separate group surface.

What it actually does:

- loads group metadata with `GET /v1/space/groups/{groupId}`
- loads group posts with `GET /v1/space/feed/group/{groupId}`
- loads owner profile separately
- exposes join/leave actions
- renders feed cards for that group

This route is the current place where a true group-scoped feed exists.

Important difference from `/space/community/feed`:

- group detail uses `getGroupFeedUrl(groupId)`
- community feed uses `HOME_FEED_URL`

So `group feed` and `community feed` are different runtime paths.

## Post visibility and inclusion model

Current post model in `space-service` supports:

- `postType`: `post`, `repost`, `system`
- `visibility`: `public`, `followers`, `group`, `private`

Relevant schema constraints:

- `group` visibility requires `groupId`
- `groupId` implies `visibility = group`

Current inclusion logic by feed type:

### Home feed

`/v1/space/feed/home` includes:

- all active posts authored by the current user, regardless of visibility;
- active posts from any author with `visibility = public`;
- active posts from any author with `visibility = group` if current user has active membership in that group.

It does not include чужие `private` posts.
It also does not include чужие `followers` posts in the current query logic.

### Profile feed

`/v1/space/feed/profile/{userId}` loads all active posts by one author and then filters visibility through `canViewPost`.

This means:

- author can see own private/group/followers/public posts;
- other viewers can see public posts;
- other viewers can see group posts only with active membership;
- other viewers cannot see private posts.

### Group feed

`/v1/space/feed/group/{groupId}` returns only posts where:

- `group_id = groupId`
- `visibility = group`
- post is active and not deleted

Group access itself is also checked before feed is returned.

## Where the current feed items likely come from

For a signed-in user such as `fred89059599296@gmail.com`, current items in `/space/community/feed` most likely come from one of these sources:

1. public posts from any author in Space
2. group posts from groups where that user has active membership
3. the user's own posts of any visibility

For the specific visible authors `Oleg Tran` and `Admin Operator`, the direct code-backed explanation is:

- their public posts are eligible for inclusion in `/v1/space/feed/home`
- `/space/community/feed` renders `/v1/space/feed/home`

The seed content in `content/space/Space-Asia-Full-Seed-Content-Pack-v1.md` contains:

- `post-001` by `oleg.tran.seed@example.com` with `visibility: "public"`
- `post-015` by `admin.operator.seed@example.com` with `visibility: "public"` and `post_kind: "system"`

If those seed records are present in the current environment database, they will appear in the home feed for any authenticated user, including `fred89059599296@gmail.com`.

This explanation does not require:

- that the current user is the author
- that the current user is a member of Oleg's group
- that the post was taken from `/space/community` discovery cards

Public visibility alone is enough.

## Current UX ambiguity

Current ambiguity comes from the mismatch between route/label and actual data source.

### Ambiguity 1: community label vs home-feed runtime

The screen is named and framed as:

- `Поток постов сообщества`

But the actual runtime source is:

- home feed

This makes it easy to read the page as:

- "feed of communities"

when it is currently closer to:

- "global social/home feed under the community section"

### Ambiguity 2: weak visible link to groups shown on community root

`/space/community` shows curated group cards.
`/space/community/feed` does not consume those group ids directly.

So the user can naturally assume:

- "these posts came from those groups"

but current frontend/runtime does not enforce that relationship.

### Ambiguity 3: group signal is present but not explanatory enough

Feed cards may show:

- `Группа: {groupId}`

This shows that some posts are group-linked, but:

- it uses raw group id, not group title;
- it does not explain inclusion logic;
- it does not distinguish public home-feed inclusion from group-membership inclusion.

### Ambiguity 4: private author stream vs profile feed vs home feed are not explained in UI

Current code clearly distinguishes:

- home feed
- group feed
- profile feed

But this distinction is not clearly explained to the user by current naming and screen copy.

## Boundary / role clarification

Current runtime roles are best understood as follows:

### Community root

- discovery and belonging entry
- curated map of groups
- group-entry surface

### Community feed

- home/social stream shown under community label
- not a group-index-derived feed
- not one-group feed

### Group detail

- single-group identity and membership surface
- entry point into group-specific posts

### Group feed

- posts with `visibility = group` for one group
- shown inside group detail route

### Author private stream

- not exposed as a separate dedicated community route
- effectively visible only to author via own feed contexts

### Profile feed

- author-centric stream
- visibility-filtered per viewer

### Home feed

- current user-centric inclusion query
- own posts + public posts + eligible group posts

## Final verdict

Current implementation does not support reading `/space/community/feed` as a strict "community groups feed".

The more accurate current reading is:

- `Community root` = discovery surface for groups
- `Community feed` = home/social feed under community labeling
- `Group detail` = true group-scoped feed surface

So the current relationship is real but uneven:

- community root and group detail are directly related through group cards and group routes;
- community feed is adjacent to that model, but is not sourced from the same discovery/group-selection logic.

## Remaining questions or gaps

This audit confirms current runtime behavior, but some questions remain outside what code alone can prove:

- whether the current signed-in user has active memberships that also contribute group posts into home feed;
- which exact seed records are materialized in the current environment database;
- whether `followers` visibility is intentionally deferred or simply not yet wired into home feed logic;
- whether current naming was intended as a bounded placeholder or as a long-term product label.

## References

- `apps/go2asia-pwa-shell/app/(public)/space/community/CommunityRootPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/community/feed/CommunityFeedPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/community/groups/[groupId]/GroupPageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/useSpaceHomeFeed.ts`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`
- `apps/go2asia-pwa-shell/components/space/community/discoveryContent.ts`
- `apps/go2asia-pwa-shell/components/space/community/useSpaceCommunityDiscovery.ts`
- `apps/go2asia-pwa-shell/components/space/community/SpaceCommunityGroupCard.tsx`
- `apps/go2asia-pwa-shell/components/space/Shared/SpaceNav.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceProfileSurface.tsx`
- `apps/space-service/src/routes/feed.ts`
- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/src/db/queries/space.ts`
- `apps/space-service/src/index.ts`
- `packages/db/src/schema/space.ts`
- `docs/modules/space/space_frontend_shell_alignment_before_organizer_v1.md`
- `docs/modules/space/space_frontend_baseline_status_note_v1.md`
- `docs/modules/space/space_ui_backend_mapping_v_1.md`
- `content/space/Space-Asia-Community-Discovery-Content-Pack-v1.md`
- `content/space/Space-Asia-Full-Seed-Content-Pack-v1.md`
