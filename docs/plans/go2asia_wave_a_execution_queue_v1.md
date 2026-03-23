# Go2Asia Wave A Execution Queue v1

Status: active near-term execution queue  
Date: 2026-03-23  
Parent anchor: `docs/plans/go2asia_execution_master_plan_v1.md`

## 1. Purpose and Scope

Wave A — это **прикладная очередь ближайшей волны исполнения**, а не новый master plan и не общий roadmap.

Назначение Wave A:

- перевести ближайший цикл в режим practical execution;
- стабилизировать честную frontend поверхность;
- зафиксировать data/content basis для первых живых модулей;
- убрать возврат к выдуманным мокам при отсутствии реальных данных.

В Wave A входит:

- practical subset foundation/data truth;
- frontend stabilization с truthful states;
- подготовка и интеграция live content packs;
- module-by-module refresh в пределах ближайшего цикла;
- readiness/demo gate для первой живой поверхности.

В Wave A **не входит** закрытие всей экосистемы или полная зрелость всех контуров.

## 2. Wave A Objectives

1. Stabilise frontend truth: убрать ложную «живость», пустые оболочки и скрытые mock-потоки.
2. Align practical data basis: выполнить минимально достаточный Neon/ontology subset для живых модулей.
3. Prepare and use live content packs: сделать контент формальной входной зависимостью.
4. Deliver first data-backed module refresh: Atlas/Pulse + first live surface для Rielt/Space.
5. Put RF/Quest into controlled pre-live or first-pack-backed state.
6. Зафиксировать anti-mock discipline как обязательное правило исполнения.

## 3. Entry Conditions

Wave A стартует при следующих условиях (already satisfied baseline):

- `docs/plans/go2asia_execution_master_plan_v1.md` является текущим execution anchor;
- `docs/plans/go2asia_status_anchor_v1.md` используется как status truth source;
- normalisation baseline NQ-001/002/006/007/008/009/011 завершен;
- no new governance contradictions blocking near-term execution;
- команда принимает user-content-gated подход как обязательный для модулей без live данных.

## 4. Wave A Workstreams

### WS-A1. Data / ontology / Neon alignment

- **Objective:** подготовить минимально достаточную data truth базу для Wave A refresh.
- **Why now:** без этого frontend либо пустой, либо уходит в mock-resurrection.
- **Dependencies:** status anchor rules, DB/OpenAPI discipline, Atlas/Pulse data context.
- **Who/what produces inputs:** User (curated source corrections), Shared (schema/consistency decisions).
- **Who/what consumes outputs:** Cursor module refresh tasks (WS-A4/A5/A6).
- **User prepares manually:** source curation/ontology-sensitive review для geo/event/content data.
- **Cursor after input exists:** применяет согласованный subset alignment и wiring в module surfaces.
- **Success criteria:** минимальный data subset подтвержден и пригоден для live/pre-live UI rendering.
- **Out of scope:** полная миграция всей платформы или глобальная schema redesign.

### WS-A2. Frontend stabilization and truthful module states

- **Objective:** привести shell и module landing states к честному виду.
- **Why now:** после удаления моков модули выглядят пустыми/мертвыми и провоцируют новые фейковые данные.
- **Dependencies:** WS-A1 baseline signals, status anchor contour truth.
- **Who/what produces inputs:** Anchor/reconciliation truth + content-pack readiness.
- **Who/what consumes outputs:** module teams и demo/readiness stream.
- **User prepares manually:** подтверждение приоритета модулей и допустимых pre-live формулировок.
- **Cursor after input exists:** внедряет honest empty/loading/error/pre-live states, убирает ложную «живость».
- **Success criteria:** модульные состояния не искажают readiness и не маскируют отсутствие данных.
- **Out of scope:** полный визуальный redesign всех страниц.

### WS-A3. Live content pack preparation

- **Objective:** формализовать и собрать минимальные живые контентные наборы для Wave A модулей.
- **Why now:** без live packs Cursor либо придумывает моки, либо удаляет содержимое.
- **Dependencies:** WS-A1 data constraints, module schemas/contracts.
- **Who/what produces inputs:** User (primary), Shared (format checks).
- **Who/what consumes outputs:** Cursor module integration tasks (WS-A5/A6).
- **User prepares manually:** packs для `Rielt`, `RF`, `Quest`, `Space`; при необходимости curated refresh inputs для `Atlas`/`Pulse`.
- **Cursor after input exists:** встраивает packs в runtime-backed module surfaces и отключает mock fallback.
- **Success criteria:** каждый target-модуль имеет минимальный валидный pack или явно подтвержденный pre-live режим.
- **Out of scope:** создание контента «автоматически» средствами Cursor без user-provided input.

### WS-A4. Module refresh: Atlas / Pulse

- **Objective:** обновить Atlas/Pulse до первой честной data-backed frontend поверхности в Wave A.
- **Why now:** strong frontend contour есть, но basis устарела и требует refresh.
- **Dependencies:** WS-A1 (data/ontology subset), WS-A2 truthful state framework.
- **Who/what produces inputs:** User-curated data corrections + existing domain docs.
- **Who/what consumes outputs:** frontend module refresh + demo surface.
- **User prepares manually:** curated source updates и проверки чувствительных полей/связей.
- **Cursor after input exists:** обновляет списки/карточки/детали на реальной data basis.
- **Success criteria:** Atlas/Pulse показывают актуальную data-backed основу без mock fillers.
- **Out of scope:** принудительный app-level extraction `atlas-service`/`pulse-service`.

### WS-A5. Module refresh: Rielt / Space

- **Objective:** перевести `Rielt` и `Space` из пустых/мертвых оболочек в first live surface.
- **Why now:** оба модуля критичны для «живого» восприятия платформы в ближайшей волне.
- **Dependencies:** WS-A2 truthful states, WS-A3 live packs, WS-A1 baseline consistency.
- **Who/what produces inputs:** User (live packs), Cursor (integration/rendering).
- **Who/what consumes outputs:** release/demo readiness stream.
- **User prepares manually:**
  - `Rielt` minimal listing/inquiry pack;
  - `Space` minimal social seed/content pack.
- **Cursor after input exists:**
  - интегрирует real packs;
  - переводит пустые маршруты в live/pre-live states без fake activity.
- **Success criteria:** `Rielt` и `Space` имеют usable first surface на реальных данных.
- **Out of scope:** full feature completeness или глубокая social decomposition.

### WS-A6. Module pre-live preparation: RF / Quest

- **Objective:** снять «мертвое» состояние `RF`/`Quest` через first pack или убедительный pre-live режим.
- **Why now:** полное live-доведение не обязательно в Wave A, но модули не должны оставаться ложными оболочками.
- **Dependencies:** WS-A2 truthful state model, WS-A3 pack availability.
- **Who/what produces inputs:** User (packs optional but preferred), Cursor (pre-live integration).
- **Who/what consumes outputs:** Wave A exit assessment.
- **User prepares manually:**
  - `RF` minimal business/merchant pack (если доступен);
  - `Quest` minimal quest scenario pack (если доступен).
- **Cursor after input exists:**
  - при наличии pack — first data-backed refresh;
  - без pack — строгий pre-live state с явным отсутствием live content.
- **Success criteria:** `RF`/`Quest` не выглядят «сломано живыми»; статус модуля честно читается пользователем.
- **Out of scope:** полная production maturity `RF` и `Quest` в пределах Wave A.

### WS-A7. Release/readiness/demo surface

- **Objective:** зафиксировать проверяемую готовность Wave A surface.
- **Why now:** без gate-логики любая визуальная активность снова будет трактоваться как ложный done.
- **Dependencies:** все WS-A1..WS-A6.
- **Who/what produces inputs:** Cursor evidence blocks + User acceptance review.
- **Who/what consumes outputs:** решение о завершении Wave A и переходе к Wave B planning.
- **User prepares manually:** final acceptance review по модульным состояниям и content validity.
- **Cursor after input exists:** формирует readiness evidence для согласованных путей/модулей.
- **Success criteria:** есть проверяемый набор evidence, что Wave A цели достигнуты.
- **Out of scope:** полная сертификация production maturity всей экосистемы.

## 5. Sequencing inside Wave A

### 5.1 Critical path

1. **WS-A1** Data/ontology practical subset  
2. **WS-A2** Truthful frontend states baseline  
3. **WS-A3** Live content pack preparation and validation  
4. **WS-A5** Rielt/Space first live surface  
5. **WS-A7** Readiness/demo gate

### 5.2 Parallelism

- `WS-A3` (User content prep) идет параллельно с `WS-A1` и `WS-A2`.
- `WS-A4` (Atlas/Pulse refresh) можно запускать после первых выходов `WS-A1`, не дожидаясь полного закрытия `WS-A5`.
- `WS-A6` (RF/Quest pre-live) может идти параллельно `WS-A5`, но его live-вариант блокируется наличием packs.

### 5.3 Blocking dependencies

- Без validated content packs нельзя запускать Cursor integration как live-mode для `Rielt/RF/Quest/Space`.
- Без truthful state baseline (`WS-A2`) запрещено закрывать module refresh как done.
- `WS-A7` не закрывается, пока хотя бы один приоритетный модуль остается в неявном/ложном состоянии.

## 6. Wave A Execution Items

### WA-001

- **Title:** Practical Neon/ontology subset definition
- **Workstream:** WS-A1
- **Description:** определить минимальный набор data/ontology изменений и проверок, достаточный для Wave A модулей.
- **Dependencies:** entry conditions
- **Owner type:** Shared
- **Expected output:** согласованный Wave A data subset list
- **Done when:** subset зафиксирован и принят как baseline для WA-004/WA-006/WA-007

### WA-002

- **Title:** User curated data corrections (Atlas/Pulse-sensitive)
- **Workstream:** WS-A1
- **Description:** пользователь подготавливает curated corrections/source review для Atlas/Pulse data basis.
- **Dependencies:** WA-001
- **Owner type:** User
- **Expected output:** validated input pack для data refresh
- **Done when:** inputs переданы в пригодном для интеграции формате

### WA-003

- **Title:** Frontend truthful state standard
- **Workstream:** WS-A2
- **Description:** зафиксировать и применить единый шаблон honest states (empty/loading/error/pre-live/unavailable).
- **Dependencies:** WA-001
- **Owner type:** Cursor
- **Expected output:** применимый state pattern для модулей Wave A
- **Done when:** шаблон внедрен в target module landings и исключает fake-live поведение

### WA-004

- **Title:** Atlas first refresh integration
- **Workstream:** WS-A4
- **Description:** обновить Atlas surface на новой data basis без mock fillers.
- **Dependencies:** WA-001, WA-002, WA-003
- **Owner type:** Cursor
- **Expected output:** data-backed Atlas lists/cards/details refresh
- **Done when:** Atlas показывает актуальные данные и честные fallback states

### WA-005

- **Title:** Pulse first refresh integration
- **Workstream:** WS-A4
- **Description:** обновить Pulse surface на реальной event basis с честными состояниями.
- **Dependencies:** WA-001, WA-002, WA-003
- **Owner type:** Cursor
- **Expected output:** data-backed Pulse surface refresh
- **Done when:** Pulse отображает реальную basis и не использует invented mock activity

### WA-006

- **Title:** Rielt live content pack preparation
- **Workstream:** WS-A3 / WS-A5
- **Description:** пользователь собирает минимальный live pack для Rielt (listing/inquiry baseline).
- **Dependencies:** WA-001
- **Owner type:** User
- **Expected output:** Rielt pack ready for integration
- **Done when:** pack подтвержден как достаточный для first live surface

### WA-007

- **Title:** Space live content seed preparation
- **Workstream:** WS-A3 / WS-A5
- **Description:** пользователь готовит минимальный social seed для Space без fake activity.
- **Dependencies:** WA-001
- **Owner type:** User
- **Expected output:** Space seed pack
- **Done when:** pack валиден и может быть использован без mock backfill

### WA-008

- **Title:** Rielt first live surface integration
- **Workstream:** WS-A5
- **Description:** интеграция Rielt pack в first live UI surface.
- **Dependencies:** WA-003, WA-006
- **Owner type:** Cursor
- **Expected output:** Rielt live/pre-live truthful module surface
- **Done when:** Rielt больше не пустой shell и не использует invented mocks

### WA-009

- **Title:** Space truthful live/pre-live integration
- **Workstream:** WS-A5
- **Description:** внедрить Space seed и честные social states (без имитации активности).
- **Dependencies:** WA-003, WA-007
- **Owner type:** Cursor
- **Expected output:** Space usable first surface
- **Done when:** Space выглядит живым только в пределах фактического content seed

### WA-010

- **Title:** RF minimal content pack (preferred) or pre-live declaration
- **Workstream:** WS-A3 / WS-A6
- **Description:** пользователь либо готовит RF pack, либо фиксирует отсутствие pack для controlled pre-live режима.
- **Dependencies:** WA-001
- **Owner type:** User
- **Expected output:** RF input decision (`pack-ready` или `pre-live-only`)
- **Done when:** есть явный RF input contract для Cursor

### WA-011

- **Title:** Quest minimal content pack (preferred) or pre-live declaration
- **Workstream:** WS-A3 / WS-A6
- **Description:** пользователь либо готовит Quest pack, либо фиксирует pre-live-only состояние.
- **Dependencies:** WA-001
- **Owner type:** User
- **Expected output:** Quest input decision (`pack-ready` или `pre-live-only`)
- **Done when:** есть явный Quest input contract для Cursor

### WA-012

- **Title:** RF module execution path
- **Workstream:** WS-A6
- **Description:** в зависимости от WA-010: интеграция pack или честный pre-live state.
- **Dependencies:** WA-003, WA-010
- **Owner type:** Cursor
- **Expected output:** RF module в live-lite или truthful pre-live режиме
- **Done when:** RF не выглядит мертвым/фейково живым

### WA-013

- **Title:** Quest module execution path
- **Workstream:** WS-A6
- **Description:** в зависимости от WA-011: интеграция pack или честный pre-live state.
- **Dependencies:** WA-003, WA-011
- **Owner type:** Cursor
- **Expected output:** Quest module в live-lite или truthful pre-live режиме
- **Done when:** Quest состояние прозрачно и не маскирует отсутствие данных

### WA-014

- **Title:** Anti-mock enforcement pass
- **Workstream:** WS-A2 / WS-A7
- **Description:** убрать/заблокировать mock resurrection на target-модулях Wave A.
- **Dependencies:** WA-003, WA-008, WA-009, WA-012, WA-013
- **Owner type:** Cursor
- **Expected output:** модульные surfaces без invented mock sources
- **Done when:** проверка не выявляет новых mock fallback веток в Wave A модулях

### WA-015

- **Title:** Wave A readiness evidence pack
- **Workstream:** WS-A7
- **Description:** собрать evidence по module states, data basis и demo-ready surface.
- **Dependencies:** WA-004, WA-005, WA-008, WA-009, WA-012, WA-013, WA-014
- **Owner type:** Shared
- **Expected output:** Wave A readiness summary for go/no-go
- **Done when:** evidence подтверждает выполнение exit criteria без status inflation

## 7. Explicitly Deferred from Wave A

- полный redesign экосистемы и полная продуктовая реархитектура;
- полная зрелость `token-service` и long-horizon token/NFT contour decisions;
- полная decomposition closure для `feed-service` vs `space-service`;
- полная social/domain ownership normalization beyond already accepted policy boundaries;
- полная очистка всех historical legacy traces во всех docs и runtime;
- полная миграция всех данных платформы одним циклом;
- детальный Wave B/C delivery plan (вне scope этого документа).

## 8. Wave A Exit Criteria

Wave A считается успешной, когда одновременно выполнено:

1. Frontend больше не выглядит системно мертвым на приоритетных Wave A модулях.
2. Внедрены truthful states для пустых/неготовых поверхностей (без fake-live masks).
3. Atlas/Pulse имеют first refreshed data-backed basis.
4. Rielt/Space имеют first live surface на user-prepared реальном контенте.
5. RF/Quest имеют либо first pack-backed surface, либо явно и качественно оформленный pre-live режим.
6. Anti-mock policy реально применена и mock resurrection не наблюдается.
7. Wave A readiness evidence сформирован и допускает переход к planning Wave B без governance rollback.

## 9. Risks and Safeguards for Wave A

### 9.1 Risks

- user content packs приходят неравномерно по модулям;
- Cursor может откатиться в invented mocks при дефиците входных данных;
- WS-A1 data alignment может занять больше времени, чем ожидалось;
- frontend refresh может обогнать runtime/data truth;
- module priorities могут дрейфовать в сторону «самых заметных экранов», а не критического пути.

### 9.2 Safeguards

- no mock resurrection: отсутствие live pack не разрешает генерацию новых моков;
- truthful states first: сначала честное состояние, потом live rendering;
- user-content-gated integration: модульный live refresh только после confirmed user pack;
- anchor/master-plan alignment: любые спорные статусные трактовки сверяются с status anchor;
- no silent scope expansion: добавление крупных задач вне Wave A только через явный re-baseline.

## 10. Anti-Mock Policy (Wave A)

1. Отсутствие live content pack **не** является основанием для генерации новых моков.
2. Пустой модуль переводится в honest `pre-live` / `empty` / `unavailable` state.
3. Mock resurrection без явного решения владельца — недопустим.
4. Cursor не перевыдумывает структуру страницы только из-за отсутствия данных.
5. Последовательность обязательна: **truth/state/content input -> module rendering**.

## 11. How to Use This Queue

- Следующие задачи Cursor ставятся по WA-item ID (`WA-001`, `WA-002`, ...), а не произвольными наборами.
- Каждый task должен ссылаться минимум на:
  - соответствующий WA-item,
  - связанный workstream,
  - входные зависимости.
- Completion фиксируется обновлением статуса WA-items (pending/in-progress/done) в рабочем трекере команды.
- Если появляется задача, не укладывающаяся в Wave A scope:
  - не расширять очередь молча,
  - фиксировать как candidate для Wave B planning.
- Wave B создается, когда Wave A exit criteria закрыты или когда зафиксирован осознанный stop-point с прозрачным unresolved списком.

## 12. Files Used

- `docs/plans/go2asia_execution_master_plan_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`
- `docs/plans/go2asia_actual_state_reconciliation_v1.md`
- `docs/plans/go2asia_normalization_queue_v1.md`
- `docs/backend/api_gateway/overview.md`
- `docs/ops/runbooks.md`
- `docs/ops/staging_services_overview.md`
