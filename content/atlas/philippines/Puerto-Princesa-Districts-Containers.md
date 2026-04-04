# Puerto Princesa Districts and Containers

Этот файл фиксирует новые сущности для Puerto Princesa pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `philippines`
- `city_slug`: `pps`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Пуэрто-Принцесы.

---

# 1. City Districts

## 1.1 `puerto-princesa-city-centre`
- `slug`: `puerto-princesa-city-centre`
- `name`: `Puerto Princesa City Centre`
- `name_local`: `Puerto Princesa City`
- `city_slug`: `pps`
- `country_slug`: `philippines`

Краткое описание: основной городской контур Пуэрто-Принцесы вокруг Rizal Avenue и центральных кварталов недалеко от аэропорта. Это базовый городской слой для ресторанов, повседневного city life и первого знакомства с городом как gateway по Палавану.

Подходит для:
- городских ресторанов и casual dining;
- коротких прогулок и базирования перед поездками по Палавану;
- первого знакомства с Puerto Princesa как транспортным и сервисным центром.

Текущие Atlas places в этом районе:
- `pps-kalui-restaurant`
- `pps-kinabuch-s-grill-bar`
- `pps-kinabuchs-grill-bar`

---

## 1.2 `sabang-underground-river-excursion-zone`
- `slug`: `sabang-underground-river-excursion-zone`
- `name`: `Sabang / Underground River Excursion Zone`
- `name_local`: `Sabang`
- `city_slug`: `pps`
- `country_slug`: `philippines`

Краткое описание: внешняя природная excursion-zone на западном побережье Palawan north-west of Puerto Princesa, связанная с Puerto Princesa Subterranean River National Park и поездками в Sabang. Это не городской район, а главный nature day-trip cluster текущего Puerto Princesa dataset.

Подходит для:
- underground river tours;
- day trips из Puerto Princesa;
- природных и karst-landscape маршрутов вне городского ядра.

Текущие Atlas places в этом районе:
- `pps-puerto-princesa-subterranean-river-national-park`

---

## 1.3 `el-nido-bacuit-excursion-zone`
- `slug`: `el-nido-bacuit-excursion-zone`
- `name`: `El Nido / Bacuit Excursion Zone`
- `name_local`: `El Nido`
- `city_slug`: `pps`
- `country_slug`: `philippines`

Краткое описание: внешний northern Palawan island-hopping cluster, связанный с El Nido и Bacuit Archipelago. Для текущего Atlas это не район Пуэрто-Принцесы в строгом смысле, а удалённая destination/excursion-zone, которая попала в Puerto Princesa dataset operationally.

Подходит для:
- island hopping и архипелага Bacuit;
- lagoon и limestone-seascape experience;
- extended trips по северному Палавану.

Текущие Atlas places в этом районе:
- `pps-el-nido-bacuit-archipelago`

---

## 1.4 `coron-kayangan-excursion-zone`
- `slug`: `coron-kayangan-excursion-zone`
- `name`: `Coron / Kayangan Excursion Zone`
- `name_local`: `Coron`
- `city_slug`: `pps`
- `country_slug`: `philippines`

Краткое описание: внешний excursion-zone cluster в Coron / Calamian Islands, связанный с Kayangan Lake. Это не часть городского контура Puerto Princesa, а отдельная remote island destination, сохранённая в текущем Atlas dataset без перепривязки city assignment.

Подходит для:
- island day trips и Coron highlights;
- озёр, limestone cliffs и boat-based excursions;
- remote Palawan destination layer.

Текущие Atlas places в этом районе:
- `pps-kayangan-lake-coron`

---

## 1.5 `tubbataha-liveaboard-excursion-zone`
- `slug`: `tubbataha-liveaboard-excursion-zone`
- `name`: `Tubbataha Liveaboard Excursion Zone`
- `name_local`: `Tubbataha`
- `city_slug`: `pps`
- `country_slug`: `philippines`

Краткое описание: внешний marine expedition cluster в Sulu Sea, связанный с Tubbataha Reefs Natural Park и liveaboard departures from Puerto Princesa. Это не городской район, а special expedition-layer destination, operationally привязанная к Puerto Princesa как departure gateway.

Подходит для:
- liveaboard dive expeditions;
- marine protected area experience;
- advanced remote nature travel из Puerto Princesa.

Текущие Atlas places в этом районе:
- `pps-tubbataha-reefs-natural-park`

---

# 2. Place Containers

Для текущего Puerto Princesa набора отдельные `place_containers` не требуются.

Все текущие места либо являются самостоятельными городскими ресторанами, либо уже выступают как destination-scale entities / excursion destinations.

