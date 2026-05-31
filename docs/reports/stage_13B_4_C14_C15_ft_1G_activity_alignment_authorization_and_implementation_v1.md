# Stage 13B.4-C14/C15 - FT-1G Activity Alignment Authorization and Implementation

## 1. Executive Summary

Stage 13B.4-C14/C15 combines the FT-1G Activity Alignment authorization review and, because authorization passed, the bounded FT-1G implementation.

C14 authorization result:

`AUTHORIZED_FOR_FT_1G_IMPLEMENTATION`

C15 implementation executed:

`TRUE`

Final status:

`FT_1G_IMPLEMENTATION_COMPLETE`

Upstream context:

- Stage 13B.4-C1 completed with `FT_1A_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C3 completed with `FT_1B_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C6 completed with `FT_1C_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C8 completed with `FT_1D_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C11 completed with `FT_1E_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C13 completed with `FT_1F_IMPLEMENTATION_COMPLETE`.

Implementation result:

- post-transition Private Repost no longer materializes social repost activity;
- private retention does not create incoming `post_reposted_by_other` pressure for source author;
- public/group repost activity behavior remains unchanged;
- FT-1A through FT-1F semantics are preserved;
- no FT-1H, WS-2, WS-3, WS-5 full implementation, WS-6 full rewrite, WS-7, OpenAPI, SDK, schema, migration, or activity UI redesign work was performed.

## 2. Current Activity Inventory

Current repost activity creation points before FT-1G:

- `apps/space-service/src/services/spaceService.ts`
  - `createPost()` materialized activity after `insertSpacePost()`.
  - `materializeOutgoingPostActivity()` wrote `space.repost_created` for `post_type = repost`.
  - `materializeIncomingRepostActivity()` wrote `space.post_reposted_by_other` for reposts of `space_post` targets when source author differed.
  - `repostPost()` delegates to `createPost()` and defaults to public visibility.

Outgoing repost events:

- `space.repost_created`;
- direction: `outgoing`;
- recipient: repost author;
- category: `social`;
- historical label: "You reposted an item".

Incoming pressure events:

- `space.post_reposted_by_other`;
- direction: `incoming`;
- recipient: source post author;
- category: `social`;
- title: "Someone reposted your post".

Read surfaces:

- `apps/space-service/src/db/queries/space.ts` via `listActivityFeedRows()`;
- `apps/space-service/src/services/spaceService.ts` via `getActivityFeed()`;
- `apps/space-service/src/routes/feed.ts` via `/v1/space/feed/activity`;
- `apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx`;
- feed-service activity proxy surfaces.

Where private retention could be misread before FT-1G:

- private `postType: repost` with `repostTargetType: space_post` could create incoming source-author pressure;
- private retention could create outgoing social `repost_created` activity;
- Activity UI could present private retention as social repost behavior;
- legacy and public/group repost activity remained in the same projection category.

Inventory conclusion:

- the FT-1G gap was localized to activity materialization for post-transition Private Repost;
- full WS-6 projection rewrite was not required for this slice.

## 3. C14 Authorization Review

Prerequisites satisfied:

- FT-1A Retention Intent is complete.
- FT-1B Owner Visibility is complete.
- FT-1C Private Note is complete.
- FT-1D Retention Dedupe is complete.
- FT-1E Bookmark Separation is complete.
- FT-1F Legacy Boundary is complete.

Authorization question:

- Can FT-1G safely open as a bounded WS-1 no-pressure activity slice?

Answer:

- Yes.

Remaining risks:

- public/group repost activity must remain unchanged;
- legacy activity must not be hidden or migrated as proof;
- FT-1G must not become a full WS-6 rewrite;
- FT-1G must not claim WS-1 closure.

Strict prohibitions:

- no full WS-6 rewrite;
- no activity UI redesign;
- no activity language rewrite;
- no legacy activity migration;
- no public/group repost elimination;
- no WS-3 authorial activity;
- no notification system redesign;
- no OpenAPI/SDK/schema/migration changes.

C14 status:

`AUTHORIZED_FOR_FT_1G_IMPLEMENTATION`

Authorization token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1G_ACTIVITY_ALIGNMENT_ONLY`

## 4. C14 Scope Boundary

In scope:

- only Private Repost activity/no-pressure boundary;
- service-level proof that private retention does not create incoming repost pressure;
- service-level proof that private retention does not materialize social repost activity;
- preservation of legacy/public/group repost activity behavior;
- preservation of FT-1A through FT-1F semantics.

Out of scope:

- full WS-6 rewrite;
- activity UI redesign;
- activity language rewrite;
- legacy activity migration;
- public/group repost elimination;
- WS-3 authorial activity;
- notification system redesign;
- OpenAPI/SDK/schema/migrations unless blocker stop;
- FT-1H WS-1 closure evidence.

## 5. C15 Runtime Changes

C15 implementation was executed because C14 returned `AUTHORIZED_FOR_FT_1G_IMPLEMENTATION`.

Runtime changes:

- Updated `apps/space-service/src/services/spaceService.ts`.
  - `createPost()` now skips social activity materialization when `repostWriteIntent === 'private_repost_intent'`.
  - Private Repost no longer calls `materializeOutgoingPostActivity()`.
  - Private Repost no longer calls `materializeIncomingRepostActivity()`.
  - Public/group propagation reposts continue to materialize outgoing and incoming repost activity.

Test changes:

- Updated `apps/space-service/test/request.test.ts`.
  - Added proof that private retention of a `space_post` does not write `space.repost_created`.
  - Added proof that private retention of a `space_post` does not write `space.post_reposted_by_other`.
  - Added proof that public `space_post` repost activity remains unchanged.
  - Added proof that group `space_post` repost activity remains unchanged.

No OpenAPI, SDK, DB schema, migration, frontend, or activity UI changes were made.

## 6. Files Changed

Changed files:

- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/test/request.test.ts`
- `docs/reports/stage_13B_4_C14_C15_ft_1G_activity_alignment_authorization_and_implementation_v1.md`

No changes were made to:

- `docs/openapi/**`;
- generated SDK;
- DB schema or migrations;
- `apps/go2asia-pwa-shell/**`;
- full activity projection read model;
- legacy activity migration.

## 7. Acceptance Criteria Review

P1 - Private Repost creation does not create incoming repost pressure for source author: PASS.

- Private retention of a `space_post` no longer triggers incoming repost materialization.

P2 - Private Repost creation does not materialize `post_reposted_by_other`: PASS.

- Test asserts `space.post_reposted_by_other` is absent from SQL values for private retention.

P3 - Private Repost creation does not appear as public/social repost activity: PASS.

- Test asserts no `INSERT INTO space_activity_projection` and no `space.repost_created` for private retention.

P4 - Owner-side retention may remain owner context, but not social propagation: PASS.

- Retention post creation still succeeds and returns private retained context.
- Social activity projection is not used as owner context proof.

P5 - Legacy/public/group repost activity behavior remains unchanged: PASS.

- Public `space_post` repost still materializes `space.repost_created` and `space.post_reposted_by_other`.
- Group `space_post` repost still materializes `space.repost_created` and `space.post_reposted_by_other`.

P6 - FT-1A through FT-1F semantics remain intact: PASS.

- Existing request tests remain passing.

P7 - Proof is runtime/service-level, not UI-only: PASS.

- Proof is in `space-service` request tests and SQL-shape assertions.

P8 - FT-1G does not claim full WS-6 completion: PASS.

- Report explicitly keeps WS-6 full activity projection open.

P9 - FT-1G does not claim WS-1 closure: PASS.

- WS-1 closure is not claimed.

P10 - Remaining WS-1 gaps are documented: PASS.

- FT-1H remains listed as the remaining WS-1 gap.

Verification commands executed:

- `pnpm --filter @go2asia/space-service test -- request.test.ts`
  - Result: PASS, 47 tests passed.
- `pnpm --filter @go2asia/space-service typecheck`
  - Result: PASS.

## 8. Negative Blockers Review

N1 FT-1G claims WS-1 closure: NOT CLAIMED.

N2 FT-1G claims Foundation Trio closure: NOT CLAIMED.

N3 FT-1G claims WS-6 completion: NOT CLAIMED.

N4 FT-1G rewrites full activity projection: NOT IMPLEMENTED.

N5 FT-1G hides legacy activity as proof: NOT IMPLEMENTED.

N6 FT-1G changes public/group repost behavior: NOT PRESENT.

N7 FT-1G opens WS-3: NOT CLAIMED.

N8 FT-1G uses UI-only suppression as proof: NOT USED.

N9 FT-1G uses language-only distinction as proof: NOT USED.

N10 FT-1G changes OpenAPI/SDK/schema/migrations without blocker stop: NOT PRESENT.

## 9. Runtime Drift Review

Remaining open work:

- FT-1H WS-1 Closure Evidence remains open.
- WS-3 Authorial Post remains unimplemented and unauthorized.
- WS-5 full legacy runtime remains open.
- WS-6 full activity projection remains open.
- WS-7 language/copy alignment remains open.
- WS-8 BV execution remains unauthorized.

Activity-specific drift that remains intentionally open:

- legacy/public/group repost activity still exists and is preserved;
- Activity UI language still contains repost terminology;
- activity projection model still uses existing rows and categories;
- historical activity backfill/migration is not addressed.

## 10. Forbidden Scope Verification

Forbidden scope check:

- FT-1H not implemented.
- WS-2 not implemented.
- WS-3 not implemented.
- WS-5 full not implemented.
- WS-6 full not implemented.
- WS-7 not implemented.
- legacy hiding/deletion/migration not implemented.
- activity UI redesign not implemented.
- OpenAPI changes not implemented.
- SDK generation not performed.
- DB schema changes not implemented.
- migrations not implemented.

Governance invariant preserved:

- `Private Repost is owner-only retained context.`
- `Private Repost must not create incoming social pressure.`

## 11. Recommended Next Gate

Recommended next gate:

`FT_1H_WS1_CLOSURE_EVIDENCE_AUTHORIZATION_GATE`

Reason:

- FT-1A through FT-1G are now complete;
- FT-1H is the remaining WS-1 closure evidence rollup;
- WS-3 must not open automatically before WS-1 closure evidence is reviewed.

Recommended authorization token:

`AUTHORIZED_FOR_FT_1H_WS1_CLOSURE_EVIDENCE_REVIEW_ONLY`

## 12. Final Status

`FT_1G_IMPLEMENTATION_COMPLETE`

Final tokens:

- `stage_13B_4_C14_authorization_result: AUTHORIZED_FOR_FT_1G_IMPLEMENTATION`
- `stage_13B_4_C15_implementation_executed: TRUE`
- `stage_13B_4_C14_C15_status: FT_1G_IMPLEMENTATION_COMPLETE`
- `stage_13B_4_C14_C15_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_PRIVATE_NOTE_RETENTION_DEDUPE_BOOKMARK_SEPARATION_LEGACY_BOUNDARY_AND_ACTIVITY_ALIGNMENT_ONLY`
- `stage_13B_4_C14_C15_ws1_closure_claimed: FALSE`
- `stage_13B_4_C14_C15_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C14_C15_ws2_progress_claimed: FALSE`
- `stage_13B_4_C14_C15_ws3_authorized: FALSE`
- `stage_13B_4_C14_C15_ws6_full_completion_claimed: FALSE`
- `stage_13B_4_C14_C15_private_repost_incoming_pressure: FALSE`
- `stage_13B_4_C14_C15_next_gate: FT_1H_WS1_CLOSURE_EVIDENCE_AUTHORIZATION_GATE`
