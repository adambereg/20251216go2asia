# Stage 13B.4-Z - Next Prompt Bootstrap

Use this prompt to start the next Cursor chat or a new Cursor account context.

???text
Repo:
E:/projects/work_go2asia/20251216go2asia

Language:
Respond in Russian.

Mode:
Activate multi-agent mode before working.
Use AI agents from docs/ai as the role model.
Recommended model: GPT-5.5 Medium.

Task:
Prepare Stage 13B.5-A + Stage 13B.5-B governance/planning output for Foundation Trio Runtime Readiness: WS-3 + WS-5.

Critical context:
Stage 13B.4-C17 is accepted.
WS-1 Private Repost Runtime Foundation is complete as a bounded runtime primitive.
Current WS-1 status:
WS1_BOUNDED_COMPLETE

This means:
- Private Repost is owner-only retained context.
- Private Note is optional private text inside Private Repost.
- Bookmark remains a Reactions-owned reaction fact.
- Legacy Repost Row is historical artifact only for WS-1 proof.
- WS-1 can be used as bounded input to Foundation Trio readiness.

This does NOT mean:
- Foundation Trio ready.
- WS-2 authorized.
- WS-3 authorized.
- WS-5 full complete.
- WS-6 full complete.
- WS-7 complete.
- WS-8 BV executed.

Read first:
1. docs/reports/stage_13B_4_Z_transfer_pack_for_new_cursor_context_v1.md
2. docs/reports/stage_13B_4_Z_foundation_trio_preflight_audit_v1.md
3. docs/reports/stage_13B_4_C17_ft_1H_ws1_closure_evidence_review_v1.md

Then read:
- docs/reports/stage_13B_4_B_foundation_trio_implementation_planning_v1.md
- docs/reports/stage_13B_3_A_private_repost_runtime_surface_specification_v1.md
- docs/reports/stage_13B_3_B_authorial_post_and_source_reference_runtime_specification_v1.md
- docs/reports/stage_13B_3_C_ws_5_legacy_runtime_handling_specification_v1.md
- docs/reports/stage_13B_3_F_ws_6_activity_projection_specification_v1.md

Optional runtime files for inspection only:
- apps/space-service/src/domain/retentionIntent.ts
- apps/space-service/src/services/spaceService.ts
- apps/space-service/src/db/queries/space.ts
- apps/space-service/test/request.test.ts
- apps/reactions-service/src/services/reactionsService.ts
- apps/reactions-service/test/request.test.ts
- apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx
- apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx
- apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPublicationsSurface.tsx
- apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx
- packages/db/migrations/0015_space_core_v1.sql
- packages/db/migrations/0042_space_activity_projection_v1.sql
- docs/openapi/space.yaml

Hard prohibitions:
- Do not code.
- Do not implement.
- Do not modify runtime.
- Do not create migrations.
- Do not change DB schema.
- Do not change OpenAPI.
- Do not regenerate SDK.
- Do not change frontend.
- Do not change backend.
- Do not change UI copy.
- Do not open WS-2.
- Do not start WS-3 implementation.
- Do not start WS-5 implementation.
- Do not declare Foundation Trio ready.

Primitive boundaries:
- Bookmark = Reactions-owned reaction fact.
- Private Repost = Space-owned owner-only retained context.
- Private Note = optional private text inside Private Repost.
- Authorial Post = not Private Note, not repost commentary, not legacy row.
- Source Reference = not repostTarget rename.
- Legacy Row = historical artifact, not proof of new primitives.
- Activity projection = projection, not authority.
- UI copy = not runtime proof.

Goal for the next chat:
Produce governance/planning output for:
Stage 13B.5-A - Foundation Trio WS-3 / WS-5 Readiness Authorization Gate
and optionally:
Stage 13B.5-B - WS-3 / WS-5 Joint Planning

The output must decide:
- whether WS-3 and WS-5 can safely enter planning;
- what dependencies exist between Authorial Post, Source Reference, and Legacy Runtime Handling;
- what false-pass risks must block implementation;
- what implementation remains forbidden until a later explicit gate.

Expected next-safe status:
Planning/governance only.
Not implementation.
Not Foundation Trio ready.
Not WS-2 authorized.
Not WS-3 authorized for coding unless a separate future gate explicitly says so.

Use the Stage 13B.4-Z transfer pack as source of truth for current state and risk boundaries.
???

Bootstrap status:

- `stage_13B_4_Z_bootstrap_prompt_ready: TRUE`
- `stage_13B_4_Z_next_prompt_target: STAGE_13B_5_A_PLUS_OPTIONAL_13B_5_B_GOVERNANCE_PLANNING_ONLY`
- `stage_13B_4_Z_bootstrap_for_implementation: FALSE`
- `stage_13B_4_Z_bootstrap_foundation_trio_ready_claim: FALSE`
- `stage_13B_4_Z_bootstrap_ws2_authorized: FALSE`
- `stage_13B_4_Z_bootstrap_ws3_authorized: FALSE`
