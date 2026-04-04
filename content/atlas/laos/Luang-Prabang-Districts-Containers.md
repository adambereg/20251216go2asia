# Luang Prabang Districts and Containers

Этот файл фиксирует новые сущности для Luang Prabang pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `laos`
- `city_slug`: `lpq`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Луанг Прабанга.

---

# 1. City Districts

## 1.1 `old-town-peninsula`
- `slug`: `old-town-peninsula`
- `name`: `Old Town Peninsula`
- `name_local`: `ຫລວງພະບາງເກົ່າ`
- `city_slug`: `lpq`
- `country_slug`: `laos`

Краткое описание: историческое ядро Луанг Прабанга на полуострове между Mekong и Nam Khan. Здесь сосредоточены главные храмы, королевское наследие, вечерний рынок, утренний alms giving и большая часть классического old-town опыта.

Подходит для:
- первого знакомства с Луанг Прабангом;
- храмов, heritage-walks и королевского слоя города;
- рынков, кафе и прогулок по старому центру.

Текущие Atlas places в этом районе:
- `lpq-alms-giving-ceremony`
- `lpq-joma-bakery-cafe`
- `lpq-manda-de-laos`
- `lpq-mount-phousi`
- `lpq-night-market`
- `lpq-royal-palace-museum`
- `lpq-tamarind-restaurant`
- `lpq-wat-xieng-thong`

---

## 1.2 `mekong-riverside-ban-vat-sene`
- `slug`: `mekong-riverside-ban-vat-sene`
- `name`: `Mekong Riverside / Ban Vat Sene`
- `name_local`: `ແຄມແມ່ນ້ຳຂອງ`
- `city_slug`: `lpq`
- `country_slug`: `laos`

Краткое описание: riverside-контур вдоль Mekong у старого города с ресторанами, барами и sunset-facing terraces. Это более расслабленная waterfront-зона, где old-town heritage соединяется с вечерней dining-атмосферой.

Подходит для:
- sunset drinks и ужинов у реки;
- более спокойного riverside experience;
- прогулок вдоль Mekong на краю старого города.

Текущие Atlas places в этом районе:
- `lpq-bouang-asian-eatery`
- `lpq-utopia-bar`

---

## 1.3 `nam-khan-opposite-bank`
- `slug`: `nam-khan-opposite-bank`
- `name`: `Nam Khan Opposite Bank`
- `name_local`: `ແຄມນ້ຳຄານ`
- `city_slug`: `lpq`
- `country_slug`: `laos`

Краткое описание: более тихий riverside-cluster на противоположном берегу Nam Khan напротив исторического центра. Это зона bamboo bridge / boat crossing experience, terraced dining и мягкого evening atmosphere.

Подходит для:
- ресторанов у Nam Khan;
- более тихого evening experience вне главных улиц;
- views back toward the old peninsula.

Текущие Atlas places в этом районе:
- `lpq-dyen-sabai-restaurant`

---

## 1.4 `kuang-si-excursion-zone`
- `slug`: `kuang-si-excursion-zone`
- `name`: `Kuang Si Excursion Zone`
- `name_local`: `ນ້ຳຕົກກວາງຊີ`
- `city_slug`: `lpq`
- `country_slug`: `laos`

Краткое описание: внешняя природная excursion-зона к юго-западу от Луанг Прабанга, связанная с Kuang Si Falls, turquoise pools и day trips за пределы городского ядра. Это не городской район, а важный natural cluster для Atlas Luang Prabang.

Подходит для:
- waterfalls и природных day trips;
- купания в turquoise pools;
- коротких выездов за пределы heritage-core.

Текущие Atlas places в этом районе:
- `lpq-kuang-si-falls`

---

## 1.5 `pak-ou-excursion-zone`
- `slug`: `pak-ou-excursion-zone`
- `name`: `Pak Ou Excursion Zone`
- `name_local`: `ຖ້ຳປາກອູ`
- `city_slug`: `lpq`
- `country_slug`: `laos`

Краткое описание: внешняя river-and-caves excursion-зона вверх по Mekong, связанная с Pak Ou Caves и классическими boat trips из Луанг Прабанга. Это уже не городской контур, а отдельный half-day / day-trip cluster.

Подходит для:
- river cruises по Mekong;
- cave и pilgrimage experience;
- классических excursions из Луанг Прабанга.

Текущие Atlas places в этом районе:
- `lpq-pak-ou-caves`

---

# 2. Place Containers

## 2.1 `luang-prabang-old-town`
- `slug`: `luang-prabang-old-town`
- `name`: `Luang Prabang Old Town`
- `type`: `historic-peninsula-cluster`
- `city_slug`: `lpq`
- `district_slug`: `old-town-peninsula`

Краткое описание: исторический городской кластер на полуострове между Mekong и Nam Khan, который воспринимается как самостоятельная destination-zone со множеством храмов, рынков, heritage streets и royal landmarks.

Places inside:
- `lpq-mount-phousi`
- `lpq-royal-palace-museum`
- `lpq-wat-xieng-thong`

---

## 2.2 `luang-prabang-night-market`
- `slug`: `luang-prabang-night-market`
- `name`: `Luang Prabang Night Market`
- `type`: `night-market-corridor`
- `city_slug`: `lpq`
- `district_slug`: `old-town-peninsula`

Краткое описание: вечерний market-corridor на Sisavangvong Road в центре старого города с сувенирами, текстилем, едой и pedestrian evening atmosphere.

Places inside:
- `lpq-night-market`

---
