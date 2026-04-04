# Dumaguete Districts and Containers

Этот файл фиксирует новые сущности для Dumaguete pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `philippines`
- `city_slug`: `dumaguete`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Думагете.

---

# 1. City Districts

## 1.1 `rizal-boulevard-seafront`
- `slug`: `rizal-boulevard-seafront`
- `name`: `Rizal Boulevard Seafront`
- `name_local`: `Rizal Boulevard`
- `city_slug`: `dumaguete`
- `country_slug`: `philippines`

Краткое описание: главная seaside-полоса Думагете вдоль Rizal Boulevard и северного coastal road, где сосредоточены promenade, waterfront dining и классический городской вид на море. Это самый узнаваемый городской contour для прогулок, casual seafood и first-touch Dumaguete experience.

Подходит для:
- прогулок вдоль моря и sunset atmosphere;
- seafood и casual dining у воды;
- первого знакомства с городом как с seaside university town.

Текущие Atlas places в этом районе:
- `dumaguete-lab-as-seafood-restaurant`
- `dumaguete-rizal-boulevard`
- `dumaguete-sans-rival-cakes-pastries`

---

## 1.2 `silliman-university-campus`
- `slug`: `silliman-university-campus`
- `name`: `Silliman University Campus`
- `name_local`: `Silliman University`
- `city_slug`: `dumaguete`
- `country_slug`: `philippines`

Краткое описание: зелёный academic и heritage-contour вокруг исторического кампуса Silliman University на Hibbard Avenue. Это важная часть identity Думагете: acacia-lined campus, университетская атмосфера и спокойный walkable urban layer рядом с морем.

Подходит для:
- campus walks и old-academia atmosphere;
- спокойного urban sightseeing;
- знакомства с культурным и образовательным слоем Думагете.

Текущие Atlas places в этом районе:
- `dumaguete-silliman-university`

---

## 1.3 `valencia-casaroro-excursion-zone`
- `slug`: `valencia-casaroro-excursion-zone`
- `name`: `Valencia / Casaroro Excursion Zone`
- `name_local`: `Valencia`
- `city_slug`: `dumaguete`
- `country_slug`: `philippines`

Краткое описание: внешняя inland excursion-зона к западу от Думагете, связанная с холмами Valencia и водопадом Casaroro Falls. Это не городской район, а короткий nature day-trip cluster для тех, кто выезжает из coastal core в upland landscape.

Подходит для:
- waterfalls и short nature trips;
- более прохладного upland experience;
- half-day выездов из Думагете за пределы города.

Текущие Atlas places в этом районе:
- `dumaguete-casaroro-falls`

---

## 1.4 `apo-island-excursion-zone`
- `slug`: `apo-island-excursion-zone`
- `name`: `Apo Island Excursion Zone`
- `name_local`: `Apo Island`
- `city_slug`: `dumaguete`
- `country_slug`: `philippines`

Краткое описание: внешняя marine excursion-zone к югу от Думагете, связанная с Apo Island, reef snorkeling и diving trips через Dauin / Negros Oriental coast. Это не городской район Думагете, а самостоятельный island day-trip cluster.

Подходит для:
- snorkeling и diving excursions;
- island day trips из Dumaguete / Dauin;
- marine life и reef experience.

Текущие Atlas places в этом районе:
- `dumaguete-apo-island`

---

# 2. Place Containers

## 2.1 `rizal-boulevard`
- `slug`: `rizal-boulevard`
- `name`: `Rizal Boulevard`
- `type`: `urban-seafront-promenade`
- `city_slug`: `dumaguete`
- `district_slug`: `rizal-boulevard-seafront`

Краткое описание: главный seafront-promenade cluster Думагете, который воспринимается не как одна точка, а как длинная waterfront destination-zone с прогулками, кафе и видом на море.

Places inside:
- `dumaguete-rizal-boulevard`
