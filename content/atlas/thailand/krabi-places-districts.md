# Krabi Places → Districts / Containers

Этот файл фиксирует связи для **8 мест Краби, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `kbi`

---

## 1. Ao Nang Beach
- `slug`: `kbi-ao-nang-beach`
- `name`: `Ao Nang Beach`

### Place → District
- `district_slug`: `ao-nang`
- `district_name`: `Ao Nang`

### Place → Container
- `container_slug`: `ao-nang-beach`
- `container_name`: `Ao Nang Beach`

Пояснение: это не одна точка, а самостоятельный beachfront-кластер и главный курортный beach strip материкового Краби. Поэтому place логично живёт как container-сущность внутри района Ao Nang.

---

## 2. Emerald Pool
- `slug`: `kbi-emerald-pool`
- `name`: `Emerald Pool`

### Place → District
- `district_slug`: `khlong-thom-excursion-zone`
- `district_name`: `Khlong Thom Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: природная локация находится в зоне Khlong Thom и относится к внешнему day-trip/excursion contour, а не к городским пляжным районам Краби. Контейнер не нужен.

---

## 3. Hong Islands
- `slug`: `kbi-hong-islands`
- `name`: `Hong Islands`

### Place → District
- `district_slug`: `hong-islands-excursion-zone`
- `district_name`: `Hong Islands Excursion Zone`

### Place → Container
- `container_slug`: `hong-islands`
- `container_name`: `Hong Islands`

Пояснение: это островной кластер, а не одна точка. Поэтому place должен быть оформлен как container в отдельной excursion-zone.

---

## 4. Khao Khanab Nam
- `slug`: `kbi-khao-khanab-nam`
- `name`: `Khao Khanab Nam`

### Place → District
- `district_slug`: `krabi-town-riverfront`
- `district_name`: `Krabi Town / Riverfront`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это символический landmark у входа в Krabi Town на реке и он относится именно к городскому riverfront-контурy. Контейнер не нужен на текущем этапе.

---

## 5. Phi Phi Islands
- `slug`: `kbi-phi-phi-islands`
- `name`: `Phi Phi Islands`

### Place → District
- `district_slug`: `phi-phi-excursion-zone`
- `district_name`: `Phi Phi Excursion Zone`

### Place → Container
- `container_slug`: `phi-phi-islands`
- `container_name`: `Phi Phi Islands`

Пояснение: это архипелаг и самостоятельная destination-zone, а не одиночный point object. Поэтому нужен container.

---

## 6. Railay Beach
- `slug`: `kbi-railay-beach`
- `name`: `Railay Beach`

### Place → District
- `district_slug`: `railay-phra-nang`
- `district_name`: `Railay / Phra Nang`

### Place → Container
- `container_slug`: `railay-beach`
- `container_name`: `Railay Beach`

Пояснение: Railay — это beach-and-peninsula cluster с несколькими зонами и пляжами, а не одиночная точка. Поэтому place логично должен жить как container.

---

## 7. The Grotto Restaurant
- `slug`: `kbi-the-grotto-restaurant`
- `name`: `The Grotto Restaurant`

### Place → District
- `district_slug`: `railay-phra-nang`
- `district_name`: `Railay / Phra Nang`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится в beach/limestone-контуре Railay / Phra Nang, но сам по себе не является container-сущностью. Контейнер не нужен.

---

## 8. Tiger Cave Temple
- `slug`: `kbi-tiger-cave-temple`
- `name`: `Tiger Cave Temple`

### Place → District
- `district_slug`: `tiger-cave-foothills`
- `district_name`: `Tiger Cave Foothills`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храмовая и обзорная локация находится вне beach-зон Краби, в temple-and-foothills contour рядом с Krabi Town. Контейнер не нужен.

---

# Summary

## District links
- `kbi-ao-nang-beach` → `ao-nang`
- `kbi-emerald-pool` → `khlong-thom-excursion-zone`
- `kbi-hong-islands` → `hong-islands-excursion-zone`
- `kbi-khao-khanab-nam` → `krabi-town-riverfront`
- `kbi-phi-phi-islands` → `phi-phi-excursion-zone`
- `kbi-railay-beach` → `railay-phra-nang`
- `kbi-the-grotto-restaurant` → `railay-phra-nang`
- `kbi-tiger-cave-temple` → `tiger-cave-foothills`

## Container links
- `kbi-ao-nang-beach` → `ao-nang-beach`
- `kbi-hong-islands` → `hong-islands`
- `kbi-phi-phi-islands` → `phi-phi-islands`
- `kbi-railay-beach` → `railay-beach`

## Places without container
- `kbi-emerald-pool`
- `kbi-khao-khanab-nam`
- `kbi-the-grotto-restaurant`
- `kbi-tiger-cave-temple`
