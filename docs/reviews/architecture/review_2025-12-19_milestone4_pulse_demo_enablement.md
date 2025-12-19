# Architecture Review: Milestone 4 — Pulse demo enablement (staging)

**Дата:** 2025-12-19  
**Роль:** Architecture Reviewer  
**Статус:** **APPROVED_WITH_COMMENTS**

## Контекст
Нужно обеспечить ручную проверку `/pulse/[id]` и кнопки регистрации на событие в **staging**, при отсутствии реального каталога событий.

## Принятые решения
- **Seed только для staging**: сид запускается явно и требует `STAGING_DATABASE_URL` (или `DATABASE_URL` при `ENVIRONMENT=staging`).
- **Стабильные event id**: фиксированные UUID для предсказуемых URL.
- **Минимальная backend surface area**: добавлен публичный `GET /v1/content/events/{id}` для чтения одной записи.
- **Gateway без доменной логики**: фронт ходит по gateway paths, backend делает простой select.

## Плюсы
- **Idempotent** seed (не плодит дубликаты).
- Изоляция от production (защитные проверки env).
- Публичный GET не требует auth и не зависим от Clerk.

## Комментарии (не блокеры)
- **Кэширование**: если gateway/edge будет кешировать `GET /v1/content/events/{id}`, это ок для публичного контента; важно не кешировать приватные endpoints (points). Это уже зона gateway.
- **Ответ DTO**: сейчас ответ минимальный и стабильный; при расширении UI можно оформить полноценный OpenAPI для content-service.

## Вердикт
**APPROVED_WITH_COMMENTS** — архитектурно минимально-инвазивно и соответствует M4.
