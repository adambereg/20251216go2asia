# Samui Districts and Containers

Этот файл фиксирует новые сущности для Samui pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `thailand`
- `city_slug`: `usm`

> Важно: это curated operational set для существующих Atlas places Самуи, а не полный административный список районов острова.

---

# 1. City Districts

## 1.1 `bophut-fishermans-village`
- `slug`: `bophut-fishermans-village`
- `name`: `Bophut / Fisherman’s Village`
- `name_local`: `บ่อผุด`
- `city_slug`: `usm`
- `country_slug`: `thailand`

Краткое описание: северное coastal-ядро Самуи с историческим Fisherman’s Village, beach dining, барами и более атмосферной village/resort средой. Это один из самых узнаваемых lifestyle-кластеров острова для вечерних прогулок, ужинов у моря и мягкого курортного ритма.

Подходит для:
- beach dining и sunset-атмосферы;
- вечерних прогулок и night market среды;
- более стильного и спокойного coastal experience.

Текущие Atlas places в этом районе:
- `usm-coco-tam-s`
- `usm-fisherman-s-village`

---

## 1.2 `choeng-mon-big-buddha`
- `slug`: `choeng-mon-big-buddha`
- `name`: `Choeng Mon / Big Buddha`
- `name_local`: `เชิงมน / พระใหญ่`
- `city_slug`: `usm`
- `country_slug`: `thailand`

Краткое описание: северо-восточный scenic и temple-oriented кластер Самуи, где находятся Big Buddha Temple, прибрежные обзорные точки и upscale resorts северо-восточного мыса. Это район для храмовых локаций, видов на море и более приватного resort experience.

Подходит для:
- храмов и знаковых landmark-объектов;
- смотровых точек и северо-восточного побережья;
- более приватного resort-отдыха у моря.

Текущие Atlas places в этом районе:
- `usm-big-buddha-temple`
- `usm-dining-on-the-rocks`

---

## 1.3 `chaweng`
- `slug`: `chaweng`
- `name`: `Chaweng`
- `name_local`: `เฉวง`
- `city_slug`: `usm`
- `country_slug`: `thailand`

Краткое описание: главное beach-and-nightlife ядро Самуи с длинной полосой пляжа, активной туристической средой, торговлей, ресторанами и отелями. Это самый узнаваемый курортный район острова для первого знакомства с Samui beach life.

Подходит для:
- пляжного отдыха и resort-инфраструктуры;
- активной туристической среды;
- первого знакомства с Самуи.

Текущие Atlas places в этом районе:
- `usm-chaweng-beach`

---

## 1.4 `lamai`
- `slug`: `lamai`
- `name`: `Lamai`
- `name_local`: `ละไม`
- `city_slug`: `usm`
- `country_slug`: `thailand`

Краткое описание: юго-восточный пляжный район Самуи с более расслабленным ритмом, чем Chaweng, но с полноценной resort-жизнью, кафе, барами и длинной береговой линией. Это классический район для тех, кто хочет beach stay с более спокойной атмосферой.

Подходит для:
- более спокойного beach stay;
- длительных остановок у моря;
- сочетания пляжа и удобной resort-среды.

Текущие Atlas places в этом районе:
- `usm-lamai-beach`

---

## 1.5 `na-muang-interior`
- `slug`: `na-muang-interior`
- `name`: `Na Muang Interior`
- `name_local`: `หน้าเมือง`
- `city_slug`: `usm`
- `country_slug`: `thailand`

Краткое описание: зелёная внутренняя зона юга Самуи, связанная с водопадами, холмами, jungle roads и природными выездами с побережья в глубь острова. Это не beach district, а природный inland-кластер для short excursions и scenic island driving.

Подходит для:
- водопадов и природных выездов;
- inland scenery и jungle roads;
- коротких экскурсий из beach-зон.

Текущие Atlas places в этом районе:
- `usm-na-muang-waterfalls`

---

## 1.6 `ang-thong-excursion-zone`
- `slug`: `ang-thong-excursion-zone`
- `name`: `Ang Thong Excursion Zone`
- `name_local`: `อ่างทอง`
- `city_slug`: `usm`
- `country_slug`: `thailand`

Краткое описание: внешняя marine excursion-zone к северо-западу от Самуи, связанная с архипелагом Mu Ko Ang Thong, лодочными выездами, смотровыми площадками, лагунами и морскими day trips. Это не городской район острова, а важный внешний island-hopping кластер для Atlas Samui.

Подходит для:
- морских day trips;
- kayaking, snorkeling и boating;
- postcard-пейзажей и архипелага за пределами Самуи.

Текущие Atlas places в этом районе:
- `usm-ang-thong-national-marine-park`

---

# 2. Place Containers

## 2.1 `fishermans-village`
- `slug`: `fishermans-village`
- `name`: `Fisherman’s Village`
- `type`: `beach-village-cluster`
- `city_slug`: `usm`
- `district_slug`: `bophut-fishermans-village`

Краткое описание: исторический beachfront-кластер в Bophut с walking street, ресторанами, барами и night-market атмосферой.

Places inside:
- `usm-fisherman-s-village`

---

## 2.2 `chaweng-beach`
- `slug`: `chaweng-beach`
- `name`: `Chaweng Beach`
- `type`: `urban-beachfront`
- `city_slug`: `usm`
- `district_slug`: `chaweng`

Краткое описание: главный beachfront-кластер Самуи с длинной полосой пляжа и самой насыщенной resort-инфраструктурой острова.

Places inside:
- `usm-chaweng-beach`

---

## 2.3 `lamai-beach`
- `slug`: `lamai-beach`
- `name`: `Lamai Beach`
- `type`: `urban-beachfront`
- `city_slug`: `usm`
- `district_slug`: `lamai`

Краткое описание: длинный beach-cluster юго-востока Самуи с более спокойным курортным ритмом, чем Chaweng.

Places inside:
- `usm-lamai-beach`