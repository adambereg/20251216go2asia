# Stage 13B.2-B - Repost Commentary Edit / Upgrade Flow

## Scope

Stage 13B.2-B closes the Track A UX gap from 13B.2-A: user can upgrade an existing repost by editing only repost `text` (commentary) without creating a new repost object.

Bounded rules preserved:

- same `space_post` object is reused;
- dedupe policy remains unchanged;
- no new social taxonomy, no comments/replies, no rewards, no Connect writes.

## Backend contract

### New endpoint

- `PATCH /v1/space/posts/{postId}`
- operation: `updateSpaceRepostCommentary`

### Request semantics

- request body: `UpdateRepostCommentaryRequest`
  - `text: string | null` (required field in payload shape)
  - whitespace text is normalized to `null`

### Validation and ownership rules

Backend enforces:

1. only `text` field is accepted in PATCH body;
2. post must exist and be active;
3. requester must be post author;
4. editable post type is only `repost`;
5. target binding is immutable (`repostTargetType` / `repostTargetId` are not editable);
6. visibility, author, ownership semantics are not editable via this route.

### Response

- `200` with updated `SpacePostResponse`
- `400/401/403/404/500/503` per bounded validation/access/runtime failures

## Backend implementation changes

- `apps/space-service/src/routes/posts.ts`
  - added PATCH route handling for `/v1/space/posts/{postId}`
- `apps/space-service/src/services/spaceService.ts`
  - added `updateRepostCommentary(...)`
- `apps/space-service/src/db/queries/space.ts`
  - added `updateRepostTextByAuthor(...)`
- `docs/openapi/space.yaml`
  - added PATCH operation and `UpdateRepostCommentaryRequest` schema
- generated artifacts refreshed:
  - `docs/openapi/openapi.bundle.yaml`
  - `packages/sdk/src/generated/*`
  - `packages/types/src/generated/*`
  - `sdk/go2AsiaPlatformAPI.ts`
  - `types/go2AsiaPlatformAPI.ts`

## Frontend changes

### Repost upgrade UI on feed cards

Updated `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`:

- for own repost cards, added bounded commentary editor block;
- scenario A: repost-only -> button **"Добавить комментарий"**;
- scenario B: repost-with-commentary -> button **"Редактировать комментарий"**;
- save executes `PATCH /v1/space/posts/{postId}` with `text`;
- clearing text and saving is supported (optional scenario C), leaving repost as repost-only;
- success/error inline feedback shown per card.

### Feed wiring

Updated `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedSurface.tsx`:

- passes `currentUserId` into `SpaceFeedCard` so edit controls are shown only for author-owned reposts.

## Edit semantics

Edit flow updates only repost commentary:

- no new repost is created on edit;
- repost target reference remains identical;
- existing repost card updates in place after successful PATCH response.

This closes the 13B.2-A dead-end where 409 dedupe blocked second repost creation for commentary upgrades.

## Ownership and boundary verification

- Reactions still owns only `like` and `bookmark` facts.
- Space still owns repost propagation/feed/activity projection.
- Activity remains projection-only (no new activity mutation semantics introduced).
- Connect remains projection-only.
- No points/reward/economy integration.
- No comments/discuss/replies/quote taxonomy expansion.

## Dedupe verification

No dedupe logic was modified:

- still one active repost per `(authorId, repostTargetType, repostTargetId)`;
- edit path is non-create and therefore does not alter dedupe rules.

## QA

Executed checks:

- `pnpm -C apps/space-service typecheck` -> pass
- `pnpm -C apps/space-service lint` -> pass
- `pnpm -C apps/space-service test` -> pass (including new PATCH tests)
- `pnpm -C apps/go2asia-pwa-shell typecheck` -> pass
- `pnpm -C apps/go2asia-pwa-shell lint` -> pass with existing warnings baseline (`212` warnings, `0` errors)
- `pnpm -C apps/go2asia-pwa-shell test` -> fails due pre-existing unrelated RF tests (`4` failed files / `5` failed tests)

## Known limitations

- Commentary edit controls are currently surfaced in feed card context; no separate dedicated repost edit page was introduced.
- Activity copy/projection was intentionally not extended to include commentary edit events.
- Highlight/navigation polish remains deferred to next slice.

## Next recommended step

Proceed with Stage 13B.2-C:

- feed highlight behavior
- repost navigation polish
- no boundary expansion into economy or comment systems.

## Status tokens

stage_13B_2_B_status: COMPLETE_AS_BOUNDED_REPOST_COMMENTARY_EDIT_FLOW
stage_13B_2_B_track: TRACK_A_REPOST_COMMENTARY_COMPOSER
stage_13B_2_B_repost_upgrade_runtime: TRUE
stage_13B_2_B_new_repost_created_on_edit: FALSE
stage_13B_2_B_dedupe_policy_changed: FALSE
stage_13B_2_B_economy_integration: FALSE
stage_13B_2_B_points_rewards: FALSE
stage_13B_2_B_taxonomy_expansion: FALSE
stage_13B_2_B_next_recommended_step: STAGE_13B_2_C_FEED_HIGHLIGHT_AND_REPOST_NAVIGATION_POLISH
