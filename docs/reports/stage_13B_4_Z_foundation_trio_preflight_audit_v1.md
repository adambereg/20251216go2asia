# Stage 13B.4-Z - Foundation Trio Preflight Audit

## 1. Executive Summary

Stage 13B.4-Z is a read-only preflight audit after the WS-1 Private Repost Runtime Foundation closure.

Current accepted WS-1 status:

- `stage_13B_4_C17_status: WS1_BOUNDED_COMPLETE`
- `stage_13B_4_C17_ws1_bounded_complete: TRUE`
- `stage_13B_4_C17_foundation_trio_input_valid: TRUE`

What is actually complete:

- Private Repost exists as a bounded owner-only retention primitive.
- Private Note exists as owner-only text inside Private Repost.
- Private Repost dedupe is retention-scoped.
- Bookmark remains a Reactions-owned reaction fact.
- Legacy repost-shaped rows are distinguished as historical artifacts for WS-1 proof.
- New Private Repost no longer materializes social repost activity pressure.

What is not complete:

- Foundation Trio is not ready.
- WS-2 public/group repost elimination is not authorized.
- WS-3 Authorial Post + Source Reference is not runtime-complete and not authorized for implementation.
- WS-5 full Legacy Runtime Handling is not complete.
- WS-6 full Activity Projection alignment is not complete.
- WS-7 language/copy alignment is not complete.
- WS-8 BV execution has not run.

Why this preflight audit is required before Stage 13B.5:

- Stage 13B.5 will operate near the highest-risk semantic boundary: Private Repost, Authorial Post, Source Reference, and Legacy Repost Row.
- Current runtime still contains repost-shaped storage, API, generated DTO, feed, activity, and UI surfaces.
- A new Cursor context must not infer that `WS1_BOUNDED_COMPLETE` means Foundation Trio readiness.
- The next safe step is governance/planning for WS-3 + WS-5 readiness, not implementation.

Execution mode:

- audit;
- inspection;
- inventory;
- evidence analysis;
- transfer packaging;
- no code changes;
- no runtime changes;
- no migrations;
- no OpenAPI or SDK changes;
- no frontend/backend changes.

Multi-agent mode:

- activated with GPT-5.5 Medium subagents;
- framed against `docs/ai` role model and runtime governance expectations;
- subagent findings were used as evidence inputs, not as permission to implement.

Preflight verdict:

`FOUNDATION_TRIO_PREFLIGHT_AUDIT_COMPLETE`

Blocker verdict:

`stage_13B_4_Z_blockers_found: FALSE`

Meaning of blocker verdict:

- no blocker was found for the next planning/governance gate;
- implementation remains blocked until a separate Stage 13B.5 authorization gate.

## 2. Source Reports Reviewed

Report placement pattern found:

- Stage reports are located under `docs/reports`.
- Stage 13B.4-Z reports are therefore placed under `docs/reports`.

Reviewed reports:

| Report | Status | Finding |
| --- | --- | --- |
| `docs/reports/stage_13B_4_C1_ft_1A_retention_intent_implementation_v1.md` | FOUND | FT-1A implementation evidence present. |
| `docs/reports/stage_13B_4_C3_ft_1B_owner_visibility_implementation_v1.md` | FOUND | FT-1B implementation evidence present. |
| `docs/reports/stage_13B_4_C6_ft_1C_private_note_implementation_v1.md` | FOUND | FT-1C implementation evidence present. |
| `docs/reports/stage_13B_4_C8_ft_1D_retention_dedupe_implementation_v1.md` | FOUND | FT-1D implementation evidence present. |
| `docs/reports/stage_13B_4_C11_ft_1E_bookmark_separation_implementation_v1.md` | FOUND | FT-1E implementation evidence present. |
| `docs/reports/stage_13B_4_C13_ft_1F_legacy_boundary_implementation_v1.md` | FOUND | FT-1F implementation evidence present. |
| `docs/reports/stage_13B_4_C14_C15_ft_1G_activity_alignment_authorization_and_implementation_v1.md` | FOUND | Combined C14/C15 authorization + implementation evidence present. |
| `docs/reports/stage_13B_4_C16_ft_1H_ws1_closure_evidence_authorization_v1.md` | FOUND | FT-1H closure review authorization present. |
| `docs/reports/stage_13B_4_C17_ft_1H_ws1_closure_evidence_review_v1.md` | FOUND | WS-1 bounded closure evidence review present. |

Audit finding:

- no required C1/C3/C6/C8/C11/C13/C14-C15/C16/C17 report is missing.
- C14 and C15 are intentionally represented by one combined report file.

Supporting specification reports inspected:

- `docs/reports/stage_13B_3_A_private_repost_runtime_surface_specification_v1.md`
- `docs/reports/stage_13B_3_B_authorial_post_and_source_reference_runtime_specification_v1.md`
- `docs/reports/stage_13B_3_C_ws_5_legacy_runtime_handling_specification_v1.md`
- `docs/reports/stage_13B_3_F_ws_6_activity_projection_specification_v1.md`
- `docs/reports/stage_13B_4_B_foundation_trio_implementation_planning_v1.md`

## 3. WS-1 Runtime Reality Verification

| Slice | Declared status | Runtime evidence | Files inspected | Remaining risk | Sufficient for `WS1_BOUNDED_COMPLETE` |
| --- | --- | --- | --- | --- | --- |
| FT-1A Retention Intent | `FT_1A_IMPLEMENTATION_COMPLETE` | `postType: repost` plus `visibility: private` is classified as `private_repost_intent`; PWA object-bound action builds private repost request. | `apps/space-service/src/domain/retentionIntent.ts`; `apps/go2asia-pwa-shell/modules/space/retentionIntent.ts`; `apps/space-service/src/services/spaceService.ts`; `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`; `apps/space-service/test/request.test.ts` | UI copy still says publish/repost; WS-7 risk. | YES |
| FT-1B Owner Visibility | `FT_1B_IMPLEMENTATION_COMPLETE` | `canViewPost` permits owner and denies non-owner private visibility; owner retention URL and publication filtering exist. | `apps/space-service/src/services/spaceService.ts`; `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPublicationsSurface.tsx`; `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedSurface.tsx`; `apps/space-service/test/request.test.ts` | Legacy/public repost rows remain visible elsewhere; WS-5/WS-2 risk. | YES |
| FT-1C Private Note | `FT_1C_IMPLEMENTATION_COMPLETE` | `classifyRepostTextRole` maps private repost text to `private_note`; owner surfaces display/edit Private Note. | `apps/space-service/src/domain/retentionIntent.ts`; `apps/space-service/src/services/spaceService.ts`; `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPublicationsSurface.tsx`; `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`; `apps/space-service/test/request.test.ts` | Private Note can be confused with Authorial Text if WS-3 ignores boundary. | YES |
| FT-1D Retention Dedupe | `FT_1D_IMPLEMENTATION_COMPLETE` | `findActiveRepostByAuthorAndTarget` accepts `retention` vs `propagation` scope; `createPost` chooses scope from repost write intent. | `apps/space-service/src/db/queries/space.ts`; `apps/space-service/src/services/spaceService.ts`; `apps/space-service/test/request.test.ts` | Standard post non-blocking is a bounded proxy; full WS-3 still needs its own proof. | YES |
| FT-1E Bookmark Separation | `FT_1E_IMPLEMENTATION_COMPLETE` | Reactions bookmark writes remain reaction facts; Space retention dedupe does not read Reactions; saved surfaces hydrate bookmarks. | `apps/reactions-service/src/services/reactionsService.ts`; `apps/reactions-service/test/request.test.ts`; `apps/go2asia-pwa-shell/app/(public)/space/saved/SavedPostsPageClient.tsx`; `apps/go2asia-pwa-shell/components/space/runtime/useSpaceSavedReactions.ts`; `apps/space-service/test/request.test.ts` | Saved UI may be misread as retention inventory; governance/copy risk. | YES |
| FT-1F Legacy Boundary | `FT_1F_IMPLEMENTATION_COMPLETE` | Tests prove legacy-shaped rows are historical artifacts only and not Private Repost, Private Note, Bookmark, Authorial Post, or Source Reference proof. | `apps/space-service/test/request.test.ts`; `apps/reactions-service/test/request.test.ts`; `docs/reports/stage_13B_4_C13_ft_1F_legacy_boundary_implementation_v1.md` | Full per-surface legacy policy remains WS-5. | YES |
| FT-1G Activity Alignment | `FT_1G_IMPLEMENTATION_COMPLETE` | `createPost` skips outgoing and incoming social repost activity when `repostWriteIntent === 'private_repost_intent'`; public/group activity remains preserved. | `apps/space-service/src/services/spaceService.ts`; `apps/space-service/test/request.test.ts`; `apps/space-service/src/db/queries/space.ts`; `apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx` | Historical/public/group activity and activity UI remain WS-6/WS-5/WS-7. | YES |
| FT-1H Closure Evidence Review | `WS1_BOUNDED_COMPLETE` | C17 reviews FT-1A through FT-1G and classifies external gaps away from WS-1. | `docs/reports/stage_13B_4_C16_ft_1H_ws1_closure_evidence_authorization_v1.md`; `docs/reports/stage_13B_4_C17_ft_1H_ws1_closure_evidence_review_v1.md` | False pass if a future context treats WS-1 completion as Foundation Trio readiness. | YES |

Verification commands run during this audit:

- `pnpm --filter @go2asia/space-service test -- request.test.ts` -> PASS, 47 tests passed.
- `pnpm --filter @go2asia/reactions-service test -- request.test.ts` -> PASS, 20 tests passed.
- `pnpm --filter @go2asia/space-service typecheck` -> PASS.
- `pnpm --filter @go2asia/reactions-service typecheck` -> PASS.

## 4. Runtime Primitive Inventory

| Primitive | Runtime Exists | Canonical Owner | Evidence | Notes |
| --- | --- | --- | --- | --- |
| Bookmark | YES | Reactions service | `apps/reactions-service/src/services/reactionsService.ts`; `apps/reactions-service/test/request.test.ts`; saved PWA surfaces | Reaction fact with `reactionType: bookmark`; not Private Repost. |
| Private Repost | YES, bounded | Space service | `apps/space-service/src/domain/retentionIntent.ts`; `apps/space-service/src/services/spaceService.ts`; `apps/go2asia-pwa-shell/modules/space/retentionIntent.ts` | Implemented as `postType: repost` + `visibility: private`; owner-only retention primitive. |
| Private Note | YES, bounded | Space service | `classifyRepostTextRole`; owner retention focus card; request tests | Optional text inside Private Repost; not Authorial Text. |
| Legacy Repost Row | YES | Space service / WS-5 policy future | `space_post` schema; feed/activity/profile surfaces; C13 tests | Historical artifact only for WS-1 proof; full WS-5 incomplete. |
| Authorial Post | PARTIAL TECHNICAL SHAPE ONLY | Future WS-3 | `postType: post` exists; WS-3 spec says Source Reference absent | Not runtime-ready as canon Authorial Post; not authorized by this audit. |
| Source Reference | NO | Future WS-3 | WS-3 spec; C13 tests assert no `sourceReference` proof | Must not be implemented as `repostTarget` rename. |
| Activity Event | YES | Space activity projection | `apps/space-service/src/services/spaceService.ts`; `packages/db/migrations/0042_space_activity_projection_v1.sql`; `ActivityPageClient.tsx` | Private Repost pressure removed; historical/public/group activity remains. |
| Feed Projection | YES | Space service / PWA | `listHomeFeedRows`; `SpaceFeedSurface`; `SpaceFeedCard` | Repost lane remains for public/group/legacy; WS-5/WS-7 risk. |
| Profile/Public Projection | YES | Space service / PWA | `listProfileFeedRows`; `PostsPublicationsSurface` | Private retention excluded; non-private reposts can remain visible. |
| Group Feed Projection | YES | Space service / PWA | `listGroupFeedPosts`; group visibility query | Private retention not group content; authorial-only group feed remains WS-4/WS-5/WS-3 concern. |

## 5. Legacy Surface Inventory

| Surface | File/path | Current behavior | Owning workstream | Risk |
| --- | --- | --- | --- | --- |
| `space_post` repost storage | `packages/db/migrations/0015_space_core_v1.sql` | Defines `post_type = 'repost'`, `repost_target_type`, `repost_target_id`, constraints and indexes. | WS-1 / WS-3 / WS-5 | HIGH |
| Repost write/read service | `apps/space-service/src/services/spaceService.ts` | Creates repost rows, maps repost target, keeps convenience `repostPost` public default, emits domain events. | WS-1 / WS-2 / WS-3 / WS-5 | HIGH |
| Dedupe query | `apps/space-service/src/db/queries/space.ts` | Separates retention and propagation dedupe, but still operates on repost-shaped rows. | WS-1 / WS-3 / WS-5 | MEDIUM |
| Activity backfill | `packages/db/migrations/0042_space_activity_projection_v1.sql` | Backfills `space.repost_created` and `space.post_reposted_by_other` from historical repost rows. | WS-5 / WS-6 | HIGH |
| Activity service materialization | `apps/space-service/src/services/spaceService.ts` | Skips private retention activity; preserves public/group repost activity. | WS-1 / WS-6 | HIGH |
| Activity UI | `apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx` | Filters and labels repost activity as `Репосты`, `Вы сделали репост`, `Открыть репост`. | WS-6 / WS-7 | HIGH |
| Feed card repost rendering | `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx` | Renders repost preview and labels private note vs public commentary. | WS-3 / WS-5 / WS-7 | HIGH |
| Home feed filters/copy | `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedSurface.tsx` | Keeps `Репосты` filter, excludes private retention from repost count. | WS-5 / WS-7 | MEDIUM |
| Profile/publications surface | `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPublicationsSurface.tsx` | Owner retention focus exists; non-private reposts remain publication-adjacent. | WS-3 / WS-5 / WS-7 | HIGH |
| Content actions copy | `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx` | Share-to-Space creates Private Repost but success/copy still says publish/repost. | WS-7 / WS-3 | HIGH |
| Saved surfaces | `apps/go2asia-pwa-shell/app/(public)/space/saved/SavedPostsPageClient.tsx`; `useSpaceSavedReactions.ts` | Hydrates bookmark facts, including `space_post` targets. | WS-1 / WS-5 | MEDIUM |
| OpenAPI contracts | `docs/openapi/space.yaml`; `docs/openapi/openapi.bundle.yaml` | Expose repost target, update repost commentary, convenience repost, activity repost enums. | WS-3 / WS-5 / WS-6 / WS-7 | MEDIUM-HIGH |
| Generated SDK/types | `packages/sdk/src/generated/*repost*`; `packages/types/src/generated/*repost*` | Generated repost DTOs remain first-class client vocabulary. | WS-7 / WS-8 | MEDIUM |
| Points allowlist | `apps/points-service/src/producerAllowlist.ts` | `space_repost_created` exists as `FUTURE_ONLY`. | WS-6 / WS-8 | MEDIUM |
| Tests and mocks | `apps/space-service/test/request.test.ts`; `apps/reactions-service/test/request.test.ts` | Strong WS-1 proof, but future contexts may overread mocks/fixtures as product readiness. | WS-8 / governance | MEDIUM |

Legacy inventory conclusion:

- legacy/repost-shaped behavior remains intentionally present in storage, contracts, feed, profile, group, activity, UI copy, and tests;
- WS-1 is complete only because these surfaces are classified correctly, not because they disappeared;
- Stage 13B.5 must not use disappearance/hiding of legacy rows as proof.

## 6. WS-3 Risk Map

| Risk | Evidence surface | Risk level | Required guard |
| --- | --- | --- | --- |
| Authorial Post confused with Private Note | `SpaceFeedCard`; `PostsPublicationsSurface`; `retentionIntent.ts` | HIGH | Authorial Text must be primary publication text, not owner-only note. |
| Authorial Post confused with repost commentary | `SpaceFeedCard`; `updateRepostCommentaryRequest`; `ContentActionRow` copy | HIGH | Public commentary lane must not become Authorial Post by rename. |
| Authorial Post confused with legacy repost row | `listProfileFeedRows`; `SpaceFeedCard`; C13 fixtures | HIGH | Legacy rows must stay historical artifacts until WS-5 policy defines treatment. |
| Source Reference confused with `repostTarget` | `space_post.repost_target_type`; `mapPostResponse`; generated `SpacePostRepostRef` | HIGH | Source Reference must be a separate WS-3 primitive, not `repostTarget` rename. |
| Source Reference confused with legacy repost binding | C13 tests; legacy feed/profile rows | HIGH | Legacy binding cannot be Source Reference proof. |
| Source Reference confused with Private Repost source | `buildPrivateRepostIntentRequest`; `post.repost` response shape | HIGH | Retention binding remains owner-only context, not public provenance. |
| Authorial Post confused with Bookmark/Save | Reactions bookmark service; saved PWA surfaces | MEDIUM | Bookmark is a reaction fact, not publication. |
| Generated repost DTOs bias WS-3 implementation | `docs/openapi/space.yaml`; generated SDK/types | MEDIUM | WS-3 gate must decide whether new contract is needed before code. |

Strict WS-3 conclusion:

- WS-3 is not authorized by this audit.
- Authorial Post and Source Reference remain not runtime-complete.
- A separate Stage 13B.5 authorization gate is required before any WS-3 implementation.

## 7. WS-5 Risk Map

| Risk | Evidence surface | Risk level | Required guard |
| --- | --- | --- | --- |
| Legacy rows already exist as repost-shaped storage | `packages/db/migrations/0015_space_core_v1.sql`; `space_post` queries | HIGH | WS-5 must classify, not auto-convert. |
| Legacy rows remain readable in feed/profile/group surfaces | `queries/space.ts`; `SpaceFeedSurface`; `PostsPublicationsSurface` | HIGH | Per-surface policy matrix required. |
| Legacy activity remains readable | `0042_space_activity_projection_v1.sql`; `ActivityPageClient.tsx` | HIGH | Historical activity carve-out required. |
| Legacy row mistaken as Private Repost | C13 proof; private vs non-private visibility | MEDIUM | Preserve `HISTORICAL_ARTIFACT_ONLY` boundary. |
| Legacy row mistaken as Authorial Post | Profile/publication surfaces; feed reason mapping | HIGH | WS-5 + WS-3 must prevent authorial proof from legacy rows. |
| Legacy row mistaken as Source Reference | `repost_target_type/id`; no `sourceReference` field | HIGH | No Source Reference from legacy binding. |
| Hidden/deleted legacy row creates false pass | Any future feed/profile/activity change | HIGH | Do not hide/delete/migrate legacy rows merely to pass tests. |
| Bookmark on legacy row mistaken as identity merge | Reactions tests | MEDIUM | Bookmark remains reaction fact only. |

Strict WS-5 conclusion:

- FT-1F completed only the WS-1-side legacy distinction.
- Full WS-5 is not complete.
- WS-5 is not authorized for implementation by this audit.

## 8. Foundation Trio Readiness Assessment

| Component | Status | Assessment |
| --- | --- | --- |
| WS-1 Private Repost | `WS1_BOUNDED_COMPLETE` | Complete as bounded owner-only retention primitive. |
| WS-3 Authorial Post + Source Reference | Not authorized / not runtime-complete | Requires Stage 13B.5 readiness authorization and planning before implementation. |
| WS-5 Legacy Runtime Handling | Not authorized / not runtime-complete | Requires full legacy policy, taxonomy, and per-surface matrix. |
| Foundation Trio | Not complete | WS-1 can be input; WS-3 and WS-5 remain missing. |
| WS-2 | Not authorized | Must remain blocked until Foundation Trio closure. |
| WS-6 | Not complete | Private retention no-pressure is done; full activity projection remains later work. |
| WS-7 | Not complete | UI/copy still contains repost/share/publish terminology. |
| WS-8 | Not executed | BV not run. |

Final preflight verdict:

`FOUNDATION_TRIO_PREFLIGHT_AUDIT_COMPLETE`

Recommended safe next gate:

`Stage 13B.5-A - Foundation Trio WS-3 / WS-5 Readiness Authorization Gate`

Allowed alternative after human review:

- combined planning/governance-only stage: `Stage 13B.5-A + Stage 13B.5-B`
- only if it remains planning/readiness, not implementation.

Final status tokens:

- `stage_13B_4_Z_status: FOUNDATION_TRIO_PREFLIGHT_AUDIT_COMPLETE`
- `stage_13B_4_Z_blockers_found: FALSE`
- `stage_13B_4_Z_ws1_status: WS1_BOUNDED_COMPLETE`
- `stage_13B_4_Z_foundation_trio_ready: FALSE`
- `stage_13B_4_Z_ws2_authorized: FALSE`
- `stage_13B_4_Z_ws3_authorized: FALSE`
- `stage_13B_4_Z_ws5_full_complete: FALSE`
- `stage_13B_4_Z_next_gate: STAGE_13B_5_A_FOUNDATION_TRIO_WS3_WS5_READINESS_AUTHORIZATION_GATE`
