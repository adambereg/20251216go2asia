# Исправления анализа модуля Atlas Places

## ❌ Обнаруженные несостыковки

### 1. Градиенты Showplace — несоответствие между компонентами

**Проблема:**
- `PlacePreviewCard` использует: `from-emerald-500 to-sky-500` (зелёно-голубой)
- `PlaceLandingLayoutShowplace` использует: `from-rose-600 to-amber-500` (розово-янтарный)

**Фактический код:**
```typescript
// PlacePreviewCard.tsx:23
const gradient = data.kind === 'showplace' 
  ? 'from-emerald-500 to-sky-500'  // ✅ Правильно
  : 'from-amber-500 to-orange-500';

// PlaceLandingLayouts.tsx:337
<Hero
  gradient="bg-gradient-to-r from-rose-600 to-amber-500"  // ❌ Другой градиент
/>
```

**Рекомендация:**
- **Вариант А:** Унифицировать оба компонента на `emerald-500 to-sky-500` (зелёно-голубой для showplace)
- **Вариант Б:** Унифицировать оба компонента на `rose-600 to-amber-500` (розово-янтарный для showplace)
- **Вариант В:** Оставить как есть, если это осознанное дизайн-решение (PreviewCard — компактный, LandingLayout — детальный)

**Статус:** Требует решения дизайнера/продукт-менеджера

---

### 2. Несоответствие заголовков секций между шаблонами контента и UI парсером

**Проблема:**
UI парсер `getSectionKey()` ожидает определённые ключевые слова, но шаблоны контента используют другие формулировки.

**Примеры несоответствий для Showplace:**

| Шаблон контента (Philippines-places.md) | UI ожидает (getSectionKey) | Статус |
|----------------------------------------|---------------------------|--------|
| "🌟 Почему это важно:" | `lower.includes('почему') \|\| lower.includes('важно')` | ✅ Работает |
| "🚶 Как добраться:" | `lower.includes('добраться') \|\| lower.includes('как добраться')` | ✅ Работает |
| "🎠 Что увидеть:" | `lower.includes('структура') \|\| lower.includes('комплекс')` | ❌ Не найдёт |
| "🏛️ Что внутри:" | `lower.includes('структура') \|\| lower.includes('комплекс')` | ❌ Не найдёт |
| "🎏 Что посмотреть:" | `lower.includes('структура') \|\| lower.includes('комплекс')` | ❌ Не найдёт |
| "🙏 Когда лучше посетить:" | Нет маппинга | ❌ Не найдёт |
| "🚣 Активности:" | Нет маппинга | ❌ Не найдёт |

**Фактический код парсера:**
```typescript
// PlaceLandingLayouts.tsx:75-98
function getSectionKey(title: string, kind: PlaceKind): string | null {
  const lower = title.toLowerCase();
  if (kind === 'showplace') {
    if (lower.includes('почему') || lower.includes('важно')) return 'whyImportant';
    if (lower.includes('структура') || lower.includes('комплекс')) return 'structure';
    if (lower.includes('билет') || lower.includes('посещение')) return 'tickets';
    if (lower.includes('время') || lower.includes('заложить')) return 'timeAllocation';
    if (lower.includes('фото') || lower.includes('точки')) return 'photoSpots';
    if (lower.includes('совет') || lower.includes('практическ')) return 'practicalTips';
    if (lower.includes('истори') || lower.includes('справка')) return 'history';
    if (lower.includes('рядом') || lower.includes('посмотреть')) return 'nearby';
    if (lower.includes('факт') || lower.includes('интересный')) return 'interestingFact';
  }
  return null;
}
```

**Последствия:**
- Если `sections.size === 0`, UI покажет одну карточку "Описание" со всем markdown (fallback)
- Секции не будут разбиты на красивые карточки

**Рекомендация:**
Расширить `getSectionKey()` для поддержки синонимов из шаблонов:

```typescript
function getSectionKey(title: string, kind: PlaceKind): string | null {
  const lower = title.toLowerCase();
  if (kind === 'showplace') {
    if (lower.includes('почему') || lower.includes('важно')) return 'whyImportant';
    // Расширение для "структура комплекса":
    if (lower.includes('структура') || lower.includes('комплекс') || 
        lower.includes('что увидеть') || lower.includes('что внутри') || 
        lower.includes('что посмотреть') || lower.includes('🎠') || 
        lower.includes('🏛️') || lower.includes('🎏')) return 'structure';
    if (lower.includes('билет') || lower.includes('посещение')) return 'tickets';
    if (lower.includes('время') || lower.includes('заложить') || 
        lower.includes('когда лучше')) return 'timeAllocation';
    if (lower.includes('фото') || lower.includes('точки') || 
        lower.includes('сфотографировать')) return 'photoSpots';
    if (lower.includes('совет') || lower.includes('практическ') || 
        lower.includes('активности') || lower.includes('🚣')) return 'practicalTips';
    if (lower.includes('истори') || lower.includes('справка')) return 'history';
    if (lower.includes('рядом') || lower.includes('посмотреть рядом')) return 'nearby';
    if (lower.includes('факт') || lower.includes('интересный')) return 'interestingFact';
  }
  // ... business аналогично
}
```

**Альтернатива:** Привести шаблоны контента к заголовкам, которые ожидает UI (менее гибко).

**Статус:** 🔴 Критично — требует исправления

---

### 3. MetaRow использует legacy поля latitude/longitude вместо lat/lng

**Проблема:**
- Схема БД: `lat`/`lng` — предпочтительные поля, `latitude`/`longitude` — legacy/deprecated
- UI (`MetaRow`) читает: `data.latitude` и `data.longitude`
- API маппит: `lat` → `latitude`, `lng` → `longitude` в DTO

**Фактический код:**
```typescript
// PlaceLandingLayouts.tsx:182
const coords = data.latitude && data.longitude 
  ? `${data.latitude}, ${data.longitude}` 
  : '—';

// content-service/src/index.ts:575-576
latitude: row.lat,      // ✅ Маппинг есть
longitude: row.lng,    // ✅ Маппинг есть
```

**Риск:**
Если API/SDK перестанет дублировать в legacy поля, UI покажет "—" вместо координат.

**Рекомендация:**
- **Вариант А (предпочтительно):** Изменить UI на чтение `lat`/`lng`:
  ```typescript
  // PlaceLandingLayouts.tsx:182
  const coords = (data.lat && data.lng) 
    ? `${data.lat}, ${data.lng}` 
    : (data.latitude && data.longitude 
      ? `${data.latitude}, ${data.longitude}` 
      : '—');
  ```
  
  И обновить интерфейс:
  ```typescript
  interface PlaceLandingData {
    // ...
    lat: string | null;        // ✅ Новое
    lng: string | null;        // ✅ Новое
    latitude: string | null;   // ⚠️ Deprecated, но оставить для обратной совместимости
    longitude: string | null;  // ⚠️ Deprecated
  }
  ```

- **Вариант Б:** Гарантировать в API/SDK всегда дублировать `lat`/`lng` → `latitude`/`longitude` до полной миграции UI (временное решение)

**Статус:** 🟡 Важно — исправить до масштабирования на другие страны

---

### 4. Неточная формулировка про slug vs id

**Проблема в отчёте:**
> "Slug формат {city_id}-{slug}"

**Реальность:**
- `id` = `{city_id}-{slug}` (например, `mnl-intramuros`)
- `slug` = глобально уникальный идентификатор (может быть с префиксом `{city_id}-{slug}` или без)

**Правильная формулировка:**
- **ID формат:** `{city_id}-{slug}` (например, `mnl-intramuros`)
- **Slug стратегия:** Глобально уникальный, на практике часто с префиксом города для избежания конфликтов
- **Роутинг:** `/atlas/places/{slug}` — использует `slug`, не `id`

**Важно для масштабирования:**
При добавлении новых стран нужно решить:
- Всегда ли slug должен быть prefixed (`mnl-intramuros`)?
- Или можно использовать "чистые" slug (`intramuros`) если они глобально уникальны?

**Рекомендация:** Зафиксировать правило: slug всегда prefixed (`{city_id}-{slug}`) для упрощения роутинга и избежания конфликтов.

**Статус:** 📝 Требует уточнения формулировки

---

## ✅ Резюме исправлений

1. **Градиенты Showplace** — унифицировать или зафиксировать как дизайн-решение
2. **Парсинг секций** — расширить `getSectionKey()` для поддержки синонимов из шаблонов
3. **Координаты** — мигрировать UI на `lat`/`lng` или гарантировать дублирование в API
4. **Формулировка slug** — уточнить разницу между `id` и `slug`

---

**Дата анализа:** 2026-01-25  
**Версия:** Atlas Content Canon v1
