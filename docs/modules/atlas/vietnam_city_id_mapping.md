## Vietnam: city_id mapping (Atlas Places)

Источник: `content/atlas/vietnam/vietnam-places.md` (Atlas Content Canon v1).

Правило проекта:
- **`places.id` = `{city_id}-{slug}`**
- **`places.slug` — глобально уникальный** (в нашем импорте также имеет префикс `{city_id}-...`)

### Список городов из файла и выбранные `city_id`

- **Hue** → `hue`
- **Hoi An** → `hoi`
- **Da Nang** → `dad`
- **Dalat** → `dla`
- **Nha Trang** → `ntr`
- **Phu Quoc** → `phu`
- **Hanoi** → `han`
- **Ho Chi Minh City** → `sgn`

### Где используется

- Экспортёр: `packages/db/src/exportPlacesToNeon.ts`
- SQL ensure: `exports/neon/vietnam/ensure_vn_cities.sql`
- SQL cleanup: `exports/neon/vietnam/cleanup_vn_places.sql`

