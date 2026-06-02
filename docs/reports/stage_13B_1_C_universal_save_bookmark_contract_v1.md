# Stage 13B.1-C - Universal Save / Bookmark Contract

Status: `COMPLETE_AS_UNIVERSAL_SAVE_BOOKMARK_CONTRACT`

Mode: `READ_ONLY_UNIVERSAL_SAVE_BOOKMARK_CONTRACT`

Lead: AI Program Director / Orchestrator

Supporting agents: Runtime Governance Architect, Software Architect, Interaction Systems Analyst, Backend/API Analyst, Frontend Developer, QA Agent, Technical Canon Writer, Delivery Planner.

## 1. Executive Summary

Stage 13B.1-C defines what "Save" canonically means in Go2Asia before any cross-module save rollout.

Core contract:

- Save is an owner-qualified retention intent.
- Runtime-backed bookmark is a Reactions Service fact: `reactionType: bookmark`.
- Current runtime bookmark remains `space_post` only.
- Universal bookmark through Reactions Service is the preferred future direction, but only through explicit targetType policy and downstream implementation gates.
- Save does not imply socialization, propagation, contribution, reward, Connect activity or Points.
- `/space/saved` should evolve into a universal saved-items hub, but it is currently a Space-post saved surface and remains an implementation topic for a later slice.
- Local-only saves may coexist permanently if they remain owner-qualified and quarantined.

This report does not implement code, migrations, OpenAPI changes, UI buttons, universal bookmark rollout, Space redesign, propagation, Connect redesign, economy integration or reward hooks.

## 2. Scope and Boundaries

In scope:

- canonical meaning of Save;
- bookmark ownership;
- runtime-backed vs local-only vs UI-only vs deferred save classification;
- targetType bookmark eligibility;
- future saved-item ownership and hydration model;
- `/space/saved` evolution framework;
- local-only coexistence and quarantine rules.

Out of scope:

- implementation;
- migrations;
- PWA save button rollout;
- universal saved hub implementation;
- repost/share-to-Space;
- comments/discuss;
- feed redesign;
- Connect/economy integration;
- reward hooks;
- object -> Space create path.

Frozen rules carried forward:

1. `repost display != repost create`.
2. `native share != share-to-Space`.
3. `local save != runtime-backed save`.
4. `lifecycle != socialization`.
5. `inquiry != Space discussion`.
6. `Connect projection != owner-fact`.
7. `Space read != universal propagation`.
8. `bookmark != universal object retention yet` until this contract defines the future policy.
9. `Quest proof/review != social review`.
10. `RF favorite != like`.
11. `navigation/deeplink != propagation`.
12. Save semantics must remain owner-qualified.
13. Reactions Service owns bookmark facts only within explicit policy.
14. Space Saved is not a universal saved-items hub yet.
15. Bookmark is not a reward/economy signal.

Runtime reality tags used: `match`, `partial`, `local-only`, `deferred`, `conceptual`, `future-only`, `drift`, `unsafe`, `pending_contract`, `blocked_by_boundary`.

## 3. A/B/A0/F/G Findings Carried Forward

From Stage 13B.1-B:

- `like` is stable enough as a bounded backend fact primitive.
- `bookmark` remains `space_post` only.
- universal bookmark was blocked until Stage 13B.1-C.
- summary endpoints are like-only.
- event publisher is noop/deferred.
- Reactions remains fact owner; Space remains propagation owner; Connect remains projection-only.

From Stage 13B.1-A:

- Reactions Service owns reaction facts, current `space_post` bookmark, identity and idempotency.
- Bookmark/save can become universal only after explicit contract approval.
- Space owns repost/share-to-Space/feed/activity.
- Content modules do not own global reaction facts or global save state.
- Local-only/decorative actions must be quarantined.

From Stage 13B.1-A0:

- Reactions Service is real and runtime-backed.
- The only proven active PWA save write is `targetType: space_post`, `reactionType: bookmark`.
- Save semantics are fragmented across backend bookmark, localStorage, local state, UI-only and deferred actions.
- Reactions is not a propagation foundation.

From Stage 13B.0-F/G:

- Retention is one of the weakest ecosystem layers.
- Fragmented save/bookmark semantics are P1 for 13B.1 stabilization.
- Object -> Space create remains P0 and separate from save/bookmark.
- Space is a partial read/save sink, not a universal propagation engine.

From Stage 13B.0-A1:

- Save/bookmark must be owner-qualified.
- Heart/bookmark icons alone do not prove runtime save.
- Native share, local save, repost display, inquiry/contact and review displays must not be promoted into Interaction Spine primitives.

## 4. Canonical Definition of Save

Canonical Save:

`Save` means an owner-qualified retention intent: the user wants to keep a reference to an object for later return.

Canonical runtime-backed bookmark:

- owner: Reactions Service;
- primitive: `reactionType: bookmark`;
- identity: `(actorUserId, targetType, targetId, reactionType)`;
- persistence: `reactions` table;
- create/delete path: `/v1/reactions`;
- list-my path: `/v1/reactions/mine`;
- current support: `targetType: space_post` only.

Save is not:

- `like`;
- repost;
- share-to-Space;
- native share;
- RF favorite;
- RF planning voucher;
- organizer trip item;
- Pulse register;
- Rielt inquiry;
- Quest proof/review;
- Connect projection;
- reward/progression signal.

Evidence:

- Runtime rejects bookmark writes unless `targetType === 'space_post'`: `apps/reactions-service/src/services/reactionsService.ts`.
- Runtime `/mine` accepts only `targetType=space_post&reactionType=bookmark`: `apps/reactions-service/src/services/reactionsService.ts`.
- OpenAPI `/mine` is scoped to `space_post` + `bookmark`: `docs/openapi/reactions.yaml`.
- Space PWA uses `/v1/reactions` for `space_post` bookmark: `apps/go2asia-pwa-shell/components/space/runtime/useSpaceSavedReactions.ts`.

## 5. Matrix 1 - Save Semantics Taxonomy

| Save type | Owner | Persistence | Runtime-backed? | Canonical meaning | Notes |
| --- | --- | --- | --- | --- | --- |
| Space bookmark | Reactions Service | `reactions` row | yes | Durable account-scoped retention of a Space post. | Current active runtime path: `/v1/reactions`, `space_post`, `bookmark`. |
| RF favorite | RF/PWA local | `localStorage` | no | Local planning/favorite utility. | `RF_FAVORITES_STORAGE_KEY`; RF favorite is not `like` or bookmark. |
| RF planning vouchers | RF/PWA local | `localStorage` | no | Local planning list for voucher interest. | `note: 'local_planning_only'`; not server claim/redeem. |
| Rielt local save | Rielt/PWA component | component state | no | Local UI retention cue in current session. | Button label says `Сохранить (локально)`. |
| Pulse local save | Pulse/PWA component | component state + TODO | no | Local/TODO event save placeholder. | Register remains lifecycle, not save/socialization. |
| Blog decorative save | none | none | no | Decorative action-row affordance. | Button has no runtime handler. |
| Guru unwired save | none / pending owner | none | no | Unwired card affordance. | `ObjectCard` accepts save handler, but `GuruClient` does not pass one. |
| Quest deferred save | none / pending contract | none | no | Deferred retention placeholder. | `Сохранение - позже`; disabled/deferred. |

Taxonomy decision: only Space bookmark is runtime-backed today. All other save-like surfaces must remain owner-qualified and must not be counted as universal save.

## 6. Bookmark Ownership Model

Reactions Service owns:

- bookmark facts;
- bookmark identity and idempotency;
- user-scoped list of bookmark facts;
- delete of bookmark facts.

Reactions Service does not own:

- source object truth;
- object previews;
- Space posts/reposts;
- organizer trip items;
- Connect activity;
- rewards or Points;
- localStorage state.

Content/source modules own their source objects and hydration data. Space owns `/space/saved` as the current projection surface and future universal saved hub candidate, not as the owner of bookmark facts. Connect owns no save facts.

Bookmark lifecycle decision:

- current hard-delete runtime drift from B remains accepted as runtime reality, not solved in C;
- bookmark creates no aggregate count by design;
- bookmark must not be inferred from `ReactionSummaryItem`, because summary contains only `counts.like` and `viewer.liked`.

## 7. Runtime-backed vs Local-only Classification

Runtime-backed save requires all of:

1. authenticated user action;
2. server persistence;
3. explicit owner service;
4. durable cross-session/account semantics;
5. read or list path;
6. targetType/reactionType policy.

By that standard:

- Space post bookmark is runtime-backed.
- RF favorites and RF planning vouchers are local-only.
- Rielt and Pulse saves are local-only component state.
- Blog save is UI-only/decorative.
- Guru save is UI-only/unwired.
- Quest save is deferred.
- Organizer bridge is adjacent utility, not bookmark.

## 8. Matrix 2 - targetType Bookmark Eligibility

| targetType | Current support | Eligible for universal bookmark? | Risk | Decision |
| --- | --- | --- | --- | --- |
| `space_post` | runtime-backed now | yes | low | `allowed_now`; current baseline. |
| `blog_post` | enum exists; runtime bookmark rejected today | yes, after contract-gated rollout | high if decorative Blog UI is overclaimed | `eligible_future_t1`; needs Blog action-row cleanup/pilot. |
| `place` | enum exists; runtime bookmark rejected today | yes, after contract-gated rollout | medium if Atlas city/country/guide are collapsed into place | `eligible_future_t1`; strongest Atlas retention anchor. |
| `event` | enum exists; runtime bookmark rejected today | yes, after contract-gated rollout | medium if register is confused with save | `eligible_future_t1`; Pulse register remains lifecycle. |
| `partner` | enum exists; runtime bookmark rejected today | conditional | high if RF favorite is silently mapped | `eligible_future_t2`; RF favorite remains separate local utility. |
| `listing` | enum exists; runtime bookmark rejected today | conditional | medium if Rielt inquiry is confused with save/discuss | `eligible_future_t2`; may remain local unless module contract expands. |
| `quest` | enum exists; runtime bookmark rejected today | conditional/deferred | high if Quest proof/review is confused with save/social review | `eligible_future_t2`; Quest save can remain deferred. |

Blocked/pending product nouns:

- Atlas city: `pending_contract`; no current exact targetType.
- Atlas country: `pending_contract`; no current exact targetType.
- Atlas guide/article: `pending_contract`; do not collapse into `blog_post` without contract.
- RF offer: `pending_contract`; do not silently alias to `partner`.

Eligibility decision: universal bookmark is the preferred future direction through Reactions Service for the existing enum targetTypes, but rollout must be phased and owner-qualified. C approves the policy direction, not runtime expansion.

## 9. Saved-items Ownership Framework

Canonical saved item has two layers:

1. Fact layer: Reactions bookmark fact with `targetType` and `targetId`.
2. Display layer: hydrated object preview from the source owner or Space resolver.

Saved-item invariants:

- Reactions stores references, not source object truth.
- Every saved-item display must retain `targetType`, `targetId` and owner attribution.
- Missing source object must be shown as unavailable/deferred or filtered by explicit policy; it must not imply Connect/economy activity.
- Organizer trip items are separate utility entities and do not mutate bookmark facts.
- `/mine` is a bookmark fact list, not a generic activity feed.

Evidence:

- Current saved page first reads `SAVED_POSTS_MINE_URL`, then hydrates each `space_post` via `/v1/space/posts/{targetId}` in `SavedPostsPageClient.tsx`.
- Current organizer bridge creates a trip item with `source: { module: 'space', entityType: 'space_post', entityId }` and explicitly says the post remains saved.

## 10. Matrix 3 - Universal Bookmark Policy Options

| Policy model | Pros | Cons | Boundary safety | Recommended? |
| --- | --- | --- | --- | --- |
| Space-only bookmark forever | Lowest runtime risk; matches current `/mine`. | Leaves retention fragmented across content, RF, Rielt, Pulse, Blog and Guru. | safe but strategically weak | no |
| Universal bookmark via Reactions | Uses existing fact substrate, targetType enum, user-scoped identity and idempotency. | Requires target policy, OpenAPI/runtime alignment, hydration rules and local-only quarantine. | safe if owner-qualified | yes |
| Save only through Space object references | Aligns retention with future Space social objects. | Collapses retention into propagation and blocks save without Space create. | unsafe for C; violates save != propagation | no |
| Mixed hybrid model | Allows Reactions bookmark for eligible objects while RF/Rielt/local utilities remain separate. | Requires clear UI labels and migration discipline. | safest practical model | yes, as rollout model |

Recommendation: adopt Universal Bookmark via Reactions as the canonical future direction, using a mixed coexistence model for local-only utilities. Do not require Space propagation before save.

## 11. Universal Bookmark Recommendation

Approved future policy:

- Reactions Service remains the bookmark fact owner.
- Universal bookmark may exist without propagation.
- Bookmark is retention only and does not create Space posts, reposts or activity items by itself.
- `/space/saved` may evolve into a universal saved-items hub after C, but implementation belongs to a later slice.
- T1 expansion candidates are `place`, `event`, `blog_post`.
- T2 conditional candidates are `partner`, `listing`, `quest`.
- Product nouns outside current enum remain `pending_contract`.

Current runtime remains:

- non-`space_post` bookmark writes rejected;
- `/mine` scoped to `space_post` + `bookmark`;
- summary like-only;
- no universal saved hub.

## 12. Matrix 4 - Saved Hub Ownership Matrix

| Saved surface | Owner | What it may display | What it must not imply | Notes |
| --- | --- | --- | --- | --- |
| `/space/saved` | Space/PWA projection surface over Reactions facts | Saved Space posts now; future saved objects after C/F gates | Universal hub exists today; Space owns bookmark facts | Current runtime hydrates Space posts after `/mine`. |
| Future universal saved hub | Projection surface using Reactions facts + source hydrators | Mixed saved objects grouped/filtered by targetType | Connect ownership, economy signals, propagation | Requires implementation slice after C. |
| Organizer bridge | Organizer/Space utility | Trip items created from saved objects | Bookmark ownership or universal save proof | Current bridge is adjacent utility and leaves bookmark unchanged. |
| Connect projection | Connect read surface only | Navigation/projection only if future owner facts project safely | Saved owner, activity authority, reward authority | Connect must remain projection-only. |
| Local-only saves | Module/PWA local state | Local favorites/planning labels inside owning module | Account-synced runtime save | Must remain owner-qualified. |

## 13. Space Saved Evolution Framework

Current `/space/saved`:

- reads saved Space post bookmarks;
- hydrates Space posts separately;
- supports remove bookmark;
- bridges saved posts to Organizer trip items;
- is not a universal saved-items hub.

Future `/space/saved` may evolve into universal saved-items hub if:

- C targetType policy is accepted;
- `/mine` semantics are expanded or an explicit saved-list read model is created;
- each targetType has a hydration/resolver owner;
- local-only/decorative save states are quarantined;
- Connect/economy are explicitly excluded.

Hub display should group or filter by targetType and preserve owner attribution. It must not imply saved objects are Space posts unless they are actually `space_post`.

## 14. Matrix 5 - Local-only Coexistence Matrix

| Local-only save | Why it exists | Keep local? | Future migration path | Notes |
| --- | --- | --- | --- | --- |
| RF favorites | Partner/offer planning utility in RF local state. | yes by default | explicit RF migration contract only | Must not map to `like` or bookmark silently. |
| RF planning vouchers | Local voucher planning without server claim/redeem. | yes | separate lifecycle contract, not bookmark migration by default | `local_planning_only`. |
| Rielt local save | Lightweight local listing retention; housing boundary preserved. | yes possible | optional listing bookmark pilot after C and module gate | Inquiry remains separate. |
| Pulse save | Legacy/TODO local event save. | temporarily | replace/quarantine in action-row pilot if `event` bookmark approved | Register remains lifecycle. |
| Guru save | Unwired card callback. | no as maturity evidence | define owner or remove/quarantine later | Guru remains aggregation/deeplink layer. |
| Quest deferred save | Disabled retention placeholder. | yes while disabled | future Quest retention contract only | Proof/review is not social review or save. |

Coexistence decision: local-only saves may coexist permanently when their local nature is explicit. They must not be silently upgraded to bookmark and must not inflate retention maturity.

## 15. Local-only Coexistence Framework

Rules:

1. Every save-like surface must declare owner and persistence class.
2. Local-only saves are non-portable and must not imply account-synced retention.
3. RF favorite and planning vouchers remain separate utilities unless a later RF migration contract exists.
4. A module may keep local-only save if product semantics require it, but it cannot be scored as runtime-backed save.
5. If runtime bookmark and local save coexist on one surface, UI must distinguish lanes.
6. No silent localStorage import into Reactions bookmark without explicit owner map, user semantics and dedup policy.
7. Decorative/unwired save buttons must be quarantined before maturity claims.

## 16. Matrix 6 - Save vs Other Primitives

| Primitive | Owner | Retention? | Socialization? | Propagation? | Notes |
| --- | --- | --- | --- | --- | --- |
| save/bookmark | Reactions Service within explicit policy | yes | no | no | Private/user-scoped retention fact. |
| like | Reactions Service | no | limited engagement signal | no | Like has summary/aggregate; it is not save or reward. |
| repost | Space Service | no | yes | yes | Space-owned create/read path; not a Reactions primitive. |
| share-to-Space | Space Service | no | yes | yes | Native share is not share-to-Space. |
| follow | Space/social owner if/when scoped | no | graph/social relation | no object propagation by itself | Not a bookmark reactionType. |
| organizer bridge | Organizer/Space utility | adjacent planning utility | no | no | Creates trip item, not bookmark fact. |
| RF planning | RF/PWA local | local planning only | no | no | Not server save; not voucher settlement. |
| Quest proof | Quest lifecycle owner | no | no | no | Lifecycle/proof, not review/reaction/save. |

Decision: save can exist without Space propagation. Save must not be used as a substitute for repost/share-to-Space or object -> Space create.

## 17. Universal Bookmark Policy Options - Decision Record

| Question | Answer | Status |
| --- | --- | --- |
| Is universal bookmark the preferred future direction? | Yes, through Reactions Service and explicit targetType policy. | `preferred_future` |
| Should bookmark remain Reactions-owned? | Yes. Reactions owns bookmark facts; source modules hydrate objects; Space can project saved items. | `owner_fixed` |
| Should `/space/saved` evolve into universal saved-items hub? | Yes as future direction, after C and implementation gates. | `future_hub` |
| Should RF favorites remain separate local utility? | Yes. RF favorite remains local-only unless later migration contract says otherwise. | `separate_local_only` |
| Should local-only saves remain owner-qualified forever? | Yes. Even if some migrate later, owner-qualified labels remain mandatory. | `owner_qualified_required` |
| Should save imply socialization? | No. | `forbidden` |
| Should save imply propagation? | No. | `forbidden` |
| Should save imply contribution/reward? | No. | `forbidden` |
| Can save exist without Space? | Yes. Bookmark is a Reactions retention fact; Space is not required for the fact, only for current saved surface and future hub projection. | `allowed` |
| Which save surfaces are safe to stabilize later? | `space_post` baseline, then `place`, `event`, `blog_post`; later `partner`, `listing`, `quest` with module gates. | `phased` |
| Which save surfaces must remain quarantined? | RF favorites/planning, Rielt local save until opted in, Pulse legacy save until pilot, Blog decorative save, Guru unwired save, Quest deferred save. | `quarantined` |

## 18. Matrix 7 - Allowed vs Forbidden Save Expansion

| Capability | Allowed in C | Forbidden in C | Why |
| --- | --- | --- | --- |
| defining bookmark policy | yes | implementation of policy | C is contract-only. |
| universal save semantics | yes | claiming universal save exists today | Runtime remains `space_post` only. |
| save taxonomy | yes | reopening A1 taxonomy | C applies A1; it does not replace it. |
| bookmark rollout | no | yes | Rollout requires later implementation slice. |
| UI buttons | no | yes | Action-row pilot belongs to later slice. |
| object propagation | no | yes | Propagation is Space-owned and separate. |
| repost/share-to-Space | no | yes | Not a save/bookmark primitive. |
| Connect save ownership | no | yes | Connect is projection-only. |
| reward hooks | no | yes | Bookmark is not economy signal. |

## 19. Allowed vs Forbidden Interpretations

Allowed:

- Save is owner-qualified retention intent.
- Current runtime-backed save is `space_post` bookmark.
- Universal bookmark via Reactions is preferred future policy.
- `/space/saved` may become a universal saved-items hub later.
- Local-only saves may continue if explicitly labeled.
- Organizer bridge may use saved objects as input while remaining separate.

Forbidden:

- treating current `space_post` bookmark as universal save;
- treating RF favorite as bookmark or like;
- treating Blog/Guru visible buttons as runtime-backed save;
- treating Pulse register, Rielt inquiry or Quest proof as save/socialization;
- treating save as repost, share-to-Space, activity or propagation;
- treating save as Points, VIP, badge, reward or Connect owner-fact;
- silent local-only migration to server bookmark;
- adding `repost`, `share_to_space`, `favorite`, `follow`, `comment` or `review` as Reactions reactionTypes in this contract.

## 20. Risk Map

| Risk | Severity | Runtime reality tag | C containment |
| --- | --- | --- | --- |
| Space bookmark inflated into universal save | high | partial | Explicitly marks current runtime `space_post` only. |
| Local-only saves counted as runtime retention | high | local-only | Owner-qualified taxonomy and quarantine. |
| RF favorite collapsed into bookmark/like | high | local-only | RF remains separate utility. |
| Save collapsed into propagation | critical | unsafe if violated | Save != repost/share-to-Space/object create. |
| Save collapsed into economy/Connect | critical | unsafe if violated | Connect projection-only; bookmark not reward. |
| `/space/saved` treated as universal hub today | high | partial | Hub evolution deferred to later slice. |
| Product nouns outside enum silently mapped | medium/high | pending_contract | City/country/guide/RF offer blocked. |
| Bookmark summary inferred from like summary | medium | drift risk | Summary is like-only by contract. |
| Hard-delete lifecycle reopened in C | medium | drift | Left to B/future lifecycle stabilization, not C. |

## 21. Review Gate Results

| Review gate | Result | Notes |
| --- | --- | --- |
| Runtime Governance Review | Pass | Runtime truth is preserved: bookmark is currently `space_post` only. |
| Architecture Review | Pass | Reactions owns facts; Space projects saved hub; source modules hydrate; Connect excluded. |
| Canon Review | Pass | A1 taxonomy and A/B boundaries are applied, not reopened. |
| QA Review | Pass | Seven required matrices, explicit decisions and status tokens are present. |
| Retention/Saved Review | Pass | Save taxonomy, saved-item ownership and Space Saved evolution are defined. |
| Boundary Review | Pass | No propagation/economy/Connect collapse. |
| Lightweight Economy Boundary Review | Pass | Bookmark does not create reward, Points, badge, VIP or Connect owner-fact. |

## 22. Acceptance Criteria Status

| Criterion | Status |
| --- | --- |
| Save taxonomy matrix exists | met |
| targetType eligibility matrix exists | met |
| Universal bookmark policy matrix exists | met |
| Saved hub ownership matrix exists | met |
| Local-only coexistence matrix exists | met |
| Save-vs-primitives matrix exists | met |
| Allowed/forbidden matrix exists | met |
| Required decisions explicitly answered | met |
| No implementation drift occurred | met |
| No propagation collapse occurred | met |
| No A1 taxonomy reopening occurred | met |
| Final status tokens exist | met |

## 23. Recommended Next Slice

Recommended next slice:

`Stage_13B_1_D_Space_Repost_Share_to_Space_Contract`

Why:

- C resolves retention/save policy but does not solve propagation.
- F/G established object -> Space create as P0.
- A/B/C preserve the boundary that repost/share-to-Space is Space-owned, not Reactions-owned.
- Content action rows should not be piloted broadly until both save/bookmark and Space propagation contracts are frozen.

If D is handled in parallel or already closed, the implementation-track follow-up is `Stage_13B_1_E_Content_Module_Action_Row_Pilot`, starting with scoped `place`, `event`, `blog_post` owners and strict quarantine of decorative/local-only saves.

## 24. Final Status Tokens

stage_13B_1_C_status: COMPLETE_AS_UNIVERSAL_SAVE_BOOKMARK_CONTRACT

stage_13B_1_C_next_slice: Stage_13B_1_D_Space_Repost_Share_to_Space_Contract

stage_13B_1_C_implementation_drift: false

stage_13B_1_C_public_launch_implied: false

stage_13B_1_C_does_not_reopen_A1_taxonomy: true

stage_13B_1_C_reactions_role: BOOKMARK_FACT_OWNER_WITH_EXPLICIT_TARGET_POLICY

stage_13B_1_C_space_role: SAVED_HUB_PROJECTION_AND_SOCIAL_PROPAGATION_OWNER

stage_13B_1_C_connect_role: PROJECTION_ONLY

stage_13B_1_C_bookmark_policy: UNIVERSAL_BOOKMARK_VIA_REACTIONS_PREFERRED_FUTURE_SPACE_POST_ONLY_CURRENT_RUNTIME
