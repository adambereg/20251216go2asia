-- Content Blocks UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Content block for: 🛕 Pha That Luang
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-pha-that-luang',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая важная святыня Лаоса  
- 🌍 Символ государственности и буддизма  
- 📸 Золотая ступа на фоне неба

## Структура комплекса

- 🛕 Главную ступу  
- 🚶 Прогулку по храмовому комплексу  
- 📷 Осмотр внутренних дворов

## Билеты и посещение

- 💰 ~30 000 LAK  
- 🎟️ Билет на входе  
- 🆓 Внешняя территория бесплатна

## Лучшие точки для фото

- 📷 Золотую ступу  
- 📷 Симметрию комплекса  
- 🌅 Свет на закате

## Практическая информация

- **Адрес:** That Luang, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / тук-тук  
- 🛵 Байк  
- 🗺️ Северо-восток центра Вьентьяна

## 🔷 Коммуникация и сервис

- 🕒 08:00–16:00  
- 🌐 Лаосский, английский  
- 📶 Интернет отсутствует  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Строгий дресс-код  
- 🌞 Лучше посещать утром  
- 👕 Закрытые плечи и колени  
- 🐾 —

## Локальная ценность

Pha That Luang — духовное сердце страны и место проведения национальных праздников.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Patuxai
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-patuxai',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый узнаваемый монумент столицы  
- 🌍 История независимости Лаоса  
- 📸 Вид с обзорной площадки

## Структура комплекса

- 🏛 Архитектуру арки  
- 🔭 Подъём на смотровую площадку  
- 🚶 Прогулку по парку

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Подъём наверх — платно  
- 🆓 Нижняя часть бесплатна

## Лучшие точки для фото

- 📷 Арку снизу  
- 📷 Панораму города  
- 🌅 Закат

## Практическая информация

- **Адрес:** Patuxai Park, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Lane Xang Avenue

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Лаосский, английский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Памятник символизирует национальную гордость и современную историю Лаоса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Wat Si Saket
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-wat-si-saket',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый древний храм столицы  
- 🌍 Уникальная коллекция Будд  
- 📸 Атмосфера тишины

## Структура комплекса

- 🛕 Галереи со статуями  
- 🚶 Внутренний двор  
- 📷 Детали росписей

## Билеты и посещение

- 💰 ~30 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Ниши со статуями  
- 📷 Внутренний двор  
- 🌅 Мягкий свет

## Практическая информация

- **Адрес:** Ave Lane Xang, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Старый город

## 🔷 Коммуникация и сервис

- 🕒 08:00–16:00  
- 🌐 Лаосский, английский  
- 📶 Интернет отсутствует  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Фото без вспышки  
- 🌞 Лучше утром  
- 👕 Закрытая одежда  
- 🐾 —

## Локальная ценность

Храм сохраняет буддийское наследие и историческую память города.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏥 COPE Visitor Centre
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-cope-visitor-centre',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Важный социальный проект  
- 🌍 Современная история Лаоса  
- 📸 Информационные экспозиции

## Структура комплекса

- 🖥 Экспозиции  
- 🎥 Документальные фильмы  
- 📚 Информационные стенды

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Экспозиции  
- 📷 Информационные панели  
- 🌅 Архитектуру здания

## Практическая информация

- **Адрес:** COPE Centre, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Центр города

## 🔷 Коммуникация и сервис

- 🕒 09:00–16:00  
- 🌐 Лаосский, английский  
- 📶 Интернет  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Эмоционально тяжёлые темы  
- 🌞 Лучше днём  
- 👕 Повседневная одежда  
- 🐾 —

## Локальная ценность

Центр повышает осведомлённость о гуманитарных проблемах и поддерживает пострадавших.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🗿 Buddha Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-buddha-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая необычная достопримечательность Вьентьяна  
- 🌍 Синтез буддизма и индуизма  
- 📸 Монументальные скульптуры

## Структура комплекса

- 🗿 Скульптуры  
- 🚶 Прогулку по парку  
- 📷 Осмотр панорам

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Большие скульптуры  
- 📷 Детали  
- 🌅 Вид на Меконг

## Практическая информация

- **Адрес:** Xieng Khuan, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🚌 Автобус  
- 🗺️ ~25 км от центра

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Лаосский, английский  
- 📶 Связь ограниченная  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Парк стал культурным феноменом и туристическим символом окрестностей Вьентьяна.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Mekong Riverside Promenade
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-mekong-riverside-promenade',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшее место для вечерних прогулок  
- 🌍 Связь города с рекой  
- 📸 Закаты над Меконгом

## Структура комплекса

- 🚶 Прогулку по набережной  
- 🛍 Ночные рынки  
- 🌅 Закат

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Реку  
- 📷 Вечерние огни  
- 🌅 Закат

## Практическая информация

- **Адрес:** Mekong Riverside, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Берег Меконга

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Лаосский, английский  
- 📶 Интернет стабильный  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Активно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Набережная является общественным пространством и центром городской жизни.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Kualao Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-kualao-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Традиционные блюда  
- 🍚 Липкий рис  
- 🍲 Сеты лаосской кухни

## Как добраться

- 🚕 Такси  
- 🚶 Пешком из центра  
- 🗺️ Центральный Вьентьян

## Полезные нюансы

- ⚠️ Спокойная атмосфера  
- 🌞 Подходит для вечера  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан сохраняет и продвигает гастрономическое наследие Лаоса.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Подачу блюд  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Vientiane Centre  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Эталон лаосской кухни  
- 🌍 Культурное заведение столицы  
- 📸 Элегантный интерьер

## Билеты и посещение

- 💰 Средний–высокий чек  
- 🎟️ Бронирование желательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 11:00–22:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍽️ Makphet Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-makphet-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Современные интерпретации  
- 🍲 Супы и карри  
- 🍰 Десерты

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Рядом с набережной

## Полезные нюансы

- ⚠️ Закрыто по воскресеньям  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Заведение поддерживает образовательные программы для молодёжи.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Блюда  
- 🌅 Атмосферу

## Практическая информация

- **Адрес:** Near Mekong, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Социальный проект  
- 🌍 Современная лаосская кухня  
- 📸 Уютная атмосфера

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Бронирование желательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 11:30–21:30  
- 🌐 Лаосский, английский  
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

-- Content block for: 🌃 Bor Pen Nyang Rooftop
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-bor-pen-nyang-rooftop',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍹 Коктейли  
- 🎶 Живую музыку  
- 🌅 Закат над рекой

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Mekong Riverside

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Заведение стало центром вечерней социальной жизни столицы.

## Лучшие точки для фото

- 📷 Вид на реку  
- 📷 Музыкальную сцену  
- 🌅 Закат

## Практическая информация

- **Адрес:** Mekong Riverside, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший rooftop у реки  
- 🌍 Живая музыка и городской вайб  
- 📸 Панорамы Меконга и закаты

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Вход свободный  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 17:00–00:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍛 Taj Mahal Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-taj-mahal-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Карри  
- 🫓 Наан  
- 🍚 Рис басмати

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Downtown Vientiane

## Полезные нюансы

- ⚠️ Подходит для вегетарианцев  
- 🌞 В любое время дня  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан расширяет гастрономическое разнообразие столицы.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Интерьер  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший индийский ресторан города  
- 🌍 Разнообразие вкусов  
- 📸 Колоритная подача

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

-- Content block for: 🥐 Scandinavian Bakery
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-scandinavian-bakery',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🥐 Выпечку  
- ☕ Кофе  
- 🍳 Завтраки

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Downtown Vientiane

## Полезные нюансы

- ⚠️ Многолюдно утром  
- 🌞 Лучшее время — завтрак  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе стало частью повседневной жизни экспатского и туристического сообщества.

## Лучшие точки для фото

- 📷 Витрину  
- 📷 Кофе  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшие завтраки и хлеб  
- 🌍 Европейская атмосфера  
- 📸 Витрина с выпечкой

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 07:00–18:00  
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

-- Content block for: 🍢 Ban Anou Night Market Food Court
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-ban-anou-night-market-food-court',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍢 Уличные блюда  
- 🍜 Лапшу  
- 🥤 Напитки

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Рядом с Mekong Riverside

## Полезные нюансы

- ⚠️ Простые условия  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Фудкорт поддерживает малый бизнес и повседневную гастрономию Вьентьяна.

## Лучшие точки для фото

- 📷 Ряды еды  
- 📷 Процесс готовки  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Ban Anou, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Локальная уличная еда  
- 🌍 Аутентичная атмосфера  
- 📸 Вечерний рынок

## Билеты и посещение

- 💰 Бюджетный  
- 🎟️ —  
- 🆓 Вход свободный

## 🔷 Коммуникация и сервис

- 🕒 17:00–22:00  
- 🌐 Лаосский  
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

-- Content block for: 💦 Blue Lagoon 1
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-blue-lagoon-1',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главная природная локация Вангвьенга  
- 🌍 Символ активного туризма региона  
- 📸 Бирюзовая вода и карстовые пейзажи

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Лагуну сверху  
- 📷 Прыжки в воду  
- 🌅 Свет среди скал

## Практическая информация

- **Адрес:** Blue Lagoon Area, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 💦 Купание в лагуне  
- 🤸 Прыжки с тарзанки  
- 🌿 Отдых у воды

## Как добраться

- 🚕 Такси / тук-тук  
- 🛵 Байк  
- 🗺️ ~7 км от центра города

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Лаосский, базовый английский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Многолюдно днём  
- 🌞 Лучше приезжать утром  
- 👕 Купальная одежда  
- 🐾 Осторожно на скользких камнях

## Локальная ценность

Лагуна обеспечивает доход для местных общин и поддерживает туризм Вангвьенга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕳️ Tham Chang Cave
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-tham-chang-cave',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая доступная пещера Вангвьенга  
- 🌍 Историческое укрытие времён войн  
- 📸 Панорама долины

## Билеты и посещение

- 💰 ~15 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Вид из пещеры  
- 📷 Вход в грот  
- 🌅 Долину реки

## Практическая информация

- **Адрес:** Tham Chang, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🕳 Осмотр пещеры  
- 🔭 Смотровую площадку  
- 🚶 Прогулку по тропе

## Как добраться

- 🚶 Пешком из города  
- 🗺️ Восточная часть Вангвьенга

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Лаосский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Внутри темно  
- 🌞 Лучше днём  
- 👕 Удобная обувь  
- 🐾 Осторожно на лестницах

## Локальная ценность

Пещера — часть исторического и природного наследия региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛟 Nam Song River Tubing
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-nam-song-river-tubing',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самое известное развлечение города  
- 🌍 Символ backpacker-культуры  
- 📸 Карстовые горы и река

## Билеты и посещение

- 💰 Аренда тюбинга ~60 000 LAK  
- 🎟️ Оплата на старте  
- 🆓 —

## Лучшие точки для фото

- 📷 Реку и горы  
- 📷 Сплав  
- 🌅 Закат у воды

## Практическая информация

- **Адрес:** Nam Song River  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🛟 Тюбинг  
- 🚣 Спокойный сплав  
- 🍹 Барные остановки (по желанию)

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Река Нам Сонг

## 🔷 Коммуникация и сервис

- 🕒 Днём  
- 🌐 Лаосский, английский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Соблюдайте безопасность  
- 🌞 Лучше в сухой сезон  
- 👕 Купальная одежда  
- 🐾 Не злоупотребляйте алкоголем

## Локальная ценность

Тюбинг поддерживает экономику города и сервисы для путешественников.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🔭 Pha Ngern Viewpoint
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-pha-ngern-viewpoint',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший панорамный вид региона  
- 🌍 Активный треккинг  
- 📸 Карстовые пейзажи

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Панораму  
- 📷 Скалы  
- 🌅 Закат

## Практическая информация

- **Адрес:** Pha Ngern, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🥾 Подъём на вершину  
- 🔭 Панораму  
- 🌅 Закат

## Как добраться

- 🚕 Тук-тук  
- 🛵 Байк  
- 🗺️ Окрестности города

## 🔷 Коммуникация и сервис

- 🕒 06:00–18:00  
- 🌐 Лаосский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Крутой подъём  
- 🌞 Лучше утром  
- 👕 Треккинговая обувь  
- 🐾 Вода обязательна

## Локальная ценность

Точка способствует развитию активного туризма в регионе.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕳️ Tham Phu Kham Cave
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-tham-phu-kham-cave',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Комбинация пещеры и лагуны  
- 🌍 Духовное место  
- 📸 Контраст воды и скал

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Лагуну  
- 📷 Вход в пещеру  
- 🌅 Свет у воды

## Практическая информация

- **Адрес:** Tham Phu Kham, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🕳 Пещеру  
- 💦 Купание  
- 🛕 Статую Будды

## Как добраться

- 🚕 Тук-тук  
- 🛵 Байк  
- 🗺️ Район Blue Lagoon

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Лаосский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Внутри темно  
- 🌞 Лучше днём  
- 👕 Удобная обувь  
- 🐾 Осторожно на камнях

## Локальная ценность

Пещера объединяет природную и духовную ценность региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌅 Sunset Point Nam Song
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-sunset-point-nam-song',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшие закаты Вангвьенга  
- 🌍 Природная смотровая зона  
- 📸 Река и карст

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Реку  
- 📷 Горы  
- 🌅 Закат

## Практическая информация

- **Адрес:** Nam Song Riverside  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🌅 Закат  
- 🚶 Прогулку у реки  
- 📷 Фотосъёмку

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Берег Нам Сонг

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Лаосский  
- 📶 Связь стабильная  
- 💳 —

## Полезные нюансы

- ⚠️ Много людей вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Точка стала частью городской прогулочной культуры.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍵 Organic Mulberry Farm & Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-organic-mulberry-farm-cafe',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Тук-тук  
- 🛵 Байк  
- 🗺️ Окрестности города

## Полезные нюансы

- ⚠️ Днём жарко  
- 🌞 Лучше утром  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Ферма поддерживает устойчивое сельское хозяйство региона.

## Лучшие точки для фото

- 📷 Поля и горы  
- 📷 Напитки  
- 🌅 Пейзажи

## Практическая информация

- **Адрес:** Near Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Экологичный формат  
- 🌍 Локальные продукты  
- 📸 Виды на карст

## 🔵 Что обязательно посмотреть / попробовать

- 🍵 Чай из шелковицы  
- 🍰 Десерты  
- 🛍 Продукты фермы

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍹 Smile Beach Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-smile-beach-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Nam Song Riverside

## Полезные нюансы

- ⚠️ Популярно вечером  
- 🌞 Лучше к закату  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Бар стал частью туристической инфраструктуры Вангвьенга.

## Лучшие точки для фото

- 📷 Лежаки у воды  
- 📷 Коктейли  
- 🌅 Закат

## Практическая информация

- **Адрес:** Riverside, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Бар с видом на реку  
- 🌍 Backpacker-атмосфера  
- 📸 Закаты

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Коктейли  
- 🛋 Лежаки  
- 🌅 Закат

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 16:00–23:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍺 Gary’s Irish Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-gary-s-irish-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Downtown Vang Vieng

## Полезные нюансы

- ⚠️ Шумно вечером  
- 🌞 Лучше после заката  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Бар объединяет туристов и местных жителей.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Барную стойку  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Международная атмосфера  
- 🌍 Живая музыка и спорт  
- 📸 Интерьер и публика

## 🔵 Что обязательно посмотреть / попробовать

- 🍺 Пиво  
- 🍔 Бургеры  
- 🎶 Музыку

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 12:00–00:00  
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

-- Content block for: ☕ Café de Vang Vieng
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-cafe-de-vang-vieng',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Downtown Vang Vieng

## Полезные нюансы

- ⚠️ Многолюдно утром  
- 🌞 Лучше приходить рано  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе поддерживает локальный малый бизнес и туристическую инфраструктуру города.

## Лучшие точки для фото

- 📷 Завтраки  
- 📷 Вид на горы  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшее место для завтрака  
- 🌍 Вид на карстовые пейзажи  
- 📸 Утренний свет и горы

## 🔵 Что обязательно посмотреть / попробовать

- 🍳 Завтраки  
- ☕ Кофе  
- 🥐 Выпечку

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 07:00–16:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍹 Kangaroo Sunset Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-kangaroo-sunset-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Nam Song Riverside

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучше к закату  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Бар стал неформальным местом общения туристов и местных жителей.

## Лучшие точки для фото

- 📷 Террасу  
- 📷 Реку  
- 🌅 Закат

## Практическая информация

- **Адрес:** Riverside, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Отличное место для заката  
- 🌍 Backpacker-атмосфера  
- 📸 Вид на реку Нам Сонг

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Коктейли  
- 🛋 Зоны отдыха  
- 🌅 Закат

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 16:00–23:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍽️ Peeping Som’s Bar & Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-peeping-som-s-bar-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Nam Song Riverside

## Полезные нюансы

- ⚠️ Лучше бронировать столик у воды  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Заведение поддерживает туристическую экономику и вечернюю жизнь города.

## Лучшие точки для фото

- 📷 Столы у реки  
- 📷 Коктейли  
- 🌅 Закат

## Практическая информация

- **Адрес:** Riverside, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Панорамный вид на реку  
- 🌍 Популярное вечернее место  
- 📸 Подсветка и отражения воды

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Коктейли  
- 🍽 Лёгкие блюда  
- 🌅 Закат

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 15:00–22:30  
- 🌐 Лаосский, английский  
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

-- Content block for: 🎶 Sakura Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-sakura-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Downtown Vang Vieng

## Полезные нюансы

- ⚠️ Шумно и людно  
- 🌞 Только для взрослых  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Бар формирует ночной имидж Вангвьенга и поддерживает туристический поток.

## Лучшие точки для фото

- 📷 Танцпол  
- 📷 Свет  
- 🌅 Ночные сцены

## Практическая информация

- **Адрес:** Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Центр ночной жизни  
- 🌍 Популярен у backpacker-сообщества  
- 📸 Танцпол и свет

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Коктейли  
- 🎶 Танцы  
- 🌙 Ночную атмосферу

## Билеты и посещение

- 💰 Бюджетный–средний  
- 🎟️ Вход свободный  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 18:00–02:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🛕 Wat Xieng Thong
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-wat-xieng-thong',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый красивый и значимый храм Луангпхабанга  
- 🌍 Ключевой памятник королевского периода Лаоса  
- 📸 Резные фасады, золотые орнаменты и крыши

## Структура комплекса

- 🛕 Главный храм с мозаикой «Дерево жизни»  
- 🏛 Королевские погребальные часовни  
- 🚶 Территорию храмового комплекса

## Билеты и посещение

- 💰 ~30 000 LAK  
- 🎟️ Билет приобретается на входе  
- 🆓 Детям — бесплатно

## Лучшие точки для фото

- 📷 Фасад храма  
- 📷 Мозаику «Дерево жизни»  
- 🌅 Свет на крыше в утренние часы

## Практическая информация

- **Адрес:** Khem Khong, Luang Prabang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из исторического центра  
- 🚕 Такси / тук-тук  
- 🗺️ Старый город, у слияния рек

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Лаосский, базовый английский  
- 📶 Интернет ограниченный  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Строгий дресс-код  
- 🌞 Лучше посещать утром  
- 👕 Закрытые плечи и колени  
- 🐾 Тихое поведение

## Локальная ценность

Храм остаётся важнейшим духовным центром города и объектом сохранения культурного наследия Лаоса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌄 Mount Phousi
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-mount-phousi',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший вид на город  
- 🌍 Священное место  
- 📸 Закаты над Меконгом

## Структура комплекса

- 🧗 Подъём по ступеням  
- 🛕 Храм на вершине  
- 🌅 Закат

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Панораму города  
- 📷 Меконг  
- 🌅 Закат

## Практическая информация

- **Адрес:** Sisavangvong Rd  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Центр города

## 🔷 Коммуникация и сервис

- 🕒 05:30–18:30  
- 🌐 Лаосский, английский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Много туристов на закате  
- 🌞 Приходить заранее  
- 👕 Удобная обувь  
- 🐾 Осторожно на ступенях

## Локальная ценность

Место играет роль духовной и визуальной доминанты Луангпхабанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Kuang Si Falls
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-kuang-si-falls',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самые красивые водопады страны  
- 🌍 Природный заповедник  
- 📸 Бирюзовая вода и каскады

## Структура комплекса

- 💦 Купание в бассейнах  
- 🚶 Прогулку по тропам  
- 🐻 Центр спасения медведей

## Билеты и посещение

- 💰 ~25 000 LAK  
- 🎟️ Билет включает территорию  
- 🆓 —

## Лучшие точки для фото

- 📷 Каскады  
- 📷 Бирюзовые бассейны  
- 🌅 Свет в лесу

## Практическая информация

- **Адрес:** Kuang Si Waterfall Park  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / тук-тук  
- 🚌 Экскурсия  
- 🗺️ ~30 км от города

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:30  
- 🌐 Лаосский, английский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Купание разрешено не везде  
- 🌞 Лучше утром  
- 👕 Купальная одежда  
- 🐾 Соблюдать экоправила

## Локальная ценность

Водопады поддерживают экотуризм и программы охраны природы в регионе.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Royal Palace Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-royal-palace-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный исторический музей города  
- 🌍 Связь с королевским прошлым Лаоса  
- 📸 Колониальная архитектура и интерьеры

## Структура комплекса

- 🏛 Тронный зал  
- 🗡 Королевские регалии  
- 🖼 Коллекции подарков иностранным делегациям

## Билеты и посещение

- 💰 ~30 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Фасад дворца  
- 📷 Ворота и сад  
- 🌅 Площадь перед музеем

## Практическая информация

- **Адрес:** Sisavangvong Rd, Luang Prabang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из старого города  
- 🚕 Тук-тук  
- 🗺️ Sisavangvong Road

## 🔷 Коммуникация и сервис

- 🕒 08:00–11:30, 13:30–16:00  
- 🌐 Лаосский, английский  
- 📶 Интернет отсутствует  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Фото внутри запрещены  
- 🌞 Лучше посещать днём  
- 👕 Скромная одежда  
- 🐾 —

## Локальная ценность

Музей сохраняет историческую память о королевском периоде и национальной идентичности Лаоса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🧘 Alms Giving Ceremony
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-alms-giving-ceremony',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальный буддийский ритуал  
- 🌍 Живая духовная традиция  
- 📸 Монахи в шафрановых одеждах

## Структура комплекса

- 🧘 Саму церемонию  
- 🛕 Улицы старого города на рассвете  
- 📿 Атмосферу тишины

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободное наблюдение

## Лучшие точки для фото

- 📷 Процесс подаяния  
- 📷 Монахов в движении  
- 🌅 Рассветные улицы

## Практическая информация

- **Адрес:** Old Town streets  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком по старому городу  
- 🗺️ Улицы Sisavangvong / Sakkaline

## 🔷 Коммуникация и сервис

- 🕒 05:30–06:30  
- 🌐 Без общения  
- 📶 Не требуется  
- 💳 —

## Полезные нюансы

- ⚠️ Нельзя мешать монахам  
- 🌞 Приходить до рассвета  
- 👕 Скромная одежда  
- 🐾 Фото без вспышки

## Локальная ценность

Церемония — основа духовной жизни города и важная часть буддийской практики.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕳️ Pak Ou Caves
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-pak-ou-caves',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Одна из самых необычных святынь Лаоса  
- 🌍 Духовное значение для региона  
- 📸 Пещеры над рекой

## Структура комплекса

- 🛕 Нижнюю и верхнюю пещеры  
- 🚤 Путешествие по Меконгу  
- 📿 Статуэтки Будды

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Лодка — платно  
- 🆓 —

## Лучшие точки для фото

- 📷 Пещеры снаружи  
- 📷 Статуи Будды  
- 🌅 Реку Меконг

## Практическая информация

- **Адрес:** Pak Ou, Luang Prabang Province  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚤 Лодка из Луангпхабанга  
- 🗺️ Вверх по Меконгу

## 🔷 Коммуникация и сервис

- 🕒 Днём  
- 🌐 Лаосский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Крутые ступени  
- 🌞 Лучше днём  
- 👕 Удобная обувь  
- 🐾 Осторожно внутри пещер

## Локальная ценность

Пещеры веками служили местом паломничества и объединяют буддийские общины региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный рынок города  
- 🌍 Локальная культура и ремёсла  
- 📸 Атмосфера вечера

## Структура комплекса

- 🛍 Сувениры ручной работы  
- 🍢 Уличную еду  
- 🎶 Вечернюю атмосферу

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Покупки — по желанию  
- 🆓 Вход свободный

## Лучшие точки для фото

- 📷 Ряды лавок  
- 📷 Уличную еду  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Night Market Street  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Sisavangvong Road

## 🔷 Коммуникация и сервис

- 🕒 17:00–22:00  
- 🌐 Лаосский, английский  
- 📶 Интернет ограниченный  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Торг уместен  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Рынок поддерживает ремесленников и мелких торговцев Луангпхабанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Tamarind Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-tamarind-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Дегустационный сет  
- 🍲 Лаап и супы  
- 🍚 Липкий рис

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Район старого города

## Полезные нюансы

- ⚠️ Популярно у туристов  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан способствует сохранению и популяризации лаосской кухни.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Интерьер  
- 🌅 Атмосферу зала

## Практическая информация

- **Адрес:** Luang Prabang Old Town  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшее место для знакомства с кухней Лаоса  
- 🌍 Традиционные рецепты  
- 📸 Аутентичная подача

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Бронирование рекомендуется  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 12:00–21:30  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍹 Utopia Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-utopia-bar',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍹 Коктейли  
- 🎶 Музыку  
- 🌅 Закат

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Берег Меконга

## Полезные нюансы

- ⚠️ Закрывается рано по местным правилам  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Бар стал частью культурной сцены Луангпхабанга и местом общения путешественников.

## Лучшие точки для фото

- 📷 Террасу  
- 📷 Реку  
- 🌅 Закат

## Практическая информация

- **Адрес:** Mekong Riverside  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Легендарное место для путешественников  
- 🌍 Бар у реки  
- 📸 Закаты над Меконгом

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Вход свободный  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 16:00–23:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍜 Dyen Sabai Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-dyen-sabai-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Лаап  
- 🍜 Супы  
- 🍹 Коктейли

## Как добраться

- 🚶 Пешком + бамбуковый мост  
- 🚕 Тук-тук  
- 🗺️ Берег Нам Хан

## Полезные нюансы

- ⚠️ Популярно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан поддерживает локальные фермерские продукты и семейный бизнес.

## Лучшие точки для фото

- 📷 Террасу у реки  
- 📷 Подсветку  
- 🌅 Отражение воды

## Практическая информация

- **Адрес:** Nam Khan River  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Ужин у реки  
- 🌍 Локальная кухня  
- 📸 Вечерний вид

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Бронирование желательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 16:00–22:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍷 Manda de Laos
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-manda-de-laos',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Дегустационные сеты  
- 🍷 Вино  
- 🌿 Блюда из локальных продуктов

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Элегантный дресс-код  
- 🌞 Лучше вечером  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан продвигает лаосскую гастрономию на международном уровне.

## Лучшие точки для фото

- 📷 Пруд с лотосами  
- 📷 Подачу блюд  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Old Town, Luang Prabang  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший fine dining города  
- 🌍 Современная интерпретация лаосской кухни  
- 📸 Лотосовый пруд и вечерняя подсветка

## Билеты и посещение

- 💰 💎 Premium  
- 🎟️ Бронирование обязательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 18:00–22:00  
- 🌐 Лаосский, английский, французский  
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

-- Content block for: ☕ Joma Bakery Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-joma-bakery-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍰 Выпечку  
- ☕ Кофе  
- 🥐 Завтраки

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Многолюдно утром  
- 🌞 Лучше раннее время  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе стало частью повседневной жизни путешественников и местных жителей.

## Лучшие точки для фото

- 📷 Витрину  
- 📷 Кофе  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Old Town, Luang Prabang  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшее кафе для завтрака  
- 🌍 Международная атмосфера  
- 📸 Кофе и выпечка

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 07:00–18:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍽️ Bouang Asian Eatery
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-bouang-asian-eatery',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Азиатские блюда  
- 🍷 Напитки  
- 🌅 Закат

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Берег Меконга

## Полезные нюансы

- ⚠️ Популярно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual chic  
- 🐾 —

## Локальная ценность

Заведение демонстрирует современное развитие гастрономической сцены Луангпхабанга.

## Лучшие точки для фото

- 📷 Вид на реку  
- 📷 Блюда  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Mekong Riverside  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Современный формат кухни  
- 🌍 Вид на реку  
- 📸 Интерьер и подача

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Бронирование желательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 12:00–22:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🛕 Wat Phou
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-wat-phou',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный исторический объект юга Лаоса  
- 🌍 Наследие кхмерской цивилизации  
- 📸 Каменные террасы и вид на равнину

## Структура комплекса

- 🏛 Храмовые руины  
- 🚶 Проход по сакральной оси  
- 🌅 Вид на закат

## Билеты и посещение

- 💰 ~50 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Храмовые руины  
- 📷 Каменные лестницы  
- 🌅 Панораму равнины

## Практическая информация

- **Адрес:** Champasak Province  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси из Паксе  
- 🛵 Байк  
- 🗺️ ~45 км южнее города

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Лаосский, базовый английский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром  
- 👕 Удобная одежда  
- 🐾 Вода обязательна

## Локальная ценность

Wat Phou — ключевой элемент культурной идентичности юга Лаоса и объект сохранения мирового наследия.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌲 Bolaven Plateau
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-bolaven-plateau',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшие водопады юга Лаоса  
- 🌍 Кофейный регион страны  
- 📸 Джунгли и каскады

## Структура комплекса

- 💦 Водопады  
- ☕ Кофейные фермы  
- 🚶 Природные маршруты

## Билеты и посещение

- 💰 Въезд бесплатный  
- 🎟️ Отдельные водопады — платно  
- 🆓 —

## Лучшие точки для фото

- 📷 Водопады  
- 📷 Кофейные плантации  
- 🌅 Туман над лесом

## Практическая информация

- **Адрес:** Bolaven Plateau  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Экскурсия  
- 🛵 Байк  
- 🗺️ Восток от Паксе

## 🔷 Коммуникация и сервис

- 🕒 Днём  
- 🌐 Лаосский  
- 📶 Связь нестабильная  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Погода меняется  
- 🌞 Лучше сухой сезон  
- 👕 Куртка по утрам  
- 🐾 —

## Локальная ценность

Плато поддерживает сельское хозяйство и устойчивый экотуризм региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Tad Fane Waterfall
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-tad-fane-waterfall',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый высокий водопад региона  
- 🌍 Природный памятник  
- 📸 Две струи в глубоком ущелье

## Структура комплекса

- 💦 Водопад  
- 🔭 Смотровые площадки  
- 🚶 Прогулку по тропам

## Билеты и посещение

- 💰 ~10 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Двойной каскад  
- 📷 Ущелье  
- 🌅 Туман над водопадом

## Практическая информация

- **Адрес:** Bolaven Plateau  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Болавен Плато

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Лаосский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Не купаются  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 Осторожно у обрывов

## Локальная ценность

Водопад — ключевая природная достопримечательность региона и источник экотуризма.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏘 Champasak Town
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-champasak-town',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Аутентичная атмосфера  
- 🌍 База для посещения Wat Phou  
- 📸 Улица у реки

## Структура комплекса

- 🚶 Прогулку по набережной  
- 🏘 Колониальные дома  
- 🌅 Закат над Меконгом

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Реку  
- 📷 Дома  
- 🌅 Закат

## Практическая информация

- **Адрес:** Champasak  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси из Паксе  
- 🛵 Байк  
- 🗺️ Юг Паксе

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Лаосский  
- 📶 Связь стабильная  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Очень спокойно  
- 🌞 Лучшее время — вечер  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Город сохраняет традиционный уклад жизни южного Лаоса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Mekong Riverside Pakse
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-mekong-riverside-pakse',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшее место для вечерних прогулок  
- 🌍 Городская жизнь у реки  
- 📸 Закаты над Меконгом

## Структура комплекса

- 🚶 Прогулку  
- 🍢 Уличную еду  
- 🌅 Закат

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Реку  
- 📷 Вечерние огни  
- 🌅 Закат

## Практическая информация

- **Адрес:** Pakse Riverside  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Центр Паксе

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Лаосский  
- 📶 Связь стабильная  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Активно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Набережная — общественное пространство и центр городской жизни.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Tad Yuang Waterfall
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-tad-yuang-waterfall',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Купание у большого водопада  
- 🌍 Доступная природная локация  
- 📸 Вода и скалы

## Структура комплекса

- 💦 Купание  
- 🚶 Прогулку  
- 🌿 Отдых

## Билеты и посещение

- 💰 ~10 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Каскад  
- 📷 Бассейн  
- 🌅 Свет в лесу

## Практическая информация

- **Адрес:** Bolaven Plateau  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Болавен Плато

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Лаосский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Камни скользкие  
- 🌞 Лучше днём  
- 👕 Купальная одежда  
- 🐾 —

## Локальная ценность

Водопад — популярное место отдыха для местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Daolin Restaurant & Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-daolin-restaurant-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Лаосские блюда  
- 🍝 Европейские позиции  
- ☕ Кофе

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Центр Паксе

## Полезные нюансы

- ⚠️ Популярно днём  
- 🌞 Подходит для завтраков  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Заведение поддерживает локальный рынок продуктов и сервис Паксе.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Подачу  
- 🌅 Атмосферу

## Практическая информация

- **Адрес:** Pakse  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Уютное место для обеда  
- 🌍 Разнообразное меню  
- 📸 Современный интерьер

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 07:30–21:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍷 Le Panorama Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-le-panorama-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Французские блюда  
- 🍷 Вино  
- 🌅 Закат

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Mekong Riverside

## Полезные нюансы

- ⚠️ Лучше вечером  
- 🌞 Закат — лучшее время  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан отражает колониальное гастрономическое наследие региона.

## Лучшие точки для фото

- 📷 Вид на реку  
- 📷 Стол у окна  
- 🌅 Закат

## Практическая информация

- **Адрес:** Pakse Riverside  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Ужин с видом на реку  
- 🌍 Французское влияние  
- 📸 Закаты

## Билеты и посещение

- 💰 Средний–высокий чек  
- 🎟️ Бронирование желательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 11:00–22:00  
- 🌐 Лаосский, французский, английский  
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

-- Content block for: ☕ Sinouk Coffee Pakse
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-sinouk-coffee-pakse',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- ☕ Эспрессо  
- 🧋 Лаосский кофе  
- 🛍 Зерно на вынос

## Как добраться

- 🚶 Пешком  
- 🚕 Такси  
- 🗺️ Центр Паксе

## Полезные нюансы

- ⚠️ Популярно утром  
- 🌞 Лучшее время — завтрак  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кофейня продвигает лаосский кофе и поддерживает фермеров региона.

## Лучшие точки для фото

- 📷 Кофе  
- 📷 Витрину  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Pakse  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший лаосский кофе  
- 🌍 Продукция с Болавен Плато  
- 📸 Кофейная культура

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 07:00–18:00  
- 🌐 Лаосский, английский  
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

-- Content block for: ⛪ St. Teresa’s Catholic Church
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-st-teresa-s-catholic-church',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный архитектурный символ колониального Саваннакхета  
- 🌍 Отражение французского периода истории Лаоса  
- 📸 Фасад, витражи и атмосферная площадь

## Структура комплекса

- 🏛 Фасад и внутреннее убранство  
- 🚶 Прогулку вокруг исторического центра  
- 📷 Фото колониальной архитектуры

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Вход свободный

## Лучшие точки для фото

- 📷 Фасад собора  
- 📷 Детали окон и дверей  
- 🌅 Свет вечером на площади

## Практическая информация

- **Адрес:** Savannakhet Old Town  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Исторический центр города

## 🔷 Коммуникация и сервис

- 🕒 Днём (зависит от служб)  
- 🌐 Лаосский, базовый английский  
- 📶 Связь стабильная  
- 💳 —

## Полезные нюансы

- ⚠️ Уважайте религиозное пространство  
- 🌞 Лучше посещать днём  
- 👕 Скромная одежда  
- 🐾 Тихое поведение

## Локальная ценность

Собор — важная часть исторической памяти города и пример мультикультурного наследия.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏘 Savannakhet Old Town
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-savannakhet-old-town',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшее место для прогулки по “французскому Лаосу”  
- 🌍 Историческое ядро города  
- 📸 Колониальные фасады и уличные сцены

## Структура комплекса

- 🚶 Прогулку по кварталу  
- 🏘 Колониальные здания  
- 🌅 Закат у реки

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Колониальные фасады  
- 📷 Улицы с пальмами  
- 🌅 Закат у Меконга

## Практическая информация

- **Адрес:** Savannakhet Riverside  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Набережная Меконга

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Лаосский  
- 📶 Связь стабильная  
- 💳 —

## Полезные нюансы

- ⚠️ Очень тихо вечером  
- 🌞 Лучшее время — утро и закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Квартал сохраняет историческую идентичность Саваннакхета и поддерживает локальный туризм.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦴 Dinosaur Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-dinosaur-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Необычная тема для Лаоса  
- 🌍 Региональная история и образование  
- 📸 Экспозиции и макеты

## Структура комплекса

- 🦴 Экспонаты и макеты  
- 📚 Информационные стенды  
- 🚶 Прогулку по центру после музея

## Билеты и посещение

- 💰 Бюджетно / часто бесплатно  
- 🎟️ —  
- 🆓 Возможен свободный вход

## Лучшие точки для фото

- 📷 Макеты  
- 📷 Витрины  
- 🌅 Улицы рядом

## Практическая информация

- **Адрес:** Savannakhet Town Center  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из старого города  
- 🚕 Тук-тук  
- 🗺️ Центр Саваннакхета

## 🔷 Коммуникация и сервис

- 🕒 Днём  
- 🌐 Лаосский  
- 📶 Связь стабильная  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Экспозиция небольшая  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Музей поддерживает образовательную миссию и интерес к природной истории региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Mekong Riverside Promenade
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-mekong-riverside-promenade',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшее место для заката в городе  
- 🌍 Городская жизнь у реки  
- 📸 Меконг, лодки и вечерние огни

## Структура комплекса

- 🚶 Прогулку  
- 🍢 Уличную еду  
- 🌅 Закат

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Закат над Меконгом  
- 📷 Набережную  
- 🌅 Вечерние огни

## Практическая информация

- **Адрес:** Mekong Riverside, Savannakhet  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Riverside Road

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Лаосский  
- 📶 Связь стабильная  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Активно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Набережная — социальный центр города и место встреч местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 That Ing Hang Stupa
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-that-ing-hang-stupa',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Священное место региона  
- 🌍 Буддийское наследие Лаоса  
- 📸 Ступа и монастырский комплекс

## Структура комплекса

- 🛕 Ступу и храмовую территорию  
- 🚶 Прогулку по монастырю  
- 📷 Детали архитектуры

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Ступу  
- 📷 Ворота комплекса  
- 🌅 Свет в утренние часы

## Практическая информация

- **Адрес:** That Ing Hang, Savannakhet Province  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / тук-тук  
- 🛵 Байк  
- 🗺️ Окрестности Саваннакхета

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Лаосский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Уважайте религиозное пространство  
- 🌞 Лучше утром  
- 👕 Скромная одежда  
- 🐾 —

## Локальная ценность

Ступа остаётся важным центром паломничества и духовной практики для местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛 Savannakhet City Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-savannakhet-city-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Быстрый способ понять регион  
- 🌍 История и культура провинции  
- 📸 Локальные артефакты

## Структура комплекса

- 🏛 Экспозиции о колониальном периоде  
- 📚 Этнографические предметы  
- 🚶 Прогулку по окрестностям после визита

## Билеты и посещение

- 💰 Бюджетно / часто бесплатно  
- 🎟️ —  
- 🆓 Возможен свободный вход

## Лучшие точки для фото

- 📷 Фасад  
- 📷 Экспонаты (если разрешено)  
- 🌅 Улицы вокруг

## Практическая информация

- **Адрес:** Savannakhet Old Town  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из старого города  
- 🚕 Тук-тук  
- 🗺️ Центр

## 🔷 Коммуникация и сервис

- 🕒 Днём  
- 🌐 Лаосский  
- 📶 Связь стабильная  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Небольшая экспозиция  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Музей поддерживает сохранение локального наследия и образовательные инициативы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Cafe Inn
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-cafe-inn',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍳 Завтраки  
- ☕ Кофе  
- 🥐 Выпечку

## Как добраться

- 🚶 Пешком по old town  
- 🚕 Тук-тук  
- 🗺️ French Quarter

## Полезные нюансы

- ⚠️ Многолюдно утром  
- 🌞 Лучше приходить рано  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе поддерживает локальный малый бизнес и комфортную инфраструктуру для путешественников.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Кофе  
- 🌅 Улицу с фасадами

## Практическая информация

- **Адрес:** Savannakhet Old Town  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшее место для завтрака в старом городе  
- 🌍 Уютная атмосфера  
- 📸 Кофе и выпечка

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 07:00–17:00  
- 🌐 Английский, лаосский  
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

-- Content block for: ☕ Lin’s Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-lin-s-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Лаосские блюда  
- 🍜 Лапшу  
- ☕ Кофе/чай

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Центр Savannakhet

## Полезные нюансы

- ⚠️ Популярно в обед  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе поддерживает локальных поставщиков и развивает сервис в старом городе.

## Лучшие точки для фото

- 📷 Блюда  
- 📷 Интерьер  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Savannakhet  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Уютный формат «поесть без суеты»  
- 🌍 Комфортное меню для туристов  
- 📸 Простая, приятная подача

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 08:00–21:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍽 Daosavanh Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-daosavanh-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Лаап (laap)  
- 🍚 Липкий рис  
- 🍲 Супы

## Как добраться

- 🚕 Тук-тук  
- 🚶 Пешком из old town  
- 🗺️ Центр города

## Полезные нюансы

- ⚠️ Порции большие  
- 🌞 Подходит для вечера  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан поддерживает традиционную гастрокультуру южного Лаоса и семейные рецепты.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Стол  
- 🌅 Атмосферу зала

## Практическая информация

- **Адрес:** Savannakhet  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Хорошее место для знакомства с местной кухней  
- 🌍 Спокойная семейная атмосфера  
- 📸 Локальный интерьер

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 10:00–21:00  
- 🌐 Лаосский  
- 📶 Интернет ограниченный  
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

-- Content block for: ☕ Sinouk Coffee Savannakhet
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-sinouk-coffee-savannakhet',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- ☕ Эспрессо/латте  
- 🧁 Десерты  
- 🛍 Кофе на вынос

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Savannakhet

## Полезные нюансы

- ⚠️ Популярно утром  
- 🌞 Лучшее время — завтрак  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кофейня продвигает лаосский кофе и поддерживает фермеров страны.

## Лучшие точки для фото

- 📷 Кофе  
- 📷 Витрину  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Savannakhet  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший лаосский кофе  
- 🌍 Комфортная точка для работы/перерыва  
- 📸 Кофе и витрина

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 07:00–19:00  
- 🌐 Лаосский, английский  
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

-- Content block for: 🍢 Mekong Riverside Food Stalls
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-mekong-riverside-food-stalls',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍢 Шашлычки  
- 🍜 Лапшу  
- 🥤 Напитки

## Как добраться

- 🚶 Пешком из old town  
- 🚕 Тук-тук  
- 🗺️ Mekong Riverside

## Полезные нюансы

- ⚠️ Простые условия  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Точки уличной еды поддерживают малый бизнес и повседневную гастрокультуру города.

## Лучшие точки для фото

- 📷 Гриль и еду  
- 📷 Свет фонарей  
- 🌅 Вечерний Меконг

## Практическая информация

- **Адрес:** Mekong Riverside, Savannakhet  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Самая аутентичная уличная еда города  
- 🌍 Вечерняя жизнь у реки  
- 📸 Свет, дым гриля и Меконг

## Билеты и посещение

- 💰 Бюджетно  
- 🎟️ —  
- 🆓 Вход свободный

## 🔷 Коммуникация и сервис

- 🕒 17:00–22:00  
- 🌐 Лаосский  
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

-- BEGIN ATLAS_COUNTRY_CITY_TABS
-- Generated: 2026-02-08T16:33:10.714Z
-- Blocks: 73

-- city/lpq tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-luang-prabang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'lpq',
  'overview',
  'ru',
  'Обзор',
  'Луангпхабанг — культурная и духовная столица Лаоса, бывшая королевская резиденция и объект Всемирного наследия ЮНЕСКО. Город расположен в живописной долине у слияния рек Меконг и Нам Кхан и известен своей гармоничной архитектурой, буддийскими храмами и спокойной атмосферой.

Луангпхабанг считается одним из самых красивых и аутентичных городов Юго-Восточной Азии. Он идеально подходит для неспешных путешествий, культурного туризма, зимовки и глубокого знакомства с лаосским образом жизни.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/lpq tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-luang-prabang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'lpq',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: old-town
    title: Старый город
    description: Исторический центр между реками Меконг и Нам Кхан с храмами, музеями и колониальной застройкой.
  - id: nam-khan
    title: Район Нам Кхан
    description: Спокойный район вдоль одноимённой реки с гестхаусами и эко-отелями.
  - id: new-town
    title: Новый город
    description: Более современная часть с рынками, локальной жизнью и транспортными узлами.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/lpq tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-luang-prabang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'lpq',
  'accommodation',
  'ru',
  'Проживание',
  'Луангпхабанг предлагает разнообразные варианты размещения: гестхаусы, бутик-отели, эко-лоджи и небольшие гостиницы в колониальных зданиях. Большинство жилья сосредоточено в Старом городе и вдоль рек.

Цены остаются доступными по меркам региона, однако в высокий сезон (ноябрь–февраль) рекомендуется бронировать заранее. Город подходит как для краткосрочного отдыха, так и для спокойного длительного проживания.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/lpq tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-luang-prabang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'lpq',
  'food',
  'ru',
  'Еда и кафе',
  'Город славится сочетанием лаосской и французской кухни. Здесь много уютных кафе, пекарен и ресторанов с видом на реку. Популярны блюда из липкого риса, лап (ляп), супы с лапшой и свежая речная рыба.

Особое место занимает кофе с плато Болавен и французская выпечка. Вечером работают уличные лавки и фудкорты, особенно в районе ночного рынка.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/lpq tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-luang-prabang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'lpq',
  'transport',
  'ru',
  'Транспорт',
  'Город компактный, большинство достопримечательностей находится в пешей доступности. Основные виды транспорта — тук-туки, мототакси и сонгтэо.

В Луангпхабанге расположен международный аэропорт, принимающий рейсы из Вьентьяна, Бангкока и других городов региона. Также доступны автобусные маршруты и речные поездки по Меконгу.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/lpq tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-luang-prabang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'lpq',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический муссонный. Лучшее время для посещения — сухой сезон с ноября по февраль, когда температура комфортная и осадков минимум.

С марта по апрель жарко, температура может достигать +35 °C. С мая по октябрь продолжается сезон дождей, при этом природа становится особенно зелёной и живописной.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/lpq tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-luang-prabang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'lpq',
  'shopping',
  'ru',
  'Шопинг',
  'Главные торговые точки — утренний рынок (Morning Market) и ночной рынок на улице Sisavangvong. Здесь продаются продукты, ремесленные изделия, текстиль, картины и сувениры.

Также в городе есть небольшие магазины и лавки с изделиями местных мастеров, лаосским кофе и натуральной косметикой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/lpq tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-luang-prabang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'lpq',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь в Луангпхабанге спокойная и камерная. Популярны лаунж-бары, кафе у реки и несколько туристических баров с живой музыкой.

Большинство заведений закрывается до полуночи. Город больше ориентирован на вечерние прогулки и атмосферный отдых, чем на клубные развлечения.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/lpq tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-luang-prabang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'lpq',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - first_time
  - cultural_travel
  - slow_travel',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/lpq tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-luang-prabang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'lpq',
  'tips',
  'ru',
  'Практическая информация',
  'Луангпхабанг считается одним из самых безопасных городов Лаоса. Основные рекомендации — соблюдать дресс-код при посещении храмов и уважать местные традиции.

Наличные деньги необходимы, так как банковские карты принимаются ограниченно. Интернет доступен в отелях и кафе, мобильная связь стабильна в пределах города.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/lpq tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-luang-prabang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'lpq',
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

-- city/lpq tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-luang-prabang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'lpq',
  'budget',
  'ru',
  'Цены и бюджет',
  'Луангпхабанг остаётся доступным направлением. Средняя стоимость обеда — 2–4 USD, ужина в ресторане — 5–8 USD.

Проживание в гестхаусе начинается от 15–25 USD за ночь, в бутик-отеле — от 40–70 USD. Комфортный дневной бюджет составляет 20–30 USD.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pkz tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-pakse.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pkz',
  'overview',
  'ru',
  'Обзор',
  'Паксе — главный город южного Лаоса и административный центр провинции Чампасак. Город расположен у слияния рек Меконг и Се Дон и служит ключевыми «воротами» к плато Болавен, храмовому комплексу Ват Пху и региону «4000 островов».

Паксе менее туристический, чем города севера, и больше ориентирован на транзит, деловые поездки и экотуризм. Он подходит для спокойного проживания, изучения юга страны и поездок по природным и историческим достопримечательностям региона.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pkz tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-pakse.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pkz',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: city-center
    title: Центр города
    description: Административная часть с рынками, кафе, отелями и основными городскими сервисами.
  - id: riverside
    title: Район у Меконга
    description: Прибрежная зона с ресторанами, прогулочными маршрутами и видом на реку.
  - id: suburbs
    title: Окраины и пригороды
    description: Более спокойные жилые районы и отправная точка к плато Болавен.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pkz tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-pakse.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pkz',
  'accommodation',
  'ru',
  'Проживание',
  'В Паксе представлен умеренный выбор жилья: гестхаусы, небольшие отели и несколько гостиниц среднего уровня. Большинство вариантов ориентировано на путешественников, направляющихся к плато Болавен или в регион 4000 островов.

Цены остаются доступными, а длительное проживание возможно за счёт невысокой стоимости аренды и базовых услуг.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pkz tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-pakse.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pkz',
  'food',
  'ru',
  'Еда и кафе',
  'Кухня Паксе сочетает лаосские, тайские и вьетнамские традиции. В городе много уличных кафе, рынков и небольших ресторанов с местными блюдами.

Популярны блюда из риса, рыбы и овощей, а также кофе с плато Болавен. Европейская кухня представлена ограниченно и в основном в туристических заведениях.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pkz tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-pakse.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pkz',
  'transport',
  'ru',
  'Транспорт',
  'В Паксе расположен международный аэропорт, выполняющий рейсы в Вьентьян и соседние страны. Автобусное сообщение связывает город с другими регионами Лаоса и Камбоджей.

По городу передвигаются на тук-туках и мотобайках. Для поездок к водопадам и плато Болавен часто арендуют мотобайк или автомобиль.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pkz tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-pakse.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pkz',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат южного Лаоса более жаркий и влажный. Лучшее время для посещения — сухой сезон с ноября по март.

В сезон дождей (июнь–сентябрь) ландшафты становятся особенно зелёными, но некоторые дороги и трекинговые маршруты могут быть труднодоступны.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pkz tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-pakse.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pkz',
  'shopping',
  'ru',
  'Шопинг',
  'Основные торговые точки — городские рынки, где продаются продукты, специи, текстиль и изделия местных ремесленников. Также работают небольшие магазины и супермаркеты.

Из региона часто привозят кофе с плато Болавен, специи и изделия из дерева.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pkz tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-pakse.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pkz',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь в Паксе развита слабо. Вечером открыты несколько баров и кафе, в основном ориентированных на туристов и местных жителей.

Город не является клубным направлением и подходит для спокойного вечернего отдыха.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pkz tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-pakse.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pkz',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - eco_travel
  - nature_routes
  - slow_travel',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pkz tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-pakse.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pkz',
  'tips',
  'ru',
  'Практическая информация',
  'Паксе считается безопасным городом с низким уровнем преступности. Основные сложности могут быть связаны с жарким климатом и дорожными условиями при поездках за город.

Наличные деньги необходимы, банковские карты принимаются ограниченно. Интернет доступен, но скорость может снижаться за пределами центра.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pkz tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-pakse.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pkz',
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

-- city/pkz tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-pakse.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pkz',
  'budget',
  'ru',
  'Цены и бюджет',
  'Паксе остаётся бюджетным направлением. Средняя стоимость обеда — 1–3 USD, ужина — 3–6 USD.

Проживание в гестхаусе начинается от 8–15 USD за ночь, в отеле среднего уровня — от 25–50 USD. Дневной бюджет составляет 15–25 USD.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/svk tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-savannakhet.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'svk',
  'overview',
  'ru',
  'Обзор',
  'Саваннакхет — крупнейший город юго-восточного Лаоса и важный приграничный центр на берегу Меконга, напротив тайского города Мукдахан. Город играет ключевую роль в торговле, логистике и трансграничном сообщении между Лаосом и Таиландом.

В отличие от туристических центров страны, Саваннакхет ориентирован на повседневную жизнь, бизнес и региональное взаимодействие. Он интересен путешественникам, желающим увидеть нетуристический Лаос и почувствовать атмосферу провинциального города с колониальным наследием.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/svk tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-savannakhet.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'svk',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: old-town
    title: Старый город
    description: Исторический центр с французской колониальной архитектурой и административными зданиями.
  - id: riverside
    title: Набережная Меконга
    description: Прибрежная зона с прогулочными маршрутами, рынками и кафе.
  - id: residential
    title: Жилые районы
    description: Спокойные кварталы с локальной инфраструктурой и рынками.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/svk tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-savannakhet.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'svk',
  'accommodation',
  'ru',
  'Проживание',
  'Выбор жилья в Саваннакхете ограничен, но достаточен для краткосрочного пребывания. В городе есть гестхаусы, небольшие отели и несколько гостиниц среднего уровня.

Цены ниже, чем в туристических городах Лаоса. Город подходит для транзитных остановок, деловых поездок и спокойного проживания без туристической суеты.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/svk tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-savannakhet.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'svk',
  'food',
  'ru',
  'Еда и кафе',
  'Кухня Саваннакхета сочетает лаосские, тайские и китайские традиции. В городе популярны уличные рынки и небольшие семейные рестораны.

На набережной и в центре можно найти кафе с блюдами тайской кухни, морепродуктами и местными специалитетами. Европейская кухня представлена минимально.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/svk tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-savannakhet.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'svk',
  'transport',
  'ru',
  'Транспорт',
  'Саваннакхет связан с Таиландом мостом Дружбы через Меконг. Автобусные маршруты соединяют город с Вьентьяном, Паксе и другими регионами Лаоса.

В городе передвигаются на тук-туках и мототакси. Пешие прогулки по центру удобны благодаря компактным размерам города.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/svk tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-savannakhet.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'svk',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат жаркий и тропический. Лучшее время для посещения — сухой сезон с ноября по февраль, когда температура более комфортна.

С марта по май стоит сильная жара, а в сезон дождей (июнь–сентябрь) возможны ливни и повышение уровня Меконга.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/svk tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-savannakhet.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'svk',
  'shopping',
  'ru',
  'Шопинг',
  'Основные покупки совершаются на локальных рынках и ночных базарах вдоль набережной. Здесь продаются продукты, текстиль, специи и недорогие товары из Таиланда.

Благодаря близости границы, жители и гости часто ездят за покупками в Мукдахан на тайской стороне.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/svk tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-savannakhet.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'svk',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь в Саваннакхете спокойная и ориентирована на местных жителей. Работают несколько баров, кафе и караоке-заведений.

Клубной сцены практически нет. Основной формат вечернего отдыха — прогулки по набережной и посещение рынков.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/svk tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-savannakhet.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'svk',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - border_travel
  - local_life
  - slow_travel',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/svk tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-savannakhet.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'svk',
  'tips',
  'ru',
  'Практическая информация',
  'Саваннакхет считается безопасным городом. Основные особенности связаны с жарким климатом и левосторонним движением.

Наличные деньги необходимы, карты принимаются ограниченно. Интернет доступен, но качество соединения может варьироваться.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/svk tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-savannakhet.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'svk',
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

-- city/svk tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-savannakhet.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'svk',
  'budget',
  'ru',
  'Цены и бюджет',
  'Саваннакхет остаётся доступным по стоимости. Обед в кафе стоит 1–3 USD, ужин — 3–6 USD.

Проживание в гестхаусе начинается от 8–15 USD за ночь, в отеле — от 25–50 USD. Средний дневной бюджет составляет 15–25 USD.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vvg tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vang-vieng.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vvg',
  'overview',
  'ru',
  'Обзор',
  'Ванг Вьенг — небольшой город в центральном Лаосе, расположенный среди карстовых гор и рисовых полей на реке Нам Сонг. Он известен своими природными ландшафтами, пещерами, смотровыми площадками и возможностями для активного отдыха.

Ранее город ассоциировался с шумной бэкпекерской тусовкой, однако в последние годы Ванг Вьенг трансформировался в спокойное направление для экотуризма, трекинга и неспешных путешествий на природе.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vvg tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vang-vieng.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vvg',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: town-center
    title: Центр города
    description: Туристический центр с гестхаусами, кафе, прокатами байков и тур-офисами.
  - id: riverside
    title: Район у реки Нам Сонг
    description: Зона отелей, бунгало и кафе с видами на реку и горы.
  - id: outskirts
    title: Окрестности и деревни
    description: Сельские районы с рисовыми полями, пещерами и трекинговыми маршрутами.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vvg tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vang-vieng.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vvg',
  'accommodation',
  'ru',
  'Проживание',
  'Ванг Вьенг предлагает большой выбор бюджетного жилья: хостелы, гестхаусы, бунгало у реки и небольшие отели. Большинство вариантов ориентировано на путешественников и любителей активного отдыха.

Цены остаются низкими по сравнению с другими туристическими направлениями региона. В высокий сезон рекомендуется бронировать заранее, особенно жильё с видом на реку или горы.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vvg tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vang-vieng.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vvg',
  'food',
  'ru',
  'Еда и кафе',
  'В городе много недорогих кафе, ориентированных на туристов, включая вегетарианские и веганские заведения. Помимо лаосской кухни, широко представлены тайские и западные блюда.

Популярны фреши, смузи, блюда из риса и лапши, а также выпечка. Многие кафе имеют открытые террасы с видом на карстовые пейзажи.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vvg tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vang-vieng.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vvg',
  'transport',
  'ru',
  'Транспорт',
  'Основные способы передвижения — пешком, на велосипеде или арендованном мотобайке. Также доступны тук-туки и сонгтэо для поездок к пещерам и смотровым площадкам.

Ванг Вьенг расположен на трассе между Вьентьяном и Луангпхабангом. Автобусы и минивэны регулярно связывают город с другими регионами страны.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vvg tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vang-vieng.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vvg',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический муссонный. Лучшее время для посещения — сухой сезон с ноября по март, когда дороги доступны, а трекинг наиболее комфортен.

В сезон дождей (май–октябрь) часть грунтовых дорог может быть размыта, но природа становится особенно зелёной и фотогеничной.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vvg tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vang-vieng.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vvg',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг в Ванг Вьенге ограничен. В центре города работают сувенирные лавки, магазины с туристическим снаряжением и небольшие рынки.

Основные покупки — изделия местных ремесленников, одежда, аксессуары для трекинга и продукты первой необходимости.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vvg tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vang-vieng.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vvg',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь спокойная и неагрессивная. Вечером работают бары и кафе с живой музыкой, настольными играми и неформальной атмосферой.

Клубов и шумных вечеринок практически нет. Основной формат — вечерние посиделки с видом на горы или реку.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vvg tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vang-vieng.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vvg',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - adventure_travel
  - eco_tourism
  - backpacker',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vvg tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vang-vieng.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vvg',
  'tips',
  'ru',
  'Практическая информация',
  'Ванг Вьенг считается безопасным городом, однако при активных развлечениях важно соблюдать осторожность. Трекинг и поездки в пещеры лучше совершать в хорошую погоду.

Мотобайки следует арендовать только при наличии опыта. Наличные деньги необходимы, банкоматы есть в центре города, но карты принимаются ограниченно.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vvg tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vang-vieng.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vvg',
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

-- city/vvg tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vang-vieng.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vvg',
  'budget',
  'ru',
  'Цены и бюджет',
  'Ванг Вьенг — одно из самых бюджетных направлений Лаоса. Стоимость обеда в кафе — 1–3 USD, ужина — 3–6 USD.

Проживание в гестхаусе начинается от 8–15 USD за ночь, в отеле — от 25–40 USD. Средний дневной бюджет составляет 15–25 USD.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vte tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vientiane.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vte',
  'overview',
  'ru',
  'Обзор',
  'Вьентьян — столица Лаоса и один из самых спокойных столичных городов Юго-Восточной Азии. Город расположен на берегу реки Меконг и отличается неспешным ритмом жизни, невысокой застройкой и выраженным французским колониальным наследием.

В отличие от шумных мегаполисов региона, Вьентьян больше похож на крупный провинциальный город. Он подходит для размеренного путешествия, длительного проживания, зимовки и знакомства с культурой Лаоса без перегрузки туристической инфраструктурой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vte tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vientiane.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vte',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: chanthabuly
    title: Чантхабули
    description: Центральный район с храмами, рынками, набережной и административными зданиями.
  - id: xaysetha
    title: Сайсетха
    description: Дипломатический и деловой район, где расположены посольства и крупные отели.
  - id: sisattanak
    title: Сисаттанак
    description: Жилой район с локальными рынками и более спокойной атмосферой.
  - id: sikhottabong
    title: Сикхоттабонг
    description: Западная часть города с аэропортом и смешанной застройкой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vte tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vientiane.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vte',
  'accommodation',
  'ru',
  'Проживание',
  'Во Вьентьяне представлен широкий выбор жилья: от бюджетных гестхаусов и хостелов до отелей международных сетей и сервисных апартаментов. Большинство вариантов сосредоточено в центральных районах и вдоль набережной Меконга.

Цены на жильё ниже, чем в соседних столицах региона. Город подходит для долгосрочной аренды, особенно для тех, кто ищет спокойную среду без суеты мегаполиса.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vte tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vientiane.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vte',
  'food',
  'ru',
  'Еда и кафе',
  'Вьентьян — гастрономический центр Лаоса. Здесь представлены как традиционные лаосские блюда, так и тайская, вьетнамская и французская кухни. Широко распространены уличные кафе и семейные рестораны.

Популярные блюда: лап (острый мясной салат), кхао нияо (липкий рис), супы с лапшой и блюда из рыбы Меконга. В городе много кофеен с зерном с плато Болавен, а также пекарен с французским влиянием.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vte tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vientiane.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vte',
  'transport',
  'ru',
  'Транспорт',
  'Общественный транспорт развит слабо и представлен автобусами и маршрутками. Основные способы передвижения — тук-туки, такси и мототакси. Стоимость поездок низкая, но цены часто оговариваются заранее.

В городе расположен международный аэропорт Wattay, откуда выполняются рейсы в Таиланд, Вьетнам и другие страны региона. Пешие прогулки по центру города удобны благодаря компактным расстояниям.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vte tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vientiane.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vte',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический муссонный. Сухой сезон длится с ноября по апрель и считается лучшим временем для посещения города. В это время температура комфортная, а осадки минимальны.

С мая по октябрь продолжается сезон дождей с высокой влажностью и кратковременными ливнями. Самые жаркие месяцы — март и апрель, когда температура может превышать +35 °C.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vte tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vientiane.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vte',
  'shopping',
  'ru',
  'Шопинг',
  'Основное место для покупок — рынок Talat Sao (утренний рынок), где продаются сувениры, текстиль, электроника и продукты. Рядом расположен торговый центр Talat Sao Mall с супермаркетом и фудкортом.

По вечерам работает ночной рынок на набережной Меконга, где можно купить уличную еду, фрукты и недорогие сувениры.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vte tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vientiane.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vte',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь во Вьентьяне спокойная и ненавязчивая. Большинство баров и кафе сосредоточено вдоль набережной и в центральных районах.

Популярны лаунж-бары с живой музыкой, небольшие пабы и рестораны. Клубная сцена развита слабо, большинство заведений закрывается до полуночи.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vte tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vientiane.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vte',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - first_time
  - slow_travel
  - wintering',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vte tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vientiane.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vte',
  'tips',
  'ru',
  'Практическая информация',
  'Вьентьян считается безопасным городом с низким уровнем преступности. Основные риски связаны с дорожным движением и жарким климатом. Рекомендуется соблюдать осторожность при аренде мотобайков и следить за гидратацией.

Карты принимаются не везде, поэтому наличные лаосские кипы необходимы. Интернет и мобильная связь доступны, но скорость может быть нестабильной за пределами центра.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/vte tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vientiane.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vte',
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

-- city/vte tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/city-vientiane.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'vte',
  'budget',
  'ru',
  'Цены и бюджет',
  'Вьентьян — один из самых недорогих столичных городов региона. Средняя стоимость обеда в кафе — 1–3 USD, ужина в ресторане среднего уровня — 4–7 USD.

Аренда жилья начинается от 300–600 USD в месяц за квартиру. Дневной бюджет путешественника составляет примерно 20–30 USD без учёта экскурсий.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/la tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
  'overview',
  'ru',
  'Обзор',
  'Лаос — спокойная и аутентичная страна Юго-Восточной Азии без выхода к морю, известная горными пейзажами, тропическими лесами и медленным ритмом жизни. Это одно из наименее урбанизированных государств региона, где традиционная культура и природа сохранились в почти первозданном виде.

Страна привлекает путешественников, уставших от массового туризма: здесь ценят тишину, буддийскую философию, неспешные прогулки вдоль Меконга и близость к джунглям. Лаос подходит для осознанных путешествий, зимовки, экотуризма и культурного погружения.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/la tab=gallery (Фотогалерея) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
  'gallery',
  'ru',
  'Фотогалерея',
  '@gallery:

* laos_hero_mekong.jpg
* laos_luang_prabang_temple.jpg
* laos_kuang_si_waterfall.jpg
* laos_4000_islands.jpg',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/la tab=map (Карта) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
  'map',
  'ru',
  'Карта',
  '@map:
center: [18.0, 105.0]
zoom: 6',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/la tab=weather (Погода и климат) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
  'weather',
  'ru',
  'Погода и климат',
  'Климат Лаоса тропический муссонный с выраженной сезонностью. Выделяют два основных сезона: сухой и дождливый.

### Сезоны

* Сухой сезон: ноябрь — апрель (лучшее время для путешествий)
* Сезон дождей: май — октябрь (обильные ливни, высокая влажность)

Средние температуры колеблются от +20 °C зимой до +35–40 °C весной. В горных районах ночи могут быть прохладными.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/la tab=history (История) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
  'history',
  'ru',
  'История',
  'История Лаоса как государства начинается в XIV веке с образования королевства Лансанг — «Королевства миллиона слонов», основанного королём Фа Нгумом. В течение нескольких веков Лансанг был одним из ключевых политических и культурных центров региона.

В XVIII веке королевство распалось, а в конце XIX века Лаос вошёл в состав Французского Индокитая. После Второй мировой войны страна получила формальную независимость, однако длительная гражданская война завершилась приходом к власти коммунистического движения в 1975 году.

С конца 1980-х годов Лаос проводит экономические реформы, сочетая социалистическую модель управления с элементами рыночной экономики. Сегодня страна является членом АСЕАН и постепенно открывается международному туризму и инвестициям.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/la tab=geography (География) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
  'geography',
  'ru',
  'География',
  'Лаос расположен в центре Индокитайского полуострова и не имеет выхода к морю. Большую часть территории занимают горы и плато, покрытые тропическими лесами. Долина реки Меконг — ключевая природная и экономическая ось страны.

Более двух третей территории покрыто лесами. В стране множество национальных парков, водопадов, пещер и рек. География Лаоса делает его одним из самых «зелёных» государств региона.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/la tab=culture (Культура) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
  'culture',
  'ru',
  'Культура',
  'Культура Лаоса тесно связана с тхеравадинским буддизмом, который определяет образ жизни, архитектуру и повседневные ритуалы. Важное место занимают монастыри, утренние подаяния монахам и религиозные фестивали.

Наряду с буддизмом сохраняются анимистические и шаманские традиции. Народные танцы, музыка с инструментом кхен, ремёсла и традиционная одежда (сину) остаются частью повседневной культуры.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/la tab=living (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
  'living',
  'ru',
  'Проживание',
  'В Лаосе представлен широкий выбор жилья — от бюджетных гестхаусов и хостелов до бутик-отелей и эко-лоджей. В туристических городах цены остаются одними из самых низких в ЮВА.

Аренда квартир доступна в основном в Вьентьяне и Луангпхабанге. Лаос подходит как для краткосрочного путешествия, так и для длительного проживания в спокойном режиме.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/la tab=visas (Визы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
  'visas',
  'ru',
  'Визы',
  'Граждане России могут находиться в Лаосе без визы до 30 дней. Также доступна виза по прибытии и электронная виза сроком до 30 дней.

Для долгосрочного пребывания предусмотрены бизнес‑ и учебные визы. Паспорт должен быть действителен не менее 6 месяцев с даты въезда.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/la tab=business (Бизнес) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
  'business',
  'ru',
  'Бизнес',
  'Экономика Лаоса развивается за счёт гидроэнергетики, сельского хозяйства, туризма и добывающих отраслей. Страна экспортирует электроэнергию соседям и активно развивает инфраструктуру.

Для малого бизнеса интересны сферы туризма, общепита, образования и сервисов. При этом рынок остаётся ограниченным, а иностранное участие регулируется государством.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/la tab=phrasebook (Разговорник) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
  'phrasebook',
  'ru',
  'Разговорник',
  '* Здравствуйте — Саба́йди
* Спасибо — Кхоп чай
* Пожалуйста — Калуна
* Извините — Кхау тод
* Где находится …? — … ю си?',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/la tab=reviews (Отзывы экспатов) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
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

-- country/la tab=calculator (Калькулятор стоимости) from E:/projects/work_go2asia/20251216go2asia/content/atlas/laos/country-laos.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'la',
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


