# Go2Asia Wave A Atlas/Pulse Curated Input Pack v1

Status: active WA-002 intake spec  
Date: 2026-03-24  
Scope: Atlas/Pulse-sensitive curated corrections only

## 1. Purpose

Этот документ задает **практический формат curated input pack** для Wave A (WA-002).

Pack нужен, чтобы:

- дать Atlas/Pulse refresh реальные и вручную подготовленные входы;
- исключить хаотичные ad-hoc правки Neon;
- зафиксировать прозрачный intake/validation процесс для Cursor;
- подготовить управляемый переход к `WA-004` и `WA-005`.

Почему это критично:

- без curated pack Cursor либо начинает гадать, либо пытается «додумать» данные;
- в Wave A это недопустимо: никаких выдуманных данных и скрытого auto-fill.

## 2. What This Pack Is For

Pack используется только для Atlas/Pulse-sensitive корректировок:

- Atlas geo corrections и normalization-sensitive проблемы;
- Pulse event geo/event corrections и canonical mapping-sensitive кейсы;
- приоритетные проблемные записи, мешающие Wave A refresh.

Pack **не** предназначен для полной замены всей базы и не запускает массовую миграцию.

## 3. Scope of the Pack

### 3.1 Что может входить

1. **Country/City/Place correction items**
   - исправления slug/name/linkage для существующих сущностей;
   - уточнение `country -> city -> place` связей в пределах Wave A.
2. **Canonical slug correction items**
   - корректировка canonical slug и связанных алиасов.
3. **Alias/mapping hints**
   - подсказки для `city_aliases` и mapping ambiguity.
4. **Pulse event correction items**
   - event geo corrections (slug/FK consistency hints),
   - event title/date cleanup hints,
   - event-to-city / event-to-place reference hints.
5. **Priority problem records**
   - только записи, критичные для ближайшего Atlas/Pulse refresh.
6. **Unresolved/manual-review records**
   - спорные случаи, которые нельзя безопасно решать автоматически.

### 3.2 Что не входит

- полная миграция всех исторических строк;
- массовый auto-backfill `country_id/city_id` по всему `events`;
- полная глобальная унификация geo ontology;
- пакеты для `RF/Quest/Space/Rielt` (в рамках WA-002);
- генерация «догадочных» значений вместо ручного input.

## 4. Recommended Pack Structure

### 4.1 Рекомендуемый формат (основной)

**Один Markdown-файл** в стиле `pack-v1`, с разделами-таблицами по типам записей.

Почему:

- удобно заполнять вручную;
- легко ревьюить диффом;
- не требует специального редактора;
- хорошо подходит для смешанного режима (точечные и приоритетные записи).

### 4.2 Опциональный формат для bulk

- CSV-файлы по тем же типам записей (если пользователь работает через таблицы).
- CSV допустим как приложение к основному Markdown pack.

### 4.3 Минимальная мета-структура pack

- `pack_id`
- `prepared_by`
- `prepared_at`
- `wave_scope` (должно быть `Wave A`)
- `source_notes`
- `record_counts` по типам

## 5. Record Types

Ниже — типы записей и минимальные поля.

### 5.1 Atlas City Correction Record

- **Purpose:** исправить city-level identity/linkage для Wave A.
- **Required fields:**
  - `record_id`
  - `city_id_or_slug`
  - `country_id_or_slug`
  - `issue_type`
  - `proposed_correction`
  - `evidence_note`
- **Optional fields:**
  - `canonical_slug`
  - `names_ru`
  - `names_en`
  - `priority` (`P0|P1|P2`)
- **Validation notes:**
  - должна быть однозначная привязка к существующему city;
  - конфликтующие country references -> manual review.

### 5.2 Atlas Place Correction Record

- **Purpose:** исправить place linkage (`country_id/city_id`) и canonical атрибуты.
- **Required fields:**
  - `record_id`
  - `place_id_or_slug`
  - `issue_type`
  - `proposed_country_id_or_slug`
  - `proposed_city_id_or_slug`
  - `evidence_note`
- **Optional fields:**
  - `place_kind`
  - `canonical_slug`
  - `priority`
- **Validation notes:**
  - place должен существовать;
  - если указан `city`, country не должен конфликтовать со страной города.

### 5.3 Pulse Event Correction Record

- **Purpose:** исправить event geo/schedule metadata для Wave A surfaces.
- **Required fields:**
  - `record_id`
  - `event_id_or_source_path`
  - `issue_type`
  - `proposed_country_slug`
  - `proposed_city_slug` (nullable)
  - `proposed_start_at_or_start_date`
  - `proposed_end_at_or_end_date`
  - `evidence_note`
- **Optional fields:**
  - `proposed_country_id`
  - `proposed_city_id`
  - `title_override`
  - `geo_scope`
  - `priority`
- **Validation notes:**
  - event должен однозначно резолвиться;
  - slug-гео обязано быть валидным;
  - FK-поля не принимаются при конфликте с slug без manual resolution.

### 5.4 Mapping / Alias Hint Record

- **Purpose:** зафиксировать city alias или mapping hint без silent auto-application.
- **Required fields:**
  - `record_id`
  - `source_slug_or_alias`
  - `target_city_id_or_slug`
  - `country_scope`
  - `hint_reason`
- **Optional fields:**
  - `confidence` (`high|medium|low`)
  - `supporting_examples`
- **Validation notes:**
  - `low` confidence всегда идет в manual review;
  - hint не равен автоматическому изменению базы.

### 5.5 Unresolved / Manual Review Record

- **Purpose:** явно вынести спорные случаи, чтобы не «додумывать».
- **Required fields:**
  - `record_id`
  - `domain` (`atlas|pulse|mapping`)
  - `ambiguous_entity`
  - `ambiguity_reason`
  - `manual_decision_needed`
- **Optional fields:**
  - `candidate_values`
  - `blocking_impact`
- **Validation notes:**
  - такие записи не могут auto-accept в intake.

## 6. Validation Rules (Cursor Intake)

### 6.1 Structural validation (step 1)

- проверка наличия обязательных полей по типу записи;
- проверка формата ключевых идентификаторов;
- проверка allowed values для `priority`, `confidence`, `domain`.

### 6.2 Semantic sanity checks (step 2)

- резолв существования `country/city/place/event` references;
- детекция конфликтов slug/name/FK;
- проверка date order (`start <= end`);
- проверка ambiguous mappings.

### 6.3 Intake decision states (step 3)

- `accepted` — структурно и семантически валидно;
- `flagged` — частично валидно, но требует уточнения;
- `rejected` — нет необходимых данных или явные противоречия;
- `manual_review` — неоднозначность без безопасного авто-решения.

### 6.4 Что запрещено auto-invent

- auto-creation новых сущностей без явного user input;
- «догадочные» `country_id/city_id` при неоднозначности;
- auto-fix title/date/geo_scope без evidence;
- заполнение пропусков mock-значениями.

## 7. User Preparation Guidance

### 7.1 Что собирать в первую очередь

1. `P0` записи, блокирующие Atlas/Pulse refresh;
2. Pulse events с проблемным geo linkage;
3. Atlas cities/places с явным country-city mismatch;
4. alias/mapping кейсы, которые влияют на маршрутизацию и резолв.

### 7.2 Как не распыляться

- не пытаться покрыть весь архив событий и все страны;
- собирать только проблемные записи, влияющие на ближайший Wave A refresh;
- держать unresolved кейсы отдельным блоком, а не «дотягивать» догадками.

### 7.3 Наиболее ценные problem records

- записи, которые напрямую ломают Atlas/Pulse UI consistency;
- события, которые выпадают из geo-контекста;
- кейсы, где одно решение разблокирует сразу несколько экранов/списков.

## 8. Cursor Intake Guidance

После получения pack Cursor делает только intake/подготовку:

1. **Structural validation**
2. **Semantic sanity check**
3. **Grouping by correction type** (`city`, `place`, `event`, `mapping`, `manual_review`)
4. **Preparation outputs** для следующих задач (WA-004/WA-005 context)

Важно:

- Cursor **не** пишет данные в БД на этапе WA-002;
- Cursor **не** выполняет silent auto-write/backfill;
- Cursor формирует только validated intake result и explicit review flags.

## 9. Explicit Non-Goals

- этот pack не равен полной миграции данных;
- этот pack не заменяет финальную онтологию Atlas/Pulse;
- этот pack не запускает массовый auto-backfill;
- этот pack не разрешает Cursor генерировать отсутствующие данные;
- этот pack не покрывает `RF/Quest/Space/Rielt` packs в рамках WA-002.

## 10. Recommended Next Handoff

### Что делает пользователь после утверждения spec

- готовит curated pack в рекомендованном формате;
- приоритизирует `P0/P1` проблемные записи для Atlas/Pulse;
- явно помечает ambiguous кейсы как `manual_review`.

### Что делает Cursor после получения pack

- выполняет intake validation (structural + semantic + decision states);
- формирует grouped validated output и unresolved список;
- подготавливает входы для targeted refresh задач.

### Следующий логичный WA-item

- После принятого и проверенного pack:  
  - **`WA-004` (Atlas first refresh integration)**  
  - **`WA-005` (Pulse first refresh integration)**  
  в соответствии с Wave A sequencing.

## 11. Files Used

- `docs/plans/go2asia_wave_a_execution_queue_v1.md`
- `docs/plans/go2asia_wave_a_neon_ontology_subset_v1.md`
- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`
- `packages/db/src/schema/content.ts`
- `packages/db/src/importPulseEventsFromMarkdown.ts`
- `content/atlas/**`
- `content/pulse/**`
