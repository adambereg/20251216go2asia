# Vang Vieng Districts and Containers

Этот файл фиксирует новые сущности для Vang Vieng pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `laos`
- `city_slug`: `vvg`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Ванг Вьенга.

---

# 1. City Districts

## 1.1 `central-town-riverside`
- `slug`: `central-town-riverside`
- `name`: `Central Town / Riverside`
- `name_local`: `ວັງວຽງ`
- `city_slug`: `vvg`
- `country_slug`: `laos`

Краткое описание: центральный городской контур Ванг Вьенга вдоль Nam Song River и главной туристической сетки улиц. Это базовый walkable core для кафе, баров, вечерней жизни и первого знакомства с town-side атмосферой Ванг Вьенга.

Подходит для:
- первого знакомства с Ванг Вьенгом;
- кафе, баров и туристической городской среды;
- прогулок у реки в пределах town core.

Текущие Atlas places в этом районе:
- `vvg-cafe-de-vang-vieng`
- `vvg-gary-s-irish-bar`
- `vvg-sakura-bar`

---

## 1.2 `west-bank-river-bars`
- `slug`: `west-bank-river-bars`
- `name`: `West Bank River Bars`
- `name_local`: `ແມ່ນ້ຳຊອງ`
- `city_slug`: `vvg`
- `country_slug`: `laos`

Краткое описание: западный берег Nam Song напротив town core с river bars, sunset decks, tubing launches и более расслабленной outdoor-атмосферой. Это не официальный городской район, а важный operational riverside cluster для текущего Atlas Vang Vieng set.

Подходит для:
- sunset bars и riverfront chill;
- tubing и мягкого adventure-nightlife слоя;
- открытых видов на карстовые горы у реки.

Текущие Atlas places в этом районе:
- `vvg-kangaroo-sunset-bar`
- `vvg-nam-song-river-tubing`
- `vvg-peeping-som-s-bar-restaurant`
- `vvg-smile-beach-bar`
- `vvg-sunset-point-nam-song`

---

## 1.3 `tham-chang-southwest`
- `slug`: `tham-chang-southwest`
- `name`: `Tham Chang Southwest`
- `name_local`: `ຖ້ຳຈັງ`
- `city_slug`: `vvg`
- `country_slug`: `laos`

Краткое описание: юго-западный short-trip contour сразу за Nam Song River, связанный с Tham Chang Cave и первыми карстовыми выходами у города. Это близкая природная локация, отличающаяся от nightlife-рiverside и более дальних countryside/excursion зон.

Подходит для:
- коротких выездов из town core;
- cave experience и смотровых точек;
- быстрого знакомства с карстовым ландшафтом Ванг Вьенга.

Текущие Atlas places в этом районе:
- `vvg-tham-chang-cave`

---

## 1.4 `pha-ngern-organic-farm-countryside`
- `slug`: `pha-ngern-organic-farm-countryside`
- `name`: `Pha Ngern / Organic Farm Countryside`
- `name_local`: `ຜາເງິນ`
- `city_slug`: `vvg`
- `country_slug`: `laos`

Краткое описание: countryside-контур к западу и северо-западу от town core, связанный с Pha Ngern Viewpoint, рисовыми полями, фермами и спокойными rural roads вдоль Nam Song. Это day-trip / scenic cluster за пределами основного центра.

Подходит для:
- viewpoint hikes и mountain views;
- countryside rides и спокойных выездов;
- organic farm stopovers и более тихого Vang Vieng.

Текущие Atlas places в этом районе:
- `vvg-organic-mulberry-farm-cafe`
- `vvg-pha-ngern-viewpoint`

---

## 1.5 `blue-lagoon-phu-kham-excursion-zone`
- `slug`: `blue-lagoon-phu-kham-excursion-zone`
- `name`: `Blue Lagoon / Phu Kham Excursion Zone`
- `name_local`: `ຖ້ຳພູຄຳ`
- `city_slug`: `vvg`
- `country_slug`: `laos`

Краткое описание: внешняя excursion-зона к западу от Ванг Вьенга у Ban Na Thong, связанная с Blue Lagoon 1 и Tham Phu Kham Cave. Это один из самых узнаваемых природных day-trip кластеров региона, а не городской район в строгом смысле.

Подходит для:
- blue lagoon и cave experience;
- day trips за пределы town core;
- купания, природных stopovers и карстовых пейзажей.

Текущие Atlas places в этом районе:
- `vvg-blue-lagoon-1`
- `vvg-tham-phu-kham-cave`

---

# 2. Place Containers

## 2.1 `nam-song-river-tubing-route`
- `slug`: `nam-song-river-tubing-route`
- `name`: `Nam Song River Tubing Route`
- `type`: `river-activity-route`
- `city_slug`: `vvg`
- `district_slug`: `west-bank-river-bars`

Краткое описание: tubing-маршрут по Nam Song River как самостоятельная activity-zone, а не одна точка.

Places inside:
- `vvg-nam-song-river-tubing`
