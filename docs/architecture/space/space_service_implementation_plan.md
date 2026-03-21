# Space Service Implementation Plan

Статус: Phase 1 architecture confirmation for Step 4

Status rubric:
- **Current runtime reality:** `space-service` is the social publication contour in current execution.
- **Current Step 4 target:** deliver bounded social core endpoints, including basic feed API surfaces, without taking ownership of full feed ranking/state domain.
- **Future extraction target:** move feed composition/ranking/state into dedicated `feed-service` when operationally justified.

Основание:

- `docs/plans/go2asia_next_steps_plan_2026_march_10.md`
- `docs/architecture/space/space_service_production_architecture_v_1.md`
- `docs/architecture/space/space_backend_architecture_v_1.md`
- `docs/architecture/space/space_domain_model_v_1.md`
- `docs/architecture/space/space_openapi_outline_v_1.md`
- `docs/architecture/space/space_dependency_map_v_1.md`

---

## 1. Architecture Verdict

`space-service` approved for implementation as the social core of Go2Asia with a strict bounded scope.

Space owns only:

- posts
- reposts
- groups
- group membership
- profile projections for social rendering
- post-media attachment relations
- feed API surfaces (delivery contour only; not ownership of full feed domain state/ranking)
- publication lifecycle and publication events

Space does not own:

- reactions
- points / balances / rewards calculation
- organizer / planner domain logic
- AI orchestration
- quest workflows
- RF / partner workflows
- PRO console logic
- media storage lifecycle

Additional Step 4 implementation rules:

- canonical post types remain `post | repost | system`
- canonical visibility remains `public | followers | group | private`
- legacy `friends` terminology is not allowed
- repost target types remain `space_post | blog_post | place | event | partner | listing | quest`
- feed starts as chronological + basic filtering
- feed stays extraction-ready for future dedicated `feed-service`

---

## 2. Scope Freeze For Step 4

Included in this step:

- create/read/delete posts
- repost creation
- create/read/join/leave groups
- group membership status and roles
- attach/detach media references
- profile projection reads
- home/profile/group/activity feed endpoints

Explicitly excluded from this step:

- reactions and any interaction model
- points reward calculation
- organizer entities and organizer API
- moderation UI flows beyond minimal internal-ready state model
- search
- ML ranking
- synchronous fanout feed writes

Important clarification:

`activity feed` is allowed in reduced form for v1 and must not pull foreign domain ownership into Space.

---

## 3. Canonical DB Schema

Step 4 baseline tables:

1. `space_post`
2. `space_group`
3. `space_group_member`
4. `space_post_media`
5. `space_profile_projection`

Not included in baseline:

- `space_feed_item`
- `space_organizer_item`

Reason:

- `space_feed_item` is optional and not required for simple on-read feed delivery
- `space_organizer_item` is outside the approved Step 4 boundary

### 3.1 Enum set

- `space_post_type`: `post | repost | system`
- `space_post_visibility`: `public | followers | group | private`
- `space_post_status`: `active | flagged | hidden | deleted`
- `space_repost_target_type`: `space_post | blog_post | place | event | partner | listing | quest`
- `space_group_visibility`: `public | private | invite_only`
- `space_group_status`: `active | hidden | archived`
- `space_group_member_role`: `member | moderator | owner`
- `space_group_member_status`: `active | pending | removed | blocked`

### 3.2 Storage conventions

Repo convention wins over illustrative SQL in docs:

- primary keys use `text`
- service-generated prefixed IDs are allowed
- external domain references remain plain text refs, not cross-service foreign keys

### 3.3 Required constraints

- repost target fields must be either both null or both populated
- `post_type = repost` requires repost target fields
- `visibility = group` requires `group_id`
- `space_group_member` uniqueness on `(group_id, user_id)`
- `space_post_media` uniqueness on `(post_id, media_id)`

### 3.4 Required indexes

- `space_post(author_id, published_at desc, id desc)`
- `space_post(group_id, published_at desc, id desc)`
- `space_post(status, published_at desc, id desc)`
- `space_post(repost_target_type, repost_target_id)`
- `space_group_member(user_id, status)`
- `space_post_media(post_id, sort_order)`

---

## 4. Service Boundary And Internal Structure

Recommended repository structure:

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
        mediaAttachmentService.ts
      events/
        publisher.ts
        contracts.ts
      db/
        queries/
        mappers/
      middleware/
        auth.ts
        http.ts
      index.ts
```

Boundary rules:

- `routes/*` only parse HTTP and shape responses
- `services/*` own business rules
- `db/queries/*` own SQL access
- `events/*` define event contracts and publisher interface
- `middleware/auth.ts` trusts only gateway-issued auth

---

## 5. Minimal API Surface For Initial Delivery

Public/user-facing endpoints:

- `POST /v1/space/posts`
- `GET /v1/space/posts/{postId}`
- `DELETE /v1/space/posts/{postId}`
- `POST /v1/space/posts/{postId}/repost`
- `POST /v1/space/posts/{postId}/media`
- `DELETE /v1/space/posts/{postId}/media/{mediaId}`
- `POST /v1/space/groups`
- `GET /v1/space/groups/{groupId}`
- `POST /v1/space/groups/{groupId}/join`
- `POST /v1/space/groups/{groupId}/leave`
- `GET /v1/space/feed/home`
- `GET /v1/space/feed/profile/{userId}`
- `GET /v1/space/feed/group/{groupId}`
- `GET /v1/space/feed/activity`
- `GET /v1/space/profiles/{userId}`

Deferred from initial implementation:

- `PATCH /v1/space/posts/{postId}`
- `PATCH /v1/space/groups/{groupId}`
- organizer endpoints
- moderation endpoints as public contract

---

## 6. Feed Delivery Plan

V1 feed implementation model:

- no `space_feed_item` table
- no synchronous fanout
- on-read feed assembly from `space_post` plus `space_group_member`

Feed rules for v1:

1. chronological ordering by `published_at desc, id desc`
2. visibility filtering
3. membership filtering for group posts
4. optional lightweight handling of `system` posts

Feed surfaces:

- home feed
- profile feed
- group feed
- reduced activity feed

`followers` visibility remains in schema and API, but product behavior must stay conservative until a follow graph exists.

---

## 7. Media Integration Plan

Space must integrate with `media-service` only by reference.

Flow:

1. frontend uploads through `media-service`
2. frontend receives `mediaId`
3. frontend calls `space-service` attach endpoint
4. `space-service` stores relation in `space_post_media`

Space does not:

- upload files
- generate variants
- store media binaries

---

## 8. Event Plan

V1 event contracts:

- `space.post.created`
- `space.post.deleted`
- `space.post.reposted`
- `space.group.created`
- `space.group.member_joined`
- `space.group.member_left`
- `space.post.media_attached`
- `space.post.media_detached`

Implementation note:

Create a publisher interface now, even if the first transport is a no-op or stubbed publisher.

---

## 9. Migration Sequence

### Phase 1

- add `docs/openapi/space.yaml`
- include it in OpenAPI bundling

### Phase 2

- add `packages/db/src/schema/space.ts`
- export schema from `packages/db/src/schema/index.ts`
- add first SQL migration for Space tables and enums

### Phase 3

- scaffold `apps/space-service`
- implement health/ready/version
- implement auth helper based on gateway-origin trust

### Phase 4

- implement post/group/media/profile/feed routes
- add direct worker tests

### Phase 5

- activate gateway auth handling for protected `/v1/space/*` routes
- add gateway proxy and auth tests

### Phase 6

- verify lint/tests
- keep frontend mocks untouched until backend contract is stable

---

## 10. Risks And Guardrails

Main risks:

- accidentally pulling reactions into Space
- accidentally modeling Space from old UI mock types
- making media attach behave like media upload
- making activity feed depend on foreign domain ownership
- introducing organizer scope before explicit approval

Guardrails:

- no code based on `docs/modules/space/*`
- no `space_feed_item` unless direct queries prove insufficient
- no cross-service direct DB writes
- no foreign domain FK ownership inside Space
- when unclear whether logic belongs to Space, keep it outside and ask first

---

## 11. Implementation Formula

Shortest approved delivery formula:

> `space-service = posts + reposts + groups + group membership + profile projections + media references + simple feeds`

