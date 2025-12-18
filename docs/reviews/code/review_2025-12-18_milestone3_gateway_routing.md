## Milestone 3 Code Review — API Gateway routing (Points + Referral)

Дата: 2025-12-18  
Reviewer: **Code Reviewer (Backend + QA + Security) — sub-agent review mode**  
Scope:
- `apps/api-gateway/src/index.ts`

### Summary
Gateway обновлён для Milestone 3 trust model: при проксировании в downstream добавляет `X-Gateway-Auth` (service JWT) и, для user-facing `/v1/points/*` и `/v1/referral/*`, выставляет `X-User-ID` на основе user JWT `sub`. Это позволяет downstream сервисам строго доверять user-context только при подтверждённом gateway-origin.

### [BACKEND]
- OK: routing `/v1/points/*` → `POINTS_SERVICE_URL` и `/v1/referral/*` → `REFERRAL_SERVICE_URL` уже был; теперь добавлена обязательная прокси-политика M3.
- OK: gateway пробрасывает `X-Request-Id` в downstream.

### [QA]
- OK: tsc/lint проходят (`pnpm --dir apps/api-gateway build` и `lint`).
- Risk: нет e2e smoke/contract тестов на проксирование points/referral (можно добавить позже, отдельным шагом).

### [SECURITY]
- OK: `X-Gateway-Auth` подписывается HS256 по `SERVICE_JWT_SECRET` с коротким TTL (~60s).
- OK: `X-User-ID` перезаписывается на стороне gateway (защита от spoofing).
- Comment: user JWT верифицируется только если задан `CLERK_JWT_SECRET` (HS256). Если секрет не задан, включается fallback без верификации с warning-логом — допустимо как временная мера M3, но требует обязательной конфигурации секрета на staging/prod.

### Verdict
**approved_with_comments**
