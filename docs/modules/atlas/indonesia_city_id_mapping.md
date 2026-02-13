## Indonesia: city_id mapping (Atlas Places)

Источник: `content/atlas/indonesia/Indonesia-Places.md` (Atlas Content Canon v1).

Правило проекта:
- **`places.id` = `{city_id}-{slug}`**
- **`places.slug` — глобально уникальный** (в нашем импорте также имеет префикс `{city_id}-...`)

### Список городов из файла и выбранные `city_id`

- **Bali** → `bali`
- **Jakarta** → `jkt`
- **Yogyakarta** → `yog`
- **Labuan Bajo** → `lbj`
- **Lombok** → `lom`

### Где используется

- Экспортёр: `packages/db/src/exportPlacesToNeon.ts`
- SQL ensure: `exports/neon/indonesia/ensure_id_cities.sql`
- SQL cleanup: `exports/neon/indonesia/cleanup_id_places.sql`
