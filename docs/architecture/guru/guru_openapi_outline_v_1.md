# Guru OpenAPI Outline v1  
**OpenAPI Outline for guru-service (Go2Asia)**

---

## 1. Purpose

Документ фиксирует **минимальный API surface guru-service V1**.

Цель:

> **Зафиксировать публичный контракт Guru V1 до реализации, чтобы frontend, gateway и backend двигались от единого API outline, а не от mock-логики или случайных DTO upstream-доменов.**

Это именно **outline**, а не финальная OpenAPI-спецификация.  
Документ задаёт:

- состав эндпоинтов V1
- их назначение
- shape запросов
- shape ответов
- границы V1
- что откладывается на позже

---

## 2. API Philosophy

Guru V1 — это **nearby-first aggregation API**.

Следовательно, API должен:

- быть небольшим
- быть explainable
- быть ориентированным на nearby use cases
- поддерживать два spatial режима:
  - real
  - virtual
- возвращать unified card response
- не протаскивать frontend в domain DTO отдельных сервисов

Главный принцип:

> **Guru API speaks in nearby queries and EntityCard responses.**

---

## 3. API Scope (V1)

## 3.1 In Scope

В V1 входят только базовые nearby-endpoints:

- `GET /v1/guru/nearby`
- `GET /v1/guru/nearby/{type}`
- `GET /v1/guru/what-to-do`

Текущий runtime baseline: живой upstream-source в V1 = `rielt`; остальные declared domain adapters остаются explicit stubs и отражаются в `meta.sources_stub`.

---

## 3.2 Out of Scope

В V1 не входят:

- full-text search
- recommendations API
- AI personalization API
- saved entities API
- preferences API
- history API
- social feed API
- map tiles / routing / navigation APIs
- booking/payment APIs

---

## 4. Core Response Contract

Все публичные ответные payloads Guru V1 строятся вокруг:

- `EntityCard`
- list-based nearby responses
- partial-failure tolerant aggregation

Подробный контракт карточки фиксируется в:

- `guru_entity_card_v1.md`

---

## 5. Shared Schema Concepts

## 5.1 Presence Mode

```ts
type PresenceMode = 'real' | 'virtual'
```

---

## 5.2 Entity Type

```ts
type EntityType =
  | 'place'
  | 'event'
  | 'listing'
  | 'partner'
  | 'quest'
  | 'pro'
  | 'blog_tag'
```

---

## 5.3 Nearby Query Parameters

Базовые query parameters для nearby API:

```ts
type NearbyQueryParams = {
  mode?: PresenceMode
  lat: number
  lng: number
  radius_m?: number
  limit?: number
  types?: EntityType[]
  time_window?: string
  open_now?: boolean
  verified_only?: boolean
  rf_only?: boolean
}
```

### Правила
- `lat` / `lng` обязательны
- `mode` по умолчанию = `real`
- `radius_m` имеет разумный default на уровне сервиса
- `limit` ограничен upstream-safe потолком `50`
- `types` optional
- фильтры optional

---

## 5.4 Shared Response Envelope

```ts
type GuruListResponse = {
  data: EntityCard[]
  meta: GuruResponseMeta
  partial_failures?: PartialFailure[]
}
```

```ts
type GuruResponseMeta = {
  mode: PresenceMode
  lat: number
  lng: number
  radius_m: number
  count: number
  sources_active: SourceDomain[]
  sources_stub: SourceDomain[]
  source_item_counts: Partial<Record<SourceDomain, number>>
}
```

```ts
type PartialFailure = {
  domain: 'atlas' | 'pulse' | 'rielt' | 'rf' | 'quest' | 'space' | 'blog'
  reason: string
}
```

### Назначение
- `data` — итоговая nearby-выдача
- `meta` — контекст запроса
- `partial_failures` — graceful degradation
- `meta.sources_*` и `meta.source_item_counts` — прозрачность по реальным и stub downstream источникам V1

---

## 6. Endpoint 1 — GET /v1/guru/nearby

## 6.1 Purpose

Главный endpoint Guru V1.

Возвращает blended nearby-выдачу из нескольких доменов, нормализованную в `EntityCard[]`.

---

## 6.2 Intended Use Cases

- “Что рядом со мной?”
- “Что рядом с выбранной точкой?”
- blended карта / blended список
- общий nearby discovery surface

---

## 6.3 Query Parameters

| Parameter | Type | Required | Notes |
|------|------|------|------|
| mode | `real \| virtual` | no | default = `real` |
| lat | number | yes | координата центра |
| lng | number | yes | координата центра |
| radius_m | integer | no | радиус выборки |
| limit | integer | no | лимит карточек |
| types | string[] | no | фильтр по типам |
| time_window | string | no | актуально для событий |
| open_now | boolean | no | только открытые |
| verified_only | boolean | no | только verified |
| rf_only | boolean | no | только partner-related |

---

## 6.4 Successful Response Shape

```ts
type GetNearbyResponse = GuruListResponse
```

---

## 6.5 Behavioral Rules

- blended results from multiple domains
- results normalized to `EntityCard`
- ranking is explainable and deterministic
- partial upstream failures do not break response
- invalid upstream payload учитывается как `partial_failures` c reason `invalid_payload`
- empty response is allowed
- raw domain DTOs are never returned

---

## 6.6 Notes

Это основной endpoint как для:

- map mode
- list mode
- split mode

Frontend не должен запрашивать домены отдельно для сборки общей Guru-выдачи.

---

## 7. Endpoint 2 — GET /v1/guru/nearby/{type}

## 7.1 Purpose

Возвращает nearby-выдачу только по одному типу сущности.

---

## 7.2 Supported Types

- `place`
- `event`
- `listing`
- `partner`
- `quest`
- `pro`
- `blog_tag`

---

## 7.3 Intended Use Cases

- вкладки / фильтры по типу
- более чистый слой карты
- type-specific list views
- debugging / simplified UX flows

---

## 7.4 Path Parameter

| Parameter | Type | Required | Notes |
|------|------|------|------|
| type | EntityType | yes | тип nearby-сущности |

---

## 7.5 Query Parameters

Те же, что и у `GET /v1/guru/nearby`, кроме `types`.

```ts
type GetNearbyByTypeQueryParams = {
  mode?: PresenceMode
  lat: number
  lng: number
  radius_m?: number
  limit?: number
  time_window?: string
  open_now?: boolean
  verified_only?: boolean
  rf_only?: boolean
}
```

---

## 7.6 Successful Response Shape

```ts
type GetNearbyByTypeResponse = GuruListResponse
```

---

## 7.7 Behavioral Rules

- возвращаются только карточки одного типа
- `type` должен быть отражён в каждой карточке
- ranking rules остаются explainable
- сервис не должен silently map unsupported type в generic nearby

---

## 7.8 Error Rule

Если тип не поддерживается:

- `400 Bad Request`

---

## 8. Endpoint 3 — GET /v1/guru/what-to-do

## 8.1 Purpose

Curated endpoint для сценария:

> “Что мне здесь сделать?”

Этот endpoint отличается от generic nearby тем, что сильнее ориентирован на actionability.

---

## 8.2 Intended Use Cases

- landing surface Guru
- curated discovery
- blended action-oriented nearby list
- trip-planning mode
- “если бы я был здесь” exploration

---

## 8.3 Query Parameters

| Parameter | Type | Required | Notes |
|------|------|------|------|
| mode | `real \| virtual` | no | default = `real` |
| lat | number | yes | координата центра |
| lng | number | yes | координата центра |
| radius_m | integer | no | радиус выборки |
| limit | integer | no | лимит карточек |
| time_window | string | no | temporal relevance |
| open_now | boolean | no | bias to available now |
| verified_only | boolean | no | optional |

---

## 8.4 Successful Response Shape

```ts
type GetWhatToDoResponse = GuruListResponse
```

---

## 8.5 Behavioral Rules

- выдача более action-oriented, чем generic nearby
- приоритет:
  - events
  - quests
  - partner utility
  - nearby places with action signals
  - visible PRO where relevant
  - geo-context blog tags as context links
- response всё равно строится в формате `EntityCard[]`
- endpoint не должен вводить отдельный response model

---

## 9. EntityCard in API Boundary

На публичной API-границе Guru использует только:

- `EntityCard`
- `GuruListResponse`
- query params for nearby context

Публичный API Guru не должен возвращать:

- Atlas DTO
- Pulse DTO
- Rielt DTO
- Quest DTO
- Space profile DTO
- raw Blog post DTO

---

## 10. Blog Tag Handling in API

`blog_tag` — допустимый `EntityType`, но особый.

### Правила:
- это не raw post
- это geo-context link entity
- может использоваться в blended nearby response
- может использоваться в type-specific response `/nearby/blog_tag`

---

## 11. PRO Handling in API

`pro` — допустимый `EntityType`, но только при соблюдении условий видимости.

### Правила:
- only PRO profiles
- only opt-in visible profiles
- never all users
- never full social graph exposure

---

## 12. Real / Virtual Mode in API

Оба режима используют те же endpoints.

Различие задаётся только `mode` и координатами:

```text
mode=real    → coordinates reflect actual location context
mode=virtual → coordinates reflect selected map point
```

### Важно
Virtual mode не создаёт отдельный `/simulate` или `/explore` endpoint в V1.

Это тот же API surface.

---

## 13. Error Outline

## 13.1 400 Bad Request
Используется, если:
- отсутствуют обязательные координаты
- invalid `type`
- invalid query values
- malformed params

## 13.2 401 Unauthorized / 403 Forbidden
Используется только если конкретная deployment-конфигурация требует auth/context.

Guru V1 не должен предполагать, что весь nearby discovery всегда требует жёсткую авторизацию.

## 13.3 500 Internal Server Error
Только при полном внутреннем сбое сервиса.

### Важно
Частичный сбой upstream-домена не должен автоматически превращаться в 500.  
Для этого существует `partial_failures`.

---

## 14. Partial Failure Policy

Guru V1 обязан поддерживать graceful degradation.

### Следовательно:
- один упавший upstream ≠ failed request
- допустим частичный ответ
- проблемный домен отражается в `partial_failures`

Пример:

```ts
type PartialFailure = {
  domain: 'pulse'
  reason: 'timeout'
}
```

---

## 15. Pagination Policy

В V1 рекомендуется использовать **simple limit-based response**, без сложной пагинации.

### Причина
Guru — nearby-first service, а не endless catalog.

### Следовательно:
- `limit` допустим
- cursor pagination не является обязательной частью V1
- offset pagination не является приоритетом

---

## 16. Sorting Policy

Guru V1 не должен предоставлять свободный пользовательский API для сложных сортировок.

Потому что:
- основная сортировка принадлежит Guru ranking pipeline
- выдача должна оставаться explainable и curated

### Допустимо
- controlled sorting behavior internally
- type-specific ranking differences internally

### Недопустимо
- arbitrary user-defined sort API turning Guru into search/catalog engine

---

## 17. Security / Exposure Constraints

Guru API V1 не должен:
- утекать приватные поля upstream-сервисов
- раскрывать full social graph
- возвращать hidden internal source payloads
- зависеть от прямого доступа к чужим persistence-моделям

---

## 18. Relation to Other SSOT Documents

### Связь с `guru_backend_architecture_v_1.md`
Там зафиксирована backend-роль Guru.  
Здесь — минимальный публичный API surface этой роли.

### Связь с `guru_dependency_map_v_1.md`
Там зафиксированы источники данных.  
Здесь — как aggregated result экспонируется наружу.

### Связь с `guru_domain_model_v_1.md`
Там описаны внутренние модели Guru.  
Здесь — какие из них выходят на API boundary.

### Связь с `guru_entity_card_v1.md`
Там описан основной card contract.  
Здесь — как он используется в endpoints.

### Связь с `guru_service_production_architecture_v_1.md`
Там будет описано, как этот API реализуется operationally.

---

## 19. Out of Scope for This Outline

Документ специально не фиксирует:

- финальную YAML/JSON OpenAPI syntax
- final response examples for every entity type
- auth middleware details
- service-internal adapter contracts
- observability schema
- caching strategy details

Это будет уточняться на следующем уровне детализации.

---

## 20. Key Architectural Constraint

> **OpenAPI outline Guru V1 должен оставаться компактным, nearby-first и projection-oriented, не превращаясь в API-копию всех upstream-доменов.**

---

## 21. Final Definition

> **Guru OpenAPI Outline v1** задаёт минимальный публичный API surface для guru-service как nearby-first aggregation/BFF слоя: единый blended nearby endpoint, type-specific nearby endpoint и action-oriented endpoint `what-to-do`, все из которых работают через общий spatial query contract и возвращают unified `EntityCard`-based responses с поддержкой graceful degradation.

---
