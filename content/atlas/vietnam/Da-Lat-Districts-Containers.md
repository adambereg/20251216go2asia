# Da Lat Districts and Containers

Этот файл фиксирует новые сущности для Da Lat pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `dla`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Далата.

---

# 1. City Districts

## 1.1 `xuan-huong-market-core`
- `slug`: `xuan-huong-market-core`
- `name`: `Xuan Huong / Market Core`
- `name_local`: `Hồ Xuân Hương / Chợ Đà Lạt`
- `city_slug`: `dla`
- `country_slug`: `vietnam`

Краткое описание: центральный городской контур вокруг Hồ Xuân Hương, Dalat Market, Night Market и главных walkable улиц центра. Это базовый район для первого знакомства с Далатом: озеро, вечерняя атмосфера, еда, шопинг и классическая hill-station city life.

Подходит для:
- первого знакомства с Далатом;
- прогулок у озера и по вечернему центру;
- рынков, кафе и городской атмосферы.

Текущие Atlas places в этом районе:
- `dla-an-cafe`
- `dla-dalat-market`
- `dla-dalat-night-market`
- `dla-ho-xuan-huong`
- `dla-l-angfarm`
- `dla-lien-hoa-bakery-restaurant`
- `dla-maze-bar`
- `dla-nem-nuong-ba-hung`

---

## 1.2 `palaces-cathedral-hills`
- `slug`: `palaces-cathedral-hills`
- `name`: `Palaces / Cathedral Hills`
- `name_local`: `Nhà thờ Con Gà / Dinh Bảo Đại`
- `city_slug`: `dla`
- `country_slug`: `vietnam`

Краткое описание: юго-западный и западный central-hills contour Далата, где смешиваются французское наследие, cathedral layer, исторические виллы, необычная архитектура и тихие подъёмы над центром. Это район для heritage stops и более атмосферного city exploration вне рыночного ядра.

Подходит для:
- французского и имперского heritage-слоя;
- cathedral, palace и unusual architecture stops;
- спокойных прогулок по hill-station кварталам.

Текущие Atlas places в этом районе:
- `dla-bao-dai-palace-iii`
- `dla-crazy-house`
- `dla-dalat-cathedral`
- `dla-domaine-de-marie`

---

## 1.3 `station-trai-mat-east`
- `slug`: `station-trai-mat-east`
- `name`: `Station / Trai Mat East`
- `name_local`: `Ga Đà Lạt / Trại Mát`
- `city_slug`: `dla`
- `country_slug`: `vietnam`

Краткое описание: восточный contour от Dalat Railway Station к Trại Mát, связанный с колониальным railway heritage, старой городской восточной осью и известной пагодой Linh Phước. Это переход от городского центра к более вынесенному eastern cultural cluster.

Подходит для:
- railway heritage и поездки на старом поезде;
- eastern city detours и temple visits;
- более тихого культурного слоя Далата.

Текущие Atlas places в этом районе:
- `dla-dalat-railway-station`
- `dla-la-viet-coffee`
- `dla-lam-dong-museum`
- `dla-linh-phuoc-pagoda`

---

## 1.4 `north-lake-gardens`
- `slug`: `north-lake-gardens`
- `name`: `North Lake Gardens`
- `name_local`: `Vườn hoa / Đồi thông`
- `city_slug`: `dla`
- `country_slug`: `vietnam`

Краткое описание: северный и северо-восточный scenic contour вокруг Dalat Flower Garden, pine viewpoints и Valley of Love. Это более зелёный, прогулочный и обзорный слой города с classic Da Lat scenery.

Подходит для:
- садов, цветов и pine-view experience;
- прогулок и scenic detours у северной части озера;
- фотогеничных landscape-локаций Далата.

Текущие Atlas places в этом районе:
- `dla-dalat-flower-garden`
- `dla-dalat-pine-viewpoints`
- `dla-valley-of-love`

---

## 1.5 `tuyen-lam-south-excursion-zone`
- `slug`: `tuyen-lam-south-excursion-zone`
- `name`: `Tuyen Lam South Excursion Zone`
- `name_local`: `Hồ Tuyền Lâm / Thiền Viện Trúc Lâm`
- `city_slug`: `dla`
- `country_slug`: `vietnam`

Краткое описание: южная excursion-зона Далата вокруг Tuyền Lâm Lake, Trúc Lâm Zen Monastery и Datanla Waterfall. Это не центральный район, а важный природно-духовный day-trip cluster на южном выезде из города.

Подходит для:
- озера, монастыря и природных day trips;
- спокойного pine-and-lake experience;
- коротких выездов из центра Далата.

Текущие Atlas places в этом районе:
- `dla-datanla-waterfall`
- `dla-truc-lam-zen-monastery`
- `dla-tuyen-lam-lake`

---

## 1.6 `cam-ly-west-hills`
- `slug`: `cam-ly-west-hills`
- `name`: `Cam Ly West Hills`
- `name_local`: `Cam Ly`
- `city_slug`: `dla`
- `country_slug`: `vietnam`

Краткое описание: ближний western-outskirts contour за пределами central hills, связанный с Cam Ly Waterfall и более локальным, менее polished слоем Далата. Это короткий out-of-centre nature stop, а не часть postcard core.

Подходит для:
- коротких западных detours из центра;
- small waterfall stopovers;
- более локального и менее туристического Da Lat experience.

Текущие Atlas places в этом районе:
- `dla-cam-ly-waterfall`

---

# 2. Place Containers

## 2.1 `xuan-huong-lake`
- `slug`: `xuan-huong-lake`
- `name`: `Xuan Huong Lake`
- `type`: `urban-lakefront-cluster`
- `city_slug`: `dla`
- `district_slug`: `xuan-huong-market-core`

Краткое описание: главный lakefront-кластер Далата в центре города, который воспринимается как самостоятельная destination-zone для прогулок, city views и вечерней атмосферы.

Places inside:
- `dla-ho-xuan-huong`

## 2.2 `dalat-market`
- `slug`: `dalat-market`
- `name`: `Dalat Market`
- `type`: `urban-market-cluster`
- `city_slug`: `dla`
- `district_slug`: `xuan-huong-market-core`

Краткое описание: центральный market-cluster Далата с daytime shopping, food stops и городской повседневной жизнью.

Places inside:
- `dla-dalat-market`

## 2.3 `dalat-night-market`
- `slug`: `dalat-night-market`
- `name`: `Dalat Night Market`
- `type`: `night-market-corridor`
- `city_slug`: `dla`
- `district_slug`: `xuan-huong-market-core`

Краткое описание: вечерний food-and-shopping corridor в центре Далата, который живёт как самостоятельная nightlife destination-zone.

Places inside:
- `dla-dalat-night-market`

## 2.4 `dalat-railway-station`
- `slug`: `dalat-railway-station`
- `name`: `Dalat Railway Station`
- `type`: `railway-heritage-cluster`
- `city_slug`: `dla`
- `district_slug`: `station-trai-mat-east`

Краткое описание: исторический railway cluster colonial-era Далата, связанный с ретро-станцией и поездкой в Trại Mát.

Places inside:
- `dla-dalat-railway-station`

## 2.5 `linh-phuoc-pagoda`
- `slug`: `linh-phuoc-pagoda`
- `name`: `Linh Phuoc Pagoda`
- `type`: `temple-complex`
- `city_slug`: `dla`
- `district_slug`: `station-trai-mat-east`

Краткое описание: крупный temple-complex в Trại Mát, который воспринимается как самостоятельная spiritual destination-zone, а не как обычная точка.

Places inside:
- `dla-linh-phuoc-pagoda`

## 2.6 `tuyen-lam-lake`
- `slug`: `tuyen-lam-lake`
- `name`: `Tuyen Lam Lake`
- `type`: `lake-monastery-nature-cluster`
- `city_slug`: `dla`
- `district_slug`: `tuyen-lam-south-excursion-zone`

Краткое описание: южный lake-and-pine cluster Далата с lake views, monastery access и природной excursion-логикой.

Places inside:
- `dla-tuyen-lam-lake`

## 2.7 `valley-of-love`
- `slug`: `valley-of-love`
- `name`: `Valley of Love`
- `type`: `scenic-park-cluster`
- `city_slug`: `dla`
- `district_slug`: `north-lake-gardens`

Краткое описание: крупный scenic-park cluster в северной части Далата, а не одиночная точка.

Places inside:
- `dla-valley-of-love`
