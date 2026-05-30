# Stage 13B.4-C8 — FT-1D Retention Dedupe Implementation

## 1. Executive Summary

Stage 13B.4-C8 implements the authorized FT-1D Retention Dedupe slice.

Upstream context:

- Stage 13B.4-C1 completed with `FT_1A_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C3 completed with `FT_1B_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C6 completed with `FT_1C_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C7 accepted with `AUTHORIZED_FOR_FT_1D_IMPLEMENTATION`.
- Authorization token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1D_RETENTION_DEDUPE_ONLY`.

Implementation result:

- Retention dedupe now runs inside retention scope.
- Private Repost Intent dedupe no longer treats public/group propagation reposts as proof that private retention exists.
- Propagation dedupe no longer treats private retention rows as propagation duplicates.
- Private Note text is not part of dedupe identity.
- Standard `postType: post` authorial-shaped writes do not enter retention dedupe.
- No bookmark, legacy, activity, WS-2, WS-3, WS-5, WS-6, WS-7, schema, migration, OpenAPI, or SDK work was performed.

Runtime state after this slice:

- `stage_13B_4_C8_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_PRIVATE_NOTE_AND_RETENTION_DEDUPE_ONLY`
- `stage_13B_4_C8_ws1_closure_claimed: FALSE`
- `stage_13B_4_C8_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C8_ws2_progress_claimed: FALSE`
- `stage_13B_4_C8_ws3_authorized: FALSE`
- `stage_13B_4_C8_ft_1d_mandatory_before_ws3: TRUE`
- `stage_13B_4_C8_bv_execution: NOT_AUTHORIZED`

Final status:

`FT_1D_IMPLEMENTATION_COMPLETE`

## 2. Current Dedupe Inventory

Pre-FT-1D dedupe inventory:

- `apps/space-service/src/services/spaceService.ts`
  - `createPost()` contained the only service-level active repost dedupe check.
  - It applied to `postType: repost` for selected target types.
  - It called `findActiveRepostByAuthorAndTarget()` before insert.

- `apps/space-service/src/db/queries/space.ts`
  - `findActiveRepostByAuthorAndTarget()` matched active reposts by author and target.
  - Before FT-1D it did not scope by `visibility` or retention intent.

- `apps/space-service/src/services/spaceService.ts` `repostPost()`
  - Convenience repost delegates to `createPost()`.
  - Its default remains public propagation and was not changed.

- `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`
  - Client-side duplicate handling exists, but it is UI-side drift and was not used as FT-1D proof.
  - No PWA changes were made in FT-1D.

Conflict surfaces:

- Retention vs propagation:
  - Before FT-1D, any active repost by the same author and target could block private retention.
  - After FT-1D, private retention dedupe searches only retention-scope rows.

- Legacy interference:
  - Legacy public/group repost rows can still exist.
  - They are not deleted, hidden, converted, or reclassified.
  - They no longer satisfy private retention dedupe.

- Future WS-3 conflict:
  - Retention dedupe must not block future Authorial Post behavior.
  - FT-1D proves the current standard authorial-shaped `postType: post` write does not enter retention dedupe.
  - This does not authorize WS-3.

## 3. Scope Boundary

In scope:

- split repost dedupe into retention and propagation scopes;
- use `Private Repost Intent` classification to choose the dedupe scope;
- prove repeated private retention resolves inside retention scope;
- prove public propagation rows do not satisfy retention dedupe;
- prove private retention rows do not satisfy propagation dedupe;
- prove standard `postType: post` writes are not blocked by retention dedupe;
- prove Private Note text is not part of dedupe identity;
- preserve FT-1A, FT-1B, and FT-1C semantics.

Out of scope and not implemented:

- FT-1E bookmark separation;
- FT-1F legacy boundary;
- FT-1G activity alignment;
- WS-2 public/group repost elimination;
- WS-3 Authorial Post;
- WS-3 Source Reference;
- WS-5 legacy taxonomy, distinction, conversion, deletion, hiding, or migration;
- WS-6 activity projection rewrite;
- WS-7 language/copy rewrite;
- OpenAPI changes;
- SDK generation;
- DB schema changes;
- migrations;
- frontend changes;
- UI-only duplicate handling as proof.

## 4. Runtime Changes

Implemented runtime changes:

- Updated `apps/space-service/src/db/queries/space.ts`.
  - `findActiveRepostByAuthorAndTarget()` now accepts a dedupe scope.
  - `retention` scope matches only `visibility = 'private'`.
  - `propagation` scope matches only non-private visibility.
  - No schema changes or migrations were introduced.

- Updated `apps/space-service/src/services/spaceService.ts`.
  - `createPost()` now maps `private_repost_intent` to `retention` dedupe scope.
  - Other repost writes use `propagation` dedupe scope.
  - No activity, bookmark, legacy, WS-2, WS-3, OpenAPI, or SDK behavior was changed.

- Updated `apps/space-service/test/request.test.ts`.
  - Added retention duplicate proof.
  - Added propagation/public collision proof.
  - Added inverse private-vs-public propagation proof.
  - Added standard authorial-shaped write non-blocking proof.
  - Added proof that Private Note text is not part of dedupe identity.

## 5. Files Changed

Changed files for FT-1D:

- `apps/space-service/src/db/queries/space.ts`
- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/test/request.test.ts`
- `docs/reports/stage_13B_4_C8_ft_1D_retention_dedupe_implementation_v1.md`

No changes were made to:

- `apps/go2asia-pwa-shell` frontend files;
- Reactions/bookmark surfaces;
- legacy handling;
- activity projection;
- group feed queries or group feed UI;
- Authorial Post or Source Reference surfaces;
- `docs/openapi/space.yaml`;
- generated SDK;
- DB schema;
- migrations.

## 6. Acceptance Criteria Review

P1 — Repeated Private Repost Intent resolves inside retention scope: PASS.

- Private retention duplicate test returns `409 REPOST_ALREADY_EXISTS` with the existing private retention id.
- No second `INSERT INTO space_post` is performed.
- The dedupe query is scoped to `visibility = 'private'`.

P2 — Public/group propagation repost does not satisfy retention dedupe: PASS.

- Private retention create uses retention scope only.
- Test proves private retention can be created through a private-scope dedupe check rather than being satisfied by propagation scope.

P3 — Legacy repost does not satisfy retention dedupe: PASS within FT-1D scope.

- Legacy-shaped public/group repost rows are outside retention dedupe scope.
- No legacy row mutation, deletion, hiding, migration, or reclassification was introduced.

P4 — Future Authorial Post is not blocked by retention dedupe: PASS within current runtime boundary.

- Standard `postType: post` create does not run retention dedupe.
- This is a non-blocking proxy proof only and does not implement or authorize WS-3.

P5 — Private Note is not part of dedupe identity: PASS.

- Duplicate private retention with different note text resolves to the existing private retention row.
- Dedupe key remains owner + target + retention scope, not note text.

P6 — Bookmark is not part of dedupe identity: PASS.

- No Reactions or bookmark code was changed.
- No bookmark lookup, merge, or saved-tab behavior was introduced.

P7 — Proof is runtime/service-level, not UI-only: PASS.

- Proof is covered by `space-service` HTTP worker tests.
- No frontend-only duplicate handling was used as acceptance evidence.

P8 — Remaining WS-1 gaps are explicitly documented: PASS.

- Remaining gaps are listed in Section 9.

Negative blockers:

- N1 FT-1D claims WS-1 closure: NOT CLAIMED.
- N2 FT-1D claims Foundation Trio closure: NOT CLAIMED.
- N3 FT-1D claims WS-2 progress: NOT CLAIMED.
- N4 FT-1D claims WS-3 readiness: NOT CLAIMED.
- N5 FT-1D changes bookmark behavior: NOT IMPLEMENTED.
- N6 FT-1D changes legacy handling: NOT IMPLEMENTED.
- N7 FT-1D changes activity behavior: NOT IMPLEMENTED.
- N8 FT-1D uses UI-only duplicate handling as proof: NOT USED.

Verification commands executed:

- `pnpm --filter @go2asia/space-service test -- request.test.ts`
  - Result: PASS, 39 tests passed.

- `pnpm --filter @go2asia/space-service typecheck`
  - Result: PASS.

- IDE lint check on changed files
  - Result: PASS, no linter errors found.

## 7. Runtime Drift Review

Remaining drift after FT-1D:

- Bookmark/saved tab remains Reactions-owned.
  - This is FT-1E and was not changed.

- Legacy public/group repost rows remain legacy-shaped and unclassified.
  - FT-1D prevents legacy rows from satisfying retention dedupe.
  - It does not classify, hide, delete, migrate, or convert legacy rows.

- Activity projection still treats repost-shaped rows according to existing materialization behavior.
  - This is FT-1G / WS-6 and was not changed.

- `repostPost()` still defaults to public visibility.
  - WS-2 public/group repost elimination was not implemented.

- UI-side duplicate signals may still need later alignment.
  - FT-1D proof is service-level.
  - No frontend duplicate UI was counted as proof.

- WS-3 Authorial Post and Source Reference remain unauthorized.
  - FT-1D preserves the mandatory-before-WS-3 invariant.
  - FT-1D completion does not open WS-3 automatically.

No hidden implementation of FT-1E, FT-1F, FT-1G, WS-2, WS-3, WS-5, WS-6, or WS-7 was detected.

## 8. Forbidden Scope Verification

Forbidden scope check:

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
- frontend changes: NOT IMPLEMENTED.

Governance invariant preserved:

- `stage_13B_4_C8_ft_1d_mandatory_before_ws3: TRUE`

## 9. Remaining WS-1 Gaps

FT-1D does not close WS-1.

Remaining WS-1 gaps:

- FT-1E: bookmark/Reactions separation from Private Repost.
- FT-1F / WS-5: legacy public/group repost distinction.
- FT-1G / WS-6: no incoming pressure and activity projection alignment.
- FT-1H: WS-1 closure evidence rollup.

Additional downstream gaps:

- WS-2 public/group repost write elimination remains blocked.
- WS-3 Authorial Post and Source Reference remain unimplemented and unauthorized.
- WS-5 legacy classification remains unimplemented.
- WS-7 language/copy remains pre-transition outside bounded private-note surfaces.
- WS-8 BV execution remains unauthorized.

## 10. Recommended Next Gate

Recommended next gate:

`FT_1E_BOOKMARK_SEPARATION_SLICE_AUTHORIZATION_GATE`

Reason:

- FT-1A established retention intent.
- FT-1B established owner visibility.
- FT-1C established private note semantics.
- FT-1D established retention-scoped dedupe.
- Bookmark/Reactions separation remains the next unresolved WS-1 primitive.
- WS-3 must not open automatically after FT-1D.

Recommended next authorization token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1E_BOOKMARK_SEPARATION_ONLY`

## 11. Final Status

`FT_1D_IMPLEMENTATION_COMPLETE`

Final tokens:

- `stage_13B_4_C8_status: FT_1D_IMPLEMENTATION_COMPLETE`
- `stage_13B_4_C8_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_PRIVATE_NOTE_AND_RETENTION_DEDUPE_ONLY`
- `stage_13B_4_C8_ws1_closure_claimed: FALSE`
- `stage_13B_4_C8_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C8_ws2_progress_claimed: FALSE`
- `stage_13B_4_C8_ws3_authorized: FALSE`
- `stage_13B_4_C8_ft_1d_mandatory_before_ws3: TRUE`
- `stage_13B_4_C8_next_gate: FT_1E_BOOKMARK_SEPARATION_SLICE_AUTHORIZATION_GATE`
