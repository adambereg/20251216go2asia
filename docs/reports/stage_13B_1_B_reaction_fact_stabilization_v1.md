# Stage 13B.1-B - Reaction Fact Stabilization

Status: `COMPLETE_WITH_PENDING_BOOKMARK_CONTRACT`

Mode: `BOUNDED_STABILIZATION_REACTION_FACT_LAYER`

Lead: AI Program Director / Orchestrator

Supporting agents: Runtime Governance Architect, Software Architect, Backend/API Analyst, Frontend Developer, QA Agent, Technical Canon Writer, Delivery Planner.

## 1. Executive Summary

Stage 13B.1-B stabilizes Reactions as a bounded interaction-fact substrate, not as a universal Interaction Spine.

The core B decision is:

- `like` is stable enough as a bounded backend reaction fact primitive.
- `like` is not a socialization maturity claim, propagation primitive, Connect fact or reward trigger.
- `bookmark` remains `space_post`-only in this slice.
- universal bookmark/save remains blocked until Stage 13B.1-C.
- Reactions remains a fact owner; Space remains propagation owner.
- feed-service like enrichment is service-backed but not end-to-end PWA production-ready because the active PWA Space feed uses `/v1/space/feed/*`.
- event publisher remains noop/deferred and must not be treated as active event delivery.

This report makes stabilization decisions and gates. It does not implement code, migrations, OpenAPI changes, UI buttons, universal saves, repost creation, share-to-Space, comments, Connect integration, economy integration or reward hooks.

## 2. Scope and Boundaries

In scope:

- `/v1/reactions` runtime behavior;
- reaction summary endpoints;
- like aggregates;
- idempotency and replay semantics;
- delete/status semantics;
- OpenAPI/runtime/schema alignment;
- targetType and reactionType policy enforcement;
- event contract labeling;
- SDK/frontend contract readiness;
- feed/reaction consumption readiness;
- current Space bookmark path as bounded retention.

Out of scope:

- repost create;
- share-to-Space;
- comments/discuss;
- universal bookmark rollout;
- object-level save rollout;
- Space feed redesign;
- Connect redesign;
- economy integration;
- Points/rewards;
- notifications;
- moderation system redesign;
- social graph;
- public launch readiness.

Frozen canonical rules:

1. `repost display != repost create`.
2. `native share != share-to-Space`.
3. `local save != runtime-backed save`.
4. `lifecycle != socialization`.
5. `inquiry != Space discussion`.
6. `Connect projection != owner-fact`.
7. `Space read != universal propagation`.
8. `bookmark != universal object retention yet`.
9. `Quest proof/review != social review`.
10. `RF favorite != like`.
11. `navigation/deeplink != propagation`.
12. `Reactions Service != propagation owner`.
13. `Space Service owns repost/share-to-Space`.
14. `like != reward trigger`.
15. `bookmark != economy signal`.

## 3. A0 Findings Carried Forward

From Stage 13B.1-A0:

- Reactions Service is real and runtime-backed.
- Backend substrate is broader than active PWA usage.
- Current active PWA write is `targetType: space_post`, `reactionType: bookmark`.
- Like infrastructure exists but is not actively consumed in PWA.
- Save semantics are fragmented.
- Reactions is not propagation owner.
- Space owns repost/share-to-Space.
- Connect is projection-only.
- Soft-delete/runtime drift exists.
- Event publisher is noop.
- Feed enrichment path is partial.

A0 high risks carried into B:

- runtime Reactions usage is Space-centric;
- Reactions is not propagation foundation;
- save semantics remain fragmented;
- service contract/status implies soft delete, but runtime uses hard delete.

## 4. A Framework Rules Carried Forward

From Stage 13B.1-A:

- Reactions Service owns reaction facts, reaction identity, idempotency, `like`, current `space_post` bookmark and like aggregates.
- Space Service owns posts, reposts, object-bound references, feed insertion, activity and share-to-Space.
- Content modules do not own global reaction facts or global save state.
- Connect is projection-only.
- `like` is the first candidate for Reaction Fact Stabilization.
- `bookmark/save` can become universal only after an explicit universal bookmark contract.
- B next slice must be fact-layer stabilization, not UI implementation.

From A1:

- visible icons are not enough;
- save/bookmark must be owner-qualified;
- native share is local-only;
- repost display is read/projection evidence, not create availability;
- Connect display is projection-only.

## 5. Matrix 1 - Runtime/OpenAPI Drift

| Concern | Runtime reality | OpenAPI/schema reality | Drift severity | Decision |
| --- | --- | --- | --- | --- |
| hard delete vs deleted | `deleteReactionByIdForUser` physically deletes rows; second delete returns not found; idempotency replay after hard delete returns conflict. Evidence: `apps/reactions-service/src/db/queries/reactions.ts:116-124`, `apps/reactions-service/src/services/reactionsService.ts:197-199`. | `ReactionStatus` enum includes `active`, `deleted`. Evidence: `docs/openapi/reactions.yaml:398-400`, `packages/db/src/schema/reactions.ts:14`. | high | `drift`; B must record hard-delete as current runtime and require future explicit lifecycle decision before claiming soft-delete compliance. |
| bookmark semantics | Runtime accepts `bookmark` only for `space_post`; `/mine` hard-scoped to `space_post` + `bookmark`. Evidence: `apps/reactions-service/src/services/reactionsService.ts:91-93`, `apps/reactions-service/src/services/reactionsService.ts:109-111`. | OpenAPI upsert accepts `ReactionType` enum, while `/mine` query enum is `space_post` + `bookmark`. Evidence: `docs/openapi/reactions.yaml:187-216`, `docs/openapi/reactions.yaml:390-396`. | medium | `partial`; keep bookmark `space_post`-only until Stage 13B.1-C. |
| summary semantics | Runtime summary returns only `counts.like` and `viewer.liked`. Evidence: `apps/reactions-service/src/services/reactionsService.ts:453-460`, `apps/reactions-service/src/services/reactionsService.ts:493-498`. | OpenAPI `ReactionSummaryItem` requires only `counts.like` and `viewer.liked`. Evidence: `docs/openapi/reactions.yaml:453-473`. | low | `match`; summary is like-only by contract. |
| targetType scope | Runtime whitelist: `space_post`, `blog_post`, `place`, `event`, `partner`, `listing`, `quest`. Evidence: `apps/reactions-service/src/services/reactionsService.ts:26-34`. | OpenAPI/schema use the same enum. Evidence: `docs/openapi/reactions.yaml:394-396`, `packages/db/src/schema/reactions.ts:5-13`. | low | `match`; product nouns outside enum remain pending contract. |
| reactionType scope | Runtime allows `like`, `bookmark`. Evidence: `apps/reactions-service/src/services/reactionsService.ts:59`. | OpenAPI/schema use `like`, `bookmark`. Evidence: `docs/openapi/reactions.yaml:390-392`, `packages/db/src/schema/reactions.ts:4`. | low | `match`; `repost`, `share_to_space`, `favorite`, `follow`, `comment`, `review` are not Reactions types. |
| event semantics | Runtime publishes to `createNoopReactionsEventPublisher`, which logs staged events only. Evidence: `apps/reactions-service/src/events/publisher.ts:9-19`. | Event contract defines `reaction.created` and `reaction.deleted`. Evidence: `apps/reactions-service/src/events/contracts.ts:1-31`. | medium | `deferred`; event publisher remains explicitly noop/staged in B. |
| batch summary | Runtime accepts 1-100 targets, dedupes by key, performs sequential summary reads. Evidence: `apps/reactions-service/src/services/reactionsService.ts:126-145`, `apps/reactions-service/src/services/reactionsService.ts:480-501`. | OpenAPI has `minItems: 1`, `maxItems: 100`. Evidence: `docs/openapi/reactions.yaml:491-509`. | low/partial | `match` on contract; performance/reconciliation remains bounded caveat. |
| pagination semantics | Runtime `/mine` uses `limit`, returns `nextCursor: null`. Evidence: `apps/reactions-service/src/services/reactionsService.ts:423-428`, `apps/reactions-service/src/db/queries/reactions.ts:224-244`. | OpenAPI exposes `limit` and response with `nextCursor`; no cursor query parameter in shown contract. Evidence: `docs/openapi/reactions.yaml:187-223`. | low/medium | `partial`; treat `/mine` as limit slice, not cursor pagination. |

Drift decision: B is complete as a decision record if these drifts are frozen and not overclaimed. No runtime code was changed in this slice.

## 6. Matrix 2 - Reaction Fact Integrity

| Concern | Current state | Stable enough? | Risk | Notes |
| --- | --- | --- | --- | --- |
| uniqueness | Unique `(user_id, target_type, target_id, reaction_type)` in DB and `ON CONFLICT DO NOTHING` on insert. Evidence: `packages/db/src/schema/reactions.ts:28-48`, `apps/reactions-service/src/db/queries/reactions.ts:72-97`. | yes | low | Stable substrate invariant. |
| idempotency | Optional `Idempotency-Key`, payload hash, conflict on key reuse with different payload, replay when active row exists. Evidence: `apps/reactions-service/src/services/reactionsService.ts:148-207`, `packages/db/migrations/0017_reactions_idempotency_v1.sql:6-20`. | yes with caveat | medium | Replay after delete is conflict because row is hard-deleted. |
| replay | Active replay returns `applied: false`; missing active reaction returns 409. Evidence: `apps/reactions-service/src/services/reactionsService.ts:193-207`. | partial | medium/high | Stable enough if documented as current runtime, not soft lifecycle. |
| delete semantics | Hard delete scoped by `id` + `user_id` + active status; second delete not found. Evidence: `apps/reactions-service/src/db/queries/reactions.ts:116-124`, `apps/reactions-service/src/services/reactionsService.ts:338-347`. | partial | high | Drift with `deleted` enum remains future fix/gate. |
| aggregate updates | `like` create increments; `like` delete decrements; bookmark does not update aggregate. Evidence: `apps/reactions-service/src/services/reactionsService.ts:266-286`, `apps/reactions-service/src/services/reactionsService.ts:349-365`, `apps/reactions-service/src/db/queries/reactions.ts:127-138`. | yes with caveat | medium | No evidenced reconciliation/shadow compare. |
| viewer state | Summary computes viewer liked from canonical active reaction rows. Evidence: `apps/reactions-service/src/db/queries/reactions.ts:149-171`. | yes | low | Viewer state is stronger than aggregate count. |
| batch reads | Batch validates 1-100 targets, dedupes, returns like summaries. Evidence: `apps/reactions-service/src/services/reactionsService.ts:126-145`, `apps/reactions-service/src/services/reactionsService.ts:480-501`. | yes with caveat | low/medium | Sequential per-target reads; no partial error model. |
| partial failures | Insert/idempotency/aggregate/activity/publish steps are not evidenced as a single DB transaction. | partial | medium | B must not claim transactional event/aggregate perfection. |

Integrity decision: the fact model is stable enough as a bounded substrate for `like`, with explicit gaps around hard delete, aggregate reconciliation and partial-failure semantics.

## 7. Matrix 3 - Like Stabilization Matrix

| Area | Runtime status | Allowed now? | Needs further slice? | Notes |
| --- | --- | --- | --- | --- |
| backend like writes | Runtime accepts `like` across the whitelisted target types. Evidence: `apps/reactions-service/src/services/reactionsService.ts:80-98`. | yes | no for backend fact substrate | Like is first B primitive. |
| summary reads | Single summary returns like count and viewer liked. Evidence: `apps/reactions-service/src/services/reactionsService.ts:432-463`. | yes | no | Stable as read model, not UI maturity. |
| batch summary | Batch summary supports 1-100 targets. Evidence: `docs/openapi/reactions.yaml:491-509`, `apps/reactions-service/src/services/reactionsService.ts:466-501`. | yes | no, with performance caveat | Dedup/sequence behavior should be documented. |
| feed enrichment | feed-service composes `space_post` like summary and degraded fallback. Evidence: `apps/feed-service/src/clients/reactionsClient.ts:70-87`, `apps/feed-service/src/services/feedService.ts:159-207`. | service-layer yes | yes for PWA end-to-end | Active PWA Space feed bypasses this path. |
| PWA consumption | Scoped PWA search found no `reactionType: 'like'`, `upsertReaction`, `getReactionSummary`, `getReactionSummaryBatch`, `useReaction`, `useLike`, `useBookmark` calls. | no | yes | Like UI rollout is forbidden in B. |
| generic hooks | No stable `reactions` namespace in `packages/sdk/src/index.ts`; PWA uses Space-specific hook. Evidence: `packages/sdk/src/index.ts:1-27`, `apps/go2asia-pwa-shell/components/space/runtime/useSpaceSavedReactions.ts:31-150`. | contract only | yes | Hooks may be specified, not rolled out broadly in B. |
| object readiness | target enum exists, but product nouns and PWA surfaces remain gated by A/C/D/E. | partial | yes | Like fact stability does not equal object action-row readiness. |

Decision: `like` can now be considered stable enough as a bounded backend fact primitive, not as ecosystem-ready socialization or a PWA product loop.

## 8. Matrix 4 - Bookmark Semantics Matrix

| Concern | Current reality | Allowed interpretation | Forbidden interpretation | Notes |
| --- | --- | --- | --- | --- |
| `space_post` bookmark | Runtime-backed via `/v1/reactions` and `useSpaceSavedReactions`. Evidence: `apps/go2asia-pwa-shell/components/space/runtime/useSpaceSavedReactions.ts:79-150`. | Space post retention fact | universal object save | Allowed now. |
| `/mine` semantics | Only `targetType=space_post&reactionType=bookmark&limit<=50`. Evidence: `apps/go2asia-pwa-shell/components/space/runtime/utils.ts:3-5`, `apps/reactions-service/src/services/reactionsService.ts:101-123`. | saved Space post list slice | generic saved-items endpoint | Universal `/mine` pending C. |
| saved Space posts | `/space/saved` removes bookmark and hydrates posts separately, per A0. | bounded Space Saved surface | universal saved hub | Hub evolution pending F after C. |
| universal bookmark | Not implemented; non-`space_post` bookmark rejected. | preferred future direction after 13B.1-C | silently expanding bookmark in B | `pending_contract`. |
| RF favorite | localStorage favorite/planning, not Reactions. Evidence from A0: `apps/go2asia-pwa-shell/lib/rfLocalUserState.ts`. | local-only RF utility | `like` or bookmark | Must remain quarantined. |
| local save | Pulse/Rielt/Guru/Blog local or UI-only, not Reactions. | owner-qualified local/UI-only | runtime-backed save | A1 frozen rule. |
| organizer bridge | Saved Space posts can bridge to Organizer separately from bookmark fact. | adjacent utility after save | proof of universal bookmark | Does not change bookmark owner. |

Decision: bookmark must remain `space_post`-only for now. Universal bookmark is blocked until Stage 13B.1-C.

## 9. Matrix 5 - SDK / Frontend Contract Matrix

| Capability | Exists? | Stable enough? | Scope | Notes |
| --- | --- | --- | --- | --- |
| generated SDK | yes | partial | DTO/types and generated low-level surface | `sdk/go2AsiaPlatformAPI.ts` has generated functions, but active PWA does not use them directly. |
| reactions namespace | no | no | curated `@go2asia/sdk` namespace | `packages/sdk/src/index.ts:1-27` exports no `reactions` namespace. |
| generic hook surface | no | no | future bounded hooks | Scoped search found no `useReaction`, `useLike`, `useBookmark`. |
| summary hooks | no | no | future like read hooks | Feed-service consumes summary server-side; PWA does not. |
| bookmark hooks | yes, Space-specific | stable for Space only | `space_post` bookmark | `useSpaceSavedReactions` is not generic. |
| like hooks | no | no | future B/E handoff | Like hook safe only after contract; no UI rollout in B. |
| batch summary hooks | no | no | future read contract | Batch exists backend/feed-service; no PWA hook. |

Decision: generic hooks can be safely introduced only as a bounded contract surface after B gates; unconstrained generic hooks are not safe because bookmark is not universal and PWA like rollout is not in scope.

## 10. Matrix 6 - Feed / Reaction Consumption Matrix

| Consumer | Current usage | Runtime-backed? | Gap | Notes |
| --- | --- | --- | --- | --- |
| feed-service | `fetchReactionBatchSummary` for `space_post` targets; degraded fallback. Evidence: `apps/feed-service/src/clients/reactionsClient.ts:70-87`, `apps/feed-service/src/services/feedService.ts:183-205`. | yes, service-layer | PWA not using this path | Treat as partial production service, not visible UI readiness. |
| space feed | PWA constant `HOME_FEED_URL=/v1/space/feed/home`; save through separate hook. Evidence: `apps/go2asia-pwa-shell/components/space/runtime/utils.ts:3-5`. | yes for feed read and bookmark | no like summary consumption | Feed likes are not displayed/written in active PWA. |
| saved posts | `useSpaceSavedReactions` and saved page use `/v1/reactions` bookmark. | yes | Space-only | Current bounded retention. |
| activity | Reactions can sync-project incoming `space_post` like activity, but publisher is noop. | partial | not generic activity hub | Activity remains Space social projection, not economy. |
| Blog | UI-only buttons from A0; no reactions PWA calls. | no | action row later | Not B scope. |
| Pulse | register lifecycle; legacy save local/TODO from A1/A0. | no for reactions | action row later | Register is lifecycle. |
| Atlas | no active reaction consumption from A0. | no | target mapping/action row later | Atlas place is pilot candidate after contracts. |

Decision: feed-service enrichment is service-layer bounded ready, but not end-to-end production-ready for the PWA like experience until the PWA consumption path is decided in a later slice.

## 11. Aggregate / Reconciliation Analysis

Current aggregate model:

- `reaction_aggregates` stores one `like_count` per `(target_type, target_id)`.
- Create like applies `+1`.
- Delete like applies `-1`.
- Delete uses `GREATEST(0, count + delta)`.
- Viewer state is computed from active `reactions` rows, not from the aggregate table.

Risk:

- Count and canonical fact rows can drift if a partial failure occurs between fact write and aggregate write.
- No reconciliation job, shadow compare, or repair endpoint was evidenced.
- Bookmark has no count by design and must not be inferred from summary.

Stabilization decision:

- `like_count` is acceptable as a bounded derived projection for B.
- B must not claim reconciled engagement counts.
- Future stabilization should define an invariant: `reaction_aggregates.like_count` should equal count of active `like` rows for the same target.
- Reconciliation remains `deferred`, not implemented in this report.

## 12. Event Publisher Analysis

Runtime:

- event contract exists for `reaction.created` and `reaction.deleted`;
- publisher is `createNoopReactionsEventPublisher`;
- publishing logs `Reactions event staged`;
- no external bus, notification service or Connect/Points consumer is evidenced.

Stabilization decision:

- event publisher must remain explicitly noop/deferred in B;
- downstream consumers must not assume delivery;
- reaction events must not create Points, rewards, Connect activity or notifications in this slice;
- Space incoming-like projection is a narrow synchronous projection for `space_post` likes, not a generic event bus.

## 13. Stabilization Decisions

| Question | Answer | Decision status |
| --- | --- | --- |
| Can like now be considered stable enough as a bounded fact primitive? | Yes, for backend fact-layer stabilization: write, summary, batch summary, aggregate and viewer state exist. It is not PWA/socialization maturity. | `allowed_bounded_fact` |
| Can generic hooks be safely introduced? | Yes only as bounded contract/hook surface with policy gates; not as unconstrained universal reactions and not as UI rollout. | `pending_contract` |
| Must bookmark remain `space_post`-only for now? | Yes. Runtime and OpenAPI `/mine` enforce this; B confirms it. | `confirmed_space_post_only` |
| Is universal bookmark blocked until Stage 13B.1-C? | Yes. | `blocked_until_13B_1_C` |
| Can feed-service enrichment be treated as production-ready? | Partially: service-layer enrichment is runtime-backed with degraded fallback, but E2E PWA consumption is not ready. | `service_ready_pwa_not_wired` |
| Must event publisher remain explicitly noop/deferred? | Yes. | `noop_deferred` |
| What absolutely must not be implemented in B? | Repost create, share-to-Space, comments/discuss, universal bookmark rollout, object-level save rollout, Connect/economy integration, reward hooks, moderation expansion, social graph. | `forbidden` |
| What becomes safe to consume in later module pilots? | Bounded `like` fact contract and summary semantics, existing Space post bookmark path, targetType/reactionType policy, and explicit feed-service caveats. | `handoff_ready_with_gates` |

## 14. Matrix 7 - Allowed vs Forbidden Stabilization Surface

| Capability | Allowed in B | Forbidden in B | Why |
| --- | --- | --- | --- |
| like stabilization | yes | treating as ecosystem-ready socialization | Reactions fact primitive only. |
| bookmark stabilization | yes for current `space_post` semantics | universal bookmark rollout | Universal bookmark belongs to Stage 13B.1-C. |
| repost create | no | yes | Space-owned propagation, not Reactions. |
| share-to-Space | no | yes | Space-owned create path, not Reactions. |
| comments/discuss | no | yes | deferred Space/social feature. |
| universal save rollout | no | yes | blocked until bookmark contract. |
| Connect integration | no | yes | Connect projection-only. |
| economy integration | no | yes | `like` and `bookmark` are not rewards/economy signals. |
| SDK/hook contract | yes as bounded contract | broad UI rollout | Contract can be prepared without implementation rollout. |
| feed enrichment hygiene | yes as service analysis | PWA feed redesign | B records gap, does not redesign Space feed. |

## 15. Risk Map

| Risk | Severity | Runtime reality tag | B decision |
| --- | --- | --- | --- |
| hard delete vs `deleted` enum | high | drift | frozen as drift; future lifecycle decision required. |
| idempotency replay after delete | high | drift/partial | document 409 behavior; no soft-delete claim. |
| aggregate drift without reconciliation | medium | partial | derived projection only; no reconciled-count claim. |
| noop publisher treated as bus | medium | deferred | explicitly noop/deferred. |
| backend like treated as PWA rollout | high | partial | bounded fact only; PWA rollout later. |
| bookmark treated as universal save | high | partial | blocked until C. |
| feed-service enrichment overclaimed | medium | partial | service-layer only; PWA not wired. |
| propagation collapse into Reactions | critical | unsafe if violated | forbidden. |
| Connect/economy collapse | critical | unsafe if violated | forbidden. |

## 16. Review Gate Results

| Review gate | Result | Notes |
| --- | --- | --- |
| Runtime Governance Review | Pass with caveats | Fact substrate is viable; delete/status and reconciliation remain documented drift. |
| Architecture Review | Pass | Reactions remains fact owner; Space remains propagation owner. |
| Canon Review | Pass | A1 and A boundaries preserved. |
| QA Review | Pass | Required matrices, decisions and status tokens are present. |
| Feed/Projection Review | Pass with caveats | feed-service enrichment is runtime-backed but not PWA-visible like UX. |
| Boundary Review | Pass | No Connect/economy/Space propagation collapse introduced. |
| Lightweight Economy Boundary Review | Pass | Likes/bookmarks are not reward or Points triggers. |

## 17. Acceptance Criteria Status

| Criterion | Status |
| --- | --- |
| Runtime/OpenAPI/schema drift matrix exists | met |
| Reaction fact integrity matrix exists | met |
| Like stabilization matrix exists | met |
| Bookmark semantics matrix exists | met |
| SDK/frontend contract matrix exists | met |
| Feed consumption matrix exists | met |
| Allowed/forbidden matrix exists | met |
| Required decisions explicitly answered | met |
| No implementation drift outside bounded stabilization scope | met |
| No A1 taxonomy reopening occurred | met |
| No propagation collapse occurred | met |
| Final status tokens exist | met |

## 18. Recommended Next Slice

Recommended next slice:

`Stage_13B_1_C_Universal_Save_Bookmark_Contract`

Why:

- B stabilizes `like` as the first bounded fact primitive.
- Current bookmark remains `space_post`-only.
- Save semantics are still fragmented across Space bookmark, localStorage, local state, UI-only and deferred actions.
- Universal bookmark/save policy must be decided before content module save buttons, Space Saved universal hub, or cross-module retention rollout.

Parallel read-only contract work may continue for Space-owned propagation (`Stage_13B_1_D_Space_Repost_Share_to_Space_Contract`), but it must remain separate from B and C.

## 19. Final Status Tokens

stage_13B_1_B_status: COMPLETE_WITH_PENDING_BOOKMARK_CONTRACT

stage_13B_1_B_next_slice: Stage_13B_1_C_Universal_Save_Bookmark_Contract

stage_13B_1_B_implementation_drift: false

stage_13B_1_B_public_launch_implied: false

stage_13B_1_B_does_not_reopen_A1_taxonomy: true

stage_13B_1_B_reactions_role: INTERACTION_FACT_OWNER

stage_13B_1_B_space_role: SOCIAL_PROPAGATION_OWNER

stage_13B_1_B_connect_role: PROJECTION_ONLY

stage_13B_1_B_like_status: BOUNDED_FACT_PRIMITIVE_STABLE

stage_13B_1_B_bookmark_status: SPACE_POST_ONLY_PENDING_13B_1_C
