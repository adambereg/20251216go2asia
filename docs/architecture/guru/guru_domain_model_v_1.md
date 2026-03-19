# Guru Domain Model v1  
**Domain Model for Guru Asia / guru-service (Go2Asia)**

---

## 1. Purpose

Документ фиксирует **доменную модель Guru V1**.

Для Guru доменная модель понимается не как классическая модель владения собственными сущностями, а как **модель проекций, агрегирующих структур и внутренних контрактов**, необходимых для работы nearby-first aggregation/BFF слоя.

Цель документа:

> **Зафиксировать, какие сущности и внутренние модели реально существуют внутри Guru V1, какие из них являются каноническими для самого Guru, а какие остаются внешними domain-owned сущностями.**

---

## 2. Key Modeling Principle

Guru **не является source of truth** для places, events, listings, partners, quests, users или posts.

Следовательно, Guru Domain Model V1 строится вокруг:

- unified projection model
- ranking/explainability model
- action/deeplink model
- query/filter model
- source attribution model
- optional lightweight internal state only where absolutely needed

Главный принцип:

> **Guru owns projections, not domain truth.**

---

## 3. Boundary of the Domain Model

## 3.1 What belongs to Guru domain model

Внутри Guru как сервиса допустимы только те модели, которые нужны для:

- агрегирования разнородных доменных данных
- нормализации в единый nearby-ответ
- фильтрации
- ранжирования
- объяснения причин показа
- возврата пользователя в нужный домен через deeplink/actions

---

## 3.2 What does NOT belong to Guru domain model

В Guru V1 **не входят как собственные сущности**:

- place
- event
- listing
- partner
- quest
- user/profile
- blog post
- canonical geo object

Эти сущности принадлежат upstream domains.

Guru видит их только как **проекции для nearby experience**.

---

## 4. Core Domain Shape

Guru V1 состоит из следующих смысловых слоёв:

1. **Entity Projection Layer**  
   Единая карточка сущности: `EntityCard`

2. **Source Attribution Layer**  
   Откуда пришла карточка и каким доменом она владеется

3. **Explainability Layer**  
   Почему карточка показана пользователю

4. **Action Layer**  
   Куда пользователь может перейти дальше

5. **Spatial Query Layer**  
   Относительно какой точки и с какими фильтрами строится nearby-ответ

6. **Optional Lightweight Internal State**  
   Только в объёме, который не превращает Guru в stateful domain core

---

## 5. Primary Guru Entity

## 5.1 EntityCard v1

Главная сущность Guru V1:

```ts
type EntityCard = {
  id: string
  type: EntityType

  title: string
  subtitle?: string
  description?: string

  image_url?: string

  lat?: number
  lng?: number
  distance_m?: number

  city_id?: string
  country_id?: string

  tags?: string[]

  rating?: number
  price_level?: number

  is_verified?: boolean
  is_rf?: boolean
  is_open_now?: boolean

  starts_at?: string

  explain?: ExplainBlock
  actions?: EntityAction[]

  source: SourceRef
  payload?: Record<string, unknown>
}
```

👉 Подробный контракт фиксируется в отдельном SSOT-файле:  
`guru_entity_card_v1.md`

---

## 5.2 Why EntityCard is the core entity

EntityCard — это не “view model на фронте”, а **главная projection-сущность Guru**.

Именно вокруг неё строятся:

- агрегация
- нормализация
- ранжирование
- фильтрация
- карты
- списки
- split-view
- explainability UI

Главный принцип:

> **Guru не оперирует domain DTO напрямую на внешней границе сервиса. Guru оперирует EntityCard.**

---

## 6. Entity Types

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

## 7. Source Attribution Model

Поскольку Guru агрегирует данные из разных доменов, внутри его domain model обязательно нужна явная модель происхождения сущности.

```ts
type SourceDomain =
  | 'atlas'
  | 'pulse'
  | 'rielt'
  | 'rf'
  | 'quest'
  | 'space'
  | 'blog'

type SourceRef = {
  domain: SourceDomain
  source_id: string
  source_slug?: string
}
```

### Назначение SourceRef
- трассировка происхождения карточки
- корректное deeplink/navigation поведение
- observability/debugging
- защита от потери ownership

Главный принцип:

> **Каждая карточка Guru должна сохранять связь со своим доменом-владельцем.**

---

## 8. Explainability Model

Guru обязан не просто показать карточку, но и объяснить, почему она попала в nearby-выдачу.

```ts
type ExplainReason =
  | 'nearby'
  | 'happening_now'
  | 'starting_soon'
  | 'verified'
  | 'partner'
  | 'popular'
  | 'recommended'
  | 'new'

type ExplainBlock = {
  reasons: ExplainReason[]
}
```

### Роль Explainability
Explainability — это не косметика, а часть доменной модели Guru, потому что Guru — explainable aggregation layer.

Explainability нужна для:

- UI-пояснений
- детерминированного ranking outcome
- защиты от “чёрного ящика”
- будущих rule-based boosts

---

## 9. Action Model

Guru не исполняет domain actions внутри себя, а только возвращает пользователю допустимые маршруты в другие модули.

```ts
type EntityActionType =
  | 'open'
  | 'navigate'
  | 'book'
  | 'view_in_atlas'
  | 'view_in_pulse'
  | 'view_in_rielt'
  | 'open_partner'
  | 'start_quest'
  | 'contact_pro'
  | 'view_in_blog'

type EntityAction = {
  type: EntityActionType
  label: string
  deeplink: string
}
```

### Роль Action Model
- связывает nearby discovery с целевым domain action
- сохраняет Guru как navigation/orchestration layer
- не допускает business logic takeover

---

## 10. Spatial Query Model

Guru работает в двух режимах пространственного присутствия:

- Real Mode
- Virtual Mode

Следовательно, в domain model нужна явная сущность запроса nearby-контекста.

```ts
type PresenceMode = 'real' | 'virtual'

type NearbyQuery = {
  mode: PresenceMode
  lat: number
  lng: number
  radius_m?: number
  types?: EntityType[]
  time_window?: string
}
```

### Назначение NearbyQuery
- единый входной контракт для guru-service
- поддержка real/virtual режима без раздвоения сервиса
- консистентность fan-out и ranking pipeline

---

## 11. Filter Model

Filters — это часть внутренней модели Guru, потому что сервис не просто собирает карточки, а строит curated nearby-response.

```ts
type NearbyFilterSet = {
  types?: EntityType[]
  radius_m?: number
  category_tags?: string[]
  open_now?: boolean
  verified_only?: boolean
  rf_only?: boolean
  time_window?: string
}
```

### Важно
Фильтры принадлежат Guru только как **projection/filter layer**, а не как доменная модель upstream-объектов.

---

## 12. Ranking Model

Ranking в Guru V1 является rule-based и explainable.

Внутри domain model допустимо зафиксировать внутреннюю модель ranking signals.

```ts
type RankingSignals = {
  distance_score?: number
  time_score?: number
  verification_score?: number
  partner_score?: number
  freshness_score?: number
}
```

### Важно
- эти сигналы — внутренний слой Guru
- они не являются public domain truth
- они не заменяют ExplainBlock
- они служат для сборки детерминированного ranking outcome

---

## 13. Domain-specific Projection Shapes

Хотя внешняя граница Guru использует только EntityCard, внутри projection layer допустимы type-specific payload blocks.

Это **не domain ownership**, а типизированные расширения проекции.

---

## 13.1 Place Projection

```ts
type PlacePayload = {
  category?: string
  address?: string
}
```

Источник: Atlas

---

## 13.2 Event Projection

```ts
type EventPayload = {
  ends_at?: string
  venue?: string
  price?: number
  currency?: string
}
```

Источник: Pulse

---

## 13.3 Listing Projection

```ts
type ListingPayload = {
  price?: number
  currency?: string
  rooms?: number
  area_m2?: number
}
```

Источник: Rielt

---

## 13.4 Partner Projection

```ts
type PartnerPayload = {
  partner_id?: string
  offer?: string
  voucher_available?: boolean
}
```

Источник: RF

---

## 13.5 Quest Projection

```ts
type QuestPayload = {
  difficulty?: string
  reward_points?: number
}
```

Источник: Quest

---

## 13.6 PRO Projection

```ts
type ProPayload = {
  user_id?: string
  expertise?: string[]
  languages?: string[]
  contact_available?: boolean
}
```

Источник: Space

### Жёсткое ограничение
PRO-проекция допустима только если одновременно выполнено:

- пользователь имеет статус PRO
- пользователь включил opt-in visibility
- профиль разрешён для показа в Guru

---

## 13.7 Blog Tag Projection

```ts
type BlogTagPayload = {
  tag: string
  level: 'city' | 'district' | 'street'
  deeplink: string
}
```

Источник: Blog

### Важно
BlogTag — это **не post entity**.  
Это ссылка в контекстный слой Blog Asia.

---

## 14. Blog Tag as a Special Domain Shape

`blog_tag` — особый тип внутри domain model Guru.

Он отличается от остальных тем, что:

- это не “объект nearby” в классическом смысле
- это не карточка места/события/жилья
- это контекстная geo-entry point сущность

Поэтому `blog_tag` должен моделироваться отдельно и не смешиваться с object-like entities.

---

## 15. PRO as a Special Domain Shape

`pro` тоже является особым типом.

Это **не просто пользователь**.

Это curated projection локального эксперта:

- пользователь со статусом PRO
- включённая видимость
- потенциальная роль проводника / локального эксперта / входа в квесты и партнёрские действия

Следовательно, Guru domain model не содержит “user” как сущность.
Он содержит только `pro` как разрешённую nearby-проекцию.

---

## 16. Internal Aggregate Shape

Guru может оперировать временным агрегированным контейнером результата до финальной выдачи.

```ts
type NearbyAggregate = {
  query: NearbyQuery
  cards: EntityCard[]
  partial_failures?: PartialFailure[]
}
```

```ts
type PartialFailure = {
  domain: SourceDomain
  reason: string
}
```

### Назначение
- graceful degradation
- observability
- partial response handling

---

## 17. Optional Lightweight Internal State

Guru V1 должен оставаться по сути stateless.

Но допустим минимальный внутренний state, если он не ломает архитектурную границу.

### Допустимо:
- response cache
- short-lived aggregation cache
- request correlation metadata

### Недопустимо:
- копирование domain truth
- собственный persistent catalog places/events/listings
- собственная social graph storage
- собственная editorial storage

---

## 18. Persistence Model

### V1 Default
Guru не обязан иметь богатую собственную persistence model.

Если persistence вообще появляется в V1, она должна быть ограничена только служебными целями:

- lightweight cache
- request diagnostics
- optional precomputed projections only if justified

### Жёсткое ограничение
Persistence Guru не должна превращать его в hidden domain storage.

---

## 19. Ownership Matrix

| Model | Owner |
|------|------|
| place | Atlas |
| event | Pulse |
| listing | Rielt |
| partner | RF |
| quest | Quest |
| pro identity | Space |
| blog content | Blog |
| canonical geography | Atlas |
| EntityCard | Guru |
| ExplainBlock | Guru |
| EntityAction | Guru |
| NearbyQuery | Guru |
| RankingSignals | Guru |
| NearbyAggregate | Guru |

---

## 20. Domain Model Constraints

## 20.1 No Domain Truth Duplication
Guru не дублирует канонические сущности доменов.

## 20.2 No Geo Canon Duplication
Guru не владеет geo canon.

## 20.3 No Hidden Search Model
Guru не строит отдельную search model beyond nearby.

## 20.4 No Social Graph Model
Guru не содержит модель “всех пользователей”.

## 20.5 No Editorial Feed Model
Guru не содержит поток постов как свою сущность.

---

## 21. Real Mode / Virtual Mode Invariance

Обе spatial модели используют **одну и ту же доменную модель Guru**.

Меняется только `NearbyQuery.mode` и источник координат.

Это важно, потому что:

- Virtual Mode не создаёт новый поддомен
- Real Mode и Virtual Mode используют одни и те же сущности
- не возникает раздвоения backend architecture

---

## 22. Relation to Other SSOT Documents

### Связь с `guru_backend_architecture_v_1.md`
Там фиксируются границы сервиса и architectural role Guru.  
Здесь — модель сущностей и проекций внутри этих границ.

### Связь с `guru_dependency_map_v_1.md`
Там фиксируется, откуда приходят доменные данные.  
Здесь — во что они превращаются внутри Guru.

### Связь с `guru_entity_card_v1.md`
Там фиксируется публичный unified card contract.  
Здесь — место EntityCard в общей domain model Guru.

### Связь с `guru_openapi_outline_v_1.md`
Там будет зафиксировано, как NearbyQuery и EntityCard участвуют в API surface.

---

## 23. Out of Scope for V1 Domain Model

Вне domain model V1 остаются:

- AI personalization
- recommendation profile
- user long-term preferences
- saved entities as fully-fledged subdomain
- social relationship graph
- content ranking ML model
- booking/payment objects
- domain-owned business process models

---

## 24. Key Architectural Constraint

> **Domain model Guru должна оставаться моделью проекций и orchestration-структур, а не разрастаться в самостоятельную предметную область, конкурирующую с основными доменами Go2Asia.**

---

## 25. Final Definition

> **Guru Domain Model v1** — это ограниченная доменная модель aggregation/BFF слоя, в центре которой находится `EntityCard` как унифицированная nearby-проекция, а также связанные с ней модели происхождения, explainability, действий, spatial query и rule-based ranking. Эта модель не владеет доменной истиной и не дублирует канонические сущности других сервисов Go2Asia.

---
