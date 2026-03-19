# Guru Dependency Map v1  
**Dependency Map for Guru Asia / guru-service (Go2Asia)**

---

## 1. Purpose

Документ фиксирует карту зависимостей модуля **Guru Asia** и backend-сервиса **guru-service** на уровне V1.

Цель:

> **Явно определить, от каких доменов Guru читает данные, куда он направляет пользователя, какие зависимости допустимы, а какие запрещены.**

Для Guru это критично, потому что он является **aggregation/BFF слоем** и почти целиком строится на корректно ограниченных зависимостях.

---

## 2. Dependency Philosophy

Guru не является source of truth и не владеет доменными сущностями.

Следовательно:

- Guru **читает** из доменных сервисов
- Guru **не пишет** доменные данные напрямую
- Guru **не обращается** к чужим БД
- Guru **не подменяет** Atlas, Pulse, Rielt, RF, Quest, Space, Blog
- Guru **не создаёт** собственный Geo Layer в V1

Главный принцип:

> **Guru orchestrates, but does not own.**

---

## 3. Dependency Layers

Зависимости Guru нужно понимать в четырёх слоях:

1. **Upstream dependencies**  
   Домены, из которых Guru получает данные

2. **Downstream dependencies**  
   Клиенты, которые используют Guru-ответ

3. **Navigation dependencies**  
   Домены, в которые Guru направляет пользователя через deeplink/actions

4. **Forbidden dependencies**  
   Связи, которые запрещены архитектурно

---

## 4. High-Level Dependency View

```text
Frontend Guru UI
    ↓
API Gateway
    ↓
guru-service
    ↓
 ┌────────┬────────┬────────┬───────┬────────┬────────┬───────┐
 Atlas    Pulse    Rielt     RF      Quest    Space    Blog
 places   events   listings  partner quests   PRO      geo-tags
```

---

## 5. Core Dependency Rule

### Guru depends on domains as readers only

Guru строит unified nearby-ответ на основе domain APIs.

Это означает:

- Atlas остаётся владельцем places и geo canon
- Pulse остаётся владельцем events
- Rielt остаётся владельцем listings
- RF остаётся владельцем partner layer
- Quest остаётся владельцем quests/activity logic
- Space остаётся владельцем user/pro identity
- Blog остаётся владельцем posts/editorial content

Guru только:
- получает данные
- нормализует
- ранжирует
- фильтрует
- возвращает projection

---

## 6. Upstream Dependencies

## 6.1 Atlas

### Роль Atlas для Guru
Atlas даёт Guru:

- places
- canonical geography
- place identity
- city / country references
- spatial grounding

### Что Guru читает из Atlas
В V1 Guru читает только данные, нужные для nearby experience:

- places nearby
- minimal place card data
- canonical geo refs
- optional place category / tags / rating / open signals

### Что Guru не должен брать из Atlas
- полный editorial body
- внутренние Atlas-only structures
- non-public internals
- direct DB access

### Архитектурная роль
Atlas для Guru = **geo/content SSOT**

---

## 6.2 Pulse

### Роль Pulse для Guru
Pulse даёт Guru:

- events
- time relevance
- current / upcoming activity layer

### Что Guru читает из Pulse
- nearby events
- event schedule basics
- venue relation
- starts_at / ends_at
- minimal pricing / meta if available

### Что Guru не должен делать
- не владеет event lifecycle
- не считает себя event-service
- не хранит event truth locally

### Архитектурная роль
Pulse для Guru = **temporal activity supply**

---

## 6.3 Rielt

### Роль Rielt для Guru
Rielt даёт Guru:

- listings nearby
- practical housing utility
- bridge from discovery to accommodation decision

### Что Guru читает из Rielt
- nearby listings
- price
- currency
- rooms / area if available
- geo position
- media thumbnail
- deeplink to listing

### Особый статус
На текущем этапе Rielt — наиболее готовый real nearby-source для Guru V1.

### Архитектурная роль
Rielt для Guru = **practical supply layer**

---

## 6.4 RF (Russian Friendly / Partner Layer)

### Роль RF для Guru
RF даёт Guru:

- partner locations
- trust / convenience layer
- voucher / offer entry points
- partner utility

### Что Guru читает из RF
- partner points
- offer/voucher availability
- verification / partner signals
- partner deeplink

### Важно
Guru не реализует partner logic самостоятельно.

### Архитектурная роль
RF для Guru = **commercial utility layer**

---

## 6.5 Quest

### Роль Quest для Guru
Quest даёт Guru:

- nearby activities
- action scenarios
- movement incentives
- participation layer

### Что Guru читает из Quest
- quests nearby
- minimal quest metadata
- difficulty / reward hints
- target relation if relevant
- deeplink to quest

### Что Guru не делает
- не ведёт quest progress
- не начисляет rewards
- не становится activity engine

### Архитектурная роль
Quest для Guru = **activity layer**

---

## 6.6 Space

### Роль Space для Guru
Space даёт Guru не social feed и не всех пользователей, а только:

- **видимых PRO-спейсеров**
- которые включили opt-in visibility
- и релевантны текущей географии

### Что Guru читает из Space
- visible PRO profiles
- expertise / languages / contact availability
- city/location relevance
- deeplink to PRO profile or contact flow

### Жёсткое ограничение
Guru не должен получать:

- весь social graph
- обычных пользователей
- общий feed
- приватные social данные

### Архитектурная роль
Space для Guru = **local expert layer**

---

## 6.7 Blog

### Роль Blog для Guru
Blog даёт Guru не поток постов, а:

- geo-context tag entry points
- editorial/contextual layer for selected geography

### Что Guru читает из Blog
- geo-tag collections
- tag deeplinks
- tag level:
  - city
  - district
  - street / square / other local element

### Жёсткое ограничение
Guru не должен:
- показывать raw posts как обычные nearby cards
- превращаться в content feed
- смешивать post cards с place/event/listing cards

### Архитектурная роль
Blog для Guru = **context layer via tags**

---

## 7. Downstream Dependencies

## 7.1 Frontend Guru UI

Главный downstream клиент Guru:

- карта
- список
- split-view
- filters
- mode switch (real / virtual)
- nearby discovery surfaces

Frontend зависит от Guru как от единого aggregated response provider.

Guru должен отдавать фронту:

- unified EntityCard[]
- explainability signals
- filter-compatible response
- stable API contract

### Критическое правило
Frontend не должен знать внутренние DTO всех доменов.

Иначе aggregation boundary разрушается.

---

## 7.2 API Gateway

Guru подключается к клиентам через API Gateway.

### Gateway role
- routing
- auth/context propagation
- observability / request boundary
- public API surface

### Важно
Gateway не должен брать на себя aggregation.

Aggregation живёт в guru-service.

---

## 8. Navigation Dependencies

После получения выдачи Guru направляет пользователя в целевые домены через actions/deeplinks.

Это допустимые navigation dependencies.

### Atlas
- view_in_atlas
- open place

### Pulse
- view_in_pulse
- open event

### Rielt
- view_in_rielt
- open listing

### RF
- open_partner
- open offer/voucher flow

### Quest
- start_quest
- open quest

### Space
- contact_pro
- open pro profile

### Blog
- view_in_blog
- open geo-tag collection

---

## 9. Optional Platform-Level Dependencies

В V1 эти зависимости не являются центральными и не должны формировать core architecture Guru.

## 9.1 Reactions
Допустимы в будущем как слабый внешний сигнал:

- likes / saves summary
- engagement hint

Но не как core dependency V1.

## 9.2 Points / Connect
Допустимы в будущем как external effect:

- activity events
- reward signals
- gamification hooks

Но Guru не должен становиться points-aware domain service.

## 9.3 Preferences / Saved
Возможны позже, но не должны усложнять V1 architecture.

---

## 10. Dependency Strength Classification

| Dependency | Type | Strength | V1 Status |
|------|------|------|------|
| Atlas | upstream | critical | required |
| Pulse | upstream | high | required / phased |
| Rielt | upstream | critical | required |
| RF | upstream | medium | phased |
| Quest | upstream | medium | phased |
| Space (PRO only) | upstream | medium | phased |
| Blog (tags only) | upstream | medium | phased |
| Frontend Guru UI | downstream | critical | required |
| API Gateway | infra | critical | required |
| Reactions | optional | low | deferred |
| Points / Connect | optional | low | deferred |

---

## 11. Dependency Direction Rules

Допустимое направление зависимостей:

```text
Frontend → Gateway → guru-service → domain APIs
```

Недопустимое направление:

```text
Frontend → domain APIs directly
guru-service → foreign DB
guru-service → Geo Layer (in V1)
domain services → guru-service as source of truth
```

---

## 12. Forbidden Dependencies

Ниже перечислены зависимости, которые запрещены в V1.

### 12.1 Direct DB Access
Guru не имеет права:
- читать таблицы Atlas / Pulse / Rielt / RF / Quest / Space / Blog напрямую
- делать межсервисные DB join’ы
- использовать shared-table coupling

### 12.2 Geo Ownership
Guru не должен:
- создавать собственный canonical geo model
- хранить parallel location truth
- становиться geo platform

### 12.3 Search Ownership
Guru не должен:
- иметь собственный full-text index
- заменять search service
- превращаться в universal discovery engine beyond nearby

### 12.4 Social Ownership
Guru не должен:
- читать полный Space feed
- показывать всех пользователей
- строить “карту людей” вместо nearby utility layer

### 12.5 Content Feed Ownership
Guru не должен:
- подменять Blog
- строить mixed media feed из raw posts
- превращаться в editorial surface

### 12.6 Business Logic Takeover
Guru не должен:
- считать quest progress
- бронировать listings
- выдавать vouchers
- выполнять domain actions internally

---

## 13. Dependency Constraints by Integration

## 13.1 Atlas Constraint
Guru depends on Atlas for geography, but does not own geography.

## 13.2 Pulse Constraint
Guru depends on Pulse for events, but does not become event planner.

## 13.3 Rielt Constraint
Guru depends on Rielt for nearby housing, but does not become real-estate platform core.

## 13.4 RF Constraint
Guru depends on RF for partner utility, but does not become partner commerce engine.

## 13.5 Quest Constraint
Guru depends on Quest for activities, but does not become quest engine.

## 13.6 Space Constraint
Guru depends on Space only through visible PRO projection, not through full social graph.

## 13.7 Blog Constraint
Guru depends on Blog through geo-context tags only, not through raw post streams.

---

## 14. Real Mode / Virtual Mode Dependency Invariance

Оба spatial режима используют одну и ту же карту зависимостей.

Меняется только входная точка координат:

```text
Real Mode    → coordinates from actual user position
Virtual Mode → coordinates from selected map point
```

Все upstream зависимости остаются теми же:

- те же домены
- тот же fan-out
- тот же normalization layer
- тот же output contract

Это важно, потому что Virtual Mode не должен создавать новый сервисный контур.

---

## 15. Dependency Map by Entity Type

| Entity Type | Source Domain | Notes |
|------|------|------|
| place | Atlas | canonical place supply |
| event | Pulse | temporal layer |
| listing | Rielt | nearby housing |
| partner | RF | partner utility |
| quest | Quest | activity layer |
| pro | Space | PRO only + opt-in |
| blog_tag | Blog | geo-context tags only |

---

## 16. Dependency Map by Responsibility

| Responsibility | Owner |
|------|------|
| geography truth | Atlas |
| places truth | Atlas |
| events truth | Pulse |
| listings truth | Rielt |
| partner truth | RF |
| quest truth | Quest |
| PRO/user truth | Space |
| editorial/content truth | Blog |
| aggregation | Guru |
| ranking | Guru |
| filtering | Guru |
| nearby response composition | Guru |

---

## 17. Key Architectural Constraint

> **Guru должен зависеть от доменов так, чтобы усиливать их совместную ценность, но не размывать их ownership и не создавать параллельные центры истины.**

---

## 18. Final Definition

> **Guru Dependency Map v1** фиксирует Guru как тонкий aggregation/BFF слой, который читает данные из доменных APIs Go2Asia, нормализует их в EntityCard и направляет пользователя обратно в доменные модули через deeplink/actions, не получая ownership ни над доменными сущностями, ни над географией, ни над социальным или контентным графом.

---
