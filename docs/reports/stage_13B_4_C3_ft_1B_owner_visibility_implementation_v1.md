# Stage 13B.4-C3 — FT-1B Owner Visibility Implementation

## 1. Executive Summary

Stage 13B.4-C3 implements the authorized FT-1B Owner Visibility slice.

Upstream context:

- Stage 13B.4-A accepted.
- Stage 13B.4-B accepted.
- Stage 13B.4-C0 accepted.
- Stage 13B.4-C1 completed with `FT_1A_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C2 accepted with `AUTHORIZED_FOR_FT_1B_IMPLEMENTATION`.
- Authorization token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1B_OWNER_VISIBILITY_ONLY`.

Implementation result:

- Owner has a positive retention path for post-transition Private Repost Intent.
- Non-owner direct-link access to private retention is denied.
- Non-owner profile representation excludes private retention.
- Private retention is removed from profile/publication output and public repost counters in touched surfaces.
- Post-create owner resolution no longer uses `/space/feed?highlight=...` as the canonical destination for private retention.

Runtime state after this slice:

- `stage_13B_4_C3_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_AND_OWNER_VISIBILITY_ONLY`
- `stage_13B_4_C3_ws1_closure_claimed: FALSE`
- `stage_13B_4_C3_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C3_bv_execution: NOT_AUTHORIZED`

Final status:

`FT_1B_IMPLEMENTATION_COMPLETE`

## 2. Current Visibility Surface Inventory

Inventory before implementation, using Stage 13B.4-C2:

Touched surfaces:

- Owner retention surface
  - Before C3: no positive owner retention path existed.
  - C3: `/space/posts?retention={postId}` loads the private retention row through existing `GET /v1/space/posts/:id` and renders an owner-only focus card.

- Direct link / getPost
  - Before C3: existing service logic allowed owner and denied non-owner for `visibility: private`, but no FT-1B regression proof existed.
  - C3: added owner 200 and non-owner 403 tests for post-transition private retention.

- Profile feed
  - Before C3: `getProfileFeed` filtered rows through `canViewPost`, but no explicit FT-1B non-owner proof existed.
  - C3: added non-owner profile feed test proving private retention is absent while public author output remains visible.

- Profile/publications surface
  - Before C3: private retention could be counted/rendered as repost publication output.
  - C3: publication list and publication counters exclude `postType: repost` plus `visibility: private`.

- Owner resolution path
  - Before C3: object-bound private retention still linked to `/space/feed?highlight=...`.
  - C3: success, duplicate, and already-existing retention links now resolve to `/space/posts?retention={postId}`.

- Visibility-related counters
  - Before C3: the home feed repost counter/filter counted private retention as repost.
  - C3: private retention is excluded from the repost counter/filter bucket while remaining visible in owner-owned feed contexts.

Not touched:

- bookmarks and saved tab;
- private note model;
- dedupe;
- legacy taxonomy;
- legacy distinction;
- activity projection;
- activity UI cleanup;
- group feed alignment;
- Authorial Post;
- Source Reference;
- language rewrite;
- OpenAPI;
- SDK generation;
- DB schema;
- migrations.

## 3. Scope Boundary

In scope:

- owner-positive access for post-transition Private Repost Intent;
- non-owner absence for direct-link and profile representation;
- owner post-write resolution path;
- exclusion of private retention from profile/publication output;
- exclusion of private retention from repost counters/filters in touched feed surface;
- targeted tests for direct owner/non-owner access and profile non-owner absence;
- implementation report with drift and forbidden-scope review.

Out of scope:

- FT-1C private note semantics;
- FT-1D retention dedupe;
- FT-1E bookmark separation;
- FT-1F legacy handshake;
- FT-1G activity silence/alignment;
- WS-2 public/group repost elimination;
- WS-3 Authorial Post or Source Reference;
- WS-5 legacy taxonomy or distinction;
- WS-6 activity projection alignment;
- WS-7 language/copy alignment;
- WS-8 BV execution.

Scope note:

The new owner retention focus card contains minimal labels needed to identify the owner-only context and `visibility: private`. This is not a WS-7 language rewrite and is not counted as the proof by itself. The proof is the owner-only path plus non-owner absence and publication exclusion.

## 4. Runtime Changes

Runtime changes implemented:

- Added owner retention helpers in `apps/go2asia-pwa-shell/modules/space/retentionIntent.ts`.
  - `isPrivateRepostIntentPost()` classifies client-side `postType: repost` plus `visibility: private`.
  - `getOwnerRetentionUrl()` builds `/space/posts?retention={postId}`.

- Updated `ContentActionRow`.
  - Private retention create, duplicate, and already-existing paths now link to the owner retention URL.
  - Public feed highlight is no longer the canonical post-create destination for private retention.
  - No CTA removal or public repost write blocking was introduced.

- Updated `PostsPageClient`.
  - Reads the `retention` query parameter and passes it to the publications surface.

- Updated `PostsPublicationsSurface`.
  - Loads focused owner retention via existing `GET /v1/space/posts/:id`.
  - Renders an owner retention focus card only when the authenticated owner can load a private repost intent row.
  - Filters private retention out of publication items and publication counters.
  - Does not implement note editing, dedupe, bookmark separation, legacy classification, or source reference.

- Updated `SpaceFeedSurface`.
  - Repost counter/filter excludes private retention rows.
  - This is bounded visibility classification only; it does not remove legacy public repost behavior or implement WS-2.

- Updated `apps/space-service/test/request.test.ts`.
  - Added owner direct-link positive proof.
  - Added non-owner direct-link 403 proof.
  - Added non-owner profile feed absence proof.

## 5. Files Changed

Changed files for FT-1B:

- `apps/go2asia-pwa-shell/modules/space/retentionIntent.ts`
- `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPublicationsSurface.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedSurface.tsx`
- `apps/space-service/test/request.test.ts`
- `docs/reports/stage_13B_4_C3_ft_1B_owner_visibility_implementation_v1.md`

No changes were made to:

- `docs/openapi/space.yaml`
- generated SDK/types
- DB schema or migrations
- `apps/space-service/src/services/spaceService.ts` activity materialization logic
- `findActiveRepostByAuthorAndTarget`
- `repostPost`
- `SavedPostsPageClient`
- `ShareToSpaceComposer`
- group feed queries or group feed UI
- legacy classification surfaces

## 6. Acceptance Criteria Review

P1 — Owner can access post-transition private retention: PASS.

- Owner retention URL `/space/posts?retention={postId}` loads existing `GET /v1/space/posts/:id`.
- Service test proves owner direct-link access returns 200 for `visibility: private`.

P2 — Non-owner cannot access profile representation: PASS.

- Service test proves non-owner profile feed excludes the private retention row while retaining public author output.

P3 — Non-owner cannot access direct-link representation: PASS.

- Service test proves non-owner direct-link access returns 403.

P4 — Non-owner cannot access highlight/deep-link representation: PASS.

- Private retention post-create destination no longer uses `/space/feed?highlight=...`.
- Deep owner resolution uses `/space/posts?retention={postId}`, which loads through owner-gated `GET /v1/space/posts/:id`.
- Non-owner direct-link access is denied by the same service gate.

P5 — Private retention is absent from public/group surfaces: PASS within FT-1B scope.

- Group feed behavior was not changed, and existing group feed query remains `visibility: group`.
- Private retention is not routed to public feed highlight as canonical destination.
- This does not claim WS-4 group feed alignment.

P6 — Private retention is not counted as public/profile publication output: PASS.

- `PostsPublicationsSurface` filters private retention from publication items and summary counts.
- `SpaceFeedSurface` excludes private retention from repost counter/filter classification.

P7 — Source author discoverability through owner visibility surfaces is prevented: PASS within FT-1B scope.

- Owner retention surface is owner-gated through `GET /v1/space/posts/:id`.
- Non-owner direct/profile access is blocked or absent.
- Activity discoverability remains out of scope and is documented as FT-1G / WS-6 debt, not as FT-1B proof.

P8 — Reviewer can distinguish post-transition private retention from public propagation: PASS.

- The owner retention focus card labels the row as `Личный контекст` and shows `visibility: private` via the existing visibility label.
- Tests assert `postType: repost` plus `visibility: private`.
- Public propagation paths remain distinguishable because public repost/default write paths were not changed.

Negative blockers:

- N1 Owner access absent: NOT PRESENT.
- N2 Non-owner visibility leak: NOT DETECTED in tested direct/profile paths.
- N3 Source author visibility leak: NOT INTRODUCED through owner visibility surfaces.
- N4 Private retention counted as publication output: FIXED in touched publications/counters surfaces.
- N5 Public feed remains canonical retention destination: FIXED for post-create owner resolution.
- N6 Legacy masking: NOT IMPLEMENTED.
- N7 Language rewrite used as proof: NOT USED.
- N8 WS-1 closure claim: NOT CLAIMED.

## 7. Runtime Drift Review

Remaining drift after FT-1B:

- Activity projection still treats repost-shaped rows as activity sources.
  - This is FT-1G / WS-6 scope and was not changed.

- Private note semantics are still not implemented.
  - Existing optional text/commentary remains pre-transition debt.
  - FT-1C remains required.

- Dedupe remains unscoped.
  - Existing public legacy repost rows can still block private retention for the same target.
  - FT-1D remains required.

- Bookmark/saved tab remains Reactions-owned and separate.
  - FT-1E remains required.

- Legacy public/group repost rows remain visible according to current legacy runtime.
  - WS-5 / FT-1F remains required.

- `repostPost()` still defaults to `visibility: public`.
  - WS-2 public/group repost elimination was not implemented.

- UI copy still contains repost/share/publish language in existing surfaces.
  - WS-7 remains required.

- Home feed can still include owner-authored private retention rows because the feed query includes author-owned rows.
  - C3 only excludes private retention from repost counters/filter and no longer uses home feed highlight as canonical owner destination.

No hidden implementation of FT-1C, FT-1D, FT-1E, FT-1F, FT-1G, WS-2, WS-3, WS-5, WS-6, or WS-7 was detected.

## 8. Forbidden Scope Verification

Forbidden scope check:

- FT-1C private note: NOT IMPLEMENTED.
- FT-1D retention dedupe: NOT IMPLEMENTED.
- FT-1E bookmark separation: NOT IMPLEMENTED.
- FT-1F legacy handshake: NOT IMPLEMENTED.
- FT-1G activity silence/alignment: NOT IMPLEMENTED.
- WS-2 public/group repost elimination: NOT IMPLEMENTED.
- WS-3 Authorial Post: NOT IMPLEMENTED.
- WS-3 Source Reference: NOT IMPLEMENTED.
- WS-5 legacy taxonomy/distinction: NOT IMPLEMENTED.
- WS-6 activity projection alignment: NOT IMPLEMENTED.
- WS-7 language/copy alignment: NOT IMPLEMENTED.
- OpenAPI changes: NOT IMPLEMENTED.
- SDK generation: NOT PERFORMED.
- DB schema changes: NOT IMPLEMENTED.
- migrations: NOT IMPLEMENTED.

Verification commands executed:

- `pnpm --filter @go2asia/space-service test -- request.test.ts`
  - Result: PASS, 32 tests passed.

- `pnpm --filter @go2asia/pwa-shell typecheck`
  - Result: PASS.

- `pnpm --filter @go2asia/space-service typecheck`
  - Result: PASS.

- IDE lint check on changed files
  - Result: PASS, no linter errors found.

Operational note:

- A first `git diff` helper command failed because PowerShell interpreted the `(public)` path segment when paths were unquoted.
- The command was rerun with quoted paths successfully.
- This did not affect code, tests, or verification.

## 9. Remaining WS-1 Gaps

FT-1B does not close WS-1.

Remaining WS-1 gaps:

- FT-1C: private note model and owner-only note semantics.
- FT-1D: retention-scoped dedupe.
- FT-1E: bookmark/Reactions separation from Private Repost.
- FT-1F / WS-5: legacy public/group repost distinction.
- FT-1G / WS-6: no incoming pressure and activity projection alignment.
- FT-1H: WS-1 closure evidence rollup.

Additional downstream gaps:

- WS-2 public/group repost write elimination remains blocked.
- WS-3 Authorial Post and Source Reference remain unimplemented.
- WS-7 language/copy remains pre-transition.
- WS-8 BV execution remains unauthorized.

## 10. Recommended Next Gate

Recommended next gate:

`FT_1C_PRIVATE_NOTE_SLICE_AUTHORIZATION_GATE`

Reason:

- FT-1A established retention intent.
- FT-1B established owner visibility boundary.
- The next unresolved WS-1 primitive is private note semantics.
- FT-1C must remain separate from dedupe, bookmark separation, legacy handling, activity alignment, WS-2, WS-3, and WS-7.

## 11. Final Status

`FT_1B_IMPLEMENTATION_COMPLETE`
