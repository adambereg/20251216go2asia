# ADR-0021: Token / Points / Connect terminology alignment (MVP)

**Статус:** Accepted / Documentation-only  
**Дата:** 2025-12-26  

## Контекст

В документации и UI встречаются одновременно “Token Service”, “Points Service” и “Connect”.

Фактическое состояние репозитория:
- Реально реализован и используется **Points** backend: `apps/points-service` (`/v1/points/balance`, `/v1/points/transactions`).
- UI “Connect” ходит в `/v1/points/*` через SDK (например, `packages/sdk/src/balance.ts`).
- `apps/token-service` существует как **skeleton** (только `/health`) и не реализует tokenomics engine.

Риск: “Token Service” в текстах воспринимается как уже существующий оффчейн-движок экономики, хотя фактически это **не так**, и это ломает планирование Фазы 2.

## Решение

1) **Connect** — это **frontend-модуль/зона продукта**, а не бэкенд‑сервис.

2) **Points** (оффчейн-очки) в MVP имеют SSOT в сервисе:
- **`points-service`** (Cloudflare Worker) + таблицы `points_transactions`, `user_balances`.

3) Термин **“Token Service / Tokenomics Service”** в MVP:
- использовать **только** как обозначение **future** оффчейн-движка (Points + G2A + NFT + rules),
- не маркировать его как “реализованный”, пока в репозитории нет реального API/логики (кроме skeleton health).

4) Публичный API для экономики в MVP:
- канонический префикс: **`/v1/points/*`** (не “/v1/connect/*” и не “/v1/token/*”).

## Последствия

**Плюсы**
- Убираем путаницу “Token Service уже есть”.
- Планирование Фазы 2 опирается на реально существующий `points-service`.
- Не ломаем API и SDK: `/v1/points/*` остаётся стабильным контрактом.

**Минусы**
- В части документов придётся явно пометить “Token Service” как future и/или переименовать формулировки.

## План синхронизации терминов (без изменения кода)

- Документы:
  - в `docs/knowledge/backend_microservice.md` и других архитектурных текстах: пометить “Token (Connect) Service” как **Later / Not started**, а “Points Service” как **Implemented** (см. `docs/ops/service_inventory.md`).
- UI:
  - заменить текстовые/комментарные упоминания “Token Service” на “Points Service” там, где вызовы идут в `/v1/points/*`.

## Evidence

- `apps/points-service/src/index.ts`
- `packages/sdk/src/balance.ts` → `GET /v1/points/balance`
- `apps/token-service/src/index.ts` (skeleton, `/health` only)
- `docs/ops/service_inventory.md`




