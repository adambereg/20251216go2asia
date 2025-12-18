## Milestone 3 Code Review — Points Service

Дата: 2025-12-18  
Reviewer: **Code Reviewer (Backend + QA + Security) — sub-agent review mode**  
Scope:
- `apps/points-service/**`
- `packages/db/src/schema/points.ts`
- `packages/db/src/index.ts`

### Summary
Реализован `points-service` строго по контракту `docs/openapi/points.yaml`: health/version, user-facing read endpoints (через gateway-origin auth), internal add endpoint с идемпотентностью (`externalId`) и конфигурируемым velocity-cap. Добавлен новый воркер-пакет `apps/points-service` и усилена DB-норма: `external_id` теперь `NOT NULL`.

### [BACKEND]
- OK: endpoints соответствуют `points.yaml`:
  - `GET /health`, `GET /version`
  - `GET /v1/points/balance`
  - `GET /v1/points/transactions` (limit/cursor)
  - `POST /internal/points/add`
- OK: идемпотентность:
  - при существующем `externalId` и отличающемся payload → **409 Conflict** + логирование integration error.
  - duplicate same payload → 200, `applied: false`.
- OK: баланс обновляется атомарно (CTE insert+upsert).
- Note: per-action limit реализован только для `registration`/`first_login` (как one-time), что согласуется с «минимальным без усложнения правил».

### [QA]
- OK: tsc/lint проходят (`pnpm --dir apps/points-service build` и `lint`).
- Risk: отсутствуют unit/contract тесты на:
  - idempotency conflict (409)
  - velocity-cap (429)
  - pagination cursor semantics
  Это допустимо для M3-минимума, но желательно добавить позже (post-M3 или в рамках QA инициатив).

### [SECURITY]
- OK: `/health`/`/version` без auth.
- OK: user-facing endpoints требуют `X-Gateway-Auth` и `X-User-ID`.
- OK: internal endpoint требует `Authorization: Bearer ...`.
- Comment: HS256 JWT верификация минимальная (проверяется подпись и `exp`, но не проверяются `iss/aud/sub`). Для M3 допустимо при условии, что **SERVICE_JWT_SECRET** управляется как секрет и не утечёт; расширение claim-проверок можно рассмотреть post-M3.

### Ops / reproducible backend
- OK: воркер имеет `wrangler.toml` со staging/prod именами.
- Comment: требуется обновить `docs/ops/*source_of_truth*.md` при вводе обязательных vars/secrets (`DATABASE_URL`, `SERVICE_JWT_SECRET`, `POINTS_VELOCITY_*`) — это лучше сделать перед деплоем на staging.

### Verdict
**approved_with_comments**
