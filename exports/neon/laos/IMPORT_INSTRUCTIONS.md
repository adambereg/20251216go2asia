## Импорт Laos Places в Neon (staging)

Файлы генерируются скриптом `packages/db/src/exportPlacesToNeon.ts` в папку `exports/neon/laos/`.

### Порядок

1) **Cleanup** (удаляем ранее импортированные LA места и их overview-блоки)

Выполнить `exports/neon/laos/cleanup_la_places.sql`

2) **Ensure** (создаём `countries/cities`, если их нет)

Выполнить:
- `exports/neon/laos/ensure_la_country.sql`
- `exports/neon/laos/ensure_la_cities.sql`

3) **Импорт places + content_blocks**

Выполнить `exports/neon/laos/places.sql`

### Smoke-check (после импорта)

Выполнить `exports/neon/laos/smoke_la.sql`

### Рекомендации

**Neon SQL Editor:**
1. Откройте Neon Console: https://console.neon.tech
2. Выберите ветку: `staging-m4-content-seed`
3. Перейдите в SQL Editor
4. Выполните файлы в указанном порядке

**psql:**
```bash
export STAGING_DATABASE_URL="postgresql://..."
psql "$STAGING_DATABASE_URL" -f exports/neon/laos/cleanup_la_places.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/laos/ensure_la_country.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/laos/ensure_la_cities.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/laos/places.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/laos/smoke_la.sql
```
