# Da Lat Places → Districts / Containers

Этот файл фиксирует связи для **23 мест Далата, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `dla`

---

## 1. An Cafe
- `slug`: `dla-an-cafe`
- `name`: `An Cafe`

### Place → District
- `district_slug`: `xuan-huong-market-core`
- `district_name`: `Xuan Huong / Market Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: кафе находится на 3 Tháng 2 / Ward 1 в walkable центральном контуре Далата, рядом с market-and-lake core. Контейнер не нужен. 

---

## 2. Bao Dai Palace III
- `slug`: `dla-bao-dai-palace-iii`
- `name`: `Bao Dai Palace III`

### Place → District
- `district_slug`: `palaces-cathedral-hills`
- `district_name`: `Palaces / Cathedral Hills`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: исторический palace-stop живёт в southern/heritage hills contour рядом с Crazy House и cathedral layer. Контейнер не нужен.

---

## 3. Cam Ly Waterfall
- `slug`: `dla-cam-ly-waterfall`
- `name`: `Cam Ly Waterfall`

### Place → District
- `district_slug`: `cam-ly-west-hills`
- `district_name`: `Cam Ly West Hills`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: водопад находится к западу от city core и логично живёт в коротком western-outskirts cluster, а не в postcard центре. Контейнер не нужен.

---

## 4. Crazy House
- `slug`: `dla-crazy-house`
- `name`: `Crazy House`

### Place → District
- `district_slug`: `palaces-cathedral-hills`
- `district_name`: `Palaces / Cathedral Hills`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Crazy House лежит в том же heritage-hills contour, что и Bao Dai Palace III. Контейнер не нужен.

---

## 5. Dalat Cathedral
- `slug`: `dla-dalat-cathedral`
- `name`: `Dalat Cathedral`

### Place → District
- `district_slug`: `palaces-cathedral-hills`
- `district_name`: `Palaces / Cathedral Hills`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: cathedral layer относится к юго-западному heritage contour над центром. Контейнер не нужен.

---

## 6. Dalat Flower Garden
- `slug`: `dla-dalat-flower-garden`
- `name`: `Dalat Flower Garden`

### Place → District
- `district_slug`: `north-lake-gardens`
- `district_name`: `North Lake Gardens`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Flower Garden находится на Phu Dong Thien Vuong next to Xuan Huong Lake и относится к северному garden-scenic contour. Контейнер не нужен.

---

## 7. Dalat Market
- `slug`: `dla-dalat-market`
- `name`: `Dalat Market`

### Place → District
- `district_slug`: `xuan-huong-market-core`
- `district_name`: `Xuan Huong / Market Core`

### Place → Container
- `container_slug`: `dalat-market`
- `container_name`: `Dalat Market`

Пояснение: это самостоятельный central market-cluster города, а не просто одна торговая точка.

---

## 8. Dalat Night Market
- `slug`: `dla-dalat-night-market`
- `name`: `Dalat Night Market`

### Place → District
- `district_slug`: `xuan-huong-market-core`
- `district_name`: `Xuan Huong / Market Core`

### Place → Container
- `container_slug`: `dalat-night-market`
- `container_name`: `Dalat Night Market`

Пояснение: night market — это целый вечерний corridor-кластер в центре Далата.

---

## 9. Dalat Pine Viewpoints
- `slug`: `dla-dalat-pine-viewpoints`
- `name`: `Dalat Pine Viewpoints`

### Place → District
- `district_slug`: `north-lake-gardens`
- `district_name`: `North Lake Gardens`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: viewpoints логично живут в северном scenic-and-pine contour рядом с Flower Garden / Valley of Love axis. Контейнер не нужен.

---

## 10. Dalat Railway Station
- `slug`: `dla-dalat-railway-station`
- `name`: `Dalat Railway Station`

### Place → District
- `district_slug`: `station-trai-mat-east`
- `district_name`: `Station / Trai Mat East`

### Place → Container
- `container_slug`: `dalat-railway-station`
- `container_name`: `Dalat Railway Station`

Пояснение: это полноценный railway heritage cluster и gateway к Trại Mát.

---

## 11. Datanla Waterfall
- `slug`: `dla-datanla-waterfall`
- `name`: `Datanla Waterfall`

### Place → District
- `district_slug`: `tuyen-lam-south-excursion-zone`
- `district_name`: `Tuyen Lam South Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Datanla традиционно живёт в southern excursion contour вместе с Truc Lam и Tuyen Lam access. Контейнер не нужен.

---

## 12. Domaine de Marie
- `slug`: `dla-domaine-de-marie`
- `name`: `Domaine de Marie`

### Place → District
- `district_slug`: `palaces-cathedral-hills`
- `district_name`: `Palaces / Cathedral Hills`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: церковь находится на Ngô Quyền примерно в 1 км southwest of center и хорошо ложится в heritage-hills contour. Контейнер не нужен.

---

## 13. Hồ Xuân Hương
- `slug`: `dla-ho-xuan-huong`
- `name`: `Hồ Xuân Hương`

### Place → District
- `district_slug`: `xuan-huong-market-core`
- `district_name`: `Xuan Huong / Market Core`

### Place → Container
- `container_slug`: `xuan-huong-lake`
- `container_name`: `Xuan Huong Lake`

Пояснение: lakefront — самостоятельный urban-lakefront cluster в сердце города.

---

## 14. L’angfarm
- `slug`: `dla-l-angfarm`
- `name`: `L’angfarm`

### Place → District
- `district_slug`: `xuan-huong-market-core`
- `district_name`: `Xuan Huong / Market Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: брендовый snack/store-case логично живёт в market-and-night-market core. Контейнер не нужен.

---

## 15. La Viet Coffee
- `slug`: `dla-la-viet-coffee`
- `name`: `La Viet Coffee`

### Place → District
- `district_slug`: `station-trai-mat-east`
- `district_name`: `Station / Trai Mat East`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: branch logic и адреса La Viet в Ward 8 / Ward 9 тянут место в eastern contour, ближе к railway / eastern city layer, а не в market core. Контейнер не нужен.

---

## 16. Lam Dong Museum
- `slug`: `dla-lam-dong-museum`
- `name`: `Lam Dong Museum`

### Place → District
- `district_slug`: `station-trai-mat-east`
- `district_name`: `Station / Trai Mat East`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: museum логично живёт в eastern cultural layer рядом с railway / Trại Mát axis. Контейнер не нужен.

---

## 17. Lien Hoa Bakery & Restaurant
- `slug`: `dla-lien-hoa-bakery-restaurant`
- `name`: `Lien Hoa Bakery & Restaurant`

### Place → District
- `district_slug`: `xuan-huong-market-core`
- `district_name`: `Xuan Huong / Market Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это классический central city food stop, ближе к market-and-lake core. Контейнер не нужен.

---

## 18. Linh Phước Pagoda
- `slug`: `dla-linh-phuoc-pagoda`
- `name`: `Linh Phước Pagoda`

### Place → District
- `district_slug`: `station-trai-mat-east`
- `district_name`: `Station / Trai Mat East`

### Place → Container
- `container_slug`: `linh-phuoc-pagoda`
- `container_name`: `Linh Phuoc Pagoda`

Пояснение: это самостоятельный temple-complex в Trại Mát, а не просто одна точка.

---

## 19. Maze Bar
- `slug`: `dla-maze-bar`
- `name`: `Maze Bar`

### Place → District
- `district_slug`: `xuan-huong-market-core`
- `district_name`: `Xuan Huong / Market Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: nightlife/late-evening venue логично живёт в central market core. Контейнер не нужен.

---

## 20. Nem nướng Bà Hùng
- `slug`: `dla-nem-nuong-ba-hung`
- `name`: `Nem nướng Bà Hùng`

### Place → District
- `district_slug`: `xuan-huong-market-core`
- `district_name`: `Xuan Huong / Market Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это central-city food stop в логике current Atlas mapping. Контейнер не нужен.

---

## 21. Trúc Lâm Zen Monastery
- `slug`: `dla-truc-lam-zen-monastery`
- `name`: `Trúc Lâm Zen Monastery`

### Place → District
- `district_slug`: `tuyen-lam-south-excursion-zone`
- `district_name`: `Tuyen Lam South Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: монастырь расположен near Tuyen Lam Lake около 6 км from center и явно живёт в southern excursion zone. Контейнер не нужен.

---

## 22. Tuyền Lâm Lake
- `slug`: `dla-tuyen-lam-lake`
- `name`: `Tuyền Lâm Lake`

### Place → District
- `district_slug`: `tuyen-lam-south-excursion-zone`
- `district_name`: `Tuyen Lam South Excursion Zone`

### Place → Container
- `container_slug`: `tuyen-lam-lake`
- `container_name`: `Tuyen Lam Lake`

Пояснение: lake-and-pine zone — это самостоятельный southern excursion cluster.

---

## 23. Valley of Love
- `slug`: `dla-valley-of-love`
- `name`: `Valley of Love`

### Place → District
- `district_slug`: `north-lake-gardens`
- `district_name`: `North Lake Gardens`

### Place → Container
- `container_slug`: `valley-of-love`
- `container_name`: `Valley of Love`

Пояснение: это крупный scenic-park cluster северной части Далата, а не одиночная точка.

---

# Summary

## District links
- `dla-an-cafe` → `xuan-huong-market-core`
- `dla-bao-dai-palace-iii` → `palaces-cathedral-hills`
- `dla-cam-ly-waterfall` → `cam-ly-west-hills`
- `dla-crazy-house` → `palaces-cathedral-hills`
- `dla-dalat-cathedral` → `palaces-cathedral-hills`
- `dla-dalat-flower-garden` → `north-lake-gardens`
- `dla-dalat-market` → `xuan-huong-market-core`
- `dla-dalat-night-market` → `xuan-huong-market-core`
- `dla-dalat-pine-viewpoints` → `north-lake-gardens`
- `dla-dalat-railway-station` → `station-trai-mat-east`
- `dla-datanla-waterfall` → `tuyen-lam-south-excursion-zone`
- `dla-domaine-de-marie` → `palaces-cathedral-hills`
- `dla-ho-xuan-huong` → `xuan-huong-market-core`
- `dla-l-angfarm` → `xuan-huong-market-core`
- `dla-la-viet-coffee` → `station-trai-mat-east`
- `dla-lam-dong-museum` → `station-trai-mat-east`
- `dla-lien-hoa-bakery-restaurant` → `xuan-huong-market-core`
- `dla-linh-phuoc-pagoda` → `station-trai-mat-east`
- `dla-maze-bar` → `xuan-huong-market-core`
- `dla-nem-nuong-ba-hung` → `xuan-huong-market-core`
- `dla-truc-lam-zen-monastery` → `tuyen-lam-south-excursion-zone`
- `dla-tuyen-lam-lake` → `tuyen-lam-south-excursion-zone`
- `dla-valley-of-love` → `north-lake-gardens`

## Container links
- `dla-dalat-market` → `dalat-market`
- `dla-dalat-night-market` → `dalat-night-market`
- `dla-dalat-railway-station` → `dalat-railway-station`
- `dla-ho-xuan-huong` → `xuan-huong-lake`
- `dla-linh-phuoc-pagoda` → `linh-phuoc-pagoda`
- `dla-tuyen-lam-lake` → `tuyen-lam-lake`
- `dla-valley-of-love` → `valley-of-love`

## Places without container
- `dla-an-cafe`
- `dla-bao-dai-palace-iii`
- `dla-cam-ly-waterfall`
- `dla-crazy-house`
- `dla-dalat-cathedral`
- `dla-dalat-flower-garden`
- `dla-dalat-pine-viewpoints`
- `dla-datanla-waterfall`
- `dla-domaine-de-marie`
- `dla-l-angfarm`
- `dla-la-viet-coffee`
- `dla-lam-dong-museum`
- `dla-lien-hoa-bakery-restaurant`
- `dla-maze-bar`
- `dla-nem-nuong-ba-hung`
- `dla-truc-lam-zen-monastery`
