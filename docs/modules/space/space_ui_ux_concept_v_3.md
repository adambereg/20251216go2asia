# Space Asia v3 — концепция фронтенда и UX/UI

**Project:** Go2Asia  
**Module:** Space Asia  
**Document role:** Product + UX/UI SSOT для фронтенд-концепции Space Asia (v3)  
**Status:** Draft for design & frontend alignment

---

# 1. Purpose

Этот документ фиксирует актуальную концепцию фронтенда и UX/UI модуля **Space Asia v3**.

Он отражает переход от:

- классической социальной модели (feed-centric)

к

- модели **User Operating System внутри экосистемы Go2Asia**.

Документ используется как:

- основа для UX/UI дизайна
- база для frontend-разработки
- продуктовый SSOT для Space Asia

---

# 2. Новое определение Space Asia

Space Asia больше не является просто социальной сетью.

> **Space Asia = персональная операционная система пользователя внутри Go2Asia**

Он объединяет:

- Social Layer
- Personal Coordination Layer
- Ecosystem Signals
- AI Assistant Layer
- Identity & Reputation Layer

---

# 3. Главный UX-сдвиг

## Было

- пользователь читает
- пользователь пишет
- пользователь лайкает

## Стало

- пользователь действует
- пользователь планирует
- пользователь управляет своей активностью
- пользователь развивается внутри экосистемы

---

## Ключевой вопрос Space

> **"Что мне сейчас делать?"**

А не:

> "Что происходит?"

---

# 4. Главная архитектурная идея UI

## Dashboard-first подход

## Было

- Feed = главный экран

## Теперь

- Dashboard = главный экран
- Feed = один из режимов

---

# 5. Структура Space Asia v3

## Layer 1 — Dashboard (User Cockpit)

Центральный экран пользователя.

### Содержит:

#### A. User Header
- аватар
- имя
- статус (Spacer / VIP / PRO)
- базовые метрики

#### B. Today
- задачи сегодня
- события
- напоминания

#### C. Next Actions (ключевой блок)

Что делать дальше:

- ответить на заявку
- завершить квест
- посетить место
- использовать ваучер

#### D. Organizer Preview
- 3–5 ближайших задач
- быстрый переход

#### E. Ecosystem Signals

Состояние пользователя в системе:

- Points
- NFT
- Referrals
- Quest progress
- PRO progress

#### F. Social Pulse

- реакции
- комментарии
- активность

#### G. AI Assistant

- предложения
- напоминания
- рекомендации

#### H. PRO Widget (для PRO)

- задачи PRO
- быстрый переход в PRO Console

---

# 6. Feed

Feed перестаёт быть центром.

## Роль

> Просмотр социальной активности

---

## Характеристики

- curated stream
- минимум шума
- больше контекста

---

## Типы контента

- посты
- репосты
- place / event / quest / article
- групповой контент

---

## Фильтры

- Following
- Groups
- Around Me
- Curated

---

# 7. Organizer

## Новый смысл

> Execution Layer пользователя

---

## Основные зоны

### 1. Timeline
- сегодня
- завтра
- неделя

### 2. Plans
- поездки
- маршруты

### 3. Actions
- заявки
- действия

### 4. Signals
- дедлайны
- напоминания

### 5. Growth
- VIP
- PRO
- цели

---

## Состояния задач

- manual
- assisted
- automated

---

## Основной принцип

Каждый элемент — это **actionable entity**

---

# 8. Saved

## Новый смысл

> Источник действий

---

## Поведение

- Save → Organizer
- Save → Plan
- Save → AI action

---

# 9. Community

## Новый смысл

> Структура экосистемы

---

## Типы групп

- гео
- тематические
- событийные
- квестовые
- PRO-группы

---

# 10. Profile

## Новый смысл

> Социальная идентичность

---

## Содержит

- репутация
- активность
- контент
- статус

---

## Для PRO

- портфолио
- влияние
- группы
- квесты

---

# 11. AI Assistant Layer

## Новый уровень

AI — это не фича, а слой управления

---

## Где он живёт

- Dashboard
- Organizer
- Assistant panel

---

## Типы действий

### Passive
- напомнить

### Assistive
- предложить

### Active
- выполнить

---

## Примеры

- "Собрать маршрут?"
- "Отправить заявку?"
- "Добавить в план?"

---

# 12. PRO Console

## Двухконтурная модель

```text
Space = жизнь
PRO Console = работа
```

---

## PRO Console включает

- Events
- Quests
- Groups
- Partners
- Moderation
- Analytics
- PRO Organizer

---

## Связь с Space

- через Dashboard
- через PRO Widget

---

# 13. UX принципы

## 1. Action-first

## 2. Context-first

## 3. Calm UI

## 4. Structured over chaos

## 5. AI visible but not intrusive

---

# 14. Главное изменение

> Space — это не соцсеть

> Space — это интерфейс управления жизнью пользователя

---

# 15. Сравнение v2 → v3

| Было | Стало |
|------|------|
| Social module | User OS |
| Feed центр | Dashboard центр |
| Saved | Action source |
| Organizer | Execution system |
| AI | Assistant layer |
| PRO | Второй контур |

---

# 16. Итог

> **Space Asia v3 — это центр пользовательской активности, планирования, социальной жизни и взаимодействия с AI внутри экосистемы Go2Asia.**

Это главный пользовательский интерфейс платформы.

---

# 17. Use in Monorepo

Рекомендуемое размещение:

```text
docs/modules/space/space_ui_ux_concept_v3.md
```

Этот документ должен использоваться:

- frontend-разработчиками
- дизайнерами
- product-level решениями

И не должен смешиваться с backend архитектурой (`docs/architecture/space/`).

