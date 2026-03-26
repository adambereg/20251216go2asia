# Go2Asia Atlas Canon Alignment Execution Plan v1

Status: execution planning artifact (non-execution)  
Date: 2026-03-24  
Scope: Atlas-only alignment execution structure (bounded current cycle)

## 1. Purpose

Этот документ переводит `go2asia_atlas_canon_alignment_plan_v1.md` в прикладную execution-структуру.

Зачем он нужен:

- alignment buckets сами по себе не задают исполняемую последовательность;
- нужен практический staged path: decision -> enrichment -> bounded prep -> verification -> return gate;
- нужно заранее отделить user enrichment от Cursor work.

Это не correction execution, не SQL patch set и не write-run.

## 2. Current Alignment Baseline

- Atlas сейчас bridge-usable и operationally strong на Country/City/Place базисе.
- Главные gaps: district strategy/layer и high-impact place coordinate completeness.
- Утвержденные buckets alignment plan:
  - A: district strategy
  - B: high-impact coordinates
  - C: place contract tightening
  - D: bridge-debt registry
  - E: metadata seam (strictly optional)
- Primary alignment target текущего цикла: сделать Atlas sufficiently canonical foundation для безопасного возврата к Pulse flow.

## 3. Execution Strategy

1. Сначала structural decisions, потом enrichment.
2. District strategy идет раньше массовых данных, чтобы зафиксировать local-zone parent rule (city или иной разрешенный canonical parent) и не генерировать хаотичные mappings.
3. High-impact coordinates закрываются таргетно по visible impact, не total cleanup.
4. Minimal canonical place contract (including standalone/container semantics) фиксируется до downstream return.
5. Bridge-debt registry запускается как контроль bounded scope.
6. Metadata seam выполняется только если не отвлекает от A/B/C.

## 4. Execution Tracks / Slices

### AX-1. District Strategy Decision and Bounded Model

- **Objective:** зафиксировать decision frame и staged adoption rule для district.
- **Why now:** это primary structural gap; без него дальнейшее выравнивание расползается.
- **Dependencies:** approved conformance report + alignment plan.
- **Owner type:** `Shared` (User + Cursor).
- **Expected inputs:** district priority zones, use-case importance (Rielt/RF/Guru/Quest sensitive areas).
- **Expected outputs:** district strategy note (scope boundaries, phased zones, non-goals, parent-type rule).
- **Done when:** district decision frame утвержден и применим к текущему циклу.
- **Out of scope:** full district rollout across all SEA.

### AX-2. High-Impact Place Coordinate Enrichment Set

- **Objective:** сформировать и утвердить узкий high-impact subset missing place coordinates.
- **Why now:** coords gap — material blocker для Atlas map/nearby surfaces.
- **Dependencies:** AX-1 (priority zones), live audit baseline.
- **Owner type:** `Shared` (User data input + Cursor structuring/validation).
- **Expected inputs:** authoritative coordinate inputs from user for selected subset.
- **Expected outputs:** approved Atlas coordinate enrichment set (input artifact, no execution).
- **Done when:** high-impact subset fully classified: accepted/manual/excluded.
- **Out of scope:** global completion of all missing coords.

### AX-3. Canonical Place Contract Alignment (Current Cycle)

- **Objective:** закрепить минимум canonical place contract для текущего execution cycle.
- **Why now:** нужен устойчивый contract before return-to-Pulse.
- **Dependencies:** AX-1, AX-2.
- **Owner type:** `Cursor` (with human review).
- **Expected inputs:** approved district strategy + enrichment decisions.
- **Expected outputs:** bounded contract alignment note (must-have refs, coords rules, standalone/container place seam, debt marking).
- **Done when:** clear operational rule exists for place identity/ref/coords with explicit exceptions.
- **Out of scope:** full schema redesign and full historical normalization.

### AX-4. Bridge-Debt Registry Bootstrap

- **Objective:** запустить короткий управляемый реестр Atlas canon gaps.
- **Why now:** чтобы bridge-state оставался контролируемым, а не скрытым backlog.
- **Dependencies:** AX-3.
- **Owner type:** `Cursor`.
- **Expected inputs:** AX-1..AX-3 outcomes.
- **Expected outputs:** concise registry with severity, owner, review checkpoint.
- **Done when:** registry существует и используется как planning gate.
- **Out of scope:** giant catalog “всего плохого”.

### AX-5. Optional Metadata Seam (Only If Justified)

- **Objective:** ограниченно усилить metadata contract только там, где это повышает governance clarity.
- **Why now:** secondary/optional, не primary structural driver.
- **Dependencies:** AX-1..AX-4 complete or stable.
- **Owner type:** `Cursor` with `User` approval.
- **Expected inputs:** confirmed non-distraction check vs A/B/C goals.
- **Expected outputs:** small metadata seam proposal or explicit defer decision.
- **Done when:** либо bounded metadata patch spec готов, либо documented defer.
- **Out of scope:** standalone metadata mini-project.

## 5. User Enrichment vs Cursor Execution

### What the user must provide

- district decisions for priority zones;
- ambiguous place-to-district judgments;
- authoritative coordinates for high-impact missing places;
- priority subset selection for first alignment batch;
- explicit approve/reject on ambiguous records.

### What Cursor can do after input exists

- structural validation of supplied enrichment pack;
- accepted/manual/excluded segregation;
- bounded execution-prep artifacts (non-write);
- verification templates and gating updates;
- bridge-debt registry updates and status tracking docs.

### What Cursor must not do

- invent district mappings;
- guess missing coordinates;
- auto-promote ambiguous records to accepted;
- silently expand Atlas scope beyond approved slices.

## 6. Dependency-Aware Sequencing

### Strict order

1. AX-1 (district decision frame)
2. AX-2 (high-impact enrichment set)
3. AX-3 (place contract alignment)
4. AX-4 (bridge-debt registry bootstrap)
5. AX-5 (optional metadata seam)

### Parallelizable parts

- AX-4 preparation drafting может начаться late AX-3, но финал только после AX-3 outcomes.
- AX-5 pre-assessment можно сделать параллельно как defer-check, без начала implementation planning.

### What blocks return to Pulse

- отсутствие утвержденного district decision frame;
- отсутствие approved high-impact coordinate subset;
- отсутствие зафиксированного minimal canonical place contract.

### What should not block cycle unnecessarily

- полная district coverage everywhere;
- full metadata maturity;
- non-critical coordinate gaps outside approved high-impact scope.

## 7. Return-to-Pulse Gate

Возврат к Pulse flow допустим, когда одновременно выполнено:

1. District strategy approved (AX-1 done).
2. High-impact place coordinate set approved and ready (AX-2 done, even if not globally complete).
3. Minimal canonical place contract fixed for current cycle (AX-3 done), including container-place linkage posture where relevant.
4. Bridge-debt registry started and referenced in planning governance (AX-4 done).
5. Нет критичных Atlas Geo SoT blockers для WA-005 pathways.

Если любой из пунктов отсутствует — возвращение к Pulse только как ограниченный prep, не как primary correction line.

## 8. Explicitly Deferred from Atlas Execution Cycle

- full district enrichment for all countries/cities;
- total historical Atlas cleanup;
- full metadata rollout as separate initiative;
- Pulse correction execution details;
- full downstream execution (Rielt/RF/Space/Quest) inside this cycle;
- giant cross-domain geo contract harmonization.

## 9. Execution Acceptance Criteria

Execution cycle считается достаточным, если:

1. AX-1..AX-4 завершены по `done when`.
2. Atlas remains stable and bounded (no scope explosion).
3. High-impact Atlas gaps снижены до non-blocking state for current Wave A.
4. Governance artifacts готовы для controlled handoff back to Pulse.
5. Decision trail (what accepted/deferred/manual) прозрачен и auditable.

## 10. Risks and Safeguards

### Risks

- execution превращается в giant enrichment project;
- district discussion затягивается бесконечно;
- Cursor делает слишком много без human inputs;
- optional metadata отвлекает от structural work;
- scope creep через “быстрые полезные” внеплановые улучшения.

### Safeguards

- AX-1..AX-4 as mandatory bounded core; AX-5 optional;
- explicit “no approved input -> no move” gate on enrichment-sensitive steps;
- fixed high-impact subset cap for AX-2;
- mandatory out-of-scope log for rejected additions;
- periodic checkpoint review after each slice.

## 11. Recommended Next Handoff

После approval этого execution plan:

1. Подготовить `Atlas Enrichment Input Pack v1` (user-facing) для AX-1/AX-2.
2. Подготовить `Atlas Alignment Execution Slice 1` (non-SQL execution prep artifact).
3. После завершения AX-1..AX-4 — обновить Wave A queue/anchor references и открыть controlled return-to-Pulse step.

Recommended next document:

- `docs/plans/go2asia_atlas_canon_alignment_enrichment_input_pack_v1.md`

## 12. Non-Execution Confirmation

Этот документ:

- не выполняет corrections;
- не содержит SQL migrations/patches;
- не запускает write operations;
- не смешивает Atlas execution structure с Pulse correction details.

## 13. Files Used

- `docs/plans/go2asia_atlas_canon_alignment_plan_v1.md`
- `docs/plans/go2asia_atlas_geo_canon_conformance_report_v1.md`
- `docs/architecture/Geo_Canon_v1.md`
- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_wave_a_execution_queue_v1.md`
- `docs/plans/go2asia_wave_a_neon_ontology_subset_v1.md`
- `docs/plans/go2asia_atlas_pulse_blog_live_data_audit_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`
- `packages/db/src/schema/**`
- `packages/db/migrations/**`
- `packages/db/src/queries/**`
- `packages/db/src/import*.ts`
- `packages/db/src/export*.ts`
