# Singapore Districts and Containers

Этот файл фиксирует новые сущности для Singapore pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `singapore`
- `city_slug`: `sin`

> Важно: это curated operational set для существующих Atlas places Сингапура, а не полный административный список районов города-государства.

---

# 1. City Districts

## 1.1 `marina-bay-civic-core`
- `slug`: `marina-bay-civic-core`
- `name`: `Marina Bay / Civic Core`
- `name_local`: `滨海湾 / 市政区`
- `city_slug`: `sin`
- `country_slug`: `singapore`

Краткое описание: главный postcard и civic contour Сингапура вокруг Marina Bay, Merlion, Marina Bay Sands, National Gallery и waterfront promenade. Это район для первого знакомства с городом, skyline views и самых узнаваемых landmark-объектов.

Подходит для:
- первого знакомства с Сингапуром;
- skyline views, waterfront и civic landmarks;
- классических city highlights у Marina Bay.

Текущие Atlas places в этом районе:
- `sgp-gardens-by-the-bay`
- `sgp-marina-bay-sands-skypark`
- `sgp-merlion-park`
- `sgp-odette`

---

## 1.2 `bugis-bras-basah`
- `slug`: `bugis-bras-basah`
- `name`: `Bugis / Bras Basah`
- `name_local`: `武吉士 / 勿拉士巴沙`
- `city_slug`: `sin`
- `country_slug`: `singapore`

Краткое описание: центральный heritage-and-lifestyle contour вокруг Bugis, Bras Basah и Beach Road с историческими отелями, grand bars и культурными институциями. Это городской слой с более классической архитектурой и refined evening atmosphere.

Подходит для:
- исторических отелей и коктейльных баров;
- вечерней городской атмосферы;
- city walks между heritage и modern Singapore.

Текущие Atlas places в этом районе:
- `sgp-atlas-rooftop-bar`
- `sgp-long-bar`

---

## 1.3 `telok-ayer-chinatown-food-core`
- `slug`: `telok-ayer-chinatown-food-core`
- `name`: `Telok Ayer / Chinatown Food Core`
- `name_local`: `直落亚逸 / 牛车水`
- `city_slug`: `sin`
- `country_slug`: `singapore`

Краткое описание: плотный hawker-and-food contour в старом торговом ядре между Telok Ayer, Boon Tat Street и Chinatown. Это одна из самых понятных зон для знакомства с сингапурской hawker culture и urban food heritage.

Подходит для:
- hawker centres и food walks;
- Chinatown/Telok Ayer atmosphere;
- локальной городской гастрономии.

Текущие Atlas places в этом районе:
- `sgp-lau-pa-sat-hawker-centre`
- `sgp-maxwell-food-centre`

---

## 1.4 `singapore-river-clarke-quay`
- `slug`: `singapore-river-clarke-quay`
- `name`: `Singapore River / Clarke Quay`
- `name_local`: `新加坡河 / 克拉码头`
- `city_slug`: `sin`
- `country_slug`: `singapore`

Краткое описание: riverside entertainment contour вдоль Singapore River вокруг Clarke Quay, Boat Quay и Riverside Point. Это зона для ужинов у воды, вечерних прогулок и более живой dining/nightlife среды.

Подходит для:
- riverside dining;
- вечерних прогулок у воды;
- nightlife и городской leisure-среды.

Текущие Atlas places в этом районе:
- `sgp-jumbo-seafood`

---

## 1.5 `changi-airport-east`
- `slug`: `changi-airport-east`
- `name`: `Changi Airport / East`
- `name_local`: `樟宜机场`
- `city_slug`: `sin`
- `country_slug`: `singapore`

Краткое описание: восточный airport-and-transit contour вокруг Changi Airport и Jewel. Это не городской центр, а самостоятельный lifestyle-and-transit cluster, который часто становится отдельной destination-stop внутри поездки по Сингапуру.

Подходит для:
- transit stopovers;
- airport-side leisure и shopping;
- icon-level indoor attractions.

Текущие Atlas places в этом районе:
- `sgp-jewel-changi-airport`

---

## 1.6 `sentosa-island-resort-zone`
- `slug`: `sentosa-island-resort-zone`
- `name`: `Sentosa Island Resort Zone`
- `name_local`: `圣淘沙`
- `city_slug`: `sin`
- `country_slug`: `singapore`

Краткое описание: отдельный island-resort contour к югу от main island с beaches, attractions и leisure-driven city escapes. Это не downtown Singapore, а самостоятельный resort cluster.

Подходит для:
- resort-style отдыха;
- beaches и family attractions;
- short leisure escapes из city core.

Текущие Atlas places в этом районе:
- `sgp-sentosa-island`

---

## 1.7 `tanglin-botanic-gardens`
- `slug`: `tanglin-botanic-gardens`
- `name`: `Tanglin / Botanic Gardens`
- `name_local`: `东陵 / 植物园`
- `city_slug`: `sin`
- `country_slug`: `singapore`

Краткое описание: зелёный garden-and-embassy contour на краю Orchard/Tanglin вокруг Singapore Botanic Gardens. Это более спокойный, leafy и UNESCO-linked слой города, отличный от Marina Bay и downtown food core.

Подходит для:
- gardens и outdoor walks;
- более спокойного Singapore experience;
- heritage greenery и park time.

Текущие Atlas places в этом районе:
- `sgp-singapore-botanic-gardens`

---

# 2. Place Containers

## 2.1 `marina-bay-waterfront`
- `slug`: `marina-bay-waterfront`
- `name`: `Marina Bay Waterfront`
- `type`: `urban-waterfront-cluster`
- `city_slug`: `sin`
- `district_slug`: `marina-bay-civic-core`

Краткое описание: главный waterfront cluster Сингапура вокруг Bay promenade, skyline, Merlion и bay-facing landmarks.

Places inside:
- `sgp-marina-bay-sands-skypark`
- `sgp-merlion-park`

---

## 2.2 `gardens-by-the-bay`
- `slug`: `gardens-by-the-bay`
- `name`: `Gardens by the Bay`
- `type`: `urban-garden-cluster`
- `city_slug`: `sin`
- `district_slug`: `marina-bay-civic-core`

Краткое описание: самостоятельный garden-destination cluster у Marina Bay с Supertrees, conservatories и park-scale attractions.

Places inside:
- `sgp-gardens-by-the-bay`

---

## 2.3 `lau-pa-sat`
- `slug`: `lau-pa-sat`
- `name`: `Lau Pa Sat`
- `type`: `hawker-market-cluster`
- `city_slug`: `sin`
- `district_slug`: `telok-ayer-chinatown-food-core`

Краткое описание: historic hawker-market cluster на Boon Tat Street, отдельная city-food destination внутри downtown Singapore.

Places inside:
- `sgp-lau-pa-sat-hawker-centre`

---

## 2.4 `jewel-changi`
- `slug`: `jewel-changi`
- `name`: `Jewel Changi`
- `type`: `airport-lifestyle-cluster`
- `city_slug`: `sin`
- `district_slug`: `changi-airport-east`

Краткое описание: airport-lifestyle cluster у Changi Airport с indoor waterfall, retail и entertainment spaces.

Places inside:
- `sgp-jewel-changi-airport`

---

## 2.5 `sentosa-island`
- `slug`: `sentosa-island`
- `name`: `Sentosa Island`
- `type`: `island-resort-cluster`
- `city_slug`: `sin`
- `district_slug`: `sentosa-island-resort-zone`

Краткое описание: самостоятельный island-resort cluster Сингапура, а не единичная точка.

Places inside:
- `sgp-sentosa-island`

---

## 2.6 `singapore-botanic-gardens`
- `slug`: `singapore-botanic-gardens`
- `name`: `Singapore Botanic Gardens`
- `type`: `botanic-garden-cluster`
- `city_slug`: `sin`
- `district_slug`: `tanglin-botanic-gardens`

Краткое описание: большой garden cluster и UNESCO-linked green destination внутри Singapore.

Places inside:
- `sgp-singapore-botanic-gardens`
