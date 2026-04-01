# Jakarta Districts and Containers

Этот файл фиксирует новые сущности для Jakarta pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `indonesia`
- `city_slug`: `jkt`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Джакарты.

---

# 1. City Districts

## 1.1 `kota-tua-glodok`
- `slug`: `kota-tua-glodok`
- `name`: `Kota Tua / Glodok`
- `name_local`: `Kota Tua / Glodok`
- `city_slug`: `jkt`
- `country_slug`: `indonesia`

Краткое описание: историческое северо-западное ядро Джакарты вокруг Fatahillah Square, колониальных зданий и старой Batavia. Это главный район для old-town experience, heritage-walks, атмосферных кафе и первого знакомства с колониальным слоем города.

Подходит для:
- исторических прогулок и colonial heritage;
- музеев, площадей и old-town атмосферы;
- café stops и более медленного urban exploration.

Текущие Atlas places в этом районе:
- `jkt-cafe-batavia`
- `jkt-kota-tua-jakarta`

---

## 1.2 `merdeka-gambir-istiqlal`
- `slug`: `merdeka-gambir-istiqlal`
- `name`: `Merdeka / Gambir / Istiqlal`
- `name_local`: `Merdeka / Gambir / Istiqlal`
- `city_slug`: `jkt`
- `country_slug`: `indonesia`

Краткое описание: государственно-монументальное сердце центральной Джакарты вокруг Merdeka Square, Monas, Istiqlal Mosque и Jakarta Cathedral. Это район национальных символов, крупных civic spaces и главных историко-государственных landmark-объектов столицы.

Подходит для:
- главных национальных landmark-объектов;
- монументов, больших площадей и civic center;
- религиозной архитектуры и city highlights.

Текущие Atlas places в этом районе:
- `jkt-istiqlal-mosque`
- `jkt-jakarta-cathedral`
- `jkt-national-monument`

---

## 1.3 `menteng-thamrin`
- `slug`: `menteng-thamrin`
- `name`: `Menteng / Thamrin`
- `name_local`: `Menteng / Thamrin`
- `city_slug`: `jkt`
- `country_slug`: `indonesia`

Краткое описание: центральный urban contour Джакарты, где пересекаются старый престижный район Menteng, boulevard M.H. Thamrin, high-rise dining и modern city life. Это удобная зона для rooftop views, известных ресторанов и более polished metropolitan Jakarta.

Подходит для:
- rooftop bars и skyline views;
- heritage dining и центральных ресторанов;
- городского ритма, бульваров и modern Jakarta.

Текущие Atlas places в этом районе:
- `jkt-nasi-goreng-kambing-kebon-sirih`
- `jkt-plataran-menteng`
- `jkt-skye-bar-restaurant`
- `jkt-social-house`

---

## 1.4 `senayan-scbd`
- `slug`: `senayan-scbd`
- `name`: `Senayan / SCBD`
- `name_local`: `Senayan / SCBD`
- `city_slug`: `jkt`
- `country_slug`: `indonesia`

Краткое описание: южно-центральный business-and-lifestyle contour Джакарты вокруг Senayan, Plaza Senayan и делового ядра SCBD. Это район shopping, business meetings, modern cafés и polished urban lifestyle.

Подходит для:
- shopping и café culture;
- business-district атмосферы;
- modern dining и city lifestyle.

Текущие Atlas places в этом районе:
- `jkt-union-cafe`

---

## 1.5 `ancol-north-coast`
- `slug`: `ancol-north-coast`
- `name`: `Ancol / North Coast`
- `name_local`: `Ancol`
- `city_slug`: `jkt`
- `country_slug`: `indonesia`

Краткое описание: северный leisure-контур Джакарты у моря, связанный с Ancol Dreamland, recreation parks, beachfront activity и family entertainment. Это не business Jakarta, а отдельный coastal recreation cluster большого города.

Подходит для:
- семейных развлечений и leisure;
- theme parks и beachside отдыха;
- более курортного urban outing на побережье.

Текущие Atlas places в этом районе:
- `jkt-ancol-dreamland`

---

## 1.6 `tmii-east-jakarta-excursion-zone`
- `slug`: `tmii-east-jakarta-excursion-zone`
- `name`: `TMII / East Jakarta Excursion Zone`
- `name_local`: `TMII`
- `city_slug`: `jkt`
- `country_slug`: `indonesia`

Краткое описание: восточный cultural-and-recreation cluster вокруг Taman Mini Indonesia Indah. Это не район центральных прогулок, а отдельная day-trip зона для знакомства с культурным, павильонным и семейным leisure-слоем Джакарты.

Подходит для:
- культурных павильонов и family day trips;
- park-scale leisure и outdoor activity;
- более вынесенного east Jakarta experience.

Текущие Atlas places в этом районе:
- `jkt-taman-mini-indonesia-indah`

---

# 2. Place Containers

## 2.1 `kota-tua-jakarta`
- `slug`: `kota-tua-jakarta`
- `name`: `Kota Tua Jakarta`
- `type`: `urban-old-town-cluster`
- `city_slug`: `jkt`
- `district_slug`: `kota-tua-glodok`

Краткое описание: исторический городской кластер старой Batavia вокруг Fatahillah Square, музеев, колониальных фасадов и pedestrian heritage-zone.

Places inside:
- `jkt-kota-tua-jakarta`

---

## 2.2 `ancol-dreamland`
- `slug`: `ancol-dreamland`
- `name`: `Ancol Dreamland`
- `type`: `recreation-park-cluster`
- `city_slug`: `jkt`
- `district_slug`: `ancol-north-coast`

Краткое описание: крупный recreation-and-amusement cluster на северном побережье Джакарты с family entertainment, beachside activity и multiple attractions.

Places inside:
- `jkt-ancol-dreamland`

---

## 2.3 `taman-mini-indonesia-indah`
- `slug`: `taman-mini-indonesia-indah`
- `name`: `Taman Mini Indonesia Indah`
- `type`: `cultural-park-cluster`
- `city_slug`: `jkt`
- `district_slug`: `tmii-east-jakarta-excursion-zone`

Краткое описание: крупный cultural-and-park cluster Восточной Джакарты с павильонами регионов Индонезии, музеями, open-air leisure и family attractions.

Places inside:
- `jkt-taman-mini-indonesia-indah`