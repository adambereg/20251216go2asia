# Space UI → API → Domain Mapping v1

**Project:** Go2Asia  
**Module:** Space Asia  
**Document role:** Synchronization map between Space UI/UX concept, backend API surface, and domain model  
**Status:** Draft SSOT for frontend/backend alignment

---

# 1. Purpose

This document synchronizes three layers of Space Asia:

1. **UI / UX surfaces**
2. **API contracts**
3. **Domain entities / ownership boundaries**

Its goal is to prevent drift between:

- product design
- frontend implementation
- backend service architecture

This document should be used by:

- frontend developers
- backend developers
- API designers
- designers / product owners
- Cursor multi-agent workflows

---

# 2. Core Rule

Space Asia UI is broader than Space Service.

Therefore every UI block must be classified into one of three categories:

## A. Space-owned
UI is backed directly by `space-service`.

## B. Adjacent-domain summary
UI displays summary data from another domain/service.

## C. Aggregated / orchestration surface
UI combines multiple services and may require BFF/adapters.

This rule is essential.

---

# 3. Ownership Legend

## Space-owned domain

Owned by `space-service`:

- posts
- reposts
- groups
- group membership
- profile projections
- post-media relations
- feed surfaces (at least in early phase)
- optional early organizer items only if explicitly approved

## Adjacent domains

Owned outside Space:

- reactions → `reactions-service`
- media assets → `media-service`
- points / reputation / referral / NFT / G2A → Connect services
- quest progress / quest submissions → `quest-service`
- partner objects / vouchers → `rf-service`
- listing / inquiry objects → `rielt-service`
- events → `content-service` / `pulse` domain
- places → `content-service` / `atlas` domain
- AI execution / orchestration → assistant layer
- PRO operational workflows → multi-service PRO Console

---

# 4. Global Mapping Table

| UI Surface | API Source | Domain Ownership | Notes |
|---|---|---|---|
| Dashboard | mixed | aggregated | personal cockpit, not single-domain |
| Feed | `/v1/space/feed/*` | Space | primary social delivery layer |
| Community | `/v1/space/groups*` | Space | groups and memberships |
| My Posts | `/v1/space/posts*` | Space | authored content management |
| Saved | mixed | aggregated | Space UI surface, multi-domain saved items |
| Organizer | optional Space / future planner | aggregated / transitional | extraction-ready by design |
| Activity | mixed | Space + Reactions + system | likely composite feed |
| Profile | `/v1/space/profiles/{userId}` + adjunct summaries | Space + adjacent summaries | social identity, not full account |
| Composer | `/v1/space/posts` + media flow | Space + Media | creation flow |
| AI Assistant UI | assistant layer + Space context | external orchestration | Space is context provider |
| PRO Console | multi-service | not Space-owned overall | Space only contributes social surfaces |

---

# 5. Dashboard Mapping

# 5.1 Dashboard as product surface

Dashboard is not a single backend resource.

It is a **user cockpit** that combines:

- social activity preview
- organizer preview
- ecosystem signals
- AI suggestions
- optional PRO work preview

Therefore Dashboard should be treated as a **frontend composition surface**.

---

# 5.2 Dashboard blocks and mapping

## A. User Header

### UI shows
- avatar
- display name
- role/status
- short bio
- lightweight metrics

### API
- `GET /v1/space/profiles/{userId}`
- optional count summaries from supporting endpoints or aggregate BFF

### Domain
- `space_profile_projection`
- counts may be derived from `space-service`
- account settings remain outside Space

---

## B. Today

### UI shows
- today tasks
- event reminders
- urgent actions

### API
- organizer endpoint if organizer remains near Space
- otherwise planner/assistant service
- event reminders may come from Pulse / Quest / RF / Rielt domains

### Domain
- not pure Space-owned
- aggregated coordination surface

### Rule
Dashboard “Today” must not force planner logic into Space Service.

---

## C. Next Actions

### UI shows
- recommended next actions
- reply needed
- complete step
- visit place
- use voucher

### API
- assistant layer / planner layer / lightweight aggregation endpoint

### Domain
- cross-domain orchestration

### Rule
This block is UX-critical but not proof that Space Service owns workflow execution.

---

## D. Organizer Preview

### UI shows
- 3–5 next items
- CTA to full Organizer

### API
- `GET /v1/space/organizer` if early organizer exists in Space boundary
- otherwise planner service / BFF

### Domain
- transitional / extraction-ready

---

## E. Ecosystem Signals

### UI shows
- Points
- NFT
- Referrals
- Vouchers
- Quest progress
- PRO progress

### API
- Connect summary endpoints
- Quest summary endpoint
- RF summary endpoint
- PRO summary endpoint if exists

### Domain
- all adjacent domains

### Rule
Dashboard only shows summary widgets. Full ownership remains outside Space.

---

## F. Social Pulse

### UI shows
- recent likes
- reposts
- replies
- recent social changes

### API
- `GET /v1/space/feed/activity`
- reaction activity projections if available

### Domain
- mixed: Space + Reactions

---

## G. AI Assistant Suggestions

### UI shows
- suggestions
- reminders
- automation prompts

### API
- assistant layer endpoint(s)

### Domain
- assistant/orchestration layer

### Rule
Space UI renders the panel. Space Service does not own AI generation.

---

## H. PRO Widget

### UI shows
- pending reviews
- events soon
- partner tasks
- CTA to PRO Console

### API
- PRO summary aggregation endpoint

### Domain
- multi-service operational summary

---

# 6. Feed Mapping

# 6.1 Feed purpose

Feed is a Space-owned social delivery surface.

It should be primarily backed by Space feed endpoints.

---

## 6.2 UI blocks

### Top filters
- Following
- Groups
- Around Me
- Curated

### Feed cards
- post card
- repost card
- group post card
- embedded object card

---

## 6.3 API mapping

### Home feed
- `GET /v1/space/feed/home`

### Profile feed
- `GET /v1/space/feed/profile/{userId}`

### Group feed
- `GET /v1/space/feed/group/{groupId}`

### Card details
- `GET /v1/space/posts/{postId}`

---

## 6.4 Domain mapping

### Domain entities
- `space_post`
- `space_profile_projection`
- optional `space_feed_item`

### Embedded object preview
- resolved repost preview
- preview is read-model enrichment, not ownership transfer

---

## 6.5 Action mapping on feed card

| UI Action | API | Domain |
|---|---|---|
| Open post | `GET /v1/space/posts/{id}` | Space |
| Repost | `POST /v1/space/posts` or convenience repost route | Space |
| Like | reactions endpoint | Reactions |
| Save | saved-items endpoint / planner / reactions-like bookmark model | external / aggregated |
| Ask | reactions endpoint | Reactions |
| More menu | mixed | mixed |

---

# 7. Community Mapping

# 7.1 Community purpose

Community is primarily a Space-owned group discovery and participation surface.

---

## 7.2 API mapping

### Group list / discovery
Potential endpoints:
- `GET /v1/space/groups` (should likely be added later)
- `GET /v1/space/groups/{groupId}`

### Membership actions
- `POST /v1/space/groups/{groupId}/join`
- `POST /v1/space/groups/{groupId}/leave`

### Group feed
- `GET /v1/space/feed/group/{groupId}`

---

## 7.3 Domain mapping

- `space_group`
- `space_group_member`
- `space_post` with `group_id`

---

## 7.4 UX implication

Community list pages may need an expanded API surface beyond the current minimum endpoints.

Recommendation for future OpenAPI:
- add group discovery/list endpoint
- add member count / activity summaries to group DTOs

---

# 8. My Posts Mapping

# 8.1 UI purpose

My Posts is a management surface for authored content.

---

## 8.2 API mapping

Recommended:
- `GET /v1/space/feed/profile/{userId}` for initial authored list
- `GET /v1/space/posts/{id}`
- `PATCH /v1/space/posts/{id}`
- `DELETE /v1/space/posts/{id}`

Potential future endpoint:
- `GET /v1/space/me/posts`

---

## 8.3 Domain mapping

- `space_post`
- `space_profile_projection`

Drafts and archived state are UI expectations that may require later backend extension if not represented in v1.

---

# 9. Saved Mapping

# 9.1 UI purpose

Saved is not a pure Space-owned domain surface.

It is an **action source** and multi-domain collection of saved objects.

---

## 9.2 API mapping

Possible backing models:

### Option A
Bookmarks live in Reactions Service.

### Option B
Saved items live in Planner / Organizer domain.

### Option C
Hybrid aggregation.

---

## 9.3 Domain mapping

Saved may contain references to:
- Space posts
- Atlas places
- Pulse events
- Blog articles
- Quests
- Partners
- Listings

Thus Saved is inherently cross-domain.

### Rule
Saved must not be forced into `space-service` if that would distort domain boundaries.

---

# 10. Organizer Mapping

# 10.1 UI purpose

Organizer is the execution layer of the user.

It is one of the most important UX surfaces, but backend ownership is transitional.

---

## 10.2 UI blocks

- Timeline
- Plans
- Actions
- Signals
- Growth
- AI actions

---

## 10.3 API mapping

### Early phase if organizer is inside Space boundary
- `GET /v1/space/organizer`
- `POST /v1/space/organizer/items`
- `PATCH /v1/space/organizer/items/{id}`
- `DELETE /v1/space/organizer/items/{id}`

### Long-term phase
- planner / organizer service endpoints
- Space UI simply consumes them

---

## 10.4 Domain mapping

### Optional early entity
- `space_organizer_item`

### Long-term ownership
- planner/organizer domain

---

## 10.5 UX rule

Organizer UI must be built in an extraction-friendly way.

Frontend components should not assume permanent Space ownership of organizer data.

---

# 11. Activity Mapping

# 11.1 UI purpose

Activity is a mixed surface showing:

- social events
- replies
- likes
- group activity
- system notifications
- AI-related items

---

## 11.2 API mapping

### Core
- `GET /v1/space/feed/activity`

### Extensions
- reaction activity stream
- notification stream
- assistant activity stream

---

## 11.3 Domain mapping

Activity is inherently aggregated.

Possible contributing domains:
- Space
- Reactions
- Notification
- Assistant layer
- planner signals

### Rule
Do not overload `space-service` with every activity subtype if those events belong to other services.

---

# 12. Profile Mapping

# 12.1 UI purpose

Profile is the user’s social identity surface.

It is not the same as account settings.

---

## 12.2 API mapping

### Core
- `GET /v1/space/profiles/{userId}`
- `GET /v1/space/feed/profile/{userId}`

### Summary enrichments
- groups summary
- points / badges summary
- PRO identity summary

---

## 12.3 Domain mapping

### Space-owned
- `space_profile_projection`
- authored posts

### External summaries
- badges / points / referrals / quests / partner stats

### Rule
Profile page may show ecosystem identity, but only the social projection is Space-owned.

---

# 13. Composer Mapping

# 13.1 UI purpose

Composer is a creation flow, not just a textarea.

It should support:
- post
- repost
- media attach
- group publishing
- ecosystem-object attach

---

## 13.2 API mapping

### Create post/repost
- `POST /v1/space/posts`

### Upload flow
- media-service signed upload flow
- then `POST /v1/space/posts/{postId}/media`

### Update draft-like entity
Not necessarily supported in v1 unless draft domain is added.

---

## 13.3 Domain mapping

- `space_post`
- `space_post_media`
- `media_asset` externally

---

# 14. AI Assistant UI Mapping

# 14.1 UI purpose

Assistant UI is a Space-facing surface for suggestions and action execution.

---

## 14.2 API mapping

Likely comes from assistant layer:
- assistant suggestions endpoint
- assistant action proposal endpoint
- macro execution endpoint

Space UI consumes these.

---

## 14.3 Domain mapping

### Space provides context
- posts
- groups
- profile projection
- optional organizer items

### Assistant layer owns
- suggestion generation
- automation logic
- macro execution
- permission handling for assisted/automated flows

---

## 14.4 UX rule

AI actions should be explicit about their state:
- suggested
- prepared
- needs confirmation
- completed

These states do not imply that Space Service owns the AI engine.

---

# 15. PRO Console Mapping

# 15.1 UI purpose

PRO Console is a separate operational contour.

Rule:

> Space = life  
> PRO Console = work

---

## 15.2 API mapping by section

### PRO Overview
- multi-service summary endpoint

### Events
- Pulse / event-domain endpoints

### Quests
- quest-service endpoints

### Groups
- Space group endpoints + moderation overlays

### Partners
- RF service endpoints

### Moderation
- moderation/internal endpoints

### Analytics
- analytics service / projection layer

### PRO Organizer
- planner / operational task service

---

## 15.3 Domain mapping

PRO Console is not owned by Space Service.

Space contributes only:
- PRO-led groups
- social profile projection
- social publication surfaces

---

# 16. Screen-by-Screen Mapping Matrix

| Screen | Primary API | Secondary APIs | Primary Domain | Notes |
|---|---|---|---|---|
| Dashboard | mixed | mixed | aggregated | cockpit surface |
| Feed | `/v1/space/feed/*` | reactions/media previews | Space | social stream |
| Community | `/v1/space/groups*` | group feed | Space | group discovery |
| My Posts | `/v1/space/posts*` | feed/profile | Space | authored content |
| Saved | external / aggregated | planner/reactions/content | mixed | cross-domain saved |
| Organizer | optional Space / planner | AI + external domains | mixed | extraction-ready |
| Activity | `/v1/space/feed/activity` + others | reactions/notifications/assistant | mixed | activity aggregation |
| Profile | `/v1/space/profiles/{id}` | external summaries | Space + mixed | social identity |
| Composer | `/v1/space/posts` + media flow | media-service | Space + Media | creation flow |
| AI panel | assistant layer | Space context | assistant | not Space-owned |
| PRO Console | multi-service | Space contributes partially | mixed | separate operational contour |

---

# 17. Frontend Architecture Implications

## 17.1 Frontend must use adapters

Because UI surfaces are broader than Space Service, the frontend should use:

- DTO → ViewModel adapters
- composition layers
- screen-level loaders / BFF adapters where needed

---

## 17.2 Avoid these mistakes

### Mistake 1
Treat Dashboard as if it came from one Space endpoint.

### Mistake 2
Treat Organizer as permanently owned by Space.

### Mistake 3
Treat Profile as full identity ownership.

### Mistake 4
Treat AI suggestions as coming from Space Service itself.

### Mistake 5
Treat PRO Console as a “tab” over Space-owned data only.

---

# 18. Recommended Backend-to-Frontend Implementation Order

To reduce integration pain:

## Step 1
Implement core Space contracts:
- posts
- reposts
- groups
- profile projection
- media attach
- feed

## Step 2
Wire Feed, Community, Composer, basic Profile, My Posts.

## Step 3
Layer in activity projections.

## Step 4
Add Dashboard summaries through composition.

## Step 5
Add Organizer through explicit transitional boundary.

## Step 6
Add assistant layer and PRO operational overlays.

---

# 19. Final Summary

This mapping document establishes one key principle:

> **Space UI is broader than Space Service, but its social core must remain tightly aligned with Space-owned API contracts and domain entities.**

Short formula:

- **UI** = user environment
- **API** = service contract surface
- **Domain** = ownership truth

If these three layers remain synchronized, Space Asia can evolve without architectural drift.

