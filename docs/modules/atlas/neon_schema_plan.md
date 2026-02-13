# Atlas Asia — Neon schema plan (Этап B)

Цель: минимально расширить схему и API, чтобы вкладки Atlas (country/city/place) хранились в Neon и отдавались через content-service.

## 1) Минимальная модель данных (MVP)

**Новая таблица:** `content_blocks`

```
content_blocks (
  id              uuid primary key,
  entity_type     text not null,     -- 'country' | 'city' | 'place'
  entity_id       uuid not null,     -- FK на countries/cities/places.id (uuid)
  tab_key         text not null,     -- 'overview' | 'history' | 'culture' | ...
  lang            text not null,     -- 'ru' | 'en' | ...
  title           text,              -- заголовок секции (опционально)
  body_markdown   text not null,     -- контент вкладки (Markdown)
  source          text not null,     -- 'seed' | 'editorial' | 'ugc'
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null,
  unique(entity_type, entity_id, tab_key, lang)
)
```

**Почему так:**
- минимальный слой без сложных связей
- даёт tabs по ключу и языку
- легко UPSERT и версионировать
 - entity_id — UUID: в API принимаем {idOrSlug}, но внутри резолвим в uuid

## 2) Миграция (SQL, минимально инвазивно)

Рекомендация: добавить отдельную миграцию `packages/db/migrations/0003_content_blocks.sql`:
- `CREATE TABLE IF NOT EXISTS content_blocks (...)`
- `CREATE UNIQUE INDEX IF NOT EXISTS content_blocks_uq ON content_blocks(entity_type, entity_id, tab_key, lang)`
- (опц.) `CREATE INDEX` на `(entity_type, entity_id)` для быстрых выборок

## 2.1) Словарь tab_key (фиксируем)

### country_tabs (tab_key)
- overview
- gallery
- map
- cities
- weather
- history
- geography
- culture
- living
- visas
- business
- places
- phrasebook
- reviews
- calculator

### city_tabs (tab_key)
- overview
- districts
- accommodation
- food
- places
- transport
- weather
- shopping
- nightlife
- guides
- tips
- reviews
- budget

Рекомендация: хранить словарь как:
- enum (в DB или коде), либо
- константы в SDK и content-service (runtime validation).

## 3) Контракты API content-service

Минимальный набор эндпоинтов:

### GET /v1/content/countries/{idOrSlug}/tabs
Ответ:
```
{
  "items": [
    {
      "tabKey": "history",
      "lang": "ru",
      "title": "История",
      "bodyMarkdown": "...",
      "updatedAt": "2026-01-16T..."
    }
  ]
}
```

### GET /v1/content/cities/{idOrSlug}/tabs
Ответ:
```
{ "items": [ ... ] }
```

### (опционально) GET /v1/content/places/{idOrSlug}/tabs

**Фильтры (минимальные):**
- `?lang=ru` — вернуть только нужный язык
- `?tabKey=history` — вернуть одну вкладку (для экономии)

## 4) SDK (минимум)

Добавить в `@go2asia/sdk/content`:
- `listCountryTabs(idOrSlug, { lang?, tabKey? })`
- `listCityTabs(idOrSlug, { lang?, tabKey? })`
- (опц.) `listPlaceTabs(...)`

Возвращаемый DTO:
```
ContentTabDto {
  tabKey: string
  lang: string
  title?: string
  bodyMarkdown: string
  updatedAt?: string
}
```

## 5) UI интеграция (только после API)

Принцип:
- UI вкладки дергают API (`/tabs`)
- никакого чтения markdown из репозитория

## 6) Совместимость с текущими таблицами

`countries/cities/places` остаются без изменений; используются для:
- списков
- hero/short‑описаний
- связей (FK)

Контент вкладок полностью живёт в `content_blocks`.

