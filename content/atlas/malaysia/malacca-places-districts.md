# Malacca Places → Districts / Containers

Этот файл фиксирует связи для **13 мест Малакки, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `malaysia`
- `city_slug`: `mlk`

---

## 1. A Famosa Fortress
- `slug`: `mkz-a-famosa-fortress`
- `name`: `A Famosa Fortress`

### Place → District
- `district_slug`: `dutch-square-st-pauls-hill`
- `district_name`: `Dutch Square / St. Paul's Hill`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: A Famosa стоит в непосредственной связке с St. Paul’s Hill и Dutch Square heritage core. Контейнер не нужен: это самостоятельный landmark.

---

## 2. Capitol Satay
- `slug`: `mkz-capitol-satay`
- `name`: `Capitol Satay`

### Place → District
- `district_slug`: `bendahara-merdeka-river-edge`
- `district_name`: `Bendahara / Merdeka River Edge`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место на Jalan Bendahara логично относится к более утилитарному городскому контуру за пределами Jonker core. Контейнер не нужен.

---

## 3. Cheng Ho Cultural Museum
- `slug`: `mkz-cheng-ho-cultural-museum`
- `name`: `Cheng Ho Cultural Museum`

### Place → District
- `district_slug`: `jonker-heeren-kampung-pantai`
- `district_name`: `Jonker / Heeren / Kampung Pantai`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: музей на Lorong Hang Jebat относится к Jonker/Heeren heritage zone. Контейнер не нужен.

---

## 4. Christ Church Melaka
- `slug`: `mkz-christ-church-melaka`
- `name`: `Christ Church Melaka`

### Place → District
- `district_slug`: `dutch-square-st-pauls-hill`
- `district_name`: `Dutch Square / St. Paul's Hill`

### Place → Container
- `container_slug`: `dutch-square-melaka`
- `container_name`: `Dutch Square Melaka`

Пояснение: Christ Church — ключевая часть Dutch Square civic cluster, поэтому нужен container.

---

## 5. Geographer Cafe
- `slug`: `mkz-geographer-cafe`
- `name`: `Geographer Cafe`

### Place → District
- `district_slug`: `jonker-heeren-kampung-pantai`
- `district_name`: `Jonker / Heeren / Kampung Pantai`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: кафе на Jalan Kampung Pantai находится в плотном heritage/dining contour Jonker side. Контейнер не нужен.

---

## 6. Jonker Street
- `slug`: `mkz-jonker-street`
- `name`: `Jonker Street`

### Place → District
- `district_slug`: `jonker-heeren-kampung-pantai`
- `district_name`: `Jonker / Heeren / Kampung Pantai`

### Place → Container
- `container_slug`: `jonker-street`
- `container_name`: `Jonker Street`

Пояснение: это не одна точка, а самостоятельный historic street cluster. Поэтому нужен container.

---

## 7. Jonker Walk Night Market
- `slug`: `mkz-jonker-walk-night-market`
- `name`: `Jonker Walk Night Market`

### Place → District
- `district_slug`: `jonker-heeren-kampung-pantai`
- `district_name`: `Jonker / Heeren / Kampung Pantai`

### Place → Container
- `container_slug`: `jonker-street`
- `container_name`: `Jonker Street`

Пояснение: night market живёт внутри Jonker street-corridor. Уместно привязать его к тому же container.

---

## 8. Kampung Kling Mosque
- `slug`: `mkz-kampung-kling-mosque`
- `name`: `Kampung Kling Mosque`

### Place → District
- `district_slug`: `harmony-street-old-quarter`
- `district_name`: `Harmony Street / Old Quarter`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: mosque на Jalan Tukang Emas логично относится к Harmony Street religious heritage contour. Контейнер не нужен.

---

## 9. Nancy’s Kitchen
- `slug`: `mkz-nancy-s-kitchen`
- `name`: `Nancy’s Kitchen`

### Place → District
- `district_slug`: `jonker-heeren-kampung-pantai`
- `district_name`: `Jonker / Heeren / Kampung Pantai`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место на Jalan Tun Tan Cheng Lock относится к Peranakan dining layer старого центра. Контейнер не нужен.

---

## 10. Red Square
- `slug`: `mkz-red-square`
- `name`: `Red Square`

### Place → District
- `district_slug`: `dutch-square-st-pauls-hill`
- `district_name`: `Dutch Square / St. Paul's Hill`

### Place → Container
- `container_slug`: `dutch-square-melaka`
- `container_name`: `Dutch Square Melaka`

Пояснение: Red Square — сам civic core Dutch Square cluster, поэтому container обязателен.

---

## 11. Riverine Coffee
- `slug`: `mkz-riverine-coffee`
- `name`: `Riverine Coffee`

### Place → District
- `district_slug`: `bendahara-merdeka-river-edge`
- `district_name`: `Bendahara / Merdeka River Edge`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место на Jalan Merdeka уходит в более современный river-edge contour южнее heritage core. Контейнер не нужен.

---

## 12. St. Paul’s Hill & Church Ruins
- `slug`: `mkz-st-paul-s-hill-church-ruins`
- `name`: `St. Paul’s Hill & Church Ruins`

### Place → District
- `district_slug`: `dutch-square-st-pauls-hill`
- `district_name`: `Dutch Square / St. Paul's Hill`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: St. Paul’s Hill — ключевой hilltop landmark внутри главного historic core, но на текущем этапе отдельный container не обязателен.

---

## 13. The Daily Fix Cafe
- `slug`: `mkz-the-daily-fix-cafe`
- `name`: `The Daily Fix Cafe`

### Place → District
- `district_slug`: `jonker-heeren-kampung-pantai`
- `district_name`: `Jonker / Heeren / Kampung Pantai`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: кафе на Jalan Hang Lekir относится к Jonker heritage/cafe contour. Контейнер не нужен.

---

# Summary

## District links
- `mkz-a-famosa-fortress` → `dutch-square-st-pauls-hill`
- `mkz-capitol-satay` → `bendahara-merdeka-river-edge`
- `mkz-cheng-ho-cultural-museum` → `jonker-heeren-kampung-pantai`
- `mkz-christ-church-melaka` → `dutch-square-st-pauls-hill`
- `mkz-geographer-cafe` → `jonker-heeren-kampung-pantai`
- `mkz-jonker-street` → `jonker-heeren-kampung-pantai`
- `mkz-jonker-walk-night-market` → `jonker-heeren-kampung-pantai`
- `mkz-kampung-kling-mosque` → `harmony-street-old-quarter`
- `mkz-nancy-s-kitchen` → `jonker-heeren-kampung-pantai`
- `mkz-red-square` → `dutch-square-st-pauls-hill`
- `mkz-riverine-coffee` → `bendahara-merdeka-river-edge`
- `mkz-st-paul-s-hill-church-ruins` → `dutch-square-st-pauls-hill`
- `mkz-the-daily-fix-cafe` → `jonker-heeren-kampung-pantai`

## Container links
- `mkz-christ-church-melaka` → `dutch-square-melaka`
- `mkz-jonker-street` → `jonker-street`
- `mkz-jonker-walk-night-market` → `jonker-street`
- `mkz-red-square` → `dutch-square-melaka`

## Places without container
- `mkz-a-famosa-fortress`
- `mkz-capitol-satay`
- `mkz-cheng-ho-cultural-museum`
- `mkz-geographer-cafe`
- `mkz-kampung-kling-mosque`
- `mkz-nancy-s-kitchen`
- `mkz-riverine-coffee`
- `mkz-st-paul-s-hill-church-ruins`
- `mkz-the-daily-fix-cafe`
