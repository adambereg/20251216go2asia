# Milestone 3 — Target Architecture (Draft)

Дата: 2025-12-18  
Статус: **Draft** (на Architecture Review)  
Scope: `points-service` + `referral-service` (реальная бизнес-логика), интеграции с `auth-service`, `content-service`, routing через `api-gateway`.

## 0) Принципы (обязательные)

- **Gateway is not a domain**: `api-gateway` не содержит доменной логики Points/Referral.
- **OpenAPI-first** для downstream: контракт → review → реализация.
- **Reproducible backend**: vars/secrets/bindings policy фиксируется и обновляется в `docs/ops/*source_of_truth*.md`.
- **Idempotency-first**: internal начисления/линковки должны быть безопасны при ретраях.

## 1) Компоненты и ответственность

### 1.1 Edge
- **API Gateway** (`apps/api-gateway`)
  - Принимает внешние запросы `GET /v1/points/*`, `GET/POST /v1/referral/*`.
  - Применяет edge-политику: аутентификация пользователя (по принятому механизму), проброс `X-User-ID`.
  - Проксирует запросы в downstream.

### 1.2 Downstream services
- **Points Service** (`apps/points-service`)
  - SSOT для ledger транзакций и агрегированного баланса.
  - Применяет лимиты и идемпотентность.
  - Предоставляет user read API и internal add API.

- **Referral Service** (`apps/referral-service`)
  - SSOT для `referral_code` и referral-отношений.
  - Предоставляет user read API и internal endpoints для регистрации/линковки.

### 1.3 Upstream domain services (как интеграторы)
- **Auth Service** (`apps/auth-service`)
  - Владеет жизненным циклом пользователя.
  - На регистрации инициирует:
    - генерацию referral_code в Referral Service,
    - (опционально) линковку по введённому referral_code,
    - начисления в Points Service.

- **Content Service** (`apps/content-service`)
  - На доменных событиях (например, event registration) инициирует начисление в Points Service.

## 2) Хранилище и схемы данных (SSOT)

### 2.1 База данных
Предполагается единый Postgres (как и ранее в архитектуре MVP) с разделением по схемам.

Норма (M3): **каждый сервис владеет своей схемой БД и своими миграциями, даже при общем Postgres.**

### 2.2 SSOT области
- **Points Service (schema `points`)**
  - `points_transactions` — **SSOT ledger**.
  - `user_balances` — агрегат для быстрого чтения (derivative, но хранится в рамках Points Service).

- **Referral Service (schema `referral`)**
  - `referral_codes` — **SSOT** соответствия user → code.
  - `referral_relations` — **SSOT** referrer → referee (L1).

- **Auth Service (schema `auth`)**
  - SSOT пользовательской идентичности/ролей.

## 3) Trust boundaries (gateway vs downstream)

### 3.1 Доверенная граница Gateway
- Gateway доверяет **своей** проверке user auth и выставлению `X-User-ID` для downstream.
- Downstream доверяет `X-User-ID` **только** если запрос аутентифицирован как **gateway-origin**.

#### Выбранная модель доверия user-context (M3)
**В M3 downstream НЕ валидирует user JWT самостоятельно.**  
Вместо этого downstream проверяет, что запрос пришёл от gateway, через **service auth (service JWT)**:
- `api-gateway` добавляет к каждому запросу в downstream (включая user-facing `/v1/*`) заголовок вида `X-Gateway-Auth: <service_jwt>`.
- `points-service` / `referral-service` валидируют `X-Gateway-Auth` по общему секрету (`SERVICE_JWT_SECRET`) и только после этого принимают `X-User-ID` как корректный user-context.

Примечание: это соответствует принципу “не размывать доменную логику в gateway”, но оставляет в gateway функцию **политики доступа** и делегирования контекста.

### 3.2 User-facing vs Internal API
- **User-facing** endpoints (`/v1/...`) доступны только через gateway и требуют user auth.
- **Internal** endpoints (`/internal/...`) недоступны пользователю и требуют **service JWT**.

### 3.3 Где живут правила
- Лимиты, eligibility, VIP-коэффициенты, идемпотентность:
  - **только** в Points Service / Referral Service.
- Gateway может управлять:
  - таймаутами,
  - retry policy (осторожно, только совместимо с идемпотентностью),
  - rate limiting на edge (если есть),
  - наблюдаемостью.

## 4) Sequence flows (M3)

Нотация:
- `U` — пользователь
- `GW` — api-gateway
- `AUTH` — auth-service
- `REF` — referral-service
- `PTS` — points-service
- `DB` — Postgres

### Flow A — User читает баланс
1. `U → GW: GET /v1/points/balance (Authorization: Bearer ...)`
2. `GW` валидирует user auth (по принятому механизму) → выставляет `X-User-ID`.
3. `GW → PTS: GET /v1/points/balance (X-User-ID)`
4. `PTS → DB(points): read user_balances`
5. `PTS → GW: 200 {balance,...}`
6. `GW → U: 200`

Свойства:
- read-only, без побочных эффектов.
- Ошибки PTS транслируются как 5xx с requestId.

### Flow B — User получает свой referral code
1. `U → GW: GET /v1/referral/code`
2. `GW` выставляет `X-User-ID`.
3. `GW → REF: GET /v1/referral/code (X-User-ID)`
4. `REF → DB(referral): read referral_codes`
5. `REF → GW: 200 {code}`

Свойства:
- code должен существовать после регистрации пользователя (Flow C).

Failure mode (Referral Service, M3):
- если при регистрации (Flow C) `referral-service` недоступен, регистрация пользователя **не блокируется**, а referral_code создаётся **лениво** при первом успешном обращении к `GET /v1/referral/code` (idempotent upsert).
- фоновые ретраи/джобы для “догонки” referral_code — **non-goal M3**.

### Flow C — Регистрация пользователя с (опциональным) referral_code
Цель: при создании пользователя обеспечить referral SSOT и (при наличии кода) связь + начисления.

1. `U → AUTH: регистрация (внешний поток; детали вне scope)`
2. `AUTH` создаёт/обновляет пользователя в `DB(auth)`.
3. `AUTH → REF: POST /internal/referral/generate-code (service JWT, userId)`
4. `REF → DB(referral): upsert referral_codes(userId)`
5. Если пользователь ввёл `referral_code`:
   1) `AUTH → REF: POST /internal/referral/link (service JWT, refereeUserId, referral_code)`
   2) `REF → DB(referral): create referral_relations (referrerUserId, refereeUserId)`
   3) `REF` возвращает `referrerUserId` (или equivalent) в ответ.
   4) `AUTH → PTS: POST /internal/points/add (service JWT, external_id=..., userId=referee, action=referral_bonus_referee, amount=...)`
   5) `AUTH → PTS: POST /internal/points/add (service JWT, external_id=..., userId=referrer, action=referral_bonus_referrer, amount=..., metadata: {refereeUserId})`
6. (Опционально) начисление за регистрацию:
   - `AUTH → PTS: POST /internal/points/add (service JWT, external_id=..., userId, action=registration, amount=...)`

Свойства:
- Идемпотентность:
  - `generate-code` должен быть идемпотентным (upsert по userId).
  - `link` должен быть идемпотентным/конфликтным по refereeUserId (только один referrer).
  - начисления в PTS — идемпотентны по `external_id`.
- Таймауты:
  - межсервисные вызовы целятся в ~2s.
- Failure mode (M3):
  - если `referral-service` недоступен:
    - регистрация пользователя **не откатывается**;
    - referral_code создаётся **лениво** (см. Flow B);
    - привязка по referral_code и бонусы могут быть недоступны до восстановления REF (без фоновых ретраев в M3).
  - если `points-service` недоступен:
    - регистрация пользователя **не откатывается**;
    - начисления Points возвращают ошибку вызывающему сервису (fail-closed для бонусов), без фоновых ретраев в M3.

### Flow D — Начисление за регистрацию на событие (Content → Points)
1. `U → GW → CONTENT: POST /v1/content/events/{id}/register`
2. `CONTENT` создаёт регистрацию в `DB(content)`.
3. `CONTENT → PTS: POST /internal/points/add (service JWT, external_id=eventReg:<registrationId>, userId, action=event_registration, amount=...)`

Свойства:
- `external_id` = детерминированный ключ на основе registrationId.
- При сбое PTS поведение фиксируется как “не блокирует регистрацию” или “блокирует” — решение должно быть единым и отражено в требованиях.

## 5) Политики безопасности

- **Service JWT** используется только для `/internal/*`.
- Secrets (например `SERVICE_JWT_SECRET`) не логируются.
- Health endpoints (`/health`/`/version`) не содержат секретов/конфигурации.

## 6) Политики надёжности

- Downstream должны корректно обрабатывать:
  - повторы запросов (идемпотентность),
  - конкурирующие запросы (uniques/transactions),
  - таймауты и ретраи.

## 7) Документационные обязательства (после утверждения архитектуры)

После утверждения этого документа и перед началом реализации потребуется:
- добавить/обновить OpenAPI спецификации для `points-service` и `referral-service`;
- синхронизировать `docs/ops/milestone2_backend_source_of_truth.md` и `docs/ops/staging_services_overview.md` по vars/secrets/bindings и URLs для M3.

