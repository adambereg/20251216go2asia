# Security review (Step D): Referral bonus on first login

**Дата:** 2025-12-24  
**Область:** `referral-service → points-service` (internal call)

## Модель доверия

- Внутренний endpoint `POST /internal/referral/mark-first-login` защищён `Authorization: Bearer <service JWT>` (HS256, общий `SERVICE_JWT_SECRET`).
- Вызов `points-service` выполняется только при наличии `SERVICE_JWT_SECRET` и `POINTS_SERVICE_URL`.

## Проверки утечек

- Токены **не логируются** (в логах только `userId/action/status`, body обрезается до 200 символов).
- DB URL не выводится в logs (в этом изменении не добавлялось).

## Кеширование / приватность

- Ответ internal endpoint устанавливает `Cache-Control: no-store`.

## Рекомендации

- В staging/prod держать `SERVICE_JWT_SECRET` только в секретах Cloudflare (не vars).
- Ограничить доступ к internal endpoints только через service JWT (как сейчас).



