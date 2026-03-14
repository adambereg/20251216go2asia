# Media E2E Staging Smoke Test

Автоматический E2E-сценарий для media flow в staging.

## Переменные окружения

| Переменная | Обязательная | Описание |
|------------|--------------|----------|
| `STAGING_GATEWAY_URL` | да | URL API gateway в staging |
| `STAGING_TEST_JWT` | да | JWT с Clerk session (владелец) |
| `STAGING_DATABASE_URL` | да | URL подключения к staging БД |
| `STAGING_TEST_JWT_ALT` | нет* | JWT другого пользователя (для теста non-owner 403) |
| `STAGING_ORIGIN` | нет | Origin для CORS (default: `https://20251216go2asia09.netlify.app`) |
| `CLERK_SECRET_KEY` | да** | backend secret для автоматического mint |
| `CLERK_INSTANCE_URL` | да** | базовый URL Clerk API (например `https://api.clerk.com`) |
| `CLERK_TEST_USER_OWNER` | да** | user id владельца для mint owner token |
| `CLERK_TEST_USER_ALT` | да** | user id alternate пользователя для mint alt token |
| `MEDIA_E2E_MODE` | нет | `full` (default) или `allow_skips` |
| `MEDIA_E2E_ATTACH_OWNER_TYPE` | нет | `space_post` (default) |
| `MEDIA_E2E_ATTACH_OWNER_ID` | нет | `post_step3_001` (default) |
| `MEDIA_E2E_ATTACH_USAGE_TYPE` | нет | `hero_image` (default) |
| `MEDIA_E2E_ATTACH_SLOT` | нет | `cover` (default) |
| `MEDIA_E2E_ONLY_STEP7` | нет | `true` — запустить только шаг 7 |
| `MEDIA_E2E_MEDIA_ID` | нет | media_id для режима `MEDIA_E2E_ONLY_STEP7=true` (если не задан — берётся из `.tmp/media_e2e_last_id`) |

\* В режиме `MEDIA_E2E_MODE=full` переменная `STAGING_TEST_JWT_ALT` фактически обязательна.
\* В `MEDIA_E2E_ONLY_STEP7=true` при отсутствии `MEDIA_E2E_MEDIA_ID` скрипт читает `.tmp/media_e2e_last_id`.
\** Обязательно для `pnpm smoke:media:e2e` (автоматический mint JWT), не нужно для ручного debug режима.

## Запуск

Автоматический mint + запуск e2e:

```bash
export STAGING_GATEWAY_URL="https://go2asia-api-gateway-staging.fred89059599296.workers.dev"
export STAGING_DATABASE_URL="postgresql://..."
export CLERK_SECRET_KEY="sk_..."
export CLERK_INSTANCE_URL="https://api.clerk.com"
export CLERK_TEST_USER_OWNER="user_..."
export CLERK_TEST_USER_ALT="user_..."

pnpm smoke:media:e2e
```

Ручной debug запуск (env fallback JWT):

```bash
export STAGING_GATEWAY_URL="https://go2asia-api-gateway-staging.fred89059599296.workers.dev"
export STAGING_TEST_JWT="eyJhbGciOiJSUzI1NiI..."   # свежий Clerk session token
export STAGING_DATABASE_URL="postgresql://..."     # staging DB

pnpm smoke:media:e2e:staging
```

Или напрямую:

```bash
node scripts/media_e2e_staging.mjs
```

## Выполняемые шаги

1. **POST /v1/media/upload-token** — получение upload token
2. **PUT upload** — загрузка тестового файла (8 байт)
3. **SELECT media_id** — выборка `id` из `media_assets` по `key` (через pg)
4. **GET /v1/media/:mediaId** — проверка метаданных
5. **POST /v1/media/:mediaId/attach** — attach от владельца
6. **POST attach (idempotent)** — повторный attach, ожидаем успех
7. **POST attach (non-owner)** — attach от другого пользователя, ожидаем 403
8. **SELECT media_usage** — проверка, что ровно 1 активная строка **для точного tuple**:
   `media_id + owner_type + owner_id + usage_type + slot + deleted_at IS NULL`

## Ожидаемый вывод при успехе

```
--- Media E2E Staging ---
Gateway: https://go2asia-api-gateway-staging....
Origin:  https://20251216go2asia09.netlify.app

--- 1. POST /v1/media/upload-token ---
  [OK] status=200 key=uploads/content/user_xxx/...

--- 2. PUT upload to uploadUrl ---
  [OK] status=201 key=...

--- 3. SELECT media_id from media_assets ---
  [OK] media_id=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

--- 4. GET /v1/media/:mediaId ---
  [OK] status=200 media_id=...

--- 5. POST attach (owner) ---
  [OK] status=200 status=attached

--- 6. POST attach (idempotent) ---
  [OK] status=200 idempotent ok

--- 7. POST attach (non-owner) expect 403 ---
  [OK] status=403 (expected for non-owner)

--- 8. SELECT media_usage (exact active tuple) ---
  [OK] active tuple rows=1

--- PASS: Media E2E staging flow completed ---
```

## Ожидаемый вывод при ошибке

```
[FAIL] Expected 200, got 401
  requestId=...
  body={"error":{"code":"UNAUTHORIZED","message":"..."}}
```

Для transport-сбоев на шаге 7 (например `ECONNRESET`) вывод будет явным:

```
[FAIL] Step 7 transport failure: request did not reach ACL check
  body={"kind":"transport_failure","name":"TypeError","message":"fetch failed","code":"ECONNRESET",...}
```

Если не удалось заминтить токены Clerk:

```
[FAIL] Clerk token minting failed
```

Если не найден предыдущий `media_id` для step7-only:

```
[FAIL] No previous media_id found. Run full media_e2e first.
```

## Exit code

- `0` — успех
- `1` — ошибка любого шага

## Важно

- JWT должен быть **свежим** (Clerk session TTL ~1h). Запускайте скрипт вскоре после получения токена.
- По умолчанию сценарий attach — **domain-level** (`space_post/post_step3_001/hero_image/cover`).
- Скрипт **не удаляет** данные из БД — только создаёт тестовую запись.
- Используется Node.js `pg`, а не shell-команда `psql`.

## Повтор только шага 7

Если нужно быстро перепроверить только non-owner ACL:

```bash
export STAGING_GATEWAY_URL="https://go2asia-api-gateway-staging.fred89059599296.workers.dev"
export STAGING_TEST_JWT_ALT="eyJhbGciOiJSUzI1NiI..."   # другой пользователь
export MEDIA_E2E_ONLY_STEP7=true
export MEDIA_E2E_MEDIA_ID="f30bc5cd-6ca4-4825-a60d-171021126474"

pnpm smoke:media:e2e:staging
```

Теперь `MEDIA_E2E_MEDIA_ID` можно не задавать, если до этого был успешный полный прогон.
Скрипт автоматически читает последнее значение из:

```
.tmp/media_e2e_last_id
```

Удобный helper-командлет для Windows/PowerShell:

```powershell
pnpm smoke:media:e2e:step7
```

Он:
- спросит свежий ALT JWT через `Read-Host`
- запустит только шаг 7
- автоматически подставит `media_id` из `.tmp/media_e2e_last_id`
