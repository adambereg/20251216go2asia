# ADR-0024: Quest Runtime Metadata Canonicalization

**Статус:** Accepted / Architectural guardrail  
**Дата:** 2026-04-09  
**Зона:** Quest Wave 1.5B  
**Связанные документы:** `docs/architecture/quest/quest_wave_1_5b_definition_v1.md`, `docs/architecture/quest/quest_truth_model_v1.md`, `docs/architecture/quest/quest_level_metadata_model_v1.md`, `docs/architecture/quest/quest_wave_1_5b_contract_delta_v1.md`

## Контекст

После Wave 1 и bounded media hookup:

- Quest runtime lifecycle и базовые поверхности live
- step-level presentation/media читаются runtime-first через `requirements.contentV2`
- quest-level cover/gallery/presentation остаются в гибриде через frontend static mapping

Текущее transitional состояние допустимо как мост, но не как целевая архитектура.

Главный риск: quest-level product truth не является canonical runtime truth, что увеличивает операционный долг и вероятность drift между authoring, runtime и frontend.

## Проблема

Можно ли оставить frontend static mapping primary source для quest-level media/presentation на постоянной основе?

Короткий ответ: нет, это ломает целевую модель platform contract и делает масштабирование квестов зависимым от ручного фронтенд-сопровождения.

## Рассмотренные варианты

### Вариант A — сохранить текущий гибрид как постоянный

Плюсы:

- нет дополнительных контрактных работ прямо сейчас

Минусы:

- runtime truth остаётся неполным для quest-level metadata
- фронт остаётся связан с ручным mapping-слоем
- риск рассинхронизации между контентом, runtime и UI

### Вариант B — перенести quest-level metadata в runtime canonical model (выбран)

Плюсы:

- quest-level presentation/media становятся canonical runtime truth
- frontend consumption выравнивается на API/SDK
- гибридность уходит в управляемый migration bridge

Минусы:

- требуется контрактное и проекционное проектирование в рамках 1.5B

### Вариант C — прямой frontend-read из markdown/content layer

Плюсы:

- быстро для прототипа

Минусы:

- нарушает boundary runtime consumption
- усиливает coupling фронта к authoring source
- плохо масштабируется

## Решение

Принят **Вариант B**:

1. quest-level metadata фиксируется как runtime canonical truth
2. frontend static mapping не может оставаться primary source
3. markdown/content layer заканчивается на projection/import boundary
4. migration bridge/fallback допустим только как временная политика миграции

## Последствия

### Позитивные

- предсказуемый контракт для catalog/detail
- меньше ручной синхронизации во фронте
- проще запускать последующие passes (proof UX, map, verification) на стабильной metadata основе

### Негативные / цена решения

- требуется дисциплина в contract/versioning и миграции
- нужен явный parity-check до отключения primary fallback

## Правила исполнения ADR

- в рамках 1.5B не смешивать решение с map/proof/anti-fraud implementation
- bridge policy должна быть ограничена по времени и условиям завершения
- отсутствие реализации в этой ADR не означает открытый scope: только архитектурная фиксация решения
