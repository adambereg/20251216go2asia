# Country Gallery (R2) — smoke checklist

## Цель

Сделать так, чтобы:

- вкладка **Atlas → Страна → “Фотогалерея”** рендерила **картинки из R2**, а не markdown со списком файлов;
- **hero/cover** страны (hero на странице + превью карточки) автоматически брались из R2, предпочитая файл, который начинается с `01_`.

## R2 key convention

- **prefix**: `country/country-<country_id>/`
- **пример**: `country/country-la/01_cover_Mekong_River_Delta.jpg`

## API

- **GET** ` /v1/content/countries/:idOrSlug/gallery?limit=50 `
  - response:
    - `countryId`
    - `prefix`
    - `items[]: { key, url, isCover }`

## Правила сортировки

- сначала файлы с именем, начинающимся на `01_`
- затем остальные **лексикографически по имени файла**

## Hero/cover (fallback)

- если в БД для страны есть `hero_media_id` → используется `media_files.public_url` (приоритет ручного override)
- если hero в БД пустой → берём cover из R2:
  - `01_*` если есть
  - иначе первый файл по сортировке

## Smoke checklist (ручная проверка)

### 1) Галерея

- Загрузить/убедиться, что в R2 есть файлы по префиксу `country/country-la/`.
- Открыть:
  - `/atlas/countries/la/gallery`
- Ожидаемо:
  - видна сетка изображений
  - по клику открывается lightbox
  - если добавить новый файл в R2 в эту же папку — он появляется в галерее без правок БД/markdown

### 2) Cover = `01_*`

- Убедиться, что в R2 в `country/country-la/` есть файл `01_*`.
- Открыть:
  - `/atlas/countries/la`
  - `/atlas/countries` (листинг стран)
- Ожидаемо:
  - hero на странице Лаоса = `01_*`
  - превью карточки Лаоса в списке стран = `01_*`

### 3) Fallback на markdown

- Если в R2 папке страны **нет** изображений:
  - вкладка `/gallery` показывает markdown-контент (если он есть) или текст “Фото пока не загружены.”

