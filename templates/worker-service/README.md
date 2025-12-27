# Cloudflare Worker service template (Go2Asia)

Этот шаблон используется для Milestone **2.0 — Foundations / Service Readiness** (см. `docs/plans/phase2_delivery_plan.md`).

Цель: чтобы новые сервисы Фазы 2 (`space-service`, `quest-service`, `rielt-service`, `guru-service`, `rf-service`) создавались **одинаково**, с одинаковыми базовыми контрактами:
- `/health` и `/version`
- `X-Request-ID`
- структурный логинг через `@go2asia/logger`

> Важно: это **шаблон**, не “реальный сервис”. Он не входит в `pnpm-workspace.yaml` и не деплоится.

## Как создать новый сервис (когда наступит его milestone)

1) Скопировать шаблон в `apps/<service-name>`:

- `templates/worker-service` → `apps/space-service` (пример)

2) Обновить:
- `package.json`: `name`, `description`
- `wrangler.toml`: `name` / `env.staging.name` / `env.production.name`
- `src/index.ts`: константу `SERVICE_NAME`

3) Добавить переменную окружения в `apps/api-gateway`:
- `<SERVICE>_SERVICE_URL` (например `SPACE_SERVICE_URL`)

4) Добавить OpenAPI-спеку сервиса:
- `docs/openapi/<service>.yaml`
- включить файл в `scripts/openapi_bundle.mjs` (список `SERVICE_SPECS`)

5) Добавить SDK слой (когда появятся реальные endpoints):
- `packages/sdk/src/*` (hooks/helpers), следуя существующему паттерну `mutator.ts`


