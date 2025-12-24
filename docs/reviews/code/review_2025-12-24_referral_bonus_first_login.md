# Code review (Step D): Referral bonus on first login

**Дата:** 2025-12-24  
**Область:** `apps/referral-service` (+ CI deploy vars)

## Изменение

Добавлено начисление бонуса рефереру при активации реферала (**pending → active**) через internal endpoint:
- `POST /internal/referral/mark-first-login`

Механика:
- вычисляем `externalId = referral:first_login:<referrerId>:<refereeId>` (SSOT идемпотентности)
- вызываем `points-service` `POST /internal/points/add` с `action=referral_bonus_referrer`
- сумма берётся из `REFERRAL_FIRST_LOGIN_BONUS` (fallback: 100)

## Почему так

- Инициатор — `referral-service` (как в требованиях Step D).
- Идемпотентность не зависит от суммы (только от пары пользователей).
- Повторные вызовы безопасны: `points-service` дедупит по `externalId`.

## Риски / edge cases

- Если `POINTS_SERVICE_URL` не сконфигурирован — бонус не начислится (endpoint остаётся non-blocking).
- Таймаут 2s на inter-worker fetch, чтобы не блокировать auth-поток.

## Проверка

См. `docs/ops/referral_bonus_first_login.md`.

