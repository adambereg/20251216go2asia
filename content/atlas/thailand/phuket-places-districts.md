# Phuket Places → Districts / Containers

Этот файл фиксирует связи для **12 мест Пхукета, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `hkt`

---

## 1. Baan Rim Pa
- `slug`: `phk-baan-rim-pa`
- `name`: `Baan Rim Pa`

### Place → District
- `district_slug`: `patong-kalim`
- `district_name`: `Patong / Kalim`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится на Prabaramee Road у северного края Patong bay, то есть логично относится к coastal cluster Patong / Kalim. Контейнер не нужен.

---

## 2. Big Buddha Phuket
- `slug`: `phk-big-buddha-phuket`
- `name`: `Big Buddha Phuket`

### Place → District
- `district_slug`: `chalong-big-buddha`
- `district_name`: `Chalong / Big Buddha`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Big Buddha находится на Nakkerd Hill near Chalong / Karon side и для Atlas логично живёт в районе Chalong / Big Buddha. Контейнер не нужен: это самостоятельный landmark.

---

## 3. Blue Elephant Phuket
- `slug`: `phk-blue-elephant-phuket`
- `name`: `Blue Elephant Phuket`

### Place → District
- `district_slug`: `phuket-old-town`
- `district_name`: `Phuket Old Town`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан расположен в историческом центре Phuket Town в governor's mansion / Phra Pitak Chinpracha, то есть относится к Phuket Old Town. Контейнер не нужен.

---

## 4. Cafe Phuket Viewpoint
- `slug`: `phk-cafe-phuket-viewpoint`
- `name`: `Cafe Phuket Viewpoint`

### Place → District
- `district_slug`: `patong-kalim`
- `district_name`: `Patong / Kalim`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: кафе стоит на Prabaramee Road between Patong and Kamala, но в текущем curated Atlas mapping логично относится к Patong / Kalim coastal zone. Контейнер не нужен.

---

## 5. Kan Eang @ Pier
- `slug`: `phk-kan-eang-pier`
- `name`: `Kan Eang @ Pier`

### Place → District
- `district_slug`: `chalong-big-buddha`
- `district_name`: `Chalong / Big Buddha`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это waterfront seafood place в Chalong у пирса, поэтому он относится к району Chalong / Big Buddha. Контейнер не нужен.

---

## 6. No.6 Restaurant
- `slug`: `phk-no-6-restaurant`
- `name`: `No.6 Restaurant`

### Place → District
- `district_slug`: `patong-kalim`
- `district_name`: `Patong / Kalim`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится на Rat-U-Thit Road in Patong и должен жить в Patong / Kalim cluster. Контейнер не нужен.

---

## 7. Old Phuket Town
- `slug`: `phk-old-phuket-town`
- `name`: `Old Phuket Town`

### Place → District
- `district_slug`: `phuket-old-town`
- `district_name`: `Phuket Old Town`

### Place → Container
- `container_slug`: `phuket-old-town`
- `container_name`: `Phuket Old Town`

Пояснение: это не одна точка, а самостоятельный исторический городской кластер. Поэтому place логично привязан к district `phuket-old-town` и одновременно живёт как container-сущность.

---

## 8. Patong Beach
- `slug`: `phk-patong-beach`
- `name`: `Patong Beach`

### Place → District
- `district_slug`: `patong-kalim`
- `district_name`: `Patong / Kalim`

### Place → Container
- `container_slug`: `patong-beach`
- `container_name`: `Patong Beach`

Пояснение: это не одиночная точка, а большой beachfront cluster. Поэтому нужен container.

---

## 9. Phi Phi Islands
- `slug`: `phk-phi-phi-islands`
- `name`: `Phi Phi Islands`

### Place → District
- `district_slug`: `phi-phi-excursion-zone`
- `district_name`: `Phi Phi Excursion Zone`

### Place → Container
- `container_slug`: `phi-phi-islands`
- `container_name`: `Phi Phi Islands`

Пояснение: это внешний island cluster, который не является одной точкой. Поэтому place логично живёт в excursion-zone и одновременно как container.

---

## 10. Promthep Cape
- `slug`: `phk-promthep-cape`
- `name`: `Promthep Cape`

### Place → District
- `district_slug`: `rawai-promthep`
- `district_name`: `Rawai / Promthep`

### Place → Container
- `container_slug`: `promthep-cape`
- `container_name`: `Promthep Cape`

Пояснение: это не просто viewpoint pin, а самостоятельный scenic coastal cluster на южной оконечности острова. Поэтому container нужен.

---

## 11. Raya Restaurant
- `slug`: `phk-raya-restaurant`
- `name`: `Raya Restaurant`

### Place → District
- `district_slug`: `phuket-old-town`
- `district_name`: `Phuket Old Town`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится на Dibuk Road в Phuket Old Town и относится к историческому urban core. Контейнер не нужен.

---

## 12. Three Monkeys Restaurant
- `slug`: `phk-three-monkeys-restaurant`
- `name`: `Three Monkeys Restaurant`

### Place → District
- `district_slug`: `wichit-kathu-hills`
- `district_name`: `Wichit / Kathu Hills`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится в зелёном hillside/jungle corridor near Hanuman World между Phuket Town и Chalong, поэтому для Atlas логично привязать его к Wichit / Kathu Hills. Контейнер не нужен.

---

# Summary

## District links
- `phk-baan-rim-pa` → `patong-kalim`
- `phk-big-buddha-phuket` → `chalong-big-buddha`
- `phk-blue-elephant-phuket` → `phuket-old-town`
- `phk-cafe-phuket-viewpoint` → `patong-kalim`
- `phk-kan-eang-pier` → `chalong-big-buddha`
- `phk-no-6-restaurant` → `patong-kalim`
- `phk-old-phuket-town` → `phuket-old-town`
- `phk-patong-beach` → `patong-kalim`
- `phk-phi-phi-islands` → `phi-phi-excursion-zone`
- `phk-promthep-cape` → `rawai-promthep`
- `phk-raya-restaurant` → `phuket-old-town`
- `phk-three-monkeys-restaurant` → `wichit-kathu-hills`

## Container links
- `phk-old-phuket-town` → `phuket-old-town`
- `phk-patong-beach` → `patong-beach`
- `phk-phi-phi-islands` → `phi-phi-islands`
- `phk-promthep-cape` → `promthep-cape`

## Places without container
- `phk-baan-rim-pa`
- `phk-big-buddha-phuket`
- `phk-blue-elephant-phuket`
- `phk-cafe-phuket-viewpoint`
- `phk-kan-eang-pier`
- `phk-no-6-restaurant`
- `phk-raya-restaurant`
- `phk-three-monkeys-restaurant`
