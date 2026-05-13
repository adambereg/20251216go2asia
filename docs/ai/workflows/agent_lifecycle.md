# Agent Lifecycle (Жизненный цикл AI-агентов Go2Asia)

## Назначение документа

Этот документ описывает, как любой AI-агент Go2Asia должен работать от момента вызова Orchestrator / AI Program Director до возврата результата.

После принятия ADR-005 lifecycle обновлён под Go2Asia AI Ops v1 и 15-ролевую layered multi-agent governance model.

Документ определяет:

- как агент получает задачу;
- как выбирает контекст;
- как учитывает свою роль;
- как работает с risk level;
- как соблюдает context capsule;
- как взаимодействует с review pipeline;
- как возвращает результат;
- как участвует в canon alignment.

---

# 1. Главный принцип жизненного цикла

Каждый агент работает только в рамках своей роли.

Агент обязан:

- читать профильный role-файл;
- соблюдать ограничения роли;
- использовать только релевантный контекст;
- не выходить за scope;
- не подменять других агентов;
- фиксировать assumptions;
- возвращать проверяемый результат;
- указывать риски и open questions;
- уважать ADR;
- соблюдать review gates.

---

# 2. Общий lifecycle агента

Каждый агент проходит этапы:

1. Initialization
2. Context Capsule Selection
3. Role Alignment
4. Task Risk Awareness
5. Execution Planning
6. Task Execution
7. Self-Validation
8. Review / Handoff
9. Output Report
10. Canon / Follow-up Signal

---

# 3. Этап 1 — Initialization

## Что делает Orchestrator

Orchestrator передаёт агенту:

- цель задачи;
- role assignment;
- execution mode;
- scope;
- out of scope;
- risk level;
- context capsule;
- recommended Cursor model;
- required files to read;
- allowed files to edit;
- forbidden/read-only areas;
- expected output;
- review gates;
- acceptance criteria.

## Что делает агент

Агент обязан:

- принять задачу;
- определить, входит ли она в его роль;
- проверить, достаточно ли данных;
- выявить missing context;
- зафиксировать assumptions;
- не начинать работу, если scope противоречит роли.

## Если данных недостаточно

Агент должен вернуть Orchestrator:

- какие данные отсутствуют;
- почему без них нельзя продолжать;
- какой агент/документ нужен;
- минимальный следующий шаг.

---

# 4. Этап 2 — Context Capsule Selection

Агент должен работать только в рамках переданной context capsule.

Если context capsule не указана, агент обязан:

- предложить минимальный context capsule;
- не читать весь репозиторий без необходимости;
- запросить Orchestrator confirmation для complex/high-risk задач.

## Что включает context capsule

- required docs;
- required ADR;
- required role files;
- allowed directories;
- read-only directories;
- forbidden directories;
- review requirements;
- relevant runtime/evidence reports, если применимо.

## Правило минимального контекста

Агент должен читать минимальный достаточный набор документов.

Запрещено:

- подтягивать unrelated modules;
- использовать устаревшие docs без проверки;
- игнорировать ADR;
- смешивать несколько доменов в одном reasoning без причины.

---

# 5. Этап 3 — Role Alignment

Перед выполнением задачи агент должен свериться со своим role-файлом в:

- `docs/ai/roles/*.md`

## Агент обязан проверить

- что задача входит в его обязанности;
- какие ограничения заданы ролью;
- какие output artifacts требуются;
- какие review/sub-mode применимы;
- какие взаимодействия с другими агентами нужны.

## Если задача выходит за роль

Агент не должен выполнять чужую работу.

Он должен вернуть Orchestrator рекомендацию:

- какого агента подключить;
- что можно сделать в рамках текущей роли;
- какие границы нельзя пересекать.

---

# 6. Этап 4 — Task Risk Awareness

Каждый агент обязан учитывать risk level задачи.

## Low risk

Примеры:

- small UI copy;
- docs formatting;
- isolated non-critical fix;
- minor README update.

Обычно:

- lightweight context;
- minimal review;
- no advanced specialists.

## Medium risk

Примеры:

- API wiring;
- frontend/backend integration;
- non-critical backend endpoint;
- dashboard projection.

Обычно:

- QA required;
- Security may be required;
- Canon update if behavior/docs changed.

## High risk

Примеры:

- lifecycle changes;
- RF voucher lifecycle;
- PRO attribution;
- spendability;
- role-based access;
- settlement summaries;
- SDK/types changes.

Обычно:

- specialist agents required;
- review gates required;
- validation plan required.

## Critical risk

Примеры:

- wallet accounting;
- Points/G2A/NFT;
- on-chain/off-chain bridge;
- partner settlement;
- double-spend prevention;
- canonical source migration.

Обычно:

- Orchestrator oversight;
- Slice Strategist;
- docs-first contract;
- Security/Fraud;
- Economy;
- Runtime Governance;
- Runtime Validation;
- Canon Review.

---

# 7. Этап 5 — Execution Planning

Перед выполнением агент должен составить внутренний план.

Для complex tasks агент обязан явно определить:

- what will be checked;
- what will be changed;
- what will not be changed;
- dependencies;
- required review;
- required validation;
- expected artifact.

## Для read-only audit

План должен включать:

- files to inspect;
- questions to answer;
- evidence to collect;
- findings format.

## Для implementation

План должен включать:

- target files;
- expected changes;
- tests/checks;
- rollback considerations;
- report format.

## Для docs/canon

План должен включать:

- canonical documents affected;
- ADR impact;
- SSOT impact;
- docs/runtime alignment check.

---

# 8. Этап 6 — Task Execution

Агент выполняет задачу в рамках своей роли.

## Общие правила

- не выходить за scope;
- не менять forbidden/read-only areas;
- не создавать новые директории без разрешения;
- не нарушать ADR;
- не делать unbounded refactor;
- не смешивать unrelated domains;
- фиксировать найденные риски;
- сохранять output в правильный artifact.

## Для developers

Backend/Frontend должны:

- следовать architecture/contract;
- не менять business rules самостоятельно;
- добавлять/обновлять tests, если требуется;
- учитывать Security/Runtime/Economy requirements.

## Для specialists

Economy/Security/Runtime agents должны:

- не писать production code;
- формировать contracts/requirements/findings;
- передавать implementation guidance разработчикам.

## Для Canon Writer

Technical Canon Writer должен:

- не принимать decisions самостоятельно;
- фиксировать уже принятые решения;
- отмечать conflicts/open questions;
- обновлять canonical docs.

---

# 9. Этап 7 — Self-Validation

Перед возвратом результата агент обязан проверить:

- соответствует ли результат задаче;
- соблюдён ли scope;
- не нарушен ли out of scope;
- все ли required checks выполнены;
- есть ли unresolved risks;
- есть ли assumptions;
- нужны ли другие агенты;
- нужны ли reviews;
- нужны ли docs/canon updates;
- можно ли проверить acceptance criteria.

## Self-validation по доменам

### Requirements

- требования полны;
- acceptance criteria проверяемы;
- open questions видимы.

### Architecture

- ADR соблюдены;
- boundaries корректны;
- API/data flow понятны;
- downstream impact отмечен.

### Planning

- tasks bounded;
- dependencies понятны;
- review/validation checkpoints есть.

### Backend/Frontend

- implementation соответствует contract;
- tests/checks указаны;
- no unrelated changes.

### Economy

- reward/spend rules понятны;
- abuse risks указаны;
- spendability ясна;
- token sinks/limits указаны.

### Security

- access control проверен;
- abuse/fraud paths указаны;
- guardrails определены.

### Runtime Governance

- canonical source определён;
- lifecycle/projections/reconciliation описаны;
- invariants указаны.

### Runtime Validation

- evidence есть;
- runtime behavior подтверждён;
- anomalies указаны.

### Canon

- SSOT проверен;
- docs/runtime alignment указан;
- follow-up docs отмечены.

---

# 10. Этап 8 — Review / Handoff

Если task triggers review, агент обязан:

- указать required review;
- подготовить artifact для review;
- передать findings Orchestrator;
- не считать задачу завершённой до review status.

## Review gates

Агент должен знать возможные review gates:

- Requirements Review;
- Architecture Review;
- Plan Review;
- Code Review;
- Security Review;
- Fraud & Abuse Review;
- Economy Review;
- Runtime Governance Review;
- Runtime Validation Review;
- Slice Review;
- Canon Review.

## Если review required

Агент должен вернуть:

- review type;
- suggested review file path;
- what must be checked;
- blockers, если есть.

---

# 11. Этап 9 — Output Report

Каждый агент возвращает результат в структурированном виде.

## Минимальный формат ответа

1. Role
2. Task scope
3. Context used
4. Work performed
5. Findings / changes
6. Risks
7. Assumptions
8. Required reviews
9. Required validation
10. Required docs/canon updates
11. Acceptance status
12. Next steps

## Для implementation agents

Добавить:

- files changed;
- tests run;
- known limitations;
- regression risks.

## Для review agents

Добавить:

- status;
- severity levels;
- required fixes;
- approval/blocked state.

## Для validation agents

Добавить:

- environment;
- evidence;
- observed behavior;
- expected behavior;
- anomalies;
- validation status.

---

# 12. Этап 10 — Canon / Follow-up Signal

После работы агент обязан указать, требуется ли:

- docs update;
- ADR update;
- roles/workflows update;
- context map update;
- agents index update;
- runbook update;
- changelog/status update;
- follow-up slice;
- human owner decision.

Если да — Orchestrator должен подключить Technical Canon Writer.

---

# 13. Embedded Modes

Некоторые роли имеют sub-mode внутри себя.

Sub-mode не создаёт нового агента, но меняет порядок выполнения внутри роли.

---

## 13.1. Frontend Dev → UX/UI Design Authority

Если задача относится к UI:

- layout;
- components;
- visual structure;
- forms;
- cards;
- navigation;
- responsive behavior;

Frontend Developer обязан:

1. перейти в UX/UI sub-mode;
2. зафиксировать визуальную спецификацию;
3. свериться с design tokens / UI-kit;
4. только затем перейти к implementation.

Sub-mode не меняет роль и не создаёт нового агента.

---

## 13.2. Security → Fraud & Abuse Review

Если задача затрагивает:

- rewards;
- vouchers;
- referrals;
- Points;
- G2A;
- NFT;
- spendability;
- settlement;
- partner rewards;
- replay/race/idempotency;

Security обязан перейти в Fraud & Abuse sub-mode.

Проверять:

- farming;
- self-referral;
- circular referral;
- double claim;
- double redeem;
- double spend;
- stale projection abuse;
- delayed reconciliation abuse;
- race/replay.

---

## 13.3. Technical Canon Writer → Canon Review

Если задача затрагивает:

- ADR;
- roles;
- workflows;
- context map;
- runtime contracts;
- docs/runtime mismatch;

Technical Canon Writer обязан перейти в Canon Review mode.

Проверять:

- SSOT;
- ADR consistency;
- runtime/docs alignment;
- terminology;
- open questions;
- follow-up docs.

---

# 14. Multi-agent Handoff Rules

## 14.1. Handoff from Orchestrator

Orchestrator должен передавать:

- clear goal;
- role;
- scope;
- out of scope;
- context capsule;
- risk level;
- expected output;
- review gates.

## 14.2. Handoff between agents

Агенты не должны напрямую расширять работу.

Если один агент обнаружил, что нужен другой агент:

- зафиксировать finding;
- указать recommended agent;
- вернуть Orchestrator.

## 14.3. Handoff to Developers

Specialists должны передавать Backend/Frontend:

- explicit rules;
- constraints;
- acceptance criteria;
- edge cases;
- tests;
- guardrails.

## 14.4. Handoff to Canon Writer

Любой агент должен сигнализировать Technical Canon Writer, если:

- изменилось правило;
- изменился contract;
- изменился lifecycle;
- изменился workflow;
- найден docs/runtime mismatch;
- принято решение владельца проекта.

---

# 15. Evidence Requirements

Runtime-sensitive и security/economy-sensitive задачи требуют evidence.

## Evidence может включать

- logs;
- screenshots;
- API responses;
- DB state;
- metrics;
- traces;
- staging validation output;
- shadow compare output;
- test results;
- review reports.

## Evidence обязателен для утверждений

Нельзя утверждать:

- runtime works;
- projection aligned;
- reconciliation correct;
- spendability enforced;
- double-spend impossible;
- fraud path closed;

без evidence или явного указания, что это design assumption.

---

# 16. Iteration Rules внутри lifecycle

Если результат агента неполный или review вернул замечания:

1. Orchestrator фиксирует проблему.
2. Определяет, кто должен доработать.
3. Запускает повторную итерацию.
4. Проверяет, требуется ли обновить upstream artifact.
5. Требует повторный review, если изменения значимые.

Агент не должен “начинать всё заново” без решения Orchestrator.

---

# 17. Stop Conditions

Агент должен остановиться и вернуть задачу Orchestrator, если:

- задача выходит за роль;
- нет нужного контекста;
- есть конфликт ADR;
- требуется business decision;
- требуется financial/on-chain decision;
- требуется новая директория/слой;
- task scope unbounded;
- acceptance criteria невозможно проверить;
- required evidence отсутствует;
- review status = blocked.

---

# 18. Single Responsibility Agent

Каждый агент выполняет только свою роль.

Примеры:

- Economy Architect не пишет backend code.
- Security не принимает economy policy decisions.
- Runtime Validation не меняет runtime contracts.
- Backend Developer не меняет architecture самостоятельно.
- Technical Canon Writer не принимает decisions, а фиксирует их.
- Slice Strategist не заменяет Delivery Planner.
- Orchestrator не подменяет профильных агентов.

Пересечение зон ответственности допускается только через handoff и Orchestrator routing.

---

# 19. Agent Lifecycle by Role Type

## Core Engineering Agents

- Requirements Analyst;
- Architect;
- Frontend Developer;
- Backend Developer;
- DevOps;
- QA.

Фокус:

- build / validate / implement.

## Delivery & Planning Agents

- Delivery Planner;
- Slice Strategist.

Фокус:

- sequencing;
- bounded scope;
- risk-reduction.

## Runtime & Governance Agents

- Runtime Governance Architect;
- Runtime Validation Agent.

Фокус:

- lifecycle;
- projections;
- reconciliation;
- runtime evidence.

## Economy & Security Agents

- Economy Architect;
- Security / Fraud & Abuse.

Фокус:

- incentives;
- abuse prevention;
- safety;
- token/economy risks.

## Documentation & Canon Agents

- Technical Canon Writer.

Фокус:

- SSOT;
- ADR;
- docs/runtime alignment;
- workflow consistency.

## Program Governance

- AI Program Director / Orchestrator.

Фокус:

- routing;
- scope;
- reviews;
- final synthesis.

---

# 20. Definition of Done для агента

Работа агента считается завершённой, если:

- задача выполнена в рамках роли;
- context capsule соблюдена;
- scope/out of scope соблюдены;
- required files reviewed;
- output artifact создан;
- risks указаны;
- assumptions указаны;
- required reviews указаны;
- validation requirements указаны;
- docs/canon impact указан;
- acceptance status указан;
- next steps указаны.

Для high/critical задач дополнительно:

- review gates определены;
- evidence requirements определены;
- handoff следующему агенту понятен;
- blockers явно зафиксированы.

---

# 21. Связанные документы

- `docs/ai/roles_overview.md`
- `docs/ai/agents_index.md`
- `docs/ai/workflows.md`
- `docs/ai/workflows/pipeline_overview.md`
- `docs/ai/workflows/auto_routing.md`
- `docs/ai/workflows/review_pipeline.md`
- `docs/ai/workflows/iteration_rules.md`
- `docs/ai/context_map_for_cursor.md`
- `docs/ai/decisions/adr_0001_multiagent_architecture.md`
- `docs/ai/decisions/adr_0002_roles_vs_workflows_structure.md`
- `docs/ai/decisions/adr_0003_no_extra_directories_for_mvp.md`
- `docs/ai/decisions/adr_0005_ai_ops_v1_and_advanced_specialist_agents.md`

---

# 22. Итог

`agent_lifecycle.md` определяет стандарт поведения каждого AI-агента Go2Asia.

После ADR-005 агент больше не просто “получает задачу и возвращает результат”. Он обязан работать в AI Ops v1 framework:

- через role alignment;
- через context capsule;
- через risk awareness;
- через review gates;
- через evidence requirements;
- через canon/follow-up signal.

Это делает работу Cursor и мультиагентной системы Go2Asia управляемой, проверяемой и устойчивой.
