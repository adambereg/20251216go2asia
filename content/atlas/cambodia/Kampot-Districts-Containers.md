# Kampot Districts and Containers

Этот файл фиксирует новые сущности для Kampot pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `kmp`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Кампота.
> Отдельно важно: в текущем Atlas dataset у города `kmp` есть два места, которые фактически относятся к **Kep**, а не к городскому ядру Kampot. Поэтому для этого city pass используется product-онтология: **Kampot urban core + Kep coastal excursion zone + pepper countryside excursion zone**.

---

# 1. City Districts

## 1.1 `kampot-riverside-old-town`
- `slug`: `kampot-riverside-old-town`
- `name`: `Kampot Riverside / Old Town`
- `name_local`: `កំពត`
- `city_slug`: `kmp`
- `country_slug`: `cambodia`

Краткое описание: историческое riverfront-ядро Кампота вдоль реки Kampot River с колониальной архитектурой, набережной, кафе и неспешной провинциальной атмосферой. Это главный городской кластер для прогулок, гастрономии и первого знакомства именно с городом Kampot.

Подходит для:
- прогулок по набережной и старому центру;
- кафе и неспешной городской атмосферы;
- первого знакомства с Кампотом как river town.

Текущие Atlas places в этом районе:
- _нет текущих places в этом наборе, но район нужен как городской anchor для ontology слоя_

---

## 1.2 `kep-coastal-excursion-zone`
- `slug`: `kep-coastal-excursion-zone`
- `name`: `Kep Coastal Excursion Zone`
- `name_local`: `កែប`
- `city_slug`: `kmp`
- `country_slug`: `cambodia`

Краткое описание: внешняя coastal excursion-зона к востоку от Кампота, связанная с бывшим seaside resort городом Kep, его crab market, спокойным пляжем и национальным парком. Это не городской район Кампота в строгом смысле, а важный day-trip / side-trip cluster внутри текущего Atlas Kampot set.

Подходит для:
- seafood и crab market experience;
- coastal day trips из Кампота;
- коротких природных прогулок и seaside atmosphere.

Текущие Atlas places в этом районе:
- `kmp-crab-market`
- `kmp-kep-national-park-kep-beach`

---

## 1.3 `kampot-pepper-countryside`
- `slug`: `kampot-pepper-countryside`
- `name`: `Kampot Pepper Countryside`
- `name_local`: `កំពត`
- `city_slug`: `kmp`
- `country_slug`: `cambodia`

Краткое описание: сельская inland-зона Kampot Province, связанная с pepper plantations, известняковыми холмами, rural roads и гастрономическим агротуризмом. Это не городской район, а природно-аграрный excursion cluster, важный для понимания Kampot как pepper destination.

Подходит для:
- pepper farm visits и дегустаций;
- rural scenery и countryside drives;
- гастрономического агротуризма за пределами города.

Текущие Atlas places в этом районе:
- `kmp-la-plantation-pepper-farm`

---

# 2. Place Containers

Для текущего Kampot set отдельные `place_containers` не нужны.

Причина:
- `Crab Market`, `Kep National Park & Kep Beach` и `La Plantation Pepper Farm` уже являются самостоятельными destination-scale place entities;
- внутри этого city pass нет необходимости вводить дополнительный container layer.
