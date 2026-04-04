# Phnom Penh Districts and Containers

Этот файл фиксирует новые сущности для Phnom Penh pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `cambodia`
- `city_slug`: `pnh`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Пномпеня.

---

# 1. City Districts

## 1.1 `riverside-daun-penh`
- `slug`: `riverside-daun-penh`
- `name`: `Riverside / Daun Penh`
- `name_local`: `ដូនពេញ`
- `city_slug`: `pnh`
- `country_slug`: `cambodia`

Краткое описание: историческое и туристическое ядро Пномпеня вдоль Sisowath Quay и вокруг старого центра Daun Penh. Здесь сходятся riverfront-прогулки, колониальные здания, кафе, рестораны, важные городские landmark-объекты и классическая «центральная» атмосфера столицы.

Подходит для:
- первого знакомства с Пномпенем;
- прогулок по riverfront и старому центру;
- кафе, ресторанов и исторических городских точек.

Текущие Atlas places в этом районе:
- `pnh-brown-coffee`
- `pnh-fcc-phnom-penh`
- `pnh-romdeng-restaurant`
- `pnh-wat-phnom`

---

## 1.2 `norodom-independence-bassac`
- `slug`: `norodom-independence-bassac`
- `name`: `Norodom / Independence / Bassac`
- `name_local`: `ចំការមន`
- `city_slug`: `pnh`
- `country_slug`: `cambodia`

Краткое описание: центрально-южный городской контур Пномпеня вокруг Norodom Boulevard, Independence Monument и Bassac-side embassy / dining zone. Это более «современный» и утончённый слой столицы с монументами, upscale dining, бульварами и более собранной столичной атмосферой.

Подходит для:
- монументального и представительского центра города;
- fine dining и известных ресторанов;
- прогулок по бульварам и более элегантному urban Phnom Penh.

Текущие Atlas places в этом районе:
- `pnh-independence-monument`
- `pnh-malis-restaurant`
- `pnh-topaz-restaurant`

---

## 1.3 `dangkao-excursion-zone`
- `slug`: `dangkao-excursion-zone`
- `name`: `Dangkao Excursion Zone`
- `name_local`: `ដង្កោ`
- `city_slug`: `pnh`
- `country_slug`: `cambodia`

Краткое описание: внешняя excursion-зона на южной периферии Пномпеня, связанная с Choeung Ek / Cheung Ek memorial landscape. Это не городской центр в обычном смысле, а важная вынесенная историко-мемориальная локация для понимания трагической истории Камбоджи.

Подходит для:
- мемориальных и образовательных поездок;
- более глубокого знакомства с историей Камбоджи;
- вынесенных day-trip маршрутов за пределы центрального ядра.

Текущие Atlas places в этом районе:
- `pnh-cheung-ek-killing-fields`

---

# 2. Place Containers

## 2.1 `sisowath-quay-riverside`
- `slug`: `sisowath-quay-riverside`
- `name`: `Sisowath Quay Riverside`
- `type`: `urban-riverfront-cluster`
- `city_slug`: `pnh`
- `district_slug`: `riverside-daun-penh`

Краткое описание: длинный riverfront-кластер вдоль Sisowath Quay с кафе, ресторанами, колониальными фасадами, отелями и прогулочной туристической жизнью у воды.

Places inside:
- `pnh-fcc-phnom-penh`