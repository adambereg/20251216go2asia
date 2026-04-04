# Bali Districts and Containers

Этот файл фиксирует новые сущности для Bali pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `indonesia`
- `city_slug`: `bali`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Бали.

---

# 1. City Districts

## 1.1 `ubud-central`
- `slug`: `ubud-central`
- `name`: `Ubud Central`
- `name_local`: `Ubud`
- `city_slug`: `bali`
- `country_slug`: `indonesia`

Краткое описание: культурное и wellness-ядро центрального Бали вокруг Ubud, где сосредоточены cafés, fine dining, ремесленные улицы, храмовая атмосфера и один из самых узнаваемых inland lifestyle-контуров острова.

Подходит для:
- wellness и healthy cafés;
- культурной и гастрономической атмосферы Ubud;
- первого знакомства с inland Bali.

Текущие Atlas places в этом районе:
- `bali-clear-cafe-ubud`
- `bali-locavore-restaurant`
- `bali-ubud-monkey-forest`

---

## 1.2 `tegallalang-tampaksiring`
- `slug`: `tegallalang-tampaksiring`
- `name`: `Tegallalang / Tampaksiring`
- `name_local`: `Tegallalang / Tampaksiring`
- `city_slug`: `bali`
- `country_slug`: `indonesia`

Краткое описание: зелёная temple-and-rice-terrace зона к северу и северо-востоку от Ubud, связанная с классическими day trips к рисовым террасам и водным храмам. Это не городской центр, а важный excursion-контур в Gianyar highlands.

Подходит для:
- rice terrace и scenic valley views;
- храмовых и ritual-локаций;
- коротких выездов из Ubud.

Текущие Atlas places в этом районе:
- `bali-tegallalang-rice-terraces`
- `bali-tirta-empul-temple`

---

## 1.3 `kintamani-batur`
- `slug`: `kintamani-batur`
- `name`: `Kintamani / Batur`
- `name_local`: `Kintamani`
- `city_slug`: `bali`
- `country_slug`: `indonesia`

Краткое описание: высокогорный volcanic-кластер северо-восточного Бали вокруг Mount Batur и кальдеры Lake Batur. Это одна из ключевых sunrise и hiking destination-зон острова, связанная с вулканическими пейзажами и прохладным highland climate.

Подходит для:
- sunrise hikes и volcano experience;
- панорамных видов на кальдеру;
- mountain day trips из южного и центрального Бали.

Текущие Atlas places в этом районе:
- `bali-mount-batur`

---

## 1.4 `seminyak-petitenget`
- `slug`: `seminyak-petitenget`
- `name`: `Seminyak / Petitenget`
- `name_local`: `Seminyak / Petitenget`
- `city_slug`: `bali`
- `country_slug`: `indonesia`

Краткое описание: upscale beach-and-lifestyle ядро юго-западного Бали с beach clubs, designer venues, sunset culture и более polished resort atmosphere. Это один из самых узнаваемых premium leisure-контуров острова.

Подходит для:
- sunset beach clubs;
- lifestyle и dining у моря;
- более polished resort-опыта.

Текущие Atlas places в этом районе:
- `bali-potato-head-beach-club`

---

## 1.5 `canggu-berawa`
- `slug`: `canggu-berawa`
- `name`: `Canggu / Berawa`
- `name_local`: `Canggu / Berawa`
- `city_slug`: `bali`
- `country_slug`: `indonesia`

Краткое описание: современный coastal-lifestyle контур к северу от Seminyak с surf culture, beach clubs, cafés и digital-nomad атмосферой. Это один из самых активных lifestyle-кластеров современного Bali.

Подходит для:
- beach clubs и party-атмосферы;
- surf и coastal lifestyle;
- более молодого и активного Bali experience.

Текущие Atlas places в этом районе:
- `bali-finns-beach-club`

---

## 1.6 `tanah-lot-tabanan-coast`
- `slug`: `tanah-lot-tabanan-coast`
- `name`: `Tanah Lot / Tabanan Coast`
- `name_local`: `Tanah Lot`
- `city_slug`: `bali`
- `country_slug`: `indonesia`

Краткое описание: ocean-temple и sunset-контур западного побережья Bali в районе Tabanan. Это отдельная scenic and spiritual destination-zone, не связанная напрямую с beach-club ядром Seminyak/Canggu.

Подходит для:
- sunset temple experience;
- ocean cliffs и iconic Bali imagery;
- coastal day trips с юга острова.

Текущие Atlas places в этом районе:
- `bali-tanah-lot-temple`

---

## 1.7 `uluwatu-pecatu-cliffs`
- `slug`: `uluwatu-pecatu-cliffs`
- `name`: `Uluwatu / Pecatu Cliffs`
- `name_local`: `Uluwatu / Pecatu`
- `city_slug`: `bali`
- `country_slug`: `indonesia`

Краткое описание: юго-западный cliff-and-surf contour Bukit Peninsula с sea temples, surf breaks, cliff bars и одними из лучших sunset viewpoints на Бали. Это самостоятельный destination-кластер южных известняковых берегов острова.

Подходит для:
- cliff sunsets и ocean views;
- surf culture и clifftop bars;
- храмов и scenic south Bali day trips.

Текущие Atlas places в этом районе:
- `bali-single-fin-bali`
- `bali-the-rock-bar-bali`
- `bali-uluwatu-temple`

---

# 2. Place Containers

## 2.1 `ubud-monkey-forest`
- `slug`: `ubud-monkey-forest`
- `name`: `Ubud Monkey Forest`
- `type`: `urban-forest-cultural-cluster`
- `city_slug`: `bali`
- `district_slug`: `ubud-central`

Краткое описание: лесной и храмовый культурный кластер в Ubud, воспринимаемый как самостоятельная destination-zone, а не просто одна точка.

Places inside:
- `bali-ubud-monkey-forest`

---

## 2.2 `potato-head-seminyak`
- `slug`: `potato-head-seminyak`
- `name`: `Potato Head Seminyak`
- `type`: `beach-club-cluster`
- `city_slug`: `bali`
- `district_slug`: `seminyak-petitenget`

Краткое описание: beachfront lifestyle-кластер Desa Potato Head в Seminyak / Petitenget, а не просто единичная venue-точка.

Places inside:
- `bali-potato-head-beach-club`

---

## 2.3 `finns-berawa`
- `slug`: `finns-berawa`
- `name`: `Finns Berawa`
- `type`: `beach-club-cluster`
- `city_slug`: `bali`
- `district_slug`: `canggu-berawa`

Краткое описание: beachfront leisure-кластер на Berawa Beach, воспринимаемый как самостоятельная destination-zone для beach-club опыта.

Places inside:
- `bali-finns-beach-club`

---

## 2.4 `uluwatu-temple-cliffs`
- `slug`: `uluwatu-temple-cliffs`
- `name`: `Uluwatu Temple Cliffs`
- `type`: `cliff-temple-scenic-cluster`
- `city_slug`: `bali`
- `district_slug`: `uluwatu-pecatu-cliffs`

Краткое описание: scenic-cliff cluster вокруг Uluwatu Temple и южных утёсов Bukit Peninsula.

Places inside:
- `bali-uluwatu-temple`
