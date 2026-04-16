# ADR 0028: Personal Organizer Backend Boundary

**Status:** Accepted / Planning guardrail  
**Date:** 2026-04-16  
**Zone:** Space Asia / Personal Organizer backend ownership  
**Related docs:** `docs/modules/space/go_2_asia_personal_organizer_ssot_v_1.md`, `docs/modules/space/Placement-of-Personal-Organizer-inside-Space-Asia.md`, `docs/modules/space/space_personal_organizer_framing_note_v1.md`, `docs/modules/space/personal_organizer_implementation_plan_v1.md`, `docs/architecture/space/space_backend_architecture_v_1.md`, `docs/architecture/space/space_domain_model_v_1.md`, `docs/architecture/space/space_service_implementation_plan.md`, `docs/architecture/space/space_service_production_architecture_v_1.md`, `docs/architecture/space/space_status_framing_audit_2026_04_12.md`, `docs/modules/space/space_ui_backend_mapping_v_1.md`, `docs/openapi/space.yaml`

## Context

`Personal Organizer` уже зафиксирован как trip-first section inside `Space Asia`, при этом `Space Asia` в целом остаётся dashboard-first personal/social module.

Следовательно, UI placement Organizer внутри `Space` уже принят, но backend ownership всё ещё требует явного решения.

Это решение нужно зафиксировать сейчас по трём причинам:

- текущий `space-service` уже закреплён как bounded social-core backend;
- новый Personal Organizer вводит trip-first domain (`Trip`, `TripItem`, `TripTask`, `TripNote`, `TripInsight`), который не совпадает с social-core boundary;
- first implementation slice должен быть practical, но не должен закладывать ownership drift и painful extraction later.

## Decision drivers

- product fit with `Space > Organizer`
- bounded ownership
- extraction readiness
- delivery realism
- contract clarity
- avoidance of scope and ownership drift

## Considered options

### Option A

Расширять `space-service` и сделать Organizer частью backend boundary Space.

### Option B

Сделать отдельный `planner-service` / `organizer-service` с собственным contract/storage boundary, а `Space` UI пусть потребляет его напрямую.

### Option C

Сделать deliberate transitional variant: отдельный organizer/planner ownership contour с самого начала, но доставлять его в `Space` UI через space-adjacent integration layer, BFF/read-model/adapters, сохраняя extraction-ready подход.

## Decision

Выбрать **Option C** как решение для v1 planning и first implementation slice.

Это означает:

- `space-service` **не** становится owner нового Personal Organizer domain;
- write truth для Organizer живёт в отдельном organizer/planner boundary;
- `Space` UI может визуально и UX-wise показывать Organizer как часть `Space Asia`, но backend integration идёт через separate contract plus composition/adapters;
- long-term target остаётся ближе к **Option B**, но first slice допускает deliberate transitional delivery;
- **Option A** отклоняется как основное направление.

## Why this option

- Он лучше всего соответствует уже принятому framing: `Organizer` живёт **внутри Space UI**, но это не делает весь `space-service` planner domain.
- Он сохраняет `space-service` в рамках уже зафиксированного social-core boundary и не конфликтует с текущими `space` contracts/schema.
- Он совпадает с текущим implementation plan, где уже рекомендован dedicated organizer/planner boundary с temporary Space-adjacent delivery.
- Он позволяет сделать первый реальный slice быстрее, чем full standalone rollout по Option B, но без архитектурной ловушки Option A.
- Он лучше переживает рост Organizer: trip model, notes/tasks/insights, multi-source saved intake и AI-layer можно расширять без painful extraction из social-core.

Почему другие варианты хуже:

- **Option A** создаёт немедленный ownership drift: `Trip`, `TripItem`, `TripTask`, `TripNote`, `TripInsight` не являются social-core сущностями и не должны закрепляться за `space-service`.
- **Option A** также размывает `docs/openapi/space.yaml` и `space` schema, которые сейчас честно отражают bounded social-core runtime.
- **Option B** архитектурно чище как long-term state, но для first slice легко превращается в premature full-service program с лишней операционной тяжестью, прежде чем базовый Organizer flow будет подтверждён.

## Consequences

### Positive consequences

- `space-service` сохраняет чистую social-core ответственность.
- Organizer получает собственную domain truth для trip-first model уже с первого шага.
- `Space` shell может интегрировать Organizer без смены продуктовой иерархии `Space > Organizer`.
- Контракты становятся яснее: social API остаётся отдельным от organizer/planner API.
- Extraction later становится дешёвой эволюцией, а не миграцией из перегруженного social service.

### Negative consequences

- Появляется дополнительная integration complexity: gateway routing, adapters/BFF, SDK/types и cross-service auth нужно держать явно.
- First slice будет опираться на два backend contours, а не на один.
- Граница между global saved layer и Organizer intake должна быть дисциплинирована, иначе появится двойная правда между bookmarks/saved source и trip context.

### Follow-up consequences

- `Trip`, `TripItem`, `TripTask`, `TripNote`, `TripInsight` должны быть закреплены за organizer/planner boundary, а не за `space-service`.
- Global saved truth не должна переезжать в `space-service`; в первом срезе текущие bookmarks из `reactions-service` остаются одним из intake sources.
- Organizer должен владеть не foreign object truth, а своим `saved-source reference` / `trip projection` layer.
- Если понадобится Space-facing preview/read model, он должен быть явно помечен как composition/proxy layer, а не как признак Space ownership.

## First implementation implication

Для first slice это означает следующее:

- не расширять `docs/openapi/space.yaml` organizer write-model endpoints;
- не добавлять trip-domain таблицы в текущую `space` schema;
- ввести отдельный organizer/planner contract namespace, предпочтительно вне `/v1/space/*`;
- использовать `Space` shell как UI host, а dashboard preview / Organizer entry / saved-to-trip flow подключать через adapters или BFF/composition layer;
- начать с минимального organizer backend surface вокруг `Trip`, `TripItem`, `TripTask`, `TripNote` и lightweight derived `TripInsight`.

Практическое API правило:

- `/v1/space/*` должно оставаться social-core contract space;
- Organizer API лучше вводить как отдельный namespace/service contract;
- если временный Space-facing organizer endpoint всё же появится, его нужно трактовать как proxy/composition surface, а не как доказательство ownership inside `space-service`.

## Relation to existing docs

- Этот ADR согласован с `docs/modules/space/go_2_asia_personal_organizer_ssot_v_1.md`: Organizer остаётся trip-first domain.
- Он согласован с `docs/modules/space/Placement-of-Personal-Organizer-inside-Space-Asia.md` и `docs/modules/space/space_personal_organizer_framing_note_v1.md`: Organizer живёт внутри `Space Asia` визуально и UX-wise, но не переопределяет весь `Space`.
- Он конкретизирует `docs/modules/space/personal_organizer_implementation_plan_v1.md`, где уже рекомендован dedicated organizer/planner boundary с Space-adjacent delivery.
- Он сохраняет согласованность с текущими Space architecture docs, где `space-service` закреплён как bounded social-core, а organizer repeatedly описан как optional early-near-Space, transitional и extraction-ready contour.
