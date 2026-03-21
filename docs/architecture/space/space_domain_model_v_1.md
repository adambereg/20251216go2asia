# Space Domain Model v1

**Project:** Go2Asia  
**Module:** Space Asia  
**Service focus:** `space-service`  
**Document role:** Engineering SSOT for domain model, schema direction, API DTO direction, event contracts, feed surfaces, organizer-ready fields, and AI-ready constraints  
**Status:** Draft for Cursor implementation planning

---

# 1. Purpose

This document translates the architectural decisions around Space Asia into an engineering-ready domain model for Cursor.

It defines:

- canonical domain entities;
- ownership boundaries;
- relational structure;
- field-level schema direction;
- API DTO direction;
- event contract direction;
- feed surfaces;
- moderation flows;
- organizer-ready extensions;
- AI-ready constraints.

This document is intentionally narrower and more implementation-oriented than the higher-level architecture docs.

---

# 2. Core Modeling Principles

## 2.1 Space Service models the social core, not the whole user universe

Space Service is the source of truth for:

- posts;
- reposts;
- groups;
- group memberships;
- social profile projections;
- post ↔ media references;
- publication lifecycle.

It is **not** the source of truth for:

- reactions;
- points;
- NFT;
- referrals;
- vouchers;
- quest progress ownership;
- housing inquiry flows;
- AI orchestration.

---

## 2.2 Canonical model must stay smaller than UX model

The frontend may present many content flavors:

- place post
- event post
- quest report
- article repost
- photo story
- trip reflection

The backend core must remain minimal.

Canonical `post_type` in v1 must be only:

- `post`
- `repost`
- `system`

All richer UX rendering should be derived through:

- repost target type;
- attached media;
- resolved metadata;
- view model adapters.

---

## 2.3 Ecosystem objects must be referenceable

Space must create social circulation around the rest of Go2Asia.

Therefore the model must support repost and context references to:

- blog posts;
- places;
- events;
- partners;
- listings;
- quests;
- native Space posts.

---

## 2.4 Early organizer support must be extraction-ready

If organizer items are initially kept near Space, the schema must be designed so they can later move into a dedicated planner service without forcing a rewrite.

---

# 3. Canonical Entity Set (v1)

The recommended canonical entity set for v1 is:

1. `space_post`
2. `space_group`
3. `space_group_member`
4. `space_post_media`
5. `space_profile_projection`
6. `space_feed_item` (optional but recommended if feed write model is implemented early)
7. `space_organizer_item` (optional and only if explicitly approved in early phase)

---

# 4. Entity Definitions

# 4.1 `space_post`

This is the main publication object.

## Ownership

Owned by Space Service.

## Semantics

Represents a native social publication inside Space.

A post may be:

- a standard post;
- a repost of another Space post;
- a repost of an ecosystem object;
- a system-generated social post.

## Fields

- `id`
- `author_id`
- `group_id` nullable
- `post_type`
- `visibility`
- `text` nullable
- `repost_target_type` nullable
- `repost_target_id` nullable
- `status`
- `created_at`
- `updated_at`
- `published_at`
- `deleted_at` nullable

## Field descriptions

### `id`
Primary key.

### `author_id`
User ID from identity/auth domain.

### `group_id`
Nullable reference to the group in which the post was published.

### `post_type`
Canonical values:

- `post`
- `repost`
- `system`

### `visibility`
Canonical values:

- `public`
- `followers`
- `group`
- `private`

### `text`
Main body text.
Nullable because some posts may be media-first or system-generated.

### `repost_target_type`
Nullable for normal posts.

### `repost_target_id`
Nullable for normal posts.

### `status`
Canonical values:

- `active`
- `flagged`
- `hidden`
- `deleted`

### `created_at`
Write timestamp.

### `updated_at`
Last update timestamp.

### `published_at`
Publication timestamp used for feed ordering.

### `deleted_at`
Soft delete support.

## Constraints

- `repost_target_type` and `repost_target_id` must either both be null or both be populated.
- if `post_type = repost`, target fields must be present.
- if `visibility = group`, `group_id` must be present.

---

# 4.2 Repost target model

The repost target is modeled inline inside `space_post`.

## Canonical target types

- `space_post`
- `blog_post`
- `place`
- `event`
- `partner`
- `listing`
- `quest`

## Notes

This is one of the most strategically important parts of the domain.

It makes Space the circulation layer for the whole ecosystem.

For RF-aligned anchoring, repost references must remain branch-capable:

- `partner` targets may represent partner-level or branch-level canonical references through structured metadata/ref payloads;
- this does not transfer partner/branch ownership into Space and keeps RF as source of truth for business presence.

---

# 4.3 `space_group`

This is the social container entity.

## Ownership

Owned by Space Service.

## Fields

- `id`
- `slug`
- `title`
- `description` nullable
- `owner_id`
- `visibility`
- `status`
- `created_at`
- `updated_at`

## `visibility`

- `public`
- `private`
- `invite_only`

## `status`

- `active`
- `hidden`
- `archived`

## Notes

Groups may support topic- or geo-based communities, curator-led communities, or private spaces.

---

# 4.4 `space_group_member`

Represents membership relation between user and group.

## Ownership

Owned by Space Service.

## Fields

- `group_id`
- `user_id`
- `role`
- `status`
- `joined_at`
- `invited_by` nullable

## `role`

- `member`
- `moderator`
- `owner`

## `status`

- `active`
- `pending`
- `removed`
- `blocked`

## Constraints

- composite primary key or unique constraint on `(group_id, user_id)`.

---

# 4.5 `space_post_media`

Join table between posts and media assets.

## Ownership

Owned by Space Service, but references `media-service` assets.

## Fields

- `post_id`
- `media_id`
- `sort_order`
- `attached_at`

## Notes

Space must not store media binaries or media variants. It stores only attachment relations.

---

# 4.6 `space_profile_projection`

Lightweight denormalized projection of user identity for social rendering.

## Ownership

Owned by Space Service as a read projection only.

## Source of truth

Identity source of truth remains in `user-service` / auth domain.

## Fields

- `user_id`
- `display_name`
- `avatar_url` nullable
- `role_label` nullable
- `country_id` nullable
- `city_id` nullable
- `bio_short` nullable
- `updated_at`

## Notes

This projection should stay lightweight. It is for rendering and search/display convenience, not account ownership.

---

# 4.7 `space_feed_item` (optional, recommended)

If feed write model is implemented early, use a projection table.

## Ownership

May be owned by Space Service in early phase, but must be extraction-ready for a future dedicated feed service.

## Fields

- `id`
- `user_id`
- `post_id`
- `reason`
- `created_at`

## `reason`

- `author_post`
- `group_post`
- `repost`
- `system`
- `recommended`

## Notes

This table is for delivery/read optimization, not as source of truth for post ownership.

---

# 4.8 `space_organizer_item` (optional, early phase only)

This entity is optional and should be included only if the early implementation explicitly keeps the organizer within the Space boundary.

## Ownership

Temporarily owned by Space-adjacent boundary if needed.

## Extraction note

Must be designed to be later movable into a planner/organizer service.

## Fields

- `id`
- `user_id`
- `type`
- `title`
- `description` nullable
- `source_module`
- `linked_entity_type` nullable
- `linked_entity_id` nullable
- `status`
- `priority`
- `due_at` nullable
- `remind_at` nullable
- `created_by`
- `execution_mode`
- `can_be_automated`
- `requires_confirmation`
- `created_at`
- `updated_at`

## `type`

- `trip`
- `reminder`
- `saved_action`
- `application`
- `growth_goal`
- `follow_up`

## `status`

- `planned`
- `pending`
- `completed`
- `cancelled`
- `expired`

## `created_by`

- `user`
- `system`
- `ai`

## `execution_mode`

- `manual`
- `assisted`
- `automated`

## Notes

This schema is intentionally AI-ready.

---

# 5. Relational Model

Below is the intended relational structure.

## 5.1 Core relations

- one user → many posts
- one group → many posts
- one group → many memberships
- one user → many memberships
- one post → many media attachments
- one post → may reference one repost target
- one user → one profile projection
- one user → many organizer items (optional)
- one user → many feed items (optional)

---

# 6. Suggested SQL Direction

These are engineering direction snippets, not final migrations.

## 6.1 `space_post`

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

## 6.2 `space_group`

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

## 6.3 `space_group_member`

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

## 6.4 `space_post_media`

```sql
CREATE TABLE space_post_media (
  post_id uuid NOT NULL,
  media_id uuid NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  attached_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, media_id)
);
```

## 6.5 `space_profile_projection`

```sql
CREATE TABLE space_profile_projection (
  user_id uuid PRIMARY KEY,
  display_name text NOT NULL,
  avatar_url text NULL,
  role_label text NULL,
  country_id uuid NULL,
  city_id uuid NULL,
  bio_short text NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

## 6.6 `space_feed_item` (optional)

```sql
CREATE TABLE space_feed_item (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  post_id uuid NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

## 6.7 `space_organizer_item` (optional)

```sql
CREATE TABLE space_organizer_item (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text NULL,
  source_module text NOT NULL,
  linked_entity_type text NULL,
  linked_entity_id uuid NULL,
  status text NOT NULL,
  priority text NOT NULL,
  due_at timestamptz NULL,
  remind_at timestamptz NULL,
  created_by text NOT NULL,
  execution_mode text NOT NULL,
  can_be_automated boolean NOT NULL DEFAULT false,
  requires_confirmation boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

---

# 7. Index Strategy

## 7.1 `space_post`

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

## 7.2 `space_group_member`

```sql
CREATE INDEX idx_space_group_member_user
ON space_group_member(user_id);
```

## 7.3 `space_feed_item` (optional)

```sql
CREATE INDEX idx_space_feed_item_user_created_at
ON space_feed_item(user_id, created_at DESC);
```

## 7.4 `space_organizer_item` (optional)

```sql
CREATE INDEX idx_space_organizer_item_user_due_at
ON space_organizer_item(user_id, due_at);
```

```sql
CREATE INDEX idx_space_organizer_item_user_status
ON space_organizer_item(user_id, status);
```

---

# 8. API DTO Direction

This section defines engineering direction for API contracts. Final DTOs should be published in `docs/openapi/space.yaml`.

---

# 8.1 Create Post Request

```json
{
  "postType": "post",
  "visibility": "public",
  "text": "Текст публикации",
  "groupId": null
}
```

---

# 8.2 Create Repost Request

```json
{
  "postType": "repost",
  "visibility": "public",
  "text": "Мой комментарий к репосту",
  "groupId": null,
  "repostTargetType": "blog_post",
  "repostTargetId": "uuid"
}
```

---

# 8.3 Post Response Direction

```json
{
  "id": "uuid",
  "author": {
    "userId": "uuid",
    "displayName": "Name",
    "avatarUrl": "...",
    "roleLabel": "PRO"
  },
  "groupId": null,
  "postType": "post",
  "visibility": "public",
  "text": "...",
  "status": "active",
  "repost": null,
  "media": [],
  "createdAt": "...",
  "updatedAt": "...",
  "publishedAt": "..."
}
```

---

# 8.4 Repost Embedded Metadata Direction

```json
{
  "repost": {
    "targetType": "event",
    "targetId": "uuid",
    "resolvedPreview": {
      "title": "Bangkok Meetup",
      "subtitle": "Pulse Asia",
      "imageUrl": "..."
    }
  }
}
```

This preview is a read-model convenience, not a sign that Space owns the target domain.

---

# 8.5 Group DTO Direction

```json
{
  "id": "uuid",
  "slug": "phuket-digital-nomads",
  "title": "Phuket Digital Nomads",
  "description": "...",
  "visibility": "public",
  "status": "active",
  "ownerId": "uuid",
  "membersCount": 123,
  "createdAt": "..."
}
```

---

# 8.6 Profile Projection DTO Direction

```json
{
  "userId": "uuid",
  "displayName": "Name",
  "avatarUrl": "...",
  "roleLabel": "VIP",
  "countryId": "uuid",
  "cityId": "uuid",
  "bioShort": "..."
}
```

---

# 8.7 Feed DTO Direction

```json
{
  "items": [
    {
      "id": "uuid",
      "reason": "group_post",
      "post": {
        "id": "uuid",
        "postType": "post",
        "text": "..."
      },
      "createdAt": "..."
    }
  ],
  "nextCursor": "..."
}
```

---

# 8.8 Organizer DTO Direction (optional)

```json
{
  "id": "uuid",
  "type": "trip",
  "title": "Поездка в Дананг",
  "description": "...",
  "sourceModule": "atlas",
  "linkedEntityType": "place",
  "linkedEntityId": "uuid",
  "status": "planned",
  "priority": "medium",
  "dueAt": null,
  "remindAt": "...",
  "createdBy": "ai",
  "executionMode": "assisted",
  "canBeAutomated": true,
  "requiresConfirmation": true
}
```

---

# 9. API Surface Direction

Recommended initial endpoints:

## Posts

- `POST /v1/space/posts`
- `GET /v1/space/posts/{id}`
- `PATCH /v1/space/posts/{id}`
- `DELETE /v1/space/posts/{id}`

## Reposts

- `POST /v1/space/posts/{id}/repost`

or canonical repost creation through `POST /v1/space/posts`.

## Groups

- `POST /v1/space/groups`
- `GET /v1/space/groups/{id}`
- `PATCH /v1/space/groups/{id}`
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

## Profiles

- `GET /v1/space/profiles/{userId}`

## Organizer (optional)

- `GET /v1/space/organizer`
- `POST /v1/space/organizer/items`
- `PATCH /v1/space/organizer/items/{id}`
- `DELETE /v1/space/organizer/items/{id}`

---

# 10. Event Contract Direction

Space must emit domain events.

## 10.1 Core events

- `space.post.created`
- `space.post.updated`
- `space.post.deleted`
- `space.post.reposted`
- `space.group.created`
- `space.group.member_joined`
- `space.group.member_left`
- `space.post.media_attached`

---

## 10.2 Example event payload direction

### `space.post.created`

```json
{
  "eventId": "uuid",
  "eventType": "space.post.created",
  "occurredAt": "...",
  "postId": "uuid",
  "authorId": "uuid",
  "groupId": null,
  "postType": "post",
  "visibility": "public"
}
```

### `space.post.reposted`

```json
{
  "eventId": "uuid",
  "eventType": "space.post.reposted",
  "occurredAt": "...",
  "postId": "uuid",
  "authorId": "uuid",
  "targetType": "place",
  "targetId": "uuid"
}
```

### `space.group.member_joined`

```json
{
  "eventId": "uuid",
  "eventType": "space.group.member_joined",
  "occurredAt": "...",
  "groupId": "uuid",
  "userId": "uuid"
}
```

---

# 11. Feed Surfaces and Read Rules

The domain model must support at least these feed surfaces:

## 11.1 Home feed
Primary social stream for the current user.

## 11.2 Profile feed
Posts authored by a given user.

## 11.3 Group feed
Posts published inside a given group.

## 11.4 Activity feed
System and social activity around the user.

---

## 11.5 Ranking direction for v1

Do not introduce ML ranking in v1.

Use:

1. chronological ordering;
2. visibility filtering;
3. group membership filtering;
4. optional simple system/recommended boosts.

---

# 12. Moderation Flows

Moderation must be supported from the start.

## 12.1 Post moderation states

- `active`
- `flagged`
- `hidden`
- `deleted`

## 12.2 Internal moderation actions

- flag post
- hide post
- restore post
- soft delete post

## 12.3 Notes

Moderation actions should be auditable and event-capable, even if the first iteration exposes them only through internal/admin paths.

---

# 13. Organizer-Ready Fields

If organizer items are supported early, the schema must explicitly support:

- linked ecosystem objects
- AI-created entries
- manual vs assisted vs automated execution modes
- confirmation requirements
- due/reminder timestamps
- growth-oriented tasks

These fields should not be flattened into generic text notes if AI and automation are expected later.

---

# 14. AI-Ready Constraints

Even if AI orchestration is implemented outside Space Service, the domain model should be AI-ready.

## 14.1 Required properties

Organizer-adjacent entities should support:

- `created_by = ai`
- `execution_mode = assisted | automated`
- `can_be_automated = true/false`
- `requires_confirmation = true/false`

## 14.2 Important rule

The presence of AI-ready fields does **not** mean Space Service owns AI orchestration.

It only means the domain model is structured enough to cooperate with it.

---

# 15. Explicit Ownership Matrix

## Space Service owns

- `space_post`
- `space_group`
- `space_group_member`
- `space_post_media`
- `space_profile_projection`
- `space_feed_item` (if early feed projection remains here)
- `space_organizer_item` (only if explicitly approved in early phase)

## Reactions Service owns

- likes
- bookmarks
- ratings
- short reviews
- questions
- contact requests
- thread replies

## Media Service owns

- media assets
- uploads
- variants
- metadata

## Connect / Points owns

- balances
- rewards
- badge logic
- referral reward rules

## AI / Assistant layer owns

- orchestration
- automation logic
- macro execution
- assisted execution flows

---

# 16. Cursor Implementation Guidance

Cursor should use this document as the engineering SSOT for the next implementation artifacts.

Recommended next outputs:

1. `docs/openapi/space.yaml`
2. `packages/db/src/schema/space.ts`
3. first migration for canonical Space tables
4. `apps/space-service`
5. gateway integration for `/v1/space/*`
6. optional organizer schema only after explicit approval of organizer placement inside Space boundary

The frontend must then consume generated SDK/contracts, not legacy mock assumptions.

---

# 17. Final Summary

This domain model is built around one central idea:

> **Space Service should be small enough to remain stable, but expressive enough to make Space Asia the social core of the Go2Asia ecosystem.**

Short formula:

> **posts + reposts + groups + profile projections + media references + events**

Optional early extension:

> **+ organizer items, but only if kept extraction-ready**

That is the correct engineering baseline for v1.

