## Milestone 3 OpenAPI Contract Review — Points + Referral

Дата: 2025-12-18  
Reviewer: **API / Contract Reviewer (sub-agent review mode)**  
Scope:
- `docs/openapi/points.yaml`
- `docs/openapi/referral.yaml`

### Summary
Контракты покрывают минимальный M3 scope для Points и Referral и фиксируют критичные правила (идемпотентность с 409 на конфликт payload, trust headers, минимальный набор actions). Спеки проходят Spectral lint без ошибок.

### Contract compliance
#### 1) Points — обязательные требования
- OK: `/internal/points/add`:
  - idempotency via `externalId` (required)
  - конфликт payload при существующем `externalId` → **409**
  - предусмотрены `429` и `500` ответы
- OK: user endpoints:
  - `/v1/points/balance`
  - `/v1/points/transactions` (limit/cursor)
- OK: actions enum содержит M3-min:
  - `registration`, `first_login`, `referral_bonus_referee`, `referral_bonus_referrer`
  - `event_registration` присутствует и явно помечен как optional в M3 (в описании enum).

#### 2) Referral — обязательные требования
- OK: user endpoints:
  - `/v1/referral/code` (lazy-create описан)
  - `/v1/referral/stats` (минимальная сводка)
- OK: internal endpoints:
  - `/internal/referral/generate-code` (idempotent)
  - `/internal/referral/link` (409 при конфликте, 404 при неверном коде)

#### 3) Trust model / Security
- OK (M3): user-facing операции требуют `GatewayAuth` (`X-Gateway-Auth`) + `X-User-ID` header.
- OK: internal операции используют `ServiceAuth` (Bearer JWT).

#### 4) Lint / tooling
- OK: Spectral lint — без ошибок.

### Notes (non-blocking)
- Для реализации важно сохранить семантику `200` ответа для idempotent duplicate (Points add) и не превращать его в 409.
- Для Referral link желательно в реализации различать:
  - 409 “у referee уже есть referrer”
  - 404 “referral code не найден”

### Verdict
**approved**
