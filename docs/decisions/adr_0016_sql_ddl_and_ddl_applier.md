# ADR-0016: Database schema is managed via SQL DDL files + DDL applier

**Статус:** Accepted / Implemented  
**Дата:** 2025-12-24  

## Контекст

Изначально план MVP предполагал Drizzle migrations как SSOT для схемы БД.

На практике для Neon (serverless Postgres) и Cloudflare Workers (edge) возникли проблемы:
- миграции Drizzle создавали неоднозначность окружений и зависимость от runtime-контекста;
- сложнее аудитить и воспроизводить DDL “с нуля”;
- повышается риск ошибок при раскатке на staging/prod.

## Решение

- **SSOT схемы БД = SQL DDL файлы** в `packages/db/migrations/*.sql`
- Применение DDL выполняется **Node-only DDL applier** (детерминированно, с логированием и безопасными транзакциями).
- Drizzle используется **как query layer**, а не как schema-manager.

## Последствия

**Плюсы**
- SQL — прозрачный и аудитируемый источник истины.
- Предсказуемые деплои в Neon (staging/prod) без “магии ORM”.
- Упрощается восстановление/репликация схемы на новой Neon branch.

**Минусы**
- Нужно поддерживать дисциплину: любое изменение схемы = новый SQL migration.
- Требуется базовый tooling (applier + проверки порядка/идемпотентности).

## Реализация

- DDL migrations: `packages/db/migrations/*.sql`
- Применение: `packages/db/src/ddlApply.ts` (Node-only)
- Принцип: транзакция на файл миграции; падение не откатывает уже применённые файлы.

