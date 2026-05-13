# Review Pipeline Go2Asia

## Назначение документа

Документ описывает, когда и как запускаются режимы ревью (sub-agent / review-mode) у ключевых AI-агентов Go2Asia.

После принятия ADR-005 review pipeline расширен под Go2Asia AI Ops v1 и 15-ролевую layered multi-agent governance model.

Основная цель review pipeline:

- не забывать контрольные точки;
- не превращать ревью в хаотичную дополнительную опцию;
- снижать архитектурный, технический, runtime, security и economy debt;
- предотвращать unbounded implementation;
- обеспечивать evidence-first подход для runtime-sensitive задач;
- сохранять canon alignment между docs, ADR, workflows и runtime.

---

# 1. Общий принцип

Для каждого значимого артефакта действует правило:

> Сначала создание основным агентом → затем обязательное ревью профильным агентом / review-mode.

Ревью является частью Definition of Done.

Задача НЕ считается завершённой, если:

- required review не проведён;
- review status = needs_revision;
- review status = blocked;
- review findings не обработаны;
- required docs/canon updates не выполнены;
- required runtime evidence отсутствует.

---

# 2. Базовые review modes

## 2.1. Requirements Review

### Ответственный агент

- Requirements Analyst

### Когда запускать

- после создания нового ТЗ;
- после существенного изменения ТЗ;
- перед передачей ТЗ Architect;
- если downstream-этап обнаружил неполноту требований.

### Что проверяется

- полнота требований;
- user stories;
- acceptance criteria;
- отсутствие противоречий;
- связь с roadmap;
- достаточность для архитектуры и планирования.

### Куда сохранять

- `docs/reviews/tz/review_<yyyy-mm-dd>_<scope>.md`

### Статусы

- `requirements_status: approved`
- `requirements_status: needs_revision`
- `requirements_status: blocked`

---

## 2.2. Architecture Review

### Ответственный агент

- Software Architect

### Когда запускать

- после создания архитектурного документа;
- при изменении API;
- при изменении схемы данных;
- при изменении service boundaries;
- при изменении canonical source;
- при изменении lifecycle model;
- при изменении microservices interaction.

### Что проверяется

- совместимость с ADR;
- сервисные границы;
- API contracts;
- data model;
- scalability;
- maintainability;
- runtime implications;
- security implications;
- migration risks.

### Куда сохранять

- `docs/reviews/architecture/review_<yyyy-mm-dd>_<scope>.md`

### Статусы

- `architecture_status: approved`
- `architecture_status: needs_revision`
- `architecture_status: blocked`

---

## 2.3. Plan Review

### Ответственный агент

- Delivery Planner

### Когда запускать

- после создания phase plan;
- после создания stage plan;
- после создания sprint plan;
- перед стартом крупного модуля;
- перед high/critical implementation;
- если изменился scope или dependency map.

### Что проверяется

- структура phase → stage → slice → task;
- зависимости;
- blockers;
- agent assignment;
- model routing;
- context capsule;
- review gates;
- QA/validation plan;
- docs/canon plan;
- realism of scope.

### Куда сохранять

- `docs/reviews/plans/review_<yyyy-mm-dd>_<scope>.md`

### Статусы

- `plan_status: approved`
- `plan_status: needs_revision`
- `plan_status: blocked`

---

## 2.4. Code Review

### Ответственные агенты

- Backend Developer;
- Frontend Developer, если затронут frontend;
- QA Agent;
- Security / SecOps.

### Когда запускать

- перед merge значимых backend changes;
- при изменении API endpoints;
- при изменении Prisma/SQL/schema;
- при изменении `packages/sdk/**`;
- при изменении `packages/types/**`;
- при изменении критичных UI компонентов;
- при изменении role-based behavior;
- при изменении business logic.

### Что проверяется

- correctness;
- maintainability;
- tests;
- API compatibility;
- validation;
- error handling;
- security implications;
- regression risk;
- adherence to architecture.

### Куда сохранять

- `docs/reviews/code/review_<yyyy-mm-dd>_<service_or_module>.md`

### Статусы

- `code_status: approved`
- `code_status: needs_revision`
- `code_status: blocked`

---

# 3. Advanced Review Modes

## 3.1. Economy Review

### Ответственный агент

- Economy Architect

### Когда запускать

Economy Review обязателен при изменениях:

- Points policy;
- G2A policy;
- NFT utility;
- reward rules;
- spendability;
- token sinks;
- premium voucher redemption;
- partner settlement;
- PRO incentives;
- referral rewards;
- reward lifecycle;
- wallet economy;
- RF voucher economy.

### Что проверяется

1. Источник награды.
2. Получатель награды.
3. Условие начисления.
4. Момент перехода в available.
5. Правило траты.
6. Token sink.
7. Anti-inflation controls.
8. Reward loop safety.
9. Spendability correctness.
10. Settlement consistency.
11. Role impact.
12. Economic abuse risks.
13. Acceptance criteria.
14. Required backend implications.
15. Required QA cases.

### Куда сохранять

Предпочтительно:

- `docs/reviews/economy/review_<yyyy-mm-dd>_<scope>.md`

Если отдельная директория `docs/reviews/economy/` ещё не утверждена, временно использовать:

- `docs/reviews/architecture/review_<yyyy-mm-dd>_<scope>.md`
- или `docs/reviews/code/review_<yyyy-mm-dd>_<scope>.md`

и явно указать в отчёте, что требуется отдельная review structure / ADR.

### Статусы

- `economy_status: approved`
- `economy_status: needs_revision`
- `economy_status: blocked`

---

## 3.2. Fraud & Abuse Review

### Ответственный агент

- Security / Fraud & Abuse Security Specialist

Реализуется через расширенную роль `roles/security.md`.

### Когда запускать

Fraud & Abuse Review обязателен при изменениях:

- Points rewards;
- G2A rewards;
- NFT mechanics;
- spendability;
- referral rewards;
- PRO attribution;
- voucher claim/redeem;
- premium voucher redemption;
- partner settlement;
- merchant dashboard;
- wallet logic;
- reconciliation logic;
- lifecycle transitions;
- reward automation;
- user-generated activity rewards.

### Что проверяется

1. Можно ли получить reward без реального действия?
2. Можно ли получить reward повторно?
3. Можно ли получить reward через self-referral?
4. Можно ли создать circular referral loop?
5. Можно ли подменить attribution?
6. Можно ли подменить ownership?
7. Можно ли выполнить double claim?
8. Можно ли выполнить double redeem?
9. Можно ли выполнить double spend?
10. Можно ли обойти pending / available lifecycle?
11. Можно ли использовать race condition?
12. Можно ли использовать replay?
13. Можно ли использовать stale projection?
14. Можно ли использовать delayed reconciliation?
15. Есть ли rate limits?
16. Есть ли idempotency?
17. Есть ли audit trail?
18. Есть ли anomaly detection?
19. Есть ли manual review для high-risk кейсов?
20. Есть ли DB-level protection?

### Куда сохранять

Предпочтительно:

- `docs/reviews/security/review_<yyyy-mm-dd>_<scope>.md`

Если отдельная директория `docs/reviews/security/` ещё не утверждена, временно использовать:

- `docs/reviews/code/review_<yyyy-mm-dd>_<scope>.md`

и явно указать `[FRAUD]`, `[ABUSE]`, `[SECURITY]`.

### Статусы

- `security_risk: acceptable / needs_fix_before_merge / blocked`
- `abuse_risk: acceptable / needs_fix_before_merge / blocked`

---

## 3.3. Runtime Governance Review

### Ответственный агент

- Runtime Governance Architect

### Когда запускать

Runtime Governance Review обязателен при изменениях:

- lifecycle;
- projections;
- canonical source;
- reconciliation;
- derived state;
- shadow compare;
- runtime invariants;
- wallet summaries;
- settlement summaries;
- attribution lifecycle;
- RF voucher lifecycle;
- spendability lifecycle.

### Что проверяется

1. Canonical ownership.
2. Projection ownership.
3. Lifecycle states.
4. Valid transitions.
5. Invalid transitions.
6. Runtime invariants.
7. Reconciliation safety.
8. Retry safety.
9. Replay safety.
10. Eventual consistency assumptions.
11. Drift detection.
12. Shadow compare expectations.
13. Rollback semantics.
14. Observability.
15. Runtime acceptance criteria.

### Куда сохранять

Предпочтительно:

- `docs/reviews/runtime/review_<yyyy-mm-dd>_<scope>.md`

Если отдельная директория `docs/reviews/runtime/` ещё не утверждена, временно использовать:

- `docs/reviews/architecture/review_<yyyy-mm-dd>_<scope>.md`

и явно пометить отчёт как Runtime Governance Review.

### Статусы

- `runtime_status: approved`
- `runtime_status: needs_revision`
- `runtime_status: blocked`

---

## 3.4. Runtime Validation Review

### Ответственный агент

- Runtime Validation Agent

### Когда запускать

Runtime Validation Review обязателен при:

- staging validation;
- runtime-sensitive implementation;
- shadow validation;
- evidence bundle completion;
- reconciliation validation;
- spendability validation;
- voucher lifecycle validation;
- settlement validation;
- pre-release validation для high/critical изменений.

### Что проверяется

1. Lifecycle correctness.
2. Projection alignment.
3. Reconciliation correctness.
4. Retry safety.
5. Replay safety.
6. Runtime invariants.
7. Evidence completeness.
8. Observability.
9. Metrics.
10. Drift findings.
11. Aggregate consistency.
12. Settlement consistency.
13. Spendability correctness.
14. Rollback safety.
15. Operational stability.

### Куда сохранять

Предпочтительно:

- `docs/reviews/runtime_validation/review_<yyyy-mm-dd>_<scope>.md`

Если отдельная директория `docs/reviews/runtime_validation/` ещё не утверждена, временно использовать:

- `docs/reviews/code/review_<yyyy-mm-dd>_<scope>.md`
- или `docs/reviews/architecture/review_<yyyy-mm-dd>_<scope>.md`

и явно пометить отчёт как Runtime Validation Review.

### Статусы

- `validation_status: approved`
- `validation_status: needs_revision`
- `validation_status: blocked`

---

## 3.5. Slice Review

### Ответственный агент

- Slice Strategist

### Когда запускать

Slice Review обязателен:

- перед high/critical slice;
- если задача слишком большая;
- если scope unbounded;
- если Cursor начал терять контекст;
- если stage включает economy/security/runtime changes;
- если implementation предлагается без audit/contract;
- перед большим refactor;
- перед complex stabilization task.

### Что проверяется

1. Bounded scope.
2. Clear out of scope.
3. Single primary goal.
4. Single primary risk.
5. Required context capsule.
6. Required agents.
7. Recommended model.
8. Review triggers.
9. Validation method.
10. Stop conditions.
11. Follow-up slices.
12. No big-bang implementation.

### Куда сохранять

Предпочтительно:

- `docs/reviews/plans/review_<yyyy-mm-dd>_<scope>.md`

Если в будущем будет утверждена отдельная директория:

- `docs/reviews/slices/review_<yyyy-mm-dd>_<scope>.md`

### Статусы

- `slice_status: approved`
- `slice_status: needs_revision`
- `slice_status: blocked`

---

## 3.6. Canon Review

### Ответственный агент

- Technical Canon Writer

### Когда запускать

Canon Review обязателен при изменениях:

- ADR;
- architecture docs;
- AI roles;
- workflows;
- agents index;
- roles overview;
- context map;
- runtime contracts;
- economy/security decisions;
- docs/runtime alignment;
- stage/slice completion;
- release readiness docs.

### Что проверяется

1. ADR consistency.
2. SSOT consistency.
3. Runtime/docs consistency.
4. Terminology consistency.
5. Module boundary consistency.
6. Workflow consistency.
7. AI roles consistency.
8. Review pipeline consistency.
9. Context map consistency.
10. Open questions visibility.
11. Deprecated docs handling.
12. Follow-up docs list.

### Куда сохранять

Предпочтительно:

- `docs/reviews/canon/review_<yyyy-mm-dd>_<scope>.md`

Если отдельная директория `docs/reviews/canon/` ещё не утверждена, временно использовать:

- `docs/reviews/architecture/review_<yyyy-mm-dd>_<scope>.md`
- или релевантный существующий review folder.

### Статусы

- `canon_status: aligned`
- `canon_status: needs_revision`
- `canon_status: blocked`

---

# 4. Review trigger matrix

| Trigger | Required review |
|---|---|
| Новое или изменённое ТЗ | Requirements Review |
| Архитектура, API, DB, service boundaries | Architecture Review |
| Phase/stage/sprint plan | Plan Review |
| High/critical/unbounded scope | Slice Review |
| Backend/frontend/SDK/types critical code | Code Review |
| Auth, roles, secrets, sensitive data | Security Review |
| Rewards, vouchers, referrals, settlement, spendability | Fraud & Abuse Review |
| Points, G2A, NFT, token sinks, economy rules | Economy Review |
| Lifecycle, projections, reconciliation, canonical source | Runtime Governance Review |
| Staging, shadow compare, evidence bundle, runtime proof | Runtime Validation Review |
| ADR, docs, roles, workflows, context map | Canon Review |

---

# 5. Review pipeline by task type

## 5.1. Новая функциональность

Required reviews:

1. Requirements Review
2. Architecture Review
3. Plan Review
4. Code Review
5. Security Review
6. Canon Review

Additional reviews:

- Economy Review, если есть economy;
- Runtime Governance Review, если есть lifecycle/projections;
- Runtime Validation Review, если нужен runtime proof;
- Fraud & Abuse Review, если есть incentives/rewards/vouchers.

---

## 5.2. RF Voucher / PRO Attribution / Settlement

Required reviews:

1. Runtime Governance Review
2. Economy Review
3. Fraud & Abuse Review
4. Code Review
5. Runtime Validation Review
6. Canon Review

Architecture Review обязателен, если меняется API/DB/service boundary.

---

## 5.3. Points / G2A / NFT / Spendability

Required reviews:

1. Economy Review
2. Fraud & Abuse Review
3. Runtime Governance Review
4. Security Review
5. Code Review, если есть implementation
6. Runtime Validation Review, если есть staging/runtime proof
7. Canon Review

---

## 5.4. Runtime Stabilization / Projection Drift

Required reviews:

1. Runtime Governance Review
2. Runtime Validation Review
3. Code Review, если есть fix
4. Security Review, если есть replay/race/abuse risk
5. Economy Review, если есть balances/rewards/settlement impact
6. Canon Review

---

## 5.5. Security / Fraud / Abuse

Required reviews:

1. Security Review
2. Fraud & Abuse Review, если есть abuse surface
3. Code Review, если есть fix
4. Runtime Validation Review, если нужно staging evidence
5. Canon Review

---

## 5.6. AI Roles / Workflows / AI Ops

Required reviews:

1. Canon Review
2. Architecture Review, если меняется структура AI-системы
3. Plan Review, если меняется delivery/planning process
4. Slice Review, если изменение крупное

ADR update обязателен, если решение меняет принципы системы.

---

# 6. Review result format

Каждый review-файл должен содержать:

1. Review type
2. Scope
3. Reviewed artifacts
4. Reviewer agent
5. Date
6. Summary
7. Findings
8. Severity / risk level
9. Required fixes
10. Recommendations
11. Follow-up tasks
12. Final status

Для security/fraud:

- `[SECURITY]`
- `[FRAUD]`
- `[ABUSE]`

Для runtime:

- `[RUNTIME]`
- `[DRIFT]`
- `[RECONCILIATION]`
- `[EVIDENCE]`

Для economy:

- `[ECONOMY]`
- `[SPENDABILITY]`
- `[REWARD]`
- `[SETTLEMENT]`

Для canon:

- `[CANON]`
- `[ADR]`
- `[SSOT]`
- `[DOCS_RUNTIME]`

---

# 7. Review status rules

## Approved

Можно продолжать к следующему этапу.

## Needs revision

Нужно доработать артефакт и повторить review.

## Blocked

Нельзя продолжать без решения Orchestrator / владельца проекта / ADR.

---

# 8. Orchestrator responsibilities

Orchestrator обязан:

1. Определить required review gates на этапе task intake.
2. Указать review gates в Cursor prompt.
3. Проверить, что review-файл создан.
4. Проверить, что status не blocked.
5. Если status = needs_revision, вернуть задачу на доработку.
6. Если status = blocked, остановить работу и запросить решение владельца проекта.
7. После завершения review передать findings Technical Canon Writer, если требуется canon update.

---

# 9. Правило временного использования существующих review folders

ADR-003 ограничивает преждевременное расширение структуры.

Поэтому если новые review directories ещё не утверждены, разрешено временно использовать существующие:

- `docs/reviews/tz/`
- `docs/reviews/architecture/`
- `docs/reviews/plans/`
- `docs/reviews/code/`

с явной пометкой review type внутри файла.

Если новые review types станут регулярными и объёмными, Orchestrator должен инициировать отдельное решение или ADR о расширении review structure.

---

# 10. Recommended review directories

Целевая структура может быть такой:

- `docs/reviews/tz/`
- `docs/reviews/architecture/`
- `docs/reviews/plans/`
- `docs/reviews/code/`
- `docs/reviews/security/`
- `docs/reviews/economy/`
- `docs/reviews/runtime/`
- `docs/reviews/runtime_validation/`
- `docs/reviews/canon/`

Создание новых директорий требует согласования с Orchestrator и должно учитывать ADR-003.

---

# 11. Definition of Done

Задача считается завершённой только если:

- все required reviews проведены;
- review statuses не blocked;
- required fixes закрыты;
- tests/validation выполнены;
- runtime evidence собрано, если required;
- documentation/canon updates выполнены;
- ADR обновлён, если required;
- Orchestrator сформировал final status.

---

# 12. Связанные документы

- `docs/ai/roles_overview.md`
- `docs/ai/agents_index.md`
- `docs/ai/workflows.md`
- `docs/ai/workflows/pipeline_overview.md`
- `docs/ai/workflows/agent_lifecycle.md`
- `docs/ai/workflows/auto_routing.md`
- `docs/ai/workflows/iteration_rules.md`
- `docs/ai/context_map_for_cursor.md`
- `docs/ai/decisions/adr_0001_multiagent_architecture.md`
- `docs/ai/decisions/adr_0002_roles_vs_workflows_structure.md`
- `docs/ai/decisions/adr_0003_no_extra_directories_for_mvp.md`
- `docs/ai/decisions/adr_0005_ai_ops_v1_and_advanced_specialist_agents.md`

---

# 13. Итог

Review Pipeline Go2Asia теперь покрывает не только классические этапы ТЗ → Архитектура → План → Код, но и новые контуры AI Ops v1:

- economy;
- fraud & abuse;
- runtime governance;
- runtime validation;
- slice strategy;
- canon alignment.

Цель обновлённого review pipeline — сделать разработку Go2Asia проверяемой, безопасной, воспроизводимой и устойчивой к runtime, security, economy и documentation drift.
