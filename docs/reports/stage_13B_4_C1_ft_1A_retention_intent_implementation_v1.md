# Stage 13B.4-C1 — FT-1A Retention Intent Implementation

## Executive Summary

Stage 13B.4-C1 implements the first authorized Foundation Trio implementation slice: FT-1A Retention Intent.

Upstream authorization is accepted:

- Stage 13B.4-A: `AUTHORIZED_FOR_13B_4_B_ONLY`
- Stage 13B.4-B: `FOUNDATION_TRIO_PLANNING_COMPLETE`
- Stage 13B.4-C0: `FIRST_SLICE_AUTHORIZATION_RECOMMENDED`
- Authorization token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1A_RETENTION_INTENT_ONLY`

The implementation establishes a narrow runtime boundary:

- `save-for-myself` is no longer forced to mean `public/group repost`.
- The first post-transition primitive exists as `Private Repost Intent`.
- The implementation uses the existing `postType: repost` plus `visibility: private` shape as the minimal carrier.
- No DB schema, OpenAPI, SDK generation, group feed, activity projection, language rewrite, legacy taxonomy, Authorial Post, or Source Reference work was performed.

Runtime state after this slice:

- `stage_13B_4_C1_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_ONLY`
- `stage_13B_4_C1_ws1_closure_claimed: FALSE`
- `stage_13B_4_C1_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C1_bv_execution: NOT_AUTHORIZED`

## Current Retention Intent Inventory

Current pre-change runtime inventory found these save/repost conflation points:

- `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`
  - `toggleBookmark()` writes `reactionType: bookmark` through Reactions. This is a saved/bookmark primitive, not Private Repost.
  - `createRepostWithCommentary()` created `postType: repost` with `visibility: public`, so object retention and Space publication shared the same runtime path.
  - `shareToSpace()` treated any existing object repost from the profile feed as already published in Space.
  - Success and duplicate feedback still use publish/repost language. This is intentionally deferred to WS-7 and not changed in FT-1A.

- `apps/go2asia-pwa-shell/components/interaction/ShareToSpaceComposer.tsx`
  - The composer remains a repost/commentary UI surface.
  - It still says `Поделиться в Space`, `Комментарий к репосту`, and `Опубликовать в Space`.
  - No language-layer rewrite was made because WS-7 is forbidden in FT-1A.

- `apps/space-service/src/services/spaceService.ts`
  - `createPost()` is the unified write funnel for post and repost rows.
  - Before FT-1A, it accepted repost rows without an intent discriminator.
  - `repostPost()` remains a convenience API path for `space_post` reposts and still defaults to `visibility: public`.
  - `materializeOutgoingPostActivity()` and `materializeIncomingRepostActivity()` still treat repost rows as activity sources. Activity alignment is deferred.

- `apps/space-service/src/db/queries/space.ts`
  - `findActiveRepostByAuthorAndTarget()` dedupes active reposts by author and target without intent/visibility scope.
  - This remains unchanged because retention dedupe belongs to FT-1D.
  - Home/profile/group feed read models still classify repost-shaped rows broadly. Feed alignment is deferred.

- `apps/go2asia-pwa-shell/app/(public)/space/saved/SavedPostsPageClient.tsx`
  - Saved posts remain Reactions bookmarks.
  - Bookmark separation is FT-1E and was not implemented.

All active repost creation points identified:

- `POST /v1/space/posts` -> `createPost()`
- `POST /v1/space/posts/:id/repost` -> `repostPost()` -> `createPost()`
- `ContentActionRow.createRepostWithCommentary()` -> `POST /v1/space/posts`
- seed/import paths for demo data only

## Scope Boundary

In scope for FT-1A:

- Introduce a minimal runtime concept for distinguishing retention intent from propagation repost.
- Route the object-bound Share-to-Space write payload through the new Private Repost Intent helper.
- Persist object-bound retention rows with `visibility: private`.
- Classify repost write intent in Space Service without changing DB schema or OpenAPI.
- Add targeted test coverage proving a private repost retention row can be created.

Explicitly out of scope:

- FT-1B owner visibility model
- FT-1C private note model
- FT-1D retention dedupe
- FT-1E bookmark separation
- Authorial Post
- Source Reference
- Legacy taxonomy
- Legacy distinction
- WS-2 public/group repost elimination
- group feed alignment
- activity alignment
- language rewrite
- BV execution
- broad cleanup
- hiding repost UI as a false pass

## Runtime Changes

Implemented runtime changes:

- Added `apps/space-service/src/domain/retentionIntent.ts`.
  - Defines `RepostWriteIntent`.
  - Classifies `postType: repost` plus `visibility: private` as `private_repost_intent`.
  - Classifies other repost visibilities as `propagation_repost`.

- Updated `apps/space-service/src/services/spaceService.ts`.
  - `createPost()` now classifies repost write intent after normalizing `postType` and `visibility`.
  - Repost domain events now include `repostWriteIntent` when the created row is repost-shaped.
  - No activity materialization, dedupe, feed query, group semantics, DB schema, or OpenAPI changes were made.

- Added `apps/go2asia-pwa-shell/modules/space/retentionIntent.ts`.
  - Defines `PRIVATE_REPOST_INTENT_VISIBILITY`.
  - Builds the object-bound Private Repost Intent request with `postType: repost` and `visibility: private`.

- Updated `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`.
  - `createRepostWithCommentary()` now uses `buildPrivateRepostIntentRequest()`.
  - The previous hardcoded `visibility: public` payload was removed from this object-bound write path.
  - UI copy and composer behavior were not rewritten.

- Updated `apps/space-service/test/request.test.ts`.
  - Added a regression test proving `POST /v1/space/posts` accepts an object-bound repost retention intent with `visibility: private`.
  - The test verifies the response remains `postType: repost`, returns `visibility: private`, and inserts the private visibility value.

## Files Changed

Changed files for FT-1A:

- `apps/space-service/src/domain/retentionIntent.ts`
- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/test/request.test.ts`
- `apps/go2asia-pwa-shell/modules/space/retentionIntent.ts`
- `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`
- `docs/reports/stage_13B_4_C1_ft_1A_retention_intent_implementation_v1.md`

No changes were made to:

- `docs/openapi/space.yaml`
- generated SDK/types
- DB schema or migrations
- activity UI or activity projection semantics
- group feed queries or group feed UI
- profile publication counting
- saved/bookmark surfaces
- `ShareToSpaceComposer.tsx`
- legacy row handling

## Acceptance Criteria Review

- Retention intent exists as a separate runtime concept: PASS.
  - Implemented through `RepostWriteIntent`, service classification, and PWA request builder.

- Retention intent is no longer obliged to mean public repost or group repost: PASS.
  - Object-bound retention create now sends `visibility: private`.

- FT-1A logic does not create Authorial Post: PASS.
  - No `postType: post` authorial create path was added or changed.

- FT-1A logic does not create Source Reference: PASS.
  - No Source Reference field, rename, one-hop reference model, or source pointer contract was introduced.

- FT-1A logic does not perform legacy classification: PASS.
  - No legacy taxonomy, legacy migration, auto-conversion, or read classification was added.

- FT-1A logic does not perform activity alignment: PASS.
  - Existing activity materialization remains unchanged.
  - The report records activity as remaining debt rather than claiming WS-6 progress.

- FT-1A logic does not change group feed semantics: PASS.
  - `listGroupFeedPosts` and group feed UI were not touched.

- FT-1A logic does not change the language layer: PASS.
  - User-facing repost/publish copy remains unchanged and is documented as WS-7 debt.

- FT-1A does not claim WS-1 closure: PASS.
  - Runtime state is partial: `RUNTIME_PARTIAL_WS1_INTENT_ONLY`.

- FT-1A does not claim Foundation Trio closure: PASS.
  - WS-3 and WS-5 remain untouched.

## Runtime Drift Review

Observed drift after implementation:

- UI language still says publish/repost while the object-bound write now creates a private retention row.
  - This is expected because WS-7 language rewrite is forbidden in FT-1A.
  - It remains a known false-pass risk for later stages.

- `ShareToSpaceComposer` still accepts commentary text.
  - This is not treated as FT-1C private note implementation.
  - Private note semantics remain unimplemented.

- Deduplication still uses `findActiveRepostByAuthorAndTarget()` without visibility/intent scoping.
  - Existing public legacy repost rows can still block a private retention write for the same target.
  - This is FT-1D debt and was not fixed.

- Activity projection still sees repost-shaped rows through the existing materialization flow.
  - No activity alignment was claimed.
  - WS-6 / FT-1G remains open.

- The success link still points to `/space/feed?highlight=...`.
  - This is a downstream owner visibility / UX surface issue.
  - It is not counted as FT-1B completion.

- `repostPost()` still defaults to `visibility: public`.
  - WS-2 public/group repost elimination was not implemented.
  - This prevents FT-1A from being misread as public repost write blocking.

No hidden implementation of downstream workstreams was detected.

## Forbidden Scope Verification

Forbidden scope check:

- FT-1B owner visibility model: NOT IMPLEMENTED.
- FT-1C private note model: NOT IMPLEMENTED.
- FT-1D retention dedupe: NOT IMPLEMENTED.
- FT-1E bookmark separation: NOT IMPLEMENTED.
- WS-3 Authorial Post: NOT IMPLEMENTED.
- WS-3 Source Reference: NOT IMPLEMENTED.
- WS-5 legacy taxonomy: NOT IMPLEMENTED.
- WS-5 legacy distinction: NOT IMPLEMENTED.
- WS-2 public/group repost elimination: NOT IMPLEMENTED.
- Group feed alignment: NOT IMPLEMENTED.
- Activity alignment: NOT IMPLEMENTED.
- Language rewrite: NOT IMPLEMENTED.
- BV execution: NOT PERFORMED.
- Broad cleanup: NOT PERFORMED.
- Repost UI hiding: NOT PERFORMED.

Verification commands executed:

- `pnpm --filter @go2asia/space-service test -- request.test.ts`
  - Result: PASS, 29 tests passed.

- `pnpm --filter @go2asia/pwa-shell typecheck`
  - Result: PASS.

- `pnpm --filter @go2asia/space-service typecheck`
  - Result: PASS.

- IDE lint check on changed files
  - Result: PASS, no linter errors found.

## Remaining WS-1 Gaps

FT-1A does not close WS-1. Remaining WS-1 gaps:

- FT-1B: owner visibility and owner-only retention surfaces.
- FT-1C: private note model and private note editing semantics.
- FT-1D: retention-scoped dedupe that does not block future authorial/source-reference work.
- FT-1E: separation between Reactions bookmark and Private Repost.
- FT-1F / WS-5: legacy public/group repost distinction.
- FT-1G / WS-6: activity projection alignment for private retention.
- FT-1H: WS-1 rollup and proof that Private Repost runtime is closed.

Additional known debt:

- Existing public/group repost rows remain legacy-shaped but not classified.
- Profile publication surfaces can still count repost-shaped rows.
- Feed reason mapping still labels repost-shaped rows as `repost`.
- User-facing language remains pre-transition.

## Recommended Next Gate

Recommended next gate:

`FT_1B_OWNER_VISIBILITY_SLICE_AUTHORIZATION_GATE`

Reason:

- FT-1A created the intent boundary.
- The next unresolved risk is not retention intent itself, but owner visibility and user-facing owner-only surfaces.
- FT-1B must stay separate from FT-1C, FT-1D, FT-1E, WS-2, WS-3, and WS-5 to avoid false closure of WS-1 or Foundation Trio.

## Final Status

`FT_1A_IMPLEMENTATION_COMPLETE`
