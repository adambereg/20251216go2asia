# RF <-> Rielt Voucher-First Contract v1

## 1. Purpose

Зафиксировать contract boundary между Rielt discovery layer и RF/voucher commerce layer для strict voucher-first модели без runtime implementation в этом pass.

## 2. Canon Context

- Rielt = strict voucher-first discovery;
- RF = partner/business identity;
- voucher claim/redeem = RF/voucher-layer lifecycle baseline, not Rielt execution;
- no chat baseline;
- no booking baseline;
- no direct inquiry baseline;
- RF owns voucher lifecycle truth.

## 3. Rielt Current Role

Rielt может:

- показывать listing;
- показывать RF partner reference;
- показывать RF offer / voucher CTA;
- вести пользователя к claim offer;
- показывать trust/PRO signals, если они доступны.

Rielt не может:

- создавать voucher;
- redeem voucher;
- менять voucher status;
- владеть partner identity;
- владеть offer lifecycle;
- владеть payment;
- быть chat / booking engine.

## 4. RF References in Rielt

Допустимые refs:

- `rf_partner_id` / `rf_offer_id` (write-side fields в Rielt create/patch contract);
- `rfContext.rfPartnerId` / `rfContext.rfOfferId` (read-side owner context).

Правила:

- `rf_offer_id` без `rf_partner_id` недопустим концептуально;
- `rf_partner_id` может быть без `rf_offer_id`, если listing привязан только к partner;
- `rf_offer_id` должен соответствовать тому же partner;
- сейчас refs могут быть soft/transitional;
- Rielt stores only soft references to RF partner/offer and routes users into RF;
- `rf_offer_id` is optional and must not be inferred from `RfVoucher.id` or any post-claim voucher id;
- strict validation переносится в future implementation slice.

## 5. Soft Refs Now / Strict Validation Later

Current:

- Rielt create/patch не блокируется из-за отсутствия RF сущностей;
- soft refs допустимы как transitional state.

Target:

- strict validation:
  - partner exists;
  - offer exists;
  - offer belongs to partner;
  - offer active;
  - offer claimable;
  - listing allowed to expose this offer.

Lock:

- strict validation не реализуется в этом pass.

## 6. Voucher-First CTA Contract

Primary CTA в Rielt должен быть voucher-oriented:

- claim voucher;
- activate offer;
- get VIP bonus;
- open partner offer;
- get accommodation bonus.

В Rielt это означает handoff/deep link в RF surface, а не локальное выполнение claim/redeem.

Не primary:

- message owner;
- ask question;
- direct inquiry;
- book now;
- contact agent.

Если post-claim coordination нужна:

- она происходит после voucher claim;
- не является baseline CTA;
- не принадлежит Rielt как chat/inquiry system.

## 7. Handoff Contract

Минимальный handoff (Rielt -> RF/voucher claim context):

- `listing_id`;
- `rf_partner_id`;
- `rf_offer_id` when an explicit offer mapping exists;
- user context;
- `return_url` / source context;
- optional urgency mode:
  - scheduled;
  - near-now;
  - on-site.

RF/voucher layer после claim является source of truth для:

- voucher id;
- voucher code;
- status;
- redeem state.

## 8. Status / Display Contract

Rielt может показывать:

- offer summary;
- voucher availability;
- partner trust markers;
- PRO curator marker;
- CTA state.

Но:

- voucher status truth не из Rielt;
- claimed/redeemed/canceled status должен идти из RF/voucher layer;
- local/demo state не должен выглядеть как live voucher state.

## 9. Rielt UI Guardrails

Без UI implementation, только правила:

- CTA copy не должен возвращать inquiry-first модель;
- direct inquiry может быть только post-claim coordination/fallback, если сохраняется;
- нельзя использовать booking language как primary;
- нельзя обещать confirmed reservation, если claim только выдает voucher;
- listing не должен выглядеть как standalone Airbnb-like transaction.

## 10. Rielt Backend / API Guardrails

Без code changes, только правила:

- Rielt не должен создавать vouchers;
- Rielt не должен менять RF offer;
- Rielt не должен redeem;
- Rielt не должен писать Points;
- Rielt хранит только refs / display fields;
- strict cross-service validation = future slice.

## 11. Integration with RF Voucher Lifecycle

Reference:

- `docs/architecture/rf/rf_voucher_lifecycle_contract_v1.md`

Lock:

- claim -> runtime `claimed`, semantic `issued`;
- redeem -> RF truth;
- code required;
- QR future/optional;
- notification fan-out future.

## 12. Open Questions

- какой exact CTA copy выбрать для MVP, чтобы не уйти в inquiry-first semantics;
- нужен ли `urgency_mode` уже в handoff contract или позже;
- нужен ли `return_url/source_context` в RF claim handoff как обязательный минимум;
- как показывать partner/PRO trust marker в Rielt без live integration drift.

## 13. Non-Goals

- no code changes;
- no OpenAPI changes;
- no DB migration;
- no UI rewrite;
- no booking;
- no chat;
- no direct inquiry baseline;
- no payment;
- no Points integration;
- no Notifications implementation;
- no strict validation implementation in this pass.

