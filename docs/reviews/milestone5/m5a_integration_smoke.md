# Milestone 5A — Integration Smoke (staging)

**Дата:** 2025-12-25  
**Gateway (staging):** `https://go2asia-api-gateway-staging.fred89059599296.workers.dev`  
**UI (staging):** `https://20251216go2asia02.netlify.app`  

## Итоговый статус (на текущий момент)

- **DONE WITH ISSUES (частично выполнено)**: автоматом подтверждены публичные content endpoints + gateway proxy + CORS/RequestId на 401/404. Полные потоки A/B/C требуют ручного прогона с реальным Clerk-токеном (и фиксации DB evidence). F5 (500) — не удалось воспроизвести без изменения окружения (см. `m5a_issues.md`).

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

- **Статус:** NEEDS MANUAL
- **Что проверить вручную:**
  - signup/login в UI (staging) → в Network увидеть `POST /v1/users/ensure` → 200
  - в Neon: `users` содержит запись для нового `clerk_id`

### B) Referral flow

- **Статус:** NEEDS MANUAL
- **Что проверить вручную:**
  - открыть `.../sign-up?ref=<CODE>` → завершить регистрацию → убедиться, что после auth сработал `POST /v1/referral/claim`
  - referrer видит pending в `/connect/referrals`
  - у referee после sign-in/sign-out → sign-in: активируется `first_login_at`, начисляется бонус referrer
  - DB evidence: `referral_relations`, `points_transactions` (`action = referral_bonus_referrer`)

### C) Points

- **Статус:** PARTIAL (auth-gating + CORS OK; требуется ручной прогон)
- **Что проверить вручную:**
  - `/connect` и `/connect/wallet` показывают баланс/транзакции без DEMO MODE
  - подтверждение в Neon: баланс/транзакции консистентны

### D) Content (Atlas/Pulse/Blog)

- **Статус:** OK (public read через gateway подтверждён)
- **Наблюдение:** в sample events `imageUrl=null` (см. отдельный пункт в issues про Media/R2).

### E) Staging operations

- **Статус:** PARTIAL
- **E0:** OK (gateway/content-service отвечают 200)
- **E2/E3:** NEEDS MANUAL (GitHub Actions seed workflow + идемпотентность)

### F) Error handling

- **Статус:** PARTIAL
- **F1/F2 (401 + CORS + requestId):** OK
- **F5 (500):** BLOCKED (см. `m5a_issues.md`)

