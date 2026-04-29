# Connect Voucher Visibility Contract v1

## 1. Purpose

Зафиксировать read-only visibility пользовательских vouchers в Connect.

Цель документа - определить безопасный контракт видимости ваучеров без передачи Connect каких-либо lifecycle-полномочий.

---

## 2. Canon Context

- RF/voucher layer owns voucher lifecycle.
- Connect reads only.
- Connect does not mutate voucher state.
- Connect is not a backend-domain owner.
- Points writes and reward execution remain outside Connect.

---

## 3. Source of Truth

Source of truth для voucher lifecycle и voucher status:

- RF/voucher layer.

Preferred read endpoint:

- `GET /v1/rf/me/vouchers`, если доступен через утверждённый gateway/auth path.

Observed runtime fit:

- endpoint exists;
- endpoint is authenticated;
- endpoint returns vouchers for current user only;
- endpoint is GET/read-only;
- endpoint returns voucher identity, status, code, offer/partner refs and timestamps.

---

## 4. Connect Voucher Summary

Snapshot fields:

- `totalVouchers`
- `activeVouchers` = count of vouchers with runtime status `claimed`
- `usedVouchers` = count of vouchers with runtime status `redeemed`

Optional future fields:

- expired count;
- canceled/cancelled count;
- grouped counts by voucher category/type, only after an explicit RF-owned read contract exists.

Terminology lock:

- runtime status remains `claimed`;
- product semantic may call this "issued", but Connect must not introduce runtime `issued`.

---

## 5. Full Voucher List

Full voucher list is drilldown, not dashboard snapshot.

Current preferred RF source:

- `GET /v1/rf/me/vouchers`.

Future options:

- a dedicated RF read endpoint with pagination/filtering;
- a bounded read-model if the full voucher list grows beyond the current endpoint shape.

Not required for Snapshot v1:

- full offer details;
- full partner details;
- lifecycle actions.

---

## 6. Ownership Guardrails

Connect must not:

- claim vouchers;
- redeem vouchers;
- change voucher status;
- infer status locally;
- create vouchers;
- write Points;
- treat local/demo state as voucher truth;
- reinterpret RF lifecycle rules.

RF/voucher layer remains the lifecycle owner for:

- claim;
- redeem;
- status transitions;
- voucher code truth;
- user/offer/partner relationships.

---

## 7. Runtime Integration Options

### Option A: Dashboard read-model calls/reads RF voucher summary

Connect dashboard remains in Points Service and includes voucher summary by calling or reading RF-owned voucher data.

Pros:

- one dashboard payload for Connect.

Cons:

- introduces Points Service -> RF coupling;
- requires service auth / gateway decision;
- risks making Points dashboard a hidden cross-domain Connect backend owner.

### Option B: Connect frontend reads RF vouchers separately and composes UI

Connect frontend uses the RF user-voucher read endpoint separately and composes the snapshot in UI.

Pros:

- preserves RF ownership;
- avoids Points -> RF coupling.

Cons:

- UI must avoid business-rule calculation beyond simple display counts;
- still requires explicit product/UI implementation later.

### Option C: Future Connect BFF/read-model if complexity grows

Create a future bounded read-model only if composition complexity, caching, or multiple Connect-specific surfaces justify it.

Pros:

- isolates composition if it becomes genuinely complex.

Cons:

- not current MVP;
- must not become economy owner.

### Recommendation

Selected implementation option for Connect-003-IMPL:

- **RF-owned summary endpoint**.

Runtime endpoint:

- `GET /v1/rf/me/vouchers/summary`

Connect may use this endpoint for snapshot voucher summary:

- `totalVouchers`
- `activeVouchers`
- `usedVouchers`
- `cancelledVouchers`

The endpoint remains RF-owned and read-only. Connect still must not claim, redeem, mutate, or infer lifecycle state locally.

For Connect-003 v1, the contract was created first and runtime integration is limited to the RF-owned summary endpoint.

Rationale:

- RF read endpoint already exists and is suitable as a source of truth for read-only voucher visibility;
- adding voucher summary to `GET /v1/points/connect-dashboard` would introduce Points -> RF coupling and remains out of scope;
- frontend composition remains a separate UI integration step;
- RF-owned summary keeps lifecycle truth inside RF/voucher layer.

---

## 8. Non-Goals

- no mutations;
- no DB schema change;
- no UI rewrite;
- no Points write;
- no new service;
- no claim/redeem changes;
- no voucher lifecycle ownership in Connect.

