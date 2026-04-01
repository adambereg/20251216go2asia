# Chiang Mai Places → Districts / Containers

Этот файл фиксирует связи для **13 мест Чиангмая, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `cnx`

---

## 1. Dash! Restaurant
- `slug`: `cnx-dash-restaurant`
- `name`: `Dash! Restaurant`

### Place → District
- `district_slug`: `old-city`
- `district_name`: `Old City`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место по смыслу и описанию относится к Старому городу Чиангмая. Контейнер не нужен: это самостоятельный ресторан.

---

## 2. Doi Inthanon National Park
- `slug`: `cnx-doi-inthanon-national-park`
- `name`: `Doi Inthanon National Park`

### Place → District
- `district_slug`: `chom-thong-excursion-zone`
- `district_name`: `Chom Thong Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: объект находится не в городском центре Чиангмая, а в excursion-zone вокруг Chom Thong / Doi Inthanon. Контейнер не нужен, потому что сам объект уже является крупной природной сущностью. :contentReference[oaicite:1]{index=1}

---

## 3. Elephant Nature Park
- `slug`: `cnx-elephant-nature-park`
- `name`: `Elephant Nature Park`

### Place → District
- `district_slug`: `mae-taeng-excursion-zone`
- `district_name`: `Mae Taeng Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: объект находится в Mae Taeng District и логично живёт в excursion-zone, а не внутри центральных районов Чиангмая. Контейнер не нужен. :contentReference[oaicite:2]{index=2}

---

## 4. Fern Forest Café
- `slug`: `cnx-fern-forest-cafe`
- `name`: `Fern Forest Café`

### Place → District
- `district_slug`: `old-city`
- `district_name`: `Old City`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: кафе находится в зоне Si Phum / Singharaj Road у Старого города. Контейнер не нужен. :contentReference[oaicite:3]{index=3}

---

## 5. Graph Café
- `slug`: `cnx-graph-cafe`
- `name`: `Graph Café`

### Place → District
- `district_slug`: `old-city`
- `district_name`: `Old City`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Graph — сетевой бренд с несколькими локациями в Чиангмае. Для текущего Atlas mapping это место рабоче привязано к Old City, поскольку бренд имеет заметную old-city локацию, а отдельный branch-level layer у нас пока не введён. Контейнер не нужен. :contentReference[oaicite:4]{index=4}

---

## 6. Khao Soi Khun Yai
- `slug`: `cnx-khao-soi-khun-yai`
- `name`: `Khao Soi Khun Yai`

### Place → District
- `district_slug`: `old-city`
- `district_name`: `Old City`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место находится в зоне Si Phum у северной части Старого города. Контейнер не нужен. :contentReference[oaicite:5]{index=5}

---

## 7. Nimmanhaemin Road
- `slug`: `cnx-nimmanhaemin-road`
- `name`: `Nimmanhaemin Road`

### Place → District
- `district_slug`: `nimman`
- `district_name`: `Nimman`

### Place → Container
- `container_slug`: `nimmanhaemin-road`
- `container_name`: `Nimmanhaemin Road`

Пояснение: это не одна точка, а самостоятельный городской кластер/улица-район. Поэтому place логично привязан к district `nimman` и одновременно живёт как container-сущность.

---

## 8. Old City
- `slug`: `cnx-old-city`
- `name`: `Old City`

### Place → District
- `district_slug`: `old-city`
- `district_name`: `Old City`

### Place → Container
- `container_slug`: `chiang-mai-old-city`
- `container_name`: `Chiang Mai Old City`

Пояснение: это не единичный объект, а целый городской кластер внутри района Old City. Поэтому нужен container.

---

## 9. Sunday Walking Street Market
- `slug`: `cnx-sunday-walking-street-market`
- `name`: `Sunday Walking Street Market`

### Place → District
- `district_slug`: `old-city`
- `district_name`: `Old City`

### Place → Container
- `container_slug`: `sunday-walking-street-market`
- `container_name`: `Sunday Walking Street Market`

Пояснение: это market-route внутри Старого города, а не одиночная точка. Поэтому нужен container.

---

## 10. The Riverside Bar & Restaurant
- `slug`: `cnx-the-riverside-bar-restaurant`
- `name`: `The Riverside Bar & Restaurant`

### Place → District
- `district_slug`: `riverside-wat-ket`
- `district_name`: `Riverside / Wat Ket`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: объект расположен на Charoen Rat Road в Wat Ket у Ping River. Контейнер не нужен. :contentReference[oaicite:6]{index=6}

---

## 11. Wat Chedi Luang
- `slug`: `cnx-wat-chedi-luang`
- `name`: `Wat Chedi Luang`

### Place → District
- `district_slug`: `old-city`
- `district_name`: `Old City`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: один из ключевых храмов Старого города. Контейнер не нужен на текущем этапе.

---

## 12. Wat Phra That Doi Suthep
- `slug`: `cnx-wat-phra-that-doi-suthep`
- `name`: `Wat Phra That Doi Suthep`

### Place → District
- `district_slug`: `suthep-doi-suthep`
- `district_name`: `Suthep / Doi Suthep`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храм связан с зоной Suthep / Doi Suthep и расположен на горе над городом. Контейнер не нужен. :contentReference[oaicite:7]{index=7}

---

## 13. Woo Café & Art Gallery
- `slug`: `cnx-woo-cafe-art-gallery`
- `name`: `Woo Café & Art Gallery`

### Place → District
- `district_slug`: `riverside-wat-ket`
- `district_name`: `Riverside / Wat Ket`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: объект находится на Charoen Rat Road в Wat Ket и логично относится к riverside-зоне. Контейнер не нужен. :contentReference[oaicite:8]{index=8}

---

# Summary

## District links
- `cnx-dash-restaurant` → `old-city`
- `cnx-doi-inthanon-national-park` → `chom-thong-excursion-zone`
- `cnx-elephant-nature-park` → `mae-taeng-excursion-zone`
- `cnx-fern-forest-cafe` → `old-city`
- `cnx-graph-cafe` → `old-city`
- `cnx-khao-soi-khun-yai` → `old-city`
- `cnx-nimmanhaemin-road` → `nimman`
- `cnx-old-city` → `old-city`
- `cnx-sunday-walking-street-market` → `old-city`
- `cnx-the-riverside-bar-restaurant` → `riverside-wat-ket`
- `cnx-wat-chedi-luang` → `old-city`
- `cnx-wat-phra-that-doi-suthep` → `suthep-doi-suthep`
- `cnx-woo-cafe-art-gallery` → `riverside-wat-ket`

## Container links
- `cnx-nimmanhaemin-road` → `nimmanhaemin-road`
- `cnx-old-city` → `chiang-mai-old-city`
- `cnx-sunday-walking-street-market` → `sunday-walking-street-market`

## Places without container
- `cnx-dash-restaurant`
- `cnx-doi-inthanon-national-park`
- `cnx-elephant-nature-park`
- `cnx-fern-forest-cafe`
- `cnx-graph-cafe`
- `cnx-khao-soi-khun-yai`
- `cnx-the-riverside-bar-restaurant`
- `cnx-wat-chedi-luang`
- `cnx-wat-phra-that-doi-suthep`
- `cnx-woo-cafe-art-gallery`