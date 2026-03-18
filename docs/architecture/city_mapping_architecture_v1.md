# City Mapping Architecture V1

## Decision Status

- **Status:** accepted
- **Date:** 2026-03-18
- **Scope:** Pulse city normalization V1 в рамках текущего Atlas Geo SSOT baseline без отдельного geo-service, без graph database, без massive rewrite

## Problem

Текущая проблема носит системный характер:

- Atlas city canon в основном использует short-code style city slugs.
- Pulse city layer в основном использует human-readable city slugs.
- После завершения country normalization и Tier 1 city normalization остаётся `Tier 4 unresolved`: `149` rows / `59` distinct city buckets.
- Текущий `city_aliases` полезен, но недостаточен для unresolved хвоста.

Это архитектурная проблема согласования канонов между source-domain и canonical geo layer, а не просто локальная “грязь данных”.

## Architecture Options (short)

### Option A — Aggressive expansion of Atlas `city_aliases`

- Source of truth: Atlas canonical + aliases.
- Плюс: простой контур.
- Минус: alias слой перегружается domain-specific noise, слабая управляемость unresolved/manual-review.

### Option B — External mapping layer outside Atlas canon

- Source of truth: Atlas для канона, внешний mapping для резолва.
- Плюс: хорошая формализация mapping lifecycle.
- Минус: избыточная сложность для текущей фазы, риск раннего “псевдо geo-service”.

### Option C — Hybrid model

- Source of truth: Atlas остаётся canonical geo SSOT.
- Mapping: отдельный легковесный governed слой резолва source city -> canonical city.
- Плюс: закрывает mismatch без rewrite и без выделенного geo-service.
- Минус: требует дисциплины governance/versioning.

## Final Decision

Принят **Option C (Hybrid model)**.

Фиксация решения:

- Atlas остаётся владельцем canonical geo identity (`countries`, `cities`, `places`, `city_aliases`).
- Mapping слой вводится как governed normalization layer для source-domain city signals.
- Source-domain (Pulse и будущие домены) сохраняет ownership над source signal quality.
- Materialization в canonical refs выполняется только для resolved/high-confidence cases.
- Compatibility city slug сохраняется как secondary data.

## Architecture

### Ownership boundaries

- **Atlas-owned:** canonical geo entities и canonical hierarchy.
- **Mapping-owned:** resolution rules, mapping dictionary versions, outcome states, review outcomes.
- **Source-domain-owned:** source city signal (slug/text) и качество исходного ingestion.

### Canonical vs compatibility

- Canonical: `country_id`, `city_id` (и далее по необходимости `district_id`/`place_id`).
- Compatibility: `city_slug` и другие source geo strings.

### Outcome model

Каждый кейс city normalization должен иметь outcome:

- `resolved`
- `unresolved`
- `manual_review`

## Data Flow

### Ingest time

- При входе source city signal проверяется через mapping layer и Atlas canon.
- Если есть reliable match -> формируется candidate canonical city ref.
- Если reliable match нет -> кейс уходит в unresolved/manual-review queue.

### Normalization time

- Выполняется controlled tiered normalization.
- В write scope попадают только заранее одобренные tiers (например Tier 1).

### Read time

- Canonical-first: использовать `city_id`, если заполнен.
- Compatibility fallback: использовать `city_slug` там, где canonical city еще не materialized.

### Backfill time

- Только batch-driven и checkpoint-driven.
- Для каждого батча: preview, validation, rollback manifest, stop conditions.

### Unresolved/manual-review handling

- Unresolved cases группируются в bucket-уровне (`country_id + city_slug`).
- Обрабатываются через mapping governance цикл, а не ad-hoc изменениями канона.

## Rules (MUST / MUST NOT / MAY)

### MUST

- Downstream домены MUST использовать Atlas canonical refs как geo identity baseline.
- City normalization MUST быть outcome-driven (`resolved/unresolved/manual_review`).
- Backfill MUST быть tiered, batch-based, rollback-ready.
- Materialization MUST выполняться только для approved reliable tiers.

### MUST NOT

- MUST NOT превращать V1 в отдельный geo-service.
- MUST NOT внедрять graph database.
- MUST NOT делать massive rewrite Atlas.
- MUST NOT мутировать Atlas canon напрямую из unresolved source noise.
- MUST NOT расширять write scope за пределы explicitly approved tier.

### MAY

- MAY хранить `city_slug` как secondary compatibility поле.
- MAY выполнять phased normalization для новых доменов по той же модели.
- MAY расширять canonical aliases в Atlas только через governance-процесс.

## Migration Path

Точка старта (текущее состояние):

- Pulse country normalization complete.
- Pulse city Tier 1 normalization complete.
- Tier 4 unresolved остаётся (`149` rows / `59` buckets).

Дальнейший путь:

1. Зафиксировать hybrid governance как operational baseline.
2. Поддерживать unresolved bucket queue как отдельный управляемый backlog.
3. Поднимать следующие write-кандидаты только через узкие tier-specific checkpoints.
4. Не смешивать unresolved cleanup с broad enforcement rollout.

## Relation to roadmap

### Step 8

- Решение поддерживает Step 8 за счёт canonical geo consistency без broad rewrite.

### Step 9

- Улучшает качество city-level сигналов для Guru aggregation через controlled materialization.

### Step 11

- Готовит bridge к future Geo Layer без преждевременного выделения geo-service.

### KG MVP

- Даёт graph-ready city anchoring через canonical refs и outcome-governed normalization.
- Не превращает платформу в отдельный graph проект.

## Risks if not followed

- Рост cross-domain geo drift между source-domain payloads и canonical Atlas IDs.
- Повторное накопление unresolved city debt в новых доменах.
- Низкая предсказуемость city-level aggregation в Guru.
- Повышение стоимости поздней нормализации и риск painful rewrite на следующих этапах.
- Потеря управляемости между compatibility и canonical data layers.

## Non-goals

- No separate geo-service now.
- No graph database.
- No full ontology redesign.
- No massive Atlas rewrite.
- No forced normalization для кейсов без reliable source signal.
