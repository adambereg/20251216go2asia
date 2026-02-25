# Guide Engine v1 — Gate C smoke checklist (PWA)

Дата: 2026-02-15

## Предусловия

- Применена миграция `0006_atlas_guides_engine_v1.sql`
- Загружены fixtures: `scripts/manual/neon/atlas/guide_engine_v1_fixtures.sql`
- Staging API Gateway указывает на актуальный `content-service` (эндпойнты `/v1/guides*`)

## 1) API smoke

- `GET /v1/guides`
  - возвращает `items[]`
  - у элементов есть `slug`, `title`
- `GET /v1/guides/digital-nomads-sea-2026`
  - возвращает `sections[]` (не пустой)
  - `sections[].tabKey` ∈ 11 tab_key
  - `sections[]` уже filtered non-empty
- `GET /v1/guides/first-week-in-bangkok`
  - возвращает `sections[]` (не пустой)

## 2) PWA UI smoke (Gate C/D)

### A) digital-nomads-sea-2026

- Открыть `/atlas/guides/digital-nomads-sea-2026`
- Проверить:
  - таб-бар построен **строго из `sections[]`** (нет лишних вкладок)
  - порядок вкладок соответствует `orderIndex`
  - overview рендерит `rich_text` markdown
  - вкладка `places` / `experience` (если есть в sections) показывает **карточки** из `feedsResolved[]` (либо fallback сообщение при недоступности)

### B) first-week-in-bangkok

- Открыть `/atlas/guides/first-week-in-bangkok`
- Проверить:
  - вкладки: `overview`, `route`, `map`, `events` (как в fixtures; порядок по `orderIndex`)
  - `route` рендерит блок `day_plan` (в v1 сейчас как Unsupported в dev, ожидаемо до расширения)
  - `map` показывает placeholder `map_config`
  - `events` показывает **карточки** из `feedsResolved[]` (либо fallback сообщение при недоступности)

## 3) Негативный кейс

- Если `sections[]` пустой (draft без контента), UI показывает: **“Гайд пока в разработке.”**

## 4) Регрессия

- Убедиться, что не сломались:
  - `/atlas/countries/*`
  - `/atlas/cities/*`
  - `/atlas/places/*`
  - `/blog/*`

