# Revised MVP Plan — Go2Asia

**Дата ревизии:** 2026-03-10  
**Основание:** актуализация исходного плана MVP по фактическому состоянию проекта  
**Исходный план:** `docs/plans/mvp_implementation_plan.md`  
**Фактический статус проекта:** `docs/architecture/system_status_2026_march_10.md`

---

## 1. Purpose Of This Revision

Этот документ не заменяет исходный план MVP и не переписывает его полностью.

Его задача:

- зафиксировать, в какой реальной фазе находится проект;
- обновить статус Milestones относительно фактической реализации;
- убрать расхождения между изначальным планом и текущей архитектурной реальностью;
- обозначить следующий этап после MVP-core.

Ключевой контекст:

- проект находится в стадии **MVP-in-progress**;
- это уже не старт разработки, а этап завершения MVP-core и перехода к расширению экосистемы;
- часть задач исходного плана уже выполнена, часть частично закрыта, часть больше не соответствует фактической архитектуре и должна считаться устаревшей или перенесённой.

---

## 2. Current Project State

### Реально реализовано

- `API Gateway`
- `Auth Service`
- `Content Service`
- `Points Service`
- `Referral Service`
- `PWA Shell`
- модули `Atlas`, `Pulse`, `Blog`, `Connect`
- staging deployment и рабочий API-контур
- shared SDK / OpenAPI / DB layer для MVP-core

### Частично реализовано

- frontend shell architecture
- auth / RBAC / entitlement model
- Connect extended UX
- MVP integration / testing / production hardening
- PWA readiness как продуктовая оболочка

### Не реализовано

- `Space Service`
- `Reactions Service`
- `Feed Service`
- `Quest Service`
- `Rielt Service`
- `Guru Service / Geo Layer`
- `RF Service / Partner Layer`
- `Notification Service`
- `Event Bus`
- `NFT layer`
- `G2A token layer`
- `Blockchain Gateway`

### CTO interpretation

Текущее состояние проекта соответствует следующей формуле:

> Go2Asia уже имеет рабочее MVP-core ядро, но ещё не реализовал полную экосистемную архитектуру, заявленную в исходных документах.

---

## 3. Revised Milestone Status

| Milestone | Original intent | Revised status | Commentary |
|---|---|---|---|
| Milestone 1 — Infrastructure | фундамент платформы | **Completed** | Базовая платформа собрана: монорепо, gateway, DB layer, CI/CD, shell, shared packages. |
| Milestone 2 — Auth + Content | auth/content core | **Mostly completed** | Auth и Content работают, но auth-hardening, role checks и security closure ещё не доведены. |
| Milestone 3 — Points + Referral | rewards / referrals | **Completed** | Реальный Points/Referral backend существует и интегрирован в Connect UI. |
| Milestone 4 — Frontend modules | Atlas/Pulse/Blog/Connect | **Partially completed** | Модули реализованы, но shell архитектурно ещё не соответствует целевому App Shell + microfrontends, offline не реализован, часть UX остаётся partial/mock. |
| Milestone 5 — Integration + Testing | polish / release readiness | **In progress** | Интеграция есть, но observability, hardening, tests, production readiness и security closure не завершены. |

---

## 4. Milestone-by-Milestone Revision

## Milestone 1 — Foundation & Infrastructure

**Revised status:** `Completed`

### Что считать закрытым

- монорепозиторий и workspace-структура;
- shared packages (`sdk`, `types`, `logger`, `config`, `db`);
- OpenAPI-first контур;
- API Gateway;
- Neon / DB readiness;
- PWA Shell baseline;
- CI/staging pipeline.

### Что больше не требует статуса “в работе”

- создание базовой технической основы MVP;
- создание shell как стартовой оболочки;
- настройка staging pipeline.

### Примечание

Milestone 1 больше не является delivery-объектом.  
Он становится зафиксированным фундаментом проекта.

---

## Milestone 2 — Auth Service & Content Service

**Revised status:** `Mostly completed`

### Что реально закрыто

- `Auth Service` существует и развёрнут;
- `Content Service` существует и развёрнут;
- gateway routing настроен;
- публичный контент доступен;
- seed/editorial content существует и используется;
- auth + content работают как рабочий MVP-core слой.

### Что остаётся незавершённым

- полноценный RBAC;
- production-grade role enforcement;
- security hardening webhook flow;
- полное соответствие изначально заявленным admin / role criteria.

### Revised interpretation

Milestone 2 считать не “открытым”, а **почти завершённым**, где оставшиеся задачи относятся не к созданию сервисов, а к их hardening и policy-completeness.

---

## Milestone 3 — Points Service & Referral Service

**Revised status:** `Completed`

### Что реально закрыто

- `Points Service` реализован;
- `Referral Service` реализован;
- интеграция Auth -> Points;
- интеграция Auth -> Referral;
- интеграция Content -> Points;
- Connect использует этот контур как рабочий reward/referral backend.

### Что важно уточнить

Milestone 3 не означает, что полная токеномика Go2Asia готова.

Закрыт именно:

- **MVP reward layer**
- `Points + Referral`

Не закрыто:

- `G2A`
- `NFT`
- on-chain tokenomics

---

## Milestone 4 — Frontend Implementation

**Revised status:** `Partially completed`

### Что реально закрыто

- `Atlas`, `Pulse`, `Blog`, `Connect` существуют как рабочие frontend-модули;
- shell navigation работает;
- auth routing работает;
- API integration для MVP-core существует;
- staging frontend доступен.

### Что остаётся частичным

- shell пока не является реальной системой microfrontends;
- `Connect` частично зависит от fallback/mock UX;
- offline mode отсутствует;
- часть PWA expectations из изначального плана не реализована;
- часть продукта выглядит шире фактической backend-реальности.

### Revised interpretation

Milestone 4 нельзя больше считать “в полном объёме завершённым” в исходной формулировке.

Его корректный статус:

- контентные MVP-модули реализованы;
- архитектурно milestone завершён только частично.

---

## Milestone 5 — Integration, Testing & Polish

**Revised status:** `In progress`

### Что уже есть

- базовая интеграция между существующими сервисами;
- рабочие публичные flows;
- рабочие auth/reward/content flows;
- staging-проверяемость;
- часть smoke / milestone validation артефактов.

### Что ещё не закрыто

- полноценный observability stack;
- production-grade monitoring / alerting;
- полная contract-test coverage;
- полная E2E coverage;
- полное release hardening;
- security closure;
- финальная production readiness.

### Revised interpretation

Milestone 5 является текущим активным engineering milestone и должен рассматриваться как зона доведения MVP-core до release-grade качества.

---

## 5. Deprecated / Outdated / Reclassified Items

Ниже перечислены задачи исходного плана, которые больше нельзя трактовать как актуальные “открытые deliverables” в прежней формулировке.

### 5.1 Completed and no longer active

Эти задачи считать завершёнными и вывести из активного roadmap MVP:

- `M1-BE-001` настройка монорепозитория
- `M1-BE-002` создание базовых пакетов
- `M1-BE-003` OpenAPI-first процесс
- `M1-BE-004` API Gateway baseline
- `M1-BE-005` Neon / DB readiness
- `M1-FE-001` создание PWA Shell baseline
- `M1-FE-002` базовые UI-компоненты
- `M1-DEVOPS-001` staging CI/CD baseline
- все базовые backend-задачи Milestone 3

### 5.2 Reclassified as hardening, not net-new implementation

Эти задачи больше не являются задачами “создать с нуля”, а должны трактоваться как hardening / completion:

- auth role checks
- service JWT rigor
- testing pyramid
- production readiness
- Connect stabilization

### 5.3 Deprecated because architecture changed

Следующие формулировки исходного плана должны считаться устаревшими или заменёнными:

- требование полноценного offline как обязательной части MVP  
  Статус: deprecated for MVP by ADR.

- ожидание, что Milestone 4 закроет shell как фактическую microfrontend architecture  
  Статус: deferred / not achieved in MVP-core.

- трактовка полного MVP как “все ключевые сервисы экосистемы готовы”  
  Статус: не соответствует фактическому состоянию проекта; готово только MVP-core ядро.

### 5.4 Reclassified to post-MVP / Phase 2

Следующие направления не должны больше оставаться внутри активного MVP delivery scope:

- `Space backend`
- `Feed`
- `Reactions`
- `Quest backend`
- `Rielt backend`
- `Guru backend`
- `RF backend`
- `Notification / Event Bus`
- `NFT / G2A / on-chain`

Они переходят в следующий системный этап развития проекта.

---

## 6. Revised MVP Scope Boundary

После актуализации границ MVP проект следует трактовать так:

### MVP-core includes

- `API Gateway`
- `Auth`
- `Content`
- `Points`
- `Referral`
- `PWA Shell`
- `Atlas`
- `Pulse`
- `Blog`
- `Connect`

### MVP-core does not include

- social ecosystem backend
- partner ecosystem backend
- practical housing domain backend
- geo aggregation backend
- full tokenomics
- on-chain economy

Это критично для корректной product и engineering коммуникации.

---

## 7. Roadmap After Milestone 5

## Phase 2 — Ecosystem Expansion

Следующий этап после завершения MVP-core и hardening:

### Цель

Переход от контентного MVP-ядра к реальной экосистемной архитектуре Go2Asia.

### Core services to build

- `Space Service`
- `Reactions Service`
- `Feed Service`
- `Quest Service`
- `Rielt Service`
- `Guru Service`
- `RF Service`

### Phase 2 principles

- строить backend-first доменные контуры, а не только фронтовые поверхности;
- придерживаться social-first модели;
- использовать `Points` как реальный reward layer до появления full tokenomics;
- не симулировать `G2A/NFT` до готовности Phase 3;
- использовать существующие `gateway`, `auth`, `content`, `points`, `referral` как platform base.

### Suggested sequencing

1. `Space Service`
2. `Reactions Service`
3. `Feed Service`
4. `Quest Service`
5. `Rielt Service`
6. `Guru Service`
7. `RF Service`

### Notes

- `Guru` должен строиться после появления как минимум части реальных доменов, которые он агрегирует.
- `RF` должен строиться как capstone поверх social + rewards + practical domains, а не как isolated catalog.

---

## 8. Architectural Priorities (post-MVP)

После завершения Milestone 5 инженерные приоритеты должны быть зафиксированы в следующем порядке:

1. **MVP hardening**
2. **Social Core (`Space + Reactions`)**
3. **Quest**
4. **Rielt**
5. **Guru**
6. **RF**

### Расшифровка приоритетов

#### 1. MVP hardening

Включает:

- auth hardening;
- RBAC / entitlements;
- contract tests;
- E2E;
- observability;
- production readiness;
- cleanup legacy/fallback paths.

#### 2. Social Core (`Space + Reactions`)

Это главный архитектурный долг текущего состояния и ключ к заявленной модели Go2Asia как social-first platform.

#### 3. Quest

Quest должен строиться поверх:

- реального social core;
- реального reward layer (`Points`);
- реального content validation слоя.

#### 4. Rielt

Первый practical domain, создающий реальную utilitarian value за пределами контентного слоя.

#### 5. Guru

Aggregator/BFF должен собирать уже существующие реальные домены, а не агрегировать моки.

#### 6. RF

RF имеет смысл только как multi-sided hub на базе:

- social core;
- reward logic;
- practical domains;
- partner workflows.

---

## 9. Revised Delivery Interpretation

### Что изменилось относительно исходного плана

Исходный MVP-план исходил из того, что проект находится до реализации.

Фактическая ситуация другая:

- часть системы уже построена;
- MVP-core уже работает;
- главная задача сместилась с “построить основу” на “довести основу до release-grade и перейти к ecosystem phase”.

### Поэтому теперь план должен читаться так

- Milestones 1 и 3 — исторически закрытые;
- Milestone 2 — почти закрытый;
- Milestone 4 — частично закрытый;
- Milestone 5 — текущий активный milestone;
- следующий большой этап — `Phase 2 — Ecosystem Expansion`.

---

## 10. Final Revision Summary

На 2026-03-10 корректная интерпретация MVP плана следующая:

- MVP уже не находится в состоянии “планируем начать”.
- MVP уже не является чисто проектным документом.
- MVP-план теперь должен служить документом перехода:
  - от построенного MVP-core
  - к завершению hardening
  - и к запуску реальной экосистемной Phase 2

Короткая формула статуса:

> **MVP-core built, MVP release hardening in progress, ecosystem expansion not started yet.**

