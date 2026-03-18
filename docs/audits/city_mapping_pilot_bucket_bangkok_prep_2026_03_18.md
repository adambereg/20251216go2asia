# City Mapping V1 Pilot Prep — Bucket `bangkok` (2026-03-18)

## Purpose

Подготовить один безопасный pilot path для `Tier 4` bucket `bangkok` в рамках batch-first City Mapping V1.

Это документ подготовки.
Никакие write-операции по этому pilot в рамках данного шага не выполнялись.

## Current Bucket Snapshot

- source domain: `pulse`
- source scope: `events.city_slug`
- `country_id`: `th`
- `source_city_slug`: `bangkok`
- unresolved rows: `14`
- current resolved signal: отсутствует (`no scoped atlas signal` в текущем состоянии)

## Required Review Decision Before Any Pilot Write

1. Подтвердить canonical target city id для `th + bangkok` (expected candidate: `bkk`).
2. Зафиксировать решение в review queue со статусом `approved_for_pilot`.
3. Добавить promoted rule в active rules seed/version set.

Без этих трех шагов pilot write не допускается.

## Pilot Batch Shape (design-only)

- scope: только rows где:
  - `events.country_id = 'th'`
  - `events.city_slug = 'bangkok'`
  - `events.city_id IS NULL`
- candidate target: `bkk` (после review approval)
- batch size: `5` (консервативно)
- expected total rows: `14` (3 batches: `5 + 5 + 4`)
- read-only preview status:
  - `activeRulePresent = false`
  - `reviewDecisionRequired = true`

Previewed batch manifest (read-only, no writes):

- batch 1 (5):
  - `th-2026-asalha-bucha`
  - `th-2026-bangkok-design-week`
  - `th-2026-bangkok-international-festival-of-dance-and-music`
  - `th-2026-bangkok-international-film-festival`
  - `th-2026-bangkok-marathon`
- batch 2 (5):
  - `th-2026-bangkok-oktoberfest`
  - `th-2026-bangkok-pride`
  - `th-2026-chakri-memorial-day`
  - `th-2026-loy-krathong`
  - `th-2026-makha-bucha`
- batch 3 (4):
  - `th-2026-new-year-celebrations`
  - `th-2026-queens-birthday-mothers-day`
  - `th-2026-songkran-festival`
  - `th-2026-visakha-bucha`

## Required Validation Per Pilot Batch

1. `planned == changed`
2. `events.city_id -> cities.id` broken FK = `0`
3. `remaining rows for (th,bangkok)` уменьшается монотонно

## Rollback Shape

Пер-batch rollback manifest:

- batch_no
- ids[]
- previous_city_id (expected `null`)
- target_city_id (`bkk`)
- timestamp

Rollback rule:

- откат только текущего batch по manifest ids;
- при mismatch/FK anomaly batch pipeline немедленно останавливается.

## Out of Scope

- no broad unresolved rollout
- no other city buckets
- no schema changes
- no guardrail rollout
- no runtime/public API changes
