# Guru Frontend Live Adoption Milestone Note v1

## 1. Purpose

This note records the completion baseline of Guru frontend wave 1.
It fixes what is now live in the user-facing discovery layer and what remains intentionally deferred.
It is a milestone fixation note, not a roadmap for the next implementation cycle.

## 2. Current Guru frontend state

Guru now has a live frontend contour centered on the public `/guru` module:
- live nearby aggregation is surfaced through current runtime;
- live what-to-do aggregation is surfaced through current runtime;
- source-aware UI signals are surfaced at both summary and card levels;
- partial/degraded runtime states are surfaced without masking.

The current UI remains intentionally bounded:
- no broad map/search/filter redesign;
- no deep per-source UX specialization;
- no expansion into deferred source domains.

## 3. What wave 1 actually delivered

- Nearby is surfaced as a live runtime-driven discovery surface.
- What-to-do is surfaced as a separate live runtime-driven surface.
- Source-aware rendering is present (`active/stub` source summary and source domain hints).
- Partial/degraded truth is surfaced (`partial_failures`, API error states).
- Mock fallback masking is removed from the primary runtime path.
- Semantic honesty is preserved: what-to-do is not represented as equivalent to strong nearby semantics.

## 4. What remains intentionally out of scope

- Broader search/filter redesign and advanced query UX.
- Richer map interaction model and map-first product reshaping.
- New source expansion beyond current live/stub boundaries.
- Space/blog integration as live Guru frontend source surfaces.
- Personalization/AI recommendation layer.
- Guru wave 2 hardening or deeper explainability UX.

## 5. Milestone verdict

Guru frontend is now a meaningful first live discovery baseline with controlled residual debt.

## 6. What this note does not claim

This note does not claim that:
- Guru frontend is fully complete;
- all discovery semantics are equally strong across all sources;
- all future or deferred sources are already live;
- Guru wave 2 is unnecessary.

## 7. Implication for sequencing

Guru wave 1 can be treated as complete for the current frontend sequencing baseline.
The next frontend segment may move to Quest.
A later Guru wave 2 can return intentionally, with explicit scope, rather than implicitly.
