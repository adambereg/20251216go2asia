# Manila Districts and Containers

Этот файл фиксирует новые сущности для Manila pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `philippines`
- `city_slug`: `mnl`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Манилы.

---

# 1. City Districts

## 1.1 `intramuros-walled-city`
- `slug`: `intramuros-walled-city`
- `name`: `Intramuros / Walled City`
- `name_local`: `Intramuros`
- `city_slug`: `mnl`
- `country_slug`: `philippines`

Краткое описание: историческое испанское ядро Манилы внутри старых стен. Это главный heritage-контур города: колониальная архитектура, plazas, старые каменные улицы, кalesa atmosphere и ключевые исторические landmark-объекты.

Подходит для:
- исторических прогулок и colonial heritage;
- первого знакомства со старой Манилой;
- музеев, площадей и ресторанов в исторической среде.

Текущие Atlas places в этом районе:
- `mnl-barbara-s-heritage-restaurant`
- `mnl-barbaras-heritage-restaurant`
- `mnl-intramuros`

---

## 1.2 `binondo-chinatown`
- `slug`: `binondo-chinatown`
- `name`: `Binondo / Chinatown`
- `name_local`: `Binondo`
- `city_slug`: `mnl`
- `country_slug`: `philippines`

Краткое описание: старейший Chinatown в мире и один из самых узнаваемых urban food-and-trade контуров Манилы. Район связан с китайско-филиппинским наследием, food walks, старыми торговыми улицами и плотной городской энергией.

Подходит для:
- Chinatown experience и food walks;
- уличной еды, старых лавок и рынков;
- более плотного и живого городского ритма.

Текущие Atlas places в этом районе:
- `mnl-binondo`

---

## 1.3 `rizal-park-ermita`
- `slug`: `rizal-park-ermita`
- `name`: `Rizal Park / Ermita`
- `name_local`: `Ermita`
- `city_slug`: `mnl`
- `country_slug`: `philippines`

Краткое описание: центральный civic-and-park контур вдоль Roxas Boulevard и Luneta. Здесь Манила раскрывается через национальные символы, большие открытые пространства, Manila Bay edge и более официальный, монументальный городской слой.

Подходит для:
- городских landmark-объектов и больших civic spaces;
- прогулок по парку и boulevard edge;
- первого знакомства с национальным символическим центром Манилы.

Текущие Atlas places в этом районе:
- `mnl-rizal-park`

---

## 1.4 `malate-roxas-boulevard`
- `slug`: `malate-roxas-boulevard`
- `name`: `Malate / Roxas Boulevard`
- `name_local`: `Malate`
- `city_slug`: `mnl`
- `country_slug`: `philippines`

Краткое описание: южный coastal-urban контур вдоль Roxas Boulevard с классическими филиппинскими ресторанами, bayfront traffic corridor и старым leisure-layer Манилы. Это зона более повседневного городского опыта за пределами postcard heritage core.

Подходит для:
- классических филиппинских ресторанов;
- bayfront boulevard experience;
- более локального urban Manila вне исторического ядра.

Текущие Atlas places в этом районе:
- `mnl-the-aristocrat-restaurant`

---

# 2. Place Containers

## 2.1 `intramuros-manila`
- `slug`: `intramuros-manila`
- `name`: `Intramuros Manila`
- `type`: `historic-walled-city-cluster`
- `city_slug`: `mnl`
- `district_slug`: `intramuros-walled-city`

Краткое описание: исторический walled-city cluster, воспринимаемый как самостоятельная destination-zone, а не одна точка.

Places inside:
- `mnl-intramuros`

---

## 2.2 `binondo-chinatown`
- `slug`: `binondo-chinatown`
- `name`: `Binondo Chinatown`
- `type`: `historic-chinatown-cluster`
- `city_slug`: `mnl`
- `district_slug`: `binondo-chinatown`

Краткое описание: Chinatown cluster с food streets, торговыми кварталами и китайско-филиппинским наследием.

Places inside:
- `mnl-binondo`

---

## 2.3 `rizal-park-luneta`
- `slug`: `rizal-park-luneta`
- `name`: `Rizal Park Luneta`
- `type`: `urban-park-monument-cluster`
- `city_slug`: `mnl`
- `district_slug`: `rizal-park-ermita`

Краткое описание: большой civic-park cluster Luneta / Rizal Park как самостоятельная destination-zone, а не одиночная точка.

Places inside:
- `mnl-rizal-park`
