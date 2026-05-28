# Stage 13B.1-F - Space Saved Tab Upgrade

Status: `COMPLETE_WITH_DEFERRED_REPOST_POLISH`

Mode: `BOUNDED_IMPLEMENTATION_SPACE_SAVED_TAB_UPGRADE`

Lead: AI Program Director / Orchestrator

Supporting agents: Runtime Governance Architect, Software Architect, Frontend Developer, Backend/API Analyst, Interaction Systems Analyst, QA Agent, Technical Canon Writer, Delivery Planner.

## 1. Executive Summary

Stage 13B.1-F upgrades `/space/saved` from a Space-post-only surface plus pilot counters into a bounded saved-items projection for the Stage 13B.1 pilot targetTypes.

Implemented:

- `/space/saved` now reads Reactions bookmark facts for `space_post`, `place`, `event`, and `blog_post`.
- saved `place`, `event`, and `blog_post` objects are hydrated through their source owner APIs and rendered as usable cards.
- saved `space_post` remains supported through existing Space post hydration and `SpaceFeedCard`.
- filters were added for `All`, `Posts`, `Places`, `Events`, and `Blog`.
- each displayed saved item has an open source link and runtime-backed unsave via `DELETE /v1/reactions/{reactionId}`.
- bounded pilot copy and unavailable-source states were added.

Not implemented:

- universal saved hub beyond pilot targetTypes;
- RF/Rielt/Quest/local save migration;
- Connect writes;
- economy/reward hooks;
- duplicate repost prevention;
- broad object-bound repost preview hydration in Space feed.

## 2. Scope and Boundaries

In scope:

- saved `space_post`;
- saved `place`;
- saved `event`;
- saved `blog_post`;
- client-side saved item read model;
- per-targetType hydration;
- filters/tabs;
- open links;
- unsave;
- honest bounded pilot copy.

Out of scope:

- `partner`, `listing`, `quest`;
- city/country/guide;
- RF offers and RF favorites;
- Rielt listing save;
- Quest save/proof/review;
- comments/discuss;
- notifications;
- Connect writes;
- economy and rewards;
- full Space Activity upgrade;
- feed redesign;
- repost deduplication and broad repost preview polish.

## 3. Upstream Contracts Carried Forward

From C:

- Save is owner-qualified retention intent.
- Bookmark is a Reactions-owned retention fact.
- `/space/saved` may display saved items but does not own bookmark facts.
- Bookmark is not propagation, socialization, reward, or Connect owner-fact.

From D:

- Share-to-Space and repost remain Space-owned propagation.
- Repost display is not repost create.
- Native share is not share-to-Space.
- `/space/activity` is social projection, not economy.

From E:

- `space_post`, `place`, `event`, and `blog_post` are the only runtime-backed bookmark targetTypes in this pilot.
- `/space/saved` previously had Space-post hydration plus pilot counters only.
- RF/Rielt/Quest/Connect/economy remained excluded.

## 4. Saved Item Model

The saved item projection uses two layers:

- Reactions fact: `reactionId`, `targetType`, `targetId`, `createdAt`.
- Hydrated preview: title, description/subtitle, optional image, href, source label, and unavailable state.

Implemented local model:

- `SavedSpacePostItem`;
- `SavedPlaceItem`;
- `SavedEventItem`;
- `SavedBlogPostItem`;
- shared `SavedItem` union with `status: hydrated | missing`.

Missing source objects remain visible as unavailable cards so Reactions facts are not silently hidden.

## 5. Reactions `/mine` Usage

`/space/saved` uses `/v1/reactions/mine` for exactly these targetTypes:

- `space_post`;
- `place`;
- `event`;
- `blog_post`.

It does not infer saved state from like summary. It does not query or display `partner`, `listing`, `quest`, RF offer, city, country, or guide saves.

## 6. Hydration Strategy

Hydration is source-owner based:

- `space_post` -> Space Service `GET /v1/space/posts/{id}`;
- `place` -> Content/Atlas `getPlaceByIdOrSlug(targetId)`;
- `event` -> Pulse/Content `getEventById(targetId)`;
- `blog_post` -> Blog `getBlogPostBySlug(targetId.replace(/^blog_/, ''))`.

This preserves the C contract that Reactions owns facts while source modules hydrate source truth.

## 7. UI Implementation

Updated `/space/saved`:

- title changed from "Сохранённые посты" to "Сохранённое";
- bounded pilot explanation added;
- filters added: `Все`, `Посты`, `Места`, `События`, `Блог`;
- cards show source badge, title, description, metadata, saved date, open link, and unsave button;
- empty/auth/runtime-unavailable states preserved;
- missing-source cards are explicit.

Space post rendering continues to use `SpaceFeedCard`. Pilot content objects use a compact saved object card.

## 8. Unsave Implementation

All displayed targetTypes use the same runtime-backed unsave:

`DELETE /v1/reactions/{reactionId}`

After success:

- the card is removed from local state;
- filter counts update automatically;
- no Space post, propagation, Connect, Points, or source object mutation is created.

## 9. Atlas Place Saved Cards

Saved `place` cards display:

- source badge: `Место`;
- place name;
- description or location fallback;
- category/location/price metadata when available;
- optional image from `heroImage` or first photo;
- link to `/atlas/places/{slugOrId}`;
- unsave button.

## 10. Pulse Event Saved Cards

Saved `event` cards display:

- source badge: `Событие`;
- event title;
- short description or location fallback;
- date/location/category/free metadata when available;
- optional hero image via `resolveMediaUrl(heroMediaKey)`;
- link to `/pulse/events/{slugOrId}`;
- unsave button.

Pulse registration remains lifecycle-only and is not part of save.

## 11. Blog Post Saved Cards

Saved `blog_post` cards display:

- source badge: `Блог`;
- title;
- excerpt or subtitle;
- author/published date/reading time metadata;
- optional hero image;
- link to `/blog/{slug}`;
- unsave button.

Hydration uses the existing Blog slug API and derives slug from `blog_` target id.

## 12. Space Post Saved Cards

Saved `space_post` remains supported:

- facts are read through `/mine?targetType=space_post&reactionType=bookmark`;
- posts are hydrated via Space;
- cards are rendered through existing `SpaceFeedCard`;
- unsave remains Reactions-owned.

Organizer trip intake was not expanded to content objects in F. That avoids turning saved hub work into an Organizer source contract change.

## 13. Deferred / Quarantined Surfaces

Still deferred:

- RF favorite;
- RF offers;
- Rielt listing;
- Quest;
- Atlas city/country/guide;
- comments/discuss;
- notifications;
- Connect writes;
- economy hooks.

Static negative scans found no new Reactions/Space write wiring in RF/Rielt/Quest/Connect component trees.

## 14. Known Linked Issues

### Repost duplicates

Observed: sharing the same event to Space multiple times creates multiple repost rows.

Fixed in F: no.

Reason: F is a saved-tab projection slice. Deduplication changes propagation semantics and should be handled separately.

Recommended follow-up:

`Stage 13B.1-E1 - Repost Deduplication / Repost UX Guard`

Possible policy:

- one active repost per `(authorId, repostTargetType, repostTargetId)`;
- or UI "already shared" state;
- or allow duplicates with confirmation.

### Weak repost previews

Observed: Space feed repost cards show generic text such as "Репост · событие" and weak source details.

Fixed in F: no, except saved cards now hydrate their own source previews.

Reason: broad feed preview hydration belongs to a propagation/feed polish slice, not `/space/saved`.

Recommended follow-up:

`Stage 13B.1-G0` or `Stage 13B.1-E2 - Object-bound Repost Preview Hydration`

## 15. Runtime Evidence

Route evidence:

- `apps/go2asia-pwa-shell/app/(public)/space/saved/page.tsx`;
- `apps/go2asia-pwa-shell/app/(public)/space/saved/SavedPostsPageClient.tsx`.

API evidence:

- `/v1/reactions/mine?targetType=space_post&reactionType=bookmark&limit=50`;
- `/v1/reactions/mine?targetType=place&reactionType=bookmark&limit=50`;
- `/v1/reactions/mine?targetType=event&reactionType=bookmark&limit=50`;
- `/v1/reactions/mine?targetType=blog_post&reactionType=bookmark&limit=50`;
- `DELETE /v1/reactions/{reactionId}`;
- `GET /v1/space/posts/{id}`;
- `GET /v1/content/places/{idOrSlug}`;
- `GET /v1/content/events/{id}`;
- `GET /v1/content/blog/posts/{slug}`.

Hook/code evidence:

- `SavedPostsPageClient` implements `fetchSavedReactions`, `hydrateSavedReaction`, filters, `SavedCard`, and `removeSaved`.

Verification:

- `pnpm -C apps/go2asia-pwa-shell typecheck` - pass.
- `pnpm -C apps/go2asia-pwa-shell lint` - pass with 0 errors and existing warnings.
- `pnpm -C apps/reactions-service test` - pass, 18 tests.
- `ReadLints` on edited saved files - no linter errors.

Negative evidence:

- no `ContentActionRow`, `/v1/reactions`, `/v1/space/posts`, `repostTargetType`, `reactionType: bookmark`, or `reactionType: like` matches in `components/rf`, `components/rielt`, `components/quest`, `components/connect`.
- Points allowlist still marks `space_repost_created` and `space_reaction_created` as `FUTURE_ONLY`.

Screenshots:

- not collected in this implementation pass.

## 16. Matrix 1 - Saved TargetType Matrix

| targetType | Displayed in `/space/saved`? | Hydrated? | Unsave? | Status |
| --- | --- | --- | --- | --- |
| `space_post` | yes | yes, via Space post API | yes | complete |
| `place` | yes | yes, via Atlas/Content | yes | complete |
| `event` | yes | yes, via Pulse/Content | yes | complete |
| `blog_post` | yes | yes, via Blog | yes | complete |
| `partner` | no | no | no | deferred |
| `listing` | no | no | no | deferred |
| `quest` | no | no | no | deferred |
| city/country/guide | no | no | no | blocked pending targetType contract |
| `rf_offer` | no | no | no | blocked pending targetType contract |

## 17. Matrix 2 - Saved Item Hydration Matrix

| targetType | Source owner | Hydration path | Fields displayed | Limitations |
| --- | --- | --- | --- | --- |
| `space_post` | Space | `/v1/space/posts/{id}` | feed card, author/text/media count | no new preview model |
| `place` | Atlas/Content | `getPlaceByIdOrSlug(targetId)` | name, description/location, image, metadata | image quality depends on source |
| `event` | Pulse/Content | `getEventById(targetId)` | title, date, location, category, image | canonical href prefers hydrated slug |
| `blog_post` | Blog/Content | `getBlogPostBySlug(strip blog_)` | title, excerpt, author/date/reading time, image | assumes `blog_{slug}` id convention |

## 18. Matrix 3 - UI Surface Matrix

| Surface | Behavior | Runtime-backed? | Notes |
| --- | --- | --- | --- |
| `/space/saved` | bounded saved-items projection | yes | reads Reactions facts |
| saved filters/tabs | client-side filter by targetType | yes | no new backend hub |
| saved item card | hydrated preview + source badge | yes | source owner hydration |
| unsave button | deletes Reactions bookmark | yes | no source/Space mutation |
| open source link | navigates to source object | yes | safe fallback if hydration missing |
| empty state | scoped guidance | yes | names deferred local saves |
| auth state | sign-in prompt | yes | preserved |

## 19. Matrix 4 - Reactions Ownership Matrix

| Action | Owner | API | Scope | Notes |
| --- | --- | --- | --- | --- |
| list saved | Reactions | `/v1/reactions/mine` | `space_post/place/event/blog_post` | facts only |
| unsave | Reactions | `DELETE /v1/reactions/{reactionId}` | displayed saved items | hard-delete runtime from B |
| saved state | Reactions | `/mine` with targetType/targetId where needed | pilot targetTypes | not like summary |
| like | Reactions | summary/write/delete | E action rows | not save |
| share-to-Space | Space | `POST /v1/space/posts` | E propagation | not bookmark |
| Connect projection | Connect | none in F | projection-only | no owner-facts |

## 20. Matrix 5 - Deferred / Quarantine Matrix

| Surface | Deferred? | Why | Future slice |
| --- | --- | --- | --- |
| RF favorite | yes | local planning utility, not bookmark | RF save contract |
| RF offers | yes | no `rf_offer` targetType | RF offer target contract |
| Rielt listing | yes | listing/inquiry boundary | Rielt saved contract |
| Quest | yes | proof/review/reward boundary | Quest social/save contract |
| Atlas city/country/guide | yes | no targetType contract | Atlas targetType contract |
| comments/discuss | yes | separate social primitive | Space discussion contract |
| notifications | yes | separate projection layer | notification contract |
| economy hooks | yes | bookmark is not reward | economy producer contract only if approved |
| Connect writes | yes | Connect projection-only | none in F |

## 21. Matrix 6 - Known Linked Issues Matrix

| Issue | Observed? | Fixed in F? | Future slice | Notes |
| --- | --- | --- | --- | --- |
| duplicate reposts | yes | no | `Stage 13B.1-E1` | propagation policy change |
| weak repost preview | yes | no | `Stage 13B.1-G0` or `E2` | feed/repost preview hydration |
| missing `resolvedPreview` | yes | no | repost preview slice | Space service still returns weak refs |
| source validation for object-bound reposts | yes | no | propagation hardening | Space validates enum, not source existence |

## 22. Matrix 7 - Allowed vs Forbidden Runtime Expansion

| Capability | Allowed in F | Forbidden in F | Why |
| --- | --- | --- | --- |
| saved cards | `space_post/place/event/blog_post` | other targetTypes | bounded pilot |
| hydration | source-owner API reads | source ownership transfer | Reactions stores facts only |
| unsave | Reactions delete | Space/source deletes | bookmark owner fixed |
| filters | client targetType filters | universal saved hub claim | no full ecosystem rollout |
| Organizer | preserve Space post display | expand content intake silently | separate Organizer contract |
| repost UX | document gaps | feed redesign/dedupe | separate propagation polish |
| economy | none | reward/Points hooks | save is not economy |
| Connect | none | Connect owner-facts | projection-only |

## 23. Required Decisions

| Question | Answer | Status |
| --- | --- | --- |
| Does `/space/saved` now display saved place, event, blog_post as cards? | Yes. | `implemented` |
| Does `/space/saved` still support saved `space_post`? | Yes. | `preserved` |
| Is unsave runtime-backed for all displayed targetTypes? | Yes, via Reactions delete. | `implemented` |
| Are saved items hydrated through source owners or safe fallbacks? | Yes. | `implemented_with_missing_state` |
| Is `/space/saved` still bounded, not universal? | Yes. | `bounded` |
| Are RF/Rielt/Quest boundaries preserved? | Yes. | `preserved` |
| Are repost duplicates fixed or deferred? | Deferred. | `known_propagation_gap` |
| Are weak repost previews fixed or deferred? | Deferred for feed; saved cards hydrate their own previews. | `known_repost_preview_gap` |
| Does F preserve C/D boundaries? | Yes. | `preserved` |
| What remains deferred after F? | RF/Rielt/Quest, city/country/guide, Connect/economy, repost dedupe, feed preview hydration, activity upgrade. | `deferred` |

## 24. Risks and Limitations

| Risk | Severity | Status | Mitigation |
| --- | --- | --- | --- |
| `/mine` is per-targetType and limit-slice only | medium | accepted | bounded pilot, no cursor claim |
| blog hydration assumes `blog_{slug}` ids | medium | accepted | documented; fallback link uses stripped slug |
| missing source cards may appear | low/medium | accepted | explicit unavailable state |
| Organizer intake not expanded | low | deliberate | avoids contract drift |
| repost duplicates remain | medium | deferred | E1 recommended |
| weak Space feed repost previews remain | medium | deferred | G0/E2 recommended |

## 25. Review Gate Results

| Review gate | Result | Notes |
| --- | --- | --- |
| Runtime Governance Review | Pass with caveats | `/mine` remains limit-slice and source hydration can fail explicitly. |
| Architecture Review | Pass | Reactions facts, source hydration, and Space projection remain separated. |
| Frontend UX Review | Pass | Saved cards, filters, empty/auth/error states implemented. |
| Canon Review | Pass | C/D boundaries preserved; no universal hub claim. |
| QA Review | Pass | Focused typecheck/lint/tests and negative scans completed. |
| Boundary Review | Pass | RF/Rielt/Quest/Connect/economy remain out of scope. |
| Lightweight Economy Boundary Review | Pass | No Points/reward hooks added. |

## 26. Acceptance Criteria Status

| Criterion | Status |
| --- | --- |
| `/space/saved` displays saved Space posts | met |
| `/space/saved` displays saved places | met |
| `/space/saved` displays saved events | met |
| `/space/saved` displays saved blog posts | met |
| Saved items have usable open links | met |
| Saved items can be unsaved | met |
| `/space/saved` remains bounded to pilot targetTypes | met |
| RF/Rielt/Quest/Connect/economy remain out of scope | met |
| Repost duplicate issue fixed or explicitly deferred | deferred, documented |
| Repost preview issue fixed or explicitly deferred | deferred, documented |
| No C/D boundary collapse occurred | met |
| Final status tokens exist | met |

## 27. Recommended Next Slice

Recommended next slice:

`Stage 13B.1-E1 - Repost Deduplication & Repost Preview Polish`

Why:

- `/space/saved` now works for pilot bookmarks.
- User-observed feed repost issues remain visible: duplicate reposts and weak source previews.
- Fixing those before a broader Space Activity upgrade will make G evidence cleaner.

Alternative:

`Stage 13B.1-G - Space Activity Tab Upgrade` if repost preview quality is acceptable for the pilot.

## 28. Final Status Tokens

stage_13B_1_F_status: COMPLETE_WITH_DEFERRED_REPOST_POLISH

stage_13B_1_F_next_slice: Stage_13B_1_E1_Repost_Deduplication_And_Repost_Preview_Polish

stage_13B_1_F_implementation_drift: false

stage_13B_1_F_public_launch_implied: false

stage_13B_1_F_does_not_reopen_A1_taxonomy: true

stage_13B_1_F_reactions_role: BOOKMARK_FACT_OWNER

stage_13B_1_F_space_role: SAVED_ITEMS_PROJECTION_SURFACE_AND_PROPAGATION_OWNER_FOR_SEPARATE_REPOSTS

stage_13B_1_F_connect_role: PROJECTION_ONLY_NO_WRITES

stage_13B_1_F_saved_scope: SPACE_POST_PLACE_EVENT_BLOG_POST_ONLY

stage_13B_1_F_repost_dedupe_status: DEFERRED_KNOWN_PROPAGATION_GAP

stage_13B_1_F_repost_preview_status: DEFERRED_KNOWN_REPOST_PREVIEW_GAP
