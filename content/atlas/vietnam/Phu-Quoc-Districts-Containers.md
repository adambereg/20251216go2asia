# Phu Quoc Districts and Containers

Этот файл фиксирует новые сущности для Phu Quoc pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `phu`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Фукуока.

---

# 1. City Districts

## 1.1 `duong-dong-dinh-cau-core`
- `slug`: `duong-dong-dinh-cau-core`
- `name`: `Duong Dong / Dinh Cau Core`
- `name_local`: `Dương Đông / Dinh Cậu`
- `city_slug`: `phu`
- `country_slug`: `vietnam`

Краткое описание: главный городской и туристический контур Фукуока вокруг Dương Đông, Dinh Cậu, Bach Dang waterfront и night market zone. Это базовый urban core острова для первого знакомства, местной еды, вечерних прогулок и старого harbour-town ритма.

Подходит для:
- первого знакомства с urban Фукуоком;
- seafood, street food и evening walks;
- night market, temple stop и центральной городской атмосферы.

Текущие Atlas places в этом районе:
- `phu-banh-canh-cha-ca-ong-hai`
- `phu-dinh-cau-temple`
- `phu-fish-sauce-factory`
- `phu-oc-343`
- `phu-phu-quoc-night-market`
- `phu-uong-bang-night-market`

---

## 1.2 `long-beach-tran-hung-dao`
- `slug`: `long-beach-tran-hung-dao`
- `name`: `Long Beach / Tran Hung Dao`
- `name_local`: `Bãi Trường / Trần Hưng Đạo`
- `city_slug`: `phu`
- `country_slug`: `vietnam`

Краткое описание: длинный западный beachfront-contour вдоль Long Beach и улицы Trần Hưng Đạo с resort life, sunset dining, beach bars и более polished seaside experience. Это самый понятный resort belt южнее Dương Đông.

Подходит для:
- beach stay и sunset atmosphere;
- beachfront dining и cocktail bars;
- классического west-coast resort experience на Фукуоке.

Текущие Atlas places в этом районе:
- `phu-long-beach`
- `phu-luna-rossa`
- `phu-phuongbinh-restaurant`
- `phu-rory-s-beach-bar`
- `phu-the-pepper-tree`

---

## 1.3 `ong-lang-cua-duong`
- `slug`: `ong-lang-cua-duong`
- `name`: `Ong Lang / Cua Duong`
- `name_local`: `Ông Lang / Cửa Dương`
- `city_slug`: `phu`
- `country_slug`: `vietnam`

Краткое описание: более спокойный северо-западный coastal contour вокруг Ong Lang Beach и дорог к Cửa Dương. Это softer, less crowded resort side Фукуока с sunset beaches и более расслабленным island rhythm.

Подходит для:
- более спокойного beach experience;
- sunset coast и laid-back dining;
- отдыха вне более плотного Dương Đông / Long Beach ядра.

Текущие Atlas places в этом районе:
- `phu-ong-lang-beach`
- `phu-shimmer-restaurant`

---

## 1.4 `an-thoi-hon-thom-south`
- `slug`: `an-thoi-hon-thom-south`
- `name`: `An Thoi / Hon Thom South`
- `name_local`: `An Thới / Hòn Thơm`
- `city_slug`: `phu`
- `country_slug`: `vietnam`

Краткое описание: южный coastal-and-island gateway contour вокруг An Thới, Hon Thom cable car, Sao Beach и исторических/memorial stops. Это южный leisure cluster Фукуока, где marine attractions соединяются с островными поездками и пляжами.

Подходит для:
- cable car и island-hopping;
- южных beaches и marine leisure;
- day trips через An Thoi и south-island corridor.

Текущие Atlas places в этом районе:
- `phu-hon-thom-cable-car`
- `phu-phu-quoc-prison`
- `phu-sao-beach`

---

## 1.5 `ganh-dau-bai-dai-northwest`
- `slug`: `ganh-dau-bai-dai-northwest`
- `name`: `Ganh Dau / Bai Dai Northwest`
- `name_local`: `Gành Dầu / Bãi Dài`
- `city_slug`: `phu`
- `country_slug`: `vietnam`

Краткое описание: северо-западный leisure-and-attractions contour вокруг Gành Dầu, Bãi Dài, Vinpearl / Grand World side и seafood villages. Это отдельный large-scale tourist cluster, сильно отличающийся от Dương Đông и южного An Thới.

Подходит для:
- seafood villages и northern coast views;
- theme-park / entertainment stops;
- resort day trips на северо-запад Фукуока.

Текущие Atlas places в этом районе:
- `phu-ganh-dau-crab-market`
- `phu-vinpearl-safari-grand-world`

---

## 1.6 `phu-quoc-national-park-interior`
- `slug`: `phu-quoc-national-park-interior`
- `name`: `Phu Quoc National Park Interior`
- `name_local`: `Vườn quốc gia Phú Quốc`
- `city_slug`: `phu`
- `country_slug`: `vietnam`

Краткое описание: внутренний природный и лесной contour острова, связанный с national park experience, jungle roads и biodiversity layer Фукуока. Это не beach district, а interior nature cluster.

Подходит для:
- jungle и national park experience;
- nature drives и interior island exploration;
- более дикого природного слоя Фукуока за пределами побережья.

Текущие Atlas places в этом районе:
- `phu-phu-quoc-national-park`

---

# 2. Place Containers

## 2.1 `phu-quoc-night-market`
- `slug`: `phu-quoc-night-market`
- `name`: `Phu Quoc Night Market`
- `type`: `night-market-food-cluster`
- `city_slug`: `phu`
- `district_slug`: `duong-dong-dinh-cau-core`

Краткое описание: главный evening food-and-shopping cluster в центре Dương Đông, воспринимаемый как самостоятельная destination-zone, а не одна точка.

Places inside:
- `phu-phu-quoc-night-market`
- `phu-uong-bang-night-market`

---

## 2.2 `long-beach-phu-quoc`
- `slug`: `long-beach-phu-quoc`
- `name`: `Long Beach Phu Quoc`
- `type`: `urban-beachfront`
- `city_slug`: `phu`
- `district_slug`: `long-beach-tran-hung-dao`

Краткое описание: длинный west-coast beachfront-cluster южнее Dương Đông с resort полосой, sunset views и beach clubs.

Places inside:
- `phu-long-beach`

---

## 2.3 `ong-lang-beach`
- `slug`: `ong-lang-beach`
- `name`: `Ong Lang Beach`
- `type`: `coastal-beach-cluster`
- `city_slug`: `phu`
- `district_slug`: `ong-lang-cua-duong`

Краткое описание: более спокойный beach-cluster северо-западного побережья с softer resort mood и sunset coastline.

Places inside:
- `phu-ong-lang-beach`

---

## 2.4 `sao-beach`
- `slug`: `sao-beach`
- `name`: `Sao Beach`
- `type`: `scenic-beach-cluster`
- `city_slug`: `phu`
- `district_slug`: `an-thoi-hon-thom-south`

Краткое описание: iconic south-coast beach cluster с белым песком и turquoise water, как самостоятельная destination-zone.

Places inside:
- `phu-sao-beach`
