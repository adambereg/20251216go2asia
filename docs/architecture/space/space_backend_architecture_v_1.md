# Space Backend Architecture v1

**Project:** Go2Asia  
**Module:** Space Asia  
**Document role:** SSOT draft for backend architecture and implementation planning of Space Asia  
**Status:** Draft for engineering review and Cursor implementation guidance

---

# 1. Purpose

This document defines the backend architecture of **Space Asia** and clarifies the relationship between:

1. **Space Asia as a user-facing module**
2. **Space Service as the backend social-core service**
3. **Other services that participate in Space UI behavior but do not belong inside Space Service**

The goal of the document is to prevent architectural confusion and avoid turning Space into an uncontrolled monolith.

Space Asia is intentionally broader than Space Service.

- **Space Asia UI** is a rich user-facing environment that combines social activity, personal coordination, ecosystem signals, and future AI-assistant interaction.
- **Space Service** is the backend source of truth for the social publication core.
- **Other services** contribute surrounding capabilities such as reactions, rewards, media, organizer execution, AI assistance, partner interactions, quest progress, and so on.

This document exists to keep those boundaries clear.

---

# 2. High-Level Definition

## 2.1 Space Asia

**Space Asia** is the central user module of Go2Asia. It combines:

- **Social Layer** — posts, reposts, groups, profile, activity, feed
- **Personal Coordination Layer** — dashboard, organizer, saved items, reminders, growth progress
- **Assistant Interaction Layer** — AI suggestions, reminders, assisted execution, macro-like automation scenarios

Space Asia is therefore not only a social module, but also a **personal operating layer for the user inside the ecosystem**.

---

## 2.2 Space Service

**Space Service** is the backend service that powers the **social core** of Space Asia.

Its responsibility is to own:

- posts
- reposts
- groups
- group membership
- profile projections for social surfaces
- post-media attachment relations
- publication lifecycle
- publication-related events for downstream consumers

Short formula:

> **Space Service = source of truth for the social publication layer of Space Asia**

---

# 3. What Space Service Must Not Become

This is one of the most important architectural constraints.

Space Service must **not** become a “God Service” responsible for all user-facing functionality visible inside Space Asia.

It must not absorb logic for:

- likes
- ratings
- reviews
- bookmarks
- questions
- contact requests
- thread replies
- referral logic
- Points balances
- NFT ownership
- voucher logic
- quest progress ownership
- booking / inquiry transaction flows
- AI orchestration
- full assistant execution layer
- full productivity / planner domain of the whole ecosystem

Those concerns belong either to:

- other dedicated services, or
- aggregated read models displayed in the Space UI.

The richer Space Asia becomes as a user module, the more important it is to protect the Space Service boundary.

---

# 4. Correct Architectural Role of Space Service

Space Service sits in the center of the user experience, but must remain narrowly scoped.

## 4.1 Space Service owns

### A. Social publication
- native posts
- reposts
- system posts

### B. Social containers
- groups
- memberships

### C. Social projections
- profile projection
- lightweight feed-facing projections

### D. Publication lifecycle
- create
- update
- delete
- visibility
- moderation status

### E. Publication events
- `post.created`
- `post.reposted`
- `group.created`
- `membership.changed`
- `media.attached`

---

# 5. Relationship Between Space UI and Space Service

Not everything shown in the Space Asia interface must be stored or owned by Space Service.

Examples of UI blocks that may appear inside Space Asia but are not owned by Space Service:

- Balance widget
- NFT widget
- Referrals widget
- Vouchers widget
- Quest progress widget
- Organizer widgets
- AI assistant suggestions
- PRO operational summary blocks

This leads to an important architectural distinction:

## 5.1 Space Asia UI
A **user-facing aggregation surface** that combines multiple domains.

## 5.2 Space Service
A **social-core backend service**.

## 5.3 Other services
Providers of summary blocks, signals, actionable items, and planning context.

---

# 6. Backend Layers Around Space Asia

To reason correctly about the backend organization of Space Asia, it helps to divide it into layers.

---

## 6.1 Core Social Layer

This is the actual **Space Service**.

It owns:

- posts
- reposts
- groups
- group membership
- profile projections
- post ↔ media references
- publication lifecycle

---

## 6.2 Interaction Layer

This should live in a separate **Reactions Service**.

It owns:

- like
- bookmark
- rating
- short review
- question
- contact request
- thread reply
- inquiry thread-related interactions

This is aligned with the social-first model without classic inline-comment systems.

---

## 6.3 Coordination Layer

This is the layer behind the **Organizer / personal coordination logic** shown in Space Asia.

There are two valid architectural phases:

### Early phase
A lightweight organizer model may live close to Space, especially if the first implementation is tightly tied to Space UI.

### Long-term phase
A dedicated `organizer-service` or `planner-service` can emerge and Space UI simply renders it as part of the user’s personal coordination layer.

### Recommendation
It is acceptable to keep a **minimal organizer model near Space** in the early stage, but it must be designed so that it can later be extracted cleanly.

---

## 6.4 Assistant / Automation Layer

AI orchestration should not live inside Space Service.

This should evolve as a separate layer, such as:

- `assistant-service`
- `orchestration-service`
- `macro-runner`
- `automation-engine`

Space Asia UI becomes a **human-facing cockpit** for AI interaction, but Space Service must remain independent from that execution logic.

---

# 7. Canonical Core Entities of Space Service

---

## 7.1 `space_post`

This is the main entity of Space Service.

It represents any publication inside Space.

### Fields

- `id`
- `author_id`
- `group_id` nullable
- `post_type`
- `visibility`
- `text`
- `repost_target_type` nullable
- `repost_target_id` nullable
- `status`
- `created_at`
- `updated_at`
- `published_at`
- `deleted_at` nullable

### `post_type`

Minimal canonical set:

- `post`
- `repost`
- `system`

This should remain intentionally small.

The UX layer may present richer conceptual types such as:

- place post
- event post
- quest report
- article repost
- photo story

But those should not explode the canonical backend model prematurely.

### `visibility`

- `public`
- `followers`
- `group`
- `private`

### `status`

- `active`
- `flagged`
- `hidden`
- `deleted`

---

## 7.2 `space_group`

Groups are social containers.

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

### `visibility`

- `public`
- `private`
- `invite_only`

### `status`

- `active`
- `hidden`
- `archived`

---

## 7.3 `space_group_member`

Membership is a separate entity and should not be hidden inside groups.

### Fields

- `group_id`
- `user_id`
- `role`
- `status`
- `joined_at`
- `invited_by` nullable

### `role`

- `member`
- `moderator`
- `owner`

### `status`

- `active`
- `pending`
- `removed`
- `blocked`

---

## 7.4 `space_post_media`

Space does not own media files.

It stores only the relation between a post and media assets created in `media-service`.

### Fields

- `post_id`
- `media_id`
- `sort_order`
- `attached_at`

---

## 7.5 `space_profile_projection`

A Space profile is not the same thing as an account profile in the identity system.

Therefore Space Service may keep a lightweight social projection.

### Fields

- `user_id`
- `display_name`
- `avatar_url`
- `role_label`
- `country_id`
- `city_id`
- `bio_short`
- `updated_at`

Important rule:

> `user-service` remains source of truth for identity and account-level information.  
> Space Service stores only a denormalized social projection for fast rendering.

---

# 8. Repost Model

One of the most important architectural capabilities of Space is that reposts must work not only for native Space posts, but also for ecosystem objects.

## 8.1 Repost target types

Recommended target types:

- `space_post`
- `blog_post`
- `place`
- `event`
- `partner`
- `listing`
- `quest`

This allows Space to become the circulation layer for the entire ecosystem.

---

# 9. Feed Model

Feed is a delivery concern and should be treated separately from raw publication storage.

## 9.1 Feed is not a simple posts query

A real feed is not just:

```sql
SELECT * FROM space_post ORDER BY created_at DESC
```

It is a product surface with targeting and context.

Minimum feed surfaces:

- home feed
- profile feed
- group feed
- activity feed

---

## 9.2 Two valid implementation paths

### A. Feed inside Space Service
Simpler for the first implementation.

### B. Separate Feed Service
Cleaner long-term architecture.

### Recommendation for Go2Asia
It is acceptable to expose feed endpoints from Space Service in the first production stage, but event-driven boundaries should be preserved from the start so that feed can later be extracted if needed.

---

## 9.3 Optional feed projection table

If a feed write model is introduced early:

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

---

# 10. Event-Driven Architecture of Space

Space Service should be event-driven from the beginning.

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

## 10.2 Event consumers

### Feed layer
Builds or updates feeds.

### Reactions layer
Uses posts and groups as interaction targets.

### Notification Service
Sends social notifications.

### Points / Connect
Rewards social activity.

### Analytics / observability
Collects metrics and traces.

### AI / assistant layer
Builds suggestions and personal automations.

---

# 11. Space Service ↔ Reactions Service

This is one of the most important boundaries in the architecture.

## 11.1 Space Service owns
- publication objects
- groups
- memberships

## 11.2 Reactions Service owns
- likes
- bookmarks
- ratings
- short reviews
- questions
- contact requests
- thread replies
- interaction-specific logic and anti-abuse for interactions

Short formula:

> **Space creates objects. Reactions creates user actions around those objects.**

This keeps the architecture clean and composable.

---

# 12. Space Service ↔ Media Service

The correct media flow is:

1. frontend requests upload authorization from `media-service`
2. file is uploaded through the media flow
3. `media-service` creates an asset
4. frontend receives `media_id`
5. frontend calls `space-service` attach endpoint
6. Space stores the relation between the post and the media asset

Short formula:

> `media-service` owns asset lifecycle  
> `space-service` owns social attachment relation

---

# 13. Space Service ↔ Points / Connect

Space should be one of the major producers of rewardable events.

Examples:

- `post_created`
- `repost_created`
- `group_created`
- curator social milestones
- engagement threshold reached

However, Space Service must not calculate balances itself.

It only emits events.

Connect / Points decides:

- whether the event is rewardable
- how much to reward
- whether there are limits
- whether multipliers for VIP / PRO apply

---

# 14. Space Service ↔ Organizer Layer

Organizer is a product-critical feature of Space Asia, but backend ownership must be handled carefully.

## 14.1 Recommended early-stage approach

A lightweight organizer model may temporarily live close to Space if this accelerates delivery and keeps the personal coordination layer coherent.

### Example entity: `space_organizer_item`

Fields:

- `id`
- `user_id`
- `type`
- `title`
- `description`
- `source_module`
- `linked_entity_type`
- `linked_entity_id`
- `status`
- `priority`
- `due_at`
- `remind_at`
- `created_by`
- `execution_mode`
- `can_be_automated`
- `requires_confirmation`
- `created_at`
- `updated_at`

### `type`

- `trip`
- `reminder`
- `saved_action`
- `application`
- `growth_goal`
- `follow_up`

### `status`

- `planned`
- `pending`
- `completed`
- `cancelled`
- `expired`

### `created_by`

- `user`
- `system`
- `ai`

### `execution_mode`

- `manual`
- `assisted`
- `automated`

---

## 14.2 Why this is acceptable early on

Because in the first phase the Organizer is primarily part of the user’s personal coordination experience inside Space Asia.

But it must be designed for eventual extraction into a more dedicated planner domain.

---

# 15. Space Service ↔ AI Assistant Layer

AI assistants must not live inside Space Service.

## 15.1 Correct approach

AI orchestration should be implemented in a separate layer such as:

- `assistant-service`
- `orchestration-service`
- `macro-engine`
- `automation-runner`

## 15.2 Space Service gives AI

- social context
- organizer context
- group context
- saved object context
- user-facing action opportunities

## 15.3 AI layer gives Space UI

- reminders
- suggestions
- assisted actions
- automation prompts
- macro execution opportunities

Short formula:

> **Space Service is context provider. AI layer is assistance and execution logic.**

---

# 16. PRO Console and Backend Relationship

PRO Console must not be mistaken for an extension of Space Service.

It is a **separate operational UI contour** that aggregates multiple services.

## 16.1 PRO Console consumes

- Pulse Service
- Quest Service
- RF Service
- Moderation Service
- Analytics layer
- possibly Content / Blog-related services
- possibly Connect summary data

## 16.2 Space Service participates only in part

Space Service contributes:

- PRO-led groups
- PRO social profile projection
- PRO social presence
- PRO publication surfaces if needed

This means:

> **PRO Console is a multi-service operational workspace, not a screen over only Space Service.**

---

# 17. Clear Boundary Between Space UI, Space Service, and PRO Console

This must be explicitly protected in the architecture.

## 17.1 Space Asia UI
A user-facing module that combines:

- social life
- personal coordination
- ecosystem signals
- AI interaction surfaces

## 17.2 Space Service
A backend social-core service responsible for:

- posts
- reposts
- groups
- profile projections
- media attachments
- feed events

## 17.3 PRO Console
A separate operational UI contour aggregating multiple domain services.

This separation prevents architectural drift.

---

# 18. Recommended API Surface

Below is a reasonable first-step API surface.

## 18.1 Posts

- `POST /v1/space/posts`
- `GET /v1/space/posts/{id}`
- `PATCH /v1/space/posts/{id}`
- `DELETE /v1/space/posts/{id}`

## 18.2 Reposts

Either:

- `POST /v1/space/posts/{id}/repost`

or canonical repost creation via the create-post endpoint using repost target fields.

## 18.3 Groups

- `POST /v1/space/groups`
- `GET /v1/space/groups/{id}`
- `PATCH /v1/space/groups/{id}`
- `POST /v1/space/groups/{id}/join`
- `POST /v1/space/groups/{id}/leave`

## 18.4 Feed

- `GET /v1/space/feed/home`
- `GET /v1/space/feed/profile/{userId}`
- `GET /v1/space/feed/group/{groupId}`
- `GET /v1/space/feed/activity`

## 18.5 Media attach

- `POST /v1/space/posts/{id}/media`
- `DELETE /v1/space/posts/{id}/media/{mediaId}`

## 18.6 Profiles

- `GET /v1/space/profiles/{userId}`

## 18.7 Organizer (if organizer stays near Space in early phase)

- `GET /v1/space/organizer`
- `POST /v1/space/organizer/items`
- `PATCH /v1/space/organizer/items/{id}`
- `DELETE /v1/space/organizer/items/{id}`

---

# 19. Moderation and Anti-Abuse

Moderation and anti-abuse are mandatory from the first production step.

## 19.1 Post moderation lifecycle

Recommended statuses:

- `active`
- `flagged`
- `hidden`
- `deleted`

## 19.2 Anti-abuse controls

At minimum:

- max posts per hour
- max reposts per minute
- media attachment count limits
- text size limits

## 19.3 Internal moderation operations

Recommended internal/admin operations:

- flag post
- hide post
- restore post
- soft delete post

---

# 20. Indexing and Performance

Minimum recommended indexes:

## 20.1 `space_post`

- `(author_id, created_at desc)`
- `(group_id, created_at desc)`
- `(visibility, created_at desc)`
- `(repost_target_type, repost_target_id)`

## 20.2 `space_group_member`

- `(user_id)`
- `(group_id, user_id)` unique

## 20.3 Organizer indexes (if organizer remains near Space)

- `(user_id, due_at)`
- `(user_id, status)`
- `(linked_entity_type, linked_entity_id)` optionally

---

# 21. Practical Architectural Formula

The entire architecture can be summarized as follows:

> **Space Asia UI** is the user-facing center of social activity, personal coordination, and AI interaction.  
> **Space Service** is the backend social-core owning posts, reposts, groups, and social projections.  
> **Reactions / Points / Media / AI / Quest / Pulse / RF / Rielt / Connect** are neighboring domains that enrich Space UI but must not be absorbed by Space Service.

---

# 22. Most Important Conclusion

If reduced to the shortest possible architectural guidance:

## Space Service must be:
- central
- but not bloated

## Space Asia UI must be:
- rich
- but aggregating

## PRO Console must be:
- a separate operational contour
- not a reason to overload Space Service with foreign logic

That is the correct backend architecture direction for Space Asia.

---

# 23. Recommended Immediate Engineering Next Step

Cursor should use this document as a backend SSOT draft and proceed with the next implementation-level artifacts:

1. `docs/openapi/space.yaml`
2. `packages/db/src/schema/space.ts`
3. initial migration for Space-owned tables
4. `apps/space-service`
5. gateway wiring for `/v1/space/*`
6. optional early organizer schema only if explicitly approved as part of Space boundary

Only after those are defined should frontend mocks be progressively replaced with real contracts.

