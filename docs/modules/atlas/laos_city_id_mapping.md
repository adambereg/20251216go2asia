## Laos: city_id mapping (Atlas Places)

Источник: `content/atlas/laos/laos-places.md` (Atlas Content Canon v1).

Правило проекта:
- **`places.id` = `{city_id}-{slug}`**
- **`places.slug` — глобально уникальный** (в нашем импорте также имеет префикс `{city_id}-...`)

### Список городов из файла и выбранные `city_id`

- **Luang Prabang** → `lpq`
- **Vientiane** → `vte`
- **Vang Vieng** → `vvg`
- **Pakse** → `pkz`
- **Savannakhet** → `svk`

### Где используется

- Экспортёр: `packages/db/src/exportPlacesToNeon.ts`
- SQL ensure: `exports/neon/laos/ensure_la_cities.sql`
- SQL cleanup: `exports/neon/laos/cleanup_la_places.sql`
