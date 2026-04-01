# Hue Districts and Containers

Этот файл фиксирует новые сущности для Hue pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `hue`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Хюэ.

---

# 1. City Districts

## 1.1 `imperial-citadel-dong-ba`
- `slug`: `imperial-citadel-dong-ba`
- `name`: `Imperial Citadel / Dong Ba`
- `name_local`: `Kinh thành Huế / Đông Ba`
- `city_slug`: `hue`
- `country_slug`: `vietnam`

Краткое описание: северный исторический contour Хюэ вокруг Imperial City, Dong Ba Market и северного берега Perfume River. Это главный район для знакомства с имперским наследием династии Нгуен, старым торговым слоем города и классическими monument-локациями.

Подходит для:
- имперской цитадели и исторических прогулок;
- рынков и старого городского слоя Хюэ;
- first-touch знакомства с наследием бывшей столицы.

Текущие Atlas places в этом районе:
- `hue-dong-ba-market`
- `hue-imperial-city-hue`

---

## 1.2 `south-bank-truong-tien-core`
- `slug`: `south-bank-truong-tien-core`
- `name`: `South Bank / Truong Tien Core`
- `name_local`: `Bờ nam / Cầu Trường Tiền`
- `city_slug`: `hue`
- `country_slug`: `vietnam`

Краткое описание: центральный южный берег Perfume River вокруг Truong Tien Bridge, walking streets, food stops и вечерней городской жизни. Это самый понятный urban core Хюэ для кафе, casual dining, nightlife и прогулок вдоль реки.

Подходит для:
- city walks вдоль Perfume River;
- кафе, local food и evening atmosphere;
- urban-life слоя Хюэ за пределами имперского ядра.

Текущие Atlas places в этом районе:
- `hue-brown-eyes-bar`
- `hue-ca-phe-muoi-142`
- `hue-hue-night-market`
- `hue-imperial-craft-bia-brewpub`
- `hue-lien-hoa-vegetarian`
- `hue-madam-thu-restaurant`
- `hue-perfume-river`
- `hue-quan-hanh`
- `hue-the-lab-coffee`
- `hue-truong-tien-bridge`

---

## 1.3 `kim-long-thien-mu-west-bank`
- `slug`: `kim-long-thien-mu-west-bank`
- `name`: `Kim Long / Thien Mu West Bank`
- `name_local`: `Kim Long / Chùa Thiên Mụ`
- `city_slug`: `hue`
- `country_slug`: `vietnam`

Краткое описание: более спокойный западный riverbank contour к северо-западу от центра, связанный с Kim Long и знаковой пагодой Thiên Mụ. Это район для классического river-view Хюэ, буддийского наследия и менее шумного urban-edge experience.

Подходит для:
- пагод и river-view sightseeing;
- более спокойного исторического Хюэ;
- коротких прогулок и поездок вдоль западного берега.

Текущие Atlas places в этом районе:
- `hue-thien-mu-pagoda`

---

## 1.4 `southern-hills-ritual-zone`
- `slug`: `southern-hills-ritual-zone`
- `name`: `Southern Hills / Ritual Zone`
- `name_local`: `Đồi phía nam / Nam Giao`
- `city_slug`: `hue`
- `country_slug`: `vietnam`

Краткое описание: южный green-and-ritual contour Хюэ вокруг Nam Giao, Ngu Binh, Tu Hieu и Vong Canh. Это более тихий hillside cluster для temple visits, scenic viewpoints и deeper heritage layer за пределами центрального riverfront.

Подходит для:
- пагод, ritual heritage и pine-hill atmosphere;
- scenic viewpoints и более зелёного Хюэ;
- half-day detours за пределы city core.

Текущие Atlas places в этом районе:
- `hue-nam-giao-altar`
- `hue-ngu-binh-viewpoint`
- `hue-tu-hieu-pagoda`
- `hue-vong-canh-hill`

---

## 1.5 `tam-giang-lagoon-excursion-zone`
- `slug`: `tam-giang-lagoon-excursion-zone`
- `name`: `Tam Giang Lagoon Excursion Zone`
- `name_local`: `Đầm phá Tam Giang`
- `city_slug`: `hue`
- `country_slug`: `vietnam`

Краткое описание: внешняя lagoon excursion-zone к северо-востоку от города, связанная с Tam Giang–Cầu Hai lagoon system, fishing villages и sunset boat trips. Это не городской район, а природный day-trip cluster для воды, лагуны и slower countryside experience.

Подходит для:
- sunset lagoon trips;
- рыбацких village views и seafood detours;
- природных выездов за пределы центра Хюэ.

Текущие Atlas places в этом районе:
- `hue-tam-giang-lagoon`

---

## 1.6 `bach-ma-excursion-zone`
- `slug`: `bach-ma-excursion-zone`
- `name`: `Bach Ma Excursion Zone`
- `name_local`: `Vườn quốc gia Bạch Mã`
- `city_slug`: `hue`
- `country_slug`: `vietnam`

Краткое описание: внешняя mountain-and-forest excursion-zone к югу от Хюэ, связанная с Bạch Mã National Park, waterfalls и highland nature. Это большой природный cluster для day trips или longer nature outings, а не часть городского ядра.

Подходит для:
- mountain nature и trekking;
- waterfalls и forest roads;
- cooler highland day trips из Хюэ.

Текущие Atlas places в этом районе:
- `hue-bach-ma-national-park`

---

# 2. Place Containers

## 2.1 `imperial-city-hue`
- `slug`: `imperial-city-hue`
- `name`: `Imperial City Hue`
- `type`: `historic-citadel-cluster`
- `city_slug`: `hue`
- `district_slug`: `imperial-citadel-dong-ba`

Краткое описание: главный citadel-cluster Хюэ как самостоятельная destination-zone с воротами, стенами, дворцовыми пространствами и imperial heritage.

Places inside:
- `hue-imperial-city-hue`

---

## 2.2 `perfume-river-hue`
- `slug`: `perfume-river-hue`
- `name`: `Perfume River Hue`
- `type`: `urban-riverfront-cluster`
- `city_slug`: `hue`
- `district_slug`: `south-bank-truong-tien-core`

Краткое описание: riverfront-cluster в центральной части Хюэ с прогулками, boat views, bridge panoramas и вечерней городской атмосферой.

Places inside:
- `hue-perfume-river`
- `hue-truong-tien-bridge`

---

## 2.3 `hue-night-market`
- `slug`: `hue-night-market`
- `name`: `Hue Night Market`
- `type`: `night-market-corridor`
- `city_slug`: `hue`
- `district_slug`: `south-bank-truong-tien-core`

Краткое описание: evening market corridor и walking-zone в центре Хюэ с уличной едой, сувенирами и tourist-night atmosphere.

Places inside:
- `hue-hue-night-market`
