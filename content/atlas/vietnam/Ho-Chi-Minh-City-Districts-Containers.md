# Ho Chi Minh City Districts and Containers

Этот файл фиксирует новые сущности для Ho Chi Minh City pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `sgn`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Хошимина.

---

# 1. City Districts

## 1.1 `ben-thanh-old-market-core`
- `slug`: `ben-thanh-old-market-core`
- `name`: `Ben Thanh / Old Market Core`
- `name_local`: `Bến Thành`
- `city_slug`: `sgn`
- `country_slug`: `vietnam`

Краткое описание: плотный городской food-and-market contour вокруг Ben Thanh Market, Nguyễn Trung Trực, Lê Thánh Tôn и соседних улиц старого центра District 1. Это один из самых понятных operational cores Сайгона для street food, повседневной городской энергии и первого знакомства с downtown Ho Chi Minh City.

Подходит для:
- рынков, street food и casual local dining;
- первого знакомства с центральным Сайгоном;
- walkable urban experience в самом сердце District 1.

Текущие Atlas places в этом районе:
- `sgn-banh-mi-huynh-hoa`
- `sgn-ben-thanh-market`
- `sgn-bun-thit-nuong-nguyen-trung-truc`
- `sgn-com-tam-cali`

---

## 1.2 `dong-khoi-civic-core`
- `slug`: `dong-khoi-civic-core`
- `name`: `Dong Khoi / Civic Core`
- `name_local`: `Đồng Khởi / Công xã Paris`
- `city_slug`: `sgn`
- `country_slug`: `vietnam`

Краткое описание: историко-гражданское ядро центрального Сайгона вокруг Đồng Khởi, Paris Commune Square, Notre-Dame Cathedral, Central Post Office и Independence Palace. Это главный contour для colonial landmarks, civic heritage и polished central-city walks.

Подходит для:
- colonial heritage и главных city landmarks;
- civic sightseeing и архитектурных прогулок;
- первого знакомства с историческим и официальным центром Хошимина.

Текущие Atlas places в этом районе:
- `sgn-central-post-office`
- `sgn-independence-palace`
- `sgn-l-usine`
- `sgn-notre-dame-cathedral-basilica-of-saigon`

---

## 1.3 `ben-nghe-nguyen-hue-riverfront`
- `slug`: `ben-nghe-nguyen-hue-riverfront`
- `name`: `Ben Nghe / Nguyen Hue Riverfront`
- `name_local`: `Bến Nghé / Nguyễn Huệ`
- `city_slug`: `sgn`
- `country_slug`: `vietnam`

Краткое описание: polished riverfront и skyline contour District 1 вокруг Nguyễn Huệ, Ngô Đức Kế, Bitexco и waterfront edge Сайгона. Это зона для rooftop bars, specialty coffee, modern city views и прогулок у Saigon River.

Подходит для:
- skyline views, rooftop bars и modern Saigon;
- specialty coffee и central business-district atmosphere;
- прогулок у реки и evening city walks.

Текущие Atlas places в этом районе:
- `sgn-bitexco-financial-tower-skydeck`
- `sgn-chill-skybar`
- `sgn-saigon-river-promenade`
- `sgn-the-workshop-coffee`

---

## 1.4 `dakao-pasteur-district-3`
- `slug`: `dakao-pasteur-district-3`
- `name`: `Da Kao / Pasteur / District 3`
- `name_local`: `Đa Kao / Pasteur / Quận 3`
- `city_slug`: `sgn`
- `country_slug`: `vietnam`

Краткое описание: расширенный central-urban contour к северу и северо-западу от старого downtown, охватывающий Da Kao, Pasteur axis и District 3. Это район музеев, пагод, park-side streets и известных local restaurants чуть в стороне от postcard-core.

Подходит для:
- музеев, пагод и исторических stopovers;
- local food и более «живого» городского опыта;
- прогулок вне главного tourist core, но рядом с центром.

Текущие Atlas places в этом районе:
- `sgn-jade-emperor-pagoda`
- `sgn-nha-hang-ngon-sai-gon`
- `sgn-pho-hoa-pasteur`
- `sgn-quan-an-ngon-sai-gon`
- `sgn-tao-dan-park`
- `sgn-war-remnants-museum`

---

## 1.5 `cho-lon-binh-tay`
- `slug`: `cho-lon-binh-tay`
- `name`: `Cho Lon / Binh Tay`
- `name_local`: `Chợ Lớn / Bình Tây`
- `city_slug`: `sgn`
- `country_slug`: `vietnam`

Краткое описание: старый Chinese-Saigon trade contour западной части города вокруг Chợ Lớn, Binh Tay Market и классической southern food culture. Это не polished downtown, а более плотный, торговый и локально-гастрономический городской слой.

Подходит для:
- Chinatown experience и старых торговых кварталов;
- рынков и local urban food culture;
- более аутентичного western Saigon outside District 1.

Текущие Atlas places в этом районе:
- `sgn-binh-tay-market`
- `sgn-quan-oc-45`

---

# 2. Place Containers

## 2.1 `ben-thanh-market`
- `slug`: `ben-thanh-market`
- `name`: `Ben Thanh Market`
- `type`: `historic-market-cluster`
- `city_slug`: `sgn`
- `district_slug`: `ben-thanh-old-market-core`

Краткое описание: исторический market-cluster в центре Сайгона, который воспринимается как самостоятельная destination-zone для food, shopping и первого знакомства с городом.

Places inside:
- `sgn-ben-thanh-market`

---

## 2.2 `saigon-notre-dame-post-office`
- `slug`: `saigon-notre-dame-post-office`
- `name`: `Saigon Notre-Dame & Post Office`
- `type`: `colonial-landmark-cluster`
- `city_slug`: `sgn`
- `district_slug`: `dong-khoi-civic-core`

Краткое описание: связанный colonial-civic cluster вокруг Notre-Dame Cathedral Basilica of Saigon и Central Post Office, который лучше воспринимается как единая прогулочная destination-zone, а не как две разрозненные точки.

Places inside:
- `sgn-central-post-office`
- `sgn-notre-dame-cathedral-basilica-of-saigon`

---

## 2.3 `saigon-river-walk`
- `slug`: `saigon-river-walk`
- `name`: `Saigon River Walk`
- `type`: `urban-riverfront-cluster`
- `city_slug`: `sgn`
- `district_slug`: `ben-nghe-nguyen-hue-riverfront`

Краткое описание: riverfront-cluster вдоль центральной набережной Сайгона с skyline views, promenade logic и evening waterfront atmosphere.

Places inside:
- `sgn-saigon-river-promenade`

---

## 2.4 `binh-tay-market`
- `slug`: `binh-tay-market`
- `name`: `Binh Tay Market`
- `type`: `chinatown-market-cluster`
- `city_slug`: `sgn`
- `district_slug`: `cho-lon-binh-tay`

Краткое описание: крупный Chinatown market-cluster западного Сайгона, который живёт как самостоятельная destination-zone внутри Chợ Lớn.

Places inside:
- `sgn-binh-tay-market`