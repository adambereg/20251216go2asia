# Go2Asia Economy Layer (SSOT)

## 1. Назначение

Директория `docs/economy/` содержит каноническое описание экономической модели экосистемы Go2Asia.

Это отдельный SSOT-слой, который отвечает на вопрос:

👉 **почему и за счёт чего система работает**

В отличие от:
- `architecture/` — как система устроена
- `modules/` — что делают модули
- `interface/` — как это выглядит

👉 `economy/` описывает:
- мотивацию пользователей
- потоки ценности
- монетизацию
- поведенческую механику

---

## 2. Статус

Все документы в этой директории имеют статус:

👉 **SSOT (Single Source of Truth)**

Если возникает конфликт:
- между экономикой и UI → UI должен быть изменён
- между экономикой и backend → backend должен быть изменён
- между экономикой и старыми документами → старые документы устаревают

### 2.1 Runtime Alignment Note

`points_policy_v1.md` is the runtime-aligned policy document for Rewards / Points v1.

`referral_network_rewards_policy_v1.md` is the runtime-aligned policy document for referral and network rewards.

Older economy documents in this directory may describe target behavior or future layers. If they mention G2A, NFT/Totem, on-chain mechanics, PRO rewards, partner payouts, VIP entitlement unlocks, `referral_unlock`, network accrual, or hard `lockedPoints` enforcement, those statements must be read as target/future unless explicitly marked as current runtime by the runtime-aligned policy documents.

Current runtime must not treat G2A, NFT/Totem gates, on-chain withdrawal, PRO payout mechanics, partner settlement, VIP entitlement lifecycle, `referral_unlock`, or network accrual producers as active unless a separate runtime contract and implementation exist.

---

## 3. Общая модель экономики

Go2Asia — это:

👉 **двухконтурная loyalty-экономика с активацией через VIP**

### Внутренний контур (основной)
- валюта: Points
- среда: off-chain
- функции:
  - накопление ценности
  - геймификация
  - потребление (ваучеры, квесты, NFT)

### Внешний контур (вспомогательный)
- валюта: G2A
- активы: on-chain NFT
- функции:
  - компенсации партнёрам
  - вознаграждение PRO
  - вывод ценности

---

## 4. Главный принцип

👉 Платформа зарабатывает не на транзакциях, а на доступе к ценности.

- нет комиссии с партнёров
- нет комиссии с услуг
- нет комиссии с ваучеров

👉 единственная монетизация:
- VIP — 1000 руб / 30 дней
- PRO — 30000 руб / год

---

## 5. Core Loop (ядро экономики)

Активность → Points → VIP → Трата → Польза → Новая активность

Расширенная версия:
Points → Pressure → VIP → Spend + Network → Growth

---

## 6. Структура документов

### 6.0 Points Policy (runtime-aligned policy)

📄 `points_policy_v1.md`

Описывает:
- VIP как главный unlock для траты Points
- классы Points и модель доступности
- runtime-aligned границы Points / RF / Referral / Connect
- что является текущим runtime, target policy и future layer

👉 Это **канонический policy-документ для Rewards / Points v1**

---

### 6.0a Referral & Network Rewards Policy

📄 `referral_network_rewards_policy_v1.md`

Описывает:
- direct и second-level referral Points
- Conditional Points и VIP-зависимые unlock rules
- network activity rewards как participation mechanics
- current runtime, target policy и future implementation boundaries

👉 Это **канонический policy-документ для referral / network rewards**

---

### 6.0b Layered Value Architecture

📄 `layered_value_architecture_v1.md`

Описывает:
- многоуровневую архитектуру движения ценности Go2Asia
- связку Attention → Points → VIP → Consumption → NFT / Progression → Operator Layer → Externalized Value
- почему Points, VIP, vouchers, NFT, PRO, партнёры и G2A являются разными слоями ценности, а не конкурирующими валютами
- semantic / explanatory topology между существующими economy SSOT-документами

👉 Это **объяснительный документ о Layered Value Architecture**, а не runtime policy и не замена runtime-aligned documents

---

### 6.0c Semantic Axes of Points

📄 `points/semantic_axes_of_points_v1.md`

Описывает:
- подготовительный semantic framework перед Points Taxonomy v1
- оси классификации Points: origin, state, visibility, spendability, authority, utility, layer, lifecycle, sinkability, fungibility, risk / abuse
- почему origin является metadata, а не отдельным типом валюты
- почему visible value не равен spendable balance, а projection не равен ledger truth

👉 Это **pre-taxonomy документ по semantic axes Points**, а не финальная taxonomy, reward catalog, ledger design или runtime model

---

### 6.0d Points Taxonomy v1

📄 `points_taxonomy_v1.md`

Описывает:
- canonical taxonomy of internal utility value in Go2Asia
- semantic Point classes и их relationship к Layered Value Architecture и Semantic Axes of Points
- связь Point classes с VIP activation, sinks, future ledger semantics и runtime-aligned policies
- почему taxonomy не создаёт отдельные wallet currencies, payout rights, reward producers, ledger activation или spend enforcement

👉 Это **semantic taxonomy of Points**, а не runtime model, ledger design, reward catalog, implementation plan или activation artifact

---

### 6.0e Reward Event Catalog v1

📄 `reward_event_catalog_v1.md`

Описывает:
- canonical semantic catalog of reward-relevant ecosystem events
- event families и их relationship к Points Taxonomy, Semantic Axes of Points и Layered Value Architecture
- связь event families с VIP activation, sinks, progression, network utility и future ledger vocabulary
- почему event catalog не создаёт runtime producers, ledger writes, event bus, schemas, payout rights или spend enforcement

👉 Это **semantic catalog of reward events**, а не runtime event bus, ledger event implementation, event schema, API contract, producer implementation или payout pipeline

---

### 6.0f Reward Lifecycle / Soft Accrual Rules v1

📄 `reward_lifecycle_soft_accrual_rules_v1.md`

Описывает:
- semantic lifecycle of reward value and soft accrual rules
- lifecycle stages: observed, classified, pending, conditional, projected, available, spent, burned, reversed, corrected, expired, archived
- boundaries между observed, classified, pending, conditional, projected, available, spent, burned, reversed, corrected, expired and archived value
- почему lifecycle не создаёт runtime states, ledger transitions, reward producers, accrual pipeline, payout rights или spend enforcement

👉 Это **semantic lifecycle and soft accrual policy language**, а не ledger state machine, event sourcing design, runtime accrual pipeline, database schema, API contract или implementation plan

---

### 6.0g Role-Based Rewards Matrix v1

📄 `role_based_rewards_matrix_v1.md`

Описывает:
- semantic role-based behavioral economy model
- как Guest, Spacer, VIP, PRO и Partner participate in value creation, progression, sinks, VIP pressure and ecosystem expansion
- relationship ролей к Point Taxonomy, Reward Event Catalog, Layered Value Architecture, sinks, network utility and future ledger vocabulary
- почему role matrix не создаёт RBAC, permissions, runtime entitlements, payout rights, partner settlement, reward producers, accrual pipeline, ledger activation или spend enforcement

👉 Это **semantic role-based reward / value participation model**, а не RBAC system, permissions model, auth/ACL matrix, runtime entitlement system, payout matrix, operator compensation runtime или partner settlement system

---

### 6.0h Referral & Network Reward Model Alignment v1

📄 `referral_network_reward_model_alignment_v1.md`

Описывает:
- semantic alignment of referral and network utility language
- conditional referral value, projected network utility, VIP-related network pressure and ecosystem participation semantics
- связь referral/network semantics с Point Taxonomy, Reward Event Catalog, Reward Lifecycle, Role Matrix, VIP activation and RF / Voucher Economy
- почему referral/network model не создаёт MLM, payout, passive income, affiliate commission, reward producers, accrual pipeline, ledger activation или spend enforcement

👉 Это **semantic referral / network utility language alignment**, а не referral payout system, MLM model, affiliate commission system, runtime referral engine, reward producer activation, payout pipeline или ledger implementation

---

### 6.0i RF / Voucher Reward Policy v1

📄 `rf_voucher_reward_policy_v1.md`

Описывает:
- semantic RF / Voucher utility and consumption policy language
- voucher utility, consumption semantics, sink participation, practical utility relevance and ecosystem density
- связь RF / Voucher semantics с Point Taxonomy, Reward Event Catalog, Reward Lifecycle, Role Matrix, Referral / Network Alignment, VIP activation and Points Sink Design
- почему RF / Voucher model не создаёт payment system, cashback, affiliate payout, partner settlement, reward producers, accrual pipeline, ledger activation или spend enforcement

👉 Это **semantic RF / Voucher utility and consumption policy language**, а не payment system, partner settlement system, cashback system, affiliate payout system, marketplace settlement model, runtime voucher engine или ledger implementation

---

### 6.0j Quest / Badge / Achievement Compatibility Draft v1

📄 `quest_badge_achievement_compatibility_v1.md`

Описывает:
- semantic progression / prestige / achievement compatibility language
- quest utility, badge utility, achievement utility, progression semantics, collection relevance, retention utility and future NFT compatibility
- связь quest/badge/achievement semantics с Point Taxonomy, Reward Event Catalog, Reward Lifecycle, Role Matrix, RF / Voucher Reward Policy, VIP activation and Points Sink Design
- почему progression layer не создаёт paid task, gig marketplace, payout, speculative NFT layer, marketplace, NFT/on-chain activation, reward producers, accrual pipeline, ledger activation или spend enforcement

👉 Это **semantic progression / prestige / achievement compatibility language**, а не game engine, quest runtime, NFT activation layer, on-chain system, marketplace, achievement payout system, task marketplace или paid gig system

---

### 6.0k Reward Sizing & Sink Pressure Modeling Draft v1

📄 `reward_sizing_sink_pressure_modeling_v1.md`

Описывает:
- behavioral-economic modeling draft for reward velocity, sink pressure, accumulation pacing, progression pacing, retention pressure, scarcity pacing and practical utility dynamics
- semantic reward sizing bands, sink pressure bands, behavioral pressure zones and healthy spend dynamics
- связь reward/sink modeling с Point Taxonomy, Reward Event Catalog, Reward Lifecycle, VIP activation, RF / Voucher utility, Referral / Network Alignment and progression / prestige compatibility
- почему modeling layer не создаёт production reward configuration, live reward table, payout table, runtime balancing engine, reward producers, accrual pipeline, ledger activation, marketplace activation или spend enforcement

👉 Это **behavioral-economic modeling draft**, а не production tokenomics config, live reward table, final reward amounts, ledger policy, payout system, accounting model, runtime balancing engine или implementation plan

---

### 6.0l Future Ledger Readiness Draft v1

📄 `future_ledger_readiness_v1.md`

Описывает:
- semantic future ledger readiness draft for preserving value history, authority distinctions, lifecycle interpretation, conditional/projected/available value boundaries, spend/burn/correction vocabulary, service ownership context and future read-model clarity without ledger activation or schema design
- future ledger readiness principles, vocabulary candidates, future value history semantics, authority and truth boundaries, and conditional/projected/available distinctions
- связь future ledger readiness с Point Taxonomy, Reward Event Catalog, Reward Lifecycle, Referral / Network, RF / Voucher, Quest / Badge / Achievement, Reward Sizing & Sink Pressure Modeling and service ownership boundaries
- почему readiness layer не создаёт ledger schema, database tables, event sourcing spec, accounting system, wallet implementation, reward producers, accrual pipeline, spend enforcement, payout rights, marketplace activation, NFT/on-chain activation или Slice 16 unblock

👉 Это **semantic future ledger readiness draft**, а не ledger implementation, ledger schema, database design, event sourcing spec, accounting model, wallet implementation, read-model implementation, payout system, runtime activation или implementation plan

---

### 6.0m Abuse / Dispute / Correction Soft Policy v1

📄 `abuse_dispute_correction_soft_policy_v1.md`

Описывает:
- semantic soft policy for abuse-sensitive contexts, disputes, correction, reversal, recovery, expiration, archival, fairness and trust language without fraud engine, enforcement, deny/fail-closed, account sanctions, legal workflow, support workflow, ledger correction implementation or payout activation
- abuse-sensitive categories, dispute language, correction/reversal/recovery semantics, expiration/archival semantics and fairness / trust principles
- связь soft policy с Point Taxonomy, Reward Event Catalog, Reward Lifecycle, Referral / Network, RF / Voucher, Quest / Badge / Achievement, Reward Sizing & Sink Pressure Modeling and Future Ledger Readiness
- почему soft policy не создаёт fraud engine, enforcement policy, automated blocking, account sanctions, moderation runtime, dispute resolution workflow, legal/compliance procedure, support ticket system, ledger correction implementation, reward producers, accrual pipeline, payout system, marketplace activation, NFT/on-chain activation или Slice 16 unblock

👉 Это **semantic abuse / dispute / correction soft policy**, а не fraud engine, enforcement policy, deny policy, account sanction model, automated blocking system, moderation runtime, dispute resolution workflow, legal/compliance procedure, support ticket system, ledger correction implementation, refund / payout system или implementation plan

---

### 6.0n Points / Rewards Policy v1 Consolidation

📄 `points_rewards_policy_v1_consolidation.md`

Описывает:
- Stage 6 consolidation / navigation / doctrine document that summarizes the Points / Rewards Policy v1 semantic stack, authority hierarchy, shared invariants, forbidden interpretations, runtime boundaries and recommended alignment next steps without replacing runtime-aligned policies or activating runtime systems
- карту Stage 6.1-6.11 documents, authority hierarchy между runtime-aligned policy, Stage 6 semantic doctrine and background / legacy / future economy documents
- consolidated doctrine: Points are internal utility, VIP is activation layer, origin is metadata, visible != spendable, projected != ledger truth, lifecycle != state machine, readiness != implementation, soft policy != enforcement
- почему consolidation не создаёт runtime policy rewrite, reward engine, ledger design, reward table, implementation plan, producer activation, accrual pipeline activation, spend enforcement, fraud engine, payout, marketplace, NFT/on-chain activation, production activation или Slice 16 unblock

👉 Это **Stage 6 consolidation / navigation / doctrine document**, а не runtime policy replacement, runtime contract, reward engine, ledger design, reward table, implementation plan, activation artifact, QA evidence bundle или Slice 16 readiness artifact

---

### 6.0o Points / Rewards Policy v1

📄 `points_rewards_policy_v1.md`

Описывает:
- Unified umbrella-document and entry-point for the Go2Asia Points / Rewards semantic doctrine; summarizes Stage 6 economy architecture, authority hierarchy, lifecycle semantics, referral/RF/progression boundaries, behavioral modeling, future ledger readiness and anti-drift governance without replacing runtime-aligned policies or activating runtime systems
- human-readable reading surface для архитекторов, backend, UI/UX, product, QA reviewers and AI agents
- canonical economy doctrine: Points are internal utility, VIP is activation layer, origin is metadata, visible != spendable, projected != ledger truth, referral/network != MLM, RF/voucher != cashback/settlement, readiness != implementation, soft policy != enforcement
- связь с `points_rewards_policy_v1_consolidation.md`, который остаётся Stage 6 consolidation artifact, Stage 6 closure evidence and deeper doctrine map

👉 Это **unified umbrella entry-point for Points / Rewards Policy v1 semantic doctrine**, а не runtime policy rewrite, replacement for `points_policy_v1.md` or `referral_network_rewards_policy_v1.md`, ledger design, reward table, implementation plan, reward producer activation, accrual pipeline activation, spend enforcement activation, fraud engine, payout system, marketplace activation, NFT/on-chain activation, production activation или Slice 16 readiness artifact

---

### 6.0p Economy Authority & Terminology Crosswalk v1

📄 `economy_authority_terminology_crosswalk_v1.md`

Описывает:
- authority hierarchy для runtime authority, Stage 6 semantic doctrine и future / legacy / target docs
- terminology crosswalk для economy, backend/service, UI/product, RF/voucher и future ledger/token wording
- safe vs unsafe readings для wallet, rewards, referral/network, RF/voucher, ledger, token, NFT and Slice 16 language
- Stage 6.5 usage rules for future docs-only alignment slices

👉 Это **docs-only terminology and authority reading guard**, а не runtime authority, policy rewrite, implementation plan, ledger activation, payout/settlement activation, wallet/token activation, NFT/on-chain activation или Slice 16 readiness artifact

---

### 6.1 Tokenomics (основной документ)

📄 `tokenomics/go2asia_tokenomics_v1.md`

Описывает:
- полную экономическую модель
- роли пользователей
- core loops
- метрики
- LTV / монетизацию
- взаимодействие Points / G2A / NFT

👉 Это **главный документ экономики (entry point)**

---

### 6.2 Voucher Economy (RF слой)

📄 `vouchers/rf_voucher_economy_v1.md`

Описывает:
- ваучеры как основной механизм потребления
- роль бизнес-партнёров
- lifecycle ваучера
- связь с офлайн-услугами
- запуск внешнего контура

👉 Ваучер = интерфейс экономики

---

### 6.3 VIP Value System (поведенческая модель)

📄 `vip/vip_value_system_v1.md`

Описывает:
- почему пользователь покупает VIP
- давление Points и locked value
- сетевой доход
- UX-триггеры
- retention-модель

👉 VIP = слой активации экономики

---

### 6.4 Points Sink Design (антиинфляция)

📄 `points/points_sink_design_v1.md`

Описывает:
- куда уходят Points
- контроль инфляции
- баланс earn/spend
- уровни sinks
- MVP набор механик

👉 Sink = контроль ценности системы

---

## 7. Взаимосвязь документов

Tokenomics
   ↓
VIP Value System
   ↓
Points Sink Design
   ↓
Voucher Economy

Или:
Tokenomics → определяет правила
VIP → создаёт мотивацию
Sink → создаёт баланс
Vouchers → дают практическое применение

---

## 8. Связь с архитектурой

Экономика влияет на все ключевые сервисы:

Token Service → учёт Points
Wallet / Connect → отображение ценности
RF → ваучеры и партнёры
Quest → experiential sinks
Space → генерация активности
Blockchain Gateway → внешний контур

👉 Ни один из этих сервисов не должен реализовываться без учёта экономики

---

## 9. Каноничные правила
Points должны легко зарабатываться
Points должны иметь видимую ценность
Тратить Points можно только через VIP
Locked Points — главный триггер покупки
Ваучеры — основной способ потребления
NFT — антиинфляционный слой
Premium требует Points + NFT
Spend Rate важнее баланса
Монетизация = доступ, не комиссия
VIP = активация экономики

---

## 10. Главный инсайт

👉 Go2Asia — это не маркетплейс и не токен-проект.

👉 Это экономика избыточной ценности,
в которой пользователь платит за доступ к её использованию.

---

## 11. Использование

При разработке:

backend → проверять соответствие Tokenomics
frontend → проверять UX-триггеры VIP
RF → проверять логику ваучеров
Quest → проверять sink-механики
Connect → проверять отображение ценности

---

## 12. Следующий шаг

После стабилизации экономики:

👉 провести alignment pass:

Economy ↔ Architecture
Economy ↔ Backend services
Economy ↔ UI/UX