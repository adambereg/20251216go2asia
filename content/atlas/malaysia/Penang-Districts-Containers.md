# Penang Districts and Containers

Этот файл фиксирует новые сущности для Penang pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `malaysia`
- `city_slug`: `png`

> Важно: это curated operational set для существующих Atlas places Пенанга, а не полный административный список районов Пенанга.

---

# 1. City Districts

## 1.1 `heritage-core-armenian-beach-street`
- `slug`: `heritage-core-armenian-beach-street`
- `name`: `Heritage Core / Armenian Street / Beach Street`
- `name_local`: `乔治市世遗核心区`
- `city_slug`: `png`
- `country_slug`: `malaysia`

Краткое описание: историческое сердце George Town внутри UNESCO core с shophouse-улицами, mural culture, heritage cafés, museums и пешеходной атмосферой старого портового города. Это главный район для первого знакомства с Penang heritage layer.

Подходит для:
- исторических прогулок по старому George Town;
- street art, cafés и heritage shophouses;
- museums, old streets и первого знакомства с городом.

Текущие Atlas places в этом районе:
- `png-cheong-fatt-tze-blue-mansion`
- `png-china-house`
- `png-george-town-unesco-world-heritage-area`
- `png-jawi-house-cafe-gallery`
- `png-penang-street-art`
- `png-tek-sen-restaurant`

---

## 1.2 `weld-quay-clan-jetties`
- `slug`: `weld-quay-clan-jetties`
- `name`: `Weld Quay / Clan Jetties`
- `name_local`: `姓氏桥 / 海墘`
- `city_slug`: `png`
- `country_slug`: `malaysia`

Краткое описание: исторический waterfront contour у Weld Quay и старого порта George Town с деревянными jetty-settlements, морской торговой памятью и edge-of-harbour атмосферой. Это отдельный riverfront/harbour heritage cluster, отличающийся от внутренних улиц UNESCO core.

Подходит для:
- waterfront heritage и old port atmosphere;
- clan jetty walks и фотогеничных wooden settlements;
- понимания торгового и морского прошлого Penang.

Текущие Atlas places в этом районе:
- `png-clan-jetties-of-penang`

---

## 1.3 `komtar-prangin-city-centre`
- `slug`: `komtar-prangin-city-centre`
- `name`: `Komtar / Prangin City Centre`
- `name_local`: `光大 / 市中心`
- `city_slug`: `png`
- `country_slug`: `malaysia`

Краткое описание: более современный central George Town contour вокруг Komtar, Jalan Penang и Prangin с malls, observation venues, transport hub и переходом от heritage city к современному urban Penang.

Подходит для:
- city views и modern urban Penang;
- transport hub и центральной логистики;
- шопинга и перехода между heritage core и новыми кварталами.

Текущие Atlas places в этом районе:
- `png-the-top-komtar-sky-dining`

---

## 1.4 `gurney-pulau-tikus`
- `slug`: `gurney-pulau-tikus`
- `name`: `Gurney / Pulau Tikus`
- `name_local`: `葛尼 / 浮罗池滑`
- `city_slug`: `png`
- `country_slug`: `malaysia`

Краткое описание: северный seafront lifestyle contour George Town вдоль Gurney Drive и Pulau Tikus с hawker culture, malls, upscale residences и evening promenade atmosphere. Это один из самых узнаваемых food-and-waterfront кластеров Пенанга.

Подходит для:
- hawker food и evening promenade;
- seafront lifestyle и более современного George Town;
- coastal dining и прогулок вдоль Gurney Drive.

Текущие Atlas places в этом районе:
- `png-gurney-drive-hawker-centre`

---

## 1.5 `ayer-itam-penang-hill`
- `slug`: `ayer-itam-penang-hill`
- `name`: `Ayer Itam / Penang Hill`
- `name_local`: `亚依淡 / 升旗山`
- `city_slug`: `png`
- `country_slug`: `malaysia`

Краткое описание: hill-and-temple контур во внутренних возвышенностях острова вокруг Ayer Itam, Kek Lok Si и Penang Hill. Это зелёная, обзорная и духовная зона, отличающаяся от coastal heritage George Town.

Подходит для:
- hill views и более прохладного upland experience;
- temple visits и pilgrimage landmarks;
- коротких scenic trips из George Town.

Текущие Atlas places в этом районе:
- `png-kek-lok-si-temple`
- `png-penang-hill`

---

# 2. Place Containers

## 2.1 `george-town-unesco-core`
- `slug`: `george-town-unesco-core`
- `name`: `George Town UNESCO Core`
- `type`: `historic-city-core-cluster`
- `city_slug`: `png`
- `district_slug`: `heritage-core-armenian-beach-street`

Краткое описание: исторический urban-core cluster George Town как самостоятельная destination-zone с улицами наследия, shophouses, museums, cafés и уличной культурой.

Places inside:
- `png-george-town-unesco-world-heritage-area`

---

## 2.2 `clan-jetties`
- `slug`: `clan-jetties`
- `name`: `Clan Jetties`
- `type`: `waterfront-heritage-cluster`
- `city_slug`: `png`
- `district_slug`: `weld-quay-clan-jetties`

Краткое описание: waterfront heritage cluster на сваях у старого порта George Town, воспринимаемый как самостоятельная destination-zone, а не одна точка.

Places inside:
- `png-clan-jetties-of-penang`

---

## 2.3 `penang-street-art-route`
- `slug`: `penang-street-art-route`
- `name`: `Penang Street Art Route`
- `type`: `street-art-route`
- `city_slug`: `png`
- `district_slug`: `heritage-core-armenian-beach-street`

Краткое описание: маршрут street art по старым улицам George Town вокруг Armenian Street и соседних кварталов как отдельная прогулочная destination-zone.

Places inside:
- `png-penang-street-art`

---

## 2.4 `gurney-drive-promenade`
- `slug`: `gurney-drive-promenade`
- `name`: `Gurney Drive Promenade`
- `type`: `urban-seafront-cluster`
- `city_slug`: `png`
- `district_slug`: `gurney-pulau-tikus`

Краткое описание: seafront lifestyle-cluster вдоль Gurney Drive с hawker food, evening walks и coastal city atmosphere.

Places inside:
- `png-gurney-drive-hawker-centre`
