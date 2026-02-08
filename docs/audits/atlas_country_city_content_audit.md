# Аудит источников контента Atlas (Country/City tabs)

Дата: 2026-02-08  
Репозиторий: `E:/projects/work_go2asia/20251216go2asia`

Цели аудита:
- установить **точный источник данных** для каждой вкладки Country/City
- описать **модель данных** (API поля ↔ Neon таблицы/колонки) + fallback/cache
- подготовить **контракт импорта** из Markdown‑канона, чтобы UI это отрисовал

---

## 1) Карта потоков данных (diagram текстом)

```text
content/atlas/**.md (Markdown-канон)
   │
   │  (exporter / importer должен создать/обновить записи)
   ▼
Neon Postgres
  - countries / cities / places           (карточки/списки)
  - content_blocks                        (markdown для табов)
   │
   ▼
apps/content-service (Cloudflare Worker)
  - GET /v1/content/countries
  - GET /v1/content/cities
  - GET /v1/content/places
  - GET /v1/content/countries/:idOrSlug/tabs
  - GET /v1/content/cities/:idOrSlug/tabs
   │
   ▼
packages/sdk
  - @go2asia/sdk/atlas (React Query hooks для lists)
  - @go2asia/sdk/content (server-safe fetch helpers для tabs)
   │
   ▼
apps/go2asia-pwa-shell (Next.js PWA)
  - /atlas/countries/[id]/*   (часть вкладок = markdown tabs, часть = списки)
  - /atlas/cities/[id]/*      (часть вкладок = markdown tabs, часть = списки)
```

Ключевая мысль: **“markdown‑вкладки” страны/города читаются из `content_blocks` через endpoint `/tabs`**; вкладки-списки (“Города”, “Места/Достопримечательности”) читаются из таблиц `cities`/`places` через list endpoints.

---

## 2) Модель данных (API ↔ Neon)

### 2.1 DTO и эндпоинты

- **Countries list**: `GET /v1/content/countries`  
  DTO: `ContentCountryDto` (см. `apps/content-service/src/index.ts`, `packages/sdk/src/content.ts`)
  - UI получает через `useGetCountryById()` (фильтрует по `id` или `slug` на клиенте) (`packages/sdk/src/atlas.ts`).

- **Cities list**: `GET /v1/content/cities?countryId=...`  
  DTO: `ContentCityDto`
  - UI получает через `useGetCities({ countryId })` (`packages/sdk/src/atlas.ts`).

- **Places list**: `GET /v1/content/places?cityId=...&countryId=...&kind=...&limit=...`  
  DTO: `ContentPlaceDto`
  - UI получает через `useGetPlaces({ cityId, countryId, kind, limit })` (`packages/sdk/src/atlas.ts`).

- **Country tabs**: `GET /v1/content/countries/:idOrSlug/tabs?lang=ru&tabKey=...`  
  DTO: `ContentTabDto` → `items[0].bodyMarkdown`  
  Источник: `content_blocks` (entity_type='country')

- **City tabs**: `GET /v1/content/cities/:idOrSlug/tabs?lang=ru&tabKey=...`  
  DTO: `ContentTabDto` → `items[0].bodyMarkdown`  
  Источник: `content_blocks` (entity_type='city')

### 2.2 Neon таблицы/колонки

**Списки/карточки:**
- `countries`: `id`, `slug`, `name`, `code`, `flag_emoji`, `description_short`, `hero_media_id`
- `cities`: `id`, `slug`, `name`, `country_id`, `description_short`, `lat/lng`, `hero_media_id`
- `places`: `id`, `slug`, `name`, `country_id`, `city_id`, `place_kind`, `category`, `tags`, `description_short`, `lat/lng`, `hero_media_id`, …
- `media_files`: `public_url` (присоединяется как heroImage)

**Markdown‑вкладки:**
- `content_blocks`:
  - `entity_type` (**'country' | 'city' | 'place'**)
  - `entity_id` (text: id сущности)
  - `tab_key` (строковый ключ вкладки)
  - `lang` (например, `'ru'`)
  - `title` (optional)
  - `body_markdown` (**markdown string**, required)
  - `source` (default `'seed'`)
  - unique: `(entity_type, entity_id, tab_key, lang)`

---

## 3) Кэширование и fallback (что может “скрывать” изменения)

### 3.1 Frontend (PWA shell)

- **React Query cache (60s)**: для list endpoints (`useGetCountries`, `useGetCountryById`, `useGetCities`, `useGetCityById`, `useGetPlaces`) в `packages/sdk/src/atlas.ts` стоит `staleTime: 60_000`.
- **Tabs (country/city) НЕ через React Query**: компонент `AtlasTabContent` делает fetch в `useEffect`, без query-cache, и берёт `response.items?.[0]` (`apps/go2asia-pwa-shell/modules/atlas/components/AtlasTabContent.tsx`).
- **Mock fallback (важно для диагностики)**:
  - `CountryOverviewPage`/`CityOverviewPage` и ряд list‑страниц подмешивают `mockRepo` если API пуст/недоступен.
  - `AtlasTabContent` **не** подмешивает мок — при ошибке показывает `error`, при пустом `bodyMarkdown` показывает `"Контент в разработке."`.

### 3.2 API (content-service)

- **Кэш только для media‑разрешения (R2)**: `atlasMediaCache` (Map) TTL ~10 мин для hits и ~5 мин для empty (`apps/content-service/src/index.ts`).
- **Для content tabs (`content_blocks`) in-memory кэша нет**: каждый запрос `/tabs` вызывает `listContentBlocks(...)`.
- **HTTP Cache-Control не выставляется** в `json()` (только `Content-Type: application/json`) — edge/CDN кэш возможен только внешней конфигурацией.

---

## 4) Часть A — аудит фронтенда (PWA Shell)

### 4.1 Компоненты страниц и routes

**Country:**
- Layout: `apps/go2asia-pwa-shell/app/(public)/atlas/countries/[id]/layout.tsx`
- Overview page: `apps/go2asia-pwa-shell/app/(public)/atlas/countries/[id]/page.tsx`
- Tabs (markdown): отдельные route‑страницы, которые возвращают `AtlasTabContent entityType="country" tabKey="..."` (например: `.../weather/page.tsx`, `.../history/page.tsx`, …)
- Tabs (списки): `.../cities/page.tsx`, `.../places/page.tsx` (НЕ `AtlasTabContent`)

**City:**
- Layout: `apps/go2asia-pwa-shell/app/(public)/atlas/cities/[id]/layout.tsx`
- Overview page: `apps/go2asia-pwa-shell/app/(public)/atlas/cities/[id]/page.tsx`
- Tabs (markdown): route‑страницы под `.../[id]/<tab>/page.tsx` (districts/accommodation/food/…)
- Tab “places”: `apps/go2asia-pwa-shell/app/(public)/atlas/cities/[id]/places/page.tsx` (список мест, НЕ `AtlasTabContent`)

### 4.2 Откуда берётся контент

**Country/City overview (карточка/мета):**
- `useGetCountryById(idOrSlug)` / `useGetCityById(idOrSlug)` → `GET /v1/content/countries` или `GET /v1/content/cities` и далее **клиентская фильтрация** по `id`/`slug` (`packages/sdk/src/atlas.ts`).

**Markdown‑вкладки (tabs):**
- `AtlasTabContent` вызывает:
  - `listCountryTabs(idOrSlug, { lang:'ru', tabKey })` или
  - `listCityTabs(idOrSlug, { lang:'ru', tabKey })`
  и рендерит `response.items[0].bodyMarkdown` (`apps/go2asia-pwa-shell/modules/atlas/components/AtlasTabContent.tsx`).

**Вкладки‑списки:**
- Country “Города”: `useGetCities({ countryId })` → `GET /v1/content/cities?countryId=...` (`.../countries/[id]/cities/page.tsx`)
- Country “Достопримечательности”: `useGetPlaces({ limit:50 })` → сейчас фактически `GET /v1/content/places?limit=50` без фильтра по стране (`.../countries/[id]/places/page.tsx`)
- City “Места”: `useGetPlaces({ cityId, kind, limit:50 })` → `GET /v1/content/places?cityId=...&kind=...&limit=50` (`.../cities/[id]/places/page.tsx`)

---

## 5) Часть B — аудит API (content-service)

### 5.1 Endpoints и handlers

Роутинг и handlers находятся в `apps/content-service/src/index.ts`:
- `GET /v1/content/countries` → `handleListCountries()` → `listCountries(sql)`
- `GET /v1/content/cities` → `handleListCities()` → `listCities(sql, countryId?)`
- `GET /v1/content/places` → `handleListPlaces()` → `listPlaces(sql, {cityId?, countryId?, kind?, limit?})`
- `GET /v1/content/countries/:idOrSlug/tabs` → `handleListCountryTabs()`:
  - resolve id: `getCountryIdByIdOrSlug(sql, idOrSlug)`
  - fetch: `listContentBlocks(sql, 'country', countryId, { tabKey, lang })`
- `GET /v1/content/cities/:idOrSlug/tabs` → `handleListCityTabs()`:
  - resolve id: `getCityIdByIdOrSlug(sql, idOrSlug)`
  - fetch: `listContentBlocks(sql, 'city', cityId, { tabKey, lang })`

### 5.2 Как формируются вкладки/блоки

- `/tabs` = **проекция таблицы `content_blocks`** в `ContentTabDto`:
  - `tabKey` ← `content_blocks.tab_key`
  - `lang` ← `content_blocks.lang`
  - `title` ← `content_blocks.title`
  - `bodyMarkdown` ← `content_blocks.body_markdown`
  - `updatedAt` ← `content_blocks.updated_at`

Фильтрация:
- обязательные: `entity_type`, `entity_id`
- опциональные: `tab_key`, `lang` (в разных комбинациях) — см. `listContentBlocks()` в `packages/db/src/queries/content.ts`.

---

## 6) Часть C — аудит БД Neon (источник истины)

### 6.1 Ассоциация blocks ↔ сущность

Ассоциация полиморфная:
- `content_blocks.entity_type` + `content_blocks.entity_id` (text)
- FK constraint на уровне DB нет (по коду подразумевается соответствие `countries.id` / `cities.id` / `places.id`)

### 6.2 “Контракт вкладок” на уровне DB

Для того, чтобы вкладка, которая рендерится через `AtlasTabContent`, показала контент, в Neon должен существовать ряд:
- `content_blocks.entity_type = 'country'` или `'city'`
- `content_blocks.entity_id = <реальный id из таблицы countries/cities>`
- `content_blocks.tab_key = <tabKey>`
- `content_blocks.lang = 'ru'` (UI сейчас жёстко использует `'ru'`)
- `content_blocks.body_markdown` непустой

---

## 7) Таблица вкладок: Country

Колонки: UI label → endpoint → response field path → DB source → tab_key/kind → fallback/caching notes.

| UI label | API endpoint (факт) | response field path (факт) | DB source | tab_key / kind | fallback / caching notes |
|---|---|---|---|---|---|
| Обзор | `GET /v1/content/countries` **и** `GET /v1/content/countries/:idOrSlug/tabs?lang=ru&tabKey=overview` | meta: `countryData.*`; tab: `items[0].bodyMarkdown` | `countries.*` + `content_blocks(body_markdown)` | `overview` / entity_type=`country` | ReactQuery 60s для meta; для tab без RQ cache; empty tab → “Контент в разработке.” |
| Фотогалерея | `.../countries/:idOrSlug/tabs?...tabKey=gallery` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `gallery` / `country` | empty → “Контент в разработке.” |
| Карта | `...tabKey=map` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `map` / `country` | empty → “Контент в разработке.” |
| Города | `GET /v1/content/cities?countryId=:countryId` | `items[].name`, `items[].description`, `items[].placesCount` | `cities` (+ count из `places`) | (не `/tabs`) | **Важно:** `countryId` должен быть именно `countries.id` (не slug). ReactQuery 60s. |
| Погода и климат | `...tabKey=weather` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `weather` / `country` | empty → “Контент в разработке.” |
| История | `...tabKey=history` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `history` / `country` | empty → “Контент в разработке.” |
| География | `...tabKey=geography` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `geography` / `country` | empty → “Контент в разработке.” |
| Культура | `...tabKey=culture` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `culture` / `country` | empty → “Контент в разработке.” |
| Проживание | `...tabKey=living` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `living` / `country` | empty → “Контент в разработке.” |
| Визы | `...tabKey=visas` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `visas` / `country` | empty → “Контент в разработке.” |
| Бизнес | `...tabKey=business` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `business` / `country` | empty → “Контент в разработке.” |
| Достопримечательности | `GET /v1/content/places?...` (сейчас без `countryId`) | `items[].name`, `items[].description`, … | `places` | (не `/tabs`) | **Сейчас UI не передаёт `countryId` в API** (TODO в коде), поэтому список может быть “все места”. |
| Разговорник | `...tabKey=phrasebook` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `phrasebook` / `country` | empty → “Контент в разработке.” |
| Отзывы экспатов | `...tabKey=reviews` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `reviews` / `country` | empty → “Контент в разработке.” |
| Калькулятор стоимости | `...tabKey=calculator` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `calculator` / `country` | empty → “Контент в разработке.” |

Примечание: в `CountryLayout` один пункт меню имеет `key: 'sights'`, но ведёт на `href: 'places'` — **ключ меню не равен tabKey**, ориентироваться нужно на `tabKey` (и/или route сегмент).

---

## 8) Таблица вкладок: City

| UI label | API endpoint (факт) | response field path (факт) | DB source | tab_key / kind | fallback / caching notes |
|---|---|---|---|---|---|
| Обзор | `GET /v1/content/cities` **и** `GET /v1/content/cities/:idOrSlug/tabs?lang=ru&tabKey=overview` | meta: `cityData.*`; tab: `items[0].bodyMarkdown` | `cities.*` + `content_blocks(body_markdown)` | `overview` / entity_type=`city` | ReactQuery 60s для meta; tab без RQ cache; empty tab → “Контент в разработке.” |
| Районы | `.../cities/:idOrSlug/tabs?...tabKey=districts` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `districts` / `city` | empty → “Контент в разработке.” |
| Проживание | `...tabKey=accommodation` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `accommodation` / `city` | empty → “Контент в разработке.” |
| Еда и кафе | `...tabKey=food` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `food` / `city` | empty → “Контент в разработке.” |
| Достопримечательности (Места) | `GET /v1/content/places?cityId=:cityId&kind=:kind&limit=50` | `items[]` | `places` | (не `/tabs`) | **Важно:** `cityId` должен совпадать с `places.city_id` (обычно это `cities.id`, не slug). |
| Транспорт | `...tabKey=transport` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `transport` / `city` | empty → “Контент в разработке.” |
| Погода и сезонность | `...tabKey=weather` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `weather` / `city` | empty → “Контент в разработке.” |
| Шопинг | `...tabKey=shopping` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `shopping` / `city` | empty → “Контент в разработке.” |
| Ночная жизнь | `...tabKey=nightlife` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `nightlife` / `city` | empty → “Контент в разработке.” |
| Гайды | `...tabKey=guides` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `guides` / `city` | empty → “Контент в разработке.” |
| Практическая информация | `...tabKey=tips` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `tips` / `city` | empty → “Контент в разработке.” |
| Отзывы | `...tabKey=reviews` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `reviews` / `city` | empty → “Контент в разработке.” |
| Цены и бюджет | `...tabKey=budget` | `items[0].bodyMarkdown` | `content_blocks.body_markdown` | `budget` / `city` | empty → “Контент в разработке.” |

---

## 9) Список необходимых tab_key/kind для импорта из Markdown

### 9.1 tab_key, которые UI реально рендерит (ключи)

Источник списка ключей (SDK): `packages/sdk/src/content.ts`:

**Country tab_key:**
`overview`, `gallery`, `map`, `cities`, `weather`, `history`, `geography`, `culture`, `living`, `visas`, `business`, `places`, `phrasebook`, `reviews`, `calculator`

**City tab_key:**
`overview`, `districts`, `accommodation`, `food`, `places`, `transport`, `weather`, `shopping`, `nightlife`, `guides`, `tips`, `reviews`, `budget`

### 9.2 Какие из них требуют `content_blocks` (а какие — нет)

- **Рендерятся через `content_blocks` (AtlasTabContent → /tabs)**:
  - Country: все **кроме** вкладок‑списков `cities` и (по текущему UI) `places`
  - City: все **кроме** вкладки‑списка `places`

- **Рендерятся как списки из таблиц**:
  - Country `cities`: требуется наполненный `cities` (с `country_id`) и endpoint `GET /v1/content/cities?countryId=...`
  - Country `places`: требуется наполненный `places` (в идеале `GET /v1/content/places?countryId=...` — но UI пока не передаёт `countryId`)
  - City `places`: требуется `places` с `city_id` и `place_kind`, endpoint `GET /v1/content/places?cityId=...&kind=...`

### 9.3 “kind/block_type”

В текущей схеме Neon **нет `block_type`** для country/city tabs. Контракт определяется полями:
- `entity_type` (это и есть “kind” сущности: `'country'|'city'`)
- `tab_key`
- `lang`
- `body_markdown` (+ optional `title`)

---

## 10) Часть D — практическая проверка (end-to-end)

Рекомендуемые “контрольные” идентификаторы (для smoke и трассировки):
- **Страна:** `th` (country_id в экспортируемых places = `'th'`)
- **Город (для places list):** `bkk` (в экспортируемых places `city_id='bkk'`)

### 10.1 Цепочка для вкладки “Города” на стране (list)

- UI: `apps/go2asia-pwa-shell/app/(public)/atlas/countries/[id]/cities/page.tsx`
- API: `GET /v1/content/cities?countryId=th`
- SQL: `listCities(sql, 'th')` (`packages/db/src/queries/content.ts`)
- DB: `cities WHERE country_id='th'` + subquery count places

### 10.2 Цепочка для вкладки “Достопримечательности/Места” в городе (list)

- UI: `apps/go2asia-pwa-shell/app/(public)/atlas/cities/[id]/places/page.tsx`
- API: `GET /v1/content/places?cityId=bkk&kind=showplace&limit=50`
- SQL: `listPlaces(sql, { cityId:'bkk', kind:'showplace', limit:50 })`
- DB: `places WHERE city_id='bkk' AND place_kind='showplace'`

### 10.3 Пример response JSON (ключевые поля)

**Tabs (country/city):**

```json
{
  "items": [
    {
      "tabKey": "weather",
      "lang": "ru",
      "title": "Погода и климат",
      "bodyMarkdown": "…markdown…",
      "updatedAt": "2026-02-08T00:00:00.000Z"
    }
  ]
}
```

**Cities list:**

```json
{
  "items": [
    {
      "id": "bkk",
      "slug": "bangkok",
      "name": "Бангкок",
      "countryId": "th",
      "countryName": "Thailand",
      "description": "…",
      "placesCount": 123,
      "latitude": "13.756300",
      "longitude": "100.501800",
      "heroImage": "https://…"
    }
  ]
}
```

**Places list:**

```json
{
  "items": [
    {
      "id": "bkk-grand-palace",
      "slug": "bkk-grand-palace",
      "name": "🏛️ Grand Palace",
      "type": "attraction",
      "kind": "showplace",
      "category": "attraction",
      "tags": ["attraction", "bangkok", "heritage", "must-see"],
      "countryId": "th",
      "cityId": "bkk",
      "description": "…",
      "latitude": "13.750000",
      "longitude": "100.491300",
      "heroImage": "https://…",
      "photos": ["https://…"]
    }
  ]
}
```

---

## 11) Риски и замечания

- **Несовпадение id/slug в URL vs фильтры list endpoints**:
  - `/tabs` принимает `idOrSlug` (резолвит через `getCountryIdByIdOrSlug/getCityIdByIdOrSlug`) — ок.
  - `listCities` и `listPlaces` фильтруют по `country_id`/`city_id` **без резолва slug** → если UI роутится по slug, список может быть пустым.
- **Country “places” UI сейчас не фильтрует по стране**: `countryId` в `useGetPlaces` закомментирован (TODO) → вкладка может показывать “все места”.
- **Country places UI использует поле `place.categories`**, которого нет в `ContentPlaceDto` (там `category` и `tags`) → возможна деградация/пустые метки.
- **Пустой `body_markdown` скрывает вкладку контентом** (не скрывает вкладку в меню, но показывает “Контент в разработке.”).
- **Кэш**:
  - ReactQuery 60s может скрывать изменения lists.
  - внешняя edge-cache возможна (но сервис не выставляет Cache-Control).
- **Уникальность `content_blocks`**: импорт должен быть idempotent (upsert) по `(entity_type, entity_id, tab_key, lang)`.

---

## 12) Рекомендованный контракт импорта (что должен генерировать exporter)

### 12.1 Для markdown‑вкладок Country/City

Exporter/importer должен создать записи в `content_blocks`:
- **entity_type**: `'country'` или `'city'`
- **entity_id**: реальный `countries.id` / `cities.id` (не обязательно slug)
- **tab_key**: один из ключей из `packages/sdk/src/content.ts`
- **lang**: `'ru'` (пока UI хардкодит ru в `AtlasTabContent`)
- **title**: optional (можно = заголовок раздела из markdown)
- **body_markdown**: markdown‑тело вкладки (не пустое)
- **source**: `'seed'` или `'editorial'` (на ваше усмотрение)

Минимальный шаблон UPSERT:

```sql
INSERT INTO content_blocks (entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at)
VALUES ('country', '<country_id>', 'weather', 'ru', 'Погода и климат', '<markdown>', 'seed', NOW(), NOW())
ON CONFLICT (entity_type, entity_id, tab_key, lang)
DO UPDATE SET title=EXCLUDED.title, body_markdown=EXCLUDED.body_markdown, source=EXCLUDED.source, updated_at=NOW();
```

### 12.2 Для вкладок-списков (не content_blocks)

- **Country “Города”**: нужны строки в `cities` с корректным `country_id` и чтобы UI передавал в API именно этот `country_id`.
- **City “Места”**: нужны строки в `places` с корректным `city_id` (и `place_kind`), и чтобы UI передавал в API именно этот `city_id`.
- **Country “Достопримечательности”**: либо UI должен начать передавать `countryId` в `useGetPlaces`, либо API/handler должен уметь резолвить slug в id.

---

## 13) Короткий вывод после аудита (без запуска импорта)

- **Чтобы вкладка Country “Погода и климат” (и другие markdown‑табы) заполнилась**:
  - в Neon должен быть `content_blocks` с `entity_type='country'`, `entity_id=<countries.id>`, `tab_key='weather'`, `lang='ru'`, `body_markdown` непустой.
  - UI берёт это через `AtlasTabContent` → `listCountryTabs(...tabKey=weather)` → `response.items[0].bodyMarkdown`.

- **Чтобы вкладка Country “Города” заполнилась**:
  - нужны строки в `cities` с `country_id=<countries.id>` и запрос `GET /v1/content/cities?countryId=<countries.id>`.
  - UI берёт это через `useGetCities({ countryId })` и рендерит `items[]`.

- **Чтобы вкладка City “Достопримечательности/Места” заполнилась**:
  - нужны строки в `places` с `city_id=<cities.id>` и `place_kind` (showplace/business),
  - UI берёт это через `useGetPlaces({ cityId, kind })` → `GET /v1/content/places?cityId=...&kind=...`.

- **Нужные ключи для импорта tabs**:
  - `entity_type ∈ {'country','city'}`
  - `tab_key` из списков `COUNTRY_TAB_KEYS` / `CITY_TAB_KEYS` (см. `packages/sdk/src/content.ts`)
  - `lang='ru'`
  - `body_markdown` (markdown) + optional `title`

