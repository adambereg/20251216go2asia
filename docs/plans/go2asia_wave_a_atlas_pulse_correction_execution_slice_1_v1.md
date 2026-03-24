# Go2Asia Wave A Atlas/Pulse Correction Execution Slice 1 v1

Status: execution-only task set (pre-implementation)  
Date: 2026-03-24  
Scope: first bounded correction party for Atlas/Pulse

## 1. Purpose

Этот документ переводит bounded correction plan в **первую практическую correction-партию (slice 1)**.

Задача slice 1:

- начать correction по самому критичному и низкорисковому минимуму;
- не включать весь correction plan сразу;
- подготовить безопасный старт для последующего execution шага без scope explosion.

Это не execution изменений и не SQL patch set.

## 2. Slice 1 Selection Logic

В slice 1 включены задачи, которые одновременно дают:

- максимальный эффект для `WA-004/WA-005`,
- минимальный риск,
- низкую неоднозначность,
- bounded scope без giant migration поведения.

Критерии отбора:

1. **Max impact on Wave A:** сначала блокеры Pulse/Atlas refresh.
2. **Min risk:** policy/gating и P0 boundary раньше массовых коррекций.
3. **Low ambiguity:** спорные mapping решения не автоматизируются.
4. **Manual-review fit:** ambiguous кейсы остаются в ручной очереди.
5. **Bounded scope:** только first party, без global cleanup.

## 3. Included Scope in Slice 1

В первую партию входят:

- узкий поднабор Bucket A (event geo identity) только на уровне P0/P1 selection boundary;
- Bucket B в части operational time truth rule (`start_at/end_at`) для target flows;
- подготовка manual-review queue как обязательного gating механизма;
- policy-level guard для duplicate slug usage (`events.id` first) без deep redesign;
- pre/post verification рамка для будущего execution.

## 4. Excluded Scope from Slice 1

Из первой партии исключено:

- массовая коррекция `places` coordinate gaps (кроме классификации blocking subset);
- полный duplicate slug policy rollout во всех consumers;
- closure manual-review backlog (это later slice);
- глобальный FK backfill и total legacy cleanup;
- city-mapping platform rollout beyond narrow event needs;
- любые corrections для RF/Quest/Space/Rielt beyond narrow dependencies;
- Blog geotarget redesign.

## 5. Execution Tasks

### APC-S1-001

- **Title:** Freeze slice-1 correction boundary for events
- **Bucket:** A
- **Why included now:** primary correction target по live audit, без этого scope расползается.
- **Dependency:** approved bounded correction plan
- **Input source:** live audit verdict + WA-001/WA-002 docs
- **Owner type:** Shared
- **Expected output:** согласованный P0/P1 boundary list для event corrections
- **Done when:** зафиксирован список in-scope event cases и explicit out-of-scope остаток
- **Risk level:** low
- **Requires manual confirmation:** yes

### APC-S1-002

- **Title:** Operational time truth rule lock (`start_at/end_at`)
- **Bucket:** B
- **Why included now:** dual-time active на всех событиях; нужен deterministic read-rule перед refresh.
- **Dependency:** APC-S1-001
- **Input source:** live audit + subset invariants
- **Owner type:** Shared
- **Expected output:** утвержденная time-read policy для correction execution and verification
- **Done when:** правило принято и edge-case handling route определен (manual for ambiguous)
- **Risk level:** low
- **Requires manual confirmation:** yes

### APC-S1-003

- **Title:** Slug/FK interpretation policy for event geo
- **Bucket:** A
- **Why included now:** ключевой semantic drift blocker перед WA-005.
- **Dependency:** APC-S1-001
- **Input source:** live audit consistency findings + curated pack spec
- **Owner type:** Shared
- **Expected output:** accepted/flagged/manual decision model для event geo links
- **Done when:** policy утверждена и применима к P0/P1 cases
- **Risk level:** medium
- **Requires manual confirmation:** yes

### APC-S1-004

- **Title:** Manual-review queue bootstrap for ambiguous mappings
- **Bucket:** E
- **Why included now:** предотвращает auto-invent corrections в первой партии.
- **Dependency:** APC-S1-003
- **Input source:** WA-002 record types and validation states
- **Owner type:** Shared
- **Expected output:** formalized queue of manual-only cases (no auto execution)
- **Done when:** ambiguous cases выделены и помечены как non-auto executable
- **Risk level:** low
- **Requires manual confirmation:** yes

### APC-S1-005

- **Title:** High-impact place coord subset classification (non-execution)
- **Bucket:** C
- **Why included now:** нужно понять, какие `places` gaps реально блокируют Atlas surfaces.
- **Dependency:** APC-S1-001
- **Input source:** live audit (`places` without `lat/lng`) + target screen map
- **Owner type:** Cursor
- **Expected output:** blocking vs non-blocking subset list for later correction slice
- **Done when:** определен минимальный blocking subset without applying corrections
- **Risk level:** low
- **Requires manual confirmation:** no

### APC-S1-006

- **Title:** Duplicate slug guardrail for slice-1 identity handling
- **Bucket:** D
- **Why included now:** избегаем slug-only ошибок до глубокой duplicate policy phase.
- **Dependency:** APC-S1-003
- **Input source:** live audit duplicate groups
- **Owner type:** Shared
- **Expected output:** slice-1 guardrail: event identity uses `events.id` in correction workflows
- **Done when:** guardrail зафиксирован как обязательный для execution stage
- **Risk level:** low
- **Requires manual confirmation:** yes

### APC-S1-007

- **Title:** Slice-1 pre-execution readiness pack
- **Bucket:** Cross-bucket
- **Why included now:** без readiness pack execution может начаться преждевременно.
- **Dependency:** APC-S1-001..APC-S1-006
- **Input source:** this slice document + bounded plan + curated pack spec
- **Owner type:** Cursor
- **Expected output:** ready-to-execute checklist + blocked items list (still no corrections)
- **Done when:** команда видит, что именно можно запускать, а что остается gated
- **Risk level:** low
- **Requires manual confirmation:** yes

## 6. Manual-Review Boundary

Не входят в auto-execution slice 1:

- ambiguous `city_slug -> city_id` cases;
- slug/FK pairs with conflicting geo identity;
- спорные event date/time corrections без подтвержденного источника;
- duplicate slug canonicalization decisions с внешним user-facing эффектом;
- low-confidence alias/mapping hints.

Эти кейсы остаются в manual-review queue до user confirmation.

## 7. Recommended Execution Order Inside Slice 1

### Order

1. APC-S1-001 (scope boundary)  
2. APC-S1-002 (time rule lock)  
3. APC-S1-003 (slug/FK policy)  
4. APC-S1-004 (manual queue bootstrap)  
5. APC-S1-005 (place blocking subset classification)  
6. APC-S1-006 (duplicate slug guardrail)  
7. APC-S1-007 (readiness pack)

### Parallelizable

- APC-S1-005 можно выполнять параллельно после APC-S1-001.

### Hard dependencies

- APC-S1-003 без APC-S1-001 нельзя.
- APC-S1-004/006 зависят от APC-S1-003.
- APC-S1-007 закрывается только после всех предыдущих.

## 8. Pre-Execution Checks (Do Not Execute Now)

Перед реальным correction execution должны быть готовы:

1. Проверка, что live context не изменился (same DB/schema/read-only baseline snapshot).
2. Согласованный P0/P1 список event cases (human-approved).
3. Manual-review queue с явными blocked cases.
4. Guardrail rule: `events.id` identity-first policy подтверждена.
5. Verification query checklist для:
   - city-null subset impact,
   - slug/FK conflict subset,
   - target place coord blocking subset.
6. Export/backup readiness expectations (логический план отката/сравнения) — без запуска сейчас.

## 9. Post-Execution Verification Expectations

После будущего выполнения slice 1 должно быть проверено:

- уменьшение P0 ambiguous event cases;
- отсутствие regressions в FK integrity (`broken refs` не выросли);
- стабильность time-read behavior на target Pulse flows;
- отсутствие slug-only identity regressions (ID-first policy соблюдена);
- `places` blocking subset статус прозрачен (исправлено или явно отложено).

## 10. Explicit Non-Goals

- slice 1 не закрывает весь bounded correction plan;
- slice 1 не исправляет все event issues;
- slice 1 не делает full FK backfill;
- slice 1 не чистит все legacy fields;
- slice 1 не выполняет full Blog/Rielt/RF/Quest alignment;
- slice 1 не выполняет correction execution в этом документе.

## 11. Recommended Next Handoff

Перед execution пользователь подтверждает:

- P0/P1 boundary list;
- manual-review policy;
- что включено/исключено из первой партии.

После подтверждения Cursor делает:

1. отдельный **execution artifact** (dry-run oriented task/procedure set),
2. verification checklist document для run-phase,
3. только затем старт bounded correction execution.

Следующий документ перед реальным execution:

- `go2asia_wave_a_atlas_pulse_correction_execution_slice_1_runbook_v1.md` (recommended)

## 12. Files Used

- `docs/plans/go2asia_atlas_pulse_blog_live_data_audit_v1.md`
- `docs/plans/go2asia_wave_a_atlas_pulse_bounded_correction_plan_v1.md`
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
