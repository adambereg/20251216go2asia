# Stage 13B.2-C - Repost Doctrine Audit

## Execution mode

Read-only audit / doctrine alignment / no implementation.

No code, OpenAPI, SDK/types, DB schema, economy, activity semantics, Connect, comments/replies taxonomy, or runtime behavior was changed.

Task type: doctrine audit and runtime-governance review.

Risk level: HIGH, because the new repost doctrine changes product semantics for public visibility, group feeds, repost as social propagation, and authorial post boundaries.

Context capsule:

- Space Asia feed, group feed, saved/activity surfaces.
- Blog Asia, Atlas, Pulse, RF, Quest as possible source/reference domains.
- Current Stage 13B.2-A/B/BR implementation around repost commentary.
- New doctrine: repost is private user context; group feed should contain standalone authorial posts, not repost propagation.

Tests were not run, by scope. Runtime conclusions are explicitly marked as proven from code, inferred from docs, observed from provided screenshots, or needs staging verification.

## Agents

Multi-agent mode was activated using the `docs/ai` role model:

- Lead: AI Program Director / Orchestrator, based on `docs/ai/roles/orchestrator.md`.
- Requirements Analyst, based on `docs/ai/roles/requirements_analyst.md`.
- Software Architect, based on `docs/ai/roles/architect.md`.
- Runtime Governance Architect, based on `docs/ai/roles/runtime_governance_architect.md`.
- Product Analyst, used as doctrine/product semantics reviewer.
- QA Agent, based on `docs/ai/roles/qa.md`.
- Technical Canon Writer, based on `docs/ai/roles/tech_writer.md`.

Review gates applied:

- Requirements Review.
- Architecture Review.
- Runtime Governance Review.
- QA Review.
- Canon Review.

## New repost doctrine

New Go2Asia repost doctrine for this audit:

1. Repost is private user context.
2. Repost of original material is allowed only into the user's personal private feed.
3. Repost must not be directly published to a thematic group.
4. Reaction to material is a standalone user post, not a public repost.
5. User may write an authorial post inspired by source material.
6. Such post may contain a local reference to source material from Blog, Atlas, Pulse, RF, Quest, or Space.
7. Such post may be published to a thematic group.
8. Group feed contains standalone authorial posts, not repost propagation items.
9. A response to a group post is another standalone post with optional local reference to the nearest source post.
10. Go2Asia does not need to store or show full reply/repost chains.
11. Group feed exists to grow high-quality authorial materials that may become Blog Asia candidates.

Product formula:

- Go2Asia does not build chains of reactions.
- Go2Asia stimulates users to turn reaction into standalone authorial material.

Doctrine consequence:

- Current Stage 13B.2-A/B repost commentary is valid as implemented work, but under the new doctrine it should be treated as a private retention/context mechanism, not a public social publishing primitive.

## Files inspected

Required reports:

- `docs/reports/stage_13B_2_A_repost_commentary_composer_v1.md`
- `docs/reports/stage_13B_2_B_repost_commentary_edit_upgrade_flow_v1.md`
- `docs/reports/stage_13B_2_B_runtime_reality_verification_v1.md`
- `docs/reports/stage_13B_2_BR_repost_commentary_runtime_activation_fix_v1.md`

Required runtime files:

- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedSurface.tsx`
- `apps/go2asia-pwa-shell/components/interaction/ShareToSpaceComposer.tsx`
- `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/utils.ts`
- `apps/go2asia-pwa-shell/app/(public)/space/community/groups/[groupId]/GroupPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx`
- `apps/space-service/src/routes/posts.ts`
- `apps/space-service/src/services/spaceService.ts`
- `apps/space-service/src/db/queries/space.ts`
- `apps/space-service/src/index.ts`
- `apps/api-gateway/src/index.ts`
- `docs/openapi/space.yaml`

Additional relevant legacy/mock files:

- `apps/go2asia-pwa-shell/components/space/Feed/PostCard.tsx`
- `apps/go2asia-pwa-shell/components/space/Feed/FeedView.tsx`
- `apps/go2asia-pwa-shell/components/space/types.ts`
- `apps/go2asia-pwa-shell/components/space/Dashboard/ActivityBlock.tsx`
- `apps/go2asia-pwa-shell/components/space/mockData.ts` was identified by search as legacy/mock surface with comment-like data.

Search notes:

- `sourceReference` was not found in the workspace.
- Current canonical runtime field is `repostTargetType` / `repostTargetId`.
- Legacy/mock models contain `Comment`, `replies`, `commentsCount`, and `sharesCount`, but these are not the canonical Space service runtime contract.

## Current implementation summary

Current runtime model before doctrine realignment:

- PWA content modules use `ContentActionRow` to create `postType: 'repost'` through `POST /v1/space/posts`.
- The create payload currently sends `visibility: 'public'` in `ContentActionRow.tsx:294-305`.
- `ShareToSpaceComposer` frames the action as "Поделиться в Space" and allows optional text described as reaction/commentary in `ShareToSpaceComposer.tsx:76-89` and `ShareToSpaceComposer.tsx:120-132`.
- `SpaceFeedSurface` has an explicit `reposts` filter and counts public reposts in `SpaceFeedSurface.tsx:77-115` and `SpaceFeedSurface.tsx:123-140`.
- `SpaceFeedCard` renders a repost block and optional "Комментарий к репосту" in `SpaceFeedCard.tsx:186-249`.
- Stage 13B.2-B edit controls exist on `/space/feed` for owner reposts via `SpaceFeedCard.tsx:70-71` and `SpaceFeedCard.tsx:252-315`.
- Stage 13B.2-BR closed protected PATCH routing at the gateway/service level in `api-gateway/src/index.ts:272-285`, `api-gateway/src/index.ts:983-995`, and `space-service/src/index.ts:52-64`.
- `space-service` accepts `postType: 'repost'` and `visibility: 'group'` together if `groupId` is provided and membership is valid; no rule rejects group repost in `spaceService.ts:342-397`.
- `listGroupFeedPosts` returns rows by `group_id` and `visibility = 'group'`, without filtering out `post_type = 'repost'`, in `queries/space.ts:603-636`.
- Activity projection materializes `space.repost_created` for reposts and `space.post_reposted_by_other` for reposts of `space_post` in `spaceService.ts:250-302` and `spaceService.ts:439-445`.

Provided screenshots:

- Observed from screenshots: `/space/feed` now shows owner controls "Добавить комментарий" and "Редактировать комментарий".
- Observed from screenshots: editing/saving commentary appears successful with green success feedback.
- Observed from screenshots: group surface can display a card styled as "КОММЕНТАРИЙ К РЕПОСТУ" / repost-like content in a public group feed.
- These screenshots support runtime visibility of Stage 13B.2-B/BR, but do not replace staging API verification of all edge cases.

## Already aligned with doctrine

1. No canonical comment/reply/thread service is introduced.
   - Evidence: proven from code.
   - `space-service` routes include posts, groups, feeds, media, and activity, but no comment/reply route.
   - `docs/openapi/space.yaml` defines `post`, `repost`, group, feed, activity contracts, but no comment/reply/thread resource.

2. Repost commentary edit does not create a new object.
   - Evidence: proven from code and docs.
   - `updateRepostCommentary` updates only `text`; `updateRepostTextByAuthor` restricts update by `post_type = 'repost'`, author, active status in `queries/space.ts:261-279`.
   - Stage 13B.2-B report explicitly states same `space_post` object is reused.

3. Repost target binding is immutable during edit.
   - Evidence: proven from code.
   - `updateRepostCommentary` rejects fields other than `text` in `spaceService.ts:575-624`.

4. Reactions remain separate from repost propagation.
   - Evidence: proven from code.
   - Likes/bookmarks use `/v1/reactions` in `ContentActionRow.tsx:174-275`.
   - Share-to-Space uses `/v1/space/posts` in `ContentActionRow.tsx:290-305`.

5. Economy/points/rewards are not activated by repost commentary.
   - Evidence: proven from inspected Stage 13B.2 reports and current services.
   - Stage 13B.2-A/B/BR all preserve `economy_integration: FALSE`.

6. Current storage stores local nearest target reference, not a full visual chain.
   - Evidence: proven from code.
   - `SpacePostResponse.repost` exposes only `targetType`, `targetId`, and `resolvedPreview` in `spaceService.ts:184-190`.

7. Standard authorial post already exists as a runtime concept.
   - Evidence: proven from code.
   - `createPost` supports `postType: 'post'` and requires non-empty text for standard posts in `spaceService.ts:382-384`.

## Ambiguous areas

1. "Personal private feed" is not yet a concrete runtime surface.
   - Evidence: proven from code; product meaning needs clarification.
   - `listHomeFeedPosts` returns author rows, public rows, and group-member rows together in `queries/space.ts:522-565`.
   - `listProfileFeedPosts` returns all active author rows without an explicit private-only feed contract in `queries/space.ts:568-600`.

2. Authorial source reference model is not implemented.
   - Evidence: proven from search/code.
   - `sourceReference` was not found.
   - Current runtime reference mechanism is tied to `postType: 'repost'` through `repostTargetType` and `repostTargetId`.
   - Legacy `Attachments` in `components/space/types.ts:150-186` is mock/local model, not the canonical service contract.

3. "Комментарий к репосту" can be read as bounded text or as comment taxonomy.
   - Evidence: proven from code; canon needs wording discipline.
   - `SpaceFeedCard` labels text as "Комментарий к репосту".
   - `ShareToSpaceComposer.tsx:88-90` says "Добавьте реакцию к репосту", which conflicts with Reactions ownership language.

4. `space_post` as repost target can create local chains.
   - Evidence: proven from code.
   - `REPOST_TARGET_TYPES` includes `space_post` in `spaceService.ts:61-62`.
   - `repostPost` convenience endpoint creates reposts of existing Space posts in `spaceService.ts:468-507`.
   - Storage remains one-hop, but product semantics can still imply a chain.

5. Group pages are read-only in PWA but backend allows group repost writes.
   - Evidence: proven from code.
   - `GroupPageClient` loads and displays feed; no composer is present in `GroupPageClient.tsx:212-221`.
   - Backend create contract still allows repost + group.

## Doctrine mismatches

1. Public repost is the default PWA write path.
   - Evidence: proven from code.
   - `ContentActionRow.tsx:294-305` sends `postType: 'repost'` and `visibility: 'public'`.
   - This conflicts with doctrine items 1 and 2.

2. Repost appears as a public social feed item.
   - Evidence: proven from code and observed in screenshots.
   - `SpaceFeedSurface` includes a "Репосты" filter and summary count in `SpaceFeedSurface.tsx:77-115` and `SpaceFeedSurface.tsx:123-140`.
   - `listHomeFeedPosts` includes public rows in home feed in `queries/space.ts:522-565`.
   - This conflicts with private-context doctrine.

3. Backend allows repost into thematic group.
   - Evidence: proven from code and contract.
   - `CreateSpacePostRequest` allows `groupId` when `visibility = group` in `docs/openapi/space.yaml:828-863`.
   - `createPost` validates group membership but does not reject `postType === 'repost' && visibility === 'group'` in `spaceService.ts:342-397`.
   - This conflicts with doctrine item 3.

4. Group feed query does not exclude repost rows.
   - Evidence: proven from code; screenshots suggest runtime visibility.
   - `listGroupFeedPosts` filters group and visibility but not `post_type = 'post'` in `queries/space.ts:603-636`.
   - This conflicts with doctrine items 7 and 8.

5. Repost is modeled as activity/projection.
   - Evidence: proven from code.
   - `materializeOutgoingPostActivity` uses `space.repost_created` in `spaceService.ts:250-268`.
   - `materializeIncomingRepostActivity` uses `space.post_reposted_by_other` in `spaceService.ts:271-302`.
   - This conflicts with the idea that repost is private user context rather than public reaction/projection.

6. Repost + optional text is quote-like in UX even without a `quote` type.
   - Evidence: proven from code and docs.
   - `ShareToSpaceComposer` and `SpaceFeedCard` create/render text above source preview.
   - Stage 13B.2-A intentionally implements optional commentary on repost.
   - This is not a taxonomy expansion, but it is doctrine-incompatible if displayed publicly.

7. Reaction-to-material is currently split into like/bookmark/repost, not authorial post.
   - Evidence: proven from code.
   - Like/bookmark are Reactions facts.
   - "Share-to-Space" creates a `repost`, not a standard `post` with source reference.
   - This conflicts with doctrine item 4.

## Dangerous future creep risks

1. Public repost chain creep.
   - `space_post` target support and `POST /v1/space/posts/{postId}/repost` can encourage repost-of-repost behavior.
   - Risk source: `spaceService.ts:61-62`, `spaceService.ts:468-507`, and `docs/openapi/space.yaml:192-227`.

2. Group feed as repost distribution channel.
   - Backend already allows group repost via API, even if PWA object pages currently default to public.
   - Risk source: `CreateSpacePostRequest` and `CreateSpaceRepostRequest` in `docs/openapi/space.yaml:828-875`.

3. Comment/thread taxonomy returning through legacy UI.
   - Legacy/mock Space UI has `commentsCount`, `onComment`, `Comment`, `replies`, and dashboard comment activity.
   - Risk source: `PostCard.tsx:250-291`, `types.ts:188-200`, and `ActivityBlock.tsx:32-48`.

4. Activity projection becoming social notification semantics.
   - Current activity already includes repost-created and post-reposted-by-other labels.
   - Risk source: `spaceService.ts:250-302` and `ActivityPageClient.tsx:150-213`.

5. Language drift: reaction/commentary/repost are mixed in copy.
   - `ShareToSpaceComposer` uses "реакцию к репосту".
   - This risks confusing Reactions Service facts with repost commentary.

6. Highlight navigation could entrench public repost as destination.
   - `ContentActionRow` emits `/space/feed?highlight=...` links after public repost creation.
   - Under new doctrine, public feed highlight should not be treated as the long-term repost destination.

## Public repost / group feed audit

Public repost:

- Status: doctrine mismatch.
- Evidence: proven from code.
- `ContentActionRow` uses public visibility for repost create.
- `SpaceFeedSurface` treats reposts as a first-class feed filter.
- `listHomeFeedPosts` includes public rows and therefore can expose public repost rows.

Group repost:

- Status: doctrine mismatch / policy hole.
- Evidence: proven from code; observed from screenshots for group display; write path needs staging verification.
- Backend permits `postType: 'repost'`, `visibility: 'group'`, and `groupId` if caller is a group member.
- Group feed query does not filter reposts out.
- PWA group page currently reads feed and displays `SpaceFeedCard`; it does not create group reposts directly.

Screenshots:

- Observed group screenshots show a public group surface with feed cards and repost/commentary-like presentation.
- This supports the need for Stage 13B.2-D to decide whether existing group repost rows should be hidden, migrated, or prevented in future writes.

## Authorial post model audit

Current authorial post capabilities:

- `postType: 'post'` exists.
- `visibility: group` exists.
- `groupId` membership validation exists.
- A standard post requires text.

Missing for the new doctrine:

- No canonical `sourceReference` field.
- No standard post source/reference schema for Blog / Atlas / Pulse / RF / Quest.
- No PWA composer for "authorial post inspired by source".
- No API distinction between "private repost" and "authorial post with reference".
- No group-feed rule requiring `post_type = 'post'`.

Conclusion:

- `stage_13B_2_C_authorial_post_model_ready: FALSE`
- The authorial post model requires Stage 13B.2-E specification before broad runtime implementation.

## Activity / projection boundary audit

Aligned boundaries:

- No economy integration was found in the repost commentary path.
- Activity remains a projection/read surface, not a reward authority.
- PATCH commentary edit does not materialize activity, per Stage 13B.2-B.

Doctrine conflict:

- `space.repost_created` and `space.post_reposted_by_other` make repost socially visible.
- Activity labels in `ActivityPageClient` present reposts as activity items.
- Under the new doctrine, private repost should not create public/incoming social activity by default.

Evidence:

- Proven from code: `spaceService.ts:250-302`.
- Proven from code: `ActivityPageClient.tsx:150-213`.
- Needs staging verification: actual activity feed behavior for new private-vs-public doctrine after future changes.

## Comments / replies / thread taxonomy audit

Canonical runtime:

- No Space Service comment/reply/thread API found.
- No OpenAPI comment/reply/thread resource found.
- No quote post type found in `SpacePostType`; OpenAPI uses `post`, `repost`, and `system`.

Legacy/mock risk:

- `components/space/Feed/PostCard.tsx` exposes comment UI labels, but actions are preview-only when handlers are absent.
- `components/space/types.ts` has `Comment` with nested `replies`.
- `components/space/Dashboard/ActivityBlock.tsx` has legacy activity labels for `comment`.
- `components/space/mockData.ts` contains comment-like mock activity.

Conclusion:

- Canonical runtime is currently safe from comment/reply implementation.
- Legacy/mock surfaces are dangerous future creep and should remain quarantined or be doctrine-cleaned in a later cleanup slice.

## Runtime verification needs

No tests were run in this read-only audit.

Verification classification:

- Proven from code: public repost create payload uses `visibility: 'public'`.
- Proven from code: backend allows group repost if `visibility = group` and valid `groupId`.
- Proven from code: group feed query does not exclude reposts.
- Proven from code: `sourceReference` is absent.
- Observed from provided screenshots: feed commentary edit controls are visible and save feedback succeeds.
- Observed from provided screenshots: group feed can display repost/commentary-like cards.
- Inferred from docs: Stage 13B.2-BR closed gateway/service PATCH route wiring, but it still recommends BV2 staging reverification.
- Needs staging verification: whether API clients can currently create `postType: 'repost'`, `visibility: 'group'`, `groupId` in staging.
- Needs staging verification: whether current activity feed emits/retains repost activity for new reposts in deployed environment.
- Needs staging verification: whether public reposts remain discoverable after dedupe/edit flows in production-like data.

Suggested verification checklist for a future read-only BV2:

1. Create object repost from Atlas/Pulse/Blog and confirm current visibility and feed placement.
2. Attempt direct API group repost with `postType: repost`, `visibility: group`, `groupId`.
3. Confirm group feed displays or suppresses repost rows.
4. Confirm activity feed behavior for object-bound repost and `space_post` repost.
5. Confirm author-owned commentary edit still works after 13B.2-BR on staging.

## Recommended next slice

Recommended next step: Stage 13B.2-D - Public Repost Elimination Plan.

Rationale:

- The highest-risk mismatch is not highlight/navigation; it is that current repost create/read semantics are public and group-feed compatible.
- Stage 13B.2-D should be a plan, not implementation-first, because it must decide how to handle existing public repost rows, API compatibility, activity projections, group feed filters, and migration/visibility policy.
- Stage 13B.2-E Authorial Post Model Specification should follow or be explicitly paired after D, because replacing public repost with authorial post requires a source/reference model that does not exist yet.

Safe next-slice scope for D:

- Define target-state policy for public repost rows.
- Define whether object repost create becomes private-only or deprecated.
- Define how group feed excludes `postType: repost`.
- Define treatment of existing group/public repost rows.
- Define activity projection changes for private repost.
- Define dependency on Stage 13B.2-E source/reference schema.

Not recommended as immediate next slice:

- Feed highlight polish as originally suggested by old 13B.2-B report, because it would polish a public repost destination that the new doctrine now questions.
- Track B, economy, points, rewards.
- Comments, replies, quote post, discussion trees.

## Out of scope confirmation

This audit did not:

- change code;
- change OpenAPI;
- regenerate SDK/types;
- change DB schema;
- add comments/replies/quote post type;
- add reaction trees;
- add public repost chains;
- change economy/points/rewards;
- change activity semantics;
- change Connect;
- implement Stage 13B.2-D/E/F/G.

## Review gates

### Requirements Review

Result: pass with clarification needed.

The new doctrine is clear at product level, but runtime terms need specification:

- What exactly is the "personal private feed" route/model?
- What is the canonical source/reference shape for authorial posts?
- How should existing public/group repost rows be handled?

### Architecture Review

Result: changes requested for future slices.

Current architecture supports public/group repost and lacks authorial source-reference model. The architecture can evolve safely, but needs D/E planning before implementation.

### Runtime Governance Review

Result: mismatch identified.

Runtime currently allows public social propagation for reposts. New doctrine requires private retention/context semantics and group-feed authorial post semantics.

### QA Review

Result: pass for audit completeness; staging verification required.

No tests required for this read-only slice. Future D/E/G work should add API tests for group repost rejection/private repost policy and PWA tests for authorial post/reference behavior.

### Canon Review

Result: pass with canon update required.

The report documents the new doctrine and identifies stale/legacy language. Canon should stop treating public repost as Track A destination.

## Status tokens

stage_13B_2_C_status: COMPLETE_AS_READ_ONLY_REPOST_DOCTRINE_AUDIT
stage_13B_2_C_execution_mode: READ_ONLY_AUDIT_DOCTRINE_ALIGNMENT_NO_IMPLEMENTATION
stage_13B_2_C_repost_doctrine_documented: TRUE
stage_13B_2_C_public_repost_risk: HIGH_CURRENT_RUNTIME_PUBLIC_REPOST_MISMATCH
stage_13B_2_C_group_feed_alignment: PARTIAL_RUNTIME_SUPPORTS_GROUP_POSTS_BUT_DOES_NOT_EXCLUDE_REPOSTS
stage_13B_2_C_authorial_post_model_ready: FALSE_SOURCE_REFERENCE_MODEL_MISSING
stage_13B_2_C_comments_replies_taxonomy: FORBIDDEN_NOT_CANONICAL_LEGACY_MOCK_RISK_ONLY
stage_13B_2_C_economy_integration: FALSE
stage_13B_2_C_next_recommended_step: STAGE_13B_2_D_PUBLIC_REPOST_ELIMINATION_PLAN
