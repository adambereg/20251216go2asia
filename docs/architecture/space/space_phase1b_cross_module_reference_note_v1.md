# Space Asia Phase-1b Cross-Module Reference Note v1

## Status / verdict
completed as Space phase-1b narrow cross-module integration

## 1. Purpose
This note fixes the narrow phase-1b implementation result for Space Asia.  
Goal of phase 1b: add lightweight cross-module reference previews on top of the already activated runtime shell, without expanding Space into a broad social/platform surface.

## 2. Selected reference scope
### Included in phase 1b
- `event` -> Pulse route link (`/pulse/{targetId}`)
- `place` -> Atlas route link (`/atlas/places/{targetId}`)
- `listing` -> Rielt route link (`/rielt/listings/{targetId}`)

### Explicitly deferred in phase 1b
- `partner` (RF) preview link
- `quest` preview link
- `blog_post` preview link
- `space_post` deep preview

Reason for defer: avoid unsafe routing assumptions where runtime payload currently provides only `targetType + targetId` and does not guarantee resolved cross-module preview metadata (`resolvedPreview` is optional and typically absent in current runtime flow).

## 3. Starting shell state
- `/space` was already runtime-backed from phase 1a.
- Cross-module reference rendering existed only as raw `targetType/targetId` text.
- No lightweight, user-facing safe-link layer for selected cross-module targets was present.

## 4. Scope of this pass
### In scope
- Narrow preview layer on canonical `/space` entry only.
- Runtime-consistent cross-module link rendering for selected safe target types.
- Honest deferred markers for unsupported/unsafe reference types.

### Out of scope
- New backend endpoints or contract redesign.
- Rich embedded cards/full detail widgets.
- Broad feed redesign.
- Phase 1c stabilization/optimization work.
- Any reopening of RF/Rielt/Guru/Quest/Pulse/Atlas implementation tracks.

## 5. Changes made
### Runtime shell reference rendering
- Added `toCrossModulePreview` mapping in `/space` shell rendering for safe target types:
  - `event`, `place`, `listing` -> enabled link preview mode
  - all other target types -> explicit deferred marker
- Added lightweight preview UI block per repost with:
  - reference title/subtitle
  - target id
  - safe link (when available)
  - explicit deferred note (when unavailable)
- Added shell-level phase-1b integration summary and deferred reference badges.

File:
- `apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx`

## 6. What is now integrated in `/space`
- Space shell now presents narrow cross-module references for:
  - Pulse events
  - Atlas places
  - Rielt listings
- Integration remains preview-only and link-only, preserving module ownership boundaries.

## 7. Explicit non-goals
- No full cross-module embeds.
- No full RF/Quest/blog/space-post preview maturity.
- No social graph/ranking/search expansion.
- No schema/migration/backend cycle changes.

## 8. Deferred debt after phase 1b
- RF partner / Quest / blog_post / space_post reference deep handling.
- Stronger canonicalization for all possible target id variants.
- Rich preview metadata when runtime starts providing stronger resolved previews consistently.

## 9. Verification summary
- Frontend package typecheck/lint/build executed on touched scope.
- Route-level sanity confirmed for selected templates.
- Imports and generated type usage validated.

## 10. Final recommendation
Phase 1b is complete within narrow integration-shell-first boundaries.  
Proceed to phase 1c only as stabilization/freeze pass, not as new feature expansion.
