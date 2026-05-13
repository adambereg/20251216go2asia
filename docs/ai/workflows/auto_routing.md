# Auto Routing Rules (Правила автоматической маршрутизации AI-агентов Go2Asia)

## Назначение документа

Этот документ описывает, когда и каких AI-агентов Orchestrator / AI Program Director должен вызывать автоматически при разных типах задач.

После принятия ADR-005 auto-routing обновлён под Go2Asia AI Ops v1 и 15-ролевую layered multi-agent governance model.

Главная цель auto-routing:

- снять с Orchestrator повторяющиеся решения;
- не пропускать критичных агентов;
- не запускать лишних агентов;
- учитывать risk level;
- учитывать model routing;
- учитывать context capsule;
- учитывать review gates;
- учитывать runtime validation и canon alignment.

---

# 1. Главные принципы auto-routing

## 1.1. Orchestrator всегда первый

Любая значимая задача начинается с:

1. AI Program Director / Project Orchestrator

Orchestrator определяет:

- task type;
- risk level;
- required agents;
- execution mode;
- recommended Cursor model;
- context capsule;
- review gates;
- validation requirements;
- documentation/canon requirements.

---

## 1.2. Не запускать всех агентов всегда

Advanced Specialist Agents вызываются только если задача затрагивает соответствующий домен:

- Economy Architect — economy / Points / G2A / NFT / rewards / spendability;
- Runtime Governance Architect — lifecycle / projection / reconciliation / canonical runtime;
- Runtime Validation Agent — staging evidence / shadow validation / runtime proof;
- Slice Strategist — high/critical risk, unbounded scope, complex stage;
- Fraud & Abuse Security Specialist — rewards / vouchers / settlement / abuse/farming/replay.

---

## 1.3. Risk-based routing

Чем выше риск, тем больше governance.

### Low risk

- small UI;
- copy;
- docs formatting;
- isolated non-critical fix.

Обычно достаточно 1–2 агентов.

### Medium risk

- API wiring;
- frontend/backend integration;
- non-critical data changes.

Нужны QA, Security при необходимости, Technical Canon Writer.

### High risk

- lifecycle;
- vouchers;
- spendability;
- settlement;
- role-based access;
- SDK/types;
- backend logic.

Нужны профильные specialists + review gates.

### Critical risk

- wallet accounting;
- Points/G2A/NFT;
- on-chain/off-chain gateway;
- partner settlement;
- double-spend prevention;
- canonical source migration.

Нужны Orchestrator, Slice Strategist, Architect, Economy/Security/Runtime specialists, Runtime Validation, Canon Review.

---

## 1.4. Context capsule обязателен для complex tasks

Для medium/high/critical задач Orchestrator должен указать:

- какие docs читать;
- какие ADR читать;
- какие файлы можно менять;
- какие файлы read-only;
- какие директории запрещены;
- какие role-файлы использовать.

---

## 1.5. Model routing указывается в каждом complex prompt

Рекомендации:

| Тип задачи | Модель |
|---|---|
| Architecture / economy / runtime governance / security reasoning | GPT-5.5 Medium |
| High/Critical slice design | GPT-5.5 Medium |
| Backend/frontend implementation | Codex 5.3 Medium |
| Prisma / SQL / API / SDK / React wiring | Codex 5.3 Medium |
| Small UI/docs fixes | Auto / Composer |
| Canon conflict resolution | GPT-5.5 Medium |
| Ordinary docs update | GPT-5.3 / Auto |

---

# 2. Базовые маршруты

## 2.1. Новая функциональность

Маршрут:

1. Orchestrator
2. Requirements Analyst
3. Architect
4. Delivery Planner
5. Slice Strategist, если scope большой или риск medium+
6. Backend Developer
7. Frontend Developer, если есть UI
8. QA Agent
9. Security / SecOps
10. Technical Canon Writer

Дополнительно:

- Economy Architect — если есть rewards, Points, G2A, NFT, voucher economy.
- Runtime Governance Architect — если есть lifecycle, projections, reconciliation.
- Runtime Validation Agent — если требуется staging/runtime evidence.
- Fraud & Abuse — если есть incentives, rewards, referrals, vouchers, settlement.

Review gates:

- Requirements Review;
- Architecture Review;
- Plan Review;
- Code Review;
- Security Review;
- Canon Review.

---

## 2.2. Новый модуль

Маршрут:

1. Orchestrator
2. Requirements Analyst
3. Architect
4. Delivery Planner
5. DevOps, если требуется environment/deploy/integration
6. Slice Strategist, если модуль крупный
7. Backend Developer
8. Frontend Developer
9. QA Agent
10. Security / SecOps
11. Technical Canon Writer

Дополнительно:

- Economy Architect, если модуль содержит rewards/economy.
- Runtime Governance Architect, если модуль содержит lifecycle/projections.
- Runtime Validation Agent, если нужен staging proof.

Review gates:

- Requirements Review;
- Architecture Review;
- Plan Review;
- Code Review;
- Security Review;
- Canon Review.

---

## 2.3. Дополнение существующего модуля

### Только UI

Маршрут:

1. Orchestrator
2. Frontend Developer с UX/UI sub-mode
3. QA Agent
4. Technical Canon Writer, если меняются docs/behavior

Если изменение затрагивает role-based visibility:

- добавить Security / SecOps.

Если изменение затрагивает runtime status display:

- добавить Runtime Governance Architect.

---

### Только API

Маршрут:

1. Orchestrator
2. Backend Developer
3. QA Agent
4. Security / SecOps
5. Technical Canon Writer

Если меняется API contract/data model:

- добавить Architect.

Если меняется lifecycle/projection:

- добавить Runtime Governance Architect.

Если API связан с Points/G2A/NFT/rewards:

- добавить Economy Architect и Fraud & Abuse.

---

### API + UI

Маршрут:

1. Orchestrator
2. Architect, если меняется contract/data model
3. Delivery Planner, если задача medium+
4. Backend Developer
5. Frontend Developer
6. QA Agent
7. Security / SecOps
8. Technical Canon Writer

Дополнительно:

- Runtime Governance Architect — lifecycle/projection/status.
- Runtime Validation Agent — staging/runtime evidence.
- Economy Architect — economy/rewards/spendability.
- Fraud & Abuse — abuse/fraud risk.

---

# 3. Специализированные маршруты

## 3.1. Economy / Points / G2A / NFT

Триггеры:

- Points rewards;
- G2A;
- NFT utility;
- token sinks;
- spendability;
- premium voucher redemption;
- partner settlement;
- PRO incentives;
- referral rewards;
- reward lifecycle.

Маршрут:

1. Orchestrator
2. Economy Architect
3. Security / Fraud & Abuse
4. Runtime Governance Architect, если есть lifecycle/projection/spendability
5. Slice Strategist, если high/critical risk
6. Architect, если меняется API/DB/service boundary
7. Backend Developer, если есть implementation
8. QA Agent
9. Runtime Validation Agent, если требуется staging proof
10. Technical Canon Writer

Recommended model:

- GPT-5.5 Medium для design/review;
- Codex 5.3 Medium для bounded implementation.

Required reviews:

- Economy Review;
- Fraud & Abuse Review;
- Security Review;
- Runtime Governance Review, если есть lifecycle/projection;
- Runtime Validation Review, если есть staging evidence;
- Canon Review.

---

## 3.2. RF Voucher / PRO Attribution / Partner Settlement

Триггеры:

- voucher claim;
- voucher redeem;
- paid voucher;
- premium voucher;
- PRO attribution;
- immutable attribution;
- shareCode;
- partner settlement;
- merchant rewards;
- RF wallet;
- RF projection;
- RF lifecycle.

Маршрут:

1. Orchestrator
2. Runtime Governance Architect
3. Economy Architect
4. Security / Fraud & Abuse
5. Slice Strategist
6. Architect, если меняется API/data model
7. Backend Developer
8. Frontend Developer, если есть UI
9. QA Agent
10. Runtime Validation Agent
11. Technical Canon Writer

Required reviews:

- Runtime Governance Review;
- Economy Review;
- Fraud & Abuse Review;
- Code Review;
- Runtime Validation Review;
- Canon Review.

---

## 3.3. Runtime Stabilization / Projection Drift / Reconciliation

Триггеры:

- projection drift;
- stale projection;
- canonical mismatch;
- lifecycle inconsistency;
- reconciliation issue;
- shadow compare;
- runtime invariant failure;
- wallet summary mismatch;
- dashboard aggregate mismatch.

Маршрут:

1. Orchestrator
2. Runtime Governance Architect
3. Runtime Validation Agent
4. Backend Developer, если нужен fix
5. QA Agent
6. Security / SecOps, если есть replay/race/abuse risk
7. Economy Architect, если затронуты balances/rewards/settlement
8. Technical Canon Writer

Recommended first mode:

- read-only audit;
- затем contract/hardening/implementation slice.

Required reviews:

- Runtime Governance Review;
- Runtime Validation Review;
- Security Review, если есть abuse/security risk;
- Economy Review, если есть economy impact;
- Canon Review.

---

## 3.4. Security / Fraud / Abuse

Триггеры:

- auth/authz;
- roles;
- secrets;
- user data;
- rewards;
- referrals;
- vouchers;
- Points/G2A/NFT;
- spendability;
- settlement;
- replay/race/idempotency;
- suspicious reward loop.

Маршрут:

1. Orchestrator
2. Security / SecOps
3. Fraud & Abuse mode, если есть economy/reward/voucher risk
4. Economy Architect, если есть economy impact
5. Runtime Governance Architect, если есть runtime/replay/race/projection impact
6. Backend Developer / DevOps для fixes
7. QA Agent
8. Runtime Validation Agent, если требуется staging evidence
9. Technical Canon Writer

Required reviews:

- Security Review;
- Fraud & Abuse Review;
- Code Review, если есть fix;
- Runtime Validation Review, если есть evidence requirement;
- Canon Review.

---

## 3.5. AI Roles / Workflows / AI Ops

Триггеры:

- создание нового AI-агента;
- изменение роли;
- изменение workflows;
- изменение auto-routing;
- изменение review pipeline;
- изменение context map;
- изменение AI ADR;
- изменение prompt standards;
- изменение model routing rules.

Маршрут:

1. Orchestrator
2. Technical Canon Writer
3. Delivery Planner, если меняется planning/workflow layer
4. Slice Strategist, если изменение крупное
5. Architect, если меняется структура мультиагентной системы
6. Canon Review

Required reviews:

- Canon Review;
- Plan Review, если меняется planning process;
- Architecture Review, если меняется AI architecture;
- ADR update, если решение значимое.

---

## 3.6. Documentation / Canon Alignment

Триггеры:

- docs/runtime mismatch;
- conflicting ADR;
- outdated role file;
- outdated workflow;
- new canonical contract;
- stale documentation;
- release/stage completion;
- evidence bundle after validation.

Маршрут:

1. Orchestrator
2. Technical Canon Writer
3. профильный агент по домену:
   - Architect;
   - Economy Architect;
   - Runtime Governance Architect;
   - Security;
   - Backend/Frontend;
4. Canon Review

Required reviews:

- Canon Review;
- Architecture/Economy/Runtime/Security review при доменном impact.

---

# 4. Routing по типам задач

## 4.1. Bugfix

### UI bug

1. Orchestrator
2. Frontend Developer
3. QA Agent
4. Technical Canon Writer, если меняется documented behavior

### Backend bug

1. Orchestrator
2. Backend Developer
3. QA Agent
4. Security / SecOps, если есть access/security impact
5. Technical Canon Writer

### Runtime bug

1. Orchestrator
2. Runtime Governance Architect
3. Runtime Validation Agent
4. Backend Developer
5. QA Agent
6. Security, если есть abuse/security risk
7. Technical Canon Writer

### Economy bug

1. Orchestrator
2. Economy Architect
3. Security / Fraud & Abuse
4. Runtime Governance Architect
5. Backend Developer
6. QA Agent
7. Runtime Validation Agent
8. Technical Canon Writer

---

## 4.2. Refactor

### Low-risk refactor

1. Orchestrator
2. Backend or Frontend Developer
3. QA Agent
4. Technical Canon Writer, если docs affected

### High-risk refactor

1. Orchestrator
2. Slice Strategist
3. Architect
4. Runtime Governance Architect, если runtime affected
5. Security, если security affected
6. Backend/Frontend Developer
7. QA Agent
8. Runtime Validation Agent, если runtime affected
9. Technical Canon Writer

---

## 4.3. API Contract Change

1. Orchestrator
2. Architect
3. Delivery Planner
4. Backend Developer
5. Frontend Developer, если UI/API consumer affected
6. QA Agent
7. Security / SecOps
8. Runtime Governance Architect, если lifecycle/projection affected
9. Technical Canon Writer

Required reviews:

- Architecture Review;
- Code Review;
- Security Review;
- Canon Review.

---

## 4.4. Database / Prisma / Migration Change

1. Orchestrator
2. Architect
3. Backend Developer
4. Security / SecOps
5. Runtime Governance Architect, если lifecycle/projection/reconciliation affected
6. QA Agent
7. Runtime Validation Agent, если staging verification required
8. Technical Canon Writer

Required reviews:

- Architecture Review;
- Code Review;
- Security Review;
- Runtime Governance Review, если applicable;
- Runtime Validation Review, если applicable.

---

## 4.5. Deploy / Environment / Infrastructure

1. Orchestrator
2. DevOps Agent
3. Security / SecOps
4. QA Agent, если требуется smoke/regression
5. Technical Canon Writer

Если инфраструктурное изменение влияет на service boundaries/API:

- добавить Architect;
- Architecture Review обязателен.

Важно:

- существующая инфраструктура не должна перенастраиваться без явного решения;
- новые сервисы/Workers/DB создаются только после Orchestrator/Architect approval.

---

# 5. Priority Rules

## Priority 1 — Orchestrator

Всегда первый.

## Priority 2 — Requirements Analyst

Если задача неясна или требует формального ТЗ.

## Priority 3 — Architect

Если меняется:

- architecture;
- API;
- DB;
- service boundary;
- canonical source;
- lifecycle model.

## Priority 4 — Slice Strategist

Если:

- задача большая;
- scope unbounded;
- риск high/critical;
- есть economy/runtime/security impact;
- нужен минимальный безопасный next slice.

## Priority 5 — Economy Architect

Если есть:

- Points;
- G2A;
- NFT;
- rewards;
- spendability;
- token sinks;
- partner settlement;
- PRO incentives.

## Priority 6 — Runtime Governance Architect

Если есть:

- lifecycle;
- projections;
- reconciliation;
- canonical state;
- shadow compare;
- runtime drift;
- wallet/settlement summaries.

## Priority 7 — Security / Fraud & Abuse

Если есть:

- auth;
- roles;
- secrets;
- sensitive data;
- rewards;
- vouchers;
- fraud/abuse;
- replay/race/idempotency.

## Priority 8 — Delivery Planner

Если есть:

- phase/stage/sprint;
- task sequencing;
- dependencies;
- multi-agent implementation.

## Priority 9 — Developers

Backend/Frontend вызываются только после понятного scope/contract.

## Priority 10 — QA

После каждого значимого изменения кода.

## Priority 11 — Runtime Validation Agent

После runtime-sensitive implementation или при need for evidence.

## Priority 12 — Technical Canon Writer

Всегда в конце значимых изменений и при изменении docs/ADR/workflows/roles.

---

# 6. Execution Mode Routing

## Read-only Audit

Использовать, если:

- текущее состояние неизвестно;
- высок риск ошибочного изменения;
- есть projection drift;
- есть security/economy concern;
- нужно понять реальные runtime facts.

Lead agents:

- Architect;
- Runtime Governance Architect;
- Security;
- Economy Architect;
- Technical Canon Writer.

---

## Docs-first Contract

Использовать, если меняется:

- economy;
- lifecycle;
- API contract;
- canonical source;
- security policy;
- runtime invariants;
- spendability.

Lead agents:

- Architect;
- Economy Architect;
- Runtime Governance Architect;
- Security;
- Technical Canon Writer.

---

## Implementation

Использовать, если:

- scope bounded;
- contract понятен;
- context capsule определена;
- acceptance criteria есть.

Lead agents:

- Backend Developer;
- Frontend Developer;
- DevOps, если infra.

---

## Validation

Использовать, если:

- implementation завершён;
- нужна runtime proof;
- staging evidence required;
- shadow compare required.

Lead agents:

- QA Agent;
- Runtime Validation Agent;
- Security, если security-sensitive.

---

## Canon Update

Использовать после:

- ADR;
- architecture decision;
- economy/security/runtime decision;
- role/workflow changes;
- validation outcome.

Lead agent:

- Technical Canon Writer.

---

# 7. Review Gate Routing

| Trigger | Required Review |
|---|---|
| Новое/изменённое ТЗ | Requirements Review |
| Архитектура/API/DB/boundary | Architecture Review |
| Phase/stage/sprint plan | Plan Review |
| Значимый backend/frontend/SDK/types code | Code Review |
| Auth/roles/secrets/sensitive data | Security Review |
| Rewards/vouchers/referrals/settlement/spendability | Fraud & Abuse Review |
| Points/G2A/NFT/economy rules | Economy Review |
| Lifecycle/projections/reconciliation/canonical source | Runtime Governance Review |
| Staging/shadow/evidence/runtime proof | Runtime Validation Review |
| ADR/docs/roles/workflows/context map | Canon Review |
| High/critical/unbounded slice | Slice Review |

---

# 8. Stop Conditions

Orchestrator должен остановить auto-routing и вернуть задачу владельцу проекта, если:

- нет достаточного контекста;
- есть конфликт между ADR;
- требуется бизнес-решение;
- требуется financial/on-chain decision;
- задача high/critical, но нет contract;
- Cursor предлагает big-bang refactor;
- нужно создать новую директорию/слой без ADR;
- acceptance criteria невозможно сформулировать;
- required evidence отсутствует;
- review вернул blocked.

---

# 9. Output Requirements для Orchestrator

При маршрутизации Orchestrator должен вернуть:

1. Task classification
2. Risk level
3. Recommended execution mode
4. Required agents
5. Recommended Cursor model
6. Context capsule
7. Scope
8. Out of scope
9. Required workflow
10. Review gates
11. Validation requirements
12. Documentation / canon requirements
13. Acceptance criteria
14. Next step / Cursor prompt

---

# 10. Связанные документы

- `docs/ai/roles_overview.md`
- `docs/ai/agents_index.md`
- `docs/ai/workflows.md`
- `docs/ai/workflows/pipeline_overview.md`
- `docs/ai/workflows/review_pipeline.md`
- `docs/ai/workflows/agent_lifecycle.md`
- `docs/ai/workflows/iteration_rules.md`
- `docs/ai/context_map_for_cursor.md`
- `docs/ai/decisions/adr_0001_multiagent_architecture.md`
- `docs/ai/decisions/adr_0002_roles_vs_workflows_structure.md`
- `docs/ai/decisions/adr_0003_no_extra_directories_for_mvp.md`
- `docs/ai/decisions/adr_0005_ai_ops_v1_and_advanced_specialist_agents.md`

---

# 11. Итог

Auto-routing Go2Asia теперь работает не только по типу задачи, но и по:

- risk level;
- domain impact;
- runtime sensitivity;
- economy/security impact;
- need for validation evidence;
- need for canon update;
- model routing;
- context capsule.

Цель обновлённого auto-routing — обеспечить управляемую, безопасную и воспроизводимую работу Cursor как AI-команды разработки Go2Asia.
