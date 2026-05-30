# Stage 13B.4-C6 — FT-1C Private Note Implementation

## 1. Executive Summary

Stage 13B.4-C6 implements the authorized FT-1C Private Note slice.

Upstream context:

- Stage 13B.4-C1 completed with `FT_1A_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C3 completed with `FT_1B_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C5 accepted with `AUTHORIZED_FOR_FT_1C_IMPLEMENTATION`.
- Authorization token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1C_PRIVATE_NOTE_ONLY`.

Implementation result:

- Private Note exists as a distinct text-role semantic for post-transition Private Repost Intent.
- Owner can see Private Note inside the owner retention context.
- Owner can edit Private Note through the owner retention context.
- Non-owner access remains blocked by the already established owner-only visibility boundary.
- Private Note remains secondary to the retained source.
- Private Note is not Authorial Text, Source Reference, bookmark, publication output, WS-1 closure, or Foundation Trio closure.

Runtime state after this slice:

- `stage_13B_4_C6_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_AND_PRIVATE_NOTE_ONLY`
- `stage_13B_4_C6_ws1_closure_claimed: FALSE`
- `stage_13B_4_C6_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C6_ws3_authorized: FALSE`
- `stage_13B_4_C6_bv_execution: NOT_AUTHORIZED`

Final status:

`FT_1C_IMPLEMENTATION_COMPLETE`

## 2. Current Text Role Inventory

Pre-FT-1C text-role inventory:

- `space_post.text`
  - Existing carrier for standard post text and repost text.
  - No DB schema change was introduced.

- `apps/go2asia-pwa-shell/components/interaction/ShareToSpaceComposer.tsx`
  - Existing input still uses commentary-oriented language.
  - This remains WS-7/language debt and was not used as acceptance proof.

- `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`
  - Object-bound retention write already uses `buildPrivateRepostIntentRequest()` from FT-1A.
  - It can send optional text into the private retention row.
  - No copy/language rewrite was performed in FT-1C.

- `apps/space-service/src/services/spaceService.ts`
  - `createPost()` persists `text` for repost-shaped rows.
  - `updateRepostCommentary()` remains the existing PATCH route because OpenAPI/SDK changes are out of scope.
  - FT-1C adds intent-aware text-role classification without renaming the public contract.

- `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPublicationsSurface.tsx`
  - FT-1B owner retention focus card existed but did not show or edit note text.
  - FT-1C makes this the owner retention context for Private Note display/edit.

- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`
  - Repost text was always framed as repost commentary.
  - FT-1C now distinguishes private retention text from propagation commentary when a private retention row appears in owner-visible feed contexts.

Ambiguity removed by FT-1C:

- optional text on `postType: repost` plus `visibility: private` is classified as `private_note`;
- optional text on propagation repost remains `propagation_commentary`;
- private note remains attached to the retained source rather than becoming the center of a publication object.

## 3. Scope Boundary

In scope:

- introduce Private Note text-role classification for post-transition Private Repost Intent;
- expose Private Note in the owner retention context;
- allow owner to edit Private Note through the existing text-only PATCH route;
- keep non-owner absence intact;
- keep private note out of publication output;
- preserve the distinction from Authorial Text, Source Reference, bookmark, and public repost commentary;
- add targeted tests for create, read, edit, non-owner absence, and shape invariants.

Out of scope and not implemented:

- FT-1D retention dedupe;
- FT-1E bookmark separation;
- FT-1F legacy boundary;
- FT-1G activity alignment;
- WS-2 public/group repost elimination;
- WS-3 Authorial Post;
- WS-3 Source Reference;
- WS-5 legacy taxonomy or migration;
- WS-6 activity projection rewrite;
- WS-7 language rewrite;
- OpenAPI changes;
- SDK generation;
- DB schema changes;
- migrations.

## 4. Runtime Changes

Implemented runtime changes:

- Updated `apps/space-service/src/domain/retentionIntent.ts`.
  - Added `RepostTextRole`.
  - Added `classifyRepostTextRole()`.
  - Classifies private repost intent text as `private_note`.
  - Classifies non-private repost text as `propagation_commentary`.

- Updated `apps/space-service/src/services/spaceService.ts`.
  - `createPost()` now classifies repost text role after validating post type, visibility, and text.
  - Repost events include `repostTextRole` when a repost-shaped row has meaningful text.
  - No activity materialization, dedupe, DB schema, OpenAPI, SDK, or feed query changes were made.

- Updated `apps/go2asia-pwa-shell/modules/space/retentionIntent.ts`.
  - Added `getPrivateNoteText()`.
  - Client-side helper returns note text only for `postType: repost` plus `visibility: private`.

- Updated `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPublicationsSurface.tsx`.
  - Owner retention focus card now renders Private Note below retained source preview.
  - Owner can add, edit, or clear Private Note from the owner retention context.
  - Private Note remains secondary to the retained source title/subtitle and does not replace the source preview.

- Updated `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`.
  - Private retention text is labeled and edited as owner note when a private retention row appears in an owner-visible feed context.
  - Propagation reposts keep commentary behavior.
  - This is bounded runtime text-role distinction, not a WS-7 language rewrite.

- Updated `apps/space-service/test/request.test.ts`.
  - Added private-note create proof.
  - Extended owner direct-link proof with note text.
  - Extended non-owner/profile absence proof with note text.
  - Added private-note edit proof.
  - Added negative proof rejecting publication-like extra fields on private-note edit.

## 5. Files Changed

Changed files for FT-1C:

- `apps/space-service/src/domain/retentionIntent.ts`
- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/test/request.test.ts`
- `apps/go2asia-pwa-shell/modules/space/retentionIntent.ts`
- `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPublicationsSurface.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`
- `docs/reports/stage_13B_4_C6_ft_1C_private_note_implementation_v1.md`

No changes were made to:

- DB schema or migrations;
- `docs/openapi/space.yaml`;
- generated SDK;
- dedupe queries;
- bookmark/saved surfaces;
- legacy handling;
- activity projection;
- group feed queries or group feed UI;
- Authorial Post or Source Reference surfaces.

## 6. Acceptance Criteria Review

P1 — Private Note exists as a separate runtime-semantic: PASS.

- `classifyRepostTextRole()` distinguishes `private_note` from `propagation_commentary`.
- Service create path computes `repostTextRole`.
- Tests assert private retention text classifies as `private_note`.

P2 — Owner can access Private Note: PASS.

- Owner direct-link test now uses a private retention row with text and asserts the owner receives that text.
- Owner retention focus card displays the note only after loading the owner-gated retention post.

P3 — Owner can change Private Note: PASS.

- Added PATCH test for owner private retention note edit.
- Owner retention focus card can add, edit, or clear note text through the existing text-only PATCH route.

P4 — Non-owner does not access Private Note: PASS.

- Non-owner direct-link test remains 403 with a private retention row containing note text.
- Non-owner profile feed test uses note text and asserts it does not appear in the response.

P5 — Private Note is not publication output: PASS.

- FT-1B publication filters remain in place.
- Profile/publication surfaces continue excluding private retention rows from publication items and counts.
- Tests verify private retention with note text does not appear in non-owner profile output.

P6 — Private Note is not Authorial Text: PASS.

- Private note rows remain `postType: repost` and `visibility: private`.
- No `postType: post` creation or authorial publication path was added.
- PATCH validation still accepts only `text` and rejects publication-like extra fields.

P7 — Private Note is not Source Reference: PASS.

- Private note stays attached to the existing retention target binding.
- Tests assert no `sourceReference` field appears in private-note create/edit responses.
- No Source Reference field, route, model, or UI was introduced.

P8 — Private Note remains secondary to retained source: PASS.

- Owner retention focus card renders retained source title/subtitle first and note afterward.
- PATCH edit changes only text and does not alter retained source target binding.
- Tests assert the retained repost target remains present after create/edit.

Negative blockers:

- N1 Private Note becomes Authorial Post: NOT PRESENT.
- N2 Private Note becomes Source Reference: NOT PRESENT.
- N3 Private Note becomes bookmark: NOT PRESENT.
- N4 Private Note used as WS-1 closure: NOT CLAIMED.
- N5 Private Note used as Foundation Trio closure: NOT CLAIMED.
- N6 Dedupe changed: NOT IMPLEMENTED.
- N7 Legacy changed: NOT IMPLEMENTED.
- N8 Language rewrite used as proof: NOT USED.

Verification commands executed:

- `pnpm --filter @go2asia/space-service test -- request.test.ts`
  - Result: PASS, 35 tests passed.

- `pnpm --filter @go2asia/pwa-shell typecheck`
  - Result: PASS.

- `pnpm --filter @go2asia/space-service typecheck`
  - Result: PASS.

- IDE lint check on changed files
  - Result: PASS, no linter errors found.

## 7. Runtime Drift Review

Remaining drift after FT-1C:

- Dedupe remains unscoped.
  - Existing public legacy repost rows can still block private retention for the same target.
  - This is FT-1D and remains mandatory before any WS-3 authorization.

- Bookmark/saved tab remains Reactions-owned.
  - This is FT-1E and was not changed.

- Legacy public/group repost rows remain legacy-shaped and unclassified.
  - This is FT-1F / WS-5 and was not changed.

- Activity projection still treats repost-shaped rows according to existing materialization behavior.
  - This is FT-1G / WS-6 and was not changed.

- `repostPost()` still defaults to public visibility.
  - WS-2 public/group repost elimination was not implemented.

- UI language outside the bounded private-note surfaces still includes repost/share/publish/commentary wording.
  - WS-7 remains open.
  - FT-1C proof does not rely on global copy rewrite.

- OpenAPI and generated SDK still expose the historical commentary PATCH naming.
  - This is intentional because OpenAPI/SDK changes were forbidden for FT-1C.
  - Runtime semantics are proven by intent-aware classification and owner-only note behavior.

No hidden implementation of FT-1D, FT-1E, FT-1F, FT-1G, WS-2, WS-3, WS-5, WS-6, or WS-7 was detected.

## 8. Forbidden Scope Verification

Forbidden scope check:

- FT-1D retention dedupe: NOT IMPLEMENTED.
- FT-1E bookmark separation: NOT IMPLEMENTED.
- FT-1F legacy boundary: NOT IMPLEMENTED.
- FT-1G activity alignment: NOT IMPLEMENTED.
- WS-2 public/group repost elimination: NOT IMPLEMENTED.
- WS-3 Authorial Post: NOT IMPLEMENTED.
- WS-3 Source Reference: NOT IMPLEMENTED.
- WS-5 legacy taxonomy/migration: NOT IMPLEMENTED.
- WS-6 activity projection rewrite: NOT IMPLEMENTED.
- WS-7 language rewrite: NOT IMPLEMENTED.
- OpenAPI changes: NOT IMPLEMENTED.
- SDK generation: NOT PERFORMED.
- DB schema changes: NOT IMPLEMENTED.
- migrations: NOT IMPLEMENTED.

Governance rule preserved:

- `stage_13B_4_C6_ft_1d_mandatory_before_ws3: TRUE`

## 9. Remaining WS-1 Gaps

FT-1C does not close WS-1.

Remaining WS-1 gaps:

- FT-1D: retention-scoped dedupe.
- FT-1E: bookmark/Reactions separation from Private Repost.
- FT-1F / WS-5: legacy public/group repost distinction.
- FT-1G / WS-6: no incoming pressure and activity projection alignment.
- FT-1H: WS-1 closure evidence rollup.

Additional downstream gaps:

- WS-2 public/group repost write elimination remains blocked.
- WS-3 Authorial Post and Source Reference remain unimplemented and unauthorized.
- WS-7 language/copy remains pre-transition outside bounded private-note surfaces.
- WS-8 BV execution remains unauthorized.

## 10. Recommended Next Gate

Recommended next gate:

`FT_1D_RETENTION_DEDUPE_SLICE_AUTHORIZATION_GATE`

Reason:

- FT-1A established retention intent.
- FT-1B established owner visibility.
- FT-1C established private note semantics.
- C4/C5 governance requires FT-1D before any WS-3 authorization.
- Dedupe remains the next mandatory WS-1 gap before safe progression toward Authorial Post work.

Recommended next authorization token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1D_RETENTION_DEDUPE_ONLY`

## 11. Final Status

`FT_1C_IMPLEMENTATION_COMPLETE`

Final tokens:

- `stage_13B_4_C6_status: FT_1C_IMPLEMENTATION_COMPLETE`
- `stage_13B_4_C6_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_AND_PRIVATE_NOTE_ONLY`
- `stage_13B_4_C6_ws1_closure_claimed: FALSE`
- `stage_13B_4_C6_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C6_ws3_authorized: FALSE`
- `stage_13B_4_C6_ft_1d_mandatory_before_ws3: TRUE`
- `stage_13B_4_C6_next_gate: FT_1D_RETENTION_DEDUPE_SLICE_AUTHORIZATION_GATE`
