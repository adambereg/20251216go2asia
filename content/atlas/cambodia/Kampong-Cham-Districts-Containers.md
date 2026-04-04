# Kampong Cham Districts and Containers

Этот файл фиксирует новые сущности для Kampong Cham pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `kch`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Кампонг Чама.

---

# 1. City Districts

## 1.1 `sambor-prei-kuk-excursion-zone`
- `slug`: `sambor-prei-kuk-excursion-zone`
- `name`: `Sambor Prei Kuk Excursion Zone`
- `name_local`: `សំបូរព្រៃគុក`
- `city_slug`: `kch`
- `country_slug`: `cambodia`

Краткое описание: внешняя историко-археологическая excursion-zone, связанная с древним храмовым комплексом Sambor Prei Kuk. Для текущего Atlas набора Kampong Cham это не городской район в строгом смысле, а одиночный day-trip cluster, который используется как operational district для существующего места.

Подходит для:
- археологического и исторического интереса;
- day trip формата;
- храмового комплекса доангкорского периода.

Текущие Atlas places в этом районе:
- `kch-samor-prei-kuk`

---

# 2. Place Containers

Для текущего Kampong Cham pilot отдельные `place_containers` не нужны.

Причина:
- в городе сейчас только одно Atlas place;
- `Sambor Prei Kuk` уже является самостоятельной крупной destination-entity;
- дополнительный container на этом этапе не даёт пользы.
