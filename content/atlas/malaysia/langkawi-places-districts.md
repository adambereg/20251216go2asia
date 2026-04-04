# Langkawi Places → Districts / Containers

Этот файл фиксирует связи для **11 мест Лангкави, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `malaysia`
- `city_slug`: `lgk`

---

## 1. Eagle Square
- `slug`: `lgk-eagle-square`
- `name`: `Eagle Square`

### Place → District
- `district_slug`: `kuah-waterfront`
- `district_name`: `Kuah Waterfront`

### Place → Container
- `container_slug`: `kuah-waterfront-promenade`
- `container_name`: `Kuah Waterfront Promenade`

Пояснение: Eagle Square (Dataran Lang) — ключевой landmark у Kuah waterfront и marina edge, поэтому место логично живёт внутри promenade-кластера.

---

## 2. Kilim Karst Geoforest Park
- `slug`: `lgk-kilim-karst-geoforest-park`
- `name`: `Kilim Karst Geoforest Park`

### Place → District
- `district_slug`: `kilim-karst-geoforest-zone`
- `district_name`: `Kilim Karst Geoforest Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это самостоятельная large-scale nature destination внутри Kilim geoforest / mangrove zone. Контейнер не нужен.

---

## 3. Langkawi Cable Car
- `slug`: `lgk-langkawi-cable-car`
- `name`: `Langkawi Cable Car`

### Place → District
- `district_slug`: `pantai-kok-machinchang`
- `district_name`: `Pantai Kok / Machinchang`

### Place → Container
- `container_slug`: `oriental-village-skycab`
- `container_name`: `Oriental Village / SkyCab`

Пояснение: base station Cable Car находится в Oriental Village у подножия Machinchang range, поэтому логичен container-gateway.

---

## 4. Langkawi Sky Bridge
- `slug`: `lgk-langkawi-sky-bridge`
- `name`: `Langkawi Sky Bridge`

### Place → District
- `district_slug`: `pantai-kok-machinchang`
- `district_name`: `Pantai Kok / Machinchang`

### Place → Container
- `container_slug`: `oriental-village-skycab`
- `container_name`: `Oriental Village / SkyCab`

Пояснение: Sky Bridge напрямую связан с Cable Car / Machinchang access system, поэтому живёт в том же container-cluster.

---

## 5. Orkid Ria Seafood Restaurant
- `slug`: `lgk-orkid-ria-seafood-restaurant`
- `name`: `Orkid Ria Seafood Restaurant`

### Place → District
- `district_slug`: `kuah-waterfront`
- `district_name`: `Kuah Waterfront`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: в текущем Atlas наборе place operationally привязан к Kuah waterfront seafood contour. Контейнер не нужен.

---

## 6. Pantai Cenang Beach
- `slug`: `lgk-pantai-cenang-beach`
- `name`: `Pantai Cenang Beach`

### Place → District
- `district_slug`: `pantai-cenang`
- `district_name`: `Pantai Cenang`

### Place → Container
- `container_slug`: `pantai-cenang-beach`
- `container_name`: `Pantai Cenang Beach`

Пояснение: это не одиночная точка, а самостоятельный beachfront-cluster, поэтому нужен container.

---

## 7. Sunset Dinner Cruise Langkawi
- `slug`: `lgk-sunset-dinner-cruise-langkawi`
- `name`: `Sunset Dinner Cruise Langkawi`

### Place → District
- `district_slug`: `kuah-waterfront`
- `district_name`: `Kuah Waterfront`

### Place → Container
- `container_slug`: `kuah-waterfront-promenade`
- `container_name`: `Kuah Waterfront Promenade`

Пояснение: departure logic и городской experience здесь привязаны к Kuah jetty/waterfront cluster.

---

## 8. Telaga Tujuh Waterfalls
- `slug`: `lgk-telaga-tujuh-waterfalls`
- `name`: `Telaga Tujuh Waterfalls`

### Place → District
- `district_slug`: `pantai-kok-machinchang`
- `district_name`: `Pantai Kok / Machinchang`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Seven Wells/Telaga Tujuh находятся в том же west-coast natural contour у Machinchang foothills. Контейнер не нужен.

---

## 9. The Cliff Restaurant & Bar
- `slug`: `lgk-the-cliff-restaurant-bar`
- `name`: `The Cliff Restaurant & Bar`

### Place → District
- `district_slug`: `pantai-cenang`
- `district_name`: `Pantai Cenang`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: restaurant живёт внутри Pantai Cenang seaside dining contour. Контейнер не нужен.

---

## 10. Wonderland Food Store
- `slug`: `lgk-wonderland-food-store`
- `name`: `Wonderland Food Store`

### Place → District
- `district_slug`: `kuah-waterfront`
- `district_name`: `Kuah Waterfront`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: operationally это часть Kuah waterfront / seafood dining contour. Контейнер не нужен.

---

## 11. Yellow Café
- `slug`: `lgk-yellow-cafe`
- `name`: `Yellow Café`

### Place → District
- `district_slug`: `pantai-cenang`
- `district_name`: `Pantai Cenang`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: café относится к Pantai Cenang beach strip и его lifestyle contour. Контейнер не нужен.

---

# Summary

## District links
- `lgk-eagle-square` → `kuah-waterfront`
- `lgk-kilim-karst-geoforest-park` → `kilim-karst-geoforest-zone`
- `lgk-langkawi-cable-car` → `pantai-kok-machinchang`
- `lgk-langkawi-sky-bridge` → `pantai-kok-machinchang`
- `lgk-orkid-ria-seafood-restaurant` → `kuah-waterfront`
- `lgk-pantai-cenang-beach` → `pantai-cenang`
- `lgk-sunset-dinner-cruise-langkawi` → `kuah-waterfront`
- `lgk-telaga-tujuh-waterfalls` → `pantai-kok-machinchang`
- `lgk-the-cliff-restaurant-bar` → `pantai-cenang`
- `lgk-wonderland-food-store` → `kuah-waterfront`
- `lgk-yellow-cafe` → `pantai-cenang`

## Container links
- `lgk-eagle-square` → `kuah-waterfront-promenade`
- `lgk-langkawi-cable-car` → `oriental-village-skycab`
- `lgk-langkawi-sky-bridge` → `oriental-village-skycab`
- `lgk-pantai-cenang-beach` → `pantai-cenang-beach`
- `lgk-sunset-dinner-cruise-langkawi` → `kuah-waterfront-promenade`

## Places without container
- `lgk-kilim-karst-geoforest-park`
- `lgk-orkid-ria-seafood-restaurant`
- `lgk-telaga-tujuh-waterfalls`
- `lgk-the-cliff-restaurant-bar`
- `lgk-wonderland-food-store`
- `lgk-yellow-cafe`
