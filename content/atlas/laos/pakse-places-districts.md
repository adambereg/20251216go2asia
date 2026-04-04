# Pakse Places → Districts / Containers

Этот файл фиксирует связи для **9 мест Паксе, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `laos`
- `city_slug`: `pkz`

---

## 1. Bolaven Plateau
- `slug`: `pkz-bolaven-plateau`
- `name`: `Bolaven Plateau`

### Place → District
- `district_slug`: `bolaven-plateau-excursion-zone`
- `district_name`: `Bolaven Plateau Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это не городская точка Паксе, а самостоятельный highland travel cluster к востоку от города, известный кофейными плантациями и водопадами. Контейнер не нужен, потому что место уже является крупной destination-scale сущностью. The Bolaven Plateau lies east of Pakse and is commonly visited as a day trip from the city. citeturn696495search17turn696495search18

---

## 2. Champasak Town
- `slug`: `pkz-champasak-town`
- `name`: `Champasak Town`

### Place → District
- `district_slug`: `champasak-wat-phou-excursion-zone`
- `district_name`: `Champasak / Wat Phou Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Champasak Town живёт не в городском ядре Паксе, а в южном riverside heritage contour по дороге к Wat Phou. Контейнер не нужен. Маршрут Pakse → Champasak → Wat Phou обычно рассматривается как единый day-trip contour. citeturn696495search11turn696495search14

---

## 3. Daolin Restaurant & Café
- `slug`: `pkz-daolin-restaurant-cafe`
- `name`: `Daolin Restaurant & Café`

### Place → District
- `district_slug`: `mekong-xe-don-riverside-core`
- `district_name`: `Mekong / Xe Don Riverside Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: заведение относится к центральному Pakse urban core, где сосредоточены основные кафе, отели и city dining. Контейнер не нужен. TripAdvisor описывает его как ресторан в Pakse city dining contour. citeturn696495search10

---

## 4. Le Panorama Restaurant
- `slug`: `pkz-le-panorama-restaurant`
- `name`: `Le Panorama Restaurant`

### Place → District
- `district_slug`: `mekong-xe-don-riverside-core`
- `district_name`: `Mekong / Xe Don Riverside Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: rooftop-ресторан относится к центральному riverside skyline contour Паксе. Контейнер не нужен. Официальные и обзорные источники описывают его как rooftop venue с видом на Pakse и Mekong. citeturn696495search1turn696495search4

---

## 5. Mekong Riverside Pakse
- `slug`: `pkz-mekong-riverside-pakse`
- `name`: `Mekong Riverside Pakse`

### Place → District
- `district_slug`: `mekong-xe-don-riverside-core`
- `district_name`: `Mekong / Xe Don Riverside Core`

### Place → Container
- `container_slug`: `mekong-riverside-pakse`
- `container_name`: `Mekong Riverside Pakse`

Пояснение: это не одна точка, а самостоятельный riverfront cluster внутри городского ядра Паксе. Поэтому нужен container.

---

## 6. Sinouk Coffee Pakse
- `slug`: `pkz-sinouk-coffee-pakse`
- `name`: `Sinouk Coffee Pakse`

### Place → District
- `district_slug`: `mekong-xe-don-riverside-core`
- `district_name`: `Mekong / Xe Don Riverside Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: кафе относится к центральному городскому Pakse core и логично живёт рядом с main dining / coffee contour города. Контейнер не нужен. Официальная страница Café Sinouk - Pakse описывает его как городское кафе в Pakse. citeturn696495search13

---

## 7. Tad Fane Waterfall
- `slug`: `pkz-tad-fane-waterfall`
- `name`: `Tad Fane Waterfall`

### Place → District
- `district_slug`: `bolaven-plateau-excursion-zone`
- `district_name`: `Bolaven Plateau Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: водопад находится на Bolaven Plateau и логично относится к внешнему nature cluster, а не к самому городу Паксе. Контейнер не нужен. Tad Fane routinely appears as a core stop on Bolaven Plateau trips from Pakse. citeturn696495search3turn696495search8

---

## 8. Tad Yuang Waterfall
- `slug`: `pkz-tad-yuang-waterfall`
- `name`: `Tad Yuang Waterfall`

### Place → District
- `district_slug`: `bolaven-plateau-excursion-zone`
- `district_name`: `Bolaven Plateau Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Tad Yuang также относится к Bolaven Plateau waterfall loop, а не к городскому контуру Паксе. Контейнер не нужен. Источники о маршрутах по плато обычно объединяют Tad Yuang и Tad Fane в одном Pakse day-trip cluster. citeturn696495search3turn696495search17

---

## 9. Wat Phou
- `slug`: `pkz-wat-phou`
- `name`: `Wat Phou`

### Place → District
- `district_slug`: `champasak-wat-phou-excursion-zone`
- `district_name`: `Champasak / Wat Phou Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Wat Phou — внешний heritage site south of Pakse, обычно посещаемый через Champasak / Mekong day trip. Контейнер не нужен, потому что место уже является крупной самостоятельной historical destination. Several travel sources place Wat Phou roughly 40–45 km south/southwest of Pakse. citeturn696495search5turn696495search23

---

# Summary

## District links
- `pkz-bolaven-plateau` → `bolaven-plateau-excursion-zone`
- `pkz-champasak-town` → `champasak-wat-phou-excursion-zone`
- `pkz-daolin-restaurant-cafe` → `mekong-xe-don-riverside-core`
- `pkz-le-panorama-restaurant` → `mekong-xe-don-riverside-core`
- `pkz-mekong-riverside-pakse` → `mekong-xe-don-riverside-core`
- `pkz-sinouk-coffee-pakse` → `mekong-xe-don-riverside-core`
- `pkz-tad-fane-waterfall` → `bolaven-plateau-excursion-zone`
- `pkz-tad-yuang-waterfall` → `bolaven-plateau-excursion-zone`
- `pkz-wat-phou` → `champasak-wat-phou-excursion-zone`

## Container links
- `pkz-mekong-riverside-pakse` → `mekong-riverside-pakse`

## Places without container
- `pkz-bolaven-plateau`
- `pkz-champasak-town`
- `pkz-daolin-restaurant-cafe`
- `pkz-le-panorama-restaurant`
- `pkz-sinouk-coffee-pakse`
- `pkz-tad-fane-waterfall`
- `pkz-tad-yuang-waterfall`
- `pkz-wat-phou`
