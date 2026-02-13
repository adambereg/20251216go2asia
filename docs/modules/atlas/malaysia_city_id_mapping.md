## Malaysia: city_id mapping (Atlas Places)

Источник: `content/atlas/malaysia/malaysia-places.md` (Atlas Content Canon v1).

Правило проекта:
- **`places.id` = `{city_id}-{slug}`**
- **`places.slug` — глобально уникальный** (в нашем импорте также имеет префикс `{city_id}-...`)

### Список городов из файла и выбранные `city_id`

- **Kuala Lumpur** → `kll`
- **Penang** / **George Town** → `png` (оба названия маппятся на один city_id)
- **Langkawi** → `lgk`
- **Melaka** → `mkz`
- **Kota Kinabalu** → `bki` (подготовлено на будущее, если встречается в файле)

### Где используется

- Экспортёр: `packages/db/src/exportPlacesToNeon.ts`
- SQL ensure: `exports/neon/malaysia/ensure_my_cities.sql`
- SQL cleanup: `exports/neon/malaysia/cleanup_my_places.sql`

### Примечание

Penang и George Town используют один и тот же `city_id` (`png`), так как George Town является частью штата Penang.
