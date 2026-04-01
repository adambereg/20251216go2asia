# Chiang Mai Districts and Containers

Этот файл фиксирует новые сущности для Chiang Mai pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `cnx`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Чиангмая.

---

# 1. City Districts

## 1.1 `old-city`
- `slug`: `old-city`
- `name`: `Old City`
- `name_local`: `เมืองเก่าเชียงใหม่`
- `city_slug`: `cnx`
- `country_slug`: `thailand`

Краткое описание: историческое ядро Чиангмая внутри старых стен и рвов. Это главный район для первого знакомства с городом: здесь сосредоточены храмы, пешие маршруты, рынки, старые улицы и значительная часть атмосферных кафе и ресторанов.

Подходит для:
- храмов и исторических прогулок;
- первого знакомства с Чиангмаем;
- рынков, пеших маршрутов и кафе в центре города.

Текущие Atlas places в этом районе:
- `cnx-dash-restaurant`
- `cnx-fern-forest-cafe`
- `cnx-graph-cafe`
- `cnx-khao-soi-khun-yai`
- `cnx-old-city`
- `cnx-sunday-walking-street-market`
- `cnx-wat-chedi-luang`

---

## 1.2 `nimman`
- `slug`: `nimman`
- `name`: `Nimman`
- `name_local`: `นิมมานเหมินทร์`
- `city_slug`: `cnx`
- `country_slug`: `thailand`

Краткое описание: современный креативный район Чиангмая, связанный с digital nomad сценой, кофейнями, бутиками, галереями и городской жизнью нового типа. Это одна из самых узнаваемых lifestyle-зон города.

Подходит для:
- specialty coffee и cafés;
- digital nomad среды;
- шопинга, галерей и современной городской атмосферы.

Текущие Atlas places в этом районе:
- `cnx-nimmanhaemin-road`

---

## 1.3 `riverside-wat-ket`
- `slug`: `riverside-wat-ket`
- `name`: `Riverside / Wat Ket`
- `name_local`: `วัดเกต`
- `city_slug`: `cnx`
- `country_slug`: `thailand`

Краткое описание: riverside-зона вдоль Ping River с более расслабленной атмосферой, историческими особняками, арт-пространствами и ресторанами у воды. Район удобен для неспешных прогулок, ужинов и вечернего отдыха.

Подходит для:
- ресторанов у реки;
- более спокойной городской атмосферы;
- кафе, искусства и прогулок у воды.

Текущие Atlas places в этом районе:
- `cnx-the-riverside-bar-restaurant`
- `cnx-woo-cafe-art-gallery`

---

## 1.4 `suthep-doi-suthep`
- `slug`: `suthep-doi-suthep`
- `name`: `Suthep / Doi Suthep`
- `name_local`: `สุเทพ`
- `city_slug`: `cnx`
- `country_slug`: `thailand`

Краткое описание: западная зона Чиангмая, которая связывает город с горой Doi Suthep и её важнейшими духовными и природными локациями. Это район, где городской ритм переходит в более возвышенную, обзорную и паломническую атмосферу.

Подходит для:
- храмов и панорамных видов;
- поездок в горную часть над городом;
- духовных и природных локаций.

Текущие Atlas places в этом районе:
- `cnx-wat-phra-that-doi-suthep`

---

## 1.5 `mae-taeng-excursion-zone`
- `slug`: `mae-taeng-excursion-zone`
- `name`: `Mae Taeng Excursion Zone`
- `name_local`: `แม่แตง`
- `city_slug`: `cnx`
- `country_slug`: `thailand`

Краткое описание: северная excursion-зона провинции Чиангмай, куда едут ради природных ландшафтов, слоновьих sanctuary и более спокойного rural experience. Это не центральный городской район, а важный внешний travel cluster для Atlas Chiang Mai.

Подходит для:
- ethical elephant experiences;
- природных поездок за пределы центра;
- спокойных однодневных выездов.

Текущие Atlas places в этом районе:
- `cnx-elephant-nature-park`

---

## 1.6 `chom-thong-excursion-zone`
- `slug`: `chom-thong-excursion-zone`
- `name`: `Chom Thong Excursion Zone`
- `name_local`: `จอมทอง`
- `city_slug`: `cnx`
- `country_slug`: `thailand`

Краткое описание: юго-западная excursion-зона провинции Чиангмай, связанная с Doi Inthanon, водопадами, лесами и high-altitude природными маршрутами. Это ключевое направление для тех, кто хочет увидеть самую высокую точку Таиланда и выйти за пределы городского опыта.

Подходит для:
- национального парка Doi Inthanon;
- водопадов и природных троп;
- mountain day trips из Чиангмая.

Текущие Atlas places в этом районе:
- `cnx-doi-inthanon-national-park`

---

# 2. Place Containers

## 2.1 `chiang-mai-old-city`
- `slug`: `chiang-mai-old-city`
- `name`: `Chiang Mai Old City`
- `type`: `urban-area-cluster`
- `city_slug`: `cnx`
- `district_slug`: `old-city`

Краткое описание: исторический городской кластер внутри стен Чиангмая, который воспринимается как самостоятельная destination-zone со множеством храмов, улиц, кафе и рынков.

Places inside:
- `cnx-old-city`

---

## 2.2 `nimmanhaemin-road`
- `slug`: `nimmanhaemin-road`
- `name`: `Nimmanhaemin Road`
- `type`: `urban-street-cluster`
- `city_slug`: `cnx`
- `district_slug`: `nimman`

Краткое описание: центральная улица и lifestyle-кластер района Nimman с кафе, бутиками, современными пространствами и digital nomad атмосферой.

Places inside:
- `cnx-nimmanhaemin-road`

---

## 2.3 `sunday-walking-street-market`
- `slug`: `sunday-walking-street-market`
- `name`: `Sunday Walking Street Market`
- `type`: `market-route`
- `city_slug`: `cnx`
- `district_slug`: `old-city`

Краткое описание: большой воскресный market-route внутри Старого города с уличной едой, ремёслами, музыкой и вечерней прогулочной атмосферой.

Places inside:
- `cnx-sunday-walking-street-market`