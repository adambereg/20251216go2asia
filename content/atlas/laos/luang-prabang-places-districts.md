# Luang Prabang Places → Districts / Containers

Этот файл фиксирует связи для **13 мест Луанг Прабанга, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `laos`
- `city_slug`: `lpq`

---

## 1. Alms Giving Ceremony
- `slug`: `lpq-alms-giving-ceremony`
- `name`: `Alms Giving Ceremony`

### Place → District
- `district_slug`: `old-town-peninsula`
- `district_name`: `Old Town Peninsula`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: утренний alms giving проходит по улицам исторического old town peninsula и связан именно с heritage-core Луанг Прабанга.

---

## 2. Bouang Asian Eatery
- `slug`: `lpq-bouang-asian-eatery`
- `name`: `Bouang Asian Eatery`

### Place → District
- `district_slug`: `mekong-riverside-ban-vat-sene`
- `district_name`: `Mekong Riverside / Ban Vat Sene`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан живёт в riverside-contour старого города у Mekong и логично относится к waterfront dining зоне, а не к отдельной excursion-area.

---

## 3. Dyen Sabai Restaurant
- `slug`: `lpq-dyen-sabai-restaurant`
- `name`: `Dyen Sabai Restaurant`

### Place → District
- `district_slug`: `nam-khan-opposite-bank`
- `district_name`: `Nam Khan Opposite Bank`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Dyen Sabai находится на противоположном берегу Nam Khan и связан с bamboo bridge / boat crossing experience, поэтому его удобно выносить в отдельный quiet riverside cluster.

---

## 4. Joma Bakery Café
- `slug`: `lpq-joma-bakery-cafe`
- `name`: `Joma Bakery Café`

### Place → District
- `district_slug`: `old-town-peninsula`
- `district_name`: `Old Town Peninsula`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это центральная old-town café point в heritage core Луанг Прабанга.

---

## 5. Kuang Si Falls
- `slug`: `lpq-kuang-si-falls`
- `name`: `Kuang Si Falls`

### Place → District
- `district_slug`: `kuang-si-excursion-zone`
- `district_name`: `Kuang Si Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Kuang Si — классическая внешняя природная excursion-zone к юго-западу от города. Контейнер не нужен, потому что сама локация уже destination-scale entity.

---

## 6. Manda de Laos
- `slug`: `lpq-manda-de-laos`
- `name`: `Manda de Laos`

### Place → District
- `district_slug`: `old-town-peninsula`
- `district_name`: `Old Town Peninsula`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан operationally привязан к центральному old-town contour и heritage dining layer Луанг Прабанга.

---

## 7. Mount Phousi
- `slug`: `lpq-mount-phousi`
- `name`: `Mount Phousi`

### Place → District
- `district_slug`: `old-town-peninsula`
- `district_name`: `Old Town Peninsula`

### Place → Container
- `container_slug`: `luang-prabang-old-town`
- `container_name`: `Luang Prabang Old Town`

Пояснение: Mount Phousi — ключевой landmark внутри historic peninsula, поэтому логично живёт в district `old-town-peninsula` и внутри container-level old town cluster.

---

## 8. Night Market
- `slug`: `lpq-night-market`
- `name`: `Night Market`

### Place → District
- `district_slug`: `old-town-peninsula`
- `district_name`: `Old Town Peninsula`

### Place → Container
- `container_slug`: `luang-prabang-night-market`
- `container_name`: `Luang Prabang Night Market`

Пояснение: это не одна точка, а самостоятельный evening market corridor внутри старого города. Поэтому нужен container.

---

## 9. Pak Ou Caves
- `slug`: `lpq-pak-ou-caves`
- `name`: `Pak Ou Caves`

### Place → District
- `district_slug`: `pak-ou-excursion-zone`
- `district_name`: `Pak Ou Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Pak Ou — внешний river excursion cluster вверх по Mekong, а не городской район. Контейнер не нужен на текущем этапе.

---

## 10. Royal Palace Museum
- `slug`: `lpq-royal-palace-museum`
- `name`: `Royal Palace Museum`

### Place → District
- `district_slug`: `old-town-peninsula`
- `district_name`: `Old Town Peninsula`

### Place → Container
- `container_slug`: `luang-prabang-old-town`
- `container_name`: `Luang Prabang Old Town`

Пояснение: музей — одна из главных heritage anchors historic peninsula и естественно живёт внутри old town container.

---

## 11. Tamarind Restaurant
- `slug`: `lpq-tamarind-restaurant`
- `name`: `Tamarind Restaurant`

### Place → District
- `district_slug`: `old-town-peninsula`
- `district_name`: `Old Town Peninsula`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан связан с classic old-town dining experience внутри heritage core.

---

## 12. Utopia Bar
- `slug`: `lpq-utopia-bar`
- `name`: `Utopia Bar`

### Place → District
- `district_slug`: `mekong-riverside-ban-vat-sene`
- `district_name`: `Mekong Riverside / Ban Vat Sene`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: operationally это part of riverside evening/social layer старого города, а не отдельная excursion or temple cluster.

---

## 13. Wat Xieng Thong
- `slug`: `lpq-wat-xieng-thong`
- `name`: `Wat Xieng Thong`

### Place → District
- `district_slug`: `old-town-peninsula`
- `district_name`: `Old Town Peninsula`

### Place → Container
- `container_slug`: `luang-prabang-old-town`
- `container_name`: `Luang Prabang Old Town`

Пояснение: храм находится у оконечности исторического peninsula, где Mekong и Nam Khan сходятся, и является одним из ключевых символов old Luang Prabang.

---

# Summary

## District links
- `lpq-alms-giving-ceremony` → `old-town-peninsula`
- `lpq-bouang-asian-eatery` → `mekong-riverside-ban-vat-sene`
- `lpq-dyen-sabai-restaurant` → `nam-khan-opposite-bank`
- `lpq-joma-bakery-cafe` → `old-town-peninsula`
- `lpq-kuang-si-falls` → `kuang-si-excursion-zone`
- `lpq-manda-de-laos` → `old-town-peninsula`
- `lpq-mount-phousi` → `old-town-peninsula`
- `lpq-night-market` → `old-town-peninsula`
- `lpq-pak-ou-caves` → `pak-ou-excursion-zone`
- `lpq-royal-palace-museum` → `old-town-peninsula`
- `lpq-tamarind-restaurant` → `old-town-peninsula`
- `lpq-utopia-bar` → `mekong-riverside-ban-vat-sene`
- `lpq-wat-xieng-thong` → `old-town-peninsula`

## Container links
- `lpq-mount-phousi` → `luang-prabang-old-town`
- `lpq-night-market` → `luang-prabang-night-market`
- `lpq-royal-palace-museum` → `luang-prabang-old-town`
- `lpq-wat-xieng-thong` → `luang-prabang-old-town`

## Places without container
- `lpq-alms-giving-ceremony`
- `lpq-bouang-asian-eatery`
- `lpq-dyen-sabai-restaurant`
- `lpq-joma-bakery-cafe`
- `lpq-kuang-si-falls`
- `lpq-manda-de-laos`
- `lpq-pak-ou-caves`
- `lpq-tamarind-restaurant`
- `lpq-utopia-bar`
