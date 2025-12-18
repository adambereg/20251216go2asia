## Milestone 3 Code Review — Referral Service

Дата: 2025-12-18  
Reviewer: **Code Reviewer (Backend + QA + Security) — sub-agent review mode**  
Scope:
- `apps/referral-service/**`
- `packages/db/src/schema/referral.ts` (используется как SSOT)

### Summary
`referral-service` реализован по контракту `docs/openapi/referral.yaml`: health/version, user-facing endpoints (gateway-origin auth), internal endpoints (service JWT). В M3 соблюдён failure mode: referral code создаётся лениво при первом `GET /v1/referral/code`.

### [BACKEND]
- OK: endpoints соответствуют `referral.yaml`:
  - `GET /health`, `GET /version`
  - `GET /v1/referral/code` (lazy-create)
  - `GET /v1/referral/stats`
  - `POST /internal/referral/generate-code` (idempotent)
  - `POST /internal/referral/link` (404/409)
- OK: инвариант “referee имеет максимум одного referrer” обеспечен проверкой перед вставкой.
- Note: в `link` при повторном вызове с тем же referrer возвращается `linked: false` (idempotent semantics) — совместимо с контрактом.

### [QA]
- OK: tsc/lint проходят (`pnpm --dir apps/referral-service build` и `lint`).
- Risk: нет тестов на:
  - collision/referral_code retry
  - 409 conflict cases
  - idempotent повторные вызовы `link`

### [SECURITY]
- OK: user-facing endpoints требуют `X-Gateway-Auth` и `X-User-ID`.
- OK: internal endpoints требуют `Authorization: Bearer ...`.
- OK: генерация referral code использует `crypto.getRandomValues`.
- Comment: HS256 JWT верификация минимальная (подпись + `exp`, без `iss/aud`) — как и в points-service; допустимо для M3 при корректном управлении `SERVICE_JWT_SECRET`.

### Ops / reproducible backend
- Comment: перед деплоем на staging нужно зафиксировать обязательные vars/secrets (`DATABASE_URL`, `SERVICE_JWT_SECRET`) в `docs/ops/*source_of_truth*.md`.

### Verdict
**approved_with_comments**
