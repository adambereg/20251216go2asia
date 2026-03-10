# Ops Runbooks

Короткий operational pack для `Step 1 MVP hardening`.

---

## 1. Gateway 5xx / Downstream Failure

### Признаки

- UI или клиент получает `5xx` от `api-gateway`
- в response headers есть `X-Request-ID`
- часто есть `X-Proxy-Target-Host` и `X-Proxy-Downstream-Status`

### Быстрые шаги

1. Зафиксировать `X-Request-ID`, `X-Proxy-Target-Host`, `X-Proxy-Downstream-Status`.
2. Проверить `GET /ready` у gateway.
3. Проверить `GET /ready` у downstream-сервиса, на который указывает `X-Proxy-Target-Host`.
4. Найти в логах gateway запись `Request completed` по `requestId`.
5. Найти по тому же `requestId` логи downstream-сервиса.

### Если причина — misconfig

- Если gateway возвращает `SERVICE_NOT_CONFIGURED`, значит отсутствует `*_SERVICE_URL` или related secret/var.
- Проверить vars/secrets в Cloudflare для нужного worker.
- После исправления повторить `GET /ready`.

---

## 2. Service Auth / Secret Misconfiguration

### Признаки

- ответы `401/503` с кодами:
  - `SERVICE_AUTH_NOT_CONFIGURED`
  - `ServiceAuthNotConfigured`
  - `UNAUTHORIZED`
- `ready` показывает `missing` в обязательных checks

### Быстрые шаги

1. Проверить `GET /ready` проблемного worker.
2. Сверить `SERVICE_JWT_SECRET`, `CLERK_JWT_SECRET`, `CLERK_WEBHOOK_SECRET`, `DATABASE_URL` и service URLs.
3. Проверить, не был ли задеплоен новый SHA без соответствующих env/secrets.
4. Если релиз только что был выполнен, откатить worker на предыдущий deploy.

### Что не делать

- не логировать реальные значения секретов
- не проверять токены вручную в логах

---

## 3. Clerk Webhook Failure

### Признаки

- `auth-service` отвечает `401`/`503` на `/v1/auth/webhook/clerk`
- в логах есть:
  - `Missing CLERK_WEBHOOK_SECRET`
  - `Missing Clerk webhook signature headers`
  - `Invalid Clerk webhook signature`

### Быстрые шаги

1. Проверить `GET /ready` у `auth-service`.
2. Убедиться, что `CLERK_WEBHOOK_SECRET` задан в нужном environment.
3. Проверить, что Clerk webhook направлен на корректный URL environment.
4. Повторить delivery из Clerk dashboard после исправления.

### Если проблема после релиза

- откатить `auth-service` до предыдущего deploy
- повторно проверить `users.ensure` и auth smoke

---

## 4. Database Incident / Degraded Readiness

### Признаки

- `ready` показывает `not_ready`
- request logs показывают рост `5xx`
- сервисы с БД падают на защищённых или data-backed routes

### Быстрые шаги

1. Проверить affected services:
   - `auth-service`
   - `content-service`
   - `points-service`
   - `referral-service`
2. Проверить `GET /ready` и последние `Request completed` логи.
3. Убедиться, что `DATABASE_URL` не потерян и не повреждён.
4. Если проблема связана с релизом:
   - откатить backend deploy
   - при необходимости откатить migration по заранее утверждённой процедуре

### Recovery decision

- если проблема только в коде релиза: rollback worker
- если проблема в схеме/данных: остановить rollout, перейти к DB recovery/PITR process

---

## 5. Release Checklist

Перед production promote:

1. `main` зелёный по `CI`.
2. `pnpm test:ci` зелёный.
3. staging deploy smoke/contract прошли.
4. обязательные vars/secrets заполнены.
5. есть понятный rollback path для Workers и frontend.

После production promote:

1. проверить artifact от `production smoke`
2. проверить `GET /ready` gateway
3. проверить базовые public routes
4. сохранить `requestId`, если есть аномалии в первые минуты после релиза
