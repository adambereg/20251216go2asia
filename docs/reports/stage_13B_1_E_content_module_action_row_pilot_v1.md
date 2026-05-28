# Stage 13B.1-E - Content Module Action Row Pilot

Status: `COMPLETE_AS_CONTENT_MODULE_ACTION_ROW_PILOT`

Mode: `BOUNDED_IMPLEMENTATION_PILOT_CONTENT_ACTION_ROWS`

Lead: AI Program Director / Orchestrator

Supporting agents from `docs/ai`: Runtime Governance Architect, Software Architect, Frontend Developer, Backend/API Analyst, Interaction Systems Analyst, QA Agent, Technical Canon Writer, Delivery Planner.

## 1. Executive Summary

Stage 13B.1-E implements the first bounded runtime Interaction Spine pilot for Go2Asia content modules.

Implemented pilot:

- `place`, `event`, `blog_post` detail surfaces now use a shared runtime `ContentActionRow`.
- `like` is runtime-backed through Reactions Service.
- `bookmark/save` is runtime-backed through Reactions Service for the bounded pilot target set.
- `share-to-Space` is runtime-backed through Space Service object-bound repost create.
- `/space/saved` remains bounded, with a minimal pilot summary for saved `place`, `event`, and `blog_post` bookmarks.
- Space resolver links were tightened for pilot `event` and `blog_post` references.

This is not a universal rollout, not a comments/discuss feature, not a full social layer, not an economy integration, and not a public-launch claim.

## 2. Scope and Pilot Boundaries

In scope:

- Atlas place detail action row;
- Pulse event detail action row;
- Blog post detail action row;
- Reactions-backed `like`;
- Reactions-backed pilot `bookmark`;
- Space-backed object-bound `share-to-Space`;
- minimal `/space/saved` pilot readiness;
- resolver/link alignment for pilot object references.

Out of scope:

- RF partner/offer;
- Rielt listing;
- Quest propagation;
- Atlas city/country/guide;
- comments/discuss;
- notifications;
- economy/reward hooks;
- Connect writes;
- generic activity hub;
- universal saved hub;
- generic repost rollout everywhere.

## 3. Upstream Contracts Carried Forward

Frozen rules preserved:

1. Reactions owns `like` and `bookmark` facts.
2. Reactions does not own `repost` or `share-to-Space`.
3. Bookmark is retention only; bookmark is not propagation.
4. Space owns social propagation and object-bound repost create.
5. Native share is not share-to-Space.
6. Repost display is not repost create.
7. Connect remains projection-only.
8. RF favorite is not like/bookmark/repost.
9. Rielt inquiry is not Space discussion.
10. Quest proof/review is not social review.
11. Repost/bookmark are not economy or reward signals.

## 4. Pilot TargetTypes

Allowed in this slice:

- `place`;
- `event`;
- `blog_post`.

Retained baseline:

- `space_post` bookmark remains supported for existing Space Saved posts.

Still deferred:

- `partner`;
- `listing`;
- `quest`;
- city/country/guide;
- RF offer.

## 5. Like Implementation

Implemented:

- Reactions summary read via `GET /v1/reactions/summary/{targetType}/{targetId}`.
- Reactions write via `POST /v1/reactions` with `reactionType: like`.
- Reactions delete via `DELETE /v1/reactions/{reactionId}`.
- Summary viewer payload now includes nullable `likeReactionId`, allowing unlike after reload.
- UI performs bounded optimistic update and rolls back on API failure.

Not implemented:

- like-to-activity for content objects;
- rewards/Points;
- Connect owner facts;
- generic social maturity claim.

## 6. Bookmark Implementation

Implemented:

- Reactions Service bookmark policy expanded from `space_post` only to bounded pilot set: `space_post`, `place`, `event`, `blog_post`.
- `/v1/reactions/mine` now supports those same bookmark targetTypes and optional `targetId` for single-object saved state.
- `ContentActionRow` reads bookmark state using `/mine?targetType=<pilot>&reactionType=bookmark&targetId=<id>&limit=1`.
- Save/unsave uses Reactions `POST /v1/reactions` and `DELETE /v1/reactions/{reactionId}`.
- `/space/saved` keeps its hydrated Space post list and adds a bounded pilot-count summary for `place/event/blog_post`.

Not implemented:

- RF favorite migration;
- universal saved-item hydration;
- saved hub redesign;
- silent local-save migration.

## 7. Share-to-Space Implementation

Implemented:

- `ContentActionRow` creates object-bound Space reposts through `POST /v1/space/posts`.
- Request shape:
  - `postType: repost`;
  - `visibility: public`;
  - `repostTargetType: place | event | blog_post`;
  - `repostTargetId: <source object id>`.

Not implemented:

- propagation through Reactions;
- native share substitution;
- reward hooks;
- duplicate repost prevention;
- source-existence validation in Space Service.

## 8. Atlas Place Pilot

Atlas place detail now includes `ContentActionRow` inside `PlaceLandingLayoutBusiness` and `PlaceLandingLayoutShowplace`.

Canonical identity:

- `targetType: place`;
- `targetId: data.id`.

Status: runtime-backed `like`, `bookmark`, and `share-to-Space` are wired for place details.

## 9. Pulse Event Pilot

Pulse event canonical detail (`EventDetailsCanon`) now includes `ContentActionRow` in the right-column details surface, separate from `EventRegisterButton`.

Canonical identity:

- `targetType: event`;
- `targetId: entity.id`.

Pulse register semantics are preserved: registration remains lifecycle/runtime-backed event registration, not save, like, propagation, or Space discussion.

## 10. Blog Post Pilot

Blog post detail replaced the previous decorative like/save/share buttons with `ContentActionRow`.

Canonical identity:

- `targetType: blog_post`;
- `targetId: post.id`.

This quarantines the previous decorative Blog action row by wiring it to runtime owners rather than leaving UI-only action claims.

## 11. Space Feed / Activity Integration

Feed:

- Share-to-Space creates normal Space `space_post` rows with `postType: repost`.
- Existing Space feed read surfaces can display `item.post.repost`.
- Resolver links were updated for `event` and `blog_post`.

Activity:

- Space Service already materializes `space.repost_created` for created reposts.
- E does not create a generic activity hub.
- Content-object likes/bookmarks are not promoted to Space activity.

Known limitation:

- `resolvedPreview` remains nullable/currently not fully hydrated.

## 12. Resolver / Link Integration

Updated:

- `event` references resolve to `/pulse/events/{targetId}`;
- `blog_post` references resolve to `/blog/{targetId without leading blog_}`;
- `place` references continue to resolve to `/atlas/places/{targetId}`.

This is enough for the bounded pilot, but not a full source-object resolver layer.

## 13. Quarantine / Deferred Surfaces

Preserved:

- RF favorite/local planning remains local-only.
- RF offers remain outside Reactions/Space propagation.
- Rielt listing save remains out of E.
- Quest propagation remains deferred.
- Atlas city/country/guide remain out of E because no targetType contract exists.
- comments/discuss, notifications, Connect writes and economy hooks remain out of scope.

## 14. Runtime Evidence

Code/API evidence:

- `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx` calls:
  - `GET /v1/reactions/summary/{targetType}/{targetId}`;
  - `GET /v1/reactions/mine?...targetId=...`;
  - `POST /v1/reactions`;
  - `DELETE /v1/reactions/{reactionId}`;
  - `POST /v1/space/posts`.
- `apps/reactions-service/src/services/reactionsService.ts` allows bookmark only for `space_post/place/event/blog_post`.
- `apps/reactions-service/src/db/queries/reactions.ts` supports exact `targetId` filtering and viewer `likeReactionId`.
- `docs/openapi/reactions.yaml` documents bounded `/mine` targetTypes and `likeReactionId`.
- `apps/go2asia-pwa-shell/components/space/runtime/utils.ts` resolves pilot `event` and `blog_post` references.

Verification run:

- `pnpm -C apps/reactions-service test` - pass, 18 tests.
- `pnpm -C apps/reactions-service typecheck` - pass.
- `pnpm -C apps/go2asia-pwa-shell typecheck` - pass.
- `pnpm -C apps/go2asia-pwa-shell lint` - pass with 0 errors and existing warnings.
- `ReadLints` on edited files - no linter errors.
- `pnpm openapi:check` regenerated bundle/types/SDK and exited non-zero because generated artifacts differ from HEAD; generated files are now present in the working tree. No OpenAPI generation error was observed.

Negative evidence:

- Static scans found no `ContentActionRow`, `/v1/reactions`, `/v1/space/posts`, or `repostTargetType` usage in `components/rf`, `components/rielt`, `components/quest`, or `components/connect`.
- Points producer allowlist keeps `space_repost_created` and `space_reaction_created` as `FUTURE_ONLY`.

Screenshots:

- No browser screenshot was collected in this run. Runtime proof is API/code/test evidence, not visual staging evidence.

## 15. Matrix 1 - Pilot Object Matrix

| Object | targetType | Like | Bookmark | Share-to-Space | Status |
| --- | --- | --- | --- | --- | --- |
| Atlas place | `place` | runtime-backed | runtime-backed | runtime-backed | complete pilot anchor |
| Pulse event | `event` | runtime-backed | runtime-backed | runtime-backed | complete, register preserved |
| Blog post | `blog_post` | runtime-backed | runtime-backed | runtime-backed | decorative row wired |

## 16. Matrix 2 - Reactions Wiring Matrix

| Surface | reactionType | Runtime-backed? | Hook/SDK path | Notes |
| --- | --- | --- | --- | --- |
| Atlas place detail | `like` | yes | `ContentActionRow` -> `customInstance` -> `/v1/reactions` | Uses `targetType=place`. |
| Atlas place detail | `bookmark` | yes | `ContentActionRow` -> `/v1/reactions/mine` + write/delete | Retention only. |
| Pulse event detail | `like` | yes | `ContentActionRow` -> Reactions summary/write/delete | Register untouched. |
| Pulse event detail | `bookmark` | yes | `ContentActionRow` -> Reactions bookmark | Save != registration. |
| Blog post detail | `like` | yes | `ContentActionRow` -> Reactions summary/write/delete | Replaces decorative like. |
| Blog post detail | `bookmark` | yes | `ContentActionRow` -> Reactions bookmark | Replaces decorative save. |

## 17. Matrix 3 - Propagation Wiring Matrix

| Source page | Space create path | Runtime-backed? | Feed visible? | Notes |
| --- | --- | --- | --- | --- |
| Atlas place detail | `POST /v1/space/posts` with `postType=repost`, `repostTargetType=place` | yes | yes via existing Space repost card | Strongest anchor. |
| Pulse event detail | `POST /v1/space/posts` with `repostTargetType=event` | yes | yes via existing Space repost card | Register is separate lifecycle action. |
| Blog post detail | `POST /v1/space/posts` with `repostTargetType=blog_post` | yes | yes via existing Space repost card | Blog resolver improved. |

## 18. Matrix 4 - Save Semantics Matrix

| Surface | Bookmark owner | Runtime-backed? | Local-only removed/quarantined? | Notes |
| --- | --- | --- | --- | --- |
| Atlas place detail | Reactions | yes | no previous local save | Retention only. |
| Pulse event detail | Reactions | yes | canonical detail separates from register | Legacy Pulse local save remains outside canonical detail. |
| Blog post detail | Reactions | yes | decorative buttons replaced | No UI-only save claim remains on blog detail. |
| `/space/saved` | Reactions fact, Space projection | partial/bounded | universal hub deferred | Space posts hydrated; pilot content counts shown only. |

## 19. Matrix 5 - Activity / Feed Projection Matrix

| Action | Appears in Space feed? | Appears in activity? | Projection only? | Notes |
| --- | --- | --- | --- | --- |
| Like pilot object | no | no generic object-like activity | yes | Reactions fact only. |
| Bookmark pilot object | no | no | yes | Retention only. |
| Share place to Space | yes | yes, as Space repost create where runtime supports it | yes | Space owns row and projection. |
| Share event to Space | yes | yes, as Space repost create where runtime supports it | yes | No event registration coupling. |
| Share blog_post to Space | yes | yes, as Space repost create where runtime supports it | yes | Blog source remains owner. |

## 20. Matrix 6 - Quarantine / Deferred Matrix

| Module/surface | Deferred? | Why | Future slice |
| --- | --- | --- | --- |
| RF favorite | yes | Local planning utility, not like/bookmark/repost. | RF-specific contract after pilot evidence. |
| RF offers | yes | No `rf_offer` targetType; partner/offer collapse risk. | RF offer target contract. |
| Rielt listing | yes | Housing inquiry boundary and local save semantics must stay isolated. | Listing action-row contract. |
| Quest propagation | yes | Proof/review/reward boundaries must not collapse into social review. | Quest social contract. |
| Atlas city/country/guide | yes | No exact targetType contract. | Atlas taxonomy targetType contract. |
| comments/discuss | yes | Separate social primitive. | Space discussion contract. |
| notifications | yes | Separate projection/notification layer. | Notification contract. |
| economy hooks | yes | Like/bookmark/repost are not reward signals. | Economy producer contract only if explicitly approved. |

## 21. Matrix 7 - Allowed vs Forbidden Runtime Expansion

| Capability | Allowed in E | Forbidden in E | Why |
| --- | --- | --- | --- |
| Pilot content action rows | `place/event/blog_post` detail pages | List/global/all modules | Bounded slice only. |
| Like | Reactions facts for pilot objects | RF favorite as like | Reactions owns facts; RF favorite remains local utility. |
| Bookmark | Reactions retention for `space_post/place/event/blog_post` | Universal saved hub claim | C allows phased rollout only. |
| Share-to-Space | Space `createPost` object-bound repost | Reactions repost/share type | D fixes Space ownership. |
| Space feed read | Existing repost display | Feed redesign | E only creates feed-visible reposts. |
| Activity | Existing Space repost projection | Generic activity hub | F/G later. |
| Economy | none | Points/VIP/rewards | Repost/bookmark are not economy signals. |
| Connect | none | Connect owner-facts | Connect remains projection-only. |

## 22. Required Decisions

| Question | Answer | Status |
| --- | --- | --- |
| Are like buttons now runtime-backed for pilot objects? | Yes. | `implemented` |
| Are bookmark buttons runtime-backed for pilot objects? | Yes, through bounded Reactions bookmark policy. | `implemented_bounded` |
| Is share-to-Space now runtime-backed for pilot objects? | Yes, through Space `POST /v1/space/posts`. | `implemented` |
| Does Space feed correctly display propagated pilot objects? | Yes by existing repost feed card path after create; no feed redesign. | `implemented_with_existing_read_surface` |
| Does `/space/saved` remain bounded while supporting pilot bookmarks? | Yes. Space posts remain hydrated; pilot content bookmarks are shown as bounded counts only. | `bounded_projection` |
| Are Blog decorative buttons removed/wired/quarantined? | Wired. The decorative row was replaced by runtime `ContentActionRow`. | `wired` |
| Are Pulse register semantics preserved? | Yes. Register remains separate lifecycle CTA. | `preserved` |
| Are RF/Rielt/Quest boundaries preserved? | Yes. Static negative scans found no pilot wiring there. | `preserved` |
| Does implementation preserve A1/B/C/D boundaries? | Yes. Reactions facts and Space propagation remain separate. | `preserved` |
| What remains deferred after E? | RF/Rielt/Quest, Atlas city/country/guide, comments, notifications, economy, universal saved/activity hubs. | `deferred` |

## 23. Risks and Limitations

| Risk | Severity | Status | Mitigation |
| --- | --- | --- | --- |
| `resolvedPreview` remains null/weak | medium | known partial | Resolver links improved; preview hydration deferred. |
| Duplicate share-to-Space reposts | low/medium | known partial | E does not implement dedupe policy. |
| Source existence validation for object-bound reposts | medium | backend gap | Space currently enum-validates; source validation deferred. |
| `/space/saved` not universal hub | medium | intentional | Pilot counts only; full hub is future slice. |
| OpenAPI generated files changed | low | expected | Generated artifacts included in working tree. |

## 24. Review Gate Results

| Review gate | Result | Notes |
| --- | --- | --- |
| Runtime Governance Review | Pass with caveats | Owner boundaries preserved; `resolvedPreview` remains partial. |
| Architecture Review | Pass | Reactions and Space responsibilities remain separated. |
| Canon Review | Pass | A1/B/C/D taxonomy preserved; no social/economy inflation. |
| QA Review | Pass with caveat | Focused tests/typechecks passed; no browser screenshot collected. |
| Propagation Review | Pass | Space create path is used for object-bound repost. |
| Boundary Review | Pass | RF/Rielt/Quest/Connect/economy remain isolated. |
| Lightweight Economy Boundary Review | Pass | Points classify Space reaction/repost producers as `FUTURE_ONLY`. |

## 25. Acceptance Criteria Status

| Criterion | Status |
| --- | --- |
| Pilot objects support runtime-backed like | met |
| Pilot objects support runtime-backed bookmark | met |
| Pilot objects support runtime-backed share-to-Space | met |
| Feed displays propagated pilot objects | met via existing repost read surface |
| Resolver links function for pilot objects | met for place/event/blog_post bounded links |
| No propagation collapse occurred | met |
| No A1 taxonomy reopening occurred | met |
| No RF/Rielt/Quest boundary collapse occurred | met |
| No economy/reward hooks introduced | met |
| Final status tokens exist | met |

## 26. Recommended Next Slice

Recommended next slice:

`Stage_13B_1_F_Space_Saved_Tab_Upgrade`

Why:

- E now creates real bookmark facts for `place/event/blog_post`.
- `/space/saved` can now graduate from bounded counts to hydrated saved content cards in a separate slice.
- Hydration/resolver rules should be formalized before calling `/space/saved` a universal hub.

Keep deferred:

- generic activity hub;
- RF/Rielt/Quest propagation;
- comments/discuss;
- economy integration.

## 27. Final Status Tokens

stage_13B_1_E_status: COMPLETE_AS_CONTENT_MODULE_ACTION_ROW_PILOT

stage_13B_1_E_next_slice: Stage_13B_1_F_Space_Saved_Tab_Upgrade

stage_13B_1_E_implementation_drift: false

stage_13B_1_E_public_launch_implied: false

stage_13B_1_E_does_not_reopen_A1_taxonomy: true

stage_13B_1_E_reactions_role: INTERACTION_FACT_OWNER_FOR_LIKE_AND_BOOKMARK

stage_13B_1_E_space_role: SOCIAL_PROPAGATION_OWNER_FOR_SHARE_TO_SPACE_REPOST_CREATE

stage_13B_1_E_connect_role: PROJECTION_ONLY_NO_WRITES

stage_13B_1_E_pilot_scope: PLACE_EVENT_BLOG_POST_ONLY
