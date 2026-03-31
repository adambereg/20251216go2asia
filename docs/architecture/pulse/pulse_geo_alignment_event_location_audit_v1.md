# Pulse Geo Alignment / Event Location Audit v1

## Purpose

Зафиксировать текущее состояние Pulse event geography относительно уже принятого Atlas geo canon и RF boundary model, чтобы:

- отделить текущую runtime/document reality от target-aligned интерпретации;
- явно разделить place-bound, area-bound и city-wide/diffuse event semantics;
- зафиксировать, где RF уместен только как optional business context;
- выявить реальные drift risks и неоднозначности без implementation/redesign scope.

## Audit baseline

Опорные документы:

- `docs/architecture/geo/geo_canon_milestone_2026_q1.md`
- `docs/architecture/geo/geo_canon_v1.md`
- `docs/architecture/geo/geo_layer_dependency_map_v1.md`
- `docs/architecture/rf/rf_domain_model_v1.md`
- `docs/architecture/rf/rf_boundary_and_ownership_v1.md`
- `docs/architecture/rf/rf_dependency_map_v1.md`
- `docs/architecture/Cross-Domain-Architecture-Note-v1.md`
- `docs/architecture/pulse/pulse_domain_model_v1.md`
- `docs/architecture/pulse/pulse_dependency_map_v1.md`
- `docs/architecture/pulse/pulse_backend_architecture_v1.md`
- `docs/backend/pulse_service/overview.md`
- `docs/backend/pulse_service/data_model.md`
- `docs/backend/pulse_service/validation_rules.md`
- `docs/openapi/content.yaml`
- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`

Code/contract evidence:

- `apps/content-service/src/index.ts`
- `packages/db/src/schema/content.ts`
- `packages/db/src/queries/content.ts`
- `packages/db/src/queries/guides.ts`
- `packages/db/src/importPulseEventsFromMarkdown.ts`
- `packages/db/src/prepareCityMappingPilot.ts`
- `apps/guru-service/src/adapters/pulseAdapter.ts`
- `apps/guru-service/src/normalize/entityCard.ts`
- `packages/db/migrations/0002_cynical_hedge_knight.sql`

## Current Pulse event geography reality

- Pulse runtime surface событий сейчас фактически живёт через `content-service` (`/v1/content/events`), отдельный `apps/pulse-service` в текущем контуре не подтверждён.
- В storage у событий есть смешанный набор geo-полей:
  - канонические FK: `country_id`, `city_id` (optional),
  - публичные идентификаторы/лейблы: `country_slug`, `city_slug`, `country_name`, `city_name`, `location`,
  - координаты: `lat`/`lng` и legacy `latitude`/`longitude`,
  - scope-поле: `geo_scope`.
- У события нет first-class ссылок на `place/container/district` (`place_id`, `host_place_id`, `district_id` отсутствуют в фактической схеме).
- Публичный DTO событий не возвращает часть geo-семантики из storage (`geo_scope`, типовые geo-поля высокого уровня), и клиент видит упрощённую модель.
- Filtering/query semantics для `/v1/content/events` в runtime богаче, чем в OpenAPI: в коде есть `country/city/category/date/price/verified/search/page/offset`, а спецификация описывает только `limit`.

## Event geography classes

По текущим документам и runtime картине:

- **A. Place-bound events**  
  Документально ожидаются как корректный класс (через canonical place/host references), но в текущем runtime contract нет first-class `atlas_place_id`/container refs на event.

- **B. Area-bound events**  
  Документально допускаются через district/area semantics (geo canon), фактически в текущем event runtime представлены скорее через `geo_scope` и текстовые поля, без отдельного district ref.

- **C. City-wide / diffuse events**  
  Документально явно легитимны (cross-domain spatial scope model), и их нельзя насильно привязывать к фиктивному place.  
  Фактически в runtime это частично поддерживается через city/country + `geo_scope`, но consumer surfaces (включая часть downstream адаптеров) склоняются к точке (`lat/lng`) и могут отбрасывать «diffuse» случаи.

## Pulse vs Atlas boundary

- Atlas остаётся canonical geo SSOT (`country/city/district/container/place` identity), Pulse не должен владеть geo identity.
- Pulse должен отвечать за event truth и ссылаться на Atlas geo anchors там, где событие реально локализуемо.
- В текущем runtime наблюдается промежуточная mixed-model реальность: slug/name/text + optional FK, без полного canonical anchor discipline на уровне event contract.
- Это не означает, что Pulse должен насильно требовать `place_id` для любого события; для city-wide/diffuse сценариев это было бы ложной гео-привязкой и нарушением семантики события.

## Pulse vs RF boundary

- RF для Pulse — **optional business/partner context layer**, а не обязательный слой для каждого события.
- Сценарии, где RF уместен:
  - partner-hosted/business-linked event context,
  - offer/voucher adjacency context (без передачи event ownership).
- Сценарии, где RF не нужен:
  - обычные публичные/городские/темпоральные события без partner actor binding.
- Риск drift: моделировать в Pulse собственную partner/business identity вместо ссылки на RF (или смешивать «географию события» и «бизнес-актора события» в одно поле).

## Current gaps / ambiguities

- OpenAPI/runtime mismatch у `/v1/content/events` query contract (документировано меньше, чем реально поддерживается).
- Отсутствие явно machine-readable event location class в публичном контракте (`place` vs `area` vs `city` vs `distributed`), хотя в cross-domain docs это уже концептуально есть.
- Отсутствие first-class place/container/district refs в текущей event модели при наличии более богатой geo-онтологии в Atlas.
- Смешение id-пространств (slug/id) в фильтрации и маппингах событий повышает риск нестрогой интерпретации geo anchor.
- Часть downstream-консьюмеров (например, near-by normalization) effectively требует координаты и ухудшает поддержку city-wide/diffuse событий.
- Формулировка в backend-docs местами допускает неверное чтение роли RF как источника «места», что конфликтует с boundary split (Atlas=where, RF=business actor context).

## Drift risks

- Ложное принуждение всех событий к `place_id` (потеря корректной семантики city-wide/diffuse событий).
- Закрепление text/slug-only geography как «достаточного канона» при уже принятом Atlas geo layer.
- Непрозрачное смешение event geography и business host context.
- Downstream-поведение «only point-based event is valid», которое исключает валидные area/city-scope события.

## Practical alignment formula

- **Pulse = “what happens”** (event lifecycle truth).
- **Atlas = “where”** (canonical geo identity substrate).
- **RF = “which business/partner actor”** (optional context only, не обязательный для всех событий).
- Для Pulse это означает:
  - place-bound события используют canonical geo anchors;
  - area/city/diffuse события допускаются без фиктивного place;
  - business-linked context подключается optional через RF, без переноса ownership.

## What this document does NOT decide

- Не фиксирует implementation plan, migration plan или timeline.
- Не фиксирует немедленный redesign Pulse storage/OpenAPI.
- Не делает RF обязательным для всех событий.
- Не утверждает, что текущий Pulse contour уже полностью canonical-aligned.
- Не меняет ownership split Atlas/RF/Pulse.
