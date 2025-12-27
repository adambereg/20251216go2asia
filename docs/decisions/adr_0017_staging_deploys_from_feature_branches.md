# ADR-0017: Staging deployments are allowed from feature branches

**Статус:** Accepted / Implemented  
**Дата:** 2025-12-24  

## Контекст

По первоначальному плану staging деплой предполагался только при merge в `main`.

В ходе интеграции (особенно при AI-assisted разработке) потребовалась быстрая проверка изменений в Cloudflare Workers на реальном staging без ожидания merge.

## Решение

- **Staging** разрешает деплой из feature-веток через GitHub Actions.
- **Production** деплой остаётся только из `main`.
- Staging трактуется как:
  - integration sandbox
  - E2E testing environment
  - non-prod данные допустимы (seed/test users/dev-only инструменты)

## Последствия

**Плюсы**
- Ускоряет интеграционные проверки (workers/gateway/Neon/Clerk).
- Снижает риск “влить в main и только потом узнать, что не работает”.

**Минусы**
- Staging может быть “шумным”: тестовые данные и промежуточные версии.
- Требуется дисциплина: явное разделение “staging ≠ production”.

## Реализация

- Workflow: `.github/workflows/deploy-workers-staging.yml`
  - триггер: `push` на любые ветки + `workflow_dispatch`
  - production workflow (если есть) остаётся ограниченным `main`



