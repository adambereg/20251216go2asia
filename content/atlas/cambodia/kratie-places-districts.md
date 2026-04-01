# Kratie Places → Districts / Containers

Этот файл фиксирует связи для **1 места Кратье, которое уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `kra`

---

## 1. Cardamom Mountains
- `slug`: `kra-cardamom-mountains`
- `name`: `Cardamom Mountains`

### Place → District
- `district_slug`: `cardamom-mountains-excursion-zone`
- `district_name`: `Cardamom Mountains Excursion Zone`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: текущий Atlas place ссылается на Cardamom Mountains / Chi Phat, то есть на удалённую природную eco-adventure зону в Koh Kong Province, а не на городской центр Кратье. Поэтому для текущего operational layer место логично жить во внешней excursion-zone. Контейнер не нужен: сама локация уже является крупной природной destination-entity.

---

# Summary

## District links
- `kra-cardamom-mountains` → `cardamom-mountains-excursion-zone`

## Container links
- нет

## Places without container
- `kra-cardamom-mountains`
