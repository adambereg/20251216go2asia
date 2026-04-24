# Derived endpoint list (source-of-fact)

**Дата:** 2026-03-21  
**Назначение:** зафиксировать минимальный список endpoints, которые реально используются в коде (Gateway/SDK/FE) и должны быть покрыты OpenAPI SSOT.

## Источники

- Gateway routing: `apps/api-gateway/src/index.ts`
- Content routes: `apps/content-service/src/index.ts`
- Auth routes: `apps/auth-service/src/index.ts`
- Referral routes: `apps/referral-service/src/index.ts`
- SDK usage:
  - `packages/sdk/src/content.ts`
  - `packages/sdk/src/balance.ts`
  - `packages/sdk/src/transactions.ts`
  - `packages/sdk/src/referrals.ts`
  - `packages/sdk/src/guru.ts`
  - `packages/sdk/src/rielt.ts`

## User-facing (через Gateway)

### Users (Auth Service)
- `POST /v1/users/ensure`

### Content (Content Service)
- `GET /v1/content/_debug/db`
- `GET /v1/content/events`
- `GET /v1/content/events/{id}`
- `POST /v1/content/events/{id}/register`
- `GET /v1/content/countries`
- `GET /v1/content/cities?countryId=...`
- `GET /v1/content/places?cityId=...&limit=...`
- `GET /v1/content/places/{idOrSlug}`
- `GET /v1/content/articles`
- `GET /v1/content/articles/{slug}`

### Points (Points Service)
- `GET /v1/points/balance`
- `GET /v1/points/transactions?limit=...&cursor=...`

### Referral (Referral Service)
- `GET /v1/referral/code`
- `GET /v1/referral/stats`
- `GET /v1/referral/tree?depth=1|2`
- `GET /v1/referral/earnings`
- `POST /v1/referral/claim`

### Guru (Guru Service)
- `GET /v1/guru/nearby?lat=...&lng=...`
- `GET /v1/guru/nearby/{type}?lat=...&lng=...`
- `GET /v1/guru/what-to-do?lat=...&lng=...`

### Space (Space Service)
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

### Reactions (Reactions Service)
- `POST /v1/reactions`
- `DELETE /v1/reactions/{reactionId}`
- `GET /v1/reactions/summary/{targetType}/{targetId}`
- `POST /v1/reactions/summary:batch`

### Feed (Feed Service)
- `GET /v1/feed/home`
- `GET /v1/feed/group/{groupId}`
- `GET /v1/feed/profile/{userId}`
- `GET /v1/feed/activity`

### Quest (Quest Service)
- `GET /v1/quests`
- `POST /v1/quests`
- `GET /v1/quests/{questId}`
- `POST /v1/quests/{questId}/start`
- `GET /v1/quests/{questId}/progress`
- `POST /v1/quests/{questId}/steps`
- `POST /v1/quests/{questId}/publish`
- `POST /v1/quests/{questId}/steps/{stepId}/submit`
- `GET /v1/quests/{questId}/submissions`
- `POST /v1/submissions/{submissionId}/review`

### Rielt (Rielt Service)
- `GET /v1/rielt/listings`
- `GET /v1/rielt/listings/{idOrSlug}`
- `GET /v1/rielt/listings/nearby`
- `POST /v1/rielt/listings`
- `PATCH /v1/rielt/listings/{id}`
- `DELETE /v1/rielt/listings/{id}`
- `GET /v1/rielt/my/listings`
- `POST /v1/rielt/listings/{idOrSlug}/inquiries`
- `GET /v1/rielt/my/inquiries`

### RF (RF Service, runtime baseline)
- `GET /v1/rf/partners`
- `GET /v1/rf/partners/{partnerId}`
- `GET /v1/rf/offers`
- `GET /v1/rf/offers/{offerId}`
- `POST /v1/rf/business/partners`
- `POST /v1/rf/business/partners/{partnerId}/offers`
- `POST /v1/rf/business/partners/{partnerId}/offers/{offerId}/activate`
- `POST /v1/rf/offers/{offerId}/claim`
- `GET /v1/rf/me/vouchers`
- `GET /v1/rf/pro/links`
- `POST /v1/rf/pro/links`
- `POST /v1/rf/pro/links/{proLinkId}/accept`
- `POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem`

## Service-to-service (internal)

### Points
- `POST /internal/points/add`

### Referral
- `POST /internal/referral/generate-code`
- `POST /internal/referral/link`
- `POST /internal/referral/mark-first-login`



