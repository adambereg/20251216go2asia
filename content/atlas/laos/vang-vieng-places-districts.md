# Vang Vieng Places → Districts / Containers

Этот файл фиксирует связи для **13 мест Ванг Вьенга, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `laos`
- `city_slug`: `vvg`

---

## 1. Blue Lagoon 1
- `slug`: `vvg-blue-lagoon-1`
- `name`: `Blue Lagoon 1`

### Place → District
- `district_slug`: `blue-lagoon-phu-kham-excursion-zone`
- `district_name`: `Blue Lagoon / Phu Kham Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: лагуна находится в western countryside near Ban Na Thong вместе с Tham Phu Kham Cave. Это часть одного day-trip excursion cluster, а не town-core локация. Supported by multiple travel references locating Blue Lagoon 1 around 7 km west of Vang Vieng near Ban Na Thong.

---

## 2. Café de Vang Vieng
- `slug`: `vvg-cafe-de-vang-vieng`
- `name`: `Café de Vang Vieng`

### Place → District
- `district_slug`: `central-town-riverside`
- `district_name`: `Central Town / Riverside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это понятная town-core café/dining точка внутри центрального туристического контура Ванг Вьенга. Контейнер не нужен.

---

## 3. Gary’s Irish Bar
- `slug`: `vvg-gary-s-irish-bar`
- `name`: `Gary’s Irish Bar`

### Place → District
- `district_slug`: `central-town-riverside`
- `district_name`: `Central Town / Riverside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: бар относится к вечернему urban core Ванг Вьенга в пределах walkable town center. Контейнер не нужен.

---

## 4. Kangaroo Sunset Bar
- `slug`: `vvg-kangaroo-sunset-bar`
- `name`: `Kangaroo Sunset Bar`

### Place → District
- `district_slug`: `west-bank-river-bars`
- `district_name`: `West Bank River Bars`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место прямо связано с riverside sunset/bar contour на западном берегу Nam Song. Контейнер не нужен.

---

## 5. Nam Song River Tubing
- `slug`: `vvg-nam-song-river-tubing`
- `name`: `Nam Song River Tubing`

### Place → District
- `district_slug`: `west-bank-river-bars`
- `district_name`: `West Bank River Bars`

### Place → Container
- `container_slug`: `nam-song-river-tubing-route`
- `container_name`: `Nam Song River Tubing Route`

Пояснение: это activity-route, а не единичная точка. Поэтому place логично живёт в riverside adventure cluster и одновременно оформлен как container-scale route.

---

## 6. Organic Mulberry Farm & Café
- `slug`: `vvg-organic-mulberry-farm-cafe`
- `name`: `Organic Mulberry Farm & Café`

### Place → District
- `district_slug`: `pha-ngern-organic-farm-countryside`
- `district_name`: `Pha Ngern / Organic Farm Countryside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: farm/café находится за пределами плотного town core в countryside-контуре у Nam Song и подходов к западным viewpoint roads. Контейнер не нужен.

---

## 7. Peeping Som’s Bar & Restaurant
- `slug`: `vvg-peeping-som-s-bar-restaurant`
- `name`: `Peeping Som’s Bar & Restaurant`

### Place → District
- `district_slug`: `west-bank-river-bars`
- `district_name`: `West Bank River Bars`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место относится к river-bar / tubing-side контурy западного берега Nam Song. Контейнер не нужен.

---

## 8. Pha Ngern Viewpoint
- `slug`: `vvg-pha-ngern-viewpoint`
- `name`: `Pha Ngern Viewpoint`

### Place → District
- `district_slug`: `pha-ngern-organic-farm-countryside`
- `district_name`: `Pha Ngern / Organic Farm Countryside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: viewpoint находится к западу от town center, через Nam Song, в countryside/hiking contour along the road toward the lagoons and western karst fields. Контейнер не нужен.

---

## 9. Sakura Bar
- `slug`: `vvg-sakura-bar`
- `name`: `Sakura Bar`

### Place → District
- `district_slug`: `central-town-riverside`
- `district_name`: `Central Town / Riverside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: классическая nightlife-точка внутри центрального town-core Ванг Вьенга. Контейнер не нужен.

---

## 10. Smile Beach Bar
- `slug`: `vvg-smile-beach-bar`
- `name`: `Smile Beach Bar`

### Place → District
- `district_slug`: `west-bank-river-bars`
- `district_name`: `West Bank River Bars`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это часть river-bar / sunset cluster на берегу Nam Song, а не central street-core place. Контейнер не нужен.

---

## 11. Sunset Point Nam Song
- `slug`: `vvg-sunset-point-nam-song`
- `name`: `Sunset Point Nam Song`

### Place → District
- `district_slug`: `west-bank-river-bars`
- `district_name`: `West Bank River Bars`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: sunset viewpoint относится к тому же riverside west-bank leisure contour, что и bars/tubing atmosphere. Контейнер не нужен.

---

## 12. Tham Chang Cave
- `slug`: `vvg-tham-chang-cave`
- `name`: `Tham Chang Cave`

### Place → District
- `district_slug`: `tham-chang-southwest`
- `district_name`: `Tham Chang Southwest`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Tham Chang Cave sits just southwest of town across the Nam Song River and works as a short standalone cave stop close to the urban core. Контейнер не нужен.

---

## 13. Tham Phu Kham Cave
- `slug`: `vvg-tham-phu-kham-cave`
- `name`: `Tham Phu Kham Cave`

### Place → District
- `district_slug`: `blue-lagoon-phu-kham-excursion-zone`
- `district_name`: `Blue Lagoon / Phu Kham Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: cave lives in the same western excursion cluster as Blue Lagoon 1 near Ban Na Thong. Контейнер не нужен.

---

# Summary

## District links
- `vvg-blue-lagoon-1` → `blue-lagoon-phu-kham-excursion-zone`
- `vvg-cafe-de-vang-vieng` → `central-town-riverside`
- `vvg-gary-s-irish-bar` → `central-town-riverside`
- `vvg-kangaroo-sunset-bar` → `west-bank-river-bars`
- `vvg-nam-song-river-tubing` → `west-bank-river-bars`
- `vvg-organic-mulberry-farm-cafe` → `pha-ngern-organic-farm-countryside`
- `vvg-peeping-som-s-bar-restaurant` → `west-bank-river-bars`
- `vvg-pha-ngern-viewpoint` → `pha-ngern-organic-farm-countryside`
- `vvg-sakura-bar` → `central-town-riverside`
- `vvg-smile-beach-bar` → `west-bank-river-bars`
- `vvg-sunset-point-nam-song` → `west-bank-river-bars`
- `vvg-tham-chang-cave` → `tham-chang-southwest`
- `vvg-tham-phu-kham-cave` → `blue-lagoon-phu-kham-excursion-zone`

## Container links
- `vvg-nam-song-river-tubing` → `nam-song-river-tubing-route`

## Places without container
- `vvg-blue-lagoon-1`
- `vvg-cafe-de-vang-vieng`
- `vvg-gary-s-irish-bar`
- `vvg-kangaroo-sunset-bar`
- `vvg-organic-mulberry-farm-cafe`
- `vvg-peeping-som-s-bar-restaurant`
- `vvg-pha-ngern-viewpoint`
- `vvg-sakura-bar`
- `vvg-smile-beach-bar`
- `vvg-sunset-point-nam-song`
- `vvg-tham-chang-cave`
- `vvg-tham-phu-kham-cave`
