# P0 Audit — Pulse City Tier 1 Normalization Backfill (2026-03-18)

## Goal

Выполнить узкий и контролируемый city backfill только для `Tier 1` после завершения country normalization:

- заполнить только `events.city_id`;
- обновлять только строки с подтвержденным scoped match (`country_id + city_slug`);
- не выходить за пределы утвержденного scope.

## Approved Scope

- Target table/field: `events.city_id`
- Scope: только `Tier 1` rows (`59`)
- Batch strategy: by `city_slug`, small batches
- Validation: после каждого batch

## Tier 1 Definition Used

Строки `events`, где:

- `city_id IS NULL`
- `country_id IS NOT NULL`
- `city_slug` задан
- есть scoped canonical candidate через:
  - `cities.slug` в рамках `country_id`, или
  - `city_aliases.alias_slug` в рамках `country_id`

## Before/After Counts

### Before
- `total_events`: `208`
- `city_id_null`: `208`
- `city_id_filled`: `0`
- `country_id_null`: `0`
- `tier1_rows_planned`: `59`

### After
- `total_events`: `208`
- `city_id_null`: `149`
- `city_id_filled`: `59`
- `country_id_null`: `0`
- `tier1_remaining`: `0`

## Batch Execution Summary

- Batch size: `10`
- Total batches: `14`
- Total planned rows: `59`
- Total changed rows: `59`
- Mismatch `planned vs changed`: `0`
- Stop condition incidents: `0`

Grouped execution targets:
- `singapore -> sin`: `23`
- `kuala-lumpur -> kul`: `13`
- `phuket -> hkt`: `9`
- `bali -> bali`: `4`
- `ubud -> ubud`: `3`
- `boracay -> boracay`: `2`
- `lombok -> lom`: `1`
- `yogyakarta -> jog`: `1`
- `penang -> png`: `1`
- `koh-samui -> usm`: `1`
- `hue -> hue`: `1`

## Validation Results

Per batch validation rules:
- `planned == changed`
- FK integrity (`events.city_id -> cities.id`) broken rows = `0`
- `city_id IS NULL` count monotonically decreases

Final validation:
- FK broken count: `0`
- Tier 1 residual: `0`
- Tier 4-like unresolved residual: `149`

## Rollback Manifest Note

Для каждого batch зафиксирован rollback manifest:
- batch number
- `country_id`
- `city_slug`
- `candidate_city_id`
- exact `event.id[]`
- `previous_city_id` (expected `null`)
- timestamp

Rollback strategy:
- batch-level rollback only by manifest IDs;
- immediate stop on mismatch/FK anomaly.

## Residual Issues

- `149` rows остаются unresolved (`Tier 4-like`) и не входили в этот шаг.
- Tier 4 требует отдельного mapping/review процесса.

## Explicit Out-of-Scope Confirmation

- no changes to `events.country_id`
- Blog tables/fields not touched
- no schema changes
- no migrations
- no write guardrail enforcement
- no Tier 4 writes
