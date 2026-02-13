-- Content Blocks UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Content block for: 🏛️ Angkor Wat
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'rep-angkor-wat',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый масштабный и гармоничный храмовый ансамбль Ангкорской империи  
- 🌍 Объект Всемирного наследия ЮНЕСКО и национальный символ Камбоджи  
- 📸 Один из самых фотогеничных архитектурных комплексов Азии, особенно на рассвете

## Структура комплекса

- 🏛️ Центральный храм Ангкор-Ват с пятибашенной композицией  
- 🏞️ Барельефы галерей с эпосами «Рамаяна» и «Махабхарата»  
- 🚶 Рассвет у западного водоёма и обход храма по внешней галерее

## Билеты и посещение

- 💰 $37 — билет на 1 день / $62 — на 3 дня  
- 🎟️ Билеты действуют на весь Ангкорский археологический парк  
- 🆓 Бесплатный вход для местных жителей

## Лучшие точки для фото

- 📷 Отражение центральных башен в западном пруду  
- 📷 Детали барельефов при боковом освещении  
- 🌅 Рассвет и мягкий утренний свет над храмом

## Практическая информация

- **Адрес:** Angkor Archaeological Park, Siem Reap  
- **Сайт:** [https://www.angkorenterprise.gov.kh](https://www.angkorenterprise.gov.kh)

## Как добраться

- 🚕 Тук-тук или такси из Сиемреапа (15–20 минут)  
- 🚌 Организованные туры и аренда велосипеда/скутера

## Коммуникация & сервис

- 🕒 Открыт ежедневно с 05:00 до 17:30  
- 🌐 Гиды: кхмерский, английский, французский, китайский  
- 🚻 Туалеты, зоны отдыха, сувенирные лавки у входов  
- 📶 Мобильная связь нестабильна внутри комплекса

## Полезные нюансы

- ⚠️ Требуется закрытая одежда (плечи и колени)  
- 🌞 Лучшее время — рассвет (05:30–07:00) и поздний вечер  
- 👕 Удобная обувь обязательна — большие расстояния  
- 🐾 Запрещено забираться на закрытые зоны и руины

## Локальная ценность

Ангкор-Ват — не просто туристический объект, а сакральное место для кхмеров. Он изображён на государственном флаге и воспринимается как символ национального возрождения и утраченного величия Ангкорской империи.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Bayon
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'rep-bayon',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых узнаваемых храмов Ангкора благодаря каменным «улыбкам»  
- 🌍 Центральный храм древнего города Ангкор-Тхом  
- 📸 Уникальная атмосфера мистики и силы

## Структура комплекса

- 🏛️ Башни с 216 каменными лицами  
- 🏞️ Барельефы с бытовыми сценами жизни кхмеров  
- 🚶 Обход центральной платформы и верхнего яруса

## Билеты и посещение

- 💰 Входит в билет Ангкорского парка  
- 🎟️ Отдельный билет не требуется  
- 🆓 Бесплатный вход для местных жителей

## Лучшие точки для фото

- 📷 Каменные лица крупным планом  
- 📷 Барельефы с жанровыми сценами  
- 🌅 Мягкий боковой свет во второй половине дня

## Практическая информация

- **Адрес:** Angkor Thom, Siem Reap  
- **Сайт:** [https://www.angkorenterprise.gov.kh](https://www.angkorenterprise.gov.kh)

## Как добраться

- 🚕 Тук-тук или такси из Сиемреапа (15–20 минут)  
- 🚌 В составе экскурсионных маршрутов

## Коммуникация & сервис

- 🕒 Доступен ежедневно с 07:30 до 17:30  
- 🌐 Гиды: кхмерский, английский  
- 🚻 Туалеты и лавки у внешних входов  
- 📶 Связь ограничена внутри храма

## Полезные нюансы

- ⚠️ Крутые лестницы, требуется осторожность  
- 🌞 Лучшее время — утро и поздний день  
- 👕 Закрытая одежда обязательна  
- 🐾 Запрещено забираться на закрытые уровни

## Локальная ценность

Байон символизирует эпоху короля Джаявармана VII и переход к буддизму махаяны, отражая представление кхмеров о сакральной власти правителя.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Ta Prohm
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'rep-ta-prohm',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый «дикий» храм Ангкора  
- 🌍 Знаковый пример взаимодействия природы и руин  
- 📸 Один из самых фотогеничных храмов Азии

## Структура комплекса

- 🏛️ Галереи, оплетённые корнями деревьев  
- 🏞️ Центральный монастырский двор  
- 🚶 Прогулку по внутренним коридорам

## Билеты и посещение

- 💰 Входит в билет Ангкорского парка  
- 🎟️ Отдельный билет не требуется  
- 🆓 Бесплатно для местных жителей

## Лучшие точки для фото

- 📷 Деревья-гиганты, обвивающие стены  
- 📷 Контраст света и тени в коридорах  
- 🌅 Утренний рассеянный свет

## Практическая информация

- **Адрес:** Angkor Archaeological Park, Siem Reap

## Как добраться

- 🚕 Тук-тук из Сиемреапа (15 минут)  
- 🚌 В составе экскурсионных маршрутов

## Коммуникация & сервис

- 🕒 Открыт с 07:30 до 17:30  
- 🌐 Англоговорящие гиды доступны  
- 🚻 Туалеты у входа  
- 📶 Связь нестабильна

## Полезные нюансы

- ⚠️ Много туристов в середине дня  
- 🌞 Лучше приходить рано утром  
- 👕 Закрытая одежда обязательна  
- 🐾 Не трогать корни и камни

## Локальная ценность

Та-Пром стал символом сохранения храмов в «первозданном» виде, показывая, как Ангкор выглядел до масштабных реставраций.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Banteay Srei
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'rep-banteay-srei',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый декоративный храм Ангкора  
- 🌍 Уникальная резьба по красному песчанику  
- 📸 Фотографически идеальные детали

## Структура комплекса

- 🏛️ Главные башни с резными панелями  
- 🏞️ Надписи и мифологические сцены  
- 🚶 Аллею подхода к храму

## Билеты и посещение

- 💰 Входит в билет Ангкорского парка  
- 🎟️ Отдельный билет не требуется  
- 🆓 Бесплатно для местных

## Лучшие точки для фото

- 📷 Резные панели крупным планом  
- 📷 Контраст красного камня и зелени  
- 🌅 Боковое освещение после полудня

## Практическая информация

- **Адрес:** Banteay Srei, Siem Reap Province

## Как добраться

- 🚕 Тук-тук (~30–40 минут от Сиемреапа)  
- 🚌 Экскурсионные туры

## Коммуникация & сервис

- 🕒 07:30–17:30  
- 🌐 Английские гиды  
- 🚻 Туалеты и кафе у входа  
- 📶 Слабая связь

## Полезные нюансы

- ⚠️ Храм маленький — быстро осматривается  
- 🌞 Лучше утром — меньше людей  
- 👕 Закрытая одежда обязательна

## Локальная ценность

Бантей-Срей считается шедевром кхмерского искусства и гордостью национального наследия.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Preah Khan
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'rep-preah-khan',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых атмосферных и «живых» храмов  
- 🌍 Масштабный монастырь с тысячами комнат  
- 📸 Коридоры, оплетённые корнями

## Структура комплекса

- 🏛️ Главный вход и аллею наг  
- 🏞️ Танцевальные залы и библиотеки  
- 🚶 Прогулку по длинным галереям

## Билеты и посещение

- 💰 Входит в билет Ангкорского парка  
- 🎟️ Без доплат  
- 🆓 Для местных — бесплатно

## Лучшие точки для фото

- 📷 Аллею наг  
- 📷 Коридоры с корнями  
- 🌅 Свет в галереях

## Практическая информация

- **Адрес:** Angkor Archaeological Park, Siem Reap

## Как добраться

- 🚕 Тук-тук из Сиемреапа (~20 мин)  
- 🚌 В составе туров

## Коммуникация & сервис

- 🕒 07:30–17:30  
- 🌐 Гиды на английском  
- 🚻 У входа  
- 📶 Слабая связь

## Полезные нюансы

- ⚠️ Много тени — прохладнее других храмов  
- 🌞 Подходит для дневного посещения  
- 👕 Закрытая одежда

## Локальная ценность

Preah Khan был центром образования и религии, отражая синкретизм эпохи Джаявармана VII.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏞️ Phnom Kulen National Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'rep-phnom-kulen-national-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Священное место для кхмеров  
- 🌍 Природный парк с водопадами и рельефами  
- 📸 Гигантский рельеф «Река тысячи лингамов»

## Структура комплекса

- 🏞️ Водопад Phnom Kulen  
- 🏞️ Рельеф «Тысяча лингамов»  
- 🏛️ Статую лежащего Будды

## Билеты и посещение

- 💰 ~$20 (включает вход и транспорт)  
- 🎟️ Обязательно с гидом или организованной группой  
- 🆓 Местные — бесплатно

## Лучшие точки для фото

- 📷 Рельефы в реке  
- 📷 Водопад  
- 🌅 Панораму с горы

## Практическая информация

- **Адрес:** Phnom Kulen National Park, Siem Reap Province

## Как добраться

- 🚐 Только на 4WD или организованном туре (~1 час от Сиемреапа)

## Коммуникация & сервис

- 🕒 08:00–17:00  
- 🌐 Ограниченный английский  
- 🚻 Простейшие туалеты  
- 📶 Нет связи

## Полезные нюансы

- ⚠️ Дорога сложная — не для обычных машин  
- 🌞 Берите воду и головной убор  
- 👕 Удобная обувь для прогулок

## Локальная ценность

Phnom Kulen — духовное сердце Камбоджи, место, где король Джаяварман II провозгласил независимость от Явы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Pub Street
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'rep-pub-street',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Социальное сердце города  
- 🌍 Место встреч туристов и экспатов  
- 📸 Яркая ночная атмосфера

## Структура комплекса

- 🍽️ Уличные ларьки с BBQ  
- 🍹 Бары с happy hour  
- 🚶 Прогулку вечером

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Без билетов  
- 🆓 Доступ круглосуточно

## Лучшие точки для фото

- 📷 Неоновые вывески  
- 📷 Уличную еду  
- 🌃 Ночную толпу

## Практическая информация

- **Адрес:** Pub Street, Siem Reap

## Как добраться

- 🚶 Пешком из любого отеля в центре  
- 🚕 Тук-тук

## Коммуникация & сервис

- 🕒 24/7  
- 🌐 Английский повсеместно  
- 🚻 В ресторанах  
- 📶 Отличная связь

## Полезные нюансы

- ⚠️ Шумно и многолюдно  
- 🌙 Лучше вечером  
- 👕 Casual

## Локальная ценность

Pub Street — экономический двигатель туризма Сиемреапа, создающий тысячи рабочих мест.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎭 Phare Circus
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'rep-phare-circus',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Тук-тук из центра (~10 мин)  
- 🗺️ Южная окраина Сиемреапа

## Коммуникация & сервис

- 🕒 Представления 2–3 раза в неделю (вечером)  
- 🌐 Английские субтитры  
- 🚻 На территории  
- 📶 Wi-Fi

## Полезные нюансы

- ⚠️ Бронировать заранее  
- 🌙 Начало в 20:00  
- 👕 Casual

## Локальная ценность

Phare — не просто шоу, а история исцеления через искусство. Все доходы идут на образование и поддержку молодых артистов.

## Лучшие точки для фото

- 📷 Выступление (без вспышки)  
- 📷 Афиши  
- 🌃 Здание цирка вечером

## Практическая информация

- **Адрес:** Phare Circus, Siem Reap  
- **Сайт:** [https://www.pharecircus.org](https://www.pharecircus.org)

## Почему это важно?

- 🌟 Уникальное сочетание цирка, театра и танца  
- 🌍 Социальный проект с глубоким смыслом  
- 📸 Эмоциональные и техничные выступления

## Структура комплекса

- 🎭 Спектакль «Eclipse» или «The Tale of Apsara»  
- 🎨 Акробатику и музыку  
- 🎪 Интерактивную часть

## Билеты и посещение

- 💰 $25–$35  
- 🎟️ Билеты онлайн или на месте  
- 🆓 Детям — скидки
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Malis Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pnh-malis-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Amok trey (рыба на пару в кокосе)  
- 🍽️ Lok lak (говядина с перцем)  
- 🍹 Кокосовый десерт

## Цены

- 💰 $15–$30  
- 🧾 À la carte  
- 🆓 Комплимент от шефа

## Как добраться

- 🚕 Такси из центра  
- 🗺️ Riverside, Phnom Penh

## Коммуникация & сервис

- 🕒 11:30–22:30  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Карты принимаются

## Полезные нюансы

- ⚠️ Бронь обязательна вечером  
- 🌞 Лучше ужин  
- 👕 Smart casual

## Локальная ценность

Malis поддерживает местных фермеров и сохраняет рецепты, почти утраченные во времена Красных кхмеров.

## Лучшие точки для фото

- 📷 Подачу amok  
- 📷 Интерьер  
- 🌅 Вид на реку вечером

## Практическая информация

- **Адрес:** #35 Sothearos Blvd, Phnom Penh  
- **Сайт:** [https://www.malis.com.kh](https://www.malis.com.kh)

## Почему это важно?

- 🌟 Лучшая подача традиционной кухни  
- 🌍 Кулинарная гордость страны  
- 📸 Атмосферный интерьер
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏯 Wat Phnom
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pnh-wat-phnom',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Символ основания столицы  
- 🌍 Духовный центр города  
- 📸 Панорамный вид с холма

## Структура комплекса

- 🏯 Главную ступу  
- 🏞️ Сад вокруг храма  
- 🕊️ Голубей у подножия

## Билеты и посещение

- 💰 Бесплатно (пожертвования приветствуются)  
- 🎟️ Без билетов  
- 🆓 Доступен всем

## Лучшие точки для фото

- 📷 Ступу  
- 📷 Вид на город  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Wat Phnom, Phnom Penh

## Как добраться

- 🚕 Такси  
- 🚶 Пешком из центра

## Коммуникация & сервис

- 🕒 07:00–18:00  
- 🌐 Кхмерский, частично английский  
- 🚻 У подножия  
- 📶 Связь стабильна

## Полезные нюансы

- ⚠️ Уважайте религиозные обычаи  
- 👕 Закрытая одежда  
- 🐾 Не кормите голубей

## Локальная ценность

Wat Phnom — место паломничества и национальной памяти. По легенде, город назван в честь женщины по имени Пен, нашедшей здесь священные реликвии.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🗿 Independence Monument
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pnh-independence-monument',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Национальный символ свободы  
- 🌍 Архитектурная доминанта столицы  
- 📸 Иконическое фото Пномпеня

## Структура комплекса

- 🗿 Монумент с пятью башнями  
- 🌸 Окружающие цветочные клумбы  
- 🕯️ Вечернюю подсветку

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Без билетов  
- 🆓 Доступ круглосуточно

## Лучшие точки для фото

- 📷 Монумент днём и ночью  
- 📷 Флаг Камбоджи  
- 🌅 Подсветку

## Практическая информация

- **Адрес:** Intersection of Norodom & Sihanouk Blvd, Phnom Penh

## Как добраться

- 🚕 Такси  
- 🚶 Пешком из центра

## Коммуникация & сервис

- 🕒 24/7  
- 🌐 Английский  
- 🚻 В парке рядом  
- 📶 Отличная связь

## Полезные нюансы

- 🌅 Лучше вечером — подсветка  
- 👕 Casual  
- ⚠️ Не лазить по памятнику

## Локальная ценность

Монумент напоминает о мирной независимости 1953 года и является местом возложения венков в национальные праздники.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⚰️ Cheung Ek Killing Fields
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pnh-cheung-ek-killing-fields',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Историческое напоминание о геноциде  
- 🌍 Образовательное значение  
- 📸 Сдержанная, но мощная мемориальная архитектура

## Структура комплекса

- ⚰️ Мемориальную ступу с черепами  
- 🌳 Дерево «Chankiri»  
- 📍 Раскопки массовых захоронений

## Билеты и посещение

- 💰 $6  
- 🎟️ Аудиогид включён  
- 🆓 Для студентов — скидки

## Лучшие точки для фото

- 📷 Мемориальную ступу (с уважением)  
- 📷 Пейзаж поля  
- 🌅 Свет сквозь деревья

## Практическая информация

- **Адрес:** Cheung Ek, Dangkao District, Phnom Penh

## Как добраться

- 🚌 Экскурсия из Пномпеня (~30 мин)  
- 🚕 Такси

## Коммуникация & сервис

- 🕒 07:30–17:00  
- 🌐 Аудиогид на 10+ языках  
- 🚻 На территории  
- 📶 Слабая связь

## Полезные нюансы

- ⚠️ Уважительное поведение обязательно  
- 👕 Скромная одежда  
- 🐾 Тишина и почтение

## Локальная ценность

Cheung Ek — часть национальной памяти, напоминание о важности мира, прав человека и демократии.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ FCC Phnom Penh
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pnh-fcc-phnom-penh',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Камбоджийские закуски  
- 🍹 Signature cocktails  
- ☕ Кофе с видом

## Цены

- 💰 $8–$20  
- 🧾 À la carte  
- 🆓 Wi-Fi

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси

## Коммуникация & сервис

- 🕒 07:00–23:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Карты

## Полезные нюансы

- 🌅 Лучше вечером — закат  
- 👕 Smart casual  
- ⚠️ Не шуметь — рабочая атмосфера

## Локальная ценность

FCC — мост между прошлым и настоящим, где сегодня работают писатели, дипломаты и исследователи.

## Лучшие точки для фото

- 📷 Вид на реку  
- 📷 Интерьер библиотеки  
- 🌅 Закат

## Практическая информация

- **Адрес:** 29-31 Sisowath Quay, Phnom Penh  
- **Сайт:** [https://fccphnompenh.com](https://fccphnompenh.com)

## Почему это важно?

- 🌟 Историческое место эпохи войны  
- 🌍 Атмосфера интеллектуального Пномпеня  
- 📸 Вид на закат над Тонлесапом
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Romdeng Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pnh-romdeng-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Tarantula tempura  
- 🍽️ Fish amok  
- 🍹 Лемонграсс-чай

## Цены

- 💰 $5–$15  
- 🧾 À la carte  
- 🆓 Чаевые идут на обучение

## Как добраться

- 🚶 Пешком от Riverside  
- 🚕 Такси

## Коммуникация & сервис

- 🕒 11:00–21:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Наличные предпочтительны

## Полезные нюансы

- ⚠️ Бронь не обязательна  
- 🌞 Подходит для обеда  
- 👕 Casual

## Локальная ценность

Romdeng даёт вторую возможность молодым людям, обучая их профессии и помогая выйти из бедности.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Сад  
- 🌅 Вечернее освещение

## Практическая информация

- **Адрес:** #255 Sisowath Quay, Phnom Penh  
- **Сайт:** [https://treefriendscambodia.org](https://treefriendscambodia.org)

## Почему это важно?

- 🌟 Социальный проект с вкусной едой  
- 🌍 Поддержка местных талантов  
- 📸 Уютный садовый дворик
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Topaz Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pnh-topaz-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Duck confit with Kampot pepper  
- 🍽️ Lobster amok  
- 🍷 Винная карта

## Цены

- 💰 $25–$50  
- 🧾 À la carte / tasting menu  
- 🆓 Комплимент от шефа

## Как добраться

- 🚕 Такси  
- 🗺️ Riverside

## Коммуникация & сервис

- 🕒 18:00–22:30  
- 🌐 Английский, французский  
- 📶 Wi-Fi  
- 💳 Карты

## Полезные нюансы

- ⚠️ Бронь обязательна  
- 🌙 Только ужины  
- 👕 Smart casual

## Локальная ценность

Topaz — эталон высокой кухни, сочетающий европейские техники и местные ингредиенты.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Интерьер особняка  
- 🌅 Вечернюю террасу

## Практическая информация

- **Адрес:** #227 Norodom Blvd, Phnom Penh  
- **Сайт:** [https://topaz-restaurant.com](https://topaz-restaurant.com)

## Почему это важно?

- 🌟 Одна из лучших кухонь страны  
- 🌍 Колониальная атмосфера  
- 📸 Элегантная подача
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Brown Coffee
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pnh-brown-coffee',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- ☕ Cold brew  
- 🥐 Круассаны  
- 🍰 Чизкейк

## Цены

- 💰 $2–$6  
- 🧾 Кофе и выпечка  
- 🆓 Wi-Fi

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси

## Коммуникация & сервис

- 🕒 07:00–22:00  
- 🌐 Английский  
- 📶 Быстрый Wi-Fi  
- 💳 Карты и наличные

## Полезные нюансы

- ⚠️ Может быть шумно днём  
- 🌞 Подходит для работы  
- 👕 Casual

## Локальная ценность

Brown Coffee популяризирует культуру specialty coffee среди молодёжи и профессионалов Камбоджи.

## Лучшие точки для фото

- 📷 Кофе в фирменной кружке  
- 📷 Интерьер  
- 🌅 Утренний свет у окна

## Практическая информация

- **Адрес:** #247 Sisowath Quay, Phnom Penh  
- **Instagram:** [@browncambodia](https://www.instagram.com/browncambodia)

## Почему это важно?

- 🌟 Лидер местной кофейной культуры  
- 🌍 Удобное место для работы и встреч  
- 📸 Минималистичный дизайн
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🚂 Bamboo Train
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bat-bamboo-train',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых необычных аттракционов страны  
- 🌍 Аутентичный опыт сельской Камбоджи  
- 📸 Динамичные и колоритные кадры

## Структура комплекса

- 🏛️ Сам процесс поездки  
- 🏞️ Рисовые поля вдоль маршрута  
- 🚶 Общение с местными операторами

## Билеты и посещение

- 💰 Поездка: около $5  
- 🎟️ Оплата на месте  
- 🆓 Скидки для местных

## Лучшие точки для фото

- 📷 Саму платформу в движении  
- 📷 Пейзажи рисовых полей  
- 🌅 Свет в утренние часы

## Практическая информация

- **Адрес:** Battambang Province

## Как добраться

- 🚕 Такси или тук-тук из Баттамбанга  
- 🚌 Организованные туры  
- 🗺️ Пригород Баттамбанга

## Коммуникация & сервис

- 🕒 Работает ежедневно в светлое время  
- 🌐 Общение на кхмерском, базовый английский  
- 🚻 Минимальная инфраструктура  
- 📶 Связь стабильна

## Полезные нюансы

- ⚠️ Аттракцион не для людей с боязнью скорости  
- 🌞 Лучше кататься утром  
- 👕 Удобная одежда  
- 🐾 Следить за техникой безопасности

## Локальная ценность

Бамбуковый поезд стал символом находчивости местных жителей, приспособившихся к отсутствию полноценной инфраструктуры.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛰️ Phnom Sampeau & Bat Cave
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bat-phnom-sampeau-bat-cave',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальное природное шоу на закате  
- 🌍 Важное религиозное и историческое место региона  
- 📸 Контраст храмов, скал и динамики природы

## Структура комплекса

- 🏛️ Пагоды и святилища на вершине холма  
- 🏞️ Bat Cave — пещеру летучих мышей  
- 🚶 Смотровые площадки и лестницы на вершину

## Билеты и посещение

- 💰 Вход свободный (пожертвования приветствуются)  
- 🎟️ Отдельные зоны бесплатны  
- 🆓 Бесплатно для местных жителей

## Лучшие точки для фото

- 📷 Поток летучих мышей на закате  
- 📷 Панораму окрестностей  
- 🌅 Силуэты храмов в вечернем свете

## Практическая информация

- **Адрес:** Phnom Sampeau, Battambang Province

## Как добраться

- 🚕 Такси или тук-тук из Баттамбанга (25–30 минут)  
- 🚌 В составе локальных туров  
- 🗺️ Юго-запад от центра Баттамбанга

## Коммуникация & сервис

- 🕒 Доступен ежедневно с утра до заката  
- 🌐 Локальные гиды (кхмерский, базовый английский)  
- 🚻 Туалеты и лавки у подножия  
- 📶 Связь стабильна

## Полезные нюансы

- ⚠️ Закат — самый людный период  
- 🌞 Лучше приезжать за 1–1,5 часа до заката  
- 👕 Удобная обувь обязательна  
- 🐾 Осторожно на лестницах и скалах

## Локальная ценность

Phnom Sampeau объединяет религиозную традицию, трагическую историю и природное чудо, оставаясь значимым местом для местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Kinyei Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bat-kinyei-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Завтраки и лёгкие блюда западной кухни  
- 🍽️ Домашнюю выпечку  
- 🍹 Кофе собственной обжарки

## Цены

- 💰 Средний чек: $3–7  
- 🧾 Формат: café / brunch  
- 🆓 Бесплатная вода

## Как добраться

- 🚶 Пешком из центра Баттамбанга  
- 🚕 Тук-тук или такси  
- 🗺️ Район Psar Nat

## Коммуникация & сервис

- 🕒 Открыто ежедневно: 07:00–18:00  
- 🌐 Языки персонала: английский, кхмерский  
- 📶 Бесплатный Wi-Fi  
- 💳 Наличные и карты

## Полезные нюансы

- ⚠️ Популярно утром  
- 🌞 Отлично подходит для работы с ноутбуком  
- 👕 Повседневный стиль  
- 🐾 Домашние животные не допускаются

## Локальная ценность

Kinyei Café сыграло ключевую роль в формировании современной кофейной культуры Баттамбанга и поддержке локальных фермеров.

## Лучшие точки для фото

- 📷 Чашку фирменного кофе  
- 📷 Интерьер кафе  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Battambang City Center

## Почему это важно?

- 🌟 Легендарное место камбоджийской кофейной сцены  
- 🌍 Центр притяжения экспатов, волонтёров и креативного сообщества  
- 📸 Уютный интерьер и спокойная атмосфера
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Samor Prei Kuk
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kch-samor-prei-kuk',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из древнейших храмовых ансамблей Камбоджи  
- 🌍 Объект Всемирного наследия ЮНЕСКО  
- 📸 Атмосфера уединённых руин в лесу

## Структура комплекса

- 🏛️ Кирпичные храмы Ченлы  
- 🏞️ Каменные резные элементы  
- 🚶 Прогулку по лесному комплексу

## Билеты и посещение

- 💰 Вход: около $5  
- 🎟️ Билет приобретается на месте  
- 🆓 Бесплатно для местных

## Лучшие точки для фото

- 📷 Кирпичные храмы в лесу  
- 📷 Резные порталы  
- 🌅 Рассеянный свет сквозь деревья

## Практическая информация

- **Адрес:** Kampong Thom Province

## Как добраться

- 🚕 Такси или авто из Пномпеня / Сиемреапа  
- 🚌 Частные туры  
- 🗺️ Провинция Kampong Thom

## Коммуникация & сервис

- 🕒 Открыт с 07:00 до 17:00  
- 🌐 Локальные гиды на месте  
- 🚻 Минимальная инфраструктура  
- 📶 Связь ограничена

## Полезные нюансы

- ⚠️ Мало тени — берите воду  
- 🌞 Лучше посещать утром  
- 👕 Закрытая одежда  
- 🐾 Соблюдать осторожность на тропах

## Локальная ценность

Самбор Прей Кук — колыбель кхмерской храмовой архитектуры, заложившая основы будущего Ангкора.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Cardamom Mountains
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kra-cardamom-mountains',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из крупнейших массивов нетронутых джунглей ЮВА  
- 🌍 Экотуризм и устойчивые деревенские проекты  
- 📸 Первозданные лесные пейзажи

## Структура комплекса

- 🏞️ Джунгли и речные маршруты  
- 🏛️ Деревню Chi Phat — центр экотуризма  
- 🚶 Трекинговые маршруты и водопады

## Билеты и посещение

- 💰 Стоимость зависит от маршрута и тура  
- 🎟️ Экскурсии через локальные экотур-центры  
- 🆓 Вход в деревню свободный

## Лучшие точки для фото

- 📷 Джунгли и реки  
- 📷 Деревенский быт  
- 🌅 Утренние туманы

## Практическая информация

- **Адрес:** Chi Phat, Koh Kong Province  
- **Сайт:** [https://www.chiphatecotourism.org](https://www.chiphatecotourism.org)

## Как добраться

- 🚕 Авто или трансфер из Пномпеня (5–6 часов)  
- 🚌 Комбинированный маршрут автобус + лодка  
- 🗺️ Провинция Koh Kong

## Коммуникация & сервис

- 🕒 Доступ круглогодичный (лучше в сухой сезон)  
- 🌐 Гиды: кхмерский, английский  
- 🚻 Гостевые дома и эко-лоджи  
- 📶 Связь ограничена

## Полезные нюансы

- ⚠️ Требуется предварительное планирование  
- 🌞 Лучший сезон — ноябрь–март  
- 👕 Закрытая одежда, защита от насекомых  
- 🐾 Соблюдать принципы экотуризма

## Локальная ценность

Проект Chi Phat стал примером успешного перехода от браконьерства к устойчивому экотуризму и источником дохода для местных общин.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Kbal Chhay Waterfall
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kps-kbal-chhay-waterfall',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых доступных водопадов региона  
- 🌍 Популярное место отдыха местных жителей  
- 📸 Живописные природные сцены

## Структура комплекса

- 🏞️ Каскады водопада  
- 🏛️ Лесные тропы вокруг  
- 🚶 Зоны для купания

## Билеты и посещение

- 💰 Вход: символическая плата (~$1)  
- 🎟️ Оплата на месте  
- 🆓 Бесплатно для местных

## Лучшие точки для фото

- 📷 Потоки воды  
- 📷 Зелёные джунгли  
- 🌅 Свет сквозь листву

## Практическая информация

- **Адрес:** Kbal Chhay, Sihanoukville

## Как добраться

- 🚕 Такси или байк из Сиануквиля (30 минут)  
- 🚌 Частные трансферы  
- 🗺️ Северо-восток от Сиануквиля

## Коммуникация & сервис

- 🕒 Открыт ежедневно  
- 🌐 Персонал на кхмерском  
- 🚻 Туалеты и беседки  
- 📶 Связь ограничена

## Полезные нюансы

- ⚠️ Лучшее время — сезон дождей  
- 🌞 В сухой сезон воды мало  
- 👕 Купальные принадлежности  
- 🐾 Осторожно на скользких камнях

## Локальная ценность

Kbal Chhay служит местом семейного отдыха и пикников для жителей Сиануквиля и окрестностей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝️ Koh Rong Island
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kps-koh-rong-island',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых красивых островов Камбоджи  
- 🌍 Контраст дикой природы и пляжного отдыха  
- 📸 Бирюзовая вода и белый песок

## Структура комплекса

- 🏞️ Long Beach (7 км пляжа)  
- 🏛️ Деревню Koh Touch  
- 🚶 Ночное купание с биолюминесценцией

## Билеты и посещение

- 💰 Вход свободный  
- 🎟️ Паром: ~$20 туда-обратно  
- 🆓 Бесплатно для местных

## Лучшие точки для фото

- 📷 Пляжи и воду  
- 📷 Закаты  
- 🌅 Ночной планктон

## Практическая информация

- **Адрес:** Koh Rong Island, Sihanoukville Province

## Как добраться

- 🚕 До пирса Сиануквиля  
- 🚢 Паром или скоростной катер  
- 🗺️ Сиамский залив

## Коммуникация & сервис

- 🕒 Доступен круглый год  
- 🌐 Персонал и сервис на английском  
- 🚻 Гостевые дома, рестораны  
- 📶 Интернет ограничен

## Полезные нюансы

- ⚠️ Электричество по расписанию  
- 🌞 Лучшее время — сухой сезон  
- 👕 Пляжная одежда  
- 🐾 Беречь морскую экосистему

## Локальная ценность

Koh Rong стал ключевым курортным островом Камбоджи и важным источником дохода для прибрежных общин.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Otres Beach Cafés & Bars
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kps-otres-beach-cafes-bars',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Морепродукты на гриле  
- 🍽️ Простые пляжные блюда  
- 🍹 Коктейли и кокосы

## Цены

- 💰 Средний чек: $5–12  
- 🧾 Формат: beach café / bar  
- 🆓 Вход свободный

## Как добраться

- 🚕 Такси или байк из центра Сиануквиля (15 мин)  
- 🚌 Локальные трансферы  
- 🗺️ Район Otres Beach

## Коммуникация & сервис

- 🕒 Активны с полудня до позднего вечера  
- 🌐 Английский широко распространён  
- 📶 Wi-Fi в большинстве заведений  
- 💳 В основном наличные

## Полезные нюансы

- ⚠️ В сезон дождей часть заведений закрыта  
- 🌞 Лучшее время — вечер  
- 👕 Пляжная одежда  
- 🐾 Домашние животные иногда допускаются

## Локальная ценность

Otres стал альтернативным центром отдыха после трансформации Сиануквиля и сохранил более аутентичный пляжный формат.

## Лучшие точки для фото

- 📷 Пляжные кафе  
- 📷 Закаты  
- 🌅 Атмосферу вечера у моря

## Практическая информация

- **Адрес:** Otres Beach, Sihanoukville

## Почему это важно?

- 🌟 Самый спокойный пляжный район Сиануквиля  
- 🌍 Расслабленная экспатская и туристическая сцена  
- 📸 Закаты, море и пляжная атмосфера
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 La Plantation Pepper Farm
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kmp-la-plantation-pepper-farm',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Дегустацию чёрного, красного и белого перца  
- 🍽️ Блюда с зелёным перцем  
- 🍹 Локальные напитки и специи

## Цены

- 💰 Экскурсия бесплатная  
- 🧾 Ресторан: $8–15  
- 🆓 Дегустации включены

## Как добраться

- 🚕 Такси или байк из Кампота (30 минут)  
- 🚌 Экскурсионные туры  
- 🗺️ Сельская местность Кампота

## Коммуникация & сервис

- 🕒 Открыта ежедневно: 09:00–18:00  
- 🌐 Экскурсии на английском и французском  
- 📶 Wi-Fi в кафе  
- 💳 Оплата: наличные, карты

## Полезные нюансы

- ⚠️ Лучше приезжать утром  
- 🌞 Жарко — берите воду  
- 👕 Удобная одежда  
- 🐾 Соблюдать правила фермы

## Локальная ценность

La Plantation сыграла ключевую роль в международном признании кампотского перца и развитии сельского туризма региона.

## Лучшие точки для фото

- 📷 Плантации перца  
- 📷 Дегустационные наборы  
- 🌅 Вид на холмы

## Практическая информация

- **Адрес:** Kampot Province  
- **Сайт:** [https://www.laplantation.com](https://www.laplantation.com)

## Почему это важно?

- 🌟 Всемирно известный кампотский перец  
- 🌍 Эталон агротуризма в Камбодже  
- 📸 Живописные плантации и холмы
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦀 Crab Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kmp-crab-market',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Краба с зелёным перцем  
- 🍽️ Жареные кальмары и креветки  
- 🍹 Свежие соки и кокосы

## Цены

- 💰 Блюда: $6–12  
- 🧾 Формат: рынок + рестораны  
- 🆓 Вход свободный

## Как добраться

- 🚕 Из Кампота (30 минут)  
- 🚌 Региональные трансферы  
- 🗺️ Побережье Кепа

## Коммуникация & сервис

- 🕒 Работает ежедневно, пик — днём  
- 🌐 Базовый английский  
- 📶 Связь стабильна  
- 💳 Наличные предпочтительны

## Полезные нюансы

- ⚠️ Лучше приходить до заката  
- 🌞 Жарко в полдень  
- 👕 Повседневная одежда  
- 🐾 Осторожно на мокром покрытии

## Локальная ценность

Crab Market — основа гастрономической идентичности Кепа и ключевой источник дохода для местных рыбацких семей.

## Лучшие точки для фото

- 📷 Процесс приготовления крабов  
- 📷 Рыбацкие корзины  
- 🌅 Закат над морем

## Практическая информация

- **Адрес:** Kep Crab Market, Kep

## Почему это важно?

- 🌟 Кулинарный символ Кепа  
- 🌍 Аутентичная прибрежная атмосфера  
- 📸 Рыбацкие сцены и закаты
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏞️ Kep National Park & Kep Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kmp-kep-national-park-kep-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уютная альтернатива крупным курортам  
- 🌍 Сочетание природы и моря  
- 📸 Панорамные виды на залив

## Структура комплекса

- 🏞️ Кольцевую тропу национального парка  
- 🏛️ Kep Beach  
- 🚶 Смотровые площадки над морем

## Билеты и посещение

- 💰 Вход в парк: ~$1  
- 🎟️ Пляж бесплатный  
- 🆓 Бесплатно для местных

## Лучшие точки для фото

- 📷 Вид на море с троп  
- 📷 Побережье  
- 🌅 Закаты

## Практическая информация

- **Адрес:** Kep National Park, Kep

## Как добраться

- 🚕 Из Кампота (30 минут)  
- 🚌 Региональные трансферы  
- 🗺️ Побережье Кепа

## Коммуникация & сервис

- 🕒 Открыт ежедневно  
- 🌐 Базовый английский  
- 🚻 Туалеты, кафе  
- 📶 Связь стабильна

## Полезные нюансы

- ⚠️ Жарко днём — берите воду  
- 🌞 Лучше утром или ближе к вечеру  
- 👕 Удобная обувь для троп  
- 🐾 Возможны обезьяны

## Локальная ценность

Kep National Park — важная природная зона отдыха для местных жителей и символ спокойного прибрежного образа жизни.
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
-- Blocks: 85

-- city/bat tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-battambang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'bat',
  'overview',
  'ru',
  'Обзор',
  'Баттамбанг — второй по величине город Камбоджи и один из самых аутентичных и спокойных городов страны. Он расположен на северо-западе, среди рисовых полей и сельских поселений, и известен своей колониальной архитектурой, художественной средой и размеренным ритмом жизни.

Город часто называют «культурной столицей провинциальной Камбоджи». Баттамбанг подходит для неспешных путешествий, длительного проживания, волонтёрства и знакомства с повседневной жизнью кхмеров вне туристических маршрутов.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/bat tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-battambang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'bat',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: city-center
    title: Центр города
    description: Исторический центр с колониальной архитектурой, рынками и набережной.
  - id: riverside
    title: Район у реки Сангкер
    description: Спокойная зона с прогулочными маршрутами и кафе.
  - id: wat-kor
    title: Деревня Wat Kor
    description: Традиционная кхмерская деревня с деревянными домами и сельской атмосферой.
  - id: east-bank
    title: Восточный берег
    description: Более локальные жилые кварталы и транспортные узлы.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/bat tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-battambang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'bat',
  'accommodation',
  'ru',
  'Проживание',
  'Жильё в Баттамбанге одно из самых доступных в Камбодже. Варианты включают гестхаусы, небольшие отели, апартаменты и частные дома, часто с садами.

Город особенно привлекателен для тех, кто ищет недорогую и спокойную жизнь без городской суеты и туристического давления.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/bat tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-battambang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'bat',
  'food',
  'ru',
  'Еда и кафе',
  'В Баттамбанге развито сочетание местной кхмерской кухни и небольших кафе, ориентированных на экспатов и волонтёров. Уличная еда и рынки играют ключевую роль в гастрономической жизни города.

Популярны простые семейные рестораны, кофейни третьей волны и социальные проекты, поддерживающие местную молодёжь.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/bat tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-battambang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'bat',
  'transport',
  'ru',
  'Транспорт',
  'Город компактный, основные перемещения осуществляются пешком, на велосипеде или тук-туке. Трафик спокойный, пробки редки.

Баттамбанг связан автобусным и железнодорожным сообщением с Пномпенем, Сиемреапом и пограничными районами Таиланда.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/bat tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-battambang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'bat',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат жаркий тропический. Лучшее время для посещения — с ноября по февраль, когда температура более комфортная.

В сезон дождей возможны кратковременные ливни и повышенная влажность, но город остаётся зелёным и живописным.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/bat tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-battambang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'bat',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг в Баттамбанге ограничен и ориентирован на повседневные нужды. Основные покупки совершаются на Центральном рынке и локальных рынках.

Город не является торговым центром, но предлагает доступные цены на продукты и бытовые товары.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/bat tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-battambang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'bat',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь минимальна и спокойна. Работают несколько баров и кафе, где собираются экспаты и местные жители.

После 21–22 часов город в основном затихает, что делает его комфортным для спокойного проживания.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/bat tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-battambang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'bat',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - slow_travel
  - cultural_life
  - volunteering
  - rural_cambodia',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/bat tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-battambang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'bat',
  'tips',
  'ru',
  'Практическая информация',
  'Баттамбанг считается одним из самых безопасных городов Камбоджи. Уровень преступности низкий, атмосфера дружелюбная.

Инфраструктура базовая, медицинские и сервисные услуги ограничены, поэтому город больше подходит для спокойной жизни, чем для активного бизнеса.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/bat tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-battambang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'bat',
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

-- city/bat tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-battambang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'bat',
  'budget',
  'ru',
  'Цены и бюджет',
  'Баттамбанг — один из самых дешёвых городов Камбоджи. Комфортный бюджет одного человека составляет 500–700 USD в месяц.

Аренда жилья начинается от 150–250 USD, питание и транспорт обходятся очень недорого.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kmp tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kampot.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kmp',
  'overview',
  'ru',
  'Обзор',
  'Кампот — небольшой и уютный город на юге Камбоджи, расположенный на реке Теук Чху недалеко от побережья Сиамского залива. Город известен своей расслабленной атмосферой, колониальной архитектурой и знаменитым кампотским перцем.

За последние годы Кампот стал одним из самых популярных мест для долгосрочного проживания экспатов, digital nomads и людей, ищущих спокойную жизнь на природе без отрыва от базовой инфраструктуры.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kmp tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kampot.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kmp',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: riverside
    title: Набережная Кампота
    description: Центральная зона с кафе, барами, колониальной архитектурой и прогулочной набережной.
  - id: town-center
    title: Центр города
    description: Район рынков, магазинов и локальной городской жизни.
  - id: fish-island
    title: Район Fish Island
    description: Зеленая и более уединённая зона с домами экспатов и видом на реку.
  - id: bokor-road
    title: Окрестности дороги на Бокор
    description: Район ближе к горам и национальному парку, популярный для домов с природным окружением.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kmp tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kampot.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kmp',
  'accommodation',
  'ru',
  'Проживание',
  'Кампот предлагает разнообразные варианты жилья: гестхаусы, апартаменты, бунгало и частные дома, часто с садами и видом на реку. Цены на аренду ниже, чем в Пномпене и Сиемреапе.

Город особенно привлекателен для долгосрочного проживания благодаря спокойствию, низким расходам и дружелюбному сообществу экспатов.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kmp tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kampot.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kmp',
  'food',
  'ru',
  'Еда и кафе',
  'Несмотря на небольшой размер, Кампот имеет развитую гастрономическую сцену. Здесь представлены кхмерская кухня, морепродукты, вегетарианские кафе и рестораны, ориентированные на экспатов.

Особое место занимают блюда с кампотским перцем, а также кафе и бары на набережной с видом на реку.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kmp tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kampot.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kmp',
  'transport',
  'ru',
  'Транспорт',
  'Город компактный, основные перемещения осуществляются пешком, на велосипеде или мотобайке. Тук-туки доступны, но используются реже, чем в крупных городах.

Кампот связан автобусными маршрутами с Пномпенем, Сиануквилем и Кепом.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kmp tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kampot.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kmp',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический. Лучшее время для проживания и визита — с ноября по февраль, когда погода наиболее комфортна.

В сезон дождей (май–октябрь) возможны сильные ливни, но река и окружающая природа выглядят особенно живописно.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kmp tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kampot.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kmp',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг представлен рынками и небольшими магазинами. Основные покупки — свежие продукты, фрукты, специи и кампотский перец.

За более широким выбором товаров жители ездят в Пномпень или Сиануквиль.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kmp tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kampot.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kmp',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь в Кампоте умеренная и неагрессивная. Работают бары и кафе на набережной, периодически проходят вечеринки и живые выступления.

Город ориентирован на спокойный вечерний отдых и социальное общение, а не на клубную сцену.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kmp tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kampot.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kmp',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - expat_life
  - slow_travel
  - nature_routes
  - wellness',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kmp tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kampot.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kmp',
  'tips',
  'ru',
  'Практическая информация',
  'Кампот считается безопасным городом с дружелюбной атмосферой. Основные сложности связаны с жарким климатом и возможными перебоями электроэнергии.

Интернет доступен, но скорость может уступать столичным показателям. Город хорошо подходит для удалённой работы при умеренных требованиях.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kmp tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kampot.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kmp',
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

-- city/kmp tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kampot.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kmp',
  'budget',
  'ru',
  'Цены и бюджет',
  'Кампот — один из самых доступных городов Камбоджи для проживания. Комфортный бюджет одного человека составляет 500–700 USD в месяц.

Аренда жилья начинается от 150–300 USD, питание и транспорт обходятся недорого.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kep tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kep.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kep',
  'overview',
  'ru',
  'Обзор',
  'Кеп — небольшой приморский город на юге Камбоджи, расположенный на берегу Сиамского залива недалеко от границы с Вьетнамом. В прошлом он был элитным курортом для французской и кхмерской знати, а сегодня представляет собой тихое и уединённое направление для отдыха и жизни без суеты.

Город известен своей спокойной атмосферой, природным окружением, заброшенными виллами колониальной эпохи и морепродуктами, в особенности крабами с кампотским перцем.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kep tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kep.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kep',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: crab-market
    title: Район крабового рынка
    description: Центральная зона с ресторанами морепродуктов, рынком и прогулочной набережной.
  - id: kep-beach
    title: Район пляжа Кеп
    description: Курортная часть с небольшим общественным пляжем и отелями.
  - id: national-park
    title: Район Национального парка Кеп
    description: Холмистая зелёная зона с тропами, смотровыми площадками и заброшенными виллами.
  - id: outskirts
    title: Окраины и рыбацкие деревни
    description: Малонаселённые районы с локальной жизнью и минимальной инфраструктурой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kep tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kep.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kep',
  'accommodation',
  'ru',
  'Проживание',
  'Выбор жилья в Кепе ограничен по сравнению с другими городами Камбоджи. Основные варианты — гестхаусы, небольшие отели, бунгало и редкие виллы.

Город чаще используется для краткосрочного отдыха или сезонного проживания. Для длительной жизни многие предпочитают Кампот, приезжая в Кеп на выходные.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kep tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kep.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kep',
  'food',
  'ru',
  'Еда и кафе',
  'Кеп считается гастрономической точкой Камбоджи благодаря свежим морепродуктам. Главная кулинарная специализация — крабы, приготовленные с зелёным кампотским перцем.

Вдоль крабового рынка и побережья работают рестораны и кафе с видом на море. Выбор интернациональной кухни ограничен.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kep tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kep.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kep',
  'transport',
  'ru',
  'Транспорт',
  'Город компактный, передвижение осуществляется пешком, на велосипеде или мотобайке. Общественный транспорт отсутствует.

Кеп связан дорогами с Кампотом, Пномпенем и пограничными районами Вьетнама. Также доступны лодочные рейсы на близлежащие острова.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kep tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kep.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kep',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический прибрежный. Лучшее время для посещения — с ноября по февраль, когда температура умеренная, а море спокойное.

В сезон дождей возможны ливни и повышенная влажность, но морской бриз делает климат более мягким, чем в глубине страны.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kep tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kep.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kep',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг ограничен локальными рынками и небольшими магазинами. Основные покупки — морепродукты, фрукты и продукты первой необходимости.

За более широким ассортиментом товаров жители и гости ездят в Кампот.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kep tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kep.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kep',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь практически отсутствует. После заката город быстро затихает, а основное времяпрепровождение — ужины у моря и спокойные прогулки.

Кеп ориентирован на уединённый и расслабленный отдых, а не на развлечения.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kep tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kep.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kep',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - beach_relax
  - slow_travel
  - seafood_route
  - weekend_trip',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kep tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kep.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kep',
  'tips',
  'ru',
  'Практическая информация',
  'Кеп считается безопасным и спокойным городом. Инфраструктура минимальная, медицинские и сервисные услуги ограничены.

Интернет доступен, но скорость может быть нестабильной. Город подходит для отдыха и краткосрочного проживания.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kep tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kep.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kep',
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

-- city/kep tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-kep.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kep',
  'budget',
  'ru',
  'Цены и бюджет',
  'Стоимость жизни в Кепе умеренная, но выбор жилья ограничен. Минимальный бюджет для комфортного проживания составляет 600–800 USD в месяц.

Краткосрочный отдых обычно обходится недорого благодаря доступным ценам на еду и размещение.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pnh tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-phnom-penh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pnh',
  'overview',
  'ru',
  'Обзор',
  'Пномпень — столица и крупнейший город Камбоджи, расположенный у слияния рек Меконг, Тонлесап и Бассак. Город сочетает в себе колониальное наследие Французского Индокитая, буддийские пагоды и динамичное развитие последних десятилетий.

Сегодня Пномпень — политический, экономический и культурный центр страны. Это самый «живой» и разнообразный город Камбоджи, предлагающий лучшие возможности для работы, бизнеса, образования и активной городской жизни, при этом оставаясь относительно доступным по стоимости.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pnh tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-phnom-penh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pnh',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: bkk1
    title: BKK1 (Бёнг Кенг Кан 1)
    description: Главный экспатский район с кафе, ресторанами, кондоминиумами и офисами.
  - id: riverside
    title: Риверсайд
    description: Туристический район вдоль набережной с дворцом, барами и рынками.
  - id: russian-market
    title: Район Русского рынка
    description: Молодёжный и креативный район с рынками, кафе и более доступной арендой.
  - id: tuol-kork
    title: Тул Кок
    description: Спальный район, популярный у семей и долгосрочных экспатов.
  - id: daun-penh
    title: Даун Пен
    description: Исторический и административный центр с колониальной архитектурой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pnh tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-phnom-penh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pnh',
  'accommodation',
  'ru',
  'Проживание',
  'Пномпень предлагает самый широкий выбор жилья в Камбодже: современные кондоминиумы с бассейнами и охраной, апартаменты в таунхаусах, а также виллы в спальных районах.

Цены выше, чем в провинциальных городах, но всё ещё значительно ниже, чем в большинстве столиц ЮВА. Город подходит для долгосрочного проживания, особенно для экспатов, работающих удалённо или в международных компаниях.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pnh tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-phnom-penh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pnh',
  'food',
  'ru',
  'Еда и кафе',
  'Пномпень — гастрономическая столица страны. Здесь представлены кхмерская, тайская, вьетнамская, китайская, французская и международная кухни. В городе много уличной еды, рынков и ресторанов всех ценовых категорий.

Особенно популярны кофейни третьей волны, французские пекарни и бары, ориентированные на экспатское сообщество. Качество международной кухни считается одним из лучших в Камбодже.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pnh tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-phnom-penh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pnh',
  'transport',
  'ru',
  'Транспорт',
  'Основные виды транспорта — тук-туки, мототакси и сервисы вызова через приложения (PassApp, Grab). Общественный транспорт представлен автобусами, но используется в основном местными жителями.

Движение хаотичное, пробки возможны в часы пик. В городе расположен международный аэропорт, обеспечивающий связи с основными городами региона.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pnh tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-phnom-penh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pnh',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический. Сухой сезон длится с ноября по март и считается наиболее комфортным. В апреле наблюдается экстремальная жара.

Сезон дождей продолжается с мая по октябрь. Ливни часто кратковременные, но возможны локальные подтопления в низинных районах.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pnh tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-phnom-penh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pnh',
  'shopping',
  'ru',
  'Шопинг',
  'Пномпень — лучший город Камбоджи для покупок. Здесь находятся рынки (Центральный рынок, Русский рынок), современные торговые центры (AEON Mall), супермаркеты и бутики.

Можно приобрести как дешёвые локальные товары, так и импортную продукцию. Торг уместен на рынках и в небольших магазинах.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pnh tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-phnom-penh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pnh',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь Пномпеня самая активная в стране. Работают бары, клубы, лаунжи и rooftop-бары. Наибольшая концентрация заведений — в районах BKK1, Bassac Lane и Riverside.

Город предлагает как спокойные винные и коктейльные бары, так и шумные ночные клубы, работающие до поздней ночи.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pnh tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-phnom-penh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pnh',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - relocation
  - expat_life
  - business_start
  - digital_nomad',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pnh tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-phnom-penh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pnh',
  'tips',
  'ru',
  'Практическая информация',
  'Пномпень относительно безопасен, однако распространены мелкие кражи, особенно сумок и телефонов. Рекомендуется соблюдать базовые меры осторожности и избегать тёмных улиц ночью.

Наличные доллары США широко используются наряду с камбоджийским риелем. Интернет и мобильная связь доступны, но возможны перебои электричества в жаркий сезон.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/pnh tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-phnom-penh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pnh',
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

-- city/pnh tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-phnom-penh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'pnh',
  'budget',
  'ru',
  'Цены и бюджет',
  'Пномпень — самый дорогой город Камбоджи, но остаётся доступным по мировым меркам. Средняя стоимость жизни одного человека составляет 900–1200 USD в месяц.

Аренда квартиры начинается от 300–400 USD, питание и транспорт обходятся недорого, а качество жизни зависит от выбранного района и стиля проживания.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/rep tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-siem-reap.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'rep',
  'overview',
  'ru',
  'Обзор',
  'Сиемреап — туристическая столица Камбоджи и главный центр притяжения путешественников благодаря храмовому комплексу Ангкор. Город сочетает в себе курортную атмосферу, развитую туристическую инфраструктуру и спокойный ритм жизни.

Несмотря на статус туристического хаба, Сиемреап остаётся компактным и уютным городом, подходящим не только для короткого визита, но и для длительного проживания, особенно для тех, кто ценит баланс между комфортом и аутентичностью.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/rep tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-siem-reap.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'rep',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: old-town
    title: Старый город
    description: Исторический центр с колониальной застройкой, рынками и туристической инфраструктурой.
  - id: wat-bo
    title: Район Wat Bo
    description: Более спокойная и жилaя зона, популярная среди экспатов и долгосрочных гостей.
  - id: pub-street
    title: Pub Street и окрестности
    description: Сердце туристической и ночной жизни города.
  - id: highway-6
    title: Район шоссе №6
    description: Современная зона с отелями, торговыми центрами и транспортной доступностью.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/rep tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-siem-reap.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'rep',
  'accommodation',
  'ru',
  'Проживание',
  'Сиемреап предлагает широкий выбор жилья: гестхаусы, апартаменты, бутик-отели и частные дома с садами. Цены заметно ниже столичных, а уровень комфорта часто выше за те же деньги.

Город особенно популярен среди зимовщиков, digital nomads и экспатов, предпочитающих более спокойную и зелёную среду проживания.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/rep tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-siem-reap.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'rep',
  'food',
  'ru',
  'Еда и кафе',
  'Гастрономическая сцена Сиемреапа разнообразна и ориентирована на международную аудиторию. Здесь представлены кхмерская, тайская, вьетнамская, французская, итальянская и вегетарианская кухни.

Особенно популярны кафе для завтраков, кофейни и рестораны с видом на реку. Уровень еды высок, а цены остаются доступными.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/rep tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-siem-reap.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'rep',
  'transport',
  'ru',
  'Транспорт',
  'Город компактный, большинство перемещений осуществляется пешком, на велосипеде или тук-туке. Также доступны мототакси и сервисы заказа поездок.

В Сиемреапе расположен международный аэропорт, связывающий город с Пномпенем, Бангкоком и другими направлениями региона.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/rep tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-siem-reap.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'rep',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический. Лучшее время для посещения — с ноября по февраль, когда температура комфортна, а осадков немного.

С марта по апрель стоит сильная жара. В сезон дождей (май–октябрь) город становится особенно зелёным, но возможны ливни.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/rep tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-siem-reap.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'rep',
  'shopping',
  'ru',
  'Шопинг',
  'Основные торговые зоны — Старый рынок (Phsar Chas), ночные рынки и туристические улицы. Здесь продаются сувениры, текстиль, изделия ручной работы и продукты.

Также в городе есть супермаркеты и небольшие торговые центры, ориентированные на экспатов.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/rep tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-siem-reap.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'rep',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь Сиемреапа сосредоточена вокруг Pub Street. Здесь работают бары, клубы и рестораны, ориентированные на туристов.

За пределами центра город вечером становится тихим и спокойным, что делает его комфортным для проживания.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/rep tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-siem-reap.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'rep',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - angkor_visit
  - long_stay
  - slow_travel
  - digital_nomad',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/rep tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-siem-reap.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'rep',
  'tips',
  'ru',
  'Практическая информация',
  'Сиемреап считается одним из самых безопасных городов Камбоджи. Туристическая полиция присутствует в центре, уровень преступности низкий.

Наличные деньги предпочтительны, но в туристических заведениях принимаются карты. Интернет доступен и стабилен.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/rep tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-siem-reap.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'rep',
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

-- city/rep tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-siem-reap.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'rep',
  'budget',
  'ru',
  'Цены и бюджет',
  'Сиемреап дешевле Пномпеня примерно на 20–30%. Комфортный бюджет одного человека составляет 700–900 USD в месяц.

Аренда жилья начинается от 200–300 USD, питание и транспорт обходятся недорого, особенно при долгосрочном проживании.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kps tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-sihanoukville.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kps',
  'overview',
  'ru',
  'Обзор',
  'Сиануквиль — главный портовый и курортный город Камбоджи, расположенный на побережье Сиамского залива. Исторически он развивался как пляжное направление и морские ворота страны, а в последние годы пережил резкие изменения из-за масштабных иностранных инвестиций.

Сегодня Сиануквиль находится в переходном состоянии: часть города застроена современными отелями и казино, при этом сохраняется доступ к пляжам и островам. Для большинства путешественников город служит транзитной точкой на острова Ко Ронг и Ко Ронг Самлоем.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kps tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-sihanoukville.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kps',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: ochheuteal
    title: Очутель и Серендипити
    description: Центральная туристическая зона с пляжами, пирсом и инфраструктурой.
  - id: otres
    title: Отрес
    description: Более спокойный пляжный район, популярный среди экспатов и длительных гостей.
  - id: victory-hill
    title: Victory Hill
    description: Район у порта с гостиницами и видом на залив.
  - id: city-center
    title: Центр города
    description: Административная и жилая часть с рынками и сервисами.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kps tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-sihanoukville.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kps',
  'accommodation',
  'ru',
  'Проживание',
  'Жилищный фонд Сиануквиля неоднороден: от бюджетных гестхаусов и бунгало до новых кондоминиумов и отелей. Цены колеблются в зависимости от района и состояния инфраструктуры.

Многие экспаты предпочитают селиться в районе Отрес или используют Сиануквиль как временную базу перед поездкой на острова.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kps tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-sihanoukville.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kps',
  'food',
  'ru',
  'Еда и кафе',
  'В городе представлены кхмерская, китайская и международная кухни. Особенно популярны блюда из морепродуктов: рыба, креветки, кальмары и крабы.

В туристических районах работают кафе и рестораны западного формата, однако качество сервиса и стабильность заведений могут сильно различаться.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kps tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-sihanoukville.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kps',
  'transport',
  'ru',
  'Транспорт',
  'Основные способы передвижения — тук-туки и мотобайки. Общественный транспорт практически отсутствует.

Из Сиануквиля отправляются паромы и скоростные лодки на острова Ко Ронг и Ко Ронг Самлоем. Город связан автомобильными маршрутами с Пномпенем и Кампотом.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kps tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-sihanoukville.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kps',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический прибрежный. Лучшее время для посещения — с ноября по февраль, когда море спокойное и погода комфортная.

В сезон дождей (май–октябрь) возможны шторма и отмены морских рейсов, особенно в сентябре.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kps tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-sihanoukville.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kps',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг представлен в основном рынками и небольшими магазинами. Можно приобрести свежие морепродукты, фрукты и базовые товары.

Современные торговые центры присутствуют, но выбор ограничен по сравнению с Пномпенем.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kps tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-sihanoukville.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kps',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь Сиануквиля существенно сократилась по сравнению с прошлым. Основные активности сосредоточены в казино и отдельных барах.

Более активная вечерняя жизнь доступна на островах, куда многие отправляются из города.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kps tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-sihanoukville.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kps',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - island_hopping
  - beach_travel
  - transit_city',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kps tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-sihanoukville.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kps',
  'tips',
  'ru',
  'Практическая информация',
  'Город требует повышенной осторожности: рекомендуется избегать ночных прогулок по пустынным районам и внимательно относиться к личным вещам.

Инфраструктура нестабильна, возможны перебои с электричеством и водой. Сиануквиль лучше рассматривать как временную остановку, а не основное место проживания.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/kps tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-sihanoukville.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kps',
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

-- city/kps tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/city-sihanoukville.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'kps',
  'budget',
  'ru',
  'Цены и бюджет',
  'Стоимость жизни в Сиануквиле варьируется. Минимальный бюджет начинается от 700–900 USD в месяц, однако качество жизни сильно зависит от выбранного района и жилья.

Краткосрочное пребывание чаще всего используется как транзит перед поездкой на острова.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/kh tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
  'overview',
  'ru',
  'Обзор',
  'Камбоджа — страна Юго-Восточной Азии с древней историей, уникальным культурным наследием и одним из самых низких уровней стоимости жизни в регионе. Она известна храмовым комплексом Ангкор, буддийской традицией и спокойным, неторопливым ритмом жизни.

Сегодня Камбоджа привлекает путешественников, цифровых кочевников, экспатов и предпринимателей благодаря тёплому климату, простому визовому режиму и относительной свободе в образе жизни. Это направление подойдёт тем, кто ищет аутентичную Азию без избыточного туризма и формальностей.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/kh tab=gallery (Фотогалерея) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
  'gallery',
  'ru',
  'Фотогалерея',
  '@gallery:
  - cambodia_angkor_wat.jpg
  - cambodia_phnom_penh_riverside.jpg
  - cambodia_tonle_sap.jpg
  - cambodia_kampot_river.jpg
  - cambodia_koh_rong.jpg',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/kh tab=map (Карта) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
  'map',
  'ru',
  'Карта',
  '@map:
  center: [12.5657, 104.9910]
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

-- country/kh tab=weather (Погода и климат) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
  'weather',
  'ru',
  'Погода и климат',
  'Камбоджа расположена в тропическом климатическом поясе и имеет муссонный климат с выраженной сезонностью. Температуры круглый год остаются высокими, редко опускаясь ниже +20 °C.

### Сезоны
- Сухой сезон: ноябрь — апрель (лучшее время для путешествий и проживания)
- Сезон дождей: май — октябрь (высокая влажность, тропические ливни)

Самые комфортные месяцы — декабрь и январь. В апреле может быть экстремальная жара.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/kh tab=history (История) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
  'history',
  'ru',
  'История',
  'История Камбоджи насчитывает более двух тысяч лет. В IX–XV веках здесь существовала могущественная Кхмерская империя Ангкор, оставившая после себя один из величайших архитектурных комплексов мира — Ангкор-Ват.

В XIX веке страна стала частью Французского Индокитая, а в 1953 году обрела независимость. Самым трагическим периодом XX века стал режим «красных кхмеров» (1975–1979), приведший к гибели миллионов людей и разрушению общества.

С начала 1990-х годов Камбоджа восстанавливается, сохраняя монархию и постепенно развивая экономику. Сегодня страна сочетает память о прошлом с ориентацией на будущее.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/kh tab=geography (География) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
  'geography',
  'ru',
  'География',
  'Камбоджа расположена в южной части полуострова Индокитай. Основу рельефа составляет центральная равнина реки Меконг и озера Тонлесап — крупнейшего пресноводного озера ЮВА.

На юго-западе находятся Кардамоновые горы и побережье Сиамского залива с островами. Северо-восток страны — более прохладные и малонаселённые плато с джунглями и водопадами.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/kh tab=culture (Культура) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
  'culture',
  'ru',
  'Культура',
  'Культура Камбоджи глубоко связана с буддизмом тхеравады, который исповедует большинство населения. Пагоды являются центрами духовной и социальной жизни.

Национальное искусство включает танцы апсара, кхмерскую музыку, резьбу по дереву и ткачество шёлка. Несмотря на исторические трагедии, кхмерская культура сохранила свою целостность и продолжает активно развиваться.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/kh tab=living (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
  'living',
  'ru',
  'Проживание',
  'Камбоджа предлагает широкий выбор жилья: от бюджетных гестхаусов до современных апартаментов и вилл. В провинциальных городах аренда значительно дешевле, чем в столице.

Страна популярна для долгосрочного проживания благодаря низким расходам, простоте аренды и гибкости условий. Иностранцы чаще арендуют жильё, чем покупают недвижимость.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/kh tab=visas (Визы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
  'visas',
  'ru',
  'Визы',
  'Камбоджа известна одним из самых лояльных визовых режимов в регионе.

Граждане РФ и большинства стран могут получить визу по прибытии или электронную визу сроком на 30 дней. Также доступна ординарная (E-class) виза с возможностью продления на 6 или 12 месяцев, популярная среди экспатов и digital nomads.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/kh tab=business (Бизнес) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
  'business',
  'ru',
  'Бизнес',
  'Экономика Камбоджи развивается за счёт туризма, швейной промышленности, строительства и сельского хозяйства. Страна открыта для иностранных инвестиций, регистрация бизнеса относительно проста.

Популярные направления для малого бизнеса: кафе, гостиницы, сервисы для экспатов, агротуризм. При этом следует учитывать риски, связанные с бюрократией и слабой правовой системой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/kh tab=phrasebook (Разговорник) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
  'phrasebook',
  'ru',
  'Разговорник',
  '- Здравствуйте — Suosdei
- Спасибо — Aw khun
- Пожалуйста — Saum
- Извините — Som toh
- Сколько стоит? — Thlai pohnmaan?
- Где находится …? — Nau ae na …?',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/kh tab=reviews (Отзывы экспатов) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
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

-- country/kh tab=calculator (Калькулятор стоимости) from E:/projects/work_go2asia/20251216go2asia/content/atlas/cambodia/country-cambodia.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'kh',
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


