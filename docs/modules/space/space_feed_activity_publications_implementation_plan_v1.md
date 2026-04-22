# Space Feed Activity Publications Implementation Plan v1

## Status

Implementation planning pass only.

This note bridges the accepted product decisions in `docs/modules/space/space_feed_activity_publications_decision_note_v1.md` to a bounded implementation sequence.

It does not reopen product roles, does not start coding, and does not introduce a new platform-wide feed redesign.

## Purpose

This note fixes:

- what already exists in runtime for Feed, Activity, and Publications;
- where runtime already matches the accepted product model;
- what is still missing or mismatched;
- which bounded implementation slices are practical next;
- which changes are frontend-only, existing-API based, or read-model/API/domain dependent.

## Inputs

Primary product anchor:

- `docs/modules/space/space_feed_activity_publications_decision_note_v1.md`

Related audit and alignment inputs:

- `docs/modules/space/space_community_feed_audit_v1.md`
- `docs/modules/space/space_current_state_audit_with_organizer_v1.md`
- `docs/modules/space/space_ui_backend_mapping_v_1.md`
- `docs/modules/space/space_frontend_baseline_status_note_v1.md`

Runtime files reviewed:

- `apps/go2asia-pwa-shell/components/space/runtime/useSpaceHomeFeed.ts`
- `apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPageClient.tsx`
- `apps/space-service/src/routes/feed.ts`
- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/src/db/queries/space.ts`
- `docs/openapi/space.yaml`
- `packages/db/src/schema/space.ts`

## Accepted product rules

Short reference from the decision note:

- Feed = personal social reading stream.
- Activity = personal event mirror.
- Publications = author ownership and management surface.
- `My` in Feed = my stream-visible contribution, not my full author cabinet.
- Publications remain a separate surface and are not replaced by `My`.
- Private author-only posts belong primarily to Publications and other author-owned contexts, not to Feed as a primary use case.
- Activity must remain event-oriented and must not degrade into a second feed or a sink for general ecosystem noise.
- Feed `Reactions` means readable, meaningful reaction-driven social items, not a raw reaction ledger.

## Surface-by-surface gap analysis

### Feed

Accepted product role:

- personal social reading stream;
- central readable stream of eligible social content;
- supports filters: `All`, `Groups`, `Reposts`, `Reactions`, `My`.

Current runtime reality:

- current live feed surface is `/space/community/feed`;
- runtime source is `GET /v1/space/feed/home`;
- inclusion logic already returns:
  - my own active posts;
  - public posts from any author;
  - group posts from groups where I have active membership;
- feed items are still `space_post`-based cards with `postType`, `visibility`, `groupId`, and repost metadata;
- `useSpaceHomeFeed()` already supports authenticated home mode and unauthenticated public-profile fallback.

What already matches:

- there is already a real read-oriented stream surface;
- authored posts, group-shared posts, and reposts already exist as runtime item classes;
- Feed is already separate from Community root, Group detail, Activity, Saved, and Organizer;
- current home feed can already support a truthful default `All` baseline.

What is missing:

- no server-side filter model for `Groups`, `Reposts`, `Reactions`, `My`;
- no reaction-driven feed-grade item class in the current home feed response;
- no explicit stream-level distinction between `All` and `My contribution lens`;
- no server-side filtered pagination for feed subviews;
- no accepted filter set alignment between the older mapping doc and the new decision note.

What is mismatched:

- `/space/community/feed` is still a home feed under a community label rather than a clearly named central Feed surface;
- current home feed is broader public-plus-membership inclusion, not a richer social-contour model such as following;
- `My` in current home feed would over-include my own private posts if implemented as a naive client filter on current data.

Implementation risk level:

- medium.

Dependency class:

- thin truthful baseline: frontend composition + existing API usage;
- real filter support: read-model/API additions;
- reaction items: additional cross-domain support.

Planning decision:

- Feed is the closest of the three surfaces to an already honest implementation.
- First implementation wave should not promise all five filters as equal server-truth filters on day one.
- `All` is already viable.
- `Groups`, `Reposts`, and `My` can be introduced first only if their initial semantics are explicitly bounded to what current feed data can truthfully express.
- `Reactions` should not be faked from the current activity endpoint or raw counters.

### Activity

Accepted product role:

- personal event mirror of what happened around me and what I did that matters as an event;
- supports filters: `All`, `Incoming`, `My actions`, `Social`, `System`.

Current runtime reality:

- `/space/activity` already exists;
- it reads `GET /v1/space/feed/activity?limit=20`;
- current query returns only active `space_post` rows authored by the current user;
- current event classes are effectively:
  - `post_created`
  - `repost_created`
- UI itself labels the surface as a narrow activity baseline.

What already matches:

- there is already a dedicated Activity route and endpoint;
- items are event-shaped rather than full feed cards;
- current runtime already covers a thin part of `My actions`.

What is missing:

- no incoming activity classes;
- no social activity classes beyond my own posting actions;
- no system activity classes;
- no filter parameter or event categorization model for `Incoming`, `Social`, `System`;
- no multi-source aggregation for reactions, replies, membership changes, or moderation/system events.

What is mismatched:

- accepted Activity is a mirror of what happened around me and what I did;
- current runtime is only a narrow log of my own post creation and repost creation;
- accepted Activity is not a post feed, but current backend source is entirely `space_post`.

Implementation risk level:

- high.

Dependency class:

- small extension of current baseline: existing endpoint evolution + read-model enrichment inside `space-service`;
- meaningful Activity surface: additional API/read-model support;
- full incoming/social/system spread: likely composite or multi-source expansion.

Planning decision:

- Activity is the most problematic surface by spec-vs-runtime distance.
- It should evolve from the current model rather than being replaced immediately.
- A new dedicated read model is not required for the first bounded slice, but becomes increasingly justified once incoming and system classes span multiple sources.

### Publications

Accepted product role:

- author ownership and management surface;
- supports the lifecycle and control of my authored objects;
- remains separate from Feed `My`.

Current runtime reality:

- `/space/posts` already exists;
- it renders `SpaceProfileSurface` for the current signed-in user;
- current data path is effectively a profile-feed-like authored list:
  - `GET /v1/space/profiles/{userId}`
  - `GET /v1/space/feed/profile/{userId}`
- current UI is read-oriented and profile-like;
- current backend supports post detail and delete, but not a full author-management contract.

What already matches:

- there is already a distinct route for authored content;
- current author can already see authored active posts through profile feed semantics;
- post identity includes visibility, type, status, and media references;
- delete already exists at API level.

What is missing:

- no drafts;
- no list of hidden/deleted/flagged author-owned states for management purposes;
- no edit flow;
- no visibility management flow;
- no management-oriented metrics/actions layer;
- no dedicated authored-content list endpoint shaped around ownership semantics rather than profile feed presentation.

What is mismatched:

- accepted Publications = ownership and management;
- current `/space/posts` = profile-feed-like authored baseline;
- dashboard links already hint at filters like drafts, but current route does not implement them.

Implementation risk level:

- medium.

Dependency class:

- stronger read baseline: frontend + existing API usage;
- useful first management step: frontend + existing delete API;
- full Publications role: API/read-model additions and some domain support.

Planning decision:

- Publications can be evolved gradually from current `/space/posts`.
- This route does not require a complete rework at the IA level.
- It does require a stronger author-management contract over time.

## Feed implementation planning

Target planning stance:

- keep Feed as the first truthful stream surface to strengthen;
- do not reopen Community scope;
- treat current home feed as the implementation base.

What can be implemented with current runtime:

- `All` as the default feed;
- a clearer central Feed surface using current home feed data;
- a thin first pass for `Groups`, `Reposts`, and `My` if explicitly limited to currently loaded feed items and current item metadata;
- routing, labels, and IA separation between Community root and Feed.

What requires additional support:

- server-truth filtered pagination for `Groups`, `Reposts`, `My`;
- stricter `My` semantics that exclude private author-only items from being treated as stream contribution by default;
- any real `Reactions` filter;
- any richer inclusion model beyond current home-feed rules.

Recommended Feed implementation stance:

- Slice 1 should establish a clean truthful Feed surface with `All`.
- Slice 2 may add bounded filters backed by current item metadata where semantically safe.
- `Reactions` should wait until reaction-driven feed items exist as first-class read objects.

Direct answer on quick filters:

- `Groups`: can be done quickly only as a bounded filter over current group-context feed items; full truthful pagination requires backend support.
- `Reposts`: can be done quickly only as a bounded filter over current repost items; full truthful pagination requires backend support.
- `My`: can be done carefully only if defined as stream-visible contribution and not as author cabinet; a fully correct server-truth implementation still benefits from backend support.
- `Reactions`: cannot be honestly delivered on current home feed without additional read-model/API support.

## Activity implementation planning

Target planning stance:

- keep the current endpoint and route as the starting baseline;
- expand activity classes incrementally instead of replacing the surface in one wave;
- preserve the distinction between event item and feed item.

What can be implemented with current runtime:

- clearer positioning of current Activity as `My actions` baseline;
- small UI structuring around existing event types if desired later;
- continued use of the same route and endpoint for the first implementation slice.

What requires additional support:

- `Incoming`;
- `Social`;
- `System`;
- a filter model on the endpoint;
- event categorization and possibly direction metadata;
- multi-source aggregation once the surface moves beyond authored posting actions.

Recommended Activity implementation stance:

- first bounded step should enrich the current model rather than create a full notification center;
- the first real expansion should introduce more event classes and server-side categorization;
- a dedicated new read model is not mandatory for the very first expansion, but current single-table logic is too narrow for the accepted target role.

Direct answer on read model:

- current Activity can be extended evolutionarily first;
- however, the accepted Activity role cannot be reached by UI work alone;
- once incoming/social/system classes span multiple domains, additional read-model or aggregation support becomes necessary.

## Publications implementation planning

Target planning stance:

- preserve `/space/posts` as the Publications entry point;
- evolve it from authored-feed baseline to author-management surface in bounded steps;
- do not conflate it with Feed `My`.

What can be implemented with current runtime:

- stronger authored-content baseline on `/space/posts`;
- clearer ownership semantics in UI;
- delete as the first management action;
- deeper detail navigation using current post detail support.

What requires additional support:

- drafts;
- edit;
- visibility management;
- author-owned lifecycle filters beyond active items;
- hidden/deleted management views;
- richer metrics and allowed-action metadata.

Recommended Publications implementation stance:

- first bounded slice should convert `/space/posts` from passive profile-feed framing to an explicitly author-owned baseline with at least one management action already supported by runtime;
- later slices can add edit/visibility/status support once API contracts exist;
- a full rework is not required immediately, but the current surface is not yet a true Publications surface.

Direct answer on gradual evolution:

- yes, current `/space/posts` can be turned into a proper Publications surface gradually;
- the route and basic authored listing can stay;
- stronger author-management semantics require additional backend support, not just cosmetic UI changes.

## Recommended rollout order

### Slice 1: Feed truthfulness and shell clarity

Why first:

- Feed is already the closest to the accepted role;
- current runtime already supports a meaningful default surface;
- this slice reduces user ambiguity with the least backend risk.

Scope:

- establish Feed as the central stream surface grounded in current home feed;
- keep `All` as the truthful primary mode;
- separate Feed semantics from Community root semantics in naming and composition;
- optionally add thin metadata-based subfilters only where they do not overclaim completeness.

Primary dependency class:

- frontend composition;
- existing API usage;
- optional light API parameterization if chosen early.

### Slice 2: Publications baseline upgrade

Why second:

- Publications already has a route and authored baseline;
- the surface is closer to a usable ownership layer than Activity is to a full event mirror;
- there is already at least one real management action in runtime: delete.

Scope:

- make `/space/posts` explicitly author-owned rather than profile-like in framing;
- add first management affordance around existing delete capability;
- keep lifecycle scope bounded to active authored items in the first slice.

Primary dependency class:

- frontend work;
- existing posts/profile APIs.

### Slice 3: Activity expansion beyond narrow baseline

Why third:

- Activity has the largest gap between current runtime and accepted role;
- meaningful progress requires new event classes and backend expansion;
- shipping it too early risks creating a misleading second feed or an empty filter shell.

Scope:

- extend current activity model with additional event classes and server categorization;
- add filters only after the endpoint can discriminate them truthfully;
- keep the first expansion bounded to a small set of high-signal event classes.

Primary dependency class:

- API/read-model additions;
- possibly multi-source aggregation later.

## Bounded slices

### Bounded slice for Feed

- use current home feed as the base implementation;
- ship `All` as the primary truthful slice;
- only add subfilters that current item metadata can support without pretending to cover the full stream history;
- defer `Reactions`.

### Bounded slice for Activity

- keep existing `/v1/space/feed/activity`;
- treat current output as `My actions` narrow baseline;
- next expansion should add a small number of event classes and server-side classification;
- do not open a full notifications wave.

### Bounded slice for Publications

- keep `/space/posts`;
- upgrade authored baseline framing;
- use current active authored list;
- add first management affordance through already supported delete;
- defer drafts, edit, visibility, and non-active lifecycle views.

## What can be done with current runtime

- a truthful Feed default state on top of `/v1/space/feed/home`;
- thin Feed subviews based on existing item metadata, if clearly bounded;
- clearer shell separation between Feed and Community;
- a stronger authored baseline on `/space/posts`;
- a first Publications management action using existing delete support;
- continued Activity baseline using the current endpoint;
- minor UI restructuring on Activity around its narrow current role.

## What requires API/read-model support

- server-side Feed filters with correct pagination;
- any honest `Reactions` feed filter;
- any richer social-contour logic beyond current home-feed inclusion rules;
- Activity filters and event classes beyond authored post creation/repost creation;
- incoming/social/system activity support;
- Publications edit;
- Publications visibility management;
- Publications drafts;
- Publications lifecycle views for hidden/deleted/flagged states;
- richer author-management metrics and allowed-action semantics.

## What is explicitly deferred

- a whole new feed platform;
- a full notification center;
- a broad ecosystem-wide event ingestion wave;
- a moderation/policy redesign;
- Community full-spec rewrite;
- Organizer expansion;
- PRO Console wave;
- database migrations and domain redesign in this planning pass.

## Final implementation planning verdict

Closest surface to honest implementation now:

- Feed.

Most problematic surface by spec-vs-runtime gap:

- Activity.

Best gradual evolution candidate:

- Publications.

Practical rollout verdict:

- strengthen Feed first as the most truthful and already-supported social surface;
- upgrade Publications second as an author-owned baseline with bounded management;
- expand Activity third once backend can support more than authored posting events.

Bridge verdict from decision/spec to implementation:

- the accepted product model is implementable without opening a new product wave;
- but the three surfaces are not equally ready;
- Feed can move mainly through composition and bounded filter logic;
- Publications can move through incremental author-management capability;
- Activity requires the highest proportion of new read-model/API work and should remain deliberately narrow until that support exists.

## References

- `docs/modules/space/space_feed_activity_publications_decision_note_v1.md`
- `docs/modules/space/space_community_feed_audit_v1.md`
- `docs/modules/space/space_current_state_audit_with_organizer_v1.md`
- `docs/modules/space/space_ui_backend_mapping_v_1.md`
- `docs/modules/space/space_frontend_baseline_status_note_v1.md`
- `apps/go2asia-pwa-shell/components/space/runtime/useSpaceHomeFeed.ts`
- `apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPageClient.tsx`
- `apps/space-service/src/routes/feed.ts`
- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/src/db/queries/space.ts`
- `docs/openapi/space.yaml`
- `packages/db/src/schema/space.ts`
