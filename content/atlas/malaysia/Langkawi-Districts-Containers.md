# Langkawi Districts and Containers

Этот файл фиксирует новые сущности для Langkawi pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `malaysia`
- `city_slug`: `lgk`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Лангкави.

---

# 1. City Districts

## 1.1 `kuah-waterfront`
- `slug`: `kuah-waterfront`
- `name`: `Kuah Waterfront`
- `name_local`: `Kuah`
- `city_slug`: `lgk`
- `country_slug`: `malaysia`

Краткое описание: городской waterfront-контур Лангкави вокруг Kuah Jetty, Eagle Square и основных seafood spots. Это главный городской кластер острова для прогулок у воды, коротких городских остановок и знакомства с «материковым» face of Langkawi.

Подходит для:
- promenade и marina atmosphere;
- seafood restaurants и casual dining;
- первого знакомства с Kuah как с gateway-town острова.

Текущие Atlas places в этом районе:
- `lgk-eagle-square`
- `lgk-orkid-ria-seafood-restaurant`
- `lgk-sunset-dinner-cruise-langkawi`
- `lgk-wonderland-food-store`

---

## 1.2 `pantai-cenang`
- `slug`: `pantai-cenang`
- `name`: `Pantai Cenang`
- `name_local`: `Pantai Cenang`
- `city_slug`: `lgk`
- `country_slug`: `malaysia`

Краткое описание: главный beach-and-lifestyle контур Лангкави с длинным пляжем, cafés, bars и вечерней курортной жизнью. Это самая узнаваемая туристическая coastal-зона острова для пляжного отдыха и sunset dining.

Подходит для:
- beach stay и seaside walking;
- cafés, bars и sunset restaurants;
- классического resort experience на Лангкави.

Текущие Atlas places в этом районе:
- `lgk-pantai-cenang-beach`
- `lgk-the-cliff-restaurant-bar`
- `lgk-yellow-cafe`

---

## 1.3 `pantai-kok-machinchang`
- `slug`: `pantai-kok-machinchang`
- `name`: `Pantai Kok / Machinchang`
- `name_local`: `Pantai Kok`
- `city_slug`: `lgk`
- `country_slug`: `malaysia`

Краткое описание: западный scenic cluster Лангкави вокруг Pantai Kok, Oriental Village и Machinchang range. Это ключевая зона для cable car, Sky Bridge, waterfalls и обзорных природных локаций.

Подходит для:
- cable car и panoramic viewpoints;
- waterfalls и short nature trips;
- scenic west-coast day trips.

Текущие Atlas places в этом районе:
- `lgk-langkawi-cable-car`
- `lgk-langkawi-sky-bridge`
- `lgk-telaga-tujuh-waterfalls`

---

## 1.4 `kilim-karst-geoforest-zone`
- `slug`: `kilim-karst-geoforest-zone`
- `name`: `Kilim Karst Geoforest Zone`
- `name_local`: `Kilim`
- `city_slug`: `lgk`
- `country_slug`: `malaysia`

Краткое описание: северо-восточная geoforest и mangrove zone Лангкави, связанная с Kilim River, limestone karst и boat-based eco-tours. Это не городской район, а самостоятельный nature/excursion cluster в рамках Langkawi Geopark experience.

Подходит для:
- mangrove tours и boat trips;
- karst scenery и geopark experience;
- nature-focused excursions вне beach core.

Текущие Atlas places в этом районе:
- `lgk-kilim-karst-geoforest-park`

---

# 2. Place Containers

## 2.1 `kuah-waterfront-promenade`
- `slug`: `kuah-waterfront-promenade`
- `name`: `Kuah Waterfront Promenade`
- `type`: `urban-waterfront-cluster`
- `city_slug`: `lgk`
- `district_slug`: `kuah-waterfront`

Краткое описание: главный waterfront-кластер Kuah с jetty, eagle landmark, marina-edge и вечерней городской прогулочной атмосферой.

Places inside:
- `lgk-eagle-square`
- `lgk-sunset-dinner-cruise-langkawi`

---

## 2.2 `pantai-cenang-beach`
- `slug`: `pantai-cenang-beach`
- `name`: `Pantai Cenang Beach`
- `type`: `urban-beachfront`
- `city_slug`: `lgk`
- `district_slug`: `pantai-cenang`

Краткое описание: длинный beachfront-кластер Pantai Cenang как самостоятельная destination-zone для пляжа, прогулок и casual resort life.

Places inside:
- `lgk-pantai-cenang-beach`

---

## 2.3 `oriental-village-skycab`
- `slug`: `oriental-village-skycab`
- `name`: `Oriental Village / SkyCab`
- `type`: `mountain-gateway-cluster`
- `city_slug`: `lgk`
- `district_slug`: `pantai-kok-machinchang`

Краткое описание: gateway-cluster у подножия Machinchang range, где сосредоточены Langkawi Cable Car и доступ к Sky Bridge.

Places inside:
- `lgk-langkawi-cable-car`
- `lgk-langkawi-sky-bridge`
