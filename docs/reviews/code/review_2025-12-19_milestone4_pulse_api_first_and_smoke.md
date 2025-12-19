# Code Review: Milestone 4 — Pulse API-first + demo seed + smoke (Gate D.2 / E / F)

**Дата:** 2025-12-19  
**Ревьюеры:** Frontend Dev, Backend Dev, QA (light), Security (light)  
**Статус:** **APPROVED_WITH_COMMENTS**

---

## Что сделано
- **DB seed (staging only)**: добавлен идемпотентный сид 3 demo events со стабильными UUID.
- **Content-service**: добавлен `GET /v1/content/events/{id}` (200/404, без auth).
- **PWA Pulse page**: `/pulse/[id]` стал **API-first** (через SDK), fallback на mock только при **404/5xx/network** с заметным баннером `DEMO MODE`.
- **Smoke E2E**: добавлены скрипты для проверки GET event / POST register / points balance+transactions.

---

## Frontend Review
- ✅ По умолчанию используются реальные данные из API.
- ✅ Fallback ограничен только 404/5xx/network; для прочих 4xx mock не показываем.
- ✅ UI показывает заметный `DEMO MODE` баннер при fallback.

## Backend Review
- ✅ `GET /v1/content/events/{id}` минимально-инвазивен, читает из `events`.
- ✅ Seed не трогает production (env guard) и идемпотентен.
- ✅ Gateway: добавлена CORS поддержка (OPTIONS + echo Origin) для браузерного клиента, и `POST /v1/content/events/{id}/register` теперь получает `X-User-ID` из JWT (как points/referral).

## QA (light)
- ✅ Добавлены `scripts/smoke-m4-pulse.ps1` и `scripts/smoke-m4-pulse.sh`.
- ✅ Скрипты проверяют:
  - `GET /v1/content/events/{id}` → 200
  - `POST /v1/content/events/{id}/register` → 201/409
  - `GET /v1/points/balance` и `GET /v1/points/transactions` → наличие `event_registration`

## Security (light)
- ✅ Seed не печатает `DATABASE_URL` / `STAGING_DATABASE_URL`.
- ✅ Токены используются только в `Authorization` header (скрипты/SDK) и не логируются.
- ⚠️ Напоминание: приватные ответы (points) не должны кешироваться на уровне gateway/edge (зона gateway конфигурации).
- ✅ CORS в gateway: `Access-Control-Allow-Origin` эхо-орижина, без credentials; токены не выносятся в query/cookies.

---

## Вердикт
**APPROVED_WITH_COMMENTS** — можно проверять в staging.
