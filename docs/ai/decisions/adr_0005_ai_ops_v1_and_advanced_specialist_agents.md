# ADR-005: AI Ops v1 и расширение мультиагентной системы Go2Asia через Advanced Specialist Agents

## Статус

Accepted

## Дата

2026-05-12

---

# Контекст

Изначальная мультиагентная система Go2Asia была зафиксирована в ADR-001 как MVP-модель из 10 специализированных ролей:

- Orchestrator;
- Requirements Analyst;
- Architect;
- Planner;
- DevOps;
- Frontend Developer;
- Backend Developer;
- QA;
- Security;
- Tech Writer.

Эта модель обеспечила:

- базовое разделение ответственности;
- снижение нагрузки на контекст;
- управляемую разработку;
- предсказуемые workflows.

Однако по мере развития Go2Asia проект перестал быть «обычным web-приложением» и превратился в сложную экосистему с:

- RF voucher economy;
- Points;
- G2A;
- NFT;
- PRO attribution;
- partner settlement;
- runtime projections;
- reconciliation;
- lifecycle governance;
- staging validation;
- runtime evidence;
- shadow compare;
- anti-fraud механиками;
- AI-assisted engineering governance.

Текущие задачи уже включают:

- canonical-first runtime architecture;
- runtime stabilization;
- projection drift detection;
- spendability governance;
- fraud & abuse prevention;
- AI Ops discipline;
- model routing;
- context governance;
- bounded slice orchestration;
- canon alignment;
- docs/runtime synchronization.

Практика работы показала, что базовых 10 ролей недостаточно для:

- глубокого runtime governance;
- экономики токенов и rewards;
- anti-fraud анализа;
- runtime validation;
- canon governance;
- slice orchestration;
- AI Ops management.

Одновременно проект продолжает следовать принципам ADR-003:

- не создавать избыточную структуру;
- не вводить преждевременно сложную hierarchy;
- сохранять компактность MVP-системы.

Поэтому принято решение:

- НЕ создавать новые верхнеуровневые директории;
- НЕ вводить отдельную meta-framework структуру;
- а расширить существующую мультиагентную систему через новые специализированные роли внутри `docs/ai/roles/`.

---

# Решение

Принято решение внедрить:

# Go2Asia AI Ops v1

и расширить мультиагентную систему через слой:

# Advanced Specialist Agents

без изменения базовой структуры:

- `roles/`
- `workflows/`
- `decisions/`

в соответствии с ADR-002 и ADR-003.

---

# Новая модель мультиагентной системы

Система переходит от:

- “10 универсальных ролей”

к:

- layered multi-agent governance model.

---

# Layer 1 — Core Engineering Agents

Базовые роли остаются и продолжают быть фундаментом системы:

1. AI Program Director / Project Orchestrator
2. Requirements Analyst
3. Software Architect
4. Delivery Planner
5. DevOps
6. Frontend Developer
7. Backend Developer
8. QA Agent
9. Security / SecOps
10. Technical Canon Writer

---

# Layer 2 — Advanced Specialist Agents

Добавляются специализированные роли:

11. Economy Architect
12. Runtime Governance Architect
13. Runtime Validation Agent
14. Slice Strategist
15. Fraud & Abuse Security Specialist

Важно: Fraud & Abuse Security Specialist реализован как расширение существующей роли `Security / SecOps`, а не как отдельный файл роли, если Orchestrator не примет отдельное решение о выделении его в самостоятельного агента.

---

# Дополнительные изменения ролей

## Orchestrator → AI Program Director

Orchestrator больше не является только coordinator-agent.

Теперь он отвечает за:

- AI Ops discipline;
- model routing;
- context governance;
- review enforcement;
- risk classification;
- slice orchestration;
- runtime validation routing;
- canon alignment;
- bounded scope enforcement.

---

## Planner → Delivery Planner

Planner эволюционирует:

- от task breakdown
- к delivery governance.

Теперь Planner обязан учитывать:

- context capsules;
- model routing;
- runtime validation;
- review gates;
- canon updates;
- AI Ops workflows.

---

## Tech Writer → Technical Canon Writer

Technical Writer расширяется:

- от documentation role
- к canon governance role.

Теперь агент отвечает за:

- SSOT maintenance;
- ADR normalization;
- docs/runtime alignment;
- canon consistency;
- AI Ops documentation;
- runtime docs sync.

---

## Security → Security + Fraud & Abuse

SecOps расширяется:

- от классической application security
- к economy/runtime/fraud security.

Теперь SecOps обязан проверять:

- reward abuse;
- voucher abuse;
- replay;
- race conditions;
- spendability abuse;
- referral farming;
- partner settlement fraud;
- stale projection abuse;
- runtime exploit paths.

---

# AI Ops v1

В систему официально вводится:

# AI Ops discipline

AI Ops v1 включает следующие управленческие контуры.

---

## 1. Model Routing

Каждая задача должна иметь рекомендованную модель Cursor.

### GPT-5.5 Medium

Используется для:

- architecture;
- economy;
- runtime governance;
- security/fraud;
- high-risk reasoning;
- canonical conflict resolution;
- multi-agent synthesis.

### Codex 5.3 Medium

Используется для:

- implementation;
- backend/frontend slices;
- API wiring;
- Prisma/SDK/UI integration;
- bounded refactors;
- test implementation.

### Auto / Composer

Используется для:

- lightweight UI/docs tasks;
- formatting;
- small copy changes;
- low-risk adjustments.

Model routing является рекомендацией для оператора Cursor, но Orchestrator обязан указывать её в промтах.

---

## 2. Context Governance

Cursor должен работать через:

- bounded context capsules;
- минимальный необходимый контекст;
- explicit read scope;
- explicit write scope;
- explicit out of scope.

Запрещается без необходимости скармливать Cursor весь repo context.

Цели:

- снизить context drift;
- снизить расход токенов;
- уменьшить риск случайных изменений;
- повысить точность reasoning;
- ускорить работу Cursor.

---

## 3. Slice-first Delivery

Крупные задачи должны делиться на:

- audit slices;
- contract slices;
- implementation slices;
- validation slices;
- hardening slices;
- canon slices.

Big-bang implementation считается anti-pattern.

Каждый slice должен иметь:

- bounded scope;
- out of scope;
- risk level;
- required agents;
- recommended model;
- context capsule;
- acceptance criteria;
- validation method;
- stop conditions;
- follow-up slices.

---

## 4. Runtime-first Governance

Для runtime-sensitive задач вводятся обязательные:

- shadow validation;
- runtime evidence;
- reconciliation checks;
- lifecycle validation;
- runtime invariants;
- staging validation;
- runtime reviews;
- evidence bundles.

Runtime-sensitive задачами считаются задачи, которые затрагивают:

- lifecycle;
- projections;
- reconciliation;
- wallet balances;
- Points/G2A/NFT;
- voucher claim/redeem;
- settlement;
- PRO attribution;
- spendability;
- reward automation.

---

## 5. Canon-first Documentation

Документация должна:

- отражать runtime;
- быть частью delivery pipeline;
- быть canonical source of truth;
- быть пригодной для Cursor;
- сохранять решения владельца проекта;
- фиксировать open questions;
- фиксировать follow-up tasks.

Документация не является финальным “после разработки” этапом, а входит в definition of done для всех значимых изменений.

---

# Новые review modes

В review pipeline официально добавляются следующие review modes.

## 1. Economy Review

Запускается при изменениях:

- Points;
- G2A;
- NFT;
- reward rules;
- spendability;
- token sinks;
- partner settlement;
- premium voucher redemption;
- PRO incentives.

Цель:

- проверить устойчивость экономики;
- исключить бесконечную эмиссию;
- проверить spendability;
- проверить abuse risks;
- проверить token sink logic.

---

## 2. Fraud & Abuse Review

Запускается при изменениях:

- rewards;
- referral logic;
- voucher claim/redeem;
- partner settlement;
- PRO attribution;
- wallet logic;
- NFT gating;
- user-generated activity rewards.

Цель:

- исключить exploitable reward loops;
- исключить self-referral;
- исключить double claim / double redeem / double spend;
- проверить race/replay/idempotency.

---

## 3. Runtime Governance Review

Запускается при изменениях:

- lifecycle;
- projections;
- canonical source;
- reconciliation;
- derived state;
- shadow compare;
- runtime invariants.

Цель:

- проверить canonical-first consistency;
- проверить projection ownership;
- проверить lifecycle semantics;
- проверить reconciliation safety.

---

## 4. Runtime Validation Review

Запускается после:

- staging validation;
- runtime-sensitive implementation;
- shadow validation;
- evidence bundle completion;
- reconciliation validation.

Цель:

- подтвердить фактическое runtime-поведение;
- проверить evidence;
- проверить alignment между canonical state и projections;
- проверить runtime anomalies.

---

## 5. Canon Review

Запускается при изменениях:

- ADR;
- architecture docs;
- AI roles;
- workflows;
- runtime contracts;
- economy/security decisions;
- context map.

Цель:

- проверить docs/runtime alignment;
- проверить SSOT;
- проверить отсутствие противоречий;
- проверить пригодность документации для Cursor.

---

## 6. Slice Review

Запускается перед:

- high-risk slice;
- critical slice;
- runtime-sensitive slice;
- economy/security slice;
- big refactor;
- implementation после complex audit.

Цель:

- проверить bounded scope;
- проверить out of scope;
- проверить acceptance criteria;
- проверить validation method;
- исключить big-bang implementation.

---

# Runtime Governance

В систему официально вводятся следующие concepts:

- canonical-first architecture;
- projection ownership;
- reconciliation;
- runtime invariants;
- shadow compare;
- projection drift detection;
- runtime validation;
- evidence bundles;
- lifecycle semantics;
- retry/replay safety;
- eventual consistency boundaries.

Эти concepts должны быть отражены в:

- `runtime_governance_architect.md`;
- `runtime_validation_agent.md`;
- `review_pipeline.md`;
- `auto_routing.md`;
- `pipeline_overview.md`;
- `context_map_for_cursor.md`.

---

# Context Capsules

В систему официально вводится концепция:

# Context Capsules

Каждая задача должна иметь:

- ограниченный context scope;
- список обязательных docs;
- список обязательных ADR;
- explicit allowed changes;
- explicit forbidden areas;
- recommended agents;
- recommended Cursor model.

Цель:

- уменьшение context drift;
- повышение качества reasoning;
- снижение расхода токенов;
- повышение стабильности Cursor;
- предотвращение случайного затрагивания чужих модулей.

---

# Обновляемые workflow-документы

Все workflow-документы должны быть обновлены для поддержки AI Ops v1:

- `docs/ai/workflows.md`
- `docs/ai/workflows/pipeline_overview.md`
- `docs/ai/workflows/review_pipeline.md`
- `docs/ai/workflows/iteration_rules.md`
- `docs/ai/workflows/agent_lifecycle.md`
- `docs/ai/workflows/auto_routing.md`
- `docs/ai/context_map_for_cursor.md`
- `docs/ai/roles_overview.md`
- `docs/ai/agents_index.md`

Обновления должны включать:

- новые роли;
- AI Ops discipline;
- runtime governance;
- model routing;
- context governance;
- runtime validation;
- canon alignment;
- new review modes;
- slice-first delivery.

---

# Обоснование

## 1. Better specialization

Специализированные агенты:

- уменьшают cognitive overload;
- повышают качество reasoning;
- уменьшают runtime/security mistakes;
- улучшают governance;
- помогают Cursor работать точнее.

---

## 2. Better Cursor orchestration

AI Ops discipline:

- снижает хаос;
- уменьшает unbounded tasks;
- уменьшает token burn;
- улучшает reproducibility;
- помогает владельцу проекта управлять Cursor как AI-командой.

---

## 3. Better runtime reliability

Runtime Governance + Runtime Validation:

- уменьшают runtime drift;
- улучшают reconciliation;
- улучшают lifecycle consistency;
- улучшают operational reliability;
- требуют evidence вместо предположений.

---

## 4. Better economy safety

Economy Architect + Fraud & Abuse:

- уменьшают exploit risks;
- уменьшают reward abuse;
- улучшают spendability governance;
- улучшают token sink discipline;
- уменьшают риск инфляции Points/G2A;
- улучшают partner settlement safety.

---

## 5. Better documentation quality

Technical Canon Writer:

- предотвращает docs/runtime divergence;
- улучшает SSOT quality;
- улучшает onboarding;
- улучшает Cursor context quality;
- фиксирует решения владельца проекта.

---

# Недостатки

## 1. Более сложная orchestration

Требуется:

- более умный Orchestrator;
- больше discipline;
- больше review stages;
- более строгий контроль scope.

---

## 2. Больше документации

Появляется:

- больше workflow docs;
- больше review docs;
- больше canon updates;
- больше обязательных следов решений.

---

## 3. Более высокий coordination cost

Нужно:

- лучшее управление slices;
- правильный agent routing;
- правильный context routing;
- регулярное обновление overview/index/workflows.

---

## 4. Риск over-process

Есть риск перегрузить маленькие задачи чрезмерным governance.

Митигация:

- не запускать всех агентов всегда;
- использовать risk classification;
- использовать AI Ops только пропорционально сложности задачи;
- small UI/docs fixes могут идти lightweight route.

---

# Рассмотренные альтернативы

## 1. Оставить только 10 базовых ролей

Отклонено.

Причины:

- runtime/economy/security complexity уже слишком высока;
- Orchestrator и Security стали перегруженными;
- runtime governance невозможно качественно покрывать общими ролями;
- Economy Architect и Runtime Governance требуют отдельного фокуса.

---

## 2. Создать полноценную enterprise agent hierarchy

Отклонено.

Причины:

- нарушает ADR-003;
- слишком сложно для текущего этапа;
- создаёт excessive governance overhead;
- увеличивает объём документации и cognitive load.

---

## 3. Создать новые top-level директории

Например:

- `skills/`
- `memory/`
- `prompts/`
- `governance/`
- `runtime/`

Отклонено.

Причины:

- противоречит ADR-003;
- увеличивает шум;
- усложняет навигацию Cursor;
- преждевременно для текущего этапа.

---

## 4. Встроить все новые функции в существующие роли без новых файлов

Частично принято.

Применено для:

- Security → Fraud & Abuse extension;
- Tech Writer → Technical Canon Writer;
- Planner → Delivery Planner;
- Orchestrator → AI Program Director.

Отклонено для:

- Economy Architect;
- Runtime Governance Architect;
- Runtime Validation Agent;
- Slice Strategist.

Причина: эти домены требуют самостоятельной роли и собственного системного промта.

---

# Последствия

## Положительные

- улучшение качества AI-assisted development;
- снижение runtime drift;
- снижение security/fraud risks;
- улучшение экономики;
- улучшение orchestration;
- улучшение reproducibility;
- улучшение documentation governance;
- улучшение Cursor context quality.

---

## Организационные

Orchestrator обязан:

- использовать AI Ops discipline;
- выполнять model routing;
- выполнять context governance;
- контролировать review gates;
- контролировать runtime validation;
- контролировать canon alignment;
- привлекать Slice Strategist для крупных задач.

---

## Архитектурные

Runtime-sensitive domains теперь требуют:

- runtime governance;
- validation;
- reconciliation;
- evidence bundles;
- shadow compare;
- lifecycle documentation.

---

## Документационные

Documentation становится:

- частью runtime governance;
- частью release readiness;
- частью AI Ops discipline;
- частью Definition of Done.

---

## Процессные

Workflow должен перейти от простой цепочки:

- Требования → Архитектура → План → Разработка → QA → Security → Docs → Release

к расширенной модели:

- Intake → Context Capsule → Agent Routing → Model Routing → Slice Strategy → Contract/Audit → Implementation → Review → Runtime Validation → Canon Update → Release / Follow-up.

---

# Ограничения

Несмотря на расширение системы:

- структура `roles/`, `workflows/`, `decisions/` сохраняется;
- новые top-level директории не создаются;
- roles остаются Markdown-based;
- workflows остаются файловыми;
- AI agents не получают самостоятельную persistent memory;
- AI Ops остаётся lightweight governance model;
- review directories могут расширяться только через Orchestrator/ADR, если это потребуется;
- small low-risk tasks не должны перегружаться excessive process.

---

# Требования к обновлению окружения AI-агентов

После принятия ADR-005 нужно обновить:

## 1. `roles_overview.md`

Добавить:

- 15-рольную модель;
- слои агентов;
- обновлённые назначения Orchestrator, Planner, Security, Tech Writer;
- Advanced Specialist Agents.

## 2. `agents_index.md`

Добавить:

- все новые роли;
- task type;
- tier;
- output format;
- auto-routing rules;
- ограничения.

## 3. `auto_routing.md`

Добавить маршруты для:

- economy tasks;
- runtime governance tasks;
- runtime validation tasks;
- fraud/abuse tasks;
- slice strategy tasks;
- canon alignment tasks;
- RF/Points/G2A/NFT/settlement tasks.

## 4. `review_pipeline.md`

Добавить review modes:

- Economy Review;
- Fraud & Abuse Review;
- Runtime Governance Review;
- Runtime Validation Review;
- Canon Review;
- Slice Review.

## 5. `pipeline_overview.md`

Добавить:

- AI Ops intake;
- context capsule selection;
- model routing;
- slice strategy;
- runtime validation;
- canon alignment.

## 6. `context_map_for_cursor.md`

Добавить context capsules:

- economy;
- runtime governance;
- runtime validation;
- fraud/security;
- AI Ops;
- canon alignment;
- RF voucher economy;
- Points/G2A/NFT.

## 7. `agent_lifecycle.md`

Добавить:

- risk classification;
- model recommendation;
- context selection;
- evidence requirements;
- review gates;
- canon update.

## 8. `workflows.md`

Обновить summary:

- заменить “10 агентов” на layered model;
- добавить AI Ops v1;
- добавить новые workflow contours.

---

# Будущая эволюция

В будущем возможно:

- выделение runtime review в отдельный workflow layer;
- введение automated evidence validation;
- введение evaluation framework;
- введение reusable skills library;
- введение AI telemetry;
- введение agent performance metrics;
- введение AI memory layer;
- выделение Fraud & Abuse Security Specialist в отдельный файл роли;
- выделение UX/UI Director в отдельный Tier-1 агент после MVP.

Эти изменения откладываются до post-MVP стадии и требуют отдельного ADR.

---

# Связанные документы

## ADR

- ADR-001: Принятие мультиагентной архитектуры Go2Asia
- ADR-002: Разделение ролей и workflow
- ADR-003: Минимальная структура MVP
- ADR-004: Embedded UX/UI Director Model

## AI Roles

- `roles/orchestrator.md`
- `roles/requirements_analyst.md`
- `roles/architect.md`
- `roles/planner.md`
- `roles/devops.md`
- `roles/frontend_dev.md`
- `roles/backend_dev.md`
- `roles/qa.md`
- `roles/security.md`
- `roles/tech_writer.md`
- `roles/economy_architect.md`
- `roles/runtime_governance_architect.md`
- `roles/runtime_validation_agent.md`
- `roles/slice_strategist.md`

## Workflows

- `workflows/workflows.md`
- `workflows/pipeline_overview.md`
- `workflows/review_pipeline.md`
- `workflows/agent_lifecycle.md`
- `workflows/auto_routing.md`
- `workflows/iteration_rules.md`

## Context Governance

- `context_map_for_cursor.md`

---

# Итоговое решение

Go2Asia официально принимает AI Ops v1 как lightweight governance model для управления Cursor и мультиагентной AI-командой.

Мультиагентная система расширяется с 10 базовых ролей до 15-ролевой layered model с Advanced Specialist Agents.

Расширение выполняется без нарушения ADR-003: новые роли добавляются в существующую директорию `docs/ai/roles/`, а workflows и decisions остаются в существующей структуре.

Orchestrator получает роль AI Program Director и становится ответственным за:

- agent routing;
- model routing;
- context governance;
- slice strategy;
- review enforcement;
- runtime validation routing;
- canon alignment;
- final task governance.

ADR-005 является обязательным основанием для последующего обновления `roles_overview.md`, `agents_index.md`, `auto_routing.md`, `review_pipeline.md`, `pipeline_overview.md`, `context_map_for_cursor.md`, `agent_lifecycle.md`, `iteration_rules.md` и `workflows.md`.
