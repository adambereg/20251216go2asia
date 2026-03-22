# Space Asia Phase-1a Runtime Shell Activation Note v1

## Status / verdict
completed as Space phase-1a runtime shell activation

## 1. Purpose
This note fixes the implementation result of Space Asia phase 1a.  
Goal of phase 1a: activate one canonical Space entry as a truthful runtime-backed integration shell, replacing critical mock-first masking on the main path.

## 2. Canonical entry selected
- Selected entry: `/space`
- Why:
  - it is the primary Space shell route in current navigation;
  - it previously rendered mock-driven dashboard data as primary truth;
  - it can be switched to existing runtime surfaces without broad route rewrite.

## 3. Starting truth-state
- `space-service` runtime contour already existed (`/v1/space/*`, posts/groups/feed/profiles).
- Space frontend entry `/space` was still mock-driven (`mockData` as source of truth).
- Other Space pages were mostly placeholders or demo-oriented and not part of strict phase 1a runtime activation scope.

## 4. Scope of this pass
### In scope
- Runtime activation of canonical `/space` entry.
- Honest loading/empty/error/deferred states for phase 1a shell.
- Navigation hardening to avoid fake completeness on critical path.

### Out of scope
- Full Space social feature rollout.
- Phase 1b cross-module preview expansion.
- Phase 1c stabilization cycle.
- Broad Space UI redesign.
- Reopening RF/Rielt/Guru/Quest/Pulse workstreams.

## 5. Changes made
### Runtime shell activation (`/space`)
- Replaced mock dashboard source in `/space` client with runtime feed loading flow:
  - try authenticated home feed (`/v1/space/feed/home`);
  - fallback to public profile feed (`/v1/space/feed/profile/{userId}`) when auth is unavailable and public profile id is configured;
  - otherwise show explicit deferred/error shell state.
- Added truthful runtime shell rendering for feed items (author/reason/text/repost/media count/visibility).

File:
- `apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx`

### Mock masking reduction on shell navigation
- Reduced active Space nav to runtime shell entry only for phase 1a.
- Moved non-runtime-complete sections into explicit `Deferred (phase 1a)` list (non-clickable).

File:
- `apps/go2asia-pwa-shell/components/space/Shared/SpaceNav.tsx`

## 6. What is now runtime-backed
- Canonical Space shell entry `/space` now reads from real runtime endpoints.
- Shell no longer presents mock dashboard data as the default source on the critical Space entry path.

## 7. Explicit deferred list
- `/space/quests` full runtime productization
- `/space/vouchers` full runtime productization
- `/space/nft` full runtime productization
- `/space/referrals` full runtime productization
- broader balance/settings/full social suite semantics
- phase 1b cross-module integration previews beyond shell necessity

## 8. Verification summary
- Typecheck/lint/build executed on touched frontend package.
- Import/type usage for new runtime flow verified.
- No blocker-level compile/lint issues found in touched files.

## 9. Final recommendation
Space phase 1a is complete as a truthful runtime shell activation baseline.  
Next segment may move to phase 1b only with the same integration-shell-first discipline and explicit defer control.
