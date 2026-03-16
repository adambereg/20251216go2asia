# Space Service — Production Architecture v1

**Project:** Go2Asia  
**Role of document:** SSOT draft for implementation of `space-service` after completion of `media-service` and Space module audit.  
**Status:** Draft for engineering implementation  
**Context:** Space is the social core of Go2Asia and should be implemented as a real backend domain, not as an extension of demo UI.

---

## 1. Purpose

This document defines the production architecture of `space-service` for Go2Asia.

Its goal is to give Cursor and the engineering workflow a clean implementation baseline for:

- `space-service` domain boundaries;
- canonical entities and relations;
- database schema direction;
- API contract direction;
- event model;
- integration with `media-service`, `reactions-service`, `feed-service`, `points-service`, and `user-service`;
- scaling, moderation, and anti-abuse principles.

This document is intentionally aligned with the current Go2Asia architectural direction:

- backend-first for new domains;
- social-first platform model;
- reactions separated from posts;
- media handled via dedicated media substrate;
- OpenAPI-first delivery.

---

## 2. Architectural Role of Space

`space-service` is the **social core** of Go2Asia.

Space is not just “a user feed” and not just “a personal cabinet”.

Space is the cross-domain social layer that creates circulation around:

- Atlas places;
- Pulse events;
- Blog posts;
- RF partners;
- Rielt listings;
- Quests;
- user-generated posts.

In product terms:

> Atlas/Pulse/Blog provide structured content and ecosystem objects.  
> Space provides social discussion, reposting, visibility, and user-generated circulation around them.

Therefore Space must be designed as a reusable ecosystem social layer, not as an isolated standalone social network.

PRO Console is not part of space-service.

PRO Console is a separate operational UI contour that aggregates multiple services such as Pulse, Quest, RF, moderation and analytics.

Space-service only contributes social data such as:
- posts
- groups
- profile projections

PRO operational data must remain in domain services.

---

## 3. Domain Boundary

### 3.1 What `space-service` owns

`space-service` owns only the social publication layer:

- posts;
- reposts;
- groups;
- group membership;
- profile projections required for Space surfaces;
- post ↔ media attachment relations;
- post lifecycle;
- publication events for downstream consumers.

### 3.2 What `space-service` does **not** own

`space-service` must not absorb other domain responsibilities.

It does **not** own:

- likes;
- ratings;
- short reviews;
- questions;
- bookmarks;
- contact requests;
- thread replies;
- inquiry threads;
- points balances;
- NFT data;
- referral trees;
- wallet balances;
- media storage;
- identity/auth source of truth;
- organizer execution logic;
- long-term planner / personal coordination engine;
- PRO operational workflows (events, quests, partner management, moderation operations).

These belong elsewhere:

- `reactions-service` — interaction language;
- `points-service` / Connect — rewards and balances;
- `media-service` — assets and upload pipeline;
- `user-service` / auth — identity and role verification.

This separation is critical for keeping Space clean and scalable.

### 3.3. Organizer / personal coordination layer is not owned by space-service.

Space UI may expose organizer surfaces, but the long-term source of truth for organizer and planning logic may evolve into a dedicated planner or organizer service.

In early phases a lightweight organizer model may temporarily exist near Space, but it must be designed for extraction.

---

## 4. Production Design Principles

1. **Minimal canonical post model**  
   Avoid loading post schema with every future use case. Step 4 must start from a small and stable model.

2. **Cross-module repostability**  
   Space must be able to create social circulation around ecosystem objects, not only native posts.

3. **Media by reference, not by ownership**  
   Space references `media-service` assets; it does not store media binaries.

4. **Reactions are external**  
   Space publishes posts; Reactions creates the interaction layer.

5. **Feed is a delivery concern**  
   Feed generation and feed surfaces should remain separable from raw post storage.

6. **Backend-first implementation**  
   UI must adapt to service DTOs through adapters. Backend contracts must not be inferred from mock UI.

7. **OpenAPI-first**  
   The service contract must be written before SDK generation and frontend integration.

---

## 5. Canonical Entities

## 5.1 `space_post`

This is the core publication object.

### Fields

- `id`
- `author_id`
- `group_id` (nullable)
- `post_type`
- `visibility`
- `text`
- `repost_target_type` (nullable)
- `repost_target_id` (nullable)
- `status`
- `created_at`
- `updated_at`
- `published_at`
- `deleted_at` (nullable, soft delete)

### `post_type`

Canonical Step 4 types:

- `post`
- `repost`
- `system`

These types must remain minimal.

Do **not** encode `poll`, `guide`, `place-report`, `event-report`, `quest-report`, etc. as first-class post types in Step 4.

Those can later be represented through:

- media attachments;
- repost target metadata;
- structured payload extensions;
- future domain enrichments.

### `visibility`

Canonical visibility values:

- `public`
- `followers`
- `group`
- `private`

This must replace legacy `friends` terminology.

### `status`

Suggested lifecycle statuses:

- `active`
- `hidden`
- `flagged`
- `deleted`

---

## 5.2 Repost target model

A repost in Space can reference either a native Space post or an ecosystem object.

Space must not fetch or persist full domain objects for repost targets.

Resolved previews should be treated as ephemeral read-model enrichments and must not replace domain ownership of the referenced services.

### Repost fields

- `repost_target_type`
- `repost_target_id`

### Initial target types

- `space_post`
- `blog_post`
- `place`
- `event`
- `partner`
- `listing`
- `quest`

This is one of the most important capabilities of Space.

It allows:

- discussion around a Blog article;
- social visibility for an Atlas place;
- sharing a Pulse event;
- circulation for RF and Rielt objects;
- social amplification of Quest progress.

This directly supports Go2Asia’s ecosystem model.

---

## 5.3 `space_group`

Groups are first-class social containers.

### Fields

- `id`
- `slug`
- `title`
- `description`
- `owner_id`
- `visibility`
- `status`
- `created_at`
- `updated_at`

### Group visibility

- `public`
- `private`
- `invite_only`

### Group status

- `active`
- `hidden`
- `archived`

Groups provide bounded social context and should exist from the first real Space iteration.

---

## 5.4 `space_group_member`

This entity defines group membership and role.

### Fields

- `group_id`
- `user_id`
- `role`
- `status`
- `joined_at`
- `invited_by` (nullable)

### Membership roles

- `member`
- `moderator`
- `owner`

### Membership status

- `active`
- `pending`
- `removed`
- `blocked`

---

## 5.5 `space_post_media`

Space does not own media files.

It owns only the relation between a post and uploaded media.

### Fields

- `post_id`
- `media_id`
- `sort_order`
- `attached_at`

All actual media lifecycle, storage, and variant generation remain in `media-service`.

---

## 5.6 `space_profile_projection`

Space should not duplicate the full user model.

However, it can maintain lightweight read projections optimized for social surfaces.

This projection exists solely for social rendering and discovery purposes and must not evolve into a duplicate user account model.

### Suggested projection fields

- `user_id`
- `display_name`
- `avatar_url`
- `role_label`
- `city_id` (nullable)
- `country_id` (nullable)
- `bio_short` (nullable)
- `updated_at`

This projection can be refreshed from `user-service` events or on demand.

The key rule:

> `user-service` remains identity source of truth.  
> Space may maintain only denormalized display projections.

---

## 6. Database Architecture

## 6.1 Initial production table set

Step 4 production baseline should include only the following Space-owned tables:

- `space_post`
- `space_group`
- `space_group_member`
- `space_post_media`
- `space_profile_projection`

Note:

The organizer domain (`space_organizer_item`) is intentionally excluded from the initial production table set.

If an early organizer model is temporarily implemented near Space, it must remain extraction-ready and should not expand the core social schema.

Optional but recommended in the same domain rollout:

- `space_feed_item` (if feed write model is implemented immediately)

This keeps the initial domain compact and implementation-friendly.

---

## 6.2 Suggested relational structure

### `space_post`

- many posts belong to one author;
- many posts may belong to one group;
- one post may reference many media assets;
- one repost references one repost target;
- one post may later receive many reactions (external service);
- one post may later participate in feed distribution.

### `space_group`

- one group has many members;
- one group has many posts.

### `space_group_member`

- composite uniqueness: `(group_id, user_id)`.

### `space_post_media`

- composite uniqueness: `(post_id, media_id)`.

---

## 6.3 Example SQL direction

```sql
CREATE TABLE space_post (
  id uuid PRIMARY KEY,
  author_id uuid NOT NULL,
  group_id uuid NULL,
  post_type text NOT NULL,
  visibility text NOT NULL,
  text text NULL,
  repost_target_type text NULL,
  repost_target_id uuid NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL
);
```

```sql
CREATE TABLE space_group (
  id uuid PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NULL,
  owner_id uuid NOT NULL,
  visibility text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE space_group_member (
  group_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  status text NOT NULL DEFAULT 'active',
  joined_at timestamptz NOT NULL DEFAULT now(),
  invited_by uuid NULL,
  PRIMARY KEY (group_id, user_id)
);
```

```sql
CREATE TABLE space_post_media (
  post_id uuid NOT NULL,
  media_id uuid NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  attached_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, media_id)
);
```

```sql
CREATE TABLE space_profile_projection (
  user_id uuid PRIMARY KEY,
  display_name text NOT NULL,
  avatar_url text NULL,
  role_label text NULL,
  city_id uuid NULL,
  country_id uuid NULL,
  bio_short text NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

---

## 6.4 Index strategy

At minimum:

### `space_post`

```sql
CREATE INDEX idx_space_post_author_created_at
ON space_post(author_id, created_at DESC);
```

```sql
CREATE INDEX idx_space_post_group_created_at
ON space_post(group_id, created_at DESC);
```

```sql
CREATE INDEX idx_space_post_visibility_created_at
ON space_post(visibility, created_at DESC);
```

```sql
CREATE INDEX idx_space_post_repost_target
ON space_post(repost_target_type, repost_target_id);
```

### `space_group_member`

```sql
CREATE INDEX idx_space_group_member_user
ON space_group_member(user_id);
```

These indexes are sufficient for the first production iteration.

---

## 7. API Architecture

## 7.1 API surface principles

- All public Space endpoints must live under `/v1/space/*`.
- Legacy `/api/space` contracts must not be treated as source of truth.
- All DTOs must be generated from OpenAPI.
- Frontend must consume generated SDK/helpers, not ad hoc fetch contracts.

---

## 7.2 Minimum Step 4 endpoints

## Posts

- `POST /v1/space/posts`
- `GET /v1/space/posts/{id}`
- `DELETE /v1/space/posts/{id}`

## Reposts

- `POST /v1/space/posts/{id}/repost`

## Groups

- `POST /v1/space/groups`
- `GET /v1/space/groups/{id}`
- `POST /v1/space/groups/{id}/join`
- `POST /v1/space/groups/{id}/leave`

## Feed

- `GET /v1/space/feed/home`
- `GET /v1/space/feed/profile/{userId}`
- `GET /v1/space/feed/group/{groupId}`
- `GET /v1/space/feed/activity`

## Media attach

- `POST /v1/space/posts/{id}/media`
- `DELETE /v1/space/posts/{id}/media/{mediaId}`

## Profile projection

- `GET /v1/space/profiles/{userId}`

---

## 7.3 Example DTO direction

### Create post request

```json
{
  "postType": "post",
  "visibility": "public",
  "text": "Текст публикации",
  "groupId": null
}
```

### Create repost request

```json
{
  "postType": "repost",
  "visibility": "public",
  "text": "Мой комментарий к репосту",
  "repostTargetType": "blog_post",
  "repostTargetId": "uuid"
}
```

### Attach media request

```json
{
  "mediaId": "uuid",
  "sortOrder": 0
}
```

---

## 8. Feed Architecture

Feed is the difference between “post storage” and a real social platform.

Space should not remain a CRUD-only service.

## 8.1 Feed surfaces

The production feed model should support four surfaces:

- `home feed`
- `profile feed`
- `group feed`
- `activity feed`

### Home feed

The user’s main social entry point.

### Profile feed

Posts authored by a given user.

### Group feed

Posts published inside a given group.

### Activity feed

System and social activity stream around the user.

---

## 8.2 Feed service boundary

There are two valid implementation models:

### Model A — feed logic inside `space-service`

Pros:

- simpler first implementation;
- faster to ship.

Cons:

- mixes storage and delivery logic;
- harder to scale later.

### Model B — dedicated `feed-service`

Pros:

- cleaner scaling boundary;
- better alignment with long-term social architecture.

Cons:

- more moving parts.

### Recommendation

For Go2Asia Phase 2:

- keep raw publication ownership in `space-service`;
- allow feed projection logic to evolve into a dedicated `feed-service` if needed;
- preserve event-driven boundaries from the start.

This means Step 4 may initially expose feed endpoints from Space, but events and schema should not prevent later extraction.

### Important constraint:

The canonical source of publication data must always remain `space_post`.
Feed projection layers must not become the source of truth for posts.

---

## 8.3 Feed write model

If a feed projection table is introduced early:

### `space_feed_item`

Fields:

- `id`
- `user_id`
- `post_id`
- `reason`
- `created_at`

### `reason`

- `author_post`
- `group_post`
- `repost`
- `system`
- `recommended`

This model is enough for early production delivery.

---

## 8.4 Ranking strategy

Do not introduce ML ranking in Step 4.

Use simple, explainable rules:

1. chronological first;
2. visibility filtering;
3. group membership filtering;
4. lightweight boosts for system/recommended entries if needed.

This is the correct production move for a first real release.

---

## 9. Event Model

Space must be event-driven from day one.

## 9.1 Events emitted by Space

Minimum events:

- `space.post.created`
- `space.post.deleted`
- `space.post.reposted`
- `space.group.created`
- `space.group.joined`
- `space.group.left`
- `space.post.media_attached`

---

## 9.2 Event consumers

Primary consumers:

- `feed-service` or feed projection worker;
- `reactions-service`;
- `notification-service`;
- `points-service` / Connect;
- moderation / trust layer;
- analytics / observability.

---

## 9.3 Why events matter

Without events, Space becomes tightly coupled to direct synchronous calls.

With events:

- feed generation is decoupled;
- points rewards remain external;
- notifications remain external;
- moderation can evolve independently;
- long-term architecture stays clean.

---

## 10. Integration Architecture

## 10.1 `user-service`

`user-service` remains source of truth for identity and roles.

Space uses it for:

- user verification via gateway/auth middleware;
- profile display projections;
- role labels if needed (`Spacer`, `VIP`, `PRO`).

Space must never become owner of full profile/account data.

---

## 10.2 `media-service`

Media upload flow:

1. frontend requests upload authorization from `media-service`;
2. file is uploaded through media flow;
3. resulting `media_id` is attached to post via `space-service`;
4. Space stores only the post ↔ media relation.

This aligns with the completed media step and prevents media sprawl.

---

## 10.3 `reactions-service`

Reactions remain fully outside Space.

Reactions own:

- like;
- repost-as-reaction if modeled there later;
- rating;
- short_review;
- bookmark;
- question;
- contact_request;
- thread_reply;
- inquiry thread interactions.

Space owns publication. Reactions owns interaction.

This is a critical production boundary.

---

## 10.4 `points-service` / Connect

Space should emit rewardable events only.

Examples:

- `post_created`
- `post_reposted`
- `group_created` (optional later)

Space must not calculate balances.

This preserves Connect as the economic source of truth.

---

## 10.5 Content domains

Cross-module reposts require Space to reference:

- Blog article IDs;
- Atlas place IDs;
- Pulse event IDs;
- RF partner IDs;
- Rielt listing IDs;
- Quest IDs.

Space must not duplicate those domain models.

It only stores references and uses lightweight resolved metadata in read models if needed.

---

## 11. Moderation and Trust Model

Space is social infrastructure and must support moderation from the first production iteration.

## 11.1 Post lifecycle

Recommended statuses:

- `active`
- `flagged`
- `hidden`
- `deleted`

### Meaning

- `active` — visible normally;
- `flagged` — visible to moderators / restricted handling path;
- `hidden` — removed from public surfaces but retained for audit;
- `deleted` — soft-deleted state.

---

## 11.2 Moderation controls

Suggested moderation endpoints or internal actions:

- flag post;
- hide post;
- restore post;
- soft-delete post.

These may start as internal/admin-only endpoints.

---

## 11.3 Auditability

Moderation actions should produce logs and moderation events.

A social core without moderation observability becomes dangerous very quickly.

---

## 12. Anti-Abuse and Throttling

Step 4 must include simple but real anti-abuse controls.

### Suggested initial limits

- max 10 posts per hour per user;
- max 3 reposts per minute per user;
- text length limits;
- media attachment count limits;
- optional group posting restrictions.

### Abuse classes to protect against

- spam posting;
- bot repost storms;
- media flooding;
- fake virality patterns.

The first production version does not need advanced anti-fraud ML.

Simple throttling and rate limits are sufficient.

---

## 13. Geo Considerations

Space may later support geo-aware posts, but geo should not be overdesigned in Step 4.

### Safe early fields

Optional future-safe fields:

- `country_id`
- `city_id`
- `place_id`
- coordinates (nullable)

### Production rule

If geo is added:

- Space stores references or lightweight coordinates;
- ownership of canonical place/location data remains outside Space;
- future `geo-service` may build social heatmaps and activity layers from Space data.

This keeps Space compatible with your future Geo Layer strategy.

---

## 14. Scalability Architecture

## 14.1 Write scaling

Raw post writes scale through:

- append-style post creation;
- limited synchronous enrichment;
- event emission after commit.

Do not perform heavy feed fanout synchronously in request path.

---

## 14.2 Read scaling

High-traffic reads should use:

- indexed queries for profile/group feeds;
- feed projection tables or workers;
- short-lived cache for hot surfaces.

---

## 14.3 Extraction readiness

The architecture should allow later extraction of:

- `feed-service`
- `space-search-service`
- moderation pipelines

without forcing a rewrite of raw publication storage.

This is why clean event boundaries matter from the start.

---

## 15. Recommended Repository Structure

Suggested initial layout:

```text
apps/
  space-service/
    src/
      routes/
        posts.ts
        groups.ts
        feed.ts
        profiles.ts
      services/
        postService.ts
        groupService.ts
        feedService.ts
        profileProjectionService.ts
      events/
        publishers.ts
      db/
        queries/
        mappers/
      middleware/
      app.ts
      server.ts
```

Shared DB schema direction:

```text
packages/
  db/
    src/
      schema/
        space.ts
```

OpenAPI direction:

```text
docs/
  openapi/
    space.yaml
```

Architecture docs:

```text
docs/
  architecture/
    space_domain_model_v1.md
```

---

## 16. Frontend Integration Rules

The current Space UI is mock-driven and must not define backend reality.

### Required frontend discipline

1. generated SDK only after OpenAPI exists;
2. DTO → ViewModel adapters in frontend;
3. no direct reuse of legacy mock types as service contracts;
4. current interactive Space pages must be explicitly demo-only until real API is connected.

### Important implication

Dashboard, Balance, NFT, Referrals, Vouchers, Quests are not Step 4 service scope.

They may remain UI placeholders or separate frontend surfaces, but they must not distort the Space domain model.

---

## 17. Implementation Phasing Recommendation

## Phase A — Design freeze

Before coding:

- archive legacy `/api/space` contract docs;
- approve this domain model direction;
- write `docs/openapi/space.yaml`;
- create DB schema proposal.

## Phase B — Core publication layer

Implement:

- `space_post`
- `space_group`
- `space_group_member`
- `space_post_media`
- create/get/delete post
- create/get/join group
- attach media

## Phase C — Feed surface

Implement:

- `home feed`
- `profile feed`
- `group feed`
- activity feed if feasible

## Phase D — Integration

Connect:

- `media-service`
- `points-service`
- `reactions-service`
- `notification-service`

## Phase E — Frontend replacement of mocks

Replace mock-driven pages gradually with real SDK-driven screens.

---

## 18. Key Architectural Decision Summary

### Space is:

- the social publication core of Go2Asia;
- a cross-domain circulation layer;
- a service with minimal canonical post types;
- media-by-reference;
- reactions-external;
- feed-aware but not necessarily permanently feed-owned.

### Space is not:

- the wallet service;
- the reactions service;
- the referral service;
- the quest engine;
- the voucher service;
- the NFT service;
- the personal cabinet source of truth.

---

## 19. Final Recommendation

The correct production move for Go2Asia is:

> implement `space-service` as a minimal but real social core with strong boundaries, clean references to ecosystem objects, event-driven feed/reward integration, and zero dependence on current frontend mocks.

Short formula:

> **posts + reposts + groups + media references + feed surfaces + events**

That is the right production baseline for Space.

From there, the rest of the ecosystem can safely connect to it.

---

## 20. Immediate Next Step for Cursor

Cursor should use this document as the basis for the next engineering step and create:

1. `docs/openapi/space.yaml`
2. `packages/db/src/schema/space.ts`
3. initial migration for Space tables
4. `apps/space-service`
5. gateway wiring for real `/v1/space/*`

Only after that should frontend mocks start being replaced.

---

## 21. AI assistants are not implemented inside space-service.

AI orchestration should live in a dedicated assistant or orchestration layer.

Space-service acts as a context provider for AI systems by exposing:
- posts
- groups
- organizer signals
- user activity context

AI systems may generate suggestions or automation tasks which are surfaced through Space UI.

AI assistants must treat space-service as a context provider rather than an execution engine.

All automation, orchestration, and macro execution must live outside the Space service boundary.