# Guru Asia / Step 9 Audit

**Дата:** 2026-03-19  
**Тип:** Audit / Design Pass Only (без реализации)  
**Режим:** Multi-agent exploration  
**План:** `docs/plans/go2asia_next_steps_plan_2026_march_10.md`  
**Scope:** Текущее состояние Guru Asia и готовность к началу Step 9 — Build `guru-service`

---

## 1. Executive Summary

**Краткий вывод о текущем состоянии Guru:**
Guru существует как **идея + частично заложенный контур**, а не как работающая система. В репозитории присутствуют:

- **Frontend:** Полноценный mock UI (карта, список, фильтры, карточки, ранжирование, геолокация) — реализован, но не подключён к странице `/guru` (показывается placeholder «Раздел в разработке»).
- **Backend:** Сервиса `guru-service` **нет**. Есть зарезервированный prefix `/v1/guru/*` в API Gateway (501 без `GURU_SERVICE_URL`), конвенции в `packages/db`, обширная документация.
- **Data supply:** Единственный реальный nearby-источник — Rielt (`GET /v1/rielt/listings/nearby`). Atlas, Pulse, Quest, RF, Space — nearby-эндпоинтов **нет**.

**Существует ли Guru только как идея, mock UI или частичный контур:**  
Guru существует как **комбинация**: идея (документация, планы) + mock UI (готовые компоненты) + минимальная инфраструктурная заготовка (gateway, conventions). Реального aggregation/BFF-слоя нет.

**Насколько репозиторий готов к началу Step 9:**  
**Средне-низкий уровень готовности.** Основания есть (UI-компоненты, gateway prefix, контракты в доках, Rielt nearby), но критически отсутствуют: guru-service, nearby в content-service (Atlas/Pulse), unified card contract в коде, canonical geo в UI-mocks, RF и Quest nearby.

---

## 2. What Step 9 Actually Requires

По плану `go2asia_next_steps_plan_2026_march_10.md`:

**Guru должен:**
- Быть **BFF / aggregation layer**, а не source-of-truth service.
- Реализовать unified card contract для: **places, events, listings, partners, quests**.
- Иметь **nearby endpoints**.
- Использовать **explainable ranking**: distance, time relevance, verified signals, rule-based boosts.
- Обеспечивать **graceful degradation** между доменами.
- **Не строить** полноценный Geo Layer сразу, но подготовить совместимые контракты.

**Guru не должен:**
- Быть source-of-truth.
- Быть отдельным search engine.
- Быть geo-service или map platform.
- Быть AI-orchestrator, marketplace-core, dashboard-super-service.

---

## 3. Files and Areas Reviewed

### Директории и ключевые файлы

| Область | Пути |
|---------|------|
| **Guru Frontend** | `apps/go2asia-pwa-shell/app/(public)/guru/`, `components/guru/`, `components/guru/hooks/`, `components/guru/utils/` |
| **Guru Pages** | `page.tsx`, `layout.tsx`, `GuruClient.tsx` |
| **Guru Components** | `GuruMapView.tsx`, `GuruListView.tsx`, `ObjectCard.tsx`, `GuruFilters.tsx`, `types.ts`, `mockObjects.ts` |
| **API Gateway** | `apps/api-gateway/src/index.ts` |
| **Packages** | `packages/db/src/schema/conventions.ts`, `packages/sdk/src/rielt.ts`, `packages/sdk/src/index.ts` |
| **Rielt Service** | `apps/rielt-service/src/services/rieltService.ts`, `apps/rielt-service/src/routes/public.ts`, `apps/rielt-service/src/db/queries/listingQueries.ts` |
| **Docs Guru** | `docs/backend/guru_service/`, `docs/modules/guru/` |
| **Docs Architecture** | `docs/architecture/phase2_architecture.md`, `docs/architecture/city_mapping_architecture_v1.md`, `docs/plans/phase2_delivery_plan.md` |
| **Docs Decisions** | `docs/decisions/adr_0023_geo_layer_introduction.md` |
| **Knowledge** | `docs/knowledge/go2asia_overview_structured.md`, `docs/knowledge/backend_microservice.md` |
| **Templates** | `templates/worker-service/README.md` |
| **Connect/RF/Rielt references** | `components/rf/PartnerDetail/CTAPanel.tsx`, `components/rf/PartnerDetail/AddressBlock.tsx`, `components/rielt/ListingDetail/Location.tsx`, `components/connect/mockData.ts` |
| **Atlas nearby** | `app/(public)/atlas/places/[id]/nearby-places/page.tsx`, `nearby-services/page.tsx` |
| **OpenAPI** | `docs/openapi/openapi.bundle.yaml` |
| **Middlewares/Nav** | `middleware.ts`, `SideDrawer.tsx`, `HomePageClient.tsx`, `modules/atlas/utils/navigation.ts` |

---

## 4. Current Guru Frontend State

| Элемент | Расположение | Статус | Комментарий |
|---------|--------------|--------|-------------|
| **Роут /guru** | `app/(public)/guru/` | **partial** | Есть layout и page, но page рендерит placeholder |
| **GuruClient** | `app/(public)/guru/GuruClient.tsx` | **real** | Полная реализация карта/список/split, mobile-first, но **не импортируется в page** |
| **page.tsx** | `app/(public)/guru/page.tsx` | **placeholder** | Текст «Раздел в разработке», GuruClient не подключён |
| **GuruMapView** | `components/guru/GuruMapView.tsx` | **real** | Leaflet-карта, маркеры по типам, радиус, попапы, ссылки Atlas/Pulse/Rielt/Quest |
| **GuruListView** | `components/guru/GuruListView.tsx` | **real** | Список карточек, сортировка, EmptyState |
| **ObjectCard** | `components/guru/ObjectCard.tsx` | **real** | Универсальная карточка place/event/housing/person/quest |
| **GuruFilters** | `components/guru/GuruFilters.tsx` | **real** | Радиус, время, типы, place/housing/person/quest attrs |
| **useGeolocation** | `components/guru/hooks/useGeolocation.ts` | **real** | Геолокация, `localStorage` `guruLastPosition` |
| **types** | `components/guru/types.ts` | **real** | GuruObject, GuruObjectType, GuruFilters, GuruObjectWithDistance |
| **mockObjects** | `components/guru/mockObjects.ts` | **mock** | 15 мест, 8 событий, 5 жилья, 5 людей, 3 квеста (Новосибирск) |
| **utils** | `geo.ts`, `filters.ts`, `ranking.ts` | **real** | Расстояние, фильтрация, ранжирование (proximity/now/popular) |
| **Design tokens** | `tailwind.config.js`, `globals.css` | **real** | `guru` colors, `.card-gradient-guru` |
| **BottomSheet** | docs | **dead** | Описан в `ui_structure.md`, компонента нет в `@go2asia/ui` |

**Навигация и ссылки на Guru:**
- SideDrawer, HomePageClient, Connect (модуль guru), RF PartnerDetail («Открыть в Guru», «Показать в Guru» с lat/lng), Connect mockData (module: 'guru', deeplink: '/quest/nearby').

---

## 5. Current Guru Backend State

| Компонент | Статус | Детали |
|-----------|--------|--------|
| **apps/guru-service** | **отсутствует** | Папки нет в `apps/` |
| **Gateway prefix** | **реализован** | `/v1/guru/*` → `GURU_SERVICE_URL`, при отсутствии → 501 ROUTE_RESERVED_NOT_ENABLED |
| **OpenAPI guru** | **отсутствует** | Нет `guru.yaml` в bundle |
| **SDK guru** | **отсутствует** | Phase 2 сервисы не включать до реальных роутов (README) |
| **DB schema guru** | **частично** | В `conventions.ts` есть guru, `schemaFile: './guru'` — файла `./guru` **нет** |
| **templates/worker-service** | **частично** | guru-service в списке целевых, папки нет |
| **docs/backend/guru_service** | **есть** | overview, api_contracts, architecture, data_model, integration, caching_strategy, search_and_filtering, validation_rules, security, roadmap |

**Чего нет:**
- guru-service приложение;
- OpenAPI спецификация guru;
- SDK hooks для guru;
- фактическая DB schema guru;
- любые stubs/workers для guru.

---

## 6. Cross-Domain Dependency Map

| Домен | API для Guru | Фактический nearby | Readiness как source для Guru |
|-------|--------------|--------------------|-------------------------------|
| **Atlas / content-service** | `places/nearby` (план) | **Нет** | Низкая — nearby отсутствует |
| **Pulse** | `events/nearby` (план) | **Нет** | Низкая — nearby отсутствует |
| **Blog** | Косвенная связь | Нет | Низкая — контракт не определён |
| **rielt-service** | `listings/nearby` | **Есть** | Высокая — готов к потреблению |
| **RF** | plan / venues/nearby | RF-service **нет** | Нет — RF ещё не реализован |
| **quest-service** | `quests/nearby` (план) | **Нет** | Средняя — quest есть, nearby нет |
| **space-service** | PRO рядом | Нет dedicated nearby | Низкая — «люди рядом» не оформилены |
| **reactions** | — | — | Внешний сигнал (лайки/сохранения) |
| **points-service** | — | — | Внешний сигнал (Connect) |

**Вывод:** Реальный supply для Guru есть только у **Rielt**. Остальные домены требуют либо добавления nearby, либо отложенного подключения.

---

## 7. Contract and DTO Audit

### Basis for unified card contract

**Документация (GuruEntity):**
- `id`, `source`, `entity_type`, `lat`, `lng`, `distance_m`, `city_id`, `country_id`, `is_rf`, `tags`, `image_url`, `rating`, `payload`.
- `entity_type`: place, event, housing, partner_venue, quest, guru.

**Frontend (GuruObject):**
- `id`, `type`, `title`, `description`, `cover`, `lat`, `lng`, `address`, `city` (string), `rating`, `popularity`, `isRF`, `isVerified`.
- `type`: place, event, housing, person, quest.

**Step 9:** places, events, listings, partners, quests.

### Shape mismatch

| Аспект | Docs GuruEntity | Frontend GuruObject | Step 9 | RieltNearbyListingDto |
|--------|-----------------|---------------------|--------|------------------------|
| listings | housing | housing | **listings** | listing |
| partners | partner_venue | — | **partners** | — |
| person/guru | guru | person | partners (PRO) | — |
| geo | city_id, country_id | city (string) | canonical | countryId, cityId |
| source | source (atlas_place, pulse_event...) | — | — | — |
| distance | distance_m | вычисляется в UI | — | distanceMeters |

### Существующие DTO для переиспользования

- **RieltNearbyListingDto:** id, slug, title, listingType, price, geo {countryId, cityId}, media, distanceMeters — удобный формат для адаптера в Guru card.
- **Content places/events:** через content-service; nearby-контракта нет.
- **Quest:** есть list/detail, нет nearby.

### Вероятные adapter/projection layers

1. **Rielt → Guru card:** маппинг RieltNearbyListingDto → unified card (уже есть `rieltDtoToListing` для Rielt UI).
2. **Atlas/Pulse → Guru card:** при появлении nearby — маппинг в unified card.
3. **Frontend GuruObject:** потребуется маппинг backend GuruEntity → GuruObject (city_id/country_id vs city string).

---

## 8. Canonical Geo / Nearby Readiness Audit

### Текущее состояние geo assumptions

| Место | Паттерн | Каноничность |
|-------|--------|--------------|
| **mockObjects** | `city: 'Новосибирск'`, `lat/lng` | **non-canonical** — city как строка, нет city_id/country_id |
| **GuruObject types** | `city?: string` | Non-canonical |
| **GuruEntity (docs)** | `city_id`, `country_id` | Canonical |
| **RieltNearbyListingDto** | `geo: { countryId, cityId }` | Canonical |
| **Atlas/content schema** | cities, places с lat/lng, cityId | Canonical |
| **Pre-Step-8 policy** | ban on new non-canonical geo writes | Зафиксировано |

### Риски

1. **Mock-данные:** город как текст, локация Новосибирск — не Asia, не canonical. При замене mock на API легко протащить non-canonical допущения.
2. **Frontend types:** `city?: string` — при интеграции нужно добавлять `city_id`, `country_id`.
3. **GuruClient / geo utils:** работают с lat/lng, distance — ок. Нет явной привязки к canonical hierarchy.

### Premature Geo Layer

- **ADR-0023:** Guru потребляет nearby через Geo Service (Geo Layer). Step 9: Geo Layer не строить сразу.
- **backend_microservice:** «На ранних этапах возможен прямой fan-out к источникам».
- **Риск:** Документация в backend_microservice описывает Geo Layer как основной путь; Step 9 предполагает fan-out без Geo Layer. Нужно выровнять.

---

## 9. Scope Drift Risks

| Риск | Где проявляется | Почему опасно |
|------|-----------------|---------------|
| **Guru как AI-orchestrator** | `docs/backend/guru_service/roadmap.md` Этап 5; `docs/modules/guru/data_model.md` GuruAiSuggestion | Step 9 не включает AI-персонализацию |
| **Guru через Geo Layer обязательно** | `backend_microservice.md`: Guru получает nearby через Geo Service | Step 9: direct fan-out без Geo Layer |
| **Guru — «не обязательный склейщик»** | `backend_microservice`: Guru не обязательный, Geo Layer — основной | Step 9: Guru — BFF, основной aggregation |
| **Отдельный search engine** | `guru_service/search_and_filtering.md` | Step 9: aggregation, не search engine |
| **Dashboard-super-service** | Нет явных следов | — |
| **Marketplace-core** | Нет | — |
| **Map platform** | GuruMapView — UI, не platform | Низкий риск |

**Рекомендация:** Перед реализацией зафиксировать границы Guru V1: BFF, fan-out, без AI, без Geo Layer, без search engine.

---

## 10. Reusable Assets for Step 9

### UI assets

- GuruMapView, GuruListView, ObjectCard, GuruFilters — готовы к подключению к API.
- useGeolocation, utils (geo, filters, ranking) — переиспользуемы.
- mockObjects — только как референс формата; данные (Новосибирск) не для production.

### Contracts

- GuruEntity (docs) — база для backend response.
- GuruObject (frontend) — нуждается в расширении (city_id, country_id, source).
- RieltNearbyListingDto — готов для адаптера.

### Gateway

- Prefix `/v1/guru/*` зарезервирован, маршрутизация готова.

### Service templates

- `templates/worker-service` — можно взять за основу guru-service.

### Utilities

- Rielt `listPublishedListingsNearby`, `parseNearbyListingsQuery` — паттерн для nearby.

---

## 11. Gaps Before Step 9 Implementation

### Критические

- guru-service приложение;
- nearby в content-service (Atlas places, Pulse events);
- unified card contract в коде (backend DTO + frontend mapping);
- canonical geo в frontend types и mock → API migration path;
- Подключение GuruClient к page.tsx (тривиально, но символично).

### Желательные

- Quest nearby endpoint;
- RF/partner layer (если будет в Step 9);
- OpenAPI guru;
- SDK guru (после стабильного API).

### Организационные / архитектурные

- Согласование: fan-out vs Geo Layer в документации;
- Фиксация границы Guru V1 (без AI, без search);
- Проверка Pre-Step-8 Normalization: Atlas-as-Geo-SSOT, city mapping для Pulse/Blog.

---

## 12. Recommended Pre-Implementation Boundary for Guru V1

**Строго в рамках Step 9:**

| В scope | Вне scope |
|---------|-----------|
| BFF / aggregation layer | Source-of-truth, Geo Layer |
| GET /v1/guru/nearby (и возможно /nearby/{type}) | Search engine, AI-orchestrator |
| Unified card: places, events, listings, partners, quests | Dashboard, marketplace-core |
| Explainable ranking: distance, time, verified, rule-based | ML ranking, персонализация |
| Graceful degradation | Полная персистентная кэш-слой |
| Fan-out к Atlas, Pulse, Rielt, Quest, RF (если есть) | Отдельный geo-service |
| Минимальные projection tables (если нужны) | Собственное хранилище контента |

---

## 13. Proposed Implementation Readiness Checklist

- [ ] Pre-Step-8 Normalization P0 frozen (Atlas Geo SSOT, city mapping, ban non-canonical writes).
- [ ] Rielt nearby стабилен и документирован.
- [ ] Решение: fan-out напрямую к доменам (без Geo Layer) для V1.
- [ ] Unified card contract зафиксирован (backend DTO + frontend mapping).
- [ ] Граница Guru V1 зафиксирована (без AI, без search engine).
- [ ] content-service: план/тикет на places/nearby и events/nearby (или явный отказ для V1).
- [ ] quest-service: план nearby (или отказ для V1).
- [ ] RF: решение — включать ли в V1 (скорее нет, RF ещё не реализован).
- [ ] Подключение GuruClient к /guru page (quick win для демо).

---

## 14. Exact Risks

| Риск | Почему опасен | Как учитывать |
|-----|---------------|---------------|
| **Нет nearby в Atlas/Pulse** | Guru не может агрегировать места и события без API | Либо добавить nearby в content-service, либо V1 только Rielt + заглушки |
| **Расхождение docs vs план** | backend_microservice vs Step 9 по Geo Layer | Явно зафиксировать: V1 = fan-out |
| **Canonical geo в UI** | Mock использует city string | При wire-up — маппинг API → GuruObject с city_id/country_id |
| **Scope creep (AI, search)** | Roadmap тянет за собой Этап 5 | Жёстко ограничить V1 без AI |
| **RF/Quest отсутствуют** | Partners, quests — без supply | V1: только те домены, у которых есть nearby |
| **GuruClient не на page** | Пользователь видит placeholder | Быстрое исправление до или в начале Step 9 |

---

## 15. Final Verdict

**Readiness level:** **Low–Medium**

**Main blockers:**
1. Отсутствует guru-service.
2. Отсутствует nearby в content-service (Atlas, Pulse).
3. Нет зафиксированного unified card contract в коде.
4. Документация расходится с Step 9 (Geo Layer vs fan-out).

**Main reusable foundations:**
1. Полный Guru UI (карта, список, карточки, фильтры, ранжирование).
2. Gateway prefix `/v1/guru/*`.
3. Rielt nearby как работающий источник.
4. Документация и типы как база для контрактов.

**Можно ли переходить к implementation planning для Step 9:**  
Да, при выполнении pre-conditions: зафиксировать boundary Guru V1, unified card contract, fan-out стратегию; принять решение по nearby в Atlas/Pulse (реализовать или отложить для V1). Саму реализацию guru-service можно планировать уже сейчас, с пониманием, что supply будет ограничен (минимум — Rielt).

---

## Appendix: Role Summaries

### Architect

Guru описан как BFF в плане и conventions. Документация (backend_microservice, Geo Layer) частично противоречит Step 9. Нужна явная фиксация: V1 = fan-out, no Geo Layer.

### Backend/Platform Auditor

guru-service отсутствует. Gateway, conventions — есть. Rielt nearby — единственный готовый upstream. Остальные домены требуют доработки или отложенного подключения.

### Frontend Auditor

UI Guru готов и качественный, но не выведен на страницу. Mock — Новосибирск, non-canonical geo. Types требуют расширения под canonical refs.

### API/Contract Auditor

Unified card описан в docs, но не в коде. GuruEntity (docs) и GuruObject (frontend) не совпадают по полям. Rielt DTO — хорошая основа для адаптера.

### Data/Geo Auditor

Mock использует city string. Backend контракты — canonical. Pre-Step-8 policy зафиксирована. Риск: при интеграции протащить non-canonical в Guru.
