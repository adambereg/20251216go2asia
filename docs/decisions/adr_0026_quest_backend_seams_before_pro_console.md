# ADR-0026: Quest Backend Seams Before PRO Console

**Статус:** Accepted / Planning guardrail  
**Дата:** 2026-04-09  
**Зона:** Quest post-1.5B backend preparation  
**Связанные документы:** `docs/architecture/quest/quest_pro_backend_seams_definition_v1.md`, `docs/architecture/quest/quest_pro_backend_seams_scope_matrix_v1.md`, `docs/architecture/quest/quest_pro_backend_seam_set_v1.md`, `docs/architecture/quest/quest_pro_backend_seams_execution_plan_v1.md`, `docs/decisions/adr_0024_quest_runtime_metadata_canonicalization.md`, `docs/decisions/adr_0025_quest_map_scope_post_1_5b.md`

## Контекст

Quest 1.5B, bridge retirement, proof UX completion, и bounded map pass закрыли user-facing runtime baseline.

Следующий архитектурный риск не в пользовательском UI, а в том, что будущий PRO Console authoring может стартовать без минимально сформированных серверных швов:

- owner-scoped read/write boundaries,
- lifecycle control seams,
- review operation seams,
- reference integrity seams.

Без этого консоль начнёт формировать backend shape через UI implementation pressure.

## Проблема

Нужно решить:

1. Делать ли bounded backend seams до PRO Console UI.
2. Как не превратить этот pass в ранний buildout универсальной authoring platform.
3. Где разместить pass в post-1.5B sequencing.

## Рассмотренные варианты

### Вариант A — Начать сразу с PRO Console UI, seams добавлять по ходу

Плюсы:

- быстрый старт интерфейсной работы.

Минусы:

- backend shape диктуется UI-частями, а не целевыми domain seams;
- высокий риск ad hoc endpoint growth;
- рост технического долга до стабилизации seam boundaries.

### Вариант B — Сначала verification hardening, seams потом

Плюсы:

- раннее усиление trust-model.

Минусы:

- verification pass может случайно начать формировать curator/backend seams, хотя это не его задача;
- будущий PRO Console слой остаётся без заранее определённого backend контракта.

### Вариант C — Сначала bounded backend seams, затем verification (выбран)

Плюсы:

- фиксируются authoring/curator серверные швы до UI;
- verification hardening остаётся в своей зоне ответственности;
- меньше риск смешивания scope между authoring, trust hardening, и growth surfaces.

Минусы:

- отдельный planning/implementation проход до очередных user-facing расширений.

## Решение

Принят **Вариант C**:

1. Выполнить отдельный bounded pass `Quest PRO backend seams` до PRO Console UI.
2. Ограничить pass только минимальным seam set (ownership, lifecycle, review, references, read models, stats minimum, permissions, revision/audit basics).
3. Явно запретить превращение pass в authoring platform/CMS/workflow engine.

## Зафиксированный sequencing

Рекомендуемый порядок:

1. **Quest PRO backend seams**
2. **Verification Hardening / Anti-Fraud**
3. **Social / My Quests / Leaderboard**
4. **PRO Console planning + UI**
5. **PRO Console implementation**

## Последствия

### Позитивные

- backend seams готовятся как самостоятельный bounded слой;
- PRO Console UI позже строится на стабильной серверной основе;
- verification hardening не подменяет architecting curator layer.

### Негативные / цена решения

- появляется отдельный подготовительный backend pass;
- часть ценности откладывается до следующей implementation фазы.

## Правило исполнения

Любая задача, требующая visual builder semantics, collaborative authoring UX, или broad analytics platform, автоматически относится к более поздней PRO Console волне и не входит в bounded seams pass без отдельного ADR override.
