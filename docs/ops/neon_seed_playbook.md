# Neon seed playbook (PR#2)

Цель: поднять базу на **чистой Neon branch** → применить миграции → залить демо-контент из UI-моков, чтобы UI работал в режиме `NEXT_PUBLIC_DATA_SOURCE=api`.

## 1) Подготовить чистую ветку Neon

1. В Neon создайте новую branch от `go2asia-staging`, например: `dev-m4-seed`.
2. Возьмите connection string этой branch.

## 2) Применить миграции

PowerShell:

```powershell
$env:ENVIRONMENT="staging"
$env:STAGING_DATABASE_URL="postgresql://..."

pnpm -C packages/db db:migrate
```

## 3) Запустить seed (Atlas + Pulse + Blog + Media)

### Идемпотентный режим (по умолчанию)

```powershell
pnpm -C packages/db db:seed
```

### Reset-режим (опционально)

Удаляет только контентные таблицы (Atlas/Pulse/Blog/media). **Не трогает points/referral/auth.**

```powershell
$env:SEED_RESET="1"
pnpm -C packages/db db:seed
```

## 4) Sanity-check

Seed сам выведет:
- количества записей в `countries/cities/places/events/articles/media_files`,
- несколько примеров URL для проверки в UI (например `/pulse/<id>`, `/blog/<slug>`, `/atlas/places/<id>`).

## 5) UI проверка

В `.env` фронтенда:

```env
NEXT_PUBLIC_DATA_SOURCE=api
NEXT_PUBLIC_API_URL=<gateway url>
```

Откройте страницы из списка, который печатает seed.

## Canonical demo URLs (after seed)

После успешного выполнения:

```powershell
pnpm -C packages/db db:migrate
pnpm -C packages/db db:seed
```

следующие URL гарантированно существуют в staging и могут использоваться для ручной проверки UI.

### Pulse (Events)

- Event #1: `/pulse/e7f8b7d4-6f6a-4f1e-9aa0-2d4dbaac7b10`
- Event #2: `/pulse/5b531b8d-8c7a-4fe8-b389-62e2f8d1d8a3`

### Blog (Articles)

- Article: `/blog/digital-nomads-2026`

### Atlas (Places)

- Place: `/atlas/places/place-1`

Все URL используются для:
- ручного UI-review,
- smoke-проверки после деплоя,
- воспроизводимых скриншотов.

