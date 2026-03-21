# Guru Semantic Policy and Pulse Acceptance v1

## 1. Purpose

This note defines an explicit semantic policy for the current Guru runtime baseline and a minimal acceptance gate for a future `pulse` live integration pass.
It documents what Guru currently means by nearby/usefulness across live sources and prevents fake confidence during the next expansion step.

## 2. Current Guru semantic state

Current live sources:
- `rielt`
- `rf`
- `quest`
- `atlas`

Current stub/deferred sources:
- `pulse`
- `space`
- `blog`

Current blended response model:
- fan-out to domain adapters
- normalized `EntityCard[]`
- deterministic rank + filter pipeline
- source transparency via `sources_active`, `sources_stub`, `source_item_counts`
- graceful degradation via `partial_failures`

Current semantic classes are already mixed (true nearby, derived geo, list/city usefulness), which is acceptable only with explicit policy boundaries.

## 3. Source semantic classes

| Source | Semantic class | Practical note |
|---|---|---|
| `rielt` | true/strong geo-nearby | Upstream nearby contour is spatial-first and the strongest nearby signal in Guru baseline. |
| `atlas` | derived/conditional geo | Place list/read contour; distance may be derived from valid place coordinates, not guaranteed distance-first upstream. |
| `rf` | utility/list source | Useful partner utility signal; not a true nearby engine. |
| `quest` | city/list usefulness source | Activity/usefulness value; not a true nearby engine. |
| `pulse` (candidate) | event/usefulness source | Not live yet; must pass acceptance criteria below before integration. |
| `space`, `blog` (deferred) | non-geo contextual sources | Deferred; no live nearby contract in current Guru baseline. |

## 4. Honest nearby policy

- Guru may call a source **true nearby** only when source data is spatially constrained by real geo semantics (not only list retrieval).
- Guru may use **derived distance** only when entity coordinates are valid and distance calculation is explicit and deterministic.
- Guru must not present list/city/utility sources as if they were spatially equivalent to strong nearby sources.
- Missing or weak geo signals must be handled honestly:
  - do not synthesize fake distance;
  - do not silently imply precision that source does not provide;
  - prefer exclusion or explicit weaker interpretation over fabricated geo confidence.

## 5. What-to-do / time-usefulness policy

- `what-to-do` is a usefulness composition surface, not a claim of autonomous recommendation intelligence.
- Event/activity semantics are allowed only when supported by real source fields and deterministic rules.
- Time-aware labels (for example, "happening now" / "starting soon") must not be inferred without concrete time signals.
- Guru must keep explainability bounded to source-backed signals; no imitation of hidden intelligence.

## 6. Pulse acceptance criteria

`Pulse next` is accepted only if all criteria below are met:

1. One explicit read contour is selected as source-of-truth for Guru Pulse cards (no mixed implicit contours).
2. Event cards have minimum required fields for honest integration: stable id, title, source identity, and valid geo/time fields used by Guru semantics.
3. Geo semantics are explicit and honest (true nearby vs derived/city-scoped); no fake precision.
4. Time semantics used by Guru are source-backed and deterministic (no decorative time-intelligence claims).
5. Source transparency and graceful degradation remain intact (`sources_active/stub`, `source_item_counts`, `partial_failures`).
6. Integration remains targeted: adapter + normalization + tests, without ranking/envelope redesign.

## 7. Non-goals

This note does not:
- start a Guru redesign cycle;
- auto-approve Pulse implementation;
- claim all live sources are equally strong nearby;
- replace a dedicated implementation pass and validation run.

## 8. Implication for next step

A `Pulse next` pass is allowed only if the criteria in Section 6 are explicitly satisfied.
The implementation must remain targeted and honest, preserving current Guru boundaries and controlled expansion discipline.
