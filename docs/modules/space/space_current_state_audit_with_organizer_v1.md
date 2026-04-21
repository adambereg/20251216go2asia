# Space Current State Audit with Organizer v1

## Status

Runtime audit completed after merge of Organizer cycle into `main`.
This document reflects repository state at the time of this audit and is intentionally bounded to current code/docs evidence.

## Purpose

Fix a factual snapshot of:

- how Organizer is currently embedded into Space Asia runtime;
- how Saved and Organizer interact in real code paths;
- where runtime boundaries currently run between Space social layer and Organizer domain;
- what is already live versus still thin/partial/deferred.

File choice: created as a new document because no existing file in `docs/modules/space/` was a direct current-state audit for "Space + Organizer + Saved interaction" under this exact scope.

## Current Space Asia structure

### Live sections in Space runtime

In `apps/go2asia-pwa-shell/app/(public)/space`, current route tree includes:

- `/space` (dashboard entry)
- `/space/community`
- `/space/community/feed`
- `/space/community/groups/[groupId]`
- `/space/saved`
- `/space/activity`
- `/space/posts`
- `/space/profiles/[userId]`
- `/space/organizer`
- `/space/organizer/trips/[tripId]`

### Thin/deferred sections in route tree

Routes exist but are currently placeholder pages ("Раздел в разработке"):

- `/space/balance`
- `/space/quests`
- `/space/vouchers`
- `/space/nft`
- `/space/referrals`
- `/space/settings`

In `SpaceNav`, these are shown under "Скоро" as non-link deferred items.

### Organizer position in Space

Organizer is currently implemented as an embedded subsystem inside Space, not as a standalone top-level product:

- it is a primary Space navigation entry (`/space/organizer`);
- it lives under Space routes and uses Space shell/layout components;
- it has a dedicated runtime backend/API boundary (`/v1/organizer/*`) and dedicated DB schema.

Practical reading: embedded in Space UX shell, but already separated as its own runtime domain.

## Organizer inside Space

### Entry paths

User reaches Organizer via:

- primary nav item in `SpaceNav` (`/space/organizer`);
- dashboard CTA in `SpacePageClient` (`Открыть Organizer` -> `/space/organizer`);
- Saved flow deep links to trip detail (`/space/organizer/trips/[tripId]`).

### Live Organizer surfaces

Organizer surfaces currently live:

- Organizer Home route: `/space/organizer`
  - tabs in one route state: `overview`, `list`, `timeline`;
- Trip Detail route: `/space/organizer/trips/[tripId]`.

Important: Overview/List/Timeline are live UI surfaces, but not separate URL routes.

### Organizer UX position inside Space

Current UX framing in code:

- "Space Asia · Organizer" is presented as a section inside Space;
- Organizer Home acts as portfolio entry surface;
- Trip Detail acts as trip workspace (items, tasks, notes, day context, trip window/lifecycle controls).

### Organizer runtime truth vs shell dependency

Organizer uses its own runtime truth for trip domain through `organizerApi.ts` (`/v1/organizer/*`):

- trips list/create/read/update;
- trip item create/update/delete;
- trip task create/update;
- trip note and trip item note create.

Organizer still depends on surrounding Space shell for:

- container layout/navigation framing;
- cross-surface context hints from Saved layer (`useSpaceSavedReactions` on Home).

## Saved and Organizer interaction

### How Saved is currently implemented

Saved is currently a global reactions-based layer for `space_post` bookmarks:

- source list: `/v1/reactions/mine?targetType=space_post&reactionType=bookmark&limit=50`;
- each saved reaction is hydrated via `/v1/space/posts/{id}`;
- explicit unsave action removes reaction (`DELETE /v1/reactions/{id}`).

### Live Saved -> Organizer flows

In `SavedPostsPageClient`, both flows are implemented:

1. Create trip from saved:
   - `createOrganizerTrip(...)`
   - then `createOrganizerTripItem(tripId, { source: { module: 'space', entityType: 'space_post', entityId }})`
2. Add saved item to existing trip:
   - `createOrganizerTripItem(existingTripId, { source: ... })`

### What stays in Saved after linking

Current behavior is explicit in UI copy and code:

- add to trip does not remove from global Saved;
- create trip from saved does not remove from global Saved;
- remove from trip does not unsave globally.

This is also reinforced in Trip Detail messaging for saved-sourced items.

### Does Organizer duplicate Saved?

Current implementation does not create a second global saved storage inside Organizer.

What Organizer stores:

- trip-scoped representation (`organizer_trip_item`) with optional source reference fields:
  - `source_module`
  - `source_entity_type`
  - `source_entity_id`

So the relation is: global saved reference + trip-specific context.

### Realized vs partial in this interaction

Already realized:

- end-to-end linking from Saved to Organizer trip items;
- idempotent duplicate protection for same source reference within a trip (`applied: false`);
- clear UX semantics for Saved persistence vs trip membership.

Still partial:

- Saved intake currently bounded to `space_post` only;
- Organizer Home gives Saved hint, but linking flow is centered on Saved page (not full in-home intake workflow);
- creation flow updates trip chooser state optimistically before full refetch.

## Boundary analysis

### Space social layer (current)

Runtime ownership is centered on social/feed/community surfaces:

- `space-service` contract (`/v1/space/*`);
- `space` DB schema (`packages/db/src/schema/space.ts`) for social entities;
- reactions/bookmarks as global saved mechanism.

### Organizer boundary (current)

Runtime ownership is trip domain:

- organizer service routes and service logic (`/v1/organizer/*`);
- organizer DB schema (`packages/db/src/schema/organizer.ts`);
- entities include trip, trip items, trip tasks, trip notes, trip days, item notes.

### Boundary between saved reactions/posts and organizer trips/items/tasks/notes/days

Current split is coherent:

- global save truth: reactions/bookmarks + space posts;
- organizer truth: trip-scoped planning/execution context;
- integration bridge: source reference on organizer trip items.

### Boundary drift check

No major runtime drift found in this audit.
Main caveat: organizer item creation with arbitrary `source` values is validated structurally and deduplicated, but this audit did not confirm strict cross-service proof that source entity is currently saved by user at write time.

## Runtime vs docs alignment

### Aligned with accepted framing

Confirmed aligned:

- `space_personal_organizer_framing_note_v1.md` (Space dashboard-first, Organizer section inside Space);
- `space_saved_and_organizer_intake_note_v1.md` (global Saved + trip link semantics);
- `adr_0028_personal_organizer_backend_boundary.md` (separate organizer write boundary).

### Implemented live (concept -> runtime)

Now live in code:

- Organizer in primary Space navigation;
- `/space/organizer` and `/space/organizer/trips/[tripId]` routes;
- home surfaces (overview/list/timeline tabs);
- trip detail with trip/items/tasks/notes and day-aware context;
- Saved -> Organizer create/add flows with preserved global Saved state.

### Concept/future-facing still not claimed as fully live

Not claimed as fully implemented in this audit:

- full planner suite breadth (map/reminders/budget/collab/AI planner);
- broad multi-domain Saved intake beyond current `space_post` bookmark path;
- Day/Week/Month scale parity where docs imply broader timeline scale than current tab options.

### Document drift noted

Some existing docs are partially outdated against current runtime (for example claims that Organizer route/nav/surfaces are not live).
This audit treats runtime code as source of truth where conflicts exist.

## Integration maturity verdict

Organizer is already materially integrated into Space Asia as a live subsystem:

- integrated in shell and navigation;
- integrated in user flows with Saved;
- integrated through separate runtime domain/API and schema;
- not a standalone product shell, but no longer just a preview contour.

Current verdict on product cohesion:

- Space + Saved + Organizer is product-coherent for the bounded current slice;
- the relationship model (global Saved vs trip-specific Organizer) is implemented and understandable in runtime UX;
- remaining gaps are mostly breadth/maturity gaps, not core integration contradictions.

## Remaining gaps

- Saved intake breadth remains narrow (`space_post` bookmarks path);
- deferred Space sections remain placeholders outside Organizer scope;
- some historical docs are not yet synchronized with current runtime reality;
- this audit does not assert production deployment health/traffic quality, only repository/runtime-code state.

## References

### Runtime code checked

- `apps/go2asia-pwa-shell/components/space/Shared/SpaceNav.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/saved/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/saved/SavedPostsPageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/useSpaceSavedReactions.ts`
- `apps/go2asia-pwa-shell/components/space/runtime/utils.ts`
- `apps/go2asia-pwa-shell/app/(public)/space/organizer/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/organizer/OrganizerPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/organizer/trips/[tripId]/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/organizer/trips/[tripId]/OrganizerTripDetailPageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/organizerApi.ts`
- `apps/organizer-service/src/routes/trips.ts`
- `apps/organizer-service/src/services/organizerService.ts`
- `apps/api-gateway/src/index.ts`
- `packages/db/src/schema/organizer.ts`
- `packages/db/src/schema/space.ts`

### Docs checked

- `docs/modules/space/space_personal_organizer_framing_note_v1.md`
- `docs/modules/space/space_saved_and_organizer_intake_note_v1.md`
- `docs/modules/space/Placement-of-Personal-Organizer-inside-Space-Asia.md`
- `docs/decisions/adr_0028_personal_organizer_backend_boundary.md`
- `docs/modules/space/organizer_current_cycle_closure_note_v1.md`
- `docs/modules/space/organizer_concept_alignment_pass_v1.md`
- `docs/modules/space/personal_organizer_implementation_plan_v1.md`
- `docs/modules/space/Organizer-Product-Concept-v1.md`
- `docs/modules/space/Organizer-Lifecycle-Modes-v1.md`
- `docs/modules/space/go_2_asia_personal_organizer_ssot_v_1.md`
