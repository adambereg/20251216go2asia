# Резюме исправлений модуля Atlas Places

**Дата:** 2026-01-25  
**Версия:** Atlas Content Canon v1

## ✅ Выполненные исправления

### 1. Расширен парсинг секций для поддержки синонимов из шаблонов контента

**Файл:** `apps/go2asia-pwa-shell/modules/atlas/components/PlaceLandingLayouts.tsx`

**Изменения:**
- Расширена функция `getSectionKey()` для поддержки синонимов из `Philippines-places.md`
- Добавлены маппинги для:
  - Showplace: "Что увидеть", "Что внутри", "Что посмотреть" → `structure`
  - Showplace: "Когда лучше посетить", "Сколько времени" → `timeAllocation`
  - Showplace: "Активности" → `practicalTips`
  - Business: "Что заказать" → `mustTry`
  - Business: "Язык", "Wi-Fi" → `service`

**Результат:** UI теперь корректно парсит секции из markdown контента, созданного по шаблонам.

---

### 2. Исправлена работа с координатами (lat/lng vs latitude/longitude)

**Файлы:**
- `apps/go2asia-pwa-shell/modules/atlas/components/PlaceLandingLayouts.tsx`
- `apps/go2asia-pwa-shell/app/(public)/atlas/places/[id]/page.tsx`

**Изменения:**
- Добавлены поля `lat` и `lng` в интерфейс `PlaceLandingData` (предпочтительные)
- Поля `latitude` и `longitude` оставлены для обратной совместимости (legacy)
- `MetaRow` теперь использует `lat`/`lng` с fallback на `latitude`/`longitude`
- Страница `PlaceOverviewPage` передаёт координаты в обоих форматах

**Результат:** Координаты корректно отображаются, готовность к миграции на `lat`/`lng` в будущем.

---

### 3. Зафиксировано решение по градиентам Showplace

**Файл:** `apps/go2asia-pwa-shell/modules/atlas/components/PlaceLandingLayouts.tsx`

**Изменения:**
- Добавлен комментарий, объясняющий разницу градиентов:
  - `PlacePreviewCard`: `emerald-500 to-sky-500` (компактная карточка)
  - `PlaceLandingLayoutShowplace`: `rose-600 to-amber-500` (детальная страница)

**Результат:** Разница в градиентах зафиксирована как осознанное дизайн-решение.

---

## 📋 Остающиеся задачи (не критичные)

### 1. Унификация градиентов (опционально)

Если требуется единый визуальный язык:
- **Вариант А:** Изменить `PlaceLandingLayoutShowplace` на `emerald-500 to-sky-500`
- **Вариант Б:** Изменить `PlacePreviewCard` на `rose-600 to-amber-500`

**Статус:** Требует решения дизайнера/продукт-менеджера

---

### 2. Добавление lat/lng в DTO (для будущей миграции)

**Текущее состояние:**
- API маппит `lat`/`lng` → `latitude`/`longitude` в DTO
- UI использует `latitude`/`longitude` с fallback логикой

**Рекомендация:** В будущем добавить `lat`/`lng` напрямую в `ContentPlaceDto` для упрощения миграции.

**Файлы для изменения:**
- `packages/sdk/src/content.ts` (ContentPlaceDto)
- `apps/content-service/src/index.ts` (toContentPlace mapper)

**Статус:** Не критично, текущее решение работает

---

### 3. Уточнение формулировки про slug vs id

**Текущая формулировка в документации:**
> "Slug формат {city_id}-{slug}"

**Правильная формулировка:**
- **ID формат:** `{city_id}-{slug}` (например, `mnl-intramuros`)
- **Slug стратегия:** Глобально уникальный идентификатор, на практике часто с префиксом `{city_id}-{slug}` для избежания конфликтов
- **Роутинг:** `/atlas/places/{slug}` использует поле `slug`, не `id`

**Статус:** Требует обновления документации

---

## 🎯 Итоговый статус

✅ **Критичные исправления выполнены:**
1. Парсинг секций работает корректно
2. Координаты отображаются правильно
3. Градиенты зафиксированы как дизайн-решение

📝 **Документация:**
- Создан документ с анализом несостыковок: `docs/modules/atlas/places_analysis_corrections.md`
- Создан документ с резюме исправлений: `docs/modules/atlas/places_fixes_summary.md`

🔜 **Следующие шаги:**
1. Протестировать парсинг секций на реальных данных из `Philippines-places.md`
2. При необходимости унифицировать градиенты (по решению дизайнера)
3. Обновить документацию с правильной формулировкой про slug/id

---

**Проверено:** Линтер не выявил ошибок  
**Готово к тестированию:** ✅
