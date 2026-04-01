# Hanoi Districts and Containers

Этот файл фиксирует новые сущности для Hanoi pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `han`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Ханоя.

---

# 1. City Districts

## 1.1 `old-quarter-hoan-kiem`
- `slug`: `old-quarter-hoan-kiem`
- `name`: `Old Quarter / Hoan Kiem`
- `name_local`: `Phố Cổ / Hồ Hoàn Kiếm`
- `city_slug`: `han`
- `country_slug`: `vietnam`

Краткое описание: историческое и туристическое ядро Ханоя вокруг Old Quarter, Hoan Kiem Lake и прилегающих улиц с cafés, street food, cathedral layer и плотной прогулочной городской атмосферой. Это главный район для первого знакомства с Ханоем.

Подходит для:
- первого знакомства с Ханоем;
- street food, cafés и walkable old-city atmosphere;
- Hoan Kiem Lake, cathedral layer и исторических прогулок.

Текущие Atlas places в этом районе:
- `han-banh-mi-25`
- `han-bun-cha-huong-lien`
- `han-ca-phe-giang`
- `han-cho-ong-xuan`
- `han-cong-caphe`
- `han-hoan-kiem-lake-ngoc-son-temple`
- `han-night-market`
- `han-old-quarter`
- `han-pho-gia-truyen-bat-an`
- `han-st-joseph-s-cathedral`

---

## 1.2 `ba-dinh-political-core`
- `slug`: `ba-dinh-political-core`
- `name`: `Ba Dinh Political Core`
- `name_local`: `Ba Đình`
- `city_slug`: `han`
- `country_slug`: `vietnam`

Краткое описание: монументально-политическое ядро Ханоя вокруг Ba Dinh Square, Ho Chi Minh Mausoleum, One Pillar Pagoda и имперско-государственных landmark-объектов. Это civic core столицы, отличный от food-heavy Old Quarter.

Подходит для:
- национальных landmark-объектов и civic center;
- храмов, монументов и официального исторического слоя столицы;
- первого обзорного маршрута по главному символическому Ханою.

Текущие Atlas places в этом районе:
- `han-ba-dinh-square-ho-chi-minh-mausoleum`
- `han-flag-tower-of-hanoi`
- `han-one-pillar-pagoda`

---

## 1.3 `french-quarter-tran-hung-dao`
- `slug`: `french-quarter-tran-hung-dao`
- `name`: `French Quarter / Tran Hung Dao`
- `name_local`: `Khu Phố Pháp / Trần Hưng Đạo`
- `city_slug`: `han`
- `country_slug`: `vietnam`

Краткое описание: более просторный и элегантный urban contour к юго-востоку от Old Quarter с colonial boulevards, villa fabric, museums и известными ресторанами. Это bridge-zone между old Hanoi и более refined civic city layer.

Подходит для:
- colonial boulevards и более спокойных city walks;
- museums, refined dining и historic-urban atmosphere;
- перехода от Old Quarter к более широкому central Hanoi.

Текущие Atlas places в этом районе:
- `han-hoa-lo-prison`
- `han-nha-hang-ngon`
- `han-quan-an-ngon`

---

## 1.4 `west-lake-truc-bach`
- `slug`: `west-lake-truc-bach`
- `name`: `West Lake / Truc Bach`
- `name_local`: `Hồ Tây / Trúc Bạch`
- `city_slug`: `han`
- `country_slug`: `vietnam`

Краткое описание: северо-западный lake-oriented contour Ханоя вокруг West Lake и Truc Bach с temple stops, lake views, more relaxed café culture и жилой городской атмосферой вне плотного центра.

Подходит для:
- lake walks и более спокойного city experience;
- temple stops и scenic detours;
- cafés и городской атмосферы вне Old Quarter.

Текущие Atlas places в этом районе:
- `han-hidden-gem-cafe`
- `han-quan-thanh-temple`
- `han-west-lake`

---

# 2. Place Containers

## 2.1 `hanoi-old-quarter`
- `slug`: `hanoi-old-quarter`
- `name`: `Hanoi Old Quarter`
- `type`: `historic-urban-quarter`
- `city_slug`: `han`
- `district_slug`: `old-quarter-hoan-kiem`

Краткое описание: плотный исторический urban-quarter cluster старого Ханоя с узкими улицами, shopfronts, food lanes и nonstop pedestrian energy.

Places inside:
- `han-old-quarter`

---

## 2.2 `hoan-kiem-lake`
- `slug`: `hoan-kiem-lake`
- `name`: `Hoan Kiem Lake`
- `type`: `urban-lake-landmark-cluster`
- `city_slug`: `han`
- `district_slug`: `old-quarter-hoan-kiem`

Краткое описание: центральный lake-and-landmark cluster вокруг Hoan Kiem Lake и Ngoc Son Temple как самостоятельная прогулочная destination-zone.

Places inside:
- `han-hoan-kiem-lake-ngoc-son-temple`

---

## 2.3 `hanoi-night-market`
- `slug`: `hanoi-night-market`
- `name`: `Hanoi Night Market`
- `type`: `night-market-corridor`
- `city_slug`: `han`
- `district_slug`: `old-quarter-hoan-kiem`

Краткое описание: вечерний market-corridor в Old Quarter, который воспринимается как самостоятельная destination-zone, а не как одна торговая точка.

Places inside:
- `han-night-market`
