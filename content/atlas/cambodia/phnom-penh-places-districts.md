# Phnom Penh Places → Districts / Containers

Этот файл фиксирует связи для **8 мест Пномпеня, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `pnh`

---

## 1. Brown Coffee
- `slug`: `pnh-brown-coffee`
- `name`: `Brown Coffee`

### Place → District
- `district_slug`: `riverside-daun-penh`
- `district_name`: `Riverside / Daun Penh`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Riverside branch Brown Coffee находится на Preah Sisowath Quay и логично относится к riverfront / Daun Penh ядру. Контейнер не нужен: это самостоятельная кофейня. 

---

## 2. Cheung Ek Killing Fields
- `slug`: `pnh-cheung-ek-killing-fields`
- `name`: `Cheung Ek Killing Fields`

### Place → District
- `district_slug`: `dangkao-excursion-zone`
- `district_name`: `Dangkao Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: мемориал расположен в Dangkao District на южной периферии города и логично живёт во внешней excursion-zone, а не внутри центральных районов Пномпеня.

---

## 3. FCC Phnom Penh
- `slug`: `pnh-fcc-phnom-penh`
- `name`: `FCC Phnom Penh`

### Place → District
- `district_slug`: `riverside-daun-penh`
- `district_name`: `Riverside / Daun Penh`

### Place → Container
- `container_slug`: `sisowath-quay-riverside`
- `container_name`: `Sisowath Quay Riverside`

Пояснение: FCC находится прямо на Sisowath Quay и одновременно является частью более широкого riverfront-cluster, поэтому container здесь уместен.

---

## 4. Independence Monument
- `slug`: `pnh-independence-monument`
- `name`: `Independence Monument`

### Place → District
- `district_slug`: `norodom-independence-bassac`
- `district_name`: `Norodom / Independence / Bassac`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: monument стоит на круговой развязке пересечения Norodom Boulevard и Sihanouk Boulevard и логично относится к представительскому центральному району вокруг Independence Monument. Контейнер не нужен.

---

## 5. Malis Restaurant
- `slug`: `pnh-malis-restaurant`
- `name`: `Malis Restaurant`

### Place → District
- `district_slug`: `norodom-independence-bassac`
- `district_name`: `Norodom / Independence / Bassac`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Malis на Norodom Boulevard относится к тому же центрально-южному boulevard / embassy / dining contour у Independence Monument и Bassac-side. Контейнер не нужен.

---

## 6. Romdeng Restaurant
- `slug`: `pnh-romdeng-restaurant`
- `name`: `Romdeng Restaurant`

### Place → District
- `district_slug`: `riverside-daun-penh`
- `district_name`: `Riverside / Daun Penh`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Romdeng находится в старом центральном Phnom Penh недалеко от National Museum / Daun Penh core. Это часть исторического городского ядра, а не отдельный container-cluster.

---

## 7. Topaz Restaurant
- `slug`: `pnh-topaz-restaurant`
- `name`: `Topaz Restaurant`

### Place → District
- `district_slug`: `norodom-independence-bassac`
- `district_name`: `Norodom / Independence / Bassac`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Topaz Norodom Boulevard относится к тому же refined central boulevard zone, что и Malis, ближе к Chamkar Mon / Bassac-side central contour. Контейнер не нужен.

---

## 8. Wat Phnom
- `slug`: `pnh-wat-phnom`
- `name`: `Wat Phnom`

### Place → District
- `district_slug`: `riverside-daun-penh`
- `district_name`: `Riverside / Daun Penh`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Wat Phnom — ключевой landmark северной части старого центра Daun Penh. Контейнер не нужен на текущем этапе.

---

# Summary

## District links
- `pnh-brown-coffee` → `riverside-daun-penh`
- `pnh-cheung-ek-killing-fields` → `dangkao-excursion-zone`
- `pnh-fcc-phnom-penh` → `riverside-daun-penh`
- `pnh-independence-monument` → `norodom-independence-bassac`
- `pnh-malis-restaurant` → `norodom-independence-bassac`
- `pnh-romdeng-restaurant` → `riverside-daun-penh`
- `pnh-topaz-restaurant` → `norodom-independence-bassac`
- `pnh-wat-phnom` → `riverside-daun-penh`

## Container links
- `pnh-fcc-phnom-penh` → `sisowath-quay-riverside`

## Places without container
- `pnh-brown-coffee`
- `pnh-cheung-ek-killing-fields`
- `pnh-independence-monument`
- `pnh-malis-restaurant`
- `pnh-romdeng-restaurant`
- `pnh-topaz-restaurant`
- `pnh-wat-phnom`