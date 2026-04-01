# Lombok Places → Districts / Containers

Этот файл фиксирует связи для **12 мест Ломбока, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `indonesia`
- `city_slug`: `lom`

---

## 1. Ashtari Lounge & Kitchen
- `slug`: `lom-ashtari-lounge-kitchen`
- `name`: `Ashtari Lounge & Kitchen`

### Place → District
- `district_slug`: `kuta-south-coast`
- `district_name`: `Kuta South Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место относится к Kuta Lombok / South Lombok coastal contour и логично живёт в южном café-and-viewpoint кластере. Контейнер не нужен.

---

## 2. El Bazar Café & Restaurant
- `slug`: `lom-el-bazar-cafe-restaurant`
- `name`: `El Bazar Café & Restaurant`

### Place → District
- `district_slug`: `kuta-south-coast`
- `district_name`: `Kuta South Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится в heart of Kuta Lombok и логично относится к южному town-and-dining contour. Контейнер не нужен.

---

## 3. Gili Islands
- `slug`: `lom-gili-islands`
- `name`: `Gili Islands`

### Place → District
- `district_slug`: `gili-islands-excursion-zone`
- `district_name`: `Gili Islands Excursion Zone`

### Place → Container
- `container_slug`: `gili-islands`
- `container_name`: `Gili Islands`

Пояснение: это не одна точка, а целый island-cluster, поэтому place логично живёт как container-сущность внутри внешней excursion-zone.

---

## 4. Kuta Lombok
- `slug`: `lom-kuta-lombok`
- `name`: `Kuta Lombok`

### Place → District
- `district_slug`: `kuta-south-coast`
- `district_name`: `Kuta South Coast`

### Place → Container
- `container_slug`: `kuta-lombok`
- `container_name`: `Kuta Lombok`

Пояснение: это не единичный объект, а самостоятельный coastal town cluster южного Ломбока. Поэтому нужен container.

---

## 5. Lombok Coffee House
- `slug`: `lom-lombok-coffee-house`
- `name`: `Lombok Coffee House`

### Place → District
- `district_slug`: `kuta-south-coast`
- `district_name`: `Kuta South Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: кофейня относится к Kuta Lombok urban café contour. Контейнер не нужен.

---

## 6. Mount Rinjani National Park
- `slug`: `lom-mount-rinjani-national-park`
- `name`: `Mount Rinjani National Park`

### Place → District
- `district_slug`: `senaru-rinjani-north`
- `district_name`: `Senaru / Rinjani North`

### Place → Container
- `container_slug`: `mount-rinjani-national-park`
- `container_name`: `Mount Rinjani National Park`

Пояснение: это крупная природная destination-entity и самостоятельный national park cluster, поэтому нужен container.

---

## 7. Selong Belanak Beach
- `slug`: `lom-selong-belanak-beach`
- `name`: `Selong Belanak Beach`

### Place → District
- `district_slug`: `selong-belanak-southwest`
- `district_name`: `Selong Belanak Southwest`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: пляж относится к отдельному юго-западному coastal contour Ломбока, а не к Kuta town core. Контейнер не нужен на текущем этапе.

---

## 8. Sendang Gile Waterfall
- `slug`: `lom-sendang-gile-waterfall`
- `name`: `Sendang Gile Waterfall`

### Place → District
- `district_slug`: `senaru-rinjani-north`
- `district_name`: `Senaru / Rinjani North`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: водопад расположен в Senaru area у подножия Rinjani и логично относится к северному mountain-and-waterfalls contour. Контейнер не нужен.

---

## 9. Senggigi Seafood Market & BBQ
- `slug`: `lom-senggigi-seafood-market-bbq`
- `name`: `Senggigi Seafood Market & BBQ`

### Place → District
- `district_slug`: `senggigi-west-coast`
- `district_name`: `Senggigi West Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место относится к Senggigi west coast resort contour. Контейнер не нужен.

---

## 10. Surf Shack Lombok
- `slug`: `lom-surf-shack-lombok`
- `name`: `Surf Shack Lombok`

### Place → District
- `district_slug`: `kuta-south-coast`
- `district_name`: `Kuta South Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: surf-oriented place относится к Kuta South Lombok urban-surf contour. Контейнер не нужен.

---

## 11. Tanjung Aan Beach
- `slug`: `lom-tanjung-aan-beach`
- `name`: `Tanjung Aan Beach`

### Place → District
- `district_slug`: `kuta-south-coast`
- `district_name`: `Kuta South Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: пляж тесно связан с Kuta / Mandalika south coast experience и включён в тот же operational district. Контейнер не нужен на текущем этапе.

---

## 12. The Mexican in Lombok
- `slug`: `lom-the-mexican-in-lombok`
- `name`: `The Mexican in Lombok`

### Place → District
- `district_slug`: `kuta-south-coast`
- `district_name`: `Kuta South Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место относится к Kuta Lombok dining contour. Контейнер не нужен.

---

# Summary

## District links
- `lom-ashtari-lounge-kitchen` → `kuta-south-coast`
- `lom-el-bazar-cafe-restaurant` → `kuta-south-coast`
- `lom-gili-islands` → `gili-islands-excursion-zone`
- `lom-kuta-lombok` → `kuta-south-coast`
- `lom-lombok-coffee-house` → `kuta-south-coast`
- `lom-mount-rinjani-national-park` → `senaru-rinjani-north`
- `lom-selong-belanak-beach` → `selong-belanak-southwest`
- `lom-sendang-gile-waterfall` → `senaru-rinjani-north`
- `lom-senggigi-seafood-market-bbq` → `senggigi-west-coast`
- `lom-surf-shack-lombok` → `kuta-south-coast`
- `lom-tanjung-aan-beach` → `kuta-south-coast`
- `lom-the-mexican-in-lombok` → `kuta-south-coast`

## Container links
- `lom-gili-islands` → `gili-islands`
- `lom-kuta-lombok` → `kuta-lombok`
- `lom-mount-rinjani-national-park` → `mount-rinjani-national-park`

## Places without container
- `lom-ashtari-lounge-kitchen`
- `lom-el-bazar-cafe-restaurant`
- `lom-lombok-coffee-house`
- `lom-selong-belanak-beach`
- `lom-sendang-gile-waterfall`
- `lom-senggigi-seafood-market-bbq`
- `lom-surf-shack-lombok`
- `lom-tanjung-aan-beach`
- `lom-the-mexican-in-lombok`
