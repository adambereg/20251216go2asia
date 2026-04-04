# Battambang Districts and Containers

Этот файл фиксирует новые сущности для Battambang pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `bat`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Баттамбанга.

---

# 1. City Districts

## 1.1 `historic-center-psar-nath-riverside`
- `slug`: `historic-center-psar-nath-riverside`
- `name`: `Historic Center / Psar Nath / Riverside`
- `name_local`: `ក្រុងបាត់ដំបង`
- `city_slug`: `bat`
- `country_slug`: `cambodia`

Краткое описание: историческое городское ядро Баттамбанга вокруг Psar Nath, колониальных улиц, реки Sangker и центральных кафе. Это главный район для первого знакомства с городом: прогулок по старому центру, рынку, кофейням и более спокойной городской атмосфере западной Камбоджи.

Подходит для:
- прогулок по историческому центру;
- кафе, локальной гастрономии и riverfront-атмосферы;
- первого знакомства с Баттамбангом как с городом, а не как с excursion-base.

Текущие Atlas places в этом районе:
- `bat-kinyei-caf`
- `bat-kinyei-cafe`

---

## 1.2 `bamboo-train-excursion-zone`
- `slug`: `bamboo-train-excursion-zone`
- `name`: `Bamboo Train Excursion Zone`
- `name_local`: `នូរី`
- `city_slug`: `bat`
- `country_slug`: `cambodia`

Краткое описание: внешняя excursion-зона вокруг нового Bamboo Train experience к юго-западу от города. Это уже не центральный Баттамбанг, а отдельный short-trip cluster, связанный с сельским ландшафтом, железнодорожной историей и характерным norry experience.

Подходит для:
- коротких выездов за пределы центра;
- bamboo train / norry experience;
- более сельского и локального Battambang countryside feel.

Текущие Atlas places в этом районе:
- `bat-bamboo-train`

---

## 1.3 `phnom-sampeau-excursion-zone`
- `slug`: `phnom-sampeau-excursion-zone`
- `name`: `Phnom Sampeau Excursion Zone`
- `name_local`: `ភ្នំសំពៅ`
- `city_slug`: `bat`
- `country_slug`: `cambodia`

Краткое описание: внешняя hill-and-caves excursion-зона к западу от Баттамбанга, связанная с Phnom Sampeau, Bat Cave, храмами на холме и панорамными видами. Это один из ключевых day-trip кластеров региона и не часть центрального городского контура.

Подходит для:
- bat cave и sunset выездов;
- hill-temple и cave experience;
- природно-исторических day trips из Баттамбанга.

Текущие Atlas places в этом районе:
- `bat-phnom-sampeau-bat-cave`

---

# 2. Place Containers

На текущем Battambang pilot отдельные `place_containers` не требуются.

Причина:
- все текущие Atlas places для Баттамбанга являются либо одиночными городскими точками, либо самостоятельными excursion-локациями;
- cluster/container layer для этого текущего набора мест не нужен.

