# Krabi Districts and Containers

Этот файл фиксирует новые сущности для Krabi pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `kbi`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Краби.

---

# 1. City Districts

## 1.1 `krabi-town-riverfront`
- `slug`: `krabi-town-riverfront`
- `name`: `Krabi Town / Riverfront`
- `name_local`: `ตัวเมืองกระบี่`
- `city_slug`: `kbi`
- `country_slug`: `thailand`

Краткое описание: городское ядро Краби у реки Krabi River с набережной, пирсами, рынками и главными символическими landmark-объектами. Это район для первого знакомства именно с Krabi Town, а не с пляжным курортным контуром Ao Nang.

Подходит для:
- прогулок по Krabi Town и riverfront;
- городских landmark-объектов;
- более локального городского опыта вне beach resort зоны.

Текущие Atlas places в этом районе:
- `kbi-khao-khanab-nam`

---

## 1.2 `ao-nang`
- `slug`: `ao-nang`
- `name`: `Ao Nang`
- `name_local`: `อ่าวนาง`
- `city_slug`: `kbi`
- `country_slug`: `thailand`

Краткое описание: главный beach resort hub материкового Краби, откуда стартуют лодки и экскурсии к островам и полуострову Railay. Это самая узнаваемая курортная зона для пляжного отдыха, прогулок у моря и первого базирования в Krabi area.

Подходит для:
- пляжа и resort-атмосферы;
- boat departures и island hopping;
- первого курортного опыта в Краби.

Текущие Atlas places в этом районе:
- `kbi-ao-nang-beach`

---

## 1.3 `railay-phra-nang`
- `slug`: `railay-phra-nang`
- `name`: `Railay / Phra Nang`
- `name_local`: `ไร่เล / พระนาง`
- `city_slug`: `kbi`
- `country_slug`: `thailand`

Краткое описание: изолированный limestone peninsula-cluster между Krabi Town и Ao Nang, куда попадают только по воде. Это одна из самых iconic destination-зон региона: пляжи Railay, скалы, скалолазание, Phra Nang Cave Beach и рестораны с видом на известняковые утёсы.

Подходит для:
- beach day trips и scenic shoreline;
- rock climbing и limestone landscape;
- красивых sunset-локаций и пляжных ресторанов.

Текущие Atlas places в этом районе:
- `kbi-railay-beach`
- `kbi-the-grotto-restaurant`

---

## 1.4 `tiger-cave-foothills`
- `slug`: `tiger-cave-foothills`
- `name`: `Tiger Cave Foothills`
- `name_local`: `วัดถ้ำเสือ`
- `city_slug`: `kbi`
- `country_slug`: `thailand`

Краткое описание: северо-восточная temple-and-foothills зона у подножия известняковых холмов рядом с Krabi Town, связанная с Wat Tham Suea. Это духовная и обзорная локация, отличающаяся от beach-контуров Краби.

Подходит для:
- храмовой и паломнической локации;
- обзорных подъёмов и панорам;
- коротких выездов из Krabi Town.

Текущие Atlas places в этом районе:
- `kbi-tiger-cave-temple`

---

## 1.5 `khlong-thom-excursion-zone`
- `slug`: `khlong-thom-excursion-zone`
- `name`: `Khlong Thom Excursion Zone`
- `name_local`: `คลองท่อม`
- `city_slug`: `kbi`
- `country_slug`: `thailand`

Краткое описание: юго-восточная excursion-зона провинции Краби, связанная с лесами, природными тропами, горячими источниками и Emerald Pool. Это не городской район, а важный day-trip cluster для природных поездок из Krabi base.

Подходит для:
- Emerald Pool и природных маршрутов;
- лесного и термального опыта;
- day trips за пределы coastal ядра.

Текущие Atlas places в этом районе:
- `kbi-emerald-pool`

---

## 1.6 `hong-islands-excursion-zone`
- `slug`: `hong-islands-excursion-zone`
- `name`: `Hong Islands Excursion Zone`
- `name_local`: `เกาะห้อง`
- `city_slug`: `kbi`
- `country_slug`: `thailand`

Краткое описание: внешний island-cluster в акватории Krabi / Ao Luk, связанный с Hong Island, lagoon scenery и морскими day trips. Это не городской район в строгом смысле, а отдельная excursion-zone для одной из самых красивых островных локаций у Краби.

Подходит для:
- island hopping и морских экскурсий;
- lagoon и limestone-sea scenery;
- снорклинга и пляжного day trip опыта.

Текущие Atlas places в этом районе:
- `kbi-hong-islands`

---

## 1.7 `phi-phi-excursion-zone`
- `slug`: `phi-phi-excursion-zone`
- `name`: `Phi Phi Excursion Zone`
- `name_local`: `เกาะพีพี`
- `city_slug`: `kbi`
- `country_slug`: `thailand`

Краткое описание: внешний island-archipelago cluster провинции Краби, связанный с Phi Phi Don, Phi Phi Le и морскими поездками по Andaman Sea. Для Atlas Krabi это отдельная excursion-zone, а не часть материкового urban/coastal контура.

Подходит для:
- island hopping и boating;
- iconic Andaman scenery;
- day trips и коротких island escapes из Краби.

Текущие Atlas places в этом районе:
- `kbi-phi-phi-islands`

---

# 2. Place Containers

## 2.1 `ao-nang-beach`
- `slug`: `ao-nang-beach`
- `name`: `Ao Nang Beach`
- `type`: `urban-beachfront`
- `city_slug`: `kbi`
- `district_slug`: `ao-nang`

Краткое описание: главный beachfront-кластер материкового Краби, который воспринимается как самостоятельная destination-zone для пляжа, прогулок и отправления на морские экскурсии.

Places inside:
- `kbi-ao-nang-beach`

---

## 2.2 `railay-beach`
- `slug`: `railay-beach`
- `name`: `Railay Beach`
- `type`: `peninsula-beach-cluster`
- `city_slug`: `kbi`
- `district_slug`: `railay-phra-nang`

Краткое описание: beach-and-cliffs cluster на полуострове Railay с West Railay, East Railay и близостью к Phra Nang. Это не одна точка, а самостоятельная destination-zone.

Places inside:
- `kbi-railay-beach`

---

## 2.3 `hong-islands`
- `slug`: `hong-islands`
- `name`: `Hong Islands`
- `type`: `island-archipelago-cluster`
- `city_slug`: `kbi`
- `district_slug`: `hong-islands-excursion-zone`

Краткое описание: island-cluster в составе морской excursion-зоны у Краби с lagoon, пляжами и лодочными маршрутами.

Places inside:
- `kbi-hong-islands`

---

## 2.4 `phi-phi-islands`
- `slug`: `phi-phi-islands`
- `name`: `Phi Phi Islands`
- `type`: `island-archipelago-cluster`
- `city_slug`: `kbi`
- `district_slug`: `phi-phi-excursion-zone`

Краткое описание: знаменитый архипелаг как самостоятельная destination-zone, а не одиночная точка.

Places inside:
- `kbi-phi-phi-islands`
