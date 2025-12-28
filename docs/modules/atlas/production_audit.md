# Atlas Asia — Production Audit (Этап 1)

Цель аудита: зафиксировать **фактическое** состояние модуля Atlas Asia с точки зрения production‑ready, а не архитектурной готовности.

**Definition of done (prod-ready):**
- страницы открываются без runtime‑ошибок
- данные в prod берутся из **реальных API**
- **mock используется только в dev** (и не является fallback в prod)

## Контекст окружения / переключатель источника данных

Переключатель источника данных реализован в `apps/go2asia-pwa-shell/mocks/dto.ts`:
- `getDataSource()` читает `process.env.NEXT_PUBLIC_DATA_SOURCE`
- если значение `mock` → mock‑режим
- иначе → `api` (дефолт)

Важно: несмотря на дефолт `api`, в текущей реализации **во многих местах в api‑режиме есть fallback на mockRepo**, что нарушает требование prod-ready.

## Реальные API, которые вызываются Atlas (на сегодня)

Atlas (SDK `@go2asia/sdk/atlas`, `packages/sdk/src/atlas.ts`):
- `GET /v1/content/countries`
- `GET /v1/content/cities` (опционально `?countryId=...`)
- `GET /v1/content/places` (опционально `?cityId=...&limit=...`)
- `GET /v1/content/places/{idOrSlug}`

Guides (SDK `@go2asia/sdk/blog`, `packages/sdk/src/blog.ts`):
- `GET /v1/content/articles?limit=...`
- `GET /v1/content/articles/{slug}`

Themes (прямой `fetch` из браузера, `apps/go2asia-pwa-shell/app/(public)/atlas/themes/[id]/layout.tsx`):
- `GET {NEXT_PUBLIC_API_URL}/v1/api/content/themes/{id}` **(похоже на несуществующий контракт; в OpenAPI/SDK темы отсутствуют)**

## DTO / типы данных (важно для prod)

Критичное: в сгенерированных DTO широта/долгота — **строки**, а не числа:
- `ContentCityDto.latitude?: string | null`, `ContentCityDto.longitude?: string | null` (`packages/sdk/src/generated/contentCityDto.ts`)
- `ContentPlaceDto.latitude?: string | null`, `ContentPlaceDto.longitude?: string | null` (`packages/sdk/src/generated/contentPlaceDto.ts`)

Это уже приводит к runtime‑падению на страницах города (см. ниже).

## Наблюдаемые runtime‑ошибки (по факту)

- **CRASH:** `TypeError: n.latitude.toFixed is not a function` на страницах городов в api‑режиме.
  - причина: UI вызывает `toFixed()` на `latitude/longitude`, которые приходят как `string|null` по DTO
  - место: `apps/go2asia-pwa-shell/app/(public)/atlas/cities/[id]/page.tsx`
- **Шум в консоли (не Atlas‑специфично, но влияет на UX):** `icon-192.png` 404 из `manifest` (видно на скринах).

## Таблица аудита: URL → источник данных → статус → проблема

Легенда:
- **Источник данных (UI)**: откуда реально берутся данные на странице (SDK/API, mockRepo, статическая заглушка)
- **Mock/Fallback**: есть ли подмена данных на mock в api‑режиме
- **Статус**:
  - ✅ работает
  - ⚠️ работает, но не prod‑ready
  - ❌ падает (runtime)
  - 🧱 заглушка/демо (нет реального API)

| URL | Источник данных (UI) | Реальные API вызовы | Mock/Fallback в api | Статус | Проблема | Изображения (R2 vs внешние) |
|---|---|---|---|---|---|---|
| `/atlas` | `CountriesClient` | `GET /v1/content/countries` | **Да** (fallback на `mockRepo.atlas.listCountries()` при пустом API) | ⚠️ | В prod возможна подмена на mock при проблемах API | `heroImage` из API (ожидаемо R2/CDN), но fallback/mock содержит `pexels` |
| `/atlas/countries` | `CountriesClient` | `GET /v1/content/countries` | **Да** (fallback на mock) | ⚠️ | То же, что `/atlas` | То же |
| `/atlas/cities` | `CitiesClient` | `GET /v1/content/cities` | **Да** (fallback на mock при пустом API) | ⚠️ | В prod возможна подмена на mock | `heroImage` из API (R2/CDN) либо серый плейсхолдер; mock тоже используется как fallback |
| `/atlas/places` | `PlacesClient` | `GET /v1/content/places?limit=20` | **Да** (fallback на mock при пустом API) | ⚠️ | В prod возможна подмена на mock | фото из API (`photos[0]`), иначе серый плейсхолдер; mock содержит внешние URL |
| `/atlas/guides` | `GuidesClient` | `GET /v1/content/articles?limit=20` | **Да** (fallback на mock при пустом API) | ⚠️ | В prod возможна подмена на mock | `coverImage` из API, иначе серый плейсхолдер; mock/fallback содержит внешние URL |
| `/atlas/themes` | `ThemesIndexPage` | **нет** (данные темы берутся из `mockRepo` даже в api‑режиме) | **Всегда** (константа `themes = mockRepo...`) | ⚠️ | В prod всегда mock‑данные (нарушение требований) | `heroImage` из mock (внешние URL) |
| `/atlas/hubs/[slug]` | `TopicHubView` | нет | Нет (в api‑режиме hub=null) | 🧱 | Нет реального API для хабов; страница “в разработке” | heroImage не используется |

### Страны (деталка)
| URL | Источник данных (UI) | Реальные API вызовы | Mock/Fallback в api | Статус | Проблема | Изображения |
|---|---|---|---|---|---|---|
| `/atlas/countries/[id]` (layout) | `useGetCountryById` + pexels fallback | `GET /v1/content/countries` | Нет, но **hero** всегда pexels если не mock | ⚠️ | В api‑режиме hero берётся не из API, а из pexels (внешняя зависимость) | **pexels** по умолчанию |
| `/atlas/countries/[id]` (overview page) | `useGetCountryById` + **fallback на mockRepo** | `GET /v1/content/countries` | **Да** (`countryData ?? mockRepo...`) | ⚠️ | В prod возможна подмена данных страны на mock | зависит от mock/API |
| `/atlas/countries/[id]/cities` | `useGetCities(countryId)` + fallback | `GET /v1/content/cities?countryId=...` | **Да** (при пустом API → mock listCities filter) | ⚠️ | В prod возможна подмена на mock | — |
| `/atlas/countries/[id]/places` | `useGetPlaces(limit=50)` + fallback | `GET /v1/content/places?limit=50` | **Да** (при пустом API → mock listPlaces) | ⚠️ | В api‑режиме нет фильтра по стране → возможны нерелевантные данные; есть fallback на mock | фото из API или mock |
| `/atlas/countries/[id]/gallery` | статическая заглушка | нет | нет | 🧱 | Нет API/данных | серые блоки |
| `/atlas/countries/[id]/map` | статическая заглушка | нет | нет | 🧱 | Нет API/карты | серый блок |
| `/atlas/countries/[id]/weather` | статическая демо‑инфа | нет | нет | 🧱 | Демо‑контент, не из API | — |
| `/atlas/countries/[id]/history` | статическая демо‑инфа | нет | нет | 🧱 | Демо‑контент, не из API | — |
| `/atlas/countries/[id]/geography` | статическая демо‑инфа | нет | нет | 🧱 | Демо‑контент, не из API | — |
| `/atlas/countries/[id]/culture` | статическая демо‑инфа | нет | нет | 🧱 | Демо‑контент, не из API | — |
| `/atlas/countries/[id]/living` | статическая демо‑инфа | нет | нет | 🧱 | Демо‑контент, не из API | — |
| `/atlas/countries/[id]/visas` | статическая демо‑инфа | нет | нет | 🧱 | Демо‑контент, не из API | — |
| `/atlas/countries/[id]/business` | статическая демо‑инфа | нет | нет | 🧱 | Демо‑контент, не из API | — |
| `/atlas/countries/[id]/phrasebook` | статическая демо‑инфа | нет | нет | 🧱 | Демо‑контент, не из API | — |
| `/atlas/countries/[id]/reviews` | статическая демо‑инфа | нет | нет | 🧱 | Демо‑контент, не из API | — |
| `/atlas/countries/[id]/calculator` | статическая/демо | нет | нет | 🧱 | Демо‑контент, не из API | — |

### Города (деталка)
| URL | Источник данных (UI) | Реальные API вызовы | Mock/Fallback в api | Статус | Проблема | Изображения |
|---|---|---|---|---|---|---|
| `/atlas/cities/[id]` (layout) | `useGetCityById` + pexels fallback | `GET /v1/content/cities` | Нет, но hero по умолчанию pexels | ⚠️ | Внешний hero по умолчанию | **pexels** по умолчанию |
| `/atlas/cities/[id]` (overview page) | `useGetCityById` + fallback | `GET /v1/content/cities` | **Да** (в api‑режиме подмешивает mockCity) | ❌ | **runtime crash**: `latitude.toFixed` при `latitude: string` | — |
| `/atlas/cities/[id]/districts` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/cities/[id]/accommodation` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/cities/[id]/food` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/cities/[id]/places` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/cities/[id]/transport` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/cities/[id]/weather` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/cities/[id]/shopping` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/cities/[id]/nightlife` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/cities/[id]/guides` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/cities/[id]/tips` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/cities/[id]/reviews` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/cities/[id]/budget` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |

### Места (деталка)
| URL | Источник данных (UI) | Реальные API вызовы | Mock/Fallback в api | Статус | Проблема | Изображения |
|---|---|---|---|---|---|---|
| `/atlas/places/[id]` (layout) | `useGetPlaceById` + pexels fallback | `GET /v1/content/places/{idOrSlug}` | Нет, но hero pexels если нет фото | ⚠️ | Внешний hero по умолчанию; tags/rating доступны только в mock | фото из API или **pexels** |
| `/atlas/places/[id]` (overview page) | `useGetPlaceById` + **fallback на mockPlace всегда** | `GET /v1/content/places/{idOrSlug}` | **Да** (`placeData ?? mockPlace`) | ⚠️ | В prod возможна подмена на mock при ошибке API | — |
| `/atlas/places/[id]/gallery` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/places/[id]/map` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/places/[id]/history` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/places/[id]/nearby-places` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/places/[id]/nearby-services` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/places/[id]/guides` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/places/[id]/tips` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/places/[id]/reviews` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/places/[id]/partners` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |

### Гайды (деталка)
| URL | Источник данных (UI) | Реальные API вызовы | Mock/Fallback в api | Статус | Проблема | Изображения |
|---|---|---|---|---|---|---|
| `/atlas/guides/[id]` (layout) | `useGetArticleBySlug` | `GET /v1/content/articles/{slug}` | Нет (mock только в mock‑режиме) | ⚠️ | hero fallback = pexels если нет `coverImage` | coverImage или **pexels** |
| `/atlas/guides/[id]` (overview page) | `useGetArticleBySlug` + fallback‑баннер | `GET /v1/content/articles/{slug}` | **Да** (в page есть fallback‑путь на mock) | ⚠️ | В prod возможна подмена на mock + “DEMO MODE / fallback” | — |
| `/atlas/guides/[id]/route` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/guides/[id]/map` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/guides/[id]/places` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/guides/[id]/tips` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/guides/[id]/events` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/guides/[id]/reviews` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |
| `/atlas/guides/[id]/versions` | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушка | — |

### Темы (деталка)
| URL | Источник данных (UI) | Реальные API вызовы | Mock/Fallback в api | Статус | Проблема | Изображения |
|---|---|---|---|---|---|---|
| `/atlas/themes/[id]` (layout) | `fetch .../v1/api/content/themes/{id}` + **fallbackMockTheme** | пытается дернуть `/v1/api/content/themes/{id}` | **Да (всегда)** | ⚠️ | Темы отсутствуют в OpenAPI/SDK → страница фактически держится на mock | heroImage из mock |
| `/atlas/themes/[id]/*` (`countries/guides/places/tips/events/reviews/versions`) | `EmptyStateAtlas` | нет | нет | 🧱 | Заглушки | — |

### Инструменты
| URL | Источник данных (UI) | Реальные API вызовы | Mock/Fallback в api | Статус | Проблема | Изображения |
|---|---|---|---|---|---|---|
| `/atlas/tools/checklists/[slug]` | статическая страница/скэффолд | нет | нет | 🧱 | Нет реальных данных/контракта | — |
| `/atlas/tools/calculators/visa` | статическая страница/скэффолд | нет | нет | 🧱 | Нет реальных данных/контракта | — |
| `/atlas/tools/calculators/cost-of-living` | статическая страница/скэффолд | нет | нет | 🧱 | Нет реальных данных/контракта | — |


