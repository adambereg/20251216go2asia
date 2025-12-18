## Milestone 2 Post‑Implementation Review — Architecture (Reproducible Backend)

Дата: 2025-12-18  
Reviewer: **Architecture Reviewer**  
Scope: Staging backend reproducibility (Cloudflare Workers + CI/CD)

### OK
- **Репродуцируемость**: все 5 staging воркеров имеют исходники в репозитории и деплоятся через CI/CD из source, без reliance на “наследие” Cloudflare Dashboard.
- **Чёткие роли**: `api-gateway` остаётся edge‑шлюзом, downstream сервисы выделены отдельными воркерами (даже если пока skeleton).
- **Health‑контракт**: зафиксирован единый контракт `GET /health` (/version как alias допустим) и это хорошо ложится на операционку/мониторинг.
- **CI policy**: убран silent-skip — отсутствие директории сервиса становится ошибкой, что соответствует цели “reproducible backend”.

### Risk
- **Функциональная деградация downstream**: skeleton‑сервисы сейчас отвечают `404` на все маршруты кроме `/health`/`/version`. Это архитектурно допустимо как промежуточный шаг для инфраструктурной цели, но **может конфликтовать** с ожиданиями текущего staging, если там использовались реальные эндпоинты этих сервисов.
- **Граница ответственности gateway**: при появлении реальной логики auth/content/referral/token нужно не “растворять” логику в gateway (соблюдать boundary rules), иначе Milestone 3 усложнится рефакторингом.
- **Env/Version как vars**: текущая стратегия `wrangler deploy --var ENVIRONMENT/VERSION` корректна, но важно следить, чтобы она не начала конкурировать с “ручными” vars в Cloudflare (использовать `--keep-vars` осознанно, если потребуется).

### Recommendation
- Зафиксировать в OpenAPI (OpenAPI-first) **минимальные реальные маршруты** auth/content/referral/token перед реализацией, чтобы gateway routing был контрактно-управляемым.
- На период перехода от skeleton к real services добавить в Milestone 3 (или позже) e2e‑smoke через gateway на 1–2 ключевых маршрута, чтобы ловить регрессии routing (без усложнения текущего CI).
- Не расширять health payload: оставить минимальным, публичным, без утечек конфигурации/секретов.

### Verdict
**approved_with_comments**


