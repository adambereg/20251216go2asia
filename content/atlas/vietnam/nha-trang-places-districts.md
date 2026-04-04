# Nha Trang Places → Districts / Containers

Этот файл фиксирует связи для **19 мест Нячанга, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `ntr`

---

## 1. Alpaca Homestyle Café
- `slug`: `ntr-alpaca-homestyle-cafe`
- `name`: `Alpaca Homestyle Café`

### Place → District
- `district_slug`: `tran-phu-beachfront-core`
- `district_name`: `Tran Phu Beachfront Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: operationally привязан к главному beachfront-core как к наиболее понятному central café/lifestyle contour Нячанга.

---

## 2. Chợ Đầm
- `slug`: `ntr-cho-am`
- `name`: `Chợ Đầm`

### Place → District
- `district_slug`: `old-town-cathedral-cho-dam`
- `district_name`: `Old Town / Cathedral / Cho Dam`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это ключевой городской рынок старого Нячанга, логично живущий в old-town / Cho Dam contour.

---

## 3. Ganesh Indian Restaurant
- `slug`: `ntr-ganesh-indian-restaurant`
- `name`: `Ganesh Indian Restaurant`

### Place → District
- `district_slug`: `old-town-cathedral-cho-dam`
- `district_name`: `Old Town / Cathedral / Cho Dam`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: restaurant operationally отнесён к central old-town dining contour вне beachfront strip.

---

## 4. Hon Chong Rocks
- `slug`: `ntr-hon-chong-rocks`
- `name`: `Hon Chong Rocks`

### Place → District
- `district_slug`: `hon-chong-vinh-phuoc-north-coast`
- `district_name`: `Hon Chong / Vinh Phuoc North Coast`

### Place → Container
- `container_slug`: `hon-chong-promontory`
- `container_name`: `Hon Chong Promontory`

Пояснение: это не просто точка, а узнаваемый scenic rock-coast cluster северной береговой линии.

---

## 5. Hon Mun Island
- `slug`: `ntr-hon-mun-island`
- `name`: `Hon Mun Island`

### Place → District
- `district_slug`: `hon-mun-vinpearl-excursion-zone`
- `district_name`: `Hon Mun / Vinpearl Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место относится к внешнему marine excursion layer к югу от Nha Trang.

---

## 6. i-Resort Mud Bath
- `slug`: `ntr-i-resort-mud-bath`
- `name`: `i-Resort Mud Bath`

### Place → District
- `district_slug`: `long-son-west-urban-hills`
- `district_name`: `Long Son / West Urban Hills`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: resort-spa живёт во внутреннем western contour, а не на beachfront.

---

## 7. Kiwami Sushi
- `slug`: `ntr-kiwami-sushi`
- `name`: `Kiwami Sushi`

### Place → District
- `district_slug`: `old-town-cathedral-cho-dam`
- `district_name`: `Old Town / Cathedral / Cho Dam`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: operationally привязан к urban dining layer старого центра.

---

## 8. Lac Canh BBQ
- `slug`: `ntr-lac-canh-bbq`
- `name`: `Lac Canh BBQ`

### Place → District
- `district_slug`: `old-town-cathedral-cho-dam`
- `district_name`: `Old Town / Cathedral / Cho Dam`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: классический local food case старого городского контура Нячанга.

---

## 9. Long Son Pagoda
- `slug`: `ntr-long-son-pagoda`
- `name`: `Long Son Pagoda`

### Place → District
- `district_slug`: `long-son-west-urban-hills`
- `district_name`: `Long Son / West Urban Hills`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храм связан с западным inland contour у подножия холмов.

---

## 10. Louisiane Brewhouse
- `slug`: `ntr-louisiane-brewhouse`
- `name`: `Louisiane Brewhouse`

### Place → District
- `district_slug`: `tran-phu-beachfront-core`
- `district_name`: `Tran Phu Beachfront Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это classic beachfront dining/beach-bar case на Trần Phú strip.

---

## 11. National Oceanographic Museum of Vietnam
- `slug`: `ntr-national-oceanographic-museum-of-vietnam`
- `name`: `National Oceanographic Museum of Vietnam`

### Place → District
- `district_slug`: `cau-da-south-port`
- `district_name`: `Cau Da / South Port`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: museum связан с Cầu Đá / south-port contour, а не с central beach strip.

---

## 12. Nha Trang Beach & Promenade
- `slug`: `ntr-nha-trang-beach-promenade`
- `name`: `Nha Trang Beach & Promenade`

### Place → District
- `district_slug`: `tran-phu-beachfront-core`
- `district_name`: `Tran Phu Beachfront Core`

### Place → Container
- `container_slug`: `nha-trang-beach-promenade`
- `container_name`: `Nha Trang Beach Promenade`

Пояснение: это полноценный beachfront cluster, а не одиночная точка.

---

## 13. Nha Trang Cathedral
- `slug`: `ntr-nha-trang-cathedral`
- `name`: `Nha Trang Cathedral`

### Place → District
- `district_slug`: `old-town-cathedral-cho-dam`
- `district_name`: `Old Town / Cathedral / Cho Dam`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: cathedral логично живёт в old-town / civic contour, а не на resort beachfront.

---

## 14. Nha Trang Night Market
- `slug`: `ntr-nha-trang-night-market`
- `name`: `Nha Trang Night Market`

### Place → District
- `district_slug`: `tran-phu-beachfront-core`
- `district_name`: `Tran Phu Beachfront Core`

### Place → Container
- `container_slug`: `nha-trang-night-market`
- `container_name`: `Nha Trang Night Market`

Пояснение: это самостоятельный evening market corridor в beachfront-core.

---

## 15. Po Nagar Cham Towers
- `slug`: `ntr-po-nagar-cham-towers`
- `name`: `Po Nagar Cham Towers`

### Place → District
- `district_slug`: `hon-chong-vinh-phuoc-north-coast`
- `district_name`: `Hon Chong / Vinh Phuoc North Coast`

### Place → Container
- `container_slug`: `po-nagar-cham-towers`
- `container_name`: `Po Nagar Cham Towers`

Пояснение: temple complex живёт как самостоятельный heritage cluster северного Нячанга.

---

## 16. Sailing Club
- `slug`: `ntr-sailing-club`
- `name`: `Sailing Club`

### Place → District
- `district_slug`: `tran-phu-beachfront-core`
- `district_name`: `Tran Phu Beachfront Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: classic beach bar / nightlife case центрального beachfront contour.

---

## 17. Skylight Rooftop / Skydeck
- `slug`: `ntr-skylight-rooftop-skydeck`
- `name`: `Skylight Rooftop / Skydeck`

### Place → District
- `district_slug`: `tran-phu-beachfront-core`
- `district_name`: `Tran Phu Beachfront Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: rooftop viewpoint и nightlife spot центрального coastal core.

---

## 18. Tháp Bà Hot Springs
- `slug`: `ntr-thap-ba-hot-springs`
- `name`: `Tháp Bà Hot Springs`

### Place → District
- `district_slug`: `hon-chong-vinh-phuoc-north-coast`
- `district_name`: `Hon Chong / Vinh Phuoc North Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: hot springs логично живут в северном temple-and-wellness layer у Po Nagar / Vinh Phuoc side.

---

## 19. VinWonders Nha Trang & Cable Car
- `slug`: `ntr-vinwonders-nha-trang-cable-car`
- `name`: `VinWonders Nha Trang & Cable Car`

### Place → District
- `district_slug`: `hon-mun-vinpearl-excursion-zone`
- `district_name`: `Hon Mun / Vinpearl Excursion Zone`

### Place → Container
- `container_slug`: `vinwonders-nha-trang`
- `container_name`: `VinWonders Nha Trang`

Пояснение: это крупный island leisure cluster, а не просто cable-car stop.

---

# Summary

## District links
- `ntr-alpaca-homestyle-cafe` → `tran-phu-beachfront-core`
- `ntr-cho-am` → `old-town-cathedral-cho-dam`
- `ntr-ganesh-indian-restaurant` → `old-town-cathedral-cho-dam`
- `ntr-hon-chong-rocks` → `hon-chong-vinh-phuoc-north-coast`
- `ntr-hon-mun-island` → `hon-mun-vinpearl-excursion-zone`
- `ntr-i-resort-mud-bath` → `long-son-west-urban-hills`
- `ntr-kiwami-sushi` → `old-town-cathedral-cho-dam`
- `ntr-lac-canh-bbq` → `old-town-cathedral-cho-dam`
- `ntr-long-son-pagoda` → `long-son-west-urban-hills`
- `ntr-louisiane-brewhouse` → `tran-phu-beachfront-core`
- `ntr-national-oceanographic-museum-of-vietnam` → `cau-da-south-port`
- `ntr-nha-trang-beach-promenade` → `tran-phu-beachfront-core`
- `ntr-nha-trang-cathedral` → `old-town-cathedral-cho-dam`
- `ntr-nha-trang-night-market` → `tran-phu-beachfront-core`
- `ntr-po-nagar-cham-towers` → `hon-chong-vinh-phuoc-north-coast`
- `ntr-sailing-club` → `tran-phu-beachfront-core`
- `ntr-skylight-rooftop-skydeck` → `tran-phu-beachfront-core`
- `ntr-thap-ba-hot-springs` → `hon-chong-vinh-phuoc-north-coast`
- `ntr-vinwonders-nha-trang-cable-car` → `hon-mun-vinpearl-excursion-zone`

## Container links
- `ntr-hon-chong-rocks` → `hon-chong-promontory`
- `ntr-nha-trang-beach-promenade` → `nha-trang-beach-promenade`
- `ntr-nha-trang-night-market` → `nha-trang-night-market`
- `ntr-po-nagar-cham-towers` → `po-nagar-cham-towers`
- `ntr-vinwonders-nha-trang-cable-car` → `vinwonders-nha-trang`

## Places without container
- `ntr-alpaca-homestyle-cafe`
- `ntr-cho-am`
- `ntr-ganesh-indian-restaurant`
- `ntr-hon-mun-island`
- `ntr-i-resort-mud-bath`
- `ntr-kiwami-sushi`
- `ntr-lac-canh-bbq`
- `ntr-long-son-pagoda`
- `ntr-louisiane-brewhouse`
- `ntr-national-oceanographic-museum-of-vietnam`
- `ntr-nha-trang-cathedral`
- `ntr-sailing-club`
- `ntr-skylight-rooftop-skydeck`
- `ntr-thap-ba-hot-springs`
