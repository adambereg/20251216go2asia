# Milestone 5B-min — Testing (scope-guarded)

**Дата:** 2025-12-25  
**Статус:** Implemented (M5B-min)  

## Scope (строго)

1) **Contract tests**: только public `GET /v1/content/*` по `docs/openapi/openapi.bundle.yaml` против **staging gateway**.  
2) **Unit tests**: ровно 2 теста:
   - points idempotency по `external_id` / `externalId`
   - referral bonus trigger “один раз” (через mock points + стабильный `externalId`)
3) **API smoke job**: 2 публичных GET + (опционально) 1 auth POST/GET **только если** есть тестовый JWT в secret.

Без UI E2E, без Clerk flows в тестах, без расширения покрытия.

## Unit tests (2/2) — запускаются в PR CI

Эти тесты запускаются через существующий `pnpm test` (turbo) в `.github/workflows/ci.yml`.

Локальный запуск:

```bash
pnpm --filter @go2asia/points-service test
pnpm --filter @go2asia/referral-service test
```

Файлы:
- `apps/points-service/test/idempotency_external_id.test.ts`
- `apps/referral-service/test/bonus_trigger_once.test.ts`

## Contract tests (public content) — workflow_dispatch

Скрипт (локально):

```bash
node scripts/contract/content_public_contract.mjs
```

Лимиты/таймауты (зафиксированы в скрипте):
- **endpoints**: ровно 8 operationId (scope guard)
- **maxCasesPerEndpoint**: 1
- **request timeout**: 12s
- **retry**: 1 раз только при timeout/network (status=0)

Workflow:
- `.github/workflows/contract-tests-content-staging.yml`

Запуск вручную в GitHub Actions:
- `Contract Tests (Content public, staging)`
- input: `staging_gateway_url` (по умолчанию staging gateway)

## API Smoke (staging) — workflow_dispatch

Workflow:
- `.github/workflows/api-smoke-staging.yml`

Что делает:
- Public GET #1: `GET /v1/content/events?limit=1`
- Public GET #2: `GET /v1/content/articles?limit=1`
- Optional auth: `POST /v1/users/ensure` **только если** задан secret `STAGING_TEST_JWT`

Secret:
- `STAGING_TEST_JWT`: Clerk JWT тестового пользователя для staging (если не задан — auth шаг пропускается).



