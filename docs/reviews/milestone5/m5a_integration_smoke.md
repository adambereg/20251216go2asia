# Milestone 5A — Integration Smoke (staging)

**Дата:** 2025-12-25  
**Gateway (staging):** `https://go2asia-api-gateway-staging.fred89059599296.workers.dev`  
**UI (staging):** `https://20251216go2asia02.netlify.app`  

## Итоговый статус (на текущий момент)

- **DONE WITH ISSUES**: A/B/C и E2/E3 подтверждены вручную (оператор), D/F1–F2 подтверждены автоматически (HTTP evidence). F5 (500) — не удалось воспроизвести без изменения окружения (см. `m5a_issues.md`).

## Evidence: быстрые HTTP-проверки (без токена)

### E0 Cold start / базовая доступность

- **Gateway /health → 200**
  - `HTTP/1.1 200 OK`
  - `X-Request-ID: 1766645081499-47p3w89`

- **Gateway → content-service debug → 200**
  - `X-Proxy-Target-Host: go2asia-content-service-staging.fred89059599296.workers.dev`
  - `X-Proxy-Downstream-Status: 200`
  - `X-Request-ID: 1766645083458-b58hb4y`
  - body (фрагмент): `{"ok":true,"counts":{"countries":8,"cities":103,"places":20,"events":10,"articles":16,"media_files":167}}`

### F1/F2: CORS + requestId на early errors

Проверка делалась с:
`Origin: https://20251216go2asia02.netlify.app`

- **CORS preflight (OPTIONS)**
  - `OPTIONS /v1/points/balance` → `HTTP/1.1 204 No Content`
    - `Access-Control-Allow-Origin: https://20251216go2asia02.netlify.app`
    - `Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS`
    - `Access-Control-Allow-Headers: Authorization,Content-Type,X-Request-Id,X-Request-ID,X-Gateway-Auth,X-User-ID`
    - `X-Request-ID: 1766645242308-tssolf5`
  - `OPTIONS /v1/referral/tree?depth=2` → `HTTP/1.1 204 No Content`
    - `Access-Control-Allow-Origin: https://20251216go2asia02.netlify.app`
    - `X-Request-ID: 1766645242613-b9u0lkd`

- **/v1/points/balance → 401**
  - `HTTP/1.1 401 Unauthorized`
  - `Access-Control-Allow-Origin: https://20251216go2asia02.netlify.app`
  - `Access-Control-Expose-Headers: X-Request-ID`
  - `X-Request-ID: 1766645110803-1mky0f4`

- **/v1/referral/code → 401**
  - `HTTP/1.1 401 Unauthorized`
  - `Access-Control-Allow-Origin: https://20251216go2asia02.netlify.app`
  - `Access-Control-Expose-Headers: X-Request-ID`
  - `X-Request-ID: 1766645112801-gqlz890`

- **/v1/users/ensure → 401 (protected)**
  - `HTTP/1.1 401 Unauthorized`
  - `Access-Control-Allow-Origin: https://20251216go2asia02.netlify.app`
  - `Access-Control-Expose-Headers: X-Request-ID`
  - `X-Request-ID: 1766645242882-cu4rea7`

- **/v1/content/does-not-exist → 404 (proxy)**
  - `HTTP/1.1 404 Not Found`
  - `Access-Control-Allow-Origin: https://20251216go2asia02.netlify.app`
  - `Access-Control-Expose-Headers: X-Request-ID`
  - `X-Proxy-Downstream-Status: 404`
  - `X-Request-ID: 1766645115303-z387h6g`

### D: Public content list endpoints (через gateway)

- **Atlas countries list (sample)**
  - `GET /v1/content/countries?limit=3` → 200
  - `X-Proxy-Downstream-Status: 200`
  - `X-Request-ID: 1766645243203-nccf1ea`

- **Pulse events list (sample)**
  - `GET /v1/content/events?limit=3` → 200
  - body (фрагмент): `{"items":[{"id":"evt-010",...}]}`

- **Blog articles list (sample)**
  - `GET /v1/content/articles?limit=2` → 200
  - body (фрагмент): `{"items":[{"slug":"digital-nomads-2026",...}]}`

## A–F статус по плану

### A) Auth & User lifecycle

- **Статус:** OK (manual)
- **Evidence (оператор):** A = OK

### B) Referral flow

- **Статус:** OK (manual)
- **Evidence (оператор):** B = OK

### C) Points

- **Статус:** OK (manual)
- **Evidence (оператор):** C = OK

### D) Content (Atlas/Pulse/Blog)

- **Статус:** OK (public read через gateway подтверждён)
- **Наблюдение:** в sample events `imageUrl=null` (см. отдельный пункт в issues про Media/R2).

### E) Staging operations

- **Статус:** OK
- **E0:** OK (gateway/content-service отвечают 200)
- **E2/E3:** OK (manual)

### F) Error handling

- **Статус:** PARTIAL
- **F1/F2 (401 + CORS + requestId):** OK
- **F5 (500):** BLOCKED (см. `m5a_issues.md`)



