## Milestone 2 — reproducible backend (source of truth)

Цель Milestone 2: **все 5 staging Workers должны деплоиться из исходников в репозитории**, без зависимости от “наследия” прошлой итерации (ручной код/конфиг в Cloudflare).

Ограничения:
- Production не трогаем.
- Публичные API не меняем, кроме добавления/унификации `GET /health` (и опционально `GET /version`).

### 1) Структура папок (workers source layout)

На текущий момент backend Workers находятся в `apps/` (исторически так сложилось в репозитории; `api-gateway` уже лежит там и деплоится из `apps/api-gateway`).

| Service | Path in repo | Entry point | Wrangler config |
|---|---|---|---|
| api-gateway | `apps/api-gateway` | `src/index.ts` | `wrangler.toml` |
| auth-service | `apps/auth-service` | `src/index.ts` | `wrangler.toml` |
| content-service | `apps/content-service` | `src/index.ts` | `wrangler.toml` |
| referral-service | `apps/referral-service` | `src/index.ts` | `wrangler.toml` |
| token-service | `apps/token-service` | `src/index.ts` | `wrangler.toml` |
| points-service | `apps/points-service` | `src/index.ts` | `wrangler.toml` |

### 2) Health endpoint contract (uniform)

Для **каждого** воркера обязателен эндпоинт:

- `GET /health` (без auth, без БД, всегда 200)

Формат ответа:

```json
{ "service": "<name>", "env": "staging", "status": "ok", "version": "<sha-or-version>" }
```

Примечания:
- `version` устанавливается через CI (`wrangler deploy --var VERSION:<sha>`).
- `env` устанавливается через CI (`--var ENVIRONMENT:staging`).
- Допускается поддержка `GET /version` как alias на `GET /health`.

### 3) Required vars / secrets / bindings (staging)

Минимальные vars, обязательные для всех сервисов (ставятся CI):
- `ENVIRONMENT` — значение `staging`
- `VERSION` — git sha деплоя

Дополнительные переменные/секреты зависят от реализации сервиса и управляются в Cloudflare Dashboard (staging окружение).

**api-gateway**
- Vars:
  - `ENVIRONMENT`, `VERSION`
  - `AUTH_SERVICE_URL`, `CONTENT_SERVICE_URL`, `REFERRAL_SERVICE_URL`, `POINTS_SERVICE_URL`
- Secrets:
  - `SERVICE_JWT_SECRET` (gateway-origin auth + service-to-service auth)
  - `CLERK_JWT_SECRET` (для проверки user JWT, если используется HS256)

**auth-service**
- Required (M3):
  - Vars: `ENVIRONMENT`, `VERSION`
  - Vars: `POINTS_SERVICE_URL`, `REFERRAL_SERVICE_URL`
  - Secret: `SERVICE_JWT_SECRET`
  - (опционально): `CLERK_WEBHOOK_SECRET`, `DATABASE_URL`

**content-service**
- Required (M3):
  - Vars: `ENVIRONMENT`, `VERSION`
  - Var: `POINTS_SERVICE_URL`
  - Secret: `SERVICE_JWT_SECRET`
  - Var/Secret: `DATABASE_URL` (для event_registrations)

**token-service**
- Сейчас в репо представлена skeleton-версия, которая требует только:
  - `ENVIRONMENT`, `VERSION`
- По мере реализации сюда будут добавляться обязательные secrets/bindings — фиксировать изменения в этом документе.

**points-service**
- Required:
  - Vars: `ENVIRONMENT`, `VERSION`
  - Var/Secret: `DATABASE_URL`
  - Secret: `SERVICE_JWT_SECRET`
  - (опционально, vars): `POINTS_VELOCITY_CAP`, `POINTS_VELOCITY_WINDOW_SECONDS`

**referral-service**
- Required:
  - Vars: `ENVIRONMENT`, `VERSION`
  - Var/Secret: `DATABASE_URL`
  - Secret: `SERVICE_JWT_SECRET`

### 4) Локальный запуск (wrangler dev, staging-like)

Из корня репо:

```powershell
pnpm --dir apps/api-gateway exec wrangler dev --env staging
pnpm --dir apps/auth-service exec wrangler dev --env staging
pnpm --dir apps/content-service exec wrangler dev --env staging
pnpm --dir apps/points-service exec wrangler dev --env staging
pnpm --dir apps/referral-service exec wrangler dev --env staging
pnpm --dir apps/token-service exec wrangler dev --env staging
```

Рекомендация: для локального запуска использовать `.dev.vars` в папке сервиса (не коммитится) или Cloudflare Dashboard vars/secrets.

### 5) CI/CD policy (staging)

Workflow: `.github/workflows/deploy-workers-staging.yml`

Требования:
- deploy запускается на `push` в `main`;
- deploy **не должен** silently-skip отсутствующие папки (если сервис отсутствует в репо — это ошибка);
- после деплоя выполняется smoke-check на `workers.dev` URL и ожидается HTTP 200.

Связанные документы:
- `docs/ops/environments.md`
- `docs/ops/cloudflare_setup.md`
- `docs/ops/staging_services_overview.md`



