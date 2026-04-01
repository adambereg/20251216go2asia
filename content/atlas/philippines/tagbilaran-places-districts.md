# Tagbilaran Places → Districts / Containers

Этот файл фиксирует связи для **7 мест Tagbilaran / Bohol, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `philippines`
- `city_slug`: `tag`

---

## 1. Bohol Bee Farm
- `slug`: `tag-bohol-bee-farm`
- `name`: `Bohol Bee Farm`

### Place → District
- `district_slug`: `panglao-dauis-coast`
- `district_name`: `Panglao / Dauis Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место находится в Dao, Dauis на Panglao Island и логично относится к coastal/resort contour Панглао, а не к urban core Tagbilaran.

---

## 2. Chocolate Hills
- `slug`: `tag-chocolate-hills`
- `name`: `Chocolate Hills`

### Place → District
- `district_slug`: `carmen-chocolate-hills-excursion-zone`
- `district_name`: `Carmen / Chocolate Hills Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: iconic landscape находится в Carmen area и для текущего Atlas mapping живёт как внешний excursion-zone.

---

## 3. Gerarda’s Family Restaurant
- `slug`: `tag-gerarda-s-family-restaurant`
- `name`: `Gerarda’s Family Restaurant`

### Place → District
- `district_slug`: `tagbilaran-civic-old-airport`
- `district_name`: `Tagbilaran Civic / Old Airport`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится в Tagbilaran City и логично относится к городскому civic/old-airport contour.

---

## 4. Gerarda’s Family Restaurant
- `slug`: `tag-gerardas-family-restaurant`
- `name`: `Gerarda’s Family Restaurant`

### Place → District
- `district_slug`: `tagbilaran-civic-old-airport`
- `district_name`: `Tagbilaran Civic / Old Airport`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это дубль/вариант slug того же городского restaurant-case; для operational consistency оставляем ту же district-привязку.

---

## 5. Loboc River Cruise
- `slug`: `tag-loboc-river-cruise`
- `name`: `Loboc River Cruise`

### Place → District
- `district_slug`: `loboc-river-countryside`
- `district_name`: `Loboc River Countryside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: речной круиз связан с Loboc и живёт как countryside day-trip contour за пределами Tagbilaran.

---

## 6. Panglao Island – Alona Beach
- `slug`: `tag-panglao-island-alona-beach`
- `name`: `Panglao Island – Alona Beach`

### Place → District
- `district_slug`: `panglao-dauis-coast`
- `district_name`: `Panglao / Dauis Coast`

### Place → Container
- `container_slug`: `alona-beach`
- `container_name`: `Alona Beach`

Пояснение: это не одна точка, а самостоятельный beachfront-cluster Panglao, поэтому нужен container.

---

## 7. Philippine Tarsier Sanctuary
- `slug`: `tag-philippine-tarsier-sanctuary`
- `name`: `Philippine Tarsier Sanctuary`

### Place → District
- `district_slug`: `corella-tarsier-countryside`
- `district_name`: `Corella Tarsier Countryside`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: sanctuary находится в Corella и логично живёт как eco / countryside short-trip contour.

---

# Summary

## District links
- `tag-bohol-bee-farm` → `panglao-dauis-coast`
- `tag-chocolate-hills` → `carmen-chocolate-hills-excursion-zone`
- `tag-gerarda-s-family-restaurant` → `tagbilaran-civic-old-airport`
- `tag-gerardas-family-restaurant` → `tagbilaran-civic-old-airport`
- `tag-loboc-river-cruise` → `loboc-river-countryside`
- `tag-panglao-island-alona-beach` → `panglao-dauis-coast`
- `tag-philippine-tarsier-sanctuary` → `corella-tarsier-countryside`

## Container links
- `tag-panglao-island-alona-beach` → `alona-beach`

## Places without container
- `tag-bohol-bee-farm`
- `tag-chocolate-hills`
- `tag-gerarda-s-family-restaurant`
- `tag-gerardas-family-restaurant`
- `tag-loboc-river-cruise`
- `tag-philippine-tarsier-sanctuary`
