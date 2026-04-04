# Cebu Districts and Containers

Этот файл фиксирует новые сущности для Cebu pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `philippines`
- `city_slug`: `ceb`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Себу.

---

# 1. City Districts

## 1.1 `colonial-port-core`
- `slug`: `colonial-port-core`
- `name`: `Colonial Port Core`
- `name_local`: `Santo Niño / Plaza Independencia`
- `city_slug`: `ceb`
- `country_slug`: `philippines`

Краткое описание: историческое ядро Cebu City вокруг Basilica del Santo Niño, Magellan’s Cross, Fort San Pedro и Plaza Independencia. Это главный heritage-контур города, где сосредоточены ранние испанские слои, религиозные landmark-объекты и первая прогулочная ось для знакомства с историей Себу.

Подходит для:
- первого знакомства с историческим Cebu City;
- храмов, фортов и испанского heritage-слоя;
- коротких пеших маршрутов по old-core у waterfront edge.

Текущие Atlas places в этом районе:
- `ceb-basilica-minore-del-santo-nino-magellan-s-cross`
- `ceb-basilica-minore-del-santo-nio-magellans-cross`
- `ceb-fort-san-pedro`

---

## 1.2 `fuente-capitol-urban-core`
- `slug`: `fuente-capitol-urban-core`
- `name`: `Fuente / Capitol Urban Core`
- `name_local`: `Fuente Osmeña / Capitol`
- `city_slug`: `ceb`
- `country_slug`: `philippines`

Краткое описание: центральный городской контур вокруг Fuente Osmeña, Capitol Site и соседних dining streets. Это более современный urban Cebu с местной гастрономией, транспортной доступностью и понятной городской жизнью за пределами colonial core.

Подходит для:
- local food и casual dining;
- повседневного городского опыта в центре Себу;
- базирования между heritage layer и upland районами.

Текущие Atlas places в этом районе:
- `ceb-larsian-bbq`

---

## 1.3 `lahug-beverly-hills`
- `slug`: `lahug-beverly-hills`
- `name`: `Lahug / Beverly Hills`
- `name_local`: `Lahug / Beverly Hills`
- `city_slug`: `ceb`
- `country_slug`: `philippines`

Краткое описание: upland-городской контур к северу от downtown, связанный с Lahug, Beverly Hills и более жилой hillside средой. Это район panoramic viewpoints, известных local restaurants и храмовых stopovers над городом.

Подходит для:
- hillside views и более спокойной городской атмосферы;
- local restaurants вне tourist-heavy old core;
- храмов и scenic detours по северной части Cebu City.

Текущие Atlas places в этом районе:
- `ceb-cebu-taoist-temple`
- `ceb-house-of-lechon`

---

## 1.4 `badian-kawasan-excursion-zone`
- `slug`: `badian-kawasan-excursion-zone`
- `name`: `Badian / Kawasan Excursion Zone`
- `name_local`: `Badian / Kawasan`
- `city_slug`: `ceb`
- `country_slug`: `philippines`

Краткое описание: внешняя природная excursion-zone на юго-западе острова Cebu, связанная с Kawasan Falls и каньонирингом в районе Badian / Matutinao. Это не городской район Себу в строгом смысле, а важный day-trip cluster внутри текущего Atlas Cebu dataset.

Подходит для:
- waterfalls и canyoning trips;
- природных day trips за пределы Cebu City;
- adventure-oriented поездок по острову Себу.

Текущие Atlas places в этом районе:
- `ceb-kawasan-falls`

---

# 2. Place Containers

## 2.1 `santo-nino-magellans-cross`
- `slug`: `santo-nino-magellans-cross`
- `name`: `Santo Niño & Magellan’s Cross`
- `type`: `historic-religious-cluster`
- `city_slug`: `ceb`
- `district_slug`: `colonial-port-core`

Краткое описание: историко-религиозный cluster вокруг Basilica del Santo Niño и Magellan’s Cross как единая destination-zone, а не одиночная точка.

Places inside:
- `ceb-basilica-minore-del-santo-nino-magellan-s-cross`
- `ceb-basilica-minore-del-santo-nio-magellans-cross`
