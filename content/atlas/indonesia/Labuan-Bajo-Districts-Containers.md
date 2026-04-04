# Labuan Bajo Districts and Containers

Этот файл фиксирует новые сущности для Labuan Bajo pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `indonesia`
- `city_slug`: `lbj`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Labuan Bajo / West Manggarai.

---

# 1. City Districts

## 1.1 `central-harbor-waterfront`
- `slug`: `central-harbor-waterfront`
- `name`: `Central Harbor / Waterfront`
- `name_local`: `Pelabuhan Labuan Bajo`
- `city_slug`: `lbj`
- `country_slug`: `indonesia`

Краткое описание: центральный портовый и waterfront-контур Labuan Bajo вокруг гавани, Jalan Soekarno Hatta, seafood-ресторанов, дайв-офисов и вечерних прогулок у воды. Это главный городской кластер для первого знакомства с Labuan Bajo как с портовым gateway в Komodo region.

Подходит для:
- вечерних прогулок по набережной и порту;
- seafood, cafés и casual dining у воды;
- дайв-центров, city services и отправной точки к морским турам.

Текущие Atlas places в этом районе:
- `lbj-bajo-taco`
- `lbj-happy-banana-komodo`
- `lbj-labuan-bajo-sunset-harbor`
- `lbj-scuba-junkie-komodo`
- `lbj-taman-laut-handayani-seafood`

---

## 1.2 `waecicu-north-bay`
- `slug`: `waecicu-north-bay`
- `name`: `Waecicu / North Bay`
- `name_local`: `Pantai Waecicu`
- `city_slug`: `lbj`
- `country_slug`: `indonesia`

Краткое описание: северо-западный scenic bay contour Labuan Bajo вокруг Waecicu Beach, luxury resorts, cliffside dining и sunset-facing coastal views. Это более resort-ориентированная часть Labuan Bajo, отделённая от портового ядра и связанная с premium stay experience.

Подходит для:
- sunset dining и sea-view restaurants;
- resort stay и более приватной coastal атмосферы;
- красивых видов на бухту и западное побережье.

Текущие Atlas places в этом районе:
- `lbj-atlantis-on-the-rock`
- `lbj-la-cucina`

---

## 1.3 `batu-cermin-wae-sambi`
- `slug`: `batu-cermin-wae-sambi`
- `name`: `Batu Cermin / Wae Sambi`
- `name_local`: `Gua Batu Cermin`
- `city_slug`: `lbj`
- `country_slug`: `indonesia`

Краткое описание: inland-зона к востоку от центра Labuan Bajo, связанная с Batu Cermin Cave, известняковыми холмами и короткими природными city-side trips. Это не beach и не harbor контур, а близкий к городу geological / cave cluster.

Подходит для:
- коротких выездов из города;
- cave и geology experience;
- природных stopover-локаций рядом с Labuan Bajo.

Текущие Atlas places в этом районе:
- `lbj-batu-cermin-cave`

---

## 1.4 `komodo-marine-excursion-zone`
- `slug`: `komodo-marine-excursion-zone`
- `name`: `Komodo Marine Excursion Zone`
- `name_local`: `Taman Nasional Komodo`
- `city_slug`: `lbj`
- `country_slug`: `indonesia`

Краткое описание: внешняя marine excursion-zone, связанная с Komodo National Park, Padar, Pink Beach, Manta Point и другими island-hopping маршрутами из Labuan Bajo. Это не городской район в строгом смысле, а ключевой day-trip / liveaboard cluster, ради которого большинство путешественников вообще приезжает в Labuan Bajo.

Подходит для:
- island hopping и boat tours;
- snorkeling, diving и manta encounters;
- iconic viewpoints, пляжей и UNESCO-маршрутов.

Текущие Atlas places в этом районе:
- `lbj-komodo-national-park`
- `lbj-manta-point`
- `lbj-padar-island-viewpoint`
- `lbj-pink-beach`

---

# 2. Place Containers

## 2.1 `labuan-bajo-harbor`
- `slug`: `labuan-bajo-harbor`
- `name`: `Labuan Bajo Harbor`
- `type`: `urban-harbor-cluster`
- `city_slug`: `lbj`
- `district_slug`: `central-harbor-waterfront`

Краткое описание: главный harbor-front cluster Labuan Bajo с набережной, лодками, seafood-ресторанами, вечерним променадом и отправлением морских туров.

Places inside:
- `lbj-labuan-bajo-sunset-harbor`

---

## 2.2 `komodo-national-park`
- `slug`: `komodo-national-park`
- `name`: `Komodo National Park`
- `type`: `marine-park-cluster`
- `city_slug`: `lbj`
- `district_slug`: `komodo-marine-excursion-zone`

Краткое описание: большой marine/island cluster, объединяющий Komodo National Park, его острова, viewpoints, snorkeling spots и знаменитые природные локации региона.

Places inside:
- `lbj-komodo-national-park`
- `lbj-manta-point`
- `lbj-padar-island-viewpoint`
- `lbj-pink-beach`
