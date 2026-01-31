# Инструкции по импорту Places в Neon Postgres

## Подготовка

1. **Проверьте подключение к Neon:**
   - Убедитесь, что у вас есть `STAGING_DATABASE_URL` или `DATABASE_URL`
   - Проверьте доступ через Neon Console SQL Editor

2. **Проверьте схему БД:**
   ```sql
   -- Убедитесь что таблицы существуют
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('places', 'content_blocks');
   
   -- Проверьте что страна PH существует
   SELECT id, slug, name FROM countries WHERE id = 'ph';
   
   -- Проверьте что города существуют
   SELECT id, slug, name FROM cities WHERE country_id = 'ph';
   ```

## Вариант 1: Импорт через Neon Console SQL Editor (Рекомендуется)

1. Откройте Neon Console: https://console.neon.tech
2. Выберите проект и ветку (staging)
3. Перейдите в SQL Editor
4. Откройте файл `exports/neon/places.sql`
5. Скопируйте весь содержимое
6. Вставьте в SQL Editor
7. Нажмите "Run" или F5
8. Проверьте результат (должно быть ~35 INSERT statements)

## Вариант 2: Импорт через psql (локально)

```bash
# Установите переменную окружения
export STAGING_DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Импорт
psql $STAGING_DATABASE_URL < exports/neon/places.sql
```

Или в PowerShell:
```powershell
$env:STAGING_DATABASE_URL = "postgresql://user:password@host:5432/dbname"
Get-Content exports/neon/places.sql | psql $env:STAGING_DATABASE_URL
```

## Вариант 3: Импорт через Node.js скрипт

```bash
cd packages/db
pnpm tsx -e "
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
const sql = neon(process.env.STAGING_DATABASE_URL);
const sqlContent = readFileSync('../../exports/neon/places.sql', 'utf-8');
await sql(sqlContent);
console.log('Import completed');
"
```

## Очистка перед переимпортом (staging/dev)

Если нужно полностью заменить PH-набор, выполните:

```sql
-- Файл: exports/neon/cleanup_ph_places.sql
-- Удаляет PH places по префиксам id и связанные content_blocks
```

Через Neon Console:
1. Откройте `exports/neon/cleanup_ph_places.sql`
2. Выполните в SQL Editor
3. Затем выполните `exports/neon/ensure_ph_cities.sql`
4. Затем импортируйте `places.sql`

## Проверка после импорта

Запустите smoke-check скрипт:

**Bash:**
```bash
./scripts/smoke-neon-places-import.sh $STAGING_DATABASE_URL
```

**PowerShell:**
```powershell
.\scripts\smoke-neon-places-import.ps1 $STAGING_DATABASE_URL
```

Или выполните SQL запросы вручную (см. `scripts/smoke-neon-places-import.sh`)

## Откат (если нужно)

```sql
-- Удалить импортированные places и content_blocks
DELETE FROM content_blocks 
WHERE entity_type = 'place' 
  AND entity_id IN (
    SELECT id FROM places WHERE country_id = 'ph' AND slug LIKE '%-%'
  );

DELETE FROM places 
WHERE country_id = 'ph' 
  AND slug LIKE '%-%';
```

## Ожидаемые результаты

После успешного импорта:
- **35 places** (11 business + 19 showplace + 5 других)
- **35 content_blocks** (по одному на каждое место)
- Все места должны иметь координаты (если указаны в markdown)
- Все места должны иметь content_block с overview

## Возможные проблемы

1. **Ошибка "duplicate key value violates unique constraint"**
   - Это нормально для UPSERT - записи обновятся
   - Проверьте что slug действительно уникальные

2. **Ошибка "foreign key constraint fails"**
   - Проверьте что country_id='ph' существует
   - Проверьте что все city_id существуют в таблице cities

3. **Координаты NULL**
   - Некоторые места могут не иметь координат в markdown
   - Это нормально, проверьте через smoke-check

4. **Отсутствие content_blocks**
   - Проверьте что секции были корректно распарсены
   - Проверьте логи экспорта
