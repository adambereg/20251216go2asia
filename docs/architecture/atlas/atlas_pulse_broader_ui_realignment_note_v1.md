# Atlas/Pulse Broader UI Realignment Note v1

## 1. Purpose

This note records a controlled Atlas/Pulse broader UI realignment pass after practical, discovery, and engagement wave-1 frontend adoption.
It fixes drift against current runtime truth without reopening backend cycles or launching broad redesign work.

## 2. Segment strategy

This pass follows a staged combined approach with Atlas-first priority:
- Atlas-first for place-truth consistency and mock-fallback removal in core Atlas views;
- Pulse second for runtime-backed event UX honesty and cross-entry consistency.

Reasoning:
- Atlas remains the reference layer for place semantics;
- Pulse event UX depends on consistent Atlas/content truth and stable runtime filtering semantics.

## 3. Must-fix executed

- Atlas city overview no longer silently mixes API mode with mock fallback data.
- Atlas country map tab no longer silently falls back to mock country data in API mode.
- Pulse event detail canonical page now surfaces runtime-backed registration CTA.
- Pulse list page now accepts `theme` URL input as search fallback and avoids double time filtering mismatch in API mode.

## 4. Explicitly deferred

- Broad Atlas route/tree redesign.
- Full Pulse UX redesign across calendar/list/detail interaction model.
- RF/Rielt/Guru/Quest wave-2 expansions.
- Space-facing shell work.
- Backend contract/model refactoring or new runtime workstreams.
- Full generated-vs-manual SDK contract unification across content/pulse in this segment.

## 5. Residual risks

- Some cross-domain link semantics (especially non-canonical event links from non-Pulse modules) remain dependent on existing upstream IDs/deeplinks.
- Atlas/Pulse still carries legacy surface depth that should be addressed only in later explicitly scoped passes.

## 6. Segment verdict

Completed with minor residual debt.
