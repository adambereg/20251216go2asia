# P0 Audit — Pulse Country Normalization Backfill (2026-03-18)

## Goal

Выполнить узкий write-шаг P0 для нормализации Pulse geography:
- заполнить только `events.country_id`;
- не выходить за пределы утвержденного scope.

## Approved Scope

- Target table/field: `events.country_id`
- Source: deterministic country dictionary (approved)
- Execution mode: controlled batches + validation after each batch

## Deterministic Country Dictionary

- `thailand -> th`
- `vietnam -> vn`
- `indonesia -> id`
- `malaysia -> my`
- `singapore -> sg`
- `philippines -> ph`
- `cambodia -> kh`
- `laos -> la`

## Before/After Counts

### Before
- `total_events`: `208`
- `events_no_country_id`: `208`
- `events_no_city_id`: `208`
- `events_no_country_slug`: `0`

### After
- `total_events`: `208`
- `events_no_country_id`: `0`
- `events_no_city_id`: `208`
- `events_no_country_slug`: `0`

## Batch Execution Summary

- Batch size: `20`
- Total batches: `15`
- Total planned rows: `208`
- Total changed rows: `208`
- Mismatch `planned vs changed`: `0`
- Stop condition incidents: `0`

By country:
- `th`: `36`
- `id`: `30`
- `vn`: `28`
- `ph`: `27`
- `my`: `26`
- `kh`: `24`
- `sg`: `23`
- `la`: `14`

## FK Validation Result

- FK check after each batch: passed
- Final broken FK count (`events.country_id -> countries.id`): `0`

## Rollback Manifest Note

Для каждого батча зафиксирован rollback manifest:
- batch number
- `country_slug`
- target `country_id`
- список `event.id` в батче
- `previousCountryId` (expected `null`)
- timestamp

Rollback strategy:
- батч-уровневый откат только по `ids` конкретного батча;
- при mismatch/incident дальнейшие батчи не выполняются.

## Residual Issues

- `events.city_id` остается пустым (`208/208`) — city normalization не выполнялся в этом шаге.
- Pulse city unresolved queue остается отдельным workstream.

## Explicit Out-of-Scope Confirmation

- `events.city_id` **not touched**
- Blog tables/fields **not touched**
- no schema changes
- no migrations
- no write guardrail enforcement
