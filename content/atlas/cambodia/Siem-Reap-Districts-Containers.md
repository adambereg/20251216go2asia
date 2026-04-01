# Siem Reap Districts and Containers

Этот файл фиксирует новые сущности для Siem Reap pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `rep`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Сием Рипа.

---

# 1. City Districts

## 1.1 `central-siem-reap-urban-core`
- `slug`: `central-siem-reap-urban-core`
- `name`: `Central Siem Reap Urban Core`
- `name_local`: `ក្រុងសៀមរាប`
- `city_slug`: `rep`
- `country_slug`: `cambodia`

Краткое описание: городской центр Сием Рипа вокруг riverfront, Old Market / Pub Street зоны, Sok San Road и основных вечерних и туристических маршрутов. Это базовый городской контур для nightlife, ресторанов, культурных шоу и первого знакомства с городом вне храмового комплекса Angkor.

Подходит для:
- вечерних прогулок и городской атмосферы;
- ресторанов, баров и nightlife;
- культурных шоу и базирования в центре Сием Рипа.

Текущие Atlas places в этом районе:
- `rep-phare-circus`
- `rep-pub-street`

---

## 1.2 `angkor-archaeological-park-core`
- `slug`: `angkor-archaeological-park-core`
- `name`: `Angkor Archaeological Park Core`
- `name_local`: `អង្គរ`
- `city_slug`: `rep`
- `country_slug`: `cambodia`

Краткое описание: главный храмовый и археологический контур Angkor у северного края Сием Рипа. Здесь сосредоточены самые знаковые monument-temples и классические маршруты Angkor Small Circuit / Grand Circuit, включая Angkor Wat, Bayon, Ta Prohm и Preah Khan.

Подходит для:
- храмов и археологического наследия;
- первого знакомства с Angkor;
- дневных маршрутных поездок по monument-core.

Текущие Atlas places в этом районе:
- `rep-angkor-wat`
- `rep-bayon`
- `rep-preah-khan`
- `rep-ta-prohm`

---

## 1.3 `banteay-srei-excursion-zone`
- `slug`: `banteay-srei-excursion-zone`
- `name`: `Banteay Srei Excursion Zone`
- `name_local`: `បន្ទាយស្រី`
- `city_slug`: `rep`
- `country_slug`: `cambodia`

Краткое описание: внешняя excursion-зона к северо-востоку от основного храмового контура Angkor, связанная с Banteay Srei и более удалёнными историческими выездами из Сием Рипа. Это не городской район в строгом смысле, а важный day-trip cluster для тех, кто выходит за пределы базового temple core.

Подходит для:
- удалённых храмовых day trips;
- более спокойного temple experience вне main circuit;
- расширенного знакомства с Angkor region.

Текущие Atlas places в этом районе:
- `rep-banteay-srei`

---

## 1.4 `phnom-kulen-excursion-zone`
- `slug`: `phnom-kulen-excursion-zone`
- `name`: `Phnom Kulen Excursion Zone`
- `name_local`: `ភ្នំគូលែន`
- `city_slug`: `rep`
- `country_slug`: `cambodia`

Краткое описание: внешняя природная excursion-зона в Siem Reap Province, связанная с Phnom Kulen National Park, водопадами, river carvings и sacred mountain landscape. Это уже не городской и не храмовый core, а отдельный природный day-trip кластер.

Подходит для:
- природных выездов из Сием Рипа;
- водопадов и sacred mountain landscapes;
- сочетания природы и историко-религиозного контекста.

Текущие Atlas places в этом районе:
- `rep-phnom-kulen-national-park`

---

# 2. Place Containers

## 2.1 `pub-street`
- `slug`: `pub-street`
- `name`: `Pub Street`
- `type`: `nightlife-street-cluster`
- `city_slug`: `rep`
- `district_slug`: `central-siem-reap-urban-core`

Краткое описание: главный nightlife- и dining-коридор Сием Рипа в центре города, воспринимаемый как самостоятельная destination-zone, а не одна точка.

Places inside:
- `rep-pub-street`
