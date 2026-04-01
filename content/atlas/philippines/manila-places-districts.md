# Manila Places → Districts / Containers

Этот файл фиксирует связи для **6 мест Манилы, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `philippines`
- `city_slug`: `mnl`

---

## 1. Barbara’s Heritage Restaurant
- `slug`: `mnl-barbara-s-heritage-restaurant`
- `name`: `Barbara’s Heritage Restaurant`

### Place → District
- `district_slug`: `intramuros-walled-city`
- `district_name`: `Intramuros / Walled City`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится в Plaza San Luis Complex на General Luna Street внутри Intramuros. Контейнер не нужен: это самостоятельный restaurant-place.

---

## 2. Barbara’s Heritage Restaurant
- `slug`: `mnl-barbaras-heritage-restaurant`
- `name`: `Barbara’s Heritage Restaurant`

### Place → District
- `district_slug`: `intramuros-walled-city`
- `district_name`: `Intramuros / Walled City`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это дублирующий slug того же restaurant-case в текущем Atlas наборе. Сохраняется та же operational привязка к Intramuros.

---

## 3. Binondo
- `slug`: `mnl-binondo`
- `name`: `Binondo`

### Place → District
- `district_slug`: `binondo-chinatown`
- `district_name`: `Binondo / Chinatown`

### Place → Container
- `container_slug`: `binondo-chinatown`
- `container_name`: `Binondo Chinatown`

Пояснение: это не одна точка, а самостоятельный Chinatown cluster. Поэтому нужен container.

---

## 4. Intramuros
- `slug`: `mnl-intramuros`
- `name`: `Intramuros`

### Place → District
- `district_slug`: `intramuros-walled-city`
- `district_name`: `Intramuros / Walled City`

### Place → Container
- `container_slug`: `intramuros-manila`
- `container_name`: `Intramuros Manila`

Пояснение: это не единичный объект, а целый исторический walled-city cluster. Поэтому нужен container.

---

## 5. Rizal Park
- `slug`: `mnl-rizal-park`
- `name`: `Rizal Park`

### Place → District
- `district_slug`: `rizal-park-ermita`
- `district_name`: `Rizal Park / Ermita`

### Place → Container
- `container_slug`: `rizal-park-luneta`
- `container_name`: `Rizal Park Luneta`

Пояснение: это большой городской park-and-monument cluster, а не одиночная точка. Поэтому нужен container.

---

## 6. The Aristocrat Restaurant
- `slug`: `mnl-the-aristocrat-restaurant`
- `name`: `The Aristocrat Restaurant`

### Place → District
- `district_slug`: `malate-roxas-boulevard`
- `district_name`: `Malate / Roxas Boulevard`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: классический restaurant-place на Roxas Boulevard в Malate. Контейнер не нужен.

---

# Summary

## District links
- `mnl-barbara-s-heritage-restaurant` → `intramuros-walled-city`
- `mnl-barbaras-heritage-restaurant` → `intramuros-walled-city`
- `mnl-binondo` → `binondo-chinatown`
- `mnl-intramuros` → `intramuros-walled-city`
- `mnl-rizal-park` → `rizal-park-ermita`
- `mnl-the-aristocrat-restaurant` → `malate-roxas-boulevard`

## Container links
- `mnl-binondo` → `binondo-chinatown`
- `mnl-intramuros` → `intramuros-manila`
- `mnl-rizal-park` → `rizal-park-luneta`

## Places without container
- `mnl-barbara-s-heritage-restaurant`
- `mnl-barbaras-heritage-restaurant`
- `mnl-the-aristocrat-restaurant`
