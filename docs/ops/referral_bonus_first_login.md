# Referral bonus: first login (MVP)

Цель: подтвердить и/или воспроизводимо проверить начисление бонуса рефереру, когда реферал переходит из **pending → active** (устанавливается `referral_relations.first_login_at`).

## Контракт бонуса (MVP)

- **Инициатор:** `referral-service` на активации (endpoint `POST /internal/referral/mark-first-login`)
- **Кому начисляем:** `referrerId`
- **Событие:** first login реферала (`refereeId`)
- **Action:** `referral_bonus_referrer`
- **Idempotency (SSOT):**
  - `external_id = referral:first_login:<referrerId>:<refereeId>`
- **Сумма:** конфигурируется через env:
  - `REFERRAL_FIRST_LOGIN_BONUS` (целое число, points)
  - fallback: `100`

## Evidence (что считать доказательством)

1) **DB**: есть запись в `points_transactions` для `user_id = <referrerId>` и `external_id = referral:first_login:<referrerId>:<refereeId>`.
2) **API**: `GET /v1/points/transactions` для referrer показывает транзакцию с `action/referral_bonus_referrer` (или `reason=referral_bonus_referrer` в старом поле).

## Smoke steps (staging)

Ниже — воспроизводимый сценарий, который можно прогнать руками на staging.

### 0) Предусловия

- В staging задеплоены сервисы `auth-service`, `referral-service`, `points-service` и `api-gateway`.
- В `referral-service` настроены переменные:
  - `DATABASE_URL`
  - `SERVICE_JWT_SECRET`
  - `POINTS_SERVICE_URL`
  - (опционально) `REFERRAL_FIRST_LOGIN_BONUS`

**Если `POINTS_SERVICE_URL` не задан** (или отсутствует `SERVICE_JWT_SECRET`), активация (`first_login_at`) всё равно произойдёт, но **бонус “тихо” не начислится** (без фатальной ошибки для auth-потока). Это ожидаемое поведение для MVP.

### 1) Подготовить пару пользователей (referrer/referee)

- **Referrer**: пользователь A (у него есть реферальный код/ссылка).
- **Referee**: пользователь B (регистрируется по ссылке A или делает claim).

В UI это выглядит так:
- A → `/connect/referrals` → скопировать ссылку
- B → открыть `/sign-up?ref=<CODE>` и зарегистрироваться

После регистрации B должен появиться у A как **pending** (пока `first_login_at` не установлен).

### 2) Триггер активации (pending → active)

Сделайте реальный **sign-in** пользователя B в staging (или sign-out → sign-in).

На успешном auth FE вызывает `POST /v1/users/ensure`, который (через `auth-service`) вызывает internal:
- `POST /internal/referral/mark-first-login { userId: <B> }`

Это и есть триггер бонуса.

### 3) Проверка через API (referrer A)

В браузере под пользователем A (referrer):
- `/connect/wallet` или `/connect` — должна появиться транзакция “Бонус за приглашение друга”.

Или через Network:
- `GET /v1/points/transactions`

### 4) Проверка через DB (Neon SQL editor)

Подставьте реальные `referrerId/refereeId`:

```sql
select id, user_id, amount, reason, external_id, created_at
from points_transactions
where external_id = 'referral:first_login:<referrerId>:<refereeId>'
order by created_at desc
limit 5;
```

Также можно проверить, что реферал стал active:

```sql
select referrer_id, referee_id, registered_at, first_login_at
from referral_relations
where referee_id = '<refereeId>'
limit 1;
```

## Примечания

- **Idempotency не зависит от суммы**: изменение `REFERRAL_FIRST_LOGIN_BONUS` не изменит `external_id` для уже начисленных пользователей.
- Повторные триггеры (повторный login, повторный вызов internal endpoint) безопасны: `points-service` дедупит по `external_id`.



