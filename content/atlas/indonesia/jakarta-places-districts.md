# Jakarta Places → Districts / Containers

Этот файл фиксирует связи для **12 мест Джакарты, которые уже есть в Atlas**.

Он используется как mapping-документ и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `indonesia`
- `city_slug`: `jkt`

---

## 1. Ancol Dreamland
- `slug`: `jkt-ancol-dreamland`
- `name`: `Ancol Dreamland`

### Place → District
- `district_slug`: `ancol-north-coast`
- `district_name`: `Ancol / North Coast`

### Place → Container
- `container_slug`: `ancol-dreamland`
- `container_name`: `Ancol Dreamland`

Пояснение: это не одиночная точка, а большой coastal recreation cluster северной Джакарты. Поэтому place логично живёт и как district-linked place, и как container-сущность.

---

## 2. Café Batavia
- `slug`: `jkt-cafe-batavia`
- `name`: `Café Batavia`

### Place → District
- `district_slug`: `kota-tua-glodok`
- `district_name`: `Kota Tua / Glodok`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Café Batavia находится прямо на Fatahillah Square в Kota Tua и относится к историческому old-town контексту. Контейнер не нужен.

---

## 3. Istiqlal Mosque
- `slug`: `jkt-istiqlal-mosque`
- `name`: `Istiqlal Mosque`

### Place → District
- `district_slug`: `merdeka-gambir-istiqlal`
- `district_name`: `Merdeka / Gambir / Istiqlal`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: мечеть живёт в главном государственно-монументальном контуре столицы рядом с Monas и Cathedral. Контейнер не нужен.

---

## 4. Jakarta Cathedral
- `slug`: `jkt-jakarta-cathedral`
- `name`: `Jakarta Cathedral`

### Place → District
- `district_slug`: `merdeka-gambir-istiqlal`
- `district_name`: `Merdeka / Gambir / Istiqlal`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: собор расположен рядом с Istiqlal и Merdeka core, поэтому логично относится к тому же district. Контейнер не нужен.

---

## 5. Kota Tua Jakarta
- `slug`: `jkt-kota-tua-jakarta`
- `name`: `Kota Tua Jakarta`

### Place → District
- `district_slug`: `kota-tua-glodok`
- `district_name`: `Kota Tua / Glodok`

### Place → Container
- `container_slug`: `kota-tua-jakarta`
- `container_name`: `Kota Tua Jakarta`

Пояснение: это не одна точка, а самостоятельный urban old-town cluster. Поэтому нужен container.

---

## 6. Nasi Goreng Kambing Kebon Sirih
- `slug`: `jkt-nasi-goreng-kambing-kebon-sirih`
- `name`: `Nasi Goreng Kambing Kebon Sirih`

### Place → District
- `district_slug`: `menteng-thamrin`
- `district_name`: `Menteng / Thamrin`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Kebon Sirih живёт в центральном Menteng/Thamrin контуре и логично относится к нему как к urban dining area. Контейнер не нужен.

---

## 7. National Monument
- `slug`: `jkt-national-monument`
- `name`: `National Monument`

### Place → District
- `district_slug`: `merdeka-gambir-istiqlal`
- `district_name`: `Merdeka / Gambir / Istiqlal`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Monas — ключевой landmark Merdeka core. Контейнер не нужен на текущем этапе.

---

## 8. Plataran Menteng
- `slug`: `jkt-plataran-menteng`
- `name`: `Plataran Menteng`

### Place → District
- `district_slug`: `menteng-thamrin`
- `district_name`: `Menteng / Thamrin`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: ресторан находится в Menteng и относится к более polished central Jakarta contour. Контейнер не нужен.

---

## 9. Skye Bar & Restaurant
- `slug`: `jkt-skye-bar-restaurant`
- `name`: `Skye Bar & Restaurant`

### Place → District
- `district_slug`: `menteng-thamrin`
- `district_name`: `Menteng / Thamrin`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: SKYE находится в Menara BCA на M.H. Thamrin и логично относится к Menteng/Thamrin skyline-dining contour. Контейнер не нужен.

---

## 10. Social House
- `slug`: `jkt-social-house`
- `name`: `Social House`

### Place → District
- `district_slug`: `menteng-thamrin`
- `district_name`: `Menteng / Thamrin`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Social House находится в Grand Indonesia на Thamrin и относится к central dining/lifestyle contour. Контейнер не нужен.

---

## 11. Taman Mini Indonesia Indah
- `slug`: `jkt-taman-mini-indonesia-indah`
- `name`: `Taman Mini Indonesia Indah`

### Place → District
- `district_slug`: `tmii-east-jakarta-excursion-zone`
- `district_name`: `TMII / East Jakarta Excursion Zone`

### Place → Container
- `container_slug`: `taman-mini-indonesia-indah`
- `container_name`: `Taman Mini Indonesia Indah`

Пояснение: это большой cultural park cluster Восточной Джакарты, а не одиночная точка. Поэтому нужен container.

---

## 12. Union Café
- `slug`: `jkt-union-cafe`
- `name`: `Union Café`

### Place → District
- `district_slug`: `senayan-scbd`
- `district_name`: `Senayan / SCBD`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: Union Plaza Senayan относится к юго-центральному shopping/business contour Senayan. Контейнер не нужен.

---

# Summary

## District links
- `jkt-ancol-dreamland` → `ancol-north-coast`
- `jkt-cafe-batavia` → `kota-tua-glodok`
- `jkt-istiqlal-mosque` → `merdeka-gambir-istiqlal`
- `jkt-jakarta-cathedral` → `merdeka-gambir-istiqlal`
- `jkt-kota-tua-jakarta` → `kota-tua-glodok`
- `jkt-nasi-goreng-kambing-kebon-sirih` → `menteng-thamrin`
- `jkt-national-monument` → `merdeka-gambir-istiqlal`
- `jkt-plataran-menteng` → `menteng-thamrin`
- `jkt-skye-bar-restaurant` → `menteng-thamrin`
- `jkt-social-house` → `menteng-thamrin`
- `jkt-taman-mini-indonesia-indah` → `tmii-east-jakarta-excursion-zone`
- `jkt-union-cafe` → `senayan-scbd`

## Container links
- `jkt-ancol-dreamland` → `ancol-dreamland`
- `jkt-kota-tua-jakarta` → `kota-tua-jakarta`
- `jkt-taman-mini-indonesia-indah` → `taman-mini-indonesia-indah`

## Places without container
- `jkt-cafe-batavia`
- `jkt-istiqlal-mosque`
- `jkt-jakarta-cathedral`
- `jkt-nasi-goreng-kambing-kebon-sirih`
- `jkt-national-monument`
- `jkt-plataran-menteng`
- `jkt-skye-bar-restaurant`
- `jkt-social-house`
- `jkt-union-cafe`