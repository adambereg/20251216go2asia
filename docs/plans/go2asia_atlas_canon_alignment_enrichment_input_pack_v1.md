# Go2Asia Atlas Canon Alignment Enrichment Input Pack v1

Status: input-pack specification (manual preparation only)  
Date: 2026-03-24  
Scope: Atlas enrichment inputs for AX-1 / AX-2 (non-execution)

## 1. Purpose

Этот документ задает формат и правила ручной подготовки Atlas enrichment input pack.

Зачем это нужно:

- AX-1/AX-2 из execution plan зависят от human-provided данных;
- без этих входов Cursor не должен продолжать Atlas alignment execution slices;
- Cursor не должен выдумывать district mappings и coordinates.

Это не correction run и не SQL artifact.

## 2. What This Pack Is For

Pack предназначен для подготовки:

- district strategy input (priority zones / district decisions + parent rule decisions);
- place-to-district attribution input для target subset;
- high-impact missing place coordinates input;
- ambiguous Atlas geo cases, требующих explicit human decision.

Pack не предназначен для:

- полной разметки всего Atlas во всех странах;
- глобального district rollout;
- Pulse/downstream correction scope.

## 3. Scope of the Pack

### 3.1 Included

- district priority decisions для AX-1;
- district naming/ID decisions в приоритетных зонах;
- place-to-district mappings для target subset;
- missing `lat/lng` для high-impact places;
- `manual_review` и `excluded` cases (явно зафиксированные).

### 3.2 Excluded

- all-country full district enrichment;
- total place cleanup;
- full metadata program;
- Pulse event corrections;
- downstream module packs (Rielt/RF/Space/Quest);
- giant geo remapping initiative.

## 4. Recommended Pack Format

Рекомендуемый формат:

1. Один Markdown файл (основной pack) с разделами и таблицами.
2. Опционально — CSV приложения для длинных списков (если вручную в Markdown неудобно).

Минимальная структура Markdown pack:

- `## Pack Metadata`
- `## P0 Records`
- `## P1 Records`
- `## Manual Review`
- `## Excluded`

## 5. Record Types

### 5.1 District Decision Record

- **Purpose:** зафиксировать district decision в приоритетной зоне.
- **Required fields:** `country_slug`, `proposed_parent_type`, `proposed_parent_id_or_slug`, `proposed_district_slug`, `proposed_district_name`, `decision_status`, `rationale`.
- **Optional fields:** `city_slug`, `proposed_district_id`, `priority_tier`, `evidence_note`, `approved_by`, `approval_date`.
- **Notes:** если district identity спорна, статус должен быть `manual_review`.

### 5.2 Place-to-District Attribution Record

- **Purpose:** зафиксировать связь place -> district для target place subset.
- **Required fields:** `place_id_or_slug`, `country_slug`, `city_slug`, `proposed_district_slug`, `decision_status`, `evidence_note`.
- **Optional fields:** `proposed_district_id`, `container_place_id_or_slug`, `rationale`, `approved_by`, `approval_date`.
- **Notes:** ambiguous attribution не может быть `accepted` без human confirmation.

### 5.3 Place Coordinate Enrichment Record

- **Purpose:** закрыть high-impact gaps `lat/lng` для places.
- **Required fields:** `place_id_or_slug`, `current_lat`, `current_lng`, `approved_lat`, `approved_lng`, `decision_status`, `evidence_note`.
- **Optional fields:** `coordinate_source_type`, `rationale`, `approved_by`, `approval_date`.
- **Notes:** coordinates без источника должны идти в `manual_review`, не в `accepted`.

### 5.4 Atlas Manual Review Record

- **Purpose:** сохранить спорные cases отдельно от execution-ready rows.
- **Required fields:** `object_type`, `object_id_or_slug`, `issue_class`, `ambiguity_note`, `required_human_decision`.
- **Optional fields:** `proposed_next_step`, `owner_role`, `review_deadline`.
- **Notes:** эти строки не участвуют в auto progression к execution.

## 6. Required Fields by Record Type (Quick Tables)

### District Decision Record

| Field | Required | Notes |
|---|---|---|
| country_slug | yes | Atlas country reference |
| proposed_parent_type | yes | `city` or another allowed canonical parent type |
| proposed_parent_id_or_slug | yes | Parent reference for local-zone district |
| city_slug | optional | Fill when parent type is `city` |
| proposed_district_slug | yes | Stable routing key candidate |
| proposed_district_name | yes | Human-readable label |
| proposed_district_id | optional | If ID convention already decided |
| decision_status | yes | `accepted/manual_review/excluded` |
| rationale | yes | Why this decision |
| evidence_note | optional | Source trace |
| approved_by | optional | Required for accepted readiness |
| approval_date | optional | Required for accepted readiness |

### Place-to-District Attribution Record

| Field | Required | Notes |
|---|---|---|
| place_id_or_slug | yes | Target place |
| country_slug | yes | Guard against cross-country mismatch |
| city_slug | yes | Guard against wrong city context |
| proposed_district_slug | yes | Target district reference |
| proposed_district_id | optional | If available |
| container_place_id_or_slug | optional | For container-place linkage where relevant |
| decision_status | yes | `accepted/manual_review/excluded` |
| evidence_note | yes | Why mapping is valid |
| approved_by | optional | Required for accepted readiness |
| approval_date | optional | Required for accepted readiness |

### Place Coordinate Enrichment Record

| Field | Required | Notes |
|---|---|---|
| place_id_or_slug | yes | Target place |
| current_lat | yes | Existing value (or empty if null) |
| current_lng | yes | Existing value (or empty if null) |
| approved_lat | yes | Candidate approved value |
| approved_lng | yes | Candidate approved value |
| decision_status | yes | `accepted/manual_review/excluded` |
| evidence_note | yes | Coordinate source/reference |
| coordinate_source_type | optional | e.g. editorial/manual/map source |
| approved_by | optional | Required for accepted readiness |
| approval_date | optional | Required for accepted readiness |

### Atlas Manual Review Record

| Field | Required | Notes |
|---|---|---|
| object_type | yes | `district/place/other` |
| object_id_or_slug | yes | Record identity |
| issue_class | yes | Ambiguity category |
| ambiguity_note | yes | What is unresolved |
| required_human_decision | yes | Exact decision requested |
| proposed_next_step | optional | Suggested resolution path |

## 7. Decision Statuses

- `accepted`  
  Подтверждено человеком, может пойти в следующий bounded Atlas execution slice.

- `manual_review`  
  Нужна дополнительная ручная экспертиза; в execution slice автоматически не включается.

- `excluded`  
  Сознательно вне текущего Atlas cycle/subset.

Правило: только `accepted` может перейти в execution-prep candidate set.

## 8. User Preparation Guidance

1. Начать с **P0**: 1-2 priority zones (не весь регион).
2. Заполнить district decisions только для этих зон.
3. Выбрать небольшой high-impact place subset с missing `lat/lng`.
4. Заполнить place-to-district attribution только для target subset, отмечая container-place linkage где релевантно.
5. Все сомнительные cases сразу маркировать `manual_review`.
6. Не пытаться закрыть весь Atlas за один pack.
7. Держать первую партию короткой и проверяемой.

Рекомендация по объему first batch:

- district decisions: 5-20 строк;
- place coordinate enrichments: 10-30 строк;
- place-to-district mappings: 10-30 строк;
- manual review: отдельный список без forcing `accepted`.

## 9. Cursor Intake Guidance

После получения заполненного pack Cursor может:

- выполнить structural validation;
- проверить completeness required fields;
- обнаружить duplicate/conflicting rows;
- разделить наборы на `accepted/manual_review/excluded`;
- подготовить bounded execution-slice prep artifact.

Cursor не должен:

- invent data;
- auto-approve district mappings;
- auto-generate coordinates;
- silently normalize ambiguous rows.

## 10. Minimal First Batch Guidance

Первый Atlas batch должен быть минимальным:

- только P0/P1 records;
- только low-ambiguity accepted cases;
- manual-review вынести отдельно;
- не включать весь список missing coords/атрибуций.

Цель первой партии:

- доказать управляемый execution path;
- не допустить scope explosion;
- подготовить повторяемый шаблон для последующих batches.

## 11. Example Mini-Template (Synthetic Only)

Ниже демонстрационный пример формата, не реальное решение.

| record_type | object_id_or_slug | country_slug | proposed_parent_type | proposed_parent_id_or_slug | city_slug | proposed_district_slug | proposed_district_name | container_place_id_or_slug | current_lat | current_lng | approved_lat | approved_lng | issue_class | decision_status | evidence_note | human_reason | approved_by | approval_date |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| district_decision | district-example-01 | country-a | city | city-a | city-a | district-alpha | District Alpha |  |  |  |  |  | district_strategy | accepted | priority zone policy | district needed for target zone | user_owner | 2026-03-24 |
| place_coordinate_enrichment | place-example-11 | country-a |  |  | city-a |  |  | place-container-01 |  |  | 13.123456 | 100.123456 | missing_place_coords | accepted | verified map source | high-impact map card blocker | user_owner | 2026-03-24 |
| manual_review | place-example-22 | country-b | city | city-b | city-b | district-beta | District Beta |  |  |  |  |  | ambiguous_attribution | manual_review | conflicting district hints | requires local domain decision | user_owner | 2026-03-24 |
| place_to_district | place-example-33 | country-c | city | city-c | city-c | district-gamma | District Gamma | place-container-02 |  |  |  |  | non_blocking_case | excluded | deferred this cycle | out of first batch scope | user_owner | 2026-03-24 |

## 12. Recommended Next Handoff

1. Пользователь:
   - заполняет Atlas enrichment input pack по этой спецификации;
   - подписывает `accepted` решения (`approved_by/approval_date`).
2. Cursor:
   - делает intake validation note;
   - формирует execution-ready candidate subset для Atlas slice.
3. Следующий логичный документ:
   - `docs/plans/go2asia_atlas_canon_alignment_execution_slice_1_v1.md` (recommended).

После этого можно переходить к bounded Atlas execution slice prep (still gated), а затем — к return-to-Pulse gate по execution plan.

## 13. Non-Execution Confirmation

Этот документ:

- не выполняет alignment;
- не генерирует реальные mappings/coodinates автоматически;
- не запускает correction/migration;
- не расширяет scope на Pulse/downstream execution.

