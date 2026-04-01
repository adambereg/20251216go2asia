# Savannakhet Districts and Containers

Этот файл фиксирует новые сущности для Savannakhet pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `laos`
- `city_slug`: `svn`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Саваннакхета.

---

# 1. City Districts

## 1.1 `historic-old-town-riverside`
- `slug`: `historic-old-town-riverside`
- `name`: `Historic Old Town / Riverside`
- `name_local`: `ເມືອງເກົ່າສະຫວັນນະເຂດ`
- `city_slug`: `svn`
- `country_slug`: `laos`

Краткое описание: историческое ядро Саваннакхета вдоль Меконга с французско-колониальными фасадами, старыми улицами, католическим собором, небольшими кафе и расслабленным riverfront-ритмом. Это главный район для первого знакомства с городом и его old-town атмосферой.

Подходит для:
- прогулок по старому городу и колониальной архитектуре;
- набережной Меконга, закатов и вечерней локальной жизни;
- кафе, небольших музеев и спокойного городского ритма.

Текущие Atlas places в этом районе:
- `svk-cafe-inn`
- `svk-lin-s-cafe`
- `svk-mekong-riverside-food-stalls`
- `svk-mekong-riverside-promenade`
- `svk-savannakhet-city-museum`
- `svk-savannakhet-old-town`
- `svk-sinouk-coffee-savannakhet`
- `svk-st-teresa-s-catholic-church`

---

## 1.2 `civic-center-dinosaur-quarter`
- `slug`: `civic-center-dinosaur-quarter`
- `name`: `Civic Center / Dinosaur Quarter`
- `name_local`: `ໃຈກາງເມືອງສະຫວັນນະເຂດ`
- `city_slug`: `svn`
- `country_slug`: `laos`

Краткое описание: центральный городской контур к востоку от riverfront с более утилитарной городской тканью, музеем динозавров, локальными ресторанами и повседневной жизнью Savannakhet Town. Это не столько postcard old town, сколько живой центр небольшого южнолаосского города.

Подходит для:
- локальных ресторанов и городского everyday experience;
- небольших музеев и town-center stopovers;
- более практичного знакомства с городом вне riverfront-романтики.

Текущие Atlas places в этом районе:
- `svk-daosavanh-restaurant`
- `svk-dinosaur-museum`

---

## 1.3 `that-ing-hang-excursion-zone`
- `slug`: `that-ing-hang-excursion-zone`
- `name`: `That Ing Hang Excursion Zone`
- `name_local`: `ທາດອິງຮັງ`
- `city_slug`: `svn`
- `country_slug`: `laos`

Краткое описание: внешняя храмово-паломническая excursion-zone к северо-востоку от Саваннакхета, связанная с одной из самых почитаемых ступ юга Лаоса. Это уже не городской центр, а важный short day-trip cluster для духовной и исторической поездки за пределы old town.

Подходит для:
- храмового и паломнического опыта;
- коротких выездов за пределы городского ядра;
- знакомства с религиозным наследием южного Лаоса.

Текущие Atlas places в этом районе:
- `svk-that-ing-hang-stupa`

---

# 2. Place Containers

## 2.1 `mekong-riverside-promenade`
- `slug`: `mekong-riverside-promenade`
- `name`: `Mekong Riverside Promenade`
- `type`: `urban-riverfront-cluster`
- `city_slug`: `svn`
- `district_slug`: `historic-old-town-riverside`

Краткое описание: длинный riverfront-кластер вдоль Меконга с прогулочной зоной, уличной едой, закатной атмосферой и спокойным вечерним ритмом приграничного города.

Places inside:
- `svk-mekong-riverside-promenade`

## 2.2 `savannakhet-old-town`
- `slug`: `savannakhet-old-town`
- `name`: `Savannakhet Old Town`
- `type`: `urban-old-town-cluster`
- `city_slug`: `svn`
- `district_slug`: `historic-old-town-riverside`

Краткое описание: исторический городской кластер с колониальными фасадами, широкими улицами и ключевыми heritage-точками старого Саваннакхета.

Places inside:
- `svk-savannakhet-old-town`
