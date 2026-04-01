# Siem Reap Places → Districts / Containers

Этот файл фиксирует связи для **8 мест Сием Рипа, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `rep`

---

## 1. Angkor Wat
- `slug`: `rep-angkor-wat`
- `name`: `Angkor Wat`

### Place → District
- `district_slug`: `angkor-archaeological-park-core`
- `district_name`: `Angkor Archaeological Park Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: культовый храм относится к основному археологическому и monument-core контуру Angkor. Контейнер не нужен: это самостоятельная destination-scale temple entity.

---

## 2. Banteay Srei
- `slug`: `rep-banteay-srei`
- `name`: `Banteay Srei`

### Place → District
- `district_slug`: `banteay-srei-excursion-zone`
- `district_name`: `Banteay Srei Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храм находится за пределами основного городского и temple-core контура, поэтому логично живёт во внешней excursion-zone. Контейнер не нужен.

---

## 3. Bayon
- `slug`: `rep-bayon`
- `name`: `Bayon`

### Place → District
- `district_slug`: `angkor-archaeological-park-core`
- `district_name`: `Angkor Archaeological Park Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Bayon находится в Angkor Thom и относится к центральному археологическому ядру Angkor. Контейнер не нужен.

---

## 4. Phare Circus
- `slug`: `rep-phare-circus`
- `name`: `Phare Circus`

### Place → District
- `district_slug`: `central-siem-reap-urban-core`
- `district_name`: `Central Siem Reap Urban Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Phare расположен в городском контуре Сием Рипа у Ring Road south of Sok San Road и логично относится к urban core, а не к храмовым или внешним природным зонам. Контейнер не нужен.

---

## 5. Phnom Kulen National Park
- `slug`: `rep-phnom-kulen-national-park`
- `name`: `Phnom Kulen National Park`

### Place → District
- `district_slug`: `phnom-kulen-excursion-zone`
- `district_name`: `Phnom Kulen Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это отдельная природная и sacred mountain destination в Siem Reap Province, вынесенная во внешнюю excursion-zone. Контейнер не нужен.

---

## 6. Preah Khan
- `slug`: `rep-preah-khan`
- `name`: `Preah Khan`

### Place → District
- `district_slug`: `angkor-archaeological-park-core`
- `district_name`: `Angkor Archaeological Park Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храм расположен к северо-востоку от Angkor Thom, но всё ещё внутри археологического ядра Angkor. Контейнер не нужен.

---

## 7. Pub Street
- `slug`: `rep-pub-street`
- `name`: `Pub Street`

### Place → District
- `district_slug`: `central-siem-reap-urban-core`
- `district_name`: `Central Siem Reap Urban Core`

### Place → Container
- `container_slug`: `pub-street`
- `container_name`: `Pub Street`

Пояснение: это не одна точка, а самостоятельный nightlife- и dining-коридор в центре Сием Рипа. Поэтому нужен container.

---

## 8. Ta Prohm
- `slug`: `rep-ta-prohm`
- `name`: `Ta Prohm`

### Place → District
- `district_slug`: `angkor-archaeological-park-core`
- `district_name`: `Angkor Archaeological Park Core`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Ta Prohm входит в основной Angkor circuit и логично живёт в park-core district. Контейнер не нужен.

---

# Summary

## District links
- `rep-angkor-wat` → `angkor-archaeological-park-core`
- `rep-banteay-srei` → `banteay-srei-excursion-zone`
- `rep-bayon` → `angkor-archaeological-park-core`
- `rep-phare-circus` → `central-siem-reap-urban-core`
- `rep-phnom-kulen-national-park` → `phnom-kulen-excursion-zone`
- `rep-preah-khan` → `angkor-archaeological-park-core`
- `rep-pub-street` → `central-siem-reap-urban-core`
- `rep-ta-prohm` → `angkor-archaeological-park-core`

## Container links
- `rep-pub-street` → `pub-street`

## Places without container
- `rep-angkor-wat`
- `rep-banteay-srei`
- `rep-bayon`
- `rep-phare-circus`
- `rep-phnom-kulen-national-park`
- `rep-preah-khan`
- `rep-ta-prohm`
