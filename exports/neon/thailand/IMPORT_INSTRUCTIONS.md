## Импорт Thailand Places в Neon (staging)

Файлы генерируются скриптом `packages/db/src/exportPlacesToNeon.ts` в папку `exports/neon/thailand/`.

### Порядок

1) **Cleanup** (удаляем ранее импортированные TH места и их overview-блоки)

Выполнить `exports/neon/thailand/cleanup_th_places.sql`

2) **Ensure** (создаём `countries/cities`, если их нет)

Выполнить:
- `exports/neon/thailand/ensure_th_country.sql`
- `exports/neon/thailand/ensure_th_cities.sql`

3) **Импорт places + content_blocks**

Выполнить `exports/neon/thailand/places.sql`

### Smoke-check (после импорта)

Выполнить `exports/neon/thailand/smoke_th.sql`

### Рекомендации

**Neon SQL Editor:**
1. Откройте Neon Console: https://console.neon.tech
2. Выберите ветку: `staging-m4-content-seed`
3. Перейдите в SQL Editor
4. Выполните файлы в указанном порядке

**psql:**
```bash
export STAGING_DATABASE_URL="postgresql://..."
psql "$STAGING_DATABASE_URL" -f exports/neon/thailand/cleanup_th_places.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/thailand/ensure_th_country.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/thailand/ensure_th_cities.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/thailand/places.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/thailand/smoke_th.sql
```
