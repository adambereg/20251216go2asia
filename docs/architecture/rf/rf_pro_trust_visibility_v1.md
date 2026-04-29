# RF PRO Trust-Chain Visibility v1

## 1. Purpose

Определить минимальную baseline-модель видимости участия PRO в RF/voucher flows без внедрения moderation/analytics/notification платформ.

## 2. Canon Context

- PRO = curator / mediator / escalation;
- PRO не является оператором каждой транзакции;
- visibility != control;
- RF остается владельцем lifecycle;
- voucher-first модель сохраняется.

## 3. PRO Role in Trust Chain

PRO:

- онбордит партнера;
- может создавать listing через Rielt workflow;
- связан с partner через `rf_pro_link`;
- получает visibility по событиям;
- подключается при необходимости.

PRO не:

- не выполняет claim;
- не выполняет redeem;
- не обязан реагировать на каждое событие;
- не владеет lifecycle.

## 4. Visibility Model (baseline)

PRO должен иметь visibility по событиям:

- partner onboarding;
- offer creation (если применимо);
- voucher claim;
- voucher redeem.

Но:

- visibility != обязательное действие;
- visibility != ownership.

## 5. Event Visibility Baseline

| Event | Source | Visibility audience | Reaction required |
| --- | --- | --- | --- |
| `partner_onboarded` | RF layer | PRO, partner | no |
| `offer_created` | RF layer | PRO, partner | no |
| `voucher_claimed` | RF/voucher layer | PRO, partner, VIP (display context) | no |
| `voucher_redeemed` | RF/voucher layer | PRO, partner, VIP (display context) | no |

## 6. Visibility vs Action

PRO:

- видит события;
- может реагировать.

Но:

- не обязан реагировать;
- не блокирует lifecycle;
- не становится bottleneck.

## 7. Escalation Model

PRO подключается:

- если есть проблема;
- если есть языковой барьер;
- если есть спор;
- если требуется помощь.

Это:

- escalation layer;
- не default execution path.

## 8. Trust Signals

Минимальные trust indicators:

- наличие PRO у партнера;
- связь listing <-> PRO;
- факт активности PRO;
- без сложной репутационной системы.

## 9. PRO <-> Voucher Lifecycle Boundary

- PRO не владеет claim/redeem;
- PRO не меняет статус voucher;
- PRO не влияет на ledger;
- PRO не является источником истины.

## 10. PRO <-> Rielt Boundary

- Rielt может показывать PRO как curator;
- PRO = trust signal;
- PRO != контактное лицо для direct inquiry baseline.

## 11. PRO <-> Points / Rewards (baseline)

- rewards для PRO возможны в future;
- но PRO:
  - не пишет Points;
  - не является producer сейчас;
  - не влияет на reward execution.

## 12. Future Extensions

- PRO analytics;
- reputation system;
- moderation layer;
- incentive model;
- PRO dashboards;
- notifications.

Все перечисленное:

- future;
- не baseline.

## 13. Non-Goals

- no moderation system;
- no analytics system;
- no notifications implementation;
- no reward system implementation;
- no UI changes;
- no DB changes;
- no new services;
- no PRO as transaction operator.

