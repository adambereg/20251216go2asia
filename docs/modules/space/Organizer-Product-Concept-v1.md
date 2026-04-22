# Organizer Product Concept v1

## Status
Draft / Proposed SSOT note

Synchronization note: this is a concept-layer document. For current runtime state after Organizer merge, use `docs/modules/space/space_current_state_audit_with_organizer_v1.md` and `docs/modules/space/organizer_current_cycle_closure_note_v1.md`.

## Purpose
Этот документ фиксирует целостную продуктовую концепцию **Personal Organizer** внутри **Space Asia**.

Документ нужен, чтобы:
- закрепить уже сложившийся концепт Organizer;
- развести роли ключевых экранов и режимов;
- дать стабильную продуктовую рамку для дальнейшей работы Cursor;
- не допустить drift между:
  - `Space Asia`
  - `Saved`
  - `Organizer`
  - `Trip Detail`
  - `Timeline`
  - `Overview`
  - `Lifecycle modes`
  - `Day Focus`

Этот note описывает **целевую продуктовую модель текущей волны**, а не финальный полный planner-suite.

---

## 1. Core framing

### 1.1. Space Asia
`Space Asia` остаётся:

- `dashboard-first`
- `personal + social module`
- пользовательским пространством внутри экосистемы
- оболочкой личного и социального контуров

### 1.2. Personal Organizer
`Personal Organizer` остаётся:

- `trip-first section inside Space`
- не отдельным top-level модулем
- не заменой всего `Space`
- не вторым `Saved`
- не универсальным planner engine

### 1.3. Product role of Organizer
Organizer — это **рабочее пространство поездки**.

Его задача:
- помочь пользователю собрать поездку;
- сопровождать пользователя в ходе поездки;
- сохранить практическую пользу после поездки.

Коротко:

**Organizer = travel workspace inside Space Asia**

---

## 2. Core product principle

Organizer строится вокруг трёх смысловых слоёв:

### 2.1. Saved
`Saved` — это **глобальный слой сохранённого** внутри `Space Asia`.

### 2.2. Organizer
`Organizer` — это **trip-specific context** поверх глобального сохранённого.

### 2.3. Trip
`Trip` — это основной рабочий контейнер.

---

## 3. Saved vs Organizer

### 3.1. Saved remains global
`Saved` остаётся единым global saved layer.

Saved — это:
- общий shortlist / список интересного;
- общая входная точка для сохранённых постов и, в будущем, других типов сущностей;
- не поездка;
- не planner;
- не второй trip registry.

### 3.2. Organizer is not a second saved storage
Organizer не должен иметь второй parallel saved-storage.

Organizer:
- не владеет вторым “избранным”;
- не дублирует глобальное Saved;
- использует Saved как source / intake layer.

### 3.3. Action semantics
Приняты следующие правила:

- `add to trip` = глобальное сохранение + trip link/context
- `create trip from this` = создать trip + сразу связать объект с trip
- `remove from trip` != `unsave globally`
- `unsave globally` — отдельное действие

### 3.4. Product meaning
Saved отвечает на вопрос:

> Что мне вообще интересно и к чему я хочу вернуться?

Organizer отвечает на вопрос:

> Что относится к конкретной поездке и что мне с этим делать?

---

## 4. Core entities

На текущем этапе Organizer опирается на следующие сущности:

- `Trip`
- `TripItem`
- `TripTask`
- `TripNote`

### 4.1. Trip
Контейнер поездки:
- название
- направление / destination
- summary / краткая цель
- статус поездки
- даты / временной диапазон
- lifecycle mode

### 4.2. TripItem
Объект поездки:
- отель
- перелёт
- место
- экскурсия
- ресторан
- трансфер
- иной опорный объект

TripItem может быть:
- создан вручную
- добавлен из `Saved`

### 4.3. TripTask
Практический шаг / action внутри поездки.

### 4.4. TripNote
Контекстная заметка:
- ориентир
- полезная мысль
- reminder-like смысл
- вывод
- пост-фактум полезность

---

## 5. Main screens and their roles

---

## 5.1. Organizer Home

### Role
Главный вход в Organizer как в рабочий travel workspace.

### Must answer
- какая поездка важнее всего сейчас;
- какие поездки есть;
- какая из них требует внимания;
- куда стоит вернуться;
- как создать новую поездку.

### Should contain
- главный focus trip
- trip portfolio
- доступ к trip list
- доступ к overview
- доступ к timeline
- мягкий create trip flow

### Should not become
- тяжёлым planner dashboard
- overloaded analytics screen
- дублем trip detail

---

## 5.2. Trip Detail

### Role
Главный рабочий экран одной конкретной поездки.

### Must answer
- в каком состоянии поездка;
- что важно сейчас;
- какой следующий шаг;
- что к этой поездке относится;
- что уже собрано;
- что ещё хрупко.

### Core structure
Trip Detail остаётся главным контекстом поездки и включает:
- trip header
- stage / readiness
- what matters now
- next step
- trip time layer
- trip items
- trip tasks
- trip notes
- lifecycle-sensitive accents

### Should not become
- full day planner
- budget system
- route planner
- heavy itinerary engine

---

## 5.3. Saved

### Role
Глобальный список сохранённого.

### Must answer
- что сохранено вообще;
- что можно добавить в поездку;
- что уже сохранено, но ещё не используется в trip context.

### Should contain
- список saved objects
- `add to trip`
- `create trip from this`
- `remove from saved`

### Should not become
- второй Organizer
- полная система маршрутизации по поездкам
- planner inventory

---

## 5.4. Timeline

### Role
Обзор поездок во времени.

### Must answer
- как поездки лежат во времени;
- какие пересекаются;
- где между ними окна;
- какие ближе;
- какие дальше.

### Important constraint
Timeline показывает **поездки как диапазоны**, а не действия.

---

## 5.5. Overview

### Role
Единый обзор действий по всем поездкам.

### Product formula
**Overview = action portfolio across trips**

### Must answer
- что делать дальше по всему портфелю поездок;
- какие действия важны сейчас;
- какие скоро;
- как действия распределены во времени;
- к какой поездке относится каждое действие.

### Important distinction
Overview не должен дублировать:
- список поездок
- таймлайн поездок

Overview показывает:
- действия
- точки внимания
- ближайшие шаги
- action timeline

---

## 6. Tabs and their meaning

В Organizer должны быть чётко разведены роли вкладок.

### 6.1. Список
Показывает поездки как отдельные контейнеры.

### 6.2. Таймлайн
Показывает поездки во времени.

### 6.3. Обзор
Показывает действия по всем поездкам как единый action portfolio.

### Rule
Эти вкладки не должны дублировать друг друга один к одному.

---

## 7. Overview as action portfolio

### 7.1. Main idea
Overview не про “какие у меня есть поездки”, а про:

> Что мне делать дальше по всем поездкам?

### 7.2. Main layers of Overview

#### A. Focus action
Один главный action / point of attention сверху.

#### B. Action list
Единый список действий по всем поездкам:
- Сейчас
- На этой неделе
- Скоро
- Позже
- После поездки

#### C. Action timeline
Таймлайн действий во времени:
- не диапазонов поездок,
- а action moments / attention points / next steps.

### 7.3. Action portfolio meaning
Overview должен быть:
- calm action command layer
- travel-first
- not enterprise-heavy
- not task manager clone

---

## 8. Action timeline scale

### 8.1. Required scales
Для action timeline внутри `Overview` должны поддерживаться:

- `Day`
- `Week`
- `Month`

### 8.2. Default
Для action portfolio основным default-scale должен считаться:

- `Week`

### 8.3. Meaning
- `Day` = very close horizon
- `Week` = main working horizon
- `Month` = strategic horizon

### 8.4. Constraint
Scale switching не должен превращать экран в тяжёлый scheduler board.

---

## 9. Lifecycle modes

Organizer должен поддерживать lifecycle-layer.

### 9.1. Modes
- `Preparation`
- `In Trip`
- `Post Trip`

### 9.2. Principle
Это не три разных продукта, а один Organizer с разными акцентами интерфейса.

### 9.3. Preparation
**Preparation = собрать**

Главный вопрос:
> Что ещё нужно собрать и подтвердить до поездки?

Главные акценты:
- what matters now
- next step
- weak points
- dates
- items
- open steps
- notes

### 9.4. In Trip
**In Trip = не потерять**

Главный вопрос:
> Что важно прямо сейчас и что нельзя потерять в ходе поездки?

Главные акценты:
- today / current
- quick notes
- nearest actions
- current relevant items
- current day context

### 9.5. Post Trip
**Post Trip = сохранить пользу**

Главный вопрос:
> Что сохранить, повторить или использовать потом?

Главные акценты:
- recap
- useful notes
- what worked
- what to keep
- what to reuse

---

## 10. Trip time layer

### 10.1. One unified time block
Внутри `Trip Detail` должен быть один единый временной блок поездки.

Он должен объединять:
- trip window
- dates confidence
- day selector
- day focus activation
- edit dates access

### 10.2. Must not be duplicated
Не должно быть двух конкурирующих календарных блоков:
- одного для дат,
- другого для day focus.

### 10.3. Role
Trip time layer отвечает на вопрос:
- какова временная рамка поездки;
- какой день выбран;
- как быстро перейти к контексту дня.

---

## 11. Day Focus / Day Detail Layer

### 11.1. Role
Подуровень внутри `Trip Detail`, а не отдельный модуль.

### 11.2. Main question
> Что у меня происходит в этот день?

### 11.3. Day layer should show
- день поездки
- смысл дня
- главный фокус дня
- объекты дня
- шаги дня
- заметки дня
- что не забыть
- что уже подтверждено

### 11.4. Constraint
Day Focus — это day context, а не full day planner.

### 11.5. Empty day
Пустой день не должен ощущаться ошибкой.  
Это должно быть спокойное состояние:
- “день пока свободен”
- “можно оставить так”
- “можно добавить один полезный контекст”

---

## 12. Readiness / maturity layer

Organizer должен помогать понимать зрелость поездки.

### 12.1. Must show
- что уже собрано
- что ещё хрупко
- что тормозит поездку
- какой следующий шаг
- насколько поездка уже опирается на реальные объекты

### 12.2. Should remain lightweight
Нельзя превращать readiness в:
- heavy score system
- enterprise health dashboard
- overloaded analytics

### 12.3. Human meaning
Readiness нужен не как “метрика ради метрики”, а как:
- ориентир
- успокоение
- помощь в следующем действии

---

## 13. Blockers / fragile points

### 13.1. Product meaning
Это один из самых полезных слоёв Organizer.

### 13.2. Must answer
> Что сейчас реально мешает поездке стать собранной?

### 13.3. Examples
- нет жилья
- нет подтверждённой брони
- нет ни одного опорного объекта
- нет ясности по датам
- есть шаги без опоры
- поездка тонкая

### 13.4. Tone
Blockers должны быть:
- спокойными
- человеческими
- не punitive
- не error-like

---

## 14. Day / trip / portfolio hierarchy

Нужно сохранять иерархию:

### 14.1. Portfolio layer
Organizer Home / Overview / Timeline  
Показывают:
- поездки
- действия по поездкам
- портфель поездок

### 14.2. Trip layer
Trip Detail  
Показывает:
- рабочий контекст одной поездки

### 14.3. Day layer
Day Focus  
Показывает:
- контекст одного дня внутри поездки

### Rule
Day layer не заменяет trip layer,  
trip layer не заменяет portfolio layer.

---

## 15. UX tone and style

### 15.1. Tone
Organizer должен ощущаться:
- спокойным
- ясным
- зрелым
- полезным
- не перегруженным

### 15.2. Must not feel like
- internal milestone screen
- staging-only surface
- fake planner
- admin board
- giant productivity system

### 15.3. Language
Нельзя использовать в user-facing UX:
- runtime
- baseline
- slice
- bounded truth
- fake planner
- execution contour
- planner wave

Нужен:
- простой product language
- спокойный travel tone
- понятные действия
- естественные акценты

---

## 16. Non-goals of current concept

Этот концепт не открывает автоматически:

- full calendar planner
- hourly planning
- route planner
- map mode
- booking engine
- budget layer
- reminder engine
- collaboration
- AI planner
- heavy itinerary suite
- giant task manager

---

## 17. Product formula

### Organizer formula
**Organizer = travel workspace inside Space Asia**

### Lifecycle formula
**Preparation = собрать**  
**In Trip = не потерять**  
**Post Trip = сохранить пользу**

### Tabs formula
**Список = поездки**  
**Таймлайн = поездки во времени**  
**Обзор = действия по всем поездкам**

---

## 18. Practical implementation principle

Этот note фиксирует продуктовую концепцию.

При реализации Cursor должен:

- не копировать Bolt data model буквально;
- использовать концепт как UX / product direction;
- синхронизировать решение с реальным:
  - SSOT
  - Organizer-service
  - Saved semantics
  - accepted backend boundaries

### Important rule
**Seeded / demo data may support layout and flow testing, but may not redefine domain truth.**

---

## 19. Relation to existing docs

Этот note должен читаться вместе с:
- `docs/modules/space/go_2_asia_personal_organizer_ssot_v_1.md`
- `docs/modules/space/Placement-of-Personal-Organizer-inside-Space-Asia.md`
- `docs/modules/space/space_personal_organizer_framing_note_v1.md`
- `docs/modules/space/space_saved_and_organizer_intake_note_v1.md`
- `docs/modules/space/personal_organizer_implementation_plan_v1.md`
- `docs/modules/space/space_frontend_baseline_status_note_v1.md`
- `docs/modules/space/Organizer-Lifecycle-Modes-v1.md`

Этот документ:
- не отменяет их,
- а собирает цельную продуктовую картину Organizer как UX / product concept layer.

---

## 20. Final short summary

Organizer внутри Space Asia должен быть:

- местом, где пользователь видит свои поездки;
- местом, где пользователь работает с конкретной поездкой;
- местом, где пользователь понимает, что делать дальше по всем поездкам;
- местом, где есть day context, но нет тяжёлого planner overload;
- местом, где поездка полезна до, во время и после неё.

Это и есть целевой концепт Organizer v1.