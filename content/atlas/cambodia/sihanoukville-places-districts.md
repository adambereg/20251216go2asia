# Sihanoukville Places → Districts / Containers

Этот файл фиксирует связи для **4 мест Сиануквиля, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `kps`

---

## 1. Kbal Chhay Waterfall
- `slug`: `kps-kbal-chhay-waterfall`
- `name`: `Kbal Chhay Waterfall`

### Place → District
- `district_slug`: `prey-nob-waterfall-excursion-zone`
- `district_name`: `Prey Nob Waterfall Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: водопад находится примерно в 16 км к северу от downtown Sihanoukville, в направлении Prey Nob, поэтому для Atlas это логично оформлять как внешний природный excursion cluster, а не как городской beach district.

---

## 2. Koh Rong Island
- `slug`: `kps-koh-rong-island`
- `name`: `Koh Rong Island`

### Place → District
- `district_slug`: `koh-rong-excursion-zone`
- `district_name`: `Koh Rong Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Koh Rong — это отдельный островной кластер у побережья Сиануквиля, то есть внешний marine destination, а не часть материкового городского ядра.

---

## 3. Otres Beach Cafés & Bars
- `slug`: `kps-otres-beach-caf-s-bars`
- `name`: `Otres Beach Cafés & Bars`

### Place → District
- `district_slug`: `otres-beach`
- `district_name`: `Otres Beach`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это beach dining / bars cluster на побережье Otres Beach south-east of Sihanoukville center. Отдельный container не нужен: в текущем Atlas set это тематическая place-сущность внутри района.

---

## 4. Otres Beach Cafés & Bars
- `slug`: `kps-otres-beach-cafes-bars`
- `name`: `Otres Beach Cafés & Bars`

### Place → District
- `district_slug`: `otres-beach`
- `district_name`: `Otres Beach`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это второй slug того же текущего Atlas кейса для Otres Beach cafés & bars. Я сохраняю его отдельно, чтобы не ломать существующий dataset и linkage.

---

# Summary

## District links
- `kps-kbal-chhay-waterfall` → `prey-nob-waterfall-excursion-zone`
- `kps-koh-rong-island` → `koh-rong-excursion-zone`
- `kps-otres-beach-caf-s-bars` → `otres-beach`
- `kps-otres-beach-cafes-bars` → `otres-beach`

## Container links
- none

## Places without container
- `kps-kbal-chhay-waterfall`
- `kps-koh-rong-island`
- `kps-otres-beach-caf-s-bars`
- `kps-otres-beach-cafes-bars`
