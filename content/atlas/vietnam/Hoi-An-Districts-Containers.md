# Hoi An Districts and Containers

Этот файл фиксирует новые сущности для Hoi An pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `hoi`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Хойана.

---

# 1. City Districts

## 1.1 `ancient-town-tran-phu-core`
- `slug`: `ancient-town-tran-phu-core`
- `name`: `Ancient Town / Tran Phu Core`
- `name_local`: `Phố cổ Hội An`
- `city_slug`: `hoi`
- `country_slug`: `vietnam`

Краткое описание: историческое ядро Хойана внутри UNESCO old town вокруг Tran Phu, Nguyen Thai Hoc и Japanese Covered Bridge. Это главный район для первого знакомства с городом: старые торговые дома, assembly halls, tailors, кафе, food classics и главные postcard-улицы. Hoi An Ancient Town itself is the preserved historic center, and the Japanese Covered Bridge sits in this core. citeturn936646search8turn936646search23

Подходит для:
- первого знакомства с Хойаном;
- heritage-прогулок по старому городу;
- кафе, tailoring и классической уличной гастрономии.

Текущие Atlas places в этом районе:
- `hoi-assembly-halls-of-hoi-an`
- `hoi-ba-le-well`
- `hoi-banh-mi-phuong`
- `hoi-com-ga-ba-buoi`
- `hoi-faifo-coffee`
- `hoi-hoi-an-ancient-town`
- `hoi-japanese-covered-bridge`
- `hoi-madam-khanh-the-banh-mi-queen`
- `hoi-morning-glory-restaurant`
- `hoi-mot-hoi-an`
- `hoi-old-merchant-houses`
- `hoi-reaching-out-tea-house`
- `hoi-yaly-couture`

---

## 1.2 `an-hoi-riverside-market`
- `slug`: `an-hoi-riverside-market`
- `name`: `An Hoi Riverside / Market`
- `name_local`: `Cù lao An Hội`
- `city_slug`: `hoi`
- `country_slug`: `vietnam`

Краткое описание: вечерний riverside-contour на An Hoi Islet по другую сторону реки от старого города, где сосредоточены night market, lantern atmosphere и river-edge pedestrian life. Hoi An Night Market is on Nguyen Hoang Street on An Hoi Island across the river from the ancient town. citeturn936646search7turn936646search19

Подходит для:
- night market и lantern-атмосферы;
- вечерних прогулок у реки;
- street-food и сувенирного evening layer.

Текущие Atlas places в этом районе:
- `hoi-hoi-an-night-market`

---

## 1.3 `cam-an-an-bang-coast`
- `slug`: `cam-an-an-bang-coast`
- `name`: `Cam An / An Bang Coast`
- `name_local`: `Cẩm An / An Bàng`
- `city_slug`: `hoi`
- `country_slug`: `vietnam`

Краткое описание: beach contour к востоку от старого города вокруг An Bang Beach — один из главных seaside-кластеров Hoi An с beach bars, restaurants и более расслабленным coastal rhythm. Soul Kitchen is identified as an An Bang beach venue, and Tra Que is a short ride inland from this coast. citeturn936646search1turn936646search17

Подходит для:
- пляжного отдыха и beach bars;
- seaside dining и sunset stops;
- более расслабленного coastal experience вне старого города.

Текущие Atlas places в этом районе:
- `hoi-an-bang-beach`
- `hoi-soul-kitchen`

---

## 1.4 `tra-que-cam-ha-countryside`
- `slug`: `tra-que-cam-ha-countryside`
- `name`: `Tra Que / Cam Ha Countryside`
- `name_local`: `Trà Quế / Cẩm Hà`
- `city_slug`: `hoi`
- `country_slug`: `vietnam`

Краткое описание: зелёный countryside-contour к северо-востоку от ancient town вокруг Tra Que Vegetable Village, where farming experiences and village life define the visitor experience. Recent travel guidance places Tra Que in Hoi An Tay ward / former Cam Ha commune. citeturn936646search9

Подходит для:
- агротуризма и cooking experiences;
- countryside rides вокруг Hoi An;
- более спокойного village-layer вне urban core.

Текущие Atlas places в этом районе:
- `hoi-tra-que-vegetable-village`

---

## 1.5 `thanh-ha-river-pottery-village`
- `slug`: `thanh-ha-river-pottery-village`
- `name`: `Thanh Ha River / Pottery Village`
- `name_local`: `Thanh Hà`
- `city_slug`: `hoi`
- `country_slug`: `vietnam`

Краткое описание: northern riverside village contour west/northwest of old Hoi An, связанный с Thanh Ha Pottery Village и craft heritage по направлению вверх по Thu Bon. Это не часть плотного ancient core, а отдельный pottery-and-river stopover cluster.

Подходит для:
- craft village visits;
- pottery workshops и cultural detours;
- коротких riverside выездов из центра Хойана.

Текущие Atlas places в этом районе:
- `hoi-thanh-ha-pottery-village`

---

## 1.6 `cham-islands-excursion-zone`
- `slug`: `cham-islands-excursion-zone`
- `name`: `Cham Islands Excursion Zone`
- `name_local`: `Cù Lao Chàm`
- `city_slug`: `hoi`
- `country_slug`: `vietnam`

Краткое описание: внешний island-excursion cluster off the coast of Hoi An, accessed via Cua Dai Port. Current guides place the islands roughly 15–20 km offshore and reached by speedboat from Cua Dai. citeturn936646search2turn936646search18turn936646search6

Подходит для:
- island day trips и speedboat excursions;
- снорклинга и морских выездов;
- выхода за пределы urban/coastal Hoi An.

Текущие Atlas places в этом районе:
- `hoi-cham-islands`

---

# 2. Place Containers

## 2.1 `hoi-an-ancient-town`
- `slug`: `hoi-an-ancient-town`
- `name`: `Hoi An Ancient Town`
- `type`: `historic-old-town-cluster`
- `city_slug`: `hoi`
- `district_slug`: `ancient-town-tran-phu-core`

Краткое описание: исторический urban cluster UNESCO old town с шопхаусами, храмами, assembly halls, tailoring и ключевыми heritage-маршрутами. citeturn936646search8

Places inside:
- `hoi-hoi-an-ancient-town`

---

## 2.2 `hoi-an-central-market`
- `slug`: `hoi-an-central-market`
- `name`: `Hoi An Central Market`
- `type`: `historic-market-cluster`
- `city_slug`: `hoi`
- `district_slug`: `ancient-town-tran-phu-core`

Краткое описание: river-edge market cluster between Tran Phu and Bach Dang along the Thu Bon riverside, functioning as a living food-and-trade core rather than a single point. citeturn936646search11

Places inside:
- `hoi-hoi-an-central-market`

---

## 2.3 `hoi-an-night-market`
- `slug`: `hoi-an-night-market`
- `name`: `Hoi An Night Market`
- `type`: `night-market-corridor`
- `city_slug`: `hoi`
- `district_slug`: `an-hoi-riverside-market`

Краткое описание: evening market corridor on Nguyen Hoang Street / An Hoi Island with lantern-lit stalls and riverside walking atmosphere. citeturn936646search7turn936646search3

Places inside:
- `hoi-hoi-an-night-market`
