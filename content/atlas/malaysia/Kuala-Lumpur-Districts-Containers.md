# Kuala Lumpur Districts and Containers

Этот файл фиксирует новые сущности для Kuala Lumpur pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `malaysia`
- `city_slug`: `kul`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Куала-Лумпура.

---

# 1. City Districts

## 1.1 `klcc-city-centre`
- `slug`: `klcc-city-centre`
- `name`: `KLCC / City Centre`
- `name_local`: `KLCC / Pusat Bandar`

Краткое описание: современное skyline-ядро Куала-Лумпура вокруг KLCC, Petronas Twin Towers, Suria KLCC и городского парка. Это главный polished city-centre contour для iconic skyline views, shopping и узнаваемого metropolitan Kuala Lumpur.

Подходит для:
- skyline views и главных city landmarks;
- shopping, parks и polished city-centre atmosphere;
- первого знакомства с современным Куала-Лумпуром.

Текущие Atlas places в этом районе:
- `kll-klcc-park`
- `kll-madam-kwan-s`
- `kll-petronas-twin-towers`

---

## 1.2 `bukit-bintang-jalan-alor`
- `slug`: `bukit-bintang-jalan-alor`
- `name`: `Bukit Bintang / Jalan Alor`
- `name_local`: `Bukit Bintang`

Краткое описание: самый живой entertainment, shopping и food contour центрального Куала-Лумпура вокруг Bukit Bintang, Jalan Alor и соседних rooftop-барах. Это район для night food scene, городского драйва и плотной туристической активности.

Подходит для:
- street food и night market atmosphere;
- shopping и nightlife;
- rooftop bars и активного вечернего города.

Текущие Atlas places в этом районе:
- `kll-bukit-bintang`
- `kll-heli-lounge-bar`
- `kll-jalan-alor-food-street`

---

## 1.3 `merdeka-pasar-seni`
- `slug`: `merdeka-pasar-seni`
- `name`: `Merdeka / Pasar Seni`
- `name_local`: `Dataran Merdeka / Pasar Seni`

Краткое описание: историко-гражданское ядро Куала-Лумпура вокруг Merdeka Square, Sultan Abdul Samad area и Central Market / Pasar Seni. Это район колониальной архитектуры, городских площадей и классического old-KL heritage layer.

Подходит для:
- исторических прогулок и colonial heritage;
- рынков, площадей и старого городского слоя;
- первого знакомства с historical Kuala Lumpur.

Текущие Atlas places в этом районе:
- `kll-central-market`
- `kll-merdeka-square`

---

## 1.4 `bukit-nanas-ceylon`
- `slug`: `bukit-nanas-ceylon`
- `name`: `Bukit Nanas / Ceylon`
- `name_local`: `Bukit Nanas / Bukit Ceylon`

Краткое описание: центральный hillside contour между KL Tower / Bukit Nanas и Jalan Ceylon, где городской skyline сочетается с iconic observation landmarks и известными ресторанами. Это удобная зона для city views и более refined dining рядом с core centre.

Подходит для:
- observation landmarks и city views;
- refined dining и evening stops;
- short central detours рядом с Bukit Bintang и KLCC.

Текущие Atlas places в этом районе:
- `kll-atmosphere-360`
- `kll-bijan-bar-restaurant`

---

## 1.5 `seputeh-brickfields`
- `slug`: `seputeh-brickfields`
- `name`: `Seputeh / Brickfields`
- `name_local`: `Seputeh / Brickfields`

Краткое описание: южный urban contour Куала-Лумпура вокруг Seputeh heights и Brickfields approach, связанный с крупными храмами, hilltop views и более локальным city experience за пределами туристического ядра.

Подходит для:
- храмов и культурных stopovers;
- hilltop viewpoints и city detours;
- более локального urban experience вне core centre.

Текущие Atlas places в этом районе:
- `kll-thean-hou-temple`

---

## 1.6 `batu-caves-excursion-zone`
- `slug`: `batu-caves-excursion-zone`
- `name`: `Batu Caves Excursion Zone`
- `name_local`: `Batu Caves`

Краткое описание: внешняя excursion-зона к северу от Куала-Лумпура в Gombak / Selangor, связанная с Batu Caves и главной Hindu pilgrimage landmark локацией региона. Это не городской район в строгом смысле, а важный half-day trip cluster из столицы.

Подходит для:
- храмовой и пещерной landmark-локации;
- half-day trips за пределы центра;
- религиозного и фотогеничного опыта рядом с KL.

Текущие Atlas places в этом районе:
- `kll-batu-caves`

---

# 2. Place Containers

## 2.1 `petronas-twin-towers`
- `slug`: `petronas-twin-towers`
- `name`: `Petronas Twin Towers`
- `type`: `landmark-complex`
- `city_slug`: `kul`
- `district_slug`: `klcc-city-centre`

Краткое описание: iconic landmark-complex KLCC с башнями, podium, Suria KLCC и окружающим city-centre experience.

Places inside:
- `kll-petronas-twin-towers`

---

## 2.2 `bukit-bintang`
- `slug`: `bukit-bintang`
- `name`: `Bukit Bintang`
- `type`: `urban-lifestyle-cluster`
- `city_slug`: `kul`
- `district_slug`: `bukit-bintang-jalan-alor`

Краткое описание: главный shopping, lifestyle и nightlife cluster центрального Куала-Лумпура.

Places inside:
- `kll-bukit-bintang`

---

## 2.3 `jalan-alor-food-street`
- `slug`: `jalan-alor-food-street`
- `name`: `Jalan Alor Food Street`
- `type`: `food-street-corridor`
- `city_slug`: `kul`
- `district_slug`: `bukit-bintang-jalan-alor`

Краткое описание: знаменитый food-street corridor с hawker-style dining и вечерней уличной атмосферой.

Places inside:
- `kll-jalan-alor-food-street`

---

## 2.4 `central-market`
- `slug`: `central-market`
- `name`: `Central Market`
- `type`: `heritage-market-cluster`
- `city_slug`: `kul`
- `district_slug`: `merdeka-pasar-seni`

Краткое описание: heritage market cluster Pasar Seni как самостоятельная cultural-shopping destination-zone.

Places inside:
- `kll-central-market`
