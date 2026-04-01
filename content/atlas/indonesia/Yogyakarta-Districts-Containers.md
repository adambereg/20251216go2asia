# Yogyakarta Districts and Containers

Этот файл фиксирует новые сущности для Yogyakarta pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `indonesia`
- `city_slug`: `jog`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Джокьякарты.

---

# 1. City Districts

## 1.1 `central-kraton-malioboro`
- `slug`: `central-kraton-malioboro`
- `name`: `Central Kraton / Malioboro`
- `name_local`: `Kraton / Malioboro`
- `city_slug`: `jog`
- `country_slug`: `indonesia`

Краткое описание: историческое и туристическое ядро Джокьякарты вокруг Kraton, Taman Sari, Malioboro и близлежащих улиц старого центра. Это главный район для первого знакомства с городом: дворцовый контур, торговые улицы, уличная еда, кофейни и плотная городская жизнь.

Подходит для:
- первого знакомства с Джокьякартой;
- прогулок по историческому центру;
- street food, рынков и городской атмосферы.

Текущие Atlas places в этом районе:
- `yog-gudeg-yu-djum`
- `yog-kraton-yogyakarta`
- `yog-malioboro-street`
- `yog-nasi-kucing-angkringan-lik-man`
- `yog-sosro-coffee`
- `yog-taman-sari-water-castle`

---

## 1.2 `prawirotaman-mantrijeron`
- `slug`: `prawirotaman-mantrijeron`
- `name`: `Prawirotaman / Mantrijeron`
- `name_local`: `Prawirotaman / Mantrijeron`
- `city_slug`: `jog`
- `country_slug`: `indonesia`

Краткое описание: южный urban-lifestyle район Джокьякарты, известный как backpacker и café contour вокруг Prawirotaman. Это зона более расслабленной, креативной и международной атмосферы с кафе, vegetarian spots, guesthouses и медленным ритмом.

Подходит для:
- cafés и brunch-мест;
- более спокойной городской атмосферы;
- backpacker и creative-travel среды.

Текущие Atlas places в этом районе:
- `yog-milas-restaurant`
- `yog-via-via-cafe`

---

## 1.3 `prambanan-ratu-boko-excursion-zone`
- `slug`: `prambanan-ratu-boko-excursion-zone`
- `name`: `Prambanan / Ratu Boko Excursion Zone`
- `name_local`: `Prambanan`
- `city_slug`: `jog`
- `country_slug`: `indonesia`

Краткое описание: восточная temple-and-hills excursion-zone на границе города и Sleman, связанная с Prambanan, холмами Sambirejo и обзорными точками на храмовый комплекс. Это не городской центр, а важный day-trip cluster для храмов, видов и scenic dining.

Подходит для:
- Prambanan и окрестных храмовых выездов;
- sunset views и hill dining;
- коротких историко-пейзажных поездок из Джокьякарты.

Текущие Atlas places в этом районе:
- `yog-abhayagiri-restaurant`
- `yog-prambanan-temple`

---

## 1.4 `borobudur-kedu-plain-excursion-zone`
- `slug`: `borobudur-kedu-plain-excursion-zone`
- `name`: `Borobudur / Kedu Plain Excursion Zone`
- `name_local`: `Borobudur`
- `city_slug`: `jog`
- `country_slug`: `indonesia`

Краткое описание: внешняя историко-ландшафтная excursion-zone к северо-западу от Джокьякарты, связанная с Borobudur и равниной Kedu. Это не городской район, а один из главных heritage day trips региона.

Подходит для:
- главного буддийского monument-site региона;
- исторических и sunrise day trips;
- знакомства с heritage-layer Центральной Явы за пределами города.

Текущие Atlas places в этом районе:
- `yog-borobudur-temple`

---

## 1.5 `kaliurang-merapi-excursion-zone`
- `slug`: `kaliurang-merapi-excursion-zone`
- `name`: `Kaliurang / Merapi Excursion Zone`
- `name_local`: `Kaliurang / Merapi`
- `city_slug`: `jog`
- `country_slug`: `indonesia`

Краткое описание: северная volcanic excursion-zone у склонов Merapi, связанная с Kaliurang, jeep lava tours и горными видами. Это не городской контур, а природный и adventure-oriented выезд из Джокьякарты.

Подходит для:
- Merapi views и volcano experience;
- jeep tours и природных маршрутов;
- более прохладного mountain day trip из города.

Текущие Atlas places в этом районе:
- `yog-mount-merapi`

---

# 2. Place Containers

## 2.1 `malioboro-street`
- `slug`: `malioboro-street`
- `name`: `Malioboro Street`
- `type`: `urban-street-cluster`
- `city_slug`: `jog`
- `district_slug`: `central-kraton-malioboro`

Краткое описание: главный городской street-corridor Джокьякарты с магазинами, уличной едой, туристической жизнью и вечерними прогулками. Это самостоятельная destination-zone внутри центрального ядра города.

Places inside:
- `yog-malioboro-street`
