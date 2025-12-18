## Staging services overview (source of truth)

Этот документ фиксирует текущее состояние staging окружения Go2Asia: какие Cloudflare Workers существуют, как до них достучаться по HTTP и какие переменные/секреты обязательны.

### Таблица сервисов (staging)

| Service | Worker name | URL (staging) | Required env vars | Notes |
|---|---|---|---|---|
| api-gateway | `go2asia-api-gateway-staging` | `https://go2asia-api-gateway-staging.fred89059599296.workers.dev` | `ENVIRONMENT`, `SERVICE_JWT_SECRET`, `DATABASE_URL` (если используется), `AUTH_SERVICE_URL`, `CONTENT_SERVICE_URL`, `REFERRAL_SERVICE_URL`, `POINTS_SERVICE_URL` | В репо: `apps/api-gateway`. Проксирует downstream по `/v1/*`. Health: `GET /health` (без auth/БД). |
| auth-service | `go2asia-auth-service-staging` | `https://go2asia-auth-service-staging.fred89059599296.workers.dev` | `ENVIRONMENT`, `SERVICE_JWT_SECRET`, `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` | В Cloudflare существует, но **кода в репо сейчас нет** (`apps/auth-service` отсутствует) → workflow деплоя пропускает deploy и делает только smoke-check по URL. |
| content-service | `go2asia-content-service-staging` | `https://go2asia-content-service-staging.fred89059599296.workers.dev` | `ENVIRONMENT`, `SERVICE_JWT_SECRET`, `DATABASE_URL` | В Cloudflare существует, но **кода в репо сейчас нет** (`apps/content-service` отсутствует) → workflow деплоя пропускает deploy и делает только smoke-check по URL. |
| referral-service | `go2asia-referral-service-staging` | `https://go2asia-referral-service-staging.fred89059599296.workers.dev` | `ENVIRONMENT`, `SERVICE_JWT_SECRET`, `DATABASE_URL`, `CLERK_SECRET_KEY` | В Cloudflare существует, но **кода в репо сейчас нет** (`apps/referral-service` отсутствует) → workflow деплоя пропускает deploy и делает только smoke-check по URL. |
| token-service | `go2asia-token-service-staging` | `https://go2asia-token-service-staging.fred89059599296.workers.dev` | `ENVIRONMENT`, `SERVICE_JWT_SECRET`, `DATABASE_URL`, `CLERK_SECRET_KEY` | В Cloudflare существует, но **кода в репо сейчас нет** (`apps/token-service` отсутствует) → workflow деплоя пропускает deploy и делает только smoke-check по URL. |

### API Gateway → downstream proxy (staging)

Ожидаемые маршруты проксирования (через `go2asia-api-gateway-staging`):

- `/v1/auth/*` → `AUTH_SERVICE_URL`
- `/v1/content/*` → `CONTENT_SERVICE_URL`
- `/v1/referral/*` → `REFERRAL_SERVICE_URL`
- `/v1/points/*` → `POINTS_SERVICE_URL`

### Smoke check policy (GitHub Actions)

Workflow `Deploy Workers (staging)` проверяет, что каждый Worker доступен по HTTP и отвечает `200` как минимум на одном из путей:

- `GET /health` (предпочтительно)
- `GET /version` (fallback)
- `GET /` (fallback)

Если ни один из путей не возвращает `200`, job падает ❌

### Observability (Cloudflare, staging)

Требование: runtime ошибки должны быть видны в Cloudflare Dashboard.

- Включить **Workers Logs** для каждого staging Worker в Cloudflare UI (Workers & Pages → конкретный Worker → Observability/Logs).
- Минимальная проверка:
  - вызвать `GET /health` на `api-gateway` (и/или любой endpoint сервиса),
  - убедиться, что запрос и возможные ошибки отображаются в логах.

Связанные документы:
- `docs/ops/environments.md`
- `docs/ops/cloudflare_setup.md`
- `docs/ops/logging.md`

