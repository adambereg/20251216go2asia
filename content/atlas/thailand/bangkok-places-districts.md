# Bangkok Places → Districts / Containers

Этот файл фиксирует связи для **12 мест Бангкока, которые уже есть в Atlas**.

Он используется как mapping-документ для Bangkok pilot и содержит:

- связь `place -> district`
- связь `place -> container` (только где контейнер действительно нужен)

Иерархия:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `bangkok`

---

## 1. Asiatique The Riverfront
- `slug`: `bkk-asiatique-the-riverfront`
- `name`: `Asiatique The Riverfront`

### Place → District
- `district_slug`: `bang-kho-laem`
- `district_name`: `Bang Kho Laem`

### Place → Container
- `container_slug`: `asiatique-the-riverfront`
- `container_name`: `Asiatique The Riverfront`

Пояснение: здесь контейнер нужен, потому что это не одна отдельная точка, а большой riverside-комплекс с магазинами, ресторанами и развлечениями. Адресная привязка идёт к району Bang Kho Laem.

---

## 2. Blue Elephant Bangkok
- `slug`: `bkk-blue-elephant-bangkok`
- `name`: `Blue Elephant Bangkok`

### Place → District
- `district_slug`: `sathon`
- `district_name`: `Sathon`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: контейнер тут не нужен. Это отдельный ресторан, а не торговый или гостиничный комплекс.

---

## 3. Chatuchak Weekend Market
- `slug`: `bkk-chatuchak-weekend-market`
- `name`: `Chatuchak Weekend Market`

### Place → District
- `district_slug`: `chatuchak`
- `district_name`: `Chatuchak`

### Place → Container
- `container_slug`: `chatuchak-weekend-market`
- `container_name`: `Chatuchak Weekend Market`

Пояснение: контейнер нужен, потому что это огромный рынок из множества секций и лавок. Это не одна отдельная точка, а большой рыночный комплекс.

---

## 4. Chinatown
- `slug`: `bkk-chinatown`
- `name`: `Chinatown`

### Place → District
- `district_slug`: `samphanthawong`
- `district_name`: `Samphanthawong`

### Place → Container
- `container_slug`: `chinatown-bangkok`
- `container_name`: `Chinatown Bangkok`

Пояснение: здесь контейнер нужен не как здание, а как большая городская зона. Chinatown — это не отдельное заведение, а самостоятельный городской кластер внутри Бангкока.

---

## 5. Grand Palace
- `slug`: `bkk-grand-palace`
- `name`: `Grand Palace`

### Place → District
- `district_slug`: `phra-nakhon`
- `district_name`: `Phra Nakhon`

### Place → Container
- `container_slug`: `grand-palace`
- `container_name`: `Grand Palace`

Пояснение: контейнер нужен, потому что это большой дворцовый комплекс, а не одна точка. Ваш текущий Atlas-объект фактически описывает комплекс целиком.

---

## 6. ICONSIAM
- `slug`: `bkk-iconsiam`
- `name`: `ICONSIAM`

### Place → District
- `district_slug`: `khlong-san`
- `district_name`: `Khlong San`

### Place → Container
- `container_slug`: `iconsiam`
- `container_name`: `ICONSIAM`

Пояснение: контейнер нужен, потому что ICONSIAM — это большой mixed-use и mall-комплекс на берегу реки, а не одиночный объект малого масштаба.

---

## 7. Jay Fai
- `slug`: `bkk-jay-fai`
- `name`: `Jay Fai`

### Place → District
- `district_slug`: `phra-nakhon`
- `district_name`: `Phra Nakhon`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: контейнер не нужен. Это конкретный ресторан в исторической части Бангкока.

---

## 8. Sirocco Sky Bar
- `slug`: `bkk-sirocco-sky-bar`
- `name`: `Sirocco Sky Bar`

### Place → District
- `district_slug`: `bang-rak`
- `district_name`: `Bang Rak`

### Place → Container
- `container_slug`: `state-tower`
- `container_name`: `State Tower`

Пояснение: здесь контейнер нужен. Сам Sirocco — это rooftop-место внутри большого здания, а не самостоятельный городской объект на уровне улицы.

---

## 9. Thipsamai Pad Thai
- `slug`: `bkk-thipsamai-pad-thai`
- `name`: `Thipsamai Pad Thai`

### Place → District
- `district_slug`: `phra-nakhon`
- `district_name`: `Phra Nakhon`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: контейнер не нужен. Это отдельный ресторан, который можно напрямую привязать к району Phra Nakhon.

---

## 10. Vertigo & Moon Bar
- `slug`: `bkk-vertigo-moon-bar`
- `name`: `Vertigo & Moon Bar`

### Place → District
- `district_slug`: `sathon`
- `district_name`: `Sathon`

### Place → Container
- `container_slug`: `banyan-tree-bangkok`
- `container_name`: `Banyan Tree Bangkok`

Пояснение: контейнер нужен. Это rooftop-бар и ресторан внутри отеля Banyan Tree Bangkok, а не самостоятельная отдельная локация на уровне улицы.

---

## 11. Wat Arun
- `slug`: `bkk-wat-arun`
- `name`: `Wat Arun`

### Place → District
- `district_slug`: `bangkok-yai`
- `district_name`: `Bangkok Yai`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: контейнер сейчас не нужен. В текущем Atlas это уже самостоятельное крупное место. Теоретически это храмовый комплекс, но для нынешней структуры отдельный container layer пока не обязателен.

---

## 12. Wat Pho
- `slug`: `bkk-wat-pho`
- `name`: `Wat Pho`

### Place → District
- `district_slug`: `phra-nakhon`
- `district_name`: `Phra Nakhon`

### Place → Container
- `container_slug`:
- `container_name`:

Пояснение: контейнер сейчас тоже не нужен. Это уже самостоятельный крупный храмовый объект, и в текущем Atlas его можно оставить просто как place с правильным районом.

---

# Summary

## District links
- `bkk-asiatique-the-riverfront` → `bang-kho-laem`
- `bkk-blue-elephant-bangkok` → `sathon`
- `bkk-chatuchak-weekend-market` → `chatuchak`
- `bkk-chinatown` → `samphanthawong`
- `bkk-grand-palace` → `phra-nakhon`
- `bkk-iconsiam` → `khlong-san`
- `bkk-jay-fai` → `phra-nakhon`
- `bkk-sirocco-sky-bar` → `bang-rak`
- `bkk-thipsamai-pad-thai` → `phra-nakhon`
- `bkk-vertigo-moon-bar` → `sathon`
- `bkk-wat-arun` → `bangkok-yai`
- `bkk-wat-pho` → `phra-nakhon`

## Container links
- `bkk-asiatique-the-riverfront` → `asiatique-the-riverfront`
- `bkk-chatuchak-weekend-market` → `chatuchak-weekend-market`
- `bkk-chinatown` → `chinatown-bangkok`
- `bkk-grand-palace` → `grand-palace`
- `bkk-iconsiam` → `iconsiam`
- `bkk-sirocco-sky-bar` → `state-tower`
- `bkk-vertigo-moon-bar` → `banyan-tree-bangkok`

## Places without container
- `bkk-blue-elephant-bangkok`
- `bkk-jay-fai`
- `bkk-thipsamai-pad-thai`
- `bkk-wat-arun`
- `bkk-wat-pho`