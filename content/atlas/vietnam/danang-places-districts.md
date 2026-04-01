# Da Nang Places → Districts / Containers

Этот файл фиксирует связи для **20 мест Дананга, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `dad`

---

## 1. 43 Factory Coffee Roaster
- `slug`: `dad-43-factory-coffee-roaster`
- `name`: `43 Factory Coffee Roaster`

### Place → District
- `district_slug`: `my-khe-phuoc-my-coast`
- `district_name`: `My Khe / Phuoc My Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: текущая flagship-локация бренда находится в Mỹ An / Ngũ Hành Sơn, то есть в прибрежном beachside-contour юго-восточнее центра. Контейнер не нужен.

---

## 2. Bé Mặn Seafood
- `slug`: `dad-be-man-seafood`
- `name`: `Bé Mặn Seafood`

### Place → District
- `district_slug`: `my-khe-phuoc-my-coast`
- `district_name`: `My Khe / Phuoc My Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: seafood-контур на Võ Nguyên Giáp в Son Trà / Phước Mỹ логично относится к городскому coastal layer у My Khe. Контейнер не нужен. citeturn411823search0

---

## 3. Cham Sculpture Museum
- `slug`: `dad-cham-sculpture-museum`
- `name`: `Cham Sculpture Museum`

### Place → District
- `district_slug`: `han-river-hai-chau-core`
- `district_name`: `Han River / Hai Chau Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: музей находится в центральной городской зоне у Han River и Dragon Bridge approach. Контейнер не нужен.

---

## 4. Con Market
- `slug`: `dad-con-market`
- `name`: `Con Market`

### Place → District
- `district_slug`: `han-river-hai-chau-core`
- `district_name`: `Han River / Hai Chau Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Con Market находится на Hùng Vương / Hải Châu и является частью центрального food-and-market core Дананга. Контейнер не нужен. citeturn411823search7

---

## 5. Cộng Cà Phê
- `slug`: `dad-cong-ca-phe`
- `name`: `Cộng Cà Phê`

### Place → District
- `district_slug`: `han-river-hai-chau-core`
- `district_name`: `Han River / Hai Chau Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: для текущего Atlas mapping бренд operationally привязан к walkable central Danang coffee layer вокруг Hai Chau / riverfront. Контейнер не нужен.

---

## 6. Dragon Bridge
- `slug`: `dad-dragon-bridge`
- `name`: `Dragon Bridge`

### Place → District
- `district_slug`: `han-river-hai-chau-core`
- `district_name`: `Han River / Hai Chau Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: главный городской мост и night landmark Danang core у Han River. Контейнер не нужен.

---

## 7. Golden Bridge
- `slug`: `dad-golden-bridge`
- `name`: `Golden Bridge`

### Place → District
- `district_slug`: `ba-na-hills-excursion-zone`
- `district_name`: `Ba Na Hills Excursion Zone`

### Place → Container
- `container_slug`: `ba-na-hills`
- `container_name`: `Ba Na Hills`

Пояснение: Golden Bridge — iconic landmark внутри более крупного Ba Na Hills cluster, поэтому place логично привязан и к district, и к container.

---

## 8. Han Market
- `slug`: `dad-han-market`
- `name`: `Han Market`

### Place → District
- `district_slug`: `han-river-hai-chau-core`
- `district_name`: `Han River / Hai Chau Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Han Market находится на Trần Phú / Hải Châu в самом центре города. Контейнер не нужен. citeturn411823search7

---

## 9. Han River Bridge
- `slug`: `dad-han-river-bridge`
- `name`: `Han River Bridge`

### Place → District
- `district_slug`: `han-river-hai-chau-core`
- `district_name`: `Han River / Hai Chau Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это центральный городской bridge-landmark в Han River core. Контейнер не нужен.

---

## 10. La Maison 1888
- `slug`: `dad-la-maison-1888`
- `name`: `La Maison 1888`

### Place → District
- `district_slug`: `son-tra-peninsula-east`
- `district_name`: `Son Tra Peninsula East`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится в InterContinental Danang Sun Peninsula Resort на Son Trà Peninsula. Контейнер не нужен. citeturn973531search21

---

## 11. Linh Ứng Pagoda
- `slug`: `dad-linh-ung-pagoda`
- `name`: `Linh Ứng Pagoda`

### Place → District
- `district_slug`: `son-tra-peninsula-east`
- `district_name`: `Son Tra Peninsula East`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храм связан с Son Trà peninsula scenic contour и viewpoint-слоем над морем. Контейнер не нужен.

---

## 12. Madame Lân
- `slug`: `dad-madame-lan`
- `name`: `Madame Lân`

### Place → District
- `district_slug`: `han-river-hai-chau-core`
- `district_name`: `Han River / Hai Chau Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится на 04 Bạch Đằng в Hai Chau Ward у Han River. Контейнер не нужен. citeturn973531search6

---

## 13. Marble Mountains
- `slug`: `dad-marble-mountains`
- `name`: `Marble Mountains`

### Place → District
- `district_slug`: `ngu-hanh-son-non-nuoc`
- `district_name`: `Ngu Hanh Son / Non Nuoc`

### Place → Container
- `container_slug`: `marble-mountains`
- `container_name`: `Marble Mountains`

Пояснение: это самостоятельный heritage-nature cluster, поэтому place логично живёт как container-сущность.

---

## 14. My Khe Beach
- `slug`: `dad-my-khe-beach`
- `name`: `My Khe Beach`

### Place → District
- `district_slug`: `my-khe-phuoc-my-coast`
- `district_name`: `My Khe / Phuoc My Coast`

### Place → Container
- `container_slug`: `my-khe-beach`
- `container_name`: `My Khe Beach`

Пояснение: это не одна точка, а длинный городской beachfront, поэтому нужен container.

---

## 15. Non Nuoc Beach
- `slug`: `dad-non-nuoc-beach`
- `name`: `Non Nuoc Beach`

### Place → District
- `district_slug`: `ngu-hanh-son-non-nuoc`
- `district_name`: `Ngu Hanh Son / Non Nuoc`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: пляж относится к более спокойному coastal contour у Marble Mountains. На текущем этапе отдельный container не нужен.

---

## 16. Sky36
- `slug`: `dad-sky36`
- `name`: `Sky36`

### Place → District
- `district_slug`: `han-river-hai-chau-core`
- `district_name`: `Han River / Hai Chau Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: бар находится в Novotel Danang Premier Han River на Bạch Đằng / Hai Châu. Контейнер не нужен. citeturn411823search2turn411823search6

---

## 17. Son Tra Night Market
- `slug`: `dad-son-tra-night-market`
- `name`: `Son Tra Night Market`

### Place → District
- `district_slug`: `my-khe-phuoc-my-coast`
- `district_name`: `My Khe / Phuoc My Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: night market находится у восточного берега Han River рядом с Dragon Bridge / An Hai Tay и operationally ближе к coastal-tourist layer Son Trà / Phước Mỹ, чем к Hai Chau core. Контейнер не нужен. citeturn973531search3

---

## 18. Son Tra Peninsula
- `slug`: `dad-son-tra-peninsula`
- `name`: `Son Tra Peninsula`

### Place → District
- `district_slug`: `son-tra-peninsula-east`
- `district_name`: `Son Tra Peninsula East`

### Place → Container
- `container_slug`: `son-tra-peninsula`
- `container_name`: `Son Tra Peninsula`

Пояснение: это самостоятельный scenic peninsula-cluster, поэтому нужен container.

---

## 19. Sun World Ba Na Hills
- `slug`: `dad-sun-world-ba-na-hills`
- `name`: `Sun World Ba Na Hills`

### Place → District
- `district_slug`: `ba-na-hills-excursion-zone`
- `district_name`: `Ba Na Hills Excursion Zone`

### Place → Container
- `container_slug`: `ba-na-hills`
- `container_name`: `Ba Na Hills`

Пояснение: park-scale mountain attraction внутри Ba Na Hills cluster, поэтому place привязан и к district, и к container.

---

## 20. Waterfront Danang
- `slug`: `dad-waterfront-danang`
- `name`: `Waterfront Danang`

### Place → District
- `district_slug`: `han-river-hai-chau-core`
- `district_name`: `Han River / Hai Chau Core`

### Place → Container
- `container_slug`: `han-river-waterfront`
- `container_name`: `Han River Waterfront`

Пояснение: заведение стоит на Han River в city centre и логично живёт внутри riverfront-cluster. citeturn411823search1

---

# Summary

## District links
- `dad-43-factory-coffee-roaster` → `my-khe-phuoc-my-coast`
- `dad-be-man-seafood` → `my-khe-phuoc-my-coast`
- `dad-cham-sculpture-museum` → `han-river-hai-chau-core`
- `dad-con-market` → `han-river-hai-chau-core`
- `dad-cong-ca-phe` → `han-river-hai-chau-core`
- `dad-dragon-bridge` → `han-river-hai-chau-core`
- `dad-golden-bridge` → `ba-na-hills-excursion-zone`
- `dad-han-market` → `han-river-hai-chau-core`
- `dad-han-river-bridge` → `han-river-hai-chau-core`
- `dad-la-maison-1888` → `son-tra-peninsula-east`
- `dad-linh-ung-pagoda` → `son-tra-peninsula-east`
- `dad-madame-lan` → `han-river-hai-chau-core`
- `dad-marble-mountains` → `ngu-hanh-son-non-nuoc`
- `dad-my-khe-beach` → `my-khe-phuoc-my-coast`
- `dad-non-nuoc-beach` → `ngu-hanh-son-non-nuoc`
- `dad-sky36` → `han-river-hai-chau-core`
- `dad-son-tra-night-market` → `my-khe-phuoc-my-coast`
- `dad-son-tra-peninsula` → `son-tra-peninsula-east`
- `dad-sun-world-ba-na-hills` → `ba-na-hills-excursion-zone`
- `dad-waterfront-danang` → `han-river-hai-chau-core`

## Container links
- `dad-golden-bridge` → `ba-na-hills`
- `dad-marble-mountains` → `marble-mountains`
- `dad-my-khe-beach` → `my-khe-beach`
- `dad-son-tra-peninsula` → `son-tra-peninsula`
- `dad-sun-world-ba-na-hills` → `ba-na-hills`
- `dad-waterfront-danang` → `han-river-waterfront`

## Places without container
- `dad-43-factory-coffee-roaster`
- `dad-be-man-seafood`
- `dad-cham-sculpture-museum`
- `dad-con-market`
- `dad-cong-ca-phe`
- `dad-dragon-bridge`
- `dad-han-market`
- `dad-han-river-bridge`
- `dad-la-maison-1888`
- `dad-linh-ung-pagoda`
- `dad-madame-lan`
- `dad-non-nuoc-beach`
- `dad-sky36`
- `dad-son-tra-night-market`
