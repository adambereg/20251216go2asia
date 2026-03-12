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
| `MEDIA_E2E_MODE` | нет | `full` (default) или `allow_skips` |
| `MEDIA_E2E_ATTACH_OWNER_TYPE` | нет | `space_post` (default) |
| `MEDIA_E2E_ATTACH_OWNER_ID` | нет | `post_step3_001` (default) |
| `MEDIA_E2E_ATTACH_USAGE_TYPE` | нет | `hero_image` (default) |
| `MEDIA_E2E_ATTACH_SLOT` | нет | `cover` (default) |

\* В режиме `MEDIA_E2E_MODE=full` переменная `STAGING_TEST_JWT_ALT` фактически обязательна.

## Запуск

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

## Exit code

- `0` — успех
- `1` — ошибка любого шага

## Важно

- JWT должен быть **свежим** (Clerk session TTL ~1h). Запускайте скрипт вскоре после получения токена.
- По умолчанию сценарий attach — **domain-level** (`space_post/post_step3_001/hero_image/cover`).
- Скрипт **не удаляет** данные из БД — только создаёт тестовую запись.
- Используется Node.js `pg`, а не shell-команда `psql`.
