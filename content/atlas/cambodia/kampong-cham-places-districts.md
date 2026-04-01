# Kampong Cham Places → Districts / Containers

Этот файл фиксирует связи для **1 места Кампонг Чама, которое уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `kch`

---

## 1. Samor Prei Kuk
- `slug`: `kch-samor-prei-kuk`
- `name`: `Samor Prei Kuk`

### Place → District
- `district_slug`: `sambor-prei-kuk-excursion-zone`
- `district_name`: `Sambor Prei Kuk Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это древний храмовый комплекс, который находится не в городском ядре Кампонг Чама и вообще расположен в Kampong Thom Province, примерно в 30 км к северу от города Kampong Thom. В рамках текущего Atlas dataset место уже привязано к `city_id = kch`, поэтому на operational уровне ему назначается внешний `excursion-zone`, а не городской central district. UNESCO и другие источники указывают именно на расположение в Kampong Thom Province. 

---

# Summary

## District links
- `kch-samor-prei-kuk` → `sambor-prei-kuk-excursion-zone`

## Container links
- none

## Places without container
- `kch-samor-prei-kuk`
