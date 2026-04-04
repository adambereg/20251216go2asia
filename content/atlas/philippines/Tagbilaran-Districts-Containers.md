# Tagbilaran / Bohol Districts and Containers

Этот файл фиксирует новые сущности для Bohol / Tagbilaran pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `philippines`
- `city_slug`: `tag`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Тагбиларана и Бохоля.

---

# 1. City Districts

## 1.1 `tagbilaran-civic-old-airport`
- `slug`: `tagbilaran-civic-old-airport`
- `name`: `Tagbilaran Civic / Old Airport`
- `name_local`: `Tagbilaran City`
- `city_slug`: `tag`
- `country_slug`: `philippines`

Краткое описание: городской контур Тагбиларана вокруг старого центра, J.S. Torralba и бывшего аэропортового ядра. Это operational район для городских ресторанов и базовой urban-life части Бохоля.

Подходит для:
- локальной городской еды;
- базирования в Tagbilaran City;
- первого знакомства с городским слоем Бохоля.

Текущие Atlas places в этом районе:
- `tag-gerarda-s-family-restaurant`
- `tag-gerardas-family-restaurant`

---

## 1.2 `panglao-dauis-coast`
- `slug`: `panglao-dauis-coast`
- `name`: `Panglao / Dauis Coast`
- `name_local`: `Panglao / Dauis`
- `city_slug`: `tag`
- `country_slug`: `philippines`

Краткое описание: юго-западный coastal и resort contour Панглао / Dauis с seaside dining, dive-stay атмосферой и курортной логикой, связанной с побережьем и day trips из Tagbilaran.

Подходит для:
- coastal dining и resort-остановок;
- поездок на Panglao Island;
- более расслабленного seaside experience.

Текущие Atlas places в этом районе:
- `tag-bohol-bee-farm`
- `tag-panglao-island-alona-beach`

---

## 1.3 `loboc-river-countryside`
- `slug`: `loboc-river-countryside`
- `name`: `Loboc River Countryside`
- `name_local`: `Loboc`
- `city_slug`: `tag`
- `country_slug`: `philippines`

Краткое описание: river-and-countryside cluster в восточной части Бохоля вокруг Loboc River, floating restaurants и зелёных речных ландшафтов. Это классический excursion contour, а не городской район Тагбиларана.

Подходит для:
- речных круизов и countryside day trips;
- более зелёного inland experience;
- обзорных поездок по центральному Бохолю.

Текущие Atlas places в этом районе:
- `tag-loboc-river-cruise`

---

## 1.4 `corella-tarsier-countryside`
- `slug`: `corella-tarsier-countryside`
- `name`: `Corella Tarsier Countryside`
- `name_local`: `Corella`
- `city_slug`: `tag`
- `country_slug`: `philippines`

Краткое описание: тихий inland contour вокруг Corella, связанный с природоохранным опытом и знакомством с tarsier sanctuary. Это вынесенный короткий eco day-trip cluster к северо-востоку от Tagbilaran.

Подходит для:
- eco-образовательных визитов;
- природоохранного wildlife experience;
- коротких выездов из Tagbilaran.

Текущие Atlas places в этом районе:
- `tag-philippine-tarsier-sanctuary`

---

## 1.5 `carmen-chocolate-hills-excursion-zone`
- `slug`: `carmen-chocolate-hills-excursion-zone`
- `name`: `Carmen / Chocolate Hills Excursion Zone`
- `name_local`: `Carmen`
- `city_slug`: `tag`
- `country_slug`: `philippines`

Краткое описание: внешний scenic-geological cluster в глубине острова вокруг Chocolate Hills. Это не городской район, а главный природный symbol day-trip Бохоля.

Подходит для:
- iconic landscape day trips;
- обзорных площадок и road trips по Bohol interior;
- знакомства с главным природным символом острова.

Текущие Atlas places в этом районе:
- `tag-chocolate-hills`

---

# 2. Place Containers

## 2.1 `alona-beach`
- `slug`: `alona-beach`
- `name`: `Alona Beach`
- `type`: `urban-beachfront`
- `city_slug`: `tag`
- `district_slug`: `panglao-dauis-coast`

Краткое описание: главный beachfront-cluster Panglao с resort life, dive shops, restaurants и вечерней пляжной атмосферой.

Places inside:
- `tag-panglao-island-alona-beach`
