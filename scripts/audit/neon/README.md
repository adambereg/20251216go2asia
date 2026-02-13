# Neon PostgreSQL Audit Scripts

SQL-скрипты для полного аудита схемы и качества данных в Neon PostgreSQL.

## Назначение

Эти скрипты предназначены для:
- Инвентаризации схемы БД (таблицы, колонки, constraints, индексы)
- Проверки качества данных по всем модулям Go2Asia
- Выявления проблем с импортом/парсингом данных
- Подготовки к исправлению пайплайна импорта

## Структура скриптов

### 01_schema_inventory.sql
**Инвентаризация схемы БД**
- Список всех таблиц и views
- Колонки по каждой таблице
- Primary Keys, Unique Constraints, Foreign Keys
- Индексы
- Enum типы
- Размеры таблиц

### 02_data_health_core.sql
**Базовые проверки качества данных**
- Countries: totals, missing fields, duplicates
- Cities: totals, missing fields, broken references
- Media files: totals, provider distribution, size stats
- Content blocks: totals, distribution by entity_type/tab_key/lang

### 03_data_health_atlas.sql
**Atlas модуль (places, countries, cities)**
- Places overview: totals, by kind, by country/city
- Missing critical fields: coords, tags, description, media
- Broken references: country_id, city_id
- Content blocks coverage: places with/without content_blocks
- Content quality: body_markdown length distribution
- Countries/Cities coverage

### 04_data_health_pulse.sql
**Pulse модуль (events, event_registrations)**
- Events overview: totals, by status, by country/city
- Missing critical fields: dates, coords, media
- Date consistency: end < start, future/past events
- Event registrations: totals, broken references

### 05_data_health_blog.sql
**Blog модуль (articles)**
- Articles overview: totals, by status
- Missing critical fields: title, slug, content, media
- Content quality: length distribution
- Publishing status consistency: status vs is_published

### 06_data_health_rielt.sql
**Rielt модуль (если таблицы существуют)**
- Проверка наличия таблиц listings/properties
- Базовые проверки (если таблицы найдены)

## Как использовать

### Вариант 1: Neon Console SQL Editor

1. Откройте Neon Console → SQL Editor
2. Скопируйте содержимое скрипта
3. Выполните скрипт
4. Сохраните результаты

### Вариант 2: psql

```bash
export DATABASE_URL="postgresql://user:password@host/database"
psql "$DATABASE_URL" -f scripts/audit/neon/01_schema_inventory.sql
```

### Вариант 3: Batch (PowerShell)

```powershell
$DATABASE_URL = "your-connection-string"
Get-ChildItem scripts/audit/neon/*.sql | ForEach-Object {
    psql "$DATABASE_URL" -f $_.FullName | Out-File "audit_results/$($_.Name -replace '\.sql$', '.txt')"
}
```

## Порядок выполнения

Рекомендуемый порядок:
1. `01_schema_inventory.sql` — сначала понять структуру
2. `02_data_health_core.sql` — базовые проверки
3. `03_data_health_atlas.sql` — основной модуль
4. `04_data_health_pulse.sql` — Pulse модуль
5. `05_data_health_blog.sql` — Blog модуль
6. `06_data_health_rielt.sql` — Rielt модуль (может быть пустым)

## Результаты

После выполнения скриптов:
1. Сохраните результаты в файлы или скриншоты
2. Заполните `docs/audits/neon_schema_audit.md` реальными данными
3. Используйте выводы для исправления пайплайна импорта

## Особенности

- **Defensive:** Скрипты не падают, если таблиц нет (используют DO blocks)
- **Read-only:** Только SELECT, никаких UPDATE/DELETE
- **Модульные:** Каждый скрипт проверяет свой модуль
- **Подробные:** Выводят детальную статистику и проблемы

## Связанные документы

- `docs/audits/neon_schema_audit.md` — итоговый отчёт (заполнить после аудита)
- `docs/audits/atlas_places_data_sources_audit.md` — аудит источников данных
