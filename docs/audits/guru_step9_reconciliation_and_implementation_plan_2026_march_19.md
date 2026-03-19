# Guru Step 9 Reconciliation and Implementation Plan

**Дата:** 2026-03-19  
**Тип:** Audit + Implementation Planning Pass Only (без реализации)  
**Режим:** Multi-agent analysis  
**План:** `docs/plans/go2asia_next_steps_plan_2026_march_10.md`  
**SSOT:** `docs/architecture/guru/*.md` (6 документов)

---

## 1. Executive Summary

**Reconciliation:** Новые SSOT-документы Guru (`docs/architecture/guru/`) **внутренне согласованы** и **выровнены с Step 9** плана. Все принципы соблюдены: BFF/aggregation, no Geo Layer V1, no AI V1, PRO only + opt-in, Blog geo-tags only, Real + Virtual mode через один API surface, EntityCard v1 как центральный контракт.

**Readiness:** Репозиторий готов к началу реализации с ограничениями: guru-service отсутствует; единственный реальный nearby-источник — Rielt; content-service (Atlas/Pulse) не имеет nearby-эндпоинтов; frontend Guru реализован, но не подключён.

**Implementation plan:** Поэтапная реализация guru-service с Rielt как primary V1 supply, stub-адаптерами для Atlas/Pulse/Quest/RF/Space/Blog (возвращают `[]` до появления upstream nearby), фиксацией EntityCard в коде и wire-up frontend к Guru API.

---

## 2. Step 9 Requirements from Plan

Из `docs/plans/go2asia_next_steps_plan_2026_march_10.md`:

| Требование | Описание |
|------------|----------|
| **Guru = BFF** | Aggregation layer, не source-of-truth |
| **Unified card** | places, events, listings, partners, quests |
| **Nearby endpoints** | Обязательны |
| **Explainable ranking** | distance, time relevance, verified signals, rule-based boosts |
| **Graceful degradation** | При сбоях upstream — частичный ответ |
| **No Geo Layer** | Не строить сразу, совместимые контракты |
| **Не должен** | geo-service, search engine, AI, source-of-truth |

---

## 3. SSOT Consistency Check

### 3.1 Внутренняя согласованность шести документов

| Документ | Ключевые фиксации | Согласованность |
|----------|-------------------|-----------------|
| **guru_backend_architecture_v_1** | BFF, fan-out, no geo/search/AI, Real+Virtual, EntityCard | ✓ |
| **guru_dependency_map_v_1** | Atlas/Pulse/Rielt/RF/Quest/Space/Blog; PRO only; Blog tags only | ✓ |
| **guru_domain_model_v_1** | EntityCard, SourceRef, ExplainBlock, NearbyQuery, rule-based ranking | ✓ |
| **guru_openapi_outline_v_1** | GET /nearby, /nearby/{type}, /what-to-do; mode, lat, lng, radius_m | ✓ |
| **guru_service_production_architecture_v_1** | Adapters, normalization, ranking, graceful degradation, timeouts | ✓ |
| **guru_entity_card_v1** | EntityCard base, EntityType, ExplainBlock, actions, payload | ✓ |

**Проверка пересечений:**
- EntityType: во всех документах — place, event, listing, partner, quest, pro, blog_tag ✓  
- PresenceMode: real | virtual — везде ✓  
- No Geo Layer V1 — везде ✓  
- No AI V1 — везде ✓  
- PRO only + opt-in — dependency_map, production_arch, openapi ✓  
- Blog geo-context tags only — dependency_map, production_arch, openapi ✓  

### 3.2 Согласованность Step 9 и SSOT

| Step 9 | SSOT | Статус |
|--------|------|--------|
| places, events, listings, partners, quests | + pro, blog_tag (ограниченно) | ✓ Расширение допустимо |
| nearby endpoints | GET /v1/guru/nearby, /nearby/{type}, /what-to-do | ✓ |
| explainable ranking | distance, time, verified, partner, rule-based | ✓ |
| graceful degradation | partial_failures в ответе | ✓ |
| no Geo Layer | Direct fan-out, никакого Geo Service | ✓ |

### 3.3 Scope drift — отсутствует

Проверено на:
- **geo-service:** Все документы — no Geo Layer V1, direct fan-out ✓  
- **search engine:** Запрещено явно ✓  
- **AI/personalization:** Out of scope V1 ✓  
- **source of truth:** Guru не владеет данными ✓  
- **social map of all users:** PRO only + opt-in, не полный граф ✓  

### 3.4 Мелкая несогласованность (не критична)

**SourceRef в EntityCard:**  
В `guru_domain_model_v_1` EntityCard содержит `source: SourceRef`. В `guru_entity_card_v1` base contract не перечисляет `source`.  
**Рекомендация:** Добавить `source` в публичный EntityCard (domain + source_id) для трассировки и формирования deeplinks. Либо оставить internal-only — actions.deeplink достаточен для UI.

---

## 4. Current Codebase Readiness

### 4.1 Gateway

| Элемент | Статус | Детали |
|---------|--------|--------|
| Prefix `/v1/guru/*` | ✓ | Резерв, маршрутизация на GURU_SERVICE_URL |
| 501 при отсутствии URL | ✓ | ROUTE_RESERVED_NOT_ENABLED |

### 4.2 Frontend Guru

| Элемент | Статус | Путь |
|---------|--------|------|
| GuruClient | ✓ | `app/(public)/guru/GuruClient.tsx` — не подключён к page |
| page.tsx | Placeholder | Рендерит «Раздел в разработке» |
| GuruMapView, GuruListView, ObjectCard, GuruFilters | ✓ | `components/guru/` |
| useGeolocation, utils (geo, filters, ranking) | ✓ | hooks, utils |
| types (GuruObject) | Partial | Требует city_id, country_id, source; сейчас city string |
| mockObjects | Mock | Новосибирск, non-canonical geo |

### 4.3 Service template

| Элемент | Статус | Путь |
|---------|--------|------|
| worker-service template | ✓ | `templates/worker-service/` — health, ready, X-Request-ID, logger, auth scaffold |

### 4.4 Shared utilities / adapter patterns

| Элемент | Статус |
|---------|--------|
| Rielt adapter pattern | ✓ `rieltDtoToListing`, `rieltNearbyDtoToListingWithDistance` |
| packages/db conventions | ✓ guru в PHASE2_DOMAIN_SCHEMA_NAMES |
| schema guru | ✗ Файла `./guru` нет (conventions ссылается) |

### 4.5 Upstream domains — readiness для Guru V1

| Домен | Nearby API | Реализован | V1 supply |
|-------|------------|------------|-----------|
| **Rielt** | GET /v1/rielt/listings/nearby | ✓ | ✓ Primary |
| **content (Atlas)** | places by cityId | ✗ lat/lng nearby нет | Stub |
| **content (Pulse)** | events by filters | ✗ lat/lng nearby нет | Stub |
| **Quest** | list quests | ✗ nearby нет | Stub |
| **RF** | — | Сервис отсутствует | Stub |
| **Space** | — | PRO nearby не оформлен | Stub |
| **Blog** | — | geo-tags API нет | Stub |

---

## 5. Exact V1 Scope for Implementation

### 5.1 Capabilities (in scope)

| Capability | Описание |
|------------|----------|
| **guru-service** | Stateless Cloudflare Worker, как worker-service template |
| **GET /v1/guru/nearby** | Blended nearby, lat/lng, radius_m, types, filters |
| **GET /v1/guru/nearby/{type}** | Type-specific nearby |
| **GET /v1/guru/what-to-do** | Action-oriented curated nearby |
| **EntityCard v1** | Unified response contract |
| **RieltAdapter** | Real integration с /v1/rielt/listings/nearby |
| **Stub adapters** | Atlas, Pulse, Quest, RF, Space, Blog — возвращают `[]` до upstream nearby |
| **Explainable ranking** | distance, time (для events), verified, partner, rule-based |
| **Graceful degradation** | partial_failures при сбоях upstream |
| **Real + Virtual mode** | Один API, параметр mode |
| **Frontend wire-up** | GuruClient → Guru API, fallback на mock при недоступности |

### 5.2 Upstream domains — V1 включение

| Домен | Включать | Реализация |
|-------|----------|------------|
| **Rielt** | ✓ | Реальный RieltAdapter, вызов /v1/rielt/listings/nearby |
| **Atlas** | Stub | Adapter есть, возвращает `[]` (или city-based workaround — опционально) |
| **Pulse** | Stub | Adapter есть, возвращает `[]` |
| **Quest** | Stub | Adapter есть, возвращает `[]` |
| **RF** | Stub | Adapter есть, возвращает `[]` |
| **Space** | Stub | Adapter есть, возвращает `[]` |
| **Blog** | Stub | Adapter есть, возвращает `[]` |

---

## 6. Deferred Scope

| Элемент | Причина |
|---------|---------|
| Atlas/Pulse nearby | content-service не имеет nearby — нужен отдельный тикет |
| Quest nearby | quest-service nearby не реализован |
| RF integration | rf-service отсутствует |
| Space PRO nearby | API PRO nearby не оформлен |
| Blog geo-tags API | Отдельный контракт для geo-context tags |
| OpenAPI guru.yaml | После стабилизации API |
| SDK guru | После стабилизации API |
| DB schema guru | Guru stateless; persistence только cache при необходимости |
| Preferences, saved, history | Out of scope V1 |
| AI, ML ranking | Out of scope V1 |
| Pagination cursor | limit-based достаточно для V1 |

---

## 7. Required Files to Create

### 7.1 guru-service (новое приложение)

| Файл | Назначение |
|------|------------|
| `apps/guru-service/package.json` | Скопировать из template, name: guru-service |
| `apps/guru-service/wrangler.toml` | Конфиг Cloudflare, env staging/production |
| `apps/guru-service/tsconfig.json` | От template |
| `apps/guru-service/src/index.ts` | Entry, routing, health, ready, guru routes |
| `apps/guru-service/src/routes/nearby.ts` | GET /nearby, /nearby/:type, /what-to-do |
| `apps/guru-service/src/query/nearbyQuery.ts` | Парсинг, валидация NearbyQueryParams |
| `apps/guru-service/src/adapters/rieltAdapter.ts` | Rielt nearby → internal projection |
| `apps/guru-service/src/adapters/atlasAdapter.ts` | Stub, возвращает [] |
| `apps/guru-service/src/adapters/pulseAdapter.ts` | Stub |
| `apps/guru-service/src/adapters/questAdapter.ts` | Stub |
| `apps/guru-service/src/adapters/rfAdapter.ts` | Stub |
| `apps/guru-service/src/adapters/spaceAdapter.ts` | Stub |
| `apps/guru-service/src/adapters/blogAdapter.ts` | Stub |
| `apps/guru-service/src/normalize/entityCard.ts` | DTO → EntityCard |
| `apps/guru-service/src/ranking/rankingEngine.ts` | Rule-based ranking |
| `apps/guru-service/src/filter/filterLayer.ts` | type, radius, open_now, etc. |
| `apps/guru-service/src/types/entityCard.ts` | EntityCard, EntityType, ExplainBlock, EntityAction |
| `apps/guru-service/README.md` | Описание сервиса |
| `apps/guru-service/test/request.test.ts` | Request tests для nearby |

### 7.2 OpenAPI (опционально V1)

| Файл | Назначение |
|------|------------|
| `docs/openapi/guru.yaml` | Минимальная спецификация Guru API |

### 7.3 SDK (после стабилизации)

| Файл | Назначение |
|------|------------|
| `packages/sdk/src/guru.ts` | useNearby, useNearbyByType, useWhatToDo |

---

## 8. Required Files to Modify

### 8.1 Gateway / Platform

| Файл | Изменение |
|------|-----------|
| `apps/api-gateway/` | GURU_SERVICE_URL уже поддерживается; при deploy — добавить в env |
| `pnpm-workspace.yaml` | Добавить `apps/guru-service` |
| `scripts/openapi_bundle.mjs` | При создании guru.yaml — добавить в SERVICE_SPECS |

### 8.2 Frontend Guru

| Файл | Изменение |
|------|-----------|
| `apps/go2asia-pwa-shell/app/(public)/guru/page.tsx` | Импорт и рендер GuruClient вместо placeholder |
| `apps/go2asia-pwa-shell/components/guru/types.ts` | Расширить GuruObject: city_id?, country_id?, source? для совместимости с EntityCard |
| `apps/go2asia-pwa-shell/components/guru/GuruClient.tsx` | Подключить fetch к /v1/guru/nearby; fallback на mockObjects при ошибке |
| `apps/go2asia-pwa-shell/components/guru/ObjectCard.tsx` | Адаптация под EntityCard shape (explain, actions) |
| `packages/sdk/src/index.ts` | Экспорт guru (после добавления guru.ts) |

### 8.3 DB (минимально)

| Файл | Изменение |
|------|-----------|
| `packages/db/src/schema/index.ts` | Не экспортировать guru — schema guru для V1 не требуется (stateless) |
| `packages/db/src/schema/conventions.ts` | Оставить как есть; schemaFile './guru' может указывать на несуществующий файл до появления cache tables |

---

## 9. Proposed Implementation Sequence

### Phase 1 — Skeleton (1–2 дня)

1. Скопировать `templates/worker-service` → `apps/guru-service`  
2. Обновить package.json, wrangler.toml, SERVICE_NAME  
3. Добавить guru-service в pnpm-workspace  
4. Реализовать health, ready  
5. Добавить роут-заглушку GET /v1/guru/nearby → `{ data: [], meta }`  
6. Проверить Gateway proxy при GURU_SERVICE_URL  

### Phase 2 — Core pipeline (2–3 дня)

7. Реализовать `NearbyQuery` parsing, validation  
8. Реализовать `EntityCard` types  
9. Реализовать `RieltAdapter` (реальный вызов rielt-service)  
10. Реализовать stub adapters (Atlas, Pulse, Quest, RF, Space, Blog)  
11. Реализовать normalization → EntityCard  
12. Реализовать ranking engine (distance, verified, rule-based)  
13. Реализовать filter layer  
14. Собрать response с partial_failures  

### Phase 3 — Endpoints (1 день)

15. GET /v1/guru/nearby — full  
16. GET /v1/guru/nearby/:type — type filtering  
17. GET /v1/guru/what-to-do — action-oriented (ranking bias)  
18. Обработка ошибок, 400/500  

### Phase 4 — Frontend wire-up (1–2 дня)

19. Подключить GuruClient к page.tsx  
20. Fetch /v1/guru/nearby из GuruClient  
21. Маппинг EntityCard → GuruObject (или обновить GuruObject под EntityCard)  
22. Fallback на mockObjects при 5xx или network error  
23. Обновить ObjectCard для explain, actions  

### Phase 5 — Validation (1 день)

24. Request tests guru-service  
25. E2E: Gateway → guru-service → Rielt  
26. Smoke: frontend /guru с real API  

---

## 10. Upstream Dependency Readiness

| Upstream | V1 Readiness | Действие |
|----------|--------------|----------|
| **Rielt** | ✓ Готов | Прямая интеграция |
| **content-service** | ✗ nearby нет | Stub; тикет на places/nearby, events/nearby |
| **quest-service** | ✗ nearby нет | Stub; тикет на quests/nearby |
| **rf-service** | ✗ нет | Stub до Step 10 |
| **space-service** | ✗ PRO nearby нет | Stub; тикет на PRO visible nearby |
| **Blog** | ✗ geo-tags нет | Stub; тикет на geo-context tags API |

**Критично:** Guru V1 **может стартовать** с Rielt как единственным реальным supply. Остальные — пустые ответы до готовности upstream.

---

## 11. Risks and Failure Modes

| Риск | Вероятность | Влияние | Митигация |
|-----|-------------|---------|-----------|
| **Rielt timeout** | Средняя | Задержка ответа Guru | Bounded timeout, partial_failures |
| **Пустая выдача** | Высокая (только Rielt) | UX «ничего рядом» | Empty state UI, explain в карточках |
| **Gateway 501** | Низкая | Guru недоступен | Проверка GURU_SERVICE_URL при deploy |
| **Scope creep в адаптерах** | Средняя | Guru как source-of-truth | Чёткие adapter boundaries, только read |
| **Frontend tight coupling** | Средняя | Хрупкая интеграция | EntityCard как единственный контракт |
| **Non-canonical geo в UI** | Средняя | Накопление tech debt | Маппинг city_id→city name через Atlas |
| **Stub never replaced** | Средняя | Guru с одним supply | Документировать prerequisites для full supply |

---

## 12. Validation / Smoke Test Plan

### 12.1 Unit / Request tests

| Тест | Описание |
|------|----------|
| `GET /v1/guru/nearby` without lat/lng | 400 |
| `GET /v1/guru/nearby` with lat, lng | 200, data array |
| `GET /v1/guru/nearby/listing` | 200, только listings |
| `GET /v1/guru/nearby/invalid_type` | 400 |
| Rielt unavailable | 200 с partial_failures, data от других (пусто если только Rielt) |
| Response shape | data[], meta, optional partial_failures |

### 12.2 Integration

| Тест | Описание |
|------|----------|
| Gateway → guru-service | Request проходит при GURU_SERVICE_URL |
| guru-service → Rielt | Реальные listings в ответе при наличии данных |

### 12.3 E2E / Smoke

| Тест | Описание |
|------|----------|
| Frontend /guru | Отображает карту/список, не падает |
| Режим API | Карточки от Guru API |
| Режим fallback | При ошибке — mockObjects |

---

## 13. Final Verdict

### 13.1 Reconciliation — PASS

SSOT-документы согласованы между собой и с Step 9. Scope drift отсутствует. Guru строго определён как BFF/aggregation, без geo/search/AI/source-of-truth.

### 13.2 Implementation readiness — READY with constraints

- **Ready:** gateway, template, frontend UI, Rielt nearby, SSOT docs  
- **Constraints:** только Rielt даёт реальный supply; остальные адаптеры — stubs  

### 13.3 Implementation plan — APPROVED

Поэтапная реализация в 5 фаз (skeleton → core → endpoints → frontend → validation) с чётким V1 scope. Stub-адаптеры допустимы; temporary workarounds (например, city-based places) — только если не создают скрытого source-of-truth.

### 13.4 Critical pre-conditions

1. Подтвердить, что Guru V1 стартует с Rielt-only supply.  
2. Зафиксировать EntityCard v1 в коде (types) до реализации.  
3. Не создавать Geo Layer, DB schema guru (если не нужен cache).  
4. Не добавлять AI, search, preferences, saved в V1.  

---

## Appendix: Role Summaries

### Architect

SSOT согласован. Guru — тонкий BFF. Direct fan-out, no Geo Layer. Stub adapters допустимы. EntityCard — единая граница.

### Backend/API Planner

3 endpoint: /nearby, /nearby/{type}, /what-to-do. EntityCard, GuruListResponse, partial_failures. RieltAdapter real, остальные stubs. Worker template как база.

### Frontend Integrator

GuruClient готов, подключить к page. Fetch API с fallback на mock. Расширить types под EntityCard. ObjectCard — explain, actions.

### Platform/Infra Reviewer

Gateway готов. pnpm-workspace обновить. wrangler.toml guru-service. GURU_SERVICE_URL в staging/production env.

### QA/Risk Reviewer

Пустая выдача вероятна. Empty state обязателен. Partial failures тестировать. E2E: Gateway → guru → frontend.
