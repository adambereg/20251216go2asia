# Go2Asia — Next Steps Plan

**Дата:** 2026-03-10  
**Роль документа:** пошаговый execution-plan после архитектурного аудита  
**Основание:**  
- `docs/architecture/system_status_2026_march_10.md`  
- `docs/architecture/mvp_plan_revised_2026_march_10.md`  
- `docs/architecture/phase2_architecture.md`

---

## 1. Purpose

Этот документ фиксирует следующий пошаговый план действий по проекту Go2Asia после архитектурного аудита и актуализации MVP/Phase 2 документов.

Задача плана:

- выстроить реалистичную последовательность работ;
- не распыляться на новые UI-модули без backend-реальности;
- завершить MVP-core;
- подготовить и запустить Phase 2 как реальную экосистемную фазу.

### Architectural baseline (normative)

Этот execution-plan следует архитектурному baseline:

- `docs/architecture/Cross-Domain-Architecture-Note-v1.md`

Для текущего плана это означает:

- ownership boundaries являются обязательными guardrails для всех downstream шагов;
- canonical identity rules являются обязательной рамкой для cross-domain linking;
- sequencing Step 1–13 сохраняется, но delivery-артефакты должны быть совместимы с cross-domain baseline.

---

## 2. Strategic Principle

На текущем этапе проекту нельзя двигаться по логике:

- “добавим ещё пару экранов и потом дособерём backend”.

Правильная логика следующая:

1. довести `MVP-core` до release-grade состояния;
2. подготовить platform layer для новых доменов;
3. построить social core;
4. поднять practical domains;
5. добавить aggregation layer;
6. ввести partial marketplace;
7. только после этого переходить к full tokenomics / Phase 3.

### Ownership-first delivery discipline

Downstream delivery must preserve domain boundaries:

- Atlas owns geographic identity;
- RF owns partner/business presence;
- Pulse owns event lifecycle and attendance truth;
- Quest owns progression/proof;
- Rielt owns property domain;
- Guru aggregates/discovers but does not own source truth;
- Space owns social-layer semantics without owning factual source truth of other domains.

Интеграция в Step 8–13 не должна размывать этот split.

---

## 3. Current Strategic Position

На 2026-03-10 проект находится в стадии:

**MVP-in-progress**

### Что уже является прочным основанием

- `API Gateway`
- `Auth Service`
- `Content Service`
- `Points Service`
- `Referral Service`
- `PWA Shell`
- `Atlas`
- `Pulse`
- `Blog`
- базовый `Connect`

### Что остаётся незавершённым

- MVP hardening;
- auth / RBAC completion;
- testing / observability / release readiness;
- social-first backend;
- practical domains;
- aggregation layer;
- partner marketplace;
- second-loop tokenomics.

### Domain layer and runtime reality clarification

- `Atlas` в данном плане трактуется как current canonical geo domain layer.
- `Pulse` в данном плане трактуется как current event domain layer.
- Current runtime reality: Atlas/Pulse в значимой части обслуживаются через shared content contour (см. `docs/decisions/adr_0013_mvp_content_service_consolidation.md`), а не как полностью выделенные самостоятельные production services.
- Future extraction (`atlas-service`, `pulse-service`) остаётся возможной later option при justified complexity/scale, но не считается current fact.

---

## 4. Step-By-Step Plan

## Step 1 — Close MVP Hardening

### Goal

Превратить текущее ядро:

- `API Gateway + Auth + Content + Points + Referral + Atlas/Pulse/Blog/Connect`

из состояния “работает” в состояние “release-grade and supportable”.

### Actions

1. Зафиксировать `MVP-core` как frozen scope.
2. Закрыть auth-hardening:
   - строгая JWT verification;
   - webhook signature verification;
   - минимальный RBAC / entitlement layer.
3. Закрыть Connect hardening:
   - убрать неявные fallback flows;
   - разделить real API и demo-mode;
   - выровнять терминологию `Connect / Points`.
4. Закрыть testing minimum:
   - unit tests;
   - contract tests;
   - critical-path E2E.
5. Закрыть observability minimum:
   - request tracing;
   - health checks;
   - error logging;
   - runbooks.
6. Закрыть cleanup legacy content split:
   - определить canonical blog API;
   - сократить dual model `blog/posts` vs `articles`.

### Result

- `Milestone 5` становится реально доводимым до завершения;
- MVP-core перестаёт быть хрупкой интеграционной сборкой.

---

## Step 2 — Prepare Platform Layer For Phase 2

### Goal

Подготовить единый platform baseline для новых сервисов и не строить Phase 2 хаотично.

### Actions

1. Зарезервировать в gateway новые prefixes:
   - `/v1/space/*`
   - `/v1/quest/*`
   - `/v1/rielt/*`
   - `/v1/guru/*`
   - `/v1/rf/*`
   - `/v1/media/*`
2. Подготовить service template для новых Workers.
3. Зафиксировать DB conventions для новых доменов.
4. Зафиксировать platform data conventions для новых доменов:
   - canonical geo contract (`country_id`, `city_id`, optional `district_id`, optional `place_id`, coordinates policy);
   - graph-ready data model baseline (без выделения отдельного graph-service);
   - relation layer conventions для новых доменов (entity-to-entity linking через явные relations/FK patterns);
   - metadata layer conventions для новых доменов (`source_type`, `canonical_status`, `trust_score`, `freshness_score`, `created_by`);
   - ban on new non-canonical geo writes в новых сервисах.
5. Подготовить SDK extension strategy с учётом canonical geo и relation/metadata conventions.
6. Подтвердить architectural SSOT документы как базу для delivery.
7. Зафиксировать, что Atlas остаётся текущим Geo SSOT baseline для всех downstream доменов.

### SSOT workstream (parallel, non-disruptive)

Запустить отдельный parallel `SSOT workstream` после Step 2 без изменения базового sequencing Step 1–13.

**Missing formal packages:**

- `RF`
- `Atlas`
- `Pulse`

**Existing packages requiring reconciliation pass:**

- `Media` (architecture/README-level maturity)
- `Space` (draft)
- `Quest` (draft)
- `Rielt` (final-like; consistency reconciliation only)

**Workstream requirements:**

- все SSOT-артефакты должны быть совместимы с `Cross-Domain-Architecture-Note-v1.md`;
- service-level wording не должно конфликтовать с current runtime reality;
- future extraction не объявляется как current status без runtime-факта.

### Result

- все новые сервисы строятся по одной дисциплине;
- снижается архитектурный разброс между доменами;
- data contracts для Phase 2 заранее совместимы с Geo Canon v1 и KG MVP baseline.

---

## Step 3 — Build `media-service`

### Goal

Создать единый media / asset layer для всей Phase 2.

### Why this step is early

Без этого каждый новый домен:

- `Space`
- `Rielt`
- `RF`
- `Quest`
- `Blog`

начнёт строить собственный media flow, что быстро создаст platform debt.

### Actions

1. Создать `media-service`.
2. Реализовать сущности:
   - `media_asset`
   - `media_variant`
3. Реализовать signed upload flow.
4. Реализовать metadata persistence.
5. Реализовать publish/attach lifecycle.
6. Подключить первый consumer — `Space`.

### Result

- появляется единый media substrate для экосистемы;
- новые домены используют один media contract.

---

## Step 4 — `space-service` (completed, merged to `main`)

### Goal

Зафиксировать и стабилизировать реализованный social core платформы в утверждённых SSOT-границах.

### Actions

1. Зафиксировать статус: `feat/step4-space-service-v1` merged в `main`.
2. Поддерживать social-core scope `space-service`:
   - posts;
   - reposts;
   - groups;
   - group membership;
   - profile projections;
   - post-media relations;
   - simple feed surfaces (chronological + basic filtering).
3. Поддержать post types:
   - `post`
   - `repost`
   - `system`
4. Поддержать cross-module repost targets:
   - `blog_post`
   - `place`
   - `event`
   - `partner`
   - `listing`
   - `quest`
5. Явно не включать в `space-service`:
   - reactions;
   - points/rewards ownership;
   - organizer/planner logic;
   - AI orchestration;
   - partner/quest workflows;
   - PRO console logic.

### Result

- реализован и закреплён единый UGC/social backend;
- `space-service` остаётся узким social core, без scope drift.

---

## Step 5 — Build `reactions-service` Outside Space Boundary

### Goal

Ввести единый interaction language как отдельный interaction-домен, интегрированный со Space и другими доменами.

### Actions

1. Реализовать reaction model в отдельном reactions-domain/service:
   - `like`
2. Явно зафиксировать V1 границы (OUT OF SCOPE):
   - `repost` (остаётся в `space-service`);
   - `bookmark`
   - `rating`
   - `short_review`
   - `question`
   - `contact_request`
   - `thread_reply`
   - `completed`
   - `was_here`
   - `want_to_visit`
   - organizer / PRO / marketplace workflows;
   - points ownership;
   - feed ranking ownership;
   - AI orchestration;
   - realtime push / websocket;
   - advanced moderation / anti-fraud.
3. Ввести unified target contract (Space + ecosystem targets).
4. Ввести basic anti-spam / throttling / moderation flags.
5. Подключить rewards через `Points` как внешнюю интеграцию (без переноса ownership в `reactions-service`).

### Result

- реализуется social-first interaction layer вне `space-service`;
- реакции переиспользуются across domains без расширения Space boundary.

---

## Step 6 — Build `Feed`

### Goal

Сделать feed отдельным distribution/read surface, сохранив `space-service` источником social-core данных.

### Actions

1. Реализовать:
   - home feed;
   - group feed;
   - profile feed;
   - activity feed.
2. Использовать простую ranking strategy:
   - chronological first;
   - лёгкие priority rules.
3. Подключить сигналы от `space-service` и `reactions-service` без переноса ownership внешних сигналов в `space-service`.
4. Подключить circulation вокруг blog reposts.
5. Не внедрять ML ranking на первой фазе.

### Result

- формируется реальный контур вовлечения и распространения контента;
- feed агрегирует сигналы доменов, но не меняет boundaries `space-service`.

---

## Step 7 — Build `quest-service`

### Goal

Превратить Quest из frontend-concept в реальный gamification engine.

### Actions

1. Реализовать доменные сущности:
   - `quest`
   - `quest_step`
   - `quest_progress`
   - `quest_submission`
2. Поддержать step types:
   - visit place;
   - attend event;
   - photo proof;
   - QR/code;
   - geo checkpoint;
   - partner interaction.
3. Реализовать progress lifecycle:
   - start;
   - submit step;
   - validate;
   - complete.
4. Подключить:
   - `content-service`
   - `space-service`
   - `points-service`
5. Ограничить rewards уровнем `Points-only`.

### Result

- появляется реальный gamification core;
- Quest начинает создавать retention и социальный контент.

---

## Pre-Step-8 Normalization Package (Execution Gate)

### Goal

Зафиксировать минимальный normalization package до старта Step 8, чтобы:

- не останавливать roadmap;
- не делать massive rewrite;
- не переносить в Step 9–11 structural debt по geo и linking.

### Mandatory P0 (must be frozen before Step 8)

1. Зафиксировать Atlas-as-Geo-SSOT policy:
   - identity layer: `countries`, `cities`, `places`, `city_aliases`;
   - content layer: `content_blocks`, guides и editorial контент;
   - canonical hierarchy: `country -> city -> district(optional) -> place`;
   - canonical IDs: `country_id`, `city_id`, optional `district_id`, optional `place_id`;
   - canonical coordinates source: Atlas `lat/lng` (legacy aliases допустимы только как compatibility).
2. Зафиксировать canonical mapping layer policy для country/city в Pulse/Blog:
   - deterministic mapping dictionary;
   - outcome-классы: resolved / unresolved / manual-review.
3. Зафиксировать ban on new non-canonical geo writes:
   - новые write paths MUST писать canonical geo refs;
   - free-text/slugs MAY храниться только как secondary compatibility data.
4. Зафиксировать Pulse minimum normalization gate:
   - country-level canonicalization обязателен для новых/обновляемых записей;
   - city normalization работает фазно (high-confidence first, unresolved queue).
5. Зафиксировать Blog minimum geo materialization gate:
   - canonical geo refs materialize для `blog_posts`;
   - dual-source policy: `blog_posts` = canonical, `articles` = legacy compatibility surface.
6. Зафиксировать compatibility guardrails для Step 8 consumers:
   - downstream контракты не зависят от non-canonical geo как primary key.

### Cross-domain alignment checkpoint (must-pass before Step 8)

Перед входом в Step 8 должен быть пройден explicit checkpoint по ownership/identity consistency:

- Atlas сохраняет canonical geo ownership;
- Pulse сохраняет event/attendance ownership;
- RF сохраняет partner/voucher ownership;
- Quest сохраняет progression/proof ownership;
- Guru остаётся aggregation/read layer;
- Space остаётся social layer и не становится factual owner source-domain сущностей.

Checkpoint валидируется относительно:

- `docs/architecture/Cross-Domain-Architecture-Note-v1.md`
- `docs/decisions/adr_0013_mvp_content_service_consolidation.md`

### P1 (phase-in during Step 8 to Step 11)

1. Расширить relation-layer conventions для cross-domain linking (без full KG rollout).
2. Расширить metadata-layer conventions для quality/governance сигналов.
3. Последовательно уменьшать legacy dependence в Pulse/Blog contracts без резкого API-break.

### Result

- Step 8 стартует через управляемый execution gate, а не через “big-bang” нормализацию;
- платформа остаётся delivery-oriented и при этом не накапливает критичный geo/KG debt.

---

## Step 8 — Build `rielt-service`

### Goal

Добавить первый practical domain экосистемы, не нарушая canonical geo/data conventions.

### Actions

0. Entry gate: запуск только после frozen P0 из `Pre-Step-8 Normalization Package`.
1. Реализовать listing model:
   - listings;
   - photo relations через `media-service`;
   - ownership / agent model;
   - inquiries.
2. Реализовать public contour:
   - search;
   - filters;
   - detail pages;
   - nearby endpoint.
3. Реализовать minimal owner/PRO CRUD.
4. Реализовать inquiry через отдельный domain/service в будущей фазе (не через `reactions-service` V1).
5. Использовать Atlas geography через текущий `content-service`.
6. В public/internal contracts использовать canonical geo references как primary geo keys.
7. Допускать только временные compatibility fallbacks (slug/text) как secondary/read-only слой.

### Result

- появляется реальная прикладная ценность кроме контента;
- создаётся supply для `Guru`;
- новый practical domain не увеличивает geo normalization debt.

---

## Step 9 — Build `guru-service`

### Goal

Создать реальный aggregation/BFF layer “что вокруг меня”.

### Actions

1. Реализовать `Guru` как BFF, а не source-of-truth service.
2. Поднять unified card contract для:
   - places;
   - events;
   - listings;
   - partners;
   - quests.
3. Реализовать nearby endpoints.
4. Ввести explainable ranking:
   - distance;
   - time relevance;
   - verified signals;
   - rule-based boosts.
5. Добавить graceful degradation между доменами.
6. Не строить сразу полноценный `Geo Layer`, но подготовить совместимые контракты.

### Result

- экосистема начинает восприниматься как единый nearby-first experience;
- `Guru` связывает реальные домены в одно UX-пространство.

---

## Step 10 — Build `rf-service`

### Goal

Завершить Phase 2 как partial marketplace / partner hub.

### Entry precondition (hard)

Step 10 начинается только после frozen RF SSOT package, явно выровненного с:

- `Cross-Domain-Architecture-Note-v1` ownership boundaries;
- Atlas geo ownership baseline;
- Pulse event/attendance ownership baseline;
- current runtime reality (включая shared content contour там, где он является текущим execution-фактом).

### Actions

1. Реализовать partner model:
   - partner profile;
   - locations;
   - owner account;
   - PRO onboarding link.
2. Реализовать offers/vouchers:
   - create;
   - claim;
   - redeem;
   - status tracking.
3. Реализовать три surface-потока:
   - user;
   - PRO;
   - business.
4. Подключить:
   - `space-service`
   - `quest-service`
   - `guru-service`
   - `points-service`
5. Не включать `G2A / NFT / on-chain`.

### Result

- `RF` перестаёт быть placeholder-каталогом;
- появляется реальный multi-sided partner layer.

---

## Step 11 — Prepare `Future Geo Layer`

### Goal

Сделать Step 11 readiness/policy stage для будущей geo/relation/metadata эволюции, без преждевременного объявления отдельного geo-service как текущей runtime-реальности.

Step 11 подготавливает:

- future geo layer readiness;
- relation layer readiness;
- metadata layer readiness;
- KG MVP compatibility (без отдельного graph-service).

При этом сохраняется совместимость с current shared geo/content contour до момента, когда extraction действительно operationally justified.

### Actions

1. Оставить Atlas текущим geography source of truth.
2. Во всех новых доменах использовать нормализованные geo references:
   - `country_id`
   - `city_id`
   - optional `district_id` (где применимо)
   - coordinates
3. Не вводить временные несовместимые geo DTO.
4. Подготовить будущий platform geo contract:
   - nearby;
   - viewport;
   - normalized geo items;
   - cross-domain projections.
5. Зафиксировать минимальный relation layer contract для cross-domain linking:
   - place/event/post/topic/tag links;
   - без full graph orchestration.
6. Зафиксировать минимальный metadata layer contract:
   - source/canonical/quality/freshness поля;
   - для auditability и controlled evolution.
7. Рассматривать выделение `Geo Layer` только при достижении platform-level нагрузки и complexity threshold.
8. Явно НЕ проектировать отдельный geo-service и graph database на этом этапе.

### Result

- Atlas остаётся стабильной опорой сейчас;
- переход к `Geo Layer` позже не потребует painful rewrite;
- Step 9–13 строятся на KG-compatible contracts без scope explosion.

---

## Step 12 — End-Of-Cycle Definition Of Done

Проект можно считать правильно идущим по next-step execution cycle, если:

1. `MVP-core` зафиксирован и hardened.
2. `media-service` введён как единый asset contract.
3. `Space + Reactions + Feed` работают на реальном backend как отдельные bounded contexts с явными контрактами.
4. `Quest` создаёт реальные progress/reward flows.
5. `Rielt` даёт реальные listings и inquiries.
6. `Guru` агрегирует реальные домены.
7. `RF` работает как partial marketplace.
8. Экономика остаётся `Points-only` без premature tokenomics.

---

## Step 13 — Integration Layer: Connect Quest, Space, Points, RF, Dashboard and PRO Console

### Goal

Form a unified user experience by integrating previously built domain services into a coherent system.

This step does NOT introduce new core domains.
It connects existing ones.

---

### Scope

#### 1. Space ↔ Quest integration
- validate `space_action` steps via space-service
- allow post creation as part of quest flow
- support quest-related social content (reports, completion posts)

#### 2. Quest ↔ Points integration
- connect quest events to points-service
- handle:
  - quest.completed
  - quest.step.completed
- Quest does NOT calculate balances

#### 3. Quest ↔ RF / Voucher integration
- include RF partner locations in quests
- enable voucher eligibility via steps/completion
- prepare voucher redemption flow

#### 4. Dashboard integration
- display:
  - active quests
  - progress
  - rewards
- aggregate data from:
  - quest-service
  - points-service
  - (future voucher-service)

#### 5. PRO Console integration
- quest creation (combined quests)
- step builder (places, events, partners, social)
- submission review and moderation
- analytics for PRO

#### 6. Canonical Geo + KG-compatible integration rules
- использовать canonical geo references для cross-domain routing/filters
- поддержать minimal cross-domain linking (place/event/post/partner/listing/quest references)
- выровнять contracts так, чтобы они были KG-compatible, но без построения отдельного knowledge graph

---

### Architectural Constraints

- Do NOT merge domains
- Quest remains activity engine
- Space remains social layer
- Points remains economic source of truth
- Voucher logic remains external
- Canonical geo ownership remains Atlas-based
- Integration layer must NOT invent parallel geo DTO contracts
- Integration layer must NOT be reframed as full Knowledge Graph project

### Ownership consistency checklist (must-pass)

Каждое integration-изменение в Step 13 принимается только при одновременном соблюдении:

- Atlas geo ownership остаётся canonical;
- RF ownership остаётся owner partner/business presence и voucher lifecycle;
- Pulse ownership остаётся owner event lifecycle и attendance truth;
- Quest ownership остаётся owner progression/proof logic;
- Guru остаётся aggregation/discovery layer, не source-truth owner;
- Space остаётся social/reputation/distribution layer, без переноса factual ownership из source domains.

---

### Output

- End-to-end flow:
  Discover → Participate → Share → Reward
- Connected ecosystem behavior
- Foundation for Guru, AI layer and token economy
- Cross-domain contracts remain canonical-geo-first and KG-compatible by design

---

## 5. Practical Execution Order

Краткий operational порядок:

1. MVP hardening
2. Platform readiness
3. `media-service`
4. `space-service` (done, merged to `main`)
5. `reactions-service` (outside `space-service` boundary)
6. `feed`
7. `quest-service`
8. `Pre-Step-8 normalization package` (execution gate)
9. `rielt-service`
10. `guru-service`
11. `rf-service`
12. `future geo + relation/metadata readiness preparation`
13. `integration layer` (Step 13)

Parallel track (starts after Step 2, does not reset sequencing):

- `SSOT workstream`
  - create missing packages: `RF` / `Atlas` / `Pulse`
  - reconcile existing packages: `Media` / `Space` / `Quest` / `Rielt`
  - enforce Cross-Domain ownership/identity consistency across artifacts

After Step 13:

- Phase 3 planning

---

## 6. Recommended Focus Rules

### What not to do now

Не рекомендуется:

- наращивать новые mock/UI surfaces без backend support;
- распыляться на `G2A / NFT / on-chain`;
- строить `Geo Layer` раньше, чем реально появится platform-level demand;
- возвращать inline comments / fragmented social systems;
- смешивать editorial, social и partner data models без явных boundaries.

### What to do consistently

Нужно последовательно удерживать:

- social-first;
- points-first;
- backend-first for new domains;
- OpenAPI-first;
- single platform conventions;
- domain ownership discipline.

### Boundary note for future phases

Явное уточнение границ:

- Organizer domain — future/extracted scope (не часть текущего Space core cycle);
- PRO console domain — future/separate scope (не часть текущего Space core cycle);
- текущий цикл не должен возвращать эти области внутрь `space-service`.

---

## 7. Final Planning Statement

Следующий реальный этап Go2Asia — это не “достроить ещё пару экранов”.

Это:

> переход от работающего контентного MVP-core к реальной экосистемной платформе через social core, practical domains, aggregation и partner layer.

Короткая формула плана:

> **MVP-core harden -> platform baseline -> social core -> practical domains -> aggregation -> marketplace -> Phase 3 preparation**

Operational clarification:

в рамках текущего execution cycle план не утверждает, что `atlas-service` и `pulse-service` уже выделены как отдельные production services; текущая runtime-реальность может оставаться shared-content-first, при этом ownership baseline Atlas/Pulse остаётся обязательным, а future extraction рассматривается только при оправданной operational необходимости.

