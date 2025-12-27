# ADR-0022: Space backend naming and boundaries (Content/Feed/Reactions) for Phase 2

**Статус:** Accepted / Documentation-only  
**Дата:** 2025-12-26  

## Контекст

В `docs/knowledge/backend_microservice.md` Social раздел использует названия:
- `Content Service` (Space UGC),
- `Feed Service`,
- `Reactions Service`.

Одновременно в репозитории уже есть `apps/content-service`, который фактически обслуживает **Atlas/Pulse/Blog** по API `/v1/content/*`.

Это создаёт терминологический конфликт:
- “Content Service” в docs = Space UGC,
- “content-service” в repo = контентные данные (Atlas/Pulse/Blog).

Дополнительно зафиксирована архитектурная модель общения:
- **нет inline-комментариев под объектами контентных модулей** (Blog/Atlas/Pulse/RF/Rielt),
- обсуждение происходит social-first через **репосты и реакции** в Space (см. `docs/decisions/adr_0020_no_inline_comments_social_first.md`).

## Решение

1) В документации и планировании Фазы 2:
- `content-service` (repo) = **Content Domain Service** (Atlas/Pulse/Blog API: `/v1/content/*`).
- Space UGC контур именуется как **Space Service** (или `space-service`), а не “Content Service”, чтобы убрать конфликт.

2) Границы ответственности Space (целевой контур):
- **Space Service**: посты/репосты (как объекты Space), авторы, группы, базовые CRUD.
- **Feed**: механика лент (может быть модулем внутри Space на MVP).
- **Reactions**: лайки/ratings/short_review/repost и thread-like ответы (может быть модулем внутри Space на MVP).

3) MVP-компромисс по сервисному разбиению (Phase 2):
- допускается реализация **в одном backend-приложении** (`space-service`) с логическими модулями “content/feed/reactions”,
- но в документации и API контрактах эти границы должны быть явными, чтобы позже можно было разнести по отдельным сервисам без смены модели.

4) Комментарии:
- inline-комментариев “под объектами” контентных модулей не вводить,
- обсуждение контента модулей идёт через **репост в Space** и реакции/ответы к посту/репосту.

## Последствия

**Плюсы**
- Снимается конфликт “content-service = Space content”.
- Планирование Фазы 2 становится согласованным: Space/Feed/Reactions как F2 контур, а `apps/content-service` остаётся контентным доменным API.
- Удерживается social-first модель без расползания comment-систем.

**Минусы**
- Потребуются точечные правки формулировок в архитектурных документах (в частности, в `backend_microservice.md`) и в будущих API контрактах Space.

## Evidence

- Repo content service: `apps/content-service/src/index.ts` (API `/v1/content/*`)
- Social-first decision: `docs/decisions/adr_0020_no_inline_comments_social_first.md`
- Фактический инвентарь: `docs/ops/service_inventory.md`




