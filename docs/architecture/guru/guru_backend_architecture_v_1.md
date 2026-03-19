# Guru Backend Architecture v1  
**Architecture Definition for guru-service (Go2Asia)**

---

## 1. Purpose

Документ фиксирует архитектуру backend-части модуля **Guru Asia** на уровне V1.

Цель:

> **Определить guru-service как строго ограниченный aggregation/BFF слой, исключив архитектурное расползание (geo-service, search, AI orchestration и т.д.)**

---

## 2. Scope

### Входит в scope:
- guru-service как backend сервис
- aggregation логика (fan-out)
- нормализация в EntityCard
- ranking
- filtering
- explainability
- graceful degradation

### Не входит в scope:
- хранение доменных сущностей
- владение географией
- full-text search
- AI персонализация
- социальный feed
- booking / payments

---

## 3. Definition of Guru

### Guru Asia (Module)

Guru Asia — это nearby-first интерфейс, агрегирующий данные из всех доменов Go2Asia.

---

### guru-service (Backend)

```text
guru-service = aggregation/BFF layer
```

Функции:

- принимает координаты (real или virtual)
- делает fan-out к доменам
- нормализует данные → EntityCard
- ранжирует
- фильтрует
- возвращает unified response

---

## 4. Core Principles

### 4.1 Not a Source of Truth

- guru-service **не владеет данными**
- все данные принадлежат доменным сервисам

---

### 4.2 Aggregation Layer Only

- никакой бизнес-логики доменов
- только orchestration + projection

---

### 4.3 No Geo Ownership

- Atlas = SSOT для географии
- guru-service не создаёт geo layer

---

### 4.4 No Search Engine

- нет full-text search
- нет индексации
- только nearby + filters

---

### 4.5 No AI in V1

- ranking = rule-based
- explainable
- детерминированный

---

## 5. Spatial Model

Guru работает в двух режимах:

### Real Mode
```text
lat/lng = user_location
```

### Virtual Mode
```text
lat/lng = selected_point
```

👉 Вся логика одинаковая, меняется только источник координат

---

## 6. High-Level Flow

```text
Client → API Gateway → guru-service

guru-service:
  1. Validate input
  2. Fan-out to upstream services
  3. Normalize → EntityCard
  4. Merge results
  5. Rank
  6. Filter
  7. Return response
```

---

## 7. Fan-out Strategy

### V1 = Direct Fan-out

```text
guru-service → domain services (HTTP)
```

### Upstream services:

- Atlas (places)
- Pulse (events)
- Rielt (listings)
- RF (partners)
- Quest (quests)
- Space (PRO only)
- Blog (tags only)

---

### Important Constraint

- **никаких промежуточных слоёв**
- **никакого Geo Service в V1**

---

## 8. Data Normalization

Все upstream ответы приводятся к:

```text
EntityCard v1
```

👉 см. `guru_entity_card_v1.md`

---

## 9. Ranking Model

### Explainable Ranking

Сигналы:

- distance
- time relevance
- verified
- partner signals
- optional boosts

---

### Принцип:

> Пользователь должен понимать, почему он видит карточку

---

## 10. Filtering

Поддержка:

- radius
- type (place/event/listing/etc)
- time (events)
- attributes (future)

---

## 11. Graceful Degradation

Guru обязан работать при частичной недоступности доменов.

### Правила:

- если один сервис упал → не ломаем ответ
- возвращаем частичный результат
- не блокируем выдачу

---

## 12. Actions Delegation

Guru не выполняет действия.

Он только возвращает:

```text
actions → deeplink → domain
```

Примеры:

- view_in_atlas
- view_in_pulse
- view_in_rielt
- start_quest
- contact_pro

---

## 13. PRO Visibility Model (Space Integration)

Guru работает только с:

```text
visible_pro = PRO + opt-in visibility
```

Исключается:
- весь user graph
- обычные пользователи

---

## 14. Blog Integration Model

Guru не показывает посты.

Использует:

```text
geo-context tags → deeplink → Blog Asia
```

---

## 15. State Management

V1 — stateless service

Допустимо (опционально):
- lightweight caching
- request-level aggregation

---

## 16. Forbidden Patterns

❌ Хранение доменных данных  
❌ Собственный geo layer  
❌ Full-text search  
❌ ML/AI ranking  
❌ Social feed aggregation  
❌ Direct DB access к другим сервисам  
❌ Tight coupling с frontend DTO  

---

## 17. Future Evolution (Out of Scope V1)

- Geo Service (platform layer)
- AI ranking / personalization
- recommendations engine
- user preferences
- saved entities
- cross-session memory

---

## 18. Key Architectural Constraint

> Guru должен оставаться **тонким aggregation слоем**, а не превращаться в центральный “мозг системы”.

---

## 19. Final Definition

> **guru-service v1 — это stateless aggregation/BFF сервис, выполняющий fan-out к доменным сервисам Go2Asia, нормализующий результаты в EntityCard, ранжирующий их по explainable правилам и возвращающий unified nearby-ответ без владения данными, географией или бизнес-логикой доменов.**

---
