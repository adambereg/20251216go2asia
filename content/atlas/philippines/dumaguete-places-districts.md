# Dumaguete Places → Districts / Containers

Этот файл фиксирует связи для **6 мест Думагете, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `philippines`
- `city_slug`: `dumaguete`

---

## 1. Apo Island
- `slug`: `dumaguete-apo-island`
- `name`: `Apo Island`

### Place → District
- `district_slug`: `apo-island-excursion-zone`
- `district_name`: `Apo Island Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Apo Island находится у побережья Negros Oriental и operationally живёт как внешний marine day-trip cluster, а не как городской район Думагете.

---

## 2. Casaroro Falls
- `slug`: `dumaguete-casaroro-falls`
- `name`: `Casaroro Falls`

### Place → District
- `district_slug`: `valencia-casaroro-excursion-zone`
- `district_name`: `Valencia / Casaroro Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: водопад находится в Valencia uplands west of Dumaguete и логично относится к отдельной inland excursion-zone.

---

## 3. Lab-as Seafood Restaurant
- `slug`: `dumaguete-lab-as-seafood-restaurant`
- `name`: `Lab-as Seafood Restaurant`

### Place → District
- `district_slug`: `rizal-boulevard-seafront`
- `district_name`: `Rizal Boulevard Seafront`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан стоит на coastal road / seafront side of Dumaguete и логично живёт в городском waterfront contour.

---

## 4. Rizal Boulevard
- `slug`: `dumaguete-rizal-boulevard`
- `name`: `Rizal Boulevard`

### Place → District
- `district_slug`: `rizal-boulevard-seafront`
- `district_name`: `Rizal Boulevard Seafront`

### Place → Container
- `container_slug`: `rizal-boulevard`
- `container_name`: `Rizal Boulevard`

Пояснение: это не одиночная точка, а самостоятельный seafront promenade-cluster, поэтому place одновременно живёт как container.

---

## 5. Sans Rival Cakes & Pastries
- `slug`: `dumaguete-sans-rival-cakes-pastries`
- `name`: `Sans Rival Cakes & Pastries`

### Place → District
- `district_slug`: `rizal-boulevard-seafront`
- `district_name`: `Rizal Boulevard Seafront`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Sans Rival operationally относится к тому же seafront / boulevard contour, что и главная coastal promenade Dumaguete.

---

## 6. Silliman University
- `slug`: `dumaguete-silliman-university`
- `name`: `Silliman University`

### Place → District
- `district_slug`: `silliman-university-campus`
- `district_name`: `Silliman University Campus`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: кампус — самостоятельная urban academic landmark-zone, но на текущем этапе отдельный container не нужен.

---

# Summary

## District links
- `dumaguete-apo-island` → `apo-island-excursion-zone`
- `dumaguete-casaroro-falls` → `valencia-casaroro-excursion-zone`
- `dumaguete-lab-as-seafood-restaurant` → `rizal-boulevard-seafront`
- `dumaguete-rizal-boulevard` → `rizal-boulevard-seafront`
- `dumaguete-sans-rival-cakes-pastries` → `rizal-boulevard-seafront`
- `dumaguete-silliman-university` → `silliman-university-campus`

## Container links
- `dumaguete-rizal-boulevard` → `rizal-boulevard`

## Places without container
- `dumaguete-apo-island`
- `dumaguete-casaroro-falls`
- `dumaguete-lab-as-seafood-restaurant`
- `dumaguete-sans-rival-cakes-pastries`
- `dumaguete-silliman-university`
