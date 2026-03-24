# Go2Asia Wave A Atlas/Pulse Correction Execution Slice 1 Runbook v1

Status: pre-execution runbook (no execution)  
Date: 2026-03-24  
Scope: bounded correction slice 1 operational procedure

## 1. Purpose

Этот runbook описывает, как безопасно подготовить и провести bounded correction slice 1 после human approval.

Зачем он нужен:

- не запускать correction prematurely;
- не допустить scope explosion;
- сохранить bridge-compatible режим Wave A;
- зафиксировать проверяемый pre-run и post-run контур.

Runbook связан с:

- `docs/plans/go2asia_wave_a_atlas_pulse_correction_execution_slice_1_v1.md`;
- `docs/plans/go2asia_wave_a_atlas_pulse_bounded_correction_plan_v1.md`;
- `docs/plans/go2asia_atlas_pulse_blog_live_data_audit_v1.md`.

## 2. Preconditions

Перед любым correction run должно быть подтверждено:

1. Human approval slice 1 получен.
2. P0/P1 scope утвержден и зафиксирован.
3. Manual-review boundaries утверждены.
4. Curated input pack (WA-002) подготовлен и принят в intake.
5. Target environment явно идентифицирован (host/db/schema/branch-context).
6. Перед run собраны baseline snapshots/exports и before-state metrics.
7. Команда явно различает read-only подготовку и write-run.
8. Out-of-scope список подтвержден и заморожен.

Без этих условий correction run запрещен.

## 3. Non-Execution Posture of This Document

Этот документ:

- ничего не запускает;
- не содержит SQL patch;
- не заменяет operator approval;
- не дает разрешение на запись в БД сам по себе.

Это procedural guardrail, а не script.

## 4. Run Preparation Checklist

Перед будущим run оператор обязан подготовить:

### 4.1 Data safeguards

- pre-run export/snapshot для затрагиваемых таблиц и подмножеств;
- фиксированный список target record IDs (freeze set);
- отдельный список manual-review cases (excluded from auto-run).

### 4.2 Before-state metrics (обязательная фиксация)

- row counts по `countries/cities/places/events/blog_posts`;
- `events`:
  - количество city-null rows в scope;
  - slug/FK conflict metrics для scope;
  - duplicate slug group impact for scoped IDs;
- `places`:
  - количество blocking rows без `lat/lng` в scoped subset;
- reference integrity baseline:
  - broken refs/mismatch counts (`cities->countries`, `places->cities/countries`, `events->countries/cities`).

### 4.3 Environment checks

- подтверждение target DB/schema;
- подтверждение, что run направлен только в approved staging target;
- подтверждение, что используемые tooling/scripts соответствуют текущему repo baseline.

### 4.4 Read-only verification tools allowed pre-run

- schema/table introspection;
- SELECT-only validation queries;
- export/diff preparation;
- dry-run preview generation (если есть реализация позже).

## 5. Approved Correction Scope for Slice 1

Разрешено в slice 1 (после approval):

- Bucket A (узкий P0/P1 event geo correction scope);
- Bucket B (operational time truth normalization rule application);
- Bucket E (manual-review queue enforcement, не auto-resolution);
- guardrails по duplicate slug handling (`events.id` identity-first).

Не разрешено:

- массовый correction за пределами approved P0/P1 scope;
- correction non-target buckets;
- global backfill/legacy cleanup;
- правки non-target модулей.

Требует отдельного подтверждения:

- любые ambiguous mappings;
- любые canonical overrides с user-facing последствиями;
- любые scope additions.

## 6. Dry-Run / Preview Expectations

До любого write-run должны быть доступны preview материалы:

1. Planned scope list (по ID) с разбивкой: accepted / flagged / manual.
2. Proposed effect summary:
   - сколько records планируется затронуть;
   - какие поля затрагиваются;
   - какие records исключены как out-of-scope.
3. Conflict preview:
   - ambiguous mappings;
   - duplicate slug sensitive cases;
   - unresolved time conflicts.
4. Operator review sheet:
   - approve / reject / escalate per batch.

Blocker preview conditions:

- нефиксированный scope;
- смешение approved и manual-only records;
- отсутствие before-state baseline;
- невозможность показать ожидаемый change-impact в границах slice 1.

## 7. Manual Review Gate

Автоматически не запускать:

- ambiguous `city_slug -> city_id`;
- slug/FK conflicts with competing geo identities;
- duplicate slug canonicalization decisions;
- event time conflict resolution without confirmed source;
- coordinate overrides без подтвержденного input.

Только manual-review queue:

- `manual_review` и `flagged` записи из intake;
- low-confidence mapping hints;
- records с potential cross-module side effects.

Пользователь подтверждает:

- финальный manual-resolution decisions set;
- что именно переводится в `accepted` для run.

## 8. Execution Safety Rules

Во время будущего run обязательно:

1. No scope expansion during run.
2. No touching out-of-scope records.
3. No correction outside approved buckets.
4. No auto-created entities.
5. No silent slug/FK synthesis.
6. No opportunistic cleanup unrelated legacy fields.
7. No mixing correction execution with refresh/render workstreams.
8. Любой uncertain case => stop and escalate to manual review.

## 9. Post-Run Verification Checklist

После будущего run должно быть проверено:

### 9.1 Expected improvements

- снижение P0/P1 ambiguous event cases;
- снижение scoped slug/FK conflict counts;
- улучшение time-read consistency для target events;
- подтверждение identity-first (`events.id`) handling в correction outputs.

### 9.2 Must-not-regress checks

- reference integrity не ухудшилась;
- нет роста broken references;
- `places` вне scoped subset не изменены;
- `blog_posts` не затронуты unintended-effects;
- non-target modules не получили побочных data-changes.

### 9.3 Verification artifacts

- before/after metrics report;
- list of changed IDs (только scoped set);
- list of skipped/escalated records.

## 10. Stop Conditions / Abort Criteria

Run должен быть остановлен немедленно, если:

1. Обнаружено касание out-of-scope IDs.
2. Изменения пытаются затронуть non-approved buckets.
3. Preview и фактический effect расходятся по объему/полям.
4. Появились unapproved entity creations.
5. Нельзя доказать before/after traceability.
6. Появились новые ambiguous conflicts без manual decision.
7. Есть риск затронуть Blog или несвязанные контуры.

После abort:

- run прекращается;
- фиксируется incident note;
- возврат к human review и scope re-approval обязателен.

## 11. Outputs of a Successful Slice 1 Run

Успешный результат (когда run позже будет реально выполнен) включает:

- bounded correction в пределах утвержденного slice 1 scope;
- подтвержденные before/after verification artifacts;
- обновленный status по slice 1 tasks (`APC-S1-*`) с evidence;
- явный список deferred/manual-only residuals.

После выполнения должен быть обновлен минимум один follow-up artifact:

- `docs/plans/go2asia_wave_a_atlas_pulse_correction_execution_slice_1_result_v1.md` (recommended).

## 12. Recommended Next Handoff

После утверждения этого runbook:

1. Пользователь подтверждает:
   - final scope freeze list;
   - manual-review decisions;
   - operator readiness на staging target.
2. Cursor готовит:
   - operator-ready checklist (короткий pre-flight);
   - verification template for before/after evidence capture.
3. Только после этого возможен отдельный explicit запрос на correction execution.

Этот runbook достаточен как procedural baseline для подготовки реального bounded execution, но не заменяет отдельный explicit go-ahead на write-run.

## 13. Explicit Non-Goals

- не выполнить correction;
- не генерировать SQL patch set;
- не покрывать slice 2/3;
- не пересобирать всю data strategy;
- не расширять approved slice 1.

## 14. Files Used

- `docs/plans/go2asia_wave_a_atlas_pulse_correction_execution_slice_1_v1.md`
- `docs/plans/go2asia_wave_a_atlas_pulse_bounded_correction_plan_v1.md`
- `docs/plans/go2asia_atlas_pulse_blog_live_data_audit_v1.md`
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
