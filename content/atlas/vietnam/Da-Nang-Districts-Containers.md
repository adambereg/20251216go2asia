# Da Nang Districts and Containers

Этот файл фиксирует новые сущности для Da Nang pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `dad`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Дананга.

---

# 1. City Districts

## 1.1 `han-river-hai-chau-core`
- `slug`: `han-river-hai-chau-core`
- `name`: `Han River / Hai Chau Core`
- `name_local`: `Hải Châu / Sông Hàn`
- `city_slug`: `dad`
- `country_slug`: `vietnam`

Краткое описание: центральный городской контур Дананга вокруг Han River, Bach Dang, Tran Phu и Hai Chau. Это главный urban core города: рынки, riverfront, мосты, музеи, rooftop-бары и классические restaurant stops.

Подходит для:
- первого знакомства с городским Данангом;
- riverfront-прогулок, мостов и вечерней подсветки;
- рынков, музеев, rooftop-баров и центральной гастрономии.

Текущие Atlas places в этом районе:
- `dad-cham-sculpture-museum`
- `dad-con-market`
- `dad-cong-ca-phe`
- `dad-dragon-bridge`
- `dad-han-market`
- `dad-han-river-bridge`
- `dad-madame-lan`
- `dad-sky36`
- `dad-waterfront-danang`

---

## 1.2 `my-khe-phuoc-my-coast`
- `slug`: `my-khe-phuoc-my-coast`
- `name`: `My Khe / Phuoc My Coast`
- `name_local`: `Mỹ Khê / Phước Mỹ`
- `city_slug`: `dad`
- `country_slug`: `vietnam`

Краткое описание: восточный beach-and-coastal contour Дананга вдоль My Khe и Phuoc My с длинным городским пляжем, seafood-ресторанами и lifestyle-локациями у моря. Это главный seaside layer самого города вне вынесенной peninsula-зоны Son Tra.

Подходит для:
- городского пляжного отдыха;
- seafood и casual dining у моря;
- sunrise, beach walks и более курортного ритма внутри города.

Текущие Atlas places в этом районе:
- `dad-43-factory-coffee-roaster`
- `dad-be-man-seafood`
- `dad-my-khe-beach`
- `dad-son-tra-night-market`

---

## 1.3 `son-tra-peninsula-east`
- `slug`: `son-tra-peninsula-east`
- `name`: `Son Tra Peninsula East`
- `name_local`: `Bán đảo Sơn Trà`
- `city_slug`: `dad`
- `country_slug`: `vietnam`

Краткое описание: scenic peninsula-cluster к северо-востоку от города с Bai Bac, Linh Ung Pagoda, морскими видами и luxury resort experience. Это более природный и панорамный контур, чем городской beachfront My Khe.

Подходит для:
- панорамных поездок и viewpoints;
- храмовой и scenic coastal локации;
- luxury dining и вынесенного resort experience.

Текущие Atlas places в этом районе:
- `dad-la-maison-1888`
- `dad-linh-ung-pagoda`
- `dad-son-tra-peninsula`

---

## 1.4 `ngu-hanh-son-non-nuoc`
- `slug`: `ngu-hanh-son-non-nuoc`
- `name`: `Ngu Hanh Son / Non Nuoc`
- `name_local`: `Ngũ Hành Sơn / Non Nước`
- `city_slug`: `dad`
- `country_slug`: `vietnam`

Краткое описание: юго-восточный coastal-and-heritage contour вокруг Marble Mountains и Non Nuoc Beach. Это отдельный day-trip слой Дананга, где храмовые пещеры и каменные холмы соединяются с более спокойной полосой пляжа.

Подходит для:
- caves, pagodas и heritage nature;
- более спокойного пляжа вне My Khe;
- коротких scenic выездов к югу от центра.

Текущие Atlas places в этом районе:
- `dad-marble-mountains`
- `dad-non-nuoc-beach`

---

## 1.5 `ba-na-hills-excursion-zone`
- `slug`: `ba-na-hills-excursion-zone`
- `name`: `Ba Na Hills Excursion Zone`
- `name_local`: `Bà Nà Hills`
- `city_slug`: `dad`
- `country_slug`: `vietnam`

Краткое описание: вынесенная mountain-and-theme-park excursion-zone к западу от Дананга вокруг Sun World Ba Na Hills и Golden Bridge. Это не городской район в строгом смысле, а ключевой day-trip cluster для iconic photo spots и высотного leisure experience.

Подходит для:
- Golden Bridge и iconic photo stops;
- cable car, theme park и family day trips;
- более прохладного mountain leisure за пределами города.

Текущие Atlas places в этом районе:
- `dad-golden-bridge`
- `dad-sun-world-ba-na-hills`

---

# 2. Place Containers

## 2.1 `han-river-waterfront`
- `slug`: `han-river-waterfront`
- `name`: `Han River Waterfront`
- `type`: `urban-riverfront-cluster`
- `city_slug`: `dad`
- `district_slug`: `han-river-hai-chau-core`

Краткое описание: главный riverfront-кластер Дананга вдоль Bach Dang и Han River с мостами, rooftop-барами, restaurants и вечерней городской жизнью.

Places inside:
- `dad-waterfront-danang`

---

## 2.2 `my-khe-beach`
- `slug`: `my-khe-beach`
- `name`: `My Khe Beach`
- `type`: `urban-beachfront`
- `city_slug`: `dad`
- `district_slug`: `my-khe-phuoc-my-coast`

Краткое описание: главный городской beachfront Дананга как самостоятельная destination-zone для пляжа, sunrise и seaside city life.

Places inside:
- `dad-my-khe-beach`

---

## 2.3 `son-tra-peninsula`
- `slug`: `son-tra-peninsula`
- `name`: `Son Tra Peninsula`
- `type`: `scenic-peninsula-cluster`
- `city_slug`: `dad`
- `district_slug`: `son-tra-peninsula-east`

Краткое описание: peninsula-cluster с coastal roads, viewpoints, пагодой и luxury resort strip на восточном выступе Дананга.

Places inside:
- `dad-son-tra-peninsula`

---

## 2.4 `marble-mountains`
- `slug`: `marble-mountains`
- `name`: `Marble Mountains`
- `type`: `heritage-nature-cluster`
- `city_slug`: `dad`
- `district_slug`: `ngu-hanh-son-non-nuoc`

Краткое описание: cluster из известняковых холмов, cave temples и heritage viewpoints как самостоятельная destination-zone, а не одиночная точка.

Places inside:
- `dad-marble-mountains`

---

## 2.5 `ba-na-hills`
- `slug`: `ba-na-hills`
- `name`: `Ba Na Hills`
- `type`: `mountain-theme-park-cluster`
- `city_slug`: `dad`
- `district_slug`: `ba-na-hills-excursion-zone`

Краткое описание: mountain leisure-cluster у канатной дороги и парка развлечений, включающий Golden Bridge и highland attractions.

Places inside:
- `dad-golden-bridge`
- `dad-sun-world-ba-na-hills`
