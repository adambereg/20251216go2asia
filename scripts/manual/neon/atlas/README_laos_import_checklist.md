## Laos import checklist (Neon SQL Editor)

Цель: контролируемо переимпортировать Atlas Places для Лаоса из экспортных артефактов в Neon и убедиться, что UI/API/DB видят **полный overview/ru**.

---

### 0) Перед началом

- Используем **staging** ветку/базу в Neon (не production).
- В Neon → SQL Editor выполняем скрипты **целиком** (вставка всего файла).

---

### 1) Pilot: 1 place (vte-pha-that-luang)

1) Выполнить в Neon SQL Editor:
- `scripts/manual/neon/atlas/laos_pilot_1_place.sql`

2) Проверить SQL outputs (в конце скрипта):
- Place row найден по `id='vte-pha-that-luang'`
- Content block найден по `(entity_type='place', tab_key='overview', lang='ru', entity_id='vte-pha-that-luang')`
- `body_len` выглядит “не маленьким”
- Флаги `has_*` = TRUE для ключевых секций

3) Проверить API (staging):
- `GET /v1/content/places/vte-pha-that-luang/tabs?tabKey=overview&lang=ru`
- Ожидание:
  - в ответе присутствует `items[0].bodyMarkdown`
  - `bodyMarkdown` содержит ключевые заголовки секций (например “Почему это важно”, “Как добраться”, “Практическая информация”)

4) Проверить UI карточку (staging):
- Открыть place по slug/id: `vte-pha-that-luang`
- Ожидание:
  - секции отображаются по канону (SectionContentRenderer)
  - “Коммуникация и сервис” присутствует (как raw-секция, если не замапплена)
  - нет “потерь” секций относительно markdown

**Успех пилота**: контент полный, секции не теряются, API и UI показывают то же, что `content_blocks.body_markdown`.

---

### 1b) Pilot 2 — Business Place (vte-kualao-restaurant)

1) Выполнить в Neon SQL Editor:
- `scripts/manual/neon/atlas/laos_pilot_1_business_place.sql`

2) Проверить SQL outputs (в конце скрипта):
- Place row найден по `id='vte-kualao-restaurant'`
- Content block найден по `(entity_type='place', tab_key='overview', lang='ru', entity_id='vte-kualao-restaurant')`
- `body_len` выглядит “не маленьким”
- В boolean checks:
  - `has_must_try = TRUE`
  - `has_service_raw = TRUE`
  - `has_nuances = TRUE`
  - `has_practical_info = TRUE`
  - price signal (`has_price_signal`) ожидаемо TRUE (даже если нет заголовка “Цены”)

3) Проверить API (staging):
- `GET /v1/content/places/vte-kualao-restaurant/tabs?tabKey=overview&lang=ru`
- Ожидание:
  - в ответе `items[0].bodyMarkdown`
  - присутствуют ключевые заголовки business-секций (например “Что попробовать обязательно”, “Коммуникация и сервис”, “Полезные нюансы”)

4) Проверить UI карточку business place (staging):
- Открыть place по slug/id: `vte-kualao-restaurant`
- Ожидание:
  - рендер соответствует ветке business layout (если есть)
  - секции “что попробовать / сервис / нюансы / практика” отображаются и не теряются
  - секции не “переезжают” в неожиданные места/не исчезают

**Успех Pilot 2**: business-контент проходит цепочку Neon → API tabs → UI без потерь секций.

---

### 2) Full: Laos (все места)

1) Выполнить в Neon SQL Editor:
- `scripts/manual/neon/atlas/laos_full_all_places.sql`

2) Проверить сводные метрики (в конце скрипта):
- `laos_places_total` = 58 (ожидаемо по экспорту)
- coverage:
  - `places_total` = 58
  - `places_with_overview` = 58
- top-10 shortest overview:
  - нет подозрительно коротких (визуально: не “пустышки”)
- orphan blocks:
  - global orphan не растёт неожиданно

3) Проверить API/UI на нескольких местах:
- 1–2 showplace и 1–2 business
- проверить, что в `bodyMarkdown` и на UI есть ключевые секции

**Успех Laos full**: 58/58 покрытие overview/ru, без коротких пустых блоков, UI отображает секции корректно.

---

### Next step после Laos (массовый импорт по всем странам)

Общий принцип для каждой страны:
1) Выполнить `exports/neon/<country>/places.sql`
2) Выполнить `exports/neon/<country>/content_blocks.sql`
3) Прогнать health-check (по аналогии с метриками из `laos_full_all_places.sql`):
   - count places по `country_id`
   - coverage overview/ru
   - top shortest overview
   - orphan content_blocks

