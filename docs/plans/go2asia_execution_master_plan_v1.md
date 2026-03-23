# Go2Asia Execution Master Plan v1

Status: active current execution anchor  
Date: 2026-03-23  
Owner role: Architecture + Delivery Governance (cross-domain)

## 1. Purpose and Authority

Этот документ является **текущим execution master plan** для следующего инженерного цикла Go2Asia.

Он:

- задает текущий execution anchor для delivery sequencing;
- опирается на нормализованную governance-базу и подтвержденную repo/code reality;
- определяет dependency-aware работу по workstreams с явными criteria и gates.

Он **supersedes как active execution anchor**:

- `docs/plans/go2asia_next_steps_plan_2026_march_10.md`
- `docs/plans/mvp_implementation_plan.md`

Эти документы сохраняются как historical/reference artifacts и не переопределяют текущий execution truth.

Status truth для любого контура читается через:

- `docs/plans/go2asia_status_anchor_v1.md` (canonical status anchor)

## 2. Current Execution Baseline

### 2.1 Normalization baseline already completed

На момент выпуска этого master plan как governance baseline уже нормализованы:

- status truth hierarchy (NQ-001);
- staging deploy policy alignment (NQ-002);
- gateway auditable boundary docs gap (NQ-006);
- Atlas/Pulse target vs actual allocation interpretation (NQ-007);
- Feed vs Space client-facing path truth (NQ-008);
- Content vs Space/Reactions policy boundary (NQ-009);
- repo/workspace truth model (NQ-011).

### 2.2 Current reliable planning truth

- `go2asia_status_anchor_v1.md` используется как единый operational status reference.
- `go2asia_actual_state_reconciliation_v1.md` — factual inventory/reality map.
- `go2asia_reconciliation_conflict_index_v1.md` — индекс конфликтов и их типов.
- `go2asia_normalization_queue_v1.md` — governance queue для remaining normalization.

### 2.3 Controlled unresolved zones

Ниже остаются зоны, которые считаются **контролируемыми, но не закрытыми**:

- `auth-service` vs `user_service` naming drift;
- deeper ownership/decomposition: `feed-service` vs `space-service`;
- Atlas/Pulse dedicated service extraction не подтверждена app-level evidence;
- `token-service` contour split и phase classification;
- quest prefix drift в части ops-prose;
- неоднородная frontend evidence для `media/points/reactions/token`;
- endpoint-level gateway route ownership detail (за пределами high-level boundary map).

## 3. Planning Assumptions

### 3.1 Platform assumptions

- `api-gateway` — единый edge/perimeter boundary текущего цикла.
- User JWT verification выполняется на gateway (ADR-0015 boundary).
- Downstream contracts и бизнес-логика остаются в service-level docs/openapi.
- Staging deploy policy читается через ADR-0017 + workflow, не через разрозненную prose.

### 3.2 Governance assumptions

- Plan не повышает contour status без подтверждения через anchor/reconciliation evidence.
- UI integration не трактуется как эквивалент backend operational readiness.
- closure/freeze notes изменяют execution truth только при синхронизации с status anchor.

### 3.3 Repo/docs/status assumptions

- `docs/backend/*` описывает контуры/контракты, но не доказывает 1:1 app allocation.
- `pnpm-workspace.yaml` не считается canonical inventory active services.
- Canonical inventory читается через фактические `apps/*`, `packages/*` и reconciliation/anchor.

### 3.4 Delivery assumptions

- План строится на controlled parallelism, а не на жесткой линейной цепочке.
- Critical path проходит через platform/governance/readiness gates.
- Незапланированные redesign-инициативы не втягиваются в текущий execution cycle без явного re-baseline.

## 4. Current State Synthesis by Contour

### 4.1 Platform core

- `api-gateway`: `baseline-present`, boundary-doc surface подтвержден; глубокий endpoint-level ownership detail остается долгом.
- `auth-service`: `partial-live`, naming + hardening ambiguity сохраняется.
- `content-service`: `partial-live`, policy boundary нормализована; runtime de-legacy не полностью закрыт.
- `media-service`: `code-present`, прямой frontend evidence ограничен.
- `points-service`: `baseline-present`.
- `referral-service`: `partial-live`, есть risk mock-like usage в frontend сценариях.
- `token-service`: `mixed / unresolved`, phase/model split сохраняется.

### 4.2 Social / engagement

- `space-service`: `operational-with-debt`.
- `reactions-service`: `baseline-present`, frontend evidence неравномерна.
- `feed-service`: `partial-live`; canonical client-facing path зафиксирован как `/v1/space/feed/*`.
- `quest-service`: `operational-with-debt`, есть prefix/document drift зона.

### 4.3 Domain/data contours

- `atlas`, `pulse`: strong doc-defined domains + strong frontend usage, но отдельные app-level services не подтверждены.
- `rielt-service`, `rf-service`, `guru-service`: `operational-with-debt` с отложенной глубиной отдельных направлений.

### 4.4 Frontend and integration reality

- Shell integration по модулям неоднородна: сильные зоны coexist с integration gaps.
- Планирование должно учитывать не только наличие UI маршрутов, но и доказанность backend readiness/ops/testing.

### 4.5 Ops/release reality

- OpenAPI discipline и DB policy присутствуют как governance baselines.
- release/readiness должны опираться на runbook-ready критерии, а не только на feature completion.

## 5. Execution Strategy

Следующий цикл строится как **governance-aligned delivery**, где:

1. Сначала стабилизируется platform/readiness контур (contracts, auth boundary usage, release gates).
2. Затем синхронизируется social/domain execution на подтвержденных boundaries.
3. Параллельно ведется controlled frontend live adoption по подтвержденным backend contours.
4. Deferred и unresolved зоны удерживаются в явном виде, чтобы не искажать delivery truth.

Ключевые принципы стратегии:

- не строить delivery на предположении «всё already operational»;
- не блокировать весь цикл из-за нерелевантных deferred contours;
- не разворачивать архитектурный redesign внутри execution cycle без отдельного решения.

## 6. Workstreams

### WS-1 Platform / Gateway / Contracts / Ops

- **Objective:** удержать и развить platform baseline как надежную execution основу.
- **Current baseline:** gateway boundary нормализован; staging policy и contract governance в baseline.
- **Dependencies:** status anchor rules, ADR-0015/0017, ops + workflow consistency.
- **Near-term focus:**
  - поддерживать consistency gateway boundary docs <-> runtime reality;
  - закрывать локальные ops/prose drifts без пересмотра policy;
  - enforce contract discipline в delivery PRs.
- **Completion / move-forward criteria:**
  - нет новых policy drifts между ADR/workflow/ops;
  - platform-related release checks стабильны в цикле;
  - нет regressions в gateway boundary interpretation.

### WS-2 Social / Engagement Execution

- **Objective:** развивать social execution без потери ownership clarity.
- **Current baseline:** Space/Feed/Reactions/Quest в mixed operating mode с частичными debt zones.
- **Dependencies:** WS-1 platform stability; нормализованные client-facing path rules.
- **Near-term focus:**
  - execution задач на `space-service` и `quest-service` с учетом debt-aware readiness;
  - не смешивать feed client-path truth с глубокой ownership-декомпозицией;
  - улучшать evidence по `reactions` без искусственного status uplift.
- **Completion / move-forward criteria:**
  - social features проходят agreed readiness checks;
  - отсутствуют новые ownership contradictions в docs/implementation notes;
  - feed/space client-path truth остается непротиворечивым.

### WS-3 Domain Services and Consolidations

- **Objective:** вести доменные контуры (Atlas/Pulse/Rielt/RF/Guru) в режиме target-aware, evidence-first delivery.
- **Current baseline:** Atlas/Pulse doc-strong + app-allocation unresolved; другие домены operational-with-debt.
- **Dependencies:** repo truth model (NQ-011), status anchor rules.
- **Near-term focus:**
  - delivery по доменным сценариям без ложного предположения dedicated app extraction;
  - удержание cross-domain ссылочной целостности и контурных границ;
  - фиксировать debt/deferral прямо в execution artifacts.
- **Completion / move-forward criteria:**
  - доменные изменения не создают новых target-vs-actual конфликтов;
  - cross-domain dependencies документированы и исполнимы;
  - нет неявного «обещания» отдельного сервиса без app/runtime evidence.

### WS-4 Frontend Integration / Live Adoption

- **Objective:** выровнять frontend live adoption с реальной backend readiness.
- **Current baseline:** сильные интеграции в части доменов и social shell, но uneven evidence по ряду контуров.
- **Dependencies:** WS-1 contracts/ops stability, WS-2/WS-3 contour clarity.
- **Near-term focus:**
  - приоритизировать integration work по контурам с подтвержденным baseline;
  - не считать UI exposure автоматическим production readiness signal;
  - устранять integration blind spots (`media/points/reactions/token`) по evidence-driven подходу.
- **Completion / move-forward criteria:**
  - для приоритетных UI flows есть подтверждение backend + testing readiness;
  - снижено число mock-like или weak-evidence user paths;
  - фронтенд milestones синхронизированы с status anchor updates.

### WS-5 Data / Content / Import / SSOT Alignment

- **Objective:** удерживать данные и контентные контуры в SSOT-consistent состоянии.
- **Current baseline:** DB/OpenAPI baselines strong; content social-boundary policy нормализована, legacy traces частично остаются.
- **Dependencies:** WS-1 governance discipline, WS-3 domain updates.
- **Near-term focus:**
  - поддержание миграций/схем/контрактов без drift;
  - контролируемое выжигание legacy формулировок и runtime traces;
  - consistency импортов/справочников для Atlas/Pulse в рамках текущего цикла.
- **Completion / move-forward criteria:**
  - нет schema/contract drift между package SSOT и runtime;
  - content/social policy не размывается новыми формулировками;
  - data integrity риски не блокируют release gates.

### WS-6 Release / Testing / Readiness

- **Objective:** сделать release decision evidence-based, а не narrative-based.
- **Current baseline:** runbooks/ops frameworks присутствуют, readiness неоднородна по контурам.
- **Dependencies:** все WS, особенно WS-1 и WS-4.
- **Near-term focus:**
  - унифицировать baseline readiness checks по приоритетным контурам;
  - подтверждать smoke/contract behavior для целевых route families;
  - держать rollback и incident response в практическом, проверяемом состоянии.
- **Completion / move-forward criteria:**
  - release gate decisions опираются на проверяемые evidence-блоки;
  - уменьшается доля ambiguous go/no-go сигналов;
  - post-release regressions отслеживаются и закрываются в рамках цикла.

## 7. Sequencing and Dependencies

### 7.1 Critical path

1. WS-1 platform/contracts/ops consistency  
2. WS-6 readiness gate stabilization for active contours  
3. WS-2 social execution on normalized boundaries  
4. WS-4 frontend live adoption for confirmed backend baselines

### 7.2 Parallelizable execution

- WS-3 (domain consolidations) можно вести параллельно с WS-2/WS-4 при соблюдении repo truth rules.
- WS-5 data/SSOT alignment выполняется фоново-параллельно ко всем functional streams.

### 7.3 Dependency notes

- Frontend expansion без WS-1/WS-6 readiness усилит ложную готовность.
- Domain extraction decisions (Atlas/Pulse) не должны блокировать текущую delivery-полосу, если остаются явно deferred.
- Token contour changes не должны попадать в critical path без явного scope decision.

## 8. Priority Execution Waves

### Wave A — Baseline Execution Stabilization

- Focus: WS-1 + WS-6 foundational checks, high-confidence contours first.
- Entry criteria:
  - status anchor and reconciliation artifacts актуальны;
  - governance baseline нормализован (NQ-001/002/006/007/008/009/011 выполнены).
- Exit criteria:
  - нет новых governance/policy contradictions;
  - readiness decisions по активным контурам принимаются на evidence basis.

### Wave B — Controlled Feature Delivery on Confirmed Boundaries

- Focus: WS-2 + WS-4 + WS-3 for contours with baseline/partial-live evidence.
- Entry criteria:
  - Wave A gates соблюдены;
  - dependency map между social/domain/frontend согласован.
- Exit criteria:
  - ключевые delivery increments завершены без ownership drift;
  - integration coverage расширена в приоритетных user paths.

### Wave C — Debt Burn-down and Gate Hardening

- Focus: WS-5 + WS-6 + targeted unresolved closures.
- Entry criteria:
  - Wave B delivered without critical drift regressions.
- Exit criteria:
  - controlled unresolved list сокращен или явно re-baselined;
  - следующий execution cycle может стартовать без governance rollback.

## 9. Explicit Deferred Scope

Вне текущего execution cycle (если нет отдельного owner decision):

- полный endpoint-level route ownership atlas для всех сервисов;
- принудительный Atlas/Pulse app-level extraction как обязательный deliverable;
- полный redesign feed/space backend decomposition;
- полный redesign token contour и long-horizon blockchain/NFT scope;
- broad architecture rewrite по social/content beyond текущих policy boundaries;
- многоволновой продуктовый roadmap за пределами ближайшего execution cycle.

## 10. Risks, Drift Traps, and Safeguards

### 10.1 Remaining risks

- повторное смешение historical plans и current execution truth;
- возврат к UI-driven status inflation без backend evidence;
- docs drift между ADR/workflow/ops при быстрых change cycles;
- ownership drift в social/domain границах при параллельной delivery.

### 10.2 Drift traps

- трактовка `docs/backend/*` как «доказательство live runtime»;
- трактовка `pnpm-workspace.yaml` как реестр реально работающих сервисов;
- неявная смена status без обновления anchor.

### 10.3 Safeguards

- любой статусный сдвиг фиксируется через update `go2asia_status_anchor_v1.md`;
- closure/freeze/milestone notes сопровождаются ссылкой на anchor update;
- execution PRs для критичных контуров проходят check на contract/ops consistency;
- deferred scope сохраняется явным разделом, а не «утилизируется» в active backlog.

## 11. Operational Usage Rules

- Этот документ используется как **current execution planning anchor** до выпуска следующей версии master plan.
- Любое изменение execution priorities должно:
  - ссылаться на актуальный `go2asia_status_anchor_v1.md`;
  - проверяться против reconciliation/conflict index при затрагивании спорных контуров.
- Если появляется новый конфликт уровня policy/status truth:
  - сначала фиксируется в conflict/normalization artifacts;
  - затем обновляется этот master plan.
- Новый closure note, влияющий на sequencing или readiness gates, должен в том же PR:
  - либо обновить этот план,
  - либо явно пометить required follow-up update.

## 12. Files Used

Primary foundation:

- `docs/plans/go2asia_status_anchor_v1.md`
- `docs/plans/go2asia_actual_state_reconciliation_v1.md`
- `docs/plans/go2asia_reconciliation_conflict_index_v1.md`
- `docs/plans/go2asia_normalization_queue_v1.md`

Supporting context:

- `docs/backend/api_gateway/overview.md`
- `docs/decisions/adr_0015_jwt_verification_at_gateway.md`
- `docs/ops/staging_services_overview.md`
- `docs/ops/runbooks.md`
- `docs/plans/go2asia_next_steps_plan_2026_march_10.md` (historical/reference)
- `docs/plans/mvp_implementation_plan.md` (historical/reference)
- `docs/plans/go2asia_plan_reconciliation_note_v1.md` (supporting reconciliation context)
- `docs/architecture/system_status_2026_march_10.md` (historical snapshot context)
