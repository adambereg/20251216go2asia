# Service Inventory (repo → docs mapping)

Дата: 2025-12-26  
Статус: **Source of truth по фактической реализации** (в репозитории)

## Зачем этот документ

`docs/knowledge/backend_microservice.md` описывает **целевую** микросервисную картину (полную экосистему).  
Этот файл фиксирует **фактическое состояние** репозитория и даёт маппинг “что в docs задумано” → “что реально есть в repo” с доказательствами (пути/эндпоинты/схемы).

---

## 1) Фактические backend-приложения в репозитории (apps/*)

> Все backend-сервисы в `apps/*` реализованы как **Cloudflare Workers** (есть `wrangler.toml` и `src/index.ts`).

| App (repo) | Тип | Entrypoint | Основные префиксы/маршруты | OpenAPI/SDK | DB/схемы/миграции | Evidence |
|---|---|---|---|---|---|---|
| `apps/api-gateway` | Cloudflare Worker (API Gateway) | `apps/api-gateway/src/index.ts` | `/health`, `/ready`, `/v1/_debug/routes`, прокси по префиксам: `/v1/auth/*`, `/v1/users/*`, `/v1/content/*` (+ alias `/v1/api/content/*`), `/v1/points/*`, `/v1/referral/*` | OpenAPI через gateway (единый контракт) | Нет собственной БД | `apps/api-gateway/src/index.ts`, `apps/api-gateway/wrangler.toml` |
| `apps/auth-service` | Cloudflare Worker | `apps/auth-service/src/index.ts` | `POST /v1/auth/webhook/clerk`, `POST /v1/users/ensure`, `/health` | описано в `docs/openapi/openapi.bundle.yaml` (paths `/v1/auth/*`, `/v1/users/ensure`) | Использует `DATABASE_URL` + схемы `packages/db/src/schema/auth.ts` | `apps/auth-service/src/index.ts`, `packages/db/src/schema/auth.ts` |
| `apps/content-service` | Cloudflare Worker | `apps/content-service/src/index.ts` | Public content: `GET /v1/content/countries|cities|places|articles|events`, detail: `GET /v1/content/places/{idOrSlug}`, `GET /v1/content/articles/{slug}`, `GET /v1/content/events/{id}`, action: `POST /v1/content/events/{id}/register`, debug: `GET /v1/content/_debug/db` | описано в `docs/openapi/openapi.bundle.yaml` (paths `/v1/content/*`) + есть серверные helpers в `packages/sdk/src/content.ts` | Использует `DATABASE_URL` + схемы `packages/db/src/schema/content.ts` (+ миграции `packages/db/migrations/*`) | `apps/content-service/src/index.ts`, `packages/db/src/schema/content.ts`, `packages/db/migrations/*`, `packages/sdk/src/content.ts` |
| `apps/points-service` | Cloudflare Worker | `apps/points-service/src/index.ts` | User-facing: `GET /v1/points/balance`, `GET /v1/points/transactions`; internal: `POST /internal/points/add`; `/health` | описано в `docs/openapi/openapi.bundle.yaml` + hooks: `packages/sdk/src/balance.ts`, `packages/sdk/src/transactions.ts` | Использует `DATABASE_URL` + схемы `packages/db/src/schema/points.ts` (+ миграции) | `apps/points-service/src/index.ts`, `packages/db/src/schema/points.ts`, `packages/sdk/src/balance.ts` |
| `apps/referral-service` | Cloudflare Worker | `apps/referral-service/src/index.ts` | User-facing: `GET /v1/referral/code|stats|tree`, `POST /v1/referral/claim`; `/health` | описано в `docs/openapi/openapi.bundle.yaml` + hooks: `packages/sdk/src/referrals.ts` | Использует `DATABASE_URL` + схемы `packages/db/src/schema/referral.ts` (+ миграции) | `apps/referral-service/src/index.ts`, `packages/db/src/schema/referral.ts`, `packages/sdk/src/referrals.ts` |
| `apps/token-service` | Cloudflare Worker (skeleton) | `apps/token-service/src/index.ts` | Только `/health` (и 404 на остальные) | **Нет** API контрактов/SDK под “tokenomics” | Нет БД | `apps/token-service/src/index.ts` |

---

## 2) Shared backend packages (packages/*), влияющие на сервисы

- **`packages/db`**: единый пакет БД + Drizzle + миграции.
  - **Миграции**: `packages/db/migrations/*`
  - **Схемы по доменам**: `packages/db/src/schema/{auth,content,points,referral}.ts`
- **`packages/sdk`**: клиентский SDK (React Query hooks + server-safe helpers), который ходит в API Gateway.
  - Base URL/headers/auth: `packages/sdk/src/mutator.ts` + `packages/sdk/src/clerk-integration.ts`
  - Примеры реальных вызовов: `packages/sdk/src/balance.ts` (`/v1/points/balance`), `packages/sdk/src/referrals.ts` (`/v1/referral/*`), `packages/sdk/src/content.ts` (`/v1/content/*`)
- **`packages/logger`**: корреляция/`X-Request-Id` и структурный логинг (используется во всех воркерах).
- **`docs/openapi/openapi.bundle.yaml`**: фактический API контракт с реальными paths (в отличие от `docs/openapi/openapi.yaml`, где `paths: {}`).

---

## 3) Mapping: сервисы из `docs/knowledge/backend_microservice.md` → реализация в repo

Статусы:
- **Implemented**: есть сервис/эндпоинты и используется.
- **Partial**: есть часть функциональности или сервис “слит” в другой, или только M3/MVP.
- **Not started**: отсутствует в repo.
- **Deprecated**: описание/метаданные устарели и вводят в заблуждение.
- **Merged-into-other**: отдельного сервиса нет, обязанности покрываются другим компонентом.

### Core

| Service (docs) | Expected responsibilities | Repo implementation | Status | Evidence | Phase target | Decision & next action |
|---|---|---|---|---|---|---|
| User (Identity) Service | auth + базовый профиль/роль + выдача JWT | `apps/auth-service` + Clerk (SSO) | **Partial (Merged-into-other)** | `apps/auth-service/src/index.ts` (`/v1/users/ensure`), `packages/db/src/schema/auth.ts`, gateway routes `/v1/users/*` → auth | F1 | Зафиксировать, что отдельного `user-service` нет: “User Service = auth-service + Clerk” (см. ADR по терминологии, если нужно) |
| Guru Service | geo-агрегатор “рядом” | нет | **Not started** | нет `apps/guru-service` | F2 | Пометить как F2/Later; не учитывать как “реально существующий сервис” |

### Content

| Service (docs) | Expected responsibilities | Repo implementation | Status | Evidence | Phase target | Decision & next action |
|---|---|---|---|---|---|---|
| Atlas Service | страны/города/места | **слито** в `apps/content-service` (`/v1/content/countries|cities|places`) | **Partial (Merged-into-other)** | `apps/content-service/src/index.ts` (routes), `packages/db/src/schema/content.ts` | F1 | Явно отметить в docs: сейчас Atlas/Pulse/Blog реализованы как единый `content-service` |
| Pulse Service | события + регистрации | **слито** в `apps/content-service` (`/v1/content/events/*`, `/register`) | **Partial (Merged-into-other)** | `apps/content-service/src/index.ts` (event routes + register) | F1 | Аналогично: Pulse пока не отдельный сервис |
| Media Service (Blog) | статьи | **слито** в `apps/content-service` (`/v1/content/articles/*`) | **Partial (Merged-into-other)** | `apps/content-service/src/index.ts`, `packages/db/src/schema/content.ts` (articles) | F1 | Переименовать в тексте “Media Service” → “Blog (articles) в content-service” (или отметить как будущий разнос) |

### Social

| Service (docs) | Expected responsibilities | Repo implementation | Status | Evidence | Phase target | Decision & next action |
|---|---|---|---|---|---|---|
| Content Service (Space UGC) | UGC посты/репосты (social-first), без inline-комментов под контентом | нет (в repo `content-service` — это Atlas/Pulse/Blog, не Space) | **Not started + Naming conflict** | отсутствует `apps/space-service`; см. `apps/content-service` (контентный, не social) | F2 | Уточнить именование/границы: “Space Service” vs “content-service” (см. ADR по Space/Content/Feed/Reactions) |
| Feed Service | ленты Space | нет | **Not started** | нет | F2 | Планировать как часть Space backend |
| Reactions Service | реакции/репосты/ratings/threads (без inline) | нет | **Not started** | нет | F2 | Планировать; учесть ADR-0020 (social-first, без inline-комментов под объектами модулей) |

### Commerce

| Service (docs) | Expected responsibilities | Repo implementation | Status | Evidence | Phase target | Decision & next action |
|---|---|---|---|---|---|---|
| Rielt Service | жильё/листинги | нет | **Not started** | нет | F2/Later | Пометить как “Later” (если это не ранний скоуп) |
| Voucher Service | ваучеры RF | нет | **Not started** | нет | F2 | RF как capstone Ф2 → зависит от Space/Quest/Points |
| Russian Friendly (Partner) Service | RF партнёры/кабинеты/интеграции | нет | **Not started** | нет | F2 (capstone) | См. обновлённую RF-документацию `docs/modules/rf_partners/*` |

### Gamification

| Service (docs) | Expected responsibilities | Repo implementation | Status | Evidence | Phase target | Decision & next action |
|---|---|---|---|---|---|---|
| Quest Service | квесты/прогресс/награды | нет | **Not started** | нет | F2 | Планировать после Space core (и до RF capstone) |

### AI/ML

| Service (docs) | Expected responsibilities | Repo implementation | Status | Evidence | Phase target | Decision & next action |
|---|---|---|---|---|---|---|
| Recommendation Service | рекомендации/ранжирование | нет | **Not started** | нет | Later | Явно пометить как future |
| Content Moderation & Analysis | AI-модерация | нет | **Not started** | нет | Later | Явно пометить как future |

### Tokenomics

| Service (docs) | Expected responsibilities | Repo implementation | Status | Evidence | Phase target | Decision & next action |
|---|---|---|---|---|---|---|
| Token (Connect) Service | общий движок токеномики (Points + G2A + NFT + правила) | `apps/token-service` существует, но **только skeleton** | **Partial (skeleton only)** | `apps/token-service/src/index.ts` (`/health` only) | F2/Later | Разрулить терминологию Token/Points/Connect (см. ADR по терминологии) |
| Points Service | балансы/транзакции Points | `apps/points-service` | **Implemented** | endpoints `/v1/points/*` (см. `apps/points-service/src/index.ts`, `docs/openapi/openapi.bundle.yaml`) | F1 | Зафиксировать: фактически Points уже есть и используется UI через SDK |
| NFT Service | NFT бейджи | нет | **Not started** | нет | Later | future |
| Blockchain Gateway Service | TON mint/burn/transfer | нет | **Not started** | нет | Later | future |

### Technical

| Service (docs) | Expected responsibilities | Repo implementation | Status | Evidence | Phase target | Decision & next action |
|---|---|---|---|---|---|---|
| Notification Service | email/push/telegram | нет (как отдельный сервис) | **Not started** | нет | F2/Later | future |
| Logging & Analytics Service | централизованные логи/метрики | частично как пакеты/подход (logger + request id), но не сервис | **Partial (Merged-into-other)** | `packages/logger`, `X-Request-Id` в `packages/sdk/src/mutator.ts` | F1 | В docs разделять “компонент/инструменты” vs “отдельный микросервис” |

---

## 4) Терминология Token / Points / Connect (обязательная фиксация)

### Что **фактически реализовано**
- **Points**: реализовано как `apps/points-service` + таблицы `points_transactions`, `user_balances` (`packages/db/src/schema/points.ts`).
- **Connect (UI)**: использует Points через SDK:
  - `packages/sdk/src/balance.ts` → `GET /v1/points/balance`
  - `packages/sdk/src/transactions.ts` → `GET /v1/points/transactions`
- **Token Service**: как backend-движок токеномики **не реализован**; `apps/token-service` — только `/health`.

### Где встречается термин “Token Service”
- UI: `apps/go2asia-pwa-shell/components/connect/Wallet/WalletView.tsx` содержит комментарий “Загружаем баланс из Token Service”, хотя вызовы идут в `/v1/points/*`.
- Docs: `docs/knowledge/backend_microservice.md` и `docs/knowledge/go2asia_overview_structured.md` используют “Token (Connect) Service” как центральный компонент.

### План синхронизации терминов (без поломки API)
- **Сейчас**: считать SSOT по Points = `points-service`, а “Connect” = frontend-название модуля.
- **Документация**: пометить “Token (Connect) Service” как **Later / not started**, а “Points Service” как **Implemented**.
- **Совместимость API**: сохранить `/v1/points/*` как основной публичный контракт; не вводить `/v1/token/*` до появления реального tokenomics engine.
- **Нейминг**: не называть `apps/token-service` “реализованным Tokenomics сервисом”, пока он skeleton.

---

## 5) Space / Content / Feed / Reactions (обязательная фиксация)

Факт repo:
- В repo есть `apps/content-service`, но он обслуживает **Atlas/Pulse/Blog** (`/v1/content/*`) и **не** является Space backend.
- Space/Feed/Reactions сервисов в `apps/*` сейчас **нет**.
- Модель коммуникации: **social-first без inline-комментариев под объектами** (см. `docs/decisions/adr_0020_no_inline_comments_social_first.md`).

Решение для документации:
- В `docs/knowledge/backend_microservice.md` не трактовать `content-service` как “Space Content Service”.
- Для планирования Ф2 использовать “Space Service (UGC) / Feed / Reactions” как отдельный контур (пока Not started) и придерживаться social-first модели (репосты + реакции).




