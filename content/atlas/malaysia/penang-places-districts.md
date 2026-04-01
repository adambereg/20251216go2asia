# Penang Places → Districts / Containers

Этот файл фиксирует связи для **11 мест Пенанга, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `malaysia`
- `city_slug`: `png`

---

## 1. Cheong Fatt Tze – Blue Mansion
- `slug`: `png-cheong-fatt-tze-blue-mansion`
- `name`: `Cheong Fatt Tze – Blue Mansion`

### Place → District
- `district_slug`: `heritage-core-armenian-beach-street`
- `district_name`: `Heritage Core / Armenian Street / Beach Street`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Blue Mansion находится на Leith Street в heritage core George Town и логично относится к историческому urban-контуру старого города. Контейнер не нужен.

---

## 2. China House
- `slug`: `png-china-house`
- `name`: `China House`

### Place → District
- `district_slug`: `heritage-core-armenian-beach-street`
- `district_name`: `Heritage Core / Armenian Street / Beach Street`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: China House находится на Beach Street в старом George Town и живёт в плотном heritage/café слое UNESCO core. Контейнер не нужен.

---

## 3. Clan Jetties of Penang
- `slug`: `png-clan-jetties-of-penang`
- `name`: `Clan Jetties of Penang`

### Place → District
- `district_slug`: `weld-quay-clan-jetties`
- `district_name`: `Weld Quay / Clan Jetties`

### Place → Container
- `container_slug`: `clan-jetties`
- `container_name`: `Clan Jetties`

Пояснение: это не одна точка, а самостоятельный waterfront heritage cluster у Weld Quay. Поэтому нужен container.

---

## 4. George Town UNESCO World Heritage Area
- `slug`: `png-george-town-unesco-world-heritage-area`
- `name`: `George Town UNESCO World Heritage Area`

### Place → District
- `district_slug`: `heritage-core-armenian-beach-street`
- `district_name`: `Heritage Core / Armenian Street / Beach Street`

### Place → Container
- `container_slug`: `george-town-unesco-core`
- `container_name`: `George Town UNESCO Core`

Пояснение: это не единичный объект, а весь исторический city-core cluster George Town. Поэтому нужен container.

---

## 5. Gurney Drive Hawker Centre
- `slug`: `png-gurney-drive-hawker-centre`
- `name`: `Gurney Drive Hawker Centre`

### Place → District
- `district_slug`: `gurney-pulau-tikus`
- `district_name`: `Gurney / Pulau Tikus`

### Place → Container
- `container_slug`: `gurney-drive-promenade`
- `container_name`: `Gurney Drive Promenade`

Пояснение: hawker centre живёт внутри более широкого seafront lifestyle cluster Gurney Drive, поэтому container уместен.

---

## 6. Jawi House Café Gallery
- `slug`: `png-jawi-house-cafe-gallery`
- `name`: `Jawi House Café Gallery`

### Place → District
- `district_slug`: `heritage-core-armenian-beach-street`
- `district_name`: `Heritage Core / Armenian Street / Beach Street`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Jawi House находится в старом George Town и логично относится к heritage dining/culture contour. Контейнер не нужен.

---

## 7. Kek Lok Si Temple
- `slug`: `png-kek-lok-si-temple`
- `name`: `Kek Lok Si Temple`

### Place → District
- `district_slug`: `ayer-itam-penang-hill`
- `district_name`: `Ayer Itam / Penang Hill`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храм расположен в Ayer Itam у подножия Penang Hill и живёт в отдельном hill-and-temple контуре. Контейнер не нужен.

---

## 8. Penang Hill
- `slug`: `png-penang-hill`
- `name`: `Penang Hill`

### Place → District
- `district_slug`: `ayer-itam-penang-hill`
- `district_name`: `Ayer Itam / Penang Hill`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это самостоятельная крупная hill destination-entity, поэтому отдельный container не нужен.

---

## 9. Penang Street Art
- `slug`: `png-penang-street-art`
- `name`: `Penang Street Art`

### Place → District
- `district_slug`: `heritage-core-armenian-beach-street`
- `district_name`: `Heritage Core / Armenian Street / Beach Street`

### Place → Container
- `container_slug`: `penang-street-art-route`
- `container_name`: `Penang Street Art Route`

Пояснение: street art — это не одна точка, а маршрут по нескольким улицам heritage core. Поэтому нужен container-route.

---

## 10. Tek Sen Restaurant
- `slug`: `png-tek-sen-restaurant`
- `name`: `Tek Sen Restaurant`

### Place → District
- `district_slug`: `heritage-core-armenian-beach-street`
- `district_name`: `Heritage Core / Armenian Street / Beach Street`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится на Carnarvon Street в историческом George Town и относится к тому же heritage urban-core. Контейнер не нужен.

---

## 11. The Top Komtar Sky Dining
- `slug`: `png-the-top-komtar-sky-dining`
- `name`: `The Top Komtar Sky Dining`

### Place → District
- `district_slug`: `komtar-prangin-city-centre`
- `district_name`: `Komtar / Prangin City Centre`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: venue находится в Komtar Tower и логично относится к современному city-centre contour George Town. Контейнер не нужен.

---

# Summary

## District links
- `png-cheong-fatt-tze-blue-mansion` → `heritage-core-armenian-beach-street`
- `png-china-house` → `heritage-core-armenian-beach-street`
- `png-clan-jetties-of-penang` → `weld-quay-clan-jetties`
- `png-george-town-unesco-world-heritage-area` → `heritage-core-armenian-beach-street`
- `png-gurney-drive-hawker-centre` → `gurney-pulau-tikus`
- `png-jawi-house-cafe-gallery` → `heritage-core-armenian-beach-street`
- `png-kek-lok-si-temple` → `ayer-itam-penang-hill`
- `png-penang-hill` → `ayer-itam-penang-hill`
- `png-penang-street-art` → `heritage-core-armenian-beach-street`
- `png-tek-sen-restaurant` → `heritage-core-armenian-beach-street`
- `png-the-top-komtar-sky-dining` → `komtar-prangin-city-centre`

## Container links
- `png-clan-jetties-of-penang` → `clan-jetties`
- `png-george-town-unesco-world-heritage-area` → `george-town-unesco-core`
- `png-gurney-drive-hawker-centre` → `gurney-drive-promenade`
- `png-penang-street-art` → `penang-street-art-route`

## Places without container
- `png-cheong-fatt-tze-blue-mansion`
- `png-china-house`
- `png-jawi-house-cafe-gallery`
- `png-kek-lok-si-temple`
- `png-penang-hill`
- `png-tek-sen-restaurant`
- `png-the-top-komtar-sky-dining`
