# Guide Engine v1 — Gate D smoke (feedsResolved)

Дата: 2026-02-15

## Архитектурная схема запроса (текстом)

```text
PWA: /atlas/guides/:slug
  |
  | 1 request
  v
Content Service (apps/content-service)
  GET /v1/guides/:slug
    |
    | Neon queries:
    | - guides / guide_sections / guide_blocks / guide_feeds
    | - + feed resolution queries (events / places / articles) batched by source+tab
    v
Response:
  guide meta
  sections[] (filtered non-empty after feedsResolved)
    - blocks[]
    - feeds[] (config)
    - feedsResolved[] (cards for UI)
```

## Какие сервисы/источники дергаются

В v1 резолвинг feeds идёт **внутри Content Service через Neon**:
- `pulse` → таблица `events`
- `atlas_places` → таблица `places`
- `blog` → таблица `articles`

UI в браузере не делает прямых вызовов Pulse/Places/Blog.

## Таймаут и graceful fallback

- Таймаут на резолвинг каждого `(tabKey, source)` = **1500ms**
- При таймауте/ошибке `feedsResolved[]` становится пустым для этой группы
- Секция в public ответе скрывается, если **нет непустых blocks[]** и **feedsResolved[] пустой**

## Кэширование

- In-memory cache в Content Service на **45 секунд** для public `GET /v1/guides/:slug` (без `include_empty`)

## Smoke test (staging)

### 1) API

- `GET /v1/guides/digital-nomads-sea-2026`
  - `sections[].feedsResolved[]` присутствует (может быть пустым, если нет данных в events/places/articles)

- `GET /v1/guides/first-week-in-bangkok`
  - секция `events` либо есть с `feedsResolved`, либо скрыта (если резолвинг пустой и blocks пустые)

### 2) PWA

- `/atlas/guides/digital-nomads-sea-2026`:
  - если `feedsResolved` не пустой — видим карточки
  - если пустой — видим fallback сообщение только когда есть статические блоки

