# Vientiane Places → Districts / Containers

Этот файл фиксирует связи для **12 мест Вьентьяна, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `laos`
- `city_slug`: `vte`

---

## 1. Ban Anou Night Market Food Court
- `slug`: `vte-ban-anou-night-market-food-court`
- `name`: `Ban Anou Night Market Food Court`

### Place → District
- `district_slug`: `mekong-riverside-ban-anou`
- `district_name`: `Mekong Riverside / Ban Anou`

### Place → Container
- `container_slug`: `ban-anou-night-market`
- `container_name`: `Ban Anou Night Market`

Пояснение: food court относится к Ban Anou area, которая лежит в walkable reach от Mekong riverside и формирует самостоятельный локальный night-food cluster.

---

## 2. Bor Pen Nyang Rooftop
- `slug`: `vte-bor-pen-nyang-rooftop`
- `name`: `Bor Pen Nyang Rooftop`

### Place → District
- `district_slug`: `mekong-riverside-ban-anou`
- `district_name`: `Mekong Riverside / Ban Anou`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: rooftop-bar расположен на Quai Fa Ngum у Mekong River и логично относится к riverside nightlife contour. Контейнер не нужен.

---

## 3. Buddha Park
- `slug`: `vte-buddha-park`
- `name`: `Buddha Park`

### Place → District
- `district_slug`: `xieng-khuan-buddha-park-excursion-zone`
- `district_name`: `Xieng Khuan / Buddha Park Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Buddha Park находится в Xieng Khuan за пределами городского ядра Вьентьяна. Это внешний excursion cluster, а не центральный городской район. Контейнер не нужен.

---

## 4. COPE Visitor Centre
- `slug`: `vte-cope-visitor-centre`
- `name`: `COPE Visitor Centre`

### Place → District
- `district_slug`: `central-civic-that-dam`
- `district_name`: `Central Civic / That Dam`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: COPE находится на Khouvieng Road в центральной части города к югу от Patuxai и логично живёт в civic-core контуре. Контейнер не нужен.

---

## 5. Kualao Restaurant
- `slug`: `vte-kualao-restaurant`
- `name`: `Kualao Restaurant`

### Place → District
- `district_slug`: `central-civic-that-dam`
- `district_name`: `Central Civic / That Dam`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан расположен на Samsenthai Road у That Dam intersection, то есть в центральном city-core Вьентьяна. Контейнер не нужен.

---

## 6. Makphet Restaurant
- `slug`: `vte-makphet-restaurant`
- `name`: `Makphet Restaurant`

### Place → District
- `district_slug`: `mekong-riverside-ban-anou`
- `district_name`: `Mekong Riverside / Ban Anou`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Makphet связан с Rue Phai Nam / Ban Anou zone рядом с riverside и night-food environment. Контейнер не нужен.

---

## 7. Mekong Riverside Promenade
- `slug`: `vte-mekong-riverside-promenade`
- `name`: `Mekong Riverside Promenade`

### Place → District
- `district_slug`: `mekong-riverside-ban-anou`
- `district_name`: `Mekong Riverside / Ban Anou`

### Place → Container
- `container_slug`: `mekong-riverside-promenade`
- `container_name`: `Mekong Riverside Promenade`

Пояснение: это не одна точка, а длинный public riverfront corridor. Поэтому нужен container.

---

## 8. Patuxai
- `slug`: `vte-patuxai`
- `name`: `Patuxai`

### Place → District
- `district_slug`: `central-civic-that-dam`
- `district_name`: `Central Civic / That Dam`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Patuxai находится на Lane Xang Avenue в центральном civic contour Вьентьяна. Контейнер не нужен.

---

## 9. Pha That Luang
- `slug`: `vte-pha-that-luang`
- `name`: `Pha That Luang`

### Place → District
- `district_slug`: `that-luang-nongbone`
- `district_name`: `That Luang / Nongbone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: главный stupa-комплекс живёт в вынесенном monumental zone That Luang area, а не в riverside или old center. Контейнер не нужен.

---

## 10. Scandinavian Bakery
- `slug`: `vte-scandinavian-bakery`
- `name`: `Scandinavian Bakery`

### Place → District
- `district_slug`: `central-civic-that-dam`
- `district_name`: `Central Civic / That Dam`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: bakery historically связана с Nam Phu / central Vientiane zone, поэтому operationally относится к central civic core. Контейнер не нужен.

---

## 11. Taj Mahal Restaurant
- `slug`: `vte-taj-mahal-restaurant`
- `name`: `Taj Mahal Restaurant`

### Place → District
- `district_slug`: `mekong-riverside-ban-anou`
- `district_name`: `Mekong Riverside / Ban Anou`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан привязан к Yonnet Road / tourist quarter near Mekong, то есть к riverside-side dining contour. Контейнер не нужен.

---

## 12. Wat Si Saket
- `slug`: `vte-wat-si-saket`
- `name`: `Wat Si Saket`

### Place → District
- `district_slug`: `central-civic-that-dam`
- `district_name`: `Central Civic / That Dam`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храм находится на Lane Xang Avenue в central Vientiane и логично относится к civic-historic core. Контейнер не нужен.

---

# Summary

## District links
- `vte-ban-anou-night-market-food-court` → `mekong-riverside-ban-anou`
- `vte-bor-pen-nyang-rooftop` → `mekong-riverside-ban-anou`
- `vte-buddha-park` → `xieng-khuan-buddha-park-excursion-zone`
- `vte-cope-visitor-centre` → `central-civic-that-dam`
- `vte-kualao-restaurant` → `central-civic-that-dam`
- `vte-makphet-restaurant` → `mekong-riverside-ban-anou`
- `vte-mekong-riverside-promenade` → `mekong-riverside-ban-anou`
- `vte-patuxai` → `central-civic-that-dam`
- `vte-pha-that-luang` → `that-luang-nongbone`
- `vte-scandinavian-bakery` → `central-civic-that-dam`
- `vte-taj-mahal-restaurant` → `mekong-riverside-ban-anou`
- `vte-wat-si-saket` → `central-civic-that-dam`

## Container links
- `vte-ban-anou-night-market-food-court` → `ban-anou-night-market`
- `vte-mekong-riverside-promenade` → `mekong-riverside-promenade`

## Places without container
- `vte-bor-pen-nyang-rooftop`
- `vte-buddha-park`
- `vte-cope-visitor-centre`
- `vte-kualao-restaurant`
- `vte-makphet-restaurant`
- `vte-patuxai`
- `vte-pha-that-luang`
- `vte-scandinavian-bakery`
- `vte-taj-mahal-restaurant`
- `vte-wat-si-saket`