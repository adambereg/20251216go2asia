## Импорт Vietnam Places в Neon (staging)

Файлы генерируются скриптом `packages/db/src/exportPlacesToNeon.ts` в папку `exports/neon/vietnam/`.

### Порядок

1) **Cleanup** (удаляем ранее импортированные VN места и их overview-блоки)

Выполнить `exports/neon/vietnam/cleanup_vn_places.sql`

2) **Ensure** (создаём `countries/cities`, если их нет)

Выполнить:
- `exports/neon/vietnam/ensure_vn_country.sql`
- `exports/neon/vietnam/ensure_vn_cities.sql`

3) **Импорт places + content_blocks**

Выполнить `exports/neon/vietnam/places.sql`

### Smoke-check (после импорта)

Выполнить `exports/neon/vietnam/smoke_vn.sql`

