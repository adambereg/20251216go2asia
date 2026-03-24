# Go2Asia Slice 1 Accepted Write Set Template v1

Status: operator/user-facing template (non-execution)  
Date: 2026-03-24  
Scope: bounded correction slice 1 (Atlas/Pulse, event-centric)

## 1. Purpose

Этот шаблон нужен, чтобы вручную зафиксировать **явный approved ID-level write set** для slice 1.

Почему это критично:

- прошлый run был aborted из-за отсутствия явного `accepted` write list;
- без такого списка Cursor не может безопасно запускать bounded write-run.

Этот документ используется перед следующим preflight/go-no-go шагом.

## 2. What This Template Is For

- Это **human-approved write list**.
- Только записи со статусом `accepted` могут попасть в write-run.
- Статусы `manual_review` и `excluded` не должны попадать в auto-run.

## 3. Record Scope

Текущий шаблон ориентирован прежде всего на `events`, потому что slice 1 event-centric.

Дополнительно:

- `places` и другие контуры не являются primary target этого accepted set;
- их можно добавлять только при отдельном явном approval в рамках slice 1 boundary.

## 4. Recommended Template Structure

Ниже минимально рекомендуемая таблица для ручного заполнения.

| record_type | event_id | source_path_or_slug | current_country_slug | current_city_slug | current_country_id | current_city_id | current_start_at | current_end_at | current_start_date | current_end_date | issue_class | approved_action | approved_target_country_slug | approved_target_city_slug | approved_target_country_id | approved_target_city_id | approved_target_start_at | approved_target_end_at | decision_status | human_reason | evidence_note | approved_by | approval_date |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | accepted/manual_review/excluded |  |  |  |  |

### Optional fields

Поля `approved_target_*` заполняются только если они действительно нужны для выбранного `approved_action`.  
Если действие не меняет time/FK/slug, соответствующие target-поля можно оставить пустыми.

## 5. Decision Statuses

- `accepted`  
  Запись явно утверждена человеком для write-run.

- `manual_review`  
  Нужна дополнительная доменная проверка; в write-run не идет.

- `excluded`  
  Сознательно оставлена вне slice 1; в write-run не идет.

Правило запуска: в write set для run попадают только строки с `decision_status=accepted`.

## 6. Approved Action Types (Slice 1)

Допустимые типы действий в рамках slice 1:

- `set_city_id`
- `set_country_id`
- `align_slug_and_fk`
- `set_start_at_end_at`
- `clear_invalid_fk`
- `exclude_from_slice_1`

Важно:

- action type выбирается вручную человеком;
- действие должно соответствовать bounded plan/runbook;
- если кейс спорный, ставится `manual_review`, а не forcing `accepted`.

## 7. How User Should Fill It (Practical Steps)

1. Сформировать небольшой кандидатный набор (`events`) только из P0/P1 slice 1.
2. Для каждой записи зафиксировать current-state (`current_*` поля).
3. Определить `issue_class` (например: city_fk_missing, slug_fk_conflict, time_alignment_needed).
4. Выбрать `approved_action` только из разрешенного списка.
5. Проставить `decision_status`:
   - `accepted` только для low-ambiguity cases с понятным target;
   - `manual_review` для любых неоднозначностей;
   - `excluded` для кейсов вне текущего микробатча.
6. Заполнить `human_reason` и `evidence_note` (почему решение безопасно и на чем основано).
7. Указать `approved_by` и `approval_date`.

## 8. What Must Never Be Auto-Filled by Cursor

Cursor не должен:

- самостоятельно решать ambiguous mapping;
- самостоятельно переводить запись в `accepted`;
- придумывать target FK/time values;
- автоматически делать доменные решения вместо пользователя.

Cursor может после заполнения только валидировать структуру и согласованность набора.

## 9. Validation Expectations After Template Is Filled

После заполнения шаблона Cursor может выполнить только pre-run validation:

- structural validation (все обязательные поля и форматы);
- completeness check (есть `approved_by`, `approval_date`, `human_reason`);
- duplicate/conflict detection внутри шаблона;
- segregation: `accepted` отдельно от `manual_review`/`excluded`;
- подготовку safe preflight summary для следующей попытки run.

Без execution corrections на этом этапе.

## 10. Minimal First Batch Guidance

Рекомендованный первый accepted batch:

- маленький и управляемый;
- только P0/P1;
- только low-ambiguity cases;
- не пытаться сразу закрыть все `city-null`/`slug-FK` конфликты.

Принцип: лучше 5-15 четко утвержденных записей, чем большой и спорный набор.

## 11. Example Mini-Template (Synthetic Only)

Пример ниже демонстрационный, не является real approval и не отражает live решения.

| record_type | event_id | source_path_or_slug | current_country_slug | current_city_slug | current_country_id | current_city_id | current_start_at | current_end_at | current_start_date | current_end_date | issue_class | approved_action | approved_target_country_slug | approved_target_city_slug | approved_target_country_id | approved_target_city_id | approved_target_start_at | approved_target_end_at | decision_status | human_reason | evidence_note | approved_by | approval_date |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| event | ev-example-001 | pulse/example-a | country-a | city-a | ca |  | 2026-07-01T00:00:00Z | 2026-07-01T23:59:59Z | 2026-07-01T00:00:00Z | 2026-07-01T23:59:59Z | city_fk_missing | set_city_id | country-a | city-a | ca | cty-a |  |  | accepted | mapping подтвержден вручную | source: curated pack row #12 | user_owner | 2026-03-24 |
| event | ev-example-002 | pulse/example-b | country-b | city-b | cb |  | 2026-08-10T00:00:00Z | 2026-08-10T23:59:59Z | 2026-08-09T17:00:00Z | 2026-08-10T16:59:59Z | slug_fk_conflict | align_slug_and_fk | country-b | city-b | cb |  |  |  | manual_review | конфликт требует доп. решения | conflicting evidence in mapping notes | user_owner | 2026-03-24 |
| event | ev-example-003 | pulse/example-c | country-c | city-c | cc | cty-c | 2026-09-05T00:00:00Z | 2026-09-05T23:59:59Z | 2026-09-05T00:00:00Z | 2026-09-05T23:59:59Z | non_blocking_case | exclude_from_slice_1 |  |  |  |  |  |  | excluded | не блокирует текущий slice | deferred by operator | user_owner | 2026-03-24 |

## 12. Recommended Next Handoff

1. Пользователь:
   - копирует шаблон;
   - заполняет first accepted batch;
   - подписывает `approved_by/approval_date`.
2. Cursor:
   - выполняет только validation шаблона;
   - формирует preflight-ready summary (`accepted` vs `manual_review` vs `excluded`).
3. Перед повторным write-run:
   - обновить preflight checklist;
   - подтвердить GO/NO-GO;
   - запускать run только после явного human approval на конкретный заполненный write set.

## 13. Non-Execution Confirmation

Этот документ:

- не запускает correction;
- не содержит SQL;
- не выбирает реальные approved IDs автоматически;
- не расширяет slice 1.

