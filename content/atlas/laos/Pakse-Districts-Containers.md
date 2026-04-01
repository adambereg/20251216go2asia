# Pakse Districts and Containers

Этот файл фиксирует новые сущности для Pakse pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `laos`
- `city_slug`: `pkz`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Паксе.

---

# 1. City Districts

## 1.1 `mekong-xe-don-riverside-core`
- `slug`: `mekong-xe-don-riverside-core`
- `name`: `Mekong / Xe Don Riverside Core`
- `name_local`: `ປາກເຊ`
- `city_slug`: `pkz`
- `country_slug`: `laos`

Краткое описание: центральное городское ядро Паксе вокруг набережных Mekong и Xe Don, отелей, rooftop-ресторанов, кофеен и главных прогулочных маршрутов. Это главный городской контур для первого знакомства с Pakse как с river city и базой для поездок по южному Лаосу.

Подходит для:
- прогулок по riverside и городскому центру;
- rooftop dining, кофеен и casual restaurants;
- базирования перед поездками на Bolaven Plateau и в Champasak.

Текущие Atlas places в этом районе:
- `pkz-daolin-restaurant-cafe`
- `pkz-le-panorama-restaurant`
- `pkz-mekong-riverside-pakse`
- `pkz-sinouk-coffee-pakse`

---

## 1.2 `bolaven-plateau-excursion-zone`
- `slug`: `bolaven-plateau-excursion-zone`
- `name`: `Bolaven Plateau Excursion Zone`
- `name_local`: `ໂບລະເວນ`
- `city_slug`: `pkz`
- `country_slug`: `laos`

Краткое описание: внешняя highland excursion-zone к востоку от Паксе, связанная с кофейными плантациями, прохладным климатом и самыми известными водопадами южного Лаоса. Это не городской район Паксе, а главный природный day-trip cluster для путешествий на плато Болавен.

Подходит для:
- водопадов и природных поездок;
- coffee plantation experience;
- scenic highland day trips из Паксе.

Текущие Atlas places в этом районе:
- `pkz-bolaven-plateau`
- `pkz-tad-fane-waterfall`
- `pkz-tad-yuang-waterfall`

---

## 1.3 `champasak-wat-phou-excursion-zone`
- `slug`: `champasak-wat-phou-excursion-zone`
- `name`: `Champasak / Wat Phou Excursion Zone`
- `name_local`: `ຈຳປາສັກ`
- `city_slug`: `pkz`
- `country_slug`: `laos`

Краткое описание: внешняя excursion-zone к югу от Паксе вдоль Mekong, связанная с Champasak Town и храмовым комплексом Wat Phou. Это не часть городского ядра Паксе, а самостоятельный heritage and riverside day-trip cluster южного Лаоса.

Подходит для:
- heritage day trips и храмового комплекса Wat Phou;
- river-road поездок из Паксе;
- более медленного исторического и провинциального южного Лаоса.

Текущие Atlas places в этом районе:
- `pkz-champasak-town`
- `pkz-wat-phou`

---

# 2. Place Containers

## 2.1 `mekong-riverside-pakse`
- `slug`: `mekong-riverside-pakse`
- `name`: `Mekong Riverside Pakse`
- `type`: `urban-riverfront-cluster`
- `city_slug`: `pkz`
- `district_slug`: `mekong-xe-don-riverside-core`

Краткое описание: главный riverfront-кластер Паксе вдоль Mekong с набережной, ресторанами, rooftop views и вечерней городской жизнью.

Places inside:
- `pkz-mekong-riverside-pakse`
