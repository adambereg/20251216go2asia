# Atlas Import Pipeline Fix v1 (Places): AS-IS → TO-BE Plan

**Дата:** 2026-02-05  
**Статус:** Draft (architecture plan, без реализации)  
**Модуль:** Atlas Asia → Places/Showplaces/Businesses  
**Связанные документы (baseline):**
- `docs/audits/neon_schema_audit.md`
- `docs/audits/atlas_places_data_sources_audit.md`
- `docs/modules/atlas/atlas_card_canon_v1.md`

---

## 1) Executive summary

- **Что сейчас сломано:** в Neon у `places` отсутствуют медиа-связки (0/466 имеют `hero_media_id` и gallery в БД), поэтому UI вынужден жить на fallback (R2 listing) и не имеет “канонической” медиа-модели в данных.
- **Что уже работает:** импорт `markdown → content_blocks` работает; `content_blocks (overview/ru)` покрывают **100% places** (466/466), UI (Atlas Card Canon v1) готов и корректно рендерит то, что получает.
- **Что будет исправлено в v1:** довести пайплайн импорта Atlas так, чтобы **каждое place** после импорта имело **канонически связанное hero** (через `hero_media_id`) и предсказуемую галерею (через JSON `images` или логическую связь), плюс валидацию и устранение orphan content_blocks.
- **Что НЕ является проблемой:** UI/рендерер/канон карточек (в scope фикса пайплайна это не трогаем).
- **Что не входит в scope v1:** Pulse/Blog импорт, мультиязычность beyond `ru`, админ‑редактор, миграции схемы/новые сервисы.
- **Ключевой принцип v1:** “Данные должны догнать UI”: SSOT медиа/контента фиксируется в Neon (через `media_files` + ссылки в `places`), а не через неявные runtime‑fallback’и.

---

## 2) AS‑IS: текущий пайплайн (кратко, фактами)

### 2.1 Текущий поток данных (end‑to‑end)

`content/atlas/**/*.md`  
↓  
`packages/db/src/exportPlacesToNeon.ts`  
↓  
Neon:
- `places` (базовые поля: name/slug/kind/country_id/city_id/lat/lng/tags/description_short/…)
- `content_blocks` (`entity_type='place'`, `tab_key='overview'`, `lang='ru'`, `body_markdown`)  
↓  
`content-service` API:
- `GET /v1/content/places/:idOrSlug`
- `GET /v1/content/places/:idOrSlug/tabs?tabKey=overview&lang=ru`  
↓  
UI:
- `apps/go2asia-pwa-shell/app/(public)/atlas/places/[id]/page.tsx`
- `PlaceLandingLayouts.tsx` (Atlas Card Canon v1)

### 2.2 Факты/проблемы (baseline)

**Atlas (Neon):**
- `places`: **466**
- `content_blocks` (place/overview/ru) покрывают **100% places** (466/466)
- `orphan content_blocks` для places: **4** (entity_id существует, а строки в `places` нет)
- `0/466 places` имеют `hero_media_id` и `images` в БД (медиа‑связки не доведены)

**Проблемы пайплайна:**
- **Media из R2 не связываются с `places`:** отсутствует канонический `hero_media_id`, gallery не закреплена как данные.
- **Hero/gallery отсутствуют как данные:** UI вынужден использовать fallback, что ломает “SSOT данных”.
- **Orphan content_blocks:** нет пост‑импортной консистентности и/или отсутствует уборка “лишних” блоков.
- **Нет post‑import валидации:** импорт может “успешно” пройти даже при критических нарушениях DoD (например, hero отсутствует у всех).

---

## 3) TO‑BE: каноническая модель данных Place (v1)

Ниже описано каноническое состояние **place** после успешного импорта v1.  
Важно: **v1 не меняет схему БД** — описываем модель, используя существующие поля.

### 3.1 `places` (канонический минимум v1)

- **id** (PK, text) — SSOT идентификатор place (используется в R2 prefix и в `content_blocks.entity_id`)
- **slug** (unique) — человеко‑читаемый идентификатор
- **name** (not null)
- **place_kind** (`showplace` | `business`)
- **country_id** (FK → `countries.id`) — must
- **city_id** (FK → `cities.id`) — must
- **lat/lng** (numeric) — must (временно допускается legacy `latitude/longitude`, но DoD v1 требует координаты как “эффективно присутствуют”)
- **tags** (jsonb array) — should (для категорий/фасетов)
- **description_short** — should
- **hero_media_id** (FK → `media_files.id`) — **must (v1)**
- **images** (jsonb array публичных URL) — **should** (v1, как “галерея” без новой таблицы)
- **created_at / updated_at** — must

### 3.2 `content_blocks` (контент)

- **entity_type** = `'place'`
- **entity_id** = `places.id`
- **tab_key** = `'overview'` (v1 обязательно)
- **lang** = `'ru'` (v1)
- **body_markdown** (not null) — должен содержать весь нужный обзорный контент place

### 3.3 `media_files` (метаданные R2)

- **id** (text) — стабильный ID медиа‑объекта
- **provider/bucket/key** — SSOT на физический объект в R2
- **public_url** — must
- **mime_type** — should
- **size** — should (в реальности сейчас 0; v1 фиксит пайплайн заполнения)
- **width/height** — optional

### 3.4 Связь place ↔ media (v1 без новой таблицы)

В v1 **не добавляем** `place_media` таблицу. Связь фиксируем так:

- **hero**: `places.hero_media_id` → `media_files.id`
- **gallery**: `places.images` содержит упорядоченный список `public_url` (или “top N” для карточки), который соответствует объектам в `media_files` (идеально) или хотя бы является детерминированным срезом из R2.

> Примечание: в v1 допускается, что UI всё ещё умеет fallback в R2, но **каноническое состояние** должно позволять UI вообще не прибегать к fallback для hero.

---

## 4) TO‑BE: пайплайн импорта Atlas (v1)

Ниже — пошаговый To‑Be пайплайн. Это **алгоритм**, не код.

### Шаг 1. Parse markdown

Источник: `content/atlas/**/*.md`

Извлечь:
- **place base fields**: name/slug/kind/country/city/coords/tags/short description + любые дополнительные (website/phone/… если есть)
- **overview sections** → собрать `body_markdown` для `content_blocks(tab_key='overview', lang='ru')`
- **media manifest** (если есть): явные ссылки/названия файлов/порядок (hero, gallery)
  - если явного манифеста нет, используем **детерминированные правила** выбора из R2 (см. шаг 2)

### Шаг 2. Resolve media

Цель: определить **hero** и **gallery** для каждого place.

Определить:
- **Hero image**:
  - приоритет: `hero.jpg` (если принят конвенцией) → иначе `01.jpg`
- **Gallery images**:
  - `01..NN.jpg` (детерминированный порядок) или явный список из markdown/manifest

Проверить:
- наличие файлов в R2 (по ожидаемому prefix: `place/{place_id}/…`)
- если чего‑то не хватает:
  - v1 стратегия: либо **fail fast** (если hero отсутствует), либо **degrade** (если часть галереи отсутствует) — фиксируется в DoD/risks.

Создать/обновить `media_files`:
- upsert по `(provider, bucket, key)` (уникально)
- гарантировать корректные: `public_url`, `mime_type`, `size`, `width/height` (если доступны)

### Шаг 3. Persist place (upsert)

Upsert `places`:
- записать базовые поля
- **гарантировать `hero_media_id`** (обязательное условие v1)
- записать `images` (gallery URLs) в детерминированном порядке

### Шаг 4. Persist content_blocks (upsert)

Upsert `content_blocks`:
- `entity_type='place'`, `entity_id=places.id`, `tab_key='overview'`, `lang='ru'`
- `body_markdown` обязателен

Orphan cleanup (опционально в v1, но рекомендовано):
- удалить `content_blocks(entity_type='place')`, где `entity_id` не существует в `places`
- (аналогично для city/country при наличии правил)

### Шаг 5. Post‑import validation (fail‑fast)

После импорта выполнить валидацию:
- собрать метрики (в духе `03_data_health_atlas.sql`)
- если нарушены **критичные** условия (см. DoD) — импорт считается неуспешным
- сохранить отчёт/лог (для CI/ручного прогона)

---

## 5) Definition of Done (DoD) — v1

Чеклист (строгий, измеримый):

- **Places coverage**
  - [ ] 100% `places` имеют `content_blocks(entity_type='place', tab_key='overview', lang='ru')`
  - [ ] `orphan content_blocks` для places = **0**
  - [ ] Повторный импорт идемпотентен: нет новых дублей по `places.slug`/`places.id`, `media_files(provider,bucket,key)`

- **Hero & gallery**
  - [ ] 100% `places.hero_media_id IS NOT NULL`
  - [ ] 100% `places.hero_media_id` ссылается на существующий `media_files.id`
  - [ ] 100% `places` имеют минимум 1 изображение (hero) как данные (не fallback)
  - [ ] `places.images` (если используется) содержит детерминированный порядок (позиции стабильны при повторном импорте)

- **Media metadata quality**
  - [ ] `media_files.public_url` заполнен для 100% записей
  - [ ] `media_files.size > 0` для 100% записей (или документированное исключение)

- **UI contract (без изменения UI)**
  - [ ] UI карточек способен рендерить hero из `hero_media_id` без обращения к R2 listing
  - [ ] Fallback остаётся как safety‑net, но не является основным источником hero

---

## 6) Scope / Out of scope

### In scope v1

- Atlas places (showplace + business)
- Связка контента: markdown → `content_blocks` (overview/ru)
- Связка медиа: R2 → `media_files` → `places.hero_media_id` (+ `places.images`)
- Post‑import validation + отчётность
- Очистка orphan content_blocks (place) — рекомендовано

### Out of scope v1

- Pulse events (coords/media) — отдельно (см. Next steps)
- Blog articles pipeline (контент/медиа)
- Мультиязычность beyond `ru`
- Админ‑редактор/модерация
- Новый media‑service / новые схемы / миграции БД

---

## 7) Risks & mitigations

- **Неполные медиа в R2** (hero отсутствует / часть галереи отсутствует)
  - **Mitigation:** fail fast на hero; degrade (warning) на галерею; отчёт по missing keys
- **Несоответствие markdown шаблону/заголовкам секций**
  - **Mitigation:** fail fast при невозможности построить overview; lint/валидатор markdown до импорта
- **Большие объёмы данных**
  - **Mitigation:** батчи, rate limits, прогресс‑лог, инкрементальные прогоны по стране/городу
- **Orphan content_blocks и дрейф данных**
  - **Mitigation:** обязательная пост‑валидация + опциональная очистка orphan
- **Метаданные `media_files.size` недоступны/не корректны**
  - **Mitigation:** если размер нельзя получить — фиксировать как warning и оставить DoD как “>=0” временно (но это должно быть явно задокументировано)

---

## 8) Next steps (после v1)

- **v1.1:** Pulse events: заполнить coords + media (аналогичный импортный пайплайн для `events`)
- **v1.2:** Стандартизировать медиа‑manifest (явно в markdown или отдельный manifest.json) для детерминированных галерей
- **v2:** мультиязычность `content_blocks` (lang расширение + coverage/валидация)
- **v3:** editor/moderation workflow, контроль качества контента и медиа

---

## Appendix: Baseline metrics (из аудита)

- Atlas:
  - places.total = 466
  - places_with_overview_ru_existing = 466
  - place_overview_ru_orphan_entity_ids = 4
  - places.missing_hero_media_id = 466
  - places.missing_images = 466
- Pulse:
  - events.total = 10
  - events.missing_coords = 10
  - events.missing_media_both = 10
- Blog:
  - articles.total = 16 (published_total = 16)

