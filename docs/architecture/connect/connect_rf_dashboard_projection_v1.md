# Connect RF Dashboard Projection v1

Status: implemented as bounded read-only dashboard enrichment for Connect x RF Stage 4.1, Stage 4.2 and Stage 4.3.

## Status

Connect dashboard now shows RF voucher state as a read-only projection:

- RF voucher summary counts: total, active, used, cancelled;
- loading, empty and soft error states;
- compact active RF voucher list, limited to three items;
- compact used RF voucher list, limited to three items;
- links to RF discovery and the user's RF voucher page.

The projection does not create, claim, redeem, mutate, reward or monetize vouchers.

## Scope

Only read-only RF projection on the authenticated Connect dashboard.

The UI copy explicitly separates RF vouchers from Connect wallet balance and keeps RF lifecycle ownership in RF Asia.

## Not Included

- payouts;
- commissions;
- PRO attribution;
- PRO rewards;
- wallet balance integration;
- Points rewards;
- G2A token logic;
- token withdrawals;
- NFT / Totem logic;
- fake wallet transactions;
- claim or redeem actions inside Connect.

## Data Sources

- `useRfVoucherSummary` for RF-owned summary counts;
- `fetchMyVouchers` for the user's RF voucher list;
- RF-provided voucher fields: `status`, `canonicalStatus`, `claimedAt`, `redeemedAt`, `statusChangedAt`, `offer`, `partner`.

No new backend endpoint, schema change, OpenAPI change, SDK generation or wallet read-model was added.

## UI Placement

The projection lives in the Connect dashboard inside `VoucherSummaryCard`.

It is intentionally separate from Points balance cards and Connect wallet transaction history.

## Next Step

Recommended next slice: My RF vouchers projection / activity timeline placeholder.

This should remain read-only unless a future RF-owned endpoint is introduced for paginated voucher lifecycle history.

## Stage 4.2 — My RF Vouchers Projection / Activity Timeline Placeholder

Stage 4.2 adds a separate Connect dashboard panel for the user's RF vouchers.

Added:

- active RF vouchers list, limited to five items;
- used RF vouchers list, limited to five items;
- compact cancelled / expired / other status note;
- lifecycle activity derived only from voucher timestamps: `claimedAt`, `redeemedAt`, `statusChangedAt`;
- empty, loading and soft error states;
- links to `/rf/my-vouchers` and `/rf/vouchers`.

Still read-only:

- Connect shows RF state but does not mutate vouchers;
- no claim action inside Connect;
- no redeem action inside Connect;
- no wallet transaction synthesis;
- no reward, payout, commission or PRO attribution logic.

Not included:

- backend endpoints;
- schema changes;
- OpenAPI changes;
- SDK generation;
- wallet balance integration;
- Points rewards;
- PRO attribution;
- partner revenue analytics;
- merchant analytics;
- G2A token, NFT or Totem mechanics.

Data sources:

- `fetchMyVouchers`;
- shared projection helpers in `apps/go2asia-pwa-shell/lib/connectRfProjection.ts`;
- RF-owned voucher fields: `status`, `canonicalStatus`, `claimedAt`, `redeemedAt`, `statusChangedAt`, `offer`, `partner`, `listingContext`.

Future backend endpoint:

- not required for Stage 4.2;
- may become useful only for a paginated RF-owned activity timeline or redemption ledger history.

## Stage 4.3 — Economic Meaning Layer

Stage 4.3 adds a compact semantic layer above the existing RF data.

Added:

- pure helper `buildRfEconomicMeaning(vouchers, summary)`;
- dashboard card "Ваш RF-прогресс";
- short state explanation;
- two to three product guidance bullets;
- safe CTAs to `/rf/my-vouchers` and `/rf/vouchers`;
- "Что будет дальше" soon note.

This is semantic/read-only only:

- Connect interprets already available RF state;
- Connect does not create, claim, redeem, cancel or mutate vouchers;
- Connect does not calculate money, savings, payouts, commissions or token value;
- Connect does not create wallet transactions;
- Connect does not attach PRO attribution.

Supported states:

- no RF vouchers: user has not started using RF offers yet;
- active-only: user has active RF opportunities but no used vouchers;
- used: user has used RF offers and can review that lifecycle;
- inactive-only: user has only cancelled, expired or other inactive statuses;
- mixed: user has already used RF and still has active opportunities.

Not included:

- backend endpoints;
- schema changes;
- OpenAPI changes;
- SDK generation;
- wallet balance integration;
- Points rewards;
- PRO rewards or attribution;
- commissions;
- payouts;
- G2A token logic;
- NFT / Totem mechanics;
- merchant or partner revenue analytics.

Next stage:

- Connect UX Closure: reduce repetition, tune layout density, and keep RF meaning, RF voucher state and Points wallet clearly separated.
