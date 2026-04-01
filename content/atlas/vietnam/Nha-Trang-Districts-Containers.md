# Nha Trang Districts and Containers

Этот файл фиксирует новые сущности для Nha Trang pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `ntr`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Нячанга.

---

# 1. City Districts

## 1.1 `tran-phu-beachfront-core`
- `slug`: `tran-phu-beachfront-core`
- `name`: `Tran Phu Beachfront Core`
- `name_local`: `Trần Phú`

Краткое описание: главный seaside-контур Нячанга вдоль Trần Phú и beachfront promenade. Здесь сосредоточены городской пляж, night-market жизнь, beach bars, rooftop views и большая часть классического resort experience в самом центре города.

Подходит для:
- пляжного отдыха и прогулок по набережной;
- beach clubs, rooftop bars и seaside dining;
- первого знакомства с курортным Нячангом.

Текущие Atlas places в этом районе:
- `ntr-alpaca-homestyle-cafe`
- `ntr-louisiane-brewhouse`
- `ntr-nha-trang-beach-promenade`
- `ntr-nha-trang-night-market`
- `ntr-sailing-club`
- `ntr-skylight-rooftop-skydeck`

---

## 1.2 `old-town-cathedral-cho-dam`
- `slug`: `old-town-cathedral-cho-dam`
- `name`: `Old Town / Cathedral / Cho Dam`
- `name_local`: `Chợ Đầm / Nhà thờ Núi`

Краткое описание: старый городской контур Нячанга к северо-западу от beachfront-зоны вокруг Chợ Đầm, Nhà thờ Núi, локальных ресторанов и повседневной городской жизни. Это более локальный urban layer по сравнению с beach promenade.

Подходит для:
- городских рынков и local food;
- cathedral, старых улиц и everyday city experience;
- менее туристического, но более «настоящего» Нячанга.

Текущие Atlas places в этом районе:
- `ntr-cho-am`
- `ntr-ganesh-indian-restaurant`
- `ntr-kiwami-sushi`
- `ntr-lac-canh-bbq`
- `ntr-nha-trang-cathedral`

---

## 1.3 `cau-da-south-port`
- `slug`: `cau-da-south-port`
- `name`: `Cau Da / South Port`
- `name_local`: `Cầu Đá`

Краткое описание: южный coastal-and-port contour Нячанга вокруг Cầu Đá, southern harbor edge и Institute of Oceanography. Это переходная зона между городским beachfront-контуром и island-departure / port logic.

Подходит для:
- музеев и marine-education experience;
- южного coastal promenade вне центра;
- отправной точки к южным бухтам и островам.

Текущие Atlas places в этом районе:
- `ntr-national-oceanographic-museum-of-vietnam`

---

## 1.4 `hon-chong-vinh-phuoc-north-coast`
- `slug`: `hon-chong-vinh-phuoc-north-coast`
- `name`: `Hon Chong / Vinh Phuoc North Coast`
- `name_local`: `Hòn Chồng / Vĩnh Phước`

Краткое описание: северный scenic coastal contour Нячанга вокруг Hon Chong promontory, Po Nagar area и Tháp Bà-side hot spring belt. Это более спокойный и обзорный coastal layer города с сильным temple-and-landmark характером.

Подходит для:
- coastal viewpoints и северной shoreline;
- исторических temple-landmark stops;
- более спокойного sightseeing вне Tran Phu core.

Текущие Atlas places в этом районе:
- `ntr-hon-chong-rocks`
- `ntr-po-nagar-cham-towers`
- `ntr-thap-ba-hot-springs`

---

## 1.5 `long-son-west-urban-hills`
- `slug`: `long-son-west-urban-hills`
- `name`: `Long Son / West Urban Hills`
- `name_local`: `Long Sơn`

Краткое описание: западный inland contour Нячанга у подножия городских холмов вокруг Long Sơn Pagoda и i-Resort. Это не beachfront-зона, а более внутренний urban-and-wellness layer с короткими выездами из центра.

Подходит для:
- храмов и панорам над городом;
- mud bath / wellness short trips;
- выездов за пределы центрального coastal core.

Текущие Atlas places в этом районе:
- `ntr-i-resort-mud-bath`
- `ntr-long-son-pagoda`

---

## 1.6 `hon-mun-vinpearl-excursion-zone`
- `slug`: `hon-mun-vinpearl-excursion-zone`
- `name`: `Hon Mun / Vinpearl Excursion Zone`
- `name_local`: `Hòn Mun / Hòn Tre`

Краткое описание: внешняя marine-and-island excursion-zone к югу и юго-востоку от Нячанга, связанная с Hon Mun marine park area и VinWonders / cable car на Hòn Tre. Это не городской район в строгом смысле, а ключевой island-hopping и resort day-trip cluster для Atlas Nha Trang.

Подходит для:
- marine excursions и island hopping;
- cable car, theme park и resort leisure;
- snorkeling и day trips за пределы city core.

Текущие Atlas places в этом районе:
- `ntr-hon-mun-island`
- `ntr-vinwonders-nha-trang-cable-car`

---

# 2. Place Containers

## 2.1 `nha-trang-beach-promenade`
- `slug`: `nha-trang-beach-promenade`
- `name`: `Nha Trang Beach Promenade`
- `type`: `urban-beachfront`
- `city_slug`: `ntr`
- `district_slug`: `tran-phu-beachfront-core`

Краткое описание: главный beachfront-кластер Нячанга вдоль Trần Phú с длинной полосой пляжа, promenade, барами, ресторанами и классической resort-жизнью.

Places inside:
- `ntr-nha-trang-beach-promenade`

---

## 2.2 `nha-trang-night-market`
- `slug`: `nha-trang-night-market`
- `name`: `Nha Trang Night Market`
- `type`: `night-market-corridor`
- `city_slug`: `ntr`
- `district_slug`: `tran-phu-beachfront-core`

Краткое описание: вечерний market-and-food corridor у beachfront-зоны Нячанга, который живёт как самостоятельный nightlife and strolling cluster, а не как одиночная точка.

Places inside:
- `ntr-nha-trang-night-market`

---

## 2.3 `hon-chong-promontory`
- `slug`: `hon-chong-promontory`
- `name`: `Hon Chong Promontory`
- `type`: `scenic-rock-coast-cluster`
- `city_slug`: `ntr`
- `district_slug`: `hon-chong-vinh-phuoc-north-coast`

Краткое описание: северный scenic rocky-coast cluster вокруг Hon Chong rocks и coastal viewpoints.

Places inside:
- `ntr-hon-chong-rocks`

---

## 2.4 `po-nagar-cham-towers`
- `slug`: `po-nagar-cham-towers`
- `name`: `Po Nagar Cham Towers`
- `type`: `temple-heritage-cluster`
- `city_slug`: `ntr`
- `district_slug`: `hon-chong-vinh-phuoc-north-coast`

Краткое описание: исторический temple-and-heritage cluster Cham period на северной стороне Nha Trang River.

Places inside:
- `ntr-po-nagar-cham-towers`

---

## 2.5 `vinwonders-nha-trang`
- `slug`: `vinwonders-nha-trang`
- `name`: `VinWonders Nha Trang`
- `type`: `island-theme-park-cluster`
- `city_slug`: `ntr`
- `district_slug`: `hon-mun-vinpearl-excursion-zone`

Краткое описание: крупный island leisure cluster на Hòn Tre с cable car arrival, theme park, resort infrastructure и day-trip logic.

Places inside:
- `ntr-vinwonders-nha-trang-cable-car`
