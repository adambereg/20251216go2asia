# Bali Places → Districts / Containers

Этот файл фиксирует связи для **12 мест Бали, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `indonesia`
- `city_slug`: `bali`

---

## 1. Clear Café Ubud
- `slug`: `bali-clear-cafe-ubud`
- `name`: `Clear Café Ubud`

### Place → District
- `district_slug`: `ubud-central`
- `district_name`: `Ubud Central`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место по смыслу и локации относится к центральному Ubud wellness/café contour. Контейнер не нужен.

---

## 2. FINNS Beach Club
- `slug`: `bali-finns-beach-club`
- `name`: `FINNS Beach Club`

### Place → District
- `district_slug`: `canggu-berawa`
- `district_name`: `Canggu / Berawa`

### Place → Container
- `container_slug`: `finns-berawa`
- `container_name`: `Finns Berawa`

Пояснение: FINNS — это не просто точка, а самостоятельный Berawa beachfront-cluster, поэтому нужен container.

---

## 3. Locavore Restaurant
- `slug`: `bali-locavore-restaurant`
- `name`: `Locavore Restaurant`

### Place → District
- `district_slug`: `ubud-central`
- `district_name`: `Ubud Central`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: fine-dining place, живущий внутри центрального гастрономического контура Ubud. Контейнер не нужен.

---

## 4. Mount Batur
- `slug`: `bali-mount-batur`
- `name`: `Mount Batur`

### Place → District
- `district_slug`: `kintamani-batur`
- `district_name`: `Kintamani / Batur`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: это самостоятельная крупная volcanic destination-entity в highlands Kintamani. Контейнер не нужен.

---

## 5. Potato Head Beach Club
- `slug`: `bali-potato-head-beach-club`
- `name`: `Potato Head Beach Club`

### Place → District
- `district_slug`: `seminyak-petitenget`
- `district_name`: `Seminyak / Petitenget`

### Place → Container
- `container_slug`: `potato-head-seminyak`
- `container_name`: `Potato Head Seminyak`

Пояснение: Potato Head живёт как самостоятельный beachfront lifestyle-cluster, а не просто точка. Поэтому нужен container.

---

## 6. Single Fin Bali
- `slug`: `bali-single-fin-bali`
- `name`: `Single Fin Bali`

### Place → District
- `district_slug`: `uluwatu-pecatu-cliffs`
- `district_name`: `Uluwatu / Pecatu Cliffs`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: место относится к южному clifftop surf/sunset contour в Pecatu/Uluwatu. Контейнер не нужен.

---

## 7. Tanah Lot Temple
- `slug`: `bali-tanah-lot-temple`
- `name`: `Tanah Lot Temple`

### Place → District
- `district_slug`: `tanah-lot-tabanan-coast`
- `district_name`: `Tanah Lot / Tabanan Coast`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: iconic ocean temple destination западного побережья. Контейнер не нужен.

---

## 8. Tegallalang Rice Terraces
- `slug`: `bali-tegallalang-rice-terraces`
- `name`: `Tegallalang Rice Terraces`

### Place → District
- `district_slug`: `tegallalang-tampaksiring`
- `district_name`: `Tegallalang / Tampaksiring`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: rice-terrace cluster в highland/day-trip контуре к северу от Ubud. Контейнер не нужен на текущем этапе.

---

## 9. The Rock Bar Bali
- `slug`: `bali-the-rock-bar-bali`
- `name`: `The Rock Bar Bali`

### Place → District
- `district_slug`: `uluwatu-pecatu-cliffs`
- `district_name`: `Uluwatu / Pecatu Cliffs`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: cliff bar в южном scenic coastline-контуре Bukit Peninsula. Контейнер не нужен.

---

## 10. Tirta Empul Temple
- `slug`: `bali-tirta-empul-temple`
- `name`: `Tirta Empul Temple`

### Place → District
- `district_slug`: `tegallalang-tampaksiring`
- `district_name`: `Tegallalang / Tampaksiring`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: water temple day-trip zone в Tampaksiring, логично живёт в temple/rice-terrace hinterland contour. Контейнер не нужен.

---

## 11. Ubud Monkey Forest
- `slug`: `bali-ubud-monkey-forest`
- `name`: `Ubud Monkey Forest`

### Place → District
- `district_slug`: `ubud-central`
- `district_name`: `Ubud Central`

### Place → Container
- `container_slug`: `ubud-monkey-forest`
- `container_name`: `Ubud Monkey Forest`

Пояснение: это самостоятельный forest-temple cluster внутри Ubud, а не единичная точка. Поэтому нужен container.

---

## 12. Uluwatu Temple
- `slug`: `bali-uluwatu-temple`
- `name`: `Uluwatu Temple`

### Place → District
- `district_slug`: `uluwatu-pecatu-cliffs`
- `district_name`: `Uluwatu / Pecatu Cliffs`

### Place → Container
- `container_slug`: `uluwatu-temple-cliffs`
- `container_name`: `Uluwatu Temple Cliffs`

Пояснение: это не только храм, но и самостоятельный cliff-scenic cluster, поэтому container уместен.

---

# Summary

## District links
- `bali-clear-cafe-ubud` → `ubud-central`
- `bali-finns-beach-club` → `canggu-berawa`
- `bali-locavore-restaurant` → `ubud-central`
- `bali-mount-batur` → `kintamani-batur`
- `bali-potato-head-beach-club` → `seminyak-petitenget`
- `bali-single-fin-bali` → `uluwatu-pecatu-cliffs`
- `bali-tanah-lot-temple` → `tanah-lot-tabanan-coast`
- `bali-tegallalang-rice-terraces` → `tegallalang-tampaksiring`
- `bali-the-rock-bar-bali` → `uluwatu-pecatu-cliffs`
- `bali-tirta-empul-temple` → `tegallalang-tampaksiring`
- `bali-ubud-monkey-forest` → `ubud-central`
- `bali-uluwatu-temple` → `uluwatu-pecatu-cliffs`

## Container links
- `bali-finns-beach-club` → `finns-berawa`
- `bali-potato-head-beach-club` → `potato-head-seminyak`
- `bali-ubud-monkey-forest` → `ubud-monkey-forest`
- `bali-uluwatu-temple` → `uluwatu-temple-cliffs`

## Places without container
- `bali-clear-cafe-ubud`
- `bali-locavore-restaurant`
- `bali-mount-batur`
- `bali-single-fin-bali`
- `bali-tanah-lot-temple`
- `bali-tegallalang-rice-terraces`
- `bali-the-rock-bar-bali`
- `bali-tirta-empul-temple`
