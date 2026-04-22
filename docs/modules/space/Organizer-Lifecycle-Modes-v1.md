# Organizer Lifecycle Modes v1

## Status
Draft / Proposed SSOT note

Synchronization note: this document defines lifecycle concept and should be read with current runtime anchors: `docs/modules/space/space_current_state_audit_with_organizer_v1.md` and `docs/modules/space/organizer_current_cycle_closure_note_v1.md`.

## Purpose
Этот документ фиксирует lifecycle-layer для `Personal Organizer` внутри `Space Asia`.

Цель:
- расширить полезность Organizer за пределы одной только подготовки поездки;
- определить три режима жизни поездки;
- не открывать новую тяжёлую product wave.

Документ не меняет:
- `Space Asia = dashboard-first personal/social module`
- `Personal Organizer = trip-first section inside Space`
- `Saved = global saved layer`
- `add to trip = global save + trip link`
- `remove from trip != unsave globally`

---

## 1. Core decision

`Personal Organizer` должен поддерживать три lifecycle mode:

1. `Preparation`
2. `In Trip`
3. `Post Trip`

Это:
- не три отдельных модуля,
- не три разных продукта,
- не новая сложная state machine,

а один `trip workspace` с разными акцентами интерфейса и контекста.

---

## 2. Lifecycle mode: Preparation

### Purpose
Подготовка поездки.

### Main user question
Что ещё нужно собрать, подтвердить и закрыть до поездки?

### Main UX emphasis
- `What matters now`
- `Next step`
- blockers / weak points
- trip readiness
- dates / trip window
- trip items
- open steps
- notes with context

### Expected feeling
Пользователь должен понимать:
- чего ещё не хватает,
- что уже собрано,
- какой следующий полезный шаг.

### Product role
Это основной режим Organizer по умолчанию.

---

## 3. Lifecycle mode: In Trip

### Purpose
Поддержка пользователя во время активной поездки.

### Main user question
Что важно прямо сейчас и что мне нельзя потерять в ходе поездки?

### Main UX emphasis
- `Today / Сейчас`
- current relevant items
- nearest actions
- quick notes
- current phase of trip
- fast context capture

### Expected feeling
Пользователь должен понимать:
- что актуально прямо сейчас,
- что делать следующим,
- как быстро зафиксировать новый контекст.

### Important boundary
Этот режим не означает открытие:
- full day planner
- route planner
- heavy calendar
- reminder engine

---

## 4. Lifecycle mode: Post Trip

### Purpose
Фиксация и сохранение пользы после поездки.

### Main user question
Что стоит сохранить, повторить или использовать в будущем?

### Main UX emphasis
- short recap
- useful notes
- what worked well
- what to keep
- what to reuse
- what should remain in Saved
- what can seed a future trip

### Expected feeling
Пользователь должен понимать:
- что в поездке было полезным,
- что стоит не потерять,
- что можно использовать позже.

---

## 5. Stable product structure

Lifecycle modes не должны ломать базовую структуру Organizer.

### Must stay stable
- Organizer remains inside `Space Asia`
- Organizer remains trip-first
- `Saved` remains global saved layer
- trip detail remains primary workspace for one trip
- base entities remain:
  - `Trip`
  - `TripItem`
  - `TripTask`
  - `TripNote`

### May vary by mode
- headline emphasis
- `what matters now`
- `next step`
- helper blocks
- summary wording
- empty states
- supporting context blocks

---

## 6. Mode determination v1

### Preparation
Режим по умолчанию для новой и активной поездки до старта.

### In Trip
Режим включается, если:
- текущая дата попадает внутрь trip window;
- или пользователь вручную переводит поездку в режим “в поездке”.

### Post Trip
Режим включается, если:
- trip window завершился;
- или пользователь вручную помечает поездку как завершённую.

### Constraint
Mode detection v1 не должен требовать сложной новой модели состояний.

---

## 7. Minimal implementation direction

### Preparation
Остаётся текущим базовым режимом Organizer.

### In Trip
На bounded v1 может включать:
- current context emphasis
- quick notes
- today / current strip
- nearest actions
- current items emphasis

### Post Trip
На bounded v1 может включать:
- short recap block
- useful notes block
- reuse / keep signals
- post-trip summary tone

---

## 8. Non-goals

Этот note не открывает автоматически:
- map mode
- full calendar planner
- day-by-day itinerary
- reminders engine
- comparison mode
- collaboration
- AI planner
- budget tracking
- booking engine

Также note не меняет уже принятые правила между `Saved` и `Organizer`.

---

## 9. Product value

Lifecycle modes нужны, чтобы Organizer был полезен:
- до поездки,
- во время поездки,
- после поездки,

не превращаясь при этом в тяжёлый planner suite.

---

## 10. Short formula

**Preparation = собрать.**  
**In Trip = не потерять.**  
**Post Trip = сохранить пользу.**

---

## 11. Relation to existing docs

Этот note читается вместе с:
- `docs/modules/space/go_2_asia_personal_organizer_ssot_v_1.md`
- `docs/modules/space/Placement-of-Personal-Organizer-inside-Space-Asia.md`
- `docs/modules/space/space_personal_organizer_framing_note_v1.md`
- `docs/modules/space/space_saved_and_organizer_intake_note_v1.md`
- `docs/modules/space/personal_organizer_implementation_plan_v1.md`
- `docs/modules/space/space_frontend_baseline_status_note_v1.md`

Этот документ не заменяет их и добавляет lifecycle-layer как следующий продуктовый смысловой слой Organizer.