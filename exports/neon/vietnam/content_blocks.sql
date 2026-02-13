-- Content Blocks UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Content block for: 🏛️ Imperial City Hue
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-imperial-city-hue',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Единственный вьетнамский императорский город, сохранившийся в таком масштабе  
- 🏯 Сердце политической и духовной жизни Вьетнама XIX–начала XX века  
- 📸 Впечатляющее сочетание дворцов, ворот, рвов и садов

## Структура комплекса

- 🏛️ Ворота Ngo Mon и площадь церемоний  
- 👑 Тронный зал Thai Hoa  
- 🧱 Запретный Пурпурный город (Forbidden Purple City)  
- 🌿 Императорские сады и павильоны

## Билеты и посещение

- 💰 Входной билет: ~150 000 VND  
- 🎟️ Доступен комбинированный билет с мавзолеями  
- ⏱️ Осмотр: минимум 2–3 часа

## Практические советы

- 🌞 Лучшее время — утро или поздний день  
- 👟 Территория большая — удобная обувь обязательна  
- ☂️ Летом берите воду и головной убор

## Историческая справка

Цитадель строилась с 1804 года при императоре Зя Лонге по принципам фэншуй и с ориентацией на Запретный город Пекина. Во время войны 1968 года комплекс сильно пострадал, и восстановление продолжается до сих пор.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌸 Perfume River
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-perfume-river',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌸 Символ романтического и спокойного Хюэ  
- 🚤 Основной маршрут лодочных прогулок  
- 🌅 Лучшие закаты города

## Структура комплекса

- 🌉 Вид на мост Truong Tien  
- 🚣 Прогулку на «драконьей лодке»  
- 🎶 Вечерние концерты традиционной музыки на воде

## Билеты и посещение

- 💰 Прогулка на лодке: ~100 000–150 000 VND  
- 🆓 Пешие прогулки по набережной — бесплатно

## Практические советы

- 🌇 Особенно красиво вечером  
- 📷 Отличное место для фото без толп  
- 🧘 Подходит для спокойных прогулок

## Историческая справка

Название реки связано с ароматами трав и цветов, которые раньше смывались в воду с горных склонов. Река веками служила транспортной и ритуальной артерией императорской столицы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Thien Mu Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-thien-mu-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛕 Один из духовных символов Центрального Вьетнама  
- 🌊 Красивое расположение у реки  
- 📸 Иконическая семиярусная башня

## Структура комплекса

- 🗼 Башню Phuoc Duyen  
- 🔔 Огромный бронзовый колокол  
- 🚗 Автомобиль монаха Тхить Куанг Дыка

## Билеты и посещение

- 🆓 Вход бесплатный  
- ⏱️ Осмотр: 30–60 минут

## Практические советы

- 👕 Скромная одежда обязательна  
- 🧘 Тихое и действующее религиозное место  
- 🚤 Можно совместить с лодочной прогулкой

## Историческая справка

Пагода основана в 1601 году и связана с буддийским движением протеста 1960-х годов. Отсюда происходил монах Тхить Куанг Дык, совершивший самосожжение в Сайгоне.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌉 Truong Tien Bridge
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-truong-tien-bridge',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌉 Архитектурный символ города  
- 🌈 Эффектная ночная подсветка  
- 📸 Классический вид Хюэ

## Структура комплекса

- 🌃 Мост вечером с подсветкой  
- 🚶 Пешую прогулку по мосту  
- 📷 Панораму реки и набережных

## Билеты и посещение

- 🆓 Бесплатно, круглосуточно

## Практические советы

- 🌇 Лучшее время — после заката  
- 🚴 Удобен для пеших и велопрогулок

## Историческая справка

Построен в конце XIX века французами, мост пережил тайфуны, войны и реконструкции и стал неотъемлемой частью городского пейзажа.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏞️ Ngu Binh Viewpoint
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-ngu-binh-viewpoint',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏞️ Панорамный вид на город и реку  
- 🌄 Популярное место рассветов и закатов  
- 🧘 Тихая природная атмосфера

## Структура комплекса

- 🌅 Панораму Хюэ с вершины  
- 🌲 Сосновые тропы  
- 📷 Вид на цитадель и равнины

## Билеты и посещение

- 🆓 Бесплатно  
- ⏱️ Подъём: 15–20 минут пешком

## Практические советы

- 🌞 Лучше приходить рано утром или вечером  
- 💧 Возьмите воду  
- 👟 Удобная обувь

## Историческая справка

Гора играла ключевую роль в фэншуй-планировке императорского Хюэ и вместе с Парфюмной рекой формировала «идеальный» ландшафт столицы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🧘 Tu Hieu Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-tu-hieu-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🧘 Одно из самых спокойных и медитативных мест региона  
- 🌲 Расположена в сосновом лесу вдали от туристической суеты  
- 🕊️ Важный духовный центр современного буддизма

## Структура комплекса

- 🛕 Главный храмовый зал  
- 🌿 Лотосовый пруд и сосновые аллеи  
- 🪦 Кладбище евнухов династии Нгуен

## Билеты и посещение

- 🆓 Вход бесплатный  
- ⏱️ Осмотр: 45–90 минут

## Практические советы

- 👕 Скромная одежда обязательна  
- 🤫 Соблюдайте тишину — действующий монастырь  
- 🚕 Удобнее добираться на байке или такси

## Историческая справка

Пагода возникла в XIX веке как келья монаха, ухаживавшего за матерью. Позднее стала значимым центром буддийского образования и практики; здесь провёл последние годы жизни Тхить Нят Хань.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏯 Nam Giao Altar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-nam-giao-altar',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏯 Уникальный государственный культовый объект  
- 🧭 Редкий пример императорской ритуальной архитектуры  
- 🌳 Просторный комплекс в сосновом лесу

## Структура комплекса

- 🟦 Трёхъярусный алтарь Nam Giao  
- 🌲 Императорский лес вокруг комплекса  
- 🏛️ Остатки ритуальных павильонов

## Билеты и посещение

- 💰 Входной билет: ~50 000 VND  
- ⏱️ Осмотр: 45–60 минут

## Практические советы

- 🌞 Лучше посещать утром или ближе к вечеру  
- 👟 Территория большая — удобная обувь  
- 📷 Хорошо подходит для спокойных прогулок

## Историческая справка

Алтарь построен в 1806 году и использовался для важнейших императорских церемоний вплоть до 1945 года. Сегодня входит в комплекс памятников Хюэ под охраной ЮНЕСКО.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌄 Vong Canh Hill
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-vong-canh-hill',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌄 Одно из лучших мест для заката в Хюэ  
- 🌲 Тихая природная атмосфера  
- 📸 Отличная точка для фотосъёмки

## Структура комплекса

- 🌅 Вид на излучину реки Хыонг  
- 🌳 Сосновые склоны и тропы  
- 🪦 Гробницы императоров в окрестностях

## Билеты и посещение

- 🆓 Вход свободный  
- ⏱️ Осмотр: 30–45 минут

## Практические советы

- 🌞 Лучшее время — рассвет или закат  
- 🧺 Подходит для пикника  
- 🚕 Удобнее ехать на байке

## Историческая справка

Холм служил излюбленным местом отдыха императоров династии Нгуен, а в XX веке использовался как наблюдательный пункт.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌅 Tam Giang Lagoon
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-tam-giang-lagoon',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌅 Одни из самых красивых закатов региона  
- 🎣 Аутентичная жизнь рыбацких деревень  
- 📸 Широкие открытые пейзажи

## Структура комплекса

- 🚤 Лодочные прогулки по лагуне  
- 🛶 Рыбацкие ловушки и дома на воде  
- 🌄 Закат над водой

## Билеты и посещение

- 💰 Лодочная прогулка: ~100 000–200 000 VND  
- 🆓 Свободный доступ к берегам

## Практические советы

- 🌞 Лучше приезжать ближе к вечеру  
- 📷 Отлично для фототуров  
- 🚗 Удобнее добираться на машине или байке

## Историческая справка

Лагуна образована в месте слияния рек Хыонг, Бо и О-Лау и на протяжении веков была важным источником рыбы и соли для региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 Bach Ma National Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-bach-ma-national-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌳 Прохлада и зелень в жарком климате  
- 💦 Впечатляющие водопады и леса  
- 🥾 Отличные маршруты для треккинга

## Структура комплекса

- 🌄 Смотровую площадку Hai Vong Dai  
- 💦 Водопад Do Quyen  
- 🏞️ Озёра Ngu Ho

## Билеты и посещение

- 💰 Входной билет: ~60 000 VND  
- ⏱️ Осмотр: полдня или полный день

## Практические советы

- 🌦️ Погода меняется быстро — берите куртку  
- 🥾 Обувь для треккинга обязательна  
- 🚙 Часть маршрутов доступна только с транспортом

## Историческая справка

В начале XX века французские колонисты использовали плато Бах Ма как горный курорт. Сегодня это одна из самых биологически разнообразных зон Центрального Вьетнама.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ The Lab Coffee
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-the-lab-coffee',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- ☕ Одна из лучших specialty-кофеен города  
- 💻 Удобно для работы и встреч  
- 🌱 Фокус на локальные зёрна Центрального Вьетнама

## Коммуникация & сервис

- 🌐 Английский — базовый  
- 📶 Быстрый Wi-Fi, розетки у стен  
- 🪑 Тихие столики для работы

## Локальная ценность

The Lab Coffee представляет «новую волну» кофейной культуры Хюэ — без туристического шума, с уважением к вкусу и ремеслу.

## 🔵 Что попробовать обязательно

- V60 / Filter Coffee с локальным зерном  
- Cold Brew (18 часов)  
- Эспрессо без горечи и перекрывающих вкусов

## 🟢 Цены

- 💰 30 000–80 000 VND за напиток  
- ☕ Средний чек: ~60 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🧂 Cà Phê Muối 142
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-ca-phe-muoi-142',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🧂 Уникальный напиток, придуманный именно здесь  
- 🏠 Аутентичная атмосфера без туристического глянца  
- 📍 Историческое место гастрокультуры города

## Коммуникация & сервис

- 🗣 Персонал говорит только по-вьетнамски  
- 💵 Только наличные  
- 🪑 Простые пластиковые столики

## Локальная ценность

Salt Coffee — пример того, как локальная идея из Хюэ стала национальным трендом, сохранив оригинал именно здесь.

## 🔵 Что попробовать обязательно

- Cà phê muối — кофе с солёно-сливочной пенкой  
- Cà phê sữa đá — классика по-хюэцки

## 🟢 Цены

- 💰 15 000–30 000 VND  
- ☕ Средний чек: ~25 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Quán Hanh
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-quan-hanh',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍽️ Лучший способ попробовать кухню Хюэ за один приём  
- 👨‍👩‍👧 Любим местными и туристами  
- ⚡ Быстрое обслуживание и живой ритм

## Коммуникация & сервис

- 🌐 Базовый английский, меню с фото  
- 💵 В основном наличные  
- 🪑 Простая, но удобная посадка

## Локальная ценность

Quán Hanh демократизирует императорскую кухню Хюэ, делая её доступной и понятной для всех.

## 🔵 Что попробовать обязательно

- Nem lụi (свинина на лимоннике)  
- Bánh bèo / bánh nậm / bánh lọc (ассорти)  
- Сет «Taste of Hue»

## 🟢 Цены

- 💰 100 000–150 000 VND на человека  
- 🍽️ Сеты — лучший выбор
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Madam Thu Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-madam-thu-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍜 Отличный баланс аутентичности и комфорта  
- 🌟 Подходит для первого знакомства с кухней Хюэ  
- 🪔 Приятный интерьер в традиционном стиле

## Коммуникация & сервис

- 🌐 Хороший английский  
- 💳 Принимают карты (иногда комиссия)  
- ❄️ Кондиционированные залы

## Локальная ценность

Madam Thu показывает, как традиционная кухня Хюэ адаптируется под путешественников, не теряя характера.

## 🔵 Что попробовать обязательно

- Bún bò Huế  
- Ассорти хюэцких закусок  
- Nem lụi

## 🟢 Цены

- 💰 150 000–250 000 VND  
- 🍽️ Средний чек с напитком
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥬 Lien Hoa Vegetarian
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-lien-hoa-vegetarian',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🥬 Легендарное место буддийской кухни Хюэ  
- 🌿 Спокойная атмосфера садового дома  
- 🌱 Полностью вегетарианское меню

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Только наличные  
- 🪑 Залы и столики в саду

## Локальная ценность

Lien Hoa отражает буддийскую философию Хюэ и показывает, что местная кухня может быть глубокой и разнообразной без мяса.

## 🔵 Что попробовать обязательно

- Cơm sen Huế (рис в листе лотоса)  
- Вегетарианские версии блюд Хюэ  
- Ассорти для компании

## 🟢 Цены

- 💰 50 000–100 000 VND  
- 🥗 Отличное соотношение цена/качество
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍺 Imperial Craft Bia Brewpub
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-imperial-craft-bia-brewpub',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍺 Единственный brewpub в городе с собственным производством  
- 🌍 Интернациональная публика и дружелюбная атмосфера  
- 🍕 Хорошая западная кухня к пиву

## Коммуникация & сервис

- 🌐 Свободный английский  
- 📶 Быстрый Wi-Fi, розетки у стен  
- 🅿️ Небольшая парковка для байков

## Локальная ценность

Imperial Craft Bia показывает современное лицо Хюэ — город традиций, который открывается новым форматам и культуре крафта.

## 🔵 Что попробовать обязательно

- Дегустационный сет из 4–5 сортов  
- IPA и сезонные экспериментальные сорта  
- Пицца на закваске или бургеры

## 🟢 Цены

- 🍺 Пиво: 60 000–90 000 VND  
- 🍕 Основные блюда: 150 000–220 000 VND  
- 💰 Средний чек: 250 000–400 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎉 Brown Eyes Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-brown-eyes-bar',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🎉 Легенда ночной жизни Хюэ  
- 🌍 Место знакомств путешественников  
- 🕺 Танцы, игры и свободная атмосфера

## Коммуникация & сервис

- 🌐 Английский без проблем  
- 📶 Wi-Fi есть, но вторичен  
- 🔊 Громкая музыка, активный движ

## Локальная ценность

Brown Eyes Bar — редкий пример того, как тихий исторический город по ночам превращается в точку международной тусовки.

## 🔵 Что попробовать обязательно

- Коктейли “Bucket” на компанию  
- Шоты по акциям бара  
- Местное пиво Huda

## 🟢 Цены

- 🍺 Пиво: ~25 000 VND  
- 🍹 Коктейли: 70 000–100 000 VND  
- 🪣 Bucket: 150 000–180 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Dong Ba Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-dong-ba-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🛍️ Самый аутентичный рынок города  
- 🍜 Лучшее место попробовать локальный стрит-фуд  
- 👀 Наблюдение за повседневной жизнью Хюэ

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Только наличные  
- 🎒 Будьте внимательны к вещам

## Локальная ценность

Dong Ba — не туристический аттракцион, а живое сердце торговли Хюэ, работающее без перерыва уже более века.

## 🔵 Что попробовать обязательно

- Bún bò Huế на фуд-корте  
- Bánh bèo и bánh lọc  
- Chè Huế (сладкие десерты)

## 🟢 Цены

- 🍽️ Уличная еда: 15 000–40 000 VND  
- 🛒 Покупки и сувениры — по договорённости
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Hue Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-hue-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌙 Атмосферное место для вечерней прогулки  
- 🍢 Уличная еда и недорогие сувениры  
- 🎶 Живая музыка и городская активность

## Коммуникация & сервис

- 🌐 Базовый английский  
- 💵 Наличные  
- 🚶 Удобно для неспешных прогулок

## Локальная ценность

Ночной рынок показывает Хюэ как живой современный город, где культурное наследие соседствует с повседневной жизнью.

## 🔵 Что попробовать обязательно

- Закуски из рисовой муки  
- Морепродукты на гриле  
- Местные сладости и напитки

## 🟢 Цены

- 🍽️ Еда: 20 000–50 000 VND  
- 🛍️ Сувениры — по ситуации
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏮 Hoi An Ancient Town
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-hoi-an-ancient-town',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏮 Один из самых атмосферных городов Юго-Восточной Азии  
- 🌍 Уникальное сочетание вьетнамской, китайской и японской архитектуры  
- 🌙 Вечерняя иллюминация фонарей — визитная карточка Хойана

## Структура комплекса

- 🏘️ Старые торговые дома и узкие улочки  
- 🏮 Фонарные улицы у реки Thu Bồn  
- 🎨 Мастерские и галереи ремёсел

## Билеты и посещение

- 💰 Билет в старый город: ~120 000 VND (включает посещение 5 объектов)  
- 🕒 Днём свободный проход по улицам, билеты нужны для музеев и домов

## Практические советы

- 🌞 Днём жарко — лучше гулять утром и вечером  
- 👟 Удобная обувь для брусчатки  
- 📷 Лучшее время для фото — после заката

## Историческая справка

Хойан был крупнейшим портом Центрального Вьетнама, связывавшим Китай, Японию и Европу. После заиливания реки город сохранился практически без перестроек.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌉 Japanese Covered Bridge
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-japanese-covered-bridge',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌉 Самый узнаваемый объект Хойана  
- 🇯🇵 Редкий пример японского влияния во Вьетнаме  
- 📸 Отличная точка для фото

## Структура комплекса

- 🏯 Храм на мосту  
- 🐒 Каменные статуи обезьяны и собаки  
- 🏘️ Вид на старый квартал

## Билеты и посещение

- 🎟️ Входит в билет старого города  
- 🕒 Доступен круглосуточно (осмотр внутри — днём)

## Практические советы

- 🌅 Лучше приходить рано утром  
- 🌙 Вечером многолюдно  
- 📷 Снимайте с боковых ракурсов

## Историческая справка

Мост был построен для защиты города от злых духов и служил местом молитвы для японских торговцев.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏯 Assembly Halls of Hoi An
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-assembly-halls-of-hoi-an',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏯 Богатый декор и символика  
- 🇨🇳 Следы китайской диаспоры  
- 📷 Красочные интерьеры

## Структура комплекса

- 🐉 Ассамблею Фуцзянь (Phuc Kien)  
- 🏮 Ассамблею Кантон  
- 🌺 Внутренние дворы и алтари

## Билеты и посещение

- 🎟️ Вход включён в билет старого города  
- ⏱️ Осмотр: 20–40 минут

## Практические советы

- 👕 Скромная одежда  
- 📷 Обратите внимание на детали декора  
- 🌞 Хорошо заходить днём

## Историческая справка

Ассамблеи служили религиозными и социальными центрами китайских общин, игравших ключевую роль в торговле Хойана.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏠 Old Merchant Houses
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-old-merchant-houses',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏠 Возможность увидеть быт старого Хойана  
- 📜 Истории торговых семей  
- 🌊 Метки прошлых наводнений

## Структура комплекса

- 🏡 Дом Тан Ки (Tan Ky)  
- 🏡 Дом Дык Ан (Duc An)  
- 🛋️ Мебель и алтари

## Билеты и посещение

- 🎟️ Вход включён в билет старого города  
- ⏱️ Осмотр: 15–30 минут

## Практические советы

- 🤫 В домах тихо — уважайте жильцов  
- 📷 Не используйте вспышку  
- 🌞 Лучше заходить вне пика

## Историческая справка

Дома строились с учётом наводнений и сочетали вьетнамские, китайские и японские элементы архитектуры.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Hoi An Central Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-hoi-an-central-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🍜 Лучшее место для знакомства с местной кухней  
- 🛍️ Атмосфера настоящего рынка  
- 📸 Яркие сцены повседневности

## Структура комплекса

- 🍽️ Зоны стрит-фуда  
- 🧺 Лавки с пряностями и фруктами  
- 🐟 Рыбные ряды у реки

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Лучше утром или до обеда

## Практические советы

- 💵 Наличные и мелкие купюры  
- 🎒 Следите за вещами  
- 🍴 Выбирайте точки с очередями

## Историческая справка

Рынок всегда был экономическим ядром Хойана, обслуживая порт и торговые кварталы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏮 Hoi An Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-hoi-an-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏮 Самое атмосферное место Хойана вечером  
- 🌙 Фонари, уличная еда и прогулки у реки  
- 📸 Отличная локация для ночных фото

## Структура комплекса

- 🏮 Ряды фонарей и сувениров  
- 🍢 Стрит-фуд с локальными закусками  
- 🚶 Прогулку по мостам и набережной

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Работает ежедневно с ~17:00 до позднего вечера

## Практические советы

- 💵 Наличные для покупок  
- 🌙 Лучше приходить после заката  
- 🎒 Следите за вещами в толпе

## Историческая справка

Ночной рынок возник как продолжение торговых традиций Хойана и стал современной формой вечерней городской жизни.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌱 Tra Que Vegetable Village
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-tra-que-vegetable-village',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌱 Знакомство с сельской жизнью Вьетнама  
- 🚲 Популярный маршрут для велопрогулок  
- 👨‍🌾 Интерактивные фермерские активности

## Структура комплекса

- 🌿 Огородные поля и грядки  
- 🧑‍🌾 Мастер-классы по посадке  
- 🍽️ Домашние обеды у фермеров

## Билеты и посещение

- 💰 Экскурсии: ~30 000–50 000 VND  
- 🚲 Часто посещают в составе велотуров

## Практические советы

- 🌞 Лучше приезжать утром  
- 👟 Закрытая обувь  
- 🚲 Отлично комбинируется со старым городом

## Историческая справка

Тра Куэ снабжала Хойан свежими травами на протяжении веков и сохранила традиционные методы земледелия.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏺 Thanh Ha Pottery Village
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-thanh-ha-pottery-village',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏺 Аутентичные ремесленные традиции  
- 👐 Возможность поработать с глиной  
- 📷 Интересные фото и мастерские

## Структура комплекса

- 🏺 Гончарные мастерские  
- 🎨 Музей керамики  
- 🛍️ Магазины изделий ручной работы

## Билеты и посещение

- 💰 Вход: ~35 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 🧑‍🎨 Подходит для семей  
- 🎁 Отличное место для сувениров  
- 🚲 Удобно добираться на велосипеде

## Историческая справка

Деревня возникла для снабжения портового Хойана керамикой и строительными материалами.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐠 Cham Islands
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-cham-islands',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🐠 Лучшее место для снорклинга рядом с Хойаном  
- 🌊 Чистая вода и кораллы  
- 🏝️ День на природе вдали от города

## Структура комплекса

- 🐟 Коралловые рифы  
- 🚤 Рыбацкие деревни  
- 🏖️ Пляжи островов

## Билеты и посещение

- 💰 Тур на день: ~500 000–800 000 VND  
- ⏱️ Экскурсия: полный день

## Практические советы

- 🌊 Лучший сезон: март–сентябрь  
- 🧴 Берите солнцезащиту  
- 🚤 Возможна качка

## Историческая справка

Острова были важной остановкой морских путей и сегодня охраняются как биосферный резерват.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ An Bang Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-an-bang-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏖️ Лучший пляж рядом со старым городом  
- 🌅 Красивые закаты  
- 🍹 Пляжные бары и кафе

## Структура комплекса

- 🌊 Береговую линию  
- 🍹 Кафе у воды  
- 🌇 Закат над морем

## Билеты и посещение

- 🆓 Бесплатно  
- 🚲 Легко добраться на байке или велосипеде

## Практические советы

- 🌞 Лучше приезжать после обеда  
- 🏄 Подходит для купания и отдыха  
- 🧴 Солнцезащита обязательна

## Историческая справка

Ан Бан стал альтернативой более туристическому Куа Дай и сохранил более спокойный пляжный формат.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥖 Bánh Mì Phượng
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-banh-mi-phuong',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🥖 Один из самых известных баньми во Вьетнаме  
- 🌍 Международная гастрономическая репутация  
- ⚡ Быстро, вкусно и недорого

## Коммуникация & сервис

- 🌐 Базовый английский  
- 🥡 Формат takeaway  
- ⏱️ Очереди в часы пик

## Локальная ценность

Bánh Mì Phượng превратил уличный сэндвич в гастрономический символ Хойана и обязательный пункт маршрута туристов.

## 🔵 Что попробовать обязательно

- Bánh mì đặc biệt (фирменный сэндвич)  
- Версия с жареной свининой или курицей  
- Добавка с домашним соусом

## 🟢 Цены

- 💰 25 000–40 000 VND  
- 🥪 Средний чек: ~30 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍗 Cơm Gà Bà Buội
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-com-ga-ba-buoi',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍗 Легендарный куриный рис по-хойански  
- 👵 Семейные рецепты нескольких поколений  
- 🏠 Аутентичная атмосфера

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🪑 Простая посадка

## Локальная ценность

Cơm Gà Bà Buội считается эталоном блюда, ради которого многие приезжают в Хойан.

## 🔵 Что попробовать обязательно

- Cơm gà truyền thống (курица с жёлтым рисом)  
- Куриный салат с травами  
- Домашний соус

## 🟢 Цены

- 💰 40 000–60 000 VND  
- 🍽️ Средний чек: ~50 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 👑 Madam Khanh – The Banh Mi Queen
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-madam-khanh-the-banh-mi-queen',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 👑 Вторая легенда баньми Хойана  
- 😊 Персональный подход  
- 🌮 Стабильное качество

## Коммуникация & сервис

- 🌐 Английский без проблем  
- 🥡 Формат takeaway  
- 😊 Дружелюбный персонал

## Локальная ценность

Madam Khanh показывает человеческое лицо хойанской уличной кухни — здесь важны вкус и улыбка.

## 🔵 Что попробовать обязательно

- Bánh mì с комбинированной начинкой  
- Версия с острым соусом  
- Домашний паштет

## 🟢 Цены

- 💰 20 000–35 000 VND  
- 🥪 Средний чек: ~30 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Morning Glory Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-morning-glory-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍜 Отличная витрина кухни Центрального Вьетнама  
- 🏮 Красивый интерьер в старом доме  
- 👨‍👩‍👧 Подходит для компаний

## Коммуникация & сервис

- 🌐 Хороший английский  
- 💳 Принимают карты  
- 🪑 Комфортная посадка

## Локальная ценность

Morning Glory сделал локальные блюда доступными и понятными для международной аудитории.

## 🔵 Что попробовать обязательно

- Cao lầu  
- White rose dumplings  
- Сеты региональной кухни

## 🟢 Цены

- 💰 150 000–300 000 VND  
- 🍽️ Средний чек: ~200 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥙 Bà Lê Well
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-ba-le-well',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🥙 Интерактивный формат еды  
- 🎉 Живая и дружелюбная атмосфера  
- 🍽️ Отлично для компаний

## Коммуникация & сервис

- 🌐 Английский  
- 🪑 Общие столы  
- 🎊 Шумно и весело

## Локальная ценность

Bà Lê Well превращает ужин в социальный опыт, где еда объединяет незнакомых людей.

## 🔵 Что попробовать обязательно

- Bánh xèo  
- Nem lụi  
- Ассорти для заворачивания

## 🟢 Цены

- 💰 Сет: ~120 000–150 000 VND  
- 🍽️ Цена за сет
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍵 Reaching Out Tea House
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-reaching-out-tea-house',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍵 Редкий формат осознанного и тихого отдыха  
- 🤍 Социальное предприятие с сильной миссией  
- 🏮 Уютный интерьер старого дома

## Коммуникация & сервис

- ✍️ Общение через записки  
- 🤫 Полная тишина  
- 🪑 Камерная посадка

## Локальная ценность

Reaching Out Tea House показывает, как бизнес может быть одновременно эстетичным, устойчивым и социально значимым.

## 🔵 Что попробовать обязательно

- Традиционные вьетнамские чаи  
- Травяные и цветочные сборы  
- Лёгкие сладости к чаю

## 🟢 Цены

- 💰 60 000–120 000 VND  
- 🍵 Средний чек: ~80 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 📸 Faifo Coffee
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-faifo-coffee',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 📸 Одна из лучших фототочек Хойана  
- ☕ Приятный кофе и десерты  
- 🌇 Панорама старого города

## Коммуникация & сервис

- 🌐 Базовый английский  
- 📷 Ограниченное время на крыше в пиковые часы  
- 🪑 Небольшие столики

## Локальная ценность

Faifo Coffee стал визуальным символом Хойана в соцсетях и точкой притяжения для фотографов.

## 🔵 Что попробовать обязательно

- Кофе со льдом по-вьетнамски  
- Десерты и выпечка  
- Напитки на крыше

## 🟢 Цены

- 💰 40 000–80 000 VND  
- ☕ Средний чек: ~60 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Mót Hội An
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-mot-hoi-an',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌿 Уникальный напиток, который есть только здесь  
- 🥤 Быстро и освежающе  
- 📷 Атмосферная подача

## Коммуникация & сервис

- 🗣 Минимальный английский  
- 🥡 Только на вынос  
- ⏱️ Быстрое обслуживание

## Локальная ценность

Mót Hội An — пример того, как простой локальный рецепт стал городской легендой.

## 🔵 Что попробовать обязательно

- Травяной напиток Mót (лимонник, лайм, мёд)

## 🟢 Цены

- 💰 ~15 000 VND  
- 🥤 Формат take-away
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 👗 Yaly Couture
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-yaly-couture',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 👗 Высокое качество пошива  
- ⏱️ Быстрое выполнение заказов  
- 🌍 Международная репутация

## Коммуникация & сервис

- 🌐 Свободный английский  
- 🧵 Примерки и корректировки  
- 🛍️ Доставка в отель

## Локальная ценность

Yaly Couture сформировал репутацию Хойана как мировой столицы быстрого индивидуального пошива.

## 🔵 Что попробовать обязательно

- Индивидуальный пошив костюмов  
- Платья и рубашки по меркам  
- Консультации дизайнеров

## 🟢 Цены

- 💰 От 80–150 USD за изделие  
- 👔 Цена зависит от ткани и сложности
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Soul Kitchen
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-soul-kitchen',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🏖️ Отличное место для отдыха у моря  
- 🎶 Живая музыка и вечеринки  
- 🌍 Популярен у экспатов

## Коммуникация & сервис

- 🌐 Английский без проблем  
- 🎶 Музыкальные вечера  
- 🪑 Посадка у пляжа

## Локальная ценность

Soul Kitchen отражает пляжную и интернациональную сторону Хойана — свободную и открытую миру.

## 🔵 Что попробовать обязательно

- Бургеры и западные блюда  
- Коктейли и пиво  
- Барбекю по вечерам

## 🟢 Цены

- 💰 120 000–300 000 VND  
- 🍹 Средний чек: ~200 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ My Khe Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-my-khe-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏖️ Один из лучших городских пляжей Азии  
- 🌅 Красивые рассветы над морем  
- 🏙️ Сочетание пляжа и городской жизни

## Структура комплекса

- 🌊 Прогулку вдоль береговой линии  
- 🏄 Зоны для купания и серфинга  
- 🌴 Пляжные кафе и отели

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступен круглосуточно

## Практические советы

- 🌞 Лучшее время — раннее утро  
- 🧴 Солнцезащита обязательна  
- 🌊 Следите за флагами безопасности

## Историческая справка

My Khe получил мировую известность после включения в рейтинги лучших пляжей мира и стал символом курортного Дананга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 Son Tra Peninsula
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-son-tra-peninsula',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌳 Заповедная природа в черте города  
- 🐒 Среда обитания красноногих дуков  
- 📸 Лучшие панорамы Дананга

## Структура комплекса

- 🌄 Смотровые площадки над городом  
- 🐒 Наблюдение за дикой природой  
- 🛵 Мотопоездку по серпантину

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступ днём

## Практические советы

- 🛵 Удобнее на байке  
- 🌦️ Погода меняется быстро  
- 📷 Возьмите зум-камеру

## Историческая справка

Полуостров долгое время был военной зоной и сохранил нетронутые леса, став природным щитом города.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Linh Ứng Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-linh-ung-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛕 Самая высокая статуя Будды во Вьетнаме  
- 🌊 Вид на море и город  
- 📸 Иконическая достопримечательность

## Структура комплекса

- 🗿 Статую Lady Buddha  
- 🌺 Территорию пагоды  
- 🌄 Видовые точки на побережье

## Билеты и посещение

- 🆓 Бесплатно  
- ⏱️ Осмотр: 30–60 минут

## Практические советы

- 👕 Соблюдайте дресс-код  
- 🌞 Лучше посещать утром  
- 📷 Отлично для панорам

## Историческая справка

Пагода была построена в XXI веке как духовный символ защиты Дананга и его жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🗻 Marble Mountains
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-marble-mountains',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🗻 Уникальный природно-религиозный комплекс  
- 🛕 Пещеры и древние храмы  
- 📸 Впечатляющие виды с высоты

## Структура комплекса

- 🕳️ Пещеру Am Phu  
- 🛕 Пагоды в скалах  
- 🌄 Панорамы побережья

## Билеты и посещение

- 💰 Вход: ~40 000 VND  
- 🚠 Лифт оплачивается отдельно

## Практические советы

- 👟 Удобная обувь  
- 🌞 Жарко днём — берите воду  
- 📷 Хороший объектив

## Историческая справка

Горы почитались с древних времён как священное место и использовались чамами и буддистами.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐉 Dragon Bridge
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-dragon-bridge',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🐉 Икона современной архитектуры  
- 🔥 Огненно-водное шоу по выходным  
- 🌃 Отличная ночная атмосфера

## Структура комплекса

- 🔥 Шоу огня и воды (выходные)  
- 🌉 Прогулку по мосту  
- 📷 Ночные фото

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Шоу: сб–вс ~21:00

## Практические советы

- ⏰ Приходите заранее  
- 📷 Используйте штатив  
- 🌃 Лучшее время — вечер

## Историческая справка

Мост был открыт в 2013 году и стал символом экономического роста и модернизации Дананга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Non Nuoc Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-non-nuoc-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌊 Менее людный, чем My Khe  
- 🏄 Подходит для серфинга и длинных прогулок  
- 🌅 Красивые рассветы и закаты

## Структура комплекса

- 🏖️ Широкую береговую линию  
- 🏄 Серф-зоны в сезон волн  
- 🌴 Территории курортов у пляжа

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступен круглосуточно

## Практические советы

- 🌞 Меньше кафе — берите воду  
- 🏄 Лучшие волны осенью и зимой  
- 🚲 Удобно для утренних пробежек

## Историческая справка

Пляж долгое время оставался в тени центра Дананга и развивался как курортная зона высокого уровня.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌉 Golden Bridge
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-golden-bridge',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌉 Одна из самых узнаваемых достопримечательностей Вьетнама  
- 📸 Идеальное место для фото  
- 🌄 Захватывающие виды на горы

## Структура комплекса

- ✋ Сам мост с «руками»  
- 🌄 Панорамы гор Ба На  
- 🚠 Канатную дорогу

## Билеты и посещение

- 🎟️ Входит в билет Ba Na Hills (~900 000 VND)  
- ⏱️ Осмотр: 30–60 минут

## Практические советы

- 🌥️ Погода в горах меняется быстро  
- 📷 Лучшее время — утро  
- 🧥 Возьмите лёгкую куртку

## Историческая справка

Мост открыт в 2018 году и мгновенно стал мировой туристической иконой.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎢 Sun World Ba Na Hills
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-sun-world-ba-na-hills',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🚠 Одна из самых длинных канатных дорог в мире  
- 🎢 Развлечения для всей семьи  
- 🌬️ Прохлада в горах

## Структура комплекса

- 🚠 Канатную дорогу  
- 🏰 Французскую деревню  
- 🎡 Fantasy Park

## Билеты и посещение

- 💰 Билет: ~900 000 VND  
- ⏱️ Полный день

## Практические советы

- 🌦️ Следите за погодой  
- 🎒 Берите тёплую одежду  
- 🎟️ Покупайте билеты заранее

## Историческая справка

Курорт был создан на месте французской горной станции начала XX века.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌉 Han River Bridge
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-han-river-bridge',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌉 Инженерная достопримечательность  
- 🌃 Красивые виды ночью  
- 🚦 Исторический символ города

## Структура комплекса

- 🌉 Сам мост  
- 🌃 Набережные реки Хан  
- 🚧 Процесс разведения моста

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Разводят поздно ночью (редко)

## Практические советы

- 🌙 Лучше осматривать вечером  
- 📷 Отличен для ночных фото

## Историческая справка

Мост открыт в 2000 году и стал первым крупным инфраструктурным проектом современного Дананга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🗿 Cham Sculpture Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-cham-sculpture-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🗿 Уникальная коллекция чамского искусства  
- 📚 Глубокий исторический контекст региона  
- 🧘 Спокойная музейная атмосфера

## Структура комплекса

- 🗿 Каменные статуи и барельефы  
- 🏛️ Галереи разных эпох Чампы  
- 🌿 Внутренний двор музея

## Билеты и посещение

- 💰 Вход: ~60 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 📷 Съёмка без вспышки  
- 🌞 Отличен для дневного визита

## Историческая справка

Музей основан в 1915 году французами и хранит наследие цивилизации, существовавшей в Центральном Вьетнаме более тысячи лет.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍲 Madame Lân
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-madame-lan',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍲 Широкая витрина кухни Центрального Вьетнама  
- 👨‍👩‍👧 Подходит для компаний и семей  
- 🌿 Просторный интерьер и зелёная территория

## Коммуникация & сервис

- 🌐 Английский на уровне меню  
- 💳 Принимают карты  
- 🪑 Просторные залы

## Локальная ценность

Madame Lân делает традиционную кухню Дананга доступной и понятной для гостей без потери аутентичности.

## 🔵 Что попробовать обязательно

- 🍽️ Bánh xèo  
- 🍽️ Nem lụi  
- 🍽️ Cao lầu и региональные супы

## 🟢 Цены

- 💰 120 000–250 000 VND  
- 🍽️ Средний чек: ~180 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⭐ La Maison 1888
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-la-maison-1888',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- ⭐ Один из самых известных fine-dining ресторанов Вьетнама  
- 🌊 Захватывающий вид на море  
- 🍷 Высокий уровень гастрономии и сервиса

## Коммуникация & сервис

- 🌐 Свободный английский  
- 👔 Дресс-код smart casual / formal  
- 🍾 Бронирование обязательно

## Локальная ценность

La Maison 1888 демонстрирует гастрономический потенциал Дананга на мировом уровне.

## 🔵 Что попробовать обязательно

- Дегустационные сеты  
- Французская высокая кухня  
- Винное сопровождение

## 🟢 Цены

- 💰 3 000 000–6 000 000 VND  
- 🍽️ Формат: дегустационные меню
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦞 Bé Mặn Seafood
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-be-man-seafood',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🦞 Свежайшие морепродукты  
- 🔊 Настоящая локальная атмосфера  
- 🍽️ Большие порции

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные предпочтительны  
- 🪑 Простые столы

## Локальная ценность

Bé Mặn — эталон «как едят местные», без туристического глянца и с максимальной свежестью продуктов.

## 🔵 Что попробовать обязательно

- Краб и лобстер на гриле  
- Креветки с солью и перцем  
- Мидии с лимонником

## 🟢 Цены

- 💰 200 000–400 000 VND (в зависимости от выбора)  
- 🍽️ Цена за вес
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ 43 Factory Coffee Roaster
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-43-factory-coffee-roaster',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- ☕ Лучшее место для specialty coffee в Дананге  
- 🏗️ Архитектурный и дизайнерский объект  
- 💻 Удобно для работы

## Коммуникация & сервис

- 🌐 Английский  
- 📶 Быстрый Wi-Fi  
- 🔌 Розетки

## Локальная ценность

43 Factory сформировал репутацию Дананга как города с развитой кофейной культурой.

## 🔵 Что попробовать обязательно

- Фильтр-кофе и single origin  
- Cold brew  
- Авторские напитки

## 🟢 Цены

- 💰 45 000–90 000 VND  
- ☕ Средний чек: ~70 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🧱 Cộng Cà Phê
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-cong-ca-phe',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🧱 Атмосфера вьетнамского ретро  
- 🥥 Фирменный кокосовый кофе  
- 🏙️ Удобные локации

## Коммуникация & сервис

- 🌐 Английский на базовом уровне  
- 📶 Wi-Fi  
- 🪑 Неформальная посадка

## Локальная ценность

Cộng Cà Phê популяризирует вьетнамский кофейный стиль и культуру «сидеть и наблюдать».

## 🔵 Что попробовать обязательно

- Coconut coffee  
- Cà phê sữa đá  
- Традиционные снеки

## 🟢 Цены

- 💰 40 000–70 000 VND  
- ☕ Средний чек: ~55 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Sky36
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-sky36',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌃 Лучший панорамный вид на Дананг  
- 🎧 DJ-сеты и вечеринки  
- 🍸 Коктейльная карта и атмосфера большого города

## Коммуникация & сервис

- 🌐 Свободный английский  
- 👔 Дресс-код вечером  
- 📷 Отлично подходит для ночных фото

## Локальная ценность

Sky36 символизирует современный и космополитичный Дананг — город небоскрёбов, ночной жизни и динамики.

## 🔵 Что попробовать обязательно

- Авторские коктейли  
- Классические highball  
- Лёгкие закуски к напиткам

## 🟢 Цены

- 💰 Коктейли: 180 000–300 000 VND  
- 🍸 Средний чек: ~250 000–350 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Waterfront Danang
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-waterfront-danang',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌊 Приятное расположение у воды  
- 🍺 Западная и азиатская кухня  
- 🎶 Живая музыка и трансляции спорта

## Коммуникация & сервис

- 🌐 Английский без проблем  
- 📶 Wi-Fi  
- 🪑 Терраса с видом на реку

## Локальная ценность

Waterfront Danang — центр экспатской социальной жизни и неформального общения.

## 🔵 Что попробовать обязательно

- Бургеры и стейки  
- Местное и импортное пиво  
- Коктейли

## 🟢 Цены

- 💰 120 000–300 000 VND  
- 🍽️ Средний чек: ~200 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Han Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-han-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🛍️ Удобное место для покупок  
- 🍜 Локальные продукты и специи  
- 🎁 Сувениры и подарки

## Коммуникация & сервис

- 🗣 Базовый английский  
- 💵 Наличные  
- 🛍️ Компактный формат

## Локальная ценность

Han Market — туристически удобная точка знакомства с гастрономией Дананга.

## 🔵 Что попробовать обязательно

- Лапша и супы на фуд-корте  
- Сухофрукты и кофе  
- Местные сладости

## 🟢 Цены

- 🍽️ Еда: 20 000–50 000 VND  
- 🛒 Сувениры — торг уместен
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍢 Con Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-con-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍢 Лучший стрит-фуд Дананга  
- 👀 Повседневная жизнь местных  
- 💸 Очень демократичные цены

## Коммуникация & сервис

- 🗣 Только вьетнамский  
- 💵 Наличные  
- 🎒 Следите за вещами

## Локальная ценность

Con Market — эталонный рынок «для своих», где можно попробовать настоящую кухню Дананга.

## 🔵 Что попробовать обязательно

- Mi Quang  
- Bánh xèo  
- Разнообразные закуски

## 🟢 Цены

- 🍽️ 15 000–40 000 VND  
- 🥢 Средний чек: минимальный
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Son Tra Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-son-tra-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌙 Удобно совместить с посещением Dragon Bridge  
- 🍢 Уличная еда и прогулки  
- 🎶 Вечерний вайб

## Коммуникация & сервис

- 🌐 Базовый английский  
- 💵 Наличные  
- 🚶 Удобно для прогулок

## Локальная ценность

Son Tra Night Market стал вечерним продолжением туристической жизни Дананга.

## 🔵 Что попробовать обязательно

- Морепродукты на гриле  
- Снэки и десерты  
- Напитки с собой

## 🟢 Цены

- 🍽️ 30 000–70 000 VND  
- 🛍️ Сувениры — по ситуации
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌸 Hồ Xuân Hương
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-ho-xuan-huong',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌸 Символ города и его спокойного ритма  
- 🚶 Удобная набережная для прогулок  
- 📸 Красивые виды на город и закаты

## Структура комплекса

- 🚶 Кольцевую прогулочную дорожку вокруг озера  
- 🌺 Цветочные клумбы и парковые зоны  
- ☕ Кафе с видом на воду

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступно в любое время суток

## Практические советы

- 🌞 Лучшее время — утро или ближе к вечеру  
- 🧥 Вечером прохладно — возьмите куртку  
- 📷 Хорошо подходит для неспешной фотосъёмки

## Историческая справка

Озеро было создано во французский колониальный период и с тех пор стало центральной точкой общественной жизни Далата.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌷 Dalat Flower Garden
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-dalat-flower-garden',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌷 Цветочная визитная карточка Далата  
- 🌼 Большие ухоженные территории  
- 👨‍👩‍👧 Подходит для семей

## Структура комплекса

- 🌸 Тематические цветочные экспозиции  
- ⛲ Фонтаны и фотозоны  
- 🌿 Оранжереи и павильоны

## Билеты и посещение

- 💰 Вход: ~60 000 VND (взрослые)  
- 🕒 Время работы: 7:00–18:00 (пт–сб до 22:00)

## Практические советы

- 📷 Лучшее время для фото — утро  
- 🌼 Вечером включается подсветка  
- 🎟️ В выходные бывает многолюдно

## Историческая справка

Парк был создан как часть курортной концепции французского Далата и неоднократно реконструировался.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💕 Valley of Love
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-valley-of-love',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 💕 Самое известное романтическое место Далата  
- 🚣 Развлечения и прогулки на целый день  
- 📸 Озёра, холмы и панорамы

## Структура комплекса

- 🚣 Озеро с катамаранами  
- 🌲 Холмы и смотровые площадки  
- 🎡 Аттракционы и парковые зоны

## Билеты и посещение

- 💰 Вход: ~250 000 VND  
- 🕒 Время работы: 7:00–17:00

## Практические советы

- ⏱️ Закладывайте минимум полдня  
- 👟 Удобная обувь  
- 🌞 В солнечную погоду берите воду

## Историческая справка

Парк был основан в 1930-х годах французами как Vallée d’Amour и стал знаковым курортным местом.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Datanla Waterfall
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-datanla-waterfall',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 💦 Красивый водопад рядом с городом  
- 🎢 Аттракционы и активный отдых  
- 🌲 Природа и лес

## Структура комплекса

- 💦 Основной каскад водопада  
- 🎢 Альпийский тобогган  
- 🧗 Каньонинг и верёвочные маршруты

## Билеты и посещение

- 💰 Вход: ~50 000 VND  
- 🎟️ Аттракционы оплачиваются отдельно

## Практические советы

- 👟 Обувь с хорошим сцеплением  
- 🌧️ В сезон дождей водопад полноводнее  
- 🎢 Тобогган лучше бронировать заранее

## Историческая справка

Название водопада связано с легендами народов Центрального нагорья и издавна привлекало путешественников.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Cam Ly Waterfall
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-cam-ly-waterfall',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌿 Лёгкая природная прогулка  
- 📍 Удобно совместить с осмотром города  
- 📸 Красив в сезон дождей

## Структура комплекса

- 💦 Каскад водопада  
- 🌲 Сосновый бор вокруг  
- 🐎 Прогулки на лошадях (по сезону)

## Билеты и посещение

- 💰 Вход: ~40 000 VND  
- 🕒 Время работы: 7:00–17:00

## Практические советы

- 🌧️ Лучшее время — после дождей  
- 📷 Подходит для короткой остановки  
- 👟 Удобная обувь

## Историческая справка

Водопад был одним из первых мест, куда водили туристов во французском Далате.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌲 Tuyền Lâm Lake
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-tuyen-lam-lake',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌲 Тихая природная атмосфера вдали от центра  
- 🌅 Красивые рассветы и отражения в воде  
- 🚣 Подходит для прогулок и отдыха на природе

## Структура комплекса

- 🚣 Прогулку на лодке по озеру  
- 🌲 Сосновые берега и смотровые точки  
- 📷 Панорамы с возвышенностей

## Билеты и посещение

- 🆓 Свободный доступ к берегам  
- 💰 Лодочные прогулки — по желанию

## Практические советы

- 🌞 Лучше приезжать утром  
- 🚗 Удобнее на байке или такси  
- 🧥 Вечером прохладно

## Историческая справка

Озеро сформировалось после строительства плотины в XX веке и стало важной рекреационной зоной Далата.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🧘 Trúc Lâm Zen Monastery
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-truc-lam-zen-monastery',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🧘 Спокойствие и медитативная атмосфера  
- 🌿 Прекрасное расположение над озером  
- 📸 Панорамные виды

## Структура комплекса

- 🛕 Главный храмовый комплекс  
- 🌺 Сады и дорожки монастыря  
- 🌄 Вид на озеро Туен Лам

## Билеты и посещение

- 🆓 Вход бесплатный  
- ⏱️ Осмотр: 45–60 минут

## Практические советы

- 👕 Скромная одежда обязательна  
- 🤫 Соблюдайте тишину  
- 🚠 Можно спуститься к озеру по канатной дороге

## Историческая справка

Монастырь основан в 1994 году и является центром школы дзен Трук Лам, возрождённой во Вьетнаме.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌀 Crazy House
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-crazy-house',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌀 Самая необычная архитектура Далата  
- 🎨 Похожа на сказочный лабиринт  
- 📸 Идеальное место для фото

## Структура комплекса

- 🏠 Лабиринты и лестницы  
- 🐉 Скульптуры и переходы  
- 🌳 Панорамные террасы

## Билеты и посещение

- 💰 Вход: ~60 000 VND  
- ⏱️ Осмотр: 30–60 минут

## Практические советы

- 👟 Обувь с хорошим сцеплением  
- 📷 Будьте осторожны на узких лестницах  
- ⏰ Приходите пораньше — меньше людей

## Историческая справка

Проект создан архитектором Данг Вьет Нга и вдохновлён природными формами и сказками.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐉 Linh Phước Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-linh-phuoc-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🐉 Уникальная мозаичная архитектура  
- 🛕 Дракон из бутылочного стекла  
- 📸 Очень фотогеничное место

## Структура комплекса

- 🐉 Мозаичного дракона  
- 🛕 Многоярусные залы пагоды  
- 🧱 Детали из фарфора

## Билеты и посещение

- 🆓 Вход бесплатный  
- ⏱️ Осмотр: 30–45 минут

## Практические советы

- 👕 Соблюдайте дресс-код  
- 📷 Отлично для детальной съёмки  
- 🚆 Удобно совместить с поездкой на поезде

## Историческая справка

Пагода построена в 1949 году и стала известна благодаря уникальной технике декора из битой керамики.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛪ Domaine de Marie
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-domaine-de-marie',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⛪ Яркий пример колониальной архитектуры  
- 🌸 Уютные сады и спокойная атмосфера  
- 📸 Отличная фотолокация

## Структура комплекса

- ⛪ Интерьер церкви  
- 🌺 Территорию и сад  
- 🛍️ Небольшие лавки при монастыре

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступно днём

## Практические советы

- 🌞 Хорошо посещать утром  
- 👕 Уважайте религиозный характер места  
- 📷 Красиво при мягком свете

## Историческая справка

Церковь была построена французскими монахинями в 1940-х годах и сохранила оригинальный стиль.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🚂 Dalat Railway Station
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-dalat-railway-station',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🚂 Архитектурная икона французского Далата  
- 📸 Один из самых фотогеничных вокзалов страны  
- 🏛️ Исторический объект колониальной эпохи

## Структура комплекса

- 🚉 Здание вокзала и интерьеры  
- 🚃 Старинные вагоны  
- 🛤️ Короткую поездку на ретро-поезде

## Билеты и посещение

- 💰 Вход на территорию: ~10 000 VND  
- 🚃 Поездка на поезде: оплачивается отдельно

## Практические советы

- 📷 Лучшее время для фото — утро  
- ⏰ Поездки ходят по расписанию  
- 🧥 Вокзал расположен в прохладной зоне

## Историческая справка

Вокзал открыт в 1932 году и был частью железной дороги Далат–Тхапчам, соединявшей горный курорт с побережьем.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛪ Dalat Cathedral
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-dalat-cathedral',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⛪ Самый известный храм Далата  
- 🐓 Необычный символ на башне  
- 📸 Красивые виды с холма

## Структура комплекса

- ⛪ Интерьер собора  
- 🎨 Витражи  
- 🌄 Вид на город

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Лучше посещать вне служб

## Практические советы

- 👕 Скромная одежда  
- 🤫 Соблюдайте тишину  
- 📷 Снимайте без вспышки

## Историческая справка

Собор построен в 1931–1942 годах и стал центром католической общины Центрального нагорья.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 👑 Bao Dai Palace III
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-bao-dai-palace-iii',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 👑 Возможность увидеть быт императорской семьи  
- 🏠 Хорошо сохранившиеся интерьеры  
- 🌲 Уютная территория с садами

## Структура комплекса

- 🛋️ Жилые комнаты дворца  
- 📜 Личные вещи императора  
- 🌳 Сад и террасы

## Билеты и посещение

- 💰 Вход: ~40 000 VND  
- ⏱️ Осмотр: 30–45 минут

## Практические советы

- 📷 Фотографировать внутри ограничено  
- 👟 Удобная обувь  
- 🌞 Хорошо посещать днём

## Историческая справка

Бао Дай использовал Далат как летнюю резиденцию благодаря прохладному климату и спокойной атмосфере.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏺 Lam Dong Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-lam-dong-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏺 Глубокий контекст региона  
- 🧬 Культура народов Центрального нагорья  
- 🏛️ Тихая музейная атмосфера

## Структура комплекса

- 🏺 Этнографические экспозиции  
- 🌾 Артефакты местных племён  
- 🏡 Традиционные дома

## Билеты и посещение

- 💰 Вход: ~20 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 🌞 Отлично для дневного визита  
- 📷 Фотосъёмка ограничена  
- 🧥 В залах прохладно

## Историческая справка

Музей расположен в бывшей французской резиденции и рассказывает об истории освоения нагорья.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌲 Dalat Pine Viewpoints
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-dalat-pine-viewpoints',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌲 Фирменные пейзажи Далата  
- 🌄 Отличные рассветы и туманы  
- 📸 Атмосферные фото

## Структура комплекса

- 🌄 Панорамы холмов  
- 🌫️ Утренние туманы  
- 🚶 Лесные тропы

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Лучше утром

## Практические советы

- 🌅 Приходите на рассвете  
- 🧥 Тёплая одежда  
- 📷 Объектив с хорошей светосилой

## Историческая справка

Сосновые леса и холмы сформировали уникальный микроклимат Далата, благодаря которому город стал курортом.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Dalat Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-dalat-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🛍️ Лучшее место для знакомства с повседневной жизнью города  
- 🍓 Свежие ягоды, фрукты и локальные продукты  
- 🍜 Большой выбор уличной еды

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Только наличные  
- 🎒 Следите за вещами

## Локальная ценность

Dalat Market — сердце городской жизни и главный источник свежих продуктов для жителей Далата.

## 🔵 Что попробовать обязательно

- Bánh tráng nướng (далатская «пицца»)  
- Авокадо с мороженым  
- Клубника и сухофрукты

## 🟢 Цены

- 🍽️ Стрит-фуд: 15 000–40 000 VND  
- 🛒 Продукты и сувениры — торг уместен
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Dalat Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-dalat-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌙 Атмосфера вечернего Далата  
- 🍢 Большой выбор уличной еды  
- 🛍️ Недорогие сувениры

## Коммуникация & сервис

- 🌐 Базовый английский  
- 💵 Наличные  
- 🚶 Удобно для прогулок

## Локальная ценность

Ночной рынок подчёркивает прохладный климат Далата и культуру вечерних прогулок.

## 🔵 Что попробовать обязательно

- Горячие соевые напитки  
- Гриль-закуски  
- Bánh tráng nướng

## 🟢 Цены

- 🍽️ 20 000–50 000 VND  
- 🛍️ Сувениры — по ситуации
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍬 L’angfarm
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-l-angfarm',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍬 Лучшие подарки из Далата  
- 🌿 Чаи, сладости и снеки местного производства  
- 🎁 Удобно купить сувениры

## Коммуникация & сервис

- 🌐 Английский на уровне магазина  
- 💳 Принимают карты  
- 🛍️ Упаковывают для перевозки

## Локальная ценность

L’angfarm сформировал современный образ «сладкого Далата» и стал национальным брендом.

## 🔵 Что попробовать обязательно

- Артишоковый чай  
- Фруктовые снеки  
- Шоколад и конфеты

## 🟢 Цены

- 💰 40 000–150 000 VND (в зависимости от продукта)
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥐 Lien Hoa Bakery & Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-lien-hoa-bakery-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🥐 Одна из самых популярных пекарен города  
- 🍽️ Большие порции и низкие цены  
- 🏙️ Удобно в центре

## Коммуникация & сервис

- 🗣 Минимальный английский  
- 💵 Наличные  
- 🪑 Большой зал

## Локальная ценность

Lien Hoa — демократичное место, где завтракают и студенты, и семьи, и туристы.

## 🔵 Что попробовать обязательно

- Французские булочки и пирожные  
- Завтраки и супы  
- Кофе и десерты

## 🟢 Цены

- 💰 20 000–70 000 VND  
- 🍽️ Средний чек: ~50 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍢 Nem nướng Bà Hùng
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-nem-nuong-ba-hung',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍢 Одно из культовых блюд Далата  
- 🔥 Свежая подача с гриля  
- 👨‍👩‍👧 Подходит для компаний

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🪑 Простая посадка

## Локальная ценность

Nem nướng Bà Hùng — гастрономический символ Далата и обязательный пункт для знакомства с местной кухней.

## 🔵 Что попробовать обязательно

- Nem nướng (фирменное блюдо)  
- Ассорти для заворачивания  
- Соусы домашнего приготовления

## 🟢 Цены

- 💰 40 000–70 000 VND  
- 🍽️ Средний чек: ~60 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ La Viet Coffee
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-la-viet-coffee',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- ☕ Один из лучших specialty coffee в городе  
- 🌱 Прямое сотрудничество с локальными фермерами  
- 💻 Подходит для работы и встреч

## Коммуникация & сервис

- 🌐 Английский  
- 📶 Быстрый Wi-Fi  
- 🔌 Розетки

## Локальная ценность

La Viet Coffee — один из драйверов кофейной культуры Далата и пример устойчивого локального бизнеса.

## 🔵 Что попробовать обязательно

- Фильтр-кофе single origin  
- Cold brew  
- Авторские кофейные напитки

## 🟢 Цены

- 💰 45 000–90 000 VND  
- ☕ Средний чек: ~70 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 An Cafe
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-an-cafe',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌿 Тихая и зелёная атмосфера  
- 📸 Фотогеничный интерьер  
- 🍽️ Простая и понятная еда

## Коммуникация & сервис

- 🌐 Базовый английский  
- 📶 Wi-Fi  
- 🪑 Садовая посадка

## Локальная ценность

An Cafe отражает неспешный, «европейский» ритм Далата и его курортный характер.

## 🔵 Что попробовать обязательно

- Домашние завтраки  
- Вьетнамский кофе  
- Лёгкие обеды

## 🟢 Цены

- 💰 40 000–90 000 VND  
- 🍽️ Средний чек: ~70 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌀 Maze Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-maze-bar',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌀 Самый необычный бар Далата  
- 🎨 Архитектурный аттракцион  
- 🍸 Вечерняя атмосфера

## Коммуникация & сервис

- 🌐 Английский  
- 📷 Подходит для фото  
- 🧭 Навигация внутри — часть опыта

## Локальная ценность

Maze Bar подчёркивает творческую и слегка сюрреалистичную сторону Далата, дополняя образ города.

## 🔵 Что попробовать обязательно

- Коктейли и пиво  
- Лёгкие закуски  
- Прогулку по лабиринтам

## 🟢 Цены

- 🍺 Напитки: 50 000–120 000 VND  
- 🍸 Средний чек: ~100 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Nha Trang Beach & Promenade
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-nha-trang-beach-promenade',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏖️ Один из самых удобных городских пляжей Вьетнама  
- 🚶 Прогулочная набережная с кафе и парками  
- 🌅 Красивые рассветы над Южно-Китайским морем

## Структура комплекса

- 🌊 Прогулку вдоль береговой линии  
- 🌴 Пальмовые аллеи и парки  
- 📷 Панорамы города и моря

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступен круглосуточно

## Практические советы

- 🌞 Лучшее время — раннее утро  
- 🏊 Купание комфортно в первой половине дня  
- 🌊 Следите за волнами и флагами безопасности

## Историческая справка

Пляж сформировал курортную идентичность Нячанга и стал главным общественным пространством города.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🗿 Po Nagar Cham Towers
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-po-nagar-cham-towers',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🗿 Главный памятник чамской культуры в регионе  
- 🛕 Действующий религиозный комплекс  
- 📸 Панорамные виды на город

## Структура комплекса

- 🗿 Главные кирпичные башни  
- 🔥 Алтари и ритуальные зоны  
- 🌄 Вид на реку и Нячанг

## Билеты и посещение

- 💰 Вход: ~30 000 VND  
- ⏱️ Осмотр: 30–60 минут

## Практические советы

- 👕 Скромная одежда  
- 📷 Хорошо посещать утром  
- 🌞 В полдень жарко

## Историческая справка

Башни посвящены богине По Нагар — покровительнице земли и плодородия, почитаемой чамами и вьетнамцами.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Long Son Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-long-son-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛕 Одна из главных буддийских святынь Нячанга  
- 🗿 Большая статуя Будды  
- 🌄 Панорамы города

## Структура комплекса

- 🗿 Статую Белого Будды  
- 🛕 Главный храм  
- 🌄 Вид на город

## Билеты и посещение

- 🆓 Бесплатно  
- ⏱️ Осмотр: 30–45 минут

## Практические советы

- 👟 Удобная обувь — подъём по ступеням  
- 👕 Скромная одежда  
- 🌞 Лучше утром

## Историческая справка

Пагода основана в конце XIX века и стала символом буддийской общины города.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛪ Nha Trang Cathedral
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-nha-trang-cathedral',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⛪ Колониальная архитектура  
- 🏛️ Исторический ориентир города  
- 📸 Фотогеничное место

## Структура комплекса

- ⛪ Интерьер собора  
- 🪟 Витражи  
- 🌄 Вид на город

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Посещение вне служб

## Практические советы

- 🤫 Соблюдайте тишину  
- 📷 Без вспышки  
- 👕 Скромная одежда

## Историческая справка

Собор был построен в 1933 году и получил название «Каменная церковь» из-за серого камня.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🪨 Hon Chong Rocks
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-hon-chong-rocks',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌊 Контраст моря и скал  
- 🌅 Красивые закаты  
- 📸 Спокойная атмосфера

## Структура комплекса

- 🪨 Скальные образования  
- 🌊 Вид на море  
- 🌅 Закат

## Билеты и посещение

- 💰 Вход: ~22 000 VND  
- ⏱️ Осмотр: 20–40 минут

## Практические советы

- 🌞 Хорошо посещать вечером  
- 👟 Удобная обувь  
- 📷 Отлично для пейзажной съёмки

## Историческая справка

Скалы издавна служили местом отдыха и вдохновения для художников и поэтов региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐠 National Oceanographic Museum of Vietnam
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-national-oceanographic-museum-of-vietnam',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🐠 Лучшее место, чтобы понять морскую экосистему региона  
- 🧪 Научный и образовательный контекст  
- 👨‍👩‍👧 Подходит для семей с детьми

## Структура комплекса

- 🐟 Аквариумы с тропическими рыбами  
- 🦈 Коллекцию морских скелетов  
- 🧭 Экспозиции о морских исследованиях

## Билеты и посещение

- 💰 Вход: ~40 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 🌞 Хорош для дневного визита  
- 📷 Съёмка ограничена в отдельных залах  
- 🌊 Можно совместить с портовой прогулкой

## Историческая справка

Музей основан в 1922 году и является важным научным центром морских исследований Вьетнама.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎢 VinWonders Nha Trang & Cable Car
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-vinwonders-nha-trang-cable-car',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🚠 Канатная дорога над заливом  
- 🎢 Аттракционы и аквапарк  
- 👨‍👩‍👧 Развлечения для всей семьи

## Структура комплекса

- 🚠 Канатную дорогу  
- 🎡 Аттракционы и шоу  
- 🌊 Панорамы залива

## Билеты и посещение

- 💰 Билет: ~800 000–900 000 VND  
- ⏱️ Полный день

## Практические советы

- 🎟️ Приходите с утра  
- 🌦️ Следите за погодой  
- 🎒 Возьмите воду и защиту от солнца

## Историческая справка

Парк стал частью стратегии развития островных курортов VinGroup и символом туристического роста Нячанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛁 Tháp Bà Hot Springs
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-thap-ba-hot-springs',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛁 Одна из самых известных грязелечебниц Вьетнама  
- 💆 Расслабление после пляжа  
- 🌿 Зелёная территория

## Структура комплекса

- 🛁 Грязевые ванны  
- ♨️ Минеральные бассейны  
- 🌴 Зоны отдыха

## Билеты и посещение

- 💰 Пакеты: ~150 000–400 000 VND  
- ⏱️ Осмотр: 2–3 часа

## Практические советы

- 👙 Купальник обязателен  
- 📅 Лучше бронировать в сезон  
- 🚿 Душ обязателен после процедур

## Историческая справка

Традиции грязелечения в районе Нячанга использовались местными жителями задолго до туристического освоения.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛁 i-Resort Mud Bath
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-i-resort-mud-bath',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏨 Современный и комфортный формат  
- 🛁 Большой выбор процедур  
- 👨‍👩‍👧 Подходит для семей

## Структура комплекса

- 🛁 Индивидуальные грязевые ванны  
- ♨️ Бассейны с минеральной водой  
- 🌺 Ландшафтные зоны

## Билеты и посещение

- 💰 Пакеты: ~200 000–500 000 VND  
- ⏱️ 2–4 часа

## Практические советы

- 📅 Лучше приезжать утром  
- 👙 Купальник и полотенце  
- 🚗 Удобнее на такси

## Историческая справка

i-Resort был создан как современная альтернатива классическим грязелечебницам Нячанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🤿 Hon Mun Island
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-hon-mun-island',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🤿 Лучшие кораллы региона  
- 🐟 Богатая морская жизнь  
- 🚤 Популярные морские туры

## Структура комплекса

- 🐠 Коралловые рифы  
- 🚤 Островные бухты  
- 🤿 Подводный мир

## Билеты и посещение

- 💰 Тур: ~400 000–700 000 VND  
- ⏱️ Полдня или день

## Практические советы

- 🌊 Лучший сезон: март–сентябрь  
- 🧴 Солнцезащита обязательна  
- 🤿 Маска и трубка обычно включены

## Историческая справка

Hon Mun стал первым морским охраняемым районом Вьетнама и остаётся ключевой зоной сохранения кораллов.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍺 Louisiane Brewhouse
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-louisiane-brewhouse',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍺 Собственная мини-пивоварня  
- 🏖️ Терраса прямо у моря  
- 🌍 Популярно у экспатов и туристов

## Коммуникация & сервис

- 🌐 Английский без проблем  
- 📶 Wi-Fi  
- 🪑 Терраса и бассейн

## Локальная ценность

Louisiane Brewhouse стал одним из первых мест, где в Нячанге появилась культура крафтового пива.

## 🔵 Что попробовать обязательно

- Фирменные сорта крафтового пива  
- Немецкие и европейские блюда  
- Морепродукты на гриле

## 🟢 Цены

- 💰 Пиво: 70 000–120 000 VND  
- 🍽️ Средний чек: ~250 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌴 Sailing Club
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-sailing-club',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌴 Самый известный beach club города  
- 🔥 Вечеринки и fire-show  
- 🍹 Курортная атмосфера

## Коммуникация & сервис

- 🌐 Английский  
- 🎶 DJ и шоу  
- 🪑 Пляжная посадка

## Локальная ценность

Sailing Club сформировал ночную жизнь Нячанга ещё до массового курортного бума.

## 🔵 Что попробовать обязательно

- Коктейли  
- Морепродукты и лёгкие блюда  
- Напитки на закате

## 🟢 Цены

- 💰 Коктейли: 120 000–200 000 VND  
- 🍽️ Средний чек: ~300 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍛 Ganesh Indian Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-ganesh-indian-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍛 Лучший индийский ресторан города  
- 🌱 Большой выбор вегетарианских блюд  
- 🌍 Стабильное качество

## Коммуникация & сервис

- 🌐 Хороший английский  
- 🌱 Вегетарианские опции  
- ❄️ Кондиционированный зал

## Локальная ценность

Ganesh стал гастрономической альтернативой в морском городе, ориентированном на морепродукты.

## 🔵 Что попробовать обязательно

- Butter chicken  
- Palak paneer  
- Garlic naan

## 🟢 Цены

- 💰 120 000–250 000 VND  
- 🍽️ Средний чек: ~200 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏡 Alpaca Homestyle Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-alpaca-homestyle-cafe',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🏡 Атмосфера «как дома»  
- 🥐 Европейские завтраки  
- ☕ Хороший кофе

## Коммуникация & сервис

- 🌐 Английский  
- 📶 Wi-Fi  
- 🪑 Небольшой зал

## Локальная ценность

Alpaca Café — пример камерного заведения, ориентированного на долгих гостей и экспатов.

## 🔵 Что попробовать обязательно

- Завтраки и бранчи  
- Домашние десерты  
- Кофе и смузи

## 🟢 Цены

- 💰 60 000–150 000 VND  
- 🍽️ Средний чек: ~120 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🔥 Lac Canh BBQ
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-lac-canh-bbq',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🔥 Культовое место Нячанга  
- 🥩 Уникальный формат «жарь сам»  
- 🕰️ История и традиция

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🔥 Активный гриль за столом

## Локальная ценность

Lac Canh BBQ — гастрономический символ старого Нячанга, обязательный пункт для любителей мяса.

## 🔵 Что попробовать обязательно

- Маринованную говядину  
- Свинину и морепродукты  
- Домашние соусы

## 🟢 Цены

- 💰 150 000–300 000 VND  
- 🍽️ Средний чек: ~220 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍣 Kiwami Sushi
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-kiwami-sushi',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍣 Лучший суши-ресторан Нячанга  
- 🎌 Аутентичный японский подход  
- 🪑 Камерная атмосфера

## Коммуникация & сервис

- 🌐 Английский  
- 📅 Бронирование желательно  
- 🪑 Небольшое количество мест

## Локальная ценность

Kiwami Sushi показывает, что в курортном городе возможна высокая гастрономия нишевого формата.

## 🔵 Что попробовать обязательно

- Omakase-сет  
- Nigiri из свежей рыбы  
- Японские закуски

## 🟢 Цены

- 💰 500 000–1 000 000 VND  
- 🍽️ Формат: дегустационный сет
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Skylight Rooftop / Skydeck
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-skylight-rooftop-skydeck',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌃 Один из самых высоких rooftop-баров Вьетнама  
- 🎧 Клубная атмосфера  
- 📸 Панорамы ночного Нячанга

## Коммуникация & сервис

- 🌐 Английский  
- 👔 Дресс-код вечером  
- 🎶 DJ и танцпол

## Локальная ценность

Skylight закрепил образ Нячанга как города с активной ночной жизнью и панорамными барами.

## 🔵 Что попробовать обязательно

- Авторские коктейли  
- Классические миксы  
- Лёгкие закуски

## 🟢 Цены

- 💰 Коктейли: 150 000–300 000 VND  
- 🎟️ Вход: иногда платный вечером
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Chợ Đầm
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-cho-am',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🛍️ Центральный рынок города  
- 🍜 Большой выбор локальной еды  
- 🎁 Сувениры и повседневные товары

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🎒 Будьте внимательны к вещам

## Локальная ценность

Chợ Đầm — торговое и гастрономическое сердце Нячанга, ориентированное прежде всего на местных.

## 🔵 Что попробовать обязательно

- Морепродукты и лапшу  
- Сухофрукты и кофе  
- Местные сладости

## 🟢 Цены

- 🍽️ 20 000–50 000 VND  
- 🛒 Торг уместен
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Nha Trang Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-nha-trang-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌙 Удобно совместить с прогулкой по набережной  
- 🍢 Уличная еда и перекусы  
- 🛍️ Сувениры и подарки

## Коммуникация & сервис

- 🌐 Базовый английский  
- 💵 Наличные  
- 🚶 Удобно для вечерних прогулок

## Локальная ценность

Ночной рынок подчёркивает курортный характер Нячанга и ориентирован на гостей города.

## 🔵 Что попробовать обязательно

- Гриль-закуски  
- Фрукты и десерты  
- Напитки с собой

## 🟢 Цены

- 🍽️ 30 000–70 000 VND  
- 🛍️ Сувениры — по ситуации
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Long Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-long-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏖️ Главный туристический пляж острова  
- 🌅 Одни из лучших закатов во Вьетнаме  
- 🏨 Широкий выбор отелей и ресторанов

## Структура комплекса

- 🌊 Прогулку вдоль береговой линии  
- 🌴 Закат над морем  
- 🍹 Пляжные бары и кафе

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступен круглосуточно

## Практические советы

- 🌞 Лучшее время — после обеда  
- 🧴 Солнцезащита обязательна  
- 🌊 Купание комфортно в первой половине дня

## Историческая справка

Long Beach стал основой туристического развития Фукуока и символом его курортной индустрии.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝️ Sao Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-sao-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏝️ Самый красивый пляж Фукуока  
- 💎 Белый песок и прозрачная вода  
- 📸 Открытка «тропического рая»

## Структура комплекса

- 🌊 Береговую линию  
- 🌴 Тень пальм  
- 🍹 Уличные точки с кокосами

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступен круглосуточно

## Практические советы

- 🚗 Удобнее добираться на машине или байке  
- 🌞 Приходите утром — меньше людей  
- 🧴 Берите воду и защиту от солнца

## Историческая справка

Название «Sao» означает «звёздчатый», что связано с формой морских звёзд, ранее обитавших здесь.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Ong Lang Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-ong-lang-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌿 Альтернатива шумному Long Beach  
- 🏖️ Чистая вода и широкая береговая линия  
- 🌅 Спокойные закаты

## Структура комплекса

- 🌊 Прогулку по пляжу  
- 🏝️ Вид на остров Хон Мо  
- 🍹 Кафе у воды

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступен круглосуточно

## Практические советы

- 🚗 Удобнее на байке  
- 🌞 Подходит для целого дня  
- 🧴 Возьмите всё необходимое с собой

## Историческая справка

Ong Lang долгое время оставался в тени крупных курортов и сохранил более аутентичную атмосферу.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 Phu Quoc National Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-phu-quoc-national-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌳 Нетронутая природа и биоразнообразие  
- 🥾 Треккинг и наблюдение за дикой природой  
- 🌄 Смотровые площадки

## Структура комплекса

- 🏞️ Водопад Da Ban  
- 🌄 Смотровую площадку Mount Chúa  
- 🐒 Обезьян и редких птиц

## Билеты и посещение

- 💰 Вход: ~60 000 VND  
- ⏱️ Осмотр: полдня или день

## Практические советы

- 👟 Удобная обувь  
- 🧴 Защита от насекомых  
- 🚗 Удобнее на машине

## Историческая справка

Парк был создан для защиты уникальной экосистемы острова и является домом для многих эндемиков.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Dinh Cậu Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-dinh-cau-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛕 Духовный центр местных жителей  
- 🌊 Уникальное расположение на мысе  
- 🌅 Красивые закаты

## Структура комплекса

- 🏯 Главный храм на скале  
- 🕯️ Алтари и святилища  
- 🌊 Вид на море

## Билеты и посещение

- 🆓 Бесплатно  
- ⏱️ Осмотр: 20–30 минут

## Практические советы

- 👕 Скромная одежда  
- 📷 Без вспышки  
- 🌞 Лучше вечером

## Историческая справка

Храм построен в XVIII веке и почитается как место, где духи моря защищают остров.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Phu Quoc Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-phu-quoc-night-market',
  'overview',
  'ru',
  NULL,
  '## Локальная ценность

Рынок — главная торговая и гастрономическая точка для гостей и местных жителей.

## Почему это важно?

- 🌙 Сердце ночной жизни Фукуока  
- 🍢 Уличная еда и морепродукты  
- 🛍️ Сувениры и подарки

## Структура комплекса

- 🦞 Живые морепродукты  
- 🍢 Гриль-зоны  
- 🛍️ Ряды сувениров

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Работает ежедневно с ~17:00 до 23:00

## Практические советы

- 💵 Наличные  
- 🎒 Следите за вещами  
- 🍽️ Выбирайте точки с очередями
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐟 Fish Sauce Factory
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-fish-sauce-factory',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🐟 Уникальный продукт острова  
- 🏺 Традиционная технология  
- 🎁 Возможность купить оригинал

## Структура комплекса

- 🪣 Деревянные бочки ферментации  
- 🧪 Процесс производства  
- 🛍️ Магазин продукции

## Билеты и посещение

- 🆓 Бесплатно (чаевые приветствуются)  
- ⏱️ Осмотр: 20–30 минут

## Практические советы

- 📷 Фотографировать разрешено  
- 🛍️ Покупайте только на фабрике  
- 🚗 Удобно совместить с другими объектами

## Историческая справка

Фукуок славится ныок мам уже более 200 лет благодаря чистой рыбе и идеальному климату для ферментации.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⚰️ Phu Quoc Prison
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-phu-quoc-prison',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⚰️ Важный исторический и образовательный объект  
- 🕯️ Место памяти и скорби  
- 📸 Архитектура и экспозиции

## Структура комплекса

- 🏛️ Воссозданные камеры  
- 🗿 Скульптуры и мемориалы  
- 📜 Экспозиции о жизни заключённых

## Билеты и посещение

- 💰 Вход: ~30 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 🤫 Уважительное поведение  
- 👕 Скромная одежда  
- 📷 Без вспышки

## Историческая справка

Тюрьма была построена французами, но стала печально известной во времена войны во Вьетнаме.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦁 Vinpearl Safari & Grand World
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-vinpearl-safari-grand-world',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🦁 Один из лучших сафари-парков ЮВА  
- 🎢 Grand World — иммерсивный культурный парк  
- 👨‍👩‍👧 Подходит для семей

## Структура комплекса

- 🦒 Зоны свободного выгула животных  
- 🏮 Тематические кварталы Grand World  
- 🎭 Шоу и представления

## Билеты и посещение

- 💰 Комбинированный билет: ~800 000–1 200 000 VND  
- ⏱️ Полный день

## Практические советы

- 🎟️ Приходите с утра  
- 🌦️ Следите за погодой  
- 🚠 Можно совместить с канатной дорогой

## Историческая справка

Проект стал частью стратегии VinGroup по созданию всестороннего туристического направления на Фукуоке.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🚠 Hon Thom Cable Car
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-hon-thom-cable-car',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🚠 Рекордная канатная дорога  
- 🏝️ Доступ к острову Хон Том  
- 🌊 Панорамы залива

## Структура комплекса

- 🚠 Поездку на канатке  
- 🏖️ Пляжи Хон Том  
- 🎢 Аттракционы Sun World

## Билеты и посещение

- 💰 Билет: ~500 000–700 000 VND  
- ⏱️ Полдня

## Практические советы

- 📷 Возьмите объектив с зумом  
- 🌦️ Избегайте туманной погоды  
- 🎟️ Бронируйте онлайн

## Историческая справка

Канатная дорога открыта в 2018 году и занесена в Книгу рекордов Гиннесса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Bánh Canh Chả Cá Ông Hai
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-banh-canh-cha-ca-ong-hai',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍜 Культовое блюдо острова  
- 🔥 Готовят прямо у входа  
- 💸 Очень бюджетно

## Коммуникация & сервис

- 🗣 Только вьетнамский  
- 💵 Наличные  
- 🪑 Простые столики

## Локальная ценность

Это место — гастрономическая легенда Фукуока, где едят и местные, и туристы.

## 🔵 Что попробовать обязательно

- Bánh canh chả cá (суп с рыбными котлетами)  
- Добавка с перцем и лаймом

## 🟢 Цены

- 💰 ~30 000–40 000 VND  
- 🍜 Средний чек: минимальный
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐚 Ốc 343
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-oc-343',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🐚 Уникальное меню из морских моллюсков  
- 🔥 Живая подача с гриля  
- 🌶️ Острые соусы

## Коммуникация & сервис

- 🗣 Минимальный английский  
- 💵 Наличные  
- 🪑 Неформальная посадка

## Локальная ценность

Ốc 343 показывает, как местные используют богатства моря в повседневной кухне.

## 🔵 Что попробовать обязательно

- Ốc nướng tiêu (улитки с перцем)  
- Ốc hấp sả (на пару с лемонграссом)  
- Разнообразные соусы

## 🟢 Цены

- 💰 150 000–300 000 VND  
- 🍽️ Средний чек: ~200 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦀 Gành Dầu Crab Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-ganh-dau-crab-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🦀 Свежайшие крабы Фукуока  
- 🔥 Приготовление на месте  
- 🌊 Аутентичная атмосфера

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🪑 Простые столы

## Локальная ценность

Рынок — живое отражение рыболовной культуры северного Фукуока.

## 🔵 Что попробовать обязательно

- Краба с перцем  
- Креветки на гриле  
- Мидии

## 🟢 Цены

- 💰 Зависит от веса (обычно 200 000–400 000 VND)
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌴 Rory’s Beach Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-rory-s-beach-bar',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌴 Идеальное место для заката  
- 🍹 Коктейли у моря  
- 🎶 Спокойная музыка

## Коммуникация & сервис

- 🌐 Английский  
- 🪑 Пляжная посадка  
- 📷 Отлично для фото

## Локальная ценность

Rory’s — неформальный символ пляжной культуры Фукуока.

## 🔵 Что попробовать обязательно

- Мохито и джин-тоник  
- Кокосы  
- Лёгкие закуски

## 🟢 Цены

- 💰 80 000–150 000 VND  
- 🍹 Средний чек: ~120 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 The Pepper Tree
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-the-pepper-tree',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌿 Садовая атмосфера  
- 🍽️ Европейская кухня высокого качества  
- 🕯️ Романтическая обстановка

## Коммуникация & сервис

- 🌐 Английский  
- 💳 Карты  
- 🪑 Садовая посадка

## Локальная ценность

The Pepper Tree представляет гастрономическую эволюцию Фукуока — от рыбы к международной кухне.

## 🔵 Что попробовать обязательно

- Стейки и паста  
- Авторские десерты  
- Винная карта

## 🟢 Цены

- 💰 300 000–600 000 VND  
- 🍽️ Средний чек: ~450 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍝 Luna Rossa
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-luna-rossa',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍕 Аутентичная итальянская пицца  
- 🌊 Вид на закат  
- 🍷 Винная карта

## Коммуникация & сервис

- 🌐 Английский  
- 💳 Карты  
- 🪑 Терраса у моря

## Локальная ценность

Luna Rossa демонстрирует, что на Фукуоке возможна качественная международная кухня.

## 🔵 Что попробовать обязательно

- Pizza Margherita  
- Паста с морепродуктами  
- Тирамису

## 🟢 Цены

- 💰 250 000–500 000 VND  
- 🍽️ Средний чек: ~350 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍲 PhuongBinh Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-phuongbinh-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍲 Широкая витрина вьетнамской кухни  
- 👨‍👩‍👧 Подходит для семей  
- 💸 Демократичные цены

## Коммуникация & сервис

- 🌐 Базовый английский  
- 💵 Наличные  
- 🪑 Удобная посадка

## Локальная ценность

PhuongBinh — надёжный выбор для знакомства с кухней Вьетнама без туристического глянца.

## 🔵 Что попробовать обязательно

- Phở  
- Cao lầu  
- Морепродукты

## 🟢 Цены

- 💰 100 000–200 000 VND  
- 🍽️ Средний чек: ~150 000 VND
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Shimmer Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-shimmer-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌊 Панорамный вид на закат  
- 🍽️ Авторская кухня  
- 🕯️ Романтическая атмосфера

## Коммуникация & сервис

- 🌐 Английский  
- 💳 Карты  
- 👔 Smart casual

## Локальная ценность

Shimmer представляет современную гастрономическую идентичность Фукуока.

## 🔵 Что попробовать обязательно

- Дегустационные сеты  
- Морепродукты с местными травами  
- Коктейли с перцем Фукуока

## 🟢 Цены

- 💰 500 000–1 000 000 VND  
- 🍽️ Формат: à la carte / сеты
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Đường Bàng Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-uong-bang-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌙 Менее туристический, чем Duong Dong  
- 🍢 Аутентичная уличная еда  
- 🛍️ Спокойная атмосфера

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🚶 Удобно для прогулок

## Локальная ценность

Đường Bàng — пример того, как ночные рынки работают «для своих».

## 🔵 Что попробовать обязательно

- Морепродукты на гриле  
- Лапшу и супы  
- Фрукты

## 🟢 Цены

- 💰 30 000–70 000 VND  
- 🛍️ Сувениры — по ситуации
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Hoan Kiem Lake & Ngoc Son Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-hoan-kiem-lake-ngoc-son-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌊 Главный символ Ханоя  
- 🛕 Духовное и культурное сердце столицы  
- 📸 Идеальное место для прогулок и фото

## Структура комплекса

- 🏯 Храм Нгок Шон на острове  
- 🌉 Мост Те Хук (Мост восходящего солнца)  
- 🐢 Памятник черепахе

## Билеты и посещение

- 💰 Вход в храм: ~30 000 VND  
- 🕒 Осмотр: 30–60 минут

## Практические советы

- 🌅 Лучшее время — утро или вечер  
- 👟 Удобная обувь для прогулок  
- 📷 Отлично подходит для пейзажной съёмки

## Историческая справка

Озеро связано с легендой о возвращённом мече дракона, который помог императору Ле Лою изгнать захватчиков.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏮 Old Quarter
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-old-quarter',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 📚 Первый университет страны  
- 🏯 Прекрасный образец конфуцианской архитектуры  
- 📸 Спокойная атмосфера в центре города

## Структура комплекса

- 🏯 Пять дворов храма  
- 🐉 Стелы на черепахах  
- 🌿 Сады и павильоны

## Билеты и посещение

- 💰 Вход: ~30 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 👕 Скромная одежда  
- 📷 Без вспышки внутри залов  
- 🌞 Лучше утром

## Историческая справка

Основан в 1070 году, храм стал центром образования и символом уважения к знаниям.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⚰️ Hoa Lo Prison
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-hoa-lo-prison',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⚰️ Важный исторический мемориал  
- 🕯️ Контраст между колониальным и военным прошлым  
- 📸 Архитектура и экспозиции

## Структура комплекса

- 🏛️ Камеры заключённых  
- 🗿 Скульптуры и мемориалы  
- ✈️ Экспозиция о «Ханойском Хилтоне»

## Билеты и посещение

- 💰 Вход: ~30 000 VND  
- ⏱️ Осмотр: 1 час

## Практические советы

- 🤫 Уважительное поведение  
- 📷 Фотографировать можно не везде  
- 🌞 Подходит для дневного визита

## Историческая справка

Тюрьма была построена французами для политзаключённых, а позже стала местом содержания американских лётчиков.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛪ St. Joseph’s Cathedral
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-st-joseph-s-cathedral',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⛪ Архитектурная доминанта Старого квартала  
- 📸 Популярная фотолокация  
- 🌇 Атмосфера вечерних встреч

## Структура комплекса

- ⛪ Интерьер собора  
- 🪟 Витражи  
- 🌆 Вид на площадь вечером

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Посещение вне служб

## Практические советы

- 👕 Скромная одежда  
- 🤫 Тишина внутри  
- 📷 Без вспышки

## Историческая справка

Собор построен в 1886 году на месте буддийского храма и стал символом католической общины Ханоя.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏯 One Pillar Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-one-pillar-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏯 Одна из самых узнаваемых пагод Вьетнама  
- 🌸 Символ духовности и легенды  
- 📸 Компактная, но значимая достопримечательность

## Структура комплекса

- 🏯 Саму пагоду  
- 🌺 Сад вокруг  
- 🕯️ Алтарь внутри

## Билеты и посещение

- 💰 Вход: ~25 000 VND  
- ⏱️ Осмотр: 15–20 минут

## Практические советы

- 👕 Скромная одежда  
- 📷 Без вспышки  
- 🌞 Хорошо совмещать с Ван Миеу

## Историческая справка

Пагода основана в 1049 году после сна императора Ли Тхай То, увидевшего богиню Авалокитешвару на лотосе.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 West Lake
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-west-lake',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌊 Самое большое озеро города  
- 🛕 Старейшая пагода Ханоя  
- 🌅 Отличное место для заката

## Структура комплекса

- 🛕 Пагоду Tran Quoc  
- 🚶 Прогулку по набережной  
- ☕ Кафе у воды

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступно круглосуточно

## Практические советы

- 🌇 Лучшее время — вечер  
- 🚲 Удобно на велосипеде  
- 📷 Отлично для пейзажей

## Историческая справка

Tran Quoc Pagoda основана в VI веке и перенесена на берег Западного озера в XVII веке.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Quan Thanh Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-quan-thanh-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛕 Древний храм с бронзовыми статуями  
- 🌳 Расположен у Западного озера  
- 📸 Спокойная атмосфера

## Структура комплекса

- 🗿 Бронзовую статую Тхань Хоанг Де  
- 🏯 Главный зал храма  
- 🌿 Двор и алтари

## Билеты и посещение

- 🆓 Бесплатно  
- ⏱️ Осмотр: 20–30 минут

## Практические советы

- 👕 Скромная одежда  
- 📷 Без вспышки  
- 🌞 Хорошо совмещать с прогулкой по озеру

## Историческая справка

Храм был построен в XI веке при династии Ли и считается одним из четырёх священных ворот древнего Тханг Лонга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏳️ Flag Tower of Hanoi
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-flag-tower-of-hanoi',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏳️ Редкий сохранившийся объект крепости Тханг Лонг  
- 🌄 Панорамный вид на город  
- 📸 Историческая архитектура

## Структура комплекса

- 🏳️ Саму башню  
- 🌆 Вид с верхней площадки  
- 🏛️ Военный музей рядом

## Билеты и посещение

- 💰 Вход: ~30 000 VND  
- ⏱️ Осмотр: 30 минут

## Практические советы

- 👟 Удобная обувь для подъёма  
- 📷 Хороший объектив  
- 🌞 Лучше днём

## Историческая справка

Башня была частью цитадели и использовалась для подачи сигналов. Сегодня — символ столицы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Ba Dinh Square & Ho Chi Minh Mausoleum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-ba-dinh-square-ho-chi-minh-mausoleum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏛️ Политическое сердце страны  
- 🕯️ Место паломничества для вьетнамцев  
- 📸 Архитектура и торжественная атмосфера

## Структура комплекса

- 🏛️ Мавзолей Хо Ши Мина  
- 🌳 Президентский дворец  
- 🏛️ Музей Хо Ши Мина

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Мавзолей открыт ограниченное время (обычно утром, кроме понедельника и пятницы)

## Практические советы

- 👕 Строгий дресс-код (без шорт, открытых плеч)  
- 📷 Без фото внутри мавзолея  
- ⏰ Приходите рано — очереди

## Историческая справка

На этой площади Хо Ши Мин провозгласил независимость Вьетнама в 1945 году.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Ben Thanh Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-ben-thanh-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛍️ Главный туристический и торговый символ Сайгона  
- 🍜 Большой выбор уличной еды  
- 🎁 Сувениры и подарки

## Структура комплекса

- 🏢 Иконическое здание с часовой башней  
- 🍢 Фуд-корт внутри рынка  
- 🛒 Ряды с одеждой, сувенирами и специями

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Работает ежедневно: днём и вечером

## Практические советы

- 💵 Торгуйтесь активно  
- 🎒 Следите за вещами  
- 🌙 Вечерний рынок — более атмосферный

## Историческая справка

Рынок был построен французами в начале XX века и с тех пор остаётся сердцем торговли Сайгона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛪ Notre-Dame Cathedral Basilica of Saigon
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-notre-dame-cathedral-basilica-of-saigon',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⛪ Архитектурная икона колониального Сайгона  
- 📸 Одна из самых узнаваемых достопримечательностей Вьетнама  
- 🏛️ Расположен в историческом центре

## Структура комплекса

- ⛪ Фасад и башни собора  
- 🪟 Витражи и интерьер  
- 🌆 Вид на площадь вечером

## Билеты и посещение

- 🆓 Бесплатно (внутрь не всегда пускают)  
- 🕒 Посещение вне служб

## Практические советы

- 👕 Скромная одежда  
- 🤫 Уважайте религиозный характер места  
- 📷 Без вспышки

## Историческая справка

Собор построен в 1880 году из кирпича, привезённого из Франции, и до сих пор не побелел.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 📮 Central Post Office
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-central-post-office',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 📮 Архитектурный шедевр колониальной эпохи  
- 📸 Впечатляющий интерьер с картами и деревянными стойками  
- 🏛️ Работает как почта до сих пор

## Структура комплекса

- 🗺️ Гигантские карты Индокитая  
- 🪑 Деревянные стойки и потолки  
- 📮 Почтовые услуги и сувениры

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Открыто днём

## Практические советы

- 📷 Отлично подходит для интерьерной съёмки  
- 📮 Можно отправить открытку с оригинальным штемпелем  
- 🌞 Лучше утром

## Историческая справка

Здание построено в 1891 году и приписывается ученикам Эйфеля, хотя точное авторство спорно.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Independence Palace
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-independence-palace',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏛️ Ключевой исторический объект страны  
- 🕰️ Сохранившиеся интерьеры 1960–70-х  
- 📸 Знаменитый танк у ворот

## Структура комплекса

- 🏢 Главное здание дворца  
- 📡 Комнату управления  
- 🛩️ Вертолётную площадку на крыше

## Билеты и посещение

- 💰 Вход: ~40 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 📷 Фотографировать можно почти везде  
- 🌞 Хорошо посещать днём  
- 👟 Удобная обувь

## Историческая справка

Дворец стал символом воссоединения Вьетнама после падения Сайгона в 1975 году.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⚔️ War Remnants Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-war-remnants-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⚔️ Глубокий исторический и гуманитарный контекст  
- 📸 Фотографии и экспонаты с сильным эмоциональным воздействием  
- 🕯️ Образовательное значение

## Структура комплекса

- 📸 Выставку «Агент Оранж»  
- ✈️ Авиационную технику на улице  
- 📜 Документальные материалы

## Билеты и посещение

- 💰 Вход: ~40 000 VND  
- ⏱️ Осмотр: 1,5–2 часа

## Практические советы

- 🤫 Уважительное поведение  
- 📷 Без вспышки в залах  
- 🌞 Подходит для дневного визита

## Историческая справка

Музей основан в 1975 году и изначально назывался «Музей американских преступлений».
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Jade Emperor Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-jade-emperor-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛕 Один из самых красивых храмов города  
- 🐉 Богатый декор и скульптуры  
- 📸 Фотогеничная атмосфера

## Структура комплекса

- 🗿 Статуи божеств и демонов  
- 🕯️ Алтари и курения благовоний  
- 🐢 Пруд с черепахами

## Билеты и посещение

- 🆓 Бесплатно  
- ⏱️ Осмотр: 30–45 минут

## Практические советы

- 👕 Скромная одежда  
- 🤫 Тишина и уважение  
- 📷 Без вспышки

## Историческая справка

Храм построен в 1909 году китайской общиной и посвящён Нефритовому императору.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Binh Tay Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-binh-tay-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛍️ Аутентичная атмосфера без туристического глянца  
- 🧺 Огромный выбор товаров и продуктов  
- 👀 Наблюдение за повседневной жизнью

## Структура комплекса

- 🍜 Зоны стрит-фуда  
- 🧺 Ряды сухофруктов и специй  
- 🛒 Оптовые лавки

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Лучше утром

## Практические советы

- 💵 Наличные  
- 🎒 Следите за вещами  
- 🗣 Только вьетнамский/китайский

## Историческая справка

Рынок был построен в 1928 году и стал центром торговли китайской диаспоры.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 Tao Dan Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-tao-dan-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌳 Оазис зелени в центре мегаполиса  
- 👨‍🦯 Место утренних занятий тайчи и йогой  
- 📸 Спокойная атмосфера

## Структура комплекса

- 🦜 Вольер с птицами  
- 🌸 Цветочные клумбы  
- 🚶 Прогулочные дорожки

## Билеты и посещение

- 💰 Вход: ~10 000 VND  
- 🕒 Открыт с утра до вечера

## Практические советы

- 🌅 Лучше утром  
- 👟 Удобная обувь  
- 📷 Хорошо для уличной фотографии

## Историческая справка

Парк был разбит французами в начале XX века как Botanical Garden.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Bitexco Financial Tower & Skydeck
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-bitexco-financial-tower-skydeck',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌃 Панорамный вид на весь город  
- 🏙️ Архитектурная доминанта  
- 📸 Отличное место для ночных фото

## Структура комплекса

- 🌆 Вид на Сайгон с высоты  
- 🏙️ Городские огни вечером  
- 📷 Интерактивные точки на Skydeck

## Билеты и посещение

- 💰 Вход: ~200 000 VND  
- 🕒 Открыт до 21:30

## Практические советы

- 🌇 Лучше вечером  
- 📷 Возьмите объектив с зумом  
- 🎟️ Бронируйте онлайн

## Историческая справка

Башня открыта в 2010 году и стала символом современного Сайгона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Saigon River Promenade
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-saigon-river-promenade',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌊 Спокойное место для прогулок  
- 🌃 Вечерние виды на реку  
- ☕ Кафе и рестораны у воды

## Структура комплекса

- 🌉 Мост Thu Thiem  
- 🚢 Корабли и лодки  
- 🌆 Закат над водой

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступно круглосуточно

## Практические советы

- 🌇 Лучше вечером  
- 👟 Удобная обувь  
- 📷 Отлично для пейзажей

## Историческая справка

Набережная была реконструирована в 2000-х как общественное пространство.
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
-- Blocks: 109

-- city/dad tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-da-nang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dad',
  'overview',
  'ru',
  'Обзор',
  'Дананг — современный прибрежный город в центральном Вьетнаме, который часто называют одним из лучших городов страны для жизни. Он сочетает развитую инфраструктуру, чистоту, удобную планировку, длинные песчаные пляжи и более спокойный ритм по сравнению с мегаполисами.

Город выступает важным логистическим и IT-хабом региона, а также популярным местом для релокации экспатов, семей и digital nomads. Дананг выгодно расположен между Хюэ и Хойаном, что усиливает его культурную и туристическую привлекательность.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dad tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-da-nang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dad',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: my-khe
    title: Май Кхе
    description: Прибрежный район с популярным пляжем, кондоминиумами и кафе, любимый экспатами.
  - id: son-tra
    title: Сон Ча
    description: Полуостров и район с зелёными зонами, храмами и видами на море.
  - id: hai-chau
    title: Хай Чау
    description: Центральный административный и деловой район с рынками и офисами.
  - id: thanh-khe
    title: Тхань Кхе
    description: Жилой район с локальной жизнью и более доступной арендой.
  - id: ngu-hanh-son
    title: Нгу Хань Шон
    description: Район Мраморных гор, курорты и близость к Хойану.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dad tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-da-nang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dad',
  'accommodation',
  'ru',
  'Проживание',
  'В Дананге представлен широкий выбор жилья: апартаменты, кондоминиумы, сервисные квартиры и частные дома. Наиболее популярны районы у пляжа Май Кхе и вблизи центра.

Стоимость аренды ниже, чем в Хошимине, и сопоставима или ниже, чем в Ханое. Город хорошо подходит для долгосрочного проживания благодаря сочетанию цены, качества и инфраструктуры.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dad tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-da-nang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dad',
  'food',
  'ru',
  'Еда и кафе',
  'Гастрономия Дананга сочетает центральную вьетнамскую кухню и интернациональные форматы. Популярны морепродукты, блюда с лапшой, а также кафе с западным меню.

Кофейная культура и заведения для работы активно развиваются, особенно в районах, где живут экспаты.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dad tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-da-nang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dad',
  'transport',
  'ru',
  'Транспорт',
  'Город компактный и удобный для передвижения на мотобайке, велосипеде и такси. Трафик заметно спокойнее, чем в Хошимине и Ханое.

Международный аэропорт Дананга находится в черте города и обеспечивает связи с внутренними и зарубежными направлениями.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dad tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-da-nang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dad',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический. Сухой и солнечный период длится примерно с февраля по август.

С сентября по ноябрь возможны тайфуны и сильные дожди. Зима мягкая, без холода, но более облачная.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dad tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-da-nang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dad',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг представлен рынками, торговыми центрами и супермаркетами. Ассортимент достаточен для повседневной жизни, но уступает Хошимину.

Популярны рынки с морепродуктами и свежими продуктами.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dad tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-da-nang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dad',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь в Дананге умеренная. Работают бары, лаунжи и кафе у моря, но город не ориентирован на клубные развлечения.

Формат досуга — вечерние прогулки, рестораны и общение.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dad tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-da-nang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dad',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - best_city_to_live
  - beach_life
  - expat_relocation
  - central_vietnam',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dad tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-da-nang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dad',
  'tips',
  'ru',
  'Практическая информация',
  'Дананг считается одним из самых безопасных и чистых городов Вьетнама. Английский язык широко используется в туристических и экспатских районах.

Медицинская инфраструктура достаточна для повседневных нужд, за сложным лечением обращаются в Хошимин или Ханой.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dad tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-da-nang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dad',
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

-- city/dad tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-da-nang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dad',
  'budget',
  'ru',
  'Цены и бюджет',
  'Дананг — один из самых сбалансированных по стоимости городов страны. Комфортный бюджет одного человека составляет 800–1200 USD в месяц.

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

-- city/dla tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-dalat.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dla',
  'overview',
  'ru',
  'Обзор',
  'Далат — горный город-курорт в центральных нагорьях Вьетнама, расположенный на высоте около 1500 метров над уровнем моря. Благодаря высоте и климату Далат резко отличается от остальной части страны: здесь прохладно, зелено и гораздо менее влажно.

Город был основан французами как курорт и до сих пор сохраняет элементы европейской архитектуры, сосновые леса и размеренный ритм жизни. Далат популярен среди вьетнамцев, молодёжи, творческих людей и экспатов, ищущих спокойную жизнь вдали от жары и хаоса мегаполисов.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dla tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-dalat.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dla',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: city-center
    title: Центр Далата
    description: Район озера Суан Хыонг, рынков, кафе и городской инфраструктуры.
  - id: old-villas
    title: Французские виллы
    description: Холмистые кварталы со старыми виллами, соснами и тихой атмосферой.
  - id: ward-3
    title: Район Ward 3
    description: Жилой район с кафе, школами и более доступной арендой.
  - id: outskirts
    title: Окрестности Далата
    description: Сельские и природные зоны с фермами, водопадами и теплицами.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dla tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-dalat.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dla',
  'accommodation',
  'ru',
  'Проживание',
  'В Далате представлены апартаменты, дома, гестхаусы и небольшие отели. Современных кондоминиумов немного, рынок жилья ориентирован на долгосрочную аренду и местных жителей.

Стоимость проживания ниже, чем в крупных городах и курортах у моря. Далат подходит для спокойной жизни, удалённой работы и сезонного проживания.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dla tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-dalat.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dla',
  'food',
  'ru',
  'Еда и кафе',
  'Гастрономическая сцена Далата сочетает центрально-вьетнамскую кухню, уличную еду и современные кафе. Город известен кофейной культурой, десертами и фермерскими продуктами.

Популярны блюда из овощей, горячие супы и street food, особенно актуальные в прохладную погоду.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dla tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-dalat.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dla',
  'transport',
  'ru',
  'Транспорт',
  'Город компактный, передвижение осуществляется на мотобайках и такси. Пешие прогулки возможны в центре, но рельеф холмистый.

Далат связан автобусным сообщением с Хошимином и Нячангом. Аэропорт Льенкхыонг расположен примерно в 30 км от города.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dla tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-dalat.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dla',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат субтропический горный. Температуры в течение года обычно держатся в диапазоне +15…+25 °C.

Сезон дождей — с мая по октябрь, но дожди чаще кратковременные. В зимние месяцы вечерами бывает прохладно.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dla tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-dalat.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dla',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг в Далате представлен рынками и небольшими магазинами. Город известен фермерскими продуктами, цветами, кофе и сувенирами.

За крупными покупками обычно ездят в Хошимин или Нячанг.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dla tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-dalat.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dla',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь спокойная. Основные активности — вечерние рынки, кафе, живая музыка и прогулки.

Далат не ориентирован на клубную культуру и подходит для тихого образа жизни.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dla tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-dalat.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dla',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - mountain_city
  - cool_climate
  - creative_life
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

-- city/dla tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-dalat.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dla',
  'tips',
  'ru',
  'Практическая информация',
  'Далат считается безопасным и дружелюбным городом. Английский язык используется ограниченно, но в туристической среде проблем с коммуникацией обычно нет.

Из-за климата рекомендуется тёплая одежда для вечеров и хорошая защита от дождя в сезон муссонов.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/dla tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-dalat.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dla',
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

-- city/dla tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-dalat.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'dla',
  'budget',
  'ru',
  'Цены и бюджет',
  'Далат — один из самых доступных городов Вьетнама. Комфортный бюджет одного человека составляет 600–1000 USD в месяц.

Аренда жилья начинается от 200–400 USD, питание и транспорт обходятся недорого.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/han tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hanoi.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'han',
  'overview',
  'ru',
  'Обзор',
  'Ханой — столица Вьетнама и его политическое, административное и культурное сердце. Это один из самых древних городов Юго-Восточной Азии, где современная жизнь тесно переплетена с тысячелетней историей, конфуцианскими традициями и социалистическим наследием.

Ханой заметно отличается от Хошимина: он более сдержанный, традиционный и консервативный по ритму и менталитету. Город подходит тем, кто интересуется историей, культурой и «глубинным» Вьетнамом, но может потребовать большего времени на адаптацию.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/han tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hanoi.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'han',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: old-quarter
    title: Старый квартал
    description: Исторический центр с узкими улицами, рынками, уличной едой и туристической атмосферой.
  - id: hoan-kiem
    title: Хоан Кьем
    description: Центральный район вокруг одноимённого озера, символ Ханоя.
  - id: ba-dinh
    title: Ба Динь
    description: Политический и административный район с мавзолеем Хо Ши Мина и посольствами.
  - id: tay-ho
    title: Тай Хо (Западное озеро)
    description: Главный экспатский район с кафе, виллами и более комфортной средой.
  - id: dong-da
    title: Донг Да
    description: Плотнозаселённый жилой район с локальной жизнью и университетами.
  - id: cau-giay
    title: Кау Зяй
    description: Современный район с офисами, IT-компаниями и новыми жилыми комплексами.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/han tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hanoi.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'han',
  'accommodation',
  'ru',
  'Проживание',
  'Жильё в Ханое представлено апартаментами, кондоминиумами и частными домами. Экспаты чаще всего выбирают район Тай Хо и новые жилые комплексы в западной части города.

Стоимость аренды ниже, чем в Хошимине, но комфорт сильно зависит от района и качества здания. В старых кварталах инфраструктура может быть менее современной.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/han tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hanoi.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'han',
  'food',
  'ru',
  'Еда и кафе',
  'Ханой считается родиной многих классических блюд вьетнамской кухни. Здесь особенно популярны фо, бунча, банькуон и уличная еда.

Кафе и рестораны часто небольшие и локальные. В последние годы активно развивается кофейная культура и появляются современные заведения, особенно в районах Тай Хо и Хоан Кьем.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/han tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hanoi.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'han',
  'transport',
  'ru',
  'Транспорт',
  'Основной транспорт — мотобайки, автобусы и такси. В последние годы активно развивается метро, но оно пока не покрывает весь город.

Трафик плотный, особенно в центральных районах. Пешие прогулки возможны в отдельных зонах, но город в целом не очень удобен для ходьбы.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/han tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hanoi.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'han',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат субтропический с выраженной сезонностью. В Ханое есть прохладная зима — редкость для Вьетнама.

- Зима (декабрь–февраль): +10…+20 °C, сыро и прохладно  
- Лето (май–сентябрь): жарко и влажно, дожди  

Самое комфортное время — весна и осень.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/han tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hanoi.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'han',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг в Ханое представлен рынками, торговыми улицами и современными моллами. Ассортимент уступает Хошимину, но полностью закрывает бытовые потребности.

Особенно популярны рынки с текстилем, сувенирами и ремесленными изделиями.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/han tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hanoi.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'han',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь в Ханое спокойнее, чем в Хошимине. Основные активности сосредоточены вокруг Старого квартала и районов у озёр.

Формат — бары, живая музыка, кафе и вечерние прогулки.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/han tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hanoi.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'han',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - cultural_capital
  - historic_city
  - traditional_vietnam
  - expat_north',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/han tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hanoi.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'han',
  'tips',
  'ru',
  'Практическая информация',
  'Ханой безопасен, но может показаться хаотичным и шумным. Зимой многие иностранцы испытывают дискомфорт из-за холода и влажности в домах без отопления.

Английский язык распространён меньше, чем на юге, но в туристических и экспатских районах проблем с коммуникацией обычно нет.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/han tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hanoi.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'han',
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

-- city/han tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hanoi.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'han',
  'budget',
  'ru',
  'Цены и бюджет',
  'Ханой немного дешевле Хошимина. Комфортный бюджет одного человека составляет 800–1300 USD в месяц.

Аренда квартиры начинается от 350–600 USD, питание и транспорт обходятся умеренно.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgn tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-ho-chi-minh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgn',
  'overview',
  'ru',
  'Обзор',
  'Хошимин (бывший Сайгон) — крупнейший город Вьетнама и главный экономический мотор страны. Это финансовый, предпринимательский и стартап-хаб, где сосредоточены международные компании, IT-бизнес, сервисные индустрии и активное экспатское сообщество.

Город отличается быстрым ритмом жизни, высокой плотностью населения и выраженной космополитичностью. Хошимин часто выбирают предприниматели, фрилансеры и digital nomads, которым важны возможности для заработка, нетворкинга и развития проектов в Азии.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgn tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-ho-chi-minh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgn',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: district-1
    title: Район 1
    description: Центральный деловой и туристический район с офисами, ресторанами и ночной жизнью.
  - id: district-3
    title: Район 3
    description: Более спокойный центральный район с французской архитектурой и жилой застройкой.
  - id: thao-dien
    title: Thao Dien (Район 2)
    description: Главный экспатский кластер с кондоминиумами, международными школами и кафе.
  - id: phu-my-hung
    title: Phu My Hung (Район 7)
    description: Современный плановый район с парками, широкими улицами и бизнес-центрами.
  - id: binh-thanh
    title: Бинь Тхань
    description: Смешанный район с доступным жильём и быстрым доступом к центру.
  - id: tan-binh
    title: Тан Бинь
    description: Район рядом с аэропортом, удобный для логистики и краткосрочного проживания.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgn tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-ho-chi-minh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgn',
  'accommodation',
  'ru',
  'Проживание',
  'Хошимин предлагает самый широкий выбор жилья во Вьетнаме: современные кондоминиумы, сервисные апартаменты и частные дома. Экспаты чаще всего селятся в районах Thao Dien, Phu My Hung и центральных округах.

Стоимость аренды выше, чем в других городах страны, но остаётся конкурентоспособной по мировым меркам. Город подходит для долгосрочного проживания при активной деловой или профессиональной занятости.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgn tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-ho-chi-minh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgn',
  'food',
  'ru',
  'Еда и кафе',
  'Гастрономическая сцена Хошимина — одна из самых насыщенных в Азии. Здесь представлены кухни всех регионов Вьетнама, а также французская, японская, корейская, китайская и западная кухни.

Уличная еда, кофейни и рестораны мирового уровня сосуществуют в одном пространстве. Кофейная культура особенно развита и является важной частью городской жизни.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgn tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-ho-chi-minh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgn',
  'transport',
  'ru',
  'Транспорт',
  'Основной транспорт — мотобайки, такси и сервисы Grab и Be. Общественный транспорт развивается: введены новые линии метро, но пробки остаются частью повседневной реальности.

Международный аэропорт Таншоннят обеспечивает связи с Азией и другими регионами мира. Перелёты внутри страны широко используются из-за протяжённости Вьетнама.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgn tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-ho-chi-minh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgn',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический, жаркий и влажный круглый год. Средние температуры держатся в диапазоне +26…+34 °C.

Сухой сезон длится с декабря по апрель. Сезон дождей — с мая по ноябрь, дожди обычно кратковременные и идут во второй половине дня.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgn tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-ho-chi-minh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgn',
  'shopping',
  'ru',
  'Шопинг',
  'Хошимин — главный торговый центр страны. Здесь расположены крупные моллы, рынки и специализированные кварталы.

Ассортимент включает международные бренды, электронику, локальные товары и ремесленные изделия.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgn tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-ho-chi-minh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgn',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь Хошимина активная и разнообразная. Работают бары, клубы, rooftop-лаунжи и музыкальные площадки, особенно в Районе 1 и Thao Dien.

Город ориентирован на социальную и деловую активность, встречи и нетворкинг.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgn tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-ho-chi-minh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgn',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - business_city
  - startup_hub
  - digital_nomad
  - expat_life',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgn tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-ho-chi-minh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgn',
  'tips',
  'ru',
  'Практическая информация',
  'Хошимин безопасен, но шумный и хаотичный. Основные сложности связаны с трафиком, жарой и уровнем шума.

Английский язык широко используется в бизнесе и сфере услуг. Медицинская инфраструктура представлена международными клиниками и госпиталями.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/sgn tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-ho-chi-minh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgn',
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

-- city/sgn tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-ho-chi-minh.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'sgn',
  'budget',
  'ru',
  'Цены и бюджет',
  'Хошимин — самый дорогой город Вьетнама. Комфортный бюджет одного человека составляет 1000–1600 USD в месяц.

Аренда современной квартиры начинается от 400–700 USD, расходы на питание и транспорт умеренные.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hoi tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hoi-an.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hoi',
  'overview',
  'ru',
  'Обзор',
  'Хойан — старинный торговый город в центральном Вьетнаме, объект Всемирного наследия ЮНЕСКО и один из самых атмосферных городов страны. Он известен хорошо сохранившейся архитектурой XV–XIX веков, узкими улицами, фонарями и медленным, созерцательным ритмом жизни.

Хойан не является мегаполисом и не подходит для активного бизнеса, но идеально подойдёт для творчества, спокойного проживания, удалённой работы и культурного погружения. Город часто выбирают художники, фотографы, писатели и те, кто ищет «тихий Вьетнам».',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hoi tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hoi-an.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hoi',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: old-town
    title: Старый город
    description: Исторический центр ЮНЕСКО с пешеходными улицами, храмами и домами купцов.
  - id: an-hoi
    title: Ан Хой
    description: Островная часть рядом со Старым городом с кафе, барами и вечерней жизнью.
  - id: cam-pho
    title: Кам Фо
    description: Жилой район рядом с центром, популярный для долгосрочной аренды.
  - id: cam-thanh
    title: Кам Тхань
    description: Район кокосовых рощ и водных каналов, более сельская и зелёная среда.
  - id: an-bang
    title: Ан Банг
    description: Прибрежный район с пляжем, кафе и экспатским сообществом.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hoi tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hoi-an.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hoi',
  'accommodation',
  'ru',
  'Проживание',
  'В Хойане распространены гестхаусы, небольшие отели, дома и апартаменты. Для долгосрочного проживания чаще выбирают районы Кам Фо, Кам Тхань и Ан Банг.

Стоимость аренды умеренная и ниже, чем в Дананге у моря. Город подходит для спокойной жизни, но выбор современного жилья ограничен по сравнению с крупными городами.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hoi tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hoi-an.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hoi',
  'food',
  'ru',
  'Еда и кафе',
  'Хойан славится собственной региональной кухней. Фирменные блюда — cao lầu, mì quảng и white rose dumplings.

В городе много кафе, ориентированных на иностранцев, а также уютных ресторанов с вьетнамской и интернациональной кухней. Кофейная культура развита, но в более камерном формате.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hoi tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hoi-an.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hoi',
  'transport',
  'ru',
  'Транспорт',
  'Город компактный и удобен для передвижения пешком или на велосипеде. Также используются мотобайки и такси.

Хойан расположен примерно в 30 км от аэропорта Дананга, который обеспечивает международное и внутреннее авиасообщение.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hoi tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hoi-an.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hoi',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический. Лучшее время для посещения — с февраля по август, когда сухо и солнечно.

С сентября по ноябрь возможны сильные дожди и подтопления, так как город расположен у реки. Зима мягкая, но более влажная.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hoi tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hoi-an.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hoi',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг в Хойане ориентирован на ремёсла, одежду, сувениры и изделия ручной работы. Город известен ателье по пошиву одежды на заказ.

Современные торговые центры отсутствуют; за крупными покупками обычно ездят в Дананг.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hoi tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hoi-an.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hoi',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь в Хойане спокойная и атмосферная. Основные активности — вечерние прогулки, фонари, бары у реки и небольшие музыкальные заведения.

Город не ориентирован на клубную культуру и ночные вечеринки.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hoi tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hoi-an.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hoi',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - unesco_city
  - creative_life
  - slow_travel
  - cultural_immersion',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hoi tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hoi-an.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hoi',
  'tips',
  'ru',
  'Практическая информация',
  'Хойан считается безопасным и дружелюбным городом. Английский язык широко используется в туристической среде.

Из-за статуса ЮНЕСКО действуют ограничения на застройку и транспорт, что сохраняет атмосферу, но снижает уровень современной инфраструктуры.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hoi tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hoi-an.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hoi',
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

-- city/hoi tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hoi-an.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hoi',
  'budget',
  'ru',
  'Цены и бюджет',
  'Хойан — доступный город для жизни. Комфортный бюджет одного человека составляет 700–1100 USD в месяц.

Аренда жилья начинается от 250–450 USD, питание и транспорт обходятся недорого.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hue tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hue.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hue',
  'overview',
  'ru',
  'Обзор',
  'Хюэ — бывшая имперская столица Вьетнама и один из самых исторически значимых городов страны. В течение почти полутора веков Хюэ был резиденцией династии Нгуен, что оставило после себя уникальное архитектурное и культурное наследие.

Город отличается спокойным, созерцательным ритмом жизни и сильной привязкой к традициям. Хюэ подходит для культурного туризма, неспешного проживания, изучения истории и религиозных практик, но менее ориентирован на бизнес и активную экспатскую жизнь.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hue tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hue.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hue',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: citadel
    title: Императорская цитадель
    description: Историческое сердце города с дворцами, храмами и стенами ЮНЕСКО.
  - id: perfumer-river
    title: Район реки Хыонг
    description: Живописная зона вдоль Парфюмной реки с храмами и набережными.
  - id: an-cuu
    title: Ан Кыу
    description: Более современный жилой район с кафе и городской инфраструктурой.
  - id: vinh-ninh
    title: Винь Нинь
    description: Центральный район с рынками, школами и локальной жизнью.
  - id: suburbs
    title: Пригороды Хюэ
    description: Тихие зоны с пагодами, гробницами императоров и сельским ландшафтом.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hue tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hue.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hue',
  'accommodation',
  'ru',
  'Проживание',
  'Жильё в Хюэ представлено апартаментами, домами и небольшими гестхаусами. Современных кондоминиумов немного, рынок ориентирован на местных жителей и долгосрочную аренду.

Стоимость проживания ниже, чем в Дананге и Хошимине. Хюэ подходит для тех, кто ищет спокойную жизнь с минимальным уровнем суеты и низкими расходами.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hue tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hue.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hue',
  'food',
  'ru',
  'Еда и кафе',
  'Кухня Хюэ считается одной из самых изысканных во Вьетнаме и уходит корнями в имперские традиции. Блюда отличаются аккуратной подачей, небольшими порциями и сложным балансом вкусов.

Популярны блюда bánh bèo, bún bò Huế и различные виды рисовых закусок. Кафе и рестораны чаще локальные, ориентированные на традиционную кухню.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hue tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hue.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hue',
  'transport',
  'ru',
  'Транспорт',
  'Город компактный, основные перемещения осуществляются на мотобайках, велосипедах и такси. Трафик спокойный по сравнению с крупными мегаполисами.

Хюэ связан железнодорожным и автобусным сообщением с Данангом и Ханоем. Международный аэропорт Фубай находится примерно в 15 км от центра города.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hue tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hue.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hue',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический с выраженной сезонностью. Лето жаркое и сухое, зима более прохладная и влажная.

С сентября по ноябрь возможны сильные дожди и наводнения. Лучшее время для посещения — с февраля по август.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hue tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hue.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hue',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг в Хюэ ограничен рынками и небольшими магазинами. Основные покупки — продукты, ремесленные изделия и сувениры.

За современными торговыми центрами обычно ездят в Дананг.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hue tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hue.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hue',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь в Хюэ спокойная и сдержанная. Основные активности — вечерние прогулки, кафе у реки и небольшие бары.

Город не ориентирован на клубную культуру и подходит для тихого вечернего отдыха.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hue tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hue.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hue',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - imperial_capital
  - unesco_heritage
  - cultural_history
  - slow_life',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hue tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hue.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hue',
  'tips',
  'ru',
  'Практическая информация',
  'Хюэ считается безопасным городом. Английский язык используется ограниченно, но в туристических местах проблем с коммуникацией обычно нет.

В сезон дождей стоит учитывать риск подтоплений и повышенную влажность.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/hue tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hue.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hue',
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

-- city/hue tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-hue.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'hue',
  'budget',
  'ru',
  'Цены и бюджет',
  'Хюэ — один из самых недорогих городов Вьетнама. Комфортный бюджет одного человека составляет 600–1000 USD в месяц.

Аренда жилья начинается от 200–400 USD, питание и транспорт обходятся дёшево.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ntr tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-nha-trang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ntr',
  'overview',
  'ru',
  'Обзор',
  'Нячанг — один из самых известных пляжных курортов Вьетнама, расположенный на юге центрального побережья. Город известен протяжённой набережной, тёплым морем, развитой туристической инфраструктурой и круглогодочным курортным ритмом жизни.

Нячанг популярен как место зимовки, длительного проживания и отдыха у моря. Его часто выбирают экспаты, фрилансеры и семьи, которым важны доступные цены, море в шаговой доступности и относительно развитая городская среда.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ntr tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-nha-trang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ntr',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: city-center
    title: Центр Нячанга
    description: Прибрежная зона с набережной, отелями, ресторанами и туристической инфраструктурой.
  - id: loc-tho
    title: Лок Тхо
    description: Центральный жилой район, популярный у экспатов и долгосрочных арендаторов.
  - id: phuoc-long
    title: Фыок Лонг
    description: Южный район с более доступной арендой и локальной жизнью.
  - id: vinh-hai
    title: Винь Хай
    description: Северная часть города с новыми жилыми комплексами и пляжами.
  - id: suburbs
    title: Пригороды Нячанга
    description: Более спокойные зоны с домами, фермами и природным окружением.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ntr tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-nha-trang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ntr',
  'accommodation',
  'ru',
  'Проживание',
  'Нячанг предлагает широкий выбор жилья: апартаменты, кондоминиумы, сервисные квартиры и частные дома. Вдоль побережья преобладают высотные здания, ориентированные на аренду и туристов.

Стоимость аренды ниже, чем в Хошимине и Дананге у моря. Город особенно популярен для сезонного проживания и зимовок.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ntr tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-nha-trang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ntr',
  'food',
  'ru',
  'Еда и кафе',
  'Гастрономия Нячанга ориентирована на морепродукты и туристическую аудиторию. Здесь широко представлены вьетнамская, азиатская и международная кухни.

Уличная еда, кафе и рестораны доступны в большом количестве, особенно в центральных районах и вдоль набережной.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ntr tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-nha-trang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ntr',
  'transport',
  'ru',
  'Транспорт',
  'Город компактный и удобен для передвижения на мотобайке, велосипеде и такси. Общественный транспорт развит слабо.

Аэропорт Камрань расположен примерно в 35 км от города и обеспечивает международное и внутреннее авиасообщение.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ntr tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-nha-trang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ntr',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический и относительно сухой по сравнению с другими регионами Вьетнама. Лучшее время для проживания и отдыха — с января по сентябрь.

С октября по декабрь возможны сильные дожди и штормы, но сезон дождей короче, чем в центральном Вьетнаме.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ntr tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-nha-trang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ntr',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг в Нячанге представлен торговыми центрами, рынками и туристическими магазинами. Ассортимент ориентирован на повседневные нужды и туристов.

За более разнообразным выбором товаров часто ездят в Хошимин.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ntr tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-nha-trang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ntr',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь в Нячанге умеренно активная. Работают бары, рестораны, караоке и пляжные заведения.

Город не ориентирован на масштабные клубные вечеринки, но предлагает достаточное количество вечерних развлечений.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ntr tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-nha-trang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ntr',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - wintering_city
  - beach_life
  - expat_community
  - resort_living',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ntr tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-nha-trang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ntr',
  'tips',
  'ru',
  'Практическая информация',
  'Нячанг считается безопасным городом. Английский язык используется в туристических и экспатских районах, однако за пределами центра он менее распространён.

Интернет стабильный, подходит для удалённой работы. Медицинская инфраструктура представлена частными клиниками и госпиталями среднего уровня.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/ntr tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-nha-trang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ntr',
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

-- city/ntr tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-nha-trang.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'ntr',
  'budget',
  'ru',
  'Цены и бюджет',
  'Нячанг — доступный курортный город. Комфортный бюджет одного человека составляет 700–1200 USD в месяц.

Аренда жилья начинается от 250–450 USD, питание и транспорт обходятся недорого.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/phu tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-phu-quoc.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'phu',
  'overview',
  'ru',
  'Обзор',
  'Фукуок — крупнейший остров Вьетнама, расположенный в Сиамском заливе недалеко от побережья Камбоджи. Остров известен белыми пляжами, тропической природой, статусом свободной экономической зоны и активным развитием туристической и инвестиционной инфраструктуры.

Фукуок сочетает курортный формат с возможностями для долгосрочного проживания. Его выбирают экспаты, зимовщики, предприниматели и инвесторы, ориентированные на недвижимость и туристические сервисы. По сравнению с материковыми городами здесь спокойнее, но уровень сервиса в ключевых зонах достаточно высок.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/phu tab=districts (Районы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-phu-quoc.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'phu',
  'districts',
  'ru',
  'Районы',
  '@districts:
  - id: duong-dong
    title: Дуонг Донг
    description: Административный центр острова с рынками, кафе, портом и основной городской инфраструктурой.
  - id: long-beach
    title: Лонг Бич
    description: Прибрежная зона с курортами, кондоминиумами и пляжами, популярная для проживания.
  - id: an-thoi
    title: Ан Тхой
    description: Южная часть острова с новыми курортными проектами, канатной дорогой и мариной.
  - id: ong-lang
    title: Онг Ланг
    description: Более спокойный район с пляжами и бутик-отелями, подходящий для размеренной жизни.
  - id: north-phu-quoc
    title: Север Фукуока
    description: Природные зоны, национальный парк и уединённые пляжи с низкой плотностью застройки.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/phu tab=accommodation (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-phu-quoc.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'phu',
  'accommodation',
  'ru',
  'Проживание',
  'На Фукуоке представлены апартаменты, кондоминиумы, дома и виллы, а также курортные резиденции. В последние годы активно развивается рынок недвижимости, ориентированный на иностранцев.

Стоимость аренды варьируется в зависимости от района и сезона. Для долгосрочного проживания чаще выбирают Дуонг Донг, Лонг Бич и Онг Ланг.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/phu tab=food (Еда и кафе) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-phu-quoc.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'phu',
  'food',
  'ru',
  'Еда и кафе',
  'Гастрономия Фукуока основана на морепродуктах, рыбе и южновьетнамской кухне. Остров известен рыбным соусом (nuoc mam), морскими ежами и крабами.

В туристических районах представлены кафе и рестораны с интернациональной кухней. В локальных районах преобладают простые семейные заведения.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/phu tab=transport (Транспорт) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-phu-quoc.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'phu',
  'transport',
  'ru',
  'Транспорт',
  'Основной транспорт — мотобайки, такси и трансферы. Общественный транспорт развит слабо.

Международный аэропорт Фукуока обеспечивает прямые рейсы по Вьетнаму и в некоторые зарубежные направления. Остров также связан морскими маршрутами с материком.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/phu tab=weather (Погода и сезонность) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-phu-quoc.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'phu',
  'weather',
  'ru',
  'Погода и сезонность',
  'Климат тропический. Лучшее время для проживания и отдыха — с ноября по апрель, когда сухо и солнечно.

С мая по октябрь длится сезон дождей, возможны штормы на море, но осадки обычно кратковременные.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/phu tab=shopping (Шопинг) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-phu-quoc.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'phu',
  'shopping',
  'ru',
  'Шопинг',
  'Шопинг на Фукуоке ограничен повседневными товарами, рынками и туристическими магазинами. Основные покупки совершаются в Дуонг Донге.

За крупным шопингом и специализированными товарами чаще ездят в Хошимин.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/phu tab=nightlife (Ночная жизнь) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-phu-quoc.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'phu',
  'nightlife',
  'ru',
  'Ночная жизнь',
  'Ночная жизнь спокойная и курортная. Основные активности — бары у моря, рестораны и вечерние мероприятия при отелях.

Фукуок не ориентирован на клубную культуру и подходит для тихого вечернего отдыха.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/phu tab=guides (Гайды) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-phu-quoc.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'phu',
  'guides',
  'ru',
  'Гайды',
  '@guides:
  - island_relocation
  - investment_property
  - beach_living
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

-- city/phu tab=tips (Практическая информация) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-phu-quoc.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'phu',
  'tips',
  'ru',
  'Практическая информация',
  'Фукуок считается безопасным островом. Инфраструктура активно развивается, но за пределами туристических зон возможны перебои с интернетом и сервисами.

Медицина представлена частными клиниками; за сложным лечением обращаются в Хошимин.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- city/phu tab=reviews (Отзывы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-phu-quoc.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'phu',
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

-- city/phu tab=budget (Цены и бюджет) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/city-phu-quoc.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'city',
  'phu',
  'budget',
  'ru',
  'Цены и бюджет',
  'Фукуок — курорт среднего ценового уровня. Комфортный бюджет одного человека составляет 900–1500 USD в месяц.

Аренда жилья начинается от 350–600 USD, цены выше в новых курортных комплексах и в высокий сезон.',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/vn tab=overview (Обзор) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
  'overview',
  'ru',
  'Обзор',
  'Вьетнам — одна из самых динамично развивающихся стран Юго-Восточной Азии, сочетающая древнюю культуру, социалистическое прошлое и стремительную модернизацию. Страна протянулась более чем на 1600 километров с севера на юг, благодаря чему отличается большим климатическим, культурным и социальным разнообразием.

Вьетнам привлекает иностранцев доступной стоимостью жизни, развитой инфраструктурой в крупных городах, насыщенной и здоровой кухней, а также дружелюбным отношением к экспатам. Он подходит как для путешествий и зимовок, так и для долгосрочного проживания, удалённой работы, бизнеса и релокации. fileciteturn6file0',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/vn tab=gallery (Фотогалерея) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
  'gallery',
  'ru',
  'Фотогалерея',
  '@gallery:

* vietnam_halong_bay.jpg
* vietnam_hanoi_old_quarter.jpg
* vietnam_ho_chi_minh_skyline.jpg
* vietnam_da_nang_beach.jpg
* vietnam_hoi_an_old_town.jpg',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/vn tab=map (Карта) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
  'map',
  'ru',
  'Карта',
  '@map:
center: [16.0, 107.8]
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

-- country/vn tab=weather (Погода и климат) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
  'weather',
  'ru',
  'Погода и климат',
  'Вьетнам обладает одним из самых разнообразных климатов в Юго-Восточной Азии. Из-за протяжённости страны и горного рельефа погодные условия существенно различаются по регионам.

### Сезоны

* Север: прохладная зима и выраженная сезонность (декабрь–февраль прохладно)
* Центр: сухой сезон с февраля по август, тайфуны осенью
* Юг: стабильное тепло круглый год, сезон дождей с мая по ноябрь

Во Вьетнаме нет единой «погоды» — климат всегда привязан к конкретному региону. fileciteturn6file0',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/vn tab=history (История) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
  'history',
  'ru',
  'История',
  'История Вьетнама насчитывает более двух тысяч лет и включает периоды китайского влияния, собственных династий, французской колонизации и войн XX века. Страна длительное время боролась за независимость, что сформировало сильное национальное самосознание и устойчивость общества.

После объединения страны в 1975 году Вьетнам выбрал социалистический путь развития. Экономические реформы конца XX века открыли страну для рынка, инвестиций и международной торговли, положив начало современному этапу роста. fileciteturn6file0',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/vn tab=geography (География) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
  'geography',
  'ru',
  'География',
  'Около 70% территории Вьетнама занимают горы и холмы. Страна имеет протяжённое побережье более 3200 км и две ключевые речные системы — Красную реку на севере и Меконг на юге.

География Вьетнама определяет плотность населения, экономику и региональные различия. Дельты рек — самые густонаселённые и сельскохозяйственно важные районы страны. fileciteturn6file0',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/vn tab=culture (Культура) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
  'culture',
  'ru',
  'Культура',
  'Культура Вьетнама основана на конфуцианских ценностях, буддизме, культе предков и коллективизме. Важнейшую роль играют семья, уважение к старшим и социальная гармония.

Повседневная культура строится вокруг улицы и еды как социального ритуала. Вьетнамская кухня считается одной из самых сбалансированных и полезных в мире. fileciteturn6file0',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/vn tab=living (Проживание) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
  'living',
  'ru',
  'Проживание',
  'Вьетнам считается одной из самых доступных стран региона для проживания иностранцев. Здесь легко арендовать жильё, а повседневные расходы остаются умеренными.

Популярные форматы жилья — апартаменты, кондоминиумы и частные дома. Крупные города и курорты предлагают развитую инфраструктуру, быстрый интернет и доступный сервис. fileciteturn6file0',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/vn tab=visas (Визы) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
  'visas',
  'ru',
  'Визы',
  'Вьетнам предлагает несколько типов виз для туристов, экспатов, предпринимателей и инвесторов. Наиболее популярны туристические и электронные визы, а также бизнес- и рабочие визы.

Правила визового режима периодически меняются, поэтому при долгосрочном пребывании важно ориентироваться на актуальные требования и легальные основания для проживания. fileciteturn6file0',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/vn tab=business (Бизнес) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
  'business',
  'ru',
  'Бизнес',
  'Вьетнам является одной из самых быстрорастущих экономик региона и активно привлекает иностранные инвестиции. Популярные сферы для бизнеса — IT, производство, туризм, сервис и образование.

Бизнес-культура строится на личных отношениях, иерархии и долгосрочном доверии. Для успешного старта часто требуется местный партнёр или консультант. fileciteturn6file0',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/vn tab=phrasebook (Разговорник) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
  'phrasebook',
  'ru',
  'Разговорник',
  '* Здравствуйте — Xin chào
* Спасибо — Cảm ơn
* Пожалуйста — Không có gì
* Извините — Xin lỗi
* Сколько стоит? — Bao nhiêu tiền?
* Где находится …? — … ở đâu?',
  'seed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  title = EXCLUDED.title,
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- country/vn tab=reviews (Отзывы экспатов) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
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

-- country/vn tab=calculator (Калькулятор стоимости) from E:/projects/work_go2asia/20251216go2asia/content/atlas/vietnam/country-vietnam.md
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'country',
  'vn',
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


