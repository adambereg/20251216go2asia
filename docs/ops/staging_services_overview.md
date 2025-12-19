## Staging services overview (source of truth)

Этот документ фиксирует текущее состояние staging окружения Go2Asia: какие Cloudflare Workers существуют, как до них достучаться по HTTP и какие переменные/секреты обязательны.

### Таблица сервисов (staging)

| Service | Worker name | URL (staging) | Required env vars | Notes |
|---|---|---|---|---|
| api-gateway | `go2asia-api-gateway-staging` | `https://go2asia-api-gateway-staging.fred89059599296.workers.dev` | `ENVIRONMENT`, `SERVICE_JWT_SECRET`, `CLERK_JWT_SECRET` (для проверки user JWT), `DATABASE_URL` (если используется), `AUTH_SERVICE_URL`, `CONTENT_SERVICE_URL`, `REFERRAL_SERVICE_URL`, `POINTS_SERVICE_URL` | В репо: `apps/api-gateway`. Проксирует downstream по `/v1/*`. Для `/v1/points/*` и `/v1/referral/*` добавляет `X-Gateway-Auth` и `X-User-ID`. Health: `GET /health` (без auth/БД). |
| auth-service | `go2asia-auth-service-staging` | `https://go2asia-auth-service-staging.fred89059599296.workers.dev` | `ENVIRONMENT`, `VERSION`, `POINTS_SERVICE_URL`, `REFERRAL_SERVICE_URL`, `SERVICE_JWT_SECRET` (+ опционально `CLERK_WEBHOOK_SECRET`, `DATABASE_URL`) | В репо: `apps/auth-service`. Обрабатывает Clerk webhooks (`POST /v1/auth/webhook/clerk`). Интегрируется с Points (registration/first_login) и Referral (generate code). Health: `GET /health`. |
| content-service | `go2asia-content-service-staging` | `https://go2asia-content-service-staging.fred89059599296.workers.dev` | `ENVIRONMENT`, `VERSION`, `POINTS_SERVICE_URL`, `SERVICE_JWT_SECRET`, `DATABASE_URL` | В репо: `apps/content-service`. Регистрация на события (`POST /v1/content/events/{id}/register`). Интегрируется с Points (event_registration). Health: `GET /health`. |
| points-service | `go2asia-points-service-staging` | `https://go2asia-points-service-staging.fred89059599296.workers.dev` | `ENVIRONMENT`, `VERSION`, `DATABASE_URL`, `SERVICE_JWT_SECRET` (+ опционально `POINTS_VELOCITY_CAP`, `POINTS_VELOCITY_WINDOW_SECONDS`) | В репо: `apps/points-service`. Требует gateway-origin auth (`X-Gateway-Auth`) для user endpoints. Health: `GET /health`. |
| referral-service | `go2asia-referral-service-staging` | `https://go2asia-referral-service-staging.fred89059599296.workers.dev` | `ENVIRONMENT`, `VERSION`, `DATABASE_URL`, `SERVICE_JWT_SECRET` | В репо: `apps/referral-service`. Требует gateway-origin auth (`X-Gateway-Auth`) для user endpoints. Health: `GET /health`. |
| token-service | `go2asia-token-service-staging` | `https://go2asia-token-service-staging.fred89059599296.workers.dev` | `ENVIRONMENT`, `VERSION` | В репо: `apps/token-service` (пока skeleton). Health: `GET /health`. |

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



