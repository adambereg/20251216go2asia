# Singapore Places → Districts / Containers

Этот файл фиксирует связи для **12 мест Сингапура, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `singapore`
- `city_slug`: `sin`

---

## 1. ATLAS Rooftop Bar
- `slug`: `sgp-atlas-rooftop-bar`
- `name`: `ATLAS Rooftop Bar`

### Place → District
- `district_slug`: `bugis-bras-basah`
- `district_name`: `Bugis / Bras Basah`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ATLAS находится в Parkview Square на North Bridge Road и логично относится к Bugis / Bras Basah heritage-and-lifestyle contour.

---

## 2. Gardens by the Bay
- `slug`: `sgp-gardens-by-the-bay`
- `name`: `Gardens by the Bay`

### Place → District
- `district_slug`: `marina-bay-civic-core`
- `district_name`: `Marina Bay / Civic Core`

### Place → Container
- `container_slug`: `gardens-by-the-bay`
- `container_name`: `Gardens by the Bay`

Пояснение: это park-scale destination у Marina Bay, поэтому place живёт как самостоятельный container внутри marina-bay core.

---

## 3. Jewel Changi Airport
- `slug`: `sgp-jewel-changi-airport`
- `name`: `Jewel Changi Airport`

### Place → District
- `district_slug`: `changi-airport-east`
- `district_name`: `Changi Airport / East`

### Place → Container
- `container_slug`: `jewel-changi`
- `container_name`: `Jewel Changi`

Пояснение: Jewel — это не одиночная точка downtown Singapore, а самостоятельный airport-lifestyle cluster у Changi.

---

## 4. JUMBO Seafood
- `slug`: `sgp-jumbo-seafood`
- `name`: `JUMBO Seafood`

### Place → District
- `district_slug`: `singapore-river-clarke-quay`
- `district_name`: `Singapore River / Clarke Quay`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Riverside Point branch у Merchant Road логично относится к riverside dining contour Clarke Quay / Singapore River.

---

## 5. Lau Pa Sat Hawker Centre
- `slug`: `sgp-lau-pa-sat-hawker-centre`
- `name`: `Lau Pa Sat Hawker Centre`

### Place → District
- `district_slug`: `telok-ayer-chinatown-food-core`
- `district_name`: `Telok Ayer / Chinatown Food Core`

### Place → Container
- `container_slug`: `lau-pa-sat`
- `container_name`: `Lau Pa Sat`

Пояснение: historic hawker market на Boon Tat Street — это самостоятельный food cluster.

---

## 6. Long Bar
- `slug`: `sgp-long-bar`
- `name`: `Long Bar`

### Place → District
- `district_slug`: `bugis-bras-basah`
- `district_name`: `Bugis / Bras Basah`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Long Bar находится в Raffles Singapore на Beach Road и логично относится к Bugis / Bras Basah / heritage hotel contour.

---

## 7. Marina Bay Sands SkyPark
- `slug`: `sgp-marina-bay-sands-skypark`
- `name`: `Marina Bay Sands SkyPark`

### Place → District
- `district_slug`: `marina-bay-civic-core`
- `district_name`: `Marina Bay / Civic Core`

### Place → Container
- `container_slug`: `marina-bay-waterfront`
- `container_name`: `Marina Bay Waterfront`

Пояснение: iconic waterfront-skyscraper experience внутри Marina Bay skyline cluster.

---

## 8. Maxwell Food Centre
- `slug`: `sgp-maxwell-food-centre`
- `name`: `Maxwell Food Centre`

### Place → District
- `district_slug`: `telok-ayer-chinatown-food-core`
- `district_name`: `Telok Ayer / Chinatown Food Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Maxwell живёт в Chinatown / Tanjong Pagar edge food core; отдельный container на текущем этапе не нужен.

---

## 9. Merlion Park
- `slug`: `sgp-merlion-park`
- `name`: `Merlion Park`

### Place → District
- `district_slug`: `marina-bay-civic-core`
- `district_name`: `Marina Bay / Civic Core`

### Place → Container
- `container_slug`: `marina-bay-waterfront`
- `container_name`: `Marina Bay Waterfront`

Пояснение: Merlion Park — ключевая bayfront часть Marina Bay waterfront cluster.

---

## 10. Odette
- `slug`: `sgp-odette`
- `name`: `Odette`

### Place → District
- `district_slug`: `marina-bay-civic-core`
- `district_name`: `Marina Bay / Civic Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Odette находится в National Gallery Singapore у civic core / St Andrew’s Road и логично относится к marina-bay civic contour.

---

## 11. Sentosa Island
- `slug`: `sgp-sentosa-island`
- `name`: `Sentosa Island`

### Place → District
- `district_slug`: `sentosa-island-resort-zone`
- `district_name`: `Sentosa Island Resort Zone`

### Place → Container
- `container_slug`: `sentosa-island`
- `container_name`: `Sentosa Island`

Пояснение: это не одна точка, а самостоятельный island resort cluster, поэтому нужен container.

---

## 12. Singapore Botanic Gardens
- `slug`: `sgp-singapore-botanic-gardens`
- `name`: `Singapore Botanic Gardens`

### Place → District
- `district_slug`: `tanglin-botanic-gardens`
- `district_name`: `Tanglin / Botanic Gardens`

### Place → Container
- `container_slug`: `singapore-botanic-gardens`
- `container_name`: `Singapore Botanic Gardens`

Пояснение: это park-scale green destination у Tanglin, поэтому place логично живёт как container.

---

# Summary

## District links
- `sgp-atlas-rooftop-bar` → `bugis-bras-basah`
- `sgp-gardens-by-the-bay` → `marina-bay-civic-core`
- `sgp-jewel-changi-airport` → `changi-airport-east`
- `sgp-jumbo-seafood` → `singapore-river-clarke-quay`
- `sgp-lau-pa-sat-hawker-centre` → `telok-ayer-chinatown-food-core`
- `sgp-long-bar` → `bugis-bras-basah`
- `sgp-marina-bay-sands-skypark` → `marina-bay-civic-core`
- `sgp-maxwell-food-centre` → `telok-ayer-chinatown-food-core`
- `sgp-merlion-park` → `marina-bay-civic-core`
- `sgp-odette` → `marina-bay-civic-core`
- `sgp-sentosa-island` → `sentosa-island-resort-zone`
- `sgp-singapore-botanic-gardens` → `tanglin-botanic-gardens`

## Container links
- `sgp-gardens-by-the-bay` → `gardens-by-the-bay`
- `sgp-jewel-changi-airport` → `jewel-changi`
- `sgp-lau-pa-sat-hawker-centre` → `lau-pa-sat`
- `sgp-marina-bay-sands-skypark` → `marina-bay-waterfront`
- `sgp-merlion-park` → `marina-bay-waterfront`
- `sgp-sentosa-island` → `sentosa-island`
- `sgp-singapore-botanic-gardens` → `singapore-botanic-gardens`

## Places without container
- `sgp-atlas-rooftop-bar`
- `sgp-jumbo-seafood`
- `sgp-long-bar`
- `sgp-maxwell-food-centre`
- `sgp-odette`
