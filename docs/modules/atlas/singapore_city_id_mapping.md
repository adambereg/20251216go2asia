## Singapore: city_id mapping (Atlas Places)

Источник: `content/atlas/singapore/singapore-places-sgp.md` (Atlas Content Canon v1).

Правило проекта:
- **`places.id` = `{city_id}-{slug}`**
- **`places.slug` — глобально уникальный** (в нашем импорте также имеет префикс `{city_id}-...`)

### Список городов из файла и выбранные `city_id`

- **Singapore** → `sgp`

### Где используется

- Экспортёр: `packages/db/src/exportPlacesToNeon.ts`
- SQL ensure: `exports/neon/singapore/ensure_sg_cities.sql`
- SQL cleanup: `exports/neon/singapore/cleanup_sg_places.sql`
