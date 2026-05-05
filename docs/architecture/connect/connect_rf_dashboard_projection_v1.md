# Connect RF Dashboard Projection v1

Status: implemented as a bounded read-only dashboard enrichment for Connect x RF Stage 4.1.

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
