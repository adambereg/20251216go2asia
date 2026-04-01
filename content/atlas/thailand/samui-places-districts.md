# Samui Places → Districts / Containers

Этот файл фиксирует связи для **8 мест Самуи, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `usm`

---

## 1. Ang Thong National Marine Park
- `slug`: `usm-ang-thong-national-marine-park`
- `name`: `Ang Thong National Marine Park`

### Place → District
- `district_slug`: `ang-thong-excursion-zone`
- `district_name`: `Ang Thong Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это внешний морской архипелаг к северо-западу от Самуи, куда едут на day trip с острова. Это не городской район Самуи, а отдельная excursion-zone. 

---

## 2. Big Buddha Temple
- `slug`: `usm-big-buddha-temple`
- `name`: `Big Buddha Temple`

### Place → District
- `district_slug`: `choeng-mon-big-buddha`
- `district_name`: `Choeng Mon / Big Buddha`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: храм находится на северо-востоке Самуи в зоне Big Buddha / Wat Phra Yai, рядом с Choeng Mon coastal cluster. Контейнер не нужен.

---

## 3. Chaweng Beach
- `slug`: `usm-chaweng-beach`
- `name`: `Chaweng Beach`

### Place → District
- `district_slug`: `chaweng`
- `district_name`: `Chaweng`

### Place → Container
- `container_slug`: `chaweng-beach`
- `container_name`: `Chaweng Beach`

Пояснение: это не одиночная точка, а главный beachfront-кластер Самуи. Поэтому place логично живёт и как container-сущность.

---

## 4. Coco Tam’s
- `slug`: `usm-coco-tam-s`
- `name`: `Coco Tam’s`

### Place → District
- `district_slug`: `bophut-fishermans-village`
- `district_name`: `Bophut / Fisherman’s Village`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Coco Tam’s находится на пляже Bophut у Fisherman’s Village. Контейнер не нужен: это самостоятельный beach bar / restaurant внутри районного кластера.

---

## 5. Dining on the Rocks
- `slug`: `usm-dining-on-the-rocks`
- `name`: `Dining on the Rocks`

### Place → District
- `district_slug`: `choeng-mon-big-buddha`
- `district_name`: `Choeng Mon / Big Buddha`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится на северо-восточном мысе Самуи в upscale resort-зоне рядом с Big Buddha / Choeng Mon coastal contour. Контейнер не нужен.

---

## 6. Fisherman’s Village
- `slug`: `usm-fisherman-s-village`
- `name`: `Fisherman’s Village`

### Place → District
- `district_slug`: `bophut-fishermans-village`
- `district_name`: `Bophut / Fisherman’s Village`

### Place → Container
- `container_slug`: `fishermans-village`
- `container_name`: `Fisherman’s Village`

Пояснение: это не одна точка, а целый village/beachfront cluster внутри Bophut. Поэтому нужен container.

---

## 7. Lamai Beach
- `slug`: `usm-lamai-beach`
- `name`: `Lamai Beach`

### Place → District
- `district_slug`: `lamai`
- `district_name`: `Lamai`

### Place → Container
- `container_slug`: `lamai-beach`
- `container_name`: `Lamai Beach`

Пояснение: это длинный beach-cluster юго-востока Самуи, а не одиночная точка. Поэтому нужен container.

---

## 8. Na Muang Waterfalls
- `slug`: `usm-na-muang-waterfalls`
- `name`: `Na Muang Waterfalls`

### Place → District
- `district_slug`: `na-muang-interior`
- `district_name`: `Na Muang Interior`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: водопады находятся во внутренней зелёной части юга Самуи, а не в beach contour. Контейнер не нужен.

---

# Summary

## District links
- `usm-ang-thong-national-marine-park` → `ang-thong-excursion-zone`
- `usm-big-buddha-temple` → `choeng-mon-big-buddha`
- `usm-chaweng-beach` → `chaweng`
- `usm-coco-tam-s` → `bophut-fishermans-village`
- `usm-dining-on-the-rocks` → `choeng-mon-big-buddha`
- `usm-fisherman-s-village` → `bophut-fishermans-village`
- `usm-lamai-beach` → `lamai`
- `usm-na-muang-waterfalls` → `na-muang-interior`

## Container links
- `usm-chaweng-beach` → `chaweng-beach`
- `usm-fisherman-s-village` → `fishermans-village`
- `usm-lamai-beach` → `lamai-beach`

## Places without container
- `usm-ang-thong-national-marine-park`
- `usm-big-buddha-temple`
- `usm-coco-tam-s`
- `usm-dining-on-the-rocks`
- `usm-na-muang-waterfalls`