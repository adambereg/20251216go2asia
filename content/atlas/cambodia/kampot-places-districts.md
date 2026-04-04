# Kampot Places → Districts / Containers

Этот файл фиксирует связи для **3 мест Kampot, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `kmp`

> Важно: это curated operational mapping для существующих Atlas places, а не административная схема Kampot Province.
> Отдельно: два места текущего набора фактически относятся к **Kep**, но в Atlas сейчас сидят под `city_id = kmp`, поэтому здесь используется operational layer без перепривязки самих city IDs.

---

## 1. Crab Market
- `slug`: `kmp-crab-market`
- `name`: `Crab Market`

### Place → District
- `district_slug`: `kep-coastal-excursion-zone`
- `district_name`: `Kep Coastal Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Crab Market находится в Kep и логично живёт не в городском ядре Кампота, а во внешней coastal excursion-зоне. Контейнер не нужен: это уже самостоятельная destination-scale seafood market локация.

---

## 2. Kep National Park & Kep Beach
- `slug`: `kmp-kep-national-park-kep-beach`
- `name`: `Kep National Park & Kep Beach`

### Place → District
- `district_slug`: `kep-coastal-excursion-zone`
- `district_name`: `Kep Coastal Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: place объединяет природную и coastal составляющую Kep и поэтому логично относится к той же внешней excursion-зоне. Дополнительный container не нужен, потому что сам объект уже агрегирует park + beach experience.

---

## 3. La Plantation Pepper Farm
- `slug`: `kmp-la-plantation-pepper-farm`
- `name`: `La Plantation Pepper Farm`

### Place → District
- `district_slug`: `kampot-pepper-countryside`
- `district_name`: `Kampot Pepper Countryside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: La Plantation находится в pepper countryside Kampot Province и логично относится к rural/agrotourism excursion-zone, а не к riverfront-центру Кампота. Контейнер не нужен.

---

# Summary

## District links
- `kmp-crab-market` → `kep-coastal-excursion-zone`
- `kmp-kep-national-park-kep-beach` → `kep-coastal-excursion-zone`
- `kmp-la-plantation-pepper-farm` → `kampot-pepper-countryside`

## Container links
- _нет_

## Places without container
- `kmp-crab-market`
- `kmp-kep-national-park-kep-beach`
- `kmp-la-plantation-pepper-farm`
