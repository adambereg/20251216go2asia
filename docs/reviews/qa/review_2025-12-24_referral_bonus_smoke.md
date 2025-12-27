# QA smoke (Step D): Referral bonus on first login

**Дата:** 2025-12-24

## Цель

Подтвердить, что после перехода реферала **pending → active** у реферера появляется транзакция `referral_bonus_referrer`.

## Чек-лист

1) Под пользователем A (referrer) открыть `/connect/referrals` и скопировать реферальную ссылку/код.
2) Под пользователем B (referee) зарегистрироваться по `/sign-up?ref=<CODE>` или выполнить claim.
3) Под пользователем A убедиться, что B отображается как “в ожидании”.
4) Под пользователем B выполнить sign-out → sign-in (или любой гарантированный вход).
5) Под пользователем A открыть `/connect/wallet` и проверить, что:
   - появилась новая транзакция “Бонус за приглашение друга”
   - баланс обновился (если UI показывает)
6) В Neon SQL editor выполнить запрос из `docs/ops/referral_bonus_first_login.md` и подтвердить запись в `points_transactions` по `external_id`.

## Ожидаемые результаты

- В `referral_relations.first_login_at` для B установлено значение (не NULL).
- В `points_transactions` есть запись:
  - `user_id = <referrerId>`
  - `external_id = referral:first_login:<referrerId>:<refereeId>`
  - `amount = REFERRAL_FIRST_LOGIN_BONUS` (или 100 по умолчанию)



