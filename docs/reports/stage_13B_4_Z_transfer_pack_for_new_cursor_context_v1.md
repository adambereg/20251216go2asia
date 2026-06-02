# Stage 13B.4-Z - Transfer Pack for New Cursor Context

## 1. Current Project State

Current state:

- Stage 13B.4-C17 is complete.
- WS-1 Private Repost Runtime Foundation is `WS1_BOUNDED_COMPLETE`.
- Private Repost is a bounded owner-only retention primitive.
- WS-1 can be used as input to a future Foundation Trio readiness path.
- Foundation Trio is not ready.
- Stage 13B.5 is the next major front.
- Current safe next step is governance/planning only.

Next intended front:

- `Stage 13B.5 - Foundation Trio Runtime Readiness: WS-3 + WS-5`

Safe immediate next gate:

- `Stage 13B.5-A - Foundation Trio WS-3 / WS-5 Readiness Authorization Gate`

Allowed after human review:

- combine with `Stage 13B.5-B - WS-3 / WS-5 Joint Planning`
- only if the combined stage remains governance/planning-only.

Do not infer:

- Foundation Trio ready;
- WS-2 authorized;
- WS-3 authorized;
- WS-5 complete.

## 2. Status Ledger

Accepted C17 tokens:

- `stage_13B_4_C17_status: WS1_BOUNDED_COMPLETE`
- `stage_13B_4_C17_ws1_bounded_complete: TRUE`
- `stage_13B_4_C17_foundation_trio_input_valid: TRUE`
- `stage_13B_4_C17_foundation_trio_ready: FALSE`
- `stage_13B_4_C17_ws2_authorized: FALSE`
- `stage_13B_4_C17_ws3_authorized: FALSE`
- `stage_13B_4_C17_ws5_full_complete: FALSE`
- `stage_13B_4_C17_ws6_full_complete: FALSE`
- `stage_13B_4_C17_ws7_complete: FALSE`
- `stage_13B_4_C17_ws8_bv_executed: FALSE`
- `stage_13B_4_C17_next_gate: FOUNDATION_TRIO_WS3_WS5_READINESS_AUTHORIZATION_GATE`

Stage 13B.4-Z tokens:

- `stage_13B_4_Z_status: FOUNDATION_TRIO_PREFLIGHT_AUDIT_COMPLETE`
- `stage_13B_4_Z_blockers_found: FALSE`
- `stage_13B_4_Z_transfer_ready: TRUE`
- `stage_13B_4_Z_foundation_trio_ready: FALSE`
- `stage_13B_4_Z_ws2_authorized: FALSE`
- `stage_13B_4_Z_ws3_authorized: FALSE`
- `stage_13B_4_Z_ws5_full_complete: FALSE`
- `stage_13B_4_Z_next_gate: STAGE_13B_5_A_FOUNDATION_TRIO_WS3_WS5_READINESS_AUTHORIZATION_GATE`

Interpretation:

- `blockers_found: FALSE` means no blocker was found for the next governance/planning gate.
- It does not authorize implementation.
- It does not declare Foundation Trio ready.

## 3. Key Files to Open First

Open these reports first:

- `docs/reports/stage_13B_4_C17_ft_1H_ws1_closure_evidence_review_v1.md`
- `docs/reports/stage_13B_4_Z_foundation_trio_preflight_audit_v1.md`
- `docs/reports/stage_13B_4_Z_transfer_pack_for_new_cursor_context_v1.md`
- `docs/reports/stage_13B_4_Z_next_prompt_bootstrap_v1.md`
- `docs/reports/stage_13B_4_C16_ft_1H_ws1_closure_evidence_authorization_v1.md`
- `docs/reports/stage_13B_4_B_foundation_trio_implementation_planning_v1.md`
- `docs/reports/stage_13B_3_A_private_repost_runtime_surface_specification_v1.md`
- `docs/reports/stage_13B_3_B_authorial_post_and_source_reference_runtime_specification_v1.md`
- `docs/reports/stage_13B_3_C_ws_5_legacy_runtime_handling_specification_v1.md`
- `docs/reports/stage_13B_3_F_ws_6_activity_projection_specification_v1.md`

Open these runtime files next:

- `apps/space-service/src/domain/retentionIntent.ts`
- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/src/db/queries/space.ts`
- `apps/space-service/test/request.test.ts`
- `apps/reactions-service/src/services/reactionsService.ts`
- `apps/reactions-service/src/db/queries/reactions.ts`
- `apps/reactions-service/test/request.test.ts`
- `apps/go2asia-pwa-shell/modules/space/retentionIntent.ts`
- `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedSurface.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPublicationsSurface.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/saved/SavedPostsPageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/useSpaceSavedReactions.ts`

Open these schema / contract / generated surfaces only for audit context:

- `packages/db/migrations/0015_space_core_v1.sql`
- `packages/db/migrations/0042_space_activity_projection_v1.sql`
- `docs/openapi/space.yaml`
- `docs/openapi/openapi.bundle.yaml`
- `packages/sdk/src/generated/spaceRepostTargetType.ts`
- `packages/sdk/src/generated/spacePostRepostRef.ts`
- `packages/sdk/src/generated/createSpaceRepostRequest.ts`
- `packages/sdk/src/generated/updateRepostCommentaryRequest.ts`
- `packages/types/src/generated/spaceRepostTargetType.ts`
- `apps/points-service/src/producerAllowlist.ts`

## 4. Runtime Primitive Boundaries

- Bookmark = Reactions-owned reaction fact.
- Private Repost = Space-owned owner-only retained context.
- Private Note = optional private text inside Private Repost.
- Authorial Post = not Private Note, not repost commentary, not bookmark, not legacy row.
- Source Reference = not a `repostTarget` rename.
- Legacy row = historical artifact, not runtime proof for post-transition primitives.
- Activity projection = projection layer, not doctrine authority.
- UI copy = not runtime proof.
- Lookup/hydration = not primitive proof.
- Generated DTO vocabulary = contract evidence, not canon alignment by itself.

## 5. Strict Do-Not-Cross Boundaries

- Do not open WS-2 before Foundation Trio closure.
- Do not implement WS-3 without a separate authorization gate.
- Do not implement Source Reference without a separate authorization gate.
- Do not implement WS-5 without planning/gate.
- Do not convert legacy rows into new primitives.
- Do not hide legacy rows to pass tests.
- Do not delete or migrate legacy rows without explicit WS-5 authorization.
- Do not treat `repostTargetType` / `repostTargetId` as Source Reference.
- Do not treat Private Note as Authorial Text.
- Do not treat Bookmark as Private Repost.
- Do not treat activity projection rows as canon.
- Do not treat UI label changes as runtime evidence.
- Do not use mocks or fixtures as product readiness proof.
- Do not modify DB schema, OpenAPI, SDK, frontend, backend, migrations, or runtime during governance/planning stages.

## 6. Recommended Next Slice

Recommended next step:

`Stage 13B.5-A - Foundation Trio WS-3 / WS-5 Readiness Authorization Gate`

Allowed combined governance/planning alternative:

`Stage 13B.5-A + Stage 13B.5-B - WS-3 / WS-5 Joint Planning`

Conditions:

- must remain planning/governance only;
- must not implement WS-3;
- must not implement WS-5;
- must not open WS-2;
- must not claim Foundation Trio readiness.

Recommended Stage 13B.5-A focus:

- decide whether WS-3 and WS-5 should be authorized as paired planning work;
- define the minimum WS-5 legacy policy matrix needed before WS-3 implementation;
- define source-reference anti-collapse rules before any API/schema work;
- preserve WS-1 as bounded input rather than reopening it.

## 7. Suggested Validation Commands

Commands run during Stage 13B.4-Z audit:

- `pnpm --filter @go2asia/space-service test -- request.test.ts`
  - Result: PASS, 47 tests passed.
- `pnpm --filter @go2asia/reactions-service test -- request.test.ts`
  - Result: PASS, 20 tests passed.
- `pnpm --filter @go2asia/space-service typecheck`
  - Result: PASS.
- `pnpm --filter @go2asia/reactions-service typecheck`
  - Result: PASS.
- `git status --short --branch`
  - Result: dirty working tree existed before Z reports and remains dirty after report creation.

Existing relevant root scripts from `package.json`:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm test:ci`
- `pnpm format:check`
- `pnpm openapi:check`
- `pnpm guardrails:mock-env:check`
- `pnpm guardrails:mock-imports:check`

Existing relevant scoped scripts:

- `pnpm --filter @go2asia/space-service test -- request.test.ts`
- `pnpm --filter @go2asia/space-service typecheck`
- `pnpm --filter @go2asia/space-service lint`
- `pnpm --filter @go2asia/reactions-service test -- request.test.ts`
- `pnpm --filter @go2asia/reactions-service typecheck`
- `pnpm --filter @go2asia/reactions-service lint`
- `pnpm --filter @go2asia/pwa-shell typecheck`
- `pnpm --filter @go2asia/pwa-shell lint`

Recommended before any Stage 13B.5 implementation is later authorized:

- run `pnpm --filter @go2asia/space-service test -- request.test.ts`;
- run `pnpm --filter @go2asia/reactions-service test -- request.test.ts`;
- run service typechecks for touched services;
- run PWA typecheck if any UI surface is inspected or modified;
- run `pnpm openapi:check` before any API/SDK discussion becomes implementation-bound;
- run `git diff --check` before commit.

## 8. Known Risks for the New Cursor Context

- Semantic drift from `WS1_BOUNDED_COMPLETE` into false Foundation Trio readiness.
- Assuming spec-only primitives are runtime-ready.
- Using legacy rows as proof for Authorial Post or Source Reference.
- Merging Source Reference with `repostTarget`.
- Treating Private Note as Authorial Text.
- Treating Bookmark/Save as Private Repost.
- Implementing too much in one prompt.
- Treating UI labels as runtime evidence.
- False pass through mocks or fixtures.
- Hiding legacy rows instead of classifying them.
- Starting WS-2 because WS-1 is complete.
- Starting WS-3 implementation before WS-5 planning clarifies legacy distinctions.

Final transfer status:

`STAGE_13B_4_Z_COMPLETE_TRANSFER_READY`
