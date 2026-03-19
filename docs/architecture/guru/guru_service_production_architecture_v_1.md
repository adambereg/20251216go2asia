# Guru Service Production Architecture v1  
**Production Architecture for guru-service (Go2Asia)**

---

## 1. Purpose

Документ фиксирует **production-архитектуру `guru-service` V1** как nearby-first aggregation/BFF сервиса в экосистеме Go2Asia.

Цель:

> **Определить, как `guru-service` должен работать в проде как тонкий, надёжный, explainable aggregation layer, не превращаясь в source of truth, geo-platform, search engine или AI-orchestrator.**

Этот документ описывает не продуктовую идею Guru и не OpenAPI outline, а именно **рабочую production-модель сервиса**:

- runtime responsibilities
- request lifecycle
- fan-out orchestration
- adapter boundaries
- normalization pipeline
- ranking/filtering pipeline
- graceful degradation
- caching
- observability
- отказоустойчивость
- production constraints

---

## 2. Architectural Role

`guru-service` в V1 — это:

- stateless aggregation service
- nearby-first BFF
- orchestration layer over domain APIs
- projection builder for `EntityCard`

`guru-service` в V1 **не является**:

- domain source of truth
- geo service
- search service
- recommendation engine
- AI personalization layer
- booking/payment executor
- social feed service

Главный принцип:

> **Guru aggregates domain value into one nearby experience, but does not take domain ownership.**

---

## 3. Production Boundary

## 3.1 In Scope

В production boundary `guru-service` V1 входят:

- public nearby endpoints
- request validation
- fan-out to upstream domain APIs
- normalization into `EntityCard`
- explainable ranking
- filtering
- response composition
- partial failure handling
- optional lightweight caching
- observability and diagnostics

---

## 3.2 Out of Scope

Из production boundary V1 исключаются:

- canonical geography ownership
- persistent domain data storage
- full-text search/indexing
- personalized ML ranking
- long-term user profile modeling
- saved/history subsystem as separate subdomain
- direct DB access to foreign services
- orchestration of business actions inside Guru

---

## 4. Runtime Position in the Platform

Высокоуровнево `guru-service` располагается так:

```text
Client / Frontend Guru UI
        ↓
     API Gateway
        ↓
     guru-service
        ↓
 ┌────────┬────────┬────────┬───────┬────────┬────────┬───────┐
 Atlas    Pulse    Rielt     RF      Quest    Space    Blog
 places   events   listings  partner quests   PRO      geo-tags
```

### Значение этой позиции
- frontend говорит только с Guru API
- Guru не раскрывает frontend-у внутренние DTO upstream-сервисов
- Guru инкапсулирует aggregation complexity
- ownership данных остаётся у доменов

---

## 5. Spatial Runtime Model

Guru должен одинаково работать в двух режимах:

### Real Mode
```text
coordinates = actual user location context
```

### Virtual Mode
```text
coordinates = selected map point
```

### Production Principle
Для runtime-пайплайна это один и тот же сервисный контур.

Меняется только источник координат, но не меняются:

- endpoint shape
- adapter set
- normalization logic
- ranking pipeline
- response contract

Главный принцип:

> **Virtual Mode не создаёт второй production service path.**

---

## 6. Top-Level Runtime Flow

```text
1. Request enters API Gateway
2. Gateway forwards request to guru-service
3. guru-service validates query
4. guru-service builds internal NearbyQuery
5. guru-service fans out to upstream adapters
6. adapter responses are normalized to EntityCard
7. cards are merged into one aggregate
8. ranking is applied
9. filters are applied
10. partial failures are attached if needed
11. final GuruListResponse is returned
```

---

## 7. Internal Production Components

В production-модели `guru-service` V1 рекомендуется следующая внутренняя структура.

## 7.1 API Layer
Отвечает за:
- route handling
- query parsing
- validation
- response serialization

Не отвечает за:
- fan-out details
- ranking details
- upstream contracts directly

---

## 7.2 Query Builder
Преобразует входные параметры в нормализованный внутренний `NearbyQuery`.

Задачи:
- mode normalization
- radius normalization
- type filters normalization
- default handling
- validation of coordinate semantics

---

## 7.3 Domain Adapter Layer
Для каждого upstream-домена должен существовать отдельный adapter boundary.

Примерно:

- `AtlasAdapter`
- `PulseAdapter`
- `RieltAdapter`
- `RFAdapter`
- `QuestAdapter`
- `SpaceAdapter`
- `BlogAdapter`

### Adapter Responsibilities
- отправить запрос в upstream
- получить ответ
- привести сырой ответ к internal projection shape
- скрыть transport/details upstream domain

### Adapter Non-Responsibilities
- не владеть ranking
- не знать про blended response целиком
- не делать frontend-facing serialization

Главный принцип:

> **Каждый upstream домен должен быть изолирован отдельным adapter layer.**

---

## 7.4 Normalization Layer
После получения данных от адаптеров сервис переводит их в:

- `EntityCard`
- `SourceRef`
- `ExplainBlock`
- `EntityAction`

Именно здесь снимается зависимость от domain DTO.

---

## 7.5 Aggregate Builder
Собирает все normalized cards в единый aggregate-контейнер.

Отвечает за:
- объединение результатов
- сбор partial failures
- подготовку к ranking pipeline

---

## 7.6 Ranking Engine
Rule-based, deterministic, explainable.

Сигналы V1:
- distance
- time relevance
- verified signals
- partner utility signals
- optional freshness boost

### Важно
Ranking engine V1:
- не ML
- не AI
- не black box
- не user-personalized recommender

---

## 7.7 Filter Layer
Применяет:
- type filters
- radius filters
- open_now
- verified_only
- rf_only
- time_window

### Порядок
В production V1 разумно:
1. coarse filtering partially at adapter/query stage where cheap
2. canonical filtering at Guru filter layer after normalization

---

## 7.8 Response Composer
Формирует публичный ответ:
- `data`
- `meta`
- `partial_failures`

---

## 8. Upstream Production Integration Model

## 8.1 Atlas Integration
Atlas = owner of:
- geography truth
- places truth

Guru использует Atlas как:
- place supply
- canonical geo grounding

### Production Rule
Guru не хранит canonical geo truth locally.

---

## 8.2 Pulse Integration
Pulse = owner of events.

Guru использует Pulse как:
- temporal nearby layer
- “что происходит рядом” supply

### Production Rule
Если Pulse unavailable, Guru всё ещё отвечает частичным blended response.

---

## 8.3 Rielt Integration
Rielt = owner of listings.

Guru использует Rielt как:
- nearby housing utility source
- practical supply layer

### Production Note
На раннем production этапе Rielt likely будет наиболее зрелым nearby-source.

---

## 8.4 RF Integration
RF = owner of partner layer.

Guru использует RF как:
- partner points
- vouchers/offers entry
- trust/commercial utility layer

---

## 8.5 Quest Integration
Quest = owner of activity layer.

Guru использует Quest как:
- nearby activity supply
- action-oriented cards

Guru не должен:
- считать progress
- запускать quest execution logic internally

---

## 8.6 Space Integration
Space = owner of user/pro identity.

Guru использует только:
- visible PRO projections
- only opt-in visible
- only PRO

Guru не использует:
- full user graph
- full feed
- all users

---

## 8.7 Blog Integration
Blog = owner of editorial content.

Guru использует только:
- geo-context tag projections
- deeplinks to filtered content collections

Guru не использует:
- raw post stream as nearby cards
- editorial feed as blended content surface

---

## 9. Request Lifecycle in Production

## 9.1 Request Intake
На входе:
- `mode`
- `lat`
- `lng`
- optional filters
- optional type restriction
- optional time constraints

### Validation
Валидируются:
- coordinates presence
- numeric bounds
- supported entity types
- valid booleans/enums
- radius sanity

---

## 9.2 Query Normalization
Внутренне строится `NearbyQuery`.

Примерно:

```ts
type NearbyQuery = {
  mode: 'real' | 'virtual'
  lat: number
  lng: number
  radius_m: number
  types?: EntityType[]
  time_window?: string
  open_now?: boolean
  verified_only?: boolean
  rf_only?: boolean
  limit?: number
}
```

---

## 9.3 Fan-out Phase
`guru-service` параллельно вызывает relevant adapters.

### Important Production Rule
Fan-out должен быть:
- bounded
- timeout-aware
- independently cancellable where appropriate
- observable

---

## 9.4 Normalization Phase
Каждый adapter response превращается в normalized internal projections, затем в `EntityCard`.

---

## 9.5 Aggregation Phase
Сервис объединяет:
- all cards
- partial failures
- request meta

---

## 9.6 Ranking Phase
Применяются ranking signals.

Порядок ranking должен быть воспроизводимым.

---

## 9.7 Filtering Phase
Применяются финальные Guru-level filters.

---

## 9.8 Response Phase
Возвращается `GuruListResponse`.

---

## 10. Graceful Degradation Model

Это один из важнейших production-принципов Guru.

### Production Rule
Один упавший upstream не должен ронять весь nearby-response.

### Следовательно
- timeout Pulse → still return Atlas + Rielt + others
- timeout Blog → still return object cards
- timeout Space → still return non-PRO results

### Partial Failure Shape
Частичные сбои отражаются явно:

```ts
type PartialFailure = {
  domain: 'atlas' | 'pulse' | 'rielt' | 'rf' | 'quest' | 'space' | 'blog'
  reason: string
}
```

### Value
Это даёт:
- устойчивость
- честность
- observability
- better UX than hard failure

---

## 11. Timeout Strategy

Каждый adapter call должен иметь собственный bounded timeout.

### Причина
Guru — aggregation service.  
Без bounded timeouts один медленный upstream легко ухудшает весь response path.

### Production Principle
- service-level latency важнее ожидания каждого домена до бесконечности
- stale partial response лучше, чем blocked response

---

## 12. Retry Strategy

В V1 retries должны быть минимальными и контролируемыми.

### Допустимо
- bounded retry only for clearly transient failures
- extremely conservative retry policy

### Недопустимо
- aggressive retry storms
- retry cascades multiplying load across all upstreams

Главный принцип:

> **Aggregation services should fail small, not amplify instability.**

---

## 13. Caching Strategy

Guru V1 допускает только **lightweight operational caching**.

## 13.1 What is allowed
- short-lived response cache
- small per-query cache
- repeated nearby request deduplication
- hot-area caching for read-heavy zones if justified

## 13.2 What is not allowed
- hidden domain storage
- long-lived replicated catalog of places/events/listings
- secondary truth store replacing upstream domains

### Production Principle
Cache допустим только как latency/reliability optimization, а не как новая ownership layer.

---

## 14. Statelessness

Production architecture V1 должна стремиться к stateless behavior.

### Это означает
- service instances are horizontally replaceable
- no critical in-memory ownership state
- no local-only business state required for correctness

### Допустимы
- ephemeral in-memory caches
- request-scope aggregation state
- diagnostics buffers if non-critical

---

## 15. Pagination and Result Size

Guru V1 — не endless catalog.

Следовательно:
- responses should be bounded
- limit-based output is preferred
- aggregation should avoid unbounded lists

### Production Rule
Сервис должен иметь:
- default limit
- hard max limit
- stable bounded output size

---

## 16. Sorting and Determinism

Sorting в Guru V1 принадлежит ranking pipeline, а не arbitrary client sort parameters.

### Production Requirement
Одинаковый запрос должен приводить к предсказуемому порядку выдачи при одинаковом upstream input.

Это важно для:
- debuggability
- UX trust
- QA reproducibility

---

## 17. EntityCard as Production Contract Boundary

Внутренний и внешний runtime boundary должен быть стабилизирован через `EntityCard`.

### Production Meaning
- adapters may vary
- upstream DTOs may evolve
- frontend remains stable if EntityCard remains stable

### Architectural Consequence
Любая нестабильность upstream domains должна останавливаться на adapter/normalization boundary, а не утекать в public API.

---

## 18. Blog and PRO as Special Production Cases

## 18.1 Blog Tags
Blog integration в production должна работать только как:
- geo-context tag cards
- deeplink-based context entries

Не как:
- raw editorial feed
- stream of posts on the map

---

## 18.2 PRO
Space integration в production должна работать только как:
- opt-in visible PRO projections
- filtered expert layer

Не как:
- all users
- full social presence map

---

## 19. Security Model

Guru V1 не должен:
- утекать private upstream fields
- раскрывать full social graph
- возвращать hidden source payloads
- иметь direct DB access to foreign domains

### Production Security Principle
Public response contains only projection-safe fields.

---

## 20. Observability Model

Production Guru должен быть хорошо наблюдаем.

Нужно наблюдать:

- request rate
- response latency
- upstream adapter latency
- adapter failure rate
- partial failure rate
- empty response rate
- per-entity-type output distribution

### Why it matters
Aggregation services сложно отлаживать без явной observability, потому что проблема может быть:
- в одном домене
- в normalization
- в ranking
- в filter rules
- в timeout budget

---

## 21. Logging Model

Логи должны помогать отвечать на вопросы:

- какой запрос пришёл
- какие adapters вызывались
- кто ответил успешно
- кто дал timeout/error
- сколько карточек пришло от каждого источника
- сколько попало в итоговый response
- были ли partial failures

### Важно
Логи не должны:
- раскрывать приватные данные
- превращаться в raw content dump

---

## 22. Metrics Model

Минимальные production metrics для Guru V1:

- total requests
- success responses
- partial-success responses
- full failures
- average latency
- p95 / p99 latency
- adapter timeout counts
- adapter error counts
- cards returned count
- cards by type count
- empty blended response count

---

## 23. Failure Domains

Production architecture должна явно понимать failure domains:

1. API input failure
2. one-upstream failure
3. multi-upstream partial failure
4. complete service failure
5. bad normalization
6. ranking/filter pipeline fault

### Design Goal
Изолировать failure impact максимально локально.

---

## 24. Deployment Properties

`guru-service` должен деплоиться как независимый сервис, не сливаясь:
- ни с Gateway
- ни с content-service
- ни с Geo Layer
- ни с frontend BFF code inside UI

### Production Value
Это даёт:
- независимое наблюдение
- независимую эволюцию
- независимое масштабирование
- чистую ownership boundary

---

## 25. Horizontal Scalability

Так как Guru V1:
- mostly stateless
- read-heavy
- aggregation-oriented

он должен масштабироваться горизонтально проще, чем domain-core сервисы с сильной statefulness.

### Preconditions
- bounded request size
- bounded fan-out
- no hidden local state dependency

---

## 26. Production Constraints Against Scope Drift

Чтобы production implementation не ушёл в ложную сторону, нужно жёстко зафиксировать запреты.

### Forbidden in Production V1
- own geo canon
- own search index
- ML ranking engine
- recommendation profile engine
- direct persistence of domain truth
- cross-domain business transaction orchestration
- map/navigation platform responsibilities
- full social aggregation

---

## 27. Relation to Other SSOT Documents

### Связь с `guru_backend_architecture_v_1.md`
Там фиксируется роль сервиса и его границы.  
Здесь — как этот сервис реально работает в проде.

### Связь с `guru_dependency_map_v_1.md`
Там фиксируются зависимости.  
Здесь — как они operationally orchestrated.

### Связь с `guru_domain_model_v_1.md`
Там фиксируются внутренние модели.  
Здесь — как они живут в runtime lifecycle.

### Связь с `guru_openapi_outline_v_1.md`
Там фиксируется API surface.  
Здесь — production path его выполнения.

### Связь с `guru_entity_card_v1.md`
Там фиксируется единый card contract.  
Здесь — как production pipeline приводит всё к этому контракту.

---

## 28. Minimal Production Readiness Criteria

Guru V1 можно считать production-ready только если соблюдены минимум следующие условия:

1. Stable public API surface exists  
2. Adapter boundaries exist for each enabled upstream  
3. EntityCard normalization is stable  
4. Ranking is explainable and deterministic  
5. Partial failures do not break blended responses  
6. Service-level timeouts are bounded  
7. Observability is sufficient to debug upstream instability  
8. No forbidden ownership creep is introduced  

---

## 29. Key Architectural Constraint

> **Production architecture Guru должна усиливать nearby-ценность экосистемы, оставаясь тонким, наблюдаемым и отказоустойчивым aggregation слоем, а не превращаясь в скрытый монолит, который владеет чужими данными, логикой и географией.**

---

## 30. Final Definition

> **Guru Service Production Architecture v1** определяет `guru-service` как stateless nearby-first aggregation/BFF сервис, который через bounded fan-out к доменным API Go2Asia собирает blended nearby-context, нормализует его в `EntityCard`, применяет explainable ranking и фильтрацию, устойчиво переживает частичные сбои upstream-доменов и возвращает единый projection-oriented ответ без захвата ownership над доменными сущностями, географией, поиском или социальным графом.

---
