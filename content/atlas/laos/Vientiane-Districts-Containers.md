# Vientiane Districts and Containers

Этот файл фиксирует новые сущности для Vientiane pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `laos`
- `city_slug`: `vte`

> Важно: это curated operational set для существующих Atlas places Вьентьяна, а не полный административный список районов города.

---

# 1. City Districts

## 1.1 `mekong-riverside-ban-anou`
- `slug`: `mekong-riverside-ban-anou`
- `name`: `Mekong Riverside / Ban Anou`
- `name_local`: `ແມ່ນ້ຳຂອງ / ບ້ານອານຸ`
- `city_slug`: `vte`
- `country_slug`: `laos`

Краткое описание: riverfront-ядро туристического Вьентьяна вдоль Mekong Riverside и квартала Ban Anou. Это район вечерних прогулок, rooftop-бара, food courts, casual dining и мягкой столичной атмосферы у воды.

Подходит для:
- прогулок вдоль Mekong riverfront;
- rooftop-баров, evening dining и night-market среды;
- первого знакомства с более расслабленным riverside Вьентьяна.

Текущие Atlas places в этом районе:
- `vte-ban-anou-night-market-food-court`
- `vte-bor-pen-nyang-rooftop`
- `vte-makphet-restaurant`
- `vte-mekong-riverside-promenade`
- `vte-taj-mahal-restaurant`

---

## 1.2 `central-civic-that-dam`
- `slug`: `central-civic-that-dam`
- `name`: `Central Civic / That Dam`
- `name_local`: `ທາດດຳ / ນ້ຳພຸ`
- `city_slug`: `vte`
- `country_slug`: `laos`

Краткое описание: центральный городской контур Вьентьяна между Lane Xang, Nam Phu и That Dam. Здесь сосредоточены важные храмы, civic landmarks, старые центральные улицы, культурные институции и классические городские рестораны.

Подходит для:
- городских landmark-объектов и центральных храмов;
- café и restaurant stops в walkable city core;
- знакомства с civic и историческим слоем Вьентьяна вне riverside.

Текущие Atlas places в этом районе:
- `vte-cope-visitor-centre`
- `vte-kualao-restaurant`
- `vte-patuxai`
- `vte-scandinavian-bakery`
- `vte-wat-si-saket`

---

## 1.3 `that-luang-nongbone`
- `slug`: `that-luang-nongbone`
- `name`: `That Luang / Nongbone`
- `name_local`: `ທາດຫຼວງ / ໜອງບອນ`
- `city_slug`: `vte`
- `country_slug`: `laos`

Краткое описание: восточный monumental-spiritual contour Вьентьяна вокруг Pha That Luang и более широкого That Luang / Nongbone area. Это главный район для знакомства с национально-религиозным символом Лаоса и более вынесенной ceremonial частью столицы.

Подходит для:
- главного буддийского landmark-объекта Лаоса;
- более спокойного monumental city experience;
- коротких выездов к symbol-driven sacred architecture.

Текущие Atlas places в этом районе:
- `vte-pha-that-luang`

---

## 1.4 `xieng-khuan-buddha-park-excursion-zone`
- `slug`: `xieng-khuan-buddha-park-excursion-zone`
- `name`: `Xieng Khuan / Buddha Park Excursion Zone`
- `name_local`: `ຊຽງຄວນ`
- `city_slug`: `vte`
- `country_slug`: `laos`

Краткое описание: внешняя excursion-зона к юго-востоку от Вьентьяна, связанная с Xieng Khuan / Buddha Park на берегу Mekong near Friendship Bridge area. Это не городской район в строгом смысле, а важный day-trip cluster для sculpture park experience.

Подходит для:
- day trips за пределы центрального города;
- sculpture park и фотогеничных локаций;
- более необычного духовно-художественного опыта рядом со столицей.

Текущие Atlas places в этом районе:
- `vte-buddha-park`

---

# 2. Place Containers

## 2.1 `mekong-riverside-promenade`
- `slug`: `mekong-riverside-promenade`
- `name`: `Mekong Riverside Promenade`
- `type`: `urban-riverfront-cluster`
- `city_slug`: `vte`
- `district_slug`: `mekong-riverside-ban-anou`

Краткое описание: длинный riverfront-кластер вдоль Mekong с вечерними прогулками, кафе, барами, night-market жизнью и основным sunset-facing public edge Вьентьяна.

Places inside:
- `vte-mekong-riverside-promenade`

---

## 2.2 `ban-anou-night-market`
- `slug`: `ban-anou-night-market`
- `name`: `Ban Anou Night Market`
- `type`: `night-market-food-cluster`
- `city_slug`: `vte`
- `district_slug`: `mekong-riverside-ban-anou`

Краткое описание: compact food-market cluster в Ban Anou, связанный с локальным street-food опытом и более живой вечерней food scene недалеко от riverside.

Places inside:
- `vte-ban-anou-night-market-food-court`