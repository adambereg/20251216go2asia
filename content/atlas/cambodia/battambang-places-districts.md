# Battambang Places → Districts / Containers

Этот файл фиксирует связи для **4 мест Баттамбанга, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `bat`

---

## 1. Bamboo Train
- `slug`: `bat-bamboo-train`
- `name`: `Bamboo Train`

### Place → District
- `district_slug`: `bamboo-train-excursion-zone`
- `district_name`: `Bamboo Train Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: текущая bamboo train experience находится вне центрального ядра Баттамбанга и логично живёт как отдельная excursion-zone, а не как часть historic center. Контейнер не нужен.

---

## 2. Kinyei Caf
- `slug`: `bat-kinyei-caf`
- `name`: `Kinyei Café`

### Place → District
- `district_slug`: `historic-center-psar-nath-riverside`
- `district_name`: `Historic Center / Psar Nath / Riverside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это старый/вариантный Atlas record того же Kinyei Café. Логично держать его в историческом центре Баттамбанга рядом с рынком Psar Nath и центральными улицами. Контейнер не нужен.

---

## 3. Kinyei Café
- `slug`: `bat-kinyei-cafe`
- `name`: `Kinyei Café`

### Place → District
- `district_slug`: `historic-center-psar-nath-riverside`
- `district_name`: `Historic Center / Psar Nath / Riverside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Kinyei Café находится у Psar Nath / Street 1.5 в центре Баттамбанга, поэтому логично относится к historic-center urban cluster. Контейнер не нужен.

---

## 4. Phnom Sampeau & Bat Cave
- `slug`: `bat-phnom-sampeau-bat-cave`
- `name`: `Phnom Sampeau & Bat Cave`

### Place → District
- `district_slug`: `phnom-sampeau-excursion-zone`
- `district_name`: `Phnom Sampeau Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Phnom Sampeau и bat cave находятся за пределами центра Баттамбанга и образуют самостоятельную hill-and-caves excursion-zone. Контейнер не нужен.

---

# Summary

## District links
- `bat-bamboo-train` → `bamboo-train-excursion-zone`
- `bat-kinyei-caf` → `historic-center-psar-nath-riverside`
- `bat-kinyei-cafe` → `historic-center-psar-nath-riverside`
- `bat-phnom-sampeau-bat-cave` → `phnom-sampeau-excursion-zone`

## Container links
- none

## Places without container
- `bat-bamboo-train`
- `bat-kinyei-caf`
- `bat-kinyei-cafe`
- `bat-phnom-sampeau-bat-cave`
