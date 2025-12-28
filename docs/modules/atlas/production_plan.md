# Atlas Asia — Production Plan (Этап 2)

Цель: довести Atlas Asia до **production‑ready**:
- **0 runtime‑ошибок**
- **данные только из реальных API в prod**
- **mock только в dev** (никаких fallback‑подмен в prod)

Основание: результаты `docs/modules/atlas/production_audit.md`.

## P0 (блокеры, без них prod запрещён)

### P0.1 Убрать mock/fallback из prod (глобально)
- **Суть:** сейчас много страниц в `api`‑режиме незаметно подмешивают `mockRepo` (и иногда показывают баннер “DEMO MODE / fallback”).
- **Требование:** в prod либо:
  - показываем данные из API
  - либо показываем управляемое состояние ошибки/пусто (guards), **но не mock**
- **Где:**
  - `apps/go2asia-pwa-shell/app/(public)/atlas/**`
  - все `*Client.tsx` и `[id]/page.tsx` где есть `... ?? mockRepo...` или “fallback to mocks”
- **Решение (архитектурно):**
  - централизовать политику в 1 месте (например, `apps/go2asia-pwa-shell/modules/atlas/utils/dataSource.ts`):
    - `isDev()`
    - `allowMocks()` → true только если `NODE_ENV !== 'production'` И `NEXT_PUBLIC_DATA_SOURCE === 'mock'`
    - `allowFallbackToMocks()` → true только в dev (опционально под флагом)
  - заменить точечные `mockRepo`‑подмешивания на `null`/`EmptyState` в prod

### P0.2 Исправить runtime crash на городах (lat/long)
- **Суть:** `ContentCityDto.latitude/longitude` — `string|null`, а UI вызывает `toFixed()` как у числа.
- **Где:** `apps/go2asia-pwa-shell/app/(public)/atlas/cities/[id]/page.tsx`
- **Решение:**
  - нормализация DTO в SDK (предпочтительно) **и/или** безопасный парсинг в UI:
    - `safeNumber(latitude)` → number | null
    - показывать координаты только если оба числа валидны
  - добавить guards: при некорректных координатах — скрывать блок, не падать

### P0.3 Привести slug/id к предсказуемой схеме (routing + API)
- **Суть:** часть запросов делает list+find (страна/город), часть бьёт по detail endpoint (place). Нужно:
  - единое правило “в URL используется `slug`” (или `id`), и одинаковая логика везде
  - отсутствие `as any` в местах фильтрации
- **Где:**
  - `packages/sdk/src/atlas.ts` (`useGetCountryById`, `useGetCityById`) сейчас делают `GET list` и `find`
  - `apps/go2asia-pwa-shell/app/(public)/atlas/countries/[id]/cities/page.tsx` и др. используют `as any`
- **Решение:**
  - если бекенд поддерживает `GET /v1/content/countries/{idOrSlug}` и `.../cities/{idOrSlug}` — перейти на них
  - иначе оставить list+find, но:
    - добавить кэширование (React Query key уже есть)
    - убрать `as any`
    - унифицировать: всегда принимать `idOrSlug`, но в UI формировать URL по одному полю (slug)

### P0.4 Themes: запрет mock‑тем в prod (либо API, либо выключить фичу)
- **Суть:** темы отсутствуют в OpenAPI/SDK; `/atlas/themes` и `/atlas/themes/[id]` держатся на mock.
- **Решение (prod):**
  - временно убрать темы из навигации / скрыть роуты / показать “в разработке” без mock‑данных
  - параллельно завести контракт в OpenAPI и реализовать backend (это уже отдельная дорожка)

### P0.5 Внешние изображения (pexels) как дефолт — заменить на внутренние (R2/локальные)
- **Суть:** сейчас pexels используются как дефолт‑hero для country/city/place/guide.
- **Решение:**
  - завести внутренний placeholder (SVG в `public/` или R2 URL через `cdn.go2asia.space`)
  - в prod: **никаких внешних “случайных” источников**

### P0.6 Корректность данных на странице “places by country”
- **Суть:** `/atlas/countries/[id]/places` в api‑режиме тянет `GET /v1/content/places?limit=50` без country‑фильтра → нерелевантные места, затем fallback на mock.
- **Решение:**
  - либо добавить поддержку countryId на API и использовать
  - либо реализовать фильтрацию через связку cityId→countryId (требует доп. данных/эндпоинтов)
  - до появления API: в prod показывать “недоступно”/пусто без fallback

## P1 (обязательно, но можно после P0)

### P1.1 Страны/страницы: заменить демо‑контент на API‑контент или скрыть
Список демо/заглушек: `gallery/map/weather/history/geography/culture/living/visas/business/phrasebook/reviews/calculator` и т.п.
- Вариант A: подключить `Content blocks` из Content Service (если есть)
- Вариант B: скрыть пункты меню/страницы в prod до появления API (лучше, чем демо‑контент)

### P1.2 Guides: фильтрация по типу (guide), корректные поля (readingTime, city/country)
- зависит от контракта `ContentArticleDto` и фильтров API

### P1.3 Atlas search / filters
- UI есть, но “по факту” не подключено к API

## P2 (можно отложить)
- карты (страна/город/место)
- “nearby” подборки
- отзывы, рейтинги, партнерки
- версии/обновления (audit trail)
- оптимизация кэша/предзагрузки

## План выполнения (Этап 3) — порядок работ

1) Создать новую ветку от `feat/phase2-m2-2-media-storage`.
2) Ввести слой нормализации DTO (SDK) + безопасные guards в UI.
3) Убрать fallback на mock в prod, оставить mock только для dev `NEXT_PUBLIC_DATA_SOURCE=mock`.
4) Убрать pexels дефолты (внутренний placeholder).
5) Исправить места, где данные некорректны (places by country) — в prod без mock.
6) Выключить Themes в prod (или подключить реальный API, если уже готов).

## Smoke / QA (Этап 4)

Добавить `scripts/smoke-atlas.sh`:
- проверка доступности ключевых URL (HTTP 200):
  - `/atlas`
  - `/atlas/countries`
  - `/atlas/countries/{known}`
  - `/atlas/cities`
  - `/atlas/cities/{known}` (не должен падать)
  - `/atlas/places`
  - `/atlas/places/{known}`
- проверка доступности ключевых API:
  - `/v1/content/countries`
  - `/v1/content/cities`
  - `/v1/content/places`

Примечание: shell‑smoke не поймает JS runtime‑ошибки в браузере, но отловит регрессы “страница не открывается” + доступность API. Для runtime‑ошибок — добавить минимальный Playwright‑smoke отдельной задачей (P1/P2), если захотим.


