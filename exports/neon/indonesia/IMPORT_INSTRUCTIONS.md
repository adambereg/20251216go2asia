## Импорт Indonesia Places в Neon (staging)

Файлы генерируются скриптом `packages/db/src/exportPlacesToNeon.ts` в папку `exports/neon/indonesia/`.

### Порядок

1) **Cleanup** (удаляем ранее импортированные ID места и их overview-блоки)

Выполнить `exports/neon/indonesia/cleanup_id_places.sql`

2) **Ensure** (создаём `countries/cities`, если их нет)

Выполнить:
- `exports/neon/indonesia/ensure_id_country.sql`
- `exports/neon/indonesia/ensure_id_cities.sql`

3) **Импорт places + content_blocks**

Выполнить `exports/neon/indonesia/places.sql`

### Smoke-check (после импорта)

Выполнить `exports/neon/indonesia/smoke_id.sql`

### Рекомендации

**Neon SQL Editor:**
1. Откройте Neon Console: https://console.neon.tech
2. Выберите ветку: `staging-m4-content-seed`
3. Перейдите в SQL Editor
4. Выполните файлы в указанном порядке

**psql:**
```bash
export STAGING_DATABASE_URL="postgresql://..."
psql "$STAGING_DATABASE_URL" -f exports/neon/indonesia/cleanup_id_places.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/indonesia/ensure_id_country.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/indonesia/ensure_id_cities.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/indonesia/places.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/indonesia/smoke_id.sql
```
