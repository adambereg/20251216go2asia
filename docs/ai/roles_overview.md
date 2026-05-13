# Roles Overview (Обзор ролей мультиагентной системы Go2Asia)

## Назначение документа

Этот документ содержит обзор всех AI-агентов, участвующих в разработке экосистемы Go2Asia.

Он служит навигацией для:

- владельца проекта;
- Orchestrator / AI Program Director;
- Cursor;
- разработчиков;
- review-субагентов;
- новых участников команды.

После принятия ADR-005 мультиагентная система Go2Asia расширена с базовой 10-ролевой MVP-модели до layered multi-agent governance model с Advanced Specialist Agents.

Новая модель сохраняет минимальную структуру проекта:

- `docs/ai/roles/`
- `docs/ai/workflows/`
- `docs/ai/decisions/`

и не вводит новые top-level директории, в соответствии с ADR-003.

---

# 1. Общая модель ролей

Go2Asia использует 15-ролевую layered model.

Роли разделены на несколько слоёв:

1. Core Engineering Agents
2. Delivery & Planning Agents
3. Runtime & Governance Agents
4. Economy & Security Agents
5. Documentation & Canon Agents

Важно: не все агенты вызываются всегда. Orchestrator выбирает минимальный необходимый набор ролей в зависимости от задачи, risk level, context capsule и review requirements.

---

# 2. Главный принцип

Каждый агент имеет:

- чёткую зону ответственности;
- собственный role-файл в `docs/ai/roles/`;
- типовые входные данные;
- ожидаемые output artifacts;
- ограничения;
- review / sub-agent modes, если применимо.

Cursor и Orchestrator должны использовать этот файл как краткую карту ролей, а подробные инструкции брать из соответствующих файлов в `docs/ai/roles/*.md`.

---

# 3. Layer 1 — Core Engineering Agents

## 1. AI Program Director / Project Orchestrator

Файл: `roles/orchestrator.md`

Главный управляющий агент мультиагентной системы.

Отвечает за:

- intake задачи;
- классификацию задачи;
- risk level;
- выбор execution mode;
- выбор AI-агентов;
- model routing;
- context governance;
- scope / out of scope;
- review gates;
- runtime validation routing;
- canon alignment;
- итоговую сборку результата.

Orchestrator теперь выполняет роль AI Program Director: он не просто распределяет задачи, а управляет AI Ops discipline всей разработки Go2Asia.

Когда вызывается:

- всегда первым;
- при любой новой задаче;
- при смене scope;
- при конфликте между агентами;
- при high/critical risk;
- при необходимости определить следующий Cursor prompt.

---

## 2. Requirements Analyst

Файл: `roles/requirements_analyst.md`

Агент анализа требований.

Отвечает за:

- формирование ТЗ;
- уточнение требований;
- user stories;
- acceptance criteria;
- выявление противоречий;
- подготовку требований для Architect и Planner.

Когда вызывается:

- новая функциональность;
- неясная задача;
- новый модуль;
- существенное изменение требований;
- downstream-этап обнаружил, что ТЗ неполное.

---

## 3. Software Architect

Файл: `roles/architect.md`

Агент технической архитектуры.

Отвечает за:

- сервисные границы;
- API;
- data model;
- backend architecture;
- module architecture;
- microservices boundaries;
- compatibility with ADR;
- архитектурные trade-offs.

Когда вызывается:

- меняется структура данных;
- появляется новый сервис;
- меняется API;
- меняется lifecycle;
- меняется canonical source;
- требуется новый ADR;
- реализация невозможна без архитектурного решения.

---

## 4. DevOps Agent

Файл: `roles/devops.md`

Агент инфраструктуры и окружений.

Отвечает за:

- CI/CD;
- окружения;
- деплой;
- переменные окружения;
- monitoring/logging;
- инфраструктурные runbooks;
- интеграцию с уже выбранной инфраструктурой.

Важно:

- инфраструктура Go2Asia уже зафиксирована;
- DevOps не должен предлагать альтернативные облака или перенастройку без явного решения;
- изменения инфраструктуры требуют строгого согласования с Orchestrator и Architect.

Когда вызывается:

- deployment;
- environment setup;
- CI/CD;
- GitHub Actions;
- Netlify;
- Cloudflare;
- Neon;
- Clerk;
- secrets management;
- operational runbooks.

---

## 5. Frontend Developer

Файл: `roles/frontend_dev.md`

Агент клиентской разработки.

Отвечает за:

- UI;
- компоненты;
- страницы;
- client-side state;
- интеграцию с SDK/API;
- role-based visibility;
- работу с дизайн-системой;
- адаптивность;
- UX/UI sub-mode.

Особенность:

- UX/UI Director реализован как embedded sub-mode внутри Frontend Developer;
- при layout/UI задачах сначала фиксируется визуальная спецификация, затем код.

Когда вызывается:

- UI changes;
- page implementation;
- frontend integration;
- role-based UI;
- forms;
- dashboards;
- mobile/responsive behavior.

---

## 6. Backend Developer

Файл: `roles/backend_dev.md`

Агент серверной разработки.

Отвечает за:

- API endpoints;
- services;
- business logic;
- database integration;
- Prisma/SQL;
- validation;
- SDK/API contracts;
- backend tests;
- implementation по утверждённой архитектуре.

Когда вызывается:

- backend logic;
- API;
- database;
- service behavior;
- migrations;
- SDK/types integration;
- runtime implementation после contract/audit.

---

## 7. QA Agent

Файл: `roles/qa.md`

Агент качества и тестирования.

Отвечает за:

- unit tests;
- integration tests;
- E2E tests;
- regression;
- smoke checks;
- bug reports;
- acceptance criteria validation.

Важно:

- QA проверяет функциональность и регрессию;
- Runtime Validation Agent отдельно проверяет staging/runtime evidence и operational behavior.

Когда вызывается:

- после значимого изменения кода;
- перед release;
- после bugfix;
- после реализации backend/frontend slice;
- при необходимости regression plan.

---

# 4. Layer 2 — Delivery & Planning Agents

## 8. Delivery Planner

Файл: `roles/planner.md`

Развитие прежнего ИИ-планировщика.

Отвечает за:

- phase / stage / sprint planning;
- task decomposition;
- dependency mapping;
- agent assignment;
- model routing recommendation;
- context capsule planning;
- review triggers;
- QA/validation planning;
- docs/canon update checkpoints.

Когда вызывается:

- после архитектуры;
- при создании phase/stage plan;
- при изменении roadmap;
- при изменении scope;
- при необходимости превратить архитектуру в план работ.

---

## 9. Slice Strategist

Файл: `roles/slice_strategist.md`

Агент стратегической нарезки задач.

Отвечает за:

- bounded slices;
- audit slices;
- contract slices;
- implementation slices;
- validation slices;
- hardening slices;
- canon slices;
- risk-reduction sequencing;
- stop conditions;
- follow-up slices.

Когда вызывается:

- задача слишком большая;
- есть high/critical risk;
- есть runtime/economy/security scope;
- Cursor может потерять контекст;
- нужен минимальный следующий безопасный шаг;
- требуется избежать big-bang implementation.

---

# 5. Layer 3 — Runtime & Governance Agents

## 10. Runtime Governance Architect

Файл: `roles/runtime_governance_architect.md`

Агент runtime governance.

Отвечает за:

- canonical-first architecture;
- canonical source of truth;
- projection ownership;
- lifecycle semantics;
- reconciliation;
- runtime invariants;
- shadow compare design;
- projection drift detection;
- retry/replay semantics;
- eventual consistency boundaries.

Когда вызывается:

- lifecycle changes;
- projection changes;
- canonical-first migration;
- reconciliation logic;
- wallet summaries;
- RF voucher lifecycle;
- spendability lifecycle;
- partner settlement;
- runtime drift;
- shadow compare.

---

## 11. Runtime Validation Agent

Файл: `roles/runtime_validation_agent.md`

Агент проверки фактического runtime-поведения.

Отвечает за:

- staging validation;
- runtime smoke validation;
- evidence bundles;
- shadow validation;
- lifecycle validation;
- projection validation;
- reconciliation validation;
- retry/replay validation;
- operational proof;
- runtime anomaly reports.

Когда вызывается:

- после runtime-sensitive implementation;
- перед release high/critical changes;
- после staging tests;
- при spendability/settlement/voucher lifecycle checks;
- при необходимости подтвердить фактическое поведение системы.

---

# 6. Layer 4 — Economy & Security Agents

## 12. Economy Architect

Файл: `roles/economy_architect.md`

Агент экономики Go2Asia.

Отвечает за:

- Points;
- G2A;
- NFT;
- reward rules;
- spendability;
- token sinks;
- anti-inflation;
- PRO incentives;
- referral rewards;
- partner settlement;
- premium voucher redemption;
- economy acceptance criteria.

Когда вызывается:

- любые изменения Points/G2A/NFT;
- voucher economy;
- reward mechanics;
- spendability;
- PRO attribution economics;
- partner settlement;
- token sink design;
- economy policy / contract.

---

## 13. Security / SecOps

Файл: `roles/security.md`

Агент безопасности.

Отвечает за классическую application security:

- auth/authz;
- roles;
- tokens/sessions;
- secrets;
- input validation;
- SQL injection / XSS / CSRF / SSRF;
- sensitive data;
- secure integrations;
- security review.

После ADR-005 роль расширена до Fraud & Abuse Security.

---

## 14. Fraud & Abuse Security Specialist

Файл: `roles/security.md`

Fraud & Abuse Security Specialist реализован как расширение SecOps.

Отвечает за:

- points farming;
- referral abuse;
- voucher abuse;
- double claim;
- double redeem;
- double spend;
- replay attacks;
- race conditions;
- stale projection abuse;
- PRO attribution manipulation;
- partner settlement fraud;
- NFT gating bypass;
- reward loop exploitation.

Когда вызывается:

- economy changes;
- rewards;
- RF voucher lifecycle;
- spendability;
- partner settlement;
- PRO attribution;
- referral logic;
- wallet logic;
- NFT mechanics;
- runtime-sensitive abuse cases.

Важно:

- если в будущем Fraud & Abuse станет слишком большой зоной ответственности, он может быть выделен в отдельный role-файл через отдельное решение Orchestrator / ADR.

---

# 7. Layer 5 — Documentation & Canon Agents

## 15. Technical Canon Writer

Файл: `roles/tech_writer.md`

Развитие прежнего ИИ-технического писателя.

Отвечает за:

- documentation;
- SSOT maintenance;
- ADR normalization;
- canon alignment;
- docs/runtime alignment;
- context map updates;
- agents index updates;
- roles overview updates;
- workflow updates;
- changelog/status notes;
- deprecation notes.

Когда вызывается:

- после значимого изменения;
- после architecture/economy/runtime/security decisions;
- после validation;
- при обновлении AI roles/workflows;
- при docs/runtime mismatch;
- перед завершением stage/slice.

---

# 8. Сводная таблица ролей

| № | Роль | Файл | Основной слой | Основная функция |
|---|---|---|---|---|
| 1 | AI Program Director / Orchestrator | `roles/orchestrator.md` | Core / Governance | Управление AI-командой, routing, scope, review gates |
| 2 | Requirements Analyst | `roles/requirements_analyst.md` | Core | ТЗ, требования, acceptance criteria |
| 3 | Software Architect | `roles/architect.md` | Core | Архитектура, API, сервисы, data model |
| 4 | Delivery Planner | `roles/planner.md` | Delivery | Планирование, зависимости, model/context routing |
| 5 | DevOps | `roles/devops.md` | Core | CI/CD, environments, deploy, ops |
| 6 | Frontend Developer | `roles/frontend_dev.md` | Core | UI, pages, components, UX/UI sub-mode |
| 7 | Backend Developer | `roles/backend_dev.md` | Core | API, services, DB, business logic |
| 8 | QA Agent | `roles/qa.md` | Core | Tests, regression, acceptance checks |
| 9 | Security / SecOps | `roles/security.md` | Security | AppSec, access, secrets, secure coding |
| 10 | Technical Canon Writer | `roles/tech_writer.md` | Canon | Docs, ADR, SSOT, runtime/docs alignment |
| 11 | Economy Architect | `roles/economy_architect.md` | Economy | Points, G2A, NFT, rewards, spendability |
| 12 | Runtime Governance Architect | `roles/runtime_governance_architect.md` | Runtime | Canonical state, lifecycle, projections, reconciliation |
| 13 | Runtime Validation Agent | `roles/runtime_validation_agent.md` | Runtime | Staging validation, evidence, shadow validation |
| 14 | Slice Strategist | `roles/slice_strategist.md` | Delivery | Bounded slices, risk-reduction sequence |
| 15 | Fraud & Abuse Security Specialist | `roles/security.md` | Security / Economy | Abuse, fraud, farming, double-spend, replay |

---

# 9. Как выбирать роли

## Маленькая UI-задача

Обычно достаточно:

- Frontend Developer;
- QA Agent;
- Technical Canon Writer, если нужно обновить docs.

## Backend/API задача

Обычно:

- Backend Developer;
- QA Agent;
- Security / SecOps;
- Technical Canon Writer.

Если меняется API contract или data model:

- добавить Software Architect.

## Новая функциональность

Обычно:

- Requirements Analyst;
- Software Architect;
- Delivery Planner;
- Frontend Developer;
- Backend Developer;
- QA Agent;
- Security / SecOps;
- Technical Canon Writer.

## Большая или рискованная задача

Добавить:

- Slice Strategist;
- AI Program Director должен определить bounded slices.

## Economy задача

Обязательно:

- Economy Architect;
- Security / Fraud & Abuse;
- Runtime Governance Architect, если есть lifecycle/spendability/runtime;
- Technical Canon Writer.

## Runtime-sensitive задача

Обязательно:

- Runtime Governance Architect;
- Runtime Validation Agent;
- QA Agent;
- Security / SecOps, если есть abuse/security implications;
- Technical Canon Writer.

## RF / Voucher / PRO Attribution задача

Обычно:

- Runtime Governance Architect;
- Economy Architect;
- Security / Fraud & Abuse;
- Backend Developer;
- QA Agent;
- Runtime Validation Agent;
- Technical Canon Writer.

## AI roles / workflows / AI Ops задача

Обычно:

- AI Program Director;
- Technical Canon Writer;
- Delivery Planner или Slice Strategist при больших изменениях;
- Architect, если меняется структура системы AI-агентов;
- Canon Review обязателен.

---

# 10. Review modes, связанные с ролями

| Review mode | Ответственный агент | Когда запускать |
|---|---|---|
| Requirements Review | Requirements Analyst | После создания/изменения ТЗ |
| Architecture Review | Software Architect | После архитектурных изменений |
| Plan Review | Delivery Planner | После phase/stage/sprint plan |
| Code Review | Backend/Frontend + QA + Security | После значимого кода |
| Security Review | Security / SecOps | Auth, roles, secrets, backend, SDK, sensitive data |
| Fraud & Abuse Review | Security / Fraud & Abuse | Rewards, vouchers, spendability, referral, settlement |
| Economy Review | Economy Architect | Points, G2A, NFT, rewards, token sinks |
| Runtime Governance Review | Runtime Governance Architect | Lifecycle, projections, reconciliation, canonical source |
| Runtime Validation Review | Runtime Validation Agent | Staging/runtime validation, evidence bundle |
| Slice Review | Slice Strategist | High/critical or too large slice |
| Canon Review | Technical Canon Writer | ADR, docs, roles, workflows, runtime/docs sync |

---

# 11. Важные правила

## 1. Не запускать всех агентов всегда

Advanced Specialist Agents вызываются только при релевантном domain/risk scope.

## 2. Orchestrator всегда первый

Любая значимая задача должна начинаться с Orchestrator / AI Program Director.

## 3. Context capsule обязателен

Для complex tasks Orchestrator должен указать:

- какие docs читать;
- какие файлы можно менять;
- какие файлы read-only;
- какие ADR обязательны.

## 4. Model routing обязателен

В промтах для Cursor нужно указывать рекомендованную модель:

- GPT-5.5 Medium для reasoning-heavy задач;
- Codex 5.3 Medium для bounded implementation;
- Auto / Composer для low-risk задач.

## 5. Runtime evidence важнее предположений

Runtime-sensitive задача не считается завершённой без validation / evidence.

## 6. Canon update обязателен

Если решение изменяет правила, архитектуру, runtime, economy, roles или workflows — Technical Canon Writer должен обновить соответствующие документы.

---

# 12. Связанные документы

- `docs/ai/agents_index.md`
- `docs/ai/workflows.md`
- `docs/ai/workflows/pipeline_overview.md`
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

# 13. Итог

`roles_overview.md` является краткой картой 15-ролевой мультиагентной системы Go2Asia.

Подробное поведение каждой роли описано в соответствующем файле `docs/ai/roles/*.md`.

Orchestrator обязан использовать этот overview вместе с:

- `agents_index.md`;
- `auto_routing.md`;
- `review_pipeline.md`;
- `context_map_for_cursor.md`;
- ADR-005.

Цель новой модели — сделать работу Cursor и AI-агентов более управляемой, безопасной, предсказуемой и пригодной для развития сложной экосистемы Go2Asia.
