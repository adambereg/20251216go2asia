# Stage 13B.1-I - Interaction Spine Capability Audit

Status: `COMPLETE_AS_CAPABILITY_AUDIT`

Mode: `AUDIT_RECONNAISSANCE_RUNTIME_CAPABILITY_DISCOVERY`

Lead: AI Program Director / Orchestrator

Supporting agents: architecture-auditor, runtime-auditor, backend-runtime-agent, frontend-runtime-agent, economy-boundary-agent, database-agent, interaction-spine-agent, feed-runtime-agent, ui-composer-agent, dead-code-review-agent, governance-boundary-agent.

## 1. Executive summary

Stage 13B.1-I is an audit-only reconnaissance pass after Stage 13B.1-H.

The current Interaction Spine Foundation is real and production-usable only inside the bounded pilot envelope:

- Reactions owns like/bookmark facts.
- Space owns repost/share-to-Space, feed, and activity projection.
- PWA runtime can like/bookmark/share `place`, `event`, and `blog_post`.
- `/space/saved`, `/space/activity`, and feed repost previews are runtime-backed.

However, the codebase also contains partially implemented or misleading adjacent capabilities:

- `space_reaction_created`, `space_repost_created`, and `space_post_created` exist in Points vocabulary but are `FUTURE_ONLY`.
- Reactions emits domain events through a noop publisher only.
- Repost commentary is partially supported as `text` on repost create, but active PWA UI always sends `text: null`.
- Runtime Space composer does not exist; legacy `PostComposer`/`FeedView`/`PostsView` are mock/decorative and should not be reused as foundation.
- Feed-service has enrichment paths, but active PWA Space surfaces read mostly from Space service directly.

Conclusion: for the next implementation, Go2Asia is mostly connecting or formalizing existing partial runtime, not building from zero. But reward/economy integration and repost commentary need explicit new contracts before activation.

## 2. Scope and frozen boundaries

This audit did not implement new behavior.

Frozen rules verified:

- Reactions is not propagation owner.
- Bookmark/save is not reward/progression.
- Activity is not economy ledger.
- Connect is not owner-fact layer.
- Repost is not economy authority.
- RF/Rielt/Quest rollout remains deferred.
- No taxonomy expansion, notifications, comments/discuss, universal graph, moderation rollout, or broad rollout was introduced.

## 3. Runtime maps

### 3.1 Reactions runtime

Production-usable:

- `apps/reactions-service/src/services/reactionsService.ts`
  - `like` and `bookmark` facts.
  - idempotent upsert/delete.
  - like aggregate deltas.
  - bookmark policy bounded to `space_post/place/event/blog_post`.
- `packages/db/src/schema/reactions.ts`
  - `reactions`.
  - `reaction_aggregates`.
  - `reaction_idempotency_keys`.

Partial/hidden:

- `apps/reactions-service/src/db/queries/activityProjection.ts`
  - writes incoming `space.post_liked_by_other` projection only for `space_post` likes.
- `apps/reactions-service/src/events/publisher.ts`
  - `reaction.created` / `reaction.deleted` are logged through a noop publisher; no durable event bus.

Missing:

- no reaction reward outbox;
- no points producer call;
- no bookmark activity projection;
- no reward/points/badge coupling.

### 3.2 Space repost runtime

Production-usable:

- `apps/space-service/src/services/spaceService.ts`
  - `createPost` supports `postType: 'repost'`.
  - optional `text`, `visibility`, `groupId`, `repostTargetType`, and `repostTargetId`.
  - dedupe via `REPOST_DEDUPE_TARGET_TYPES` for `space_post/blog_post/place/event`.
- `apps/space-service/src/db/queries/space.ts`
  - `findActiveRepostByAuthorAndTarget`.
- `docs/openapi/space.yaml`
  - documents `409 SpaceRepostAlreadyExists`.

Partial/hidden:

- Repost commentary exists as shared `text`, not as separate `commentary` field.
- `resolvedPreview` exists in API schema but runtime mapping returns `null`; PWA hydrates pilot previews client-side.
- `POST /v1/space/posts/{id}/repost` exists for `space_post` convenience repost, but active PWA pilot uses unified `POST /v1/space/posts`.

Missing:

- repost draft;
- repost edit;
- explicit quote-post type;
- server-side preview hydration;
- universal dedupe for `partner/listing/quest`.

### 3.3 PWA interaction runtime

Production-usable:

- `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`
  - like/bookmark/share-to-Space pilot.
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedSurface.tsx`
  - runtime Space feed.
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`
  - runtime feed card and repost block.
- `apps/go2asia-pwa-shell/components/space/runtime/repostPreview.ts`
  - client-side preview hydration for `place/event/blog_post`.
- `apps/go2asia-pwa-shell/app/(public)/space/saved/SavedPostsPageClient.tsx`
  - bounded saved hub.
- `apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx`
  - bounded activity projection.

Partial/tightly coupled:

- `ContentActionRow` contains reusable write logic but is a monolithic pilot component.
- `ActivityPageClient` and `PostsPublicationCard` duplicate parts of repost preview rendering.
- `SpaceFeedSurface` has no runtime create composer.

Dead/decorative:

- `apps/go2asia-pwa-shell/components/space/Feed/PostComposer.tsx`
- `apps/go2asia-pwa-shell/components/space/Feed/FeedView.tsx`
- `apps/go2asia-pwa-shell/components/space/Feed/PostCard.tsx`
- `apps/go2asia-pwa-shell/components/space/Posts/PostsView.tsx`

These are mock/local surfaces and should not be promoted into runtime without replacement.

### 3.4 Points / economy runtime

Production-usable:

- `apps/points-service/src/index.ts`
  - internal points add/spend endpoints.
  - idempotency through `externalId`.
  - Connect read projection endpoints.
- `packages/db/src/schema/points.ts`
  - `points_transactions`.
  - `user_balances`.

Partial/hidden:

- `PointsAction` vocabulary includes `space_post_created`, `space_repost_created`, and `space_reaction_created`.
- `apps/points-service/src/producerAllowlist.ts` explicitly marks these as `FUTURE_ONLY`.

Missing:

- no allowed caller for Reactions or Space spine producers;
- no reaction reward table;
- no reaction reward outbox;
- no consumer for `reaction.created`;
- no runtime grant from likes/reposts.

## 4. Capability matrix

| Capability | Exists fully | Exists partially | Hidden | Dead | Missing |
| --- | --- | --- | --- | --- | --- |
| like rewards | no | Points vocabulary only | `space_reaction_created` is `FUTURE_ONLY` | no | reward delivery, outbox, allowlist |
| repost commentary | no | backend `text` on repost | UI does not use it | no | dedicated composer/UX |
| repost visibility | yes | no | API supports public/followers/group/private | no | no |
| group repost | yes | partial UI absence | backend supports `groupId` | no | PWA group selector |
| composer flows | no | legacy mock composer | active feed has no composer | `PostComposer`/`FeedView` | runtime composer |
| quote-post support | no | repost + `text` can model quote | no separate postType | no | explicit UI/semantics |
| reward emitters | no | noop reaction/space events | Points actions are future-only | no | durable producer/consumer |
| feed commentary rendering | partial | `SpaceFeedCard` renders text + repost block | no explicit branch | legacy card misleading | semantic renderer modes |
| repost editing | no | no | no | no | PATCH/edit flow |
| draft support | no | no | status enum exists for active/hidden/flagged, not draft | no | draft schema/API/UI |
| economy hooks | no | Points add API exists | spine actions blocked | no | governance-approved hook |
| activity coupling | yes for space_post likes and Space actions | no bookmarks/object likes | reactions write Space projection directly | no | event-driven projection |

## 5. Findings

### 5.1 Production-usable

- Reactions fact writes and aggregates.
- Bounded bookmark policy.
- Content module action row for `place/event/blog_post`.
- Space object-bound repost create and dedupe for pilot targets.
- Space feed/saved/activity read surfaces.
- Client-side pilot repost preview hydration.
- Incoming `space_post` like activity projection.

### 5.2 Prototype-only / partial

- Repost commentary through `text`.
- Feed/activity preview reuse.
- Feed-service reactions enrichment.
- Points vocabulary for social actions.
- Activity projection from reactions through shared DB.

### 5.3 Fake/decorative

- Legacy Space `PostComposer`, `FeedView`, `PostCard`, `PostsView`.
- Pulse legacy local save/share.
- Guru unwired save.
- RF local favorite/planning.
- Rielt local save/device share.
- deprecated Space Balance/NFT views.

### 5.4 Dangerous to extend

- Treating `space_reaction_created` as active reward producer before allowlist/outbox work.
- Treating noop `reaction.created` logs as durable events.
- Reusing legacy `PostComposer` as runtime composer.
- Treating `POST /v1/space/posts/{id}/repost` as the main repost contract while `ContentActionRow` uses unified create.
- Assuming `resolvedPreview` is server-hydrated.
- Expanding `partner/listing/quest` just because enums already include them.

## 6. Audit block A - Like / Reward Capability Audit

Runtime:

- No reward hooks in `reactions-service`.
- No point emitter from reactions.
- No economy event consumer for `reaction.created`.
- `createNoopReactionsEventPublisher` logs only.
- `space_activity_projection` receives `space_post` like projections, but this is social projection only.

Database:

- Existing guards:
  - `reactions_user_target_reaction_unique`.
  - reaction idempotency key table.
  - `points_transactions.external_id` unique.
- Missing:
  - reaction reward table.
  - reaction reward outbox.
  - claim guard for like rewards.
  - anti-farming per target/day policy.

Services:

- `points-service` can add points internally, but social actions are `FUTURE_ONLY`.
- No hidden active reward service was found.

UI drift:

- Connect reads Points ledger projections only.
- Activity tab now explicitly says it is not Connect ledger/economy.
- No valid runtime UI proves like rewards exist today.

## 7. Audit block B - Repost Runtime Capability Audit

Current repost runtime supports:

- `text` on repost create (usable as commentary).
- visibility.
- private/followers/group visibility at API level.
- group repost with `groupId`.
- target type/id.
- dedupe for pilot targets.
- read rendering with preview block.

Current repost runtime does not support:

- explicit quote-post postType;
- separate `commentary` schema;
- draft;
- edit;
- moderation/edit workflow;
- server-side resolved preview hydration.

UI gap:

- `ContentActionRow.shareToSpace` sends `text: null`, `visibility: 'public'`, no group selector, no commentary composer.

## 8. Audit block C - Composer Layer Audit

Reusable:

- `ContentActionRow` write patterns can be extracted into hooks.
- `SpaceFeedCard`, `repostPreview.ts`, and `utils.ts` are reusable read components/helpers.

Tightly coupled:

- `ContentActionRow` combines reaction state, repost dedupe scan, and UI.
- `SavedPostsPageClient` and `ActivityPageClient` duplicate hydration/rendering logic.

Abandoned/decorative:

- `PostComposer` is UI-only.
- `FeedView` creates local mock posts.
- `PostCard` mutates local like/save state and is now marked preview-only when handlers are absent.
- `PostsView` uses mock posts/drafts.

Missing:

- runtime post composer;
- repost composer;
- quote/commentary composer;
- runtime privacy selector;
- runtime group selector;
- modal/drawer create flow;
- optimistic runtime create cache.

## 9. Audit block D - Feed / Activity Rendering Audit

Feed runtime:

- `SpaceFeedCard` renders post text and repost preview block independently.
- This can display a commentary repost if backend returns both `text` and `repost`.
- It does not explicitly branch into repost-only / repost-with-commentary / quote-post modes.

Activity runtime:

- `ActivityPageClient` renders semantic activity cards and hydrates pilot repost previews.
- It does not project bookmark activity.
- It does not project object-like activity for `place/event/blog_post`.
- It should remain projection-only.

Hidden fields:

- `SpacePostRepostRef.resolvedPreview` exists in schema but is null in runtime mapping.
- `CreateSpaceRepostRequest.text` and `CreateSpacePostRequest.text` support commentary-like data.

## 10. Audit block E - Economy Boundary Audit

No active integration was found between:

- reactions and Points;
- reposts and Points;
- activity and Points;
- Connect and owner facts.

Hidden/unsafe assumptions:

- Points OpenAPI and SDK expose social action names, but `producerAllowlist.ts` rejects them as `FUTURE_ONLY`.
- Connect transaction UI is a Points projection, not Space Activity.
- Demo seed transactions are not runtime reward wiring.

Frozen rules status:

| Rule | Status | Evidence |
| --- | --- | --- |
| Reactions != propagation owner | pass | no repost reaction type |
| save != reward/progression | pass | bookmark facts only |
| Activity != economy ledger | pass | no points activity coupling |
| Connect != owner-fact layer | pass | read projection only |
| repost != economy authority | pass | no points producer active |

## 11. Audit block F - Dead Code / Experimental Runtime Audit

Safe to reuse:

- `ContentActionRow`.
- `SpaceFeedSurface`.
- `SpaceFeedCard`.
- `repostPreview.ts`.
- `useSpaceSavedReactions`.
- `ActivityPageClient` concepts, after extracting shared card blocks.
- `points_transactions.external_id` idempotency model.
- Quest reward outbox pattern as reference, not direct reuse.

Dangerous:

- legacy `components/space/index.ts` barrel exports for Feed/Posts mock surfaces;
- `PostComposer` as foundation;
- `POST /v1/space/posts/{id}/repost` as parallel primary contract;
- social `PointsAction` names as readiness signal.

Misleading:

- `CreateSpaceRepostRequest` and generated SDK helpers are present but unused in PWA pilot.
- `resolvedPreview` exists but is not server-populated.
- feed-service enriched routes exist but PWA active feed reads Space service directly.
- Connect `ActivityFeed` name can be confused with Space Activity.

Dead/quarantine recommended:

- `FeedView`.
- `PostComposer`.
- `PostsView`.
- legacy Pulse `EventDetail`.
- deprecated Space `BalanceView`/`NFTView`.
- RF/Rielt local-only utilities.
- Points social producers until explicitly activated.

## 12. Boundary integrity findings

No current hidden boundary violation was found.

Architecture drift exists but is bounded:

- DB/API enums are wider than active PWA pilot.
- Points vocabulary is wider than runtime allowlist.
- Feed-service capabilities are not used by active PWA Space routes.
- Reactions directly writes activity projection rows, which is acceptable today but a future service-boundary risk.

Projection/authority confusion risks:

- Connect activity-like UI vs Space activity.
- Activity projection vs notification/economy ledger.
- saved hub vs universal saved claim.
- repost display vs repost create.

## 13. Recommended minimal implementation path A - Like -> +1 Point

This must not be implemented inside 13B.1-I. Minimal future path:

1. Scope-lock to `targetType: space_post`, `reactionType: like`.
2. Choose recipient:
   - safer pilot: liker gets +1 for first like on a target;
   - alternative: author gets +1 for received like.
3. Add reaction reward outbox, modeled after `quest_reward_outbox`.
4. Use `points_transactions.external_id` for idempotency.
5. Recommended external ID for liker pilot:
   - `reaction:like_given:{userId}:{targetType}:{targetId}`
6. Promote `space_reaction_created` from `FUTURE_ONLY` to `INTERNAL_BETA` behind explicit env flag and caller allowlist.
7. Deliver asynchronously to `/internal/points/add`.
8. Do not add UI grant semantics until ledger row exists.
9. Do not reward bookmarks, reposts, object likes, RF/Rielt/Quest, or Activity rows in the same slice.

Avoid:

- synchronous points grant inside `upsertReaction`;
- using noop event publisher as delivery bus;
- using `reaction.id` as externalId if unlike/re-like farming is not acceptable;
- Connect toast/proof semantics.

## 14. Recommended minimal implementation path B - Repost commentary composer

This must be a small Space-owned implementation, not a mock composer revival.

1. Keep canonical write path as `POST /v1/space/posts` with `postType: 'repost'`.
2. Extract `useShareToSpace` from `ContentActionRow`.
3. Add a bounded `ShareToSpaceComposer` for pilot targets:
   - optional text textarea;
   - default `visibility: public`;
   - no draft/edit/moderation in v1;
   - no quote postType;
   - respect existing `409 REPOST_ALREADY_EXISTS`.
4. Reuse `SpaceFeedCard` rendering, which already can render text plus repost block.
5. Later extract `RepostPreviewBlock` from `SpaceFeedCard` to reuse in Activity and Posts surfaces.
6. Defer group/private composer until visibility UX and group selector are explicitly designed.

Avoid:

- reusing legacy `PostComposer`;
- adding comments/discuss;
- introducing notifications;
- expanding targetTypes;
- treating commentary as review/moderation/content submission.

## 15. Risk assessment

| Risk | Severity | Recommendation |
| --- | --- | --- |
| Like reward farming | high | outbox + externalId per user/target + strict pilot |
| Economy boundary collapse | critical | keep Points authority and explicit allowlist |
| Mock composer revival | high | quarantine legacy Feed stack |
| Repost dual-contract drift | medium/high | prefer unified `POST /v1/space/posts` |
| Server preview false readiness | medium | keep client hydration or implement source-owner resolver later |
| Feed-service/PWA route drift | medium | decide whether PWA uses feed-service enrichment or direct Space reads |
| Enum-driven rollout drift | high | do not infer readiness from enum values |

## 16. Final capability verdict

Go2Asia is not missing every building block. It already has:

- real Reactions facts;
- real Space repost create;
- real saved/activity/feed projections;
- real Points ledger infrastructure;
- real idempotency primitives.

But the missing connective tissue is important:

- no reward outbox;
- no active social points producer;
- no runtime composer;
- no explicit repost commentary UI;
- no durable event bus;
- no universal graph.

Therefore the safest next step is not a broad new architecture. It is a minimal activation plan that formalizes existing partial runtime while preserving Stage 13B.1 frozen boundaries.

## 17. Review gate results

| Review gate | Result | Notes |
| --- | --- | --- |
| Architecture Audit | Pass | Existing partial capabilities mapped without implementation. |
| Runtime Audit | Pass | Production/partial/dead/missing separated. |
| Backend Runtime Audit | Pass | Reactions/Space/Feed/Points capabilities inspected. |
| Frontend Runtime Audit | Pass | Runtime vs legacy composer/feed separated. |
| Economy Boundary Audit | Pass | No active hidden reward coupling found. |
| Database Audit | Pass | No reaction reward schema exists; idempotency primitives found. |
| Dead Code Review | Pass | Legacy/mock/deprecated surfaces classified. |
| Governance Boundary Review | Pass | Frozen rules verified. |

## 18. Final status tokens

stage_13B_1_I_status: COMPLETE_AS_CAPABILITY_AUDIT

stage_13B_1_I_next_slice: Track_A_Repost_Commentary_Composer_Then_Track_B_Like_Point_Pilot

stage_13B_1_I_implementation_drift: false

stage_13B_1_I_public_launch_implied: false

stage_13B_1_I_does_not_reopen_A1_taxonomy: true

stage_13B_1_I_reactions_role: LIKE_AND_BOOKMARK_FACT_OWNER_ONLY_NO_REWARD_AUTHORITY

stage_13B_1_I_space_role: PROPAGATION_FEED_ACTIVITY_OWNER_WITH_PARTIAL_COMMENTARY_CAPABILITY

stage_13B_1_I_connect_role: POINTS_PROJECTION_ONLY_NO_OWNER_FACT_WRITES

stage_13B_1_I_economy_status: POINTS_LEDGER_EXISTS_BUT_SPINE_PRODUCERS_ARE_FUTURE_ONLY

stage_13B_1_I_composer_status: RUNTIME_COMPOSER_MISSING_LEGACY_COMPOSER_QUARANTINE

stage_13B_1_I_recommended_minimal_path: REACTION_REWARD_OUTBOX_PLUS_BOUNDED_REPOST_COMMENTARY_COMPOSER

## 19. Addendum - Like reward philosophy clarification

This addendum captures a product/economy clarification after Stage 13B.1-I completion.
It does not change frozen rules and does not authorize immediate implementation.

### 19.1 Product position

- Points in Go2Asia are numerous and relatively inexpensive.
- Like is a low-value engagement action.
- Indicative relative magnitudes:
  - Like: `1 Point`.
  - Like received: `1 Point` (possible future semantics, not approved yet).
  - Full post creation/publication: around `1000 Points`.
  - Referral action: around `5000 Points`.
  - VIP referral flows can produce materially more than social micro-actions.

Therefore, like reward is explicitly a micro-incentive for engagement, not a primary earnings track.

### 19.2 Risk model clarification

- Normal human behavior can include tens or hundreds of likes across different objects.
- The primary abuse target is automation: bots, scripts, mass API calls, and account farms.
- Controls should focus on anti-automation and abuse-resilience, not suppressing normal high-engagement behavior.

### 19.3 Mandatory reward uniqueness rule

For one user and one object, only one paid like is allowed.

Example:

1. user A likes post X -> `+1 Point`.
2. user A unlikes post X.
3. user A likes post X again.

No additional Points must be granted for the same object interaction.

### 19.4 Preferred future semantics for Track B

Preferred idempotency key form:

`reaction:like_given:{userId}:{targetType}:{targetId}`

This prevents unlike/re-like farming while preserving normal engagement across many different objects.

### 19.5 Anti-abuse philosophy

Preferred controls:

- idempotency;
- reward uniqueness;
- rate limits;
- anti-automation controls;
- anomaly detection.

Avoid as primary strategy:

- hard caps on number of different likes by active real users;
- blanket suppression of broad legitimate interaction.

### 19.6 Architecture implication

- Like reward remains low-value engagement reward.
- Primary economic value should continue to come from:
  - meaningful content creation;
  - community contribution;
  - referrals;
  - VIP mechanisms;
  - other high-value actions.
- Likes remain auxiliary Points source, not the main earning mechanism.

### 19.7 Priority ordering clarification

- This addendum is clarification-only for future Track B.
- Immediate next priority remains: `Track A - Repost Commentary Composer`.
- After Track A completion, return to `Track B - Like -> Point Reward Pilot`.
