## Thailand: city_id mapping (Atlas Places)

Источник: `content/atlas/thailand/thailand-places.md` (Atlas Content Canon v1).

Правило проекта:
- **`places.id` = `{city_id}-{slug}`**
- **`places.slug` — глобально уникальный** (в нашем импорте также имеет префикс `{city_id}-...`)

### Список городов из файла и выбранные `city_id`

- **Bangkok** → `bkk`
- **Chiang Mai** → `cnx`
- **Phuket** → `phk`
- **Pattaya** → `pty`
- **Krabi** → `kbi`
- **Koh Samui** → `usm`
- **Hua Hin** → `hhn`
- **Ayutthaya** → `aya`

### Где используется

- Экспортёр: `packages/db/src/exportPlacesToNeon.ts`
- SQL ensure: `exports/neon/thailand/ensure_th_cities.sql`
- SQL cleanup: `exports/neon/thailand/cleanup_th_places.sql`
