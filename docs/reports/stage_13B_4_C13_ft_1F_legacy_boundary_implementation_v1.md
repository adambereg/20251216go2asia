# Stage 13B.4-C13 - FT-1F Legacy Boundary Implementation

## 1. Executive Summary

Stage 13B.4-C13 implements the authorized FT-1F Legacy Boundary slice.

Upstream context:

- Stage 13B.4-C1 completed with `FT_1A_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C3 completed with `FT_1B_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C6 completed with `FT_1C_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C8 completed with `FT_1D_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C11 completed with `FT_1E_IMPLEMENTATION_COMPLETE`.
- Stage 13B.4-C12 accepted with `AUTHORIZED_FOR_FT_1F_IMPLEMENTATION`.
- Authorization token: `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1F_LEGACY_BOUNDARY_ONLY`.

Implementation result:

- Legacy boundary proof is now explicit at runtime/service test boundary.
- Legacy repost-shaped rows are treated as historical artifacts in proof shape, not as post-transition primitive evidence.
- Legacy rows are proven not to be proof for Private Repost, Private Note, Bookmark, Authorial Post, or Source Reference.
- FT-1A through FT-1E semantics remain unchanged.
- No FT-1G, FT-1H, WS-2, WS-3, WS-5 full implementation, WS-6, WS-7, OpenAPI, SDK, schema, or migration work was performed.

Runtime state after this slice:

- `stage_13B_4_C13_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_PRIVATE_NOTE_RETENTION_DEDUPE_BOOKMARK_SEPARATION_AND_LEGACY_BOUNDARY_ONLY`
- `stage_13B_4_C13_ws1_closure_claimed: FALSE`
- `stage_13B_4_C13_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C13_ws2_progress_claimed: FALSE`
- `stage_13B_4_C13_ws3_authorized: FALSE`
- `stage_13B_4_C13_legacy_rows_runtime_proof_role: HISTORICAL_ARTIFACT_ONLY`

Final status:

`FT_1F_IMPLEMENTATION_COMPLETE`

## 2. Current Legacy Inventory

Legacy repost-shaped rows currently present:

- `post_type = 'repost'` with non-private visibility lanes (`public`, `group`, `followers`) as historical propagation-shaped artifacts.
- repost rows can include optional commentary text.
- repost rows can bind to source via `repost_target_type` and `repost_target_id`, including `space_post` chain-shaped targets.

Where legacy repost-shaped rows are visible:

- feed queries and feed response reason lane (`reason: repost`);
- profile feed and repost counters;
- group feed visibility lane;
- activity projection rows for repost actions;
- deep-link highlight destinations;
- saved/bookmark hydration when bookmark points to `space_post` id.

Primary false interpretations legacy rows can still cause without explicit distinction:

- legacy row mistaken as proof that post-transition Private Repost exists;
- legacy repost text mistaken as proof of Private Note;
- legacy row mistaken as bookmark proof;
- legacy row mistaken as Authorial Post evidence;
- legacy repost binding mistaken as Source Reference evidence.

Inventory conclusion for FT-1F:

- legacy rows remain visible historical artifacts;
- they must be distinguished by proof semantics;
- they must not be counted as post-transition runtime proof.

## 3. Scope Boundary

In scope:

- add runtime/service-level proof that legacy rows are historical artifacts only;
- prove legacy rows are not proof for Private Repost/Private Note/Bookmark/Authorial/Source Reference;
- preserve FT-1A through FT-1E semantics;
- document remaining WS-1 gaps.

Out of scope and not implemented:

- FT-1G Activity Alignment;
- FT-1H WS-1 Closure Evidence;
- WS-2;
- WS-3;
- WS-5 full implementation;
- WS-6;
- WS-7;
- legacy hiding;
- legacy deletion;
- legacy migration;
- legacy conversion;
- OpenAPI changes;
- SDK generation;
- DB schema changes;
- migrations;
- runtime rewrites.

## 4. Runtime Changes

Implemented runtime changes:

- Updated `apps/space-service/test/request.test.ts`.
  - Added proof that legacy group repost-shaped rows do not satisfy private retention dedupe.
  - Added proof that legacy-shaped non-private repost text remains propagation commentary, not private note.
  - Added profile-feed proof that legacy-shaped repost remains repost lane and does not materialize source-reference proof.

- Updated `apps/reactions-service/test/request.test.ts`.
  - Added proof that bookmark on legacy-shaped repost row id remains reaction fact only and does not mutate space-post identity.

No runtime service logic was changed.
No schema, migration, OpenAPI, SDK, frontend, or UI behavior changes were made.

## 5. Files Changed

Changed files for FT-1F:

- `apps/space-service/test/request.test.ts`
- `apps/reactions-service/test/request.test.ts`
- `docs/reports/stage_13B_4_C13_ft_1F_legacy_boundary_implementation_v1.md`

No changes were made to:

- `apps/space-service/src/**` runtime logic;
- `apps/reactions-service/src/**` runtime logic;
- `apps/go2asia-pwa-shell/**`;
- `docs/openapi/**`;
- generated SDK;
- DB schema or migrations.

## 6. Acceptance Criteria Review

P1 - Legacy rows treated as historical artifacts: PASS.

- Legacy-shaped fixtures and assertions are now explicit in runtime/service test proof.
- Proof semantics treat these rows as historical lanes, not post-transition primitive proof.

P2 - Legacy rows not used as Private Repost proof: PASS.

- Added test that legacy group repost-shaped lane does not satisfy private retention dedupe.

P3 - Legacy rows not used as Private Note proof: PASS.

- Added classification proof: non-private repost text remains `propagation_commentary`, not `private_note`.

P4 - Legacy rows not used as Bookmark proof: PASS.

- Reactions test proves bookmark is independent reaction fact even when target id is legacy-shaped repost row.

P5 - Legacy rows not used as Authorial Post proof: PASS.

- Added profile-feed proof where legacy-shaped row remains `reason: repost`, not authorial lane.

P6 - Legacy repost binding not used as Source Reference proof: PASS.

- Added feed proof that legacy repost row has repost binding lane without `sourceReference` proof field.

P7 - Proof is runtime/service-level: PASS.

- All new evidence comes from request-level tests and SQL-shape assertions.

P8 - FT-1A through FT-1E semantics preserved: PASS.

- Existing behavior tests remain green with no runtime logic changes.

P9 - Remaining WS-1 gaps explicitly documented: PASS.

- Remaining gaps listed in Section 9.

P10 - WS-3 remains unauthorized: PASS.

- Explicitly preserved in status tokens and forbidden-scope verification.

Negative blockers:

- N1 FT-1F claims WS-1 closure: NOT CLAIMED.
- N2 FT-1F claims Foundation Trio closure: NOT CLAIMED.
- N3 FT-1F claims WS-2 progress: NOT CLAIMED.
- N4 FT-1F claims WS-3 readiness: NOT CLAIMED.
- N5 Legacy rows hidden: NOT IMPLEMENTED.
- N6 Legacy rows deleted: NOT IMPLEMENTED.
- N7 Legacy rows migrated: NOT IMPLEMENTED.
- N8 Legacy rows converted: NOT IMPLEMENTED.
- N9 UI-only distinction used as proof: NOT USED.
- N10 Language-only distinction used as proof: NOT USED.

Verification commands executed:

- `pnpm --filter @go2asia/space-service test -- request.test.ts`
  - Result: PASS, 44 tests passed.
- `pnpm --filter @go2asia/reactions-service test -- request.test.ts`
  - Result: PASS, 20 tests passed.

## 7. Runtime Drift Review

Remaining drift after FT-1F:

- FT-1G activity alignment remains open.
- FT-1H closure evidence remains open.
- WS-3 remains unimplemented and unauthorized.
- WS-5 full implementation remains open.

Legacy-specific drift that remains intentionally open:

- visibility and policy handling of legacy artifacts is not resolved by FT-1F;
- full per-surface legacy policy matrix remains WS-5 work.

No hidden implementation detected for:

- FT-1G;
- FT-1H;
- WS-2;
- WS-3;
- WS-5 full implementation;
- WS-6;
- WS-7.

## 8. Forbidden Scope Verification

Forbidden scope check:

- FT-1G: NOT IMPLEMENTED.
- FT-1H: NOT IMPLEMENTED.
- WS-2: NOT IMPLEMENTED.
- WS-3: NOT IMPLEMENTED.
- WS-5 full implementation: NOT IMPLEMENTED.
- WS-6: NOT IMPLEMENTED.
- WS-7: NOT IMPLEMENTED.
- legacy hiding/deletion/migration/conversion: NOT IMPLEMENTED.
- OpenAPI changes: NOT IMPLEMENTED.
- SDK generation: NOT PERFORMED.
- DB schema changes: NOT IMPLEMENTED.
- migrations: NOT IMPLEMENTED.

Governance invariants preserved:

- `stage_13B_4_C13_legacy_rows_runtime_proof_role: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_4_C13_ws3_authorized: FALSE`
- `stage_13B_4_C13_ft_1d_mandatory_before_ws3: TRUE`

## 9. Remaining WS-1 Gaps

FT-1F does not close WS-1.

Remaining WS-1 gaps:

- FT-1G Activity Alignment.
- FT-1H WS-1 Closure Evidence.

Additional downstream gaps:

- WS-2 remains blocked.
- WS-3 remains unimplemented and unauthorized.
- WS-5 full implementation remains open.
- WS-6 and WS-7 remain open.
- WS-8 BV execution remains unauthorized.

## 10. Recommended Next Gate

Recommended next gate:

`FT_1G_ACTIVITY_ALIGNMENT_AUTHORIZATION_GATE`

Reason:

- legacy boundary WS-1 side is now proven at runtime/service level;
- activity/no-pressure contract remains the next unresolved WS-1 blocker;
- FT-1H closure evidence depends on FT-1G completion;
- WS-3 must remain closed for implementation.

Recommended next authorization token:

`AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1G_ACTIVITY_ALIGNMENT_ONLY`

## 11. Final Status

`FT_1F_IMPLEMENTATION_COMPLETE`

Final tokens:

- `stage_13B_4_C13_status: FT_1F_IMPLEMENTATION_COMPLETE`
- `stage_13B_4_C13_runtime_state: RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_PRIVATE_NOTE_RETENTION_DEDUPE_BOOKMARK_SEPARATION_AND_LEGACY_BOUNDARY_ONLY`
- `stage_13B_4_C13_ws1_closure_claimed: FALSE`
- `stage_13B_4_C13_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C13_ws2_progress_claimed: FALSE`
- `stage_13B_4_C13_ws3_authorized: FALSE`
- `stage_13B_4_C13_legacy_rows_runtime_proof_role: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_4_C13_ft_1d_mandatory_before_ws3: TRUE`
- `stage_13B_4_C13_next_gate: FT_1G_ACTIVITY_ALIGNMENT_AUTHORIZATION_GATE`
