# Go2Asia — Pipeline Overview

## Назначение документа

Этот документ описывает единый end-to-end pipeline мультиагентной разработки Go2Asia.

После принятия ADR-005 pipeline обновлён под Go2Asia AI Ops v1 и 15-ролевую layered multi-agent governance model.

Pipeline определяет обязательный путь работы:

- от запроса владельца проекта;
- к классификации задачи;
- к выбору context capsule;
- к выбору AI-агентов;
- к выбору модели Cursor;
- к bounded slice;
- к реализации;
- к review;
- к runtime validation;
- к canon alignment;
- к release / follow-up.

Pipeline является “конституцией” процесса разработки Go2Asia.

---

# 1. Цель pipeline

Pipeline нужен, чтобы обеспечить:

- предсказуемость разработки;
- управляемую работу Cursor;
- правильное auto-routing агентов;
- снижение context drift;
- снижение token burn;
- разделение задач на bounded slices;
- обязательный review;
- обязательную validation для runtime-sensitive задач;
- фиксацию решений через ADR;
- docs/runtime alignment;
- устойчивое развитие сложной экосистемы Go2Asia.

---

# 2. Базовая схема pipeline

Обновлённая схема:

Запрос  
→ AI Ops Intake  
→ Task Classification  
→ Context Capsule  
→ Agent Routing  
→ Model Routing  
→ Requirements / Architecture / Planning  
→ Slice Strategy  
→ Implementation  
→ QA  
→ Security / Fraud / Abuse  
→ Runtime Governance / Runtime Validation  
→ Technical Canon Update  
→ Final Review  
→ Release / Follow-up

---

# 3. Главные инварианты pipeline

1. Orchestrator всегда первый.
2. Для complex tasks всегда определяется context capsule.
3. Для medium/high/critical tasks всегда указывается recommended Cursor model.
4. High/critical задачи должны быть разбиты на bounded slices.
5. Architecture/economy/runtime/security decisions должны проходить review.
6. Runtime-sensitive changes требуют runtime validation / evidence.
7. Docs/canon update является частью Definition of Done.
8. ADR имеют приоритет над обычной документацией.
9. Cursor не должен выполнять unbounded repo-wide changes.
10. Задача не считается завершённой без required review gates.

---

# 4. Этап 0 — AI Ops Intake

## Ответственный агент

- AI Program Director / Project Orchestrator

## Цель

Принять задачу, классифицировать её и определить управляемый путь выполнения.

## Orchestrator определяет

- task type;
- affected domain;
- risk level;
- execution mode;
- required agents;
- recommended Cursor model;
- context capsule;
- scope;
- out of scope;
- review gates;
- validation requirements;
- docs/canon requirements;
- acceptance criteria.

## Возможные execution modes

- read-only audit;
- docs-first contract;
- architecture design;
- delivery planning;
- slice strategy;
- implementation;
- hardening;
- runtime validation;
- canon update;
- rollback / stabilization.

## Выход

- orchestration plan;
- Cursor prompt;
- agent routing;
- context capsule;
- acceptance criteria.

---

# 5. Этап 1 — Requirements

## Ответственный агент

- Requirements Analyst

## Когда нужен

- новая функциональность;
- новый модуль;
- неясная задача;
- изменение product behavior;
- downstream-этап обнаружил пробел в требованиях.

## Что делает агент

- уточняет требования;
- формирует ТЗ;
- описывает user stories;
- определяет acceptance criteria;
- фиксирует non-functional requirements;
- определяет open questions.

## Review gate

- Requirements Review

## Выход

- ТЗ;
- acceptance criteria;
- requirements review report.

---

# 6. Этап 2 — Architecture

## Ответственный агент

- Software Architect

## Когда нужен

- новый сервис;
- изменение API;
- изменение DB/schema;
- изменение service boundaries;
- изменение data flow;
- изменение canonical source;
- изменение lifecycle;
- изменение runtime contract.

## Что делает агент

- проектирует архитектуру;
- определяет API;
- определяет data model;
- определяет service boundaries;
- сверяется с ADR;
- определяет migration implications;
- определяет runtime/security/economy implications.

## Подключаемые агенты

- Runtime Governance Architect, если есть lifecycle/projection/reconciliation.
- Economy Architect, если есть Points/G2A/NFT/rewards.
- Security / SecOps, если есть access/security impact.
- Technical Canon Writer, если требуется ADR/canon.

## Review gate

- Architecture Review

Дополнительно:

- Runtime Governance Review;
- Economy Review;
- Security Review;
- Canon Review.

## Выход

- architecture document;
- API/data contract;
- ADR draft/update, если требуется;
- architecture review report.

---

# 7. Этап 3 — Delivery Planning

## Ответственный агент

- Delivery Planner

## Когда нужен

- после архитектуры;
- перед phase/stage/sprint;
- при изменении roadmap;
- при изменении scope;
- при необходимости распределить работы между агентами.

## Что делает агент

- декомпозирует работу;
- определяет dependencies;
- определяет order of execution;
- назначает agents;
- рекомендует model routing;
- определяет context capsule;
- определяет review gates;
- определяет QA/validation plan;
- определяет docs/canon checkpoints.

## Review gate

- Plan Review

## Выход

- phase/stage/sprint plan;
- task breakdown;
- dependency map;
- review/validation plan.

---

# 8. Этап 4 — Slice Strategy

## Ответственный агент

- Slice Strategist

## Когда нужен

- high/critical risk;
- слишком большая задача;
- unbounded scope;
- runtime/economy/security-sensitive task;
- большой refactor;
- stabilization phase;
- Cursor может потерять контекст.

## Что делает агент

- выделяет bounded slice;
- определяет audit/contract/implementation/validation/hardening/canon slices;
- фиксирует scope / out of scope;
- определяет stop conditions;
- определяет validation method;
- определяет follow-up slices.

## Review gate

- Slice Review

## Выход

- slice proposal;
- slice sequence;
- acceptance criteria;
- validation method;
- stop conditions.

---

# 9. Этап 5 — Docs-first Contract / Policy Design

## Ответственные агенты

Зависит от домена:

- Architect;
- Economy Architect;
- Runtime Governance Architect;
- Security / SecOps;
- Technical Canon Writer.

## Когда нужен

Перед implementation, если меняется:

- API contract;
- economy rules;
- reward rules;
- spendability;
- lifecycle;
- canonical source;
- projection ownership;
- reconciliation;
- security policy;
- fraud/abuse guardrails;
- runtime invariants.

## Что делается

- фиксируется contract;
- фиксируются state transitions;
- фиксируются invariants;
- фиксируются guardrails;
- фиксируются acceptance criteria;
- фиксируются rollback / validation requirements.

## Review gates

- Architecture Review;
- Economy Review;
- Fraud & Abuse Review;
- Runtime Governance Review;
- Security Review;
- Canon Review.

## Выход

- contract document;
- policy document;
- review report;
- implementation-ready scope.

---

# 10. Этап 6 — Implementation

## Ответственные агенты

- Backend Developer;
- Frontend Developer;
- DevOps, если затронута инфраструктура.

## Backend Implementation

Backend Developer реализует:

- API endpoints;
- service logic;
- validation;
- database integration;
- migrations;
- tests;
- SDK/types integration.

## Frontend Implementation

Frontend Developer реализует:

- UI;
- pages;
- components;
- state;
- API/SDK integration;
- role-based visibility.

Если задача UI/layout-related:

- сначала UX/UI sub-mode;
- затем implementation.

## DevOps Implementation

DevOps работает только если:

- требуется deploy/env/CI/CD;
- есть явно разрешённые infrastructure changes;
- Orchestrator подтвердил scope.

## Review gate

- Code Review

Дополнительно:

- Security Review;
- Fraud & Abuse Review;
- Runtime Governance Review, если implementation затрагивает lifecycle/projections;
- Economy Review, если implementation затрагивает economy.

## Выход

- code changes;
- tests;
- implementation report;
- code review report.

---

# 11. Этап 7 — QA

## Ответственный агент

- QA Agent

## Что делает агент

- unit validation;
- integration validation;
- E2E checks;
- regression;
- smoke checks;
- acceptance criteria validation;
- bug report.

## Когда нужен

- после любого значимого implementation;
- перед release;
- после bugfix;
- после migration;
- после UI/API integration.

## Review / validation

- QA report;
- code review support;
- regression status.

## Выход

- QA report;
- test results;
- bug list;
- QA status.

---

# 12. Этап 8 — Security / Fraud / Abuse

## Ответственные агенты

- Security / SecOps;
- Fraud & Abuse Security Specialist, как sub-mode SecOps.

## Когда нужен

Security Review нужен при:

- auth/authz;
- roles;
- secrets;
- sensitive data;
- backend/API;
- SDK/types;
- infrastructure;
- external integrations.

Fraud & Abuse Review нужен при:

- rewards;
- referrals;
- vouchers;
- spendability;
- Points/G2A/NFT;
- PRO attribution;
- partner settlement;
- wallet logic;
- lifecycle/replay/race/idempotency.

## Что проверяется

- access control;
- ownership;
- server-side validation;
- secrets;
- tokens/sessions;
- fraud scenarios;
- abuse paths;
- double claim/redeem/spend;
- replay/race;
- idempotency;
- audit logs;
- rate limits.

## Review gates

- Security Review;
- Fraud & Abuse Review.

## Выход

- security report;
- abuse/fraud findings;
- required fixes;
- required QA abuse cases;
- final risk status.

---

# 13. Этап 9 — Runtime Governance

## Ответственный агент

- Runtime Governance Architect

## Когда нужен

- lifecycle;
- projections;
- reconciliation;
- canonical state;
- wallet summaries;
- settlement summaries;
- spendability lifecycle;
- voucher lifecycle;
- RF projections;
- shadow compare;
- runtime drift.

## Что делает агент

- проверяет canonical-first model;
- определяет ownership;
- проверяет lifecycle semantics;
- определяет runtime invariants;
- проверяет projection ownership;
- определяет reconciliation strategy;
- проектирует drift detection;
- определяет retry/replay semantics.

## Review gate

- Runtime Governance Review

## Выход

- runtime governance report;
- lifecycle contract;
- projection map;
- reconciliation strategy;
- invariants;
- runtime risk status.

---

# 14. Этап 10 — Runtime Validation

## Ответственный агент

- Runtime Validation Agent

## Когда нужен

- runtime-sensitive implementation;
- staging validation;
- shadow compare;
- evidence bundle;
- pre-release validation high/critical changes;
- spendability validation;
- settlement validation;
- voucher lifecycle validation.

## Что делает агент

- проверяет фактическое runtime behavior;
- собирает evidence;
- проверяет lifecycle transitions;
- проверяет projections;
- проверяет reconciliation;
- проверяет retry/replay;
- проверяет observability;
- фиксирует runtime anomalies.

## Review gate

- Runtime Validation Review

## Выход

- runtime validation report;
- evidence bundle;
- shadow validation report;
- anomaly report;
- validation status.

---

# 15. Этап 11 — Technical Canon Update

## Ответственный агент

- Technical Canon Writer

## Когда нужен

- после architecture decision;
- после economy/security/runtime decision;
- после implementation, меняющего behavior;
- после validation;
- после изменения roles/workflows/ADR;
- при docs/runtime mismatch;
- перед release.

## Что делает агент

- обновляет docs;
- обновляет ADR;
- обновляет roles/workflows/index/context map, если требуется;
- фиксирует SSOT;
- устраняет docs/runtime drift;
- фиксирует open questions;
- фиксирует follow-up tasks.

## Review gate

- Canon Review

## Выход

- updated docs;
- canon alignment report;
- ADR update, если требуется;
- final docs/canon status.

---

# 16. Этап 12 — Release / Completion

## Ответственный агент

- AI Program Director / Project Orchestrator

## Что проверяет Orchestrator

- все required reviews проведены;
- statuses не blocked;
- QA выполнен;
- Security/Fraud review выполнен, если требуется;
- Runtime Validation выполнена, если требуется;
- docs/canon обновлены;
- ADR обновлён, если требуется;
- acceptance criteria выполнены;
- follow-up tasks зафиксированы.

## Выход

- final report;
- release readiness status;
- follow-up list;
- final orchestration status.

---

# 17. Pipeline by task type

## 17.1. Low-risk UI/docs task

Минимальный pipeline:

1. Orchestrator
2. Frontend Developer или Technical Canon Writer
3. QA, если есть UI behavior
4. Final status

Review gates:

- Canon Review, если меняются docs/roles/workflows/ADR.
- QA, если есть UI behavior.

---

## 17.2. Medium backend/API task

Pipeline:

1. Orchestrator
2. Architect, если меняется contract
3. Delivery Planner, если требуется decomposition
4. Backend Developer
5. QA
6. Security
7. Technical Canon Writer

Review gates:

- Architecture Review, если меняется contract/data model.
- Code Review.
- Security Review.
- Canon Review.

---

## 17.3. Economy task

Pipeline:

1. Orchestrator
2. Economy Architect
3. Security / Fraud & Abuse
4. Runtime Governance Architect, если есть lifecycle/spendability/runtime
5. Slice Strategist, если high/critical
6. Backend Developer, если implementation
7. QA
8. Runtime Validation Agent, если staging proof required
9. Technical Canon Writer

Review gates:

- Economy Review;
- Fraud & Abuse Review;
- Runtime Governance Review, если required;
- Code Review, если implementation;
- Runtime Validation Review, если required;
- Canon Review.

---

## 17.4. Runtime-sensitive task

Pipeline:

1. Orchestrator
2. Runtime Governance Architect
3. Slice Strategist, если high/critical
4. Backend Developer / Frontend Developer
5. QA
6. Security, если есть replay/race/abuse risk
7. Runtime Validation Agent
8. Technical Canon Writer

Review gates:

- Runtime Governance Review;
- Code Review;
- Security/Fraud Review, если required;
- Runtime Validation Review;
- Canon Review.

---

## 17.5. RF Voucher / PRO / Settlement task

Pipeline:

1. Orchestrator
2. Runtime Governance Architect
3. Economy Architect
4. Security / Fraud & Abuse
5. Slice Strategist
6. Architect, если API/DB affected
7. Backend Developer
8. Frontend Developer, если UI affected
9. QA
10. Runtime Validation Agent
11. Technical Canon Writer

Review gates:

- Runtime Governance Review;
- Economy Review;
- Fraud & Abuse Review;
- Architecture Review, если required;
- Code Review;
- Runtime Validation Review;
- Canon Review.

---

## 17.6. AI Roles / Workflows / AI Ops task

Pipeline:

1. Orchestrator
2. Technical Canon Writer
3. Delivery Planner или Slice Strategist, если change large
4. Architect, если меняется структура AI-system
5. Canon Review
6. ADR update, если decision-level change

Review gates:

- Canon Review;
- Architecture Review, если меняется структура;
- Plan Review, если меняется planning workflow.

---

# 18. Artifact map

| Artifact | Typical path |
|---|---|
| ТЗ | `docs/modules/*/` или `docs/backend/*/` |
| Архитектура | `docs/architecture/` или `docs/backend/*/architecture.md` |
| План | `docs/plans/` |
| ADR | `docs/decisions/` или `docs/ai/decisions/` |
| Role files | `docs/ai/roles/` |
| Workflows | `docs/ai/workflows/` |
| Requirements review | `docs/reviews/tz/` |
| Architecture review | `docs/reviews/architecture/` |
| Plan review | `docs/reviews/plans/` |
| Code review | `docs/reviews/code/` |
| Economy review | `docs/reviews/economy/` или временно existing review folder |
| Security/Fraud review | `docs/reviews/security/` или временно `docs/reviews/code/` |
| Runtime review | `docs/reviews/runtime/` или временно existing review folder |
| Runtime validation review | `docs/reviews/runtime_validation/` или временно existing review folder |
| Canon review | `docs/reviews/canon/` или временно existing review folder |

Создание новых review folders должно учитывать ADR-003 и контролироваться Orchestrator.

---

# 19. Definition of Done

Задача считается завершённой только если:

- task classification выполнена;
- scope/out of scope определены;
- context capsule определена для complex tasks;
- recommended model указан для medium/high/critical tasks;
- required agents подключены;
- required reviews проведены;
- statuses не blocked;
- QA выполнен, если есть implementation;
- Security/Fraud review выполнен, если required;
- Runtime Validation выполнена, если required;
- docs/canon обновлены;
- ADR обновлён, если required;
- acceptance criteria выполнены;
- follow-up tasks зафиксированы;
- Orchestrator выдал final status.

---

# 20. Stop conditions

Orchestrator обязан остановить pipeline, если:

- нет достаточного контекста;
- есть конфликт между ADR;
- нужно бизнес-решение владельца проекта;
- нужно financial/on-chain decision;
- high/critical задача не имеет contract;
- Cursor предлагает big-bang refactor;
- требуется новая директория/слой без ADR;
- review status = blocked;
- runtime evidence отсутствует;
- acceptance criteria невозможно проверить.

---

# 21. Связанные документы

- `docs/ai/roles_overview.md`
- `docs/ai/agents_index.md`
- `docs/ai/workflows.md`
- `docs/ai/workflows/agent_lifecycle.md`
- `docs/ai/workflows/auto_routing.md`
- `docs/ai/workflows/review_pipeline.md`
- `docs/ai/workflows/iteration_rules.md`
- `docs/ai/context_map_for_cursor.md`
- `docs/ai/decisions/adr_0001_multiagent_architecture.md`
- `docs/ai/decisions/adr_0002_roles_vs_workflows_structure.md`
- `docs/ai/decisions/adr_0003_no_extra_directories_for_mvp.md`
- `docs/ai/decisions/adr_0004_embedded_ux_ui_model.md`
- `docs/ai/decisions/adr_0005_ai_ops_v1_and_advanced_specialist_agents.md`

---

# 22. Итог

Обновлённый pipeline Go2Asia переводит мультиагентную разработку из простой цепочки:

- Requirements → Architecture → Plan → Dev → QA → Security → Docs → Release

в AI Ops v1 pipeline:

- Intake → Context → Routing → Model → Slice → Contract → Implementation → Review → Runtime Validation → Canon → Release.

Цель pipeline — сделать работу Cursor и AI-агентов управляемой, безопасной, проверяемой и пригодной для развития сложной экосистемы Go2Asia.
