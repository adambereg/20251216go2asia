# Guide Engine v1 (Atlas Asia) — контракт (Gate A)

Дата: 2026-02-15  
Статус: Draft (для подтверждения Gate A)

## Цель

Сделать единый “движок гайдов”, где:
- вкладки формируются **динамически** из `sections[]`
- вкладка показывается **только если непустая** (правило ниже)
- контент вкладок = **sections/blocks** (Neon) + **feeds** (Pulse/Places/Blog)
- вкладки = **11 универсальных контейнеров**, вкладки `versions` **нет**

## Реестры (enums)

### `tab_key` (11 универсальных вкладок)
`overview`, `compare`, `locations`, `route`, `map`, `practice`, `events`, `places`, `audience`, `faq`, `experience`

### `guide_type`
`strategic`, `comparative`, `route`, `niche`, `event`, `housing`, `visa`, `work_infra`, `climate`

### `guide_status`
`draft`, `published`, `verified`, `archived`

### `block_type` (v1)
- **Base**: `rich_text`, `callout`, `bullets`, `key_facts`, `media`, `divider`
- **Structure**: `checklist`, `steps`, `timeline`, `day_plan`, `table`, `scorecard`
- **Geo/refs**: `map_config`, `poi_refs`, `city_refs`
- **FAQ/linking**: `faq`, `related_guides`
- **Integration**: `feed_embed`

### `feed_source` (v1)
`pulse`, `atlas_places`, `blog`

### `feed_sort` (v1)
`relevance`, `newest`, `popular`, `date_asc`, `date_desc`

## Schema (Neon Postgres)

DDL зафиксирован миграцией:
- `packages/db/migrations/0006_atlas_guides_engine_v1.sql`

Минимально необходимые таблицы:
- `guides` — мета
- `guide_sections` — 1 ряд на `guide_id + tab_key`
- `guide_blocks` — блоки внутри секции + `is_empty`
- `guide_feeds` — динамические источники на `guide_id + tab_key`

### Важные поля и типы (v1)

- `guides.tags`, `guides.country_ids`, `guides.city_ids` — **массивы** (`text[]`) для простых фильтров и GIN-индексов.
- `guide_feeds.filter` — `jsonb` (фильтры зависят от `source` и не нормализуются в v1).

## Правило “непустой вкладки” (обязательное)

Вкладка (section) считается **непустой** и должна быть возвращена в `GET /v1/guides/:slug`, если:
1) `guide_sections.is_enabled = true`
и
2) выполняется хотя бы одно:
- есть хотя бы один `guide_blocks` в этой секции с `is_empty = false`
- есть хотя бы один `guide_feeds` для `(guide_id, tab_key)` с `is_enabled = true`

Примечание: curated refs (`poi_refs/city_refs/related_guides`) удовлетворяют правилу через валидатор `is_empty=false`, если массивы не пустые.

### Мини-валидаторы `is_empty` (на сохранении блока)

- `rich_text`: `payload.markdown.trim().length >= 20`
- `bullets/checklist/steps/timeline/faq`: `payload.items.length >= 1` (или `payload.qa.length>=1` для `faq`)
- `table`: `payload.rows.length >= 1`
- `poi_refs/city_refs/related_guides`: массив id ≥ 1
- `map_config`: задан `center` и есть хотя бы один слой/маршрут/запрос (v1: минимум `center`)
- `divider`: всегда `is_empty=true` (не делает вкладку непустой)

## Default sections по `guide_type` (автогенерация)

При создании гайда backend создаёт `guide_sections` по матрице:
- `route`: overview, route, map, places, practice, events, faq, experience
- `visa`: overview, compare, practice, faq, experience
- `comparative`: overview, compare, locations, practice, faq, experience
- `event`: overview, events, map, locations, practice, faq, experience
- `niche`: overview, audience, compare, locations, practice, places, events, faq, experience
- `housing`: overview, locations, places, practice, faq, experience
- `work_infra`: overview, compare, locations, places, practice, events, faq, experience

## Public API (v1)

### `GET /v1/guides`
Фильтры (query):
- `country_id` (попадает в `guides.country_ids[]`)
- `city_id` (попадает в `guides.city_ids[]`)
- `guide_type`
- `tag`
- `status` (по умолчанию: `published|verified`)
- `limit` (дефолт 20, max 100)
- `cursor` (опционально; если используем cursor-пагинацию)

Ответ: карточки гайдов (без секций).

### `GET /v1/guides/:slug`
Возвращает:
- `guide` (meta)
- `sections[]` — **только непустые**, отсортированные по `order_index`
  - `section.tabKey`, `section.title`, `blocks[]`, `feeds[]`

Важно: структура должна позволять UI построить вкладки **без дополнительных запросов к Neon**.

## Admin API (v1, минимально)

CRUD:
- guides
- sections (enable/disable, order, title)
- blocks (create/update/delete, order; сервер выставляет `is_empty`)
- feeds (create/update/delete, order)

Авторизация v1: минимум `X-User-ID` header (как уже используется в content-service для media upload).

## Источник контента (Markdown-канон)

### Пути (canonical + legacy)

- **Canonical (v1)**: `content/atlas/guides/*.md`
- **Legacy alias (deprecated)**: `content/atlas/guide/*.md`

#### План миграции путей

- **Сейчас**: импортер читает **оба** пути, чтобы не ломать существующий контент.
- **T+1**: новые файлы добавляем **только** в canonical (`content/atlas/guides/`).
- **T+2**: переносим существующие 42 файла из `content/atlas/guide/` → `content/atlas/guides/` (git mv).
- **T+3**: удаляем legacy поддержку из импортера (и обновляем документацию).

Формат:
- YAML frontmatter обязателен
- тело разбито на вкладки маркерами: `<!-- tab: overview -->`

Импорт (скрипт) должен создавать/обновлять:
- `guides` из frontmatter
- `guide_sections` по `guide_type` + наличию табов в Markdown
- `guide_blocks` как минимум: 1 `rich_text` блок на каждую tab-секцию (payload `{ markdown }`) с корректным `is_empty`

## is_empty как серверная истина (обязательное)

- Поле `guide_blocks.is_empty` вычисляется **на backend** при `create/update` блока и **не принимается как есть** от клиента.
- В Public API `is_empty` может возвращаться (для дебага/QA), но UI не должен на него полагаться — UI получает `sections[]` уже отфильтрованные по non-empty rule.

## Non-empty sections как контракт API (обязательное)

- Public `GET /v1/guides/:slug` возвращает `sections[]` **уже отфильтрованные** по правилу “непустой вкладки”.
- Для админки предусмотрено:
  - либо отдельный endpoint (admin),
  - либо параметр `include_empty=true` (только admin), чтобы видеть **все** секции, включая пустые/disabled.

