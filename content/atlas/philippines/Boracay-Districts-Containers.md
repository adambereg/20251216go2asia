# Boracay Districts and Containers

Этот файл фиксирует новые сущности для Boracay pilot в Atlas Asia:

- `city_districts`
- `place_containers`

Логика иерархии:
**country → city → district → container (optional) → place**

Город:
- `country_slug`: `philippines`
- `city_slug`: `boracay`

> Важно: это curated operational set для существующих Atlas places, а не полный административный список районов Боракая.

---

# 1. City Districts

## 1.1 `white-beach-station-1-2`
- `slug`: `white-beach-station-1-2`
- `name`: `White Beach / Station 1–2`
- `name_local`: `Balabag / White Beach`
- `city_slug`: `boracay`
- `country_slug`: `philippines`

Краткое описание: главный beachfront-контур Боракая вдоль White Beach, особенно в зоне Station 1 и Station 2. Это ядро классического resort experience острова: белый песок, beachfront cafés, фруктовые шейки, casual dining и самые узнаваемые postcard-виды.

Подходит для:
- пляжного отдыха и sunset walks;
- beachfront cafés и casual dining;
- первого знакомства с классическим Boracay beach life.

Текущие Atlas places в этом районе:
- `boracay-white-beach`
- `boracay-jonah-s-fruit-shake`
- `boracay-jonahs-fruit-shake`
- `boracay-real-coffee-tea-caf`
- `boracay-real-coffee-tea-cafe`

---

## 1.2 `yapak-north-boracay`
- `slug`: `yapak-north-boracay`
- `name`: `Yapak / North Boracay`
- `name_local`: `Yapak`
- `city_slug`: `boracay`
- `country_slug`: `philippines`

Краткое описание: северный и более спокойный контур острова вокруг Yapak, Puka Beach и менее застроенных участков побережья. Это зона для тех, кто ищет quieter Boracay, panoramic stops и более природный coastal feel вдали от самой плотной полосы White Beach.

Подходит для:
- quieter beaches и северного побережья;
- scenic coastal stops;
- более спокойного island experience вне main resort strip.

Текущие Atlas places в этом районе:
- `boracay-puka-shell-beach`

---

## 1.3 `bulabog-mount-luho`
- `slug`: `bulabog-mount-luho`
- `name`: `Bulabog / Mount Luho`
- `name_local`: `Bulabog / Mount Luho`
- `city_slug`: `boracay`
- `country_slug`: `philippines`

Краткое описание: центрально-северо-восточный elevated contour Боракая вокруг Mount Luho и оси между White Beach и Bulabog side. Это operational district для viewpoints и island-overlook experience, а не для beachfront resort stay.

Подходит для:
- панорамных точек и обзорных остановок;
- island-overlook experience;
- коротких scenic detours от beach core.

Текущие Atlas places в этом районе:
- `boracay-mount-luho-viewpoint`

---

## 1.4 `ariels-point-excursion-zone`
- `slug`: `ariels-point-excursion-zone`
- `name`: `Ariel's Point Excursion Zone`
- `name_local`: `Buruanga`
- `city_slug`: `boracay`
- `country_slug`: `philippines`

Краткое описание: внешняя marine-and-cliff excursion-zone у Buruanga на материке Панай, куда едут из Боракая ради cliff jumping, kayaking и day-trip adventure. Это не район самого острова Боракай, а отдельный operational excursion cluster для текущего Atlas набора.

Подходит для:
- cliff jumping и adventure day trips;
- boat excursions вне островного ядра;
- активного marine experience рядом с Боракаем.

Текущие Atlas places в этом районе:
- `boracay-ariel-s-point`
- `boracay-ariels-point`

---

# 2. Place Containers

## 2.1 `white-beach-boracay`
- `slug`: `white-beach-boracay`
- `name`: `White Beach Boracay`
- `type`: `urban-beachfront`
- `city_slug`: `boracay`
- `district_slug`: `white-beach-station-1-2`

Краткое описание: главный beachfront-кластер острова вдоль White Beach, воспринимаемый как самостоятельная destination-zone, а не одна точка.

Places inside:
- `boracay-white-beach`
