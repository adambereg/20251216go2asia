# Connect Runtime Contract Lock v1

## 1. Purpose

Зафиксировать current runtime contract Connect Asia как user-side economy read layer без backend-domain ownership.

Документ разделяет:

- текущие runtime surfaces;
- ownership boundaries;
- разрешённые read-only роли Connect;
- ближайшие разрешённые slices без scope expansion.

---

## 2. Canon Context

Канонический контекст для Connect-001:

- Connect = UI / user economy hub.
- Connect не backend-service.
- Points owns ledger.
- Referral owns referral graph.
- RF owns voucher lifecycle.
- Badges current off-chain.
- Token / NFT / Missions future.
- UI не владеет domain truth.

---

## 3. Current Runtime Scope

### 3.1 Connect frontend surfaces

Текущие пользовательские surfaces:

- dashboard
- wallet
- referrals
- levels/badges (частично display/future boundary)
- missions placeholder
- analytics placeholder

### 3.2 Backend read surfaces

Текущий runtime read baseline для Connect:

- `GET /v1/points/connect-dashboard`
- `GET /v1/points/balance`
- `GET /v1/points/transactions`
- `GET /v1/points/badges`
- `GET /v1/points/badges/mine`
- referral read endpoints:
  - `GET /v1/referral/code`
  - `GET /v1/referral/stats`
  - `GET /v1/referral/tree`
  - `GET /v1/referral/earnings`

### 3.3 SDK hooks (runtime usage surface)

- connectDashboard
- balance
- transactions
- referrals
- badges

---

## 4. Ownership Boundaries

### Connect may

- aggregate read-only data;
- show user economy snapshot;
- route user to domain flows;
- display balances, transactions, badges, referrals;
- later display vouchers read-only.

### Connect must not

- write Points;
- mutate voucher status;
- claim voucher;
- redeem voucher;
- own referral graph;
- calculate rewards as source of truth;
- own Mission progress;
- own token/NFT/on-chain state;
- become connect-service.

---

## 5. Connect Dashboard Lock

Lock decisions:

- `GET /v1/points/connect-dashboard` is read-model only.
- Endpoint lives in Points Service.
- Endpoint must not become hidden Connect backend owner.

It may aggregate:

- balance
- recent transactions
- referral summary
- badges summary

It must not:

- write ledger
- decide rewards
- mutate referrals
- mutate vouchers
- evaluate Missions
- own business rules of other domains

---

## 6. Current User Economy Snapshot

Current snapshot includes:

- Points balance
- recent transactions
- referral summary
- badges summary

Current snapshot does NOT include:

- vouchers
- RF offers
- live voucher status
- Missions progress
- token/G2A/NFT state

---

## 7. Voucher Visibility Lock

Главный текущий gap:

- voucher visibility отсутствует в current Connect snapshot.

Future rule (read-only only):

- Connect may display user vouchers read-only, but:
  - RF/voucher layer remains lifecycle owner;
  - Connect must not claim;
  - Connect must not redeem;
  - Connect must not change status;
  - Connect must not infer status from local/demo state;
  - Connect reads from RF/voucher read endpoint or dedicated read-model only.

Этот пункт относится к будущему slice:

- `Connect-003: Voucher Visibility Integration (read-only)`.

---

## 8. Referral Boundary

Lock decisions:

- Referral Service owns referral graph and earnings details.
- Connect may show referral summary and link to details.
- Connect must not create referral relations.
- Connect must not calculate referral rewards in UI as truth.

---

## 9. Badges / Levels / Missions Boundary

Lock decisions:

- Badges current off-chain runtime may be displayed.
- Levels are display/UX layer unless explicitly backed by Points/Badges contract.
- Missions section remains future/placeholder in current Connect runtime.
- Connect must not create Missions runtime.
- Connect must not treat placeholder UI as backend truth.

---

## 10. Activity Boundary

Lock decisions:

- Current activity = Points transactions / `recentTransactions`.
- Cross-domain activity stream is not current runtime baseline.
- Future activity aggregation must remain read-only.
- No new event bus/service in this pass.

---

## 11. Runtime vs Future Matrix

| Area | Current runtime? | Owner | Connect role | Lock decision |
| --- | --- | --- | --- | --- |
| points balance | Yes | Points Service | Read display | Connect reads only |
| transactions | Yes | Points Service | Read display/list | Connect reads only |
| badges | Yes (off-chain) | Points Service (current runtime placement) | Read display | No NFT/on-chain inference |
| referrals | Yes | Referral Service | Read summary/drilldown routing | Connect does not own graph |
| vouchers | No (in Connect snapshot) | RF/voucher layer | Future read-only display | Connect-003, no lifecycle ownership |
| RF offers | No (in Connect snapshot) | RF Service | Optional future read composition | No RF ownership in Connect |
| Missions | No (Connect runtime truth) | Future Missions layer | Placeholder only | No Mission runtime ownership |
| Levels | No backend truth | N/A (future contract needed) | UI placeholder | Not treated as runtime truth |
| Analytics | No backend truth | N/A (future contract needed) | UI placeholder | Not treated as runtime truth |
| Token/G2A/NFT | No current runtime | Future token/NFT layers | Future-only placeholder | No fake economy ownership |
| Activity stream (cross-domain) | No unified runtime stream | Multiple domain owners | Future read-only aggregation | No new service in this pass |

---

## 12. Allowed Next Slices

- **Connect-002: User Economy Read-Model Baseline**  
  Scope: зафиксировать минимальный canonical snapshot contract для Connect read layer.  
  Non-goals: no writes, no service creation.

- **Connect-003: Voucher Visibility Integration (read-only)**  
  Scope: добавить read-only voucher visibility в Connect snapshot через RF-owned read contract.  
  Non-goals: no claim/redeem/status mutation.

- **Connect-004: Activity Stream Baseline**  
  Scope: зафиксировать bounded read-only activity aggregation model.  
  Non-goals: no event bus, no new backend owner.

- **Connect-005: Reward Display Baseline**  
  Scope: согласовать display contract для Points/Badges/Referrals/Voucher visibility.  
  Non-goals: no reward calculation engine, no tokenomics implementation.

---

## 13. Open Questions

- Какой минимальный canonical snapshot обязателен для Connect v1?
- Где фиксировать RF voucher read contract: отдельный Connect contract или междоменный RF↔Connect?
- Какой баланс между referral summary и drilldown в dashboard baseline?
- Как формально маркировать future placeholders, чтобы их не воспринимали как runtime truth?
- Нужен ли отдельный Connect BFF когда-нибудь, или достаточно bounded read-model в Points Service?

---

## 14. Non-Goals

- no code changes;
- no API changes;
- no DB migrations;
- no UI rewrite;
- no new Connect Service;
- no Points writes from Connect;
- no voucher lifecycle ownership;
- no reward calculation ownership in Connect;
- no Missions implementation;
- no token/NFT implementation.

Status update:

- Connect-002 snapshot defined in `docs/architecture/connect/connect_user_economy_snapshot_v1.md`.

