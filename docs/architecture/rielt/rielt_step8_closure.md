# Rielt Step 8 — Closure Summary

**Project:** Go2Asia  
**Completed:** Step 8, Slices 1–8

---

## 1. Что реализовано

### Backend (rielt-service)
- **Listings:** CRUD для владельца (create, list my, patch, archive)
- **Public read:** Список опубликованных (filters, pagination, nearby)
- **Детали:** GET по id или slug
- **Inquiries:** Доменная модель и контракт зафиксированы; HTTP wiring в текущем runtime отложен
- **Модель:** rielt_listing, rielt_listing_media, rielt_listing_actor_link, rielt_listing_inquiry
- **Роли:** owner, agent (через listing_actor_link)

### Gateway
- Маршрутизация /v1/rielt/* при RIELT_SERVICE_URL
- 501, когда сервис не настроен
- Bearer для protected-эндпоинтов

### Frontend (PWA)
- Поиск: список из API (filters из URL)
- Детали: страница объявления по id/slug
- Главная: EditorPicks, NewListings — данные из API
- Состояния: loading, empty, error

### SDK
- @go2asia/sdk/rielt: useListListings, useGetListing, fetchListing, fetchListings

---

## 2. Что НЕ реализовано

| Область | Статус |
|---------|--------|
| Booking | — |
| Payments | — |
| Chat / messaging | — |
| CRM / pipeline | — |
| RF / partner | — |
| Социальная собственность | — |
| Media URL resolution | Public DTO возвращает coverUrl: null, photos: [] |
| Owner/agent просмотр inquiries | Только requester в /my/inquiries |
| Nearby UI | Backend есть, frontend deferred |
| Geo validation против Atlas | Step 8 не проверяет |
| Reviews / favourites | — |

---

## 3. Endpoints — что реально работает

### Public (без auth)
| Method | Path | Описание |
|--------|------|----------|
| GET | /v1/rielt/listings | Список published, filters, pagination |
| GET | /v1/rielt/listings/nearby | По lat/lng + radius_km |
| GET | /v1/rielt/listings/{idOrSlug} | Детали объявления |

### Owner (Bearer)
| Method | Path |
|--------|------|
| POST | /v1/rielt/listings |
| GET | /v1/rielt/my/listings |
| PATCH | /v1/rielt/listings/{id} |
| DELETE | /v1/rielt/listings/{idOrSlug} |

### Inquiry (Bearer, deferred runtime wiring)
| Method | Path |
|--------|------|
| POST | /v1/rielt/listings/{idOrSlug}/inquiries | (контракт определён, runtime wiring deferred) |
| GET | /v1/rielt/my/inquiries | (контракт определён, runtime wiring deferred) |

---

## 4. End-to-end сценарии (готовые)

1. **Просмотр объявлений**
   - Главная → поиск (filters) → список → детали по id/slug

2. **Создание объявления**
   - Auth → POST /v1/rielt/listings → листинг в draft/published

3. **Управление своими объявлениями**
   - Auth → GET /v1/rielt/my/listings → PATCH / DELETE по id

4. **Inquiry от пользователя (target contract)**
   - Контракт и БД-модель определены; runtime HTTP wiring для сценария отложен

5. **Поиск по geo**
   - GET /v1/rielt/listings?country_id=…&city_id=…&sort=newest

6. **Nearby (backend)**
   - GET /v1/rielt/listings/nearby?lat=…&lng=…&radius_km=…

---

*Подробная архитектура: `rielt_service_v1_completion.md`*
