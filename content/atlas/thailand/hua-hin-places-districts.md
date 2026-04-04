# Hua Hin Places → Districts / Containers

Этот файл фиксирует связи для **8 мест Хуа Хина, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `hhn`

---

## 1. Baan Itsara Restaurant
- `slug`: `hhn-baan-itsara-restaurant`
- `name`: `Baan Itsara Restaurant`

### Place → District
- `district_slug`: `central-hua-hin`
- `district_name`: `Central Hua Hin`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится на береговой линии в центральной части Хуа Хина и относится к classic seaside core города. Контейнер не нужен: это самостоятельный ресторан.

---

## 2. Cicada Market
- `slug`: `hhn-cicada-market`
- `name`: `Cicada Market`

### Place → District
- `district_slug`: `nong-kae`
- `district_name`: `Nong Kae`

### Place → Container
- `container_slug`: `cicada-market`
- `container_name`: `Cicada Market`

Пояснение: это не одиночная точка, а самостоятельный weekend market cluster в южной resort-зоне Hua Hin. Поэтому нужен container.

---

## 3. Hua Hin Beach
- `slug`: `hhn-hua-hin-beach`
- `name`: `Hua Hin Beach`

### Place → District
- `district_slug`: `central-hua-hin`
- `district_name`: `Central Hua Hin`

### Place → Container
- `container_slug`: `hua-hin-beach`
- `container_name`: `Hua Hin Beach`

Пояснение: это не единичный объект, а главный beachfront-кластер города. Поэтому place логично живёт как container-сущность внутри central district.

---

## 4. Hua Hin Railway Station
- `slug`: `hhn-hua-hin-railway-station`
- `name`: `Hua Hin Railway Station`

### Place → District
- `district_slug`: `central-hua-hin`
- `district_name`: `Central Hua Hin`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: станция находится в центральной части Хуа Хина рядом с морским ядром города и выступает как самостоятельный landmark. Контейнер не нужен.

---

## 5. Khao Takiab
- `slug`: `hhn-khao-takiab`
- `name`: `Khao Takiab`

### Place → District
- `district_slug`: `khao-takiab`
- `district_name`: `Khao Takiab`

### Place → Container
- `container_slug`: `khao-takiab-hill`
- `container_name`: `Khao Takiab Hill`

Пояснение: это не просто точка, а целый scenic coastal cluster вокруг холма, храмовой зоны и обзорных точек. Поэтому нужен container.

---

## 6. Let’s Sea Bar
- `slug`: `hhn-let-s-sea-bar`
- `name`: `Let’s Sea Bar`

### Place → District
- `district_slug`: `khao-takiab`
- `district_name`: `Khao Takiab`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: бар находится в beach-resort зоне Khao Takiab и логично относится к этому району. Контейнер не нужен: это самостоятельный bar venue.

---

## 7. Phraya Nakhon Cave
- `slug`: `hhn-phraya-nakhon-cave`
- `name`: `Phraya Nakhon Cave`

### Place → District
- `district_slug`: `sam-roi-yot-excursion-zone`
- `district_name`: `Sam Roi Yot Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: объект находится за пределами курортного ядра Хуа Хина и логично живёт в excursion-zone, связанной с Khao Sam Roi Yot National Park. Контейнер не нужен: это самостоятельная природная destination.

---

## 8. Vana Nava Water Jungle
- `slug`: `hhn-vana-nava-water-jungle`
- `name`: `Vana Nava Water Jungle`

### Place → District
- `district_slug`: `nong-kae`
- `district_name`: `Nong Kae`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: аквапарк расположен в южной resort-зоне Hua Hin, рядом с lifestyle и family attractions района Nong Kae. Контейнер не нужен.

---

# Summary

## District links
- `hhn-baan-itsara-restaurant` → `central-hua-hin`
- `hhn-cicada-market` → `nong-kae`
- `hhn-hua-hin-beach` → `central-hua-hin`
- `hhn-hua-hin-railway-station` → `central-hua-hin`
- `hhn-khao-takiab` → `khao-takiab`
- `hhn-let-s-sea-bar` → `khao-takiab`
- `hhn-phraya-nakhon-cave` → `sam-roi-yot-excursion-zone`
- `hhn-vana-nava-water-jungle` → `nong-kae`

## Container links
- `hhn-cicada-market` → `cicada-market`
- `hhn-hua-hin-beach` → `hua-hin-beach`
- `hhn-khao-takiab` → `khao-takiab-hill`

## Places without container
- `hhn-baan-itsara-restaurant`
- `hhn-hua-hin-railway-station`
- `hhn-let-s-sea-bar`
- `hhn-phraya-nakhon-cave`
- `hhn-vana-nava-water-jungle`
