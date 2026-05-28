# Stage 13B.1-G - Space Activity Tab Upgrade

Status: `COMPLETE_WITH_BOUNDED_ACTIVITY_PROJECTION`

Mode: `BOUNDED_SOCIAL_PROJECTION_SPACE_ACTIVITY_UPGRADE`

Lead: AI Program Director / Orchestrator

Supporting agents: Runtime Governance Architect, Software Architect, Frontend Developer, Backend/API Analyst, Interaction Systems Analyst, QA Agent, Technical Canon Writer, Delivery Planner.

## 1. Executive summary

Stage 13B.1-G upgrades `/space/activity` from a technical event list into a bounded social projection surface for the pilot Interaction Spine:

- activity cards now include actor context, clearer action wording, and stronger object identity;
- repost activity reuses E1 preview hydration for pilot `place/event/blog_post` references;
- CTA/href behavior is aligned with canonical runtime resolvers and target type labels;
- lightweight client-side type filtering (`Все типы`, `Репосты`, `Реакции`, `Публикации`, `Группы`) is added on top of existing server filter tabs (`Все`, `Входящие`, `Мои действия`).

No notification system, no economy/progression ledger, no universal interaction graph, no RF/Rielt/Quest rollout were introduced.

## 2. Scope and boundaries

In scope:

- readability/identity polish for existing Space activity projections;
- bounded reuse of E1 repost preview helper in activity cards;
- actor metadata visibility and clearer chips/labels;
- lightweight in-page type filtering (client-only).

Out of scope:

- adding new activity owner domains;
- bookmark/save activity writes;
- content-object like activity writes (`liked_place/event/blog_post`);
- notifications/read-unread/push/email;
- comments/discuss;
- economy hooks and progression semantics;
- Connect activity ownership;
- universal social graph redesign.

## 3. Current activity limitations

Before G:

- `/space/activity` showed runtime-backed events but with generic phrasing and weak identity;
- actor data from API existed but was not used in card presentation;
- repost objects in activity lacked pilot preview hydration from E1;
- CTA and href mapping were less specific than feed/saved surfaces.

## 4. Activity projection model

Projection ownership remains unchanged:

- Space service owns activity projection feed (`/v1/space/feed/activity`);
- reactions-service contributes only bounded `space.post_liked_by_other` projection for `space_post` likes;
- PWA activity remains read-only projection surface and does not write owner facts.

G only upgrades projection readability and interpretation on top of existing runtime classes.

## 5. Activity event classes

Visible runtime classes in G:

- `post_created`
- `repost_created`
- `post_reposted_by_other`
- `group_joined`
- `post_liked_by_other`

Deferred classes:

- `liked_place`, `liked_event`, `liked_blog_post`
- `saved_place`, `saved_event`, `saved_blog_post`

Reason for defer:

- bounded-noise rule and owner contracts C/D/E/E1;
- activity must not collapse into universal interaction ledger or retention mirror.

## 6. Activity readability improvements

Implemented:

- actor row (avatar/name/role + direction chip + timestamp);
- action-specific headlines (incoming/outgoing semantics);
- type chips and entity chips with clearer wording;
- reduced technical/generic copy fallback;
- CTA text bound to target type (`Открыть место/событие/статью/...`).

## 7. Activity filters/tabs

Preserved server filter tabs:

- `Все` (`all`)
- `Входящие` (`incoming`)
- `Мои действия` (`my_actions`)

Added lightweight local type filters:

- `Все типы`
- `Репосты`
- `Реакции`
- `Публикации`
- `Группы`

This stays client-side and bounded: no new API contract required.

## 8. Object identity improvements

For activity cards:

- explicit actor context for incoming events;
- object/type chips via `relatedEntityType`;
- E1 repost preview hydration reused for outgoing `repost_created` to pilot objects:
  - title;
  - short teaser;
  - optional image;
  - object-specific href/CTA.

## 9. Runtime implementation

Modified:

- `apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx`
  - actor-aware card layout;
  - semantic title/description mapping;
  - typed CTA and href mapping through runtime resolver;
  - E1 preview hydration reuse for repost activity;
  - local type-filter controls.

Reused existing runtime helpers:

- `apps/go2asia-pwa-shell/components/space/runtime/repostPreview.ts`
- `apps/go2asia-pwa-shell/components/space/runtime/utils.ts`

No backend write contract changes in G.

## 10. Pilot targetTypes

G remains aligned with pilot scope:

- `space_post`
- `place`
- `event`
- `blog_post`

For activity projection specifically:

- outgoing repost identity for `place/event/blog_post` is improved;
- incoming like/repost owner projection remains bounded to existing `space_post` semantics.

## 11. Deferred/quarantined surfaces

Deferred in G:

- RF/Rielt/Quest activity rollout;
- notifications;
- comments/discuss;
- universal interaction graph;
- economy hooks/progression events;
- Connect activity ownership changes;
- bookmark-derived activity events.

## 12. Runtime evidence

Code/runtime evidence:

- activity UI upgrade in:
  - `apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx`
- repost preview reuse:
  - `apps/go2asia-pwa-shell/components/space/runtime/repostPreview.ts`
- activity source contracts unchanged:
  - `apps/space-service/src/db/queries/space.ts` (`listActivityFeedRows`)
  - `docs/openapi/space.yaml` (`SpaceActivityFeedItem`)
- bounded reactions projection:
  - `apps/reactions-service/src/services/reactionsService.ts`
  - `apps/reactions-service/src/db/queries/activityProjection.ts`

Focused checks:

- `pnpm -C apps/go2asia-pwa-shell typecheck` -> pass.
- `pnpm -C apps/go2asia-pwa-shell lint` -> pass (warnings only, no errors).
- `pnpm -C apps/space-service test` -> pass, 25 tests.
- `ReadLints` on edited activity file -> no linter errors.

Negative evidence:

- no new `ContentActionRow`/`/v1/reactions`/`/v1/space/posts` wiring in `components/rf`, `components/rielt`, `components/quest`, `components/connect`.
- points producer allowlist unchanged:
  - `space_repost_created: FUTURE_ONLY`
  - `space_reaction_created: FUTURE_ONLY`

Screenshots:

- not collected in this implementation pass; evidence is runtime code paths and focused checks.

## 13. Risks and limitations

| Risk | Severity | Status | Notes |
| --- | --- | --- | --- |
| Activity still uses existing runtime event classes only | medium | accepted | bounded by design; no universal ledger expansion. |
| No bookmark activity projection | low/medium | accepted | retention remains in `/space/saved`. |
| Incoming object-owner events for place/event/blog remain absent | medium | accepted | beyond bounded G scope. |
| Client-side type filters are local-only | low | accepted | lightweight UX layer without API changes. |

## 14. Review gate results

| Review gate | Result | Notes |
| --- | --- | --- |
| Runtime Governance Review | Pass | Activity remains projection-only and owner boundaries preserved. |
| Architecture Review | Pass | No service ownership collapse; no new write authority introduced. |
| Frontend UX Review | Pass | Cards became actor-centric and object-readable. |
| Canon Review | Pass | C/D/E/E1 boundaries preserved; no taxonomy reopening. |
| QA Review | Pass | Typecheck/lint/tests and negative scans completed. |
| Activity/Projection Review | Pass | Upgraded projection readability without event inflation. |
| Boundary Review | Pass | RF/Rielt/Quest/notifications/comments/economy deferred. |
| Lightweight Economy Boundary Review | Pass | No reward hooks or producer upgrades. |

## 15. Acceptance criteria status

| Criterion | Status |
| --- | --- |
| Activity readability improved | met |
| Repost identity meaningful in Activity | met |
| Activity remains bounded and non-noisy | met |
| Space remains activity owner | met |
| Bookmark/like ownership remains separate | met |
| RF/Rielt/Quest remain deferred | met |
| No economy/reward hooks introduced | met |
| No A1 taxonomy reopening occurred | met |
| No projection collapse occurred | met |
| Final status tokens exist | met |

## 16. Recommended next slice

Recommended next slice:

`Stage 13B.1-G1 - Activity Projection Enrichment Hardening`

Why:

- G achieved readable bounded projection;
- next safe increment is runtime-hardening of activity previews and optional cursor/pagination ergonomics, without opening notifications/economy.

## 17. Final status tokens

stage_13B_1_G_status: COMPLETE_WITH_BOUNDED_ACTIVITY_PROJECTION

stage_13B_1_G_next_slice: Stage_13B_1_G1_Activity_Projection_Enrichment_Hardening

stage_13B_1_G_implementation_drift: false

stage_13B_1_G_public_launch_implied: false

stage_13B_1_G_does_not_reopen_A1_taxonomy: true

stage_13B_1_G_reactions_role: LIKE_AND_BOOKMARK_FACT_OWNER_ONLY_WITH_BOUNDED_SPACE_POST_INCOMING_LIKE_PROJECTION

stage_13B_1_G_space_role: PROPAGATION_AND_ACTIVITY_PROJECTION_OWNER

stage_13B_1_G_connect_role: PROJECTION_ONLY_NO_ACTIVITY_OWNER_WRITES

stage_13B_1_G_activity_scope: SPACE_ACTIVITY_PROJECTION_FOR_EXISTING_RUNTIME_CLASSES_WITH_PILOT_REPOST_IDENTITY_POLISH

## Matrix 1 - Activity Event Matrix

| Activity type | Owner | Runtime-backed? | Visible in Activity? | Notes |
| --- | --- | --- | --- | --- |
| `repost_created` | Space | yes | yes | outgoing projection for repost create |
| `post_created` | Space | yes | yes | outgoing projection for authored post |
| `post_reposted_by_other` | Space | yes | yes | incoming projection for reposted `space_post` |
| `group_joined` | Space | yes | yes | outgoing social projection |
| `liked_place` | Reactions (fact) | partial fact only | no (deferred) | intentionally not projected in G |
| `liked_event` | Reactions (fact) | partial fact only | no (deferred) | intentionally not projected in G |
| `liked_blog_post` | Reactions (fact) | partial fact only | no (deferred) | intentionally not projected in G |
| `saved_place` | Reactions (fact) | yes fact in `/mine` | no (deferred) | retention surface `/space/saved` |
| `saved_event` | Reactions (fact) | yes fact in `/mine` | no (deferred) | retention-only |
| `saved_blog_post` | Reactions (fact) | yes fact in `/mine` | no (deferred) | retention-only |

## Matrix 2 - Activity Preview Matrix

| targetType | Title | Excerpt | Image | CTA | Status |
| --- | --- | --- | --- | --- | --- |
| `space_post` | yes (activity headline + related post context) | yes when available | no | `Открыть пост` | implemented |
| `place` | yes (E1 preview hydration) | yes | optional | `Открыть место` | implemented |
| `event` | yes (E1 preview hydration) | yes | optional | `Открыть событие` | implemented |
| `blog_post` | yes (E1 preview hydration) | yes | optional | `Открыть статью` | implemented |
| `space_group` | yes (group-join semantics) | optional | no | `Открыть группу` | implemented |

## Matrix 3 - Activity UX Matrix

| UX element | Before | After | Notes |
| --- | --- | --- | --- |
| repost readability | generic technical copy | semantic headlines + chips + preview | bounded projection polish |
| source identity | weak | target chips + pilot preview reuse | aligned with E1 |
| generic copy | frequent | reduced, explicit fallback only | lower noise |
| filters | server tabs only | server tabs + lightweight type filters | bounded local-only layer |
| tabs | `all/incoming/my_actions` | preserved | canonical behavior retained |
| actor context | mostly hidden | visible actor row (name/avatar/role/self) | incoming clarity improved |

## Matrix 4 - Ownership Matrix

| Capability | Owner | Runtime/API | Notes |
| --- | --- | --- | --- |
| activity projection | Space (plus bounded reactions-like ingestion) | `/v1/space/feed/activity` | projection-only surface |
| repost create | Space | `POST /v1/space/posts` | propagation owner unchanged |
| like facts | Reactions | `/v1/reactions` + summary | no propagation ownership |
| bookmark facts | Reactions | `/v1/reactions` + `/mine` | retention only |
| Connect projection | Connect | read projections | no owner write in G |
| economy | Points/Economy services | N/A in G | explicitly excluded |

## Matrix 5 - Deferred / Quarantine Matrix

| Surface | Deferred? | Why | Future slice |
| --- | --- | --- | --- |
| RF/Rielt/Quest activity | yes | outside pilot interaction scope | cross-module activity contract |
| notifications | yes | separate delivery/read-state layer | notification slice |
| comments/discuss | yes | separate social primitive | discussion contract |
| universal interaction graph | yes | beyond bounded projection goal | social graph program |
| economy hooks | yes | activity is not progression ledger | economy contract only if approved |
| Connect activity ownership | yes | Connect remains projection-only | none in G |

## Matrix 6 - Allowed vs Forbidden Expansion

| Capability | Allowed in G | Forbidden in G | Why |
| --- | --- | --- | --- |
| activity readability | yes | full social layer redesign | bounded projection upgrade |
| repost identity polish | yes | universal preview framework | reuse E1 pilot helper only |
| local UI filters | yes | new backend event classes for all domains | avoid activity inflation |
| incoming/outgoing clarity | yes | notification inbox/read state | non-goal |
| retention events in activity | no | yes | bookmark remains retention-only |
| economy semantics | no | yes | activity != reward ledger |

## Matrix 7 - Remaining Known Gaps

| Gap | Severity | Deferred? | Future slice |
| --- | --- | --- | --- |
| universal activity graph | high | yes | activity platform expansion |
| read/unread state | medium | yes | notification/read-state slice |
| notifications | medium | yes | notification service integration |
| cross-module activity | high | yes | RF/Rielt/Quest activity contracts |
| progression/economy activity | high | yes | economy governance program |
| source validation | medium | yes | propagation hardening |
| universal social graph | high | yes | social graph roadmap |

## Required decisions

1. Which activity events are now visible?  
`post_created`, `repost_created`, `group_joined`, `post_liked_by_other`, `post_reposted_by_other`.

2. Are reposts now readable and meaningful in Activity?  
Yes. Actor-aware cards and pilot repost previews significantly improve readability.

3. Are likes/bookmarks projected into Activity or deferred?  
Only existing `post_liked_by_other` projection remains visible; bookmark and object-like classes are deferred.

4. Does Activity remain bounded and non-noisy?  
Yes. No universal event expansion, no retention inflation, no notification semantics.

5. Does Space remain activity owner?  
Yes.

6. Does Connect remain projection-only?  
Yes.

7. Are RF/Rielt/Quest still deferred?  
Yes.

8. Does Activity avoid economy/progression semantics?  
Yes.

9. What remains deferred after G?  
Notifications/read state, cross-module activity rollout, universal graph, economy activity, stronger source validation.

10. Is the Interaction Spine now coherent enough for broader stabilization?  
Yes, for bounded pilot readiness; broader rollout still requires explicit follow-up slices.
