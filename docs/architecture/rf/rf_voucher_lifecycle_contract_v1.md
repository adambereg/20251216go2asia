# RF Voucher Lifecycle Contract v1

## 1. Purpose

Определить canonical voucher lifecycle baseline для RF commerce contour как inquiry baseline Go2Asia без runtime implementation в этом pass.

## 2. Canon Context

- voucher = продукт RF/voucher layer;
- claim = первый прикладной контакт;
- no chat baseline;
- Rielt = discovery surface;
- RF = commerce/partner layer.

## 3. Core Entities

- offer;
- voucher;
- claim (`offer_claim` / `voucher_claim`);
- redeem.

## 4. Voucher Lifecycle (baseline)

Минимальный lifecycle baseline:

- `issued` (после успешного claim);
- `redeemed`;
- `expired`;
- `canceled` (optional).

Lock note:

- сложные промежуточные статусы не добавляются в RF-002;
- baseline фиксирует минимальный переходный контур для voucher-first модели.

Lifecycle mapping:

- claim -> voucher created (runtime: `claimed`, semantic/product: `issued`);
- redeem -> terminal usage;
- `expired` / `canceled` -> optional terminal states.

Single source of truth:

- lifecycle управляется только RF/voucher layer.

## 5. Claim Contract

- idempotency = обязательна;
- request contract использует `externalId`/`Idempotency-Key` семантику;
- claim обязан быть связан с:
  - user;
  - partner;
  - PRO context (если есть link);
  - offer.

Guardrails:

- повторный claim не должен создавать дублирующие бизнес-эффекты;
- claim фиксируется как voucher lifecycle signal.

## 6. Redeem Contract

- redeem выполняет partner-side actor (owner/authorized partner role);
- контекст исполнения:
  - on-site;
  - near-now;
  - scheduled;
- proof baseline:
  - voucher code (обязательный);
  - QR = future/optional.

Guardrails:

- redeem не должен владеться Rielt;
- redeem truth остается в RF/voucher layer.

## 7. Voucher Credential

- credential baseline = `code` (обязательный);
- QR = optional/future extension;
- lifecycle credential usage в baseline:
  - `issued -> redeemed`.

## 8. Signal Model (MVP)

- claim = сигнал;
- redeem = сигнал.

Ограничения RF-002:

- без обязательной notification системы;
- без chat;
- без thread.

## 9. PRO Role

- PRO не участвует в каждой операции claim/redeem;
- PRO может видеть события/контекст;
- PRO подключается при необходимости (curator/mediation/escalation).

## 10. Non-Goals

- no booking engine;
- no chat;
- no payment;
- no notification infra;
- no Points integration;
- no NFT.

## 11. Future Extensions

- notification fan-out;
- QR scanner;
- branch-based vouchers;
- Points reward bridge;
- Missions integration.

## 12. Terminology Alignment: issued vs claimed

Decision:

- runtime термин = `claimed`;
- canonical/product термин = `issued`.

Rule:

- `voucher_claim` (операция) создает ваучер в runtime состоянии `claimed`;
- в product/canon смысле это означает, что ваучер выдан пользователю (`issued`).

Mapping:

- `claimed` (runtime) = `issued` (product meaning).

Guardrails:

- не вводить новый runtime статус `issued`;
- не менять DB/enum;
- не менять OpenAPI;
- использовать `claimed` в API и коде;
- использовать `issued` только как semantic interpretation в документации/UX.

