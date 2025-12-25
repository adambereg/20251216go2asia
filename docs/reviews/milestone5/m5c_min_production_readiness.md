# Milestone 5C-min — Production Readiness (MVP)

**Дата:** 2025-12-25  
**Scope:** только документация (без кода/новых процессов)  

## 0) Контекст и “как есть сейчас” (факты из репо)

### Сервисы (Cloudflare Workers)

По `apps/*/wrangler.toml`:
- `go2asia-api-gateway` (`apps/api-gateway`)
- `go2asia-auth-service` (`apps/auth-service`)
- `go2asia-content-service` (`apps/content-service`)
- `go2asia-points-service` (`apps/points-service`)
- `go2asia-referral-service` (`apps/referral-service`)
- `go2asia-token-service` (`apps/token-service`, skeleton)

### Frontend (Netlify)

По `apps/go2asia-pwa-shell/netlify.toml`:
- сборка: `pnpm turbo build --filter=@go2asia/pwa-shell`
- Next.js plugin: `@netlify/plugin-nextjs`
- `NEXT_PUBLIC_API_URL` задаётся через Netlify contexts (в файле явно задан для staging/preview; production обычно задаётся в Netlify UI).

### Staging deploy (CI)

По `.github/workflows/deploy-workers-staging.yml`:
- деплой в staging автоматизирован (wrangler deploy `--env staging`)
- деплой разрешён из любых веток (staging = интеграционная среда)
- smoke check делает `GET /health` (или `/version` или `/`) и ожидает `200`.

### requestId / заголовки

По `packages/logger/src/index.ts`:
- `requestId` берётся из `X-Request-ID` (если есть) или генерируется (`Date.now()` + random).

По `apps/api-gateway/src/index.ts`:
- gateway всегда выставляет `X-Request-ID` в ответ
- gateway добавляет диагностические headers:
  - `X-Proxy-Target-Host`, `X-Proxy-Target-Path`, `X-Proxy-Downstream-Status`, `X-Proxy-Downstream-Content-Type`
- early ошибки (включая `SERVICE_NOT_CONFIGURED`) возвращают JSON + `X-Request-ID` + CORS.

## 1) Release & rollback (production) — минимальная инструкция

> В репозитории **нет** готового workflow для production deploy Workers. Это “как есть сейчас”.

### Release — минимальный порядок действий (prod)

1) **Pre-flight**
   - убедиться, что `main` зелёный по GitHub Actions `CI` (lint/typecheck/test/build/openapi/gen).
   - убедиться, что staging “живой” (можно прогнать `API Smoke (staging)` и/или contract tests вручную).

2) **Backend (Cloudflare Workers)**
   - деплоить downstream сервисы **до** gateway:
     - `go2asia-auth-service`
     - `go2asia-content-service`
     - `go2asia-points-service`
     - `go2asia-referral-service`
     - `go2asia-token-service` (если используется)
   - затем деплоить `go2asia-api-gateway`

3) **Frontend (Netlify)**
   - убедиться, что production environment в Netlify задан корректно (см. checklist ниже).
   - выполнить production deploy (как принято в проекте: через Netlify UI/auto-deploy из `main`).

4) **Post-deploy smoke (prod)**
   - `GET https://api.go2asia.space/health` → 200
   - `GET https://api.go2asia.space/v1/content/events?limit=1` → 200
   - `GET https://api.go2asia.space/v1/content/articles?limit=1` → 200
   - открыть UI и убедиться, что базовые публичные страницы грузятся без ошибок.

### Rollback — минимальный и быстрый (prod)

**Backend (Cloudflare Workers):**
- в Cloudflare Dashboard → Workers & Pages → нужный worker → Deployments → выбрать предыдущий деплой → Rollback.
- после rollback повторить `GET /health` на gateway и ключевых downstream сервисах.

**Frontend (Netlify):**
- Netlify → Deploys → выбрать предыдущий успешный deploy → Publish deploy.

## 2) Prod env & secrets checklist (минимум)

### Общие секреты/переменные (из `.env.example`)

- **Cloudflare**
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_API_TOKEN` (секрет, CI)
  - `CLOUDFLARE_R2_BUCKET` (если используется media)
- **Neon**
  - `DATABASE_URL` (секрет)
- **Clerk**
  - `CLERK_PUBLISHABLE_KEY` (frontend)
  - `CLERK_SECRET_KEY` (секрет, backend интеграции/вебхуки)
- **Domains**
  - `API_BASE_URL=https://api.go2asia.space`
  - `AUTH_SERVICE_URL=https://auth.go2asia.space`
  - `CONTENT_SERVICE_URL=https://content.go2asia.space`
  - `TOKEN_SERVICE_URL=https://token.go2asia.space`

> Примечание: реальные привязки доменов/роутинг зависят от Cloudflare/Netlify конфигурации. Это чек-лист “что должно быть задано”, а не описание DNS.

### Переменные/секреты Workers (из `wrangler.toml` + `Env` интерфейсов)

**API Gateway (`apps/api-gateway`)**
- Vars:
  - `AUTH_SERVICE_URL`
  - `CONTENT_SERVICE_URL`
  - `POINTS_SERVICE_URL`
  - `REFERRAL_SERVICE_URL`
  - `ENVIRONMENT=production`
  - `VERSION=<git sha>`
- Secrets:
  - `CLERK_JWT_SECRET`
  - `SERVICE_JWT_SECRET`

**Auth Service (`apps/auth-service`)**
- Vars:
  - `POINTS_SERVICE_URL`
  - `REFERRAL_SERVICE_URL`
  - `ENVIRONMENT=production`
  - `VERSION=<git sha>`
- Secrets:
  - `SERVICE_JWT_SECRET`
  - `CLERK_WEBHOOK_SECRET` (если включена проверка подписи)
  - `DATABASE_URL` (фактически нужен для `POST /v1/users/ensure` и интеграций)

**Content Service (`apps/content-service`)**
- Vars:
  - `POINTS_SERVICE_URL`
  - `ENVIRONMENT=production`
  - `VERSION=<git sha>`
- Secrets:
  - `SERVICE_JWT_SECRET`
  - `DATABASE_URL`

**Points Service (`apps/points-service`)**
- Vars (optional):
  - `POINTS_VELOCITY_CAP`
  - `POINTS_VELOCITY_WINDOW_SECONDS`
  - `ENVIRONMENT=production`
  - `VERSION=<git sha>`
- Secrets:
  - `SERVICE_JWT_SECRET`
  - `DATABASE_URL`

**Referral Service (`apps/referral-service`)**
- Vars:
  - `POINTS_SERVICE_URL` (для бонуса)
  - `REFERRAL_FIRST_LOGIN_BONUS` (опционально; по коду есть default=100)
  - `ENVIRONMENT=production`
  - `VERSION=<git sha>`
- Secrets:
  - `SERVICE_JWT_SECRET`
  - `DATABASE_URL`

**Token Service (`apps/token-service`)**
- Vars:
  - `ENVIRONMENT=production`
  - `VERSION=<git sha>`
- Secrets: нет (skeleton)

### Frontend (Netlify prod)

Минимально проверить наличие:
- `NEXT_PUBLIC_API_URL` = production gateway base URL
- `NEXT_PUBLIC_DATA_SOURCE=api`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (или эквивалент, используемый приложением)

## 3) Logging & requestId — как искать инциденты (минимум)

### Как получить requestId

- Любой ответ gateway должен содержать `X-Request-ID`.
- В UI (Network) requestId можно увидеть в response headers (и в JSON ошибках как `requestId`).

### Как быстро локализовать “где сломалось”

1) Сначала проверить, что это gateway или downstream:
   - посмотреть `X-Proxy-Downstream-Status`
   - посмотреть `X-Proxy-Target-Host` и `X-Proxy-Target-Path`

2) Если `SERVICE_NOT_CONFIGURED`:
   - это misconfig: отсутствует `*_SERVICE_URL` var у gateway (см. `apps/api-gateway/src/index.ts`).

3) В логах сервисов:
   - искать по `requestId` (все сервисы используют `@go2asia/logger` и вкладывают `requestId` в JSON context).

### Что НЕ логируем (MVP правило)

- токены (Authorization, service JWT)
- `DATABASE_URL`, `CLERK_*_SECRET*`, `SERVICE_JWT_SECRET`, `CLERK_JWT_SECRET`

## 4) Known limitations MVP (честно)

> Это список “как есть сейчас” — без попытки исправлять в рамках M5C.

- **Нет автоматизированного production deploy workflow** для Workers (только staging). Prod deploy/rollback предполагается вручную через Cloudflare/Netlify UI.
- **F5/500 error handling**: принудительная симуляция 500 не покрыта без изменения окружения (зафиксировано в M5A).
- **Media/R2 в контенте**: в текущих публичных событиях `imageUrl` может быть `null` (зафиксировано в M5A).
- **Offline support**: отложен для MVP (см. ADR-0019).
- **Token service**: skeleton (health-only), не закрывает продуктовую ценность.
- **Observability/alerts/monitoring**: отсутствуют (осознанно, не part of MVP).
- **Единый SERVICE_JWT_SECRET** используется между сервисами (проще для MVP, но риск при компрометации).

## 5) Go / No-Go checklist (prod)

### Go (выпускаем), если ВСЁ выполнено

- **CI (main) зелёный**: openapi lint + typecheck + test + build + validate-generated-types
- **Prod env/secrets заполнены** по разделу (2) во всех Workers + Netlify prod
- **Post-deploy smoke** проходит:
  - `/health` gateway = 200
  - `GET /v1/content/events?limit=1` = 200
  - `GET /v1/content/articles?limit=1` = 200
- **Auth smoke (ручной)**:
  - sign-in проходит
  - Connect показывает баланс/рефералку без DEMO MODE
- **Rollback готов** (проверено, что видно предыдущие деплои в Cloudflare/Netlify)

### No-Go (не выпускаем), если есть хоть один пункт

- отсутствует любой из критичных secrets/vars (gateway routing/auth/DB)
- `SERVICE_NOT_CONFIGURED` на gateway в prod
- CI красный на `main`
- post-deploy smoke не проходит

## 6) Подтверждение факта (что проверено при подготовке документа)

- В репозитории присутствуют:
  - staging deploy workflow: `.github/workflows/deploy-workers-staging.yml`
  - CI workflow: `.github/workflows/ci.yml`
  - requestId/logging: `packages/logger/src/index.ts`, `apps/api-gateway/src/index.ts`
  - production targets в `wrangler.toml` (секция `[env.production]`) для всех Workers
  - frontend deploy config: `apps/go2asia-pwa-shell/netlify.toml`

