# Go2Asia Atlas Canon Alignment Plan v1

Status: alignment planning artifact (non-execution)  
Date: 2026-03-24  
Scope: Atlas-only canonical alignment, bounded for current cycle

## 1. Purpose

Этот документ фиксирует практический план приведения Atlas к `Geo_Canon_v1.md` в рамках текущего цикла без giant migration.

Почему это нужно сейчас:

- conformance report подтвердил, что Atlas usable, но не fully canonical;
- продолжение Pulse/downstream как primary line без Atlas alignment повышает риск propagation geo-debt;
- нужен Atlas-first baseline, после которого можно безопаснее возвращаться к Pulse alignment.

Это не correction execution, не SQL patch set и не миграционный runbook.

## 2. Canon Baseline and Conformance Baseline

### Target contract

- `docs/architecture/Geo_Canon_v1.md` — целевой geo contract:
  - `Country -> City -> District -> Place -> Coordinates`,
  - stable IDs as identity,
  - slugs for routing,
  - bridge-compatible state допустим как временное отклонение.

### Current conformance baseline

- `docs/plans/go2asia_atlas_geo_canon_conformance_report_v1.md`:
  - Country/City: strong;
  - Place: partially conformant;
  - District: does not yet conform (first-class layer отсутствует);
  - Coordinates: bridge-compatible only из-за subset gaps.

План строится как разница между target contract и текущим conformance state.

## 3. Alignment Principles

1. Atlas уже usable foundation, не broken domain.
2. Alignment bounded, staged, execution-cycle realistic.
3. Structural gaps first, decorative maturity later.
4. District strategy фиксируется явно, не оставляется implicit.
5. Place coordinate completion — targeted by impact, не indiscriminate.
6. Bridge-compatible state допустим, если gap не блокирует текущий execution path.
7. No giant migration и no forced full-perfection gate.
8. Atlas alignment не смешивается с Pulse correction execution.

## 4. Alignment Scope

### 4.1 Must-align for Atlas foundation

- Явно зафиксировать District strategy (canonical target + staged adoption posture).
- Закрыть high-impact place coordinate gaps для Atlas map/nearby critical surfaces.
- Уточнить минимальный canonical Place contract для current cycle:
  - stable `id/slug`,
  - required `country_id/city_id`,
  - coords policy и debt marking для missing coords.
- Зафиксировать Atlas bridge-debt registry как управляемый список, а не implicit drift.

### 4.2 Should-align in current cycle if affordable

- Ограниченный district enrichment subset для наиболее критичных city clusters.
- Ограниченные place normalization improvements (non-breaking).
- Минимальный governance-aligned metadata seam (только если полезен для контроля debt).

### 4.3 Bridge-acceptable debt (one cycle)

- Частичное отсутствие district attribution в non-critical legacy records.
- Non-blocking place coordinate gaps вне high-impact subset.
- Не полный rollout canon metadata fields across all Atlas entities.
- Неполная district-depth coverage в странах/городах с низким near-term impact.

### 4.4 Explicitly out of scope

- Full district enrichment across all countries/cities.
- Total historical cleanup for every Atlas record.
- Giant metadata program as standalone initiative.
- Full downstream geo adoption across all modules в рамках этого шага.
- Pulse correction details и write-run procedures.
- Full Rielt/RF/Space/Quest geo alignment program.

## 5. Alignment Work Buckets

### Bucket A — District Layer Strategy and Model Decision

- **Objective:** закрепить, как District входит в Atlas canonical model в текущем цикле.
- **Why needed:** District — primary structural gap по conformance report.
- **Relation to Geo Canon:** покрывает first-class `District` requirement.
- **Downstream impact:** снижает ambiguity для Rielt/RF/Guru/Quest precision use cases.
- **User enrichment needed:** yes (domain-level district boundaries/priorities).
- **Implementation complexity:** medium/high (решение модели + staged scope).
- **Blocking effect:** блокирует full canonical readiness; не блокирует весь Wave A при staged bridge policy.

### Bucket B — High-Impact Place Coordinate Completion

- **Objective:** закрыть координатные gaps только там, где они реально бьют по Atlas-first surfaces.
- **Why needed:** live conformance gap по place coords.
- **Relation to Geo Canon:** покрывает coords policy at Place layer.
- **Downstream impact:** улучшает map/nearby consistency для Atlas и downstream projections.
- **User enrichment needed:** yes (authoritative coordinate sources for missing rows).
- **Implementation complexity:** medium.
- **Blocking effect:** high-impact subset блокирует Atlas map quality; non-critical subset можно оставить debt.

### Bucket C — Canonical Place Contract Tightening (Current Cycle)

- **Objective:** зафиксировать обязательный минимум Place contract для текущего цикла.
- **Why needed:** удержать consistency при bridge-compatible состоянии.
- **Relation to Geo Canon:** alignment with Place rules without full redesign.
- **Downstream impact:** снижает contract drift между Atlas и consumers.
- **User enrichment needed:** limited (только ambiguous attribution cases).
- **Implementation complexity:** medium.
- **Blocking effect:** не блокирует run entirely, но нужен до широкого downstream adoption.

### Bucket D — Atlas Bridge-Debt Registry

- **Objective:** сделать явный реестр canon-gap debt по Atlas.
- **Why needed:** bridge-compatible state должен быть управляемым, не скрытым.
- **Relation to Geo Canon:** соответствует rules on temporary bridge allowance.
- **Downstream impact:** делает sequencing честным и предсказуемым.
- **User enrichment needed:** no (кроме приоритизации severity).
- **Implementation complexity:** low.
- **Blocking effect:** governance blocker, если отсутствует.

### Bucket E — Canon Metadata Layer (Bounded)

- **Objective:** определить минимальный metadata seam только для governance utility.
- **Why needed:** полезно для tracking canonical/bridge states, но не primary structural driver.
- **Relation to Geo Canon:** partial alignment with metadata section.
- **Downstream impact:** low/medium (mainly governance observability).
- **User enrichment needed:** no (mostly policy/field strategy).
- **Implementation complexity:** low/medium.
- **Blocking effect:** не должен блокировать Atlas-first structural alignment.

## 6. User Enrichment Dependency

Что Cursor не должен выдумывать:

- district-level attribution decisions;
- canonical district naming when ambiguous;
- missing high-impact place coordinates без надежного источника;
- disputed place-to-district mappings.

Что требует human input в первую очередь:

1. District strategy inputs (где district precision действительно нужна first).
2. High-impact coordinates для missing place subset.
3. Ambiguous place-to-district classification.
4. Priority ranking по городам/странам для staged district rollout.

## 7. Atlas-First Sequencing

1. **S1: District decision frame (Bucket A)**  
   Зафиксировать explicit strategy: staged district adoption + priority zones.

2. **S2: High-impact coordinates subset (Bucket B)**  
   Закрыть координаты только для blocking Atlas surfaces.

3. **S3: Place contract tightening (Bucket C)**  
   Формализовать minimum canonical place contract на текущий цикл.

4. **S4: Bridge-debt registry activation (Bucket D)**  
   Явно зафиксировать remaining gaps и сроки пересмотра.

5. **S5: Optional bounded metadata seam (Bucket E)**  
   Только если не отвлекает от structural priorities.

Условие возврата к Pulse:

- после S1+S2 (минимум) и фиксации S3 posture можно возвращаться к Pulse flow на более чистой Atlas базе.

## 8. Wave A Interpretation

### Что желательно успеть в Wave A

- District strategy decision (policy/model level).
- High-impact place coordinate completion subset.
- Minimum place contract alignment notes.
- Atlas bridge-debt registry bootstrap.

### Что можно перенести дальше

- Wide district enrichment coverage.
- Full metadata maturity rollout.
- Non-critical coordinate cleanup.

### Влияние на `WA-004/WA-005`

- `WA-004` (Atlas refresh): напрямую выигрывает от S2/S3.
- `WA-005` (Pulse refresh): меньше semantic drift при Atlas-first base truth.

### Нужно ли потом обновлять Wave A queue

- Да, точечный patch к `docs/plans/go2asia_wave_a_execution_queue_v1.md` вероятно нужен после approval этого плана, чтобы явно встроить Atlas alignment gate перед расширением Pulse/downstream работ.

## 9. Success Criteria

Atlas alignment считается достаточным для текущего цикла, если:

1. District strategy formally decided and documented.
2. High-impact place coordinate subset closed or explicitly deferred with evidence.
3. Minimum canonical place contract фиксирован как operational rule.
4. Bridge-debt registry exists and is referenced by planning artifacts.
5. Atlas можно честно классифицировать как stronger-than-bridge foundation for next Pulse/downstream steps (без claim of full perfection).

## 10. Risks and Safeguards

### Risks

- alignment разрастается в giant migration;
- district scope становится бесконечным;
- metadata work вытесняет structural priorities;
- overly strict gate блокирует прогресс без необходимости;
- обратный drift в Pulse-first corrections до Atlas base alignment.

### Safeguards

- strict bucket gating (A/B/C primary, D governance, E optional);
- impact-based coordinate targeting only;
- district staged adoption with explicit stop points;
- no full-canon-or-nothing requirement;
- explicit bridge-debt tracking with review checkpoints.

## 11. Recommended Next Handoff

После approval этого плана:

1. Подготовить `Atlas Canon Alignment Execution Plan` (отдельный, bounded, non-SQL at first iteration).
2. Запросить у пользователя `Atlas Enrichment Input Pack`:
   - district priorities,
   - high-impact coordinates,
   - ambiguous mapping decisions.
3. После фиксирования Atlas S1/S2 вернуть Pulse correction flow в обновленном sequencing.

Следующий логичный документ:

- `docs/plans/go2asia_atlas_canon_alignment_execution_plan_v1.md` (recommended).

## 12. Non-Execution Confirmation

Этот документ:

- не выполняет corrections;
- не содержит SQL patches/migrations;
- не запускает write operations;
- не является giant redesign manifesto.

## 13. Files Used

- `docs/architecture/Geo_Canon_v1.md`
- `docs/plans/go2asia_atlas_geo_canon_conformance_report_v1.md`
- `docs/plans/go2asia_wave_a_neon_ontology_subset_v1.md`
- `docs/plans/go2asia_atlas_pulse_blog_live_data_audit_v1.md`
- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_wave_a_execution_queue_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`
- `packages/db/src/schema/content.ts`
- `packages/db/src/queries/content.ts`
- `packages/db/src/queries/cityMapping.ts`
- `packages/db/src/importPulseEventsFromMarkdown.ts`
- `packages/db/src/export*.ts`
- `packages/db/migrations/*.sql`
