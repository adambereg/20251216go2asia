# Space OpenAPI Outline v1

**Project:** Go2Asia  
**Module:** Space Asia  
**Service:** `space-service`  
**Document role:** Draft OpenAPI outline and engineering contract scaffold for future `docs/openapi/space.yaml`  
**Status:** Pre-spec outline for Cursor

---

# 1. Purpose

This document is a draft contract outline for the future OpenAPI specification of `space-service`.

It is not the final OpenAPI YAML.

Its purpose is to give Cursor a structured scaffold for building:

- `docs/openapi/space.yaml`
- generated SDK/types
- route contracts
- DTO schemas
- error handling conventions
- auth and authorization rules

This outline follows the current Space architecture decisions:

- Space Service owns the social publication core;
- reactions remain external;
- media lifecycle remains external;
- feed surfaces are part of the initial contract surface;
- organizer endpoints are optional and only included if organizer is explicitly approved inside the Space boundary in the early phase.

---

# 2. API Design Principles

## 2.1 Namespace

All Space endpoints must live under:

```text
/v1/space/*
```

Legacy `/api/space/*` paths must not be used as source of truth.

---

## 2.2 Contract role

The API should expose only what Space Service owns.

Do not add endpoints for:

- likes
- ratings
- reviews
- bookmarks
- questions
- contact requests
- thread replies
- Points balances
- NFT ownership
- referral trees
- voucher ownership
- quest progress ownership
- AI execution logic

These belong to other services.

---

## 2.3 OpenAPI-first discipline

The final YAML must:

- define schemas before implementation hardens;
- drive generated SDK/types;
- align with route behavior;
- be validated in CI;
- be stable enough for frontend adapters.

---

# 3. Proposed Endpoint Groups

Recommended path groups for the first iteration:

1. Posts
2. Reposts
3. Groups
4. Feed
5. Media Attach
6. Profiles
7. Organizer (optional)
8. Internal / Admin / Moderation (optional internal-only contract surface)

---

# 4. Posts

# 4.1 `POST /v1/space/posts`

## Purpose
Create a new Space post or repost.

## Auth
Required.

## Request body
`CreateSpacePostRequest`

## Success response
`201 Created`

Returns `SpacePostResponse`.

## Notes
This endpoint should support both:

- normal posts
- reposts

The repost type is controlled through:

- `postType = repost`
- `repostTargetType`
- `repostTargetId`

---

# 4.2 `GET /v1/space/posts/{postId}`

## Purpose
Get a single post by ID.

## Auth
Optional or required depending on visibility rules.

## Path params
- `postId`

## Success response
`200 OK`

Returns `SpacePostResponse`.

## Errors
- `404 Not Found`
- `403 Forbidden` if visibility rules deny access

---

# 4.3 `PATCH /v1/space/posts/{postId}`

## Purpose
Update editable fields of a post.

## Auth
Required.

## Path params
- `postId`

## Request body
`UpdateSpacePostRequest`

## Success response
`200 OK`

Returns updated `SpacePostResponse`.

## Notes
At minimum should allow updates of:

- `text`
- maybe `visibility`

Should not allow arbitrary target mutation of reposts after creation.

---

# 4.4 `DELETE /v1/space/posts/{postId}`

## Purpose
Soft-delete a post.

## Auth
Required.

## Path params
- `postId`

## Success response
`204 No Content`

## Notes
Prefer soft-delete semantics in backend.

---

# 5. Reposts

There are two valid approaches.

## Approach A
Use `POST /v1/space/posts` for both normal posts and reposts.

## Approach B
Expose a dedicated repost endpoint in addition.

Recommended draft support for Cursor:

---

# 5.1 `POST /v1/space/posts/{postId}/repost`

## Purpose
Create a repost of an existing Space post.

## Auth
Required.

## Path params
- `postId`

## Request body
`CreateSpaceRepostRequest`

## Success response
`201 Created`

Returns `SpacePostResponse`.

## Notes
This is convenience UX API only.

Cross-module reposts should still be supported via canonical create-post endpoint.

---

# 6. Groups

## 6.0 V1 taxonomy contract rule

In v1, group taxonomy is a product-level canon and does not require a mandatory schema-level `group_type` field.

`quest` / `event` / `PRO-led` group semantics may initially be represented through policy, metadata, and read-model semantics rather than canonical DB typing.

If a canonical `group_type` field is introduced later, it must be a deliberate post-v1 architecture decision and not an implicit frontend-only contract.

# 6.1 `POST /v1/space/groups`

## Purpose
Create a new Space group.

## Auth
Required.

## Policy note
Early-phase creation may be restricted by policy (admin + approved PRO), even when endpoint auth is valid.

The contract should allow business-rule responses for policy denial.

## Request body
`CreateSpaceGroupRequest`

## Success response
`201 Created`

Returns `SpaceGroupResponse`.

## Boundary note
PRO-led groups are still Space social-layer groups.  
Operational administration through PRO Console does not transfer group ownership from Space Service.

---

# 6.2 `GET /v1/space/groups/{groupId}`

## Purpose
Get a group by ID.

## Auth
Optional or required depending on group visibility.

## Path params
- `groupId`

## Success response
`200 OK`

Returns `SpaceGroupResponse`.

---

# 6.3 `PATCH /v1/space/groups/{groupId}`

## Purpose
Update editable fields of a group.

## Auth
Required.

## Path params
- `groupId`

## Request body
`UpdateSpaceGroupRequest`

## Success response
`200 OK`

Returns updated `SpaceGroupResponse`.

---

# 6.4 `POST /v1/space/groups/{groupId}/join`

## Purpose
Join a group.

## Auth
Required.

## Path params
- `groupId`

## Success response
`200 OK`

Returns `SpaceGroupMembershipResponse`.

## Notes
For `invite_only` groups this may instead create `pending` membership or return a business-rule error.

---

# 6.5 `POST /v1/space/groups/{groupId}/leave`

## Purpose
Leave a group.

## Auth
Required.

## Path params
- `groupId`

## Success response
`200 OK` or `204 No Content`

---

# 6.6 Group publication semantics (contract-level notes)

For posts published into groups:

- `groupId` identifies the social container context;
- `visibility = group` is the canonical in-group publication visibility;
- group feed delivery is projection behavior, not group identity.

Private-to-group sharing is allowed in v1 only by explicit user action (for example `share to group` / `publish to group` / `repost into group`) and must not occur automatically.

These are policy/semantic rules and do not require mandatory `group_type` schema expansion in v1.

---

# 7. Feed

# 7.1 `GET /v1/space/feed/home`

## Purpose
Get the home feed of the current user.

## Auth
Required.

## Query params
- `cursor` optional
- `limit` optional

## Success response
`200 OK`

Returns `SpaceFeedResponse`.

---

# 7.2 `GET /v1/space/feed/profile/{userId}`

## Purpose
Get posts authored by a given user.

## Auth
Optional or required depending on visibility.

## Path params
- `userId`

## Query params
- `cursor` optional
- `limit` optional

## Success response
`200 OK`

Returns `SpaceFeedResponse`.

---

# 7.3 `GET /v1/space/feed/group/{groupId}`

## Purpose
Get feed items for a given group.

## Auth
Depends on group visibility.

## Path params
- `groupId`

## Query params
- `cursor` optional
- `limit` optional

## Success response
`200 OK`

Returns `SpaceFeedResponse`.

---

# 7.4 `GET /v1/space/feed/activity`

## Purpose
Get the activity feed surface for the current user.

## Auth
Required.

## Query params
- `cursor` optional
- `limit` optional

## Success response
`200 OK`

Returns `SpaceActivityFeedResponse`.

## Notes
If activity feed is not fully implemented in v1, this can initially return a reduced model.

---

# 8. Media Attach

# 8.1 `POST /v1/space/posts/{postId}/media`

## Purpose
Attach a media asset already created in `media-service` to a post.

## Auth
Required.

## Path params
- `postId`

## Request body
`AttachSpacePostMediaRequest`

## Success response
`200 OK`

Returns updated `SpacePostResponse` or `SpacePostMediaAttachmentResponse`.

## Notes
This endpoint does not upload files. It only attaches `mediaId` to a post.

---

# 8.2 `DELETE /v1/space/posts/{postId}/media/{mediaId}`

## Purpose
Remove media attachment relation from a post.

## Auth
Required.

## Path params
- `postId`
- `mediaId`

## Success response
`204 No Content`

---

# 9. Profiles

# 9.1 `GET /v1/space/profiles/{userId}`

## Purpose
Get a Space profile projection for a user.

## Auth
Optional or required depending on visibility policy.

## Path params
- `userId`

## Success response
`200 OK`

Returns `SpaceProfileResponse`.

## Notes
This is not the full identity profile. It is the social projection.

---

# 10. Organizer (Optional)

These endpoints should only be included if organizer is explicitly approved inside the early Space boundary.

---

# 10.1 `GET /v1/space/organizer`

## Purpose
Get organizer items for the current user.

## Auth
Required.

## Query params
- `status` optional
- `type` optional
- `cursor` optional
- `limit` optional

## Success response
`200 OK`

Returns `SpaceOrganizerResponse`.

---

# 10.2 `POST /v1/space/organizer/items`

## Purpose
Create an organizer item.

## Auth
Required.

## Request body
`CreateSpaceOrganizerItemRequest`

## Success response
`201 Created`

Returns `SpaceOrganizerItemResponse`.

---

# 10.3 `PATCH /v1/space/organizer/items/{itemId}`

## Purpose
Update organizer item fields.

## Auth
Required.

## Path params
- `itemId`

## Request body
`UpdateSpaceOrganizerItemRequest`

## Success response
`200 OK`

Returns updated `SpaceOrganizerItemResponse`.

---

# 10.4 `DELETE /v1/space/organizer/items/{itemId}`

## Purpose
Delete or cancel organizer item.

## Auth
Required.

## Path params
- `itemId`

## Success response
`204 No Content`

---

# 11. Internal / Admin / Moderation (Optional Internal Surface)

These routes may be internal-only and not exposed to public SDK.

---

# 11.1 `POST /v1/space/internal/posts/{postId}/flag`

## Purpose
Flag a post for moderation.

## Auth
Internal/admin.

---

# 11.2 `POST /v1/space/internal/posts/{postId}/hide`

## Purpose
Hide a post.

## Auth
Internal/admin.

---

# 11.3 `POST /v1/space/internal/posts/{postId}/restore`

## Purpose
Restore a hidden/flagged post.

## Auth
Internal/admin.

---

# 12. Proposed Schema Components

Recommended OpenAPI schema component groups:

1. Enums
2. Common response wrappers
3. Post schemas
4. Group schemas
5. Profile schemas
6. Feed schemas
7. Media attach schemas
8. Organizer schemas (optional)
9. Error schemas
10. Pagination schemas

---

# 13. Enums

Recommended enum schemas:

## 13.1 `SpacePostType`

- `post`
- `repost`
- `system`

## 13.2 `SpaceVisibility`

- `public`
- `followers`
- `group`
- `private`

## 13.3 `SpacePostStatus`

- `active`
- `flagged`
- `hidden`
- `deleted`

## 13.4 `SpaceRepostTargetType`

- `space_post`
- `blog_post`
- `place`
- `event`
- `partner`
- `listing`
- `quest`

## 13.5 `SpaceGroupVisibility`

- `public`
- `private`
- `invite_only`

## 13.6 `SpaceGroupStatus`

- `active`
- `hidden`
- `archived`

## 13.7 `SpaceGroupMemberRole`

- `member`
- `moderator`
- `owner`

## 13.8 `SpaceGroupMemberStatus`

- `active`
- `pending`
- `removed`
- `blocked`

## 13.9 `SpaceFeedReason`

- `author_post`
- `group_post`
- `repost`
- `system`
- `recommended`

## 13.10 `SpaceOrganizerItemType` (optional)

- `trip`
- `reminder`
- `saved_action`
- `application`
- `growth_goal`
- `follow_up`

## 13.11 `SpaceOrganizerItemStatus` (optional)

- `planned`
- `pending`
- `completed`
- `cancelled`
- `expired`

## 13.12 `SpaceOrganizerCreatedBy` (optional)

- `user`
- `system`
- `ai`

## 13.13 `SpaceOrganizerExecutionMode` (optional)

- `manual`
- `assisted`
- `automated`

---

# 14. Common Schema Building Blocks

## 14.1 `CursorPagination`

Recommended shape:

```json
{
  "nextCursor": "string | null"
}
```

## 14.2 `SpaceAuthorProjection`

Fields:

- `userId`
- `displayName`
- `avatarUrl` nullable
- `roleLabel` nullable

## 14.3 `SpaceResolvedRepostPreview`

Fields:

- `title`
- `subtitle` nullable
- `imageUrl` nullable
- `href` nullable

---

# 15. Post Schemas

## 15.1 `CreateSpacePostRequest`

Fields:

- `postType`
- `visibility`
- `text` nullable
- `groupId` nullable
- `repostTargetType` nullable
- `repostTargetId` nullable

### Notes
Validation rules:

- if `postType = repost`, repost target fields are required
- if `visibility = group`, `groupId` is required

---

## 15.2 `UpdateSpacePostRequest`

Fields:

- `text` nullable
- `visibility` optional

Keep update semantics intentionally narrow in v1.

---

## 15.3 `CreateSpaceRepostRequest`

Fields:

- `visibility`
- `text` nullable
- `groupId` nullable

This schema is only needed if convenience repost endpoint is kept.

---

## 15.4 `SpacePostMediaAttachment`

Fields:

- `mediaId`
- `sortOrder`

---

## 15.5 `SpacePostRepostRef`

Fields:

- `targetType`
- `targetId`
- `resolvedPreview` nullable

---

## 15.6 `SpacePostResponse`

Fields:

- `id`
- `author`
- `groupId` nullable
- `postType`
- `visibility`
- `text` nullable
- `status`
- `repost` nullable
- `media`
- `createdAt`
- `updatedAt`
- `publishedAt`

---

# 16. Group Schemas

## 16.1 `CreateSpaceGroupRequest`

Fields:

- `slug`
- `title`
- `description` nullable
- `visibility`

---

## 16.2 `UpdateSpaceGroupRequest`

Fields:

- `title` optional
- `description` optional
- `visibility` optional
- `status` optional

---

## 16.3 `SpaceGroupResponse`

Fields:

- `id`
- `slug`
- `title`
- `description` nullable
- `ownerId`
- `visibility`
- `status`
- `membersCount`
- `createdAt`
- `updatedAt`

---

## 16.4 `SpaceGroupMembershipResponse`

Fields:

- `groupId`
- `userId`
- `role`
- `status`
- `joinedAt`

---

# 17. Feed Schemas

## 17.1 `SpaceFeedItem`

Fields:

- `id`
- `reason`
- `post`
- `createdAt`

---

## 17.2 `SpaceFeedResponse`

Fields:

- `items`
- `nextCursor` nullable

---

## 17.3 `SpaceActivityFeedItem`

This can begin as a reduced projection.

Fields:

- `id`
- `type`
- `title`
- `description` nullable
- `createdAt`
- `relatedPostId` nullable
- `relatedEntityType` nullable
- `relatedEntityId` nullable

---

## 17.4 `SpaceActivityFeedResponse`

Fields:

- `items`
- `nextCursor` nullable

---

# 18. Profile Schemas

## 18.1 `SpaceProfileResponse`

Fields:

- `userId`
- `displayName`
- `avatarUrl` nullable
- `roleLabel` nullable
- `countryId` nullable
- `cityId` nullable
- `bioShort` nullable

Optional future enrichments:

- `postsCount`
- `groupsCount`
- `followersCount` if that domain exists elsewhere

---

# 19. Media Schemas

## 19.1 `AttachSpacePostMediaRequest`

Fields:

- `mediaId`
- `sortOrder` optional

## 19.2 `SpacePostMediaAttachmentResponse`

Fields:

- `postId`
- `mediaId`
- `sortOrder`
- `attachedAt`

---

# 20. Organizer Schemas (Optional)

## 20.1 `CreateSpaceOrganizerItemRequest`

Fields:

- `type`
- `title`
- `description` nullable
- `sourceModule`
- `linkedEntityType` nullable
- `linkedEntityId` nullable
- `status`
- `priority`
- `dueAt` nullable
- `remindAt` nullable
- `createdBy`
- `executionMode`
- `canBeAutomated`
- `requiresConfirmation`

---

## 20.2 `UpdateSpaceOrganizerItemRequest`

Fields:

- `title` optional
- `description` optional
- `status` optional
- `priority` optional
- `dueAt` optional
- `remindAt` optional
- `executionMode` optional
- `canBeAutomated` optional
- `requiresConfirmation` optional

---

## 20.3 `SpaceOrganizerItemResponse`

Fields:

- `id`
- `userId`
- `type`
- `title`
- `description` nullable
- `sourceModule`
- `linkedEntityType` nullable
- `linkedEntityId` nullable
- `status`
- `priority`
- `dueAt` nullable
- `remindAt` nullable
- `createdBy`
- `executionMode`
- `canBeAutomated`
- `requiresConfirmation`
- `createdAt`
- `updatedAt`

---

## 20.4 `SpaceOrganizerResponse`

Fields:

- `items`
- `nextCursor` nullable

---

# 21. Error Model

Recommended reusable error schema group.

## 21.1 `ApiErrorResponse`

Recommended shape:

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Human readable message"
  },
  "requestId": "uuid-or-string"
}
```

## 21.2 Common error codes to prepare for

- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `GROUP_ACCESS_DENIED`
- `POST_EDIT_NOT_ALLOWED`
- `POST_DELETE_NOT_ALLOWED`
- `GROUP_JOIN_NOT_ALLOWED`
- `MEDIA_ATTACH_NOT_ALLOWED`
- `REPOST_TARGET_INVALID`
- `RATE_LIMITED`
- `ROUTE_RESERVED_NOT_ENABLED` (gateway-level pattern if relevant)

---

# 22. Auth Rules Outline

## 22.1 Public / anonymous access candidates

Possible anonymous access:

- public post read
- public group read
- public profile projection read

## 22.2 Auth-required endpoints

Must require auth:

- create post
- update/delete own post
- create group
- join/leave group
- home feed
- activity feed
- organizer endpoints
- media attach endpoints

## 22.3 Ownership rules

At contract level document at least these rules:

- only author or privileged moderator may edit/delete a post
- only owner/moderator may update some group fields
- group feed access depends on group visibility and membership
- organizer is private to the current user
- group creation may be policy-restricted in early phase
- private-to-group transition requires explicit user action

---

# 23. Rate Limit Notes

These may live outside the OpenAPI schema itself, but should be documented near it.

Recommended v1 throttling concepts:

- posts per hour
- reposts per minute
- media attachments per post

If represented in API behavior, document possible `429 Too Many Requests` responses.

---

# 24. Event Reference Appendix (for spec comments / docs)

The OpenAPI file may not fully define async events, but the surrounding documentation should reference them.

Core events:

- `space.post.created`
- `space.post.updated`
- `space.post.deleted`
- `space.post.reposted`
- `space.group.created`
- `space.group.member_joined`
- `space.group.member_left`
- `space.post.media_attached`

---

# 25. Recommended Path Order in Final OpenAPI YAML

When Cursor creates `docs/openapi/space.yaml`, recommended path order:

1. `/v1/space/posts`
2. `/v1/space/posts/{postId}`
3. `/v1/space/posts/{postId}/repost`
4. `/v1/space/posts/{postId}/media`
5. `/v1/space/posts/{postId}/media/{mediaId}`
6. `/v1/space/groups`
7. `/v1/space/groups/{groupId}`
8. `/v1/space/groups/{groupId}/join`
9. `/v1/space/groups/{groupId}/leave`
10. `/v1/space/feed/home`
11. `/v1/space/feed/profile/{userId}`
12. `/v1/space/feed/group/{groupId}`
13. `/v1/space/feed/activity`
14. `/v1/space/profiles/{userId}`
15. organizer paths if included
16. internal/admin paths only if intentionally documented

---

# 26. Cursor Implementation Notes

Cursor should use this file as the drafting scaffold for:

- `docs/openapi/space.yaml`
- schema naming decisions
- enum naming alignment
- DTO generation planning
- route handler scaffolding

Recommended next implementation sequence:

1. approve whether organizer stays inside early Space boundary;
2. build `docs/openapi/space.yaml` from this outline;
3. generate types / SDK;
4. implement `packages/db/src/schema/space.ts`;
5. build migrations;
6. scaffold `apps/space-service`;
7. wire gateway.

---

# 27. Final Summary

This outline is intentionally not the final OpenAPI file.

It is the engineering bridge between:

- architecture docs;
- domain model docs;
- implementation in code.

Short formula:

> **Space OpenAPI v1 should expose only the social-core contract surface, keep organizer optional and explicit, and leave reactions/media/points/AI ownership outside the Space service boundary.**

