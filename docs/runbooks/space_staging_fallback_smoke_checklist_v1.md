# Space Staging Fallback Smoke Checklist (v1)

Цель: зафиксировать минимальный bounded flow для fallback в Space live surfaces после seed/runtime hardening.

## 1) Env change (staging frontend)

Добавить во frontend staging environment:

- `NEXT_PUBLIC_SPACE_PHASE1_PROFILE_ID=user_3BlK8FjaNuSTgxcgX8Lnkeot3Wy`

Пояснение: этот профиль (`Oleg Tran`) подтверждён как representative public profile с непустым profile feed.

## 2) Redeploy staging frontend

После обновления env выполнить redeploy staging frontend, чтобы переменная попала в клиентский билд.

## 3) Smoke-check (bounded, 4 пункта)

1. `GET /v1/space/feed/profile/user_3BlK8FjaNuSTgxcgX8Lnkeot3Wy?limit=20`
   - ожидаемо: `200`, `items > 0`.
2. `/space` без авторизации
   - ожидаемо: экран не в `deferred` по причине отсутствия fallback profile id;
   - fallback mode должен подтянуть непустой feed.
3. `/space/community/feed` без авторизации
   - ожидаемо: непустой fallback feed на том же representative profile.
4. `/space/profiles/user_3BlK8FjaNuSTgxcgX8Lnkeot3Wy`
   - ожидаемо: профиль открывается, authored/profile feed непустой.

## 4) Failure handling (не расширяя scope)

- Если API пункт 1 возвращает `items = 0`, не менять фичи и не открывать broad wave.
- Проверить только:
  - что staging frontend действительно пересобран с новым env;
  - что runtime path `/v1/space/feed/profile/{id}` отвечает корректно;
  - что выбранный representative id не был заменён.
