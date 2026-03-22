# Atlas/Pulse Broader UI Realignment Note v1

**Status:** completed with minor residual debt.

## 1. Purpose

This segment aligned Atlas/Pulse frontend behavior with current runtime truth and current cross-domain platform state after practical, discovery, and engagement wave-1 adoption.
It was executed as a controlled UI realignment pass, not as backend/domain reopening.

## 2. Placement in sequencing

This pass matches the next official step from frontend sequencing after:
- Atlas foundation pass,
- RF wave 1,
- Rielt wave 1,
- Guru wave 1,
- Quest wave 1.

It did not open a new backend/runtime cycle.

## 3. Starting truth-state

- Atlas was runtime-backed on core countries/cities/places surfaces, but still had silent API-mode mock fallback on critical views.
- Pulse was runtime-backed on list/detail, but had semantic/UI drift around canonical detail registration surfacing and query/filter handling.
- Main drift was semantic/presentation-level, not blocker-level backend absence.

## 4. Scope of this pass

- Atlas truthfulness cleanup on critical runtime-backed surfaces.
- Pulse canonical event detail realignment.
- Pulse query/filter semantics cleanup.
- Narrow UI/runtime alignment only.

## 5. What was changed

### Atlas
- Removed silent API-mode mock fallback in city overview.
- Removed silent API-mode mock fallback in country map context.
- Kept honest empty/error/degraded runtime states.

### Pulse
- Surfaced runtime registration CTA on canonical event detail.
- Aligned `theme` query handling in API mode.
- Reduced API/client quick-time filter semantic drift in API mode.

### Documentation
- Added this segment fixation note.

## 6. Files changed

- `apps/go2asia-pwa-shell/app/(public)/atlas/cities/[id]/page.tsx`
- `apps/go2asia-pwa-shell/modules/atlas/components/CountryMapTab.tsx`
- `apps/go2asia-pwa-shell/app/(public)/pulse/PulseClientWrapper.tsx`
- `apps/go2asia-pwa-shell/components/pulse/EventDetailsCanon.tsx`
- `docs/architecture/atlas/atlas_pulse_broader_ui_realignment_note_v1.md`

## 7. Verification summary

- typecheck passed
- lint passed
- build passed
- canonical Atlas/Pulse routes reviewed
- blocker-level issues not found before commit

## 8. Explicit non-goals / not touched

- no broad Atlas redesign
- no broad Pulse redesign
- no Space shell work
- no backend/domain reopening
- no RF/Rielt/Guru/Quest wave-2 reopening

## 9. Residual debt / explicitly deferred

- RF city link -> Atlas alignment
- Guru/Pulse slug-vs-id alignment
- generated vs manual content typing drift in SDK
- wider Atlas/Pulse IA and product-surface cleanup outside this pass

## 10. Final architectural meaning

After this segment, Atlas/Pulse became more truthful and closer to runtime behavior as platform content layers, without expanding scope into a new redesign cycle.
