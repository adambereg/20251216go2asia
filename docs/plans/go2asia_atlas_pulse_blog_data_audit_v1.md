# Go2Asia Atlas/Pulse/Blog Data Audit v1

Status: audit verdict (no correction pass)  
Date: 2026-03-24  
Scope: Atlas/Pulse/Blog data readiness vs Wave A subset

## 1. Purpose

Этот документ фиксирует **узкий, но глубокий data audit** по Atlas/Pulse/Blog foundation.

Он отвечает на вопросы:

- насколько текущая data-модель и bridge-tooling совместимы с Wave A;
- что уже годится как рабочий bridge;
- какие проблемы блокируют ближайший refresh;
- какой correction scope должен оставаться bounded.

Это **аудит/вердикт**, а не correction pass:

- без DDL/DML,
- без backfill,
- без правок схемы/кода/данных.

## 2. Inputs Audited

### 2.1 Data exports requested

Ожидались выгрузки:

- `countries.xlsx`
- `cities.xlsx`
- `places.xlsx`
- `events.xlsx`
- `blog_posts.xlsx`

Заявленные объемы (по пользовательскому факту):

- Blog: 31 пост
- Atlas: 8 стран, 110 городов, 477 мест
- Pulse: 208 событий

### 2.2 Data-file access note (critical)

Во время этого аудита файлы `*.xlsx` **не обнаружены** в доступном workspace/проверенных директориях.  
Поэтому column-level выводы для datasets основаны на:

- schema/migrations/tooling evidence,
- content canon structure,
- заявленных объемах выгрузок.

Это дает рабочий verdict для Wave A, но требует отдельного quick-verify шага по фактическим xlsx headers перед correction planning.

### 2.3 Repo sources audited

- `packages/db/src/schema/**` (ключевые: `content.ts`, `blog.ts`, `cityMapping.ts`)
- `packages/db/migrations/**` + `packages/db/migrations/meta/_journal.json`
- `packages/db/src/queries/**` (ключевые: `content.ts`, `blog.ts`, `guides.ts`)
- `packages/db/src/import*.ts` / `packages/db/src/export*.ts`
- `packages/db/package.json`

### 2.4 Planning/governance baseline used

- `docs/plans/go2asia_wave_a_neon_ontology_subset_v1.md`
- `docs/plans/go2asia_wave_a_atlas_pulse_curated_input_pack_v1.md`
- `docs/plans/go2asia_wave_a_execution_queue_v1.md`
- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`

### 2.5 Architecture/domain context used

- `docs/architecture/atlas/atlas_neon_maturity_gate_note_v1.md`
- `docs/architecture/atlas/atlas_geo_place_foundation_pass_v1.md`
- `docs/architecture/atlas/atlas_domain_model_v1.md`
- `docs/architecture/pulse/pulse_domain_model_v1.md`
- `docs/backend/content_service/overview.md`

## 3. Current Data Reality by Dataset

> В этом разделе структура колонок дана как **expected/exported shape from schema/tooling**, поскольку прямой доступ к `.xlsx` отсутствует.

### 3.1 `countries.xlsx`

- **Ожидаемая структура:** `id`, `slug`, `name`, `code`, `flag_emoji`, `description_short`, media link fields.
- **Переходные признаки:** минимальные; dataset ближе к устойчивому SSOT-слою.
- **Сильные стороны:** четкая идентичность (`id`, `slug`, `code`) и низкая модельная неоднозначность.
- **Слабые стороны:** риск дрейфа human-readable fields (`name`/`description`) не критичен для Wave A.
- **Конфликты с Wave A subset:** ожидаемо низкие.
- **Предварительная пригодность:** высокая, при условии непротиворечивости `slug/code`.

### 3.2 `cities.xlsx`

- **Ожидаемая структура:** `id`, `country_id`, `slug`, `name`, `names` (json), editorial filters, `lat/lng`, legacy `latitude/longitude`.
- **Переходные признаки:** dual geo fields + mixed naming conventions.
- **Сильные стороны:** есть явная country linkage и city slug identity.
- **Слабые стороны:** legacy/new геополя увеличивают риск неочевидного SSOT.
- **Конфликты с Wave A subset:** критичен `cities.country_id` consistency.
- **Предварительная пригодность:** средняя; usable при bounded corrections.

### 3.3 `places.xlsx`

- **Ожидаемая структура:** `id`, `country_id`, `city_id`, `slug`, `name`, `place_kind`, `type`, category/tags, `lat/lng`, legacy `latitude/longitude`, media/image fields.
- **Переходные признаки:** dual geo + compatibility fields (`images`) alongside media references.
- **Сильные стороны:** есть явные keys для Atlas reference-layer.
- **Слабые стороны:** nullable geo links и mixed media representation.
- **Конфликты с Wave A subset:** `place -> city -> country` consistency и place-link readiness для downstream.
- **Предварительная пригодность:** средняя; bridge-usable при явных caveats.

### 3.4 `events.xlsx`

- **Ожидаемая структура:** `id`, `slug`, `title`, `country_slug/city_slug`, `country_id/city_id` (optional), `start_at/end_at`, legacy `start_date/end_date`, geo coords, media keys/prefix, status/flags.
- **Переходные признаки:** явная dual model (slug-geo bridge + optional FK + legacy/new time/geo fields).
- **Сильные стороны:** импорт tooling уже поддерживает slug-first bridge и idempotent ingestion.
- **Слабые стороны:** потенциальный slug-vs-FK drift и mixed time fields.
- **Конфликты с Wave A subset:** это главный риск-блок перед Pulse refresh.
- **Предварительная пригодность:** bridge-usable, но требует bounded correction intake.

### 3.5 `blog_posts.xlsx`

- **Ожидаемая структура:** для актуального контура `blog_posts` — `id/slug/lang/title`, `category`, `country_slug/city_slug`, `status/published_at`, author/tags/media/projection fields.
- **Переходные признаки:** coexistence двух блог-контуров (`articles` legacy в `content.ts` и `blog_*` domain tables).
- **Сильные стороны:** есть working import/query contour для blog markdown canon (31 file corpus подтвержден).
- **Слабые стороны:** риск преждевременной глубокой geo-нормализации blog в этой волне.
- **Конфликты с Wave A subset:** Blog не core target WA-001/WA-002; зависимость вторична.
- **Предварительная пригодность:** usable with explicit caveats; не должен расширять Atlas/Pulse correction scope.

## 4. Schema / Migration / Tooling Reality

### 4.1 Что уже поддерживается схемой

- Atlas/Pulse foundation в `content.ts`: `countries/cities/places/events/event_registrations`.
- Blog domain в `blog.ts`: `blog_posts`, `blog_authors`, tags/relations.
- City mapping layer задан в `cityMapping.ts`.

### 4.2 Что подтверждено миграциями

- Atlas evolution: city dedup/names/filters + guides engine migrations.
- Pulse evolution: media key/prefix normalization migrations.
- Blog evolution: dedicated blog migrations.
- Cross-domain place links: `0021_atlas_place_foundation_links.sql` (`rf`/`rielt` -> `places`).

### 4.3 Где dual model явно присутствует

- Geo: `lat/lng` и `latitude/longitude` (cities/places/events).
- Event time: `start_at/end_at` и `start_date/end_date`.
- Event location: slug-refs (`country_slug/city_slug`) + optional FK (`country_id/city_id`).
- Blog: legacy `articles` vs current `blog_*` contour.

### 4.4 Tooling bridge mode (already working)

- Pulse import markdown flow (`db:import:pulse-md`) с slug-first discipline.
- Blog import markdown flow (`db:import:blog-md`).
- Atlas exports/imports scripts для place/tab data и guides layer.
- Query layer (`queries/content.ts`) уже использует `COALESCE` и slug/FK bridge patterns.

### 4.5 Потенциальный drift

- `city_mapping_*` описаны в TS schema, но SQL migration под них в `migrations` не подтверждена.
- Guides tables активно используются в SQL tooling/query, но не как полный Drizzle schema contour.
- При отсутствии строгой границы легко смешать legacy-compatible поля с operational SSOT.

## 5. Geo-Ontology Fit Assessment

### 5.1 Где fit уже достаточный

- `countries` как anchor-слой выглядит устойчиво для Wave A.
- `cities/places/events` уже допускают bridge execution (slug/FK coexistence).
- Tooling и queries поддерживают bridge-mode без немедленного глобального backfill.

### 5.2 Где видны основные проблемы

- Наиболее чувствительный слой — `events`: slug/FK consistency и legacy/new date fields.
- `cities/places`: dual geo fields затрудняют однозначный SSOT выбор без policy discipline.
- `city_mapping` слой не должен считаться fully operational persistence до подтверждения migration parity.

### 5.3 Legacy fields impact

- Legacy поля **не обязаны блокировать Wave A**, если ясно зафиксированы как bridge/debt.
- Но они блокируют «автоматический вывод истины» и требуют explicit validation boundary.

### 5.4 Итог fit

- Текущая модель **допускает Wave A bridge**, но не готова к неконтролируемому bulk-correction.
- Нужен bounded correction scope вокруг Atlas/Pulse ключевых mismatches.

## 6. Wave A Readiness Assessment

### 6.1 Что уже достаточно хорошо

- Есть рабочий schema/tooling bridge для Atlas/Pulse/Blog.
- Есть подтвержденные content canons по объему (`pulse` 208, `blog` 31; `atlas` corpus масштабный).
- Есть governance рамка WA-001/WA-002, ограничивающая scope.

### 6.2 Что блокирует Atlas refresh

- Непроверенная фактическая consistency `cities.country_id` и `places.city/country` в exported data.
- Неявность operational SSOT между legacy/new geo columns.

### 6.3 Что блокирует Pulse refresh

- Непроверенная фактическая slug/FK согласованность в `events.xlsx`.
- Риск смешения `start_at/end_at` и legacy date fields без explicit intake rules.

### 6.4 Зависимость Blog от Atlas/Pulse foundation

- Blog имеет вторичную geo-зависимость через `country_slug/city_slug`.
- Blog не должен становиться blocker для Atlas/Pulse bounded correction before Wave A refresh.

### 6.5 Влияние на Rielt/Space

- Для их first live surface критична стабильность Atlas place/event references.
- Глобальный data cleanup не нужен; нужен только устойчивый Atlas/Pulse bridge baseline.

### 6.6 Что не должно блокировать Wave A

- Полная migration legacy fields.
- Полный FK backfill всех событий.
- Полный city-mapping platform rollout.

## 7. Bounded Correction Scope (Diagnostic Verdict)

### 7.1 Must-fix before Atlas/Pulse refresh

- `events` records с конфликтом slug-гео vs FK-гео.
- Явные нарушения `country -> city -> place` link consistency в target Wave A records.
- Критические date inconsistencies, ломающие Pulse event ordering/visibility.
- Невалидные идентификаторы в P0 записях, блокирующих refresh.

### 7.2 Should-fix in Wave A if affordable

- High-impact alias/mapping ambiguity по city resolution.
- Нормализация приоритетных проблемных country/city/place slugs.
- Консолидация media/date usage для target Atlas/Pulse user paths.

### 7.3 Can remain bridge/debt for one cycle

- Большая часть legacy columns при явной bridge-policy.
- Частичный null FK coverage у Pulse events, если slug-level semantics валидны.
- Неполный city-mapping automation (при manual-review режиме).

### 7.4 Out of Wave A scope

- Global one-shot backfill/cleanup по всем historical rows.
- Полный ontological redesign Atlas/Pulse.
- Полная cross-domain geo normalization для всех сервисов.
- Массовые corrections для non-target contours вне Atlas/Pulse/Blog bridge needs.

## 8. Dataset-Specific Verdicts

- **`countries.xlsx`** -> `usable as-is for Wave A`  
  (низкая модельная неоднозначность, anchor identity layer).
- **`cities.xlsx`** -> `usable with bounded corrections`  
  (нужна проверка country linkage и dual-geo discipline).
- **`places.xlsx`** -> `bridge-usable with explicit caveats`  
  (нужна проверка place-city-country consistency, без глобального cleanup).
- **`events.xlsx`** -> `usable with bounded corrections`  
  (главный correction target: slug/FK/date consistency).
- **`blog_posts.xlsx`** -> `bridge-usable with explicit caveats`  
  (не core blocker для WA; использовать без расширения correction scope).

## 9. Risks and Safeguards

### 9.1 Key risks

- audit может быть ошибочно интерпретирован как mandate на giant migration;
- можно сломать рабочий bridge, пытаясь «сразу привести всё к идеалу»;
- Blog может быть преждевременно втянут в избыточную geo-коррекцию;
- Cursor может начать auto-invent corrections без explicit pack decisions.

### 9.2 Safeguards

- correction only through bounded WA-002 pack intake rules;
- no silent DDL/DML, no bulk auto-backfill;
- priority-first (`P0/P1`) corrections для Atlas/Pulse;
- manual-review для ambiguous mapping/slug/FK conflicts;
- отдельный correction plan до implementation changes.

## 10. Recommended Next Handoff

1. Провести **quick header-level verification** фактических `*.xlsx` (колонки/типовые null patterns), чтобы закрыть data-file access gap.
2. На базе этого audit + WA-002 spec создать отдельный:
   - **`bounded correction plan`** (без выполнения corrections),
   - с P0/P1 списком Atlas/Pulse records.
3. Только после human confirmation bounded plan:
   - переходить к Cursor execution для `WA-004`/`WA-005`.

Recommended next artifact:

- `docs/plans/go2asia_wave_a_atlas_pulse_bounded_correction_plan_v1.md`

## 11. Files Used

- `docs/plans/go2asia_wave_a_neon_ontology_subset_v1.md`
- `docs/plans/go2asia_wave_a_atlas_pulse_curated_input_pack_v1.md`
- `docs/plans/go2asia_wave_a_execution_queue_v1.md`
- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`
- `docs/architecture/atlas/atlas_neon_maturity_gate_note_v1.md`
- `docs/architecture/atlas/atlas_geo_place_foundation_pass_v1.md`
- `docs/architecture/atlas/atlas_domain_model_v1.md`
- `docs/architecture/pulse/pulse_domain_model_v1.md`
- `docs/backend/content_service/overview.md`
- `packages/db/src/schema/content.ts`
- `packages/db/src/schema/blog.ts`
- `packages/db/src/schema/cityMapping.ts`
- `packages/db/src/queries/content.ts`
- `packages/db/src/queries/blog.ts`
- `packages/db/src/queries/guides.ts`
- `packages/db/src/importPulseEventsFromMarkdown.ts`
- `packages/db/src/importBlogFromMarkdown.ts`
- `packages/db/src/exportPlacesToNeon.ts`
- `packages/db/src/exportAtlasCountryCityTabsToNeon.ts`
- `packages/db/migrations/**`
- `packages/db/migrations/meta/_journal.json`
- `packages/db/package.json`
- `content/atlas/**`
- `content/pulse/**`
- `content/blog/**`
