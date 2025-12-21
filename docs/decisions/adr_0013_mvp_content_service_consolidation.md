## ADR-0013: MVP content modules served by a single Content Service (temporary)

### Статус

Принято (MVP / временно).

### Контекст

Для Milestone 4 (MVP) нужно быстро перевести UI Atlas / Pulse / Blog на данные из Neon PostgreSQL (SSOT через Drizzle schema + migrations), сохранив PWA Shell и визуальную часть без изменений.

Полное разнесение по отдельным сервисам (atlas-service, pulse-service, media-service и т.д.) — целевой дизайн, но это увеличивает объём работ и риски интеграции в MVP.

### Решение

На этапе MVP допускаем упрощение:

- **Atlas / Blog / Pulse** обслуживаются одним **content-service** (read-heavy, MVP scope).
- База данных остаётся единственным источником истины (SSOT) через миграции в репозитории.

### SSOT поля vs legacy (временная совместимость)

В рамках MVP **источник истины** для новых интеграций:

- **Pulse events**: `start_at` / `end_at` (timestamptz) и `lat` / `lng` (numeric(9,6))
- **Atlas cities/places**: `lat` / `lng` (numeric(9,6))

Поля-«legacy» (`start_date/end_date`, `latitude/longitude`) оставлены только для совместимости на переходном этапе и считаются **deprecated/read-only**. План: удалить legacy после миграции на API/seed (после PR#2/PR#3) / в Milestone 5.

### Последствия

- Плюсы: быстрее интеграция фронта с API, меньше сервисных границ в MVP.
- Минусы: позже потребуется плановая декомпозиция API и таблиц/моделей по сервисам.

### Выход из временного решения (не в MVP)

После стабилизации MVP:

- выделить отдельные сервисы/контракты (atlas-service / pulse-service / media-service),
- перенести read-endpoints и, при необходимости, разделить схемы/таблицы (или схемы Postgres) без ломки фронтенда.

