# Bangkok Districts and Containers

Этот файл фиксирует новые сущности для Bangkok pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `bangkok`

---

# 1. City Districts

## 1.1 `bang-kho-laem`
- `slug`: `bang-kho-laem`
- `name`: `Bang Kho Laem`
- `name_local`: `บางคอแหลม`
- `city_slug`: `bangkok`
- `country_slug`: `thailand`

Краткое описание: район на берегу реки Chao Phraya, где старый речной Бангкок встречается с туристическими набережными и современными развлекательными пространствами. Здесь удобно гулять вечером, смотреть на реку и посещать крупные riverfront-комплексы.

Подходит для:
- вечерних прогулок;
- riverfront-атмосферы;
- развлечений у воды.

Текущие Atlas places в этом районе:
- `bkk-asiatique-the-riverfront`

---

## 1.2 `sathon`
- `slug`: `sathon`
- `name`: `Sathon`
- `name_local`: `สาทร`
- `city_slug`: `bangkok`
- `country_slug`: `thailand`

Краткое описание: один из самых деловых и современных районов центрального Бангкока. Здесь много офисных зданий, хороших ресторанов, rooftop-баров и отелей высокого класса. Район удобен для деловых поездок, ужинов и вечернего отдыха.

Подходит для:
- rooftop-баров;
- деловых встреч;
- ресторанов и современной городской атмосферы.

Текущие Atlas places в этом районе:
- `bkk-blue-elephant-bangkok`
- `bkk-vertigo-moon-bar`

---

## 1.3 `chatuchak`
- `slug`: `chatuchak`
- `name`: `Chatuchak`
- `name_local`: `จตุจักร`
- `city_slug`: `bangkok`
- `country_slug`: `thailand`

Краткое описание: район, известный прежде всего огромным рынком Chatuchak Weekend Market. Это одна из самых активных shopping-зон Бангкока, где можно провести много часов, исследуя секции рынка, еду, сувениры и местные товары.

Подходит для:
- рынков;
- шопинга;
- долгих прогулок по крупным торговым пространствам.

Текущие Atlas places в этом районе:
- `bkk-chatuchak-weekend-market`

---

## 1.4 `samphanthawong`
- `slug`: `samphanthawong`
- `name`: `Samphanthawong`
- `name_local`: `สัมพันธวงศ์`
- `city_slug`: `bangkok`
- `country_slug`: `thailand`

Краткое описание: исторический китайский район Бангкока, связанный с Yaowarat и уличной едой. Это плотная, шумная и очень атмосферная часть города с сильным локальным характером, рынками, храмами и старой торговой средой.

Подходит для:
- street food;
- Chinatown-атмосферы;
- прогулок по историческим кварталам.

Текущие Atlas places в этом районе:
- `bkk-chinatown`

---

## 1.5 `phra-nakhon`
- `slug`: `phra-nakhon`
- `name`: `Phra Nakhon`
- `name_local`: `พระนคร`
- `city_slug`: `bangkok`
- `country_slug`: `thailand`

Краткое описание: историческое ядро Бангкока, где сосредоточены важнейшие храмы, дворцовые комплексы и классические городские достопримечательности. Это один из лучших районов для первого знакомства с историей и культурой столицы.

Подходит для:
- храмов и дворцов;
- исторических прогулок;
- классического туристического маршрута по Бангкоку.

Текущие Atlas places в этом районе:
- `bkk-grand-palace`
- `bkk-jay-fai`
- `bkk-thipsamai-pad-thai`
- `bkk-wat-pho`

---

## 1.6 `khlong-san`
- `slug`: `khlong-san`
- `name`: `Khlong San`
- `name_local`: `คลองสาน`
- `city_slug`: `bangkok`
- `country_slug`: `thailand`

Краткое описание: район на западном берегу Chao Phraya, который сочетает riverfront-локации, современные комплексы и хороший доступ к центральной части города. Район стал особенно заметным благодаря крупным mixed-use проектам у реки.

Подходит для:
- riverfront-локаций;
- современных торговых комплексов;
- прогулок у воды.

Текущие Atlas places в этом районе:
- `bkk-iconsiam`

---

## 1.7 `bang-rak`
- `slug`: `bang-rak`
- `name`: `Bang Rak`
- `name_local`: `บางรัก`
- `city_slug`: `bangkok`
- `country_slug`: `thailand`

Краткое описание: центральный район Бангкока с деловой, гастрономической и nightlife-атмосферой. Здесь сочетаются высотные здания, известные rooftop-локации, отели и активная городская жизнь рядом с Silom и рекой.

Подходит для:
- rooftop-баров;
- городской вечерней жизни;
- ресторанов и видов на город.

Текущие Atlas places в этом районе:
- `bkk-sirocco-sky-bar`

---

## 1.8 `bangkok-yai`
- `slug`: `bangkok-yai`
- `name`: `Bangkok Yai`
- `name_local`: `บางกอกใหญ่`
- `city_slug`: `bangkok`
- `country_slug`: `thailand`

Краткое описание: старый район на стороне Thonburi, известный прежде всего храмом Wat Arun и близостью к историческому центру через реку. Здесь меньше деловой суеты и больше ощущение традиционного Бангкока.

Подходит для:
- храмов;
- спокойных исторических прогулок;
- видов на реку и старый город.

Текущие Atlas places в этом районе:
- `bkk-wat-arun`

---

# 2. Place Containers

## 2.1 `asiatique-the-riverfront`
- `slug`: `asiatique-the-riverfront`
- `name`: `Asiatique The Riverfront`
- `type`: `riverfront-complex`
- `city_slug`: `bangkok`
- `district_slug`: `bang-kho-laem`

Краткое описание: крупный riverfront-комплекс с ресторанами, магазинами, прогулочной набережной и вечерними развлечениями.

Places inside:
- `bkk-asiatique-the-riverfront`

---

## 2.2 `chatuchak-weekend-market`
- `slug`: `chatuchak-weekend-market`
- `name`: `Chatuchak Weekend Market`
- `type`: `market-complex`
- `city_slug`: `bangkok`
- `district_slug`: `chatuchak`

Краткое описание: огромный рынок, состоящий из множества торговых секций, проходов, лавок и food-зон.

Places inside:
- `bkk-chatuchak-weekend-market`

---

## 2.3 `chinatown-bangkok`
- `slug`: `chinatown-bangkok`
- `name`: `Chinatown Bangkok`
- `type`: `urban-area-cluster`
- `city_slug`: `bangkok`
- `district_slug`: `samphanthawong`

Краткое описание: большая городская зона вокруг Yaowarat, воспринимаемая как отдельный городской кластер внутри Бангкока.

Places inside:
- `bkk-chinatown`

---

## 2.4 `grand-palace`
- `slug`: `grand-palace`
- `name`: `Grand Palace`
- `type`: `palace-complex`
- `city_slug`: `bangkok`
- `district_slug`: `phra-nakhon`

Краткое описание: крупный дворцовый исторический комплекс, включающий несколько значимых пространств и объектов.

Places inside:
- `bkk-grand-palace`

---

## 2.5 `iconsiam`
- `slug`: `iconsiam`
- `name`: `ICONSIAM`
- `type`: `mixed-use-complex`
- `city_slug`: `bangkok`
- `district_slug`: `khlong-san`

Краткое описание: большой современный riverfront-комплекс, объединяющий торговлю, еду, развлечения и событийные пространства.

Places inside:
- `bkk-iconsiam`

---

## 2.6 `state-tower`
- `slug`: `state-tower`
- `name`: `State Tower`
- `type`: `tower`
- `city_slug`: `bangkok`
- `district_slug`: `bang-rak`

Краткое описание: высотное здание, внутри которого расположены известные rooftop- и hospitality-локации.

Places inside:
- `bkk-sirocco-sky-bar`

---

## 2.7 `banyan-tree-bangkok`
- `slug`: `banyan-tree-bangkok`
- `name`: `Banyan Tree Bangkok`
- `type`: `hotel`
- `city_slug`: `bangkok`
- `district_slug`: `sathon`

Краткое описание: крупный гостиничный объект, внутри которого расположен rooftop-бар и ресторан Vertigo & Moon Bar.

Places inside:
- `bkk-vertigo-moon-bar`