# Atlas Places Pipeline

Цель: наполнять раздел "Места" через SSOT: **Neon → content-service → SDK → UI**.

## Архитектура

**Источник истины:** Neon (Postgres) таблица `places`  
**API:** `content-service` (`/v1/content/places`)  
**SDK:** `@go2asia/sdk` (`listPlaces`, `useGetPlaces`)  
**UI:** `go2asia-pwa-shell` (`/atlas/places`, `/atlas/cities/{id}/places`)

## Шаг 1 — Схема Neon

Минимальные поля для карточек в `places`:
- `place_kind` (`showplace|business`) — обязательное
- `category` (text) — категория места
- `tags` (jsonb) — массив тегов
- `address` (text) — адрес
- `website`, `phone`, `instagram`, `google_maps_url` (text) — контакты
- `price_level` (text) — уровень цен
- `hero_media_id` / `images` (jsonb) — медиа

Миграция: `packages/db/migrations/0004_place_kind_fields.sql`.

**Применение миграции:**
```bash
pnpm -C packages/db db:ddl:apply:staging
```

## Шаг 2 — Ingest/Seed (Philippines)

Скрипт: `packages/db/src/seedAtlasPlacesPhilippines.ts`.

**Команда:**
```bash
pnpm -C packages/db db:seed:atlas-places-ph
```

**Особенности:**
- Читает `content/atlas/philippines/Philippines-places.md`
- Резолвит `country_id` по `id='ph'` или `slug='ph'`
- Резолвит `city_id` по `(id OR slug OR name ILIKE)` в пределах `country_id='ph'`
- Маппинг городов: `Манила → mnl`, `Себу → ceb`, `Палаван → pps`, `Бохоль → tag`, `Сиаргао → srg`
- UPSERT по `places.slug` (idempotent)
- Если `city_id` не найден — логирует предупреждение и пропускает блок города
- Извлекает из markdown: координаты, адрес, описание, теги, контакты, цены

**Формат markdown:**
```markdown
# Город

## Достопримечательности / Коммерческие заведения

Название места – lat, lng – описание
• Тег 1
• Тег 2
• ⏰ Часы работы: ...
• 💰 Уровень цен: ...
• 📱 Instagram: @handle
• 🌐 Google Maps: https://...
```

## Шаг 3 — Масштабирование на другие страны

**Для добавления новой страны (например, Камбоджа):**

1. **Создать markdown файл:**
   ```
   content/atlas/cambodia/cambodia-places.md
   ```

2. **Создать seed-скрипт** (скопировать `seedAtlasPlacesPhilippines.ts` или `seedAtlasPlacesCambodia.ts`):
   ```typescript
   // packages/db/src/seedAtlasPlacesCambodia.ts
   // Изменить:
   // - countryId: 'kh'
   // - cityRefMap для камбоджийских городов
   // - путь к markdown файлу
   // - парсер под формат markdown файла
   ```

3. **Добавить команду в `packages/db/package.json`:**
   ```json
   "db:seed:atlas-places-kh": "tsx src/seedAtlasPlacesCambodia.ts"
   ```

4. **Запустить seed:**
   ```bash
   pnpm -C packages/db db:seed:atlas-places-kh
   ```

**Примечание:** Формат markdown может отличаться между странами. Камбоджа использует формат с эмодзи-секциями (`### 🟡 Почему стоит посетить`), в то время как Филиппины используют bullet points (`•`). Seed-скрипт должен быть адаптирован под конкретный формат.

**Универсальность схемы:**
- Схема `places` подходит для любых стран (PH/VN/TH/KH/...)
- Фильтры API работают для всех стран: `countryId`, `cityId`, `kind`
- UI автоматически подтягивает данные через SDK

## Шаг 4 — API + SDK

**API endpoints:**
- `GET /v1/content/places?countryId=ph&kind=showplace`
- `GET /v1/content/places?cityId=mnl&kind=business`
- `GET /v1/content/places/{idOrSlug}`

**SDK методы:**
- `listPlaces({ countryId?, cityId?, kind?, limit? })`
- `useGetPlaces({ countryId?, cityId?, kind?, limit?, enabled? })`
- `getPlaceById(idOrSlug)`
- `useGetPlaceById(idOrSlug)`

**DTO (`ContentPlaceDto`):**
```typescript
{
  id, slug, name, kind, category, tags,
  website, phone, instagram, googleMapsUrl, priceLevel,
  countryId, cityId, country, city, address,
  latitude, longitude, heroImage, photos
}
```

## Шаг 5 — UI

**Компоненты:**
- `PlaceLandingLayoutShowplace` — детальная карточка достопримечательности
- `PlaceLandingLayoutBusiness` — детальная карточка коммерческого заведения
- `PlacePreviewCard` — компактная карточка для списков

**Страницы:**
- `/atlas/places` — список всех мест с фильтром по `kind`
- `/atlas/cities/{id}/places` — список мест города с фильтром по `kind`
- `/atlas/places/{slug}` — детальная страница места

**Правила:**
- ✅ Данные только из API (через SDK)
- ❌ Нет чтения markdown из репозитория в runtime
- ❌ Нет моков/fallback в production

## Шаг 6 — Cleanup демо-данных

**После успешного seed реальных данных:**

Скрипт: `packages/db/src/cleanupDemoPlaces.ts`

**Команда:**
```bash
pnpm -C packages/db db:cleanup:demo-places
```

**Безопасность:**
- Удаляет только места с паттернами: `Bangkok Place*`, `Chiang Mai Place*`, `Test Place*`, `Demo Place*`
- Не удаляет реальные записи PH/VN/TH
- Логирует все удаления
- Отказывается работать в production

**Когда запускать:**
- Только после успешного seed реальных данных для страны
- Только в staging/dev окружении
- После проверки через API/UI

## Шаг 7 — Smoke/QA

**Скрипт:**
```bash
scripts/smoke-atlas-places.sh
```

**Проверяет:**
- `/v1/content/places?countryId=ph&kind=showplace` — не пустой ответ
- `/v1/content/places?countryId=ph&kind=business` — не пустой ответ
- `/v1/content/places?cityId=mnl` — не пустой ответ
- `/v1/content/places/{slug}` — успешный ответ для конкретного места
- `/v1/content/places/{slug}/tabs?lang=ru&tabKey=overview` — возвращает content_blocks markdown

**Ручная проверка UI:**
- `/atlas/places` — отображаются карточки из Neon
- `/atlas/cities/mnl/places` — отображаются места Манилы
- `/atlas/places/{slug}` — детальная страница загружается без ошибок, секции рендерятся из content_blocks

## Шаг 8 — Place Content Blocks (Tabs)

**Структура контента:**
- `description_short` в `places` — короткий тизер (2-3 предложения)
- `content_blocks` (entity_type='place', tab_key='overview', lang='ru') — структурированный markdown с секциями

**Формат markdown в content_blocks:**
```markdown
## Почему это важно?
Контент секции...

## Билеты и посещение
Контент секции...
```

**API endpoint:**
- `GET /v1/content/places/{idOrSlug}/tabs?lang=ru&tabKey=overview`

**SDK методы:**
- `listPlaceTabs(idOrSlug, { lang?, tabKey? })`
- `useGetPlaceTabs(idOrSlug, { lang?, tabKey?, enabled? })`

**UI рендеринг:**
- Компоненты `PlaceLandingLayoutBusiness` и `PlaceLandingLayoutShowplace` парсят markdown и рендерят секции как отдельные карточки
- Используется `react-markdown + remark-gfm` (без rehypeRaw)
- Если секция отсутствует — показывается `EmptyState` (не вымышленный текст)

---

## Milestone: Atlas PH Content → Neon Ready ✅

**Статус:** Завершено (2026-01-21)

**Что сделано:**
- ✅ Схема `places` расширена (`place_kind`, `category`, `tags`, контакты)
- ✅ Seed-скрипт для Philippines (`seedAtlasPlacesPhilippines.ts`)
- ✅ Export-скрипт для SQL/CSV (`exportPlacesToNeon.ts`)
- ✅ API endpoints для places с фильтрами
- ✅ SDK методы и React Query hooks
- ✅ UI компоненты (PlaceLandingLayout, PlacePreviewCard)
- ✅ Content blocks для секций (markdown)
- ✅ Cleanup демо-данных
- ✅ Smoke тесты

**Документация:**
- ✅ `docs/modules/atlas/places_pipeline.md` — полный пайплайн
- ✅ `docs/modules/atlas/neon_schema_places.md` — схема БД
- ✅ `docs/modules/atlas/places_design_decisions.md` — архитектурные решения
- ✅ `docs/modules/atlas/places_media_pipeline.md` — план медиа-контента

**Готово к масштабированию:**
- Вьетнам (VN)
- Камбоджа (KH)
- Таиланд (TH)
- Другие страны Юго-Восточной Азии

**Следующие шаги:**
1. Запустить экспорт: `pnpm -C packages/db db:export:places-neon`
2. Импортировать в Neon через SQL Editor
3. Подготовить медиа-контент (`place_media_plan.csv`)
4. Повторить пайплайн для следующей страны
