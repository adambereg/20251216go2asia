-- Content Blocks UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Content block for: 🛕 Tanah Lot Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bali-tanah-lot-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный визуальный символ Бали  
- 🌍 Священное место балийского индуизма  
- 📸 Храм на фоне океана и заката

## Билеты и посещение

- 💰 ~60 000 IDR  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Храм с берега  
- 📷 Волны у скалы  
- 🌅 Закат

## Практическая информация

- **Адрес:** Tanah Lot, Bali  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🛕 Храм Tanah Lot  
- 🌊 Скалу и океанские волны  
- 🌅 Закат

## Как добраться

- 🚕 Такси / Grab  
- 🛵 Байк  
- 🗺️ Запад Бали, район Табанан

## 🔷 Коммуникация и сервис

- 🕒 07:00–19:00  
- 🌐 Английский, индонезийский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Очень многолюдно на закате  
- 🌞 Лучше приезжать днём  
- 👕 Уважительная одежда  
- 🐾 —

## Локальная ценность

Храм является духовной опорой региона и ключевым объектом религиозного туризма.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐒 Ubud Monkey Forest
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bali-ubud-monkey-forest',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальное сочетание природы и культуры  
- 🌍 Духовное пространство Убуда  
- 📸 Джунгли, храмы и обезьяны

## Билеты и посещение

- 💰 ~80 000 IDR  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Обезьян  
- 📷 Каменные мосты  
- 🌅 Свет в джунглях

## Практическая информация

- **Адрес:** Monkey Forest Rd, Ubud  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🌳 Лесные тропы  
- 🛕 Храмы  
- 🐒 Наблюдение за макаками

## Как добраться

- 🚶 Пешком из центра Убуда  
- 🚕 Такси  
- 🗺️ Ubud

## 🔷 Коммуникация и сервис

- 🕒 08:30–18:00  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Следите за вещами  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 Не кормить животных

## Локальная ценность

Лес сохраняет природный баланс и финансирует локальные храмы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌾 Tegallalang Rice Terraces
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bali-tegallalang-rice-terraces',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Икона балийских пейзажей  
- 🌍 Традиционная система орошения subak (UNESCO)  
- 📸 Террасы и пальмы

## Билеты и посещение

- 💰 Пожертвование ~10–20k IDR  
- 🎟️ —  
- 🆓 —

## Лучшие точки для фото

- 📷 Террасы сверху  
- 📷 Тропы  
- 🌅 Утренний туман

## Практическая информация

- **Адрес:** Tegallalang, Bali  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🌾 Рисовые террасы  
- 🚶 Прогулку по тропам  
- 📷 Фото с обзорных точек

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Север Убуда

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Многолюдно днём  
- 🌞 Лучшее время — утро  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Террасы отражают устойчивое земледелие и образ жизни балийцев.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏔️ Uluwatu Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bali-uluwatu-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый драматичный храм Бали  
- 🌍 Священное место на краю острова  
- 📸 Утёсы и океан

## Билеты и посещение

- 💰 ~50 000 IDR  
- 🎟️ Танец — отдельно  
- 🆓 —

## Лучшие точки для фото

- 📷 Утёсы  
- 📷 Храм  
- 🌅 Закат над океаном

## Практическая информация

- **Адрес:** Uluwatu, Bali  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🛕 Храм  
- 🎭 Танец кечак  
- 🌅 Закат

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Южный Бали, Улувату

## 🔷 Коммуникация и сервис

- 🕒 07:00–19:00  
- 🌐 Английский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Обезьяны воруют вещи  
- 🌞 Лучше к закату  
- 👕 Саронг обязателен  
- 🐾 —

## Локальная ценность

Храм — важная часть духовной защиты острова в балийской космологии.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌋 Mount Batur
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bali-mount-batur',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из лучших рассветов на Бали  
- 🌍 Вулканический ландшафт  
- 📸 Вид на кальдеру

## Билеты и посещение

- 💰 Тур ~400–600k IDR  
- 🎟️ С гидом  
- 🆓 —

## Лучшие точки для фото

- 📷 Рассвет  
- 📷 Кальдеру  
- 🌅 Озеро Батур

## Практическая информация

- **Адрес:** Kintamani, Bali  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🥾 Восхождение  
- 🌅 Рассвет  
- 🌋 Кратер

## Как добраться

- 🚕 Тур из Убуда  
- 🗺️ Северо-восток Бали

## 🔷 Коммуникация и сервис

- 🕒 Ночью/утром  
- 🌐 Английский  
- 📶 Связь ограничена  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Холодно наверху  
- 🌞 Нужна тёплая одежда  
- 👕 Треккинговая обувь  
- 🐾 —

## Локальная ценность

Вулкан поддерживает экотуризм и доход горных деревень.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💧 Tirta Empul Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bali-tirta-empul-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный храм очищения Бали  
- 🌍 Живые ритуалы  
- 📸 Источники и каменная архитектура

## Билеты и посещение

- 💰 ~50 000 IDR  
- 🎟️ Аренда саронга отдельно  
- 🆓 —

## Лучшие точки для фото

- 📷 Источники  
- 📷 Ритуалы  
- 🌅 Свет в храме

## Практическая информация

- **Адрес:** Tampaksiring, Bali  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 💦 Ритуал омовения  
- 🛕 Храмовый комплекс  
- 📷 Источники

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Tampaksiring, Bali

## 🔷 Коммуникация и сервис

- 🕒 08:00–18:00  
- 🌐 Английский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Соблюдайте ритуальные правила  
- 🌞 Лучше утром  
- 👕 Купальная одежда под саронг  
- 🐾 —

## Локальная ценность

Храм сохраняет духовные традиции и привлекает паломников со всего острова.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Potato Head Beach Club
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bali-potato-head-beach-club',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Seminyak

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучше днём  
- 👕 Beach chic  
- 🐾 —

## Локальная ценность

Клуб формирует имидж Бали как мировой лайфстайл-локации.

## Лучшие точки для фото

- 📷 Бассейн  
- 📷 Интерьер  
- 🌅 Закат

## Практическая информация

- **Адрес:** Seminyak, Bali  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Самый известный beach club Бали  
- 🌍 Музыка, дизайн и закаты  
- 📸 Бассейн и океан

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Коктейли  
- 🏊 Бассейн  
- 🌅 Закат

## Билеты и посещение

- 💰 Средний–высокий чек  
- 🎟️ Минимальный депозит  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 10:00–00:00  
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

-- Content block for: 🏝️ FINNS Beach Club
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bali-finns-beach-club',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Canggu

## Полезные нюансы

- ⚠️ Очень многолюдно  
- 🌞 Лучше днём  
- 👕 Beachwear  
- 🐾 —

## Локальная ценность

Клуб поддерживает туристическую экономику и ночную жизнь Бали.

## Лучшие точки для фото

- 📷 Бассейны  
- 📷 Толпы  
- 🌅 Закат

## Практическая информация

- **Адрес:** Canggu, Bali  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Самый масштабный beach club острова  
- 🌍 Молодёжная и серф-атмосфера  
- 📸 Бассейны и вечеринки

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Напитки  
- 🏊 Бассейны  
- 🌅 Закат

## Билеты и посещение

- 💰 Средний–высокий чек  
- 🎟️ Депозит на лежаки  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 11:00–00:00  
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

-- Content block for: 🪨 The Rock Bar Bali
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bali-the-rock-bar-bali',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Uluwatu

## Полезные нюансы

- ⚠️ Дресс-код  
- 🌞 Лучше к закату  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Бар стал мировым символом балийского курортного дизайна.

## Лучшие точки для фото

- 📷 Бар  
- 📷 Волны  
- 🌅 Закат

## Практическая информация

- **Адрес:** Uluwatu, Bali  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Один из самых известных баров мира  
- 🌍 Архитектура и океан  
- 📸 Бар на скале

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Коктейли  
- 🌊 Вид на океан  
- 🌅 Закат

## Билеты и посещение

- 💰 Высокий чек  
- 🎟️ Очереди  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 16:00–23:00  
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

-- Content block for: ☕ Clear Café Ubud
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bali-clear-cafe-ubud',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра Убуда  
- 🚕 Такси  
- 🗺️ Central Ubud

## Полезные нюансы

- ⚠️ Многолюдно в обед  
- 🌞 Лучше утром или вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе поддерживает устойчивую гастрономию и wellness-культуру Убуда.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Боулы и смузи  
- 🌅 Свет во дворике

## Практическая информация

- **Адрес:** Ubud, Bali  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Культовое место wellness-сцены Убуда  
- 🌍 Фокус на здоровье и осознанное питание  
- 📸 Интерьер, подача и зелёные дворики

## 🔵 Что обязательно посмотреть / попробовать

- 🥗 Боулы и салаты  
- 🥤 Смузи и соки  
- 🍰 Полезные десерты

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 08:00–22:00  
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

-- Content block for: 🍽️ Locavore Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bali-locavore-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Central Ubud

## Полезные нюансы

- ⚠️ Бронировать за несколько дней  
- 🌞 Только вечерний формат  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан продвигает балийские продукты и фермеров на мировой гастросцене.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Интерьер  
- 🌅 Атмосферу вечера

## Практическая информация

- **Адрес:** Ubud, Bali  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Ресторан мирового уровня  
- 🌍 Современная интерпретация балийской кухни  
- 📸 Авторская подача

## 🔵 Что обязательно посмотреть / попробовать

- 🍽 Дегустационный сет  
- 🍷 Вино и pairing  
- 🌿 Блюда из локальных продуктов

## Билеты и посещение

- 💰 💎 Premium  
- 🎟️ Бронирование обязательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 18:00–23:00  
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

-- Content block for: 🏄 Single Fin Bali
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bali-single-fin-bali',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Uluwatu

## Полезные нюансы

- ⚠️ Очень многолюдно по выходным  
- 🌞 Лучше прийти заранее  
- 👕 Casual / surf  
- 🐾 —

## Локальная ценность

Бар сформировал глобальный образ Улувату как серф-столицы Бали.

## Лучшие точки для фото

- 📷 Океан  
- 📷 Бар  
- 🌅 Закат над скалами

## Практическая информация

- **Адрес:** Uluwatu, Bali  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Икона серф-культуры Бали  
- 🌍 Музыка, океан и закаты  
- 📸 Бар над волнами

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Коктейли  
- 🎶 DJ-сеты  
- 🌅 Закат

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Вход свободный  
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

-- Content block for: 🗼 National Monument
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'jkt-national-monument',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный символ Индонезии  
- 🌍 Историческое и политическое сердце страны  
- 📸 Монумент и панорама города

## Структура комплекса

- 🗼 Монумент Monas  
- 🔭 Смотровую площадку  
- 🚶 Прогулку по площади

## Билеты и посещение

- 💰 ~24 000 IDR  
- 🎟️ Билет на подъём отдельно  
- 🆓 Парк вокруг — бесплатно

## Лучшие точки для фото

- 📷 Монумент целиком  
- 📷 Панораму города  
- 🌅 Закат над центром

## Практическая информация

- **Адрес:** Merdeka Square, Jakarta  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚇 MRT Bundaran HI + пешком  
- 🚕 Такси / Grab  
- 🗺️ Central Jakarta

## 🔷 Коммуникация и сервис

- 🕒 08:00–22:00  
- 🌐 Английский, индонезийский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Очереди в выходные  
- 🌞 Лучше утром  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Monas — ключевой символ национальной идентичности и независимости Индонезии.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛 Kota Tua Jakarta
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'jkt-kota-tua-jakarta',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Исторические корни Джакарты  
- 🌍 Колониальное наследие  
- 📸 Площади и музеи

## Структура комплекса

- 🏛 Fatahillah Square  
- 🚲 Прокат велосипедов  
- 🖼 Музеи

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Музеи — платно  
- 🆓 Прогулка свободная

## Лучшие точки для фото

- 📷 Колониальные здания  
- 📷 Площадь  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Kota Tua, Jakarta  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚆 KRL до Jakarta Kota  
- 🚕 Такси  
- 🗺️ North Jakarta

## 🔷 Коммуникация и сервис

- 🕒 Днём  
- 🌐 Английский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Район сохраняет историческую память и культурные институции города.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕌 Istiqlal Mosque
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'jkt-istiqlal-mosque',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая большая мечеть региона  
- 🌍 Символ межрелигиозного диалога  
- 📸 Масштаб и архитектура

## Структура комплекса

- 🕌 Главный зал  
- 🚶 Внутренние галереи  
- 📷 Архитектурные детали

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Экскурсии возможны  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Купол  
- 📷 Интерьеры  
- 🌅 Свет в зале

## Практическая информация

- **Адрес:** Central Jakarta  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🚶 Пешком от Monas  
- 🗺️ Central Jakarta

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Английский, индонезийский  
- 📶 Интернет  
- 💳 —

## Полезные нюансы

- ⚠️ Скромная одежда обязательна  
- 🌞 Лучше вне молитв  
- 👕 Закрытая одежда  
- 🐾 —

## Локальная ценность

Мечеть играет ключевую роль в религиозной и общественной жизни страны.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛪ Jakarta Cathedral
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'jkt-jakarta-cathedral',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Символ религиозного сосуществования  
- 🌍 Колониальная архитектура  
- 📸 Контраст с мечетью

## Структура комплекса

- ⛪ Интерьер  
- 🚶 Площадь  
- 📷 Фото фасада

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Фасад  
- 📷 Интерьер  
- 🌅 Контраст с мечетью

## Практическая информация

- **Адрес:** Central Jakarta  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком от Istiqlal  
- 🚕 Такси  
- 🗺️ Central Jakarta

## 🔷 Коммуникация и сервис

- 🕒 Днём  
- 🌐 Английский  
- 📶 Интернет  
- 💳 —

## Полезные нюансы

- ⚠️ Тихое поведение  
- 🌞 Лучше днём  
- 👕 Скромная одежда  
- 🐾 —

## Локальная ценность

Собор подчёркивает межрелигиозную гармонию индонезийского общества.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎢 Ancol Dreamland
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'jkt-ancol-dreamland',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главная зона развлечений города  
- 🌍 Море, парки и семейный отдых  
- 📸 Побережье и аттракционы

## Структура комплекса

- 🎢 Аттракционы  
- 🏖 Пляжи  
- 🐠 Sea World

## Билеты и посещение

- 💰 ~25 000 IDR + зоны отдельно  
- 🎟️ Комбинированные билеты  
- 🆓 —

## Лучшие точки для фото

- 📷 Побережье  
- 📷 Аттракционы  
- 🌅 Закат

## Практическая информация

- **Адрес:** Ancol, Jakarta  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🚌 Автобус  
- 🗺️ North Jakarta

## 🔷 Коммуникация и сервис

- 🕒 10:00–22:00  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Наличные, карты

## Полезные нюансы

- ⚠️ Многолюдно в выходные  
- 🌞 Лучше днём  
- 👕 Повседневная одежда  
- 🐾 —

## Локальная ценность

Комплекс создаёт рабочие места и формирует досуг мегаполиса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 Taman Mini Indonesia Indah
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'jkt-taman-mini-indonesia-indah',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Вся Индонезия в одном месте  
- 🌍 Этнографическое разнообразие  
- 📸 Традиционные дома

## Структура комплекса

- 🏘 Павильоны регионов  
- 🖼 Музеи  
- 🚶 Прогулки по парку

## Билеты и посещение

- 💰 ~25 000 IDR  
- 🎟️ Музеи отдельно  
- 🆓 —

## Лучшие точки для фото

- 📷 Дома  
- 📷 Озеро  
- 🌅 Панорамы

## Практическая информация

- **Адрес:** East Jakarta  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🗺️ East Jakarta

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Английский  
- 📶 Интернет  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Территория большая  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Парк способствует сохранению культурного наследия страны.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Skye Bar & Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'jkt-skye-bar-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Central Jakarta

## Полезные нюансы

- ⚠️ Дресс-код  
- 🌞 Лучше вечером  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Rooftops формируют современный городской лайфстайл Джакарты.

## Лучшие точки для фото

- 📷 Панораму  
- 📷 Бар  
- 🌅 Закат

## Практическая информация

- **Адрес:** Central Jakarta  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший rooftop в центре  
- 🌍 Современный облик города  
- 📸 Skyline и вечерние огни

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Коктейли  
- 🍽 Ужин  
- 🌅 Закат

## Билеты и посещение

- 💰 Средний–высокий чек  
- 🎟️ Вход свободный  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 17:00–00:00  
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

-- Content block for: ☕ Café Batavia
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'jkt-cafe-batavia',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком  
- 🚕 Такси  
- 🗺️ Kota Tua

## Полезные нюансы

- ⚠️ Туристическое место  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе сохраняет атмосферу колониального прошлого города.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Площадь  
- 🌅 Свет в окнах

## Практическая информация

- **Адрес:** Fatahillah Square, Jakarta  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Икона колониальной Джакарты  
- 🌍 Историческая атмосфера  
- 📸 Интерьеры в стиле ар-деко

## 🔵 Что обязательно посмотреть / попробовать

- 🍽 Интернациональную кухню  
- 🍰 Десерты  
- 🕰 Атмосферу прошлого

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 10:00–23:00  
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

-- Content block for: 🍜 Nasi Goreng Kambing Kebon Sirih
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'jkt-nasi-goreng-kambing-kebon-sirih',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Central Jakarta

## Полезные нюансы

- ⚠️ Очереди  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Место сохраняет уличные гастрономические традиции города.

## Лучшие точки для фото

- 📷 Вок  
- 📷 Блюдо  
- 🌅 Ночная улица

## Практическая информация

- **Адрес:** Kebon Sirih, Jakarta  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Культовая уличная еда  
- 🌍 Подлинный вкус Джакарты  
- 📸 Приготовление на воке

## 🔵 Что обязательно посмотреть / попробовать

- 🍚 Nasi goreng kambing  
- 🥩 Баранина  
- 🥤 Напитки

## Билеты и посещение

- 💰 Бюджетно  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 Вечером  
- 🌐 Индонезийский  
- 📶 Связь ограничена  
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

-- Content block for: 🍽 Plataran Menteng
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'jkt-plataran-menteng',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси / Grab  
- 🗺️ Menteng, Central Jakarta

## Полезные нюансы

- ⚠️ Подходит для спокойного ужина  
- 🌞 Лучшее время — вечер  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан продвигает национальную кухню Индонезии на высоком гастрономическом уровне.

## Лучшие точки для фото

- 📷 Интерьер особняка  
- 📷 Подачу блюд  
- 🌅 Вечерний сад

## Практическая информация

- **Адрес:** Menteng, Jakarta  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Эталон индонезийской кухни  
- 🌍 Историческое здание и сад  
- 📸 Атмосфера колониальной Джакарты

## 🔵 Что обязательно посмотреть / попробовать

- 🍽 Традиционные блюда с авторской подачей  
- 🍷 Напитки и десерты  
- 🌿 Ужин в саду

## Билеты и посещение

- 💰 💎 Premium  
- 🎟️ Бронирование рекомендуется  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 11:00–22:00  
- 🌐 Английский, индонезийский  
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

-- Content block for: ☕ Union Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'jkt-union-cafe',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Plaza Senayan

## Полезные нюансы

- ⚠️ Очень популярно  
- 🌞 Подходит в любое время дня  
- 👕 Casual chic  
- 🐾 —

## Локальная ценность

Union стал частью современной гастрономической сцены Джакарты.

## Лучшие точки для фото

- 📷 Десерты  
- 📷 Интерьер  
- 🌅 Атмосфера зала

## Практическая информация

- **Адрес:** Plaza Senayan, Jakarta  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Одно из самых популярных кафе Джакарты  
- 🌍 Современный городской формат  
- 📸 Десерты и стильный интерьер

## 🔵 Что обязательно посмотреть / попробовать

- 🍰 Фирменные торты  
- ☕ Кофе  
- 🍽 Основные блюда

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Очереди в выходные  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 10:00–22:00  
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

-- Content block for: 🍹 Social House
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'jkt-social-house',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Grand Indonesia Mall

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучше вечером  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Заведение отражает современную космополитичную культуру Джакарты.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Коктейли  
- 🌅 Вечерний город

## Практическая информация

- **Адрес:** Grand Indonesia, Jakarta  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Популярное место для встреч  
- 🌍 Современный городской лайфстайл  
- 📸 Вид на центр Джакарты

## 🔵 Что обязательно посмотреть / попробовать

- 🍽 Интернациональные блюда  
- 🍹 Коктейли  
- 🌆 Вечерний вид

## Билеты и посещение

- 💰 Средний–высокий чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 11:00–23:00  
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

-- Content block for: 🦎 Komodo National Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lbj-komodo-national-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главная причина приехать в Лабуан-Баджо  
- 🌍 Уникальная экосистема UNESCO  
- 📸 Драконы, острова и бирюзовые бухты

## Билеты и посещение

- 💰 Пакеты/вход зависит от маршрута  
- 🎟️ Туры на лодке — основной формат  
- 🆓 —

## Лучшие точки для фото

- 📷 Драконов  
- 📷 Панорамы островов  
- 🌅 Закат с лодки

## Практическая информация

- **Адрес:** Komodo National Park, Flores  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🦎 Драконов Комодо (с рейнджером)  
- 🏝 Остров Padar (панорама)  
- 🤿 Сноркелинг/дайвинг на рифах

## Как добраться

- 🚤 Лодка из Labuan Bajo Harbour  
- 🚕 До порта на такси  
- 🗺️ Острова вокруг Flores

## 🔷 Коммуникация и сервис

- 🕒 По расписанию туров  
- 🌐 Английский, индонезийский  
- 📶 Связь ограничена на островах  
- 💳 Наличные (часто), карты — у операторов

## Полезные нюансы

- ⚠️ Драконы опасны — только с рейнджером  
- 🌞 Лучший сезон — сухой  
- 👕 Трекинговая обувь и вода  
- 🐾 Не подходить к животным

## Локальная ценность

Парк обеспечивает основную занятость региона и финансирует охрану уникальной природы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌄 Padar Island Viewpoint
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lbj-padar-island-viewpoint',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая “открыточная” точка региона  
- 🌍 Уникальный ландшафт национального парка  
- 📸 Панорама трёх бухт

## Билеты и посещение

- 💰 В составе тура  
- 🎟️ Оплачивается через лодочные пакеты  
- 🆓 —

## Лучшие точки для фото

- 📷 Три бухты  
- 📷 Тропу на вершину  
- 🌅 Рассвет

## Практическая информация

- **Адрес:** Padar Island, Komodo NP  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🥾 Подъём на смотровую  
- 📷 Фото панорамы  
- 🌅 Утренний свет

## Как добраться

- 🚤 На лодке из Labuan Bajo  
- 🗺️ Padar Island

## 🔷 Коммуникация и сервис

- 🕒 По расписанию туров  
- 🌐 Английский  
- 📶 Связь отсутствует  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Очень жарко и пыльно  
- 🌞 Лучшее время — рассвет  
- 👕 Кроссовки и вода  
- 🐾 Осторожно на тропе

## Локальная ценность

Площадка стала визитной карточкой региона и стимулирует устойчивый туризм.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖 Pink Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lbj-pink-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из немногих розовых пляжей в мире  
- 🌍 Коралловая экосистема  
- 📸 Розовый песок и прозрачная вода

## Билеты и посещение

- 💰 В составе тура  
- 🎟️ —  
- 🆓 —

## Лучшие точки для фото

- 📷 Розовый песок  
- 📷 Береговую линию  
- 🌅 Свет на воде

## Практическая информация

- **Адрес:** Komodo National Park  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🏖 Пляж  
- 🤿 Сноркелинг  
- 📷 Фото песка

## Как добраться

- 🚤 На лодке  
- 🗺️ Komodo NP

## 🔷 Коммуникация и сервис

- 🕒 Днём  
- 🌐 Английский  
- 📶 Нет связи  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Беречь кораллы  
- 🌞 Лучше утром  
- 👕 Акваобувь  
- 🐾 Экоправила

## Локальная ценность

Пляж поддерживает экотуризм и охрану морской природы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐋 Manta Point
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lbj-manta-point',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Шанс увидеть мант в дикой природе  
- 🌍 Один из лучших дайв-спотов региона  
- 📸 Подводный мир

## Билеты и посещение

- 💰 В составе тура  
- 🎟️ Дайв-пакеты отдельно  
- 🆓 —

## Лучшие точки для фото

- 📷 Мант  
- 📷 Кораллы  
- 🌅 Вид с лодки

## Практическая информация

- **Адрес:** Komodo NP waters  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🤿 Сноркелинг с мантами  
- 🐠 Дайвинг  
- 📷 Подводные фото

## Как добраться

- 🚤 На лодке из Labuan Bajo  
- 🗺️ Komodo NP waters

## 🔷 Коммуникация и сервис

- 🕒 По условиям погоды  
- 🌐 Английский  
- 📶 Нет связи  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Течения сильные  
- 🌞 Лучшее время — сухой сезон  
- 👕 Акваобувь / гидрокостюм  
- 🐾 Не касаться мант

## Локальная ценность

Точка поддерживает дайв-экономику региона и мотивирует сохранение морской фауны.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕳 Batu Cermin Cave
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lbj-batu-cermin-cave',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лёгкая экскурсия недалеко от города  
- 🌍 Геология острова Flores  
- 📸 Луч света внутри пещеры

## Билеты и посещение

- 💰 Бюджетно  
- 🎟️ Билет на месте  
- 🆓 —

## Лучшие точки для фото

- 📷 Вход  
- 📷 Луч света  
- 🌅 Текстуры стен

## Практическая информация

- **Адрес:** Batu Cermin, Labuan Bajo  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🕳 Пещеру  
- 🔦 Луч света  
- 📷 Сталагмиты

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ 10–15 минут от центра

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Индонезийский, базовый английский  
- 📶 Связь стабильная  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Нужен фонарик/гид  
- 🌞 Лучше днём  
- 👕 Удобная обувь  
- 🐾 Осторожно на камнях

## Локальная ценность

Пещера поддерживает локальные экскурсии и знакомит туристов с природой Флореса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌅 Labuan Bajo Sunset Harbor
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lbj-labuan-bajo-sunset-harbor',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшие закаты в городе  
- 🌍 Центр морской жизни и туров  
- 📸 Лодки, бухта и вечерние огни

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Лодки в бухте  
- 📷 Закат  
- 🌅 Огни города

## Практическая информация

- **Адрес:** Labuan Bajo Harbour  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🌅 Закат у воды  
- 🚶 Прогулку по набережной  
- 📷 Фото лодок и бухты

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Harbor area

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Интернет стабильный  
- 💳 —

## Полезные нюансы

- ⚠️ Очень оживлённо вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Набережная объединяет местных и туристов и поддерживает экономику лодочных туров.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ La Cucina
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lbj-la-cucina',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ AYANA Komodo, Labuan Bajo

## Полезные нюансы

- ⚠️ Smart casual  
- 🌞 Лучшее время — закат  
- 👕 Опрятная одежда  
- 🐾 —

## Локальная ценность

Премиальный сервис поднимает статус направления и развивает качественный туризм.

## Лучшие точки для фото

- 📷 Террасу  
- 📷 Подачу блюд  
- 🌅 Закат

## Практическая информация

- **Адрес:** Labuan Bajo, Flores  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший premium dining в городе  
- 🌍 Ужин с видом на острова  
- 📸 Панорамная терраса и закаты

## 🔵 Что обязательно посмотреть / попробовать

- 🍽 Морепродукты  
- 🍷 Вино/коктейли  
- 🌅 Закат с террасы

## Билеты и посещение

- 💰 💎 Premium  
- 🎟️ Бронирование желательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 12:00–22:00  
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

-- Content block for: 🌃 Atlantis on the Rock
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lbj-atlantis-on-the-rock',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Harbor area

## Полезные нюансы

- ⚠️ Лучшие места быстро занимают  
- 🌞 Приходить заранее  
- 👕 Casual chic  
- 🐾 —

## Локальная ценность

Rooftop-бары развивают городскую экономику и вечернюю инфраструктуру направления.

## Лучшие точки для фото

- 📷 Порт сверху  
- 📷 Коктейль на фоне заката  
- 🌅 Огни города

## Практическая информация

- **Адрес:** Labuan Bajo Harbour  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший rooftop для заката  
- 🌍 Атмосфера вечерней Лабуан-Баджо  
- 📸 Панорамы гавани

## 🔵 Что обязательно посмотреть / попробовать

- 🍹 Коктейли  
- 🌅 Закат  
- 🎶 Музыку вечером

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Вход свободный  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 17:00–00:00  
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

-- Content block for: 🥗 Happy Banana Komodo
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lbj-happy-banana-komodo',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Central Labuan Bajo

## Полезные нюансы

- ⚠️ Многолюдно утром  
- 🌞 Лучшее время — завтрак  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе поддерживает современную туристическую инфраструктуру и здоровый формат питания в городе.

## Лучшие точки для фото

- 📷 Боулы  
- 📷 Интерьер  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Labuan Bajo  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший healthy-формат в городе  
- 🌍 Любимо у путешественников и цифровых кочевников  
- 📸 Яркие боулы и напитки

## 🔵 Что обязательно посмотреть / попробовать

- 🥗 Smoothie bowl  
- 🥤 Смузи  
- ☕ Кофе

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 07:00–21:00  
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

-- Content block for: 🦞 Taman Laut Handayani Seafood
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lbj-taman-laut-handayani-seafood',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком от порта  
- 🚕 Такси  
- 🗺️ Harbor area

## Полезные нюансы

- ⚠️ Лучше приходить на ужин  
- 🌞 Вечером приятнее  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан поддерживает местных рыбаков и формирует гастрономический образ направления.

## Лучшие точки для фото

- 📷 Витрины с уловом  
- 📷 Подачу блюд  
- 🌅 Вечерний порт

## Практическая информация

- **Адрес:** Labuan Bajo Harbour  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Надёжный выбор морепродуктов  
- 🌍 Локальная кухня у гавани  
- 📸 Атмосфера порта

## 🔵 Что обязательно посмотреть / попробовать

- 🍤 Морепродукты на гриле  
- 🦀 Крабы/креветки  
- 🍚 Рис и соусы

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 11:00–22:00  
- 🌐 Индонезийский, базовый английский  
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

-- Content block for: 🌮 Bajo Taco
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lbj-bajo-taco',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Central Labuan Bajo

## Полезные нюансы

- ⚠️ Быстро разбирают популярные позиции  
- 🌞 Хорошо для обеда  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Место поддерживает туристический формат “быстро и качественно” для тех, кто живёт турами по Комодо.

## Лучшие точки для фото

- 📷 Тако/буррито  
- 📷 Интерьер  
- 🌅 Вечерний вайб улиц

## Практическая информация

- **Адрес:** Labuan Bajo  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший “быстрый” формат для путешественников  
- 🌍 Интернациональная кухня в туристическом хабе  
- 📸 Яркая подача

## 🔵 Что обязательно посмотреть / попробовать

- 🌮 Тако  
- 🌯 Буррито  
- 🥤 Напитки

## Билеты и посещение

- 💰 Бюджет–средний  
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

-- Content block for: 🤿 Scuba Junkie Komodo
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lbj-scuba-junkie-komodo',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Central Labuan Bajo

## Полезные нюансы

- ⚠️ Планируйте заранее в сезон  
- 🌞 Лучшее время — сухой сезон  
- 👕 Купальные вещи/сменная одежда  
- 🐾 Следовать инструктажу

## Локальная ценность

Дайв-центры формируют ядро экономики Лабуан-Баджо и поддерживают устойчивый морской туризм.

## Лучшие точки для фото

- 📷 Экипировку  
- 📷 Лодку/порт  
- 🌅 Рассвет перед выходом

## Практическая информация

- **Адрес:** Labuan Bajo  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Удобный сервис для дайвинга в Комодо  
- 🌍 Безопасный формат с инструкторами  
- 📸 Подводные впечатления и обучение

## 🔵 Что обязательно посмотреть / попробовать

- 🤿 Дайв-туры  
- 🧑‍🏫 Курс (по желанию)  
- 🪸 Сноркелинг-трип

## Билеты и посещение

- 💰 Дайв-туры: средний–высокий чек  
- 🎟️ По бронированию  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 08:00–18:00  
- 🌐 Английский, индонезийский  
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

-- Content block for: 🌋 Mount Rinjani National Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lom-mount-rinjani-national-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший треккинг в Индонезии после Бали  
- 🌍 Активный вулкан и уникальная природа  
- 📸 Озеро в кальдере и панорамы с высоты

## Билеты и посещение

- 💰 Парк + тур: средний–высокий чек  
- 🎟️ Только с гидом/туроператором  
- 🆓 —

## Лучшие точки для фото

- 📷 Кальдеру и озеро  
- 📷 Линию рассвета  
- 🌅 Туман над склонами

## Практическая информация

- **Адрес:** Rinjani National Park, Lombok  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🥾 Трек к кратеру  
- 🏞 Озеро Segara Anak  
- 🌅 Рассвет на маршруте

## Как добраться

- 🚕 Трансфер из Senggigi или Kuta Lombok  
- 🚌 Тур  
- 🗺️ Север Ломбока

## 🔷 Коммуникация и сервис

- 🕒 Туры 2–4 дня  
- 🌐 Английский у гидов, индонезийский  
- 📶 Связь ограничена  
- 💳 Наличные (часто)

## Полезные нюансы

- ⚠️ Требуется хорошая физподготовка  
- 🌞 Лучший сезон — сухой  
- 👕 Тёплая одежда и трек-обувь  
- 🐾 Соблюдать безопасность вулкана

## Локальная ценность

Ринджани — главный природный ресурс острова и источник дохода местных общин через треккинг-туризм.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝️ Gili Islands
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lom-gili-islands',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самые популярные острова региона  
- 🌍 Чистая вода и подводный мир  
- 📸 Пляжи, велосипеды и закаты

## Билеты и посещение

- 💰 Переправа: бюджет–средний  
- 🎟️ Лодки и туры — отдельно  
- 🆓 Пляжи бесплатны

## Лучшие точки для фото

- 📷 Закат  
- 📷 Подводный мир  
- 🌅 Велосипеды на пляже

## Практическая информация

- **Адрес:** Gili Islands, North Lombok  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🤿 Сноркелинг с черепахами  
- 🚲 Велопрогулки  
- 🌅 Закат на Gili T

## Как добраться

- 🚤 Лодка из Bangsal / Teluk Nare  
- 🚕 Такси до порта  
- 🗺️ Северо-запад Ломбока

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Интернет стабильнее на Gili T  
- 💳 Наличные (часто), карты — в отелях

## Полезные нюансы

- ⚠️ На островах нет машин  
- 🌞 Лучше сухой сезон  
- 👕 Акваобувь  
- 🐾 Уважайте рифы

## Локальная ценность

Острова поддерживают экономику Ломбока через морской туризм и дайв-сервисы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Kuta Lombok
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lom-kuta-lombok',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшие пляжи юга Ломбока  
- 🌍 Альтернатива Бали без толп  
- 📸 Береговые линии и холмы

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Парковки/въезды на отдельные пляжи — платно  
- 🆓 Пляжи общественные

## Лучшие точки для фото

- 📷 Холмы у побережья  
- 📷 Пляжи  
- 🌅 Закат

## Практическая информация

- **Адрес:** Kuta, Lombok  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🏖 Пляжи Kuta и окрестности  
- 🏄 Серфинг  
- 🌅 Закат

## Как добраться

- 🚕 Трансфер из аэропорта LOP  
- 🛵 Байк  
- 🗺️ Южный Ломбок

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Интернет стабильный  
- 💳 Наличные, карты в отелях

## Полезные нюансы

- ⚠️ Дороги на байке местами плохие  
- 🌞 Лучшее время — сухой сезон  
- 👕 Солнцезащита обязательна  
- 🐾 —

## Локальная ценность

Mandalika развивает туризм острова и создаёт новые рабочие места для местного населения.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝️ Tanjung Aan Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lom-tanjung-aan-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший “открыточный” пляж Mandalika  
- 🌍 Чистая вода и мягкий песок  
- 📸 Просторные виды

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Парковка платно  
- 🆓 Пляж общественный

## Лучшие точки для фото

- 📷 Берег  
- 📷 Бирюзовую воду  
- 🌅 Закат

## Практическая информация

- **Адрес:** Tanjung Aan, Lombok  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🏖 Купание  
- 🏄 Серфинг на лёгких волнах  
- 🌅 Закат

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ 15–20 минут от Kuta Lombok

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Связь стабильная  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Мало тени  
- 🌞 Лучше утром  
- 👕 Головной убор  
- 🐾 —

## Локальная ценность

Пляж поддерживает малый локальный бизнес (парковка, напитки, прокат).
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Sendang Gile Waterfall
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lom-sendang-gile-waterfall',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Природная локация рядом с Ринджани  
- 🌍 Тропический лес  
- 📸 Вода и зелень

## Билеты и посещение

- 💰 Бюджетно (входной сбор)  
- 🎟️ Гид по желанию  
- 🆓 —

## Лучшие точки для фото

- 📷 Каскад  
- 📷 Тропу  
- 🌅 Свет в лесу

## Практическая информация

- **Адрес:** Senaru, North Lombok  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 💦 Водопад  
- 🚶 Тропу  
- 📷 Фото у воды

## Как добраться

- 🚕 Такси / тур  
- 🛵 Байк  
- 🗺️ Senaru, North Lombok

## 🔷 Коммуникация и сервис

- 🕒 08:00–17:00  
- 🌐 Индонезийский, базовый английский  
- 📶 Связь слабая  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Скользко после дождей  
- 🌞 Лучше утром  
- 👕 Акваобувь  
- 🐾 —

## Локальная ценность

Водопад поддерживает экотуризм и доход местных жителей в Senaru.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏄 Selong Belanak Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lom-selong-belanak-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из лучших пляжей для новичков в серфинге  
- 🌍 Спокойная бухта  
- 📸 Просторная береговая линия

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Уроки серфинга — платно  
- 🆓 Пляж общественный

## Лучшие точки для фото

- 📷 Волны  
- 📷 Серферов  
- 🌅 Закат

## Практическая информация

- **Адрес:** Selong Belanak, Lombok  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🏄 Урок серфинга  
- 🏖 Купание  
- 🌅 Закат

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Юг Ломбока, 30–40 минут от Kuta

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Мало тени  
- 🌞 Лучше утром  
- 👕 Солнцезащита  
- 🐾 —

## Локальная ценность

Пляж развивает серф-школы и небольшие местные сервисы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Ashtari Lounge & Kitchen
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lom-ashtari-lounge-kitchen',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Рядом с Kuta Lombok

## Полезные нюансы

- ⚠️ Дорога на холм узкая  
- 🌞 Лучше к закату  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Заведение поддерживает развитие туристической сцены Mandalika.

## Лучшие точки для фото

- 📷 Вид на море  
- 📷 Террасу  
- 🌅 Закат

## Практическая информация

- **Адрес:** Kuta Lombok area  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшее кафе-видовая точка Mandalika  
- 🌍 Расслабленная атмосфера и йога-вайб  
- 📸 Панорамы и закаты

## 🔵 Что обязательно посмотреть / попробовать

- 🍽 Лёгкие блюда  
- ☕ Кофе  
- 🌅 Закат с террасы

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 08:00–22:00  
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

-- Content block for: 🥐 El Bazar Café & Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lom-el-bazar-cafe-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком по Kuta  
- 🚕 Такси  
- 🗺️ Central Kuta Lombok

## Полезные нюансы

- ⚠️ Многолюдно утром  
- 🌞 Лучше ранний завтрак  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе поддерживает современный туристический сервис в Kuta Lombok.

## Лучшие точки для фото

- 📷 Завтрак  
- 📷 Интерьер  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Kuta, Lombok  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший завтрак в Куте  
- 🌍 Уютная атмосфера  
- 📸 Дизайн и подача

## 🔵 Что обязательно посмотреть / попробовать

- 🍳 Завтраки  
- ☕ Кофе  
- 🍰 Десерты

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 07:00–22:00  
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

-- Content block for: 🌮 The Mexican in Lombok
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lom-the-mexican-in-lombok',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком  
- 🚕 Такси  
- 🗺️ Kuta Lombok

## Полезные нюансы

- ⚠️ Быстро разбирают популярные позиции  
- 🌞 Хорошо для обеда  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Такие заведения поддерживают туризм и разнообразие гастросцены на острове.

## Лучшие точки для фото

- 📷 Тако/буррито  
- 📷 Интерьер  
- 🌅 Вечерний вайб

## Практическая информация

- **Адрес:** Kuta, Lombok  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший быстрый формат для серферов  
- 🌍 Разнообразие кухни в туристической зоне  
- 📸 Яркая подача

## 🔵 Что обязательно посмотреть / попробовать

- 🌮 Тако  
- 🌯 Буррито  
- 🥤 Напитки

## Билеты и посещение

- 💰 Бюджет–средний  
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

-- Content block for: 🦞 Senggigi Seafood Market & BBQ
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lom-senggigi-seafood-market-bbq',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Senggigi, West Lombok

## Полезные нюансы

- ⚠️ Лучшие позиции заканчиваются  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Поддерживает местных рыбаков и формирует гастрономическую культуру побережья.

## Лучшие точки для фото

- 📷 Гриль  
- 📷 Блюда  
- 🌅 Закат у моря

## Практическая информация

- **Адрес:** Senggigi, Lombok  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Свежие морепродукты  
- 🌍 Аутентичный локальный опыт  
- 📸 Гриль и вечерняя атмосфера

## 🔵 Что обязательно посмотреть / попробовать

- 🍤 Морепродукты на гриле  
- 🦀 Крабы/креветки  
- 🌅 Ужин у моря

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 17:00–22:00  
- 🌐 Индонезийский, базовый английский  
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

-- Content block for: ☕ Lombok Coffee House
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lom-lombok-coffee-house',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком по Kuta  
- 🚕 Такси  
- 🗺️ Central Kuta Lombok

## Полезные нюансы

- ⚠️ Многолюдно утром  
- 🌞 Лучшее время — завтрак  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кофейня поддерживает рост современной сервисной экономики Kuta Lombok.

## Лучшие точки для фото

- 📷 Кофе  
- 📷 Интерьер  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Kuta, Lombok  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Хороший кофе и спокойный формат  
- 🌍 Удобно для утренней рутины путешественника  
- 📸 Минималистичный интерьер

## 🔵 Что обязательно посмотреть / попробовать

- ☕ Фильтр-кофе  
- 🥐 Выпечку  
- 🍰 Десерты

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

-- Content block for: 🏄 Surf Shack Lombok
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lom-surf-shack-lombok',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком по Kuta  
- 🚕 Такси  
- 🗺️ Kuta Lombok

## Полезные нюансы

- ⚠️ Лучше бронировать утром  
- 🌞 Сезон волн зависит от месяца  
- 👕 Купальная одежда и защита от солнца  
- 🐾 Следовать инструктажу

## Локальная ценность

Серф-школы развивают устойчивый туризм и создают рабочие места для местных инструкторов.

## Лучшие точки для фото

- 📷 Доски и экипировку  
- 📷 Урок на пляже  
- 🌅 Серф на закате

## Практическая информация

- **Адрес:** Kuta Lombok  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший сервис для серфинга на юге Ломбока  
- 🌍 Удобно для обучения и аренды  
- 📸 Серф-вайб и пляжная культура

## 🔵 Что обязательно посмотреть / попробовать

- 🏄 Урок серфинга  
- 🧰 Аренду доски  
- 🏖 Выезд на пляжи (Tanjung Aan / Selong Belanak)

## Билеты и посещение

- 💰 Уроки/аренда: средний чек  
- 🎟️ По записи  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 08:00–18:00  
- 🌐 Английский, индонезийский  
- 📶 Интернет  
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

-- Content block for: 🏯 Borobudur Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'yog-borobudur-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главная достопримечательность Индонезии  
- 🌍 Шедевр древней инженерии и духовности  
- 📸 Рассвет над храмом — один из лучших моментов в стране

## Билеты и посещение

- 💰 ~500 000 IDR (включая трансфер)  
- 🎟️ Билеты лучше покупать онлайн  
- 🆓 —

## Лучшие точки для фото

- 📷 Храм на рассвете  
- 📷 Барельефы  
- 🌅 Панораму с холма

## Практическая информация

- **Адрес:** Borobudur, Magelang  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🏯 Подъём на вершину храма  
- 📷 Фото барельефов и ступ  
- 🌅 Рассвет с точки Penataran Hill

## Как добраться

- 🚕 Такси / Grab из Джокьякарты (~1 час)  
- 🚌 Экскурсионные автобусы  
- 🗺️ Magelang Regency

## 🔷 Коммуникация и сервис

- 🕒 06:00–17:00  
- 🌐 Английский, индонезийский  
- 📶 Интернет ограничен  
- 💳 Наличные, карты у операторов

## Полезные нюансы

- ⚠️ Очень многолюдно на рассвете  
- 🌞 Лучше приехать до 05:00  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Храм — духовный центр буддизма в Индонезии и источник гордости для местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛 Prambanan Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'yog-prambanan-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый красивый индуистский храм страны  
- 🌍 Архитектурный шедевр IX века  
- 📸 Высокие башни и детализированные рельефы

## Билеты и посещение

- 💰 ~350 000 IDR  
- 🎟️ Отдельный билет на балет  
- 🆓 —

## Лучшие точки для фото

- 📷 Башни  
- 📷 Рельефы  
- 🌅 Закат

## Практическая информация

- **Адрес:** Prambanan, Sleman  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🏛 Главные башни Шивы, Вишну и Брахмы  
- 🎭 Шоу Ramayana Ballet (вечером)  
- 📷 Детали скульптур

## Как добраться

- 🚕 Такси из Джокьякарты (~30 мин)  
- 🚌 Экскурсии  
- 🗺️ Граница провинций Yogyakarta и Central Java

## 🔷 Коммуникация и сервис

- 🕒 06:00–17:00  
- 🌐 Английский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Прамбанан символизирует культурное наследие и религиозное многообразие острова Ява.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏰 Kraton Yogyakarta
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'yog-kraton-yogyakarta',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Сердце культурной идентичности Джокьякарты  
- 🌍 Живая монархия в современной Индонезии  
- 📸 Дворцовая архитектура и музей

## Билеты и посещение

- 💰 ~15 000 IDR  
- 🎟️ Аудиогид — отдельно  
- 🆓 —

## Лучшие точки для фото

- 📷 Ворота дворца  
- 📷 Интерьеры  
- 🌅 Дворцовый парк

## Практическая информация

- **Адрес:** Jl. Rotowijayan, Yogyakarta  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🏰 Дворцовые залы  
- 🖼 Музей регалий  
- 🎶 Традиционные выступления (по расписанию)

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Центр Джокьякарты

## 🔷 Коммуникация и сервис

- 🕒 08:00–14:00  
- 🌐 Английский, индонезийский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Закрыто по понедельникам  
- 🌞 Лучше днём  
- 👕 Скромная одежда  
- 🐾 —

## Локальная ценность

Кратон — не просто музей, а действующая резиденция, поддерживающая традиции и стабильность региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💧 Taman Sari Water Castle
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'yog-taman-sari-water-castle',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальная гидроинженерия прошлого  
- 🌍 История султанского двора  
- 📸 Подземные тоннели и бассейны

## Билеты и посещение

- 💰 ~5 000 IDR  
- 🎟️ Гид — по желанию  
- 🆓 —

## Лучшие точки для фото

- 📷 Бассейны  
- 📷 Арки  
- 🌅 Свет в тоннелях

## Практическая информация

- **Адрес:** Jl. Taman, Yogyakarta  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 💦 Купальни для гарема  
- 🕳 Подземные ходы  
- 📷 Фото арочных галерей

## Как добраться

- 🚶 Пешком от Кратона  
- 🚕 Такси  
- 🗺️ Центр города

## 🔷 Коммуникация и сервис

- 🕒 09:00–15:00  
- 🌐 Индонезийский, базовый английский  
- 📶 Интернет ограничен  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Часть территории закрыта  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Объект напоминает о богатстве и изощрённости султанского двора.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍 Malioboro Street
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'yog-malioboro-street',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Сердце туристической жизни города  
- 🌍 Аутентичный рынок и ремёсла  
- 📸 Ночная атмосфера и фонари

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Покупки — по желанию  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Ряды лавок  
- 📷 Уличные фонари  
- 🌅 Ночную жизнь

## Практическая информация

- **Адрес:** Jl. Malioboro, Yogyakarta  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🛍 Сувениры и батик  
- 🍢 Уличную еду  
- 🚶 Прогулку вечером

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Центр Джокьякарты

## 🔷 Коммуникация и сервис

- 🕒 Круглосуточно  
- 🌐 Английский, индонезийский  
- 📶 Интернет стабильный  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Торгуйтесь активно  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Улица поддерживает тысячи мелких торговцев и ремесленников.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌋 Mount Merapi
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'yog-mount-merapi',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых активных вулканов мира  
- 🌍 Драматические пейзажи после извержений  
- 📸 Джип-туры по лавовым полям

## Билеты и посещение

- 💰 Тур: ~500 000–800 000 IDR  
- 🎟️ Только с лицензированными гидами  
- 🆓 —

## Лучшие точки для фото

- 📷 Лавовые поля  
- 📷 Кратер  
- 🌅 Рассвет над дымом

## Практическая информация

- **Адрес:** Mount Merapi, Sleman  
- **Сайт:** —  
- **Телефон:** —

## 🔵 Что обязательно посмотреть / попробовать

- 🚙 Джип-тур к лавовым полям  
- 🥾 Восхождение (для опытных)  
- 📷 Музей Merapi

## Как добраться

- 🚕 Трансфер из Джокьякарты  
- 🚌 Тур  
- 🗺️ Север Джокьякарты

## 🔷 Коммуникация и сервис

- 🕒 По расписанию туров  
- 🌐 Английский  
- 📶 Связь ограничена  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Опасно без гида  
- 🌞 Лучший сезон — сухой  
- 👕 Тёплая одежда ночью  
- 🐾 —

## Локальная ценность

Вулкан — часть мифологии и повседневной жизни региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍛 Gudeg Yu Djum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'yog-gudeg-yu-djum',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком от центра  
- 🚕 Такси  
- 🗺️ Jalan Kaliurang

## Полезные нюансы

- ⚠️ Можно взять с собой  
- 🌞 Подходит для обеда  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Yu Djum — символ кулинарной идентичности Джокьякарты.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Упаковку  
- 🌅 Атмосферу зала

## Практическая информация

- **Адрес:** Jl. Kaliurang, Yogyakarta  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Самый известный gudeg в городе  
- 🌍 Аутентичный вкус и семейные рецепты  
- 📸 Упаковка для вывоза

## 🔵 Что обязательно посмотреть / попробовать

- 🍛 Gudeg с курицей и яйцом  
- 🍚 Рис и соусы  
- 🥤 Напитки

## Билеты и посещение

- 💰 Бюджетно  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 08:00–21:00  
- 🌐 Индонезийский  
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

-- Content block for: 🍚 Nasi Kucing Angkringan Lik Man
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'yog-nasi-kucing-angkringan-lik-man',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком от Malioboro  
- 🚕 Такси  
- 🗺️ Центр города

## Полезные нюансы

- ⚠️ Только ночью  
- 🌞 Не для слабонервных (kopi joss)  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Angkringan — часть повседневной жизни студентов и рабочих Джокьякарты.

## Лучшие точки для фото

- 📷 Столики на улице  
- 📷 Приготовление кофе  
- 🌅 Ночную улицу

## Практическая информация

- **Адрес:** Jl. Malioboro, Yogyakarta  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Культовое место ночной еды  
- 🌍 Аутентичная культура angkringan  
- 📸 Ночные огни и атмосфера

## 🔵 Что обязательно посмотреть / попробовать

- 🍚 Nasi kucing  
- 🍢 Saté и tempe  
- ☕ Kopi joss (кофе с углём)

## Билеты и посещение

- 💰 Очень бюджетно  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 18:00–06:00  
- 🌐 Индонезийский  
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

-- Content block for: ☕ Via Via Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'yog-via-via-cafe',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком  
- 🚕 Такси  
- 🗺️ Malioboro

## Полезные нюансы

- ⚠️ Многолюдно  
- 🌞 Подходит в любое время  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе объединяет туристов и местных в одном пространстве.

## Лучшие точки для фото

- 📷 Вид из окна  
- 📷 Интерьер  
- 🌅 Вечернюю улицу

## Практическая информация

- **Адрес:** Jl. Prawirotaman, Yogyakarta  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Удобное место для отдыха в центре  
- 🌍 Интернациональное меню  
- 📸 Вид на улицу

## 🔵 Что обязательно посмотреть / попробовать

- ☕ Кофе  
- 🍽 Лёгкие блюда  
- 🍰 Десерты

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 08:00–23:00  
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

-- Content block for: 🍽 Milas Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'yog-milas-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Prawirotaman

## Полезные нюансы

- ⚠️ Закрывается рано  
- 🌞 Подходит для обеда  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Milas продвигает устойчивую гастрономию и поддерживает фермеров.

## Лучшие точки для фото

- 📷 Сад  
- 📷 Подачу блюд  
- 🌅 Атмосферу вечера

## Практическая информация

- **Адрес:** Jl. Prawirotaman, Yogyakarta  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Здоровая интерпретация местной кухни  
- 🌍 Эко-подход и локальные продукты  
- 📸 Садовая атмосфера

## 🔵 Что обязательно посмотреть / попробовать

- 🍽 Органические сеты  
- 🥗 Салаты и закуски  
- 🍵 Напитки из трав

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 10:00–21:00  
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

-- Content block for: ☕ Sosro Coffee
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'yog-sosro-coffee',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком от центра  
- 🚕 Такси  
- 🗺️ Jalan Sosrowijayan

## Полезные нюансы

- ⚠️ Простые условия  
- 🌞 Подходит для завтрака  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Sosro — живая история кофейной культуры Джокьякарты.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Чашки  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Jl. Sosrowijayan, Yogyakarta  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Самая старая кофейня Джокьякарты  
- 🌍 Аутентичный вкус и атмосфера  
- 📸 Ретро-интерьер

## 🔵 Что обязательно посмотреть / попробовать

- ☕ Javanese coffee  
- 🍪 Печенье  
- 🍰 Традиционные сладости

## Билеты и посещение

- 💰 Бюджетно  
- 🎟️ —  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 07:00–21:00  
- 🌐 Индонезийский  
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

-- Content block for: 🍽 Abhayagiri Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'yog-abhayagiri-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Prawirotaman

## Полезные нюансы

- ⚠️ Только вечером  
- 🌞 Подходит для особых случаев  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан поднимает статус яванской кухни на мировой уровень.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Подачу блюд  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Jl. Prawirotaman, Yogyakarta  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Fine dining в историческом здании  
- 🌍 Современная интерпретация традиций  
- 📸 Роскошный интерьер

## 🔵 Что обязательно посмотреть / попробовать

- 🍽 Дегустационные сеты  
- 🍷 Вино  
- 🍰 Авторские десерты

## Билеты и посещение

- 💰 💎 Premium  
- 🎟️ Бронирование обязательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 18:00–22:00  
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
