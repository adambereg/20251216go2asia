# Stage 13B.2-A - Repost Commentary Composer

## Scope and objective

Stage 13B.2-A implements Track A as a bounded runtime slice: replace instant share-to-Space with repost composer flow that allows optional commentary text on repost.

The implementation preserves frozen boundaries from 13B.1:

- Reactions remains owner-fact only for `like` / `bookmark`.
- Space remains owner for repost propagation and feed/activity projection.
- No economy, points rewards, notifications, comments/discuss, moderation, or taxonomy expansion.

## What changed

### 1) New runtime repost composer

Added `apps/go2asia-pwa-shell/components/interaction/ShareToSpaceComposer.tsx`.

This component:

- opens as runtime modal from content action flow;
- shows source target preview (hydrated for pilot targets via existing `hydratePilotRepostPreview`);
- provides optional textarea (`maxLength=5000`);
- trims text before submit;
- sends `null` for empty/whitespace commentary.

No legacy mock composer surfaces were reused.

### 2) ContentActionRow switched to composer flow

Updated `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`.

Changes:

- Share action no longer performs immediate repost create.
- Share opens `ShareToSpaceComposer`.
- Composer submit creates repost through runtime API with optional `text`.
- Existing dedupe handling is preserved:
  - pre-check via profile feed scan;
  - server `409` / `REPOST_ALREADY_EXISTS` handling with already-in-Space UI state.
- Existing like/bookmark runtime behavior remains unchanged.

Pilot target typing now allows `space_post` in the bounded action type union where runtime-safe.

### 3) Feed rendering polish for repost commentary

Updated `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`.

Rendering now distinguishes practical cases without new taxonomy:

- normal post (`!repost`) -> existing text/placeholder behavior;
- repost-only (`repost` + empty text) -> repost preview block without misleading "Публикация без текста";
- repost-with-commentary (`repost` + non-empty text) -> commentary text above repost preview.

This keeps repost-with-commentary visually distinct from standalone post while preserving current card structure.

### 4) Repost CTA coverage for `space_post`

Updated:

- `apps/go2asia-pwa-shell/components/space/runtime/repostPreview.ts`
- `apps/go2asia-pwa-shell/components/space/runtime/utils.ts`

Changes:

- CTA label for `space_post` added: `Открыть пост Space`.
- Reference href resolution for `space_post` added via `/space/feed?highlight=<postId>`.

## Canonical write path used

The slice uses existing Space-owned runtime write path only:

- `POST /v1/space/posts`
- payload:
  - `postType: 'repost'`
  - `visibility: 'public'` (default in this bounded v1)
  - `repostTargetType`
  - `repostTargetId`
  - `text: string | null` (commentary)

No new `commentary` field. No new `quote` post type.

## Duplicate repost handling

Duplicate handling remains hybrid and bounded:

1. Client pre-check: existing repost search in profile feed.
2. Server authority: `409 REPOST_ALREADY_EXISTS` with `existingPostId`.

UI outcome:

- no duplicate create;
- info state shown (`Уже в Space` / already reposted);
- link to existing item in feed via `highlight`.

## Repost-with-commentary display behavior

After create:

- feed card can display user commentary text;
- repost preview block remains visible below;
- CTA routes to source object;
- repost-only remains valid and no longer shows misleading no-text placeholder.

## Boundaries preserved

- No backend contract changes required for 13B.2-A.
- No changes to `space-service` logic, dedupe rules, or target taxonomy.
- No Points integration and no reward producers activation.
- No Connect writes.
- Activity remains projection-only (not upgraded in this slice).

## Legacy/mock surfaces not used as foundation

Explicitly not reused:

- `components/space/Feed/PostComposer.tsx`
- `components/space/Feed/FeedView.tsx`
- `components/space/Feed/PostCard.tsx`
- `components/space/Posts/PostsView.tsx`

Implementation is runtime-first through `ContentActionRow` + Space runtime feed surfaces.

## QA and verification

Executed:

- `pnpm -C apps/go2asia-pwa-shell typecheck` -> pass.
- `pnpm -C apps/go2asia-pwa-shell lint` -> pass with existing workspace warnings (`214` warnings, `0` errors; unchanged baseline).
- `pnpm -C apps/go2asia-pwa-shell test` -> fail due unrelated pre-existing RF assertion mismatches:
  - `lib/rfProWorkspace.test.ts`
  - `lib/rfVoucherLifecycle.test.ts`
  - total: `4` failed files, `5` failed tests.

Also checked edited files via IDE lints: no new linter errors introduced.

Backend tests were not required for this slice because backend code was not modified.

## Known limitations

- `highlight` deep-link behavior depends on current feed surface behavior and is not expanded in this slice.
- Visibility selector/group repost UI remains deferred by design (v1 default is `public`).
- Composer is bounded to repost flow, not a universal Space post composer.

## Recommended next step

Proceed with either:

1. Track A runtime polish (composer UX/accessibility/pagination refresh/highlight ergonomics), or
2. Track B decision and scoped launch prep for Like -> Point Reward Pilot.

## Status tokens

stage_13B_2_A_status: COMPLETE_AS_BOUNDED_RUNTIME_REPOST_COMMENTARY_COMPOSER
stage_13B_2_A_track: TRACK_A_REPOST_COMMENTARY_COMPOSER
stage_13B_2_A_repost_commentary_runtime: TEXT_ON_REPOST
stage_13B_2_A_legacy_composer_reused: FALSE
stage_13B_2_A_economy_integration: FALSE
stage_13B_2_A_points_rewards: FALSE
stage_13B_2_A_taxonomy_expansion: FALSE
stage_13B_2_A_next_recommended_step: TRACK_A_RUNTIME_POLISH_OR_TRACK_B_LIKE_POINT_REWARD_PILOT_DECISION
