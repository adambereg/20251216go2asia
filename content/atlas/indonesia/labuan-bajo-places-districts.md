# Labuan Bajo Places → Districts / Containers

Этот файл фиксирует связи для **12 мест Labuan Bajo, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `indonesia`
- `city_slug`: `lbj`

---

## 1. Atlantis on the Rock
- `slug`: `lbj-atlantis-on-the-rock`
- `name`: `Atlantis on the Rock`

### Place → District
- `district_slug`: `waecicu-north-bay`
- `district_name`: `Waecicu / North Bay`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан Plataran расположен на Waecicu Beach, то есть относится не к harbor core, а к северо-западной resort bay зоне. Контейнер не нужен.

---

## 2. Bajo Taco
- `slug`: `lbj-bajo-taco`
- `name`: `Bajo Taco`

### Place → District
- `district_slug`: `central-harbor-waterfront`
- `district_name`: `Central Harbor / Waterfront`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: городское casual café в центральном контуре Labuan Bajo, ближе к harbor/walkable core. Контейнер не нужен.

---

## 3. Batu Cermin Cave
- `slug`: `lbj-batu-cermin-cave`
- `name`: `Batu Cermin Cave`

### Place → District
- `district_slug`: `batu-cermin-wae-sambi`
- `district_name`: `Batu Cermin / Wae Sambi`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: cave-локация находится к востоку от центра в зоне Batu Cermin / Wae Sambi. Контейнер не нужен.

---

## 4. Happy Banana Komodo
- `slug`: `lbj-happy-banana-komodo`
- `name`: `Happy Banana Komodo`

### Place → District
- `district_slug`: `central-harbor-waterfront`
- `district_name`: `Central Harbor / Waterfront`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это популярное городское кафе в walkable Labuan Bajo core, а не в внешних excursion-зонах. Контейнер не нужен.

---

## 5. Komodo National Park
- `slug`: `lbj-komodo-national-park`
- `name`: `Komodo National Park`

### Place → District
- `district_slug`: `komodo-marine-excursion-zone`
- `district_name`: `Komodo Marine Excursion Zone`

### Place → Container
- `container_slug`: `komodo-national-park`
- `container_name`: `Komodo National Park`

Пояснение: это не одиночная точка, а umbrella destination-cluster для islands, beaches, dives и boat routes. Поэтому place живёт как container-сущность.

---

## 6. La Cucina
- `slug`: `lbj-la-cucina`
- `name`: `La Cucina`

### Place → District
- `district_slug`: `waecicu-north-bay`
- `district_name`: `Waecicu / North Bay`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан AYANA Komodo находится на Waecicu Beach и относится к resort bay contour. Контейнер не нужен.

---

## 7. Labuan Bajo Sunset Harbor
- `slug`: `lbj-labuan-bajo-sunset-harbor`
- `name`: `Labuan Bajo Sunset Harbor`

### Place → District
- `district_slug`: `central-harbor-waterfront`
- `district_name`: `Central Harbor / Waterfront`

### Place → Container
- `container_slug`: `labuan-bajo-harbor`
- `container_name`: `Labuan Bajo Harbor`

Пояснение: harbor waterfront — это не просто точка, а самостоятельный городской cluster с promenade и лодками. Поэтому нужен container.

---

## 8. Manta Point
- `slug`: `lbj-manta-point`
- `name`: `Manta Point`

### Place → District
- `district_slug`: `komodo-marine-excursion-zone`
- `district_name`: `Komodo Marine Excursion Zone`

### Place → Container
- `container_slug`: `komodo-national-park`
- `container_name`: `Komodo National Park`

Пояснение: snorkeling/diving spot живёт внутри большего marine cluster Komodo National Park. Поэтому логичен container.

---

## 9. Padar Island Viewpoint
- `slug`: `lbj-padar-island-viewpoint`
- `name`: `Padar Island Viewpoint`

### Place → District
- `district_slug`: `komodo-marine-excursion-zone`
- `district_name`: `Komodo Marine Excursion Zone`

### Place → Container
- `container_slug`: `komodo-national-park`
- `container_name`: `Komodo National Park`

Пояснение: viewpoint является частью island-hopping cluster Komodo National Park, а не отдельным городским объектом.

---

## 10. Pink Beach
- `slug`: `lbj-pink-beach`
- `name`: `Pink Beach`

### Place → District
- `district_slug`: `komodo-marine-excursion-zone`
- `district_name`: `Komodo Marine Excursion Zone`

### Place → Container
- `container_slug`: `komodo-national-park`
- `container_name`: `Komodo National Park`

Пояснение: Pink Beach — часть большого Komodo marine cluster. Поэтому place привязан и к district, и к container.

---

## 11. Scuba Junkie Komodo
- `slug`: `lbj-scuba-junkie-komodo`
- `name`: `Scuba Junkie Komodo`

### Place → District
- `district_slug`: `central-harbor-waterfront`
- `district_name`: `Central Harbor / Waterfront`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: dive operator относится к harbor/service contour города, откуда стартуют морские маршруты. Контейнер не нужен.

---

## 12. Taman Laut Handayani Seafood
- `slug`: `lbj-taman-laut-handayani-seafood`
- `name`: `Taman Laut Handayani Seafood`

### Place → District
- `district_slug`: `central-harbor-waterfront`
- `district_name`: `Central Harbor / Waterfront`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: seafood-ресторан у воды в harbor/waterfront части города. Контейнер не нужен.

---

# Summary

## District links
- `lbj-atlantis-on-the-rock` → `waecicu-north-bay`
- `lbj-bajo-taco` → `central-harbor-waterfront`
- `lbj-batu-cermin-cave` → `batu-cermin-wae-sambi`
- `lbj-happy-banana-komodo` → `central-harbor-waterfront`
- `lbj-komodo-national-park` → `komodo-marine-excursion-zone`
- `lbj-la-cucina` → `waecicu-north-bay`
- `lbj-labuan-bajo-sunset-harbor` → `central-harbor-waterfront`
- `lbj-manta-point` → `komodo-marine-excursion-zone`
- `lbj-padar-island-viewpoint` → `komodo-marine-excursion-zone`
- `lbj-pink-beach` → `komodo-marine-excursion-zone`
- `lbj-scuba-junkie-komodo` → `central-harbor-waterfront`
- `lbj-taman-laut-handayani-seafood` → `central-harbor-waterfront`

## Container links
- `lbj-komodo-national-park` → `komodo-national-park`
- `lbj-labuan-bajo-sunset-harbor` → `labuan-bajo-harbor`
- `lbj-manta-point` → `komodo-national-park`
- `lbj-padar-island-viewpoint` → `komodo-national-park`
- `lbj-pink-beach` → `komodo-national-park`

## Places without container
- `lbj-atlantis-on-the-rock`
- `lbj-bajo-taco`
- `lbj-batu-cermin-cave`
- `lbj-happy-banana-komodo`
- `lbj-la-cucina`
- `lbj-scuba-junkie-komodo`
- `lbj-taman-laut-handayani-seafood`
