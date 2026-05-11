# Connect User Economy Snapshot v1

## 1. Purpose

Определить минимальный canonical snapshot пользовательской экономики для Connect.

Этот snapshot описывает только то, что пользователь должен видеть сразу при открытии Connect dashboard, без расширения в drilldown-сценарии и без domain ownership со стороны Connect.

---

## 2. Canon Context

- Connect = read-only aggregation layer.
- Points Service = ledger owner.
- RF/voucher layer = voucher lifecycle owner.
- Referral Service = referral graph owner.
- Connect не выполняет mutation.
- Connect не получает ownership доменной логики.

---

## 3. Snapshot Definition

**Connect snapshot** = минимальный набор данных, который пользователь видит сразу при открытии Connect.

Примечание по термину:

- snapshot в этом документе означает dashboard-first composed view:
  - `GET /v1/points/connect-dashboard` для Points/referrals/badges;
  - отдельные read-only RF endpoints для voucher summary/list blocks.

Формула:

> Snapshot = dashboard-first read-only economy view с ограниченным payload и без глубоких списков/деревьев.

Назначение snapshot:

- быстро дать пользователю текущее состояние экономики;
- показать краткую сводку по ключевым блокам;
- направить пользователя в drilldown endpoints при необходимости.

---

## 4. Required Snapshot Fields (v1)

### 4.1 Points

Обязательные поля:

- `currentBalance`
- `updatedAt`

### 4.2 Recent Activity (Points-based)

Обязательные поля:

- последние `N` транзакций;
- для каждого элемента:
  - `amount`
  - `action`
  - `createdAt`

Правило:

- `metadata` не является обязательной частью snapshot;
- детализация по metadata относится к отдельному drilldown endpoint.

### 4.3 Referral Summary

Минимальный summary:

- `totalReferrals`
- `activatedReferrals`
- `totalEarnedPoints`

Не включается в snapshot:

- полное referral tree;
- полный earnings list.

### 4.4 Badges Summary

Минимальный summary:

- `totalBadges`
- последние `N` badges

### 4.5 Voucher Summary (новый элемент)

Read-only voucher summary (минимум):

- `totalVouchers`
- `activeVouchers` (`claimed`)
- `usedVouchers` (`redeemed`)

Source endpoint:

- `GET /v1/rf/me/vouchers/summary`

Не включается в snapshot:

- полный voucher list;
- lifecycle actions;
- claim/redeem операции.

Lock:

- voucher lifecycle ownership остаётся в RF/voucher layer.

---

## 5. Snapshot vs Drilldown

### Snapshot (dashboard surface)

- points balance
- recent transactions
- referral summary
- badges summary
- voucher summary

### Drilldown (отдельные surfaces/endpoints)

- full transactions list
- referral tree
- referral earnings detail
- full badge list
- full voucher list (future RF read endpoint)

---

## 6. Data Sources

| Block | Source Service |
| --- | --- |
| points | points-service |
| transactions | points-service |
| referrals | referral-service |
| badges | points-service |
| vouchers | RF/voucher layer (read-only, composed in Connect UI; не часть payload `GET /v1/points/connect-dashboard`) |

---

## 7. Aggregation Rules

Базовые правила:

- Connect не рассчитывает domain значения.
- Connect не агрегирует бизнес-логику доменов.
- Connect только:
  - читает;
  - отображает;
  - ограничивает размер snapshot (`limit N`) для dashboard-first ответа.

---

## 8. Voucher Summary Rules

Voucher summary в Connect:

- строго read-only;
- Connect не lifecycle owner;
- статусы должны приходить из RF/voucher read contract.

Connect не должен:

- изменять статусы;
- интерпретировать lifecycle правила локально;
- создавать/выдавать/redeem-ить vouchers.

---

## 9. Snapshot Constraints

- минимальный payload;
- быстрый dashboard-first ответ;
- без heavy aggregation;
- без сложных cross-service join в рамках этого v1 contract.

---

## 10. Future Extensions

Не входят в Snapshot v1:

- voucher list;
- activity stream (cross-domain);
- Missions;
- Levels logic;
- Analytics;
- token/NFT/G2A state.

---

## 11. Open Questions

- Сколько элементов `recentTransactions` показывать в snapshot по умолчанию?
- Сколько `recent badges` включать в snapshot?
- Нужны ли voucher категории в summary v1 или только status buckets?
- Нужен ли breakdown по voucher types в v1, или вынести в future drilldown?

---

## 12. Non-Goals

- no code;
- no API changes;
- no DB changes;
- no UI changes;
- no voucher lifecycle ownership;
- no reward calculation ownership in Connect;
- no new services.

