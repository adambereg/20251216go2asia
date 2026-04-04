# Phu Quoc Places → Districts / Containers

Этот файл фиксирует связи для **19 мест Фукуока, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `phu`

---

## 1. Bánh Canh Chả Cá Ông Hai
- `slug`: `phu-banh-canh-cha-ca-ong-hai`
- `name`: `Bánh Canh Chả Cá Ông Hai`

### Place → District
- `district_slug`: `duong-dong-dinh-cau-core`
- `district_name`: `Duong Dong / Dinh Cau Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: локальная food-точка в наиболее понятном central Dương Đông / market-side urban contour. Контейнер не нужен.

---

## 2. Dinh Cậu Temple
- `slug`: `phu-dinh-cau-temple`
- `name`: `Dinh Cậu Temple`

### Place → District
- `district_slug`: `duong-dong-dinh-cau-core`
- `district_name`: `Duong Dong / Dinh Cau Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храм стоит у Dinh Cau headland в Dương Đông и логично относится к центральному harbour-town core. Контейнер не нужен.

---

## 3. Fish Sauce Factory
- `slug`: `phu-fish-sauce-factory`
- `name`: `Fish Sauce Factory`

### Place → District
- `district_slug`: `duong-dong-dinh-cau-core`
- `district_name`: `Duong Dong / Dinh Cau Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: традиционный factory-case логично живёт в центральном Dương Đông layer, а не в resort beach zone. Контейнер не нужен.

---

## 4. Gành Dầu Crab Market
- `slug`: `phu-ganh-dau-crab-market`
- `name`: `Gành Dầu Crab Market`

### Place → District
- `district_slug`: `ganh-dau-bai-dai-northwest`
- `district_name`: `Ganh Dau / Bai Dai Northwest`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это северо-западный seafood village case в Gành Dầu. Контейнер не нужен.

---

## 5. Hon Thom Cable Car
- `slug`: `phu-hon-thom-cable-car`
- `name`: `Hon Thom Cable Car`

### Place → District
- `district_slug`: `an-thoi-hon-thom-south`
- `district_name`: `An Thoi / Hon Thom South`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: cable car terminal и весь attraction-layer привязаны к An Thoi / south-island gateway. Контейнер не нужен на текущем этапе.

---

## 6. Long Beach
- `slug`: `phu-long-beach`
- `name`: `Long Beach`

### Place → District
- `district_slug`: `long-beach-tran-hung-dao`
- `district_name`: `Long Beach / Tran Hung Dao`

### Place → Container
- `container_slug`: `long-beach-phu-quoc`
- `container_name`: `Long Beach Phu Quoc`

Пояснение: это не точка, а длинный west-coast beachfront cluster. Поэтому нужен container.

---

## 7. Luna Rossa
- `slug`: `phu-luna-rossa`
- `name`: `Luna Rossa`

### Place → District
- `district_slug`: `long-beach-tran-hung-dao`
- `district_name`: `Long Beach / Tran Hung Dao`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: operationally это resort dining case в Long Beach / Tran Hung Dao contour. Контейнер не нужен.

---

## 8. Ốc 343
- `slug`: `phu-oc-343`
- `name`: `Ốc 343`

### Place → District
- `district_slug`: `duong-dong-dinh-cau-core`
- `district_name`: `Duong Dong / Dinh Cau Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: local seafood case логично относится к центральному Dương Đông urban food contour. Контейнер не нужен.

---

## 9. Ong Lang Beach
- `slug`: `phu-ong-lang-beach`
- `name`: `Ong Lang Beach`

### Place → District
- `district_slug`: `ong-lang-cua-duong`
- `district_name`: `Ong Lang / Cua Duong`

### Place → Container
- `container_slug`: `ong-lang-beach`
- `container_name`: `Ong Lang Beach`

Пояснение: это самостоятельный north-west coast beach cluster, а не одиночная точка. Поэтому нужен container.

---

## 10. Phu Quoc National Park
- `slug`: `phu-phu-quoc-national-park`
- `name`: `Phu Quoc National Park`

### Place → District
- `district_slug`: `phu-quoc-national-park-interior`
- `district_name`: `Phu Quoc National Park Interior`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это большая природная сущность внутренней части острова. Контейнер не нужен.

---

## 11. Phu Quoc Night Market
- `slug`: `phu-phu-quoc-night-market`
- `name`: `Phu Quoc Night Market`

### Place → District
- `district_slug`: `duong-dong-dinh-cau-core`
- `district_name`: `Duong Dong / Dinh Cau Core`

### Place → Container
- `container_slug`: `phu-quoc-night-market`
- `container_name`: `Phu Quoc Night Market`

Пояснение: это evening market cluster в Dương Đông, а не одна точка. Поэтому нужен container.

---

## 12. Phu Quoc Prison
- `slug`: `phu-phu-quoc-prison`
- `name`: `Phu Quoc Prison`

### Place → District
- `district_slug`: `an-thoi-hon-thom-south`
- `district_name`: `An Thoi / Hon Thom South`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: мемориальная локация южной части острова у дороги в сторону An Thoi / Sao Beach. Контейнер не нужен.

---

## 13. PhuongBinh Restaurant
- `slug`: `phu-phuongbinh-restaurant`
- `name`: `PhuongBinh Restaurant`

### Place → District
- `district_slug`: `long-beach-tran-hung-dao`
- `district_name`: `Long Beach / Tran Hung Dao`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: beachfront dining case в south-west resort belt. Контейнер не нужен.

---

## 14. Rory’s Beach Bar
- `slug`: `phu-rory-s-beach-bar`
- `name`: `Rory’s Beach Bar`

### Place → District
- `district_slug`: `long-beach-tran-hung-dao`
- `district_name`: `Long Beach / Tran Hung Dao`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: бар и sunset spot логично живёт в west-coast beach/resort contour. Контейнер не нужен.

---

## 15. Sao Beach
- `slug`: `phu-sao-beach`
- `name`: `Sao Beach`

### Place → District
- `district_slug`: `an-thoi-hon-thom-south`
- `district_name`: `An Thoi / Hon Thom South`

### Place → Container
- `container_slug`: `sao-beach`
- `container_name`: `Sao Beach`

Пояснение: это самостоятельный iconic south-beach cluster, а не одна точка. Поэтому нужен container.

---

## 16. Shimmer Restaurant
- `slug`: `phu-shimmer-restaurant`
- `name`: `Shimmer Restaurant`

### Place → District
- `district_slug`: `ong-lang-cua-duong`
- `district_name`: `Ong Lang / Cua Duong`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: operationally это более спокойный north-west coast dining case. Контейнер не нужен.

---

## 17. The Pepper Tree
- `slug`: `phu-the-pepper-tree`
- `name`: `The Pepper Tree`

### Place → District
- `district_slug`: `long-beach-tran-hung-dao`
- `district_name`: `Long Beach / Tran Hung Dao`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: fine-dining case у La Veranda на Trần Hưng Đạo / Dương Đông resort belt. Контейнер не нужен.

---

## 18. Đường Bàng Night Market
- `slug`: `phu-uong-bang-night-market`
- `name`: `Đường Bàng Night Market`

### Place → District
- `district_slug`: `duong-dong-dinh-cau-core`
- `district_name`: `Duong Dong / Dinh Cau Core`

### Place → Container
- `container_slug`: `phu-quoc-night-market`
- `container_name`: `Phu Quoc Night Market`

Пояснение: operationally это night-market case центрального Dương Đông cluster. Поэтому place логично живёт внутри market container.

---

## 19. Vinpearl Safari & Grand World
- `slug`: `phu-vinpearl-safari-grand-world`
- `name`: `Vinpearl Safari & Grand World`

### Place → District
- `district_slug`: `ganh-dau-bai-dai-northwest`
- `district_name`: `Ganh Dau / Bai Dai Northwest`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это уже крупная integrated attraction/entity северо-западного leisure zone, поэтому отдельный container не обязателен.

---

# Summary

## District links
- `phu-banh-canh-cha-ca-ong-hai` → `duong-dong-dinh-cau-core`
- `phu-dinh-cau-temple` → `duong-dong-dinh-cau-core`
- `phu-fish-sauce-factory` → `duong-dong-dinh-cau-core`
- `phu-ganh-dau-crab-market` → `ganh-dau-bai-dai-northwest`
- `phu-hon-thom-cable-car` → `an-thoi-hon-thom-south`
- `phu-long-beach` → `long-beach-tran-hung-dao`
- `phu-luna-rossa` → `long-beach-tran-hung-dao`
- `phu-oc-343` → `duong-dong-dinh-cau-core`
- `phu-ong-lang-beach` → `ong-lang-cua-duong`
- `phu-phu-quoc-national-park` → `phu-quoc-national-park-interior`
- `phu-phu-quoc-night-market` → `duong-dong-dinh-cau-core`
- `phu-phu-quoc-prison` → `an-thoi-hon-thom-south`
- `phu-phuongbinh-restaurant` → `long-beach-tran-hung-dao`
- `phu-rory-s-beach-bar` → `long-beach-tran-hung-dao`
- `phu-sao-beach` → `an-thoi-hon-thom-south`
- `phu-shimmer-restaurant` → `ong-lang-cua-duong`
- `phu-the-pepper-tree` → `long-beach-tran-hung-dao`
- `phu-uong-bang-night-market` → `duong-dong-dinh-cau-core`
- `phu-vinpearl-safari-grand-world` → `ganh-dau-bai-dai-northwest`

## Container links
- `phu-long-beach` → `long-beach-phu-quoc`
- `phu-ong-lang-beach` → `ong-lang-beach`
- `phu-phu-quoc-night-market` → `phu-quoc-night-market`
- `phu-sao-beach` → `sao-beach`
- `phu-uong-bang-night-market` → `phu-quoc-night-market`

## Places without container
- `phu-banh-canh-cha-ca-ong-hai`
- `phu-dinh-cau-temple`
- `phu-fish-sauce-factory`
- `phu-ganh-dau-crab-market`
- `phu-hon-thom-cable-car`
- `phu-luna-rossa`
- `phu-oc-343`
- `phu-phu-quoc-national-park`
- `phu-phu-quoc-prison`
- `phu-phuongbinh-restaurant`
- `phu-rory-s-beach-bar`
- `phu-shimmer-restaurant`
- `phu-the-pepper-tree`
- `phu-vinpearl-safari-grand-world`
