# RF PRO Linked Partners Baseline v1

## Status

Stage 5.1 implemented / partial.

The first live PRO layer is limited to partner links backed by `rf_pro_link`. It gives PRO users visibility into partners they are linked with, without introducing economics, claim attribution, redeem attribution or partner-owner permissions.

## Scope

- PRO linked partners through `rf_pro_link`.
- Read access through `listProLinks`.
- Low-level link request through `createProLink`.
- No attribution to claim or redeem.
- No merchant owner accept UI in this slice.

## Data Sources

- `listProLinks`
- `createProLink`
- `rf_pro_link`
- Existing RF partner list only for optional display labels when partner data is already available.

## UI

- `/rf/pro`
- Linked partners block: "Связи с партнёрами".
- The block shows `partnerId`, `status`, `roleScope`, `createdAt` and `updatedAt`.
- If existing partner display data is available, the block shows the partner name and location.
- If partner display data is unavailable, the block keeps `partnerId` visible and says partner details will be connected later.
- Link request form uses `partnerId` and `roleScope`; catalog-based partner selection is a later enhancement.

## Boundaries

- Linked partner is not the same as owned partner.
- Owner / Merchant means the user owns the RF partner, creates offers and redeems vouchers through merchant flows.
- PRO linked partner means the PRO works with the partner, but does not own it.
- PRO cannot create offers in this stage.
- PRO cannot redeem vouchers in this stage.
- PRO rewards are not included.
- Partner owner confirmation for pending links remains a separate implementation slice.

## Not Included

- Claim attribution.
- Redeem attribution.
- Commissions.
- Payouts.
- Points rewards.
- G2A.
- NFT / Totem.
- Connect changes.
- Partner revenue analytics.
- Merchant financial analytics.

## Next Step

- Stage 5.2 - linked partner offers visibility baseline.
- Or merchant owner accept flow for pending PRO links.
