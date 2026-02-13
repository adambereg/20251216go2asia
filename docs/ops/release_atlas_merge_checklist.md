## Release checklist — Atlas Asia merge to `main`

Контекст: feature-ветка `feat/atlas-production-ready` содержит hardening Atlas Asia (особенно «Города»).
Миграции применены на **STAGING**, на **PRODUCTION** пока не применялись.

---

### 1) Что входит в релиз (high level)

- **DB (Neon/Postgres)**
  - `cities.names jsonb` (RU/EN отображаемые имена)
  - `city_aliases` для резолвинга старых/SEO slug без 404
  - дедуп/merge 6 пар городов (sin/kul/hkt/jog/svn/mlk)
  - редакторские признаки для фильтров городов:
    - `city_type`, `city_size`, `has_sea`, `price_level`, `nightlife_level` + индексы

- **Backend (content-service)**
  - `GET /v1/content/cities/:idOrSlug` (alias resolution через `city_aliases`)
  - `GET /v1/content/cities` поддерживает query params фильтров/поиска/сортировки
  - hero для городов **только из R2**: `city/<slug>/hero.jpg` → `01.jpg` → `null`
  - для Atlas UI в API-режиме не возвращаем placeholder stock-URL как hero (лучше `null`)

- **Frontend (PWA shell)**
  - `/atlas/cities`: фильтры + сортировка, состояние в URL query params, без runtime fallback на моки/pexels в API-режиме

---

### 2) Миграции, которые нужно применить в production (обязательно)

Список:
- `0003_foamy_bullseye.sql` — `cities.names`, `city_aliases`, `content_blocks` (+ индексы)
- `0004_atlas_city_dedup_and_names.sql` — DML merge дублей городов + aliases (one-off)
- `0005_atlas_city_filters.sql` — enums/колонки/индексы для фильтров городов

Команда применения (запускать из корня репо):

```powershell
$env:PRODUCTION_DATABASE_URL="postgresql://..."
pnpm -C packages/db db:ddl:apply:prod
```

Важно:
- На **staging** миграции уже применены.
- На **production** миграции должны быть применены **до** деплоя backend (content-service/api), иначе возможны 500 из-за отсутствующих колонок/типов.

---

### 3) Post-merge actions (после мержа в `main`)

Порядок (рекомендовано):
- **DB**: применить миграции `0003–0005` на production (см. выше).
- **Deploy backend**:
  - `content-service` (production env)
  - `api-gateway` (production env, если требуется проксирование/vars)
- **Deploy frontend**:
  - `go2asia-pwa-shell` (production)
- **Smoke checks (production)**:
  - UI:
    - `/atlas/cities` (список, фильтры)
    - `/atlas/places`
    - `/atlas/countries`
  - API:
    - `/v1/content/cities`
    - `/v1/content/cities/:idOrSlug` (пример: `singapore` и `sin` → один и тот же город)
    - `/v1/content/cities/:idOrSlug/tabs`

---

### 4) Риски и предохранители

- **DML миграция `0004`**: содержит дедуп/удаление дублей. Повторно вручную запускать не нужно; скрипт DDL applicator применяет миграции один раз и фиксирует в `schema_migrations`.
- **Переменные окружения**: убедиться, что в production корректно задан `NEXT_PUBLIC_API_URL` (frontend) и `DATABASE_URL`/R2 bindings (Workers).

