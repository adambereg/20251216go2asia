-- Content Blocks UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Content block for: 🏞️ Chocolate Hills
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'tag-chocolate-hills',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых узнаваемых пейзажей Филиппин  
- 🌍 Геологический объект национального значения  
- 📸 Панорамные виды «как на открытках»

## Структура комплекса

- 🏞️ Главную смотровую площадку в Кармене  
- 🏞️ Холмы в сухой сезон (февраль–май)  
- 🚶 Подъём по ступеням к панораме

## Билеты и посещение

- 💰 ~₱100  
- 🎟️ Билет на входе  
- 🆓 Прилегающие зоны без ограничений

## Лучшие точки для фото

- 📷 Панораму холмов  
- 📷 Вид с высоты  
- 🌅 Закатный свет

## Практическая информация

- **Адрес:** Carmen, Bohol

## Как добраться

- 🚕 Такси / аренда авто  
- 🚌 Экскурсионный автобус  
- 🗺️ Район Carmen, центральный Бохоль

## Коммуникация & сервис

- 🕒 8:00–17:00  
- 🌐 Английский  
- 🚻 Туалеты, лавки  
- 📶 Связь стабильная

## Полезные нюансы

- 🌞 Лучшее время — утро или закат  
- 👕 Головной убор обязателен  
- ⚠️ Жарко днём

## Локальная ценность

Шоколадные холмы — главный туристический бренд Бохоля и источник дохода для сельских районов острова.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐒 Philippine Tarsier Sanctuary
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'tag-philippine-tarsier-sanctuary',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальные эндемики Филиппин  
- 🌍 Проект по сохранению биоразнообразия  
- 📸 Редкий шанс увидеть долгопятов в природе

## Структура комплекса

- 🏞️ Лесную тропу  
- 🏞️ Долгопятов в естественной среде  
- 🚶 Информационный центр

## Билеты и посещение

- 💰 ~₱100  
- 🎟️ Билет на входе  
- 🆓 Дети часто бесплатно

## Лучшие точки для фото

- 📷 Лесную тропу  
- 📷 Долгопята (без вспышки)  
- 🌅 Мягкий свет под кронами

## Практическая информация

- **Адрес:** Corella, Bohol

## Как добраться

- 🚕 Такси / экскурсия  
- 🗺️ Corella, Bohol

## Коммуникация & сервис

- 🕒 9:00–16:00  
- 🌐 Английский  
- 🚻 Туалеты  
- 📶 Связь слабая

## Полезные нюансы

- ⚠️ Запрещены вспышка и шум  
- 👕 Удобная обувь  
- 🐾 Трогать животных нельзя

## Локальная ценность

Заповедник — пример экологически ответственного туризма и гордость острова.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🚤 Loboc River Cruise
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'tag-loboc-river-cruise',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый расслабляющий опыт Бохоля  
- 🌍 Знакомство с сельской культурой  
- 📸 Изумрудная река и пальмы

## Структура комплекса

- 🏞️ Речные пейзажи  
- 🏞️ Фольклорное выступление  
- 🚶 Остановку у деревенской сцены

## Билеты и посещение

- 💰 ~₱550  
- 🎟️ Билет включает обед  
- 🆓 Дети — со скидкой

## Лучшие точки для фото

- 📷 Реку с борта  
- 📷 Музыкантов  
- 🌅 Отражения пальм

## Практическая информация

- **Адрес:** Loboc River, Bohol

## Как добраться

- 🚕 Такси  
- 🗺️ Город Loboc

## Коммуникация & сервис

- 🕒 10:00–15:00  
- 🌐 Английский  
- 🚻 На борту  
- 📶 Связь ограниченная

## Полезные нюансы

- 🌞 Лучше дневные рейсы  
- 👕 Лёгкая одежда  
- ⚠️ Наличные для чаевых

## Локальная ценность

Круиз поддерживает местные общины и сохраняет традиционную музыку и танцы.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Panglao Island – Alona Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'tag-panglao-island-alona-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший пляжный отдых на Бохоле  
- 🌍 Центр дайвинга и сноркелинга  
- 📸 Бирюзовая вода и закаты

## Структура комплекса

- 🏞️ Пляж Алона  
- 🏞️ Лодочные туры к Balicasag  
- 🚶 Вечернюю набережную

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Туры оплачиваются отдельно  
- 🆓 Общественный пляж

## Лучшие точки для фото

- 📷 Пляж  
- 📷 Лодки  
- 🌅 Закат

## Практическая информация

- **Адрес:** Alona Beach, Panglao Island

## Как добраться

- 🚕 Такси / трансфер  
- 🗺️ Остров Panglao

## Коммуникация & сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 🚻 Кафе и сервисы  
- 📶 Отличная связь

## Полезные нюансы

- ⚠️ Цены выше среднего  
- 🌞 Лучшее купание утром  
- 👕 Beach casual

## Локальная ценность

Панглао — туристическое сердце Бохоля и ключевая точка международного турпотока.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍯 Bohol Bee Farm
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'tag-bohol-bee-farm',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Garden Salad  
- 🍽️ Домашний хлеб  
- 🍹 Мёд и мороженое из моринги

## Цены

- 💰 ₱400–₱700  
- 🧾 À la carte  
- 🆓 Дегустации в магазине

## Как добраться

- 🚕 Такси  
- 🗺️ Panglao Island

## Коммуникация & сервис

- 🕒 7:30–21:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Cash / card

## Полезные нюансы

- ⚠️ Популярно — бронируйте  
- 🌞 Лучшее время — днём  
- 👕 Casual

## Локальная ценность

Bohol Bee Farm поддерживает местных фермеров и формирует экологичную гастрокультуру острова.

## Лучшие точки для фото

- 📷 Сады  
- 📷 Подачу блюд  
- 🌅 Террасу у моря

## Практическая информация

- **Адрес:** Dauis, Panglao Island

## Почему это важно?

- 🌟 Икона эко-гастрономии  
- 🌍 Локальные продукты и мёд  
- 📸 Вид на море и сады
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Gerarda’s Family Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'tag-gerarda-s-family-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Pochero  
- 🍽️ Adobong Kangkong  
- 🍹 Кокосовые десерты

## Цены

- 💰 ₱300–₱600  
- 🧾 À la carte  
- 🆓 Большие порции

## Как добраться

- 🚕 Такси  
- 🗺️ Tagbilaran City

## Коммуникация & сервис

- 🕒 10:00–21:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Cash

## Полезные нюансы

- ⚠️ Популярен вечером  
- 🌞 Лучше к ужину  
- 👕 Casual

## Локальная ценность

Gerarda’s — хранитель семейных гастрономических традиций Бохоля.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Блюда  
- 🌅 Вечерний зал

## Практическая информация

- **Адрес:** Tagbilaran City, Bohol

## Почему это важно?

- 🌟 Аутентичная локальная кухня  
- 🌍 Семейные рецепты  
- 📸 Домашняя атмосфера
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ White Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'boracay-white-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых известных пляжей планеты  
- 🌍 Туристическое и социальное сердце острова  
- 📸 Идеальные закаты и открытки «тропический рай»

## Структура комплекса

- 🏖️ Station 1 — самый просторный и спокойный участок  
- 🏖️ Station 2 — центр жизни, магазины и рестораны  
- 🚶 Вечерняя прогулка вдоль всего пляжа

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Нет билетов  
- 🆓 Доступ открыт круглосуточно

## Лучшие точки для фото

- 📷 Белый песок крупным планом  
- 📷 Парусные лодки paraw  
- 🌅 Закаты над морем

## Практическая информация

- **Адрес:** White Beach, Boracay Island

## Как добраться

- 🚶 Пешком из любого района острова  
- 🚕 Трицикл из любой точки Боракая  
- 🗺️ Западное побережье острова

## Коммуникация & сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 🚻 Души, туалеты, кафе  
- 📶 Отличная мобильная связь

## Полезные нюансы

- ⚠️ Многолюдно в высокий сезон  
- 🌞 Лучшее купание — утром  
- 👕 Купальник + защита от солнца  
- 🐾 Вечером возможны фаер-шоу

## Локальная ценность

White Beach — экономическая основа Боракая: именно он обеспечивает рабочие места, туристический поток и международную известность острова.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Puka Shell Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'boracay-puka-shell-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Более дикий и спокойный Боракай  
- 🌍 Контраст с туристическим White Beach  
- 📸 Натуральные пейзажи и ракушки

## Структура комплекса

- 🏖️ Берег с ракушками пука  
- 🏞️ Тропическую рощу  
- 🚶 Прогулку вдоль пляжа

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Нет билетов  
- 🆓 Доступ свободный

## Лучшие точки для фото

- 📷 Берег с ракушками  
- 📷 Волны и горизонт  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Yapak, Boracay Island

## Как добраться

- 🚕 Трицикл (~15 мин от Station 2)  
- 🗺️ Север острова

## Коммуникация & сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 🚻 Минимальная инфраструктура  
- 📶 Связь стабильная

## Полезные нюансы

- 🌞 Мало тени  
- 👕 Возьмите воду и головной убор  
- ⚠️ Волны сильнее, чем на White Beach

## Локальная ценность

Puka Beach — напоминание о «старом Боракае» до массового туризма и символ природного баланса острова.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛰️ Mount Luho Viewpoint
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'boracay-mount-luho-viewpoint',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший обзор острова  
- 🌍 Географическая доминанта Боракая  
- 📸 Панорамные фотографии

## Структура комплекса

- 🏞️ Панораму White Beach  
- 🏞️ Вид на Bulabog Beach  
- 🚶 Прогулку по вершине

## Билеты и посещение

- 💰 ₱120–₱150  
- 🎟️ Билет на входе  
- 🆓 Детям часто бесплатно

## Лучшие точки для фото

- 📷 Панораму острова  
- 📷 Лагуны и пляжи  
- 🌅 Закатный свет

## Практическая информация

- **Адрес:** Mount Luho, Boracay

## Как добраться

- 🚕 Трицикл или байк  
- 🚶 Последний участок пешком  
- 🗺️ Центр острова

## Коммуникация & сервис

- 🕒 6:00–18:00  
- 🌐 Английский  
- 🚻 Минимальные удобства  
- 📶 Связь хорошая

## Полезные нюансы

- 🌞 Лучше утром или на закате  
- 👕 Лёгкая одежда  
- ⚠️ Жарко днём

## Локальная ценность

Mount Luho — ориентир и символ острова, позволяющий понять его компактность и географию.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🤿 Ariel’s Point
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'boracay-ariel-s-point',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Легендарный клифф-дайвинг  
- 🌍 Одно из самых адреналиновых мест Боракая  
- 📸 Прыжки над лазурной водой

## Структура комплекса

- 🏞️ Прыжковые платформы (3–15 м)  
- 🏞️ Скалы и лагуны  
- 🚶 Купание и сноркелинг

## Билеты и посещение

- 💰 ~₱2500  
- 🎟️ Только в составе тура  
- 🆓 Включены еда и напитки

## Лучшие точки для фото

- 📷 Прыжки со скал  
- 📷 Вид сверху  
- 🌅 Море и лодки

## Практическая информация

- **Адрес:** Off-shore Boracay

## Как добраться

- 🚤 Тур на лодке (~1 час)  
- 🗺️ Отправление с White Beach

## Коммуникация & сервис

- 🕒 Дневные туры  
- 🌐 Английский  
- 🚻 На лодке  
- 📶 Связь отсутствует

## Полезные нюансы

- ⚠️ Не для людей с боязнью высоты  
- 👕 Купальная обувь  
- 🌞 Лучше в хорошую погоду

## Локальная ценность

Ariel’s Point — визитная карточка приключенческого туризма Боракая и важный элемент его диверсификации.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥤 Jonah’s Fruit Shake
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'boracay-jonah-s-fruit-shake',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Mango Shake  
- 🍽️ Banana Peanut Shake  
- 🍹 Exotic Mix

## Цены

- 💰 ~₱150–₱200  
- 🧾 Напитки / лёгкие завтраки  
- 🆓 Большие порции

## Как добраться

- 🚶 Пешком по White Beach  
- 🗺️ Station 1

## Коммуникация & сервис

- 🕒 8:00–23:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Cash / card

## Полезные нюансы

- ⚠️ Очереди днём  
- 🌞 Лучшее время — утро  
- 👕 Beach casual

## Локальная ценность

Jonah’s — один из старейших брендов Боракая и обязательная гастрономическая точка для гостей острова.

## Лучшие точки для фото

- 📷 Шейк крупным планом  
- 📷 Пляж на фоне  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Station 1, White Beach  
- **Instagram / Facebook:** [Jonah’s Fruit Shake](https://www.instagram.com/jonahsfruitshake/)

## Почему это важно?

- 🌟 Самые известные шейки острова  
- 🌍 Гастрономический символ пляжа  
- 📸 Яркая подача
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Real Coffee & Tea Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'boracay-real-coffee-tea-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Calamansi Muffin  
- 🍽️ Манговый тост  
- 🍹 Имбирный чай

## Цены

- 💰 ₱200–₱350  
- 🧾 Завтраки и выпечка  
- 🆓 Нет

## Как добраться

- 🚶 Пешком  
- 🗺️ Station 2

## Коммуникация & сервис

- 🕒 7:00–19:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Cash

## Полезные нюансы

- ⚠️ Маффины быстро заканчиваются  
- 🌞 Лучше приходить утром  
- 👕 Casual

## Локальная ценность

Real Coffee — культовое место завтраков, связанное с историей туризма Боракая с 1990-х годов.

## Лучшие точки для фото

- 📷 Маффины  
- 📷 Интерьер  
- 🌅 Утренний пляж

## Практическая информация

- **Адрес:** Station 2, Boracay

## Почему это важно?

- 🌟 Легендарная выпечка  
- 🌍 Утренний ритуал Боракая  
- 📸 Терраса с видом на пляж
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Basilica Minore del Santo Niño & Magellan’s Cross
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ceb-basilica-minore-del-santo-nino-magellan-s-cross',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Старейшая церковь Филиппин (1565)  
- 🌍 Место начала христианской истории страны  
- 📸 Колониальная архитектура и религиозная атмосфера

## Структура комплекса

- 🏛️ Базилика Santo Niño с реликвариями  
- 🏛️ Крест Магеллана (1521) в восьмиугольной часовне  
- 🚶 Площадь и внутренний двор монастыря

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 Доступ свободный ежедневно

## Лучшие точки для фото

- 📷 Интерьер базилики  
- 📷 Купол часовни Креста  
- 🌅 Утренний свет во дворе

## Практическая информация

- **Адрес:** Santo Niño Basilica Complex, Cebu City

## Как добраться

- 🚕 Такси / Grab из любого района Cebu City  
- 🚌 Джипни до Basilica Complex  
- 🗺️ Ориентир: Colon Street

## Коммуникация & сервис

- 🕒 6:00–19:00  
- 🌐 Английский, себуано  
- 🚻 Туалеты на территории  
- 📶 Связь стабильная

## Полезные нюансы

- ⚠️ Многолюдно по воскресеньям  
- 🌞 Лучше посещать утром  
- 👕 Одежда должна закрывать плечи и колени  
- 🐾 Фотосъёмка без вспышки

## Локальная ценность

Это главное паломническое место страны. Для филиппинцев Santo Niño — не туристический объект, а живая вера и часть национальной идентичности.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏰 Fort San Pedro *
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ceb-fort-san-pedro',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Старейший форт страны  
- 🌍 Испанское военное наследие  
- 📸 Каменные бастионы и вид на порт

## Структура комплекса

- 🏛️ Внутренний двор-музей  
- 🏞️ Бастионы с пушками  
- 🚶 Прогулку по стенам

## Билеты и посещение

- 💰 ₱30  
- 🎟️ Билет на входе  
- 🆓 Детям часто бесплатно

## Лучшие точки для фото

- 📷 Бастионы  
- 📷 Старые пушки  
- 🌅 Вид на море

## Практическая информация

- **Адрес:** Fort San Pedro, Cebu City

## Как добраться

- 🚕 Такси / Grab  
- 🚶 Пешком от порта  
- 🗺️ Ориентир: Plaza Independencia

## Коммуникация & сервис

- 🕒 8:00–19:00  
- 🌐 Английский  
- 🚻 Туалеты  
- 📶 Связь нормальная

## Полезные нюансы

- 🌞 Очень жарко днём  
- 👕 Головной убор обязателен  
- ⚠️ Мало тени

## Локальная ценность

Форт — символ раннего Себу как стратегического центра испанской колонии и морской торговли.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏯 Cebu Taoist Temple *
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ceb-cebu-taoist-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых красивых храмов города  
- 🌍 Символ китайской диаспоры  
- 📸 Пагоды, драконы, панорамы

## Структура комплекса

- 🏛️ Главный молитвенный зал  
- 🏞️ Смотровые площадки  
- 🚶 81 ступень даосского пути

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Нет билетов  
- 🆓 Открыт для всех

## Лучшие точки для фото

- 📷 Ворота и пагоды  
- 📷 Вид на город  
- 🌅 Закатные панорамы

## Практическая информация

- **Адрес:** Beverly Hills Subdivision, Cebu City

## Как добраться

- 🚕 Такси / Grab (рекомендуется)  
- 🗺️ Район Beverly Hills

## Коммуникация & сервис

- 🕒 6:00–17:00  
- 🌐 Английский  
- 🚻 Минимальные удобства  
- 📶 Связь ограниченная

## Полезные нюансы

- ⚠️ Нельзя шуметь  
- 📷 Запрещена съёмка алтарей  
- 🌞 Лучшее время — утро

## Локальная ценность

Храм — важный духовный центр китайской общины и пример мирного сосуществования культур Себу.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Kawasan Falls *
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ceb-kawasan-falls',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых красивых водопадов страны  
- 🌍 Символ природного Себу  
- 📸 Ярко-бирюзовая вода

## Структура комплекса

- 🏞️ Первый каскад  
- 🏞️ Верхние уровни  
- 🚶 Тропу через джунгли

## Билеты и посещение

- 💰 ₱50  
- 🎟️ Оплата на входе  
- 🆓 Купание включено

## Лучшие точки для фото

- 📷 Первый каскад  
- 📷 Купающихся  
- 🌅 Свет в воде

## Практическая информация

- **Адрес:** Badian, Cebu

## Как добраться

- 🚕 Экскурсия / авто  
- 🚌 Автобус до Badian + пешком  
- 🗺️ Южный Себу

## Коммуникация & сервис

- 🕒 7:00–17:00  
- 🌐 Английский  
- 🚻 Раздевалки  
- 📶 Связь слабая

## Полезные нюансы

- ⚠️ Скользко  
- 👕 Акваобувь обязательна  
- 🌞 Лучше утром

## Локальная ценность

Кавасан — ключевой драйвер экотуризма южного Себу и источник дохода для местных общин.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍖 House of Lechon
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ceb-house-of-lechon',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Lechon Cebu  
- 🍽️ Dinuguan  
- 🍹 Каламанси-сок

## Цены

- 💰 ₱350–₱600  
- 🧾 À la carte  
- 🆓 Соусы бесплатно

## Как добраться

- 🚕 Grab / такси  
- 🗺️ Cebu City

## Коммуникация & сервис

- 🕒 10:00–22:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Cash / card

## Полезные нюансы

- ⚠️ Лучше приходить днём  
- 👕 Casual  
- 🍽️ Порции большие

## Локальная ценность

Лечон — гастрономическая гордость Себу, обязательный элемент праздников и семейных торжеств.

## Лучшие точки для фото

- 📷 Поросёнка  
- 📷 Разделку  
- 🌅 Интерьер

## Практическая информация

- **Адрес:** Cebu City  
- **Instagram:** [@houseoflechon](https://www.instagram.com/houseoflechon)

## Почему это важно?

- 🌟 Самый известный лечон в городе  
- 🌍 Гастрономический символ Себу  
- 📸 Эффектная подача
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍢 Larsian BBQ
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ceb-larsian-bbq',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Pork BBQ  
- 🍽️ Isaw  
- 🍚 Puso (рис)

## Цены

- 💰 ₱150–₱250  
- 🧾 Street food  
- 🆓 Соусы

## Как добраться

- 🚕 Такси  
- 🗺️ Fuente Osmeña

## Коммуникация & сервис

- 🕒 17:00–02:00  
- 🌐 Английский  
- 📶 Нет Wi-Fi  
- 💳 Только наличные

## Полезные нюансы

- ⚠️ Шумно  
- 👕 Запах дыма  
- 🌙 Лучше вечером

## Локальная ценность

Larsian — место общения, еды и городской культуры, где встречаются все слои общества Себу.

## Лучшие точки для фото

- 📷 Грили  
- 📷 Шашлыки  
- 🌅 Ночную толпу

## Практическая информация

- **Адрес:** Fuente Osmeña, Cebu City

## Почему это важно?

- 🌟 Культовое ночное место  
- 🌍 Настоящая уличная кухня  
- 📸 Атмосфера ночного Себу
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Rizal Boulevard
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dumaguete-rizal-boulevard',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самое атмосферное место города  
- 🌍 Социальное и культурное сердце Думагете  
- 📸 Море, закаты и уличная жизнь

## Структура комплекса

- 🏞️ Прогулку вдоль берега  
- 🏞️ Вечерние фуд-корты *painitan*  
- 🚶 Закат над проливом

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Без билетов  
- 🆓 Доступ круглосуточный

## Лучшие точки для фото

- 📷 Аллею с морем  
- 📷 Уличную еду  
- 🌅 Закат

## Практическая информация

- **Адрес:** Rizal Boulevard, Dumaguete

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Центр города Dumaguete

## Коммуникация & сервис

- 🕒 24/7  
- 🌐 Английский  
- 🚻 Общественные туалеты поблизости  
- 📶 Отличная мобильная связь

## Полезные нюансы

- 🌞 Утром — спорт и прогулки  
- 🌙 Вечером — еда и общение  
- 👕 Casual

## Локальная ценность

Rizal Boulevard — «гостиная» города, место встреч студентов, семей и путешественников.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎓 Silliman University
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dumaguete-silliman-university',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Исторический университет (1901)  
- 🌍 Интеллектуальный центр региона  
- 📸 Колониальные здания и парки

## Структура комплекса

- 🏛️ Silliman Hall  
- 🏛️ Антропологический музей  
- 🚶 Прогулку по кампусу

## Билеты и посещение

- 💰 ~₱50 (музей)  
- 🎟️ Вход свободный  
- 🆓 Кампус открыт

## Лучшие точки для фото

- 📷 Silliman Hall  
- 📷 Газоны кампуса  
- 🌅 Свет сквозь деревья

## Практическая информация

- **Адрес:** Silliman Ave, Dumaguete

## Как добраться

- 🚶 Пешком от набережной  
- 🚕 Такси  
- 🗺️ Центральный Dumaguete

## Коммуникация & сервис

- 🕒 Днём  
- 🌐 Английский  
- 🚻 Туалеты  
- 📶 Wi-Fi в отдельных зонах

## Полезные нюансы

- ⚠️ Фото в музее запрещены  
- 🌞 Лучше в будни  
- 👕 Casual

## Локальная ценность

Университет формирует культурную и академическую идентичность Думагете.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐢 Apo Island
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dumaguete-apo-island',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшее место для сноркелинга с черепахами  
- 🌍 Старейший морской заповедник региона  
- 📸 Подводная жизнь и прозрачная вода

## Структура комплекса

- 🏞️ Turtle Beach  
- 🏞️ Коралловые рифы  
- 🚶 Деревню острова

## Билеты и посещение

- 💰 ~₱300–₱500 (тур)  
- 🎟️ Экосбор включён  
- 🆓 Купание разрешено

## Лучшие точки для фото

- 📷 Черепах под водой  
- 📷 Рифы  
- 🌅 Берег острова

## Практическая информация

- **Адрес:** Apo Island, Negros Oriental

## Как добраться

- 🚕 До Malatapay Port  
- 🚤 Лодка (~30 мин)  
- 🗺️ Юг от Dumaguete

## Коммуникация & сервис

- 🕒 Дневные туры  
- 🌐 Английский  
- 🚻 Минимальные удобства  
- 📶 Связь отсутствует

## Полезные нюансы

- ⚠️ Черепах нельзя трогать  
- 👕 Акваобувь  
- 🐾 Строгие экоправила

## Локальная ценность

Apo Island — пример успешного экотуризма, управляемого местным сообществом.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Casaroro Falls
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dumaguete-casaroro-falls',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых красивых водопадов региона  
- 🌍 Нетронутая природа  
- 📸 Драматический ландшафт

## Структура комплекса

- 🏞️ Основной каскад  
- 🏞️ Горную тропу  
- 🚶 Каменные переправы

## Билеты и посещение

- 💰 ~₱100  
- 🎟️ Билет на входе  
- 🆓 Купание разрешено

## Лучшие точки для фото

- 📷 Водопад  
- 📷 Ущелье  
- 🌅 Свет сквозь листву

## Практическая информация

- **Адрес:** Valencia, Negros Oriental

## Как добраться

- 🚕 Такси / мотобайк  
- 🗺️ Valencia, Negros Oriental

## Коммуникация & сервис

- 🕒 Днём  
- 🌐 Английский  
- 🚻 Минимальные удобства  
- 📶 Связь слабая

## Полезные нюансы

- ⚠️ Скользко после дождя  
- 👕 Трекинговая обувь  
- 🌞 Лучше утром

## Локальная ценность

Касароро — символ горной природы Негроса и любимое место местных.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍰 Sans Rival Cakes & Pastries
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dumaguete-sans-rival-cakes-pastries',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Silvanas  
- 🍽️ Sans Rival cake  
- 🍹 Кофе или горячий шоколад

## Цены

- 💰 ₱200–₱400  
- 🧾 Десерты и кафе  
- 🆓 Упаковка для сувениров

## Как добраться

- 🚶 Пешком от Rizal Blvd  
- 🚕 Такси  
- 🗺️ Центр Dumaguete

## Коммуникация & сервис

- 🕒 7:00–22:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Cash / card

## Полезные нюансы

- ⚠️ Популярно — очереди  
- 🌞 Лучше днём  
- 👕 Casual

## Локальная ценность

Sans Rival — гастрономическая визитка Думагете, известная по всей стране.

## Лучшие точки для фото

- 📷 Silvanas  
- 📷 Витрину  
- 🌅 Кафе вечером

## Практическая информация

- **Адрес:** Rizal Blvd, Dumaguete

## Почему это важно?

- 🌟 Кулинарный символ города  
- 🌍 Семейные рецепты  
- 📸 Витрина десертов
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦐 Lab-as Seafood Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dumaguete-lab-as-seafood-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Kinilaw  
- 🍽️ Grilled fish  
- 🍹 Местное пиво

## Цены

- 💰 ₱400–₱700  
- 🧾 À la carte  
- 🆓 Большие порции

## Как добраться

- 🚕 Такси  
- 🗺️ Север Dumaguete

## Коммуникация & сервис

- 🕒 16:00–22:00  
- 🌐 Английский  
- 📶 Нет Wi-Fi  
- 💳 Cash

## Полезные нюансы

- ⚠️ Лучше приходить вечером  
- 🌞 Закатный вид  
- 👕 Casual

## Локальная ценность

Lab-as — место встреч местных и путешественников, отражающее гастрономическую культуру города.

## Лучшие точки для фото

- 📷 Морепродукты  
- 📷 Террасу  
- 🌅 Закат над морем

## Практическая информация

- **Адрес:** Dumaguete North Rd

## Почему это важно?

- 🌟 Свежайшие морепродукты  
- 🌍 Ужин у моря  
- 📸 Живая атмосфера
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Intramuros
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mnl-intramuros',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Колыбель Манилы и центр испанской колониальной власти  
- 🌍 Ключевой исторический и культурный район страны  
- 📸 Каменные стены, булыжные улицы, старинная архитектура

## Структура комплекса

- 🏛️ Форт Сантьяго — бывшая военная крепость и тюрьма Хосе Рисаля  
- 🏛️ Церковь Сан-Агустин (1607) — объект ЮНЕСКО  
- 🚶 Прогулка по бастионам и площади Plaza de Roma

## Билеты и посещение

- 💰 Большинство зон — бесплатно  
- 🎟️ Отдельные музеи и форт: ₱75–₱150  
- 🆓 Уличные пространства доступны всегда

## Лучшие точки для фото

- 📷 Каменные ворота и стены  
- 📷 Интерьеры Сан-Агустина  
- 🌅 Подсветку бастионов вечером

## Практическая информация

- **Адрес:** Intramuros, Manila  
- **Сайт:** [https://intramuros.gov.ph](https://intramuros.gov.ph)

## Как добраться

- 🚕 Такси / Grab из любого района Манилы  
- 🚌 Джипни и автобусы до района Intramuros  
- 🗺️ Ориентир: Manila Cathedral / Fort Santiago

## Коммуникация & сервис

- 🕒 Доступ круглосуточный (музеи по расписанию)  
- 🌐 Английский и филиппинский  
- 🚻 Туалеты и кафе внутри комплекса  
- 📶 Мобильная связь стабильная

## Полезные нюансы

- ⚠️ Жарко днём — минимум тени  
- 🌞 Лучшее время: утро или закат  
- 👕 Лёгкая одежда, удобная обувь  
- 🐾 Соблюдайте правила в храмах

## Локальная ценность

Интрамурос — символ исторической памяти Манилы. Для местных это место национального самосознания, школьных экскурсий и культурных мероприятий.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 Rizal Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mnl-rizal-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Национальный мемориал Хосе Рисаля  
- 🌍 Политический и культурный символ страны  
- 📸 Просторные аллеи, монументы и фонтаны

## Структура комплекса

- 🏛️ Монумент Хосе Рисаля  
- 🏞️ Японский и Китайский сады  
- 🚶 Вечернее шоу фонтанов

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Музеи рядом — по отдельным билетам  
- 🆓 Парк открыт ежедневно

## Лучшие точки для фото

- 📷 Монумент Рисаля  
- 📷 Аллеи и фонтаны  
- 🌅 Закат над парком

## Практическая информация

- **Адрес:** Roxas Blvd, Manila

## Как добраться

- 🚶 Пешком из Intramuros  
- 🚕 Такси / Grab  
- 🚌 Остановка Rizal Park

## Коммуникация & сервис

- 🕒 5:00–21:00  
- 🌐 Английский  
- 🚻 Туалеты и охрана  
- 📶 Связь стабильная

## Полезные нюансы

- 🌞 Лучше утром или вечером  
- 👕 Защита от солнца обязательна  
- ⚠️ В выходные многолюдно

## Локальная ценность

Парк — место государственных церемоний, прогулок и встреч. Здесь формируется национальная идентичность Филиппин.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏮 Binondo
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mnl-binondo',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Старейший китайский квартал планеты  
- 🌍 Центр торговли и китайско-филиппинской культуры  
- 📸 Колоритные улицы и храмы

## Структура комплекса

- 🏛️ Binondo Church  
- 🏮 Улицы Ongpin и Carvajal  
- 🚶 Гастрономический маршрут по рынкам

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Плата только в музеях и храмах  
- 🆓 Доступ свободный

## Лучшие точки для фото

- 📷 Храмы и арки  
- 📷 Уличную еду  
- 🌅 Ночную подсветку улиц

## Практическая информация

- **Адрес:** Binondo, Manila

## Как добраться

- 🚶 Пешком из Intramuros  
- 🚕 Такси / Grab  
- 🚌 Остановка Binondo

## Коммуникация & сервис

- 🕒 Активен весь день  
- 🌐 Английский, китайский  
- 🚻 Кафе и магазины повсюду  
- 📶 Связь стабильная

## Полезные нюансы

- ⚠️ Очень людно днём  
- 🌞 Лучшее время — утро  
- 👕 Удобная обувь

## Локальная ценность

Binondo — экономическое сердце китайской диаспоры и основа предпринимательской культуры Манилы.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍗 The Aristocrat Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mnl-the-aristocrat-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Курица BBQ с фирменным соусом  
- 🍽️ Adobo  
- 🍹 Halo-halo

## Цены

- 💰 ₱300–₱500  
- 🧾 À la carte  
- 🆓 Большие порции

## Как добраться

- 🚕 Grab / такси  
- 🗺️ Roxas Boulevard

## Коммуникация & сервис

- 🕒 24/7  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Наличные, карты

## Полезные нюансы

- ⚠️ Очереди вечером  
- 🌞 Подходит в любое время  
- 👕 Casual

## Локальная ценность

The Aristocrat — часть гастрономической истории Манилы и семейная традиция для нескольких поколений.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 BBQ курицу  
- 🌅 Ночной зал

## Практическая информация

- **Адрес:** Roxas Blvd, Manila  
- **Сайт:** [https://aristocrat.com.ph](https://aristocrat.com.ph)

## Почему это важно?

- 🌟 Икона национальной кухни  
- 🌍 Историческое место для манильцев  
- 📸 Ретро-интерьер и атмосфера
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Barbara’s Heritage Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mnl-barbara-s-heritage-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Paella Filipino  
- 🍽️ Kinilaw  
- 🍹 Turon

## Цены

- 💰 ₱800–₱1200  
- 🧾 Buffet  
- 🆓 Шоу включено

## Как добраться

- 🚶 Пешком по Intramuros  
- 🚕 Такси

## Коммуникация & сервис

- 🕒 11:00–14:00 / 18:00–21:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Наличные, карты

## Полезные нюансы

- ⚠️ Бронировать вечером  
- 🌞 Лучшее время — ужин  
- 👕 Smart casual

## Локальная ценность

Barbara’s сохраняет традиции филиппинской кухни и танца, объединяя гастрономию и культуру.

## Лучшие точки для фото

- 📷 Танцы  
- 📷 Интерьер  
- 🌅 Вечерний зал

## Практическая информация

- **Адрес:** Intramuros, Manila  
- **Сайт:** [https://barbaras.com.ph](https://barbaras.com.ph)

## Почему это важно?

- 🌟 Ужин с культурной программой  
- 🌍 Погружение в колониальную эпоху  
- 📸 Исторический интерьер
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏞️ Puerto Princesa Subterranean River National Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pps-puerto-princesa-subterranean-river-national-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Одна из самых впечатляющих пещерных рек в мире  
- 🌍 Объект Всемирного наследия ЮНЕСКО  
- 📸 Гигантские сталактиты и подземные залы

## Структура комплекса

- 🏞️ Пещерные галереи с подсветкой  
- 🏞️ Колонии летучих мышей  
- 🚶 Лодочный маршрут внутри пещеры (~1,5 км)

## Билеты и посещение

- 💰 ~₱1500–₱2000 (тур)  
- 🎟️ Посещение только с лицензированным гидом  
- 🆓 Самостоятельный вход запрещён

## Лучшие точки для фото

- 📷 Пещерные своды  
- 📷 Лодку в полумраке  
- 🌅 Побережье у входа

## Практическая информация

- **Адрес:** Sabang, Puerto Princesa, Palawan

## Как добраться

- 🚕 Трансфер из Пуэрто-Принсесы (~2 часа)  
- 🚤 Короткий морской переход к входу  
- 🗺️ Запад Палавана

## Коммуникация & сервис

- 🕒 По слотам, дневной лимит  
- 🌐 Английский  
- 🚻 Туалеты и визит-центр  
- 📶 Связь ограниченная

## Полезные нюансы

- ⚠️ Требуется предварительное бронирование  
- 🌞 Лучше посещать в сухой сезон  
- 👕 Удобная обувь, защита от воды  
- 🐾 Кормить животных запрещено

## Локальная ценность

Подземная река — главный природный символ Палавана и основа устойчивого экотуризма региона.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝️ El Nido & Bacuit Archipelago
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pps-el-nido-bacuit-archipelago',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых фотогеничных регионов Азии  
- 🌍 Эталон островного туризма  
- 📸 Лагуны, скалы, пляжи без застройки

## Структура комплекса

- 🏞️ Big Lagoon  
- 🏞️ Small Lagoon  
- 🚶 Island hopping (туры A и C)

## Билеты и посещение

- 💰 ₱1200–₱1800 за тур  
- 🎟️ Экосбор оплачивается отдельно  
- 🆓 Пляжи вне туров бесплатны

## Лучшие точки для фото

- 📷 Вид сверху на лагуны  
- 📷 Каяки у скал  
- 🌅 Свет в полдень

## Практическая информация

- **Адрес:** El Nido, Northern Palawan

## Как добраться

- ✈️ Самолёт в El Nido или Пуэрто-Принсесу  
- 🚕 Трансфер по суше  
- 🚤 Лодочные туры из El Nido

## Коммуникация & сервис

- 🕒 Туристический режим с утра  
- 🌐 Английский  
- 🚻 Кафе и сервисы в El Nido  
- 📶 Связь нестабильная на островах

## Полезные нюансы

- ⚠️ Лодки брызгают — защита для техники  
- 🌞 Лучшее время — март–май  
- 👕 Купальная обувь  
- 🐾 Экосбор обязателен

## Локальная ценность

Эль-Нидо — ключевой туристический бренд Палавана и источник дохода для сотен островных сообществ.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏞️ Kayangan Lake, Coron
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pps-kayangan-lake-coron',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальная прозрачность воды  
- 🌍 Священное место народа тагбануа  
- 📸 Классический вид Палавана

## Структура комплекса

- 🏞️ Смотровую площадку  
- 🏞️ Само озеро  
- 🚶 Подъём по ступеням

## Билеты и посещение

- 💰 ~₱200  
- 🎟️ В составе лодочного тура  
- 🆓 Купание разрешено

## Лучшие точки для фото

- 📷 Панораму сверху  
- 📷 Купающихся в озере  
- 🌅 Свет над водой

## Практическая информация

- **Адрес:** Coron Island, Palawan

## Как добраться

- 🚤 Лодка из города Корон  
- 🗺️ Остров Корон

## Коммуникация & сервис

- 🕒 Дневные туры  
- 🌐 Английский  
- 🚻 Минимальные удобства  
- 📶 Связь отсутствует

## Полезные нюансы

- ⚠️ 300+ ступеней подъёма  
- 🌞 Лучше утром  
- 👕 Акваобувь  
- 🐾 Запрет на мусор

## Локальная ценность

Озеро охраняется местными общинами и является примером баланса туризма и традиций.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐠 Tubbataha Reefs Natural Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pps-tubbataha-reefs-natural-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Топ-5 дайв-сайтов планеты  
- 🌍 Эталон морской экосистемы  
- 📸 Подводные стены и акулы

## Структура комплекса

- 🏞️ Коралловые стены  
- 🏞️ Стаи акул и мант  
- 🚶 Ночные погружения

## Билеты и посещение

- 💰 Только liveaboard ($3000+)  
- 🎟️ Лицензированный дайвинг  
- 🆓 Недоступно для обычных туристов

## Лучшие точки для фото

- 📷 Подводные стены  
- 📷 Акул  
- 🌅 Рассветы в океане

## Практическая информация

- **Адрес:** Sulu Sea, Palawan

## Как добраться

- 🚢 Дайв-сафари из Пуэрто-Принсесы  
- 🗺️ Центр моря Сулу

## Коммуникация & сервис

- 🕒 Сезон: март–июнь  
- 🌐 Английский  
- 🚻 Только на борту  
- 📶 Нет связи

## Полезные нюансы

- ⚠️ Для опытных дайверов  
- 👕 Полный комплект снаряжения  
- 🐾 Строгие экоправила

## Локальная ценность

Туббатаха — национальное достояние Филиппин и пример глобального морского заповедника.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ KaLui Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pps-kalui-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Морепродукты дня  
- 🍽️ Суп sinigang  
- 🍹 Фруктовый десерт в кокосе

## Цены

- 💰 ₱600–₱800  
- 🧾 Set menu  
- 🆓 Комплименты от шефа

## Как добраться

- 🚕 Такси  
- 🗺️ Puerto Princesa City

## Коммуникация & сервис

- 🕒 11:00–14:00 / 18:00–22:30  
- 🌐 Английский  
- 📶 Нет Wi-Fi  
- 💳 Cash only

## Полезные нюансы

- ⚠️ Нужна бронь  
- 🌞 Лучше ужин  
- 👕 Casual (босиком внутри)

## Локальная ценность

KaLui поддерживает местных рыбаков и художников, формируя гастро-идентичность Палавана.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Подачу блюд  
- 🌅 Вечерний зал

## Практическая информация

- **Адрес:** Puerto Princesa  
- **Соцсети:** [KaLui Restaurant](https://www.instagram.com/kaluirestaurant/)

## Почему это важно?

- 🌟 Культовое гастроместо Палавана  
- 🌍 Локальная кухня из свежего улова  
- 📸 Атмосферный интерьер
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍻 Kinabuch’s Grill & Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pps-kinabuch-s-grill-bar',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Crocodile Sisig  
- 🍽️ Tamilok  
- 🍹 Местное пиво

## Цены

- 💰 ₱300–₱500  
- 🧾 À la carte  
- 🆓 Бильярд

## Как добраться

- 🚕 Такси  
- 🗺️ Центр Пуэрто-Принсесы

## Коммуникация & сервис

- 🕒 16:00–23:00  
- 🌐 Английский  
- 📶 Нет Wi-Fi  
- 💳 Cash

## Полезные нюансы

- ⚠️ Шумно  
- 🌞 Лучше вечером  
- 👕 Casual

## Локальная ценность

Kinabuch’s — часть современной городской культуры Палавана, где встречаются туристы и местные.

## Лучшие точки для фото

- 📷 Гриль  
- 📷 Экзотические блюда  
- 🌅 Вечернюю толпу

## Практическая информация

- **Адрес:** Puerto Princesa

## Почему это важно?

- 🌟 Самая живая атмосфера города  
- 🌍 Место общения и экспериментов  
- 📸 Уличный вайб
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- BEGIN ATLAS_COUNTRY_CITY_TABS
-- Generated: 2026-02-08T16:33:10.714Z
-- Blocks: 85

-- city/tag tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-bohol.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'tag',
  'overview',
  'ru',
  'Обзор',
  'Бохоль — островная провинция в центральной части Филиппин (Висайи), известная природными достопримечательностями, спокойным ритмом жизни и экологическим туризмом. Регион прославился Шоколадными холмами, белоснежными пляжами Панглао и разнообразием морской фауны.

Бохоль часто выбирают путешественники, семьи и экспаты, ищущие баланс между природой, доступной инфраструктурой и отсутствием суеты мегаполисов. Это направление подходит для длительного проживания, зимовки и «медленного туризма».',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/tag tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-bohol.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'tag',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: tagbilaran
    title: Тагбиларан
    description: Административный центр Бохоля с портом, аэропортом, больницами и базовыми сервисами.
  - id: panglao
    title: Панглао
    description: Курортный остров с пляжами Алона и Данао, популярный у туристов и экспатов.
  - id: chocolate-hills
    title: Центральный Бохоль
    description: Внутренние районы острова с Шоколадными холмами, реками и сельской жизнью.
  - id: anda
    title: Анда
    description: Восточное побережье с уединёнными пляжами и минимальной застройкой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/tag tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-bohol.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'tag',
  'accommodation',
  'ru',
  'Проживание',
  'На Бохоле доступны гестхаусы, апартаменты, дома и небольшие резорты. В Тагбиларане можно найти жильё для долгосрочного проживания, а в Панглао — курортные варианты у моря.

Стоимость аренды ниже, чем на Боракае или в Эль-Нидо. Регион популярен у семей и пенсионеров благодаря спокойствию и доступности.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/tag tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-bohol.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'tag',
  'food',
  'ru',
  'Еда и кафе',
  'Кухня Бохоля основана на морепродуктах, рисе и местных фруктах. В Тагбиларане и Панглао работают кафе с филиппинской и интернациональной кухней.

Знаменитые блюда региона — морепродукты, тушёные блюда с кокосом и местные десерты. Выбор проще, чем в крупных городах, но качество продуктов высокое.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/tag tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-bohol.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'tag',
  'transport',
  'ru',
  'Транспорт',
  'Основные виды транспорта — трициклы, мотобайки и арендованные автомобили. Дороги между основными точками острова находятся в хорошем состоянии.

Бохоль связан с Себу паромами и авиарейсами. Аэропорт расположен на острове Панглао.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/tag tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-bohol.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'tag',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический. Лучшее время для посещения — с декабря по май, когда погода сухая и комфортная.

Сезон дождей выражен умеренно. Тайфуны случаются реже, чем на севере страны.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/tag tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-bohol.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'tag',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг ограничен повседневными товарами. В Тагбиларане есть торговые центры и рынки.

За крупными покупками жители часто ездят в Себу.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/tag tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-bohol.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'tag',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь минимальна и сосредоточена в курортных районах Панглао. Работают пляжные бары и рестораны.

Бохоль ориентирован на спокойный отдых и семейную атмосферу.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/tag tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-bohol.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'tag',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - eco_travel
  - family_life
  - slow_travel
  - island_relax',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/tag tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-bohol.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'tag',
  'tips',
  'ru',
  'Практическая информация',
  'Бохоль считается безопасным и дружелюбным регионом. Медицинские услуги представлены базовыми клиниками, более сложные случаи направляют в Себу.

Интернет доступен, но скорость может варьироваться вне городских зон.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/tag tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-bohol.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'tag',
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

-- city/tag tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-bohol.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'tag',
  'budget',
  'ru',
  'Цены и бюджет',
  'Бохоль — доступное направление. Комфортный бюджет одного человека составляет 600–1000 USD в месяц.

Аренда жилья начинается от 200–350 USD, питание и транспорт обходятся недорого.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ceb tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-cebu.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ceb',
  'overview',
  'ru',
  'Обзор',
  'Себу — второй по значимости город Филиппин и главный центр Висайских островов. Город считается колыбелью христианства в стране и одновременно современным региональным хабом бизнеса, образования и IT-аутсорсинга.

Себу часто называют «альтернативой Маниле»: здесь развитая городская инфраструктура сочетается с более спокойным ритмом жизни и близостью к морю и островам. Город подходит как для жизни и работы, так и как база для путешествий по центральным Филиппинам.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ceb tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-cebu.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ceb',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: cebu-city-center
    title: Центр Себу
    description: Историческое ядро города с колониальными памятниками, рынками и административными зданиями.
  - id: it-park
    title: Cebu IT Park
    description: Современный деловой район с офисами BPO-компаний, кафе и кондоминиумами.
  - id: lahug
    title: Лахуг
    description: Жилой и деловой район рядом с IT Park, популярный у экспатов.
  - id: mandaue
    title: Мандауэ
    description: Индустриальный и жилой город-спутник, часть агломерации Metro Cebu.
  - id: talisay
    title: Талисай
    description: Южный пригород с жилыми кварталами и более спокойной атмосферой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ceb tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-cebu.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ceb',
  'accommodation',
  'ru',
  'Проживание',
  'Рынок жилья в Себу разнообразен: от современных кондоминиумов до частных домов в пригородах. Экспаты чаще всего выбирают районы IT Park и Лахуг из-за удобства, безопасности и близости к офисам.

Стоимость аренды ниже, чем в Маниле, при сопоставимом уровне комфорта. Себу популярен среди digital nomads, специалистов BPO и семей, ищущих баланс между городом и природой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ceb tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-cebu.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ceb',
  'food',
  'ru',
  'Еда и кафе',
  'Себу — гастрономический центр Висайских островов. Здесь представлены местная висайская кухня, филиппинские блюда и международные рестораны.

Фирменные блюда региона — lechon Cebu (жареный поросёнок), морепродукты и уличная еда. В районах IT Park и Лахуг много современных кафе и кофеен.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ceb tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-cebu.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ceb',
  'transport',
  'ru',
  'Транспорт',
  'Транспорт в Себу представлен автобусами, джипни, такси и сервисами Grab. Пробки присутствуют, но менее выражены, чем в Маниле.

Международный аэропорт Мактан-Себу связывает город с Азией и внутренними направлениями. Себу — ключевой транспортный узел для поездок на Бохоль, Малапаскуа и другие острова.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ceb tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-cebu.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ceb',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический, более мягкий, чем в Маниле. Температуры обычно держатся в диапазоне +26…+32 °C.

Сезон дождей менее выражен, чем на Лусоне. Тайфуны здесь случаются реже, что делает Себу более стабильным направлением круглый год.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ceb tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-cebu.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ceb',
  'shopping',
  'ru',
  'Шопинг',
  'В Себу расположены крупные торговые центры: Ayala Center Cebu, SM City Cebu и SM Seaside. Они являются важными социальными пространствами города.

Также работают рынки и локальные торговые улицы с более доступными ценами.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ceb tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-cebu.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ceb',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь Себу умеренная, но разнообразная. Работают бары, караоке-заведения и клубы, особенно в районе IT Park и центре города.

Город больше ориентирован на повседневную жизнь и социальные встречи, чем на масштабные вечеринки.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ceb tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-cebu.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ceb',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - regional_hub
  - island_hopping
  - expat_life
  - bpo_city',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ceb tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-cebu.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ceb',
  'tips',
  'ru',
  'Практическая информация',
  'Себу считается более спокойным и удобным для жизни, чем Манила. Английский язык широко распространён, особенно в деловой и образовательной среде.

Медицинские услуги представлены современными частными клиниками. Интернет стабилен и подходит для удалённой работы.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ceb tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-cebu.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ceb',
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

-- city/ceb tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-cebu.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ceb',
  'budget',
  'ru',
  'Цены и бюджет',
  'Себу дешевле Манилы. Комфортный бюджет одного человека составляет 900–1400 USD в месяц.

Аренда квартиры начинается от 300–500 USD, питание и транспорт обходятся умеренно.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dumaguete tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-dumaguete.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dumaguete',
  'overview',
  'ru',
  'Обзор',
  'Думагете — компактный и дружелюбный город на острове Негрос, известный как «город нежных людей». Он сочетает университетскую атмосферу, спокойный ритм жизни и близость к морю и природе, что делает его одним из самых популярных мест для долгосрочного проживания экспатов и пенсионеров на Филиппинах.

Город часто выбирают те, кто ищет размеренную жизнь без суеты мегаполисов, с базовой инфраструктурой, доступной медициной и активным международным сообществом.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dumaguete tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-dumaguete.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dumaguete',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: downtown
    title: Центр Думагете
    description: Деловой и социальный центр города с набережной, кафе, рынками и офисами.
  - id: boulevard
    title: Набережная Рисаля
    description: Прогулочная зона у моря с ресторанами, барами и вечерней активностью.
  - id: sibulan
    title: Сибулан
    description: Пригород с аэропортом, более спокойной жилой застройкой и домами экспатов.
  - id: valencia
    title: Валенсия
    description: Горный пригород с более прохладным климатом, популярный для домов и ретритов.
  - id: bacong
    title: Баконг
    description: Южный пригород с локальной жизнью и доступной арендой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dumaguete tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-dumaguete.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dumaguete',
  'accommodation',
  'ru',
  'Проживание',
  'В Думагете доступны апартаменты, дома, гестхаусы и небольшие кондоминиумы. Экспаты часто выбирают отдельные дома в пригородах или квартиры рядом с набережной.

Стоимость аренды значительно ниже, чем в Маниле и Себу. Город подходит для долгосрочного проживания, особенно для пенсионеров и удалённых работников с умеренными требованиями к инфраструктуре.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dumaguete tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-dumaguete.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dumaguete',
  'food',
  'ru',
  'Еда и кафе',
  'Гастрономическая сцена Думагете ориентирована на локальную кухню и международное экспатское сообщество. В городе много недорогих кафе, пекарен и ресторанов с западным меню.

Популярны морепродукты, простые филиппинские блюда и кафе на набережной. Качество еды хорошее при доступных ценах.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dumaguete tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-dumaguete.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dumaguete',
  'transport',
  'ru',
  'Транспорт',
  'Город компактный, основные перемещения осуществляются пешком, на трициклах и мотобайках. Трафик минимальный.

Аэропорт Сибулан связывает Думагете с Манилой и Себу. Из порта ходят паромы на Себу и соседние острова.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dumaguete tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-dumaguete.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dumaguete',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический, мягкий по сравнению с другими регионами. Температуры обычно держатся в диапазоне +26…+31 °C.

Дожди возможны круглый год, но редко бывают затяжными. Тайфуны здесь случаются редко.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dumaguete tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-dumaguete.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dumaguete',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг ограничен базовыми товарами. В городе есть торговые центры, рынки и супермаркеты.

За крупными покупками жители часто ездят в Себу.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dumaguete tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-dumaguete.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dumaguete',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь спокойная и социальная. Основные активности сосредоточены на набережной и в небольших барах.

Город ориентирован на общение, прогулки и ранний ритм, а не на клубные развлечения.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dumaguete tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-dumaguete.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dumaguete',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - expat_retirement
  - university_city
  - slow_life
  - island_base',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dumaguete tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-dumaguete.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dumaguete',
  'tips',
  'ru',
  'Практическая информация',
  'Думагете считается одним из самых безопасных и комфортных городов для жизни иностранцев. Английский язык широко используется в повседневной жизни.

Медицинские услуги представлены частными клиниками и больницами среднего уровня. Для сложных случаев обращаются в Себу или Манилу.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dumaguete tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-dumaguete.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dumaguete',
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

-- city/dumaguete tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-dumaguete.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dumaguete',
  'budget',
  'ru',
  'Цены и бюджет',
  'Думагете — один из самых доступных городов Филиппин. Комфортный бюджет одного человека составляет 600–900 USD в месяц.

Аренда жилья начинается от 180–300 USD, питание и транспорт обходятся недорого.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/mnl tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-manila.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'mnl',
  'overview',
  'ru',
  'Обзор',
  'Манила — столица Филиппин и один из крупнейших мегаполисов Юго-Восточной Азии. Город является политическим, экономическим и культурным центром страны, а также главным транспортным узлом архипелага. В широком смысле под Манилой обычно понимают агломерацию Metro Manila, включающую более 15 городов и муниципалитетов.

Манила — город контрастов: современные деловые районы с небоскрёбами соседствуют с историческими кварталами испанской эпохи и плотно заселёнными жилыми районами. Это не курортное направление, а динамичный мегаполис возможностей, где сосредоточены бизнес, образование, медицина и международные связи.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/mnl tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-manila.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'mnl',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: intramuros
    title: Интрамурос
    description: Исторический центр испанской эпохи с крепостными стенами, церквями и музеями.
  - id: makati
    title: Макати
    description: Главный финансовый и деловой район страны, популярный у экспатов.
  - id: bgc
    title: Bonifacio Global City (BGC)
    description: Современный плановый район с офисами, кондоминиумами и пешеходной инфраструктурой.
  - id: quezon-city
    title: Кесон-Сити
    description: Крупнейший по населению город агломерации, университетский и жилой центр.
  - id: ermita-malate
    title: Эрмита и Малате
    description: Туристические и исторические районы рядом с парком Рисаля и заливом.
  - id: pasay
    title: Пасай
    description: Район у залива с торговыми центрами, аренами и аэропортом.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/mnl tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-manila.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'mnl',
  'accommodation',
  'ru',
  'Проживание',
  'Манила предлагает самый широкий выбор жилья на Филиппинах: современные кондоминиумы, апартаменты, таунхаусы и частные дома в закрытых жилых комплексах. Наиболее популярные районы для экспатов — Макати, BGC и отдельные зоны Кесон-Сити.

Стоимость аренды выше, чем в других городах страны, однако уровень инфраструктуры и доступность сервисов компенсируют цену. Манила подходит для долгосрочного проживания тем, кто ориентирован на карьеру, бизнес или международную среду.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/mnl tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-manila.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'mnl',
  'food',
  'ru',
  'Еда и кафе',
  'Манила — гастрономическая столица Филиппин. Здесь представлены кухни всех регионов страны, а также международная кухня: азиатская, европейская, американская и ближневосточная.

Уличная еда соседствует с ресторанами высокого уровня. Популярны фудкорты в торговых центрах, рынки и современные кафе в районах Макати и BGC.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/mnl tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-manila.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'mnl',
  'transport',
  'ru',
  'Транспорт',
  'Транспортная система Манилы включает метро (LRT и MRT), автобусы, джипни и такси. Несмотря на развитие инфраструктуры, пробки остаются одной из главных проблем города.

Широко используются сервисы Grab и мототакси. Манила является главным авиационным хабом страны с международным аэропортом NAIA.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/mnl tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-manila.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'mnl',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический муссонный. Температуры держатся в диапазоне +26…+34 °C.

Сухой сезон продолжается с ноября по апрель и считается наиболее комфортным. Сезон дождей — с мая по октябрь, возможны сильные ливни и тайфуны.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/mnl tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-manila.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'mnl',
  'shopping',
  'ru',
  'Шопинг',
  'Манила — крупнейший торговый центр страны. Здесь расположены одни из самых больших торговых комплексов Азии, включая Mall of Asia и сети Ayala Malls и SM.

Ассортимент включает как локальные товары, так и международные бренды. Торговые центры также выполняют роль социальных пространств.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/mnl tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-manila.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'mnl',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь Манилы активна и разнообразна. Работают бары, клубы, rooftop-лаунжи и концертные площадки.

Основные центры ночной жизни — Макати (Poblacion), BGC и отдельные районы Пасая. Алкоголь доступен, но облагается высокими налогами.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/mnl tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-manila.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'mnl',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - relocation
  - expat_life
  - business_city
  - urban_survival',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/mnl tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-manila.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'mnl',
  'tips',
  'ru',
  'Практическая информация',
  'Манила требует адаптации: высокая плотность населения, интенсивное движение и шум. Рекомендуется выбирать жильё рядом с местом работы или учебы.

Английский язык широко используется во всех сферах жизни. Медицинские услуги высокого уровня доступны в частных клиниках и госпиталях.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/mnl tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-manila.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'mnl',
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

-- city/mnl tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-manila.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'mnl',
  'budget',
  'ru',
  'Цены и бюджет',
  'Манила — самый дорогой город Филиппин. Комфортный бюджет одного человека составляет 1200–1800 USD в месяц.

Аренда современной квартиры начинается от 400–600 USD, расходы на транспорт и питание выше, чем в провинции.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pps tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-palawan.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pps',
  'overview',
  'ru',
  'Обзор',
  'Палаван — один из самых живописных регионов Филиппин, регулярно признаваемый одним из лучших островов мира. Он известен кристально чистыми лагунами, карстовыми скалами, джунглями и богатой морской экосистемой. Палаван часто называют «последним экологическим рубежом» страны.

Для путешественников Палаван — это эталон тропического рая, а для экспатов и digital nomads — место уединённой жизни рядом с природой. Основные центры региона — Пуэрто-Принсеса, Эль-Нидо и Корон.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pps tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-palawan.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pps',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: puerto-princesa
    title: Пуэрто-Принсеса
    description: Административный центр Палавана с аэропортом, сервисами и подземной рекой ЮНЕСКО.
  - id: el-nido
    title: Эль-Нидо
    description: Туристический центр с лагунами, островами и развитой экотуристической инфраструктурой.
  - id: coron
    title: Корон
    description: Город и архипелаг, известный дайвингом, лагунами и кораблекрушениями времён Второй мировой войны.
  - id: rural-palawan
    title: Сельские районы Палавана
    description: Малонаселённые зоны с джунглями, пляжами и традиционным образом жизни.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pps tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-palawan.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pps',
  'accommodation',
  'ru',
  'Проживание',
  'Палаван предлагает жильё разного уровня: от гестхаусов и бунгало до эко-лоджей и курортных отелей. В Пуэрто-Принсесе доступны апартаменты и дома для долгосрочного проживания.

Стоимость жизни ниже, чем в Маниле и Себу, но в популярных местах вроде Эль-Нидо жильё дороже из-за ограниченного предложения. Регион подходит для спокойной жизни и сезонного проживания.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pps tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-palawan.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pps',
  'food',
  'ru',
  'Еда и кафе',
  'Кухня Палавана основана на свежих морепродуктах, рыбе, рисе и тропических фруктах. В туристических районах представлены кафе с международной кухней и вегетарианскими блюдами.

В небольших поселениях преобладают простые варунги и семейные рестораны. Качество продуктов высокое, но выбор ограничен по сравнению с мегаполисами.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pps tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-palawan.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pps',
  'transport',
  'ru',
  'Транспорт',
  'Основные способы передвижения — мотобайки, трициклы и лодки. Дорожная сеть ограничена, между городами часто перемещаются по морю.

Аэропорты есть в Пуэрто-Принсесе, Эль-Нидо и Короне. Палаван связан авиасообщением с Манилой и Себу.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pps tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-palawan.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pps',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический, относительно сухой по сравнению с другими регионами Филиппин. Лучшее время для посещения — с ноября по май.

Сезон дождей мягче выражен, тайфуны здесь редки, что делает Палаван одним из самых стабильных направлений страны.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pps tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-palawan.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pps',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг ограничен базовыми товарами. Основные покупки совершаются на рынках и в небольших магазинах.

Импортные товары и электронику чаще приобретают в Маниле или Себу.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pps tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-palawan.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pps',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь спокойная и камерная. В Эль-Нидо и Короне работают бары у моря, ориентированные на туристов.

Регион не предназначен для клубных развлечений и ценится за тишину и природную атмосферу.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pps tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-palawan.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pps',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - island_hopping
  - eco_travel
  - diving
  - nature_retreat',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pps tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-palawan.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pps',
  'tips',
  'ru',
  'Практическая информация',
  'Палаван считается безопасным и экологически чистым регионом. Медицинские услуги ограничены и представлены в основном в Пуэрто-Принсесе.

Интернет доступен, но скорость и стабильность могут варьироваться, особенно в удалённых районах.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pps tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-palawan.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pps',
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

-- city/pps tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-palawan.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pps',
  'budget',
  'ru',
  'Цены и бюджет',
  'Палаван — доступный регион для жизни вне туристических зон. Комфортный бюджет одного человека составляет 700–1200 USD в месяц.

Аренда жилья начинается от 250–400 USD, в туристических районах цены выше.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/srg tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-siargao.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'srg',
  'overview',
  'ru',
  'Обзор',
  'Сиаргао — остров и муниципалитет на востоке Филиппин, мировой центр серфинга и одно из самых популярных направлений для digital nomads в стране. Остров известен волной Cloud 9, тропической природой, лагунами и атмосферой свободы.

За последние годы Сиаргао превратился из удалённого серферского спота в международное комьюнити удалённых специалистов, креаторов и путешественников. Это направление выбирают за баланс между природой, социальным окружением и возможностью работать онлайн.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/srg tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-siargao.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'srg',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: general-luna
    title: Генерал Луна
    description: Главный туристический и социальный центр острова с кафе, серф-спотами и коворкингами.
  - id: cloud-9
    title: Cloud 9
    description: Знаменитый серф-район с пирсом, пляжами и волнами мирового уровня.
  - id: pacifico
    title: Пасифико
    description: Более спокойный район на севере острова с пляжами и серфингом.
  - id: del-carmen
    title: Дель Кармен
    description: Район мангровых лесов и лагун, центр экотуризма.
  - id: rural-siargao
    title: Внутренние районы острова
    description: Сельские зоны с пальмовыми рощами и локальной жизнью.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/srg tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-siargao.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'srg',
  'accommodation',
  'ru',
  'Проживание',
  'На Сиаргао доступны бунгало, гестхаусы, дома и небольшие резорты. Многие экспаты арендуют жильё на долгий срок, особенно в районе Генерал Луна.

Цены выросли за последние годы, но остаются ниже, чем на популярных курортах Таиланда. Качество жилья варьируется, инфраструктура развивается постепенно.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/srg tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-siargao.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'srg',
  'food',
  'ru',
  'Еда и кафе',
  'Гастрономическая сцена Сиаргао ориентирована на международную аудиторию. Здесь много кафе с западной кухней, вегетарианскими и веганскими блюдами, а также филиппинскими специалитетами.

Популярны боулы, смузи, свежая рыба и морепродукты. Вечером кафе и бары становятся центрами социальной жизни.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/srg tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-siargao.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'srg',
  'transport',
  'ru',
  'Транспорт',
  'Основной транспорт — мотобайки и трициклы. Дорожная сеть ограничена, движение спокойное.

Аэропорт Сиаргао (Sayak) связывает остров с Манилой и Себу. Также доступны лодочные экскурсии и island hopping.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/srg tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-siargao.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'srg',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический. Лучшее время для серфинга — с сентября по ноябрь, когда приходят основные волны.

Сухой сезон длится примерно с марта по июнь. Сезон дождей выражен сильнее, чем на западе Филиппин, возможны тайфуны.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/srg tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-siargao.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'srg',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг минимальный и ориентирован на повседневные нужды. Магазины, рынки и лавки сосредоточены в Генерал Луне.

Импортные товары ограничены и стоят дороже, чем на материке.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/srg tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-siargao.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'srg',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь активная, но не клубная. Основной формат — пляжные бары, вечеринки, живая музыка и социальные мероприятия.

Сиаргао известен атмосферой комьюнити и неформального общения.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/srg tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-siargao.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'srg',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - surfing_capital
  - digital_nomad
  - island_life
  - eco_travel',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/srg tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-siargao.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'srg',
  'tips',
  'ru',
  'Практическая информация',
  'Сиаргао требует адаптации к островным условиям: возможны перебои с электричеством, водой и интернетом.

Безопасность высокая, сообщество дружелюбное. Интернет доступен, но для стабильной удалённой работы рекомендуется иметь резервные подключения.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/srg tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-siargao.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'srg',
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

-- city/srg tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/city-siargao.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'srg',
  'budget',
  'ru',
  'Цены и бюджет',
  'Сиаргао — направление средней ценовой категории. Комфортный бюджет одного человека составляет 800–1200 USD в месяц.

Аренда жилья начинается от 300–500 USD, питание и транспорт обходятся умеренно.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/ph tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
  'overview',
  'ru',
  'Обзор',
  'Филиппины — динамично развивающаяся страна Юго-Восточной Азии, представляющая собой обширный архипелаг из более чем 7 600 островов. Географически страна делится на три крупные группы: Лусон на севере, Висайи в центральной части и Минданао на юге. Такое разнообразие формирует уникальное сочетание мегаполисов, тропических островов, вулканов, джунглей и морских экосистем.

Филиппины выделяются среди стран региона сочетанием азиатской культуры и западного наследия. Более трёхсот лет испанского правления и последующий американский период сформировали католическую традицию, латинские культурные черты и широкое распространение английского языка. Это делает страну особенно привлекательной для иностранцев: здесь легко адаптироваться, общаться и работать без языкового барьера.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/ph tab=gallery (Фотогалерея) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
  'gallery',
  'ru',
  'Фотогалерея',
  '@gallery:
  - philippines_palawan_lagoon.jpg
  - philippines_boracay_beach.jpg
  - philippines_chocolate_hills.jpg
  - philippines_mayor_volcano.jpg
  - philippines_manila_skyline.jpg',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/ph tab=map (Карта) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
  'map',
  'ru',
  'Карта',
  '@map:
  center: [12.0, 122.0]
  zoom: 5',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/ph tab=weather (Погода и климат) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
  'weather',
  'ru',
  'Погода и климат',
  'Климат Филиппин тропический муссонный. Погода зависит от региона, но в целом круглый год тепло и влажно.

### Сезоны
- Сухой сезон: ноябрь — апрель (наиболее комфортный период)
- Сезон дождей: май — октябрь (ливни, высокая влажность, возможны тайфуны)

Средние температуры держатся в диапазоне +26…+32 °C, вода в море тёплая круглый год.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/ph tab=history (История) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
  'history',
  'ru',
  'История',
  'История Филиппин — это история взаимодействия местных цивилизаций, исламских султанатов, испанской колонизации и американского влияния. Испания управляла архипелагом более 300 лет, что привело к массовой христианизации и формированию колониальных городов.

В 1898 году Филиппины перешли под контроль США, а в 1946 году получили полную независимость. Современное государство — демократическая республика с сильной национальной идентичностью и памятью о борьбе за свободу.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/ph tab=geography (География) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
  'geography',
  'ru',
  'География',
  'Филиппины расположены в западной части Тихого океана и входят в Тихоокеанское огненное кольцо. Страна характеризуется активным вулканизмом, горным рельефом и протяжённой береговой линией.

Здесь находятся уникальные природные объекты: рисовые террасы Банауэ, подземная река Пуэрто-Принсеса, вулкан Майон, коралловые рифы Туббатаха и многочисленные островные экосистемы.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/ph tab=culture (Культура) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
  'culture',
  'ru',
  'Культура',
  'Культура Филиппин — редкое сочетание азиатской основы и латинского темперамента. Основные ценности — семья, религия, общинность и гостеприимство.

Филиппинцы известны оптимизмом, любовью к музыке, караоке и фестивалям. Католические праздники и местные фиесты играют важную роль в общественной жизни.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/ph tab=living (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
  'living',
  'ru',
  'Проживание',
  'Филиппины предлагают широкий выбор жилья: от городских кондоминиумов до домов у моря. Стоимость жизни ниже, чем во многих странах региона, особенно за пределами Манилы.

Иностранцы часто выбирают страну для зимовки, удалённой работы или пенсии благодаря тёплому климату и доступным ценам.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/ph tab=visas (Визы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
  'visas',
  'ru',
  'Визы',
  'Гражданам многих стран доступен безвизовый въезд на 30 дней с возможностью многократного продления вплоть до 36 месяцев без выезда из страны.

Также действуют специальные визы для пенсионеров (SRRV), инвесторов и анонсирована виза для цифровых кочевников, рассчитанная на долгосрочное удалённое пребывание.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/ph tab=business (Бизнес) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
  'business',
  'ru',
  'Бизнес',
  'Экономика Филиппин активно развивается за счёт сектора услуг, BPO, IT, туризма и строительства. Англоязычная рабочая сила и большой внутренний рынок делают страну привлекательной для предпринимателей.

При этом бизнес-среда требует терпения из-за бюрократии и ограничений на иностранное владение в ряде отраслей.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/ph tab=phrasebook (Разговорник) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
  'phrasebook',
  'ru',
  'Разговорник',
  '- Здравствуйте — Hello / Kamusta
- Спасибо — Salamat
- Пожалуйста — Walang anuman
- Извините — Paumanhin
- Сколько стоит? — Magkano ito?
- Где находится …? — Nasaan ang …?',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/ph tab=reviews (Отзывы экспатов) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
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

-- country/ph tab=calculator (Калькулятор стоимости) from E:/projects/work_go2asia/20251216go2asia/content/atlas/philippines/country-philippines.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'ph',
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


