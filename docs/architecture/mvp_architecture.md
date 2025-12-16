# Архитектура MVP Go2Asia

**Версия:** 1.1  
**Дата:** 2025-01-16  
**Автор:** Architect  
**Статус:** Revised → на повторное ревью  
**Основа:** ТЗ MVP v1.1 (APPROVED)

---

## Changelog v1.1

**Изменения после ревью Architecture Reviewer:**

### BLOCKERS (исправлено):
1. ✅ **Service-to-Service Security:** Добавлен раздел про Service JWT (отдельно от User JWT Clerk). Описаны issuer, claims, валидация, хранение секретов в Cloudflare Secrets, ротация.
2. ✅ **Data Ownership referral_code:** SSOT = Referral Service. Убрано дублирование из `auth.users.referral_code` (оставлен только в Referral Service).
3. ✅ **user_id без FK:** Описана стратегия hard validation через Gateway/Clerk JWT. Объявлено, что удаление пользователей не поддерживается в MVP.
4. ✅ **Cascading Failures:** Добавлены таймауты (2-3s), правила retry (0/1), graceful degradation сценарии. Обновлён ADR 0010.

### NON-BLOCKERS (исправлено):
5. ✅ **Points Limits:** Приведены к ТЗ (per-action limits + общий velocity limit).
6. ✅ **VIP Coefficients:** Описано, где хранятся и как применяются повышенные коэффициенты для VIP-Spacer.
7. ✅ **Gateway Authz:** Определено, где происходит авторизация (Gateway проверяет роли, передаёт user_id в сервисы).
8. ✅ **Caching Strategy:** Описано взаимодействие Edge cache и Service Worker cache, Cache-Control заголовки.
9. ✅ **RequestId Propagation:** Описан механизм передачи X-Request-ID между сервисами.
10. ✅ **Seed Data Process:** Описан процесс загрузки seed данных (когда, чем, идемпотентность).

---

## 1. High-level архитектурная схема MVP

### 1.1 Общая схема системы

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PWA Shell (Next.js 15)                             │  │
│  │  - apps/go2asia-pwa-shell/                           │  │
│  │  - Feature Capsules: atlas-ui, pulse-ui, blog-ui,   │  │
│  │    connect-ui                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
                        │ JWT (Clerk)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Gateway (Cloudflare Worker)                     │  │
│  │  - Маршрутизация                                     │  │
│  │  - JWT валидация                                     │  │
│  │  - Rate limiting                                     │  │
│  │  - Кэширование публичных запросов                   │  │
│  │  - Логирование (requestId)                           │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP REST API
                        │ (синхронные запросы)
        ┌───────────────┼───────────────┬───────────────┐
        │               │               │               │
        ▼               ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Auth Service │ │Content Service│ │Points Service│ │Referral     │
│              │ │              │ │              │ │Service      │
│ (Cloudflare  │ │ (Cloudflare  │ │ (Cloudflare  │ │ (Cloudflare │
│  Worker)     │ │  Worker)     │ │  Worker)     │ │  Worker)    │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │
       │                │                │                │
       └────────────────┼────────────────┼────────────────┘
                        │                │
                        ▼                ▼
              ┌─────────────────────────────────┐
              │   Neon PostgreSQL                │
              │   - auth schema                 │
              │   - content schema              │
              │   - points schema               │
              │   - referral schema             │
              └─────────────────────────────────┘
                        │
                        │ Webhooks
                        ▼
              ┌─────────────────────────────────┐
              │   Clerk (SSO Provider)          │
              │   - user.created                │
              │   - user.updated                 │
              └─────────────────────────────────┘
```

### 1.2 Ключевые принципы архитектуры MVP

1. **Монорепозиторий:** Все сервисы в одном репозитории (`services/`)
2. **Микросервисы:** Каждый сервис — отдельный Cloudflare Worker
3. **Единая БД:** Neon PostgreSQL с разделением по схемам (не по базам)
4. **Синхронная коммуникация:** Только HTTP REST API (event-driven отложен на post-MVP)
5. **API Gateway:** Единая точка входа для всех запросов
6. **OpenAPI-first:** Все API описываются в OpenAPI перед реализацией

---

## 2. Сервисная декомпозиция MVP

### 2.1 API Gateway

**Расположение:** `apps/api-gateway/` или `services/api-gateway/`

**Технология:** Cloudflare Worker

**Ответственность:**
- Единая точка входа для всех API запросов
- Маршрутизация запросов к микросервисам
- JWT валидация (через Auth Service)
- Rate limiting (Cloudflare Rate Limiting Rules)
- Кэширование публичных GET запросов (TTL 600 секунд)
- Логирование всех запросов с requestId
- Health checks (`/health`, `/ready`)

**Маршрутизация:**
```
/v1/auth/*          → Auth Service
/v1/content/*       → Content Service
/v1/points/*        → Points Service
/v1/referral/*      → Referral Service
```

**Зависимости:**
- Auth Service (для валидации JWT)
- Все остальные сервисы (для проксирования запросов)

---

### 2.2 Auth Service

**Расположение:** `services/auth-service/`

**Технология:** Cloudflare Worker

**Ответственность:**
- Интеграция с Clerk SSO (webhooks)
- Хранение профилей пользователей (дополнительные поля)
- Выдача JWT токенов для межсервисной авторизации
- Управление ролями (Spacer, VIP-Spacer, Admin)

**Основные функции:**
- Приём webhooks от Clerk (`user.created`, `user.updated`)
- Синхронизация данных пользователей
- Проверка JWT токенов для API Gateway
- Получение профиля пользователя
- Получение ролей пользователя

**Зависимости:**
- Clerk (webhooks)
- Neon PostgreSQL (auth schema)

**API Boundaries:**
- Публичный: `GET /v1/auth/profile`, `GET /v1/auth/roles`
- Internal: `POST /v1/auth/webhook/clerk`, `POST /v1/auth/verify-jwt` (для Gateway)

---

### 2.3 Content Service

**Расположение:** `services/content-service/`

**Технология:** Cloudflare Worker

**Ответственность:**
- Управление контентом (Atlas, Pulse, Blog)
- CRUD операции для мест, событий, статей
- Поиск и фильтрация контента
- Кэширование публичного контента

**Основные функции:**
- Публичное чтение контента (GET endpoints)
- Административное создание/редактирование контента (POST/PUT/DELETE)
- Поиск по местам, событиям, статьям
- Фильтрация по категориям, датам, тегам

**Зависимости:**
- Neon PostgreSQL (content schema)
- Auth Service (для проверки роли администратора)

**API Boundaries:**
- Публичный: Все GET endpoints (`/v1/content/places`, `/v1/content/events`, `/v1/content/articles`)
- Internal: POST/PUT/DELETE endpoints (только для администраторов)

---

### 2.4 Points Service

**Расположение:** `services/points-service/`

**Технология:** Cloudflare Worker

**Ответственность:**
- Управление системой Points
- Начисление Points за активность
- История транзакций
- Баланс пользователя

**Основные функции:**
- Начисление Points согласно правилам (см. раздел "Правила начисления Points")
- Получение баланса пользователя
- Получение истории транзакций
- Идемпотентность транзакций (предотвращение дублирования через `external_id`)
- Проверка лимитов для каждого типа действия (per-action limits)
- Общий velocity limit (максимум 1000 Points в час на пользователя)

**Правила начисления Points (MVP):**

| Действие | Points | Ограничения | Проверка |
|---------|--------|-------------|----------|
| Регистрация | 100 | 1 раз | Проверка по `reason='registration'` и `user_id` |
| Регистрация по реферальной ссылке | 200 | 1 раз | Проверка по `reason='referral_registration'` и `user_id` |
| Первый вход в систему | 50 | 1 раз | Проверка по `reason='first_login'` и `user_id` |
| Регистрация на событие | 20 | Не чаще 1 раза в день | Проверка по `reason='event_registration'`, `user_id` и `created_at` (последние 24 часа) |
| Активный реферал (первый вход) | 100 | За каждого реферала | Проверка по `reason='referral_bonus'` и `source_event_id` (id реферала) |

**VIP-Spacer коэффициенты:**

- **Хранение:** Роль пользователя хранится в `auth.users.role` (Auth Service)
- **Проверка:** При начислении Points вызывающий сервис передаёт `user_role` в метаданных запроса
- **Применение:** Points Service применяет коэффициент к сумме начисления:
  - `spacer`: коэффициент 1.0 (базовый)
  - `vip_spacer`: коэффициент 1.5 для реферальных бонусов (только для `reason='referral_bonus'`)
  - `admin`: коэффициент 1.0 (без бонусов)

**Пример применения VIP коэффициента:**
```typescript
// При начислении реферального бонуса
const baseAmount = 100; // базовое начисление
const multiplier = userRole === 'vip_spacer' && reason === 'referral_bonus' ? 1.5 : 1.0;
const finalAmount = baseAmount * multiplier; // 150 для VIP-Spacer
```

**Общий velocity limit:**
- Максимум 1000 Points в час на пользователя (сумма всех транзакций за последний час)
- Проверяется дополнительно к per-action limits
- Защита от злоупотреблений и автоматизации

**Зависимости:**
- Neon PostgreSQL (points schema)
- Не зависит от других сервисов напрямую (вызывается другими сервисами)
- Получает информацию о роли пользователя через метаданные запроса (не вызывает Auth Service)

**API Boundaries:**
- Публичный: `GET /v1/points/balance`, `GET /v1/points/transactions` (для авторизованных)
- Internal: `POST /internal/points/add` (вызывается Auth Service, Referral Service, Content Service)
  - Параметры: `user_id`, `amount`, `reason`, `source_service`, `source_event_id`, `external_id` (для идемпотентности), `metadata` (включая `user_role` для VIP коэффициентов)

---

### 2.5 Referral Service

**Расположение:** `services/referral-service/`

**Технология:** Cloudflare Worker

**Ответственность:**
- Реферальная программа
- Генерация реферальных кодов/ссылок
- Отслеживание реферальных связей
- Статистика рефералов
- Начисление бонусов за рефералов

**Основные функции:**
- Генерация реферального кода для пользователя
- Регистрация нового пользователя по реферальной ссылке
- Получение реферального дерева
- Получение статистики рефералов
- Начисление бонусов через Points Service

**Зависимости:**
- Neon PostgreSQL (referral schema)
- Auth Service (для идентификации пользователя)
- Points Service (для начисления бонусов)

**API Boundaries:**
- Публичный: `GET /v1/referral/code`, `GET /v1/referral/tree`, `GET /v1/referral/stats` (для авторизованных)
- Публичный: `POST /v1/referral/register` (публичный, но требует реферальный код)

---

## 3. Data Ownership (Владение данными)

### 3.1 Принципы

- **Один сервис — одна схема БД:** Каждый сервис владеет своей схемой в Neon PostgreSQL
- **Нет прямого доступа к чужим таблицам:** Чтение данных других сервисов только через API
- **Денормализация для производительности:** При необходимости кэширование данных других сервисов
- **Единственный источник истины (SSOT):** Каждое поле данных имеет один SSOT. Дублирование допускается только как кэш для производительности с явным указанием SSOT.

### 3.2 Стратегия валидации user_id без внешних ключей

**Проблема:** Межсервисные связи хранят `user_id` без внешних ключей (например, `event_registrations.user_id`, `points_transactions.user_id`).

**Стратегия валидации:**

1. **Hard Validation через Gateway/Clerk JWT:**
   - Gateway проверяет JWT токен от Clerk перед проксированием запроса
   - Gateway извлекает `user_id` из JWT токена (поле `sub` или `user_id`)
   - Gateway передаёт `user_id` в заголовке `X-User-ID` при проксировании запросов
   - Сервисы доверяют заголовку `X-User-ID` от Gateway (Gateway является доверенным компонентом)

2. **Валидация при межсервисных вызовах:**
   - При межсервисных вызовах (например, Content Service → Points Service) `user_id` передаётся как параметр
   - Points Service не валидирует существование пользователя (доверяет вызывающему сервису)
   - Если нужна дополнительная валидация, можно вызвать Auth Service API, но это не обязательно для MVP

3. **Удаление пользователей:**
   - **В MVP удаление пользователей НЕ поддерживается**
   - Пользователи могут быть деактивированы (soft delete через поле `status` в `auth.users`), но не удаляются физически
   - Это исключает проблему orphaned records в MVP
   - В post-MVP будет реализована стратегия очистки orphaned records при необходимости

4. **Целостность данных:**
   - Целостность обеспечивается через валидацию на уровне Gateway (JWT проверка)
   - Межсервисные вызовы доверяют друг другу (в рамках одного доверенного окружения)
   - Аудит целостности может быть выполнен периодически через фоновые задачи (не в MVP)

### 3.2 Схемы БД и таблицы

#### Auth Service → `auth` schema

**Таблицы:**
- `users` — профили пользователей (дополнительные поля к Clerk)
  - `id` (uuid, pk)
  - `clerk_user_id` (string, unique) — ID из Clerk
  - `email` (string, indexed)
  - `role` (enum: 'spacer', 'vip_spacer', 'admin')
  - `created_at`, `updated_at`
  - `last_login_at` (timestamp, nullable)
- `user_profiles` — расширенные профили (опционально для MVP)
  - `user_id` (uuid, pk, fk → users)
  - `display_name` (string)
  - `avatar_url` (string, nullable)
  - `bio` (text, nullable)

**Владение:** Auth Service — единственный владелец этих таблиц

**Примечание:** `referral_code` НЕ хранится в `auth.users`. Единственный источник истины (SSOT) — Referral Service (`referral.referral_links.code`). Если нужен быстрый доступ к referral_code пользователя, Auth Service может кэшировать его через API Referral Service, но это не SSOT.

---

#### Content Service → `content` schema

**Таблицы:**
- `countries` — страны
  - `id` (uuid, pk)
  - `code` (string, unique) — ISO код страны
  - `name` (string)
  - `description` (text, nullable)
  - `flag_url` (string, nullable)
  - `created_at`, `updated_at`
- `cities` — города
  - `id` (uuid, pk)
  - `country_id` (uuid, fk → countries)
  - `name` (string)
  - `description` (text, nullable)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `created_at`, `updated_at`
- `places` — места (достопримечательности, кафе, пляжи и т.д.)
  - `id` (uuid, pk)
  - `city_id` (uuid, fk → cities)
  - `name` (string)
  - `description` (text)
  - `category` (enum: 'attraction', 'cafe', 'beach', 'restaurant', 'hotel', 'other')
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `image_url` (string, nullable)
  - `created_at`, `updated_at`
- `events` — события
  - `id` (uuid, pk)
  - `title` (string)
  - `description` (text)
  - `category` (enum: 'festival', 'meetup', 'tour', 'concert', 'other')
  - `start_date` (timestamp)
  - `end_date` (timestamp, nullable)
  - `place_id` (uuid, fk → places, nullable) — место проведения
  - `city_id` (uuid, fk → cities)
  - `image_url` (string, nullable)
  - `created_at`, `updated_at`
- `event_registrations` — регистрации на события
  - `id` (uuid, pk)
  - `event_id` (uuid, fk → events)
  - `user_id` (uuid) — ID из Auth Service (не FK, так как другой сервис)
  - `registered_at` (timestamp)
- `articles` — статьи блога
  - `id` (uuid, pk)
  - `slug` (string, unique)
  - `title` (string)
  - `excerpt` (text)
  - `content` (text) — markdown или HTML
  - `category` (string)
  - `tags` (array<string>)
  - `author_id` (uuid) — ID из Auth Service (не FK)
  - `cover_image_url` (string, nullable)
  - `published_at` (timestamp, nullable)
  - `created_at`, `updated_at`

**Владение:** Content Service — единственный владелец этих таблиц

**Примечание:** `event_registrations.user_id` и `articles.author_id` хранят UUID из Auth Service, но не имеют внешних ключей (межсервисные связи через API)

---

#### Points Service → `points` schema

**Таблицы:**
- `points_transactions` — журнал транзакций Points
  - `id` (uuid, pk)
  - `external_id` (string, unique, nullable) — идемпотентный ID от вызывающего сервиса
  - `user_id` (uuid) — ID из Auth Service (не FK)
  - `type` (enum: 'credit', 'debit')
  - `amount` (numeric, > 0)
  - `reason` (string) — причина начисления ('registration', 'referral', 'event_registration', 'first_login')
  - `source_service` (string) — кто инициировал ('auth_service', 'referral_service', 'content_service')
  - `source_event_id` (string, nullable) — ID события в исходном сервисе
  - `metadata` (jsonb, nullable) — дополнительные данные
  - `status` (enum: 'completed', 'failed')
  - `created_at`, `updated_at`
- `user_balances` — агрегированный баланс (кэш для производительности)
  - `user_id` (uuid, pk) — ID из Auth Service (не FK)
  - `balance` (numeric, default: 0)
  - `updated_at` (timestamp)

**Владение:** Points Service — единственный владелец этих таблиц

**Примечание:** Баланс можно вычислить как сумму транзакций, но для производительности используется агрегированная таблица `user_balances`

---

#### Referral Service → `referral` schema

**Таблицы:**
- `referral_links` — реферальные ссылки пользователей
  - `id` (uuid, pk)
  - `user_id` (uuid) — ID из Auth Service (не FK)
  - `code` (string, unique) — реферальный код
  - `created_at`, `updated_at`
- `referral_relations` — реферальные связи
  - `id` (uuid, pk)
  - `referrer_user_id` (uuid) — ID реферера из Auth Service (не FK)
  - `referred_user_id` (uuid) — ID реферала из Auth Service (не FK)
  - `referral_link_id` (uuid, fk → referral_links)
  - `created_at` (timestamp)

**Владение:** Referral Service — единственный владелец этих таблиц

**Примечание:** Многоуровневая реферальная система (2+ уровня) не реализована в MVP, поэтому достаточно одной таблицы `referral_relations`

---

#### Connect Module (Frontend) → нет собственной БД

**Примечание:** Connect Asia — это фронтенд-модуль, который отображает данные из Points Service и Referral Service. Не имеет собственной БД.

**Бейджи (виртуальные достижения):**
- Хранятся в таблице `user_badges` в схеме `points` (Points Service владеет)
- Структура:
  - `id` (uuid, pk)
  - `user_id` (uuid) — ID из Auth Service (не FK)
  - `badge_type` (string) — тип бейджа ('first_login', 'event_registration', 'referral_master')
  - `earned_at` (timestamp)

---

## 4. API Boundaries (Границы API)

### 4.1 Публичные API (доступны через API Gateway)

**Auth Service:**
- `GET /v1/auth/profile` — получение профиля пользователя (требует JWT)
- `GET /v1/auth/roles` — получение ролей пользователя (требует JWT)

**Content Service:**
- `GET /v1/content/places` — список мест (публичный)
- `GET /v1/content/places/{id}` — детали места (публичный)
- `GET /v1/content/events` — список событий (публичный)
- `GET /v1/content/events/{id}` — детали события (публичный)
- `GET /v1/content/articles` — список статей (публичный)
- `GET /v1/content/articles/{slug}` — детали статьи (публичный)

**Points Service:**
- `GET /v1/points/balance` — баланс Points (требует JWT)
- `GET /v1/points/transactions` — история транзакций (требует JWT)

**Referral Service:**
- `GET /v1/referral/code` — получение реферального кода (требует JWT)
- `GET /v1/referral/tree` — реферальное дерево (требует JWT)
- `GET /v1/referral/stats` — статистика рефералов (требует JWT)
- `POST /v1/referral/register` — регистрация по реферальной ссылке (публичный, но требует реферальный код)

---

### 4.2 Internal API (межсервисные вызовы)

**Требования к Internal API:**
- Все internal endpoints (`/internal/*`) требуют Service JWT в заголовке `Authorization: Bearer <service-jwt>`
- Service JWT валидируется на стороне получателя (см. раздел 8.2)
- Internal endpoints недоступны извне без Service JWT

**Auth Service:**
- `POST /v1/auth/webhook/clerk` — приём webhooks от Clerk (публичный endpoint, защищён секретом Clerk)
- `POST /internal/auth/verify-jwt` — проверка User JWT токена (для API Gateway, требует Service JWT)
  - Параметры: `token` (User JWT от Clerk)
  - Возвращает: `user_id`, `role`, `email`

**Content Service:**
- `POST /v1/content/places` — создание места (только для администраторов, требует User JWT)
- `PUT /v1/content/places/{id}` — редактирование места (только для администраторов, требует User JWT)
- `DELETE /v1/content/places/{id}` — удаление места (только для администраторов, требует User JWT)
- Аналогично для `events` и `articles`
- `POST /v1/content/events/{id}/register` — регистрация на событие (требует User JWT)

**Points Service:**
- `POST /internal/points/add` — начисление Points (вызывается другими сервисами, требует Service JWT)
  - Параметры: `user_id`, `amount`, `reason`, `source_service`, `source_event_id`, `external_id` (для идемпотентности), `metadata` (включая `user_role` для VIP коэффициентов)
  - Таймаут: 2 секунды
  - Retry: 0 (не повторяем при ошибке)

**Referral Service:**
- `POST /v1/referral/generate-code` — генерация referral_code для пользователя (вызывается Auth Service, требует Service JWT)
  - Параметры: `user_id`
  - Возвращает: `referral_code`
- `POST /v1/referral/register` — регистрация по реферальной ссылке (публичный, но требует реферальный код)

---

### 4.3 Правила доступа

**Публичные endpoints:**
- Не требуют аутентификации
- Rate limiting: 100 req/min на IP
- Кэширование: TTL 600 секунд на Edge

**Авторизованные endpoints:**
- Требуют JWT токен в заголовке `Authorization: Bearer <token>`
- Rate limiting: 200 req/min на user_id
- Кэширование: `Cache-Control: no-store` (персональные данные)

**Internal endpoints:**
- Требуют Service JWT в заголовке `Authorization: Bearer <service-jwt>`
- Защищены валидацией Service JWT (см. раздел 8.2)
- Не проходят через API Gateway (вызываются напрямую между сервисами)
- Таймаут: 2-3 секунды
- Retry: 0-1 попытка (в зависимости от критичности)

**Административные endpoints:**
- Требуют роль `admin` в JWT токене
- Проверка роли на уровне API Gateway или Content Service

---

## 5. Event Flows (Потоки событий)

**Важно:** В MVP используется только синхронная коммуникация через HTTP REST API. Event-driven архитектура отложена на post-MVP.

### 5.1 Поток регистрации пользователя

```
1. Пользователь регистрируется через Clerk SSO
   ↓
2. Clerk отправляет webhook user.created → Auth Service
   ↓
3. Auth Service:
   - Создаёт запись в таблице users (без referral_code, SSOT = Referral Service)
   - Вызывает Referral Service для генерации referral_code (POST /v1/referral/generate-code)
   - Начисляет 100 Points через Points Service (POST /internal/points/add)
     - Таймаут: 2 секунды
     - Retry: 0 (не повторяем при ошибке)
     - Graceful degradation: Если Points Service недоступен, регистрация продолжается без начисления Points
   ↓
4. Points Service:
   - Проверяет лимит (registration: 1 раз)
   - Проверяет velocity limit (1000 Points в час)
   - Создаёт транзакцию (reason: 'registration', amount: 100)
   - Обновляет баланс пользователя
   ↓
5. Ответ возвращается в Auth Service → Clerk
```

**Синхронные вызовы:**
- Auth Service → Referral Service (HTTP POST, таймаут 2s, retry 0)
- Auth Service → Points Service (HTTP POST, таймаут 2s, retry 0)

**Обработка ошибок:**
- Если Referral Service недоступен: регистрация продолжается без referral_code (может быть сгенерирован позже)
- Если Points Service недоступен: регистрация продолжается без начисления Points (может быть начислено позже через фоновую задачу в post-MVP)

---

### 5.2 Поток регистрации по реферальной ссылке

```
1. Пользователь регистрируется через Clerk с реферальным кодом
   ↓
2. Clerk отправляет webhook user.created → Auth Service
   ↓
3. Auth Service:
   - Создаёт запись в таблице users (без referral_code, SSOT = Referral Service)
   - Вызывает Referral Service (POST /v1/referral/register) с реферальным кодом
     - Таймаут: 2 секунды
     - Retry: 0 (не повторяем при ошибке)
     - Graceful degradation: Если Referral Service недоступен, регистрация продолжается без реферальной связи
   ↓
4. Referral Service:
   - Проверяет реферальный код (SSOT)
   - Создаёт связь в referral_relations
   - Генерирует referral_code для нового пользователя (SSOT)
   - Начисляет 200 Points рефералу через Points Service (POST /internal/points/add)
     - reason: 'referral_registration'
     - amount: 200
     - Таймаут: 2 секунды
     - Retry: 0
   - Начисляет 100 Points рефереру через Points Service (при первом входе реферала)
     - reason: 'referral_bonus'
     - amount: 100 (или 150 для VIP-Spacer с коэффициентом 1.5)
     - Таймаут: 2 секунды
     - Retry: 0
   ↓
5. Points Service обрабатывает оба начисления синхронно
   ↓
6. Ответ возвращается в Referral Service → Auth Service → Clerk
```

**Синхронные вызовы:**
- Auth Service → Referral Service (HTTP POST, таймаут 2s, retry 0)
- Referral Service → Points Service (HTTP POST, два вызова, таймаут 2s, retry 0)

**Обработка ошибок:**
- Если Referral Service недоступен: регистрация продолжается без реферальной связи (может быть обработана позже)
- Если Points Service недоступен: реферальная связь создаётся, но Points не начисляются (может быть начислено позже)

---

### 5.3 Поток регистрации на событие

```
1. Пользователь регистрируется на событие в Pulse
   ↓
2. Frontend отправляет POST /v1/content/events/{id}/register
   ↓
3. API Gateway:
   - Проверяет User JWT токен через Auth Service (POST /internal/auth/verify-jwt)
     - Таймаут: 2 секунды
     - Retry: 1 (одна попытка повтора)
     - Graceful degradation: Если Auth Service недоступен, возвращается 503 Service Unavailable
   - Извлекает user_id и role из JWT payload
   - Проксирует запрос в Content Service с заголовком X-User-ID
   ↓
4. Content Service:
   - Проверяет существование события
   - Проверяет, не зарегистрирован ли уже пользователь (UNIQUE constraint)
   - Создаёт запись в event_registrations (user_id из заголовка X-User-ID)
   - Вызывает Points Service (POST /internal/points/add)
     - reason: 'event_registration'
     - amount: 20
     - Таймаут: 2 секунды
     - Retry: 0 (не повторяем при ошибке)
     - Graceful degradation: Если Points Service недоступен, регистрация на событие сохраняется, но Points не начисляются
   ↓
5. Points Service:
   - Проверяет лимит (event_registration: не чаще 1 раза в день)
   - Проверяет velocity limit (1000 Points в час)
   - Создаёт транзакцию
   - Обновляет баланс
   ↓
6. Ответ возвращается в Content Service → API Gateway → Frontend
```

**Синхронные вызовы:**
- Frontend → API Gateway → Auth Service (HTTP POST для проверки JWT, таймаут 2s, retry 1)
- API Gateway → Content Service (HTTP POST)
- Content Service → Points Service (HTTP POST, таймаут 2s, retry 0)

**Обработка ошибок:**
- Если Auth Service недоступен: Gateway возвращает 503 Service Unavailable (критическая зависимость)
- Если Points Service недоступен: регистрация на событие сохраняется, но Points не начисляются (может быть начислено позже)

---

### 5.4 Поток первого входа в систему

```
1. Пользователь входит в систему через Clerk SSO
   ↓
2. Clerk отправляет webhook user.updated → Auth Service
   ↓
3. Auth Service:
   - Проверяет, был ли это первый вход (last_login_at == null)
   - Если да, вызывает Points Service (POST /internal/points/add)
     - reason: 'first_login'
     - amount: 50
   - Обновляет last_login_at
   ↓
4. Points Service обрабатывает начисление
   ↓
5. Если пользователь был приглашён по реферальной ссылке:
   - Referral Service проверяет, был ли это первый вход реферала
   - Если да, начисляет 100 Points рефереру через Points Service
```

**Синхронные вызовы:**
- Auth Service → Points Service (HTTP POST)
- Referral Service → Points Service (HTTP POST, опционально)

---

## 6. Минимальный ADR (Architecture Decision Record)

### ADR MVP-001: Синхронная коммуникация вместо event-driven

**Статус:** Принято  
**Дата:** 2025-01-16  
**Контекст:** В MVP требуется простая архитектура без сложных зависимостей

**Решение:**
Использовать только синхронные HTTP REST API для межсервисной коммуникации. Event-driven архитектура (очереди, брокеры сообщений) отложена на post-MVP.

**Обоснование:**
- Упрощение архитектуры для MVP
- Меньше точек отказа (нет брокера сообщений)
- Проще отладка (синхронные вызовы)
- Достаточно для MVP масштаба

**Последствия:**
- Плюсы: простота, предсказуемость, легче отладка
- Минусы: связанность сервисов, потенциальные каскадные сбои
- Митигация: таймауты на HTTP запросы, circuit breaker (в будущем)

**Альтернативы:**
- Event-driven архитектура (отложена на post-MVP)
- gRPC (избыточно для MVP)

---

### ADR MVP-002: Единая БД с разделением по схемам

**Статус:** Принято  
**Дата:** 2025-01-16  
**Контекст:** MVP требует простую архитектуру БД

**Решение:**
Использовать одну Neon PostgreSQL базу данных с разделением по схемам (`auth`, `content`, `points`, `referral`). Каждый сервис владеет своей схемой.

**Обоснование:**
- Упрощение для MVP (не нужно управлять несколькими БД)
- Neon поддерживает схемы PostgreSQL
- Логическое разделение данных сохранено
- В будущем можно мигрировать на отдельные БД при необходимости

**Последствия:**
- Плюсы: простота управления, одна точка подключения
- Минусы: потенциальная связанность на уровне БД (митигируется через схемы)
- Митигация: строгие правила доступа (сервис может читать только свою схему)

**Альтернативы:**
- Отдельные БД для каждого сервиса (избыточно для MVP)
- Монолитная БД без схем (нарушает принципы микросервисов)

---

## 7. Технологический стек (IMMUTABLE)

Согласно `infrastructure_context.md` и `ENGINEERING_PLAYBOOK.md`:

**Backend:**
- Cloudflare Workers (все микросервисы)
- Neon PostgreSQL (база данных)
- Drizzle ORM (работа с БД)
- jose (JWT библиотека, единственная)
- Zod (валидация схем)

**Frontend:**
- Next.js 15 (App Router)
- React
- Tailwind CSS
- Clerk SSO (аутентификация)

**Infrastructure:**
- Cloudflare (DNS, CDN, Workers, R2)
- Netlify (хостинг фронтенда)
- GitHub Actions (CI/CD)

**Запрещено:**
- Менять стек
- Предлагать альтернативные провайдеры
- Использовать другие JWT библиотеки

---

## 8. Безопасность

### 8.1 User Authentication (Аутентификация пользователей)

- **Clerk SSO:** Единственный источник идентификации пользователей
- **User JWT токены:** Выдаются Clerk, проверяются через Auth Service
- **Формат User JWT:** Стандартный JWT от Clerk с полями `sub` (user_id), `email`, `role` (если добавлен в метаданные Clerk)

### 8.2 Service-to-Service Authentication (Межсервисная аутентификация)

**Проблема:** Cloudflare Workers не имеют концепции "внутренней сети" по умолчанию. Все Workers доступны через публичные URL.

**Решение:** Service JWT токены (отдельно от User JWT Clerk)

#### 8.2.1 Service JWT Specification

**Issuer:** `go2asia-service-auth` (внутренний issuer для Service JWT)

**Claims:**
- `iss`: `go2asia-service-auth` (issuer)
- `aud`: Имя сервиса-получателя (например, `points-service`, `auth-service`)
- `sub`: Имя сервиса-отправителя (например, `auth-service`, `referral-service`)
- `iat`: Время выдачи токена
- `exp`: Время истечения токена (TTL: 5 минут)
- `service_id`: UUID сервиса (опционально, для аудита)

**Алгоритм:** `HS256` (HMAC с SHA-256)

**Secret Key:** Хранится в Cloudflare Secrets как `SERVICE_JWT_SECRET`

#### 8.2.2 Генерация Service JWT

**Где генерируется:**
- Каждый сервис генерирует Service JWT перед межсервисным вызовом
- Используется библиотека `jose` для подписи токена

**Пример генерации:**
```typescript
import * as jose from 'jose';

const secret = new TextEncoder().encode(env.SERVICE_JWT_SECRET);
const serviceJWT = await new jose.SignJWT({
  sub: 'auth-service', // отправитель
  aud: 'points-service', // получатель
  service_id: env.SERVICE_ID,
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('5m')
  .setIssuer('go2asia-service-auth')
  .sign(secret);
```

#### 8.2.3 Валидация Service JWT

**Где валидируется:**
- Каждый internal endpoint проверяет Service JWT в заголовке `Authorization: Bearer <service-jwt>`
- Валидация выполняется с помощью библиотеки `jose`

**Пример валидации:**
```typescript
import * as jose from 'jose';

const token = request.headers.get('Authorization')?.replace('Bearer ', '');
if (!token) {
  return new Response('Unauthorized', { status: 401 });
}

const secret = new TextEncoder().encode(env.SERVICE_JWT_SECRET);
try {
  const { payload } = await jose.jwtVerify(token, secret, {
    issuer: 'go2asia-service-auth',
    audience: 'points-service', // имя текущего сервиса
  });
  // payload.sub содержит имя сервиса-отправителя
} catch (error) {
  return new Response('Unauthorized', { status: 401 });
}
```

#### 8.2.4 Хранение секретов

**Cloudflare Secrets:**
- `SERVICE_JWT_SECRET`: Секретный ключ для подписи Service JWT (общий для всех сервисов)
- Доступ через `env.SERVICE_JWT_SECRET` в Cloudflare Workers
- Устанавливается через Cloudflare Dashboard или Wrangler CLI

**Ротация секретов:**
- Ротация выполняется вручную администратором
- Процесс ротации:
  1. Генерируется новый секрет
  2. Новый секрет добавляется в Cloudflare Secrets как `SERVICE_JWT_SECRET_NEW`
  3. Сервисы обновляются для поддержки обоих секретов (старый и новый)
  4. После периода миграции (24 часа) старый секрет удаляется
  5. `SERVICE_JWT_SECRET_NEW` переименовывается в `SERVICE_JWT_SECRET`

#### 8.2.5 Защита Internal Endpoints

**Правило:** Все internal endpoints (`/internal/*`) требуют Service JWT в заголовке `Authorization: Bearer <service-jwt>`

**Пример защиты:**
```typescript
// Internal endpoint в Points Service
if (request.url.includes('/internal/')) {
  const serviceJWT = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!serviceJWT || !await validateServiceJWT(serviceJWT, 'points-service')) {
    return new Response('Unauthorized', { status: 401 });
  }
}
```

**Публичные endpoints:** Не требуют Service JWT (только User JWT от Clerk для авторизованных запросов)

### 8.3 Авторизация (Authorization)

**Стратегия:** Gateway проверяет роли, передаёт `user_id` в сервисы

**Процесс:**
1. Gateway получает User JWT от Clerk из заголовка `Authorization: Bearer <user-jwt>`
2. Gateway валидирует User JWT через Auth Service (`POST /internal/auth/verify-jwt`)
3. Gateway извлекает `user_id` и `role` из JWT payload
4. Gateway проверяет роли для административных операций (например, `role === 'admin'`)
5. Gateway передаёт `user_id` в заголовке `X-User-ID` при проксировании запросов
6. Сервисы доверяют заголовку `X-User-ID` от Gateway (Gateway является доверенным компонентом)

**Защита доверия заголовкам:**
- Gateway является единственным компонентом, который может устанавливать заголовок `X-User-ID`
- Сервисы проверяют, что запрос пришёл от Gateway (через Service JWT или проверку источника)
- В MVP достаточно доверия к Gateway (в post-MVP можно добавить дополнительную проверку)

**Роли:**
- `spacer`: Базовый пользователь
- `vip_spacer`: Активный пользователь (повышенные коэффициенты Points)
- `admin`: Администратор (доступ к CRUD операциям)

**Проверка ролей:**
- **На уровне Gateway:** Для административных операций (POST/PUT/DELETE endpoints)
- **На уровне сервиса:** Опционально, для дополнительной проверки (не обязательно в MVP)

### 8.4 Валидация

- **Входные данные:** Все валидируются через Zod схемы на уровне API Gateway
- **Выходные данные:** Валидация ответов сервисов (опционально)

### 8.5 Rate Limiting

- **Публичные GET:** 100 req/min на IP
- **Авторизованные:** 200 req/min на user_id
- **POST запросы:** 10 req/min на user_id
- **Internal endpoints:** 1000 req/min на service_id (высокий лимит для межсервисных вызовов)
- **Реализация:** Cloudflare Rate Limiting Rules

---

## 9. Производительность и кэширование

### 9.1 Стратегия кэширования

#### 9.1.1 Edge Cache (Cloudflare CDN)

**Публичный контент (Atlas, Pulse, Blog):**
- **TTL:** 600 секунд (10 минут)
- **SWR (Stale-While-Revalidate):** 600 секунд
- **Cache-Control:** `public, s-maxage=600, stale-while-revalidate=600`
- **Vary:** `Accept, Accept-Encoding`
- **Примеры endpoints:**
  - `GET /v1/content/places`
  - `GET /v1/content/places/{id}`
  - `GET /v1/content/events`
  - `GET /v1/content/articles`

**Персональные данные (Connect, Profile):**
- **Cache-Control:** `no-store, no-cache, must-revalidate`
- **Примеры endpoints:**
  - `GET /v1/points/balance`
  - `GET /v1/points/transactions`
  - `GET /v1/referral/stats`
  - `GET /v1/auth/profile`

**Инвалидация Edge Cache:**
- Ручная инвалидация через Cloudflare API при изменении контента администратором
- Автоматическая инвалидация при публикации/редактировании статей/событий (post-MVP)

#### 9.1.2 Service Worker Cache (PWA Offline)

**Стратегия кэширования:**
- **Network First:** Для публичного контента (Atlas, Pulse, Blog)
  - Запрос к сети, если сеть недоступна — из кэша
  - Лимит кэша: 50MB на устройство
- **Cache First:** Для статического контента (изображения, CSS, JS)
  - Проверка кэша, если нет — запрос к сети

**Офлайн-контент:**
- **Atlas:** Последние 20 просмотренных мест кэшируются в IndexedDB
- **Pulse:** Ближайшие события (на ближайшие 7 дней) кэшируются в IndexedDB
- **Blog:** Последние 10 просмотренных статей кэшируются в IndexedDB

**Взаимодействие Edge Cache и Service Worker Cache:**
1. **Онлайн:** Service Worker запрашивает данные из сети → Edge Cache отвечает → данные кэшируются в IndexedDB
2. **Офлайн:** Service Worker возвращает данные из IndexedDB
3. **Синхронизация:** При восстановлении соединения Service Worker проверяет обновления через Edge Cache

**Cache-Control для офлайн-контента:**
- Для контента, который должен быть доступен офлайн: `public, max-age=3600` (1 час)
- Это позволяет Service Worker кэшировать контент для офлайн-доступа

#### 9.1.3 Таблица кэширования

| Ресурс | Edge Cache | Service Worker | Cache-Control |
|--------|------------|----------------|---------------|
| Публичный контент (Atlas, Pulse, Blog) | TTL 600s | Network First, 50MB | `public, s-maxage=600, stale-while-revalidate=600` |
| Персональные данные (Points, Referral) | No cache | No cache | `no-store, no-cache, must-revalidate` |
| Статический контент (images, CSS, JS) | TTL 3600s | Cache First | `public, max-age=3600` |
| Офлайн-контент (последние просмотренные) | TTL 600s | Cache First, IndexedDB | `public, max-age=3600` |

### 9.2 Оптимизация запросов

- **Агрегированные балансы:** Таблица `user_balances` для быстрого доступа
- **Индексы БД:** На всех внешних ключах и часто используемых полях
- **Пагинация:** Все списковые endpoints поддерживают `limit` и `offset`
- **Lazy Loading:** Frontend загружает данные по требованию (не все сразу)

---

## 10. Наблюдаемость

### 10.1 RequestId Propagation (Сквозная трассировка)

**Механизм передачи requestId:**

1. **Генерация requestId:**
   - Gateway генерирует requestId при получении запроса (UUID v4)
   - Или получает из заголовка `X-Request-ID` (если передан клиентом)
   - Формат: UUID v4 (например, `550e8400-e29b-41d4-a716-446655440000`)

2. **Передача requestId:**
   - Gateway передаёт requestId в заголовке `X-Request-ID` при проксировании запросов к сервисам
   - Сервисы передают requestId в заголовке `X-Request-ID` при межсервисных вызовах
   - Все логи содержат поле `requestId` для трассировки

3. **Пример использования:**
```typescript
// Gateway
const requestId = request.headers.get('X-Request-ID') || crypto.randomUUID();
const serviceRequest = new Request(serviceUrl, {
  headers: {
    'X-Request-ID': requestId,
    'X-User-ID': userId,
  },
});

// Service (межсервисный вызов)
const requestId = request.headers.get('X-Request-ID');
const pointsRequest = new Request(pointsServiceUrl, {
  headers: {
    'X-Request-ID': requestId,
    'Authorization': `Bearer ${serviceJWT}`,
  },
});
```

### 10.2 Логирование

- **Структурированные логи:** JSON формат с полями:
  - `requestId` — сквозная трассировка (UUID v4)
  - `service` — имя сервиса
  - `level` — уровень лога (info, error, warn)
  - `message` — сообщение
  - `timestamp` — временная метка (ISO 8601)
  - `user_id` — ID пользователя (если доступен)
  - `error` — детали ошибки (если есть)
- **Реализация:** `console.log` в Cloudflare Workers (структурированный JSON)

**Пример лога:**
```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "service": "points-service",
  "level": "info",
  "message": "Points added successfully",
  "timestamp": "2025-01-16T12:00:00Z",
  "user_id": "user-123",
  "amount": 100,
  "reason": "registration"
}
```

### 10.3 Метрики

- **Cloudflare Analytics:** Автоматический сбор метрик
- **Метрики:**
  - p95 latency
  - Error rate
  - Request count
  - Таймауты межсервисных вызовов
  - Retry attempts

### 10.4 Health Checks

- **Все сервисы:** `/health` и `/ready` endpoints
- **Health:** Проверка доступности сервиса
- **Ready:** Проверка готовности (подключение к БД)

### 10.5 Обработка каскадных сбоев

**Проблема:** Синхронные вызовы между сервисами могут привести к каскадным сбоям.

**Митигация:**

1. **Таймауты для межсервисных вызовов:**
   - Стандартный таймаут: **2 секунды** для всех межсервисных вызовов
   - Критические вызовы (например, проверка JWT): **3 секунды**
   - Реализация через `AbortController` и `signal` в Fetch API

2. **Retry логика:**
   - **Retry 0:** Для не-критических операций (начисление Points, генерация referral_code)
   - **Retry 1:** Для критических операций (проверка JWT в Gateway)
   - Максимальная задержка между попытками: 500ms
   - Retry только для временных ошибок (5xx, network errors)

3. **Graceful Degradation (Постепенная деградация):**

   **Сценарий 1: Points Service недоступен при регистрации пользователя**
   - Действие: Регистрация пользователя продолжается без начисления Points
   - Логирование: Ошибка логируется с requestId
   - Восстановление: Points могут быть начислены позже через фоновую задачу (post-MVP) или вручную администратором

   **Сценарий 2: Auth Service недоступен при проверке JWT**
   - Действие: Gateway возвращает 503 Service Unavailable
   - Логирование: Критическая ошибка логируется
   - Восстановление: Требуется немедленное вмешательство (Auth Service критичен)

   **Сценарий 3: Referral Service недоступен при регистрации**
   - Действие: Регистрация продолжается без генерации referral_code
   - Логирование: Ошибка логируется с requestId
   - Восстановление: referral_code может быть сгенерирован позже при первом запросе пользователя

   **Сценарий 4: Points Service недоступен при регистрации на событие**
   - Действие: Регистрация на событие сохраняется, но Points не начисляются
   - Логирование: Ошибка логируется с requestId
   - Восстановление: Points могут быть начислены позже через фоновую задачу

4. **Circuit Breaker (в будущем):**
   - В MVP не реализован (избыточно)
   - В post-MVP может быть добавлен для автоматического отключения недоступных сервисов

5. **Мониторинг:**
   - Алерты на высокий процент ошибок (error rate > 5%)
   - Алерты на высокую латентность (p95 latency > 500ms)
   - Алерты на таймауты межсервисных вызовов

---

## 11. Seed данные для MVP

### 11.1 Требования к seed данным

**Atlas (места):**
- 7 стран Юго-Восточной Азии (TH, VN, ID, MY, SG, PH, KH)
- 10–15 городов (по 2–3 города на страну)
- 30–50 мест (достопримечательности, кафе, пляжи, районы)
- Каждое место должно содержать: название, описание, координаты, категорию, фото

**Pulse (события):**
- 10–15 событий на ближайшие 30 дней
- Разнообразие категорий (фестиваль, встреча, экскурсия, концерт)
- Каждое событие должно содержать: название, описание, дату/время, место проведения (связь с Atlas), категорию

**Blog (статьи):**
- 10 статей на различные темы (культура, путешествия, лайфстайл, digital-nomad опыт)
- Каждая статья должна содержать: заголовок, slug, описание, текст, категорию, теги, автора, дату публикации, обложку

### 11.2 Процесс загрузки seed данных

**Когда загружаются:**
- После выполнения всех миграций БД
- Вручную через команду `pnpm seed` (для разработки)
- Автоматически при первом деплое на staging/production (опционально)

**Формат seed данных:**
- SQL файлы в директории `services/content-service/seeds/`
- Кодировка: UTF-8 (обязательно)
- Идемпотентность: можно запускать многократно без ошибок

**Идемпотентность:**
- Использование `INSERT ... ON CONFLICT DO NOTHING` для всех записей
- Проверка существования перед вставкой (опционально)
- Seed данные можно запускать многократно без дублирования

**Структура seed файлов:**
```
services/content-service/
└── seeds/
    ├── 001_countries.sql
    ├── 002_cities.sql
    ├── 003_places.sql
    ├── 004_events.sql
    └── 005_articles.sql
```

**Команда для загрузки:**
```bash
# Загрузка seed данных
pnpm --filter content-service seed

# Или через Drizzle Kit
pnpm drizzle-kit seed
```

**Проверка кодировки:**
- Проверка UTF-8 выполняется в CI (см. ENGINEERING_PLAYBOOK.md)
- Ошибки кодировки блокируют деплой

---

## Deliverables

- ✅ High-level архитектурная схема MVP создана
- ✅ Сервисная декомпозиция описана (Gateway + 4 сервиса)
- ✅ Data ownership определён (4 схемы БД)
- ✅ API boundaries описаны (публичные и internal endpoints)
- ✅ Event flows описаны (4 потока, синхронные)
- ✅ Service-to-Service Security описана (Service JWT)
- ✅ Data ownership исправлен (referral_code SSOT = Referral Service)
- ✅ Стратегия валидации user_id описана
- ✅ Обработка каскадных сбоев описана (таймауты, retry, graceful degradation)
- ✅ Правила начисления Points приведены к ТЗ
- ✅ VIP коэффициенты описаны
- ✅ Gateway authz определён
- ✅ Стратегия кэширования описана (Edge cache + Service Worker cache)
- ✅ RequestId propagation описана
- ✅ Процесс seed данных описан

## Open Questions

Нет открытых вопросов. Все архитектурные решения приняты на основе ТЗ и утверждённых документов.

## Next

Передача управления агенту **Architecture Reviewer** для повторного ревью архитектуры MVP.

