# Atlas Import Pipeline Fix v1 — Implementation Tasks (Backlog)

**Дата:** 2026-02-05  
**Цель:** превратить контракт `docs/architecture/atlas_import_pipeline_fix_v1.md` в исполнимый backlog задач (без реализации кода).  
**Связанный контракт (НЕ менять в этой фазе):** `docs/architecture/atlas_import_pipeline_fix_v1.md`

---

## 1) Overview

### Цель implementation‑фазы

Довести import‑пайплайн Atlas (v1) до состояния, когда данные в Neon соответствуют канонической модели Place:
- `places.hero_media_id` заполняется для 100% places
- `content_blocks(place, overview/ru)` покрывает 100% places
- orphan content_blocks для places = 0
- импорт идемпотентен, повторный прогон не создаёт дублей

### Что НЕ делаем

- ❌ миграции/изменения схемы БД
- ❌ новые таблицы (включая `place_media`)
- ❌ изменения UI и Atlas Card Canon v1
- ❌ Pulse/Blog/Rielt (кроме заготовок “после v1”)

---

## 2) Task breakdown

Ниже задачи сгруппированы по этапам пайплайна (A–F) в соответствии с контрактом:
**parse → resolve media → persist place → persist content_blocks → post‑import validation → idempotency/reruns**

Формат каждого таска: **Task ID / Название / Описание / Вход / Выход / Где / DoD / Failure modes**.

---

## A) Markdown parsing

### Task A0 — Lock canonical import entrypoint (export vs seed scripts) to avoid divergence

**Описание**  
В репозитории сейчас есть два механизма “занести Atlas places в Neon”:
- **экспорт** артефактов (`packages/db/src/exportPlacesToNeon.ts` → `exports/neon/**`) с ручным/CI‑применением в Neon
- **прямой seed** в БД (`packages/db/src/seedAtlasPlaces*.ts`)

Для v1 (по контракту `atlas_import_pipeline_fix_v1.md`) **каноническим считается export‑пайплайн**. Этот таск фиксирует это явно, чтобы реализация не “разъехалась” между двумя путями.

**Входные данные**
- `packages/db/src/exportPlacesToNeon.ts`
- `packages/db/src/seedAtlasPlacesCambodia.ts`
- `packages/db/src/seedAtlasPlacesPhilippines.ts`
- существующие инструкции импорта: `exports/neon/**/IMPORT_INSTRUCTIONS.md`

**Выходные данные**
- явное правило:
  - v1 реализуется в `exportPlacesToNeon.ts` (+ артефакты в `exports/neon/**`)
  - `seedAtlasPlaces*.ts` либо:
    - переводятся на переиспользование тех же helper’ов (в отдельной реализации после v1), либо
    - помечаются как legacy/dev‑only и **не используются** для production‑данных Atlas

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts` (как главный entrypoint)
- `packages/db/src/seedAtlasPlaces*.ts` (только маркировка/документация; без переписывания логики в этой фазе)
- `exports/neon/**/IMPORT_INSTRUCTIONS.md` (если нужно уточнить “что является источником истины”)

**DoD**
- у команды нет неопределённости “какой скрипт запускать, чтобы получить v1 DoD”
- один и только один путь объявлен каноническим для v1

**Failure modes**
- параллельные правки в export и seed → разные правила id/slug/sections → orphan blocks и непредсказуемые данные

---

### Task A1 — Inventory of markdown sources & deterministic place identity rules

**Описание**  
Зафиксировать “какие файлы читаем” и “как из markdown получается place identity”, чтобы импорт был детерминированным и идемпотентным.

**Входные данные**
- `content/atlas/**/*.md`
- текущие правила `exportPlacesToNeon.ts` (slugify, city id mapping, generatePlaceId)

**Выходные данные**
- формализованные правила:
  - какие файлы являются источниками places
  - как строится `places.id` и `places.slug` (детерминированно)
  - какие поля считаются обязательными на этапе parse

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts` (док‑комментарии/константы/валидатор входов)
- (опционально) `docs/content/atlas_content_rules.md` (если уже используется как контракт контента)

**DoD**
- правила place identity не зависят от порядка чтения файлов
- 100% places из markdown получают стабильный `id` и `slug` при повторном прогоне

**Failure modes**
- разные правила id/slug в разных скриптах → “дрейф” данных, orphan blocks
- разные city mapping → разные id для одного и того же места

---

### Task A2 — Parse базовых полей place (строгое покрытие)

**Описание**  
Убедиться, что парсер извлекает минимально необходимый набор полей Place (v1) из markdown (name/kind/country/city/coords/tags/description_short).

**Входные данные**
- `content/atlas/**/*.md`
- секции place (заголовок `##`, координаты, метаданные)

**Выходные данные**
- структурированный `ParsedPlace` с заполненными base fields

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts`
  - `parsePlaceMarkdown()` / вспомогательные функции

**DoD**
- 100% parsed places имеют: `name`, `placeKind`, `countryCode/countryId`, `cityName`, `coords`, `tags`
- ошибки/пропуски отражаются в summary/issue report (без “тихого” скипа)

**Failure modes**
- не распарсились координаты → place попадёт без coords (нарушение DoD v1)
- не распарсился kind → неверный `place_kind` (showplace vs business)

---

### Task A3 — Build overview body_markdown (content_blocks) из всех секций без потерь

**Описание**  
Гарантировать, что overview собирается из всех секций markdown (включая “неизвестные”), и не теряет смысловые блоки.

**Входные данные**
- секции markdown (### …) внутри place

**Выходные данные**
- `overviewMarkdown` (строка), предназначенная для `content_blocks.body_markdown`

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts`
  - `generateContentBlocksSQL()` / сборщик overview

**DoD**
- 100% places → `content_blocks(tab_key='overview', lang='ru')` непустой
- нет “потерь секций” из‑за неполного маппинга (см. ранее выявленную проблему с showplace секциями)
- итог детерминированен: одинаковый markdown при повторном прогоне

**Failure modes**
- новая секция в контенте не распознана и “пропадает” → карточка показывает не весь контент
- разные заголовки/эмодзи → парсер считает секцию “unknown” и игнорирует (нельзя)

---

### Task A4 — Parse media references / manifest from markdown (если присутствует)

**Описание**  
Расширить parse‑результат мест так, чтобы он мог передавать “намерение” по медиа: hero и упорядоченную галерею (если эти указания присутствуют в markdown).

**Входные данные**
- `content/atlas/**/*.md`
- (возможные) явные упоминания медиа: ссылки, “Hero: …”, “Gallery: …”, или соглашения контента

**Выходные данные**
- `mediaRefs`:
  - `heroRef?: { key|filename|url }`
  - `galleryRefs: Array<{ key|filename|url, position }>`

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts`
  - `parsePlaceMarkdown()` (добавление структуры)

**DoD**
- формат `mediaRefs` стабилен и пригоден для resolve‑этапа
- если явных refs нет — `mediaRefs` пуст, но import продолжает работу (resolve будет по R2‑конвенции)

**Failure modes**
- heroRef неверный/невалидный → resolve media не сможет найти объект (должно быть обнаружено на этапе validation)

---

## B) Media resolution

### Task B1 — Define deterministic R2 media resolution rules (hero + gallery)

**Описание**  
Зафиксировать детерминированные правила выбора медиа из R2, если в markdown нет манифеста.

**Входные данные**
- `placeId` (канонический)
- R2 key prefix convention: `place/{place_id}/…`

**Выходные данные**
- правило:
  - hero: `hero.jpg` если есть → иначе `01.jpg`
  - gallery: `01..NN.jpg` (упорядочено), **до `MAX_GALLERY_IMAGES_V1 = 24`**
  - **важное правило v1:** `places.images` хранит **только gallery** (без hero), чтобы исключить дубли в UI

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts` (константы/алгоритм)
- (опционально) `docs/content/atlas_content_rules.md` (как контент‑конвенция)

**DoD**
- одинаковый вход → одинаковый список ключей hero/gallery
- правила не зависят от окружения/порядка листинга R2

**Failure modes**
- R2 listing не гарантирует порядок → нужно явное сортирование/фильтрация

---

### Task B2 — R2 presence check (hero mandatory, gallery best‑effort)

**Описание**  
Проверить наличие ожидаемых файлов в R2. Hero является критическим, галерея — деградируемая.

**Входные данные**
- resolved expected keys (Task B1) или mediaRefs (Task A4)
- доступ к R2 listing / head‑проверке

**Выходные данные**
- `resolvedMedia`:
  - `hero: { key, publicUrl }` (обязательно)
  - `gallery: Array<{ key, publicUrl, position }>` (0+)
- список missing keys (для отчёта)

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts` или отдельный helper в `packages/db/src/`
- (допустимо) reuse существующих правил/кодовых конвенций из `content-service` только концептуально; реализация — в импортере

**DoD**
- 100% places имеют найденный hero (иначе импорт фейлится)
- missing gallery не фейлит импорт, но фиксируется как warning + в отчёте

**Failure modes**
- hero missing → fail fast (импорт остановлен с отчётом)
- R2 недоступен/таймаут → импорт фейлится с понятной причиной

---

### Task B3 — Upsert `media_files` (dedup, metadata completeness)

**Описание**  
Создать/обновить записи `media_files` для hero и gallery: уникальность по `(provider,bucket,key)`, корректный `public_url`, попытка заполнить `size/mime/width/height`.

**Входные данные**
- resolvedMedia (hero+gallery)

**Выходные данные**
- `media_files` записи (idempotent upsert)
- `heroMediaId` (FK target)

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts` (генерация SQL/CSV для `media_files`) или отдельный export‑скрипт в `packages/db/src/`
- (в рамках v1 без миграций) использовать существующую таблицу `media_files`

**DoD**
- 100% используемых ключей имеют запись в `media_files` с `public_url`
- dedup работает: повторный импорт не создаёт новые записи
- `size` не нулевой (или документированное исключение) — отдельная метрика

**Failure modes**
- конфликт уникальности provider/bucket/key → должен разрешаться как update
- size/mime неизвестны → warning, но в DoD это должно быть явно определено (критично или нет)

---

### Task B4 — Populate media metadata (`size`, `mime_type`, dimensions) from R2/HTTP

**Описание**  
Контракт v1 требует качества `media_files`: `public_url` заполнен и `size > 0`. Этот таск описывает, как получать метаданные **без загрузки файлов**: через R2 object metadata (preferred) или HTTP HEAD/GET‑range.

**Входные данные**
- `provider/bucket/key` для каждого media object (Task B2)
- доступ к R2 API (S3‑compatible) или публичному URL (HEAD)

**Выходные данные**
- заполненные поля `media_files`:
  - `mime_type` (как минимум по Content‑Type/расширению)
  - `size` (Content‑Length / R2 size)
  - `width/height` (опционально; если доступно без полного скачивания)

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts` или helper в `packages/db/src/` (например, “mediaMetadataResolver”)

**DoD**
- для 100% `media_files` используемых places: `size > 0`
- если `width/height` недоступны — это не блокер v1, но отражается в отчёте

**Failure modes**
- публичный URL не отдаёт Content‑Length → требуется fallback на R2 metadata
- rate limits/timeout → импорт фейлится или деградирует согласно зафиксированным правилам (должно быть явно в отчёте)

---

## C) Place persistence

### Task C1 — Upsert `places` с обязательным `hero_media_id`

**Описание**  
Довести upsert `places` так, чтобы `hero_media_id` всегда устанавливался на resolved hero media file.

**Входные данные**
- ParsedPlace (Task A2)
- heroMediaId (Task B3)

**Выходные данные**
- `places` row (upsert) с `hero_media_id IS NOT NULL`

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts` (генерация `places.sql` / csv)

**DoD**
- 100% places после импорта имеют `hero_media_id`
- `hero_media_id` валиден (FK на существующий `media_files.id`)
- импорт идемпотентен: повторный прогон не меняет id/slug

**Failure modes**
- heroMediaId отсутствует → fail fast (нарушение DoD v1)
- FK нарушен (медиа не создано) → fail validation

---

### Task C2 — Persist gallery links в `places.images` (без новой таблицы)

**Описание**  
Сохранить **только галерею** как данные через `places.images` (jsonb array public URLs) в детерминированном порядке.
Hero хранится отдельно через `places.hero_media_id` и **не дублируется** в `places.images`.

**Входные данные**
- resolved gallery (Task B2/B3)

**Выходные данные**
- `places.images` содержит 0..N gallery URL’ов (N ≤ 24 по `MAX_GALLERY_IMAGES_V1`)

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts`

**DoD**
- `images` стабилен при повторном импорте
- `images` не содержит hero URL (не дублирует hero)
- `images` не содержит дублей одного и того же `public_url`

**Failure modes**
- разные порядок/сортировка → дергание данных на каждом прогоне
- слишком много фото → лимит/батч (фиксируется в performance)

---

### Task C3 — Stale media link cleanup policy (без удаления данных)

**Описание**  
Определить, как вести себя при повторном импорте, если набор gallery‑файлов в R2 изменился: обновлять `images` полностью или только дополнять.

**Входные данные**
- текущий `places.images` + новый resolved gallery

**Выходные данные**
- чёткое правило обновления (replace vs merge), применимое идемпотентно

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts` (алгоритм формирования итогового списка)
- документирование в `docs/architecture/atlas_import_pipeline_fix_v1_tasks.md` (этот документ)

**DoD**
- правило не создаёт дублей
- повторный импорт даёт одинаковый результат при неизменном R2

**Failure modes**
- merge приводит к “разрастанию” галереи без верхней границы

---

## D) Content blocks persistence

### Task D1 — Upsert `content_blocks` (place/overview/ru) как обязательный шаг

**Описание**  
Гарантировать upsert overview‑блока для каждого place.

**Входные данные**
- `placeId`
- `overviewMarkdown` (Task A3)

**Выходные данные**
- `content_blocks` row для `(entity_type='place', entity_id=placeId, tab_key='overview', lang='ru')`

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts` (`generateContentBlocksSQL`)

**DoD**
- 100% places имеют overview/ru
- пустые body_markdown запрещены

**Failure modes**
- overview пустой → fail fast

---

### Task D2 — Orphan content_blocks cleanup (place) (рекомендуемая часть v1)

**Описание**  
Удалить orphan content_blocks для places (baseline: 4), чтобы привести БД к консистентности.

**Входные данные**
- `content_blocks` и `places` в Neon

**Выходные данные**
- orphan = 0 после импорта (или отдельного cleanup шага)

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts` (генерация дополнительного “cleanup SQL” в `places.sql`)
- или отдельный SQL‑артефакт внутри экспортируемого набора (но без миграций)

**DoD**
- `place_overview_ru_orphan_entity_ids = 0` после прогона

**Failure modes**
- агрессивная очистка удаляет “нужные” блоки из‑за неверного placeId → обязательна dry‑run статистика перед удалением

---

## E) Post‑import validation

### Task E1 — Validation queries pack (DoD checks) + fail‑fast rules

**Описание**  
Собрать набор проверок (аналог `03_data_health_atlas.sql`), который однозначно определяет pass/fail по DoD v1.

**Входные данные**
- Neon DB после импорта

**Выходные данные**
- validation summary (таблица метрик)
- статус: PASS/FAIL по критичным условиям

**Где реализуется**
- `scripts/audit/neon/03_data_health_atlas.sql` (как основа метрик)
- отдельный “import validation runner” (логически; место в репо фиксируется заранее, без реализации в этой задаче)

**DoD**
- есть явные критичные условия:
  - 100% hero_media_id
  - 100% overview/ru
  - orphan blocks = 0
  - idempotency checks
- при FAIL понятная причина (какая метрика нарушена)

**Failure modes**
- validation не ловит регресс (например, hero_media_id всё ещё NULL) → DoD не защищён

---

### Task E2 — Import summary report (human‑readable)

**Описание**  
После импорта формировать отчёт: totals, coverage, missing media, orphan, top distributions, список проблем.

**Входные данные**
- результаты validation (Task E1)
- issue list из parse/resolve шагов (missing keys, parse errors)

**Выходные данные**
- один summary‑артефакт (текст/markdown) для CI/ручного запуска

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts` (генерация `PARSE_REPORT.md`/`MIGRATION_REPORT.md`‑подобного файла) или отдельный репорт‑файл рядом

**DoD**
- отчёт содержит “критично/некритично”, counts, и ссылки на источники (country/city/place)

**Failure modes**
- отчёт есть, но не помогает понять “что чинить” → мало сигналов

---

## F) Idempotency & reruns

### Task F1 — Idempotent keys & conflict strategy (places, media_files, content_blocks)

**Описание**  
Зафиксировать и реализовать (в последующей фазе) конфликты через UPSERT так, чтобы повторный импорт не создавал дублей.

**Входные данные**
- уникальности схемы Neon:
  - `places.slug` unique
  - `content_blocks` unique (entity_type, entity_id, tab_key, lang)
  - `media_files` unique (provider, bucket, key)

**Выходные данные**
- правило on‑conflict/update для каждого типа сущности

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts` (генератор SQL)
- (опционально) `exports/neon/*/places.sql` формат (как ожидаемый артефакт)

**DoD**
- повторный прогон не увеличивает counts (`places`, `content_blocks`, `media_files`)
- обновления только там, где изменился источник (markdown/R2)

**Failure modes**
- конфликтные upsert меняют `id`/`slug` → ломается R2 prefix и ссылки

---

### Task F2 — Deterministic outputs (sorting, stable ordering)

**Описание**  
Гарантировать детерминированность:
- порядок gallery
- порядок генерации SQL/CSV
- стабильность публичных URL

**Входные данные**
- parsed places
- R2 listing (неупорядоченный)

**Выходные данные**
- стабильные артефакты экспорта (SQL/CSV), совпадающие при одинаковом входе

**Где реализуется**
- `packages/db/src/exportPlacesToNeon.ts`

**DoD**
- два прогона на одном и том же входе дают одинаковые outputs (diff‑stable)

**Failure modes**
- недетерминированный listing → “дрожание” данных и постоянные обновления в БД

---

## 3) Cross‑cutting concerns

### Логирование
- уровни: info/warn/error
- контекст: country/city/placeId/slug, key R2, tab_key/lang
- итог: агрегированный summary + список проблем

### Dry‑run режим
- цель: показать “что будет импортировано” и какие DoD будут нарушены, **без записи в БД**
- минимально: вывод метрик + список missing hero/gallery keys

### Performance
- батчинг по стране/городу (или N places за раз)
- лимиты на R2 listing / head‑проверки
- параллелизм с контролем (не DDOS R2/Neon)
- **ограничение v1:** `MAX_GALLERY_IMAGES_V1 = 24` (снижает число HEAD/R2 calls и размер JSONB)

### Rollback strategy (если импорт падает)
- v1 без миграций: rollback как “повторный импорт стабильного snapshot’а”
- критичные операции (cleanup orphan) делать отдельным шагом с dry‑run и подтверждаемыми метриками

---

## 4) Итоговый DoD для всей implementation‑фазы (v1)

Сводка DoD из контракта как “готовность реализации”:
- [ ] 100% `places.hero_media_id IS NOT NULL`
- [ ] 100% `places.hero_media_id` → валидный `media_files.id`
- [ ] 100% `places` имеют `content_blocks(place, overview, ru)`
- [ ] `place_overview_ru_orphan_entity_ids = 0`
- [ ] Импорт идемпотентен: повторный прогон не создаёт дублей и даёт стабильный результат
- [ ] Есть post‑import validation + summary report, FAIL при нарушении критичных условий

---

## 5) Out of scope (ещё раз, явно)

- UI (Atlas Card Canon v1 и компоненты карточек)
- Pulse / Blog / Rielt (кроме future v1.1+)
- миграции схемы и новые таблицы
- админ‑редакторы и модерация
- мультиязычность beyond `ru`

---

## 6) Как использовать этот документ для старта реализации

1. Выполнить задачи A‑блока (парсинг) → получить стабильный `ParsedPlace` + `overviewMarkdown` + `mediaRefs`.
2. Выполнить задачи B‑блока (resolve) → получить `heroMediaId` + gallery URLs + upsert `media_files`.
3. Выполнить C/D (persist) → upsert `places` с `hero_media_id` + `images`, upsert `content_blocks`.
4. Выполнить E (validation/report) → включить fail‑fast по DoD.
5. Выполнить F (reruns) → убедиться в идемпотентности и детерминизме.

