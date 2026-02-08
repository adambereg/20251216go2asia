-- Content Blocks UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Content block for: 🌆 Marina Bay Sands SkyPark
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-marina-bay-sands-skypark',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный визуальный символ Сингапура  
- 🌍 Современная архитектура мирового уровня  
- 📸 Skyline Marina Bay

## Билеты и посещение

- 💰 ~30–35 SGD  
- 🎟️ Билет по времени  
- 🆓 —

## Лучшие точки для фото

- 📷 Панораму Marina Bay  
- 📷 Небоскрёбы  
- 🌅 Закат

## Практическая информация

- **Адрес:** Marina Bay Sands  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🔭 Смотровую площадку  
- 🌃 Вечерний вид на город  
- 📷 Фото skyline

## Как добраться

- 🚇 MRT Bayfront  
- 🚶 Пешком  
- 🗺️ Marina Bay

## 🔷 Коммуникация и сервис

- 🕒 11:00–21:00  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Карты

## Полезные нюансы

- ⚠️ Очереди вечером  
- 🌞 Лучше на закат  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

SkyPark стал иконой бренда Сингапура как глобального города будущего.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Gardens by the Bay
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-gardens-by-the-bay',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый необычный парк Азии  
- 🌍 Экология и технологии  
- 📸 Supertrees и световые шоу

## Билеты и посещение

- 💰 Парк бесплатно  
- 🎟️ Оранжереи — платно  
- 🆓 Supertrees (с земли)

## Лучшие точки для фото

- 📷 Supertrees  
- 📷 Купола  
- 🌅 Вечернюю подсветку

## Практическая информация

- **Адрес:** Gardens by the Bay  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🌳 Supertree Grove  
- 🌺 Flower Dome  
- 🌃 Вечернее световое шоу

## Как добраться

- 🚇 MRT Bayfront  
- 🚶 Пешком  
- 🗺️ Marina Bay

## 🔷 Коммуникация и сервис

- 🕒 09:00–21:00  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Карты

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше вечером  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Проект символизирует экологический подход Сингапура к урбанистике.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦁 Merlion Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-merlion-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Национальный символ  
- 🌍 История города-государства  
- 📸 Фото с Marina Bay

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Статую  
- 📷 Залив  
- 🌅 Закат

## Практическая информация

- **Адрес:** Merlion Park  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🦁 Статую Мерлиона  
- 🚶 Прогулку по набережной  
- 📷 Фото на фоне skyline

## Как добраться

- 🚇 MRT Raffles Place  
- 🚶 Пешком  
- 🗺️ Marina Bay

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Интернет  
- 💳 —

## Полезные нюансы

- ⚠️ Многолюдно днём  
- 🌞 Лучше утром/вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Мерлион отражает морскую историю и идентичность Сингапура.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌸 Singapore Botanic Gardens
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-singapore-botanic-gardens',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Единственный тропический ботсад UNESCO  
- 🌍 Природа в мегаполисе  
- 📸 Орхидеи и тропики

## Билеты и посещение

- 💰 Парк бесплатно  
- 🎟️ Orchid Garden — платно  
- 🆓 Основная территория

## Лучшие точки для фото

- 📷 Орхидеи  
- 📷 Аллеи  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Botanic Gardens  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🌸 Orchid Garden  
- 🚶 Прогулки  
- 📷 Фото растений

## Как добраться

- 🚇 MRT Botanic Gardens  
- 🚶 Пешком  
- 🗺️ Central Singapore

## 🔷 Коммуникация и сервис

- 🕒 05:00–00:00  
- 🌐 Английский  
- 📶 Интернет  
- 💳 —

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Сад отражает баланс урбанизма и природы в Сингапуре.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝 Sentosa Island
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-sentosa-island',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главная зона отдыха  
- 🌍 Пляжи и развлечения  
- 📸 Курортная атмосфера

## Билеты и посещение

- 💰 Въезд платный  
- 🎟️ Парки — отдельно  
- 🆓 Пляжи

## Лучшие точки для фото

- 📷 Пляжи  
- 📷 Resorts  
- 🌅 Закат

## Практическая информация

- **Адрес:** Sentosa Island  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🏖 Пляжи  
- 🎢 Аттракционы  
- 🌅 Закат у моря

## Как добраться

- 🚠 Канатная дорога  
- 🚕 Такси  
- 🗺️ South Singapore

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Карты

## Полезные нюансы

- ⚠️ Многолюдно  
- 🌞 Лучше в будни  
- 👕 Пляжная одежда  
- 🐾 —

## Локальная ценность

Sentosa развивает индустрию развлечений и туризма.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💧 Jewel Changi Airport
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-jewel-changi-airport',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый красивый аэропорт мира  
- 🌍 Архитектура и природа  
- 📸 Водопад Rain Vortex

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Аттракционы — платно  
- 🆓 Основная зона

## Лучшие точки для фото

- 📷 Водопад  
- 📷 Купол  
- 🌅 Вечернюю подсветку

## Практическая информация

- **Адрес:** Changi Airport  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 💦 Rain Vortex  
- 🛍 Шопинг  
- 📷 Фото купола

## Как добраться

- 🚇 MRT Changi  
- 🚶 Пешком  
- 🗺️ Changi

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Карты

## Полезные нюансы

- ⚠️ Многолюдно  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Jewel стал визитной карточкой инновационного подхода Сингапура к инфраструктуре.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍢 Lau Pa Sat Hawker Centre
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-lau-pa-sat-hawker-centre',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚇 MRT Raffles Place  
- 🚶 Пешком  
- 🗺️ CBD

## Полезные нюансы

- ⚠️ Очереди вечером  
- 🌞 Лучше ночью  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Hawker-центры — основа гастрономической культуры Сингапура (UNESCO).

## Лучшие точки для фото

- 📷 Satay  
- 📷 Фудкорты  
- 🌅 Ночной рынок

## Практическая информация

- **Адрес:** Lau Pa Sat  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший hawker-опыт  
- 🌍 Национальная кухня  
- 📸 Сатэ-стрит вечером

## 🔵 Что обязательно посмотреть / попробовать

- 🍢 Satay  
- 🍜 Локальные блюда  
- 🌃 Ночная атмосфера

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 Вход свободный

## 🔷 Коммуникация и сервис

- 🕒 24/7  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Наличные, карты
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍸 Atlas Rooftop Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-atlas-rooftop-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Bugis

## Полезные нюансы

- ⚠️ Строгий дресс-код  
- 🌞 Лучше вечером  
- 👕 Smart elegant  
- 🐾 —

## Локальная ценность

Atlas формирует имидж Сингапура как столицы luxury-лайфстайла.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Коктейли  
- 🌅 Зал вечером

## Практическая информация

- **Адрес:** Bugis, Singapore  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Один из самых красивых баров Азии  
- 🌍 Архитектура и дизайн  
- 📸 Интерьер и коктейли

## 🔵 Что обязательно посмотреть / попробовать

- 🍸 Коктейли  
- 🏛 Интерьер  
- 🌅 Атмосферу вечера

## Билеты и посещение

- 💰 💎 Premium  
- 🎟️ Дресс-код  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 17:00–01:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Карты
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦀 Jumbo Seafood
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-jumbo-seafood',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚇 MRT Clarke Quay  
- 🚶 Пешком  
- 🗺️ Riverside

## Полезные нюансы

- ⚠️ Туристическое место  
- 🌞 Лучше бронировать  
- 👕 Casual chic  
- 🐾 —

## Локальная ценность

Ресторан поддерживает гастрономическую репутацию Сингапура.

## Лучшие точки для фото

- 📷 Краба  
- 📷 Подачу  
- 🌅 Вечерний берег

## Практическая информация

- **Адрес:** Clarke Quay  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший чили-краб в городе  
- 🌍 Кулинарная визитка Сингапура  
- 📸 Подача морепродуктов

## 🔵 Что обязательно посмотреть / попробовать

- 🦀 Chili Crab  
- 🍤 Морепродукты  
- 🍚 Рис и соусы

## Билеты и посещение

- 💰 Средний–высокий чек  
- 🎟️ Очереди вечером  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 12:00–23:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Карты
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Maxwell Food Centre
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-maxwell-food-centre',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚇 MRT Tanjong Pagar  
- 🚶 Пешком  
- 🗺️ Chinatown / Maxwell Road

## Полезные нюансы

- ⚠️ Очереди в обед  
- 🌞 Лучше приходить рано  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Hawker-центры — ядро повседневной гастрономии Сингапура и часть культурного наследия (в том числе UNESCO).

## Лучшие точки для фото

- 📷 Ряды киосков  
- 📷 Блюда  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Maxwell Food Centre, Singapore  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Подлинный hawker-опыт Сингапура  
- 🌍 Легендарные блюда “как едят местные”  
- 📸 Атмосфера рынка и фудкорта

## 🔵 Что обязательно посмотреть / попробовать

- 🍗 Chicken Rice  
- 🍜 Локальную лапшу/супы  
- 🥤 Холодные напитки и десерты

## Билеты и посещение

- 💰 Бюджетно  
- 🎟️ —  
- 🆓 Вход свободный

## 🔷 Коммуникация и сервис

- 🕒 08:00–22:00  
- 🌐 Английский  
- 📶 Интернет ограничен  
- 💳 Наличные (часто), иногда карты/QR
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽 Odette
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-odette',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚇 MRT City Hall  
- 🚶 Пешком  
- 🗺️ National Gallery Singapore

## Полезные нюансы

- ⚠️ Smart elegant  
- 🌞 Лучше бронировать заранее  
- 👕 Дресс-код (опрятно/элегантно)  
- 🐾 —

## Локальная ценность

Fine dining формирует международный престиж Сингапура и развивает индустрию высокой гастрономии.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Интерьер  
- 🌅 Атмосферу вечера

## Практическая информация

- **Адрес:** National Gallery Singapore  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Ресторан мирового класса  
- 🌍 Гастрономический must-try для любителей fine dining  
- 📸 Авторская подача и интерьер

## 🔵 Что обязательно посмотреть / попробовать

- 🍽 Дегустационный сет  
- 🍷 Wine pairing  
- 🍰 Десерты шефа

## Билеты и посещение

- 💰 💎 Premium  
- 🎟️ Бронирование обязательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 12:00–14:30, 18:30–22:30  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Карты
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍹 Long Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-long-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚇 MRT City Hall / Esplanade  
- 🚶 Пешком  
- 🗺️ Raffles Hotel

## Полезные нюансы

- ⚠️ Туристическое место, цены выше  
- 🌞 Лучше вечером  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Long Bar — часть культурной истории и туристического бренда Сингапура.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Коктейль  
- 🌅 Атмосферу вечера

## Практическая информация

- **Адрес:** Raffles Hotel, Singapore  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Исторический бар №1 в стране  
- 🌍 Колониальное наследие Сингапура  
- 📸 Атмосфера “старого Сингапура”

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Singapore Sling  
- 🥜 Классические снеки  
- 🏛 Интерьер Long Bar

## Билеты и посещение

- 💰 Высокий чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 12:00–23:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Карты
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- BEGIN ATLAS_COUNTRY_CITY_TABS
-- Generated: 2026-02-08T16:33:10.714Z
-- Blocks: 25

-- city/sgp tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/city-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgp',
  'overview',
  'ru',
  'Обзор',
  'Сингапур — город-государство и один из самых развитых мегаполисов мира. Это глобальный финансовый, технологический и логистический хаб, известный строгими законами, высоким уровнем безопасности и качеством городской среды.

Сингапур часто выбирают предприниматели, инвесторы и высококвалифицированные специалисты. Город не ориентирован на бюджетную жизнь, но предлагает предсказуемость, прозрачные правила, отличную медицину, образование и инфраструктуру мирового уровня.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgp tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/city-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgp',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: marina-bay
    title: Marina Bay
    description: Финансовое и символическое сердце города с небоскрёбами, набережными и знаковыми объектами.
  - id: orchard
    title: Orchard Road
    description: Главный торговый и жилой район с премиальными кондоминиумами и моллами.
  - id: cbd
    title: Central Business District (CBD)
    description: Деловой центр с офисами международных компаний и финансовых институтов.
  - id: tanjong-pagar
    title: Tanjong Pagar
    description: Район смешанной застройки с офисами, жильём и активной городской жизнью.
  - id: bugis
    title: Bugis
    description: Культурно-деловой район с университетами, музеями и креативной средой.
  - id: sentosa
    title: Sentosa
    description: Курортный остров с пляжами, отелями и развлекательными комплексами.
  - id: east-coast
    title: East Coast
    description: Жилой район у моря с парками, велосипедными дорожками и спокойной атмосферой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgp tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/city-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgp',
  'accommodation',
  'ru',
  'Проживание',
  'Жильё в Сингапуре представлено современными кондоминиумами и государственными жилыми комплексами (HDB). Иностранцам доступны в основном частные кондо и сервисные апартаменты.

Стоимость аренды высокая и является одной из самых высоких в Азии. При этом жильё отличается высоким качеством, безопасностью и развитой инфраструктурой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgp tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/city-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgp',
  'food',
  'ru',
  'Еда и кафе',
  'Сингапур считается одной из гастрономических столиц мира. Здесь сосуществуют хоукер-центры с доступной едой и рестораны высокой кухни, отмеченные Michelin.

Кухня отражает мультикультурный состав города: китайская, малайская, индийская, перанаканская и международная кухни представлены повсеместно.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgp tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/city-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgp',
  'transport',
  'ru',
  'Транспорт',
  'Сингапур обладает одной из лучших транспортных систем в мире: метро MRT, автобусы, такси и пешая инфраструктура.

Общественный транспорт покрывает практически весь город. Использование личного автомобиля ограничено высокой стоимостью владения.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgp tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/city-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgp',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат экваториальный: жарко и влажно круглый год. Температуры обычно держатся в диапазоне +26…+32 °C.

Дожди возможны в любое время года, чаще в период муссонов (ноябрь–январь), но они, как правило, кратковременные.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgp tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/city-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgp',
  'shopping',
  'ru',
  'Шопинг',
  'Сингапур — один из крупнейших торговых центров Азии. Здесь представлены люксовые бренды, электроника, локальные дизайнеры и duty-free зоны.

Основные зоны шопинга — Orchard Road, Marina Bay и крупные моллы по всему городу.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgp tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/city-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgp',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь Сингапура умеренная и регулируемая. Работают бары, rooftop-лаунжи, клубы и концертные площадки.

Формат развлечений более сдержанный по сравнению с соседними странами, но отличается высоким уровнем сервиса.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgp tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/city-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgp',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - business_hub
  - relocation
  - expat_life
  - premium_city',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgp tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/city-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgp',
  'tips',
  'ru',
  'Практическая информация',
  'Сингапур считается одним из самых безопасных городов мира. Законы строгие, штрафы высокие, но это обеспечивает порядок и предсказуемость.

Английский язык является основным языком общения. Медицинская и образовательная системы входят в число лучших в мире.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgp tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/city-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgp',
  'reviews',
  'ru',
  'Отзывы',
  '@reviews:
  source: city',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgp tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/city-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgp',
  'budget',
  'ru',
  'Цены и бюджет',
  'Сингапур — один из самых дорогих городов мира. Комфортный бюджет одного человека составляет 3000–5000 USD в месяц.

Аренда жилья начинается от 1800–2500 USD за небольшую квартиру, расходы на питание и транспорт также высокие.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'overview',
  'ru',
  'Обзор',
  'Сингапур — один из самых развитых и технологически продвинутых городов-государств мира. Он сочетает ультрасовременную инфраструктуру, строгие правила, высокий уровень жизни и мультикультурную среду. За несколько десятилетий Сингапур прошёл путь от торгового порта до глобального финансового, логистического и инновационного хаба.

Страна привлекает предпринимателей, инвесторов, высококвалифицированных специалистов и экспатов, ориентированных на стабильность, безопасность и понятные правила игры. Сингапур не является бюджетным направлением, но предлагает высокий уровень сервиса, медицины, образования и деловой среды.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=gallery (Фотогалерея) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'gallery',
  'ru',
  'Фотогалерея',
  '@gallery:

* singapore_marina_bay_skyline.jpg
* singapore_gardens_by_the_bay.jpg
* singapore_orchard_road.jpg
* singapore_chinatown.jpg
* singapore_sentosa_island.jpg',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=map (Карта) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'map',
  'ru',
  'Карта',
  '@map:
center: [1.3521, 103.8198]
zoom: 11',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=weather (Погода и климат) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'weather',
  'ru',
  'Погода и климат',
  'Климат Сингапура экваториальный: жарко и влажно круглый год, без выраженной смены сезонов.

### Сезоны

* Относительно более сухой период: февраль — апрель
* Более дождливые месяцы: ноябрь — январь

Средние температуры держатся в диапазоне +26…+32 °C. Осадки распределены равномерно в течение года и обычно кратковременные.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=history (История) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'history',
  'ru',
  'История',
  'История современного Сингапура начинается в XIX веке, когда он стал британским торговым портом. Благодаря стратегическому положению на морских путях между Востоком и Западом город быстро превратился в ключевой логистический центр региона.

В 1965 году Сингапур получил независимость и под руководством Ли Куан Ю начал масштабные реформы, сделавшие страну одной из самых успешных экономик мира. Сегодня Сингапур — пример эффективного государственного управления и долгосрочного стратегического планирования.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=geography (География) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'geography',
  'ru',
  'География',
  'Сингапур — островное государство, расположенное на юге Малаккского полуострова. Территория страны включает основной остров и более 60 мелких островов.

Несмотря на небольшую площадь, Сингапур активно расширяет территорию за счёт намывных земель. Город отличается высокой плотностью застройки и продуманным зонированием.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=culture (Культура) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'culture',
  'ru',
  'Культура',
  'Сингапур — мультикультурное общество, где сосуществуют китайская, малайская, индийская и западная культуры. Государство продвигает идею гармонии и равных возможностей при строгом соблюдении законов.

Культура проявляется в кухне, кварталах, праздниках и языковом разнообразии. Толерантность сочетается с высокой социальной дисциплиной.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=living (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'living',
  'ru',
  'Проживание',
  'Жильё в Сингапуре представлено современными кондоминиумами и государственными жилыми комплексами (HDB). Для иностранцев доступны в основном частные кондо.

Стоимость аренды одна из самых высоких в Азии. При этом жильё отличается высоким качеством, безопасностью и развитой инфраструктурой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=visas (Визы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'visas',
  'ru',
  'Визы',
  'Сингапур предлагает прозрачную и строгую визовую систему. Для краткосрочных визитов доступен безвизовый въезд для граждан многих стран.

Для работы и проживания используются Employment Pass, S Pass, EntrePass и другие типы разрешений. Получение визы требует соответствия высоким профессиональным и финансовым критериям.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=business (Бизнес) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'business',
  'ru',
  'Бизнес',
  'Сингапур — один из лучших городов мира для ведения бизнеса. Прозрачная правовая система, низкий уровень коррупции и доступ к глобальным рынкам делают его привлекательным для компаний любого масштаба.

Ключевые отрасли: финансы, финтех, IT, биотехнологии, логистика, образование и международная торговля. Страна активно поддерживает стартапы и инновации.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=phrasebook (Разговорник) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'phrasebook',
  'ru',
  'Разговорник',
  '* Здравствуйте — Hello
* Спасибо — Thank you
* Пожалуйста — You’re welcome
* Извините — Sorry
* Сколько стоит? — How much is it?
* Где находится …? — Where is …?',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=reviews (Отзывы экспатов) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'reviews',
  'ru',
  'Отзывы экспатов',
  '@reviews:
source: expats',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/sg tab=calculator (Калькулятор стоимости) from E:/projects/work_go2asia/20251216go2asia/content/atlas/singapore/country-singapore.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'sg',
  'calculator',
  'ru',
  'Калькулятор стоимости',
  '@cost_calculator:
enabled: true',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- END ATLAS_COUNTRY_CITY_TABS


