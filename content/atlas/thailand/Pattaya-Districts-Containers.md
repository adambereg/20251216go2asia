# Pattaya Districts and Containers

Этот файл фиксирует новые сущности для Pattaya pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `pty`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Паттайи.

---

# 1. City Districts

## 1.1 `central-pattaya-beach-road`
- `slug`: `central-pattaya-beach-road`
- `name`: `Central Pattaya / Beach Road`
- `name_local`: `พัทยากลาง / ถนนเลียบหาดพัทยา`
- `city_slug`: `pty`
- `country_slug`: `thailand`

Краткое описание: главное курортное ядро Паттайи вдоль Pattaya Beach и Beach Road с отелями, торговыми центрами, rooftop-барами и плотной городской resort-атмосферой. Это базовый район для первого знакомства с Паттайей и самым узнаваемым городским beachfront-контуром.

Подходит для:
- первого знакомства с Паттайей;
- прогулок вдоль моря и beachfront life;
- rooftop-баров, шопинга и классической resort-среды.

Текущие Atlas places в этом районе:
- `pty-horizon-rooftop-bar`
- `pty-pattaya-beach`

---

## 1.2 `south-pattaya-pratumnak`
- `slug`: `south-pattaya-pratumnak`
- `name`: `South Pattaya / Pratumnak`
- `name_local`: `พัทยาใต้ / พระตำหนัก`
- `city_slug`: `pty`
- `country_slug`: `thailand`

Краткое описание: южный городской контур Паттайи, где nightlife-ядро Walking Street встречается с холмом Pratumnak и его храмово-обзорной зоной. Это район для тех, кто хочет совместить знаковые панорамы, городской драйв и доступ к Bali Hai / south bay edge.

Подходит для:
- Walking Street и вечерней городской энергии;
- обзорных точек и Big Buddha Hill;
- южного gateway между Pattaya Beach и Jomtien.

Текущие Atlas places в этом районе:
- `pty-big-buddha-hill`
- `pty-walking-street`

---

## 1.3 `naklua-wong-amat`
- `slug`: `naklua-wong-amat`
- `name`: `Naklua / Wong Amat`
- `name_local`: `นาเกลือ / วงศ์อมาตย์`
- `city_slug`: `pty`
- `country_slug`: `thailand`

Краткое описание: северная coastal-зона Большой Паттайи с более спокойной атмосферой, морскими ресторанами и одной из самых известных культурных landmark-локаций города. Это район, где Pattaya становится менее хаотичной и более scenic.

Подходит для:
- seafood-ресторанов у воды;
- более спокойной северной coastal-среды;
- культурных landmark-объектов и sunset dining.

Текущие Atlas places в этом районе:
- `pty-mum-aroi`
- `pty-sanctuary-of-truth`

---

## 1.4 `jomtien`
- `slug`: `jomtien`
- `name`: `Jomtien`
- `name_local`: `จอมเทียน`
- `city_slug`: `pty`
- `country_slug`: `thailand`

Краткое описание: южный пляжный район Паттайи с более расслабленным и семейным ритмом, длинной береговой линией и длинными остановками у моря. Это альтернатива более шумному центру и классический район для спокойного beach stay.

Подходит для:
- более спокойного beach-отдыха;
- семейных и длительных остановок;
- прогулок вдоль длинной береговой линии.

Текущие Atlas places в этом районе:
- `pty-jomtien-beach`

---

## 1.5 `na-jomtien-excursion-zone`
- `slug`: `na-jomtien-excursion-zone`
- `name`: `Na Jomtien Excursion Zone`
- `name_local`: `นาจอมเทียน`
- `city_slug`: `pty`
- `country_slug`: `thailand`

Краткое описание: внешняя resort/excursion-зона к югу от Паттайи, связанная с beachfront-ресторанами, крупными садами и family attractions вдоль Na Jomtien / Na Chom Thian. Это уже не городское ядро Паттайи, а важный внешний cluster для day trips и курортных выездов.

Подходит для:
- beach dining за пределами шумного центра;
- садов, family attractions и тематических парков;
- более спокойного coastal day trip опыта.

Текущие Atlas places в этом районе:
- `pty-nong-nooch-tropical-garden`
- `pty-the-glass-house`

---

# 2. Place Containers

## 2.1 `pattaya-beach`
- `slug`: `pattaya-beach`
- `name`: `Pattaya Beach`
- `type`: `urban-beachfront`
- `city_slug`: `pty`
- `district_slug`: `central-pattaya-beach-road`

Краткое описание: главный beachfront-кластер города с набережной, гостиницами, urban resort life и самой узнаваемой полосой пляжа в Паттайе.

Places inside:
- `pty-pattaya-beach`

---

## 2.2 `walking-street`
- `slug`: `walking-street`
- `name`: `Walking Street`
- `type`: `nightlife-route`
- `city_slug`: `pty`
- `district_slug`: `south-pattaya-pratumnak`

Краткое описание: главный nightlife-route Паттайи между Beach Road и Bali Hai с клубами, барами, ресторанами и яркой вечерней атмосферой.

Places inside:
- `pty-walking-street`

---

## 2.3 `jomtien-beach`
- `slug`: `jomtien-beach`
- `name`: `Jomtien Beach`
- `type`: `urban-beachfront`
- `city_slug`: `pty`
- `district_slug`: `jomtien`

Краткое описание: длинный beachfront-кластер южнее центра Паттайи с более спокойной атмосферой и длинной полосой пляжа для семейного и более размеренного отдыха.

Places inside:
- `pty-jomtien-beach`