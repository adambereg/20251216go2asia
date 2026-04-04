# Hua Hin Districts and Containers

Этот файл фиксирует новые сущности для Hua Hin pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `hhn`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Хуа Хина.

---

# 1. City Districts

## 1.1 `central-hua-hin`
- `slug`: `central-hua-hin`
- `name`: `Central Hua Hin`
- `name_local`: `หัวหิน`
- `city_slug`: `hhn`
- `country_slug`: `thailand`

Краткое описание: центральная курортная часть Хуа Хина, где сходятся главный городской пляж, историческая железнодорожная станция, старые улицы у моря и классические seafood spots. Это лучший район для первого знакомства с городом и его «старым» seaside character.

Подходит для:
- первого знакомства с Хуа Хином;
- прогулок вдоль пляжа и у моря;
- исторических landmark-объектов и классических ресторанов.

Текущие Atlas places в этом районе:
- `hhn-baan-itsara-restaurant`
- `hhn-hua-hin-beach`
- `hhn-hua-hin-railway-station`

---

## 1.2 `nong-kae`
- `slug`: `nong-kae`
- `name`: `Nong Kae`
- `name_local`: `หนองแก`
- `city_slug`: `hhn`
- `country_slug`: `thailand`

Краткое описание: южная resort-зона Хуа Хина с крупными lifestyle и family attractions, beachside hotels, weekend markets и более современным курортным ритмом. Это логичный район для night-market опыта, развлечений и отдыха чуть южнее центра.

Подходит для:
- evening markets и lifestyle-атмосферы;
- семейных развлечений;
- resort-формата отдыха в южной части города.

Текущие Atlas places в этом районе:
- `hhn-cicada-market`
- `hhn-vana-nava-water-jungle`

---

## 1.3 `khao-takiab`
- `slug`: `khao-takiab`
- `name`: `Khao Takiab`
- `name_local`: `เขาตะเกียบ`
- `city_slug`: `hhn`
- `country_slug`: `thailand`

Краткое описание: южный coastal cluster Хуа Хина вокруг Monkey Mountain / Chopsticks Hill, пляжа, храмовой зоны и обзорных точек. Это одна из самых узнаваемых destination-зон города, где seaside atmosphere соединяется со смотровыми площадками, храмом и beach dining.

Подходит для:
- панорамных видов и храмовой локации;
- более курортной и scenic beach-зоны;
- sunset drinks и прогулок у моря.

Текущие Atlas places в этом районе:
- `hhn-khao-takiab`
- `hhn-let-s-sea-bar`

---

---

## 1.4 `sam-roi-yot-excursion-zone`
- `slug`: `sam-roi-yot-excursion-zone`
- `name`: `Sam Roi Yot Excursion Zone`
- `name_local`: `สามร้อยยอด`
- `city_slug`: `hhn`
- `country_slug`: `thailand`

Краткое описание: внешняя excursion-зона к югу от Хуа Хина, связанная с известняковыми холмами, морским национальным парком, пляжами и одной из самых узнаваемых cave-локаций региона. Это не городской район в строгом смысле, а важный day-trip cluster для Atlas Hua Hin.

Подходит для:
- природных day trips из Хуа Хина;
- cave и national park experience;
- более удалённых scenic локаций за пределами курортного ядра.

Текущие Atlas places в этом районе:
- `hhn-phraya-nakhon-cave`

---

# 2. Place Containers

## 2.1 `hua-hin-beach`
- `slug`: `hua-hin-beach`
- `name`: `Hua Hin Beach`
- `type`: `urban-beachfront`
- `city_slug`: `hhn`
- `district_slug`: `central-hua-hin`

Краткое описание: главный beachfront-кластер города, который воспринимается не как точка, а как длинная и самостоятельная destination-zone для прогулок, купания и classic resort experience.

Places inside:
- `hhn-hua-hin-beach`

---

## 2.2 `cicada-market`
- `slug`: `cicada-market`
- `name`: `Cicada Market`
- `type`: `market-cluster`
- `city_slug`: `hhn`
- `district_slug`: `nong-kae`

Краткое описание: weekend market-кластер в Nong Kae с арт-лавками, уличной едой, выступлениями и вечерней прогулочной атмосферой. В Atlas это логично трактовать как самостоятельный container, а не как одиночную точку.

Places inside:
- `hhn-cicada-market`

---

## 2.3 `khao-takiab-hill`
- `slug`: `khao-takiab-hill`
- `name`: `Khao Takiab Hill`
- `type`: `scenic-hill-cluster`
- `city_slug`: `hhn`
- `district_slug`: `khao-takiab`

Краткое описание: scenic coastal cluster вокруг холма Khao Takiab с храмом, смотровыми площадками, обезьянами и выходом к пляжной зоне.

Places inside:
- `hhn-khao-takiab`
