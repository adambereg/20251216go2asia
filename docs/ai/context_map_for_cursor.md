# Context Map for Cursor — как ориентироваться в docs/ для Go2Asia

## Назначение документа

Этот документ предназначен для Cursor, Orchestrator и AI-агентов Go2Asia.

Его задача — быстро определить, какие документы и директории нужно читать перед выполнением конкретной задачи, не подтягивая весь репозиторий без необходимости.

После принятия ADR-005 карта контекста обновлена под Go2Asia AI Ops v1 и 15-ролевую layered multi-agent governance model.

Главные цели:

- уменьшить context drift;
- снизить token burn;
- повысить точность Cursor;
- не смешивать несвязанные домены;
- обеспечить ADR-first и context capsule-first подход;
- помочь Orchestrator правильно выбирать AI-агентов;
- поддерживать runtime/economy/security/canon governance.

---

# 1. Приоритет чтения

Перед тем как что-то менять в коде или документации, Cursor должен придерживаться порядка:

## 1. ADR / Decisions

Сначала читать решения:

- глобальные ADR: `docs/decisions/adr_*.md`
- AI-specific ADR: `docs/ai/decisions/adr_*.md`

ADR объясняют, почему система устроена именно так. Их нельзя игнорировать.

Особенно важны:

- `docs/ai/decisions/adr_0001_multiagent_architecture.md`
- `docs/ai/decisions/adr_0002_roles_vs_workflows_structure.md`
- `docs/ai/decisions/adr_0003_no_extra_directories_for_mvp.md`
- `docs/ai/decisions/adr_0004_embedded_ux_ui_model.md`
- `docs/ai/decisions/adr_0005_ai_ops_v1_and_advanced_specialist_agents.md`

## 2. High-level overview

Затем читать высокоуровневые overview-документы:

- `docs/overview/go2asia_overview.md`
- `docs/overview/go2asia_architecture.md`
- `docs/overview/go2asia_modules_map.md`

## 3. AI Ops / workflow documents

Для complex tasks читать:

- `docs/ai/roles_overview.md`
- `docs/ai/agents_index.md`
- `docs/ai/workflows.md`
- `docs/ai/workflows/pipeline_overview.md`
- `docs/ai/workflows/auto_routing.md`
- `docs/ai/workflows/review_pipeline.md`
- `docs/ai/workflows/agent_lifecycle.md`
- `docs/ai/workflows/iteration_rules.md`

## 4. Role files

Для каждой задачи читать только нужные роли из:

- `docs/ai/roles/*.md`

Не нужно читать все роли, если задача узкая.

## 5. Профильная область задачи

Далее читать только профильную капсулу:

- architecture;
- frontend;
- backend;
- ops;
- economy;
- runtime governance;
- runtime validation;
- security/fraud;
- content/SEO;
- AI roles/workflows;
- canon alignment.

---

# 2. Принцип Context Capsule

Context capsule — это минимальный набор документов, который нужен Cursor для выполнения конкретной задачи.

Каждая complex task должна иметь:

- domain;
- required docs;
- required ADR;
- required role files;
- allowed directories;
- read-only directories;
- forbidden directories;
- review gates;
- recommended Cursor model.

Cursor не должен читать “всё подряд”.

---

# 3. Базовые контекстные капсулы

## 3.1. AI Ops / Multi-agent Governance Capsule

Когда задача про AI-агентов, roles, workflows, orchestration, routing, review pipeline, context governance.

### Читать

- `docs/ai/roles_overview.md`
- `docs/ai/agents_index.md`
- `docs/ai/workflows.md`
- `docs/ai/workflows/pipeline_overview.md`
- `docs/ai/workflows/auto_routing.md`
- `docs/ai/workflows/review_pipeline.md`
- `docs/ai/workflows/agent_lifecycle.md`
- `docs/ai/workflows/iteration_rules.md`
- `docs/ai/decisions/adr_0001_multiagent_architecture.md`
- `docs/ai/decisions/adr_0002_roles_vs_workflows_structure.md`
- `docs/ai/decisions/adr_0003_no_extra_directories_for_mvp.md`
- `docs/ai/decisions/adr_0005_ai_ops_v1_and_advanced_specialist_agents.md`

### Роли

- Orchestrator / AI Program Director
- Technical Canon Writer
- Delivery Planner
- Slice Strategist, если изменение крупное

### Review gates

- Canon Review
- Plan Review, если меняется planning workflow
- Architecture Review, если меняется AI-system architecture

### Model

- GPT-5.5 Medium для больших изменений
- GPT-5.3 / Auto для простых docs updates

---

## 3.2. Architecture Capsule

Когда задача про архитектуру, сервисы, API, границы модулей, data flow, microservices.

### Читать

- `docs/overview/go2asia_architecture.md`
- `docs/architecture/system_architecture.md`
- `docs/architecture/microfrontends.md`
- `docs/architecture/microservices.md`
- `docs/architecture/api_architecture.md`
- `docs/architecture/be_architecture.md`
- `docs/architecture/data_flow.md`
- `docs/decisions/adr_*.md`
- профильный ADR по теме
- профильный module/backend docs

### Роли

- Software Architect
- Delivery Planner
- Runtime Governance Architect, если есть lifecycle/projections
- Security, если есть security implications
- Technical Canon Writer

### Review gates

- Architecture Review
- Runtime Governance Review, если применимо
- Security Review, если применимо
- Canon Review

### Model

- GPT-5.5 Medium

---

## 3.3. Frontend / PWA Module Capsule

Когда задача про UI, страницы, routing, components, module screens.

### Читать

- `docs/design/ui_kit.md`
- `docs/design/design_tokens.md`
- `docs/design/mobile_vs_desktop.md`
- `docs/design/components/*.md`
- `docs/design/layouts/*.md`
- профильный модуль в `docs/modules/<module>/`
- `apps/go2asia-pwa-shell/**`
- `packages/ui/**`
- `packages/sdk/**`, если есть API integration

### Read-only

- `prototypes/**`
- `design-system/**`

### Роли

- Frontend Developer
- QA Agent
- Security, если role-based visibility
- Runtime Governance Architect, если UI показывает runtime status/projection
- Technical Canon Writer, если меняется documented behavior

### Review gates

- Code Review
- QA
- Security Review, если есть role/access impact
- Canon Review, если docs affected

### Model

- Codex 5.3 Medium для implementation
- Auto / Composer для мелких UI fixes

---

## 3.4. Backend / API Capsule

Когда задача про API, сервисы, БД, интеграции, бизнес-логику.

### Читать

- `docs/architecture/be_architecture.md`
- `docs/architecture/api_architecture.md`
- `docs/architecture/data_flow.md`
- профильный service docs в `docs/backend/<service>/`
- профильный module docs в `docs/modules/<module>/`
- relevant OpenAPI / SDK docs
- relevant Prisma/schema docs, если есть
- relevant ADR

### Роли

- Backend Developer
- Software Architect, если меняется contract/data model
- QA Agent
- Security / SecOps
- Runtime Governance Architect, если lifecycle/projection/reconciliation affected
- Economy Architect, если economy affected
- Technical Canon Writer

### Review gates

- Architecture Review, если меняется contract/data model
- Code Review
- Security Review
- Runtime Governance Review, если applicable
- Economy Review, если applicable
- Canon Review

### Model

- Codex 5.3 Medium для implementation
- GPT-5.5 Medium для architecture/runtime/economy reasoning

---

## 3.5. DevOps / Infrastructure Capsule

Когда задача про окружения, deploy, CI/CD, Cloudflare, Netlify, Neon, Clerk, secrets.

### Читать

- `docs/ops/ci_cd.md`
- `docs/ops/environments.md`
- `docs/ops/secrets_management.md`
- `docs/ops/monitoring.md`
- `docs/ops/logging.md`
- `docs/ops/cloudflare_setup.md`
- `docs/ops/netlify_setup.md`
- `docs/ops/deployment_guides/frontend_deploy.md`
- `docs/ops/deployment_guides/backend_deploy.md`
- `docs/ops/deployment_guides/zero_downtime_updates.md`
- `.cursor-rules`

### Роли

- DevOps Agent
- Security / SecOps
- QA Agent, если нужен smoke
- Architect, если меняются service boundaries
- Technical Canon Writer

### Важно

Инфраструктура уже развёрнута. Cursor не должен создавать новые Workers/DB/apps или перенастраивать облачную стратегию без Orchestrator/ADR.

### Review gates

- Security Review
- Architecture Review, если infrastructure affects architecture
- Canon Review

### Model

- Codex 5.3 Medium для bounded config work
- GPT-5.5 Medium для infra architecture decisions

---

# 4. Advanced Specialist Capsules

## 4.1. Economy Capsule

Когда задача про Points, G2A, NFT, rewards, spendability, token sinks, PRO incentives, partner settlement.

### Читать

- `docs/economy/`
- `docs/decisions/adr_0008_tokenomics_dual_contour_design.md`
- `docs/knowledge/user_roles.md`
- профильные docs модуля:
  - RF;
  - Rielt;
  - Quest;
  - Connect;
  - Space;
- профильный backend service docs
- relevant API contracts
- `docs/ai/roles/economy_architect.md`
- `docs/ai/roles/security.md`
- `docs/ai/roles/runtime_governance_architect.md`, если есть lifecycle/runtime
- ADR-005

### Роли

- Economy Architect
- Security / Fraud & Abuse
- Runtime Governance Architect, если есть spendability/lifecycle/runtime
- Backend Developer, если implementation
- QA Agent
- Runtime Validation Agent, если нужен staging proof
- Technical Canon Writer

### Review gates

- Economy Review
- Fraud & Abuse Review
- Runtime Governance Review, если applicable
- Code Review, если implementation
- Runtime Validation Review, если evidence required
- Canon Review

### Model

- GPT-5.5 Medium для design/review
- Codex 5.3 Medium для bounded implementation

---

## 4.2. Runtime Governance Capsule

Когда задача про canonical-first runtime, lifecycle, projections, reconciliation, shadow compare, drift.

### Читать

- `docs/architecture/data_flow.md`
- `docs/architecture/api_architecture.md`
- `docs/architecture/be_architecture.md`
- профильные runtime docs
- профильные backend docs
- профильные module docs
- shadow compare reports
- staging evidence, если есть
- `docs/ai/roles/runtime_governance_architect.md`
- `docs/ai/roles/runtime_validation_agent.md`
- `docs/ai/roles/security.md`, если есть replay/race/security risk
- ADR-005

### Роли

- Runtime Governance Architect
- Runtime Validation Agent
- Backend Developer
- QA Agent
- Security, если replay/race/abuse risk
- Economy Architect, если balances/rewards/settlement
- Technical Canon Writer

### Review gates

- Runtime Governance Review
- Runtime Validation Review
- Security Review, если applicable
- Economy Review, если applicable
- Canon Review

### Model

- GPT-5.5 Medium для governance/design
- Codex 5.3 Medium для implementation

---

## 4.3. Runtime Validation Capsule

Когда задача про staging validation, evidence bundle, shadow validation, runtime proof.

### Читать

- validation runbooks
- staging reports
- runtime reports
- evidence bundles
- shadow compare outputs
- logs/metrics summaries
- профильные module/backend docs
- `docs/ai/roles/runtime_validation_agent.md`
- `docs/ai/roles/runtime_governance_architect.md`
- `docs/ai/roles/qa.md`
- `docs/ai/roles/security.md`, если relevant
- ADR-005

### Роли

- Runtime Validation Agent
- Runtime Governance Architect
- QA Agent
- Security, если security-sensitive
- Backend Developer, если validation выявила bug
- Technical Canon Writer

### Review gates

- Runtime Validation Review
- Runtime Governance Review, если findings affect contract
- Security Review, если findings security-sensitive
- Canon Review

### Model

- GPT-5.5 Medium для evidence analysis
- Codex 5.3 Medium для bounded fixes

---

## 4.4. Security / Fraud / Abuse Capsule

Когда задача про auth, roles, secrets, rewards abuse, vouchers abuse, replay, race, fraud.

### Читать

- `docs/ops/secrets_management.md`
- `docs/ops/environments.md`
- `docs/architecture/api_architecture.md`
- `docs/architecture/be_architecture.md`
- profile backend docs
- economy docs, если rewards/economy
- runtime docs, если replay/race/projection
- `docs/ai/roles/security.md`
- `docs/ai/roles/economy_architect.md`, если economy
- `docs/ai/roles/runtime_governance_architect.md`, если runtime
- ADR-005

### Роли

- Security / SecOps
- Fraud & Abuse mode
- Economy Architect, если rewards/economy
- Runtime Governance Architect, если runtime/replay/projection
- Backend Developer / DevOps для fixes
- QA Agent
- Runtime Validation Agent, если evidence required
- Technical Canon Writer

### Review gates

- Security Review
- Fraud & Abuse Review
- Economy Review, если economy
- Runtime Governance Review, если runtime
- Code Review, если fix
- Runtime Validation Review, если evidence required
- Canon Review

### Model

- GPT-5.5 Medium для review/threat modeling
- Codex 5.3 Medium для bounded fixes

---

## 4.5. Canon Alignment Capsule

Когда задача про документацию, ADR, roles, workflows, SSOT, docs/runtime mismatch.

### Читать

- `docs/ai/roles_overview.md`
- `docs/ai/agents_index.md`
- `docs/ai/workflows.md`
- `docs/ai/workflows/*.md`
- `docs/ai/roles/*.md`, только relevant roles
- `docs/ai/decisions/adr_*.md`
- `docs/decisions/adr_*.md`
- профильные docs по домену
- runtime/evidence reports, если есть docs/runtime mismatch

### Роли

- Technical Canon Writer
- Orchestrator
- профильный агент:
  - Architect;
  - Economy Architect;
  - Runtime Governance Architect;
  - Security;
  - Delivery Planner.

### Review gates

- Canon Review
- Architecture/Economy/Runtime/Security Review, если domain impact

### Model

- GPT-5.5 Medium для complex canon conflicts
- GPT-5.3 / Auto для simple docs updates

---

## 4.6. Slice Strategy Capsule

Когда задача слишком большая, high/critical risk, complex stage, unclear boundaries.

### Читать

- `docs/ai/roles/slice_strategist.md`
- `docs/ai/roles/orchestrator.md`
- `docs/ai/workflows/auto_routing.md`
- `docs/ai/workflows/review_pipeline.md`
- `docs/ai/workflows/pipeline_overview.md`
- профильные docs задачи
- relevant ADR

### Роли

- Slice Strategist
- Orchestrator
- Delivery Planner
- профильные agents по домену

### Review gates

- Slice Review
- Plan Review, если создаётся план
- Canon Review, если меняется docs/decision

### Model

- GPT-5.5 Medium

---

# 5. Domain-specific capsules

## 5.1. RF / Voucher / PRO Attribution Capsule

Когда задача про RF Asia, vouchers, offers, claim, redeem, PRO attribution, merchant settlement.

### Читать

- `docs/modules/rf_partners/`
- профильные RF backend docs
- RF API contracts
- RF economy docs
- RF runtime/projection docs
- `docs/economy/`, если rewards/spendability/settlement
- `docs/ai/roles/runtime_governance_architect.md`
- `docs/ai/roles/economy_architect.md`
- `docs/ai/roles/security.md`
- `docs/ai/roles/runtime_validation_agent.md`
- ADR по токеномике / vouchers / RF, если есть

### Роли

- Runtime Governance Architect
- Economy Architect
- Security / Fraud & Abuse
- Slice Strategist
- Backend Developer
- Frontend Developer, если UI
- QA Agent
- Runtime Validation Agent
- Technical Canon Writer

### Review gates

- Runtime Governance Review
- Economy Review
- Fraud & Abuse Review
- Code Review
- Runtime Validation Review
- Canon Review

### Model

- GPT-5.5 Medium для design/audit/review
- Codex 5.3 Medium для implementation

---

## 5.2. Points / G2A / NFT Capsule

Когда задача про wallet, balances, rewards, token gateway, NFT, on-chain/off-chain.

### Читать

- `docs/economy/`
- `docs/decisions/adr_0008_tokenomics_dual_contour_design.md`
- token service docs
- blockchain gateway / wallet service docs
- relevant backend docs
- `docs/ai/roles/economy_architect.md`
- `docs/ai/roles/security.md`
- `docs/ai/roles/runtime_governance_architect.md`
- `docs/ai/roles/runtime_validation_agent.md`

### Роли

- Economy Architect
- Security / Fraud & Abuse
- Runtime Governance Architect
- Architect, если service boundary/API changes
- Backend Developer
- QA Agent
- Runtime Validation Agent
- Technical Canon Writer

### Review gates

- Economy Review
- Fraud & Abuse Review
- Runtime Governance Review
- Security Review
- Code Review
- Runtime Validation Review
- Canon Review

### Model

- GPT-5.5 Medium for reasoning
- Codex 5.3 Medium for implementation

---

## 5.3. Rielt / Real Estate Capsule

Когда задача про Rielt Asia, property vouchers, real estate offers, RF integration.

### Читать

- `docs/modules/rielt/`
- `docs/backend/rielt_service/`
- RF docs, если есть voucher integration
- economy docs, если есть Points/vouchers
- frontend module files
- backend service files

### Роли

- Architect, если меняется service/API
- Backend Developer
- Frontend Developer
- Runtime Governance Architect, если vouchers/lifecycle
- Economy Architect, если rewards/spendability
- Security / Fraud & Abuse
- QA Agent
- Technical Canon Writer

### Review gates

- Architecture Review, если applicable
- Code Review
- Economy/Fraud/Runtime Reviews, если applicable
- Canon Review

---

## 5.4. Space / Social / UGC Capsule

Когда задача про Space Asia, социальную ленту, посты, лайки, user-generated activity.

### Читать

- `docs/modules/space/`
- social/feed docs
- content/UGC rules
- economy docs, если есть rewards за действия
- security docs, если есть abuse/moderation

### Роли

- Requirements Analyst, если новая social feature
- Architect, если data model/API
- Frontend Developer
- Backend Developer
- Security / Fraud & Abuse, если rewards/UGC abuse
- Economy Architect, если points rewards
- QA Agent
- Technical Canon Writer

### Review gates

- Requirements / Architecture / Code Review
- Fraud & Abuse Review, если UGC/rewards
- Economy Review, если rewards
- Canon Review

---

## 5.5. Quest / Missions Capsule

Когда задача про Quest Asia, миссии, награды, маршруты, completion logic.

### Читать

- `docs/modules/quest/`
- quest backend docs
- economy docs, если rewards/NFT
- runtime docs, если lifecycle/completion/proofs

### Роли

- Architect
- Economy Architect
- Runtime Governance Architect
- Security / Fraud & Abuse
- Backend Developer
- Frontend Developer
- QA Agent
- Runtime Validation Agent, если completion proof
- Technical Canon Writer

### Review gates

- Architecture Review
- Economy Review
- Fraud & Abuse Review
- Runtime Governance Review
- Code Review
- Runtime Validation Review, если applicable
- Canon Review

---

# 6. Quick routing table

| Task | Context capsule | Lead agents |
|---|---|---|
| New feature | Requirements + Architecture + Delivery | Orchestrator, Requirements, Architect, Planner |
| UI page | Frontend/PWA | Frontend, QA |
| Backend API | Backend/API | Backend, Architect if contract changes |
| Economy rule | Economy | Economy, Security, Runtime Governance |
| Points spendability | Economy + Runtime Governance | Economy, Runtime Governance, Security |
| RF voucher lifecycle | RF + Runtime + Economy | Runtime Governance, Economy, Security |
| Staging validation | Runtime Validation | Runtime Validation, QA |
| Fraud analysis | Security/Fraud | Security, Economy/Runtime if relevant |
| AI role update | AI Ops + Canon | Orchestrator, Technical Canon Writer |
| Docs/runtime mismatch | Canon + Runtime | Technical Canon Writer, Runtime Governance |
| Big risky task | Slice Strategy | Slice Strategist, Orchestrator |

---

# 7. Allowed / read-only / forbidden areas

## Allowed areas

Cursor may edit:

- `apps/go2asia-pwa-shell/**`
- `services/**`
- `packages/**`
- `docs/**`

according to task scope.

## Read-only reference areas

Cursor may read but must not edit:

- `prototypes/**`
- `design-system/**`

unless explicitly allowed by owner / ADR.

## Forbidden without explicit approval

Cursor must not:

- create new top-level AI directories outside `roles/`, `workflows/`, `decisions/`;
- create new infrastructure without Orchestrator approval;
- change deployment architecture without ADR;
- change canonical economy/security/runtime rules without review;
- perform dangerous Git operations automatically if forbidden by `.cursor-rules`.

---

# 8. Context selection rules

## Rule 1 — ADR first

Always read ADR before implementation.

## Rule 2 — Minimum context

Read only the smallest relevant capsule.

## Rule 3 — Role files by domain

Read only relevant `docs/ai/roles/*.md`.

## Rule 4 — Do not mix unrelated modules

RF task should not pull Atlas/Pulse/Blog unless dependency exists.

## Rule 5 — Runtime/economy/security tasks require specialists

Do not treat them as ordinary backend tasks.

## Rule 6 — Canon updates after decisions

If rules changed, update documentation.

## Rule 7 — Evidence required for runtime claims

Do not claim runtime correctness without validation/evidence.

---

# 9. Model routing hints

| Context capsule | Recommended model |
|---|---|
| AI Ops / multi-agent governance | GPT-5.5 Medium |
| Architecture | GPT-5.5 Medium |
| Economy | GPT-5.5 Medium |
| Runtime Governance | GPT-5.5 Medium |
| Runtime Validation evidence analysis | GPT-5.5 Medium |
| Security / Fraud | GPT-5.5 Medium |
| Backend implementation | Codex 5.3 Medium |
| Frontend implementation | Codex 5.3 Medium |
| Small docs/UI fixes | Auto / Composer |
| Canon conflict resolution | GPT-5.5 Medium |
| Simple canon/docs update | GPT-5.3 / Auto |

---

# 10. Review gate hints by capsule

| Capsule | Required review gates |
|---|---|
| Requirements | Requirements Review |
| Architecture | Architecture Review |
| Frontend | Code Review / QA |
| Backend/API | Code Review / Security |
| Economy | Economy Review / Fraud & Abuse / Canon |
| Runtime Governance | Runtime Governance Review / Canon |
| Runtime Validation | Runtime Validation Review / Canon |
| Security/Fraud | Security Review / Fraud & Abuse Review |
| AI Ops | Canon Review / Architecture Review if structural |
| Slice Strategy | Slice Review |
| RF Voucher | Runtime Governance / Economy / Fraud / Runtime Validation / Canon |

---

# 11. Output expectation for Cursor

When Cursor uses this context map, it should report:

1. Selected context capsule
2. Files read
3. ADR read
4. Role files used
5. Files edited
6. Files not touched
7. Review gates triggered
8. Validation required
9. Canon updates required
10. Remaining uncertainties

---

# 12. Ops & Infrastructure note

Cloudflare, DNS, R2, Workers, Netlify, Neon DB, Clerk Auth and GitHub Actions are already part of the project environment.

Cursor should adapt architecture to the existing environment.

Cursor must not propose replacing the infrastructure stack without explicit architecture decision / ADR.

---

# 13. Связанные документы

- `docs/ai/roles_overview.md`
- `docs/ai/agents_index.md`
- `docs/ai/workflows.md`
- `docs/ai/workflows/pipeline_overview.md`
- `docs/ai/workflows/auto_routing.md`
- `docs/ai/workflows/review_pipeline.md`
- `docs/ai/workflows/agent_lifecycle.md`
- `docs/ai/workflows/iteration_rules.md`
- `docs/ai/decisions/adr_0001_multiagent_architecture.md`
- `docs/ai/decisions/adr_0002_roles_vs_workflows_structure.md`
- `docs/ai/decisions/adr_0003_no_extra_directories_for_mvp.md`
- `docs/ai/decisions/adr_0004_embedded_ux_ui_model.md`
- `docs/ai/decisions/adr_0005_ai_ops_v1_and_advanced_specialist_agents.md`

---

# 14. Итог

`context_map_for_cursor.md` — это карта контекстных капсул Go2Asia.

Она помогает Cursor:

- не терять контекст;
- не читать лишнее;
- не смешивать unrelated domains;
- выбирать нужных AI-агентов;
- соблюдать ADR;
- соблюдать AI Ops v1;
- применять review gates;
- фиксировать runtime/economy/security/canon implications.

Любая complex task должна начинаться с выбора context capsule.
