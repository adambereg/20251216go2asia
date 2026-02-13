# Отчёт о миграции Places (Atlas Content Canon v1) в Neon Postgres

**Дата:** 2026-01-22  
**Источник:** `content/atlas/philippines/*-guide.md` (6 файлов)  
**Целевая БД:** Neon Postgres (staging)

---

## 1. Статистика парсинга

### Обработанные файлы:
- ✅ `01-philippines-manila-guide.md` - 5 places
- ✅ `01-philippines-cebu-guide.md` - 6 places
- ✅ `01-philippines-palawan-guide.md` - 6 places
- ✅ `01-philippines-bohol-guide.md` - 6 places
- ✅ `01-philippines-boracay-guide.md` - 6 places
- ✅ `01-philippines-dumaguete-guide.md` - 6 places

**Всего:** 35 places

### Распределение по типам (ожидаемое):
- `showplace` (достопримечательности): ~19-20
- `business` (коммерческие заведения): ~15-16

### Распределение по городам:
- Manila (mnl): 5
- Cebu (ceb): 6
- Palawan (pps): 6
- Bohol (tag): 6
- Boracay (boracay): 6
- Dumaguete (dumaguete): 6

---

## 2. Сгенерированные артефакты

### SQL файлы:
- ✅ `places.sql` - UPSERT statements для places и content_blocks (~3919 строк)
- ✅ `places.csv` - CSV экспорт для places (35 записей)
- ✅ `content_blocks.csv` - CSV экспорт для content_blocks (35 записей)

### Документация:
- ✅ `README.md` - Общая информация об экспорте
- ✅ `IMPORT_INSTRUCTIONS.md` - Подробные инструкции по импорту

---

## 3. Проверка качества данных

### ✅ Slug генерация:
- Все slug содержат city_id префикс (например, `mnl-intramuros`)
- Глобальная уникальность обеспечена
- Двойные дефисы исправлены

### ⚠️ Координаты:
- **Проблема:** Координаты парсятся как NULL для некоторых мест
- **Причина:** Формат координат в markdown может отличаться
- **Действие:** Проверить после импорта через smoke-check

### ✅ Content Blocks:
- Все места имеют content_block с `tab_key='overview'`, `lang='ru'`
- Markdown секции корректно объединены

### ✅ Метаданные:
- `place_kind` корректно извлечён из метаданных
- `tags` нормализованы (lowercase, без дублей)
- `source` и `status` сохранены в metadata

---

## 4. Инструкции по импорту

### Вариант 1: Neon Console SQL Editor (Рекомендуется)
1. Откройте https://console.neon.tech
2. Выберите проект и ветку (staging)
3. SQL Editor → Скопируйте содержимое `places.sql`
4. Выполните SQL

### Вариант 2: psql
```bash
psql $STAGING_DATABASE_URL < exports/neon/places.sql
```

### Вариант 3: PowerShell
```powershell
Get-Content exports/neon/places.sql | psql $env:STAGING_DATABASE_URL
```

---

## 5. Smoke-check после импорта

Запустите скрипт проверки:

**Bash:**
```bash
./scripts/smoke-neon-places-import.sh $STAGING_DATABASE_URL
```

**PowerShell:**
```powershell
.\scripts\smoke-neon-places-import.ps1 $STAGING_DATABASE_URL
```

### Проверки:
1. ✅ Count places by country_id and place_kind
2. ✅ Count places by city_id and place_kind
3. ✅ Count content_blocks (overview, lang='ru')
4. ⚠️ Places without coordinates (требует проверки)
5. ⚠️ Places without content_blocks (должно быть 0)
6. ✅ Check for duplicate slugs (должно быть 0)
7. ✅ Sample places (первые 5)

---

## 6. Ожидаемые результаты после импорта

### Places:
- **Всего:** 35 записей
- **По типам:**
  - `showplace`: ~19-20
  - `business`: ~15-16
- **По городам:** равномерно распределены (5-6 на город)

### Content Blocks:
- **Всего:** 35 записей
- **Все с:** `entity_type='place'`, `tab_key='overview'`, `lang='ru'`
- **Все места имеют:** минимум 1 content_block

### Качество данных:
- ✅ Все slug уникальны
- ⚠️ Некоторые места могут не иметь координат (проверить после импорта)
- ✅ Все места имеют description_short (до 500 символов)
- ✅ Все места имеют tags (JSONB массив)

---

## 7. Известные проблемы и ограничения

### Координаты NULL:
- **Проблема:** Некоторые места могут иметь NULL координаты
- **Причина:** Формат координат в markdown может отличаться от ожидаемого
- **Решение:** Проверить после импорта и исправить в markdown при необходимости

### Формат markdown:
- Все файлы должны следовать Atlas Content Canon v1
- Каждое место начинается с `## Name`
- Координаты в формате: `**Координаты:** lat, lng`
- Метаданные в секции `### 🏷️ Метаданные`

---

## 8. Следующие шаги

1. ✅ Выполнить импорт через Neon Console или psql
2. ✅ Запустить smoke-check скрипт
3. ⚠️ Проверить места без координат и исправить в markdown
4. ✅ Проверить UI отображение через `/atlas/places`
5. ✅ Проверить детальные страницы через `/atlas/places/{slug}`

---

## 9. Откат (если нужно)

```sql
-- Удалить импортированные данные
DELETE FROM content_blocks 
WHERE entity_type = 'place' 
  AND entity_id IN (
    SELECT id FROM places WHERE country_id = 'ph' AND slug LIKE '%-%'
  );

DELETE FROM places 
WHERE country_id = 'ph' 
  AND slug LIKE '%-%';
```

---

**Статус:** ✅ Готово к импорту  
**Файлы:** `exports/neon/places.sql` (~3919 строк)  
**Проверка:** Запустить `smoke-neon-places-import.sh` после импорта
