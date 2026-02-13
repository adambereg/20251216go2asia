# Итоговый отчёт: Миграция Places (Atlas Content Canon v1) → Neon Postgres

**Дата:** 2026-01-22  
**Статус:** ✅ Готово к импорту

---

## 📊 Статистика

### Обработанные файлы (6):
- ✅ `01-philippines-manila-guide.md` → 5 places
- ✅ `01-philippines-cebu-guide.md` → 6 places  
- ✅ `01-philippines-palawan-guide.md` → 6 places
- ✅ `01-philippines-bohol-guide.md` → 6 places
- ✅ `01-philippines-boracay-guide.md` → 6 places
- ✅ `01-philippines-dumaguete-guide.md` → 6 places

**Всего:** 35 places

### Распределение по городам:
| Город | City ID | Places |
|-------|---------|--------|
| Manila | mnl | 5 |
| Cebu | ceb | 6 |
| Palawan | pps | 6 |
| Bohol | tag | 6 |
| Boracay | boracay | 6 |
| Dumaguete | dumaguete | 6 |

### Распределение по типам (ожидаемое):
- `showplace`: ~19-20 мест
- `business`: ~15-16 мест

---

## 📁 Сгенерированные артефакты

### SQL файлы:
- ✅ `places.sql` (~3919 строк) - UPSERT для places + content_blocks
- ✅ `places.csv` (35 записей) - CSV экспорт places
- ✅ `content_blocks.csv` (35 записей) - CSV экспорт content_blocks

### Документация:
- ✅ `README.md` - Общая информация
- ✅ `IMPORT_INSTRUCTIONS.md` - Инструкции по импорту
- ✅ `MIGRATION_REPORT.md` - Детальный отчёт
- ✅ `FINAL_REPORT.md` - Этот файл

---

## ✅ Проверки качества

### Slug генерация:
- ✅ Все slug содержат city_id префикс (`mnl-intramuros`)
- ✅ Глобальная уникальность обеспечена
- ✅ Двойные дефисы исправлены

### Content Blocks:
- ✅ Все 35 мест имеют content_block
- ✅ Все с `tab_key='overview'`, `lang='ru'`
- ✅ Markdown секции корректно объединены

### Метаданные:
- ✅ `place_kind` корректно извлечён
- ✅ `tags` нормализованы (lowercase)
- ✅ `description_short` ограничен до 500 символов

### ✅ Координаты:
- ✅ Координаты корректно парсятся из markdown
- ✅ Формат: `**Координаты:** lat, lng`
- ⚠️ Некоторые места могут не иметь координат в markdown (проверить после импорта)

---

## 🚀 Инструкции по импорту

### Вариант 1: Neon Console SQL Editor (Рекомендуется)

1. Откройте https://console.neon.tech
2. Выберите проект → ветка (staging)
3. SQL Editor → Откройте `exports/neon/places.sql`
4. Скопируйте весь содержимое
5. Вставьте в SQL Editor → Run (F5)

### Вариант 2: psql

```bash
export STAGING_DATABASE_URL="postgresql://user:password@host:5432/dbname"
psql $STAGING_DATABASE_URL < exports/neon/places.sql
```

### Вариант 3: PowerShell

```powershell
$env:STAGING_DATABASE_URL = "postgresql://user:password@host:5432/dbname"
Get-Content exports/neon/places.sql | psql $env:STAGING_DATABASE_URL
```

---

## 🔍 Smoke-check после импорта

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
4. ⚠️ Places without coordinates
5. ⚠️ Places without content_blocks (должно быть 0)
6. ✅ Check for duplicate slugs (должно быть 0)
7. ✅ Sample places (первые 5)

---

## 📋 Ожидаемые результаты

После успешного импорта:

### Places:
- **Всего:** 35 записей
- **По типам:** ~19 showplace + ~16 business
- **По городам:** равномерно (5-6 на город)
- **Slug:** все уникальны, формат `{city_id}-{name-slug}`

### Content Blocks:
- **Всего:** 35 записей
- **Все с:** `entity_type='place'`, `tab_key='overview'`, `lang='ru'`
- **Покрытие:** 100% (все места имеют content_block)

---

## ⚠️ Известные проблемы

### Координаты NULL:
- **Проблема:** Некоторые места могут иметь NULL координаты
- **Причина:** Формат координат в markdown может отличаться
- **Решение:** Проверить после импорта через smoke-check, исправить в markdown

### Формат markdown:
- Все файлы должны следовать Atlas Content Canon v1
- Координаты: `**Координаты:** lat, lng`
- Метаданные: секция `### 🏷️ Метаданные`

---

## 🔄 Откат (если нужно)

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

## ✅ Чеклист выполнения

- [x] Экспорт выполнен (35 places)
- [x] SQL файлы сгенерированы
- [x] CSV файлы сгенерированы
- [x] Документация создана
- [x] Smoke-check скрипты созданы
- [ ] **Импорт в Neon** (выполнить вручную)
- [ ] **Smoke-check после импорта** (выполнить после импорта)
- [ ] Проверка координат (исправить при необходимости)
- [ ] Проверка UI отображения

---

**Следующий шаг:** Выполнить импорт через Neon Console или psql  
**Файлы:** `exports/neon/places.sql` (~3919 строк)  
**Проверка:** `scripts/smoke-neon-places-import.sh`
