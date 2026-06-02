# Stage 13B.4-C11 - FT-1E Bookmark Separation Implementation

## 1. Executive Summary

Stage 13B.4-C11 implements the authorized FT-1E Bookmark Separation slice.

Upstream context:

- Stage 13B.4-C1 completed with `FT_1A_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C3 completed with `FT_1B_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C6 completed with `FT_1C_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C8 completed with `FT_1D_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C10 accepted with `AUTHORIZED_FOR_FT_1E_IMPLEMENTATION`.
- Authorization token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1E_BOOKMARK_SEPARATION_ONLY`.

Implementation result:

- Bookmark separation proof is now explicit at runtime/service test boundary.
- Reactions bookmark fact is proven independent from Space retained context identity.
- Private Repost retained context is proven independent from bookmark lookup/identity.
- Coexistence is proven: bookmark can point to the same source (including `space_post` id) without identity merge.
- Saved surfaces are documented as projection/hydration over bookmark facts, not Private Repost proof.
- No FT-1F, FT-1G, FT-1H, WS-2, WS-3, WS-5, WS-6, WS-7, OpenAPI, SDK, migration, or schema work was performed.

Runtime state after this slice:

- `stage_13B_4_C11_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_PRIVATE_NOTE_RETENTION_DEDUPE_AND_BOOKMARK_SEPARATION_ONLY`
- `stage_13B_4_C11_ws1_closure_claimed: FALSE`
- `stage_13B_4_C11_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C11_ws2_progress_claimed: FALSE`
- `stage_13B_4_C11_ws3_authorized: FALSE`
- `stage_13B_4_C11_ft_1d_mandatory_before_ws3: TRUE`

Final status:

`FT_1E_IMPLEMENTATION_COMPLETE`

## 2. Current Bookmark Inventory

Current bookmark surfaces:

- `apps/reactions-service/src/routes/reactions.ts`
  - owns bookmark write/delete/read routes in Reactions service.
- `apps/reactions-service/src/services/reactionsService.ts`
  - validates bookmark policy and persists reaction facts.
- `apps/reactions-service/test/request.test.ts`
  - verifies bookmark behavior as reaction fact.
- `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`
  - toggles bookmark via `/v1/reactions`.

Current saved surfaces:

- `apps/go2asia-pwa-shell/app/(public)/space/saved/SavedPostsPageClient.tsx`
  - loads `GET /v1/reactions/mine` and hydrates target objects.
- `apps/go2asia-pwa-shell/app/(public)/space/saved/page.tsx`
  - saved route container.
- `apps/go2asia-pwa-shell/components/space/runtime/useSpaceSavedReactions.ts`
  - saved reaction fetch helper for `space_post`.
- `apps/go2asia-pwa-shell/components/space/Shared/SpaceNav.tsx`
  - navigation entry to `/space/saved`.

Current retention surfaces:

- `apps/space-service/src/domain/retentionIntent.ts`
  - intent/text-role classification for private repost retention.
- `apps/space-service/src/services/spaceService.ts`
  - retention dedupe and owner-visibility write/read paths.
- `apps/space-service/src/db/queries/space.ts`
  - retention-scoped dedupe query over `space_post`.
- `apps/space-service/test/request.test.ts`
  - FT-1A/1B/1C/1D behavior proofs.
- `apps/go2asia-pwa-shell/modules/space/retentionIntent.ts`
  - owner retention URL and client helpers.

Current intersections bookmark/saved/retention:

- `ContentActionRow.tsx` presents both bookmark and share-to-space actions on one object.
- `/space/saved` can hydrate `space_post` targets, including repost-shaped rows, but remains reaction-fact driven.
- Space retention dedupe runs in `space-service` over `space_post` scope and does not use Reactions tables.

Inventory conclusion:

- bookmark and retention coexist in user flows;
- they are distinct primitives with distinct stores;
- FT-1E needed explicit runtime-level proof to prevent false interpretation of saved surfaces as retained-context proof.

## 3. Scope Boundary

In scope:

- prove bookmark remains Reactions-owned reaction fact;
- prove Private Repost remains Space retained context;
- prove bookmark is not retention dedupe identity;
- prove bookmark and Private Repost coexist without identity merge;
- prove separation at runtime/service-level through tests;
- document saved-surface non-proof semantics in this report.

Out of scope and not implemented:

- FT-1F Legacy Boundary;
- FT-1G Activity Alignment;
- FT-1H WS-1 Closure Evidence;
- WS-2 public/group repost elimination;
- WS-3 Authorial Post;
- WS-3 Source Reference;
- WS-5 legacy taxonomy/migration;
- WS-6 activity rewrite;
- WS-7 language rewrite;
- universal bookmark policy expansion;
- OpenAPI changes;
- SDK generation;
- DB schema changes;
- migrations.

## 4. Runtime Changes

Implemented runtime changes:

- Updated `apps/space-service/test/request.test.ts`.
  - Added proof that retention dedupe does not read bookmark reactions.
  - Added proof that private retention create does not require bookmark lookup.

- Updated `apps/reactions-service/test/request.test.ts`.
  - Strengthened proof that bookmark writes do not mutate `space_post` runtime identity.
  - Added proof that bookmark can target a `space_post` id that is retention-shaped without identity merge.

No runtime service logic, schema, migration, OpenAPI, SDK, or frontend behavior was modified.

## 5. Files Changed

Changed files for FT-1E:

- `apps/space-service/test/request.test.ts`
- `apps/reactions-service/test/request.test.ts`
- `docs/reports/stage_13B_4_C11_ft_1E_bookmark_separation_implementation_v1.md`

No changes were made to:

- `apps/space-service/src/**` runtime logic;
- `apps/reactions-service/src/**` runtime logic;
- `apps/go2asia-pwa-shell/**` frontend runtime behavior;
- `docs/openapi/**`;
- generated SDK;
- DB schema and migrations.

## 6. Acceptance Criteria Review

P1 - Bookmark remains reaction fact: PASS.

- Reactions tests confirm bookmark writes stay in reaction-fact lane.
- Added assertions ensure bookmark create path does not issue `space_post` mutation SQL.

P2 - Private Repost remains retained context: PASS.

- Space-service retention tests remain passing with owner/private semantics.
- Added tests keep retention path independent from bookmark lookup.

P3 - Bookmark is not Private Repost: PASS.

- Added reactions test verifies bookmark on `space_post` id does not become repost identity.

P4 - Bookmark is not Private Note: PASS.

- Private note semantics remain only in private repost context (existing FT-1C tests remain green).
- Bookmark tests do not introduce note fields or note identity.

P5 - Bookmark is not Authorial Post: PASS.

- Bookmark tests still avoid post creation/publishing behavior.
- No authorial/runtime publication logic touched.

P6 - Bookmark is not retention dedupe identity: PASS.

- New space-service test explicitly verifies no `reactions` table lookup during retention dedupe.

P7 - Saved surfaces are not proof of Private Repost: PASS (bounded proof shape).

- Runtime/service proof now separates bookmark identity from retention identity.
- Saved surfaces remain projection over bookmark facts, not retention-dedupe source.

P8 - Bookmark and Private Repost coexist without identity merge: PASS.

- New reactions test proves bookmark can exist on retention-shaped `space_post` id without identity merge.
- New space-service test proves retention create path proceeds without bookmark lookup.

P9 - Proof is runtime/service-level: PASS.

- Proof added through `space-service` and `reactions-service` request tests.

P10 - Remaining WS-1 gaps explicitly documented: PASS.

- Remaining gaps listed in Section 9.

Negative blockers:

- N1 FT-1E claims WS-1 closure: NOT CLAIMED.
- N2 FT-1E claims Foundation Trio closure: NOT CLAIMED.
- N3 FT-1E claims WS-2 progress: NOT CLAIMED.
- N4 FT-1E claims WS-3 readiness: NOT CLAIMED.
- N5 Bookmark merged with retention: NOT PRESENT.
- N6 Saved tab used as Private Repost proof: NOT USED AS ACCEPTANCE PROOF.
- N7 Legacy handling changed: NOT IMPLEMENTED.
- N8 Activity behavior changed: NOT IMPLEMENTED.
- N9 Language rewrite used as proof: NOT USED.
- N10 Universal bookmark rollout introduced: NOT IMPLEMENTED.

Verification commands executed:

- `pnpm --filter @go2asia/space-service test -- request.test.ts`
  - Result: PASS, 41 tests passed.
- `pnpm --filter @go2asia/reactions-service test -- request.test.ts`
  - Result: PASS, 19 tests passed.

## 7. Runtime Drift Review

Remaining drift after FT-1E:

- FT-1F legacy boundary remains open.
  - Legacy rows are still not fully classified/distinguished in runtime proof.

- FT-1G activity alignment remains open.
  - Activity semantics are unchanged.

- FT-1H WS-1 closure evidence remains open.
  - WS-1 closure rollup was not attempted.

- WS-3 Authorial Post and Source Reference remain unauthorized.
  - FT-1E does not open WS-3.

- Saved surfaces still require governance discipline.
  - They remain bookmark-fact projections and must not be interpreted as retained-context inventory.

No hidden implementation of FT-1F, FT-1G, FT-1H, WS-2, WS-3, WS-5, WS-6, or WS-7 was detected.

## 8. Forbidden Scope Verification

Forbidden scope check:

- FT-1F legacy boundary: NOT IMPLEMENTED.
- FT-1G activity alignment: NOT IMPLEMENTED.
- FT-1H WS-1 closure: NOT IMPLEMENTED.
- WS-2 public/group repost elimination: NOT IMPLEMENTED.
- WS-3 Authorial Post: NOT IMPLEMENTED.
- WS-3 Source Reference: NOT IMPLEMENTED.
- WS-5 legacy taxonomy/migration: NOT IMPLEMENTED.
- WS-6 activity rewrite: NOT IMPLEMENTED.
- WS-7 language rewrite: NOT IMPLEMENTED.
- universal bookmark rollout: NOT IMPLEMENTED.
- OpenAPI changes: NOT IMPLEMENTED.
- SDK generation: NOT PERFORMED.
- DB schema changes: NOT IMPLEMENTED.
- migrations: NOT IMPLEMENTED.

Governance invariant preserved:

- `stage_13B_4_C11_ft_1d_mandatory_before_ws3: TRUE`

## 9. Remaining WS-1 Gaps

FT-1E does not close WS-1.

Remaining WS-1 gaps:

- FT-1F: legacy public/group repost distinction.
- FT-1G: activity/no-pressure alignment.
- FT-1H: WS-1 closure evidence rollup.

Additional downstream gaps:

- WS-2 remains blocked.
- WS-3 remains unimplemented and unauthorized.
- WS-5 distinction/matrix remains unimplemented.
- WS-7 language alignment remains open.
- WS-8 BV execution remains unauthorized.

## 10. Recommended Next Gate

Recommended next gate:

`FT_1F_LEGACY_BOUNDARY_AUTHORIZATION_GATE`

Reason:

- bookmark/retention boundary proof is now explicit;
- legacy distinction remains the next major ambiguity blocker for WS-1 closure and Foundation Trio readiness;
- WS-3 must not open automatically after FT-1E.

Recommended next authorization token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1F_LEGACY_BOUNDARY_ONLY`

## 11. Final Status

`FT_1E_IMPLEMENTATION_COMPLETE`

Final tokens:

- `stage_13B_4_C11_status: FT_1E_IMPLEMENTATION_COMPLETE`
- `stage_13B_4_C11_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_PRIVATE_NOTE_RETENTION_DEDUPE_AND_BOOKMARK_SEPARATION_ONLY`
- `stage_13B_4_C11_ws1_closure_claimed: FALSE`
- `stage_13B_4_C11_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C11_ws2_progress_claimed: FALSE`
- `stage_13B_4_C11_ws3_authorized: FALSE`
- `stage_13B_4_C11_ft_1d_mandatory_before_ws3: TRUE`
- `stage_13B_4_C11_next_gate: FT_1F_LEGACY_BOUNDARY_AUTHORIZATION_GATE`
