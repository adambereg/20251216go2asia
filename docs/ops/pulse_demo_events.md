# Pulse demo events (staging)

**Цель:** обеспечить ручную проверку страницы `/pulse/[id]` и кнопки регистрации на событие через API Gateway в **staging**.

## Gateway URL (staging)

- `NEXT_PUBLIC_API_URL=https://go2asia-api-gateway-staging.fred89059599296.workers.dev`

## Seed (staging Neon)

Seed **идемпотентный** (повторный запуск не создаёт дубликаты) и **не должен** запускаться на production.

### Запуск (PowerShell)

```powershell
$env:STAGING_DATABASE_URL="<ваш neon staging url>";
pnpm --dir packages/db db:seed:pulse
```

### Запуск (bash)

```bash
export STAGING_DATABASE_URL="<ваш neon staging url>"
pnpm --dir packages/db db:seed:pulse
```

## Доступные demo event IDs

- `e7f8b7d4-6f6a-4f1e-9aa0-2d4dbaac7b10`
- `5b531b8d-8c7a-4fe8-b389-62e2f8d1d8a3`
- `0a4b18e5-3c2d-4a06-8c42-93a8a2c84b67`

## Проверка в браузере

Примеры:
- `/pulse/e7f8b7d4-6f6a-4f1e-9aa0-2d4dbaac7b10`
- `/pulse/5b531b8d-8c7a-4fe8-b389-62e2f8d1d8a3`
- `/pulse/0a4b18e5-3c2d-4a06-8c42-93a8a2c84b67`

## API endpoints

- `GET /v1/content/events/{id}` — публичный (используется страницей `/pulse/[id]`)
- `POST /v1/content/events/{id}/register` — требует авторизации (Clerk → gateway)
