# ADR-0025: Quest Map Scope Post-1.5B

**Статус:** Accepted / Scope boundary guardrail  
**Дата:** 2026-04-09  
**Зона:** Quest post-1.5B planning  
**Связанные документы:** `docs/architecture/quest/quest_wave_1_5b_definition_v1.md`, `docs/architecture/quest/quest_wave_1_5b_scope_matrix_v1.md`, `docs/architecture/quest/quest_wave_1_5b_execution_roadmap_v1.md`, `docs/decisions/adr_0023_geo_layer_introduction.md`

## Контекст

Quest surfaces имеют route/geo контекст, и карта продуктово полезна для guided experience.

Одновременно Wave 1.5B зафиксирован как metadata canonicalization pass, а не UI/spatial implementation pass.

Есть риск смешать map-реализацию с 1.5B и расползти scope.

## Проблема

Нужно принять решение:

- нужна ли карта в Quest вообще
- входит ли карта в 1.5B
- какой минимальный scope карты допустим после 1.5B

## Рассмотренные варианты

### Вариант A — включить карту в 1.5B

Плюсы:

- быстрее видимый UI эффект

Минусы:

- смешение metadata canonicalization и spatial UI
- высокий риск scope creep и потери bounded характера 1.5B
- размывание exit criteria 1.5B

### Вариант B — исключить карту полностью из ближайших волн

Плюсы:

- минимальный технический риск

Минусы:

- не закрывается продуктовая потребность spatial guidance
- гео-шаги остаются менее понятными для пользователя

### Вариант C — вынести карту в отдельный pass после 1.5B (выбран)

Плюсы:

- сохраняется чистый scope 1.5B
- карта получает отдельные цели, критерии и ограничения
- map pass строится на уже выровненной runtime metadata truth

Минусы:

- карта появится на шаг позже, а не внутри 1.5B

## Решение

Принят **Вариант C**:

1. Карта в Quest нужна и признаётся целевой продуктовой способностью.
2. Карта не входит в 1.5B.
3. Карта выполняется отдельным post-1.5B pass с собственным scope и критериями.

## Минимально допустимый scope будущего map pass

- read-only map assistance для Quest detail/run
- визуализация шага/зоны (без изменения proof semantics)
- bounded UI слой без превращения в полнофункциональную навигацию

## Что запрещено смешивать с map pass

- anti-fraud механики
- strict verification hardening
- full navigation stack
- deep geo orchestration across services

Эти зоны остаются отдельными passes.

## Последствия

### Позитивные

- 1.5B остаётся bounded и завершаемым
- map pass получает чистые границы
- меньше риск архитектурного и execution-drift

### Негативные / цена решения

- spatial UX улучшение не входит в ближайший 1.5B результат
- нужен отдельный sequencing контроль после 1.5B

## Правило для implementation planning

Любая задача с map UI или spatial interaction автоматически классифицируется как post-1.5B и не может быть добавлена в 1.5B backlog без отдельного ADR override.
