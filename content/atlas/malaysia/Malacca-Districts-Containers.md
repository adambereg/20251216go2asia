# Malacca Districts and Containers

Этот файл фиксирует новые сущности для Malacca pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `malaysia`
- `city_slug`: `mlk`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Малакки.

---

# 1. City Districts

## 1.1 `dutch-square-st-pauls-hill`
- `slug`: `dutch-square-st-pauls-hill`
- `name`: `Dutch Square / St. Paul's Hill`
- `name_local`: `Dataran Belanda / Bukit St. Paul`
- `city_slug`: `mlk`
- `country_slug`: `malaysia`

Краткое описание: историческое ядро Малакки вокруг Dutch Square, Christ Church, Stadthuys, A Famosa и St. Paul’s Hill. Это главный heritage-контур города и самый узнаваемый слой UNESCO Melaka.

Подходит для:
- первого знакомства с исторической Малаккой;
- колониального наследия, музеев и landmark-объектов;
- прогулок между Dutch Square, A Famosa и St. Paul’s Hill.

Текущие Atlas places в этом районе:
- `mkz-a-famosa-fortress`
- `mkz-christ-church-melaka`
- `mkz-red-square`
- `mkz-st-paul-s-hill-church-ruins`

---

## 1.2 `jonker-heeren-kampung-pantai`
- `slug`: `jonker-heeren-kampung-pantai`
- `name`: `Jonker / Heeren / Kampung Pantai`
- `name_local`: `Jalan Hang Jebat / Heeren Street`
- `city_slug`: `mlk`
- `country_slug`: `malaysia`

Краткое описание: плотный old-town contour вокруг Jonker Street, Heeren Street и Kampung Pantai с shophouses, cafés, Peranakan dining, музеями и вечерней туристической жизнью. Это самый насыщенный пеший городской кластер Малакки за пределами civic square.

Подходит для:
- Jonker Street и weekend night market;
- cafés, restaurants и shophouse heritage;
- более живой и гастрономической стороны исторического центра.

Текущие Atlas places в этом районе:
- `mkz-cheng-ho-cultural-museum`
- `mkz-geographer-cafe`
- `mkz-jonker-street`
- `mkz-jonker-walk-night-market`
- `mkz-nancy-s-kitchen`
- `mkz-the-daily-fix-cafe`

---

## 1.3 `harmony-street-old-quarter`
- `slug`: `harmony-street-old-quarter`
- `name`: `Harmony Street / Old Quarter`
- `name_local`: `Jalan Tukang Emas`
- `city_slug`: `mlk`
- `country_slug`: `malaysia`

Краткое описание: компактный multi-faith heritage-контур старого квартала вдоль Jalan Tukang Emas, известной как Harmony Street. Здесь рядом сосуществуют mosque, temple и chinese heritage layer исторической Малакки.

Подходит для:
- межрелигиозного и культурного наследия;
- неспешных прогулок по старому кварталу;
- изучения менее туристического, но важного исторического слоя Melaka.

Текущие Atlas places в этом районе:
- `mkz-kampung-kling-mosque`

---

## 1.4 `bendahara-merdeka-river-edge`
- `slug`: `bendahara-merdeka-river-edge`
- `name`: `Bendahara / Merdeka River Edge`
- `name_local`: `Jalan Bendahara / Jalan Merdeka`
- `city_slug`: `mlk`
- `country_slug`: `malaysia`

Краткое описание: переходный городской contour к югу и юго-востоку от heritage core, где old town встречается с более современными городскими улицами, roadside dining и river-edge movement corridor. Это не postcard-ядро Малакки, а operational urban band вокруг Bendahara и Merdeka.

Подходит для:
- локальной еды и менее туристических stopovers;
- городских маршрутов за пределами Jonker core;
- более повседневного urban Melaka.

Текущие Atlas places в этом районе:
- `mkz-capitol-satay`
- `mkz-riverine-coffee`

---

# 2. Place Containers

## 2.1 `dutch-square-melaka`
- `slug`: `dutch-square-melaka`
- `name`: `Dutch Square Melaka`
- `type`: `historic-civic-cluster`
- `city_slug`: `mlk`
- `district_slug`: `dutch-square-st-pauls-hill`

Краткое описание: главный исторический civic-кластер Малакки вокруг красных колониальных зданий, Christ Church, Stadthuys и площади Dutch Square.

Places inside:
- `mkz-red-square`
- `mkz-christ-church-melaka`

---

## 2.2 `jonker-street`
- `slug`: `jonker-street`
- `name`: `Jonker Street`
- `type`: `heritage-street-cluster`
- `city_slug`: `mlk`
- `district_slug`: `jonker-heeren-kampung-pantai`

Краткое описание: исторический street-corridor с shophouses, cafés, museums, Peranakan food и weekend market life в самом сердце старой Малакки.

Places inside:
- `mkz-jonker-street`
- `mkz-jonker-walk-night-market`
