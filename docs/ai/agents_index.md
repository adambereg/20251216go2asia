# Agents Index (Реестр всех AI-агентов Go2Asia)

## Назначение документа

Этот документ является центральным каталогом всех AI-агентов, включённых в мультиагентную систему Go2Asia.

Он позволяет:

- Orchestrator / AI Program Director быстро выбирать нужную роль;
- Cursor понимать, какие агенты существуют;
- разработчикам видеть зоны ответственности агентов;
- workflow-документам ссылаться на единый реестр;
- review pipeline определять, какой агент должен запускаться в нужный момент.

После принятия ADR-005 система расширена с базовой 10-ролевой MVP-модели до 15-ролевой layered multi-agent governance model.

---

# 1. Формат записи агента

Каждый агент описывается по структуре:

- Название
- Tier / Layer
- Файл-источник
- Назначение
- Task Type
- Output Format
- Основные ограничения
- Auto-Routing
- Review / Sub-agent Modes, если применимо

---

# 2. Общая структура слоёв

| Layer | Назначение |
|---|---|
| Core Engineering Agents | Базовая разработка, архитектура, QA, frontend/backend, DevOps |
| Delivery & Planning Agents | Планирование, sequencing, bounded slices |
| Runtime & Governance Agents | Runtime consistency, lifecycle, projections, validation |
| Economy & Security Agents | Points/G2A/NFT, rewards, fraud, abuse, security |
| Documentation & Canon Agents | Документация, ADR, SSOT, canon alignment |

---

# 3. Список агентов

---

## 1. AI Program Director / Project Orchestrator

- **Tier / Layer:** Top-Level / Program Governance
- **Файл:** `roles/orchestrator.md`
- **Назначение:** управление AI-командой, выбор агентов, model routing, context governance, review gates, runtime validation routing, canon alignment.
- **Task Type:** high-level orchestration → task classification → agent routing → final synthesis.
- **Output Format:**
  - orchestration plan;
  - Cursor prompt;
  - agent routing plan;
  - context capsule;
  - review gates;
  - final task report.
- **Основные ограничения:**
  - не пишет production code;
  - не заменяет профильных агентов;
  - не игнорирует ADR;
  - не расширяет scope без решения владельца проекта;
  - не создаёт новые директории без ADR/разрешения.
- **Auto-Routing:** вызывается всегда первым.
- **Review / Sub-agent Modes:** Orchestration Review / Final Synthesis.

---

## 2. Requirements Analyst

- **Tier / Layer:** Tier 1 / Requirements
- **Файл:** `roles/requirements_analyst.md`
- **Назначение:** анализ требований, формирование ТЗ, user stories, acceptance criteria.
- **Task Type:** requirements → tech spec.
- **Output Format:**
  - ТЗ;
  - user stories;
  - functional requirements;
  - non-functional requirements;
  - acceptance criteria.
- **Основные ограничения:**
  - не проектирует архитектуру;
  - не пишет код;
  - не принимает runtime/economy/security decisions без профильных агентов.
- **Auto-Routing:** при новой функциональности, неясной задаче, новом модуле, изменении требований.
- **Review / Sub-agent Modes:** Requirements Review.

---

## 3. Software Architect

- **Tier / Layer:** Tier 1 / Architecture
- **Файл:** `roles/architect.md`
- **Назначение:** проектирование архитектуры, сервисных границ, API, data model, integration boundaries.
- **Task Type:** architecture → services / APIs / DB schemas / contracts.
- **Output Format:**
  - architecture document;
  - API contract;
  - data model;
  - service boundaries;
  - ADR draft;
  - architecture review notes.
- **Основные ограничения:**
  - не пишет production code вместо Backend/Frontend;
  - не меняет утверждённую архитектуру без ADR;
  - не принимает economy/security/runtime decisions без профильных агентов.
- **Auto-Routing:** при новых сервисах, изменениях API, DB, boundaries, lifecycle, canonical source.
- **Review / Sub-agent Modes:** Architecture Review.

---

## 4. Delivery Planner

- **Tier / Layer:** Tier 2 / Delivery & Planning
- **Файл:** `roles/planner.md`
- **Назначение:** декомпозиция задач, phase/stage/sprint planning, dependency mapping, agent assignment, model/context routing.
- **Task Type:** planning → tasks breakdown → delivery plan.
- **Output Format:**
  - phase plan;
  - stage plan;
  - sprint plan;
  - dependency map;
  - agent assignment;
  - model routing recommendation;
  - context capsule plan;
  - validation/checklist plan.
- **Основные ограничения:**
  - не принимает архитектурные решения;
  - не заменяет Slice Strategist для high/critical scope;
  - не планирует code-first changes без contract.
- **Auto-Routing:** после архитектуры, при создании phase/stage/sprint plan, при изменении roadmap/scope.
- **Review / Sub-agent Modes:** Plan Review.

---

## 5. DevOps Agent

- **Tier / Layer:** Tier 2 / Infrastructure
- **Файл:** `roles/devops.md`
- **Назначение:** CI/CD, окружения, деплой, secrets, monitoring/logging, operational runbooks.
- **Task Type:** infra setup / deploy / ops.
- **Output Format:**
  - deployment instructions;
  - CI/CD configs;
  - environment notes;
  - ops runbooks;
  - infra reports.
- **Основные ограничения:**
  - не перенастраивает уже зафиксированную инфраструктуру без решения;
  - не создаёт новые Workers/DB/apps без Orchestrator/ADR;
  - не выполняет опасные Git-операции без пользователя.
- **Auto-Routing:** при деплое, CI/CD, environments, secrets, Cloudflare/Netlify/Neon/Clerk ops.
- **Review / Sub-agent Modes:** Ops Review, если задано workflow.

---

## 6. Frontend Developer

- **Tier / Layer:** Tier 3 / Frontend Engineering
- **Файл:** `roles/frontend_dev.md`
- **Назначение:** UI, страницы, компоненты, frontend state, API/SDK integration, role-based UX.
- **Task Type:** client-side implementation.
- **Output Format:**
  - React components;
  - pages;
  - UI integration;
  - frontend tests;
  - UI implementation report.
- **Основные ограничения:**
  - не меняет backend/API без Backend/Architect;
  - не игнорирует UI-kit/design tokens;
  - не меняет prototypes/design-system read-only files.
- **Auto-Routing:** при UI, frontend integration, pages, components, layouts, role-based visibility.
- **Review / Sub-agent Modes:** UX/UI Design Authority embedded sub-mode; Frontend Code Review.

---

## 7. Backend Developer

- **Tier / Layer:** Tier 3 / Backend Engineering
- **Файл:** `roles/backend_dev.md`
- **Назначение:** API, services, DB logic, business logic, validation, migrations, backend tests.
- **Task Type:** server-side implementation.
- **Output Format:**
  - backend code;
  - API endpoints;
  - migrations;
  - service logic;
  - tests;
  - implementation report.
- **Основные ограничения:**
  - не меняет architecture contract без Architect;
  - не меняет economy rules без Economy Architect;
  - не игнорирует Security/Runtime requirements.
- **Auto-Routing:** при API, data, services, migrations, SDK/types backend integration.
- **Review / Sub-agent Modes:** Backend Code Review.

---

## 8. QA Agent

- **Tier / Layer:** Tier 3 / Quality Assurance
- **Файл:** `roles/qa.md`
- **Назначение:** тестирование, regression, unit/integration/E2E, bug reports, acceptance checks.
- **Task Type:** testing → validation.
- **Output Format:**
  - test plan;
  - test results;
  - bug list;
  - regression report;
  - QA status.
- **Основные ограничения:**
  - не заменяет Runtime Validation Agent;
  - не принимает architecture/economy/security decisions;
  - не пишет product logic.
- **Auto-Routing:** после значимого изменения кода, перед release, после bugfix.
- **Review / Sub-agent Modes:** QA Review, Code Review support.

---

## 9. Security / SecOps

- **Tier / Layer:** Tier 3 / Security
- **Файл:** `roles/security.md`
- **Назначение:** application security, access control, auth/authz, secrets, input validation, secure integrations.
- **Task Type:** security audit / secure review.
- **Output Format:**
  - security report;
  - vulnerability list;
  - severity levels;
  - required fixes;
  - secure guardrails;
  - security status.
- **Основные ограничения:**
  - не заменяет Economy Architect;
  - не заменяет Runtime Governance Architect;
  - не пишет production code;
  - не игнорирует fraud/abuse risks in economy scope.
- **Auto-Routing:** auth, roles, secrets, backend, SDK/types, sensitive data, security bugs.
- **Review / Sub-agent Modes:** Security Review; Code Review security support.

---

## 10. Technical Canon Writer

- **Tier / Layer:** Tier 3 / Documentation & Canon
- **Файл:** `roles/tech_writer.md`
- **Назначение:** документация, SSOT, ADR normalization, canon alignment, docs/runtime sync.
- **Task Type:** docs generation → canon governance.
- **Output Format:**
  - Markdown docs;
  - ADR updates;
  - README/API docs;
  - changelog/status notes;
  - canon alignment report;
  - docs/runtime sync notes.
- **Основные ограничения:**
  - не принимает architecture/economy/runtime decisions самостоятельно;
  - не скрывает docs/runtime mismatch;
  - не создаёт новые директории без решения.
- **Auto-Routing:** последним этапом значимой разработки; после ADR/economy/runtime/security decisions; при docs/canon mismatch.
- **Review / Sub-agent Modes:** Canon Review.

---

## 11. Economy Architect

- **Tier / Layer:** Advanced Specialist / Economy
- **Файл:** `roles/economy_architect.md`
- **Назначение:** Points, G2A, NFT, rewards, spendability, token sinks, anti-inflation, partner settlement.
- **Task Type:** economy design / economy policy / spendability contract.
- **Output Format:**
  - economy policy;
  - spendability contract;
  - reward rules;
  - token sink design;
  - settlement rules;
  - economy risk matrix;
  - economy acceptance criteria.
- **Основные ограничения:**
  - не пишет backend code;
  - не меняет DB/API без Architect/Backend;
  - не проектирует security guardrails без SecOps;
  - не объединяет Points и G2A без ADR.
- **Auto-Routing:** Points/G2A/NFT, rewards, RF voucher economy, PRO incentives, partner settlement, spendability.
- **Review / Sub-agent Modes:** Economy Review.

---

## 12. Runtime Governance Architect

- **Tier / Layer:** Advanced Specialist / Runtime Governance
- **Файл:** `roles/runtime_governance_architect.md`
- **Назначение:** canonical-first runtime, lifecycle, projection ownership, reconciliation, invariants, shadow compare design.
- **Task Type:** runtime governance / lifecycle contract / projection consistency.
- **Output Format:**
  - runtime governance document;
  - lifecycle specification;
  - projection ownership map;
  - reconciliation strategy;
  - runtime invariants;
  - shadow compare plan;
  - drift risk matrix.
- **Основные ограничения:**
  - не пишет production code;
  - не меняет architecture without Architect;
  - не заменяет Runtime Validation Agent;
  - не допускает projection-as-truth.
- **Auto-Routing:** lifecycle, projections, reconciliation, canonical source, runtime drift, spendability lifecycle, voucher lifecycle.
- **Review / Sub-agent Modes:** Runtime Governance Review.

---

## 13. Runtime Validation Agent

- **Tier / Layer:** Advanced Specialist / Runtime Validation
- **Файл:** `roles/runtime_validation_agent.md`
- **Назначение:** staging validation, runtime evidence, shadow validation, lifecycle/projection/reconciliation validation.
- **Task Type:** runtime validation / operational proof / evidence bundle.
- **Output Format:**
  - runtime validation report;
  - evidence bundle;
  - shadow validation report;
  - anomaly report;
  - validation status;
  - follow-up validation tasks.
- **Основные ограничения:**
  - не объявляет runtime корректным без evidence;
  - не заменяет QA;
  - не меняет runtime contracts;
  - не игнорирует drift/anomalies.
- **Auto-Routing:** staging validation, shadow compare, runtime-sensitive changes, spendability/settlement/voucher validation.
- **Review / Sub-agent Modes:** Runtime Validation Review.

---

## 14. Slice Strategist

- **Tier / Layer:** Advanced Specialist / Delivery Strategy
- **Файл:** `roles/slice_strategist.md`
- **Назначение:** bounded slices, risk-reduction sequencing, audit/contract/implementation/validation/hardening/canon slices.
- **Task Type:** slice strategy / scope control / risk reduction.
- **Output Format:**
  - slice proposal;
  - slice sequence;
  - scope/out of scope;
  - risk level;
  - required agents;
  - model recommendation;
  - validation method;
  - stop conditions.
- **Основные ограничения:**
  - не заменяет Delivery Planner;
  - не принимает architecture/economy/security decisions;
  - не пишет code;
  - не предлагает big-bang changes.
- **Auto-Routing:** high/critical tasks, too-large scope, runtime/economy/security changes, refactors, Cursor context risk.
- **Review / Sub-agent Modes:** Slice Review.

---

## 15. Fraud & Abuse Security Specialist

- **Tier / Layer:** Advanced Specialist / Security + Economy Abuse
- **Файл:** `roles/security.md`
- **Назначение:** fraud/abuse analysis для rewards, vouchers, referrals, spendability, PRO attribution, settlement, NFT gating.
- **Task Type:** fraud review / abuse review / exploit modeling.
- **Output Format:**
  - abuse scenarios;
  - fraud risk matrix;
  - exploit narratives;
  - required guardrails;
  - required QA abuse cases;
  - abuse status.
- **Основные ограничения:**
  - реализован как расширение SecOps;
  - не заменяет Economy Architect;
  - не заменяет Runtime Governance Architect;
  - не принимает product/economy decisions самостоятельно.
- **Auto-Routing:** rewards, Points/G2A/NFT, referrals, vouchers, PRO attribution, settlement, wallet logic, spendability.
- **Review / Sub-agent Modes:** Fraud & Abuse Review.

---

# 4. Auto-Routing Summary

## Новая функциональность

Обычно:

1. Orchestrator
2. Requirements Analyst
3. Architect
4. Delivery Planner
5. Slice Strategist, если scope большой
6. Backend / Frontend
7. QA
8. Security
9. Technical Canon Writer

---

## Архитектурное изменение

Обычно:

1. Orchestrator
2. Architect
3. Runtime Governance Architect, если затронут runtime/lifecycle/projections
4. Delivery Planner
5. Slice Strategist, если high risk
6. Backend/Frontend
7. QA
8. Security
9. Technical Canon Writer

---

## Economy / Points / G2A / NFT

Обычно:

1. Orchestrator
2. Economy Architect
3. Security / Fraud & Abuse
4. Runtime Governance Architect, если есть lifecycle/spendability/runtime
5. Delivery Planner / Slice Strategist
6. Backend Developer
7. QA
8. Runtime Validation Agent
9. Technical Canon Writer

---

## RF Voucher / PRO Attribution / Settlement

Обычно:

1. Orchestrator
2. Runtime Governance Architect
3. Economy Architect
4. Security / Fraud & Abuse
5. Slice Strategist
6. Backend Developer
7. Frontend Developer, если есть UI
8. QA
9. Runtime Validation Agent
10. Technical Canon Writer

---

## Runtime Stabilization / Projection Drift

Обычно:

1. Orchestrator
2. Runtime Governance Architect
3. Runtime Validation Agent
4. Backend Developer
5. QA
6. Security, если есть abuse/security risk
7. Technical Canon Writer

---

## Security / Fraud / Abuse

Обычно:

1. Orchestrator
2. Security / SecOps
3. Fraud & Abuse mode
4. Economy Architect, если затронута экономика
5. Runtime Governance Architect, если затронут runtime/replay/race/projection
6. Backend Developer
7. QA
8. Technical Canon Writer

---

## AI Roles / Workflows / AI Ops

Обычно:

1. Orchestrator
2. Technical Canon Writer
3. Delivery Planner или Slice Strategist
4. Architect, если меняется структура AI-системы
5. Canon Review

---

# 5. Review Modes Index

| Review mode | Agent | File | Trigger |
|---|---|---|---|
| Requirements Review | Requirements Analyst | `roles/requirements_analyst.md` | Новое/изменённое ТЗ |
| Architecture Review | Software Architect | `roles/architect.md` | Архитектура, API, DB, boundaries |
| Plan Review | Delivery Planner | `roles/planner.md` | Phase/stage/sprint plan |
| Code Review | Backend/Frontend + QA + Security | профильные роли | Значимый код |
| Security Review | Security / SecOps | `roles/security.md` | Auth, roles, secrets, sensitive data |
| Fraud & Abuse Review | Security / Fraud & Abuse | `roles/security.md` | Rewards, vouchers, settlement, spendability |
| Economy Review | Economy Architect | `roles/economy_architect.md` | Points, G2A, NFT, rewards, token sinks |
| Runtime Governance Review | Runtime Governance Architect | `roles/runtime_governance_architect.md` | Lifecycle, projections, reconciliation |
| Runtime Validation Review | Runtime Validation Agent | `roles/runtime_validation_agent.md` | Staging validation, evidence bundle |
| Slice Review | Slice Strategist | `roles/slice_strategist.md` | High/critical or too-large slice |
| Canon Review | Technical Canon Writer | `roles/tech_writer.md` | ADR, docs, roles, workflows, runtime/docs sync |

---

# 6. Model Routing Index

| Task Type | Recommended Cursor Model |
|---|---|
| Architecture reasoning | GPT-5.5 Medium |
| Economy / tokenomics / rewards | GPT-5.5 Medium |
| Runtime governance / projection drift | GPT-5.5 Medium |
| Security / Fraud / Abuse | GPT-5.5 Medium |
| High/Critical slice strategy | GPT-5.5 Medium |
| Backend implementation | Codex 5.3 Medium |
| Frontend implementation | Codex 5.3 Medium |
| Prisma / SQL / SDK / API wiring | Codex 5.3 Medium |
| Tests / bounded refactor | Codex 5.3 Medium |
| Small UI/doc fixes | Auto / Composer |
| Canon/docs updates | GPT-5.3 / Auto, или GPT-5.5 для сложного canon conflict |

---

# 7. Основные ограничения реестра

1. Этот файл является index, а не полным role prompt.
2. Подробные инструкции находятся в `docs/ai/roles/*.md`.
3. Orchestrator обязан читать `roles_overview.md` и `agents_index.md` вместе.
4. Новые роли добавляются только в `docs/ai/roles/`, если не принято отдельное ADR.
5. Не запускать всех агентов по умолчанию.
6. Advanced Specialist Agents вызываются по домену и risk level.
7. Если задача low-risk, использовать lightweight routing.
8. Если задача high/critical, использовать Slice Strategist и review gates.

---

# 8. Связанные документы

- `docs/ai/roles_overview.md`
- `docs/ai/workflows.md`
- `docs/ai/workflows/auto_routing.md`
- `docs/ai/workflows/review_pipeline.md`
- `docs/ai/workflows/agent_lifecycle.md`
- `docs/ai/workflows/pipeline_overview.md`
- `docs/ai/context_map_for_cursor.md`
- `docs/ai/decisions/adr_0001_multiagent_architecture.md`
- `docs/ai/decisions/adr_0002_roles_vs_workflows_structure.md`
- `docs/ai/decisions/adr_0003_no_extra_directories_for_mvp.md`
- `docs/ai/decisions/adr_0005_ai_ops_v1_and_advanced_specialist_agents.md`

---

# 9. Итог

`agents_index.md` является центральным реестром 15-ролевой AI-системы Go2Asia.

Он используется Orchestrator для:

- выбора агента;
- определения уровня задачи;
- выбора review modes;
- выбора model routing;
- подбора context capsule;
- соблюдения AI Ops v1.

Если роль добавлена, изменена или переименована, этот файл должен быть обновлён вместе с:

- `roles_overview.md`;
- `auto_routing.md`;
- `review_pipeline.md`;
- `context_map_for_cursor.md`;
- профильным role-файлом.
