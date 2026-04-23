# Organizer Concept Alignment Pass v1

## Status

Decision-oriented alignment note.

Superseded in part after Organizer merge to `main`.

## Synchronization Note

This document remains useful as a concept-to-runtime alignment artifact, but parts of the runtime snapshot sections are now historical.

When statements in this file conflict with current code state, use these anchors as current source of truth:

- `docs/modules/space/space_current_state_audit_with_organizer_v1.md`
- `docs/modules/space/organizer_current_cycle_closure_note_v1.md`
- `docs/modules/space/space_frontend_baseline_status_note_v1.md`

Superseded-in-part scope: runtime-absence claims for Organizer Home tab roles/surfaces, Timeline/Overview presence, trip lifecycle/time/day layers, and related next-slice recommendations in §3, §4.5-§4.10, §6, and §7 should be treated as historical.

## 1. Purpose

Этот pass нужен, чтобы аккуратно синхронизировать три слоя:

- новый продуктовый концепт Organizer;
- текущий live runtime внутри `Space Asia`;
- Bolt.New screens как visual reference layer.

Документ не переписывает SSOT и не открывает новую heavy wave.
Его задача — зафиксировать, что уже стало runtime truth, что пока совпадает только частично, что остаётся concept-only или Bolt-only direction, и какой один следующий bounded slice лучше всего приближает runtime к канону.

## 2. Inputs

Этот alignment pass опирается на три источника.

### A. Product / concept layer

- `docs/modules/space/Organizer-Product-Concept-v1.md`
- `docs/modules/space/Organizer-Lifecycle-Modes-v1.md`
- `docs/modules/space/go_2_asia_personal_organizer_ssot_v_1.md`
- `docs/modules/space/Placement-of-Personal-Organizer-inside-Space-Asia.md`
- `docs/modules/space/space_personal_organizer_framing_note_v1.md`
- `docs/modules/space/space_saved_and_organizer_intake_note_v1.md`
- `docs/modules/space/personal_organizer_implementation_plan_v1.md`
- `docs/modules/space/space_frontend_baseline_status_note_v1.md`
- `docs/decisions/adr_0028_personal_organizer_backend_boundary.md`

### B. Current runtime / code layer

- `apps/go2asia-pwa-shell/app/(public)/space/organizer/OrganizerPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/organizer/trips/[tripId]/OrganizerTripDetailPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/saved/SavedPostsPageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/Shared/SpaceNav.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/organizerApi.ts`
- `apps/go2asia-pwa-shell/components/space/runtime/organizerExecution.ts`
- `apps/organizer-service/src/routes/trips.ts`
- `apps/organizer-service/src/services/organizerService.ts`
- `packages/db/src/schema/organizer.ts`

### C. Bolt reference layer

- переданные Bolt.New screens / screenshots для этого pass;
- Bolt-derived visual language, уже отражённый в проектных UI materials.

В этом документе Bolt трактуется только как visual / interaction reference.
Bolt не трактуется как source of truth для backend, data model, API contract или ownership boundary.

## 3. Current Alignment Summary

### What already matches

- `Space Asia` остаётся `dashboard-first personal/social module`, а `Organizer` уже открыт как отдельная секция внутри `Space`, а не как top-level модуль.
- `Organizer` уже живёт как реальный trip-first runtime contour: есть `Organizer Home`, `Trip Detail`, `Trip`, `TripItem`, `TripTask`, `TripNote`.
- `Saved` уже работает как global intake layer, а не как второй Organizer storage.
- `Saved -> Add to trip -> Trip context` уже является реальным working flow.
- Отдельный organizer boundary уже соблюдён: write truth не уходит в `space-service`.

### What partially matches

- `Organizer Home` уже показывает focus trip и portfolio of trips, но ещё не разведён в канонические роли `Список / Таймлайн / Обзор`.
- `Trip Detail` уже является главным рабочим контекстом поездки, но пока остаётся bounded execution surface без полного lifecycle / time / day stack.
- `Readiness`, `what matters now` и `next step` уже есть, но пока строятся как lightweight rule-based layer, а не как более зрелый product layer с blockers, lifecycle accents и unified time semantics.
- Visual tone уже стал спокойнее и зрелее, но shell-level framing всё ещё местами отстаёт от нового концепта.

### What does not match yet

- В runtime пока нет truthful `Timeline` как отдельной поездочной time surface.
- В runtime пока нет truthful `Overview` как action portfolio across trips.
- В runtime пока нет явного lifecycle layer `Preparation / In Trip / Post Trip`.
- В `Trip Detail` пока нет unified trip time block и day focus layer.
- В runtime пока нет action timeline scale `Day / Week / Month`.

## 4. Block-by-Block Alignment

### 4.1. Organizer Home

Текущее состояние: partial alignment.

Что уже совпадает:

- экран уже отвечает на вопросы `какая поездка важнее сейчас`, `какая требует внимания`, `как создать новую поездку`;
- есть focus trip;
- есть trip portfolio;
- есть мягкий create trip flow.

Что пока не совпадает:

- home ещё не разведён на канонические product roles `Список / Таймлайн / Обзор`;
- portfolio layer пока сильнее похож на refined trip list, чем на fully clarified Organizer home concept;
- shell-level framing вокруг Organizer ещё частично несёт следы legacy preview/execution language.

Вывод:
`Organizer Home` уже близок к концепту как `trip portfolio entry`, но ещё не является полной канонической точкой входа Organizer v1.

### 4.2. Trip Detail

Текущее состояние: strong partial alignment.

Что уже совпадает:

- `Trip Detail` уже является primary workspace одной поездки;
- есть trip header;
- есть readiness/stage-like guidance;
- есть `what matters now`;
- есть `next step`;
- есть items / tasks / notes;
- есть честная semantics around saved provenance.

Что пока не совпадает:

- нет unified trip time layer;
- нет explicit blockers / fragile points layer;
- нет lifecycle-sensitive UI accents;
- нет day focus sublayer;
- нет более богатой time-sensitive semantics beyond lightweight counts/statuses.

Вывод:
`Trip Detail` уже честно совпадает с ядром нового концепта, но пока остаётся bounded execution workspace, а не полным concept-grade trip workspace.

### 4.3. Saved

Текущее состояние: aligned within bounded scope.

Что уже совпадает:

- `Saved` остаётся отдельным глобальным списком сохранённого;
- `add to trip` и `create trip from this` уже ведут в trip context;
- `remove from trip` не делает global unsave;
- copy и UX уже различают global save и trip-specific link.

Что пока не совпадает:

- runtime Saved пока фактически ограничен `space_post` bookmarks;
- concept v1 допускает более широкий ecosystem saved layer, но runtime это ещё не подтверждает.

Вывод:
семантика уже правильная; ширина supported intake domain пока ещё bounded.

### 4.4. Saved -> Add to trip -> Trip context

Текущее состояние: aligned and live.

Это уже runtime truth:

- пользователь может открыть `Saved`;
- выбрать пост;
- добавить его в существующую поездку;
- либо создать новую поездку из saved post;
- затем открыть trip detail;
- remove from trip не ломает global Saved.

Это одна из самых сильных уже достигнутых точек alignment.

### 4.5. Timeline

Текущее состояние: concept-only / Bolt-direction only.

Новый концепт фиксирует `Timeline` как отдельную поездочную time surface, которая показывает поездки как диапазоны во времени.
В текущем runtime такой surface отсутствует.
Следовательно, `Timeline` пока нельзя описывать как live Organizer truth.

### 4.6. Overview as action portfolio

Текущее состояние: concept-only / Bolt-direction only.

Концепт фиксирует `Overview = action portfolio across trips`.
В runtime такой отдельной поверхности пока нет.
Нынешний home показывает trips и focus, но ещё не action portfolio as a distinct surface.

### 4.7. Lifecycle modes

Текущее состояние: concept-only with minimal runtime preconditions.

У runtime уже есть даты поездки и coarse trip statuses.
Этого достаточно, чтобы считать lifecycle-layer допустимым следующим bounded направлением.
Но truthful UI-mode layer `Preparation / In Trip / Post Trip` пока ещё не реализован.

### 4.8. Trip time layer

Текущее состояние: not aligned yet.

Концепт требует один единый time block внутри `Trip Detail`.
Сейчас в runtime даты поездки существуют только как простой trip window hint.
Unified block с edit dates, selected day и quick day context пока отсутствует.

### 4.9. Day Focus layer

Текущее состояние: Bolt direction, not runtime truth.

Bolt screens показывают полезное направление:

- day context inside trip;
- calm empty day;
- day-specific focus;
- day-sensitive quick actions.

Но runtime пока не имеет truthful day layer, а текущий organizer backend не держит `TripDay` contour.
Следовательно, day focus пока нельзя описывать как live capability.

### 4.10. Action timeline scale

Текущее состояние: not present in runtime.

Концепт фиксирует `Day / Week / Month` scale для action timeline inside `Overview`.
Ни `Overview`, ни action timeline scale в runtime пока не существуют.

### 4.11. Overall visual language / hierarchy / maturity level

Текущее состояние: partial but promising alignment.

Что уже совпадает:

- calm card-based composition;
- мягкая visual hierarchy;
- низкий visual noise;
- адекватное выделение focus, status, next step;
- взрослеющий product tone inside live Organizer surfaces.

Что пока отстаёт:

- runtime shell местами всё ещё несёт legacy milestone / preview framing;
- Bolt показывает более зрелую portfolio/time hierarchy, чем текущий runtime;
- часть visual maturity пока существует только в direction, но не в truthful product structure.

## 5. Bolt Reference Usage

### Keep

Из Bolt почти напрямую стоит брать как UX pattern:

- calm card hierarchy;
- мягкую разбивку на focus layer и supporting layers;
- visual separation между trip portfolio, trip time, current actions и supporting notes;
- спокойные empty states;
- idea of `Overview` as action portfolio rather than another trip list;
- unified time block as one recognisable anchor inside trip detail.

### Adapt

Под Space Asia shell нужно адаптировать:

- Bolt composition, чтобы Organizer оставался section inside `Space`, а не standalone planner app;
- naming/copy, чтобы язык оставался product-natural и соответствовал уже принятому `Saved vs Organizer` framing;
- visual hierarchy, чтобы она не ломала dashboard-first shell;
- lifecycle and day patterns, чтобы они оставались lightweight and bounded.

### Do not copy

Нельзя копировать из Bolt как implementation truth:

- implicit data model assumptions;
- planner-suite breadth;
- any storage/persistence assumption;
- второй saved layer внутри Organizer;
- day planner / scheduler feel;
- heavy portfolio board logic;
- anything that implies map/reminders/comparison/AI/collaboration are already runtime-backed.

## 6. Top Mismatches

Ниже главные расхождения, которые реально мешают clean alignment.

1. `Organizer Home` в runtime уже live, но product structure ещё не разведена в truthful `Список / Таймлайн / Обзор`.
2. `Trip Detail` уже strong bounded workspace, но пока без unified trip time block, lifecycle accents и day focus.
3. `Lifecycle modes` уже приняты концептуально, но пока не отражены как runtime-aware UI layer.
4. Shell-level wording ещё местами отстаёт от нового concept tone и тянет legacy preview/execution framing.
5. Bolt показывает полезное future-facing направление по portfolio/time/day hierarchy, но runtime пока поддерживает только narrower truth.
6. Saved semantics уже совпадают, но supported intake domain пока уже, чем long-term concept.

## 7. Recommended Next Bounded Slice

### Slice

`Trip Detail Time + Lifecycle Alignment Slice`

### Why this slice

Это лучший следующий bounded шаг, потому что он:

- сильнее всего приближает runtime к новому Organizer concept v1;
- использует сильное Bolt direction без blind copy;
- не требует открыть full `Timeline` или `Overview`;
- не ломает backend boundary;
- не превращает Organizer в heavy planner suite.

### Scope

Следующий slice должен быть сфокусирован на `Trip Detail` и включать:

- один unified trip time block;
- явный lifecycle accent `Preparation / In Trip / Post Trip` на основе существующих trip dates/status;
- stronger readiness / blockers / fragile points messaging;
- lightweight day-focus entry/state inside trip detail;
- better connection between time layer, `what matters now` and `next step`.

### What not to include

В этот slice не должны входить:

- отдельный `Timeline` screen;
- отдельный `Overview` screen;
- full `TripDay` planner;
- map;
- reminders engine;
- comparison layer;
- AI planner;
- collaboration;
- broad saved wave;
- backend-boundary shift.

## 8. Guardrails

Следующие правила остаются жёсткими:

- `Saved` remains global.
- `Organizer` remains a trip-first section inside `Space`.
- There is no second saved storage inside Organizer.
- No heavy planner wave is opened by this pass.
- No blind Bolt copy is allowed.
- No Space-wide redesign is implied.
- Runtime truth must win over prototype implication.
- Bolt may influence layout and calmness, but not domain truth.

## 9. Final Decision

На текущем этапе alignment уже достаточно сильный по главным product rules:

- Organizer уже является реальным trip-first runtime contour inside Space;
- Saved vs Organizer semantics уже выровнены;
- backend boundary уже совпадает с принятыми guardrails.

Главный remaining gap сейчас не в базовой архитектуре и не в core semantics.
Главный gap — в том, что новый product concept и Bolt visual direction уже ушли дальше, чем текущий runtime structure.

Поэтому следующий bounded шаг должен усиливать не breadth Organizer, а maturity already-live `Trip Detail` через unified time + lifecycle alignment, без открытия новой тяжёлой product wave.
