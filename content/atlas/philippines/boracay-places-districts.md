# Boracay Places → Districts / Containers

Этот файл фиксирует связи для **9 мест Боракая, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `philippines`
- `city_slug`: `boracay`

---

## 1. Ariel’s Point
- `slug`: `boracay-ariel-s-point`
- `name`: `Ariel’s Point`

### Place → District
- `district_slug`: `ariels-point-excursion-zone`
- `district_name`: `Ariel's Point Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это внешняя cliff-jumping и marine-adventure локация у Buruanga на материке Панай, куда обычно едут с Боракая на day trip. Контейнер не нужен.

---

## 2. Ariel’s Point
- `slug`: `boracay-ariels-point`
- `name`: `Ariel’s Point`

### Place → District
- `district_slug`: `ariels-point-excursion-zone`
- `district_name`: `Ariel's Point Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это дубль/вариант slug того же excursion-case Ariel’s Point. Для текущего Atlas набора сохраняется в том же внешнем district.

---

## 3. Jonah’s Fruit Shake
- `slug`: `boracay-jonah-s-fruit-shake`
- `name`: `Jonah’s Fruit Shake`

### Place → District
- `district_slug`: `white-beach-station-1-2`
- `district_name`: `White Beach / Station 1–2`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: культовая точка у White Beach Station 1. Контейнер не нужен: это отдельное beachfront café, а не кластер.

---

## 4. Jonah’s Fruit Shake
- `slug`: `boracay-jonahs-fruit-shake`
- `name`: `Jonah’s Fruit Shake`

### Place → District
- `district_slug`: `white-beach-station-1-2`
- `district_name`: `White Beach / Station 1–2`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: дубль/вариант slug того же Station 1 café-case. Остаётся в том же district.

---

## 5. Mount Luho Viewpoint
- `slug`: `boracay-mount-luho-viewpoint`
- `name`: `Mount Luho Viewpoint`

### Place → District
- `district_slug`: `bulabog-mount-luho`
- `district_name`: `Bulabog / Mount Luho`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: самая высокая обзорная точка острова. Это самостоятельный viewpoint, контейнер не нужен.

---

## 6. Puka Shell Beach
- `slug`: `boracay-puka-shell-beach`
- `name`: `Puka Shell Beach`

### Place → District
- `district_slug`: `yapak-north-boracay`
- `district_name`: `Yapak / North Boracay`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: северный quieter beach Боракая в Yapak area. Контейнер не нужен на текущем этапе.

---

## 7. Real Coffee & Tea Café
- `slug`: `boracay-real-coffee-tea-caf`
- `name`: `Real Coffee & Tea Café`

### Place → District
- `district_slug`: `white-beach-station-1-2`
- `district_name`: `White Beach / Station 1–2`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: café в зоне Station 2 у White Beach. Контейнер не нужен.

---

## 8. Real Coffee & Tea Café
- `slug`: `boracay-real-coffee-tea-cafe`
- `name`: `Real Coffee & Tea Café`

### Place → District
- `district_slug`: `white-beach-station-1-2`
- `district_name`: `White Beach / Station 1–2`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: дубль/вариант slug того же Station 2 café-case. Остаётся в том же district.

---

## 9. White Beach
- `slug`: `boracay-white-beach`
- `name`: `White Beach`

### Place → District
- `district_slug`: `white-beach-station-1-2`
- `district_name`: `White Beach / Station 1–2`

### Place → Container
- `container_slug`: `white-beach-boracay`
- `container_name`: `White Beach Boracay`

Пояснение: это не одна точка, а главный beachfront-кластер острова, поэтому place логично живёт и как container-сущность.

---

# Summary

## District links
- `boracay-ariel-s-point` → `ariels-point-excursion-zone`
- `boracay-ariels-point` → `ariels-point-excursion-zone`
- `boracay-jonah-s-fruit-shake` → `white-beach-station-1-2`
- `boracay-jonahs-fruit-shake` → `white-beach-station-1-2`
- `boracay-mount-luho-viewpoint` → `bulabog-mount-luho`
- `boracay-puka-shell-beach` → `yapak-north-boracay`
- `boracay-real-coffee-tea-caf` → `white-beach-station-1-2`
- `boracay-real-coffee-tea-cafe` → `white-beach-station-1-2`
- `boracay-white-beach` → `white-beach-station-1-2`

## Container links
- `boracay-white-beach` → `white-beach-boracay`

## Places without container
- `boracay-ariel-s-point`
- `boracay-ariels-point`
- `boracay-jonah-s-fruit-shake`
- `boracay-jonahs-fruit-shake`
- `boracay-mount-luho-viewpoint`
- `boracay-puka-shell-beach`
- `boracay-real-coffee-tea-caf`
- `boracay-real-coffee-tea-cafe`
