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
