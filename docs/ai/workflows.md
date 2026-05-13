# Go2Asia — AI Workflows Overview

## Назначение документа

Этот документ описывает общую систему workflows мультиагентной разработки Go2Asia.

Он служит центральной картой, из которой Orchestrator, Cursor и AI-агенты получают понимание:

- как устроена AI-workflow система Go2Asia;
- какие workflow-файлы за что отвечают;
- как выбирать агента под задачу;
- как выбирать context capsule;
- как учитывать risk level;
- как выбирать recommended Cursor model;
- как работает review pipeline;
- как работает runtime validation;
- как работает canon alignment;
- как Orchestrator координирует 15-ролевую AI-команду.

После принятия ADR-005 этот документ обновлён под Go2Asia AI Ops v1 и layered multi-agent governance model.

---

# 1. Общая модель AI-workflow системы

Go2Asia использует AI Ops v1 — lightweight governance model для управления Cursor и мультиагентной AI-командой.

Система больше не ограничивается простой цепочкой:

- Требования → Архитектура → План → Разработка → QA → Security → Docs → Release

Теперь она работает как управляемый pipeline:

- Intake → Context Capsule → Agent Routing → Model Routing → Slice Strategy → Contract/Audit → Implementation → Review → Runtime Validation → Canon Update → Release / Follow-up.

---

# 2. Структура AI-workflow системы

Все элементы системы находятся в существующей структуре:

| Путь | Назначение |
|---|---|
| `docs/ai/roles/` | Ролевые файлы AI-агентов |
| `docs/ai/workflows/` | Workflow-документы и правила процесса |
| `docs/ai/decisions/` | ADR для AI-системы |
| `docs/ai/roles_overview.md` | Краткий обзор 15 ролей |
| `docs/ai/agents_index.md` | Реестр всех AI-агентов |
| `docs/ai/context_map_for_cursor.md` | Карта контекстных капсул для Cursor |

Новые top-level директории не вводятся, в соответствии с ADR-003.

---

# 3. Основные workflow-файлы

| Файл | Назначение |
|---|---|
| `pipeline_overview.md` | Главный end-to-end pipeline AI Ops v1 |
| `iteration_rules.md` | Правила итераций, feedback loops, limits |
| `agent_lifecycle.md` | Жизненный цикл агента от вызова до результата |
| `auto_routing.md` | Правила выбора агентов по типу задачи и risk level |
| `review_pipeline.md` | Все review modes и условия их запуска |
| `roles_overview.md` | Обзор ролей и слоёв AI-команды |
| `agents_index.md` | Формальный реестр агентов |
| `context_map_for_cursor.md` | Context capsules и правила чтения контекста |

---

# 4. Ролевая модель

Go2Asia использует 15-ролевую layered model.

## Layer 1 — Core Engineering Agents

- AI Program Director / Project Orchestrator
- Requirements Analyst
- Software Architect
- DevOps
- Frontend Developer
- Backend Developer
- QA Agent

## Layer 2 — Delivery & Planning Agents

- Delivery Planner
- Slice Strategist

## Layer 3 — Runtime & Governance Agents

- Runtime Governance Architect
- Runtime Validation Agent

## Layer 4 — Economy & Security Agents

- Economy Architect
- Security / SecOps
- Fraud & Abuse Security Specialist

## Layer 5 — Documentation & Canon Agents

- Technical Canon Writer

Важно: Advanced Specialist Agents не запускаются всегда. Они вызываются только по domain/risk triggers.

---

# 5. Главные workflow-контуры

Go2Asia использует 7 ключевых workflow-контуров.

---

## 5.1. Development Pipeline

Файл:

- `pipeline_overview.md`

Назначение:

- описывает полный путь от запроса до release/follow-up;
- определяет обязательные этапы;
- связывает requirements, architecture, planning, implementation, review, runtime validation и canon update.

Используется:

- для всех complex tasks;
- для phase/stage/sprint work;
- для feature delivery;
- для runtime/economy/security-sensitive development.

---

## 5.2. Iteration Cycle

Файл:

- `iteration_rules.md`

Назначение:

- описывает, как выполнять повторные итерации;
- задаёт лимиты крупных пересмотров;
- предотвращает “переписать всё заново”;
- связывает feedback loops с review pipeline;
- определяет, когда нужен ADR.

Используется:

- при review findings;
- при QA defects;
- при architecture changes;
- при UI iteration;
- при runtime/economy/security feedback.

---

## 5.3. Agent Lifecycle

Файл:

- `agent_lifecycle.md`

Назначение:

- описывает, как агент принимает задачу;
- как выбирает/использует context capsule;
- как соблюдает роль;
- как учитывает risk level;
- как возвращает результат;
- как сигнализирует о review/canon/follow-up.

Используется:

- всеми AI-агентами;
- при каждом agent invocation;
- при handoff между агентами.

---

## 5.4. Auto Routing

Файл:

- `auto_routing.md`

Назначение:

- определяет, какие агенты вызываются при разных типах задач;
- учитывает task type, risk level, domain impact;
- добавляет routing для economy, runtime, fraud, canon, slice strategy.

Используется:

- Orchestrator;
- Cursor;
- complex prompt generation.

---

## 5.5. Review Pipeline

Файл:

- `review_pipeline.md`

Назначение:

- определяет required review gates;
- описывает базовые и advanced review modes;
- связывает review status с Definition of Done;
- не позволяет завершать задачи без проверок.

Review modes:

- Requirements Review
- Architecture Review
- Plan Review
- Code Review
- Security Review
- Fraud & Abuse Review
- Economy Review
- Runtime Governance Review
- Runtime Validation Review
- Slice Review
- Canon Review

---

## 5.6. Context Governance

Файл:

- `context_map_for_cursor.md`

Назначение:

- определяет context capsules;
- помогает Cursor читать минимальный нужный контекст;
- снижает context drift;
- ограничивает write scope;
- привязывает задачи к ролям, ADR, docs и review gates.

Используется:

- перед любыми complex tasks;
- при написании промтов для Cursor;
- при работе с large repo context.

---

## 5.7. Canon Alignment

Файлы:

- `tech_writer.md`
- `context_map_for_cursor.md`
- `roles_overview.md`
- `agents_index.md`
- `review_pipeline.md`
- relevant ADR

Назначение:

- поддерживать SSOT;
- синхронизировать docs и runtime;
- фиксировать decisions;
- обновлять ADR, roles, workflows, context map;
- предотвращать docs/runtime divergence.

Используется:

- после significant decisions;
- после runtime validation;
- после role/workflow changes;
- перед release.

---

# 6. Как AI-агенты должны использовать workflows

Каждый агент, получая задачу, выполняет следующий порядок.

## Шаг 1 — Определить тип задачи

Агент / Orchestrator определяет:

- новая функциональность;
- новый модуль;
- UI task;
- backend/API task;
- architecture change;
- economy task;
- security/fraud task;
- runtime governance task;
- runtime validation task;
- docs/canon task;
- AI Ops / roles / workflow task.

## Шаг 2 — Определить risk level

Risk level:

- Low;
- Medium;
- High;
- Critical.

Risk level влияет на:

- количество агентов;
- review gates;
- need for Slice Strategist;
- need for Runtime Validation;
- model routing;
- depth of context capsule.

## Шаг 3 — Выбрать context capsule

Использовать:

- `context_map_for_cursor.md`

Примеры капсул:

- Architecture Capsule;
- Frontend / PWA Capsule;
- Backend / API Capsule;
- Economy Capsule;
- Runtime Governance Capsule;
- Runtime Validation Capsule;
- Security / Fraud Capsule;
- Canon Alignment Capsule;
- RF / Voucher / PRO Attribution Capsule;
- Points / G2A / NFT Capsule;
- AI Ops / Multi-agent Governance Capsule.

## Шаг 4 — Выбрать агентов

Использовать:

- `auto_routing.md`
- `roles_overview.md`
- `agents_index.md`

## Шаг 5 — Выбрать recommended model

Использовать model routing:

| Task | Model |
|---|---|
| Architecture / economy / runtime / security reasoning | GPT-5.5 Medium |
| High/Critical slice design | GPT-5.5 Medium |
| Backend/frontend implementation | Codex 5.3 Medium |
| API / Prisma / SDK / React wiring | Codex 5.3 Medium |
| Small docs/UI fixes | Auto / Composer |
| Canon conflict resolution | GPT-5.5 Medium |
| Simple docs/canon update | GPT-5.3 / Auto |

## Шаг 6 — Определить review gates

Использовать:

- `review_pipeline.md`

## Шаг 7 — Выполнить задачу

Следовать:

- role file;
- context capsule;
- scope/out of scope;
- ADR;
- workflow file;
- review requirements.

## Шаг 8 — Провести review / validation / canon update

Задача не завершена, пока не закрыты required gates.

---

# 7. Основные маршруты workflow

## 7.1. Новая функциональность

Route:

1. Orchestrator
2. Requirements Analyst
3. Architect
4. Delivery Planner
5. Slice Strategist, если scope/risk требует
6. Backend/Frontend
7. QA
8. Security
9. Runtime Validation, если требуется
10. Technical Canon Writer

Reviews:

- Requirements Review
- Architecture Review
- Plan Review
- Code Review
- Security Review
- Canon Review

Дополнительно:

- Economy Review
- Fraud & Abuse Review
- Runtime Governance Review
- Runtime Validation Review
- Slice Review

---

## 7.2. Economy / Points / G2A / NFT

Route:

1. Orchestrator
2. Economy Architect
3. Security / Fraud & Abuse
4. Runtime Governance Architect, если lifecycle/runtime
5. Slice Strategist, если high/critical
6. Backend Developer, если implementation
7. QA
8. Runtime Validation Agent, если evidence required
9. Technical Canon Writer

Reviews:

- Economy Review
- Fraud & Abuse Review
- Runtime Governance Review, если applicable
- Code Review, если implementation
- Runtime Validation Review, если evidence required
- Canon Review

---

## 7.3. RF Voucher / PRO Attribution / Partner Settlement

Route:

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

Reviews:

- Runtime Governance Review
- Economy Review
- Fraud & Abuse Review
- Architecture Review, если applicable
- Code Review
- Runtime Validation Review
- Canon Review

---

## 7.4. Runtime Stabilization / Projection Drift

Route:

1. Orchestrator
2. Runtime Governance Architect
3. Runtime Validation Agent
4. Backend Developer, если fix required
5. QA
6. Security, если replay/race/abuse
7. Economy Architect, если balances/rewards/settlement
8. Technical Canon Writer

Reviews:

- Runtime Governance Review
- Runtime Validation Review
- Security/Fraud Review, если applicable
- Economy Review, если applicable
- Code Review, если fix
- Canon Review

---

## 7.5. AI Roles / Workflows / AI Ops

Route:

1. Orchestrator
2. Technical Canon Writer
3. Delivery Planner или Slice Strategist, если изменение крупное
4. Architect, если меняется структура AI-системы
5. Canon Review
6. ADR update, если решение decision-level

Reviews:

- Canon Review
- Architecture Review, если structural change
- Plan Review, если planning workflow changes
- Slice Review, если large scope

---

# 8. Definition of Done для workflow

Задача считается завершённой только если:

- task type определён;
- risk level определён;
- context capsule выбрана;
- required agents назначены;
- recommended model указан для medium/high/critical tasks;
- scope/out of scope определены;
- acceptance criteria сформулированы;
- required reviews проведены;
- review statuses не blocked;
- implementation протестирована, если есть code changes;
- runtime validation проведена, если required;
- evidence bundle собран, если required;
- docs/canon update выполнен, если required;
- ADR обновлён, если required;
- Orchestrator сформировал final status.

---

# 9. Правила для Cursor

Cursor должен:

1. Начинать complex tasks с Orchestrator logic.
2. Читать ADR перед implementation.
3. Выбирать context capsule перед чтением файлов.
4. Не тянуть весь repo context без причины.
5. Использовать relevant role files.
6. Соблюдать `.cursor-rules`.
7. Не создавать новые директории без разрешения.
8. Не менять read-only areas.
9. Не выполнять unbounded refactor.
10. Не считать задачу завершённой без required review.
11. Указывать files read / files changed.
12. Указывать review gates и validation needs.
13. Указывать docs/canon impact.

---

# 10. Review and artifact traceability

Каждый significant step должен оставлять след:

| Artifact | Typical location |
|---|---|
| Requirements | `docs/modules/**` или `docs/backend/**` |
| Architecture | `docs/architecture/**` или `docs/backend/**/architecture.md` |
| Plans | `docs/plans/**` |
| ADR | `docs/decisions/**` или `docs/ai/decisions/**` |
| Code reviews | `docs/reviews/code/**` |
| Architecture reviews | `docs/reviews/architecture/**` |
| Plan reviews | `docs/reviews/plans/**` |
| Requirements reviews | `docs/reviews/tz/**` |
| Advanced reviews | existing review folders или новые folders после approval |
| Role definitions | `docs/ai/roles/**` |
| Workflow docs | `docs/ai/workflows/**` |

Advanced review folders may include:

- `docs/reviews/economy/`
- `docs/reviews/security/`
- `docs/reviews/runtime/`
- `docs/reviews/runtime_validation/`
- `docs/reviews/canon/`

Создание новых review folders должно учитывать ADR-003 и Orchestrator approval.

---

# 11. Взаимосвязь workflow-файлов

## `pipeline_overview.md`

Определяет end-to-end process.

## `iteration_rules.md`

Определяет, как повторять циклы и не уходить в хаос.

## `agent_lifecycle.md`

Определяет, как каждый агент работает внутри pipeline.

## `auto_routing.md`

Определяет, кого запускать.

## `review_pipeline.md`

Определяет, какие проверки обязательны.

## `context_map_for_cursor.md`

Определяет, что читать.

## `roles_overview.md`

Показывает краткую карту ролей.

## `agents_index.md`

Формальный реестр ролей.

---

# 12. Stop conditions

Workflow должен быть остановлен, если:

- context недостаточен;
- ADR конфликтуют;
- задача требует business decision;
- задача требует financial/on-chain decision;
- high/critical task не имеет contract;
- Cursor предлагает big-bang implementation;
- требуется новая директория/слой без ADR;
- review status = blocked;
- runtime evidence отсутствует для runtime claim;
- acceptance criteria невозможно проверить.

---

# 13. Связанные документы

- `docs/ai/roles_overview.md`
- `docs/ai/agents_index.md`
- `docs/ai/context_map_for_cursor.md`
- `docs/ai/workflows/pipeline_overview.md`
- `docs/ai/workflows/iteration_rules.md`
- `docs/ai/workflows/agent_lifecycle.md`
- `docs/ai/workflows/auto_routing.md`
- `docs/ai/workflows/review_pipeline.md`
- `docs/ai/decisions/adr_0001_multiagent_architecture.md`
- `docs/ai/decisions/adr_0002_roles_vs_workflows_structure.md`
- `docs/ai/decisions/adr_0003_no_extra_directories_for_mvp.md`
- `docs/ai/decisions/adr_0004_embedded_ux_ui_model.md`
- `docs/ai/decisions/adr_0005_ai_ops_v1_and_advanced_specialist_agents.md`

---

# 14. Итог

`docs/ai/workflows.md` является верхнеуровневой картой AI Ops v1 для Go2Asia.

Он объясняет:

- как устроена 15-ролевая мультиагентная система;
- какие workflow-контуры существуют;
- как Orchestrator выбирает агентов;
- как Cursor выбирает контекст;
- как review и validation становятся обязательными;
- как documentation/canon alignment входит в Definition of Done.

Использование этого документа обязательно перед выполнением любых complex tasks, особенно если задача касается architecture, backend, runtime, economy, security, RF vouchers, Points/G2A/NFT, AI roles или workflows.
