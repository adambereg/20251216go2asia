# Organizer Content Pack v2

Status: runtime seed content / demo content / QA content  
Purpose: strengthen Organizer Overview, List, Timeline and Trip Detail with richer portfolio truth  
Owner: Space Asia / Organizer  
Version: v2

---

## 1. Scope

This pack exists to strengthen runtime Organizer across four surfaces:

- `Overview` as action portfolio across trips
- `List` as lifecycle-aware portfolio of trips
- `Timeline` as useful trip-time board
- `Trip Detail` as deeper travel workspace

This pack is not an architecture document and not a domain SSOT.  
It is a runtime/demo/seed layer for believable product behavior.

---

## 2. Seed goals

This pack must provide:

- 10 trips total
- preparation / in_trip / post_trip lifecycle mix
- 6 trips with full date windows
- 2 trips with rough dates
- 2 trips without dates
- at least 3 meaningful overlaps
- richer tasks / notes / saved links
- stronger action diversity for Overview
- enough dated trips for a useful Timeline
- enough trip depth for stronger Trip Detail

---

## 3. Primary seeded user

### User U1
- email: `fred89059599296@gmail.com`
- role: `spacer`
- purpose: main demo user for Organizer runtime verification

---

## 4. Saved source pool

These are the saved-source inputs that can be linked into trips.  
Runtime may still support only `space_post` as the actual saved type, but these entries define the travel meaning and reuse value.

### Saved item S1
- type: `space_post`
- title: `Короткий public shortlist по Бангкоку`
- category: `district / first-days guide`
- short_summary: `Удобная база на первые дни, рабочее кафе и один спокойный район для адаптации.`
- reason_to_save: `Хороший стартовый ориентир для первой поездки в Бангкок.`
- suggested_trip_fit: `Бангкок в мае`
- reuse_value: `yes`

### Saved item S2
- type: `space_post`
- title: `Один пост про рынок`
- category: `place / market`
- short_summary: `Короткая находка про рынок, который стоит посмотреть утром.`
- reason_to_save: `Подходит как лёгкий локальный anchor для поездки.`
- suggested_trip_fit: `Фукуок в июне`
- reuse_value: `yes`

### Saved item S3
- type: `space_post`
- title: `Пост о спокойном районе Long Beach`
- category: `district / stay`
- short_summary: `Спокойный район, если нужен тихий ритм и не хочется жить в шумном центре.`
- reason_to_save: `Полезно для выбора базы проживания.`
- suggested_trip_fit: `Фукуок в июне`
- reuse_value: `yes`

### Saved item S4
- type: `space_post`
- title: `Пост о кафе на Пхукете`
- category: `food / café`
- short_summary: `Пара мест, где удобно работать и спокойно сидеть днём.`
- reason_to_save: `Подходит для длинного рабочего дня во время поездки.`
- suggested_trip_fit: `Бангкок + Пхукет`
- reuse_value: `yes`

### Saved item S5
- type: `space_post`
- title: `Пост о районе Сукхумвит`
- category: `district / stay`
- short_summary: `Короткий разбор района как базы для короткой поездки.`
- reason_to_save: `Полезно для выбора отеля и ритма первых дней.`
- suggested_trip_fit: `Бангкок в мае`
- reuse_value: `yes`

### Saved item S6
- type: `space_post`
- title: `Пост о рабочем маршруте по Хошимину`
- category: `route / district`
- short_summary: `Маршрут по районам, где удобно совмещать прогулку, кофе и бытовые задачи.`
- reason_to_save: `Полезно для поездки с мягким исследовательским режимом.`
- suggested_trip_fit: `Хошимин летом`
- reuse_value: `yes`

### Saved item S7
- type: `space_post`
- title: `Пост о визе и страховке`
- category: `practical / docs`
- short_summary: `Краткая заметка, что перепроверить по документам перед длинной поездкой.`
- reason_to_save: `Подходит для preparation steps.`
- suggested_trip_fit: `Вьетнам на месяц`
- reuse_value: `yes`

### Saved item S8
- type: `space_post`
- title: `Пост о короткой морской прогулке`
- category: `activity`
- short_summary: `Ненапряжная прогулка, которую можно поставить в один из свободных дней.`
- reason_to_save: `Подходит для свободного или calm дня.`
- suggested_trip_fit: `Пхукет в марте`
- reuse_value: `yes`

### Saved item S9
- type: `space_post`
- title: `Пост о хороших перелётах между городами`
- category: `flight / transfer`
- short_summary: `Короткая заметка о маршруте между городами и удобном времени вылета.`
- reason_to_save: `Может стать опорой для trip action.`
- suggested_trip_fit: `Вьетнам на месяц`
- reuse_value: `yes`

### Saved item S10
- type: `space_post`
- title: `Пост о районе у реки`
- category: `district / walk`
- short_summary: `Спокойный район для прогулок и неторопливого вечера.`
- reason_to_save: `Полезно как place anchor и reuse signal после поездки.`
- suggested_trip_fit: `Бангкок в мае`
- reuse_value: `yes`

---

## 5. Trip index

### Preparation
- T1 Бангкок в мае
- T2 Бангкок + Пхукет
- T3 Фукуок в июне
- T4 Хошимин летом

### In Trip
- T5 Бангкок сейчас
- T6 Короткий Ханой

### Post Trip
- T7 Пхукет в марте
- T8 Хошимин в феврале

### Long / structured
- T9 Вьетнам на месяц

### Future / rough
- T10 Сингапур осенью

---

## 6. Trips

---

## Trip T1 — Бангкок в мае

### Core
- title: `Бангкок в мае`
- destination: `Бангкок`
- summary: `Короткая поездка на 5 дней с мягким стартом и спокойным ритмом первых дней.`
- lifecycle_target: `preparation`
- stage_target: `planning`
- start_date: `2026-05-15`
- end_date: `2026-05-21`
- dates_confidence: `confirmed`
- lifecycle_override: `null`
- focus: `Подтвердить даты и выбрать отель`
- next_step: `Выбрать отель в районе Силом или Сукхумвит`

### Runtime intent
- why_this_trip_exists: `Основной пример короткой поездки, которая уже имеет форму, но ещё не собрана полностью.`
- what_this_trip_should_demonstrate_in_ui: `Preparation state with real blockers, useful saved links, day strip, near-term actions, and later possible in-trip transition.`

### Saved links
- linked_saved_items: `S1, S5, S10`
- suggested_saved_items_not_yet_linked: `S9`

### Items
#### Item I1
- title: `Отель Ariyasom Villa`
- category: `hotel`
- status: `planned`
- pinned: `yes`
- source: `saved`
- saved_ref: `S5`
- day_date: `2026-05-15`
- short_note: `Смотреть варианты — удобно до метро.`

#### Item I2
- title: `Перелёт Москва — Бангкок`
- category: `flight`
- status: `planned`
- pinned: `yes`
- source: `manual`
- day_date: `2026-05-15`
- short_note: `Лучше утренний вылет.`

#### Item I3
- title: `Ужин на крыше Vertigo`
- category: `food`
- status: `planned`
- pinned: `no`
- source: `manual`
- day_date: `2026-05-18`
- short_note: `Забронировать за несколько дней.`

#### Item I4
- title: `Пляжный отель у моря, Пхукет`
- category: `hotel`
- status: `planned`
- pinned: `no`
- source: `saved`
- saved_ref: `S4`
- day_date: `null`
- short_note: `Пока как сравнение, не для этой поездки напрямую.`

#### Item I5
- title: `Плавучий рынок Дамноен Садуак`
- category: `activity`
- status: `planned`
- pinned: `no`
- source: `saved`
- saved_ref: `S2`
- day_date: `2026-05-17`
- short_note: `Лучше ехать утром.`

### Steps
#### Step S1
- title: `Подтвердить даты`
- status: `pending`
- day_date: `2026-05-15`
- sort_order: `1`
- why_it_matters: `Без даты не получается собрать уверенный старт.`

#### Step S2
- title: `Выбрать отель`
- status: `pending`
- day_date: `2026-05-15`
- sort_order: `2`
- why_it_matters: `Главный blocker этой поездки.`

#### Step S3
- title: `Купить билеты`
- status: `pending`
- day_date: `2026-05-16`
- sort_order: `3`
- why_it_matters: `После выбора отеля поездка становится заметно устойчивее.`

#### Step S4
- title: `Рассказать друзьям о поездке`
- status: `done`
- day_date: `2026-05-17`
- sort_order: `4`
- why_it_matters: `Лёгкий закрытый шаг, чтобы был контраст done/pending.`

### Trip notes
#### Note N1
- body: `В мае в Бангкоке уже жарко и иногда дожди — лучше закладывать кондиционер и лёгкую одежду.`
- day_date: `null`
- type: `practical`

#### Note N2
- body: `На рынок лучше ехать в 7 утра — меньше толпы и свежее фрукты.`
- day_date: `2026-05-17`
- type: `practical`

### Item notes
#### Item note IN1
- parent_item: `Отель Ariyasom Villa`
- body: `Нужен тихий корпус, если получится.`

#### Item note IN2
- parent_item: `Ужин на крыше Vertigo`
- body: `Лучше брать столик ближе к закату.`

### Day layer
#### Day D1
- date: `2026-05-15`
- theme: `arrival`
- focus: `Прилететь, заселиться, не перегрузить первый день`
- planned_highlights: `отель, тихий ужин, ранний сон`
- attached_items: `I1, I2`
- attached_steps: `S1, S2`
- attached_notes: `N1`

#### Day D2
- date: `2026-05-16`
- theme: `calm`
- focus: `Понять район и рабочий ритм`
- planned_highlights: `район, кафе, первый спокойный маршрут`
- attached_items: `I1`
- attached_steps: `S3`
- attached_notes: `null`

#### Day D3
- date: `2026-05-17`
- theme: `packed`
- focus: `Ранний рынок и спокойный вечер`
- planned_highlights: `плавучий рынок, лёгкая прогулка`
- attached_items: `I5`
- attached_steps: `null`
- attached_notes: `N2`

### Overview expectations
- focus_action_candidate: `Подтвердить даты и выбрать отель`
- horizon: `now`
- why_now: `Это главный blocker ближайшей поездки.`
- blocker_candidate: `Нет ещё ни одной подтверждённой брони.`
- reuse_candidate: `Район у реки как вечерний маршрут`

---

## Trip T2 — Бангкок + Пхукет

### Core
- title: `Бангкок + Пхукет`
- destination: `Бангкок — Пхукет`
- summary: `Поездка с переходом из города к морю; пока скорее идея, чем собранный маршрут.`
- lifecycle_target: `preparation`
- stage_target: `idea`
- start_date: `2026-05-20`
- end_date: `2026-06-02`
- dates_confidence: `rough`
- lifecycle_override: `null`
- focus: `Понять, сколько дней оставить на Бангкок и сколько на Пхукет`
- next_step: `Сравнить Кату и Карон`

### Runtime intent
- why_this_trip_exists: `Главный пример overlap-trip для Timeline.`
- what_this_trip_should_demonstrate_in_ui: `Overlap with another trip, rough dates, thin preparation, weak structure.`

### Saved links
- linked_saved_items: `S4`
- suggested_saved_items_not_yet_linked: `S1, S10`

### Items
#### Item I1
- title: `Пляжный отель у моря, Пхукет`
- category: `hotel`
- status: `planned`
- pinned: `yes`
- source: `saved`
- saved_ref: `S4`
- day_date: `null`
- short_note: `Пока только ориентир.`

### Steps
#### Step S1
- title: `Сравнить Кату и Карон`
- status: `pending`
- day_date: `null`
- sort_order: `1`
- why_it_matters: `Без этого нельзя выбрать базу у моря.`

#### Step S2
- title: `Понять длительность бангкокской части`
- status: `pending`
- day_date: `null`
- sort_order: `2`
- why_it_matters: `Определяет всё окно поездки.`

### Trip notes
#### Note N1
- body: `Пока поездка выглядит как идея с двумя разными ритмами: город и море.`
- day_date: `null`
- type: `general`

### Item notes
- none

### Day layer
- none yet

### Overview expectations
- focus_action_candidate: `Сравнить Кату и Карон`
- horizon: `soon`
- why_now: `Нужно сузить окно поездки и понять базу у моря.`
- blocker_candidate: `Окно поездки ещё уточняется.`
- reuse_candidate: `Пляжный отель как reusable candidate`

---

## Trip T3 — Фукуок в июне

### Core
- title: `Фукуок в июне`
- destination: `Фукуок`
- summary: `Отдых и разведка районов. Поездка ещё тонкая, но направление уже понятно.`
- lifecycle_target: `preparation`
- stage_target: `idea`
- start_date: `2026-06-10`
- end_date: `2026-06-20`
- dates_confidence: `confirmed`
- lifecycle_override: `null`
- focus: `Определиться с районом проживания`
- next_step: `Подтвердить район проживания`

### Runtime intent
- why_this_trip_exists: `Пример поездки с базой, но без сильной структуры.`
- what_this_trip_should_demonstrate_in_ui: `Thin trip, clear next step, saved-derived object, short timeline range.`

### Saved links
- linked_saved_items: `S2, S3`
- suggested_saved_items_not_yet_linked: `S8`

### Items
#### Item I1
- title: `Один пост про рынок`
- category: `place`
- status: `planned`
- pinned: `no`
- source: `saved`
- saved_ref: `S2`
- day_date: `2026-06-13`
- short_note: `Добавлено как ориентир.`

#### Item I2
- title: `Жильё в районе Long Beach`
- category: `hotel`
- status: `planned`
- pinned: `yes`
- source: `saved`
- saved_ref: `S3`
- day_date: `null`
- short_note: `Пока без подтверждения района.`

### Steps
#### Step S1
- title: `Подтвердить район проживания`
- status: `pending`
- day_date: `2026-06-11`
- sort_order: `1`
- why_it_matters: `Главное решение перед бронированием.`

### Trip notes
#### Note N1
- body: `Long Beach кажется удобным как спокойная база.`
- day_date: `null`
- type: `practical`

### Item notes
- none

### Day layer
#### Day D1
- date: `2026-06-10`
- theme: `arrival`
- focus: `Доехать спокойно и не перегружать первый день`
- planned_highlights: `заселение, ужин рядом`
- attached_items: `I2`
- attached_steps: `null`
- attached_notes: `null`

### Overview expectations
- focus_action_candidate: `Подтвердить район проживания`
- horizon: `week`
- why_now: `Без этого не двигается бронирование.`
- blocker_candidate: `Нет пока подтверждённой базы проживания.`
- reuse_candidate: `Рынок как place anchor`

---

## Trip T4 — Хошимин летом

### Core
- title: `Хошимин летом`
- destination: `Хошимин`
- summary: `Подумываю о поездке во Вьетнам. Пока это скорее исследование, чем собранный маршрут.`
- lifecycle_target: `preparation`
- stage_target: `idea`
- start_date: `null`
- end_date: `null`
- dates_confidence: `none`
- lifecycle_override: `null`
- focus: `Понять, стоит ли ехать в сезон дождей`
- next_step: `Собрать ориентиры по городу`

### Runtime intent
- why_this_trip_exists: `Главный пример undated trip.`
- what_this_trip_should_demonstrate_in_ui: `Undated rail in Timeline, weak structure, horizon later.`

### Saved links
- linked_saved_items: `S6`
- suggested_saved_items_not_yet_linked: `S7`

### Items
#### Item I1
- title: `Рабочий маршрут по Хошимину`
- category: `route`
- status: `planned`
- pinned: `no`
- source: `saved`
- saved_ref: `S6`
- day_date: `null`
- short_note: `Пока только ориентир.`

### Steps
#### Step S1
- title: `Собрать ориентиры по району`
- status: `pending`
- day_date: `null`
- sort_order: `1`
- why_it_matters: `Нужно понять, что вообще делать с поездкой.`

#### Step S2
- title: `Понять сезон дождей`
- status: `pending`
- day_date: `null`
- sort_order: `2`
- why_it_matters: `Это ключевое решение до фиксации дат.`

### Trip notes
#### Note N1
- body: `Поездка пока без дат. Это нормально: сначала нужен смысл и ориентиры.`
- day_date: `null`
- type: `general`

### Item notes
- none

### Day layer
- none

### Overview expectations
- focus_action_candidate: `Собрать ориентиры по городу`
- horizon: `later`
- why_now: `Это будущая поездка, но без контекста она не двигается.`
- blocker_candidate: `Нет ни одного объекта — поездке пока не на что опираться.`
- reuse_candidate: `Рабочий маршрут по районам`

---

## Trip T5 — Бангкок сейчас

### Core
- title: `Бангкок сейчас`
- destination: `Бангкок`
- summary: `Поездка уже идёт. Главная задача — не потерять полезное и не забыть то, что важно сегодня.`
- lifecycle_target: `in_trip`
- stage_target: `booked`
- start_date: `2026-04-18`
- end_date: `2026-04-24`
- dates_confidence: `confirmed`
- lifecycle_override: `null`
- focus: `Подтвердить ужин на крыше на четверг`
- next_step: `Выбрать отель на Пхукете`

### Runtime intent
- why_this_trip_exists: `Главный пример in_trip mode.`
- what_this_trip_should_demonstrate_in_ui: `Today-focus, in-trip action portfolio, day context, active object list.`

### Saved links
- linked_saved_items: `S1, S5, S10`
- suggested_saved_items_not_yet_linked: `S4`

### Items
#### Item I1
- title: `Отель Ariyasom Villa`
- category: `hotel`
- status: `booked`
- pinned: `yes`
- source: `manual`
- day_date: `2026-04-18`
- short_note: `Отель слева от ресепшена — тихий корпус.`

#### Item I2
- title: `Перелёт Москва — Бангкок`
- category: `flight`
- status: `done`
- pinned: `yes`
- source: `manual`
- day_date: `2026-04-18`
- short_note: `Прилетели спокойно.`

#### Item I3
- title: `Ужин на крыше Vertigo`
- category: `food`
- status: `planned`
- pinned: `no`
- source: `manual`
- day_date: `2026-04-21`
- short_note: `Подтвердить на четверг.`

#### Item I4
- title: `Плавучий рынок Дамноен Садуак`
- category: `activity`
- status: `planned`
- pinned: `no`
- source: `saved`
- saved_ref: `S2`
- day_date: `2026-04-20`
- short_note: `Если ехать, то утром.`

#### Item I5
- title: `Район у реки`
- category: `place`
- status: `done`
- pinned: `no`
- source: `saved`
- saved_ref: `S10`
- day_date: `2026-04-19`
- short_note: `Хороший спокойный вечерний маршрут.`

### Steps
#### Step S1
- title: `Подтвердить ужин на крыше`
- status: `pending`
- day_date: `2026-04-21`
- sort_order: `1`
- why_it_matters: `Это главный точечный action сейчас.`

#### Step S2
- title: `Выбрать отель`
- status: `pending`
- day_date: `2026-04-22`
- sort_order: `2`
- why_it_matters: `Нужно не потерять следующую часть поездки.`

#### Step S3
- title: `Купить билеты`
- status: `pending`
- day_date: `2026-04-22`
- sort_order: `3`
- why_it_matters: `Привязано к следующему этапу.`

#### Step S4
- title: `Рассказать друзьям о поездке`
- status: `done`
- day_date: `2026-04-19`
- sort_order: `4`
- why_it_matters: `Показывает живую in-trip активность.`

### Trip notes
#### Note N1
- body: `Приехали!`
- day_date: `2026-04-18`
- type: `reflection`

#### Note N2
- body: `На рынок лучше в 7 утра — меньше толпы и свежее фрукты.`
- day_date: `2026-04-20`
- type: `practical`

### Item notes
#### Item note IN1
- parent_item: `Отель Ariyasom Villa`
- body: `Тихий корпус, попросить вид в сад.`

### Day layer
#### Day D1
- date: `2026-04-18`
- theme: `arrival`
- focus: `Доехать, заселиться, выдохнуть`
- planned_highlights: `заселение, короткий ужин`
- attached_items: `I1, I2`
- attached_steps: `null`
- attached_notes: `N1`

#### Day D2
- date: `2026-04-19`
- theme: `calm`
- focus: `Спокойно почувствовать город`
- planned_highlights: `район у реки, кафе`
- attached_items: `I5`
- attached_steps: `S4`
- attached_notes: `null`

#### Day D3
- date: `2026-04-20`
- theme: `packed`
- focus: `Ранний рынок`
- planned_highlights: `рынок, отдых днём`
- attached_items: `I4`
- attached_steps: `null`
- attached_notes: `N2`

#### Day D4
- date: `2026-04-21`
- theme: `calm`
- focus: `Подтвердить ужин и не перегрузить день`
- planned_highlights: `ужин, лёгкая прогулка`
- attached_items: `I3`
- attached_steps: `S1`
- attached_notes: `null`

### Overview expectations
- focus_action_candidate: `Подтвердить ужин на крыше на четверг`
- horizon: `now`
- why_now: `Это действие актуально прямо сейчас, пока поездка идёт.`
- blocker_candidate: `Нет ещё одного подтверждённого плана на следующую часть поездки.`
- reuse_candidate: `Район у реки`

---

## Trip T6 — Короткий Ханой

### Core
- title: `Короткий Ханой`
- destination: `Ханой`
- summary: `Короткая поездка внутри текущего сезона.`
- lifecycle_target: `in_trip`
- stage_target: `booked`
- start_date: `2026-04-26`
- end_date: `2026-04-29`
- dates_confidence: `confirmed`
- lifecycle_override: `null`
- focus: `Не забыть ранний трансфер`
- next_step: `Подтвердить трансфер из аэропорта`

### Runtime intent
- why_this_trip_exists: `Второй in-trip пример для разнообразия.`
- what_this_trip_should_demonstrate_in_ui: `Short trip, narrow window, active actions.`

### Saved links
- linked_saved_items: `S9`
- suggested_saved_items_not_yet_linked: `S7`

### Items
#### Item I1
- title: `Трансфер из аэропорта`
- category: `transfer`
- status: `planned`
- pinned: `yes`
- source: `manual`
- day_date: `2026-04-26`
- short_note: `Важно не забыть подтвердить.`

### Steps
#### Step S1
- title: `Подтвердить трансфер`
- status: `pending`
- day_date: `2026-04-26`
- sort_order: `1`
- why_it_matters: `Главный in-trip action.`

### Trip notes
#### Note N1
- body: `Главное — не перегрузить эту короткую поездку.`
- day_date: `null`
- type: `general`

### Item notes
- none

### Day layer
#### Day D1
- date: `2026-04-26`
- theme: `arrival`
- focus: `Доехать спокойно`
- planned_highlights: `трансфер, заселение`
- attached_items: `I1`
- attached_steps: `S1`
- attached_notes: `null`

### Overview expectations
- focus_action_candidate: `Подтвердить трансфер`
- horizon: `week`
- why_now: `Это ближайший короткий активный trip action.`
- blocker_candidate: `Короткое окно, мало места на ошибки.`
- reuse_candidate: `Маршрут трансфера`

---

## Trip T7 — Пхукет в марте

### Core
- title: `Пхукет в марте`
- destination: `Пхукет`
- summary: `Завершившаяся поездка, где уже есть полезные находки и то, что стоит сохранить.`
- lifecycle_target: `post_trip`
- stage_target: `ready`
- start_date: `2026-03-10`
- end_date: `2026-03-18`
- dates_confidence: `confirmed`
- lifecycle_override: `null`
- focus: `Сохранить удачные находки`
- next_step: `Закрепить полезное, пока оно свежее`

### Runtime intent
- why_this_trip_exists: `Главный пример post-trip режима.`
- what_this_trip_should_demonstrate_in_ui: `After trip actions, useful notes, save/reuse layer.`

### Saved links
- linked_saved_items: `S8`
- suggested_saved_items_not_yet_linked: `S4`

### Items
#### Item I1
- title: `Круиз по заливу Халонг`
- category: `activity`
- status: `done`
- pinned: `yes`
- source: `saved`
- saved_ref: `S8`
- day_date: `2026-03-14`
- short_note: `Хороший вариант для спокойного дня.`

#### Item I2
- title: `Пляж у тихого отеля`
- category: `place`
- status: `done`
- pinned: `yes`
- source: `manual`
- day_date: `2026-03-12`
- short_note: `Сохраняем как удачную находку.`

### Steps
#### Step S1
- title: `Сохранить удачные находки`
- status: `pending`
- day_date: `null`
- sort_order: `1`
- why_it_matters: `Главный post-trip action.`

### Trip notes
#### Note N1
- body: `Тихий пляж оказался сильнее ожиданий.`
- day_date: `null`
- type: `reflection`

#### Note N2
- body: `Для следующей поездки лучше брать жильё ближе к морю.`
- day_date: `null`
- type: `practical`

### Item notes
#### Item note IN1
- parent_item: `Пляж у тихого отеля`
- body: `Хорошо оставить как reuse reference.`

### Day layer
#### Day D1
- date: `2026-03-14`
- theme: `free`
- focus: `Спокойный день у моря`
- planned_highlights: `отдых, короткая прогулка`
- attached_items: `I1, I2`
- attached_steps: `null`
- attached_notes: `null`

### Overview expectations
- focus_action_candidate: `Сохранить удачные находки`
- horizon: `after_trip`
- why_now: `После поездки ещё свежо, что реально пригодилось.`
- blocker_candidate: `Если не сохранить сейчас, полезное размоется.`
- reuse_candidate: `Тихий пляж и жильё ближе к морю`

---

## Trip T8 — Хошимин в феврале

### Core
- title: `Хошимин в феврале`
- destination: `Хошимин`
- summary: `Завершённая поездка с более городским, рабочим ритмом.`
- lifecycle_target: `post_trip`
- stage_target: `ready`
- start_date: `2026-02-08`
- end_date: `2026-02-15`
- dates_confidence: `confirmed`
- lifecycle_override: `null`
- focus: `Сохранить полезные рабочие маршруты`
- next_step: `Зафиксировать, что реально пригодилось`

### Runtime intent
- why_this_trip_exists: `Второй post-trip пример, более городской и менее курортный.`
- what_this_trip_should_demonstrate_in_ui: `Post-trip reuse and useful notes beyond leisure.`

### Saved links
- linked_saved_items: `S6`
- suggested_saved_items_not_yet_linked: `null`

### Items
#### Item I1
- title: `Рабочий маршрут по районам`
- category: `route`
- status: `done`
- pinned: `yes`
- source: `saved`
- saved_ref: `S6`
- day_date: `2026-02-10`
- short_note: `Сохраняем как reusable route.`

### Steps
#### Step S1
- title: `Записать, что пригодилось`
- status: `pending`
- day_date: `null`
- sort_order: `1`
- why_it_matters: `Главный post-trip смысл этой поездки.`

### Trip notes
#### Note N1
- body: `Лучшие часы для спокойной прогулки — до жары.`
- day_date: `null`
- type: `practical`

### Item notes
- none

### Day layer
- optional only

### Overview expectations
- focus_action_candidate: `Записать, что пригодилось`
- horizon: `after_trip`
- why_now: `Городские наблюдения быстро забываются, если не сохранить их сейчас.`
- blocker_candidate: `Без фиксации поездка не даёт пользы дальше.`
- reuse_candidate: `Рабочий маршрут по районам`

---

## Trip T9 — Вьетнам на месяц

### Core
- title: `Вьетнам на месяц`
- destination: `Хошимин, Дананг, Ханой`
- summary: `Длинная поездка по нескольким городам. Основа уже собрана, осталось уточнить детали.`
- lifecycle_target: `preparation`
- stage_target: `booked`
- start_date: `2026-07-21`
- end_date: `2026-08-19`
- dates_confidence: `confirmed`
- lifecycle_override: `null`
- focus: `Добавить заметку по визе и страховке`
- next_step: `Купить страховку`

### Runtime intent
- why_this_trip_exists: `Главный long structured trip.`
- what_this_trip_should_demonstrate_in_ui: `Strong list card, useful long timeline bar, richer action portfolio, stronger trip detail.`

### Saved links
- linked_saved_items: `S7, S9`
- suggested_saved_items_not_yet_linked: `S6`

### Items
#### Item I1
- title: `Перелёт Москва — Ханой`
- category: `flight`
- status: `booked`
- pinned: `yes`
- source: `manual`
- day_date: `2026-07-21`
- short_note: `Главный вход в поездку.`

#### Item I2
- title: `Билет Ханой — Дананг`
- category: `flight`
- status: `planned`
- pinned: `no`
- source: `manual`
- day_date: `2026-07-30`
- short_note: `Нужно докупить.`

#### Item I3
- title: `Бутік-отель в Хойане`
- category: `hotel`
- status: `booked`
- pinned: `yes`
- source: `manual`
- day_date: `2026-08-02`
- short_note: `Одна из баз поездки.`

#### Item I4
- title: `Круиз по Халонгу`
- category: `activity`
- status: `planned`
- pinned: `no`
- source: `saved`
- saved_ref: `S8`
- day_date: `2026-08-10`
- short_note: `Если останется спокойное окно.`

### Steps
#### Step S1
- title: `Добавить заметку по визе и страховке`
- status: `pending`
- day_date: `2026-07-01`
- sort_order: `1`
- why_it_matters: `Preparation action с отложенной датой.`

#### Step S2
- title: `Купить страховку`
- status: `pending`
- day_date: `2026-07-05`
- sort_order: `2`
- why_it_matters: `Следующий практический шаг.`

#### Step S3
- title: `Рассказать о поездке друзьям`
- status: `pending`
- day_date: `2026-07-10`
- sort_order: `3`
- why_it_matters: `Лёгкий non-critical step.`

### Trip notes
#### Note N1
- body: `Сейчас поездка уже собрана, осталось уточнить детали и не потерять документы.`
- day_date: `null`
- type: `general`

### Item notes
#### Item note IN1
- parent_item: `Бутік-отель в Хойане`
- body: `Проверить правила раннего заезда.`

### Day layer
#### Day D1
- date: `2026-07-21`
- theme: `arrival`
- focus: `Войти в длинную поездку спокойно`
- planned_highlights: `заселение, отдых, короткий маршрут`
- attached_items: `I1`
- attached_steps: `null`
- attached_notes: `null`

### Overview expectations
- focus_action_candidate: `Добавить заметку по визе и страховке`
- horizon: `later`
- why_now: `Длинная поездка уже собрана, но детали документов ещё хрупки.`
- blocker_candidate: `Нужно закрыть документы до старта.`
- reuse_candidate: `Маршрут по городам`

---

## Trip T10 — Сингапур осенью

### Core
- title: `Сингапур осенью`
- destination: `Сингапур`
- summary: `Будущая короткая поездка, пока скорее идея с rough dates.`
- lifecycle_target: `preparation`
- stage_target: `idea`
- start_date: `2026-10-10`
- end_date: `2026-10-14`
- dates_confidence: `rough`
- lifecycle_override: `null`
- focus: `Понять, нужен ли отдельный бюджет на эту поездку`
- next_step: `Собрать первые ориентиры`

### Runtime intent
- why_this_trip_exists: `Future trip with rough dates and low urgency.`
- what_this_trip_should_demonstrate_in_ui: `Later horizon, rough dates, thin structure.`

### Saved links
- linked_saved_items: `null`
- suggested_saved_items_not_yet_linked: `null`

### Items
- none

### Steps
#### Step S1
- title: `Собрать первые ориентиры`
- status: `pending`
- day_date: `null`
- sort_order: `1`
- why_it_matters: `Без этого поездка остаётся пустой идеей.`

### Trip notes
#### Note N1
- body: `Пока это очень ранняя идея.`
- day_date: `null`
- type: `general`

### Item notes
- none

### Day layer
- none

### Overview expectations
- focus_action_candidate: `Собрать первые ориентиры`
- horizon: `later`
- why_now: `Не срочно, но полезно открыть поездку и положить первый ориентир.`
- blocker_candidate: `Пока нет ни одного объекта.`
- reuse_candidate: `null`

---

## 7. Action portfolio coverage

This pack must support these action cases in runtime Overview:

- подтвердить бронь
- выбрать отель
- купить билеты
- вернуться к открытому шагу
- добавить первый объект
- подтвердить район проживания
- собрать ориентиры по району
- не забыть трансфер
- сохранить удачные находки
- записать, что пригодилось
- добавить заметку по визе и страховке
- купить страховку

---

## 8. Timeline coverage

This pack must support:

- at least 6 trips with full dates
- at least 3 overlaps
- short trips
- medium trips
- one long trip
- one in-trip visible around today
- one or two post-trip windows
- 2 trips with rough/no dates
- separate undated handling

Expected visual conditions:
- a useful dated board
- visible overlap
- visible gaps/windows
- useful undated rail

---

## 9. Expected runtime outcomes

After seeding this pack:

- Overview should show a diverse action portfolio, not repetitive “return to step” cards only
- Timeline should display meaningful dated trip ranges, overlaps and undated rail
- List should read as a stronger lifecycle portfolio
- Trip Detail should show deeper travel context and stronger lifecycle differences
- Saved -> Add to trip should have richer and more believable examples
- Post-trip mode should have clear “save useful learnings” cases

---

## 10. Out of scope / do not infer

This pack does not imply:

- full planner suite
- map mode
- reminders engine
- collaboration
- budget layer
- booking engine
- AI planner
- second saved layer
- replacing organizer backend truth with content assumptions

The pack is a runtime/demo/seed layer only.