# Atlas Places — Media Pipeline Plan

План для подготовки и импорта медиа-контента для Places (Atlas Content Canon v1).

## Текущее состояние

**Схема:**
- `places.images` (jsonb) — временное хранилище URL изображений
- `places.hero_media_id` (text) — FK к `media_files.id`
- `media_files` — таблица метаданных (байты в Cloudflare R2)

**Статус:** Контент готов, медиа-план — следующий шаг

---

## Media Key Convention (СТАНДАРТ)

**Обязательно соблюдать при масштабировании на другие страны (VN/TH/KH/...):**

```
bucket: go2asia-media
prefix: place/{place_id}/
files: 01.jpg, 02.jpg, 03.jpg (01 = hero)
optional future: 04.jpg..10.jpg
```

**Public URL формат:**
```
https://media.go2asia.space/place/{place_id}/01.jpg
https://media.go2asia.space/place/{place_id}/02.jpg
...
https://media.go2asia.space/place/{place_id}/05.jpg
```

**Пример:**
- `https://media.go2asia.space/place/boracay-ariels-point/01.jpg` (hero)
- `https://media.go2asia.space/place/boracay-ariels-point/02.jpg` (gallery)
- `https://media.go2asia.space/place/boracay-ariels-point/03.jpg` (gallery)

---

## Структура медиа для Place

Каждое место может иметь:

1. **Hero Image** (1 изображение) — `01.jpg`
   - Главное изображение для карточки и детальной страницы
   - Рекомендуемый размер: 1920x1080 (16:9)
   - Формат: JPG/WebP

2. **Gallery** (2–4 изображения) — `02.jpg`, `03.jpg`, `04.jpg`, `05.jpg`
   - Дополнительные фото для галереи
   - Рекомендуемый размер: 1920x1440 (4:3)
   - Формат: JPG/WebP

3. **Map Pin** (опционально, будущее расширение)
   - Кастомная иконка для карты
   - Рекомендуемый размер: 64x64 или 128x128
   - Формат: PNG/SVG

---

## CSV формат: place_media_plan.csv

**Структура:**
```csv
place_id,hero_image_url,gallery_urls,map_pin_url,notes
mnl-intramuros,https://...,"https://...,https://...",https://...,"Hero: фасад, Gallery: интерьер, стены"
ceb-basilica-del-santo-nino,https://...,"https://...,https://...",,
```

**Колонки:**
- `place_id` — ID места (формат: `{city_id}-{slug}`)
- `hero_image_url` — URL главного изображения
- `gallery_urls` — JSON массив URL галереи (3–5 фото)
- `map_pin_url` — URL кастомной иконки (опционально)
- `notes` — заметки для редактора (опционально)

---

## Процесс импорта медиа

### Этап 1: Подготовка CSV

1. **Собрать URL изображений** из:
   - Pexels/Unsplash (временные источники)
   - Редакторские фото (финальные)
   - Пользовательские фото (UGC, позже)

2. **Создать `place_media_plan.csv`** с маппингом:
   ```csv
   place_id,hero_image_url,gallery_urls,map_pin_url
   mnl-intramuros,https://images.pexels.com/...,"[""https://..."",""https://...""]",,
   ```

### Этап 2: Загрузка в R2

**Скрипт:** `packages/db/src/importPlaceMedia.ts` (будущий)

**Процесс:**
1. Читает `place_media_plan.csv`
2. Для каждого URL:
   - Скачивает изображение
   - Загружает в Cloudflare R2 (`r2://atlas/places/{place_id}/hero.jpg`)
   - Создает запись в `media_files`
   - Обновляет `places.hero_media_id` или `places.images`

**Структура R2 (СТАНДАРТ):**
```
go2asia-media/
  place/
    {place_id}/
      01.jpg  (hero image)
      02.jpg  (gallery)
      03.jpg  (gallery)
      04.jpg  (gallery, optional)
      05.jpg  (gallery, optional)
      ...     (future: 06-10.jpg)
```

**Public URL:**
- `https://media.go2asia.space/place/{place_id}/01.jpg`
- `https://media.go2asia.space/place/{place_id}/02.jpg`
- и т.д.

### Этап 3: Обновление places

**После загрузки в R2:**
```sql
-- Обновить hero_media_id
UPDATE places
SET hero_media_id = (
  SELECT id FROM media_files
  WHERE key = 'atlas/places/' || places.id || '/hero.jpg'
)
WHERE id IN (...);

-- Обновить images JSONB (временно, до миграции на media_files)
UPDATE places
SET images = (
  SELECT jsonb_agg(public_url)
  FROM media_files
  WHERE key LIKE 'atlas/places/' || places.id || '/gallery-%'
)
WHERE id IN (...);
```

---

## Миграция: images JSONB → media_files

**Текущее состояние:**
- `places.images` (jsonb) — массив URL
- `places.hero_media_id` — FK к `media_files`

**Целевое состояние:**
- Все изображения в `media_files`
- `places.hero_media_id` — FK к hero image
- Связь `place_media` для gallery (если понадобится)

**Миграция (опционально):**
```sql
-- Создать таблицу связей (если нужна нормализация)
CREATE TABLE place_media (
  place_id text REFERENCES places(id),
  media_id text REFERENCES media_files(id),
  media_type text NOT NULL, -- 'hero' | 'gallery' | 'map_pin'
  display_order integer,
  PRIMARY KEY (place_id, media_id)
);
```

---

## Пример: place_media_plan.csv

```csv
place_id,hero_image_url,gallery_urls,map_pin_url,notes
mnl-intramuros,https://images.pexels.com/photos/123/pexels-photo-123.jpeg,"[""https://images.pexels.com/photos/124/pexels-photo-124.jpeg"",""https://images.pexels.com/photos/125/pexels-photo-125.jpeg""]",,"Hero: фасад Intramuros, Gallery: стены, площадь"
ceb-basilica-del-santo-nino,https://images.pexels.com/photos/456/pexels-photo-456.jpeg,"[""https://images.pexels.com/photos/457/pexels-photo-457.jpeg""]",,"Hero: фасад базилики, Gallery: интерьер"
pps-tubbataha-reef,https://images.pexels.com/photos/789/pexels-photo-789.jpeg,"[""https://images.pexels.com/photos/790/pexels-photo-790.jpeg"",""https://images.pexels.com/photos/791/pexels-photo-791.jpeg""]",,"Hero: кораллы, Gallery: дайвинг"
```

---

## Требования к изображениям

### Hero Image
- **Размер:** 1920x1080 (16:9) или больше
- **Формат:** JPG (85% quality) или WebP
- **Вес:** < 500 KB
- **Содержание:** Главный вид места (фасад, панорама)

### Gallery Images
- **Размер:** 1920x1440 (4:3) или больше
- **Формат:** JPG (85% quality) или WebP
- **Вес:** < 500 KB каждый
- **Количество:** 3–5 изображений
- **Содержание:** Детали, интерьер, активность

### Map Pin
- **Размер:** 64x64 или 128x128
- **Формат:** PNG (прозрачность) или SVG
- **Вес:** < 50 KB
- **Содержание:** Иконка места (опционально)

---

## Интеграция с Cloudflare R2

**Настройка (СТАНДАРТ):**
```typescript
// Конфигурация R2
const R2_CONFIG = {
  bucket: 'go2asia-media',
  publicUrl: 'https://media.go2asia.space',
  pathPrefix: 'place',  // НЕ 'atlas/places', а просто 'place'
};
```

**Загрузка (соответствует стандарту):**
```typescript
// Псевдокод
async function uploadPlaceMedia(placeId: string, mediaPlan: MediaPlan) {
  // Hero (01.jpg)
  const heroKey = `place/${placeId}/01.jpg`;
  const heroMediaId = await uploadToR2(mediaPlan.heroImageUrl, heroKey);
  
  // Gallery (02.jpg, 03.jpg, ...)
  const galleryMediaIds = [];
  for (const [index, url] of mediaPlan.galleryUrls.entries()) {
    const photoNumber = index + 2; // 02, 03, 04, 05
    const key = `place/${placeId}/${String(photoNumber).padStart(2, '0')}.jpg`;
    const mediaId = await uploadToR2(url, key);
    galleryMediaIds.push(mediaId);
  }
  
  // Update places table
  await updatePlaceMedia(placeId, heroMediaId, galleryMediaIds);
}
```

**Генерация URL в UI (реализовано в `placeMedia.ts`):**
```typescript
// apps/go2asia-pwa-shell/modules/atlas/utils/placeMedia.ts
export function getPlacePhotoUrl(placeId: string, photoNumber: number): string {
  const padded = String(photoNumber).padStart(2, '0');
  return `https://media.go2asia.space/place/${placeId}/${padded}.jpg`;
}
```

---

## Статус

**Текущий этап:** ✅ Стандарт зафиксирован, UI подключен к R2  
**Реализовано:** 
- Утилита `placeMedia.ts` для генерации R2 URL
- Интеграция в PlacePreviewCard и PlaceLandingLayouts
- Обработка ошибок загрузки изображений

**Следующий шаг:** Загрузка медиа-файлов в R2 по стандарту  
**Приоритет:** P1 (после основного контента)

---

## Важно для масштабирования

⚠️ **При добавлении новых стран (VN/TH/KH/...) обязательно использовать тот же стандарт:**
- Bucket: `go2asia-media`
- Prefix: `place/{place_id}/`
- Файлы: `01.jpg` (hero), `02.jpg..05.jpg` (gallery)
- Public URL: `https://media.go2asia.space/place/{place_id}/{NN}.jpg`

**Не изобретать новые форматы!** Это защитит от проблем при масштабировании.

---

**Дата создания:** 2026-01-21  
**Дата обновления:** 2026-01-23 (стандарт зафиксирован)  
**Версия:** Atlas Content Canon v1
