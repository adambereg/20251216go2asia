## Импорт Malaysia Places в Neon (staging)

Файлы генерируются скриптом `packages/db/src/exportPlacesToNeon.ts` в папку `exports/neon/malaysia/`.

### Порядок

1) **Cleanup** (удаляем ранее импортированные MY места и их overview-блоки)

Выполнить `exports/neon/malaysia/cleanup_my_places.sql`

2) **Ensure** (создаём `countries/cities`, если их нет)

Выполнить:
- `exports/neon/malaysia/ensure_my_country.sql`
- `exports/neon/malaysia/ensure_my_cities.sql`

3) **Импорт places + content_blocks**

Выполнить `exports/neon/malaysia/places.sql`

### Smoke-check (после импорта)

Выполнить `exports/neon/malaysia/smoke_my.sql`

### Рекомендации

**Neon SQL Editor:**
1. Откройте Neon Console: https://console.neon.tech
2. Выберите ветку: `staging-m4-content-seed`
3. Перейдите в SQL Editor
4. Выполните файлы в указанном порядке

**psql:**
```bash
export STAGING_DATABASE_URL="postgresql://..."
psql "$STAGING_DATABASE_URL" -f exports/neon/malaysia/cleanup_my_places.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/malaysia/ensure_my_country.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/malaysia/ensure_my_cities.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/malaysia/places.sql
psql "$STAGING_DATABASE_URL" -f exports/neon/malaysia/smoke_my.sql
```
