# Go2Asia Atlas Geo Canon Conformance Report v1

Status: conformance report (analysis only)  
Date: 2026-03-24  
Scope: Atlas conformance against Geo Canon v1 (foundation layer)

## 1. Purpose

Этот документ оценивает соответствие текущего Atlas слою `Geo_Canon_v1.md` как foundation Geo Layer.

Зачем это нужно сейчас:

- вернуть sequencing в правильную ось: Atlas first -> Pulse second -> downstream adoption;
- не продолжать correction flow вслепую без проверки канонической базы;
- отделить conformance truth от correction execution.

Это не correction plan, не write-run и не migration artifact.

## 2. Canon Baseline Used

Базовый канон:

- `docs/architecture/Geo_Canon_v1.md`

Как трактуется канон в этом отчете:

- Geo Canon v1 = target contract;
- текущий live Atlas = subject of conformance evaluation;
- `Draft for SSOT discussion` в каноне означает, что это целевая норма, а не доказательство текущей полной реализации.

## 3. Evidence Base

Использованные источники:

- `docs/architecture/Geo_Canon_v1.md`
- `docs/plans/go2asia_atlas_pulse_blog_live_data_audit_v1.md`
- `docs/plans/go2asia_wave_a_neon_ontology_subset_v1.md`
- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_wave_a_execution_queue_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`
- `packages/db/src/schema/content.ts`
- `packages/db/src/queries/content.ts`
- `packages/db/src/queries/cityMapping.ts`
- `packages/db/src/importPulseEventsFromMarkdown.ts`
- `packages/db/migrations/0000_dapper_hercules.sql`
- `packages/db/migrations/0001_third_lionheart.sql`
- `packages/db/migrations/0003_foamy_bullseye.sql`
- `packages/db/migrations/0004_atlas_city_dedup_and_names.sql`
- `packages/db/migrations/0004_place_kind_fields.sql`
- `packages/db/migrations/0005_atlas_city_filters.sql`
- `packages/db/migrations/0021_atlas_place_foundation_links.sql`

Live context in scope:

- использован ранее зафиксированный read-only live evidence из `...live_data_audit_v1.md`;
- новых live write/read-write действий в рамках этого отчета не выполнялось.

Таблицы Atlas-слоя, на которые опирается вывод:

- `countries`
- `cities`
- `city_aliases`
- `places`
- (доп. context) `content_blocks`, `media_files`

## 4. Atlas Conformance by Canonical Layer

### 4.1 Country

**What the canon requires**

- country как first-class entity с stable `id`, stable `slug`, координатами и metadata-слоем (`canonical_status`, etc.).

**What current Atlas has**

- `countries` table с `id`, `slug`, `name`, `code`, timestamps;
- live row count `8`, duplicate slug не выявлены;
- referential role подтверждена (`cities.country_id` целостен).

**Conformance status:** `partially conforms`

**Evidence**

- `content.ts`: `countries` schema;
- live audit: `countries` stable reference layer;
- migrations: базовая таблица и FK-lineage.

**Why it matters**

- базовый country-layer operationally stable;
- но canon-level metadata/coords fields в явном виде отсутствуют, значит слой не fully canonical.

### 4.2 City

**What the canon requires**

- city как first-class entity: stable `id`, `country_id`, stable `slug`, координаты, aliases/alt names допустимы, display text не источник истины.

**What current Atlas has**

- `cities` с `id`, `country_id`, `slug`, `name`, `names`, `lat/lng` (+ legacy `latitude/longitude`);
- `city_aliases` table для routing compatibility;
- live: `110` rows, `broken_cities_country_fk=0`, `has_new_latlng=110`.

**Conformance status:** `conforms` (operationally), с оговоркой metadata-gap

**Evidence**

- `content.ts`: `cities`, `cityAliases`;
- migration `0003` + `0004_atlas_city_dedup_and_names`;
- query layer `getCityByIdOrSlug` учитывает alias fallback.

**Why it matters**

- city-layer уже способен работать как canonical geo bucket для downstream reference;
- это один из strongest Atlas conformance blocks.

### 4.3 District

**What the canon requires**

- district как first-class canonical entity (`id`, `country_id`, `city_id`, `slug`, coords), особенно для intra-city precision use cases.

**What current Atlas has**

- отдельной таблицы/сущности `districts` в schema/migrations не подтверждено;
- `district_id` в Atlas `places` schema отсутствует;
- формального district-layer contract в DB-layer нет.

**Conformance status:** `does not yet conform`

**Evidence**

- schema/migrations search: district-entities absent;
- `places` содержит `country_id`, `city_id`, но не `district_id`.

**Why it matters**

- это ключевой canonical gap для Rielt/RF/Guru/Quest scenarios, где neighborhood precision важна;
- без district layer Atlas остается bridge-compatible, но не full Geo Canon compliant.

### 4.4 Place

**What the canon requires**

- place как concrete geo-linked object со stable `id/slug`, required `country_id`, city linkage, district linkage where relevant, координаты для map/nearby.

**What current Atlas has**

- `places` table с stable `id`, unique `slug`, `country_id`, `city_id`, `lat/lng` (+ legacy coordinates), place taxonomy fields;
- live: `477` rows, broken refs/mismatch не выявлены;
- live: `457/477` с `lat/lng`, то есть 20 gaps.

**Conformance status:** `partially conforms`

**Evidence**

- `content.ts`: `places` schema;
- live audit: integrity strong, 20 coord gaps;
- migration lineage: place-kind/links hardening присутствует.

**Why it matters**

- place layer уже usable для большинства Atlas surfaces и связей;
- но coord completeness и отсутствие district reference не позволяют считать слой fully canonical.

### 4.5 Coordinates Policy

**What the canon requires**

- координаты обязательны по слоям (особенно place-level для map/nearby);
- missing coords = tracked enrichment debt, не silent guess.

**What current Atlas has**

- city coords operationally complete (`110/110`);
- place coords mostly present (`457/477`);
- legacy + new coordinate columns coexist (dual model, но new dominates).

**Conformance status:** `bridge-compatible only`

**Evidence**

- live audit counts;
- `content.ts`: dual columns with explicit legacy deprecation note.

**Why it matters**

- Atlas координатно уже operationally sufficient для значимой части use cases;
- но 20 missing place coords и dual-model coexistence удерживают слой в bridge-compatible режиме.

### 4.6 ID / Slug / Text Policy

**What the canon requires**

- stable IDs как primary identity;
- slug для routing, но не как единственный key;
- display text не source of truth.

**What current Atlas has**

- stable IDs across country/city/place;
- unique slugs на ключевых Atlas таблицах;
- city alias layer для routing compatibility;
- query layer использует id-or-slug resolution; joins опираются на IDs/FKs.

**Conformance status:** `conforms`

**Evidence**

- schema constraints (`primaryKey`, `unique`, FKs);
- `content.ts` query patterns (`getCityIdByIdOrSlug`, ID+slug support).

**Why it matters**

- это снижает риск slug-only identity drift и делает Atlas пригодным как reference contract для downstream.

### 4.7 Atlas as Geo SoT Readiness

**What the canon requires**

- Atlas должен быть authoritative geo identity layer для экосистемы.

**What current Atlas has**

- сильный country/city/place reference graph;
- alias-capable city routing;
- operational query access для id/slug resolution;
- но district canonical layer absent и coords completeness incomplete.

**Conformance status:** `partially conforms`

**Evidence**

- live audit + schema + queries + status anchor (`atlas` как mixed/unresolved в dedicated-app allocation, но strong domain docs).

**Why it matters**

- Atlas уже достаточен как practical Geo SoT в bridge-mode;
- до full canonical Geo Layer не хватает district + targeted coord enrichment + metadata hardening.

## 5. Atlas Downstream Readiness Implications

### Pulse

- Atlas уже достаточен как base country/city/place reference layer;
- но Pulse full canonical geo state блокируется не Atlas integrity, а event-level alignment (city/district/place completeness).

### Rielt

- без district layer Atlas не дает full canonical precision, которую Geo Canon ожидает для listings;
- текущий Atlas пригоден как bridge base (`country_id/city_id` + place links), но не как final precision layer.

### RF

- партнерские location flows могут опираться на country/city/place bridge;
- отсутствие district canonical layer ограничивает full conformance для multi-location precision.

### Space

- city/place linking Atlas already supports;
- district-level social geo precision пока ограничена.

### Guru

- aggregation может работать на текущем place/city coords;
- missing district layer + partial place coord gaps ухудшают potential nearby ranking quality.

### Quest

- Atlas country/city/place foundation usable для базовых target refs;
- для geo-checkpoint/precision сценариев district-layer gap остается material.

## 6. Most Important Conformance Gaps

1. Отсутствие district как first-class canonical layer (ключевой gap к Geo Canon v1).
2. Неполная place coordinate completeness (`20` rows without `lat/lng`).
3. Atlas metadata-layer не соответствует canon-level минимуму (`canonical_status`, `source_type`, `trust/freshness` на core geo entities не подтверждены в schema).
4. Place-level canonical contract в текущем Atlas не включает `district_id` даже как nullable enrichment seam.
5. Atlas находится в `bridge-compatible / partial` состоянии, а не в full canonical state.

## 7. Wave A Interpretation

### Что реально блокирует Wave A

- для Atlas-first surfaces: material блокер = только high-impact subset missing place coordinates;
- для downstream precision-heavy use cases: district layer gap не закрыт.

### Что можно оставить как bridge-debt на один цикл

- отсутствие полного district rollout (при явной фиксации как debt);
- metadata hardening (`canonical_status/source_type/...`) как staged alignment;
- dual coord columns при сохранении `lat/lng` как operational truth.

### Что не должно останавливать весь проект сейчас

- отсутствие полного canonical district coverage во всех модулях;
- отсутствие тотальной schema migration под идеальную Geo Canon форму;
- полная унификация всех исторических geo traces в один проход.

## 8. Recommended Next Handoff

Рекомендуемый следующий шаг:

1. Подготовить отдельный `Atlas Canon Alignment Plan` (не execution), сфокусированный только на Atlas gaps:
   - district-layer decision (introduce now vs staged bridge-debt with explicit timeline);
   - high-impact place coordinates completion subset;
   - metadata layer alignment policy for geo entities.
2. Провести human review отчета и принять явное решение по district strategy.
3. Только после этого возвращаться к Pulse correction sequencing, уже на подтвержденной Atlas conformance-базе.

## 9. Non-Goals Confirmation

Этот документ:

- не запускает correction;
- не содержит SQL patch/migration;
- не выполняет write operations;
- не является полным аудитом всех downstream модулей.

## 10. Files Used

- `docs/architecture/Geo_Canon_v1.md`
- `docs/plans/go2asia_atlas_pulse_blog_live_data_audit_v1.md`
- `docs/plans/go2asia_wave_a_neon_ontology_subset_v1.md`
- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_wave_a_execution_queue_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`
- `packages/db/src/schema/content.ts`
- `packages/db/src/queries/content.ts`
- `packages/db/src/queries/cityMapping.ts`
- `packages/db/src/importPulseEventsFromMarkdown.ts`
- `packages/db/migrations/0000_dapper_hercules.sql`
- `packages/db/migrations/0001_third_lionheart.sql`
- `packages/db/migrations/0003_foamy_bullseye.sql`
- `packages/db/migrations/0004_atlas_city_dedup_and_names.sql`
- `packages/db/migrations/0004_place_kind_fields.sql`
- `packages/db/migrations/0005_atlas_city_filters.sql`
- `packages/db/migrations/0021_atlas_place_foundation_links.sql`
