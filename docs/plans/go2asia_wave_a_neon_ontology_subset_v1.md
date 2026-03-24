# Go2Asia Wave A Neon / Ontology Subset v1

Status: active Wave A subset spec  
Date: 2026-03-23  
Scope owner: Shared (User + Cursor)

## 1. Purpose

Этот документ фиксирует **минимально достаточный Neon/ontology subset для Wave A (WA-001)**.

Цель subset:

- не блокировать `Atlas`/`Pulse` refresh;
- дать опорную data-basis для первых живых поверхностей `Rielt`/`Space`;
- ограничить scope и не превратить Wave A в тотальную миграцию платформы.

Это не попытка построить финальную онтологию всей экосистемы и не план полной миграции БД.

## 2. Current Data Reality Relevant to Wave A

### 2.1 Что уже подтверждено в data layer

- В `packages/db/src/schema/content.ts` есть Atlas/Pulse база:
  - `countries`, `cities`, `places`,
  - `events`, `event_registrations`,
  - сопутствующие поля media/slug/geo.
- У `events` одновременно присутствуют:
  - slug/name geo-модель (`country_slug`, `city_slug`, `country_name`, `city_name`),
  - и FK поля (`country_id`, `city_id`) как optional.
- Импорт Pulse (`packages/db/src/importPulseEventsFromMarkdown.ts`) уже фиксирует slug-first discipline и допускает null FK.
- В `0021_atlas_place_foundation_links.sql` зафиксированы Atlas place links для `rielt_listing`/`rf_partner`.
- В `space.ts` есть repost target типы `place`/`event`, то есть Space уже зависит от минимальной geo/event связности.

### 2.2 Подтвержденные pain points

- Двойная модель geo-link для событий (slug и FK) повышает риск несогласованности.
- Legacy/MVP поля (координаты, даты) создают ambiguity при выборе операционного SSOT.
- `city_mapping_*` описаны в схеме TypeScript (`cityMapping.ts`), но SQL migration в `packages/db/migrations` не подтверждена.
- Полный historical backfill FK для всех Pulse событий и всех доменов в Wave A не реалистичен.

### 2.3 Что блокирует frontend/live refresh прямо сейчас

- Без ограниченного geo/event subset Atlas/Pulse refresh уходит в частично устаревшие или неполные связи.
- Без минимальной place/event ссылочной согласованности `Rielt`/`Space` остаются хрупкими для first live surface.
- Без четкой границы subset команда легко скатывается в giant migration.

## 3. Wave A Subset Boundary

### 3.1 Что входит в Wave A subset

#### A) Core geo identity and linkage

- `countries.id/slug/code`
- `cities.id/country_id/slug/names`
- `places.id/country_id/city_id/slug/place_kind`
- минимальные invariants country -> city -> place для Wave A потребителей

#### B) Pulse event geo readiness (минимальная)

- `events.id/slug`
- `events.country_slug/city_slug` как canonical public geo refs для import rows
- `events.country_id/city_id` как optional linkage, где данные доступны
- `events.start_at/end_at` как preferred schedule fields для Wave A usage
- согласованность event geo references достаточная для Atlas/Pulse surfaces

#### C) Cross-module reference readiness for first surfaces

- `rielt_listing.country_id/city_id` + optional `atlas_place_id/atlas_container_place_id`
- `space_post.repost_target_type/repost_target_id` для `place`/`event` сценариев
- минимальная referential готовность, чтобы `Rielt`/`Space` не зависели от выдуманных моков

#### D) Tooling/data flows in scope

- Pulse markdown import flow (`db:import:pulse-md`) как источник событийного baseline
- существующие atlas/pulse content exports/import scripts в `packages/db` в пределах практического subset
- проверочный query-layer seam, где уже признан slug/FK dual path (например guide/events filters)

### 3.2 Что не входит в Wave A subset

- глобальный принудительный FK backfill всех legacy событий/объектов;
- полная ликвидация всех legacy колонок в schema;
- полная city-mapping платформа с обязательным rollout по всем доменам;
- полная унификация geo-онтологии для RF/Quest/token и всех смежных контуров;
- полный redesign Atlas/Pulse domain model и years-scale data architecture.

## 4. Target Alignment for Wave A

### 4.1 Минимальный target state этой волны

- Atlas/Pulse работают на согласованном **минимальном geo/event baseline** без критических mismatch в ключевых полях.
- Для Wave A сценариев не возникает разрыва между:
  - event geo references,
  - place/city/country identity,
  - first live module usage (`Rielt`/`Space`).
- Команда имеет явные правила, какие поля/связи считаются operational truth в пределах Wave A.

### 4.2 Invariants (Wave A only)

1. `cities.country_id` всегда указывает на существующий `countries.id`.
2. Если у `places` заполнен `city_id`, то `country_id` не противоречит стране города.
3. Для Wave A event rows обязателен валидный geo reference минимум на slug-уровне (`country_slug`, при наличии `city_slug`).
4. Если у event заполнены `country_id/city_id`, они не должны конфликтовать с slug-level географией.
5. Для `rielt_listing`/`space_post` в first live flows reference на place/event должен указывать на существующий объект либо переводиться в честный pre-live fallback.

### 4.3 Reference rules (Wave A)

- Slug-level geo references в Pulse допустимы как operational bridge в этой волне.
- FK-level linkage расширяется только там, где это дает прямую пользу Atlas/Pulse/Rielt/Space Wave A surfaces.
- Любые «идеальные» cross-domain связи вне target-модулей Wave A считаются deferred.

## 5. Practical Implementation Slices

### Slice A — Schema/field alignment guardrail (no broad redesign)

- **Objective:** зафиксировать, какие поля/связи считаются обязательными для Wave A subset.
- **Why needed now:** без этого scope расползается в full schema cleanup.
- **Dependencies:** status anchor + Wave A queue + текущая schema reality.
- **Expected output:** agreed Wave A field/link matrix (must-have vs optional vs deferred).
- **Done when:** matrix принята и используется как граница WA-002/WA-004/WA-005/WA-008/WA-009.

### Slice B — Data mapping/backfill minimal pass

- **Objective:** закрыть только те mapping gaps, которые блокируют Atlas/Pulse refresh и first live `Rielt`/`Space`.
- **Why needed now:** снижает риск dead shells и fake content compensation.
- **Dependencies:** Slice A, user curated corrections.
- **Expected output:** minimal corrected dataset по target geo/event references.
- **Done when:** target Wave A surfaces не блокируются из-за базовых geo/event mismatch.

### Slice C — Import/export/tooling adjustment (narrow)

- **Objective:** зафиксировать и применить только необходимые правки в текущем import/export потоке.
- **Why needed now:** практический subset должен быть воспроизводимым, а не разовым ручным состоянием.
- **Dependencies:** Slice A/B.
- **Expected output:** подтвержденный narrow tooling path для Wave A data refresh.
- **Done when:** есть повторяемый путь подготовки данных без расширения в platform-wide migration.

### Slice D — Validation/check pass

- **Objective:** подтвердить, что subset реально пригоден для потребителей Wave A.
- **Why needed now:** исключает status inflation при неполной data readiness.
- **Dependencies:** Slice B/C.
- **Expected output:** короткий validation report по Atlas/Pulse/Rielt/Space readiness signals.
- **Done when:** критерии Wave A subset выполнены и зафиксированы перед module refresh tasks.

## 6. Consumer Impact

### Atlas

- получает более согласованную country/city/place основу для refresh;
- уменьшается drift между geo identity и отображаемыми объектами;
- не требует полного онтологического redesign в этой волне.

### Pulse

- получает практический bridge slug/FK без ложного требования global backfill;
- stabilises event geo references для frontend card/detail flows;
- снижает риск выпадения событий из связанного geo контекста.

### Rielt

- получает минимальную referential readiness к Atlas places;
- позволяет перейти к first live surface без моков при наличии pack.

### Space

- получает минимальную event/place ссылочную опору для repost/social seed flows;
- уменьшает риск fake activity компенсаций при честных pre-live/live состояниях.

### RF/Quest (что subset пока не дает)

- не дает полной domain-wide geo normalization;
- не закрывает их полный production data contour;
- оставляет их глубинные geo/data улучшения вне WA-001 scope.

## 7. Explicit Non-Goals

- не выполняется глобальный «one-shot» Neon migration по всем доменам;
- не удаляются массово все legacy поля в одной волне;
- не строится финальная универсальная geo ontology для всей платформы;
- не закрываются все исторические slug/id конфликты;
- не выполняется полный data hardening для RF/Quest/token;
- не подменяется WA-001 на новый master plan или долгосрочную архитектурную программу.

## 8. Risks and Safeguards

### 8.1 Основные риски

- subset может незаметно превратиться в giant migration;
- точечные правки могут сломать текущие import paths;
- frontend задачи могут уйти вперед data truth;
- команда может начать решать «все geo-проблемы сразу».

### 8.2 Safeguards

- scope lock: любые изменения вне раздела 3.1 считаются out-of-scope без явного re-baseline;
- no silent expansion: новые доменные требования фиксируются как deferred, не включаются автоматически;
- consumer-first validation: каждый шаг проверяется по impact на Atlas/Pulse/Rielt/Space;
- compatibility-first: legacy coexistence допускается, если она не ломает Wave A цели;
- evidence gate: переход к WA-002 и module refresh только после принятого subset definition.

## 9. Recommended Next Handoff

### Next task after WA-001

- **WA-002 — User curated data corrections (Atlas/Pulse-sensitive).**

### Что должен подготовить пользователь

- curated corrections/input pack для Atlas/Pulse geo/event данных;
- список приоритетных проблемных country/city/place/event связей для Wave A;
- подтверждение минимального content/data набора, который считается достаточным для refresh.

### Что сможет сделать Cursor после утверждения subset

- выполнить WA-002 integration-ready validation входных данных;
- перейти к WA-004/WA-005 (Atlas/Pulse refresh) без расширения scope;
- использовать subset как строгую границу для WA-006/WA-007/WA-008/WA-009.

## 10. Files Used

- `docs/plans/go2asia_wave_a_execution_queue_v1.md`
- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`
- `docs/plans/go2asia_actual_state_reconciliation_v1.md`
- `docs/architecture/atlas/atlas_neon_maturity_gate_note_v1.md`
- `docs/architecture/atlas/atlas_geo_place_foundation_pass_v1.md`
- `docs/architecture/atlas/atlas_domain_model_v1.md`
- `docs/architecture/pulse/pulse_domain_model_v1.md`
- `docs/backend/content_service/overview.md`
- `packages/db/src/schema/content.ts`
- `packages/db/src/schema/cityMapping.ts`
- `packages/db/src/schema/rielt.ts`
- `packages/db/src/schema/space.ts`
- `packages/db/src/importPulseEventsFromMarkdown.ts`
- `packages/db/migrations/0021_atlas_place_foundation_links.sql`
- `packages/db/migrations/meta/_journal.json`
- `packages/db/package.json`
