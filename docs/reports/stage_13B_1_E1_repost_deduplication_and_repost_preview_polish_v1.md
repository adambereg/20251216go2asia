# Stage 13B.1-E1 - Repost Deduplication & Repost Preview Polish

Status: `COMPLETE_WITH_PARTIAL_PREVIEW_HYDRATION`

Mode: `BOUNDED_PROPAGATION_POLISH_REPOST_UX_STABILIZATION`

Lead: AI Program Director / Orchestrator

Supporting agents: Runtime Governance Architect, Software Architect, Frontend Developer, Backend/API Analyst, Interaction Systems Analyst, QA Agent, Technical Canon Writer, Delivery Planner.

## 1. Executive summary

Stage 13B.1-E1 closes two deferred gaps from E/F within bounded pilot scope:

- duplicate repost creation is now blocked in Space runtime for `place`, `event`, `blog_post`, and `space_post` reposts by the same author for the same target;
- repost cards now show source-oriented preview data (title, excerpt, optional image, clearer CTA) for pilot target types in feed/publication surfaces using lightweight hydration.

No feed redesign, no social graph rollout, no Reactions ownership shift, no economy hooks, no RF/Rielt/Quest propagation expansion were introduced.

## 2. Scope and boundaries

In scope:

- dedupe guard for object-bound repost create in Space service (`POST /v1/space/posts`, `POST /v1/space/posts/{postId}/repost`);
- repost preview/readability polish for pilot target types (`place`, `event`, `blog_post`) in PWA feed cards;
- optional reposted state in `ContentActionRow` (read helper + UX state).

Out of scope:

- comments/discuss, notifications, ranking, recommendations, full feed redesign;
- universal repost rollout for all modules;
- RF/Rielt/Quest propagation wiring;
- economy/reward/Points producer hooks;
- Connect writes;
- A1 taxonomy reopening.

## 3. User-observed repost issues

Observed before E1:

1. repeated share action on the same source object could create multiple repost rows;
2. repost cards often rendered generic copy with weak source identity.

Impact:

- feed noise inflation;
- reduced recognizability of source objects;
- weaker propagation quality before Activity expansion.

## 4. Duplicate repost analysis

Pre-E1 runtime behavior:

- `createPost` inserted repost rows without dedupe for same `(authorId, repostTargetType, repostTargetId)`;
- repeated clicks could create multiple active reposts;
- convenience repost endpoint delegated to the same create path, so duplication also applied there.

E1 decision:

- apply bounded dedupe guard in Space create path for target types `space_post`, `place`, `event`, `blog_post`;
- return `409` with `REPOST_ALREADY_EXISTS` and `existingPostId` when active duplicate exists;
- keep behavior unchanged for deferred target types (`partner`, `listing`, `quest`).

## 5. Chosen dedupe strategy

Chosen strategy: **Hybrid (Option C-like bounded)**:

- **Server guard (primary):** blocks duplicate repost create in Space service for pilot types and `space_post`;
- **Client guard (secondary):** `ContentActionRow` reads existing repost state from profile feed, shows “Уже в Space”, and handles `409` conflict as non-fatal “already shared” UX with open-feed CTA.

Intentional limits:

- current dedupe is application-level guard (no new DB unique constraint in this slice);
- protects accidental duplicate spam in normal user flows;
- race-hardening via DB constraint remains available for a future hardening slice if needed.

## 6. Repost preview analysis

Pre-E1 preview problem:

- Space runtime returned `resolvedPreview: null`;
- feed card fallback text was generic and repetitive;
- source identity (title/excerpt/image) was frequently absent.

E1 approach:

- keep ownership unchanged (Space owns repost row; source modules own source truth);
- add lightweight client-side pilot preview hydration when `resolvedPreview` is null.

## 7. Preview hydration strategy

Hydration mapping implemented in PWA runtime helper:

- `place` -> `getPlaceByIdOrSlug(targetId)` -> title/description/location/image/href;
- `event` -> `getEventById(targetId)` -> title/shortDescription/location/image/href;
- `blog_post` -> `getBlogPostBySlug(strip blog_)` -> title/excerpt/subtitle/image/href.

Behavior:

- if server already provides `resolvedPreview.title`, it is used directly;
- if not and target is pilot type, lightweight client hydration resolves preview;
- if hydration fails, card shows explicit degraded state text instead of generic repetitive copy.

## 8. Feed/readability polish

Implemented readability improvements:

- clearer repost chip remains (`Репост · ...`) with enriched source block;
- preview card shows source title and optional teaser;
- optional thumbnail shown when available;
- CTA text is target-specific (`Открыть место`, `Открыть событие`, `Открыть статью`, etc.);
- generic fallback copy reduced and made explicit for degraded states.

## 9. Runtime implementation

Backend:

- `apps/space-service/src/db/queries/space.ts`
  - added `findActiveRepostByAuthorAndTarget(...)`.
- `apps/space-service/src/services/spaceService.ts`
  - added bounded dedupe target set (`space_post`, `place`, `event`, `blog_post`);
  - added duplicate guard before insert for repost creates;
  - returns `409` payload with `error.code = REPOST_ALREADY_EXISTS` and `existingPostId`.
- `apps/space-service/test/request.test.ts`
  - added tests for duplicate conflict on create route and convenience repost route.
- `docs/openapi/space.yaml`
  - documented `409` conflict for repost create paths and `SpaceRepostAlreadyExistsResponse`.

Frontend:

- `apps/go2asia-pwa-shell/components/interaction/ContentActionRow.tsx`
  - added repost state lookup from profile feed;
  - share button now shows reposted state (`Уже в Space`);
  - handles `409/REPOST_ALREADY_EXISTS` as informative state (not hard failure).
- `apps/go2asia-pwa-shell/components/space/runtime/repostPreview.ts` (new)
  - shared pilot preview hydration + CTA label mapping.
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`
  - added lightweight preview hydration and enriched repost preview block.
- `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPublicationCard.tsx`
  - reduced generic repost excerpt and reused preview hydration/CTA improvements.

## 10. Pilot targetTypes

E1 active pilot repost scope:

- `place`;
- `event`;
- `blog_post`.

Also covered in dedupe matrix for Space-native repost path:

- `space_post`.

## 11. Deferred/quarantined surfaces

Still deferred:

- RF/Rielt/Quest propagation rollout;
- comments/discuss;
- notifications;
- activity hub redesign;
- economy hooks;
- universal repost rollout and social graph expansion;
- full server-side universal `resolvedPreview` framework.

## 12. Runtime evidence

API/runtime evidence:

- duplicate guard:
  - `POST /v1/space/posts` returns `409 REPOST_ALREADY_EXISTS` for active duplicate tuples;
  - `POST /v1/space/posts/{postId}/repost` returns same bounded conflict behavior;
  - conflict payload includes `existingPostId`.
- preview/readability:
  - runtime cards hydrate pilot source previews through source owner APIs when server preview is null.

Focused verification:

- `pnpm -C apps/space-service test` -> pass, 25 tests.
- `pnpm -C apps/space-service typecheck` -> pass.
- `pnpm -C apps/go2asia-pwa-shell typecheck` -> pass.
- `pnpm -C apps/go2asia-pwa-shell lint` -> pass (warnings only, no errors).
- `ReadLints` on edited files -> no linter errors.

Negative evidence:

- no new `ContentActionRow` / `/v1/reactions` / `/v1/space/posts` repost wiring in:
  - `components/rf/**`
  - `components/rielt/**`
  - `components/quest/**`
  - `components/connect/**`
- Points producer allowlist remains:
  - `space_repost_created: FUTURE_ONLY`
  - `space_reaction_created: FUTURE_ONLY`

Screenshots:

- not collected in this implementation pass; evidence is code + runtime tests + lint/typecheck outputs.

## 13. Risks and limitations

| Risk | Severity | Status | Notes |
| --- | --- | --- | --- |
| Dedupe is app-level (no DB unique index yet) | medium | accepted | Prevents accidental duplicates; race-hardening can be added later. |
| Server `resolvedPreview` remains nullable baseline | medium | accepted | E1 uses lightweight client hydration for pilot types. |
| Profile-feed repost state helper is limit-sliced | low/medium | accepted | UX helper only; server guard remains source of truth. |
| Deferred target types remain weak preview/dedupe behavior | medium | accepted | Kept out of scope by bounded pilot rules. |

## 14. Review gate results

| Review gate | Result | Notes |
| --- | --- | --- |
| Runtime Governance Review | Pass | Dedupe and preview stay within Space-owned propagation boundaries. |
| Architecture Review | Pass | Reactions/Space/Connect ownership remains intact. |
| Frontend UX Review | Pass | Repost cards became more recognizable; duplicate clicks are safely handled. |
| Canon Review | Pass | No bookmark/propagation collapse; no A1 reopening. |
| QA Review | Pass | Focused tests/typecheck/lint and negative scans completed. |
| Propagation Review | Pass | Repost create remains Space-owned with bounded dedupe policy. |
| Boundary Review | Pass | RF/Rielt/Quest/comments/notifications/economy remain deferred. |
| Lightweight Economy Boundary Review | Pass | No new reward producers or economy coupling added. |

## 15. Acceptance criteria status

| Criterion | Status |
| --- | --- |
| Duplicate repost spam prevented or safely gated | met |
| Repost cards show meaningful source previews | met (pilot types, lightweight hydration) |
| Feed readability improved for pilot reposts | met |
| Repost remains Space-owned | met |
| Bookmark remains separate from propagation | met |
| RF/Rielt/Quest remain deferred | met |
| No economy/reward hooks introduced | met |
| No A1 taxonomy reopening | met |
| No propagation collapse | met |
| Final status tokens included | met |

## 16. Recommended next slice

Recommended next slice:

`Stage 13B.1-G - Space Activity Tab Upgrade`

Why:

- repost semantics are now cleaner (bounded dedupe);
- source identity in feed reposts is more readable;
- Activity expansion can now build on less noisy propagation baseline.

## 17. Final status tokens

stage_13B_1_E1_status: COMPLETE_WITH_PARTIAL_PREVIEW_HYDRATION

stage_13B_1_E1_next_slice: Stage_13B_1_G_Space_Activity_Tab_Upgrade

stage_13B_1_E1_implementation_drift: false

stage_13B_1_E1_public_launch_implied: false

stage_13B_1_E1_does_not_reopen_A1_taxonomy: true

stage_13B_1_E1_reactions_role: LIKE_AND_BOOKMARK_FACT_OWNER_ONLY

stage_13B_1_E1_space_role: PROPAGATION_OWNER_REPOST_CREATE_DEDUPE_AND_FEED_PROJECTION

stage_13B_1_E1_connect_role: PROJECTION_ONLY_NO_OWNER_WRITES

stage_13B_1_E1_dedupe_policy: ONE_ACTIVE_REPOST_PER_AUTHOR_TARGET_FOR_SPACE_POST_PLACE_EVENT_BLOG_POST

stage_13B_1_E1_preview_status: PILOT_CLIENT_SIDE_PREVIEW_HYDRATION_FOR_PLACE_EVENT_BLOG_POST_WITH_DEGRADED_FALLBACK

## Matrix 1 - Repost Dedupe Matrix

| targetType | Duplicate prevention | Runtime-backed? | UX behavior | Notes |
| --- | --- | --- | --- | --- |
| `place` | server `409 REPOST_ALREADY_EXISTS` + client guard | yes | button shows `Уже в Space`, info CTA to feed | bounded pilot |
| `event` | server `409 REPOST_ALREADY_EXISTS` + client guard | yes | same as above | bounded pilot |
| `blog_post` | server `409 REPOST_ALREADY_EXISTS` + client guard | yes | same as above | bounded pilot |
| `space_post` repost | server `409 REPOST_ALREADY_EXISTS` on convenience path | yes | duplicate convenience repost blocked | keeps Space-post repost clean |

## Matrix 2 - Repost Preview Matrix

| targetType | Title | Excerpt | Image | Metadata | Status |
| --- | --- | --- | --- | --- | --- |
| `place` | yes (hydrated) | yes (description/location) | optional (`heroImage/photos`) | label + CTA | implemented |
| `event` | yes (hydrated) | yes (shortDescription/location) | optional (`heroMediaKey`) | label + CTA | implemented |
| `blog_post` | yes (hydrated) | yes (excerpt/subtitle) | optional (`heroUrl`) | label + CTA | implemented |
| `space_post` | existing reference behavior | limited | n/a in pilot hydration | label + CTA | unchanged/bounded |

## Matrix 3 - Feed Readability Matrix

| Feed element | Before | After | Notes |
| --- | --- | --- | --- |
| repost label | generic chip only | chip preserved + richer content block | bounded polish |
| source title | often absent (preview null) | shown via server preview or pilot hydration | pilot target types |
| source teaser | generic fallback sentence | source excerpt/subtitle where available | reduced repetitive copy |
| CTA | mostly `Открыть материал` | target-specific CTA (`место/событие/статья`) | clearer intent |
| repeated generic copy | frequent | replaced by typed or degraded-state text | no full redesign |

## Matrix 4 - Runtime Ownership Matrix

| Capability | Owner | API/runtime | Notes |
| --- | --- | --- | --- |
| repost create | Space | `POST /v1/space/posts`, `/v1/space/posts/{postId}/repost` | unchanged owner |
| repost dedupe | Space | create-time duplicate guard + `409` | bounded to pilot + `space_post` |
| preview hydration | Space projection surface + source owner reads | PWA lightweight hydration helper | no source ownership transfer |
| bookmark | Reactions | `/v1/reactions` | retention only |
| like | Reactions | summary/write/delete | interaction fact only |
| Connect projection | Connect | read projection | no writes introduced |

## Matrix 5 - Deferred / Quarantine Matrix

| Surface | Deferred? | Why | Future slice |
| --- | --- | --- | --- |
| RF/Rielt/Quest rollout | yes | outside pilot propagation scope | target-specific contracts |
| comments/discuss | yes | separate social primitive | discussion contract |
| notifications | yes | separate projection layer | notification contract |
| activity hub redesign | yes | E1 is feed/repost stabilization only | Stage 13B.1-G |
| economy hooks | yes | propagation is not reward signal | economy contract only if approved |
| universal repost rollout | yes | bounded pilot only | post-G hardening |

## Matrix 6 - Allowed vs Forbidden Expansion

| Capability | Allowed in E1 | Forbidden in E1 | Why |
| --- | --- | --- | --- |
| dedupe policy | pilot repost dedupe in Space | universal repost policy across all modules | bounded stabilization |
| preview polish | pilot repost preview hydration | universal preview framework for all objects | keep scope narrow |
| feed UX | targeted readability improvements | full feed redesign/ranking/recs | non-goal |
| action row state | bounded reposted indicator | broad social graph UX rollout | optional bounded helper only |
| ownership model | preserve Space propagation owner | collapse into Reactions/bookmark | canon D/C freeze |

## Matrix 7 - Known Remaining Gaps

| Gap | Severity | Deferred? | Future slice |
| --- | --- | --- | --- |
| universal repost rollout | medium | yes | post-G propagation expansion |
| full activity hub upgrade | medium | yes | Stage 13B.1-G |
| source validation in Space create | medium | yes | propagation hardening |
| server-side `resolvedPreview` completeness | medium | yes | preview hardening slice |
| cross-module social graph | high | yes | separate social graph program |

## Required decisions

1. How are duplicate reposts prevented?  
Server duplicate guard in Space (`409 REPOST_ALREADY_EXISTS`) plus client reposted-state UX helper.

2. Can user repost same object twice intentionally?  
Not in active bounded scope for `space_post/place/event/blog_post`; duplicate create is blocked.

3. Does repost button show reposted state?  
Yes, `ContentActionRow` shows `Уже в Space` when an existing repost is detected or conflict is returned.

4. Do repost cards now show meaningful source previews?  
Yes for pilot target types via lightweight hydration (title/excerpt/optional image/typed CTA).

5. Does Space still remain propagation owner?  
Yes.

6. Does bookmark remain separate?  
Yes, bookmark remains Reactions retention fact and is not propagation.

7. Are RF/Rielt/Quest still deferred?  
Yes.

8. Are feed changes still bounded?  
Yes, readability polish only; no redesign.

9. What remains unresolved after E1?  
Universal rollout, full Activity upgrade, server-side complete preview framework, stronger source validation.

10. Is Activity upgrade now cleaner/safer after repost polish?  
Yes, dedupe and clearer repost identity reduce noise before Stage 13B.1-G.
