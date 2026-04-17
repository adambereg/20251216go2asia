Personal Organizer Content Pack v1
Status

Draft / working content pack

Purpose

Этот документ задаёт живой контентовый слой для разработки и refinement Personal Organizer внутри Space Asia.

Он нужен для:

product/UI/UX refinement,
implementation support,
realistic test scenarios,
работы Cursor на живом контексте.

Этот документ:

не заменяет SSOT,
не заменяет implementation plan,
не является ADR,
используется как practical content layer.
1. Product role

Personal Organizer — trip-first section inside Space Asia.

Его задача:

превращать сохранённое и пользовательский интерес в контекст конкретной поездки,
показывать, что важно сейчас,
подсказывать следующий шаг,
помогать двигать подготовку поездки вперёд.

Короткая формула:

Saved = глобальный shortlist
Organizer = рабочий контекст конкретной поездки
2. Core rules
2.1. One global Saved

В Space существует один global saved layer.

2.2. No duplicate Organizer Saved

Organizer не должен создавать второй самостоятельный saved storage.

2.3. Trip item is a trip link

Trip item — это связь объекта с поездкой, а не вторая независимая копия saved object.

2.4. Add to trip

Add to trip / Create trip from this / Link to trip по умолчанию означают:

global save
плюс trip link
2.5. Remove from trip

Remove from trip:

удаляет только trip context,
не удаляет объект из global Saved.
2.6. Human product copy

Пользовательский copy должен быть:

коротким,
спокойным,
action-oriented,
без engineering language.
3. Canonical trip states
3.1. Empty trip

Поездка создана, но ещё не наполнена.

Признаки:

нет items
нет tasks
нет notes
3.2. Thin trip

Поездка уже существует и частично наполнена, но ещё не даёт ощущения структуры.

Признаки:

1–2 items или note
мало execution context
3.3. Active preparation trip

Поездка в процессе подготовки.

Признаки:

есть items
есть pending tasks
есть notes
есть незакрытые решения
3.4. Structured trip

Поездка уже имеет рабочую структуру.

Признаки:

items распределены
tasks понятны
notes есть
нет ощущения пустого контейнера
3.5. Trip with pending issues

Поездка в целом собрана, но есть проблемные точки.

Признаки:

pending tasks
planned items без движения
недостаёт важных решений
4. Canonical execution signals
4.1. What matters now

Короткий ответ:
что сейчас важнее всего в этой поездке

4.2. Next step

Один конкретный следующий шаг.

4.3. Typical signal meanings
no items yet
pending tasks
no notes yet
trip still thin
planned but not advanced
enough structure already
5. Canonical examples
Example A — Empty trip

Title: Бангкок в мае
Destination: Бангкок
Purpose: Короткая поездка на 5 дней
Items: нет
Tasks: нет
Notes: нет
What matters now: Добавьте первый объект поездки
Next step: Сохраните и привяжите к поездке первое место или жильё

Example B — Thin trip

Title: Фукуок в июне
Destination: Фукуок
Purpose: Отдых и разведка районов
Items: жильё в районе Long Beach, один пост про рынок
Tasks: подтвердить район проживания
Notes: Long Beach кажется удобным
What matters now: Поездке не хватает структуры
Next step: Добавьте ещё 1–2 важных объекта и одну задачу

Example C — Saved-to-trip in progress

Title: Бангкок + Пхукет
Destination: Бангкок, Пхукет
Purpose: Город + море
Items: rooftop в Бангкоке, кафе на Пхукете, отель, публикация про Sukhumvit
Tasks: выбрать район в Бангкоке, решить трансфер
Notes: Бангкок должен быть насыщенным, Пхукет — спокойным
What matters now: Нужно собрать поездку в понятную структуру
Next step: Выберите один ключевой район в Бангкоке

Example D — Active preparation

Title: Вьетнам на месяц
Destination: Хошимин, Дананг, Ханой
Purpose: Длинная exploratory поездка
Items: несколько объектов по городам, жильё, квест, ваучер
Tasks: выбрать первый город, подтвердить жильё, продумать логистику
Notes: первый город должен быть простым для входа
What matters now: Не закрыт первый этап поездки
Next step: Выберите первый город и первое жильё

Example E — Structured trip

Title: Бангкок в октябре
Destination: Бангкок
Purpose: Повторная поездка в знакомый город
Items: 6 объектов, часть уже advanced
Tasks: подтвердить встречу, проверить район
Notes: основной каркас понятен, нужен 1 свободный день
What matters now: Поездка собрана, осталось закрыть детали
Next step: Подтвердите ближайшую встречу

6. Saved → Organizer flows
Flow A

Save first → add to trip later

Flow B

Create trip from this

Flow C

Remove from trip, keep in Saved

Flow D

Same saved object reused in another trip

7. Home screen expectations

Organizer home должен:

показывать portfolio of trips,
показывать один основной фокус,
показывать один next step,
не выглядеть как второй Saved,
не выглядеть как internal milestone screen.
8. Trip detail expectations

Trip detail должен:

показывать trip context,
давать execution summary,
показывать items / tasks / notes,
давать ощущение движения вперёд,
не быть просто CRUD-экраном.
9. Copy tone
Use
короткие product phrases
action-first wording
простой русский язык
Avoid
slice
runtime
bounded truth
fake planner
refinement wave
execution contour
Good examples
Добавьте первый объект поездки
Сейчас важнее всего закрыть открытую задачу
Поездка уже собрана, осталось уточнить детали
Начните с одного следующего шага
Bad examples
Этот slice пока не открывает full planner
Trip container still thin
Runtime unavailable for bounded truth
Execution refinement v1
10. UI interpretation notes
Home ≠ Saved
Trip detail ≠ generic board
Execution focus должен быть сильнее internal language
Пользователь должен понимать:
где shortlist
где поездка
где следующий шаг
11. Deferred meanings

Этот content pack не нормализует как обязательное:

day planner
map
reminder engine
AI planner
comparison
collaboration
broad cross-module saved unification
12. Relation to docs

Читается вместе с:

docs/modules/space/go_2_asia_personal_organizer_ssot_v_1.md
docs/modules/space/Placement-of-Personal-Organizer-inside-Space-Asia.md
docs/modules/space/space_personal_organizer_framing_note_v1.md
docs/modules/space/space_saved_and_organizer_intake_note_v1.md
docs/modules/space/personal_organizer_implementation_plan_v1.md
docs/modules/space/space_frontend_baseline_status_note_v1.md

Этот файл дополняет их живыми примерами и canonical product content.