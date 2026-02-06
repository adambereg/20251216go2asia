-- Content Blocks UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Content block for: 🏙️ Petronas Twin Towers
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-petronas-twin-towers',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый узнаваемый символ страны  
- 🌍 Икона современной архитектуры Азии  
- 📸 Башни, мост Skybridge и вечерняя подсветка

## Билеты и посещение

- 💰 ~98 MYR  
- 🎟️ Билеты по времени  
- 🆓 Парк KLCC — бесплатно

## Лучшие точки для фото

- 📷 Башни снизу  
- 📷 Skybridge  
- 🌅 Подсветку вечером

## Практическая информация

- **Адрес:** KLCC, Kuala Lumpur  
- **Сайт:** [https://www.petronastwintowers.com.my](https://www.petronastwintowers.com.my)  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🏙️ Skybridge  
- 🔭 Смотровую площадку  
- 🌃 Вечернюю подсветку башен

## Как добраться

- 🚇 LRT KLCC  
- 🚕 Такси / Grab  
- 🗺️ Центр города

## 🔷 Коммуникация и сервис

- 🕒 09:00–21:00  
- 🌐 Английский, малайский  
- 📶 Интернет в комплексе  
- 💳 Карты, наличные

## Полезные нюансы

- ⚠️ Билеты лучше бронировать заранее  
- 🌞 Лучше днём для вида, вечером для фото  
- 👕 Повседневная одежда  
- 🐾 —

## Локальная ценность

Башни стали символом экономического роста и национальной идентичности Малайзии.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕳️ Batu Caves
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-batu-caves',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая известная индуистская святыня Малайзии  
- 🌍 Уникальный природно-религиозный объект  
- 📸 Цветная лестница и статуя Муругана

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Отдельные пещеры — платно  
- 🆓 Основной комплекс бесплатный

## Лучшие точки для фото

- 📷 Статую Муругана  
- 📷 Лестницу  
- 🌅 Вид сверху

## Практическая информация

- **Адрес:** Batu Caves, Selangor  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🛕 Пещерный храм  
- 🧗 Подъём по 272 ступеням  
- 📷 Смотровые площадки

## Как добраться

- 🚆 KTM Batu Caves  
- 🚕 Такси / Grab  
- 🗺️ Север Куала-Лумпура

## 🔷 Коммуникация и сервис

- 🕒 06:00–21:00  
- 🌐 Английский, малайский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Осторожно с обезьянами  
- 🌞 Лучше утром  
- 👕 Закрытая одежда  
- 🐾 Не кормить животных

## Локальная ценность

Batu Caves — центр индуистской общины и место крупных религиозных фестивалей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 KLCC Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-klcc-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший парк в центре города  
- 🌍 Контраст природы и небоскрёбов  
- 📸 Башни на фоне зелени

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Башни из парка  
- 📷 Фонтан  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** KLCC Park  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🚶 Прогулку  
- 💦 Музыкальный фонтан  
- 🌅 Вечернюю подсветку

## Как добраться

- 🚇 LRT KLCC  
- 🚶 Пешком  
- 🗺️ Центр города

## 🔷 Коммуникация и сервис

- 🕒 06:00–22:00  
- 🌐 Английский  
- 📶 Интернет  
- 💳 —

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучшее время — утро и вечер  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Парк улучшает качество городской среды и доступен всем жителям.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Merdeka Square
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-merdeka-square',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Историческое сердце страны  
- 🌍 Колониальное наследие  
- 📸 Площадь и здания

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Здание султана  
- 📷 Флагшток  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Merdeka Square  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🏛️ Здание султана Абдул-Самада  
- 🚶 Прогулку по площади  
- 📷 Архитектуру

## Как добраться

- 🚇 LRT Masjid Jamek  
- 🚶 Пешком  
- 🗺️ Старый центр

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Интернет ограничен  
- 💳 —

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Площадь — символ независимости и национальной истории Малайзии.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Bukit Bintang
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-bukit-bintang',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Центр шопинга и развлечений  
- 🌍 Современный городской ритм  
- 📸 Улицы, неон и толпы

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Шопинг — по желанию  
- 🆓 Прогулка свободная

## Лучшие точки для фото

- 📷 Улицы  
- 📷 Торговые центры  
- 🌅 Ночной свет

## Практическая информация

- **Адрес:** Bukit Bintang  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🛍️ Торговые центры  
- 🍜 Уличную еду  
- 🌃 Вечернюю атмосферу

## Как добраться

- 🚇 MRT Bukit Bintang  
- 🚕 Такси  
- 🗺️ Центр города

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Карты, наличные

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Район формирует современный образ Куала-Лумпура.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Thean Hou Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-thean-hou-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых красивых храмов города  
- 🌍 Центр китайского культурного наследия в Малайзии  
- 📸 Красные пагоды, фонари и панорамный вид

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Красные пагоды и фонари  
- 📷 Центральные ворота  
- 🌅 Вид на город на закате

## Практическая информация

- **Адрес:** Thean Hou Temple, Kuala Lumpur  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🛕 Главный зал храма  
- 🏮 Двор с фонарями и арками  
- 🔭 Панораму города с территории

## Как добраться

- 🚕 Такси / Grab  
- 🚆 LRT к району Brickfields + короткий подъём  
- 🗺️ Район Robson Heights / Brickfields

## 🔷 Коммуникация и сервис

- 🕒 08:00–20:00  
- 🌐 Английский, малайский, китайский  
- 📶 Связь стабильная  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Уважайте религиозное пространство  
- 🌞 Лучше утром или к закату  
- 👕 Скромная одежда  
- 🐾 —

## Локальная ценность

Храм служит культурным центром китайской общины и важной точкой религиозных и семейных традиций.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍢 Jalan Alor Food Street
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-jalan-alor-food-street',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из Bukit Bintang  
- 🚇 MRT Bukit Bintang  
- 🗺️ Jalan Alor

## Полезные нюансы

- ⚠️ Лучше вечером  
- 🌞 Приходить голодным  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Улица поддерживает малый бизнес и гастрономическую культуру города.

## Лучшие точки для фото

- 📷 Гриль  
- 📷 Еду  
- 🌅 Ночную улицу

## Практическая информация

- **Адрес:** Jalan Alor  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшая street food улица города  
- 🌍 Кулинарное разнообразие  
- 📸 Гриль, огни и атмосфера

## 🔵 Что обязательно посмотреть / попробовать

- 🍢 Сатэй  
- 🍜 Лапшу  
- 🍤 Морепродукты

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 Свободный вход

## 🔷 Коммуникация и сервис

- 🕒 18:00–01:00  
- 🌐 Английский, малайский  
- 📶 Интернет ограничен  
- 💳 Наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Atmosphere 360
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-atmosphere-360',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ KL Tower

## Полезные нюансы

- ⚠️ Дресс-код smart casual  
- 🌞 Лучше вечером  
- 👕 Элегантная одежда  
- 🐾 —

## Локальная ценность

Ресторан — знаковая часть туристической инфраструктуры столицы.

## Лучшие точки для фото

- 📷 Город сверху  
- 📷 Интерьер  
- 🌅 Закат

## Практическая информация

- **Адрес:** KL Tower  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший вид на город  
- 🌍 Уникальный формат ресторана  
- 📸 Панорама 360°

## 🔵 Что обязательно посмотреть / попробовать

- 🍽️ Буфет  
- 🔭 Вид на город  
- 🌅 Закат

## Билеты и посещение

- 💰 💎 Premium  
- 🎟️ Бронирование обязательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 12:00–22:00  
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

-- Content block for: 🍹 Heli Lounge Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-heli-lounge-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Bukit Bintang

## Полезные нюансы

- ⚠️ Без ограждений — осторожно  
- 🌞 Лучше на закат  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Бар формирует современный и креативный образ ночного Куала-Лумпура.

## Лучшие точки для фото

- 📷 Skyline  
- 📷 Бар  
- 🌅 Закат

## Практическая информация

- **Адрес:** Bukit Bintang  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Один из самых необычных баров Азии  
- 🌍 Открытая площадка без ограждений  
- 📸 Городской skyline

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Коктейли  
- 🌃 Вид на город  
- 🌅 Закат

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Вход свободный  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 17:00–00:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Карты, наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍛 Madam Kwan’s
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-madam-kwan-s',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком в KLCC  
- 🚇 LRT KLCC  
- 🗺️ Торговые центры

## Полезные нюансы

- ⚠️ Популярно в обед  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан сохраняет и популяризирует национальную кухню Малайзии.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Интерьер  
- 🌅 Атмосферу зала

## Практическая информация

- **Адрес:** KLCC  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Эталон малайской кухни  
- 🌍 Национальные рецепты  
- 📸 Аутентичная подача

## 🔵 Что обязательно посмотреть / попробовать

- 🍽️ Nasi Lemak  
- 🍗 Rendang  
- 🍚 Рисовые блюда

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 11:00–22:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Карты, наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Bijan Bar & Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-bijan-bar-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси / Grab  
- 🚇 MRT/LRT до центра + короткая поездка  
- 🗺️ Район Bukit Bintang / центр

## Полезные нюансы

- ⚠️ Лучше бронировать заранее  
- 🌞 Лучшее время — ужин  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан продвигает малайскую гастрономию как часть культурной идентичности страны.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Интерьер  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Kuala Lumpur (центр)  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Один из лучших ресторанов малайской кухни в городе  
- 🌍 Идеально для знакомства с национальными вкусами  
- 📸 Стильный интерьер и красивая подача

## 🔵 Что обязательно посмотреть / попробовать

- 🍽️ Nasi Kerabu / блюда с травами и рисом  
- 🍗 Rendang в авторской подаче  
- 🍹 Фирменные коктейли/напитки

## Билеты и посещение

- 💰 Средний–высокий чек (💵💵 – 💎)  
- 🎟️ Бронирование желательно вечером  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 12:00–15:00, 18:00–22:30  
- 🌐 Английский, малайский  
- 📶 Wi-Fi  
- 💳 Карты, наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Central Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-central-market',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚇 MRT/LRT Pasar Seni  
- 🚶 Пешком из Merdeka Square/Chinatown  
- 🗺️ Старый центр

## Полезные нюансы

- ⚠️ Днём многолюдно  
- 🌞 Лучше в первой половине дня  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Рынок поддерживает местных мастеров, ремесленников и микро-бизнесы, сохраняя культурную ткань старого города.

## Лучшие точки для фото

- 📷 Ряды лавок  
- 📷 Сувениры и ремёсла  
- 🌅 Вечерние огни в старом центре

## Практическая информация

- **Адрес:** Central Market (Pasar Seni), Kuala Lumpur  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Удобное место для сувениров и локальных продуктов  
- 🌍 Культурный центр ремёсел Куала-Лумпура  
- 📸 Колоритные лавки и атмосфера рынка

## 🔵 Что обязательно посмотреть / попробовать

- 🍽️ Локальные закуски и сладости  
- 🛍️ Сувениры и ремесленные лавки  
- 🥤 Напитки и фрукты

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ Вход свободный  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 10:00–21:00  
- 🌐 Английский, малайский  
- 📶 Интернет в части зон  
- 💳 Наличные, иногда карты
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌉 Langkawi Sky Bridge
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-langkawi-sky-bridge',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая узнаваемая достопримечательность Лангкави  
- 🌍 Инженерное чудо в тропических горах  
- 📸 Захватывающие панорамы островов

## Билеты и посещение

- 💰 ~30–40 MYR  
- 🎟️ Билет приобретается на канатной дороге  
- 🆓 —

## Лучшие точки для фото

- 📷 Мост целиком  
- 📷 Вид на море  
- 🌅 Туман над горами

## Практическая информация

- **Адрес:** Oriental Village, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🌉 Прогулку по мосту  
- 🔭 Смотровые площадки  
- 📷 Фото над пропастью

## Как добраться

- 🚠 Канатная дорога Langkawi Cable Car  
- 🚕 Такси  
- 🗺️ Mount Mat Cincang

## 🔷 Коммуникация и сервис

- 🕒 09:30–18:00  
- 🌐 Английский, малайский  
- 📶 Интернет ограничен  
- 💳 Карты, наличные

## Полезные нюансы

- ⚠️ Может закрываться из-за погоды  
- 🌞 Лучше в ясную погоду  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Sky Bridge стал визитной карточкой острова и драйвером туристической экономики.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🚠 Langkawi Cable Car
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-langkawi-cable-car',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Экстремальные углы подъёма  
- 🌍 Лучшие виды острова  
- 📸 Джунгли и море с высоты

## Билеты и посещение

- 💰 ~35 MYR  
- 🎟️ Билет включает несколько зон  
- 🆓 —

## Лучшие точки для фото

- 📷 Кабины  
- 📷 Склоны гор  
- 🌅 Вид на острова

## Практическая информация

- **Адрес:** Pantai Kok, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🚠 Подъём на вершину  
- 🔭 Смотровые площадки  
- 📷 Фото из кабины

## Как добраться

- 🚕 Такси  
- 🗺️ Oriental Village

## 🔷 Коммуникация и сервис

- 🕒 09:30–18:00  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Карты, наличные

## Полезные нюансы

- ⚠️ Очереди в высокий сезон  
- 🌞 Лучше утром  
- 👕 Удобная одежда  
- 🐾 —

## Локальная ценность

Канатная дорога — ключевой туристический объект и работодатель для местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Kilim Karst Geoforest Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-kilim-karst-geoforest-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Природное наследие UNESCO  
- 🌍 Мангровые экосистемы  
- 📸 Скалы, орлы и реки

## Билеты и посещение

- 💰 Тур от ~200 MYR  
- 🎟️ Экскурсии  
- 🆓 —

## Лучшие точки для фото

- 📷 Скалы  
- 📷 Мангровые каналы  
- 🌅 Отражения в воде

## Практическая информация

- **Адрес:** Kilim, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🚤 Лодочный тур  
- 🦅 Наблюдение за орлами  
- 🌿 Мангровые каналы

## Как добраться

- 🚕 Такси  
- 🚤 Тур из Kilim  
- 🗺️ Северо-восток острова

## 🔷 Коммуникация и сервис

- 🕒 Днём  
- 🌐 Английский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Экскурсия лучше с гидом  
- 🌞 Лучше утром  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Геопарк поддерживает экотуризм и охрану уникальных ландшафтов Лангкави.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Pantai Cenang Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-pantai-cenang-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный курортный пляж  
- 🌍 Инфраструктура и развлечения  
- 📸 Закаты над Андаманским морем

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Лежаки — платно  
- 🆓 Общественный пляж

## Лучшие точки для фото

- 📷 Пляж  
- 📷 Закат  
- 🌅 Лодки у берега

## Практическая информация

- **Адрес:** Pantai Cenang, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🏖 Купание  
- 🍹 Пляжные бары  
- 🌅 Закат

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Запад острова

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Наличные, карты

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучшее время — утро  
- 👕 Пляжная одежда  
- 🐾 —

## Локальная ценность

Pantai Cenang — центр туристической жизни и малого бизнеса острова.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦅 Eagle Square
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-eagle-square',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный символ острова  
- 🌍 Фото-точка для туристов  
- 📸 Статуя орла и море

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Орла  
- 📷 Площадь  
- 🌅 Свет у моря

## Практическая информация

- **Адрес:** Kuah, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🦅 Статую орла  
- 🚶 Прогулку по набережной  
- 📷 Фото на фоне моря

## Как добраться

- 🚕 Такси  
- 🗺️ Kuah Jetty

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Связь стабильная  
- 💳 —

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром или вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Статуя подчёркивает природную идентичность острова и его название.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Telaga Tujuh Waterfalls
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-telaga-tujuh-waterfalls',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Природные бассейны  
- 🌍 Легендарное место  
- 📸 Джунгли и вода

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Бассейны  
- 📷 Потоки воды  
- 🌅 Свет в джунглях

## Практическая информация

- **Адрес:** Telaga Tujuh, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 💦 Купание  
- 🥾 Подъём по тропам  
- 📷 Фото каскадов

## Как добраться

- 🚕 Такси  
- 🗺️ Mount Mat Cincang

## 🔷 Коммуникация и сервис

- 🕒 Днём  
- 🌐 Английский  
- 📶 Связь слабая  
- 💳 —

## Полезные нюансы

- ⚠️ Скользкие камни  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Водопады — популярное место отдыха местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ The Cliff Restaurant & Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-the-cliff-restaurant-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Pantai Cenang

## Полезные нюансы

- ⚠️ Популярно вечером  
- 🌞 Лучше к закату  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан поддерживает туристическую привлекательность пляжной зоны.

## Лучшие точки для фото

- 📷 Террасу  
- 📷 Закат  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Pantai Cenang, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший закат на острове  
- 🌍 Романтическая атмосфера  
- 📸 Вид на океан

## 🔵 Что обязательно посмотреть / попробовать

- 🍽 Морепродукты  
- 🍹 Коктейли  
- 🌅 Закат

## Билеты и посещение

- 💰 Средний–высокий чек  
- 🎟️ Бронирование желательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 17:00–23:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Карты, наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Yellow Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-yellow-cafe',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком  
- 🗺️ Pantai Cenang

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучше к закату  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе — часть пляжной культуры и неформальной жизни острова.

## Лучшие точки для фото

- 📷 Столы на песке  
- 📷 Коктейли  
- 🌅 Закат

## Практическая информация

- **Адрес:** Pantai Cenang  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Культовое место Pantai Cenang  
- 🌍 Расслабленный beach-вайб  
- 📸 Столы прямо на песке

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Коктейли  
- 🍔 Лёгкую еду  
- 🌅 Закат

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 16:00–00:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦞 Orkid Ria Seafood Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-orkid-ria-seafood-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Kuah Town

## Полезные нюансы

- ⚠️ Лучше бронировать  
- 🌞 Подходит для ужина  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан поддерживает местных рыбаков и гастрономию Лангкави.

## Лучшие точки для фото

- 📷 Блюда  
- 📷 Аквариумы  
- 🌅 Атмосферу

## Практическая информация

- **Адрес:** Kuah, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшие морепродукты острова  
- 🌍 Популярен у местных  
- 📸 Свежие морепродукты

## 🔵 Что обязательно посмотреть / попробовать

- 🍤 Лобстеры  
- 🦀 Крабы  
- 🍽 Морские блюда

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 11:00–22:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛥️ Sunset Dinner Cruise Langkawi
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-sunset-dinner-cruise-langkawi',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси до Kuah Jetty  
- 🛥 Отправление с причала  
- 🗺️ Kuah Harbour

## Полезные нюансы

- ⚠️ Зависит от погоды  
- 🌞 Лучше бронировать заранее  
- 👕 Лёгкая курортная одежда  
- 🐾 —

## Локальная ценность

Круизы поддерживают морской туризм и локальные судоходные компании.

## Лучшие точки для фото

- 📷 Яхту на закате  
- 📷 Острова  
- 🌅 Закат над морем

## Практическая информация

- **Адрес:** Kuah Jetty, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Один из самых романтичных форматов отдыха на острове  
- 🌍 Вид на Лангкави с моря  
- 📸 Закаты, яхта и открытая палуба

## 🔵 Что обязательно посмотреть / попробовать

- 🍽 Ужин на борту  
- 🍹 Напитки  
- 🌅 Закат с палубы

## Билеты и посещение

- 💰 ~200–300 MYR  
- 🎟️ По предварительному бронированию  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 Вечером (по расписанию)  
- 🌐 Английский  
- 📶 Связь ограниченная  
- 💳 Карты, наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦐 Wonderland Food Store
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-wonderland-food-store',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🚶 Пешком от Kuah Jetty  
- 🗺️ Kuah Town

## Полезные нюансы

- ⚠️ Очереди вечером  
- 🌞 Лучше приходить пораньше  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан поддерживает локальных рыбаков и доступную гастрономию острова.

## Лучшие точки для фото

- 📷 Блюда  
- 📷 Аквариумы  
- 🌅 Атмосферу вечера

## Практическая информация

- **Адрес:** Kuah, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Любимое место местных жителей  
- 🌍 Аутентичная кухня без туристических цен  
- 📸 Морепродукты и живая атмосфера

## 🔵 Что обязательно посмотреть / попробовать

- 🍤 Крабы и креветки  
- 🍽 Рыба на гриле  
- 🍚 Простые гарниры

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 17:00–23:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🟥 Red Square
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-red-square',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный исторический центр города  
- 🌍 Яркий пример голландской архитектуры в Юго-Восточной Азии  
- 📸 Иконичные красные фасады и фонтан

## Структура комплекса

- 🏛️ Christ Church  
- 🏛️ Stadthuys (бывшая ратуша)  
- 🎨 Фотографирование на фоне площади

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Отдельные музеи — платно  
- 🆓 Свободный доступ к площади

## Лучшие точки для фото

- 📷 Красные здания  
- 📷 Фонтан  
- 🌅 Вечернее освещение

## Практическая информация

- **Адрес:** Dutch Square, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из Jonker Street  
- 🚕 Такси / Grab  
- 🗺️ Центр старого города

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский, малайский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром или вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Площадь — сердце туристического и культурного наследия Малакки, объект Всемирного наследия ЮНЕСКО.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛰️ St. Paul’s Hill & Church Ruins
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-st-paul-s-hill-church-ruins',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Одна из самых атмосферных исторических точек Малакки  
- 🌍 Связь с португальским и голландским периодами  
- 📸 Руины на фоне тропической зелени

## Структура комплекса

- 🏛️ Руины церкви Святого Павла  
- 🗿 Надгробия XVII века  
- 🔭 Панораму с вершины холма

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Руины церкви  
- 📷 Вид на реку  
- 🌅 Свет сквозь арки

## Практическая информация

- **Адрес:** St. Paul’s Hill, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком от Red Square  
- 🗺️ Старый город

## 🔷 Коммуникация и сервис

- 🕒 Днём  
- 🌐 Английский, малайский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Удобная обувь  
- 🌞 Лучше утром  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Холм — важная часть духовной и колониальной истории Малакки.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏰 A Famosa Fortress
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-a-famosa-fortress',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Единственное сохранившееся свидетельство португальской эпохи  
- 🌍 Военная история региона  
- 📸 Ворота Порта-де-Сантьяго

## Структура комплекса

- 🏯 Ворота крепости  
- 🧱 Фрагменты стен  
- 🚶 Прогулку по территории

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Ворота  
- 📷 Исторические таблички  
- 🌅 Контраст старого и нового города

## Практическая информация

- **Адрес:** Jalan Gereja, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком от St. Paul’s Hill  
- 🗺️ Старый город

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский, малайский  
- 📶 Связь стабильная  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Сохранились только фрагменты  
- 🌞 Подходит для короткой остановки  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Крепость — символ начала европейского присутствия в регионе.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Jonker Street
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-jonker-street',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Сердце культурной жизни Малакки  
- 🌍 Смешение китайской, малайской и европейской культур  
- 📸 Колоритные фасады и вывески

## Структура комплекса

- 🛍️ Антикварные магазины  
- 🍜 Уличную еду  
- 🚶 Прогулку по брусчатке

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Покупки — по желанию  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Выцветшие фасады  
- 📷 Уличные лавки  
- 🌅 Вечерние огни

## Практическая информация

- **Адрес:** Jalan Hang Jebat, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Старый город

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский, малайский, китайский  
- 📶 Интернет в кафе  
- 💳 Наличные, карты

## Полезные нюансы

- ⚠️ Очень многолюдно вечером  
- 🌞 Лучше днём и на закате  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Улица сохраняет ремесленные традиции и поддерживает малый бизнес.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Cheng Ho Cultural Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-cheng-ho-cultural-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальный музей, посвящённый китайско-малайским связям  
- 🌍 История морских экспедиций XV века  
- 📸 Реконструкция дома адмирала

## Структура комплекса

- 🖼️ Экспозиции о путешествиях Чжэн Хэ  
- 🏠 Реконструированный особняк  
- 🗺️ Карта маршрутов флота

## Билеты и посещение

- 💰 ~15 MYR  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Фасад музея  
- 📷 Интерьеры  
- 🌅 Дворик

## Практическая информация

- **Адрес:** 51 Lorong Hang Jebat, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком от Jonker Street  
- 🗺️ Старый город

## 🔷 Коммуникация и сервис

- 🕒 09:30–17:30  
- 🌐 Английский, китайский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Небольшой музей  
- 🌞 Подходит для дневного визита  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Музей подчёркивает роль Малакки как центра древних морских торговых путей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕌 Kampung Kling Mosque
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-kampung-kling-mosque',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Архитектурный гибрид трёх культур  
- 🌍 Духовный центр индийской общины Малакки  
- 📸 Яркие детали и внутренний двор

## Структура комплекса

- 🕌 Главный молитвенный зал  
- 🏮 Двор с фонтаном  
- 🧱 Декоративные элементы

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Для туристов — только внешний осмотр  
- 🆓 —

## Лучшие точки для фото

- 📷 Фасад  
- 📷 Двор  
- 🌅 Архитектурные детали

## Практическая информация

- **Адрес:** Jalan Tukang Emas, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком от Jonker Street  
- 🗺️ Старый город

## 🔷 Коммуникация и сервис

- 🕒 Вне времени молитв  
- 🌐 Малайский, английский  
- 📶 Связь стабильная  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Уважайте религиозное пространство  
- 🌞 Лучше днём  
- 👕 Закрытая одежда  
- 🐾 —

## Локальная ценность

Мечеть — живое свидетельство многонационального наследия Малакки.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ✝️ Christ Church Melaka
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-christ-church-melaka',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Архитектурная жемчужина голландской эпохи  
- 🌍 История христианства в регионе  
- 📸 Красный кирпич и белые рамы

## Структура комплекса

- ✝️ Интерьер церкви  
- 🪑 Деревянные скамьи и орган  
- 🪟 Витражи

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 —

## Лучшие точки для фото

- 📷 Фасад  
- 📷 Интерьер  
- 🌅 Свет через окна

## Практическая информация

- **Адрес:** Dutch Square, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком от Red Square  
- 🗺️ Центр старого города

## 🔷 Коммуникация и сервис

- 🕒 Вне служб  
- 🌐 Английский, малайский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Уважайте тишину  
- 🌞 Лучше днём  
- 👕 Скромная одежда  
- 🐾 —

## Локальная ценность

Церковь — символ религиозного и колониального наследия Малакки.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Nancy’s Kitchen
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-nancy-s-kitchen',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍛 Laksa Nyonya  
- 🍗 Ayam Pongteh  
- 🍰 Kueh Bengka

## Как добраться

- 🚶 Пешком от Jonker Street  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Мало мест  
- 🌞 Подходит для обеда и ужина  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан сохраняет кулинарное наследие перанакан и поддерживает семейные рецепты.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Сад  
- 🌅 Атмосферу зала

## Практическая информация

- **Адрес:** 128 Jalan Tun Tan Cheng Lock, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Аутентичная кухня перанакан  
- 🌍 Исторический интерьер  
- 📸 Садовая терраса

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Бронирование желательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 11:00–21:00  
- 🌐 Английский  
- 📶 Wi-Fi  
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

-- Content block for: ☕ The Daily Fix Cafe
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-the-daily-fix-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- ☕ V60 фильтр-кофе  
- 🥐 Австралийские тосты  
- 🍰 Домашнюю выпечку

## Как добраться

- 🚶 Пешком от Jonker Street  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Популярно утром  
- 🌞 Лучше приходить рано  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе формирует современную кофейную культуру Малакки.

## Лучшие точки для фото

- 📷 Кофе  
- 📷 Интерьер  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** 8 Jalan Hang Lekir, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший specialty coffee в Малакке  
- 🌍 Уютный интерьер в старом доме  
- 📸 Фотогеничная подача

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 08:00–18:00  
- 🌐 Английский  
- 📶 Wi-Fi  
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

-- Content block for: 🍹 Geographer Cafe
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-geographer-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍹 Коктейли  
- ☕ Кофе  
- 🍰 Десерты

## Как добраться

- 🚶 Пешком от Jonker Street  
- 🗺️ Набережная реки

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе стало символом романтической Малакки и любимым местом фотографов.

## Лучшие точки для фото

- 📷 Вид на реку  
- 📷 Мечеть в отражении  
- 🌅 Закат

## Практическая информация

- **Адрес:** 128 Jalan Kampung Pantai, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Самое фотогеничное место в Малакке  
- 🌍 Вид на реку и мечеть  
- 📸 Закаты и атмосфера

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 12:00–00:00  
- 🌐 Английский  
- 📶 Wi-Fi  
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

-- Content block for: ☕ Riverine Coffee
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-riverine-coffee',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- ☕ Эспрессо  
- 🧋 Локальные напитки  
- 🍰 Выпечку

## Как добраться

- 🚶 Пешком от Red Square  
- 🗺️ Набережная

## Полезные нюансы

- ⚠️ Мало мест  
- 🌞 Подходит для утра  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кофейня сочетает историческую атмосферу и современные стандарты.

## Лучшие точки для фото

- 📷 Вид на реку  
- 📷 Интерьер  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Jalan Merdeka, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Кофе с видом на воду  
- 🌍 Современный формат в старом здании  
- 📸 Минималистичный дизайн

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 08:00–18:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍢 Capitol Satay
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-capitol-satay',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍢 Сатэй из курицы и говядины  
- 🥜 Арахисовый соус  
- 🍚 Рис

## Как добраться

- 🚕 Такси  
- 🗺️ Capitol Theatre area

## Полезные нюансы

- ⚠️ Очереди вечером  
- 🌞 Только вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Точка — часть гастрономической идентичности Малакки.

## Лучшие точки для фото

- 📷 Гриль  
- 📷 Порции  
- 🌅 Атмосферу улицы

## Практическая информация

- **Адрес:** Jalan Bendahara, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший сатэй в городе  
- 🌍 Аутентичный стрит-фуд  
- 📸 Процесс готовки на гриле

## Билеты и посещение

- 💰 Бюджетный  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 18:00–00:00  
- 🌐 Малайский, базовый английский  
- 📶 Связь ограниченная  
- 💳 Наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Jonker Walk Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-jonker-walk-night-market',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍢 Сатэй и лапшу  
- 🥤 Дуриановые десерты  
- 🍡 Локальные сладости

## Как добраться

- 🚶 Пешком  
- 🗺️ Jonker Street

## Полезные нюансы

- ⚠️ Очень многолюдно  
- 🌞 Только по выходным  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Рынок — сердце туристической и социальной жизни Малакки.

## Лучшие точки для фото

- 📷 Ряды еды  
- 📷 Сувениры  
- 🌅 Ночную атмосферу

## Практическая информация

- **Адрес:** Jonker Street, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Главное событие уикенда в Малакке  
- 🌍 Атмосфера праздника  
- 📸 Огни, еда и толпы

## Билеты и посещение

- 💰 Бюджетный  
- 🎟️ —  
- 🆓 Свободный вход

## 🔷 Коммуникация и сервис

- 🕒 Пт–Вс, 18:00–00:00  
- 🌐 Английский, малайский  
- 📶 Связь стабильная  
- 💳 Наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏙️ George Town UNESCO World Heritage Area
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-george-town-unesco-world-heritage-area',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых атмосферных городов Юго-Восточной Азии  
- 🌍 Наследие британского колониального периода  
- 📸 Колониальные фасады и стрит-арт

## Структура комплекса

- 🚶 Прогулку по старым кварталам  
- 🏛 Колониальные здания  
- 🎨 Уличное искусство

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Музеи — платно  
- 🆓 Прогулка свободная

## Лучшие точки для фото

- 📷 Колониальные улицы  
- 📷 Стрит-арт  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** George Town, Penang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / Grab  
- 🚌 Городские автобусы  
- 🗺️ Центр острова Пенанг

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский, малайский  
- 📶 Интернет стабилен  
- 💳 Наличные, карты

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучшее время — утро и вечер  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Исторический центр сохраняет культурное разнообразие и поддерживает локальный туризм.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏔️ Penang Hill
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-penang-hill',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший вид на Пенанг  
- 🌍 Прохладный климат  
- 📸 Панорамы острова

## Структура комплекса

- 🚞 Фуникулёр  
- 🔭 Смотровые площадки  
- 🚶 Прогулки по тропам

## Билеты и посещение

- 💰 ~30 MYR  
- 🎟️ Билеты на фуникулёр  
- 🆓 —

## Лучшие точки для фото

- 📷 Вид на остров  
- 📷 Фуникулёр  
- 🌅 Закат

## Практическая информация

- **Адрес:** Penang Hill  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🚌 Автобус до нижней станции  
- 🗺️ Запад Джорджтауна

## 🔷 Коммуникация и сервис

- 🕒 06:30–23:00  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Карты, наличные

## Полезные нюансы

- ⚠️ Очереди в выходные  
- 🌞 Лучше утром  
- 👕 Лёгкая куртка  
- 🐾 —

## Локальная ценность

Penang Hill — важная природная зона и популярное место отдыха горожан.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Kek Lok Si Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-kek-lok-si-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый большой храм страны  
- 🌍 Центр буддийской культуры  
- 📸 Пагоды и скульптуры

## Структура комплекса

- 🛕 Пагоды  
- 🗿 Статую Гуань Инь  
- 🚶 Территорию комплекса

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Подъём к статуе — платно  
- 🆓 Основная территория

## Лучшие точки для фото

- 📷 Пагоды  
- 📷 Статую  
- 🌅 Вид сверху

## Практическая информация

- **Адрес:** Air Itam, Penang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🚌 Автобус  
- 🗺️ Район Air Itam

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:30  
- 🌐 Английский, китайский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Много ступеней  
- 🌞 Лучше утром  
- 👕 Скромная одежда  
- 🐾 —

## Локальная ценность

Храм — духовный центр китайской общины Пенанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Cheong Fatt Tze – Blue Mansion
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-cheong-fatt-tze-blue-mansion',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Икона архитектуры Пенанга  
- 🌍 История китайской диаспоры  
- 📸 Голубые фасады

## Структура комплекса

- 🏛 Интерьеры  
- 🎥 Экскурсию  
- 📷 Детали архитектуры

## Билеты и посещение

- 💰 ~25 MYR  
- 🎟️ Экскурсия обязательна  
- 🆓 —

## Лучшие точки для фото

- 📷 Фасад  
- 📷 Двор  
- 🌅 Свет в окнах

## Практическая информация

- **Адрес:** Leith St, George Town  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком по Джорджтауну  
- 🚕 Такси  
- 🗺️ Старый город

## 🔷 Коммуникация и сервис

- 🕒 Экскурсии днём  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Карты

## Полезные нюансы

- ⚠️ Вход только с туром  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Особняк сохраняет культурное наследие и историю многонационального Пенанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎨 Penang Street Art
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-penang-street-art',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый известный стрит-арт в Малайзии  
- 🌍 Современная городская культура  
- 📸 Интерактивные картины

## Структура комплекса

- 🎨 Рисунки  
- 🚶 Прогулку по Armenian Street  
- 📷 Фото с арт-объектами

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Интерактивные сцены  
- 📷 Улицу  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Armenian Street, Penang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком  
- 🚕 Такси  
- 🗺️ George Town

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Интернет  
- 💳 —

## Полезные нюансы

- ⚠️ Много туристов  
- 🌞 Лучше утром  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Стрит-арт стал драйвером нового туристического интереса к историческому центру.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏘 Clan Jetties of Penang
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-clan-jetties-of-penang',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальный тип поселений  
- 🌍 Живое культурное наследие  
- 📸 Дома над водой

## Структура комплекса

- 🏘 Chew Jetty  
- 🚶 Прогулку по настилам  
- 📷 Фото над морем

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Дома на сваях  
- 📷 Настилы  
- 🌅 Вид на залив

## Практическая информация

- **Адрес:** Weld Quay, Penang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком  
- 🚕 Такси  
- 🗺️ Восток George Town

## 🔷 Коммуникация и сервис

- 🕒 Днём  
- 🌐 Английский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Уважайте жителей  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Джетти сохраняют уникальный образ жизни китайских общин Пенанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Gurney Drive Hawker Centre
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-gurney-drive-hawker-centre',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍜 Char Kway Teow  
- 🍲 Assam Laksa  
- 🍤 Морепродукты

## Как добраться

- 🚕 Такси / Grab  
- 🚌 Автобус  
- 🗺️ Gurney Drive

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Приходить голодным  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Фудкорт поддерживает малый бизнес и гастрономическую идентичность Пенанга.

## Лучшие точки для фото

- 📷 Гриль  
- 📷 Еду  
- 🌅 Ночной рынок

## Практическая информация

- **Адрес:** Gurney Drive  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшая street food сцена Малайзии  
- 🌍 Кулинарный символ Пенанга  
- 📸 Гриль, дым и ночная жизнь

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 Вход свободный

## 🔷 Коммуникация и сервис

- 🕒 18:00–00:00  
- 🌐 Английский  
- 📶 Интернет ограничен  
- 💳 Наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏯 China House
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-china-house',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍰 Торты  
- ☕ Кофе  
- 🎨 Галереи

## Как добраться

- 🚶 Пешком по George Town  
- 🚕 Такси  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Подходит днём и вечером  
- 👕 Casual chic  
- 🐾 —

## Локальная ценность

China House поддерживает креативную сцену и арт-сообщество Пенанга.

## Лучшие точки для фото

- 📷 Витрину тортов  
- 📷 Интерьеры  
- 🌅 Атмосферу вечером

## Практическая информация

- **Адрес:** Beach St, George Town  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Самое необычное кафе Пенанга  
- 🌍 Искусство + еда  
- 📸 Интерьеры и витрина тортов

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 09:00–01:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Карты, наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Tek Sen Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-tek-sen-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Curry Kapitan  
- 🍲 Braised pork  
- 🍚 Домашние блюда

## Как добраться

- 🚶 Пешком  
- 🚕 Такси  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Нет бронирования  
- 🌞 Лучше приходить рано  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан сохраняет перанаканское кулинарное наследие Пенанга.

## Лучшие точки для фото

- 📷 Блюда  
- 📷 Интерьер  
- 🌅 Атмосферу

## Практическая информация

- **Адрес:** Carnarvon St, George Town  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Легенда перанаканской кухни  
- 🌍 Исторические рецепты  
- 📸 Аутентичная подача

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Очереди вечером  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 17:30–22:00  
- 🌐 Английский  
- 📶 Интернет ограничен  
- 💳 Наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 The Top Komtar Sky Dining
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-the-top-komtar-sky-dining',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Ужин с лучшим видом на город  
- 🍹 Коктейль на закате  
- 🔭 Панораму George Town с высоты

## Как добраться

- 🚶 Пешком из центра George Town  
- 🚕 Такси / Grab  
- 🚌 Автобусы до Komtar  
- 🗺️ Ориентир: Komtar Tower (центр города)

## Полезные нюансы

- ⚠️ На закате бывает очередь/полная посадка  
- 🌞 Лучшее время — закат и вечер  
- 👕 Smart casual (желательно)  
- 🐾 —

## Локальная ценность

Komtar и его смотровые пространства — важный городской якорь, поддерживающий туризм и городские сервисы.

## Лучшие точки для фото

- 📷 Панораму George Town  
- 📷 Ночной город сверху  
- 🌅 Закат над проливом

## Практическая информация

- **Адрес:** Komtar Tower, George Town, Penang  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Ужин с лучшим видом на город  
- 🌍 Современный символ Пенанга и Komtar Tower  
- 📸 Панорамы, особенно на закате и ночью

## Билеты и посещение

- 💰 Средний–высокий чек (💵💵 – 💎)  
- 🎟️ Бронирование желательно, особенно на закат  
- 🆓 Вход свободный при заказе (условия зависят от формата зоны)

## 🔷 Коммуникация и сервис

- 🕒 12:00–22:00  
- 🌐 Английский, малайский  
- 📶 Wi-Fi  
- 💳 Карты, наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏮 Jawi House Café Gallery
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-jawi-house-cafe-gallery',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Блюда Jawi Peranakan (мягкие специи, насыщенные соусы)  
- 🍛 Карри/тушёные блюда по местным рецептам  
- 🍹 Чай/напитки к десертам

## Как добраться

- 🚶 Пешком по George Town  
- 🚕 Такси / Grab  
- 🗺️ Старый город, рядом с основными улицами UNESCO-квартала

## Полезные нюансы

- ⚠️ Популярно в обед и вечером  
- 🌞 Лучше днём (спокойнее) или на ужин (атмосфернее)  
- 👕 Casual / casual chic  
- 🐾 —

## Локальная ценность

Такие места сохраняют уникальную гибридную культуру Пенанга — смешение малайских, китайских и перанаканских традиций.

## Лучшие точки для фото

- 📷 Интерьер исторического дома  
- 📷 Подачу блюд  
- 🌅 Вечерний свет в зале

## Практическая информация

- **Адрес:** George Town, Penang  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Яркий местный гастро-стиль (Jawi Peranakan)  
- 🌍 История и культура в одном месте  
- 📸 Интерьеры и подача блюд в колониальной атмосфере

## Билеты и посещение

- 💰 Средний чек (💵💵)  
- 🎟️ Бронирование желательно вечером  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 11:00–22:00  
- 🌐 Английский, малайский  
- 📶 Wi-Fi  
- 💳 Карты, наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();
