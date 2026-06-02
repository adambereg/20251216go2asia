# Stage 13B.1-A0 - Reactions / Interaction Spine Service Audit

Status: `COMPLETE_WITH_FRAGMENTED_REACTION_INFRASTRUCTURE`

Mode: `READ_ONLY_SERVICE_AUDIT_INTERACTION_SPINE_FOUNDATION`

Lead: AI Program Director / Orchestrator

Supporting agents: Runtime Governance Architect, Software Architect, Interaction Systems Analyst, Frontend Developer in read-only runtime inspection mode, Backend/API Analyst, QA Agent, Technical Canon Writer, Delivery Planner.

## 1. Scope and Guardrails

This report is a service-level audit of the existing Reactions / Interaction Spine infrastructure. It is not an implementation plan, not a redesign, not a new ecosystem audit, and not a reopening of A1 taxonomy.

Frozen rules inherited from 13B.0-A1/F/G:

1. `repost display != repost creation`.
2. `native share != share-to-Space`.
3. `local save != runtime-backed save`.
4. `lifecycle != socialization`.
5. `inquiry != Space discussion`.
6. `Connect projection != owner-fact`.
7. `Space read != universal propagation`.
8. `bookmark != universal object retention`.
9. `Quest proof/review != social review`.
10. `RF favorite != like`.
11. `navigation/deeplink != propagation`.
12. `save semantics must remain owner-qualified`.

Primary inputs:

- `docs/reports/stage_13B_0_A_audit_framework_and_scoring_matrix_v1.md`
- `docs/reports/stage_13B_0_A1_interaction_spine_runtime_audit_v1.md`
- `docs/reports/stage_13B_0_D_activity_partner_social_audit_v1.md`
- `docs/reports/stage_13B_0_E_economy_progression_audit_v1.md`
- `docs/reports/stage_13B_0_F_cross_module_interaction_spine_findings_v1.md`
- `docs/reports/stage_13B_0_G_module_maturity_closure_and_13B1_readiness_v1.md`

## 2. Executive Verdict

There is a real, runtime-backed Reactions Service:

- `apps/reactions-service` exposes `/v1/reactions` routes.
- `apps/api-gateway` routes `/v1/reactions*` to `REACTIONS_SERVICE_URL`.
- `packages/db` defines `reactions`, `reaction_aggregates`, and `reaction_idempotency_keys`.
- `docs/openapi/reactions.yaml` defines the public contract.
- generated SDK/types include reaction DTOs and low-level functions.

But the current runtime is not a reusable universal Interaction Spine yet.

The backend data model is generic enough for some future object reactions, especially `like` across whitelisted target types. The actual product/runtime usage is Space-centric: the only active PWA write found is `reactionType: bookmark` on `targetType: space_post` through `useSpaceSavedReactions`. Cross-module save semantics remain fragmented across backend bookmark, localStorage, local component state, decorative buttons, and unwired callbacks.

Service reality tag: `partial`.

Foundation readiness verdict: current Reactions infrastructure is a bounded backend substrate for 13B.1 stabilization, not a mature universal object reactions platform and not a propagation foundation.

## 3. Evidence Index

| ID | Evidence | Supports |
| --- | --- | --- |
| E-RXN-ROUTES | `apps/reactions-service/src/routes/reactions.ts:25-52` | Runtime routes for create, delete, mine, summary, batch summary. |
| E-RXN-SERVICE-TYPES | `apps/reactions-service/src/services/reactionsService.ts:26-34`, `apps/reactions-service/src/services/reactionsService.ts:59` | Runtime whitelist: 7 target types; `like`, `bookmark`. |
| E-RXN-BOOKMARK-GUARD | `apps/reactions-service/src/services/reactionsService.ts:91-93`, `apps/reactions-service/src/services/reactionsService.ts:109-111` | Bookmark and `/mine` are restricted to `space_post`. |
| E-RXN-SUMMARY | `apps/reactions-service/src/services/reactionsService.ts:453-460`, `apps/reactions-service/src/services/reactionsService.ts:493-498` | Summary returns `counts.like` and `viewer.liked` only. |
| E-RXN-IDEMPOTENCY | `apps/reactions-service/src/services/reactionsService.ts:188-207`, `packages/db/migrations/0017_reactions_idempotency_v1.sql:6-20` | Idempotency key table and replay handling exist. |
| E-RXN-HARD-DELETE | `apps/reactions-service/src/db/queries/reactions.ts:116-124` | Runtime delete is hard delete, despite `deleted` enum. |
| E-RXN-AGG | `apps/reactions-service/src/db/queries/reactions.ts:127-181` | Like aggregate and viewer-liked read path exist. |
| E-RXN-SCHEMA | `packages/db/src/schema/reactions.ts:4-96` | DB schema for reaction facts, aggregates, idempotency, indexes. |
| E-RXN-MIGRATIONS | `packages/db/migrations/0016_reactions_like_v1.sql:38-75`, `packages/db/migrations/0039_reactions_bookmark_v1.sql:1-13` | Baseline like schema plus bookmark enum extension. |
| E-RXN-OPENAPI | `docs/openapi/reactions.yaml:69-231`, `docs/openapi/reactions.yaml:390-473` | Five reaction endpoints and DTO semantics. |
| E-GATEWAY | `apps/api-gateway/src/index.ts:350-364`, `apps/api-gateway/src/index.ts:994-998`, `apps/api-gateway/src/index.ts:1244-1245` | Gateway route classification, protected routes, proxy target. |
| E-AUTH | `apps/reactions-service/src/middleware/auth.ts:98-167` | Gateway-origin JWT auth; optional principal for summary. |
| E-THROTTLE | `apps/reactions-service/src/middleware/throttle.ts:26-70` | In-memory write throttle for POST/DELETE. |
| E-EVENTS-NOOP | `apps/reactions-service/src/events/contracts.ts:1-31`, `apps/reactions-service/src/events/publisher.ts:9-19` | Event contract exists; publisher logs only. |
| E-ACTIVITY-PROJ | `apps/reactions-service/src/db/queries/activityProjection.ts:21-115`, `packages/db/migrations/0042_space_activity_projection_v1.sql:6-77` | Space-only incoming like activity projection. |
| E-FEED-CONSUMER | `apps/feed-service/src/clients/reactionsClient.ts:70-87`, `apps/feed-service/src/services/feedService.ts:168-205` | Feed-service consumes batch summary for `space_post` only. |
| E-SDK-GENERATED | `sdk/go2AsiaPlatformAPI.ts:3882-3894`, `packages/sdk/src/index.ts:1-27` | Generated functions exist; root SDK has no dedicated `reactions` namespace. |
| E-PWA-SPACE-SAVE | `apps/go2asia-pwa-shell/components/space/runtime/useSpaceSavedReactions.ts:31-150`, `apps/go2asia-pwa-shell/components/space/runtime/utils.ts:3-5` | Active PWA bookmark write/read for `space_post`. |
| E-PWA-SAVED | `apps/go2asia-pwa-shell/app/(public)/space/saved/SavedPostsPageClient.tsx:218-244` | Saved page removes bookmark and bridges saved posts to Organizer separately. |
| E-SPACE-REPOST-READ | `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx:127-152` | Repost display/read exists in feed card. |
| E-SPACE-REPOST-API | `docs/openapi/space.yaml:153-188`, `apps/space-service/src/services/spaceService.ts:445-483`, `sdk/go2AsiaPlatformAPI.ts:7090-7104` | Space repost API exists for Space posts; PWA object-surface caller not found. |
| E-SPACE-TARGETS | `docs/openapi/space.yaml:698-700`, `packages/db/src/schema/space.ts:29-37` | Space repost target enum mirrors reaction target enum. |
| E-BLOG-UI | `apps/go2asia-pwa-shell/app/(public)/blog/[slug]/page.tsx:107-119` | Blog like/save/share buttons are decorative/UI-only. |
| E-PULSE-LOCAL | `apps/go2asia-pwa-shell/components/pulse/EventDetail.tsx:104-124` | Pulse save is local state/TODO; share is browser native/clipboard. |
| E-GURU-UNWIRED | `apps/go2asia-pwa-shell/components/guru/ObjectCard.tsx:516-539`, `apps/go2asia-pwa-shell/app/(public)/guru/GuruClient.tsx:521-529` | Guru save button handler is not wired from route. |
| E-RIELT-LOCAL | `apps/go2asia-pwa-shell/components/rielt/ListingDetail/CTAPanel.tsx:270-288` | Rielt save is local state; share is native/browser. |
| E-RF-LOCAL | `apps/go2asia-pwa-shell/lib/rfLocalUserState.ts:1-31`, `apps/go2asia-pwa-shell/lib/rfLocalUserState.ts:72-140` | RF favorites and planning vouchers are localStorage. |
| E-RF-FAVORITE | `apps/go2asia-pwa-shell/components/rf/Shared/FavoritePlaceButton.tsx:1-38` | RF favorite toggles local state helper, not reactions. |
| E-RF-LOCAL-VOUCHER | `apps/go2asia-pwa-shell/components/rf/Shared/AddToMyVouchersButton.tsx:1-50` | RF local voucher save is local planning only. |
| E-QUEST-SHARE | `apps/go2asia-pwa-shell/components/quest/QuestRewards/RewardsActions.tsx:20-68` | Quest share is native/browser; save/review are deferred. |
| E-NEG-PWA-LIKE | Scoped search in `apps/go2asia-pwa-shell` found no PWA `reactionType: 'like'`, `upsertReaction`, `getReactionSummary`, or `getReactionSummaryBatch` calls. | Active PWA like writes are missing. |
| E-NEG-PWA-REPOST | Scoped search in `apps/go2asia-pwa-shell` found no `repostSpacePost`, `createSpaceRepost`, `postType: 'repost'`, or `/v1/space/posts/{id}/repost` caller. | PWA repost creation is not wired. |
| E-NEG-MODERATION | Scoped search in `apps/reactions-service` found no reaction moderation/report/notification/reconciliation/bookmark-count implementation beyond status literals in activity projection. | Moderation and reconciliation are missing. |

## 4. Matrix 1 - Reactions Infrastructure Inventory

| Area | Exists? | Runtime-backed? | Evidence | Notes |
| --- | --- | --- | --- | --- |
| Reactions routes | yes | yes | E-RXN-ROUTES | Five `/v1/reactions` endpoints. |
| API Gateway proxy | yes | yes | E-GATEWAY | Protected write/mine routes; summary optional auth through service. |
| DB tables | yes | yes | E-RXN-SCHEMA, E-RXN-MIGRATIONS | `reactions`, `reaction_aggregates`, `reaction_idempotency_keys`. |
| Reaction models | yes | yes | E-RXN-SERVICE-TYPES, E-RXN-OPENAPI | Runtime and OpenAPI align on 7 targets and 2 reaction types. |
| Hooks | partial | yes for Space bookmark | E-PWA-SPACE-SAVE | Only active PWA hook is `useSpaceSavedReactions`. |
| SDK | partial | generated only | E-SDK-GENERATED | Low-level generated functions/types exist; no stable `reactions` namespace in `packages/sdk/src/index.ts`. |
| Aggregation logic | yes | yes for likes only | E-RXN-AGG, E-RXN-SUMMARY | `like_count`; no bookmark count. |
| Moderation logic | no | no | E-NEG-MODERATION | No reaction flag/report/moderator lifecycle. |
| Counters | partial | yes for likes only | E-RXN-AGG | Delta updates without evidenced reconciliation job. |
| Notifications | partial/conceptual | no external notification runtime | E-EVENTS-NOOP, E-ACTIVITY-PROJ | Event contract exists; publisher is noop; Space like activity projection exists. |
| Caching | no dedicated reaction cache | no | E-NEG-MODERATION | Feed has degraded fallback, not reaction cache. |
| Local persistence | yes outside reactions | local-only | E-RF-LOCAL, E-PULSE-LOCAL, E-RIELT-LOCAL | Local saves are not reaction facts. |
| Space save logic | yes | yes | E-PWA-SPACE-SAVE, E-PWA-SAVED | Runtime-backed for saved Space posts only. |
| Idempotency | yes | yes for POST | E-RXN-IDEMPOTENCY | Optional header; hard-delete can make replay unavailable. |
| Soft delete | schema only | no | E-RXN-HARD-DELETE | `deleted` enum exists, runtime deletes rows. |
| Auth/ACL | yes | partial | E-AUTH | User-scoped; no role-based moderation/admin override. |
| Rate limit | yes | partial | E-THROTTLE | In-memory per worker/user+method. |

Infrastructure conclusion: `reactions-service` is real and bounded, but operational maturity is partial. It owns reaction facts, not full social propagation.

## 5. Matrix 2 - targetType Coverage

| targetType | Runtime-backed? | Used where | Actions supported | Persistence | Notes |
| --- | --- | --- | --- | --- | --- |
| `space_post` | yes | PWA Space saved posts, feed-service summaries, Space activity projection | `like` backend, `bookmark` backend | `reactions`; `reaction_aggregates` for likes | Only target type with active PWA reaction write. |
| `blog_post` | partial/infrastructure-only | OpenAPI/service summary and like write; no active PWA write | `like` backend accepted; `bookmark` rejected | `reactions`; like aggregate if written | Blog UI buttons are UI-only. |
| `atlas_place` | no exact target type | none | none | none | Runtime enum uses `place`, not `atlas_place`. |
| `place` | partial/infrastructure-only | OpenAPI/service summary and like write; Space repost enum | `like` backend accepted; `bookmark` rejected | `reactions`; like aggregate if written | Atlas/Guru object actions not wired. |
| `pulse_event` | no exact target type | none | none | none | Runtime enum uses `event`, not `pulse_event`. |
| `event` | partial/infrastructure-only | OpenAPI/service summary and like write; Space repost enum | `like` backend accepted; `bookmark` rejected | `reactions`; like aggregate if written | Pulse save remains local/TODO; event register is lifecycle. |
| `rielt_listing` | no exact target type | none | none | none | Runtime enum uses `listing`, not `rielt_listing`. |
| `listing` | partial/infrastructure-only | OpenAPI/service summary and like write; Space repost enum | `like` backend accepted; `bookmark` rejected | `reactions`; like aggregate if written | Rielt save local; inquiry separate. |
| `rf_offer` | no exact target type | none | none | none | Runtime enum has `partner`, not `rf_offer`. |
| `partner` | partial/infrastructure-only | OpenAPI/service summary and like write; Space repost enum | `like` backend accepted; `bookmark` rejected | `reactions`; like aggregate if written | RF favorites are localStorage, not reactions. |
| `quest` | partial/infrastructure-only | OpenAPI/service summary and like write; Space repost enum | `like` backend accepted; `bookmark` rejected | `reactions`; like aggregate if written | Quest proof/review is lifecycle, not reaction. |
| `guide/article` | no exact target type | none | none | none | `guide`/`article` are not in ReactionTargetType; `blog_post` covers blog post class only. |
| generic object refs | partial | DB uses polymorphic `(target_type, target_id)` | `like` for whitelist only | `reactions` | Generic storage exists but product policy/use is narrow. |

Target coverage conclusion: the schema and service are polymorphic for 7 target types, but active PWA usage is limited to `space_post`. Several product names requested for audit map only approximately to runtime enum names.

## 6. Matrix 3 - reactionType Coverage

| reactionType | Runtime-backed? | Used where | Semantic meaning | Notes |
| --- | --- | --- | --- | --- |
| `bookmark` | yes, narrow | Space feed/home/saved | Saved Space post | Runtime accepts only `targetType: space_post`; no summary count. |
| `like` | yes in backend; not active PWA write | Reactions service, feed-service summary, Space incoming-like activity projection | Viewer liked + like count | API accepts 7 target types; PWA write not found. |
| `repost` | no in reactions | Space service has post/repost model | Space post/repost, not a reaction type | `repostSpacePost` exists in generated SDK; active PWA create caller not found. |
| `share_to_space` | no | none | Missing as reaction primitive | Native share is local/browser only. |
| `reaction` | no | none | Not an enum value | No generic reaction bucket. |
| `favorite` | no | RF local helpers | RF local favorite/planning | LocalStorage; explicitly not `like`. |
| `follow` | no | none in reactions | Missing as reaction primitive | Space group membership exists separately, not reaction follow. |
| legacy variants | conceptual/drift | legacy docs and UI labels | Do not count as runtime | Current OpenAPI enum is only `like`, `bookmark`. |

Reaction type conclusion: Reactions Service supports `like` and `bookmark` only. `bookmark` is the only active PWA runtime write; `like` is backend-infrastructure-only from the active PWA perspective.

## 7. Matrix 4 - Save Semantics Fragmentation

| Module | Save implementation | Backend-backed? | localStorage? | UI-only? | Notes |
| --- | --- | --- | --- | --- | --- |
| Blog | Visible buttons without handlers | no | no | yes | E-BLOG-UI. |
| Pulse | `useState` save + TODO; native share | no | no | yes/local-only state | E-PULSE-LOCAL. |
| RF | Favorites and local planning vouchers | no for favorites/planning; yes for separate server claimed vouchers | yes | no | E-RF-LOCAL, E-RF-FAVORITE, E-RF-LOCAL-VOUCHER. RF favorite is not `like`. |
| Rielt | `setIsSaved(!isSaved)` and label "local" | no | no | local component state | E-RIELT-LOCAL. Inquiry is not save. |
| Guru | Card save callback exists but route does not pass it | no | no | yes/unwired | E-GURU-UNWIRED. |
| Space | `useSpaceSavedReactions` -> `/v1/reactions` bookmark | yes | no | no | E-PWA-SPACE-SAVE. Only for `space_post`. |
| Quest | Save later disabled/deferred | no | no | deferred | E-QUEST-SHARE. |
| Connect | Referral share/copy only | no save owner | local/browser copy only | no save primitive | Connect remains projection-only. |

Save conclusion: there are at least five distinct "save" realities: backend Space bookmark, RF localStorage, local component state, decorative UI-only buttons, and deferred/disabled saves. Universal save is feasible only as future work on top of existing infrastructure; it does not exist today.

## 8. Matrix 5 - Propagation Capability

| Capability | Exists? | Runtime-backed? | Generic? | Space-only? | Notes |
| --- | --- | --- | --- | --- | --- |
| repost create | partial | yes in Space service for existing Space post repost; not active PWA object-surface create | no | yes | E-SPACE-REPOST-API, E-NEG-PWA-REPOST. |
| object-bound repost | partial read model | Space post schema has repost target refs; create from object page not found | enum generic over 7 target types | Space-owned | E-SPACE-TARGETS, E-SPACE-REPOST-READ. |
| share-to-Space | missing in PWA object modules | no | no | n/a | No object-surface share-to-Space handler found. |
| object reference propagation | partial | Space can display/resolve references after they exist | partial | Space | Repost display is read/projection, not create. |
| feed insertion | yes for Space posts | yes | no | Space feed | `space-service` writes posts/reposts; not through Reactions. |
| object resolution | partial | yes for Space repost previews/read | partial | Space | Resolver/read path exists; Blog path is weak per F/G. |
| reverse resolution | weak/missing | no general reverse index evidenced | no | n/a | No generic "which Space posts reference this object" surface found in active PWA. |
| propagation ownership | partial | Space owns posts/reposts; Reactions owns facts | no | Space/Reactions split | Boundary is safe if not collapsed. |
| reaction event propagation | partial/conceptual | no external event bus | generic contract | no | Events are staged/logged only. |
| notifications | partial | incoming Space like activity only | no | `space_post` like only | No push/email/general notification service found. |

Propagation conclusion: current Reactions Service is not a propagation service. The canonical F/G direction (`object page -> object-bound Space repost/post reference`) is still not active end-to-end.

## 9. Matrix 6 - Ownership and Boundary Safety

| Concern | Safe? | Evidence | Risk | Notes |
| --- | --- | --- | --- | --- |
| Connect separation | yes | A1/E/F/G plus no reactions->Connect calls found | low | Connect remains projection-only and is not action owner. |
| Quest proof separation | yes | A1/D/G plus `quest` only an infrastructure target type | medium inflation risk | Quest proof/review is lifecycle, not social review. |
| RF favorite separation | yes | E-RF-LOCAL, E-RF-FAVORITE | medium UX/inflation risk | RF favorite is localStorage, not `like`. |
| Rielt inquiry separation | yes | E-RIELT-LOCAL plus A1/D/F | low | Inquiry is not Space discussion and not bookmark. |
| local save vs runtime save | partial/safe if qualified | E-PWA-SPACE-SAVE, E-RF-LOCAL, E-PULSE-LOCAL, E-BLOG-UI, E-GURU-UNWIRED | high maturity inflation | Owner-qualified wording is mandatory. |
| repost display vs create | safe if qualified | E-SPACE-REPOST-READ, E-SPACE-REPOST-API, E-NEG-PWA-REPOST | high maturity inflation | Display/read cannot prove create. |
| Space vs economy boundaries | yes | E-EVENTS-NOOP; E/F/G owner-fact rules | medium future risk | Space bookmarks/likes do not create Points/Connect facts. |
| Reaction owner facts | partial | E-RXN-SCHEMA, E-RXN-HARD-DELETE | medium | Owner is clear, but soft-delete contract/runtime mismatch exists. |
| Moderation boundaries | partial | E-AUTH, E-NEG-MODERATION | medium | User-scoped auth only; no moderator/admin flow. |

Ownership conclusion: no authority-collapse blocker was found. The main risk is interpretation drift: broad backend enums and UI icons can be misread as universal spine maturity.

## 10. Matrix 7 - Readiness Assessment

| Capability | Current maturity | Reusable for 13B.1? | Needs redesign? | Notes |
| --- | --- | --- | --- | --- |
| reactions DB model | partial/strong substrate | yes | no core redesign indicated | Polymorphic fact table and uniqueness are reusable. |
| generic reaction ownership | partial | yes for `like`; not for universal save today | no, but policy expansion would be needed | `bookmark` guard makes runtime Space-centric. |
| reusable bookmark logic | partial | yes for Space saved posts only | no for Space; broader save needs semantics | `/mine` is hard-scoped to `space_post` + `bookmark`. |
| reusable propagation logic | low | no | separate Space propagation track needed | Reactions is not propagation owner. |
| reusable object references | partial | yes as enum/reference substrate | no core redesign, but product mapping gaps exist | Missing `city`, `country`, `guide/article`, `rf_offer` exact types. |
| reusable SDK/hooks | partial | generated yes; PWA hook no | no core redesign; client abstraction missing | No stable `reactions` namespace or generic hook. |
| scalability | partial | yes with caveats | no full redesign | Batch summary has 100-target cap; throttle is in-memory; no reconciliation found. |
| moderation readiness | low | not mature | likely needs dedicated lifecycle later | No reaction flag/admin moderation. |
| retention readiness | partial | Space-only | no core redesign, but semantics contract needed | Universal save not ready. |
| event propagation | low | contract reusable | publisher/runtime needs future activation | Noop publisher. |
| public ecosystem readiness | no | no | n/a | G remains: conditional stabilization only. |

Readiness conclusion: current infra can be extended incrementally as a reaction fact service, but not treated as the whole Interaction Spine. Propagation and universal retention require separate contract work after A0.

## 11. Required Findings

### 11.1 Service Reality

There is a real Reactions Service, not merely isolated Space UI state.

Evidence:

- Runtime routes in `apps/reactions-service/src/routes/reactions.ts`.
- Runtime service logic in `apps/reactions-service/src/services/reactionsService.ts`.
- DB schema and migrations in `packages/db`.
- Gateway proxy in `apps/api-gateway`.
- OpenAPI contract in `docs/openapi/reactions.yaml`.

However, active PWA usage is narrow:

- `useSpaceSavedReactions` uses `/v1/reactions/mine`, `POST /v1/reactions`, and `DELETE /v1/reactions/{id}` for `space_post` bookmark only.
- scoped search found no active PWA `like` writes or reaction summary consumption.

Verdict: real service, Space-centric product activation.

### 11.2 Generic vs Space-Centric

Generic parts:

- DB schema stores `(user_id, target_type, target_id, reaction_type)`.
- `ReactionTargetType` includes `space_post`, `blog_post`, `place`, `event`, `partner`, `listing`, `quest`.
- `like` writes and summaries accept whitelisted target types.
- event contracts include generic target payloads.

Space-centric parts:

- `bookmark` is accepted only for `space_post`.
- `/v1/reactions/mine` accepts only `targetType=space_post&reactionType=bookmark`.
- active PWA hook is named and typed as Space saved reactions.
- feed-service reaction enrichment is typed for `space_post` targets only.
- incoming activity projection is only for `space_post` likes.

Verdict: generic backend substrate, Space-centric operational/runtime usage.

### 11.3 Save Semantics

How many save implementations exist:

1. Space backend bookmark through `/v1/reactions`.
2. RF localStorage favorites and local planning vouchers.
3. Pulse/Rielt local component state.
4. Blog decorative UI buttons.
5. Guru visible save button with unwired route callback.
6. Quest deferred save placeholder.

Which are runtime-backed:

- Space `space_post` bookmark only.

Which are local-only/UI-only:

- RF localStorage, Pulse state/TODO, Rielt state, Blog buttons, Guru unwired callback, Quest deferred save.

Universal save feasibility:

- Technically plausible because the service has a polymorphic fact table.
- Not runtime-backed today because service policy rejects non-`space_post` bookmarks and PWA object surfaces do not call the Reactions API.

### 11.4 Propagation

No object-originated propagation was found in active PWA object modules.

Space infrastructure has partial support:

- Space can create posts and repost existing Space posts.
- Space post schema and OpenAPI contain object reference fields.
- active feed can display repost/reference previews.

But:

- active PWA object pages do not call `repostSpacePost`, `createSpaceRepost`, `/v1/space/posts/{id}/repost`, or create `postType: repost`;
- Reactions Service does not own repost/discuss/share-to-Space;
- `bookmark` is retention, not propagation.

Verdict: reusable propagation foundation is not present in Reactions. Propagation remains a Space-owned, not fully wired track.

### 11.5 Ownership

Owner boundaries are mostly safe:

- Reactions owns reaction facts and like aggregates.
- Space owns posts/reposts/feed/activity social surfaces.
- Connect remains projection-only.
- Quest/RF/Rielt lifecycle actions are not counted as socialization.
- RF favorites remain explicitly local and not `like`.

No evidence was found that Reactions writes Points, wallet, Connect, RF voucher authority, Quest proof authority, Rielt booking authority, or settlement facts.

Known service-level risks:

- hard delete conflicts with `reaction_status: deleted` schema/contract semantics;
- aggregate count has no evidenced reconciliation job;
- noop event publisher means downstream consumers are not actually receiving reaction events;
- cross-domain write into `space_activity_projection` is tightly coupled and Space-only;
- no moderation lifecycle beyond owner-scoped CRUD and in-memory throttle.

### 11.6 13B.1 Foundation Readiness

Current reactions infra can be extended incrementally as a reaction fact service:

- DB identity and uniqueness are reasonable;
- like aggregates and summary endpoints exist;
- idempotency exists for writes;
- OpenAPI/generated types exist;
- gateway/auth routing exists.

Foundational redesign of the core reaction fact table is not evidenced as necessary by this audit.

But current infra is not enough for 13B.1 ecosystem claims:

- universal save is missing;
- propagation is not owned by Reactions and is not wired from object pages;
- active PWA like writes are missing;
- moderation/readiness/reconciliation are immature;
- SDK/hooks are not generic enough for cross-module use.

## 12. Runtime Reality Tags

| Area | Tag | Reality |
| --- | --- | --- |
| Reactions service existence | match | Separate backend service and routes exist. |
| Reaction DB model | match/partial | Generic table exists; soft-delete mismatch. |
| `like` API | partial | Backend accepts; active PWA write missing. |
| `bookmark` API | partial | Backend-backed only for `space_post`. |
| Space saved posts | match | Runtime-backed bookmark save/unsave exists. |
| Cross-module save | missing/local-only/UI-only | Non-Space modules do not use Reactions save. |
| Repost display | partial | Space displays existing repost refs. |
| Repost create | partial/missing | Space API exists for Space post repost; active object-originated PWA create missing. |
| share-to-Space | missing | No active object-surface Space create handler found. |
| native share | local-only | Browser share/clipboard only. |
| moderation | missing/partial | Auth/throttle only; no reaction moderation lifecycle. |
| notifications/events | deferred/partial | Event contract noop; Space like activity projection only. |
| Connect boundary | match | Projection-only; no reaction ownership. |

## 13. Findings by Severity

### High

| ID | Finding | Evidence | Impact |
| --- | --- | --- | --- |
| A0-HIGH-01 | Runtime Reactions usage is Space-centric: only `space_post` bookmark is active in PWA. | E-RXN-BOOKMARK-GUARD, E-PWA-SPACE-SAVE, E-NEG-PWA-LIKE | Blocks universal reactions/save claims. |
| A0-HIGH-02 | Reactions is not a propagation foundation. | E-SPACE-REPOST-API, E-NEG-PWA-REPOST, E-SPACE-REPOST-READ | Object -> Space create path remains a separate P0 gap. |
| A0-HIGH-03 | Save semantics remain fragmented across backend, localStorage, local state, UI-only, unwired, and deferred flows. | Matrix 4 | Blocks retention maturity. |
| A0-HIGH-04 | Service contract/status implies soft delete, but runtime uses hard delete. | E-RXN-HARD-DELETE, E-RXN-SCHEMA | Drift risk for auditability/idempotency/replay semantics. |

### Medium

| ID | Finding | Evidence | Impact |
| --- | --- | --- | --- |
| A0-MED-01 | `like` aggregation and summary are backend-backed but not actively consumed for PWA like writes. | E-RXN-AGG, E-FEED-CONSUMER, E-NEG-PWA-LIKE | API maturity can be overstated. |
| A0-MED-02 | Event contract exists but publisher is noop. | E-EVENTS-NOOP | Downstream event-driven projections are not real. |
| A0-MED-03 | Space incoming-like activity projection is synchronous and Space-only. | E-ACTIVITY-PROJ | Projection coupling and genericity risk. |
| A0-MED-04 | No reaction moderation/report/admin lifecycle found. | E-NEG-MODERATION, E-AUTH | Social abuse/moderation readiness is low. |
| A0-MED-05 | SDK support is generated/low-level; no stable `reactions` namespace or generic PWA hook exists. | E-SDK-GENERATED, E-PWA-SPACE-SAVE | Cross-module adoption would repeat ad hoc clients. |
| A0-MED-06 | Target enums do not exactly cover some product nouns (`atlas_place`, `pulse_event`, `rielt_listing`, `rf_offer`, `guide/article`). | Matrix 2 | Mapping ambiguity before universal reactions. |

### Low / Guardrail

| ID | Finding | Evidence | Impact |
| --- | --- | --- | --- |
| A0-LOW-01 | Gateway/auth boundary is present and owner-scoped. | E-GATEWAY, E-AUTH | Safe baseline. |
| A0-LOW-02 | Reactions do not currently violate Connect/economy boundaries. | E-EVENTS-NOOP, A1/E/F/G | Main risk is maturity inflation, not authority collapse. |

## 14. Review Gate Results

| Review gate | Result | Notes |
| --- | --- | --- |
| Runtime Governance Review | Pass with major gaps | Reaction fact owner exists; soft-delete, aggregate reconciliation, noop events and Space-only projection are governance gaps. |
| Architecture Review | Pass with caveats | Generic fact service can be reused; propagation belongs to Space and remains unwired from object pages. |
| Canon Review | Pass | A1 taxonomy preserved; no new semantics introduced. |
| QA Review | Pass | Required matrices and evidence/negative evidence included. |
| Propagation Review | Pass with major gap | Repost display/create split preserved; object-originated propagation missing. |
| Boundary Review | Pass | Connect, Quest, RF, Rielt and Space/economy boundaries remain separated. |

## 15. Acceptance Criteria Status

| Criterion | Status |
| --- | --- |
| Full reactions infrastructure inventory exists | met |
| targetType matrix exists | met |
| reactionType matrix exists | met |
| save fragmentation matrix exists | met |
| propagation capability matrix exists | met |
| ownership/boundary matrix exists | met |
| readiness matrix exists | met |
| reusable vs missing infrastructure identified | met |
| Space-centric vs generic distinction clarified | met |
| No implementation drift occurred | met |
| No new semantics invented | met |
| Final readiness verdict exists | met |

## 16. Final Readiness Verdict

| Question | Answer |
| --- | --- |
| Is there already a real Reactions Service? | Yes. |
| Is it only isolated Space bookmark infrastructure? | No, the backend is broader than that; however active PWA usage is only Space bookmark. |
| Is current implementation generic? | Partially: fact model and `like` target support are generic over 7 target types. |
| Is current implementation Space-centric? | Yes operationally: `bookmark`, `/mine`, PWA hook, feed consumer and activity projection are Space-focused. |
| Is there reusable propagation foundation already? | No. Reactions is not propagation; Space repost/create remains separate and object-originated PWA create is missing. |
| Can current reactions infra be extended incrementally? | Yes as a reaction fact substrate. |
| Is foundational redesign required? | Not proven for the reaction fact model. Propagation/universal save require separate contract work, not a claim that current service is already universal. |
| Which parts are reusable? | DB fact model, unique identity, like aggregate/summary, idempotency, OpenAPI/generated types, gateway/auth, event contract. |
| Which parts are dangerous/legacy? | Broad enums without UI usage, hard delete vs deleted status, noop events, Space-only activity projection, local saves with similar labels. |
| Which parts are merely missing? | Generic PWA hooks, universal bookmark policy, object page reaction handlers, PWA like writes, reaction moderation, reconciliation, share-to-Space/repost create wiring. |

Final audit verdict:

`reactions-service` is a real bounded interaction-fact service with partial generic foundations. Go2Asia does not yet have a reusable universal Interaction Spine foundation in active runtime. Current runtime remains fragmented and Space-centric at the product/PWA layer.

## 17. Final Status Tokens

stage_13B_1_A0_status: COMPLETE_WITH_FRAGMENTED_REACTION_INFRASTRUCTURE

stage_13B_1_A0_next_slice: Stage_13B_1_A_Stabilization_Framework_And_Service_Boundary_Scoring_Matrix

stage_13B_1_A0_implementation_drift: false

stage_13B_1_A0_public_launch_implied: false

stage_13B_1_A0_does_not_reopen_A1_taxonomy: true

stage_13B_1_A0_is_not_implementation_plan: true
