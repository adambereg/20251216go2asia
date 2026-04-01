# Lombok Districts and Containers

Этот файл фиксирует новые сущности для Lombok pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `indonesia`
- `city_slug`: `lom`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Ломбока.

---

# 1. City Districts

## 1.1 `kuta-south-coast`
- `slug`: `kuta-south-coast`
- `name`: `Kuta South Coast`
- `name_local`: `Kuta Mandalika`
- `city_slug`: `lom`
- `country_slug`: `indonesia`

Краткое описание: южное coastal-ядро Ломбока вокруг Kuta, Mandalika и nearby surf coastline. Это главный район для beach cafés, surf culture, digital nomad-friendly spots и первого знакомства с South Lombok.

Подходит для:
- beach cafés и restaurant life;
- surf culture и relaxed resort atmosphere;
- первого базирования в южном Ломбоке.

Текущие Atlas places в этом районе:
- `lom-ashtari-lounge-kitchen`
- `lom-el-bazar-cafe-restaurant`
- `lom-kuta-lombok`
- `lom-lombok-coffee-house`
- `lom-surf-shack-lombok`
- `lom-tanjung-aan-beach`
- `lom-the-mexican-in-lombok`

---

## 1.2 `selong-belanak-southwest`
- `slug`: `selong-belanak-southwest`
- `name`: `Selong Belanak Southwest`
- `name_local`: `Selong Belanak`
- `city_slug`: `lom`
- `country_slug`: `indonesia`

Краткое описание: юго-западная beach-зона Южного Ломбока, известная широкой дугой пляжа, мягкими волнами и beginner-friendly surf atmosphere. Это более спокойный coastal cluster, отличный от более оживлённой Kuta area.

Подходит для:
- beginner surf и beach days;
- спокойного coastal отдыха;
- scenic drives по южному побережью.

Текущие Atlas places в этом районе:
- `lom-selong-belanak-beach`

---

## 1.3 `senggigi-west-coast`
- `slug`: `senggigi-west-coast`
- `name`: `Senggigi West Coast`
- `name_local`: `Senggigi`
- `city_slug`: `lom`
- `country_slug`: `indonesia`

Краткое описание: западный coastal contour Ломбока с отелями, seaside dining и классическим resort feel. Это традиционная beach-base зона западного побережья с удобным доступом к sunset views и северному направлению острова.

Подходит для:
- seafood и beachside dining;
- west coast sunsets;
- более классического resort-base формата.

Текущие Atlas places в этом районе:
- `lom-senggigi-seafood-market-bbq`

---

## 1.4 `senaru-rinjani-north`
- `slug`: `senaru-rinjani-north`
- `name`: `Senaru / Rinjani North`
- `name_local`: `Senaru`
- `city_slug`: `lom`
- `country_slug`: `indonesia`

Краткое описание: северный highland-and-jungle contour Ломбока у подножия Mount Rinjani. Здесь сосредоточены trailheads, waterfalls, mountain scenery и основной gateway к Rinjani trekking experience.

Подходит для:
- mountain trekking и nature trips;
- waterfalls и jungle scenery;
- day trips и multi-day hikes в Rinjani area.

Текущие Atlas places в этом районе:
- `lom-mount-rinjani-national-park`
- `lom-sendang-gile-waterfall`

---

## 1.5 `gili-islands-excursion-zone`
- `slug`: `gili-islands-excursion-zone`
- `name`: `Gili Islands Excursion Zone`
- `name_local`: `Gili`
- `city_slug`: `lom`
- `country_slug`: `indonesia`

Краткое описание: внешний island-cluster к северо-западу от Ломбока, связанный с Gili Trawangan, Gili Air и Gili Meno. Для Atlas это отдельная marine excursion-zone, а не часть материкового urban/coastal ядра Ломбока.

Подходит для:
- island hopping и snorkeling;
- beach escapes и marine leisure;
- day trips и коротких island stays.

Текущие Atlas places в этом районе:
- `lom-gili-islands`

---

# 2. Place Containers

## 2.1 `kuta-lombok`
- `slug`: `kuta-lombok`
- `name`: `Kuta Lombok`
- `type`: `coastal-town-cluster`
- `city_slug`: `lom`
- `district_slug`: `kuta-south-coast`

Краткое описание: основной coastal town cluster южного Ломбока с cafés, surf shops, restaurants и доступом к nearby beaches.

Places inside:
- `lom-kuta-lombok`

---

## 2.2 `mount-rinjani-national-park`
- `slug`: `mount-rinjani-national-park`
- `name`: `Mount Rinjani National Park`
- `type`: `mountain-national-park-cluster`
- `city_slug`: `lom`
- `district_slug`: `senaru-rinjani-north`

Краткое описание: главный mountain-and-national-park cluster Ломбока, который воспринимается как самостоятельная destination-zone для trekking и volcanic scenery.

Places inside:
- `lom-mount-rinjani-national-park`

---

## 2.3 `gili-islands`
- `slug`: `gili-islands`
- `name`: `Gili Islands`
- `type`: `island-archipelago-cluster`
- `city_slug`: `lom`
- `district_slug`: `gili-islands-excursion-zone`

Краткое описание: island-archipelago cluster у северо-западного побережья Ломбока, воспринимаемый как самостоятельная marine destination-zone.

Places inside:
- `lom-gili-islands`
