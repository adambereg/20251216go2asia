# Connect x RF Economic Projection Audit v1

Status: read-only audit / sequencing pass before Connect Integration / Economic Projection.  
Date: 2026-05-05.  
Scope lock: no PRO attribution, no commissions, no payouts, no token withdrawals, no NFT / Totem logic, no new wallet economy.

## 1. Executive Summary

Connect is ready for a bounded RF projection implementation, but only as a read-only user economy surface. The current code already has a live Connect dashboard, live wallet/transactions, live referrals, live badges, and one RF voucher summary card that reads RF-owned summary data through `useRfVoucherSummary`.

Available RF data is enough for a first implementation slice without new economics:

- voucher summary counts via `GET /v1/rf/me/vouchers/summary`;
- current user voucher list via `GET /v1/rf/me/vouchers`;
- voucher status and canonical status;
- claimed/redeemed timestamps;
- offer and partner display fields on wallet-facing voucher DTOs;
- listing context for listing-scoped vouchers;
- RF-owned redemption ledger in backend storage, but not exposed as a user-facing list endpoint.

The safe first scope is a Connect projection, not a wallet/rewards expansion: improve RF voucher visibility on dashboard, add a read-only "My RF vouchers" projection, and prepare a clearly labelled activity/timeline surface without calculating money, commissions, payouts, rewards, token balances, NFT unlocks or PRO attribution.

Strict forbidden scope for the implementation stage: PRO attribution, PRO rewards, commissions, payouts, G2A token balances, NFT / Totem unlocks, on-chain actions, partner revenue analytics, merchant operational analytics and fake wallet transactions.

## 2. Current Connect Surface

| Page / component | Source data | Status | Notes |
| --- | --- | --- | --- |
| `app/(authenticated)/connect/page.tsx` / `DashboardView` | `useGetConnectDashboard` -> `/v1/points/connect-dashboard` | live | Dashboard reads Points-owned read model: balance, recent transactions, referrals summary, badges summary. |
| `DashboardContent` | Connect dashboard response + `VoucherSummaryCard` | partial | RF summary is composed in frontend as a separate RF-owned call, not part of the Points dashboard payload. |
| `VoucherSummaryCard` | `useRfVoucherSummary` -> `/v1/rf/me/vouchers/summary` | live/partial | Live RF counts: total, active, used, cancelled. No full voucher list here. |
| `BalanceCards` | Dashboard balance + `/v1/wallet/summary` via `customInstance` | live/partial | Shows Points structure. This must not be mixed with RF voucher value or payouts. |
| `ActivityFeed` | Connect dashboard `recentTransactions` | live/partial | Can display `rf_voucher_claimed` / `rf_voucher_redeemed` labels if such Points transactions exist, but RF service is not currently a confirmed producer of Points events. |
| `/connect/wallet` / `WalletView` | `useGetBalance`, `useGetTransactions`, `/v1/wallet/summary` | live/partial | Points wallet and transaction history. It should not receive fake RF transactions. |
| `TransactionList` | Points transactions | live/partial | Has labels for RF actions, but RF economic projection should not fabricate transactions. |
| `/connect/referrals` / `ReferralsView` | referral SDK hooks | live | Uses referral code, stats, tree and earnings endpoints. Not part of RF projection v1. |
| `/connect/levels` / `LevelsView` | badges SDK hooks | live/partial | Shows off-chain badges and "levels in development". No NFT/on-chain state. |
| `/connect/missions` / `MissionsView` | static guidance | soon | Placeholder/future copy; no mission backend. |
| `/connect/analytics` / `AnalyticsView` | static guidance | soon | Placeholder/future copy; no aggregate backend. |
| `components/connect/mockData.ts` and mock views | local mock data | mock/legacy | Still exported from `components/connect/index.ts`; should not be used for RF economic projection. |
| `BridgeModal`, `NFTTab`, `G2ATab` | UI/mock/future concepts | mock/legacy | Out of scope for RF projection; do not wire token/NFT/on-chain mechanics. |
| `app/(public)/connect` | none found | missing | Connect currently appears under authenticated routes only. |

## 3. Current RF Visibility in Connect

Current RF visibility is concentrated in one dashboard card:

- `components/connect/Dashboard/VoucherSummaryCard.tsx` imports `useRfVoucherSummary` from `@go2asia/sdk/rf`.
- The card displays `totalVouchers`, `activeVouchers`, `usedVouchers`, `cancelledVouchers`.
- The card links to `/rf` with "Найти ваучеры".
- It does not show voucher details, local saved offers, listing context, partner/offer names or redemption history.

Other Connect surfaces have RF-adjacent labels but not RF lifecycle data:

- `ActivityFeed` and `TransactionList` know labels for `rf_voucher_claimed` and `rf_voucher_redeemed`.
- `connectDashboard.ts` and `transactions.ts` include those action enum values.
- This is not enough to assume RF projection is already in Points ledger. A timeline must not invent RF transactions unless they come from a real endpoint/read model.

There is no observed duplicate live RF summary card in multiple Connect places. The current live RF visibility is dashboard-only.

## 4. Available RF Economic Signals

| Signal | Source | Available now | Safe to show in Connect | Notes |
| --- | --- | --- | --- | --- |
| Total vouchers | `GET /v1/rf/me/vouchers/summary` | yes | yes | Already displayed in `VoucherSummaryCard`. |
| Active RF vouchers | `GET /v1/rf/me/vouchers/summary` | yes | yes | Based on RF-owned status/canonical logic; Connect must not infer locally. |
| Used RF vouchers | `GET /v1/rf/me/vouchers/summary` | yes | yes | Safe summary metric. |
| Cancelled RF vouchers | `GET /v1/rf/me/vouchers/summary` | yes | yes | Safe summary metric. |
| Claimed vouchers list | `GET /v1/rf/me/vouchers` / `fetchMyVouchers` | yes | yes | Read-only list is safe if clearly separated from local saved offers. |
| Redeemed vouchers list | `GET /v1/rf/me/vouchers` / `fetchMyVouchers` | yes | yes | Filter by RF-provided status/canonicalStatus only. |
| Canonical status | `RfVoucherDto.canonicalStatus` | yes | yes | Display-only. Connect must not define new status semantics. |
| Legacy status | `RfVoucherDto.status` | yes | yes | Product copy may map to active/used, but runtime truth remains RF-owned. |
| `redeemedAt` | `RfVoucherDto.redeemedAt` | yes | yes | Safe for used voucher cards/timeline. |
| `statusChangedAt` | `RfVoucherDto.statusChangedAt` | yes | yes | Safe as "status updated" timestamp. |
| Claim timestamp | `RfVoucherDto.claimedAt` | yes | yes | Safe for "received" chronology. |
| Offer title / benefit / terms | `RfVoucherDto.offer` | partial | yes | Present on wallet-facing DTO, but may be fallback/minimal. Do not overpromise terms/limits. |
| Partner title / geo labels | `RfVoucherDto.partner` | partial | yes | Present as display fields; use as labels only. |
| Listing context | `RfVoucherDto.listingContext` | yes for listing-scoped vouchers | yes | Safe to show as source/context, not as Rielt analytics. |
| Redemption ledger rows | `rf_voucher_redemption` | backend yes, user API no | no for v1 list | Needs RF-owned read endpoint if Connect must show attempt-level history. |
| Idempotency key / correlation id | `rf_voucher_redemption` | backend yes, user API no | no | Operational/audit fields, not user economy projection v1. |
| Local saved RF opportunities | RF localStorage hooks/state | yes in RF frontend | partial | Can be shown only as local saved opportunities, not server vouchers or economic value. |
| RF points/rewards value | Points ledger / future policy | partial/unclear | no | Do not calculate rewards or value from vouchers. |
| PRO attribution | `rf_pro_link` baseline | partial backend | no | Out of scope. |
| G2A/NFT/Totem effects | future economy docs only | no | no | Out of scope. |

What can be shown now:

- RF voucher summary card;
- active and used RF voucher sections from `fetchMyVouchers`;
- simple voucher activity chronology from voucher timestamps, explicitly labelled as RF voucher lifecycle, not Points wallet transactions;
- saved opportunities as local planning items only if UI copy makes local/server distinction obvious;
- links to `/rf`, `/rf/vouchers`, `/rf/my-vouchers`.

What requires a new endpoint:

- attempt-level redemption ledger/history;
- server-side combined "RF economic activity timeline" if it must merge claim/redeem/ledger events with pagination;
- Connect-specific RF read model if frontend composition becomes too complex.

What requires schema changes:

- staff/cashier/branch attribution;
- monetary value, savings amount, partner revenue, commissions or payout projections;
- durable server-side saved opportunities if localStorage is no longer acceptable.

What must wait for future stages:

- PRO attribution/reward policy;
- Points earning/spending from RF vouchers;
- G2A token distribution;
- NFT / Totem unlocks;
- payouts or partner revenue analytics.

## 5. Missing Data / API Gaps

- `fetchMyVoucherSummary` is enough for dashboard summary enrichment.
- `fetchMyVouchers` is needed for read-only active/used voucher projection.
- A Connect-side read model is not required for the first implementation slice if Connect UI can compose RF SDK data directly.
- New backend endpoints are not required for v1 dashboard summary and voucher list projection.
- A new RF-owned endpoint would be justified only for redemption ledger/history, filtered/paginated RF economic activity, or a server-side timeline.
- There is no safe existing source for payout, commission, PRO reward, token balance, NFT unlock or partner revenue data.
- localStorage saved offers are available in frontend, but not as server economy data. Treat them as local planning state only.

## 6. Strict Out of Scope

Do not implement in the next stage:

- PRO attribution.
- PRO rewards.
- Commissions.
- Payouts.
- G2A token balances.
- Token withdrawals.
- NFT unlocks.
- Totem logic.
- On-chain actions.
- Partner revenue analytics.
- Merchant operational analytics.
- Fake wallet transactions.
- Fake RF rewards.
- Synthetic Points ledger entries for RF events.
- Any Connect mutation of RF voucher status.
- Any Connect claim/redeem action.

## 7. Recommended Projection v1 Scope

Recommended bounded model:

- RF Voucher Summary Card: keep RF-owned summary and improve placement/copy if needed.
- Active RF vouchers: read from `fetchMyVouchers`, filter by RF-provided status/canonicalStatus.
- Used RF vouchers: read from `fetchMyVouchers`, show `redeemedAt`, partner, offer, listing context if available.
- Saved RF opportunities: link to `/rf/my-vouchers`; optionally show local saved count only if copy says "local, not vouchers".
- Economic activity timeline: v1 should be a read-only placeholder or a voucher lifecycle list derived from RF voucher timestamps, not wallet transactions.
- Future rewards / points block: show as `soon`, with explicit "no rewards calculated yet".
- Links: `/rf`, `/rf/vouchers`, `/rf/my-vouchers`.

Do not calculate money, discounts saved, reward value, payout value or token value.

## 8. Recommended UI Placement

### Dashboard

Best first placement. It already has `VoucherSummaryCard`, Points snapshot, referrals and badges. Start here with summary enrichment and links.

Recommended dashboard blocks:

- "RF ваучеры" summary card;
- "Активные ваучеры" compact list;
- "Использованные ваучеры" compact list or count/link;
- "Будущие rewards/points" soon note.

### Wallet

Use carefully. Wallet currently means Points and transactions. RF vouchers can be referenced as read-only activity context, but should not appear as balance, currency or spendable value.

Recommended wallet placement:

- link/card to RF voucher activity;
- no fake Points transactions;
- no token/NFT tabs for RF projection.

### Activity

There is no dedicated Connect activity route. The current dashboard `ActivityFeed` and wallet `TransactionList` are Points-based. For RF projection v1, prefer a separate RF lifecycle list/card instead of injecting fake wallet transactions.

### Profile

Not recommended for v1. RF projection is economic/dashboard-facing, not profile identity.

### Dedicated RF economy card

Recommended as the safest unit: one card on dashboard plus a drilldown section in Connect or link to `/rf/my-vouchers`. It keeps RF lifecycle ownership visible and avoids mixing vouchers with wallet balances.

## 9. Implementation Sequencing

### Slice 1 — Dashboard RF summary enrichment

Goal: improve existing `VoucherSummaryCard` without new endpoints.

Expected outcome:

- clearer RF voucher summary;
- links to `/rf/vouchers` and `/rf/my-vouchers`;
- explicit note that vouchers are RF-owned and not wallet balance.

Touched areas:

- `components/connect/Dashboard/VoucherSummaryCard.tsx`;
- possibly `DashboardContent.tsx`.

Backend changes:

- none.

### Slice 2 — My RF vouchers projection

Goal: show read-only active/used voucher lists in Connect using existing `fetchMyVouchers`.

Expected outcome:

- active RF vouchers list;
- used RF vouchers list;
- partner/offer/listing context when present;
- no claim/redeem actions in Connect.

Touched areas:

- new Connect RF projection component;
- dashboard or wallet placement;
- existing RF SDK.

Backend changes:

- none for v1.

### Slice 3 — Economic activity timeline placeholder/read-model

Goal: prepare a safe timeline without fake transactions.

Expected outcome:

- v1 placeholder or RF voucher lifecycle timeline derived from voucher timestamps;
- explicit "Points/rewards projection soon";
- no writes and no ledger fabrication.

Touched areas:

- dashboard activity section or a dedicated RF economy card.

Backend changes:

- none for placeholder;
- future RF-owned timeline endpoint only if attempt-level redemption history becomes required.

## 10. Risks

- Confusion with wallet balance: users may interpret vouchers as Points value or spendable currency.
- Confusion with points: RF voucher claim/redeem is not currently a confirmed Points earning/spending event.
- Fake rewards: old mock data includes RF-like rewards and G2A/NFT concepts; do not reuse them.
- localStorage vs server vouchers: saved offers are local planning state, not server-issued vouchers.
- PRO attribution leakage: `rf_pro_link` exists, but attribution/rewards must not enter this stage.
- Points transaction leakage: action labels for RF events exist, but UI must not create or imply ledger events unless backend returns them.
- Over-coupling: adding RF data into `/v1/points/connect-dashboard` would couple Points dashboard to RF; frontend composition is safer for v1.
- Privacy/ownership: Connect must display only current user's RF data from authenticated RF endpoints.

## 11. Final Recommendation

Connect Integration / Economic Projection can start now, but only as read-only frontend composition over existing RF SDK endpoints.

Start with Slice 1: Dashboard RF summary enrichment. It needs no backend changes and builds on the existing `VoucherSummaryCard` / `useRfVoucherSummary` integration.

Then implement Slice 2: My RF vouchers projection using `fetchMyVouchers`. This also needs no backend changes if the UI accepts the current RF voucher DTO shape.

Backend changes are not required for the first implementation pass. A new RF-owned endpoint should be considered later only for paginated redemption ledger/history or a server-side RF activity timeline.
