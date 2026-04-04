# Hanoi Places → Districts / Containers

Этот файл фиксирует связи для **19 мест Ханоя, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `han`

---

## 1. Ba Dinh Square & Ho Chi Minh Mausoleum
- `slug`: `han-ba-dinh-square-ho-chi-minh-mausoleum`
- `name`: `Ba Dinh Square & Ho Chi Minh Mausoleum`

### Place → District
- `district_slug`: `ba-dinh-political-core`
- `district_name`: `Ba Dinh Political Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это главный государственно-монументальный комплекс Ханоя в Ba Dinh. Контейнер не нужен: это already major landmark node.

---

## 2. Bánh Mì 25
- `slug`: `han-banh-mi-25`
- `name`: `Bánh Mì 25`

### Place → District
- `district_slug`: `old-quarter-hoan-kiem`
- `district_name`: `Old Quarter / Hoan Kiem`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Bánh Mì 25 находится на Hàng Cá в сердце Old Quarter / Hoan Kiem food grid. Контейнер не нужен.

---

## 3. Bún Chả Hương Liên
- `slug`: `han-bun-cha-huong-lien`
- `name`: `Bún Chả Hương Liên`

### Place → District
- `district_slug`: `old-quarter-hoan-kiem`
- `district_name`: `Old Quarter / Hoan Kiem`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: operationally привязан к центральному food contour Ханоя. Для текущего Atlas слоя контейнер не нужен.

---

## 4. Cà Phê Giảng
- `slug`: `han-ca-phe-giang`
- `name`: `Cà Phê Giảng`

### Place → District
- `district_slug`: `old-quarter-hoan-kiem`
- `district_name`: `Old Quarter / Hoan Kiem`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: egg coffee landmark живёт в историческом core у Hoan Kiem / old streets. Контейнер не нужен.

---

## 5. Chợ Đồng Xuân
- `slug`: `han-cho-ong-xuan`
- `name`: `Chợ Đồng Xuân`

### Place → District
- `district_slug`: `old-quarter-hoan-kiem`
- `district_name`: `Old Quarter / Hoan Kiem`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Dong Xuan Market — ключевой market node северной части Old Quarter. Контейнер не нужен.

---

## 6. Cong Caphe
- `slug`: `han-cong-caphe`
- `name`: `Cong Caphe`

### Place → District
- `district_slug`: `old-quarter-hoan-kiem`
- `district_name`: `Old Quarter / Hoan Kiem`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: для текущего Atlas mapping бренд operationally привязан к central Old Quarter / Hoan Kiem café layer. Отдельный branch-level слой пока не вводим.

---

## 7. Flag Tower of Hanoi
- `slug`: `han-flag-tower-of-hanoi`
- `name`: `Flag Tower of Hanoi`

### Place → District
- `district_slug`: `ba-dinh-political-core`
- `district_name`: `Ba Dinh Political Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: входит в главный Ba Dinh civic-historical contour рядом с military/history landmarks. Контейнер не нужен.

---

## 8. Hidden Gem Café
- `slug`: `han-hidden-gem-cafe`
- `name`: `Hidden Gem Café`

### Place → District
- `district_slug`: `west-lake-truc-bach`
- `district_name`: `West Lake / Truc Bach`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: operationally отнесён к north-west relaxed café contour вне старого ядра. Контейнер не нужен.

---

## 9. Hoa Lo Prison
- `slug`: `han-hoa-lo-prison`
- `name`: `Hoa Lo Prison`

### Place → District
- `district_slug`: `french-quarter-tran-hung-dao`
- `district_name`: `French Quarter / Tran Hung Dao`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Hoa Lo живёт в более просторном colonial / civic contour к юго-востоку от Hoan Kiem. Контейнер не нужен.

---

## 10. Hoan Kiem Lake & Ngoc Son Temple
- `slug`: `han-hoan-kiem-lake-ngoc-son-temple`
- `name`: `Hoan Kiem Lake & Ngoc Son Temple`

### Place → District
- `district_slug`: `old-quarter-hoan-kiem`
- `district_name`: `Old Quarter / Hoan Kiem`

### Place → Container
- `container_slug`: `hoan-kiem-lake`
- `container_name`: `Hoan Kiem Lake`

Пояснение: это не одна точка, а центральный lake-and-landmark cluster Ханоя. Поэтому нужен container.

---

## 11. Nhà Hàng Ngon
- `slug`: `han-nha-hang-ngon`
- `name`: `Nhà Hàng Ngon`

### Place → District
- `district_slug`: `french-quarter-tran-hung-dao`
- `district_name`: `French Quarter / Tran Hung Dao`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: restaurant lives in the French Quarter / Tran Hung Dao contour rather than in the tight Old Quarter grid. Контейнер не нужен.

---

## 12. Night Market
- `slug`: `han-night-market`
- `name`: `Night Market`

### Place → District
- `district_slug`: `old-quarter-hoan-kiem`
- `district_name`: `Old Quarter / Hoan Kiem`

### Place → Container
- `container_slug`: `hanoi-night-market`
- `container_name`: `Hanoi Night Market`

Пояснение: это market-corridor, а не одиночная точка. Поэтому нужен container.

---

## 13. Old Quarter
- `slug`: `han-old-quarter`
- `name`: `Old Quarter`

### Place → District
- `district_slug`: `old-quarter-hoan-kiem`
- `district_name`: `Old Quarter / Hoan Kiem`

### Place → Container
- `container_slug`: `hanoi-old-quarter`
- `container_name`: `Hanoi Old Quarter`

Пояснение: это whole urban-quarter cluster, поэтому он должен жить и как place, и как container.

---

## 14. One Pillar Pagoda
- `slug`: `han-one-pillar-pagoda`
- `name`: `One Pillar Pagoda`

### Place → District
- `district_slug`: `ba-dinh-political-core`
- `district_name`: `Ba Dinh Political Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: пагода находится в Ba Dinh monumental core near mausoleum complex. Контейнер не нужен.

---

## 15. Phở Gia Truyền Bát Đàn
- `slug`: `han-pho-gia-truyen-bat-an`
- `name`: `Phở Gia Truyền Bát Đàn`

### Place → District
- `district_slug`: `old-quarter-hoan-kiem`
- `district_name`: `Old Quarter / Hoan Kiem`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: classic phở address in the Old Quarter food network. Контейнер не нужен.

---

## 16. Quán Ăn Ngon
- `slug`: `han-quan-an-ngon`
- `name`: `Quán Ăn Ngon`

### Place → District
- `district_slug`: `french-quarter-tran-hung-dao`
- `district_name`: `French Quarter / Tran Hung Dao`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: address on Phan Bội Châu fits the French Quarter / Tran Hung Dao contour. Контейнер не нужен.

---

## 17. Quan Thanh Temple
- `slug`: `han-quan-thanh-temple`
- `name`: `Quan Thanh Temple`

### Place → District
- `district_slug`: `west-lake-truc-bach`
- `district_name`: `West Lake / Truc Bach`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: temple belongs to the West Lake / Truc Bach historical-lake edge, not to the Old Quarter core. Контейнер не нужен.

---

## 18. St. Joseph’s Cathedral
- `slug`: `han-st-joseph-s-cathedral`
- `name`: `St. Joseph’s Cathedral`

### Place → District
- `district_slug`: `old-quarter-hoan-kiem`
- `district_name`: `Old Quarter / Hoan Kiem`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: cathedral lives in the Hoan Kiem central old-city contour near the lake and café quarter. Контейнер не нужен.

---

## 19. West Lake
- `slug`: `han-west-lake`
- `name`: `West Lake`

### Place → District
- `district_slug`: `west-lake-truc-bach`
- `district_name`: `West Lake / Truc Bach`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: несмотря на крупный масштаб объекта, на текущем этапе отдельный container не обязателен; само место уже представляет whole scenic lake destination.

---

# Summary

## District links
- `han-ba-dinh-square-ho-chi-minh-mausoleum` → `ba-dinh-political-core`
- `han-banh-mi-25` → `old-quarter-hoan-kiem`
- `han-bun-cha-huong-lien` → `old-quarter-hoan-kiem`
- `han-ca-phe-giang` → `old-quarter-hoan-kiem`
- `han-cho-ong-xuan` → `old-quarter-hoan-kiem`
- `han-cong-caphe` → `old-quarter-hoan-kiem`
- `han-flag-tower-of-hanoi` → `ba-dinh-political-core`
- `han-hidden-gem-cafe` → `west-lake-truc-bach`
- `han-hoa-lo-prison` → `french-quarter-tran-hung-dao`
- `han-hoan-kiem-lake-ngoc-son-temple` → `old-quarter-hoan-kiem`
- `han-nha-hang-ngon` → `french-quarter-tran-hung-dao`
- `han-night-market` → `old-quarter-hoan-kiem`
- `han-old-quarter` → `old-quarter-hoan-kiem`
- `han-one-pillar-pagoda` → `ba-dinh-political-core`
- `han-pho-gia-truyen-bat-an` → `old-quarter-hoan-kiem`
- `han-quan-an-ngon` → `french-quarter-tran-hung-dao`
- `han-quan-thanh-temple` → `west-lake-truc-bach`
- `han-st-joseph-s-cathedral` → `old-quarter-hoan-kiem`
- `han-west-lake` → `west-lake-truc-bach`

## Container links
- `han-hoan-kiem-lake-ngoc-son-temple` → `hoan-kiem-lake`
- `han-night-market` → `hanoi-night-market`
- `han-old-quarter` → `hanoi-old-quarter`

## Places without container
- `han-ba-dinh-square-ho-chi-minh-mausoleum`
- `han-banh-mi-25`
- `han-bun-cha-huong-lien`
- `han-ca-phe-giang`
- `han-cho-ong-xuan`
- `han-cong-caphe`
- `han-flag-tower-of-hanoi`
- `han-hidden-gem-cafe`
- `han-hoa-lo-prison`
- `han-nha-hang-ngon`
- `han-one-pillar-pagoda`
- `han-pho-gia-truyen-bat-an`
- `han-quan-an-ngon`
- `han-quan-thanh-temple`
- `han-st-joseph-s-cathedral`
- `han-west-lake`
