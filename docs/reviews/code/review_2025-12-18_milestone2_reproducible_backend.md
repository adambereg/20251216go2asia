## Milestone 2 Post‑Implementation Review — Code (Reproducible Backend)

Дата: 2025-12-18  
Reviewer: **Code Review sub-agent (Backend + QA + Security)**  
Scope: Cloudflare Workers skeletons, health/version, CI + deploy workflows

### OK
- **Workers skeleton layout**:
  - каждый сервис имеет `wrangler.toml` (staging name фиксирован), `src/index.ts` и минимальные скрипты.
  - совместимо с `pnpm` workspace и turbo.
- **`GET /health` / `GET /version`**:
  - не требует auth/БД;
  - стабильный JSON в одном формате;
  - минимальный payload (не светит секреты).
- **deploy workflow**:
  - больше нет silent-skip: отсутствие `apps/<service>` падает;
  - inject vars (`ENVIRONMENT`, `VERSION`) делается декларативно в CI;
  - smoke-check (HTTP 200) после deploy снижает риск “зелёного” деплоя при нерабочем воркере.
- **CI (OpenAPI)**:
  - `.spectral.yaml` в корне устраняет падение Validate OpenAPI (warnings допустимы).

### Risk
- **Risk: overwriting vars**: `wrangler deploy` по умолчанию может удалять vars, которых нет в конфиге. Сейчас vars задаются через `--var`, поэтому риск минимален, но если staging полагается на vars, выставленные руками в Cloudflare UI, нужно убедиться, что они не “сносятся” деплоем (при необходимости — осознанно использовать `--keep-vars`).
- **Functional regression risk**: skeleton‑сервисы отвечают `404` на все роуты, кроме health/version. Если текущий staging использовал реальные эндпоинты этих воркеров, это изменит поведение. Это допустимо как инфраструктурный шаг, но требует явной координации при включении Milestone 2 функционала.

### Recommendation
- Явно зафиксировать (в `docs/ops/milestone2_backend_source_of_truth.md` и/или в README сервисов) какие vars/secret/bindings должны быть “immutable” и какие управляются через Dashboard.
- В следующий шаг добавить минимальный smoke через **API Gateway** (1–2 маршрута), когда downstream начнут реализовывать реальные API (OpenAPI-first).
- Для health/version рекомендую в будущем возвращать `Cache-Control: no-store` (не критично, но снижает риск CDN‑кэширования).

### Verdict
**approved_with_comments**


