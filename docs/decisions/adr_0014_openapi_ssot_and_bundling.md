# ADR-0014: OpenAPI SSOT per-service + bundle artefact for generation

**Статус:** Accepted / Implemented  
**Дата:** 2025-12-24  

## Контекст

Проект следует принципу OpenAPI-first (см. план `docs/plans/mvp_implementation_plan.md`).  
При этом к моменту интеграции сервисов возник риск дрейфа контрактов: разные сервисы имеют свои спецификации, а генерация типов/SDK требует единого входного файла.

Нужно принять одно решение, где находится **SSOT (source of truth)** и как формируется единый файл для генерации.

## Решение

Выбираем **вариант 1**:

- **SSOT = per-service OpenAPI файлы** в `docs/openapi/*.yaml`:
  - `auth.yaml`
  - `content.yaml`
  - `points.yaml`
  - `referral.yaml`
- **Bundle artefact** (производный файл) генерируется скриптом:
  - `docs/openapi/openapi.bundle.yaml`
- Orval (генерация типов/SDK) читает **только bundle artefact**.
- CI:
  - валидирует per-service файлы через Spectral
  - проверяет, что bundle artefact актуален (не отличается от результата сборки)

## Последствия

**Плюсы**
- Контракты сервисов остаются независимыми и читаемыми.
- Bundle — детерминированный артефакт, что снижает риск «сломали генерацию».
- Упрощается контроль изменений: любые правки в API видны в diff конкретного сервиса.

**Минусы**
- Появляется дополнительный шаг: генерация bundle перед `pnpm gen:types/gen:sdk`.
- Нужно следить за коллизиями `components/*` при мердже (скрипт должен падать на конфликте).

## Реализация

- SSOT-файлы: `docs/openapi/{auth,content,points,referral}.yaml`
- Bundle: `docs/openapi/openapi.bundle.yaml` (генерируется)
- Скрипт бандлинга: `scripts/openapi_bundle.*`
- Orval input: `docs/openapi/openapi.bundle.yaml` (`orval.config.ts`)



