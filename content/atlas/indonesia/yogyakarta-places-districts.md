# Yogyakarta Places → Districts / Containers

Этот файл фиксирует связи для **12 мест Джокьякарты, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `indonesia`
- `city_slug`: `jog`

---

## 1. Abhayagiri Restaurant
- `slug`: `yog-abhayagiri-restaurant`
- `name`: `Abhayagiri Restaurant`

### Place → District
- `district_slug`: `prambanan-ratu-boko-excursion-zone`
- `district_name`: `Prambanan / Ratu Boko Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится в Sambirejo, Prambanan, Sleman и связан с обзорной hill-zone у Prambanan, а не с центральной городской тканью Джокьякарты. Контейнер не нужен. 

---

## 2. Borobudur Temple
- `slug`: `yog-borobudur-temple`
- `name`: `Borobudur Temple`

### Place → District
- `district_slug`: `borobudur-kedu-plain-excursion-zone`
- `district_name`: `Borobudur / Kedu Plain Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Borobudur живёт во внешней heritage excursion-zone в районе Magelang / Kedu Plain и не относится к городскому ядру Джокьякарты. Контейнер не нужен: это самостоятельная monument-scale destination.

---

## 3. Gudeg Yu Djum
- `slug`: `yog-gudeg-yu-djum`
- `name`: `Gudeg Yu Djum`

### Place → District
- `district_slug`: `central-kraton-malioboro`
- `district_name`: `Central Kraton / Malioboro`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Gudeg Yu Djum — знаковая culinary сущность Джокьякарты, связанная с центральным городским опытом. Для текущего Atlas mapping место рабоче привязано к central urban core, даже если у бренда есть несколько веток. Контейнер не нужен.

---

## 4. Kraton Yogyakarta
- `slug`: `yog-kraton-yogyakarta`
- `name`: `Kraton Yogyakarta`

### Place → District
- `district_slug`: `central-kraton-malioboro`
- `district_name`: `Central Kraton / Malioboro`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: дворцовый комплекс находится в историческом сердце города и логично относится к центральному Kraton/Malioboro контру. Контейнер не нужен на текущем этапе.

---

## 5. Malioboro Street
- `slug`: `yog-malioboro-street`
- `name`: `Malioboro Street`

### Place → District
- `district_slug`: `central-kraton-malioboro`
- `district_name`: `Central Kraton / Malioboro`

### Place → Container
- `container_slug`: `malioboro-street`
- `container_name`: `Malioboro Street`

Пояснение: это не одна точка, а самостоятельный городской corridor/cluster. Поэтому place логично привязан к central district и одновременно живёт как container-сущность.

---

## 6. Milas Restaurant
- `slug`: `yog-milas-restaurant`
- `name`: `Milas Restaurant`

### Place → District
- `district_slug`: `prawirotaman-mantrijeron`
- `district_name`: `Prawirotaman / Mantrijeron`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место находится в зоне Prawirotaman / Brontokusuman и относится к южному café/backpacker contour. Контейнер не нужен.

---

## 7. Mount Merapi
- `slug`: `yog-mount-merapi`
- `name`: `Mount Merapi`

### Place → District
- `district_slug`: `kaliurang-merapi-excursion-zone`
- `district_name`: `Kaliurang / Merapi Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Merapi — внешняя volcanic destination на севере региона, связанная с Kaliurang и jeep tours, а не с городской тканью Джокьякарты. Контейнер не нужен.

---

## 8. Nasi Kucing Angkringan Lik Man
- `slug`: `yog-nasi-kucing-angkringan-lik-man`
- `name`: `Nasi Kucing Angkringan Lik Man`

### Place → District
- `district_slug`: `central-kraton-malioboro`
- `district_name`: `Central Kraton / Malioboro`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: angkringan опыт тесно связан с центральным туристическим контуром около Malioboro / station-side urban core. Контейнер не нужен.

---

## 9. Prambanan Temple
- `slug`: `yog-prambanan-temple`
- `name`: `Prambanan Temple`

### Place → District
- `district_slug`: `prambanan-ratu-boko-excursion-zone`
- `district_name`: `Prambanan / Ratu Boko Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храмовый комплекс находится во внешней excursion-zone у Prambanan и не является частью central city core. Контейнер не нужен: это самостоятельная monument-scale destination.

---

## 10. Sosro Coffee
- `slug`: `yog-sosro-coffee`
- `name`: `Sosro Coffee`

### Place → District
- `district_slug`: `central-kraton-malioboro`
- `district_name`: `Central Kraton / Malioboro`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Sosrowijayan живёт как часть центрального tourist-service contour у Malioboro и station-side core. Контейнер не нужен.

---

## 11. Taman Sari Water Castle
- `slug`: `yog-taman-sari-water-castle`
- `name`: `Taman Sari Water Castle`

### Place → District
- `district_slug`: `central-kraton-malioboro`
- `district_name`: `Central Kraton / Malioboro`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Taman Sari расположен внутри исторического дворцового контура Yogyakarta и относится к central heritage core. Контейнер не нужен на текущем этапе.

---

## 12. Via Via Café
- `slug`: `yog-via-via-cafe`
- `name`: `Via Via Café`

### Place → District
- `district_slug`: `prawirotaman-mantrijeron`
- `district_name`: `Prawirotaman / Mantrijeron`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Via Via находится на Jalan Prawirotaman и логично относится к backpacker/café contour южнее исторического ядра. Контейнер не нужен.

---

# Summary

## District links
- `yog-abhayagiri-restaurant` → `prambanan-ratu-boko-excursion-zone`
- `yog-borobudur-temple` → `borobudur-kedu-plain-excursion-zone`
- `yog-gudeg-yu-djum` → `central-kraton-malioboro`
- `yog-kraton-yogyakarta` → `central-kraton-malioboro`
- `yog-malioboro-street` → `central-kraton-malioboro`
- `yog-milas-restaurant` → `prawirotaman-mantrijeron`
- `yog-mount-merapi` → `kaliurang-merapi-excursion-zone`
- `yog-nasi-kucing-angkringan-lik-man` → `central-kraton-malioboro`
- `yog-prambanan-temple` → `prambanan-ratu-boko-excursion-zone`
- `yog-sosro-coffee` → `central-kraton-malioboro`
- `yog-taman-sari-water-castle` → `central-kraton-malioboro`
- `yog-via-via-cafe` → `prawirotaman-mantrijeron`

## Container links
- `yog-malioboro-street` → `malioboro-street`

## Places without container
- `yog-abhayagiri-restaurant`
- `yog-borobudur-temple`
- `yog-gudeg-yu-djum`
- `yog-kraton-yogyakarta`
- `yog-milas-restaurant`
- `yog-mount-merapi`
- `yog-nasi-kucing-angkringan-lik-man`
- `yog-prambanan-temple`
- `yog-sosro-coffee`
- `yog-taman-sari-water-castle`
- `yog-via-via-cafe`
