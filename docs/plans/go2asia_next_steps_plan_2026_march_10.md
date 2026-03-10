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
4. Подготовить SDK extension strategy.
5. Подтвердить architectural SSOT документы как базу для delivery.

### Result

- все новые сервисы строятся по одной дисциплине;
- снижается архитектурный разброс между доменами.

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

## Step 4 — Build `space-service`

### Goal

Создать реальный social core платформы.

### Actions

1. Поднять `space-service`.
2. Реализовать:
   - posts;
   - reposts;
   - groups;
   - базовые profile projections.
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
5. Подключить базовые Points rewards.

### Result

- появляется единый UGC/social backend;
- остальные модули получают реальный discussion layer.

---

## Step 5 — Add `Reactions` Inside Space Boundary

### Goal

Ввести единый interaction language для всей платформы.

### Actions

1. Реализовать reaction model:
   - `like`
   - `repost`
   - `rating`
   - `short_review`
   - `bookmark`
   - `question`
   - `contact_request`
   - `thread_reply`
   - `completed`
2. Ввести unified target contract.
3. Реализовать thread/inquiry model.
4. Ввести basic anti-spam / throttling / moderation flags.
5. Подключить rewards через `Points`.

### Result

- реализуется social-first архитектурное решение;
- больше не требуется проектировать отдельные comment systems.

---

## Step 6 — Build `Feed`

### Goal

Сделать `Space` реальной distribution system, а не просто CRUD-хранилищем постов.

### Actions

1. Реализовать:
   - home feed;
   - group feed;
   - profile feed;
   - activity feed.
2. Использовать простую ranking strategy:
   - chronological first;
   - лёгкие priority rules.
3. Подключить circulation вокруг blog reposts.
4. Не внедрять ML ranking на первой фазе.

### Result

- `Space` становится живым social contour;
- формируется реальный контур вовлечения и распространения контента.

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

## Step 8 — Build `rielt-service`

### Goal

Добавить первый practical domain экосистемы.

### Actions

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
4. Реализовать inquiry через `contact_request + thread model`.
5. Использовать Atlas geography через текущий `content-service`.

### Result

- появляется реальная прикладная ценность кроме контента;
- создаётся supply для `Guru`.

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

Не строить Geo Layer преждевременно, но подготовить систему к его появлению.

### Actions

1. Оставить Atlas текущим geography source of truth.
2. Во всех новых доменах использовать нормализованные geo references:
   - `country_id`
   - `city_id`
   - coordinates
3. Не вводить временные несовместимые geo DTO.
4. Подготовить будущий platform geo contract:
   - nearby;
   - viewport;
   - normalized geo items;
   - cross-domain projections.
5. Рассматривать выделение `Geo Layer` только при достижении platform-level нагрузки и complexity threshold.

### Result

- Atlas остаётся стабильной опорой сейчас;
- переход к `Geo Layer` позже не потребует painful rewrite.

---

## Step 12 — End-Of-Cycle Definition Of Done

Проект можно считать правильно идущим по next-step execution cycle, если:

1. `MVP-core` зафиксирован и hardened.
2. `media-service` введён как единый asset contract.
3. `Space + Reactions + Feed` работают на реальном backend.
4. `Quest` создаёт реальные progress/reward flows.
5. `Rielt` даёт реальные listings и inquiries.
6. `Guru` агрегирует реальные домены.
7. `RF` работает как partial marketplace.
8. Экономика остаётся `Points-only` без premature tokenomics.

---

## 5. Practical Execution Order

Краткий operational порядок:

1. MVP hardening
2. Platform readiness
3. `media-service`
4. `space-service`
5. `reactions`
6. `feed`
7. `quest-service`
8. `rielt-service`
9. `guru-service`
10. `rf-service`
11. `future geo layer preparation`
12. Phase 3 planning

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

---

## 7. Final Planning Statement

Следующий реальный этап Go2Asia — это не “достроить ещё пару экранов”.

Это:

> переход от работающего контентного MVP-core к реальной экосистемной платформе через social core, practical domains, aggregation и partner layer.

Короткая формула плана:

> **MVP-core harden -> platform baseline -> social core -> practical domains -> aggregation -> marketplace -> Phase 3 preparation**

