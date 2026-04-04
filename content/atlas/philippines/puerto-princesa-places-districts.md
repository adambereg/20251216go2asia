# Puerto Princesa Places → Districts / Containers

Этот файл фиксирует связи для **7 мест Puerto Princesa / current PPS dataset**, которые уже есть в Atlas.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `philippines`
- `city_slug`: `pps`

---

## 1. El Nido & Bacuit Archipelago
- `slug`: `pps-el-nido-bacuit-archipelago`
- `name`: `El Nido & Bacuit Archipelago`

### Place → District
- `district_slug`: `el-nido-bacuit-excursion-zone`
- `district_name`: `El Nido / Bacuit Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это удалённая northern Palawan destination, связанная с El Nido и Bacuit Bay, а не городской район Puerto Princesa. Для текущего Atlas слоя место operationally живёт как внешняя excursion-zone. Контейнер не нужен.

---

## 2. KaLui Restaurant
- `slug`: `pps-kalui-restaurant`
- `name`: `KaLui Restaurant`

### Place → District
- `district_slug`: `puerto-princesa-city-centre`
- `district_name`: `Puerto Princesa City Centre`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится в центральной части Puerto Princesa near Rizal Avenue / airport-side city core. Это самостоятельный urban restaurant, контейнер не нужен.

---

## 3. Kayangan Lake, Coron
- `slug`: `pps-kayangan-lake-coron`
- `name`: `Kayangan Lake, Coron`

### Place → District
- `district_slug`: `coron-kayangan-excursion-zone`
- `district_name`: `Coron / Kayangan Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Kayangan Lake находится в Coron area, то есть это удалённый island excursion destination, а не часть городского контура Puerto Princesa. Контейнер не нужен.

---

## 4. Kinabuch’s Grill & Bar
- `slug`: `pps-kinabuch-s-grill-bar`
- `name`: `Kinabuch’s Grill & Bar`

### Place → District
- `district_slug`: `puerto-princesa-city-centre`
- `district_name`: `Puerto Princesa City Centre`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это центральный restaurant/bar case в Puerto Princesa city core, рядом с основным urban contour. Контейнер не нужен.

---

## 5. Kinabuchs Grill & Bar
- `slug`: `pps-kinabuchs-grill-bar`
- `name`: `Kinabuchs Grill & Bar`

### Place → District
- `district_slug`: `puerto-princesa-city-centre`
- `district_name`: `Puerto Princesa City Centre`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: по смыслу это дублирующий slug-вариант того же urban restaurant case в Puerto Princesa. Я сохраняю его как отдельную строку текущего Atlas dataset. Контейнер не нужен.

---

## 6. Puerto Princesa Subterranean River National Park
- `slug`: `pps-puerto-princesa-subterranean-river-national-park`
- `name`: `Puerto Princesa Subterranean River National Park`

### Place → District
- `district_slug`: `sabang-underground-river-excursion-zone`
- `district_name`: `Sabang / Underground River Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: парк и подземная река находятся в Sabang / north-west Palawan и относятся к day-trip zone from Puerto Princesa, а не к самому городскому ядру. Контейнер не нужен, потому что объект уже destination-scale.

---

## 7. Tubbataha Reefs Natural Park
- `slug`: `pps-tubbataha-reefs-natural-park`
- `name`: `Tubbataha Reefs Natural Park`

### Place → District
- `district_slug`: `tubbataha-liveaboard-excursion-zone`
- `district_name`: `Tubbataha Liveaboard Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Tubbataha — удалённая marine expedition destination в Sulu Sea, operationally связанная с Puerto Princesa как liveaboard departure gateway. Контейнер не нужен.

---

# Summary

## District links
- `pps-el-nido-bacuit-archipelago` → `el-nido-bacuit-excursion-zone`
- `pps-kalui-restaurant` → `puerto-princesa-city-centre`
- `pps-kayangan-lake-coron` → `coron-kayangan-excursion-zone`
- `pps-kinabuch-s-grill-bar` → `puerto-princesa-city-centre`
- `pps-kinabuchs-grill-bar` → `puerto-princesa-city-centre`
- `pps-puerto-princesa-subterranean-river-national-park` → `sabang-underground-river-excursion-zone`
- `pps-tubbataha-reefs-natural-park` → `tubbataha-liveaboard-excursion-zone`

## Container links
- none

## Places without container
- `pps-el-nido-bacuit-archipelago`
- `pps-kalui-restaurant`
- `pps-kayangan-lake-coron`
- `pps-kinabuch-s-grill-bar`
- `pps-kinabuchs-grill-bar`
- `pps-puerto-princesa-subterranean-river-national-park`
- `pps-tubbataha-reefs-natural-park`
