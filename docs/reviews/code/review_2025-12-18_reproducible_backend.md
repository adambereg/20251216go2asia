## Code Review — reproducible backend (Milestone 2 prep)

Дата: 2025-12-18  
Scope: staging deploy reproducibility for Cloudflare Workers (staging)

### Summary
- Добавлены исходники для отсутствовавших сервисов: `auth-service`, `content-service`, `referral-service`, `token-service` (skeleton Workers).
- Унифицирован `GET /health` (и alias `GET /version`) для новых сервисов и обновлён ответ `api-gateway /health` под единый контракт.
- Workflow staging deploy больше не “silent-skip” отсутствующие папки и прокидывает `ENVIRONMENT`/`VERSION` через `wrangler deploy --var ...`.
- Добавлены source-of-truth документы в `docs/ops/`.

### [BACKEND] Review
- **Плюсы**:
  - `GET /health` не требует auth/БД и стабилен.
  - `VERSION`/`ENVIRONMENT` передаются декларативно через CI и не завязаны на runtime.
  - Убрана “магия” с пропуском деплоя — теперь deploy воспроизводим и детерминирован.
- **Риски**:
  - Skeleton сервисы пока возвращают `404` на все маршруты кроме `/health`/`/version`. Это может “сломать” функциональность, если текущий staging relied на legacy-логику внутри этих воркеров.
- **Рекомендация**:
  - Перед включением Milestone 2 функционала закрепить контракты реальных роутов в OpenAPI и постепенно заменять skeleton-логики на реализацию, сохраняя `/health` неизменным.

### [QA] Review
- Smoke-check в GitHub Actions проверяет `HTTP 200` после деплоя → снижает риск “зелёного деплоя” при нерабочем воркере.
- Рекомендация: в Milestone 2 добавить минимум один e2e-сценарий через gateway (например `/v1/auth/*` → downstream) как часть CI (отдельный job), когда появится реальная логика сервисов.

### [SECURITY] Review
- `GET /health` не раскрывает секретов; отдаёт только `service/env/status/version`.
- Рекомендация: не добавлять в health payload детали ошибок/конфигураций; сохранять минимализм для публичного endpoint.

### Verdict
**approved_with_comments**



