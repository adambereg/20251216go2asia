# Savannakhet Places → Districts / Containers

Этот файл фиксирует связи для **11 мест Саваннакхета, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `laos`
- `city_slug`: `svn`

---

## 1. Cafe Inn
- `slug`: `svk-cafe-inn`
- `name`: `Cafe Inn`

### Place → District
- `district_slug`: `historic-old-town-riverside`
- `district_name`: `Historic Old Town / Riverside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: кафе находится в old-town контуре Саваннакхета и логично относится к историческому riverfront-ядру. Контейнер не нужен.

---

## 2. Daosavanh Restaurant
- `slug`: `svk-daosavanh-restaurant`
- `name`: `Daosavanh Restaurant`

### Place → District
- `district_slug`: `civic-center-dinosaur-quarter`
- `district_name`: `Civic Center / Dinosaur Quarter`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан в текущем Atlas set логичнее держать в центральном городском контуре вне tourist-riverfront postcard zone. Контейнер не нужен.

---

## 3. Dinosaur Museum
- `slug`: `svk-dinosaur-museum`
- `name`: `Dinosaur Museum`

### Place → District
- `district_slug`: `civic-center-dinosaur-quarter`
- `district_name`: `Civic Center / Dinosaur Quarter`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: музей расположен в городском центре у реки, но по operational логике живёт в civic/museum quarter, а не в чисто прогулочном old town кластере. Контейнер не нужен.

---

## 4. Lin’s Café
- `slug`: `svk-lin-s-cafe`
- `name`: `Lin’s Café`

### Place → District
- `district_slug`: `historic-old-town-riverside`
- `district_name`: `Historic Old Town / Riverside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Lin’s Café устойчиво связано с old town / night market contour у набережной. Контейнер не нужен.

---

## 5. Mekong Riverside Food Stalls
- `slug`: `svk-mekong-riverside-food-stalls`
- `name`: `Mekong Riverside Food Stalls`

### Place → District
- `district_slug`: `historic-old-town-riverside`
- `district_name`: `Historic Old Town / Riverside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: точки уличной еды живут на riverside promenade и относятся к вечернему riverfront-контурy. Отдельный container не нужен, потому что это supporting place layer внутри promenade zone.

---

## 6. Mekong Riverside Promenade
- `slug`: `svk-mekong-riverside-promenade`
- `name`: `Mekong Riverside Promenade`

### Place → District
- `district_slug`: `historic-old-town-riverside`
- `district_name`: `Historic Old Town / Riverside`

### Place → Container
- `container_slug`: `mekong-riverside-promenade`
- `container_name`: `Mekong Riverside Promenade`

Пояснение: это не одна точка, а самостоятельный riverfront-cluster. Поэтому нужен container.

---

## 7. Savannakhet City Museum
- `slug`: `svk-savannakhet-city-museum`
- `name`: `Savannakhet City Museum`

### Place → District
- `district_slug`: `historic-old-town-riverside`
- `district_name`: `Historic Old Town / Riverside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: музей находится в историческом ядре и логично относится к old-town heritage contour. Контейнер не нужен.

---

## 8. Savannakhet Old Town
- `slug`: `svk-savannakhet-old-town`
- `name`: `Savannakhet Old Town`

### Place → District
- `district_slug`: `historic-old-town-riverside`
- `district_name`: `Historic Old Town / Riverside`

### Place → Container
- `container_slug`: `savannakhet-old-town`
- `container_name`: `Savannakhet Old Town`

Пояснение: это целый исторический городской кластер, а не одна точка. Поэтому нужен container.

---

## 9. Sinouk Coffee Savannakhet
- `slug`: `svk-sinouk-coffee-savannakhet`
- `name`: `Sinouk Coffee Savannakhet`

### Place → District
- `district_slug`: `historic-old-town-riverside`
- `district_name`: `Historic Old Town / Riverside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: кофейня органично живёт в старом центре и tourist-friendly urban core. Контейнер не нужен.

---

## 10. St. Teresa’s Catholic Church
- `slug`: `svk-st-teresa-s-catholic-church`
- `name`: `St. Teresa’s Catholic Church`

### Place → District
- `district_slug`: `historic-old-town-riverside`
- `district_name`: `Historic Old Town / Riverside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: католический собор — одна из ключевых heritage-точек старого Саваннакхета и относится к old town / colonial contour. Контейнер не нужен.

---

## 11. That Ing Hang Stupa
- `slug`: `svk-that-ing-hang-stupa`
- `name`: `That Ing Hang Stupa`

### Place → District
- `district_slug`: `that-ing-hang-excursion-zone`
- `district_name`: `That Ing Hang Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ступа находится примерно в 13 км от центра и живёт как вынесенная pilgrimage / day-trip локация. Контейнер не нужен.

---

# Summary

## District links
- `svk-cafe-inn` → `historic-old-town-riverside`
- `svk-daosavanh-restaurant` → `civic-center-dinosaur-quarter`
- `svk-dinosaur-museum` → `civic-center-dinosaur-quarter`
- `svk-lin-s-cafe` → `historic-old-town-riverside`
- `svk-mekong-riverside-food-stalls` → `historic-old-town-riverside`
- `svk-mekong-riverside-promenade` → `historic-old-town-riverside`
- `svk-savannakhet-city-museum` → `historic-old-town-riverside`
- `svk-savannakhet-old-town` → `historic-old-town-riverside`
- `svk-sinouk-coffee-savannakhet` → `historic-old-town-riverside`
- `svk-st-teresa-s-catholic-church` → `historic-old-town-riverside`
- `svk-that-ing-hang-stupa` → `that-ing-hang-excursion-zone`

## Container links
- `svk-mekong-riverside-promenade` → `mekong-riverside-promenade`
- `svk-savannakhet-old-town` → `savannakhet-old-town`

## Places without container
- `svk-cafe-inn`
- `svk-daosavanh-restaurant`
- `svk-dinosaur-museum`
- `svk-lin-s-cafe`
- `svk-mekong-riverside-food-stalls`
- `svk-savannakhet-city-museum`
- `svk-sinouk-coffee-savannakhet`
- `svk-st-teresa-s-catholic-church`
- `svk-that-ing-hang-stupa`
