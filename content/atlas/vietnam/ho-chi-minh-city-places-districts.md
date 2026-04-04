# Ho Chi Minh City Places → Districts / Containers

Этот файл фиксирует связи для **20 мест Хошимина, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `sgn`

---

## 1. Bánh Mì Huỳnh Hoa
- `slug`: `sgn-banh-mi-huynh-hoa`
- `name`: `Bánh Mì Huỳnh Hoa`

### Place → District
- `district_slug`: `ben-thanh-old-market-core`
- `district_name`: `Ben Thanh / Old Market Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: iconic bánh mì case живёт в плотном Ben Thanh food contour и логично относится к старому market-core центрального Сайгона.

---

## 2. Ben Thanh Market
- `slug`: `sgn-ben-thanh-market`
- `name`: `Ben Thanh Market`

### Place → District
- `district_slug`: `ben-thanh-old-market-core`
- `district_name`: `Ben Thanh / Old Market Core`

### Place → Container
- `container_slug`: `ben-thanh-market`
- `container_name`: `Ben Thanh Market`

Пояснение: это не просто одна точка, а самостоятельный historic-market cluster в центре города, поэтому здесь нужен container.

---

## 3. Binh Tay Market
- `slug`: `sgn-binh-tay-market`
- `name`: `Binh Tay Market`

### Place → District
- `district_slug`: `cho-lon-binh-tay`
- `district_name`: `Cho Lon / Binh Tay`

### Place → Container
- `container_slug`: `binh-tay-market`
- `container_name`: `Binh Tay Market`

Пояснение: рынок находится в Chợ Lớn / District 6 и воспринимается как самостоятельная Chinatown market destination-zone.

---

## 4. Bitexco Financial Tower & Skydeck
- `slug`: `sgn-bitexco-financial-tower-skydeck`
- `name`: `Bitexco Financial Tower & Skydeck`

### Place → District
- `district_slug`: `ben-nghe-nguyen-hue-riverfront`
- `district_name`: `Ben Nghe / Nguyen Hue Riverfront`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: landmark живёт в skyline/riverside contour центрального District 1 near Ngô Đức Kế and Nguyễn Huệ.

---

## 5. Bún Thịt Nướng Nguyễn Trung Trực
- `slug`: `sgn-bun-thit-nuong-nguyen-trung-truc`
- `name`: `Bún Thịt Nướng Nguyễn Trung Trực`

### Place → District
- `district_slug`: `ben-thanh-old-market-core`
- `district_name`: `Ben Thanh / Old Market Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место привязано к Nguyễn Trung Trực / Ben Thanh side и логично живёт в старом food-core рядом с рынком.

---

## 6. Central Post Office
- `slug`: `sgn-central-post-office`
- `name`: `Central Post Office`

### Place → District
- `district_slug`: `dong-khoi-civic-core`
- `district_name`: `Dong Khoi / Civic Core`

### Place → Container
- `container_slug`: `saigon-notre-dame-post-office`
- `container_name`: `Saigon Notre-Dame & Post Office`

Пояснение: post office и cathedral образуют единый colonial-civic cluster на Paris Commune Square.

---

## 7. Chill Skybar
- `slug`: `sgn-chill-skybar`
- `name`: `Chill Skybar`

### Place → District
- `district_slug`: `ben-nghe-nguyen-hue-riverfront`
- `district_name`: `Ben Nghe / Nguyen Hue Riverfront`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: rooftop на AB Tower operationally относится к central skyline / riverfront downtown contour.

---

## 8. Cơm Tấm Cali
- `slug`: `sgn-com-tam-cali`
- `name`: `Cơm Tấm Cali`

### Place → District
- `district_slug`: `ben-thanh-old-market-core`
- `district_name`: `Ben Thanh / Old Market Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: place-case лучше всего ложится в плотный Ben Thanh downtown food contour.

---

## 9. Independence Palace
- `slug`: `sgn-independence-palace`
- `name`: `Independence Palace`

### Place → District
- `district_slug`: `dong-khoi-civic-core`
- `district_name`: `Dong Khoi / Civic Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: palace находится внутри главного historical-civic core District 1 alongside cathedral/post office axis.

---

## 10. Jade Emperor Pagoda
- `slug`: `sgn-jade-emperor-pagoda`
- `name`: `Jade Emperor Pagoda`

### Place → District
- `district_slug`: `dakao-pasteur-district-3`
- `district_name`: `Da Kao / Pasteur / District 3`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: пагода находится в Da Kao on Mai Thị Lựu Street и логично относится к расширенному north-central contour outside postcard core.

---

## 11. L’Usine
- `slug`: `sgn-l-usine`
- `name`: `L’Usine`

### Place → District
- `district_slug`: `dong-khoi-civic-core`
- `district_name`: `Dong Khoi / Civic Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: lifestyle café / retail case operationally лучше живёт в refined colonial-central contour around Đồng Khởi.

---

## 12. Nhà Hàng Ngon Sài Gòn
- `slug`: `sgn-nha-hang-ngon-sai-gon`
- `name`: `Nhà Hàng Ngon Sài Gòn`

### Place → District
- `district_slug`: `dakao-pasteur-district-3`
- `district_name`: `Da Kao / Pasteur / District 3`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: restaurant case лучше всего садится в broader Pasteur / District 3 food contour near the museum belt.

---

## 13. Notre-Dame Cathedral Basilica of Saigon
- `slug`: `sgn-notre-dame-cathedral-basilica-of-saigon`
- `name`: `Notre-Dame Cathedral Basilica of Saigon`

### Place → District
- `district_slug`: `dong-khoi-civic-core`
- `district_name`: `Dong Khoi / Civic Core`

### Place → Container
- `container_slug`: `saigon-notre-dame-post-office`
- `container_name`: `Saigon Notre-Dame & Post Office`

Пояснение: cathedral и central post office образуют единый colonial landmark cluster.

---

## 14. Phở Hòa Pasteur
- `slug`: `sgn-pho-hoa-pasteur`
- `name`: `Phở Hòa Pasteur`

### Place → District
- `district_slug`: `dakao-pasteur-district-3`
- `district_name`: `Da Kao / Pasteur / District 3`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: iconic phở case на Pasteur Street логично относится к District 3 / Pasteur food contour.

---

## 15. Quán Ăn Ngon Sài Gòn
- `slug`: `sgn-quan-an-ngon-sai-gon`
- `name`: `Quán Ăn Ngon Sài Gòn`

### Place → District
- `district_slug`: `dakao-pasteur-district-3`
- `district_name`: `Da Kao / Pasteur / District 3`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: operationally это ещё один central local-dining case, лучше всего живущий в expanded Pasteur / District 3 contour.

---

## 16. Quán Ốc 45
- `slug`: `sgn-quan-oc-45`
- `name`: `Quán Ốc 45`

### Place → District
- `district_slug`: `cho-lon-binh-tay`
- `district_name`: `Cho Lon / Binh Tay`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: seafood/snail case operationally отнесён к broader western Chợ Lớn urban-food contour.

---

## 17. Saigon River Promenade
- `slug`: `sgn-saigon-river-promenade`
- `name`: `Saigon River Promenade`

### Place → District
- `district_slug`: `ben-nghe-nguyen-hue-riverfront`
- `district_name`: `Ben Nghe / Nguyen Hue Riverfront`

### Place → Container
- `container_slug`: `saigon-river-walk`
- `container_name`: `Saigon River Walk`

Пояснение: это не одна точка, а самостоятельный riverfront promenade cluster, поэтому нужен container.

---

## 18. Tao Dan Park
- `slug`: `sgn-tao-dan-park`
- `name`: `Tao Dan Park`

### Place → District
- `district_slug`: `dakao-pasteur-district-3`
- `district_name`: `Da Kao / Pasteur / District 3`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: park-side green stop operationally лучше всего относится к expanded District 3 / civic-food contour.

---

## 19. The Workshop Coffee
- `slug`: `sgn-the-workshop-coffee`
- `name`: `The Workshop Coffee`

### Place → District
- `district_slug`: `ben-nghe-nguyen-hue-riverfront`
- `district_name`: `Ben Nghe / Nguyen Hue Riverfront`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: specialty coffee на Ngô Đức Kế живёт в business-riverside core near Bitexco / Nguyễn Huệ.

---

## 20. War Remnants Museum
- `slug`: `sgn-war-remnants-museum`
- `name`: `War Remnants Museum`

### Place → District
- `district_slug`: `dakao-pasteur-district-3`
- `district_name`: `Da Kao / Pasteur / District 3`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: музей на Võ Văn Tần / District 3 логично относится к broader museum-and-history contour north-west of the main civic core.

---

# Summary

## District links
- `sgn-banh-mi-huynh-hoa` → `ben-thanh-old-market-core`
- `sgn-ben-thanh-market` → `ben-thanh-old-market-core`
- `sgn-binh-tay-market` → `cho-lon-binh-tay`
- `sgn-bitexco-financial-tower-skydeck` → `ben-nghe-nguyen-hue-riverfront`
- `sgn-bun-thit-nuong-nguyen-trung-truc` → `ben-thanh-old-market-core`
- `sgn-central-post-office` → `dong-khoi-civic-core`
- `sgn-chill-skybar` → `ben-nghe-nguyen-hue-riverfront`
- `sgn-com-tam-cali` → `ben-thanh-old-market-core`
- `sgn-independence-palace` → `dong-khoi-civic-core`
- `sgn-jade-emperor-pagoda` → `dakao-pasteur-district-3`
- `sgn-l-usine` → `dong-khoi-civic-core`
- `sgn-nha-hang-ngon-sai-gon` → `dakao-pasteur-district-3`
- `sgn-notre-dame-cathedral-basilica-of-saigon` → `dong-khoi-civic-core`
- `sgn-pho-hoa-pasteur` → `dakao-pasteur-district-3`
- `sgn-quan-an-ngon-sai-gon` → `dakao-pasteur-district-3`
- `sgn-quan-oc-45` → `cho-lon-binh-tay`
- `sgn-saigon-river-promenade` → `ben-nghe-nguyen-hue-riverfront`
- `sgn-tao-dan-park` → `dakao-pasteur-district-3`
- `sgn-the-workshop-coffee` → `ben-nghe-nguyen-hue-riverfront`
- `sgn-war-remnants-museum` → `dakao-pasteur-district-3`

## Container links
- `sgn-ben-thanh-market` → `ben-thanh-market`
- `sgn-binh-tay-market` → `binh-tay-market`
- `sgn-central-post-office` → `saigon-notre-dame-post-office`
- `sgn-notre-dame-cathedral-basilica-of-saigon` → `saigon-notre-dame-post-office`
- `sgn-saigon-river-promenade` → `saigon-river-walk`

## Places without container
- `sgn-banh-mi-huynh-hoa`
- `sgn-bitexco-financial-tower-skydeck`
- `sgn-bun-thit-nuong-nguyen-trung-truc`
- `sgn-chill-skybar`
- `sgn-com-tam-cali`
- `sgn-independence-palace`
- `sgn-jade-emperor-pagoda`
- `sgn-l-usine`
- `sgn-nha-hang-ngon-sai-gon`
- `sgn-pho-hoa-pasteur`
- `sgn-quan-an-ngon-sai-gon`
- `sgn-quan-oc-45`
- `sgn-tao-dan-park`
- `sgn-the-workshop-coffee`
- `sgn-war-remnants-museum`