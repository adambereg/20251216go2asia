# Go2Asia Atlas/Pulse/Blog Live Data Audit v1

Status: live read-only audit verdict  
Date: 2026-03-24  
Scope: Atlas/Pulse/Blog foundation data in live Neon staging database

## 1. Purpose

Этот документ фиксирует **live data audit** по Atlas/Pulse/Blog на реальных таблицах Neon.

Он проверяет:

- фактическое состояние таблиц и связей;
- совместимость текущего dataset с Wave A subset;
- реальные must-fix зоны перед Atlas/Pulse refresh;
- что можно использовать как bridge в текущем цикле.

Это **audit/verdict**, а не correction pass:

- без изменения данных;
- без изменения схемы;
- без миграций и backfill.

## 2. Live Environment Audited

- **Source of connection:** `E:/projects/work_go2asia/20251216go2asia/.env.neon.audit.local`
- **Used variable:** `STAGING_DATABASE_URL` (only)
- **Endpoint host (audited):** `ep-shiny-violet-a4ja8x5m.us-east-1.aws.neon.tech`
- **Database:** `neondb` (`SELECT current_database()`)
- **Schema:** `public` (`SELECT current_schema()`)
- **Audit timestamp (DB):** `2026-03-24T05:54:25.654Z`
- **Read-only mode confirmation:** `SHOW transaction_read_only = on`

Neon branch name не возвращается SQL напрямую; аудит выполнен против endpoint из `STAGING_DATABASE_URL`.

## 3. Tables Actually Inspected

Реально проверены:

- `countries`
- `cities`
- `city_aliases`
- `places`
- `events`
- `blog_posts`
- `content_blocks`
- `event_registrations`
- `media_files`

Все перечисленные таблицы существуют в `public` schema.

## 4. Dataset Reality by Table

### 4.1 `countries`

- **Row count:** `8`
- **Ключевые колонки:** `id`, `slug`, `name`, `code`, `hero_media_id`
- **Sample shape:** компактный и стабильный country identity слой.
- **Legacy/bridge признаки:** минимальные.
- **Сильные стороны:** чистый reference layer; дубликаты slug отсутствуют.
- **Слабые стороны:** не выявлены как blocker.
- **Potential Wave A conflict:** низкий.

### 4.2 `cities`

- **Row count:** `110`
- **Ключевые колонки:** `id`, `country_id`, `slug`, `name`, `lat/lng`, `latitude/longitude`, `names`, editorial fields.
- **Sample shape:** short-code IDs (`aya`, `bag`, `bali`, ...), заполнены `lat/lng`.
- **Legacy/bridge признаки:** dual geo columns присутствуют структурно.
- **Live факт dual usage:** `has_new_latlng=110`, `has_legacy_latlng=0`, `has_both=0`.
- **Сильные стороны:** link с `countries` целостный (`broken_cities_country_fk=0`).
- **Слабые стороны:** potential ambiguity если legacy поля начнут использоваться вне current pattern.

### 4.3 `places`

- **Row count:** `477`
- **Ключевые колонки:** `id`, `country_id`, `city_id`, `slug`, `place_kind`, `lat/lng`, legacy `latitude/longitude`.
- **Sample shape:** place IDs и slugs выглядят стабильными; `place_kind` используется.
- **Legacy/bridge признаки:** dual geo columns в схеме.
- **Live факт dual usage:** `has_new_latlng=457`, `has_legacy_latlng=0`, `has_both=0`.
- **Сильные стороны:** broken refs не выявлены (`broken_places_city_ref=0`, `broken_places_country_ref=0`, mismatch=0).
- **Слабые стороны:** 20 записей без новых координат (477 total vs 457 with `lat/lng`) — это caveat для map-heavy surfaces.

### 4.4 `events`

- **Row count:** `208` (совпадает с заявленным объемом)
- **Ключевые колонки:** `id`, `slug`, `country_slug/city_slug`, `country_id/city_id`, `start_at/end_at`, `start_date/end_date`, media fields.
- **Sample shape:** `country_id` заполнен; `city_id` частично null; slug-гео заполнены.
- **Legacy/bridge признаки:** сильная dual model.
- **Live dual usage:**
  - time: `has_start_at=208` и `has_start_date=208` (оба слоя активны);
  - coords: `lat/lng` и `latitude/longitude` фактически не заполнены (`0/0`).
- **Сильные стороны:** broken FK refs не выявлены (`events_broken_country_fk=0`, `events_broken_city_fk=0`).
- **Слабые стороны:**
  - `events_city_fk_null=42` (slug-only city for 42 rows);
  - `country_slug`/`city_slug` не пусты, но slug-vs-FK конфликт по прямому equality высокий:
    - `events_country_slug_fk_conflict=208`
    - `events_city_slug_fk_conflict=107`
  - дубликаты `events.slug`: 7 групп (ожидаемо cross-country seasonal names, но важный routing caveat).

### 4.5 `blog_posts`

- **Row count:** `31` (совпадает с заявленным объемом)
- **Ключевые колонки:** `id`, `slug`, `status`, `country_slug`, `city_slug`, `published_at`, content/media fields.
- **Sample shape:** публикации в `published` status, geo slugs часто null.
- **Legacy/bridge признаки:** blog живет в dedicated `blog_posts`, но geo targeting optional.
- **Live факт geo usage:** `with_country_slug=0`, `with_city_slug=0` (все 31 без geo-target).
- **Сильные стороны:** дубликатов slug нет; broken slug mappings не обнаружено (так как slugs не заданы).
- **Слабые стороны:** Blog сейчас практически не использует Atlas/Pulse geo-targeting как data dependency.

## 5. Cross-Table Consistency Checks

### 5.1 Referential consistency

- `cities.country_id -> countries.id`: **OK** (`0` broken)
- `places.city_id -> cities.id`: **OK** (`0` broken)
- `places.country_id -> countries.id`: **OK** (`0` broken)
- `places.country_id` vs `cities.country_id`: **OK** (`0` mismatch)
- `events.country_id -> countries.id`: **OK** (`0` broken)
- `events.city_id -> cities.id`: **OK** (`0` broken)

### 5.2 Pulse slug/FK bridge checks

- `events.country_fk_null`: `0`
- `events.city_fk_null`: `42`
- `events.country_slug_missing`: `0`
- `events.city_slug_missing`: `0`
- `events.country_slug vs FK(slug) conflict`: `208`
- `events.city_slug vs FK(slug) conflict`: `107`

Interpretation:

- FK integrity физически нормальная;
- но semantic mapping между slug-model и FK-model **не canonical-equal** и требует bounded correction policy перед refresh.

### 5.3 Duplicates / identity caveats

- Duplicate slug groups:
  - `countries`: 0
  - `cities`: 0
  - `places`: 0
  - `events`: 7 groups
  - `blog_posts`: 0

Event duplicates выглядят как cross-country reuse (`new-year-countdown`, `christmas-celebrations` и т.п.), поэтому `events.id` должен оставаться primary key в integration flows; slug-only routing рискован.

### 5.4 Blog geo dependency checks

- `blog_country_slug_unmatched`: `0`
- `blog_city_slug_unmatched`: `0`
- но фактически `country_slug/city_slug` не используются (`0/31` заполненных), значит текущая Blog зависимость от Atlas/Pulse geo links низкая.

## 6. Legacy / Dual-Model Assessment

### 6.1 Где dual-model реально активен

- `events`:
  - dual time fields используются одновременно (`start_at` + `start_date`, `end_at` + `end_date`);
  - slug/FK location duality фактически operational.
- `cities` / `places`:
  - legacy columns существуют, но в live dataset практически не используются (новые `lat/lng` доминируют).

### 6.2 Где bridge-model работает

- Referential FK слой рабочий и целостный.
- Slug-level bridge в событиях присутствует и покрывает все rows.
- Tooling/query layer из repo соответствует observed bridge reality (COALESCE/slug+FK patterns).

### 6.3 Где legacy мешает

- Неявность canonical rule между event slug и FK references.
- Одновременное хранение старых/новых time fields увеличивает риск drift в downstream logic.

## 7. Wave A Readiness Assessment

### 7.1 Что уже достаточно хорошо для Wave A

- Базовые row counts совпадают с ожидаемыми: `8/110/477/208/31`.
- Atlas reference graph (`countries/cities/places`) структурно целостен.
- Blog dataset стабилен и не является immediate blocker.

### 7.2 Что блокирует Atlas refresh

- Не structural integrity, а качество части place geo completeness (20 rows без `lat/lng`) для map-first surfaces.

### 7.3 Что блокирует Pulse refresh

- Нормализация semantic bridge между `country_slug/city_slug` и `country_id/city_id`.
- Явное правило работы с city-null rows (`42`) в target screens.
- Согласование dual time fields для deterministic rendering/filtering.

### 7.4 Практическая зависимость Blog от Atlas/Pulse

- На текущем live dataset зависимость низкая (geo-target slugs не заполнены в blog posts).
- Поэтому Blog не должен расширять correction scope до Wave-A blocking уровня.

### 7.5 Влияние на downstream (`Rielt/Space`)

- Для них критична стабильность Atlas/Pulse reference truth (особенно event/place linkage), а не глобальный cleanup.
- Текущий FK integrity достаточен как bridge, но semantic normalization для Pulse нужна до live refresh.

### 7.6 Что не должно блокировать Wave A

- Полная миграция legacy полей.
- Глобальный backfill всех event city FK.
- Полная harmonization всех slug across all modules.

## 8. Bounded Correction Verdict

### 8.1 Must-fix before Atlas/Pulse refresh

- Зафиксировать canonical mapping rules для `events.country_slug/city_slug` vs FK fields.
- Обработать P0 event rows с city-null/ambiguous mapping, которые критичны для Wave A surfaces.
- Зафиксировать deterministic read rule для dual time fields (`start_at/end_at` as canonical UI/runtime read).

### 8.2 Should-fix in Wave A if affordable

- Закрыть high-impact place rows без `lat/lng` (там, где это влияет на target views).
- Нормализовать event slug duplicates handling policy в API/UI consumption (slug-only not safe).
- Добавить bounded alias/mapping decisions для проблемных city slugs.

### 8.3 Bridge-usable with caveats

- Atlas tables в целом bridge-usable при текущей referential integrity.
- Pulse dataset bridge-usable только при explicit slug/FK interpretation rules.
- Blog dataset bridge-usable как независимый контентный слой (без geo-target ambition в Wave A).

### 8.4 Out of Wave A scope

- Global one-shot event backfill for all optional FK and legacy fields.
- Full ontology redesign for Atlas/Pulse/Blog jointly.
- Массовая cross-domain migration beyond Atlas/Pulse bounded scope.

## 9. Table-by-Table Final Verdicts

- `countries`: **usable as-is for Wave A**  
  (чистый reference layer, без broken links/dupes).

- `cities`: **usable with bounded corrections**  
  (структурно целостно; нужны только targeted semantic checks where relevant).

- `places`: **bridge-usable with explicit caveats**  
  (integrity хорошая, но есть subset без `lat/lng`).

- `events`: **usable with bounded corrections**  
  (целостные FK, но сильный slug/FK semantic drift + dual time model).

- `blog_posts`: **bridge-usable with explicit caveats**  
  (стабилен и не блокирует Wave A; geo targeting фактически не используется).

## 10. Risks and Safeguards

### 10.1 Risks

- Ошибочно начать giant migration из-за высокого conflict count в slug-vs-FK without context.
- Сломать рабочий bridge, если делать широкие corrections вместо targeted P0 scope.
- Преждевременно втянуть Blog в geo-normalization wave, не дающую практической пользы для Wave A.
- Позволить Cursor auto-invent mappings для ambiguous events/cities.

### 10.2 Safeguards

- Correction only through human-confirmed bounded pack/plan.
- No write operations until correction plan accepted.
- Keep `events.id` as primary event identity in refresh flows.
- Separate must-fix P0 from deferred cleanup.
- Не смешивать audit verdict и implementation шаги WA-004/WA-005.

## 11. Recommended Next Handoff

1. Нужен отдельный документ:
   - `go2asia_wave_a_atlas_pulse_bounded_correction_plan_v1.md`
   - с конкретным P0/P1 списком correction cases по events/city mapping/place gaps.
2. До любого implementation:
   - human review и подтверждение correction boundaries.
3. После подтверждения:
   - Cursor выполняет только согласованный bounded correction execution,
   - затем переход к `WA-004` / `WA-005`.

## 12. Files Used

Live data source:

- `.env.neon.audit.local` (`STAGING_DATABASE_URL` only)
- live SQL read-only inspection on `neondb.public`

Repo/supporting baseline:

- `docs/plans/go2asia_wave_a_neon_ontology_subset_v1.md`
- `docs/plans/go2asia_wave_a_atlas_pulse_curated_input_pack_v1.md`
- `docs/plans/go2asia_wave_a_execution_queue_v1.md`
- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`
- `packages/db/src/schema/**`
- `packages/db/migrations/**`
- `packages/db/src/queries/**`
- `packages/db/src/import*.ts`
- `packages/db/src/export*.ts`
- `packages/db/package.json`
