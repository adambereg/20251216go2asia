# Go2Asia Wave A Atlas/Pulse Bounded Correction Plan v1

Status: draft for human review (no execution)  
Date: 2026-03-24  
Based on: live Neon data audit verdict

## 1. Purpose

Этот документ фиксирует **bounded correction plan** для Atlas/Pulse после live audit.

Он нужен, чтобы:

- не переходить к implementation вслепую;
- ограничить correction scope до реально необходимых для Wave A действий;
- избежать giant migration перед `WA-004` / `WA-005`.

Это не correction execution и не SQL patch set.

## 2. Inputs and Evidence Base

Primary evidence:

- `docs/plans/go2asia_atlas_pulse_blog_live_data_audit_v1.md`

Secondary baseline:

- `docs/plans/go2asia_wave_a_neon_ontology_subset_v1.md`
- `docs/plans/go2asia_wave_a_atlas_pulse_curated_input_pack_v1.md`
- `docs/plans/go2asia_wave_a_execution_queue_v1.md`
- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`

Supporting repo context:

- `packages/db/src/schema/**`
- `packages/db/migrations/**`
- `packages/db/src/import*.ts`
- `packages/db/src/export*.ts`
- `packages/db/src/queries/**`

## 3. Correction Principles

1. **Bounded, not total:** исправляем только то, что блокирует Atlas/Pulse refresh в Wave A.
2. **No giant migration:** глобальный backfill/legacy purge не запускается в этом цикле.
3. **Bridge-compatible first:** сохраняем рабочий bridge, не ломаем текущую операционную модель.
4. **Identity discipline:** при duplicate event slugs primary identity = `events.id`, не slug-only.
5. **Operational time truth:** для Wave A canonical read rule — `start_at/end_at`.
6. **No auto-invent:** неоднозначные `city`/FK mappings не назначаются автоматически.
7. **Human-confirmed ambiguity:** спорные случаи идут в manual review через curated pack.
8. **Blog scope guard:** Blog не расширяет correction scope до Atlas/Pulse-level migration.

## 4. Correction Scope

### 4.1 Must-fix before WA-004 / WA-005

- `events` semantic drift policy:
  - явное правило интерпретации `country_slug/city_slug` vs `country_id/city_id`;
  - фиксация accepted/flagged/manual states для event geo links.
- P0 events с `city_id IS NULL` и blocking impact для target Wave A surfaces.
- Детерминированное правило чтения времени (`start_at/end_at`) для Pulse integration paths.
- High-impact `places` без `lat/lng` только там, где это блокирует visible Wave A map/list/detail surfaces.

### 4.2 Should-fix in Wave A if affordable

- P1 event-city mapping corrections (не блокирующие core refresh, но уменьшающие ambiguity).
- Приоритетный alias/mapping cleanup для city resolution (через curated input, без auto-fill).
- Уточнение policy по duplicate `events.slug` в downstream consumption (routing/filtering guardrails).

### 4.3 Bridge-acceptable debt for one cycle

- Частичная `events.city_id` nullability (если slug-level refs валидны и не блокируют target views).
- Legacy dual fields в schema при явном canonical read-rule (без массового удаления).
- Неполная карта city-mapping automation (manual-review остаётся допустимым).
- Неполная geo enrichment вне P0/P1 buckets.

### 4.4 Explicitly out of scope

- Global FK backfill всех historical событий.
- Полная очистка legacy колонок по всем таблицам.
- Полный rollout city_mapping platform across all domains.
- Полный historical cleanup всех event duplicates/cross-country seasonal variants.
- Blog geotarget redesign как отдельная программа.
- Corrections для RF/Quest/Space/Rielt beyond narrow Atlas/Pulse dependencies.

## 5. Correction Buckets

### Bucket A — Event geo identity corrections

- **Covers:** event-level `country_slug/city_slug` and FK mapping conflicts (P0 first).
- **Why needed:** это primary correction target по live audit.
- **Source of truth:** live audit + WA-002 curated pack + Wave A subset invariants.
- **Human input required:** yes (для ambiguous and unresolved cases).
- **Blocks WA-004/WA-005:** блокирует `WA-005` напрямую; частично влияет на `WA-004` через cross-context.
- **Risk level:** high.

### Bucket B — Event time truth normalization (operational rule)

- **Covers:** закрепление read-rule `start_at/end_at` vs legacy date fields.
- **Why needed:** dual-time активен на всех 208 events; без правила высокий риск drift.
- **Source of truth:** live audit + subset rule (`start_at/end_at` preferred).
- **Human input required:** mostly no, except edge cases with contradictory values.
- **Blocks WA-004/WA-005:** блокирует `WA-005` readiness consistency.
- **Risk level:** medium-high.

### Bucket C — High-impact place coordinate corrections

- **Covers:** subset places без `lat/lng`, только если это блокирует target screens.
- **Why needed:** 20 place rows без новых координат.
- **Source of truth:** live audit + module-level visibility impact.
- **Human input required:** yes for authoritative coordinates.
- **Blocks WA-004/WA-005:** блокирует mainly `WA-004` (Atlas map-first surfaces).
- **Risk level:** medium.

### Bucket D — Duplicate slug handling policy

- **Covers:** практическая policy для event duplicate slug groups.
- **Why needed:** 7 duplicate groups; slug-only strategy небезопасна.
- **Source of truth:** live audit duplicates + integration requirements.
- **Human input required:** yes for external-facing canonical URL rules where needed.
- **Blocks WA-004/WA-005:** indirectly blocks stable `WA-005` routing/filter assumptions.
- **Risk level:** medium.

### Bucket E — Manual-review mapping cases

- **Covers:** unresolved mappings, conflicting evidence, low-confidence alias hints.
- **Why needed:** запрещено auto-invent в Wave A.
- **Source of truth:** WA-002 intake states (`manual_review`, `flagged`).
- **Human input required:** mandatory.
- **Blocks WA-004/WA-005:** блокирует только affected records; не должен блокировать весь wave scope.
- **Risk level:** high (if skipped).

## 6. Manual Review Requirements

Автоматически не исправлять:

- неоднозначные `city_slug -> city_id` соответствия;
- случаи, где slug и FK указывают на разные geo identities;
- duplicate slug routing decisions с user-facing последствиями;
- event date/time conflicts без подтвержденного источника;
- place coordinates без надежного source evidence.

Обязательная human-confirmed review для:

- всех `manual_review` записей из curated pack;
- P0/P1 ambiguous events;
- low-confidence mapping hints;
- canonical override решений (если меняют публичную интерпретацию данных).

## 7. Dependencies on User-Prepared Input

Требуют curated input pack (WA-002):

- Bucket A (critical subset events)
- Bucket C (authoritative place coordinates)
- Bucket D/E (alias/duplicate/mapping ambiguities)

Cursor может делать без нового user input:

- структурную классификацию уже известных конфликтов;
- применение agreed read-rule policy в correction plan artifacts;
- группировку non-ambiguous records по priority buckets.

Cursor может работать только после human input:

- любые ambiguous mapping decisions;
- любые coordinate/geo overrides без достоверного источника;
- any record moving from flagged/manual_review to accepted.

## 8. Practical Execution Slicing (Planning Only)

### Slice 1 (first)

- Finalize Bucket A scope (P0 event mappings) + Bucket B operational time rule.
- Output: approved P0/P1 event correction set for execution planning.

### Slice 2 (parallel-capable)

- Bucket C high-impact place coordinate subset.
- Bucket D duplicate slug handling policy draft.

### Slice 3 (gated)

- Bucket E manual-review closure for unresolved records.
- Output: approved unresolved decisions log.

### Blocking logic

- `WA-005` blocked by unresolved Bucket A/B P0 items.
- `WA-004` blocked only by Bucket C records affecting target Atlas surfaces.
- Non-critical unresolved items can remain bridge debt if explicitly documented.

### Post-Wave-A candidates

- broad legacy cleanup;
- non-critical enrichment;
- global mapping automation.

## 9. Success Criteria for Correction Phase

Correction phase считается достаточной (для перехода к refresh), если:

1. P0 event geo ambiguities закрыты или переведены в explicit non-blocking states.
2. Operational time truth rule (`start_at/end_at`) принята и применима для target flows.
3. High-impact place coordinate blockers для Atlas surfaces закрыты.
4. Duplicate slug handling policy зафиксирована для integration usage.
5. Manual-review список сокращен до non-blocking остатка с явным статусом.
6. Scope остаётся bounded (без перехода к global migration задачам).

## 10. Risks and Safeguards

### 10.1 Risks

- correction scope расползётся в giant migration;
- Cursor/automation начнет «додумывать» city mappings;
- duplicate slugs приведут к неверной slug-only интеграции;
- dual fields спровоцируют ненужный full cleanup;
- Blog будет ошибочно включен как primary correction driver.

### 10.2 Safeguards

- strict bucket gating: только A/B/C/D/E в рамках этого плана;
- mandatory human review для ambiguous records;
- `events.id` first policy for identity-sensitive operations;
- explicit deferred list (bridge debt) на один цикл;
- no-write until bounded plan approved.

## 11. Recommended Next Handoff

1. **User confirmation required:**
   - утвердить buckets A-E и их приоритеты;
   - подтвердить manual-review policies;
   - подтвердить, какие P0/P1 records идут в первую execution партию.

2. **Cursor next after approval:**
   - подготовить отдельный implementation task set (execution-only, bounded),
   - без расширения scope beyond approved buckets.

3. **Wave linkage:**
   - после completion approved correction slice перейти к:
     - `WA-004` (Atlas first refresh integration),
     - `WA-005` (Pulse first refresh integration).

## 12. Non-Execution Confirmation

Этот документ:

- не содержит SQL fixes,
- не запускает миграции,
- не выполняет correction execution,
- служит только для human-reviewed bounded planning.

## 13. Files Used

- `docs/plans/go2asia_atlas_pulse_blog_live_data_audit_v1.md`
- `docs/plans/go2asia_wave_a_neon_ontology_subset_v1.md`
- `docs/plans/go2asia_wave_a_atlas_pulse_curated_input_pack_v1.md`
- `docs/plans/go2asia_wave_a_execution_queue_v1.md`
- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`
- `packages/db/src/schema/**`
- `packages/db/migrations/**`
- `packages/db/src/import*.ts`
- `packages/db/src/export*.ts`
- `packages/db/src/queries/**`
