# Sihanoukville Districts and Containers

Этот файл фиксирует новые сущности для Sihanoukville pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `kps`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Сиануквиля.

---

# 1. City Districts

## 1.1 `otres-beach`
- `slug`: `otres-beach`
- `name`: `Otres Beach`
- `name_local`: `ឆ្នេរអូរត្រេះ`
- `city_slug`: `kps`
- `country_slug`: `cambodia`

Краткое описание: юго-восточная beach-зона Сиануквиля, которая воспринимается как более расслабленная альтернатива центральному городскому побережью. Это район для beach cafés, баров, sunset-атмосферы и более спокойного seaside опыта.

Подходит для:
- beach cafés и баров у моря;
- более расслабленной beach-среды;
- sunset-прогулок и отдыха вне городского ядра.

Текущие Atlas places в этом районе:
- `kps-otres-beach-caf-s-bars`
- `kps-otres-beach-cafes-bars`

---

## 1.2 `prey-nob-waterfall-excursion-zone`
- `slug`: `prey-nob-waterfall-excursion-zone`
- `name`: `Prey Nob Waterfall Excursion Zone`
- `name_local`: `ព្រៃនប់`
- `city_slug`: `kps`
- `country_slug`: `cambodia`

Краткое описание: внешняя природная excursion-зона к северу от городского побережья, связанная с Kbal Chhay Waterfall и более зелёным inland-контуром провинции. Это не beach-район Сиануквиля, а короткий природный выезд из города.

Подходит для:
- природных short trips из Сиануквиля;
- водопада и пикниковой атмосферы;
- более зелёного inland experience.

Текущие Atlas places в этом районе:
- `kps-kbal-chhay-waterfall`

---

## 1.3 `koh-rong-excursion-zone`
- `slug`: `koh-rong-excursion-zone`
- `name`: `Koh Rong Excursion Zone`
- `name_local`: `កោះរុង`
- `city_slug`: `kps`
- `country_slug`: `cambodia`

Краткое описание: внешний island-cluster к западу от побережья Сиануквиля, связанный с Koh Rong и морскими поездками по Gulf of Thailand. Для Atlas Sihanoukville это отдельная excursion-zone, а не часть материкового городского контура.

Подходит для:
- island escapes и beach day trips;
- морских поездок и boating;
- postcard-пейзажей и островного отдыха.

Текущие Atlas places в этом районе:
- `kps-koh-rong-island`

---

# 2. Place Containers

Контейнеры для текущего Sihanoukville set не нужны.

- Otres Beach cafés & bars уже представлены как тематические place-сущности внутри одного beach district.
- Kbal Chhay Waterfall и Koh Rong Island — самостоятельные destination-scale place entities.
