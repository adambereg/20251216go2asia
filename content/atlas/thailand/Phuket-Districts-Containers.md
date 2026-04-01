# Phuket Districts and Containers

Этот файл фиксирует новые сущности для Phuket pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `hkt`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Пхукета.

---

# 1. City Districts

## 1.1 `phuket-old-town`
- `slug`: `phuket-old-town`
- `name`: `Phuket Old Town`
- `name_local`: `เมืองเก่าภูเก็ต`
- `city_slug`: `hkt`
- `country_slug`: `thailand`

Краткое описание: историческое ядро Пхукета в районе Phuket Town с Sino-Portuguese архитектурой, старыми особняками, музеями, знаменитыми ресторанами и атмосферой старого торгового города. Это главный район для urban-части острова и лучшая точка входа в культурный, гастрономический и архитектурный Пхукет.

Подходит для:
- исторических прогулок и стрит-фото;
- локальной гастрономии и знаменитых ресторанов;
- знакомства с архитектурным и культурным слоем Пхукета.

Текущие Atlas places в этом районе:
- `phk-blue-elephant-phuket`
- `phk-old-phuket-town`
- `phk-raya-restaurant`

---

## 1.2 `patong-kalim`
- `slug`: `patong-kalim`
- `name`: `Patong / Kalim`
- `name_local`: `ป่าตอง / กะหลิม`
- `city_slug`: `hkt`
- `country_slug`: `thailand`

Краткое описание: главный beach-and-nightlife район западного Пхукета, где сосредоточены Patong Beach, рестораны, кафе с видами, отели и самая насыщенная туристическая жизнь острова. Kalim логично живёт в том же coastal cluster как более спокойный северный край Patong bay.

Подходит для:
- пляжного отдыха и sunset views;
- ресторанов и кафе с видом на море;
- активной туристической среды, nightlife и первого курортного опыта на Пхукете.

Текущие Atlas places в этом районе:
- `phk-baan-rim-pa`
- `phk-cafe-phuket-viewpoint`
- `phk-no-6-restaurant`
- `phk-patong-beach`

---

## 1.3 `chalong-big-buddha`
- `slug`: `chalong-big-buddha`
- `name`: `Chalong / Big Buddha`
- `name_local`: `ฉลอง`
- `city_slug`: `hkt`
- `country_slug`: `thailand`

Краткое описание: юго-восточный район Пхукета, связанный с Chalong Bay, пирсом, морскими выездами и подъёмом к Big Buddha на Nakkerd Hill. Это важная зона для landmark-локаций, seafood у воды и маршрутов, связывающих Phuket Town с югом острова.

Подходит для:
- landmark-поездок к Big Buddha;
- seafood и waterfront-локаций;
- выездов через Chalong и южный Пхукет.

Текущие Atlas places в этом районе:
- `phk-big-buddha-phuket`
- `phk-kan-eang-pier`

---

## 1.4 `rawai-promthep`
- `slug`: `rawai-promthep`
- `name`: `Rawai / Promthep`
- `name_local`: `ราไวย์`
- `city_slug`: `hkt`
- `country_slug`: `thailand`

Краткое описание: южная coastal-зона острова с Rawai, мысом Promthep и одними из самых известных sunset viewpoints на Пхукете. Это scenic район для видов, прогулок у моря и ощущения южного края острова.

Подходит для:
- sunset viewpoints и scenic drives;
- морских панорам и прогулок;
- южного coastal experience вне суеты Patong.

Текущие Atlas places в этом районе:
- `phk-promthep-cape`

---

## 1.5 `wichit-kathu-hills`
- `slug`: `wichit-kathu-hills`
- `name`: `Wichit / Kathu Hills`
- `name_local`: `วิชิต / กะทู้`
- `city_slug`: `hkt`
- `country_slug`: `thailand`

Краткое описание: зелёный hill-and-jungle corridor между Phuket Town, Kathu и дорогой в сторону Chalong, где urban Пхукет переходит в более обзорную и природную среду. Это хороший район для hillside dining, джангл-атмосферы и панорамных точек недалеко от города.

Подходит для:
- jungle dining и видовых ресторанов;
- коротких scenic выездов из Phuket Town;
- более зелёной и обзорной атмосферы рядом с городом.

Текущие Atlas places в этом районе:
- `phk-three-monkeys-restaurant`

---

## 1.6 `phi-phi-excursion-zone`
- `slug`: `phi-phi-excursion-zone`
- `name`: `Phi Phi Excursion Zone`
- `name_local`: `เกาะพีพี`
- `city_slug`: `hkt`
- `country_slug`: `thailand`

Краткое описание: внешняя excursion-зона, связанная с Koh Phi Phi и морскими day trips, которые обычно продаются и потребляются как часть Phuket travel experience. Это не городской район в строгом смысле, а важный внешний island cluster для Atlas Phuket.

Подходит для:
- island hopping и морских экскурсий;
- day trips из Пхукета;
- postcard-пейзажей, пляжей и boating experience.

Текущие Atlas places в этом районе:
- `phk-phi-phi-islands`

---

# 2. Place Containers

## 2.1 `phuket-old-town`
- `slug`: `phuket-old-town`
- `name`: `Phuket Old Town`
- `type`: `urban-old-town-cluster`
- `city_slug`: `hkt`
- `district_slug`: `phuket-old-town`

Краткое описание: исторический городской кластер в центре Phuket Town, который воспринимается как самостоятельная destination-zone с улицами, кафе, особняками, музеями и локальной гастрономией.

Places inside:
- `phk-old-phuket-town`

---

## 2.2 `patong-beach`
- `slug`: `patong-beach`
- `name`: `Patong Beach`
- `type`: `urban-beachfront`
- `city_slug`: `hkt`
- `district_slug`: `patong-kalim`

Краткое описание: главный beachfront-кластер западного Пхукета с длинной полосой пляжа, набережной, отелями, ресторанами и самой узнаваемой resort-атмосферой острова.

Places inside:
- `phk-patong-beach`

---

## 2.3 `promthep-cape`
- `slug`: `promthep-cape`
- `name`: `Promthep Cape`
- `type`: `scenic-cape-cluster`
- `city_slug`: `hkt`
- `district_slug`: `rawai-promthep`

Краткое описание: scenic coastal cluster на южной оконечности Пхукета вокруг обзорных точек, мыса и sunset-панорам.

Places inside:
- `phk-promthep-cape`

---

## 2.4 `phi-phi-islands`
- `slug`: `phi-phi-islands`
- `name`: `Phi Phi Islands`
- `type`: `island-archipelago-cluster`
- `city_slug`: `hkt`
- `district_slug`: `phi-phi-excursion-zone`

Краткое описание: island-cluster, который в пользовательском восприятии существует как самостоятельная destination-zone, а не как одиночная точка.

Places inside:
- `phk-phi-phi-islands`
