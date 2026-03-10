# System Status — Go2Asia

**Дата:** 2026-03-10  
**Роль документа:** архитектурная фиксация фактического состояния проекта  
**Основа оценки:** утверждённые документы в `docs/`, кодовая база, staging/API probes

---

## 1. Purpose

Этот документ фиксирует фактическое состояние проекта Go2Asia на 10 марта 2026 года относительно:

- плана реализации MVP;
- целевой архитектуры экосистемы;
- дорожной карты Phase 2;
- принятых архитектурных решений.

Документ нужен как точка синхронизации между продуктом, архитектурой и engineering delivery.

---

## 2. Executive Summary

Go2Asia находится в стадии **MVP-in-progress**.

Проект уже вышел за пределы концепта и прототипа:

- существует рабочий staging frontend;
- существует рабочий API Gateway;
- существуют реальные backend-сервисы `auth`, `content`, `points`, `referral`;
- публичные контентные модули `Atlas`, `Pulse`, `Blog` работают на реальных API и данных;
- модуль `Connect` частично работает на реальных `Points + Referral`.

При этом проект ещё **не является MVP-ready** в строгом архитектурном и продуктово-системном смысле, потому что:

- не завершён production-hardening существующего ядра;
- отсутствует полноценный social-first backend (`Space`, `Feed`, `Reactions`);
- отсутствует второй контур экономики (`G2A`, `NFT`, on-chain`);
- отсутствуют реальные backend-сервисы для `Guru`, `Quest`, `Rielt`, `RF`;
- PWA Shell реализован как единое Next.js приложение, а не как фактическая система independently delivered microfrontends;
- offline/PWA-capabilities реализованы только частично.

Итоговая оценка:

- **сильное MVP-core ядро**: content + auth + points/referral;
- **незавершённая экосистема**: social, partner, geo, tokenomics пока в основном на уровне фронтовых заготовок, mock-слоя и архитектурных документов.

---

## 3. Source Of Truth

При аудите использовались следующие документы как источник истины:

1. `docs/plans/mvp_implementation_plan.md`
2. `docs/plans/phase2_delivery_plan.md`
3. `docs/knowledge/backend_microservice.md`
4. `docs/knowledge/PWA_strategy.md`
5. `docs/knowledge/interface_concept.md`
6. `docs/knowledge/user_roles.md`
7. `docs/knowledge/tokenomics.md`

Дополнительно использовались:

- `docs/ops/service_inventory.md`
- `docs/ops/staging_services_overview.md`
- `docs/reviews/milestone5/m5c_min_production_readiness.md`
- `docs/decisions/adr_0019_offline_support_deferred_for_mvp.md`

---

## 4. Audit Method

Аудит выполнен по трём направлениям:

1. Сверка целевой архитектуры и MVP-милстоунов по документации.
2. Проверка фактической реализации по репозиторию.
3. Проверка staging и staging API через HTTP probes и runtime-анализ.

Важно:

- часть браузерной интерактивной проверки Netlify staging из внешнего browser runtime была ограничена;
- поэтому выводы по frontend/state подтверждались комбинацией:
  - HTTP route checks;
  - прямых вызовов staging API;
  - анализа runtime local shell;
  - анализа кода и маршрутов Next.js.

Это не меняет общий вывод, но должно учитываться как методологическое ограничение.

---

## 5. Current Frontend Status

### 5.1 Реально доступные и подтверждённые frontend surfaces

Подтверждено, что staging frontend отвечает корректно:

- `/` -> `200`
- `/atlas` -> `200`
- `/pulse` -> `200`
- `/blog` -> `200`
- `/connect` -> `307` на `/sign-in?redirect_url=%2Fconnect`

Это соответствует наличию публичного shell и auth-gated приватных разделов.

### 5.2 Реально реализованные пользовательские модули

#### Implemented / working on real API

- `Atlas`
- `Pulse`
- `Blog`
- `Auth`
- `Connect` (частично)

#### Partially implemented

- `Home / Landing`
- `PWA Shell`
- `Connect` расширенные экраны

#### Mostly UI / mock / placeholder

- `Space`
- `Quest`
- `Guru`
- `Rielt`
- `Russian Friendly`
- `Partner / Business surfaces`
- `Profile / Settings`

### 5.3 Что реально работает

#### Atlas

Работает на реальном API:

- страны;
- города;
- места;
- guides/themes/hubs частично;
- detail pages;
- часть вложенных разделов.

Используются реальные SDK hooks:

- `useGetCountries()`
- `useGetCities()`
- `useGetPlaces()`
- `useGetCityById()`
- `useGetCountryById()`
- `useGetGuideBySlug()` и др.

#### Pulse

Работает на реальном API:

- список событий;
- фильтрация;
- detail pages;
- event registration flow в архитектуре присутствует.

Фактически используется:

- `useGetEvents()`
- `getEventById()`
- `useRegisterEvent()`

#### Blog

Работает на реальном API:

- лента публикаций;
- detail pages;
- category feeds;
- search/filter UI.

Фактически используется новый реальный контур:

- `/v1/content/blog/posts`

При этом в системе сохраняется legacy-слой:

- `/v1/content/articles`

Это создаёт архитектурный долг и дублирование контентной модели.

#### Connect

Работает частично на реальном API:

- баланс Points;
- история транзакций;
- referral code;
- referral stats/tree;
- auth-gated доступ.

Но часть UX остаётся demo/mocked:

- NFT;
- G2A;
- wallet bridge;
- analytics;
- missions;
- levels;
- часть действий top up / withdraw.

#### Auth

Реализованы:

- `Clerk` sign-in/sign-up;
- middleware protection;
- post-auth `users/ensure`;
- post-auth `referral/claim`;
- публичные и защищённые route groups.

### 5.4 Какие данные используются

#### Real API / real staged content

Подтверждено через staging API:

- `/v1/content/countries`
- `/v1/content/places`
- `/v1/content/events`
- `/v1/content/blog/posts`
- `/v1/points/*`
- `/v1/referral/*`

Данные выглядят как реальный seed/editorial content:

- реальные страны и города;
- реальные place cards;
- насыщенные event descriptions;
- blog longreads с media URLs в `media.go2asia.space`.

#### Mock / demo / static

Используются в:

- homepage marketing sections;
- `Space`;
- `Quest`;
- `Guru`;
- `Rielt`;
- `RF`;
- части `Connect`;
- partner/merchant/pro dashboards.

#### Mixed state

Есть переходный слой:

- реальный blog API через `/v1/content/blog/posts`;
- параллельно существует legacy articles API `/v1/content/articles`, который ещё отдаёт demo-like контент.

Это значит, что frontend уже начал миграцию в новую модель, но система ещё не полностью очищена от старого контента и fallback-подхода.

### 5.5 Что уже есть от PWA Shell

Реально присутствует:

- единый App Shell;
- `TopAppBar`;
- `BottomNav`;
- `SideDrawer`;
- route groups `(public)`, `(authenticated)`, `(auth)`;
- `manifest.webmanifest`;
- общий layout и навигация;
- Clerk SSO integration;
- mobile-first shell model.

### 5.6 Что отсутствует в PWA / Shell архитектуре

Отсутствует:

- зарегистрированный `Service Worker`;
- offline cache architecture;
- IndexedDB offline layer;
- install prompt UX;
- полноценный offline mode;
- real microfrontend delivery;
- module federation / import maps / remote module loading;
- deeplink architecture в системном виде;
- event bus как frontend backbone.

По ADR это частично осознанно:

- полноценный offline был отложен для MVP.

---

## 6. MVP Progress Table

| MVP Milestone | Статус | Комментарий |
|---|---|---|
| Milestone 1 — Infrastructure | **Реализовано** | Монорепо, базовые пакеты, API Gateway, CI/CD, DB layer, PWA shell и shared UI присутствуют. |
| Milestone 2 — Auth + Content | **Частично реализовано** | Auth и Content сервисы работают, но role checks, auth-hardening и admin security ещё не доведены. |
| Milestone 3 — Points + Referral | **Реализовано** | Points и Referral работают и интегрированы в реальный UI Connect. |
| Milestone 4 — Frontend modules | **Частично реализовано** | `Atlas`, `Pulse`, `Blog`, `Connect` существуют, но shell остаётся монолитом, offline нет, часть UX ещё mock-driven. |
| Milestone 5 — Integration + Testing | **Частично реализовано** | Интеграция есть, но observability, security closure, полноценные tests и production readiness не закрыты до конца. |

### CTO interpretation

Если считать MVP как узкое ядро:

- `Atlas + Pulse + Blog + Connect + Auth + Points + Referral`

то проект близок к завершению.

Если считать MVP строго по утверждённым критериям готовности:

- offline/PWA;
- hardening;
- testing;
- observability;
- UX completion;

то MVP ещё **не закрыт**.

---

## 7. Architecture Readiness Map

| Layer | Status | Current state |
|---|---|---|
| Frontend | **Partially implemented** | Shell и ключевые контентные модули работают, но экосистема фронтендов сильно опережает backend-реальность. |
| Backend | **Partially implemented** | Реально есть только gateway + auth/content/points/referral; остальные домены отсутствуют как backend runtime. |
| Data layer | **Implemented** | DB schema, queries, migrations, seed/import/export pipelines зрелые для MVP-core. |
| Microservices | **Partially implemented** | Микросервисный каркас есть, но покрывает только MVP-core и не соответствует полной целевой карте сервисов. |
| Auth | **Partially implemented** | Clerk и protected routes есть, но RBAC/entitlements/security hardening неполные. |
| Tokenomics | **Partially implemented** | Реально есть только `Points + Referral`; `G2A`, `NFT`, on-chain и tokenomics engine отсутствуют. |
| Social layer | **Not started** | Нет реального `Space Service`, `Feed Service`, `Reactions Service`. |
| Guru geo layer | **Not started** | Нет реального `Guru Service` и нет платформенного `Geo Layer`. |
| Partner layer | **Not started** | Нет реальных `RF`, `Rielt`, partner backends; есть только UI и mock-поверхности. |

---

## 8. Real Status Of The Ecosystem

### 8.1 Stage assessment

Текущая стадия проекта:

**MVP-in-progress**

### 8.2 Почему не Concept

Потому что уже существуют:

- реальные backend-сервисы;
- реальная база данных;
- реальный staging;
- реальные API contracts;
- реальные seeded/editorial datasets;
- реальные auth и reward flows.

### 8.3 Почему не Prototype

Потому что система уже содержит production-like platform core:

- API gateway;
- auth;
- content;
- points;
- referral;
- shell;
- shared SDK/types/data model.

### 8.4 Почему ещё не MVP-ready

Потому что:

- не закрыт Milestone 5 на инженерном уровне;
- отсутствует social-first backend;
- отсутствует partner/practical/geo backend;
- отсутствует full PWA behavior;
- отсутствует второй контур экономики;
- сохраняются legacy/fallback/mixed-state слои;
- shell и delivery model не соответствуют в полном объёме целевой архитектуре App Shell + microfrontends.

---

## 9. Key Architectural Gaps

### 9.1 App Shell vs real microfrontends

Принятое решение:

- `PWA App Shell + microfrontends`

Фактическое состояние:

- один большой `Next.js` app;
- нет реального remote module loading;
- нет отдельно поставляемых frontend remotes.

Вывод:

- shell есть;
- microfrontend architecture фактически ещё не введена.

### 9.2 Social-first architecture

Принятое решение:

- `Space + Reactions` как ядро social-first модели;
- отсутствие inline comments;
- обсуждения через social contour.

Фактическое состояние:

- `Space` существует только как UI/mock contour;
- `Reactions Service` отсутствует;
- social system не является реальным backend-driven слоем платформы.

Вывод:

- ключевое архитектурное решение пока не реализовано.

### 9.3 Two-contour economy

Принятое решение:

- `Points + G2A`

Фактическое состояние:

- реально работает только `Points + Referral`;
- `token-service` существует только как skeleton;
- `NFT Service`, `Blockchain Gateway`, `G2A flow` отсутствуют.

Вывод:

- экономика пока одноконтурная.

### 9.4 Blog + Space as one content system

Принятое решение:

- `Blog` и `Space` должны быть единой контентной системой.

Фактическое состояние:

- `Blog` уже работает на реальном editorial API;
- `Space` backend отсутствует;
- единого content loop между editorial и social слоями нет.

Вывод:

- решение пока не собрано в систему.

### 9.5 Partner architecture

Принятое решение:

- `RF / Partner / PRO / Business Console`

Фактическое состояние:

- UI surfaces существуют;
- реальные partner workflows и partner services отсутствуют.

Вывод:

- partner economy не запущена.

---

## 10. Critical Risks

### 10.1 Risk: false sense of readiness

В проекте уже много маршрутов и UI-поверхностей.

Риск:

- визуально система выглядит существенно более зрелой, чем является на backend/domain уровне.

Последствие:

- команда может начать планировать product rollout как для готовой экосистемы, хотя фактически готово только MVP-core ядро.

### 10.2 Risk: frontend scope outruns backend reality

Слишком много модулей имеют:

- routes;
- screens;
- mock data;
- placeholder states;

но не имеют доменного backend и реальных контрактов.

Последствие:

- рост product debt;
- расхождение между обещанной платформой и реально поддерживаемой системой.

### 10.3 Risk: auth/security hardening gap

По коду и документам видно, что:

- webhook verification был отложен;
- RBAC неполный;
- некоторые admin checks ещё MVP-grade.

Последствие:

- система ещё не на production-grade security уровне.

### 10.4 Risk: legacy content split

Сейчас сосуществуют:

- новая blog model;
- legacy `articles` layer.

Последствие:

- дублирование логики;
- неочевидный source of truth по контенту;
- риск рассинхронизации frontend и backend.

---

## 11. Recommended Next Development Steps

### 11.1 Next 3 engineering steps

#### Step 1 — Close MVP-core hardening

Довести до production-grade существующее ядро:

- strict JWT verification;
- Clerk webhook signature verification;
- нормальный RBAC / entitlement model;
- contract tests;
- e2e smoke flows;
- observability;
- устранение silent fallback-логики на ключевых маршрутах.

#### Step 2 — Build Social Core

Следующий обязательный доменный шаг:

- `space-service`
- `feed`
- `reactions`

Причина:

- это ключевой отсутствующий слой, без которого не выполняется social-first архитектура.

#### Step 3 — Move to real Phase 2 verticals in sequence

Рекомендуемая последовательность:

1. `Space`
2. `Quest`
3. `Rielt`
4. `Guru`
5. `RF partial`

Не рекомендуется:

- продолжать наращивать mock/UI surfaces параллельно без появления реального backend.

### 11.2 Next modules to build

Приоритет модулей:

- `Space` backend first
- `Quest` as Points-only gamification core
- `Rielt` as practical domain
- `Guru` as aggregation layer
- `RF` as partial capstone

### 11.3 Critical missing infrastructure

Нужно построить или довести:

- auth hardening;
- RBAC / role / entitlement model;
- unified media/storage flow;
- observability stack;
- automated tests pyramid;
- gateway readiness for new phase-2 services;
- event-driven integration baseline;
- cleanup of legacy blog/content split.

---

## 12. Final CTO Assessment

На 10 марта 2026 года Go2Asia можно описать так:

> **Это уже не прототип и не просто набор макетов. Это функционирующее MVP-core ядро платформы.**

Одновременно:

> **Это ещё не реализованная экосистема Go2Asia в полном архитектурном смысле, закреплённом в документах.**

Текущая стратегическая задача не в расширении числа экранов, а в переходе:

- от контентного ядра
- к связной platform ecosystem

через:

- social core;
- real product verticals;
- hardening;
- platform infrastructure;
- постепенную сборку второй фазы без симуляции готовности.

---

## 13. Status Snapshot

### What is solid now

- API Gateway
- Auth core
- Content core
- Points
- Referral
- Atlas
- Pulse
- Blog
- base Connect
- PWA shell foundation

### What is partial

- Connect extended UX
- auth hardening
- testing
- production readiness
- PWA readiness

### What is not started architecturally

- Space backend
- Reactions
- Guru service
- Geo layer
- Quest backend
- Rielt backend
- RF backend
- tokenomics engine
- NFT / blockchain gateway

