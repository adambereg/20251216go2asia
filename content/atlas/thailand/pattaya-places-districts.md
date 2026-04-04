# Pattaya Places → Districts / Containers

Этот файл фиксирует связи для **9 мест Паттайи, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `pty`

---

## 1. Big Buddha Hill
- `slug`: `pty-big-buddha-hill`
- `name`: `Big Buddha Hill`

### Place → District
- `district_slug`: `south-pattaya-pratumnak`
- `district_name`: `South Pattaya / Pratumnak`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: холм и храм Wat Phra Yai находятся на Pratumnak Hill между Pattaya Beach и Jomtien. Логично относить объект к южному контуру Pattaya / Pratumnak. Контейнер на текущем этапе не нужен.

---

## 2. Horizon Rooftop Bar
- `slug`: `pty-horizon-rooftop-bar`
- `name`: `Horizon Rooftop Bar`

### Place → District
- `district_slug`: `central-pattaya-beach-road`
- `district_name`: `Central Pattaya / Beach Road`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: бар расположен в Hilton Pattaya над центральной beachfront-зоной и напрямую связан с Pattaya Beach / Beach Road core. Контейнер не нужен.

---

## 3. Jomtien Beach
- `slug`: `pty-jomtien-beach`
- `name`: `Jomtien Beach`

### Place → District
- `district_slug`: `jomtien`
- `district_name`: `Jomtien`

### Place → Container
- `container_slug`: `jomtien-beach`
- `container_name`: `Jomtien Beach`

Пояснение: это не одна точка, а самостоятельный длинный beachfront-кластер южнее центра Паттайи. Поэтому place логично живёт как container-сущность.

---

## 4. Mum Aroi
- `slug`: `pty-mum-aroi`
- `name`: `Mum Aroi`

### Place → District
- `district_slug`: `naklua-wong-amat`
- `district_name`: `Naklua / Wong Amat`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: наиболее узнаваемая pattaya-локация ресторана связана с Naklua seaside area. Контейнер не нужен: это самостоятельный ресторан.

---

## 5. Nong Nooch Tropical Garden
- `slug`: `pty-nong-nooch-tropical-garden`
- `name`: `Nong Nooch Tropical Garden`

### Place → District
- `district_slug`: `na-jomtien-excursion-zone`
- `district_name`: `Na Jomtien Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: сад расположен южнее Паттайи в зоне Na Chom Thian / Na Jomtien и логично относится к внешнему excursion/resort cluster, а не к городскому ядру. Контейнер не нужен.

---

## 6. Pattaya Beach
- `slug`: `pty-pattaya-beach`
- `name`: `Pattaya Beach`

### Place → District
- `district_slug`: `central-pattaya-beach-road`
- `district_name`: `Central Pattaya / Beach Road`

### Place → Container
- `container_slug`: `pattaya-beach`
- `container_name`: `Pattaya Beach`

Пояснение: это главный beachfront-кластер города, а не одиночная точка. Поэтому нужен container.

---

## 7. Sanctuary of Truth
- `slug`: `pty-sanctuary-of-truth`
- `name`: `Sanctuary of Truth`

### Place → District
- `district_slug`: `naklua-wong-amat`
- `district_name`: `Naklua / Wong Amat`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: музей-храм находится в Naklua area на севере Большой Паттайи и логично относится к северной coastal / landmark-зоне. Контейнер не нужен.

---

## 8. The Glass House
- `slug`: `pty-the-glass-house`
- `name`: `The Glass House`

### Place → District
- `district_slug`: `na-jomtien-excursion-zone`
- `district_name`: `Na Jomtien Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Glass House Pattaya находится в Na Jomtien / Na Chom Thian south of Pattaya. Это внешний coastal/resort cluster, а не центр города. Контейнер не нужен.

---

## 9. Walking Street
- `slug`: `pty-walking-street`
- `name`: `Walking Street`

### Place → District
- `district_slug`: `south-pattaya-pratumnak`
- `district_name`: `South Pattaya / Pratumnak`

### Place → Container
- `container_slug`: `walking-street`
- `container_name`: `Walking Street`

Пояснение: это не одиночная точка, а самостоятельный nightlife-route на южной кромке Pattaya Beach. Поэтому нужен container.

---

# Summary

## District links
- `pty-big-buddha-hill` → `south-pattaya-pratumnak`
- `pty-horizon-rooftop-bar` → `central-pattaya-beach-road`
- `pty-jomtien-beach` → `jomtien`
- `pty-mum-aroi` → `naklua-wong-amat`
- `pty-nong-nooch-tropical-garden` → `na-jomtien-excursion-zone`
- `pty-pattaya-beach` → `central-pattaya-beach-road`
- `pty-sanctuary-of-truth` → `naklua-wong-amat`
- `pty-the-glass-house` → `na-jomtien-excursion-zone`
- `pty-walking-street` → `south-pattaya-pratumnak`

## Container links
- `pty-jomtien-beach` → `jomtien-beach`
- `pty-pattaya-beach` → `pattaya-beach`
- `pty-walking-street` → `walking-street`

## Places without container
- `pty-big-buddha-hill`
- `pty-horizon-rooftop-bar`
- `pty-mum-aroi`
- `pty-nong-nooch-tropical-garden`
- `pty-sanctuary-of-truth`
- `pty-the-glass-house`