# Kuala Lumpur Places → Districts / Containers

Этот файл фиксирует связи для **12 мест Куала-Лумпура, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `malaysia`
- `city_slug`: `kul`

---

## 1. Atmosphere 360
- `slug`: `kll-atmosphere-360`
- `name`: `Atmosphere 360`

### Place → District
- `district_slug`: `bukit-nanas-ceylon`
- `district_name`: `Bukit Nanas / Ceylon`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится в KL Tower на Bukit Nanas hill и логично относится к observation / central skyline contour, а не к KLCC или Pasar Seni.

---

## 2. Batu Caves
- `slug`: `kll-batu-caves`
- `name`: `Batu Caves`

### Place → District
- `district_slug`: `batu-caves-excursion-zone`
- `district_name`: `Batu Caves Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это внешняя landmark и pilgrimage destination в Gombak, Selangor north of Kuala Lumpur. Контейнер не нужен.

---

## 3. Bijan Bar & Restaurant
- `slug`: `kll-bijan-bar-restaurant`
- `name`: `Bijan Bar & Restaurant`

### Place → District
- `district_slug`: `bukit-nanas-ceylon`
- `district_name`: `Bukit Nanas / Ceylon`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Bijan находится на Jalan Ceylon / Bukit Ceylon и operationally живёт в том же refined central contour, что и KL Tower / Bukit Nanas hillside.

---

## 4. Bukit Bintang
- `slug`: `kll-bukit-bintang`
- `name`: `Bukit Bintang`

### Place → District
- `district_slug`: `bukit-bintang-jalan-alor`
- `district_name`: `Bukit Bintang / Jalan Alor`

### Place → Container
- `container_slug`: `bukit-bintang`
- `container_name`: `Bukit Bintang`

Пояснение: это не одна точка, а самостоятельный urban lifestyle cluster, поэтому нужен container.

---

## 5. Central Market
- `slug`: `kll-central-market`
- `name`: `Central Market`

### Place → District
- `district_slug`: `merdeka-pasar-seni`
- `district_name`: `Merdeka / Pasar Seni`

### Place → Container
- `container_slug`: `central-market`
- `container_name`: `Central Market`

Пояснение: Central Market / Pasar Seni — это самостоятельный heritage market cluster, а не просто одиночная точка.

---

## 6. Heli Lounge Bar
- `slug`: `kll-heli-lounge-bar`
- `name`: `Heli Lounge Bar`

### Place → District
- `district_slug`: `bukit-bintang-jalan-alor`
- `district_name`: `Bukit Bintang / Jalan Alor`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: rooftop-бар находится на Jalan Sultan Ismail у Bukit Bintang / Raja Chulan edge и логично живёт в nightlife contour Bukit Bintang.

---

## 7. Jalan Alor Food Street
- `slug`: `kll-jalan-alor-food-street`
- `name`: `Jalan Alor Food Street`

### Place → District
- `district_slug`: `bukit-bintang-jalan-alor`
- `district_name`: `Bukit Bintang / Jalan Alor`

### Place → Container
- `container_slug`: `jalan-alor-food-street`
- `container_name`: `Jalan Alor Food Street`

Пояснение: это food-street corridor, а не одна точка, поэтому нужен container.

---

## 8. KLCC Park
- `slug`: `kll-klcc-park`
- `name`: `KLCC Park`

### Place → District
- `district_slug`: `klcc-city-centre`
- `district_name`: `KLCC / City Centre`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: парк относится к KLCC core и не требует отдельного container на текущем этапе.

---

## 9. Madam Kwan’s
- `slug`: `kll-madam-kwan-s`
- `name`: `Madam Kwan’s`

### Place → District
- `district_slug`: `klcc-city-centre`
- `district_name`: `KLCC / City Centre`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: текущая Atlas-локация Madam Kwan’s сидит в Suria KLCC и логично относится к KLCC city-centre contour.

---

## 10. Merdeka Square
- `slug`: `kll-merdeka-square`
- `name`: `Merdeka Square`

### Place → District
- `district_slug`: `merdeka-pasar-seni`
- `district_name`: `Merdeka / Pasar Seni`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ключевая civic square старого центра KL. На текущем этапе отдельный container не нужен.

---

## 11. Petronas Twin Towers
- `slug`: `kll-petronas-twin-towers`
- `name`: `Petronas Twin Towers`

### Place → District
- `district_slug`: `klcc-city-centre`
- `district_name`: `KLCC / City Centre`

### Place → Container
- `container_slug`: `petronas-twin-towers`
- `container_name`: `Petronas Twin Towers`

Пояснение: это landmark-complex, а не одна точка. Поэтому container нужен.

---

## 12. Thean Hou Temple
- `slug`: `kll-thean-hou-temple`
- `name`: `Thean Hou Temple`

### Place → District
- `district_slug`: `seputeh-brickfields`
- `district_name`: `Seputeh / Brickfields`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храм стоит на hilltop в Seputeh / Robson Heights south of the core centre. Контейнер не нужен.

---

# Summary

## District links
- `kll-atmosphere-360` → `bukit-nanas-ceylon`
- `kll-batu-caves` → `batu-caves-excursion-zone`
- `kll-bijan-bar-restaurant` → `bukit-nanas-ceylon`
- `kll-bukit-bintang` → `bukit-bintang-jalan-alor`
- `kll-central-market` → `merdeka-pasar-seni`
- `kll-heli-lounge-bar` → `bukit-bintang-jalan-alor`
- `kll-jalan-alor-food-street` → `bukit-bintang-jalan-alor`
- `kll-klcc-park` → `klcc-city-centre`
- `kll-madam-kwan-s` → `klcc-city-centre`
- `kll-merdeka-square` → `merdeka-pasar-seni`
- `kll-petronas-twin-towers` → `klcc-city-centre`
- `kll-thean-hou-temple` → `seputeh-brickfields`

## Container links
- `kll-bukit-bintang` → `bukit-bintang`
- `kll-central-market` → `central-market`
- `kll-jalan-alor-food-street` → `jalan-alor-food-street`
- `kll-petronas-twin-towers` → `petronas-twin-towers`

## Places without container
- `kll-atmosphere-360`
- `kll-batu-caves`
- `kll-bijan-bar-restaurant`
- `kll-heli-lounge-bar`
- `kll-klcc-park`
- `kll-madam-kwan-s`
- `kll-merdeka-square`
- `kll-thean-hou-temple`
