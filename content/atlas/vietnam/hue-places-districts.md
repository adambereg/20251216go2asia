# Hue Places → Districts / Containers

Этот файл фиксирует связи для **19 мест Хюэ, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `vietnam`
- `city_slug`: `hue`

---

## 1. Bach Ma National Park
- `slug`: `hue-bach-ma-national-park`
- `name`: `Bach Ma National Park`

### Place → District
- `district_slug`: `bach-ma-excursion-zone`
- `district_name`: `Bach Ma Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это внешняя mountain-and-forest destination south of Hue, а не городская локация. Контейнер не нужен.

---

## 2. Brown Eyes Bar
- `slug`: `hue-brown-eyes-bar`
- `name`: `Brown Eyes Bar`

### Place → District
- `district_slug`: `south-bank-truong-tien-core`
- `district_name`: `South Bank / Truong Tien Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: бар operationally живёт в центральном южном bank/core nightlife contour Хюэ. Контейнер не нужен.

---

## 3. Cà Phê Muối 142
- `slug`: `hue-ca-phe-muoi-142`
- `name`: `Cà Phê Muối 142`

### Place → District
- `district_slug`: `south-bank-truong-tien-core`
- `district_name`: `South Bank / Truong Tien Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это central-city coffee stop в walkable urban core южного берега. Контейнер не нужен.

---

## 4. Dong Ba Market
- `slug`: `hue-dong-ba-market`
- `name`: `Dong Ba Market`

### Place → District
- `district_slug`: `imperial-citadel-dong-ba`
- `district_name`: `Imperial Citadel / Dong Ba`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: рынок относится к северному историческому и торговому contour у Imperial City. Контейнер не нужен.

---

## 5. Hue Night Market
- `slug`: `hue-hue-night-market`
- `name`: `Hue Night Market`

### Place → District
- `district_slug`: `south-bank-truong-tien-core`
- `district_name`: `South Bank / Truong Tien Core`

### Place → Container
- `container_slug`: `hue-night-market`
- `container_name`: `Hue Night Market`

Пояснение: это не одиночная точка, а evening market corridor в центре Хюэ, поэтому нужен container.

---

## 6. Imperial City Hue
- `slug`: `hue-imperial-city-hue`
- `name`: `Imperial City Hue`

### Place → District
- `district_slug`: `imperial-citadel-dong-ba`
- `district_name`: `Imperial Citadel / Dong Ba`

### Place → Container
- `container_slug`: `imperial-city-hue`
- `container_name`: `Imperial City Hue`

Пояснение: это большой citadel-cluster, а не одна точка, поэтому нужен container.

---

## 7. Imperial Craft Bia Brewpub
- `slug`: `hue-imperial-craft-bia-brewpub`
- `name`: `Imperial Craft Bia Brewpub`

### Place → District
- `district_slug`: `south-bank-truong-tien-core`
- `district_name`: `South Bank / Truong Tien Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: craft-beer stop логично живёт в центральном south-bank evening contour. Контейнер не нужен.

---

## 8. Lien Hoa Vegetarian
- `slug`: `hue-lien-hoa-vegetarian`
- `name`: `Lien Hoa Vegetarian`

### Place → District
- `district_slug`: `south-bank-truong-tien-core`
- `district_name`: `South Bank / Truong Tien Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан operationally привязан к южному urban food core Хюэ. Контейнер не нужен.

---

## 9. Madam Thu Restaurant
- `slug`: `hue-madam-thu-restaurant`
- `name`: `Madam Thu Restaurant`

### Place → District
- `district_slug`: `south-bank-truong-tien-core`
- `district_name`: `South Bank / Truong Tien Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: типичный central dining stop южного банка. Контейнер не нужен.

---

## 10. Nam Giao Altar
- `slug`: `hue-nam-giao-altar`
- `name`: `Nam Giao Altar`

### Place → District
- `district_slug`: `southern-hills-ritual-zone`
- `district_name`: `Southern Hills / Ritual Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ritual heritage site south of core city, логично живёт в southern hills contour. Контейнер не нужен.

---

## 11. Ngu Binh Viewpoint
- `slug`: `hue-ngu-binh-viewpoint`
- `name`: `Ngu Binh Viewpoint`

### Place → District
- `district_slug`: `southern-hills-ritual-zone`
- `district_name`: `Southern Hills / Ritual Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: scenic hill and outlook in the southern green contour. Контейнер не нужен.

---

## 12. Perfume River
- `slug`: `hue-perfume-river`
- `name`: `Perfume River`

### Place → District
- `district_slug`: `south-bank-truong-tien-core`
- `district_name`: `South Bank / Truong Tien Core`

### Place → Container
- `container_slug`: `perfume-river-hue`
- `container_name`: `Perfume River Hue`

Пояснение: это самостоятельный urban riverfront cluster, а не одна точка, поэтому нужен container.

---

## 13. Quán Hanh
- `slug`: `hue-quan-hanh`
- `name`: `Quán Hanh`

### Place → District
- `district_slug`: `south-bank-truong-tien-core`
- `district_name`: `South Bank / Truong Tien Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: local dining stop central to the south-bank core. Контейнер не нужен.

---

## 14. Tam Giang Lagoon
- `slug`: `hue-tam-giang-lagoon`
- `name`: `Tam Giang Lagoon`

### Place → District
- `district_slug`: `tam-giang-lagoon-excursion-zone`
- `district_name`: `Tam Giang Lagoon Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это внешняя природная lagoon destination northeast of Hue. Контейнер не нужен.

---

## 15. The Lab Coffee
- `slug`: `hue-the-lab-coffee`
- `name`: `The Lab Coffee`

### Place → District
- `district_slug`: `south-bank-truong-tien-core`
- `district_name`: `South Bank / Truong Tien Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: specialty coffee stop в центральном urban core Хюэ. Контейнер не нужен.

---

## 16. Thien Mu Pagoda
- `slug`: `hue-thien-mu-pagoda`
- `name`: `Thien Mu Pagoda`

### Place → District
- `district_slug`: `kim-long-thien-mu-west-bank`
- `district_name`: `Kim Long / Thien Mu West Bank`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: знаковая pagoda на западном берегу Perfume River. Контейнер не нужен.

---

## 17. Truong Tien Bridge
- `slug`: `hue-truong-tien-bridge`
- `name`: `Truong Tien Bridge`

### Place → District
- `district_slug`: `south-bank-truong-tien-core`
- `district_name`: `South Bank / Truong Tien Core`

### Place → Container
- `container_slug`: `perfume-river-hue`
- `container_name`: `Perfume River Hue`

Пояснение: мост — часть центрального riverfront cluster у Perfume River, поэтому place логично получает container.

---

## 18. Tu Hieu Pagoda
- `slug`: `hue-tu-hieu-pagoda`
- `name`: `Tu Hieu Pagoda`

### Place → District
- `district_slug`: `southern-hills-ritual-zone`
- `district_name`: `Southern Hills / Ritual Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: тихая pagoda в southern pine-hills contour. Контейнер не нужен.

---

## 19. Vong Canh Hill
- `slug`: `hue-vong-canh-hill`
- `name`: `Vong Canh Hill`

### Place → District
- `district_slug`: `southern-hills-ritual-zone`
- `district_name`: `Southern Hills / Ritual Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: scenic hill south of central Hue, логично живёт в southern hills contour. Контейнер не нужен.

---

# Summary

## District links
- `hue-bach-ma-national-park` → `bach-ma-excursion-zone`
- `hue-brown-eyes-bar` → `south-bank-truong-tien-core`
- `hue-ca-phe-muoi-142` → `south-bank-truong-tien-core`
- `hue-dong-ba-market` → `imperial-citadel-dong-ba`
- `hue-hue-night-market` → `south-bank-truong-tien-core`
- `hue-imperial-city-hue` → `imperial-citadel-dong-ba`
- `hue-imperial-craft-bia-brewpub` → `south-bank-truong-tien-core`
- `hue-lien-hoa-vegetarian` → `south-bank-truong-tien-core`
- `hue-madam-thu-restaurant` → `south-bank-truong-tien-core`
- `hue-nam-giao-altar` → `southern-hills-ritual-zone`
- `hue-ngu-binh-viewpoint` → `southern-hills-ritual-zone`
- `hue-perfume-river` → `south-bank-truong-tien-core`
- `hue-quan-hanh` → `south-bank-truong-tien-core`
- `hue-tam-giang-lagoon` → `tam-giang-lagoon-excursion-zone`
- `hue-the-lab-coffee` → `south-bank-truong-tien-core`
- `hue-thien-mu-pagoda` → `kim-long-thien-mu-west-bank`
- `hue-truong-tien-bridge` → `south-bank-truong-tien-core`
- `hue-tu-hieu-pagoda` → `southern-hills-ritual-zone`
- `hue-vong-canh-hill` → `southern-hills-ritual-zone`

## Container links
- `hue-hue-night-market` → `hue-night-market`
- `hue-imperial-city-hue` → `imperial-city-hue`
- `hue-perfume-river` → `perfume-river-hue`
- `hue-truong-tien-bridge` → `perfume-river-hue`

## Places without container
- `hue-bach-ma-national-park`
- `hue-brown-eyes-bar`
- `hue-ca-phe-muoi-142`
- `hue-dong-ba-market`
- `hue-imperial-craft-bia-brewpub`
- `hue-lien-hoa-vegetarian`
- `hue-madam-thu-restaurant`
- `hue-nam-giao-altar`
- `hue-ngu-binh-viewpoint`
- `hue-quan-hanh`
- `hue-tam-giang-lagoon`
- `hue-the-lab-coffee`
- `hue-thien-mu-pagoda`
- `hue-tu-hieu-pagoda`
- `hue-vong-canh-hill`
