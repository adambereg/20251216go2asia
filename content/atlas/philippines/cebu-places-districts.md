# Cebu Places → Districts / Containers

Этот файл фиксирует связи для **7 мест Себу, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `philippines`
- `city_slug`: `ceb`

---

## 1. Basilica Minore del Santo Niño & Magellan’s Cross
- `slug`: `ceb-basilica-minore-del-santo-nino-magellan-s-cross`
- `name`: `Basilica Minore del Santo Niño & Magellan’s Cross`

### Place → District
- `district_slug`: `colonial-port-core`
- `district_name`: `Colonial Port Core`

### Place → Container
- `container_slug`: `santo-nino-magellans-cross`
- `container_name`: `Santo Niño & Magellan’s Cross`

Пояснение: связка Basilica + Magellan’s Cross живёт внутри исторического ядра Cebu City у Plaza Sugbo и логично оформляется как compact heritage/religious cluster, а не как одиночная точка. Basilica complex и Magellan’s Cross находятся рядом в city block around Osmeña Boulevard. citeturn214108search1turn214108search21

---

## 2. Basilica Minore del Santo Niño & Magellan’s Cross
- `slug`: `ceb-basilica-minore-del-santo-nio-magellans-cross`
- `name`: `Basilica Minore del Santo Niño & Magellan’s Cross`

### Place → District
- `district_slug`: `colonial-port-core`
- `district_name`: `Colonial Port Core`

### Place → Container
- `container_slug`: `santo-nino-magellans-cross`
- `container_name`: `Santo Niño & Magellan’s Cross`

Пояснение: это дублирующий slug-вариант того же heritage case в текущем dataset, поэтому ему сохраняется та же district/container привязка, что и у основной записи.

---

## 3. Cebu Taoist Temple
- `slug`: `ceb-cebu-taoist-temple`
- `name`: `Cebu Taoist Temple`

### Place → District
- `district_slug`: `lahug-beverly-hills`
- `district_name`: `Lahug / Beverly Hills`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храм находится в Beverly Hills Subdivision в Lahug и относится к upland scenic-contour севернее downtown. Контейнер не нужен. citeturn580800search2turn580800search9

---

## 4. Fort San Pedro
- `slug`: `ceb-fort-san-pedro`
- `name`: `Fort San Pedro`

### Place → District
- `district_slug`: `colonial-port-core`
- `district_name`: `Colonial Port Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Fort San Pedro расположен в Plaza Independencia у pier area и логично относится к colonial port core Cebu City. Контейнер не нужен на текущем этапе. citeturn214108search0turn214108search8

---

## 5. House of Lechon
- `slug`: `ceb-house-of-lechon`
- `name`: `House of Lechon`

### Place → District
- `district_slug`: `lahug-beverly-hills`
- `district_name`: `Lahug / Beverly Hills`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: House of Lechon на Acacia Street operationally лучше живёт в северном urban contour Lahug/near-Ayala side, чем в old core. Контейнер не нужен. citeturn580800search11turn580800search20

---

## 6. Kawasan Falls
- `slug`: `ceb-kawasan-falls`
- `name`: `Kawasan Falls`

### Place → District
- `district_slug`: `badian-kawasan-excursion-zone`
- `district_name`: `Badian / Kawasan Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Kawasan Falls находится в Badian / Barangay Matutinao на юго-западе Cebu island и это явный внешний excursion cluster, а не городской район Cebu City. Контейнер не нужен. citeturn580800search3turn580800search7

---

## 7. Larsian BBQ
- `slug`: `ceb-larsian-bbq`
- `name`: `Larsian BBQ`

### Place → District
- `district_slug`: `fuente-capitol-urban-core`
- `district_name`: `Fuente / Capitol Urban Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Larsian традиционно связан с Fuente Osmeña / Capitol Site area near Chong Hua and Robinsons Cybergate, поэтому логично относится к central urban dining contour. Контейнер не нужен. citeturn214108search6turn214108search18turn214108search22

---

# Summary

## District links
- `ceb-basilica-minore-del-santo-nino-magellan-s-cross` → `colonial-port-core`
- `ceb-basilica-minore-del-santo-nio-magellans-cross` → `colonial-port-core`
- `ceb-cebu-taoist-temple` → `lahug-beverly-hills`
- `ceb-fort-san-pedro` → `colonial-port-core`
- `ceb-house-of-lechon` → `lahug-beverly-hills`
- `ceb-kawasan-falls` → `badian-kawasan-excursion-zone`
- `ceb-larsian-bbq` → `fuente-capitol-urban-core`

## Container links
- `ceb-basilica-minore-del-santo-nino-magellan-s-cross` → `santo-nino-magellans-cross`
- `ceb-basilica-minore-del-santo-nio-magellans-cross` → `santo-nino-magellans-cross`

## Places without container
- `ceb-cebu-taoist-temple`
- `ceb-fort-san-pedro`
- `ceb-house-of-lechon`
- `ceb-kawasan-falls`
- `ceb-larsian-bbq`
